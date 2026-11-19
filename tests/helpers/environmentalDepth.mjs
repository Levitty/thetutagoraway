// The Grade 5 Maths standard for Environmental Activities Grades 1-3 (owner, 19 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md),
// through the same checks as Science (tests/helpers/scienceDepth.mjs), plus: practical outcomes go to the teacher's KICD rubric
// through a knowledge skill, no two misconceptions share a cause, the SQL loads every row, Grade 1's readiness skills are defined
// once and used. No question families exist yet, so there is no subject entry and every skill is in the awaiting list.
// Build with: node scripts/build-environmental-grade.mjs <n>.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scienceDepthTests } from './scienceDepth.mjs';
import { EA_NOT_TESTED } from '../../scripts/data/environmental-depth/common.mjs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

export async function environmentalDepthTests({ grade, outcomes, totals, minDown = 0.5 }) {
  const { AWAITING } = await import(`../../src/ai-tutor/content/families/environmentalactivities_g${grade}_awaiting.js`);
  scienceDepthTests({ dir: 'environmental_activities', subject: 'environmentalactivities', grade, outcomes, noFamilies: AWAITING, minDown, notTested: EA_NOT_TESTED, families: false });
  lowerGradeTests({ label: `environmentalactivities Grade ${grade}`, file: `curriculum/environmental_activities/g${grade}.json`,
    sql: `supabase/migrations/20261127_environmental_activities_g${grade}_skills_misconceptions.sql`, attitude: EA_NOT_TESTED, totals, awaiting: AWAITING, readinessPrefix: 'ENVI.PP2.READINESS.' });
}

// Shared by CRE Grades 1-3 (tests/helpers/creDepth.mjs) and Environmental Activities Grades 1-3.
export function lowerGradeTests({ label, file, sql: sqlFile, attitude, totals, awaiting, readinessPrefix }) {
  const source = JSON.parse(read(file));
  const skills = source.sub_strands.flatMap(s => s.skills);

  test(`${label}: the depth pass totals, and every skill awaits a family (none exist yet)`, () => {
    assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], totals);
    assert.deepEqual(awaiting, skills.map(k => k.code));
  });

  test(`${label}: no two misconceptions share a cause`, () => {
    const causes = new Map();
    for (const s of source.sub_strands) for (const m of s.misconceptions) {
      assert.ok(!causes.has(m.cause), `${m.code} and ${causes.get(m.cause)} share the cause "${m.cause}"`);
      causes.set(m.cause, m.code);
    }
  });

  test(`${label}: practical outcomes are marked by the teacher with the KICD rubric through a knowledge skill, never a phone question`, () => {
    const indicators = new Set((source.rubrics || []).flatMap(r => r.indicators.map(i => i.code)));
    for (const s of source.sub_strands) for (const k of s.skills) {
      if (!k.teacher_rubric) continue;
      const r = k.teacher_rubric;
      assert.equal(r.by, 'teacher');
      assert.ok(r.outcomes.length && r.outcomes.every(c => s.outcomes.some(o => o.code === c)), `${k.code}: rubric outcome outside its sub-strand`);
      for (const c of r.outcomes) assert.ok(!attitude.test(s.outcomes.find(o => o.code === c).text.trim()), `${c}: an attitude is not a practical`);
      for (const c of r.outcomes) assert.ok(!k.outcomes.includes(c), `${c}: both asked and marked`);
      const inFile = (source.rubrics || []).some(x => x.covers.includes(s.code)) || (s.rubric_indicators || []).length;
      if (inFile) assert.ok(r.indicators.length && r.indicators.every(i => indicators.has(i)), `${k.code}: unknown KICD rubric indicator`);
      else assert.ok(!r.indicators.length && /not in the file/.test(r.note), `${k.code}: the strand has no rubric in the file; say so`);
      assert.match(k.mastery, /marked by the teacher with the KICD rubric/);
    }
  });

  test(`${label}: the SQL loads every skill, prerequisite and misconception in one idempotent transaction (not run)`, () => {
    const sql = read(sqlFile);
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
  });

  test(`${label}: prerequisites below the grade name the grade below's skills where one covers the outcome; readiness skills are defined and used`, () => {
    const grade = source.grade;
    if (grade > 1) {
      const below = JSON.parse(read(file.replace(`g${grade}.json`, `g${grade - 1}.json`)));
      const covered = new Map(below.sub_strands.flatMap(s => s.skills.flatMap(k => k.outcomes.map(o => [o, k.code]))));
      for (const k of skills) for (const p of k.prerequisites) if (p.kind === 'outcome' && covered.has(p.requires)) {
        assert.ok(k.prerequisites.some(q => q.requires === covered.get(p.requires)), `${k.code}: ${p.requires} is covered by ${covered.get(p.requires)} (rebuild this grade)`);
      }
    } else {
      const ready = (source.readiness || []).map(r => r.code);
      assert.ok(ready.length >= 4 && ready.every(c => c.startsWith(readinessPrefix)), 'readiness skills defined in g1.json');
      const used = new Set(skills.flatMap(k => k.prerequisites.map(p => p.requires)));
      for (const c of ready) assert.ok(used.has(c), `${c} is defined but never used`);
      for (const c of used) if (c.startsWith(readinessPrefix)) assert.ok(ready.includes(c), `${c} is used but not defined`);
    }
  });
}
