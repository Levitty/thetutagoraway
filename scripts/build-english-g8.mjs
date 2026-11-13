// ============================================================================
// ENGLISH GRADE 8: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/english/g8.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-english-g8.mjs      then  npm run subject:map -- english 8 --dir english --title English
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/english-g8-*.mjs every run.
// All skills are 'proposed' and all misconceptions 'draft' until a Kenyan English teacher reviews them.
// The Grade 7 skills that lead to a Grade 8 outcome (leads_to in curriculum/english/g7.json) become prerequisites of the Grade 8
// skills that cover that outcome, so the Grade 7 links into Grade 8 are honoured by the build itself.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, ALSO } from './data/english-g8-skills.mjs';
import { MIS } from './data/english-g8-mis.mjs';

const load = (g) => JSON.parse(readFileSync(new URL(`../curriculum/english/g${g}.json`, import.meta.url), 'utf8'));
const path = new URL('../curriculum/english/g8.json', import.meta.url);
const g8 = load(8), g7 = load(7);
const subOf = (key) => {
  const P = 'ENGL.G8.';
  const hit = g8.sub_strands.filter(s => s.code === `${P}${key}` || s.code.startsWith(`${P}${key}_`) || (key.includes('_') && s.code.startsWith(`${P}${key}`)));
  const exact = hit.filter(s => s.code === `${P}${key}`);
  const one = exact.length === 1 ? exact : hit;
  if (one.length !== 1) throw new Error(`${P}${key} matches ${one.length}`);
  return one[0];
};
for (const s of g8.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, id) => `${sub.code}.${id}`;
const byId = new Map(SKILLS.map(k => [k.id, codeOf(subOf(k.sub), k.id)]));
if (byId.size !== SKILLS.length) throw new Error('duplicate skill id');
const G7 = g7.sub_strands.flatMap(s => (s.skills || []).map(k => k.code));
const resolvePre = (r) => {
  if (r.startsWith('S:')) { const c = byId.get(r.slice(2)); if (!c) throw new Error(`unknown prerequisite ${r}`); return { requires: c, kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a Kenyan English teacher.' }; }
  if (r.startsWith('G7:')) { const hit = G7.filter(c => c.endsWith(`.${r.slice(3)}`)); if (hit.length !== 1) throw new Error(`unknown Grade 7 skill ${r}`); return { requires: hit[0], kind: 'skill', reason: 'Grade 7 English taught it first. Proposed, to confirm by a Kenyan English teacher.' }; }
  throw new Error(`bad prerequisite ${r}`);
};
const g7leads = new Map();
for (const s of g7.sub_strands) for (const k of s.skills || []) for (const l of k.leads_to || []) {
  if (!/^ENGL\.G8\./.test(l.skill)) continue;
  (g7leads.get(l.skill) || g7leads.set(l.skill, []).get(l.skill)).push(k.code);
}
let nPre = 0, nHonoured = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${l}`); return o.code; });
  const pre = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', status: 'proposed' }));
  for (const o of outcomes) for (const c7 of g7leads.get(o) || []) if (!pre.some(p => p.requires === c7)) { pre.push({ requires: c7, kind: 'skill', strength: 'essential', reason: 'Grade 7 English leads to this outcome. Proposed, to confirm by a Kenyan English teacher.', status: 'proposed' }); nHonoured++; }
  nPre += pre.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites: pre, status: 'proposed' });
}
const seen = new Set();
for (const m of MIS) {
  const skillCode = byId.get(m.skill);
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  if (!/^M8_/.test(m.code)) throw new Error(`${m.code}: must start M8_`);
  if (seen.has(m.code)) throw new Error(`duplicate ${m.code}`); seen.add(m.code);
  const sub = g8.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  sub.misconceptions.push({ code: `${skillCode}.${m.code}`, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
g8.totals = { ...g8.totals, skills: SKILLS.length, prerequisites: nPre, misconceptions: MIS.length };
g8.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (13 Nov 2026) are proposed or draft, written offline by Claude, awaiting a Kenyan English teacher's review";
writeFileSync(path, JSON.stringify(g8, null, 1) + '\n');
console.log(`english g8: ${SKILLS.length} skills, ${nPre} prerequisites (${nHonoured} from Grade 7 leads_to), ${MIS.length} misconceptions over ${g8.sub_strands.filter(s => s.skills.length).length} sub-strands`);
