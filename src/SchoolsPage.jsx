// ============================================================================
// FOR SCHOOLS — the B2B page (route: /schools). Two products from Tutagora:
// the school management software (school.tutagora.com, teal, leads: it is the
// bigger product) and HOREB, the maths check with the teacher view (KSh 50
// per learner per term). HOREB is being built into the software's record.
// ============================================================================

import React, { useState } from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './site/ui.jsx';

const WA = 'https://wa.me/254759240692?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20demo%20for%20my%20school';
const WA_SOFTWARE = 'https://wa.me/254759240692?text=Hello%20Tutagora.%20I%20would%20like%20to%20talk%20about%20using%20Tutagora%20at%20my%20school.';
const SOFTWARE = 'https://school.tutagora.com/';

// What the school software does, in the words of school.tutagora.com.
// Each card has its own colour and icon.
const SOFTWARE_POINTS = [
  ['Fees on M-Pesa', 'Every payment matches its invoice on arrival and posts to the books.', 'wallet', 'c-green'],
  ['Parents on WhatsApp', 'Balance, a Pay button, the statement and the report card. No app to install.', 'chat', 'c-blue'],
  ['HR and payroll', 'Every member of staff, from the head teacher to the driver, on one record.', 'users', 'c-purple'],
  ['Timetables, exams and report cards', 'From the term\'s plan to a single mark.', 'calendar', 'c-orange'],
  ['The Advisor', 'A plain-language brief on WhatsApp every Monday. It drafts; people decide.', 'bell', 'c-pink'],
];
const MAIL = 'mailto:hello@tutagora.com?subject=Tutagora%20for%20Schools%20%E2%80%94%20demo%20request';
const PER_LEARNER = 50;

// An example of the teacher's screen. Names and gaps are illustrative.
const EXAMPLE = [
  { n: 'Otieno W.', gaps: ['Equivalent fractions', 'Multiples', 'Long division'] },
  { n: 'Chebet R.', gaps: ['Place value to 10,000', 'Decimals intro'] },
  { n: 'Musa A.', gaps: ['Times tables 6–9', 'Equivalent fractions'] },
];

// The page scrolls inside the app's container, so a plain #link does nothing.
const jumpTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

export default function SchoolsPage({ onNavigate, onSignIn, user }) {
  const [size, setSize] = useState(300);
  const total = Math.max(0, Number(size) || 0) * PER_LEARNER;

  return (
    <div className="tg t-teal">
      <header className="shero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn || (() => onNavigate('dashboard'))} user={user} current="schools" />
        <div className="in one">
          <div>
            <div className="kicker">For schools · CBC and Cambridge, Grade 1 to 12</div>
            <h1 className="display" style={{ marginTop: 12 }}>Run your school. Know every learner.</h1>
            <p className="lead">Two tools from Tutagora: the software that keeps the whole school on one record, and a maths check that shows each learner's real level.</p>
          </div>
          <div className="choose">
            <a className="pick" href={SOFTWARE} target="_blank" rel="noreferrer">
              <span className="ico c-teal"><SiteIcon name="gear" /></span>
              <span className="kicker">School software</span>
              <b>Run your school</b>
              <span>Fees, parents, staff, report cards and the books, on one record.</span>
              <span className="go">See the software <SiteIcon name="arrow" /></span>
            </a>
            <a className="pick" href="#horeb" onClick={jumpTo('horeb')}>
              <span className="ico c-indigo"><SiteIcon name="target" /></span>
              <span className="kicker">HOREB maths check</span>
              <b>Know each learner's level</b>
              <span>Which foundations each learner is missing, and what to do tomorrow.</span>
              <span className="go">See HOREB <SiteIcon name="arrow" /></span>
            </a>
          </div>
        </div>
      </header>

      <section className="sec soft-sec" id="software"><div className="in">
        <div className="kicker">Tutagora school software</div>
        <h2 className="display" style={{ margin: '8px 0 14px' }}>One record for the whole school.</h2>
        <p className="sub">Built in Kenya for private primary and secondary schools and school groups. Learners, staff, fees, lessons and marks in one place, so every part of the school knows the rest.</p>
        <div className="points">
          {SOFTWARE_POINTS.map(([t, d, icon, c]) => (
            <div key={t} className={c}><span className="ico"><SiteIcon name={icon} /></span><b>{t}</b><span>{d}</span></div>
          ))}
        </div>
        <p className="price-note">A flat licence per term, per branch, with no charge per user. Set up in an afternoon from the spreadsheet you already have.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn teal" href={SOFTWARE} target="_blank" rel="noreferrer">See the software<SiteIcon name="arrow" /></a>
          <a className="btn line" href={WA_SOFTWARE} target="_blank" rel="noreferrer"><SiteIcon name="chat" />Talk to us on WhatsApp</a>
        </div>
      </div></section>

      <section className="sec link-strip"><div className="in">
        <div className="joined">
          <div className="kicker">Better together</div>
          <p>HOREB is being built into the school record. Each learner's maths level will sit beside their fees, attendance and report card, so a head sees who is struggling and why in one place.</p>
        </div>
      </div></section>

      <section className="sec horeb" id="horeb"><div className="in horeb-in">
        <div>
          <div className="kicker">HOREB maths check</div>
          <h2 className="display" style={{ margin: '8px 0 14px' }}>See every learner's real level. Skill by skill.</h2>
          <p className="sub">One lesson on the school's tablets, and you know exactly which foundations each learner is missing, and what to do about it tomorrow.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn" href={WA} target="_blank" rel="noreferrer"><SiteIcon name="chat" />Book a HOREB demo</a>
            <a className="btn line" href="#pricing" onClick={jumpTo('pricing')}>See pricing</a>
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
      </div></section>

      <section className="sec tight"><div className="in">
        <div className="kicker">How HOREB works</div>
        <h2 className="display" style={{ margin: '8px 0 30px' }}>Set up in one lesson. Useful the next morning.</h2>
        <div className="steps">
          <div className="st"><span className="ico c-indigo"><SiteIcon name="users" /></span><div className="n">01</div><h3>Create a class</h3><p>You get a join code. Learners type it once on a school tablet or on their phone at home.</p></div>
          <div className="st"><span className="ico c-indigo"><SiteIcon name="target" /></span><div className="n">02</div><h3>Learners take the check</h3><p>About 10 minutes each. It adapts to every learner, so nobody sits through work that's too easy or too hard.</p></div>
          <div className="st"><span className="ico c-indigo"><SiteIcon name="chart" /></span><div className="n">03</div><h3>You see the gaps</h3><p>Who's stuck, on which foundation, with a 5-minute classroom move for each. Daily practice then closes the gaps.</p></div>
        </div>
      </div></section>

      <section className="sec tight" id="pricing"><div className="in">
        <h2 className="display" style={{ marginBottom: 26 }}>HOREB pricing</h2>
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
          <details open><summary>What is the difference between the software and HOREB?</summary><p>The school software runs the school: admissions, fees, parents, staff, timetables, exams and the books. HOREB is the maths check and daily practice, with a teacher view of each learner's gaps. Each works on its own, and HOREB is being built into the software's record.</p></details>
          <details><summary>What devices do learners need?</summary><p>Any phone or tablet with a browser. Many schools use a shared set of tablets for the check and let learners practise at home.</p></details>
          <details><summary>Does it follow the CBC?</summary><p>Yes. 276 maths skills from Grade 1 to 12 are mapped to the CBC, plus Cambridge.</p></details>
          <details><summary>Can we see it first?</summary><p>Yes. Book a demo and we'll set up one class, so you see it with your own learners before you decide.</p></details>
          <details><summary>How do we get in touch?</summary><p>WhatsApp 0759 240 692, or email <a href={MAIL}>hello@tutagora.com</a>.</p></details>
        </div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
