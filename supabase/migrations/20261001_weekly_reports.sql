-- Weekly parent report (Sunday WhatsApp / SMS).
--
-- report_settings: one row per parent — where to send, and the parent's
-- explicit opt-in (WhatsApp requires it before a business may message them).
-- weekly_reports: every report built, one per child per week, with whether it
-- was sent. The unique key stops a second cron run double-sending.

create table if not exists report_settings (
  parent_id    uuid primary key references auth.users(id) on delete cascade,
  phone        text not null check (phone ~ '^\+[0-9]{9,15}$'),
  channel      text not null default 'whatsapp' check (channel in ('whatsapp', 'sms')),
  active       boolean not null default true,
  opted_in_at  timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table report_settings enable row level security;

drop policy if exists "parents manage own report settings" on report_settings;
create policy "parents manage own report settings" on report_settings
  for all using (auth.uid() = parent_id) with check (auth.uid() = parent_id);

create table if not exists weekly_reports (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users(id) on delete cascade,
  learner_id  uuid not null references children(id) on delete cascade,
  week_start  date not null,
  body        text not null,
  stats       jsonb not null default '{}'::jsonb,
  channel     text,
  status      text not null default 'preview' check (status in ('preview', 'sent', 'failed')),
  error       text,
  sent_at     timestamptz,
  created_at  timestamptz not null default now(),
  unique (parent_id, learner_id, week_start)
);

create index if not exists weekly_reports_parent_week on weekly_reports (parent_id, week_start desc);

alter table weekly_reports enable row level security;

-- Parents read their own reports. Only the weekly-report function (service
-- role) writes them.
drop policy if exists "parents read own weekly reports" on weekly_reports;
create policy "parents read own weekly reports" on weekly_reports
  for select using (auth.uid() = parent_id);
