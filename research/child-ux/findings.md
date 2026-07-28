# Findings log

Newest scenarios appended at the bottom. Each entry: what I did → what happened →
verdict → concrete fix.

---

## F1 · Wrong-answer flow, multiplication (42 × 4, answer 168)

**What I did (as a grade-5 child):** Answered **160** — a real, common slip: I did
40×4 = 160 but forgot to add 2×4 = 8.

**What happened, attempt by attempt:**
| # | Typed | HOREB's response |
|---|-------|------------------|
| 1 | 160 | Field clears; generic **"Hint: Split the bigger number into tens and ones."** |
| 2 | 148 | *Identical* hint. No change. |
| 3 | 99  | "Not quite — the answer is 168" + "full working": *Multiply the tens and ones separately → 40×4 + 2×4. Add → 168.* → **Next**. |

**Findings:**
- 🟠 **Hint isn't diagnostic.** I answered 160 — I already split into tens and ones.
  Being told to do the thing I did is confusing and demoralising. One canned hint
  per skill, reused everywhere.
- 🟠 **No escalation.** Attempt 1 and 2 are byte-identical. The child hits the same wall.
- 🟡 **No "not quite" on attempts 1–2.** The box just empties + a hint appears. A child
  can't tell if they were wrong or if it glitched. (The clear "Not quite" only shows on the final reveal.)
- 🟠 **The "full working" hides the missed step.** It says "Add → 168" but never shows
  40×4 = **160** and 2×4 = **8** — the exact number I forgot (the 8) is never named.
- 🟡 **The child's answer is discarded** on attempts 1–2 — no "you wrote 160" to compare against.

**Concrete fix:** diagnostic feedback keyed to the specific answer + escalating hints +
"full working" that shows the partial products (reuse the animated model). → build-backlog B1.

---

## F2 · Proactive hint ("I'm not sure — show me a hint")

**What I did:** On 11 × 4, clicked the hint link *before* answering.

**What happened:** Same single line — **"Split the bigger number into tens and ones."**

**Finding:** 🟠 There is exactly **one hint per skill**, shared between the proactive
button and every wrong attempt. A child who asks for help twice gets nothing new.

---

## F3 · Correct-answer flow (11 × 4 = 44) — WORKING WELL

**What happened:** "✓ **Nice, Test — that's right!**" (green, personalised) · progress bar
advances to **1/5** · a **"Teach it back"** card: *"You worked the last step yourself.
Say why it works — out loud or in your head — then check: [Show the thinking]"* · **Next**.

**Finding:** 🟢 Warm, personal, and pedagogically strong (self-explanation prompt). The
success path is good — **protect it**. The gap is entirely on the wrong-answer side.

---

## F4 · Backward-fading scaffold responds to failure — WORKING WELL

**What happened:** After failing 42×4, the next problem's support chip escalated from
**"Some help" → "Guided"**, and the started-for-you solution showed more.

**Finding:** 🟢 The Renkl backward-fading is doing its job — support goes *up* after a
miss. Good. (It doesn't yet change the *hint/feedback*, only the worked scaffold — see F1.)

---

## F5 · Worked-example area model (19 × 3, 42×4 setup) — WORKING WELL

**What happened:** The area model clearly splits 19 into 10 + 9, fills 10×3 = 30 (blue)
and 9×3 = 27 (green), and sums to 57. Genuinely legible for a 10-year-old.

**Finding:** 🟢 The visual worked example is a strength. The disconnect: this clarity
**disappears** in the wrong-answer remediation, which reverts to thin collapsed text (F1).

---

## F6 · Input robustness — non-numeric ("abc")

**What I did:** On 49 × 8, typed **abc** and pressed Check Answer.

**What happened:** Accepted silently, counted as a **wrong attempt** (same generic hint,
"Try Again"). No "please type a number" guidance. Field is `type="text"` (see F6b).

**Findings:**
- 🟡 Gibberish **burns a real attempt** and gives help aimed at a maths mistake, not at
  "that wasn't a number."
- 🟠 **F6b — mobile keyboard:** the field is `type="text"` with no `inputmode="numeric"`.
  On a phone the child gets a full QWERTY keyboard, not a number pad. Easy, high-value fix.

---

## F7 · Input robustness — decimal equivalence ("392.0") — WORKING WELL

**What I did:** Typed **392.0** for 49 × 8 (= 392).

**What happened:** ✓ Accepted as correct ("attempt 2"). Answers are parsed numerically,
so `392.0`, `392`, and ` 392 ` all match.

**Finding:** 🟢 Numeric normalisation is robust. Protect it.

---

## F8 · "Teach it back" reveal collapses the parts

**What I did:** On a correct 11 × 4, opened **Show the thinking**.

**What happened:** It showed only **"2. Add → 44"** — never 10×4 = 40 and 1×4 = 4.

**Finding:** 🟡 Even the positive self-explanation reveal hides the partial products, so a
child can't check *their* reasoning against the actual parts.

---

## F9 · Exit mid-lesson & resume — WORKING WELL

**What I did:** Exited multiplication at 2/5, returned home.

**What happened:** "Continue learning" still pointed to Multiplication; XP/streak/ring
updated correctly. (Did not verify it resumes the *exact* question — worth a deeper check.)

**Finding:** 🟢 Leaving mid-lesson is safe and the resume affordance is correct.

---

## F10 · Animated model not reused where help is needed most

**What happened:** The animated column-addition plays once, on the **intro** worked example.
But the **inline "See a similar solved example"** during practice, and the **wrong-answer
remediation**, both show *static text steps* instead.

**Finding:** 🟠 The strongest representation appears at the least-needed moment (intro), and
the weakest (static text) appears at the most-needed moments (stuck mid-practice, just failed).

---

## F11 · 🔴 BLOCKER — remediation shows the WRONG problem's working (addition)

**What I did:** On **727 + 112** (answer 839) I answered wrong three times.

**What happened:**
- "still stuck?" → *"Here are the first steps: 1. Line up the digits. 2. **4 + 7 = 11, write 1 carry 1**."*
- Final reveal → "Not quite — the answer is **839**" (correct), then "full working":
  1. Line up the digits by place value
  2. **4 + 7 = 11, write 1 carry 1**
  3. **3 + 6 + 1 = 10, write 0 carry 1**
  4. **2 + 5 + 1 = 8**

**These steps are for 234 + 567 (the *example*), not 727 + 112.** There is no 4, 6, or 5 in
the child's problem, and 727 + 112 needs **no carrying at all**. The correct answer (839) is
bolted onto a different problem's working.

**Verdict:** 🔴 A child who fails and reads the "help" is walked through a completely
different sum, step by step, and told the answer is 839. This actively teaches confusion.

**Likely cause:** the addition remediation reuses the *similar-example*'s `steps`
(`generateWorkedExample` on the example problem) instead of generating steps for the
learner's actual `problem`. (Multiplication's reveal *did* match — "40×4 + 2×4" for 42×4 —
so this is specific to how addition sources its steps.)

**Concrete fix:** generate the step-by-step working from the **actual problem's** numbers
(same engine as the animated model already uses), never from the example. → build-backlog B2.

---

## F12 · 🔴 BLOCKER confirmed on subtraction too — it's systemic

**What I did:** On **207 − 174** (answer 33) I answered wrong three times (the "subtract
smaller from larger" bug: 173, then 170, 171).

**What happened:** "Not quite — the answer is **33**" (correct), then "full working":
1. Start from ones: **3 − 8**, need to borrow
2. **13 − 8 = 5**
3. 3 (was 4, borrowed 1) − 7, borrow again: **13 − 7 = 6**
4. 4 (was 5, borrowed 1) − 2 = 2

**These steps are for 543 − 278 (= 265), the worked example** — not 207 − 174. There is no
8 or 5 in the child's problem, and the working reconstructs to 265, not the 33 it just stated.

**Verdict:** 🔴 Same bug as F11, now confirmed on a second skill → **systemic**. Any skill
whose `generateWorkedExample` uses a fixed sample problem (addition, subtraction, likely
division) shows the *sample's* working under the *actual* problem's answer. Multiplication
escaped only because its steps are phrased from the real numbers ("40×4 + 2×4").

**Scope for B2:** treat as a general fix, not per-skill. The stated answer is already computed
from the real problem — only the *steps* are wrong-sourced.

---

## F13 · Fractions — interactive manipulative (mostly WORKING WELL)

**What I did:** "Shade the bar to show 1/5." Clicked one of five parts → it filled green,
"Shaded: 1/5", Check Answer enabled. Submitted → "✓ Nice, Test — that's right!" → 1/6.

**Findings:**
- 🟢 A real **interactive manipulative** (click to shade, live counter). Much better than
  typing a number for a "show 1/5" task. Protect this.
- 🟡 **Copy bug:** the answer field placeholder reads *"Click the grid above, or type the
  **coordinate**…"* — "coordinate" is leftover generic wording; wrong for a shading task and
  meaningless to a 10-year-old.
- 🟡 **Style inconsistency:** the "A picture to help" panel is a **dark grey block** with
  dark-navy tiles — visually heavy and off-theme against the calm light canvas everywhere else.
- 🟡 The intro worked example ("Place 2/6 on the number line") is **text-only** with the
  answer just re-stating "2/6" — it *names* a number line but shows none, and the "answer"
  is already in the question. The *practice* is interactive; the *intro* isn't. Inconsistent.
- 🟡 The correct-answer screen here has **no "Teach it back"** card (multiplication does).

---

## F14 · 🔴 FIXED — comparison question had nonsensical options

**Found (live, whitestarhighrise):** *"Which number is bigger: 99 or 47?"* → options **99 / 100 / 98**.
The distractors were answer±1, so 47 wasn't even offered and "pick the biggest" always wins.

**Cause:** young-mode (`YoungLearnerLesson.planYoungLesson`) builds near-miss distractors for
every integer answer; the compare generator (`content/lowerPrimary.js`) left `misconceptions` empty.

**Fix:** the compare problem now names its own `choices: [a, b]`, and young-mode honours an
explicit `choices` list. **Verified live:** "Which is bigger 56 or 35?" now offers **35 / 56**.

## F15 · 🔴 FIXED — "8 of 6" counter overflow

**Found:** the young-lesson header read **"8 of 6"** (and standard mode could show "8/5") once
mastery needed more correct answers than `minProblems`.

**Fix:** cap the numerator (`Math.min(correct, minProblems)`) in both the young and standard
headers. Verified: counter now reads "1 of 6" and won't exceed the target.

## F16 · 🟠 Young (toddler) UI shown to an older student on a foundational skill

**Found:** an older student practising the Grade-1 "Counting & Numbers (1–50)" skill gets the
**young-mode** experience — duck mascot, "Listen, then choose your answer", read-aloud. HOREB's
whole premise is that an older child may have a grade-1 *gap*; but the *presentation* is keyed to
the skill's grade (`skill.grade <= 2`), not the child's age, so a 10–12-year-old rebuilding a
foundation gets a toddler interface. Feels condescending. **Design rework — not yet done.**

## F17 · 🟠 Skills / Progress / Awards tabs are off-theme (dark cards on the light canvas)

**Found:** the **Skills** tab renders **dark-navy cards** on the light off-white ground — a jarring
clash with the reskinned sidebar/home. These tabs predate the light reskin. Progress/Awards likely
the same. **Design rework — not yet done.**

## Coverage so far
Multiplication · Addition · Subtraction · Fractions — worked example, practice, wrong-answer
arc (×3 attempts), proactive hint, correct-answer, scaffold escalation, input edge cases,
exit/resume. **Not yet:** the review/spaced-repetition flow, the diagnostic/placement,
mobile lesson layout, division, and the "Awards/Progress/Skills" tabs as a child would read them.
