// Paystack inline checkout. M-Pesa first, because that is how a tenant pays.
//
// Adapted from the tutoring project's copy, with two changes that matter:
//
//   1. The public key comes from the environment, not a string in the source.
//     The original had a live key pasted into the file, which means it is in
//     the repo, in every build and in anyone's browser cache. A Paystack
//     PUBLIC key is meant to be public, so this is not a breach — but a key
//     that cannot be rotated without a code change is still a key you cannot
//     rotate, and a test key cannot be swapped in for a staging build.
//
//   2. `verifyPaystackPayment` is gone. The original shipped a stub that
//     returned `{ verified: true }` without asking anybody anything, next to a
//     comment saying verification should really happen server-side. A function
//     named "verify" that always says yes is worse than no function at all:
//     it is the shape of a security check, so it stops anyone looking. Here,
//     only the edge function verifies.

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export const loadPaystackScript = () => new Promise((resolve, reject) => {
  if (window.PaystackPop) return resolve(window.PaystackPop);
  const script = document.createElement('script');
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  script.onload = () => resolve(window.PaystackPop);
  script.onerror = () => reject(new Error('Could not load the payment window. Check your connection.'));
  document.head.appendChild(script);
});

/**
 * Open the payment window.
 *
 * `reference` and `amount` are NOT optional and are NOT defaulted here: both
 * are decided by the server at `start` and written down before this runs. A
 * convenience default would be a client-chosen amount, which is the one thing
 * this design exists to prevent.
 */
export const initiatePaystackPayment = async ({
  email, amount, reference, metadata, onSuccess, onClose,
}) => {
  if (!PUBLIC_KEY) throw new Error('Payments are not configured');
  if (!reference) throw new Error('Missing payment reference');
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) throw new Error('Missing payment amount');

  await loadPaystackScript();

  const handler = window.PaystackPop.setup({
    key: PUBLIC_KEY,
    email,
    amount: Math.round(Number(amount) * 100), // Paystack takes the minor unit
    currency: 'KES',
    // Explicit, so the order does not depend on dashboard settings that can
    // change under you. M-Pesa first: it is what tenants have.
    channels: ['mobile_money', 'card', 'bank'],
    ref: reference,
    metadata: {
      // These show as their own rows on the Paystack dashboard and on the
      // emailed receipt, so a payment can be matched to a meter by a person
      // reading Paystack alone, without opening the database.
      custom_fields: [
        { display_name: 'Paid for', variable_name: 'paid_for', value: 'Water' },
        ...(metadata?.custom_fields || []),
      ],
      ...metadata,
    },
    // Paystack calling back "success" is the START of confirmation, not the
    // end of it: on M-Pesa this fires while the charge is still settling.
    callback: (response) => { onSuccess?.({ reference: response?.reference || reference }); },
    // Closing the window is not a failure. The STK prompt may still be on the
    // phone, so the caller keeps asking.
    onClose: () => { onClose?.(); },
  });

  handler.openIframe();
};

export default { initiatePaystackPayment, loadPaystackScript };
