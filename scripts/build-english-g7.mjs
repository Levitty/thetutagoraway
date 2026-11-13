// ============================================================================
// ENGLISH GRADE 7: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/english/g7.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-english-g7.mjs      then  npm run subject:map -- english 7 --dir english --title English
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/english-g7-*.mjs every run.
// All skills are 'proposed' and all misconceptions 'draft' until a Kenyan English teacher reviews them.
// The Grade 6 skills that lead to a Grade 7 outcome (leads_to in curriculum/english/g6.json) become prerequisites of the Grade 7
// skills that cover that outcome, so the Grade 6 links into Grade 7 are honoured by the build itself.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, ALSO, LEADS8 } from './data/english-g7-skills.mjs';
import { MIS_A } from './data/english-g7-mis.mjs';
import { MIS_B } from './data/english-g7-mis-b.mjs';

const MIS = [...MIS_A, ...MIS_B];
const load = (g) => JSON.parse(readFileSync(new URL(`../curriculum/english/g${g}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/english/g7.json', import.meta.url);
const g7 = load(7), g6 = load(6), g5 = load(5), g8 = load(8);
const subOfGrade = (g, P, key) => {
  const hit = g.sub_strands.filter(s => s.code === `${P}${key}` || s.code.startsWith(`${P}${key}_`) || (key.includes('_') && s.code.startsWith(`${P}${key}`)));
  const exact = hit.filter(s => s.code === `${P}${key}`);
  const one = exact.length === 1 ? exact : hit;
  if (one.length !== 1) throw new Error(`${P}${key} matches ${one.length}`);
  return one[0];
};
const subOf = (key) => subOfGrade(g7, 'ENGL.G7.', key);
for (const s of g7.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, id) => `${sub.code}.${id}`;
const byId = new Map(SKILLS.map(k => [k.id, codeOf(subOf(k.sub), k.id)]));
if (byId.size !== SKILLS.length) throw new Error('duplicate skill id');
const allOf = (g) => g.sub_strands.flatMap(s => (s.skills || []).map(k => k.code));
const G5 = allOf(g5), G6 = allOf(g6);
const byIdIn = (list, id, label) => { const hit = list.filter(c => c.endsWith(`.${id}`)); if (hit.length !== 1) throw new Error(`unknown ${label} skill ${id} (${hit.length})`); return hit[0]; };
const resolvePre = (r) => {
  if (r.startsWith('S:')) { const c = byId.get(r.slice(2)); if (!c) throw new Error(`unknown prerequisite ${r}`); return { requires: c, kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a Kenyan English teacher.' }; }
  if (r.startsWith('G6:')) return { requires: byIdIn(G6, r.slice(3), 'Grade 6'), kind: 'skill', reason: 'Grade 6 English taught it first. Proposed, to confirm by a Kenyan English teacher.' };
  if (r.startsWith('G5:')) return { requires: byIdIn(G5, r.slice(3), 'Grade 5'), kind: 'skill', reason: 'Grade 5 English taught it first. Proposed, to confirm by a Kenyan English teacher.' };
  throw new Error(`bad prerequisite ${r}`);
};
// Grade 6 skill -> the Grade 7 outcome codes it leads to
const g6leads = new Map();
for (const s of g6.sub_strands) for (const k of s.skills || []) for (const l of k.leads_to || []) {
  if (!/^ENGL\.G7\./.test(l.skill)) continue;
  (g6leads.get(l.skill) || g6leads.set(l.skill, []).get(l.skill)).push(k.code);
}
const g7outcomes = new Set(g7.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
let nPre = 0, nLeads = 0, nHonoured = 0; const unhonoured = [];
const coveredBy = new Map();
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${l}`); return o.code; });
  for (const ref of ALSO[`${k.sub}.${k.id}`] || []) {
    const [a, b, letter] = ref.split('.'); const other = subOf(`${a}.${b}`); const o = other.outcomes.find(x => x.letter === letter);
    if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${ref}`);
    if (!outcomes.includes(o.code)) outcomes.push(o.code);
  }
  for (const o of outcomes) (coveredBy.get(o) || coveredBy.set(o, []).get(o)).push(codeOf(sub, k.id));
  const pre = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', status: 'proposed' }));
  // honour the Grade 6 links into Grade 7
  for (const o of outcomes) for (const c6 of g6leads.get(o) || []) if (!pre.some(p => p.requires === c6)) { pre.push({ requires: c6, kind: 'skill', reason: 'Grade 6 English leads to this outcome. Proposed, to confirm by a Kenyan English teacher.', strength: 'essential', status: 'proposed' }); nHonoured++; }
  const leads_to = (LEADS8[k.id] || []).map(ref => {
    const letter = ref.split('.').pop(); const s8 = subOfGrade(g8, 'ENGL.G8.', ref.slice(0, ref.lastIndexOf('.'))); const o = s8.outcomes.find(x => x.letter === letter);
    if (!o) throw new Error(`${k.id}: no Grade 8 outcome ${ref}`);
    return { skill: o.code, reason: 'Grade 8 English builds on this skill. Proposed, to confirm by a Kenyan English teacher.' };
  });
  nPre += pre.length; nLeads += leads_to.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites: pre, leads_to, status: 'proposed' });
}
for (const [o] of g6leads) if (!coveredBy.has(o) && g7outcomes.has(o)) unhonoured.push(o);
const seen = new Set();
for (const m of MIS) {
  const skillCode = byId.get(m.skill);
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  if (!/^M7_/.test(m.code)) throw new Error(`${m.code}: must start M7_`);
  if (seen.has(m.code)) throw new Error(`duplicate ${m.code}`); seen.add(m.code);
  const sub = g7.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  sub.misconceptions.push({ code: `${skillCode}.${m.code}`, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
g7.totals = { ...g7.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
g7.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (13 Nov 2026) are proposed or draft, written offline by Claude, awaiting a Kenyan English teacher's review";
writeFileSync(path, JSON.stringify(g7, null, 1) + '\n');
console.log(`english g7: ${SKILLS.length} skills, ${nPre} prerequisites (${nHonoured} from Grade 6 leads_to), ${nLeads} leads-to links into Grade 8, ${MIS.length} misconceptions over ${g7.sub_strands.filter(s => s.skills.length).length} sub-strands`);
if (unhonoured.length) console.log(`Grade 6 leads_to into Grade 7 outcomes no Grade 7 skill covers: ${unhonoured.join(', ')}`);
