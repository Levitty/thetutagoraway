// The Grade 5 Maths standard for CRE Grades 4-8 (owner, 18 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md), through the same
// checks as Science and Social Studies (tests/helpers/scienceDepth.mjs), plus what the CRE build adds: the list of skills with no
// family yet is current, the SQL loads every row, and no two misconceptions of a grade share one cause (the first pass gave many
// the same stock line). Faith, values, habits and practical outcomes are scored in class with the KICD rubric
// (scripts/data/cre-depth/common.mjs: CRE_NOT_TESTED). Build with: node scripts/build-cre-grade.mjs <n>.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scienceDepthTests } from './scienceDepth.mjs';
import { CRE_NOT_TESTED, CRE_NOT_TESTED_ATTITUDE } from '../../scripts/data/cre-depth/common.mjs';
import { lowerGradeTests } from './environmentalDepth.mjs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

export async function creDepthTests({ grade, outcomes, minDown = 0.5, totals }) {
  const { AWAITING } = await import(`../../src/ai-tutor/content/families/cre_g${grade}_awaiting.js`);
  if (grade <= 3) {   // Grades 1-3 (19 Nov 2026): outcomes only before, no families and no subject entry; teacher's rubric for practicals
    scienceDepthTests({ dir: 'cre', subject: 'cre', grade, outcomes, noFamilies: AWAITING, minDown, notTested: CRE_NOT_TESTED, families: false });
    lowerGradeTests({ label: `cre Grade ${grade}`, file: `curriculum/cre/g${grade}.json`, sql: `supabase/migrations/20261126_cre_g${grade}_skills_misconceptions.sql`,
      attitude: CRE_NOT_TESTED_ATTITUDE, totals, awaiting: AWAITING, readinessPrefix: 'CRE.PP2.READINESS.' });
    return;
  }
  scienceDepthTests({ dir: 'cre', subject: 'cre', grade, outcomes, noFamilies: AWAITING, minDown, notTested: CRE_NOT_TESTED });
  const source = JSON.parse(read(`curriculum/cre/g${grade}.json`));
  const label = `cre Grade ${grade}`;

  test(`${label}: the skills with no family are listed in cre_g${grade}_awaiting.js and the entry carries the list`, async () => {
    const entry = (await import(`../../src/ai-tutor/content/subjects/cre_g${grade}.js`)).default;
    const used = new Set(entry.families.map(f => f.cskill));
    assert.deepEqual(AWAITING, Object.keys(entry.map.skills).filter(c => !used.has(c)), `cre_g${grade}_awaiting.js is stale (node scripts/build-cre-grade.mjs ${grade})`);
    assert.equal(entry.awaiting, AWAITING);
  });

  test(`${label}: no two misconceptions share a cause`, () => {
    const causes = new Map();
    for (const s of source.sub_strands) for (const m of s.misconceptions) {
      assert.ok(!causes.has(m.cause), `${m.code} and ${causes.get(m.cause)} share the cause "${m.cause}"`);
      causes.set(m.cause, m.code);
    }
  });

  test(`${label}: the SQL loads every skill, prerequisite and misconception in one idempotent transaction (not run)`, () => {
    const sql = read(`supabase/migrations/20261126_cre_g${grade}_skills_misconceptions.sql`);
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
  });
}
