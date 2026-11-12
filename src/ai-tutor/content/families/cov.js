// ============================================================================
// COVERAGE FAMILIES (12 Nov 2026): the small kit g6_cov.js and g8_cov.js are written in.
// Authored offline, no model call at any point. Every family is DRAFT: it is off for
// children (reviewed: false, the one switch in core.js) until a Kenyan maths teacher
// signs it off from docs/qa/new-families-2026-11-12.md.
//
// A family is cov({ id, skill, outcome, form, rung, gen }). gen() is draw and make in
// one: it picks numbers, returns null to throw a draw away, and otherwise returns what
// make returns anywhere else (question, answer, wrong, hints, steps, or options, or
// parts) plus `chk`, a second relation the answer must satisfy (the answer for a typed
// question, the list of part answers for a question in parts). A wrong answer is
// [value, 'what the child believed']. The kit drops a wrong answer equal to the right
// one or repeated, and throws the draw away when fewer than three distinct wrong
// answers are left (two for a part): wrong answers come from named mistakes only.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas, fmtNum } from './core.js';
import { person, sh } from './kenya.js';

export { randInt, pick, round, commas, fmtNum, person, sh };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const distinct = (...v) => new Set(v.map(x => (typeof x === 'number' ? round(x, 6) : x))).size === v.length;
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const frac = (n, d) => { const g = gcd(Math.abs(n), d); return `${n / g}/${d / g}`; };
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// A tap question: the right text, and wrong ones [text, why]. Null when two texts match.
export const mc = (right, wrongs) => {
  const texts = [String(right), ...wrongs.map(w => String(w[0]))];
  if (new Set(texts).size !== texts.length) return null;
  return shuffle([{ text: String(right), right: true }, ...wrongs.map(([text, why]) => ({ text: String(text), right: false, why }))]);
};
// The same, with the options kept in the order given (a natural order such as a, b, c).
export const mcFixed = (right, wrongs, order) => {
  const o = mc(right, wrongs);
  return o && order ? order.map(t => o.find(x => x.text === String(t))) : o;
};

const clean = (wrong, answer, need, neg) => {
  const seen = new Set([typeof answer === 'number' ? fmtNum(answer) : String(answer)]);
  const out = [];
  for (const w of wrong || []) {
    const v = typeof w[0] === 'number' ? fmtNum(round(w[0], 3)) : String(w[0]);
    if (seen.has(v)) continue;
    if (typeof w[0] === 'number' && (!Number.isFinite(w[0]) || (!neg && w[0] < 0))) continue;
    seen.add(v); out.push(w);
  }
  return out.length >= need ? out : null;
};

export const cov = (d) => {
  const { gen, ...rest } = d;
  const draw = () => {
    const x = gen();
    if (!x) return null;
    if (x.parts) {
      for (const q of x.parts) { q.wrong = clean(q.wrong, q.answer, 2, d.allowNegative); if (!q.wrong) return null; }
    } else if (x.options === null) return null;
    else if (x.answer !== undefined && !x.options && !x.working) {
      if (typeof x.answer === 'number' && !Number.isFinite(x.answer)) return null;
      x.wrong = clean(x.wrong, x.answer, 3, d.allowNegative || typeof x.answer !== 'number');
      if (!x.wrong) return null;
    }
    return x;
  };
  return family({ reviewed: false, draft: true, ...rest, draw, make: x => x, check: (x, a) => (x.chk ? x.chk(a) : true) });
};

// Superscripts for standard form.
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
export const sup = (n) => String(n).split('').map(c => SUP[c]).join('');
