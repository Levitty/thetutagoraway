// ============================================================================
// THE CHILD'S SPOKEN ANSWER, read and marked (12 Nov 2026, the first test-set run).
//
// The seal used to mark the child's whole sentence as if it were a typed answer, so
// "One half. Because he got one part and there are two parts." was wrong against 1/2,
// and about 98 right answers in the first run were marked wrong. A child at a voice
// tutor answers in words, in sentences, hedged, sometimes in Kiswahili. This file reads
// what they said into the answers it contains, and marks those against the sealed
// question with the homework marker (src/school/homeworkSitting.js markItem): the same
// rules as before, given the answer the child actually gave.
//
//   readAnswer(text)        { found: [{ value, kind, words, negated }], question, choiceOr, filler, lost, again, yes, no }
//                           numbers ("four", "4", "nne"), fractions ("one half", "a half", "two quarters", "four
//                           eighths", "two over four", "one piece out of two", "nusu", "robo", "robo tatu", "1/2")
//   markSpoken(item, text)  { correct, mis, attempt, said }   attempt false: a question back, a filler, "I don't
//                           know", a request to hear it again: not an answer, so never marked wrong
//   canonAnswer(answer)     one form for an answer ("one half" and "1/2" are both "1/2"), to remember what was found
//   childMove(text)         'filler' | 'lost' | 'question' | 'stop' | null: what a message is, when it is not an answer
//   speakAnswer(text)       the child's answer as HOREB says it back ("one half"), or null
//
// Pure. Tested in tests/voice-tutor-spoken-answer.test.mjs.
// ============================================================================
import { markItem } from '../school/homeworkSitting.js';
import { checkAnswerMatch } from '../ai-tutor/answerCheck.js';
import { fixMathsWords } from './childVoice.js';

const UNITS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
// Kiswahili numbers (a child mixing languages counts in either).
const SW = { moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5, sita: 6, saba: 7, nane: 8, tisa: 9, kumi: 10 };
const DEN = {
  half: 2, halves: 2, third: 3, thirds: 3, quarter: 4, quarters: 4, fourth: 4, fourths: 4, fifth: 5, fifths: 5,
  sixth: 6, sixths: 6, seventh: 7, sevenths: 7, eighth: 8, eighths: 8, ninth: 9, ninths: 9, tenth: 10, tenths: 10,
  eleventh: 11, elevenths: 11, twelfth: 12, twelfths: 12, hundredth: 100, hundredths: 100,
};
// A bare denominator word, with no number before it, is one of them ("half", "a quarter"). Plurals alone are not ("into halves").
const SINGLE = new Set(['half', 'third', 'quarter', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth']);
// Kiswahili fraction words: nusu (a half), robo (a quarter; robo tatu, three quarters), theluthi (a third; theluthi mbili).
const SW_DEN = { nusu: 2, robo: 4, theluthi: 3 };
const NEGATE = new Set(['not', 'isnt', "isn't", 'arent', "aren't", 'never', 'nor']);
const FILLERS = new Set(['um', 'umm', 'ummm', 'uh', 'uhh', 'uhm', 'hmm', 'hmmm', 'mm', 'mmm', 'er', 'erm', 'ah', 'ahh', 'eh', 'ehh', 'so', 'like', 'well', 'wait', 'oh', 'aaa', 'eee', 'mmh', 'let', 'me', 'think']);
const LOST = /\b(i (do ?n[o']?t|dont) know|idk|no idea|not sure|i'?m (lost|confused)|confus\w*|sijui|sielewi|sijaelewa|i give up)\b/i;
const AGAIN = /\b(again|repeat|didn'?t hear|did not hear|can'?t hear|cannot hear|can'?t see|cannot see|did not see|didn'?t see|what did you say|sorry\?)\b/i;
// A question without its question mark (speech-to-text often drops it). Not "wait": "Wait, it is three" is an answer.
const QUESTION_START = /^(why|how|what|which|where|when|who|can (you|i|we)|could (you|i|we)|do (you|i|we)|does|did you|is it|is that|is this|are they|are these|so is|but why|but how)\b/i;
const STOP = /\b(i (want|wanna|would like) to (stop|go|play|leave|rest|finish)|can (we|i) (stop|go|play|leave|rest|finish)|let'?s stop|stop (now|please|the lesson)|i'?m (so )?(bored|tired)|i am (so )?(bored|tired)|this is (so )?boring|(so|too|very) boring|boring|no more (maths|math|fractions)|i do ?n[o']?t want to (do|learn|play) (this|maths|math|fractions|any ?more)|i (do ?n[o']?t|dont) want to any ?more|enough (now|for today)|nimechoka(?! na maisha)|nataka kucheza|nataka kuacha|tuache)\b/i;
const YES = new Set(['yes', 'yeah', 'yep', 'yup', 'ndiyo', 'ndio', 'sure', 'correct', 'right', 'true', 'aha', 'uhuh']);
const NO = new Set(['no', 'nope', 'hapana', 'false', 'wrong', 'la']);
// Words that compare: the child restating the question's own word is a yes ("Are they the same?" "They look the same size").
const COMPARE = ['same', 'equal', 'equivalent', 'bigger', 'smaller', 'more', 'less', 'longer', 'shorter', 'larger', 'greater'];
// Words that mean the same thing for a word answer.
const SYNONYM = { same: ['equal', 'equivalent', 'same amount', 'same size'], equal: ['same', 'equivalent'], bigger: ['larger', 'greater'], larger: ['bigger', 'greater'], smaller: ['less', 'littler'], more: ['bigger', 'larger', 'greater'], less: ['smaller', 'fewer'] };

const numberWords = (w) => (w in UNITS || w in TENS || w in SW || w === 'hundred');
const tokensOf = (text) => fixMathsWords(String(text || '')).toLowerCase().replace(/[’`´]/g, "'")
  .replace(/(\d)\s*\/\s*(\d)/g, '$1/$2')
  .replace(/[^a-z0-9/' ]+/g, ' ').split(/\s+/).filter(Boolean).map((t) => t.replace(/^'+|'+$/g, '')).filter(Boolean);

/** A run of number words or a numeral at tokens[i]: { n, end } (end is the index after it), or null. */
function numberAt(t, i) {
  const w = t[i];
  if (w == null) return null;
  if (/^\d+$/.test(w)) return { n: Number(w), end: i + 1 };
  if (w in SW) return { n: SW[w], end: i + 1 };
  if (!(w in UNITS || w in TENS)) return null;
  let n = 0; let j = i;
  if (t[j] in TENS) { n += TENS[t[j]]; j += 1; if (t[j] in UNITS && UNITS[t[j]] < 10) { n += UNITS[t[j]]; j += 1; } }
  else { n += UNITS[t[j]]; j += 1; }
  if (t[j] === 'hundred') { n *= 100; j += 1; if (t[j] === 'and') j += 1; const r = numberAt(t, j); if (r && r.n < 100) { n += r.n; j = r.end; } }
  return { n, end: j };
}

/**
 * Everything the child's words contain that could be an answer, in order.
 * kind: 'fraction' (value 'n/d'), 'count' (the n of "two quarters", for "how many quarters?"), 'number'.
 */
export function readAnswer(text) {
  const raw = String(text || '');
  const t = tokensOf(raw);
  const found = [];
  const add = (value, kind, from, to) => found.push({ value, kind, words: t.slice(from, to).join(' '), negated: NEGATE.has(t[from - 1]) || NEGATE.has(t[from - 2]) && t[from - 1] === 'the' });
  for (let i = 0; i < t.length;) {
    const w = t[i];
    const frac = /^(\d+)\/(\d+)$/.exec(w);
    if (frac) { add(`${Number(frac[1])}/${Number(frac[2])}`, 'fraction', i, i + 1); i += 1; continue; }
    if (w in SW_DEN) {
      const after = numberAt(t, i + 1);
      if (after && t[i + 1] in SW) { add(`${after.n}/${SW_DEN[w]}`, 'fraction', i, after.end); i = after.end; continue; }
      add(`1/${SW_DEN[w]}`, 'fraction', i, i + 1); i += 1; continue;
    }
    if ((w === 'a' || w === 'an') && SINGLE.has(t[i + 1])) { add(`1/${DEN[t[i + 1]]}`, 'fraction', i, i + 2); i += 2; continue; }
    if (SINGLE.has(w)) { add(`1/${DEN[w]}`, 'fraction', i, i + 1); i += 1; continue; }
    const num = numberAt(t, i);
    if (!num) { i += 1; continue; }
    const j = num.end;
    if (t[j] in DEN) { add(`${num.n}/${DEN[t[j]]}`, 'fraction', i, j + 1); add(String(num.n), 'count', i, j + 1); i = j + 1; continue; }
    if (t[j] === 'over') { const d = numberAt(t, j + 1); if (d) { add(`${num.n}/${d.n}`, 'fraction', i, d.end); i = d.end; continue; } }
    // "one piece out of two", "four out of eight", "3 parts out of 4"
    let k = j; while (k < j + 2 && t[k] && !numberWords(t[k]) && !/^\d/.test(t[k]) && !(t[k] === 'out' && t[k + 1] === 'of')) k += 1;
    if (t[k] === 'out' && t[k + 1] === 'of') { const d = numberAt(t, k + 2); if (d) { add(`${num.n}/${d.n}`, 'fraction', i, d.end); add(String(num.n), 'count', i, j); i = d.end; continue; } }
    // "four pieces": the thing counted goes with the number, so HOREB can say it back as the child did.
    const noun = /^(pieces?|parts?|bits?|slices?|shares?|halves|quarters)$/.test(t[j] || '') ? 1 : 0;
    add(String(num.n), 'number', i, j + noun); i = j + noun;
  }
  const trimmed = raw.trim();
  const question = /\?/.test(trimmed) || QUESTION_START.test(trimmed);
  // "Is it bigger or the same?" names two answers: a question, not a choice.
  const choiceOr = question && /\bor\b/i.test(trimmed);
  const filler = t.length > 0 && t.every((w) => FILLERS.has(w));
  const firstYes = t.findIndex((w) => YES.has(w));
  const firstNo = t.findIndex((w, k) => NO.has(w) || (w === 'think' && t[k - 1] && /^(don'?t|dont|not)$/.test(t[k - 1])) || NEGATE.has(w));
  return {
    found, question, choiceOr, filler, tokens: t,
    lost: LOST.test(raw), again: AGAIN.test(raw), stop: wantsToStop(raw),
    yes: firstYes >= 0 && (firstNo < 0 || firstYes < firstNo), no: firstNo >= 0 && (firstYes < 0 || firstNo < firstYes),
  };
}

const wordsOf = (s) => String(s || '').toLowerCase().replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean)
  .filter((w) => !['a', 'an', 'the', 'it', 'is', 'its', "it's", 'they', 'are', 'one'].includes(w));
const isWordAnswer = (a) => /^[a-z][a-z\s'-]*$/i.test(String(a || '').trim()) && !readAnswer(a).found.length;
const isYesNo = (a) => /^(yes|no)$/i.test(String(a || '').trim());

/** The phrase `want` (words) in `t` (words), not negated just before. */
const hasPhrase = (t, want) => {
  if (!want.length) return false;
  for (let i = 0; i + want.length <= t.length; i += 1) {
    if (want.every((w, k) => t[i + k] === w) && !NEGATE.has(t[i - 1]) && !(t[i - 1] === 'the' && NEGATE.has(t[i - 2]))) return true;
  }
  return false;
};

/** One form for an answer: "1/2" for "one half", "4" for "four", the plain words for a word answer. */
export function canonAnswer(answer) {
  const a = String(answer ?? '').trim();
  if (!a) return '';
  const r = readAnswer(a);
  const vals = r.found.filter((f) => f.kind !== 'count');
  if (vals.length === 1) return vals[0].value;
  return wordsOf(a).join(' ') || a.toLowerCase();
}

/**
 * Mark what the child said against a sealed item.
 * @returns {{ correct:boolean, mis:string|null, attempt:boolean, said:string|null, why:string }}
 *   attempt false: not an answer at all (a question back, "umm", "I don't know", "say it again"); never wrong.
 *   said: the child's words for the answer they gave ("one half"), for HOREB to say back.
 */
export function markSpoken(item, text) {
  const raw = String(text ?? '').trim().slice(0, 200);
  const r = readAnswer(raw);
  const none = (why) => ({ correct: false, mis: null, attempt: false, said: null, why });
  if (!raw || r.filler) return none('filler');
  // The marker as it was, on the words exactly as given (a typed "2/4", a letter for a choice).
  const exact = markItem(item, raw);
  if (exact.correct) return { correct: true, mis: null, attempt: true, said: speakAnswer(raw) || null, why: 'exact' };

  const answers = [item.answer, ...(item.accepts || [])].filter((x) => x != null && String(x).trim() !== '');
  // The key's own spoken forms too: "one half" as a key is "1/2".
  const keyForms = [...new Set(answers.flatMap((a) => [String(a), canonAnswer(a)]).filter(Boolean))];
  const keyed = { ...item, accepts: [...new Set([...(item.accepts || []), ...keyForms])] };
  const tryForm = (form) => (item.kind === 'choice' ? markItem(item, form) : markItem(keyed, form));
  const live = r.found.filter((f) => !f.negated);
  const ok = (said, why) => ({ correct: true, mis: null, attempt: true, said, why });

  if (!r.choiceOr) {
    if (item.kind === 'choice') {
      // A choice said aloud: the one option whose words are in what they said.
      const hits = item.options.filter((o) => hasPhrase(wordsOf(raw), wordsOf(o.text)) || live.some((f) => checkAnswerMatch(f.value, { answer: o.text, accepts: [o.text] })));
      if (hits.length === 1) return hits[0].right ? ok(hits[0].text, 'choice') : { correct: false, mis: hits[0].mis || null, attempt: true, said: null, why: 'choice' };
    } else {
      for (const f of live) if (tryForm(f.value).correct) return ok(f.words, f.kind);
      // Word answers ("the same", "smaller", "the top one"): the key's words in what they said, not negated.
      const t = wordsOf(raw);
      for (const a of answers) {
        if (!isWordAnswer(a) || isYesNo(a)) continue;
        const want = wordsOf(a);
        if (want.length && want.length <= 4 && (hasPhrase(t, want) || (want.length === 1 && (SYNONYM[want[0]] || []).some((s) => hasPhrase(t, wordsOf(s)))))) return ok(String(a).trim().toLowerCase(), 'words');
      }
      // Yes and no, and a yes/no question whose key is its own word ("Is 2/4 the same as 1/2?" with the key "same").
      const key = String(item.answer || '').trim().toLowerCase();
      const q = String(item.question || '').toLowerCase();
      const yesNoQ = /^(is|are|does|do|can|will|would|was|were)\b/.test(q.trim());
      const keyInQ = isWordAnswer(key) && wordsOf(key).length && hasPhrase(wordsOf(q), wordsOf(key));
      const affirms = r.yes || (!r.no && COMPARE.some((c) => hasPhrase(t, [c]) && q.includes(c)));
      if (key === 'yes' && affirms) return ok('yes', 'yes');
      if (key === 'no' && r.no) return ok('no', 'no');
      if (yesNoQ && keyInQ && affirms) return ok(key, 'yes');
      if ((key === 'yes' && r.no) || (key === 'no' && r.yes) || (yesNoQ && keyInQ && r.no)) return { correct: false, mis: null, attempt: true, said: null, why: 'yes/no' };
    }
  }
  // Not right. A question, a filler, "I don't know" or "say it again" is not an answer: never marked wrong.
  if (r.question || r.lost || r.again) return none(r.lost ? 'lost' : r.again ? 'again' : 'question');
  // A number or fraction key, and no number or fraction in what they said: they have not answered it yet.
  const numericKey = answers.some((a) => readAnswer(a).found.length || /\d/.test(String(a)));
  if (item.kind !== 'choice' && numericKey && !live.length) return none('no answer in it');
  // Wrong: the misconception the first wrong answer they gave reveals.
  for (const f of live) { const m = tryForm(f.value); if (m.mis) return { correct: false, mis: m.mis, attempt: true, said: null, why: 'wrong' }; }
  return { correct: false, mis: exact.mis || null, attempt: true, said: null, why: 'wrong' };
}

/** What a message that is not an answer is doing. */
export function childMove(text) {
  const r = readAnswer(text);
  if (!String(text || '').trim()) return null;
  if (r.stop) return 'stop';
  if (r.filler) return 'filler';
  if (r.lost) return 'lost';
  if (r.question || r.again) return 'question';
  return null;
}
export const soundsLost = (text) => LOST.test(String(text || ''));
// Choosing the quick game HOREB offered ("can we play the guessing game?") is not asking to stop.
export const wantsToStop = (text) => STOP.test(String(text || '')) && !/\b(game|guess|guessing)\b/i.test(String(text || ''));
// "Yes", "ok", "let us carry on": after a care reply, the child says they want to go on.
const CARRY_ON = /\b(yes|yeah|yep|ok|okay|ready|carry on|continue|go on|let'?s (go|continue|carry on)|i am fine|i'?m fine|i'?m ok(ay)?|i want to (carry on|continue|learn)|ndiyo|sawa|tuendelee)\b/i;
export const wantsToCarryOn = (text) => CARRY_ON.test(String(text || '')) && !wantsToStop(text);

// ---------------------------------------------------------------- saying an answer back
const UNIT_WORDS = Object.keys(UNITS);
const DEN_WORDS = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 7: ['seventh', 'sevenths'], 8: ['eighth', 'eighths'], 9: ['ninth', 'ninths'], 10: ['tenth', 'tenths'], 11: ['eleventh', 'elevenths'], 12: ['twelfth', 'twelfths'] };
export const numberInWords = (n) => (n >= 0 && n < 20 ? UNIT_WORDS[n] : n < 100 && n % 10 === 0 ? Object.keys(TENS)[n / 10 - 2] : String(n));
/** "1/2" as "one half", "3/4" as "three quarters", "4" as "four"; null for anything else. */
export function inWords(value) {
  const m = /^(\d+)\/(\d+)$/.exec(String(value));
  if (m) { const n = Number(m[1]); const d = Number(m[2]); const dw = DEN_WORDS[d]; return dw && n <= 19 ? `${numberInWords(n)} ${dw[n === 1 ? 0 : 1]}` : null; }
  return /^\d+$/.test(String(value)) && Number(value) < 100 ? numberInWords(Number(value)) : null;
}
/** The child's answer as HOREB says it back: their own words when they said it in words, or the numerals in words. */
export function speakAnswer(said) {
  const s = String(said || '').trim();
  if (!s || /^(yes|no)$/i.test(s)) return null; // "Yes, yes." is not naming anything
  if (/^[a-z][a-z '-]{0,38}$/i.test(s)) return s.toLowerCase();
  const f = readAnswer(s).found.find((x) => x.kind !== 'count');
  return f ? (inWords(f.value) || null) : null;
}

export default { readAnswer, markSpoken, canonAnswer, childMove, soundsLost, wantsToStop, wantsToCarryOn, speakAnswer, inWords };
