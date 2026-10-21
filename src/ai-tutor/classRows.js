// ============================================================================
// WHICH PROGRESS ROWS A TEACHER'S ROSTER MAY SHOW
//
// ai_tutor_progress.user_id is the OWNING account, not the learner: since
// 20260723_horeb_per_child.sql a parent's children and every other subject
// live under the parent's user_id, told apart by profile_key
// ("<uid>" for the account holder's maths, "<uid>_c<childId>" for a child,
// "<uid>_physics" for another subject). Filtering on user_id therefore lets
// a parent's children through as extra "students" under the parent's name.
//
// A class member is an auth account, so the roster shows only that account's
// own maths row: profile_key equal to user_id (or no profile_key, a row from
// before the column existed). The database says the same since
// 20261021_class_privacy.sql; this keeps the screen right either way.
// ============================================================================

export const isOwnMathRow = (row, teacherId = null) =>
  !!row && !!row.user_id && row.user_id !== teacherId && !row.learner_id &&
  (row.profile_key == null || row.profile_key === row.user_id);

// A roster child practising on a parent's login has no account of their own,
// so "join a class" would enrol the parent's login instead.
export const canJoinClass = ({ userId, guest, activeLearner }) =>
  !!userId && !guest && !activeLearner;
