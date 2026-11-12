// ============================================================================
// SCIENCE AND TECHNOLOGY GRADE 4: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/science/g4.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-science-g4.mjs      then  npm run subject:map -- science 4 --dir science --title "Science and Technology"
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/science-g4-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/science-g4-skills.mjs';

const path = new URL('../curriculum/science/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/science/g5.json', import.meta.url), 'utf8'));
const g3 = JSON.parse(readFileSync(new URL('../curriculum/environmental_activities/g3.json', import.meta.url), 'utf8'));
const G3 = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const G5S = new Set(g5.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const P = 'SCIE.G4.';
const subOf = (key) => { const s = g4.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
const resolve = (ref) => {
  if (ref.startsWith('G3:')) { const c = `ENVI.G3.${ref.slice(3)}`; if (!G3.has(c)) throw new Error(`unknown G3 outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Grade 3 Environmental Activities introduced it. Proposed, to confirm by a teacher.' }; }
  const r = ref.slice(2);
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nLeads = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  const leads_to = (D.LEADS[key] || []).map(c => { const full = `SCIE.G5.${c}`; if (!G5S.has(full)) throw new Error(`${key}: unknown G5 skill ${full}`); return { skill: full, reason: 'Grade 5 builds on this idea. Proposed, to confirm by a teacher.' }; });
  nPre += prerequisites.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const g5short = new Set(g5.sub_strands.flatMap(s => (s.misconceptions || []).map(m => m.code.slice(m.skill.length + 1))));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short) || g5short.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
const NOTES = {
  PLANTS: 'Outcome c (appreciate the need to care for plants) is attitudinal: observe it in the school garden or a plant-care log. Outcomes a and b are tested by questions.',
  ANIMALS: 'Outcome c (appreciate the need to care for animals) is attitudinal: observe it in care of a class pet or school animals. Outcomes a and b are tested by questions; classifying living animals from a nature walk is better checked by the teacher.',
  HUMAN_DIGESTIVE_SYSTEM: 'Outcome a is tested by questions (parts, order, jobs). Outcome b says "develop a plan": the knowledge is tested (healthy habits) but the plan itself is a task for the teacher to mark with a short rubric. Outcome c (appreciate) is attitudinal.',
  PROPERTIES_OF_MATTER: 'Outcomes a and b are tested by questions. Practical: the child shows the states with water, ice and steam or with a balloon, a jug and a stone, as the learning experiences suggest. Outcome c (appreciate) is attitudinal.',
  MANAGEMENT_OF_SOLID_WAST: 'Outcomes a and b are tested by questions. Outcome c (apply methods) is practical: sorting waste and making a compost pit or a reuse item; the knowledge of which method fits is tested. Outcome d (appreciate) is attitudinal and is seen in the school\'s waste habits.',
  WATER_CONSERVATION: 'Outcomes a, b and c are tested by questions. Outcome d (develop interest) is attitudinal; a class campaign or a rainwater-collection project can show it.',
  FORCE_AND_ITS_EFFECT: 'Outcomes a and c are tested by questions. Outcome b (demonstrate the effects of force) is practical: the knowledge is tested, the demonstration is observed. Outcome d (appreciate) is attitudinal.',
  LIGHT: 'Outcomes a, b and c are tested by questions. Outcome d (appreciate) is attitudinal. Practical: a class sorts sources of light or lists how rooms at home are lit.',
  HEAT: 'Outcomes a, b (knowledge) and c are tested by questions. Outcome b says "demonstrate": the demonstration is practical and observed (safely). Outcome d (appreciate) is attitudinal.',
};
for (const s of g4.sub_strands) { const k = s.code.split('.').slice(3).join('.'); if (!NOTES[k]) throw new Error(`no note for ${k}`); s.authoring_notes = NOTES[k]; }
g4.totals = { ...g4.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`science g4: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
