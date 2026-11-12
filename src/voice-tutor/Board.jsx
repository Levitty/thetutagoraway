// ============================================================================
// THE WHITEBOARD: draws the board state (board.js) as SVG through the drawing
// engine (src/draw), stroke by stroke, the way a teacher draws: each item's
// strokes in her order and direction, with the felt-marker pen of the approved
// study, a pen tip that rides the stroke and lifts between strokes, and an
// eraser pass when ink is erased or the board is cleared. The speech clock
// (`now`, ms) drives it. Nothing here reads model output directly: only items
// that passed validateTurn and applyStep exist.
//
// Smooth on a low-end phone: each item's strokes are made and measured once
// (cached by the item), React renders them once, and each frame only sets the
// dash offset of the strokes in progress and moves the pen tip.
//
// The board is 1000 units wide in a 2 x 3 grid of slots and scales to fit:
// 640 high on a wide screen; on an upright phone the page sizes it (H) to about
// a third of the screen's height, the same slots in taller rows.
// The child's ink layer sits on top, in its own colour, and no command reaches
// it. The child draws with a finger, stylus or mouse (pointer events, one
// pointer at a time, coalesced points for smooth lines); what they draw goes
// through ink.js, which can only add or remove the child's own strokes.
// The pen tip and the eraser are marked data-noshot: pictures of the board
// (capture.js) show the ink only.
//
// Phase 2 (12 Nov 2026): the board is COMPOSED (src/draw/compose.js): the slots
// in use become frames on the sheet, so the main figure is big and centred;
// drawn ink keeps its frame. FIGURES the child may handle get a play layer (what
// the child has made of them, in their teal, never the tutor's ink) and, once
// the figure is drawn and the lesson is on, a layer of tap and drag places
// above everything (onPlay(id, control, value)).
// ============================================================================
import React, { forwardRef, memo, useLayoutEffect, useRef } from 'react';
import { strokePath } from './ink.js';
import { drawMs } from './timeline.js';
import { PALETTE } from './commands.js';
import { itemStrokes, markStrokes, strokesBox } from '../draw/strokes.js';
import { playStrokes, figureHits, dragValue, stateOf } from '../draw/figureDraw.js';
import { layoutBoard } from '../draw/compose.js';
import { strokeTimes, progress, ease } from '../draw/timing.js';
import { pointAt } from '../draw/path.js';
import { PRINT_FONT } from '../draw/print.js';
import { sceneAccent, withAccent } from '../draw/accent.js';
import { BOARD_W, BOARD_H } from '../draw/geometry.js';

export { BOARD_W, BOARD_H, slotRect, barGeom, shapeGeom, lineGeom, targetBox } from '../draw/geometry.js';
export const INK = PALETTE;
export const ERASE_MS = 350;

/**
 * The key a drawing's time is kept under (VoiceTutor's drawTimes): its command,
 * what it is, and when it began. The same for the step and the board item made from it.
 */
export const drawKey = (s) => `${s.cmd}:${s.id || s.target || ''}:${s.part || ''}:${s.bar || ''}:${Math.round(s.at)}`;

let uids = 0;
/** An item's (or a mark's) strokes and their times on the speech clock, made once. */
function makeEntry(strokes, at, fit, pace) {
  const { times } = strokeTimes(strokes, { at, pace, fit });
  const start = times.length ? Math.min(...times.map((t) => t.t0)) : at;
  const end = times.length ? Math.max(...times.map((t) => t.t1)) : at;
  uids += 1;
  return { uid: `d${uids}`, strokes, times, start, end, els: [], caps: [], clips: [], last: [], done: false, box: strokesBox(strokes, 10) };
}

// ---------------------------------------------------------------- one item's ink
const Ink = memo(function Ink({ entry }) {
  const u = entry.uid;
  const clips = new Map();
  for (const s of entry.strokes) if (s.clip && !clips.has(s.clip.id)) clips.set(s.clip.id, s.clip.d);
  return (
    <g>
      <defs>
        {[...clips].map(([id, d]) => <clipPath key={id} id={`${u}-${id}`}><path d={d} /></clipPath>)}
        {entry.strokes.map((s, k) => (s.print ? (
          <clipPath key={`w${k}`} id={`${u}-w${k}`}>
            <rect ref={(n) => { entry.clips[k] = n; }} x={s.print.x - s.print.fs * 0.12} y={s.print.base - s.print.fs * 1.1} width={0} height={s.print.fs * 1.6} />
          </clipPath>
        ) : s.dash ? (
          <mask key={`m${k}`} id={`${u}-m${k}`} maskUnits="userSpaceOnUse" x="0" y="0" width={BOARD_W} height="2000">
            <path ref={(n) => { entry.els[k] = n; }} d={s.d} fill="none" stroke="#fff" strokeWidth={s.width + 8} strokeLinecap="round" pathLength={s.len} strokeDasharray={`${s.len} ${s.len + 1}`} strokeDashoffset={s.len} />
          </mask>
        ) : null))}
      </defs>
      {entry.strokes.map((s, k) => {
        if (s.print) {
          return (
            <g key={k} clipPath={`url(#${u}-w${k})`}>
              <text x={s.print.x} y={s.print.base} fontFamily={PRINT_FONT} fontWeight={s.print.weight} fontSize={s.print.fs} fill={s.colour}>{s.print.text}</text>
            </g>
          );
        }
        if (s.dash) {
          return <path key={k} d={s.d} fill="none" stroke={s.colour} strokeWidth={s.width} strokeLinecap="round" strokeDasharray={s.dash.join(' ')} mask={`url(#${u}-m${k})`} />;
        }
        if (s.kind === 'place') {
          // Laid on, not drawn: it appears whole, fading in as it is put down.
          return <path key={k} ref={(n) => { entry.els[k] = n; }} d={s.d} fill={s.fill || 'none'} fillOpacity={s.fillOpacity} stroke={s.fill ? 'none' : s.colour} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'none' }} opacity={0} />;
        }
        const [a, b] = [s.sp.pts[0], s.sp.pts[s.sp.pts.length - 1]];
        const r = s.width * 0.62;
        return (
          <g key={k} clipPath={s.clip ? `url(#${u}-${s.clip.id})` : undefined}>
            <path
              ref={(n) => { entry.els[k] = n; }}
              d={s.d} fill="none" stroke={s.colour} strokeWidth={s.width}
              strokeLinecap={s.highlighter ? 'butt' : 'round'} strokeLinejoin="round"
              opacity={s.opacity ?? 1}
              pathLength={s.len} strokeDasharray={`${s.len} ${s.len + 1}`} strokeDashoffset={s.len}
              style={{ display: 'none', ...(s.highlighter ? { mixBlendMode: 'multiply' } : null) }}
            />
            {s.cap ? (
              <>
                <circle ref={(n) => { entry.caps[2 * k] = n; }} cx={a[0]} cy={a[1]} r={r} fill={s.colour} opacity={0.95} style={{ display: 'none' }} />
                <circle ref={(n) => { entry.caps[2 * k + 1] = n; }} cx={b[0]} cy={b[1]} r={r} fill={s.colour} opacity={0.95} style={{ display: 'none' }} />
              </>
            ) : null}
          </g>
        );
      })}
    </g>
  );
});

const show = (n, on) => { if (n) n.style.display = on ? '' : 'none'; };
/** Set each stroke of an entry to its progress at `now` (all of it when `whole`). Only changed strokes are touched. */
function paint(entry, now, whole = false) {
  if (entry.done) return;
  let all = true;
  entry.strokes.forEach((s, k) => {
    const p = whole ? 1 : progress(entry.times[k], now);
    if (p < 1) all = false;
    if (entry.last[k] === p) return;
    entry.last[k] = p;
    if (s.print) {
      const r = entry.clips[k];
      if (r) r.setAttribute('width', p >= 1 ? (s.print.x1 - s.print.x) + s.print.fs : Math.max(0, (s.print.x1 - s.print.x + s.print.fs * 0.24) * p));
      return;
    }
    const el = entry.els[k];
    if (!el) return;
    if (s.kind === 'place') { show(el, p > 0); el.setAttribute('opacity', (s.opacity ?? 1) * p); return; }
    if (!s.dash) show(el, p > 0);
    if (p >= 1) el.setAttribute('stroke-dasharray', s.dash ? 'none' : 'none');
    else { el.setAttribute('stroke-dasharray', `${s.len} ${s.len + 1}`); el.setAttribute('stroke-dashoffset', s.len * (1 - p)); }
    if (s.cap) { show(entry.caps[2 * k], p > 0); show(entry.caps[2 * k + 1], p >= 1); }
  });
  if (all) entry.done = true;
}

// ---------------------------------------------------------------- the pen tip
// On the stroke while it draws; between strokes it moves lifted (smaller, lighter);
// gone when the hand is away from the board.
const LIFT_GLIDE = 900;
const ARRIVE = 450;
function placeTip(tip, nib, entries, now) {
  if (!tip) return;
  let on = null; let onT0 = -Infinity;
  let last = null; let lastT1 = -Infinity;
  let next = null; let nextT0 = Infinity;
  for (const e of entries) {
    if (e.end < now - LIFT_GLIDE - 100 || e.start > now + ARRIVE + 100) continue;
    e.times.forEach((t, k) => {
      const s = e.strokes[k];
      if (now > t.t0 && now < t.t1 && s.kind !== 'hatch' && s.kind !== 'place' && t.t0 > onT0) { on = { s, t }; onT0 = t.t0; }
      if (t.t1 <= now && t.t1 > lastT1) { last = s; lastT1 = t.t1; }
      if (t.t0 > now && t.t0 < nextT0) { next = s; nextT0 = t.t0; }
    });
  }
  const put = (x, y, lifted) => {
    tip.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${lifted ? ' scale(0.82)' : ''}`);
    tip.setAttribute('opacity', lifted ? 0.55 : 1);
    nib.setAttribute('r', lifted ? 2 : 3.4);
  };
  const tipOf = (s, p) => (s.print ? [s.print.x + (s.print.x1 - s.print.x) * p, s.print.base - s.print.fs * 0.3] : pointAt(s.sp, p));
  if (on) { const [x, y] = tipOf(on.s, progress(on.t, now)); put(x, y, false); return; }
  if (last && next) {
    const gap = nextT0 - lastT1;
    const from = tipOf(last, 1); const to = tipOf(next, 0);
    let u = null;
    if (gap <= LIFT_GLIDE) u = ease(Math.max(0, Math.min(1, (now - lastT1) / Math.max(1, gap))));
    else if (nextT0 - now <= ARRIVE) u = ease(1 - (nextT0 - now) / ARRIVE);
    if (u != null) { put(from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u, true); return; }
  }
  tip.setAttribute('opacity', 0);
}

// ---------------------------------------------------------------- erasing
// Ink that leaves the board is wiped: a duster passes over it, left to right in
// a zigzag, in ERASE_MS, and the ink goes behind it. Ink that leaves in the same moment
// (a clear, or an erase of several items) is wiped in one pass.
function Ghost({ ghost }) {
  const b = ghost.box;
  return (
    <g data-noshot="" pointerEvents="none">
      <defs><clipPath id={`${ghost.uid}-c`}><rect ref={(n) => { ghost.clip = n; }} x={b.x} y={b.y - 20} width={b.w} height={b.h + 40} /></clipPath></defs>
      <g clipPath={`url(#${ghost.uid}-c)`}>{ghost.entries.map((e) => <Ink key={e.uid} entry={e} />)}</g>
      {/* A board duster seen from above: a block with its felt edge. */}
      <g ref={(n) => { ghost.duster = n; }}>
        <rect x={-DUSTER.w / 2} y={0} width={DUSTER.w} height={DUSTER.h} rx={5} fill="#FFFDF6" stroke={INK.ink} strokeWidth={2.5} />
        <line x1={-DUSTER.w / 2 + 3} x2={DUSTER.w / 2 - 3} y1={DUSTER.h - 8} y2={DUSTER.h - 8} stroke={INK.ink} strokeWidth={2} opacity={0.4} />
      </g>
    </g>
  );
}
const DUSTER = { w: 46, h: 30 };
// The duster goes left to right in a zigzag, up and down the ink; the ink is gone behind it.
function wipe(g, now) {
  const u = Math.max(0, Math.min(1, (now - g.at) / ERASE_MS));
  const x = g.box.x + g.box.w * u;
  const edge = x - DUSTER.w / 2;
  if (g.clip) { g.clip.setAttribute('x', edge); g.clip.setAttribute('width', Math.max(0, g.box.x + g.box.w - edge)); }
  const zig = (u * 3) % 2; const v = zig > 1 ? 2 - zig : zig;
  const y = g.box.y - 6 + Math.max(0, g.box.h + 12 - DUSTER.h) * v;
  if (g.duster) g.duster.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
}
const unionBox = (boxes) => {
  const bs = boxes.filter(Boolean);
  if (!bs.length) return null;
  const x0 = Math.min(...bs.map((b) => b.x)); const y0 = Math.min(...bs.map((b) => b.y));
  const x1 = Math.max(...bs.map((b) => b.x + b.w)); const y1 = Math.max(...bs.map((b) => b.y + b.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};

function ChildInk({ ink }) {
  const line = (s, key) => <path key={key} d={strokePath(s.points)} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" />;
  return (
    <>
      {(ink?.strokes || []).map((s) => line(s, s.id))}
      {ink?.live?.tool === 'pen' ? line(ink.live, 'live') : null}
    </>
  );
}

/**
 * onInk(actions) receives ink.js actions ({ type:'down'|'move'|'up'|'cancel', x, y, tool })
 * in board units; `tool` is 'pen' or 'eraser'; inkOn turns drawing on.
 * drawTimes: Map drawKey -> ms, how long the timeline gave each drawing (a drawing is
 * squeezed to end before the next step's word); without it each draws at its own pace.
 */
/**
 * The frames of the board's items (compose.js): drawn ink keeps the frame it was given for this
 * height; anything else (a new item, or every item after the sheet changed shape) is laid out now.
 * Returns Map id -> the item with its frame, made once per item and frame.
 */
const framed = new WeakMap();
export function composedItems(board, H) {
  const list = board.order.map((id) => board.items[id]);
  const kept = (it) => it.rect && it.rectH === H;
  const rects = list.every(kept) ? null : layoutBoard(list.map((it) => (kept(it) ? it : { ...it, rect: undefined })), H, { inkOf: (it) => strokesBox(itemStrokes(it, H), 6) || it.rect });
  const out = new Map();
  for (const it of list) {
    const rect = rects ? rects.get(it.id) : it.rect;
    const c = framed.get(it);
    if (c && c.rect === rect) { out.set(it.id, c.item); continue; }
    const item = rect === it.rect ? it : { ...it, rect };
    framed.set(it, { rect, item });
    out.set(it.id, item);
  }
  return out;
}

// ---------------------------------------------------------------- the child's figures
// Where a child can tap or drag a figure: transparent places above the ink. A tap acts at once;
// a drag acts as it moves (the figure's own rules snap it: to a tick, a degree, the fixed arm).
function Hits({ item, state, H, onPlay }) {
  const grab = useRef(null);
  const at = (e) => {
    const svg = e.currentTarget.ownerSVGElement;
    const m = svg?.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(m.inverse());
    return { x: q.x, y: q.y };
  };
  const st = stateOf(item, state);
  return (
    <g data-noshot="" data-hits={item.id}>
      {figureHits(item, state, H).map((h) => (
        <path key={h.key} d={h.d} fill="#000" fillOpacity={0.001} stroke="none" style={{ cursor: h.drag ? 'grab' : 'pointer', touchAction: 'none' }}
          data-hit={h.key}
          onPointerDown={(e) => {
            e.stopPropagation(); e.preventDefault();
            if (!h.drag) { onPlay(item.id, h.control, h.value); return; }
            const pt = at(e);
            if (!pt) return;
            e.currentTarget.setPointerCapture?.(e.pointerId);
            grab.current = { id: e.pointerId, control: h.control, pt, value: h.control === 'protractor' ? st.turn : null };
            if (h.control !== 'protractor') onPlay(item.id, h.control, dragValue(item, h.control, pt, grab.current, H));
          }}
          onPointerMove={(e) => {
            const g = grab.current;
            if (!g || g.id !== e.pointerId) return;
            e.stopPropagation();
            const pt = at(e);
            if (pt) onPlay(item.id, g.control, dragValue(item, g.control, pt, g, H));
          }}
          onPointerUp={(e) => { if (grab.current?.id === e.pointerId) grab.current = null; }}
          onPointerCancel={() => { grab.current = null; }} />
      ))}
    </g>
  );
}

/**
 * onPlay(id, control, value): the child acted on a figure (playOn: the lesson is on and it is
 * safe to let them). Without onPlay the figures are pictures only.
 */
export const Board = forwardRef(function Board({ board, now, label = 'Whiteboard', H = BOARD_H, inkOn = false, tool = 'pen', onInk = null, drawTimes = null, onPlay = null, playOn = false }, ref) {
  const active = useRef(null);
  const toBoard = (svg, e) => {
    const m = svg.getScreenCTM();
    if (!m) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(m.inverse());
    return { x: Math.max(0, Math.min(BOARD_W, p.x)), y: Math.max(0, Math.min(H, p.y)) };
  };
  const down = (e) => {
    if (!inkOn || !onInk || active.current != null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = toBoard(e.currentTarget, e);
    if (!p) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    active.current = e.pointerId;
    onInk([{ type: 'down', ...p, tool }]);
  };
  const move = (e) => {
    if (e.pointerId !== active.current) return;
    const svg = e.currentTarget;
    const evs = e.nativeEvent.getCoalescedEvents?.() || [e];
    onInk(evs.map((ev) => toBoard(svg, ev)).filter(Boolean).map((p) => ({ type: 'move', ...p })));
  };
  const up = (cancel) => (e) => {
    if (e.pointerId !== active.current) return;
    active.current = null;
    onInk([{ type: cancel ? 'cancel' : 'up' }]);
  };

  const t = now == null ? Infinity : now;
  // Each item's and mark's strokes, made once and kept while the item is the same object.
  const cache = useRef(new WeakMap());
  // One accent per scene: every colour but ink is drawn in the scene's accent (src/draw/accent.js).
  const accent = sceneAccent(board);
  const entryFor = (obj, make, pace) => {
    const fit = drawTimes?.get(drawKey(obj)) ?? null;
    const c = cache.current.get(obj);
    if (c && c.H === H && c.fit === fit && c.accent === accent) return c.entry;
    const entry = makeEntry(withAccent(make(), accent), obj.at, fit, pace);
    cache.current.set(obj, { H, fit, accent, entry });
    return entry;
  };
  const composed = composedItems(board, H);
  const items = board.order.map((id) => {
    const item = composed.get(id);
    const mk = () => itemStrokes(item, H);
    return { obj: item, entry: entryFor(item, mk, item.pace) };
  });
  const markOf = (m) => {
    const item = composed.get(m.target);
    if (!item) return null;
    const fit = drawTimes?.get(drawKey(m)) ?? drawMs(m);
    const c = cache.current.get(m);
    if (c && c.H === H && c.fit === fit && c.target === item && c.accent === accent) return { obj: m, entry: c.entry };
    const entry = makeEntry(withAccent(markStrokes(m, item, H), accent), m.at, fit);
    cache.current.set(m, { H, fit, target: item, accent, entry });
    return { obj: m, entry };
  };
  const marks = [...board.marks, ...(board.pointer ? [board.pointer] : [])].map(markOf).filter(Boolean);
  const live = [...items, ...marks];
  // What the child has made of each figure they may handle, shown once the tutor has drawn it.
  const plays = items.filter(({ obj, entry }) => obj.cmd === 'figure' && obj.controls?.length && t >= entry.end).map(({ obj }) => {
    const st = board.play?.[obj.id]?.state || null;
    const c = cache.current.get(obj);
    if (c?.play && c.play.st === st && c.play.H === H) return { obj, entry: c.play.entry, st };
    const entry = makeEntry(playStrokes(obj, st, H), -1e9, 0);
    cache.current.set(obj, { ...(c || {}), play: { st, H, entry } });
    return { obj, entry, st };
  });

  // What left the board since the last frame is wiped.
  const seen = useRef(new Map());
  const ghosts = useRef([]);
  const nowObjs = new Map(live.map((x) => [x.obj, x.entry]));
  const left = [...seen.current].filter(([obj]) => !nowObjs.has(obj)).map(([, e]) => e);
  if (left.length && Number.isFinite(t)) {
    uids += 1;
    const entries = left.map((e) => ({ ...e, uid: `${e.uid}g${uids}`, els: [], caps: [], clips: [], last: [], done: false }));
    const box = unionBox(entries.map((e) => e.box));
    if (box) ghosts.current = [...ghosts.current, { uid: `g${uids}`, at: t, box, entries, clip: null, duster: null }];
  }
  seen.current = nowObjs;
  ghosts.current = ghosts.current.filter((g) => t - g.at < ERASE_MS);

  const tipRef = useRef(null);
  const nibRef = useRef(null);
  useLayoutEffect(() => {
    for (const { entry } of live) paint(entry, t);
    for (const { entry } of plays) paint(entry, t, true);
    for (const g of ghosts.current) { for (const e of g.entries) paint(e, t, true); wipe(g, t); }
    placeTip(tipRef.current, nibRef.current, live.map((x) => x.entry), t);
  });

  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${BOARD_W} ${H}`} className="block w-full h-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet"
      style={inkOn ? { touchAction: 'none', cursor: tool === 'eraser' ? 'cell' : 'crosshair', userSelect: 'none', WebkitUserSelect: 'none' } : undefined}
      onPointerDown={down} onPointerMove={move} onPointerUp={up(false)} onPointerCancel={up(true)} onLostPointerCapture={up(false)}>
      <defs>
        <pattern id="vt-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#E9E6DA" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={BOARD_W} height={H} fill="#FFFDF6" />
      <rect x="0" y="0" width={BOARD_W} height={H} fill="url(#vt-grid)" />
      <g data-layer="tutor">
        {items.map(({ obj, entry }) => <g key={entry.uid} data-id={obj.id}><Ink entry={entry} /></g>)}
        {marks.map(({ entry }) => <Ink key={entry.uid} entry={entry} />)}
        {ghosts.current.map((g) => <Ghost key={g.uid} ghost={g} />)}
      </g>
      {/* What the child has made of the figures: their teal, drawn whole. */}
      <g data-layer="play">{plays.map(({ entry }) => <Ink key={entry.uid} entry={entry} />)}</g>
      {/* The pen tip: a small nib that rides the stroke. Never in a picture of the board. */}
      <g ref={tipRef} data-noshot="" opacity="0" pointerEvents="none">
        <circle r="11" cx="3" cy="4" fill="rgba(29,29,39,0.10)" />
        <circle r="8" fill="#fff" stroke={INK.ink} strokeWidth="2.5" />
        <circle ref={nibRef} r="3.4" fill={INK.ink} />
      </g>
      {/* The child's ink. No board command can reach this layer. */}
      <g data-layer="child"><ChildInk ink={board.childInk} /></g>
      {/* Where the child can tap and drag the figures: above everything, while the lesson is on. */}
      {playOn && onPlay ? plays.map(({ obj, st }) => <Hits key={`h${obj.id}`} item={obj} state={st} H={H} onPlay={onPlay} />) : null}
    </svg>
  );
});

export default Board;
