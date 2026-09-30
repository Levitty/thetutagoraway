// verify-subscription — server-side Paystack check for the practice pass.
//
// The app charges KSh 100 (1 week) or KSh 350 (1 month) through Paystack,
// then calls this with the payment reference. This function:
//   1. works out who is calling from their sign-in (never from the request),
//   2. asks Paystack whether the payment really succeeded,
//   3. checks it was paid by this person, in KES, for the plan's price,
//   4. records the reference so one payment can only ever be used once,
//   5. extends the pass from whichever is later: now, or the current end
//      (so paying during the free week loses no free days).
// Calling it again with the same reference is safe: it answers "verified"
// with the current end date and adds nothing.
//
// Deploy:  supabase functions deploy verify-subscription
// Secret:  PAYSTACK_SECRET_KEY (already set for verify-payment)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Keep in step with PLANS in src/subscription.js.
const PLANS: Record<string, { kes: number; days: number }> = {
  week: { kes: 100, days: 7 },
  month: { kes: 350, days: 30 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ verified: false, error: "POST only" }, 405);
  try {
    const { reference } = await req.json();
    if (!reference) return json({ verified: false, error: "missing reference" }, 400);

    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) return json({ verified: false, error: "server not configured" }, 500);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1. Who is calling? From their sign-in token, not the request body.
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: who } = await supabase.auth.getUser(token);
    const userId = who?.user?.id;
    if (!userId) return json({ verified: false, error: "signed out" }, 401);

    // Already used? Same person: answer again (the app retries). Anyone else: refuse.
    const { data: used } = await supabase.from("subscription_payments").select("user_id").eq("reference", reference).maybeSingle();
    if (used) {
      if (used.user_id !== userId) return json({ verified: false, error: "reference already used" }, 409);
      const { data: sub } = await supabase.from("subscriptions").select("pro_until").eq("user_id", userId).maybeSingle();
      return json({ verified: true, pro_until: sub?.pro_until ?? null });
    }

    // 2. Ask Paystack.
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const ps = await psRes.json();
    const tx = ps?.data;
    if (!ps?.status || tx?.status !== "success") {
      return json({ verified: false, error: tx?.gateway_response || "payment not successful" }, 402);
    }

    // 3. This person's payment, in KES, for a real plan at its price.
    let meta = tx.metadata;
    if (typeof meta === "string") { try { meta = JSON.parse(meta); } catch { meta = {}; } }
    if (meta?.user_id && meta.user_id !== userId) return json({ verified: false, error: "payment belongs to another account" }, 403);
    const planId = meta?.plan;
    const plan = PLANS[planId];
    if (!plan) return json({ verified: false, error: "unknown plan" }, 400);
    if ((tx.currency || "KES") !== "KES") return json({ verified: false, error: "wrong currency" }, 402);
    if ((tx.amount ?? 0) < plan.kes * 100) return json({ verified: false, error: "amount too low" }, 402);

    // 4. Claim the reference first, so two calls at once can't both extend.
    const { error: claimErr } = await supabase.from("subscription_payments").insert({
      reference, user_id: userId, plan: planId, amount_kes: Math.round(tx.amount / 100), days: plan.days,
    });
    if (claimErr) {
      // 23505: another call claimed it a moment ago; anything else is a real failure.
      if (claimErr.code !== "23505") return json({ verified: false, error: claimErr.message }, 500);
      const { data: sub } = await supabase.from("subscriptions").select("pro_until").eq("user_id", userId).maybeSingle();
      return json({ verified: true, pro_until: sub?.pro_until ?? null });
    }

    // 5. Extend from max(now, current end).
    const { data: existing } = await supabase.from("subscriptions").select("pro_until").eq("user_id", userId).maybeSingle();
    const base = existing?.pro_until && Date.parse(existing.pro_until) > Date.now() ? new Date(existing.pro_until) : new Date();
    const proUntil = new Date(base.getTime() + plan.days * 86400000).toISOString();

    const { error } = await supabase.from("subscriptions").upsert(
      { user_id: userId, pro_until: proUntil, plan: planId, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    if (error) {
      // Give the reference back so a retry can finish the job.
      await supabase.from("subscription_payments").delete().eq("reference", reference);
      return json({ verified: false, error: error.message }, 500);
    }
    return json({ verified: true, pro_until: proUntil });
  } catch (e) {
    return json({ verified: false, error: String(e) }, 500);
  }
});
