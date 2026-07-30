// ============================================================================
// BRIDGE LESSON (CBC Grades 3–4) — between the young counters and the older
// typed flow. Same warm editorial language; the interactions grow up:
//
//  · COLUMN WORKSPACE for multi-digit add/sub: the child fills the answer
//    digit by digit, right to left, on a big number pad — the UI walks the
//    same algorithm the KICD outcomes describe. On the second wrong answer
//    the working is REVEALED column by column, carry/borrow bubbles and all.
//  · NUMBER PAD for every other numeric answer (tables, sharing, fractions of
//    sets, money, conversions), with the problem's dot-array visual when the
//    generator provides one. '.' and '/' keys appear only when the expected
//    answer needs them.
//  · CHOICES only where they're honest: non-numeric answers (compass
//    directions, angle types).
//
//  Reading is assumed (audio is on-demand, never automatic); the bird appears
//  at feedback moments only; timers stay invisible — time and pad-taps are
//  captured silently. Needing the reveal records correct:false.
// ============================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';

const COMPASS = ['North', 'East', 'South', 'West'];
const ANGLE_KINDS = ['acute', 'right', 'obtuse'];
const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

/** Decide whether (and how) a problem fits the bridge experience. */
export function planBridgeLesson(problem) {
  if (!problem || problem.placeholder) return null;
  const answer = String(problem.answer).trim();

  // Column arithmetic: multi-digit a ± b (the algorithm skills).
  const m = /^(\d+)\s*([+−-])\s*(\d+)\s*=\s*\?$/.exec(problem.question?.trim() || '');
  if (m && (m[1].length > 1 || m[3].length > 1)) {
    const op = m[2] === '+' ? '+' : '−';
    return { mode: 'column', a: +m[1], b: +m[3], op, answer };
  }

  // Choices for the non-numeric types that have a known option set.
  if (problem.type === 'compass-turn' && COMPASS.includes(answer)) {
    return { mode: 'choices', answer, choices: shuffle([...COMPASS]) };
  }
  if (problem.type === 'angle-classify' && ANGLE_KINDS.includes(answer)) {
    return { mode: 'choices', answer, choices: [...ANGLE_KINDS] };
  }
  if (problem.type === 'line-type') {
    return { mode: 'choices', answer, choices: shuffle(['straight', 'curved']) };
  }

  // Number pad for everything the child can key in.
  if (/^\d+$/.test(answer)) return { mode: 'pad', answer, keys: '' };
  if (/^\d+\.\d+$/.test(answer)) return { mode: 'pad', answer, keys: '.' };
  if (/^\d+\/\d+$/.test(answer)) return { mode: 'pad', answer, keys: '/' };
  if (/^\d{1,2}:\d{2}$/.test(answer)) return { mode: 'pad', answer, keys: ':' };

  return null;   // fall back to the standard UI
}

// ---- column working, step by step ------------------------------------------
function columnSteps(a, b, op) {
  const A = String(a).split('').map(Number).reverse();
  const B = String(b).split('').map(Number).reverse();
  const steps = []; const out = [];
  if (op === '+') {
    let carry = 0;
    for (let i = 0; i < Math.max(A.length, B.length) || carry; i++) {
      const x = A[i] || 0, y = B[i] || 0, s = x + y + carry;
      const d = s % 10, nc = s >= 10 ? 1 : 0;
      steps.push({
        digit: d, carryOut: nc,
        note: `${x} + ${y}${carry ? ` + ${carry} (carried)` : ''} = ${s}${nc ? ` — write ${d}, carry 1` : ''}`,
      });
      out.push(d); carry = nc;
      if (i >= Math.max(A.length, B.length) && !carry) break;
    }
  } else {
    let borrow = 0;
    for (let i = 0; i < A.length; i++) {
      let x = A[i] - borrow; const y = B[i] || 0;
      if (x < y) {
        steps.push({ digit: x + 10 - y, carryOut: 0, note: `${x} − ${y} won't go — borrow ten: ${x + 10} − ${y} = ${x + 10 - y}` });
        out.push(x + 10 - y); borrow = 1;
      } else {
        steps.push({ digit: x - y, carryOut: 0, note: `${x} − ${y} = ${x - y}` });
        out.push(x - y); borrow = 0;
      }
    }
    while (out.length > 1 && out[out.length - 1] === 0) { out.pop(); steps.pop(); }
  }
  return { steps, result: out.slice().reverse().join('') };
}

// ---- speech (on demand only at this age) ------------------------------------
let voiceEn = null;
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  voiceEn = vs.find(x => /en[-_](KE|GB)/i.test(x.lang)) || vs.find(x => /^en/i.test(x.lang)) || null;
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voiceEn) u.voice = voiceEn;
    u.rate = 0.95; u.pitch = 1.02;
    window.speechSynthesis.speak(u);
  } catch { /* enhancement only */ }
}
const speakable = (q) => q
  .replace(/\+/g, ' plus ').replace(/[−]/g, ' minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
  .replace(/=\s*\?/g, ' equals what?').replace(/\s+/g, ' ').trim();

function Bird({ mood }) {
  if (!mood) return null;   // at this age the bird appears only at feedback moments
  return (
    <div className={`bl-bird ${mood}`} aria-hidden="true">
      <div className="b-body" /><div className="b-chest" /><div className="b-head" />
      <div className="b-eye" /><div className="b-beak" /><div className="b-feet" />
    </div>
  );
}

function ArrayDots({ rows, cols }) {
  if (!rows || !cols || rows * cols > 120) return null;
  return (
    <div className="bl-dots" style={{ gridTemplateColumns: `repeat(${cols}, 16px)` }} aria-hidden="true">
      {Array.from({ length: rows * cols }, (_, i) => <span key={i} />)}
    </div>
  );
}

// ---- component --------------------------------------------------------------
export default function BridgeLesson({
  problem, plan, skillName, cbcLabel, progressLabel, studentName, onResult, onExit,
}) {
  const [entry, setEntry] = useState('');          // pad/column input (column: right-to-left digits)
  const [wrongs, setWrongs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [voiceLine, setVoiceLine] = useState('');
  const [mood, setMood] = useState('');
  const [revealed, setRevealed] = useState(0);     // columns revealed so far
  const [disabledChoices, setDisabledChoices] = useState([]);
  const t0 = useRef(Date.now());
  const taps = useRef(0);

  const col = useMemo(
    () => plan.mode === 'column' ? columnSteps(plan.a, plan.b, plan.op) : null,
    [plan]);

  useEffect(() => {
    setEntry(''); setWrongs(0); setLocked(false); setVoiceLine(''); setMood('');
    setRevealed(0); setDisabledChoices([]);
    t0.current = Date.now(); taps.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem]);

  const finish = (correct) => {
    setLocked(true);
    const timeMs = Date.now() - t0.current;
    setTimeout(() => onResult({ correct, hintsUsed: Math.min(wrongs, 3), timeMs, taps: taps.current }), correct ? 1300 : 2200);
  };

  const celebrate = () => {
    setMood('happy');
    setVoiceLine('Vizuri sana — that\'s it exactly.');
    finish(wrongs < 2);
  };

  // reveal the column working, one column at a time, then hand the result over
  const revealColumns = () => {
    setLocked(true); setMood('think');
    setVoiceLine('Watch the working, column by column.');
    col.steps.forEach((s, i) => setTimeout(() => {
      setRevealed(i + 1);
      setVoiceLine(s.note);
      if (i === col.steps.length - 1) setTimeout(() => {
        setEntry(col.result.split('').reverse().join(''));
        setVoiceLine(`So ${plan.a} ${plan.op} ${plan.b} = ${col.result}. Next one is yours.`);
        finish(false);
      }, 1200);
    }, 1400 * (i + 1)));
  };

  const revealAnswer = () => {
    setLocked(true); setMood('think');
    const step = problem.solution?.steps?.[0]?.text;
    setVoiceLine(`${step ? step + ' ' : ''}The answer is ${plan.answer}. Next one is yours.`);
    setEntry(plan.answer);
    finish(false);
  };

  const wrong = () => {
    const w = wrongs + 1; setWrongs(w);
    if (w === 1) {
      setMood('think');
      const hint = problem.hints?.[0] || 'Not quite — try again carefully.';
      setVoiceLine(hint);
      if (plan.mode !== 'column') setEntry('');
    } else {
      plan.mode === 'column' ? revealColumns() : revealAnswer();
    }
  };

  const check = () => {
    if (locked || !entry) return;
    const given = plan.mode === 'column' ? entry.split('').reverse().join('') : entry;
    const ok = given === plan.answer
      || (problem.accepts || []).map(x => String(x).toLowerCase()).includes(given.toLowerCase());
    ok ? celebrate() : wrong();
  };

  const key = (k) => {
    if (locked) return;
    taps.current++;
    if (k === '⌫') setEntry(e => e.slice(0, -1));
    else if (plan.mode === 'column') {
      if (entry.length < col.result.length) setEntry(e => e + k);
    } else if (entry.length < 8) setEntry(e => e + k);
  };

  const choose = (c) => {
    if (locked || disabledChoices.includes(c)) return;
    taps.current++;
    if (String(c).toLowerCase() === plan.answer.toLowerCase()) { setEntry(String(c)); celebrate(); }
    else { setDisabledChoices(d => [...d, c]); wrong(); }
  };

  // column rendering: operands right-aligned; result cells fill right-to-left
  const renderColumn = () => {
    const width = Math.max(String(plan.a).length, String(plan.b).length, col.result.length);
    const padRow = (n) => String(n).padStart(width, ' ').split('');
    const resultCells = Array.from({ length: col.result.length }, (_, i) => {
      const fromRight = col.result.length - 1 - i;
      const d = entry[fromRight];
      const active = !locked && entry.length === fromRight;
      return <span key={i} className={`bl-cell ${active ? 'active' : ''} ${d != null ? 'filled' : ''}`}>{d ?? ''}</span>;
    });
    return (
      <div className="bl-column" aria-label={`${plan.a} ${plan.op} ${plan.b}`}>
        <div className="bl-carries">
          {Array.from({ length: width + 1 }, (_, i) => {
            const fromRight = width - i;
            const s = col.steps[fromRight - 1];
            const show = plan.op === '+' && s?.carryOut === 1 && revealed >= fromRight;
            return <span key={i} className={`bl-carry ${show ? 'show' : ''}`}>{show ? '1' : ''}</span>;
          })}
        </div>
        <div className="bl-oprow"><span className="bl-opspace" />{padRow(plan.a).map((d, i) => <span key={i} className="bl-digit">{d}</span>)}</div>
        <div className="bl-oprow"><span className="bl-opspace">{plan.op}</span>{padRow(plan.b).map((d, i) => <span key={i} className="bl-digit">{d}</span>)}</div>
        <div className="bl-rule" />
        <div className="bl-oprow"><span className="bl-opspace" />
          {Array.from({ length: width - col.result.length }, (_, i) => <span key={`s${i}`} className="bl-digit" />)}
          {resultCells}
        </div>
      </div>
    );
  };

  const dots = problem.visual?.type === 'array_dots' ? problem.visual.data : null;

  return (
    <div className="bl-stage">
      <style>{BL_CSS}</style>
      <div className="bl-bar">
        <button className="bl-exit" onClick={onExit}>‹ Exit</button>
        <div className="bl-mark"><span className="bl-orb" />HOREB</div>
        <span className="bl-pos">{progressLabel}</span>
      </div>

      <main className="bl-main">
        <div className="bl-eyebrow">{skillName}</div>
        <div className="bl-qrow">
          <h1 className="bl-h1">{plan.mode === 'column' ? 'Work it out in columns.' : problem.question}</h1>
          <button className="bl-hear" aria-label="Hear the question" onClick={() => speak(speakable(problem.question))}>
            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" /></svg>
          </button>
        </div>

        {plan.mode === 'column' && renderColumn()}
        {plan.mode !== 'column' && dots && <ArrayDots rows={dots.rows} cols={dots.cols} />}
        {plan.mode === 'pad' && (
          <div className="bl-entry" aria-live="polite">{entry || ' '}</div>
        )}

        <div className="bl-voicebox">
          <Bird mood={mood} />
          {voiceLine && <div className="bl-voice">{voiceLine}</div>}
        </div>

        {plan.mode === 'choices' ? (
          <div className={`bl-choices ${locked ? 'lock' : ''}`}>
            {plan.choices.map(c => (
              <button key={c} className={`bl-choice ${disabledChoices.includes(c) ? 'wrong' : ''}`}
                disabled={disabledChoices.includes(c)} onClick={() => choose(c)}>{c}</button>
            ))}
          </div>
        ) : (
          <div className={`bl-padwrap ${locked ? 'lock' : ''}`}>
            <div className="bl-pad">
              {['1','2','3','4','5','6','7','8','9', plan.keys || '⌫', '0', plan.keys ? '⌫' : ''].filter(Boolean).map(k => (
                <button key={k} className="bl-key" onClick={() => key(k)}>{k}</button>
              ))}
            </div>
            <button className="bl-check" onClick={check} disabled={locked || !entry}>Check</button>
          </div>
        )}
      </main>

      <footer className="bl-foot">
        <span>{cbcLabel}</span>
        <span>{studentName}</span>
      </footer>
    </div>
  );
}

const BL_CSS = `
.bl-stage{--paper:#faf3e7;--ink:#171410;--soft:#7a7266;--faint:#9a9182;--gold:#e9b64d;
  --rule:#e3ddd0;--accent:#b5452f;--terra:#c96a4a;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  max-width:440px;margin:0 auto;min-height:100vh;background:var(--paper);color:var(--ink);
  display:flex;flex-direction:column;position:relative;overflow:hidden;box-shadow:0 0 50px rgba(23,20,16,.14);}
.bl-bar{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;}
.bl-exit{font-size:13px;font-weight:600;color:var(--faint);background:none;border:none;cursor:pointer;padding:4px;}
.bl-mark{display:flex;align-items:center;gap:9px;font-weight:600;letter-spacing:.16em;font-size:13px;}
.bl-orb{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff 0%,#e0603f 38%,#8f2d17 100%);}
.bl-pos{font-size:12.5px;color:var(--faint);}
.bl-main{flex:1;display:flex;flex-direction:column;padding:6px 24px 0;}
.bl-eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);}
.bl-qrow{display:flex;align-items:flex-start;gap:12px;margin:10px 0 16px;}
.bl-h1{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:24px;line-height:1.22;letter-spacing:-.01em;flex:1;}
.bl-hear{width:44px;height:44px;flex:none;border-radius:50%;border:1px solid var(--rule);background:#fffdf8;
  cursor:pointer;display:flex;align-items:center;justify-content:center;}
.bl-hear svg{width:20px;height:20px;fill:var(--ink);}
.bl-column{font-family:Georgia,serif;font-variant-numeric:tabular-nums;margin:4px auto 10px;width:max-content;}
.bl-carries{display:flex;justify-content:flex-end;height:18px;}
.bl-carry{width:38px;text-align:center;font-size:14px;color:var(--accent);opacity:0;transition:opacity .3s;}
.bl-carry.show{opacity:1;}
.bl-oprow{display:flex;justify-content:flex-end;align-items:center;}
.bl-opspace{width:30px;font-size:30px;color:var(--soft);text-align:left;}
.bl-digit{width:38px;text-align:center;font-size:34px;}
.bl-rule{border-bottom:2px solid var(--ink);margin:6px 0 8px;}
.bl-cell{width:38px;height:46px;margin:0 0;display:inline-flex;align-items:center;justify-content:center;
  font-size:32px;color:var(--accent);border-bottom:2px solid var(--rule);}
.bl-cell.active{border-bottom-color:var(--accent);animation:bl-blink 1.1s step-end infinite;}
@keyframes bl-blink{50%{border-bottom-color:transparent;}}
.bl-cell.filled{border-bottom-color:transparent;}
.bl-dots{display:grid;gap:6px;justify-content:center;margin:2px auto 12px;}
.bl-dots span{width:16px;height:16px;border-radius:50%;background:var(--terra);}
.bl-dots span:nth-child(even){background:var(--gold);}
.bl-entry{font-family:Georgia,serif;font-size:36px;text-align:center;min-height:48px;color:var(--accent);
  border-bottom:2px solid var(--ink);max-width:200px;margin:0 auto 8px;padding:0 10px 4px;}
.bl-voicebox{display:flex;align-items:flex-end;justify-content:center;gap:10px;min-height:52px;margin:6px 0;}
.bl-voice{font-family:Georgia,serif;font-style:italic;font-size:15.5px;color:var(--soft);max-width:280px;padding-bottom:8px;}
.bl-bird{width:48px;height:48px;position:relative;flex:none;}
.bl-bird.think{transform:rotate(-7deg);}
.bl-bird.happy{animation:bl-hop .5s ease 1;}
@keyframes bl-hop{40%{transform:translateY(-8px);}}
.bl-bird .b-body{position:absolute;bottom:7px;left:5px;width:35px;height:30px;border-radius:52% 48% 55% 45%/60% 64% 36% 40%;
  background:linear-gradient(160deg,#46C2AA 0%,#1D8A78 60%,#0F5D50 100%);}
.bl-bird .b-chest{position:absolute;bottom:8px;left:8px;width:20px;height:17px;border-radius:50% 50% 60% 40%/45% 45% 55% 55%;
  background:linear-gradient(170deg,#e8935c,#c96a4a);}
.bl-bird .b-head{position:absolute;top:2px;left:14px;width:22px;height:19px;border-radius:50% 50% 48% 52%/58% 58% 42% 42%;
  background:linear-gradient(160deg,#2A3B57,#16233B);}
.bl-bird .b-eye{position:absolute;top:8px;left:27px;width:6px;height:6px;border-radius:50%;background:#fff;}
.bl-bird .b-beak{position:absolute;top:12px;left:35px;width:8px;height:4px;background:#2B3542;clip-path:polygon(0 0,100% 45%,0 100%);}
.bl-bird .b-feet{position:absolute;bottom:2px;left:17px;width:13px;height:4px;
  border-bottom:2px solid #8a6a45;border-left:2px solid #8a6a45;border-right:2px solid #8a6a45;border-radius:0 0 3px 3px;}
.bl-choices{display:flex;gap:12px;margin-top:auto;padding-bottom:24px;}
.bl-choices.lock .bl-choice{pointer-events:none;opacity:.55;}
.bl-choice{flex:1;font-family:Georgia,serif;font-size:19px;color:var(--ink);background:#fffdf8;
  border:1px solid var(--rule);border-radius:14px;padding:16px 4px;cursor:pointer;text-transform:capitalize;}
.bl-choice.wrong{border-color:var(--accent);color:var(--accent);background:#f9ece7;}
.bl-padwrap{margin-top:auto;padding-bottom:20px;}
.bl-padwrap.lock{pointer-events:none;opacity:.6;}
.bl-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;max-width:280px;margin:0 auto 12px;}
.bl-key{font-family:Georgia,serif;font-size:24px;color:var(--ink);background:#fffdf8;border:1px solid var(--rule);
  border-radius:12px;padding:13px 0;cursor:pointer;-webkit-tap-highlight-color:transparent;}
.bl-key:active{background:#f1ead9;}
.bl-check{display:block;width:100%;max-width:280px;margin:0 auto;font-weight:600;font-size:15px;color:var(--paper);
  background:var(--ink);border:none;border-radius:12px;padding:14px 0;cursor:pointer;}
.bl-check:disabled{opacity:.4;}
.bl-foot{border-top:1px solid var(--rule);padding:12px 24px 18px;display:flex;justify-content:space-between;
  font-size:12px;color:var(--faint);}
@media (prefers-reduced-motion:reduce){ .bl-bird,.bl-cell.active{animation:none!important;} }
`;
