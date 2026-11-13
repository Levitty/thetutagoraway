// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 7: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/pre_technical/g7.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-pretechnical-g7.mjs      then  npm run subject:map -- pretechnical 7 --dir pre_technical --title "Pre-Technical Studies"
// Skill codes begin 'PRET.G7.' (KICD's outcome codes begin 'PRE_.G7.'; the underscore does not fit the registry's four-capital prefix).
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/pretechnical-g7-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/pretechnical-g7-skills.mjs';

const J = (f) => JSON.parse(readFileSync(new URL(`../curriculum/${f}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/pre_technical/g7.json', import.meta.url);
const g7 = JSON.parse(readFileSync(path, 'utf8'));
const g8 = J('pre_technical/g8');
const skillSet = (gs) => new Set(gs.flatMap(g => g.sub_strands.flatMap(s => (s.skills || []).map(k => k.code))));
const SCI = { 4: skillSet([J('science/g4')]), 5: skillSet([J('science/g5')]), 6: skillSet([J('science/g6')]) };
const MATHS = skillSet([J('mathematics/g4'), J('mathematics/g5'), J('mathematics/g6')]);
const G8O = new Set(g8.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const OP = 'PRE_.G7.', SP = 'PRET.G7.';
const subOf = (key) => { const s = g7.sub_strands.find(x => x.code === `${OP}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g7.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${SP}${sub}.${key}`;
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
  const leads_to = (D.LEADS[key] || []).map(c => { const full = `PRE_.G8.${c}`; if (!G8O.has(full)) throw new Error(`${key}: unknown G8 outcome ${full}`); return { skill: full, reason: 'Grade 8 Pre-Technical Studies builds on this idea. Proposed, to confirm by a teacher.' }; });
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
  'FOUNDA.INTRODUCTION_TO_PRE_TECH': 'Outcomes a and b are tested by questions. Outcome c (embrace Pre-Technical Studies in career development) is attitudinal: a career talk and a short learner reflection, seen by the teacher.',
  'FOUNDA.SAFETY_IN_THE_IMMEDIATE_': 'Outcomes a and b are tested by questions. Outcome c (observe safety) is observed by the teacher over the term: role play and everyday habits in the workshop and online. Anything with heat, power or a sharp tool is done with a teacher. Outcome d (appreciate) is attitudinal. Online-safety wording to be confirmed by a teacher.',
  'FOUNDA.COMPUTER_CONCEPTS': 'Outcomes a and b are tested by questions. Outcome c (use a computer for a task) is practical: the teacher watches the learner switch on, open a program and save a file. Outcome d (acknowledge) is attitudinal.',
  'COMMUN.INTRODUCTION_TO_DRAWING': 'Outcomes a, b, d and e are tested by questions about purpose, line types and symbols. Outcome c (print letters and numbers) and the drawing of the lines (d) and symbols (e) are practical: the knowledge is tested, the lettering and line work are marked on the learner\'s drawing sheet against the rubric. Outcome f is attitudinal.',
  'COMMUN.FREE_HAND_SKETCHING': 'Outcomes a and b are tested by questions. Outcomes c and d (sketch lines and 2D shapes) are drawn on paper and marked by the teacher against rubric indicator 2.1; keep the sketch, not a photo of the child. Outcome e is attitudinal.',
  'COMMUN.ICT_TOOLS_IN_COMMUNICATI': 'Outcomes a and b are tested by questions. Outcome c (use ICT tools to communicate) is practical: send and receive a message or join a class call, observed by the teacher on a school device; no learner account or personal contact is entered. Outcome d (acknowledge) is attitudinal.',
  'MATERI.INTRODUCTION_TO_MATERIAL': 'Outcomes a, b and c are tested by questions. The class sort of local materials is a practical observed task; the sustainable-use poster is a portfolio piece. Outcome d (appreciate) is attitudinal. Whether paper, glass, cement and ceramics are called natural or synthetic is left to the teacher: the questions use clear cases only.',
  'MATERI.METALLIC_MATERIALS': 'Outcomes a, b and c are tested by questions. The magnet, conduction and appearance practical is done by the learners with a magnet, a battery bulb circuit (low voltage only) and a cold or warm spoon: hot metal and heat only with a teacher. Outcome d (appreciate) is attitudinal.',
  'MATERI.NON_METALLIC_MATERIALS': 'Outcomes a, b, c and d are tested by questions. The properties practical (colour, texture, hardness, fire resistance) uses small samples; any flame or heat test is shown by the teacher at a safe distance, never by learners. Outcome e is attitudinal. Natural or synthetic is asked only for clear cases; paper, glass, cement and ceramics are for the teacher to place.',
  'TOOLS_.MEASURING_AND_MARKING_OU': 'Outcomes a and b are tested by questions. Outcome c (use the tools for a task) is practical: measure and mark out a piece of timber or card to a given plan; the divider, scriber and dot punch are used under the teacher\'s eye. Outcome d (care for tools) is tested by questions and observed at the end of every lesson. Outcome e is attitudinal.',
  'TOOLS_.COMPUTER_HARDWARE': 'Outcome a is tested by questions. Outcome b (use hardware devices) is practical: the teacher watches the learner type with a keyboard, move a pointer, print and save to a storage device. Outcome c (value) is attitudinal.',
  'ENTREP.INTRODUCTION_TO_ENTREPRE': 'Outcomes a, b and c are tested by questions. The self-assessment of entrepreneurial qualities is private to the learner and the teacher. Outcome d (appreciate) is attitudinal.',
  'ENTREP.UNIT': 'Outcomes a and b are tested by questions. The visit to a posho mill, salon, barber shop, welding workshop or cybercafe is observed by the teacher. Outcome c (value) is attitudinal.',
  'ENTREP.FINANCIAL_GOALS': 'Outcomes a and b are tested by questions. Outcome c (formulate SMART goals) is tested for recognising a SMART goal and for the sums; writing the learner\'s own goal is a written product marked by the teacher and kept private. Outcome d (observe financial discipline) is observed over the term.',
};
for (const s of g7.sub_strands) { const k = s.code.slice(OP.length); if (!NOTES[k]) throw new Error(`no note for ${k}`); s.authoring_notes = NOTES[k]; }
g7.totals = { ...g7.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g7.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review";
writeFileSync(path, JSON.stringify(g7, null, 1) + '\n');
console.log(`pre-technical g7: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${D.MIS.length} misconceptions`);
