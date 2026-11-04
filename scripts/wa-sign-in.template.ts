// wa-sign-in: sign in to HOREB from the Tutagora WhatsApp line.
//
// The decisions are all in src/auth/waSignIn.js (inlined below) and
// tests/wa-sign-in.test.mjs runs that same code. This file only wires it up:
//
//   issue   server to server, from Tutagora only. x-door-time + x-door-sign =
//           HMAC-SHA256(WA_SIGNIN_SECRET, "<time>.<body>"), five minutes, each
//           signature once (wa_sign_in_links.request_sig). The phone is the
//           sender's number as Meta gave it. One parent or tutor account with
//           that phone -> a link to /dashboard#wa=<token>. Admin -> "password".
//           Anything else -> "none", which says nothing about the number.
//   redeem  from the browser. The token is taken once (one UPDATE, used_at IS
//           NULL AND expires_at > now()), the account is checked again, and a
//           one-time Supabase sign-in code (admin generateLink) is returned in
//           the reply body; the page turns it into a session with verifyOtp.
//
// Links: 32 random bytes, only the SHA-256 kept, 10 minutes, one use; a new one
// cancels the account's earlier unused ones. 3 a number an hour, a daily cap.
// Every issue, refusal and use is written to wa_sign_in_log.
//
// Deploy:  supabase functions deploy wa-sign-in --no-verify-jwt
//          (or Actions -> Deploy edge function -> wa-sign-in)
// Secrets: WA_SIGNIN_SECRET      the shared secret, also saved in Tutagora (Settings, WhatsApp)
//          HOREB_SITE_URL        optional, default https://tutagora.com
//          WA_SIGNIN_ENABLED     optional, "0" switches sign-in by WhatsApp off
//          WA_SIGNIN_DAILY_CAP   optional, default 300

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

/*__WA_SIGN_IN_LIB__*/

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const SECRET = Deno.env.get("WA_SIGNIN_SECRET") || "";
const SITE = Deno.env.get("HOREB_SITE_URL") || "https://tutagora.com";
const ENABLED = Deno.env.get("WA_SIGNIN_ENABLED") !== "0";
const CAP = Number(Deno.env.get("WA_SIGNIN_DAILY_CAP")) || DEFAULT_DAILY_CAP;

async function log(action, ok, why, phone9, profileId) {
  await db.from("wa_sign_in_log").insert({ action, ok, why: String(why || "").slice(0, 200), phone_tail: phone9 ? phone9.slice(-3) : null, profile_id: profileId || null });
}

/** Accounts whose phone is this number, with what decides their link. */
async function accountsFor(phone9) {
  const { data } = await db.from("profiles").select("id, phone, role, is_admin, email").not("phone", "is", null);
  const hits = (data || []).filter((p) => nine(p.phone) === phone9);
  const out = [];
  for (const p of hits) {
    const [{ count }, { data: au }] = await Promise.all([
      db.from("children").select("id", { count: "exact", head: true }).eq("parent_id", p.id),
      db.auth.admin.getUserById(p.id),
    ]);
    out.push({ id: p.id, role: p.role, is_admin: p.is_admin, email: au?.user?.email || "", account_type: au?.user?.user_metadata?.account_type || null, children: count || 0 });
  }
  return out;
}

async function issue(req, raw) {
  const ok = await doorSignatureOk(SECRET, req.headers.get("x-door-time") || "", raw, req.headers.get("x-door-sign") || "", Math.floor(Date.now() / 1000));
  if (!ok) return json({ ok: false, error: "not allowed" }, 401);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const phone9 = nine(body.phone);
  const phoneHash = await hmacHex(SECRET, `phone:${phone9}`);
  const now = Date.now();
  const [{ count: phoneCount }, { count: dayCount }] = await Promise.all([
    db.from("wa_sign_in_links").select("id", { count: "exact", head: true }).eq("phone_hash", phoneHash).gte("created_at", new Date(now - 3600000).toISOString()),
    db.from("wa_sign_in_links").select("id", { count: "exact", head: true }).gte("created_at", new Date(now - 86400000).toISOString()),
  ]);
  const d = decideIssue({ phone9, enabled: ENABLED, matches: ENABLED && phone9 ? await accountsFor(phone9) : [], phoneLinksLastHour: phoneCount || 0, linksToday: dayCount || 0, dailyCap: CAP });
  if (d.result !== "link") { await log("refused", false, d.why || d.result, phone9, null); return json({ ok: true, result: d.result }); }

  await db.from("wa_sign_in_links").update({ expires_at: new Date(now).toISOString() }).eq("profile_id", d.profile_id).is("used_at", null).gt("expires_at", new Date(now).toISOString());
  const token = newToken();
  const { error } = await db.from("wa_sign_in_links").insert({
    token_hash: await sha256Hex(token), profile_id: d.profile_id, phone_hash: phoneHash, phone_tail: phone9.slice(-3),
    expires_at: expiresAt(now), request_sig: await sha256Hex(req.headers.get("x-door-sign") || ""),
  });
  if (error) {
    const replay = /request_sig/.test(error.message || "");
    await log("refused", false, replay ? "replay" : "store_failed", phone9, d.profile_id);
    return json({ ok: false, error: replay ? "replay" : "could not store the link" }, replay ? 409 : 500);
  }
  await log("issued", true, d.kind, phone9, d.profile_id);
  return json({ ok: true, result: "link", url: linkUrl(SITE, token), minutes: LINK_MINUTES });
}

async function redeem(raw) {
  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const fail = (why) => json({ ok: false, error: why, message: "This sign-in link has expired or was already used. Ask the WhatsApp line for a new one, or sign in with your password." }, 400);
  if (!tokenLooksRight(body.token)) return fail("bad_token");
  const hash = await sha256Hex(body.token);
  const nowIso = new Date().toISOString();
  const { data: taken } = await db.from("wa_sign_in_links").update({ used_at: nowIso })
    .eq("token_hash", hash).is("used_at", null).gt("expires_at", nowIso).select("profile_id");
  const row = (taken || [])[0];
  if (!row) {
    const { data: seen } = await db.from("wa_sign_in_links").select("used_at, expires_at, profile_id").eq("token_hash", hash).maybeSingle();
    const why = redeemable(seen, Date.now());
    if (seen) await log("refused", false, `redeem_${why}`, "", seen.profile_id);
    return fail(why);
  }
  // Check the account again: it may have changed in the ten minutes.
  const { data: p } = await db.from("profiles").select("phone").eq("id", row.profile_id).maybeSingle();
  const phone9 = nine(p?.phone);
  const again = decideIssue({ phone9, enabled: ENABLED, matches: phone9 ? (await accountsFor(phone9)).filter((a) => a.id === row.profile_id) : [], phoneLinksLastHour: 0, linksToday: 0, dailyCap: 1 });
  if (again.result !== "link") { await log("refused", false, `redeem_${again.result}`, phone9, row.profile_id); return fail("account_changed"); }
  const { data: au } = await db.auth.admin.getUserById(row.profile_id);
  const email = au?.user?.email;
  if (!email) return fail("no_email");
  const { data: link, error } = await db.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = link?.properties?.hashed_token;
  if (error || !tokenHash) { await log("refused", false, "generate_failed", phone9, row.profile_id); return json({ ok: false, error: "could not sign in" }, 500); }
  await log("used", true, again.kind, phone9, row.profile_id);
  return json({ ok: true, token_hash: tokenHash, type: "magiclink" });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "POST only" }, 405);
  if (!SECRET) return json({ ok: false, error: "not_configured" }, 503);
  const raw = await req.text();
  let action = "";
  try { action = String(JSON.parse(raw)?.action || ""); } catch { return json({ ok: false, error: "bad json" }, 400); }
  try {
    if (action === "issue") return await issue(req, raw);
    if (action === "redeem") return await redeem(raw);
    return json({ ok: false, error: "unknown action" }, 400);
  } catch (e) {
    console.error("[wa-sign-in]", e);
    return json({ ok: false, error: "server error" }, 500);
  }
});
