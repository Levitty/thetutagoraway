-- Device tokens for push notifications.
-- One row per device; a user may have several (phone, tablet). The token is
-- the natural key so re-registering the same device updates rather than
-- duplicating. Rows are removed on sign-out (see src/push.js).

create table if not exists device_tokens (
  token       text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  platform    text not null default 'ios',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists device_tokens_user_idx on device_tokens (user_id);

alter table device_tokens enable row level security;

-- A learner may only ever see or touch their own devices.
drop policy if exists "own devices: select" on device_tokens;
create policy "own devices: select" on device_tokens
  for select using (auth.uid() = user_id);

drop policy if exists "own devices: insert" on device_tokens;
create policy "own devices: insert" on device_tokens
  for insert with check (auth.uid() = user_id);

drop policy if exists "own devices: update" on device_tokens;
create policy "own devices: update" on device_tokens
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own devices: delete" on device_tokens;
create policy "own devices: delete" on device_tokens
  for delete using (auth.uid() = user_id);

-- Sending happens in the send-push edge function with the service role, which
-- bypasses RLS; no broad read policy is needed for delivery.
