"""
Student model: per-skill state + the operations that mutate it.

A StudentModel is the full, serializable picture of one learner's knowledge
over one subject graph. The JS UI persists the serialized form (Supabase);
the engine loads it, records answers, and hands back recommendations.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Dict, Optional

from .graph import KnowledgeGraph
from .mastery import BKTParams, MasteryModel
from .params import load_params


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _parse(ts: Optional[str]) -> Optional[datetime]:
    if not ts:
        return None
    dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def _days_between(later: datetime, earlier: Optional[datetime]) -> float:
    if earlier is None:
        return 0.0
    return max(0.0, (later - earlier).total_seconds() / 86400.0)


@dataclass
class SkillState:
    """Everything we know about one student on one skill."""

    belief: float = BKTParams().p_l0   # BKT P(known)
    rep: float = 0.0                   # successful spaced repetitions (fractional)
    learning_speed: float = 1.0
    attempts: int = 0
    correct: int = 0
    consecutive_failures: int = 0
    last_practice: Optional[str] = None   # ISO timestamp
    from_diagnostic: bool = False

    def to_dict(self) -> dict:
        return asdict(self)

    @staticmethod
    def from_dict(d: dict) -> "SkillState":
        known = SkillState.__dataclass_fields__.keys()
        return SkillState(**{k: v for k, v in d.items() if k in known})


class StudentModel:
    """One learner over one subject graph."""

    def __init__(self, graph: KnowledgeGraph,
                 model: Optional[MasteryModel] = None,
                 prior: float = 0.15):
        self.graph = graph
        self.model = model or MasteryModel()
        self.prior = prior
        self.skills: Dict[str, SkillState] = {}
        self.diagnosed: bool = False
        self.total_xp: int = 0
        self._params: Dict[str, BKTParams] = {}
        self.calibrated = load_params()   # data-driven overrides, empty until calibrated

    # ---- params per skill (calibrated if available, else difficulty-aware) ----
    def params_for(self, skill_id: str) -> BKTParams:
        if skill_id not in self._params:
            skill = self.graph.get(skill_id)
            w = skill.weight if skill else 3.0
            base = BKTParams.for_skill(w, prior=self.prior)
            override = self.calibrated.bkt(skill_id)
            if override:
                # Prefer calibrated values, keep heuristic for anything missing.
                base = BKTParams(
                    p_l0=override.get("p_l0", base.p_l0),
                    p_t=override.get("p_t", base.p_t),
                    p_slip=override.get("p_slip", base.p_slip),
                    p_guess=override.get("p_guess", base.p_guess),
                )
            self._params[skill_id] = base
        return self._params[skill_id]

    def state(self, skill_id: str) -> SkillState:
        if skill_id not in self.skills:
            self.skills[skill_id] = SkillState(belief=self.params_for(skill_id).p_l0)
        return self.skills[skill_id]

    # ---- core: record an answer ----
    def record_response(self, skill_id: str, correct: bool,
                        time_taken_ms: Optional[int] = None,
                        expected_ms: Optional[int] = None,
                        now: Optional[datetime] = None) -> SkillState:
        """
        Update belief, repetition, memory and learning speed for `skill_id`,
        then push FIRe implicit credit up the prerequisite chain.
        """
        if skill_id not in self.graph:
            raise KeyError(f"Unknown skill: {skill_id}")
        now = now or _now()
        st = self.state(skill_id)
        params = self.params_for(skill_id)

        # Slow correct answers are weaker evidence (matches MA time-weighting).
        evidence_weight = 1.0
        if correct and time_taken_ms and expected_ms and time_taken_ms > expected_ms * 2:
            evidence_weight = max(0.4, expected_ms / time_taken_ms)

        st.belief = self.model.update_belief(st.belief, correct, params, evidence_weight)
        st.attempts += 1
        st.correct += 1 if correct else 0

        if correct:
            st.rep += 1.0 * evidence_weight
            st.consecutive_failures = 0
        else:
            # A miss costs repetitions (memory shaken), worse on repeated misses.
            st.rep = max(0.0, st.rep - (1.0 + st.consecutive_failures * 0.5))
            st.consecutive_failures += 1

        st.learning_speed = self.model.update_learning_speed(st.learning_speed, correct)
        st.last_practice = now.isoformat()

        # FIRe: prerequisites get partial, distance-discounted credit.
        self._apply_implicit_credit(skill_id, correct, now)
        return st

    def _apply_implicit_credit(self, skill_id: str, correct: bool, now: datetime):
        if not correct:
            return
        for pre_id in self.graph.prerequisite_chain(skill_id):
            pre = self.skills.get(pre_id)
            if pre is None:
                continue  # only reinforce skills the student has actually touched
            depth = self.graph.depth_between(skill_id, pre_id)
            discount = max(0.1, 0.4 / max(depth, 1))
            params = self.params_for(pre_id)
            pre.belief = self.model.update_belief(
                pre.belief, True, params, evidence_weight=discount
            )
            # Light memory refresh, scaled by discount.
            pre.rep += discount * 0.5
            pre.last_practice = now.isoformat()

    # ---- queries ----
    def effective_mastery(self, skill_id: str, now: Optional[datetime] = None) -> float:
        now = now or _now()
        st = self.skills.get(skill_id)
        if st is None:
            return self.params_for(skill_id).p_l0
        days = _days_between(now, _parse(st.last_practice))
        return self.model.effective_mastery(st.belief, days, st.rep, st.learning_speed)

    def is_mastered(self, skill_id: str, now: Optional[datetime] = None) -> bool:
        return self.effective_mastery(skill_id, now) >= self.model.mastery_threshold

    def prereqs_met(self, skill_id: str, now: Optional[datetime] = None) -> bool:
        skill = self.graph.get(skill_id)
        if not skill or not skill.prerequisites:
            return True
        return all(self.is_mastered(p, now) for p in skill.prerequisites)

    # ---- serialization (for the JS UI / Supabase) ----
    def to_dict(self) -> dict:
        return {
            "subject": self.graph.subject,
            "diagnosed": self.diagnosed,
            "total_xp": self.total_xp,
            "skills": {sid: st.to_dict() for sid, st in self.skills.items()},
        }

    @staticmethod
    def from_dict(graph: KnowledgeGraph, data: dict,
                  model: Optional[MasteryModel] = None) -> "StudentModel":
        sm = StudentModel(graph, model=model)
        sm.diagnosed = data.get("diagnosed", False)
        sm.total_xp = data.get("total_xp", 0)
        for sid, sd in (data.get("skills") or {}).items():
            if sid in graph:
                sm.skills[sid] = SkillState.from_dict(sd)
        return sm
