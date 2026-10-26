// ============================================================================
// A PAYMENT THAT WAS TAKEN BUT NOT YET CONFIRMED
//
// M-Pesa is completed on the phone, which means the browser that has to turn
// the payment into a pass is the one most likely to be closed, backgrounded or
// off network at exactly that moment. So the reference is written down before
// Paystack opens and confirmed with verify-subscription until it lands.
// verify-subscription records each reference as a primary key, so asking again
// is safe: a reference that already bought a pass returns the pass it bought.
//
// WHAT WAS BROKEN (F20, 25 Oct 2026): a parent paid and new lessons stayed
// behind the paywall "until later". Two causes, both here:
//
//   1. After Paystack's success the app asked three times in about four
//      seconds. M-Pesa settles a few seconds after the PIN, so the asks often
//      all came back "not successful", the family was told to WhatsApp us, and
//      the pass only appeared on the next reload.
//
//   2. "Not successful" was treated as final the moment it was heard. Asked
//      while the parent was still typing the PIN (or while the STK prompt sat
//      on the phone), Paystack answers "not successful" too, so the reference
//      was thrown away and nothing ever confirmed that payment. Now a "not
//      successful" only ends the matter once the reference is old enough that
//      the M-Pesa prompt has long expired.
//
// Nothing here grants anything: only verify-subscription, which asks Paystack.
// ============================================================================

export const PENDING_PASS = (uid) => `tg_pending_pass_${uid}`;

/** How long an unconfirmed M-Pesa payment may still turn into a real one. */
export const STILL_SETTLING_MS = 30 * 60 * 1000;
/** After this, a reference that still will not verify never will. */
export const GIVE_UP_MS = 3 * 86400000;
/** When to ask again after Paystack says the payment went through, in ms. */
export const CONFIRM_SCHEDULE = [0, 1500, 3000, 5000, 8000, 12000, 20000, 30000, 45000, 60000];

const store = () => { try { return globalThis.localStorage || null; } catch { return null; } };

export const rememberPendingPass = (uid, reference, plan, now = Date.now(), s = store()) => {
  try { s?.setItem(PENDING_PASS(uid), JSON.stringify({ reference, plan, at: now })); } catch { /* no storage */ }
};
export const forgetPendingPass = (uid, s = store()) => { try { s?.removeItem(PENDING_PASS(uid)); } catch { /* no storage */ } };
export const readPendingPass = (uid, s = store()) => {
  try { return JSON.parse(s?.getItem(PENDING_PASS(uid)) || 'null'); } catch { return null; }
};

/**
 * What a reply from verify-subscription means for a remembered reference:
 *   'granted' — the pass is on;
 *   'final'   — this reference will never buy a pass, stop asking;
 *   'retry'   — not yet (still settling, offline, signed out, server hiccup).
 * `ageMs` is how long ago the reference was written down.
 */
export const classifyReply = ({ verified, said = '' }, ageMs) => {
  if (verified) return 'granted';
  if (/unknown plan|already used|missing reference/i.test(said)) return 'final';
  // Paystack answers "not successful" for a payment that is still pending,
  // so it is final only once the M-Pesa prompt has certainly expired.
  if (/not successful/i.test(said)) return ageMs > STILL_SETTLING_MS ? 'final' : 'retry';
  // "signed out" is not final either: the money was taken, and the pass is
  // granted to whoever signs back in on this device.
  return 'retry';
};

/** Ask verify-subscription once. `invoke` is supabase.functions.invoke. */
export const askOnce = async (invoke, reference, plan) => {
  try {
    const { data, error } = await invoke('verify-subscription', { body: { reference, plan } });
    if (data?.verified) return { verified: true, pro_until: data.pro_until };
    // A non-2xx reply arrives as `error`, with the body on error.context —
    // NOT as data.
    let said = String(data?.error || '');
    if (!said && error?.context?.json) { try { said = String((await error.context.json())?.error || ''); } catch { /* not json */ } }
    return { verified: false, said };
  } catch { return { verified: false, said: 'network' }; }
};

// Several callers (profile load, auth listener, the app coming back to the
// front, the paywall opening) can ask at once; one question is enough.
const inFlight = new Map();

/**
 * Try a remembered payment once. Resolves to the pro_until it granted, or
 * null. Forgets the reference when the answer is final or it is too old.
 */
export const recoverPendingPass = (uid, { invoke, now = () => Date.now(), s = store() }) => {
  if (inFlight.has(uid)) return inFlight.get(uid);
  const run = (async () => {
    const p = readPendingPass(uid, s);
    if (!p?.reference) return null;
    const age = now() - (p.at || 0);
    if (age > GIVE_UP_MS) { forgetPendingPass(uid, s); return null; }
    const reply = await askOnce(invoke, p.reference, p.plan);
    const verdict = classifyReply(reply, age);
    if (verdict === 'granted') { forgetPendingPass(uid, s); return reply.pro_until || 'granted'; }
    if (verdict === 'final') forgetPendingPass(uid, s);
    return null;
  })().finally(() => inFlight.delete(uid));
  inFlight.set(uid, run);
  return run;
};

/**
 * Keep asking on CONFIRM_SCHEDULE until the pass is granted, the reference is
 * forgotten, or `cancelled()` says the screen has gone. Resolves to pro_until
 * or null. Used straight after Paystack's success and after its window closes.
 */
export const confirmPendingPass = async (uid, { invoke, now, s, sleep = (ms) => new Promise(r => setTimeout(r, ms)), cancelled = () => false, schedule = CONFIRM_SCHEDULE }) => {
  let waited = 0;
  for (const at of schedule) {
    if (at > waited) { await sleep(at - waited); waited = at; }
    if (cancelled()) return null;
    const got = await recoverPendingPass(uid, { invoke, now, s });
    if (got) return got;
    if (!readPendingPass(uid, s)) return null;
  }
  return null;
};
