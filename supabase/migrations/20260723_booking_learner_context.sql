-- Booking context: WHO the lesson is for and WHAT to work on.
--
-- The account holder is usually a PARENT, not the learner — but bookings only
-- stored student_id (the parent) + subject + time, so a tutor walked in blind.
-- These three fields let a parent name the child, its grade, and the goal, and
-- the tutor sees all of it before the first lesson. Nullable + backfilled from
-- the booker's own name, so old bookings and self-bookings still read sensibly.
alter table bookings add column if not exists learner_name  text;
alter table bookings add column if not exists learner_grade text;
alter table bookings add column if not exists focus_note    text;
