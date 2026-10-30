# Rycedental Supplies — reorder predictability review

Does a clinic's reordering follow a rhythm steady enough to predict? This
answers that from her own documents, with honest confidence levels.

**It is a test of the idea, not a system.** Nothing here sends a message to
anybody.

## Run it

    python3 run.py --docs "/path/From Docs" \
                   --zoho "/path/Invoice.csv" \
                   --out  "/path/Rycedental_reorder_review.xlsx"

Then recalculate so the formulas carry cached values:

    python3 <xlsx skill>/scripts/recalc.py "/path/Rycedental_reorder_review.xlsx"

## Privacy

`data/`, `out/` and every `*.xlsx|docx|xls|csv` are gitignored. Her customers'
names and prices must never enter this repository, which deploys publicly.
Keep the inputs and the workbook outside it.

## What each file does

| File | Job |
|---|---|
| `extract.py` | Read .docx/.xlsx/.xls. Headers and footers too, because the invoice number often lives there. Day-first dates. Anything unreadable is recorded with a reason, never guessed. |
| `clean.py` | Merge customer spellings and branches; map descriptions to item keys; fold an invoice and its delivery note into one order. |
| `analyse.py` | Gaps, the walk-forward backtest, confidence, status. Every threshold is a named constant. |
| `workbook.py` | The ten sheets. Thresholds live on Assumptions and the ratings are live formulas pointing at them. |
| `run.py` | Orchestrates the above. |
| `make_fixture.py` | Builds a FAKE folder to prove the pipeline. No real data. |
| `test_analyse.py` | 25 tests, chiefly that the backtest never sees the future. |

## The one thing to check before trusting an item-level number

`Mappings`. Item names are standardised by rule, and a wrong merge invents a
pattern that was never there. Read it against the real catalogue and correct
`_ITEM_ALIASES` in `clean.py` before quoting any item-level figure.
