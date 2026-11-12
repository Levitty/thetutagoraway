// ============================================================================
// THE STROKES: every board item as the ordered pen strokes a teacher would
// make, in her order and direction (the approved study, pen B "felt marker",
// Build/render-engine/phase0/study.html).
//
//   itemStrokes(item, H)          a drawn item (write_text, write_math,
//                                 fraction_bar, shape, number_line, plot_points)
//   markStrokes(mark, item, H)    a highlight, underline or point on an item
//
// Each stroke: { d, kind, colour, width, len, sp, phase, unit, ... }
//   kind    line (ruled), write (handwriting or print), hatch (shading),
//           jump (a number-line jump), mark (highlight, underline, point)
//   d       the path, one pen-down, drawn from its first point to its last
//   sp      the sampled path (path.js): its length and points, for the pen tip
//   phase   the stage of the drawing (outline, cuts, shading, label ...)
//   unit    strokes of one unit (a letter, a number, one part's shading) follow
//           each other closely; timing.js pauses a little more between units
//   clip    { id, d }: shading is kept inside its part
//   print   { text, x, base, fs }: a word of Figtree print, revealed left to right
//   dash    the stroke is dashed (a missing number's box)
//   cap     felt-marker ends: a touch more ink where the stroke starts and stops
// Pure: no DOM, no clock. Tested in tests/draw-engine.test.mjs.
// ============================================================================
import { PALETTE } from '../voice-tutor/commands.js';
import { sample, bboxOf } from './path.js';
import { handwrite, handWidth, GLYPHS } from './glyphs.js';
import { printWords, PRINT_WEIGHT } from './print.js';
import { figureStrokes } from './figureDraw.js';
import {
  rectOf, barGeom, barPart, shapeGeom, shapePart, lineGeom, plotGeom, textGeom, mathGeom, targetBox,
  shadedSet, countOf, CAP, BOARD_H,
} from './geometry.js';

// Pen B, the felt marker (study.html PENS.B).
export const PEN = { width: 6.6, hatch: 15, ends: true };
export const KINDS = ['line', 'write', 'hatch', 'jump', 'mark', 'place'];
export const HIGHLIGHTER = '#FFC93C';
const INK = PALETTE;

export const f1 = (v) => Math.round(v * 10) / 10;
export const P = (x, y) => `${f1(x)} ${f1(y)}`;

export function stroke(d, kind, { colour = INK.ink, width = PEN.width, phase = 0, unit = 0, ...rest } = {}) {
  const sp = sample(d);
  return { d, kind, colour, width, len: sp.len, sp, phase, unit: String(unit), cap: PEN.ends && kind !== 'hatch' && kind !== 'place' && !rest.highlighter, ...rest };
}

// Handwriting is a little finer than a ruled line, and finer still when small.
export const writeWidth = (h) => Math.max(3, Math.min(PEN.width * 0.95, h * 0.14));

/** Handwritten text from (x, top), `h` high, as write strokes; each letter is its own unit. */
export function handStrokes(text, x, top, h, { colour, phase, unit }) {
  const width = writeWidth(h);
  return handwrite(text, x, top, h).map((g) => stroke(g.d, 'write', { colour, width, phase, unit: `${unit}.${g.letter}` }));
}

export const PRINT_INK = 1.6;
/** Figtree print, word by word. */
export function printStrokes(text, x, base, fs, { colour, phase, unit }) {
  return printWords(text, x, fs).map((wd, k) => {
    const y = base - fs * 0.32;
    // Print is written a little quicker than handwriting: its time is that of 1.6 times the word's width.
    return { ...stroke(`M ${P(wd.x0, y)} L ${P(wd.x1, y)}`, 'write', { colour, phase, unit: `${unit}.${k}` }), len: (wd.x1 - wd.x0) * PRINT_INK, cap: false, print: { text: wd.text, x: wd.x0, x1: wd.x1, base, fs, weight: PRINT_WEIGHT } };
  });
}

/** A label: handwriting when it can be, print otherwise. `cx` centres it; `top` is its top. */
export function label(text, cx, top, h, opts) {
  if ([...text].every((c) => c === ' ' || GLYPHS[c])) {
    const w = handWidth(text, h);
    return handStrokes(text, cx - w / 2, top, h, opts);
  }
  const fs = h / CAP;
  const words = printWords(text, 0, fs);
  const w = words.length ? words[words.length - 1].x1 : 0;
  return printStrokes(text, cx - w / 2, top + h, fs, opts);
}

/** A stacked fraction, written as a teacher writes it: the top number, the bar, the bottom number. */
export function stackedFraction(n, d, cx, cy, h, opts) {
  const gap = h * 0.32;
  const wn = handWidth(String(n), h); const wd = handWidth(String(d), h);
  const half = Math.max(wn, wd) / 2 + h * 0.22;
  return [
    ...handStrokes(String(n), cx - wn / 2, cy - gap - h, h, { ...opts, unit: `${opts.unit}n` }),
    stroke(`M ${P(cx - half, cy)} L ${P(cx + half, cy)}`, 'write', { ...opts, width: writeWidth(h), unit: `${opts.unit}b` }),
    ...handStrokes(String(d), cx - wd / 2, cy + gap, h, { ...opts, unit: `${opts.unit}d` }),
  ];
}

// ---------------------------------------------------------------- shading
// Close parallel strokes, lower left to upper right, a hand's slightly uneven
// spacing; each runs a little past the part and the clip keeps it inside.
const GAPS = [13.5, 13, 14.2, 13.4, 13.9, 13.2, 14, 13.6];   // under the pen's width: no paper shows between strokes
export function hatchLines(box, { colour, phase, unit, clip }) {
  const e = PEN.hatch * 0.6;
  const x0 = box.x - e; const y0 = box.y - e; const x1 = box.x + box.w + e; const y1 = box.y + box.h + e;
  const out = [];
  // Lines x + y = c, from the top-left corner to the bottom-right one.
  let c = x0 + y0 + GAPS[0] * 0.5;
  for (let k = 0; c < x1 + y1; k += 1) {
    // Where the line enters at the bottom (or left) and leaves at the top (or right) of the box.
    const ax = Math.max(x0, c - y1); const ay = c - ax;
    const bx = Math.min(x1, c - y0); const by = c - bx;
    if (bx - ax > 1) out.push(stroke(`M ${P(ax, ay)} L ${P(bx, by)}`, 'hatch', { colour, width: PEN.hatch, phase, unit, clip, opacity: 0.82 }));
    c += GAPS[k % GAPS.length] * Math.SQRT2;
  }
  return out;
}

// ---------------------------------------------------------------- items
function fractionBar(item, H) {
  const g = barGeom(item, rectOf(item, H));
  const col = INK[item.colour] || INK.blue;
  const out = [];
  g.forEach((b, k) => {
    // Outline: one stroke from the top-left corner, clockwise.
    out.push(stroke(`M ${P(b.x, b.y)} L ${P(b.x + b.w, b.y)} L ${P(b.x + b.w, b.y + b.h)} L ${P(b.x, b.y + b.h)} L ${P(b.x, b.y)}`, 'line', { phase: 4 * k, unit: `o${k}` }));
    // The cuts, left to right, each top to bottom.
    for (let j = 1; j < b.parts; j += 1) {
      const x = b.x + j * b.w / b.parts;
      out.push(stroke(`M ${P(x, b.y)} L ${P(x, b.y + b.h)}`, 'line', { phase: 4 * k + 1, unit: `c${k}.${j}` }));
    }
    // The shading, part by part.
    for (const part of [...shadedSet(b.shaded, b.parts)].sort((a, c) => a - c)) {
      const r = barPart(b, part);
      const clip = { id: `${item.id}-b${k}p${part}`, d: `M ${P(r.x, r.y)} L ${P(r.x + r.w, r.y)} L ${P(r.x + r.w, r.y + r.h)} L ${P(r.x, r.y + r.h)} Z` };
      out.push(...hatchLines(r, { colour: col, phase: 4 * k + 2, unit: `h${k}.${part}`, clip }));
    }
    if (item.label) {
      const h = Math.max(16, Math.min(40, b.h * 0.4));
      out.push(...stackedFraction(countOf(b.shaded), b.parts, b.labelX + h * 0.8, b.y + b.h / 2, h, { colour: INK.ink, phase: 4 * k + 3, unit: `l${k}` }));
    }
  });
  return out;
}

function shape(item, H) {
  const g = shapeGeom(item, rectOf(item, H));
  const col = INK[item.colour] || INK.orange;
  const n = item.parts;
  const out = [];
  const R = g.s / 2;
  // Outline. A circle from the top, clockwise; a rectangle from its top-left corner; a triangle from the top.
  if (item.kind === 'circle') out.push(stroke(`M ${P(g.cx, g.cy - R)} A ${f1(R)} ${f1(R)} 0 1 1 ${P(g.cx, g.cy + R)} A ${f1(R)} ${f1(R)} 0 1 1 ${P(g.cx, g.cy - R)}`, 'line', { phase: 0, unit: 'o' }));
  else if (item.kind === 'triangle') out.push(stroke(`M ${P(g.cx, g.y)} L ${P(g.x + g.w, g.y + g.h)} L ${P(g.x, g.y + g.h)} L ${P(g.cx, g.y)}`, 'line', { phase: 0, unit: 'o' }));
  else out.push(stroke(`M ${P(g.x, g.y)} L ${P(g.x + g.w, g.y)} L ${P(g.x + g.w, g.y + g.h)} L ${P(g.x, g.y + g.h)} L ${P(g.x, g.y)}`, 'line', { phase: 0, unit: 'o' }));
  // The cuts.
  if (item.kind === 'circle') {
    const at = (a) => [g.cx + R * Math.cos(a), g.cy + R * Math.sin(a)];
    const ang = (j) => -Math.PI / 2 + j * 2 * Math.PI / n;
    if (n % 2 === 0) {
      // Straight across, through the middle: from the higher end (the left one when level).
      for (let j = 0; j < n / 2; j += 1) {
        let [a, b] = [at(ang(j)), at(ang(j) + Math.PI)];
        if (b[1] < a[1] - 0.5 || (Math.abs(b[1] - a[1]) <= 0.5 && b[0] < a[0])) [a, b] = [b, a];
        out.push(stroke(`M ${P(a[0], a[1])} L ${P(b[0], b[1])}`, 'line', { phase: 1, unit: `c${j}` }));
      }
    } else {
      // From the middle out to the edge, clockwise from the top.
      for (let j = 0; j < n; j += 1) { const b = at(ang(j)); out.push(stroke(`M ${P(g.cx, g.cy)} L ${P(b[0], b[1])}`, 'line', { phase: 1, unit: `c${j}` })); }
    }
  } else if (item.kind === 'triangle') {
    for (let j = 1; j < n; j += 1) { const x = g.x + j * g.w / n; out.push(stroke(`M ${P(g.cx, g.y)} L ${P(x, g.y + g.h)}`, 'line', { phase: 1, unit: `c${j}` })); }
  } else {
    for (let j = 1; j < n; j += 1) { const x = g.x + j * g.w / n; out.push(stroke(`M ${P(x, g.y)} L ${P(x, g.y + g.h)}`, 'line', { phase: 1, unit: `c${j}` })); }
  }
  // The shading, part by part.
  for (const part of [...shadedSet(item.shaded, n)].sort((a, c) => a - c)) {
    const p = shapePart(item, g, part);
    const box = bboxOf([sample(p.d).pts]);
    out.push(...hatchLines(box, { colour: col, phase: 2, unit: `h${part}`, clip: { id: `${item.id}-p${part}`, d: p.d } }));
  }
  if (item.label) out.push(...label(`${countOf(item.shaded)}/${n}`, g.cx, g.labelY - 17, 24, { colour: INK.ink, phase: 3, unit: 'l' }));
  return out;
}

function numberLine(item, H) {
  const g = lineGeom(item, rectOf(item, H));
  const out = [stroke(`M ${P(g.x0, g.y)} L ${P(g.x1, g.y)}`, 'line', { phase: 0, unit: 'line' })];
  const ticks = (item.to - item.from) * item.divisions;
  for (let k = 0; k <= ticks; k += 1) {
    const x = g.X(item.from + k / item.divisions);
    const t = k % item.divisions === 0 ? 16 : 10;
    out.push(stroke(`M ${P(x, g.y - t)} L ${P(x, g.y + t)}`, 'line', { phase: 1, unit: `t${k}`, width: k % item.divisions === 0 ? PEN.width : PEN.width * 0.8 }));
  }
  for (let v = item.from; v <= item.to; v += 1) out.push(...label(String(v), g.X(v), g.y + 30, g.lh, { colour: INK.ink, phase: 2, unit: `n${v}` }));
  item.jumps.forEach((j, k) => {
    const a = g.X(j.from); const b = g.X(j.to);
    const hgt = Math.min(70, Math.abs(b - a) * 0.5 + 18);
    const y = g.y - 20;
    out.push(stroke(`M ${P(a, y)} Q ${P((a + b) / 2, y - hgt * 2)} ${P(b, y)}`, 'jump', { colour: INK.orange, phase: 3, unit: `j${k}` }));
    // The arrow head, along the way the jump lands.
    const dir = Math.sign(b - a) || 1;
    out.push(stroke(`M ${P(b - dir * 16, y - 18)} L ${P(b, y)} L ${P(b - dir * 22, y + 2)}`, 'jump', { colour: INK.orange, phase: 3, unit: `j${k}` }));
  });
  item.marks.forEach((m, k) => {
    const x = g.X(m.value);
    if (m.style === 'arrow') out.push(stroke(`M ${P(x, g.y - 50)} L ${P(x, g.y - 12)}`, 'mark', { colour: INK.red, phase: 4, unit: `m${k}` }), stroke(`M ${P(x - 9, g.y - 26)} L ${P(x, g.y - 12)} L ${P(x + 9, g.y - 26)}`, 'mark', { colour: INK.red, phase: 4, unit: `m${k}` }));
    else out.push(stroke(`M ${P(x - 0.6, g.y)} L ${P(x + 0.6, g.y)}`, 'mark', { colour: INK.red, width: 15, phase: 4, unit: `m${k}` }));
    if (m.label) out.push(...label(m.label, x, g.y - (m.style === 'arrow' ? 80 : 52), 20, { colour: INK.red, phase: 4, unit: `ml${k}` }));
  });
  return out;
}

function plotPoints(item, H) {
  const g = plotGeom(item, rectOf(item, H));
  const out = [
    stroke(`M ${P(g.x0, g.y0)} L ${P(g.x1, g.y0)}`, 'line', { phase: 0, unit: 'x' }),
    stroke(`M ${P(g.x0, g.y0)} L ${P(g.x0, g.y1)}`, 'line', { phase: 0, unit: 'y' }),
  ];
  if (item.x_axis.name) out.push(...label(item.x_axis.name, g.x1 - 40, g.y0 + 10, 15, { colour: INK.ink, phase: 1, unit: 'xn' }));
  if (item.y_axis.name) out.push(...label(item.y_axis.name, g.x0 - 4, g.y1 - 2, 15, { colour: INK.ink, phase: 1, unit: 'yn' }).map((s) => s));
  item.points.forEach((q, k) => {
    const x = g.X(q.x); const y = g.Y(q.y);
    out.push(stroke(`M ${P(x - 0.6, y)} L ${P(x + 0.6, y)}`, 'mark', { colour: INK.blue, width: 13, phase: 2, unit: `p${k}` }));
    if (q.label) out.push(...label(q.label, x + 18, y - 26, 15, { colour: INK.blue, phase: 2, unit: `pl${k}` }));
  });
  if (item.connect && item.points.length > 1) {
    out.push(stroke(`M ${item.points.map((q) => P(g.X(q.x), g.Y(q.y))).join(' L ')}`, 'line', { colour: INK.blue, width: PEN.width * 0.75, phase: 3, unit: 'join' }));
  }
  return out;
}

function writeText(item, H) {
  const g = textGeom(item, rectOf(item, H));
  const colour = INK[item.colour] || INK.ink;
  if (g.hand) return handStrokes(item.text, g.x, g.base - g.fs * CAP, g.fs * CAP, { colour, phase: 0, unit: 'w' });
  return printStrokes(item.text, g.x, g.base, g.fs, { colour, phase: 0, unit: 'w' });
}

// write_math: the layout from mathExpr, written left to right; a fraction's top number, then its bar, then its bottom number.
const MATH_CHAR = { '−': '−', '×': '×', '÷': '÷', '+': '+', '=': '=', '<': '<', '>': '>' };
function writeMath(item, H) {
  const g = mathGeom(item, rectOf(item, H));
  if (!g) return [];
  const colour = INK[item.colour] || INK.ink;
  const out = [];
  let u = 0;
  const glyphs = (text, x, base, size, adv) => {
    const h = size * CAP;
    const w = handWidth(text, h);
    out.push(...handStrokes(text, x + (adv - w) / 2, base - h, h, { colour, phase: 0, unit: `m${u++}` }));
  };
  const walk = (n, x, base, fs) => {
    const size = fs * n.scale;
    switch (n.k) {
      case 'num': glyphs(n.v, x, base, size, n.box.w * fs); return;
      case 'op': glyphs(MATH_CHAR[n.v] || n.v, x, base, size, n.box.w * fs); return;
      case 'gap': {
        const bx = x + 0.1 * size; const by = base - 0.78 * size; const bw = 0.7 * size; const bh = 0.92 * size; const r = 0.12 * size;
        out.push(stroke(`M ${P(bx + r, by)} L ${P(bx + bw - r, by)} Q ${P(bx + bw, by)} ${P(bx + bw, by + r)} L ${P(bx + bw, by + bh - r)} Q ${P(bx + bw, by + bh)} ${P(bx + bw - r, by + bh)} L ${P(bx + r, by + bh)} Q ${P(bx, by + bh)} ${P(bx, by + bh - r)} L ${P(bx, by + r)} Q ${P(bx, by)} ${P(bx + r, by)}`, 'line', { colour, width: Math.max(2.5, size * 0.07), phase: 0, unit: `m${u++}`, dash: [size * 0.12, size * 0.1], cap: false }));
        return;
      }
      case 'seq': { let cx = x; for (const c of n.parts) { walk(c, cx, base, fs); cx += c.box.w * fs; } return; }
      case 'br': {
        const a = n.inner.box.a * fs; const d = n.inner.box.d * fs;
        const h = (a + d) * 1.04; const top = base - a - h * 0.02;
        const bw = 0.4 * size;
        const paren = (ch, bx) => out.push(...handStrokes(ch, bx + (bw - GLYPHS[ch].w * h) / 2, top, h, { colour, phase: 0, unit: `m${u++}` }).map((s) => ({ ...s, width: writeWidth(size * CAP) })));
        paren('(', x);
        walk(n.inner, x + bw, base, fs);
        paren(')', x + bw + n.inner.box.w * fs);
        return;
      }
      case 'pow': walk(n.base, x, base, fs); walk(n.exp, x + n.base.box.w * fs, base - n.base.box.a * fs * 0.55, fs); return;
      case 'frac': {
        const w = n.box.w * fs;
        const bar = base - 0.3 * fs * n.scale;
        const gap = 0.12 * fs * n.scale;
        walk(n.a, x + (w - n.a.box.w * fs) / 2, bar - gap - n.a.box.d * fs, fs);
        out.push(stroke(`M ${P(x + 0.08 * fs, bar)} L ${P(x + w - 0.08 * fs, bar)}`, 'write', { colour, width: writeWidth(size * CAP), phase: 0, unit: `m${u++}` }));
        walk(n.b, x + (w - n.b.box.w * fs) / 2, bar + gap + n.b.box.a * fs, fs);
        return;
      }
      case 'mixed': walk(n.wl, x, base, fs); walk(n.fl, x + n.wl.box.w * fs + 0.1 * fs * n.scale, base, fs); return;
      default:
    }
  };
  walk(g.tree, g.x, g.base, g.fs);
  return out;
}

const DRAWERS = { figure: (item, H) => figureStrokes(item, H), fraction_bar: fractionBar, shape, number_line: numberLine, plot_points: plotPoints, write_text: writeText, write_math: writeMath };
export const DRAWN_KINDS = Object.keys(DRAWERS);

/** A drawn item's strokes, in the order they are drawn. */
export function itemStrokes(item, H = BOARD_H) {
  const f = DRAWERS[item?.cmd];
  return f ? f(item, H) : [];
}

// ---------------------------------------------------------------- marks
/** An ellipse drawn as one loop, from the upper left, clockwise, a little past where it began. */
export function loop(cx, cy, rx, ry, tilt = -4) {
  const t = (tilt * Math.PI) / 180;
  const pts = [];
  const a0 = (-160 * Math.PI) / 180; const sweep = (382 * Math.PI) / 180;
  for (let i = 0; i <= 72; i += 1) {
    const a = a0 + sweep * (i / 72);
    const x = rx * Math.cos(a); const y = ry * Math.sin(a);
    pts.push(P(cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)));
  }
  return `M ${pts.join(' L ')}`;
}

/** A mark's strokes, on the item it points at. */
export function markStrokes(m, item, H = BOARD_H) {
  const box = item && targetBox(item, m.part, m.bar, H);
  if (!box) return [];
  const pad = 10;
  const red = { colour: INK.red, phase: 0, unit: 'm' };
  if (m.cmd === 'underline') {
    const n = Math.max(1, (item.text || item.expr).length);
    const left = m.range ? box.x + box.w * m.range[0] / n : box.x;
    const right = m.range ? box.x + box.w * m.range[1] / n : box.x + box.w;
    const y = box.y + box.h + 8;
    return [stroke(`M ${P(left, y)} Q ${P((left + right) / 2, y + 5)} ${P(right, y - 1)}`, 'mark', { ...red, width: PEN.width * 0.85 })];
  }
  if (m.cmd === 'point') {
    // A drawn arrow: the shaft towards the target, then its head.
    const tx = box.cx; const ty = m.part ? box.cy : box.y + box.h + 6;
    const sx = tx + 58; const sy = ty + 48;
    return [
      stroke(`M ${P(sx, sy)} L ${P(tx + 8, ty + 7)}`, 'mark', red),
      stroke(`M ${P(tx + 28, ty + 9)} L ${P(tx + 8, ty + 7)} L ${P(tx + 10, ty + 27)}`, 'mark', red),
    ];
  }
  // A highlighter only suits words and maths; on a shape its swept box covered the picture (12 Nov 2026), so it rings instead.
  if (m.style === 'glow' && item && !['write_text', 'write_math'].includes(item.cmd)) m = { ...m, style: 'circle' };
  if (m.style === 'glow') {
    // A highlighter, swept across in passes, top to bottom, back and forth.
    const gp = m.part ? 3 : pad;   // over one part it stays on that part
    const x0 = box.x - gp; const x1 = box.x + box.w + gp; const y0 = box.y - gp; const hh = box.h + gp * 2;
    const n = Math.max(1, Math.ceil(hh / 28));
    const w = hh / n + 6;
    return Array.from({ length: n }, (_, k) => {
      const y = y0 + (k + 0.5) * hh / n;
      const [a, b] = k % 2 ? [x1, x0] : [x0, x1];
      return stroke(`M ${P(a, y)} L ${P(b, y)}`, 'mark', { colour: HIGHLIGHTER, width: w, phase: 0, unit: 'm', opacity: 0.42, highlighter: true, cap: false });
    });
  }
  if (m.style === 'box') {
    const x = box.x - pad; const y = box.y - pad; const w = box.w + pad * 2; const h = box.h + pad * 2;
    return [stroke(`M ${P(x, y)} L ${P(x + w, y)} L ${P(x + w, y + h)} L ${P(x, y + h)} L ${P(x, y)} L ${P(x + 10, y)}`, 'mark', red)];
  }
  // A ring around one part sits close to it, so rings counted one by one stay apart.
  const ring = m.part ? 5 : pad + 5;
  return [stroke(loop(box.cx, box.cy, box.w / 2 + ring, box.h / 2 + ring), 'mark', red)];
}

/** The box around a list of strokes (the eraser's path). */
export const strokesBox = (strokes, pad = 0) => bboxOf(strokes.map((s) => (s.print ? [[s.print.x, s.print.base - s.print.fs * 0.8], [s.print.x1, s.print.base + s.print.fs * 0.25]] : s.sp.pts)), pad);

export default { itemStrokes, markStrokes, strokesBox, PEN, KINDS };
