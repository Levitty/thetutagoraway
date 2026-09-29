-- Schedule the Sunday report: every Sunday 15:00 UTC = 18:00 Kenya time.
-- Before running: turn on pg_cron and pg_net (Database → Extensions), deploy the
-- weekly-report function, and replace PASTE_YOUR_REPORT_CRON_SECRET below with
-- the value of the REPORT_CRON_SECRET function secret.
-- The Bearer key is the project's public anon key (already in the app); the
-- x-cron-secret header is what authorises the weekly send.

select cron.unschedule('tutagora-weekly-report')
where exists (select 1 from cron.job where jobname = 'tutagora-weekly-report');

select cron.schedule(
  'tutagora-weekly-report',
  '0 15 * * 0',
  $$
  select net.http_post(
    url     := 'https://dlqbiayaqjucxsvbesms.supabase.co/functions/v1/weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscWJpYXlhcWp1Y3hzdmJlc21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzAwODQsImV4cCI6MjA4NzY0NjA4NH0.Gt35lWc5--fYiJbnX7VJafSDb9jNWwM5Ml93UHvaRqA',
      'x-cron-secret', 'PASTE_YOUR_REPORT_CRON_SECRET'
    ),
    body    := '{}'::jsonb
  );
  $$
);
