// ============================================================================
// SOCIAL STUDIES GRADE 4: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/social_studies/g4.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-socialstudies-g4.mjs      then  npm run subject:map -- socialstudies 4 --dir social_studies --title "Social Studies"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/socialstudies-g4-skills.mjs every run.
// Forward links: every Grade 5 skill that requires a Grade 4 outcome is listed on the Grade 4 skill that teaches that outcome (leads_to).
// ============================================================================
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import * as D from './data/socialstudies-g4-skills.mjs';

const path = new URL('../curriculum/social_studies/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g5.json', import.meta.url), 'utf8'));
const env3 = JSON.parse(readFileSync(new URL('../curriculum/environmental_activities/g3.json', import.meta.url), 'utf8'));
const KNOWN = new Set(env3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const P = 'SOCI.G4.';
const subOf = (key) => { const s = g4.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
if (SKILL_CODES.size !== D.SKILLS.length) throw new Error('duplicate skill key');
const resolve = (ref) => {
  if (ref.startsWith('X:')) { const c = ref.slice(2); if (!KNOWN.has(c)) throw new Error(`unknown Grade 3 outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Grade 3 Environmental Activities taught the idea first. Proposed, to confirm by a teacher.' }; }
  let r = ref.slice(2); if (r.includes('.')) r = r.split('.')[1];
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
// Grade 5 skills that require a Grade 4 outcome
const LEADS = new Map();
for (const s of g5.sub_strands) for (const k of s.skills || []) for (const p of k.prerequisites || []) if (p.requires.startsWith(P)) { (LEADS.get(p.requires) || LEADS.set(p.requires, []).get(p.requires)).push(k.code); }
let nPre = 0, nLead = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  nPre += prerequisites.length;
  const leads_to = [...new Set(outcomes.flatMap(o => LEADS.get(o) || []))];
  nLead += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} ${D.EV}`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || D.TCF, status: 'draft' });
}
g4.totals = { ...g4.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`social studies g4: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${D.MIS.length} misconceptions, ${nLead} forward links to Grade 5 skills`);
