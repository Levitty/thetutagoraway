// The Grade 5 Maths standard for one Agriculture grade (HOREB_MAPPING_PLAN.md, 18 Nov 2026), called from tests/agriculture-g<n>.test.mjs.
// The shared Science checks (tests/helpers/scienceDepth.mjs: a skill for every testable outcome, two prerequisites and four real
// misconceptions per skill, the teaching pack) with Agriculture's attitude outcomes, plus: practical outcomes carry the rubric
// line, the skills with no family are listed (families/agriculture_g<n>_awaiting.js) and flagged nofamily in the map, and the SQL
// is current. Build with: node scripts/build-agriculture-grade.mjs <n>.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { scienceDepthTests } from './scienceDepth.mjs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
// Attitude and habit outcomes: seen in class over the term, not asked as questions.
export const AGRI_NOT_TESTED = /^(appreciate|adopt|embrace|acknowledge|recognise (the )?importance|demonstrate (responsibility|caring)|show responsibility|uphold)/i;
// A practical outcome: done with the hands and marked by the teacher.
const PRACTICAL = /^(prepare|carry out|conserve|construct|sow|grow|select|cook|apply|use|clean|make|rear|preserve|establish|control|launder|knit|plant|add value|take part|process|dress|design|access|remove|repel|practi[sc]e|care|demonstrate use|take care|manage)\b/i;

export async function agricultureDepthTests({ grade, outcomes, minDown = 0.5 }) {
  const source = JSON.parse(read(`curriculum/agriculture/g${grade}.json`));
  const skills = source.sub_strands.flatMap(s => s.skills);
  const { AWAITING } = await import(`../../src/ai-tutor/content/families/agriculture_g${grade}_awaiting.js`);
  const hasEntry = existsSync(new URL(`../../src/ai-tutor/content/subjects/agriculture_g${grade}.js`, import.meta.url));
  scienceDepthTests({ dir: 'agriculture', subject: 'agriculture', grade, outcomes, noFamilies: AWAITING, minDown, notTested: AGRI_NOT_TESTED, families: hasEntry });

  test(`agriculture Grade ${grade}: the skills with no family are flagged nofamily in the map and listed for the family writers`, async () => {
    const map = await import(`../../src/ai-tutor/content/curriculumMap.agriculture.g${grade}.js`);
    const flagged = Object.keys(map.SKILLS).filter(c => map.SKILLS[c].nofamily);
    for (const c of flagged) assert.ok(AWAITING.includes(c), `${c} is flagged nofamily but has a family`);
    for (const c of AWAITING) assert.ok(map.SKILLS[c].nofamily, `${c} has no family and is not flagged nofamily (a first-pass skill lost its families?)`);
    if (!hasEntry) assert.equal(AWAITING.length, skills.length);
  });

  test(`agriculture Grade ${grade}: every practical outcome is carried by a skill the teacher marks with the KICD rubric`, () => {
    for (const s of source.sub_strands) for (const o of s.outcomes.filter(o => PRACTICAL.test(o.text.trim()) && !AGRI_NOT_TESTED.test(o.text.trim()))) {
      const carriers = s.skills.filter(k => k.outcomes.includes(o.code));
      assert.ok(carriers.length, `${o.code}: no skill`);
      assert.ok(carriers.some(k => /KICD rubric/.test(k.mastery) && k.assessed_by), `${o.code} (${o.text}): no skill says the teacher marks the practical with the rubric`);
    }
  });

  test(`agriculture Grade ${grade}: the SQL loads every skill, prerequisite and misconception (not run)`, () => {
    const sql = read(`supabase/migrations/20261126_agriculture_g${grade}_skills_misconceptions.sql`);
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
    for (const k of skills) assert.ok(sql.includes(`'${k.code}'`), `${k.code} missing from the SQL`);
  });
}
