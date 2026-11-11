-- ============================================================================
-- HOREB live tutor prototype, milestone 1 (10 Nov 2026): the cost meter.
--
-- One row per tutor turn that reached the model: what it cost, what the
-- guards did, and how many pictures of the child's work it carried. The voice-tutor edge function reads it to hold the caps
-- (US$1.50 a session, US$3 a day per child, as settings) and writes it with
-- the service role. No transcript, no child's words, no names are stored here:
-- logging the session itself is milestone 4.
--
-- Access: RLS on and NO client policy. Nobody reads this from the browser.
-- When the review page comes (milestone 4), reviewer access is limited to the
-- owner and the two named reviewer accounts (the CBC teacher and the
-- child-development psychology graduate), not general staff or the admin list.
--
-- Safe to run twice. Not run yet: run it before deploying voice-tutor.
-- ============================================================================
CREATE TABLE IF NOT EXISTS voice_tutor_usage (
  id                 BIGSERIAL PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_key          TEXT NOT NULL,          -- ai_tutor_progress.profile_key of the learner
  session_id         TEXT NOT NULL,
  model              TEXT,
  cost_usd           NUMERIC NOT NULL DEFAULT 0,
  input_tokens       INTEGER,
  output_tokens      INTEGER,
  cache_read_tokens  INTEGER,
  cache_write_tokens INTEGER,
  guard              TEXT[] NOT NULL DEFAULT '{}',   -- retried, answer-leak, invalid-turn, refusal, model-error
  dropped_steps      INTEGER NOT NULL DEFAULT 0,
  -- Milestone 2: pictures of the child's work sent with this turn (the picture itself is
  -- never stored here or anywhere yet), and their estimated input tokens.
  snapshots          INTEGER NOT NULL DEFAULT 0,
  image_tokens       INTEGER NOT NULL DEFAULT 0,
  -- Milestone 3: the voice. Characters the tutor spoke (Cartesia) and seconds of the child's
  -- speech sent for listening (Deepgram), priced into cost_usd. Rows with guard token-stt or
  -- token-tts (cost 0) record a voice token minted, for the rate limit. No audio is stored.
  tts_chars          INTEGER NOT NULL DEFAULT 0,
  audio_in_s         NUMERIC NOT NULL DEFAULT 0
);
ALTER TABLE voice_tutor_usage ADD COLUMN IF NOT EXISTS snapshots INTEGER NOT NULL DEFAULT 0;
ALTER TABLE voice_tutor_usage ADD COLUMN IF NOT EXISTS image_tokens INTEGER NOT NULL DEFAULT 0;
ALTER TABLE voice_tutor_usage ADD COLUMN IF NOT EXISTS tts_chars INTEGER NOT NULL DEFAULT 0;
ALTER TABLE voice_tutor_usage ADD COLUMN IF NOT EXISTS audio_in_s NUMERIC NOT NULL DEFAULT 0;
-- The token rate limit: tokens this user minted in the last minute.
CREATE INDEX IF NOT EXISTS idx_voice_tutor_usage_user_time ON voice_tutor_usage(user_id, created_at);
-- The two cap queries: this session, and this child since midnight UTC.
CREATE INDEX IF NOT EXISTS idx_voice_tutor_usage_session ON voice_tutor_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_tutor_usage_child_day ON voice_tutor_usage(child_key, created_at);

ALTER TABLE voice_tutor_usage ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: only the service role (the edge function) reads and writes.
