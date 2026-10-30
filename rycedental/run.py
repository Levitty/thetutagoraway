"""
One command: documents folder + Zoho CSV in, workbook out.

    python3 run.py --docs "/path/From Docs" --zoho /path/Invoice.csv \
                   --out /path/Rycedental_reorder_review.xlsx

Nothing is written outside --out, and nothing is uploaded anywhere.
"""
from __future__ import annotations

import argparse
import csv
import sys
from collections import Counter
from datetime import date
from pathlib import Path

import analyse
import clean
import extract
import workbook


def load_zoho(path: Path, resolver: clean.CustomerResolver):
    """Zoho Books export: dates only, so customer-level timing only.

    Drafts ARE counted: she has confirmed they are real deliveries. That is a
    big call and it is recorded on the Read me sheet, because 314 of the 2026
    invoices are drafts and excluding them would change nearly every answer.
    """
    rows, skipped = [], []
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        cols = {c.lower().strip(): c for c in (reader.fieldnames or [])}

        def pick(*names):
            for n in names:
                for low, orig in cols.items():
                    if low == n or low.replace(" ", "").replace("_", "") == n.replace(" ", ""):
                        return orig
            for n in names:
                for low, orig in cols.items():
                    if n in low:
                        return orig
            return None

        c_date = pick("invoice date", "date")
        c_cust = pick("customer name", "customer", "company name")
        c_num = pick("invoice number", "invoice no", "invoice id")
        c_status = pick("invoice status", "status")
        c_terms = pick("payment terms", "terms")
        if not c_date or not c_cust:
            raise SystemExit(f"Zoho CSV has no recognisable date/customer column. Saw: {reader.fieldnames}")

        for i, r in enumerate(reader, 2):
            d = extract.parse_date(str(r.get(c_date) or ""))
            cust_raw = (r.get(c_cust) or "").strip()
            if not d or not cust_raw:
                skipped.append({"Source file": path.name, "Doc type": "zoho invoice",
                                "Why it could not be used": f"line {i}: missing date or customer"})
                continue
            rows.append({
                "date": d, "customer": resolver.add(cust_raw), "doc_type": "zoho_invoice",
                "doc_no": (r.get(c_num) or "").strip() if c_num else None,
                "item_key": None, "qty": None, "unit_price": None, "total": None,
                "description": None, "source_file": path.name,
                "status": (r.get(c_status) or "").strip() if c_status else "",
                "terms": (r.get(c_terms) or "").strip() if c_terms else "",
            })
    return rows, skipped


def main(argv=None):
    ap = argparse.ArgumentParser(description="Rycedental reorder predictability review")
    ap.add_argument("--docs", required=True, help='folder of .docx/.xlsx/.xls (the "From Docs" folder)')
    ap.add_argument("--zoho", help="Invoice.csv exported from Zoho Books")
    ap.add_argument("--out", required=True, help="workbook to write")
    ap.add_argument("--today", help="YYYY-MM-DD, defaults to today")
    args = ap.parse_args(argv)

    today = date.fromisoformat(args.today) if args.today else date.today()
    docs_dir = Path(args.docs)
    if not docs_dir.is_dir():
        raise SystemExit(f"Not a folder: {docs_dir}")

    # ---- 1. extract -------------------------------------------------------
    print(f"Reading documents under {docs_dir} ...", file=sys.stderr)
    docs = extract.walk(docs_dir)
    print(f"  {len(docs)} files", file=sys.stderr)

    resolver = clean.CustomerResolver()
    order_rows, quote_rows, unreadable = [], [], []

    for d in docs:
        fatal = [n for n in d.notes if "NO DATE FOUND" in n or "could not open" in n
                 or "corrupt" in n or "unsupported" in n]
        if d.doc_type == "unknown":
            fatal.append("document type not recognised from the file name")
        if not d.items and d.doc_type in extract.ORDER_TYPES:
            fatal.append("no line items could be read")
        if fatal:
            unreadable.append({"Source file": d.source_file, "Doc type": d.doc_type,
                               "Why it could not be used": "; ".join(sorted(set(fatal)))})
            continue
        cust = resolver.add(d.customer) if d.customer else None
        if not cust:
            unreadable.append({"Source file": d.source_file, "Doc type": d.doc_type,
                               "Why it could not be used": "no customer name could be read"})
            continue
        for row in d.as_rows():
            row["customer"] = cust
            row["item_key"] = clean.item_key(row["description"])
            (quote_rows if d.doc_type in extract.NON_ORDER_TYPES else order_rows).append(row)

    # ---- 2. clean ---------------------------------------------------------
    dd = clean.dedupe_orders(order_rows)
    print(f"  {len(dd.kept)} order lines kept, {len(dd.dropped)} folded into a matching document",
          file=sys.stderr)

    # ---- 3. combine with Zoho --------------------------------------------
    zoho_rows, zoho_skipped = ([], [])
    if args.zoho:
        zoho_rows, zoho_skipped = load_zoho(Path(args.zoho), resolver)
        unreadable += zoho_skipped
        print(f"  {len(zoho_rows)} Zoho invoices (dates only)", file=sys.stderr)

    customer_level_rows = dd.kept + zoho_rows      # timing: documents AND Zoho
    item_level_rows = dd.kept                       # items: documents only

    # ---- 4-6. model, backtest, rate, status ------------------------------
    cust_series = analyse.build_series(customer_level_rows, item_level=False, today=today)
    item_series = analyse.build_series(item_level_rows, item_level=True, today=today)

    by_customer = [analyse.summary_row(s, today, False) for s in cust_series]
    by_customer.sort(key=lambda r: (-(r["order_days"] or 0), r["customer"]))
    by_item = analyse.rank_for_pilot([analyse.summary_row(s, today, True) for s in item_series])

    backtest = [{
        "Series": p.series, "Customer": p.customer, "Item": p.item or "",
        "Order date": p.order_date, "Predicted gap (days)": p.predicted_gap,
        "Actual gap (days)": p.actual_gap, "Miss (days)": p.miss,
        "Tolerance (days)": p.tolerance, "Hit": "yes" if p.hit else "no",
    } for s in (cust_series + item_series) for p in s.predictions]

    # ---- pilot shortlist --------------------------------------------------
    pilot = []
    for r in by_item:
        if r["confidence"] not in ("High", "Medium"):
            continue
        if r["pattern"] == "Erratic" or r["bursty"] == "yes":
            continue
        why = (f'{r["confidence"].lower()} confidence from {r["predictions_tested"]} tested '
               f'predictions, usually every {r["usual_gap_days"]:.0f} days, typically out by '
               f'{r["typical_miss_days"]:.0f}')
        pilot.append({
            "Customer": r["customer"], "Item": r["item_key"], "Confidence": r["confidence"],
            "Hit rate": r["hit_rate"], "Predictions tested": r["predictions_tested"],
            "Usual gap (days)": r["usual_gap_days"], "Typical miss (days)": r["typical_miss_days"],
            "Typical qty per order": r["typical_qty_per_order"], "Why this pair": why,
        })
        if len(pilot) >= 20:
            break

    # ---- the workbook -----------------------------------------------------
    def to_sheet(rows):
        return [{
            "Date": r.get("date"), "Doc type": r.get("doc_type"), "Doc no": r.get("doc_no"),
            "Customer": r.get("customer"), "Item key": r.get("item_key"),
            "Original description": r.get("description"), "Qty": r.get("qty"),
            "Unit price": r.get("unit_price"), "Total": r.get("total"),
            "Source file": r.get("source_file"),
        } for r in rows]

    consts = {k: getattr(analyse, k) for k in (
        "TOLERANCE_DAYS", "TOLERANCE_FRACTION", "MIN_GAPS_BEFORE_PREDICTING",
        "MIN_TESTS_FOR_CONFIDENCE", "HIGH_HIT_RATE", "MEDIUM_HIT_RATE", "ERRATIC_CV",
        "DUE_SOON_DAYS", "QUIET_MULTIPLE", "QUIET_EXTRA_DAYS", "MIN_ORDER_DAYS_FOR_STATUS")}

    order_days_total = sum(len(s.order_days) for s in cust_series)
    meta = {"today": today, "doc_count": len(docs),
            "order_docs": len({(r["doc_type"], r["doc_no"], r["date"]) for r in dd.kept}),
            "zoho_count": len(zoho_rows), "order_days": order_days_total}

    out = workbook.build(
        args.out, meta=meta, consts=consts,
        by_customer=by_customer, by_item=by_item, pilot=pilot, backtest=backtest,
        line_items=to_sheet(dd.kept), quotes=to_sheet(quote_rows),
        cust_map=resolver.merges(),
        item_map=clean.item_mappings([r["description"] for r in dd.kept + quote_rows if r.get("description")]),
        unreadable=unreadable)

    print(f"\nWrote {out}", file=sys.stderr)
    print(f"  customers: {len(by_customer)}   customer/item pairs: {len(by_item)}", file=sys.stderr)
    print(f"  backtested predictions: {len(backtest)}", file=sys.stderr)
    print(f"  pilot shortlist: {len(pilot)}", file=sys.stderr)
    print(f"  unreadable: {len(unreadable)}", file=sys.stderr)
    conf = Counter(r["confidence"] for r in by_item)
    print(f"  item-level confidence: {dict(conf)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
