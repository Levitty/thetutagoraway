// voice-tutor-token: short-lived tokens for the live tutor's voice (milestone 3, 11 Nov 2026).
//
// The browser listens through Deepgram and speaks through Cartesia directly, with a token from
// here; the keys stay on the server. The rules (switch, allowlist stub, session and day caps,
// tokens a minute) are in src/voice-tutor/tokens.js, tested by tests/voice-tutor-voice.test.mjs.
//
// Deploy:  supabase functions deploy voice-tutor-token
// Then record it: node scripts/function-drift.mjs --record voice-tutor-token
// Secrets: DEEPGRAM_API_KEY, CARTESIA_API_KEY (names only; the owner sets them), and the same
//          VOICE_TUTOR_ENABLED / VOICE_TUTOR_ALLOWLIST / caps as voice-tutor.
//          VOICE_TUTOR_TTS_VOICE (optional): the Cartesia voice id. VOICE_TUTOR_TTS_MODEL (optional).

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { mintToken } from "../src/voice-tutor/tokens.js";
import { settingsFrom } from "../src/voice-tutor/session.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });

const dbFor = (admin) => ({
  async getChild(id) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data } = await admin.from("children").select("id, parent_id").eq("id", id).maybeSingle();
    return data || null;
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
  async countTokens({ userId, since }) {
    const { count } = await admin.from("voice_tutor_usage").select("id", { count: "exact", head: true })
      .eq("user_id", userId).gte("created_at", since).overlaps("guard", ["token-stt", "token-tts"]);
    return count ?? 0;
  },
  async recordUsage(row) {
    const { error } = await admin.from("voice_tutor_usage").insert(row);
    if (error) console.error("voice_tutor_usage insert", error);
  },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const asUser = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return json({ error: "Sign in first." }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const out = await mintToken({
      user, body: await req.json().catch(() => ({})), db: dbFor(admin),
      settings: settingsFrom((k) => Deno.env.get(k)),
      keys: { deepgram: Deno.env.get("DEEPGRAM_API_KEY"), cartesia: Deno.env.get("CARTESIA_API_KEY") },
      fetch,
    });
    return json(out.body, out.status);
  } catch (e) {
    console.error(e);
    return json({ error: "Voice is not available just now. Please type." }, 500);
  }
});
