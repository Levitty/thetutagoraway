import React, { useState, useEffect } from 'react';
import { initiatePaystackPayment } from './paystack';
import { supabase } from './supabase';
import { sendEmail } from './email.js';

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

// Main Payment Modal — Paystack Only
export const PaymentModal = ({ booking, tutor, user, onClose, onSuccess }) => {
  const [step, setStep] = useState('confirm'); // confirm, processing, status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);

  const amount = tutor.hourly_rate || 1000;
  const currency = tutor.currency || 'KSh';
  const userEmail = user?.email || booking?.profiles?.email || '';

  // Update payment status in Supabase
  const updatePaymentStatus = async (status, reference) => {
    try {
      await supabase.from('payments').insert({
        booking_id: booking.id,
        student_id: booking.student_id,
        tutor_id: booking.tutor_id,
        amount: amount,
        currency: currency,
        method: 'card',
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

  // Handle Paystack payment
  const handlePaystackPayment = async () => {
    setLoading(true);
    setError('');
    setStep('processing');

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
        await updatePaymentStatus('completed', response.reference);

        // Send booking confirmation emails to both student and tutor
        const lessonDateFormatted = new Date(booking.lesson_date).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const studentName = user?.user_metadata?.full_name || 'Student';
        const tutorName = tutor.profiles?.full_name || 'Tutor';
        const tutorSubject = (tutor.subjects || [tutor.subject]).join(', ') || 'Lesson';
        try {
          // Email to student
          if (userEmail) {
            await sendEmail('booking-confirmation', userEmail, {
              studentName: studentName,
              tutorName: tutorName,
              subject: tutorSubject,
              date: lessonDateFormatted,
              time: booking.lesson_time || booking.start_time || '',
              price: `KSh ${amount?.toLocaleString() || tutor.hourly_rate?.toLocaleString() || '1,000'}`
            });
          }
          // Email to tutor
          if (tutor.profiles?.email) {
            await sendEmail('booking-confirmation', tutor.profiles.email, {
              studentName: tutorName,
              tutorName: studentName,
              subject: tutorSubject,
              date: lessonDateFormatted,
              time: booking.lesson_time || booking.start_time || '',
              price: `KSh ${amount?.toLocaleString() || tutor.hourly_rate?.toLocaleString() || '1,000'}`
            });
          }
        } catch (emailErr) {
          console.error('Email notification failed (booking still confirmed):', emailErr);
        }

        setTimeout(() => onSuccess && onSuccess(), 2000);
      },
      onClose: () => {
        setLoading(false);
        setStep('confirm');
        setError('Payment was cancelled. You can try again.');
      },
    });

    if (!result.success) {
      setError(result.error || 'Failed to initialize payment');
      setLoading(false);
      setStep('confirm');
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
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl">&#10005;</button>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{currency} {amount.toLocaleString()}</span>
            <span className="text-emerald-100">/hour</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step: Confirm & Pay */}
          {step === 'confirm' && (
            <div className="space-y-4">
              {/* Lesson Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm">Lesson Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tutor</span>
                    <span className="text-slate-900 font-medium">{tutor.profiles?.full_name || 'Tutor'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject</span>
                    <span className="text-slate-900 font-medium">{tutor.subject || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-900 font-medium">{booking.lesson_date}</span>
                  </div>
                  {booking.lesson_time && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Time</span>
                      <span className="text-slate-900 font-medium">{booking.lesson_time}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span className="text-slate-700 font-semibold">Total</span>
                    <span className="text-emerald-600 font-bold">{currency} {amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment method info */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Pay with Card</div>
                  <div className="text-xs text-slate-500">Visa, Mastercard, Verve via Paystack</div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
              )}

              <button
                onClick={handlePaystackPayment}
                disabled={loading}
                className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
              >
                {loading ? 'Processing...' : `Pay ${currency} ${amount.toLocaleString()}`}
              </button>

              {/* Paystack Badge */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-slate-400">Secured by</span>
                <span className="text-xs font-semibold text-blue-600">Paystack</span>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Processing payment</h3>
                <p className="text-slate-500 text-sm mt-1">Complete the payment in the Paystack window...</p>
              </div>
              <p className="text-xs text-slate-400">Do not close this window</p>
            </div>
          )}

          {/* Step: Status */}
          {step === 'status' && paymentStatus && (
            <div className="py-6 space-y-4">
              <PaymentStatus status={paymentStatus.status} message={paymentStatus.message} />

              {paymentStatus.status === 'failed' && (
                <button
                  onClick={() => { setStep('confirm'); setError(''); }}
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
