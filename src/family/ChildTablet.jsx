// A child's own tablet, without the parent's Google account on it.
//
//   TabletLinkSheet  parent side: a one-time link to open on the tablet, and
//                    the tablets already linked, with "Switch off"
//   TabletLinkPage   tablet side: tutagora.com/t/<link> opens the child's space
import React, { useEffect, useState } from 'react';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { SiteIcon } from '../site/ui.jsx';
import { createChildLink, listChildTablets, switchOffTablet, openChildLink } from './studentMode.js';
import { Card, Eyebrow, PrimaryButton } from './StudentSpace.jsx';

const firstName = (n) => (n || '').trim().split(/\s+/)[0] || '';
const day = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

export function TabletLinkSheet({ child, onClose }) {
  const n = firstName(child.name);
  const [link, setLink] = useState('');
  const [tablets, setTablets] = useState([]);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  const loadTablets = () => listChildTablets(child.id).then(setTablets).catch(() => setTablets([]));
  useEffect(() => {
    createChildLink(child.id).then(setLink).catch(() => setErr("The link couldn't be made just now. Check your connection and try again."));
    loadTablets();
  }, [child.id]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* the link is on screen */ }
  };
  const off = async (t) => {
    if (!window.confirm(`Switch off this tablet? It will stop opening ${n}'s practice.`)) return;
    try { await switchOffTablet(t.device_uid); loadTablets(); } catch { setErr("That tablet couldn't be switched off. Please try again."); }
  };
  const wa = `https://wa.me/?text=${encodeURIComponent(`Open this on ${n}'s tablet to start Tutagora practice: ${link}`)}`;

  return (
    <div className="tg-modal" onClick={onClose}>
      <div className="tg sheet" role="dialog" aria-label={`Open on ${n}'s tablet`} onClick={e => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
        </button>
        <div className="kicker muted">{n}'s tablet</div>
        <h2 className="display">Open on {n}'s tablet</h2>
        <p className="muted" style={{ margin: '0 0 16px', fontWeight: 600 }}>
          Send this link to the tablet and open it there. It goes straight into {n}'s practice. No Google account or password on the tablet, and nothing that costs money.
        </p>
        {err && <div className="msg err">{err}</div>}
        {link ? (
          <div className="stack">
            <a className="btn full" href={wa} target="_blank" rel="noreferrer">Send by WhatsApp <SiteIcon name="arrow" /></a>
            <button type="button" className="btn line full" onClick={copy}>{copied ? 'Copied' : 'Copy the link'}</button>
            <p className="fine" style={{ margin: 0 }}>The link works once, within 24 hours. You can make a new one any time.</p>
          </div>
        ) : !err && <p className="muted">Making the link…</p>}

        {tablets.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div className="kicker muted" style={{ marginBottom: 8 }}>Tablets open on {n}'s practice</div>
            {tablets.map((t, i) => (
              <div key={t.device_uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: '1px solid rgba(0,0,0,.08)' }}>
                <span style={{ fontWeight: 600 }}>Tablet {i + 1} <span className="muted">· since {day(t.created_at)}</span></span>
                <button type="button" className="linkbtn" onClick={() => off(t)}>Switch off</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const TROUBLE = {
  link_used: 'This link has already been used. Ask your parent to send a new one from their Tutagora dashboard.',
  link_expired: 'This link is more than a day old. Ask your parent to send a new one from their Tutagora dashboard.',
  link_not_found: "This link doesn't work. Ask your parent to send a new one from their Tutagora dashboard.",
  not_enabled: "Tablet links aren't switched on yet. Please try again later.",
  failed: "The tablet couldn't be set up just now. Check the internet connection and try again.",
};

export function TabletLinkPage({ token, onReady, onLeave }) {
  useHorebLook();
  const [state, setState] = useState('ask'); // ask | busy | trouble
  const [code, setCode] = useState('');
  const go = async () => {
    setState('busy');
    try { onReady(await openChildLink(token)); }
    catch (e) { setCode(e.code || 'failed'); setState('trouble'); }
  };
  return (
    <div className="min-h-screen app-shell text-slate-900" style={{ background: 'linear-gradient(180deg,#ecedfa,#eef0f2)' }}>
      <div className="app-scroll">
        <div className="max-w-md mx-auto px-5 pt-16 pb-16 flex flex-col items-center text-center gap-4">
          <HorebBot size={96} mood={state === 'trouble' ? 'thinking' : 'cheer'} />
          {state === 'trouble' ? (
            <>
              <Eyebrow tone="text-[#c0663f]">Not set up</Eyebrow>
              <p className="text-[17px] font-semibold">{TROUBLE[code] || TROUBLE.failed}</p>
              {code === 'failed' && <PrimaryButton onClick={go}>Try again</PrimaryButton>}
              <button onClick={onLeave} className="text-sm font-semibold text-slate-500 underline underline-offset-4">Go to Tutagora</button>
            </>
          ) : (
            <>
              <Eyebrow tone="text-[#6d6fcb]">Tutagora</Eyebrow>
              <h1 className="text-[27px] font-extrabold tracking-tight leading-tight">Set up this tablet for practice</h1>
              <p className="text-slate-500">This tablet will open straight into your child's maths practice every time. Anyone signed in to Tutagora on it will be signed out.</p>
              <PrimaryButton onClick={go} disabled={state === 'busy'}>{state === 'busy' ? 'Setting up…' : 'Set up this tablet'}</PrimaryButton>
              <Card className="text-left w-full">
                <p className="text-[13.5px] text-slate-500">The parent can switch this tablet off any time from their Tutagora dashboard.</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
