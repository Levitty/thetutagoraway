// ============================================================================
// CREATIVE ARTS GRADE 5: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/creative_arts/g5.json); the official outcomes, the KICD rubrics and the sub-strand text are never touched.
//   node scripts/build-creativearts-g5.mjs      then  npm run subject:map -- creativearts 5 --dir creative_arts --title "Creative Arts"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/creativearts-g5-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/creativearts-g5-skills.mjs';

const load = (p) => JSON.parse(readFileSync(new URL(`../curriculum/${p}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/creative_arts/g5.json', import.meta.url);
const g5 = JSON.parse(readFileSync(path, 'utf8'));
const OTHER = { 'creative_arts/g4': load('creative_arts/g4'), 'science/g5': load('science/g5'), 'mathematics/g4': load('mathematics/g4') };
const KNOWN = new Set(Object.values(OTHER).flatMap(d => d.sub_strands.flatMap(s => s.outcomes.map(o => o.code))));
const ALIAS = { WI: D.WI, FB: D.FB, RH: D.RH, PM: D.PM, ML: D.ML, RD: D.RD, AT: D.AT, FD: D.FD, FN: D.FN, PP: D.PP, DR: D.DR, SW: D.SW, AP: D.AP };
const P = 'CREA.G5.';
const subOf = (key) => { const s = g5.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g5.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [`${sub}.${key}`, codeOf(sub, key)]));
const resolve = (sub, ref) => {
  if (ref.startsWith('G4:')) { const c = `CREA.G4.${ref.slice(3)}`; if (!KNOWN.has(c)) throw new Error(`unknown G4 outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Grade 4 Creative Arts introduced it. Proposed, to confirm by a teacher.' }; }
  if (ref.startsWith('X:')) { const c = ref.slice(2); if (!KNOWN.has(c)) throw new Error(`unknown outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Another subject taught it first. Proposed, to confirm by a teacher.' }; }
  let r = ref.slice(2);
  if (!r.includes('.')) r = `${sub}.${r}`; else { const [a, ...b] = r.split('.'); r = `${ALIAS[a] || a}.${b.join('.')}`; }
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref} -> ${r}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)) || sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
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
g5.totals = { ...g5.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g5.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 12 Nov 2026), awaiting teacher review. Practical, performance and attitude outcomes are listed in docs/qa/creativearts-g5-non-question-outcomes-2026-11-12.md";
writeFileSync(path, JSON.stringify(g5, null, 1) + '\n');
console.log(`creative arts g5: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${D.MIS.length} misconceptions`);
