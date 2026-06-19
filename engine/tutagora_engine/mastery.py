"""
The mastery model — the heart of the engine.

It answers one question per skill: *what is the probability this student has
mastered this skill, right now?*  Two ideas combine:

1. Bayesian Knowledge Tracing (BKT)
   A hidden binary "known/not-known" state per skill, updated after every
   answer. Unlike a correct/total ratio, it is principled: a slip on a known
   skill barely dents mastery, a lucky guess barely raises it, and the model
   knows the difference. Parameters (slip/guess) scale with skill difficulty.

2. Forgetting (the spaced-repetition layer)
   Knowledge decays without practice. We track a memory "stability" that grows
   with each successful, spaced repetition (FIRe-style), and compute
   *retrievability* from time elapsed. Effective mastery = BKT belief damped by
   how retrievable the skill is right now. This is what surfaces reviews.

Pure stdlib; no numpy needed.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

# ----------------------------------------------------------------------------
# BKT parameters
# ----------------------------------------------------------------------------


@dataclass(frozen=True)
class BKTParams:
    """
    Standard 4-parameter BKT.

    p_l0    prior P(known) before any evidence
    p_t     P(unknown -> known) per learning opportunity (learn rate)
    p_slip  P(answer wrong | known)
    p_guess P(answer right | not known)
    """
    p_l0: float = 0.15
    p_t: float = 0.20
    p_slip: float = 0.10
    p_guess: float = 0.20

    @staticmethod
    def for_skill(weight: float, prior: float = 0.15) -> "BKTParams":
        """
        Difficulty-aware parameters. Harder skills (higher weight) slip more,
        are guessed less, and are learned a little slower per opportunity.
        weight is roughly 1..8.
        """
        w = max(1.0, min(8.0, weight))
        norm = (w - 1.0) / 7.0  # 0 (easy) .. 1 (hard)
        return BKTParams(
            p_l0=prior,
            p_t=0.30 - 0.12 * norm,        # 0.30 (easy) .. 0.18 (hard)
            p_slip=0.06 + 0.14 * norm,     # 0.06 (easy) .. 0.20 (hard)
            p_guess=0.25 - 0.15 * norm,    # 0.25 (easy) .. 0.10 (hard)
        )


# ----------------------------------------------------------------------------
# Memory / forgetting
# ----------------------------------------------------------------------------

# Stability (in days) after the n-th successful spaced repetition. Each clean
# repetition roughly multiplies how long the memory survives. This is the
# expanding-interval schedule, learned implicitly rather than fixed per-skill.
_STABILITY_BY_REP = [0.5, 1.0, 3.0, 7.0, 16.0, 35.0, 75.0, 160.0, 340.0]


def stability_for_rep(rep: float, learning_speed: float = 1.0) -> float:
    """Memory stability (days) for a (possibly fractional) repetition count."""
    rep = max(0.0, rep)
    lo = int(math.floor(rep))
    hi = min(lo + 1, len(_STABILITY_BY_REP) - 1)
    lo = min(lo, len(_STABILITY_BY_REP) - 1)
    frac = rep - math.floor(rep)
    base = _STABILITY_BY_REP[lo] * (1 - frac) + _STABILITY_BY_REP[hi] * frac
    # A faster learner retains longer per repetition.
    return base * max(0.4, min(2.5, learning_speed))


def retrievability(days_since: float, stability: float) -> float:
    """
    Probability the memory is still retrievable: R = exp(-t / S).
    At t == S, R ≈ 0.37; reviews are scheduled before that.
    """
    if days_since <= 0:
        return 1.0
    return math.exp(-days_since / max(stability, 1e-6))


class MasteryModel:
    """Stateless updater — operates on plain (belief, rep, ...) numbers."""

    def __init__(self, mastery_threshold: float = 0.90):
        # Effective-mastery bar at which a skill counts as "mastered" for the
        # frontier. Higher than typical accuracy thresholds — Math Academy style.
        self.mastery_threshold = mastery_threshold

    # ---- BKT update ----
    @staticmethod
    def update_belief(belief: float, correct: bool, params: BKTParams,
                      evidence_weight: float = 1.0) -> float:
        """
        Posterior P(known) after one observation, then apply the learn step.

        evidence_weight in (0, 1] softens weak signals (slow answers, implicit
        credit from a postrequisite). 1.0 = a full, clean observation.
        """
        b = min(max(belief, 1e-6), 1 - 1e-6)

        if correct:
            num = b * (1 - params.p_slip)
            den = num + (1 - b) * params.p_guess
        else:
            num = b * params.p_slip
            den = num + (1 - b) * (1 - params.p_guess)
        posterior = num / den if den > 0 else b

        # Soften: blend posterior with the prior belief by evidence strength.
        ew = max(0.0, min(1.0, evidence_weight))
        posterior = b + (posterior - b) * ew

        # Learning step: only a SUCCESSFUL opportunity moves unknown -> known.
        # (Applying it on failures too is standard BKT but lets a wrong answer
        # raise measured mastery when the prior is low — undesirable for an
        # engine whose job is to *measure* mastery. So we gate it on `correct`.)
        if correct:
            learned = posterior + (1 - posterior) * params.p_t * ew
        else:
            learned = posterior
        return min(max(learned, 1e-6), 1 - 1e-6)

    # ---- effective mastery (BKT damped by retrievability) ----
    @staticmethod
    def effective_mastery(belief: float, days_since: float, rep: float,
                          learning_speed: float = 1.0) -> float:
        """
        What we actually trust right now: belief × retrievability.

        A skill once mastered but not practiced for a long time has high belief
        but low retrievability — so effective mastery drops and it surfaces for
        review, exactly as intended.
        """
        if rep <= 0 and days_since <= 0:
            return belief  # freshly learned, never decayed yet
        stab = stability_for_rep(rep, learning_speed)
        return belief * retrievability(days_since, stab)

    # ---- learning-speed adaptation ----
    @staticmethod
    def update_learning_speed(speed: float, correct: bool) -> float:
        delta = 0.05 if correct else -0.08
        return round(max(0.4, min(2.5, speed + delta)), 3)
