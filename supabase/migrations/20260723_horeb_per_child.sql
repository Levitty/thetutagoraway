-- Per-child HOREB progress.
--
-- ai_tutor_progress was one row per auth user (unique user_id) — so a parent
-- account had a single blended progress profile and couldn't track two kids.
-- We keep user_id = the OWNING parent (RLS + FK stay valid) and introduce
-- profile_key as the real identity: it namespaces progress by learner (+subject),
-- e.g. "<uid>" for the account holder, "<uid>_c<childId>_physics" for a child.
--
-- Backfill sets profile_key = user_id for every existing row, so a returning
-- learner's math progress keeps matching (AIMastery computes the same key for
-- the account holder). No progress is lost.

ALTER TABLE ai_tutor_progress ADD COLUMN IF NOT EXISTS profile_key TEXT;
ALTER TABLE ai_tutor_progress ADD COLUMN IF NOT EXISTS learner_id  UUID REFERENCES children(id) ON DELETE CASCADE;

UPDATE ai_tutor_progress SET profile_key = user_id::text WHERE profile_key IS NULL;

-- The old identity was unique(user_id); the new identity is unique(profile_key).
DROP INDEX IF EXISTS idx_ai_tutor_progress_user;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_tutor_progress_pkey ON ai_tutor_progress(profile_key);
-- Keep a plain (non-unique) index on user_id for RLS lookups + teacher joins.
CREATE INDEX IF NOT EXISTS idx_ai_tutor_progress_owner ON ai_tutor_progress(user_id);
