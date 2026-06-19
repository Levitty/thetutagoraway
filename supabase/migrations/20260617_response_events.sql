-- ============================================================================
-- HOREB telemetry — every student response, captured durably.
--
-- This is the foundation of the "HOREB learns from usage" loop: offline
-- calibration jobs read these events to fit BKT parameters, item difficulty,
-- forgetting intervals, and to validate prerequisite edges. Capture first;
-- calibrate later. One row per answered problem (final attempt).
-- ============================================================================

CREATE TABLE IF NOT EXISTS response_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL DEFAULT 'math',
  skill_id        TEXT NOT NULL,
  problem_type    TEXT,                 -- structured-content type, e.g. 'linear-equation'
  correct         BOOLEAN NOT NULL,
  time_ms         INTEGER,              -- time on the problem
  hints_used      INTEGER DEFAULT 0,    -- hint level reached (0..3)
  attempt_no      INTEGER DEFAULT 1,    -- attempts taken on the final result
  is_diagnostic   BOOLEAN DEFAULT false,
  is_review       BOOLEAN DEFAULT false,
  params_version  TEXT DEFAULT 'heuristic-v0',  -- which engine params were live
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_response_events_student ON response_events(student_id);
CREATE INDEX IF NOT EXISTS idx_response_events_skill   ON response_events(skill_id);
CREATE INDEX IF NOT EXISTS idx_response_events_created ON response_events(created_at);

ALTER TABLE response_events ENABLE ROW LEVEL SECURITY;

-- Students write and read their own events.
DROP POLICY IF EXISTS "Students insert own events" ON response_events;
CREATE POLICY "Students insert own events"
  ON response_events FOR INSERT
  WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students read own events" ON response_events;
CREATE POLICY "Students read own events"
  ON response_events FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers read events for students enrolled in a class they own.
DROP POLICY IF EXISTS "Teachers read enrolled students events" ON response_events;
CREATE POLICY "Teachers read enrolled students events"
  ON response_events FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM class_members cm
    JOIN classes c ON c.id = cm.class_id
    WHERE cm.student_id = response_events.student_id
      AND c.teacher_id = auth.uid()
  ));

-- NOTE: the offline calibration jobs read across ALL students; they connect
-- with the Supabase SERVICE ROLE key (which bypasses RLS), never the anon key.
