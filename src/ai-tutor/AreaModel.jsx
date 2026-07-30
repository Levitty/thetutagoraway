// ============================================================================
// AREA MODEL — the working, drawn. For a × b where a is 2-digit and b a single
// digit, the rectangle splits into two partial-product regions that fill in and
// then sum, so the child SEES 30×9=270 and 4×9=36 become 306 instead of a hidden
// leap. Pure SVG, generated from the numbers — tiny, offline, scales to any
// 2-digit × 1-digit problem. Colour language: tens = blue, ones = green,
// the total = gold. The same picture later generalises to 2×2 and to algebra.
// ============================================================================

import React, { useEffect, useState } from 'react';

// Parse a worked-example problem string like "34 × 9" into factors, if it's a
// simple 2-digit × 1-digit multiplication we can draw. Returns null otherwise.
export const parseAreaProblem = (text) => {
  if (!text) return null;
  const m = String(text).replace(/\s+/g, '').match(/^(\d+)[×x*](\d+)$/i);
  if (!m) return null;
  let a = +m[1], b = +m[2];
  // put the 2-digit factor as `a` (the one we split), single digit as `b`
  if (a < 10 && b >= 10) [a, b] = [b, a];
  if (a >= 10 && a <= 99 && b >= 2 && b <= 9) return { a, b };
  return null;
};

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

export const AreaModel = ({ a, b }) => {
  const tens = Math.floor(a / 10) * 10;
  const ones = a % 10;
  const p1 = tens * b;
  const p2 = ones * b;
  const total = p1 + p2;

  // reveal steps: 1 split · 2 tens region · 3 ones region · 4 sum
  const [step, setStep] = useState(prefersReduced() ? 4 : 0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (prefersReduced()) { setStep(4); return; }
    setStep(0);
    const t = [1, 2, 3, 4].map((s, i) => setTimeout(() => setStep(s), 650 * (i + 1)));
    return () => t.forEach(clearTimeout);
  }, [a, b, key]);

  // geometry
  const X0 = 56, Y0 = 44, RW = 264, RH = 88;
  const onesFrac = Math.min(0.4, Math.max(0.24, ones / a)); // readable, roughly to scale
  const tensW = RW * (1 - onesFrac);
  const onesW = RW * onesFrac;
  const splitX = X0 + tensW;
  const fade = (on) => ({ opacity: on ? 1 : 0, transition: 'opacity .45s ease' });

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <svg viewBox="0 0 340 150" className="w-full" role="img" aria-label={`${a} times ${b} shown as an area model`}>
        {/* dimension labels */}
        <text x={X0 + tensW / 2} y={Y0 - 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700, ...fade(step >= 1) }}>{tens}</text>
        <text x={splitX + onesW / 2} y={Y0 - 10} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700, ...fade(step >= 1) }}>{ones}</text>
        <text x={X0 - 16} y={Y0 + RH / 2 + 5} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 13, fontWeight: 700 }}>{b}</text>

        {/* tens region */}
        <rect x={X0} y={Y0} width={tensW} height={RH} rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" style={fade(step >= 2)} />
        <text x={X0 + tensW / 2} y={Y0 + RH / 2 + 7} textAnchor="middle" fill="#1d4ed8" style={{ fontSize: 22, fontWeight: 800, ...fade(step >= 2) }}>{p1}</text>

        {/* ones region */}
        <rect x={splitX} y={Y0} width={onesW} height={RH} rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" style={fade(step >= 3)} />
        <text x={splitX + onesW / 2} y={Y0 + RH / 2 + 6} textAnchor="middle" fill="#15803d" style={{ fontSize: 16, fontWeight: 800, ...fade(step >= 3) }}>{p2}</text>

        {/* outline + split line */}
        <rect x={X0} y={Y0} width={RW} height={RH} rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1={splitX} y1={Y0} x2={splitX} y2={Y0 + RH} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" style={fade(step >= 1)} />
      </svg>

      {/* the arithmetic, revealed in step with the picture */}
      <div className="mt-2 space-y-1.5 text-[15px] tabular-nums" style={{ minHeight: 78 }}>
        <div className="flex items-center gap-2" style={fade(step >= 2)}>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />
          <span className="text-slate-700">{tens} × {b} = <b className="text-[#1d4ed8]">{p1}</b></span>
        </div>
        <div className="flex items-center gap-2" style={fade(step >= 3)}>
          <span className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]" />
          <span className="text-slate-700">{ones} × {b} = <b className="text-[#15803d]">{p2}</b></span>
        </div>
        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between" style={fade(step >= 4)}>
          <span className="text-slate-700">{p1} + {p2} =</span>
          <span className="font-extrabold text-slate-900">{total}</span>
        </div>
      </div>

      {step >= 4 && (
        <button onClick={() => setKey(k => k + 1)} className="mt-2 text-xs text-slate-400 hover:text-amber-600 transition-colors">↺ Watch again</button>
      )}
    </div>
  );
};

export default AreaModel;
