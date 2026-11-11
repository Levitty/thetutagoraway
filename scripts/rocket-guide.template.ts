// rocket-guide: one turn of the HOREB Rocket Challenge chat.
//
// The decision is all in src/rocket/turn.js (inlined below, with the level
// data, the safety and reply guards, the guide prompt and the safeguarding
// screen), and tests/rocket-turn.test.mjs runs that same code end to end.
// This file only wires it to Supabase and the Messages API:
//   - the caller is identified from their JWT;
//   - every read and write is done with the service role, after turn.js has
//     checked the caller is on the team (rocket_messages has no client write
//     policy, so HOREB's side of the chat can only come from here);
//   - a safeguarding hit is written to safeguarding_events and emailed, the
//     same way mark-composition does it.
//
// With no ANTHROPIC_API_KEY set the chat still works: HOREB answers from the
// authored questions and hints of each step, at no cost.
//
// Deploy:  supabase functions deploy rocket-guide
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   (optional, see above)
//          supabase secrets set ROCKET_MODEL=claude-opus-5-5   (optional; default)
//          RESEND_API_KEY and SAFEGUARDING_EMAIL are shared with mark-composition.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

/*__ROCKET_LIB__*/

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const MODEL = Deno.env.get("ROCKET_MODEL") || DEFAULT_MODEL;
const ALERT_TO = Deno.env.get("SAFEGUARDING_EMAIL") || "hello@tutagora.com";

// The Messages API, by plain fetch like mark-composition. Opus 5.5 can be
// declined by a safety classifier; the server-side fallback re-runs the turn
// on a model chosen by the API, and a refusal that survives it is handled in
// turn.js (the authored hint is served).
const callModelWith = (key: string) => async (request: any) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "server-side-fallback-2026-07-01",
    },
    body: JSON.stringify({ ...request, fallbacks: "default" }),
  });
  if (!res.ok) {
    console.error("anthropic", res.status, (await res.text().catch(() => "")).slice(0, 400));
    throw new Error(`model ${res.status}`);
  }
  return await res.json();
};

const dbFor = (admin: any, user: any) => ({
  async getTeam(id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const { data: team } = await admin.from("rocket_teams").select("*").eq("id", id).maybeSingle();
    if (!team) return null;
    const [{ data: members }, { data: challenge }, { data: school }] = await Promise.all([
      admin.from("rocket_members").select("*").eq("team_id", id).order("label"),
      admin.from("rocket_challenges").select("*").eq("id", team.challenge_id).maybeSingle(),
      admin.from("rocket_schools").select("id, name").eq("id", team.school_id).maybeSingle(),
    ]);
    return { team, members: members || [], challenge: challenge || {}, school };
  },
  async getLog(teamId: string) {
    const { data } = await admin.from("rocket_log").select("*").eq("team_id", teamId).order("created_at");
    return data || [];
  },
  async getMessages(teamId: string, level: number) {
    const { data } = await admin.from("rocket_messages").select("role, kind, author_label, body, step, created_at")
      .eq("team_id", teamId).eq("level", level).order("created_at").limit(400);
    return data || [];
  },
  async insertMessage(row: any) {
    const { data, error } = await admin.from("rocket_messages").insert(row).select("id").single();
    if (error) { console.error("rocket insert", error); throw new Error("could not save"); }
    return data;
  },
  async spend(teamId: string) {
    const { data } = await admin.from("rocket_messages").select("cost_usd").eq("team_id", teamId).gt("cost_usd", 0);
    return (data || []).reduce((s: number, r: any) => s + Number(r.cost_usd || 0), 0);
  },
  async countToday(teamId: string) {
    const start = new Date(); start.setUTCHours(0, 0, 0, 0);
    const { count } = await admin.from("rocket_messages").select("id", { count: "exact", head: true })
      .eq("team_id", teamId).eq("role", "team").gte("created_at", start.toISOString());
    return count ?? 0;
  },
  async recordConcern(row: any) {
    try {
      const { data, error } = await admin.from("safeguarding_events").insert(row).select("id").single();
      if (error) { console.error("SAFEGUARDING insert failed", error); return; }
      await alertReviewer(admin, data.id, row, user);
    } catch (e) {
      console.error("SAFEGUARDING insert threw", e);
    }
  },
});

async function alertReviewer(admin: any, eventId: string, row: any, user: any) {
  const RESEND = Deno.env.get("RESEND_API_KEY");
  if (!RESEND) { console.error("SAFEGUARDING no RESEND_API_KEY, event", eventId, "is unnotified"); return; }
  const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const urgent = row.tier === "crisis";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
      body: JSON.stringify({
        from: "Tutagora <hello@tutagora.com>",
        to: ALERT_TO,
        subject: urgent ? "URGENT safeguarding: a child may be at risk, read today" : "Safeguarding: a Rocket Challenge message needs a person to read it",
        html:
          `<p><b>Tier:</b> ${esc(row.tier)}<br><b>Where:</b> Rocket Challenge chat (team ${esc(row.source_id)})<br>` +
          `<b>Categories:</b> ${esc((row.categories || []).join(", "))}</p>` +
          `<p><b>What matched:</b><br>${esc(row.excerpt)}</p>` +
          `<p><b>Event id:</b> ${esc(eventId)}<br><b>Account:</b> ${esc(user.email || user.id)}<br><b>Grade:</b> ${esc(row.grade)}</p>` +
          `<p>The child was told nothing and HOREB's reply stayed ordinary. Kenya's child helpline is <b>${CHILD_HELPLINE.phone}</b>.</p>`,
      }),
    });
    if (!res.ok) { console.error("SAFEGUARDING email rejected", res.status); return; }
    await admin.from("safeguarding_events").update({ notified_at: new Date().toISOString() }).eq("id", eventId);
  } catch (e) {
    console.error("SAFEGUARDING email threw, event", eventId, e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    // The token is passed EXPLICITLY: getUser() with no argument looks for a stored session, and an edge function has none,
    // so every caller came back signed out (found 11 Nov 2026: Live in the voice tutor refused every tester; see verify-subscription).
    const { data: { user } } = await asUser.auth.getUser((req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim());
    if (!user) return json({ error: "Sign in first." }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    const out = await runTurn({
      user, body: await req.json(), db: dbFor(admin, user),
      callModel: key ? callModelWith(key) : null,
      safeguard: screen, model: MODEL,
    });
    return json(out.body, out.status);
  } catch (e) {
    console.error(e);
    return json({ error: "HOREB could not answer just now. Try again in a moment." }, 500);
  }
});
