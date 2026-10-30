# Water meter payments

Tenants pay their water bill by M-Pesa. They type a meter number, confirm it is
them, and pay. No accounts, no app to install.

This is a **separate product** from the tutoring platform. It shares nothing
with it but three hard-won files, copied rather than imported, so a change here
can never reach children's data.

---

## The one thing to understand before changing anything

**Tenants have no accounts**, so the usual "the signed-in user is the payer"
rule does not exist. Two decisions follow, and most of the design is downstream
of them:

1. **The anon key can read nothing.** Not one table, not one column. Every
   tenant-facing read goes through the `water-pay` edge function, which uses
   the service role and decides what a stranger may see. The sibling tutoring
   project shipped a `profiles` table the anon key could read, and for weeks
   anyone holding the key printed in its own JavaScript could fetch 147 names,
   emails and phone numbers. There is no permissive policy here to get wrong.

2. **The amount is decided at `start`, never at `verify`.** `start` looks up
   the open bill, writes a row keyed by the Paystack reference with the meter
   and expected amount, and hands back the reference. `verify` compares what
   Paystack reports against *that row*. If the browser could name the amount or
   the meter at verify time, anyone who knew a successful reference could clear
   their own bill with someone else's money.

---

## Setup

### 1. A new Supabase project

Create one under your existing Supabase account (same billing, separate
database). Then in the SQL editor, run:

    supabase/migrations/0001_water.sql

It creates the tables, turns RLS on everywhere, grants `anon` nothing, and
seeds `water_admins` with `mutualevy@gmail.com` — **change that address in the
file first if it is not yours.**

### 2. The edge function

    supabase functions deploy water-pay --project-ref <new-project-ref>

Secrets it needs, under Project Settings → Edge Functions → Secrets:

| Secret | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | `sk_test_…` to begin with. The same Paystack account as the tutoring product. |
| `RECEIPT_EMAIL_DOMAIN` | optional, defaults to `tutagora.com` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically.

### 3. The app

    cp .env.example .env.local     # fill in the three values
    npm install
    npm run dev

`.env.local` is gitignored. The Paystack **public** key goes here; it is public
by design and can do nothing on its own.

### 4. Load the meters

Open `/admin`, sign in with a link, and paste your spreadsheet under **Meters**,
then this month's figures under **Bills**. The importer shows you what it
understood *before* it saves anything, and names any line it could not read.

---

## Use `pk_test_` / `sk_test_` until one real payment works end to end

Take one live payment yourself, with your own phone and your own money, before
a tenant ever sees this. On the tutoring product the payment path was broken in
production for seven weeks and no test caught it — it was found by a person
paying KES 100 and still being asked to pay.

---

## What is deliberately not here

- **A meter reading entered by the tenant.** Readings come from you, in the
  bill import. A tenant-entered reading needs a dispute process you do not have.
- **Partial payment.** Paying less than the bill is rejected. Marking a KES 740
  bill paid on KES 100 is how a ledger stops matching a bank account.
  Overpayment *is* accepted and recorded as credit, because refusing money that
  has already left a phone helps nobody.
- **Several landlords paid separately.** Everything lands in one Paystack
  account. Splitting needs Paystack subaccounts and KYC per landlord — knowable
  now, painful to retrofit, so it is written down here rather than half-built.
- **Receipts by SMS or email.** The tenant screenshots the paid screen. SMS
  costs money per message and needs a provider you have not chosen.

## The known weakness

**A meter number nobody has entered cannot be paid.** That is on purpose — you
cannot bill a meter you have not metered — but it means the meter list has to
be loaded before anyone can pay. The importer makes that a five-minute job.

**Lookup is an enumeration oracle.** Anyone can type any number and learn
"House B3 · W. Njoroge". The name is masked to initials and lookups are capped
at 12 per IP per minute, which makes walking the range slow and low-value. It
does not make it impossible. If the estate is sensitive, put the lookup behind
a code printed on the notice.

---

## Tests

    npm test

44 tests, all of them about a way this has already gone wrong somewhere:
meter numbers typed five ways, Excel's byte-order mark, `"1,240"` parsed as 1,
and — the one that cost real money — Paystack answering "not successful" for a
payment that is still waiting for the tenant's PIN.
