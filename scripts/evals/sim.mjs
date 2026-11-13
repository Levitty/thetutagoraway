// A pretend page and a pretend child, playing one whole lesson through the REAL server turn code
// (src/voice-tutor/tutorTurn.js), carrying the lesson state back and forth exactly as VoiceTutor.jsx does:
// the same request body (message, heard, answer with the seal, board, figures, history, elapsed_s, turn_index,
// phase, pace, lesson, probe), the same session reducer (transcript, pace, phase), the same board reducer,
// and the page's own silence rules (silence.js) on a simulated clock.
import { prepareTurn } from '../../src/voice-tutor/tutorTurn.js';
import { settingsFrom, newSession, sessionReducer } from '../../src/voice-tutor/session.js';
import { emptyBoard, applyStep, boardSummary, playFigure } from '../../src/voice-tutor/board.js';
import { figureNotes } from '../../src/draw/observe.js';
import { newWait, handOver, activity, probed, nextProbe } from '../../src/voice-tutor/silence.js';
import { screen } from '../../src/ai/safeguarding.js';
import { unseal } from '../../src/voice-tutor/seal.js';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { ask as askModel } from './api.mjs';
import { createChild, CHILD_FALLBACK } from './child.mjs';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const LIB = Object.fromEntries(Object.entries(JSON.parse(readFileSync(new URL('../../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'))).filter(([k]) => k.startsWith(F)));
const SECRET = 'eval-harness-seal-secret-not-a-real-key';
const USER = { id: 'u-eval-parent', email: 'eval@example.com' };
const CHILD = { id: 'c-eval', parent_id: USER.id, name: 'Wanjiru', grade: 'Grade 5' };
const SETTINGS = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: USER.email, VOICE_TUTOR_SESSION_CAP_USD: '99', VOICE_TUTOR_DAY_CAP_USD: '99', VOICE_TUTOR_MAX_TURNS: '300' }[k]));
const BOARD_H = 640;

const fakeDb = () => {
  const usage = []; const concerns = []; const evidence = [];
  return {
    usage, concerns, evidence,
    async getChild(id) { return id === CHILD.id ? CHILD : null; },
    async getProgress() { return { skills: {} }; },
    async spend() { const s = usage.reduce((a, u) => a + (u.cost_usd || 0), 0); return { session: s, day: s, snapshots: 0, lastSnapshotAt: null }; },
    async recordUsage(r) { usage.push(r); },
    async recordConcern(r) { concerns.push(r); },
    async recordEvidence(r) { evidence.push(r); },
  };
};

// ---- what the child sees of the board, in plain words
const partsText = (n, s) => (Array.isArray(s) ? `${s.length} of ${n} parts shaded (parts ${s.join(', ')})` : `${s ?? 0} of ${n} parts shaded`);
export function describeBoard(board) {
  const items = board.order.map((id) => {
    const it = board.items[id];
    switch (it.cmd) {
      case 'write_text': return `the words "${it.text}"`;
      case 'write_math': return `the maths "${it.expr}"`;
      case 'fraction_bar': return `a bar split into ${it.parts} equal parts, ${partsText(it.parts, it.shaded)}${it.second_bar ? `; under it a second bar of ${it.second_bar.parts} parts, ${partsText(it.second_bar.parts, it.second_bar.shaded)}` : ''}`;
      case 'shape': return `a ${it.kind} cut into ${it.parts || 1} parts, ${partsText(it.parts || 1, it.shaded)}`;
      case 'number_line': return `a number line from ${it.from} to ${it.to}${it.divisions ? ` with ${it.divisions} steps` : ''}`;
      case 'figure': {
        const p = board.play?.[id]; const sh = p?.state?.shade || [];
        return `a ${it.type} picture (${JSON.stringify(it.params || {}).slice(0, 120)})${it.controls?.length ? `, which you can ${it.controls.join('/')}` : ''}${sh.length ? `; you have shaded part(s) ${sh.join(', ')}` : ''}`;
      }
      default: return `a ${it.cmd}`;
    }
  });
  return items.length ? items.join('; ') : 'nothing yet (the board is empty)';
}

// ---- the pretend child lives in child.mjs (knowledge sheet, error rate, short messy speech, mishearing)
export { parseChild, garble, CHILD_MODEL } from './child.mjs';

/**
 * Plays one scenario. Returns { turns, ended, stopReason, concerns, usage, ... } for the transcript and the judge.
 * @param {object} o { sc, maxTurns, budget, callModel, onLog, seed, errorRate }
 */
export async function playLesson({ sc, maxTurns, budget, callModel, onLog = () => {}, seed = Number(process.env.EVAL_CHILD_SEED) || (Date.now() % 100000), errorRate, nonImproving = null, childCall = null, tutorModel = null }) {
  const sid = randomUUID();
  const db = fakeDb();
  const t0 = Date.now();
  let clock = 0;                       // simulated page clock, ms
  let session = newSession({ id: sid, mode: 'remote', child: CHILD, startedAt: 0 });
  let board = emptyBoard();
  let lesson = null;
  let wait = newWait('answer', 0);
  let openAsk = null;                  // the question the child may answer (public half, with its seal)
  let handedAt = null;
  let childReplies = 0;
  let modelCalls = 0;
  let childCost = 0;
  // The child model: Haiku (cheap, and not the tutor's or the judge's model), Sonnet at low effort if Haiku is not served.
  const child = createChild({
    sc, seed, errorRate, nonImproving,
    // `childCall`: a stand-in for the child's model (tests run whole lessons offline with it)
    callModel: childCall || (async ({ model, system, user, maxTokens }) => askModel(budget, 'child', { model, system, user, maxTokens, effort: model === CHILD_FALLBACK ? 'low' : null })),
  });
  const counted = async (req, o) => { modelCalls += 1; return callModel(req, o); };
  const log = [];                      // one entry per tutor turn
  const dispatch = (ev) => { session = sessionReducer(session, ev); };
  const result = { sid, scenario: sc.n, turns: log, ended: null, stopReason: null, probesDuringWork: null, notes: [] };
  let capHit = false;
  // The lesson's time limit: the app's 20 minutes, longer only for the scenario that needs 35 to 40 turns (scenario 41).
  // Round 2 (13 Nov 2026): the tutor's model may be chosen for a side-by-side run (run-evals.mjs --tutor-model); everything
  // else (effort, prompt, gate, child, judge) stays the same. The gate's rewrites use the same model as the turn.
  const base = tutorModel ? { ...SETTINGS, model: tutorModel } : SETTINGS;
  const settings = sc.minutes ? { ...base, sessionMinutes: sc.minutes } : base;
  let injected = null; let injectNote = '';

  const speechMs = (steps) => steps.reduce((ms, s) => ms + (s.cmd === 'say' ? 600 + 380 * s.text.split(/\s+/).length : ['write_text', 'write_math', 'fraction_bar', 'number_line', 'shape', 'figure', 'plot_points'].includes(s.cmd) ? 2500 : 300), 0);

  async function doTurn({ message = '', heard = null, probe = null, via = '', garbled = null }) {
    const interrupt = !probe && !!sc.interrupt && log.filter((t) => t.kind !== 'probe').length + 1 === sc.interrupt.turn;
    if (budget.remaining < 0.06) { capHit = true; throw Object.assign(new Error('budget'), { cap: true }); }
    const open = openAsk;
    if (!probe) openAsk = null;
    const body = {
      session_id: sid, child_id: CHILD.id, skill: sc.skill || null,
      message, heard, answer: open?.seal && message ? { seal: open.seal, response: message } : null,
      snapshot: null, snapshots_taken: 0, ink_cells: [], board: boardSummary(board), figures: figureNotes(board),
      history: session.transcript.map((h) => ({ who: h.who, text: h.text, turn: h.turn })),
      elapsed_s: Math.round(clock / 1000), turn_index: session.turns, phase: session.phase,
      voice: false, audio_in_s: 0,
      pace: { level: session.pace.level, repeat: session.pace.repeat, reason: session.pace.reason },
      lesson, probe,
      // How long the child thought before speaking (the lesson state's slow pace reads it; the page measures the same).
      think_s: message && handedAt != null ? Math.round((clock - handedAt) / 1000) : null,
    };
    dispatch({ type: 'request' });
    const started = Date.now();
    const calls0 = modelCalls;
    const t = await prepareTurn({ user: USER, body, db, callModel: counted, safeguard: screen, settings,  lib: LIB, secret: SECRET, now: t0 + clock });
    if (!t.go) throw new Error(`turn refused: ${t.status} ${t.body?.error || ''}`);
    const events = []; let firstStepMs = null;
    await t.go((ev) => { events.push(ev); if (ev.type === 'step' && firstStepMs == null) firstStepMs = Date.now() - started; });
    const latencyMs = Date.now() - started;
    clock += latencyMs;                // the child waits while the tutor thinks
    const meta = events.find((e) => e.type === 'meta') || {};
    const end = events.find((e) => e.type === 'end') || {};
    let steps = events.filter((e) => e.type === 'step').map((e) => e.step);
    const entry = {
      n: log.length + 1, kind: probe ? 'probe' : (log.length === 0 ? 'opening' : 'reply'), probe, childSaid: message || null, via, garbled, heard,
      steps: [], dropped: end.dropped || [], guard: end.guard || [], tester: end.tester || null, marked: meta.marked || null,
      cost: end.cost_usd || 0, latencyMs, firstStepMs, modelCalled: modelCalls > calls0, clockS: Math.round(clock / 1000), interrupted: false, heardOfTutor: null,
      answersKnown: [],
    };
    // The answers sealed in this turn's questions (the app knows them; the tutor must never say them).
    for (const st of steps) if (st.cmd === 'ask' && st.seal) {
      try { const q = await unseal(st.seal, SECRET, { session: sid, child: `${USER.id}_c${CHILD.id}`, now: t0 + clock }); if (q) entry.answersKnown.push({ ask: st.id, answer: q.item.answer }); } catch { /* ignore */ }
    }
    // The page's reducer events, in the page's order.
    if (meta.marked) dispatch({ type: 'marked', skill: meta.marked.skill, correct: meta.marked.correct, misconception: meta.marked.misconception, answer: meta.marked.answer, askId: meta.marked.ask, at: clock });
    if (interrupt) {
      // The child speaks over HOREB: only what was spoken before the cut is heard and drawn.
      const firstSay = steps.findIndex((s) => s.cmd === 'say');
      const secondSay = steps.findIndex((s, i) => i > firstSay && s.cmd === 'say');
      const words = steps[firstSay]?.text.split(/\s+/) || [];
      const cut = Math.max(2, Math.ceil(words.length * 0.55));
      const spoken = words.slice(0, cut).join(' ');
      const kept = steps.slice(0, secondSay < 0 ? steps.length : secondSay).filter((s) => s.cmd !== 'pause_for_child' && s.cmd !== 'ask');
      entry.steps = steps; entry.interrupted = true; entry.heardOfTutor = spoken;
      for (const st of kept) board = applyStep(board, st, clock, BOARD_H);
      dispatch({ type: 'turn', steps: kept, dropped: end.dropped, spent: end.spent, target: meta.target, prerequisite: meta.prerequisite });
      dispatch({ type: 'said', text: `${spoken} ...`, cut: true, at: clock });
      dispatch({ type: 'interrupted' });
      if (end.lesson) lesson = end.lesson;
      clock += 2500;
      log.push(entry);
      return entry;
    }
    for (const st of steps) {
      board = applyStep(board, st, clock, BOARD_H);
      if (st.cmd === 'ask') openAsk = st;
    }
    // Scenario 33: after the named turn the harness puts a WRONG label on the board (the tutor is actually wrong there).
    if (sc.inject && !injected && log.length + 1 >= sc.inject.afterTurn) {
      const fig = [...board.order].reverse().map((id) => board.items[id]).find((it) => ['fraction_bar', 'shape'].includes(it.cmd) && Number(it.parts) >= 2 && Number(it.parts) <= 12);
      if (fig) {
        const wrong = `${Number(fig.parts) + 1} equal parts`;
        for (const slot of ['bottom_right', 'bottom_left', 'middle_right', 'bottom', 'middle_left', 'top_right']) {
          const next = applyStep(board, { cmd: 'write_text', id: 'zlabel', text: wrong, slot, colour: fig.colour || 'ink' }, clock, BOARD_H);
          if (next.items.zlabel) { board = next; injected = { turn: log.length + 1, text: wrong, truth: `${fig.parts} equal parts`, on: fig.id }; break; }
        }
        if (injected) {
          injectNote = `A label on the board now says "${wrong}" but the picture ${fig.id} has ${fig.parts} parts, so the label is wrong. You notice, and say so plainly in a few words, in this reply.`;
          entry.injected = injected; result.injected = injected;
        }
      }
    }
    dispatch({ type: 'turn', steps, dropped: end.dropped, spent: end.spent, target: meta.target, prerequisite: meta.prerequisite });
    for (const st of steps) if (st.cmd === 'say') dispatch({ type: 'said', text: st.text, at: clock });
    if (end.lesson) lesson = end.lesson;
    entry.steps = steps;
    log.push(entry);
    onLog(`turn ${entry.n} ${entry.kind} ${(entry.cost).toFixed(3)} ${Math.round(latencyMs / 1000)}s`);
    clock += speechMs(steps);
    const ending = steps.find((s) => s.cmd === 'end_session');
    if (ending) { dispatch({ type: 'ended', summary: ending.summary, at: clock }); result.ended = 'tutor ended the lesson'; return entry; }
    const doing = [...steps].reverse().find((s) => s.cmd === 'pause_for_child')?.doing || 'answer';
    handedAt = clock;
    // The pace state: a child answering slowly but correctly gets twice the time before each probe (silence.js).
    wait = handOver(wait, { doing, probe: !!probe, now: clock, slow: !!lesson?.slow, thinking: (lesson?.fillers || 0) > 0 });
    dispatch({ type: 'handed_over', doing });
    entry.doing = doing;
    return entry;
  }

  const lastTutorSays = () => [...session.transcript].reverse().filter((h) => h.who === 'tutor').slice(0, 1).map((h) => h.text);
  const dialogue = () => session.transcript.map((h) => `${h.who === 'tutor' ? 'HOREB' : 'You'}: ${h.text}`).join('\n');

  async function childActs(note = '', thinkS = 4) {
    const last = log[log.length - 1] || {};
    const c0 = child.cost;
    const c = await child.act({
      dialogue: dialogue(), boardText: describeBoard(board), note, steps: last.steps || [],
      tutorText: (last.steps || []).filter((x) => x.cmd === 'say' || x.cmd === 'ask').map((x) => x.text || x.prompt || '').join(' '),
      answer: last.answersKnown?.[0]?.answer ?? null, doing: last.doing || null,
    });
    childCost += child.cost - c0;
    clock += thinkS * 1000;
    return { ...c, speech: c.speech };
  }

  // Silence, on the simulated clock, with the page's own rules (silence.js). Writing means the page never asks for a probe.
  async function silence(seconds, { writing = false } = {}) {
    const start = clock; let probes = 0;
    while (clock - start < seconds * 1000) {
      clock += 500;
      if (writing) { wait = activity(wait, clock); continue; }
      const p = nextProbe(wait, clock);
      if (p) { wait = probed(wait); probes += 1; await doTurn({ probe: { kind: p.kind, silent_s: p.silent_s } }); }
    }
    return probes;
  }

  // The child's words reach the tutor (the page's childSays).
  async function childSays(speech, { shade = null, write = null, heard = null, clean = false } = {}) {
    let text = speech;
    let via = '';
    if (shade) {
      const fig = board.order.find((id) => board.items[id].cmd === 'figure' && (board.items[id].controls || []).includes('shade'));
      if (fig) { for (const p of shade) board = playFigure(board, fig, 'shade', p, clock); via = `shaded part(s) ${shade.join(', ')} on ${fig}`; if (!text) text = 'I have shaded it.'; }
      else { text = `${text ? `${text} ` : ''}(I would shade part(s) ${shade.join(', ')})`.trim(); via = 'no shadable figure on the board: said in words'; }
    }
    if (write) { text = `I wrote ${write} on the board. Check my work.${speech ? ` ${speech}` : ''}`; via = `ink fallback: wrote "${write}" (as text, no picture)`; }
    const heardText = heard;
    let sent = text;
    let garbled = null;
    if (!clean) sent = child.heard(text, { always: !!sc.garble });   // scenario 27 always; every other scenario for a small share of turns
    if (sent !== text) garbled = text;
    wait = activity(wait, clock);
    childReplies += 1;
    dispatch({ type: 'child_said', text: sent, at: clock, thinkMs: handedAt != null ? clock - handedAt : undefined });
    await doTurn({ message: sent, heard: heardText, via, garbled });
  }

  // ---------------- the lesson
  let silenceDone = false; let taskDone = false; let consecutiveSilent = 0;
  try {
    await doTurn({});                                              // the hello (the page's start())
    for (let exchange = 1; exchange < maxTurns; exchange += 1) {
      if (result.ended || session.status === 'ended') break;
      const last = log[log.length - 1];
      let note = '';
      let think = sc.n === 17 ? 14 : sc.n === 3 ? 9 : 4;
      // Forced silence after a question (scenarios 1 and 17).
      if (sc.silent && !silenceDone && exchange === sc.silent.after && last.doing === 'answer') {
        silenceDone = true;
        const probes = await silence(sc.silent.seconds);
        note = probes ? `You said nothing for ${sc.silent.seconds} seconds. HOREB then spoke up ${probes} time(s) (see above). Now you reply as your behaviour says.` : '';
      }
      // A board task: the child works for a while; the page stays quiet while they write.
      if (sc.task && !taskDone && last.doing === 'task') {
        taskDone = true;
        const before = log.length;
        await silence(sc.task.seconds, { writing: true });
        result.probesDuringWork = log.length - before;             // the page asks for none while the child writes
        note = `You have been working on HOREB's board task for ${sc.task.seconds} seconds and have just stopped. Now do the task as your behaviour says (use SHADE: or WRITE: if it fits) and say what you did.`;
      }
      // Scripted reply (scenario 29).
      const scripted = [].concat(sc.fixed || []).find((f) => f.turn === childReplies + 1);
      if (scripted) { await childSays(scripted.text, { clean: true, write: scripted.write || null }); continue; }
      const heard = last.interrupted ? last.heardOfTutor : null;
      if (heard) note = `You are speaking over HOREB, who was in the middle of saying: "${heard} ...". Say your interruption now, as your behaviour says.`;
      if (injectNote && !note) { note = injectNote; injectNote = ''; }
      let c = await childActs(note, heard ? 1 : think);
      if (c.silent && !heard && consecutiveSilent < 1) {
        consecutiveSilent += 1;
        const probes = await silence(25);
        const again = await childActs(`You said nothing for 25 seconds${probes ? ` and HOREB spoke up ${probes} time(s) (see above)` : ''}. Now you say something.`, 2);
        c = again;
      } else consecutiveSilent = 0;
      if (c.silent) c = { ...c, speech: 'um...', silent: false };
      await childSays(c.speech, { shade: c.shade, write: c.write, heard });
    }
  } catch (e) {
    if (e.name === 'CapReached' || e.cap) { capHit = true; result.stopReason = 'cap'; } else throw e;
  }
  if (capHit && !result.stopReason) result.stopReason = 'cap';

  result.sessionTurns = session.turns;
  result.finalPhase = session.phase;
  result.lesson = lesson;
  result.concerns = db.concerns.map((c) => ({ tier: c.tier, categories: c.categories }));
  result.evidenceRows = db.evidence.length;
  result.board = describeBoard(board);
  result.ended = result.ended || (session.status === 'ended' ? 'ended' : result.stopReason ? 'cap' : 'max turns');
  result.simSeconds = Math.round(clock / 1000);
  result.wallMs = Date.now() - t0;
  result.cost = log.reduce((a, t) => a + t.cost, 0);
  result.modelCalls = modelCalls;
  result.childCost = childCost;
  result.child = { model: child.model, stats: child.stats, sheet: { misconception: child.sheet.misc, errorRate: child.target }, seed };
  return result;
}
