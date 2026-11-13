// ============================================================================
// KISWAHILI GRADE 4: merge the authored skills, prerequisites, leads_to and misconception library into the file
// HOREB owns (curriculum/kiswahili/g4.json), then build the map.
//   node scripts/build-kiswahili-g4.mjs
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/kiswahili-g4-skills.mjs
// every run; the official outcomes, sub-strand text and the KICD rubrics are never touched.
// All skills are 'proposed' and all misconceptions 'draft' until a native Kiswahili teacher reviews them.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { SKILLS, MIS, ALSO } from './data/kiswahili-g4-skills.mjs';

const path = new URL('../curriculum/kiswahili/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const g3 = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g3.json', import.meta.url), 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g5.json', import.meta.url), 'utf8'));
const G3_OUTCOMES = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const G5_SKILLS = new Set(g5.sub_strands.flatMap(s => s.skills || []).map(k => k.code));
const P = 'KISW.G4.';

const subOf = (key) => {
  const hit = g4.sub_strands.filter(s => s.code === `${P}${key}`);
  if (hit.length !== 1) throw new Error(`sub-strand key ${key} matches ${hit.length}`);
  return hit[0];
};
const codeOf = (sub, id) => `${sub.code}.${id}`;
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }

const byKey = new Map();   // 'SARUFI.T1_NOMINO.NOMINO' -> full code
for (const k of SKILLS) byKey.set(`${k.sub}.${k.id}`, codeOf(subOf(k.sub), k.id));
const resolvePre = (r) => {
  if (r.startsWith('G3:')) {
    const code = `KISW.G3.${r.slice(3)}`;
    if (!G3_OUTCOMES.has(code)) throw new Error(`unknown Grade 3 outcome ${code}`);
    return { requires: code, kind: 'outcome', grade: 3 };
  }
  if (byKey.has(r)) return { requires: byKey.get(r), kind: 'skill', grade: 4 };
  throw new Error(`unknown prerequisite ${r}`);
};
const g5Skill = (ref) => {
  const code = `KISW.G5.${ref}`;
  if (!G5_SKILLS.has(code)) throw new Error(`unknown Grade 5 skill ${code}`);
  return { skill: code, reason: 'Grade 5 builds on this skill. Proposed, to confirm by a native Kiswahili teacher.' };
};
const outcomeByRef = (ref) => {   // 'KUANDI.T6_INSHA_YA_WASIFU.a'
  const i = ref.lastIndexOf('.'), sub = subOf(ref.slice(0, i)), o = sub.outcomes.find(x => x.letter === ref.slice(i + 1));
  if (!o) throw new Error(`no outcome ${ref}`);
  return o.code;
};

let nPre = 0, nLead = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => outcomeByRef(`${k.sub}.${l}`));
  for (const ref of ALSO[`${k.sub}.${k.id}`] || []) { const c = outcomeByRef(ref); if (!outcomes.includes(c)) outcomes.push(c); }
  const prerequisites = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by a native Kiswahili teacher.', status: 'proposed' }));
  nPre += prerequisites.length;
  const leads_to = k.leads.map(g5Skill);
  nLead += leads_to.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
const seenShort = new Set();
for (const m of MIS) {
  const skillCode = byKey.get(m.skill);
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  if (seenShort.has(m.code)) throw new Error(`duplicate misconception code ${m.code}`);
  if (!m.code.startsWith('M4_')) throw new Error(`${m.code}: Grade 4 codes start M4_`);
  seenShort.add(m.code);
  const sub = g4.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  sub.misconceptions.push({ code: `${skillCode}.${m.code}`, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
const all = g4.sub_strands;
g4.totals = { ...g4.totals, skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: nPre, misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0) };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites, leads_to and misconceptions (13 Nov 2026) are proposed or draft, written offline by Claude, awaiting a native Kiswahili teacher's review";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`${SKILLS.length} skills, ${nPre} prerequisites, ${nLead} leads_to links, ${MIS.length} misconceptions over ${all.filter(s => s.skills.length).length} sub-strands`);
const r = spawnSync('node', ['scripts/build-subject-map.mjs', 'kiswahili', '4', '--dir', 'kiswahili', '--title', 'Kiswahili'], { stdio: 'inherit', cwd: new URL('..', import.meta.url).pathname });
process.exit(r.status || 0);
