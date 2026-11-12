// ============================================================================
// AGRICULTURE AND NUTRITION GRADE 4: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/agriculture/g4.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-agriculture-g4.mjs      then  npm run subject:map -- agriculture 4 --dir agriculture --title "Agriculture and Nutrition"
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/agriculture-g4-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/agriculture-g4-skills.mjs';

const path = new URL('../curriculum/agriculture/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/agriculture/g5.json', import.meta.url), 'utf8'));
const sci4 = JSON.parse(readFileSync(new URL('../curriculum/science/g4.json', import.meta.url), 'utf8'));
const G5S = new Set(g5.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const SCI4S = new Set(sci4.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const P = 'AGRI.G4.';
const subOf = (key) => { const s = g4.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
const resolve = (ref) => {
  if (ref.startsWith('X:')) { const c = ref.slice(2); if (!SCI4S.has(c)) throw new Error(`unknown Science G4 skill ${c}`); return { requires: c, kind: 'skill', reason: 'Science and Technology Grade 4 teaches the idea this skill uses. Proposed, to confirm by a teacher.' }; }
  const r = ref.slice(2).split('.').pop();
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nLeads = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  const leads_to = (D.LEADS[key] || []).map(c => { const full = `AGRI.G5.${c}`; if (!G5S.has(full)) throw new Error(`${key}: unknown G5 skill ${full}`); return { skill: full, reason: 'Grade 5 builds on this idea. Proposed, to confirm by a teacher.' }; });
  nPre += prerequisites.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
for (const k of Object.keys(D.LEADS)) if (!SKILL_CODES.has(k)) throw new Error(`LEADS: unknown skill ${k}`);
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const g5short = new Set(g5.sub_strands.flatMap(s => (s.misconceptions || []).map(m => m.code.slice(m.skill.length + 1))));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short) || g5short.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
g4.totals = { ...g4.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review. Practical and attitude outcomes are listed in docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`agriculture g4: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
