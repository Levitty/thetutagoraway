// ============================================================================
// A PAYMENT THAT WAS TAKEN BUT NOT YET CONFIRMED
//
// Lifted, deliberately, from the fix that cost a real family a real payment on
// the tutoring product (F20, 25 Oct 2026). The bug is worth restating because
// a water app meets it harder: the tenant is on a cheap phone, in a corridor,
// on a network that drops.
//
//   M-Pesa is completed ON THE PHONE. The browser that has to turn the payment
//   into a receipt is therefore the one most likely to be closed, backgrounded
//   or off-network at exactly that moment.
//
//   And Paystack answers "not successful" for a payment that is still waiting
//   for the PIN. Treat that as final — as the first version of the tutoring
//   code did — and you throw away the reference for a payment that is about to
//   succeed. The money leaves the tenant's phone and your system never hears
//   about it.
//
// So: the reference is written down BEFORE Paystack opens, confirmed on a
// schedule for about a minute, re-confirmed whenever the tab comes back, and
// only given up on once the M-Pesa prompt could not possibly still be alive.
//
// Nothing here marks anything paid. Only the edge function does that, and only
// after asking Paystack directly.
// ============================================================================

export const PENDING_KEY = 'water_pending_payment';

/** How long an unconfirmed M-Pesa payment may still turn into a real one. */
export const STILL_SETTLING_MS = 30 * 60 * 1000;
/** After this, a reference that still will not verify never will. */
export const GIVE_UP_MS = 3 * 86400000;
/** When to ask again after the popup reports success, in ms from the first ask. */
export const CONFIRM_SCHEDULE = [0, 1500, 3000, 5000, 8000, 12000, 20000, 30000, 45000, 60000];

const store = () => { try { return globalThis.localStorage || null; } catch { return null; } };

/** Write the reference down before Paystack opens, never after. */
export const rememberPending = (p) => {
  const s = store(); if (!s) return;
  try {
    s.setItem(PENDING_KEY, JSON.stringify({ ...p, at: p.at ?? Date.now() }));
  } catch { /* private window: the confirm loop still runs this session */ }
};

export const readPending = () => {
  const s = store(); if (!s) return null;
  try {
    const raw = s.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && p.reference ? p : null;
  } catch { return null; }
};

export const forgetPending = () => {
  const s = store(); if (!s) return;
  try { s.removeItem(PENDING_KEY); } catch { /* ignore */ }
};

/**
 * Should this reference be thrown away, given what the server just said?
 *
 * The whole point: "not successful" is NOT a verdict while the STK prompt
 * could still be sitting on the tenant's phone. It only becomes one once the
 * prompt has long expired.
 */
export const shouldForget = (pending, answer, now = Date.now()) => {
  if (!pending?.reference) return true;
  const age = now - (pending.at || 0);
  if (age > GIVE_UP_MS) return true;              // days old: it never will
  if (!answer) return false;                       // no answer is not an answer
  if (answer.paid) return true;                    // done, and recorded server-side
  // A server that cannot see who we are, or cannot reach Paystack, has told us
  // nothing about the payment. Dropping the reference here is how the first
  // version lost one.
  if (answer.error && /network|unreachable|timeout|server/i.test(String(answer.error))) return false;
  if (answer.final === true) return true;          // Paystack says failed/abandoned, for good
  return age > STILL_SETTLING_MS;                  // "not successful" + prompt long dead
};

/** Has this pending payment aged out of being worth asking about at all? */
export const isStale = (pending, now = Date.now()) =>
  !pending?.reference || (now - (pending.at || 0)) > GIVE_UP_MS;

/**
 * One in-flight confirmation at a time. Three callers (the schedule, the tab
 * regaining focus, the popup's own callback) routinely fire within the same
 * second; without this they become three identical requests, which is how the
 * tutoring version burned its retries in four seconds while M-Pesa was still
 * settling.
 */
export const makeConfirmer = (confirmOnce) => {
  let inFlight = null;
  return (reference) => {
    if (inFlight) return inFlight;
    inFlight = Promise.resolve(confirmOnce(reference)).finally(() => { inFlight = null; });
    return inFlight;
  };
};

/**
 * The amount check, server-side in spirit even though it is shared with the
 * client so both agree on the rule.
 *
 * Paystack reports the minor unit (cents), the bill is in whole shillings.
 * Underpayment is rejected: a tenant who pays KES 100 against a KES 740 bill
 * has not paid the bill, and silently marking it paid is how a landlord's
 * ledger stops matching their bank. Overpayment is accepted — people round up,
 * and refusing money that has already left the phone helps nobody; the excess
 * is recorded so it can be carried forward.
 */
export const amountOk = (paidMinorUnits, expectedKes) => {
  const paid = Number(paidMinorUnits);
  const want = Number(expectedKes);
  if (!Number.isFinite(paid) || !Number.isFinite(want) || want <= 0) return false;
  return paid >= Math.round(want * 100);
};

/** Shillings paid over and above the bill, to carry forward. Never negative. */
export const overpaymentKes = (paidMinorUnits, expectedKes) => {
  if (!amountOk(paidMinorUnits, expectedKes)) return 0;
  return Math.round(Number(paidMinorUnits) / 100 - Number(expectedKes));
};
