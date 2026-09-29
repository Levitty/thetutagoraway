-- Which CHILD answered each question.
--
-- A parent account can run HOREB for several children, but response_events only
-- had student_id (= the parent's auth id), so every child's answers landed under
-- the parent and per-child history was unrecoverable. The app already sends
-- learner_id (src/ai-tutor/telemetry.js) and silently drops it when the column
-- is missing; this adds the column so it is kept.
--
-- null = the account holder answered. Parents already read their own events
-- through the existing student_id policy, so no new policy is needed.

alter table response_events
  add column if not exists learner_id uuid references children(id) on delete set null;

create index if not exists idx_response_events_learner
  on response_events (student_id, learner_id, created_at desc);
