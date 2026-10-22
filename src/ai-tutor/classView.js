// ============================================================================
// READING A CLASS THE WAY A TEACHER READS IT
//
// The dashboard had every measurement it needed and showed the wrong ones. It
// reported the class's AVERAGE LEVEL — a number no teacher can act on; nothing
// they do on Tuesday changes in response to a class mean — and it reported
// "2/13 skills · 15% mastered" per child, a percentage of a denominator the
// teacher never chose and cannot see.
//
// Meanwhile `last_practice_date`, `current_streak` and `updated_at` were read
// out of the database on every load and never reached the screen. A child who
// stopped practising a fortnight ago looked exactly like one who practised last
// night. That is the first question in the morning and the page could not
// answer it.
//
// So this module decides two things, away from the JSX where they can be
// tested: how long it has been since a child was seen, and the order the class
// should be read in.
//
// The buckets below OVERLAP on purpose. A child can be stuck AND quiet, and a
// teacher filtering "quiet" wants them in that list. The four cards this
// replaces pretended to partition the class and didn't — "needs support" was
// `gaps > 0 || level < declared` and "ahead" was `level > declared`, so a child
// could be counted in both and the numbers silently failed to sum.
// ============================================================================

/**
 * Rebuild the in-memory progress object from a stored `ai_tutor_progress` row.
 *
 * THREE FIELDS WERE BEING DROPPED HERE, and every number on the teacher's page
 * was wrong for every real child because of it. progressStore writes
 * `declaredGrade`, `placementGrade` and `curriculum` into the progress JSON on
 * every save; the dashboard's copy of this function did not read them back:
 *
 *   - `declaredGrade` fell through to the ESTIMATED level, which for a
 *     struggling child is 1. "Mastered" was then counted against the skills up
 *     to Grade 1 — eleven of them — so the roster read 0% and the child's page
 *     said "0 of the 11 skills up to Grade 1" about a Grade 5.
 *   - the level band compares measured level against the grade the child is
 *     in. With the two equal by construction the difference was always zero,
 *     so every child's chip was green and the band could never fire.
 *   - `curriculum` decides which strand and grade a skill belongs to, so a
 *     child on any other syllabus had their strands read against the wrong one.
 *
 * None of it showed in the demo class, which sets these fields directly.
 */
export const rowToProgress = (row) => ({
  skills: row?.progress?.skills || {},
  diagnosticBalances: row?.progress?.diagnosticBalances || null,
  curriculum: row?.progress?.curriculum ?? null,
  declaredGrade: row?.progress?.declaredGrade ?? null,
  placementGrade: row?.progress?.placementGrade ?? null,
  diagnosed: row?.diagnosed || false,
  totalXP: row?.total_xp || 0,
  currentStreak: row?.current_streak || 0,
  lastPracticeDate: row?.last_practice_date || null,
});

/** Midnight-anchored day difference, so "today" never reads as 0.4 days. */
const DAY = 86400000;
const dayOf = (v) => {
  if (!v) return null;
  const d = new Date(typeof v === 'string' && v.length === 10 ? `${v}T00:00:00` : v);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / DAY);
};

/**
 * Days since this child last practised, or null if they never have.
 * Falls back to `updatedAt` — a child can have a progress row written by the
 * placement check before `last_practice_date` is ever set, and "never" would
 * be a lie about someone who sat the diagnostic this morning.
 */
export const daysSinceSeen = (student, now = new Date()) => {
  const today = dayOf(now);
  const seen = dayOf(student?.progress?.lastPracticeDate) ?? dayOf(student?.updatedAt);
  if (seen == null || today == null) return null;
  return Math.max(0, today - seen);
};

/** What a teacher actually reads: "today", "yesterday", "6 days", "3 weeks". */
export const lastSeenLabel = (days) => {
  if (days == null) return 'never practised';
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks < 9 ? `${weeks} weeks ago` : `${Math.floor(days / 30)} months ago`;
};

/** A week off is the line. Below it a gap is the story; above it, silence is. */
export const QUIET_DAYS = 7;

export const attentionOf = (student, now = new Date()) => {
  const days = daysSinceSeen(student, now);
  const snap = student?.snap || {};
  const gaps = snap.gapCount || 0;
  const declared = snap.declared ?? snap.level ?? 0;
  return {
    days,
    quiet: days == null || days >= QUIET_DAYS,
    stuck: gaps > 0,
    ahead: gaps === 0 && (snap.accelerated || snap.level > declared),
    gaps,
  };
};

/**
 * The filters offered above the roster. Each is a question a teacher asks, and
 * each is a LIST they can act on — which is the whole difference from a card
 * with a number on it.
 */
export const BUCKETS = [
  { id: 'all',   label: 'Everyone',  match: () => true },
  { id: 'stuck', label: 'Stuck',     tone: 'stuck', match: (a) => a.stuck,
    hint: 'A foundation they never mastered is holding up the work above it.' },
  { id: 'quiet', label: 'Gone quiet', tone: 'quiet', match: (a) => a.quiet,
    hint: `No practice for ${QUIET_DAYS} days or more.` },
  { id: 'ahead', label: 'Ahead',     tone: 'ahead', match: (a) => a.ahead,
    hint: 'Working above the grade they are in, with no gaps behind them.' },
];

export const bucketCounts = (students, now = new Date()) => {
  const atts = (students || []).map(s => attentionOf(s, now));
  return Object.fromEntries(BUCKETS.map(b => [b.id, atts.filter(b.match).length]));
};

export const inBucket = (students, bucketId, now = new Date()) => {
  const b = BUCKETS.find(x => x.id === bucketId) || BUCKETS[0];
  return (students || []).filter(s => b.match(attentionOf(s, now)));
};

/**
 * Needs-me-most first. The roster used to sort by level descending, which put
 * the children doing best at the top and the ones who need a teacher at the
 * bottom of a scroll — exactly backwards for the person reading it.
 *
 * Stuck before quiet: a named foundation gap is a lesson you can teach, and
 * silence is a phone call. Both come before a child who is fine.
 */
export const byNeed = (now = new Date()) => (a, b) => {
  const x = attentionOf(a, now), y = attentionOf(b, now);
  return (y.stuck ? 1 : 0) - (x.stuck ? 1 : 0)
    || y.gaps - x.gaps
    || (y.quiet ? 1 : 0) - (x.quiet ? 1 : 0)
    || (y.days ?? 999) - (x.days ?? 999)
    || String(a.name || '').localeCompare(String(b.name || ''));
};

export const sortForTeacher = (students, now = new Date()) =>
  [...(students || [])].sort(byNeed(now));

export default { rowToProgress, daysSinceSeen, lastSeenLabel, attentionOf, BUCKETS, bucketCounts, inBucket, sortForTeacher, byNeed, QUIET_DAYS };
