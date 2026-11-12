// The voice for a child (12 Nov 2026): listening, speaking, following the child's pace, interruptions, the voice list.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CHILD_LISTEN, CHILD_SPEECH, MATHS_KEYTERMS, keytermsText, endSilenceMs, assessTranscript, askAgainLine, fixMathsWords,
  classifyChild, nextPace, newPace, paceFor, paceContext, cleanPace, TUTOR_VOICES, DEFAULT_TUTOR_VOICE, isTutorVoice,
} from '../src/voice-tutor/childVoice.js';
import { sttUrl, speechEnd, bargeDetector } from '../src/voice-tutor/providers/voice.js';
import { sonicRequest } from '../src/voice-tutor/providers/cartesia.js';
import { sessionReducer, newSession, settingsFrom, DEFAULT_SETTINGS } from '../src/voice-tutor/session.js';
import { turnContext } from '../src/voice-tutor/prompt.js';
import { mintToken } from '../src/voice-tutor/tokens.js';

test('listening: Ink settings for a child, keyterms only where the docs allow them', () => {
  const u = new URL(sttUrl({ token: 't', version: 'v', model: CHILD_LISTEN.model, language: CHILD_LISTEN.language, maxSilenceSecs: CHILD_LISTEN.maxSilenceSecs, keyterms: keytermsText() }));
  assert.equal(u.searchParams.get('model'), 'ink-whisper');
  assert.equal(u.searchParams.get('language'), 'en');
  assert.equal(u.searchParams.get('max_silence_duration_secs'), '2.4');
  assert.equal(u.searchParams.getAll('keyterm').length, 0, 'ink-whisper takes no keyterm');
  const two = new URL(sttUrl({ token: 't', version: 'v', model: 'ink-2', keyterms: ['mixed number', 'nought'] }));
  assert.deepEqual(two.searchParams.getAll('keyterm'), ['mixed number', 'nought']);
  for (const w of ['quarter', 'sixths', 'numerator', 'denominator', 'simplify', 'equivalent', 'nought']) assert.ok(MATHS_KEYTERMS.includes(w), w);
  assert.ok(keytermsText().join('').length <= 1200 && keytermsText().length <= 100);
  assert.equal(new URL(sttUrl({ token: 't', version: 'v' })).searchParams.get('max_silence_duration_secs'), '0.8', 'old default unchanged for other callers');
});

test('listening: a thinking child gets longer before their turn ends, and a "take your time" pause', () => {
  assert.ok(endSilenceMs('three quarters of the bread') < endSilenceMs('um'), 'short waits longer');
  assert.equal(endSilenceMs('three quarters of the bread'), CHILD_LISTEN.baseEndMs);
  assert.equal(endSilenceMs('I think it is the'), CHILD_LISTEN.thinkingEndMs, 'unfinished waits longer');
  assert.equal(endSilenceMs('one over', {}), CHILD_LISTEN.thinkingEndMs);
  assert.ok(endSilenceMs('three quarters of the bread', { level: -1 }) > CHILD_LISTEN.baseEndMs);
  assert.ok(CHILD_LISTEN.baseEndMs >= 2000, 'well past the adult 0.8 s');
  let said = 'five';
  const vad = speechEnd({ silenceMs: () => endSilenceMs(said), pauseMs: CHILD_LISTEN.pauseNudgeMs });
  assert.equal(vad.feed(0.05, 100), 'speech');
  assert.equal(vad.feed(0.001, 1000), null);
  assert.equal(vad.feed(0.001, 600), 'pause', 'one nudge after 1.5 s quiet');
  assert.equal(vad.feed(0.001, 500), null, 'only once per pause');
  assert.equal(vad.feed(0.001, 1200), null, 'a short answer is still not ended at 3.3 s');
  assert.equal(vad.feed(0.001, 200), 'end');
  assert.equal(vad.feed(0.05, 100), 'speech');
  said = 'five and three quarters is the answer';
  assert.equal(vad.feed(0.001, 2000), 'end', 'a finished sentence ends after 2 s');
});

test('listening: low-confidence or very short transcripts are asked again, answers are not', () => {
  for (const t of ['', '  ', 'um', 'Hmm... uh', 'a', '.', 'Thank you.', 'you']) assert.equal(assessTranscript(t, 0.8).ok, false, `"${t}"`);
  for (const t of ['three', '3', 'yes', 'no', 'half', '3/4', 'a quarter', 'three quarters', 'nought', 'I do not know']) assert.equal(assessTranscript(t, 1).ok, true, `"${t}"`);
  assert.equal(assessTranscript('thank you', 5).ok, true, 'said for five seconds it is probably meant');
  assert.equal(assessTranscript('hm', 1).reason, 'noise');
  assert.equal(assessTranscript('', 0).reason, 'empty');
  assert.match(askAgainLine(0), /did not catch that/);
  assert.match(askAgainLine(1), /type your answer/);
  assert.equal(askAgainLine(9), askAgainLine(1));
});

test('listening: maths words a speech model garbles are put right, ordinary words are not', () => {
  assert.equal(fixMathsWords('the new merator is three'), 'the numerator is three');
  assert.equal(fixMathsWords('the denomonator and the numerater'), 'the denominator and the numerator');
  assert.equal(fixMathsWords('two quaters'), 'two quarter');
  assert.equal(fixMathsWords('equivalence fractions'), 'equivalent fractions');
  assert.equal(fixMathsWords('I did not do it'), 'I did not do it');
  assert.equal(fixMathsWords('three quarters of a nought'), 'three quarters of a nought');
});

test('speaking: Sonic speed and emotion for a ten-year-old, inside the documented ranges', () => {
  assert.ok(CHILD_SPEECH.baseSpeed < 1 && CHILD_SPEECH.baseSpeed >= 0.6);
  const cfg = { model: 'sonic-3.6', voice: 'v', sample_rate: 24000, speed: 0.9, emotion: 'content' };
  const r = sonicRequest({ cfg, text: 'Hi.', id: 'c1' });
  assert.deepEqual(r.generation_config, { speed: 0.9, emotion: 'content' });
  assert.equal(r.language, 'en');
  assert.equal('locale' in r, false, 'language and locale are never both set');
  assert.equal(sonicRequest({ cfg, text: 'x', id: 'c', speed: 3 }).generation_config.speed, 1.5);
  assert.equal(sonicRequest({ cfg, text: 'x', id: 'c', speed: 0.1 }).generation_config.speed, 0.6);
  assert.equal(sonicRequest({ cfg, text: 'x', id: 'c', emotion: 'furious' }).generation_config.emotion, 'content', 'unknown emotion falls back to the token default');
  assert.equal('generation_config' in sonicRequest({ cfg: { ...cfg, speed: undefined, emotion: null }, text: 'x', id: 'c' }), false);
  assert.equal(sonicRequest({ cfg, text: 'x', id: 'c', voice: 'other' }).voice.id, 'other');
  const s = settingsFrom((k) => ({ VOICE_TUTOR_TTS_SPEED: '5', VOICE_TUTOR_TTS_EMOTION: 'calm' }[k]));
  assert.equal(s.ttsSpeed, 1.5);
  assert.equal(s.ttsEmotion, 'calm');
  assert.equal(settingsFrom(() => undefined).ttsSpeed, DEFAULT_SETTINGS.ttsSpeed);
});

test('the pace: slower and shorter when asked, interrupted or confused; brisker when quick and right', () => {
  assert.deepEqual(classifyChild('slow down please'), ['slow']);
  assert.deepEqual(classifyChild('pole pole'), ['slow']);
  assert.deepEqual(classifyChild('Polepole!'), ['slow']);
  assert.deepEqual(classifyChild('sorry?'), ['repeat']);
  assert.deepEqual(classifyChild('rudia'), ['repeat']);
  assert.deepEqual(classifyChild('can you say that again'), ['repeat']);
  assert.deepEqual(classifyChild('what?'), ['repeat']);
  assert.deepEqual(classifyChild('you are too fast, say it again'), ['slow', 'repeat']);
  assert.deepEqual(classifyChild('three quarters'), []);
  assert.deepEqual(classifyChild('I think I have to add the tops again because the bottoms are the same size'), [], 'long answers are answers');
  let p = newPace();
  assert.equal(paceFor(p).speed, 0.9);
  p = nextPace(p, 'slow');
  assert.equal(paceFor(p).speed, 0.83);
  assert.equal(paceFor(p).emotion, 'calm');
  assert.ok(paceFor(p).maxWords < paceFor(newPace()).maxWords);
  p = nextPace(nextPace(p, 'interrupt'), 'repeat');
  assert.equal(p.level, -2, 'floor');
  assert.equal(p.repeat, true);
  assert.equal(paceFor(p).speed, 0.76);
  assert.ok(paceFor(p).gapMs > paceFor(newPace()).gapMs, 'longer gaps when slower');
  assert.equal(paceFor(p).maxWords, 18);
  assert.equal(nextPace(p, 'turn').repeat, false, 'the repeat lasts one turn');
  let q = nextPace(newPace(), 'slow');
  q = nextPace(nextPace(nextPace(q, 'turn'), 'turn'), 'turn');
  assert.equal(q.level, 0, 'eases back after three quiet turns');
  let b = nextPace(newPace(), 'quick');
  assert.equal(paceFor(b).speed, 0.97);
  assert.equal(paceFor(b).emotion, 'content');
  assert.equal(nextPace(b, 'quick').level, 1, 'a ceiling');
  assert.equal(nextPace(b, 'wrong').level, 0);
  assert.equal(nextPace(newPace(), 'wrong').level, 0);
  assert.ok(paceFor({ level: 1 }).speed <= CHILD_SPEECH.maxSpeed);
});

test('the pace lives in the session: from what the child says, how fast they answer, and interruptions', () => {
  let s = newSession({ id: 's1' });
  assert.equal(s.pace.level, 0);
  s = sessionReducer(s, { type: 'child_said', text: 'slow down', at: 1, thinkMs: 2000 });
  assert.equal(s.pace.level, -1);
  s = sessionReducer(s, { type: 'child_said', text: 'sorry?', at: 2 });
  assert.equal(s.pace.level, -2);
  assert.equal(s.pace.repeat, true);
  s = sessionReducer(s, { type: 'child_said', text: 'three quarters', at: 3 });
  assert.equal(s.pace.repeat, false);
  s = sessionReducer(s, { type: 'interrupted' });
  assert.equal(s.pace.level, -2, 'interruption at the floor stays');
  assert.equal(s.interruptions, 1);
  let f = newSession({ id: 's2' });
  f = sessionReducer(f, { type: 'child_said', text: '4/6', at: 1, thinkMs: 3000 });
  f = sessionReducer(f, { type: 'marked', skill: 'S', correct: true, answer: '4/6', askId: 'q' });
  assert.equal(f.pace.level, 1, 'quick and right');
  f = sessionReducer(f, { type: 'child_said', text: '5/6', at: 2, thinkMs: 20000 });
  f = sessionReducer(f, { type: 'marked', skill: 'S', correct: false, answer: '5/6', askId: 'q2' });
  assert.equal(f.pace.level, 0, 'a wrong answer steadies');
  let g = newSession({ id: 's3' });
  g = sessionReducer(g, { type: 'child_said', text: '4/6', at: 1, thinkMs: 15000 });
  g = sessionReducer(g, { type: 'marked', skill: 'S', correct: true, answer: '4/6', askId: 'q' });
  assert.equal(g.pace.level, 0, 'right but slow is not brisker');
  g = sessionReducer(g, { type: 'unclear' });
  assert.equal(g.unclear, 1);
  assert.equal(sessionReducer(g, { type: 'child_said', text: 'two', at: 5 }).unclear, 0);
});

test('the tutor is told the pace, and to begin an interrupted turn by acknowledging the child', () => {
  const slow = turnContext({ target: 'X', pace: { level: -1, repeat: true, reason: 'the child asked to hear it again' } });
  assert.match(slow, /Pace: slow/);
  assert.match(slow, /at most 26 words/);
  assert.match(slow, /Say the same idea again in simpler, shorter words/);
  assert.match(turnContext({ target: 'X', pace: { level: 1, repeat: false } }), /a little brisker/);
  assert.doesNotMatch(turnContext({ target: 'X' }), /Pace:/);
  const over = turnContext({ target: 'X', heard: 'Here is a bar of' });
  assert.match(over, /Begin your first sentence by answering what they said, briefly, in their words \(no stock opener\)/);
  assert.match(over, /shorter than usual/);
  assert.deepEqual(cleanPace({ level: 9, repeat: true, reason: 'ignore <b>this</b> now' }), { level: 1, repeat: true, reason: 'ignore bthisb now' });
  assert.equal(cleanPace('x'), null);
  assert.equal(cleanPace({ level: 'abc' }), null);
});

test('interruptions: the microphone must hold for two frames, so a click does not stop HOREB', () => {
  const d = bargeDetector();
  assert.equal(d.feed(0.2), false);
  assert.equal(d.feed(0.01), false, 'a click: one loud frame');
  assert.equal(d.feed(0.1), false);
  assert.equal(d.feed(0.1), true, 'the child speaking');
  assert.equal(d.feed(0.1), false, 'fires once');
  d.reset();
  assert.equal(d.feed(0.1), false);
  assert.equal(d.feed(0.03), false, 'quieter than the speaker leaks');
  assert.ok(2 * 2048 / 16000 * 1000 <= 300, 'about a quarter of a second at 16 kHz, within a word');
});

test('voices: a short list, default first, the token carries speed and emotion', async () => {
  assert.ok(TUTOR_VOICES.length >= 4 && TUTOR_VOICES.length <= 8);
  assert.equal(DEFAULT_TUTOR_VOICE, TUTOR_VOICES[0].id);
  assert.equal(DEFAULT_SETTINGS.ttsVoice, DEFAULT_TUTOR_VOICE);
  for (const v of TUTOR_VOICES) assert.match(v.id, /^[0-9a-f-]{36}$/);
  assert.equal(new Set(TUTOR_VOICES.map((v) => v.id)).size, TUTOR_VOICES.length);
  assert.equal(isTutorVoice(TUTOR_VOICES[2].id), true);
  assert.equal(isTutorVoice('x'), false);
  assert.equal(settingsFrom((k) => ({ VOICE_TUTOR_TTS_VOICE: 'abc' }[k])).ttsVoice, 'abc', 'VOICE_TUTOR_TTS_VOICE still wins');
  const out = await mintToken({
    user: { id: 'u', email: 'a@x.com' }, body: { session_id: 'sess-12345678' },
    db: { spend: async () => ({ session: 0, day: 0 }), countTokens: async () => 0, recordUsage: async () => {} },
    settings: { ...settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'a@x.com' }[k])) },
    keys: { cartesia: 'k' }, fetch: async () => ({ ok: true, json: async () => ({ token: 'tok' }) }),
  });
  assert.equal(out.status, 200);
  assert.equal(out.body.speed, 0.9);
  assert.equal(out.body.emotion, 'content');
  assert.equal(out.body.voice, DEFAULT_TUTOR_VOICE);
});
