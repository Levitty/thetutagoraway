-- Track whether the "your lesson is starting soon" reminder has been sent for a
-- booking, so the scheduled reminder function doesn't send it twice.
alter table bookings add column if not exists reminded_at timestamptz;
