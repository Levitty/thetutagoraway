// ============================================================================
// SEALED QUESTIONS: the answer to an `ask` never reaches the browser.
//
// Nothing is stored in milestone 1, so the server hands the browser the
// question's hidden half (answer, accepted forms, wrong answers and the
// misconception each one reveals) encrypted with AES-GCM under a key only the
// server has. The browser sends the seal back with the child's answer, and the
// server opens it and marks the answer itself. A seal is bound to its session
// and child, and expires.
// Web Crypto only (Deno and Node 20+ both have it).
// ============================================================================
const enc = new TextEncoder();
const dec = new TextDecoder();
const b64u = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

const keyOf = async (secret) => {
  if (!secret || String(secret).length < 16) throw new Error('seal: no server secret');
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(`voice-tutor-seal:${secret}`));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
};

export const SEAL_TTL_MS = 2 * 60 * 60 * 1000;

export async function seal(obj, secret, now = Date.now()) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const body = enc.encode(JSON.stringify({ ...obj, exp: now + SEAL_TTL_MS }));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await keyOf(secret), body));
  return `${b64u(iv)}.${b64u(ct)}`;
}

/** The sealed object, or null if it was tampered with, is for another session or child, or expired. */
export async function unseal(token, secret, { session, child, now = Date.now() } = {}) {
  try {
    const [iv, ct] = String(token || '').split('.');
    if (!iv || !ct || token.length > 6000) return null;
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64u(iv) }, await keyOf(secret), unb64u(ct));
    const obj = JSON.parse(dec.decode(pt));
    if (!obj || obj.exp < now) return null;
    if (session !== undefined && obj.session !== session) return null;
    if (child !== undefined && obj.child !== child) return null;
    return obj;
  } catch {
    return null;
  }
}

export default { seal, unseal, SEAL_TTL_MS };
