// The Grade 5 Maths standard for Pre-Technical Studies Grades 7-9 (owner, 18 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md), through
// the same checks as Science, Social Studies and CRE (tests/helpers/scienceDepth.mjs), plus what the Pre-Technical build adds: the
// list of skills with no family yet is current, the SQL loads every row, no two misconceptions of a grade share one cause, every
// misconception in a safety sub-strand is marked SAFETY for a teacher to confirm, and every practical outcome sits under a knowledge
// skill whose mastery says the making is marked with the rubric. Attitudes and habits are seen in class
// (scripts/data/pretech-depth/common.mjs: PRETECH_NOT_TESTED). Build with: node scripts/build-pretechnical-grade.mjs <n>.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scienceDepthTests } from './scienceDepth.mjs';
import { PRETECH_NOT_TESTED } from '../../scripts/data/pretech-depth/common.mjs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const SAFETY_SUB = /safety|hazardous|raised platforms/i;
const PRACTICAL = /^(use|draw|sketch|print|illustrate|construct|dimension|extinguish|secure|create|make|prepare|fill in|handle|dispose|care for)\b/i;

export async function pretechDepthTests({ grade, outcomes, minDown = 0.5 }) {
  const { AWAITING } = await import(`../../src/ai-tutor/content/families/pretechnical_g${grade}_awaiting.js`);
  scienceDepthTests({ dir: 'pre_technical', subject: 'pretechnical', grade, outcomes, noFamilies: AWAITING, minDown, notTested: PRETECH_NOT_TESTED });
  const source = JSON.parse(read(`curriculum/pre_technical/g${grade}.json`));
  const label = `pretechnical Grade ${grade}`;

  test(`${label}: the skills with no family are listed in pretechnical_g${grade}_awaiting.js and the entry carries the list`, async () => {
    const entry = (await import(`../../src/ai-tutor/content/subjects/pretechnical_g${grade}.js`)).default;
    const used = new Set(entry.families.map(f => f.cskill));
    assert.deepEqual(AWAITING, Object.keys(entry.map.skills).filter(c => !used.has(c)), `pretechnical_g${grade}_awaiting.js is stale (node scripts/build-pretechnical-grade.mjs ${grade})`);
    assert.equal(entry.awaiting, AWAITING);
  });

  test(`${label}: no two misconceptions share a cause`, () => {
    const causes = new Map();
    for (const s of source.sub_strands) for (const m of s.misconceptions) {
      assert.ok(!causes.has(m.cause), `${m.code} and ${causes.get(m.cause)} share the cause "${m.cause}"`);
      causes.set(m.cause, m.code);
    }
  });

  test(`${label}: every misconception in a safety sub-strand is marked SAFETY for a teacher to confirm`, () => {
    for (const s of source.sub_strands.filter(x => SAFETY_SUB.test(x.sub_strand))) for (const m of s.misconceptions) {
      assert.match(m.source, /SAFETY/, `${m.code}: safety line not marked for the teacher`);
    }
  });

  test(`${label}: every practical outcome has a knowledge skill that says the making is marked with the rubric`, () => {
    for (const s of source.sub_strands) for (const o of s.outcomes.filter(x => PRACTICAL.test(x.text.trim()))) {
      const ks = s.skills.filter(k => k.outcomes.includes(o.code));
      assert.ok(ks.length, `${o.code}: practical outcome with no skill`);
      const pack = JSON.parse(read(`curriculum/pre_technical/teaching/g${grade}/${s.number}-${s.sub_strand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`));
      assert.ok(ks.some(k => /rubric/i.test(k.mastery) || /rubric/i.test(pack.skills.find(e => e.skill === k.code)?.key_step || '')), `${o.code}: no skill says the practical part is marked with the rubric`);
    }
  });

  test(`${label}: the SQL loads every skill, prerequisite and misconception in one idempotent transaction (not run)`, () => {
    const sql = read(`supabase/migrations/20261129_pretechnical_g${grade}_skills_misconceptions.sql`);
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
  });
}
