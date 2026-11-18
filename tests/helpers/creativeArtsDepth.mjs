// The Grade 5 Maths standard for Creative Arts Grades 4-6 and Creative Arts and Sports Grades 7-9 (owner, 18 Nov 2026;
// Tuta Workspace/HOREB_MAPPING_PLAN.md), through the same checks as Science (tests/helpers/scienceDepth.mjs). Creative Arts is
// half making, performing and sport: those outcomes are covered by a knowledge skill (asked as questions) plus the teacher's
// mark with the KICD rubric (teacher_rubric on the skill), never a phone question. Attitude outcomes are seen in class.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scienceDepthTests } from './scienceDepth.mjs';

export const CREATIVE_NOT_TESTED = /^(appreciate|enjoy|value|acknowledge|realise|recognise|show interest|participate)/i;

export function creativeArtsDepthTests(opts) {
  const { grade } = opts;
  scienceDepthTests({ dir: 'creative_arts', subject: 'creativearts', notTested: CREATIVE_NOT_TESTED, ...opts });
  const source = JSON.parse(readFileSync(new URL(`../../curriculum/creative_arts/g${grade}.json`, import.meta.url), 'utf8'));
  const indicators = new Set(source.rubrics.flatMap(r => r.indicators.map(i => i.code)));
  test(`creativearts Grade ${grade}: practical outcomes go to the teacher's KICD rubric through a knowledge skill, never a phone question`, () => {
    let n = 0;
    for (const s of source.sub_strands) for (const k of s.skills) {
      if (!k.teacher_rubric) continue;
      const r = k.teacher_rubric;
      assert.equal(r.by, 'teacher');
      assert.ok(r.outcomes.length && r.outcomes.every(c => s.outcomes.some(o => o.code === c)), `${k.code}: rubric outcome outside its sub-strand`);
      for (const c of r.outcomes) assert.ok(!CREATIVE_NOT_TESTED.test(s.outcomes.find(o => o.code === c).text.trim()), `${c}: an attitude is not marked as a practical`);
      assert.ok(r.indicators.length && r.indicators.every(i => indicators.has(i)), `${k.code}: unknown KICD rubric indicator`);
      assert.match(k.mastery, /marked by the teacher with the KICD rubric/, `${k.code}: the mastery rule must say the teacher marks it`);
      n += r.outcomes.length;
    }
    assert.ok(n > 0, 'some practical outcomes are marked by the teacher');
  });
}
