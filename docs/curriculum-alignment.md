# Curriculum Alignment — CBC/CBE + Cambridge (Junior / Lower Secondary Math)

Status: planning + research reference. No engine code changed yet.

## Decisions locked
1. **British board = Cambridge** (Cambridge Lower Secondary Mathematics 0862). Edexcel deferred.
2. **Scope = Junior only** — CBC/CBE **Grade 7–9** ⇄ Cambridge **Stages 7–9**. (Senior School / IGCSE deferred.)
3. **Out-of-scope topics are labelled "enrichment", not hidden.** A skill that is in the existing
   graph but not in the active syllabus' Grade 7–9 scope (e.g. matrices, loci, bearings) shows with
   an "enrichment" badge rather than disappearing.
4. **Sources:** gathered as much public structure as possible below; granular outcome codes still
   need the official PDFs (KICD designs + Cambridge 0862 framework), being gathered in parallel.

---

## Important accuracy note on "codes"
- **Cambridge 0862 uses real objective codes**: `<stage><sub-strand>.<nn>` — e.g. `7Np.01`, `8Ae.03`,
  `9Gg.05`. These are stable and citable.
- **CBC/CBE (KICD) does NOT use a formal code system.** A design is structured as
  **Strand → Sub-strand → Specific Learning Outcomes** (lettered a, b, c…), plus Suggested Learning
  Experiences, Key Inquiry Questions, Core Competencies, Values, PCIs (Pertinent & Contemporary
  Issues) and an Assessment Rubric. So our CBC tag stores `{strand, substrand, grade, outcomeRefs[]}`
  where `outcomeRefs` are our own stable ids pointing at SLO text we transcribe from the design.
  (Earlier I floated invented codes like `MAT.07.1.3` — that was illustrative only; KICD has none.)

---

## CBC/CBE Junior School Mathematics — strands & sub-strands (Grade 7–9)

Five strands across the grade band: **Numbers, Algebra, Measurements, Geometry, Data Handling & Probability.**
Confidence: strand/sub-strand names HIGH; exact per-grade placement MEDIUM until verified against the
official KICD design PDFs.

### Grade 7 — CONFIRMED against the official KICD design (HIGH)
Source: `docs/curriculum-sources/KICD-Grade7-Mathematics-Curriculum-Design.pdf` (150 lessons).
| Strand | Sub-strands (lessons) |
|---|---|
| 1.0 Numbers | Whole Numbers (20) · Factors (7) · Fractions (9) · Decimals (6) · Squares & Square Roots (5) |
| 2.0 Algebra | Algebraic Expressions (5) · Linear Equations (6) · Linear Inequalities (8) |
| 3.0 Measurements | Pythagorean Relationship (4) · Length (6) · Area (8) · Volume & Capacity (8) · Time, Distance & Speed (8) · Temperature (6) · Money (14) |
| 4.0 Geometry | Angles (8) · Geometrical Constructions (12) |
| 5.0 Data Handling & Probability | Data Handling (10) |

Key facts that corrected the provisional tags:
- **No Integers and no standalone Percentages sub-strand in Grade 7.** Integers are a Grade 8
  topic; percentages are taught inside the **Money** sub-strand (discount, profit/loss).
- **Perimeter and circumference live under Length** (not Area).
- **Pythagorean Relationship is filed under Measurements**, not Geometry.
- **Reciprocals are in Grade 7** (Fractions).

CBC Grade 7 content gaps in our graph (no skill yet → to author): **Temperature, Angles,
Geometrical Constructions** (and the financial-literacy breadth of the 14-lesson Money sub-strand).

### Grade 8 (extends Grade 7)
| Strand | Sub-strands (to verify) |
|---|---|
| Numbers | Integers · Cubes & Cube Roots · Reciprocals · Indices & Logarithms · Rates, Ratio, Proportion & Percentages |
| Algebra | Algebraic Expressions · Linear Equations · Linear Inequalities |
| Measurements | Area · Volume & Capacity · Money (commercial) · Time, Distance & Speed · Temperature |
| Geometry | Geometrical Constructions · Coordinates & Graphs · Scale Drawing |
| Data Handling & Probability | Data Handling · Probability (introduction) |

### Grade 9 (extends Grade 8)
| Strand | Sub-strands (to verify) |
|---|---|
| Numbers | Integers · Indices & Logarithms · Compound Proportions & Rates of Work · Approximations & Errors |
| Algebra | Matrices · Equations of Straight Lines · Quadratic Expressions & Equations · Simultaneous (linear) · Inequalities |
| Measurements | Area (triangle, part of circle) · Surface Area of Solids · Volume & Capacity |
| Geometry | Coordinates & Graphs · Scale Drawing · Similarity & Enlargement · Circle geometry · Constructions |
| Data Handling & Probability | Data Handling (mean/median/mode, range) · Probability |

> General Grade-7 learning outcomes (verbatim themes from KICD): represent & apply algebraic
> expressions; apply measurement to real contexts; **use money / carry out financial transactions**;
> generate geometric shapes & describe spatial relationships; collect & organise data to solve problems.
> These confirm CBC's competency/real-life framing that our current procedural-skill graph does not model.

---

## Cambridge Lower Secondary Mathematics 0862 — strands & sub-strands (Stages 7–9)

Four content strands + a cross-cutting process strand. Confidence: HIGH (official framework structure).

| Strand | Sub-strand code | Sub-strand |
|---|---|---|
| Number | `Np` | Place value, ordering and rounding |
| Number | `Ni` | Integers, powers and roots |
| Number | `Nf` | Fractions, decimals, percentages, ratio and proportion |
| Algebra | `Ae` | Expressions, equations and formulae |
| Algebra | `As` | Sequences, functions and graphs |
| Geometry & Measure | `Gg` | Geometrical reasoning, shapes and measurements |
| Geometry & Measure | `Gp` | Position and transformation |
| Statistics & Probability | `Ss` | Statistics |
| Statistics & Probability | `Sp` | Probability |

- **Objective code form:** `<stage><sub-strand>.<nn>` → `7Ni.03`, `8As.02`, `9Gg.07`.
- **Thinking and Working Mathematically (TWM)** runs across all stages: Specialising, Generalising,
  Conjecturing, Convincing, Characterising, Classifying, Critiquing, Improving. (Process, not content —
  maps to *how* problems/hints are framed, not to new skills.)

---

## How the two relate (and to our existing graph)

- Our current math graph (`src/ai-tutor/knowledgeGraph.js`, 207 skills, strands
  Numbers/Algebra/Geometry/Measurements/Statistics) already lines up **structurally** with both —
  CBC and Cambridge share essentially the same strand decomposition at this band.
- **CBC Grade 7–9 ≈ Cambridge Stage 7–9** in age, but **scope differs**:
  - CBC pushes some topics earlier/harder (Pythagoras in G7; indices & logarithms, matrices,
    quadratics by G9) — closer to the old 8-4-4/KCSE scope.
  - Cambridge Stage 7–9 keeps logarithms, matrices, formal quadratics for IGCSE (Stage 10+),
    and emphasises sequences/functions/graphs (`As`) and transformations (`Gp`) earlier.
- Therefore many existing graph skills will be **in-scope for CBC but "enrichment" for Cambridge**
  at this band (matrices, logs, loci, bearings). The label-not-hide rule (decision 3) handles this.

---

## Data model for the curriculum dimension (Phase 1)

Extend the `skill()` builder with an optional overlay. Single source of truth per skill; multiple
syllabus tags.

```
curricula: {
  cbc: {
    grade: 7,                    // 7 | 8 | 9 (or null if out of junior scope)
    strand: 'Measurements',
    substrand: 'Pythagorean Relationship',
    outcomeRefs: ['cbc.g7.mea.pythagoras.a'],   // our ids -> transcribed SLO text
    inScope: true,
  },
  cambridge: {
    stage: 8,                    // 7 | 8 | 9 (or null if out of stage 7-9 scope)
    strand: 'Geometry and Measure',
    substrand: 'Gg',
    refs: ['8Gg.06'],            // real Cambridge objective codes
    inScope: true,
  },
}
```

- A `curricula.js` registry declares, per curriculum: grade/stage bands, strand list, sub-strand
  taxonomy, labels (mirrors how `subjects.js` already declares `grades`/`strands`/`gradeLabel`).
- A skill with `inScope: false` (or no tag) for the active curriculum renders with an **enrichment**
  badge instead of being filtered out.

---

## Phase 1 — engineering plan (file by file)

Goal: same content, switchable CBC ⇄ Cambridge view with correct grade/stage + strand labels and
gap analysis. No fidelity content yet — just the rails. Est. 3–4 days.

1. **`src/ai-tutor/curricula.js` (new)** — curriculum registry: `CURRICULA = { cbc, cambridge }`,
   each with `{ id, name, bandLabel, bands:[7,8,9], strands:[...], substrands:{...}, labelFor(skill) }`.
2. **`src/ai-tutor/knowledgeGraph.js`** — extend `skill()` to accept `opts.curricula`; pass through
   onto the skill object. (Tags themselves are filled in Phase 2/3, not now.)
3. **`src/ai-tutor/subjects.js`** — add `curricula: ['cbc','cambridge']` to the `math` subject so the
   selector knows which views exist.
4. **`src/ai-tutor/adaptiveEngine.js`** — make grade/strand readers curriculum-aware:
   `getGradeStats`, `getStrandStats`, `getEstimatedGradeLevel`, `getByGrade`, diagnostic skill
   selection, gap-finding read grade/strand from `skill.curricula[active]` with fallback to the
   legacy `skill.grade`/`skill.strand`.
5. **`src/ai-tutor/AIMastery.jsx`** — add active-curriculum state + a selector in the UI; thread it
   through `ctx`; render an **"enrichment"** badge where `curricula[active].inScope === false`;
   use band/strand labels from the registry.
6. **`src/ai-tutor/progressStore.js`** — persist the chosen curriculum alongside subject (the
   per-subject storage-key work already done makes this a one-field add).

Backward-compatible: with no tags present, the active view falls back to today's behaviour.

## Phase 2 — CBC/CBE math tagging (content + SME)
Transcribe the KICD Grade 7–9 design SLOs; tag all in-band skills `curricula.cbc`; flag KCSE-scope
skills as enrichment; fill CBC gaps (constructions, money/financial literacy framing, contextual
tasks). Educator review. Est. ~1d eng + 5–8d content.

## Phase 3 — Cambridge math tagging (content + SME)
Tag skills to 0862 `7–9` objective codes; map Stage bands into the engine; author Stage-7–9 gaps
(set/function notation, sequences/functions/graphs `As`, transformations `Gp`, standard form).
Educator review. Est. ~1d eng + 6–10d content.

---

## Open items — needs the official source documents
- ✅ **KICD CBC/CBE Grade 7 Mathematics design** — received and applied
  (`docs/curriculum-sources/`); all Grade 7 skills now CBC-tagged from it.
- **KICD CBC/CBE Mathematics designs, Grade 8 & 9** (PDF) — to confirm per-grade sub-strand
  placement (e.g. the Integers / Reciprocals / Percentages homes) and transcribe Specific
  Learning Outcomes.
- **Cambridge 0862 Lower Secondary Mathematics Curriculum Framework 2020** (PDF) — for the full
  objective list per code (`7Np.01` … `9Sp.xx`). Official copy via Cambridge International support site.
- An **educator/SME** to sign off the CBC and Cambridge tagging before we claim "aligned".

## Sources consulted
- Cambridge 0862 framework (official PDF, structure): cambridgeinternational.org / framework PDF.
- Cambridge Lower Secondary Mathematics guide: cambridge-community.org.uk.
- KICD curriculum designs portal: kicd.ac.ke.
- CBC Grade 7/8/9 mathematics structure summaries: cbcedukenya.com, teacherske.co.ke, eduguide.co.ke,
  cbcresources.co.ke (sub-strand/topic listings).
