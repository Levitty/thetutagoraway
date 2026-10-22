// verify-subscription — server-side Paystack verification for a practice pass.
//
// The client charges through Paystack, then calls this with the reference and
// the plan. We confirm the charge directly with Paystack (never trust the
// client), check the amount against THAT PLAN's price, and extend the pass
// from whichever is later: now, or the current pro_until. Writing with the
// service role is the ONLY way a pass is granted — the table has no
// user-write policy.
//
// WHAT WAS BROKEN (and why a paying family was still shown the paywall):
//
//   1. It required `user_id` in the body. The client has never sent it — it
//      sends { reference, plan } — so every call returned 400 "missing
//      reference or user_id", all three client retries failed, and the family
//      was told to WhatsApp us. The user is taken from the caller's JWT now,
//      which is also the right place for it: a body field would let anyone
//      with a valid reference grant a pass to any account.
//
//   2. It hardcoded PRICE_KES = 200 and PASS_DAYS = 30, from before the week
//      and month plans existed. A week pass is KES 100, so even a correctly
//      formed call was rejected as "amount too low" — the family paid and was
//      refused by the thing meant to let them in.
//
// Deploy:  supabase functions deploy verify-subscription
// Secret:  PAYSTACK_SECRET_KEY (already set for verify-payment)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Must match src/subscription.js. Priced in whole shillings; Paystack reports
// the minor unit, so the comparison multiplies by 100.
const PLANS: Record<string, { kes: number; days: number }> = {
  week: { kes: 100, days: 7 },
  month: { kes: 350, days: 30 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { reference, plan } = await req.json();
    if (!reference) return json({ verified: false, error: "missing reference" }, 400);

    const p = PLANS[String(plan)];
    if (!p) return json({ verified: false, error: "unknown plan" }, 400);

    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) return json({ verified: false, error: "server not configured" }, 500);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // The buyer is whoever is signed in, not whoever the body claims. A
    // user_id in the body would let anybody who knows a successful reference
    // grant a pass to an account that is not theirs.
    const authHeader = req.headers.get("Authorization") || "";
    const asCaller = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: who } = await asCaller.auth.getUser();
    const user_id = who?.user?.id;
    if (!user_id) return json({ verified: false, error: "signed out" }, 401);

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Replay guard. subscription_payments has the reference as its primary
    // key, so a reference that already bought a pass cannot buy a second one —
    // which matters because the client retries, and because a recovered
    // payment (below) re-sends a reference that may already have landed.
    const { data: already } = await supabase
      .from("subscription_payments").select("reference, user_id").eq("reference", reference).maybeSingle();
    if (already) {
      if (already.user_id !== user_id) return json({ verified: false, error: "reference already used" }, 409);
      const { data: sub } = await supabase.from("subscriptions").select("pro_until").eq("user_id", user_id).maybeSingle();
      return json({ verified: true, pro_until: sub?.pro_until ?? null, replayed: true });
    }

    // 1. Confirm the charge with Paystack.
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const ps = await psRes.json();
    const tx = ps?.data;
    if (!ps?.status || tx?.status !== "success") {
      return json({ verified: false, error: "payment not successful" }, 402);
    }
    // Paystack amounts are in the minor unit (KES cents). Guard underpayment
    // against THIS plan's price, not a single hardcoded one.
    if ((tx.amount ?? 0) < p.kes * 100) {
      return json({ verified: false, error: "amount too low" }, 402);
    }

    // 2. Extend from max(now, current pro_until), so paying again mid-pass
    //    adds to it rather than throwing the remainder away.
    const { data: existing } = await supabase.from("subscriptions").select("pro_until").eq("user_id", user_id).maybeSingle();
    const base = existing?.pro_until && Date.parse(existing.pro_until) > Date.now()
      ? new Date(existing.pro_until) : new Date();
    const proUntil = new Date(base.getTime() + p.days * 86400000).toISOString();

    const { error } = await supabase.from("subscriptions").upsert({
      user_id, pro_until: proUntil, plan: String(plan), updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) return json({ verified: false, error: error.message }, 500);

    // 3. Record the payment LAST: if this insert fails the family still has
    //    their pass, and the worst case is a reference that could be replayed
    //    — which only ever extends the same account.
    await supabase.from("subscription_payments").insert({
      reference, user_id, plan: String(plan), amount_kes: Math.round((tx.amount ?? 0) / 100), days: p.days,
    });

    return json({ verified: true, pro_until: proUntil });
  } catch (e) {
    return json({ verified: false, error: String(e) }, 500);
  }
});
