import React, { useState } from 'react';
import { SiteNav, SiteFooter, SiteIcon } from './ui.jsx';

// "Teach with us" on the public site's design. Figures are Tutagora's own
// policies (15% platform fee, Friday M-Pesa payouts); nothing invented.
const FEE = 15;

const PROVIDE = [
  ['video', 'Video lessons', 'Built-in video calls with screen sharing and a whiteboard'],
  ['wallet', 'Payments', 'Families pay by M-Pesa or card before the lesson'],
  ['calendar', 'Scheduling', 'Families book only the times you open'],
  ['chart', 'Dashboard', 'Your lessons, students and earnings in one place'],
  ['bell', 'Alerts', 'A message the moment a lesson is booked'],
  ['star', 'Reviews', 'Families review you after real, paid lessons'],
  ['users', 'Group classes', 'Run group sessions as well as one-to-one'],
  ['shield', 'Checked badge', 'Shown on your profile once we verify you'],
];

export default function Teach({ onNavigate, onSignIn, onApply, user }) {
  const [rate, setRate] = useState(1000);
  const [hours, setHours] = useState(10);
  const weekly = Math.round((Number(rate) || 0) * (Number(hours) || 0) * (100 - FEE) / 100);
  const monthly = weekly * 4;

  return (
    <div className="tg t-indigo">
      <header className="hero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} />
        <div className="in hero-in" style={{ paddingBottom: 70 }}>
          <div>
            <div className="kicker">For tutors</div>
            <h1 className="display" style={{ marginTop: 12 }}>Teach the one step a child is missing.</h1>
            <p className="lead">Families arrive knowing exactly which skill is stuck. You set your hours and your rate, teach live inside Tutagora, and get paid every Friday by M-Pesa.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={onApply}>Apply to teach <SiteIcon name="arrow" /></button>
              <a className="btn line" href="#earnings">What could I earn?</a>
            </div>
          </div>
          <div className="found" style={{ maxWidth: 440, justifySelf: 'end', width: '100%' }} aria-label="Example booking">
            <div className="kicker">New booking</div>
            <b>Amani · Grade 6</b>
            <span>Maths, 1 hour, Thursday 5:00 pm</span>
            <div style={{ marginTop: 14, background: 'rgba(255,255,255,.1)', borderRadius: 6, padding: '10px 12px', fontWeight: 600 }}>
              Focus: equivalent fractions (from the Tutagora check)
            </div>
          </div>
        </div>
      </header>

      <section className="proof" aria-label="Teaching on Tutagora in numbers"><div className="in">
        <div className="s"><b>{100 - FEE}%</b><span>of each lesson is yours</span></div>
        <div className="s"><b>Fridays</b><span>payouts by M-Pesa</span></div>
        <div className="s"><b>You</b><span>set your rate and hours</span></div>
        <div className="s"><b>KSh 0</b><span>to join</span></div>
      </div></section>

      <section className="sec"><div className="in">
        <div className="kicker">Why teach here</div>
        <h2 className="display" style={{ margin: '8px 0 30px' }}>You teach. We bring the families.</h2>
        <div className="steps">
          <div className="st"><div className="n"><SiteIcon name="target" /></div><h3>They know what's stuck</h3><p>Many families take the free check first, so the booking arrives with the exact skill to work on. No guessing in the first ten minutes.</p></div>
          <div className="st"><div className="n"><SiteIcon name="calendar" /></div><h3>Your hours, your rate</h3><p>Open the times that suit you. Lessons are an hour, and you can also offer 30-minute sessions for a single skill.</p></div>
          <div className="st"><div className="n"><SiteIcon name="wallet" /></div><h3>Paid every Friday</h3><p>Families pay before the lesson. You keep {100 - FEE}% and it arrives by M-Pesa each Friday.</p></div>
        </div>
      </div></section>

      <section className="sec tight"><div className="in">
        <div className="kicker">How to start</div>
        <h2 className="display" style={{ margin: '8px 0 30px' }}>Three steps to your first lesson.</h2>
        <div className="steps">
          <div className="st"><div className="n">01</div><h3>Create your profile</h3><p>Your subjects, grades, rate and a short bio that tells parents how you teach. Add a clear photo of yourself.</p><span className="tag">About 10 minutes</span></div>
          <div className="st"><div className="n">02</div><h3>Get checked</h3><p>Upload your ID and a teaching certificate or qualification. Our team reviews every application to keep children safe.</p><span className="tag">Usually within 24 hours</span></div>
          <div className="st"><div className="n">03</div><h3>Teach and earn</h3><p>Families book your open times. Teach one-to-one inside Tutagora with video, screen sharing and a whiteboard.</p><span className="tag">Paid Fridays</span></div>
        </div>
      </div></section>

      <section className="sec dark" id="earnings"><div className="in">
        <div>
          <div className="kicker" style={{ color: '#c9c9d3' }}>Earnings</div>
          <h2 className="display" style={{ marginTop: 10 }}>What could you earn?</h2>
          <p className="sub">Your rate times your hours, less our {FEE}% fee. Move the numbers to see.</p>
        </div>
        <div className="phone" style={{ transform: 'none', background: '#fff', color: 'var(--ink)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label className="fsel"><span>Your hourly rate (KSh)</span><input type="number" min="0" step="100" inputMode="numeric" value={rate} onChange={e => setRate(e.target.value)} /></label>
            <label className="fsel"><span>Hours a week</span><input type="number" min="0" max="60" inputMode="numeric" value={hours} onChange={e => setHours(e.target.value)} /></label>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="kicker muted" style={{ fontSize: 12 }}>You'd take home about</div>
            <div className="big" style={{ margin: '6px 0 4px' }}>KSh {monthly.toLocaleString('en-KE')}</div>
            <div style={{ fontWeight: 700, color: 'var(--ink2)' }}>a month (4 weeks) · KSh {weekly.toLocaleString('en-KE')} a week</div>
          </div>
          <p className="fine" style={{ margin: '14px 0 0' }}>An estimate. What you earn depends on your rate and how many lessons families book.</p>
        </div>
      </div></section>

      <section className="sec"><div className="in">
        <h2 className="display" style={{ marginBottom: 26 }}>We handle the rest.</h2>
        <div className="safe"><div className="grid">
          {PROVIDE.map(([icon, t, d]) => (
            <div key={t} className="it"><SiteIcon name={icon} style={{ width: 26, height: 26, marginBottom: 10 }} /><b>{t}</b><span>{d}</span></div>
          ))}
        </div></div>
      </div></section>

      <section className="sec tight"><div className="in">
        <h2 className="display" style={{ marginBottom: 26 }}>Questions tutors ask</h2>
        <div className="faq">
          <details open><summary>How much do I keep?</summary><p>You set your own hourly rate. Tutagora keeps a {FEE}% platform fee and you keep {100 - FEE}%.</p></details>
          <details><summary>When do I get paid?</summary><p>Payouts go out every Friday by M-Pesa. You can see your earnings and payout history in your tutor dashboard.</p></details>
          <details><summary>What documents do I need?</summary><p>A national ID or passport, and a teaching certificate or relevant qualification (degree, diploma or professional certificate).</p></details>
          <details><summary>Do I have to offer 30-minute lessons?</summary><p>No. Lessons are an hour unless you switch on 30-minute lessons in your profile. They're priced at half your hourly rate.</p></details>
          <details><summary>What equipment do I need?</summary><p>A smartphone or laptop with a stable internet connection. Lessons happen inside Tutagora.</p></details>
          <details><summary>Can I teach more than one subject?</summary><p>Yes. Add every subject and grade you're qualified to teach.</p></details>
        </div>
      </div></section>

      <section className="sec tight"><div className="in duo">
        <div className="c t"><div className="kicker">Ready?</div><h3>Apply to teach</h3><p>Set up your profile in about ten minutes. We'll review it and let you know by email.</p><button type="button" className="btn" onClick={onApply}>Apply now</button></div>
        <div className="c s"><div className="kicker">Questions first?</div><h3>Talk to us</h3><p>WhatsApp 0759 240 692 or email tutaeducators@gmail.com.</p><a className="btn" href="https://wa.me/254759240692?text=Hi%20Tutagora%2C%20I%27d%20like%20to%20teach" target="_blank" rel="noreferrer"><SiteIcon name="chat" />WhatsApp us</a></div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
