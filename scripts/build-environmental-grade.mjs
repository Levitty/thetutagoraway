// ============================================================================
// ENVIRONMENTAL ACTIVITIES, ONE GRADE (1-3) TO THE GRADE 5 MATHS STANDARD (owner, 19 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md).
//   node scripts/build-environmental-grade.mjs 3      (build 3, 2, 1; then rebuild 3 and 2 so their prerequisites name the skills
//                                                      of the grade below instead of its outcomes)
// The files had KICD outcomes only. Skills, prerequisites, misconceptions and the teaching pack are authored in
// scripts/data/environmental-depth/g<n>.mjs and merged through scripts/lib/subject-depth.mjs (the general pass) with the
// Grades 1-3 rules of scripts/lib/lower-grade.mjs (practical outcomes to the teacher's KICD rubric, Grade 1 readiness skills).
// Writes curriculum/environmental_activities/g<n>.json, the teaching pack curriculum/environmental_activities/teaching/g<n>/,
// the in-app map (scripts/build-subject-map.mjs environmentalactivities), the awaiting list (no families exist:
// src/ai-tutor/content/families/environmentalactivities_g<n>_awaiting.js) and the SQL
// supabase/migrations/20261127_environmental_activities_g<n>_skills_misconceptions.sql (scripts/lib/curriculum-sql.mjs), copied to
// ~/Desktop/Tuta Workspace/HOREB_SQL_EnvironmentalActivities_G<n>.sql. NOT RUN. Official outcomes and rubrics are never touched.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { deepenGrade, packFiles } from './lib/subject-depth.mjs';
import { curriculumSql } from './lib/curriculum-sql.mjs';
import { switchLowerRefs, lowerResolver, notTestedWith, applyRubrics, writeAwaitingAll, withOutcomeCleanup } from './lib/lower-grade.mjs';
import { EA_NOT_TESTED, REVIEWER, TC } from './data/environmental-depth/common.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const GRADE = Number(process.argv[2]);
if (![1, 2, 3].includes(GRADE)) { console.error('usage: node scripts/build-environmental-grade.mjs 1|2|3'); process.exit(1); }
const run = (args) => { const r = spawnSync('node', args, { stdio: 'inherit', cwd: ROOT }); if (r.status) process.exit(r.status); };
const load = (g) => { const f = join(ROOT, `curriculum/environmental_activities/g${g}.json`); return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null; };
const SUB = `ENVI.G${GRADE}.`, outcomePrefix = (g) => `ENVI.G${g}.`, READY = 'ENVI.PP2.READINESS.';

const cur = load(GRADE);
for (const s of cur.sub_strands) { s.skills = []; s.misconceptions = []; }   // idempotent: the grade had outcomes only
const data = await import(`./data/environmental-depth/g${GRADE}.mjs`);
const NEW = data.NEW.map(n => ({ ...n, pre: [...n.pre] }));
const sw = switchLowerRefs(NEW, { lower: load, outcomePrefix });
const taken = new Set();
for (const g of [1, 2, 3]) if (g !== GRADE) for (const s of load(g).sub_strands) for (const m of s.misconceptions || []) taken.add(m.code.slice(m.skill.length + 1));
const { packs, added, newSkills } = deepenGrade(cur, { NEW, DEPTH: {} }, {
  label: `Environmental Activities Grade ${GRADE}`, grade: GRADE, subPrefix: SUB, skillPrefix: SUB, lower: load, outcomePrefix,
  misPrefix: `M_E${GRADE}_`, taken, notTested: notTestedWith(cur, NEW, SUB, EA_NOT_TESTED), reviewer: REVIEWER,
  masteryRule: /four of the last five/, source: TC,
  resolveExtra: lowerResolver({ lower: load, outcomePrefix, readiness: data.READINESS, readinessPrefix: READY }),
});
const nRubric = applyRubrics(cur, NEW, { subPrefix: SUB, skillPrefix: SUB, attitude: EA_NOT_TESTED });
if (data.READINESS) cur.readiness = data.READINESS.map(r => ({ code: `${READY}${r.code}`, name: r.name, what: r.what, status: 'proposed' }));

const PACK_DIR = join(ROOT, `curriculum/environmental_activities/teaching/g${GRADE}/`);
mkdirSync(PACK_DIR, { recursive: true });
const files = packFiles(cur, packs, { subPrefix: SUB, skillPrefix: SUB, notes: data.NOTES || {},
  status: `draft: written 19 Nov 2026 offline for Grade ${GRADE} Environmental Activities; not yet checked by ${REVIEWER}; not loaded by the live tutor` });
for (const [slug, text] of Object.entries(files)) writeFileSync(join(PACK_DIR, slug), text);
for (const f of readdirSync(PACK_DIR)) if (f.endsWith('.json') && !files[f]) unlinkSync(join(PACK_DIR, f));
cur.status = `outcomes from KICD's text, word for word; skills and prerequisites proposed, misconceptions draft, teaching pack draft; mapped on 19 Nov 2026 to the Grade 5 Maths standard (two or more prerequisites and four misconceptions per skill, practical outcomes marked by the teacher with the KICD rubric); written offline by Claude, awaiting ${REVIEWER}'s review. Rubrics from KICD, untouched.`;
writeFileSync(join(ROOT, `curriculum/environmental_activities/g${GRADE}.json`), JSON.stringify(cur, null, 1) + '\n');
console.log(`environmental activities g${GRADE}: ${newSkills} skills, ${cur.totals.prerequisites} prerequisites (${sw.switched} lower-grade outcomes now name skills, ${sw.kept} kept as outcomes), ${added.mis} misconceptions, ${nRubric} practical outcomes to the teacher's rubric, ${Object.keys(files).length} teaching pack files`);

run(['scripts/build-subject-map.mjs', 'environmentalactivities', String(GRADE), '--dir', 'environmental_activities', '--title', 'Environmental Activities']);
const n = writeAwaitingAll(ROOT, `src/ai-tutor/content/families/environmentalactivities_g${GRADE}_awaiting.js`, cur, { label: `Grade ${GRADE} Environmental Activities`, generator: `scripts/build-environmental-grade.mjs ${GRADE}` });
console.log(`environmental activities g${GRADE}: ${n} skills with no family yet`);

const MIG = `20261127_environmental_activities_g${GRADE}_skills_misconceptions.sql`;
const sql = curriculumSql(cur, {
  title: `Grade ${GRADE} Environmental Activities`, when: 'owner, 19 Nov 2026',
  after: `20261110_curriculum.sql (the five curriculum tables); the Environmental Activities grades in order, 1 to 3 (prerequisites name the grade below${GRADE === 1 ? ' or pre-primary readiness skills, ENVI.PP2.READINESS.*, defined by HOREB in g1.json under readiness, not rows of curriculum_skills' : ''}; there is no foreign key on them)`,
  why: `Environmental Activities Grade ${GRADE} had KICD outcomes only (curriculum/environmental_activities/g${GRADE}.json); on 19 Nov 2026 it was mapped to the Grade 5 Maths standard (a skill for every testable outcome, practical outcomes to the teacher's KICD rubric, two or more prerequisites and four misconceptions per skill, a teaching pack).`,
  generator: `scripts/build-environmental-grade.mjs ${GRADE}`, source: `curriculum/environmental_activities/g${GRADE}.json`,
});
writeFileSync(join(ROOT, 'supabase/migrations', MIG), withOutcomeCleanup(sql.text, cur, `ENVI.G${GRADE}.%`));
const WS = join(homedir(), 'Desktop', 'Tuta Workspace');
if (existsSync(WS)) copyFileSync(join(ROOT, 'supabase/migrations', MIG), join(WS, `HOREB_SQL_EnvironmentalActivities_G${GRADE}.sql`));
console.log(`SQL: ${MIG} (${sql.skills} skills, ${sql.prerequisites} prerequisites, ${sql.misconceptions} misconceptions)${existsSync(WS) ? `, copied to Tuta Workspace/HOREB_SQL_EnvironmentalActivities_G${GRADE}.sql` : ''}`);
