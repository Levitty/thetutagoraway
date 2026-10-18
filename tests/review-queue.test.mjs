// ============================================================================
// THE REVIEW QUEUE — what the dashboard offers as "today's session".
//
// AIMastery takes reviews.slice(0, 3) straight from getReviews(), so whatever
// that function puts first IS the learner's evening. This pins the two faults
// that put Grade 1 sorting in front of a Grade 5:
//
//   1. Every skill the placement check credits shares ONE lastPractice, so
//      their urgencies are exactly equal, the sort collapses to array order,
//      and array order is ascending grade. The queue was anchored at Grade 1
//      for every learner, permanently, by construction rather than by chance.
//
//   2. A checked skill enters at rung 2 — the same rung a skill reaches by
//      being ground out to mastery in the app — so a Grade 5 who sailed
//      through counting to 50 was asked to review it three days later.
//
// The live symptom this reproduces: a Grade 5's session reading
// "Pre-number Activities (Sorting, Patterns)", "Counting & Numbers", and
// "Addition (Single Digit)" while 4-digit × 2-digit multiplication waited.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getReviews, selectReviewProblems } from '../src/ai-tutor/adaptiveEngine.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const DAY = 86400000;
const ago = (days) => new Date(Date.now() - days * DAY).toISOString();

/** One sitting of the check: every credited skill shares a timestamp, which
 *  is precisely what made the urgencies tie. */
const checkedAt = (ids, days, extra = {}) => {
  const skills = {};
  for (const id of ids) {
    skills[id] = {
      attempts: 2, correct: 2, mastered: true, passed: true,
      repNum: 2, learningSpeed: 1.0, lastPractice: ago(days),
      fromDiagnostic: true, consecutiveFailures: 0, ...extra,
    };
  }
  return { skills };
};

const ids = (rs) => rs.map((r) => r.id);

test('a Grade 5 is not sent back to pre-number sorting', () => {
  // The exact shape of the live dashboard: foundations credited by the check
  // alongside work at the learner's own level.
  const progress = checkedAt(
    ['G1_PRENUMBER', 'G1_COUNTING', 'G1_ADD', 'G5_PLACE_VALUE', 'G5_ADDITION'], 5,
  );
  const top3 = getReviews(progress, undefined).slice(0, 3);

  assert.ok(
    !ids(top3).includes('G1_PRENUMBER'),
    `pre-number sorting is back in a Grade 5's session: ${ids(top3).join(', ')}`,
  );
  for (const r of top3) {
    assert.ok(r.grade >= 4, `Grade ${r.grade} skill "${r.name}" in a Grade 5's top 3`);
  }
});

test('equal urgency is broken by grade, not by position in the skill list', () => {
  // The tie-break has to be tested where a tie can still happen. Two skills
  // PRACTISED to mastery in one session take the same rung and the same
  // timestamp, so their urgencies are identical to the digit — and nothing
  // stretches them. Before the fix the sort returned 0 here and the order
  // fell through to the skill list, which is ascending grade.
  const sameSession = (id) => [id, {
    attempts: 8, correct: 8, mastered: true, repNum: 2, learningSpeed: 1.0,
    lastPractice: ago(40), consecutiveFailures: 0,
  }];
  const progress = { skills: Object.fromEntries([sameSession('G1_COUNTING'), sameSession('G5_ADDITION')]) };

  const rs = getReviews(progress, undefined);
  assert.equal(rs.length, 2, 'both should be due after 40 days');
  assert.equal(
    rs[0].urgency.toFixed(9), rs[1].urgency.toFixed(9),
    'precondition: the urgencies really are tied',
  );
  assert.equal(rs[0].id, 'G5_ADDITION', 'the skill nearest the learner comes first');
});

test('a checked skill far below the frontier is not due in three days', () => {
  // Grade 1 work under a Grade 5 frontier: consolidated years before this app.
  const progress = checkedAt(['G1_PRENUMBER', 'G5_ADDITION'], 5);
  const due = ids(getReviews(progress, undefined));
  assert.ok(due.includes('G5_ADDITION'), 'the frontier skill is still due');
  assert.ok(!due.includes('G1_PRENUMBER'), 'the long-secure one is not');
});

test('the stretch does not reach skills near the frontier', () => {
  // One grade below is ordinary recent work; it must stay on the normal rung.
  const progress = checkedAt(['G4_PLACE_VALUE', 'G5_ADDITION'], 5);
  const due = ids(getReviews(progress, undefined));
  assert.ok(due.includes('G4_PLACE_VALUE'), 'one grade below is still reviewed normally');
  assert.ok(due.includes('G5_ADDITION'));
});

test('a skill mastered by PRACTICE is never stretched, however low its grade', () => {
  // The stretch is a statement about the placement check, not about the
  // grade. Something the learner actually worked at here is genuinely fresh
  // and genuinely fades, so it keeps the ordinary schedule.
  const practised = {
    skills: {
      G1_PRENUMBER: {
        attempts: 8, correct: 8, mastered: true, repNum: 2, learningSpeed: 1.0,
        lastPractice: ago(5), consecutiveFailures: 0, // no fromDiagnostic
      },
      G5_ADDITION: {
        attempts: 8, correct: 8, mastered: true, repNum: 2, learningSpeed: 1.0,
        lastPractice: ago(5), consecutiveFailures: 0,
      },
    },
  };
  assert.ok(
    ids(getReviews(practised, undefined)).includes('G1_PRENUMBER'),
    'practised work still comes up for review on the normal schedule',
  );
});

test('the working level is the grade they are IN, not the top of what they have mastered', () => {
  // The live case. A Grade 5 placed on foundations has mastered nothing above
  // Grade 2, so reading the working level off the mastered set returns 2 and
  // every Grade 1-2 skill looks like it sits AT their level. That is how
  // "What number comes just after 35?" reached a Grade 5 mid-session.
  const progress = checkedAt(['G1_PRENUMBER', 'G1_COUNTING', 'G2_COUNTING'], 5);
  progress.declaredGrade = 5;
  assert.deepEqual(
    ids(getReviews(progress, undefined)), [],
    'nothing Grade 1-2 should be served to a declared Grade 5 five days after the check',
  );
  // Without the declared grade there is nothing better to go on, so the
  // highest-mastered reading stands and the skills are served as before.
  const guest = checkedAt(['G1_PRENUMBER', 'G1_COUNTING', 'G2_COUNTING'], 5);
  assert.ok(ids(getReviews(guest, undefined)).length > 0, 'a guest with no declared grade still gets reviews');
});

test('practising a skill puts it back on the normal schedule — even after a wrong answer', () => {
  // The dangerous direction. A wrong answer LOWERS repNum, so any rule keyed
  // on repNum would still read the skill as unpractised and push its review
  // further away, under-reviewing the learner who just proved they need it.
  const progress = checkedAt(['G2_COUNTING'], 5);
  progress.declaredGrade = 5;
  assert.deepEqual(ids(getReviews(progress, undefined)), [], 'precondition: stretched while untouched');

  const wrong = checkedAt(['G2_COUNTING'], 5);
  wrong.declaredGrade = 5;
  wrong.skills.G2_COUNTING = {
    ...wrong.skills.G2_COUNTING,
    practisedHere: true,   // set by processReviewResult on EVERY answer
    repNum: 1,             // a wrong answer pushed the rung DOWN
  };
  assert.ok(
    ids(getReviews(wrong, undefined)).includes('G2_COUNTING'),
    'a Grade 5 who genuinely struggles with Grade 2 counting must still be reviewed on it',
  );
});

test('a skill still comes due eventually, stretch or no stretch', () => {
  // The stretch delays; it must never park a skill forever.
  const progress = checkedAt(['G1_PRENUMBER'], 400);
  assert.ok(
    ids(getReviews(progress, undefined)).includes('G1_PRENUMBER'),
    'after a year even long-secure foundations are worth one look',
  );
});

test('an empty or untouched progress yields nothing', () => {
  assert.deepEqual(getReviews({ skills: {} }, undefined), []);
  // Mastered but never practised (no timestamp) cannot be scheduled.
  assert.deepEqual(
    getReviews({ skills: { G5_ADDITION: { mastered: true, lastPractice: null } } }, undefined),
    [],
  );
});

test('every skill the queue returns really exists in the graph', () => {
  const progress = checkedAt(['G1_PRENUMBER', 'G1_COUNTING', 'G5_ADDITION'], 90);
  for (const r of getReviews(progress, undefined)) {
    assert.ok(SKILLS[r.id], `queue returned an unknown skill: ${r.id}`);
    assert.ok(r.name, `queue entry ${r.id} has no name to show`);
  }
});

test('an assumed-known foundation is not reviewed, the way it is not taught', () => {
  // getNextToLearn refuses to offer these as a lesson; a review makes the
  // same claim on the learner's time, so it must refuse too — otherwise the
  // skill the path will not teach is the one the session opens with.
  const progress = checkedAt(['G1_PRENUMBER', 'G1_COUNTING', 'G2_COUNTING'], 400);
  progress.declaredGrade = 5;
  assert.deepEqual(
    ids(getReviews(progress, undefined)), [],
    'three grades below a Grade 5 should never come round, not even after a year',
  );
});

test('real struggle cancels the assumption and the skill is reviewed again', () => {
  // assumedKnown is deliberately weak: it never claims the skill is
  // REMEMBERED. A learner who has attempted it here and not mastered it is
  // struggling, and must keep getting it.
  const progress = { declaredGrade: 5, skills: { G2_COUNTING: {
    attempts: 6, correct: 2, mastered: true, repNum: 2, learningSpeed: 1.0,
    lastPractice: ago(40), fromDiagnostic: true, practisedHere: true, consecutiveFailures: 1,
  } } };
  assert.ok(
    ids(getReviews(progress, undefined)).includes('G2_COUNTING'),
    'a Grade 5 who has worked at Grade 2 counting here still gets it reviewed',
  );
});

// ---- selectReviewProblems: what the session ACTUALLY serves ---------------
// getReviews drives the dashboard list; this picks the problems once a review
// starts. Filtering only the first is what put "80 + 3 = ?" in front of a
// Grade 5: the floor emptied the due list, so the bag ran short more often,
// so the UNFILTERED top-up below it ran harder. Both need the same floor.

test('a review session serves a Grade 5 nothing from Grade 1 or 2', () => {
  const progress = checkedAt(['G1_PRENUMBER', 'G1_COUNTING', 'G1_ADD', 'G2_COUNTING', 'G2_ADD'], 5);
  progress.declaredGrade = 5;
  const served = selectReviewProblems(progress, 12, undefined);
  const grades = served.map((id) => SKILLS[id]?.grade);
  assert.deepEqual(
    served, [],
    `a Grade 5 was served grade ${JSON.stringify(grades)} problems: ${served.join(', ')}`,
  );
});

test('the top-up still fills a session with work at the learner’s own level', () => {
  // The floor must not starve the session: skills at or near the learner's
  // level are still fair game even when nothing is strictly due.
  const progress = checkedAt(['G5_PLACE_VALUE', 'G5_ADDITION', 'G5_SUBTRACTION'], 1);
  progress.declaredGrade = 5;
  const served = selectReviewProblems(progress, 6, undefined);
  assert.ok(served.length > 0, 'a Grade 5 with Grade 5 work mastered still gets a review session');
  for (const id of served) {
    assert.ok(SKILLS[id].grade >= 4, `served ${id} (grade ${SKILLS[id].grade})`);
  }
});

test('a struggling learner is still served the foundation they struggle with', () => {
  const progress = { declaredGrade: 5, skills: { G2_COUNTING: {
    attempts: 9, correct: 3, mastered: true, repNum: 1, learningSpeed: 1.0,
    lastPractice: ago(20), fromDiagnostic: true, practisedHere: true, consecutiveFailures: 2,
  } } };
  assert.ok(
    selectReviewProblems(progress, 6, undefined).includes('G2_COUNTING'),
    'practised-here work is never floored away, whatever its grade',
  );
});
