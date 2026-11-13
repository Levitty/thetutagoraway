// ============================================================================
// THE LIVE TUTOR SESSION WINDOW (prototype, milestones 1 to 3): the board takes most
// of the screen, the HOREB robot sits in a corner box (listening, thinking,
// speaking), a transcript strip shows the tutor's words at speaking pace, and
// the child types, or writes and draws on the board (a pen, an eraser for their
// own ink, undo). "Check my work", or about 4 seconds without writing, sends a
// picture of the board (never the camera) to the tutor with the next turn.
// Voice (milestone 3): HOREB speaks and the board moves on the voice's own word
// times. The conversation engine (12 Nov 2026): the microphone stays open for the
// whole lesson (one listening session), so the child just talks, at any time; a real
// voice over HOREB stops it at once. The microphone button only mutes and unmutes.
// When the child is silent, the wait follows what they are doing (silence.js) and
// HOREB is asked for a short probe written for the moment. Typing and the board are
// the other ways in, and typing is said plainly when the microphone or voice fails.
//
// The screen (12 Nov 2026, owner: "go, build it with leave at top and dotted paper"): the lesson room, the
// same room as a lesson with a human tutor (src/VideoRoom.jsx), built from the shared parts in src/lesson/room/.
// HOREB sits in the tutor's tile, its sentence as a caption; the ring is on whoever is talking; "What we said"
// holds the lesson's words with Type as its input; the dock has Microphone, Write, Type (phone) and Check my work.
//
// Test only: behind VITE_VOICE_TUTOR=1; the live model answers only the server's VOICE_TUTOR_ALLOWLIST
// (one list, 12 Nov 2026). Adult test accounts only until consent
// (milestone 5); the server enforces the same.
//
//   /voice-tutor                  scripted tutor, no model, no cost
//   /voice-tutor?mode=live        the real tutor (the voice-tutor edge function)
//   /voice-tutor?demo=auto        the scripted lesson plays itself (demo child answers)
//   &quiet=1                      the practice voice at volume 0 (screen recordings: sound added after)
// ============================================================================
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { supabase } from '../supabase.js';
import { Board, drawKey, composedItems } from './Board.jsx';
import { drawDuration } from '../draw/index.js';
import { emptyBoard, applyStep, boardSummary, playFigure } from './board.js';
import { placeItem } from '../draw/compose.js';
import { itemStrokes, strokesBox } from '../draw/strokes.js';
import { figureNotes } from '../draw/observe.js';
import { roomShape, tutorBubble, childBubble, partLabel, PHASE_LABEL } from './layout.js';
import { C, WELL, RED, FONT, Icon, Face, Tile, DockButton, RoomHeader, StepStrip, Transcript, ChatPanel, ChatSheet, PenBar } from '../lesson/room/index.js';
import { validateTurn, PHASES, cellsOf, DRAWN, MARKS } from './commands.js';
import { buildTimeline, createPlayer, advance, updateTimeline } from './timeline.js';
import { sessionReducer, newSession, mascotState, DEFAULT_SETTINGS } from './session.js';
import { paceFor, assessTranscript, askAgainLine, fixMathsWords, TUTOR_VOICES, isTutorVoice } from './childVoice.js';
import { newWait, handOver, activity, probed, nextProbe } from './silence.js';
import { providersFor, checkProviders } from './providers/index.js';
import { simulatedTts } from './providers/mockVoice.js';
import { voiceReducer, initialVoice, bargeIn, canListen, canSpeak } from './providers/voice.js';
import { DEMO_SCRIPT } from './mockTutor.js';
import { inkReducer, hasInk, writing, inkCells, CHILD_INK } from './ink.js';
import { autoSnapDue, checkAllowed, imageTokens } from './snapshot.js';
import { captureBoard } from './capture.js';
import { EXAMPLES, exampleStrokes } from './examples.js';
import { FRACTION_SKILLS, skillName } from './fractions.js';

const ENV = import.meta.env || {};
export const VOICE_TUTOR_ON = ENV.VITE_VOICE_TUTOR === '1';
const clock = () => performance.now();
const params = () => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);

// The room's arrangement (layout.js roomShape): the side column or the phone's. Changes only on rotate or
// resize, never with what is said; the board is the same square page either way.
function useRoomShape() {
  const read = () => (typeof window === 'undefined' ? { ...roomShape(1440, 900), h: 900 } : { ...roomShape(window.innerWidth, window.innerHeight), h: window.innerHeight });
  const [shape, setShape] = useState(read);
  useEffect(() => {
    const f = () => setShape((old) => { const n = read(); return n.wide === old.wide && n.side === old.side && n.h === old.h ? old : n; });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return shape;
}

// The page is the largest square that fits the board well between the toolbar's row and the room kept
// under it (on a phone, HOREB's bubble and the two faces), centred in the free space (as Whiteboard.jsx).
const PAGE_TOP = 60;
const PAGE_BOTTOM = { wide: 48, phone: 188 };
const PHONE_BUBBLE = 112;   // the phone bubble's bottom edge, above the faces
function usePage(el, bottom) {
  const [page, setPage] = useState({ size: 0, top: PAGE_TOP });
  useLayoutEffect(() => {
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const size = Math.max(120, Math.floor(Math.min(r.width - 24, r.height - PAGE_TOP - bottom)));
      const top = PAGE_TOP + Math.max(0, Math.floor((r.height - PAGE_TOP - bottom - size) / 2));
      setPage((p) => (p.size === size && p.top === top ? p : { size, top }));
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [el, bottom]);
  return page;
}

// The side column's tiles, sized to the window's height (the preview's 214 and 118 at 900 high).
const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
function tileSizes(h) {
  const horeb = clampN(h * 0.238, 120, 214);
  const you = clampN(h * 0.131, 64, 118);
  return { horeb, you, bot: horeb >= 200 ? 108 : Math.round(horeb * 0.5), botTop: horeb >= 200 ? 22 : 10, initial: you >= 110 ? 64 : Math.round(you * 0.5) };
}
const firstName = (s) => String(s || '').trim().split(/\s+/)[0] || '';
// A short note for the child, as a sentence ("nothing written yet" becomes "Nothing written yet.").
const sentence = (t) => { const x = String(t || '').trim(); return x ? `${x[0].toUpperCase()}${x.slice(1)}${/[.!?]$/.test(x) ? '' : '.'}` : x; };

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
// The child's turn starts listening this long after HOREB's last word (its echo in the room).
const ECHO_TAIL_MS = 350;

export function VoiceTutor({ user = null, isAdmin = false, onNavigate = null, childId: lockedChildId = '' }) {
  useHorebLook();
  const { wide, side, boardH, h: winH } = useRoomShape();
  const tileH = tileSizes(winH);
  const [wellEl, wellRef] = useState(null);
  const page = usePage(wellEl, wide ? PAGE_BOTTOM.wide : PAGE_BOTTOM.phone);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const boardHRef = useRef(boardH);
  boardHRef.current = boardH;
  const q = useMemo(params, []);
  const demo = q.get('demo') === 'auto';
  const email = String(user?.email || '').toLowerCase();
  // One list decides who may use the live tutor: the server's VOICE_TUTOR_ALLOWLIST (12 Nov 2026: a second list
  // built into the page kept a listed tester out). Any signed-in adult sees the page and the free practice; the
  // live model and voice answer only accounts on the server's list, and say so plainly to anyone else.
  const allowed = !!user;
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
  const listenRef = useRef(null);     // the lesson's one listening session (providers: stt.open)
  const [muted, setMuted] = useState(false);
  const [aside, setAside] = useState(false);   // HOREB is saying a line outside a turn ("Sorry, I did not catch that"): not listened to
  const heardRef = useRef(null);      // what the child heard of HOREB before speaking over it, for the next turn
  const waitRef = useRef(newWait());  // the silence after HOREB's hand-over (silence.js)
  const lessonRef = useRef(null);     // the lesson state the server keeps moving (orchestrator.js), sent back each turn
  const voiceRef = useRef(null);
  voiceRef.current = voice;
  const audioIn = useRef(0);
  const sentBase = useRef(0);
  const turnNo = useRef(0);
  const delays = useRef({});
  const offsets = useRef([]);
  const movesLog = useRef([]);    // the teaching moves HOREB names, for the tester view
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
          if (!boardRef.current.ended) {
            // What the child is doing now decides how their silence is handled (silence.js).
            const doing = [...pl.turn.steps].reverse().find((x) => x.cmd === 'pause_for_child')?.doing || 'answer';
            handedAt.current = clock();
            waitRef.current = handOver(waitRef.current, { doing, probe: !!pl.turn.probe, now: clock(), slow: !!lessonRef.current?.slow, thinking: (lessonRef.current?.fillers || 0) > 0 });
            dispatch({ type: 'handed_over', doing });
          }
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

  const request = useCallback(async ({ message = '', heard = null, snapshot = null, probe = null }) => {
    const s = sessionRef.current;
    const mine = ++turnNo.current;
    if (!delays.current.childDone) delays.current.childDone = clock();
    // Live listening reports every second it sent (the microphone is open all lesson); practice counts the child's speech.
    const sentS = providers.current?.stt?.stats?.sentS;
    let audioS;
    if (sentS != null) { audioS = Math.round((sentS - sentBase.current) * 10) / 10; sentBase.current = sentS; } else { audioS = Math.round(audioIn.current * 10) / 10; audioIn.current = 0; }
    const open = askRef.current;
    // A probe leaves the question open: the child's answer to it is still marked.
    if (!probe) setAsk(null);
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
      history: s.transcript.map((h) => ({ who: h.who, text: h.text, turn: h.turn })),
      elapsed_s: Math.round((clock() - startedAt.current) / 1000), turn_index: s.turns, phase: s.phase,
      // The voice, priced into the caps on the server: will the words be spoken, and how much the child spoke.
      voice: !!providers.current.tts.hasAudio && !silentVoice.current && mode === 'remote', audio_in_s: audioS,
      // How HOREB is following this child's pace, for the tutor's context (src/voice-tutor/childVoice.js).
      pace: { level: s.pace.level, repeat: s.pace.repeat, reason: s.pace.reason },
      // The lesson state (orchestrator.js): the server checks it, decides the allowed moves, and sends it back moved on.
      lesson: lessonRef.current,
      // The child has been silent: a short turn, with the reason (silence.js).
      probe,
    };
    dispatch({ type: 'request' });
    delays.current.sent = clock();
    const T = { mine, raw: [], steps: [], dropped: [], said: 0, reported: 0, player: null, stopped: false, end: null, boardAtStart: boardNow, inkAtStart: inkNow, probe: !!probe };
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
        if (ev.step?.cmd === 'say' && ev.step.move) { movesLog.current = [...movesLog.current, ev.step.move].slice(-30); }
        publicSteps(T);
        feedVoice(T);
        if (T.player) turnSteps.current = T.steps;
      }
      if (ev.type === 'end') {
        T.end = ev;
        T.stream.end();
        // A turn with nothing to say (a nod after an idle picture): play it at once, silently.
        if (!T.said) firstSound(T, providers.current.tts.clock());
        if (ev.lesson) lessonRef.current = ev.lesson;
        dispatch({ type: 'turn_more', steps: T.steps.slice(T.reported), dropped: [...(ev.dropped || []), ...T.dropped], spent: ev.spent, guard: ev.guard, tester: ev.tester, probe: probe?.kind || null });
        T.reported = T.steps.length;
        // A silent nod stays silent: no stage direction is ever shown to the child (12 Nov 2026).
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
    // One listening session for the whole lesson: opened here (inside the Start tap), its mode follows the lesson.
    if (voiceOn && providers.current.stt) listenRef.current = providers.current.stt.open(listenHandlers());
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
  // The child says something (typed, or heard): over the tutor, or while its turn is still arriving, that turn stops,
  // and what the child heard of it goes with their words.
  const childSays = (text) => {
    const msg = String(text ?? '').trim();
    if (!msg || sessionRef.current.status === 'ended' || !providers.current) return;
    const heard = stopTutor() ?? heardRef.current;
    heardRef.current = null;
    waitRef.current = activity(waitRef.current, clock());
    dispatch({ type: 'child_said', text: msg, at: clock(), thinkMs: handedAt.current != null ? clock() - handedAt.current : undefined });
    setInput('');
    delays.current = { childDone: clock() };
    request({ message: msg, heard });
  };
  const send = (text) => childSays(text);

  // ---------------------------------------------------------------- listening, all lesson
  // The listener hears whole thoughts (thinking aloud is held: childVoice.js utteranceGate) and says when the child
  // starts speaking over HOREB. The handlers are made once, at Start; they reach the page through `pageRef`.
  const pageRef = useRef({});
  pageRef.current = { childSays, stopTutor: () => stopTutor() };
  const listenHandlers = () => ({
    pace: () => sessionRef.current.pace,
    onSpeech: () => { setPauseNote(false); waitRef.current = activity(waitRef.current, clock()); vdispatch({ type: 'listen' }); },
    onPartial: (t) => { setPauseNote(false); waitRef.current = activity(waitRef.current, clock()); vdispatch({ type: 'partial', text: t }); },
    onPause: () => setPauseNote(true),
    onBargeIn: () => {
      // A real voice over HOREB: it stops at once and listens.
      heardRef.current = pageRef.current.stopTutor() ?? heardRef.current;
      dispatch({ type: 'floor' });
      vdispatch({ type: 'listen' });
    },
    onNoise: () => { setPauseNote(false); vdispatch({ type: 'heard' }); },
    onUtterance: (said, seconds) => {
      setPauseNote(false);
      audioIn.current += Number(seconds) || 0;
      vdispatch({ type: 'heard' });
      const fake = providers.current?.stt?.name === 'typed-as-speech';
      // Not worth marking (a hum, one stray letter, a word made up from silence): ask again kindly, mark nothing, send nothing.
      const q = fake ? { ok: true } : assessTranscript(said, seconds);
      if (!q.ok) {
        const line = askAgainLine(unclearAgain.current); unclearAgain.current += 1;
        dispatch({ type: 'unclear' }); setSnapNote(line);
        // Not listened to while it is said (its own words would come back as the child's).
        setAside(true); setTimeout(() => setAside(false), 900 + line.split(' ').length * 420);
        try { const st = providers.current.tts.open(voiceOptions()); st.add(line); } catch { /* the line is on the screen */ }
        return;
      }
      unclearAgain.current = 0;
      pageRef.current.childSays(fixMathsWords(said));
    },
    onError: (kind, detail) => { listenError.current = `${kind}${detail ? `: ${String(detail).slice(0, 160)}` : ''}`; vdispatch({ type: 'fail', kind }); },
  });
  // The listener's mode follows the lesson: HOREB speaking is watched for a real voice over it (barge-in); the child's
  // turn, and HOREB thinking, are listened to; muted, ended or no voice: nothing. The child's turn starts a moment after
  // HOREB's last word, past its echo.
  useEffect(() => {
    const L = listenRef.current;
    if (!L) return undefined;
    const st = session.status;
    const want = muted || st === 'ended' || voice.mode !== 'voice' ? 'off' : st === 'speaking' || aside ? 'tutor' : 'child';
    if (want === 'off' && voice.listening) vdispatch({ type: 'stopped' });
    if (want === 'child' && L.mode === 'tutor') { const id = setTimeout(() => L.setMode('child'), ECHO_TAIL_MS); return () => clearTimeout(id); }
    L.setMode(want);
    return undefined;
  }, [session.status, session.turns, voice.mode, muted, aside]);
  useEffect(() => () => { listenRef.current?.close?.(); providers.current?.tts?.close?.(); providers.current?.stt?.close?.(); }, []);

  // ---------------------------------------------------------------- the child's ink
  const onInk = useCallback((actions) => {
    const t = clock();
    let ink = boardRef.current.childInk;
    for (const a of actions) ink = inkReducer(ink, { ...a, t });
    if (ink === boardRef.current.childInk) return;
    // Writing is the child doing something: the silence starts again (silence.js).
    waitRef.current = activity(waitRef.current, t);
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

  // Silence on the child's turn, by what they are doing (silence.js): answering, a nudge at about 6 s and a smaller
  // question at about 15 s; a board task, quiet while they work (the idle picture above when they stop writing) and one
  // check-in at about 45 s; free talk, the same but later. Never while they are speaking or writing. Each probe is a short
  // turn the model writes for the moment, with the reason.
  useEffect(() => {
    const id = setInterval(() => {
      const s = sessionRef.current;
      if (s.status !== 'listening' || !providers.current || voiceRef.current?.listening || writing(boardRef.current.childInk)) return;
      const p = nextProbe(waitRef.current, clock());
      if (!p) return;
      waitRef.current = probed(waitRef.current);
      request({ probe: { kind: p.kind, silent_s: p.silent_s } });
    }, 500);
    return () => clearInterval(id);
  }, [request]);

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
      at(t + item.text.length * 45 + 300, () => { demoK.current += 1; setInput(''); listenRef.current?.say?.(item.text); });
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
    const id = setTimeout(() => { demoK.current += 1; listenRef.current?.say?.(item.text); }, item.after || 3000);
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
  const mine = childBubble({ transcript: session.transcript, ask, listening: voice.listening, partial: voice.partial, status: session.status, canTalk: canTalk && !muted });
  const stateWord = voice.listening ? 'Listening to you' : session.looking ? 'Looking at your board' : ended ? 'Finished' : MASCOT_LABEL[mascot];
  const mood = voice.listening ? 'listening' : mascot;
  // The ring is on whoever is talking: green on HOREB while it speaks, on the child's tile while they talk,
  // yellow (the colour of Check my work) while HOREB looks at the board.
  const horebTalking = started && !voice.listening && session.status === 'speaking';
  const looking = started && !voice.listening && !!session.looking;
  const live2 = started && !ended;
  // The pen is out when the child chooses Write; their ink stays on the board either way.
  const inkShown = live2 && writeOpen;
  const at = PHASES.indexOf(session.phase);
  // A small way in for the adults testing it (never in a child's own space): the tester view, with the mode and the cost.
  const adult = !lockedChildId && canMock;
  const childName = firstName(children.find((c) => c.id === childId)?.name || (lockedChildId ? '' : user?.name || ''));
  const goal = session.target ? skillName(session.target) : skill ? skillName(skill) : 'Fractions, step by step';
  const placeholder = ask ? 'Type your answer' : session.status === 'speaking' ? 'Type to stop HOREB' : 'Type to HOREB';
  const notes = [
    voice.message ? { key: 'voice', text: voice.message, retry: voiceOn && voice.mode !== 'voice' && providers.current?.stt } : null,
    pauseNote && voice.listening ? { key: 'pause', text: 'Take your time. HOREB is waiting.' } : null,
    snapNote ? { key: 'snap', text: sentence(snapNote) } : null,
  ].filter(Boolean);
  const choices = ask?.form === 'choice' && session.status === 'listening' ? ask.choices : null;

  // What HOREB is saying: the sentence before (quieter) and the one being said, word by word.
  const sayingNow = bubble ? bubble.words.slice(0, bubble.shown).map((w, i) => (
    <span key={i} className={i === bubble.shown - 1 && bubble.shown < bubble.words.length ? 'vt-w' : undefined}>{w}{i < bubble.shown - 1 ? ' ' : ''}</span>
  )) : null;
  const saying = ended ? { before: 'Lesson finished.', now: session.ended?.summary || 'Well done today.', whole: true }
    : bubble ? { before: bubble.before, now: sayingNow, whole: bubble.shown >= bubble.words.length }
    : { before: null, now: started ? 'HOREB is getting ready.' : 'HOREB is ready when you are.', whole: true };

  // "What we said": the lesson's words as a chat. HOREB's lines of one turn sit together; the line being
  // said is marked, its current word highlighted. The full log stays in the tester view.
  const said = [];
  for (const h of session.transcript) {
    const last = said[said.length - 1];
    if (h.who === 'tutor' && last && last.tutor && last.turn === h.turn) last.parts.push(h.text);
    else said.push({ tutor: h.who === 'tutor', turn: h.turn, parts: [h.text] });
  }
  const speakingLine = live && bubble && bubble.shown < bubble.words.length;
  if (live) {
    const last = said[said.length - 1];
    const g = last && last.tutor && last.turn === session.turns ? last : (speakingLine ? (said.push({ tutor: true, turn: session.turns, parts: [] }), said[said.length - 1]) : null);
    if (g) { g.live = true; if (speakingLine) g.partial = sayingNow; }
  }
  const messages = said.slice(-14).map((g) => ({
    isRemote: g.tutor, who: g.tutor ? 'HOREB' : null, live: !!g.live,
    text: g.partial ? <>{g.parts.join(' ')}{g.parts.length ? ' ' : ''}<span className="vt-paper">{g.partial}</span></> : g.parts.join(' '),
  }));
  const saidKey = `${said.length}:${said[said.length - 1]?.parts.length || 0}:${bubble?.shown || 0}`;
  const transcriptBox = (autoFocus) => (
    <Transcript fade messages={messages} empty={started ? 'HOREB is getting ready.' : 'What you and HOREB say will show here.'} scrollKey={saidKey}
      value={input} onChange={(v) => { setInput(v); waitRef.current = activity(waitRef.current, clock()); }} onSend={() => { send(input); setTypeOpen(false); }}
      placeholder={placeholder} maxLength={300} disabled={!live2} inputLabel="Type to HOREB" autoFocus={autoFocus} />
  );

  const leave = () => { if (live2) setConfirmLeave(true); else onNavigate?.('ai'); };
  const noteList = notes.map((n) => (
    <div key={n.key} className="rounded-2xl px-3.5 py-2.5 text-[13.5px] font-semibold leading-snug flex flex-wrap items-center gap-x-2" style={{ background: C.amberSoft, color: '#6b3d00', border: '1.5px solid #f5d9a8' }} role="status">
      <span>{n.text}</span>
      {n.retry ? <button type="button" onClick={() => vdispatch({ type: 'retry' })} className="font-bold underline">Try voice again</button> : null}
    </div>
  ));
  const choiceRow = choices ? (
    <div className="grid grid-cols-2 gap-2">
      {choices.map((c) => <button key={c} type="button" onClick={() => send(c)} className="min-h-[44px] rounded-2xl px-3 text-[15px] font-bold" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: C.ink }}>{c}</button>)}
    </div>
  ) : null;
  const horebBot = (size) => <div className={`vt-${mood}`} style={{ lineHeight: 0 }}><HorebBot size={size} mood={mood} /></div>;
  const youInitial = (px) => (
    <div className={`w-full h-full flex items-center ${mine ? 'justify-start pl-6' : 'justify-center'}`} style={{ paddingBottom: '12%' }}>
      <div className="rounded-full flex items-center justify-center font-extrabold bg-white" style={{ width: px, height: px, fontSize: px * 0.39, color: C.brandDeep }}>
        {childName ? childName[0].toUpperCase() : <Icon name="user" className="w-1/2 h-1/2" />}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: C.paper, color: C.ink, fontFamily: FONT }}>
      <style>{CSS}</style>
      <RoomHeader title="Fractions with HOREB" who={['Grade 5', childName].filter(Boolean).join(' · ')} onLeave={leave} />

      {/* Today's step, and the lesson's five parts. */}
      <StepStrip kicker="Today's step" value={goal} compact={!wide}
        className={wide ? 'mb-3' : `mx-3 mb-2.5${at >= 0 ? ' pb-[26px]' : ''}`} style={wide ? { marginLeft: 24, marginRight: side + 40 } : null}>
        <div className={wide ? 'ml-auto grid gap-1.5 shrink-0' : 'basis-full grid grid-cols-5 gap-1'} style={wide ? { gridTemplateColumns: 'repeat(5, 76px)' } : null}
          role="img" aria-label={partLabel(session.phase) || 'The lesson has five parts'}>
          {PHASES.map((p, i) => {
            const tone = i < at ? 'done' : i === at ? 'now' : 'next';
            const colour = tone === 'now' ? C.ink : tone === 'done' ? C.brandDeep : 'rgba(122,82,0,.6)';
            return (
              <div key={p} className="relative">
                <span className="block h-1.5 rounded-full" style={{ background: tone === 'now' ? C.ink : tone === 'done' ? C.brandDeep : 'rgba(122,82,0,.18)' }} />
                {wide ? <span className="block mt-[5px] text-[11.5px] whitespace-nowrap" style={{ color: colour, fontWeight: tone === 'now' ? 800 : 700 }}>{PHASE_LABEL[p]}</span>
                  : tone === 'now' ? <span className={`absolute top-[11px] text-[11.5px] font-extrabold whitespace-nowrap ${i === 0 ? 'left-0' : i === PHASES.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>{partLabel(p)}</span> : null}
              </div>
            );
          })}
        </div>
      </StepStrip>

      {/* Main: the board, and on a laptop HOREB's tile, the child's tile and what was said beside it. */}
      <div className="flex-1 min-h-0 flex gap-4" style={{ padding: wide ? '0 24px' : '0 12px' }}>
        <div ref={wellRef} className="relative flex-1 min-w-0 rounded-[28px] overflow-hidden" style={{ background: WELL, border: `1.5px solid ${C.line}`, boxShadow: '0 18px 40px -26px rgba(60,40,20,.35)' }}>
          {inkShown ? (
            <PenBar pens={[CHILD_INK]} color={CHILD_INK} tool={tool} onPen={() => setTool('pen')} onEraser={() => setTool('eraser')} eraserLabel="Rub out"
              onUndo={() => onInk([{ type: 'undo' }])} canUndo={board.childInk.undo.length > 0}
              onClear={() => onInk([{ type: 'clear' }])} canClear={hasInk(board.childInk)} clearLabel="Clear my writing" />
          ) : null}

          {/* The page: the same square on every screen, on the human room's dotted paper. */}
          {page.size > 0 ? (
            <div className="absolute overflow-hidden" style={{ top: page.top, left: '50%', transform: 'translateX(-50%)', width: page.size, height: page.size, borderRadius: 18, border: `1.5px solid ${C.line}`, boxShadow: '0 1px 0 #e6dfd5, 0 14px 30px -20px rgba(60,40,20,.35)' }}>
              <Board ref={svgRef} board={board} now={now} H={boardH} drawTimes={drawTimes.current} inkOn={inkShown} tool={tool} onInk={onInk} onPlay={onPlay} playOn={live2} />
            </div>
          ) : null}

          {/* Phone: HOREB's sentence in a bubble under the page, and the two round faces in the corner. */}
          {!wide ? (
            <>
              <div className="vt-paper absolute left-3 right-3 z-[3] rounded-[20px] px-3.5 pt-2 pb-2.5" style={{ bottom: PHONE_BUBBLE, background: '#fff', border: `1.5px solid ${C.line}`, boxShadow: '0 10px 24px -16px rgba(0,0,0,.3)' }} aria-live="polite">
                {saying.before ? <span className="block text-[13px] font-semibold truncate" style={{ color: C.mute }}>{saying.before}</span> : null}
                <div className="vt-last3 text-[17px] font-extrabold leading-[1.25] tracking-[-.01em]" style={{ color: C.ink }}><div>{saying.now}</div></div>
                {session.error ? <span className="block mt-1 text-[13px] font-semibold" style={{ color: RED }}>{session.error}</span> : null}
                {choiceRow ? <div className="mt-2">{choiceRow}</div> : null}
                {notes.map((n) => (
                  <span key={n.key} className="block mt-1.5 pt-1.5 text-[12.5px] font-semibold leading-snug" style={{ color: '#6b3d00', borderTop: `1px solid ${C.line}` }} role="status">
                    {n.text}{n.retry ? <> <button type="button" onClick={() => vdispatch({ type: 'retry' })} className="font-bold underline">Try voice again</button></> : null}
                  </span>
                ))}
                <span className="vt-tail" aria-hidden="true" />
              </div>
              {mine ? (
                <div className="absolute left-3 bottom-4 z-[3] flex" style={{ right: 172 }}>
                  <div className="vt-last3 rounded-2xl px-3 py-2 text-[14px] leading-[1.3]" style={{ background: 'rgba(18,17,23,.8)', color: 'rgba(255,255,255,.92)', fontStyle: mine.kind === 'heard' ? 'italic' : 'normal', fontWeight: mine.kind === 'hint' ? 600 : 700, maxHeight: 'none' }}><div className="vt-last3">{mine.text}</div></div>
                </div>
              ) : null}
              <div className="absolute right-3 bottom-4 z-[3] flex items-end gap-2">
                <Face name={childName || 'You'} size={58} tag="You" speaking={started && voice.listening}>{childName ? null : <Icon name="user" className="w-6 h-6" />}</Face>
                <Face size={84} tag="HOREB" speaking={horebTalking} ring={looking ? C.brand : null}>{horebBot(60)}</Face>
              </div>
            </>
          ) : null}

          {/* Before the lesson: Practice or Live, the voice, and for Live the child and the skill. */}
          {!started ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-3 overflow-y-auto" style={{ background: 'rgba(247,243,238,.72)' }}>
              <div className="w-full max-w-sm rounded-[28px] p-5" style={{ background: C.card, border: `1.5px solid ${C.line}`, boxShadow: '0 18px 40px -26px rgba(60,40,20,.35)' }}>
                <div className="font-extrabold text-[19px] tracking-tight leading-tight">Grade 5 fractions</div>
                <p className="text-[14px] mt-1" style={{ color: C.ink2 }}>A short lesson with HOREB, an AI tutor. For adult testers only.</p>
                <div className="mt-3 flex gap-2 text-[14px]">
                  {[['mock', 'Practice (free)'], ['remote', 'Live model']].map(([m, label]) => (
                    <button key={m} type="button" disabled={m === 'remote' && !allowed} onClick={() => setMode(m)} className="flex-1 h-10 rounded-full font-bold disabled:opacity-40"
                      style={mode === m ? { background: C.ink, color: '#fff' } : { background: '#fff', color: C.ink, border: `1.5px solid ${C.line}` }}>{label}</button>
                  ))}
                </div>
                {/* Never fall back to the script without saying so (owner, 11 Nov 2026: he asked for live and got the script). */}
                {!allowed ? (
                  <p className="mt-2 rounded-2xl px-3 py-2 text-[13px] font-semibold leading-snug" style={{ background: C.amberSoft, color: '#6b3d00' }}>{user ? `Live is off for ${email}: it is not on the testers list.` : 'Live needs you signed in to HOREB first.'} Practice is a fixed script: HOREB does not hear what you say.</p>
                ) : mode === 'mock' ? (
                  <p className="text-[12.5px] mt-2" style={{ color: C.mute }}>Practice is a fixed script to try the screen: HOREB does not hear what you say. Choose Live model for the real tutor.</p>
                ) : null}
                {mode === 'remote' ? (
                  <div className="mt-3 grid gap-2 text-[14px]">
                    <select value={childId} onChange={(e) => setChildId(e.target.value)} className="h-10 rounded-xl px-2 bg-white" style={{ border: `1.5px solid ${C.line}` }}>
                      <option value="">My own test profile</option>
                      {children.map((c) => <option key={c.id} value={c.id}>{c.name}{c.grade ? ` (${c.grade})` : ''}</option>)}
                    </select>
                    <select value={skill} onChange={(e) => setSkill(e.target.value)} className="h-10 rounded-xl px-2 bg-white" style={{ border: `1.5px solid ${C.line}` }}>
                      <option value="">Skill: chosen from the profile</option>
                      {FRACTION_SKILLS.map((c) => <option key={c} value={c}>{skillName(c)}</option>)}
                    </select>
                    <p className="text-[12.5px]" style={{ color: C.mute }}>Each turn is a paid model call{voiceOn ? ', and the voice is paid too' : ''}. Caps: US$1.50 a session, US$3 a day.</p>
                  </div>
                ) : null}
                <label className="mt-3 flex items-center gap-2 text-[14px] font-bold">
                  <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} className="w-4 h-4" style={{ accentColor: C.ink }} />
                  Voice: HOREB speaks, and you can talk
                </label>
                <p className="text-[12.5px] mt-0.5" style={{ color: C.mute }}>{mode === 'remote' ? 'The microphone stays on for the whole lesson, so you can just talk, even over HOREB. Headphones help on a phone.' : 'Practice uses this browser\'s own voice and listening, free. Just talk to answer out loud.'}</p>
                <button type="button" onClick={start} className="mt-4 w-full h-12 rounded-xl font-extrabold text-[16px]" style={{ background: C.brand, color: C.ink }}>Start the lesson</button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Laptop: HOREB's tile, the child's tile, and what was said, with Type as its input. */}
        {wide ? (
          <aside className="shrink-0 flex flex-col gap-3 min-h-0" style={{ width: side }}>
            <div className="shrink-0" style={{ height: tileH.horeb }}>
              <Tile label={`HOREB · ${started ? stateWord : 'Ready'}`} tagTop speaking={horebTalking} ring={looking ? C.brand : null} dot={horebTalking ? '#4cc38a' : looking ? C.brand : null}
                caption={(
                  <div className="absolute left-3 right-3 bottom-3 rounded-2xl px-[13px] pt-[9px] pb-[10px]" style={{ background: 'rgba(18,17,23,.8)', color: '#fff' }} aria-live="polite">
                    {saying.before ? <span className="block text-[12.5px] font-semibold truncate mb-0.5" style={{ color: 'rgba(255,255,255,.62)' }}>{saying.before}</span> : null}
                    <div className="vt-last2 text-[16.5px] font-extrabold leading-[1.25] tracking-[-.01em]" style={{ color: saying.whole ? 'rgba(255,255,255,.85)' : '#fff' }}><div>{saying.now}</div></div>
                    {session.error ? <span className="block mt-1 text-[12.5px] font-semibold" style={{ color: '#ffb4a8' }}>{session.error}</span> : null}
                  </div>
                )}>
                <div className="absolute left-1/2 top-0" style={{ marginTop: tileH.botTop, transform: `translateX(-50%) scale(${horebTalking ? 1 : 0.88})`, transformOrigin: '50% 0' }}>{horebBot(tileH.bot)}</div>
              </Tile>
            </div>
            <div className="shrink-0" style={{ height: tileH.you }}>
              <Tile label="You" muted={live2 && (muted || !canTalk)} speaking={started && voice.listening}
                caption={mine ? (
                  <div className="absolute right-3 bottom-3 rounded-2xl px-3 py-2" style={{ maxWidth: '64%', background: 'rgba(18,17,23,.8)', color: 'rgba(255,255,255,.9)' }}>
                    <div className="vt-last2 text-[15px] leading-[1.3]" style={{ fontStyle: mine.kind === 'heard' ? 'italic' : 'normal', fontWeight: mine.kind === 'hint' ? 600 : 700 }}>{mine.text}</div>
                  </div>
                ) : null}>
                {youInitial(tileH.initial)}
              </Tile>
            </div>
            {noteList}
            {choiceRow}
            <ChatPanel title="What we said">{transcriptBox(false)}</ChatPanel>
          </aside>
        ) : null}
      </div>

      {/* The dock: the child's working controls. Leave is in the header, once. */}
      <div className="relative shrink-0 px-2 pt-3 flex items-start justify-center gap-3.5 sm:gap-4" style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + ${wide ? '1.1rem' : '1.6rem'})` }}>
        <DockButton name="mic" label={live2 && (muted || !canTalk) ? 'Microphone off' : 'Microphone on'} slash={live2 && (muted || !canTalk)} state={live2 && (muted || !canTalk) ? 'off' : 'normal'}
          disabled={!live2 || !canTalk} onClick={() => setMuted((m) => !m)} />
        <DockButton name="pen" label="Write" state={inkShown ? 'on' : 'normal'} disabled={!live2} onClick={() => { setWriteOpen((o) => !o); setTool('pen'); }} />
        {!wide ? <DockButton name="type" label="Type" state={typeOpen ? 'on' : 'normal'} disabled={!live2} onClick={() => setTypeOpen((o) => !o)} /> : null}
        <DockButton name="check" label="Check my work" state="hot" disabled={!live2 || !!session.looking} onClick={() => takePicture('check')} />
        {adult ? (
          <button type="button" onClick={() => setTester((x) => !x)} className={`absolute underline font-semibold ${wide ? 'right-6 bottom-5 text-[11px]' : 'right-3.5 bottom-[7px] text-[10.5px]'}`} style={{ color: '#aaa49a' }}>Tester</button>
        ) : null}
      </div>

      {/* Phone: Type opens "What we said" as the sheet the human room's Chat opens. On a phone with no voice, typing is the way in. */}
      {!wide && typeOpen ? <ChatSheet className="" title="What we said" onClose={() => setTypeOpen(false)}>{transcriptBox(true)}</ChatSheet> : null}

      {/* Leaving is never one accidental tap. */}
      {confirmLeave ? (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(18,17,23,.45)' }} onClick={() => setConfirmLeave(false)}>
          <div className="w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] p-6" style={{ background: C.card, paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-extrabold tracking-tight">Leave the lesson?</h2>
            <p className="text-[15px] mt-2" style={{ color: C.ink2 }}>HOREB stops here. You can start a new lesson later.</p>
            <button type="button" onClick={() => setConfirmLeave(false)} className="mt-5 w-full h-12 rounded-xl font-bold" style={{ background: C.ink, color: '#fff' }}>Stay in the lesson</button>
            <button type="button" onClick={() => { setConfirmLeave(false); onNavigate?.('ai'); }} className="mt-2 w-full h-12 rounded-xl font-bold" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: RED }}>Leave</button>
          </div>
        </div>
      ) : null}

      {tester ? (
        <TesterPanel lesson={lessonRef.current} moves={movesLog.current} voiceId={voiceId} onVoice={chooseVoice} session={session} board={board} mode={mode} pics={pics} delays={delayLog} offsets={offsets.current} voice={voice} voiceName={providers.current ? `Voice: ${silentVoice.current ? 'none, silent (timed)' : voiceName}${providers.current.tts.timingMode ? `; word times ${providers.current.tts.timingMode === 'boundary' ? 'from the voice itself' : 'estimated from its pace'}` : ''}. Listening: ${providers.current.stt?.name || 'none (typing)'}.${voiceError.current ? ` Last voice error: ${voiceError.current}.` : ''}${listenError.current ? ` Last listening error: ${listenError.current}.` : ''}${providers.current.stt?.stats ? ` Last listen: audio ${providers.current.stt.stats.ctx || '?'}, ${providers.current.stt.stats.frames} sound frames, loudest ${providers.current.stt.stats.loudest.toFixed(3)} (speech starts at 0.020), service ${providers.current.stt.stats.socket}, ${providers.current.stt.stats.heard} final words${providers.current.stt.stats.said ? ` "${providers.current.stt.stats.said}"` : ''}.` : ''}` : ''} onClose={() => setTester(false)}
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

function TesterPanel({ lesson = null, moves = [], voiceId = null, onVoice = null, session, board, mode, pics = [], delays = [], offsets = [], voice = null, voiceName = '', onExample = null, onFail = null, onClose }) {
  return (
    <div className="fixed inset-x-2 bottom-2 top-12 sm:left-auto sm:w-[400px] z-50 bg-white rounded-2xl border border-slate-300 overflow-y-auto p-4 text-sm">
      <div className="flex items-center"><b className="text-base">Tester view</b><button type="button" className="ml-auto font-bold" onClick={onClose}>Close</button></div>
      <p className="text-slate-500 mt-1">Adult testers only: a prototype. Mode: {mode === 'remote' ? 'live model' : 'scripted'}. Nothing is saved yet (storage and review come in milestone 4).</p>
      <h3 className="font-extrabold mt-3">Lesson</h3>
      <p>Target: {session.target ? skillName(session.target) : 'not chosen yet'}</p>
      <p>Weakest prerequisite: {session.prerequisite ? skillName(session.prerequisite) : 'none'}</p>
      <p>Part: {session.phase || 'not started'}. Turns: {session.turns}. Interruptions: {session.interruptions}.</p>
      <p>Spent: US${session.cost.sessionUsd.toFixed(3)} this session, US${session.cost.dayUsd.toFixed(3)} today (caps US$1.50 and US$3).</p>
      <h3 className="font-extrabold mt-3">Teaching moves, in order</h3>
      <p>{moves.length ? moves.join(' \u2192 ') : 'None named yet.'}</p>
      <h3 className="font-extrabold mt-3">Lesson state (kept by the server's orchestrator)</h3>
      {lesson ? (
        <p className="text-[12px]">Stage {lesson.stage || 'not started'}; the child is {lesson.doing || 'starting'}{lesson.question ? `; question ${lesson.question.id}, ${lesson.question.attempts} attempt(s)` : ''}; hints {lesson.hints}; tried {lesson.tried.length ? lesson.tried.join(', ') : 'nothing yet'}; wrong in a row with the same picture {lesson.sameFails}; understood in a row {lesson.streak}{lesson.pending ? `; ${lesson.pending.ask} right, reason not given yet` : ''}; probes {lesson.probes}.</p>
      ) : <p className="text-slate-500">None yet.</p>}
      <h3 className="font-extrabold mt-3">Each turn: why it went as it did</h3>
      {session.log.length ? session.log.map((l, k) => (
        <div key={k} className="mt-1 rounded-lg p-2 text-[12px]" style={{ background: '#F4F2FA' }}>
          <div className="font-bold">Turn {l.turn}{l.probe ? `, a silence probe (${l.probe.replace('_', ' ')})` : ''}</div>
          <div className={l.guard.some((g) => !['scripted', 'probe'].includes(g)) ? 'text-red-700' : undefined}>Guards: {l.guard.length ? l.guard.map((g) => (GUARD_WORDS[g.split(':')[0]] ? `${g.split(':')[0]} (${GUARD_WORDS[g.split(':')[0]]}${g.includes(':') ? `:${g.slice(g.indexOf(':') + 1)}` : ''})` : g)).join('; ') : 'none, the turn played as written'}.</div>
          {l.tester?.judged ? <div>Answer judged: <b>{l.tester.judged.class.replace(/_/g, ' ')}</b>{l.tester.judged.misconception ? `, ${l.tester.judged.misconception.split('.').pop()}` : ''} (by the {l.tester.judged.source === 'model' ? 'model, held to the seal' : 'code: the model did not assess'}){l.tester.judged.evidence ? `: "${l.tester.judged.evidence}"` : ''}{l.tester.judged.note ? `. ${l.tester.judged.note}` : ''}.</div> : null}
          {l.tester?.rule ? <div>Allowed moves ({l.tester.rule}): {l.tester.moves.join(', ')}. Why: {l.tester.reason}.</div> : null}
          {l.tester?.kept?.length ? <div className="text-amber-800">Off the plan: {l.tester.kept.join('; ')}.</div> : null}
        </div>
      )) : <p className="text-slate-500">No turns yet.</p>}
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

// Why a turn was stopped or replaced, in plain words, so a fallback is never unexplained (tutorTurn.js guards).
const GUARD_WORDS = {
  'answer-leak': 'a sentence would have given the answer away, so the turn stopped there and carried on in context',
  'answer-in-question': 'a sentence gave the answer inside its own question, so it was not said; the turn went on',
  'answer-before-ask': 'the answer to a question was already said this turn, so the question was not asked',
  're-ask': 'the model asked again a question the child had just answered right, so it was not asked',
  'unsafe-reply': 'a sentence tripped the safeguarding rules and was not spoken',
  'invalid-turn': 'the model gave nothing usable, so an authored line in context was used',
  'care-wait': 'the child was quiet after a care reply: an authored line, no model',
  'lesson-ended': 'the lesson had ended after a safeguarding concern: no model',
  'model-error': 'the model call failed',
  refusal: 'the model refused',
  'too-long': 'the turn ran past the word limit and was cut',
  'too-long-probe': 'the probe ran past its word limit and was cut',
  offline: 'no model key on the server, so an authored line was used',
  'session-cap': 'the session spending cap was reached',
  'day-cap': 'the day spending cap was reached',
  'turn-cap': 'the turn limit was reached',
  safeguarding: 'the child said something that needs care: an authored reply, no model',
  'safeguarding-crisis': 'the child may be at risk: an authored reply, and the lesson ended',
  personal: 'the child shared a personal detail: an authored reply, no model',
  rules: 'the child tried to change the rules: an authored reply, no model',
  'server-error': 'the server failed during the turn',
  interrupted: 'the scripted tutor went back over the same part',
  unclear: 'the scripted tutor could not read the picture',
};

// The few things the room's parts do not carry: HOREB's face moving, the caption's last lines, the bubble's tail.
const CSS = `
.vt-w { color: #ffc53d; }
.vt-paper .vt-w { color: inherit; background: linear-gradient(transparent 60%, rgba(255,197,61,.75) 60%); }
.vt-last2, .vt-last3 { display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.vt-last2 { max-height: 2.5em; }
.vt-last3 { max-height: 3.75em; }
.vt-tail { position: absolute; right: 34px; bottom: -9px; width: 16px; height: 16px; background: #fff; border-right: 1.5px solid #ece4d8; border-bottom: 1.5px solid #ece4d8; transform: rotate(45deg); border-bottom-right-radius: 3px; }
.vt-speaking .hb-talk { transform-box: fill-box; transform-origin: center; animation: vt-talk .32s ease-in-out infinite alternate; }
.vt-listening .hb-listen { animation: vt-glow 1.6s ease-in-out infinite; }
.vt-thinking svg { animation: vt-tilt 1.4s ease-in-out infinite; }
@keyframes vt-talk { from { transform: scaleY(.35); } to { transform: scaleY(1.15); } }
@keyframes vt-glow { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes vt-tilt { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { .vt-speaking .hb-talk, .vt-listening .hb-listen, .vt-thinking svg { animation: none; } }
`;

export default VoiceTutor;
