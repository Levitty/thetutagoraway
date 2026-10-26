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
