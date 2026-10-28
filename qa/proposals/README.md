# Proposed fixes from the HOREB tester

Each `F<n>.patch` is a `git diff` against main (6a99246). Each one applies
cleanly on its own, and all nine apply together in this order:

    F5 F6 F7 F8 F9 F10 F11 F12 F16

Apply one with:

    git apply qa/proposals/F5.patch

Each patch adds its own test under `tests/`. The tester does not apply them;
the HOREB lead reviews them, and the owner merges.

All nine applied: `npm test` gives 209 pass and 1 fail. The failure is
student-mode, which needs node_modules and fails on main too. The content
quality gate passes 255 of 255. The classroom changes:

| check | main | with all nine |
|---|---|---|
| marking (classroom) | 97.8% | 100% |
| help (classroom) | 96.4% | 100% |
| help (sweep) | 90.1% | 100% |
| key (sweep) | 99.9% | 100% |
| scope | 81.9% | 91.5% |
| fit | 97.0% | 99.2% |

See `../report.txt` (main) and `../report-with-proposals.txt`.
F13, F14 and F15 are plans in feedback.md, not patches.

## 27 Oct 2026 (branch qa/2026-10-27, against main 5a5952e)

F5–F8 and F16 are merged. Still open, still applying cleanly to main: F9, F10,
F11, F12. New:

- `F25.patch`: a negative answer in brackets, "(-4)", is read as -4
  (answerCheck.js `mathValue`), with `tests/negative-in-brackets.test.mjs`.
- `F26.patch`: hire purchase always costs more than cash (numbers.js,
  `buildCommercialArith`), with `tests/hire-purchase.test.mjs`.

Both together: `npm test` 270 of 270. The content gate's three failures
(G6_TIME, G7_FRACTIONS_DIV, G7_FRACTIONS_MUL) are on main already and are not
touched by these patches.
