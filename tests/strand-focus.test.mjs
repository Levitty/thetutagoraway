// ============================================================================
// THE "NEEDS WORK" BADGE — one strand, and only when the claim is true.
//
// A badge on a child's own screen saying a whole strand needs work is a strong
// thing to say, and there are three ways to say it wrongly:
//
//   on a strand nobody has tested  — unknown is not weak, and a child who has
//                                    never been asked a Geometry question must
//                                    not be told Geometry is their weak spot
//   on the morning after the check — every strand sits near the same number,
//                                    so whichever rounded lowest wins by noise
//   on a child who is doing fine   — ranking five strands always produces a
//                                    last place, even at 80% across the board
//
// weakestStrand() is the rule, and the dashboard draws whatever it returns, so
// this is where the rule is held.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strandsInReach, weakestStrand } from '../src/ai-tutor/adaptiveEngine.js';

// A strand with `n` skills at a given grade, `done` of them mastered.
const strand = (name, { n = 10, done = 0, grade = 4, assessed = true } = {}) => ({
  name,
  assessed,
  skills: Array.from({ length: n }, (_, i) => ({ id: `${name}_${i}`, grade })),
  _done: done,
});
const progressFor = (strands) => ({
  skills: Object.fromEntries(strands.flatMap(s =>
    s.skills.slice(0, s._done).map(k => [k.id, { mastered: true, attempts: 3, correct: 2 }]))),
});
const badge = (strands, declaredGrade = 5) =>
  weakestStrand(strandsInReach(strands, progressFor(strands), declaredGrade));

test('the strand furthest behind is the one badged', () => {
  const strands = [
    strand('Numbers', { done: 8 }),
    strand('Measurements', { done: 2 }),
    strand('Geometry', { done: 6 }),
  ];
  assert.equal(badge(strands), 'Measurements');
});

test('a strand nobody has been asked about is never called the weak one', () => {
  // It would be the lowest by count — it is at zero — and it is the one thing
  // we know nothing about.
  const strands = [
    strand('Numbers', { done: 7 }),
    strand('Geometry', { done: 0, assessed: false }),
    strand('Measurements', { done: 3 }),
  ];
  assert.equal(badge(strands), 'Measurements');
});

test('nothing is badged the morning after the check, when every strand is level', () => {
  const strands = [
    strand('Numbers', { done: 2 }),
    strand('Measurements', { done: 2 }),
    strand('Geometry', { done: 1 }),
  ];
  assert.equal(badge(strands), null);
});

test('nothing is badged on a learner who is doing well everywhere', () => {
  // Measurements is last of the three and still holds 60% of its grade. Last
  // place is not a weakness.
  const strands = [
    strand('Numbers', { done: 10 }),
    strand('Measurements', { done: 6 }),
    strand('Geometry', { done: 9 }),
  ];
  assert.equal(badge(strands), null);
});

test('a single strand is never badged against itself', () => {
  assert.equal(badge([strand('Numbers', { done: 1 })]), null);
});

test('the count behind the badge is counted in reach, not across the graph', () => {
  // Numbers runs Grade 1 to Grade 12. A Grade 5 is told how much of what they
  // should have by now they hold — not how much of a secondary-school strand.
  const far = {
    name: 'Numbers', assessed: true,
    skills: [
      { id: 'a', grade: 4 }, { id: 'b', grade: 5 },
      { id: 'c', grade: 9 }, { id: 'd', grade: 11 },
    ],
  };
  const progress = { skills: { a: { mastered: true } } };
  const [block] = strandsInReach([far], progress, 5);
  assert.equal(block.total, 2, 'the Grade 9 and Grade 11 skills are not this learner’s denominator');
  assert.equal(block.done, 1);
  assert.equal(block.pct, 0.5);
});

test('a learner with no declared grade is counted against the whole strand', () => {
  // A guest taking the free check has no grade yet; the honest denominator is
  // then everything there is, because nothing narrows it.
  const far = { name: 'Numbers', assessed: true, skills: [{ id: 'a', grade: 4 }, { id: 'c', grade: 9 }] };
  const [block] = strandsInReach([far], { skills: {} }, null);
  assert.equal(block.total, 2);
});
