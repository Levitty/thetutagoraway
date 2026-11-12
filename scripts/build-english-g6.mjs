// ============================================================================
// ENGLISH GRADE 6: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/english/g6.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-english-g6.mjs      then  npm run subject:map -- english 6 --dir english --title English
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/english-g6-skills.mjs every run.
// All skills are 'proposed' and all misconceptions 'draft' until a Kenyan English teacher reviews them.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, MIS, ALSO, LEADS } from './data/english-g6-skills.mjs';

const path = new URL('../curriculum/english/g6.json', import.meta.url);
const g6 = JSON.parse(readFileSync(path, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/english/g5.json', import.meta.url), 'utf8'));
const g7 = JSON.parse(readFileSync(new URL('../curriculum/english/g7.json', import.meta.url), 'utf8'));
const subOfGrade = (g, P, key) => {
  const hit = g.sub_strands.filter(s => s.code === `${P}${key}` || s.code.startsWith(`${P}${key}_`) || (key.includes('_') && s.code.startsWith(`${P}${key}`)));
  const exact = hit.filter(s => s.code === `${P}${key}`);
  const one = exact.length === 1 ? exact : hit;
  if (one.length !== 1) throw new Error(`${P}${key} matches ${one.length}`);
  return one[0];
};
const subOf = (key) => subOfGrade(g6, 'ENGL.G6.', key);
for (const s of g6.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, id) => `${sub.code}.${id}`;
const byId = new Map(SKILLS.map(k => [k.id, codeOf(subOf(k.sub), k.id)]));
const G5 = new Map(g5.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code, k.code])));
const resolvePre = (r) => {
  if (r.startsWith('S:')) { const c = byId.get(r.slice(2)); if (!c) throw new Error(`unknown prerequisite ${r}`); return { requires: c, kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a Kenyan English teacher.' }; }
  if (r.startsWith('G5:')) {
    const [a, b, id] = r.slice(3).split('.');
    const hit = [...G5.keys()].filter(c => c.startsWith(`ENGL.G5.${a}.${b}_`) && c.endsWith(`.${id}`));
    if (hit.length !== 1) throw new Error(`unknown Grade 5 skill ${r}`);
    return { requires: hit[0], kind: 'skill', reason: 'Grade 5 English taught it first. Proposed, to confirm by a Kenyan English teacher.' };
  }
  throw new Error(`bad prerequisite ${r}`);
};
let nPre = 0, nLeads = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${l}`); return o.code; });
  for (const ref of ALSO[`${k.sub}.${k.id}`] || []) {
    const [a, b, letter] = ref.split('.'); const other = subOf(`${a}.${b}`); const o = other.outcomes.find(x => x.letter === letter);
    if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${ref}`);
    if (!outcomes.includes(o.code)) outcomes.push(o.code);
  }
  const prerequisites = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', status: 'proposed' }));
  const leads_to = (LEADS[k.id] || []).map(ref => {
    const letter = ref.split('.').pop(); const s7 = subOfGrade(g7, 'ENGL.G7.', ref.slice(0, ref.lastIndexOf('.'))); const o = s7.outcomes.find(x => x.letter === letter);
    if (!o) throw new Error(`${k.id}: no Grade 7 outcome ${ref}`);
    return { skill: o.code, reason: 'Grade 7 English builds on this skill. Proposed, to confirm by a Kenyan English teacher.' };
  });
  nPre += prerequisites.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const seen = new Set();
for (const m of MIS) {
  const skillCode = byId.get(m.skill.split('.').pop());
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  if (seen.has(m.code)) throw new Error(`duplicate ${m.code}`); seen.add(m.code);
  const sub = g6.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  sub.misconceptions.push({ code: `${skillCode}.${m.code}`, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
g6.totals = { ...g6.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
g6.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (12 Nov 2026) are proposed or draft, written offline by Claude, awaiting a Kenyan English teacher's review";
writeFileSync(path, JSON.stringify(g6, null, 1) + '\n');
console.log(`english g6: ${SKILLS.length} skills, ${nPre} prerequisites, ${nLeads} leads-to links, ${MIS.length} misconceptions over ${g6.sub_strands.filter(s => s.skills.length).length} sub-strands`);
