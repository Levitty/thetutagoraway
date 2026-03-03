import React, { useState, useEffect } from 'react';
import { initiateSTKPush, querySTKPushStatus } from './mpesa';
import { initiatePaystackPayment } from './paystack';
import { supabase } from './supabase';

// Lottie Animation Component
const Lottie = ({ src, width = 100, height = 100, loop = true }) => {
  useEffect(() => {
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <lottie-player
      src={src}
      background="transparent"
      speed="1"
      style={{ width, height }}
      loop={loop}
      autoplay
    />
  );
};

// Payment Status Component
const PaymentStatus = ({ status, message }) => {
  const statusConfig = {
    pending: { 
      animation: 'https://assets8.lottiefiles.com/packages/lf20_4XmSkB.json',
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    processing: { 
      animation: 'https://assets8.lottiefiles.com/packages/lf20_4XmSkB.json',
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    success: { 
      animation: 'https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json',
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      loop: false
    },
    failed: { 
      animation: null,
      icon: <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <div className={`p-6 rounded-xl ${config.bg} text-center`}>
      <div className="flex justify-center mb-2">
        {config.animation ? (
          <Lottie src={config.animation} width={80} height={80} loop={config.loop !== false} />
        ) : config.icon}
      </div>
      <div className={`font-medium ${config.color}`}>{message}</div>
    </div>
  );
};

// Main Payment Modal
export const PaymentModal = ({ booking, tutor, user, onClose, onSuccess }) => {
  const [step, setStep] = useState('method'); // method, mpesa-phone, processing, status
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

  const amount = tutor.hourly_rate || 1000;
  const currency = tutor.currency || 'KSh';
  const userEmail = user?.email || booking?.profiles?.email || '';

  // Poll for M-Pesa payment status
  useEffect(() => {
    let interval;
    if (checkoutRequestId && step === 'processing' && paymentMethod === 'mpesa') {
      interval = setInterval(async () => {
        const result = await querySTKPushStatus(checkoutRequestId);
        if (result.status === 'completed') {
          setPaymentStatus({ status: 'success', message: 'Payment successful!' });
          setStep('status');
          clearInterval(interval);
          await updatePaymentStatus('completed', 'mpesa', checkoutRequestId);
          setTimeout(() => onSuccess && onSuccess(), 2000);
        } else if (result.status === 'cancelled' || result.status === 'timeout') {
          setPaymentStatus({ status: 'failed', message: result.message });
          setStep('status');
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checkoutRequestId, step, paymentMethod]);

  // Update payment status in Supabase
  const updatePaymentStatus = async (status, method, reference) => {
    try {
      await supabase.from('payments').insert({
        booking_id: booking.id,
        student_id: booking.student_id,
        tutor_id: booking.tutor_id,
        amount: amount,
        currency: currency,
        method: method,
        status: status,
        mpesa_reference: reference,
      });

      if (status === 'completed') {
        await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking.id);
      }
    } catch (err) {
      console.error('Error updating payment:', err);
    }
  };

  // Handle M-Pesa payment
  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    setStep('processing');

    const result = await initiateSTKPush({
      phoneNumber,
      amount,
      accountReference: `TUT-${booking.id?.slice(0, 8) || 'BOOK'}`,
      transactionDesc: `${tutor.subject || 'Tutor'} lesson payment`,
    });

    if (result.success) {
      setCheckoutRequestId(result.checkoutRequestId);
      setPaymentStatus({ status: 'pending', message: 'Check your phone and enter M-Pesa PIN' });
    } else {
      setError(result.error);
      setStep('mpesa-phone');
    }
    
    setLoading(false);
  };

  // Handle Paystack (Card) payment
  const handlePaystackPayment = async () => {
    setLoading(true);
    setError('');

    const reference = `TUT-${booking.id?.slice(0, 8) || Date.now()}`;

    const result = await initiatePaystackPayment({
      email: userEmail,
      amount: amount,
      reference: reference,
      metadata: {
        booking_id: booking.id,
        tutor_id: tutor.id,
        subject: tutor.subject,
      },
      onSuccess: async (response) => {
        setPaymentStatus({ status: 'success', message: 'Payment successful!' });
        setStep('status');
        await updatePaymentStatus('completed', 'card', response.reference);
        setTimeout(() => onSuccess && onSuccess(), 2000);
      },
      onClose: () => {
        setLoading(false);
        setError('Payment was cancelled');
      },
    });

    if (!result.success) {
      setError(result.error || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  // Select payment method
  const selectMethod = (method) => {
    setPaymentMethod(method);
    setError('');
    if (method === 'mpesa') {
      setStep('mpesa-phone');
    } else if (method === 'card') {
      handlePaystackPayment();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Complete Payment</h2>
              <p className="text-emerald-100 text-sm mt-1">{tutor.subject || 'Tutoring'} Lesson</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{currency} {amount.toLocaleString()}</span>
            <span className="text-emerald-100">/hour</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step: Select Payment Method */}
          {step === 'method' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Select payment method</h3>
              
              {/* M-Pesa Option */}
              <button
                onClick={() => selectMethod('mpesa')}
                className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 flex items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">M-Pesa</div>
                  <div className="text-sm text-slate-500">Pay with your phone</div>
                </div>
                <span className="text-slate-400">→</span>
              </button>

              {/* Card Option (Paystack) */}
              <button
                onClick={() => selectMethod('card')}
                disabled={loading}
                className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 flex items-center gap-4 transition-all disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">Credit/Debit Card</div>
                  <div className="text-sm text-slate-500">Visa, Mastercard, Verve</div>
                </div>
                <span className="text-slate-400">{loading ? '...' : '→'}</span>
              </button>

              {/* Paystack Badge */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs text-slate-400">Secured by</span>
                <span className="text-xs font-semibold text-blue-600">Paystack</span>
                <span className="text-xs text-slate-400">&</span>
                <span className="text-xs font-semibold text-green-600">M-Pesa</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
              )}
            </div>
          )}

          {/* Step: Enter M-Pesa Phone Number */}
          {step === 'mpesa-phone' && (
            <div className="space-y-4">
              <button onClick={() => setStep('method')} className="text-slate-500 text-sm flex items-center gap-1">
                ← Back
              </button>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <div>
                  <div className="font-medium text-slate-900">M-Pesa Payment</div>
                  <div className="text-sm text-slate-500">Enter your phone number</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">M-Pesa Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500">
                    +254
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="712 345 678"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    maxLength={9}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">You'll receive an STK push to enter your M-Pesa PIN</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
              )}

              <button
                onClick={handleMpesaPayment}
                disabled={loading || phoneNumber.length < 9}
                className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
              >
                {loading ? 'Sending...' : `Pay ${currency} ${amount.toLocaleString()}`}
              </button>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Waiting for payment</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {paymentMethod === 'mpesa' 
                    ? 'Check your phone and enter your M-Pesa PIN' 
                    : 'Processing your card payment...'}
                </p>
              </div>
              {paymentMethod === 'mpesa' && <div className="text-4xl animate-bounce">📱</div>}
              <p className="text-xs text-slate-400">Do not close this window</p>
            </div>
          )}

          {/* Step: Status */}
          {step === 'status' && paymentStatus && (
            <div className="py-6 space-y-4">
              <PaymentStatus status={paymentStatus.status} message={paymentStatus.message} />
              
              {paymentStatus.status === 'failed' && (
                <button
                  onClick={() => { setStep('method'); setError(''); setPaymentMethod(null); }}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200"
                >
                  Try Again
                </button>
              )}
              
              {paymentStatus.status === 'success' && (
                <div className="text-center text-sm text-slate-500">
                  Redirecting to your dashboard...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Lesson with {tutor.profiles?.full_name || 'Tutor'}</span>
            <span className="text-slate-900 font-medium">{booking.lesson_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
