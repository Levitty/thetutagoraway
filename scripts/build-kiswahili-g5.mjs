// ============================================================================
// KISWAHILI GRADE 5: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/kiswahili/g5.json). Then run: npm run subject:map -- kiswahili 5 --dir kiswahili --title "Kiswahili"
//   node scripts/build-kiswahili-g5.mjs
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/kiswahili-g5-skills.mjs
// every run; the official outcomes and sub-strand text are never touched.
// All skills are 'proposed' and all misconceptions 'draft' until a native Kiswahili teacher reviews them.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS, MIS, ALSO } from './data/kiswahili-g5-skills.mjs';

const path = new URL('../curriculum/kiswahili/g5.json', import.meta.url);
const g5 = JSON.parse(readFileSync(path, 'utf8'));
const g4 = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g4.json', import.meta.url), 'utf8'));
const G4_OUTCOMES = new Set(g4.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const P = 'KISW.G5.';

const subOf = (key) => {
  const hit = g5.sub_strands.filter(s => s.code === `${P}${key}`);
  if (hit.length !== 1) throw new Error(`sub-strand key ${key} matches ${hit.length}`);
  return hit[0];
};
const codeOf = (sub, id) => `${sub.code}.${id}`;
for (const s of g5.sub_strands) { s.skills = []; s.misconceptions = []; }

const byKey = new Map();   // 'SARUFI.T1_AINA_ZA_NOMINO.PEKEE' -> full code
for (const k of SKILLS) byKey.set(`${k.sub}.${k.id}`, codeOf(subOf(k.sub), k.id));
const resolvePre = (r) => {
  if (byKey.has(r)) return { requires: byKey.get(r), kind: 'skill' };
  if (G4_OUTCOMES.has(r)) return { requires: r, kind: 'outcome' };
  throw new Error(`unknown prerequisite ${r}`);
};
const outcomeByRef = (ref) => {   // 'KUANDI.T2_INSHA_YA_MASIMULIZI.a'
  const i = ref.lastIndexOf('.'), sub = subOf(ref.slice(0, i)), o = sub.outcomes.find(x => x.letter === ref.slice(i + 1));
  if (!o) throw new Error(`no outcome ${ref}`);
  return o.code;
};

let nPre = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => outcomeByRef(`${k.sub}.${l}`));
  for (const ref of ALSO[`${k.sub}.${k.id}`] || []) outcomes.push(outcomeByRef(ref));
  const prerequisites = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by a native Kiswahili teacher.', status: 'proposed' }));
  nPre += prerequisites.length;
  sub.skills.push({ code: codeOf(sub, k.id), name: k.name, outcomes, mastery: k.mastery, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const seenShort = new Set();
for (const m of MIS) {
  const skillCode = byKey.get(m.skill);
  if (!skillCode) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  if (seenShort.has(m.code)) throw new Error(`duplicate misconception code ${m.code}`);
  seenShort.add(m.code);
  const sub = g5.sub_strands.find(s => skillCode.startsWith(`${s.code}.`));
  sub.misconceptions.push({ code: `${skillCode}.${m.code}`, skill: skillCode, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
const all = g5.sub_strands;
g5.totals = { ...g5.totals, skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: nPre, misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0) };
g5.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (12 Nov 2026) are proposed or draft, written offline by Claude, awaiting a native Kiswahili teacher's review";
writeFileSync(path, JSON.stringify(g5, null, 1) + '\n');
console.log(`${SKILLS.length} skills, ${nPre} prerequisites, ${MIS.length} misconceptions over ${all.filter(s => s.skills.length).length} sub-strands`);
