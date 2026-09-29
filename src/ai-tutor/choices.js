// ============================================================================
// FOUR-CHOICE QUESTIONS (KPSEA style) — built only from real mistakes.
//
// Every wrong option is the answer a known misconception produces for THIS
// question (the problem's misconception list: authored + mistakes.js), so a
// wrong pick tells us WHAT the child believes, not just that they were wrong
// (Eedi / Diagnostic Questions). A question only becomes multiple choice when
// at least two such mistake options exist; the fourth option may be a place-
// value slip (x10 or /10), itself a catalogued misconception.
//
// Only a minority of lesson questions are shown this way (the rest stay typed
// so the child has to produce the answer), never in the free check, reviews or
// memory checks, and a choice answer is never the one that proves mastery.
// ============================================================================

import { checkAnswerMatch } from './answerCheck.js';

// Of the questions that CAN be a fair 4-choice item (about 1 in 5 in Grades
// 4-6), half are shown that way: roughly 1 question in 10 overall.
export const CHOICE_RATE = 1 / 2;

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fmt = (n) => String(Number(Number(n).toPrecision(12)));

// The options for a problem, or null when it can't be a fair 4-choice item.
export function buildChoices(problem) {
  if (!problem || problem.placeholder || problem.visual || problem.parts || problem.shownSteps) return null;
  const answer = String(problem.answer ?? '').trim();
  if (!answer || answer.length > 24) return null;
  const isWrong = (s) => s && !checkAnswerMatch(String(s), problem);
  const opts = [];
  const v = Number(answer);
  // A believable option: numbers within about ten times the answer. "81312"
  // for 164 + 778 is a real bug, but no child would pick it, so it stays as
  // feedback only.
  const plausible = (s) => {
    const d = Number(s);
    if (!Number.isFinite(v) || !Number.isFinite(d) || v === 0 || d === 0) return true;
    return Math.abs(Math.log10(Math.abs(d)) - Math.log10(Math.abs(v))) <= 1.05;
  };
  const push = (s) => { s = String(s).trim(); if (isWrong(s) && plausible(s) && !opts.some(o => o === s || checkAnswerMatch(o, { answer: s }))) opts.push(s); };
  for (const m of problem.misconceptions || []) if (m?.when != null && m.feedback) push(m.when);
  if (opts.length < 2) return null;
  if (opts.length < 3 && Number.isFinite(v) && v !== 0) {
    if (Number.isInteger(v)) { push(fmt(v * 10)); if (v % 10 === 0) push(fmt(v / 10)); }
    else { push(fmt(v * 10)); push(fmt(v / 10)); }
  }
  if (opts.length < 3) return null;
  // Big whole numbers read the way the question writes them: 21,600.
  const show = (x) => (/^\d{4,}$/.test(x) ? Number(x).toLocaleString('en-US') : x);
  return shuffle([answer, ...opts.slice(0, 3)].map(show));
}

// Serve-time decision: returns the problem with `mc` options attached, or as is.
export function maybeChoices(problem, { rate = CHOICE_RATE, random = Math.random } = {}) {
  if (!problem || problem.mc) return problem;
  // Naming questions that already carry their own options (acute/obtuse,
  // parallel/perpendicular) always show them.
  if (Array.isArray(problem.choices) && problem.choices.length >= 2 && problem.choices.length <= 4) {
    return { ...problem, mc: shuffle(problem.choices.map(String)), mcOwn: true };
  }
  if (random() >= rate) return problem;
  const mc = buildChoices(problem);
  return mc ? { ...problem, mc } : problem;
}

export const LETTERS = ['A', 'B', 'C', 'D'];
