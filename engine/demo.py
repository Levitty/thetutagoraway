"""
Demo: watch the engine measure and adapt to two very different students.

    python3 engine/demo.py

No deps. Simulates answers (no real problems needed) to show that the SAME
engine: places a struggling student low and rebuilds foundations, places a
gifted student high and offers work years above grade — no guardrails.
"""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from tutagora_engine import load_graph, StudentModel
from tutagora_engine.scheduler import Scheduler
from tutagora_engine.ability import AbilityEstimator
from tutagora_engine.diagnostic import DiagnosticSession

GRAPH = load_graph("math")
T0 = datetime(2026, 1, 1, tzinfo=timezone.utc)


def hr(title):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def run_diagnostic(label, knows_up_to_grade, shaky_grade=None, seed=1):
    """Simulate a placement test for a student who's solid up to a grade."""
    sm = StudentModel(GRAPH)
    diag = DiagnosticSession(GRAPH, max_items=30, seed=seed)
    while not diag.is_complete():
        item = diag.next_item()
        if item is None:
            break
        if item.grade <= knows_up_to_grade:
            correct = True
        elif shaky_grade and item.grade == shaky_grade:
            correct = (hash(item.skill_id) % 2 == 0)  # ~50/50
        else:
            correct = False
        diag.record(item.skill_id, correct)
    diag.finalize(sm, now=T0)
    return sm


def show_profile(sm, now=T0):
    prof = AbilityEstimator(sm).profile(now)
    print(f"  Overall level : {prof.overall_level:.2f}  (grade {prof.overall_grade}, "
          f"confidence {prof.confidence:.0%})")
    print(f"  Mastered      : {prof.mastered}/{prof.total} skills ({prof.percent}%)")
    if prof.accelerated:
        print(f"  ⚡ ACCELERATED : succeeding {prof.headroom_grades:.0f} grade(s) above level")
    print("  By strand:")
    for s in sorted(prof.strands, key=lambda x: -x.level):
        bar = "█" * int(s.level) + "░" * max(0, 12 - int(s.level))
        print(f"    {s.strand:<13} lvl {s.level:>4.1f} {bar}  {s.mastered}/{s.total}")


def show_plan(sm, now=T0, n=6):
    plan = Scheduler(sm).next_session(n=n, now=now)
    icons = {"remediate": "🔧", "review": "🔁", "learn": "📘", "stretch": "🚀"}
    for r in plan:
        print(f"    {icons.get(r.kind,'•')} [{r.kind:<9}] G{r.grade} {r.name}")
        print(f"        {r.reason}")


# ---------------------------------------------------------------------------
hr("STUDENT A — 'Amani', struggling: nominally grade 7, foundations shaky")
amani = run_diagnostic("Amani", knows_up_to_grade=5, shaky_grade=6, seed=7)
show_profile(amani)
print("\n  Engine's plan for Amani (note it rebuilds foundations first):")
show_plan(amani)

hr("STUDENT B — 'Brian', gifted: nominally grade 7, races ahead")
brian = run_diagnostic("Brian", knows_up_to_grade=9, seed=3)
show_profile(brian)
print("\n  Engine's plan for Brian (note the stretch — no grade ceiling):")
show_plan(brian)

# ---------------------------------------------------------------------------
hr("LEARNING OVER TIME — Amani practices her frontier for 20 sessions")
day = 0
for session in range(20):
    day += 1
    now = T0 + timedelta(days=day)
    plan = Scheduler(amani).next_session(n=5, now=now)
    for r in plan:
        skill = GRAPH.get(r.skill_id)
        # Amani succeeds ~80% on grade<=6 work, ~55% on harder material.
        p = 0.82 if skill.grade <= 6 else 0.55
        for _ in range(skill.min_problems):
            correct = (hash((r.skill_id, session, _)) % 100) / 100 < p
            amani.record_response(r.skill_id, correct, now=now)

print("  Amani after 20 sessions of practice:")
show_profile(amani, now=T0 + timedelta(days=day))

# ---------------------------------------------------------------------------
hr("FORGETTING — Brian takes the term off; what's due for review?")
later = T0 + timedelta(days=75)
reviews = Scheduler(brian).reviews(now=later)
print(f"  {len(reviews)} skills have faded below recall threshold after 75 days.")
for r in reviews[:6]:
    print(f"    🔁 G{r.grade} {r.name}  (recall now {r.mastery:.0%})")

print("\nDone. The same engine, two students, opposite needs — each met.\n")
