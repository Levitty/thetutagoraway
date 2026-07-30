-- ============================================================================
-- HOREB gamification — effort-based leaderboards, hardened against hacking.
--
-- Ranking rewards EFFORT (problems solved well), not raw ability, and is
-- resistant to gaming:
--   · only CORRECT answers count
--   · answers faster than 1.5s are ignored (guessing / auto-clicking)
--   · each skill contributes at most 10 points/week (can't farm one easy skill)
--   · the window resets weekly, so anyone can top it with effort
-- 'Most improved' uses progress snapshots (level gain over the window), which
-- makes a struggling-but-hardworking student the star.
-- ============================================================================

-- ---- weekly effort leaderboard for a class (teacher-only) ----
CREATE OR REPLACE FUNCTION public.class_leaderboard(p_class UUID, p_days INT DEFAULT 7)
RETURNS TABLE (student_id UUID, name TEXT, points BIGINT, problems BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM classes c WHERE c.id = p_class AND c.teacher_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not your class';
  END IF;
  RETURN QUERY
    WITH scored AS (
      SELECT e.student_id AS sid, e.skill_id,
             LEAST(COUNT(*) FILTER (WHERE e.correct AND COALESCE(e.time_ms, 99999) >= 1500), 10) AS pts,
             COUNT(*) FILTER (WHERE e.correct) AS probs
      FROM response_events e
      JOIN class_members cm ON cm.student_id = e.student_id AND cm.class_id = p_class
      WHERE e.created_at >= now() - (p_days || ' days')::interval
      GROUP BY e.student_id, e.skill_id
    )
    SELECT s.sid, COALESCE(pr.full_name, pr.email, 'Student'),
           SUM(s.pts)::bigint, SUM(s.probs)::bigint
    FROM scored s
    LEFT JOIN profiles pr ON pr.id = s.sid
    GROUP BY s.sid, pr.full_name, pr.email
    ORDER BY 3 DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.class_leaderboard(UUID, INT) TO authenticated;

-- ---- progress snapshots (enables 'most improved') ----
CREATE TABLE IF NOT EXISTS progress_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL DEFAULT 'math',
  overall_level NUMERIC,
  mastered      INT,
  captured_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_snap_student ON progress_snapshots(student_id, captured_at);
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own snapshots" ON progress_snapshots;
CREATE POLICY "Students manage own snapshots" ON progress_snapshots FOR ALL
  USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers read enrolled snapshots" ON progress_snapshots;
CREATE POLICY "Teachers read enrolled snapshots" ON progress_snapshots FOR SELECT
  USING (EXISTS (SELECT 1 FROM class_members cm JOIN classes c ON c.id = cm.class_id
                 WHERE cm.student_id = progress_snapshots.student_id AND c.teacher_id = auth.uid()));

-- ---- most-improved for a class over a window (teacher-only) ----
CREATE OR REPLACE FUNCTION public.class_most_improved(p_class UUID, p_days INT DEFAULT 7)
RETURNS TABLE (student_id UUID, name TEXT, gain NUMERIC)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM classes c WHERE c.id = p_class AND c.teacher_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not your class';
  END IF;
  RETURN QUERY
    WITH win AS (
      SELECT s.student_id AS sid, s.overall_level, s.captured_at,
             first_value(s.overall_level) OVER (PARTITION BY s.student_id ORDER BY s.captured_at) AS start_lv,
             last_value(s.overall_level)  OVER (PARTITION BY s.student_id ORDER BY s.captured_at
                                                ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS end_lv
      FROM progress_snapshots s
      JOIN class_members cm ON cm.student_id = s.student_id AND cm.class_id = p_class
      WHERE s.captured_at >= now() - (p_days || ' days')::interval
    )
    SELECT DISTINCT w.sid, COALESCE(pr.full_name, pr.email, 'Student'),
           ROUND((w.end_lv - w.start_lv)::numeric, 2) AS gain
    FROM win w LEFT JOIN profiles pr ON pr.id = w.sid
    WHERE w.end_lv > w.start_lv
    ORDER BY gain DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.class_most_improved(UUID, INT) TO authenticated;
