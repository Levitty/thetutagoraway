// ============================================================================
// THE WHITEBOARD: draws the board state (board.js) as SVG, each item from its
// own small component, and draws each stroke on over its time from the speech
// clock (`now`, ms). Nothing here reads model output directly: only items
// that passed validateTurn and applyStep exist.
//
// The board is 1000 units wide in a 2 x 3 grid of slots and scales to fit:
// 640 high on a wide screen, 1050 high on a phone held upright (taller rows,
// the same slots), so the board takes most of either screen.
// The child's ink layer (milestone 2) sits on top and no command reaches it.
// ============================================================================
import React, { useRef } from 'react';
import { parseMath, layoutMath } from './mathExpr.js';
import { drawMs } from './timeline.js';
import { drawProgress } from './board.js';
import { cellsOf } from './commands.js';

export const BOARD_W = 1000;
export const BOARD_H = 640;
export const BOARD_H_PORTRAIT = 1050;
const PAD = 16;

export const INK = {
  ink: '#1D1D27', blue: '#3557D6', red: '#D2383A', green: '#1F7A47', orange: '#E08200', purple: '#6D3FD6',
};
const FONT = '"Figtree Variable", -apple-system, "Segoe UI", Roboto, sans-serif';
const TEXT_SIZE = { s: 30, m: 42, l: 56 };
const MATH_SIZE = { s: 36, m: 48, l: 62 };

const ease = (p) => 1 - (1 - p) ** 3;
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));

export function slotRect(slot, H = BOARD_H) {
  const ROW_H = H / 3;
  const cells = cellsOf(slot);
  const row = ['top', 'middle', 'bottom'].indexOf(cells[0].split('_')[0]);
  const full = cells.length === 2;
  const right = !full && slot.endsWith('_right');
  return { x: (right ? BOARD_W / 2 : 0) + PAD, y: row * ROW_H + PAD / 2, w: (full ? BOARD_W : BOARD_W / 2) - PAD * 2, h: ROW_H - PAD };
}

const shadedSet = (shaded, parts) => new Set(Array.isArray(shaded) ? shaded : Array.from({ length: shaded }, (_, i) => i + 1).filter((i) => i <= parts));
const countOf = (shaded) => (Array.isArray(shaded) ? shaded.length : shaded);

// ---------------------------------------------------------------- geometry
// Shared by the drawings and by the marks that point at their parts.
export function barGeom(item, r) {
  const bars = [{ parts: item.parts, shaded: item.shaded }, ...(item.second_bar ? [item.second_bar] : [])];
  const labelW = item.label ? 110 : 0;
  const gap = 16;
  const h = Math.min(66, (r.h - 20 - gap * (bars.length - 1)) / bars.length);
  const w = Math.min(r.w - 24 - labelW, 760);
  const x = r.x + (r.w - w - labelW) / 2;
  const total = bars.length * h + (bars.length - 1) * gap;
  const y0 = r.y + (r.h - total) / 2;
  return bars.map((b, k) => ({ ...b, x, y: y0 + k * (h + gap), w, h, labelX: x + w + 22 }));
}
const barPart = (g, part) => ({ x: g.x + (part - 1) * g.w / g.parts, y: g.y, w: g.w / g.parts, h: g.h });

export function shapeGeom(item, r) {
  const labelH = item.label ? 44 : 0;
  const s = Math.min(r.h - 14 - labelH, item.kind === 'rectangle' ? r.w * 0.5 : r.w * 0.8);
  const cx = r.x + r.w / 2;
  const cy = r.y + (r.h - labelH) / 2 + 4;
  const w = item.kind === 'rectangle' ? s * 1.7 : s;
  const h = item.kind === 'rectangle' ? s * 0.9 : s;
  return { cx, cy, s, w, h, x: cx - w / 2, y: cy - h / 2, labelY: cy + h / 2 + 34 };
}
function shapePart(item, g, i) {
  const n = item.parts;
  if (item.kind === 'circle') {
    const a0 = -Math.PI / 2 + (i - 1) * 2 * Math.PI / n;
    const a1 = a0 + 2 * Math.PI / n;
    const R = g.s / 2;
    const am = (a0 + a1) / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = n === 1 ? '' : `M${g.cx},${g.cy} L${g.cx + R * Math.cos(a0)},${g.cy + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${g.cx + R * Math.cos(a1)},${g.cy + R * Math.sin(a1)} Z`;
    return { d, c: { x: g.cx + R * 0.6 * Math.cos(am), y: g.cy + R * 0.6 * Math.sin(am) }, r: Math.max(18, R * Math.min(0.45, Math.PI / n)) };
  }
  if (item.kind === 'triangle') {
    const apex = { x: g.cx, y: g.y };
    const bx = (k) => g.x + k * g.w / n;
    const by = g.y + g.h;
    const p0 = { x: bx(i - 1), y: by }; const p1 = { x: bx(i), y: by };
    return { d: `M${apex.x},${apex.y} L${p0.x},${p0.y} L${p1.x},${p1.y} Z`, c: { x: (apex.x + p0.x + p1.x) / 3, y: (apex.y + 2 * by) / 3 }, r: Math.max(16, g.w / n / 2.4) };
  }
  const pw = g.w / n;
  const x = g.x + (i - 1) * pw;
  return { d: `M${x},${g.y} h${pw} v${g.h} h${-pw} Z`, c: { x: x + pw / 2, y: g.cy }, r: Math.max(16, Math.min(pw, g.h) / 2.2) };
}

export function lineGeom(item, r) {
  const x0 = r.x + 34; const x1 = r.x + r.w - 34;
  const y = r.y + r.h * 0.64;
  const X = (v) => x0 + (v - item.from) / (item.to - item.from) * (x1 - x0);
  return { x0, x1, y, X };
}

function textGeom(item, r) {
  const size = TEXT_SIZE[item.size] || TEXT_SIZE.m;
  const est = item.text.length * size * 0.52;
  const fs = est > r.w ? size * r.w / est : size;
  const w = item.text.length * fs * 0.52;
  return { fs, x: r.x + (r.w - w) / 2, w, base: r.y + r.h / 2 + fs * 0.34, top: r.y + r.h / 2 - fs * 0.6, h: fs * 1.1 };
}
function mathGeom(item, r) {
  const p = parseMath(item.expr);
  if (!p.ok) return null;
  const tree = layoutMath(p.tree);
  const size = MATH_SIZE[item.size] || MATH_SIZE.m;
  const fit = Math.min(size, (r.w - 10) / Math.max(tree.box.w, 0.1), (r.h - 10) / Math.max(tree.box.a + tree.box.d, 0.1));
  const w = tree.box.w * fit;
  const hgt = (tree.box.a + tree.box.d) * fit;
  const top = r.y + (r.h - hgt) / 2;
  return { tree, fs: fit, x: r.x + (r.w - w) / 2, w, base: top + tree.box.a * fit, top, h: hgt };
}

/** The box around an item, or one of its parts: for highlight, underline and the pointer. */
export function targetBox(item, part, bar, H = BOARD_H) {
  const r = slotRect(item.slot, H);
  switch (item.cmd) {
    case 'fraction_bar': {
      const g = barGeom(item, r);
      const b = g[bar === 2 ? 1 : 0] || g[0];
      if (part) { const p = barPart(b, part); return { ...p, cx: p.x + p.w / 2, cy: p.y + p.h / 2 }; }
      const all = { x: g[0].x, y: g[0].y, w: g[0].w, h: g[g.length - 1].y + g[g.length - 1].h - g[0].y };
      return { ...all, cx: all.x + all.w / 2, cy: all.y + all.h / 2 };
    }
    case 'shape': {
      const g = shapeGeom(item, r);
      if (part) { const p = shapePart(item, g, part); return { x: p.c.x - p.r, y: p.c.y - p.r, w: p.r * 2, h: p.r * 2, cx: p.c.x, cy: p.c.y }; }
      return { x: g.x, y: g.y, w: g.w, h: g.h, cx: g.cx, cy: g.cy };
    }
    case 'number_line': {
      const g = lineGeom(item, r);
      const m = part ? item.marks[part - 1] : null;
      if (m) { const x = g.X(m.value); return { x: x - 22, y: g.y - 46, w: 44, h: 64, cx: x, cy: g.y }; }
      return { x: g.x0 - 10, y: g.y - 50, w: g.x1 - g.x0 + 20, h: 90, cx: (g.x0 + g.x1) / 2, cy: g.y };
    }
    case 'write_text': { const g = textGeom(item, r); return { x: g.x, y: g.top, w: g.w, h: g.h, cx: g.x + g.w / 2, cy: g.top + g.h / 2, base: g.base }; }
    case 'write_math': { const g = mathGeom(item, r); if (!g) return null; return { x: g.x, y: g.top, w: g.w, h: g.h, cx: g.x + g.w / 2, cy: g.top + g.h / 2, base: g.top + g.h }; }
    default: return { x: r.x, y: r.y, w: r.w, h: r.h, cx: r.x + r.w / 2, cy: r.y + r.h / 2 };
  }
}

// ---------------------------------------------------------------- items
function FractionBar({ item, p, H }) {
  const g = barGeom(item, slotRect(item.slot, H));
  const col = INK[item.colour] || INK.blue;
  return g.map((b, k) => {
    const set = shadedSet(b.shaded, b.parts);
    const order = [...set].sort((a, c) => a - c);
    const outline = ease(seg(p, 0, 0.4));
    const lines = seg(p, 0.3, 0.6);
    return (
      <g key={k}>
        {order.map((part, n) => {
          const f = ease(seg(p, 0.55 + 0.45 * n / order.length, 0.55 + 0.45 * (n + 1) / order.length));
          const r = barPart(b, part);
          return f > 0 ? <rect key={part} x={r.x} y={r.y + r.h * (1 - f)} width={r.w} height={r.h * f} fill={col} opacity={0.82} /> : null;
        })}
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill="none" stroke={INK.ink} strokeWidth={3.5} pathLength={1} strokeDasharray={`${outline} 1`} />
        {Array.from({ length: b.parts - 1 }, (_, j) => {
          const x = b.x + (j + 1) * b.w / b.parts;
          const f = seg(lines, j / (b.parts - 1), (j + 1) / (b.parts - 1));
          return <line key={j} x1={x} y1={b.y} x2={x} y2={b.y + b.h * f} stroke={INK.ink} strokeWidth={2.5} />;
        })}
        {item.label && p > 0.85 ? (
          <FracLabel x={b.labelX} cy={b.y + b.h / 2} n={countOf(b.shaded)} d={b.parts} opacity={seg(p, 0.85, 1)} />
        ) : null}
      </g>
    );
  });
}

function FracLabel({ x, cy, n, d, opacity = 1, size = 30, color = INK.ink }) {
  return (
    <g opacity={opacity} fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} textAnchor="middle">
      <text x={x + 20} y={cy - 6}>{n}</text>
      <line x1={x} x2={x + 40} y1={cy + 1} y2={cy + 1} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <text x={x + 20} y={cy + size + 2}>{d}</text>
    </g>
  );
}

function Shape({ item, p, H }) {
  const g = shapeGeom(item, slotRect(item.slot, H));
  const col = INK[item.colour] || INK.orange;
  const set = shadedSet(item.shaded, item.parts);
  const order = [...set].sort((a, c) => a - c);
  const outline = ease(seg(p, 0, 0.4));
  const lines = seg(p, 0.3, 0.6);
  const parts = Array.from({ length: item.parts }, (_, i) => shapePart(item, g, i + 1));
  const R = g.s / 2;
  const outlinePath = item.kind === 'circle' ? null
    : item.kind === 'triangle' ? `M${g.cx},${g.y} L${g.x + g.w},${g.y + g.h} L${g.x},${g.y + g.h} Z`
      : `M${g.x},${g.y} h${g.w} v${g.h} h${-g.w} Z`;
  return (
    <g>
      {order.map((part, n) => {
        const f = ease(seg(p, 0.55 + 0.45 * n / order.length, 0.55 + 0.45 * (n + 1) / order.length));
        return f > 0 ? <path key={part} d={parts[part - 1].d} fill={col} opacity={0.85 * f} /> : null;
      })}
      {item.kind === 'circle'
        ? <circle cx={g.cx} cy={g.cy} r={R} fill="none" stroke={INK.ink} strokeWidth={3.5} pathLength={1} strokeDasharray={`${outline} 1`} transform={`rotate(-90 ${g.cx} ${g.cy})`} />
        : <path d={outlinePath} fill="none" stroke={INK.ink} strokeWidth={3.5} strokeLinejoin="round" pathLength={1} strokeDasharray={`${outline} 1`} />}
      {Array.from({ length: item.parts }, (_, j) => {
        if (item.kind !== 'circle' && j === 0) return null;
        const f = seg(lines, j / item.parts, (j + 1) / item.parts);
        if (f <= 0) return null;
        if (item.kind === 'circle') {
          const a = -Math.PI / 2 + j * 2 * Math.PI / item.parts;
          return <line key={j} x1={g.cx} y1={g.cy} x2={g.cx + R * f * Math.cos(a)} y2={g.cy + R * f * Math.sin(a)} stroke={INK.ink} strokeWidth={2.5} />;
        }
        const x = g.x + j * g.w / item.parts;
        if (item.kind === 'triangle') return <line key={j} x1={g.cx} y1={g.y} x2={g.cx + (x - g.cx) * f} y2={g.y + g.h * f} stroke={INK.ink} strokeWidth={2.5} />;
        return <line key={j} x1={x} y1={g.y} x2={x} y2={g.y + g.h * f} stroke={INK.ink} strokeWidth={2.5} />;
      })}
      {item.label && p > 0.85 ? (
        <text x={g.cx} y={g.labelY} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={INK.ink} opacity={seg(p, 0.85, 1)}>{`${countOf(item.shaded)}/${item.parts}`}</text>
      ) : null}
    </g>
  );
}

function NumberLine({ item, p, H }) {
  const g = lineGeom(item, slotRect(item.slot, H));
  const grow = ease(seg(p, 0, 0.35));
  const ticks = (item.to - item.from) * item.divisions;
  return (
    <g fontFamily={FONT} fontWeight={700} fill={INK.ink}>
      <line x1={g.x0} x2={g.x0 + (g.x1 - g.x0) * grow} y1={g.y} y2={g.y} stroke={INK.ink} strokeWidth={3.5} strokeLinecap="round" />
      {Array.from({ length: ticks + 1 }, (_, k) => {
        const v = item.from + k / item.divisions;
        const whole = k % item.divisions === 0;
        if (seg(p, 0.25, 0.6) < k / Math.max(ticks, 1)) return null;
        const x = g.X(v);
        return (
          <g key={k}>
            <line x1={x} x2={x} y1={g.y - (whole ? 14 : 8)} y2={g.y + (whole ? 14 : 8)} stroke={INK.ink} strokeWidth={whole ? 3 : 2} />
            {whole ? <text x={x} y={g.y + 46} textAnchor="middle" fontSize={26}>{v}</text> : null}
          </g>
        );
      })}
      {item.jumps.map((j, k) => {
        const f = ease(seg(p, 0.55 + 0.3 * k / item.jumps.length, 0.55 + 0.3 * (k + 1) / item.jumps.length));
        if (f <= 0) return null;
        const a = g.X(j.from); const b = g.X(j.to);
        const hgt = Math.min(70, Math.abs(b - a) * 0.5 + 18);
        return <path key={k} d={`M${a},${g.y - 6} Q${(a + b) / 2},${g.y - 6 - hgt * 2} ${b},${g.y - 6}`} fill="none" stroke={INK.purple} strokeWidth={3} pathLength={1} strokeDasharray={`${f} 1`} />;
      })}
      {item.marks.map((m, k) => {
        if (p < 0.6 + 0.3 * k / Math.max(item.marks.length, 1)) return null;
        const x = g.X(m.value);
        return (
          <g key={k} fill={INK.red}>
            {m.style === 'arrow' ? <path d={`M${x},${g.y - 8} l-9,-18 h18 Z`} /> : <circle cx={x} cy={g.y} r={8} />}
            {m.label ? <text x={x} y={g.y - 34} textAnchor="middle" fontSize={24}>{m.label}</text> : null}
          </g>
        );
      })}
    </g>
  );
}

function PlotPoints({ item, p, H }) {
  const r = slotRect(item.slot, H);
  const x0 = r.x + 50, x1 = r.x + r.w - 20, y0 = r.y + r.h - 34, y1 = r.y + 10;
  const X = (v) => x0 + (v - item.x_axis.from) / (item.x_axis.to - item.x_axis.from) * (x1 - x0);
  const Y = (v) => y0 - (v - item.y_axis.from) / (item.y_axis.to - item.y_axis.from) * (y0 - y1);
  const axes = ease(seg(p, 0, 0.4));
  const shown = item.points.filter((_, k) => p >= 0.4 + 0.6 * k / item.points.length);
  return (
    <g fontFamily={FONT} fontSize={18} fill={INK.ink}>
      <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * axes} y2={y0} stroke={INK.ink} strokeWidth={2.5} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - (y0 - y1) * axes} stroke={INK.ink} strokeWidth={2.5} />
      {item.connect && shown.length > 1 ? <polyline points={shown.map((q) => `${X(q.x)},${Y(q.y)}`).join(' ')} fill="none" stroke={INK.blue} strokeWidth={2.5} /> : null}
      {shown.map((q, k) => <circle key={k} cx={X(q.x)} cy={Y(q.y)} r={6} fill={INK.blue} />)}
      {item.x_axis.name ? <text x={x1} y={y0 + 26} textAnchor="end">{item.x_axis.name}</text> : null}
      {item.y_axis.name ? <text x={x0 - 8} y={y1 + 4} textAnchor="end">{item.y_axis.name}</text> : null}
    </g>
  );
}

function Wipe({ id, box, p, children }) {
  return (
    <g>
      <defs><clipPath id={`wipe-${id}`}><rect x={box.x - 6} y={box.y - 20} width={(box.w + 12) * ease(p)} height={box.h + 40} /></clipPath></defs>
      <g clipPath={`url(#wipe-${id})`}>{children}</g>
    </g>
  );
}

function WriteText({ item, p, H }) {
  const g = textGeom(item, slotRect(item.slot, H));
  return (
    <Wipe id={item.id} box={{ x: g.x, y: g.top, w: g.w, h: g.h }} p={p}>
      <text x={g.x} y={g.base} fontFamily={FONT} fontWeight={650} fontSize={g.fs} fill={INK[item.colour] || INK.ink}>{item.text}</text>
    </Wipe>
  );
}

function MathNode({ n, x, base, fs, color }) {
  const size = fs * n.scale;
  switch (n.k) {
    case 'num': return <text x={x} y={base} fontSize={size}>{n.v}</text>;
    case 'gap': return <rect x={x + 0.1 * size} y={base - 0.78 * size} width={0.7 * size} height={0.92 * size} rx={0.12 * size} fill="none" stroke={color} strokeWidth={Math.max(2, size * 0.06)} strokeDasharray={`${size * 0.12} ${size * 0.09}`} />;
    case 'op': return <text x={x + n.box.w * fs / 2} y={base} fontSize={size} textAnchor="middle">{n.v}</text>;
    case 'seq': {
      let cx = x;
      return <>{n.parts.map((c, i) => { const el = <MathNode key={i} n={c} x={cx} base={base} fs={fs} color={color} />; cx += c.box.w * fs; return el; })}</>;
    }
    case 'br': return (
      <>
        <text x={x} y={base} fontSize={size}>(</text>
        <MathNode n={n.inner} x={x + 0.4 * fs * n.scale} base={base} fs={fs} color={color} />
        <text x={x + 0.4 * fs * n.scale + n.inner.box.w * fs} y={base} fontSize={size}>)</text>
      </>
    );
    case 'pow': return (
      <>
        <MathNode n={n.base} x={x} base={base} fs={fs} color={color} />
        <MathNode n={n.exp} x={x + n.base.box.w * fs} base={base - n.base.box.a * fs * 0.55} fs={fs} color={color} />
      </>
    );
    case 'frac': {
      const w = n.box.w * fs;
      const bar = base - 0.3 * fs * n.scale;
      const gap = 0.12 * fs * n.scale;
      return (
        <>
          <MathNode n={n.a} x={x + (w - n.a.box.w * fs) / 2} base={bar - gap - n.a.box.d * fs} fs={fs} color={color} />
          <line x1={x + 0.08 * fs} x2={x + w - 0.08 * fs} y1={bar} y2={bar} stroke={color} strokeWidth={Math.max(2.5, fs * n.scale * 0.07)} strokeLinecap="round" />
          <MathNode n={n.b} x={x + (w - n.b.box.w * fs) / 2} base={bar + gap + n.b.box.a * fs} fs={fs} color={color} />
        </>
      );
    }
    case 'mixed': return (
      <>
        <MathNode n={n.wl} x={x} base={base} fs={fs} color={color} />
        <MathNode n={n.fl} x={x + n.wl.box.w * fs + 0.1 * fs * n.scale} base={base} fs={fs} color={color} />
      </>
    );
    default: return null;
  }
}

function WriteMath({ item, p, H }) {
  const g = mathGeom(item, slotRect(item.slot, H));
  if (!g) return null;
  const color = INK[item.colour] || INK.ink;
  return (
    <Wipe id={item.id} box={{ x: g.x, y: g.top, w: g.w, h: g.h }} p={p}>
      <g fontFamily={FONT} fontWeight={700} fill={color}><MathNode n={g.tree} x={g.x} base={g.base} fs={g.fs} color={color} /></g>
    </Wipe>
  );
}

const DRAW = { fraction_bar: FractionBar, shape: Shape, number_line: NumberLine, plot_points: PlotPoints, write_text: WriteText, write_math: WriteMath };

// ---------------------------------------------------------------- marks
function Mark({ m, item, now, H }) {
  const box = targetBox(item, m.part, m.bar, H);
  if (!box) return null;
  const p = ease(drawProgress(m.at, drawMs(m), now));
  if (m.cmd === 'underline') {
    const left = m.range ? box.x + box.w * m.range[0] / Math.max(1, (item.text || item.expr).length) : box.x;
    const right = m.range ? box.x + box.w * m.range[1] / Math.max(1, (item.text || item.expr).length) : box.x + box.w;
    const y = box.y + box.h + 8;
    return <path d={`M${left},${y} Q${(left + right) / 2},${y + 5} ${right},${y - 1}`} fill="none" stroke={INK.red} strokeWidth={4.5} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />;
  }
  const pad = 10;
  if (m.style === 'glow') {
    const pulse = p < 1 ? p : 0.75 + 0.25 * Math.sin((now - m.at) / 260);
    return <rect x={box.x - pad} y={box.y - pad} width={box.w + pad * 2} height={box.h + pad * 2} rx={14} fill="#FFC93C" opacity={0.38 * pulse} stroke="#FFB400" strokeWidth={3} strokeOpacity={0.8 * pulse} />;
  }
  if (m.style === 'box') return <rect x={box.x - pad} y={box.y - pad} width={box.w + pad * 2} height={box.h + pad * 2} rx={10} fill="none" stroke={INK.red} strokeWidth={4} pathLength={1} strokeDasharray={`${p} 1`} />;
  return <ellipse cx={box.cx} cy={box.cy} rx={box.w / 2 + pad + 6} ry={box.h / 2 + pad + 4} fill="none" stroke={INK.red} strokeWidth={4} pathLength={1} strokeDasharray={`${p} 1`} transform={`rotate(-4 ${box.cx} ${box.cy})`} />;
}

// The teacher's finger: a pointer stick whose tip glides to the target.
function Pointer({ pointer, items, now, from, H }) {
  const item = items[pointer.target];
  if (!item) return null;
  const box = targetBox(item, pointer.part, pointer.bar, H);
  if (!box) return null;
  const to = pointer.part ? { x: box.cx, y: box.cy } : { x: box.cx, y: box.y + box.h + 4 };
  const start = from || { x: BOARD_W - 40, y: H - 20 };
  const p = ease(drawProgress(pointer.at, 520, now));
  const x = start.x + (to.x - start.x) * p;
  const y = start.y + (to.y - start.y) * p;
  return (
    <g pointerEvents="none">
      <line x1={x + 12} y1={y + 12} x2={x + 150} y2={y + 110} stroke="#8A5A2B" strokeWidth={9} strokeLinecap="round" />
      <line x1={x + 4} y1={y + 4} x2={x + 16} y2={y + 15} stroke="#5B3A1A" strokeWidth={7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={7} fill={INK.red} stroke="#fff" strokeWidth={2.5} />
    </g>
  );
}

export function Board({ board, now, label = 'Whiteboard', H = BOARD_H }) {
  const lastPointer = useRef({ key: null, pos: null, prev: null });
  const ptr = board.pointer;
  if (ptr) {
    const key = `${ptr.target}:${ptr.part || ''}:${ptr.at}`;
    if (lastPointer.current.key !== key) {
      lastPointer.current = { key, prev: lastPointer.current.pos, pos: null };
    }
    const item = board.items[ptr.target];
    const b = item && targetBox(item, ptr.part, ptr.bar, H);
    if (b) lastPointer.current.pos = ptr.part ? { x: b.cx, y: b.cy } : { x: b.cx, y: b.y + b.h + 4 };
  }
  return (
    <svg viewBox={`0 0 ${BOARD_W} ${H}`} className="block w-full h-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="vt-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#E9E6DA" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={BOARD_W} height={H} fill="#FFFDF6" />
      <rect x="0" y="0" width={BOARD_W} height={H} fill="url(#vt-grid)" />
      <g data-layer="tutor">
        {board.order.map((id) => {
          const item = board.items[id];
          const D = DRAW[item.cmd];
          if (!D) return null;
          return <g key={id} data-id={id}><D item={item} H={H} p={drawProgress(item.at, drawMs(item), now)} /></g>;
        })}
        {board.marks.map((m, k) => (board.items[m.target] ? <Mark key={k} m={m} item={board.items[m.target]} now={now} H={H} /> : null))}
        {ptr ? <Pointer pointer={ptr} items={board.items} now={now} from={lastPointer.current.prev} H={H} /> : null}
      </g>
      {/* The child's ink (milestone 2). No board command can reach this layer. */}
      <g data-layer="child" />
    </svg>
  );
}

export default Board;
