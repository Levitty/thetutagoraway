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

Added 27 Oct: fair forms for a negative in brackets "(-4)", thousands commas and
spaces, "KSh 9000" and ".5"; the wrong-unit near miss ("28 kg" for an area);
key checks for a negative "how much more" and a hire-purchase price below cash;
and a help check that the worked example is about the same thing (cone, not
cylinder; alternate, not co-interior). `node qa/probe-forms.mjs` tries the
extra forms on every CBC Grade 4-9 skill, 25 draws each.

Added 4 Nov (F27): the wrong-unit near miss also tries the same family at another
size ("62.5 m" for 62.5 cm).

Added 5 Nov (F30): a key check that a solve question has exactly one answer, not
a pair of parallel or identical lines.
