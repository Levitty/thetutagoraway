# HOREB — the Tutagora adaptive mastery engine

**HOREB** is the learning engine behind Tutagora: an adaptive, mastery-based
tutor that measures what each student actually knows, rebuilds shaky
foundations, and lets strong students run as far as their curiosity takes them —
with **no grade ceiling**. It is sold to schools (≈50 KSh/student/term) as a
teaching assistant: it gives a teacher a precise, per-student view of every
child's level, so teaching can be targeted instead of one-size-fits-all.

Design lineage: *The Math Academy Way* (knowledge graph + mastery learning +
spaced repetition), made genuinely adaptive with a Bayesian measurement core and
— the next big step — a **closed data loop so HOREB gets smarter the more it is
used**.

---

## 1. Architecture at a glance

```
                    ┌─────────────────────────────────────────┐
   Student (React)  │  AIMastery.jsx  ·  TeacherDashboard.jsx  │
   Teacher (React)  └───────────────┬─────────────────────────┘
                                    │  engineClient.js (bridge, graceful fallback)
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │  HOREB engine (Python)  —  engine/tutagora_engine/      │
        │   graph · mastery (BKT+forgetting) · state (FIRe) ·     │
        │   diagnostic · scheduler · ability      server.py (API) │
        └───────────────┬───────────────────────────┬────────────┘
                        │ shares ONE curriculum      │ (Phase 3) reads calibrated params
                        ▼                            ▼
            engine/data/*_graph.json        params store  ◄── calibration jobs ◄── telemetry
            (exported from JS graphs)        (versioned)        (Python, offline)     (response events)
```

- **Curriculum is one source of truth:** the JS knowledge graph is exported to
  JSON (`node engine/scripts/export_graph.mjs`) and loaded by Python, so UI and
  engine never disagree about the tree.
- **Content** (problems) lives in JS (`src/ai-tutor/content/`) so the UI renders
  it; the engine decides *which* skill/difficulty, the content provides the item.
- **Hybrid by design:** if the Python engine is unreachable (e.g. not yet
  deployed), the JS engine takes over. Nothing breaks.

---

## 2. Where we are — status

### ✅ Done

| Area | What exists |
|---|---|
| **Measurement core** | BKT probability-of-mastery per skill + forgetting curve (effective mastery = belief × retrievability). 15 tests. |
| **Diagnostic** | Adaptive placement with credit propagation; frontier-targeted question selection. |
| **Scheduler** | remediate → review → learn → stretch; guarantees a "reach" item (no ceiling). |
| **Ability / level** | Continuous per-strand level (IRT-lite) + confidence; the teacher-facing number. Untouched strands correctly read "not assessed". |
| **API** | Stateless HTTP server (stdlib, zero-install), deploy-ready (`Dockerfile`, env PORT). |
| **App integration** | `engineClient.js` bridge with availability detection + JS fallback; student home shows engine level + plan. |
| **Teacher dashboard** | Class roster, per-student level/strands, ⚡/⚠️ flags; classes + RLS migration; create-class / join-class UI. |
| **Content system** | Pedagogical schema (worked example + scaffolded steps + hint ladder + misconception feedback + variety + verify hook); quality gate that **independently verifies answers**. |
| **Symbolic layer** | Mini-CAS (expression trees, evaluate, differentiate) powering the hard calculus with verified numeric answers. |
| **Authored content** | **44 skills, all gate-verified** — Algebra spine G6→G12 (27) + Fractions/Number G5→G7 (17). |
| **Curriculum graph** | 200 math skills G5–12 (+ ACCA AFM 87, APM 80). Structurally clean (no broken refs/cycles). |
| **Audits** | Content audit + graph-integrity audit scripts. |
| **Telemetry + calibration loop** | `response_events` table (+RLS), fire-and-forget client logging on every answer (diagnostic/practice/review), engine `/event` ingest, and `calibrate.py` (events → per-skill difficulty + BKT slip/guess + content-health flags). Engine loads calibrated `params.vN.json` and prefers them over heuristics; preview-by-default, `--commit` to ship. **The data loop is closed end-to-end.** |

### 🟡 Partial / needs work

| Area | Gap |
|---|---|
| **Content coverage** | 44/200 math skills authored to the bar (worked examples/steps at 31%). The rest still use legacy generators (correct but thin). |
| **Curriculum graph** | Enriched (2026-06-16): orphaned skills 2→0; Algebra now starts at G5 (added G5_PATTERNS, G5_MISSING_NUMBER + content); thickened prerequisites on circle-theorems/grouped-data/construction/density/speed. 202 skills, avg 1.59 prereqs. Most remaining "grade jumps" are legitimate foundational links, not errors — data-driven prerequisite validation (Phase 3) will refine the rest. |
| **Engine as source of truth** | Telemetry now captures every event (✅) and calibration consumes them (✅). Remaining sub-piece: per-student BKT state isn't yet the *canonical* persisted record (UI still keeps its progress shape; brain re-derives). Finishing this is coupled to deployment (item 4). |
| **Deployment** | Python engine not yet hosted; set `VITE_ENGINE_URL` to a deployed instance. |

### ❌ Not started

- **HOREB learns from data** (the adaptive loop) — see §3. *This is the headline next phase.*
- Graph/visual answer mode (for graph-based skills).
- Other subjects authored to the content bar (AFM/APM only have legacy generators).
- Productization: auth/roles hardening, billing, analytics, scale.

---

## 3. Phase 3 — "HOREB learns": the closed data loop  ⭐ NEXT BIG THING

Today HOREB is adaptive *per student in the moment* (BKT updates live). It is not
yet adaptive *across students over time* — its parameters (difficulty, slip,
guess, learning/forgetting rates, even the prerequisite edges) are sensible
**priors**, not learned from real performance. The goal of Phase 3 is to make
HOREB **improve automatically as more students use it**.

The principle: **capture every interaction → recalibrate offline → feed better
parameters back into the live engine → measure that predictions improved →
repeat.** Heuristics are the cold-start; data refines them.

### 3.1 Telemetry (capture)  ✅ DONE
- `response_events` table (+RLS) — `supabase/migrations/20260617_response_events.sql`.
- Fire-and-forget client logging on every answer — `src/ai-tutor/telemetry.js`,
  wired into diagnostic / practice / review paths.
- `/event` ingest endpoint on the engine (self-hosted sink).
- Privacy: pseudonymous student ids; aligns with the DPA work already started.

### 3.2 Calibration jobs (Python, scheduled/offline)
Each job needs a minimum sample size and ships only if it **beats the current
params on held-out data**.

| Job | Learns | Method |
|---|---|---|
| **BKT fit** | per-skill `p_L0, p_T, p_slip, p_guess` | EM / empirical estimates from response sequences |
| **Difficulty (IRT)** | real skill/item difficulty `b` (replaces grade+weight heuristic) | 1-PL/2-PL item calibration |
| **Forgetting fit** | per-skill (and per-student) memory stability / optimal review intervals | survival fit on review outcomes (FSRS-style) |
| **Prerequisite validation** | which graph edges are real (add missing, flag wrong) | does mastery of A predict success on B? (conditional lift) |
| **Content health** | which problem types are too easy/hard, ambiguous, low-discrimination | p(correct), discrimination, time, post-mastery error rate → flags to the quality gate |

### 3.3 Parameter store + safety
- Versioned `params.vN.json` the engine loads at startup (skill params, item
  difficulties, intervals). Heuristic defaults for any skill below the data
  threshold.
- A/B + shadow eval + one-click rollback. Never auto-ship a regression.

### 3.4 Evaluation (did it actually get smarter?)
- Headline metric: **next-response prediction AUC/log-loss** on held-out data
  (does HOREB predict whether a student gets the next question right?).
- Secondary: time-to-mastery, review efficiency, placement accuracy vs teacher
  judgement, retention at spaced checks.

### 3.5 Personalization (per-student adaptation)
- Already: per-student `learning_speed`. Extend to per-student **forgetting
  rate** and **optimal challenge level** (keep each child in their zone).
- Later (long horizon): **teaching-policy optimization** — learn which
  remediation/sequencing choices maximise learning gain (contextual bandit /
  offline RL over scheduler decisions).

**Dependency:** 3.x needs the engine to be the **system of record for events**
(see the "engine as source of truth" gap). First concrete step of Phase 3 is
wiring `/event` + the table, even before any calibration runs.

---

## 4. Phase 4 — Curriculum & content completion

- **Author the rest of the math tree to the bar** (worked examples + steps +
  verified variety). Reuse the builder pattern; extend builders for: decimals,
  percentages (change/profit/interest), indices, surds, ratio, integers,
  remaining algebra (simultaneous, polynomial remainder, limits,
  area-under-curve).
- **Graph/visual answer mode** — ARCHITECTURE BUILT (`src/ai-tutor/content/visual.js`
  + `PointPlotterVisual` widget): a problem carries a `visual` spec, the student's
  interaction is the answer (`checkVisualAnswer`), with a text-coordinate fallback
  so the diagnostic/gate still work. First skills live (coordinates,
  reflect/translate). EXTEND with more widget/`check` types: plot-a-line (linear/
  quadratic graphs — exploratory widgets already exist, need answer-mode wiring),
  read-graph-value, drag-shape, angle-by-rotation.
- **Enrich the learning tree:** insert the missing intermediate skills that
  cause the 22 grade-jumps; add G5 algebra readiness; thicken thin prerequisites
  so gap-detection and FIRe credit are precise. (Phase 3's prerequisite
  validation will *tell us* where the tree is wrong — the two phases reinforce.)
- **Other subjects** (sciences, languages, and the ACCA verticals) authored to
  the same bar, each gated.

---

## 5. Phase 5 — Productization

- **Deploy HOREB** (host the engine, set `VITE_ENGINE_URL`, lock CORS to the
  site origin; upgrade stdlib server → FastAPI/uvicorn if traffic warrants).
- **Teacher dashboard v2:** per-class picker, remove/move students, printable
  reports, class-level gap heatmap, alerts ("5 students stuck on fractions").
- **Auth/roles, billing per student/term, school onboarding.**
- **Scale & ops:** monitoring, the params pipeline on a schedule, data
  retention/DPA compliance.

---

## 6. Sequenced "what's left" (recommended order)

1. **Phase 3.1 telemetry** — start logging events now; data compounds while we
   build everything else. *(low effort, high future payoff)*
2. **Finish high-value content** (Phase 4 content) — decimals/percentages/indices
   + remaining algebra; biggest immediate learning-outcome lift.
3. **Deploy HOREB** (Phase 5 deploy) — so the real engine runs in production and
   telemetry is real.
4. **First calibration jobs** (Phase 3.2–3.4) — BKT fit + difficulty + content
   health, once enough events exist.
5. **Graph enrichment + visual mode** (Phase 4) — guided by prerequisite
   validation.
6. **Personalization + teaching-policy optimization** (Phase 3.5) — the
   long-horizon moat.
7. **Productization hardening** (Phase 5).

---

## 7. Open decisions

- **Rename to HOREB in code?** The engine package is currently
  `engine/tutagora_engine/`. We can rename to `horeb/` and brand the API — say
  the word and it's a mechanical refactor.
- **When does calibration "turn on"?** Pick the minimum events-per-skill
  threshold before learned params override heuristics (proposal: ~200
  responses/skill, ship only on held-out improvement).
- **How much personalization vs shared model?** Start shared (one calibrated
  model) + light per-student params; add deeper personalization once data depth
  supports it.

---

## File map (quick reference)

- Engine: `engine/tutagora_engine/{graph,mastery,state,diagnostic,scheduler,ability}.py`
- API + ops: `engine/server.py`, `engine/Dockerfile`, `engine/demo.py`, `engine/tests/`
- Curriculum data: `engine/data/*_graph.json` (regen: `engine/scripts/export_graph.mjs`)
- Quality/audit: `engine/scripts/{quality_gate,audit_content}.mjs`, `engine/scripts/audit_graph.py`
- Bridge + UI: `src/ai-tutor/engineClient.js`, `AIMastery.jsx`, `TeacherDashboard.jsx`
- Content: `src/ai-tutor/content/{schema,symbolic,algebra,calculus,fractions,index}.js`
- Roster DB: `supabase/migrations/20260615_classes_roster.sql`
