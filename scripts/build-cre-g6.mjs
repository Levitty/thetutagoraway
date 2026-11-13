// ============================================================================
// CRE GRADE 5: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/cre/g6.json), then run the generic map builder.
//   node scripts/build-cre-g6.mjs
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/cre-g6-skills.mjs every run.
// The official outcomes, the sub-strand text and the KICD rubrics (and rubric_indicators) are never touched.
// All skills are 'proposed' and all misconceptions 'draft' until a CRE teacher has reviewed them.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { SKILLS, MIS } from './data/cre-g6-skills.mjs';

const path = new URL('../curriculum/cre/g6.json', import.meta.url);
const g6 = JSON.parse(readFileSync(path, 'utf8'));
const lower = [4, 5].flatMap(g => JSON.parse(readFileSync(new URL(`../curriculum/cre/g${g}.json`, import.meta.url), 'utf8')).sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const LOWER = new Set(lower);
const P = 'CRE.G6.';
const SP = 'CRES.G6.';   // skill codes: four capitals, which the registry's prefix rule needs; the official outcome codes stay CRE.G6.

const subOf = (key) => {
  const hit = g6.sub_strands.filter(s => s.code === `${P}${key}`);
  if (hit.length !== 1) throw new Error(`sub-strand key ${key} matches ${hit.length}`);
  return hit[0];
};
const skillCode = (sub, id) => `${SP}${sub.code.slice(P.length)}.${id}`;
for (const s of g6.sub_strands) { s.skills = []; s.misconceptions = []; }

const byKey = new Map();
for (const k of SKILLS) byKey.set(`${k.sub}.${k.id}`, skillCode(subOf(k.sub), k.id));
const resolvePre = (r) => {
  if (byKey.has(r)) return { requires: byKey.get(r), kind: 'skill' };
  if (LOWER.has(r)) return { requires: r, kind: 'outcome' };
  throw new Error(`unknown prerequisite ${r}`);
};
const RULE = ' Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.';
let nPre = 0;
for (const k of SKILLS) {
  const sub = subOf(k.sub);
  const outcomes = k.outcomes.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${k.sub}.${k.id}: no outcome ${l}`); return o.code; });
  const prerequisites = k.pre.map(r => ({ ...resolvePre(r), strength: 'essential', reason: 'Proposed: this skill builds on it. To confirm by a CRE teacher.', status: 'proposed' }));
  nPre += prerequisites.length;
  sub.skills.push({ code: skillCode(sub, k.id), name: k.name, outcomes, mastery: k.mastery + RULE, question_forms: k.forms, thinking: k.thinking, horeb_skill_ids: [], prerequisites, status: 'proposed' });
}
const seen = new Set();
for (const m of MIS) {
  const [a, b, id] = m.skill.split('.');
  const code = byKey.get(m.skill);
  if (!code) throw new Error(`misconception ${m.code}: unknown skill ${m.skill}`);
  const sub = g6.sub_strands.find(s => code.startsWith(`${SP}${s.code.slice(P.length)}.`));
  const full = `${code}.${m.code}`;
  if (seen.has(full)) throw new Error(`duplicate ${full}`);
  seen.add(full);
  sub.misconceptions.push({ code: full, skill: code, error: m.error, example: m.example, cause: m.cause,
    reveals: `Offer "${m.example.wrong_answer}" beside "${m.example.correct_answer}" and ask the child to choose.`, help: m.help, feedback: m.feedback, source: m.source, status: 'draft' });
}
for (const k of SKILLS) if (!MIS.some(m => m.skill === `${k.sub}.${k.id}`)) throw new Error(`skill ${k.id} has no misconception`);
const all = g6.sub_strands;
g6.totals = { ...g6.totals, skills: all.reduce((n, s) => n + s.skills.length, 0), prerequisites: nPre, misconceptions: all.reduce((n, s) => n + s.misconceptions.length, 0) };
g6.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions (13 Nov 2026) are proposed or draft, written offline by Claude, awaiting a CRE teacher's review. Rubrics from KICD, untouched.";
writeFileSync(path, JSON.stringify(g6, null, 1) + '\n');
console.log(`${SKILLS.length} skills, ${nPre} prerequisites, ${MIS.length} misconceptions over ${all.filter(s => s.skills.length).length} sub-strands`);
const r = spawnSync('node', [new URL('./build-subject-map.mjs', import.meta.url).pathname, 'cre', '6', '--dir', 'cre', '--title', 'Christian Religious Education'], { stdio: 'inherit' });
process.exit(r.status ?? 0);
