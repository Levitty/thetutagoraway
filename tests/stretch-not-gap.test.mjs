// ============================================================================
// A MISSED STRETCH QUESTION IS THE NEXT STEP, NOT A MISSING ONE (feedback F9)
//
// A simulated Grade 9 child who answered every Grade 9 question right and
// missed the Grade 10 probe was told the missing step was Grade 10 sequences
// (allClear false), and every practice sitting opened with it as a "gap".
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, getPrerequisiteChain, getPostRequisiteChain, getPostRequisites } from '../src/ai-tutor/knowledgeGraph.js';
import { findMissingStep } from '../src/site/missingStep.js';
import { findGaps, getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';

const ctx = { skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id), curriculum: 'cbc' };
const pass = { attempts: 1, correct: 1, mastered: true, passed: true, fromDiagnostic: true };
const miss = { attempts: 1, correct: 0, mastered: false, passed: false, fromDiagnostic: true };

const clearedNine = () => ({
  declaredGrade: 9, placementGrade: 9, diagnosed: true, curriculum: 'cbc',
  skills: {
    ...Object.fromEntries(Object.values(SKILLS).filter(s => s.grade <= 9).map(s => [s.id, pass])),
    G10_SEQUENCES_ADV: miss,
  },
});

test('a child who cleared their grade is all clear, with the stretch skill next', () => {
  const r = findMissingStep(clearedNine());
  assert.equal(r.allClear, true);
  assert.equal(r.missing, 'G10_SEQUENCES_ADV');
});

test('the missed stretch skill does not turn its prerequisites into gaps', () => {
  const gaps = findGaps(clearedNine(), ctx).map(g => g.id);
  assert.deepEqual(gaps, []);
  const lead = getRecommendedPath(clearedNine(), ctx)[0];
  assert.notEqual(lead?.type, 'gap');
});

test('a miss at or below the placement is still a gap', () => {
  const p = clearedNine();
  p.skills.G8_INDICES_LAWS = miss;
  const r = findMissingStep(p);
  assert.equal(r.allClear, false);
  assert.equal(r.missing, 'G8_INDICES_LAWS');
});

// The class of fault, not one example: at every CBC grade, a child who passes
// everything at or below their grade and misses everything above it is all
// clear, is never given a gap, and does not open practice on one.
import { gradeOf } from '../src/ai-tutor/curricula.js';
for (const g of [4, 5, 6, 7, 8, 9]) {
  test(`CBC Grade ${g}: missing only stretch questions is all clear, with no gaps`, () => {
    const skills = Object.fromEntries(Object.values(SKILLS).map(s => [s.id, gradeOf(s, 'cbc') <= g ? pass : miss]));
    const p = { declaredGrade: g, placementGrade: g, diagnosed: true, curriculum: 'cbc', skills };
    const r = findMissingStep(p);
    assert.equal(r.allClear, true);
    assert.ok(r.missing === null || gradeOf(SKILLS[r.missing], 'cbc') > g, `next step ${r.missing} is above Grade ${g}`);
    assert.deepEqual(findGaps(p, ctx).map(x => x.id), []);
    const lead = getRecommendedPath(p, ctx)[0];
    assert.notEqual(lead?.type, 'gap');
  });
}

// The second way in: a child who struggles with a stretch skill in practice.
// Its foundations above the placement have never been taught, so they are
// next to learn, not gaps (seen in the classroom: G10_SERIES failed in
// practice turned G10_SEQUENCES_ADV into a "gap" for a Grade 9 child).
test('struggling with a stretch skill in practice raises no gap above the placement', () => {
  const p = clearedNine();
  p.skills.G10_SERIES = { attempts: 8, correct: 2, mastered: false, passed: false };
  for (const g of findGaps(p, ctx)) assert.ok(gradeOf(SKILLS[g.id], 'cbc') <= 9, `${g.id} called a gap`);
});
