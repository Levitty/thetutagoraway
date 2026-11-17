// ============================================================================
// SILENCE, BY WHAT THE CHILD IS DOING (owner, 12 Nov 2026: "if student goes silent probe but
// depending; if it has tasked student to do something that's different").
//
// Every hand-over (pause_for_child) says what the child is now doing (commands.js DOINGS):
//   answer  answering a question       a nudge at about 8 s, a smaller question at about 20 s,
//                                      then HOREB waits quietly and keeps listening (12 Nov 2026,
//                                      run 2026-11-12-1824: 6 s and 15 s nagged a slow child)
//   task    doing something on the     quiet while they work; when they stop writing the page
//           board (shade, draw, write) takes the board picture (snapshot.js) and HOREB reacts;
//                                      after about 45 s with nothing at all, one check-in
//   talk    free talk, an opinion      like answer, but gentler and later
//
// A probe is a real turn: the page asks the server for it with the reason (kind and seconds),
// and the model writes the words for the moment (tutorTurn.js keeps it short). The wait is one
// state across the probes: a probe's own hand-over never starts the count again, so the probes
// can never loop. Only the child (speech, ink, typing) starts it again.
//
// THE PACE (12 Nov 2026): a child who answers slowly but correctly (the lesson state's `slow`, orchestrator.js: a right
// answer after a probe or after a long think) gets twice the time before each probe. The wait carries it (w.slow); a
// hand-over that names it (slow: true/false) sets it, one that does not keeps it.
//
// Pure. Tested in tests/voice-tutor-silence.test.mjs. The page keeps one wait in a ref:
//   handOver(w, { doing, probe, now, slow })   HOREB finished a turn (slow: the lesson state's `slow`, when known)
//   activity(w, now)                     the child spoke, wrote or typed
//   nextProbe(w, now)                    -> null, or { kind, silent_s, reason } to ask for now
//   probed(w, now)                       the probe was asked for
// ============================================================================

import { DOINGS } from './commands.js';

export { DOINGS };

export const SILENCE = Object.freeze({
  answer: { firstMs: 8000, secondTotalMs: 20000, secondQuietMs: 8000 },
  talk: { firstMs: 12000, secondTotalMs: 30000, secondQuietMs: 10000 },
  task: { checkinMs: 45000 },
});

// What each probe asks the model for (the server turns the kind into the context line).
export const PROBE_KINDS = ['answer_nudge', 'answer_smaller', 'task_checkin', 'talk_nudge', 'talk_again'];

// A slow, careful child (the pace state) waits this many times as long before each probe.
export const SLOW_FACTOR = 2;

export const newWait = (doing = 'answer', now = 0, slow = false) => ({ doing: DOINGS.includes(doing) ? doing : 'answer', since: now, lastHandAt: now, probes: 0, slow: slow === true });

/** HOREB handed over. After a probe the wait goes on (same count); after any other turn it starts again. */
export function handOver(w, { doing = 'answer', probe = false, now = 0, slow = undefined } = {}) {
  const d = DOINGS.includes(doing) ? doing : 'answer';
  const sl = typeof slow === 'boolean' ? slow : !!w?.slow;
  if (probe && w && w.doing === d) return { ...w, lastHandAt: now, slow: sl };
  return newWait(d, now, sl);
}

/** The child did something (spoke, wrote, typed): the wait starts again from now. */
export const activity = (w, now = 0) => ({ ...(w || newWait()), since: now, lastHandAt: now, probes: 0 });

/** A probe was asked for. */
export const probed = (w) => ({ ...w, probes: (w?.probes || 0) + 1 });

/**
 * Is a probe due now? quiet is the silence since HOREB last finished (or the child last did
 * anything); total is the silence since the child last did anything (or the first hand-over).
 */
export function nextProbe(w, now, c = SILENCE) {
  if (!w) return null;
  const quiet = now - Math.max(w.since, w.lastHandAt);
  const total = now - w.since;
  const s = (ms) => Math.round(ms / 1000);
  if (w.doing === 'task') {
    if (w.probes === 0 && quiet >= c.task.checkinMs) return { kind: 'task_checkin', silent_s: s(total), reason: `the child has been working on the task for ${s(total)} s without a word or a stroke` };
    return null;
  }
  const r0 = w.doing === 'talk' ? c.talk : c.answer;
  const k = w.slow ? SLOW_FACTOR : 1;
  const r = { firstMs: r0.firstMs * k, secondTotalMs: r0.secondTotalMs * k, secondQuietMs: r0.secondQuietMs * k };
  const first = w.doing === 'talk' ? 'talk_nudge' : 'answer_nudge';
  const second = w.doing === 'talk' ? 'talk_again' : 'answer_smaller';
  if (w.probes === 0 && quiet >= r.firstMs) return { kind: first, silent_s: s(total), reason: `the child has been silent for ${s(total)} s` };
  if (w.probes === 1 && total >= r.secondTotalMs && quiet >= r.secondQuietMs) return { kind: second, silent_s: s(total), reason: `the child has been silent for ${s(total)} s, after one nudge` };
  // After that: wait quietly and keep listening.
  return null;
}


/** A probe as the server accepts it from the page: a known kind and the seconds of silence. Anything else is no probe. */
export const cleanProbe = (raw) => (raw && typeof raw === 'object' && PROBE_KINDS.includes(raw.kind)
  ? { kind: raw.kind, silent_s: Math.max(0, Math.min(600, Math.round(Number(raw.silent_s) || 0))) }
  : null);

export default { DOINGS, SILENCE, SLOW_FACTOR, PROBE_KINDS, newWait, handOver, activity, probed, nextProbe, cleanProbe };
