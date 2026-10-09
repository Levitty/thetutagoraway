-- Harden response_events into the system of record it was always meant to be.
-- See research/horeb-engine-audit.md (ADR-001): the raw per-answer log is the
-- one asset both engines can be rebuilt from, and the dataset for catching
-- content faults automatically (a Grade 5 skill that Grade 5 learners pass at
-- ~100% is a mislabelled skill — exactly the 21 x 3 case found by hand in Oct 2026).
--
-- Everything here is additive and nullable; telemetry.js writes the new fields
-- when present and falls back to the base columns if this hasn't been applied.

-- Per-child attribution. The client has written learner_id since Aug 2026 and
-- been silently retrying WITHOUT it because this column never existed, so
-- every child's answers have landed under the parent's id.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS learner_id uuid;

-- What the learner actually typed, and what was expected. Without the raw
-- value a wrong answer is just "wrong" — with it, it's a misconception.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS submitted_value text;
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS expected_value  text;

-- "I haven't learned this yet" was being logged as a plain wrong answer.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS skipped boolean DEFAULT false;

-- One sitting at the app; groups a run of answers.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS session_id uuid;

-- At-least-once delivery. The client queues events it could not send (offline,
-- flaky data) and retries them later; this id makes a retry a no-op instead of
-- a duplicate. Partial index so legacy rows (null) are untouched.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS client_event_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS response_events_client_event_id
  ON response_events (client_event_id) WHERE client_event_id IS NOT NULL;

-- The client's clock at answer time. created_at is the server's receipt time,
-- which for a queued event can be hours later; ordering must use this.
-- Comparing the two also measures clock skew per device.
ALTER TABLE response_events ADD COLUMN IF NOT EXISTS client_ts timestamptz;

CREATE INDEX IF NOT EXISTS idx_response_events_learner
  ON response_events (learner_id, client_ts) WHERE learner_id IS NOT NULL;

-- Append-only, enforced. No UPDATE/DELETE policy existed, but "no policy" is
-- an accident waiting for someone to add one. Make it a rule.
REVOKE UPDATE, DELETE ON response_events FROM authenticated, anon;
COMMENT ON TABLE response_events IS
  'Append-only system of record for every answered problem. Never update or delete rows; derive state from them.';
