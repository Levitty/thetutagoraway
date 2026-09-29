// ============================================================================
// FOR SCHOOLS — the B2B page (route: /schools), on the public site's coral
// design. Leads with the teacher's view, then setup in three steps, pricing
// with a calculator, and questions. A school pays KSh 50 per learner per term
// for the class layer; learning stays free for individual learners.
// ============================================================================

import React, { useState } from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './site/ui.jsx';

const WA = 'https://wa.me/254759240692?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20demo%20for%20my%20school';
const MAIL = 'mailto:hello@tutagora.com?subject=Tutagora%20for%20Schools%20%E2%80%94%20demo%20request';
const PER_LEARNER = 50;

// An example of the teacher's screen. Names and gaps are illustrative.
const EXAMPLE = [
  { n: 'Otieno W.', gaps: ['Equivalent fractions', 'Multiples', 'Long division'] },
  { n: 'Chebet R.', gaps: ['Place value to 10,000', 'Decimals intro'] },
  { n: 'Musa A.', gaps: ['Times tables 6–9', 'Equivalent fractions'] },
];

export default function SchoolsPage({ onNavigate, onSignIn, user }) {
  const [size, setSize] = useState(300);
  const total = Math.max(0, Number(size) || 0) * PER_LEARNER;

  return (
    <div className="tg t-indigo">
      <header className="shero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn || (() => onNavigate('dashboard'))} user={user} current="schools" />
        <div className="in">
          <div>
            <div className="kicker">For schools · CBC and Cambridge, Grade 1 to 12</div>
            <h1 className="display" style={{ marginTop: 12 }}>See every learner's real level. Skill by skill.</h1>
            <p className="lead">One lesson on the school's tablets, and you know exactly which foundations each learner is missing, and what to do about it tomorrow.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn" href={WA} target="_blank" rel="noreferrer"><SiteIcon name="chat" />Book a demo on WhatsApp</a>
              <a className="btn line" href="#pricing">See pricing</a>
            </div>
          </div>
          <div className="dash" aria-label="Example of the teacher view">
            <div className="top"><b>Grade 6 Blue · example class</b><span className="code-pill">Join code K7M4Q</span></div>
            <div className="kpis">
              <div><b>38</b><span>Learners</span></div>
              <div><b>G5</b><span>Avg level</span></div>
              <div><b>9</b><span>Need support</span></div>
              <div><b>6</b><span>Racing ahead</span></div>
            </div>
            <div className="kicker" style={{ fontSize: 11.5, color: 'var(--mute)', marginBottom: 4 }}>Who's stuck</div>
            {EXAMPLE.map(r => (
              <div key={r.n} className="stuck"><b>{r.n}</b><span className="move">5-min move ready</span><div className="gaps">{r.gaps.map(g => <span key={g}>{g}</span>)}</div></div>
            ))}
          </div>
        </div>
      </header>

      <section className="sec"><div className="in">
        <div className="kicker">How it works</div>
        <h2 className="display" style={{ margin: '8px 0 30px' }}>Set up in one lesson. Useful the next morning.</h2>
        <div className="steps">
          <div className="st"><div className="n">01</div><h3>Create a class</h3><p>You get a join code. Learners type it once on a school tablet or on their phone at home.</p></div>
          <div className="st"><div className="n">02</div><h3>Learners take the check</h3><p>About 10 minutes each. It adapts to every learner, so nobody sits through work that's too easy or too hard.</p></div>
          <div className="st"><div className="n">03</div><h3>You see the gaps</h3><p>Who's stuck, on which foundation, with a 5-minute classroom move for each. Daily practice then closes the gaps.</p></div>
        </div>
      </div></section>

      <section className="sec tight" id="pricing"><div className="in">
        <h2 className="display" style={{ marginBottom: 26 }}>Simple pricing</h2>
        <div className="pricebox">
          <div className="a">
            <div className="kicker" style={{ opacity: .7 }}>Per learner</div>
            <div className="big" style={{ marginTop: 10 }}>KSh {PER_LEARNER}</div>
            <div style={{ fontWeight: 700, opacity: .8, marginTop: 6 }}>per learner, per term</div>
            <ul>
              <li><SiteIcon name="check" />The check and daily practice for every learner</li>
              <li><SiteIcon name="check" />The teacher view for every class</li>
              <li><SiteIcon name="check" />Learners keep practising at home</li>
            </ul>
          </div>
          <div className="b">
            <div className="kicker muted">Your school</div>
            <div className="calc"><label htmlFor="school-size">Learners</label><input id="school-size" className="inp" type="number" min="1" inputMode="numeric" value={size} onChange={e => setSize(e.target.value)} /></div>
            <div className="big" style={{ marginTop: 16 }}>KSh {total.toLocaleString('en-KE')}</div>
            <div style={{ fontWeight: 700, color: 'var(--ink2)', marginTop: 6 }}>per term</div>
            <a className="btn" style={{ marginTop: 18 }} href={WA} target="_blank" rel="noreferrer">Talk to us</a>
          </div>
        </div>
      </div></section>

      <section className="sec tight"><div className="in">
        <h2 className="display" style={{ marginBottom: 24 }}>Questions schools ask</h2>
        <div className="faq">
          <details open><summary>What devices do learners need?</summary><p>Any phone or tablet with a browser. Many schools use a shared set of tablets for the check and let learners practise at home.</p></details>
          <details><summary>Does it follow the CBC?</summary><p>Yes. 276 maths skills from Grade 1 to 12 are mapped to the CBC, plus Cambridge.</p></details>
          <details><summary>Can we see it first?</summary><p>Yes. Book a demo and we'll set up one class, so you see it with your own learners before you decide.</p></details>
          <details><summary>How do we get in touch?</summary><p>WhatsApp 0759 240 692, or email <a href={MAIL}>hello@tutagora.com</a>.</p></details>
        </div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
