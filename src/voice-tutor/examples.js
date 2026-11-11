// ============================================================================
// EXAMPLE CHILD DRAWINGS, for the scripted (free) mode only.
//
// The scripted tutor cannot read handwriting, so it is given a few prepared
// drawings, written in a child's hand on the board as strokes, each with the
// canned "what I see" a reading model would give. Anything else drawn freely
// gets the honest answer: some writing, not readable by the scripted tutor.
//
//   EXAMPLES[key]        { label, text, read, answer, clear }
//   handwriting(text, x, y, size, seed)   strokes for digits, / (as a stacked
//                        fraction), =, +, - and spaces, slightly uneven
// ============================================================================
const G = {
  1: [[[0.22, 0.18], [0.42, 0], [0.42, 1]]],
  2: [[[0.05, 0.25], [0.15, 0.05], [0.35, 0], [0.55, 0.1], [0.58, 0.3], [0.45, 0.5], [0.05, 1], [0.6, 1]]],
  3: [[[0.05, 0.1], [0.3, 0], [0.5, 0.08], [0.52, 0.28], [0.3, 0.45], [0.55, 0.6], [0.57, 0.85], [0.35, 1], [0.05, 0.92]]],
  4: [[[0.42, 1], [0.42, 0], [0.02, 0.68], [0.62, 0.68]]],
  5: [[[0.55, 0], [0.12, 0], [0.08, 0.45], [0.35, 0.38], [0.55, 0.5], [0.58, 0.78], [0.4, 0.98], [0.05, 0.92]]],
  6: [[[0.5, 0.05], [0.25, 0.1], [0.08, 0.45], [0.1, 0.85], [0.3, 1], [0.52, 0.88], [0.55, 0.65], [0.35, 0.52], [0.1, 0.62]]],
  7: [[[0.02, 0], [0.6, 0], [0.25, 1]]],
  8: [[[0.3, 0.48], [0.08, 0.28], [0.15, 0.05], [0.3, 0], [0.48, 0.08], [0.52, 0.28], [0.3, 0.48], [0.05, 0.7], [0.12, 0.95], [0.3, 1], [0.5, 0.93], [0.55, 0.7], [0.3, 0.48]]],
  9: [[[0.5, 0.35], [0.3, 0.48], [0.08, 0.35], [0.1, 0.1], [0.3, 0], [0.5, 0.1], [0.52, 0.4], [0.45, 1]]],
  0: [Array.from({ length: 17 }, (_, k) => [0.3 + 0.28 * Math.sin((k / 16) * 2 * Math.PI), 0.5 - 0.5 * Math.cos((k / 16) * 2 * Math.PI)])],
  '=': [[[0.05, 0.38], [0.6, 0.36]], [[0.05, 0.66], [0.6, 0.64]]],
  '+': [[[0.32, 0.22], [0.3, 0.82]], [[0.05, 0.52], [0.6, 0.5]]],
  '-': [[[0.05, 0.52], [0.6, 0.5]]],
};
const ADV = 0.72;

// A small seeded random, so an example looks the same every time.
const rand = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// More points along each line, so the stroke draws on smoothly and looks hand-made.
const densify = (pts, step) => {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i += 1) {
    const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 1; k <= n; k += 1) out.push([x0 + (x1 - x0) * (k / n), y0 + (y1 - y0) * (k / n)]);
  }
  return out;
};

const glyph = (ch, x, y, s, r) => {
  const strokes = G[ch] || [];
  const slant = 0.12 + (r() - 0.5) * 0.06;
  const dx = (r() - 0.5) * s * 0.06; const dy = (r() - 0.5) * s * 0.06;
  return strokes.map((st) => densify(st.map(([u, v]) => [x + dx + (u + (1 - v) * slant) * s + (r() - 0.5) * s * 0.03, y + dy + v * s + (r() - 0.5) * s * 0.03]), 5));
};

/**
 * Strokes for `text` with its top-left at (x, y), digits `size` tall.
 * "a/b" is written as a stacked fraction, the way children write them.
 * @returns {number[][][]} strokes of [x, y] points
 */
export function handwriting(text, x, y, size = 60, seed = 7) {
  const r = rand(seed);
  const out = [];
  let cx = x;
  for (const tok of String(text).match(/\d+\/\d+|\d|[=+\-]|\s+/g) || []) {
    if (/^\s+$/.test(tok)) { cx += size * 0.35; continue; }
    if (tok.includes('/')) {
      const [n, d] = tok.split('/');
      const s = size * 0.58;
      const w = Math.max(n.length, d.length) * ADV * s + s * 0.3;
      const nx = cx + (w - n.length * ADV * s) / 2; const dxs = cx + (w - d.length * ADV * s) / 2;
      [...n].forEach((ch, i) => out.push(...glyph(ch, nx + i * ADV * s, y - s * 0.05, s, r)));
      out.push(densify([[cx, y + size * 0.55 + (r() - 0.5) * 3], [cx + w, y + size * 0.53 + (r() - 0.5) * 3]], 6));
      [...d].forEach((ch, i) => out.push(...glyph(ch, dxs + i * ADV * s, y + size * 0.66, s, r)));
      cx += w + size * 0.25;
      continue;
    }
    out.push(...glyph(tok, cx, y + size * 0.3, size * 0.7, r));
    cx += ADV * size * 0.7 + size * 0.15;
  }
  return out;
}

const scribble = (x, y, seed = 3) => {
  const r = rand(seed);
  return [0, 1, 2].map((k) => densify(Array.from({ length: 9 }, (_, i) => [x + k * 34 + i * 7 + (r() - 0.5) * 22, y + 20 + (r() - 0.5) * 50]), 4));
};

export const EXAMPLES = {
  adds: { label: '1/3 = 4/6 (adds 3)', text: '1/3 = 4/6', read: 'one third equals four sixths, written as 1/3 = 4/6', answer: '4', clear: true },
  right: { label: '1/3 = 2/6 (right)', text: '1/3 = 2/6', read: 'one third equals two sixths, written as 1/3 = 2/6', answer: '2', clear: true },
  probe: { label: '2/4 = 6/8 (adds 4)', text: '2/4 = 6/8', read: 'two quarters equals six eighths, written as 2/4 = 6/8', answer: '6', clear: true },
  scribble: { label: 'A scribble (unclear)', text: null, read: null, answer: null, clear: false },
};

/** The strokes for an example, written in a board cell (default the lower right). */
export function exampleStrokes(key, boardH = 640, cell = 'bottom_right') {
  const e = EXAMPLES[key];
  if (!e) return [];
  const [row, side] = String(cell).split('_');
  const r = Math.max(0, ['top', 'middle', 'bottom'].indexOf(row));
  const x = side === 'left' ? 100 : 600; const y = r * (boardH / 3) + boardH / 6 - 40;
  return e.text ? handwriting(e.text, x, y, 64, key.length * 11) : scribble(x, y + 20);
}

export default { EXAMPLES, exampleStrokes, handwriting };
