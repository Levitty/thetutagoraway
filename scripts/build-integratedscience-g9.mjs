// INTEGRATED SCIENCE GRADE 9: merge the authored skills and misconceptions into curriculum/integrated_science/g9.json (HOREB owns it).
//   node scripts/build-integratedscience-g9.mjs   then   npm run subject:map -- integratedscience 9 --dir integrated_science --title "Integrated Science"
// Depth pass (18 Nov 2026): scripts/data/science-depth/g9.mjs through scripts/science-depth.mjs (teaching pack in curriculum/integrated_science/teaching/g9/).
// Idempotent. Official outcomes and sub-strand text are never touched. Skills 'proposed', misconceptions 'draft'.
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, MIS } from './data/integratedscience-g9-skills.mjs';
import { SUBS as DEPTH } from './data/science-depth/g9.mjs';
import { applyDepth } from './science-depth.mjs';
const path = new URL('../curriculum/integrated_science/g9.json', import.meta.url);
const g = JSON.parse(readFileSync(path, 'utf8'));
const P = 'INTE.G9.';
const subOf = (key) => { const s = g.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, id) => `${P}${sub}.${id}`;
const BY = new Map(SKILLS.map(([sub, id]) => [id, codeOf(sub, id)]));
const subOfSkill = new Map(SKILLS.map(([sub, id]) => [id, sub]));
let nPre = 0;
for (const [subKey, id, name, letters, pre, forms, mastery] of SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)); if (!o) throw new Error(`${id}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => { if (!BY.has(r)) throw new Error(`unknown prerequisite ${r}`); return { requires: BY.get(r), kind: 'skill', strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by an Integrated Science teacher.', status: 'proposed' }; });
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(subKey, id), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const seen = new Set();
for (const [skill, short, error, q, wrong, right, feedback, cause, help] of MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause: cause || 'The child mixes up two rules that are taught close together.', reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new situation.`, help: help || feedback, feedback, source: 'To confirm by an Integrated Science teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
g.totals = { ...g.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
const depth = applyDepth(g, DEPTH, { dir: 'integrated_science', grade: 9, prefix: P });
g.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting an Integrated Science teacher's review; depth pass 18 Nov 2026 (own cause and repair for every misconception, two new skills for outcomes 1.3 a and 3.1 b, prerequisites to Grades 4-8, four misconceptions per skill, teaching pack in curriculum/integrated_science/teaching/g9)";
writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
console.log(`integratedscience g9: ${g.totals.skills} skills, ${g.totals.prerequisites} prerequisites, ${g.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} (+${depth.pre} prerequisites, +${depth.mis} misconceptions, ${depth.pack} teaching pack entries)`);
