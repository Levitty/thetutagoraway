-- ============================================================================
-- SAFEGUARDING EVENTS — the durable record of "a child may need help".
--
-- Why this table exists at all. Until now a safeguarding flag lived in exactly
-- one place: an email, sent fire-and-forget, whose failure was swallowed by a
-- .catch(). The flag itself was deleted from the marker's output before the
-- composition was stored. So if Resend was down, or the key unset, or the
-- inbox missed it, nothing anywhere recorded that a child had said something.
-- There was no queue, no retry, no audit trail, and no way to answer "did a
-- person actually read that one?".
--
-- A row here is written by the edge function with the service role BEFORE
-- anything that can fail (the model call, the allowance check, the email), so
-- a disclosure survives all three.
--
-- PRIVACY. This is the most sensitive table in the database.
--
--   * It is NOT readable by the account holder. That is deliberate and is the
--     central safety property: the commonest kind of abuse is by someone at
--     home, and `compositions` is already readable by the parent who owns the
--     account (auth.uid() = user_id). This table must not add a second place
--     for an adult to discover that a child disclosed something about them.
--
--   * There is no insert/update/delete policy for ordinary users at all, so
--     no client can write to it, only the service role.
--
--   * Only is_admin() — the named reviewer, see 20260625_admin_read_policies
--     — may read, and may update the triage fields to record that it was
--     handled.
--
-- The child is told nothing. That was a deliberate product decision: showing
-- a helpline inside writing a parent can open could alert an adult that the
-- child disclosed. The helpline goes to the reviewer instead.
-- ============================================================================

create table if not exists safeguarding_events (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- Where it came from. 'composition' today; the tutor chat will reuse this.
  source         text not null,
  -- The composition row, when there is one. NULL when the piece was never
  -- stored — the allowance was spent, or the marker failed. See text_snapshot.
  source_id      uuid,

  user_id        uuid references auth.users(id) on delete set null,
  learner_id     uuid,
  grade          int,

  -- 'crisis' (read today) | 'concern' (read this week).
  tier           text not null,
  categories     text[] not null default '{}',
  -- 'rule' | 'model' | 'both'. Tracking which signal fired is how the
  -- deterministic rules get better: anything the model caught alone is a
  -- pattern worth adding.
  detected_by    text not null,
  rule_ids       text[] not null default '{}',

  -- A short window around the match, not the whole piece.
  excerpt        text,
  model_note     text,

  -- ONLY set when source_id is null. If the composition was never stored, the
  -- child's words exist nowhere else, and losing them is the exact failure
  -- this table was built to prevent. When the composition IS stored, read it
  -- there rather than keeping a second copy.
  text_snapshot  text,

  -- Triage. 'new' until a person picks it up.
  status         text not null default 'new'
                 check (status in ('new', 'reviewing', 'actioned', 'closed')),
  reviewed_by    text,
  reviewed_at    timestamptz,
  review_notes   text,

  -- When the notification actually went out. NULL on a row with status 'new'
  -- means the alert never reached anybody — that is the condition to watch.
  notified_at    timestamptz
);

-- The reviewer's queue: open events, most urgent and most recent first.
create index if not exists safeguarding_open
  on safeguarding_events (status, created_at desc);
create index if not exists safeguarding_tier
  on safeguarding_events (tier, created_at desc);
-- Rows whose alert never sent, for a retry sweep.
create index if not exists safeguarding_unnotified
  on safeguarding_events (created_at desc) where notified_at is null;

alter table safeguarding_events enable row level security;

-- Read: the named reviewer only. Deliberately NOT the account holder.
drop policy if exists "safeguarding: admin reads" on safeguarding_events;
create policy "safeguarding: admin reads" on safeguarding_events
  for select using ( public.is_admin() );

-- Update: the reviewer records that it was handled. No one else, and no
-- insert or delete policy exists, so clients cannot write or erase a flag.
drop policy if exists "safeguarding: admin triages" on safeguarding_events;
create policy "safeguarding: admin triages" on safeguarding_events
  for update using ( public.is_admin() ) with check ( public.is_admin() );

comment on table safeguarding_events is
  'Durable record of possible risk to a child, from src/ai/safeguarding.js and the marker. Readable only by is_admin() — never by the account holder, who may be the subject.';
comment on column safeguarding_events.text_snapshot is
  'The child''s text, kept ONLY when no composition row exists (allowance spent or marker failed) and it would otherwise be lost.';
comment on column safeguarding_events.notified_at is
  'When the alert was sent. NULL on an open row means nobody was told — watch this.';
