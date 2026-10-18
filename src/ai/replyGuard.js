// ============================================================================
// REPLY GUARD — the rule a model's reply must clear before a child sees it.
//
// This is the AI layer, deliberately outside src/ai-tutor: the tutor engine
// knows nothing about it, imports nothing from it, and works unchanged with
// the model switched off. Everything here is pure and offline — no network, no
// API key, no model. It takes a reply and answers one question: would showing
// this hand the learner the answer?
//
// A system prompt asking a model not to give the answer is a request. This is
// the rule: run leaksAnswer(), and when it fails, throw the reply away and
// serve the authored hint instead.
//
// Four ways an answer gets out, and all four are checked:
//   1. plainly               — "so the total is 9240"
//   2. ending a sentence     — "you are left with x=7."  (the digit boundary
//                              cannot tell that full stop from the point in 0.84)
//   3. spelled out           — "nine thousand two hundred and forty"
//   4. one trivial step away — "work out 1540 and 7700, then add them"
// The fourth is the one a human reviewer misses: no guard trips, and the child
// types the total without doing any of the thinking the question was for.
//
// Note on threat model: the answer is ALREADY on the device — generateProblem
// runs client-side, so a determined child can read it out of devtools whatever
// we do. This is not anti-cheat. It stops the tutor handing the answer to the
// vast majority of children who were not trying to cheat.
// ============================================================================
import { revealed } from '../ai-tutor/answerRule.js';

// ------------------------------------------------- 1b. word answers, spaced
// norm() strips whitespace, which is right for digits ("9 240" is 9240) but
// destroys the word boundary a word answer depends on: "so this one is
// isosceles" collapses to "…thisoneisisosceles", where \bisosceles\b no longer
// matches because a letter sits in front of it. Keep the spaces for these.
const normLoose = (s) => String(s ?? '').toLowerCase()
  .replace(/−/g, '-').replace(/,/g, '').replace(/\s+/g, ' ').trim();

export const revealedWord = (answer, text, question) => {
  const a = normLoose(answer);
  if (a.length < 2 || !/^[a-z][a-z\s'-]*$/.test(a)) return false;
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${esc}\\b`).test(normLoose(text)) && !normLoose(question).includes(a);
};

// ---------------------------------------------------------------- 2. in words
const SMALL = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SCALES = { hundred: 100, thousand: 1000, million: 1000000 };
const isNumberWord = (w) => w in SMALL || w in TENS || w in SCALES;

// Value of one run of number words: "nine thousand two hundred and forty" → 9240.
const runValue = (words) => {
  let total = 0, current = 0, counted = false;
  for (const w of words) {
    if (w in SMALL) { current += SMALL[w]; counted = true; }
    else if (w in TENS) { current += TENS[w]; counted = true; }
    else if (w === 'hundred') { current = (current || 1) * 100; counted = true; }
    else if (w in SCALES) { total += (current || 1) * SCALES[w]; current = 0; counted = true; }
    // "and" joins a run ("two hundred and forty") and is otherwise ignored.
  }
  return counted ? total + current : null;
};

/** A copy of the text with every run of number words replaced by its digits.
 *  Runs are joined with "|" so two separate small words ("the two ... each one")
 *  cannot collide into one number once norm() strips the spaces between them. */
export const digitsForWords = (text) => {
  const tokens = String(text ?? '').toLowerCase().split(/[^a-z0-9.]+/).filter(Boolean);
  const out = [];
  let run = [];
  const flush = () => {
    if (!run.length) return;
    const v = runValue(run);
    out.push(v == null ? run.join(' ') : String(v));
    run = [];
  };
  for (const t of tokens) {
    // A word that ends a sentence still counts: "…two hundred and forty." must
    // read as 9240, not stop at 9200 because the last token carries a full stop.
    const w = t.replace(/\.+$/, '');
    if (isNumberWord(w) || (w === 'and' && run.length)) { run.push(w); continue; }
    flush();
    out.push(t);
  }
  flush();
  return out.join(' | ');
};

// --------------------------------------------------- 3. one trivial step away
const numbersIn = (s) => (String(s ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).map(Number);

/** Does the reply hand over two numbers the child need only add or multiply?
 *  Numbers already visible in the question are excluded — quoting the operands
 *  back is what a good hint does ("work out 385 × 4 and 385 × 20"). */
const combinesToAnswer = (reply, question, target) => {
  // Only for answers of three digits or more. Below that, two numbers in a
  // skip-counting hint ("3, 6, 9…" for an answer of 15) land on the answer by
  // coincidence often enough to drown the real signal, and an answer that
  // small is caught by being named outright anyway.
  if (!Number.isInteger(target) || Math.abs(target) < 100) return null;

  // Numbers the child can already see, or read straight off what they can see.
  // Splitting a question number into its places is the method itself —
  // "(20 × 4) + (5 × 4)" for 25 × 4 — so 20 and 5 are not new information.
  const derived = new Set(numbersIn(question));
  for (const q of numbersIn(question)) {
    const s = String(Math.trunc(Math.abs(q)));
    for (let i = 0; i < s.length; i++) {
      if (+s[i]) derived.add(+s[i] * Math.pow(10, s.length - 1 - i));
    }
  }
  // Digits only, not spelled-out words: "a two-digit divisor … round to the
  // nearest ten" is prose, not two quantities a child can combine.
  const parts = [...new Set(numbersIn(reply))].filter((n) => n !== target);
  for (let i = 0; i < parts.length; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i], b = parts[j];
      // At least one has to be NEW. Two numbers the child was already looking
      // at landing on the answer together is arithmetic coincidence (20 and 5
      // from 25 multiply to 100, which is also 25 × 4); a number the reply
      // introduced is the one that carries the work.
      if (derived.has(a) && derived.has(b)) continue;
      if (a >= 1 && b >= 1 && a + b === target) return `${a} + ${b}`;
      if (a >= 2 && b >= 2 && a * b === target) return `${a} × ${b}`;
    }
  }
  return null;
};

// ---------------------------------------------------------------- the guard
/**
 * Check a reply that is about to be shown to a learner.
 * Returns null when it is safe, or a short reason when it is not.
 *
 *   leaksAnswer({ answer: '9240', question: 'A school buys 24 desks…',
 *                 accepts: ['9240'], reply: modelText })
 */
export const namesAnswer = ({ answer, accepts = [], question = '', reply = '' }) => {
  if (!reply) return null;
  // A full stop that ENDS a sentence is not part of a number, but revealed()'s
  // digit boundary cannot tell it from the point in "0.84" — so "you are left
  // with x=7." would slip through. Separate the sentence-enders and keep the
  // decimal points, then check that form too.
  const unpunctuated = String(reply).replace(/\.(?!\d)/g, ' ');
  const forms = [answer, ...(accepts || [])].filter((f) => f != null && String(f).trim() !== '');

  for (const form of forms) {
    if (revealed(form, reply, question)) return `states the answer (${form})`;
    if (revealed(form, unpunctuated, question)) return `states the answer (${form})`;
    if (revealedWord(form, reply, question)) return `names the answer (${form})`;
  }

  // Spelled-out numbers, checked against the PRIMARY answer only, and only
  // when that answer is a number. Two reasons: a word answer cannot be written
  // out in digits, and tokenising for this check separates words, which undoes
  // the whole-word boundary that keeps "no" from matching inside "No long
  // division needed". Accept-forms are left out too — they are alternate
  // renderings, and one of them colliding with a number in the prose ("borrow
  // one hour and turn it into sixty minutes") is coincidence, not a leak.
  const plain = String(answer ?? '').replace(/[\s,]/g, '');
  if (/^-?\d+(\.\d+)?$/.test(plain) && revealed(plain, digitsForWords(reply), question)) {
    return `spells out the answer (${answer})`;
  }

  return null;
};

/**
 * The full guard for a MODEL reply: namesAnswer, plus the stricter rule that
 * the reply must not leave the answer a single operation away.
 *
 * That last rule deliberately does NOT hold for our own hints, and the two
 * are separate functions for that reason. A hint ladder is graded — orient,
 * then method, then a concrete step — and its last rung is *supposed* to put
 * the calculation in front of the child ("2 × 100 = ?"), because they have
 * already had two gentler tries and still have to do the arithmetic. A model
 * reply has no ladder: it is one shot, and handing over "1540 and 7700, add
 * them" ends the thinking the question existed for.
 */
export const leaksAnswer = (args) => {
  const named = namesAnswer(args);
  if (named) return named;
  const { answer, question = '', reply = '' } = args;
  if (!reply) return null;
  const target = Number(String(answer).replace(/[\s,]/g, ''));
  if (Number.isFinite(target)) {
    const pair = combinesToAnswer(reply, question, target);
    if (pair) return `leaves the answer one step away (${pair})`;
  }
  return null;
};

export default { revealedWord, digitsForWords, namesAnswer, leaksAnswer };
