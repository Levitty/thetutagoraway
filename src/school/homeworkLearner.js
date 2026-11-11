// The child's door for school homework (10 Nov 2026): open, start, answer, leave, keyed by the sitting's
// code alone. See homeworkDoor.js for the deps; this file carries no family bank.
// The learner home (learnerHome.js) answers here too: action 'learner_home'.
import { step, sittingView, resultsFor } from './homeworkSitting.js';
import { learnerHome } from './learnerHome.js';

export const CODE = /^[A-Z2-9]{10}$/;
const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error, more = {}) => ({ status, body: { success: false, error, ...more } });

/** The results of one homework, as Tuta's door takes them. */
export const resultsBody = (hw, sittings) => ({ action: 'homework_results', results: { [hw.homework_ref]: resultsFor(sittings) } });

export async function learnerHomework(p, deps) {
  const { store } = deps;
  // The learner home (11 Nov 2026): all of one learner's homework, keyed by the link code or the parent's sign-in.
  if (p?.action === 'learner_home') return learnerHome(p, deps);
  const code = String(p?.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!CODE.test(code)) return no(404, 'This link is not right. Ask the teacher for it again.');
  const found = await store.sittingByCode(code);
  if (!found) return no(404, 'This link is not right. Ask the teacher for it again.');
  const { sitting, homework, door } = found;
  const s0 = { ...sitting, mode: homework.mode };
  const head = { title: homework.title, due_on: homework.due_on, count: (sitting.items || []).length, mode: homework.mode };
  if (homework.mode === 'paper') return ok({ ...head, view: { status: 'paper' } });

  const done = async (s) => {
    await store.saveSitting(s);
    if ((s.status === 'submitted' || s.status === 'locked') && deps.push && door?.results_url) {
      try { if (await deps.push(door, resultsBody(homework, [s]))) await store.saveSitting({ ...s, pushed_at: new Date(deps.now()).toISOString() }); }
      catch { /* Tuta's teacher can ask for the results with "Check for results" */ }
    }
  };

  if (p.action === 'open') return ok({ ...head, view: sittingView(s0) });
  if (p.action === 'start') {
    const r = step(s0, { type: 'start' }, deps.now());
    if (!r.ok) return ok({ ...head, view: sittingView(s0) });
    if (r.s !== s0) await store.saveSitting(r.s);
    return ok({ ...head, view: sittingView(r.s) });
  }
  if (p.action === 'answer') {
    const r = step(s0, { type: 'answer', n: p.n, response: p.response }, deps.now());
    if (!r.ok) return ok({ ...head, refused: r.error, view: sittingView(s0) });
    await done(r.s);
    const it = s0.items[Number(p.n) - 1];
    const right = it.kind === 'choice' ? it.options.find(o => o.right) : null;
    const reason = !r.mark.correct ? (it.kind === 'choice' ? it.options.find(o => o.key === r.mark.chosen)?.why : (it.wrong || []).find(w => w.mis && w.mis === r.mark.mis)?.why) : '';
    return ok({ ...head, mark: { correct: r.mark.correct, answer: right ? `${right.key}. ${right.text}` : it.answer, why: reason || '' }, view: sittingView(r.s) });
  }
  if (p.action === 'leave') {
    const r = step(s0, { type: 'leave', reason: p.reason }, deps.now());
    if (r.ok && r.s !== s0) await done(r.s);
    return ok({ ...head, view: sittingView(r.ok ? r.s : s0) });
  }
  return no(400, 'Unknown action');
}

