-- Subscriptions / entitlements for the freemium paywall.
-- One row per user. `pro_until` in the future = unlimited practice.
-- A learner may READ their own row but never write it — the pass is granted
-- only by the verify-subscription edge function (service role), so no one can
-- self-grant by editing their profile.

create table if not exists subscriptions (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  pro_until   timestamptz,
  plan        text not null default 'monthly',
  updated_at  timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- Read-only for the owner; no insert/update/delete policies means users cannot
-- write at all. The edge function uses the service role, which bypasses RLS.
drop policy if exists "own subscription: select" on subscriptions;
create policy "own subscription: select" on subscriptions
  for select using (auth.uid() = user_id);
