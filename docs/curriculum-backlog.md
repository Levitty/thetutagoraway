# Curriculum content backlog (CBC/CBE + Cambridge, Grade/Stage 7–9)

Status: derived from a coverage scan of `knowledgeGraph.js` against the official KICD designs and
the Cambridge 0862 framework (both in `docs/curriculum-sources/`). Both curricula are fully tagged;
this file is the *remaining* authoring/depth work, prioritized.

The scan compared every CBC sub-strand in the Grade 7–9 designs against the set of skills tagged to
it. Cambridge is fully code-tagged (92 skills, 22 enrichment), so its backlog is purely the optional
"teach the enrichment topics" question (P3).

---

## Not gaps — spiral-modeling artifacts (no action)

The coverage scan flags several CBC sub-strands as "uncovered" at a grade, but the concept already
has a skill — it's just modeled **once** at the grade we first teach it, then revisited (spiralled)
in the CBC design. Our graph deliberately models each procedural skill a single time. These are
**correct as-is** and must not be mistaken for missing content:

- G8 Numbers / Fractions, Decimals, Squares & Square Roots → taught at G7, revisited G8.
- G8 Data Presentation & Interpretation → `G7_DATA_REPRESENT` (+ `G9_GROUPED_DATA`).
- G9 Numbers / Integers → taught G6–G8.
- G9 Measurements / Time, Distance & Speed → `G7_SPEED`.
- G9 Geometry / Coordinates & Graphs → `G8_COORDINATES`, `G8_LINEAR_GRAPHS`.

If we later add explicit spiral/review nodes, these become tagging tasks — not new content.

---

## DONE this pass — zero-authoring scope fixes

Basic **logarithms** and **matrices** already existed as Senior-School skills but were untagged.
CBC teaches both in **Grade 9**, so they now carry a cross-grade CBC Grade-9 tag (same pattern as
integers/squares) and surface in the CBC Grade 9 view; no Cambridge tag (both are IGCSE+):

- `G10_LOGARITHMS_INTRO`, `G10_LOG_LAWS` → CBC G9 Numbers / Indices and Logarithms.
- `G11_MATRICES_INTRO`, `G11_MATRICES_OPS` → CBC G9 Algebra / Matrices. (`G11_MATRICES_INVERSE`
  left Senior — determinant/inverse are not CBC Grade 9.)

This closes the two largest CBC Grade-9 sub-strand gaps without writing any new skills.

---

## P1 — true authoring gaps (no skill anywhere in the graph)

These CBC sub-strands have **zero** covering skill at any grade. Real content to author.

| # | Topic | CBC placement | Lessons | Notes |
|---|---|---|---|---|
| 1 | **Temperature** | G7 Measurements | 6 | Read thermometers; °C; temperature **change/difference** using integers (bridges to G6/G7 integer add/sub). Small, self-contained. Likely 1–2 skills: `G7_TEMPERATURE_READ`, `G7_TEMPERATURE_CHANGE`. |
| 2 | **Approximations & Errors** | G9 Measurements | 5 | Rounding to s.f./d.p., estimation, **absolute/relative error & percentage error**, error bounds. No dedicated rounding-as-topic skill exists. 1–2 skills; pre = decimals + percentages. Maps to Cambridge `9Np`-rounding too (could be in-scope for Cambridge). |

Recommend doing P1 first — it's the only work that changes what the graph can *teach*, and both are
small, low-prerequisite topics.

---

## P2 — depth/breadth gaps (concept exists; CBC strand weights it far heavier)

The skill exists but CBC devotes many more lessons than our single node represents. Authoring here is
about **competency/real-life breadth**, which CBC emphasises and our procedural graph under-models.

| # | Area | CBC weight | Current coverage | Gap |
|---|---|---|---|---|
| 3 | **Money / financial literacy** | G7 14 + G8 9 + G9 7 lessons | `G7_PERCENTAGES`, `G8_PROFIT_LOSS`, `G8_SIMPLE_INTEREST`, `G9_COMPOUND_INTEREST`, `G9_COMMERCIAL_ARITH` | Budgets, bills/utilities, taxes (PAYE/VAT), bank statements, mobile-money transactions — the contextual financial-literacy framing CBC centres on. |
| 4 | **Geometrical Constructions** | G7 12 + G8 12 lessons | `G9_CONSTRUCTION`, `G9_LOCI` (tagged G8) | Perpendicular/angle bisectors, constructing specific angles (60/90/45/30), triangles from given data, regular polygons. G7 construction practice currently absent. |
| 5 | **Scale Drawing** | G8 14 + G9 14 lessons | `G9_BEARINGS` only | Scale factor, maps & plans, representative fraction, area scale; bearings is just one slice. |

---

## P3 — Cambridge enrichment authoring (optional, deferred)

Cambridge Lower Secondary is fully tagged; 22 skills sit **outside** Stage 7–9 (flagged enrichment).
No work is required for fidelity — they already render with the enrichment badge. P3 only applies if
we decide to *teach* beyond Cambridge LS in the Cambridge view (e.g. for stretch learners). Topics:
trig ratios, all quadratics, functions, loci, circle theorems, simultaneous equations, surd
operations, scatter plots, number bases, cones/spheres mensuration. **Recommend: leave deferred.**

Conversely, a few Cambridge `As` (sequences/functions/graphs) and `Gp` (transformations) objectives
are thinner in our graph than the framework lists; if Cambridge becomes the primary view, audit `As`
and `Gp` for stage-level completeness.

---

## Suggested order

1. **P1** (Temperature, Approximations & Errors) — only true "can't teach it today" gaps; both small.
2. **SME sign-off pass** on the existing CBC + Cambridge tags (judgement calls: bearings, scatter
   plots, surface-area placements, the stage-only Cambridge geometry codes).
3. **P2** money/constructions/scale-drawing breadth — larger, aligns the graph with CBC's
   competency framing.
4. **P3** only if a product decision calls for teaching beyond Cambridge LS.

---

## P1b — Upper primary breadth (Grades 4 & 5), opened 2026-10-14

Grades 1–6 had no KICD contract test. `tests/curriculum.test.mjs` now covers Grades 4 and 5 against
`docs/curriculum-sources/KICD-Grade{4,5}-Mathematics-Curriculum-Design.pdf`, and both grades cover
all **19** of their sub-strands. Two faults it found on the way in are already fixed: Grade 4 had no
skill behind **2.4 Capacity** (6 lessons), and `G6_BODMAS_BASIC` claimed a Grade 5 sub-strand called
"Combined Operations", which the design does not have — combined operations is outcome (d) inside
1.5 Division.

The thin-coverage rule the Junior School grades carry (a sub-strand of ≥12 lessons needs ≥2 skills
behind it) was initially left off for Grades 4–5, because switching it on would have asserted a
content decision rather than a syllabus fact. The decision has since been taken and the work done,
so the rule is now on for all five graded years. What it used to flag:

**This section is now closed, and the thin-coverage rule is asserted for Grades 4 and 5 too**
(`tests/curriculum.test.mjs`), so it cannot quietly come back.

**Grade 4 Whole Numbers is now closed** (20 lessons, 6 skills). Read against the design's own
outcome list, nine of its ten outcomes had no skill at all — only (a) place and total value did.
The rest are now authored: `G4_NUMBER_WORDS` (b, c — reading and writing numbers in symbols to
10,000 and in words to 1,000), `G4_ORDER_ROUND` (d, e — ordering to 1,000 and rounding to the
nearest ten), `G4_FACTORS_MULTIPLES` (f, g — factors to 50, multiples to 100), `G4_ODD_EVEN`
(h, i — even and odd to 100 and the patterns made from them) and `G4_ROMAN_NUMERALS` (j).

Rounding deserves its own note. The design asks for it twice — Grade 4 to the nearest ten (1.1e)
and Grade 5 to the nearest hundred and thousand (1.1d) — and it did not exist anywhere in the graph
below `G7_ROUNDING_WHOLE`. A CBC learner met rounding three years after the syllabus introduces it.
`G4_ORDER_ROUND` and the new `G5_ROUNDING` close that.

Grade 5's three twelve-lesson measurement sub-strands each carried one skill with a 3–4 rung KP
ladder, so the *content* was broader than the skill count suggested and the fix was splitting rather
than authoring more. Each is now split on the seam the design itself uses — KICD lists outcomes
(a)–(e) as the unit and converting between units, and (f)–(i) as the four operations on it:

| Was | Is now |
|---|---|
| `G5_LENGTH` | `G5_LENGTH` (m, cm, km and conversions) + `G5_LENGTH_OPS` |
| `G5_CAPACITY` | `G5_CAPACITY` (l, ml and conversions) + `G5_CAPACITY_OPS` |
| `G5_MASS` | `G5_MASS` (g, kg and conversions) + `G5_MASS_OPS` |

This is worth more than a tidier count. Converting 764 cm to metres and subtracting 2 m 94 cm from
6 m 14 cm are different competencies that fail for different reasons, and behind one node they shared
a single mastery number: a learner fluent at conversion but lost in the subtraction read as half-way
through "Length", and the review scheduler could not bring back the half they were actually missing.
All six score 100 at the gate.

Also noted, not a gap: `G5_TRIANGLES_INTRO` has content but **no** CBC tag, correctly — Grade 5
Geometry in the design is only 3.1 Lines, 3.2 Angles and 3.3 Three Dimension (3-D) Objects. Triangles
enter the KICD sequence later, so the skill is enrichment at Grade 5 and must not be counted as
Grade 5 coursework. Grades 1, 2, 3 and 6 still have no contract test.
