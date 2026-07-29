// ============================================================================
// TEACHING VISUALS — presentation models that SHOW the mathematics.
//
// These are not answer widgets (see InteractiveVisual.jsx for those). They are
// the pictures a good teacher draws on the board while explaining:
//
//   balance          an equation as a balance scale (x-bags + unit chips)
//   numberline-jump  integer / temperature change as a jump along a line
//   area-model       distribution & binomial expansion as rectangle areas
//   bar-model        fractions as shaded bars
//
// Dual-coding principle: the same idea in words AND a picture, side by side.
// A problem (or an individual worked-example step) carries
//   model: { type, data }
// and the lesson renders it with <TeachingVisual model={...} />.
// Everything is pure SVG — no dependencies, scales to phone width.
// ============================================================================

import React, { useState } from 'react';

// ---------------------------------------------------------------- balance
// data: { left: { x: 2, units: 3 }, right: { x: 0, units: 11 }, caption }
// Renders each side as x-bags (emerald) and unit chips (sky; rose if negative).
// More than 8 units collapses to a single numbered chip so big numbers stay
// readable. The beam is always level: an equation IS a balanced scale.
const CHIP = 16, GAP = 3;

function PanContents({ x, units, panCx, panY }) {
  const items = [];
  const xCount = Math.abs(x);
  const collapseX = xCount > 3;
  const unitCount = Math.abs(units);
  const collapseUnits = unitCount > 8;
  const xItems = x === 0 ? 0 : (collapseX ? 1 : xCount);
  const uItems = units === 0 ? 0 : (collapseUnits ? 1 : unitCount);
  const total = xItems + uItems;
  if (total === 0) {
    items.push(<text key="zero" x={panCx} y={panY - 8} textAnchor="middle" fontSize="11" fill="#64748b">0</text>);
    return <g>{items}</g>;
  }
  const perRow = 5;
  const rows = Math.ceil(total / perRow);
  let idx = 0;
  const place = (i) => {
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, total - row * perRow);
    const col = i % perRow;
    const rowW = inRow * (CHIP + GAP) - GAP;
    return { cx: panCx - rowW / 2 + col * (CHIP + GAP) + CHIP / 2, cy: panY - 10 - (rows - 1 - row) * (CHIP + 4) };
  };
  for (let i = 0; i < xItems; i++, idx++) {
    const { cx, cy } = place(idx);
    const neg = x < 0;
    items.push(
      <g key={`x${i}`}>
        <rect x={cx - CHIP / 2} y={cy - CHIP / 2} width={collapseX ? CHIP + 10 : CHIP} height={CHIP} rx="4"
          fill={neg ? '#9f1239' : '#065f46'} stroke={neg ? '#fb7185' : '#34d399'} strokeWidth="1" />
        <text x={cx + (collapseX ? 5 : 0)} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
          {collapseX ? `${x}x` : (neg ? '−x' : 'x')}
        </text>
      </g>
    );
  }
  for (let i = 0; i < uItems; i++, idx++) {
    const { cx, cy } = place(idx);
    const neg = units < 0;
    items.push(
      <g key={`u${i}`}>
        <circle cx={cx + (collapseUnits ? 5 : 0)} cy={cy} r={CHIP / 2 + (collapseUnits ? 4 : 0)}
          fill={neg ? '#9f1239' : '#0c4a6e'} stroke={neg ? '#fb7185' : '#38bdf8'} strokeWidth="1" />
        <text x={cx + (collapseUnits ? 5 : 0)} y={cy + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff">
          {collapseUnits ? `${units}` : (neg ? '−1' : '1')}
        </text>
      </g>
    );
  }
  return <g>{items}</g>;
}

const BalanceSvg = ({ left, right }) => {
  const W = 340, H = 150;
  const beamY = 96, leftCx = 88, rightCx = 252;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Balance scale showing the equation">
      {/* stand */}
      <rect x={W / 2 - 3} y={beamY} width="6" height="34" rx="2" fill="#475569" />
      <rect x={W / 2 - 30} y={H - 18} width="60" height="6" rx="3" fill="#475569" />
      <polygon points={`${W / 2},${beamY - 10} ${W / 2 - 8},${beamY + 2} ${W / 2 + 8},${beamY + 2}`} fill="#94a3b8" />
      {/* beam */}
      <rect x={leftCx - 40} y={beamY - 8} width={rightCx - leftCx + 80} height="5" rx="2.5" fill="#94a3b8" />
      {/* pans */}
      {[leftCx, rightCx].map((cx, i) => (
        <g key={i}>
          <line x1={cx - 34} y1={beamY - 6} x2={cx - 26} y2={beamY + 14} stroke="#64748b" strokeWidth="1.5" />
          <line x1={cx + 34} y1={beamY - 6} x2={cx + 26} y2={beamY + 14} stroke="#64748b" strokeWidth="1.5" />
          <path d={`M ${cx - 34} ${beamY + 14} Q ${cx} ${beamY + 30} ${cx + 34} ${beamY + 14} Z`} fill="#334155" stroke="#64748b" strokeWidth="1" />
        </g>
      ))}
      <PanContents x={left.x || 0} units={left.units || 0} panCx={leftCx} panY={beamY + 8} />
      <PanContents x={right.x || 0} units={right.units || 0} panCx={rightCx} panY={beamY + 8} />
    </svg>
  );
};

const BalanceScale = ({ data, interactive = false, onEvent }) => {
  const { left = { x: 0, units: 0 }, right = { x: 0, units: 0 }, caption } = data || {};
  // Interactive mode (the CPA manipulative): the student performs the legal
  // balance moves themselves and watches both pans change together.
  const initial = { left: { x: left.x || 0, units: left.units || 0 }, right: { x: right.x || 0, units: right.units || 0 }, note: null };
  const [s, setS] = useState(initial);
  const solved = interactive && s.left.x === 1 && !s.left.units && !s.right.x;
  const apply = (next, note) => {
    const ns = { ...next, note };
    setS(ns);
    if (ns.left.x === 1 && !ns.left.units && !ns.right.x && onEvent) onEvent('solved');
  };
  const moves = [];
  if (interactive && !solved) {
    const { left: L, right: R } = s;
    if (R.x) moves.push({
      label: R.x > 0 ? `Take ${R.x === 1 ? '' : R.x}x off both pans` : `Add ${-R.x === 1 ? '' : -R.x}x to both pans`,
      go: () => apply({ left: { x: L.x - R.x, units: L.units }, right: { x: 0, units: R.units } }, 'x-terms collected on the left'),
    });
    if (L.units) moves.push({
      label: L.units > 0 ? `Take ${L.units} off both pans` : `Add ${-L.units} to both pans`,
      go: () => apply({ left: { x: L.x, units: 0 }, right: { x: R.x, units: R.units - L.units } }, 'numbers collected on the right'),
    });
    if (L.x && L.x !== 1 && !L.units && !R.x && R.units % L.x === 0) moves.push({
      label: `Share both pans into ${Math.abs(L.x)} groups`,
      go: () => apply({ left: { x: 1, units: 0 }, right: { x: 0, units: R.units / L.x } }, `each group: x on one side, ${R.units / L.x} on the other`),
    });
  }
  const view = interactive ? s : { left, right };
  return (
    <div className="w-full">
      <BalanceSvg left={view.left} right={view.right} />
      <div className="flex justify-between text-[11px] text-slate-400 px-6 -mt-1">
        <span>left side</span>
        <span className="text-slate-500">both sides stay equal</span>
        <span>right side</span>
      </div>
      {!interactive && caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
      {interactive && (
        <div className="mt-2">
          {s.note && !solved && <p className="text-center text-xs text-indigo-300 mb-2">{s.note}</p>}
          {solved ? (
            <p className="text-center text-sm font-semibold text-emerald-400">One x left, balancing {s.right.units} — so x = {s.right.units}.</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {moves.map((mv, i) => (
                <button key={i} onClick={mv.go} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 border border-emerald-600/40 text-emerald-300 transition-colors">{mv.label}</button>
              ))}
            </div>
          )}
          <div className="text-center mt-1">
            <button onClick={() => setS(initial)} className="text-[11px] text-slate-500 hover:text-slate-300">reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------- numberline-jump
// data: { from, delta, to, unit, hideResult, hideDelta }
// (to = from + delta; drawn as a curved arrow). Range auto-fits from/to/0.
// hideResult / hideDelta blank out the landing value / jump size — used during
// practice so the picture scaffolds the thinking without giving the answer;
// the worked example and the reveal show the complete picture.
const NumberLineJump = ({ data }) => {
  const { from = 0, delta = 0, unit = '', hideResult = false, hideDelta = false } = data || {};
  const to = data?.to ?? from + delta;
  const lo = Math.min(from, to, 0), hi = Math.max(from, to, 0);
  const pad = Math.max(1, Math.round((hi - lo) * 0.15));
  const min = lo - pad, max = hi + pad;
  const span = max - min;
  const step = span > 40 ? 10 : span > 16 ? 5 : span > 8 ? 2 : 1;
  const W = 340, H = 110, x0 = 18, x1 = W - 18, lineY = 74;
  const px = (v) => x0 + ((v - min) / span) * (x1 - x0);
  const ticks = [];
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) ticks.push(t);
  const arcTop = 26;
  const rising = delta >= 0;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Number line: from ${from} ${rising ? 'up' : 'down'} ${Math.abs(delta)} to ${to}`}>
        <line x1={x0 - 6} y1={lineY} x2={x1 + 6} y2={lineY} stroke="#64748b" strokeWidth="2" />
        {ticks.map(t => (
          <g key={t}>
            <line x1={px(t)} y1={lineY - 5} x2={px(t)} y2={lineY + 5} stroke={t === 0 ? '#e2e8f0' : '#64748b'} strokeWidth={t === 0 ? 2 : 1} />
            <text x={px(t)} y={lineY + 18} textAnchor="middle" fontSize="10" fill={t === 0 ? '#e2e8f0' : '#94a3b8'}>{t}</text>
          </g>
        ))}
        {/* jump arc */}
        <path d={`M ${px(from)} ${lineY - 8} Q ${(px(from) + px(to)) / 2} ${arcTop} ${px(to)} ${lineY - 8}`}
          fill="none" stroke={rising ? '#34d399' : '#fb7185'} strokeWidth="2.5" strokeDasharray="1 0" markerEnd="url(#tv-arrow)" />
        <defs>
          <marker id="tv-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={rising ? '#34d399' : '#fb7185'} />
          </marker>
        </defs>
        <text x={(px(from) + px(to)) / 2} y={arcTop - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={rising ? '#34d399' : '#fb7185'}>
          {hideDelta ? `?${unit}` : `${rising ? `+${delta}` : `${delta}`}${unit}`}
        </text>
        {/* start / end markers */}
        <circle cx={px(from)} cy={lineY} r="5" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
        <circle cx={px(to)} cy={lineY} r="5" fill={hideResult ? '#334155' : (rising ? '#065f46' : '#9f1239')} stroke={hideResult ? '#94a3b8' : (rising ? '#34d399' : '#fb7185')} strokeWidth="2" strokeDasharray={hideResult ? '3 2' : undefined} />
        <text x={px(from)} y={lineY + 32} textAnchor="middle" fontSize="11" fontWeight="600" fill="#38bdf8">start {from}{unit}</text>
        <text x={px(to)} y={lineY - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill={hideResult ? '#94a3b8' : (rising ? '#34d399' : '#fb7185')}>{hideResult ? '?' : `${to}${unit}`}</text>
      </svg>
      {data?.caption && <p className="text-center text-xs text-indigo-300 mt-1">{data.caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- area-model
// data: { rows: ['a'], cols: ['x', '3'], cells: [['ax','3a']], caption }
// Distribution a(x+3) is a 1×2 rectangle; binomial (x+2)(x+5) is 2×2.
// Column/row headers are the factors; each cell shows its partial product.
const CELL_COLORS = ['#065f46', '#0c4a6e', '#7c2d92', '#92400e'];
const AreaModel = ({ data }) => {
  const { rows = [], cols = [], cells = [], caption } = data || {};
  const nR = rows.length, nC = cols.length;
  if (!nR || !nC) return null;
  const W = 340, H = nR === 1 ? 120 : 170;
  const gx = 64, gy = 34, gw = W - gx - 16, gh = H - gy - 16;
  const cw = gw / nC, ch = gh / nR;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Area model of the expansion">
        {/* column headers (factor parts across the top) */}
        {cols.map((c, j) => (
          <text key={`c${j}`} x={gx + j * cw + cw / 2} y={gy - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fbbf24">{c}</text>
        ))}
        {/* row headers (factor parts down the left) */}
        {rows.map((r, i) => (
          <text key={`r${i}`} x={gx - 12} y={gy + i * ch + ch / 2 + 4} textAnchor="end" fontSize="13" fontWeight="700" fill="#fbbf24">{r}</text>
        ))}
        {/* cells */}
        {cells.map((row, i) => row.map((cell, j) => (
          <g key={`${i}-${j}`}>
            <rect x={gx + j * cw} y={gy + i * ch} width={cw} height={ch}
              fill={CELL_COLORS[(i * nC + j) % CELL_COLORS.length]} fillOpacity="0.55"
              stroke="#94a3b8" strokeWidth="1.5" />
            <text x={gx + j * cw + cw / 2} y={gy + i * ch + ch / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#f1f5f9">{cell}</text>
          </g>
        )))}
        {/* outer brace hint */}
        <text x={gx - 12} y={gy - 10} textAnchor="end" fontSize="11" fill="#64748b">×</text>
      </svg>
      <p className="text-center text-xs text-slate-400 mt-1">whole area = add the parts{caption ? ` — ${caption}` : ''}</p>
    </div>
  );
};

// ---------------------------------------------------------------- bar-model
// data: { bars: [{ n, d, label, color }], guideAt, caption }
// Each bar is d equal segments with n shaded — fractions you can SEE.
// guideAt (0..1) draws a dashed line through ALL bars at that fraction of the
// width: "the same amount" made visible without printing the count.
const BAR_COLORS = ['#34d399', '#38bdf8', '#a78bfa'];
const BarModel = ({ data }) => {
  const { bars = [], guideAt, caption } = data || {};
  if (!bars.length) return null;
  const W = 340, barH = 30, gap = 26;
  const H = bars.length * (barH + gap) + 4;
  const bx = 14, bw = W - 70;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Fraction bar model">
        {bars.map((bar, bi) => {
          const y = bi * (barH + gap) + 4;
          const segW = bw / bar.d;
          const color = bar.color || BAR_COLORS[bi % BAR_COLORS.length];
          // parts: [{count, color, label}] colors the bar in runs (ratio bars);
          // otherwise the first n of d segments are shaded (fraction bars).
          const runColor = (s) => {
            if (!bar.parts) return s < bar.n ? color : null;
            let acc = 0;
            for (const part of bar.parts) { acc += part.count; if (s < acc) return part.color || color; }
            return null;
          };
          return (
            <g key={bi}>
              {Array.from({ length: bar.d }).map((_, s) => {
                const c = runColor(s);
                return (
                  <rect key={s} x={bx + s * segW} y={y} width={segW} height={barH}
                    fill={c || 'transparent'} fillOpacity={c ? 0.65 : 1}
                    stroke="#94a3b8" strokeWidth="1.2" />
                );
              })}
              {bar.parts && bar.parts.map((part, pi) => {
                const before = bar.parts.slice(0, pi).reduce((s, p) => s + p.count, 0);
                return part.label ? (
                  <text key={pi} x={bx + (before + part.count / 2) * segW} y={y + barH / 2 + 4}
                    textAnchor="middle" fontSize="11" fontWeight="700" fill="#f1f5f9">{part.label}</text>
                ) : null;
              })}
              <text x={bx + bw + 8} y={y + barH / 2 + 4} fontSize="13" fontWeight="700" fill={color}>{bar.label || (bar.parts ? '' : `${bar.n}/${bar.d}`)}</text>
            </g>
          );
        })}
        {guideAt != null && (
          <line x1={bx + bw * guideAt} y1={0} x2={bx + bw * guideAt} y2={H}
            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
        )}
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- ten-frame
// data: { a, b, op: '+'|'−', caption } — the K-2 workhorse. Addition fills a
// frame with a green dots then b blue dots (making-ten made visible);
// subtraction shows a dots with b of them crossed out.
const TenFrame = ({ data }) => {
  const { a = 0, b = 0, op = '+', caption } = data || {};
  const total = op === '+' ? a + b : a;
  const frames = total > 10 ? 2 : 1;
  const W = 340, cell = 30, fw = cell * 5, fh = cell * 2;
  const gapX = 20, startX = (W - (frames * fw + (frames - 1) * gapX)) / 2;
  const H = fh + 26;
  const dots = [];
  for (let i = 0; i < Math.min(total, 20); i++) {
    const f = Math.floor(i / 10), pos = i % 10;
    const col = pos % 5, row = Math.floor(pos / 5);
    const cx = startX + f * (fw + gapX) + col * cell + cell / 2;
    const cy = 8 + row * cell + cell / 2;
    const isSecond = op === '+' && i >= a;
    const crossed = op === '−' && i >= a - b;
    dots.push(
      <g key={i}>
        <circle cx={cx} cy={cy} r="10" fill={isSecond ? '#0c4a6e' : '#065f46'} stroke={isSecond ? '#38bdf8' : '#34d399'} strokeWidth="1.5" opacity={crossed ? 0.45 : 1} />
        {crossed && <>
          <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} stroke="#fb7185" strokeWidth="2.5" />
          <line x1={cx - 8} y1={cy + 8} x2={cx + 8} y2={cy - 8} stroke="#fb7185" strokeWidth="2.5" />
        </>}
      </g>
    );
  }
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Ten frame">
        {Array.from({ length: frames }).map((_, f) => (
          <g key={f}>
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x={startX + f * (fw + gapX) + (i % 5) * cell} y={8 + Math.floor(i / 5) * cell}
                width={cell} height={cell} fill="transparent" stroke="#64748b" strokeWidth="1.2" />
            ))}
          </g>
        ))}
        {dots}
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- dot-array
// data: { rows, cols }               — multiplication as an array
//     or { total, groupSize }        — division as equal groups (+ remainder)
const DotArray = ({ data }) => {
  const { caption } = data || {};
  let rows, cols, remainder = 0;
  if (data?.rows != null) { rows = data.rows; cols = data.cols; }
  else { cols = data?.groupSize || 1; rows = Math.floor((data?.total || 0) / cols); remainder = (data?.total || 0) % cols; }
  const W = 340;
  const cell = Math.min(26, 280 / Math.max(cols, 1), 150 / (rows + (remainder ? 1 : 0)));
  const gw = cols * cell, gx = (W - gw) / 2;
  const H = (rows + (remainder ? 1 : 0)) * cell + 20;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Array of dots">
        {Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={gx + c * cell + cell / 2} cy={8 + r * cell + cell / 2} r={cell * 0.32}
            fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
        )))}
        {remainder > 0 && Array.from({ length: remainder }).map((_, c) => (
          <circle key={`rem${c}`} cx={gx + c * cell + cell / 2} cy={8 + rows * cell + cell / 2} r={cell * 0.32}
            fill="#9f1239" stroke="#fb7185" strokeWidth="1.5" />
        ))}
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- clock
// data: { h, m, caption } — an analog clock face with hour + minute hands.
const ClockFace = ({ data }) => {
  const { h = 3, m = 0, caption } = data || {};
  const W = 340, R = 62, cx = W / 2, cy = R + 12, H = R * 2 + 30;
  const minAngle = (m / 60) * 2 * Math.PI - Math.PI / 2;
  const hourAngle = (((h % 12) + m / 60) / 12) * 2 * Math.PI - Math.PI / 2;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Clock showing ${h}:${String(m).padStart(2, '0')}`}>
        <circle cx={cx} cy={cy} r={R} fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const num = i === 0 ? 12 : i;
          return (
            <g key={i}>
              <line x1={cx + Math.cos(a) * (R - 6)} y1={cy + Math.sin(a) * (R - 6)} x2={cx + Math.cos(a) * (R - 2)} y2={cy + Math.sin(a) * (R - 2)} stroke="#94a3b8" strokeWidth="2" />
              <text x={cx + Math.cos(a) * (R - 16)} y={cy + Math.sin(a) * (R - 16) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#e2e8f0">{num}</text>
            </g>
          );
        })}
        <line x1={cx} y1={cy} x2={cx + Math.cos(hourAngle) * R * 0.5} y2={cy + Math.sin(hourAngle) * R * 0.5} stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={cx + Math.cos(minAngle) * R * 0.78} y2={cy + Math.sin(minAngle) * R * 0.78} stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#e2e8f0" />
      </svg>
      <p className="text-center text-xs text-indigo-300 mt-1">{caption || 'short green hand = hours · long blue hand = minutes'}</p>
    </div>
  );
};

// ---------------------------------------------------------------- money
// data: { items: [{ value, count }], caption } — Kenyan shillings: coins
// (1/5/10/20) as circles, notes (50+) as rounded rectangles.
const MoneyModel = ({ data }) => {
  const { items = [], caption } = data || {};
  const pieces = [];
  items.forEach((it, i) => { for (let c = 0; c < Math.min(it.count, 12); c++) pieces.push({ value: it.value, key: `${i}-${c}` }); });
  const W = 340, perRow = 6, size = 44;
  const rows = Math.ceil(pieces.length / perRow);
  const H = rows * (size + 10) + 14;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Kenyan money">
        {pieces.map((p, i) => {
          const r = Math.floor(i / perRow), inRow = Math.min(perRow, pieces.length - r * perRow);
          const rowW = inRow * (size + 8) - 8, x = (W - rowW) / 2 + (i % perRow) * (size + 8);
          const y = 8 + r * (size + 10);
          const note = p.value >= 50;
          return note ? (
            <g key={p.key}>
              <rect x={x} y={y + 7} width={size} height={size - 14} rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
              <text x={x + size / 2} y={y + size / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#e0f2fe">{p.value}/-</text>
            </g>
          ) : (
            <g key={p.key}>
              <circle cx={x + size / 2} cy={y + size / 2} r={size / 2 - 4} fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
              <text x={x + size / 2} y={y + size / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fef3c7">{p.value}/-</text>
            </g>
          );
        })}
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- base-ten
// data: { value (≤ 999), caption } — hundreds flats, tens rods, ones cubes.
const BaseTenBlocks = ({ data }) => {
  const { value = 0, caption } = data || {};
  const hundreds = Math.floor(value / 100), tens = Math.floor((value % 100) / 10), ones = value % 10;
  const W = 340, u = 4.4;
  const flat = u * 10, rodH = u * 10, H = Math.max(flat, rodH, 60) + 34;
  let x = 12;
  const parts = [];
  for (let i = 0; i < hundreds; i++) {
    parts.push(<g key={`h${i}`}>{Array.from({ length: 100 }).map((_, j) => (
      <rect key={j} x={x + (j % 10) * u} y={10 + Math.floor(j / 10) * u} width={u} height={u} fill="#065f46" stroke="#34d399" strokeWidth="0.4" />
    ))}</g>);
    x += flat + 8;
  }
  for (let i = 0; i < tens; i++) {
    parts.push(<g key={`t${i}`}>{Array.from({ length: 10 }).map((_, j) => (
      <rect key={j} x={x} y={10 + j * u} width={u * 1.6} height={u} fill="#0c4a6e" stroke="#38bdf8" strokeWidth="0.5" />
    ))}</g>);
    x += u * 1.6 + 6;
  }
  for (let i = 0; i < ones; i++) {
    parts.push(<rect key={`o${i}`} x={x} y={10 + rodH - u * 1.6} width={u * 1.6} height={u * 1.6} fill="#78350f" stroke="#fbbf24" strokeWidth="0.7" />);
    x += u * 1.6 + 5;
  }
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${Math.max(W, x + 10)} ${H}`} className="w-full" role="img" aria-label={`Base ten blocks showing ${value}`}>
        {parts}
        <text x="12" y={H - 8} fontSize="11" fill="#94a3b8">
          {[hundreds && `${hundreds} hundred${hundreds > 1 ? 's' : ''}`, tens && `${tens} ten${tens > 1 ? 's' : ''}`, ones && `${ones} one${ones > 1 ? 's' : ''}`].filter(Boolean).join('  +  ')}
        </text>
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- formula-triangle
// data: { top, left, right, caption } — the cover-up triangle for D=S×T,
// M=D×V and friends: cover what you want; what remains is the formula.
const FormulaTriangle = ({ data }) => {
  const { top = 'D', left = 'S', right = 'T', caption } = data || {};
  const W = 340, H = 128, cx = W / 2, ty = 14, by = H - 22, half = 62;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Formula triangle">
        <polygon points={`${cx},${ty} ${cx - half},${by} ${cx + half},${by}`} fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx - half / 2 - 8} y1={(ty + by) / 2 + 12} x2={cx + half / 2 + 8} y2={(ty + by) / 2 + 12} stroke="#64748b" strokeWidth="1.5" />
        <line x1={cx} y1={(ty + by) / 2 + 12} x2={cx} y2={by} stroke="#64748b" strokeWidth="1.5" />
        <text x={cx} y={(ty + by) / 2 + 2} textAnchor="middle" fontSize="20" fontWeight="800" fill="#34d399">{top}</text>
        <text x={cx - half / 3 - 6} y={by - 8} textAnchor="middle" fontSize="20" fontWeight="800" fill="#38bdf8">{left}</text>
        <text x={cx + half / 3 + 6} y={by - 8} textAnchor="middle" fontSize="20" fontWeight="800" fill="#fbbf24">{right}</text>
      </svg>
      <p className="text-center text-xs text-indigo-300 mt-1">{caption || `cover the one you want — ${top} = ${left} × ${right}, ${left} = ${top} ÷ ${right}`}</p>
    </div>
  );
};

// ---------------------------------------------------------------- place-value
// data: { numbers: ['12.34', '5.6'], op: '+', result: '17.94'|undefined, caption }
// The decimal-alignment chart: digits in place-value columns, points in ONE
// column. Practice omits `result`; the reveal includes it (emerald row).
const PV_HEADS = { 3: 'Th', 2: 'H', 1: 'T', 0: 'O', '-1': 't', '-2': 'h', '-3': 'th' };
const splitNum = (s) => {
  const [int, frac = ''] = String(s).split('.');
  return { int: int.split(''), frac: frac.split('') };
};
const PlaceValueChart = ({ data }) => {
  const { numbers = [], op = '', result, caption } = data || {};
  const rows = [...numbers.map(n => ({ v: n, cls: 'plain' })), ...(result != null ? [{ v: result, cls: 'result' }] : [])];
  if (!rows.length) return null;
  const parts = rows.map(r => splitNum(r.v));
  const intLen = Math.max(...parts.map(p => p.int.length));
  const fracLen = Math.max(...parts.map(p => p.frac.length));
  const cols = intLen + fracLen;
  const W = 340, cw = Math.min(34, 250 / (cols + 0.5)), rh = 26;
  const gx = (W - cw * (cols + 0.6)) / 2, gy = 24;
  const H = gy + rows.length * rh + 14;
  const colX = (i) => gx + i * cw + (i >= intLen ? cw * 0.6 : 0);   // gap for the point column
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Place value chart">
        {Array.from({ length: cols }).map((_, i) => {
          const place = i < intLen ? intLen - 1 - i : -(i - intLen + 1);
          return <text key={i} x={colX(i) + cw / 2} y={gy - 8} textAnchor="middle" fontSize="10" fill={place < 0 ? '#38bdf8' : '#94a3b8'} fontWeight="700">{PV_HEADS[place] || ''}</text>;
        })}
        {/* decimal point column marker (only when decimals exist) */}
        {fracLen > 0 && <line x1={gx + intLen * cw + cw * 0.3} y1={gy - 14} x2={gx + intLen * cw + cw * 0.3} y2={gy + rows.length * rh} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />}
        {rows.map((row, r) => {
          const p = parts[r];
          const y = gy + r * rh + rh / 2 + 4;
          const color = row.cls === 'result' ? '#34d399' : '#f1f5f9';
          return (
            <g key={r}>
              {row.cls === 'result' && <line x1={gx - 16} y1={gy + r * rh + 1} x2={gx + cols * cw + cw} y2={gy + r * rh + 1} stroke="#64748b" strokeWidth="1.5" />}
              {r === rows.length - (result != null ? 2 : 1) && op && (
                <text x={gx - 16} y={y} fontSize="14" fontWeight="700" fill="#fbbf24">{op}</text>
              )}
              {p.int.map((dgt, i) => (
                <text key={`i${i}`} x={colX(intLen - p.int.length + i) + cw / 2} y={y} textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>{dgt}</text>
              ))}
              {fracLen > 0 && <text x={gx + intLen * cw + cw * 0.3} y={y} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fbbf24">.</text>}
              {p.frac.map((dgt, i) => (
                <text key={`f${i}`} x={colX(intLen + i) + cw / 2} y={y} textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>{dgt}</text>
              ))}
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs text-indigo-300 mt-1">{caption || (fracLen > 0 ? 'decimal points stacked in one column — every digit in its place' : 'line the digits up by place value — ones under ones, tens under tens')}</p>
    </div>
  );
};

// ---------------------------------------------------------------- pattern-growth
// data: { start, diff, count, caption } — an arithmetic sequence as growing
// block towers with "+d" arrows: the constant difference made visible.
const PatternGrowth = ({ data }) => {
  const { start = 1, diff = 1, count = 4, caption } = data || {};
  const heights = Array.from({ length: count }, (_, i) => start + i * diff);
  const maxH = Math.max(...heights);
  const W = 340, unit = Math.min(14, 100 / maxH), bw = 34, gap = (W - 40 - count * bw) / (count - 1);
  const baseY = 12 + maxH * unit + 4, H = baseY + 24;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Growing pattern of blocks">
        {heights.map((h, t) => {
          const x = 20 + t * (bw + gap);
          return (
            <g key={t}>
              {Array.from({ length: h }).map((_, b) => (
                <rect key={b} x={x} y={baseY - (b + 1) * unit} width={bw} height={unit - 1.5}
                  fill={b < h - diff || t === 0 ? '#0c4a6e' : '#065f46'}
                  stroke={b < h - diff || t === 0 ? '#38bdf8' : '#34d399'} strokeWidth="0.8" rx="1.5" />
              ))}
              <text x={x + bw / 2} y={baseY + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f1f5f9">{h}</text>
              {t < count - 1 && (
                <text x={x + bw + gap / 2} y={baseY - Math.max(heights[t], heights[t + 1]) * unit / 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399">+{diff}</text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs text-indigo-300 mt-1">{caption || `each term adds the same ${diff} — that constant step is d`}</p>
    </div>
  );
};

// ---------------------------------------------------------------- fraction-grid
// data: { rows, cols, shadeRows, shadeCols, showOverlap, caption }
// The classic "fraction of a fraction" picture: shade a/b of the rows one way,
// c/d of the columns the other way — the double-shaded overlap IS the product.
const FractionGrid = ({ data }) => {
  const { rows = 1, cols = 1, shadeRows = 0, shadeCols = 0, showOverlap = false, caption } = data || {};
  const W = 340, gw = 240, gh = Math.min(150, gw * (rows / cols) * 0.8 + 40);
  const gx = (W - gw) / 2, gy = 8;
  const cw = gw / cols, ch = Math.max(18, Math.min(34, 120 / rows));
  const H = gy + rows * ch + 40;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Fraction of a fraction grid">
        {Array.from({ length: rows }).map((_, r) => Array.from({ length: cols }).map((_, c) => {
          const inRows = r < shadeRows, inCols = c < shadeCols;
          return (
            <g key={`${r}-${c}`}>
              <rect x={gx + c * cw} y={gy + r * ch} width={cw} height={ch} fill="transparent" stroke="#94a3b8" strokeWidth="1" />
              {inRows && <rect x={gx + c * cw} y={gy + r * ch} width={cw} height={ch} fill="#34d399" fillOpacity="0.35" />}
              {inCols && <rect x={gx + c * cw} y={gy + r * ch} width={cw} height={ch} fill="#38bdf8" fillOpacity="0.35" />}
              {showOverlap && inRows && inCols && (
                <rect x={gx + c * cw + 1} y={gy + r * ch + 1} width={cw - 2} height={ch - 2} fill="none" stroke="#fbbf24" strokeWidth="2" />
              )}
            </g>
          );
        }))}
        <text x={gx - 8} y={gy + (shadeRows * ch) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="700" fill="#34d399">{shadeRows}/{rows}</text>
        <text x={gx + (shadeCols * cw) / 2} y={gy + rows * ch + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#38bdf8">{shadeCols}/{cols}</text>
        {showOverlap && (
          <text x={gx + gw + 8} y={gy + 16} fontSize="12" fontWeight="700" fill="#fbbf24">{shadeRows * shadeCols}/{rows * cols}</text>
        )}
      </svg>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- shape
// data: { kind: 'rect'|'triangle'|'circle', dims, emphasis, unit, caption }
// The labeled diagram a teacher draws before any formula: dimensions on the
// figure, with the asked-about quantity emphasised (dashed outline = around,
// shaded fill = surface).
const ShapeDiagram = ({ data }) => {
  const { kind, dims = {}, emphasis, unit = 'cm', plain = false, caption } = data || {};
  const W = 340, H = 150;
  const around = emphasis === 'perimeter' || emphasis === 'circumference';
  const fill = around ? 'transparent' : '#065f46';
  const stroke = around ? '#fbbf24' : '#94a3b8';
  const dash = around ? '6 4' : undefined;
  let body = null;
  if (kind === 'oval') {
    body = <ellipse cx={W / 2} cy={(H - 24) / 2 + 6} rx="72" ry="44" fill="#065f46" fillOpacity="0.4" stroke="#94a3b8" strokeWidth="2.5" />;
  } else if (kind === 'rect' || kind === 'square') {
    const { l = 4, w = 3 } = kind === 'square' ? { l: dims.s || 4, w: dims.s || 4 } : dims;
    const scale = Math.min(200 / l, 90 / w);
    const rw = l * scale, rh = w * scale, x = (W - rw) / 2, y = (H - 30 - rh) / 2 + 10;
    body = (
      <g>
        <rect x={x} y={y} width={rw} height={rh} fill={fill} fillOpacity={around ? 1 : 0.4} stroke={stroke} strokeWidth="2.5" strokeDasharray={dash} />
        {!plain && <text x={x + rw / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#f1f5f9">{l} {unit}</text>}
        {!plain && <text x={x - 10} y={y + rh / 2 + 4} textAnchor="end" fontSize="13" fontWeight="700" fill="#f1f5f9">{w} {unit}</text>}
      </g>
    );
  } else if (kind === 'triangle') {
    const { base = 6, h = 4 } = dims;
    const scale = Math.min(200 / base, 90 / h);
    const bw = base * scale, bh = h * scale, x = (W - bw) / 2, yb = (H - 30 + bh) / 2 + 4;
    const apex = x + bw * 0.38;
    body = (
      <g>
        <polygon points={`${x},${yb} ${x + bw},${yb} ${apex},${yb - bh}`} fill={fill} fillOpacity={around ? 1 : 0.4} stroke={stroke} strokeWidth="2.5" strokeDasharray={dash} />
        {!plain && <line x1={apex} y1={yb} x2={apex} y2={yb - bh} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />}
        {!plain && <text x={x + bw / 2} y={yb + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill="#f1f5f9">{base} {unit}</text>}
        {!plain && <text x={apex + 8} y={yb - bh / 2} fontSize="13" fontWeight="700" fill="#38bdf8">{h} {unit}</text>}
      </g>
    );
  } else if (kind === 'circle') {
    const { r = 5 } = dims;
    const R = 52, cx = W / 2, cy = (H - 24) / 2 + 6;
    body = (
      <g>
        <circle cx={cx} cy={cy} r={R} fill={fill} fillOpacity={around ? 1 : 0.4} stroke={stroke} strokeWidth="2.5" strokeDasharray={dash} />
        {!plain && <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="#38bdf8" strokeWidth="2" />}
        {!plain && <circle cx={cx} cy={cy} r="2.5" fill="#38bdf8" />}
        {!plain && <text x={cx + R / 2} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#38bdf8">r = {r} {unit}</text>}
      </g>
    );
  }
  const emphasisNote = plain ? null : emphasis === 'perimeter' ? 'perimeter = the dashed distance AROUND'
    : emphasis === 'circumference' ? 'circumference = the dashed distance AROUND'
    : emphasis === 'area' ? 'area = the shaded surface INSIDE' : null;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${kind} diagram`}>{body}</svg>
      {(caption || emphasisNote) && <p className="text-center text-xs text-indigo-300 mt-1">{caption || emphasisNote}</p>}
    </div>
  );
};

// ---------------------------------------------------------------- numberline-interval
// data: { value, lo, hi, unit, ask: 'lower'|'upper'|null, caption }
// Bounds of a rounded measurement: the stated value sits mid-interval with
// brackets at the lower/upper bounds. The asked bound shows '?' in practice.
const NumberLineInterval = ({ data }) => {
  const { value = 0, lo = 0, hi = 1, unit = '', ask = null, caption } = data || {};
  const half = hi - lo, min = lo - half * 0.6, max = hi + half * 0.6, span = max - min;
  const W = 340, H = 104, x0 = 26, x1 = W - 26, lineY = 62;
  const px = (v) => x0 + ((v - min) / span) * (x1 - x0);
  const fmt = (v) => `${Math.round(v * 100) / 100}`;
  const bracket = (v, side) => {
    const hidden = ask === side;
    const color = hidden ? '#94a3b8' : '#fbbf24';
    return (
      <g>
        <line x1={px(v)} y1={lineY - 16} x2={px(v)} y2={lineY + 16} stroke={color} strokeWidth="2.5" strokeDasharray={hidden ? '3 2' : undefined} />
        <line x1={px(v)} y1={lineY - 16} x2={px(v) + (side === 'lower' ? 7 : -7)} y2={lineY - 16} stroke={color} strokeWidth="2.5" />
        <line x1={px(v)} y1={lineY + 16} x2={px(v) + (side === 'lower' ? 7 : -7)} y2={lineY + 16} stroke={color} strokeWidth="2.5" />
        <text x={px(v)} y={lineY - 24} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>{hidden ? '?' : `${fmt(v)}${unit}`}</text>
      </g>
    );
  };
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bounds of the rounded measurement">
        <line x1={x0 - 8} y1={lineY} x2={x1 + 8} y2={lineY} stroke="#64748b" strokeWidth="2" />
        <rect x={px(lo)} y={lineY - 5} width={px(hi) - px(lo)} height="10" fill="#065f46" fillOpacity="0.45" />
        {bracket(lo, 'lower')}
        {bracket(hi, 'upper')}
        <circle cx={px(value)} cy={lineY} r="5" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
        <text x={px(value)} y={lineY + 30} textAnchor="middle" fontSize="12" fontWeight="700" fill="#38bdf8">{fmt(value)}{unit} (stated)</text>
      </svg>
      <p className="text-center text-xs text-indigo-300 mt-1">{caption || 'the true value could be anywhere in the shaded band'}</p>
    </div>
  );
};

// ---------------------------------------------------------------- dispatcher
const MODELS = {
  'balance': BalanceScale,
  'numberline-jump': NumberLineJump,
  'area-model': AreaModel,
  'bar-model': BarModel,
  'fraction-grid': FractionGrid,
  'shape': ShapeDiagram,
  'numberline-interval': NumberLineInterval,
  'place-value': PlaceValueChart,
  'pattern-growth': PatternGrowth,
  'ten-frame': TenFrame,
  'dot-array': DotArray,
  'clock': ClockFace,
  'money': MoneyModel,
  'base-ten': BaseTenBlocks,
  'formula-triangle': FormulaTriangle,
};

export const TEACHING_MODEL_TYPES = Object.keys(MODELS);

// `interactive` upgrades models that support it (currently the balance scale)
// into a manipulative; `onEvent('solved')` fires when the student works it to
// completion so the lesson can book the solve as scaffolded. The key remounts
// the component when the underlying data changes, resetting manipulative state.
export const TeachingVisual = ({ model, className = '', interactive = false, onEvent }) => {
  if (!model?.type) return null;
  const Cmp = MODELS[model.type];
  if (!Cmp) return null;
  return (
    <div className={`bg-slate-900/60 border border-slate-700 rounded-xl p-3 ${className}`}>
      <Cmp key={JSON.stringify(model.data)} data={model.data} interactive={interactive} onEvent={onEvent} />
    </div>
  );
};
