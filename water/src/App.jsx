// ============================================================================
// THE TENANT'S SCREEN
//
// Three states and nothing else: type the meter, confirm it is you, pay.
// Written for a cheap phone held in a corridor with one bar of signal, so:
// one thing per screen, large tap targets, and no step that needs an account.
//
// The confirm step exists because of the one failure this design cannot
// otherwise survive. A typo in a meter number does not bounce — it attaches
// real money to someone else's meter, and nobody finds out until two tenants
// argue about the same payment. Showing "House B3 · W. Njoroge" before the
// money moves turns a silent reconciliation bug into an obvious one.
// ============================================================================
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { callWaterPay } from './api.js';
import { initiatePaystackPayment } from './paystack.js';
import { formatKes, looksLikeMeterNo } from './meters.js';
import {
  rememberPending, readPending, forgetPending, shouldForget, isStale,
  makeConfirmer, CONFIRM_SCHEDULE,
} from './payment.js';

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

export default function App() {
  const [meterNo, setMeterNo] = useState('');
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState(null);     // { meter, bill }
  const [notFound, setNotFound] = useState('');
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null); // { amount_kes, overpaid_kes, channel }
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearTimers, []);

  // ---- confirming a payment that may still be settling ---------------------
  // One in flight at a time: the popup callback, the retry schedule and the
  // tab regaining focus all fire within the same second, and three identical
  // requests is how the tutoring version burned its retries in four seconds
  // while M-Pesa was still settling.
  const confirmOnce = useCallback(async (reference) => {
    try {
      return await callWaterPay('verify', { reference });
    } catch (e) {
      return { paid: false, error: `network: ${e?.message || 'offline'}` };
    }
  }, []);
  const confirm = useRef(makeConfirmer(confirmOnce)).current;

  const settle = useCallback(async (reference) => {
    const pending = readPending();
    const answer = await confirm(reference);
    if (answer?.paid) {
      clearTimers();
      forgetPending();
      setWaiting(false);
      setPaying(false);
      setReceipt(answer);
      return true;
    }
    if (shouldForget(pending, answer)) {
      clearTimers();
      forgetPending();
      setWaiting(false);
      setPaying(false);
      setError(answer?.error && !/^network/.test(answer.error)
        ? answer.error
        : 'We could not confirm that payment. If money left your phone, show this screen to the caretaker.');
      return true;
    }
    return false;
  }, [confirm]);

  const startConfirming = useCallback((reference) => {
    clearTimers();
    setWaiting(true);
    CONFIRM_SCHEDULE.forEach(delay => {
      timers.current.push(setTimeout(() => { settle(reference); }, delay));
    });
  }, [settle]);

  // A payment left unconfirmed when the tab was closed. M-Pesa is completed on
  // the PHONE, so the browser that has to turn it into a receipt is the one
  // most likely to have been closed at that exact moment.
  useEffect(() => {
    const p = readPending();
    if (!p) return;
    if (isStale(p)) { forgetPending(); return; }
    startConfirming(p.reference);
  }, [startConfirming]);

  // And again whenever they come back to the tab.
  useEffect(() => {
    const wake = () => {
      const p = readPending();
      if (p && !isStale(p)) settle(p.reference);
    };
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('focus', wake);
    return () => {
      document.removeEventListener('visibilitychange', wake);
      window.removeEventListener('focus', wake);
    };
  }, [settle]);

  // ---- look the meter up ---------------------------------------------------
  const lookup = async (e) => {
    e?.preventDefault();
    setError(''); setNotFound(''); setFound(null);
    if (!looksLikeMeterNo(meterNo)) {
      setNotFound('Type the meter number from your notice.');
      return;
    }
    setLooking(true);
    try {
      const r = await callWaterPay('lookup', { meter_no: meterNo });
      if (r?.found) setFound(r);
      else setNotFound(r?.error || r?.message || 'We couldn’t find that meter number.');
    } catch (e) {
      setNotFound(`Couldn’t reach the server. Check your connection and try again.`);
    } finally {
      setLooking(false);
    }
  };

  // ---- pay -----------------------------------------------------------------
  const pay = async () => {
    setError(''); setPaying(true);
    let started;
    try {
      started = await callWaterPay('start', { meter_no: found.meter.meter_no });
      if (!started?.reference) throw new Error(started?.error || 'Could not start the payment.');
    } catch (e) {
      setPaying(false);
      setError(e?.message || 'Could not start the payment.');
      return;
    }

    // Written down BEFORE Paystack opens. If the tab dies between here and the
    // PIN, the next visit picks the reference up and confirms it.
    rememberPending({
      reference: started.reference,
      meter_no: found.meter.meter_no,
      amount_kes: started.amount_kes,
      at: Date.now(),
    });

    initiatePaystackPayment({
      email: started.email,
      amount: started.amount_kes,
      reference: started.reference,
      metadata: {
        custom_fields: [
          { display_name: 'Meter', variable_name: 'meter_no', value: found.meter.meter_no },
          { display_name: 'House', variable_name: 'house', value: found.meter.house },
          { display_name: 'Period', variable_name: 'period', value: started.bill?.period || '' },
        ],
      },
      // Paystack reporting success is the START of confirmation, not the end:
      // on M-Pesa this fires while the charge is still settling.
      onSuccess: () => startConfirming(started.reference),
      // Closing the window is not a failure either. The STK prompt may still
      // be on the phone, so keep asking.
      onClose: () => startConfirming(started.reference),
    });
  };

  // ---- screens -------------------------------------------------------------
  if (receipt) {
    return (
      <Shell>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white grid place-items-center mx-auto text-3xl">✓</div>
          <h1 className="text-2xl font-bold mt-5">Paid</h1>
          <p className="text-slate-500 mt-1">{formatKes(receipt.amount_kes)} received{receipt.channel ? ` by ${receipt.channel.replace('_', ' ')}` : ''}.</p>
          {receipt.overpaid_kes > 0 && (
            <p className="text-[15px] text-slate-700 mt-3 bg-slate-100 rounded-xl px-4 py-3">
              You paid {formatKes(receipt.overpaid_kes)} more than the bill. It is on your meter as credit.
            </p>
          )}
          <p className="text-[13px] text-slate-400 mt-6">Take a screenshot of this screen.</p>
          <button onClick={() => { setReceipt(null); setFound(null); setMeterNo(''); }}
            className="mt-6 w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-[17px]">
            Pay another meter
          </button>
        </div>
      </Shell>
    );
  }

  if (waiting) {
    return (
      <Shell>
        <div className="text-center">
          <Spinner />
          <h1 className="text-2xl font-bold mt-5">Waiting for your payment</h1>
          <p className="text-slate-500 mt-2 leading-snug">
            If a prompt came up on your phone, enter your M-Pesa PIN. This screen will update by itself.
          </p>
          <p className="text-[13px] text-slate-400 mt-6">Keep this page open.</p>
        </div>
      </Shell>
    );
  }

  if (found) {
    const { meter, bill } = found;
    return (
      <Shell>
        <button onClick={() => { setFound(null); setError(''); }} className="text-[15px] font-bold text-slate-500 mb-5">← Back</button>
        <p className="text-[13px] font-bold tracking-[.08em] uppercase text-slate-400">Is this you?</p>
        <h1 className="text-[30px] font-bold leading-tight mt-1">House {meter.house}</h1>
        <p className="text-[17px] text-slate-600">{meter.name || 'Tenant'} · Meter {meter.meter_no}</p>

        {bill ? (
          <>
            <div className="mt-7 rounded-2xl bg-slate-900 text-white px-5 py-6">
              <p className="text-[13px] font-bold tracking-[.08em] uppercase text-white/60">Water bill · {bill.period}</p>
              <p className="text-[44px] font-bold leading-none mt-1.5 tabular-nums">{formatKes(bill.amount_kes)}</p>
              {bill.reading != null && bill.prev_reading != null && (
                <p className="text-[13px] text-white/60 mt-2 tabular-nums">
                  Reading {bill.prev_reading} → {bill.reading}
                </p>
              )}
            </div>
            {error && <p className="text-[15px] text-red-600 mt-4">{error}</p>}
            <button onClick={pay} disabled={paying}
              className="mt-5 w-full h-16 rounded-2xl bg-emerald-600 disabled:opacity-50 text-white font-bold text-[18px] flex items-center justify-center gap-2.5">
              {paying ? <><Spinner /> Opening…</> : `Pay ${formatKes(bill.amount_kes)}`}
            </button>
            <p className="text-[13px] text-slate-400 text-center mt-3">M-Pesa, card or bank.</p>
          </>
        ) : (
          <div className="mt-7 rounded-2xl bg-emerald-50 px-5 py-6 text-center">
            <p className="text-[17px] font-bold text-emerald-900">Nothing owed</p>
            <p className="text-[15px] text-emerald-800/80 mt-1">This meter has no unpaid bill right now.</p>
          </div>
        )}
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-[30px] font-bold leading-tight">Pay your water bill</h1>
      <p className="text-[17px] text-slate-500 mt-2">Type the meter number from your notice.</p>
      <form onSubmit={lookup} className="mt-7">
        <input
          value={meterNo}
          onChange={(e) => { setMeterNo(e.target.value); setNotFound(''); }}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="e.g. 412"
          aria-label="Meter number"
          className="w-full h-16 px-5 rounded-2xl bg-slate-100 text-[22px] font-bold tracking-wide placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {notFound && <p className="text-[15px] text-red-600 mt-3 leading-snug">{notFound}</p>}
        <button type="submit" disabled={looking || !meterNo.trim()}
          className="mt-4 w-full h-16 rounded-2xl bg-slate-900 disabled:opacity-30 text-white font-bold text-[18px] flex items-center justify-center gap-2.5">
          {looking ? <><Spinner /> Checking…</> : 'Continue'}
        </button>
      </form>
    </Shell>
  );
}

const Shell = ({ children }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10">{children}</div>
  </div>
);
