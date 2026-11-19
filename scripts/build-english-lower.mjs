// ============================================================================
// ENGLISH GRADES 1, 2 AND 3 (18 Nov 2026): map a lower-primary English grade to the Grade 5 Maths standard
// (Tuta Workspace/HOREB_MAPPING_PLAN.md), on the same path as English Grades 4-9.
//   node scripts/build-english-lower.mjs 3        (or 2, or 1)
// These grades had outcomes only (no first pass), so every skill, prerequisite, misconception and teaching pack entry
// comes from the depth data in scripts/data/english-depth/g<N>-*.mjs through scripts/lib/english-depth.mjs (applyDepth).
// Idempotent: skills and misconceptions are rebuilt from the data every run; the official outcomes are never touched.
// Prerequisites written as an outcome of the grade below (G2o:...) are moved onto the skill of that grade that covers the
// outcome, once that grade has skills (Grade 3 names Grade 2 skills, Grade 2 names Grade 1 skills). Grade 1 has no grade
// below: its early skills name the pre-primary readiness skills defined inside Grade 1 (sub-strand READY in the notes).
// No question family names a Grade 1-3 skill yet, so every skill is marked no_family (listed by the report, not failed).
// Then runs scripts/build-subject-map.mjs english <N> (curriculumMap.english.g<N>.js and the two engine data files).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { applyDepth, coverage } from './lib/english-depth.mjs';

const GRADE = Number(process.argv[2]);
if (![1, 2, 3].includes(GRADE)) { console.error('usage: node scripts/build-english-lower.mjs 1|2|3'); process.exit(1); }
const file = (g) => new URL(`../curriculum/english/g${g}.json`, import.meta.url);
const doc = JSON.parse(readFileSync(file(GRADE), 'utf8'));
for (const s of doc.sub_strands) { s.skills = []; s.misconceptions = []; }
const counts = await applyDepth(GRADE, doc, { families: [] });
// Grade 1: the pre-primary readiness skills its prerequisites name (PP:ID), from scripts/data/english-depth/g1-*.mjs (READY).
if (GRADE === 1) {
  const { readdirSync } = await import('node:fs');
  const dir = new URL('./data/english-depth/', import.meta.url);
  const READY = [];
  for (const f of readdirSync(dir).filter(f => /^g1-.*\.mjs$/.test(f)).sort()) READY.push(...((await import(new URL(f, dir).href)).READY || []));
  doc.readiness = READY.map(([id, name, what]) => ({ code: `ENGL.PP2.READINESS.${id}`, name, what, status: 'proposed' }));
  const known = new Set(doc.readiness.map(r => r.code));
  const missing = [...new Set(doc.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites.map(p => p.requires))).filter(c => c.startsWith('ENGL.PP2.') && !known.has(c)))];
  if (missing.length) throw new Error(`readiness skills named but not defined: ${missing.join(', ')}`);
}
if (!counts) { console.error(`no depth data for Grade ${GRADE} (scripts/data/english-depth/g${GRADE}-*.mjs)`); process.exit(1); }

// Outcome prerequisites of the grade below -> the skill of that grade that covers the outcome (first one listed).
let moved = 0;
const short = [];
if (GRADE > 1) {
  const below = JSON.parse(readFileSync(file(GRADE - 1), 'utf8'));
  const cov = coverage(below);
  if (cov.size) for (const s of doc.sub_strands) for (const k of s.skills) {
    const next = [];
    for (const p of k.prerequisites) {
      const skill = p.kind === 'outcome' && p.requires.startsWith(`ENGL.G${GRADE - 1}.`) ? (cov.get(p.requires) || [])[0] : null;
      const q = skill ? { ...p, requires: skill, kind: 'skill', reason: p.reason.replace(/^Grade \d English set this outcome first\./, `Grade ${GRADE - 1} English taught it first.`) } : p;
      if (skill) moved++;
      if (!next.some(x => x.requires === q.requires)) next.push(q);
    }
    if (new Set(next.map(p => p.requires)).size < 2) short.push(k.code);
    k.prerequisites = next;
  }
  if (short.length) throw new Error(`fewer than two prerequisites once Grade ${GRADE - 1} outcomes are moved onto its skills (add another): ${short.join(', ')}`);
  const all = doc.sub_strands;
  doc.totals.prerequisites = all.reduce((n, s) => n + s.skills.reduce((m, k) => m + k.prerequisites.length, 0), 0);
}
writeFileSync(file(GRADE), JSON.stringify(doc, null, 1) + '\n');
console.log(`english g${GRADE}: ${doc.totals.skills} skills, ${doc.totals.prerequisites} prerequisites${GRADE > 1 ? ` (${moved} moved from Grade ${GRADE - 1} outcomes onto its skills)` : ` (${doc.readiness.length} pre-primary readiness skills defined under readiness)`}, ${doc.totals.misconceptions} misconceptions`);
const r = spawnSync('node', ['scripts/build-subject-map.mjs', 'english', String(GRADE), '--dir', 'english', '--title', 'English'], { stdio: 'inherit', cwd: new URL('..', import.meta.url).pathname });
process.exit(r.status || 0);
