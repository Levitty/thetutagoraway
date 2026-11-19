// ============================================================================
// GRADES 2 AND 3 CURRICULUM FAMILIES (19 Nov 2026): the small kit g2c_cov.js and g3c_cov.js are
// written in. It is the coverage kit (cov.js) cut for the youngest learners, filed under the
// curriculum map the way the Grade 5 kit (g5c_lib.js) files its families.
//
// One family is  yfam({ id, g, cs, oc?, form, rung, gen }).
//   g   the grade (2 or 3); cs the curriculum skill without its MATH.G<g>. prefix, such as
//       'MEASUR.MASS.MEASURE_IN_KG'. From it the kit fills in cskill, the official outcome (the
//       skill's first, or the letter given as oc) and the HOREB skill (the map's primary).
//   gen() picks numbers, returns null to throw a draw away, and otherwise returns question,
//       answer, wrong, hints, steps (or options), plus chk, a second relation the answer must satisfy.
// Every family is `young: true` (read aloud, big buttons) and draft: reviewed: false until a
// teacher signs it off from docs/qa/maths-g2-g3-review-2026-11-19.md. Young learners get a whole
// number to type (the lesson builds three buttons from the first wrong value, so the first wrong
// is the misconception most worth catching) or at most three short options.
//
// A wrong answer is [value, why, 'M_CODE'], the code a misconception of the skill's sub-strand in
// the map. The kit drops a wrong equal to the right answer or repeated, keeps one option for one
// idea, and throws the draw away when fewer than two distinct wrong answers are left.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, fmtNum } from './core.js';
import { person, twoPeople } from './kenya.js';
import { SKILLS_G2 } from '../curriculumMap.g2.js';
import { SKILLS_G3 } from '../curriculumMap.g3.js';

export { randInt, pick, person, twoPeople };
const MAPS = { 2: SKILLS_G2, 3: SKILLS_G3 };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const distinct = (...v) => new Set(v).size === v.length;
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Options for a tap question: the right text and wrong ones [text, why, mis]. Null when two texts
// match or two wrong options carry the same idea. `fixed` keeps the order given (yes before no).
export const mc = (right, wrongs, fixed) => {
  const texts = [String(right), ...wrongs.map(w => String(w[0]))];
  if (new Set(texts).size !== texts.length) return null;
  const codes = wrongs.map(w => w[2]).filter(c => c && c !== 'SLIP');
  if (new Set(codes).size !== codes.length) return null;
  const o = [{ text: String(right), right: true }, ...wrongs.map(([text, why, mis]) => ({ text: String(text), right: false, why, mis }))];
  return fixed ? o : shuffle(o);
};
// Yes or no, always in that order.
export const yesNo = (rightIsYes, yesText, noText, why, mis) => {
  const o = [{ text: yesText, right: rightIsYes }, { text: noText, right: !rightIsYes }];
  const wrong = o.find(x => !x.right); wrong.why = why; wrong.mis = mis;
  return o;
};

const clean = (wrong, answer) => {
  const seen = new Set([fmtNum(answer)]), ideas = new Set(), out = [];
  for (const w of wrong || []) {
    const v = typeof w[0] === 'number' ? fmtNum(w[0]) : String(w[0]);
    if (seen.has(v) || (typeof w[0] === 'number' && (!Number.isFinite(w[0]) || w[0] < 0))) continue;
    if (w[2] && w[2] !== 'SLIP' && ideas.has(w[2])) continue;
    seen.add(v); if (w[2]) ideas.add(w[2]); out.push(w);
  }
  return out.length >= 2 ? out : null;
};

export const yfam = (d) => {
  const { g, cs, oc, gen, ...rest } = d;
  const code = `MATH.G${g}.${cs}`, ck = MAPS[g]?.[code];
  if (!ck) throw new Error(`${d.id}: no curriculum skill ${code}`);
  const outcome = oc ? ck.outcomes.find(o => o.endsWith(`.${oc}`)) : ck.outcome;
  if (!outcome) throw new Error(`${d.id}: outcome ${oc} not on ${code}`);
  const draw = () => {
    const x = gen();
    if (!x) return null;
    if (x.options === null) return null;
    if (x.answer !== undefined && !x.options) {
      if (!Number.isFinite(x.answer)) return null;
      x.wrong = clean(x.wrong, x.answer);
      if (!x.wrong) return null;
    }
    return x;
  };
  return family({ reviewed: false, draft: true, young: true, ...rest, skill: ck.primary, cskill: code, outcome, draw, make: x => x,
    check: (x, a) => (x.chk ? x.chk(a) : true) });
};
