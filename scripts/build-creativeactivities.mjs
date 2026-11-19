// ============================================================================
// CREATIVE ACTIVITIES GRADES 1-3 (19 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md): the files HOREB owns
// (curriculum/creative_activities/g<N>.json) had the KICD outcomes, learning experiences and rubrics only. This merges the
// skills of scripts/data/creativeactivities-depth/g<N>.mjs (SKILLS), then the depth pass of Creative Arts G4-9 (SUBS through
// scripts/science-depth.mjs): prerequisites, four misconceptions per skill, the teaching pack
// (curriculum/creative_activities/teaching/g<N>/) and the practical outcomes marked by the teacher with the KICD rubric
// (applyRubric of scripts/data/creativearts-depth/lib.mjs). Grade 1 also writes READINESS: the pre-primary readiness skills
// (CREA.PP2.READINESS.*) its prerequisites name, defined by HOREB in g1.json under readiness for a teacher to confirm against
// the PP1-PP2 Creative Activities design; they are not rows of curriculum_skills.
//   node scripts/build-creativeactivities.mjs 3      (then it rebuilds the in-app map: build-subject-map.mjs creativeactivities 3)
// Idempotent. Official outcomes and sub-strand text are never touched. Skills 'proposed', misconceptions 'draft'.
// No question families exist, so there is no subject entry (src/ai-tutor/content/subjects/) for Grades 1-3.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { applyRubric } from './data/creativearts-depth/lib.mjs';
import { applyDepth } from './science-depth.mjs';

const GRADE = Number(process.argv[2]);
if (![1, 2, 3].includes(GRADE)) { console.error('usage: node scripts/build-creativeactivities.mjs 1|2|3'); process.exit(1); }
const { SKILLS, SUBS: DEPTH, READINESS } = await import(`./data/creativeactivities-depth/g${GRADE}.mjs`);
const FM = ['pick the right answer', 'pick the right answer in a short story', "spot the mistake in a friend's answer"];
const path = new URL(`../curriculum/creative_activities/g${GRADE}.json`, import.meta.url);
const g = JSON.parse(readFileSync(path, 'utf8'));
const P = `CREA.G${GRADE}.`;
for (const s of g.sub_strands) { s.skills = []; s.misconceptions = []; }
if (READINESS) g.readiness = READINESS.map(([id, name, what]) => ({ code: `CREA.PP2.READINESS.${id}`, name, what, status: 'proposed' }));
const seen = new Set();
for (const [subKey, id, name, letters, mastery] of SKILLS) {
  const sub = g.sub_strands.find(x => x.code === `${P}${subKey}`); if (!sub) throw new Error(`no sub-strand ${subKey}`);
  if (seen.has(id)) throw new Error(`duplicate skill ${id}`); seen.add(id);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.code === `${sub.code}.${l}`); if (!o) throw new Error(`${id}: no outcome ${l}`); return o.code; });
  sub.skills.push({ code: `${sub.code}.${id}`, name, outcomes, mastery: `${mastery} Evidence rule: at least four of the last five fresh questions right across at least two question forms, read aloud to the child where needed, and no repeated pick of the same misconception.`, question_forms: FM, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites: [], status: 'proposed' });
}
// Before writing, the readiness skills must be known to the depth pass: write them first so knownCodes() reads them.
if (READINESS) writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
const nRubric = applyRubric(g, DEPTH, P);
const depth = applyDepth(g, DEPTH, { dir: 'creative_activities', grade: GRADE, prefix: P, derive: true, title: 'Creative Activities' });
g.status = `outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 19 Nov 2026, depth pass: two or more prerequisites and four misconceptions per skill, practical outcomes marked by the teacher with the KICD rubric, teaching pack in curriculum/creative_activities/teaching/g${GRADE}${READINESS ? '; pre-primary readiness skills under readiness' : ''}), awaiting a CBC Creative Activities teacher's review`;
writeFileSync(path, JSON.stringify(g, null, 1) + '\n');
console.log(`creative activities g${GRADE}: ${g.totals.skills} skills, ${g.totals.prerequisites} prerequisites, ${g.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (${depth.pack} teaching pack entries, ${nRubric} practical outcomes to the teacher's rubric)`);
execFileSync(process.execPath, [new URL('build-subject-map.mjs', import.meta.url).pathname, 'creativeactivities', String(GRADE), '--dir', 'creative_activities', '--title', 'Creative Activities'], { stdio: 'inherit' });
