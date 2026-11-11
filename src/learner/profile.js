// ============================================================================
// THE LEARNER PROFILE: what the tutor remembers about how a child likes to learn
// (11 Nov 2026, docs/learner-model.md, "A tutor that knows the child").
//
// Two small things, both context only (they never decide mastery):
//   interests    up to 8 short words the child mentioned (football, chapati, a pet),
//                used in the tutor's examples
//   what_helps   a short list of { move, helped, at }: what the tutor tried and
//                whether it helped (drawing it, counting together, ...)
// Pure. The server merges the tutor's silent note_interest / note_what_helped
// commands into the stored profile with these functions; the next lesson's
// context is written from it. Nothing here can hold a name, a place or a number:
// interests pass interestOf (commands.js), moves are a fixed list.
// ============================================================================
import { INTEREST_RE, MOVES } from '../voice-tutor/commands.js';

export const MAX_INTERESTS = 8;
export const MAX_HELPS = 12;

/** A clean interest word, or null. The child's own name (any part of it) is never kept. */
export const cleanInterest = (v, { names = [] } = {}) => {
  if (/[0-9@]/.test(String(v ?? ''))) return null;
  const t = String(v ?? '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!INTEREST_RE.test(t)) return null;
  const own = names.flatMap((n) => String(n || '').toLowerCase().split(/\s+/)).filter((w) => w.length > 1);
  if (t.split(' ').some((w) => own.includes(w))) return null;
  return t;
};

/** Newest interest first, no repeats, at most 8. */
export const mergeInterests = (existing = [], added = [], opts = {}) => {
  const out = [];
  for (const raw of [...added, ...(existing || [])]) {
    const t = cleanInterest(raw, opts);
    if (t && !out.includes(t)) out.push(t);
  }
  return out.slice(0, MAX_INTERESTS);
};

/**
 * Merge new { move, helped } notes into the list. A move keeps one entry: its latest result,
 * and when it was last noted. The newest MAX_HELPS entries stay.
 */
export const mergeWhatHelps = (existing = [], notes = [], now = Date.now()) => {
  const at = new Date(now).toISOString();
  const by = new Map();
  for (const e of Array.isArray(existing) ? existing : []) if (MOVES.includes(e?.move) && typeof e.helped === 'boolean') by.set(e.move, { move: e.move, helped: e.helped, at: String(e.at || at).slice(0, 30) });
  for (const n of notes) if (MOVES.includes(n?.move) && typeof n.helped === 'boolean') { by.delete(n.move); by.set(n.move, { move: n.move, helped: n.helped, at }); }
  return [...by.values()].sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, MAX_HELPS);
};

/** The moves that helped (newest first) and the ones that did not. */
export const helpsSummary = (list = []) => ({
  helped: (list || []).filter((e) => e.helped).map((e) => e.move),
  didNot: (list || []).filter((e) => !e.helped).map((e) => e.move),
});

export default { cleanInterest, mergeInterests, mergeWhatHelps, helpsSummary, MAX_INTERESTS, MAX_HELPS };
