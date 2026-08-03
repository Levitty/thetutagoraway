// ============================================================================
// SUBSCRIPTION / PAYWALL CONFIG  (freemium — built, but INACTIVE)
//
// Model (agreed): the diagnostic is always free; free learners get a daily
// TASTE of practice (up to the daily goal), then a paywall; a 30-day pass
// (KSh 200) unlocks unlimited practice.
//
// NOTHING gates until PAYWALL_ENABLED is flipped to true AND the date has
// reached PAYWALL_START. Until then every helper below reports "unlimited",
// so this file changes nothing for anyone. Turning it on is a one-line edit.
// ============================================================================

import { todaysXP } from './ai-tutor/gamification.js';

// ---- master switches -------------------------------------------------------
export const PAYWALL_ENABLED = false;        // ← the on/off switch. Keep false.
export const PAYWALL_START_ISO = '2026-08-17'; // gate can only bite on/after this

// ---- the free line + price -------------------------------------------------
export const FREE_DAILY_XP = 30;   // free practice allowance per day (= daily goal)
export const PRICE_KES = 200;      // 30-day pass price
export const PASS_DAYS = 30;       // days a pass grants

// ---- derived helpers -------------------------------------------------------
/** Is the paywall live right now? (switch on AND past the start date) */
export const paywallActive = (now = Date.now()) =>
  PAYWALL_ENABLED && now >= Date.parse(PAYWALL_START_ISO);

/** Does this subscription row grant an active pass? */
export const isPro = (sub, now = Date.now()) =>
  !!(sub && sub.pro_until && Date.parse(sub.pro_until) > now);

/** How many days of pass remain (0 if none / lapsed). */
export const passDaysLeft = (sub, now = Date.now()) => {
  if (!isPro(sub, now)) return 0;
  return Math.ceil((Date.parse(sub.pro_until) - now) / 86400000);
};

/**
 * May this learner do MORE practice right now? The diagnostic is never gated —
 * this only governs ongoing practice/lessons. Returns true when the paywall is
 * off, the learner is pro, or they're still within today's free allowance.
 */
export const canPractice = (sub, progress, now = Date.now()) => {
  if (!paywallActive(now)) return true;
  if (isPro(sub, now)) return true;
  return todaysXP(progress) < FREE_DAILY_XP;
};

export default { PAYWALL_ENABLED, PAYWALL_START_ISO, FREE_DAILY_XP, PRICE_KES, PASS_DAYS, paywallActive, isPro, passDaysLeft, canPractice };
