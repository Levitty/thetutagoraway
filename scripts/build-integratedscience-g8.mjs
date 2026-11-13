// ============================================================================
// INTEGRATED SCIENCE GRADE 8: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/integrated_science/g8.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-integratedscience-g8.mjs      then  npm run subject:map -- integratedscience 8 --dir integrated_science --title "Integrated Science"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/integratedscience-g8-skills.mjs every run.
// Grade 7 skills that lead to a Grade 8 outcome (leads_to in curriculum/integrated_science/g7.json) become prerequisites of the Grade 8
// skills that cover it, so the Grade 7 links into Grade 8 are honoured by the build itself.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/integratedscience-g8-skills.mjs';

const J = (f) => JSON.parse(readFileSync(new URL(`../curriculum/${f}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/integrated_science/g8.json', import.meta.url);
const g8 = JSON.parse(readFileSync(path, 'utf8'));
const g7 = J('integrated_science/g7');
const skillMap = (gs) => new Map(gs.flatMap(g => g.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code]))));
const skillSet = (gs) => new Set(gs.flatMap(g => g.sub_strands.flatMap(s => (s.skills || []).map(k => k.code))));
const I7 = skillMap([g7]);
const SCI = { 5: skillSet([J('science/g5')]), 6: skillSet([J('science/g6')]) };
const MATHS = skillSet([J('mathematics/g4'), J('mathematics/g5'), J('mathematics/g6')]);
const G7LEADS = g7.sub_strands.flatMap(s => (s.skills || []).flatMap(k => (k.leads_to || []).map(o => [k.code, typeof o === 'string' ? o : o.skill])));
const P = 'INTE.G8.';
const subOf = (key) => { const s = g8.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g8.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
if (SKILL_CODES.size !== D.SKILLS.length) throw new Error('duplicate skill key');
const resolve = (ref) => {
  let m;
  if ((m = /^I7:(.*)$/.exec(ref))) { if (!I7.has(m[1])) throw new Error(`unknown Grade 7 skill ${m[1]}`); return { requires: I7.get(m[1]), kind: 'skill', reason: 'Grade 7 Integrated Science taught it first. Proposed, to confirm by a teacher.' }; }
  if ((m = /^S([56]):(.*)$/.exec(ref))) { const c = `SCIE.G${m[1]}.${m[2]}`; if (!SCI[m[1]].has(c)) throw new Error(`unknown Grade ${m[1]} science skill ${c}`); return { requires: c, kind: 'skill', reason: `Grade ${m[1]} Science and Technology taught it first. Proposed, to confirm by a teacher.` }; }
  if (ref.startsWith('M:')) { const c = ref.slice(2); if (!MATHS.has(c)) throw new Error(`unknown Mathematics skill ${c}`); return { requires: c, kind: 'skill', reason: 'Mathematics taught the idea first. Proposed, to confirm by a teacher.' }; }
  if (!ref.startsWith('S:') || !SKILL_CODES.has(ref.slice(2))) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(ref.slice(2)), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nAdded = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  for (const [g7code, oc] of G7LEADS) if (outcomes.includes(oc) && !prerequisites.some(p => p.requires === g7code)) {
    prerequisites.push({ requires: g7code, kind: 'skill', reason: 'Grade 7 Integrated Science leads to this outcome. Proposed, to confirm by a teacher.', strength: 'essential', status: 'proposed' }); nAdded++;
  }
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer in a new question and ask the child to choose.`, help, feedback, source, status: 'draft' });
}
for (const [, key] of D.SKILLS) if (!D.MIS.some(m => m[0] === key)) throw new Error(`skill ${key} has no misconception`);
g8.totals = { ...g8.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g8.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review. Practical, plan and attitude outcomes are listed in docs/qa/integratedscience-g8-non-question-outcomes-2026-11-13.md";
writeFileSync(path, JSON.stringify(g8, null, 1) + '\n');
console.log(`integrated science g8: ${D.SKILLS.length} skills, ${nPre} prerequisites (${nAdded} added to honour Grade 7 links), ${D.MIS.length} misconceptions over ${g8.sub_strands.filter(s => s.skills.length).length} sub-strands`);
