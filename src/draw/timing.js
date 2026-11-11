// ============================================================================
// THE PACE OF THE HAND: how long each stroke takes, and when it starts.
//
// A stroke's time is its length over its kind's speed (the approved study:
// a ruled line 620 units a second, writing 330, shading 2600, a jump 520),
// never under 120 ms or over 1.5 s. Between strokes the pen lifts and moves:
// a short lift inside a letter or a part, a longer one to the next unit, and
// a breath between the stages of a drawing (outline, cuts, shading, label).
// Shading strokes follow each other every 45 ms, overlapping, as a hand shades.
//
//   layoutStrokes(strokes, { pace })        [{ t0, t1 }] from 0, and the total
//   naturalMs(strokes, { pace })            the drawing's own length
//   strokeTimes(strokes, { at, pace, fit }) absolute times on the speech clock;
//                                           `fit` (ms) squeezes the drawing so
//                                           it ends by then (the timeline sets it
//                                           so a drawing never runs past the next
//                                           step's word)
//   progressAt(times, now)                  each stroke's progress, eased
// pace 'slow' (the key idea of a lesson) is SLOW times longer throughout.
// An instrument laid on the board (kind 'place': the protractor, squared paper)
// is not drawn: all its strokes appear together, in PLACE_MS, as it is put down.
// Pure. Tested in tests/draw-engine.test.mjs.
// ============================================================================
export const SPEED = { line: 620, write: 330, hatch: 2600, jump: 520, mark: 560 };
export const MIN_MS = 120;
export const MAX_MS = 1500;
export const HATCH_EVERY = 45;
export const SLOW = 1.6;
export const PLACE_MS = 420;
export const LIFT = { inUnit: [70, 160], unit: [100, 260], phase: 140 };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const paceFactor = (pace) => (pace === 'slow' ? SLOW : 1);

/** One stroke's drawing time, before pace. */
export const strokeMs = (s) => (s.kind === 'place' ? PLACE_MS : clamp((s.len / (SPEED[s.kind] || SPEED.line)) * 1000, MIN_MS, MAX_MS));

const ends = (s) => [s.sp.pts[0], s.sp.pts[s.sp.pts.length - 1]];

/** Each stroke's start and end (ms from the item's start), and the total. */
export function layoutStrokes(strokes, { pace } = {}) {
  const k = paceFactor(pace);
  const times = [];
  let end = 0;           // when the pen is free (the latest end so far)
  let prev = null;
  strokes.forEach((s, i) => {
    const dur = strokeMs(s) * k;
    let t0 = 0;
    if (prev) {
      const sameUnit = prev.unit === s.unit && prev.phase === s.phase;
      if (s.kind === 'hatch' && prev.kind === 'hatch' && sameUnit) t0 = times[i - 1].t0 + HATCH_EVERY * k;
      else if (s.kind === 'place' && prev.kind === 'place' && sameUnit) t0 = times[i - 1].t0;
      else {
        const [, a] = ends(prev); const [b] = ends(s);
        const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const lift = sameUnit ? clamp(70 + dist * 0.25, ...LIFT.inUnit) : clamp(100 + dist * 0.3, ...LIFT.unit);
        t0 = end + (lift + (prev.phase !== s.phase ? LIFT.phase : 0)) * k;
      }
    }
    times.push({ t0, t1: t0 + dur });
    end = Math.max(end, t0 + dur);
    prev = s;
  });
  return { times, total: end };
}

export const naturalMs = (strokes, opts) => layoutStrokes(strokes, opts).total;

/** Absolute times on the speech clock, squeezed to `fit` ms when given. */
export function strokeTimes(strokes, { at = 0, pace, fit = null } = {}) {
  const { times, total } = layoutStrokes(strokes, { pace });
  const scale = fit != null && total > 0 ? Math.max(0, fit) / total : 1;
  return { times: times.map((t) => ({ t0: at + t.t0 * scale, t1: at + t.t1 * scale })), total: total * scale, at };
}

/** The study's ease: slow in, quick through the middle, slow out. */
export const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2);
export const progress = (t, now) => (now >= t.t1 ? 1 : now <= t.t0 ? 0 : ease((now - t.t0) / Math.max(1, t.t1 - t.t0)));
export const progressAt = (times, now) => times.map((t) => progress(t, now));

export default { SPEED, layoutStrokes, naturalMs, strokeTimes, strokeMs, progressAt, ease, SLOW };
