-- ============================================================================
-- Classes & roster — lets a teacher see their students' AI-tutor progress.
--
-- Model:
--   classes        a class owned by a teacher (has a short join code)
--   class_members  which students are enrolled in which class
--
-- Students self-enroll with a code via join_class() (SECURITY DEFINER, so we
-- don't have to expose every class to every user). The critical piece is the
-- new SELECT policy on ai_tutor_progress: a teacher may read the progress rows
-- of students enrolled in a class they own — and nothing else.
-- ============================================================================

-- ---------------------------------------------------------------- tables
CREATE TABLE IF NOT EXISTS classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  join_code   TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

CREATE TABLE IF NOT EXISTS class_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_members_class   ON class_members(class_id);
CREATE INDEX IF NOT EXISTS idx_class_members_student ON class_members(student_id);

ALTER TABLE classes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------- classes RLS
-- Teachers fully manage the classes they own.
DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;
CREATE POLICY "Teachers manage own classes"
  ON classes FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Students may read a class they belong to (e.g. to show its name).
DROP POLICY IF EXISTS "Members can read their class" ON classes;
CREATE POLICY "Members can read their class"
  ON classes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM class_members cm
    WHERE cm.class_id = classes.id AND cm.student_id = auth.uid()
  ));

-- ------------------------------------------------------------ class_members RLS
-- Teachers can see (and remove) members of classes they own.
DROP POLICY IF EXISTS "Teachers read own class members" ON class_members;
CREATE POLICY "Teachers read own class members"
  ON class_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_members.class_id AND c.teacher_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Teachers remove own class members" ON class_members;
CREATE POLICY "Teachers remove own class members"
  ON class_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM classes c
    WHERE c.id = class_members.class_id AND c.teacher_id = auth.uid()
  ));

-- Students can see and leave their own enrolments.
DROP POLICY IF EXISTS "Students read own membership" ON class_members;
CREATE POLICY "Students read own membership"
  ON class_members FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students leave own membership" ON class_members;
CREATE POLICY "Students leave own membership"
  ON class_members FOR DELETE
  USING (auth.uid() = student_id);

-- -------------------------------------------- ai_tutor_progress: teacher read
-- The whole point: a teacher may READ the progress of students enrolled in a
-- class they own. (The existing "Users manage own ai tutor progress" policy
-- still applies; SELECT policies are OR'd, so students keep full control of
-- their own row and teachers gain read-only visibility into their students'.)
DROP POLICY IF EXISTS "Teachers read enrolled students progress" ON ai_tutor_progress;
CREATE POLICY "Teachers read enrolled students progress"
  ON ai_tutor_progress FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM class_members cm
    JOIN classes c ON c.id = cm.class_id
    WHERE cm.student_id = ai_tutor_progress.user_id
      AND c.teacher_id = auth.uid()
  ));

-- ------------------------------------------- profiles: teacher reads names
-- Teachers need student names for the roster. (Harmless if profiles are
-- already publicly readable — SELECT policies are OR'd.)
DROP POLICY IF EXISTS "Teachers read enrolled students profiles" ON profiles;
CREATE POLICY "Teachers read enrolled students profiles"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM class_members cm
    JOIN classes c ON c.id = cm.class_id
    WHERE cm.student_id = profiles.id
      AND c.teacher_id = auth.uid()
  ));

-- ---------------------------------------------------------------- functions
-- Create a class (tutors only). Returns the new class + its join code.
CREATE OR REPLACE FUNCTION public.create_class(p_name TEXT)
RETURNS TABLE (id UUID, name TEXT, join_code TEXT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_code TEXT;
  v_id   UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'tutor') THEN
    RAISE EXCEPTION 'Only tutors can create classes';
  END IF;

  -- 6-char code, retry on the (rare) collision.
  LOOP
    v_code := upper(substring(md5(random()::text) FROM 1 FOR 6));
    BEGIN
      INSERT INTO classes (teacher_id, name, join_code)
      VALUES (auth.uid(), p_name, v_code)
      RETURNING classes.id INTO v_id;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      -- try another code
    END;
  END LOOP;

  RETURN QUERY SELECT c.id, c.name, c.join_code FROM classes c WHERE c.id = v_id;
END;
$$;

-- Enrol the current user into a class by its code. Returns the class id.
CREATE OR REPLACE FUNCTION public.join_class(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_class UUID;
BEGIN
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

GRANT EXECUTE ON FUNCTION public.create_class(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_class(TEXT)   TO authenticated;
