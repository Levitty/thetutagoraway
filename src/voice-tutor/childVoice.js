// ============================================================================
// THE VOICE, FOR A CHILD (12 Nov 2026). Pure, tested in tests/voice-tutor-child-voice.test.mjs.
//
// The owner's words: the tutor was "too fast, doesn't care what I'm saying, its goal is to
// finish what it's saying", "too robotic"; and "voice calibration that understands, that adapts
// to a student". This file holds the decisions; the browser files only wire them.
//
//   LISTENING   CHILD_LISTEN          Ink settings for a ten-year-old thinking aloud (Kenyan English)
//               endSilenceMs()        how long a quiet stretch must last before the child's turn ends
//               assessTranscript()    is what came back worth marking? If not, ask again kindly
//               fixMathsWords()       maths words a Kenyan child's speech is often heard wrongly as
//   SPEAKING    CHILD_SPEECH          Sonic speed, emotion and the gap between sentences
//               paceFor()             the pace state (explained below) -> speed, emotion, gap, word limit
//   FOLLOWING   classifyChild()       "slow down", "sorry?", "pole pole", "rudia" -> signals
//               nextPace()            what each signal does to the pace
//   VOICES      TUTOR_VOICES          the short list testers can switch between
// ============================================================================

// ---------------------------------------------------------------- listening
// Cartesia docs (docs.cartesia.ai, read 12 Nov 2026), Ink STT websocket:
//   ink-whisper: `language` (ISO-639-1 only, so "en": there is no Kenyan locale code to ask for),
//                `min_volume`, `max_silence_duration_secs` (silence before auto-finalizing).
//   ink-2 and ink-preview: repeatable `keyterm` (up to 100 terms, 1200 characters), the only
//                vocabulary hook the docs offer. ink-whisper has none, so for ink-whisper the maths
//                words are repaired after the fact (fixMathsWords) and the tutor is told about them.
//   No confidence score is documented for either model, so "low confidence" is judged from the
//   words themselves (assessTranscript), never from a number that does not exist.
export const MATHS_KEYTERMS = Object.freeze([
  'quarter', 'quarters', 'half', 'halves', 'third', 'thirds', 'fifth', 'fifths', 'sixth', 'sixths', 'eighth', 'eighths', 'tenth', 'tenths',
  'numerator', 'denominator', 'fraction', 'fractions', 'simplify', 'equivalent', 'nought', 'whole', 'mixed number', 'improper fraction',
  'number line', 'HOREB',
]);
export const keytermsText = (terms = MATHS_KEYTERMS) => {
  let n = 0; const out = [];
  for (const t of terms.slice(0, 100)) { n += t.length; if (n > 1200) break; out.push(t); }
  return out;
};

export const CHILD_LISTEN = Object.freeze({
  model: 'ink-whisper',
  language: 'en',
  // The server's own auto-finalize waits as long as the page does, so it never cuts a thinking child off.
  maxSilenceSecs: 2.4,
  // The page's end of speech (a child pauses to think: an adult's 0.8 s ended turns mid-sentence).
  baseEndMs: 2000,        // a finished-sounding answer ends after this much quiet
  thinkingEndMs: 3400,    // a short or unfinished answer waits longer
  pauseNudgeMs: 1500,     // quiet this long mid-answer: show "Take your time" (once per pause)
  slowerExtraMs: 500,     // when the tutor has been asked to slow down, wait a little more still
  maxUtteranceMs: 40000,
  noSpeechMs: 10000,
});

const UNFINISHED_END = /\b(and|is|it'?s|the|so|because|then|um+|uh+|er+|erm|hm+|a|of|to|equals?|over|plus|minus|times)\s*[.,…]*$/i;
const words = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9'\s/]/g, ' ').split(/\s+/).filter(Boolean);

/** How long a quiet stretch must last before the child's turn ends, given what they have said so far. */
export function endSilenceMs(partial = '', { level = 0 } = {}, c = CHILD_LISTEN) {
  const w = words(partial);
  const unsure = w.length <= 2 || UNFINISHED_END.test(String(partial).trim());
  return (unsure ? c.thinkingEndMs : c.baseEndMs) + (level < 0 ? c.slowerExtraMs : 0);
}

const FILLERS = new Set(['um', 'umm', 'uh', 'uhh', 'er', 'erm', 'hm', 'hmm', 'hmmm', 'mm', 'mmm', 'ah', 'oh', 'eh', 'huh']);
// Whisper-family models invent these on near-silence or room noise.
const PHANTOMS = new Set(['you', 'thank you', 'thanks', 'bye', 'thanks for watching', 'the', 'so', 'okay then']);
const NUMBER_WORDS = new Set('zero nought none one two three four five six seven eight nine ten eleven twelve twenty thirty forty fifty hundred half halves quarter quarters third thirds fifth fifths sixth sixths eighth eighths tenth tenths whole yes no yeah yep nope ok okay maybe'.split(' '));
const isShortAnswer = (w) => /^\d+([/.]\d+)?$/.test(w) || NUMBER_WORDS.has(w);

/**
 * Is this transcript worth marking? { ok:true } or { ok:false, reason:'empty'|'noise'|'short' }.
 * Short answers a child may truly give (a number, yes, a quarter) are fine; fillers, one stray
 * letter, and the words a speech model makes up from silence are not. `seconds` is how long they spoke.
 */
export function assessTranscript(text, seconds = 0) {
  const raw = String(text || '').trim();
  if (!raw) return { ok: false, reason: 'empty' };
  const w = words(raw);
  if (!w.length) return { ok: false, reason: 'noise' };
  if (w.every((x) => FILLERS.has(x))) return { ok: false, reason: 'noise' };
  if (seconds < 2 && PHANTOMS.has(w.join(' '))) return { ok: false, reason: 'noise' };
  if (w.length === 1 && !isShortAnswer(w[0]) && w[0].length <= 2) return { ok: false, reason: 'short' };
  return { ok: true, reason: null };
}

/** What HOREB says when it could not make out the child. The second time it offers another way. */
export const ASK_AGAIN = Object.freeze([
  'Sorry, I did not catch that. Say it again for me, nice and slowly.',
  'I still could not hear you well. Tap Talk and try once more, or type your answer if you like.',
]);
export const askAgainLine = (times = 0) => ASK_AGAIN[Math.min(Math.max(times, 0), ASK_AGAIN.length - 1)];

// Maths words a child's English (and a speech model's guess) tends to garble. Only whole phrases
// that are not words a child would say on purpose.
const FIXES = [
  [/\b(numer[a-z]{0,2}tor|new ?merator|humerator|numerater|numeriter)s?\b/gi, 'numerator'],
  [/\b(denom[a-z]{0,2}nator|de ?nominator|the nominator|denominater|denominate or|denomonator)s?\b/gi, 'denominator'],
  [/\b(quater|quatre|kwarter|quarta)s?\b/gi, 'quarter'],
  [/\b(equal valent|equivalence|equivelent|equivalant)\b/gi, 'equivalent'],
  [/\b(nort|noat|nougat)\b/gi, 'nought'],
];
export const fixMathsWords = (text) => FIXES.reduce((t, [re, to]) => t.replace(re, to), String(text || ''));

// ---------------------------------------------------------------- following the child (the pace)
// A small state, kept in the session (session.pace), shown in the tester view, sent to the tutor
// and to the voice:
//   level  -2 .. +1   0 is the steady child pace. Below 0 the tutor speaks slower and shorter; +1 a little brisker.
//   quiet  turns since the last signal; after 3 quiet turns a slowed tutor eases one step back toward 0.
//   repeat true for the one turn after "sorry?" or "repeat": say it again, simpler, not more.
//   reason the last thing that moved it, in words, for the tester view and the tutor's context.
export const PACE_MIN = -2;
export const PACE_MAX = 1;
export const newPace = () => ({ level: 0, quiet: 0, repeat: false, reason: '' });

export const CHILD_SPEECH = Object.freeze({
  // Sonic speed is a multiplier (docs: 0.6 to 1.5, default 1). A ten-year-old learning a new idea
  // needs slower than conversation: 0.9 steady, 0.07 a step.
  baseSpeed: 0.9,
  speedStep: 0.07,
  minSpeed: 0.7,
  maxSpeed: 1.0,
  // Sonic 3.6 adapts pause length to the sentence by itself (docs), so only the gap between our
  // separate sentences is ours: longer when slower, so the child can think between ideas.
  gapMs: 450,
  maxWords: { [-2]: 18, [-1]: 26, 0: 40, 1: 46 },
  // `emotion` is one of neutral, calm, angry, content, sad (docs). Warm and settled: content;
  // calm once the child has asked for slower.
  emotion: 'content',
  slowEmotion: 'calm',
});

const clampLevel = (n) => Math.max(PACE_MIN, Math.min(PACE_MAX, n));

/** The pace -> what the voice and the tutor are given. */
export function paceFor(pace = newPace(), base = CHILD_SPEECH.baseSpeed, c = CHILD_SPEECH) {
  const level = clampLevel(Number(pace?.level) || 0);
  const speed = Math.round(Math.max(c.minSpeed, Math.min(c.maxSpeed, base + level * c.speedStep)) * 100) / 100;
  return {
    level, speed,
    emotion: level < 0 ? c.slowEmotion : c.emotion,
    gapMs: Math.round(c.gapMs * (1 + Math.max(0, -level) * 0.35)),
    maxWords: c.maxWords[level],
    repeat: !!pace?.repeat,
    reason: String(pace?.reason || ''),
  };
}

const SLOW = /\b(slow(er|ly)?( down)?|too fast|so fast|not so fast|go slow|polepole|pole ?pole|hold on|wait)\b/i;
const REPEAT = /\b(say (that|it) again|repeat( that| it)?|one more time|come again)\b|^(sorry\b|pardon|what\b|huh\b|eh\b|come again|repeat\b|say (that|it) again|again\b|one more time|can you repeat|rudia\b|sijaelewa|sikusikia|nini\b|haya\b ?rudia)/i;

/** What a child's words say about the tutor's pace: a list of 'slow' and 'repeat'. Short messages only: an answer that happens to contain "again" is an answer. */
export function classifyChild(text) {
  const t = String(text || '').trim().replace(/[?!.,]+$/g, '');
  const w = words(t);
  const out = [];
  if (!w.length || w.length > 10) return out;
  if (SLOW.test(t)) out.push('slow');
  if (REPEAT.test(t) && w.length <= 8) out.push('repeat');
  return out;
}

/**
 * One signal in, the next pace out. Signals:
 *   slow      "slow down", "pole pole"     one step slower
 *   repeat    "sorry?", "rudia"            one step slower and the next turn says it again, simpler
 *   interrupt the child spoke over HOREB   one step slower (HOREB was talking too long)
 *   quick     a right answer, quickly      one step brisker, but only from steady or slow
 *   wrong     a wrong answer               a brisk pace steps back to steady
 *   turn      a turn with no signal        after 3 in a row, a slowed pace eases one step back toward 0
 */
export function nextPace(p = newPace(), signal) {
  let { level, quiet } = p;
  let repeat = false; let reason = p.reason;
  switch (signal) {
    case 'slow': level -= 1; quiet = 0; reason = 'the child asked for slower'; break;
    case 'repeat': level -= 1; quiet = 0; repeat = true; reason = 'the child asked to hear it again'; break;
    case 'interrupt': level -= 1; quiet = 0; reason = 'the child spoke over HOREB'; break;
    case 'quick': if (level < PACE_MAX) { level += 1; reason = 'a quick right answer'; } quiet = 0; break;
    case 'wrong': if (level > 0) { level = 0; reason = 'a wrong answer, back to steady'; } quiet = 0; break;
    case 'turn':
      quiet += 1; repeat = false;
      if (quiet >= 3 && level < 0) { level += 1; quiet = 0; reason = 'steady for three turns, easing back'; }
      break;
    default: return p;
  }
  return { level: clampLevel(level), quiet, repeat, reason };
}

/** The pace as the server accepts it from the page: a whole level in range, a flag, a short plain reason. Anything else is dropped. */
export const cleanPace = (raw) => (raw && typeof raw === 'object' && Number.isFinite(Number(raw.level))
  ? { level: clampLevel(Math.round(Number(raw.level))), repeat: raw.repeat === true, reason: String(raw.reason || '').replace(/[^\w\s,.'-]/g, '').slice(0, 80) }
  : null);

/** The line the tutor reads about pace (after the cache breakpoint, with the turn's context). */
export function paceContext(pace) {
  if (!pace || typeof pace !== 'object') return '';
  const level = Math.max(PACE_MIN, Math.min(PACE_MAX, Math.round(Number(pace.level) || 0)));
  const max = CHILD_SPEECH.maxWords[level];
  const lines = [];
  if (level < 0) lines.push(`Pace: slow. ${pace.reason ? `(${String(pace.reason).slice(0, 80)}.) ` : ''}Speak slower and shorter: at most ${max} words, one idea, one short question. Leave room for the child to think.`);
  else if (level > 0) lines.push(`Pace: a little brisker, the child is answering quickly and correctly. You may use at most ${max} words and a slightly harder step, but still one question.`);
  else lines.push(`Pace: steady. At most ${max} words.`);
  if (pace.repeat) lines.push('The child did not catch your last turn. Say the same idea again in simpler, shorter words. Do not add anything new, and do not give the answer.');
  return lines.join('\n');
}

// ---------------------------------------------------------------- voices
// Cartesia's docs list these as stable, pleasant voices for voice agents (the "recommended voices for
// voice agents" list, read 12 Nov 2026). The docs do not mark any voice as child-friendly or for
// teaching, so these are candidates to be heard, not verified: the tester panel switches between them.
// The first is the default. `earlier` is the id the tutor used before 12 Nov (its first choice).
export const TUTOR_VOICES = Object.freeze([
  { id: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', name: 'Skylar', note: 'US woman, stable and pleasant (default)' },
  { id: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc', name: 'Jacqueline', note: 'US woman, warmer' },
  { id: '62ae83ad-4f6a-430b-af41-a9bede9286ca', name: 'Gemma', note: 'British woman, closer to Kenyan school English than US' },
  { id: '47c38ca4-5f35-497b-b1a3-415245fb35e1', name: 'Daniel', note: 'US man' },
  { id: 'ef191366-f52f-447a-a398-ed8c0f2943a1', name: 'Archie', note: 'British man' },
  { id: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', name: 'Earlier choice', note: 'the voice used before 12 Nov' },
]);
export const DEFAULT_TUTOR_VOICE = TUTOR_VOICES[0].id;
export const isTutorVoice = (id) => TUTOR_VOICES.some((v) => v.id === id);
export const voiceLabel = (id) => TUTOR_VOICES.find((v) => v.id === id)?.name || 'custom voice';

export default { cleanPace, CHILD_LISTEN, CHILD_SPEECH, MATHS_KEYTERMS, TUTOR_VOICES, assessTranscript, askAgainLine, fixMathsWords, classifyChild, nextPace, newPace, paceFor, paceContext, endSilenceMs };
