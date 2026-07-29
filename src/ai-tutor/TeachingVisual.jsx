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

import React from 'react';

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

const BalanceScale = ({ data }) => {
  const { left = { x: 0, units: 0 }, right = { x: 0, units: 0 }, caption } = data || {};
  const W = 340, H = 150;
  const beamY = 96, leftCx = 88, rightCx = 252;
  return (
    <div className="w-full">
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
      <div className="flex justify-between text-[11px] text-slate-400 px-6 -mt-1">
        <span>left side</span>
        <span className="text-slate-500">both sides stay equal</span>
        <span>right side</span>
      </div>
      {caption && <p className="text-center text-xs text-indigo-300 mt-1">{caption}</p>}
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
          return (
            <g key={bi}>
              {Array.from({ length: bar.d }).map((_, s) => (
                <rect key={s} x={bx + s * segW} y={y} width={segW} height={barH}
                  fill={s < bar.n ? color : 'transparent'} fillOpacity={s < bar.n ? 0.65 : 1}
                  stroke="#94a3b8" strokeWidth="1.2" />
              ))}
              <text x={bx + bw + 8} y={y + barH / 2 + 4} fontSize="13" fontWeight="700" fill={color}>{bar.label || `${bar.n}/${bar.d}`}</text>
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

// ---------------------------------------------------------------- dispatcher
const MODELS = {
  'balance': BalanceScale,
  'numberline-jump': NumberLineJump,
  'area-model': AreaModel,
  'bar-model': BarModel,
};

export const TEACHING_MODEL_TYPES = Object.keys(MODELS);

export const TeachingVisual = ({ model, className = '' }) => {
  if (!model?.type) return null;
  const Cmp = MODELS[model.type];
  if (!Cmp) return null;
  return (
    <div className={`bg-slate-900/60 border border-slate-700 rounded-xl p-3 ${className}`}>
      <Cmp data={model.data} />
    </div>
  );
};
