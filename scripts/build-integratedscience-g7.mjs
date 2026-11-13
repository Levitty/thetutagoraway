// ============================================================================
// INTEGRATED SCIENCE GRADE 7: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/integrated_science/g7.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-integratedscience-g7.mjs      then  npm run subject:map -- integratedscience 7 --dir integrated_science --title "Integrated Science"
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/integratedscience-g7-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/integratedscience-g7-skills.mjs';

const J = (f) => JSON.parse(readFileSync(new URL(`../curriculum/${f}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/integrated_science/g7.json', import.meta.url);
const g7 = JSON.parse(readFileSync(path, 'utf8'));
const g8 = J('integrated_science/g8');
const skillSet = (gs) => new Set(gs.flatMap(g => g.sub_strands.flatMap(s => (s.skills || []).map(k => k.code))));
const SCI = { 4: skillSet([J('science/g4')]), 5: skillSet([J('science/g5')]), 6: skillSet([J('science/g6')]) };
const MATHS = skillSet([J('mathematics/g4'), J('mathematics/g5'), J('mathematics/g6')]);
const G8O = new Set(g8.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const P = 'INTE.G7.';
const subOf = (key) => { const s = g7.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g7.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
const resolve = (ref) => {
  const m = /^S([456]):(.*)$/.exec(ref);
  if (m) {
    const c = `SCIE.G${m[1]}.${m[2]}`;
    if (!SCI[m[1]].has(c)) throw new Error(`unknown Grade ${m[1]} science skill ${c}`);
    return { requires: c, kind: 'skill', reason: `Grade ${m[1]} Science and Technology taught it first. Proposed, to confirm by a teacher.` };
  }
  if (ref.startsWith('M:')) {
    const c = ref.slice(2);
    if (!MATHS.has(c)) throw new Error(`unknown Mathematics skill ${c}`);
    return { requires: c, kind: 'skill', reason: 'Mathematics taught the measuring idea first. Proposed, to confirm by a teacher.' };
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
  const leads_to = (D.LEADS[key] || []).map(c => { const full = `INTE.G8.${c}`; if (!G8O.has(full)) throw new Error(`${key}: unknown G8 outcome ${full}`); return { skill: full, reason: 'Grade 8 Integrated Science builds on this idea. Proposed, to confirm by a teacher.' }; });
  nPre += prerequisites.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
const NOTES = {
  'SCIENT.INTRODUCTION_TO_INTEGRAT': 'Outcomes a and b are tested by questions. Outcome c (show interest in learning Integrated Science) is attitudinal. The career chart is a portfolio piece marked by the teacher.',
  'SCIENT.LABORATORY_SAFETY': 'Outcomes a, b and c are tested by questions; the role-play of first aid and the practice of safety measures are observed by the teacher (anything with a flame, hot water or chemicals is done with the teacher). First aid statements are to be confirmed by a teacher or a health worker. Outcome d (appreciate safety) is attitudinal.',
  'SCIENT.LABORATORY_APPARATUS_AND': 'Outcomes a and c are tested by questions. Outcome b (use and care for apparatus) is practical: the knowledge is tested, the handling is observed by the teacher (a Bunsen burner, hot water and glassware only with a teacher). Outcome d (appreciate consumer protection) is attitudinal; the labelled packaging collection is a portfolio piece.',
  'MIXTUR.MIXTURES': 'Outcomes a and b are tested by questions (which method, why it works, where it is used). The separations themselves are practical: evaporation, simple distillation, sublimation and chromatography are done by the teacher or with the teacher (heat, vapour). Outcome c (appreciate) is attitudinal. Fractional distillation is by information only.',
  'MIXTUR.ACIDS_BASES_AND_INDICATO': 'Outcomes a, c and d are tested by questions. Outcome b (prepare an indicator from plant extracts) is practical: the steps and the colour meanings are tested, the preparing is observed (warm water, a strainer and an adult nearby). Outcome e (appreciate) is attitudinal. Nothing is tasted in practice work.',
  'LIVING.HUMAN_REPRODUCTIVE_SYSTE': 'Outcomes a, b and c are tested by questions. Outcome d (a plan to manage adolescence challenges) is a written plan marked by the teacher; the habits behind it are tested. Outcome e (appreciate) is attitudinal. Teach with a female and a male teacher or guidance counsellor as the school decides; wording to be confirmed by a teacher.',
  'LIVING.HUMAN_EXCRETORY_SYSTEM': 'Outcomes a, b and c are tested by questions. Outcome d (a daily log of activities that keep the skin and kidneys healthy) is a product marked by the teacher; the habits behind it are tested. Outcome e (appreciate) is attitudinal. Medical statements to be confirmed by a teacher or a health worker.',
  'FORCE_.ELECTRICAL_ENERGY': 'Outcomes a, c and d are tested by questions. Outcome b (connect simple circuits) is practical with cells, wires and a bulb (low voltage only, never mains): the knowledge is tested, the connecting is observed. Outcome e (appreciate) is attitudinal.',
  'FORCE_.MAGNETISM': 'Outcomes a, b and c are tested by questions. Outcome a says demonstrate: the knowledge is tested, the demonstration with bar magnets, pins and a hanging magnet is observed. Outcome b is also done with a magnet and everyday objects. Outcome d (appreciate) is attitudinal.',
};
for (const s of g7.sub_strands) { const k = s.code.slice(P.length); if (!NOTES[k]) throw new Error(`no note for ${k}`); s.authoring_notes = NOTES[k]; }
g7.totals = { ...g7.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g7.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g7, null, 1) + '\n');
console.log(`integrated science g7: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
