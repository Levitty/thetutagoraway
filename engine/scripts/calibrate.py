"""
HOREB calibration job — the "learn from usage" consume step.

Reads response events and re-estimates per-skill parameters:
  · difficulty   — data-driven, replacing the grade+weight heuristic
  · p_guess      — from cold (diagnostic) attempts
  · p_slip       — from warm (review) attempts on likely-mastered skills
  · content health flags — skills that are too hard / too easy / slow

Event source (first available): Supabase (service-role env) → events.jsonl →
synthetic (so the loop is demonstrable before real data exists).

Output: data/params.preview.json by default (NOT loaded by the engine).
Run with --commit to publish data/params.v1.json (which the engine then loads).
This keeps a human gate between "calibrated" and "shipped" — never auto-regress.

    python3 engine/scripts/calibrate.py            # synthetic/real → preview
    python3 engine/scripts/calibrate.py --commit   # publish params.v1.json
"""
import json
import math
import os
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tutagora_engine import load_graph

DATA = Path(__file__).resolve().parent.parent / "data"
MIN_N = int(os.environ.get("CALIB_MIN_N", "30"))   # min events/skill to calibrate
P_REF = 0.75                                        # target success at the frontier
COMMIT = "--commit" in sys.argv


def logit(p):
    p = min(max(p, 0.02), 0.98)
    return math.log(p / (1 - p))


def sigmoid(z):
    return 1 / (1 + math.exp(-z))


# ---------------------------------------------------------------- event sources
def from_supabase():
    url, key = os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (url and key):
        return None
    cols = "skill_id,correct,time_ms,attempt_no,is_diagnostic,is_review"
    events, step, off = [], 1000, 0
    while True:
        req = urllib.request.Request(
            f"{url}/rest/v1/response_events?select={cols}&limit={step}&offset={off}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"})
        batch = json.loads(urllib.request.urlopen(req).read())
        events += batch
        if len(batch) < step:
            break
        off += step
    return events


def from_jsonl():
    p = DATA / "events.jsonl"
    if not p.exists():
        return None
    return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]


def synthesize(graph, n_students=80):
    """Plausible events so the pipeline runs before real data exists."""
    import random
    rng = random.Random(7)
    events = []
    for _ in range(n_students):
        ability = rng.uniform(5, 12)
        for s in graph.all():
            if abs(s.grade - ability) > 2.5:
                continue
            p = sigmoid(1.2 * (ability - s.difficulty))
            for _a in range(rng.randint(1, 4)):
                diag = rng.random() < 0.2
                events.append({
                    "skill_id": s.id, "correct": rng.random() < p, "attempt_no": 1,
                    "is_diagnostic": diag, "is_review": (not diag and rng.random() < 0.2),
                    "time_ms": int(rng.uniform(8000, 40000)),
                })
    return events


def load_events(graph):
    for src, fn in (("supabase", from_supabase), ("events.jsonl", from_jsonl)):
        ev = fn()
        if ev:
            return ev, src
    return synthesize(graph), "synthetic"


# ---------------------------------------------------------------- calibration
def calibrate(graph, events):
    agg = defaultdict(lambda: dict(n=0, correct=0, time=0, dn=0, dc=0, rn=0, rc=0))
    for e in events:
        sid = e.get("skill_id")
        if sid not in graph:
            continue
        a = agg[sid]
        a["n"] += 1
        ok = bool(e.get("correct"))
        a["correct"] += ok
        a["time"] += e.get("time_ms") or 0
        if e.get("is_diagnostic"):
            a["dn"] += 1; a["dc"] += ok
        if e.get("is_review"):
            a["rn"] += 1; a["rc"] += ok

    skills, flags = {}, []
    for sid, a in agg.items():
        if a["n"] < MIN_N:
            continue
        acc = a["correct"] / a["n"]
        skill = graph.get(sid)
        # Frontier assumption: the average attempter sits near the skill's grade,
        # so difficulty shifts from grade by how far accuracy is from the target.
        difficulty = round(skill.grade + (logit(P_REF) - logit(acc)) * 0.5, 3)
        out = {"n": a["n"], "accuracy": round(acc, 3),
               "mean_time_ms": round(a["time"] / a["n"]), "difficulty": difficulty}
        if a["dn"] >= MIN_N:
            out["p_guess"] = round(a["dc"] / a["dn"], 3)        # cold-attempt success
        if a["rn"] >= MIN_N:
            out["p_slip"] = round(1 - a["rc"] / a["rn"], 3)     # warm-attempt failure
        skills[sid] = out
        if acc < 0.35:
            flags.append((sid, "too hard", round(acc, 2)))
        elif acc > 0.95:
            flags.append((sid, "too easy", round(acc, 2)))
    return skills, flags


def main():
    graph = load_graph("math")
    events, source = load_events(graph)
    skills, flags = calibrate(graph, events)

    params = {
        "version": "calib-v1",
        "generated_from": source,
        "event_count": len(events),
        "min_n": MIN_N,
        "skill_count": len(skills),
        "skills": skills,
    }
    out_path = DATA / ("params.v1.json" if COMMIT else "params.preview.json")
    out_path.write_text(json.dumps(params, indent=2))

    print(f"\n=== HOREB calibration ===")
    print(f"source         : {source}  ({len(events)} events)")
    print(f"skills calibrated (≥{MIN_N} events): {len(skills)} / {len(graph)}")
    print(f"written        : {out_path.name}  {'(LIVE — engine will load this)' if COMMIT else '(preview only)'}")

    # Show the biggest difficulty corrections vs the heuristic.
    deltas = sorted(
        ((sid, s["difficulty"] - graph.get(sid).difficulty, s["accuracy"]) for sid, s in skills.items()),
        key=lambda t: -abs(t[1]))
    print("\nLargest difficulty re-estimates (calibrated − heuristic):")
    for sid, d, acc in deltas[:8]:
        print(f"  {sid:<26} {d:+.2f}   (acc {acc:.0%}, heuristic {graph.get(sid).difficulty:.2f})")

    if flags:
        print(f"\nContent-health flags ({len(flags)}):")
        for sid, why, acc in flags[:10]:
            print(f"  {sid:<26} {why}  (acc {acc})")

    if not COMMIT:
        print("\nPreview only. Re-run with --commit to publish params.v1.json.")


if __name__ == "__main__":
    main()
