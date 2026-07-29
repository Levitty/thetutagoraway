// ============================================================================
// INTERLEAVING — mix due reviews into lessons.
//
// Rohrer's RCTs: interleaved practice roughly doubles delayed-test performance
// versus blocked practice, because mixing forces *strategy selection* (which
// method fits this problem?) that same-skill drills never exercise. Duolingo
// and Math Academy both weave old material into every session for this reason.
//
// HOREB's lessons are blocked by design (mastery practice on one skill), so we
// interleave lightly: after the 3rd and 7th answered problem in a lesson, one
// due-review question from a DIFFERENT skill appears as a "quick review"
// moment. Retrieval practice rules apply to it: one attempt, immediate
// feedback, credit flows to the reviewed skill's spaced-repetition schedule —
// never to the lesson skill's mastery count.
// ============================================================================

// After which answered-problem counts an interlude appears (max = length).
export const INTERLEAVE_AFTER = [3, 7];

/**
 * Should the next served problem be an interleaved review?
 * @param sessionTotal problems answered in this lesson so far
 * @param servedCount  interludes already served this lesson
 */
export const shouldInterleave = (sessionTotal, servedCount) =>
  INTERLEAVE_AFTER[servedCount] === sessionTotal;

/**
 * Pick the review to interleave: the most-due skill that isn't the one being
 * practised. `reviews` is adaptiveEngine.getReviews() output (already sorted
 * most-overdue first). Returns the review entry or null.
 */
export const pickInterleavedReview = (reviews, excludeSkillId) => {
  if (!Array.isArray(reviews)) return null;
  return reviews.find(r => r && r.id !== excludeSkillId) || null;
};

export default { INTERLEAVE_AFTER, shouldInterleave, pickInterleavedReview };
