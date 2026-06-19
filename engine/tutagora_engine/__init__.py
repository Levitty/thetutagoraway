"""
Tutagora mastery engine — the Python "brain".

A subject-agnostic adaptive learning engine inspired by The Math Academy Way:
a knowledge graph of skills, Bayesian mastery tracking with forgetting,
diagnostic placement, and frontier-based task selection.

The student-facing UI stays in JS; this package is the measurement +
decision core that the UI calls (see api.py).
"""

from .graph import KnowledgeGraph, Skill, load_graph
from .state import StudentModel, SkillState
from .mastery import BKTParams, MasteryModel
from .scheduler import Scheduler, Recommendation
from .ability import AbilityEstimator, KnowledgeProfile

__all__ = [
    "KnowledgeGraph",
    "Skill",
    "load_graph",
    "StudentModel",
    "SkillState",
    "BKTParams",
    "MasteryModel",
    "Scheduler",
    "Recommendation",
    "AbilityEstimator",
    "KnowledgeProfile",
]

__version__ = "0.1.0"
