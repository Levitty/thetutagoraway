// ============================================================================
// SOCIAL STUDIES GRADE 8: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/social_studies/g8.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-socialstudies-g8.mjs      then  npm run subject:map -- socialstudies 8 --dir social_studies --title "Social Studies"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/socialstudies-g8-skills.mjs every run.
// Prerequisites go back to Grade 7 skills (G7:KEY) and within Grade 8 (S:KEY). Grade 7 already holds forward links (leads_to) into
// Grade 8 outcomes: this script makes sure each link whose outcome a Grade 8 skill covers is honoured (the Grade 8 skill lists the
// Grade 7 skill as a prerequisite).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/socialstudies-g8-skills.mjs';
import { SUBS as DEPTH } from './data/socialstudies-depth/g8.mjs';
import { applyDepth } from './science-depth.mjs';

const path = new URL('../curriculum/social_studies/g8.json', import.meta.url);
const g8 = JSON.parse(readFileSync(path, 'utf8'));
const g7 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g7.json', import.meta.url), 'utf8'));
const G7 = new Map(g7.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code])));
const G7LEADS = g7.sub_strands.flatMap(s => (s.skills || []).flatMap(k => (k.leads_to || []).map(o => [k.code, typeof o === 'string' ? o : o.skill])));
const P = 'SOCI.G8.';
const subOf = (key) => { const s = g8.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g8.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
if (SKILL_CODES.size !== D.SKILLS.length) throw new Error('duplicate skill key');
const G7REASON = 'Grade 7 Social Studies taught it first. Proposed, to confirm by a teacher.';
const resolve = (ref) => {
  const i = ref.indexOf(':'), kind = ref.slice(0, i), key = ref.slice(i + 1);
  if (kind === 'G7') { if (!G7.has(key)) throw new Error(`unknown Grade 7 skill ${key}`); return { requires: G7.get(key), kind: 'skill', reason: G7REASON }; }
  if (!SKILL_CODES.has(key)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(key), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nAdded = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  for (const [g7code, oc] of G7LEADS) if (outcomes.includes(oc) && !prerequisites.some(p => p.requires === g7code)) {
    prerequisites.push({ requires: g7code, kind: 'skill', reason: G7REASON, strength: 'essential', status: 'proposed' }); nAdded++;
  }
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} ${D.EV}`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer in a new question and ask the child to choose.`, help, feedback, source, status: 'draft' });
}
// Skills added in the depth pass (18 Nov 2026) take all their misconceptions from scripts/data/socialstudies-depth/g8.mjs;
// tests/socialstudies-g8.test.mjs checks every skill has four or more.
g8.totals = { ...g8.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g8.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review. Practical, performance and attitude outcomes are listed in docs/qa/socialstudies-g8-non-question-outcomes-2026-11-13.md";
// Depth pass (18 Nov 2026): scripts/data/socialstudies-depth/g8.mjs adds prerequisites, misconceptions to four per skill (with a real
// cause for each first-pass one) and the teaching pack in curriculum/social_studies/teaching/g8/, through scripts/science-depth.mjs.
const depth = applyDepth(g8, DEPTH, { dir: 'social_studies', grade: 8, prefix: P, derive: true });
g8.status = g8.status.replace(/; depth pass 18 Nov 2026.*$/, '') + '; depth pass 18 Nov 2026 (two or more prerequisites and four misconceptions per skill, teaching pack in curriculum/social_studies/teaching/g8)';
writeFileSync(path, JSON.stringify(g8, null, 1) + '\n');
console.log(`social studies g8: ${g8.totals.skills} skills, ${g8.totals.prerequisites} prerequisites, ${g8.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (+${depth.pre} prerequisites, +${depth.mis} misconceptions, ${depth.fix} causes fixed, ${depth.pack} teaching pack entries)`);
