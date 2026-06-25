// verify-payment — server-side Paystack verification.
//
// The browser must NOT be trusted to say "payment succeeded". This function
// asks Paystack directly (with the secret key) whether the transaction really
// succeeded and for at least the lesson price, then — and only then — records
// the payment and confirms the booking using the service role.
//
// Deploy:  supabase functions deploy verify-payment
// Secret:  supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ verified: false, error: "POST only" }, 405);

  try {
    const { reference, booking_id, group_class_id, student_id } = await req.json();
    if (!reference) return json({ verified: false, error: "missing reference" }, 400);
    if (!booking_id && !group_class_id) {
      return json({ verified: false, error: "missing booking_id or group_class_id" }, 400);
    }

    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) return json({ verified: false, error: "server not configured (PAYSTACK_SECRET_KEY)" }, 500);

    // 1) Ask Paystack whether this transaction really succeeded.
    const psRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const ps = await psRes.json();
    const tx = ps?.data;
    if (!ps?.status || tx?.status !== "success") {
      return json({ verified: false, reason: tx?.gateway_response || "payment not successful" });
    }

    // 2) Service-role client — bypasses RLS to read records and write results.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ---- Group-class enrolment branch ----
    if (group_class_id) {
      if (!student_id) return json({ verified: false, error: "missing student_id" }, 400);

      const { data: gc, error: gErr } = await supabase
        .from("group_classes")
        .select("id, max_students, price_per_student, status")
        .eq("id", group_class_id).single();
      if (gErr || !gc) return json({ verified: false, error: "class not found" }, 404);
      if (gc.status !== "open") return json({ verified: false, reason: "class is not open" });

      // Amount paid must cover the per-student price.
      const expectedKobo = Math.round(Number(gc.price_per_student || 0) * 100);
      if (expectedKobo > 0 && Number(tx.amount) < expectedKobo) {
        return json({ verified: false, reason: "amount paid is less than the class price" });
      }

      // Idempotent: if this student already has a row, we're done.
      const { data: already } = await supabase
        .from("group_class_enrollments").select("id")
        .eq("group_class_id", group_class_id).eq("student_id", student_id).maybeSingle();
      if (already) return json({ verified: true });

      // Capacity check (service role sees every enrolment).
      const { count } = await supabase
        .from("group_class_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("group_class_id", group_class_id);
      if ((count ?? 0) >= Number(gc.max_students || 0)) {
        return json({ verified: false, reason: "class is full" });
      }

      const { error: insErr } = await supabase.from("group_class_enrollments").insert({
        group_class_id,
        student_id,
        amount_paid: Number(tx.amount) / 100,
        payment_reference: reference,
        status: "enrolled",
      });
      if (insErr) return json({ verified: false, error: insErr.message }, 500);
      return json({ verified: true });
    }

    // ---- 1-on-1 booking branch ----
    const { data: booking, error: bErr } = await supabase
      .from("bookings").select("id, student_id, tutor_id").eq("id", booking_id).single();
    if (bErr || !booking) return json({ verified: false, error: "booking not found" }, 404);

    // 3) Make sure the amount paid covers the lesson price (stops underpayment).
    const { data: tutorRow } = await supabase
      .from("tutors").select("hourly_rate").eq("id", booking.tutor_id).maybeSingle();
    const expectedKobo = Math.round(Number(tutorRow?.hourly_rate || 0) * 100);
    if (expectedKobo > 0 && Number(tx.amount) < expectedKobo) {
      return json({ verified: false, reason: "amount paid is less than the lesson price" });
    }

    // 4) Record the payment once (idempotent on the Paystack reference).
    const { data: existing } = await supabase
      .from("payments").select("id").eq("mpesa_reference", reference).maybeSingle();
    if (!existing) {
      await supabase.from("payments").insert({
        booking_id: booking.id,
        student_id: booking.student_id,
        tutor_id: booking.tutor_id,
        amount: Number(tx.amount) / 100,
        currency: tx.currency || "KES",
        method: "card",
        status: "completed",
        mpesa_reference: reference,
      });
    }

    await supabase.from("bookings").update({ status: "confirmed" }).eq("id", booking.id);
    return json({ verified: true });
  } catch (e) {
    return json({ verified: false, error: String((e as Error)?.message || e) }, 500);
  }
});
