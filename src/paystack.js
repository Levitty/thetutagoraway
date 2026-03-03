// Paystack Integration for Tutagora
// Supports card payments (Visa, Mastercard, etc.)

const PAYSTACK_PUBLIC_KEY = 'pk_live_cc35ac8647264dd74bd63770c39cce9a18333b90';

// Load Paystack script dynamically
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.head.appendChild(script);
  });
};

// Initialize Paystack payment
export const initiatePaystackPayment = async ({
  email,
  amount, // in KES
  reference,
  metadata,
  onSuccess,
  onClose,
}) => {
  try {
    await loadPaystackScript();

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Paystack expects amount in cents/kobo
      currency: 'KES',
      ref: reference || `TUT-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Platform",
            variable_name: "platform",
            value: "Tutagora"
          },
          ...(metadata?.custom_fields || [])
        ],
        ...metadata,
      },
      callback: function(response) {
        // Payment successful
        console.log('Paystack success:', response);
        onSuccess && onSuccess({
          reference: response.reference,
          transaction: response.transaction,
          status: 'success',
        });
      },
      onClose: function() {
        // User closed the payment modal
        console.log('Paystack closed');
        onClose && onClose();
      },
    });

    handler.openIframe();
    return { success: true };
  } catch (error) {
    console.error('Paystack error:', error);
    return { success: false, error: error.message };
  }
};

// Verify payment (call this from your backend ideally)
export const verifyPaystackPayment = async (reference) => {
  // Note: For security, verification should be done server-side
  // This is a placeholder - implement via Supabase Edge Function
  console.log('Verify payment:', reference);
  return { verified: true, reference };
};

export default {
  initiatePaystackPayment,
  loadPaystackScript,
  verifyPaystackPayment,
  PAYSTACK_PUBLIC_KEY,
};
