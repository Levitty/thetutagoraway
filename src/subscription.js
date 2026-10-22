// ============================================================================
// PAID PRACTICE
//
// The free check is always free. After it, each family account gets one free
// week of practice, then practice needs a pass: KES 100 for a week or
// KES 350 for a month. All children on the account share the pass.
//
// Nothing is charged until PAYWALL_ENABLED is true AND the launch date has
// come. Before launch, open the site with ?paywalltest=1 on your own phone to
// try the whole paid flow (real payment); ?paywalltest=0 turns that off.
// ============================================================================

// ---- master switches -------------------------------------------------------
export const PAYWALL_ENABLED = true;           // paid practice is on
export const PAYWALL_START_ISO = '2026-09-29'; // paid practice starts on this date

// ---- plans -----------------------------------------------------------------
export const FREE_DAYS = 7;
export const PLANS = {
  week: { id: 'week', kes: 100, days: 7, label: '1 week' },
  month: { id: 'month', kes: 350, days: 30, label: '1 month', note: 'About KSh 82 a week' },
};

/**
 * TEMPORARY. The deployed verify-subscription predates these two plans: it
 * demands at least KES 200 and grants a flat 30 days, so a KES 100 week pass
 * is charged by Paystack and then REFUSED by the thing that grants the pass
 * ("amount too low"). A family pays and is still shown the paywall.
 *
 * supabase/functions/verify-subscription/index.ts is fixed and committed. It
 * cannot be deployed from here — deploying an edge function needs
 * SUPABASE_ACCESS_TOKEN set as a repository secret, which only the owner can
 * do. Until that deploy happens, the only honest thing is not to sell the week
 * pass: taking KES 100 for something that cannot be granted is worse than
 * offering one plan.
 *
 * FLIP THIS TO true the moment `supabase functions deploy verify-subscription`
 * has run. Nothing else needs changing.
 */
export const WEEK_PASS_ENABLED = false;

/** The plans a family can actually be sold right now. */
export const availablePlans = () =>
  Object.values(PLANS).filter(p => p.id !== 'week' || WEEK_PASS_ENABLED);
// Kept for older screens that show a single price.
export const PRICE_KES = PLANS.week.kes;
export const PASS_DAYS = PLANS.week.days;

// ---- test switch (this browser only) ----------------------------------------
const TEST_KEY = 'tg_paywall_test';
try {
  const q = new URLSearchParams(window.location.search).get('paywalltest');
  if (q === '1') localStorage.setItem(TEST_KEY, '1');
  if (q === '0') localStorage.removeItem(TEST_KEY);
} catch { /* no storage */ }
export const paywallTesting = () => { try { return localStorage.getItem(TEST_KEY) === '1'; } catch { return false; } };

// ---- helpers ---------------------------------------------------------------
/** Is paid practice live for this person right now? */
export const paywallActive = (now = Date.now()) =>
  paywallTesting() || (PAYWALL_ENABLED && now >= Date.parse(PAYWALL_START_ISO));

/** Does this subscription row allow practice now (free week or paid pass)? */
export const isPro = (sub, now = Date.now()) =>
  !!(sub && sub.pro_until && Date.parse(sub.pro_until) > now);

export const isFreeWeek = (sub) => sub?.plan === 'trial';

/** Days left on the free week or pass (0 if none or ended). */
export const passDaysLeft = (sub, now = Date.now()) => {
  if (!isPro(sub, now)) return 0;
  return Math.ceil((Date.parse(sub.pro_until) - now) / 86400000);
};

/**
 * May this learner practise right now? The check is never gated. Before
 * launch everyone can; after it, only during the free week or a pass.
 */
export const canPractice = (sub, _progress, now = Date.now()) => {
  if (!paywallActive(now)) return true;
  return isPro(sub, now);
};

/**
 * Did a Supabase call fail because there was no network, as opposed to the
 * server answering "no"? Offline, the pass must be judged on the last row
 * this device saw — never granted (the setup_pending fallback) and never
 * revoked (a null that locks a paid family out).
 */
export const NETWORK_ERROR = /failed to fetch|fetch failed|networkerror|load failed|network request failed|err_internet_disconnected/i;
export const isNetworkError = (e, online = (typeof navigator === 'undefined' ? true : navigator.onLine !== false)) =>
  !online || NETWORK_ERROR.test(String(e?.message || e || ''));

export default { PAYWALL_ENABLED, PAYWALL_START_ISO, FREE_DAYS, PLANS, PRICE_KES, PASS_DAYS, paywallActive, paywallTesting, isPro, isFreeWeek, passDaysLeft, canPractice, isNetworkError };
