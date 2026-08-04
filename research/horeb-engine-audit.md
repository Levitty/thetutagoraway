# Horeb Adaptive Engine — Gap Analysis & Implementation Plan

**Audit against:** *Horeb Adaptive Maths Engine — Target Specification & Assessment Brief* (Isaac Kimathi, Tutagora Ltd)
**By:** Claude Code — grades are from reading the code, not the intent. Evidence cites real files/functions.
**Date:** 4 Aug 2026
**Codebase root:** `src/ai-tutor/`

## Method & headline

Every requirement below was checked against the actual source. The one finding
that reframes the whole thing, stated first as the brief demands:

> **Layer B (the engine) is the strongest part of Horeb, not the weakest.** B1–B7
> are substantially Present. The real gaps are in **Layer A** (no general
> stepped-question model; misconception feedback is computed and arithmetic-only,
> not authored per-problem) and in **Content authoring (C1/C2)** — which is the
> true critical path, not the stepped model itself.

Effort key: **S** ≤ ~2 days · **M** ~1 week · **L** multi-week / ongoing.

---

## Deliverable 1 — Gap-analysis table

### Layer A — stepped-question interaction

| Req | Requirement | Status | Evidence (file · function) | Consequence if unaddressed | Effort |
|----|----|----|----|----|----|
| A1 | Multi-step question data model | **Absent** (general) | `problemGenerators.js#generateProblem` (:1546) returns `{question, answer, hint}`; no generator emits `steps`. Special-case scaffolds only: `ColumnAddition`, `AreaModel`, faded worked examples | No structural diagnosis of *which step* broke; feedback limited to final answer | **L** (question-bank architecture change) |
| A2 | Per-step exact-match answers | **Present** (final answer) | `answerCheck.js#checkAnswerMatch` + `normalizeMath` (:11), `mathValue` (:33) — normalized exact match, numeric/token | — | S |
| A3 | Authored misconception maps | **Partial** | `remediation.js#diagnoseError` (:132) — *computed* diagnoses, and only for skills `parseArithmetic` (:20) can read (+, −, ×, ÷). Non-arithmetic skills fall through to generic | Feedback feels intelligent only on basic arithmetic; fractions/algebra/geometry get bare nudges | **L** (authoring, per §C1) |
| A4 | Generic fallback feedback | **Present** | `remediation.js#genericNudge`; `diagnoseError` returns `null` → generic | — | — |
| A5 | Correct-step reveals next; result feeds engine | **Partial** | Worked-example scaffold reveals support and the *final* answer feeds Layer B; no per-step reveal because there are no steps (see A1) | Step-level signal for mastery doesn't exist yet | **M** (depends on A1) |
| A6 | Inputs constrained (no SymPy trap) | **Present** | `answerCheck.js` normalizes strings (currency, commas, `x=`, "remainder", light `2*x→2x`); no symbolic engine | Watch: `normalizeMath` must not grow into freeform algebra (would become D2) | S (guardrail) |
| A7 | No over-stepping of atomic skills | **Present / good** | Single-answer model means atomic skills take one input; stepping not forced | — | — |

### Layer B — the adaptive engine

| Req | Requirement | Status | Evidence (file · function) | Consequence if unaddressed | Effort |
|----|----|----|----|----|----|
| B1 | Prerequisite knowledge graph | **Present** | `knowledgeGraph.js#skill()` (:16) — `prerequisites` (:21), `critical`, `masteryThreshold` 0.85, `minProblems`, per-curriculum mapping; ~276 skills G1–G12, densely pre-linked; `getPostReqs` (:505), chain (:513). Enforced by `adaptiveEngine.js#prereqsMet` (:39) | — | — |
| B2 | Graded per-skill mastery | **Present** | `progress.skills[id]`: attempts, correct, `mastered`, `repNum`, `learningSpeed`, `consecutiveFailures`; updated in `spacedRepetition.js#processReviewResult` (:44) | — | — |
| B3 | Diagnosis-by-graph, prereq gating | **Present** | `diagnosticEngine.js#propagateCredit` (credit across graph); `remediation.js#getRemediationSkills` routes to missing rung; `prereqsMet` locks dependents | — | — |
| B4 | Spaced-repetition scheduler | **Present** | `spacedRepetition.js` — `BASE_INTERVALS` by `repNum` (:9), `getNextReviewInterval` (:29), FIRe-inspired; `getReviews` surfaces due | — | — |
| B5 | Mastery decay (time-based) | **Partial** *(downgraded after review)* | Review *surfacing* is time-based — `getReviews` (`adaptiveEngine.js:126`) resurfaces a mastered skill when `exp(−daysSince/interval) < 0.6`. But the `mastered` **flag** decays only on failure (`processReviewResult` :73–80, 3 consecutive → `mastered=false`), never on time, and `prereqsMet` reads that boolean. `calculateMemoryStrength` (:14) exists but is reimplemented inline in `getReviews` and gates *reviews*, not *mastery* | A skill mastered months ago and never reviewed stays `mastered:true` and **unlocks dependents on a forgotten foundation** — the graph builds on sand. This is the JS engine's core design limit, not a tuning issue | M |
| B6 | Next-item selection (new ⇄ review) | **Present, with a caveat** | `adaptiveEngine.js#getRecommendedPath` balances gaps + reviews + fluency + frontier (`getNextToLearn`, prereq-gated). **Caveat:** app uses `brainPath \|\| jsPath` — a remote Python "brain" overlays the JS engine when reachable | Two engines can disagree; see Risk | **M** (settle ownership) |
| B7 | Layer A → Layer B feedback loop | **Present** (final-answer) | Answer outcome → `applyImplicitCredits` + `processReviewResult` → mastery + schedule. Once A1 lands, per-step outcomes must feed the same path | Engine is fed; step-grain signal pending A1 | S (extend at A1) |

### Content authoring

| Req | Requirement | Status | Evidence | Consequence if unaddressed | Effort |
|----|----|----|----|----|----|
| C1 | LLM-assisted authoring pipeline (steps + expected + misconceptions) | **Absent** | Problems are produced by hand-written code (`problemGenerators.js` per-skill generators); misconception text is code (`diagnoseError`). No pipeline, no maps-as-data | **The binding constraint.** A stepped model with no authored maps is a slower single-answer box. This decides whether A1/A3 ship | **L** (build the pipeline once, run it per skill) |
| C2 | Content stored as editable data, not in app logic | **Partial** | Graph is semi-structured but lives in JS (`knowledgeGraph.js`); questions are generated in code, not stored as authorable data | Authoring can't scale independently of engineering | **M** |

### B4 / B5 worked example — the actual interval sequence

*Requested and previously missing. This is the real behaviour traced through
`spacedRepetition.js#processReviewResult` and `adaptiveEngine.js#getReviews`,
not a description of intent.*

`BASE_INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240, 365]` days, indexed by `repNum`.
A correct answer adds `1.0 × creditWeight` to `repNum`; `creditWeight` is 1.0 for
a prompt answer and falls to as low as 0.3 when the answer takes more than twice
the expected time (this is the "fractional" in FIRe). The effective gap is
`interval / learningSpeed`, where `learningSpeed` drifts ±0.05/−0.08 per answer
within [0.3, 3.0].

**Five clean successes, prompt answers, `learningSpeed` 1.0:**

| After rep # | `repNum` | Nominal interval | Actually re-surfaces at¹ |
|---|---|---|---|
| mastery | 0 | 1 day | ~0.5 days |
| 1 | 1 | 3 days | ~1.5 days |
| 2 | 2 | 7 days | ~3.6 days |
| 3 | 3 | 14 days | ~7.1 days |
| 4 | 4 | 30 days | ~15.3 days |
| 5 | 5 | 60 days | ~30.6 days |

¹ **The intervals are not the gaps.** `getReviews` surfaces a skill when
`exp(−daysSince / interval) < 0.6`, i.e. at **≈0.51 × the nominal interval**. So
the "7-day" rung actually returns after ~3.6 days. Worth stating plainly because
the ladder reads as a schedule and is not one.

**Then three consecutive failures from `repNum` 5** — the decay is
`1.0 + 0.5 × consecutive_failures`, so it accelerates:

| Miss | Decay applied | `repNum` after | Drops to | `mastered` |
|---|---|---|---|---|
| 1st | −1.0 | 4.0 | 30-day rung | still true |
| 2nd | −1.5 | 2.5 | 7-day rung | still true |
| 3rd | −2.0 | 0.5 | 1-day rung | **set false** |

**What this exposes (the B5 finding).** Every transition in that second table
requires the learner to *show up and fail*. There is no path by which the passage
of time alone moves `mastered` from true to false. A learner who masters a skill
and never returns keeps `mastered: true` indefinitely — and `prereqsMet` reads
that boolean, so dependent skills keep unlocking on a foundation that decayed
long ago. Time-decay exists in the *review queue* and nowhere else.

### ⚠ Live bug found while tracing the above — spaced repetition silently dies on a fractional `repNum`

Writing out the sequence surfaced a defect that no amount of reading the *intent*
would have caught. **Fixed in this pass**; recorded because it changes how much
of B4/B5 was ever actually working.

`repNum` is **fractional by design** — two routine paths produce it:

- a **slow but correct** answer earns partial credit (`creditWeight =
  expectedMs / actualMs`, floored at 0.3) so `repNum += 0.33`, not 1;
- the **second consecutive failure** decays by 1.5.

But all three interval lookups indexed the ladder with that raw value:

```js
BASE_INTERVALS[Math.min(repNum, BASE_INTERVALS.length - 1)]   // repNum = 3.33
```

`BASE_INTERVALS[3.33]` is `undefined` → `undefined / learningSpeed` → `NaN` →
`Math.exp(-days / NaN)` → `NaN` → and the due-check is `memoryStrength < 0.6`,
which for `NaN` is **false**. The skill is never pushed into the review queue.

Reproduced against the real functions (not a re-implementation): a mastered skill
answered *correctly* but at 3× expected time, then left for **400 days**, returned
`calculateMemoryStrength → NaN` and `getReviews() → []`. It would never have come
back. After the fix the same input returns `memoryStrength 0%`, `daysSince 400`,
correctly due.

**Consequence:** the moment a learner was slow on a skill even once — precisely
the signal that the skill is *weak and needs more review* — that skill dropped out
of spaced repetition permanently and silently. No error, no log, just absence.
This affected the retention guarantee that is the entire point of B4/B5, and it
was invisible because a missing review looks identical to a review that isn't due
yet.

**Fix:** land on a real rung before indexing —
`BASE_INTERVALS[clamp(Math.floor(repNum), 0, len-1)]` — applied at all three
sites (`spacedRepetition.js#calculateMemoryStrength`, `#getNextReviewInterval`,
and the duplicated inline copy in `adaptiveEngine.js#getReviews`). Engine and
content suites pass.

**Second-order point for the plan:** that inline copy in `getReviews` is a
*duplicate* of `calculateMemoryStrength` with different clamps (`Math.max(...,1)`
vs `0.5`) and a shorter ladder (8 rungs vs 9). Two implementations of one curve
is how this stayed hidden. Whichever engine ends up authoritative, this belongs
in exactly one place.

### What NOT to build (guard)

| Req | Guard | Status | Evidence |
|----|----|----|----|
| D1 | No handwriting/OCR | **Held (good)** | Not built. Discussed and correctly rejected in favour of structured steps |
| D2 | No freeform symbolic equivalence | **Held (good)** | `answerCheck.js` is light normalization, not SymPy. Keep it that way (see A6) |
| D3 | No open-ended reasoning diagnosis | **Held (good)** | `diagnoseError` is bounded pattern-matching, not open reasoning |

---

## Deliverable 2 — Sequenced implementation plan

### Dependency spine

```
[B6 engine-ownership]  ← settle FIRST (unblocks trustworthy signal)
        │
        ▼
[A1 stepped data model] ──► [A5 per-step reveal] ──► [B7 step→mastery wire]
        │
        ▼
[C2 questions-as-data] ──► [C1 LLM authoring pipeline] ──► [A3 misconception maps at scale]
```

The brief's stated spine (A1 + B1 foundational → B2 → B4–B6) is right *for a
greenfield build*. Horeb isn't greenfield: B1–B7 already exist. So the true
order is **settle the engine, add the stepped surface on top of the working
engine, then invest in authoring** — the reverse emphasis from the brief, because
the engine it worries about is done.

### Recommended first milestone (smallest end-to-end vertical)

**One skill — `solve-linear-two-step` — as a fully stepped question, feeding the
existing engine.** Concretely:

1. Add a `steps[]` shape to the question model for this one skill (A1), each step
   `{prompt, input_prefix, expected_answer, misconception_map, generic_feedback}`.
2. Hand-author the misconception map for that one skill (the demo of what C1 will
   later automate).
3. Reveal-next-on-correct (A5); on completion call the **existing**
   `processReviewResult` / `applyImplicitCredits` so mastery and the next review
   move (B7).
4. Confirm one review is scheduled by `getReviews`.

This validates the whole loop on a real skill before any authoring is scaled, and
it reuses the interaction work already prototyped (the long-division /
multiplication step components built this session are A1–A5 in miniature).
Estimate: **~1 week** once engine-ownership is settled.

### Biggest risk / unknown in the current codebase

**The dual engine.** Horeb runs the JS `adaptiveEngine.js` *and* an optional
remote Python "brain" (`engineClient.js`, `ENGINE_URL`, `getBrainSession`), and
the app selects `brainPath || jsPath` for what the student does next. It is not
settled which is authoritative or whether they stay in sync — and they already
diverged in production (the path reshuffled on every refresh because the two
disagreed and network reachability decided the winner; fixed this session by
pinning the result). **Before Layer A's step outcomes are wired in, this must be
resolved**, or step-grain mastery signal will be written against a moving target
— two masters, no source of truth. This is the single most important thing to
decide before building, and it is architectural.

### Second-order risk

**Authoring throughput (C1).** Even with a clean stepped model, misconception
maps across ~276 skills is the multi-week reality. Prove the LLM-authoring
pipeline on ~5 skills and measure quality before committing to the full graph —
if the maps are shallow, A3's "feels intelligent" promise doesn't land, and
that's the whole reason for Layer A.

---

# Addendum — Engine ownership: where the two engines diverge, and how to settle it

*Requested follow-up. This is the "biggest risk" from B6, mapped to exact code,
with a recommendation. It must be settled before Layer A step-outcomes are wired,
or mastery will be written against a moving target.*

## The two engines

- **JS engine** — `src/ai-tutor/adaptiveEngine.js` + `spacedRepetition.js` +
  `diagnosticEngine.js`. Heuristic: a `mastered` boolean + accuracy + `repNum`,
  FIRe-style fixed intervals, credit propagation. Ships in the bundle; always
  present.
- **Python "brain"** — `engine/tutagora_engine/` (`mastery.py`, `scheduler.py`,
  `ability.py`, `diagnostic.py`), served by `engine/server.py`. Principled:
  4-parameter **BKT** (slip/guess) × **forgetting** (memory stability →
  retrievability), continuous ability, frontier scheduler
  (remediate/review/learn/stretch, `REVIEW_THRESHOLD = 0.75`). Reached over HTTP
  via `engineClient.js`. Deployed at `https://horeb-engine.onrender.com`
  (`.env.production`).

They are two independent implementations of the same job.

## What actually wins today

Only two brain calls are wired into the app — `getBrainProfile` and
`getBrainSession` (`AIMastery.jsx:456–457`). When the brain answers:

| Concern | JS (fallback) | Python brain (when reachable) | Selection point |
|----|----|----|----|
| Next-session sequence | `getRecommendedPath` | `/next-session` recommendations | `path = brainPath \|\| jsPath` (`AIMastery.jsx:1712`) |
| Ability / grade shown | `getEstimatedGradeLevel` | `brainProfile.overall_level` | `AIMastery.jsx:1714` |
| Strand levels, confidence, "accelerated" | JS estimates | `brainProfile.strands / confidence / accelerated` | `:1717,:1726,:1808` |
| Diagnostic | `diagnosticEngine.js` (**runs**) | `/diagnostic/step`, `/diagnostic/finalize` (**dead code — never imported**) | — |
| Mastery state (source of truth) | `progress.skills` (persisted) | derived per-call, **not persisted** | `engineClient.js#skillToState` |

## The three defects that make this unsafe

1. **Authority is decided by the network, per render.** `brainPath || jsPath`
   means the *sequence a student sees flips* depending on whether the brain
   answered within the 1.5 s health-check window (`engineClient.js:23`). The
   Render deployment is a spin-down host: when cold it misses the 1.5 s check →
   JS wins; when warm → Python wins. **This is the exact cause of the
   path-reshuffle bug fixed this session** — the two engines disagreed and
   reachability picked the winner. The displayed *grade level* flips the same way
   (`:1714`).

2. **The brain is stateless and fed through a lossy one-way bridge.**
   `engineClient.js#skillToState` collapses the JS record into a `belief`
   (`mastered → 0.95`, else `correct/attempts`, else prior 0.15). The Python BKT
   then computes a principled belief — and it is thrown away; nothing persists the
   brain's own belief/stability back. So the "real measurement" engine **re-derives
   its beliefs from the crude JS fields on every call** and never accumulates its
   own state. The sophistication (slip/guess, stability) is largely wasted, because
   its inputs are the very heuristic numbers it was meant to replace.

3. **Two mastery models that structurally disagree.** JS: `mastered` boolean +
   fixed FIRe intervals. Python: continuous `effective mastery = BKT × retrievability`.
   They will not agree on "mastered" or "due," so JS-scheduled reviews and
   brain-scheduled reviews differ — and which one a student gets is, again,
   network-dependent.

## Recommendation

**Near-term (do before any Layer A wiring):**

- **Make authority deterministic and single per session.** Decide once, at
  session start, which engine owns sequencing — not per network blink. Concretely:
  probe the brain once; if present, use it for the *whole* session; if not, use JS
  for the whole session. Never mix `brainPath || jsPath` mid-session. This alone
  removes the reshuffle class of bug.
- **Until the brain is stateful (below), demote it to read-only measurement.**
  Let `brainProfile` inform the teacher-facing level/strands, but let **JS own
  what the student does next**, because a consistent heuristic sequence beats a
  sophisticated one that flips. This makes JS the temporary source of truth —
  stated plainly so it's a decision, not a drift.

**Strategic (the real fix, and the right long-term home):**

The Python engine is the correct target — it *is* the Math Academy model the
brief specifies (BKT + forgetting + frontier). But it cannot be authoritative
until three things are true:

1. **It persists its own state.** Store the brain's per-skill belief/stability
   (a `brain_state` blob alongside `progress`), so BKT accumulates instead of
   re-deriving from JS each call. This is the highest-leverage fix — without it
   the brain is theatre.
2. **It's hosted to actually be up** — not a spin-down free tier behind a 1.5 s
   check. Either a warm instance, or raise/rework the availability gate so a cold
   start doesn't silently hand the session to JS.
3. **One diagnostic.** Wire the Python `/diagnostic/*` (currently dead) *or*
   delete it. Running the JS diagnostic while the brain owns sequencing means the
   student is placed by one model and taught by another.

Then **cut over fully**: brain authoritative, JS retired to a genuine offline
fallback (not a co-equal that silently takes over). Running both live, as now, is
the problem.

## What "settled" looks like before Layer A

A single, persisted mastery representation with one owner. Whichever engine wins,
Layer A's per-step outcomes (A5/B7) must update **that** state and no other. Wiring
step outcomes into today's `brainPath || jsPath` split would write the richest new
signal Horeb will ever have into whichever engine the network happened to pick —
the worst possible foundation. Settle ownership first; then build the stepped
vertical on top of it.

---

# ADR-001 — The event log is the system of record; both engines derive from it

**Status:** Proposed · **Date:** 4 Aug 2026 · **Supersedes:** the "first milestone"
in Deliverable 2 (the log now comes before the stepped vertical).

## Context

Two independent engines model the same thing (JS heuristic; Python BKT +
forgetting), and today one silently overrides the other based on network
reachability (`brainPath || jsPath`). Three facts, established from the code,
force the decision:

1. **The Python engine is the correct target** — only it models retention as a
   continuously-decaying, retrievability-gated quantity. The JS engine's boolean
   `mastered` that decays only on failure (see the corrected **B5: Partial**) is a
   *design limit*: it will unlock dependent skills on foundations the student has
   forgotten. You cannot patch that into the JS engine without rebuilding the
   Python one.
2. **BKT is a per-answer model.** It updates on each individual response. The
   current bridge feeds it *aggregates* (`correct/attempts`, `engineClient.js#skillToState`)
   — the wrong shape; you cannot Bayes-update a ratio. The Python engine is
   starved of the input it was built for.
3. **The raw per-answer stream already half-exists** — `response_events`, written
   fire-and-forget by `telemetry.js#logResponse`, capturing `{student, skill,
   correct, time_ms, hints, attempt_no, is_diagnostic, is_review, confidence}`.
   It is used for offline calibration, **not** as the source of truth: the JS
   engine still owns `progress.skills`.

## Decision

1. **`response_events` becomes the system of record.** The raw, append-only log
   of every answered step is the primary record. `progress.skills` (and any
   Python belief state) is demoted to a **derived projection** of the log —
   a rebuildable cache, not the truth.
2. **Each engine implements `deriveState(events) → state`.** The UI reads the
   projection of *one* engine at a time; switching engines is swapping which
   `deriveState` runs, with **no data migration**. This makes the engine choice
   *reversible*.
3. **Target engine: Python.** JS is retained solely as an **offline fallback**
   (derives its own projection from the same log), never as a co-equal that
   silently takes over. The `brainPath || jsPath` mid-session flip is removed —
   authority is chosen once per session, deterministically.
4. **The log is a hard prerequisite to the first stepped vertical** — ahead of the
   stepped model, per the retention argument above.

## The concrete shape of the source-of-truth log

Extend `response_events` from telemetry stream to authoritative event store.

**Columns** (＋ = new vs today):

| Column | Purpose |
|----|----|
| `id` uuid pk | row id |
| `occurred_at` timestamptz | client event time — the **ordering key** |
| `received_at` timestamptz default now() | server arrival (clock-skew guard) |
| ＋ `client_event_id` uuid | **idempotency key** — dedupe retries of the same answer |
| ＋ `session_id` uuid | groups a lesson's events |
| `student_id`, `subject`, `skill_id` | who / what |
| ＋ `question_id` | the problem instance (ties steps together) |
| ＋ `step_id` int null | Layer A step (null = single-answer) |
| ＋ `submitted_value` text | **what the student actually typed** — not just `correct` |
| ＋ `expected_value` text | for reconstructability / re-grading |
| ＋ `matched_misconception` text null | which authored misconception fired (A3) |
| `correct` bool | outcome |
| `time_ms`, `hints_used`, `attempt_no`, `scaffold`, `taps`, `confidence` | existing signals |
| `params_version` text | which engine params were live (for calibration) |

The three that matter most and are **missing today**: `submitted_value` (raw wrong
answers are the C1 dataset — `correct` alone throws them away), `step_id`
(Layer A grain), and `client_event_id` (so a durable retry can't double-count).

**Guarantees** (this is the real work — today's stream is fire-and-forget and
drops on failure, which is fine for telemetry and fatal for a source of truth):

- **Append-only / immutable** — no `UPDATE`/`DELETE` (revoke at the RLS/grant
  level; corrections are new compensating events, never edits).
- **At-least-once delivery** — a local outbox queues events and retries until the
  server acks; `client_event_id` makes the insert idempotent, so at-least-once +
  dedupe = exactly-once effect. Still off the lesson's critical path (never blocks
  the learner), but never silently dropped.
- **Ordered** — per `(student_id, occurred_at)`, with `received_at` as the
  tie-break against client clock skew.

**Derive-state contract:**

```
deriveState(events_for_student) → { skills: { [skillId]: masteryState } }
  JS:     fold → { attempts, correct, repNum, mastered, lastPractice, … }   (today's shape)
  Python: fold → { belief, stability, last_seen, … }                        (BKT + forgetting)
```

Replaying the full log per session is fine at current scale, but the projection
should be **materialised and updated incrementally** (append event → update
cache), with the log as the rebuildable source. Standard event-sourcing; note it
so it isn't discovered late.

## Consequences

**Gains:** the engine decision becomes reversible and measurable — Python can be
back-filled from real history and A/B-evaluated against JS before any cutover; the
`brainPath || jsPath` ambiguity ends (one truth, one owner); and the raw
wrong-answer corpus for C1 starts accumulating immediately.

**Costs / risks:** both engines must be refactored from *own-mutable-state* to
*derive-from-log* (bounded, but real); the logging path must be hardened to
at-least-once with an outbox; and the projection must be incremental, not
replay-on-read, before scale. None of these is novel — it is textbook event
sourcing — but they are prerequisites, not afterthoughts.

## Revised sequence (replaces Deliverable 2's milestone order)

0. **Harden `response_events`** to an append-only, at-least-once source of truth;
   add `submitted_value`, `session_id`, `client_event_id` (and `step_id`,
   `question_id`, `matched_misconception`, dormant until Layer A).
1. **Refactor the JS engine to `deriveState(log)`** feeding a materialised
   projection. User-invisible; proves the pattern; ends `progress.skills`-as-truth.
2. **First stepped vertical** (`solve-linear-two-step`) writing per-step events
   into the log and updating the projection.
3. **Python `deriveState(log)` → BKT**, back-tested on the accumulated log;
   cut over per-session authority only once it measurably beats JS.

The through-line: **you do not choose the engine first. You make the log the
truth first — and that turns "which engine" from an irreversible bet into an
experiment you can run.**
