-- ============================================================================
-- EVERYTHING THAT STILL NEEDS RUNNING, IN ORDER.           26 October 2026
--
-- Paste one STEP at a time into the Supabase SQL editor and press Run. Do not
-- paste the whole file in one go: step 4 is a question, not a change, and its
-- answer decides what step 5 should be.
--
-- Checked against the live database today, so these are the ones genuinely
-- outstanding. Already run, and NOT repeated here: assignments, safeguarding,
-- subscription_payments, child_tablets, avatars, response_events — every one
-- of those tables answers a query in production.
--
-- Every step is safe to run twice.
-- ============================================================================


-- ============================================================================
-- STEP 1 — SECURITY: any signed-in user could make themselves an admin
--
-- The "update own profile" rule allows every column, is_admin included, and
-- two other rules trusted that column. So any user could set it on their own
-- row and then read EVERY lesson chat and EVERY whiteboard note.
--
-- This moves both rules onto is_admin(), which checks the signed-in email
-- against the allowlist instead of a column users can write; stops anon and
-- authenticated changing is_admin at all; and clears the flag off everyone
-- but you.
--
-- Full file: supabase/migrations/20261008_fix_is_admin_escalation.sql
-- ============================================================================

drop policy if exists "lesson chat: members and admins read" on public.lesson_messages;
create policy "lesson chat: members and admins read" on public.lesson_messages
  for select using (
    public.is_lesson_member(booking_id)
    or public.is_admin()
  );

drop policy if exists "lesson notes: members and admins read" on storage.objects;
create policy "lesson notes: members and admins read" on storage.objects
  for select using (
    bucket_id = 'lesson-notes' and (
      public.lesson_member_for_path(name)
      or public.is_admin()
    )
  );

create or replace function public.protect_is_admin()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if tg_op = 'INSERT' then
      new.is_admin := false;
    elsif new.is_admin is distinct from old.is_admin then
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_is_admin on public.profiles;
create trigger protect_is_admin
  before insert or update on public.profiles
  for each row execute function public.protect_is_admin();

update public.profiles
   set is_admin = false
 where is_admin
   and lower(coalesce(email, '')) <> 'mutualevy@gmail.com';

-- Should list only you, or nothing at all.
select id, email, is_admin from public.profiles where is_admin;


-- ============================================================================
-- STEP 2 — PRIVACY: a teacher could read a parent's other children
--
-- A child practising on a parent's login could press "Join a class", which
-- enrolled the PARENT'S ACCOUNT. The teacher policies match on the account,
-- and since the per-child rewrite every child on an account shares the
-- parent's user_id — so every sibling's progress and answers became readable
-- to that teacher, listed as extra students under the parent's name.
--
-- Below: teachers read only the member's own rows; the leaderboard counts
-- only their own answers; join_class refuses an account that holds children.
-- No data is changed — existing memberships simply stop showing child rows.
--
-- Full file: supabase/migrations/20261021_class_privacy.sql
-- ============================================================================

DROP POLICY IF EXISTS "Teachers read enrolled students progress" ON ai_tutor_progress;
CREATE POLICY "Teachers read enrolled students progress"
  ON ai_tutor_progress FOR SELECT
  USING (
    ai_tutor_progress.learner_id IS NULL
    AND coalesce(ai_tutor_progress.profile_key, '') !~ '_c[0-9a-f]{8}-[0-9a-f]{4}-'
    AND EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = ai_tutor_progress.user_id
        AND c.teacher_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Teachers read enrolled students events" ON response_events;
CREATE POLICY "Teachers read enrolled students events"
  ON response_events FOR SELECT
  USING (
    response_events.learner_id IS NULL
    AND EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE cm.student_id = response_events.student_id
        AND c.teacher_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION public.join_class(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_class UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM children ch WHERE ch.parent_id = auth.uid()) THEN
    RAISE EXCEPTION 'A parent account cannot join a class: it holds your children''s progress';
  END IF;

  SELECT c.id INTO v_class FROM classes c WHERE c.join_code = upper(p_code);
  IF v_class IS NULL THEN
    RAISE EXCEPTION 'Invalid class code';
  END IF;

  INSERT INTO class_members (class_id, student_id)
  VALUES (v_class, auth.uid())
  ON CONFLICT (class_id, student_id) DO NOTHING;

  RETURN v_class;
END;
$$;
GRANT EXECUTE ON FUNCTION public.join_class(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.class_leaderboard(p_class UUID, p_days INT DEFAULT 7)
RETURNS TABLE (student_id UUID, name TEXT, points BIGINT, problems BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM classes c WHERE c.id = p_class AND c.teacher_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not your class';
  END IF;
  RETURN QUERY
    WITH scored AS (
      SELECT e.student_id AS sid, e.skill_id,
             LEAST(COUNT(*) FILTER (WHERE e.correct AND COALESCE(e.time_ms, 99999) >= 1500), 10) AS pts,
             COUNT(*) FILTER (WHERE e.correct) AS probs
      FROM response_events e
      JOIN class_members cm ON cm.student_id = e.student_id AND cm.class_id = p_class
      WHERE e.created_at >= now() - (p_days || ' days')::interval
        AND e.learner_id IS NULL
      GROUP BY e.student_id, e.skill_id
    )
    SELECT s.sid, COALESCE(pr.full_name, pr.email, 'Student'),
           SUM(s.pts)::bigint, SUM(s.probs)::bigint
    FROM scored s
    LEFT JOIN profiles pr ON pr.id = s.sid
    GROUP BY s.sid, pr.full_name, pr.email
    ORDER BY 3 DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.class_leaderboard(UUID, INT) TO authenticated;


-- ============================================================================
-- STEP 3 — EXPOSURE: anyone can read all 147 email addresses and phones
--
-- The public anon key is in the website's JavaScript, so it is not a secret.
-- With it and no sign-in, `profiles` returns every row, with email, phone,
-- role and is_admin. Verified again today.
--
-- This changes NO policy. The policies keep deciding which ROWS anon sees;
-- this decides which COLUMNS. That is deliberate: one of those policies is
-- what makes the tutor directory work, and dropping the wrong one takes the
-- listings offline. Narrowing columns cannot do that.
--
-- RUN THIS ONLY AFTER the site has redeployed with today's commit. The tutor
-- directory used to ask for `profiles(full_name, avatar_url, email)` while
-- signed out and never show the address; the email was taken out of that
-- query in the same commit. If you run this against the old build, the
-- directory will 403.
--
-- Full file: supabase/migrations/20261026_profiles_columns.sql
-- To undo:   GRANT SELECT ON public.profiles TO anon;
-- ============================================================================

REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, full_name, avatar_url, avatar) ON public.profiles TO anon;


-- ============================================================================
-- STEP 4 — A QUESTION, NOT A CHANGE. Run it and send me the output.
--
-- Step 3 stops the addresses leaking but anon can still LIST the 147 names,
-- because the row rule still allows it. Closing that means changing a policy,
-- and I will not write a DROP against a policy I have not read: the tutor
-- directory depends on one of them, and the teacher dashboard depends on
-- another to show student names.
--
-- This only reads. It changes nothing.
-- ============================================================================

select policyname, cmd, roles, qual, with_check
  from pg_policies
 where schemaname = 'public' and tablename = 'profiles'
 order by cmd, policyname;


-- ============================================================================
-- STEP 5 — the row fix. Not written yet, on purpose: it is whatever step 4's
-- answer says it should be. Send me the output and it comes back ready.
-- ============================================================================
