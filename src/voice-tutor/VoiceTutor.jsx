// ============================================================================
// THE LIVE TUTOR SESSION WINDOW (prototype, milestones 1 to 3): the board takes most
// of the screen, the HOREB robot sits in a corner box (listening, thinking,
// speaking), a transcript strip shows the tutor's words at speaking pace, and
// the child types, or writes and draws on the board (a pen, an eraser for their
// own ink, undo). "Check my work", or about 4 seconds without writing, sends a
// picture of the board (never the camera) to the tutor with the next turn.
// Voice (milestone 3): HOREB speaks and the board moves on the voice's own word
// times; the child taps Talk to speak (tapping over HOREB stops it at once).
// Typing always stays, and is said plainly when the microphone or voice fails.
//
// Test only: behind VITE_VOICE_TUTOR=1 and an allowlist stub (the admin list,
// or VITE_VOICE_TUTOR_ALLOWLIST). Adult test accounts only until consent
// (milestone 5); the server enforces the same.
//
//   /voice-tutor                  scripted tutor, no model, no cost
//   /voice-tutor?mode=live        the real tutor (the voice-tutor edge function)
//   /voice-tutor?demo=auto        the scripted lesson plays itself (demo child answers)
//   &quiet=1                      the practice voice at volume 0 (screen recordings: sound added after)
// ============================================================================
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { supabase } from '../supabase.js';
import { Board, drawKey, composedItems } from './Board.jsx';
import { drawDuration } from '../draw/index.js';
import { emptyBoard, applyStep, boardSummary, playFigure } from './board.js';
import { placeItem } from '../draw/compose.js';
import { itemStrokes, strokesBox } from '../draw/strokes.js';
import { figureNotes } from '../draw/observe.js';
import { lessonShape, tutorBubble, childBubble, partLabel } from './layout.js';
import { validateTurn, PHASES, cellsOf, DRAWN, MARKS } from './commands.js';
import { buildTimeline, createPlayer, advance, updateTimeline } from './timeline.js';
import { sessionReducer, newSession, mascotState, DEFAULT_SETTINGS } from './session.js';
import { paceFor, assessTranscript, askAgainLine, fixMathsWords, TUTOR_VOICES, isTutorVoice } from './childVoice.js';
import { providersFor, checkProviders } from './providers/index.js';
import { simulatedTts } from './providers/mockVoice.js';
import { voiceReducer, initialVoice, bargeIn, canListen, canSpeak } from './providers/voice.js';
import { DEMO_SCRIPT } from './mockTutor.js';
import { inkReducer, hasInk, writing, inkCells } from './ink.js';
import { autoSnapDue, checkAllowed, imageTokens } from './snapshot.js';
import { captureBoard } from './capture.js';
import { EXAMPLES, exampleStrokes } from './examples.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';

const ENV = import.meta.env || {};
export const VOICE_TUTOR_ON = ENV.VITE_VOICE_TUTOR === '1';
const ALLOWLIST = String(ENV.VITE_VOICE_TUTOR_ALLOWLIST || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const clock = () => performance.now();
const params = () => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);

// The arrangement ("Across the table", layout.js) and the board's height in units.
// Changes only on rotate or resize, never with what is said, so the board never
// rescales in the middle of a drawing.
function useLessonShape() {
  const read = () => (typeof window === 'undefined' ? { kind: 'table', boardH: 640 } : lessonShape(window.innerWidth, window.innerHeight));
  const [shape, setShape] = useState(read);
  useEffect(() => {
    const f = () => setShape((old) => { const n = read(); return n.kind === old.kind && n.boardH === old.boardH ? old : n; });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return shape;
}

// Keep the screen on while a lesson runs; a refusal (or no support) is fine.
function useWakeLock(on) {
  useEffect(() => {
    if (!on || !navigator.wakeLock?.request) return undefined;
    let lock = null; let alive = true;
    const take = () => navigator.wakeLock.request('screen').then((l) => { if (alive) lock = l; else l.release(); }).catch(() => {});
    const back = () => { if (document.visibilityState === 'visible') take(); };
    take();
    document.addEventListener('visibilitychange', back);
    return () => { alive = false; document.removeEventListener('visibilitychange', back); lock?.release?.().catch?.(() => {}); };
  }, [on]);
}

const MASCOT_LABEL = { listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking' };

export function VoiceTutor({ user = null, isAdmin = false, onNavigate = null, childId: lockedChildId = '' }) {
  useHorebLook();
  const { kind, boardH } = useLessonShape();
  const boardHRef = useRef(boardH);
  boardHRef.current = boardH;
  const q = useMemo(params, []);
  const demo = q.get('demo') === 'auto';
  const email = String(user?.email || '').toLowerCase();
  // The server's VOICE_TUTOR_ALLOWLIST is the real gate; on a local test build any signed-in tester may try, and the server says no if not listed.
  const allowed = !!user && (isAdmin || ENV.DEV === true || (email && ALLOWLIST.includes(email)));
  const canMock = allowed || ENV.DEV === true;
  const [mode, setMode] = useState(q.get('mode') === 'live' && allowed ? 'remote' : 'mock');
  const [children, setChildren] = useState([]);
  // Opened from a child's space, the lesson is that child's (their learner record and report).
  const [childId, setChildId] = useState(lockedChildId || '');
  const [skill, setSkill] = useState('');
  const [session, rawDispatch] = useReducer(sessionReducer, null, () => newSession({ id: uid() }));
  // The pace follows what the child just said, and the very next request needs it: sessionRef is advanced here, at once,
  // with the same pure reducer, instead of waiting for the next render.
  const dispatch = useCallback((ev) => { sessionRef.current = sessionReducer(sessionRef.current, ev); rawDispatch(ev); }, []);
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
  const handedAt = useRef(null);       // when HOREB handed over: how long the child thought before answering
  const [pauseNote, setPauseNote] = useState(false);   // the child paused mid-answer: "Take your time"
  const unclearAgain = useRef(0);
  const [voiceId, setVoiceId] = useState(() => { try { const v = localStorage.getItem('horeb-tutor-voice'); return isTutorVoice(v) ? v : null; } catch { return null; } });
  const voiceIdRef = useRef(voiceId);
  voiceIdRef.current = voiceId;
  const chooseVoice = (id) => { setVoiceId(id); voiceIdRef.current = id; try { if (id) localStorage.setItem('horeb-tutor-voice', id); else localStorage.removeItem('horeb-tutor-voice'); } catch { /* private window */ } };
  // What the voice is given for a turn: the pace's speed, emotion and sentence gap, and the tester's voice if one was picked.
  const voiceOptions = () => { const p = paceFor(sessionRef.current.pace, DEFAULT_SETTINGS.ttsSpeed); return { speed: p.speed, emotion: p.emotion, gapMs: p.gapMs, voice: voiceIdRef.current || undefined }; };
  const startedAt = useRef(0);
  const svgRef = useRef(null);
  const [tool, setTool] = useState('pen');
  // Pictures of the child's work: how many, when, of which ink version (refs: read by the idle timer).
  const snap = useRef({ count: 0, lastAt: null, version: 0 });
  const [pics, setPics] = useState([]);   // { id, reason, w, h, bytes, tokens, thumb } kept in memory only, never stored
  const [snapNote, setSnapNote] = useState('');
  const [writeOpen, setWriteOpen] = useState(false);   // the pen tools, out when the child chooses Write
  const [typeOpen, setTypeOpen] = useState(false);     // the typing box, when the child chooses Type
  // The voice: wanted or not, working or not (typing is always the fallback), the child's
  // speech in progress, seconds of speech sent since the last turn, and the delays measured.
  const [voiceOn, setVoiceOn] = useState(q.get('voice') !== 'off');
  const [voice, vdispatch] = useReducer(voiceReducer, null, () => initialVoice('voice'));
  const listenRef = useRef(null);
  const audioIn = useRef(0);
  const turnNo = useRef(0);
  const delays = useRef({});
  const offsets = useRef([]);
  const voiceError = useRef('');   // the last voice failure, for the tester view
  const listenError = useRef('');  // the last listening failure, for the tester view
  const silentVoice = useRef(false);   // the practice voice could not keep time: timed silent mode   // ms between a word being heard and its stroke starting (frame lag)
  const [delayLog, setDelayLog] = useState([]);
  const [voiceName, setVoiceName] = useState('');
  const boardClock = () => providers.current?.tts?.clock?.() ?? clock();
  // How long the timeline gave each drawing (drawKey -> ms): the board draws it in that time.
  const drawTimes = useRef(new Map());
  // The layout pass (src/draw/compose.js): a new drawing's frame on the sheet, laid out with the rest of its
  // turn (the steps after it), around the ink already drawn, which never moves.
  const inkOf = (it) => strokesBox(itemStrokes(it, boardHRef.current), 6) || it.rect;
  const placeFor = (b, step, pending) => placeItem([...composedItems(b, boardHRef.current).values()], step, pending, boardHRef.current, { inkOf });
  // How long a drawing takes, in the frame it will have (a big main figure takes longer than a small one).
  const timed = useRef(new WeakMap());
  const timeOf = (step) => {
    if (!DRAWN.includes(step.cmd)) return drawDuration(step, boardHRef.current);
    const c = timed.current.get(step);
    if (c && c.b === boardRef.current && c.H === boardHRef.current) return c.ms;
    const steps = turnSteps.current; const k = steps.indexOf(step);
    let rect = null;
    try { rect = placeFor(boardRef.current, step, k >= 0 ? steps.slice(k + 1) : []); } catch { rect = null; }
    const ms = drawDuration(rect ? { ...step, rect } : step, boardHRef.current);
    timed.current.set(step, { b: boardRef.current, H: boardHRef.current, ms });
    return ms;
  };
  // The child handles a figure: the figure's rules decide, and what they did goes with the next turn.
  const onPlay = useCallback((id, control, value) => {
    const b = playFigure(boardRef.current, id, control, value, clock());
    if (b !== boardRef.current) { boardRef.current = b; setBoard(b); }
  }, []);
  useWakeLock(session.status !== 'ready' && session.status !== 'ended');

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
      const t = boardClock();
      const pl = player.current;
      if (pl && !pl.stopped) {
        if (pl.stream && (pl.stream.version() !== pl.version || pl.turn.steps.length !== pl.stepsLen)) {
          pl.version = pl.stream.version();
          pl.stepsLen = pl.turn.steps.length;
          turnSteps.current = pl.turn.steps;
          updateTimeline(pl, buildTimeline(pl.turn.steps, { speech: (_, k) => pl.stream.timing(k), drawMs: timeOf }));
          // A drawing already started is squeezed too if a later step's word now comes before it ends.
          for (const e of pl.timeline.events) if (pl.fired.has(e.i)) { const key = drawKey({ ...turnSteps.current[e.i], at: pl.startedAt + e.t }); if (drawTimes.current.has(key)) drawTimes.current.set(key, e.dur); }
          setLive((l) => (l ? { ...l, sentences: pl.timeline.sentences } : l));
          if (pl.stream.failed && !pl.failNoted) { pl.failNoted = true; vdispatch({ type: 'fail', kind: 'speak-failed' }); providers.current.tts = simulatedTts(); }
        }
        const { due, words, done } = advance(pl, t);
        // Word-to-stroke offset: how late each word-anchored stroke appeared after its word.
        for (const e of due) if (e.anchor === 'word') offsets.current.push(t - (pl.startedAt + e.t));
        if (due.length) {
          let b = boardRef.current;
          for (const e of due) b = fire(b, turnSteps.current[e.i], pl.startedAt + e.t, e.dur, turnSteps.current.slice(e.i + 1));
          boardRef.current = b;
          setBoard(b);
        }
        setLive((l) => (l && l.words.join() !== words.join() ? { ...l, words } : l));
        pl.timeline.sentences.forEach((s, k) => {
          if (s.complete && words[k] === s.words.length && !saidK.current.has(k)) { saidK.current.add(k); dispatch({ type: 'said', text: s.text, at: clock() }); }
        });
        if (done && pl.turn.end && t - pl.startedAt >= pl.timeline.duration) {
          player.current = null;
          setLive(null);
          if (!boardRef.current.ended) { handedAt.current = clock(); dispatch({ type: 'handed_over' }); }
        }
      }
      setNow(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fire = (b, step, at, dur = null, pending = []) => {
    if (!step) return b;
    if (dur != null && (DRAWN.includes(step.cmd) || MARKS.includes(step.cmd))) drawTimes.current.set(drawKey({ ...step, at }), dur);
    const next = applyStep(b, step, at, boardHRef.current, { place: (st) => { try { return placeFor(b, st, pending); } catch (e) { console.warn('voice-tutor: layout', e.message); return null; } } });
    if (step.cmd === 'ask') setAsk(next.ask);
    if (step.cmd === 'end_session') dispatch({ type: 'ended', summary: step.summary, at });
    return next;
  };

  // ---------------------------------------------------------------- one turn, streamed
  // The tutor's reply arrives step by step, each already checked on the server. The page
  // checks it again against its own board, gives each sentence to the voice at once, and
  // rebuilds the board's timeline as steps and word times arrive. The first sound starts
  // on the first audio; a stroke starts as its word is heard.
  const turnRef = useRef(null);
  const publicSteps = (T) => {
    const v = validateTurn({ steps: T.raw.map((x) => (x?.cmd === 'ask' ? (({ seal, ...rest }) => rest)(x) : x)) },
      { board: T.boardAtStart, publicAsk: true, snapshots: snap.current.count, inkCells: T.inkAtStart });
    T.dropped = v.dropped.map((d) => ({ ...d, reason: `browser: ${d.reason}` }));
    if (v.dropped.length) console.warn('voice-tutor: dropped', v.dropped);
    // The validator strips fields it does not know; the seal rides on the public ask.
    T.steps = v.steps.map((x) => (x.cmd === 'ask' ? { ...x, seal: T.raw.find((r) => r.cmd === 'ask' && r.id === x.id)?.seal || null } : x));
    return T.steps;
  };
  const feedVoice = (T) => {
    const says = T.steps.filter((x) => x.cmd === 'say');
    for (let k = T.said; k < says.length; k += 1) T.stream.add(says[k].text);
    T.said = says.length;
  };
  const firstSound = (T, startAt) => {
    if (T.stopped || turnRef.current !== T || T.player) return;
    const tts = providers.current.tts;
    dispatch({ type: 'turn', steps: T.steps, dropped: T.dropped, at: clock() });
    T.reported = T.steps.length;
    turnSteps.current = T.steps;
    saidK.current = new Set();
    const tl = buildTimeline(T.steps, { speech: (_, k) => T.stream.timing(k), drawMs: timeOf });
    const pl = createPlayer(tl, startAt);
    Object.assign(pl, { stream: T.stream, version: T.stream.version(), turn: T, stepsLen: T.steps.length });
    T.player = pl;
    player.current = pl;
    setLive({ sentences: tl.sentences, words: tl.sentences.map(() => 0) });
    // How long the child waited: the end of their words (or Send) to the first sound.
    const d = delays.current;
    if (d.childDone) {
      const first = clock() + Math.max(0, startAt - tts.clock());
      setDelayLog((l) => [...l, { turn: turnNo.current, firstStep: Math.round((d.firstStep || first) - (d.sent || d.childDone)), voice: Math.round(first - (d.firstStep || first)), total: Math.round(first - d.childDone), spoken: !!tts.hasAudio && !silentVoice.current }].slice(-10));
    }
    delays.current = {};
  };
  const openVoice = (T) => {
    T.stream = providers.current.tts.open(voiceOptions());
    T.said = 0;
    T.stream.ready.then((startAt) => firstSound(T, startAt), (err) => {
      if (T.stopped || turnRef.current !== T) return;
      // No voice: carry on silently in words, from the same place.
      console.warn('voice-tutor: voice failed', err?.message);
      voiceError.current = String(err?.message || err || 'unknown').slice(0, 200);
      vdispatch({ type: 'fail', kind: 'speak-failed' });
      providers.current.tts = simulatedTts();
      silentVoice.current = true;
      openVoice(T);
      feedVoice(T);
    });
  };

  const request = useCallback(async ({ message = '', heard = null, snapshot = null }) => {
    const s = sessionRef.current;
    const mine = ++turnNo.current;
    if (!delays.current.childDone) delays.current.childDone = clock();
    const audioS = Math.round(audioIn.current * 10) / 10;
    audioIn.current = 0;
    const open = askRef.current;
    setAsk(null);
    setNudge(false);
    const boardNow = boardSummary(boardRef.current);
    const inkNow = inkCells(boardRef.current.childInk, boardHRef.current);
    const body = {
      session_id: s.id, child_id: childId || null, skill: skill || null,
      message, heard, answer: open?.seal && message ? { seal: open.seal, response: message } : null,
      // The example name helps only the scripted tutor's stub; the server never gets it.
      snapshot: snapshot ? (providers.current?.tutor?.name === 'remote' ? (({ example, ...x }) => x)(snapshot) : snapshot) : null,
      snapshots_taken: snap.current.count,
      ink_cells: inkNow,
      board: boardNow,
      // What the child did with the figures they could handle, in plain words (src/draw/observe.js).
      figures: figureNotes(boardRef.current),
      history: s.transcript.map((h) => ({ who: h.who, text: h.text })),
      elapsed_s: Math.round((clock() - startedAt.current) / 1000), turn_index: s.turns, phase: s.phase,
      // The voice, priced into the caps on the server: will the words be spoken, and how much the child spoke.
      voice: !!providers.current.tts.hasAudio && !silentVoice.current && mode === 'remote', audio_in_s: audioS,
      // How HOREB is following this child's pace, for the tutor's context (src/voice-tutor/childVoice.js).
      pace: { level: s.pace.level, repeat: s.pace.repeat, reason: s.pace.reason },
    };
    dispatch({ type: 'request' });
    delays.current.sent = clock();
    const T = { mine, raw: [], steps: [], dropped: [], said: 0, reported: 0, player: null, stopped: false, end: null, boardAtStart: boardNow, inkAtStart: inkNow };
    turnRef.current = T;
    openVoice(T);
    const onEvent = (ev) => {
      if (T.stopped || mine !== turnNo.current) return;
      if (ev.type === 'meta') {
        if (ev.marked) dispatch({ type: 'marked', skill: ev.marked.skill, correct: ev.marked.correct, misconception: ev.marked.misconception, answer: ev.marked.answer, askId: ev.marked.ask, at: clock() });
        if (ev.picture && !ev.picture.used) setPics((l) => l.map((x) => (x.id === ev.picture.id ? { ...x, unused: ev.picture.why || 'not used' } : x)));
        if (ev.target) dispatch({ type: 'lesson', target: ev.target, prerequisite: ev.prerequisite });
      }
      if (ev.type === 'step') {
        if (!delays.current.firstStep) delays.current.firstStep = clock();
        T.raw.push(ev.step);
        publicSteps(T);
        feedVoice(T);
        if (T.player) turnSteps.current = T.steps;
      }
      if (ev.type === 'end') {
        T.end = ev;
        T.stream.end();
        // A turn with nothing to say (a nod after an idle picture): play it at once, silently.
        if (!T.said) firstSound(T, providers.current.tts.clock());
        dispatch({ type: 'turn_more', steps: T.steps.slice(T.reported), dropped: [...(ev.dropped || []), ...T.dropped], spent: ev.spent });
        T.reported = T.steps.length;
        if (!T.steps.some((x) => x.cmd === 'say') && !T.steps.some((x) => x.cmd === 'end_session')) dispatch({ type: 'said', text: '(HOREB nods and lets you carry on)', at: clock() });
      }
    };
    try {
      await providers.current.tutor.turn(body, onEvent);
    } catch (e) {
      if (mine !== turnNo.current || T.stopped) return;
      T.stopped = true; T.stream.stop();
      dispatch({ type: 'error', message: e.message });
    }
  }, [childId, skill, mode]);

  const start = async () => {
    const sid = () => sessionRef.current.id;
    providers.current = providersFor(mode, { supabase, voice: voiceOn, sessionId: sid, childId: () => childId || null, demo, quiet: q.get('quiet') === '1' });
    const missing = checkProviders(providers.current);
    if (missing.length) console.error('voice-tutor: provider is missing', missing);
    startedAt.current = clock();
    // Audio may start only after a tap: this is that tap (the browser's voice is unlocked inside it).
    let unlocked;
    try { unlocked = await providers.current.tts.unlock(); } catch (e) { voiceError.current = String(e?.message || e).slice(0, 200); unlocked = { ok: false, reason: 'audio-blocked' }; }
    if (unlocked && !unlocked.ok && unlocked.reason) voiceError.current = voiceError.current || unlocked.reason;
    if (!voiceOn) vdispatch({ type: 'retry', mode: 'typed' });
    else {
      if (!unlocked?.ok) {
        // No voice that keeps time with the board: the timed silent mode, said plainly.
        providers.current.tts = simulatedTts();
        silentVoice.current = true;
        vdispatch({ type: 'fail', kind: unlocked?.reason === 'audio-blocked' ? 'audio-blocked' : 'no-voice' });
      }
      if (!providers.current.stt) vdispatch({ type: 'fail', kind: 'no-listening' });
    }
    setVoiceName(providers.current.tts.voiceName || providers.current.tts.name);
    request({});
  };

  // The child types. Over the tutor, that is an interruption: strokes already
  // due are drawn at once, the rest are dropped, and the tutor is told what was heard.
  const stopTutor = () => {
    let heard = null;
    const pl = player.current;
    // The voice stops at once, whether or not strokes are still to come; a turn still arriving is dropped.
    const T = turnRef.current;
    if (T && !T.stopped) { T.stopped = true; T.stream?.stop?.(); }
    if (!pl || pl.stopped) { providers.current?.tts?.stop?.(); return null; }
    {
      const t = boardClock();
      const r = bargeIn({ player: pl, tts: providers.current.tts, now: t });
      let b = boardRef.current;
      for (const e of r.due) b = fire(b, turnSteps.current[e.i], t - e.dur, e.dur, r.due.filter((x) => x.i > e.i).map((x) => turnSteps.current[x.i]));
      boardRef.current = b; setBoard(b);
      if (r.interrupted) {
        heard = r.heard;
        const k = r.words.findIndex((n, i) => n < pl.timeline.sentences[i].words.length);
        const s = pl.timeline.sentences[k];
        if (s && r.words[k] > 0) dispatch({ type: 'said', text: `${s.words.slice(0, r.words[k]).map((w) => w.word).join(' ')} ...`, cut: true, at: t });
        dispatch({ type: 'interrupted' });
      }
      player.current = null; setLive(null);
    }
    return heard;
  };
  const send = (text) => {
    const msg = String(text ?? '').trim();
    if (!msg || session.status === 'ended' || session.status === 'thinking' || !providers.current) return;
    const heard = stopTutor();
    dispatch({ type: 'child_said', text: msg, at: clock(), thinkMs: handedAt.current != null ? clock() - handedAt.current : undefined });
    setInput('');
    delays.current = { childDone: clock() };
    request({ message: msg, heard });
  };

  // ---------------------------------------------------------------- talking
  // Press to talk: a tap starts listening (and stops HOREB at once if it is speaking);
  // end of speech, or a second tap, ends it. In the self-playing demo the words typed in
  // the box are "spoken" (partials, then the final words), so barge-in can be tried free.
  const talk = (spokenText = null) => {
    const p = providers.current;
    if (!p?.stt || !canListen(voice) || session.status === 'ended') return;
    if (listenRef.current) { listenRef.current.stop(); return; }
    const fake = p.stt.name === 'typed-as-speech';
    const text = (spokenText ?? input).trim();
    if (fake && !text) { setSnapNote('Type what you would say, then press Talk.'); return; }
    const heard = stopTutor();
    vdispatch({ type: 'listen' });
    const sess = p.stt.start({
      onSpeech: () => {},
      onPartial: (t) => { setPauseNote(false); vdispatch({ type: 'partial', text: t }); },
      onPause: () => setPauseNote(true),
      pace: () => sessionRef.current.pace,
      onFinal: (said, seconds) => {
        listenRef.current = null;
        setPauseNote(false);
        audioIn.current += Number(seconds) || 0;
        vdispatch({ type: 'heard' });
        if (!said) {
          // Hands-free: the microphone stays open a little longer before giving up (a child should not have to keep tapping).
          if (autoTries.current < 2 && sessionRef.current.status === 'listening') { autoTries.current += 1; setTimeout(() => { if (!listenRef.current && sessionRef.current.status === 'listening') talk(); }, 200); return; }
          setSnapNote('HOREB did not hear anything. Tap Talk and try again, or type.'); return;
        }
        autoTries.current = 0;
        // Not worth marking (a hum, one stray letter, a word made up from silence): ask again kindly, mark nothing, send nothing.
        const q = fake ? { ok: true } : assessTranscript(said, seconds);
        if (!q.ok) {
          const line = askAgainLine(unclearAgain.current); unclearAgain.current += 1;
          dispatch({ type: 'unclear' }); setSnapNote(line);
          try { const st = providers.current.tts.open(voiceOptions()); st.add(line); } catch { /* the line is on the screen */ }
          return;
        }
        unclearAgain.current = 0;
        const t = fixMathsWords(said);
        dispatch({ type: 'child_said', text: t, at: clock(), thinkMs: handedAt.current != null ? clock() - handedAt.current : undefined });
        delays.current = { childDone: clock() };
        request({ message: t, heard });
      },
      onError: (kind, detail) => { listenRef.current = null; listenError.current = `${kind}${detail ? `: ${String(detail).slice(0, 160)}` : ''}`; vdispatch({ type: 'fail', kind }); },
    });
    listenRef.current = sess;
    if (fake) { setInput(''); sess.say(text); }
  };
  useEffect(() => () => { listenRef.current?.cancel?.(); providers.current?.tts?.close?.(); providers.current?.stt?.close?.(); }, []);

  // ---------------------------------------------------------------- the child's ink
  const onInk = useCallback((actions) => {
    const t = clock();
    let ink = boardRef.current.childInk;
    for (const a of actions) ink = inkReducer(ink, { ...a, t });
    if (ink === boardRef.current.childInk) return;
    boardRef.current = { ...boardRef.current, childInk: ink };
    setBoard(boardRef.current);
  }, []);

  const snapState = (now) => {
    const ink = boardRef.current.childInk;
    return { status: sessionRef.current.status, writing: writing(ink), hasInk: hasInk(ink), inkVersion: ink.version, snappedVersion: snap.current.version, lastInkAt: ink.lastAt, lastSnapAt: snap.current.lastAt, count: snap.current.count };
  };

  // A picture of the board goes to the tutor with the next turn.
  const takePicture = useCallback(async (reason) => {
    if (!providers.current) return;
    const t = clock();
    const st = snapState(t);
    if (reason === 'check') {
      const ok = checkAllowed(st, t);
      if (!ok.ok) { setSnapNote(ok.reason); return; }
    } else if (!autoSnapDue(st, t)) return;
    setSnapNote('');
    const ink = boardRef.current.childInk;
    snap.current = { count: snap.current.count + 1, lastAt: t, version: ink.version };
    const id = `snap-${snap.current.count}`;
    let shot;
    try { shot = await captureBoard(svgRef.current); } catch (e) { setSnapNote('The picture could not be taken.'); return; }
    setPics((l) => [...l, { id, reason, w: shot.w, h: shot.h, bytes: shot.bytes, tokens: imageTokens(shot.w, shot.h), thumb: `data:${shot.media};base64,${shot.data}` }].slice(-6));
    const heard = stopTutor();
    dispatch({ type: 'looked', text: reason === 'check' ? 'Check my work (a picture of my board)' : 'A picture of my board', at: t });
    request({ heard, snapshot: { id, media: shot.media, data: shot.data, w: shot.w, h: shot.h, reason, strokes: ink.strokes.length, example: ink.example } });
  }, [request]);

  // About 4 seconds after the child stops writing, on their turn: the idle picture.
  useEffect(() => {
    const id = setInterval(() => { if (autoSnapDue(snapState(clock()), clock())) takePicture('idle'); }, 500);
    return () => clearInterval(id);
  }, [takePicture]);

  // The child speaks over HOREB: no tap needed. While HOREB speaks (live voice), the microphone is watched; if the child's voice
  // holds for about a quarter of a second, HOREB stops (talk() stops the voice, keeps what was heard) and listens.
  useEffect(() => {
    const p = providers.current;
    if (session.status !== 'speaking' || voice.mode !== 'voice' || !p?.stt?.watch || listenRef.current) return undefined;
    const w = p.stt.watch({ onSpeech: () => { if (!listenRef.current) talk(); } });
    return () => w.stop();
  }, [session.status, session.turns, voice.mode]);

  // Hands-free (owner, 12 Nov 2026: "if I have to click on and off when speaking that's not manageable for a child"):
  // when HOREB hands over, the microphone opens by itself; the child just speaks. Talk stays as a way to stop or retry.
  const autoTries = useRef(0);
  useEffect(() => {
    const p = providers.current;
    if (session.status !== 'listening' || listenRef.current || !p?.stt || p.stt.name === 'typed-as-speech' || !canListen(voice) || voice.mode !== 'voice') return undefined;
    autoTries.current = 0;
    const id = setTimeout(() => { if (!listenRef.current && sessionRef.current.status === 'listening') talk(); }, 350); // past the echo of HOREB's last word
    return () => clearTimeout(id);
  }, [session.status, session.turns, voice.mode]);

  // Silence: after 15 s on the child's turn, a gentle line under the box (no model call).
  useEffect(() => {
    if (session.status !== 'listening') return undefined;
    const id = setTimeout(() => setNudge(true), 15000);
    return () => clearTimeout(id);
  }, [session.status, session.turns]);

  // The demo plays itself: once the tutor hands over, the demo child types an
  // answer, or writes one on the board stroke by stroke and then presses Check
  // my work or simply stops (and the idle picture is taken).
  const demoK = useRef(0);
  useEffect(() => {
    if (!demo) return undefined;
    if (session.status === 'ready' && !providers.current) { const id = setTimeout(start, 600); return () => clearTimeout(id); }
    if (session.status !== 'listening') return undefined;
    const item = DEMO_SCRIPT[demoK.current];
    if (!item || item.during) return undefined;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    let t = 1100;
    if (item.type === 'speak') {
      [...item.text].forEach((_, i) => at(t + i * 45, () => setInput(item.text.slice(0, i + 1))));
      at(t + item.text.length * 45 + 300, () => { demoK.current += 1; talk(item.text); });
    } else if (item.type === 'text') {
      [...item.text].forEach((_, i) => at(t + i * 55, () => setInput(item.text.slice(0, i + 1))));
      at(t + item.text.length * 55 + 450, () => { demoK.current += 1; send(item.text); });
    } else {
      if (item.clearFirst) { at(t, () => onInk([{ type: 'clear' }])); t += 400; }
      // The demo child writes where the board is free, as a child would.
      const taken = new Set(boardRef.current.order.flatMap((id) => cellsOf(boardRef.current.items[id].slot)));
      const cell = ['bottom_right', 'bottom_left', 'middle_right', 'middle_left', 'top_right'].find((c) => !taken.has(c)) || 'bottom_right';
      for (const stroke of exampleStrokes(item.example, boardH, cell)) {
        at(t, () => onInk([{ type: 'down', x: stroke[0][0], y: stroke[0][1], tool: 'pen' }]));
        stroke.slice(1).forEach(([x, y], i) => at(t + 12 * (i + 1), () => onInk([{ type: 'move', x, y }])));
        t += 12 * stroke.length + 10;
        at(t, () => onInk([{ type: 'up' }]));
        t += 90;
      }
      at(t + 10, () => { onInk([{ type: 'tag', example: item.example }]); demoK.current += 1; });
      if (item.then === 'check') at(t + 900, () => takePicture('check'));
    }
    return () => timers.forEach(clearTimeout);
  }, [demo, session.status, session.turns]);

  // The demo child also talks over HOREB once, to show barge-in.
  useEffect(() => {
    if (!demo || session.status !== 'speaking') return undefined;
    const item = DEMO_SCRIPT[demoK.current];
    if (!item?.during) return undefined;
    const id = setTimeout(() => { demoK.current += 1; talk(item.text); }, item.after || 3000);
    return () => clearTimeout(id);
  }, [demo, session.status, session.turns]);


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
  const ended = session.status === 'ended';
  const canTalk = !!(started && providers.current?.stt && canListen(voice));
  const bubble = tutorBubble(live, session.transcript);
  const mine = childBubble({ transcript: session.transcript, ask, listening: voice.listening, partial: voice.partial, status: session.status, canTalk });
  const part = partLabel(session.phase);
  const stateWord = voice.listening ? 'Listening to you' : session.looking ? 'Looking at your board' : ended ? 'Finished' : MASCOT_LABEL[mascot];
  // The pen tools come out when the child chooses to write (or has written); Type when they choose to type, or when talking is not possible.
  const inkShown = started && !ended && (writeOpen || hasInk(board.childInk));
  const typing = started && !ended && (typeOpen || !canTalk);
  const botSize = kind === 'table' ? 150 : kind === 'side' ? 44 : 56;
  const at = PHASES.indexOf(session.phase);
  const dots = <span className="vt-dots" aria-hidden="true">{PHASES.map((p, i) => <i key={p} className={i <= at ? 'on' : undefined} />)}</span>;
  // A small way in for the adults testing it: the mode, and the tester view (never for a child).
  const testerBits = (
    <span className="vt-testerbits">
      <span>{mode === 'remote' ? `Live${session.cost.sessionUsd ? ` · US$${session.cost.sessionUsd.toFixed(2)}` : ''}` : 'Practice'}</span>
      <button type="button" onClick={() => setTester((x) => !x)}>Tester</button>
    </span>
  );

  return (
    <div className={`vt-root vt-k-${kind}`}>
      <style>{CSS}</style>
      <main className="vt-table">
        {/* HOREB's side: the tutor, its state, and what it is saying now (one sentence, not a log). */}
        <section className="vt-horeb">
          {kind === 'table' && onNavigate ? <button type="button" className="vt-leave" aria-label="Leave the lesson" onClick={() => onNavigate('ai')}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button> : null}
          <div className={`vt-who vt-${voice.listening ? 'listening' : mascot}`}>
            <HorebBot size={botSize} mood={voice.listening ? 'listening' : mascot} />
            <div className="vt-name">HOREB</div>
            <div className="vt-state"><i />{stateWord}</div>
          </div>
          <div className="vt-bubble" aria-live="polite">
            {bubble ? (
              <>
                {bubble.before ? <span className="vt-before">{bubble.before}</span> : null}
                <span className="vt-now">
                  {bubble.words.slice(0, bubble.shown).map((w, i) => <span key={i} className={i === bubble.shown - 1 && bubble.shown < bubble.words.length ? 'vt-word' : undefined}>{w} </span>)}
                </span>
              </>
            ) : <span className="vt-before">{started ? 'HOREB is getting ready.' : 'HOREB is ready when you are.'}</span>}
            {session.ended ? <span className="vt-before vt-endnote">Lesson finished. {session.ended.summary}</span> : null}
            {session.error ? <span className="vt-error">{session.error}</span> : null}
          </div>
          {kind === 'table' ? <div className="vt-part">{dots}{part ? <span>{part}</span> : null}</div> : null}
          {kind === 'table' ? testerBits : null}
        </section>

        {/* The sheet of paper between them. */}
        <section className="vt-sheet">
          <div className="vt-board" style={{ aspectRatio: `1000 / ${boardH}` }}>
            <Board ref={svgRef} board={board} now={now} H={boardH} drawTimes={drawTimes.current} inkOn={inkShown} tool={tool} onInk={onInk} onPlay={onPlay} playOn={started && session.status !== 'ended'} />
            {!started ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-3 overflow-y-auto">
                <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-slate-200">
                  <div className="font-extrabold text-lg leading-tight">Grade 5 fractions</div>
                  <p className="text-sm text-slate-600 mt-1">A short lesson with HOREB, an AI tutor. For adult testers only.</p>
                  <div className="mt-3 flex gap-2 text-sm">
                    <button type="button" onClick={() => setMode('mock')} className={`flex-1 rounded-full px-3 py-1.5 font-bold border ${mode === 'mock' ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-300'}`}>Practice (free)</button>
                    <button type="button" disabled={!allowed} onClick={() => setMode('remote')} className={`flex-1 rounded-full px-3 py-1.5 font-bold border disabled:opacity-40 ${mode === 'remote' ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-300'}`}>Live model</button>
                  </div>
                  {/* Never fall back to the script without saying so (owner, 11 Nov 2026: he asked for live and got the script). */}
                  {!allowed ? (
                    <p className="vt-fallback mt-2 rounded-xl px-3 py-2">{user ? `Live is off for ${email}: it is not on the testers list.` : 'Live needs you signed in to HOREB first.'} Practice is a fixed script: HOREB does not hear what you say.</p>
                  ) : mode === 'mock' ? (
                    <p className="text-xs text-slate-500 mt-2">Practice is a fixed script to try the screen: HOREB does not hear what you say. Choose Live model for the real tutor.</p>
                  ) : null}
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
                      <p className="text-xs text-slate-500">Each turn is a paid model call{voiceOn ? ', and the voice is paid too' : ''}. Caps: US$1.50 a session, US$3 a day.</p>
                    </div>
                  ) : null}
                  <label className="mt-3 flex items-center gap-2 text-sm font-bold">
                    <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} className="w-4 h-4" />
                    Voice: HOREB speaks, and you can talk
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">{mode === 'remote' ? 'Uses the microphone when you tap Talk. Headphones help on a phone.' : 'Practice uses this browser\'s own voice and listening, free. Tap Talk to answer out loud.'}</p>
                  <button type="button" onClick={start} className="mt-4 w-full rounded-full bg-amber-400 py-2.5 font-extrabold">Start the lesson</button>
                </div>
              </div>
            ) : null}
          </div>
          {kind !== 'table' ? <div className="vt-corner">{dots}{part ? <span>{part}</span> : null}{testerBits}</div> : null}
        </section>

        {/* The child's side: their own bubble, then Talk; Write and Type are the other ways. */}
        <section className="vt-child">
          {mine ? (
            <div className={`vt-mine vt-mine-${mine.kind}`}>
              <small>You</small>
              <span>{mine.text}</span>
            </div>
          ) : null}
          {ask?.form === 'choice' && session.status === 'listening' ? (
            <div className="vt-choices">
              {ask.choices.map((c) => <button key={c} type="button" onClick={() => send(c)}>{c}</button>)}
            </div>
          ) : null}
          {voice.message ? (
            <div className="vt-fallback" role="status">
              <span>{voice.message}</span>
              {voiceOn && voice.mode !== 'voice' && providers.current?.stt ? <button type="button" onClick={() => vdispatch({ type: 'retry' })}>Try voice again</button> : null}
            </div>
          ) : null}
          {pauseNote && voice.listening ? <div className="vt-nudge">Take your time. HOREB is waiting.</div> : null}
          {nudge && session.status === 'listening' ? <div className="vt-nudge">Take your time, or tell HOREB if you would like it another way.</div> : null}
          {canTalk && !ended ? (
            <button type="button" onClick={() => talk()} disabled={session.status === 'thinking'} aria-pressed={voice.listening} className={`vt-talk ${voice.listening ? 'vt-talk-on' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" /></svg>
              {voice.listening ? 'Done' : 'Talk'}
            </button>
          ) : null}
          {typing ? (
            <form className="vt-type" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} disabled={session.status === 'ended'} autoFocus={typeOpen}
                placeholder={ask ? 'Type your answer' : session.status === 'speaking' ? 'Type to stop HOREB' : 'Type to HOREB'}
                maxLength={300} inputMode="text" autoComplete="off" aria-label="Type to HOREB" />
              <button type="submit" disabled={!input.trim() || session.status === 'thinking'} className={canTalk ? 'vt-send' : 'vt-send vt-send-main'}>Send</button>
            </form>
          ) : null}
          {inkShown ? (
            <InkBar tool={tool} setTool={setTool} canUndo={board.childInk.undo.length > 0} hasInk={hasInk(board.childInk)}
              onUndo={() => onInk([{ type: 'undo' }])} onClear={() => onInk([{ type: 'clear' }])}
              onCheck={() => takePicture('check')} checking={session.looking} note={snapNote}
              onClose={hasInk(board.childInk) ? null : () => setWriteOpen(false)} />
          ) : null}
          {started && !ended && !inkShown ? (
            <div className="vt-others">
              <button type="button" onClick={() => setWriteOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>Write
              </button>
              {canTalk && !typing ? (
                <button type="button" onClick={() => setTypeOpen(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" /></svg>Type
                </button>
              ) : null}
            </div>
          ) : null}
          {snapNote && !inkShown ? <div className="vt-nudge">{snapNote}</div> : null}
        </section>
      </main>

      {tester ? (
        <TesterPanel voiceId={voiceId} onVoice={chooseVoice} session={session} board={board} mode={mode} pics={pics} delays={delayLog} offsets={offsets.current} voice={voice} voiceName={providers.current ? `Voice: ${silentVoice.current ? 'none, silent (timed)' : voiceName}${providers.current.tts.timingMode ? `; word times ${providers.current.tts.timingMode === 'boundary' ? 'from the voice itself' : 'estimated from its pace'}` : ''}. Listening: ${providers.current.stt?.name || 'none (typing)'}.${voiceError.current ? ` Last voice error: ${voiceError.current}.` : ''}${listenError.current ? ` Last listening error: ${listenError.current}.` : ''}${providers.current.stt?.stats ? ` Last listen: audio ${providers.current.stt.stats.ctx || '?'}, ${providers.current.stt.stats.frames} sound frames, loudest ${providers.current.stt.stats.loudest.toFixed(3)} (speech starts at 0.020), service ${providers.current.stt.stats.socket}, ${providers.current.stt.stats.heard} final words${providers.current.stt.stats.said ? ` "${providers.current.stt.stats.said}"` : ''}.` : ''}` : ''} onClose={() => setTester(false)}
          onFail={started ? (kind) => {
            // As a real failure: the sound stops, the turn finishes in words on the board, the next turns are silent.
            if (kind === 'speak-failed') { providers.current.tts.stop(); providers.current.tts = simulatedTts(); }
            vdispatch({ type: 'fail', kind }); setTester(false);
          } : null}
          onExample={mode === 'mock' && started ? (key) => { onInk([{ type: 'clear' }, { type: 'add', strokes: exampleStrokes(key, boardH), example: key }]); setTester(false); } : null} />
      ) : null}
    </div>
  );
}

// The child's pen, on their side of the table: pen, rub out (their own ink only),
// undo, clear theirs, and Check my work. Big enough for a finger. Out only when
// the child chooses Write (or has written); it closes again while the board is clean.
const ICON = {
  pen: <><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>,
  eraser: <><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7" /><path d="m5 11 9 9" /></>,
  undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></>,
  clear: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
  close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
};
const Icon = ({ name }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[name]}</svg>;
function InkBar({ tool, setTool, canUndo, hasInk: any, onUndo, onClear, onCheck, checking, note, onClose = null }) {
  return (
    <div className="vt-inkbar" role="toolbar" aria-label="Your pen">
      <div className="vt-tools">
        <button type="button" aria-label="Pen" title="Pen" aria-pressed={tool === 'pen'} onClick={() => setTool('pen')} className={tool === 'pen' ? 'on' : undefined}><Icon name="pen" /></button>
        <button type="button" aria-label="Rub out" title="Rub out" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'on' : undefined}><Icon name="eraser" /></button>
        <button type="button" aria-label="Undo" title="Undo" disabled={!canUndo} onClick={onUndo}><Icon name="undo" /></button>
        <button type="button" className="vt-clear" aria-label="Clear my writing" title="Clear my writing" disabled={!any} onClick={onClear}><Icon name="clear" /></button>
        {onClose ? <button type="button" aria-label="Put the pen away" title="Put the pen away" onClick={onClose}><Icon name="close" /></button> : null}
      </div>
      <button type="button" className="vt-check" disabled={!any || checking} onClick={onCheck}>{checking ? 'HOREB is looking...' : 'Check my work'}</button>
      {note ? <div className="vt-nudge">{note}</div> : null}
    </div>
  );
}

function TesterPanel({ voiceId = null, onVoice = null, session, board, mode, pics = [], delays = [], offsets = [], voice = null, voiceName = '', onExample = null, onFail = null, onClose }) {
  return (
    <div className="fixed inset-x-2 bottom-2 top-12 sm:left-auto sm:w-[400px] z-50 bg-white rounded-2xl border border-slate-300 overflow-y-auto p-4 text-sm">
      <div className="flex items-center"><b className="text-base">Tester view</b><button type="button" className="ml-auto font-bold" onClick={onClose}>Close</button></div>
      <p className="text-slate-500 mt-1">Adult testers only: a prototype. Mode: {mode === 'remote' ? 'live model' : 'scripted'}. Nothing is saved yet (storage and review come in milestone 4).</p>
      <h3 className="font-extrabold mt-3">Lesson</h3>
      <p>Target: {session.target ? skillName(session.target) : 'not chosen yet'}</p>
      <p>Weakest prerequisite: {session.prerequisite ? skillName(session.prerequisite) : 'none'}</p>
      <p>Part: {session.phase || 'not started'}. Turns: {session.turns}. Interruptions: {session.interruptions}.</p>
      <p>Spent: US${session.cost.sessionUsd.toFixed(3)} this session, US${session.cost.dayUsd.toFixed(3)} today (caps US$1.50 and US$3).</p>
      <h3 className="font-extrabold mt-3">Everything said (the child sees only the current sentence)</h3>
      {session.transcript.length ? session.transcript.map((h, k) => (
        <p key={k} className={h.who === 'child' ? 'text-[#0E7C86]' : undefined}><b>{h.who === 'child' ? 'Child' : 'HOREB'}:</b> {h.text}</p>
      )) : <p className="text-slate-500">Nothing yet.</p>}
      <h3 className="font-extrabold mt-3">Diagnoses</h3>
      {session.diagnoses.length ? session.diagnoses.map((d, k) => (
        <div key={k} className="mt-1 rounded-lg bg-violet-50 p-2" style={{ background: '#ECE8FF' }}>
          <div className="font-bold">{d.misconception.split('.').pop()} ({d.confidence}){d.snapshot ? `, from picture ${d.snapshot}` : ''}</div>
          <div>{d.evidence}</div>
          <div className="text-slate-500">Next: {d.next.replace('_', ' ')}</div>
        </div>
      )) : <p className="text-slate-500">None yet.</p>}
      <h3 className="font-extrabold mt-3">Evidence (adds to mastery, never changes "mastered")</h3>
      {session.evidence.length ? session.evidence.map((e, k) => (
        <p key={k}>{e.ask}: "{e.answer}" {e.correct ? 'right' : `wrong${e.misconception ? `, ${e.misconception.split('.').pop()}` : ''}`}</p>
      )) : <p className="text-slate-500">None yet.</p>}
      <h3 className="font-extrabold mt-3">Pictures of the child's work ({session.snapshots}, kept in this page only, never stored)</h3>
      {pics.length ? pics.map((p) => (
        <div key={p.id} className="mt-1 flex gap-2 items-start">
          <img src={p.thumb} alt={`Picture ${p.id}`} className="w-24 rounded border border-slate-200" />
          <div className="text-[12px]">{p.id}, {p.reason === 'check' ? 'Check my work' : 'after a pause'}<br />{p.w} x {p.h}, {Math.round(p.bytes / 1024)} KB, about {p.tokens} tokens{p.unused ? <><br /><span className="text-red-700">not sent: {p.unused}</span></> : null}</div>
        </div>
      )) : <p className="text-slate-500">None yet.</p>}
      {onExample ? (
        <>
          <h3 className="font-extrabold mt-3">Write an example on the board (scripted mode reads only these)</h3>
          <div className="flex flex-wrap gap-1.5 mt-1">{Object.entries(EXAMPLES).map(([k, e]) => <button key={k} type="button" onClick={() => onExample(k)} className="px-2 py-1 rounded-full border border-slate-300 text-[12px] font-bold">{e.label}</button>)}</div>
        </>
      ) : null}
      <h3 className="font-extrabold mt-3">Voice and delay</h3>
      <p>{voiceName || 'Not started.'} Mode: {voice?.mode}.</p>
      {(() => { const pc = paceFor(session.pace, DEFAULT_SETTINGS.ttsSpeed); return <p className="text-[12px]">Pace: level {pc.level} (speed {pc.speed}, {pc.emotion}, gap {pc.gapMs} ms, at most {pc.maxWords} words){session.pace.reason ? `, because ${session.pace.reason}` : ''}. Asked again: {session.unclear} unclear.</p>; })()}
      {onVoice ? (
        <label className="block mt-1 text-[12px]">HOREB's voice (takes effect from the next turn)
          <select value={voiceId || ''} onChange={(e) => onVoice(e.target.value || null)} className="block w-full mt-0.5 border border-slate-300 rounded px-1 py-1">
            <option value="">The server's default</option>
            {TUTOR_VOICES.map((v) => <option key={v.id} value={v.id}>{v.name}: {v.note}</option>)}
          </select>
        </label>
      ) : null}
      {delays.length ? delays.map((d, k) => (
        <p key={k} className="text-[12px]">Turn {d.turn}: {d.total} ms from the end of the child's words to {d.spoken ? 'the first sound' : 'the first word'} (first checked step {d.firstStep} ms, then voice {d.voice} ms)</p>
      )) : <p className="text-slate-500">No replies timed yet.</p>}
      {offsets.length ? (() => { const o = [...offsets].sort((a, b) => a - b); const q = (f) => Math.round(o[Math.min(o.length - 1, Math.floor(o.length * f))]); return <p className="text-[12px]">Word to stroke: median {q(0.5)} ms, slowest {q(0.99)} ms over {o.length} strokes.</p>; })() : null}
      {onFail ? (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <button type="button" onClick={() => onFail('mic-denied')} className="px-2 py-1 rounded-full border border-slate-300 text-[12px] font-bold">Try: the microphone fails</button>
          <button type="button" onClick={() => onFail('speak-failed')} className="px-2 py-1 rounded-full border border-slate-300 text-[12px] font-bold">Try: the voice fails</button>
        </div>
      ) : null}
      <h3 className="font-extrabold mt-3">Dropped commands</h3>
      {session.dropped.length || board.log.length ? [...session.dropped, ...board.log].map((d, k) => <p key={k} className="text-red-700">{d.cmd || 'turn'}: {d.reason}</p>) : <p className="text-slate-500">None.</p>}
    </div>
  );
}

const CSS = `
.vt-root { position: fixed; inset: 0; overflow: hidden; background: #EDE8FA; color: #1D1D27; }
.vt-table { height: 100%; display: grid; gap: 20px; padding: 20px; }
.vt-table > section { min-height: 0; min-width: 0; }

/* HOREB's side */
.vt-horeb { position: relative; display: flex; flex-direction: column; align-items: center; }
.vt-who { display: flex; flex-direction: column; align-items: center; }
.vt-name { margin-top: 4px; font-weight: 800; font-size: 15px; }
.vt-state { margin-top: 2px; font-size: 13px; font-weight: 700; color: #5B32C8; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.vt-state i { width: 8px; height: 8px; border-radius: 99px; background: #f2a828; }
.vt-bubble { position: relative; margin-top: 18px; align-self: stretch; background: #fff; border-radius: 22px; padding: 18px 20px; font-size: 22px; line-height: 1.25; font-weight: 700; letter-spacing: -.01em; min-height: 64px; }
.vt-bubble::before { content: ''; position: absolute; top: -10px; left: 50%; margin-left: -10px; border: 10px solid transparent; border-top: 0; border-bottom-color: #fff; }
.vt-before { display: block; color: #6B6F7B; font-weight: 600; font-size: 17px; margin-bottom: 6px; }
.vt-now { color: #1D1D27; }
.vt-word { background: linear-gradient(transparent 62%, #FFE08A 62%); }
.vt-endnote { margin: 8px 0 0; }
.vt-error { display: block; margin-top: 8px; font-size: 14px; font-weight: 600; color: #B42318; }
.vt-part { margin-top: auto; align-self: stretch; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: #6B6F7B; padding: 0 4px; white-space: nowrap; }
.vt-horeb > .vt-testerbits { align-self: stretch; margin: 8px 0 0; padding: 0 4px; }
.vt-dots { display: inline-flex; gap: 5px; }
.vt-dots i { width: 9px; height: 9px; border-radius: 9px; background: #D5CDEF; }
.vt-dots i.on { background: #5B32C8; }
.vt-testerbits { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #9A9CA8; }
.vt-testerbits button { font: inherit; color: inherit; background: none; border: 0; padding: 4px 0; text-decoration: underline; cursor: pointer; }
.vt-leave { position: absolute; top: -6px; left: -6px; width: 40px; height: 40px; border: 0; border-radius: 99px; background: transparent; color: #6B6F7B; display: grid; place-items: center; cursor: pointer; }

/* The sheet */
.vt-sheet { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #FFFDF6; border-radius: 18px; overflow: hidden; box-shadow: 0 0 0 1px #E2DED0; }
.vt-board { position: relative; width: 100%; max-height: 100%; }
.vt-corner { flex: none; align-self: stretch; display: flex; align-items: center; gap: 8px; padding: 4px 12px 6px; font-size: 11px; font-weight: 700; color: #6B6F7B; }
.vt-k-stack .vt-board, .vt-k-side .vt-board { max-height: calc(100% - 26px); margin: auto 0; }
.vt-corner .vt-dots i { width: 7px; height: 7px; background: #E3DFD0; }
.vt-corner .vt-dots i.on { background: #1D1D27; }

/* The child's side */
.vt-child { display: flex; flex-direction: column; justify-content: flex-end; gap: 12px; }
.vt-mine { border-radius: 22px; padding: 14px 18px; font-weight: 700; font-size: 18px; line-height: 1.3; color: #0E7C86; }
.vt-mine small { display: block; font-size: 13px; color: #4F8E94; font-weight: 700; margin-bottom: 2px; }
.vt-mine-hint { border: 2px dashed #9FCFD3; background: rgba(255,255,255,.35); font-size: 16px; }
.vt-mine-said, .vt-mine-heard { background: #E1F2F3; }
.vt-mine-heard span { opacity: .75; font-style: italic; }
.vt-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.vt-choices button { min-height: 48px; border-radius: 16px; border: 1.5px solid #CFC6EA; background: #fff; font: inherit; font-weight: 700; font-size: 16px; padding: 6px 10px; cursor: pointer; }
.vt-fallback { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: #FFF0D4; color: #6B3D00; font-size: 13px; line-height: 1.3; font-weight: 600; border-radius: 14px; padding: 8px 12px; }
.vt-fallback button { font: inherit; background: none; border: 0; text-decoration: underline; color: inherit; cursor: pointer; }
.vt-nudge { font-size: 13px; color: #6B6F7B; font-weight: 600; }
.vt-talk { height: 72px; border-radius: 999px; border: 0; background: #FBBF24; color: #1D1D27; font: inherit; font-size: 21px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
.vt-talk:disabled { opacity: .45; }
.vt-talk-on { background: #5B32C8; color: #fff; animation: vt-glow 1.2s ease-in-out infinite; }
.vt-others { display: flex; gap: 10px; }
.vt-others button { flex: 1; height: 48px; border-radius: 999px; border: 1.5px solid #CFC6EA; background: transparent; color: #1D1D27; font: inherit; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; }
.vt-type { display: flex; gap: 8px; }
.vt-type input { flex: 1; min-width: 0; height: 48px; border-radius: 999px; border: 1.5px solid #CFC6EA; background: #fff; padding: 0 16px; font: inherit; font-size: 16px; outline: none; }
.vt-type input:focus { border-color: #5B32C8; }
.vt-send { height: 48px; padding: 0 18px; border-radius: 999px; border: 1.5px solid #CFC6EA; background: #fff; font: inherit; font-weight: 800; font-size: 15px; cursor: pointer; }
.vt-send-main { background: #FBBF24; border-color: #FBBF24; }
.vt-send:disabled { opacity: .45; }
.vt-inkbar { display: flex; flex-direction: column; gap: 8px; }
.vt-tools { display: flex; gap: 8px; }
.vt-tools button { flex: 1; height: 46px; border-radius: 999px; border: 1.5px solid #CFC6EA; background: #fff; color: #1D1D27; display: grid; place-items: center; cursor: pointer; }
.vt-tools button.on { border: 2.5px solid #0E7C86; color: #0E7C86; }
.vt-tools button:disabled { opacity: .4; }
.vt-check { height: 48px; border-radius: 999px; border: 2px solid #0E7C86; background: #fff; color: #0E7C86; font: inherit; font-weight: 800; font-size: 16px; cursor: pointer; }
.vt-check:disabled { opacity: .45; }

/* A laptop: HOREB | the sheet | you */
.vt-table { grid-template-columns: 290px 1fr 290px; }
@media (max-width: 1199px) { .vt-table { grid-template-columns: 250px 1fr 250px; } }

/* An upright phone: HOREB at the top, the sheet, you at the bottom */
.vt-k-stack .vt-table { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; gap: 10px; padding: 12px; }
.vt-k-stack .vt-horeb { flex-direction: row; align-items: flex-start; gap: 10px; }
.vt-k-stack .vt-who { flex: none; width: 66px; }
.vt-k-stack .vt-name { display: none; }
.vt-k-stack .vt-state { font-size: 11px; }
.vt-k-stack .vt-bubble { margin-top: 0; flex: 1; font-size: 18px; padding: 12px 15px; border-radius: 18px; min-height: 0; }
.vt-k-stack .vt-bubble::before { top: 20px; left: -9px; margin: 0; border: 9px solid transparent; border-left: 0; border-right-color: #fff; }
.vt-k-stack .vt-before { font-size: 15px; margin-bottom: 3px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.vt-k-stack .vt-child { gap: 8px; }
.vt-k-stack .vt-mine { padding: 10px 14px; font-size: 16px; border-radius: 18px; }
.vt-k-stack .vt-mine-hint { font-size: 15px; }
.vt-k-stack .vt-talk { height: 60px; font-size: 19px; }
.vt-k-stack .vt-others button, .vt-k-stack .vt-tools button, .vt-k-stack .vt-check, .vt-k-stack .vt-type input, .vt-k-stack .vt-send { height: 44px; }

/* On a phone the pen tools and Check my work share one row, the height of Write and Type, so the board never shrinks when the pen comes out */
.vt-k-stack .vt-inkbar, .vt-k-side .vt-inkbar { flex-direction: row; flex-wrap: wrap; }
.vt-k-stack .vt-tools, .vt-k-side .vt-tools { flex: none; }
.vt-k-stack .vt-tools button, .vt-k-side .vt-tools button { width: 44px; flex: none; }
.vt-k-stack .vt-clear, .vt-k-side .vt-clear { display: none !important; }
.vt-k-stack .vt-check, .vt-k-side .vt-check { flex: 1; min-width: 0; font-size: 15px; white-space: nowrap; padding: 0 8px; }
.vt-k-side .vt-check { font-size: 13px; }
.vt-k-stack .vt-inkbar .vt-nudge, .vt-k-side .vt-inkbar .vt-nudge { flex-basis: 100%; }

/* A phone on its side: the sheet on the left, HOREB above you on the right */
.vt-k-side .vt-table { grid-template-columns: 1fr 300px; grid-template-rows: auto 1fr; gap: 10px; padding: 10px; }
.vt-k-side .vt-sheet { grid-column: 1; grid-row: 1 / span 2; }
.vt-k-side .vt-horeb { grid-column: 2; grid-row: 1; flex-direction: row; align-items: flex-start; gap: 8px; }
.vt-k-side .vt-name { display: none; }
.vt-k-side .vt-state { font-size: 10px; }
.vt-k-side .vt-bubble { margin-top: 0; flex: 1; font-size: 15px; padding: 8px 12px; border-radius: 14px; min-height: 0; }
.vt-k-side .vt-bubble::before { display: none; }
.vt-k-side .vt-before { display: none; }
.vt-k-side .vt-child { grid-column: 2; grid-row: 2; gap: 6px; }
.vt-k-side .vt-mine { padding: 6px 12px; font-size: 14px; border-radius: 14px; }
.vt-k-side .vt-talk { height: 48px; font-size: 17px; }
.vt-k-side .vt-others button, .vt-k-side .vt-tools button, .vt-k-side .vt-check, .vt-k-side .vt-type input, .vt-k-side .vt-send { height: 38px; }

.vt-speaking .hb-talk { transform-box: fill-box; transform-origin: center; animation: vt-talk .32s ease-in-out infinite alternate; }
.vt-listening .hb-listen { animation: vt-glow 1.6s ease-in-out infinite; }
.vt-thinking svg { animation: vt-tilt 1.4s ease-in-out infinite; }
@keyframes vt-talk { from { transform: scaleY(.35); } to { transform: scaleY(1.15); } }
@keyframes vt-glow { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes vt-tilt { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { .vt-speaking .hb-talk, .vt-listening .hb-listen, .vt-thinking svg, .vt-talk-on { animation: none; } }
`;

export default VoiceTutor;
