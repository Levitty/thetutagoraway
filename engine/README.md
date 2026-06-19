# Tutagora Engine — the Python "brain"

An adaptive **mastery learning engine** inspired by *The Math Academy Way*. It
measures what a student actually knows, rebuilds shaky foundations, and lets
strong students run as far ahead as they can — **no grade ceiling**.

The student-facing app stays in JavaScript/React. This engine is the
measurement + decision core it calls. The two share **one curriculum**: the JS
knowledge graph is exported to JSON and loaded here, so there's a single source
of truth.

```
engine/
  tutagora_engine/
    graph.py        knowledge graph: skills + prerequisite relationships
    mastery.py      BKT belief + forgetting curve  ← the heart
    state.py        per-student state; records answers; FIRe implicit credit
    diagnostic.py   fast adaptive placement (credit propagation)
    scheduler.py    what to do next: remediate / review / learn / stretch
    ability.py      continuous "level" per strand (the teacher-facing number)
  data/             *_graph.json  (exported from the JS curriculum)
  scripts/export_graph.mjs   regenerate the JSON from the JS graphs
  server.py         stdlib HTTP API — the brain the JS UI calls
  demo.py           runnable simulation of two students
  tests/            15 tests, runnable with plain python3
```

## Quick start (zero install)

```bash
# 1. (Re)generate the curriculum JSON from the JS graphs
node engine/scripts/export_graph.mjs

# 2. See it work — simulate a struggling vs a gifted student
python3 engine/demo.py

# 3. Run the tests
python3 engine/tests/test_engine.py     # or: pytest engine/tests

# 4. Start the API the JS app calls
python3 engine/server.py                # http://127.0.0.1:8077
```

## How the measurement works

**Per skill, a probability of mastery — not a correct/total ratio.**
[Bayesian Knowledge Tracing](https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing)
tracks a hidden "known / not-known" state, updated after every answer. A *slip*
on a known skill barely dents mastery; a lucky *guess* barely raises it. Slip
and guess scale with skill difficulty.

**Knowledge fades.** Each clean, spaced repetition grows a memory "stability";
*retrievability* decays with time since practice. Effective mastery =
belief × retrievability, so once-learned skills resurface for review on a
schedule (FIRe-style spaced repetition).

**Practice flows down the graph.** Drilling an advanced skill gives partial,
distance-discounted credit to its prerequisites (Fractional Implicit
Repetition) — you don't re-test fractions to keep them fresh while doing algebra.

**A level a teacher can read.** Per strand we fit a continuous ability `theta`
on a grade scale (Rasch/IRT-lite over the beliefs). That's the single number a
teacher dashboard shows: "this child is at level 6.4 in Algebra."

**No guardrails.** The frontier is defined purely by *mastered prerequisites*,
never by nominal grade. A 7th grader who masters the prerequisites for calculus
is simply offered calculus. The scheduler always guarantees the student's
hardest available skill is on the menu.

## API (stateless)

The JS app owns persistence; it passes the student's serialized state in and
gets decisions + updated state back.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/health` | — | `{ok}` |
| GET | `/graph?subject=math` | — | strands, grades, skill count |
| POST | `/diagnostic/step` | `{subject, history, start_grade?}` | next question (frontier-targeted) |
| POST | `/diagnostic/finalize` | `{subject, history}` | seeded `state` + `profile` |
| POST | `/record` | `{subject, state, responses[]}` | updated `state` + `profile` |
| POST | `/next-session` | `{subject, state, n}` | ordered recommendations |
| POST | `/profile` | `{subject, state}` | knowledge profile (the "level") |

`subject` is one of `math`, `afm`, `apm` (whatever graphs exist in `data/`).

### Example: calling from the React app

```js
const ENGINE = "http://127.0.0.1:8077";

// After a student answers some problems:
const res = await fetch(`${ENGINE}/record`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    subject: "math",
    state: savedState,                 // from Supabase (or null for new student)
    responses: [
      { skill_id: "G6_FRACTIONS_ADD", correct: true, time_taken_ms: 9000, expected_ms: 30000 },
    ],
  }),
});
const { state, profile } = await res.json();
// persist `state` back to Supabase; render `profile.overall_level` etc.
```

## Adding a subject

1. Add its knowledge graph in JS (like `src/ai-tutor/afmKnowledgeGraph.js`).
2. Add it to `engine/scripts/export_graph.mjs` and run the script.
3. It's immediately usable: `load_graph("yoursubject")`.
