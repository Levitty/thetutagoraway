// school-homework: the child's side of homework a school set from the curriculum (10 Nov 2026).
//
// Called by the child's phone from HOREB's page /hw/?c=CODE. No login for the pilot: the sitting's code
// (ten characters, from the school's Tuta, printed on the parent's link) is the key, as Tuta's own
// online homework. One question at a time, in order, marked at once; leaving the page locks it.
//   POST { action: "open" | "start" | "answer" | "leave", code, n?, response? }
// When the child hands in, or the sitting locks, the results go to the school's Tuta, signed with the
// school's door secret (school_doors.results_url). Only the learner reference and codes cross.
//
// The learner home (11 Nov 2026, src/school/learnerHome.js): all of one learner's homework.
//   POST { action: "learner_home", link: "WSL-K7QM2XPA-H3RT" }   the page /hw/?l=..., no account; the
//        check is verified with the door's secret; ten wrong codes an hour per network address
//        (kept as a hash, never the address: school_home_attempts, migration 20261111_learner_home.sql)
//   POST { action: "learner_home", child: "<uuid>" } + the parent's sign-in   the family app, a linked child
// Deploy: supabase functions deploy school-homework --no-verify-jwt
// Then record it: node scripts/function-drift.mjs --record school-homework

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { signCall } from "../src/school/schoolDoor.js";
import { learnerHomework } from "../src/school/homeworkLearner.js";
import { supabaseStore } from "../src/school/homeworkStore.js";

const env = (k) => Deno.env.get(k) || "";
// The site, and the family app on a phone (Capacitor serves it from these).
const ORIGINS = ["https://tutagora.com", "https://www.tutagora.com", "capacitor://localhost", "https://localhost"];
const cors = (req) => {
  const o = req.headers.get("origin") || "";
  return { "access-control-allow-origin": ORIGINS.includes(o) ? o : ORIGINS[0], "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS", vary: "origin" };
};

// The network address, kept only as a hash, for the learner home's limit on wrong codes.
const ipKey = async (req) => {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("learner-home:" + ip));
  return Array.from(new Uint8Array(d)).slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Tuta's door for results: the same signature Tuta puts on its own calls, the other way round.
const push = async (door, body) => {
  const text = JSON.stringify(body);
  const time = String(Math.floor(Date.now() / 1000));
  const r = await fetch(door.results_url, { method: "POST", headers: { "content-type": "application/json", "x-door-code": door.code, "x-door-time": time,
    "x-door-sign": await signCall(door.secret, time, text) }, body: text });
  return r.ok;
};

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return new Response(JSON.stringify({ success: false, error: "POST only" }), { status: 405, headers: { ...h, "content-type": "application/json" } });
  const text = await req.text();
  if (text.length > 4000) return new Response(JSON.stringify({ success: false, error: "Too large" }), { status: 413, headers: { ...h, "content-type": "application/json" } });
  let p; try { p = JSON.parse(text); } catch { p = null; }
  const admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const userId = async () => {
    if (!token || token === env("SUPABASE_ANON_KEY")) return null;
    const { data } = await admin.auth.getUser(token);
    return data?.user?.id || null;
  };
  const r = await learnerHomework(p || {}, { store: supabaseStore(admin), now: () => Date.now(), push, ipKey: await ipKey(req), userId })
    .catch(() => ({ status: 500, body: { success: false, error: "Something went wrong. Try again." } }));
  return new Response(JSON.stringify(r.body), { status: r.status, headers: { ...h, "content-type": "application/json" } });
});
