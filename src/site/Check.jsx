import React, { useMemo, useState } from 'react';
import { loadLocalProgress } from '../ai-tutor/progressStore.js';
import { findMissingStep, skillLabel } from './missingStep.js';
import { SiteIcon, Logo } from './ui.jsx';

// The free check runs HOREB as a guest: progress lives on this device only,
// under the base local key, until the parent saves it to an account.
const CHECK_KEY = 'tg_check';           // { name, grade, startedAt }
export const SAVE_FLAG = 'tg_check_save'; // set when the parent taps "Save the plan"
export const FOCUS_KEY = 'tg_focus';      // { skill, learner } carried into tutor search

const read = (k, store = localStorage) => { try { return JSON.parse(store.getItem(k) || 'null'); } catch { return null; } };
const write = (k, v, store = localStorage) => { try { store.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };

export const getCheck = () => read(CHECK_KEY);
export const getGuestProgress = () => loadLocalProgress(undefined);
export const clearGuestCheck = () => {
  try { localStorage.removeItem('tutagora_ai_v2'); localStorage.removeItem(CHECK_KEY); localStorage.removeItem(SAVE_FLAG); } catch { /* ignore */ }
};
export const getFocus = () => read(FOCUS_KEY, sessionStorage);
export const setFocus = (v) => { if (v) write(FOCUS_KEY, v, sessionStorage); else { try { sessionStorage.removeItem(FOCUS_KEY); } catch { /* ignore */ } } };

// The school's curriculum. The parent must choose; there is no default.
const CURRICULA = [
  { id: 'cbc', name: 'CBC / CBE', note: 'Most Kenyan public and private schools' },
  { id: 'cambridge', name: 'Cambridge', note: 'International schools' },
];

const FlowBar = ({ label, onLeave }) => (
  <div className="flowbar"><div className="in">
    <Logo onClick={onLeave} />
    <span className="step">{label}</span>
    <button type="button" className="x" onClick={onLeave}><SiteIcon name="x" />Leave</button>
  </div></div>
);

// Step 1: who is taking it, and which grade. Then hand the phone over.
export function CheckStart({ initialGrade, onStart, onResume, onLeave, onSeeResult }) {
  const prev = getCheck();
  // A check left half-way (refresh, phone call, app switch) can carry on
  // from the same question instead of starting over.
  const guest = getGuestProgress();
  const answeredSoFar = guest?.diagInProgress?.answered?.length || 0;
  const canResume = !!prev && !guest?.diagnosed && answeredSoFar > 0;
  const hasResult = !!prev && !!guest?.diagnosed;
  const [name, setName] = useState(prev?.name || '');
  const [grade, setGrade] = useState(initialGrade || prev?.grade || null);
  const [curriculum, setCurriculum] = useState(prev?.curriculum || null);
  const who = name.trim() || 'your child';

  const start = () => {
    if (!name.trim() || !grade || !curriculum) return;
    // A new check always starts clean on this device.
    clearGuestCheck();
    write(CHECK_KEY, { name: name.trim(), grade, curriculum, startedAt: new Date().toISOString() });
    onStart(grade, curriculum);
  };

  return (
    <div className="tg flow">
      <FlowBar label="Free maths check" onLeave={onLeave} />
      <div className="stage">
        <div className="card">
          {(canResume || hasResult) && (
            <div className="resume">
              <div><b>{canResume ? `${prev.name || 'Your child'}'s check is half done` : `${prev.name ? `${prev.name}'s` : 'Your'} result is ready`}</b>
                <span>{canResume ? `${answeredSoFar} question${answeredSoFar === 1 ? '' : 's'} answered. Carry on from the same question.` : 'See the missing step and the plan.'}</span></div>
              <button type="button" className="btn" onClick={canResume ? onResume : onSeeResult}>{canResume ? 'Continue' : 'See result'} <SiteIcon name="arrow" /></button>
            </div>
          )}
          <div className="kicker">{canResume || hasResult ? 'Or start a new check' : 'Free · about 10 minutes · no account'}</div>
          <h1 className="display" style={{ marginTop: 10 }}>Let's find the step.</h1>
          <p className="lead">Questions start easy and adapt to each answer. There's no score and no pass or fail. We're only looking for where to start.</p>
          <label className="field"><span>Child's first name</span>
            <input className="inp" value={name} onChange={e => setName(e.target.value)} autoComplete="off" maxLength={40} placeholder="e.g. Amani" /></label>
          <div className="field"><span>Which grade are they in?</span>
            <div className="chips" role="group" aria-label="Grade">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                <button key={g} type="button" className="chip" aria-pressed={grade === g} onClick={() => setGrade(g)}>Grade {g}</button>
              ))}
            </div>
          </div>
          <div className="field"><span>Which curriculum does their school follow?</span>
            <div className="curpick" role="group" aria-label="Curriculum">
              {CURRICULA.map(c => (
                <button key={c.id} type="button" aria-pressed={curriculum === c.id} onClick={() => setCurriculum(c.id)}><b>{c.name}</b><small>{c.note}</small></button>
              ))}
            </div>
            <p className="fine" style={{ margin: '8px 0 0' }}>Not sure? Check the school report, or ask the class teacher.</p>
          </div>
          <button type="button" className="btn full startbtn" onClick={start} disabled={!name.trim() || !grade || !curriculum}>
            {!name.trim() ? "Add your child's name first" : !grade ? 'Pick a grade first' : !curriculum ? 'Pick a curriculum first' : <>Start the check <SiteIcon name="arrow" /></>}
          </button>
          <div className="handnote"><SiteIcon name="phone" /><div>Now hand the phone to <b>{who}</b>. Let them try every question on their own. A wrong answer is fine and helps us. "I haven't learned this yet" is only for something truly new.</div></div>
        </div>
      </div>
    </div>
  );
}

// Step 3: the result. One missing step, what it rests on, what rests on it.
export function CheckResult({ onSave, onRetake, onFindTutor, onLeave, user }) {
  const check = getCheck();
  const progress = useMemo(() => getGuestProgress(), []);
  const r = useMemo(() => findMissingStep(progress), [progress]);
  const [showAnyway, setShowAnyway] = useState(false);

  if (!progress?.diagnosed || !r.missing) {
    return (
      <div className="tg flow">
        <FlowBar label="Free maths check" onLeave={onLeave} />
        <div className="stage"><div className="card">
          <h1 className="display">No check on this device yet.</h1>
          <p className="lead">It takes about ten minutes and it's free.</p>
          <button type="button" className="btn" onClick={onRetake}>Start the free check <SiteIcon name="arrow" /></button>
        </div></div>
      </div>
    );
  }

  // Mostly skipped: we don't know enough to place them, so say that rather
  // than show a Grade 1 result to the parent of a Grade 5 child.
  const st = progress.diagStats;
  if (st && st.answered >= 5 && st.skipped / st.answered >= 0.6 && !showAnyway) {
    const who = check?.name || 'Your child';
    return (
      <div className="tg flow">
        <FlowBar label="Free maths check" onLeave={onLeave} />
        <div className="stage"><div className="card">
          <div className="kicker">{check?.name ? `${check.name}'s check` : 'Your check'}</div>
          <h1 className="display" style={{ marginTop: 10 }}>{who} skipped most of the questions.</h1>
          <p className="lead">That's okay, and it happens a lot. It just means we can't tell yet where {check?.name || 'they'} should start. They tapped "I haven't learned this yet" on {st.skipped} of {st.answered} questions.</p>
          <ol className="tips">
            <li>Sit next to {check?.name || 'them'} for ten minutes.</li>
            <li>Let them try each question, even if they're unsure. A wrong answer helps us too.</li>
            <li>Only tap "I haven't learned this yet" when it's truly new.</li>
          </ol>
          <button type="button" className="btn full" onClick={onRetake}>Try again together <SiteIcon name="arrow" /></button>
          <p className="fine" style={{ marginTop: 14, textAlign: 'center' }}><button type="button" className="linkbtn" onClick={() => setShowAnyway(true)}>See the starting point anyway</button></p>
        </div></div>
      </div>
    );
  }

  const name = check?.name || 'Your child';
  const grade = progress.declaredGrade || check?.grade;
  const missing = skillLabel(r.missing);
  const solid = r.solid.map(id => skillLabel(id)).filter(Boolean);
  const next = r.next.map(id => skillLabel(id)).filter(Boolean);
  const others = r.otherGaps.map(id => skillLabel(id)).filter(Boolean);
  // Only claim "solid up to Grade N" when the answers show it: at least one
  // skill passed at or above that grade.
  const passedGrades = Object.entries(progress.skills || {}).filter(([, v]) => v?.passed).map(([id]) => skillLabel(id)?.grade).filter(Boolean);
  const upTo = r.placement && passedGrades.some(g => g >= r.placement) ? `solid up to Grade ${r.placement}` : null;
  const headline = r.allClear
    ? `${name} is ${upTo || 'on track'}. Here's the next step.`
    : upTo ? `${name} is ${upTo}. One step is missing.`
    : `Here's where ${check?.name || 'your child'} should start.`;

  return (
    <div className="tg">
      <nav className="nav onbrand"><div className="in">
        <Logo onClick={onLeave} />
        <div className="right"><button type="button" className="txt" onClick={onRetake}>Retake</button></div>
      </div></nav>
      <section className="rhero"><div className="in">
        <div>
          <div className="kicker">{check?.name ? `${check.name}'s check` : 'Your check'}{grade ? ` · Grade ${grade}` : ''}</div>
          <h1 className="display" style={{ marginTop: 12 }}>{headline}</h1>
          <p>{r.allClear
            ? 'Nothing below this is missing. The daily plan starts here and keeps building.'
            : !upTo ? 'The plan starts at this step and moves quickly through anything that turns out to be easy.'
            : `It's likely the reason ${next.length ? next[0].name.toLowerCase() : 'the next topics'} feel${next.length ? 's' : ''} hard right now. Fix this one, and the work built on it gets easier.`}</p>
        </div>
        <div className="found">
          <div className="kicker">{r.allClear ? 'The next step' : 'The missing step'}</div>
          <b>{missing.name}</b>
          <span>A Grade {missing.grade} skill. 15 minutes a day on a phone or tablet.</span>
        </div>
      </div></section>

      <section className="sec"><div className="in">
        <div className="kicker">Why this one</div>
        <h2 className="display" style={{ marginTop: 8 }}>Maths is a ladder. Here's the rung.</h2>
        <p className="sub">Each skill stands on the ones before it. Fix the lowest missing one first, and everything above it gets easier.</p>
        <div className="chain">
          {solid.map(s => <div key={s.id} className="link ok"><span className="stt"><SiteIcon name="check" style={{ width: 14, height: 14 }} />Solid</span><h3>{s.name}</h3><p>Grade {s.grade}</p></div>)}
          <div className="link gap"><span className="stt">{r.allClear ? 'Next step' : 'Missing step'}</span><h3>{missing.name}</h3><p>Grade {missing.grade}</p></div>
          {next.map((s, i) => <div key={s.id} className="link next"><span className="stt"><SiteIcon name="lock" style={{ width: 14, height: 14 }} />{i === 0 ? 'Next' : 'Then'}</span><h3>{s.name}</h3><p>Grade {s.grade} · stands on it</p></div>)}
        </div>
      </div></section>

      <section className="sec tight"><div className="in">
        <h2 className="display">The plan</h2>
        <p className="sub">15 minutes a day. Each day ends, so {check?.name || 'your child'} knows when they're done.</p>
        <div className="plan">
          <div className="pl">
            <div className="kicker muted">Starting today</div>
            <h3>{missing.name}</h3>
            <ol><li>Short reviews of what's already solid, so every day starts with wins</li><li>One new idea at a time, with pictures first where it helps</li><li>A quick re-check once it sticks</li></ol>
          </div>
          <div className="pl locked">
            <div className="blur" aria-hidden="true">
              <div className="kicker muted">After that</div>
              <h3>{others.length ? `${others.length} more gap${others.length === 1 ? '' : 's'} we found` : 'Your full plan'}</h3>
              <ul>{(others.length ? others : [{ id: 'a', name: 'The next skills in order' }, { id: 'b', name: 'Reviews to keep it solid' }]).slice(0, 4).map(o => <li key={o.id}>{o.name}</li>)}</ul>
            </div>
            <div className="over"><div><SiteIcon name="lock" />Save the plan to see the full list</div></div>
          </div>
        </div>
        <p className="fine" style={{ marginTop: 14 }}>Want help faster? A tutor can take this exact skill in a live lesson. <button type="button" className="linkbtn" onClick={() => onFindTutor(missing.name, check?.name)}>See tutors</button></p>
      </div></section>

      <div className="stickybar"><div className="in">
        <div><b>{user ? `Save ${check?.name ? `${check.name}'s` : 'the'} plan to your account.` : `Save ${check?.name ? `${check.name}'s` : 'the'} plan.`}</b> <span className="muted">Free. Google or email.</span></div>
        <button type="button" className="btn" onClick={onSave}>Save the plan <SiteIcon name="arrow" /></button>
      </div></div>
    </div>
  );
}
