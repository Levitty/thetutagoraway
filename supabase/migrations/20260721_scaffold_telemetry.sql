-- Faded worked examples: the support level a problem was answered at
-- (0 = guided completion problem … 3 = solo). Lets calibration separate
-- assisted performance from independent performance, and proves the fading
-- actually fades. Until this runs, the client silently retries inserts
-- without the column, so nothing breaks.
alter table response_events add column if not exists scaffold int;
