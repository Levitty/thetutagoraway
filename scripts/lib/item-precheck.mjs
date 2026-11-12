// ============================================================================
// THE FREE HALF OF THE BLIND REVIEWER: deterministic checks every item must pass
// before a person or a model reads it. No model calls, no network, no learner
// data. Each check returns { id, level: 'hard' | 'soft', message }.
//   hard: the item must not reach a reviewer (a wrong key, a broken string)
//   soft: a reviewer should look (reading level, unnamed distractor, vague words)
// The model pass (solve the item without the key) is NOT built here.
// ============================================================================
import { checkAnswerMatch } from '../../src/ai-tutor/answerCheck.js';
import { buildChoices } from '../../src/ai-tutor/choices.js';
import { checkTextAnswer } from '../../src/ai-tutor/answerCheckText.js';
import { textOf, senseFlags } from '../../engine/scripts/content_measures.mjs';

export const CHECKS = ['key', 'distractors', 'reading', 'ambiguity', 'units'];

// English problems (marker: 'text') are marked by answerCheckText.js: the Maths marker ignores articles, punctuation and word order.
const marks = (x, p) => (p.marker === 'text' ? checkTextAnswer(x, p) : checkAnswerMatch(x, p));

// ---- 1. the answer key computes ---------------------------------------------
// An arithmetic expression in the question is evaluated here, independently of
// whatever produced the key; then the key must mark itself right, exactly one
// option must be right, and no named wrong answer may be marked right.
const clean = (s) => String(s).replace(/[−–]/g, '-').replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/,(?=\d{3}\b)/g, '').replace(/\s+/g, '');
export function evaluateExpression(question) {
  // Only a question that is the expression itself: "What is 12 + 8?", "345 - 129 = ?".
  const m = String(question).trim().match(/^(?:(?:what is|work out|calculate|find|evaluate|simplify)\s*:?\s*)?((?:\(?-?\d[\d,]*(?:\.\d+)?\)?\s*[+\-−×x÷*/]\s*)+\(?-?\d[\d,]*(?:\.\d+)?\)?)\s*(?:=\s*\?|\?|\.)?$/i);
  if (!m) return null;
  const expr = clean(m[1]);
  if (!/^[\d.+\-*/()]+$/.test(expr)) return null;
  try { const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? v : null; } catch { return null; }
}
const numeric = (a) => { const v = Number(String(a).replace(/[,\s]/g, '')); return Number.isFinite(v) ? v : null; };

export function checkKey(p) {
  const out = [];
  const bad = (message) => out.push({ id: 'key', level: 'hard', message });
  if (p.parts) {
    for (const q of p.parts) if (!marks(String(q.answer), q)) bad(`part key does not mark itself right: ${String(q.prompt).slice(0, 50)}`);
    return out;
  }
  if (p.shownSteps) {
    const falseSteps = (p.workingTruth || []).filter(ok => !ok).length;
    if (p.workingTruth && falseSteps !== 1) bad(`working has ${falseSteps} false steps, needs exactly 1`);
    return out;
  }
  if (p.answer == null || String(p.answer).trim() === '') { bad('no answer key'); return out; }
  if (!marks(String(p.answer), p)) bad(`key does not mark itself right: ${p.answer}`);
  const opts = p.mc || p.choices || (p.marker === 'text' ? null : buildChoices(p));
  if (opts) {
    const right = opts.filter(o => marks(String(o), p)).length;
    if (right !== 1) bad(`${right} options marked right`);
    if (new Set(opts.map(String)).size !== opts.length) bad('options repeat');
  }
  for (const m of p.misconceptions || []) if (m.when != null && !p.choices && marks(String(m.when), p)) bad(`named wrong answer "${m.when}" is marked right`);
  const v = /\d\/\d/.test(String(p.question)) ? null : evaluateExpression(p.question);
  const k = numeric(p.answer);
  if (v != null && k != null && Math.abs(v - k) > 1e-9 && !/estimate|round|nearest|approximately|about|remainder|how many (times|groups|whole)/i.test(p.question)) bad(`the question computes to ${v}, the key says ${p.answer}`);
  return out;
}

// ---- 2. every distractor maps to a named misconception -----------------------
// A wrong option or accepted wrong answer must carry feedback saying what the
// child believed. An item carrying a `cskill` (Grade 5 curriculum map) must also
// name a library code. Items with no wrong answers at all are reported.
export function checkDistractors(p, { family = false } = {}) {
  const out = [];
  const soft = (message) => out.push({ id: 'distractors', level: 'soft', message });
  const list = (p.parts ? p.parts.flatMap(q => q.mistakes || []) : p.misconceptions) || [];
  if (p.shownSteps) { if (!(p.mis || []).length) soft('a working with no misconception named'); return out; }
  if (!list.length) { soft('no wrong answer carries a named misconception'); return out; }
  const opts = p.choices || null;
  if (opts) {
    const wrong = opts.filter((_, i) => !(p.optionTruth || [])[i]);
    const unnamed = wrong.filter(o => !list.some(m => String(m.when) === String(o) && m.feedback));
    if (unnamed.length) soft(`${unnamed.length} of ${wrong.length} wrong options have no feedback naming the mistake`);
  }
  const empty = list.filter(m => !m.feedback || String(m.feedback).trim().length < 12);
  if (empty.length) soft(`${empty.length} wrong answer(s) with no real feedback`);
  if (family && p.cskill) { const nocode = list.filter(m => !(m.mis || []).length && !(p.mis || []).length); if (nocode.length) soft(`${nocode.length} wrong answer(s) name no library code`); }
  return out;
}

// ---- 3. reading level for a ten-year-old ---------------------------------------
const syll = (w) => { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length); };
export function readingStats(text) {
  const sentences = String(text).split(/(?<=[.?!])\s+/).map(s => s.replace(/[^A-Za-z' -]/g, ' ').trim()).filter(s => /[A-Za-z]{2}/.test(s));
  const words = sentences.flatMap(s => s.split(/\s+/).filter(w => /[A-Za-z]/.test(w)));
  if (!words.length) return { words: 0, longest: 0, fk: 0, hard: 0 };
  const syl = words.reduce((s, w) => s + syll(w), 0);
  const fk = 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
  return { words: words.length, longest: Math.max(...sentences.map(s => s.split(/\s+/).length)), fk, hard: words.filter(w => syll(w) >= 4).length / words.length };
}
// Allowed Flesch-Kincaid grade: the child's grade plus two (English is a second or
// third language for many). A ten-year-old is Grade 5. Mathematical terms the
// curriculum teaches (denominator, perpendicular) are not penalised by name.
export function checkReading(p, grade = 5) {
  const out = [];
  const q = [p.instruction, p.question, ...(p.parts || []).map(x => x.prompt)].filter(Boolean).join(' ');
  const s = readingStats(q);
  const cap = Math.max(5, grade + 2);
  // The Flesch-Kincaid formula counts English syllables: it says nothing about Kiswahili (KISW.) items, so only sentence and question length apply to them.
  if (s.words >= 12 && s.fk > cap && !/^KISW\./.test(p.cskill || '')) out.push({ id: 'reading', level: 'soft', message: `reading grade ${s.fk.toFixed(1)}, above ${cap} for Grade ${grade}` });
  if (s.longest > 30) out.push({ id: 'reading', level: 'soft', message: `a sentence of ${s.longest} words` });
  if (String(p.question || '').length > 420) out.push({ id: 'reading', level: 'hard', message: 'question too long to read on a phone' });
  return out;
}

// ---- 4. ambiguity markers --------------------------------------------------------
const VAGUE = /\b(several|a few|a lot( of)?|roughly|or so|etc\.?|maybe|perhaps|it depends|might be|and\/or|a bit|quite|fairly|nearly all)\b/i;
const BROKEN = /undefined|\bNaN\b|Infinity|\[object Object\]|\{\w+\}|%s|\$\{|\bTODO\b|lorem ipsum|\bnull\b/;
export function checkAmbiguity(p) {
  const out = [];
  const q = String(p.question || '');
  const all = textOf(p);
  if (BROKEN.test(all)) out.push({ id: 'ambiguity', level: 'hard', message: `broken text: "${all.match(BROKEN)[0]}"` });
  if (!p.parts && (q.match(/\?/g) || []).length > 1) out.push({ id: 'ambiguity', level: 'soft', message: 'two questions in one item' });
  const v = q.match(VAGUE);
  if (v && !/\b(estimate|about how|roughly how)\b/i.test(q)) out.push({ id: 'ambiguity', level: 'soft', message: `vague word "${v[0]}"` });
  if (/\b(not|never|except|no)\b[^.?]{0,40}\b(not|never|no|none)\b/i.test(q)) out.push({ id: 'ambiguity', level: 'soft', message: 'double negative' });
  if (/\b(approximately|about|nearly|almost)\b/i.test(q) && !/\b(estimate|round|nearest|approximate)/i.test(q) && /^-?\d+(\.\d+)?$/.test(String(p.answer || ''))) out.push({ id: 'ambiguity', level: 'soft', message: 'asks "about" but the key is exact' });
  if (/\bhow (long|far|heavy|tall|high|wide|deep|old)\b/i.test(q) && !p.parts && !p.model && !p.visual && !/\b(km|kilomet|metre|meter|cm|centimet|mm|millimet|kg|kilogram|gram|litre|ml|millilit|minute|hour|second|day|week|month|year|shilling|ksh|sh\b|degree|°|%|percent|cent|sides|angle|marks?)/i.test(`${q} ${p.answer} ${p.unit || ''} ${(p.choices || []).join(' ')}`)) out.push({ id: 'ambiguity', level: 'soft', message: 'asks for an amount with no unit anywhere' });
  return out;
}

// ---- 5. units and Kenyan context sane ---------------------------------------------
const IMPERIAL = /\b(miles?|inch(es)?|feet|\d+\s?(foot|ft)|yards?|lbs?|ounces?|gallons?|fahrenheit)\b|°F|\d\s?pounds?\b/i;
const CURRENCY = /\$|\bdollars?\b|£|\beuros?\b/i;
const FOREX = /forex|bureau|exchange|currency|convert|\bchanges?\b[^.?]{0,40}\binto\b|\bbuys? (sh|USh|KSh)|Ugandan|Tanzanian|\brate\b/i;
const AMERICAN = /\b(color|meter|meters|liter|liters|center|centers|favorite|gray|neighbor|neighbors|traveled|traveling|realize|organize)\b/i;
const SANE = [
  [/\b(?:is|are|aged?)\s+(\d{1,3})\s+years? old\b/i, (v, q) => (/\b(learner|pupil|child|boy|girl|student|brother|sister)\b/i.test(q) ? v >= 3 && v <= 20 : v <= 110), 'a person\'s age'],
  [/\b(?:matatu|bus|car|lorry|truck)\b[^.?]{0,40}?(\d{2,4})\s*km\/h/i, (v) => v >= 10 && v <= 140, 'a road vehicle\'s speed'],
  [/\b(?:walks?|walked|walking)\b[^.?]{0,40}?(\d+(?:\.\d+)?)\s*km\/h/i, (v) => v >= 1 && v <= 8, 'a walking speed'],
  [/\b(?:cycles?|cycled|bicycle|boda)\b[^.?]{0,40}?(\d+(?:\.\d+)?)\s*km\/h/i, (v) => v >= 5 && v <= 60, 'a cycling speed'],
  [/\b(?:temperature|weather|day|night)\b[^.?]{0,40}?(-?\d+(?:\.\d+)?)\s*°\s?C/i, (v, q) => (/freez|ice|Antarctic|Arctic|oven|boil|steam/i.test(q) ? true : v >= -5 && v <= 45), 'a Kenyan air temperature'],
  [/\b(?:learner|pupil|child|boy|girl|man|woman)\b[^.?]{0,40}?(\d{2,3})\s*kg\b/i, (v) => v >= 8 && v <= 200, 'a person\'s mass'],
  [/\b(?:learner|pupil|child|boy|girl|man|woman)\b[^.?]{0,30}?\b(?:tall|height)\b[^.?]{0,30}?(\d{2,3})\s*cm/i, (v) => v >= 40 && v <= 215, 'a person\'s height'],
  [/\b(?:class|classroom)\b[^.?]{0,40}?(\d{2,3})\s*(?:learners|pupils|children|students)/i, (v) => v >= 5 && v <= 100, 'a class size'],
];
export function checkUnits(p) {
  const out = [];
  const q = [p.question, ...(p.parts || []).map(x => x.prompt), ...(p.choices || [])].filter(Boolean).join(' ');
  const fx = FOREX.test(q);
  if (IMPERIAL.test(q) && !(fx && /pounds?/i.test(q.match(IMPERIAL)[0]))) out.push({ id: 'units', level: 'hard', message: `imperial unit "${q.match(IMPERIAL)[0]}" (Kenya uses metric)` });
  if (CURRENCY.test(q) && !fx) out.push({ id: 'units', level: 'hard', message: `currency other than shillings: "${q.match(CURRENCY)[0]}"` });
  if (AMERICAN.test(q)) out.push({ id: 'units', level: 'soft', message: `American spelling "${q.match(AMERICAN)[0]}"` });
  if (/KSh\s?\d|Ksh\.?\s?\d|\d\s?\/=/.test(q) && /\bshillings?\b/i.test(q)) out.push({ id: 'units', level: 'soft', message: 'money written two ways in one question' });
  for (const [re, ok, what] of SANE) { const m = q.match(re); if (m && !ok(Number(m[1]), q)) out.push({ id: 'units', level: 'soft', message: `${what} of ${m[1]} is not believable` }); }
  for (const f of senseFlags(p)) out.push({ id: 'units', level: /no single answer|broken/.test(f) ? 'hard' : 'soft', message: f });
  return out;
}

export function precheckItem(p, { grade = 5, family = false } = {}) {
  return [...checkKey(p), ...checkDistractors(p, { family }), ...checkReading(p, grade), ...checkAmbiguity(p), ...checkUnits(p)];
}
