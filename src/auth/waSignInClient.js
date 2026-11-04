// The browser half of signing in from WhatsApp. tutagora.com/dashboard#wa=<token>:
// the token is taken off the address bar at once, swapped at the wa-sign-in
// function for a one-time Supabase sign-in code, and that code becomes a
// normal session. Returns { ok: true } or { ok: false, message }.
import { tokenFromHash } from './waSignIn.js';

export const WA_LINK_FAILED = 'This sign-in link has expired or was already used. Ask the WhatsApp line for a new one, or sign in with your password.';

export async function redeemWhatsAppLink(client, loc, hist) {
  const token = tokenFromHash(loc?.hash);
  if (!token) return null;
  try { hist?.replaceState(null, '', loc.pathname); } catch { /* old browser */ }
  try {
    await client.auth.signOut({ scope: 'local' });
    const { data, error } = await client.functions.invoke('wa-sign-in', { body: { action: 'redeem', token } });
    if (error || !data?.token_hash) return { ok: false, message: WA_LINK_FAILED };
    const { data: v, error: e2 } = await client.auth.verifyOtp({ token_hash: data.token_hash, type: 'magiclink' });
    if (e2 || !v?.session) return { ok: false, message: 'We could not sign you in with that link. Please sign in with your password.' };
    return { ok: true };
  } catch {
    return { ok: false, message: 'We could not sign you in with that link. Please sign in with your password.' };
  }
}
