// M-Pesa Daraja API Integration (Sandbox Mode)
// For production, replace with your live credentials

const MPESA_CONFIG = {
  // Sandbox credentials (for testing)
  consumerKey: 'GvzjNnYgNJtwgwfLBkZh65VPwfuKvs0V',
  consumerSecret: 'oOpJICRVlyrWTTVb',
  shortcode: '174379', // Sandbox shortcode
  passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  callbackUrl: 'https://dlqbiayaqjucxsvbesms.supabase.co/functions/v1/mpesa-callback',
  environment: 'sandbox', // Change to 'production' for live
};

// Base URLs
const SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_URL = 'https://api.safaricom.co.ke';
const BASE_URL = MPESA_CONFIG.environment === 'sandbox' ? SANDBOX_URL : PRODUCTION_URL;

// Get OAuth token
export const getMpesaToken = async () => {
  const auth = btoa(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`);
  
  const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });
  
  const data = await response.json();
  return data.access_token;
};

// Generate password for STK Push
const generatePassword = () => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = btoa(`${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`);
  return { password, timestamp };
};

// Format phone number to 254 format
const formatPhoneNumber = (phone) => {
  // Remove any spaces or special characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.slice(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

// Initiate STK Push (Lipa Na M-Pesa Online)
export const initiateSTKPush = async ({ phoneNumber, amount, accountReference, transactionDesc }) => {
  try {
    const token = await getMpesaToken();
    const { password, timestamp } = generatePassword();
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const payload = {
      BusinessShortCode: MPESA_CONFIG.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: accountReference || 'Tutagora',
      TransactionDesc: transactionDesc || 'Lesson Payment',
    };

    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        message: 'STK push sent. Check your phone.',
      };
    } else {
      return {
        success: false,
        error: data.errorMessage || data.ResponseDescription || 'Failed to initiate payment',
      };
    }
  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return {
      success: false,
      error: error.message || 'Network error. Please try again.',
    };
  }
};

// Query STK Push status
export const querySTKPushStatus = async (checkoutRequestId) => {
  try {
    const token = await getMpesaToken();
    const { password, timestamp } = generatePassword();

    const response = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_CONFIG.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const data = await response.json();
    
    if (data.ResultCode === '0') {
      return { success: true, status: 'completed', message: 'Payment successful' };
    } else if (data.ResultCode === '1032') {
      return { success: false, status: 'cancelled', message: 'Payment cancelled by user' };
    } else if (data.ResultCode === '1037') {
      return { success: false, status: 'timeout', message: 'Payment timeout' };
    } else {
      return { success: false, status: 'pending', message: data.ResultDesc || 'Payment pending' };
    }
  } catch (error) {
    return { success: false, status: 'error', message: error.message };
  }
};

export default {
  initiateSTKPush,
  querySTKPushStatus,
  getMpesaToken,
};
