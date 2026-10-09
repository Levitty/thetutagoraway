// ============================================================================
// COLUMN ADDITION — the sum, done live. Instead of reading four static steps,
// the child WATCHES the algorithm run: the ones column lights up, 9 + 9 = 18,
// the 8 drops below the line and a little carried 1 flies up to the tens, then
// the tens add, and so on until the answer lands. Pure React + CSS, generated
// from the two numbers — tiny, offline, works for any 2–4 digit sum.
// Colour language matches the area model: active column = amber, carries = amber,
// the running total = indigo. The same "watch it work" idea later covers
// subtraction (borrowing) and long multiplication.
// ============================================================================

import React, { useEffect, useState } from 'react';

// Parse "234 + 567 = ?" into { a, b } when it's a multi-digit sum worth showing.
export const parseAddProblem = (text) => {
  if (!text) return null;
  const m = String(text).replace(/\s+/g, '').match(/^(\d+)\+(\d+)=?\??$/);
  if (!m) return null;
  const a = +m[1], b = +m[2];
  if (a < 10 && b < 10) return null;                     // no columns to carry
  if (String(a).length > 4 || String(b).length > 4) return null; // keep readable
  return { a, b };
};

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

export const ColumnAddition = ({ a, b }) => {
  const total = a + b;
  const L = Math.max(String(a).length, String(b).length, String(total).length);
  const d1 = String(a).padStart(L, ' ').split('');
  const d2 = String(b).padStart(L, ' ').split('');

  // resolve every column right-to-left so we know each result digit + carry
  const carryInto = new Array(L + 1).fill(0);
  const resultDigit = new Array(L).fill('');
  for (let r = 0; r < L; r++) {
    const i = L - 1 - r;
    const x = (d1[i] === ' ' ? 0 : +d1[i]) + (d2[i] === ' ' ? 0 : +d2[i]) + carryInto[r];
    resultDigit[i] = String(x % 10);
    carryInto[r + 1] = x >= 10 ? 1 : 0;
  }

  // phase 0 = just the numbers; 1..L = each column resolves; L+1 = answer glow
  const DONE = L + 1;
  const [phase, setPhase] = useState(prefersReduced() ? DONE : 0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (prefersReduced()) { setPhase(DONE); return; }
    setPhase(0);
    const timers = [];
    for (let p = 1; p <= DONE; p++) timers.push(setTimeout(() => setPhase(p), 700 + 1150 * p));
    return () => timers.forEach(clearTimeout);
  }, [a, b, run]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeI = phase >= 1 && phase <= L ? L - phase : -1; // display index lit now

  // running commentary for the column being added right now
  const line = (() => {
    if (activeI < 0) return phase >= DONE ? `The answer is ${total}.` : 'Line the digits up by place value.';
    const r = L - 1 - activeI;
    const v1 = d1[activeI] === ' ' ? 0 : +d1[activeI];
    const v2 = d2[activeI] === ' ' ? 0 : +d2[activeI];
    const cin = carryInto[r];
    const sum = v1 + v2 + cin;
    const place = ['ones', 'tens', 'hundreds', 'thousands'][r] || 'next';
    return `${place[0].toUpperCase() + place.slice(1)}: ${v1} + ${v2}${cin ? ` + ${cin} carried` : ''} = ${sum} → write ${sum % 10}${sum >= 10 ? ', carry 1' : ''}`;
  })();

  const CELL = 'w-11 h-12 flex items-center justify-center';
  const cellTint = (i) => (i === activeI ? 'bg-amber-100 rounded-lg' : '');
  const fade = (on) => ({ opacity: on ? 1 : 0, transition: 'opacity .4s ease, transform .4s ease' });

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col items-center font-mono tabular-nums select-none">
        {/* carries */}
        <div className="flex">
          <span className="w-8" />
          {Array.from({ length: L }).map((_, i) => {
            const r = L - 1 - i;
            const show = carryInto[r] === 1 && phase >= r; // carry into col r appears once col r-1 is done
            return (
              <span key={i} className={`${CELL} h-7`}>
                <span className="text-[15px] font-bold text-amber-500" style={{ ...fade(show), transform: show ? 'translateY(0)' : 'translateY(6px)' }}>{show ? 1 : ''}</span>
              </span>
            );
          })}
        </div>

        {/* first addend */}
        <div className="flex">
          <span className="w-8" />
          {d1.map((d, i) => <span key={i} className={`${CELL} ${cellTint(i)} text-[30px] font-bold text-slate-800`}>{d.trim()}</span>)}
        </div>

        {/* second addend, with the + sign */}
        <div className="flex">
          <span className="w-8 flex items-center justify-center text-[26px] font-bold text-slate-400">+</span>
          {d2.map((d, i) => <span key={i} className={`${CELL} ${cellTint(i)} text-[30px] font-bold text-slate-800`}>{d.trim()}</span>)}
        </div>

        {/* rule */}
        <div className="flex items-center" style={{ width: 32 + L * 44 }}>
          <span className="w-8" />
          <div className="flex-1 h-[3px] bg-slate-400 rounded-full my-1" />
        </div>

        {/* result */}
        <div className="flex">
          <span className="w-8" />
          {resultDigit.map((d, i) => {
            const r = L - 1 - i;
            const show = phase > r;                    // this digit is written once its column resolves
            const glow = phase >= DONE;
            return (
              <span key={i} className={`${CELL} ${cellTint(i)} text-[30px] font-extrabold ${glow ? 'text-emerald-600' : 'text-indigo-600'}`}>
                <span style={{ ...fade(show), transform: show ? 'translateY(0)' : 'translateY(-6px)' }}>{show ? d : ''}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* running commentary */}
      <p className="mt-3 text-center text-[14px] text-slate-600 min-h-[20px] leading-snug px-2">{line}</p>

      {phase >= DONE && (
        <div className="mt-1 text-center">
          <button onClick={() => setRun(k => k + 1)} className="text-xs text-slate-400 hover:text-amber-600 transition-colors">↺ Watch it add again</button>
        </div>
      )}
    </div>
  );
};

export default ColumnAddition;
