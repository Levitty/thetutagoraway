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

## P1 — true authoring gaps ✅ DONE (2026-07-29)

Both P1 sub-strands are now covered — 4 new skills, all authored to the structured content bar
(worked example + steps + 3-hint ladder + misconceptions + independently verified answers, 100/100
on the quality gate) in `content/measurement.js`:

| # | Topic | Skills added | Notes |
|---|---|---|---|
| 1 | **Temperature** (G7 Measurements, 6 lessons) | `G7_TEMPERATURE_READ`, `G7_TEMPERATURE_CHANGE` | Per the KICD G7 design: compare temperature conditions, °C & K units and **°C↔K conversion** (K = °C + 273), temperature rise/fall/difference across zero (pre: G6 integers). CBC-only tag (not a Cambridge Lower Secondary topic). |
| 2 | **Approximations & Errors** (G9 Measurements, 5 lessons) | `G9_ROUNDING`, `G9_ERRORS` | Rounding to d.p./s.f., estimation by rounding to 1 s.f.; absolute error, percentage error (error ÷ **actual** × 100, as in the KICD design), upper/lower bounds. Cambridge tags: `8Np.02` (s.f. rounding), `9Np.02` (limits). |

Graph impact: math graph 202 → 206 skills; 0 broken refs / cycles / isolated nodes.

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
