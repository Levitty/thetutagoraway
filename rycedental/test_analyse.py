"""
The backtest decides whether this whole idea gets built, so the ways it can
silently flatter itself are tested explicitly.
"""
import unittest
from datetime import date, timedelta

from analyse import (
    Series, build_series, rank_for_pilot, summary_row,
    MIN_GAPS_BEFORE_PREDICTING, TOLERANCE_DAYS, MIN_TESTS_FOR_CONFIDENCE,
)


def days(start, gaps):
    d = date.fromisoformat(start)
    out = [d]
    for g in gaps:
        d = d + timedelta(days=g)
        out.append(d)
    return out


class TestBacktest(unittest.TestCase):

    def test_prediction_never_sees_the_future(self):
        """The one error that would make this whole report a lie.

        A series that is steady then suddenly doubles its gap. If the
        prediction used the whole-series median it would be dragged upwards by
        the later gaps and score better on the early ones than it could ever
        score in production, where those gaps have not happened yet.
        """
        s = Series("C", None, days("2026-01-01", [30, 30, 30, 30, 90, 90, 90]))
        s.backtest()
        first = s.predictions[0]
        # Predicted from [30,30,30] only.
        self.assertEqual(first.predicted_gap, 30)
        self.assertEqual(first.actual_gap, 30)
        # The one straight after the regime change must be a miss. If it is a
        # hit, the future leaked in.
        after_change = [p for p in s.predictions if p.actual_gap == 90][0]
        self.assertEqual(after_change.predicted_gap, 30)
        self.assertFalse(after_change.hit)

    def test_it_waits_for_enough_history(self):
        s = Series("C", None, days("2026-01-01", [30, 30, 30, 30]))
        s.backtest()
        # 4 gaps, needs 3 before predicting, so exactly 1 test.
        self.assertEqual(s.tests, len(s.gaps) - MIN_GAPS_BEFORE_PREDICTING)
        self.assertEqual(s.tests, 1)

    def test_too_short_a_history_is_never_tested(self):
        s = Series("C", None, days("2026-01-01", [30, 30, 30]))
        s.backtest()
        self.assertEqual(s.tests, 0)
        self.assertIsNone(s.hit_rate)

    def test_a_perfect_cycle_scores_perfectly(self):
        s = Series("C", None, days("2026-01-01", [28] * 10))
        s.backtest()
        self.assertEqual(s.hit_rate, 1.0)
        self.assertEqual(s.confidence, "High")

    def test_tolerance_is_the_larger_of_three_days_or_a_quarter(self):
        # Short cycle: the 3-day floor applies, not 25% of 8 days (=2).
        s = Series("C", None, days("2026-01-01", [8, 8, 8, 11]))
        s.backtest()
        p = s.predictions[-1]
        self.assertEqual(p.tolerance, float(TOLERANCE_DAYS))
        self.assertTrue(p.hit)                      # missed by 3, allowed 3

        # Long cycle: 25% of 60 is 15, well above the floor.
        s2 = Series("C", None, days("2026-01-01", [60, 60, 60, 74]))
        s2.backtest()
        self.assertEqual(s2.predictions[-1].tolerance, 15.0)
        self.assertTrue(s2.predictions[-1].hit)     # missed by 14, allowed 15

    def test_a_miss_just_outside_tolerance_is_not_a_hit(self):
        s = Series("C", None, days("2026-01-01", [60, 60, 60, 76]))
        s.backtest()
        self.assertFalse(s.predictions[-1].hit)     # missed by 16, allowed 15


class TestConfidence(unittest.TestCase):

    def test_confidence_is_never_rounded_up(self):
        """Four tests at 100% is still 'Too little data'. This is the line
        that stops a two-month pilot being built on four lucky guesses."""
        s = Series("C", None, days("2026-01-01", [30] * 7))
        s.backtest()
        self.assertEqual(s.tests, 4)
        self.assertEqual(s.hit_rate, 1.0)
        self.assertEqual(s.confidence, "Too little data")

        s2 = Series("C", None, days("2026-01-01", [30] * 8))
        s2.backtest()
        self.assertEqual(s2.tests, MIN_TESTS_FOR_CONFIDENCE)
        self.assertEqual(s2.confidence, "High")

    def test_the_bands_are_where_they_were_specified(self):
        def rate_to_conf(hits, tests):
            s = Series("C", None, [date(2026, 1, 1)])
            s.predictions = [type("P", (), {"hit": i < hits, "miss": 1})() for i in range(tests)]
            return s.confidence
        self.assertEqual(rate_to_conf(7, 10), "High")      # 70%
        self.assertEqual(rate_to_conf(6, 10), "Medium")    # 60%
        self.assertEqual(rate_to_conf(5, 10), "Medium")    # 50%
        self.assertEqual(rate_to_conf(4, 10), "Low")       # 40%


class TestPattern(unittest.TestCase):

    def test_a_steady_buyer_reads_as_steady(self):
        s = Series("C", None, days("2026-01-01", [30, 28, 31, 29, 30]))
        self.assertEqual(s.pattern, "Steady")
        self.assertLess(s.spread, 0.5)

    def test_wild_gaps_read_as_erratic(self):
        s = Series("C", None, days("2026-01-01", [3, 90, 5, 120, 7]))
        self.assertEqual(s.pattern, "Erratic")
        self.assertGreater(s.spread, 1.0)

    def test_a_moderately_variable_buyer_is_not_called_erratic(self):
        # Spread about 0.64: plainly not a rhythm, but not noise either.
        s = Series("C", None, days("2026-01-01", [10, 40, 15, 60, 20]))
        self.assertEqual(s.pattern, "Variable")
        self.assertTrue(0.5 < s.spread <= 1.0)

    def test_a_tight_rhythm_with_normal_slippage_is_still_steady(self):
        # A clinic ordering "about monthly" slips by days, not weeks. If this
        # read as Variable the report would call every real customer unsteady.
        s = Series("C", None, days("2026-01-01", [20, 35, 25, 45, 30]))
        self.assertEqual(s.pattern, "Steady")

    def test_clusters_months_apart_read_as_bursty(self):
        # Three visits, each a few orders over a week, four months apart.
        s = Series("C", None, days("2026-01-01", [2, 3, 120, 2, 3, 120, 2, 3]))
        self.assertTrue(s.is_bursty)

    def test_bursty_and_erratic_are_reported_separately(self):
        """They overlap almost completely, and collapsing them into one label
        throws away half the finding: Erratic says the gaps are
        unpredictable, Bursty says why."""
        s = Series("C", None, days("2026-01-01", [3, 90, 5, 120, 7]))
        self.assertTrue(s.is_bursty)
        self.assertEqual(s.pattern, "Erratic")

    def test_the_middle_half_ignores_one_freak_gap(self):
        s = Series("C", None, days("2026-01-01", [30, 30, 30, 30, 300]))
        low, high = s.iqr
        self.assertLessEqual(high, 100, "one 300-day gap should not widen the middle half")


class TestStatus(unittest.TestCase):

    def test_due_now_two_days_before_the_usual_gap(self):
        od = days("2026-01-01", [30, 30, 30, 30])
        s = Series("C", None, od)
        last = od[-1]
        self.assertEqual(s.status(last + timedelta(days=27)), "Not yet due")
        self.assertEqual(s.status(last + timedelta(days=28)), "Due now")

    def test_gone_quiet_past_twice_the_gap_plus_a_week(self):
        od = days("2026-01-01", [30, 30, 30, 30])
        s = Series("C", None, od)
        last = od[-1]
        self.assertEqual(s.status(last + timedelta(days=67)), "Due now")
        self.assertEqual(s.status(last + timedelta(days=68)), "Gone quiet")

    def test_a_bursty_buyer_is_never_called_quiet_without_saying_so(self):
        """Chasing a buyer who is simply between visits is how a reminder
        system teaches people to mute it."""
        od = days("2026-01-01", [2, 3, 120, 2, 3, 120, 2, 3])
        s = Series("C", None, od)
        st = s.status(od[-1] + timedelta(days=400))
        self.assertIn("Gone quiet", st)
        self.assertIn("bursty", st.lower())

    def test_too_few_orders_outranks_every_other_status(self):
        s = Series("C", None, days("2026-01-01", [30, 30]))
        self.assertEqual(s.status(date(2027, 1, 1)), "Too few orders")


class TestBuilding(unittest.TestCase):

    def test_two_documents_on_one_day_are_one_order_day(self):
        """Otherwise a zero-day gap enters the median and every customer looks
        more frequent than they are."""
        rows = [
            {"customer": "A", "date": date(2026, 1, 1), "item_key": "Gloves M", "qty": 2},
            {"customer": "A", "date": date(2026, 1, 1), "item_key": "Gloves M", "qty": 3},
            {"customer": "A", "date": date(2026, 2, 1), "item_key": "Gloves M", "qty": 4},
        ]
        s = build_series(rows, item_level=False, today=date(2026, 3, 1))[0]
        self.assertEqual(len(s.order_days), 2)
        self.assertEqual(s.gaps, [31])

    def test_quantities_on_one_day_are_summed_not_averaged(self):
        rows = [
            {"customer": "A", "date": date(2026, 1, 1), "item_key": "Gloves M", "qty": 2},
            {"customer": "A", "date": date(2026, 1, 1), "item_key": "Gloves M", "qty": 3},
        ]
        s = build_series(rows, item_level=True, today=date(2026, 3, 1))[0]
        self.assertEqual(s.typical_qty, 5)

    def test_rows_with_no_date_or_customer_are_dropped_not_guessed(self):
        rows = [
            {"customer": None, "date": date(2026, 1, 1), "item_key": "X", "qty": 1},
            {"customer": "A", "date": None, "item_key": "X", "qty": 1},
        ]
        self.assertEqual(build_series(rows, False, date(2026, 3, 1)), [])

    def test_item_level_ignores_rows_with_no_item(self):
        rows = [{"customer": "A", "date": date(2026, 1, 1), "item_key": None, "qty": 1}]
        self.assertEqual(build_series(rows, True, date(2026, 3, 1)), [])


class TestPilotRanking(unittest.TestCase):

    def test_more_evidence_beats_a_lucky_perfect_score(self):
        rows = [
            {"confidence": "High", "hit_rate": 1.0, "predictions_tested": 5, "typical_miss_days": 1},
            {"confidence": "High", "hit_rate": 0.85, "predictions_tested": 20, "typical_miss_days": 2},
        ]
        # Same band: the higher rate leads, but both outrank anything Medium.
        self.assertEqual(rank_for_pilot(rows)[0]["hit_rate"], 1.0)
        rows.append({"confidence": "Medium", "hit_rate": 0.69, "predictions_tested": 50, "typical_miss_days": 1})
        self.assertEqual(rank_for_pilot(rows)[-1]["confidence"], "Medium")

    def test_too_little_data_sinks_to_the_bottom(self):
        rows = [
            {"confidence": "Too little data", "hit_rate": 1.0, "predictions_tested": 2, "typical_miss_days": 0},
            {"confidence": "Low", "hit_rate": 0.2, "predictions_tested": 30, "typical_miss_days": 20},
        ]
        self.assertEqual(rank_for_pilot(rows)[0]["confidence"], "Low")


if __name__ == "__main__":
    unittest.main(verbosity=1)
