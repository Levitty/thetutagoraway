-- =====================================================================
-- HOREB: one new Grade 5 mistake, a single number called an equation (owner, 17 Nov 2026)
-- =====================================================================
-- Run in Supabase Dashboard -> SQL Editor, after 20261116_teachers.sql. Idempotent: safe to run twice.
-- WHY: "Which of these is an equation?" tagged every wrong option with one mistake. Picking the number
-- "50" is a different misunderstanding from picking "a + 16", so the Grade 5 library gains
-- M_NUMBER_IS_EQUATION (draft, for the teacher reviewer). No existing code is renamed or removed.
-- Source: curriculum/mathematics/g5.json in HOREB (commit 3f19abd).
-- =====================================================================
BEGIN;
INSERT INTO public.curriculum_misconceptions (code, skill_code, error, example, cause, reveals, help, status) VALUES ('MATH.G5.NUMBER.SIMPLE_EQUATIONS.EQ_MEANING.M_NUMBER_IS_EQUATION', 'MATH.G5.NUMBER.SIMPLE_EQUATIONS.EQ_MEANING', 'Calls a single number, or a number with no equals sign, an equation, because numbers are ''the answer'' and an equation is thought of as ''the maths''.', '{"question": "Which is an equation? A: x + 7   B: x + 7 = 15   C: 50", "wrong_answer": "C", "correct_answer": "B"}'::jsonb, 'The child has met ''equation'' only as a word for ''a maths problem'', so a number such as 50, which looks finished, is picked as the nearest thing to a maths answer. It is a different idea from mixing up an expression with an equation, which comes from seeing letters.', 'A sorting task with a plain number among expressions and equations, where the child picks the number.', 'Ask ''What two things are being said to have the same value?'' for each choice. A number on its own says nothing is equal to anything. Show 50 beside 20 + 30 = 50.', 'draft') ON CONFLICT (code) DO UPDATE SET error = EXCLUDED.error, example = EXCLUDED.example, cause = EXCLUDED.cause, reveals = EXCLUDED.reveals, help = EXCLUDED.help, updated_at = now() WHERE public.curriculum_misconceptions.status = 'draft';
COMMIT;
