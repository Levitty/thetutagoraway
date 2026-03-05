-- AI Tutor Progress Table
-- Stores adaptive learning progress per user (knowledge graph, spaced repetition, XP, streaks)

CREATE TABLE IF NOT EXISTS ai_tutor_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress JSONB NOT NULL DEFAULT '{}',
  diagnosed BOOLEAN DEFAULT false,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_practice_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- One row per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_tutor_progress_user
  ON ai_tutor_progress(user_id);

-- Enable Row Level Security
ALTER TABLE ai_tutor_progress ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own progress
CREATE POLICY "Users manage own ai tutor progress"
  ON ai_tutor_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
