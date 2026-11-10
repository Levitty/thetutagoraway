// ============================================================================
// THE LIVE TUTOR SESSION WINDOW (prototype, milestone 1): the board takes most
// of the screen, the HOREB robot sits in a corner box (listening, thinking,
// speaking), a transcript strip shows the tutor's words at speaking pace, and
// the child types.
//
// Test only: behind VITE_VOICE_TUTOR=1 and an allowlist stub (the admin list,
// or VITE_VOICE_TUTOR_ALLOWLIST). Adult test accounts only until consent
// (milestone 5); the server enforces the same.
//
//   /voice-tutor                  scripted tutor, no model, no cost
//   /voice-tutor?mode=live        the real tutor (the voice-tutor edge function)
//   /voice-tutor?demo=auto        the scripted lesson plays itself (demo child answers)
// ============================================================================
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { supabase } from '../supabase.js';
import { Board, BOARD_H, BOARD_H_PORTRAIT } from './Board.jsx';
import { emptyBoard, applyStep, boardSummary } from './board.js';
import { validateTurn, PHASES } from './commands.js';
import { buildTimeline, createPlayer, advance, interrupt } from './timeline.js';
import { sessionReducer, newSession, mascotState } from './session.js';
import { providersFor } from './providers.js';
import { DEMO_ANSWERS } from './mockTutor.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';

const ENV = import.meta.env || {};
export const VOICE_TUTOR_ON = ENV.VITE_VOICE_TUTOR === '1';
const ALLOWLIST = String(ENV.VITE_VOICE_TUTOR_ALLOWLIST || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const clock = () => performance.now();
const params = () => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);

// Upright phone or not: the board takes a taller shape upright.
function usePortrait() {
  const q = '(orientation: portrait)';
  const [on, setOn] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false));
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const m = window.matchMedia(q);
    const f = () => setOn(m.matches);
    m.addEventListener?.('change', f);
    return () => m.removeEventListener?.('change', f);
  }, []);
  return on;
}

const MASCOT_LABEL = { listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking' };
const PHASE_LABEL = { warmup: 'Warm-up', teach: 'Teach', guided: 'Together', independent: 'On your own', wrapup: 'Wrap-up' };

export function VoiceTutor({ user = null, isAdmin = false, onNavigate = null }) {
  useHorebLook();
  const portrait = usePortrait();
  const boardH = portrait ? BOARD_H_PORTRAIT : BOARD_H;
  const q = useMemo(params, []);
  const demo = q.get('demo') === 'auto';
  const email = String(user?.email || '').toLowerCase();
  const allowed = !!user && (isAdmin || (email && ALLOWLIST.includes(email)));
  const canMock = allowed || ENV.DEV === true;
  const [mode, setMode] = useState(q.get('mode') === 'live' && allowed ? 'remote' : 'mock');
  const [children, setChildren] = useState([]);
  const [childId, setChildId] = useState('');
  const [skill, setSkill] = useState('');
  const [session, dispatch] = useReducer(sessionReducer, null, () => newSession({ id: uid() }));
  const [board, setBoard] = useState(emptyBoard);
  const boardRef = useRef(board);
  const [now, setNow] = useState(0);
  const [live, setLive] = useState(null);     // { sentences, words } of the turn being spoken
  const [ask, setAsk] = useState(null);       // the public half of the open question
  const askRef = useRef(null);
  const [input, setInput] = useState('');
  const [tester, setTester] = useState(false);
  const [nudge, setNudge] = useState(false);
  const player = useRef(null);
  const turnSteps = useRef([]);
  const saidK = useRef(new Set());
  const providers = useRef(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const startedAt = useRef(0);
  const transcriptEnd = useRef(null);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { askRef.current = ask; }, [ask]);

  // Live mode: the parent's children (a parent's account is the child's account).
  useEffect(() => {
    if (mode !== 'remote' || !user?.id) return;
    supabase.from('children').select('id, name, grade').eq('parent_id', user.id).order('created_at')
      .then(({ data }) => setChildren(data || []));
  }, [mode, user?.id]);

  // ---------------------------------------------------------------- the clock
  // One frame loop: fire every step that is due on the speech clock, reveal the
  // words spoken so far, and hand the turn to the child when it is over.
  useEffect(() => {
    let raf;
    const tick = () => {
      const t = clock();
      const pl = player.current;
      if (pl && !pl.stopped) {
        const { due, words, done } = advance(pl, t);
        if (due.length) {
          let b = boardRef.current;
          for (const e of due) b = fire(b, turnSteps.current[e.i], pl.startedAt + e.t);
          boardRef.current = b;
          setBoard(b);
        }
        setLive((l) => (l && l.words.join() !== words.join() ? { ...l, words } : l));
        pl.timeline.sentences.forEach((s, k) => {
          if (words[k] === s.words.length && !saidK.current.has(k)) { saidK.current.add(k); dispatch({ type: 'said', text: s.text, at: t }); }
        });
        if (done && t - pl.startedAt >= pl.timeline.duration) {
          player.current = null;
          setLive(null);
          if (!boardRef.current.ended) dispatch({ type: 'handed_over' });
        }
      }
      setNow(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fire = (b, step, at) => {
    if (!step) return b;
    const next = applyStep(b, step, at);
    if (step.cmd === 'ask') setAsk(next.ask);
    if (step.cmd === 'end_session') dispatch({ type: 'ended', summary: step.summary, at });
    return next;
  };

  // ---------------------------------------------------------------- one turn
  const play = useCallback((res) => {
    // The browser checks every step again against its own board before drawing.
    const raw = res.steps || [];
    const v = validateTurn({ steps: raw.map((s) => (s?.cmd === 'ask' ? (({ seal, ...p }) => p)(s) : s)) }, { board: boardSummary(boardRef.current), publicAsk: true });
    const dropped = [...(res.dropped || []), ...v.dropped.map((d) => ({ ...d, reason: `browser: ${d.reason}` }))];
    if (v.dropped.length) console.warn('voice-tutor: dropped', v.dropped);
    // The validator strips fields it does not know; the seal rides on the public ask.
    const steps = v.steps.map((s, k) => (s.cmd === 'ask' ? { ...s, seal: raw.find((x) => x.cmd === 'ask' && x.id === s.id)?.seal || null } : s));
    dispatch({ type: 'turn', steps, dropped, spent: res.spent, target: res.target, prerequisite: res.prerequisite, at: clock() });
    turnSteps.current = steps;
    saidK.current = new Set();
    const tl = buildTimeline(steps, { speech: providers.current.tts.speak });
    player.current = createPlayer(tl, clock());
    setLive({ sentences: tl.sentences, words: tl.sentences.map(() => 0) });
  }, []);

  const request = useCallback(async ({ message = '', heard = null }) => {
    const s = sessionRef.current;
    const open = askRef.current;
    setAsk(null);
    setNudge(false);
    const body = {
      session_id: s.id, child_id: childId || null, skill: skill || null,
      message, heard, answer: open?.seal && message ? { seal: open.seal, response: message } : null,
      board: boardSummary(boardRef.current),
      history: s.transcript.map((h) => ({ who: h.who, text: h.text })),
      elapsed_s: Math.round((clock() - startedAt.current) / 1000), turn_index: s.turns, phase: s.phase,
    };
    dispatch({ type: 'request' });
    try {
      const res = await providers.current.tutor.turn(body);
      if (res.marked) dispatch({ type: 'marked', skill: res.marked.skill, correct: res.marked.correct, misconception: res.marked.misconception, answer: res.marked.answer, askId: res.marked.ask, at: clock() });
      play(res);
    } catch (e) {
      dispatch({ type: 'error', message: e.message });
    }
  }, [childId, skill, play]);

  const start = () => {
    providers.current = providersFor(mode, supabase);
    startedAt.current = clock();
    request({});
  };

  // The child types. Over the tutor, that is an interruption: strokes already
  // due are drawn at once, the rest are dropped, and the tutor is told what was heard.
  const send = (text) => {
    const msg = String(text ?? '').trim();
    if (!msg || session.status === 'ended' || session.status === 'thinking' || !providers.current) return;
    let heard = null;
    const pl = player.current;
    if (pl && !pl.stopped) {
      const t = clock();
      const r = interrupt(pl, t);
      let b = boardRef.current;
      for (const e of r.due) b = fire(b, turnSteps.current[e.i], t - e.dur);
      boardRef.current = b; setBoard(b);
      if (!r.finished) {
        heard = r.heard;
        const k = r.words.findIndex((n, i) => n < pl.timeline.sentences[i].words.length);
        const s = pl.timeline.sentences[k];
        if (s && r.words[k] > 0) dispatch({ type: 'said', text: `${s.words.slice(0, r.words[k]).map((w) => w.word).join(' ')} ...`, cut: true, at: t });
        dispatch({ type: 'interrupted' });
      }
      player.current = null; setLive(null);
    }
    dispatch({ type: 'child_said', text: msg, at: clock() });
    setInput('');
    request({ message: msg, heard });
  };

  // Silence: after 15 s on the child's turn, a gentle line under the box (no model call).
  useEffect(() => {
    if (session.status !== 'listening') return undefined;
    const id = setTimeout(() => setNudge(true), 15000);
    return () => clearTimeout(id);
  }, [session.status, session.turns]);

  // The demo plays itself: the demo child types each answer once the tutor hands over.
  const demoK = useRef(0);
  useEffect(() => {
    if (!demo) return undefined;
    if (session.status === 'ready' && !providers.current) { const id = setTimeout(start, 600); return () => clearTimeout(id); }
    if (session.status !== 'listening') return undefined;
    const answer = DEMO_ANSWERS[demoK.current];
    if (!answer) return undefined;
    const timers = [];
    const begin = 1100;
    [...answer].forEach((_, i) => timers.push(setTimeout(() => setInput(answer.slice(0, i + 1)), begin + i * 55)));
    timers.push(setTimeout(() => { demoK.current += 1; send(answer); }, begin + answer.length * 55 + 450));
    return () => timers.forEach(clearTimeout);
  }, [demo, session.status, session.turns]);

  useEffect(() => { transcriptEnd.current?.scrollIntoView?.({ block: 'end' }); }, [session.transcript.length, live?.words?.join()]);

  if (!VOICE_TUTOR_ON) return null;
  if (!canMock) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md bg-white rounded-2xl p-6 text-center">
          <h1 className="text-xl font-extrabold text-slate-900">HOREB live tutor</h1>
          <p className="mt-2 text-slate-600">This prototype is for adult test accounts only. Sign in with a test account on the list.</p>
          {onNavigate ? <button type="button" onClick={() => onNavigate('home')} className="mt-4 px-5 py-2 rounded-full bg-amber-400 font-bold">Back</button> : null}
        </div>
      </div>
    );
  }

  const mascot = mascotState(session.status);
  const started = session.status !== 'ready' || !!providers.current;
  const pastLines = session.transcript.filter((h) => !(live && h.who === 'tutor' && h.turn === session.turns && !h.cut));

  return (
    <div className="vt-root h-[100dvh] flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      <style>{CSS}</style>
      <header className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border-b border-slate-200 text-[12px] sm:text-[13px] whitespace-nowrap">
        <span className="font-extrabold tracking-tight">HOREB tutor</span>
        <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: '#FFE3EE', color: '#C2255C' }}>Adult testers only</span>
        <span className="hidden md:inline text-slate-500">Prototype. No voice yet: words appear at speaking pace.</span>
        <span className="ml-auto font-bold text-slate-600">{mode === 'remote' ? 'Live' : 'Scripted'}</span>
        {mode === 'remote' ? <span className="tabular-nums text-slate-500">US${session.cost.sessionUsd.toFixed(2)}</span> : null}
        <button type="button" onClick={() => setTester((x) => !x)} className="px-2 py-0.5 rounded-full border border-slate-300 font-bold text-slate-700">Tester</button>
      </header>

      <main className="flex-1 min-h-0 flex flex-col landscape:flex-row gap-2 p-2">
        <section className="relative min-h-0 portrait:shrink-0 landscape:flex-1 flex items-center justify-center">
          <div className="vt-board relative w-full rounded-2xl overflow-hidden bg-white" style={{ aspectRatio: `1000 / ${boardH}`, maxHeight: '100%' }}>
            <Board board={board} now={now} H={boardH} />
            {!started ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-3">
                <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="font-extrabold text-lg leading-tight">Grade 5 fractions</div>
                  <p className="text-sm text-slate-600 mt-1">A short lesson with HOREB, an AI tutor. For adult testers only.</p>
                  <div className="mt-3 flex gap-2 text-sm">
                    <button type="button" onClick={() => setMode('mock')} className={`flex-1 rounded-full px-3 py-1.5 font-bold border ${mode === 'mock' ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-300'}`}>Scripted (free)</button>
                    <button type="button" disabled={!allowed} onClick={() => setMode('remote')} className={`flex-1 rounded-full px-3 py-1.5 font-bold border disabled:opacity-40 ${mode === 'remote' ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-300'}`}>Live model</button>
                  </div>
                  {mode === 'remote' ? (
                    <div className="mt-3 grid gap-2 text-sm">
                      <select value={childId} onChange={(e) => setChildId(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5">
                        <option value="">My own test profile</option>
                        {children.map((c) => <option key={c.id} value={c.id}>{c.name}{c.grade ? ` (${c.grade})` : ''}</option>)}
                      </select>
                      <select value={skill} onChange={(e) => setSkill(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5">
                        <option value="">Skill: chosen from the profile</option>
                        {FRACTION_SKILLS.map((c) => <option key={c} value={c}>{skillName(c)}</option>)}
                      </select>
                      <p className="text-xs text-slate-500">Each turn is a paid model call. Caps: US$1.50 a session, US$3 a day.</p>
                    </div>
                  ) : null}
                  <button type="button" onClick={start} className="mt-4 w-full rounded-full bg-amber-400 py-2.5 font-extrabold">Start the lesson</button>
                </div>
              </div>
            ) : null}
            {session.ended ? (
              <div className="absolute left-3 right-3 bottom-3 rounded-xl bg-white/95 border border-slate-200 p-3 text-sm">
                <span className="font-extrabold">Lesson finished.</span> {session.ended.summary}
              </div>
            ) : null}
          </div>
        </section>

        <aside className="min-h-0 flex-1 landscape:flex-none landscape:w-[300px] lg:landscape:w-[340px] flex flex-col gap-2">
          <div className="flex gap-2 min-h-0 flex-1 landscape:flex-col">
            <div className={`vt-mascot shrink-0 self-start landscape:self-stretch rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center px-2 py-2 landscape:flex-row landscape:gap-3 landscape:justify-start landscape:px-3 landscape:py-1.5 vt-${mascot}`} aria-live="polite">
              <HorebBot size={56} mood={mascot} />
              <div className="text-center landscape:text-left">
                <div className="text-[12px] font-extrabold text-violet-700 leading-tight">{MASCOT_LABEL[mascot]}</div>
                <div className="hidden landscape:block text-[11px] text-slate-500 leading-tight">{session.phase ? PHASE_LABEL[session.phase] : 'Ready'}</div>
              </div>
            </div>
            <div className="vt-strip min-h-0 flex-1 rounded-2xl bg-white border border-slate-200 overflow-y-auto px-3 py-2 text-[15px] leading-snug">
              <Phases phase={session.phase} />
              {pastLines.slice(-12).map((h, k) => (
                <p key={k} className={h.who === 'child' ? 'vt-child' : 'vt-tutor'}>{h.text}</p>
              ))}
              {live ? live.sentences.map((s, k) => (live.words[k] > 0 ? (
                <p key={`l${k}`} className="vt-tutor vt-now">
                  {s.words.slice(0, live.words[k]).map((w, i) => (
                    <span key={i} className={i === live.words[k] - 1 && live.words[k] < s.words.length ? 'vt-word' : undefined}>{w.word} </span>
                  ))}
                </p>
              ) : null)) : null}
              {session.status === 'thinking' ? <p className="vt-tutor text-slate-400">...</p> : null}
              {session.error ? <p className="text-[13px] text-red-700">{session.error}</p> : null}
              <div ref={transcriptEnd} />
            </div>
          </div>

          <form className="shrink-0 rounded-2xl bg-white border border-slate-200 p-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            {ask ? <div className="text-[13px] font-bold text-violet-700 px-1 pb-1">{ask.prompt}</div> : null}
            {ask?.form === 'choice' ? (
              <div className="grid grid-cols-2 gap-1.5 pb-1.5">
                {ask.choices.map((c) => <button key={c} type="button" onClick={() => send(c)} className="rounded-xl border border-slate-300 px-2 py-1.5 text-sm font-bold text-left">{c}</button>)}
              </div>
            ) : null}
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} disabled={!started || session.status === 'ended'}
                placeholder={!started ? 'Start the lesson first' : ask ? 'Type your answer' : session.status === 'speaking' ? 'Type to stop HOREB and talk' : 'Type to HOREB'}
                className="flex-1 min-w-0 rounded-full border border-slate-300 px-4 py-2 text-[16px] outline-none focus:border-violet-500" maxLength={300} inputMode="text" autoComplete="off" />
              <button type="submit" disabled={!input.trim() || session.status === 'thinking' || session.status === 'ended'} className="rounded-full bg-amber-400 px-5 font-extrabold disabled:opacity-40">Send</button>
            </div>
            {nudge && session.status === 'listening' ? <div className="text-[12px] text-slate-500 px-2 pt-1">Take your time, or tell HOREB if you would like it another way.</div> : null}
          </form>
        </aside>
      </main>

      {tester ? <TesterPanel session={session} board={board} mode={mode} onClose={() => setTester(false)} /> : null}
    </div>
  );
}

function Phases({ phase }) {
  const at = PHASES.indexOf(phase);
  return (
    <div className="flex gap-1 pb-1.5" aria-label="Lesson parts">
      {PHASES.map((p, i) => <span key={p} title={PHASE_LABEL[p]} className="h-1.5 flex-1 rounded-full" style={{ background: i <= at ? '#6D3FD6' : '#E4E1F0' }} />)}
    </div>
  );
}

// What the tester (an adult) sees: the target, the diagnosis and its evidence,
// the evidence gathered, and every dropped command. Never shown to a child.
function TesterPanel({ session, board, mode, onClose }) {
  return (
    <div className="fixed inset-x-2 bottom-2 top-12 sm:left-auto sm:w-[400px] z-50 bg-white rounded-2xl border border-slate-300 overflow-y-auto p-4 text-sm">
      <div className="flex items-center"><b className="text-base">Tester view</b><button type="button" className="ml-auto font-bold" onClick={onClose}>Close</button></div>
      <p className="text-slate-500 mt-1">Mode: {mode === 'remote' ? 'live model' : 'scripted'}. Nothing is saved in milestone 1.</p>
      <h3 className="font-extrabold mt-3">Lesson</h3>
      <p>Target: {session.target ? skillName(session.target) : 'not chosen yet'}</p>
      <p>Weakest prerequisite: {session.prerequisite ? skillName(session.prerequisite) : 'none'}</p>
      <p>Part: {session.phase || 'not started'}. Turns: {session.turns}. Interruptions: {session.interruptions}.</p>
      <p>Spent: US${session.cost.sessionUsd.toFixed(3)} this session, US${session.cost.dayUsd.toFixed(3)} today (caps US$1.50 and US$3).</p>
      <h3 className="font-extrabold mt-3">Diagnoses</h3>
      {session.diagnoses.length ? session.diagnoses.map((d, k) => (
        <div key={k} className="mt-1 rounded-lg bg-violet-50 p-2" style={{ background: '#ECE8FF' }}>
          <div className="font-bold">{d.misconception.split('.').pop()} ({d.confidence})</div>
          <div>{d.evidence}</div>
          <div className="text-slate-500">Next: {d.next.replace('_', ' ')}</div>
        </div>
      )) : <p className="text-slate-500">None yet.</p>}
      <h3 className="font-extrabold mt-3">Evidence (adds to mastery, never changes "mastered")</h3>
      {session.evidence.length ? session.evidence.map((e, k) => (
        <p key={k}>{e.ask}: "{e.answer}" {e.correct ? 'right' : `wrong${e.misconception ? `, ${e.misconception.split('.').pop()}` : ''}`}</p>
      )) : <p className="text-slate-500">None yet.</p>}
      <h3 className="font-extrabold mt-3">Dropped commands</h3>
      {session.dropped.length || board.log.length ? [...session.dropped, ...board.log].map((d, k) => <p key={k} className="text-red-700">{d.cmd || 'turn'}: {d.reason}</p>) : <p className="text-slate-500">None.</p>}
    </div>
  );
}

const CSS = `
.vt-board { box-shadow: inset 0 0 0 1px #E2DED0; }
.vt-tutor { margin: 0 0 .35rem; color: #1D1D27; font-weight: 600; }
.vt-tutor.vt-now { color: #3B17B0; }
.vt-child { margin: 0 0 .35rem auto; width: fit-content; max-width: 85%; background: #FFF0D4; color: #6B3D00; border-radius: 14px; padding: .2rem .65rem; font-weight: 700; }
.vt-word { background: linear-gradient(transparent 62%, #FFC93C 62%); }
.vt-speaking .hb-talk { transform-box: fill-box; transform-origin: center; animation: vt-talk .32s ease-in-out infinite alternate; }
.vt-listening .hb-listen { animation: vt-glow 1.6s ease-in-out infinite; }
.vt-thinking svg { animation: vt-tilt 1.4s ease-in-out infinite; }
@keyframes vt-talk { from { transform: scaleY(.35); } to { transform: scaleY(1.15); } }
@keyframes vt-glow { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes vt-tilt { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (orientation: portrait) { .vt-mascot { width: 84px; } }
@media (orientation: landscape) and (max-height: 500px) { .vt-strip { font-size: 13px; } .vt-mascot svg { width: 40px; height: 40px; } }
@media (prefers-reduced-motion: reduce) { .vt-speaking .hb-talk, .vt-listening .hb-listen, .vt-thinking svg { animation: none; } }
`;

export default VoiceTutor;
