# Grade 5 Mathematics question review (17 Nov 2026)

`G5_MATHS_TRACKER.csv` has one row for each of the 501 Grade 5 Maths families, as they stood on `main` before the
review. Columns:

| column | values |
|---|---|
| family_id, sub_strand, skill | the family and the curriculum skill it serves |
| outcome_fit | `fit`, `weak` or `off`, judged against the KICD outcome text of the sub-strand |
| wrong_options | `ok`, `shared` (two wrong options carry one code), `slip_as_mis` (a one- or two-off answer carries a code), `generic` (a reason such as "Check the addition"). A family with more than one problem shows the first in that order; the reason column names them all |
| practical | `ok`, `fake_context` (a wrapper such as "X thinks of a number"), `trivial` (the answer can be copied from the question), `odd_numbers` (numbers or distractors a Grade 5 child in Kenya would not meet) |
| verdict | `keep`, `fix` or `drop` |
| reason | one line |
| status | `fixed` when the problem is resolved on this branch, `open` when work is outstanding. A `keep` row has nothing outstanding and reads `fixed` |

## How the rows were judged

- **wrong_options** comes from `scripts/check-distractors.mjs` run on `main` (40 draws per family, the baseline that was on
  `main`). Spot-the-mistake families name the faulty step, so their per-step reasons are fine.
- **outcome_fit** and **practical** come from drawing each family 12 times and reading it against the KICD outcome. Families in the
  Simple Equations, Fractions and Decimals sub-strands were read in full, several draws each; the others were read from the
  drawn questions plus automatic tests (a bare item with no situation, an answer that appears in the question, negative or
  long-decimal wrong options, "thinks of a number" style wrappers). A bare drill item such as "Which is the sum of 6 km 620 m and
  1 km 640 m?" is marked `weak` but `keep`, because the word-problem sibling in the same skill carries the situation.
- **Nothing is `drop`.** Every weak family could be rewritten, so none was switched off.
- Rows for sub-strands that were not worked yet are `open`. Work through them in the order the checker flags them.

## What was fixed on this branch (`qa/map-review`)

- Simple Equations, Fractions and Decimals: every wrong option names its own library idea, or is a `SLIP`, with a specific
  reason; weak recognition questions became forming questions in real situations.
- Whole Numbers: 3 of 22 flagged families (numbers in words, words to figures, total value of a digit).
- A kit rule in `src/ai-tutor/content/families/g5c_lib.js`: a question never offers two wrong options for one library code.
- 22 new draft library entries (3 equations, 10 fractions, 5 decimals, 4 whole numbers), each with a teaching-pack entry.
  `supabase/migrations/20261118_map_review_misconceptions.sql` adds them to the database. It is not run.
- The checker counts a near miss only for whole numbers (3.04 beside 3.4 is a place-value idea, not a slip).
