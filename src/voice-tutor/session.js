// ============================================================================
// ONE TUTORING SESSION: its state, the mascot's state, the caps, the evidence.
//
// sessionReducer(state, event) is the whole session as the browser holds it.
// Nothing is saved in milestone 1 (logging is milestone 4); the evidence a
// session gathers is kept here, marked source 'voice-prototype', and NEVER
// sets or clears `mastered` (owner, 10 Nov 2026: evidence only).
//
// Status, and what the HOREB robot shows:
//   ready      before the first turn                  listening
//   thinking   the tutor's turn is being worked out   thinking
//   speaking   the tutor's words and strokes play     speaking
//   listening  the child's turn                       listening
//   ended      wrap-up done, or a cap reached         listening
// Pure. Tested in tests/voice-tutor-session.test.mjs.
// ============================================================================
import { PHASES } from './commands.js';

// The caps, as settings (owner, 10 Nov 2026). The server holds the real ones
// (VOICE_TUTOR_SESSION_CAP_USD / VOICE_TUTOR_DAY_CAP_USD); these mirror them.
export const DEFAULT_SETTINGS = Object.freeze({
  model: 'claude-sonnet-5-5',
  effort: 'low',
  sessionCapUsd: 1.5,
  dayCapUsd: 3,
  sessionMinutes: 20,
  maxTurns: 60,
  maxSnapshots: 30,
});

const num = (v, d) => (Number.isFinite(Number(v)) && String(v ?? '').trim() !== '' ? Number(v) : d);
/** Settings from environment variables (the edge function's Deno.env, or a plain object in tests). */
export const settingsFrom = (get = () => undefined) => ({
  enabled: get('VOICE_TUTOR_ENABLED') === '1',
  allowlist: String(get('VOICE_TUTOR_ALLOWLIST') || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
  model: get('VOICE_TUTOR_MODEL') || DEFAULT_SETTINGS.model,
  effort: ['low', 'medium', 'high'].includes(get('VOICE_TUTOR_EFFORT')) ? get('VOICE_TUTOR_EFFORT') : DEFAULT_SETTINGS.effort,
  sessionCapUsd: num(get('VOICE_TUTOR_SESSION_CAP_USD'), DEFAULT_SETTINGS.sessionCapUsd),
  dayCapUsd: num(get('VOICE_TUTOR_DAY_CAP_USD'), DEFAULT_SETTINGS.dayCapUsd),
  sessionMinutes: DEFAULT_SETTINGS.sessionMinutes,
  maxTurns: num(get('VOICE_TUTOR_MAX_TURNS'), DEFAULT_SETTINGS.maxTurns),
  maxSnapshots: num(get('VOICE_TUTOR_MAX_SNAPSHOTS'), DEFAULT_SETTINGS.maxSnapshots),
});

/**
 * May the tutor take another (paid) turn? At a cap it winds down kindly.
 * @returns {{ ok:boolean, reason:string|null }}
 */
export const capCheck = ({ sessionUsd = 0, dayUsd = 0, turns = 0 } = {}, s = DEFAULT_SETTINGS) => {
  if (sessionUsd >= s.sessionCapUsd) return { ok: false, reason: 'session-cap' };
  if (dayUsd >= s.dayCapUsd) return { ok: false, reason: 'day-cap' };
  if (turns >= s.maxTurns) return { ok: false, reason: 'turn-cap' };
  return { ok: true, reason: null };
};

export const MASCOT = { ready: 'listening', thinking: 'thinking', speaking: 'speaking', listening: 'listening', ended: 'listening' };
export const mascotState = (status) => MASCOT[status] || 'listening';

export const newSession = ({ id, mode = 'mock', child = null, target = null, prerequisite = null, startedAt = 0 } = {}) => ({
  id, mode, child, target, prerequisite, startedAt,
  status: 'ready', phase: null, phasesSeen: [],
  turns: 0, transcript: [], evidence: [], diagnoses: [], dropped: [],
  cost: { sessionUsd: 0, dayUsd: 0 }, interruptions: 0, ended: null, error: null,
  snapshots: 0, looking: false,
});

const MAX_TRANSCRIPT = 200;
const push = (list, x, max = MAX_TRANSCRIPT) => [...list, x].slice(-max);

export function sessionReducer(s, ev) {
  switch (ev.type) {
    case 'child_said':
      if (s.status === 'ended') return s;
      return { ...s, status: 'thinking', error: null, transcript: push(s.transcript, { who: 'child', text: String(ev.text || '').slice(0, 300), at: ev.at, turn: s.turns }) };
    case 'request':
      return { ...s, status: 'thinking', error: null };
    case 'looked':
      // A picture of the child's work went to the tutor: the child sees that it did.
      if (s.status === 'ended') return s;
      return { ...s, status: 'thinking', looking: true, error: null, snapshots: s.snapshots + 1, transcript: push(s.transcript, { who: 'child', text: ev.text || 'A picture of my work on the board', snap: true, at: ev.at, turn: s.turns }) };
    case 'turn': {
      const steps = ev.steps || [];
      const phase = [...steps].reverse().find((x) => x.cmd === 'set_phase')?.phase || s.phase;
      const diagnoses = steps.filter((x) => x.cmd === 'record_diagnosis').map((d) => ({ ...d, turn: s.turns + 1, at: ev.at }));
      return {
        ...s, status: 'speaking', looking: false, turns: s.turns + 1, phase,
        phasesSeen: phase && !s.phasesSeen.includes(phase) ? [...s.phasesSeen, phase] : s.phasesSeen,
        diagnoses: [...s.diagnoses, ...diagnoses],
        dropped: [...s.dropped, ...(ev.dropped || []).map((d) => ({ ...d, turn: s.turns + 1 }))].slice(-100),
        cost: ev.spent ? { sessionUsd: ev.spent.session ?? s.cost.sessionUsd, dayUsd: ev.spent.day ?? s.cost.dayUsd } : s.cost,
        target: ev.target || s.target, prerequisite: ev.prerequisite === undefined ? s.prerequisite : ev.prerequisite,
      };
    }
    case 'said':
      // One sentence finished (or was cut short): it goes in the transcript as heard.
      return { ...s, transcript: push(s.transcript, { who: 'tutor', text: ev.text, at: ev.at, cut: !!ev.cut, turn: s.turns }) };
    case 'interrupted':
      return { ...s, interruptions: s.interruptions + 1 };
    case 'handed_over':
      return s.status === 'ended' ? s : { ...s, status: 'listening' };
    case 'marked':
      return { ...s, evidence: [...s.evidence, evidenceOf(ev)] };
    case 'ended':
      return { ...s, status: 'ended', ended: { summary: ev.summary || '', reason: ev.reason || 'wrap-up', at: ev.at } };
    case 'error':
      return { ...s, status: 'listening', looking: false, error: ev.message || 'Something went wrong.' };
    default:
      return s;
  }
}

/**
 * One piece of mastery evidence. There is deliberately no `mastered` field:
 * the mastery screens read these as "from the voice prototype" (milestone 4),
 * and a person decides.
 */
export const evidenceOf = ({ skill, correct, misconception = null, answer = '', askId = null, at = null }) => ({
  source: 'voice-prototype', skill: skill || null, correct: !!correct,
  misconception: correct ? null : (misconception || null), answer: String(answer).slice(0, 60), ask: askId, at,
});

export const phaseIndex = (p) => PHASES.indexOf(p);

export default { sessionReducer, newSession, capCheck, mascotState, settingsFrom, evidenceOf, DEFAULT_SETTINGS };
