// ============================================================================
// SNAPSHOTS: when the tutor looks at the child's work (milestone 2).
//
// A snapshot is a picture of the board only (the SVG, tutor ink and child ink,
// drawn to a canvas, downscaled and compressed). Never the camera. It goes to
// the tutoring model with the next turn, server side, and is not stored
// (storage and review are milestone 4).
//
//   autoSnapDue(s, now)   after IDLE_MS with no writing, on the child's turn,
//                         when the ink has changed since the last picture, at
//                         most one every AUTO_GAP_MS, and never while a finger
//                         is down
//   checkAllowed(s, now)  "Check my work": at once, but not while writing, not
//                         more than one every CHECK_GAP_MS, never on an empty
//                         board
//   validateSnapshot(x)   the server's (and the page's) check of what is sent
//   imageTokens(w, h)     what a picture costs in input tokens (w * h / 750)
//
// Pure. Tested in tests/voice-tutor-snapshot.test.mjs.
// ============================================================================
export const IDLE_MS = 4000;
export const AUTO_GAP_MS = 10000;
export const CHECK_GAP_MS = 3000;
export const MAX_PER_SESSION = 30;
export const MAX_WIDTH = 1000;          // pixels: the board is 1000 units wide
export const MAX_HEIGHT = 1100;
export const MAX_BYTES = 300 * 1024;    // of the base64 text
export const TARGET_BYTES = 150 * 1024; // the capture lowers quality to get under this
export const SNAP_ID = /^snap-[0-9]{1,3}$/;

/** Input tokens for an image (Anthropic's published estimate). */
export const imageTokens = (w, h) => Math.ceil((Math.max(0, w) * Math.max(0, h)) / 750);

/**
 * @param {{ status:string, writing:boolean, inkVersion:number, snappedVersion:number,
 *           hasInk:boolean, lastInkAt:number|null, lastSnapAt:number|null, count:number }} s
 */
export const autoSnapDue = (s, now) => {
  if (s.status !== 'listening' || s.writing || !s.hasInk) return false;
  if (s.inkVersion === s.snappedVersion) return false;
  if (s.count >= MAX_PER_SESSION) return false;
  if (s.lastInkAt == null || now - s.lastInkAt < IDLE_MS) return false;
  if (s.lastSnapAt != null && now - s.lastSnapAt < AUTO_GAP_MS) return false;
  return true;
};

/** @returns {{ ok:boolean, reason:string|null }} */
export const checkAllowed = (s, now) => {
  if (s.writing) return { ok: false, reason: 'still writing' };
  if (!s.hasInk) return { ok: false, reason: 'nothing written yet' };
  if (s.count >= MAX_PER_SESSION) return { ok: false, reason: 'enough pictures for one lesson' };
  if (s.lastSnapAt != null && now - s.lastSnapAt < CHECK_GAP_MS) return { ok: false, reason: 'just looked' };
  if (s.status === 'thinking') return { ok: false, reason: 'HOREB is thinking' };
  return { ok: true, reason: null };
};

/**
 * What the page sends: { id:'snap-3', media:'image/jpeg'|'image/png', data:<base64>,
 * w, h, reason:'check'|'idle', strokes:n }. Returns the cleaned snapshot, or
 * { error } saying why it cannot be used.
 */
export function validateSnapshot(x) {
  if (!x || typeof x !== 'object') return { error: 'no picture' };
  if (!SNAP_ID.test(String(x.id || ''))) return { error: 'bad picture id' };
  if (!['image/jpeg', 'image/png'].includes(x.media)) return { error: 'not a jpeg or png' };
  const data = String(x.data || '');
  if (!data || data.length > MAX_BYTES) return { error: data ? 'picture too large' : 'empty picture' };
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return { error: 'not base64' };
  const w = Number(x.w); const h = Number(x.h);
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 50 || h < 50 || w > MAX_WIDTH || h > MAX_HEIGHT) return { error: 'picture size out of range' };
  // The bytes must really be a jpeg or png (magic numbers), not just say so.
  const head = data.slice(0, 8);
  if (x.media === 'image/jpeg' && !head.startsWith('/9j/')) return { error: 'not really a jpeg' };
  if (x.media === 'image/png' && !head.startsWith('iVBORw0K')) return { error: 'not really a png' };
  return { id: x.id, media: x.media, data, w, h, reason: x.reason === 'check' ? 'check' : 'idle', strokes: Math.max(0, Number(x.strokes) || 0) };
}

export default { autoSnapDue, checkAllowed, validateSnapshot, imageTokens, IDLE_MS, AUTO_GAP_MS, CHECK_GAP_MS, MAX_PER_SESSION };
