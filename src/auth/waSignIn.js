// ============================================================================
// SIGN IN TO HOREB FROM WHATSAPP: the decisions.
//
// A parent (or a tutor) messages the Tutagora WhatsApp line "HOREB login". The
// line's server asks the wa-sign-in edge function, signed with a shared secret,
// for a link for the account whose phone is the sender's number. This file is
// what decides, with no database and no network; the build inlines it into
// supabase/functions/wa-sign-in/index.ts and tests/wa-sign-in.test.mjs runs it.
//
// Who gets a link: exactly one account with that phone, which is a parent (the
// account that pays and adds children) or a tutor, and is not an admin.
// A child never has a sign-in of its own (a child's tablet has no profile), and
// an account that signed up as a learner gets no link either.
// ============================================================================

export const LINK_MINUTES = 10;
export const PER_PHONE_PER_HOUR = 3;
export const DEFAULT_DAILY_CAP = 300;
export const DOOR_WINDOW_SECONDS = 300;

// Mirrors public.is_admin() (20260625_admin_read_policies.sql): admin by signed-in email.
export const ADMIN_EMAILS = ['mutualevy@gmail.com'];

/** Kenyan mobile to its last nine digits (7XXXXXXXX / 1XXXXXXXX), else ''. Same rule as HR and Tutagora. */
export function nine(raw) {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (d.startsWith('254')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d.length === 9 && /^[17]/.test(d) ? d : '';
}

const enc = new TextEncoder();
const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');

export async function sha256Hex(s) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

export async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}

export function sameText(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** x-door-sign = HMAC-SHA256(secret, "<unix seconds>.<body>"), accepted for five minutes. */
export async function doorSignatureOk(secret, time, body, sign, nowSeconds) {
  if (!secret || secret.length < 32 || !/^\d{9,11}$/.test(String(time))) return false;
  if (Math.abs(nowSeconds - Number(time)) > DOOR_WINDOW_SECONDS) return false;
  return sameText(await hmacHex(secret, `${time}.${body}`), String(sign || '').toLowerCase());
}

/** 32 random bytes as URL-safe text; only its hash is stored. */
export function newToken() {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const tokenLooksRight = (t) => typeof t === 'string' && /^[A-Za-z0-9_-]{43}$/.test(t);

/**
 * What kind of account this is, for a link.
 * acc: { role, is_admin, email, account_type, children }  (children = how many it has added)
 * Returns 'parent' | 'tutor' | 'admin' | 'learner'.
 */
export function accountKind(acc) {
  const email = String(acc.email || '').toLowerCase();
  if (acc.is_admin === true || ADMIN_EMAILS.includes(email) || acc.role === 'admin') return 'admin';
  if (acc.role === 'tutor' || acc.role === 'teacher') return 'tutor';
  // A parent keeps the 'student' role in the database; account_type says parent, or they have children.
  if (acc.role === 'student' && (acc.account_type === 'parent' || (acc.children || 0) > 0)) return 'parent';
  return 'learner';
}

/**
 * Who gets a link. 'none' covers everything a stranger must not learn: no account,
 * two accounts on one number, a learner's account, no email to sign in with.
 */
export function decideIssue({ phone9, enabled, matches, phoneLinksLastHour, linksToday, dailyCap }) {
  if (!enabled) return { result: 'off' };
  if (!phone9) return { result: 'none', why: 'bad_phone' };
  if (!matches.length) return { result: 'none', why: 'no_account' };
  if (matches.length > 1) return { result: 'none', why: 'shared_number' };
  const acc = matches[0];
  const kind = accountKind(acc);
  if (kind === 'admin') return { result: 'password', why: 'admin' };
  if (kind === 'learner') return { result: 'none', why: 'learner_account' };
  if (!acc.email) return { result: 'none', why: 'no_email' };
  if (phoneLinksLastHour >= PER_PHONE_PER_HOUR) return { result: 'limited', why: 'phone_hour' };
  if (linksToday >= dailyCap) return { result: 'limited', why: 'daily_cap' };
  return { result: 'link', profile_id: acc.id, kind };
}

/** May this stored link still be used? */
export function redeemable(row, nowMs) {
  if (!row) return 'unknown';
  if (row.used_at) return 'used';
  if (new Date(row.expires_at).getTime() <= nowMs) return 'expired';
  return 'ok';
}

export const expiresAt = (nowMs) => new Date(nowMs + LINK_MINUTES * 60000).toISOString();

/** The link: the parent home, with the token after # so it never reaches a server log. */
export const linkUrl = (site, token) => `${String(site).replace(/\/+$/, '')}/dashboard#wa=${token}`;

/** Read a sign-in token from the address (#wa=...), or ''. */
export function tokenFromHash(hash) {
  const t = new URLSearchParams(String(hash || '').replace(/^#/, '')).get('wa') || '';
  return tokenLooksRight(t) ? t : '';
}
