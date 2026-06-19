"""
Knowledge graph: skills and their prerequisite relationships.

The graph is loaded from JSON exported from the JS curriculum
(engine/data/<subject>_graph.json) so the Python brain and the JS UI always
share ONE source of truth for the curriculum.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Optional

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@dataclass(frozen=True)
class Skill:
    """A single learnable unit (a node in the graph)."""

    id: str
    name: str
    grade: int
    strand: str
    prerequisites: List[str] = field(default_factory=list)
    # The prerequisites that matter most for remediation (subset of prerequisites).
    key_prerequisites: List[str] = field(default_factory=list)
    # Skills this one fully subsumes — mastering this implies mastering those.
    encompassings: List[str] = field(default_factory=list)
    weight: float = 3.0          # rough cognitive load / difficulty (1..8)
    critical: bool = False       # a "load-bearing" skill many others depend on
    knowledge_points: int = 3
    mastery_threshold: float = 0.85
    min_problems: int = 6
    estimated_minutes: int = 15
    xp_value: int = 15

    @property
    def difficulty(self) -> float:
        """
        Continuous IRT-style difficulty on (roughly) a grade scale.

        Grade sets the baseline; weight nudges within the grade. Two grade-7
        skills can differ by ~±0.75 of a grade depending on weight. This is the
        `b` parameter used for ability (theta) estimation.
        """
        return self.grade + (self.weight - 3.0) * 0.15


class KnowledgeGraph:
    """An immutable graph of skills with prerequisite/postrequisite traversal."""

    def __init__(self, subject: str, skills: Dict[str, Skill], strands: List[str]):
        self.subject = subject
        self.skills = skills
        self.strands = strands or sorted({s.strand for s in skills.values()})
        self.grades = sorted({s.grade for s in skills.values()})
        # Adjacency: skill -> skills that list it as a prerequisite.
        self._post: Dict[str, List[str]] = {sid: [] for sid in skills}
        for s in skills.values():
            for pre in s.prerequisites:
                if pre in self._post:
                    self._post[pre].append(s.id)

    # ---- basic access ----
    def __contains__(self, skill_id: str) -> bool:
        return skill_id in self.skills

    def __len__(self) -> int:
        return len(self.skills)

    def get(self, skill_id: str) -> Optional[Skill]:
        return self.skills.get(skill_id)

    def all(self) -> List[Skill]:
        return list(self.skills.values())

    def by_grade(self, grade: int) -> List[Skill]:
        return [s for s in self.skills.values() if s.grade == grade]

    def by_strand(self, strand: str) -> List[Skill]:
        return [s for s in self.skills.values() if s.strand == strand]

    # ---- graph traversal ----
    def post_requisites(self, skill_id: str) -> List[str]:
        """Direct dependents (skills that list `skill_id` as a prerequisite)."""
        return list(self._post.get(skill_id, []))

    @lru_cache(maxsize=None)
    def prerequisite_chain(self, skill_id: str) -> tuple:
        """All ancestors (transitive prerequisites), nearest-first-ish."""
        chain: List[str] = []
        seen = set()

        def walk(sid: str):
            skill = self.skills.get(sid)
            if not skill:
                return
            for pre in skill.prerequisites:
                if pre not in seen:
                    seen.add(pre)
                    chain.append(pre)
                    walk(pre)

        walk(skill_id)
        return tuple(chain)

    @lru_cache(maxsize=None)
    def postrequisite_chain(self, skill_id: str) -> tuple:
        """All descendants (transitive dependents)."""
        chain: List[str] = []
        seen = set()

        def walk(sid: str):
            for post in self._post.get(sid, []):
                if post not in seen:
                    seen.add(post)
                    chain.append(post)
                    walk(post)

        walk(skill_id)
        return tuple(chain)

    def depth_between(self, descendant: str, ancestor: str) -> int:
        """
        Shortest number of prerequisite hops from `descendant` up to `ancestor`.
        Returns a large number if `ancestor` is not actually an ancestor.
        """
        skill = self.skills.get(descendant)
        if not skill:
            return 10
        if ancestor in skill.prerequisites:
            return 1
        best = 10
        for pre in skill.prerequisites:
            d = self.depth_between(pre, ancestor)
            if d + 1 < best:
                best = d + 1
        return best

    @lru_cache(maxsize=1)
    def topological_order(self) -> tuple:
        """Skill ids ordered so every skill comes after its prerequisites."""
        order: List[str] = []
        seen = set()

        def visit(sid: str):
            if sid in seen:
                return
            seen.add(sid)
            skill = self.skills.get(sid)
            if skill:
                for pre in skill.prerequisites:
                    visit(pre)
            order.append(sid)

        for sid in self.skills:
            visit(sid)
        return tuple(order)


def load_graph(subject: str = "math", data_dir: Optional[Path] = None) -> KnowledgeGraph:
    """Load a subject's knowledge graph from its exported JSON file."""
    data_dir = data_dir or DATA_DIR
    path = data_dir / f"{subject}_graph.json"
    if not path.exists():
        raise FileNotFoundError(
            f"No graph for subject '{subject}' at {path}. "
            f"Run `node engine/scripts/export_graph.mjs` to generate it."
        )
    raw = json.loads(path.read_text())
    skills = {}
    for s in raw["skills"]:
        skills[s["id"]] = Skill(
            id=s["id"],
            name=s["name"],
            grade=s["grade"],
            strand=s["strand"],
            prerequisites=s.get("prerequisites", []),
            key_prerequisites=s.get("key_prerequisites", s.get("prerequisites", [])),
            encompassings=s.get("encompassings", []),
            weight=s.get("weight", 3),
            critical=s.get("critical", False),
            knowledge_points=s.get("knowledge_points", 3),
            mastery_threshold=s.get("mastery_threshold", 0.85),
            min_problems=s.get("min_problems", 6),
            estimated_minutes=s.get("estimated_minutes", 15),
            xp_value=s.get("xp_value", 15),
        )
    return KnowledgeGraph(subject=raw.get("subject", subject), skills=skills,
                          strands=raw.get("strands", []))
