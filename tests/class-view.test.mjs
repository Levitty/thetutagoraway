// ============================================================================
// READING A CLASS THE WAY A TEACHER READS IT
//
// The defect these close: the dashboard loaded `last_practice_date`,
// `current_streak` and `updated_at` on every page load and showed none of
// them, so a child who had not practised for a fortnight was indistinguishable
// from one who practised last night — and the roster was sorted level-first,
// which put the children who needed a teacher at the bottom of the scroll.
// ============================================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  rowToProgress, daysSinceSeen, lastSeenLabel, attentionOf, bucketCounts, inBucket,
  sortForTeacher, QUIET_DAYS,
} from '../src/ai-tutor/classView.js';

// ---- reading a stored row back ------------------------------------------
test('the grade a child is IN survives the trip out of the database', () => {
  // The defect: progressStore writes declaredGrade, placementGrade and
  // curriculum into the progress JSON on every save, and the dashboard's
  // reader dropped all three. Losing declaredGrade made the "in reach"
  // denominator fall back to the ESTIMATED level — 1 for a struggling child —
  // so a Grade 5 was told they had mastered 0 of the 11 skills up to Grade 1,
  // and the level band, which compares the two, could never fire: every
  // child's chip was green, gaps and all.
  const row = {
    diagnosed: true, total_xp: 400, current_streak: 4, last_practice_date: '2026-10-20',
    progress: {
      skills: { G5_ADDITION: { attempts: 4, correct: 1 } },
      declaredGrade: 5, placementGrade: 4, curriculum: 'kicd',
    },
  };
  const p = rowToProgress(row);
  assert.equal(p.declaredGrade, 5);
  assert.equal(p.placementGrade, 4);
  assert.equal(p.curriculum, 'kicd');
  assert.equal(p.totalXP, 400);
  assert.equal(p.currentStreak, 4);
  assert.equal(p.lastPracticeDate, '2026-10-20');
});

test('a row from before those fields existed still reads, as null', () => {
  // null, not 0 — `declaredGrade ?? estimate` has to fall through to the
  // estimate for an old row, and 0 would pin every such child at Grade 0.
  const p = rowToProgress({ progress: { skills: {} } });
  assert.equal(p.declaredGrade, null);
  assert.equal(p.curriculum, null);
  assert.deepEqual(p.skills, {});
});

const NOW = new Date('2026-10-22T09:30:00Z');
const dayStr = (back) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - back);
  return d.toISOString().slice(0, 10);
};

const child = (name, { seen = 0, gaps = 0, level = 5, declared = 5, never = false } = {}) => ({
  name,
  userId: `u-${name}`,
  updatedAt: never ? null : new Date(NOW.getTime() - seen * 86400000).toISOString(),
  progress: { lastPracticeDate: never ? null : dayStr(seen) },
  snap: { gapCount: gaps, level, declared, accelerated: false },
});

// ---- how long since we saw them ------------------------------------------
test('days since practice is counted in whole days, not hours', () => {
  // The bug this guards: a timestamp from this morning differenced against
  // now() gives 0.4 days, which floors to 0 for one child and 1 for another
  // depending only on the hour the teacher opened the page.
  assert.equal(daysSinceSeen(child('A', { seen: 0 }), NOW), 0);
  assert.equal(daysSinceSeen(child('B', { seen: 1 }), NOW), 1);
  assert.equal(daysSinceSeen(child('C', { seen: 11 }), NOW), 11);
});

test('a child placed but never practised falls back to the row date, not "never"', () => {
  // Sitting the diagnostic writes a progress row without a practice date.
  // Calling that child "never practised" is a lie about someone who was
  // measured this morning.
  const placed = { name: 'D', updatedAt: NOW.toISOString(), progress: {}, snap: {} };
  assert.equal(daysSinceSeen(placed, NOW), 0);
});

test('a child with no dates at all reads as never, not as today', () => {
  assert.equal(daysSinceSeen(child('E', { never: true }), NOW), null);
  assert.equal(lastSeenLabel(null), 'never practised');
});

test('the label is what a teacher would say out loud', () => {
  assert.equal(lastSeenLabel(0), 'today');
  assert.equal(lastSeenLabel(1), 'yesterday');
  assert.equal(lastSeenLabel(6), '6 days ago');
  assert.equal(lastSeenLabel(21), '3 weeks ago');
});

// ---- the filters ----------------------------------------------------------
test('a week without practice is quiet; six days is not', () => {
  assert.equal(attentionOf(child('A', { seen: QUIET_DAYS - 1 }), NOW).quiet, false);
  assert.equal(attentionOf(child('B', { seen: QUIET_DAYS }), NOW).quiet, true);
});

test('a child can be both stuck and quiet, and appears in both lists', () => {
  // The four cards this replaces pretended to partition the class: "needs
  // support" was (gaps > 0 || level < declared) and "ahead" was
  // (level > declared), so a child could be counted twice and the numbers
  // silently failed to sum. Overlap is the truth, so it is now visible.
  const both = child('Overlap', { seen: 20, gaps: 2 });
  const a = attentionOf(both, NOW);
  assert.equal(a.stuck, true);
  assert.equal(a.quiet, true);
  const counts = bucketCounts([both], NOW);
  assert.equal(counts.stuck, 1);
  assert.equal(counts.quiet, 1);
  assert.equal(inBucket([both], 'quiet', NOW).length, 1);
  assert.equal(inBucket([both], 'stuck', NOW).length, 1);
});

test('a child with gaps behind them is never counted as ahead', () => {
  // Otherwise the one reassuring number on the page includes children who are
  // failing foundations while racing through the grade above.
  const a = attentionOf(child('Hamisi', { seen: 1, gaps: 1, level: 7, declared: 5 }), NOW);
  assert.equal(a.ahead, false);
  assert.equal(a.stuck, true);
});

test('everyone is in Everyone', () => {
  const roster = [child('A'), child('B', { gaps: 3 }), child('C', { seen: 30 })];
  assert.equal(bucketCounts(roster, NOW).all, 3);
  assert.equal(inBucket(roster, 'all', NOW).length, 3);
});

// ---- the order it is read in ---------------------------------------------
test('the children who need a teacher are at the top, not the bottom', () => {
  // The old sort was `b.snap.level - a.snap.level`: best first. A teacher
  // scrolling a class of thirty-four reached the struggling children last.
  const roster = [
    child('Grace',  { seen: 0, gaps: 0, level: 5 }),
    child('Hamisi', { seen: 0, gaps: 0, level: 7 }),
    child('Esha',   { seen: 2, gaps: 2, level: 4 }),
    child('Amani',  { seen: 1, gaps: 3, level: 3 }),
    child('Quiet',  { seen: 19, gaps: 0, level: 5 }),
  ];
  const names = sortForTeacher(roster, NOW).map(s => s.name);
  assert.deepEqual(names.slice(0, 3), ['Amani', 'Esha', 'Quiet']);
  assert.ok(names.indexOf('Hamisi') > names.indexOf('Quiet'),
    'a child who is fine outranked one who has not been seen in three weeks');
});

test('among equals, the one gone longest comes first', () => {
  const roster = [child('Recent', { seen: 8 }), child('Older', { seen: 40 })];
  assert.equal(sortForTeacher(roster, NOW)[0].name, 'Older');
});

test('the order is stable and does not depend on the input order', () => {
  // A roster that reshuffles between renders is a roster a teacher cannot
  // point at.
  const a = child('Ann', { seen: 1, gaps: 1 }), b = child('Bob', { seen: 1, gaps: 1 });
  assert.deepEqual(sortForTeacher([a, b], NOW).map(s => s.name), ['Ann', 'Bob']);
  assert.deepEqual(sortForTeacher([b, a], NOW).map(s => s.name), ['Ann', 'Bob']);
});

test('an empty class does not throw', () => {
  assert.deepEqual(sortForTeacher([], NOW), []);
  assert.equal(bucketCounts(undefined, NOW).all, 0);
});
