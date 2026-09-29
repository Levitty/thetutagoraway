// ============================================================================
// STUDENT SPACE — the parent hands a device to a child; the child gets a space
// with nothing adult in it (no payments, tutor booking, messages or settings).
//
//   HandOver   parent side: pick or add a child, set the parent PIN, hand over
//   StudentHome the child's space: practice, writing, their own lessons
//   PinGate    the only way out: the parent PIN
//
// Grade 9+ gets the older-student treatment: initials and a colour instead of
// an animal buddy, and direct language. Styled on HOREB's design system.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import {
  startStudentMode, isOlderLearner, getLook, setLook,
  hasPin, setPin, checkPin, pinLockedFor, setFamilyDevice,
} from './studentMode.js';

const firstName = (n) => (n || '').trim().split(/\s+/)[0] || '';
const deviceWord = () => {
  if (typeof window === 'undefined') return 'device';
  const ua = navigator.userAgent || '';
  const tablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || window.innerWidth >= 700;
  return tablet ? 'tablet' : 'phone';
};
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// ---- Shared pieces ---------------------------------------------------------

export const Shell = ({ header, children, wide = false }) => (
  <div className="min-h-screen bg-[#eef0f2] text-slate-900 app-shell">
    {header}
    <div className="app-scroll">
      <div className={`${wide ? 'max-w-3xl' : 'max-w-md'} mx-auto px-4 pt-5 pb-16 space-y-3`}>{children}</div>
    </div>
  </div>
);
export const Header = ({ children }) => (
  <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
    <div className="max-w-3xl mx-auto px-4 min-h-14 py-2.5 flex items-center gap-3">{children}</div>
  </div>
);
export const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl p-4 ${className}`}>{children}</div>
);
export const Eyebrow = ({ tone = 'text-amber-700', children }) => (
  <div className={`text-[11.5px] font-bold tracking-[.08em] uppercase ${tone}`}>{children}</div>
);
export const PrimaryButton = ({ children, className = '', ...p }) => (
  <button {...p} className={`w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-900 rounded-xl py-3 font-bold text-[15px] transition-colors ${className}`}>{children}</button>
);
const IndigoButton = ({ children, className = '', ...p }) => (
  <button {...p} className={`w-full bg-[#6d6fcb] hover:bg-[#5658b8] disabled:opacity-50 text-white rounded-xl py-3 font-bold text-[15px] transition-colors ${className}`}>{children}</button>
);
export const BackIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const LockIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
);

// ---- Buddies (Grade 1–8) and colours (Grade 9–12) --------------------------

const BUDDIES = {
  lion: (<><circle cx="32" cy="34" r="24" fill="#f2a828" /><circle cx="32" cy="36" r="16" fill="#fcd9a0" /><circle cx="26" cy="33" r="2.4" fill="#141a3d" /><circle cx="38" cy="33" r="2.4" fill="#141a3d" /><path d="M28 41 Q32 44 36 41" stroke="#141a3d" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="32" cy="38" r="2" fill="#c0663f" /></>),
  zebra: (<><rect x="14" y="12" width="36" height="44" rx="16" fill="#ffffff" stroke="#141a3d" strokeWidth="2" /><path d="M14 24h10M40 24h10M14 32h8M42 32h8M26 12v8M38 12v8" stroke="#141a3d" strokeWidth="3" strokeLinecap="round" /><rect x="20" y="40" width="24" height="14" rx="7" fill="#c7cbe8" /><circle cx="26" cy="32" r="2.4" fill="#141a3d" /><circle cx="38" cy="32" r="2.4" fill="#141a3d" /></>),
  giraffe: (<><rect x="16" y="14" width="32" height="42" rx="15" fill="#f5c451" /><circle cx="24" cy="24" r="4" fill="#c0663f" /><circle cx="40" cy="44" r="4" fill="#c0663f" /><circle cx="41" cy="23" r="3" fill="#c0663f" /><line x1="24" y1="6" x2="24" y2="14" stroke="#c0663f" strokeWidth="3" strokeLinecap="round" /><line x1="40" y1="6" x2="40" y2="14" stroke="#c0663f" strokeWidth="3" strokeLinecap="round" /><circle cx="26" cy="32" r="2.4" fill="#141a3d" /><circle cx="38" cy="32" r="2.4" fill="#141a3d" /><path d="M28 42 Q32 45 36 42" stroke="#141a3d" strokeWidth="2" fill="none" strokeLinecap="round" /></>),
  rhino: (<><rect x="12" y="16" width="40" height="38" rx="17" fill="#a3aec2" /><path d="M32 30 L28 14 L37 26 Z" fill="#eef0f2" /><circle cx="24" cy="34" r="2.4" fill="#141a3d" /><circle cx="40" cy="34" r="2.4" fill="#141a3d" /><ellipse cx="32" cy="45" rx="9" ry="5" fill="#8894aa" /></>),
  bird: (<><circle cx="32" cy="34" r="22" fill="#8ca86a" /><circle cx="32" cy="38" r="13" fill="#eef5e6" /><circle cx="25" cy="30" r="2.4" fill="#141a3d" /><circle cx="39" cy="30" r="2.4" fill="#141a3d" /><path d="M28 36 L36 36 L32 42 Z" fill="#f2a828" /></>),
  elephant: (<><circle cx="14" cy="30" r="10" fill="#9da0dc" /><circle cx="50" cy="30" r="10" fill="#9da0dc" /><circle cx="32" cy="32" r="18" fill="#6d6fcb" /><rect x="28" y="38" width="8" height="18" rx="4" fill="#6d6fcb" /><circle cx="26" cy="29" r="2.4" fill="#fff" /><circle cx="38" cy="29" r="2.4" fill="#fff" /></>),
};
const COLORS = ['#6d6fcb', '#141a3d', '#5a7a3a', '#c0663f', '#b45309', '#475569'];

export const LearnerAvatar = ({ name, look, size = 36 }) => {
  if (look?.kind === 'buddy' && BUDDIES[look.id]) {
    return <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${look.id} buddy`}>{BUDDIES[look.id]}</svg>;
  }
  const initials = firstName(name).slice(0, 2).toUpperCase() || '?';
  return (
    <span className="rounded-xl flex items-center justify-center font-extrabold text-white shrink-0"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), background: look?.color || '#6d6fcb' }}>
      {initials}
    </span>
  );
};

// ---- PIN pad ---------------------------------------------------------------

const PinPad = ({ onComplete, error = '', busy = false }) => {
  const [pin, setPinDigits] = useState('');
  const press = (k) => {
    if (busy) return;
    if (k === 'del') { setPinDigits(p => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPinDigits(next);
    // Hand the PIN over, then clear the pad so a wrong PIN can be retyped.
    if (next.length === 4) setTimeout(() => { setPinDigits(''); onComplete(next); }, 150);
  };
  return (
    <div className="space-y-5">
      <div className="flex justify-center gap-3" aria-label={`${pin.length} of 4 digits entered`}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} className={`w-3.5 h-3.5 rounded-full border-2 ${error ? 'border-[#c0663f]' : 'border-slate-700'} ${i < pin.length ? (error ? 'bg-[#c0663f]' : 'bg-slate-700') : ''}`} />
        ))}
      </div>
      <div className="min-h-5 text-center text-[13px] font-semibold text-[#c0663f]" aria-live="polite">{error}</div>
      <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) => k === ''
          ? <span key={i} />
          : (
            <button key={i} onClick={() => press(k)} aria-label={k === 'del' ? 'Delete' : k}
              className="bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-2xl py-3.5 text-[22px] font-bold text-slate-900 transition-colors">
              {k === 'del' ? <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z" /><path d="m17 9-6 6M11 9l6 6" /></svg> : k}
            </button>
          ))}
      </div>
    </div>
  );
};

// ---- Parent: hand the device over -----------------------------------------

export const HandOver = ({ user, onStart, onCancel }) => {
  const [step, setStep] = useState('pick'); // pick | pin | confirm | ready
  const [kids, setKids] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('Grade 6');
  const [pinSet, setPinSet] = useState(null);
  const [firstPin, setFirstPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const device = deviceWord();

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('children').select('id, name, grade').eq('parent_id', user.id).order('created_at')
      .then(({ data }) => { setKids(data || []); if (!data?.length) setAdding(true); });
    hasPin().then(setPinSet).catch(() => setPinSet(false));
  }, [user?.id]);

  const addChild = async () => {
    const name = newName.trim();
    if (!name) { setErr("Add your child's first name."); return; }
    setBusy(true); setErr('');
    const { data, error } = await supabase.from('children').insert({ parent_id: user.id, name, grade: newGrade }).select('id, name, grade').single();
    setBusy(false);
    if (error) { setErr("Couldn't save. Check your connection and try again."); return; }
    setKids(k => [...(k || []), data]); setChosen(data); setAdding(false); setNewName('');
  };

  // No PIN on the way in: handing over should be one tap.
  const next = () => { setErr(''); setStep('ready'); };

  const onPin = async (pin) => {
    if (step === 'pin') { setFirstPin(pin); setStep('confirm'); return; }
    if (pin !== firstPin) { setErr("The PINs didn't match. Start again."); setFirstPin(''); setStep('pin'); return; }
    setBusy(true);
    try { await setPin(user.id, pin); setPinSet(true); setErr(''); setStep('ready'); }
    catch { setErr("Couldn't save the PIN. Check your connection."); setStep('pin'); }
    setBusy(false);
  };

  const n = firstName(chosen?.name);
  const header = (
    <Header>
      <button onClick={step === 'pick' ? onCancel : () => { setErr(''); setStep('pick'); }} aria-label="Back" className="text-slate-400 hover:text-slate-700"><BackIcon /></button>
      <h1 className="text-[17px] font-extrabold tracking-tight">Hand over to your child</h1>
    </Header>
  );

  if (step === 'pin' || step === 'confirm') {
    return (
      <Shell header={header}>
        <Card className="text-center">
          <Eyebrow>Parent PIN</Eyebrow>
          <div className="text-[19px] font-extrabold tracking-tight mt-1">{step === 'pin' ? 'Choose a 4-digit PIN' : 'Enter it again'}</div>
          <p className="text-sm text-slate-500 mt-1">{n || 'Your child'} needs this PIN to leave their space. Payments, tutors and messages stay on your side.</p>
        </Card>
        <PinPad key={step} onComplete={onPin} error={err} busy={busy} />
      </Shell>
    );
  }

  if (step === 'ready') {
    return (
      <div className="min-h-screen app-shell text-slate-900" style={{ background: 'linear-gradient(180deg,#ecedfa,#eef0f2)' }}>
        <div className="app-scroll">
          <div className="max-w-md mx-auto px-5 pt-16 pb-16 flex flex-col items-center text-center gap-4">
            <HorebBot size={96} mood="cheer" />
            <Eyebrow tone="text-[#6d6fcb]">All set</Eyebrow>
            <h1 className="text-[27px] font-extrabold tracking-tight leading-tight">Now give this {device} to {n}.</h1>
            <p className="text-slate-500">
              {isOlderLearner(chosen?.grade)
                ? `HOREB takes it from here. This ${device} stays in ${n}'s space until you enter your PIN.`
                : `HOREB takes it from here. No marks, no grades. This ${device} stays in ${n}'s space until you enter your PIN.`}
            </p>
            <IndigoButton onClick={() => onStart(startStudentMode(user.id, chosen))}>I'm {n}, let's go</IndigoButton>
            <Card className="text-left w-full">
              <div className="text-[14px] font-bold">Setting up {n}'s own tablet?</div>
              <p className="text-[13.5px] text-slate-500 mt-1">Sign in to Tutagora on that tablet with your account and tap "Hand over to your child". It will open straight into {n}'s space every time.</p>
            </Card>
            <button onClick={onCancel} className="text-sm font-semibold text-slate-500 underline underline-offset-4">Not now</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Shell header={header}>
      <Card>
        <div className="text-[17px] font-extrabold tracking-tight">Who's using this {device}?</div>
        <p className="text-sm text-slate-500 mt-0.5">They get their own space with practice, writing and their lessons. Nothing that costs money.</p>
      </Card>
      {kids === null && <div className="text-center text-sm text-slate-400 py-6">Loading…</div>}
      {kids?.map(k => (
        <button key={k.id} onClick={() => setChosen(k)}
          className={`w-full flex items-center gap-3 bg-white border rounded-2xl p-4 text-left shadow-sm transition-colors ${chosen?.id === k.id ? 'border-[#6d6fcb] ring-2 ring-[#6d6fcb]/20' : 'border-slate-200 hover:border-slate-300'}`}>
          <LearnerAvatar name={k.name} look={getLook(k.id)} size={40} />
          <span className="flex-1 min-w-0">
            <span className="block font-bold text-[15px] truncate">{k.name}</span>
            {k.grade && <span className="block text-[13px] text-slate-500">{k.grade}</span>}
          </span>
          <span className={`w-5 h-5 rounded-full border-2 ${chosen?.id === k.id ? 'border-[#6d6fcb] bg-[#6d6fcb]' : 'border-slate-300'}`} />
        </button>
      ))}
      {adding ? (
        <Card className="space-y-3">
          <Eyebrow>Add a child</Eyebrow>
          <label className="block text-[12.5px] font-bold text-slate-700">First name
            <input value={newName} onChange={e => setNewName(e.target.value)} autoComplete="off"
              className="mt-1.5 w-full bg-white border-[1.5px] border-slate-200 rounded-xl px-3 py-2.5 text-[15px] font-semibold focus:outline-none focus:border-[#6d6fcb]" />
          </label>
          <label className="block text-[12.5px] font-bold text-slate-700">Grade in school
            <select value={newGrade} onChange={e => setNewGrade(e.target.value)}
              className="mt-1.5 w-full bg-white border-[1.5px] border-slate-200 rounded-xl px-3 py-2.5 text-[15px] font-semibold focus:outline-none focus:border-[#6d6fcb]">
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </label>
          <PrimaryButton onClick={addChild} disabled={busy}>{busy ? 'Saving…' : 'Save'}</PrimaryButton>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className="text-sm font-semibold text-[#6d6fcb] px-1">+ Add a child</button>
      )}
      {err && <div className="text-sm font-semibold text-[#c0663f] px-1">{err}</div>}
      {chosen && !adding && <PrimaryButton onClick={next} disabled={pinSet === null}>Continue</PrimaryButton>}
      {pinSet && <button onClick={() => { setErr(''); setStep('pin'); }} className="block text-[13px] font-semibold text-slate-500 underline underline-offset-4 px-1">Change parent PIN</button>}
    </Shell>
  );
};

// ---- Child: pick how you appear (first visit) ------------------------------

const LookPicker = ({ mode, onDone }) => {
  const older = isOlderLearner(mode.grade);
  const n = firstName(mode.name);
  const [look, setLocal] = useState(older ? { kind: 'color', color: COLORS[0] } : { kind: 'buddy', id: 'lion' });
  return (
    <Shell wide>
      <div className="flex items-start gap-3 pt-2">
        <HorebBot size={52} className="shrink-0" />
        <div className="bg-white border border-slate-200 rounded-[4px_16px_16px_16px] px-4 py-3 font-semibold text-slate-700">
          {older ? `Hi ${n}. I'm HOREB. Pick a colour for your profile.` : `Jambo ${n}! I'm HOREB. First, pick your buddy.`}
        </div>
      </div>
      {older ? (
        <Card className="flex flex-col items-center gap-4">
          <LearnerAvatar name={mode.name} look={look} size={72} />
          <div className="grid grid-cols-6 gap-2.5 w-full max-w-sm">
            {COLORS.map(c => (
              <button key={c} onClick={() => setLocal({ kind: 'color', color: c })} aria-label={`Colour ${c}`} aria-pressed={look.color === c}
                className={`aspect-square rounded-xl border-[3px] ${look.color === c ? 'border-slate-900' : 'border-transparent'}`} style={{ background: c }} />
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {Object.keys(BUDDIES).map(id => (
            <button key={id} onClick={() => setLocal({ kind: 'buddy', id })} aria-label={id} aria-pressed={look.id === id}
              className={`aspect-square rounded-2xl border-2 bg-white p-2 transition-colors ${look.id === id ? 'border-[#6d6fcb] bg-[#ecedfa]' : 'border-slate-200'}`}>
              <svg viewBox="0 0 64 64" className="w-full h-full">{BUDDIES[id]}</svg>
            </button>
          ))}
        </div>
      )}
      <PrimaryButton onClick={() => { setLook(mode.learnerId, look); onDone(look); }}>Continue</PrimaryButton>
    </Shell>
  );
};

// ---- Child: their space ----------------------------------------------------

const prettyDate = (d) => {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00'); const today = new Date();
  const days = Math.round((dt - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  if (days === 0) return 'Today'; if (days === 1) return 'Tomorrow';
  return dt.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
};

export const StudentHome = ({ mode, bookings, onPractice, onWriting, onJoin, onLock, lockLabel = 'Back to parent', extra = null }) => {
  const [look, setLookState] = useState(() => getLook(mode.learnerId));
  if (!look) return <LookPicker mode={mode} onDone={setLookState} />;

  const older = isOlderLearner(mode.grade);
  const n = firstName(mode.name);
  // This child's lessons only: linked by child_id, or by name on older bookings.
  const mine = (bookings || []).filter(b => b.child_id
    ? b.child_id === mode.learnerId
    : firstName(b.learner_name).toLowerCase() === n.toLowerCase());
  const next = mine.filter(b => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => `${a.lesson_date}${a.start_time}`.localeCompare(`${b.lesson_date}${b.start_time}`))[0];

  return (
    <Shell wide header={
      <Header>
        <LearnerAvatar name={mode.name} look={look} size={34} />
        <h1 className="flex-1 min-w-0 text-[17px] font-extrabold tracking-tight truncate">{older ? n : `${n}'s space`}</h1>
        {onLock && <button onClick={onLock}
          className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-bold">{lockLabel}</button>}
      </Header>
    }>
      <div className="flex items-center gap-3 pt-1">
        <HorebBot size={44} className="shrink-0" />
        <div className="text-[19px] font-extrabold tracking-tight">{older ? `Hi ${n}.` : `Jambo ${n}! Ready for today?`}</div>
      </div>

      {extra}

      <div className="grid gap-3 md:grid-cols-2 md:items-start">
        <Card className="space-y-3 md:row-span-2">
          <Eyebrow>Maths practice</Eyebrow>
          <div className="text-[18px] font-extrabold tracking-tight leading-snug">
            {older ? 'Your plan for today' : 'HOREB has your next steps ready'}
          </div>
          <p className="text-sm text-slate-500">{older ? 'Reviews first, then one new skill. About 15 minutes.' : 'A few reviews and one new skill. About 15 minutes, then you are done for today.'}</p>
          <PrimaryButton onClick={onPractice}>Start</PrimaryButton>
        </Card>

        {onWriting && <Card className="space-y-2">
          <Eyebrow tone="text-[#6d6fcb]">Writing</Eyebrow>
          <div className="text-[16px] font-bold">Composition and insha</div>
          <p className="text-sm text-slate-500">Write, get a mark out of 20 and the exact lines to fix.</p>
          <button onClick={onWriting} className="w-full bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-2.5 font-bold text-[14px] text-slate-800 transition-colors">Open writing</button>
        </Card>}

        <Card className="space-y-2">
          <Eyebrow tone="text-[#5a7a3a]">Your lessons</Eyebrow>
          {next ? (
            <>
              <div className="text-[16px] font-bold">{next.subject}</div>
              <div className="text-sm text-slate-500">
                {prettyDate(next.lesson_date)} at {next.start_time?.slice(0, 5)}
                {next.tutors?.profiles?.full_name ? ` · with ${next.tutors.profiles.full_name}` : ''}
              </div>
              {next.status === 'confirmed'
                ? <button onClick={() => onJoin(next)} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 font-bold text-[14px] transition-colors">Join lesson</button>
                : <div className="text-[13px] text-slate-400">Waiting for the tutor to confirm.</div>}
            </>
          ) : (
            <p className="text-sm text-slate-500">No lessons booked. {older ? 'Ask your parent if you want a tutor for something.' : 'If something feels hard, ask your parent about a tutor.'}</p>
          )}
        </Card>
      </div>
    </Shell>
  );
};

// ---- The way out -----------------------------------------------------------

export const PinGate = ({ userId, learnerName, onUnlock, onCancel, onSignOut }) => {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [lockMs, setLockMs] = useState(pinLockedFor());

  useEffect(() => {
    if (lockMs <= 0) return undefined;
    const t = setInterval(() => setLockMs(pinLockedFor()), 1000);
    return () => clearInterval(t);
  }, [lockMs > 0]);

  const submit = async (pin) => {
    setBusy(true);
    try {
      if (await checkPin(userId, pin)) { onUnlock(); return; }
      const wait = pinLockedFor();
      setLockMs(wait);
      setErr(wait > 0 ? 'Too many tries. Wait a minute.' : "That's not the PIN.");
    } catch {
      setErr("Couldn't check the PIN. Check the internet connection.");
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[#eef0f2] text-slate-900 app-shell">
      <Header>
        <button onClick={onCancel} aria-label="Back" className="text-slate-400 hover:text-slate-700"><BackIcon /></button>
        <h1 className="text-[17px] font-extrabold tracking-tight">Parent PIN</h1>
      </Header>
      <div className="app-scroll">
        <div className="max-w-sm mx-auto px-4 pt-8 pb-16 space-y-5">
          <p className="text-center text-slate-500">{learnerName ? `Enter the parent PIN to leave ${firstName(learnerName)}'s space.` : 'Enter the parent PIN to open the parent side.'}</p>
          {lockMs > 0
            ? <div className="text-center font-semibold text-[#c0663f]">Too many tries. Try again in {Math.ceil(lockMs / 1000)} seconds.</div>
            : <PinPad onComplete={submit} error={err} busy={busy} />}
          {!forgot ? (
            <button onClick={() => setForgot(true)} className="block mx-auto text-[13px] font-semibold text-slate-500 underline underline-offset-4">Forgot the PIN?</button>
          ) : (
            <Card className="space-y-2 text-sm">
              <p className="text-slate-600">Sign out, then sign back in with your account password. You can then choose a new PIN.</p>
              <button onClick={onSignOut} className="w-full bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-2.5 font-bold text-slate-800">Sign out</button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- A family tablet ----------------------------------------------------------
// The parent signs in on the tablet once and sets it up for the children. From
// then on it opens on "Who's practising?": each child taps their own tile; the
// parent side is behind the parent PIN.

export const FamilyTabletSetup = ({ user, onDone, onCancel }) => {
  const [step, setStep] = useState('intro'); // intro | pin | confirm
  const [pinSet, setPinSet] = useState(null);
  const [firstPin, setFirstPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { hasPin().then(setPinSet).catch(() => setPinSet(false)); }, []);

  const finish = () => { setFamilyDevice(user.id); onDone(); };
  const onPin = async (pin) => {
    if (step === 'pin') { setFirstPin(pin); setErr(''); setStep('confirm'); return; }
    if (pin !== firstPin) { setErr("The PINs didn't match. Start again."); setFirstPin(''); setStep('pin'); return; }
    setBusy(true);
    try { await setPin(user.id, pin); finish(); }
    catch { setErr("Couldn't save the PIN. Check your connection."); setStep('pin'); }
    setBusy(false);
  };
  const header = (
    <Header>
      <button onClick={step === 'intro' ? onCancel : () => { setErr(''); setStep('intro'); }} aria-label="Back" className="text-slate-400 hover:text-slate-700"><BackIcon /></button>
      <h1 className="text-[17px] font-extrabold tracking-tight">Children's tablet</h1>
    </Header>
  );

  if (step === 'pin' || step === 'confirm') {
    return (
      <Shell header={header}>
        <Card className="text-center">
          <Eyebrow>Parent PIN</Eyebrow>
          <div className="text-[19px] font-extrabold tracking-tight mt-1">{step === 'pin' ? 'Choose a 4-digit PIN' : 'Enter it again'}</div>
          <p className="text-sm text-slate-500 mt-1">Only you need this. It opens the parent side, where payments, tutors and messages are. You choose it once.</p>
        </Card>
        <PinPad key={step} onComplete={onPin} error={err} busy={busy} />
      </Shell>
    );
  }
  return (
    <Shell header={header}>
      <Card className="space-y-3">
        <HorebBot size={56} mood="cheer" />
        <div className="text-[19px] font-extrabold tracking-tight">Make this the children's tablet</div>
        <p className="text-sm text-slate-500">This {deviceWord()} will open on <b>"Who's practising?"</b>. Each child taps their own name and goes straight into their practice. Nothing that costs money.</p>
        <p className="text-sm text-slate-500">The parent side stays locked with your parent PIN.</p>
        <PrimaryButton onClick={() => (pinSet ? finish() : setStep('pin'))} disabled={pinSet === null}>{pinSet ? 'Start' : 'Choose a parent PIN'}</PrimaryButton>
      </Card>
    </Shell>
  );
};

export const WhoIsPractising = ({ user, onPick, onParent }) => {
  const [kids, setKids] = useState(null);
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('children').select('id, name, grade').eq('parent_id', user.id).order('created_at')
      .then(({ data }) => setKids(data || []));
  }, [user?.id]);
  return (
    <div className="min-h-screen app-shell text-slate-900" style={{ background: 'linear-gradient(180deg,#ecedfa,#eef0f2)' }}>
      <div className="app-scroll">
        <div className="max-w-2xl mx-auto px-5 pt-14 pb-16 flex flex-col items-center gap-6">
          <HorebBot size={72} mood="cheer" />
          <h1 className="text-[30px] font-extrabold tracking-tight text-center">Who's practising?</h1>
          {kids === null && <div className="text-sm text-slate-400 py-6">Loading…</div>}
          {kids && kids.length === 0 && (
            <p className="text-center text-slate-500 max-w-sm">No children added yet. Open the parent side and add them, or take the free check.</p>
          )}
          {kids && kids.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-lg">
              {kids.map(k => (
                <button key={k.id} onClick={() => onPick(k)}
                  className="w-[150px] bg-white border border-slate-200 shadow-sm hover:border-[#6d6fcb] hover:shadow-md rounded-2xl p-5 flex flex-col items-center gap-3 transition">
                  <LearnerAvatar name={k.name} look={getLook(k.id)} size={72} />
                  <span className="text-[18px] font-extrabold tracking-tight">{firstName(k.name)}</span>
                  {k.grade && <span className="text-[13px] text-slate-400 -mt-2">{k.grade}</span>}
                </button>
              ))}
            </div>
          )}
          <button onClick={onParent}
            className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[14px] font-bold">
            <LockIcon /> Parent
          </button>
        </div>
      </div>
    </div>
  );
};
