// ============================================================================
// SCIENCE AND TECHNOLOGY GRADE 6: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/science/g6.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-science-g6.mjs      then  npm run subject:map -- science 6 --dir science --title "Science and Technology"
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/science-g6-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/science-g6-skills.mjs';

const path = new URL('../curriculum/science/g6.json', import.meta.url);
const g6 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/science/g5.json', import.meta.url), 'utf8'));
const g4 = JSON.parse(readFileSync(new URL('../curriculum/science/g4.json', import.meta.url), 'utf8'));
const g7 = JSON.parse(readFileSync(new URL('../curriculum/integrated_science/g7.json', import.meta.url), 'utf8'));
const G4S = new Set(g4.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const G7O = new Set(g7.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const G5S = new Set(g5.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const P = 'SCIE.G6.';
const subOf = (key) => { const s = g6.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g6.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
const resolve = (ref) => {
  if (ref.startsWith('S5:') || ref.startsWith('S4:')) {
    const g = ref.slice(1, 2), c = `SCIE.G${g}.${ref.slice(3)}`;
    if (!(g === '5' ? G5S : G4S).has(c)) throw new Error(`unknown Grade ${g} skill ${c}`);
    return { requires: c, kind: 'skill', reason: `Grade ${g} Science and Technology taught it first. Proposed, to confirm by a teacher.` };
  }
  const r = ref.slice(2);
  if (!ref.startsWith('S:') || !SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nLeads = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  const leads_to = (D.LEADS[key] || []).map(c => { const full = `INTE.G7.${c}`; if (!G7O.has(full)) throw new Error(`${key}: unknown G7 outcome ${full}`); return { skill: full, reason: 'Grade 7 Integrated Science builds on this idea. Proposed, to confirm by a teacher.' }; });
  nPre += prerequisites.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const g5short = new Set([...g5.sub_strands, ...g4.sub_strands].flatMap(s => (s.misconceptions || []).map(m => m.code.slice(m.skill.length + 1))));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short) || g5short.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
const NOTES = {
  'LIVING.FUNGI': 'Outcomes a and a_ (identify fungi, describe their importance) are tested by questions. Outcome b (appreciate the importance of fungi in the economy) is attitudinal. Practical: grow moulds on food in a closed bag and record it; the KICD text for the first two outcomes is kept as printed (the second also carries letter a).',
  'LIVING.INVERTEBRATES': 'Outcomes a, c and d are tested by questions. Outcome b (practise precautions in handling invertebrates) is practical: the knowledge is tested, the handling is observed on a nature walk. Outcome e (appreciate) is attitudinal.',
  'LIVING.HUMAN_CIRCULATORY_SYSTEM': 'Outcomes a, b and c are tested by questions. Outcome d says "develop a routine plan": the habits are tested, the plan itself is marked by the teacher with the strand rubric. Outcome e (appreciate) is attitudinal. Medical statements (signs of a heart attack) to be confirmed by a teacher or health worker.',
  'MATTER.CHANGE_OF_STATE': 'Outcomes a and b are tested by questions. Practical: show melting, evaporation and freezing safely with candle wax, a wet cloth and water in a freezer, as the learning experiences suggest. Outcome c (appreciate) is attitudinal.',
  'MATTER.COMPOSITION_OF_AIR': 'Outcomes a, b, c and d are tested by questions. Practical: the burning candle in a jar and a poster on air pollutants. Outcome e (appreciate the need for clean air) is attitudinal. The pie chart of the make-up of air links to Mathematics.',
  'FORCE_.LIGHT': 'Outcomes b, c and d are tested by questions, including angles at a plane mirror; the drawing itself (a ray diagram) is checked on paper by the teacher. Outcome a (demonstrate the movement of light through materials) is practical: the classification is tested, the demonstration is observed. Outcome e (appreciate) is attitudinal.',
  'FORCE_.LEVERS_AS_SIMPLE_MACHINE': 'Outcomes a, b and c are tested by questions. Outcome d (demonstrate the use of levers) is practical: the knowledge half is tested, the demonstration with a ruler, a pencil or a see-saw is observed. Outcome e (appreciate) is attitudinal.',
  'FORCE_.SLOPES_AS_SIMPLE_MACHINE': 'Outcome a is tested by questions. Outcome b (demonstrate how a slope makes work easier) is practical: the reasoning is tested, the demonstration with a plank and a spring balance is observed. Outcome c (appreciate) is attitudinal.',
};
for (const s of g6.sub_strands) { const k = s.code.split('.').slice(2).join('.'); if (!NOTES[k]) throw new Error(`no note for ${k}`); s.authoring_notes = NOTES[k]; }
g6.totals = { ...g6.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g6.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g6, null, 1) + '\n');
console.log(`science g6: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
