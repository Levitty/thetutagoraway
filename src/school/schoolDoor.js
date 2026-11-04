// ============================================================================
// SCHOOL DOOR — the narrow way a school's exam results set HOREB practice.
//
// Tuta (the school system) and HOREB are separate apps with separate
// databases. Between them, one door per school, like the leave door between
// Tuta and HR: a shared secret that only the two servers hold.
//
//   link codes   WSL-K7QM2XPA-H3RT: the door, a learner reference that Tuta
//                made up (never a name or admission number) and a four-letter
//                check from the door's secret, so a parent cannot guess a
//                reference that the school did not hand out.
//   signatures   Tuta signs each call to the school-practice function:
//                HMAC-SHA256(secret, `${unix seconds}.${body}`), hex.
//   status       for each practice, per learner reference: linked or not, and
//                which of the set skills the child has mastered, and when.
//                Read from ai_tutor_progress, the one record of what a child
//                knows; no names, no marks.
//
// Pure: no database, no clock of its own (callers pass `now`). WebCrypto only,
// so the same file runs in Node (tests) and Deno (the edge function, which
// inlines it: scripts/build-school-practice-fn.mjs).
// ============================================================================

export const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const MAX_SKEW_SECONDS = 300;

const enc = new TextEncoder();
const hex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

const hmac = async (secret, text) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, enc.encode(text));
};

/** The four-character check on a link code. Matches school_link_check() in SQL and Tuta's horebLinkCheck(). */
export const linkCheck = async (secret, door, ref) => {
  const b = new Uint8Array(await hmac(secret, `link:${door}:${ref}`));
  return Array.from(b.slice(0, 4)).map(x => CODE_CHARS[x % 31]).join('');
};

/** "wsl-k7qm 2xpa-h3rt" -> { door: 'WSL', ref: 'K7QM2XPA', check: 'H3RT' }, or null. */
export const parseLinkCode = (code) => {
  const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (c.length < 14 || c.length > 18) return null;
  const door = c.slice(0, c.length - 12), ref = c.slice(-12, -4), check = c.slice(-4);
  if (!/^[A-Z]{2,6}$/.test(door) || !/^[A-Z2-9]{8}$/.test(ref)) return null;
  return { door, ref, check };
};

/** Tuta's signature on a call: hex HMAC of `${time}.${body}`. */
export const signCall = async (secret, time, body) => hex(await hmac(secret, `${time}.${body}`));

/** Constant-time comparison of two hex strings. */
const sameHex = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

/** Is this call from the school that holds the secret, and recent? `now` in seconds. */
export const verifyCall = async (secret, time, body, signature, now) => {
  const t = Number(time);
  if (!Number.isFinite(t) || Math.abs(now - t) > MAX_SKEW_SECONDS) return { ok: false, why: 'stale' };
  const want = await signCall(secret, String(time), body);
  return sameHex(want, String(signature || '').toLowerCase()) ? { ok: true } : { ok: false, why: 'signature' };
};

const SKILL_ID = /^[A-Z0-9_]{2,60}$/;
const REF = /^[A-Z2-9]{8}$/;
const PRACTICE_REF = /^[a-f0-9-]{36}$/;

/**
 * An `assign` request, checked and cleaned: what may be stored. Unknown or
 * malformed ids are dropped, never passed on. Returns { ok, row } or { ok: false, error }.
 */
export const cleanAssign = (p) => {
  if (!p || typeof p !== 'object') return { ok: false, error: 'No practice given' };
  if (!PRACTICE_REF.test(String(p.practice_ref || ''))) return { ok: false, error: 'practice_ref must be a uuid' };
  const title = String(p.title || '').trim().slice(0, 120);
  if (!title) return { ok: false, error: 'A title is needed' };
  const skills = [...new Set((Array.isArray(p.skill_ids) ? p.skill_ids : []).map(String).filter(s => SKILL_ID.test(s)))].slice(0, 20);
  if (!skills.length) return { ok: false, error: 'No HOREB skills given' };
  const refs = [...new Set((Array.isArray(p.learner_refs) ? p.learner_refs : []).map(String).filter(r => REF.test(r)))].slice(0, 300);
  if (!refs.length) return { ok: false, error: 'No learners given' };
  const due = /^\d{4}-\d{2}-\d{2}$/.test(String(p.due_on || '')) ? p.due_on : null;
  return { ok: true, row: { practice_ref: p.practice_ref, title, skill_ids: skills, learner_refs: refs, due_on: due } };
};

/** The profile key HOREB keeps a child's maths progress under. */
export const childProfileKey = (parentId, childId) => `${parentId}_c${childId}`;

/**
 * What Tuta is told about its practice.
 *   practices  rows of school_practice
 *   links      rows of school_learner_links for this door
 *   progress   { [profile_key]: progress JSON } for the linked children
 * Returns { [practice_ref]: { [learner_ref]: { linked, mastered: [ids], mastered_at: {id: iso}, practised: [ids] } } }
 */
export const practiceStatus = (practices, links, progress) => {
  const byRef = Object.fromEntries((links || []).map(l => [l.learner_ref, l]));
  const out = {};
  for (const p of practices || []) {
    const rows = {};
    for (const ref of p.learner_refs || []) {
      const link = byRef[ref];
      if (!link) { rows[ref] = { linked: false, mastered: [], mastered_at: {}, practised: [] }; continue; }
      const skills = progress?.[childProfileKey(link.parent_id, link.child_id)]?.skills || {};
      const mastered = (p.skill_ids || []).filter(id => skills[id]?.mastered);
      const at = {};
      for (const id of mastered) if (skills[id]?.masteredAt) at[id] = new Date(skills[id].masteredAt).toISOString();
      rows[ref] = { linked: true, mastered, mastered_at: at, practised: (p.skill_ids || []).filter(id => (skills[id]?.attempts || 0) > 0) };
    }
    out[p.practice_ref] = rows;
  }
  return out;
};
