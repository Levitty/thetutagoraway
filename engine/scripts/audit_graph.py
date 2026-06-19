"""Audit the learning-tree (knowledge graph) integrity & granularity.
   python3 engine/scripts/audit_graph.py"""
import sys
from pathlib import Path
from collections import Counter, defaultdict

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tutagora_engine import load_graph

G = load_graph("math")
ids = set(G.skills)

print(f"\n=== LEARNING-TREE AUDIT (math, {len(G)} skills) ===\n")

# 1. Broken prerequisites (point to a non-existent skill)
broken = [(s.id, p) for s in G.all() for p in s.prerequisites if p not in ids]
print(f"Broken prerequisite refs : {len(broken)}")
for sid, p in broken[:20]:
    print(f"    {sid} -> {p} (missing)")

# 2. Cycles (a prereq chain that loops) — should be none in a DAG
def has_cycle():
    color = {}
    bad = []
    def visit(n, stack):
        color[n] = 1
        for p in G.skills[n].prerequisites:
            if p not in ids:
                continue
            if color.get(p) == 1:
                bad.append((n, p))
            elif color.get(p, 0) == 0:
                visit(p, stack + [p])
        color[n] = 2
    for n in ids:
        if color.get(n, 0) == 0:
            visit(n, [n])
    return bad
cycles = has_cycle()
print(f"Cycles                   : {len(cycles)}  {cycles[:5]}")

# 3. Cross-grade jumps: a skill whose prereq is >1 grade below (granularity gaps)
big_jumps = []
for s in G.all():
    for p in s.prerequisites:
        ps = G.get(p)
        if ps and s.grade - ps.grade >= 3:
            big_jumps.append((s.id, s.grade, p, ps.grade))
print(f"Big grade jumps (>=3)    : {len(big_jumps)}")
for sid, g, p, pg in big_jumps[:12]:
    print(f"    G{g} {sid}  <- G{pg} {p}")

# 4. Isolated skills: no prereqs AND nothing depends on them (orphans)
isolated = [s.id for s in G.all()
            if not s.prerequisites and not G.post_requisites(s.id)]
print(f"\nIsolated skills (no in/out edges): {len(isolated)}")
print("   ", isolated[:20])

# 5. Roots (no prereqs) per strand — entry points into each tree
roots = defaultdict(list)
for s in G.all():
    if not s.prerequisites:
        roots[s.strand].append(s.id)
print(f"\nEntry points (roots) per strand:")
for strand, r in roots.items():
    print(f"    {strand:<13}: {len(r)}")

# 6. Granularity: skills per grade, prereq density
per_grade = Counter(s.grade for s in G.all())
print(f"\nSkills per grade:")
for g in sorted(per_grade):
    print(f"    G{g}: {per_grade[g]}")
avg_pre = sum(len(s.prerequisites) for s in G.all()) / len(G)
maxdepth = max(len(G.prerequisite_chain(s.id)) for s in G.all())
print(f"\nAvg prerequisites/skill  : {avg_pre:.2f}")
print(f"Deepest prereq chain     : {maxdepth} skills")

# 7. "critical" load-bearing skills
crit = [s.id for s in G.all() if s.critical]
print(f"Critical skills flagged  : {len(crit)}")

# 8. Strands × grades coverage matrix (gaps = a strand absent at a grade)
print(f"\nCoverage matrix (strand × grade), '.' = no skills:")
strands = G.strands
print("        " + "".join(f"G{g:<3}" for g in G.grades))
for st in strands:
    row = ""
    for g in G.grades:
        n = len([s for s in G.all() if s.strand == st and s.grade == g])
        row += f"{n if n else '.':<4}"
    print(f"  {st:<6}{row}")
