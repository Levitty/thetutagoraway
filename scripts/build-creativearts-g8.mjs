// CREATIVE ARTS AND SPORTS GRADE 8: merge the authored skills and misconceptions into curriculum/creative_arts/g8.json (HOREB owns it).
//   node scripts/build-creativearts-g8.mjs   then   npm run subject:map -- creativearts 8 --dir creative_arts --title "Creative Arts and Sports"
// Idempotent. Official outcomes and sub-strand text are never touched. Skills 'proposed', misconceptions 'draft'.
// Depth pass (18 Nov 2026): scripts/data/creativearts-depth/g8.mjs adds prerequisites, misconceptions to four per skill, the
// teaching pack (curriculum/creative_arts/teaching/g8/) through scripts/science-depth.mjs, and the practical outcomes each
// knowledge skill supports (teacher_rubric: marked by the teacher with the KICD rubric, never a phone question).
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, MIS } from './data/creativearts-g8-skills.mjs';
import { SUBS as DEPTH } from './data/creativearts-depth/g8.mjs';
import { applyRubric } from './data/creativearts-depth/lib.mjs';
import { applyDepth } from './science-depth.mjs';
const path = new URL('../curriculum/creative_arts/g8.json', import.meta.url);
const g = JSON.parse(readFileSync(path, 'utf8'));
const P = 'CREA.G8.';
const subOf = (key) => { const s = g.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, id) => `${P}${sub}.${id}`;
const BY = new Map(SKILLS.map(([sub, id]) => [id, codeOf(sub, id)]));
const subOfSkill = new Map(SKILLS.map(([sub, id]) => [id, sub]));
let nPre = 0;
for (const [subKey, id, name, letters, pre, forms, mastery] of SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)); if (!o) throw new Error(`${id}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => { if (!BY.has(r)) throw new Error(`unknown prerequisite ${r}`); return { requires: BY.get(r), kind: 'skill', strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by a Creative Arts and Sports teacher.', status: 'proposed' }; });
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(subKey, id), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const seen = new Set();
for (const [skill, short, error, q, wrong, right, feedback] of MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause: 'The child mixes up two rules that are taught close together.', reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new situation.`, help: feedback, feedback, source: 'To confirm by a Creative Arts and Sports teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
g.totals = { ...g.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
const nRubric = applyRubric(g, DEPTH, P);
const depth = applyDepth(g, DEPTH, { dir: 'creative_arts', grade: 8, prefix: P, derive: true, title: 'Creative Arts and Sports' });
g.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting a Creative Arts and Sports teacher's review; depth pass 18 Nov 2026 (two or more prerequisites and four misconceptions per skill, practical outcomes marked by the teacher with the KICD rubric, teaching pack in curriculum/creative_arts/teaching/g8)";
writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
console.log(`creative arts g8: ${g.totals.skills} skills, ${g.totals.prerequisites} prerequisites, ${g.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (+${depth.pre} prerequisites, +${depth.mis} misconceptions, ${depth.fix} causes fixed, ${depth.pack} teaching pack entries, ${nRubric} practical outcomes to the teacher's rubric)`);
