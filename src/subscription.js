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
export const PAYWALL_ENABLED = false;          // turn on for launch
export const PAYWALL_START_ISO = '2026-12-31'; // paid practice starts on this date

// ---- plans -----------------------------------------------------------------
export const FREE_DAYS = 7;
export const PLANS = {
  week: { id: 'week', kes: 100, days: 7, label: '1 week' },
  month: { id: 'month', kes: 350, days: 30, label: '1 month', note: 'About KES 82 a week' },
};
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

export default { PAYWALL_ENABLED, PAYWALL_START_ISO, FREE_DAYS, PLANS, PRICE_KES, PASS_DAYS, paywallActive, paywallTesting, isPro, isFreeWeek, passDaysLeft, canPractice };
