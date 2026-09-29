-- Parent → child messages and weekly goals.
--
-- The parent's account owns both (children have no login of their own; a
-- child uses the parent's session in student mode). RLS: a parent can only
-- read or write rows for children on their own roster.

create table if not exists family_messages (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references auth.users(id) on delete cascade,
  learner_id  uuid not null references children(id) on delete cascade,
  from_label  text not null default 'Your parent' check (char_length(from_label) between 1 and 40),
  body        text not null check (char_length(body) between 1 and 200),
  created_at  timestamptz not null default now(),
  seen_at     timestamptz
);

create index if not exists family_messages_learner_created
  on family_messages (parent_id, learner_id, created_at desc);

alter table family_messages enable row level security;

drop policy if exists "parents manage own family messages" on family_messages;
create policy "parents manage own family messages" on family_messages
  for all
  using (auth.uid() = parent_id)
  with check (
    auth.uid() = parent_id
    and exists (select 1 from children c where c.id = learner_id and c.parent_id = auth.uid())
  );

-- One active goal per child: "practise N days this week → reward". It
-- restarts every Monday by itself; progress is counted from the child's
-- practice days, so nothing here needs resetting.
create table if not exists learner_goals (
  learner_id   uuid primary key references children(id) on delete cascade,
  parent_id    uuid not null references auth.users(id) on delete cascade,
  target_days  int  not null check (target_days between 1 and 7),
  reward       text not null check (char_length(reward) between 1 and 120),
  updated_at   timestamptz not null default now()
);

alter table learner_goals enable row level security;

drop policy if exists "parents manage own learner goals" on learner_goals;
create policy "parents manage own learner goals" on learner_goals
  for all
  using (auth.uid() = parent_id)
  with check (
    auth.uid() = parent_id
    and exists (select 1 from children c where c.id = learner_id and c.parent_id = auth.uid())
  );
