# qa/ — the HOREB tester's simulated classroom

Test code only (tutagora-hq projects/horeb/QA.md). Nothing here is product code.

- `node qa/classroom.mjs` plays 18 children (Grades 4-9 × strong, average, struggling)
  through the free check and six practice sittings, checks every question served
  (scope, fit, key, marking, pictures, wording, help, repeats, jumps), then sweeps
  every CBC Grade 4-9 skill 20 times for the content checks. Options: `--seed`,
  `--sittings`, `--sweep`, `--json <file>`. `QA_TRACE=9average` prints that child's plan
  each sitting.
- `node qa/sample.mjs` dumps 12 questions per CBC grade with hints and worked
  examples, for reading by hand.
- `report.txt` / `sample.txt`: the latest shift's output.

The sitting model is an approximation of the lesson loop (8 questions a skill,
7 right = mastered; no in-lesson remediation).
