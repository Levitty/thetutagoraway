// ============================================================================
// A HOMEWORK SITTING: what the child's phone may do, and how it is marked
// (10 Nov 2026). Split from homework.js so the child's edge function carries
// only this and the answer checker, not the whole family bank.
// Pure: no database, no clock of its own.
// ============================================================================
import { checkAnswerMatch } from '../ai-tutor/answerCheck.js';

// Why a sitting locked, in the words Tuta shows the teacher (the same four as Tuta's own online homework).
export const LEAVE_REASONS = ['left the page', 'switched away', 'closed the page', 'went back'];
const norm = (t) => String(t ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

/** What the child's phone is sent: the question only, never the answer or the reasons. */
export const publicItem = (it) => it && ({ n: it.n, kind: it.kind, question: it.question, instruction: it.instruction,
  ...(it.table ? { table: it.table } : {}), ...(it.steps_shown ? { steps_shown: it.steps_shown } : {}),
  ...(it.kind === 'choice' ? { options: it.options.map(o => ({ key: o.key, text: o.text })) } : {}) });

// ---------------------------------------------------------------- marking
/** A child's response to one item: { correct, chosen, mis }. A choice is its letter or its text. */
export function markItem(it, response) {
  const raw = String(response ?? '').trim();
  if (raw === '') return { correct: false, chosen: '', mis: null, blank: true };
  if (it.kind === 'choice') {
    const o = it.options.find(x => x.key === raw.toUpperCase()) || it.options.find(x => norm(x.text) === norm(raw));
    if (!o) return { correct: false, chosen: raw.slice(0, 40), mis: null };
    return { correct: !!o.right, chosen: o.key, mis: o.right ? null : (o.mis || null) };
  }
  const correct = checkAnswerMatch(raw, { answer: it.answer, accepts: it.accepts });
  if (correct) return { correct: true, chosen: raw.slice(0, 60), mis: null };
  const w = (it.wrong || []).find(x => x.mis && (norm(x.value) === norm(raw) || checkAnswerMatch(raw, { answer: x.value, accepts: [x.value] })));
  return { correct: false, chosen: raw.slice(0, 60), mis: w?.mis || null };
}

// ---------------------------------------------------------------- the sitting
// issued -> started -> submitted, or -> locked when the child leaves the page before the end.
// A locked sitting takes no answers until the teacher reopens it (from Tuta, through the door).
export function step(s, ev, now) {
  const at = new Date(now).toISOString();
  const answers = s.answers || [];
  const next = answers.length + 1;
  const total = (s.items || []).length;
  if (s.mode === 'paper') return { ok: false, error: 'This homework is on paper.' };
  switch (ev.type) {
    case 'start':
      if (s.status === 'issued') return { ok: true, s: { ...s, status: 'started', started_at: at } };
      if (s.status === 'started') return { ok: true, s };
      return { ok: false, error: s.status === 'locked' ? 'locked' : 'finished' };
    case 'answer': {
      if (s.status !== 'started') return { ok: false, error: s.status === 'locked' ? 'locked' : s.status === 'submitted' ? 'finished' : 'not started' };
      if (Number(ev.n) !== next) return { ok: false, error: 'One question at a time, in order.' };
      const it = s.items[next - 1];
      const m = markItem(it, ev.response);
      const a = [...answers, { n: next, chosen: m.chosen, correct: m.correct, mis: m.mis, at }];
      const done = a.length >= total;
      return { ok: true, mark: m, s: { ...s, answers: a, status: done ? 'submitted' : 'started', ...(done ? { finished_at: at } : {}) } };
    }
    case 'leave':
      if (s.status !== 'started') return { ok: true, s };
      return { ok: true, s: { ...s, status: 'locked', locked_at: at, lock_reason: LEAVE_REASONS.includes(ev.reason) ? ev.reason : 'left the page', lock_question: next } };
    case 'reopen':
      if (s.status !== 'locked') return { ok: false, error: 'Only a locked homework can be reopened.' };
      return { ok: true, s: { ...s, status: 'started', locked_at: null, lock_reason: null, lock_question: null, reopen_count: (s.reopen_count || 0) + 1 } };
    default:
      return { ok: false, error: 'Unknown step' };
  }
}

/** The sitting as the phone sees it: where the child is, and the question to answer now. */
export function sittingView(s) {
  const answers = s.answers || [];
  const total = (s.items || []).length;
  return { status: s.status, total, answered: answers.length,
    right: s.status === 'submitted' ? answers.filter(a => a.correct).length : undefined,
    lock_question: s.lock_question || null,
    item: s.status === 'started' || s.status === 'issued' ? publicItem(s.items[answers.length]) || null : null };
}

/** The results Tuta is sent, per learner reference: state, score, and per question the skill, right or wrong, chosen and misconception. */
export function resultsFor(sittings) {
  const out = {};
  for (const s of sittings) {
    const answers = s.answers || [];
    out[s.learner_ref] = {
      status: s.status, answered: answers.length, out_of: (s.items || []).length, score: answers.filter(a => a.correct).length,
      started_at: s.started_at || null, finished_at: s.finished_at || null, locked_at: s.locked_at || null, lock_question: s.lock_question || null,
      items: answers.map(a => ({ n: a.n, cskill: s.items[a.n - 1]?.cskill || null, correct: !!a.correct, chosen: a.chosen ?? '', mis: a.mis || null })),
    };
  }
  return out;
}

