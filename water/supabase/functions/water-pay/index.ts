// ============================================================================
// water-pay — the whole tenant-facing server. Three actions, one function.
//
//   lookup  { meter_no }   who is this meter, and what is owed
//   start   { meter_no }   decide the amount, write the reference down, return it
//   verify  { reference }  ask Paystack, and only then mark the bill paid
//
// WHY A FUNCTION AND NOT THE REST API: tenants have no accounts. If the page
// read `meters` directly it would need an anon-readable policy, and that table
// holds names and phone numbers. The sibling tutoring project shipped exactly
// that on `profiles` and leaked 147 people's contact details to anyone holding
// the key printed in its own JavaScript. Here anon can read nothing, and this
// function decides what a stranger is allowed to see.
//
// WHY THE AMOUNT IS DECIDED AT `start`, NOT AT `verify`: the browser never
// gets to say what a payment was for. `start` looks up the open bill, writes a
// row keyed by the reference with the meter and the expected amount, and
// returns the reference. `verify` compares what Paystack reports against THAT
// ROW. Otherwise anyone who knew a successful reference could post it with
// their own meter number and clear their own bill with someone else's money.
//
// Deploy:  supabase functions deploy water-pay
// Secret:  PAYSTACK_SECRET_KEY   (and optionally RECEIPT_EMAIL_DOMAIN)
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// ---- the same rules the client uses, restated here because this is the copy
// ---- that is actually trusted. If they ever disagree, this one wins.
const normalizeMeterNo = (raw: unknown): string => {
  if (raw == null) return "";
  const s = String(raw).normalize("NFKD").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!s) return "";
  const m = s.match(/^([A-Z]*)0*(\d+)$/);
  return m ? `${m[1]}${m[2]}` : s;
};
const LABELS = ["METERNO", "METERNUMBER", "METER", "MTRNO", "MTR", "ACCOUNTNO", "ACCOUNT", "ACCNO", "ACC", "NUMBER", "NO"];
const meterCandidates = (raw: unknown): string[] => {
  const base = normalizeMeterNo(raw);
  if (!base) return [];
  const out = [base];
  for (const label of LABELS) {
    if (base.startsWith(label) && base.length > label.length) {
      const stripped = normalizeMeterNo(base.slice(label.length));
      if (stripped && !out.includes(stripped)) out.push(stripped);
      break;
    }
  }
  return out;
};
const maskName = (name: unknown): string => {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return `${parts[0][0].toUpperCase()}.`;
  const last = parts[parts.length - 1];
  return `${parts.slice(0, -1).map((p) => `${p[0].toUpperCase()}.`).join(" ")} ${last}`;
};
const amountOk = (paidMinor: number, expectedKes: number) =>
  Number.isFinite(paidMinor) && Number.isFinite(expectedKes) && expectedKes > 0 &&
  paidMinor >= Math.round(expectedKes * 100);

/** Walking 1..9999 is how you harvest an estate's tenant list. */
const LOOKUPS_PER_MINUTE = 12;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const EMAIL_DOMAIN = Deno.env.get("RECEIPT_EMAIL_DOMAIN") || "tutagora.com";
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "server not configured" }, 500);

  const db = createClient(SUPABASE_URL, SERVICE_KEY);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "bad request" }, 400); }
  const action = String(body.action ?? "");

  // ------------------------------------------------------------------ helpers
  const findMeter = async (raw: unknown) => {
    const candidates = meterCandidates(raw);
    if (!candidates.length) return null;
    // In candidate order: an exact match beats a label-stripped one, so a
    // meter genuinely called NO412 is never shadowed by meter 412.
    for (const c of candidates) {
      const { data } = await db.from("meters")
        .select("id, meter_no, house, tenant_name, active").eq("meter_no", c).maybeSingle();
      if (data) return data;
    }
    return null;
  };

  const openBill = async (meterId: string) => {
    const { data } = await db.from("bills")
      .select("id, period, amount_kes, reading, prev_reading")
      .eq("meter_id", meterId).is("paid_at", null)
      .order("period", { ascending: true }).limit(1).maybeSingle();
    return data ?? null;
  };

  // ------------------------------------------------------------------- lookup
  if (action === "lookup") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const minute = new Date(Math.floor(Date.now() / 60000) * 60000).toISOString();
    // One statement counts and reports, so two simultaneous lookups cannot
    // both read "1" and let a scraper through at twice the rate.
    const { data: hits } = await db.rpc("bump_lookup", { p_ip: ip, p_minute: minute });
    if (Number(hits ?? 0) > LOOKUPS_PER_MINUTE) {
      return json({ found: false, error: "Too many tries. Wait a minute and try again." }, 429);
    }

    const meter = await findMeter(body.meter_no);
    // Deliberately the same shape and the same wording whether the meter is
    // missing or switched off: "this one exists but is inactive" is still a
    // signal worth harvesting.
    if (!meter || !meter.active) {
      return json({ found: false, message: "We couldn't find that meter number. Check the number on your notice, or ask the caretaker." });
    }
    const bill = await openBill(meter.id);
    return json({
      found: true,
      meter: { meter_no: meter.meter_no, house: meter.house, name: maskName(meter.tenant_name) },
      bill: bill ? { period: bill.period, amount_kes: bill.amount_kes, reading: bill.reading, prev_reading: bill.prev_reading } : null,
    });
  }

  // -------------------------------------------------------------------- start
  if (action === "start") {
    const meter = await findMeter(body.meter_no);
    if (!meter || !meter.active) return json({ error: "We couldn't find that meter number." }, 404);

    const bill = await openBill(meter.id);
    if (!bill) return json({ error: "Nothing is owed on this meter right now." }, 409);

    // The reference carries the meter so a human reading the Paystack
    // dashboard, or an M-Pesa statement, can tell what it was for without
    // opening this database.
    const reference = `WTR-${meter.meter_no}-${bill.period.replace("-", "")}-${crypto.randomUUID().slice(0, 8)}`;

    const { error } = await db.from("water_payments").insert({
      reference, meter_id: meter.id, bill_id: bill.id, amount_kes: bill.amount_kes, status: "pending",
    });
    if (error) return json({ error: "Could not start the payment. Try again." }, 500);

    return json({
      reference,
      amount_kes: bill.amount_kes,
      email: `meter-${meter.meter_no.toLowerCase()}@${EMAIL_DOMAIN}`,
      meter: { meter_no: meter.meter_no, house: meter.house, name: maskName(meter.tenant_name) },
      bill: { period: bill.period },
    });
  }

  // ------------------------------------------------------------------- verify
  if (action === "verify") {
    const reference = String(body.reference ?? "").trim();
    if (!reference) return json({ paid: false, error: "missing reference" }, 400);
    if (!PAYSTACK_SECRET) return json({ paid: false, error: "server not configured" }, 500);

    const { data: row } = await db.from("water_payments")
      .select("reference, meter_id, bill_id, amount_kes, status, paid_kes, overpaid_kes")
      .eq("reference", reference).maybeSingle();

    // A reference this server never issued is not ours to confirm. Without
    // this, anyone could post any successful Paystack reference.
    if (!row) return json({ paid: false, final: true, error: "unknown reference" }, 404);

    // Already settled. Asking again is EXPECTED — the client asks repeatedly
    // on purpose, because M-Pesa settles after the phone is put down — so this
    // answers cheaply instead of charging through Paystack again.
    if (row.status === "paid") {
      return json({ paid: true, amount_kes: row.paid_kes ?? row.amount_kes, overpaid_kes: row.overpaid_kes ?? 0 });
    }
    if (row.status === "failed" || row.status === "abandoned") {
      return json({ paid: false, final: true, error: "This payment did not go through." });
    }

    let res: Response;
    try {
      res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      });
    } catch {
      // Not a verdict on the payment — say so, so the client keeps the
      // reference and asks again.
      return json({ paid: false, error: "network: could not reach Paystack" }, 503);
    }
    if (!res.ok) return json({ paid: false, error: `network: Paystack ${res.status}` }, 503);

    const pay = await res.json().catch(() => null);
    const d = pay?.data;
    const state = String(d?.status ?? "");

    if (state !== "success") {
      // "failed"/"abandoned" are final. Anything else — most importantly the
      // pending STK prompt still sitting on the tenant's phone — is NOT, and
      // saying so is the whole reason a payment taken by M-Pesa ever lands.
      const final = state === "failed" || state === "abandoned";
      if (final) {
        await db.from("water_payments").update({ status: state, paystack: d ?? null }).eq("reference", reference);
      }
      return json({ paid: false, final, error: final ? "This payment did not go through." : "not successful yet" });
    }

    if (String(d?.currency ?? "KES") !== "KES") {
      return json({ paid: false, final: true, error: "wrong currency" }, 400);
    }
    // Against the amount THIS SERVER decided at start, never against anything
    // the caller sent.
    if (!amountOk(Number(d?.amount), row.amount_kes)) {
      await db.from("water_payments").update({
        status: "failed", paid_kes: Math.round(Number(d?.amount ?? 0) / 100), paystack: d ?? null,
      }).eq("reference", reference);
      return json({ paid: false, final: true, error: "The amount paid is less than the bill." });
    }

    const paidKes = Math.round(Number(d.amount) / 100);
    const overpaid = Math.max(0, paidKes - row.amount_kes);

    // Record the payment first. If marking the bill fails after this, the
    // money is still on the books and reconcilable; the other order loses it.
    await db.from("water_payments").update({
      status: "paid", paid_kes: paidKes, overpaid_kes: overpaid,
      channel: d?.channel ?? null, paid_at: new Date().toISOString(), paystack: d,
    }).eq("reference", reference);

    if (row.bill_id) {
      // Only if still open: two references can race on one bill, and the
      // second must not overwrite the first one's timestamp.
      await db.from("bills").update({ paid_at: new Date().toISOString() })
        .eq("id", row.bill_id).is("paid_at", null);
    }

    return json({ paid: true, amount_kes: paidKes, overpaid_kes: overpaid, channel: d?.channel ?? null });
  }

  return json({ error: "unknown action" }, 400);
});
