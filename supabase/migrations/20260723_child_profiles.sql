-- Child profiles: a parent account holds one or more learners.
--
-- V1 stored the learner's name/grade as free text on each booking — good, but a
-- returning parent retyped it every time and a second child had nowhere to live.
-- This gives each parent a reusable roster. Bookings still carry the denormalized
-- learner_name/learner_grade (so tutors need no join and old rows keep working);
-- child_id links a booking to a saved profile when one was used.

CREATE TABLE IF NOT EXISTS children (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  grade      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- A parent fully manages their own roster; nobody else can see it. Tutors never
-- read this table — the learner's name/grade is denormalized onto the booking.
DROP POLICY IF EXISTS "Parents manage own children" ON children;
CREATE POLICY "Parents manage own children" ON children FOR ALL
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

-- Link a booking to the saved child it was for (nullable; free-text fields remain
-- the source of truth the tutor sees).
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES children(id) ON DELETE SET NULL;
