# Content system — effective learning content, at scale, verified

Most "tutor" apps ship question→answer pairs. That is not enough to drive real
learning outcomes. This system makes every problem carry what the learning
science says actually moves the needle, and makes that quality **measurable**.

## What an "effective" problem carries
1. **Worked example** — a separate, fully-solved instance to study *before*
   practising (the worked-example effect).
2. **Scaffolded step-by-step solution** — so a wrong answer teaches the method,
   shown for *this* problem, not a different one.
3. **Hint ladder** — graduated nudges (orient → method → concrete step), never
   the answer.
4. **Misconception feedback** — named, specific responses to common wrong
   answers (sign slips, distributing errors…).
5. **Variety + a verify hook** — many distinct instances, plus a way for the
   engine to *prove* the stated answer is mathematically correct.

## How it's built (so it scales)
Hand-authoring all five for 200 skills is hopeless. Instead:

- **`schema.js`** — pedagogy-aware *builders* per problem TYPE
  (`buildLinearEquation`, `buildSimplify`, `buildDistribute`, `buildBinomial`,
  `buildFactorizeCommon`). Each emits the full rich object from random
  parameters, with a guaranteed-correct answer and auto-generated steps.
- **`algebra.js`** — a skill is a thin composition of builders across
  difficulty tiers. Adding a skill is a couple of lines.
- The builders attach a `verify` hook: `equation` (substitute the solution
  back) or `identity` (evaluate original vs answer at random x). This is what
  the quality gate uses to catch wrong answers.

## The quality gate (the measurement system)
`node engine/scripts/quality_gate.mjs [--authored] [--verbose]`

Scores every skill against the bar and **independently verifies correctness** —
a tutor teaching wrong answers is worse than none. It already caught a real
verifier bug during development. Use `--authored` as a CI gate (non-zero exit if
any authored skill drops below the bar).

## Status
Proven on the **Algebra vertical** (foundational core: collect terms, expand,
factorise, solve linear equations through variables-both-sides). 9 skills, all
scoring 100/100 with every generated answer verified. The remaining algebra
spine + other strands extend by adding builders + compositions, gated the same way.

## Adding a skill
1. If a builder for the problem type exists, compose it in the strand file
   (e.g. `algebra.js`) with a difficulty tier.
2. If not, add a builder to `schema.js` that returns the rich object **and a
   `verify` hook**.
3. Run the quality gate until it passes. Done.

## Question families (5 Nov 2026)
`families/` holds question forms written in advance: a story with a stop on the way, a table to read, a child's working with one wrong step, a choice of reasons. They emit the same problem object as the builders and enter at `generateRaw`, so there is one content path. Read `families/core.js` for the format and the rules, and `families/labelFixes.js` for examples.

- `reviewed: false` keeps a family from every child until a person signs it off. `node scripts/build-question-review.mjs` writes the pack, `node scripts/apply-question-review.mjs sign-off.xlsx` writes the flags.
- `npm run horeb:try` turns everything on under the dev server only and opens a page to try them.
- `npm run test:content` holds every family to: computed key and a second check, one right answer, named wrong answers, its outcome, a form its skill did not have. It also reports forms, fit and coverage by grade.
- Outcomes and skill tags live in `curriculum/`, in the same codes as Tuta's migration 215. Run `node scripts/build-skill-tags.mjs` after changing them.
