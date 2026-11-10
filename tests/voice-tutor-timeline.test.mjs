// ============================================================================
// THE TIMELINE: strokes fire at their word, and an interruption stops the rest.
// src/voice-tutor/timeline.js, with the speech clock passed in.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speakingTimes, findAnchor, buildTimeline, createPlayer, advance, interrupt, SENTENCE_GAP_MS } from '../src/voice-tutor/timeline.js';

// A fixed speech clock: every word 100 ms, no pauses. Milestone 3's voice
// returns real word times in this same shape.
const fixed = (text) => {
  const words = text.split(/\s+/).filter(Boolean).map((word, i) => ({ word, start: i * 100, end: i * 100 + 90 }));
  return { words, duration: words.length * 100 };
};

const TURN = [
  { cmd: 'set_phase', phase: 'teach' },
  { cmd: 'say', text: 'Here is the bar cut into four.' },                                         // words 0..6
  { cmd: 'fraction_bar', id: 'bar1', parts: 4, shaded: 0, slot: 'top', on: 'four' },            // 'four.' is word 6 -> 600
  { cmd: 'say', text: 'Shade three quarters of it.' },                                             // starts 700 + gap
  { cmd: 'highlight', target: 'bar1', part: 3, style: 'glow', on: 'three quarters', delay_ms: 200 },
  { cmd: 'write_text', id: 'w', text: 'three quarters', slot: 'middle' },                          // no `on`: after the sentence
  { cmd: 'underline', target: 'w', on: 'never said' },                                            // missed: sentence start
  { cmd: 'record_diagnosis', skill: 's', misconception: 'other', confidence: 'low', evidence: 'x', next: 'probe' },
  { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 },
];

test('speaking pace: words in order, longer words take longer, a full stop adds a pause', () => {
  const t = speakingTimes('Hi, extraordinary fractions. Yes');
  assert.equal(t.words.length, 4);
  for (let i = 1; i < 4; i++) assert.ok(t.words[i].start > t.words[i - 1].start);
  const len = (w) => w.end - w.start;
  assert.ok(len(t.words[1]) > len(t.words[0]));
  assert.ok(t.words[3].start - t.words[2].end > t.words[1].start - t.words[0].end - 1);
  assert.ok(t.duration >= t.words[3].end);
});

test('an anchor is found by its words, ignoring case and punctuation', () => {
  const { words } = fixed('Shade THREE quarters, please.');
  assert.equal(findAnchor(words, 'three quarters').index, 1);
  assert.equal(findAnchor(words, 'please').start, 300);
  assert.equal(findAnchor(words, 'four'), null);
});

test('each stroke starts at its word (plus delay); no word means after the sentence; a missed word means the sentence start', () => {
  const tl = buildTimeline(TURN, { speech: fixed });
  const at = Object.fromEntries(tl.events.map((e) => [TURN[e.i].cmd + (TURN[e.i].id || TURN[e.i].target || ''), e]));
  assert.equal(at.fraction_barbar1.t, 600);
  assert.equal(at.fraction_barbar1.anchor, 'word');
  const s2 = 700 + SENTENCE_GAP_MS;
  assert.equal(tl.sentences[1].start, s2);
  assert.equal(at.highlightbar1.t, s2 + 100 + 200);
  assert.equal(at.write_textw.t, s2 + 500);
  assert.equal(at.write_textw.anchor, 'after');
  assert.equal(at.underlinew.t, s2);
  assert.equal(at.underlinew.anchor, 'missed');
  // Silent steps are applied at once; the hand-over comes after everything.
  assert.equal(at.record_diagnosis.t, 0);
  assert.equal(at.record_diagnosis.silent, true);
  assert.equal(at.pause_for_child.t, tl.duration);
  assert.ok(tl.duration >= at.write_textw.t + at.write_textw.dur);
});

test('playing: only what is due fires, once, in order', () => {
  const tl = buildTimeline(TURN, { speech: fixed });
  const p = createPlayer(tl, 10000);
  let r = advance(p, 10000);
  assert.deepEqual(r.due.map((e) => TURN[e.i].cmd), ['set_phase', 'record_diagnosis']);
  assert.deepEqual(r.words, [1, 0]);
  r = advance(p, 10599);
  assert.equal(r.due.length, 0);
  r = advance(p, 10600);
  assert.deepEqual(r.due.map((e) => TURN[e.i].cmd), ['fraction_bar']);
  assert.equal(advance(p, 10600).due.length, 0);
  r = advance(p, 10000 + tl.duration);
  assert.equal(r.done, true);
  assert.equal(r.due[r.due.length - 1].cmd, 'pause_for_child');
});

test('interruption: strokes already due draw at once, the rest are dropped, and the tutor learns what was heard', () => {
  const tl = buildTimeline(TURN, { speech: fixed });
  const p = createPlayer(tl, 0);
  advance(p, 300);                    // only the silent steps have fired
  const r = interrupt(p, 650);        // the child speaks after "four."
  assert.deepEqual(r.due.map((e) => TURN[e.i].cmd), ['fraction_bar']);
  assert.deepEqual(r.dropped.map((e) => TURN[e.i].cmd).sort(), ['highlight', 'pause_for_child', 'underline', 'write_text']);
  assert.equal(r.heard, 'Here is the bar cut into four.');
  assert.equal(r.finished, false);
  // Stopped for good: nothing more fires.
  assert.equal(advance(p, 99999).due.length, 0);
  assert.equal(p.stopped, true);
});

test('an interruption mid-sentence reports the words heard so far; a silent step is never lost', () => {
  const steps = [{ cmd: 'say', text: 'one two three four five' }, { cmd: 'set_phase', phase: 'guided' }, { cmd: 'write_text', id: 'a', text: 'x', slot: 'top', on: 'five' }];
  const tl = buildTimeline(steps, { speech: fixed });
  const p = createPlayer(tl, 0);
  const r = interrupt(p, 250);
  assert.equal(r.heard, 'one two three');
  assert.deepEqual(r.due.map((e) => e.cmd), ['set_phase']);
  assert.deepEqual(r.dropped.map((e) => e.cmd), ['write_text']);
});
