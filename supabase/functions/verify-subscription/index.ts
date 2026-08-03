// verify-subscription — server-side Paystack verification for the 30-day pass.
//
// The client charges KSh 200 via Paystack, then calls this with the reference.
// We confirm the charge directly with Paystack (never trust the client), check
// the amount, and extend the learner's pass by 30 days from whichever is later:
// now, or their current pro_until. Writing with the service role is the ONLY
// way a subscription is granted — the table has no user-write policy.
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

const PASS_DAYS = 30;
const PRICE_KES = 200;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { reference, user_id } = await req.json();
    if (!reference || !user_id) return json({ verified: false, error: "missing reference or user_id" }, 400);

    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) return json({ verified: false, error: "server not configured" }, 500);

    // 1. Confirm the charge with Paystack.
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const ps = await psRes.json();
    const tx = ps?.data;
    if (!ps?.status || tx?.status !== "success") {
      return json({ verified: false, error: "payment not successful" }, 402);
    }
    // Paystack amounts are in the minor unit (KES cents). Guard against underpayment.
    if ((tx.amount ?? 0) < PRICE_KES * 100) {
      return json({ verified: false, error: "amount too low" }, 402);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 2. Extend from max(now, current pro_until).
    const { data: existing } = await supabase.from("subscriptions").select("pro_until").eq("user_id", user_id).maybeSingle();
    const base = existing?.pro_until && Date.parse(existing.pro_until) > Date.now()
      ? new Date(existing.pro_until) : new Date();
    const proUntil = new Date(base.getTime() + PASS_DAYS * 86400000).toISOString();

    const { error } = await supabase.from("subscriptions").upsert({
      user_id, pro_until: proUntil, plan: "monthly", updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) return json({ verified: false, error: error.message }, 500);

    return json({ verified: true, pro_until: proUntil });
  } catch (e) {
    return json({ verified: false, error: String(e) }, 500);
  }
});
