# Build backlog

Distilled from [findings.md](findings.md). Ordered by impact on a child's learning.

## B1 · Diagnostic feedback (recognise the *specific* mistake) — **highest impact**
From F1, F2. Today every wrong answer gets the same canned hint. Instead:
- `diagnose(skill, problem, answer)` computes the known "buggy" answers from the
  problem's own numbers (partial products, forgot-to-carry, borrow errors, place-value
  collapse) and returns a warm, specific line that **names what the child did**.
  - 42×4 → 160: *"So close! 160 is 40×4 — now add the ones: 2×4 = 8, so 168."*
  - 42×4 → 8: *"That's 2×4, the ones. Don't forget the tens: 40×4 = 160."*
- **Escalating hints:** attempt 1 = gentle nudge · attempt 2 = the diagnosis · attempt 3 =
  full working that **shows the partial products** (reuse the animated column/area model).
- Show the child **their own answer** next to the right path.
- A clear-but-kind **"Not quite"** on every wrong attempt, not only the final reveal.

Scope: start with multiplication (2-digit × 1-digit), then addition & subtraction.

## B2 · 🔴 Fix: remediation must use the *actual problem's* working — **bug, do first**
From F11. The addition "still stuck?" steps and the final "full working" render the
*similar example's* steps (234+567) for the child's real problem (e.g. 727+112), with the
correct answer bolted on. Generate steps from the learner's actual problem numbers (reuse
the animated model's engine), never from the example. Audit subtraction/division for the
same reuse.

## B3 · Reuse the animated model where help is needed most
From F10. Wire the animated column/area model into (a) the inline "See a similar solved
example" during practice and (b) the wrong-answer reveal — not only the intro.

## B4 · Numeric input hygiene
From F6. Add `inputmode="numeric"` (number pad on phones); optionally block non-numeric
so gibberish doesn't burn an attempt; nudge "type a number" instead of a maths hint.

## B5 · Show the parts in every reveal
From F1, F8. Every "full working" / "teach it back" should show the partial products
(40×4 = 160, 2×4 = 8, 160 + 8 = 168), not the collapsed "Add → 168".

## Protect (don't regress)
Correct-answer warmth + "Teach it back" (F3) · backward-fading scaffold (F4) · area/column
animated worked example (F5) · decimal normalisation (F7) · mid-lesson resume (F9).
