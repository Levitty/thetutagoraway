// ============================================================================
// THE CHILD'S INK (milestone 2): what the child writes and draws on the board
// with a finger, a stylus or a mouse.
//
// It lives in board.childInk and only inkReducer changes it. No board command
// reaches it (applyStep never touches childInk, and `clear` wipes tutor ink
// only), and nothing here reaches the tutor's items: the eraser removes the
// child's own strokes, never the tutor's work, because the two are separate
// layers. Undo takes back the child's last action (a stroke, an erase, or an
// example drawing put on the board in the scripted mode).
//
// Points are board units (1000 wide). Strokes are thinned as they are drawn
// and drawn smooth (quadratic curves through the midpoints).
// Pure: no DOM, no clock (callers pass t). Tested in tests/voice-tutor-ink.test.mjs.
// ============================================================================
export const CHILD_INK = '#0E7C86';  // teal: no tutor colour is near it (commands.js COLOURS)
export const PEN_WIDTH = 6;
export const ERASER_RADIUS = 18;
export const MIN_STEP = 2.5;          // board units between kept points
export const MAX_POINTS = 1500;       // per stroke
export const MAX_STROKES = 400;
export const MAX_UNDO = 50;

export const emptyInk = () => ({ strokes: [], live: null, undo: [], version: 0, lastAt: null, example: null, nextId: 1 });

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const round1 = (v) => Math.round(v * 10) / 10;

/** Distance from point p to the segment ab, squared. */
const segDist2 = (p, a, b) => {
  const dx = b[0] - a[0]; const dy = b[1] - a[1];
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return dist2(p, [a[0] + t * dx, a[1] + t * dy]);
};
export const touches = (stroke, p, r = ERASER_RADIUS) => {
  const pts = stroke.points;
  const rr = (r + stroke.width / 2) ** 2;
  if (pts.length === 1) return dist2(pts[0], p) <= rr;
  for (let i = 1; i < pts.length; i += 1) if (segDist2(p, pts[i - 1], pts[i]) <= rr) return true;
  return false;
};

const commit = (ink, change, t) => ({
  ...change,
  undo: [...ink.undo, { strokes: ink.strokes, example: ink.example }].slice(-MAX_UNDO),
  version: ink.version + 1,
  lastAt: t,
});

/**
 * Actions:
 *   { type:'down', x, y, t, tool:'pen'|'eraser' }  a finger touches the board
 *   { type:'move', x, y, t }                       it moves
 *   { type:'up', t }                               it lifts (the stroke is kept)
 *   { type:'cancel' }                              the browser took the touch away
 *   { type:'undo', t }
 *   { type:'add', strokes, example, t }            strokes put on at once (scripted examples), one undo step
 *   { type:'clear', t }                            the child clears their own ink (undoable)
 *   { type:'tag', example }                        names the example now on the board (scripted demo only)
 */
export function inkReducer(ink, a) {
  switch (a.type) {
    case 'down': {
      const p = [round1(a.x), round1(a.y)];
      if (a.tool === 'eraser') return { ...ink, live: { tool: 'eraser', erased: [], before: ink.strokes, beforeExample: ink.example }, ...eraseAt(ink.strokes, p), lastAt: a.t };
      if (ink.strokes.length >= MAX_STROKES) return ink;
      return { ...ink, live: { tool: 'pen', id: `k${ink.nextId}`, color: CHILD_INK, width: PEN_WIDTH, points: [p] }, nextId: ink.nextId + 1, lastAt: a.t };
    }
    case 'move': {
      const L = ink.live;
      if (!L) return ink;
      const p = [round1(a.x), round1(a.y)];
      if (L.tool === 'eraser') return { ...ink, ...eraseAt(ink.strokes, p), lastAt: a.t };
      const last = L.points[L.points.length - 1];
      if (dist2(last, p) < MIN_STEP * MIN_STEP || L.points.length >= MAX_POINTS) return { ...ink, lastAt: a.t };
      return { ...ink, live: { ...L, points: [...L.points, p] }, lastAt: a.t };
    }
    case 'up': {
      const L = ink.live;
      if (!L) return ink;
      if (L.tool === 'eraser') {
        if (ink.strokes.length === L.before.length) return { ...ink, live: null, lastAt: a.t };
        // One undo step for the whole sweep of the eraser.
        return { ...ink, live: null, undo: [...ink.undo, { strokes: L.before, example: L.beforeExample }].slice(-MAX_UNDO), version: ink.version + 1, lastAt: a.t, example: null };
      }
      const { tool, ...stroke } = L;
      // Any new writing means the board no longer shows a prepared example.
      return commit(ink, { ...ink, live: null, strokes: [...ink.strokes, stroke], example: null }, a.t);
    }
    case 'cancel':
      if (ink.live?.tool === 'eraser') return { ...ink, live: null, strokes: ink.live.before };
      return { ...ink, live: null };
    case 'undo': {
      if (ink.live || !ink.undo.length) return ink;
      const prev = ink.undo[ink.undo.length - 1];
      return { ...ink, strokes: prev.strokes, example: prev.example, undo: ink.undo.slice(0, -1), version: ink.version + 1, lastAt: a.t };
    }
    case 'add': {
      const strokes = (a.strokes || []).slice(0, MAX_STROKES - ink.strokes.length).map((s, i) => ({ id: `k${ink.nextId + i}`, color: CHILD_INK, width: PEN_WIDTH, points: s.map(([x, y]) => [round1(x), round1(y)]) }));
      return commit(ink, { ...ink, strokes: [...ink.strokes, ...strokes], nextId: ink.nextId + strokes.length, example: a.example || null }, a.t);
    }
    case 'tag':
      // The scripted demo writes an example stroke by stroke, then names it (no undo step).
      return { ...ink, example: a.example || null };
    case 'clear':
      if (!ink.strokes.length) return ink;
      return commit(ink, { ...ink, strokes: [], live: null, example: null }, a.t);
    default:
      return ink;
  }
}

const eraseAt = (strokes, p) => {
  const keep = strokes.filter((s) => !touches(s, p));
  return keep.length === strokes.length ? {} : { strokes: keep };
};

/** A smooth SVG path through a stroke's points. */
export function strokePath(points) {
  if (!points?.length) return '';
  if (points.length === 1) { const [x, y] = points[0]; return `M${x},${y} l0.01,0`; }
  if (points.length === 2) return `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [x, y] = points[i];
    const mx = (x + points[i + 1][0]) / 2; const my = (y + points[i + 1][1]) / 2;
    d += ` Q${x},${y} ${round1(mx)},${round1(my)}`;
  }
  const l = points[points.length - 1];
  return `${d} L${l[0]},${l[1]}`;
}

/** The board cells (top_left ... bottom_right) the child's strokes sit in, for a board `H` units high. */
export const inkCells = (ink, H = 640) => {
  const out = new Set();
  for (const st of ink?.strokes || []) {
    for (const [x, y] of st.points) {
      const row = ['top', 'middle', 'bottom'][Math.max(0, Math.min(2, Math.floor(y / (H / 3))))];
      out.add(`${row}_${x < 500 ? 'left' : 'right'}`);
    }
  }
  return [...out].sort();
};

/** Is the child writing right now (a finger down)? */
export const writing = (ink) => !!ink.live;
export const hasInk = (ink) => (ink?.strokes?.length || 0) > 0;

export default { emptyInk, inkReducer, strokePath, touches, writing, hasInk, CHILD_INK };
