// ============================================================================
// MILESTONES 3 AND 3b, THE VOICE: providers swap behind one interface (practice:
// the browser's own voice and listening; live: Cartesia both ways), the voice's
// word times drive the strokes (streaming: never early, late sentences placed
// where they are heard), barge-in stops voice and strokes at once, typing takes
// over when the microphone or voice fails, the caps count the voice at
// Cartesia's published price, and voice tokens are refused to anyone off the list.
// No network: fetch, sockets and audio are fakes.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { providersFor, checkProviders, INTERFACE } from '../src/voice-tutor/providers/index.js';
import { simulatedTts, fakeStt, PARTIAL_MS, END_OF_SPEECH_MS } from '../src/voice-tutor/providers/mockVoice.js';
import { cartesiaStt } from '../src/voice-tutor/providers/cartesiaStt.js';
import { cartesiaTts } from '../src/voice-tutor/providers/cartesia.js';
import { pickVoice, rankVoices, wordAt } from '../src/voice-tutor/providers/webSpeech.js';
import { lines, readTurnStream } from '../src/voice-tutor/providers/turnStream.js';
import { createMockTutor } from '../src/voice-tutor/mockTutor.js';
import { cartesiaWords, sentenceTiming, cartesiaSttEvent, sttUrl, pcm16, speechEnd, voiceReducer, initialVoice, bargeIn, canListen, canSpeak, speechCost, listenCost, spokenChars, PRICES } from '../src/voice-tutor/providers/voice.js';
import { buildTimeline, createPlayer, advance, updateTimeline, SENTENCE_GAP_MS } from '../src/voice-tutor/timeline.js';
import { turnProblems, MAX_SPOKEN_WORDS } from '../src/voice-tutor/commands.js';
import { mintToken, TOKENS_PER_MINUTE } from '../src/voice-tutor/tokens.js';
import { runTutorTurn, WIND_DOWN } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { buildVoiceTutorFns } from '../scripts/build-voice-tutor-fn.mjs';

const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));

test('the providers swap behind one interface: practice, the self-playing demo, live with and without voice', () => {
  const fakeSupabase = { functions: { invoke: async () => ({ data: {} }) }, auth: { getSession: async () => ({ data: {} }) } };
  const practice = providersFor('mock');
  const demo = providersFor('mock', { demo: true });
  const plain = providersFor('remote', { supabase: fakeSupabase, voice: false });
  const voiced = providersFor('remote', { supabase: fakeSupabase, voice: true, sessionId: () => SID });
  for (const p of [practice, demo, plain, voiced]) assert.deepEqual(checkProviders(p), []);
  assert.deepEqual([practice.tts.name, practice.tutor.name], ['browser-voice', 'scripted']);
  assert.equal(practice.stt, null, 'no SpeechRecognition here: typing');
  assert.equal(demo.stt.name, 'typed-as-speech');
  assert.deepEqual([plain.tts.name, plain.stt, plain.tutor.name], ['simulated', null, 'remote']);
  assert.deepEqual([voiced.tts.name, voiced.stt.name], ['cartesia', 'cartesia-ink']);
  // A provider missing a method is caught.
  assert.deepEqual(checkProviders({ ...practice, tts: { clock() {}, unlock() {}, stop() {} } }), ['tts.open']);
  assert.deepEqual(Object.keys(INTERFACE), ['tutor', 'tts', 'stt']);
  assert.doesNotMatch(readFileSync(new URL('../src/voice-tutor/providers/index.js', import.meta.url), 'utf8'), /deepgram/i);
});

test('the practice voice: English (Kenya) first, then British, then other English; never a novelty voice', () => {
  const v = (name, lang, localService = true) => ({ name, lang, localService });
  assert.equal(pickVoice([v('Samantha', 'en-US'), v('Daniel', 'en-GB'), v('Zarvox', 'en-US'), v('Wairimu', 'en-KE')]).name, 'Wairimu');
  assert.equal(pickVoice([v('Samantha', 'en-US'), v('Daniel', 'en-GB'), v('Bubbles', 'en-GB')]).name, 'Daniel');
  assert.equal(pickVoice([v('Google UK English Female', 'en-GB', false), v('Serena', 'en-GB')]).name, 'Serena', 'a local voice sends word times');
  assert.equal(pickVoice([v('Zarvox', 'en-US'), v('Bad News', 'en-US'), v('Thomas', 'fr-FR')]), null, 'nothing fit: the silent board, said plainly');
  assert.equal(wordAt('Here is the bar.', 8, 3), 'the');
  assert.equal(wordAt('Here is the bar.', 12), 'bar.');
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

test('a voice stream grows a sentence at a time; a sentence that arrives late starts when it is heard', async () => {
  const tts = simulatedTts();
  const st = tts.open();
  st.add('Here is a chapati.');
  const startAt = await st.ready;
  const a = st.timing(0);
  assert.equal(a.start, 0);
  assert.equal(st.timing(1).start, null, 'not added yet: unknown');
  // Arriving long after the first has ended (the model was slow): it starts now, not in the past.
  const realNow = performance.now;
  performance.now = () => startAt + a.duration + 5000;
  st.add('Three pieces are eaten.');
  performance.now = realNow;
  const near = (x, y) => assert.ok(Math.abs(x - y) < 1e-6, `${x} vs ${y}`);
  near(st.timing(1).start, a.duration + 5000);
  // The timeline takes each sentence's start from the voice.
  const steps = [{ cmd: 'say', text: 'Here is a chapati.' }, { cmd: 'say', text: 'Three pieces are eaten.' }, { cmd: 'write_text', id: 'w', text: 'x', slot: 'top', on: 'Three' }];
  const tl = buildTimeline(steps, { speech: (_, k) => st.timing(k) });
  near(tl.sentences[1].start, a.duration + 5000);
  near(tl.events.find((e) => e.cmd === 'write_text').t, a.duration + 5000);
});

test('steps that stream in after their sentence started still play on that sentence\'s word times', () => {
  const words = 'Here is the bar cut into four.'.split(' ').map((word, i) => ({ word, start: i * 100, end: i * 100 + 90 }));
  const timing = [{ start: 0, words, duration: 700, complete: true }];
  const say1 = { cmd: 'say', text: 'Here is the bar cut into four.' };
  const p = createPlayer(buildTimeline([say1], { speech: (_, k) => timing[k] }), 0);
  assert.equal(advance(p, 300).due.length, 0);
  // The bar's step arrives at 300 ms, anchored to "four." (600 ms): it waits for its word.
  const bar = { cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 0, slot: 'top', on: 'four' };
  updateTimeline(p, buildTimeline([say1, bar], { speech: (_, k) => timing[k] }));
  assert.equal(advance(p, 599).due.length, 0);
  assert.deepEqual(advance(p, 600).due.map((e) => e.cmd), ['fraction_bar']);
  // A step whose word has already gone by is drawn at once (late, and counted as late).
  const hl = { cmd: 'highlight', target: 'b', on: 'Here' };
  updateTimeline(p, buildTimeline([say1, bar, hl], { speech: (_, k) => timing[k] }));
  assert.deepEqual(advance(p, 650).due.map((e) => e.cmd), ['highlight']);
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

test('listening: the demo\'s typed words "spoken" with partials; Cartesia Ink messages read as the docs say', () => {
  const q = [];
  const stt = fakeStt({ schedule: (fn, ms) => { q.push({ fn, ms }); return q.length; }, cancel: () => {} });
  const got = { speech: 0, partials: [], final: null };
  const s = stt.start({ onSpeech: () => { got.speech += 1; }, onPartial: (t) => got.partials.push(t), onFinal: (t, sec) => { got.final = [t, sec]; } });
  s.say('three quarters please');
  assert.equal(got.speech, 1, 'speech starts at once (barge-in happens then)');
  q.sort((a, b) => a.ms - b.ms).forEach((x) => x.fn());
  assert.deepEqual(got.partials, ['three', 'three quarters', 'three quarters please']);
  assert.deepEqual(got.final, ['three quarters please', (PARTIAL_MS * 3 + END_OF_SPEECH_MS) / 1000]);
  // Cartesia Ink (docs, 11 Nov 2026): transcript deltas with is_final; flush_done after "finalize".
  assert.deepEqual(cartesiaSttEvent({ type: 'transcript', is_final: false, text: 'three', request_id: 'r' }), { kind: 'partial', text: 'three' });
  assert.deepEqual(cartesiaSttEvent({ type: 'transcript', is_final: true, text: ' quarters', request_id: 'r' }), { kind: 'final', text: ' quarters' });
  assert.deepEqual(cartesiaSttEvent({ type: 'flush_done', request_id: 'r' }), { kind: 'flushed' });
  assert.equal(cartesiaSttEvent({ type: 'error', status_code: 401, title: 'x', message: 'bad token' }).kind, 'error');
  const url = new URL(sttUrl({ token: 'tok', version: '2026-08-14', rate: 16000 }));
  assert.equal(url.origin + url.pathname, 'wss://api.cartesia.ai/stt/websocket');
  assert.deepEqual(['model', 'language', 'encoding', 'sample_rate', 'cartesia_version', 'access_token'].map((k) => url.searchParams.get(k)), ['ink-whisper', 'en', 'pcm_s16le', '16000', '2026-08-14', 'tok']);
  // Microphone samples as 16-bit PCM; end of speech after 0.8 s quiet.
  assert.deepEqual([...new Int16Array(pcm16(new Float32Array([0, 1, -1, 0.5])))], [0, 32767, -32768, 16383]);
  const vad = speechEnd();
  assert.equal(vad.feed(0.001, 100), null, 'silence before speaking is not speech');
  assert.equal(vad.feed(0.05, 100), 'speech');
  assert.equal(vad.feed(0.001, 400), null);
  assert.equal(vad.feed(0.05, 100), null, 'a pause inside a sentence does not end it');
  assert.equal(vad.feed(0.001, 500), null);
  assert.equal(vad.feed(0.001, 300), 'end');
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
  // Cartesia listening (one session for the lesson) with no microphone in this "browser": an error, never a hang.
  const err = await new Promise((resolve) => cartesiaStt({ getToken: async () => ({ token: 't', version: 'v' }) }).open({ onError: resolve, onUtterance: () => resolve('final?') }));
  assert.ok(['mic-missing', 'listen-failed', 'mic-denied'].includes(err));
  // Cartesia that cannot get a token: the stream fails before any sound, so the page falls back to the silent voice.
  globalThis.window = { AudioContext: class { constructor() { this.currentTime = 0; } resume() {} } };
  const tts = cartesiaTts({ getToken: async () => { throw new Error('refused'); } });
  const cs = tts.open();
  cs.add('Hello.');
  await assert.rejects(cs.ready, /refused/);
  delete globalThis.window;
  // The silent voice is always there to fall back on.
  const st = simulatedTts().open();
  st.add('Hello there.');
  assert.ok(Number.isFinite(await st.ready));
  assert.equal(st.timing(0).complete, true);
  // No browser voice that keeps time, and no listening: both said, plainly, once each.
  let v2 = voiceReducer(initialVoice('voice'), { type: 'fail', kind: 'no-voice' });
  v2 = voiceReducer(v2, { type: 'fail', kind: 'no-listening' });
  assert.match(v2.message, /no English voice, so HOREB is silent: read along.*cannot listen, so please type/);
  assert.equal(v2.mode, 'speaker');
});

test('short spoken turns: the server asks again when the tutor says too much', () => {
  const long = [{ cmd: 'say', text: Array(25).fill('word').join(' ') + '.' }, { cmd: 'say', text: Array(25).fill('more').join(' ') + '.' }, { cmd: 'say', text: Array(15).fill('and').join(' ') + '.' }, { cmd: 'pause_for_child', expect: 'typed', max_wait_s: 30 }];
  assert.match(turnProblems(long, { maxWords: MAX_SPOKEN_WORDS })[0], new RegExp(`says 65 words: say at most ${MAX_SPOKEN_WORDS}`));
  assert.deepEqual(turnProblems(long.slice(1)), [], 'off unless asked');
});

// ---------------------------------------------------------------- caps and the cost log
const world = ({ spent = { session: 0, day: 0 } } = {}) => {
  const usage = [];
  return { usage, async getChild() { return null; }, async getProgress() { return { skills: {} }; }, async spend() { return spent; }, async recordUsage(r) { usage.push(r); }, async recordConcern() {}, async recordEvidence() {}, async countTokens() { return usage.filter((u) => String(u.guard).startsWith('token')).length; } };
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
  // Listening is bounded: the page cannot claim an hour of speech (the microphone is open all lesson, so up to 300 s a turn).
  const db2 = world();
  await turn(db2, { voice: true, audio_in_s: 3600 });
  assert.equal(db2.usage.find((u) => u.model === 'voice').audio_in_s, 300);
  // No voice: nothing extra.
  const db3 = world();
  await turn(db3, { voice: false });
  assert.equal(db3.usage.filter((u) => u.model === 'voice').length, 0);
  // Cartesia's published price (cartesia.ai/pricing, 11 Nov 2026): Pro US$5 for 100K credits;
  // Sonic 1 credit a character; Ink 3 credits a second.
  assert.equal(PRICES.ttsUsdPerChar, 0.00005);
  assert.ok(Math.abs(PRICES.sttUsdPerMinute - 0.009) < 1e-12);
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
  const f = async (url, init) => { calls.push({ url, init }); return { ok: true, json: async () => ({ token: 'ca-temp' }) }; };
  f.calls = calls;
  return f;
};
const mint = (o = {}) => mintToken({ user: USER, settings, keys: { cartesia: 'sk_car_SECRET' }, fetch: fakeFetch(), now: 1_800_000_000_000, db: tokenWorld(), ...o, body: { session_id: SID, ...o.body } });

test('voice tokens: refused to anyone off the allowlist, with the switch off, past the caps, or too often', async () => {
  const f = fakeFetch();
  const stranger = await mint({ user: { id: 'u2', email: 'someone@else.com' }, fetch: f });
  assert.equal(stranger.status, 403);
  assert.match(stranger.body.error, /adult test accounts only/);
  assert.equal(f.calls.length, 0, 'no vendor call for a refused caller');
  assert.equal((await mint({ user: null })).status, 401);
  assert.equal((await mint({ settings: settingsFrom(() => undefined) })).status, 403);
  assert.equal((await mint({ body: { session_id: 'x' } })).status, 400);
  assert.equal((await mint({ body: { child_id: 'c9' } })).status, 403);
  assert.equal((await mint({ db: tokenWorld({ spent: { session: 1.5, day: 1.5 } }) })).status, 402);
  assert.equal((await mint({ db: tokenWorld({ recent: TOKENS_PER_MINUTE }) })).status, 429);
  assert.equal((await mint({ db: tokenWorld({ broken: true }) })).status, 503);
  assert.match((await mint({ keys: {} })).body.error, /CARTESIA_API_KEY is missing/);
});

test('voice tokens: one Cartesia token for listening and speaking; the key stays on the server', async () => {
  const f = fakeFetch();
  const db = tokenWorld();
  const r = await mint({ fetch: f, db });
  assert.equal(r.status, 200);
  assert.equal(r.body.token, 'ca-temp');
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, 'https://api.cartesia.ai/access-token');
  assert.equal(f.calls[0].init.headers.Authorization, 'Bearer sk_car_SECRET');
  assert.equal(f.calls[0].init.headers['Cartesia-Version'], '2026-08-14');
  assert.deepEqual(JSON.parse(f.calls[0].init.body), { grants: { tts: true, stt: true }, expires_in: 600 });
  assert.deepEqual([r.body.model, r.body.voice, r.body.sample_rate, r.body.version], [settings.ttsModel, settings.ttsVoice, settings.ttsSampleRate, '2026-08-14']);
  assert.doesNotMatch(JSON.stringify(r.body), /SECRET/);
  assert.deepEqual(db.usage.map((u) => [u.guard[0], u.cost_usd]), [['token-voice', 0]]);
  const down = await mint({ fetch: async () => ({ ok: false, status: 500 }) });
  assert.equal(down.status, 502);
});

test('the turn on the wire: one JSON event per line, read as it streams; a broken line ends plainly', async () => {
  const split = lines();
  assert.deepEqual(split('{"type":"meta"}\n{"type":"st'), ['{"type":"meta"}']);
  assert.deepEqual(split('ep"}\n'), ['{"type":"step"}']);
  const body = (chunks) => new ReadableStream({ start(c) { chunks.forEach((x) => c.enqueue(new TextEncoder().encode(x))); c.close(); } });
  const seen = [];
  const end = await readTurnStream(body(['{"type":"meta"}\n{"type":"step","step":{"cmd":"say","text":"Hi."}}\n', '{"type":"end","guard":[]}\n']), (e) => seen.push(e.type));
  assert.deepEqual(seen, ['meta', 'step', 'end']);
  assert.deepEqual(end.guard, []);
  const cut = await readTurnStream(body(['{"type":"meta"}\n{"type":"step","step":{"cmd":"say","text":"Hi."}}\n']), () => {});
  assert.deepEqual(cut.guard, ['connection-lost']);
  // The scripted tutor streams the same events.
  const ev = [];
  await createMockTutor().turn({}, (e) => ev.push(e.type));
  assert.equal(ev[0], 'meta');
  assert.equal(ev.at(-1), 'end');
  assert.ok(ev.filter((x) => x === 'step').length > 3);
});

test('both voice edge functions in the repository are the build of this code, with no key inside', async () => {
  for (const [name, want] of Object.entries(await buildVoiceTutorFns())) {
    const have = readFileSync(new URL(`../supabase/functions/${name}/index.ts`, import.meta.url), 'utf8');
    assert.equal(have, want, `${name}: run npm run build:voice-tutor-fn`);
    assert.doesNotMatch(have, /sk_car_|sk-ant-/);
  }
});

// ---------------------------------------------------------------- the practice voice (browser speech), with a fake speechSynthesis
const fakeSpeech = ({ boundaries = true, voices = [{ name: 'Daniel', lang: 'en-GB', localService: true }, { name: 'Zarvox', lang: 'en-US', localService: true }], timedVoice = null, lateVoices = null } = {}) => {
  const spoken = [];
  let clock = 1000;
  const queue = [];
  let list = lateVoices ? [] : voices;
  const listeners = [];
  const synth = {
    getVoices: () => list,
    addEventListener(type, fn) { if (type === 'voiceschanged') listeners.push(fn); },
    removeEventListener() {},
    // The voice list arriving later, as browsers do.
    loadVoices() { list = lateVoices; listeners.forEach((f) => f()); },
    cancel() { queue.length = 0; },
    speak(u) { queue.push(u); spoken.push(u); },
    // Play the queue: each word takes 300 ms; boundaries if this voice sends them.
    run() {
      while (queue.length) {
        const u = queue.shift();
        u.onstart?.();
        const words = [...u.text.matchAll(/\S+/g)];
        const keepsTime = boundaries && (!timedVoice || u.voice?.name === timedVoice);
        for (const m of words) { if (keepsTime) u.onboundary?.({ name: 'word', charIndex: m.index, charLength: m[0].length }); clock += 300; }
        u.onend?.();
        clock += 200;
      }
    },
  };
  return { synth, spoken, now: () => clock };
};
const withBrowser = async (fake, fn) => {
  const saved = { window: globalThis.window, U: globalThis.SpeechSynthesisUtterance, now: performance.now };
  globalThis.window = { speechSynthesis: fake.synth };
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  performance.now = fake.now;
  try { return await fn(); } finally { globalThis.window = saved.window; globalThis.SpeechSynthesisUtterance = saved.U; performance.now = saved.now; }
};

test('the practice voice: word boundary events become the word times that drive the strokes', async () => {
  const { webSpeechTts } = await import('../src/voice-tutor/providers/webSpeech.js');
  const fake = fakeSpeech();
  await withBrowser(fake, async () => {
    const tts = webSpeechTts();
    assert.deepEqual(await tts.unlock(), { ok: true, reason: null });
    assert.match(tts.voiceName, /^Daniel \(en-GB, on this device\)$/, 'British English on the device, never the novelty voice');
    assert.equal(tts.timingMode, null, 'learned from the first real sentence, not a silent probe');
    const st = tts.open();
    st.add('Here is the bar cut into four.');
    st.add('Shade three of them.');
    fake.synth.run();
    await st.ready;
    assert.equal(tts.timingMode, 'boundary');
    const a = st.timing(0); const b = st.timing(1);
    assert.equal(a.start, 0);
    assert.deepEqual(a.words.map((w) => [w.word, w.start]), [['Here', 0], ['is', 300], ['the', 600], ['bar', 900], ['cut', 1200], ['into', 1500], ['four.', 1800]]);
    assert.equal(b.start, 2100 + 200, 'the second sentence starts when the browser starts it');
    const steps = [{ cmd: 'say', text: 'Here is the bar cut into four.' }, { cmd: 'fraction_bar', id: 'b', parts: 4, shaded: 0, slot: 'top', on: 'four' }, { cmd: 'say', text: 'Shade three of them.' }, { cmd: 'highlight', target: 'b', part: 3, on: 'three' }];
    const tl = buildTimeline(steps, { speech: (_, k) => st.timing(k) });
    assert.equal(tl.events.find((e) => e.cmd === 'fraction_bar').t, 1800);
    assert.equal(tl.events.find((e) => e.cmd === 'highlight').t, 2300 + 300);
  });
});

test('a voice with no word boundaries still speaks: word times are estimated from its pace and re-anchored each sentence', async () => {
  const { webSpeechTts, estimateWords, START_MS_PER_CHAR } = await import('../src/voice-tutor/providers/webSpeech.js');
  const fake = fakeSpeech({ boundaries: false });
  await withBrowser(fake, async () => {
    const tts = webSpeechTts();
    assert.deepEqual(await tts.unlock(), { ok: true, reason: null }, 'no boundaries is not a reason to be silent');
    const st = tts.open();
    st.add('Here is the bar cut into four.');
    st.add('Shade three of them.');
    // Before the voice starts, nothing is guessed: strokes wait.
    assert.equal(st.timing(0).start, null);
    fake.synth.run();
    await st.ready;
    assert.equal(tts.timingMode, 'estimated');
    const a = st.timing(0); const b = st.timing(1);
    // Sentence 1 used the first guess at the pace; sentence 2 is anchored on its own real start
    // and uses the pace learned from sentence 1 (7 words x 300 ms), so no drift carries over.
    assert.deepEqual(a.words.map((w) => w.start), estimateWords('Here is the bar cut into four.', START_MS_PER_CHAR).words.map((w) => w.start));
    assert.equal(a.duration, 2100);
    assert.equal(b.start, 2300, 'its real start, not the estimate');
    const learned = estimateWords('Here is the bar cut into four.', 1).duration;
    const pace = Math.round(0.5 * START_MS_PER_CHAR + 0.5 * (2100 / learned));
    assert.deepEqual(b.words.map((w) => w.start), estimateWords('Shade three of them.', pace).words.map((w) => w.start));
    assert.ok(b.words.at(-1).start < 1200, 'the learned pace fits this voice (4 words in 1200 ms)');
  });
});

test('only a browser with no English voice goes silent; one that lists no voices speaks with its default', async () => {
  const { webSpeechTts } = await import('../src/voice-tutor/providers/webSpeech.js');
  const none = fakeSpeech({ voices: [{ name: 'Zarvox', lang: 'en-US', localService: true }, { name: 'Thomas', lang: 'fr-FR', localService: true }] });
  await withBrowser(none, async () => { assert.deepEqual(await webSpeechTts().unlock(), { ok: false, reason: 'no-voice' }); });
  const unlisted = fakeSpeech({ voices: [] });
  await withBrowser(unlisted, async () => {
    const tts = webSpeechTts();
    assert.deepEqual(await tts.unlock(), { ok: true, reason: null });
    assert.equal(tts.voiceName, 'the browser\'s own English voice');
  });
  await withBrowser({ synth: null, now: () => 0 }, async () => {
    globalThis.window = {};
    assert.deepEqual(await webSpeechTts().unlock(), { ok: false, reason: 'no-voice' });
  });
});

test('the practice voice waits for the voice list to load, and puts voices on the device first', async () => {
  const { webSpeechTts } = await import('../src/voice-tutor/providers/webSpeech.js');
  const late = fakeSpeech({ lateVoices: [{ name: 'Google UK English Female', lang: 'en-GB', localService: false }, { name: 'Samantha', lang: 'en-US', localService: true }] });
  await withBrowser(late, async () => {
    const tts = webSpeechTts();
    const unlocking = tts.unlock();
    setTimeout(() => late.synth.loadVoices(), 50);
    assert.deepEqual(await unlocking, { ok: true, reason: null });
    assert.match(tts.voiceName, /^Samantha/, 'listed late, on the device: chosen over the online British voice');
  });
  assert.deepEqual(rankVoices([
    { name: 'Google UK English Female', lang: 'en-GB', localService: false },
    { name: 'Samantha', lang: 'en-US', localService: true },
    { name: 'Daniel', lang: 'en-GB', localService: true },
    { name: 'Tessa', lang: 'en-ZA', localService: true },
  ]).map((v) => v.name), ['Daniel', 'Tessa', 'Samantha', 'Google UK English Female']);
});

test('the phone layout: the board takes about a third of an upright phone, the conversation the rest', async () => {
  const { portraitBoardH } = await import('../src/voice-tutor/board.js');
  for (const [w, h] of [[412, 860], [360, 780], [390, 844]]) {
    const H = portraitBoardH(w, h);
    const boardPx = (w - 16) * (H / 1000);
    assert.ok(boardPx / h > 0.3 && boardPx / h < 0.4, `${w}x${h}: board ${Math.round(boardPx)} px`);
  }
  assert.equal(portraitBoardH(300, 2000), 1000, 'never taller than square');
  assert.equal(portraitBoardH(800, 900), 600, 'never flatter than this');
});

