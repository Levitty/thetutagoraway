// ============================================================================
// GROWTH — the Holiday Blitz referral + share machinery.
//
// Referral flow:
//   1. Any link can carry ?ref=CODE (or /r/CODE). We stash it on arrival.
//   2. Sign-up sends it as auth metadata (referred_by_code); a DB trigger
//      resolves it to a referrals row. Forgery-proof: clients cannot insert.
//   3. When the referred student COMPLETES THE DIAGNOSTIC we flip the row to
//      activated — a referral only counts once the friend is truly onboarded.
//
// Codes are deterministic (first 8 hex chars of the user id) and match the
// `referral_code` generated column in the profiles table.
// ============================================================================

import { supabase } from './supabase.js';

const REF_KEY = 'tutagora_ref';

export const referralCodeFor = (userId) =>
  userId ? String(userId).replace(/-/g, '').slice(0, 8) : null;

export const referralLink = (userId) =>
  `https://tutagora.com/?ref=${referralCodeFor(userId) || 'invite'}`;

// Call once at app start: remember the code that brought this visitor here.
export function captureReferralFromURL() {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('ref');
    const fromPath = url.pathname.match(/^\/r\/([a-zA-Z0-9]{6,12})/)?.[1];
    const code = (fromQuery || fromPath || '').trim().toLowerCase();
    if (code && /^[a-z0-9]{6,12}$/.test(code)) localStorage.setItem(REF_KEY, code);
  } catch { /* no-op */ }
}

export const getStoredReferralCode = () => {
  try { return localStorage.getItem(REF_KEY) || ''; } catch { return ''; }
};

export const clearStoredReferralCode = () => {
  try { localStorage.removeItem(REF_KEY); } catch { /* no-op */ }
};

// Fire-and-forget: the referred student finished the diagnostic — their
// referrer's count now includes them. RLS only lets a student activate the
// row where they are the referred party, so this cannot be abused.
export function activateReferral(userId) {
  if (!userId) return;
  supabase
    .from('referrals')
    .update({ activated: true, activated_at: new Date().toISOString() })
    .eq('referred_id', userId)
    .eq('activated', false)
    .then(() => {})
    .catch(() => { /* never block the lesson */ });
}

// How many activated friends has this user brought? (For "You've brought N".)
export async function myReferralStats(userId) {
  if (!userId) return { total: 0, activated: 0 };
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('activated')
      .eq('referrer_id', userId);
    if (error || !data) return { total: 0, activated: 0 };
    return { total: data.length, activated: data.filter(r => r.activated).length };
  } catch {
    return { total: 0, activated: 0 };
  }
}

// One-tap WhatsApp share (the Kenyan growth channel).
export function waShareURL(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function shareOnWhatsApp(text) {
  window.open(waShareURL(text), '_blank', 'noopener');
}

// Prefilled share messages for the proud moments.
export const shareMessages = {
  mastery: (skillName, userId) =>
    `I just mastered "${skillName}" on Tutagora! 🔥 The AI maths tutor is FREE the whole holiday — see your level here 👉 ${referralLink(userId)}`,
  diagnostic: (grade, userId) =>
    `Tutagora just checked my maths level — it teaches you with pictures, step by step. FREE all holiday, no paying 👉 ${referralLink(userId)}`,
  invite: (userId) =>
    `Get a personal AI maths teacher FREE for the whole August holiday — it finds exactly what you're missing and teaches it with pictures. Join me 👉 ${referralLink(userId)}`,
};
