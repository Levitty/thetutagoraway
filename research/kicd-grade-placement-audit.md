# Where HOREB's grade labels disagree with the KICD designs

**Date:** 9 October 2026
**Sources:** the eight official designs in `docs/curriculum-sources/`
(KICD Mathematics / Mathematical Activities, Grades 2–9, revised 2024)
**Method:** `scripts/kicd-gap.mjs` — every sub-strand in each design's own
*Summary of Strands and Sub Strands*, matched against the skills our graph
places at that grade. Every finding below was then read back against the
design's assessment rubric, which states the expected level in words.

---

## Why this matters more than it looks

The placement check was rewritten on 8 Oct so that it sweeps the learner's
declared grade across all five strands and never climbs past it. That fix is
sound, but **it reads the grade labels in `knowledgeGraph.js` as if they were
true.** Where a label is wrong, the check asks the wrong question and the
resulting level is wrong in the same direction.

This was caught in the field, not in a test: a Grade 5 learner was asked
`21 × 3` as a level question. Our graph calls that "Multiplication (2-digit ×
1-digit)" and labels it Grade 5.

> **KICD Grade 5, Numbers, assessment rubric (p. 29):**
> *Ability to Multiply up to a 3-digit number by a 2-digit number.*
> **Meets Expectations** — multiplies a 3-digit number by a 2-digit number and
> a single digit; 2-digit by 2-digit and a single digit number correctly.
> **Below Expectations** — multiplies a 2-digit number by a 2-digit number **or
> a single digit number** correctly.

So `21 × 3` is the *Below Expectations* floor of Grade 5, not Grade 5 work. The
learner was right to find it insulting, and the check was right to ask it —
given a graph that says it is Grade 5.

**Nothing in the curriculum is missing from the graph.** All 40-odd sub-strands
across Grades 2–9 have at least one matching skill somewhere. The problem is
*which year they sit in*.

---

## Confirmed misplacements

| KICD design | HOREB graph | Drift |
|---|---|---|
| **G4** Numbers 1.8 *Use of letters* | no Algebra skill at Grade 4 at all; first is Grade 5 | absent at G4 |
| **G5** Whole Numbers — LCM, HCF/GCD, divisibility tests of 2, 5, 10 (rubric p. 28) | Grade 7 (`Least Common Multiple`, `Greatest Common Divisor`, `Divisibility Tests`) | **2 years late** |
| **G5** *Combined operations involving +, −, × and ÷* (rubric p. 30) | Grade 6 (`Order of Operations (BODMAS)`) | 1 year late |
| **G5** Multiply 3-digit × 2-digit (rubric p. 29) | Grade 5 skill is 2-digit × 1-digit; the 3×2 level does not exist | ~2 levels low |
| **G5** Divide 3-digit by up to 2-digit (rubric p. 30) | Grade 5 skill is `Division (by 1-digit)` | 1 level low |
| **G8** Numbers 1.1 *Integers* | Grades 6–7 | 2 years early |
| **G8** Numbers — Fractions, Decimals, Squares revisited | no fraction, decimal or square-root skill at Grade 8 | revisit missing |
| **G8** Measurements 3.1 *Circles* | Grades 7, 9, 10 — nothing at Grade 8 | straddles |
| **G9** Numbers 1.3 *Indices **and** Logarithms* (one sub-strand) | Indices at Grade 8, Logarithms at Grade 10 | split across 3 years |
| **G9** Numbers 1.2 *Cubes and cube roots* | Grade 8 | 1 year early |
| **G9** Algebra 2.1 *Matrices* | Grade 11 | **2 years late** |

## Duplicate skills

The same skill appears at two grades, so a learner can be tested on it twice
and "master" one copy while the other stays open:

- `Addition (Multi-digit)` — Grades 4 **and** 5
- `Subtraction (Multi-digit)` — Grades 4 **and** 5
- `Capacity (Litres)` — Grades 2 **and** 3

## The BODMAS thread

Three independent signals point at the same skill:

1. A teacher said BODMAS is "among the main things" and the check barely asked it.
2. The graph gives `Order of Operations (BODMAS)` weight 3 and exactly **one**
   dependent skill, so the question selector — which picks the most
   load-bearing skill per strand — never chooses it.
3. KICD puts combined operations in **Grade 5**; we have it in Grade 6.

It is under-graded *and* under-weighted. Rewiring its dependents changes
sequencing for every learner, so it is a deliberate content decision, not a
bug fix.

---

## What this does **not** settle

- **Whether CBC's ordering is the right teaching order.** KICD is the authority
  on what Kenyan schools teach in a given year; it is not automatically the
  best prerequisite structure for an adaptive engine. Matrices at Grade 9 is
  CBC's call; whether a learner can hold matrices before quadratics is ours.
- **Grades 1, 10, 11, 12.** No KICD design for Grade 1 or senior school is in
  the repo, so those grades are unaudited.
- **Depth within a sub-strand.** This compares topic placement. It does not
  check whether our problems hit the level the rubric describes — the `21 × 3`
  case was caught by reading one rubric by hand, and there are many more.

## Suggested order of work

1. **Fix the three duplicates.** Mechanical, no judgement needed.
2. **Re-grade the five Grade 4–5 findings.** These hit the largest number of
   learners and are the ones a teacher just hit in real use.
3. **Add the missing levels** — 3-digit × 2-digit multiplication, 3-digit ÷
   2-digit division, Grade 4 use-of-letters, Grade 8 fraction/decimal revisit.
4. **Decide the senior-school ones with a teacher** — integers, indices,
   logarithms, matrices. These change what a KCSE candidate sees.
5. **Re-run the placement simulation** afterwards. The check's behaviour is
   only as good as the labels, so the 8 Oct measurements should be repeated
   once the labels move.
