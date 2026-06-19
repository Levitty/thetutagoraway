"""
Ability / level estimation — the teacher-facing measurement.

Per-skill beliefs are great for the engine, but a teacher wants a single,
defensible answer: *what level is this child at, in this strand?*

We estimate a continuous ability `theta` on the same scale as skill difficulty
(which is a grade scale), using a Rasch/IRT-lite reading of the mastery beliefs:
under a Rasch model P(can do skill) = sigmoid(theta - b), so for an observed
mastery m on a skill of difficulty b, theta ≈ b + logit(m). We average these
estimates, weighting each skill by how *informative* it is (skills the student
is on the boundary of carry the most signal).
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional

from .state import StudentModel


def _logit(p: float) -> float:
    p = min(max(p, 0.02), 0.98)
    return math.log(p / (1 - p))


@dataclass
class StrandProfile:
    strand: str
    level: float                  # continuous ability (grade scale)
    grade_level: int              # rounded, human-friendly
    mastered: int
    total: int
    percent: int
    confidence: float             # 0..1, how much evidence backs the estimate


@dataclass
class KnowledgeProfile:
    """The full snapshot a teacher dashboard renders for one student."""

    subject: str
    overall_level: float
    overall_grade: int
    mastered: int
    total: int
    percent: int
    confidence: float
    strands: List[StrandProfile] = field(default_factory=list)
    # Is the student outrunning their grade band? (the "gifted, no guardrails" signal)
    accelerated: bool = False
    headroom_grades: float = 0.0  # how far above their working grade they're succeeding

    def to_dict(self) -> dict:
        return {
            "subject": self.subject,
            "overall_level": round(self.overall_level, 2),
            "overall_grade": self.overall_grade,
            "mastered": self.mastered,
            "total": self.total,
            "percent": self.percent,
            "confidence": round(self.confidence, 2),
            "accelerated": self.accelerated,
            "headroom_grades": round(self.headroom_grades, 2),
            "strands": [
                {
                    "strand": s.strand,
                    "level": round(s.level, 2),
                    "grade_level": s.grade_level,
                    "mastered": s.mastered,
                    "total": s.total,
                    "percent": s.percent,
                    "confidence": round(s.confidence, 2),
                }
                for s in self.strands
            ],
        }


class AbilityEstimator:
    def __init__(self, student: StudentModel):
        self.student = student
        self.graph = student.graph

    def _strand_level(self, strand: str, now: Optional[datetime]):
        skills = self.graph.by_strand(strand)
        if not skills:
            return None

        diffs = [s.difficulty for s in skills]
        # Weak prior anchored at the strand's entry level: with no evidence the
        # estimate sits at "just starting", not at some inflated value read off
        # the prior belief of hard, never-attempted skills.
        anchor = min(diffs)
        prior_weight = 2.0
        num = anchor * prior_weight
        den = prior_weight
        evidence = 0
        mastered = 0
        for skill in skills:
            m = self.student.effective_mastery(skill.id, now)
            if self.student.is_mastered(skill.id, now):
                mastered += 1
            st = self.student.skills.get(skill.id)
            attempts = st.attempts if st else 0
            if attempts == 0:
                continue  # never attempted -> not evidence, only the prior speaks
            evidence += attempts
            # Informativeness: peaks at the boundary (m≈0.5), with a floor so a
            # confidently mastered/failed skill still counts.
            info = (4 * m * (1 - m) + 0.2) * (1.0 + min(attempts, 4) * 0.5)
            # Cap the logit pull so one mastered easy skill can't imply a far
            # higher ability than its own difficulty. Use calibrated difficulty
            # when available, else the grade+weight heuristic.
            b = self.student.calibrated.difficulty(skill.id, skill.difficulty)
            theta_i = b + max(-2.0, min(2.0, _logit(m)))
            num += info * theta_i
            den += info

        level = num / den
        # Clamp to the strand's actual difficulty span (+a little headroom).
        level = min(max(level, anchor - 1.0), max(diffs) + 1.0)
        total = len(skills)

        # Confidence grows with evidence, saturating (~30 attempts ≈ full).
        confidence = 1 - math.exp(-evidence / 30.0)

        return StrandProfile(
            strand=strand,
            level=level,
            grade_level=int(round(level)),
            mastered=mastered,
            total=total,
            percent=round(100 * mastered / total) if total else 0,
            confidence=confidence,
        )

    def profile(self, now: Optional[datetime] = None) -> KnowledgeProfile:
        strand_profiles: List[StrandProfile] = []
        for strand in self.graph.strands:
            sp = self._strand_level(strand, now)
            if sp:
                strand_profiles.append(sp)

        total = len(self.graph)
        mastered = sum(1 for sid in self.graph.skills if self.student.is_mastered(sid, now))

        # Overall level = strand levels weighted by their skill counts.
        if strand_profiles:
            wnum = sum(sp.level * sp.total for sp in strand_profiles)
            wden = sum(sp.total for sp in strand_profiles)
            overall_level = wnum / wden if wden else 0.0
            confidence = sum(sp.confidence * sp.total for sp in strand_profiles) / (wden or 1)
        else:
            overall_level, confidence = 0.0, 0.0

        # Acceleration: is the student mastering skills above their own level?
        working_grade = int(round(overall_level))
        above = [
            s for s in self.graph.all()
            if s.grade > working_grade and self.student.is_mastered(s.id, now)
        ]
        headroom = 0.0
        if above:
            headroom = max(s.grade for s in above) - working_grade
        accelerated = headroom >= 1.0

        return KnowledgeProfile(
            subject=self.graph.subject,
            overall_level=overall_level,
            overall_grade=working_grade,
            mastered=mastered,
            total=total,
            percent=round(100 * mastered / total) if total else 0,
            confidence=confidence,
            strands=strand_profiles,
            accelerated=accelerated,
            headroom_grades=headroom,
        )
