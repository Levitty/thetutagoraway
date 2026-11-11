// ============================================================================
// MILESTONE 3, THE VOICE: providers swap behind one interface, the voice's word
// times drive the strokes (streaming: never early), barge-in stops voice and
// strokes at once, typing takes over when the microphone or voice fails, the
// caps count the voice, and voice tokens are refused to anyone off the list.
// No network: fetch, sockets and audio are fakes.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { providersFor, checkProviders, INTERFACE } from '../src/voice-tutor/providers/index.js';
import { simulatedTts, fakeStt, PARTIAL_MS, END_OF_SPEECH_MS } from '../src/voice-tutor/providers/mockVoice.js';
import { deepgramStt } from '../src/voice-tutor/providers/deepgram.js';
import { cartesiaTts } from '../src/voice-tutor/providers/cartesia.js';
import { cartesiaWords, sentenceTiming, deepgramEvent, voiceReducer, initialVoice, bargeIn, canListen, canSpeak, speechCost, listenCost, spokenChars, PRICES } from '../src/voice-tutor/providers/voice.js';
import { buildTimeline, createPlayer, advance, updateTimeline, SENTENCE_GAP_MS } from '../src/voice-tutor/timeline.js';
import { turnProblems, MAX_SPOKEN_WORDS } from '../src/voice-tutor/commands.js';
import { mintToken, TOKENS_PER_MINUTE } from '../src/voice-tutor/tokens.js';
import { runTutorTurn, WIND_DOWN } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { buildVoiceTutorFns } from '../scripts/build-voice-tutor-fn.mjs';

const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));

test('the providers swap behind one interface: scripted, live without voice, live with voice', () => {
  const fakeSupabase = { functions: { invoke: async () => ({ data: {} }) } };
  const mock = providersFor('mock');
  const plain = providersFor('remote', { supabase: fakeSupabase, voice: false });
  const voiced = providersFor('remote', { supabase: fakeSupabase, voice: true, sessionId: () => SID });
  for (const p of [mock, plain, voiced]) assert.deepEqual(checkProviders(p), []);
  assert.deepEqual([mock.tts.name, mock.stt.name, mock.tutor.name], ['simulated', 'typed-as-speech', 'scripted']);
  assert.deepEqual([plain.tts.name, plain.stt, plain.tutor.name], ['simulated', null, 'remote']);
  assert.deepEqual([voiced.tts.name, voiced.stt.name], ['cartesia', 'deepgram']);
  assert.equal(voiced.tts.hasAudio, true);
  assert.equal(mock.tts.hasAudio, false);
  // A provider missing a method is caught.
  assert.deepEqual(checkProviders({ ...mock, tts: { clock() {}, unlock() {}, stop() {} } }), ['tts.speak']);
  assert.deepEqual(Object.keys(INTERFACE), ['tutor', 'tts', 'stt']);
});

test('Cartesia word timestamps (seconds) become the timeline\'s word times (ms)', () => {
  const msgs = [
    { type: 'timestamps', word_timestamps: { words: ['Here', 'is'], start: [0.02, 0.31], end: [0.29, 0.44] } },
    { type: 'timestamps', word_timestamps: { words: ['four.'], start: [0.5], end: [0.92] } },
    { type: 'chunk', data: 'AAAA' },
  ];
  assert.deepEqual(cartesiaWords(msgs), [{ word: 'Here', start: 20, end: 290 }, { word: 'is', start: 310, end: 440 }, { word: 'four.', start: 500, end: 920 }]);
  // No word times from the voice: spread over the audio, so the board still follows the sentence.
  const t = sentenceTiming('one two three', [], 24000, 24000);
  assert.equal(t.duration, 1000);
  assert.equal(t.words.length, 3);
  assert.ok(t.words[2].start > t.words[1].start);
});

test('word times drive the strokes; while streaming, a stroke waits for its word and never fires early', () => {
  const steps = [
    { cmd: 'say', text: 'Here is the bar cut into four.' },
    { cmd: 'fraction_bar', id: 'bar', parts: 4, shaded: 0, slot: 'top', on: 'four' },
    { cmd: 'say', text: 'Shade three of them.' },
    { cmd: 'highlight', target: 'bar', part: 3, on: 'three' },
    { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 },
  ];
  // The voice so far: sentence 1 half received, sentence 2 not started.
  const timing = [
    { words: [{ word: 'Here', start: 0, end: 200 }, { word: 'is', start: 230, end: 330 }], duration: null, complete: false },
    { words: [], duration: null, complete: false },
  ];
  const speech = (_, k) => timing[k];
  let tl = buildTimeline(steps, { speech });
  const p = createPlayer(tl, 1000);
  const ev = (cmd) => p.timeline.events.find((e) => e.cmd === cmd);
  assert.equal(ev('fraction_bar').t, Infinity, 'its word has not arrived');
  assert.equal(ev('pause_for_child').t, Infinity);
  assert.deepEqual(advance(p, 99999).due.map((e) => e.cmd), [], 'nothing fires before its word is known');
  // More words arrive (Cartesia streams them ahead of the audio).
  timing[0] = { words: [...timing[0].words, { word: 'the', start: 360, end: 420 }, { word: 'bar', start: 450, end: 600 }, { word: 'cut', start: 640, end: 780 }, { word: 'into', start: 800, end: 950 }, { word: 'four.', start: 980, end: 1300 }], duration: 1400, complete: true };
  updateTimeline(p, buildTimeline(steps, { speech }));
  assert.equal(ev('fraction_bar').t, 980);
  assert.equal(advance(p, 1000 + 979).due.length, 0, 'not one millisecond early');
  assert.deepEqual(advance(p, 1000 + 980).due.map((e) => e.cmd), ['fraction_bar']);
  // Sentence 2 starts after sentence 1 plus the gap, exactly where the voice schedules it.
  timing[1] = { words: [{ word: 'Shade', start: 0, end: 300 }, { word: 'three', start: 320, end: 600 }, { word: 'of', start: 620, end: 700 }, { word: 'them.', start: 720, end: 1000 }], duration: 1050, complete: true };
  updateTimeline(p, buildTimeline(steps, { speech }));
  assert.equal(ev('highlight').t, 1400 + SENTENCE_GAP_MS + 320);
  assert.ok(readFileSync(new URL('../src/voice-tutor/providers/cartesia.js', import.meta.url), 'utf8').includes('SENTENCE_GAP_MS'), 'the voice uses the same gap');
  assert.ok(p.fired.has(1), 'what fired stays fired across rebuilds');
});

test('barge-in: the voice stops at once, due strokes are drawn, the rest dropped, the tutor hears what was heard', () => {
  let stopped = 0;
  const tts = { stop: () => { stopped += 1; } };
  const steps = [{ cmd: 'say', text: 'one two three four five' }, { cmd: 'write_text', id: 'a', text: 'x', slot: 'top', on: 'two' }, { cmd: 'write_text', id: 'b', text: 'y', slot: 'middle', on: 'five' }, { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 }];
  const fixed = (text) => ({ words: text.split(' ').map((word, i) => ({ word, start: i * 100, end: i * 100 + 90 })), duration: 500 });
  const p = createPlayer(buildTimeline(steps, { speech: fixed }), 0);
  const r = bargeIn({ player: p, tts, now: 250 });
  assert.equal(stopped, 1);
  assert.deepEqual(r.due.map((e) => steps[e.i].id), ['a']);
  assert.deepEqual(r.dropped.map((e) => e.cmd).sort(), ['pause_for_child', 'write_text']);
  assert.equal(r.heard, 'one two three');
  assert.equal(r.interrupted, true);
  assert.equal(advance(p, 9999).due.length, 0, 'nothing more is drawn');
  // Talking when HOREB is silent still stops any audio, and is not an interruption.
  const r2 = bargeIn({ player: null, tts, now: 0 });
  assert.equal(stopped, 2);
  assert.equal(r2.interrupted, false);
});

test('the free listener: typed words "spoken" with partials, then end of speech gives the final words', () => {
  const q = [];
  const stt = fakeStt({ schedule: (fn, ms) => { q.push({ fn, ms }); return q.length; }, cancel: () => {} });
  const got = { speech: 0, partials: [], final: null };
  const s = stt.start({ onSpeech: () => { got.speech += 1; }, onPartial: (t) => got.partials.push(t), onFinal: (t, sec) => { got.final = [t, sec]; } });
  s.say('three quarters please');
  assert.equal(got.speech, 1, 'speech starts at once (barge-in happens then)');
  q.sort((a, b) => a.ms - b.ms).forEach((x) => x.fn());
  assert.deepEqual(got.partials, ['three', 'three quarters', 'three quarters please']);
  assert.deepEqual(got.final, ['three quarters please', (PARTIAL_MS * 3 + END_OF_SPEECH_MS) / 1000]);
  assert.deepEqual(deepgramEvent({ type: 'Results', is_final: false, channel: { alternatives: [{ transcript: 'three' }] } }), { kind: 'partial', text: 'three' });
  assert.deepEqual(deepgramEvent({ type: 'Results', is_final: true, speech_final: true, channel: { alternatives: [{ transcript: 'three quarters' }] } }), { kind: 'final', text: 'three quarters', speechFinal: true });
  assert.deepEqual(deepgramEvent({ type: 'SpeechStarted' }), { kind: 'speech' });
  assert.deepEqual(deepgramEvent({ type: 'UtteranceEnd' }), { kind: 'end' });
});

test('when the microphone or the voice fails, the lesson carries on in text and says so plainly', async () => {
  let v = initialVoice('voice');
  assert.equal(canListen(v), true);
  v = voiceReducer(v, { type: 'fail', kind: 'mic-denied' });
  assert.equal(v.mode, 'speaker', 'HOREB still speaks; the child types');
  assert.match(v.message, /microphone is not allowed, so please type/);
  assert.equal(canListen(v), false);
  assert.equal(canSpeak(v), true);
  v = voiceReducer(v, { type: 'fail', kind: 'speak-failed' });
  assert.equal(v.mode, 'typed');
  assert.equal(canSpeak(v), false);
  assert.equal(voiceReducer(initialVoice(), { type: 'fail', kind: 'offline' }).mode, 'typed');
  assert.equal(voiceReducer(v, { type: 'retry' }).mode, 'voice');
  // Deepgram with no microphone in this "browser": an error, never a hang.
  const err = await new Promise((resolve) => deepgramStt({ getToken: async () => ({ token: 't' }) }).start({ onError: resolve, onFinal: () => resolve('final?') }));
  assert.ok(['mic-missing', 'listen-failed', 'mic-denied'].includes(err));
  // Cartesia that cannot get a token: the stream fails before any sound, so the page falls back to the silent voice.
  globalThis.window = { AudioContext: class { constructor() { this.currentTime = 0; } resume() {} } };
  const tts = cartesiaTts({ getToken: async () => { throw new Error('refused'); } });
  await assert.rejects(tts.speak(['Hello.']).ready, /refused/);
  delete globalThis.window;
  // The silent voice is always there to fall back on.
  const st = simulatedTts().speak(['Hello there.']);
  assert.ok(Number.isFinite(await st.ready));
  assert.equal(st.timing(0).complete, true);
});

test('short spoken turns: the server asks again when the tutor says too much', () => {
  const long = [{ cmd: 'say', text: Array(25).fill('word').join(' ') + '.' }, { cmd: 'say', text: Array(25).fill('more').join(' ') + '.' }, { cmd: 'say', text: Array(15).fill('and').join(' ') + '.' }, { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 }];
  assert.match(turnProblems(long, { maxWords: MAX_SPOKEN_WORDS })[0], /says 65 words: say at most 60/);
  assert.deepEqual(turnProblems(long.slice(1)), [], 'off unless asked');
});

// ---------------------------------------------------------------- caps and the cost log
const world = ({ spent = { session: 0, day: 0 } } = {}) => {
  const usage = [];
  return { usage, async getChild() { return null; }, async getProgress() { return { skills: {} }; }, async spend() { return spent; }, async recordUsage(r) { usage.push(r); }, async recordConcern() {}, async countTokens() { return usage.filter((u) => String(u.guard).startsWith('token')).length; } };
};
const SAY = { stop_reason: 'end_turn', usage: { input_tokens: 4000, output_tokens: 500 }, content: [{ type: 'text', text: JSON.stringify({ steps: [{ cmd: 'say', text: 'Good. What did you notice about the bottom numbers?' }, { cmd: 'pause_for_child', expect: 'spoken', max_wait_s: 30 }] }) }] };
const turn = (db, body) => runTutorTurn({ user: USER, settings, lib: {}, secret: 'test-secret-that-is-long-enough', db, callModel: async () => SAY, now: 1_800_000_000_000, body: { session_id: SID, turn_index: 2, board: [], history: [], ...body } });

test('the voice is priced into the cost log: the tutor\'s spoken characters and the child\'s speech', async () => {
  const db = world();
  const r = await turn(db, { voice: true, audio_in_s: 6, message: 'the bottom doubled' });
  const v = db.usage.find((u) => u.model === 'voice');
  const chars = spokenChars(r.body.steps);
  assert.equal(v.tts_chars, chars);
  assert.equal(v.audio_in_s, 6);
  assert.ok(Math.abs(v.cost_usd - (speechCost(chars) + listenCost(6))) < 1e-12);
  assert.ok(Math.abs(r.body.voice.usd - v.cost_usd) < 1e-12);
  assert.ok(r.body.cost_usd > v.cost_usd, 'model and voice together');
  // Listening is bounded: the page cannot claim an hour of speech.
  const db2 = world();
  await turn(db2, { voice: true, audio_in_s: 3600 });
  assert.equal(db2.usage.find((u) => u.model === 'voice').audio_in_s, 90);
  // No voice: nothing extra.
  const db3 = world();
  await turn(db3, { voice: false });
  assert.equal(db3.usage.filter((u) => u.model === 'voice').length, 0);
  assert.equal(PRICES.sttUsdPerMinute, 0.0077);
});

test('caps count the voice before the call: a voiced turn that would pass the cap winds down', async () => {
  let called = 0;
  const spent = { session: 1.47, day: 1.47 };
  const call = async () => { called += 1; return SAY; };
  const run = (body) => runTutorTurn({ user: USER, settings, lib: {}, secret: 'test-secret-that-is-long-enough', db: world({ spent }), callModel: call, now: 1_800_000_000_000, body: { session_id: SID, turn_index: 2, board: [], ...body } });
  const r = await run({ voice: true, audio_in_s: 90 });
  assert.equal(called, 0);
  assert.deepEqual(r.body.steps.map((s) => s.cmd), WIND_DOWN.map((s) => s.cmd));
  await run({ voice: false });
  assert.equal(called, 1, 'the same spend without voice still fits');
});

// ---------------------------------------------------------------- tokens
const tokenWorld = ({ spent = { session: 0, day: 0 }, recent = 0, broken = false } = {}) => {
  const usage = [];
  return { usage, async getChild(id) { return id === 'c1' ? { id: 'c1', parent_id: 'u-parent' } : { id, parent_id: 'other' }; }, async spend() { if (broken) throw new Error('no table'); return spent; }, async countTokens() { return recent; }, async recordUsage(r) { usage.push(r); } };
};
const fakeFetch = () => {
  const calls = [];
  const f = async (url, init) => { calls.push({ url, init }); return { ok: true, json: async () => (url.includes('deepgram') ? { access_token: 'dg-temp', expires_in: 30 } : { token: 'ca-temp' }) }; };
  f.calls = calls;
  return f;
};
const mint = (o = {}) => mintToken({ user: USER, settings, keys: { deepgram: 'dg-SECRET', cartesia: 'sk_car_SECRET' }, fetch: fakeFetch(), now: 1_800_000_000_000, db: tokenWorld(), ...o, body: { kind: 'stt', session_id: SID, ...o.body } });

test('voice tokens: refused to anyone off the allowlist, with the switch off, past the caps, or too often', async () => {
  const f = fakeFetch();
  const stranger = await mint({ user: { id: 'u2', email: 'someone@else.com' }, fetch: f });
  assert.equal(stranger.status, 403);
  assert.match(stranger.body.error, /adult test accounts only/);
  assert.equal(f.calls.length, 0, 'no vendor call for a refused caller');
  assert.equal((await mint({ user: null })).status, 401);
  assert.equal((await mint({ settings: settingsFrom(() => undefined) })).status, 403);
  assert.equal((await mint({ body: { kind: 'video' } })).status, 400);
  assert.equal((await mint({ body: { child_id: 'c9' } })).status, 403);
  assert.equal((await mint({ db: tokenWorld({ spent: { session: 1.5, day: 1.5 } }) })).status, 402);
  assert.equal((await mint({ db: tokenWorld({ recent: TOKENS_PER_MINUTE }) })).status, 429);
  assert.equal((await mint({ db: tokenWorld({ broken: true }) })).status, 503);
  assert.match((await mint({ keys: {} })).body.error, /DEEPGRAM_API_KEY is missing/);
});

test('voice tokens: minted with the key on the server; the page gets only the short-lived token', async () => {
  const f = fakeFetch();
  const db = tokenWorld();
  const stt = await mint({ fetch: f, db });
  assert.equal(stt.status, 200);
  assert.equal(stt.body.token, 'dg-temp');
  assert.match(stt.body.url, /^wss:\/\/api\.deepgram\.com\/v1\/listen\?model=nova-3/);
  assert.equal(f.calls[0].url, 'https://api.deepgram.com/v1/auth/grant');
  assert.equal(f.calls[0].init.headers.Authorization, 'Token dg-SECRET');
  assert.deepEqual(JSON.parse(f.calls[0].init.body), { ttl_seconds: 30 });
  const tts = await mint({ fetch: f, db, body: { kind: 'tts' } });
  assert.equal(tts.body.token, 'ca-temp');
  assert.equal(f.calls[1].url, 'https://api.cartesia.ai/access-token');
  assert.equal(f.calls[1].init.headers.Authorization, 'Bearer sk_car_SECRET');
  assert.deepEqual(JSON.parse(f.calls[1].init.body), { grants: { tts: true }, expires_in: 600 });
  assert.deepEqual([tts.body.model, tts.body.voice, tts.body.sample_rate], [settings.ttsModel, settings.ttsVoice, settings.ttsSampleRate]);
  assert.doesNotMatch(JSON.stringify([stt.body, tts.body]), /SECRET/);
  assert.deepEqual(db.usage.map((u) => u.guard[0]), ['token-stt', 'token-tts']);
  assert.ok(db.usage.every((u) => u.cost_usd === 0));
  // A vendor failure is a plain message, so the page can fall back to typing.
  const down = await mint({ fetch: async () => ({ ok: false, status: 500 }) });
  assert.equal(down.status, 502);
});

test('both voice edge functions in the repository are the build of this code, with no key inside', async () => {
  for (const [name, want] of Object.entries(await buildVoiceTutorFns())) {
    const have = readFileSync(new URL(`../supabase/functions/${name}/index.ts`, import.meta.url), 'utf8');
    assert.equal(have, want, `${name}: run npm run build:voice-tutor-fn`);
    assert.doesNotMatch(have, /sk_car_|sk-ant-/);
  }
});
