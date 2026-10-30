"""
Steps 3-6 — order days, gaps, the backtest, confidence and status.

The method is exactly as specified, and the specification is a good one
because it is honest: predict from the past only, test against what actually
happened next, and report the hit rate rather than a fitted curve.

Two things here decide whether the answer means anything:

1. THE BACKTEST ONLY EVER LOOKS BACKWARDS. At each order the prediction uses
   the median of the gaps BEFORE it. Using the whole series median would quote
   a hit rate the system could never achieve in production, because in
   production the future gaps are not available. This is the single easiest
   way to produce a flattering, useless number, so it is tested explicitly.

2. A HIT IS GENEROUS ON PURPOSE. Within 3 days, or 25% of the predicted gap,
   whichever is larger. For a 60-day cycle that allows 15 days either way,
   which is right for a reminder: being a fortnight early on a two-month cycle
   is useful, not wrong. It also means a high hit rate is NOT a claim of
   precision, and the write-up must not imply it is.
"""
from __future__ import annotations

import statistics
from dataclasses import dataclass, field
from datetime import date, timedelta

# ------------------------------------------------------------ editable rules
# Mirrored into the Assumptions sheet. Change there and the workbook formulas
# follow; change here and the Python follows.
MIN_GAPS_BEFORE_PREDICTING = 3    # need this many earlier gaps to predict
TOLERANCE_DAYS = 3                # a miss of this many days is still a hit
TOLERANCE_FRACTION = 0.25         # or this share of the predicted gap
MIN_TESTS_FOR_CONFIDENCE = 5      # fewer than this is "Too little data"
HIGH_HIT_RATE = 0.70
MEDIUM_HIT_RATE = 0.50
ERRATIC_CV = 1.0                  # std/mean above this is "Erratic"
DUE_SOON_DAYS = 2                 # due when days since >= usual gap - this
QUIET_MULTIPLE = 2.0              # quiet when days since > this x gap + below
QUIET_EXTRA_DAYS = 7
MIN_ORDER_DAYS_FOR_STATUS = 4     # fewer than this is "Too few orders"
BURST_CLUSTER_DAYS = 14           # orders this close are one shopping trip
BURST_MIN_CLUSTERS = 2


@dataclass
class Prediction:
    series: str
    customer: str
    item: str | None
    order_date: date
    predicted_gap: float
    actual_gap: int
    miss: float
    tolerance: float
    hit: bool


@dataclass
class Series:
    customer: str
    item: str | None
    order_days: list[date]
    quantities: list[float] = field(default_factory=list)
    predictions: list[Prediction] = field(default_factory=list)

    # ---- shape of the history ------------------------------------------
    @property
    def gaps(self) -> list[int]:
        return [(b - a).days for a, b in zip(self.order_days, self.order_days[1:])]

    @property
    def usual_gap(self) -> float | None:
        g = self.gaps
        return statistics.median(g) if g else None

    @property
    def iqr(self) -> tuple[float, float] | None:
        """The middle half of the gaps: a far better guide to what to expect
        than the min and max, which are both usually one freak order."""
        g = sorted(self.gaps)
        if len(g) < 4:
            return (g[0], g[-1]) if g else None
        qs = statistics.quantiles(g, n=4, method="inclusive")
        return (qs[0], qs[2])

    @property
    def spread(self) -> float | None:
        """Coefficient of variation: std / mean. Unitless, so a 7-day cycle
        and a 90-day cycle can be compared."""
        g = self.gaps
        if len(g) < 2:
            return None
        m = statistics.mean(g)
        return (statistics.pstdev(g) / m) if m else None

    @property
    def typical_qty(self) -> float | None:
        q = [x for x in self.quantities if x is not None]
        return statistics.median(q) if q else None

    @property
    def is_bursty(self) -> bool:
        """Orders arriving in clusters months apart, rather than a rhythm.

        Worth separating because such a buyer looks 'gone quiet' between
        clusters when they are simply between visits, and chasing them with a
        reminder is how a system teaches people to ignore it.
        """
        if len(self.order_days) < 4:
            return False
        clusters, current = 1, self.order_days[0]
        for d in self.order_days[1:]:
            if (d - current).days > BURST_CLUSTER_DAYS:
                clusters += 1
            current = d
        if clusters < BURST_MIN_CLUSTERS:
            return False
        # Clusters, not a rhythm: several orders bunched into few clusters.
        return len(self.order_days) >= clusters * 2 and (self.spread or 0) > 0.6

    @property
    def pattern(self) -> str:
        """How regular the gaps are, from the spread alone.

        Kept SEPARATE from `is_bursty` on purpose. The two overlap almost
        completely — clusters months apart are what produce a spread above 1 —
        so folding them into one label loses the distinction that matters:
        "Erratic" says the gaps are unpredictable, "Bursty" says why, and a
        buyer is routinely both. Reporting one value forced a choice between
        them and threw away half the finding.
        """
        if len(self.order_days) < 3:
            return "Too few orders"
        s = self.spread
        if s is None:
            return "Unknown"
        if s > ERRATIC_CV:
            return "Erratic"
        if s > 0.5:
            return "Variable"
        return "Steady"

    # ---- the backtest ----------------------------------------------------
    def backtest(self) -> list[Prediction]:
        """Walk history forwards, predicting each gap from earlier gaps only."""
        self.predictions = []
        gaps = self.gaps
        for i in range(MIN_GAPS_BEFORE_PREDICTING, len(gaps)):
            earlier = gaps[:i]                       # strictly before: no peeking
            predicted = statistics.median(earlier)
            actual = gaps[i]
            miss = abs(actual - predicted)
            tol = max(TOLERANCE_DAYS, TOLERANCE_FRACTION * predicted)
            self.predictions.append(Prediction(
                series=self.name, customer=self.customer, item=self.item,
                order_date=self.order_days[i + 1], predicted_gap=round(predicted, 1),
                actual_gap=actual, miss=round(miss, 1), tolerance=round(tol, 1),
                hit=miss <= tol,
            ))
        return self.predictions

    @property
    def name(self) -> str:
        return f"{self.customer} / {self.item}" if self.item else self.customer

    @property
    def tests(self) -> int:
        return len(self.predictions)

    @property
    def hits(self) -> int:
        return sum(1 for p in self.predictions if p.hit)

    @property
    def hit_rate(self) -> float | None:
        return (self.hits / self.tests) if self.tests else None

    @property
    def typical_miss(self) -> float | None:
        if not self.predictions:
            return None
        return round(statistics.median([p.miss for p in self.predictions]), 1)

    # ---- the verdict -----------------------------------------------------
    @property
    def confidence(self) -> str:
        """Never rounded up. 4 tests at 100% is still 'Too little data'."""
        if self.tests < MIN_TESTS_FOR_CONFIDENCE:
            return "Too little data"
        r = self.hit_rate
        if r >= HIGH_HIT_RATE:
            return "High"
        if r >= MEDIUM_HIT_RATE:
            return "Medium"
        return "Low"

    def days_since(self, today: date) -> int | None:
        return (today - self.order_days[-1]).days if self.order_days else None

    def next_expected(self) -> date | None:
        g = self.usual_gap
        if g is None or not self.order_days:
            return None
        return self.order_days[-1] + timedelta(days=round(g))

    def status(self, today: date) -> str:
        if len(self.order_days) < MIN_ORDER_DAYS_FOR_STATUS:
            return "Too few orders"
        g, since = self.usual_gap, self.days_since(today)
        if g is None or since is None:
            return "Too few orders"
        if since > QUIET_MULTIPLE * g + QUIET_EXTRA_DAYS:
            # A bursty buyer between clusters is not a lapsed customer, and
            # saying so plainly is the difference between a useful alert and
            # one that gets muted.
            return "Gone quiet (bursty buyer - may be between clusters)" if self.is_bursty else "Gone quiet"
        if since >= g - DUE_SOON_DAYS:
            return "Due now"
        return "Not yet due"


# ------------------------------------------------------------------ building
def build_series(order_rows, item_level: bool, today: date) -> list[Series]:
    """
    order_rows: dicts with customer, date, and (for item level) item_key, qty.

    An "order day" is a customer and a date on which at least one order
    document exists. Two invoices on one day are one order day: the clinic
    placed one order, and counting two would create a zero-day gap that drags
    the median down for everybody.
    """
    from collections import defaultdict
    buckets: dict[tuple, dict[date, list[float]]] = defaultdict(lambda: defaultdict(list))
    for r in order_rows:
        cust = r.get("customer")
        d = r.get("date")
        if not cust or not d:
            continue
        key = (cust, r.get("item_key")) if item_level else (cust, None)
        if item_level and not key[1]:
            continue
        q = r.get("qty")
        buckets[key][d].append(q if isinstance(q, (int, float)) else None)

    out = []
    for (cust, item), days in buckets.items():
        order_days = sorted(days)
        # One quantity per order day: a day split across two lines of the same
        # item is one order of their sum.
        qtys = []
        for d in order_days:
            vals = [v for v in days[d] if v is not None]
            qtys.append(sum(vals) if vals else None)
        s = Series(customer=cust, item=item, order_days=order_days, quantities=qtys)
        s.backtest()
        out.append(s)
    return out


def summary_row(s: Series, today: date, item_level: bool) -> dict:
    iqr = s.iqr
    row = {
        "customer": s.customer,
        "order_days": len(s.order_days),
        "first_order": s.order_days[0] if s.order_days else None,
        "last_order": s.order_days[-1] if s.order_days else None,
        "usual_gap_days": round(s.usual_gap, 1) if s.usual_gap is not None else None,
        "middle_half_low": round(iqr[0], 1) if iqr else None,
        "middle_half_high": round(iqr[1], 1) if iqr else None,
        "spread": round(s.spread, 2) if s.spread is not None else None,
        "pattern": s.pattern,
        "bursty": "yes" if s.is_bursty else "no",
        "predictions_tested": s.tests,
        "hits": s.hits,
        "hit_rate": round(s.hit_rate, 3) if s.hit_rate is not None else None,
        "typical_miss_days": s.typical_miss,
        "days_since_last": s.days_since(today),
        "next_expected": s.next_expected(),
        "status": s.status(today),
        "confidence": s.confidence,
    }
    if item_level:
        row = {"customer": s.customer, "item_key": s.item,
               **{k: v for k, v in row.items() if k != "customer"},
               "typical_qty_per_order": s.typical_qty}
    return row


def rank_for_pilot(rows: list[dict]) -> list[dict]:
    """Most trustworthy first: confidence, then hit rate, then evidence.

    Deliberately NOT ranked by hit rate alone. A pair with 5 tests at 100% is
    weaker evidence than one with 20 tests at 85%, and a pilot built on the
    former will embarrass everyone involved.
    """
    order = {"High": 0, "Medium": 1, "Low": 2, "Too little data": 3}
    return sorted(
        rows,
        key=lambda r: (
            order.get(r.get("confidence"), 9),
            -(r.get("hit_rate") or 0),
            -(r.get("predictions_tested") or 0),
            r.get("typical_miss_days") if r.get("typical_miss_days") is not None else 999,
        ),
    )
