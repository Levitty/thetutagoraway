// ============================================================================
// PLACEMENT — the "find your level" test.
//
// Replaces the old focus-walk, which had three faults a teacher found in one
// sitting: it climbed out of the declared grade after two right answers (a
// Grade 6 entry reached calculus), it placed above the declared grade because
// `computePlacementGrade` started from the lowest grade actually TESTED, and
// it had no strand balance at all (8 of 10 questions were Numbers — lots of
// indices, almost no BODMAS).
//
// The design here is a top-down sweep instead of a ladder:
//
//   1. Sweep the DECLARED grade — one question per strand taught at that
//      grade. This is the grade the learner is actually sitting in, so it gets
//      the widest look, and every strand is represented by construction.
//   2. Judge that grade. Cleared (>= CLEAR) and we are done — the declared
//      grade IS the ceiling. Not cleared, and we step down one grade and
//      sweep again, repeating until a grade clears or the graph runs out.
//   3. A learner who clears the declared grade PERFECTLY earns one stretch
//      grade above it, and only one. That is the whole headroom: a Grade 6
//      entry can place at Grade 7 on a flawless sweep, and can never be shown
//      Grade 8 content, let alone differentiation.
//
// Every function derives its answer from the list of questions asked so far,
// so there is no phase state to persist and a half-finished test resumes from
// its answers alone.
// ============================================================================

export const CLEAR = 0.65;         // share of a grade's sweep needed to clear it
export const STRETCH_GATE = 0.9;   // a flawless sweep earns one grade of headroom
export const MAX_QUESTIONS = 20;   // hard ceiling on the whole test
export const SWEEP_DECLARED = 5;   // questions in the declared grade's sweep
export const SWEEP_PROBE = 3;      // questions per grade when stepping down

// ---------------------------------------------------------------------------
// Pool helpers. `pool` is a flat array of skill objects ({ id, grade, strand,
// critical, prerequisites }), so this module stays subject-agnostic.
// ---------------------------------------------------------------------------

export const gradesIn = (pool) =>
  [...new Set(pool.map(s => s.grade).filter(Number.isFinite))].sort((a, b) => a - b);

// Strands taught at a grade, widest first — a grade's biggest strand is the
// one a sweep can least afford to miss. Ties break alphabetically so the
// question order is identical on a resume.
const strandsAt = (pool, grade) => {
  const counts = new Map();
  for (const s of pool) {
    if (s.grade !== grade) continue;
    counts.set(s.strand, (counts.get(s.strand) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .map(([strand]) => strand);
};

// How load-bearing a skill is: how many other skills list it as a prerequisite.
const dependantCount = (pool, skillId) =>
  pool.reduce((n, s) => n + ((s.prerequisites || []).includes(skillId) ? 1 : 0), 0);

// ---------------------------------------------------------------------------
// Reading the answers so far. `asked` is [{ id, grade, strand, correct }].
// ---------------------------------------------------------------------------

const atGrade = (asked, grade) => asked.filter(a => a.grade === grade);
export const gradeAccuracy = (asked, grade) => {
  const rows = atGrade(asked, grade);
  if (!rows.length) return null;
  return rows.filter(a => a.correct).length / rows.length;
};
const quotaFor = (grade, declared) => (grade === declared ? SWEEP_DECLARED : SWEEP_PROBE);

// A grade is swept once it has met its quota, or once the pool has nothing
// left to ask there.
const sweepDone = (asked, pool, grade, declared) => {
  const n = atGrade(asked, grade).length;
  if (n >= quotaFor(grade, declared)) return true;
  const answered = new Set(asked.map(a => a.id));
  return !pool.some(s => s.grade === grade && !answered.has(s.id));
};
// A grade clears on CLEAR of its sweep — except a STRETCH grade, above the
// learner's own declared grade, which needs a perfect sweep. Promoting someone
// past the year they are sitting in should never happen on a lucky guess.
const cleared = (asked, grade, declared) => {
  const acc = gradeAccuracy(asked, grade);
  if (acc == null) return false;
  return Number.isFinite(declared) && grade > declared ? acc === 1 : acc >= CLEAR;
};

// ---------------------------------------------------------------------------
// Which grade should the next question come from?
//
// Returns null when the test is finished. The walk is: finish the declared
// grade, then either stretch up (on a flawless sweep) or step down one grade
// at a time until something clears.
// ---------------------------------------------------------------------------
export const activeGrade = (asked, declared, pool) => {
  const grades = gradesIn(pool);
  if (!grades.length) return null;
  const gmin = grades[0], gmax = grades[grades.length - 1];
  const start = Math.max(gmin, Math.min(gmax, declared));

  // The declared grade always gets swept first.
  if (!sweepDone(asked, pool, start, declared)) return start;

  if (cleared(asked, start, declared)) {
    // One stretch grade, and only for a flawless sweep.
    const acc = gradeAccuracy(asked, start) ?? 0;
    const stretch = start + 1;
    if (acc >= STRETCH_GATE && stretch <= gmax && !sweepDone(asked, pool, stretch, declared)) return stretch;
    return null; // placed at or just above the declared grade
  }

  // Didn't clear: step down, sweeping each grade, until one clears.
  let g = start;
  while (g > gmin) {
    const below = g - 1;
    if (!sweepDone(asked, pool, below, declared)) return below;
    if (cleared(asked, below, declared)) return null; // found the floor they stand on
    g = below;
  }
  return null; // swept to the bottom of the graph
};

// ---------------------------------------------------------------------------
// The next question itself.
//
// Within the active grade, take the first strand that has not been asked at
// that grade yet — that is what guarantees strand balance, and what stops the
// test asking two flavours of indices back to back. Inside that strand, prefer
// the most load-bearing skill, then the one the running evidence is least sure
// about.
// ---------------------------------------------------------------------------
export const selectQuestion = (asked, declared, pool, balances = {}) => {
  if (asked.length >= MAX_QUESTIONS) return null;
  const grade = activeGrade(asked, declared, pool);
  if (grade == null) return null;

  const answered = new Set(asked.map(a => a.id));
  const seenStrands = new Set(atGrade(asked, grade).map(a => a.strand));
  // Strands the learner has already missed higher up are the threads most
  // worth pulling on the way down, so they come first among the unseen.
  const missedAbove = new Set(asked.filter(a => !a.correct && a.grade > grade).map(a => a.strand));
  const order = strandsAt(pool, grade);
  const unseen = order.filter(st => !seenStrands.has(st));
  const ranked = [
    ...unseen.filter(st => missedAbove.has(st)),
    ...unseen.filter(st => !missedAbove.has(st)),
    ...order.filter(st => seenStrands.has(st)), // every strand covered — go round again
  ];

  for (const strand of ranked) {
    const cands = pool.filter(s => s.grade === grade && s.strand === strand && !answered.has(s.id));
    if (!cands.length) continue;
    cands.sort((a, b) =>
      (b.critical ? 1 : 0) - (a.critical ? 1 : 0) ||
      dependantCount(pool, b.id) - dependantCount(pool, a.id) ||
      Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0) ||
      String(a.id).localeCompare(String(b.id)));
    return cands[0];
  }
  return null;
};

export const isComplete = (asked, declared, pool) =>
  asked.length >= MAX_QUESTIONS || selectQuestion(asked, declared, pool) == null;

// ---------------------------------------------------------------------------
// The placement itself: the highest swept grade the learner cleared.
//
// If nothing cleared, they sit below everything tested — one grade under the
// lowest we swept, floored at the bottom of the graph. This is the bug that
// mattered most in the old version: it returned the lowest grade TESTED even
// when that grade was failed, so a learner who got everything wrong was still
// placed at the first grade we happened to ask about.
// ---------------------------------------------------------------------------
export const computePlacement = (asked, declared, pool) => {
  const grades = gradesIn(pool);
  if (!grades.length) return declared ?? null;
  const gmin = grades[0], gmax = grades[grades.length - 1];
  const swept = [...new Set(asked.map(a => a.grade))].sort((a, b) => b - a); // high → low
  if (!swept.length) return declared ?? null;

  for (const g of swept) if (cleared(asked, g, declared)) return Math.min(g, gmax);
  return Math.max(gmin, swept[swept.length - 1] - 1);
};

// A plain-language account of what the test concluded, for the screen that
// shows the result — and for a parent who wants to know why.
export const explainPlacement = (asked, declared, pool) => {
  const placement = computePlacement(asked, declared, pool);
  const swept = [...new Set(asked.map(a => a.grade))].sort((a, b) => a - b);
  const weakStrands = [...new Set(asked.filter(a => !a.correct).map(a => a.strand))];
  const byStrand = {};
  for (const a of asked) {
    byStrand[a.strand] ||= { correct: 0, total: 0 };
    byStrand[a.strand].total++;
    if (a.correct) byStrand[a.strand].correct++;
  }
  return {
    placement,
    declared,
    questions: asked.length,
    gradesTested: swept,
    stretched: placement > declared,
    behindBy: Number.isFinite(declared) ? Math.max(0, declared - placement) : 0,
    weakStrands,
    byStrand,
  };
};

export default {
  CLEAR, STRETCH_GATE, MAX_QUESTIONS, SWEEP_DECLARED, SWEEP_PROBE,
  gradesIn, gradeAccuracy, activeGrade, selectQuestion, isComplete,
  computePlacement, explainPlacement,
};
