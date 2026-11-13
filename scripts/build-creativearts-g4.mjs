// ============================================================================
// CREATIVE ARTS GRADE 4: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/creative_arts/g4.json); the official outcomes, the KICD rubrics and the sub-strand text are never touched.
//   node scripts/build-creativearts-g4.mjs      then  npm run subject:map -- creativearts 4 --dir creative_arts --title "Creative Arts"
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/creativearts-g4-skills.mjs every run.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/creativearts-g4-skills.mjs';

const load = (p) => JSON.parse(readFileSync(new URL(`../curriculum/${p}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/creative_arts/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const OTHER = [load('creative_activities/g3'), load('mathematics/g4')];
const KNOWN = new Set(OTHER.flatMap(d => d.sub_strands.flatMap(s => s.outcomes.map(o => o.code))));
const G5 = load('creative_arts/g5');
const G5SKILLS = new Set(G5.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)));
const ALIAS = { PC: D.PC, NB: D.NB, PM: D.PM, RH: D.RH, ML: D.ML, AT: D.AT, GY: D.GY, SG: D.SG, PH: D.PH, DR: D.DR, SW: D.SW, AP: D.AP };
const ALIAS_OF = new Map(Object.entries(ALIAS).map(([a, s]) => [s, a]));
const P = 'CREA.G4.';
const subOf = (key) => { const s = g4.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [`${sub}.${key}`, codeOf(sub, key)]));
const resolve = (sub, ref) => {
  if (ref.startsWith('G3:')) { const c = `CREA.G3.${ref.slice(3)}`; if (!KNOWN.has(c)) throw new Error(`unknown G3 outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Grade 3 Creative Activities introduced it. Proposed, to confirm by a teacher.' }; }
  if (ref.startsWith('X:')) { const c = ref.slice(2); if (!KNOWN.has(c)) throw new Error(`unknown outcome ${c}`); return { requires: c, kind: 'outcome', reason: 'Another subject taught it first. Proposed, to confirm by a teacher.' }; }
  let r = ref.slice(2);
  if (!r.includes('.')) r = `${sub}.${r}`; else { const [a, ...b] = r.split('.'); r = `${ALIAS[a] || a}.${b.join('.')}`; }
  if (!SKILL_CODES.has(r)) throw new Error(`unknown skill prerequisite ${ref} -> ${r}`);
  return { requires: SKILL_CODES.get(r), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nLead = 0;
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code.endsWith(`.${l}`)); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  const prerequisites = pre.map(r => ({ ...resolve(subKey, r), strength: 'essential', status: 'proposed' }));
  const leads_to = (D.LEADS[`${ALIAS_OF.get(subKey)}.${key}`] || []).map(c => { const full = `CREA.G5.${c}`; if (!G5SKILLS.has(full)) throw new Error(`${key}: unknown G5 skill ${full}`); return { skill: full, reason: 'Grade 5 Creative Arts builds on this idea. Proposed, to confirm by a teacher.' }; });
  nPre += prerequisites.length; nLead += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
for (const k of Object.keys(D.LEADS)) { const [a, key] = k.split('.'); if (!SKILL_CODES.has(`${ALIAS[a]}.${key}`)) throw new Error(`LEADS names unknown skill ${k}`); }
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (!short.startsWith('M_CA4_')) throw new Error(`${short}: code must start M_CA4_`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || 'To confirm by a teacher: a common classroom error, not traced to a study by the author.', status: 'draft' });
}
for (const [, key] of D.SKILLS) if (!D.MIS.some(m => m[0] === key)) throw new Error(`skill ${key} has no misconception`);
g4.totals = { ...g4.totals, skills: D.SKILLS.length, prerequisites: nPre, leads_to: nLead, misconceptions: D.MIS.length };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites, leads_to and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review. Practical, performance and attitude outcomes are listed in docs/qa/creativearts-g4-non-question-outcomes-2026-11-13.md";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`creative arts g4: ${D.SKILLS.length} skills, ${nPre} prerequisites, ${nLead} leads_to, ${D.MIS.length} misconceptions`);
