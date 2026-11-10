// ============================================================================
// GRADE 5 CURRICULUM FAMILIES: the small kit the g5c_*.js files are written in.
//
// One family is one object:
//   fam({ id, cs, form, rung, gen })
// `cs` is the curriculum skill without its MATH.G5. prefix, such as
// 'NUMBER.FRACTIONS.ADD_ONE_RENAMING'. From it the kit fills in cskill (the full
// code), outcome (the design's own outcome code) and the HOREB skill the family
// is filed under (the map's primary). `gen()` is draw and make in one: it picks
// numbers, rejects the draws that are no good by returning null, and returns what
// make returns anywhere else (question, answer, wrong, hints, steps, or parts,
// working or options) plus `chk`, a second relation the answer must satisfy.
//
// A wrong answer is [value, why, 'M_CODE']: the child-facing reason, and the
// library misconception it reveals (the code without the skill prefix).
// The kit drops a wrong answer equal to the right one or repeated, and rejects
// the draw when fewer than three distinct wrong answers are left (two for a part).
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas, fmtNum } from './core.js';
import { person, sh, price } from './kenya.js';
import { SKILLS_G5 } from '../curriculumMap.g5.js';
import { SIGNED } from './g5c_signed.js';   // ids of factory-made families a teacher has signed off (see scripts/apply-question-review.mjs)

export { randInt, pick, round, commas, fmtNum, person, sh, price };
export const rot = (a, k) => [...a.slice(k % a.length), ...a.slice(0, k % a.length)];
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const distinct = (...v) => new Set(v).size === v.length;
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const rnd = (n, to) => Math.round(n / to) * to;
export const fl = (n, to) => Math.floor(n / to) * to;
export const digits = (n) => String(n).split('').map(Number);
export const tbl = (head, rows) => ({ type: 'table', data: { head, rows: rows.map(cells => ({ cells })) } });
export const bars = (labels, vals) => ({ type: 'bar-chart', data: { bars: labels.map((label, i) => ({ label, value: vals[i] })) } });
export const ones = (n) => (n === 1 ? '' : 's');

// Options for a tap question: the right text and wrong ones [text, why, mis]. Null when two texts match.
export const mc = (right, wrongs) => {
  const texts = [String(right), ...wrongs.map(w => String(w[0]))];
  if (new Set(texts).size !== texts.length) return null;
  return shuffle([{ text: String(right), right: true }, ...wrongs.map(([text, why, mis]) => ({ text: String(text), right: false, why, mis }))]);
};

const clean = (wrong, answer, need, neg) => {
  const seen = new Set([fmtNum(answer)]);
  const out = [];
  for (const w of wrong || []) {
    const v = typeof w[0] === 'number' ? fmtNum(round(w[0], 3)) : String(w[0]);
    if (seen.has(v)) continue;
    if (typeof w[0] === 'number' && (!Number.isFinite(w[0]) || (!neg && w[0] < 0))) continue;
    seen.add(v); out.push(w);
  }
  return out.length >= need ? out : null;
};

export const fam = (d) => {
  const { cs, gen, id, form, rung, ...rest } = d;
  const ck = SKILLS_G5[`MATH.G5.${cs}`];
  if (!ck) throw new Error(`${id}: no curriculum skill MATH.G5.${cs}`);
  const letter = d.oc ? ck.outcomes.find(o => o.endsWith(`.${d.oc}`)) : ck.outcome;
  if (!letter) throw new Error(`${id}: outcome ${d.oc} not on ${cs}`);
  const draw = () => {
    const x = gen();
    if (!x) return null;
    // Every find-the-mistake question reads alike, and the gate counts alike questions as one
    // form. Naming the skill being practised keeps each one its own question.
    if (x.working && !x.topicDone) {
      const q = String(x.question);
      x.question = `Practising "${ck.name.charAt(0).toLowerCase()}${ck.name.slice(1).replace(/ \((proposed[^)]*)\)/, '')}": ${q.charAt(0).toLowerCase() === q.charAt(0) ? q : q.charAt(0) + q.slice(1)}`;
      x.topicDone = true;
    }
    if (x.parts) {
      for (const q of x.parts) { q.wrong = clean(q.wrong, q.answer, 2, d.allowNegative); if (!q.wrong) return null; }
    } else if (x.answer !== undefined && !x.options && !x.working) {
      if (typeof x.answer === 'number' && !Number.isFinite(x.answer)) return null;
      if (typeof x.answer === 'number') { x.wrong = clean(x.wrong, x.answer, 3, d.allowNegative); if (!x.wrong) return null; }
      else { x.wrong = clean(x.wrong, x.answer, 3, true); if (!x.wrong) return null; }
    } else if (x.options === null) return null;
    return x;
  };
  return family({ reviewed: SIGNED.includes(id), ...rest, id, form, rung, skill: ck.primary, cskill: `MATH.G5.${cs}`, outcome: letter, draw, make: x => x,
    check: (x, a) => (x.chk ? x.chk(a, a) : true) });
};

// ---- whole numbers in British words, up to 99,999 ---------------------------------------
const U = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const T = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const below100 = (n) => (n < 20 ? U[n] : T[Math.floor(n / 10)] + (n % 10 ? `-${U[n % 10]}` : ''));
const below1000 = (n) => (n < 100 ? below100(n) : `${U[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${below100(n % 100)}` : ''}`);
export const words = (n) => {
  if (n < 1000) return below1000(n);
  const th = Math.floor(n / 1000), r = n % 1000;
  return `${below100(th)} thousand${r === 0 ? '' : r < 100 ? ` and ${below100(r)}` : `, ${below1000(r)}`}`;
};
