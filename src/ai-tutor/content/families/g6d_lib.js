// ============================================================================
// GRADE 6 CURRICULUM FAMILIES (12 Nov 2026): the small kit the g6d_*.js files are written in.
// Same shape as g5c_lib.js, against the Grade 6 curriculum map (curriculumMap.g6.js).
//   fam({ id, cs, form, rung, gen })
// `cs` is the curriculum skill without its MATH.G6. prefix, such as 'NUMBER.FRACTIONS.RECIPROCAL'. From it the kit
// fills in cskill, outcome (the design's own code) and the HOREB skill the family is filed under (the map's primary).
// A wrong answer is [value, why, 'M_CODE']: the child-facing reason and the library misconception it reveals.
// Every family is DRAFT: reviewed is false until a person adds its id to g6d_signed.js.
// ============================================================================
import { SKILLS_G6 } from '../curriculumMap.g6.js';
import { SIGNED } from './g6d_signed.js';
import { family } from './core.js';
import { round, fmtNum } from './core.js';
export { randInt, pick, round, commas, fmtNum, person, sh, price, rot, shuffle, distinct, gcd, lcm, rnd, fl, digits, tbl, bars, ones, mc, words } from './g5c_lib.js';

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

export const fam = (d) => {
  const { cs, gen, id, form, rung, ...rest } = d;
  const ck = SKILLS_G6[`MATH.G6.${cs}`];
  if (!ck) throw new Error(`${id}: no curriculum skill MATH.G6.${cs}`);
  const letter = d.oc ? ck.outcomes.find(o => o.endsWith(`.${d.oc}`)) : ck.outcome;
  if (!letter) throw new Error(`${id}: outcome ${d.oc} not on ${cs}`);
  const draw = () => {
    const x = gen();
    if (!x) return null;
    // Every find-the-mistake question reads alike, and the gate counts alike questions as one form.
    // Naming the skill being practised keeps each one its own question.
    if (x.working && !x.topicDone) {
      const q = String(x.question);
      x.question = `Practising "${ck.name.charAt(0).toLowerCase()}${ck.name.slice(1)}": ${q.charAt(0).toLowerCase() === q.charAt(0) ? q : q.charAt(0) + q.slice(1)}`;
      x.topicDone = true;
    }
    if (x.parts) {
      for (const q of x.parts) { q.wrong = clean(q.wrong, q.answer, 2, d.allowNegative); if (!q.wrong) return null; }
    } else if (x.answer !== undefined && !x.options && !x.working) {
      if (typeof x.answer === 'number' && !Number.isFinite(x.answer)) return null;
      x.wrong = clean(x.wrong, x.answer, 3, typeof x.answer !== 'number' || d.allowNegative);
      if (!x.wrong) return null;
    } else if (x.options === null) return null;
    return x;
  };
  return family({ reviewed: SIGNED.includes(id), draft: true, ...rest, id, form, rung, skill: d.skill || ck.primary, cskill: `MATH.G6.${cs}`, outcome: letter, draw, make: x => x,
    check: (x, a) => (x.chk ? x.chk(a, a) : true) });
};

// A tap question from a right text and wrong ones [text, why, mis] (null when two texts match).
import { mc } from './g5c_lib.js';
export const ask = (right, wrongs, q, hints, steps, instruction = 'Choose the best answer.') => { const options = mc(right, wrongs); return options ? { question: q, options, instruction, hints, steps } : null; };
// A find-the-mistake working: three steps, one false.
export const spot = (stem, steps3, badIdx, fix, mis, hints) => ({ question: stem, working: steps3.map((text, i) => ({ text, ok: i !== badIdx })), fix, mis, hints: [].concat(hints), steps: [fix] });
