// ============================================================================
// LESSONS MUST MATCH THE LEARNER'S LEVEL
//
// Regression test for the bug found in live testing: a fresh Grade 8 account
// was served "Pre-number Activities (Sorting, Patterns) — What comes next:
// 4, 5, 6, 7, __?". Cause: on a new account the only skills with satisfied
// prerequisites were the Grade 1 graph roots, so the recommended path had to
// start there and climb.
//
// The mirror bug matters just as much: Grade 5 division has no prerequisites
// in the graph, so a raw dependent-count ranking floated it to the top of a
// Grade 1 learner's list.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getNextToLearn, getEstimatedGradeLevel } from '../src/ai-tutor/adaptiveEngine.js';

const TOP = 8;   // the recommended path only ever shows a handful
const top = (progress) => getNextToLearn(progress, null).slice(0, TOP);

test('a fresh Grade 8 learner is never sent to lower-primary counting', () => {
  const picks = top({ skills: {}, declaredGrade: 8, placementGrade: null });
  assert.ok(picks.length > 0, 'expected some suggestions');
  const tooLow = picks.filter(s => s.grade <= 5);
  assert.deepEqual(
    tooLow.map(s => `${s.id} (G${s.grade})`), [],
    'Grade 8 learner offered lower-primary skills',
  );
});

test('a fresh Grade 1 learner is not sent to upper-primary roots', () => {
  const picks = top({ skills: {}, declaredGrade: 1, placementGrade: null });
  assert.ok(picks.length > 0, 'expected some suggestions');
  const tooHigh = picks.filter(s => s.grade > 3);
  assert.deepEqual(
    tooHigh.map(s => `${s.id} (G${s.grade})`), [],
    'Grade 1 learner offered skills more than two grades ahead',
  );
});

test('the diagnostic overrides the declared grade in BOTH directions', () => {
  // Declared Grade 8 but measured at Grade 3: foundations must come BACK.
  // The "assume they know it" shortcut must never override real evidence.
  const picks = top({ skills: {}, declaredGrade: 8, placementGrade: 3 });
  assert.ok(
    picks.some(s => s.grade <= 4),
    'a learner placed at Grade 3 should still be offered foundation work',
  );
  assert.ok(
    !picks.some(s => s.grade >= 8),
    'a learner placed at Grade 3 should not be offered Grade 8 work',
  );
});

test('demonstrated struggle cancels the assumption of mastery', () => {
  // A Grade 8 learner who has actually failed a Grade 2 skill should see it
  // again — "assumed known" is a shortcut for the untested, not a blindfold.
  const struggled = {
    skills: { G2_PLACE_VALUE: { attempts: 6, correct: 1, mastered: false } },
    declaredGrade: 8,
    placementGrade: null,
  };
  const ids = getNextToLearn(struggled, null).map(s => s.id);
  assert.ok(
    ids.includes('G2_PLACE_VALUE'),
    'a skill the learner has demonstrably failed must remain learnable',
  );
});

test('a learner with no declared grade still gets a sane list', () => {
  const picks = top({ skills: {} });
  assert.ok(picks.length > 0, 'expected suggestions even with no grade information');
});

// Reported by a real Grade 9 student: "she took the diagnostic as a Grade 9,
// the page says Grade 6, and the work is too easy."
//
// The diagnostic measured her correctly. The DISPLAYED level was computed from
// coverage instead — what fraction of each grade she has personally worked
// through — and a short test can never mark 60% of Grade 1 as mastered, so it
// reported the bottom of the graph. That number then drove lesson selection.
test('a measured placement anchors both the displayed level and the lessons', () => {
  // Exactly the state a student is in one second after finishing the
  // diagnostic: placement measured, almost nothing marked mastered yet.
  const justDiagnosed = { skills: {}, diagnosed: true, declaredGrade: 9, placementGrade: 9 };

  const shown = getEstimatedGradeLevel(justDiagnosed, null);
  assert.ok(
    shown >= 8,
    `a student the diagnostic placed at Grade 9 was shown as Grade ${shown}`,
  );

  const grades = top(justDiagnosed).map(s => s.grade);
  assert.ok(grades.length > 0, 'expected lessons to be suggested');
  assert.ok(
    !grades.some(g => g <= 5),
    `Grade 9 placement served lower-primary lessons: [${grades.join(', ')}]`,
  );
});

test('a low placement is still respected — the floor works downwards too', () => {
  // The floor must not become a way to inflate every learner: a student
  // measured at Grade 3 stays at Grade 3.
  const placedLow = { skills: {}, diagnosed: true, declaredGrade: 9, placementGrade: 3 };
  const shown = getEstimatedGradeLevel(placedLow, null);
  assert.ok(shown <= 4, `a student placed at Grade 3 was shown as Grade ${shown}`);
});
