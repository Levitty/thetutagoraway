// ============================================================================
// FADED WORKED EXAMPLES — Renkl/Atkinson completion problems with backward
// fading, governed by the expertise-reversal effect.
//
// The research in one paragraph: novices learn most from studying worked
// examples; experts learn most from solving. The proven bridge between the two
// is the COMPLETION PROBLEM — show the solution partially worked and have the
// learner finish it — with the shown portion fading from the END first
// (backward fading: the learner supplies the final step, then the final two,
// then solves alone). Support that helps a novice actively harms a proficient
// learner (expertise reversal), so support must also SKIP itself when history
// says the learner no longer needs it.
//
// This module is pure policy + partitioning; AIMastery renders it. Levels:
//   0 FULL    all steps shown except the last  → learner completes the end
//   1 MOST    all but the last two             → learner finishes more
//   2 ORIENT  first step only                  → a nudge into the problem
//   3 SOLO    nothing                          → plain problem solving
// ============================================================================

export const SUPPORT = { FULL: 0, MOST: 1, ORIENT: 2, SOLO: 3 };

export const SUPPORT_LABEL = {
  0: 'Guided',
  1: 'Some help',
  2: 'Nearly solo',
  3: null,           // no chip — solo is the unremarkable default
};

// Where support starts for a skill, from prior history. Expertise reversal:
// a mastered skill (or one with a solid correct count) skips support entirely
// so examples never slow down a learner who is past needing them.
export function initialSupportLevel(sp) {
  if (!sp) return SUPPORT.FULL;
  if (sp.mastered) return SUPPORT.SOLO;
  const c = sp.correct || 0;
  if (c >= 6) return SUPPORT.ORIENT;
  if (c >= 3) return SUPPORT.MOST;
  return SUPPORT.FULL;
}

// Fade one rung per final correct; restore one rung per final wrong.
// When the correct answer also advanced the knowledge-point ladder, the next
// problem is a NEW variant (e.g. regrouping just entered the picture), so
// support is capped at ORIENT — a learner never meets a new variant fully
// solo unless the skill is already mastered.
export function nextSupportLevel(level, correct, kpAdvanced) {
  let l = correct ? Math.min(SUPPORT.SOLO, level + 1) : Math.max(SUPPORT.FULL, level - 1);
  if (kpAdvanced) l = Math.min(l, SUPPORT.ORIENT);
  return l;
}

// Partition THIS problem's own solution steps into shown/hidden for a
// completion problem. Returns null when there is nothing to scaffold (no
// authored steps, a single-step problem, or the learner is solo) — the caller
// then falls back to example-based support or nothing.
export function completionPlan(problem, level) {
  const steps = problem?.solutionSteps;
  if (!Array.isArray(steps) || steps.length < 2) return null;
  if (level >= SUPPORT.SOLO) return null;
  const n = steps.length;
  let shownCount;
  if (level === SUPPORT.FULL) shownCount = n - 1;
  else if (level === SUPPORT.MOST) shownCount = Math.max(1, n - 2);
  else shownCount = 1;
  shownCount = Math.min(shownCount, n - 1);   // the final step always stays hidden
  return {
    shown: steps.slice(0, shownCount),
    hiddenCount: n - shownCount,
    hidden: steps.slice(shownCount),
    total: n,
  };
}

// Legacy skills carry a solved PARALLEL instance (problem.workedExample) but
// no per-problem steps. At high support we surface that example beside the
// problem (the classic example–problem pair); past MOST it disappears.
export function exampleSupport(problem, level) {
  if (level > SUPPORT.MOST) return null;
  if (completionPlan(problem, level)) return null;   // real completion beats a parallel example
  return problem?.workedExample || null;
}
