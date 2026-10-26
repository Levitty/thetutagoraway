-- Class privacy: a teacher sees a class member's own maths, never a parent's
-- children.
--
-- class_members.student_id is an auth account. Since 20260723_horeb_per_child
-- a parent's children (and every other subject) are stored under the parent's
-- user_id, told apart by learner_id / profile_key. The two teacher policies
-- matched on the account alone, so a parent account that joined a class (the
-- app offered "Join a class" during a child's practice until 21 Oct 2026)
-- opened every child's progress and answers on that account to the teacher.
--
-- 1. Teachers read only the member's own rows: no learner_id, and a
--    profile_key that is not a child's ("<uid>_c<child uuid>...").
-- 2. The class leaderboard counts only the member's own answers.
-- 3. join_class refuses an account that holds children: its rows are theirs.
--
-- Existing memberships are left as they are (no data is changed); after this
-- runs they show only the account holder's own rows.

DROP POLICY IF EXISTS "Teachers read enrolled students progress" ON ai_tutor_progress;
CREATE POLICY "Teachers read enrolled students progress"
  ON ai_tutor_progress FOR SELECT
  USING (
    ai_tutor_progress.learner_id IS NULL
    AND coalesce(ai_tutor_progress.profile_key, '') !~ '_c[0-9a-f]{8}-[0-9a-f]{4}-'
    AND EXISTS (
      SELECT 1
      FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = ai_tutor_progress.user_id
        AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Teachers read enrolled students events" ON response_events;
CREATE POLICY "Teachers read enrolled students events"
  ON response_events FOR SELECT
  USING (
    response_events.learner_id IS NULL
    AND EXISTS (
      SELECT 1
      FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = response_events.student_id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.join_class(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_class UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM children ch WHERE ch.parent_id = auth.uid()) THEN
    RAISE EXCEPTION 'A parent account cannot join a class: it holds your children''s progress';
  END IF;

  SELECT c.id INTO v_class FROM classes c WHERE c.join_code = upper(p_code);
  IF v_class IS NULL THEN
    RAISE EXCEPTION 'Invalid class code';
  END IF;

  INSERT INTO class_members (class_id, student_id)
  VALUES (v_class, auth.uid())
  ON CONFLICT (class_id, student_id) DO NOTHING;

  RETURN v_class;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_class(TEXT) TO authenticated;

-- The weekly class leaderboard (20260709_leaderboards.sql), counting only the
-- member's own answers.
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
        AND e.learner_id IS NULL
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
