// school-practice: the door through which a school's system (Tuta) sets HOREB practice from its
// exam results, and later asks whether the learners mastered it.
//
// Called only by Tuta's server, never by a browser:
//   POST, body JSON { action: "assign" | "status", ... }
//   headers  x-door-code: WSL          the school's door (school_doors.code)
//            x-door-time: 1793600000   unix seconds; refused if more than 5 minutes off
//            x-door-sign: <hex>        HMAC-SHA256(door secret, `${time}.${body}`)
//
//   assign  { practice_ref (uuid), title, skill_ids: [...], learner_refs: [...], due_on }
//           -> { success: true }       (the same practice_ref again replaces it)
//   status  { practice_refs: [...] }
//           -> { success: true, status: { [practice_ref]: { [learner_ref]: { linked, mastered, mastered_at, practised } } } }
//
// Only learner references and HOREB skill ids cross. No names, phones or marks.
// Deploy: supabase functions deploy school-practice --no-verify-jwt   (Tuta has no HOREB login;
// the signature is the proof). Then record it: node scripts/function-drift.mjs --record school-practice

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

/*__DOOR_LIB__*/

const env = (k) => Deno.env.get(k) || "";
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { success: false, error: "POST only" });
  const body = await req.text();
  if (body.length > 200000) return json(413, { success: false, error: "Too large" });
  const code = (req.headers.get("x-door-code") || "").toUpperCase();
  if (!/^[A-Z]{2,6}$/.test(code)) return json(401, { success: false, error: "Unknown school" });

  const admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
  const { data: door } = await admin.from("school_doors").select("id, code, secret, active").eq("code", code).maybeSingle();
  // The same answer for an unknown school and a bad signature: nothing to learn by guessing.
  if (!door || !door.active) return json(401, { success: false, error: "Not allowed" });
  const v = await verifyCall(door.secret, req.headers.get("x-door-time"), body, req.headers.get("x-door-sign"), Math.floor(Date.now() / 1000));
  if (!v.ok) return json(401, { success: false, error: "Not allowed" });

  let p;
  try { p = JSON.parse(body); } catch { return json(400, { success: false, error: "Not JSON" }); }

  if (p.action === "assign") {
    const c = cleanAssign(p);
    if (!c.ok) return json(400, { success: false, error: c.error });
    const { error } = await admin.from("school_practice").upsert(
      { door_id: door.id, ...c.row, updated_at: new Date().toISOString() }, { onConflict: "door_id,practice_ref" });
    if (error) return json(500, { success: false, error: "Not saved" });
    return json(200, { success: true, skills: c.row.skill_ids.length, learners: c.row.learner_refs.length });
  }

  if (p.action === "status") {
    const refs = (Array.isArray(p.practice_refs) ? p.practice_refs : []).map(String).filter(r => /^[a-f0-9-]{36}$/.test(r)).slice(0, 100);
    if (!refs.length) return json(200, { success: true, status: {} });
    const { data: practices } = await admin.from("school_practice").select("practice_ref, skill_ids, learner_refs").eq("door_id", door.id).in("practice_ref", refs);
    const allRefs = [...new Set((practices || []).flatMap(x => x.learner_refs || []))];
    const { data: links } = allRefs.length
      ? await admin.from("school_learner_links").select("learner_ref, parent_id, child_id").eq("door_id", door.id).in("learner_ref", allRefs)
      : { data: [] };
    const keys = (links || []).map(l => childProfileKey(l.parent_id, l.child_id));
    const progress = {};
    if (keys.length) {
      const { data: rows } = await admin.from("ai_tutor_progress").select("profile_key, progress").in("profile_key", keys);
      for (const r of rows || []) progress[r.profile_key] = r.progress || {};
    }
    return json(200, { success: true, status: practiceStatus(practices || [], links || [], progress) });
  }

  return json(400, { success: false, error: "Unknown action" });
});
