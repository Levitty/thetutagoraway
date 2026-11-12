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
//   childMove(text)         'filler' | 'lost' | 'question' | 'tentative' | 'stop' | null: what a message is, when it is not
//                           a plain answer ('tentative': an answer said as a question, "Is it two quarters?")
//   isTentative, mainClause, saidClass, keyClass, namesIn, reasonWords: reading an answer out of a sentence (run 2)
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
const FILLERS = new Set(['um', 'umm', 'ummm', 'uh', 'uhh', 'uhm', 'hmm', 'hmmm', 'mm', 'mmm', 'er', 'erm', 'ah', 'ahh', 'aah', 'aahh', 'eh', 'ehh', 'ehhh', 'so', 'like', 'well', 'wait', 'oh', 'aaa', 'eee', 'mmh', 'let', 'me', 'think']);
const LOST = /\b(i (do ?n[o']?t|dont) know|idk|no idea|not sure|i'?m (lost|confused)|confus\w*|sijui|sielewi|sijaelewa|i give up|i (can'?t|cannot|can not) do (it|this|that))\b/i;
// Asking to hear or see it again; not "each half is cut again" (12 Nov 2026, run 2: that made answers into questions).
const AGAIN = /\b((say|show|do|read|ask|tell|explain|draw|see|hear|go over|play)\b[^.?!]{0,24}\bagain|again,? please|one more time|repeat|didn'?t hear|did not hear|can'?t hear|cannot hear|can'?t see|cannot see|did not see|didn'?t see|what did you say|sorry\?)\b/i;
// A question without its question mark (speech-to-text often drops it). Not "wait": "Wait, it is three" is an answer.
const QUESTION_START = /^(why|how|what|which|where|when|who|can (you|i|we)|could (you|i|we)|do (you|i|we)|does|did you|is it|is that|is this|are they|are these|so is|but why|but how)\b/i;
const STOP = /\b(i (want|wanna|would like) to (stop|go|play|leave|rest|finish)|can (we|i) (really )?(stop|go|play|leave|rest|finish)|let'?s stop|stop (now|please|the lesson)|i'?m (so )?(bored|tired)|i am (so )?(bored|tired)|this is (so )?boring|(so|too|very) boring|boring|no more (maths|math|fractions)|i do ?n[o']?t want to (do|learn|play) (this|maths|math|fractions|any ?more)|i (do ?n[o']?t|dont) want to any ?more|enough (now|for today)|nimechoka(?! na maisha)|nataka kucheza|nataka kuacha|tuache|bye|goodbye|good bye|bye bye|kwaheri|i am going (now|home|to play)|i'?m going (now|home|to play)|i am (really )?going now|i'?m (really )?going now)\b/i;
// Words before "one" that make it a pronoun ("the top one"), not a number.
const PRONOUN_BEFORE = new Set(['this', 'that', 'the', 'which', 'each', 'every', 'any', 'another', 'other', 'no', 'top', 'bottom', 'middle', 'left', 'first', 'second', 'third', 'last', 'big', 'bigger', 'biggest', 'small', 'smaller', 'smallest', 'shaded', 'white', 'new', 'same', 'red', 'blue', 'green', 'orange', 'little', 'long', 'longer', 'short', 'shorter', 'right', 'wrong', 'hard', 'easy', 'next', 'old', 'whole']);
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
    // "the top one", "this one", "each one": a pronoun, not the number one (12 Nov 2026, run 2: "The top one is bigger"
    // matched an accepted "the bottom one", and "This one sounds hard" was marked as an answer).
    if (w === 'one' && PRONOUN_BEFORE.has(t[i - 1]) && !(t[i + 1] in DEN) && !['over', 'out'].includes(t[i + 1])) { i += 1; continue; }
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
  // "two shaded, four in all" ("Mbili shaded, na pieces ni four in all"): the shaded count over the whole.
  if (!found.some((f) => f.kind === 'fraction')) {
    const nums = found.filter((f) => f.kind === 'number');
    const at = (f) => t.indexOf(f.words.split(' ')[0]);
    const shadedN = nums.find((f) => /^(pieces? |parts? )?(are |is )?(shaded|coloured|colored|eaten)\b/.test(t.slice(at(f) + 1, at(f) + 4).join(' ')));
    const allN = nums.find((f) => f !== shadedN && /^(pieces? |parts? )?(in all|altogether|in total|total)\b/.test(t.slice(at(f) + 1, at(f) + 4).join(' ')));
    if (shadedN && allN && Number(shadedN.value) <= Number(allN.value)) found.push({ value: `${shadedN.value}/${allN.value}`, kind: 'fraction', words: `${shadedN.words} out of ${allN.words}`, negated: false });
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

// ---------------------------------------------------------------- what the answer is, in a sentence
// The answer is in the main clause; "because ..." is the reason (12 Nov 2026, run 2: "Barasa gets more, because a
// half is bigger than a fifth" named two fractions, so it matched nothing and was marked wrong).
const REASON_START = /\b(because|cause|coz|cos|since|kwa sababu)\b/i;
const LEAD = /^[\s.,!?'"-]*((um+|uh+|hmm+|er+m?|so|well|oh|ok|okay|wait|but|and)[\s.,!?'"-]+)*/i;
const stripLead = (x) => String(x || '').replace(LEAD, '');
/** The words of the answer, before any reason. A message that starts with "because" is all reason: no answer in it. */
export function mainClause(text) {
  const lead = stripLead(text);
  const m = REASON_START.exec(lead);
  return m ? lead.slice(0, m.index) : lead;
}
/**
 * The sentence a comparison or a place is read from: in several sentences the first that names one ("The same amount!
 * Cutting it more doesn't make it smaller."), unless a later one corrects it ("Smaller? Hmm, no, maybe bigger").
 */
function classSentence(text) {
  const before = mainClause(text);
  const sents = String(before).split(/(?<=[.!?])\s+/).filter((x) => x.trim());
  if (sents.length < 2) return before;
  const has = (x) => tokensOf(x).some((w) => classOfWord(w, 'compare') || classOfWord(w, 'place'));
  let pick = sents.findIndex(has);
  if (pick < 0) return before;
  for (let k = pick + 1; k < sents.length; k += 1) if (CORRECTION.test(sents[k]) && has(sents[k])) pick = k;
  return CORRECTION.test(sents[pick]) ? sents.slice(pick).join(' ') : sents[pick];
}
const CORRECTION = /^\W*(?:(?:hmm+|um+|uh+|so|oh)\W+)*(no|wait|actually|i mean|sorry|hapana)\b/i;

// Words that say which: comparing (the same, bigger, smaller) and where (the top one, the bottom one). One class each:
// a child's comparison or position answer must be the sealed one's class (12 Nov 2026, run 2: "Less, because the
// second has more pieces" was marked right against "same", "The top one is bigger" right against "bottom").
const CLASSES = {
  compare: { same: ['same', 'equal', 'equivalent', 'sawa'], bigger: ['bigger', 'larger', 'greater', 'more', 'longer', 'biggest', 'largest'], smaller: ['smaller', 'less', 'fewer', 'shorter', 'littler', 'lesser', 'smallest'] },
  place: { top: ['top', 'above', 'upper'], bottom: ['bottom', 'below', 'lower'], middle: ['middle', 'centre', 'center'] },
};
const classOfWord = (w, kind) => Object.entries(CLASSES[kind]).find(([, ws]) => ws.includes(w))?.[0] || null;
/** The class a key belongs to ("the same amount" is compare/same, "the bottom one" is place/bottom), or null. */
export function keyClass(answer) {
  const t = tokensOf(answer);
  for (const kind of Object.keys(CLASSES)) {
    const hits = [...new Set(t.map((w) => classOfWord(w, kind)).filter(Boolean))];
    if (hits.length === 1) return { kind, cls: hits[0] };
  }
  return null;
}
/**
 * The class the child's answer names, of one kind: in the main clause, not negated; in "A is bigger than B" the word
 * before "than" (and for a place, the first one: "the top one is bigger than the bottom one"); otherwise the last one
 * said ("Smaller? No, maybe bigger" is bigger: the child changed their mind).
 */
export function saidClass(text, kind) {
  const t = tokensOf(classSentence(text));
  let hits = [];
  t.forEach((w, i) => {
    const c = classOfWord(w, kind);
    if (c && !NEGATE.has(t[i - 1]) && !(t[i - 1] === 'the' && NEGATE.has(t[i - 2]))) hits.push({ c, i });
  });
  if (!hits.length) return null;
  const than = t.indexOf('than');
  if (than >= 0) {
    const before = hits.filter((h) => h.i < than);
    if (before.length) hits = before;
    if (kind === 'place') return hits[0].c;
  }
  return hits[hits.length - 1].c;
}

// Names in a question, each with the fraction said beside it ("Barasa gets one half ... Asha gets one fifth").
const NOT_NAMES = new Set(['who', 'which', 'what', 'whose', 'where', 'when', 'how', 'the', 'is', 'are', 'same', 'now', 'here', 'if', 'look', 'yes', 'no', 'each', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'they', 'she', 'he', 'it', 'and', 'or', 'but', 'then', 'there', 'this', 'that', 'do', 'does', 'can', 'tell', 'say', 'shade', 'show', 'cut', 'think', 'you', 'we', 'my', 'your', 'horeb', 'top', 'bottom', 'half', 'whole', 'which', 'both']);
/** { name (lower case): fraction } from a question's own words. */
export function namesIn(question) {
  const raw = String(question || '');
  const out = {};
  const re = /\b([A-Z][a-z]{2,})\b/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    if (NOT_NAMES.has(name) || name in out) continue;
    const after = raw.slice(m.index + m[0].length).split(/\b[A-Z][a-z]{2,}\b/)[0].split(/\s+/).slice(0, 8).join(' ');
    const f = readAnswer(after).found.find((x) => x.kind === 'fraction');
    if (f) out[name] = f.value;
  }
  return out;
}
/** The fraction the child named by naming its person ("Wafula gets the bigger piece"), when the question gave one. */
const namedFraction = (item, text) => {
  const names = namesIn(item.question);
  const t = tokensOf(mainClause(text));
  const hit = [...new Set(t.filter((w) => w in names))];
  return hit.length === 1 ? { value: names[hit[0]], words: hit[0] } : null;
};

// A question the child asks to find something out (why, how, what...), not an answer said as a question.
const REAL_Q = /^(why|how|what|which|where|when|who|whose|can|could|do|does|did|will|would|should|shall|may|must|are you|have you)\b/i;
const HEDGE = /\b(maybe|i think|i guess|perhaps|probably|not sure|i'?m not sure|is it|nadhani|labda)\b/i;
const sentencesIn = (raw) => String(raw || '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
/** Something in the answer part that could be an answer: a number, a fraction, a comparison or a place. */
const NOT_COUNTED = /^(minutes?|seconds?|hours?|days?|years?|times|o'?clock|more|of)$/;
const hasCandidate = (text) => readAnswer(mainClause(text)).found.some((f) => !f.negated && !(f.kind === 'number' && NOT_COUNTED.test(tokensOf(mainClause(text))[tokensOf(mainClause(text)).indexOf(f.words.split(' ').at(-1)) + 1] || ''))) || !!saidClass(text, 'compare') || !!saidClass(text, 'place');
/**
 * An answer said as a question or hedged ("Is it two quarters?", "Maybe one half?", "I think four?"): it is an answer,
 * said tentatively (12 Nov 2026, run 2: these were read as the child asking a question, and never marked).
 * Not "Why do we cut it again?" (a real question), not "Is it two or four?" (two answers), not a message that is all reason.
 */
export function isTentative(text) {
  const raw = String(text || '').trim();
  if (!raw || !hasCandidate(raw)) return false;
  const qs = sentencesIn(raw).filter((x) => /\?\s*$/.test(x));
  if (qs.some((x) => REAL_Q.test(stripLead(x)) || /\bor\b/i.test(x))) return false;
  return qs.length > 0 || QUESTION_START.test(raw) || HEDGE.test(raw);
}

/** The child's own words that could be a reason: what is left once the answer, the fillers and their questions are taken out. */
export function reasonWords(text) {
  const raw = String(text || '');
  const because = REASON_START.exec(raw);
  if (because) return tokensOf(raw.slice(because.index));
  const kept = sentencesIn(raw).filter((x) => !/\?\s*$/.test(x)).join(' ');
  const r = readAnswer(kept);
  const answerWords = new Set(r.found.flatMap((f) => f.words.split(' ')));
  const SKIP = new Set(['maybe', 'think', 'i', 'it', 'is', 'its', "it's", 'the', 'a', 'an', 'yes', 'no', 'pieces', 'piece', 'parts', 'part', 'amount', 'size', 'they', 'are', 'that', 'this']);
  return tokensOf(kept).filter((w) => !FILLERS.has(w) && !answerWords.has(w) && !classOfWord(w, 'compare') && !classOfWord(w, 'place') && !SKIP.has(w));
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
  const none = (why) => ({ correct: false, mis: null, attempt: false, said: null, why, tentative: false });
  if (!raw || r.filler) return none('filler');
  // Said as a question or hedged ("Is it four?", "Maybe one half?"): an answer, marked, with tentative set so the
  // tutor asks how sure they are and why.
  const tentative = isTentative(raw);
  const ok = (said, why) => ({ correct: true, mis: null, attempt: true, said, why, tentative });
  const no = (mis, why) => ({ correct: false, mis: mis || null, attempt: true, said: null, why, tentative });
  // The marker as it was, on the words exactly as given (a typed "2/4", a letter for a choice).
  const exact = markItem(item, raw);
  if (exact.correct) return ok(speakAnswer(raw) || null, 'exact');

  const answers = [item.answer, ...(item.accepts || [])].filter((x) => x != null && String(x).trim() !== '');
  // The key's own spoken forms too: "one half" as a key is "1/2".
  const keyForms = [...new Set(answers.flatMap((a) => [String(a), canonAnswer(a)]).filter(Boolean))];
  const keyed = { ...item, accepts: [...new Set([...(item.accepts || []), ...keyForms])] };
  const tryForm = (form) => (item.kind === 'choice' ? markItem(item, form) : markItem(keyed, form));
  // The answer is in the main clause when there is one: what comes after "because" is the reason.
  const main = mainClause(raw);
  const mainFound = readAnswer(main).found.filter((f) => !f.negated);
  const live = mainFound.length ? mainFound : r.found.filter((f) => !f.negated);
  const named = namedFraction(item, raw);

  if (!r.choiceOr) {
    if (item.kind === 'choice') {
      // A choice said aloud: the one option whose words are in what they said, its fraction, its person, or its class.
      const optFrac = (o) => readAnswer(o.text).found.find((f) => f.kind === 'fraction')?.value || null;
      const pick = (hits) => (hits.length === 1 ? (hits[0].right ? ok(hits[0].text, 'choice') : no(hits[0].mis, 'choice')) : null);
      const byWords = item.options.filter((o) => hasPhrase(wordsOf(main), wordsOf(o.text)) || live.some((f) => checkAnswerMatch(f.value, { answer: o.text, accepts: [o.text] })));
      const byName = named ? item.options.filter((o) => optFrac(o) === named.value) : [];
      const said = saidClass(raw, 'compare');
      const byClass = said ? item.options.filter((o) => keyClass(o.text)?.cls === said && keyClass(o.text)?.kind === 'compare') : [];
      const got = pick(byWords) || pick(byName) || pick(byClass);
      if (got) return got;
    } else {
      // A comparison or a place: the class the child named must be the key's ("less" is not "the same").
      const kc = answers.map(keyClass).find(Boolean);
      const said = kc ? saidClass(raw, kc.kind) : null;
      if (kc && said) return said === kc.cls ? ok(String(item.answer).trim().toLowerCase(), 'class') : no(null, 'class');
      for (const f of live) if (tryForm(f.value).correct) return ok(f.words, f.kind);
      if (named && tryForm(named.value).correct) return ok(named.words, 'name');
      // Word answers ("the same", "smaller", "the top one"): the key's words in what they said, not negated.
      const t = wordsOf(raw);
      for (const a of answers) {
        if (!isWordAnswer(a) || isYesNo(a)) continue;
        const want = wordsOf(a);
        if (want.length && want.length <= 4 && (hasPhrase(t, want) || (want.length === 1 && (SYNONYM[want[0]] || []).some((x) => hasPhrase(t, wordsOf(x)))))) return ok(String(a).trim().toLowerCase(), 'words');
      }
      // Yes and no, and a yes/no question whose key is its own word ("Is 2/4 the same as 1/2?" with the key "same").
      const key = String(item.answer || '').trim().toLowerCase();
      const q = String(item.question || '').toLowerCase();
      const yesNoQ = /^(is|are|does|do|can|will|would|was|were)\b/.test(q.trim());
      const keyInQ = isWordAnswer(key) && wordsOf(key).length && hasPhrase(wordsOf(q), wordsOf(key));
      // The child restating the question's own comparing word is a yes ("Are they the same size?" "They look the same").
      const restates = !r.no && COMPARE.some((c) => hasPhrase(t, [c]) && q.includes(c));
      const affirms = r.yes || restates;
      if (key === 'yes' && affirms) return ok('yes', 'yes');
      if (key === 'no' && r.no) return ok('no', 'no');
      if (yesNoQ && keyInQ && affirms) return ok(key, 'yes');
      if ((key === 'yes' && r.no) || (key === 'no' && r.yes) || (yesNoQ && keyInQ && r.no)) return no(null, 'yes/no');
    }
  }
  // Not right. A question, a filler, "I don't know" or "say it again" is not an answer: never marked wrong. An answer
  // said as a question, or with "I'm not sure", is (tentative).
  if (r.again) return none('again');
  if (r.question && !tentative) return none('question');
  if (r.lost && !hasCandidate(raw)) return none('lost');
  // A number or fraction key, and no number or fraction in what they said: they have not answered it yet.
  const numericKey = answers.some((a) => readAnswer(a).found.length || /\d/.test(String(a)));
  if (item.kind !== 'choice' && numericKey && !live.length && !named) return none('no answer in it');
  // Wrong: the misconception the first wrong answer they gave reveals.
  for (const f of live) { const m = tryForm(f.value); if (m.mis) return no(m.mis, 'wrong'); }
  return no(exact.mis, 'wrong');
}

// ---------------------------------------------------------------- number words heard as their sound-alikes
// The microphone hears "two" as "too" and "three" as "tree" (12 Nov 2026, run 2026-11-12-1824, scenario 30: "Umm, too?"
// was read as a question to the tutor, and "Umm, tree?" became "You asked tree."). They are read as numbers only when a
// number is being asked for, and only where they stand as the answer: alone, after the hedges and fillers, or before the
// thing counted ("tree pieces"); never inside a sentence ("I want to go", "for two children", "I ate it").
const SOUND_ALIKE = { too: 'two', to: 'two', tu: 'two', tree: 'three', for: 'four', fore: 'four', fife: 'five', ate: 'eight', won: 'one' };
const ANSWER_LEAD = /^(?:[\s,.!?…'"-]*(?:um+|uh+|hmm+|mm+|er+m?|eh+|a+h+|so|well|oh|ok(?:ay)?|maybe|perhaps|probably|i think|i guess|is it|it is|it'?s|its|i'?m not sure|not sure)\b)*[\s,.!?…'"-]*/i;
const SOUND_ALIKE_ANSWER = new RegExp(`^(${Object.keys(SOUND_ALIKE).join('|')})(\\s+(?:equal\\s+)?(?:pieces?|parts?|slices?|bits?|halves|quarters|thirds|sixths|eighths))?[\\s.?!…'"-]*$`, 'i');
/**
 * The child's words with a sound-alike number read as the number, when a number is being asked for (`numberOpen`):
 * "Umm, too?" -> "Umm, two?". Anything else is returned as it came.
 */
export function hearNumbers(text, { numberOpen = true } = {}) {
  const raw = String(text ?? '');
  if (!numberOpen || !raw.trim()) return raw;
  const lead = ANSWER_LEAD.exec(raw)?.[0] || '';
  const rest = raw.slice(lead.length);
  const m = SOUND_ALIKE_ANSWER.exec(rest);
  if (!m) return raw;
  return `${lead}${SOUND_ALIKE[m[1].toLowerCase()]}${rest.slice(m[1].length)}`;
}
/** Does this question ask for a number (a count, or "what number")? */
export const asksForNumber = (q) => /\b(how many|what number|count (them|the|how)|which number)\b/i.test(String(q || ''));

/** What a message that is not an answer is doing. */
export function childMove(text) {
  const r = readAnswer(text);
  if (!String(text || '').trim()) return null;
  if (r.stop) return 'stop';
  if (r.filler) return 'filler';
  // "Because each half was cut in two?": the child giving a reason, not asking.
  if (REASON_START.test(stripLead(text).split(/\s+/).slice(0, 1).join(' '))) return null;
  // "Is it four?", "I'm not sure, maybe four?": an answer said tentatively, not a question and not lost.
  if (!r.again && isTentative(text)) return 'tentative';
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

export default { readAnswer, markSpoken, canonAnswer, childMove, hearNumbers, asksForNumber, isTentative, mainClause, saidClass, keyClass, namesIn, reasonWords, soundsLost, wantsToStop, wantsToCarryOn, speakAnswer, inWords };
