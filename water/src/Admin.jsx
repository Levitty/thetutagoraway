// ============================================================================
// THE LANDLORD'S SCREEN
//
// Three jobs: get the meter list in, get this month's bills in, and see what
// has been paid. Nothing else — this is the smallest thing that makes the
// tenant screen usable, and every extra feature here is a feature nobody has
// asked for yet.
//
// Sign-in is a magic link, so there is no password to lose, and the right to
// be here is decided by `water_admins` in the database — a table users cannot
// write to — not by a column on a row they can edit. The sibling tutoring
// project had `profiles.is_admin`, which any signed-in user could set on
// themselves, and doing so opened every lesson chat in the system.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { parseCsv, thisPeriod } from './csv.js';
import { normalizeMeterNo, formatKes } from './meters.js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const SAMPLE = `meter_no,house,tenant_name,phone
412,B3,Wanjiru Njoroge,0712345678
413,B4,John Omondi,0722333444`;

const SAMPLE_BILLS = `meter_no,amount_kes,prev_reading,reading
412,740,1140,1182
413,"1,200",980,1041`;

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(null);
  const [tab, setTab] = useState('payments');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Whether this account may be here is the database's answer, not a guess
  // from the email. If the read fails, we are not allowed — never the reverse.
  useEffect(() => {
    if (!session) { setAllowed(null); return; }
    supabase.from('meters').select('id').limit(1)
      .then(({ error }) => setAllowed(!error));
  }, [session]);

  if (checking) return <Shell><p className="text-slate-400">…</p></Shell>;
  if (!session) return <Shell><SignIn /></Shell>;
  if (allowed === false) return (
    <Shell>
      <h1 className="text-2xl font-bold">Not your account</h1>
      <p className="text-slate-500 mt-2 leading-snug">
        {session.user.email} is signed in but is not an administrator here. Add the address to
        the <code className="bg-slate-100 px-1 rounded">water_admins</code> table in Supabase.
      </p>
      <button onClick={() => supabase.auth.signOut()} className="mt-6 text-[15px] font-bold text-slate-900 underline">Sign out</button>
    </Shell>
  );
  if (allowed === null) return <Shell><p className="text-slate-400">…</p></Shell>;

  return (
    <Shell wide>
      <div className="flex items-center justify-between gap-4 mb-7">
        <h1 className="text-[26px] font-bold">Water</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-400 hidden sm:inline">{session.user.email}</span>
          <button onClick={() => supabase.auth.signOut()} className="text-[13px] font-bold text-slate-500">Sign out</button>
        </div>
      </div>
      <div className="flex gap-1.5 mb-7">
        {[['payments', 'Payments'], ['bills', 'Bills'], ['meters', 'Meters']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`h-10 px-4 rounded-full text-[14px] font-bold ${tab === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'payments' && <Payments />}
      {tab === 'meters' && <Importer kind="meters" />}
      {tab === 'bills' && <Importer kind="bills" />}
    </Shell>
  );
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const send = async (e) => {
    e.preventDefault();
    setErr('');
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: window.location.href },
    });
    if (error) setErr(error.message); else setSent(true);
  };
  if (sent) return (
    <>
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="text-slate-500 mt-2">A sign-in link is on its way to {email}.</p>
    </>
  );
  return (
    <form onSubmit={send}>
      <h1 className="text-2xl font-bold">Water admin</h1>
      <p className="text-slate-500 mt-2">Sign in with a link. No password.</p>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com" aria-label="Email"
        className="mt-6 w-full h-14 px-4 rounded-2xl bg-slate-100 text-[17px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
      {err && <p className="text-[14px] text-red-600 mt-3">{err}</p>}
      <button className="mt-3 w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-[17px]">Send link</button>
    </form>
  );
}

function Payments() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    supabase.from('water_payments')
      .select('reference, amount_kes, paid_kes, overpaid_kes, status, channel, paid_at, created_at, meters(meter_no, house, tenant_name)')
      .order('created_at', { ascending: false }).limit(200)
      .then(({ data }) => setRows(data || []));
  }, []);
  if (!rows) return <p className="text-slate-400">…</p>;
  if (!rows.length) return <Empty>No payments yet. They appear here the moment a tenant pays.</Empty>;

  const paid = rows.filter(r => r.status === 'paid');
  const total = paid.reduce((s, r) => s + (r.paid_kes || 0), 0);
  return (
    <>
      <div className="rounded-2xl bg-slate-900 text-white px-5 py-5 mb-5">
        <p className="text-[12px] font-bold tracking-[.08em] uppercase text-white/60">Received</p>
        <p className="text-[36px] font-bold leading-none mt-1 tabular-nums">{formatKes(total)}</p>
        <p className="text-[13px] text-white/60 mt-1.5">{paid.length} payment{paid.length === 1 ? '' : 's'}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map(r => (
          <div key={r.reference} className="py-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[15px] truncate">
                {r.meters?.house ? `House ${r.meters.house}` : 'Unknown house'}
                <span className="font-normal text-slate-400"> · Meter {r.meters?.meter_no ?? '—'}</span>
              </p>
              <p className="text-[12.5px] text-slate-400 truncate">
                {r.meters?.tenant_name || '—'} · {new Date(r.paid_at || r.created_at).toLocaleString('en-KE')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-[15px] tabular-nums">{formatKes(r.paid_kes ?? r.amount_kes)}</p>
              <p className={`text-[11.5px] font-bold ${r.status === 'paid' ? 'text-emerald-600' : r.status === 'pending' ? 'text-amber-600' : 'text-red-500'}`}>
                {r.status}{r.overpaid_kes > 0 ? ` · +${r.overpaid_kes} credit` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** Paste a spreadsheet. Shows what it understood BEFORE anything is saved. */
function Importer({ kind }) {
  const meters = kind === 'meters';
  const [text, setText] = useState('');
  const [period, setPeriod] = useState(thisPeriod());
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const parsed = text.trim()
    ? parseCsv(text, { require: meters ? ['meter_no', 'house'] : ['meter_no', 'amount_kes'] })
    : null;

  const save = async () => {
    setSaving(true); setResult(null);
    try {
      const rows = parsed.rows.map(r => ({ ...r, meter_no: normalizeMeterNo(r.meter_no) }));
      if (meters) {
        const { error } = await supabase.from('meters')
          .upsert(rows.map(r => ({
            meter_no: r.meter_no, house: r.house || '', tenant_name: r.tenant_name || null,
            phone: r.phone || null, active: true, updated_at: new Date().toISOString(),
          })), { onConflict: 'meter_no' });
        if (error) throw error;
        setResult({ ok: true, n: rows.length });
      } else {
        // Bills need the meter's id, so the meters must exist first. A bill for
        // a meter nobody has entered is named, not silently dropped.
        const { data: known } = await supabase.from('meters')
          .select('id, meter_no').in('meter_no', rows.map(r => r.meter_no));
        const byNo = Object.fromEntries((known || []).map(m => [m.meter_no, m.id]));
        const missing = rows.filter(r => !byNo[r.meter_no]).map(r => r.meter_no);
        const ready = rows.filter(r => byNo[r.meter_no]);
        if (ready.length) {
          const { error } = await supabase.from('bills').upsert(ready.map(r => ({
            meter_id: byNo[r.meter_no], period, amount_kes: r.amount_kes,
            reading: r.reading ?? null, prev_reading: r.prev_reading ?? null,
          })), { onConflict: 'meter_id,period' });
          if (error) throw error;
        }
        setResult({ ok: true, n: ready.length, missing });
      }
    } catch (e) {
      setResult({ ok: false, error: e.message });
    } finally { setSaving(false); }
  };

  return (
    <>
      <p className="text-[15px] text-slate-500 leading-snug mb-4">
        {meters
          ? 'Paste the meter list from your spreadsheet. A meter already here is updated, not duplicated.'
          : 'Paste this month’s bills. A bill already set for this period is replaced.'}
      </p>
      {!meters && (
        <label className="flex items-center gap-2.5 mb-4 text-[14px] font-bold">
          Period
          <input value={period} onChange={e => setPeriod(e.target.value)} placeholder="2026-10"
            className="h-10 px-3 rounded-xl bg-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900" />
        </label>
      )}
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder={meters ? SAMPLE : SAMPLE_BILLS}
        aria-label={meters ? 'Meter list' : 'Bills'}
        className="w-full rounded-2xl bg-slate-100 p-4 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-slate-900" />

      {parsed && (
        <div className="mt-4">
          <p className="text-[15px] font-bold">
            {parsed.rows.length} row{parsed.rows.length === 1 ? '' : 's'} understood
            {parsed.problems.length > 0 && <span className="text-red-600"> · {parsed.problems.length} could not be read</span>}
          </p>
          {parsed.problems.length > 0 && (
            <ul className="mt-2 text-[13px] text-red-700 bg-red-50 rounded-xl p-3 space-y-1">
              {parsed.problems.slice(0, 8).map((p, i) => <li key={i}>Line {p.line}: {p.error}</li>)}
            </ul>
          )}
          {parsed.rows.length > 0 && (
            <div className="mt-3 overflow-x-auto">
              <table className="text-[13px] w-full">
                <tbody className="divide-y divide-slate-100">
                  {parsed.rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>
                      <td className="py-1.5 pr-3 font-mono font-bold">{normalizeMeterNo(r.meter_no)}</td>
                      <td className="py-1.5 pr-3">{meters ? (r.house || '—') : formatKes(r.amount_kes)}</td>
                      <td className="py-1.5 text-slate-400 truncate">{meters ? (r.tenant_name || '') : `${r.prev_reading ?? '—'} → ${r.reading ?? '—'}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.rows.length > 5 && <p className="text-[12.5px] text-slate-400 mt-1">…and {parsed.rows.length - 5} more</p>}
            </div>
          )}
          <button onClick={save} disabled={saving || !parsed.rows.length}
            className="mt-5 h-13 px-6 py-3.5 rounded-2xl bg-slate-900 disabled:opacity-30 text-white font-bold text-[16px]">
            {saving ? 'Saving…' : `Save ${parsed.rows.length} ${meters ? 'meter' : 'bill'}${parsed.rows.length === 1 ? '' : 's'}`}
          </button>
        </div>
      )}

      {result && (
        <div className={`mt-4 rounded-xl p-4 text-[14px] ${result.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'}`}>
          {result.ok ? <>Saved {result.n}.</> : <>Could not save: {result.error}</>}
          {result.missing?.length > 0 && (
            <p className="mt-1.5">
              No meter on file for {result.missing.join(', ')} — add them under Meters first, then paste these bills again.
            </p>
          )}
        </div>
      )}
    </>
  );
}

const Empty = ({ children }) => <p className="text-slate-400 text-[15px] py-10 text-center">{children}</p>;
const Shell = ({ children, wide }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <div className={`mx-auto w-full ${wide ? 'max-w-[44rem]' : 'max-w-[26rem]'} px-5 py-10`}>{children}</div>
  </div>
);
