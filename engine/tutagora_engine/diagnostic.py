"""
Diagnostic placement — locate a new student on the graph FAST.

A child should not answer 200 questions to be placed. We ask a spread of
~25-40 questions and use credit propagation to infer the rest: getting a hard
skill right is strong evidence the prerequisites are solid (credit flows down);
missing a foundational skill is evidence its dependents aren't ready (penalty
flows up). What's left is read off the graph rather than tested directly.

The result seeds each touched skill's belief/rep so the student starts the
session already roughly placed.
"""
from __future__ import annotations

import math
import random
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set

from .graph import KnowledgeGraph
from .state import StudentModel

PRE_CREDIT = 0.6    # share of credit a correct answer sends to each prerequisite
POST_PENALTY = 0.5  # share of penalty a wrong answer sends to each postrequisite


@dataclass
class DiagnosticItem:
    skill_id: str
    name: str
    grade: int
    strand: str
    weight: float


class DiagnosticSession:
    """Stateful placement session. Drive it: next_item() -> record() -> finalize()."""

    def __init__(self, graph: KnowledgeGraph, max_items: int = 30,
                 seed: Optional[int] = None, start_grade: Optional[float] = None):
        self.graph = graph
        self.max_items = max_items
        self.rng = random.Random(seed)
        self.balances: Dict[str, float] = {}
        self.answered: Set[str] = set()
        # Where to begin probing. Default: the middle of the curriculum.
        grades = graph.grades or [5]
        self.start_grade = start_grade if start_grade is not None else (grades[len(grades) // 2])
        self._pool = self._build_pool()

    def _estimated_grade(self) -> float:
        """
        Running ability estimate (a grade), used to target questions at the
        frontier where each answer is most informative — like a binary search.
        """
        known, unknown = [], []
        for sid, bal in self.balances.items():
            sk = self.graph.get(sid)
            if not sk:
                continue
            (known if bal > 0 else unknown).append(sk.grade)
        if not known and not unknown:
            return float(self.start_grade)
        hi = max(known) if known else (min(self.graph.grades) - 1)
        lo = min(unknown) if unknown else (max(self.graph.grades) + 1)
        # Frontier sits between the hardest passed and the easiest failed grade.
        return (hi + lo) / 2.0

    def _build_pool(self) -> List[DiagnosticItem]:
        """A difficulty- and strand-spread pool, criticals favored."""
        skills = self.graph.all()
        criticals = [s for s in skills if s.critical]
        self.rng.shuffle(criticals)
        others = [s for s in skills if not s.critical]
        self.rng.shuffle(others)
        ordered = criticals + others
        return [DiagnosticItem(s.id, s.name, s.grade, s.strand, s.weight) for s in ordered]

    # ---- adaptive selection ----
    def next_item(self) -> Optional[DiagnosticItem]:
        """Pick the most informative unanswered item given current balances."""
        if len(self.answered) >= self.max_items:
            return None
        candidates = [it for it in self._pool if it.skill_id not in self.answered]
        if not candidates:
            return None

        strand_counts: Dict[str, int] = {}
        for sid in self.answered:
            sk = self.graph.get(sid)
            if sk:
                strand_counts[sk.strand] = strand_counts.get(sk.strand, 0) + 1

        target = self._estimated_grade()

        def score(it: DiagnosticItem) -> float:
            # Prefer skills (a) near the current ability estimate — most
            # informative, (b) we're least certain about, (c) in under-sampled
            # strands. Targeting the frontier avoids wasting the first question
            # on grade-12 calculus for a 7th grader.
            proximity = -abs(it.grade - target)
            uncertainty = -abs(self.balances.get(it.skill_id, 0.0))
            coverage = max(0, 3 - strand_counts.get(it.strand, 0))
            return proximity * 1.5 + uncertainty + coverage * 0.5

        candidates.sort(key=score, reverse=True)
        return candidates[0]

    # ---- record an answer + propagate credit ----
    def record(self, skill_id: str, correct: bool, time_weight: float = 1.0):
        if skill_id not in self.graph:
            raise KeyError(skill_id)
        self.answered.add(skill_id)
        w = max(0.2, min(1.0, time_weight))

        self.balances[skill_id] = self.balances.get(skill_id, 0.0) + (w if correct else -w)
        if correct:
            for pid in self.graph.prerequisite_chain(skill_id):
                self.balances[pid] = self.balances.get(pid, 0.0) + w * PRE_CREDIT
        else:
            for pid in self.graph.postrequisite_chain(skill_id):
                self.balances[pid] = self.balances.get(pid, 0.0) - w * POST_PENALTY

    # ---- write inferred placement into a StudentModel ----
    def finalize(self, student: StudentModel, now: Optional[datetime] = None) -> StudentModel:
        now = now or datetime.now(timezone.utc)
        for skill_id, balance in self.balances.items():
            if skill_id not in self.graph:
                continue
            params = student.params_for(skill_id)
            # Map accumulated balance -> belief via a logistic squash.
            belief = 1 / (1 + math.exp(-1.1 * balance))
            belief = min(max(belief, params.p_l0 * 0.5), 0.985)
            st = student.state(skill_id)
            st.belief = belief
            st.from_diagnostic = True
            st.last_practice = now.isoformat()
            if balance > 0:
                # Confident positives start with a repetition or two of memory.
                st.rep = 2.0 if balance > 1.5 else 1.0
                st.attempts = max(1, round(abs(balance)))
                st.correct = st.attempts
            else:
                st.attempts = 1
                st.correct = 0
                st.rep = 0.0
        student.diagnosed = True
        return student

    def is_complete(self) -> bool:
        return len(self.answered) >= self.max_items or not self.next_item()
