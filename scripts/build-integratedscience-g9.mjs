// INTEGRATED SCIENCE GRADE 9: merge the authored skills and misconceptions into curriculum/integrated_science/g9.json (HOREB owns it).
//   node scripts/build-integratedscience-g9.mjs   then   npm run subject:map -- integratedscience 9 --dir integrated_science --title "Integrated Science"
// Idempotent. Official outcomes and sub-strand text are never touched. Skills 'proposed', misconceptions 'draft'.
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, MIS } from './data/integratedscience-g9-skills.mjs';
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
for (const [skill, short, error, q, wrong, right, feedback] of MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause: 'The child mixes up two rules that are taught close together.', reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new situation.`, help: feedback, feedback, source: 'To confirm by an Integrated Science teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
g.totals = { ...g.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
g.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting an Integrated Science teacher's review";
writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
console.log(`integratedscience g9: ${SKILLS.length} skills, ${nPre} prerequisites, ${MIS.length} misconceptions`);
