"""
Build a FAKE "From Docs" folder to prove the pipeline end to end.

Every name, price and date here is invented. None of it is Rycedental data and
nothing produced from it is a finding about her business. It exists so the
extractor can be shown to cope with the mess real hand-typed documents carry:

  - four different date formats, including day-first 03/04/2026
  - four different column headings for the same quantity column
  - the invoice number in the header rather than the body
  - a delivery note that duplicates an invoice two days later
  - merged cells in a table
  - a file with no date at all, and one that is not a real .docx
  - a quote, which must never be counted as an order
  - one genuinely steady buyer, one erratic, one bursty, one with too few orders
"""
from __future__ import annotations

import random
import sys
import zipfile
from datetime import date, timedelta
from pathlib import Path

import docx
from docx.shared import Pt
from openpyxl import Workbook

random.seed(20261030)

ITEM_WORDS = {
    "Nitrile gloves M": ["Nitrile Examination Gloves Medium", "NITRILE GLOVES (MEDIUM) BOX OF 100",
                         "Gloves, nitrile - medium, box"],
    "Nitrile gloves L": ["Nitrile Examination Gloves Large", "NITRILE GLOVES LARGE 100s"],
    "Suction tips": ["Suction Tips (disposable)", "SALIVA EJECTORS / SUCTION TIPS", "Suction tips pkt of 100"],
    "Face masks": ["Surgical Face Masks 3ply", "FACE MASK 3 PLY BOX", "Face masks, 3-ply, box of 50"],
    "Composite": ["Composite Restorative Kit", "COMPOSITE A2 SYRINGE"],
    "Local anaesthetic": ["Lignocaine 2% with adrenaline", "LOCAL ANAESTHETIC CARTRIDGES"],
}

# name, rhythm in days, jitter, which items, how the gaps behave
CUSTOMERS = [
    ("Kilimani Dental Clinic", 28, 3, ["Nitrile gloves M", "Suction tips", "Face masks"], "steady"),
    ("Aga Khan University Hospital - Nairobi", 21, 2, ["Nitrile gloves M", "Nitrile gloves L"], "steady"),
    ("Dienya Dental Services Ltd", 45, 14, ["Composite", "Local anaesthetic"], "erratic"),
    ("Musima Medical Centre", 30, 4, ["Face masks", "Suction tips"], "steady"),
    ("PCEA Kikuyu Hospital", 0, 0, ["Nitrile gloves M"], "bursty"),
    ("Jalaram Dental", 0, 0, ["Composite"], "few"),
]

PRICES = {"Nitrile gloves M": 1250, "Nitrile gloves L": 1250, "Suction tips": 850,
          "Face masks": 600, "Composite": 4800, "Local anaesthetic": 3200}

DATE_FORMATS = [
    lambda d: d.strftime("%d/%m/%Y"),
    lambda d: d.strftime("%d-%m-%y"),
    lambda d: d.strftime("%d %B %Y"),
    lambda d: d.strftime("%d.%m.%Y"),
]
QTY_HEADERS = ["QTY", "Quantity", "Qty.", "NO."]
PRICE_HEADERS = ["Unit Price", "RATE", "U/Price", "Price"]


def order_dates(kind, rhythm, jitter, start=date(2026, 3, 2), end=date(2026, 7, 31)):
    out, d = [], start
    if kind == "few":
        return [start, start + timedelta(days=40)]
    if kind == "bursty":
        for cluster_start in (0, 95, 190):
            base = start + timedelta(days=cluster_start)
            out += [base, base + timedelta(days=2), base + timedelta(days=5)]
        return [x for x in out if x <= end + timedelta(days=120)]
    while d <= end:
        out.append(d)
        step = rhythm + (random.randint(-jitter, jitter) if jitter else 0)
        if kind == "erratic":
            step = random.choice([7, rhythm, rhythm * 2, 5, 90])
        d = d + timedelta(days=max(2, step))
    return out


def write_docx(path: Path, *, doc_type, number, when, customer, items,
               number_in_header=False, merged=False, omit_date=False):
    d = docx.Document()
    style = d.styles["Normal"]
    style.font.name = "Arial"
    style.font.size = Pt(10)

    if number_in_header:
        hdr = d.sections[0].header
        hdr.paragraphs[0].text = f"{doc_type.upper()} No: {number}    Date: {random.choice(DATE_FORMATS)(when)}"
    d.add_paragraph("RYCEDENTAL SUPPLIES LIMITED")
    d.add_paragraph("P.O. Box 00100 Nairobi, Kenya   Tel: 0700 000 000")
    d.add_paragraph("")
    if not number_in_header:
        d.add_paragraph(f"{doc_type.upper()} NO: {number}")
        if not omit_date:
            d.add_paragraph(f"DATE: {random.choice(DATE_FORMATS)(when)}")
    d.add_paragraph(f"To: {customer}")
    d.add_paragraph("")

    qh, ph = random.choice(QTY_HEADERS), random.choice(PRICE_HEADERS)
    t = d.add_table(rows=1, cols=5)
    t.style = "Table Grid"
    for i, h in enumerate(["#", "Description", qh, ph, "Amount"]):
        t.rows[0].cells[i].text = h
    total = 0
    for i, (key, qty) in enumerate(items, 1):
        desc = random.choice(ITEM_WORDS[key])
        price = PRICES[key]
        amount = qty * price
        total += amount
        row = t.add_row()
        vals = [str(i), desc, str(qty), f"{price:,.2f}", f"{amount:,.2f}"]
        for j, v in enumerate(vals):
            row.cells[j].text = v
    if merged:
        # A merged "TOTAL" strip, which repeats its text across the span.
        row = t.add_row()
        a, b = row.cells[0], row.cells[3]
        a.merge(b)
        row.cells[0].text = "TOTAL"
        row.cells[-1].text = f"{total:,.2f}"
    else:
        row = t.add_row()
        row.cells[3].text = "TOTAL"
        row.cells[4].text = f"{total:,.2f}"
    d.save(str(path))


def write_xlsx(path: Path, *, doc_type, number, when, customer, items):
    wb = Workbook()
    ws = wb.active
    ws.append(["RYCEDENTAL SUPPLIES LIMITED"])
    ws.append([f"{doc_type.upper()} NO", number])
    ws.append(["DATE", when.strftime("%d/%m/%Y")])
    ws.append(["To:", customer])
    ws.append([])
    ws.append(["Description", "Quantity", "Unit Price", "Total"])
    for key, qty in items:
        ws.append([random.choice(ITEM_WORDS[key]), qty, PRICES[key], qty * PRICES[key]])
    ws.append(["TOTAL", None, None, f"=SUM(D7:D{6 + len(items)})"])
    wb.save(str(path))


def main(out_dir: str):
    root = Path(out_dir)
    for sub in ("", "DOD DENTAL PROSTHODO 26", "DOD CONSUMABLES 26"):
        (root / sub).mkdir(parents=True, exist_ok=True)

    inv_no, dn_no = 3100, 7200
    zoho_rows = []

    for customer, rhythm, jitter, items, kind in CUSTOMERS:
        for n, when in enumerate(order_dates(kind, rhythm, jitter)):
            picked = [(k, random.choice([1, 2, 2, 3, 5])) for k in items
                      if random.random() > 0.15] or [(items[0], 2)]
            inv_no += 1
            sub = random.choice(["", "DOD DENTAL PROSTHODO 26", "DOD CONSUMABLES 26"])
            name_cust = customer.split()[0].upper()
            if n % 7 == 3:
                write_xlsx(root / sub / f"INV {inv_no} {name_cust}.xlsx",
                           doc_type="invoice", number=inv_no, when=when,
                           customer=customer, items=picked)
            else:
                write_docx(root / sub / f"INVOICE {inv_no} {name_cust}.docx",
                           doc_type="invoice", number=inv_no, when=when,
                           customer=customer, items=picked,
                           number_in_header=(n % 5 == 0), merged=(n % 4 == 0))
            # Every fourth order also has a delivery note two days later: the
            # same goods, which must be counted once.
            if n % 4 == 1:
                dn_no += 1
                write_docx(root / sub / f"DN {dn_no} {name_cust}.docx",
                           doc_type="delivery note", number=inv_no, when=when + timedelta(days=2),
                           customer=customer, items=picked)
            # A spelling variant now and then, to exercise the merge.
            if n % 6 == 2 and "Aga Khan" in customer:
                zoho_rows.append((when, "AGA KHAN UNIVERSITY HOSPITAL NBI", f"INV-{inv_no}", "Draft"))
            else:
                zoho_rows.append((when, customer, f"INV-{inv_no}", "Draft" if n % 3 else "Sent"))

    # A quote, which must never count as an order.
    write_docx(root / "Quote 881 KILIMANI.docx", doc_type="quotation", number=881,
               when=date(2026, 5, 4), customer="Kilimani Dental Clinic",
               items=[("Composite", 4)])
    # A statement, kept but not counted.
    write_docx(root / "Statement JUNE 2026 DIENYA.docx", doc_type="statement", number=0,
               when=date(2026, 6, 30), customer="Dienya Dental Services Ltd",
               items=[("Composite", 1)])
    # Deliberately broken: no date, and a file that is not a real .docx.
    write_docx(root / "INVOICE 9999 NODATE.docx", doc_type="invoice", number=9999,
               when=date(2026, 6, 1), customer="Mbira Clinic",
               items=[("Face masks", 2)], omit_date=True)
    (root / "INV 9998 CORRUPT.docx").write_bytes(b"this is not a docx")
    # A branch pair that must merge.
    for i, branch in enumerate(["Parklands", "Town"]):
        write_docx(root / f"INVOICE {9900 + i} ABDALLAH {branch.upper()}.docx",
                   doc_type="invoice", number=9900 + i, when=date(2026, 4, 10) + timedelta(days=i * 30),
                   customer=f"Abdallah & Associates Dental And Implant Centre - {branch}",
                   items=[("Suction tips", 3)])

    # Zoho CSV, including Bliss back to 2020 and the two Abdallah branches.
    csv_path = root.parent / "Invoice.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        fh.write("Invoice Date,Invoice Number,Customer Name,Invoice Status,Payment Terms\n")
        d = date(2020, 6, 15)
        while d < date(2026, 1, 1):
            fh.write(f"{d:%d/%m/%Y},INV-B{d:%y%m},Bliss Healthcare,Sent,Net 30\n")
            d += timedelta(days=random.randint(25, 38))
        for when, cust, num, status in sorted(zoho_rows):
            fh.write(f"{when:%d/%m/%Y},{num},{cust},{status},Net 30\n")
        for i, branch in enumerate(["Parklands", "Town"]):
            fh.write(f"{date(2026, 4, 10) + timedelta(days=i * 30):%d/%m/%Y},INV-A{i},"
                     f"Abdallah & Associates Dental And Implant Centre - {branch},Draft,Due on Receipt\n")

    n = len(list(root.rglob("*.docx"))) + len(list(root.rglob("*.xlsx")))
    print(f"Fixture: {n} documents under {root}, Zoho CSV at {csv_path}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "./fixture/From Docs")
