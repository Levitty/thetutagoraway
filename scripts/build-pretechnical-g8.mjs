// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 8: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/pre_technical/g8.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-pretechnical-g8.mjs      then  npm run subject:map -- pretechnical 7 --dir pre_technical --title "Pre-Technical Studies"
// Skill codes begin 'PRET.G8.' (KICD's outcome codes begin 'PRE_.G8.'; the underscore does not fit the registry's four-capital prefix).
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/pretechnical-g8-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/pretechnical-g8-skills.mjs';

const J = (f) => JSON.parse(readFileSync(new URL(`../curriculum/${f}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/pre_technical/g8.json', import.meta.url);
const g8 = JSON.parse(readFileSync(path, 'utf8'));
const g7 = JSON.parse(readFileSync(new URL('../curriculum/pre_technical/g7.json', import.meta.url), 'utf8'));
const skillSet = (gs) => new Set(gs.flatMap(g => g.sub_strands.flatMap(s => (s.skills || []).map(k => k.code))));
const SCI = {};
const MATHS = skillSet([J('mathematics/g4'), J('mathematics/g5'), J('mathematics/g6')]);
const P7 = new Map(g7.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code])));
const OP = 'PRE_.G8.', SP = 'PRET.G8.';
const subOf = (key) => { const s = g8.sub_strands.find(x => x.code === `${OP}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g8.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${SP}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
const resolve = (ref) => {
  if (ref.startsWith('P7:')) { const c = P7.get(ref.slice(3)); if (!c) throw new Error(`unknown Grade 7 skill ${ref}`); return { requires: c, kind: 'skill', reason: 'Grade 7 Pre-Technical Studies taught it first. Proposed, to confirm by a teacher.' }; }
  const m = /^S([456]):(.*)$/.exec(ref);
  if (m) {
    const c = `SCIE.G${m[1]}.${m[2]}`;
    if (!SCI[m[1]].has(c)) throw new Error(`unknown Grade ${m[1]} science skill ${c}`);
    return { requires: c, kind: 'skill', reason: `Grade ${m[1]} Science and Technology taught it first. Proposed, to confirm by a teacher.` };
  }
  if (ref.startsWith('M:')) {
    const c = ref.slice(2);
    if (!MATHS.has(c)) throw new Error(`unknown Mathematics skill ${c}`);
    return { requires: c, kind: 'skill', reason: 'Mathematics taught the measuring, drawing or money idea first. Proposed, to confirm by a teacher.' };
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
  const leads_to = [];
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
  'FOUNDA.FIRE_SAFETY': 'Outcomes a and b are tested by questions. Outcome c (extinguish fires) is NOT done by learners: the teacher or fire officer demonstrates a blanket, sand or an extinguisher on a small safe fire, and learners only watch and say the steps. Outcome d is attitudinal. Safety wording to be confirmed by a teacher.',
  'FOUNDA.DATA_SAFETY': 'Outcomes a, b and c are tested by questions. Outcome d (secure data on a device) is practical on a school device: set a screen lock, make a backup copy, observed by the teacher; no real password is typed into the system or shared. Outcome e is attitudinal.',
  'COMMUN.PLANE_GEOMETRY': 'Outcomes a and b are tested by questions. Outcome c (construct combined shapes) is drawn on a sheet with instruments and marked by the teacher against the rubric. Outcome d is attitudinal.',
  'COMMUN.DIMENSIONING': 'Outcomes a and c are tested by questions. Outcome b (draw dimensioning lines) is drawn on a sheet and marked by the teacher. Outcome d is attitudinal.',
  'COMMUN.PLAIN_SCALE_DRAWING': 'Outcomes a and b are tested by questions and sums. Outcome c (draw plane figures to scale) is drawn on a sheet and marked by the teacher. Outcome d is attitudinal.',
  'COMMUN.VISUAL_PROGRAMMING': 'Outcomes a and b are tested by questions. Outcome c (create instructions in a visual programming tool) is practical on a school device, observed by the teacher; no learner account is made. Outcome d is attitudinal.',
  'MATERI.COMPOSITE_MATERIALS': 'Outcomes a, b and c are tested by questions. Outcome d is attitudinal. Which materials are composites is limited to clear cases.',
  'MATERI.CERAMIC_MATERIALS': 'Outcomes a, b and c are tested by questions. Outcome d is attitudinal. A heat test is only shown by the teacher.',
  'TOOLS_.CUTTING_TOOLS': 'Outcomes a, b and d are tested by questions. Outcome c (use cutting tools) is practical with the teacher watching closely: sharp tools, never alone. Outcome e is attitudinal.',
  'TOOLS_.COMPUTER_SOFTWARE': 'Outcomes a and b are tested by questions. Outcome c (use software for a task) is practical on a school device, observed by the teacher. Outcome d is attitudinal.',
  'ENTREP.BOOKKEEPING': 'Outcomes a and b are tested by questions. Outcome c (prepare simple financial statements) is a written task with made-up figures, marked by the teacher: the sums and statement layout are not asked here. Outcome d is attitudinal.',
  'ENTREP.INCOME_AND_BUDGETING': 'Outcomes a, b and d are tested by questions. Outcome c (prepare a simple budget) is a written task, private to the learner and the teacher. Outcome e is attitudinal.',
  'ENTREP.OF_GOODS_AND_SERVICES': 'Outcomes a, b, c and d are tested by questions. Outcome e (recognise suitable markets) is a local visit or class discussion observed by the teacher.',
  'ENTREP.DISTRIBUTION_OF_GOODS_AN': 'Outcomes a, b and c are tested by questions. Outcome d is attitudinal.',
};
for (const s of g8.sub_strands) { const k = s.code.slice(OP.length); if (!NOTES[k]) throw new Error(`no note for ${k}`); s.authoring_notes = NOTES[k]; }
g8.totals = { ...g8.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g8.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g8, null, 1) + '\n');
console.log(`pre-technical g8: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
