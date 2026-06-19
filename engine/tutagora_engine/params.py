"""
Calibrated-parameter store.

HOREB ships with heuristic priors (difficulty from grade+weight, BKT slip/guess
from difficulty). As real response data accumulates, the calibration job
(engine/scripts/calibrate.py) writes data/params.vN.json — data-driven
difficulty and BKT parameters per skill. The engine loads the latest here and
prefers calibrated values where they exist, falling back to heuristics
everywhere else. No data → no change in behaviour.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


class Params:
    """Calibrated per-skill parameters; empty = use heuristics."""

    def __init__(self, skills: Optional[dict] = None, version: str = "heuristic-v0"):
        self._skills = skills or {}
        self.version = version

    def difficulty(self, skill_id: str, default: float) -> float:
        v = self._skills.get(skill_id, {}).get("difficulty")
        return float(v) if v is not None else default

    def bkt(self, skill_id: str) -> Optional[dict]:
        """Return {p_l0,p_t,p_slip,p_guess} overrides for a skill, or None."""
        s = self._skills.get(skill_id)
        if not s:
            return None
        keys = ("p_l0", "p_t", "p_slip", "p_guess")
        got = {k: s[k] for k in keys if k in s and s[k] is not None}
        return got or None

    def __len__(self):
        return len(self._skills)


_CACHE: Optional[Params] = None


def _latest_params_file(data_dir: Path) -> Optional[Path]:
    files = sorted(data_dir.glob("params.v*.json"))
    return files[-1] if files else None


def load_params(reload: bool = False, data_dir: Optional[Path] = None) -> Params:
    """Load (and cache) the latest calibrated params; empty Params if none."""
    global _CACHE
    if _CACHE is not None and not reload:
        return _CACHE
    path = _latest_params_file(data_dir or DATA_DIR)
    if not path:
        _CACHE = Params()
        return _CACHE
    raw = json.loads(path.read_text())
    _CACHE = Params(skills=raw.get("skills", {}), version=raw.get("version", path.stem))
    return _CACHE
