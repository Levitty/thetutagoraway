// ============================================================================
// AGRICULTURE AND NUTRITION GRADE 5: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/agriculture/g5.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-agriculture-g5.mjs      then  npm run subject:map -- agriculture 5 --dir agriculture --title "Agriculture and Nutrition"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/agriculture-g5-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/agriculture-g5-skills.mjs';

const path = new URL('../curriculum/agriculture/g5.json', import.meta.url);
const g5 = JSON.parse(readFileSync(path, 'utf8'));
const g4 = JSON.parse(readFileSync(new URL('../curriculum/agriculture/g4.json', import.meta.url), 'utf8'));
const G4 = new Set(g4.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const ALIAS = { SO: D.SO, WA: D.WA, WI: D.WI, VE: D.VE, AN: D.AN, PR: D.PR, NU: D.NU, CO: D.CO, GR: D.GR, HO: D.HO, LA: D.LA, RE: D.RE, GA: D.GA };
const P = 'AGRI.G5.';
const subOf = (key) => { const s = g5.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g5.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [`${sub}.${key}`, codeOf(sub, key)]));
const resolve = (sub, ref) => {
  if (ref.startsWith('G4:')) { const c = `AGRI.G4.${ref.slice(3)}`; if (!G4.has(c)) throw new Error(`unknown G4 outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Grade 4 Agriculture and Nutrition introduced it. Proposed, to confirm by a teacher.' }; }
  let r = ref.slice(2);
  if (!r.includes('.')) r = `${sub}.${r}`; else { const [a, ...b] = r.split('.'); r = `${ALIAS[a] || a}.${b.join('.')}`; }
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref} -> ${r}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(subKey, r), strength: 'essential', status: 'proposed' }));
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
const nSkills = D.SKILLS.length;
g5.totals = { ...g5.totals, skills: nSkills, prerequisites: nPre, misconceptions: D.MIS.length };
g5.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g5, null, 1) + '\n');
console.log(`agriculture g5: ${nSkills} skills, ${nPre} prerequisites, ${D.MIS.length} misconceptions`);
