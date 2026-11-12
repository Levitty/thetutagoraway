// ============================================================================
// DRAWING THE FIGURES (rendering engine phase 2): each figure of figures.js as
// a teacher's ordered pen strokes, in the felt-marker pen of the approved study,
// through the same stroke engine as every other board item.
//
//   figureStrokes(item, H)        the tutor's strokes, in her order: the frame
//                                 first, then the cuts or ticks, then what is
//                                 shaded or jumped, then the numbers. What the
//                                 child is given to handle is left out: it is
//                                 the child's (playStrokes).
//   playStrokes(item, state, H)   what the child has made of it, in the child's
//                                 own teal: their shading, marker, jumps, digits,
//                                 arm, protractor, counts, edges, points
//   figureHits(item, state, H)    where the child can tap or drag, and what each
//                                 place does: [{ key, d, control, value?, drag? }]
//   dragValue(item, hit, pt, grab, H)  the value a drag at board point pt gives
//   figureBox(item, part, bar, H)      the box round a figure or one of its parts
//
// An instrument (the protractor) and squared paper are laid on, not drawn: kind
// 'place', all at once (timing.js PLACE_MS).
// Pure: no DOM. Tested in tests/draw-figures.test.mjs.
// ============================================================================
import { PALETTE } from '../voice-tutor/commands.js';
import { CHILD_INK } from '../voice-tutor/ink.js';
import { sample, bboxOf } from './path.js';
import { handWidth } from './glyphs.js';
import { stroke, handStrokes, label, stackedFraction, hatchLines, P, f1, PEN } from './strokes.js';
import { rectOf, registerFigureBox, shapePart, BOARD_H } from './geometry.js';
import {
  FIGURE, modelParts, tickValue, landing, digitsOf, PLACE_SHORT, areaCells, areaEdges, numberline, fmt,
} from './figures.js';

const INK = PALETTE;
export const CHILD = CHILD_INK;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const has = (item, c) => (item.controls || []).includes(c);
const colourOf = (item) => INK[item.colour] || INK.blue;
const rectD = (x, y, w, h) => `M ${P(x, y)} L ${P(x + w, y)} L ${P(x + w, y + h)} L ${P(x, y + h)} Z`;
const outline = (x, y, w, h, opts) => stroke(`M ${P(x, y)} L ${P(x + w, y)} L ${P(x + w, y + h)} L ${P(x, y + h)} L ${P(x, y)}`, 'line', opts);
const dot = (x, y, opts) => stroke(`M ${P(x - 0.6, y)} L ${P(x + 0.6, y)}`, 'mark', opts);
const boxOfD = (d) => bboxOf([sample(d).pts]);
const centred = (b) => ({ ...b, cx: b.x + b.w / 2, cy: b.y + b.h / 2 });
// A circle as one stroke from the top, clockwise.
const ring = (cx, cy, R) => `M ${P(cx, cy - R)} A ${f1(R)} ${f1(R)} 0 1 1 ${P(cx, cy + R)} A ${f1(R)} ${f1(R)} 0 1 1 ${P(cx, cy - R)}`;

// ════════════════════════════════════════════════════════════ fraction
export function fractionGeom(item, r) {
  const p = item.params;
  const models = [p, ...(p.second ? [p.second] : [])];
  const n = models.length;
  if (p.shape === 'bar') {
    const labelW = p.label ? 140 : 0;
    const w = Math.min(r.w - 40 - labelW, 820);
    const h = Math.min(130, w * 0.15, (r.h - 30) / (n + 0.45 * (n - 1)));
    const gap = h * 0.45;
    const x = r.x + (r.w - w - labelW) / 2;
    const y0 = r.y + (r.h - (n * h + (n - 1) * gap)) / 2;
    return models.map((m, k) => ({ kind: 'bar', k: k + 1, m, parts: modelParts('bar', m), x, y: y0 + k * (h + gap), w, h, lab: { cx: x + w + labelW / 2 + 6, cy: y0 + k * (h + gap) + h / 2, h: Math.min(40, h * 0.36) } }));
  }
  const labelH = p.label ? 100 : 0;
  if (p.shape === 'circle') {
    const D = Math.min(r.h - 30 - labelH, (r.w - 40 - 80 * (n - 1)) / n, 500);
    const cy = r.y + (r.h - labelH) / 2 + 6;
    return models.map((m, k) => {
      const cx = r.x + r.w / 2 + (k - (n - 1) / 2) * (D + 80);
      return { kind: 'circle', k: k + 1, m, parts: modelParts('circle', m), cx, cy, s: D, x: cx - D / 2, y: cy - D / 2, w: D, h: D, lab: { cx, cy: cy + D / 2 + 58, h: Math.min(34, D * 0.11) } };
    });
  }
  const cell = Math.min(...models.map((m) => Math.min((r.h - 30 - labelH) / m.rows, ((r.w - 40 - 70 * (n - 1)) / n) / m.cols)), 64);
  const widths = models.map((m) => m.cols * cell);
  let x = r.x + (r.w - (widths.reduce((a, b) => a + b, 0) + 70 * (n - 1))) / 2;
  return models.map((m, k) => {
    const g = { kind: 'grid', k: k + 1, m, parts: modelParts('grid', m), cell, x, y: r.y + (r.h - labelH - m.rows * cell) / 2, w: m.cols * cell, h: m.rows * cell };
    g.lab = { cx: x + g.w / 2, cy: g.y + g.h + 58, h: Math.min(34, cell * 0.8) };
    x += g.w + 70;
    return g;
  });
}
/** Part i of one model: its outline `d` and its box. */
export function fractionPart(g, i) {
  if (g.kind === 'bar') { const pw = g.w / g.parts; const b = { x: g.x + (i - 1) * pw, y: g.y, w: pw, h: g.h }; return { d: rectD(b.x, b.y, b.w, b.h), box: b }; }
  if (g.kind === 'circle') { const s = shapePart({ kind: 'circle', parts: g.parts }, g, i); return { d: s.d, box: { x: s.c.x - s.r, y: s.c.y - s.r, w: 2 * s.r, h: 2 * s.r } }; }
  const row = Math.floor((i - 1) / g.m.cols); const col = (i - 1) % g.m.cols;
  const b = { x: g.x + col * g.cell, y: g.y + row * g.cell, w: g.cell, h: g.cell };
  return { d: rectD(b.x, b.y, b.w, b.h), box: b };
}
const shadeParts = (g, parts, { colour, phase, unit, id }) => {
  const out = [];
  if (g.kind === 'grid') {
    // Squares shaded from the first: whole rows as one block, then the rest of the next row.
    const cols = g.m.cols;
    if (Array.isArray(parts)) {
      for (const i of parts) { const { d, box } = fractionPart(g, i); out.push(...hatchLines(box, { colour, phase, unit: `${unit}.${i}`, clip: { id: `${id}-${unit}${i}`, d } })); }
      return out;
    }
    const full = Math.floor(parts / cols); const rest = parts % cols;
    const blocks = [];
    if (full) blocks.push({ x: g.x, y: g.y, w: g.w, h: full * g.cell });
    if (rest) blocks.push({ x: g.x, y: g.y + full * g.cell, w: rest * g.cell, h: g.cell });
    blocks.forEach((b, j) => out.push(...hatchLines(b, { colour, phase, unit: `${unit}.b${j}`, clip: { id: `${id}-${unit}b${j}`, d: rectD(b.x, b.y, b.w, b.h) } })));
    return out;
  }
  const list = Array.isArray(parts) ? parts : Array.from({ length: parts }, (_, i) => i + 1);
  for (const i of list) { const { d, box } = fractionPart(g, i); out.push(...hatchLines(g.kind === 'circle' ? boxOfD(d) : box, { colour, phase, unit: `${unit}.${i}`, clip: { id: `${id}-${unit}${i}`, d } })); }
  return out;
};
const modelControl = (k) => (k === 1 ? 'shade' : 'shade_second');
function fractionStrokes(item, r) {
  const p = item.params; const col = colourOf(item);
  const out = [];
  for (const g of fractionGeom(item, r)) {
    const ph = 5 * (g.k - 1); const n = g.parts; const u = `m${g.k}`;
    // The whole: one stroke round it, from the top-left corner (a circle from the top), clockwise.
    if (g.kind === 'circle') out.push(stroke(ring(g.cx, g.cy, g.s / 2), 'line', { phase: ph, unit: `${u}o` }));
    else out.push(outline(g.x, g.y, g.w, g.h, { phase: ph, unit: `${u}o` }));
    // The cuts.
    if (g.kind === 'bar') for (let j = 1; j < n; j += 1) { const x = g.x + j * g.w / n; out.push(stroke(`M ${P(x, g.y)} L ${P(x, g.y + g.h)}`, 'line', { phase: ph + 1, unit: `${u}c${j}` })); }
    if (g.kind === 'circle' && n > 1) {
      const R = g.s / 2;
      const at = (a) => [g.cx + R * Math.cos(a), g.cy + R * Math.sin(a)];
      const ang = (j) => -Math.PI / 2 + j * 2 * Math.PI / n;
      if (n % 2 === 0) {
        for (let j = 0; j < n / 2; j += 1) {
          let [a, b] = [at(ang(j)), at(ang(j) + Math.PI)];
          if (b[1] < a[1] - 0.5 || (Math.abs(b[1] - a[1]) <= 0.5 && b[0] < a[0])) [a, b] = [b, a];
          out.push(stroke(`M ${P(a[0], a[1])} L ${P(b[0], b[1])}`, 'line', { phase: ph + 1, unit: `${u}c${j}` }));
        }
      } else for (let j = 0; j < n; j += 1) { const b = at(ang(j)); out.push(stroke(`M ${P(g.cx, g.cy)} L ${P(b[0], b[1])}`, 'line', { phase: ph + 1, unit: `${u}c${j}` })); }
    }
    if (g.kind === 'grid') {
      const w = Math.max(2.6, PEN.width * 0.5);
      for (let j = 1; j < g.m.rows; j += 1) out.push(stroke(`M ${P(g.x, g.y + j * g.cell)} L ${P(g.x + g.w, g.y + j * g.cell)}`, 'line', { phase: ph + 1, unit: `${u}r${j}`, width: w }));
      for (let j = 1; j < g.m.cols; j += 1) out.push(stroke(`M ${P(g.x + j * g.cell, g.y)} L ${P(g.x + j * g.cell, g.y + g.h)}`, 'line', { phase: ph + 1, unit: `${u}k${j}`, width: w }));
    }
    // The tutor's shading, then its fraction (not on a model the child is shading: that is theirs to say).
    if (g.m.shaded) out.push(...shadeParts(g, g.m.shaded, { colour: col, phase: ph + 2, unit: `${u}h`, id: item.id }));
    if (p.label && g.m.shaded && !has(item, modelControl(g.k))) {
      out.push(...stackedFraction(g.m.shaded, n, g.lab.cx, g.lab.cy, g.lab.h, { colour: INK.ink, phase: ph + 3, unit: `${u}l` }));
    }
  }
  return out;
}

// ════════════════════════════════════════════════════════════ number line
export function lineFigGeom(item, r) {
  const p = item.params;
  const frac = p.label_as === 'fraction';
  const lh = clamp(r.h * 0.07, 22, 32);
  const above = p.jumps.length || has(item, 'jump') ? Math.min(230, r.h * 0.45) : Math.min(120, r.h * 0.3);
  const below = frac ? lh * 3.3 + 30 : lh + 46;
  const y = r.y + Math.max(0, (r.h - above - below) / 2) + above;
  const x0 = r.x + 56; const x1 = r.x + r.w - 56;
  const X = (v) => x0 + ((v - p.from) / (p.to - p.from)) * (x1 - x0);
  return { x0, x1, y, X, lh, frac, sp: (x1 - x0) / p.divisions, above };
}
const labelWidth = (text, h) => (text.includes('/') ? Math.max(...text.split('/').map((s) => handWidth(s, h * 0.8))) + h * 0.5 : handWidth(text, h));
/** Which ticks carry a number: as asked, thinned so numbers never touch; the ends always. */
export function labelledTicks(item, g) {
  const p = item.params;
  const all = Array.from({ length: p.divisions + 1 }, (_, k) => k);
  let ks = p.labels === 'ends' ? [0, p.divisions] : p.labels === 'wholes' ? all.filter((k) => Number.isInteger(Math.round(tickValue(p, k) * 1e6) / 1e6)) : all;
  const need = Math.max(...ks.map((k) => labelWidth(numberline.label(p, tickValue(p, k)), g.lh))) + 12;
  const every = Math.ceil(need / g.sp);
  if (every > 1) ks = ks.filter((k) => k % every === 0 || k === p.divisions);
  if (ks.length > 1 && ks[ks.length - 1] - ks[ks.length - 2] < every && ks[ks.length - 2] !== 0) ks.splice(ks.length - 2, 1);
  return ks;
}
const valueLabel = (text, cx, top, h, opts) => {
  if (text.includes('/')) {
    const [n, d] = text.split('/');
    const fh = h * 0.8;
    return stackedFraction(n, d, cx, top + fh * 1.32, fh, opts);
  }
  return label(text, cx, top, h, opts);
};
const jumpSize = (p, a, b) => {
  const s = numberline.label({ ...p, from: 0, to: p.to - p.from }, Math.abs(b - a));
  return `${b >= a ? '+' : '−'}${s}`;
};
const jumpStrokes = (p, g, j, k, colour, { phase, unit, withLabel }) => {
  const a = g.X(j.from); const b = g.X(j.to);
  const hj = Math.min(g.above - 50, Math.abs(b - a) * 0.42 + 26);
  const y = g.y - 14;
  const out = [stroke(`M ${P(a, y)} Q ${P((a + b) / 2, y - hj * 2)} ${P(b, y)}`, 'jump', { colour, phase, unit: `${unit}${k}` })];
  const dir = Math.sign(b - a) || 1;
  out.push(stroke(`M ${P(b - dir * 15, y - 17)} L ${P(b, y)} L ${P(b - dir * 21, y + 2)}`, 'jump', { colour, phase, unit: `${unit}${k}` }));
  if (withLabel) {
    const h = g.lh * 0.72;
    out.push(...label(jumpSize(p, j.from, j.to), (a + b) / 2, y - hj - h - 10, h, { colour, phase, unit: `${unit}l${k}` }));
  }
  return out;
};
const arrowDown = (x, y, opts) => [
  stroke(`M ${P(x, y - 62)} L ${P(x, y - 16)}`, 'mark', opts),
  stroke(`M ${P(x - 10, y - 30)} L ${P(x, y - 16)} L ${P(x + 10, y - 30)}`, 'mark', opts),
];
function lineFigStrokes(item, r) {
  const p = item.params; const g = lineFigGeom(item, r); const col = colourOf(item);
  const out = [stroke(`M ${P(g.x0 - 18, g.y)} L ${P(g.x1 + 18, g.y)}`, 'line', { phase: 0, unit: 'line' })];
  const ks = new Set(labelledTicks(item, g));
  for (let k = 0; k <= p.divisions; k += 1) {
    const x = g.X(tickValue(p, k));
    const big = ks.has(k) || Number.isInteger(Math.round(tickValue(p, k) * 1e6) / 1e6);
    const t = big ? 17 : 11;
    out.push(stroke(`M ${P(x, g.y - t)} L ${P(x, g.y + t)}`, 'line', { phase: 1, unit: `t${k}`, width: big ? PEN.width : PEN.width * 0.75 }));
  }
  for (const k of ks) out.push(...valueLabel(numberline.label(p, tickValue(p, k)), g.X(tickValue(p, k)), g.y + 28, g.lh, { colour: INK.ink, phase: 2, unit: `n${k}` }));
  p.jumps.forEach((j, k) => out.push(...jumpStrokes(p, g, j, k, col, { phase: 3, unit: 'j', withLabel: p.jump_label })));
  if (p.marker != null && !has(item, 'marker')) out.push(...arrowDown(g.X(p.marker), g.y, { colour: col, phase: 4, unit: 'mk' }));
  return out;
}

// ════════════════════════════════════════════════════════════ place value
export function placeGeom(item, r) {
  const p = item.params; const n = p.columns; const set = has(item, 'set');
  let cw = Math.min((r.w - 40) / n, 150);
  let head = cw * 0.46; let body = p.show === 'counters' ? cw * 1.15 : cw * 0.95; let ctrl = set ? cw * 0.6 : 0;
  const s = Math.min(1, (r.h - 24) / (head + body + ctrl));
  cw *= s; head *= s; body *= s; ctrl *= s;
  const w = cw * n;
  const x = r.x + (r.w - w) / 2; const y = r.y + (r.h - head - body - ctrl) / 2;
  return { n, cw, head, body, ctrl, x, y, w, h: head + body };
}
// Leading zeros are left blank, as a teacher leaves them; a chart of 0 shows 0 in the ones.
const shownDigits = (digits) => { const first = digits.findIndex((d) => d > 0); return digits.map((d, i) => (first < 0 ? i === digits.length - 1 : i >= first)); };
const counterSpots = (g, i, d) => Array.from({ length: d }, (_, j) => ({ x: g.x + i * g.cw + g.cw * (0.25 + 0.25 * (j % 3)), y: g.y + g.head + g.body * (0.2 + 0.3 * Math.floor(j / 3)) }));
const placeDigits = (g, digits, show, colour, phase, unitPre) => {
  const out = [];
  const on = shownDigits(digits);
  digits.forEach((d, i) => {
    if (!on[i]) return;
    if (show === 'counters') {
      // Counters one at a time, in threes, as a child counts them in.
      counterSpots(g, i, d).forEach((c, j) => out.push(dot(c.x, c.y, { colour, width: Math.min(20, g.cw * 0.15), phase, unit: `${unitPre}${i}.${j}` })));
      return;
    }
    const h = g.body * 0.48;
    out.push(...label(String(d), g.x + (i + 0.5) * g.cw, g.y + g.head + (g.body - h) / 2, h, { colour, phase, unit: `${unitPre}${i}` }));
  });
  return out;
};
function placeStrokes(item, r) {
  const p = item.params; const g = placeGeom(item, r); const col = colourOf(item);
  const out = [outline(g.x, g.y, g.w, g.h, { phase: 0, unit: 'frame' })];
  out.push(stroke(`M ${P(g.x, g.y + g.head)} L ${P(g.x + g.w, g.y + g.head)}`, 'line', { phase: 1, unit: 'head' }));
  for (let i = 1; i < g.n; i += 1) out.push(stroke(`M ${P(g.x + i * g.cw, g.y)} L ${P(g.x + i * g.cw, g.y + g.h)}`, 'line', { phase: 1, unit: `d${i}` }));
  for (let i = 0; i < g.n; i += 1) {
    const h = Math.min(g.head * 0.42, (g.cw * 0.78) / Math.max(1, PLACE_SHORT[g.n - 1 - i].length * 0.62));
    out.push(...label(PLACE_SHORT[g.n - 1 - i], g.x + (i + 0.5) * g.cw, g.y + (g.head - h) / 2, h, { colour: INK.ink, phase: 2, unit: `h${i}` }));
  }
  if (!has(item, 'set')) out.push(...placeDigits(g, digitsOf(p.value, g.n), p.show, col, 3, 'v'));
  return out;
}

// ════════════════════════════════════════════════════════════ angle
export function angleGeom(item, r) {
  const p = item.params;
  const R = Math.min((r.h - 70) / 1.1, (r.w - 60) / 2.3, 360);
  const V = { x: r.x + r.w / 2, y: r.y + (r.h - (R * 1.1 + 40)) / 2 + R * 1.1 };
  const s = p.base === 'right' ? 1 : -1;
  // A direction `deg` degrees round from the fixed arm, opening upwards.
  const at = (deg, rho) => { const a = (deg * Math.PI) / 180; return [V.x + s * rho * Math.cos(a), V.y - rho * Math.sin(a)]; };
  return { R, V, L: R * 1.08, Rp: R * 0.96, at, s };
}
const angleMarks = (g, deg, colour, phase, unit, showValue) => {
  const out = [];
  if (deg === 90) {
    const q = g.R * 0.13; const [ax, ay] = g.at(0, q); const [bx, by] = g.at(90, q); const [cx, cy] = [ax + bx - g.V.x, ay + by - g.V.y];
    out.push(stroke(`M ${P(ax, ay)} L ${P(cx, cy)} L ${P(bx, by)}`, 'line', { colour, phase, unit, width: PEN.width * 0.8 }));
  } else if (deg > 0) {
    const ra = g.R * 0.24; const [ax, ay] = g.at(0, ra); const [bx, by] = g.at(deg, ra);
    out.push(stroke(`M ${P(ax, ay)} A ${f1(ra)} ${f1(ra)} 0 0 ${g.s > 0 ? 0 : 1} ${P(bx, by)}`, 'line', { colour, phase, unit, width: PEN.width * 0.8 }));
  }
  if (showValue) {
    const h = clamp(g.R * 0.1, 20, 34);
    const [lx, ly] = g.at(deg / 2, g.R * 0.24 + h * 1.6);
    const w = handWidth(String(deg), h);
    out.push(...handStrokes(String(deg), lx - w / 2, ly - h / 2, h, { colour, phase: phase + 1, unit: `${unit}v` }));
    const rr = h * 0.14;
    out.push(stroke(ring(lx + w / 2 + rr * 2.2, ly - h / 2 + rr, rr), 'write', { colour, phase: phase + 1, unit: `${unit}d`, width: Math.max(2.4, h * 0.11) }));
  }
  return out;
};
/** The protractor, laid on at V and turned `turn` degrees: a printed instrument, two scales, numbers every 10. */
export function protractorStrokes(g, turn, { phase = 5, unit = 'prot', colour = INK.ink } = {}) {
  const t = (turn * Math.PI) / 180;
  const pt = (deg, rho) => { const a = (deg * Math.PI) / 180 + t; return [g.V.x + rho * Math.cos(a), g.V.y - rho * Math.sin(a)]; };
  const Rp = g.Rp;
  const o = { kind: 'place', phase, unit, colour, cap: false };
  const mk = (d, extra = {}) => ({ ...stroke(d, 'place', { colour, phase, unit, width: 2.2, ...extra }), cap: false });
  const arc = (rho) => { const [ax, ay] = pt(0, rho); const [bx, by] = pt(180, rho); return `M ${P(ax, ay)} A ${f1(rho)} ${f1(rho)} 0 0 0 ${P(bx, by)}`; };
  const [ex0, ey0] = pt(0, Rp); const [ex1, ey1] = pt(180, Rp);
  const out = [
    mk(`${arc(Rp)} L ${P(ex0, ey0)}`, { fill: colour, fillOpacity: 0.045, width: 0 }),
    mk(arc(Rp), { width: 2.6 }),
    mk(arc(Rp * 0.62), { width: 1.6 }),
    mk(`M ${P(ex1, ey1)} L ${P(ex0, ey0)}`, { width: 2.6 }),
  ];
  const [c0x, c0y] = pt(90, 0);
  for (let d = 0; d <= 180; d += 5) {
    const long = d % 10 === 0;
    const [ax, ay] = pt(d, Rp); const [bx, by] = pt(d, Rp * (long ? 0.89 : 0.94));
    out.push(mk(`M ${P(ax, ay)} L ${P(bx, by)}`, { width: long ? 1.9 : 1.3 }));
  }
  // The line up from the centre, inside the scales.
  const [ux, uy] = pt(90, Rp * 0.6);
  out.push(mk(`M ${P(c0x, c0y)} L ${P(ux, uy)}`, { width: 1.3 }));
  const h = clamp(Rp * 0.055, 13, 20);
  for (let d = 0; d <= 180; d += 10) {
    for (const [val, rho] of [[d, Rp * 0.71], [180 - d, Rp * 0.83]]) {
      // The end numbers sit a little up from the baseline, as they are printed.
      const [x, y] = pt(Math.max(4.5, Math.min(175.5, d)), rho);
      const w = handWidth(String(val), h);
      for (const s of handStrokes(String(val), x - w / 2, y - h / 2, h, { colour, phase, unit })) out.push({ ...s, kind: 'place', width: 1.7, cap: false });
    }
  }
  return out.map((s) => ({ ...s, ...o, width: s.width, fill: s.fill, fillOpacity: s.fillOpacity, opacity: 0.9 }));
}
function angleStrokes(item, r) {
  const p = item.params; const g = angleGeom(item, r); const col = colourOf(item);
  const [bx, by] = g.at(0, g.L);
  const out = [stroke(`M ${P(g.V.x, g.V.y)} L ${P(bx, by)}`, 'line', { phase: 0, unit: 'a1' })];
  if (!has(item, 'turn')) {
    const [mx, my] = g.at(p.degrees, g.L);
    out.push(stroke(`M ${P(g.V.x, g.V.y)} L ${P(mx, my)}`, 'line', { phase: 1, unit: 'a2' }));
    if (p.arc) out.push(...angleMarks(g, p.degrees, col, 2, 'arc', p.show_value));
  }
  if (p.protractor && !has(item, 'protractor')) out.push(...protractorStrokes(g, p.protractor_turn, { phase: 5 }));
  return out;
}

// ════════════════════════════════════════════════════════════ area and perimeter
export function areaGeom(item, r) {
  const p = item.params; const lab = p.sides ? 70 : 24;
  const cs = Math.min((r.w - 2 * lab - 20) / p.width, (r.h - 2 * lab) / p.height, 84);
  const w = cs * p.width; const h = cs * p.height;
  const x = r.x + (r.w - w) / 2; const y = r.y + (r.h - h) / 2;
  return { cs, x, y, w, h, X: (c) => x + c * cs, Y: (rr) => y + rr * cs, lh: clamp(cs * 0.36, 20, 30) };
}
const areaOutline = (p) => {
  if (!p.cut) return [[0, 0], [p.width, 0], [p.width, p.height], [0, p.height], [0, 0]];
  const cw = p.width - p.cut.w; const ch = p.cut.h;
  return [[0, 0], [cw, 0], [cw, ch], [p.width, ch], [p.width, p.height], [0, p.height], [0, 0]];
};
/** The boundary in runs (a whole side at a time), each with the side its outside is on. */
export const areaRuns = (p) => {
  const pts = areaOutline(p);
  return pts.slice(0, -1).map(([x0, y0], i) => {
    const [x1, y1] = pts[i + 1];
    // Walking clockwise, the outside is on the left.
    const out = y0 === y1 ? (x1 > x0 ? 'up' : 'down') : (y1 > y0 ? 'right' : 'left');
    return { x0, y0, x1, y1, len: Math.abs(x1 - x0) + Math.abs(y1 - y0), out };
  });
};
function areaStrokes(item, r) {
  const p = item.params; const g = areaGeom(item, r);
  const pts = areaOutline(p);
  const out = [stroke(`M ${pts.map(([c, rr]) => P(g.X(c), g.Y(rr))).join(' L ')}`, 'line', { phase: 0, unit: 'o' })];
  const cells = new Set(areaCells(p).map(({ r: rr, c }) => `${rr},${c}`));
  const inside = (rr, c) => cells.has(`${rr},${c}`);
  const w = Math.max(2.4, PEN.width * 0.45);
  // The squares: lines across, top to bottom, then down, left to right, only inside the shape.
  for (let rr = 1; rr < p.height; rr += 1) {
    let c0 = null;
    for (let c = 0; c <= p.width; c += 1) {
      const inner = c < p.width && inside(rr - 1, c) && inside(rr, c);
      if (inner && c0 == null) c0 = c;
      if (!inner && c0 != null) { out.push(stroke(`M ${P(g.X(c0), g.Y(rr))} L ${P(g.X(c), g.Y(rr))}`, 'line', { phase: 1, unit: `r${rr}.${c0}`, width: w })); c0 = null; }
    }
  }
  for (let c = 1; c < p.width; c += 1) {
    let r0 = null;
    for (let rr = 0; rr <= p.height; rr += 1) {
      const inner = rr < p.height && inside(rr, c - 1) && inside(rr, c);
      if (inner && r0 == null) r0 = rr;
      if (!inner && r0 != null) { out.push(stroke(`M ${P(g.X(c), g.Y(r0))} L ${P(g.X(c), g.Y(rr))}`, 'line', { phase: 1, unit: `c${c}.${r0}`, width: w })); r0 = null; }
    }
  }
  if (p.sides) {
    areaRuns(p).forEach((s, k) => {
      const text = `${s.len}${p.unit === 'squares' ? '' : ` ${p.unit}`}`;
      const mx = g.X((s.x0 + s.x1) / 2); const my = g.Y((s.y0 + s.y1) / 2);
      const tw = handWidth(text, g.lh);
      const at = { up: [mx, my - 18 - g.lh], down: [mx, my + 18], left: [mx - 20 - tw / 2, my - g.lh / 2], right: [mx + 20 + tw / 2, my - g.lh / 2] }[s.out];
      out.push(...label(text, at[0], at[1], g.lh, { colour: colourOf(item), phase: 2, unit: `s${k}` }));
    });
  }
  return out;
}

// ════════════════════════════════════════════════════════════ graph
export function graphGeom(item, r) {
  const p = item.params;
  const nx = (p.x.to - p.x.from) / p.x.step; const ny = (p.y.to - p.y.from) / p.y.step;
  const lh = clamp(r.h * 0.045, 18, 26);
  const widest = Math.max(...[p.y.from, p.y.to].map((v) => handWidth(String(v), lh)));
  const left = widest + 30; const bottom = lh + 30 + (p.x.name ? lh * 1.6 : 0); const top = p.y.name ? lh * 2.2 + 8 : 26; const right = 34;
  const c = Math.min((r.w - left - right) / nx, (r.h - bottom - top) / ny, 90);
  const gw = c * nx; const gh = c * ny;
  const x0 = r.x + left + (r.w - left - right - gw) / 2;
  const y0 = r.y + top + (r.h - top - bottom - gh) / 2 + gh;
  return { nx, ny, c, gw, gh, x0, y0, lh, X: (v) => x0 + ((v - p.x.from) / p.x.step) * c, Y: (v) => y0 - ((v - p.y.from) / p.y.step) * c };
}
function graphStrokes(item, r) {
  const p = item.params; const g = graphGeom(item, r); const col = colourOf(item);
  const out = [];
  // Squared paper, laid on.
  if (p.grid) {
    const sq = (d, k) => ({ ...stroke(d, 'place', { phase: 0, unit: 'paper', width: 1.5, opacity: 0.5 }), cap: false, key: k });
    for (let i = 1; i <= g.ny; i += 1) out.push(sq(`M ${P(g.x0, g.Y(p.y.from + i * p.y.step))} L ${P(g.x0 + g.gw, g.Y(p.y.from + i * p.y.step))}`));
    for (let i = 1; i <= g.nx; i += 1) out.push(sq(`M ${P(g.X(p.x.from + i * p.x.step), g.y0)} L ${P(g.X(p.x.from + i * p.x.step), g.y0 - g.gh)}`));
  }
  // The axes: across, then up.
  out.push(stroke(`M ${P(g.x0, g.y0)} L ${P(g.x0 + g.gw + 14, g.y0)}`, 'line', { phase: 1, unit: 'x' }));
  out.push(stroke(`M ${P(g.x0, g.y0)} L ${P(g.x0, g.y0 - g.gh - 14)}`, 'line', { phase: 1, unit: 'y' }));
  const both0 = p.x.from === 0 && p.y.from === 0;
  for (let i = 0; i <= g.nx; i += 1) {
    const v = p.x.from + i * p.x.step;
    if (both0 && i === 0) continue;
    out.push(...label(String(v), g.X(v), g.y0 + 14, g.lh, { colour: INK.ink, phase: 2, unit: `xn${i}` }));
  }
  if (both0) out.push(...label('0', g.x0 - 14, g.y0 + 10, g.lh, { colour: INK.ink, phase: 2, unit: 'o' }));
  for (let i = 0; i <= g.ny; i += 1) {
    const v = p.y.from + i * p.y.step;
    if (both0 && i === 0) continue;
    const w = handWidth(String(v), g.lh);
    out.push(...handStrokes(String(v), g.x0 - 14 - w, g.Y(v) - g.lh / 2, g.lh, { colour: INK.ink, phase: 3, unit: `yn${i}` }));
  }
  if (p.x.name) out.push(...label(p.x.name, g.x0 + g.gw / 2, g.y0 + g.lh + 30, g.lh * 0.95, { colour: INK.ink, phase: 4, unit: 'xname' }));
  if (p.y.name) out.push(...handOrPrintLeft(p.y.name, g.x0 - 10, g.y0 - g.gh - 20 - g.lh * 1.6, g.lh * 0.95, { colour: INK.ink, phase: 4, unit: 'yname' }));
  p.points.forEach((q, k) => {
    const x = g.X(q.x); const y = g.Y(q.y);
    out.push(dot(x, y, { colour: col, width: 15, phase: 5, unit: `p${k}` }));
    if (q.label) out.push(...label(q.label, x + 22, y - 34, g.lh * 0.85, { colour: col, phase: 5, unit: `pl${k}` }));
  });
  if (p.connect && p.points.length > 1) out.push(stroke(`M ${p.points.map((q) => P(g.X(q.x), g.Y(q.y))).join(' L ')}`, 'line', { colour: col, width: PEN.width * 0.75, phase: 6, unit: 'join' }));
  return out;
}
// A label that starts at x (the y axis's name sits over the axis, reading left to right).
const handOrPrintLeft = (text, x, top, h, opts) => {
  const strokes = label(text, 0, top, h, opts);
  const box = bboxOf(strokes.map((s) => (s.print ? [[s.print.x, 0], [s.print.x1, 0]] : s.sp.pts)));
  const dx = x - (box ? box.x : 0);
  return strokes.map((s) => shift(s, dx));
};
const shift = (s, dx) => {
  const d = s.d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, a, b) => `${f1(Number(a) + dx)} ${b}`);
  const moved = { ...s, d, sp: sample(d) };
  return s.print ? { ...moved, print: { ...s.print, x: s.print.x + dx, x1: s.print.x1 + dx } } : moved;
};

// ════════════════════════════════════════════════════════════ the doors
const GEOM = { fraction: fractionGeom, numberline: lineFigGeom, place_value: placeGeom, angle: angleGeom, area: areaGeom, graph: graphGeom };
const DRAW = { fraction: fractionStrokes, numberline: lineFigStrokes, place_value: placeStrokes, angle: angleStrokes, area: areaStrokes, graph: graphStrokes };

/** A figure's strokes (the tutor's), in the order they are drawn. */
export function figureStrokes(item, H = BOARD_H) {
  const f = DRAW[item?.type];
  return f ? f(item, rectOf(item, H)) : [];
}

/** The child's state, or the figure's own start when the child has done nothing yet. */
export const stateOf = (item, state) => state || FIGURE[item.type].start(item.params);

/** What the child has made of the figure, in their teal, drawn whole (no pen: it is their own hand). */
export function playStrokes(item, state, H = BOARD_H) {
  if (!item.controls?.length) return [];
  const p = item.params; const r = rectOf(item, H); const st = stateOf(item, state);
  const o = { colour: CHILD, phase: 0 };
  const out = [];
  switch (item.type) {
    case 'fraction':
      for (const g of fractionGeom(item, r)) {
        const key = modelControl(g.k);
        if (has(item, key) && st[key].length) out.push(...shadeParts(g, st[key], { ...o, unit: `c${g.k}`, id: `${item.id}-kid` }));
      }
      break;
    case 'numberline': {
      const g = lineFigGeom(item, r);
      st.jumps.forEach((j, k) => out.push(...jumpStrokes(p, g, j, k, CHILD, { phase: 0, unit: 'cj', withLabel: false })));
      if (has(item, 'jump')) out.push(dot(g.X(landing(p, st)), g.y, { ...o, width: 16, unit: 'land' }));
      if (has(item, 'marker')) {
        const x = g.X(st.marker);
        out.push(...arrowDown(x, g.y, { ...o, unit: 'mk', width: PEN.width * 1.1 }));
        out.push(stroke(`M ${P(x - 14, g.y - 76)} L ${P(x + 14, g.y - 76)}`, 'mark', { ...o, unit: 'grip', width: PEN.width * 1.1 }));
      }
      break;
    }
    case 'place_value': {
      const g = placeGeom(item, r);
      out.push(...placeDigits(g, st.digits, p.show, CHILD, 0, 'k'));
      for (let i = 0; i < g.n; i += 1) {
        for (const b of placeButtons(g, i)) {
          out.push(stroke(ring(b.x, b.y, b.r), 'line', { ...o, unit: `b${i}${b.by}`, width: 2.6 }));
          out.push(stroke(`M ${P(b.x - b.r * 0.5, b.y)} L ${P(b.x + b.r * 0.5, b.y)}`, 'line', { ...o, unit: `b${i}${b.by}`, width: 3 }));
          if (b.by > 0) out.push(stroke(`M ${P(b.x, b.y - b.r * 0.5)} L ${P(b.x, b.y + b.r * 0.5)}`, 'line', { ...o, unit: `b${i}${b.by}`, width: 3 }));
        }
      }
      break;
    }
    case 'angle': {
      const g = angleGeom(item, r);
      if (has(item, 'protractor')) out.push(...protractorStrokes(g, st.turn, { phase: 0 }));
      if (has(item, 'turn')) {
        const [mx, my] = g.at(st.degrees, g.L);
        out.push(stroke(`M ${P(g.V.x, g.V.y)} L ${P(mx, my)}`, 'line', { ...o, unit: 'arm' }));
        out.push(stroke(ring(mx, my, 13), 'line', { ...o, unit: 'grip', width: 3.4 }));
        if (p.arc) out.push(...angleMarks(g, st.degrees, CHILD, 0, 'carc', p.show_value));
      }
      break;
    }
    case 'area': {
      const g = areaGeom(item, r);
      const cells = areaCells(p);
      st.count.forEach((part, k) => {
        const c = cells[part - 1];
        const h = Math.min(g.cs * 0.42, 34);
        out.push(...label(String(k + 1), g.X(c.c + 0.5), g.Y(c.r + 0.5) - h / 2, h, { ...o, unit: `n${k}` }));
      });
      const edges = new Map(areaEdges(p).map((e) => [e.key, e]));
      for (const key of st.trace) {
        const e = edges.get(key);
        out.push(stroke(`M ${P(g.X(e.x0), g.Y(e.y0))} L ${P(g.X(e.x1), g.Y(e.y1))}`, 'line', { ...o, unit: `e${key}`, width: PEN.width * 1.5, opacity: 0.85 }));
      }
      break;
    }
    case 'graph': {
      const g = graphGeom(item, r);
      st.points.forEach(([x, y], k) => {
        out.push(dot(g.X(x), g.Y(y), { ...o, width: 16, unit: `k${k}` }));
        out.push(stroke(ring(g.X(x), g.Y(y), 13), 'line', { ...o, unit: `k${k}`, width: 2.6 }));
      });
      break;
    }
    default:
  }
  return out;
}

const placeButtons = (g, i) => {
  const rr = Math.min(g.ctrl * 0.3, g.cw * 0.17);
  const cy = g.y + g.h + g.ctrl * 0.55; const cx = g.x + (i + 0.5) * g.cw;
  return [{ x: cx - g.cw * 0.22, y: cy, r: rr, by: -1 }, { x: cx + g.cw * 0.22, y: cy, r: rr, by: 1 }];
};
const circleD = (x, y, rr) => `M ${P(x - rr, y)} A ${f1(rr)} ${f1(rr)} 0 1 0 ${P(x + rr, y)} A ${f1(rr)} ${f1(rr)} 0 1 0 ${P(x - rr, y)} Z`;

/** Where the child can act on the figure: [{ key, d, control, value?, drag? }], the topmost last. */
export function figureHits(item, state, H = BOARD_H) {
  if (!item.controls?.length) return [];
  const p = item.params; const r = rectOf(item, H); const st = stateOf(item, state);
  const out = [];
  switch (item.type) {
    case 'fraction':
      for (const g of fractionGeom(item, r)) {
        const control = modelControl(g.k);
        if (!has(item, control)) continue;
        for (let i = g.m.shaded + 1; i <= g.parts; i += 1) out.push({ key: `${control}${i}`, d: fractionPart(g, i).d, control, value: i });
      }
      break;
    case 'numberline': {
      const g = lineFigGeom(item, r);
      if (has(item, 'marker')) out.push({ key: 'marker', d: rectD(g.x0 - 30, g.y - 110, g.x1 - g.x0 + 60, 140), control: 'marker', drag: true });
      if (has(item, 'jump')) {
        const rr = Math.min(g.sp * 0.5, 36);
        for (let k = 0; k <= p.divisions; k += 1) out.push({ key: `tick${k}`, d: circleD(g.X(tickValue(p, k)), g.y, rr), control: 'jump', value: tickValue(p, k) });
      }
      break;
    }
    case 'place_value': {
      const g = placeGeom(item, r);
      for (let i = 0; i < g.n; i += 1) {
        out.push({ key: `col${i}`, d: rectD(g.x + i * g.cw, g.y + g.head, g.cw, g.body), control: 'set', value: { col: i, by: 1 } });
        for (const b of placeButtons(g, i)) out.push({ key: `col${i}${b.by > 0 ? 'up' : 'down'}`, d: circleD(b.x, b.y, b.r * 1.5), control: 'set', value: { col: i, by: b.by } });
      }
      break;
    }
    case 'angle': {
      const g = angleGeom(item, r);
      const half = (rho) => { const [ax, ay] = g.at(0, rho); const [bx, by] = g.at(180, rho); return `M ${P(ax, ay)} A ${f1(rho)} ${f1(rho)} 0 0 ${g.s > 0 ? 0 : 1} ${P(bx, by)} Z`; };
      if (has(item, 'protractor')) out.push({ key: 'protractor', d: half(g.Rp), control: 'protractor', drag: true });
      if (has(item, 'turn')) {
        if (has(item, 'protractor')) { const [mx, my] = g.at(st.degrees, g.L); out.push({ key: 'arm', d: circleD(mx, my, 46), control: 'turn', drag: true }); }
        else out.push({ key: 'arm', d: half(g.L + 40), control: 'turn', drag: true });
      }
      break;
    }
    case 'area': {
      const g = areaGeom(item, r);
      if (has(item, 'count')) areaCells(p).forEach((c, k) => out.push({ key: `sq${k + 1}`, d: rectD(g.X(c.c), g.Y(c.r), g.cs, g.cs), control: 'count', value: k + 1 }));
      if (has(item, 'trace')) {
        const b = Math.min(18, g.cs * 0.3);
        for (const e of areaEdges(p)) {
          const x = Math.min(g.X(e.x0), g.X(e.x1)) - b; const y = Math.min(g.Y(e.y0), g.Y(e.y1)) - b;
          out.push({ key: e.key, d: rectD(x + (e.y0 === e.y1 ? b * 0.8 : 0), y + (e.x0 === e.x1 ? b * 0.8 : 0), Math.abs(g.X(e.x1) - g.X(e.x0)) + 2 * b - (e.y0 === e.y1 ? b * 1.6 : 0), Math.abs(g.Y(e.y1) - g.Y(e.y0)) + 2 * b - (e.x0 === e.x1 ? b * 1.6 : 0)), control: 'trace', value: e.key });
        }
      }
      break;
    }
    case 'graph': {
      const g = graphGeom(item, r);
      for (let i = 0; i <= g.nx; i += 1) {
        for (let j = 0; j <= g.ny; j += 1) {
          const x = p.x.from + i * p.x.step; const y = p.y.from + j * p.y.step;
          out.push({ key: `pt${i}.${j}`, d: circleD(g.X(x), g.Y(y), g.c * 0.45), control: 'place', value: [x, y] });
        }
      }
      break;
    }
    default:
  }
  return out;
}

const degAt = (g, pt) => {
  const dx = (pt.x - g.V.x) * g.s; const dy = g.V.y - pt.y;
  let a = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (a < -90) a += 360;   // below the line on the far side counts as 180
  return a;
};
/**
 * The value a drag gives. `pt` is the pointer on the board; `grab` = { pt, value } where the drag began
 * (a protractor turns by how far the pointer has gone round, not to where it points).
 */
export function dragValue(item, control, pt, grab, H = BOARD_H) {
  const r = rectOf(item, H);
  if (item.type === 'numberline' && control === 'marker') {
    const p = item.params; const g = lineFigGeom(item, r);
    return p.from + ((clamp(pt.x, g.x0, g.x1) - g.x0) / (g.x1 - g.x0)) * (p.to - p.from);
  }
  if (item.type === 'angle') {
    const g = angleGeom(item, r);
    if (control === 'turn') return clamp(degAt(g, pt), 0, 180);
    if (control === 'protractor') {
      const raw = (a) => (Math.atan2(g.V.y - a.y, a.x - g.V.x) * 180) / Math.PI;
      let d = raw(pt) - raw(grab.pt);
      if (d > 180) d -= 360; if (d < -180) d += 360;
      return clamp(grab.value + d, -90, 90);
    }
  }
  return null;
}

/** The box round a figure, or round one of its parts (for highlight, underline and point). */
export function figureBox(item, part, bar, H = BOARD_H) {
  const r = rectOf(item, H); const p = item.params;
  const all = (b) => centred(b);
  switch (item.type) {
    case 'fraction': {
      const gs = fractionGeom(item, r);
      const g = gs[bar === 2 && gs[1] ? 1 : 0];
      if (part) return centred(fractionPart(g, part).box);
      return bar ? all(g) : all(bboxOf(gs.map((x) => [[x.x, x.y], [x.x + x.w, x.y + x.h]])));
    }
    case 'numberline': {
      const g = lineFigGeom(item, r);
      if (part && p.jumps.length) {
        const j = p.jumps[part - 1]; const a = g.X(j.from); const b = g.X(j.to);
        const hj = Math.min(g.above - 50, Math.abs(b - a) * 0.42 + 26);
        return all({ x: Math.min(a, b), y: g.y - 14 - hj, w: Math.abs(b - a), h: hj + 14 });
      }
      if (part) { const x = g.X(tickValue(p, part - 1)); return { x: x - 22, y: g.y - 30, w: 44, h: 60 + g.lh * (g.frac ? 2.6 : 1), cx: x, cy: g.y }; }
      return all({ x: g.x0 - 18, y: g.y - 40, w: g.x1 - g.x0 + 36, h: 80 });
    }
    case 'place_value': {
      const g = placeGeom(item, r);
      if (part) return all({ x: g.x + (part - 1) * g.cw, y: g.y, w: g.cw, h: g.h });
      return all({ x: g.x, y: g.y, w: g.w, h: g.h });
    }
    case 'angle': {
      const g = angleGeom(item, r);
      if (part) {
        const deg = part === 1 ? 0 : p.degrees;
        const [x, y] = g.at(deg, g.L * 0.7);
        return { x: x - 24, y: y - 24, w: 48, h: 48, cx: x, cy: y };
      }
      return all({ x: g.V.x - g.L, y: g.V.y - g.L, w: 2 * g.L, h: g.L + 10 });
    }
    case 'area': {
      const g = areaGeom(item, r);
      if (part) { const c = areaCells(p)[part - 1]; return all({ x: g.X(c.c), y: g.Y(c.r), w: g.cs, h: g.cs }); }
      return all({ x: g.x, y: g.y, w: g.w, h: g.h });
    }
    case 'graph': {
      const g = graphGeom(item, r);
      if (part) { const q = p.points[part - 1]; const x = g.X(q.x); const y = g.Y(q.y); return { x: x - 16, y: y - 16, w: 32, h: 32, cx: x, cy: y }; }
      return all({ x: g.x0, y: g.y0 - g.gh, w: g.gw, h: g.gh });
    }
    default: return all(r);
  }
}
registerFigureBox(figureBox);

export const figureGeom = (item, H = BOARD_H) => GEOM[item.type]?.(item, rectOf(item, H));
export default { figureStrokes, playStrokes, figureHits, dragValue, figureBox, protractorStrokes, fmt };
