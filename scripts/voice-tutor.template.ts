// voice-tutor: one turn of the HOREB live tutor prototype (milestone 1, 10 Nov 2026).
//
// The decision is all in src/voice-tutor/tutorTurn.js (bundled below with the
// command validator, the guards, the fraction map, the probe bank and the
// safeguarding screen), and tests/voice-tutor-turn.test.mjs runs that code end
// to end. This file only wires it to Supabase and the Messages API:
//   - the caller is identified from their JWT; the switch and the allowlist
//     stub (adult test accounts only until consent, milestone 5) are checked
//     in tutorTurn.js before anything else;
//   - spend is read from and written to voice_tutor_usage (service role only;
//     no client policy), which holds the caps;
//   - a safeguarding hit is written to safeguarding_events, as Rocket does.
//
// Deploy:  supabase functions deploy voice-tutor
// Then record it: node scripts/function-drift.mjs --record voice-tutor
// Secrets: VOICE_TUTOR_ENABLED=1                       (off unless set)
//          VOICE_TUTOR_ALLOWLIST=a@x.com,b@y.com       (adult test accounts)
//          ANTHROPIC_API_KEY=sk-ant-...                (without it: authored lines only)
//          VOICE_TUTOR_MODEL=claude-sonnet-5-5         (optional; default)
//          VOICE_TUTOR_EFFORT=low                      (optional: low | medium | high)
//          VOICE_TUTOR_SESSION_CAP_USD=1.5  VOICE_TUTOR_DAY_CAP_USD=3   (optional; defaults)

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { runTutorTurn } from "../src/voice-tutor/tutorTurn.js";
import { settingsFrom } from "../src/voice-tutor/session.js";
import { screen, CHILD_HELPLINE } from "../src/ai/safeguarding.js";
import LIB from "../engine/data/curriculum/g5.misconceptions.json";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// Only the fraction misconceptions are needed; the rest of the library stays out of the prompt.
const FRACTION_LIB = Object.fromEntries(Object.entries(LIB).filter(([k]) => k.startsWith("MATH.G5.NUMBER.FRACTIONS.")));

// The Messages API by plain fetch, as rocket-guide and mark-composition do. A
// refusal is re-run on a model chosen by the API (server-side fallback); one
// that survives it is answered with an authored line in tutorTurn.js.
const callModelWith = (key) => async (request) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-beta": "server-side-fallback-2026-07-01" },
    body: JSON.stringify({ ...request, fallbacks: "default" }),
  });
  if (!res.ok) {
    console.error("anthropic", res.status, (await res.text().catch(() => "")).slice(0, 400));
    throw new Error(`model ${res.status}`);
  }
  return await res.json();
};

const dbFor = (admin) => ({
  async getChild(id) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data } = await admin.from("children").select("id, parent_id, name, grade").eq("id", id).maybeSingle();
    return data || null;
  },
  async getProgress(profileKey) {
    const { data } = await admin.from("ai_tutor_progress").select("progress").eq("profile_key", profileKey).maybeSingle();
    return data?.progress || null;
  },
  async spend({ sessionId, childKey, since }) {
    const [a, b] = await Promise.all([
      admin.from("voice_tutor_usage").select("cost_usd").eq("session_id", sessionId),
      admin.from("voice_tutor_usage").select("cost_usd").eq("child_key", childKey).gte("created_at", since),
    ]);
    if (a.error || b.error) throw new Error((a.error || b.error).message);
    const sum = (r) => (r.data || []).reduce((s, x) => s + Number(x.cost_usd || 0), 0);
    return { session: sum(a), day: sum(b) };
  },
  async recordUsage(row) {
    const { error } = await admin.from("voice_tutor_usage").insert(row);
    if (error) console.error("voice_tutor_usage insert", error);
  },
  async recordConcern(row) {
    const { data, error } = await admin.from("safeguarding_events").insert(row).select("id").single();
    if (error) { console.error("SAFEGUARDING insert failed", error); return; }
    await alertReviewer(admin, data.id, row);
  },
});

// The same alert as rocket-guide: a person reads it (today, for a crisis).
async function alertReviewer(admin, eventId, row) {
  const RESEND = Deno.env.get("RESEND_API_KEY");
  if (!RESEND) { console.error("SAFEGUARDING no RESEND_API_KEY, event", eventId, "is unnotified"); return; }
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
      body: JSON.stringify({
        from: "Tutagora <hello@tutagora.com>",
        to: Deno.env.get("SAFEGUARDING_EMAIL") || "hello@tutagora.com",
        subject: row.tier === "crisis" ? "URGENT safeguarding: a child may be at risk, read today" : "Safeguarding: a live tutor message needs a person to read it",
        html: `<p><b>Tier:</b> ${esc(row.tier)}<br><b>Where:</b> HOREB live tutor prototype<br><b>Categories:</b> ${esc((row.categories || []).join(", "))}</p>`
          + `<p><b>What matched:</b><br>${esc(row.excerpt)}</p><p><b>Event id:</b> ${esc(eventId)}</p>`
          + `<p>Kenya's child helpline is <b>${CHILD_HELPLINE.phone}</b>.</p>`,
      }),
    });
    if (res.ok) await admin.from("safeguarding_events").update({ notified_at: new Date().toISOString() }).eq("id", eventId);
  } catch (e) {
    console.error("SAFEGUARDING email threw, event", eventId, e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const text = await req.text();
    if (text.length > 60000) return json({ error: "Too large." }, 413);
    const asUser = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return json({ error: "Sign in first." }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    const out = await runTutorTurn({
      user, body: JSON.parse(text || "{}"), db: dbFor(admin),
      callModel: key ? callModelWith(key) : null, safeguard: screen,
      settings: settingsFrom((k) => Deno.env.get(k)), lib: FRACTION_LIB,
      secret: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    });
    return json(out.body, out.status);
  } catch (e) {
    console.error(e);
    return json({ error: "HOREB could not answer just now. Try again in a moment." }, 500);
  }
});
