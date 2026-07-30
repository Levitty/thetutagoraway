// ============================================================================
// GAMIFICATION — client helpers for the effort leaderboards.
// The heavy lifting (and anti-hacking rules) live in the SQL functions
// (supabase/migrations/20260709_leaderboards.sql). These just call them.
// ============================================================================
import { supabase } from '../supabase.js';

// Weekly effort ranking for a class (teacher-only, enforced in SQL).
export async function getClassLeaderboard(classId, days = 7) {
  const { data, error } = await supabase.rpc('class_leaderboard', { p_class: classId, p_days: days });
  if (error) { if (import.meta.env?.DEV) console.debug('leaderboard:', error.message); return []; }
  return (data || []).map((r, i) => ({ rank: i + 1, ...r }));
}

// Biggest level gain over the window — rewards growth, not raw ability.
export async function getMostImproved(classId, days = 7) {
  const { data, error } = await supabase.rpc('class_most_improved', { p_class: classId, p_days: days });
  if (error) { if (import.meta.env?.DEV) console.debug('most-improved:', error.message); return []; }
  return (data || []).map((r, i) => ({ rank: i + 1, ...r }));
}

// Record a point-in-time snapshot of a student's level (enables 'most improved').
// Call this ~once a day / at the end of a session. Fire-and-forget.
export function recordProgressSnapshot({ studentId, subject = 'math', overallLevel, mastered }) {
  if (!studentId || overallLevel == null) return;
  supabase.from('progress_snapshots')
    .insert({ student_id: studentId, subject, overall_level: overallLevel, mastered })
    .then(() => {}).catch(() => {});
}
