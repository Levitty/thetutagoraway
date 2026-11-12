// ============================================================================
// ENGLISH GRADE 4: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/english/g4.json), then build the in-app map the question families read.
//   node scripts/build-english-g4.mjs
// Idempotent: skills, prerequisites, leads_to and misconceptions are rebuilt from scripts/data/english-g4-skills.mjs
// every run; the official outcomes, sub-strand text and KICD rubrics are never touched.
// Prerequisites reach back to Grade 3 English outcomes (kind 'outcome') and to Grade 4 skills (kind 'skill');
// leads_to names Grade 5 English skills. All skills are 'proposed' and all misconceptions 'draft' until a Kenyan English teacher reviews them.
// Then runs scripts/build-subject-map.mjs english 4 (curriculumMap.english.g4.js and the two engine data files).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { SKILLS, MIS, ALSO } from './data/english-g4-skills.mjs';

const path = new URL('../curriculum/english/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(path, 'utf8'));
const g3 = JSON.parse(readFileSync(new URL('../curriculum/english/g3.json', import.meta.url), 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/english/g5.json', import.meta.url), 'utf8'));
const G3_OUTCOMES = new Map(g3.sub_strands.flatMap(s => s.outcomes.map(o => [o.code, o])));
const G5_SKILLS = g5.sub_strands.flatMap(s => s.skills || []).map(k => k.code);
const P = 'ENGL.G4.';

const subOf = (key) => {
  const hit = g4.sub_strands.filter(s => s.code.startsWith(`${P}${key}_`));
  if (hit.length !== 1) throw new Error(`sub-strand key ${key} matches ${hit.length}`);
  return hit[0];
};
const codeOf = (sub, id) => `${sub.code}.${id}`;
for (const s of g4.sub_strands) { s.skills = []; s.misconceptions = []; }

const byKey = new Map();   // 'LANGUA.T1.ARTICLES' -> full code
for (const k of SKILLS) byKey.set(`${k.sub}.${k.id}`, codeOf(subOf(k.sub), k.id));
const g3Outcome = (ref) => {   // 'G3:LANGUA.T5.a'
  const [a, b, letter] = ref.slice(3).split('.');
  const hit = [...G3_OUTCOMES.keys()].filter(c => (c.startsWith(`ENGL.G3.${a}.${b}_`) || c.startsWith(`ENGL.G3.${a}.${b}.`)) && c.endsWith(`.${letter}`));
  if (hit.length !== 1) throw new Error(`Grade 3 outcome ${ref} matches ${hit.length}`);
  return hit[0];
};
const resolvePre = (r) => {
  if (r.startsWith('G3:')) return { requires: g3Outcome(r), kind: 'outcome', grade: 3 };
  if (byKey.has(r)) return { requires: byKey.get(r), kind: 'skill', grade: 4 };
  throw new Error(`unknown prerequisite ${r}`);
};
const g5Skill = (ref) => {
  const [a, b, id] = ref.split('.');
  const hit = G5_SKILLS.filter(c => c.startsWith(`ENGL.G5.${a}.${b}_`) && c.endsWith(`.${id}`));
  if (hit.length !== 1) throw new Error(`Grade 5 skill ${ref} matches ${hit.length}`);
  return hit[0];
};

let nPre = 0, nLead = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => {
    const o = sub.outcomes.find(x => x.letter === l);
    if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${l}`);
    return o.code;
  });
  for (const ref of ALSO[`${k.sub}.${k.id}`] || []) {
    const [a, b, letter] = ref.split('.');
    const other = subOf(`${a}.${b}`), o = other.outcomes.find(x => x.letter === letter);
    if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${ref}`);
    if (!outcomes.includes(o.code)) outcomes.push(o.code);
  }
  const prerequisites = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by a Kenyan English teacher.', status: 'proposed' }));
  nPre += prerequisites.length;
  const leads_to = k.leads.map(g5Skill);
  nLead += leads_to.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
for (const m of MIS) {
  const skillCode = byKey.get(m.skill);
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  const sub = g4.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  const full = `${skillCode}.${m.code}`;
  if (sub.misconceptions.some(x => x.code === full)) throw new Error(`duplicate ${full}`);
  sub.misconceptions.push({ code: full, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
const all = g4.sub_strands;
g4.totals = { ...g4.totals, skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: nPre, misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0) };
g4.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (12 Nov 2026) are proposed or draft, written offline by Claude, awaiting a Kenyan English teacher's review";
writeFileSync(path, JSON.stringify(g4, null, 1) + '\n');
console.log(`${SKILLS.length} skills, ${nPre} prerequisites, ${nLead} leads_to links, ${MIS.length} misconceptions over ${all.filter(s => s.skills.length).length} sub-strands`);
const r = spawnSync('node', ['scripts/build-subject-map.mjs', 'english', '4', '--dir', 'english', '--title', 'English'], { stdio: 'inherit', cwd: new URL('..', import.meta.url).pathname });
process.exit(r.status || 0);
