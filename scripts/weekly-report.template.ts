// weekly-report — the Sunday message each opted-in parent gets about each child.
//
// Two ways in:
//   1. The weekly schedule (pg_cron), with header  x-cron-secret: <REPORT_CRON_SECRET>
//      → builds this week's report for every active report_settings row,
//        stores it in weekly_reports and sends it (once per child per week).
//   2. A signed-in parent, body { mode: "preview" }  → their reports, nothing sent
//                          body { mode: "test" }     → sends this week's reports
//                                                      to their own number now
//
// Sending (secrets; with none set, reports are stored as "preview", never sent):
//   WhatsApp via Twilio:  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (+2547…),
//                         TWILIO_CONTENT_SID (the approved template; without it the
//                         plain text is sent, which WhatsApp only delivers inside a
//                         24-hour conversation window)
//   SMS via Africa's Talking: AT_USERNAME ("sandbox" for testing), AT_API_KEY,
//                         AT_SENDER_ID (optional)
// A parent who chose WhatsApp gets SMS instead when only SMS is configured.
//
// Deploy: supabase functions deploy weekly-report   (or paste this file into the
// dashboard editor). Setup steps: docs/weekly-report-setup.md

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

/*__REPORT_LIB__*/

const SKILL_NAMES = /*__SKILL_NAMES__*/;
const skillName = (id) => SKILL_NAMES[id] || String(id).replace(/^G\d+_/, "").replace(/_/g, " ").toLowerCase();

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const env = (k) => Deno.env.get(k) || "";

// ---- building --------------------------------------------------------------

const buildForParent = async (admin, parentId, now) => {
  const week = reportWeek(now);
  const { data: kids } = await admin.from("children").select("id, name, grade").eq("parent_id", parentId).order("created_at");
  const out = [];
  for (const kid of kids || []) {
    const [{ data: prog }, { data: goal }, { data: essays }] = await Promise.all([
      admin.from("ai_tutor_progress").select("progress").eq("profile_key", `${parentId}_c${kid.id}`).maybeSingle(),
      admin.from("learner_goals").select("target_days, reward").eq("learner_id", kid.id).maybeSingle(),
      admin.from("compositions").select("score, created_at").eq("user_id", parentId).eq("learner_id", kid.id)
        .gte("created_at", new Date(week.startMs).toISOString()),
    ]);
    const report = buildWeeklyReport({
      name: kid.name,
      practiceDays: prog?.progress?.practiceDays || [],
      skills: prog?.progress?.skills || {},
      skillName,
      goal: goal || null,
      essays: essays || [],
      now,
    });
    out.push({ learner_id: kid.id, name: kid.name, ...report });
  }
  return out;
};

// ---- sending ---------------------------------------------------------------

const hasTwilio = () => !!(env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_WHATSAPP_FROM"));
const hasAT = () => !!(env("AT_USERNAME") && env("AT_API_KEY"));

const sendWhatsApp = async (phone, report) => {
  const sid = env("TWILIO_ACCOUNT_SID");
  const form = new URLSearchParams({ From: `whatsapp:${env("TWILIO_WHATSAPP_FROM")}`, To: `whatsapp:${phone}` });
  if (env("TWILIO_CONTENT_SID")) {
    form.set("ContentSid", env("TWILIO_CONTENT_SID"));
    form.set("ContentVariables", JSON.stringify(report.vars));
  } else {
    form.set("Body", report.text);
  }
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${sid}:${env("TWILIO_AUTH_TOKEN")}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (res.ok) return { status: "sent", channel: "whatsapp" };
  return { status: "failed", channel: "whatsapp", error: `twilio ${res.status}: ${(await res.text()).slice(0, 300)}` };
};

const sendSMS = async (phone, report) => {
  const sandbox = env("AT_USERNAME") === "sandbox";
  const form = new URLSearchParams({ username: env("AT_USERNAME"), to: phone, message: report.text });
  if (env("AT_SENDER_ID")) form.set("from", env("AT_SENDER_ID"));
  const res = await fetch(`https://api.${sandbox ? "sandbox." : ""}africastalking.com/version1/messaging`, {
    method: "POST",
    headers: { apiKey: env("AT_API_KEY"), Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const text = await res.text();
  let ok = res.ok;
  try {
    const r = JSON.parse(text)?.SMSMessageData?.Recipients?.[0];
    ok = ok && !!r && /success/i.test(r.status || "");
  } catch { ok = false; }
  return ok ? { status: "sent", channel: "sms" } : { status: "failed", channel: "sms", error: `africastalking ${res.status}: ${text.slice(0, 300)}` };
};

const send = async (settings, report) => {
  if (settings.channel === "whatsapp" && hasTwilio()) return sendWhatsApp(settings.phone, report);
  if (hasAT()) return sendSMS(settings.phone, report);
  return { status: "preview", channel: null, error: "no sending provider configured" };
};

// ---- the weekly run --------------------------------------------------------

const runForParent = async (admin, settings, now) => {
  const reports = await buildForParent(admin, settings.parent_id, now);
  const results = [];
  for (const r of reports) {
    const weekStart = r.stats.weekStart;
    const { data: existing } = await admin.from("weekly_reports").select("id, status")
      .eq("parent_id", settings.parent_id).eq("learner_id", r.learner_id).eq("week_start", weekStart).maybeSingle();
    if (existing?.status === "sent") { results.push({ learner_id: r.learner_id, status: "already sent" }); continue; }
    const outcome = await send(settings, r);
    await admin.from("weekly_reports").upsert({
      parent_id: settings.parent_id, learner_id: r.learner_id, week_start: weekStart,
      body: r.text, stats: r.stats, channel: outcome.channel, status: outcome.status,
      error: outcome.error || null, sent_at: outcome.status === "sent" ? new Date().toISOString() : null,
    }, { onConflict: "parent_id,learner_id,week_start" });
    results.push({ learner_id: r.learner_id, status: outcome.status });
  }
  return results;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
    const body = await req.json().catch(() => ({}));
    const now = new Date();

    // 1. The weekly schedule.
    const secret = env("REPORT_CRON_SECRET");
    if (secret && req.headers.get("x-cron-secret") === secret) {
      const { data: rows, error } = await admin.from("report_settings").select("parent_id, phone, channel").eq("active", true);
      if (error) return json({ error: error.message }, 500);
      let sent = 0, failed = 0, preview = 0;
      for (const s of rows || []) {
        for (const r of await runForParent(admin, s, now)) {
          if (r.status === "sent") sent++; else if (r.status === "failed") failed++; else if (r.status === "preview") preview++;
        }
      }
      return json({ parents: (rows || []).length, sent, failed, preview });
    }

    // 2. A signed-in parent, for their own account only.
    const asUser = createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return json({ error: "sign in first" }, 401);

    if (body.mode === "test") {
      const { data: s } = await admin.from("report_settings").select("parent_id, phone, channel").eq("parent_id", user.id).maybeSingle();
      if (!s) return json({ error: "save your phone number first" }, 400);
      if (!hasTwilio() && !hasAT()) return json({ error: "sending isn't set up yet" }, 503);
      const reports = await buildForParent(admin, user.id, now);
      const results = [];
      for (const r of reports) results.push({ learner_id: r.learner_id, ...(await send(s, r)) });
      return json({ results });
    }

    const reports = await buildForParent(admin, user.id, now);
    return json({ reports: reports.map(r => ({ learner_id: r.learner_id, name: r.name, text: r.text })) });
  } catch (e) {
    console.error("weekly-report", e);
    return json({ error: "something went wrong building the report" }, 500);
  }
});
