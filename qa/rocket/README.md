# qa/rocket: checking the Rocket Challenge migration on a THROWAWAY database

Never run these against the live Supabase project: `behaviour.sql` inserts test
accounts into `auth.users`. They are for a local Docker Postgres only.

```
docker run -d --rm --name rocket-sqltest -e POSTGRES_PASSWORD=pw public.ecr.aws/supabase/postgres:15.8.1.105
docker cp qa/rocket/stubs.sql rocket-sqltest:/tmp/stubs.sql      # auth.uid(), is_admin(), children, profiles, ai_tutor_progress
docker cp qa/rocket/prep.sql rocket-sqltest:/tmp/prep.sql        # storage.buckets.public, grants for the test role
docker cp supabase/migrations/20261103_rocket_challenge.sql rocket-sqltest:/tmp/m.sql
docker cp qa/rocket/behaviour.sql rocket-sqltest:/tmp/behave.sql
for f in stubs prep m m behave; do docker exec -e PGPASSWORD=pw rocket-sqltest psql -h localhost -U supabase_admin -d postgres -f /tmp/$f.sql; done
docker stop rocket-sqltest
```

The migration is applied twice on purpose (it must be safe to re-run). What
`behaviour.sql` shows, run on 3 Nov 2026:

- joining without consent, with someone else's child, or at Grade 5 is refused;
- a third learner is refused ("This team already has two learners");
- a pressure of 6 bar in the log is refused by the table's check;
- a family cannot write HOREB's side of the chat (RLS);
- a stranger sees no teams, members or log, and cannot read the maths or open a level;
- the school's teacher sees the team and can open level 2;
- only the parent can ask for deletion; the organiser's `rocket_erase_member`
  removes the seat and replaces that learner's log entries;
- `rocket_team_maths` counts only linked skills mastered since the start.
