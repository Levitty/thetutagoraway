-- Compositions — every piece a learner submits for marking, with the marker's
-- feedback. Rows are written ONLY by the mark-composition edge function
-- (service role): the score comes from the marker, never from the client, so
-- a learner cannot hand themselves 20/20. Learners may read their own rows.

create table if not exists compositions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  learner_id   uuid,                       -- children.id, or null for the account holder
  language     text not null,              -- 'en' | 'sw'
  grade        int,
  type         text not null,              -- narrative | descriptive | argumentative | letter | ending | proverb | own
  prompt       text not null,
  title        text,
  body         text not null,
  word_count   int not null default 0,
  score        int,                        -- /20; null when the piece was off-task
  feedback     jsonb not null default '{}'::jsonb,
  revision_of  uuid references compositions(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists compositions_user_created on compositions (user_id, created_at desc);
create index if not exists compositions_user_learner on compositions (user_id, learner_id, created_at desc);

alter table compositions enable row level security;

-- Read your own; no insert/update/delete policy = clients cannot write at all.
drop policy if exists "own compositions: select" on compositions;
create policy "own compositions: select" on compositions
  for select using (auth.uid() = user_id);
