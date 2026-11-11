// ============================================================================
// PATHS: the one place a stroke's shape is read. A stroke is an SVG path
// string (absolute M L H V C Q A Z, one pen-down each); sample(d) walks it into
// points spaced about STEP apart and measures it, once, when the stroke is
// made. The board then needs no layout work while drawing: the dash offset is
// set from the length, and the pen tip is placed from the points.
// Pure: no DOM. Tested in tests/draw-engine.test.mjs.
// ============================================================================
export const STEP = 3;

const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gi;

/** [{ c, args }] from an absolute path string. */
export function parsePath(d) {
  const out = [];
  const re = /([MLHVCQAZ])([^MLHVCQAZ]*)/gi;
  let m;
  while ((m = re.exec(d))) {
    const c = m[1];
    if (c !== c.toUpperCase()) throw new Error(`relative path command ${c} is not used here`);
    out.push({ c, args: (m[2].match(NUM) || []).map(Number) });
  }
  return out;
}

const lerp = (a, b, t) => a + (b - a) * t;
function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  // SVG endpoint arc to centre form (SVG 1.1 implementation notes, F.6.5).
  const c = Math.cos(phi); const s = Math.sin(phi);
  const dx = (x1 - x2) / 2; const dy = (y1 - y2) / 2;
  const x1p = c * dx + s * dy; const y1p = -s * dx + c * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const k = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = k * (rx * y1p) / ry; const cyp = k * -(ry * x1p) / rx;
  const cx = c * cxp - s * cyp + (x1 + x2) / 2; const cy = s * cxp + c * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI;
  return (t) => {
    const a = t1 + dt * t;
    return [cx + rx * Math.cos(a) * c - ry * Math.sin(a) * s, cy + rx * Math.cos(a) * s + ry * Math.sin(a) * c];
  };
}

/** Points along the path, about STEP apart, and its length: { pts:[[x,y]...], len }. */
export function sample(d, step = STEP) {
  const pts = [];
  let x = 0; let y = 0; let sx = 0; let sy = 0;
  const seg = (f, approx) => {
    const n = Math.max(1, Math.ceil(approx / step));
    for (let i = 1; i <= n; i += 1) pts.push(f(i / n));
  };
  for (const { c, args: a } of parsePath(d)) {
    if (c === 'M') { x = a[0]; y = a[1]; sx = x; sy = y; if (pts.length) throw new Error('one pen-down per stroke: a second M'); pts.push([x, y]); for (let i = 2; i + 1 < a.length; i += 2) { const x0 = x, y0 = y; x = a[i]; y = a[i + 1]; seg((t) => [lerp(x0, x, t), lerp(y0, y, t)], Math.hypot(x - x0, y - y0)); } continue; }
    if (c === 'L' || c === 'H' || c === 'V' || c === 'Z') {
      const list = c === 'Z' ? [[sx, sy]] : c === 'H' ? a.map((v) => [v, y]) : c === 'V' ? a.map((v) => [x, v]) : a.reduce((l, v, i) => (i % 2 ? (l[l.length - 1].push(v), l) : (l.push([v]), l)), []);
      for (const [nx, ny] of list) { const x0 = x, y0 = y; seg((t) => [lerp(x0, nx, t), lerp(y0, ny, t)], Math.hypot(nx - x0, ny - y0)); x = nx; y = ny; }
      continue;
    }
    if (c === 'C') {
      for (let i = 0; i + 5 < a.length; i += 6) {
        const [x1, y1, x2, y2, x3, y3] = a.slice(i, i + 6); const x0 = x, y0 = y;
        const f = (t) => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]; };
        seg(f, Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2));
        x = x3; y = y3;
      }
      continue;
    }
    if (c === 'Q') {
      for (let i = 0; i + 3 < a.length; i += 4) {
        const [x1, y1, x2, y2] = a.slice(i, i + 4); const x0 = x, y0 = y;
        seg((t) => { const u = 1 - t; return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2]; }, Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1));
        x = x2; y = y2;
      }
      continue;
    }
    if (c === 'A') {
      for (let i = 0; i + 6 < a.length; i += 7) {
        const [rx, ry, rot, fa, fs, nx, ny] = a.slice(i, i + 7);
        const f = arcPoints(x, y, rx, ry, (rot * Math.PI) / 180, fa ? 1 : 0, fs ? 1 : 0, nx, ny);
        seg(f, Math.PI * Math.max(Math.abs(rx), Math.abs(ry)) * 2);
        x = nx; y = ny;
      }
    }
  }
  let len = 0;
  const cum = [0];
  for (let i = 1; i < pts.length; i += 1) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(len); }
  return { pts, cum, len };
}

/** The point at fraction p (0..1) of a sampled path's length. */
export function pointAt(s, p) {
  const { pts, cum, len } = s;
  if (!pts.length) return [0, 0];
  const want = Math.max(0, Math.min(1, p)) * len;
  let lo = 0; let hi = cum.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < want) lo = mid + 1; else hi = mid; }
  if (lo === 0) return pts[0];
  const a = cum[lo - 1]; const b = cum[lo];
  const t = b > a ? (want - a) / (b - a) : 0;
  return [lerp(pts[lo - 1][0], pts[lo][0], t), lerp(pts[lo - 1][1], pts[lo][1], t)];
}

export const bboxOf = (pointLists, pad = 0) => {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (const list of pointLists) for (const [x, y] of list) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  if (!Number.isFinite(x0)) return null;
  return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
};
