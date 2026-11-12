// ============================================================================
// COMPOSITION: a layout pass over the slots (rendering engine phase 2). The
// tutor still names a slot (top, middle_left, ...); this pass turns the slots
// that are in use into frames on the sheet, so the lesson's main figure is big
// and centred, with its labels and maths around it, instead of sitting small in
// a half-width cell at the top left of a tall sheet.
//
// The rules, in order:
//   1. Rows. Only rows in use take room. A row with a figure in it (a bar, a
//      shape, a number line, a graph, a figure) is a FIGURE row; a row of text
//      or maths only is a TEXT row and takes the height its writing needs.
//      Figure rows share the rest of the sheet, up to MAX_FIGURE_H each.
//      The rows sit together, centred on the sheet, GAP apart.
//   2. Halves. A half-slot item whose other half is empty takes the whole row.
//      A figure beside writing takes 60% of the row, the writing 40%.
//   3. Ink is never moved. An item that is already drawn keeps its frame
//      (`rect`); rows that hold drawn ink keep their band; new rows fill the
//      free space above or below them in reading order; a new half beside
//      drawn ink takes the free span beside that ink.
//
//   layoutBoard(items, H, { inkOf })     Map id -> frame, for every item
//   placeItem(board, step, pending, H)   the frame for one new item, laid out
//                                        with the rest of its turn (pending
//                                        steps) so the turn is composed whole
// Pure: no DOM. Tested in tests/draw-compose.test.mjs.
// ============================================================================
import { cellsOf, resolveSlot, ROWS, DRAWN } from '../voice-tutor/commands.js';
import { BOARD_W, TEXT_SIZE, MATH_SIZE } from './geometry.js';

export const PAD = 16;
export const GAP = 28;
export const MAX_FIGURE_H = 620;
export const LONE_FIGURE = 0.62;
export const TEXT_ITEMS = ['write_text', 'write_math'];

const rowOf = (slot) => cellsOf(slot)[0].split('_')[0];
const sideOf = (slot) => (ROWS.includes(slot) ? 'full' : slot.endsWith('_left') ? 'left' : 'right');
export const isFigure = (item) => !TEXT_ITEMS.includes(item.cmd);
// How tall a figure is worth drawing: a line or a chart is wide and short, a circle or a graph is square.
const FIGURE_CAP = { fraction_bar: (it) => (it.second_bar ? 380 : 210), number_line: 320, shape: 560, plot_points: 560 };
const TYPE_CAP = { numberline: 340, place_value: 400, angle: 540, area: 560, graph: 620 };
export const figureCap = (item) => {
  if (item.cmd !== 'figure') { const c = FIGURE_CAP[item.cmd]; return typeof c === 'function' ? c(item) : c || MAX_FIGURE_H; }
  if (item.type === 'fraction') return item.params?.shape === 'bar' ? (item.params?.second ? 380 : 210) : MAX_FIGURE_H;
  return TYPE_CAP[item.type] || MAX_FIGURE_H;
};

/** How tall a line of writing is, with room round it. */
export const textHeight = (item) => {
  if (item.cmd === 'write_text') return (TEXT_SIZE[item.size] || TEXT_SIZE.m) * 1.5 + 28;
  const fs = MATH_SIZE[item.size] || MATH_SIZE.m;
  return fs * (/frac\(|mixed\(/.test(item.expr || '') ? 2.5 : 1.4) + 28;
};

const unionY = (rects) => {
  const y0 = Math.min(...rects.map((r) => r.y)); const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { y: y0, h: y1 - y0 };
};

/**
 * Frames for every item. `items`: in order, each { id, cmd, slot, rect? }; an item with a
 * rect is drawn ink and keeps it. `inkOf(item)` is the box its ink covers (default: its frame).
 */
export function layoutBoard(items, H, { inkOf = (it) => it.rect } = {}) {
  const out = new Map();
  const rows = ROWS.map((r) => ({ r, items: items.filter((it) => rowOf(it.slot) === r) })).filter((x) => x.items.length);
  for (const row of rows) {
    const frozen = row.items.filter((it) => it.rect);
    row.band = frozen.length ? unionY(frozen.map((it) => it.rect)) : null;
    row.figure = row.items.some(isFigure);
    row.need = row.figure ? 0 : Math.max(...row.items.map(textHeight));
    row.cap = row.figure ? Math.max(...row.items.filter(isFigure).map(figureCap)) : 0;
  }
  // 1. Bands for the rows without drawn ink, in the free space between the rows that have it.
  const top = PAD / 2; const bottom = H - PAD / 2;
  let k = 0;
  while (k < rows.length) {
    if (rows[k].band) { k += 1; continue; }
    let j = k;
    while (j < rows.length && !rows[j].band) j += 1;
    const free = rows.slice(k, j);
    const y0 = k > 0 ? rows[k - 1].band.y + rows[k - 1].band.h + GAP : top;
    const y1 = j < rows.length ? rows[j].band.y - GAP : bottom;
    const room = Math.max(60, y1 - y0 - GAP * (free.length - 1));
    const figs = free.filter((r) => r.figure);
    const textNeed = free.filter((r) => !r.figure).reduce((s, r) => s + r.need, 0);
    // Writing keeps its height unless the room is too small for it and a figure row besides.
    const minFig = figs.reduce((sum, r) => sum + Math.min(r.cap, room * 0.3), 0);
    const textScale = textNeed > 0 ? Math.max(0.4, Math.min(1, (room - minFig) / textNeed)) : 1;
    let figH = figs.length ? Math.min(MAX_FIGURE_H, (room - textNeed * textScale) / figs.length) : 0;
    // A figure alone on the sheet stays big but leaves room round it for the writing that follows.
    if (free.length === 1 && rows.length === 1 && figs.length) figH = Math.min(figH, room * LONE_FIGURE);
    for (const r of free) r.h = r.figure ? Math.max(60, Math.min(r.cap, figH)) : Math.max(40, r.need * textScale);
    const used = free.reduce((s, r) => s + r.h, 0) + GAP * (free.length - 1);
    // On a clear sheet the rows sit together in the middle. Next to drawn ink they join it, GAP away,
    // as they would have if they had been laid out with it.
    let y = y0 + Math.max(0, (y1 - y0 - used) / 2);
    if (k > 0) y = y0;
    else if (j < rows.length) y = Math.max(y0, y1 - used);
    for (const r of free) { r.band = { y, h: r.h }; y += r.h + GAP; }
    k = j;
  }
  // 2. Across each row.
  const x0 = PAD; const x1 = BOARD_W - PAD;
  for (const row of rows) {
    const { y, h } = row.band;
    const halves = { left: row.items.find((it) => sideOf(it.slot) === 'left'), right: row.items.find((it) => sideOf(it.slot) === 'right') };
    for (const it of row.items) {
      if (it.rect) { out.set(it.id, it.rect); continue; }
      const side = sideOf(it.slot);
      if (side === 'full') { out.set(it.id, { x: x0, y, w: x1 - x0, h }); continue; }
      const other = halves[side === 'left' ? 'right' : 'left'];
      if (!other) { out.set(it.id, { x: x0, y, w: x1 - x0, h }); continue; }
      if (other.rect) {
        // Beside drawn ink: the free span on this side of it, if there is room; else this half.
        const ink = inkOf(other) || other.rect;
        const span = side === 'left' ? { x: x0, w: ink.x - 24 - x0 } : { x: ink.x + ink.w + 24, w: x1 - (ink.x + ink.w + 24) };
        if (span.w >= (x1 - x0) * 0.3) { out.set(it.id, { ...span, y, h }); continue; }
        // No room beside it: under the row's ink (or over it), across the sheet, where nothing else is.
        const need = isFigure(it) ? 200 : textHeight(it);
        const bands = rows.map((r) => r.band).filter((b) => b !== row.band);
        const below = { y: ink.y + ink.h + 16, end: Math.min(bottom, ...bands.filter((b) => b.y >= ink.y + ink.h).map((b) => b.y - GAP)) };
        const above = { end: ink.y - 16, y: Math.max(top, ...bands.filter((b) => b.y + b.h <= ink.y).map((b) => b.y + b.h + GAP)) };
        const pick = [{ ...below, at: 'below' }, { ...above, at: 'above' }].map((b) => ({ ...b, h: b.end - b.y })).sort((a, c) => c.h - a.h)[0];
        if (pick.h >= need * 0.6) { const hh = Math.min(pick.h, need * 1.2); out.set(it.id, { x: x0, y: pick.at === 'below' ? pick.y : pick.end - hh, w: x1 - x0, h: hh }); continue; }
        out.set(it.id, { x: side === 'left' ? x0 : BOARD_W / 2 + PAD / 2, y, w: BOARD_W / 2 - PAD * 1.5, h });
        continue;
      }
      const share = isFigure(it) === isFigure(other) ? 0.5 : isFigure(it) ? 0.6 : 0.4;
      const leftW = (side === 'left' ? share : 1 - share) * (x1 - x0 - GAP);
      out.set(it.id, side === 'left' ? { x: x0, y, w: leftW, h } : { x: x0 + leftW + GAP, y, w: x1 - x0 - GAP - leftW, h });
    }
  }
  return out;
}

const r1 = (r) => ({ x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10, w: Math.round(r.w * 10) / 10, h: Math.round(r.h * 10) / 10 });

/**
 * The frame for a new drawn item: the board's items keep theirs; the new item is laid out with
 * the steps still to come in its turn (`pending`, in order), their slots resolved as the board will.
 */
export function placeItem(items, step, pending, H, opts = {}) {
  const used = new Set(items.flatMap((it) => cellsOf(it.slot)));
  for (const c of cellsOf(step.slot)) used.add(c);
  const later = [];
  for (const p of pending) {
    if (p.cmd === 'clear' || p.cmd === 'erase') break;   // what comes after a wipe is another scene
    if (!DRAWN.includes(p.cmd) || p.id === step.id) continue;
    const slot = resolveSlot(used, p.slot);
    if (!slot) continue;
    for (const c of cellsOf(slot)) used.add(c);
    later.push({ ...p, slot, rect: undefined });
  }
  const all = [...items, { ...step, rect: undefined }, ...later];
  const rect = layoutBoard(all, H, opts).get(step.id);
  return rect ? r1(rect) : null;
}

export default { layoutBoard, placeItem, textHeight, isFigure, MAX_FIGURE_H };
