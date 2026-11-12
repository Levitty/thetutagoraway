// ============================================================================
// SOCIAL STUDIES GRADE 6: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/social_studies/g6.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-socialstudies-g6.mjs      then  npm run subject:map -- socialstudies 6 --dir social_studies --title "Social Studies"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/socialstudies-g6-skills.mjs every run.
// Prerequisites go back to Grade 5 skills (G5:KEY) and within Grade 6 (S:KEY). Forward links (leads_to) name the Grade 7 outcomes
// the idea returns in, listed by hand in LEADS7 and checked here against curriculum/social_studies/g7.json.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/socialstudies-g6-skills.mjs';

const path = new URL('../curriculum/social_studies/g6.json', import.meta.url);
const g6 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g5.json', import.meta.url), 'utf8'));
const g7 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g7.json', import.meta.url), 'utf8'));
const G5 = new Map(g5.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code])));
const G7 = new Set(g7.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const P = 'SOCI.G6.';
const subOf = (key) => { const s = g6.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g6.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
if (SKILL_CODES.size !== D.SKILLS.length) throw new Error('duplicate skill key');
const resolve = (ref) => {
  const [kind, key] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  if (kind === 'G5') { if (!G5.has(key)) throw new Error(`unknown Grade 5 skill ${key}`); return { requires: G5.get(key), kind: 'skill', reason: 'Grade 5 Social Studies taught it first. Proposed, to confirm by a teacher.' }; }
  if (!SKILL_CODES.has(key)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(key), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nG5 = 0, nLead = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  nPre += prerequisites.length; nG5 += prerequisites.filter(p => p.requires.startsWith('SOCI.G5.')).length;
  const leads_to = (D.LEADS7[key] || []).map(c => { const full = `SOCI.G7.${c}`; if (!G7.has(full)) throw new Error(`${key}: unknown Grade 7 outcome ${full}`); return full; });
  nLead += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} ${D.EV}`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
for (const k of Object.keys(D.LEADS7)) if (!SKILL_CODES.has(k)) throw new Error(`LEADS7 names unknown skill ${k}`);
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || D.TCF, status: 'draft' });
}
g6.totals = { ...g6.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g6.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review. Practical, performance and attitude outcomes are listed in docs/qa/socialstudies-g6-non-question-outcomes-2026-11-12.md";
writeFileSync(path, JSON.stringify(g6, null, 1) + '\n');
console.log(`social studies g6: ${D.SKILLS.length} skills, ${nPre} prerequisites (${nG5} back to Grade 5 skills), ${D.MIS.length} misconceptions, ${nLead} forward links to Grade 7 outcomes`);
