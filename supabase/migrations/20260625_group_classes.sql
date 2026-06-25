-- ============================================================================
-- Group classes — a tutor teaches several students at once for a lower
-- per-student price. Students browse open classes and pay to enrol.
--
-- Model:
--   group_classes              a class a tutor schedules (date/time/price/seats)
--   group_class_enrollments    which students paid to join which class
--
-- Tables are created IF NOT EXISTS so this is safe to run whether or not the
-- tables were already made by hand. Capacity is enforced atomically server-side
-- by enroll_in_group_class() (SECURITY DEFINER) so two students can never race
-- past the last seat, and by the verify-payment edge function for paid joins.
-- ============================================================================

-- ---------------------------------------------------------------- tables
CREATE TABLE IF NOT EXISTS group_classes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id          UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  subject           TEXT,
  max_students      INT NOT NULL DEFAULT 10,
  price_per_student NUMERIC NOT NULL DEFAULT 0,
  lesson_date       DATE,
  start_time        TEXT,
  duration_minutes  INT DEFAULT 60,
  status            TEXT NOT NULL DEFAULT 'open',
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_group_classes_tutor ON group_classes(tutor_id);

CREATE TABLE IF NOT EXISTS group_class_enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_class_id    UUID NOT NULL REFERENCES group_classes(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_paid       NUMERIC,
  payment_reference TEXT,
  status            TEXT NOT NULL DEFAULT 'enrolled',
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (group_class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_gce_class   ON group_class_enrollments(group_class_id);
CREATE INDEX IF NOT EXISTS idx_gce_student ON group_class_enrollments(student_id);

-- If the tables pre-existed without the payment columns, add them.
ALTER TABLE group_class_enrollments ADD COLUMN IF NOT EXISTS amount_paid       NUMERIC;
ALTER TABLE group_class_enrollments ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE group_class_enrollments ADD COLUMN IF NOT EXISTS status            TEXT NOT NULL DEFAULT 'enrolled';

ALTER TABLE group_classes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_class_enrollments ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------- group_classes RLS
-- Anyone signed in can browse open classes.
DROP POLICY IF EXISTS "Anyone reads open group classes" ON group_classes;
CREATE POLICY "Anyone reads open group classes"
  ON group_classes FOR SELECT
  USING (status = 'open' OR tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

-- A tutor fully manages the classes they own. tutors.user_id maps to auth.uid().
DROP POLICY IF EXISTS "Tutors manage own group classes" ON group_classes;
CREATE POLICY "Tutors manage own group classes"
  ON group_classes FOR ALL
  USING      (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()))
  WITH CHECK (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

-- ----------------------------------------------- group_class_enrollments RLS
-- Students see their own enrolments.
DROP POLICY IF EXISTS "Students read own enrolments" ON group_class_enrollments;
CREATE POLICY "Students read own enrolments"
  ON group_class_enrollments FOR SELECT
  USING (student_id = auth.uid());

-- A tutor sees who enrolled in their classes (for the roster + counts).
DROP POLICY IF EXISTS "Tutors read enrolments in own classes" ON group_class_enrollments;
CREATE POLICY "Tutors read enrolments in own classes"
  ON group_class_enrollments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM group_classes gc
    JOIN tutors t ON t.id = gc.tutor_id
    WHERE gc.id = group_class_enrollments.group_class_id
      AND t.user_id = auth.uid()
  ));

-- Anyone signed in may read the enrolment *count* of an open class so the
-- browse page can show "3/10 enrolled". (Counting needs to see the rows.)
DROP POLICY IF EXISTS "Anyone reads enrolments of open classes" ON group_class_enrollments;
CREATE POLICY "Anyone reads enrolments of open classes"
  ON group_class_enrollments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM group_classes gc
    WHERE gc.id = group_class_enrollments.group_class_id
      AND gc.status = 'open'
  ));

-- Students may insert their own enrolment (capacity is enforced by the
-- enroll_in_group_class() function below and the verify-payment edge function).
DROP POLICY IF EXISTS "Students enrol themselves" ON group_class_enrollments;
CREATE POLICY "Students enrol themselves"
  ON group_class_enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- ---------------------------------------------------------------- functions
-- Atomic, capacity-checked enrolment for the current user. Used as the
-- client-side fallback when the verify-payment edge function is unreachable;
-- the edge function does its own service-role insert with the same checks.
CREATE OR REPLACE FUNCTION public.enroll_in_group_class(
  p_class     UUID,
  p_reference TEXT DEFAULT NULL,
  p_amount    NUMERIC DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_max      INT;
  v_status   TEXT;
  v_count    INT;
  v_existing UUID;
  v_id       UUID;
BEGIN
  SELECT max_students, status INTO v_max, v_status
  FROM group_classes WHERE id = p_class FOR UPDATE;

  IF v_max IS NULL THEN
    RAISE EXCEPTION 'Class not found';
  END IF;
  IF v_status <> 'open' THEN
    RAISE EXCEPTION 'This class is not open for enrolment';
  END IF;

  -- Already enrolled? Return the existing row, idempotently.
  SELECT id INTO v_existing
  FROM group_class_enrollments
  WHERE group_class_id = p_class AND student_id = auth.uid();
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  SELECT count(*) INTO v_count
  FROM group_class_enrollments WHERE group_class_id = p_class;
  IF v_count >= v_max THEN
    RAISE EXCEPTION 'This class is full';
  END IF;

  INSERT INTO group_class_enrollments (group_class_id, student_id, payment_reference, amount_paid)
  VALUES (p_class, auth.uid(), p_reference, p_amount)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enroll_in_group_class(UUID, TEXT, NUMERIC) TO authenticated;
