-- =============================================
-- Tutagora: Tutor Recruitment Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add phone number to tutors
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. Add subjects array to tutors
ALTER TABLE tutors ADD COLUMN IF NOT EXISTS subjects text[];

-- 3. Migrate existing single subject data to array
UPDATE tutors SET subjects = ARRAY[subject] WHERE subjects IS NULL AND subject IS NOT NULL;

-- 4. Group classes table
CREATE TABLE IF NOT EXISTS group_classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  max_students integer DEFAULT 10,
  price_per_student numeric NOT NULL,
  lesson_date date NOT NULL,
  start_time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- 5. Group class enrollments table
CREATE TABLE IF NOT EXISTS group_class_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_class_id uuid REFERENCES group_classes(id),
  student_id uuid REFERENCES profiles(id),
  payment_status text DEFAULT 'pending',
  enrolled_at timestamptz DEFAULT now()
);

-- 6. Enable RLS
ALTER TABLE group_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_class_enrollments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for group_classes
CREATE POLICY "Anyone can view open group classes" ON group_classes FOR SELECT USING (true);
CREATE POLICY "Tutors can insert own classes" ON group_classes FOR INSERT WITH CHECK (auth.uid() = tutor_id);
CREATE POLICY "Tutors can update own classes" ON group_classes FOR UPDATE USING (auth.uid() = tutor_id);
CREATE POLICY "Tutors can delete own classes" ON group_classes FOR DELETE USING (auth.uid() = tutor_id);

-- 8. RLS Policies for group_class_enrollments
CREATE POLICY "Students can view own enrollments" ON group_class_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Tutors can view enrollments for their classes" ON group_class_enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_classes WHERE group_classes.id = group_class_id AND group_classes.tutor_id = auth.uid())
);
CREATE POLICY "Students can enroll" ON group_class_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
