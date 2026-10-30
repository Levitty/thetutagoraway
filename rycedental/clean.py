"""
Step 2 — standardise names, and count one order once.

Two jobs, both of which quietly decide the answer:

1. CUSTOMER NAMES. "Aga Khan Nairobi", "AGA KHAN UNIVERSITY HOSPITAL - NBI" and
   "agakhan nbi" are one buyer. Left alone they are three buyers with a third
   of the history each, and every one of them is "Too little data". The merge
   is therefore not tidying: it is the difference between a customer being
   analysable and not.

2. ONE ORDER, ONE DAY. An invoice and its delivery note are the same goods
   moving once. Counted twice they create a gap of zero days, which drags the
   median gap down and makes every customer look more frequent than they are.

Every merge is recorded and written to the Mappings sheet, because an
automatic merge that nobody can see is an automatic error that nobody can find.
"""
from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass

# --------------------------------------------------------------- customers
# Noise that never distinguishes two real buyers.
_LEGAL = re.compile(
    r"\b(ltd|limited|lmt|co|company|plc|llp|inc|enterprises?|"
    r"holdings?|group|kenya|k\.?e\.?)\b\.?", re.I)
_PUNCT = re.compile(r"[^\w\s]")
_SPACE = re.compile(r"\s+")

# Words that describe a SITE, not a different customer. Stripped for matching
# so branches collapse, which is what was asked for Abdallah's two sites.
_BRANCH = re.compile(
    r"\b(parklands?|town|cbd|westlands?|branch|annex|annexe|main|hq|"
    r"head\s*office|clinic|centre|center|hospital|pharmacy)\b", re.I)

# Spelling variants that a generic rule cannot catch. Extend freely: every
# entry lands in the Mappings sheet for review.
_ALIASES = {
    "aga khan": "Aga Khan",
    "agakhan": "Aga Khan",
    "abdallah associates dental implant": "Abdallah & Associates Dental and Implant Centre",
    "abdallah associates": "Abdallah & Associates Dental and Implant Centre",
    "kenya orthopaedic": "Kenya Orthopaedic",
    "kenya orthopedic": "Kenya Orthopaedic",
    "pcea kikuyu": "PCEA Kikuyu",
    "lifecare": "Lifecare",
    "bliss healthcare": "Bliss Healthcare",
    "bliss gvs": "Bliss Healthcare",
}


def _squash(name: str) -> str:
    s = _PUNCT.sub(" ", str(name or "")).lower()
    s = s.replace(" and ", " ")
    s = _LEGAL.sub(" ", s)
    s = _SPACE.sub(" ", s).strip()
    return s


def customer_key(name: str) -> str:
    """The form two spellings of one buyer must agree on."""
    s = _squash(name)
    for frag, _canon in _ALIASES.items():
        if frag in s:
            s = frag
            break
    else:
        # Only strip branch words when no alias matched, so a buyer actually
        # called "Kilimani Dental Clinic" does not become "kilimani dental"
        # colliding with a different "Kilimani Dental Supplies".
        s = _SPACE.sub(" ", _BRANCH.sub(" ", s)).strip()
    return s


def _title(name: str) -> str:
    small = {"and", "of", "the", "for", "de"}
    parts = re.split(r"(\s+|-)", str(name or "").strip())
    out = []
    for i, p in enumerate(parts):
        if not p.strip() or p == "-":
            out.append(p)
            continue
        low = p.lower()
        if p.isupper() and len(p) <= 4:
            out.append(p)                      # PCEA, MP Shah
        elif low in small and i > 0:
            out.append(low)
        else:
            out.append(p[:1].upper() + p[1:].lower())
    return "".join(out)


class CustomerResolver:
    """Maps every spelling seen to one display name, and records the merges."""

    def __init__(self):
        self._by_key: dict[str, str] = {}
        self._seen: dict[str, set[str]] = defaultdict(set)

    def add(self, raw: str) -> str:
        key = customer_key(raw)
        if not key:
            return ""
        self._seen[key].add(str(raw).strip())
        if key not in self._by_key:
            canon = next((v for frag, v in _ALIASES.items() if frag == key), None)
            self._by_key[key] = canon or _title(raw)
        return self._by_key[key]

    def resolve(self, raw: str) -> str:
        return self._by_key.get(customer_key(raw), _title(raw))

    def merges(self) -> list[dict]:
        """One row per spelling, so every merge is visible and reversible."""
        rows = []
        for key, spellings in sorted(self._seen.items()):
            canon = self._by_key[key]
            for s in sorted(spellings):
                rows.append({
                    "original": s, "standardised": canon,
                    "merged": "yes" if len(spellings) > 1 else "no",
                    "variants_merged": len(spellings),
                })
        return rows


# ------------------------------------------------------------------- items
# Size words, kept because a Medium glove and a Large glove are different
# stock and must never share a reorder prediction.
_SIZES = [
    (re.compile(r"\b(x[\s-]*small|xs)\b", re.I), "XS"),
    (re.compile(r"\b(small|sml|\bs\b)\b", re.I), "S"),
    (re.compile(r"\b(medium|med|\bm\b)\b", re.I), "M"),
    (re.compile(r"\b(x[\s-]*large|xl)\b", re.I), "XL"),
    (re.compile(r"\b(large|lrg|\bl\b)\b", re.I), "L"),
]
# Pack/packaging noise: the same product bought by the box or the packet is
# still the same product for the purpose of "when will they run out".
_PACKNOISE = re.compile(
    r"\b(box(es)?|bx|pkt?s?|packets?|packs?|pcs?|pieces?|units?|dozen|dzn|"
    r"ctn|cartons?|rolls?|bottles?|tubes?|tins?|jars?|bags?|sachets?|"
    r"of\s*\d+|\d+\s*s\b|per\b|each\b|assorted|asst)\b", re.I)
_NUMNOISE = re.compile(r"\b\d+(\.\d+)?\s*(ml|l|g|kg|mm|cm|mg|%)\b", re.I)

# Common synonyms. Deliberately short: a guessed synonym silently merges two
# different products, which is worse than leaving them apart. Extend after
# reading the Mappings sheet against the real catalogue.
_ITEM_ALIASES = [
    (re.compile(r"nitrile.*glove|glove.*nitrile", re.I), "Nitrile gloves"),
    (re.compile(r"latex.*glove|glove.*latex|examination glove", re.I), "Latex gloves"),
    (re.compile(r"\bglove", re.I), "Gloves"),
    (re.compile(r"suction tip|saliva ejector", re.I), "Suction tips"),
    (re.compile(r"face\s*mask|surgical mask|\bmask", re.I), "Face masks"),
    (re.compile(r"cotton\s*(wool|roll)", re.I), "Cotton rolls"),
    (re.compile(r"gauze", re.I), "Gauze"),
    (re.compile(r"syringe", re.I), "Syringes"),
    (re.compile(r"needle", re.I), "Needles"),
    (re.compile(r"impression (material|paste)|alginate", re.I), "Impression material"),
    (re.compile(r"composite", re.I), "Composite"),
    (re.compile(r"amalgam", re.I), "Amalgam"),
    (re.compile(r"local an(ae)?sth|lignocaine|lidocaine|articaine", re.I), "Local anaesthetic"),
    (re.compile(r"burs?\b|diamond bur", re.I), "Burs"),
    (re.compile(r"\bx[\s-]*ray|radiograph|film", re.I), "X-ray film"),
    (re.compile(r"disinfect|steriliz|steriliS|glutaraldehyde", re.I), "Disinfectant"),
    (re.compile(r"bib|apron", re.I), "Patient bibs"),
]


def item_key(description: str) -> str:
    """A short, comparable name for a product. Size is kept; packaging is not."""
    raw = str(description or "").strip()
    if not raw:
        return ""
    size = ""
    for pat, tag in _SIZES:
        if pat.search(raw):
            size = tag
            break
    base = None
    for pat, name in _ITEM_ALIASES:
        if pat.search(raw):
            base = name
            break
    if base is None:
        s = _NUMNOISE.sub(" ", raw)
        s = _PACKNOISE.sub(" ", s)
        s = _PUNCT.sub(" ", s)
        s = re.sub(r"\b\d+\b", " ", s)
        s = _SPACE.sub(" ", s).strip()
        base = _title(s[:40]) if s else _title(raw[:40])
    return f"{base} {size}".strip()


def item_mappings(descriptions) -> list[dict]:
    grouped: dict[str, set[str]] = defaultdict(set)
    for d in descriptions:
        k = item_key(d)
        if k:
            grouped[k].add(str(d).strip())
    rows = []
    for key in sorted(grouped):
        for orig in sorted(grouped[key]):
            rows.append({
                "original_description": orig, "item_key": key,
                "descriptions_merged": len(grouped[key]),
            })
    return rows


# ------------------------------------------------------- one order, one day
@dataclass
class Dedup:
    kept: list
    dropped: list
    notes: list


def _digits(s) -> str:
    return re.sub(r"\D", "", str(s or ""))


def dedupe_orders(rows: list[dict], window_days: int = 3) -> Dedup:
    """Collapse an invoice and its delivery note into one order.

    Matched on: same customer, and EITHER the same document number (ignoring
    the prefix, since DN 412 and INV 412 are routinely the same job) OR dates
    within `window_days` with at least one item in common.

    The date window exists because the note is written when the goods go out
    and the invoice when the office catches up, which is rarely the same day.
    Without it the pair survives as two orders a day apart and the customer
    looks twice as frequent as they are.
    """
    kept, dropped, notes = [], [], []
    by_customer: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_customer[r.get("customer") or ""].append(r)

    for cust, rs in by_customer.items():
        # Group a customer's rows into documents first.
        docs: dict[tuple, list[dict]] = defaultdict(list)
        for r in rs:
            docs[(r.get("doc_type"), r.get("doc_no"), r.get("date"))].append(r)

        seen: list[tuple] = []        # (date, numeric doc no, item keys, key)
        for key, lines in sorted(docs.items(), key=lambda kv: (kv[0][2] or __import__("datetime").date.min,
                                                               str(kv[0][0]))):
            dtype, dno, ddate = key
            items = {l.get("item_key") for l in lines if l.get("item_key")}
            num = _digits(dno)
            dup_of = None
            for (sdate, snum, sitems, skey) in seen:
                if skey[0] == dtype:
                    continue                       # same type: a real re-order
                same_no = num and snum and num == snum
                near = (ddate and sdate and abs((ddate - sdate).days) <= window_days)
                shared = bool(items & sitems)
                if same_no or (near and shared):
                    dup_of = skey
                    break
            if dup_of:
                for l in lines:
                    dropped.append({**l, "duplicate_of": f"{dup_of[0]} {dup_of[1]} {dup_of[2]}"})
                notes.append(f"{cust}: {dtype} {dno} {ddate} counted once with {dup_of[0]} {dup_of[1]}")
            else:
                kept += lines
                seen.append((ddate, num, items, key))
    return Dedup(kept, dropped, notes)
