-- Pre-answer confidence per response — the calibration signal for population
-- ("MSA-style") learning. Across many learners, how well does the engine's
-- prior confidence in a skill predict the actual answer? That tells us which
-- prerequisite edges are load-bearing and lets us trust propagation further,
-- shortening diagnostics over time.
--
-- Nullable and additive: telemetry.logResponse writes it when available and
-- silently retries without it if this column hasn't been applied yet, so
-- deploying the app before running this migration never drops events.

ALTER TABLE response_events ADD COLUMN IF NOT EXISTS confidence real;
