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

## Gap analysis vs the evidence (see [platform-research.md](platform-research.md))

Scored HOREB against the 10 evidence-backed practices (✓ have, ◐ partial, ✗ gap):

| # | Practice | HOREB today |
|---|---|---|
| 1 | ~80% success rate in practice | ◐ unmeasured — KP ladder adapts but nothing tracks/steers session success rate |
| 2 | Wrong answer triggers teaching | ✓ (diagnosis + own-numbers working, built Jul 28) |
| 3 | Hints scaffold process; numbers regenerate on retry | ◐ hints stop short of the answer ✓, but retry keeps the same numbers (Khan hint-farm trap) |
| 4 | No visible point loss on errors | ✓ (never had it; keep it that way) |
| 5 | Mastery certified on a delayed, mixed check | ✗ mastery lands in-session at minProblems; reviews exist but don't gate the "Mastered" badge |
| 6 | Review scheduled by forgetting + graph propagation | ✓ FIRe + spaced repetition |
| 7 | Interleave old skills into every session | ◐ review sessions interleave, but lessons are blocked single-skill |
| 8 | Fade scaffolding per learner | ✓ Renkl backward-fading |
| 9 | Reward effort-time and process | ◐ XP is per-correct; no credit for honest time / reading solutions |
| 10 | Safe, specific, blame-free tone | ✓ (after the Jul 28 remediation work) |

### New backlog from the gaps
- **B6 · Regenerate numbers on retry** (practice 3): largely mitigated Jul 29 — diagnoses
  no longer reveal the answer (F19), and the attempt-3 reveal is already marked incorrect
  with fresh numbers on Next. Remaining nice-to-have: fresh numbers on attempt 2–3.
- **B7 · Delayed mastery check** (practice 5): ✅ data layer DONE Jul 29 — a mastered
  skill answered correctly in a later review gets `confirmedAt` stamped (never unset on a
  miss). REMAINING: surface it (e.g. "Mastered ✓" vs "Mastered") — needs a design call.
- **B8 · Interleave into lessons** (practice 7): ✅ DONE Jul 29 — after the 3rd and 7th
  lesson answers, one due review from another skill appears as a bare-retrieval "Quick
  review" (one attempt, immediate feedback, credit to the reviewed skill). Young flow
  exempt. Pure logic in `interleave.js`, unit-tested. ⚠️ Needs a live-session UI pass.
- **B9 · Success-rate telemetry** (practice 1): re-scoped — the per-answer telemetry
  (response_events) already captures everything needed to measure session success rates;
  the steering mechanisms (KP ladder, support fading, modality drop, remediation) already
  exist. What's needed is an ANALYSIS job over telemetry to check where sessions actually
  land vs the ~80% target, then tune generator difficulty ranges. Not app code.
- **B10 · Effort-aware XP** (practice 9): ✅ DONE Jul 29 — a final miss pays 1 XP (the
  completed teaching moment of reading the working); interleaved reviews pay 3/1. Correct
  answers and mastery bonuses unchanged, so missing on purpose stays strictly worse.

## Protect (don't regress)
Correct-answer warmth + "Teach it back" (F3) · backward-fading scaffold (F4) · area/column
animated worked example (F5) · decimal normalisation (F7) · mid-lesson resume (F9).
