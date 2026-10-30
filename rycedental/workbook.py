"""
The deliverable: one workbook, ten sheets.

The thresholds live on the Assumptions sheet and the summary sheets REFERENCE
them with real formulas, so she can move the hit-rate bar or the tolerance and
watch every confidence rating change. That is the point of shipping a
spreadsheet rather than a PDF: the judgement calls are hers, and she should be
able to argue with them without coming back to us.

Only the derived columns are formulas. The measured facts (order days, gaps,
hit counts) are values, because they come from the documents rather than from
a rule anyone should be adjusting.
"""
from __future__ import annotations

from datetime import date, datetime

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ARIAL = "Arial"
HEAD_FILL = PatternFill("solid", fgColor="1F3864")
INPUT_FILL = PatternFill("solid", fgColor="FFF2CC")
NOTE_FILL = PatternFill("solid", fgColor="F2F2F2")
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(bottom=THIN)

# Where each threshold lives, so formulas can point at it by name.
A = {
    "tolerance_days": "Assumptions!$B$4",
    "tolerance_fraction": "Assumptions!$B$5",
    "min_gaps": "Assumptions!$B$6",
    "min_tests": "Assumptions!$B$7",
    "high": "Assumptions!$B$8",
    "medium": "Assumptions!$B$9",
    "erratic_cv": "Assumptions!$B$10",
    "due_soon": "Assumptions!$B$11",
    "quiet_mult": "Assumptions!$B$12",
    "quiet_extra": "Assumptions!$B$13",
    "min_orders": "Assumptions!$B$14",
    "today": "Assumptions!$B$15",
}


def _style_header(ws, row=1, width_hint=None):
    for c in ws[row]:
        if c.value is None:
            continue
        c.font = Font(name=ARIAL, bold=True, color="FFFFFF", size=10)
        c.fill = HEAD_FILL
        c.alignment = Alignment(vertical="center", wrap_text=True)
    ws.freeze_panes = ws.cell(row=row + 1, column=1)
    ws.row_dimensions[row].height = 30


def _autosize(ws, min_w=9, max_w=46):
    widths = {}
    for row in ws.iter_rows():
        for c in row:
            if c.value is None:
                continue
            L = max(len(s) for s in str(c.value).split("\n"))
            widths[c.column] = max(widths.get(c.column, 0), min(L + 2, max_w))
    for col, w in widths.items():
        ws.column_dimensions[get_column_letter(col)].width = max(w, min_w)


def _write_table(ws, headers, rows, start_row=1):
    ws.append([]) if start_row > 1 and ws.max_row < start_row else None
    for j, h in enumerate(headers, 1):
        ws.cell(row=start_row, column=j, value=h)
    _style_header(ws, start_row)
    r = start_row + 1
    for row in rows:
        for j, h in enumerate(headers, 1):
            v = row.get(h)
            if isinstance(v, (date, datetime)):
                cell = ws.cell(row=r, column=j, value=v)
                cell.number_format = "dd/mm/yyyy"
            else:
                cell = ws.cell(row=r, column=j, value=v)
            cell.font = Font(name=ARIAL, size=10)
            cell.border = BORDER
        r += 1
    return r


def _apply_arial(wb):
    for ws in wb.worksheets:
        for row in ws.iter_rows():
            for c in row:
                if c.value is not None and (c.font is None or c.font.name != ARIAL):
                    c.font = Font(name=ARIAL, size=c.font.size or 10, bold=c.font.bold,
                                  color=c.font.color, italic=c.font.italic)


# --------------------------------------------------------------- the sheets
def _read_me(wb, meta: dict):
    ws = wb.create_sheet("Read me")
    lines = [
        ("Rycedental Supplies - reorder predictability review", True),
        ("", False),
        (f"Prepared {meta['today']:%d %B %Y}. Private: contains customer names and prices.", False),
        ("", False),
        ("WHAT THIS ANSWERS", True),
        ("Whether clinics reorder on a rhythm steady enough to predict, and how confident we", False),
        ("can be for each customer and item. It is a test of the idea, not a system.", False),
        ("", False),
        ("HOW A PREDICTION IS TESTED", True),
        ("History is replayed in date order. At each order, once a series has at least the", False),
        ("minimum number of earlier gaps, the next gap is predicted as the MEDIAN OF THE", False),
        ("EARLIER GAPS ONLY, then compared with what actually happened. Nothing from the", False),
        ("future is ever used. A hit is a miss within the tolerance on the Assumptions sheet.", False),
        ("", False),
        ("WHAT THE DATA IS", True),
        (f"Word and Excel documents: {meta.get('doc_count', 0)} files read, {meta.get('order_docs', 0)} of them orders.", False),
        (f"Zoho Books export: {meta.get('zoho_count', 0)} invoices, dates only.", False),
        (f"Order days after merging and de-duplication: {meta.get('order_days', 0)}.", False),
        ("", False),
        ("LIMITS - PLEASE READ BEFORE ACTING ON THIS", True),
        ("1. Zoho gives dates only, with no items or amounts. It therefore supports", False),
        ("   customer-level timing and nothing at item level.", False),
        ("2. The Word documents cover roughly March to July 2026. Four or five months is", False),
        ("   three to five order cycles for a monthly buyer, which is the bare minimum for", False),
        ("   a median to mean anything, and not enough to see seasonality at all.", False),
        ("3. A high hit rate is NOT precision. The tolerance is deliberately generous", False),
        ("   (see Assumptions), so a hit can still be a week out on a long cycle.", False),
        ("4. Drafts in Zoho are counted as real orders, on her instruction.", False),
        ("5. Quotes and statements are excluded from all timing. Quotes are not orders.", False),
        ("6. Item names were standardised automatically. Check the Mappings sheet before", False),
        ("   trusting any item-level figure: a wrong merge invents a pattern.", False),
        ("", False),
        ("ASSUMPTIONS", True),
        ("Every threshold is on the Assumptions sheet and the ratings recalculate when you", False),
        ("change it. If you disagree with a cut-off, move it and see what happens.", False),
    ]
    for text, bold in lines:
        c = ws.cell(row=ws.max_row + 1 if ws.max_row > 1 or ws["A1"].value else 1, column=1, value=text)
        c.font = Font(name=ARIAL, size=11 if bold else 10, bold=bold)
        c.alignment = Alignment(wrap_text=False)
    ws.column_dimensions["A"].width = 95
    return ws


def _assumptions(wb, today: date, consts: dict):
    ws = wb.create_sheet("Assumptions")
    ws["A1"] = "Assumptions - edit the yellow cells and the summary sheets recalculate"
    ws["A1"].font = Font(name=ARIAL, bold=True, size=11)
    ws["A3"], ws["B3"], ws["C3"] = "Setting", "Value", "What it does"
    for c in ws[3]:
        c.font = Font(name=ARIAL, bold=True, color="FFFFFF", size=10)
        c.fill = HEAD_FILL
    rows = [
        ("Tolerance (days)", consts["TOLERANCE_DAYS"],
         "A prediction missing by this many days still counts as a hit."),
        ("Tolerance (share of gap)", consts["TOLERANCE_FRACTION"],
         "Or this share of the predicted gap, whichever is larger."),
        ("Earlier gaps before predicting", consts["MIN_GAPS_BEFORE_PREDICTING"],
         "A series is not predicted until it has this many gaps behind it."),
        ("Minimum tests for a rating", consts["MIN_TESTS_FOR_CONFIDENCE"],
         "Fewer tested predictions than this is 'Too little data', whatever the hit rate."),
        ("High confidence hit rate", consts["HIGH_HIT_RATE"], "At or above this is High."),
        ("Medium confidence hit rate", consts["MEDIUM_HIT_RATE"], "At or above this is Medium; below is Low."),
        ("Erratic spread (std/mean)", consts["ERRATIC_CV"], "Above this the gaps are flagged Erratic."),
        ("Due now, days early", consts["DUE_SOON_DAYS"], "Due when days since last order reaches the usual gap minus this."),
        ("Gone quiet, multiple of gap", consts["QUIET_MULTIPLE"], "Quiet when days since exceed this multiple of the usual gap..."),
        ("Gone quiet, extra days", consts["QUIET_EXTRA_DAYS"], "...plus this many days."),
        ("Minimum order days for a status", consts["MIN_ORDER_DAYS_FOR_STATUS"], "Fewer than this is 'Too few orders'."),
        ("Today", today, "The date all statuses are measured from."),
    ]
    r = 4
    for label, value, note in rows:
        ws.cell(row=r, column=1, value=label).font = Font(name=ARIAL, size=10)
        c = ws.cell(row=r, column=2, value=value)
        c.font = Font(name=ARIAL, size=10, bold=True, color="0000FF")
        c.fill = INPUT_FILL
        if isinstance(value, date):
            c.number_format = "dd/mm/yyyy"
        elif isinstance(value, float) and value < 1:
            c.number_format = "0%"
        n = ws.cell(row=r, column=3, value=note)
        n.font = Font(name=ARIAL, size=9, italic=True)
        r += 1
    ws.column_dimensions["A"].width = 32
    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 78
    return ws


SUMMARY_COLS = [
    "customer", "order_days", "first_order", "last_order", "usual_gap_days",
    "middle_half_low", "middle_half_high", "spread", "pattern", "bursty",
    "predictions_tested", "hits", "hit_rate", "typical_miss_days",
    "days_since_last", "next_expected", "status", "confidence",
]
ITEM_COLS = SUMMARY_COLS[:1] + ["item_key"] + SUMMARY_COLS[1:] + ["typical_qty_per_order"]

NICE = {
    "customer": "Customer", "item_key": "Item", "order_days": "Order days",
    "first_order": "First order", "last_order": "Last order",
    "usual_gap_days": "Usual gap (days)", "middle_half_low": "Middle half from",
    "middle_half_high": "Middle half to", "spread": "Spread (std/mean)",
    "pattern": "Pattern", "bursty": "Bursty?", "predictions_tested": "Predictions tested",
    "hits": "Hits", "hit_rate": "Hit rate", "typical_miss_days": "Typical miss (days)",
    "days_since_last": "Days since last order", "next_expected": "Next expected order",
    "status": "Status", "confidence": "Confidence",
    "typical_qty_per_order": "Typical qty per order",
}


def _summary_sheet(wb, title, rows, cols):
    ws = wb.create_sheet(title)
    headers = [NICE.get(c, c) for c in cols]
    for j, h in enumerate(headers, 1):
        ws.cell(row=1, column=j, value=h)
    _style_header(ws)

    idx = {c: get_column_letter(j) for j, c in enumerate(cols, 1)}
    for i, row in enumerate(rows, start=2):
        for j, c in enumerate(cols, 1):
            # hit_rate, status and confidence are FORMULAS so the Assumptions
            # sheet actually drives them. Everything else is measured fact.
            if c == "hit_rate":
                f = (f'=IF({idx["predictions_tested"]}{i}=0,"",'
                     f'{idx["hits"]}{i}/{idx["predictions_tested"]}{i})')
                cell = ws.cell(row=i, column=j, value=f)
                cell.number_format = "0%"
            elif c == "confidence":
                hr = f'{idx["hit_rate"]}{i}'
                f = (f'=IF({idx["predictions_tested"]}{i}<{A["min_tests"]},"Too little data",'
                     f'IF({hr}>={A["high"]},"High",'
                     f'IF({hr}>={A["medium"]},"Medium","Low")))')
                cell = ws.cell(row=i, column=j, value=f)
            elif c == "status":
                g, since, od = f'{idx["usual_gap_days"]}{i}', f'{idx["days_since_last"]}{i}', f'{idx["order_days"]}{i}'
                f = (f'=IF({od}<{A["min_orders"]},"Too few orders",'
                     f'IF({g}="","Too few orders",'
                     f'IF({since}>{A["quiet_mult"]}*{g}+{A["quiet_extra"]},'
                     f'IF({idx["bursty"]}{i}="yes","Gone quiet (bursty - may be between clusters)","Gone quiet"),'
                     f'IF({since}>={g}-{A["due_soon"]},"Due now","Not yet due"))))')
                cell = ws.cell(row=i, column=j, value=f)
            elif c == "days_since_last":
                f = f'=IF({idx["last_order"]}{i}="","",{A["today"]}-{idx["last_order"]}{i})'
                cell = ws.cell(row=i, column=j, value=f)
            elif c == "next_expected":
                f = (f'=IF(OR({idx["last_order"]}{i}="",{idx["usual_gap_days"]}{i}=""),"",'
                     f'{idx["last_order"]}{i}+ROUND({idx["usual_gap_days"]}{i},0))')
                cell = ws.cell(row=i, column=j, value=f)
                cell.number_format = "dd/mm/yyyy"
            else:
                v = row.get(c)
                cell = ws.cell(row=i, column=j, value=v)
                if isinstance(v, (date, datetime)):
                    cell.number_format = "dd/mm/yyyy"
                elif c == "spread":
                    cell.number_format = "0.00"
            cell.font = Font(name=ARIAL, size=10)
            cell.border = BORDER
    ws.auto_filter.ref = f"A1:{get_column_letter(len(cols))}{max(2, len(rows) + 1)}"
    _autosize(ws)
    return ws


def build(path, *, meta, consts, by_customer, by_item, pilot, backtest,
          line_items, quotes, cust_map, item_map, unreadable):
    wb = Workbook()
    wb.remove(wb.active)

    _read_me(wb, meta)
    _summary_sheet(wb, "Summary by customer", by_customer, SUMMARY_COLS)
    _summary_sheet(wb, "Summary by customer and item", by_item, ITEM_COLS)

    # Pilot shortlist
    ws = wb.create_sheet("Pilot shortlist")
    _write_table(ws, ["Rank", "Customer", "Item", "Confidence", "Hit rate",
                      "Predictions tested", "Usual gap (days)", "Typical miss (days)",
                      "Typical qty per order", "Why this pair"],
                 [{"Rank": i, **p} for i, p in enumerate(pilot, 1)])
    _autosize(ws)

    ws = wb.create_sheet("Backtest")
    _write_table(ws, ["Series", "Customer", "Item", "Order date", "Predicted gap (days)",
                      "Actual gap (days)", "Miss (days)", "Tolerance (days)", "Hit"], backtest)
    _autosize(ws)

    ws = wb.create_sheet("Line items")
    _write_table(ws, ["Date", "Doc type", "Doc no", "Customer", "Item key",
                      "Original description", "Qty", "Unit price", "Total", "Source file"], line_items)
    _autosize(ws)

    ws = wb.create_sheet("Quotes and statements")
    _write_table(ws, ["Date", "Doc type", "Doc no", "Customer", "Item key",
                      "Original description", "Qty", "Unit price", "Total", "Source file"], quotes)
    _autosize(ws)

    ws = wb.create_sheet("Mappings")
    ws["A1"] = "Customer name merges"
    ws["A1"].font = Font(name=ARIAL, bold=True, size=11)
    end = _write_table(ws, ["original", "standardised", "merged", "variants_merged"],
                       cust_map, start_row=3)
    ws.cell(row=end + 2, column=1, value="Item name merges").font = Font(name=ARIAL, bold=True, size=11)
    _write_table(ws, ["original_description", "item_key", "descriptions_merged"],
                 item_map, start_row=end + 4)
    _autosize(ws)

    ws = wb.create_sheet("Unreadable files")
    _write_table(ws, ["Source file", "Doc type", "Why it could not be used"], unreadable)
    _autosize(ws)

    _assumptions(wb, meta["today"], consts)
    _apply_arial(wb)
    wb.save(path)
    return path
