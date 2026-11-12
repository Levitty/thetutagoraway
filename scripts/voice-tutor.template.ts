// voice-tutor: one turn of the HOREB live tutor prototype (milestones 1 to 3b, 10-11 Nov 2026).
// The turn streams: the model's reply is read as it is written, each step checked, then sent as a line.
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
//          VOICE_TUTOR_MAX_SNAPSHOTS=30                (optional; pictures of the child's work a session)
// A picture of the child's work arrives with a turn and goes to the model; it is never stored.
//          RESEND_API_KEY, SAFEGUARDING_EMAIL           (the lesson report to the parent; a safeguarding alert to a person)
// Needs 20261111_learner_evidence.sql and 20261112_learner_profile.sql (Tuta Workspace/HOREB_LEARNER_MODEL_SQL.sql).

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { prepareTurn } from "../src/voice-tutor/tutorTurn.js";
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

// The Messages API by plain fetch, streamed (Server-Sent Events): each text delta is handed to
// onText as it arrives, so tutorTurn.js can check and send each step as soon as it is written.
// A refusal is re-run on a model chosen by the API (server-side fallback); one that survives it
// ends the turn with an authored line. Usage (every token, for the caps) comes in the events.
const callModelWith = (key) => async (request, { onText }) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    // No server-side fallback parameter (12 Nov 2026): one fewer thing the API can refuse. A refusal ends the turn
    // with an authored line (tutorTurn.js), as before.
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ ...request, stream: true }),
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    console.error("anthropic", res.status, text.slice(0, 400));
    // The API's own message (never a key) goes to the tester view, so a failure is never silent again.
    let why = ""; try { why = JSON.parse(text)?.error?.message || ""; } catch { why = text; }
    throw new Error(`model ${res.status}: ${String(why).slice(0, 160)}`);
  }
  const usage = {}; let stop_reason = null;
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let cut;
    while ((cut = buf.indexOf("\n\n")) >= 0) {
      const block = buf.slice(0, cut); buf = buf.slice(cut + 2);
      const line = block.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      let ev; try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
      if (ev.type === "message_start") Object.assign(usage, ev.message?.usage || {});
      else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") onText(ev.delta.text);
      else if (ev.type === "message_delta") { Object.assign(usage, ev.usage || {}); stop_reason = ev.delta?.stop_reason ?? stop_reason; }
      else if (ev.type === "error") throw new Error(ev.error?.message || "model stream error");
    }
  }
  return { usage, stop_reason };
};

// One text key for a learner: the account and, when there is one, the child on it (a school learner would be door and reference).
const learnerKey = (userId, childId) => (childId ? `${userId}:${childId}` : `${userId}:-`);

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
      admin.from("voice_tutor_usage").select("cost_usd, snapshots, created_at").eq("session_id", sessionId),
      admin.from("voice_tutor_usage").select("cost_usd").eq("child_key", childKey).gte("created_at", since),
    ]);
    if (a.error || b.error) throw new Error((a.error || b.error).message);
    const sum = (r) => (r.data || []).reduce((s, x) => s + Number(x.cost_usd || 0), 0);
    const pics = (a.data || []).filter((x) => Number(x.snapshots) > 0);
    return {
      session: sum(a), day: sum(b),
      snapshots: pics.reduce((s, x) => s + Number(x.snapshots), 0),
      lastSnapshotAt: pics.map((x) => x.created_at).sort().pop() || null,
    };
  },
  async recordUsage(row) {
    const { error } = await admin.from("voice_tutor_usage").insert(row);
    if (error) console.error("voice_tutor_usage insert", error);
  },
  // One marked answer in the learner's evidence log (response_events). A duplicate is the row already there.
  async recordEvidence(row) {
    const { error } = await admin.from("response_events").insert(row);
    if (error && error.code !== "23505") console.error("response_events insert", error);
  },
  // The learner model for the tutor, in one read: this child's fraction evidence (newest 500), the profile, the notes of the last 90 days.
  async getLearner({ userId, childId, since }) {
    const key = learnerKey(userId, childId);
    let ev = admin.from("response_events")
      .select("created_at, client_ts, cskill, skill_id, correct, misconception, independent, hints_used, marks, max_marks, difficulty, item_ref, source")
      .eq("student_id", userId).like("cskill", "MATH.G5.NUMBER.FRACTIONS.%").order("created_at", { ascending: false }).limit(500);
    ev = childId ? ev.eq("learner_id", childId) : ev.is("learner_id", null);
    const [e, p, n] = await Promise.all([
      ev,
      admin.from("learner_profile").select("interests, what_helps").eq("learner_key", key).maybeSingle(),
      admin.from("learner_session_notes").select("notes, open_questions, created_at").eq("learner_key", key).gte("created_at", since).order("created_at", { ascending: false }).limit(3),
    ]);
    if (e.error) throw new Error(e.error.message);
    // A missing profile or notes table (migration not run) is no profile, never a failed turn.
    return { rows: e.data || [], profile: p.error ? null : p.data, notes: n.error ? [] : (n.data || []) };
  },
  async saveProfile({ userId, childId, interests, what_helps }) {
    const { error } = await admin.from("learner_profile").upsert({ learner_key: learnerKey(userId, childId), student_id: userId, learner_id: childId, interests, what_helps, updated_at: new Date().toISOString() }, { onConflict: "learner_key" });
    if (error) console.error("learner_profile upsert", error);
  },
  // Notes older than 90 days are deleted by a trigger on this table (20261112_learner_profile.sql).
  async saveNote({ userId, childId, sessionId, notes, openQuestions }) {
    const { error } = await admin.from("learner_session_notes").insert({ learner_key: learnerKey(userId, childId), student_id: userId, learner_id: childId, session_id: sessionId, notes, open_questions: openQuestions });
    if (error && error.code !== "23505") console.error("learner_session_notes insert", error);
  },
  // One report a lesson: a second save for the same session is the report already there (fresh false: not emailed again).
  async saveReport({ parentId, learnerId, sessionId, subject, body, facts }) {
    const { data, error } = await admin.from("lesson_reports").insert({ parent_id: parentId, learner_id: learnerId, session_id: sessionId, subject, body, facts }).select("id").single();
    if (error) { if (error.code !== "23505") console.error("lesson_reports insert", error); return error.code === "23505" ? { id: null, fresh: false } : null; }
    return { id: data.id, fresh: true };
  },
  async getReportPrefs(parentId) {
    const { data } = await admin.from("lesson_report_settings").select("email_lesson_reports").eq("parent_id", parentId).maybeSingle();
    return data || null;
  },
  // The report to the parent, by Resend like the other functions. true sent, false failed, null no key set.
  async sendEmail({ to, subject, html, text }) {
    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) return null;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
        body: JSON.stringify({ from: "HOREB by Tutagora <hello@tutagora.com>", to, subject, html, text }),
      });
      return res.ok;
    } catch (e) { console.error("lesson report email threw", e); return false; }
  },
  async markReportEmailed(id, status) {
    await admin.from("lesson_reports").update({ email_status: status, emailed_at: status === "sent" ? new Date().toISOString() : null }).eq("id", id);
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
    if (text.length > 400000) return json({ error: "Too large." }, 413);
    const asUser = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    // The token is passed EXPLICITLY: getUser() with no argument looks for a stored session, and an edge function has none,
    // so every caller came back signed out (found 11 Nov 2026: Live in the voice tutor refused every tester; see verify-subscription).
    const { data: { user } } = await asUser.auth.getUser((req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim());
    if (!user) return json({ error: "Sign in first." }, 401);
    const admin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    const turn = await prepareTurn({
      user, body: JSON.parse(text || "{}"), db: dbFor(admin),
      callModel: key ? callModelWith(key) : null, safeguard: screen,
      settings: settingsFrom((k) => Deno.env.get(k)), lib: FRACTION_LIB,
      secret: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    });
    if (!turn.go) return json(turn.body, turn.status);
    // The turn streams as one JSON event per line; each step only after it has been checked.
    const enc = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (ev) => controller.enqueue(enc.encode(`${JSON.stringify(ev)}\n`));
        try { await turn.go(emit); } catch (e) { console.error(e); emit({ type: "end", guard: ["server-error"], broken: true }); }
        controller.close();
      },
    });
    return new Response(stream, { status: 200, headers: { ...cors, "Content-Type": "application/x-ndjson", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
  } catch (e) {
    console.error(e);
    return json({ error: "HOREB could not answer just now. Try again in a moment." }, 500);
  }
});
