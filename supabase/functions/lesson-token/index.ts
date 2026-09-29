// lesson-token — the key to a live lesson's video room.
//
// Only the family who booked the lesson and its tutor get a key, and only
// around the lesson time (30 minutes before it starts until an hour after it
// ends). Once the Agora project's App Certificate is switched on, the room
// cannot be joined without a key, so knowing a lesson's ID is no longer enough.
//
// Secrets: AGORA_APP_CERTIFICATE (from the Agora console). AGORA_APP_ID is
// optional; it defaults to the app's public ID.
// Deploy: paste into Supabase (Edge Functions -> lesson-token) and Deploy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { RtcTokenBuilder, RtcRole } from "npm:agora-token@2.0.6";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const APP_ID = Deno.env.get("AGORA_APP_ID") || "35a8f51c866e44bfbb7bd5e3970e75e4";
const EARLY_MIN = 30;  // the room opens this long before the start
const LATE_MIN = 60;   // and stays open this long after the end

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const CERT = Deno.env.get("AGORA_APP_CERTIFICATE");
  if (!CERT) return json({ error: "not_configured" }, 503);

  // Who is asking?
  const authHeader = req.headers.get("Authorization") || "";
  const url = Deno.env.get("SUPABASE_URL")!;
  const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ error: "signed_out", message: "Please sign in again." }, 401);

  let bookingId = "";
  try { bookingId = String((await req.json())?.booking_id || ""); } catch { /* handled below */ }
  if (!bookingId) return json({ error: "bad_request" }, 400);

  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: b } = await db.from("bookings")
    .select("id, student_id, tutor_id, status, lesson_date, start_time, duration_minutes")
    .eq("id", bookingId).maybeSingle();
  if (!b) return json({ error: "not_found", message: "We couldn't find this lesson." }, 404);

  const { data: t } = await db.from("tutors").select("user_id").eq("id", b.tutor_id).maybeSingle();
  const isFamily = b.student_id === user.id;
  const isTutor = t?.user_id === user.id;
  if (!isFamily && !isTutor) return json({ error: "not_yours", message: "This lesson belongs to another family." }, 403);
  if (b.status !== "confirmed") return json({ error: "not_confirmed", message: "This lesson isn't paid for yet, so the room is closed." }, 403);

  // Lesson times are Kenya time.
  const start = new Date(`${b.lesson_date}T${String(b.start_time).slice(0, 5)}:00+03:00`).getTime();
  const end = start + (Number(b.duration_minutes) || 60) * 60000;
  const now = Date.now();
  if (now < start - EARLY_MIN * 60000) {
    return json({ error: "too_early", message: `The room opens ${EARLY_MIN} minutes before the lesson.`, opens_at: new Date(start - EARLY_MIN * 60000).toISOString() }, 403);
  }
  if (now > end + LATE_MIN * 60000) return json({ error: "too_late", message: "This lesson has finished." }, 403);

  const expires = Math.floor((end + LATE_MIN * 60000 - now) / 1000);
  const channel = `lesson-${b.id}`;
  const token = RtcTokenBuilder.buildTokenWithUserAccount(APP_ID, CERT, channel, user.id, RtcRole.PUBLISHER, expires, expires);
  return json({ appId: APP_ID, channel, token, uid: user.id, role: isTutor ? "tutor" : "family" });
});
