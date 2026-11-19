// ============================================================================
// ONE GRADE ON THE HOME PAGE — the card, the strand tiles, the plan and the
// reviews all say the same grade.
//
// The owner's own account (19 Nov 2026), used across many grades, with no
// declared grade. The profile card read "Grade 1 · Grade 1 skills mastered
// 0 of 11", while the hero said "Keep it fresh: Prime Factorization" and the
// tiles counted "Numbers 13 of 108, Geometry 0 of 51, Measurements 1 of 68,
// Data Handling 0 of 24, Algebra 0 of 42". His words: "what is a grade 1
// learning about data handling, about prime factorization, algebra".
//
// Three ideas of the learner's grade were in use at once: the card fell back
// to the estimate, the tiles dropped their in-reach filter when no grade was
// declared, and the reviews took the highest grade ever mastered. Now there
// is one, learnerGrade(), and this file holds every reader of it to it.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  learnerGrade, getEstimatedGradeLevel, getStrandStats, strandsInReach,
  getReviews, selectReviewProblems, getNextToLearn, getRecommendedPath,
} from '../src/ai-tutor/adaptiveEngine.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';

const DAY = 86400000;
const ago = (days) => new Date(Date.now() - days * DAY).toISOString();
const CURR = 'cbc';                        // the owner's view: "Data Handling" is CBC's name
const ctx = { skills: SKILLS, curriculum: CURR };
const g = (id) => gradeOf(SKILLS[id], CURR);

// Long-ago practice: mastered here, at rung 3, last touched months back, so
// every one of these is due for review on the old rules.
const practised = (days) => ({
  attempts: 10, correct: 9, mastered: true, practisedHere: true,
  repNum: 3, learningSpeed: 1.0, lastPractice: ago(days), consecutiveFailures: 0,
});

// No declared grade, no placement; mastered work from Grade 1 up to Grade 7
// prime factorisation, but nowhere near 60% of Grade 1, so the estimate is 1.
const owner = () => ({
  declaredGrade: null,
  skills: {
    G1_COUNTING: practised(90),
    G7_PRIME_FACTORIZATION: practised(120),
    G7_PRIMES: practised(150),
    G6_PERIMETER: practised(150),
  },
});

test("the owner's case: estimate 1, so the grade is 1", () => {
  const p = owner();
  assert.equal(getEstimatedGradeLevel(p, ctx), 1, 'precondition: the estimate the card showed');
  assert.equal(learnerGrade(p, ctx), 1);
});

test('the profile card counts the same grade the tiles count', () => {
  const p = owner();
  const grade = learnerGrade(p, ctx);
  // The card: "Grade 1 skills mastered, n of N".
  const cardTotal = Object.values(SKILLS).filter((k) => gradeOf(k, CURR) === grade).length;
  assert.equal(cardTotal, 11, 'Grade 1 holds 11 skills, as the card said');

  const blocks = strandsInReach(getStrandStats(p, ctx, { excludeEnrichment: true }), p, grade, CURR);
  const names = blocks.map((b) => b.s.name).sort();
  assert.deepEqual(names, ['Geometry', 'Measurements', 'Numbers'],
    'a Grade 1 has no Algebra or Data Handling tile');
  for (const b of blocks) {
    assert.ok(b.total > 0, `${b.s.name} is shown with nothing in reach`);
    assert.ok(b.total < 20, `${b.s.name} counted ${b.total} skills: the whole graph, not Grade 1`);
  }
  // Every tile denominator together is exactly the card's grade and below.
  assert.equal(blocks.reduce((n, b) => n + b.total, 0), cardTotal);
  // Only Grade 1 mastery counts toward a Grade 1 tile.
  assert.equal(blocks.find((b) => b.s.name === 'Numbers').done, 1);
});

test('a skill mastered long ago in a higher grade is not a Grade 1 review', () => {
  const p = owner();
  const grade = learnerGrade(p, ctx);
  const reviews = getReviews(p, ctx);
  assert.ok(!reviews.some((r) => r.id === 'G7_PRIME_FACTORIZATION'), 'Prime Factorization came back as a review');
  for (const r of reviews) assert.ok(g(r.id) <= grade, `Grade ${g(r.id)} "${r.name}" reviewed by a Grade ${grade}`);
  assert.ok(reviews.some((r) => r.id === 'G1_COUNTING'), 'Grade 1 work is still reviewed');

  // The review session tops itself up from mastered work: same ceiling.
  for (const id of selectReviewProblems(p, 12, ctx)) {
    assert.ok(g(id) <= grade, `review session drew Grade ${g(id)} ${id}`);
  }
});

test('the plan stays within one grade of the card', () => {
  const p = owner();
  const grade = learnerGrade(p, ctx);
  for (const s of getNextToLearn(p, ctx)) {
    assert.ok(g(s.id) <= grade + 1, `next to learn offered Grade ${g(s.id)} "${s.name}"`);
  }
  for (const s of getRecommendedPath(p, ctx)) {
    assert.ok(g(s.id) <= grade + 1, `the plan offered Grade ${g(s.id)} "${s.name}"`);
  }
});

test('a declared grade is the grade, and its foundations keep their protection', () => {
  // Grade 5, checked five days ago: Grade 1 counting is long secure and is not
  // brought back; Grade 5 work is. The owner's fix must not undo this.
  const checked = (id) => [id, {
    attempts: 2, correct: 2, mastered: true, passed: true, repNum: 2, learningSpeed: 1.0,
    lastPractice: ago(5), fromDiagnostic: true, consecutiveFailures: 0,
  }];
  const p = { declaredGrade: 5, skills: Object.fromEntries([checked('G1_COUNTING'), checked('G5_ADDITION')]) };
  assert.equal(learnerGrade(p, ctx), 5);
  const due = getReviews(p, ctx).map((r) => r.id);
  assert.ok(!due.includes('G1_COUNTING'));
  assert.ok(due.includes('G5_ADDITION'));
});

test('a learner behind their class still reads as the class they are in', () => {
  // Grade 9 placed at Grade 7: the card says Grade 9 ("solid to Grade 7").
  assert.equal(learnerGrade({ declaredGrade: 9, placementGrade: 7, skills: {} }, ctx), 9);
});

test('the declared grade is a floor, not a cap', () => {
  // Placed above their class: they are working in the higher grade.
  assert.ok(learnerGrade({ declaredGrade: 1, placementGrade: 3, skills: {} }, ctx) >= 3);
});
