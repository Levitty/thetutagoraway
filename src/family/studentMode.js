// ============================================================================
// STUDENT MODE — one device, handed to one child.
//
// A parent signs in, picks a child and hands the device over. From then on the
// device shows only that child's space (practice, writing, their lessons) until
// someone enters the parent PIN. It survives restarts, so a child's own tablet
// can stay in student mode for good.
//
// The mode is stored on the DEVICE (localStorage): handing a tablet to one
// child must not change the parent's phone.
//
// The PIN is stored on the ACCOUNT (Supabase user metadata, hashed), so the
// same PIN works on every device the parent signs in on, and no table or
// migration is needed. It is a gate for children, not a security boundary: the
// device is still signed in as the parent. It keeps a child away from payments,
// tutor booking and messages; it does not protect against an adult with the
// device's developer tools.
// ============================================================================

import { supabase } from '../supabase';

const MODE_KEY = 'tg_student_mode';
const LOOK_KEY = (learnerId) => `tg_student_look_${learnerId}`;
const TRIES_KEY = 'tg_pin_tries';
const MAX_TRIES = 5;
const LOCKOUT_MS = 60 * 1000;

const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch { /* private mode */ } };

// { parentId, learnerId, name, grade } | null
export const getStudentMode = () => {
  try {
    const m = JSON.parse(lsGet(MODE_KEY) || 'null');
    return m && m.parentId && m.learnerId ? m : null;
  } catch { return null; }
};
export const startStudentMode = (parentId, learner) => {
  const m = { parentId, learnerId: learner.id, name: learner.name, grade: learner.grade || null, since: Date.now() };
  lsSet(MODE_KEY, JSON.stringify(m));
  return m;
};
export const endStudentMode = () => lsDel(MODE_KEY);

// "Grade 7" → 7, "Form 2" → 10 (Form 1 follows Grade 8), "7" → 7, "PP2" → 0.
export const gradeNumber = (g) => {
  if (g == null) return null;
  const s = String(g).trim().toLowerCase();
  const form = s.match(/form\s*(\d+)/);
  if (form) return 8 + Number(form[1]);
  if (/^pp/.test(s)) return 0;
  const n = s.match(/(\d+)/);
  return n ? Number(n[1]) : null;
};
// Grade 9 and up get the older-student treatment: no animals, direct language.
export const isOlderLearner = (grade) => (gradeNumber(grade) ?? 0) >= 9;

// How the child chose to appear: { kind: 'buddy', id } or { kind: 'color', color }.
export const getLook = (learnerId) => {
  try { return JSON.parse(lsGet(LOOK_KEY(learnerId)) || 'null'); } catch { return null; }
};
export const setLook = (learnerId, look) => lsSet(LOOK_KEY(learnerId), JSON.stringify(look));

// ---- Parent PIN ------------------------------------------------------------

const toHex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
const hashPin = async (userId, pin) => {
  const data = new TextEncoder().encode(`tutagora-parent-pin:${userId}:${pin}`);
  return toHex(await crypto.subtle.digest('SHA-256', data));
};

// Fresh from the server, so a PIN set on the parent's phone works on the tablet.
export const hasPin = async () => {
  const { data } = await supabase.auth.getUser();
  return !!data?.user?.user_metadata?.parent_pin_hash;
};

export const setPin = async (userId, pin) => {
  if (!/^\d{4}$/.test(pin)) throw new Error('The PIN must be 4 digits.');
  const parent_pin_hash = await hashPin(userId, pin);
  const { error } = await supabase.auth.updateUser({ data: { parent_pin_hash } });
  if (error) throw error;
};

// After 5 wrong PINs the pad locks for a minute, so a child can't try all 10,000.
export const pinLockedFor = () => {
  try {
    const t = JSON.parse(lsGet(TRIES_KEY) || '{}');
    return t.until && t.until > Date.now() ? t.until - Date.now() : 0;
  } catch { return 0; }
};

// Resolves true / false. Throws only if the account can't be reached.
export const checkPin = async (userId, pin) => {
  if (pinLockedFor() > 0) return false;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const stored = data?.user?.user_metadata?.parent_pin_hash;
  const ok = !!stored && stored === await hashPin(userId, pin);
  let t; try { t = JSON.parse(lsGet(TRIES_KEY) || '{}'); } catch { t = {}; }
  if (ok) { lsDel(TRIES_KEY); return true; }
  const n = (t.n || 0) + 1;
  lsSet(TRIES_KEY, JSON.stringify(n >= MAX_TRIES ? { n: 0, until: Date.now() + LOCKOUT_MS } : { n }));
  return false;
};

// ---- A child's own tablet ----------------------------------------------------
// The parent makes a one-time link; opening it on the tablet signs the tablet
// in anonymously and links it to that one child (see
// supabase/migrations/20261007_child_tablets.sql). The tablet stays in that
// child's space for good; it has no way into the parent's account.

export const createChildLink = async (childId) => {
  const { data, error } = await supabase.rpc('create_child_link', { p_child: childId });
  if (error) throw error;
  return `${window.location.origin}/t/${data}`;
};

export const listChildTablets = async (childId) => {
  const { data, error } = await supabase.from('child_devices').select('device_uid, created_at').eq('child_id', childId).order('created_at');
  if (error) throw error;
  return data || [];
};

export const switchOffTablet = async (deviceUid) => {
  const { error } = await supabase.from('child_devices').delete().eq('device_uid', deviceUid);
  if (error) throw error;
};

// On the tablet. Returns the student mode to start, or throws with .code set
// to link_used / link_expired / link_not_found / not_enabled.
export const openChildLink = async (token) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session && !session.user.is_anonymous) await supabase.auth.signOut();
  let uid = session?.user?.is_anonymous ? session.user.id : null;
  if (!uid) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw Object.assign(new Error(error.message), { code: /disabled|not enabled/i.test(error.message || '') ? 'not_enabled' : 'failed' });
    uid = data.user.id;
  }
  const { data, error } = await supabase.rpc('open_child_link', { p_token: token });
  if (error) {
    const code = ['link_used', 'link_expired', 'link_not_found'].find(c => (error.message || '').includes(c)) || 'failed';
    throw Object.assign(new Error(error.message), { code });
  }
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw Object.assign(new Error('No child on this link'), { code: 'link_not_found' });
  const m = { parentId: row.parent_id, learnerId: row.child_id, name: row.name, grade: row.grade || null, deviceUid: uid, tablet: true, since: Date.now() };
  lsSet(MODE_KEY, JSON.stringify(m));
  return m;
};

// ---- A family tablet ---------------------------------------------------------
// A device the parent has signed in on and set aside for the children. It
// opens on "Who's practising?"; the parent side is behind the parent PIN.
const FAMILY_KEY = 'tg_family_device';
export const getFamilyDevice = () => { try { return JSON.parse(lsGet(FAMILY_KEY) || 'null'); } catch { return null; } };
export const setFamilyDevice = (parentId) => lsSet(FAMILY_KEY, JSON.stringify({ parentId, since: Date.now() }));
export const clearFamilyDevice = () => lsDel(FAMILY_KEY);
