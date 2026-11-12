// ============================================================================
// THE VOICE LAYER (conversation engine step 1, 12 Nov 2026): silence by what the child is
// doing (src/voice-tutor/silence.js), thinking aloud never ends the turn (utteranceGate),
// the end of speech counts the service's words too (speechEnd.heard), and the practice
// listeners become one listening session for the lesson (providers/listener.js).
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newWait, handOver, activity, probed, nextProbe, cleanProbe, SILENCE, PROBE_KINDS } from '../src/voice-tutor/silence.js';
import { utteranceGate, utteranceDecision, HOLD_MS } from '../src/voice-tutor/childVoice.js';
import { speechEnd } from '../src/voice-tutor/providers/voice.js';
import { loopListener } from '../src/voice-tutor/providers/listener.js';
import { fakeStt } from '../src/voice-tutor/providers/mockVoice.js';

// Walk the clock in half-second steps (as the page's timer does), probing as the page does; returns [ms, kind] pairs.
const run = (w, from, to, { onProbe = null } = {}) => {
  const got = [];
  for (let t = from; t <= to; t += 500) {
    const p = nextProbe(w, t);
    if (p) { got.push([t, p.kind]); w = probed(w); if (onProbe) w = onProbe(w, t); }
  }
  return { got, w };
};

test('answering: a nudge at about 6 s, a smaller question at about 15 s, then quiet listening (never a loop)', () => {
  const w = handOver(null, { doing: 'answer', now: 0 });
  assert.equal(nextProbe(w, 5500), null);
  assert.equal(nextProbe(w, 6000).kind, 'answer_nudge');
  // Each probe is a turn that hands over again a few seconds later; the wait carries on across it.
  const { got } = run(w, 0, 120000, { onProbe: (x, t) => handOver(x, { doing: 'answer', probe: true, now: t + 3000 }) });
  assert.deepEqual(got.map((g) => g[1]), ['answer_nudge', 'answer_smaller'], 'two probes, then HOREB waits and keeps listening');
  assert.equal(got[0][0], 6000);
  assert.ok(got[1][0] >= 15000 && got[1][0] - got[0][0] >= 9000, `the smaller question at ${got[1][0]} ms`);
});

test('a probe\'s own hand-over never starts the count again; only the child does', () => {
  let w = handOver(null, { doing: 'answer', now: 0 });
  w = probed(w);
  w = handOver(w, { doing: 'answer', probe: true, now: 9000 });
  assert.equal(w.since, 0);
  assert.equal(w.probes, 1);
  // A real turn (the child answered, HOREB replied) starts a new wait.
  assert.equal(handOver(w, { doing: 'answer', now: 20000 }).probes, 0);
  // Speech, ink or typing: the wait starts again from now.
  const a = activity(w, 12000);
  assert.deepEqual([a.since, a.probes], [12000, 0]);
  assert.equal(nextProbe(a, 17500), null);
  assert.equal(nextProbe(a, 18000).kind, 'answer_nudge');
});

test('a board task: quiet while the child works, one check-in after about 45 s of nothing', () => {
  const w = handOver(null, { doing: 'task', now: 0 });
  assert.equal(nextProbe(w, 44500), null);
  assert.equal(nextProbe(w, 45000).kind, 'task_checkin');
  const { got } = run(w, 0, 300000, { onProbe: (x, t) => handOver(x, { doing: 'task', probe: true, now: t + 3000 }) });
  assert.deepEqual(got.map((g) => g[1]), ['task_checkin'], 'one check-in, never more');
  // Writing resets it: 40 s of writing, then 44 s quiet, is still no check-in.
  const wrote = activity(w, 40000);
  assert.equal(nextProbe(wrote, 84000), null);
  assert.equal(nextProbe(wrote, 85000).kind, 'task_checkin');
});

test('free talk is like answering, but gentler and later', () => {
  const w = handOver(null, { doing: 'talk', now: 0 });
  assert.equal(nextProbe(w, 11500), null);
  assert.equal(nextProbe(w, SILENCE.talk.firstMs).kind, 'talk_nudge');
  const { got } = run(w, 0, 200000, { onProbe: (x, t) => handOver(x, { doing: 'talk', probe: true, now: t + 3000 }) });
  assert.deepEqual(got.map((g) => g[1]), ['talk_nudge', 'talk_again']);
  assert.ok(got[1][0] >= SILENCE.talk.secondTotalMs);
});

test('a probe as the server takes it: a known kind and whole seconds, anything else is no probe', () => {
  assert.deepEqual(PROBE_KINDS, ['answer_nudge', 'answer_smaller', 'task_checkin', 'talk_nudge', 'talk_again']);
  assert.deepEqual(cleanProbe({ kind: 'answer_nudge', silent_s: 6.4, extra: 'x' }), { kind: 'answer_nudge', silent_s: 6 });
  assert.deepEqual(cleanProbe({ kind: 'task_checkin', silent_s: 99999 }), { kind: 'task_checkin', silent_s: 600 });
  assert.equal(cleanProbe({ kind: 'shout' }), null);
  assert.equal(cleanProbe('answer_nudge'), null);
  assert.equal(newWait('nonsense').doing, 'answer');
});

test('thinking aloud never ends the turn: fillers and half sentences are held, then joined to what follows', () => {
  assert.equal(utteranceDecision(''), 'drop');
  assert.equal(utteranceDecision('umm'), 'hold');
  assert.equal(utteranceDecision('so...'), 'hold');
  assert.equal(utteranceDecision('it is three and'), 'hold');
  assert.equal(utteranceDecision('three quarters'), 'send');
  assert.equal(utteranceDecision('because the bottom doubled'), 'send');
  const q = []; const sent = []; const dropped = [];
  const gate = utteranceGate({ onSend: (t, s) => sent.push([t, s]), onDrop: (t) => dropped.push(t), schedule: (fn, ms) => { q.push({ fn, ms }); return q.length; }, cancel: (id) => { q[id - 1] = null; } });
  assert.equal(gate.final('umm so it is', 2), 'hold');
  assert.equal(sent.length, 0);
  gate.speech();   // the child speaks again: the held words wait
  assert.equal(gate.final('two quarters', 1.5), 'send');
  assert.deepEqual(sent, [['umm so it is two quarters', 3.5]]);
  // A half sentence and then nothing: it is sent as it is, after HOLD_MS.
  gate.final('it is the same because', 2);
  const t = q.filter(Boolean).at(-1);
  assert.equal(t.ms, HOLD_MS);
  t.fn();
  assert.equal(sent.at(-1)[0], 'it is the same because');
  // Fillers alone and then nothing: dropped, nothing is marked.
  gate.final('hmm', 1);
  q.filter(Boolean).at(-1).fn();
  assert.deepEqual(dropped, ['hmm']);
});

test('the end of speech counts the words the service heard, however quiet the microphone', () => {
  const vad = speechEnd({ silenceMs: 2000 });
  // Every frame under the loudness gate: on loudness alone it never starts.
  for (let i = 0; i < 20; i += 1) assert.equal(vad.feed(0.005, 128), null);
  assert.equal(vad.heard(), 'speech', 'the service heard words: the child is speaking');
  let end = null; let ms = 0;
  while (!end && ms < 10000) { end = vad.feed(0.005, 128); ms += 128; }
  assert.equal(end, 'end');
  assert.ok(ms >= 2000 && ms < 2300, `ended after ${ms} ms of quiet`);
  // A word heard again keeps it going.
  vad.heard(); vad.feed(0.005, 1500); vad.heard();
  assert.equal(vad.feed(0.005, 1500), null);
});

test('one listening session for the lesson: the practice listener listens again at once, and hears the demo child over HOREB', async () => {
  const q = [];
  const timers = { schedule: (fn, ms) => { q.push({ fn, ms }); return q.length; }, cancel: (id) => { q[id - 1] = null; } };
  const flush = () => { for (let n = 0; n < 50; n += 1) { const i = q.findIndex(Boolean); if (i < 0) return; const x = q[i]; q[i] = null; x.fn(); } };
  const stt = loopListener(fakeStt(timers), timers);
  const got = []; let barged = 0; let starts = 0;
  const L = stt.open({ onUtterance: (t) => got.push(t), onBargeIn: () => { barged += 1; }, onSpeech: () => { starts += 1; } });
  L.setMode('child');
  assert.equal(L.mode, 'child');
  L.say('three quarters');
  flush();
  assert.deepEqual(got, ['three quarters']);
  // Over HOREB: a barge-in first, then the words.
  L.setMode('tutor');
  L.say('wait show me again');
  flush();
  assert.equal(barged, 1);
  assert.deepEqual(got, ['three quarters', 'wait show me again']);
  // Muted: nothing is heard.
  L.setMode('off');
  L.say('hello');
  flush();
  assert.equal(got.length, 2);
  L.close();
});
