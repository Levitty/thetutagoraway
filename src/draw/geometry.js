// ============================================================================
// WHERE THINGS GO ON THE BOARD: the slots, and each drawn item's frame inside
// its slot. Shared by the strokes (strokes.js), by the marks that point at an
// item's parts, and by Board.jsx. The board is 1000 units wide and H high
// (640 on a wide screen; taller rows on an upright phone).
// Pure: no DOM. Moved here from Board.jsx so node tests can use it.
// ============================================================================
import { cellsOf } from '../voice-tutor/commands.js';
import { parseMath, layoutMath } from '../voice-tutor/mathExpr.js';
import { canHandwrite, handWidth } from './glyphs.js';
import { printWidth } from './print.js';

export const BOARD_W = 1000;
export const BOARD_H = 640;
const PAD = 16;

export const TEXT_SIZE = { s: 30, m: 42, l: 56 };
export const MATH_SIZE = { s: 36, m: 48, l: 62 };
// A handwritten digit or capital is this much of the font size high.
export const CAP = 0.72;
// Text this short (the commands' label limit), all of it in glyphs.js, is handwritten.
export const SHORT_TEXT = 12;

export function slotRect(slot, H = BOARD_H) {
  const ROW_H = H / 3;
  const cells = cellsOf(slot);
  const row = ['top', 'middle', 'bottom'].indexOf(cells[0].split('_')[0]);
  const full = cells.length === 2;
  const right = !full && slot.endsWith('_right');
  return { x: (right ? BOARD_W / 2 : 0) + PAD, y: row * ROW_H + PAD / 2, w: (full ? BOARD_W : BOARD_W / 2) - PAD * 2, h: ROW_H - PAD };
}

export const shadedSet = (shaded, parts) => new Set(Array.isArray(shaded) ? shaded : Array.from({ length: shaded }, (_, i) => i + 1).filter((i) => i <= parts));
export const countOf = (shaded) => (Array.isArray(shaded) ? shaded.length : shaded);

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
export const barPart = (g, part) => ({ x: g.x + (part - 1) * g.w / g.parts, y: g.y, w: g.w / g.parts, h: g.h });

export function shapeGeom(item, r) {
  const labelH = item.label ? 44 : 0;
  const s = Math.min(r.h - 14 - labelH, item.kind === 'rectangle' ? r.w * 0.5 : r.w * 0.8);
  const cx = r.x + r.w / 2;
  const cy = r.y + (r.h - labelH) / 2 + 4;
  const w = item.kind === 'rectangle' ? s * 1.7 : s;
  const h = item.kind === 'rectangle' ? s * 0.9 : s;
  return { cx, cy, s, w, h, x: cx - w / 2, y: cy - h / 2, labelY: cy + h / 2 + 34 };
}

const f1 = (v) => Math.round(v * 10) / 10;
/** Part i (1-based) of a shape: its outline `d`, a centre `c` and a radius `r` for marks. */
export function shapePart(item, g, i) {
  const n = item.parts;
  if (item.kind === 'circle') {
    const a0 = -Math.PI / 2 + (i - 1) * 2 * Math.PI / n;
    const a1 = a0 + 2 * Math.PI / n;
    const R = g.s / 2;
    const am = (a0 + a1) / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M ${f1(g.cx)} ${f1(g.cy)} L ${f1(g.cx + R * Math.cos(a0))} ${f1(g.cy + R * Math.sin(a0))} A ${f1(R)} ${f1(R)} 0 ${large} 1 ${f1(g.cx + R * Math.cos(a1))} ${f1(g.cy + R * Math.sin(a1))} Z`;
    // The ring that counts a part fits inside it, so neighbouring parts' rings stay apart.
    return { d, c: { x: g.cx + R * 0.6 * Math.cos(am), y: g.cy + R * 0.6 * Math.sin(am) }, r: Math.max(14, R * Math.min(0.32, (Math.PI / n) * 0.5)) };
  }
  if (item.kind === 'triangle') {
    const apex = { x: g.cx, y: g.y };
    const bx = (k) => g.x + k * g.w / n;
    const by = g.y + g.h;
    const p0 = { x: bx(i - 1), y: by }; const p1 = { x: bx(i), y: by };
    return { d: `M ${f1(apex.x)} ${f1(apex.y)} L ${f1(p0.x)} ${f1(p0.y)} L ${f1(p1.x)} ${f1(p1.y)} Z`, c: { x: (apex.x + p0.x + p1.x) / 3, y: (apex.y + 2 * by) / 3 }, r: Math.max(16, g.w / n / 2.4) };
  }
  const pw = g.w / n;
  const x = g.x + (i - 1) * pw;
  return { d: `M ${f1(x)} ${f1(g.y)} L ${f1(x + pw)} ${f1(g.y)} L ${f1(x + pw)} ${f1(g.y + g.h)} L ${f1(x)} ${f1(g.y + g.h)} Z`, c: { x: x + pw / 2, y: g.cy }, r: Math.max(16, Math.min(pw, g.h) / 2.2) };
}

export function lineGeom(item, r) {
  const x0 = r.x + 34; const x1 = r.x + r.w - 34;
  const y = r.y + r.h * 0.64;
  const X = (v) => x0 + (v - item.from) / (item.to - item.from) * (x1 - x0);
  return { x0, x1, y, X };
}

export function plotGeom(item, r) {
  const x0 = r.x + 50, x1 = r.x + r.w - 20, y0 = r.y + r.h - 34, y1 = r.y + 10;
  const X = (v) => x0 + (v - item.x_axis.from) / (item.x_axis.to - item.x_axis.from) * (x1 - x0);
  const Y = (v) => y0 - (v - item.y_axis.from) / (item.y_axis.to - item.y_axis.from) * (y0 - y1);
  return { x0, x1, y0, y1, X, Y };
}

/** write_text: handwritten when short and every letter has a glyph, else Figtree print. */
export function textGeom(item, r) {
  const size = TEXT_SIZE[item.size] || TEXT_SIZE.m;
  const hand = item.text.length <= SHORT_TEXT && canHandwrite(item.text);
  const width = (fs) => (hand ? handWidth(item.text, fs * CAP) : printWidth(item.text, fs));
  const est = width(size);
  const fs = est > r.w ? size * r.w / est : size;
  const w = width(fs);
  return { hand, fs, h: fs * 1.1, x: r.x + (r.w - w) / 2, w, base: r.y + r.h / 2 + fs * 0.34, top: r.y + r.h / 2 - fs * 0.6 };
}

export function mathGeom(item, r) {
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

/** The box around an item, or one of its parts: for highlight, underline and point. */
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
    case 'plot_points': {
      const g = plotGeom(item, r);
      const q = part ? item.points[part - 1] : null;
      if (q) { const x = g.X(q.x); const y = g.Y(q.y); return { x: x - 16, y: y - 16, w: 32, h: 32, cx: x, cy: y }; }
      return { x: g.x0, y: g.y1, w: g.x1 - g.x0, h: g.y0 - g.y1, cx: (g.x0 + g.x1) / 2, cy: (g.y0 + g.y1) / 2 };
    }
    case 'write_text': { const g = textGeom(item, r); return { x: g.x, y: g.top, w: g.w, h: g.h, cx: g.x + g.w / 2, cy: g.top + g.h / 2, base: g.base }; }
    case 'write_math': { const g = mathGeom(item, r); if (!g) return null; return { x: g.x, y: g.top, w: g.w, h: g.h, cx: g.x + g.w / 2, cy: g.top + g.h / 2, base: g.top + g.h }; }
    default: return { x: r.x, y: r.y, w: r.w, h: r.h, cx: r.x + r.w / 2, cy: r.y + r.h / 2 };
  }
}
