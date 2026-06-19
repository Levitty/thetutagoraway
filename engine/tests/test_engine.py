"""
Engine tests — runnable two ways:
    python3 engine/tests/test_engine.py      (no deps)
    pytest engine/tests/test_engine.py
"""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tutagora_engine import load_graph, StudentModel  # noqa: E402
from tutagora_engine.mastery import (  # noqa: E402
    BKTParams, MasteryModel, retrievability, stability_for_rep,
)
from tutagora_engine.scheduler import Scheduler  # noqa: E402
from tutagora_engine.ability import AbilityEstimator  # noqa: E402
from tutagora_engine.diagnostic import DiagnosticSession  # noqa: E402

GRAPH = load_graph("math")
T0 = datetime(2026, 1, 1, tzinfo=timezone.utc)


def days(n):
    return T0 + timedelta(days=n)


# ---------------------------------------------------------------- BKT basics
def test_correct_raises_belief_wrong_lowers():
    p = BKTParams.for_skill(weight=3)
    m = MasteryModel()
    b = 0.2
    up = m.update_belief(b, True, p)
    down = m.update_belief(b, False, p)
    assert up > b, "a correct answer should raise belief"
    assert down < b, "a wrong answer should lower belief"


def test_belief_converges_to_mastery_with_streak():
    p = BKTParams.for_skill(weight=3)
    m = MasteryModel()
    b = p.p_l0
    for _ in range(6):
        b = m.update_belief(b, True, p)
    assert b > 0.9, f"six correct in a row should approach mastery, got {b:.3f}"


def test_slip_barely_dents_strong_belief():
    p = BKTParams.for_skill(weight=3)
    m = MasteryModel()
    b = 0.97
    after = m.update_belief(b, False, p)
    assert after > 0.75, f"one slip shouldn't collapse mastery, got {after:.3f}"


def test_harder_skills_slip_more_guess_less():
    easy = BKTParams.for_skill(weight=1)
    hard = BKTParams.for_skill(weight=8)
    assert hard.p_slip > easy.p_slip
    assert hard.p_guess < easy.p_guess


# ------------------------------------------------------------- forgetting
def test_retrievability_decays_over_time():
    s = stability_for_rep(2)
    assert retrievability(0, s) == 1.0
    assert retrievability(s, s) < 0.4
    assert retrievability(0.1, s) > retrievability(10, s)


def test_more_reps_means_slower_forgetting():
    assert stability_for_rep(5) > stability_for_rep(1)


def test_effective_mastery_drops_without_practice():
    sm = StudentModel(GRAPH)
    sid = "G5_ADDITION"
    for _ in range(5):
        sm.record_response(sid, True, now=T0)
    fresh = sm.effective_mastery(sid, now=T0)
    stale = sm.effective_mastery(sid, now=days(120))
    assert fresh > 0.85
    assert stale < fresh, "mastery should fade after months without practice"


# --------------------------------------------------------- prereqs / frontier
def test_locked_skill_not_on_frontier_until_prereqs_mastered():
    sm = StudentModel(GRAPH)
    sched = Scheduler(sm)
    # G6_BODMAS_BASIC needs the four G5 operations.
    target = "G6_BODMAS_BASIC"
    assert target not in sched.frontier(now=T0)
    skill = GRAPH.get(target)
    for pid in skill.prerequisites:
        for _ in range(6):
            sm.record_response(pid, True, now=T0)
    assert sm.prereqs_met(target, now=T0)
    assert target in sched.frontier(now=T0)


def test_fire_implicit_credit_reaches_prerequisites():
    sm = StudentModel(GRAPH)
    # Touch a prerequisite once so it exists in state, then drill a dependent.
    sm.record_response("G5_MULTIPLICATION", True, now=T0)
    before = sm.skills["G5_MULTIPLICATION"].belief
    for _ in range(4):
        sm.record_response("G5_FACTORS", True, now=T0)  # depends on multiplication
    after = sm.skills["G5_MULTIPLICATION"].belief
    assert after > before, "practicing a dependent should reinforce its prereq"


# ------------------------------------------------------------- no guardrails
def test_gifted_student_gets_stretch_above_grade():
    sm = StudentModel(GRAPH)
    # Master a deep chain quickly: drill the grade-7 algebra chain.
    goal = "G7_EQUATIONS_SOLVE"
    chain = list(GRAPH.prerequisite_chain(goal)) + [goal]
    assert len(chain) > 3, "expected a real multi-skill prerequisite chain"
    for sid in chain:
        assert sid in GRAPH, f"bad skill id in test: {sid}"
        for _ in range(6):
            sm.record_response(sid, True, now=T0)
    sched = Scheduler(sm)
    plan = sched.next_session(n=10, now=T0)
    grades = [r.grade for r in plan]
    assert any(g >= 7 for g in grades), "a strong student must be offered higher-grade work"


# ------------------------------------------------------------- ability
def test_ability_level_tracks_mastery_band():
    sm = StudentModel(GRAPH)
    for s in GRAPH.by_grade(5) + GRAPH.by_grade(6):
        for _ in range(5):
            sm.record_response(s.id, True, now=T0)
    prof = AbilityEstimator(sm).profile(now=T0)
    assert 5.0 <= prof.overall_level <= 8.0, f"level out of band: {prof.overall_level:.2f}"
    assert prof.mastered > 0


# ------------------------------------------------------------- diagnostic
def test_diagnostic_places_a_strong_student_high():
    sm = StudentModel(GRAPH)
    diag = DiagnosticSession(GRAPH, max_items=30, seed=42)
    # Simulate a strong G7-ish student: correct on <=7, wrong above.
    while not diag.is_complete():
        item = diag.next_item()
        if item is None:
            break
        diag.record(item.skill_id, correct=item.grade <= 7)
    diag.finalize(sm, now=T0)
    prof = AbilityEstimator(sm).profile(now=T0)
    assert prof.mastered > 0
    assert prof.overall_level >= 5.0


def test_diagnostic_targets_near_start_grade():
    # With a grade-7 hint, the first question should be near grade 7,
    # not grade-12 calculus.
    diag = DiagnosticSession(GRAPH, max_items=30, seed=42, start_grade=7)
    first = diag.next_item()
    assert first is not None
    assert abs(first.grade - 7) <= 2, f"first item grade {first.grade} too far from start"


def test_diagnostic_walks_down_after_failures():
    # A student who fails everything near grade 7 should get easier questions.
    diag = DiagnosticSession(GRAPH, max_items=30, seed=42, start_grade=7)
    grades_asked = []
    for _ in range(6):
        item = diag.next_item()
        if item is None:
            break
        grades_asked.append(item.grade)
        diag.record(item.skill_id, correct=False)
    assert grades_asked[-1] < grades_asked[0], "diagnostic should ease down after failures"


def test_serialization_roundtrip():
    sm = StudentModel(GRAPH)
    for _ in range(4):
        sm.record_response("G5_ADDITION", True, now=T0)
    data = sm.to_dict()
    sm2 = StudentModel.from_dict(GRAPH, data)
    assert abs(sm2.effective_mastery("G5_ADDITION", now=T0)
               - sm.effective_mastery("G5_ADDITION", now=T0)) < 1e-9


# ------------------------------------------------------------- runner
if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    passed = 0
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
            passed += 1
        except AssertionError as e:
            print(f"  FAIL  {t.__name__}: {e}")
        except Exception as e:
            print(f"  ERROR {t.__name__}: {type(e).__name__}: {e}")
    print(f"\n{passed}/{len(tests)} tests passed")
    sys.exit(0 if passed == len(tests) else 1)
