// ============================================================================
// YOUNG LEARNER LESSON (CBC Grades 1–2) — the approved editorial-warm design.
//
// Built from the child's side of the screen:
//  · The question READS ITSELF aloud; one big speaker button replays it.
//  · Counters are tappable and every tap is voiced ("one… two…") — the app
//    counts WITH the child. Tapping a counted counter ROLLS THE COUNT BACK to
//    that point (recounting is how six-year-olds fix themselves — never an error).
//  · First wrong answer → a spoken nudge. Second → COUNT TOGETHER: the app
//    demonstrates, lighting and voicing each counter, then hands the question
//    back (the worked-example effect, in the only form a pre-reader can receive).
//  · The clock is INVISIBLE: response time and tap counts are captured silently
//    for the fluency gate and CPA-stage inference. Sessions end on a win.
//
// Reports one final result per problem via onResult({ correct, hintsUsed,
// timeMs, taps }). Needing the demonstration reports correct:false (the child
// still *experiences* success; the learning signal stays honest).
// ============================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const uniq = (a) => [...new Set(a)];

/**
 * Decide whether (and how) a problem can be taught in young mode.
 * Returns null when it can't — the caller falls back to the standard UI.
 */
export function planYoungLesson(problem) {
  if (!problem || problem.placeholder) return null;
  const answer = String(problem.answer).trim();
  const v = parseFloat(answer);

  // Counters: pure single-digit addition ("4 + 5 = ?") — the concrete layer.
  const m = /^(\d+)\s*\+\s*(\d+)\s*=\s*\?$/.exec(problem.question?.trim() || '');
  const counters = m && +m[1] <= 9 && +m[2] <= 9 ? [+m[1], +m[2]] : null;

  // Choices: three big buttons. Numeric answers get near-miss distractors
  // (plus the problem's own misconception value when it has one).
  let choices = null;
  if (Number.isFinite(v) && Number.isInteger(v)) {
    const mis = parseFloat(problem.misconceptions?.[0]?.when);
    const pool = uniq([v, Number.isFinite(mis) && mis >= 0 && mis !== v ? mis : v + 1, v > 0 ? v - 1 : v + 2, v + 1])
      .filter(n => n >= 0).slice(0, 3);
    while (pool.length < 3) pool.push(v + pool.length);
    choices = shuffle(uniq(pool).slice(0, 3));
  } else if (problem.type === 'line-type') {
    choices = shuffle(['straight', 'curved']);
  } else if (problem.type === 'time-day') {
    const i = DAYS.indexOf(answer);
    if (i >= 0) choices = shuffle(uniq([answer, DAYS[(i + 1) % 7], DAYS[(i + 6) % 7]]));
  } else if (problem.type === 'time-month') {
    const i = MONTHS.indexOf(answer);
    if (i >= 0) choices = shuffle(uniq([answer, MONTHS[(i + 1) % 12], MONTHS[(i + 11) % 12]]));
  }
  if (!choices || choices.length < 2) return null;

  return { counters, choices, answer };
}

// ---- speech ----------------------------------------------------------------
let voiceEn = null;
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  voiceEn = vs.find(x => /en[-_](KE|GB)/i.test(x.lang)) || vs.find(x => /^en/i.test(x.lang)) || null;
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text, { rate = 0.95, interrupt = true } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  try {
    if (interrupt) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceEn) u.voice = voiceEn;
    u.rate = rate; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  } catch { /* speech is an enhancement, never a dependency */ }
}
const speakable = (q) => q
  .replace(/\+/g, ' plus ').replace(/[−-]/g, ' minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
  .replace(/=\s*\?/g, ' equals what?').replace(/☐/g, ' blank ').replace(/\s+/g, ' ').trim();

// ---- the bird (CSS, three moods) -------------------------------------------
function Bird({ mood }) {
  return (
    <div className={`yl-bird ${mood || ''}`} aria-hidden="true">
      <div className="b-tail" /><div className="b-wing" /><div className="b-body" />
      <div className="b-chest" /><div className="b-head" /><div className="b-eye" />
      <div className="b-beak" /><div className="b-feet" />
    </div>
  );
}

// ---- component --------------------------------------------------------------
export default function YoungLearnerLesson({
  problem, plan, skillName, cbcLabel, progressLabel, studentName, onResult, onExit,
}) {
  const [order, setOrder] = useState([]);          // counter ids in counted order
  const [wrongs, setWrongs] = useState(0);
  const [disabled, setDisabled] = useState([]);    // wrong choices already tried
  const [locked, setLocked] = useState(false);     // during demonstration/celebration
  const [voiceLine, setVoiceLine] = useState('');
  const [mood, setMood] = useState('');
  const [waving, setWaving] = useState(false);
  const t0 = useRef(Date.now());
  const taps = useRef(0);

  const total = plan.counters ? plan.counters[0] + plan.counters[1] : 0;

  const readQuestion = () => speak(speakable(problem.question));

  // fresh problem → reset, read it aloud
  useEffect(() => {
    setOrder([]); setWrongs(0); setDisabled([]); setLocked(false); setWaving(false);
    setMood('');
    setVoiceLine(plan.counters ? "Tap the counters — I'll count with you." : 'Listen, then choose your answer.');
    t0.current = Date.now(); taps.current = 0;
    readQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem]);

  // counters: tap to count (voiced); tap a counted one to roll back to it
  const tapCounter = (id) => {
    if (locked) return;
    taps.current++;
    const at = order.indexOf(id);
    if (at === -1) {
      const next = [...order, id];
      setOrder(next);
      speak(WORDS[next.length] || String(next.length), { rate: 1.0 });
      if (next.length === total) {
        setMood('happy');
        setVoiceLine('All counted! Which number did you reach?');
        speak('Which number did you reach?', { interrupt: false });
      }
    } else {
      const next = order.slice(0, at);
      setOrder(next);
      setMood('');
      setVoiceLine(next.length ? `Back to ${WORDS[next.length]} — carry on.` : 'Fresh start — count me the first one.');
      if (next.length) speak(WORDS[next.length]);
    }
  };

  // second wrong → the app demonstrates: counts every counter aloud, in order
  const countTogether = () => {
    setLocked(true); setOrder([]); setMood('think');
    setVoiceLine("Watch — we'll count together.");
    speak("Let's count together.");
    for (let i = 1; i <= total; i++) {
      setTimeout(() => {
        setOrder(o => [...o, `d${i}`].slice(0, i).map((_, k) => allIds[k]));   // reveal 1..i
        speak(WORDS[i], { interrupt: false });
        if (i === total) setTimeout(() => {
          setMood('happy');
          setVoiceLine(`${WORDS[total][0].toUpperCase() + WORDS[total].slice(1)}! Now you choose it.`);
          speak(`${WORDS[total]}! Now you choose it.`, { interrupt: false });
          setLocked(false);
        }, 700);
      }, 800 * i);
    }
  };

  const choose = (choice) => {
    if (locked || disabled.includes(choice)) return;
    const right = String(choice) === plan.answer;
    if (right) {
      setLocked(true); setMood('happy'); setWaving(true);
      setVoiceLine("Vizuri sana! That's it exactly.");
      speak("Vizuri sana! That's it exactly.");
      const timeMs = Date.now() - t0.current;
      setTimeout(() => onResult({
        correct: wrongs < 2,               // needed the demonstration → not yet independent
        hintsUsed: Math.min(wrongs, 3),
        timeMs,                            // captured silently — nothing on screen ever ticks
        taps: taps.current,                // tap pattern = concrete-vs-abstract signal
      }), 1400);
    } else {
      const w = wrongs + 1;
      setWrongs(w);
      setDisabled(d => [...d, choice]);
      if (w === 1 || !plan.counters) {
        setMood('think');
        setVoiceLine(plan.counters ? 'Not quite — count each counter, one at a time.' : 'Not quite — listen again, then try once more.');
        speak(plan.counters ? 'Not quite. Count each counter, one at a time.' : 'Not quite. Listen again.');
        if (!plan.counters) readQuestion();
      } else {
        countTogether();
      }
    }
  };

  // counter ids (stable): a0..aN-1, b0..bM-1
  const allIds = useMemo(() => plan.counters
    ? [...Array(plan.counters[0]).keys()].map(i => `a${i}`).concat([...Array(plan.counters[1]).keys()].map(i => `b${i}`))
    : [], [plan]);

  const counterEl = (id, cls) => {
    const n = order.indexOf(id);
    return (
      <button key={id} type="button" aria-label={n >= 0 ? `counter, counted ${n + 1}` : 'counter, not counted'}
        className={`yl-counter ${cls} ${n >= 0 ? 'counted' : ''} ${waving ? 'wave' : ''}`}
        data-n={n >= 0 ? n + 1 : ''} onClick={() => tapCounter(id)}
        style={waving ? { animationDelay: `${(n >= 0 ? n : 0) * 45}ms` } : undefined} />
    );
  };

  return (
    <div className="yl-stage">
      <style>{YL_CSS}</style>
      <div className="yl-sun" />
      <div className="yl-bar">
        <button className="yl-exit" onClick={onExit}>‹ Exit</button>
        <div className="yl-mark"><span className="yl-orb" />HOREB</div>
        <span className="yl-pos">{progressLabel}</span>
      </div>

      <main className="yl-main">
        <div className="yl-eyebrow">{skillName}</div>
        <div className="yl-qrow">
          <h1 className="yl-h1">{problem.question}</h1>
          <button className="yl-hear" aria-label="Hear the question again" onClick={readQuestion}>
            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" /></svg>
          </button>
        </div>

        {plan.counters && (
          <>
            <div className="yl-work">
              <div className="yl-grp">{[...Array(plan.counters[0]).keys()].map(i => counterEl(`a${i}`, 'a'))}</div>
              <div className="yl-plus">+</div>
              <div className="yl-grp">{[...Array(plan.counters[1]).keys()].map(i => counterEl(`b${i}`, 'b'))}</div>
            </div>
            <div className="yl-note">Touch each counter to count it. Touch again to take a count back.</div>
          </>
        )}

        <div className="yl-voicebox">
          <Bird mood={mood} />
          <div className="yl-voice">{voiceLine}</div>
        </div>

        <div className={`yl-answers ${locked ? 'lock' : ''}`}>
          {plan.choices.map(c => (
            <button key={c} className={`yl-ans ${disabled.includes(c) ? 'wrong' : ''}`}
              disabled={disabled.includes(c)} onClick={() => choose(c)}>{c}</button>
          ))}
        </div>
      </main>

      <footer className="yl-foot">
        <span>{cbcLabel}</span>
        <span>{studentName}</span>
      </footer>
    </div>
  );
}

const YL_CSS = `
.yl-stage{--paper:#faf3e7;--ink:#171410;--soft:#7a7266;--faint:#9a9182;--gold:#e9b64d;
  --rule:#e3ddd0;--accent:#b5452f;--terra:#c96a4a;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  max-width:440px;margin:0 auto;min-height:100vh;background:var(--paper);color:var(--ink);
  display:flex;flex-direction:column;position:relative;overflow:hidden;box-shadow:0 0 50px rgba(23,20,16,.14);}
.yl-sun{position:absolute;top:-70px;right:-50px;width:190px;height:190px;border-radius:50%;
  background:radial-gradient(circle at 40% 40%,#f6d489,var(--gold) 65%,#dfa432);opacity:.35;pointer-events:none;}
.yl-bar{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;position:relative;}
.yl-exit{font-size:13px;font-weight:600;color:var(--faint);background:none;border:none;cursor:pointer;padding:4px;}
.yl-mark{display:flex;align-items:center;gap:9px;font-weight:600;letter-spacing:.16em;font-size:13px;}
.yl-orb{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff 0%,#e0603f 38%,#8f2d17 100%);}
.yl-pos{font-size:12.5px;color:var(--faint);}
.yl-main{flex:1;display:flex;flex-direction:column;padding:8px 24px 0;position:relative;}
.yl-eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);}
.yl-qrow{display:flex;align-items:flex-start;gap:12px;margin:12px 0 22px;}
.yl-h1{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:30px;line-height:1.18;letter-spacing:-.01em;flex:1;}
.yl-hear{width:52px;height:52px;flex:none;border-radius:50%;border:1px solid var(--rule);background:#fffdf8;
  cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s,border-color .15s;}
.yl-hear:hover{transform:translateY(-1px);border-color:#cfc7b6;}
.yl-hear svg{width:24px;height:24px;fill:var(--ink);}
.yl-work{display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:8px;}
.yl-grp{display:grid;grid-template-columns:repeat(3,54px);gap:12px;justify-items:center;}
.yl-plus{font-family:Georgia,serif;font-size:28px;color:var(--faint);}
.yl-counter{width:54px;height:54px;border-radius:50%;cursor:pointer;position:relative;border:none;padding:0;
  transition:transform .15s ease,box-shadow .15s ease;-webkit-tap-highlight-color:transparent;}
.yl-counter.a{background:var(--terra);}
.yl-counter.b{background:var(--gold);}
.yl-counter:hover{transform:translateY(-3px) rotate(-3deg);}
.yl-counter.counted{animation:yl-pop .28s ease;box-shadow:inset 0 0 0 3px var(--paper),inset 0 0 0 5px rgba(23,20,16,.35);}
@keyframes yl-pop{45%{transform:scale(1.14);}}
.yl-counter.counted::after{content:attr(data-n);position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-family:Georgia,serif;font-size:22px;color:var(--paper);}
.yl-counter.wave{animation:yl-wave .5s ease 1;}
@keyframes yl-wave{35%{transform:translateY(-10px);}}
.yl-note{text-align:center;font-size:13px;color:var(--faint);margin-bottom:18px;}
.yl-voicebox{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin-bottom:14px;min-height:58px;}
.yl-voice{font-family:Georgia,serif;font-style:italic;font-size:16.5px;color:var(--soft);max-width:230px;padding-bottom:10px;}
.yl-bird{width:58px;height:58px;position:relative;flex:none;transition:transform .3s ease;}
.yl-bird.think{transform:rotate(-7deg);}
.yl-bird.happy{animation:yl-hop .5s ease 1;}
@keyframes yl-hop{40%{transform:translateY(-9px);}}
.yl-bird .b-body{position:absolute;bottom:8px;left:6px;width:42px;height:36px;border-radius:52% 48% 55% 45%/60% 64% 36% 40%;
  background:linear-gradient(160deg,#46C2AA 0%,#1D8A78 60%,#0F5D50 100%);}
.yl-bird .b-chest{position:absolute;bottom:9px;left:10px;width:24px;height:20px;border-radius:50% 50% 60% 40%/45% 45% 55% 55%;
  background:linear-gradient(170deg,#e8935c,#c96a4a);}
.yl-bird .b-head{position:absolute;top:2px;left:17px;width:26px;height:23px;border-radius:50% 50% 48% 52%/58% 58% 42% 42%;
  background:linear-gradient(160deg,#2A3B57,#16233B);}
.yl-bird .b-eye{position:absolute;top:9px;left:33px;width:7px;height:7px;border-radius:50%;background:#fff;}
.yl-bird .b-eye::after{content:'';position:absolute;top:1.5px;left:2px;width:3px;height:3px;border-radius:50%;background:#101820;}
.yl-bird .b-beak{position:absolute;top:14px;left:42px;width:9px;height:5px;background:#2B3542;clip-path:polygon(0 0,100% 45%,0 100%);}
.yl-bird .b-wing{position:absolute;bottom:20px;left:2px;width:18px;height:22px;border-radius:60% 40% 55% 45%/55% 45% 60% 40%;
  background:linear-gradient(150deg,#157262,#0C4A40);transform:rotate(14deg);z-index:1;}
.yl-bird .b-tail{position:absolute;bottom:4px;left:-6px;width:20px;height:8px;border-radius:6px;
  background:linear-gradient(90deg,#0C4A40,#157262);transform:rotate(24deg);}
.yl-bird .b-feet{position:absolute;bottom:2px;left:20px;width:16px;height:5px;
  border-bottom:2px solid #8a6a45;border-left:2px solid #8a6a45;border-right:2px solid #8a6a45;border-radius:0 0 4px 4px;}
.yl-answers{display:flex;gap:12px;margin-top:auto;padding-bottom:24px;}
.yl-answers.lock .yl-ans{pointer-events:none;opacity:.55;}
.yl-ans{flex:1;font-family:Georgia,serif;font-size:26px;color:var(--ink);background:#fffdf8;
  border:1px solid var(--rule);border-radius:14px;padding:18px 4px;cursor:pointer;
  transition:transform .12s,border-color .15s,background .15s;-webkit-tap-highlight-color:transparent;}
.yl-ans:hover{transform:translateY(-1px);border-color:#cfc7b6;}
.yl-ans.wrong{border-color:var(--accent);color:var(--accent);background:#f9ece7;}
.yl-foot{border-top:1px solid var(--rule);padding:14px 24px 20px;display:flex;justify-content:space-between;
  align-items:center;font-size:12px;color:var(--faint);position:relative;}
@media (prefers-reduced-motion:reduce){
  .yl-counter,.yl-ans,.yl-bird,.yl-hear{transition:none;animation:none!important;}
}
`;
