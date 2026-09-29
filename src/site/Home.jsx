import React, { useMemo, useState } from 'react';
import { HALF_HOUR_LESSONS } from './features.js';
import { SKILLS } from '../ai-tutor/knowledgeGraph.js';
import { SiteNav, SiteFooter, SiteIcon, StandIn, TutorPhoto, shortName, tutorSubjects, gradeLevels, ksh, photoFirst } from './ui.jsx';

// Real photos for the hero scrapbook go in public/images/home/ and are listed
// here. Until then the drawn stand-ins show, with no invented names.
const SCRAPBOOK = [
  { src: null, cap: 'Learner, Grade 6' },
  { src: null, cap: 'Learner, Grade 4' },
  { src: null, cap: 'Learner, Grade 10' },
  { src: null, cap: 'Learner, Grade 8' },
];

const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const BANDS = [
  { label: 'Grade 1–3', lo: 1, hi: 3, d: 'Counting, place value, first adding and taking away' },
  { label: 'Grade 4–6', lo: 4, hi: 6, d: 'Times tables, fractions, long division, decimals' },
  { label: 'Grade 7–9', lo: 7, hi: 9, d: 'Algebra begins, ratio, geometry, junior school' },
  { label: 'Grade 10–12', lo: 10, hi: 12, d: 'Quadratics, graphs, statistics, exam readiness' },
];

const Snap = ({ pos, i, item }) => (
  <div className={`snap ${pos}`}>
    <div className="img">{item.src ? <img src={item.src} alt="" /> : <StandIn n={i} />}</div>
    <span className="cap">{item.cap}</span>
  </div>
);

export default function Home({ onNavigate, onSignIn, onStartCheck, user, tutors = [] }) {
  const [grade, setGrade] = useState(6);
  const [need, setNeed] = useState('maths');

  const skillCount = Object.keys(SKILLS).length;
  const bandCounts = useMemo(() => BANDS.map(b => Object.values(SKILLS).filter(s => s.grade >= b.lo && s.grade <= b.hi).length), []);
  const featured = useMemo(() => [...tutors]
    .sort((a, b) => photoFirst(a, b) || (b.lessons_completed || 0) - (a.lessons_completed || 0))
    .slice(0, 4), [tutors]);

  const go = (e) => {
    e.preventDefault();
    if (need === 'tutor') onNavigate('tutors');
    else if (need === 'writing') onNavigate('writing');
    else onStartCheck(grade);
  };

  return (
    <div className="tg">
      <header className="hero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} />
        <div className="in hero-in">
          <div>
            <h1 className="display">No child is bad at maths. They're missing one step.</h1>
            <p className="lead">A free 10-minute check finds <b>the exact step</b> your child is missing. Then 15 minutes a day rebuilds everything that stands on it.</p>
            <form className="finder" onSubmit={go}>
              <label><span>My child is in</span>
                <select value={grade} onChange={e => setGrade(Number(e.target.value))} aria-label="Your child's grade">
                  {GRADE_OPTIONS.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </label>
              <label><span>Help with</span>
                <select value={need} onChange={e => setNeed(e.target.value)} aria-label="What they need help with">
                  <option value="maths">Maths</option>
                  <option value="writing">Writing</option>
                  <option value="tutor">A live tutor</option>
                </select>
              </label>
              <button className="btn" type="submit">{need === 'tutor' ? 'Find a tutor' : need === 'writing' ? 'Start writing' : 'Start free check'} <SiteIcon name="arrow" /></button>
            </form>
            <div className="below">
              <span><SiteIcon name="check" />Free, no card</span>
              <span><SiteIcon name="check" />CBC and Cambridge, Grade 1 to 12</span>
              <span><SiteIcon name="check" />Any phone</span>
            </div>
          </div>
          <div className="book" aria-hidden="true">
            <Snap pos="a" i={0} item={SCRAPBOOK[0]} />
            <Snap pos="b" i={1} item={SCRAPBOOK[1]} />
            <Snap pos="c" i={2} item={SCRAPBOOK[2]} />
            <Snap pos="d" i={3} item={SCRAPBOOK[3]} />
            <div className="stk s1">Found it: fractions<small>the one missing step</small></div>
            <div className="stk s2">4 days in a row</div>
            <div className="stk s3">Checked by Tutagora</div>
          </div>
        </div>
      </header>

      <section className="proof" aria-label="Tutagora in numbers"><div className="in">
        <div className="s"><b>{skillCount}</b><span>maths skills mapped, Grade 1 to 12</span></div>
        <div className="s"><b>10 min</b><span>for the free check</span></div>
        <div className="s"><b>15 min</b><span>a day of practice</span></div>
        <div className="s"><b>KSh 0</b><span>to start</span></div>
      </div></section>

      <section className="sec"><div className="in">
        <div className="head-row">
          <div><div className="kicker">Start where your child is</div><h2 className="display" style={{ marginTop: 10 }}>Pick their grade.</h2></div>
          <p className="sub" style={{ margin: 0 }}>Every band is mapped skill by skill, so the check knows what should come before what.</p>
        </div>
        <div className="tiles">
          {BANDS.map((b, i) => (
            <button key={b.label} type="button" className="tile" onClick={() => onStartCheck(null)}>
              <span className="g">{b.label}</span><span className="d">{b.d}</span>
              <span className="row">{bandCounts[i]} skills<SiteIcon name="arrow" /></span>
            </button>
          ))}
        </div>
      </div></section>

      <section className="sec tight"><div className="in">
        <div className="hiw">
          <div>
            <div className="kicker">How it works</div>
            <h2 className="display" style={{ marginTop: 10 }}>Find the step. Fix the step. Move on.</h2>
            <p className="sub">Most children who "hate maths" are stuck on one skill from years back. The check finds it in ten minutes, and the daily plan starts right there.</p>
            <button type="button" className="btn" onClick={() => onStartCheck(grade)}>Start free check <SiteIcon name="arrow" /></button>
          </div>
          <figure className="art">
            <div className="pic"><img src="/images/home/lesson-windows.webp" width="1035" height="690" alt="Illustration of two smiling children in lesson windows, with a set square and study cards" /></div>
            <div className="stk">Found it: adding fractions<small>Grade 4 skill, 10 minutes</small></div>
            <div className="stk two">Day 5 of 5</div>
          </figure>
        </div>
        <div className="steps">
          <div className="st"><div className="n">01</div><h3>The free check</h3><p>Ten minutes of questions that adapt as your child answers. It starts easy, so the first answers are right.</p><span className="tag">Free · no account</span></div>
          <div className="st"><div className="n">02</div><h3>15 minutes a day</h3><p>A daily plan: reviews first, then one new skill. It has an end, so your child knows when they're done.</p><span className="tag">Phone or tablet</span></div>
          <div className="st"><div className="n">03</div><h3>A tutor for the stuck part</h3><p>If one skill won't click, book a live lesson with a tutor for exactly that skill.</p><span className="tag">Pay with M-Pesa</span></div>
        </div>
      </div></section>

      <section className="sec dark"><div className="in">
        <div>
          <div className="kicker" style={{ color: '#c9c9d3' }}>Every Sunday</div>
          <h2 className="display" style={{ marginTop: 10 }}>Know how the week went. No app to open.</h2>
          <p className="sub">One WhatsApp or SMS per child: days practised, skills mastered, what's hard, and how their goal is going.</p>
          <button type="button" className="btn" onClick={() => onStartCheck(grade)}>Start with the free check</button>
        </div>
        <div className="phone" aria-label="Example Sunday report">
          <div className="who"><i />Tutagora</div>
          <div className="bubble"><b>Amani's week on Tutagora</b><br />Practised maths 4 of 7 days.<br />Mastered 2 skills: Long Division and Equivalent Fractions.<br />Finding hard: Adding Fractions. A session with a tutor usually clears this.<br />Goal: 4 of 5 days towards "Trip to the park".<div className="time">Example</div></div>
        </div>
      </div></section>

      <section className="sec safe"><div className="in safe-row">
        <figure className="art">
          <div className="pic"><img src="/images/home/hand-over.webp" width="736" height="920" alt="A laptop on a sunlit desk with chalk drawings of two children around it" /></div>
          <div className="stk">Their space. Your PIN.</div>
        </figure>
        <div>
        <div className="kicker">Made for family phones</div>
        <h2 className="display" style={{ margin: '10px 0 30px' }}>Hand over the phone. Relax.</h2>
        <div className="grid">
          <div className="it"><b>Their own space</b><span>No payments, tutor booking or messages. Your PIN to leave.</span></div>
          <div className="it"><b>Their own tablet</b><span>Set it up once. It opens straight into their space.</span></div>
          <div className="it"><b>Right for their age</b><span>A friendly buddy for Grade 1 to 8. A straight-talking plan for 9 to 12.</span></div>
          <div className="it"><b>Goals you agree</b><span>"5 days this week, then a trip to the park."</span></div>
        </div>
        </div>
      </div></section>

      {featured.length > 0 && (
        <section className="sec tutorband"><div className="in">
          <div className="head-row">
            <div><div className="kicker">When practice isn't enough</div><h2 className="display" style={{ marginTop: 10 }}>Tutors we've checked ourselves.</h2></div>
            <button type="button" className="btn line" onClick={() => onNavigate('tutors')}>See all tutors <SiteIcon name="arrow" /></button>
          </div>
          <div className="tutors">
            {featured.map(t => (
              <button type="button" key={t.id} className="tc" onClick={() => onNavigate('tutors', t)}>
                <div className="pic"><TutorPhoto tutor={t} /><span className="badge"><SiteIcon name="check" />Checked</span></div>
                <div className="nm">{shortName(t.profiles?.full_name)}</div>
                <div className="sb">{tutorSubjects(t).slice(0, 2).join(' and ')}{gradeLevels(t.grade_levels).length ? ` · ${gradeLevels(t.grade_levels)[0]}${gradeLevels(t.grade_levels).length > 1 ? ' +' : ''}` : ''}</div>
                <div className="foot"><span>{ksh(t.hourly_rate)} <small>/ hour</small></span><span className="btn sm">Book</span></div>
              </button>
            ))}
          </div>
          <span className="swipe-hint">Swipe for more tutors</span>
        </div></section>
      )}

      <section className="sec tight"><div className="in duo signpost">
        <div className="c t"><div className="kicker">For tutors</div><h3>Teach on Tutagora</h3><p>Set your hours and your rate. Families find you, pay through M-Pesa, and join you in the app.</p><button type="button" className="btn" onClick={() => onNavigate('teach')}>Apply to teach</button></div>
        <div className="c s"><div className="kicker">For schools</div><h3>Every learner's real level</h3><p>Each learner is mapped skill by skill, so teachers can target the gaps. KSh 50 per learner per term.</p><button type="button" className="btn" onClick={() => onNavigate('schools')}>See how it works</button></div>
      </div></section>

      <section className="sec tight"><div className="in">
        <h2 className="display" style={{ marginBottom: 30 }}>Questions parents ask</h2>
        <div className="faq">
          <details open><summary>Is the check really free?</summary><p>Yes. The check and the plan it gives you are free, and daily practice is free right now too. Tutor lessons are paid per lesson.</p></details>
          <details><summary>Do I need an account?</summary><p>Not to take the check. To save the result and the plan, you create a free account with Google or your email.</p></details>
          <details><summary>Is it safe to hand my phone to my child?</summary><p>Yes. Your child gets their own space with no payments or messages, and leaving it needs your PIN.</p></details>
          <details><summary>Which grades and curriculum?</summary><p>CBC Grade 1 to 12, plus Cambridge. Maths first; composition and insha writing too.</p></details>
          <details><summary>How do tutor lessons work?</summary><p>Pick a tutor and a time. Lessons are an hour{HALF_HOUR_LESSONS ? ', and some tutors also offer 30 minutes' : ''}. Pay with M-Pesa or card. The lesson happens live inside Tutagora.</p></details>
        </div>
      </div></section>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}
