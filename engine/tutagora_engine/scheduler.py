"""
Scheduler — decides what the student does next.

Four kinds of work, in priority order (Math Academy's "always work at the
frontier, but never on sand"):

  remediate  a foundational prerequisite is missing and is blocking progress
  review     a once-learned skill is fading and is due for spaced repetition
  learn      a skill at the frontier (all prerequisites mastered, not yet learned)
  stretch    a frontier skill well above the student's working grade

Crucially there is NO grade ceiling. The frontier is defined purely by mastered
prerequisites, so a gifted child who masters the prerequisites for grade-11
calculus while nominally "in grade 7" is simply offered grade-11 calculus. The
engine never withholds material a student is ready for.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from .ability import AbilityEstimator
from .state import StudentModel

REVIEW_THRESHOLD = 0.75   # effective mastery below this (once learned) => due
GAP_MIN_ATTEMPTS = 3      # struggling this many times => look for a foundation gap
GAP_MASTERY_CEILING = 0.6 # ...and effective mastery still below this


@dataclass
class Recommendation:
    skill_id: str
    name: str
    grade: int
    strand: str
    kind: str          # remediate | review | learn | stretch
    priority: float
    reason: str
    mastery: float     # current effective mastery (0..1)

    def to_dict(self) -> dict:
        return {
            "skill_id": self.skill_id,
            "name": self.name,
            "grade": self.grade,
            "strand": self.strand,
            "kind": self.kind,
            "priority": round(self.priority, 2),
            "reason": self.reason,
            "mastery": round(self.mastery, 3),
        }


class Scheduler:
    def __init__(self, student: StudentModel):
        self.student = student
        self.graph = student.graph

    # ---- frontier ----
    def frontier(self, now: Optional[datetime] = None) -> List[str]:
        """Skills not yet mastered whose prerequisites are all mastered."""
        out = []
        for sid in self.graph.skills:
            if self.student.is_mastered(sid, now):
                continue
            if self.student.prereqs_met(sid, now):
                out.append(sid)
        return out

    # ---- gaps (broken foundations) ----
    def gaps(self, now: Optional[datetime] = None) -> List[Recommendation]:
        recs: List[Recommendation] = []
        seen = set()
        for skill in self.graph.all():
            st = self.student.skills.get(skill.id)
            if not st or st.attempts < GAP_MIN_ATTEMPTS:
                continue
            if self.student.effective_mastery(skill.id, now) >= GAP_MASTERY_CEILING:
                continue
            # Struggling — find the foundational prerequisite that isn't solid.
            for pid in (skill.key_prerequisites or skill.prerequisites):
                if pid in seen or self.student.is_mastered(pid, now):
                    continue
                pre = self.graph.get(pid)
                if not pre:
                    continue
                seen.add(pid)
                unlocks = len(self.graph.postrequisite_chain(pid))
                priority = (15 if pre.critical else 6) + unlocks * 1.5
                recs.append(Recommendation(
                    skill_id=pid, name=pre.name, grade=pre.grade, strand=pre.strand,
                    kind="remediate", priority=priority,
                    reason=f"Foundation for “{skill.name}” — unblocks {unlocks} later skills",
                    mastery=self.student.effective_mastery(pid, now),
                ))
        return sorted(recs, key=lambda r: -r.priority)

    # ---- due reviews ----
    def reviews(self, now: Optional[datetime] = None) -> List[Recommendation]:
        recs: List[Recommendation] = []
        for skill in self.graph.all():
            st = self.student.skills.get(skill.id)
            if not st or st.rep <= 0:
                continue
            # Was it ever actually learned? (belief alone, before decay)
            if st.belief < self.student.model.mastery_threshold:
                continue
            eff = self.student.effective_mastery(skill.id, now)
            if eff >= REVIEW_THRESHOLD or eff >= self.student.model.mastery_threshold:
                continue
            urgency = (self.student.model.mastery_threshold - eff)
            recs.append(Recommendation(
                skill_id=skill.id, name=skill.name, grade=skill.grade, strand=skill.strand,
                kind="review", priority=10 + urgency * 20,
                reason=f"Fading — recall now {round(eff*100)}%",
                mastery=eff,
            ))
        return sorted(recs, key=lambda r: -r.priority)

    # ---- new learning at the frontier ----
    def to_learn(self, now: Optional[datetime] = None) -> List[Recommendation]:
        profile = AbilityEstimator(self.student).profile(now)
        working_grade = profile.overall_grade
        recs: List[Recommendation] = []
        for sid in self.frontier(now):
            skill = self.graph.get(sid)
            st = self.student.skills.get(sid)
            unlocks = len(self.graph.post_requisites(sid))
            in_progress = 8 if (st and st.attempts > 0) else 0
            critical_bonus = 12 if skill.critical else 0
            # Closer to the student's working grade = better default ordering,
            # but higher grades are NOT excluded — just slightly deprioritized.
            proximity = max(0.0, 6 - abs(skill.grade - working_grade))
            above = skill.grade - working_grade
            kind = "stretch" if above >= 1 else "learn"
            priority = critical_bonus + unlocks * 2 + in_progress + proximity
            if kind == "stretch":
                # Keep stretch visible and attractive for fast movers.
                priority += 1.0
            reason = (f"Frontier skill ({skill.strand}, grade {skill.grade})"
                      if kind == "learn"
                      else f"Stretch: grade {skill.grade} — {above} above current level")
            recs.append(Recommendation(
                skill_id=sid, name=skill.name, grade=skill.grade, strand=skill.strand,
                kind=kind, priority=priority, reason=reason,
                mastery=self.student.effective_mastery(sid, now),
            ))
        return sorted(recs, key=lambda r: -r.priority)

    # ---- the daily session: a blended, ordered plan ----
    def next_session(self, n: int = 8, now: Optional[datetime] = None) -> List[Recommendation]:
        """
        A blended plan: foundations first (can't build on sand), then a couple
        of due reviews interleaved, then frontier learning (incl. stretch).
        """
        plan: List[Recommendation] = []
        seen = set()

        def add(recs, limit):
            for r in recs:
                if len(plan) >= n:
                    return
                if r.skill_id in seen:
                    continue
                plan.append(r)
                seen.add(r.skill_id)
                limit -= 1
                if limit <= 0:
                    return

        add(self.gaps(now), limit=3)        # fix what's broken first
        add(self.reviews(now), limit=2)     # keep memory alive

        learn = self.to_learn(now)
        # Guarantee the reach: a ready student is ALWAYS offered their hardest
        # available frontier skill — this is the "no guardrails" promise made
        # concrete, not left to priority tie-breaks.
        stretches = [r for r in learn if r.kind == "stretch"]
        if stretches:
            top_stretch = max(stretches, key=lambda r: (r.grade, r.priority))
            add([top_stretch], limit=1)
        add(learn, limit=n)                 # then fill the frontier by priority
        return plan[:n]
