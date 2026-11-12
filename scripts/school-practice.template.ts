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
//   class_rechecks { learner_refs: [...], max? } -> { success: true, learners, with_evidence, rechecks: [{ cskill, due, of, overdue }] }
//           skills at least 25% of the class (and 3 children) are due to re-check, counts only (12 Nov 2026), see src/school/recheckDoor.js
//   learner_states { learner_refs: [...] } -> { success: true, learners, with_evidence, states: { [learner_ref]: { skills, outcomes } } }
//           the five mastery states per skill and outcome, in words, counts only (12 Nov 2026), see src/school/statesDoor.js
//   evidence { items: [{ learner_ref, question_id, outcome_code, substrand_code, marks, max_marks, ... }] }
//           -> { success: true, received, saved, updated, same, skipped }   exam marks into the learner's evidence log
//           (12 Nov 2026), see src/school/evidenceDoor.js
//   mark_writing { learner_ref, language, grade, type?, prompt, title?, text } -> { success: true, mock, model, suggestion: { total, level, bands, ... },
//           attention? }   a SUGGESTED mark for one composition or insha, the teacher marks (12 Nov 2026), see src/school/writingDoor.js.
//           MOCK unless this function has SCHOOL_WRITING_LIVE=1 and ANTHROPIC_API_KEY (secrets); nothing is stored here
//   homework_preview, homework_set, homework_status, homework_reopen   homework drawn from the curriculum
//           families (10 Nov 2026), see src/school/homeworkDoor.js
//
// Only learner references and HOREB skill ids cross. No names or phones. Marks cross only for `evidence`.
// Deploy: supabase functions deploy school-practice --no-verify-jwt   (Tuta has no HOREB login;
// the signature is the proof). Then record it: node scripts/function-drift.mjs --record school-practice

// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

import { verifyCall, cleanAssign, practiceStatus, childProfileKey } from "../src/school/schoolDoor.js";
import { doorHomework, makeCodeFrom } from "../src/school/homeworkDoor.js";
import { doorEvidence } from "../src/school/evidenceDoor.js";
import { doorClassRechecks } from "../src/school/recheckDoor.js";
import { doorLearnerStates } from "../src/school/statesDoor.js";
import { doorMarkWriting } from "../src/school/writingDoor.js";
import { supabaseStore } from "../src/school/homeworkStore.js";

// The child's link: HOREB's own page, keyed by the sitting's code (public/hw/index.html).
const HOREB_SITE = "https://tutagora.com";

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

  if (p.action === "evidence") {
    const r = await doorEvidence(door, p, { store: supabaseStore(admin) }).catch(() => ({ status: 500, body: { success: false, error: "Not saved" } }));
    return json(r.status, r.body);
  }

  if (p.action === "mark_writing") {
    // Switched off unless the owner sets SCHOOL_WRITING_LIVE=1 (and the key) on this function: then it is the mock, and says so.
    const live = env("SCHOOL_WRITING_LIVE") === "1" && env("ANTHROPIC_API_KEY") !== "";
    const model = env("MARKING_MODEL") || "claude-sonnet-5";
    const marker = live ? async (reqBody) => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
        body: JSON.stringify(reqBody),
      });
      if (!res.ok) throw new Error("anthropic " + res.status);
      const out = await res.json();
      return (out.content || []).find((c) => c.type === "tool_use" && c.name === "mark")?.input;
    } : null;
    const r = await doorMarkWriting(door, p, { marker, model }).catch(() => ({ status: 500, body: { success: false, error: "Not marked" } }));
    return json(r.status, r.body);
  }

  if (p.action === "class_rechecks") {
    const r = await doorClassRechecks(door, p, { store: supabaseStore(admin), now: () => Date.now() }).catch(() => ({ status: 500, body: { success: false, error: "Not read" } }));
    return json(r.status, r.body);
  }

  if (p.action === "learner_states") {
    const r = await doorLearnerStates(door, p, { store: supabaseStore(admin), now: () => Date.now() }).catch(() => ({ status: 500, body: { success: false, error: "Not read" } }));
    return json(r.status, r.body);
  }

  if (String(p.action || "").startsWith("homework_")) {
    const r = await doorHomework(door, p, {
      store: supabaseStore(admin), now: () => Date.now(),
      makeCode: makeCodeFrom((n) => crypto.getRandomValues(new Uint8Array(n))),
      linkFor: (c) => `${HOREB_SITE}/hw/?c=${c}`,
    }).catch(() => ({ status: 500, body: { success: false, error: "Not saved" } }));
    if (r) return json(r.status, r.body);
  }

  return json(400, { success: false, error: "Unknown action" });
});
