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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { supabase } from '../supabase.js';
import { Board, BOARD_H } from './Board.jsx';
import { emptyBoard, applyStep, boardSummary, portraitBoardH } from './board.js';
import { validateTurn, PHASES, cellsOf } from './commands.js';
import { buildTimeline, createPlayer, advance, updateTimeline } from './timeline.js';
import { sessionReducer, newSession, mascotState } from './session.js';
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
const ALLOWLIST = String(ENV.VITE_VOICE_TUTOR_ALLOWLIST || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const clock = () => performance.now();
const params = () => { try { return new URLSearchParams(window.location.search); } catch { return new URLSearchParams(); } };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);

// The board's shape. Wide screens: 1000 x 640. An upright phone: the board takes about a
// third of the screen's height (same slots, rows sized to fit), so the conversation has room
// to show the current sentence whole. Changes only on rotate or resize, never while speaking.
function useBoardShape() {
  const read = () => {
    if (typeof window === 'undefined') return { portrait: false, H: BOARD_H };
    const w = window.innerWidth; const h = window.innerHeight;
    const portrait = h > w;
    return { portrait, H: portrait ? portraitBoardH(w, h) : BOARD_H };
  };
  const [shape, setShape] = useState(read);
  useEffect(() => {
    const f = () => setShape((old) => { const n = read(); return n.portrait === old.portrait && n.H === old.H ? old : n; });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return shape;
}

// The conversation shows whole lines only: lines that no longer fit leave from the top,
// so no line is ever cut in half (the current sentence is always at the bottom, whole).
function useWholeLines() {
  const box = useRef(null);
  const [gone, setGone] = useState(() => new Set());   // lines (by key) that have left from the top
  useLayoutEffect(() => {
    const el = box.current;
    const first = el?.firstElementChild;
    // The last line (the current one) never leaves.
    if (!el || !first || el.children.length < 2 || !first.dataset.k) return;
    if (first.getBoundingClientRect().top < el.getBoundingClientRect().top - 1) setGone((g) => new Set([...g, first.dataset.k]));
  });
  return [box, gone];
}
// A line's identity, the same whether it is being spoken now or already said.
const lineKey = (h, i) => (h.who === 'tutor' && !h.cut ? `t${h.turn}:${h.text}` : `c${i}`);

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
const PHASE_LABEL = { warmup: 'Warm-up', teach: 'Teach', guided: 'Together', independent: 'On your own', wrapup: 'Wrap-up' };

export function VoiceTutor({ user = null, isAdmin = false, onNavigate = null }) {
  useHorebLook();
  const { H: boardH } = useBoardShape();
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
  const svgRef = useRef(null);
  const [tool, setTool] = useState('pen');
  // Pictures of the child's work: how many, when, of which ink version (refs: read by the idle timer).
  const snap = useRef({ count: 0, lastAt: null, version: 0 });
  const [pics, setPics] = useState([]);   // { id, reason, w, h, bytes, tokens, thumb } kept in memory only, never stored
  const [snapNote, setSnapNote] = useState('');
  const [linesRef, goneLines] = useWholeLines();
  // The voice: wanted or not, working or not (typing is always the fallback), the child's
  // speech in progress, seconds of speech sent since the last turn, and the delays measured.
  const [voiceOn, setVoiceOn] = useState(q.get('voice') !== 'off');
  const [voice, vdispatch] = useReducer(voiceReducer, null, () => initialVoice('voice'));
  const listenRef = useRef(null);
  const audioIn = useRef(0);
  const turnNo = useRef(0);
  const delays = useRef({});
  const offsets = useRef([]);
  const silentVoice = useRef(false);   // the practice voice could not keep time: timed silent mode   // ms between a word being heard and its stroke starting (frame lag)
  const [delayLog, setDelayLog] = useState([]);
  const [voiceName, setVoiceName] = useState('');
  const boardClock = () => providers.current?.tts?.clock?.() ?? clock();
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
          updateTimeline(pl, buildTimeline(pl.turn.steps, { speech: (_, k) => pl.stream.timing(k) }));
          setLive((l) => (l ? { ...l, sentences: pl.timeline.sentences } : l));
          if (pl.stream.failed && !pl.failNoted) { pl.failNoted = true; vdispatch({ type: 'fail', kind: 'speak-failed' }); providers.current.tts = simulatedTts(); }
        }
        const { due, words, done } = advance(pl, t);
        // Word-to-stroke offset: how late each word-anchored stroke appeared after its word.
        for (const e of due) if (e.anchor === 'word') offsets.current.push(t - (pl.startedAt + e.t));
        if (due.length) {
          let b = boardRef.current;
          for (const e of due) b = fire(b, turnSteps.current[e.i], pl.startedAt + e.t);
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
    const next = applyStep(b, step, at, boardHRef.current);
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
    const tl = buildTimeline(T.steps, { speech: (_, k) => T.stream.timing(k) });
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
    T.stream = providers.current.tts.open();
    T.said = 0;
    T.stream.ready.then((startAt) => firstSound(T, startAt), (err) => {
      if (T.stopped || turnRef.current !== T) return;
      // No voice: carry on silently in words, from the same place.
      console.warn('voice-tutor: voice failed', err?.message);
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
      history: s.transcript.map((h) => ({ who: h.who, text: h.text })),
      elapsed_s: Math.round((clock() - startedAt.current) / 1000), turn_index: s.turns, phase: s.phase,
      // The voice, priced into the caps on the server: will the words be spoken, and how much the child spoke.
      voice: !!providers.current.tts.hasAudio && !silentVoice.current && mode === 'remote', audio_in_s: audioS,
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
    try { unlocked = await providers.current.tts.unlock(); } catch { unlocked = { ok: false, reason: 'audio-blocked' }; }
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
      for (const e of r.due) b = fire(b, turnSteps.current[e.i], t - e.dur);
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
    dispatch({ type: 'child_said', text: msg, at: clock() });
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
      onPartial: (t) => vdispatch({ type: 'partial', text: t }),
      onFinal: (t, seconds) => {
        listenRef.current = null;
        audioIn.current += Number(seconds) || 0;
        vdispatch({ type: 'heard' });
        if (!t) { setSnapNote('HOREB did not hear anything. Tap Talk and try again, or type.'); return; }
        dispatch({ type: 'child_said', text: t, at: clock() });
        delays.current = { childDone: clock() };
        request({ message: t, heard });
      },
      onError: (kind) => { listenRef.current = null; vdispatch({ type: 'fail', kind }); },
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
  const pastLines = session.transcript.map((h, i) => ({ ...h, i, k: lineKey(h, i) })).filter((h) => !goneLines.has(h.k) && !(live && h.who === 'tutor' && h.turn === session.turns && !h.cut));

  return (
    <div className="vt-root h-[100dvh] flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      <style>{CSS}</style>
      <header className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border-b border-slate-200 text-[12px] sm:text-[13px] whitespace-nowrap">
        <span className="font-extrabold tracking-tight">HOREB tutor</span>
        <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: '#FFE3EE', color: '#C2255C' }}>Adult testers only</span>
        <span className="hidden md:inline text-slate-500">Prototype.{started ? (silentVoice.current ? ' Silent: words appear at speaking pace.' : ` Voice: ${voiceName}.`) : ''}</span>
        <span className="ml-auto font-bold text-slate-600">{mode === 'remote' ? 'Live' : 'Practice (fixed script)'}</span>
        {mode === 'remote' ? <span className="tabular-nums text-slate-500">US${session.cost.sessionUsd.toFixed(2)}</span> : null}
        <button type="button" onClick={() => setTester((x) => !x)} className="px-2 py-0.5 rounded-full border border-slate-300 font-bold text-slate-700">Tester</button>
      </header>

      <main className="flex-1 min-h-0 flex flex-col landscape:flex-row gap-2 p-2">
        <section className="relative min-h-0 portrait:shrink-0 landscape:flex-1 flex flex-col items-center justify-center gap-1.5">
          <div className="vt-board relative w-full rounded-2xl overflow-hidden bg-white min-h-0" style={{ aspectRatio: `1000 / ${boardH}`, maxHeight: started ? 'calc(100% - 46px)' : '100%' }}>
            <Board ref={svgRef} board={board} now={now} H={boardH} inkOn={started && session.status !== 'ended'} tool={tool} onInk={onInk} />
            {!started ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-3">
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
            {session.ended ? (
              <div className="absolute left-3 right-3 bottom-3 rounded-xl bg-white/95 border border-slate-200 p-3 text-sm">
                <span className="font-extrabold">Lesson finished.</span> {session.ended.summary}
              </div>
            ) : null}
          </div>
          {started ? (
            <InkBar tool={tool} setTool={setTool} canUndo={board.childInk.undo.length > 0} hasInk={hasInk(board.childInk)}
              onUndo={() => onInk([{ type: 'undo' }])} onClear={() => onInk([{ type: 'clear' }])}
              onCheck={() => takePicture('check')} checking={session.looking} note={snapNote} disabled={session.status === 'ended'} />
          ) : null}
        </section>

        <aside className="min-h-0 flex-1 landscape:flex-none landscape:w-[300px] lg:landscape:w-[340px] flex flex-col gap-2">
          <div className="flex gap-2 min-h-0 flex-1 landscape:flex-col">
            <div className={`vt-mascot shrink-0 self-start landscape:self-stretch rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center px-2 py-2 landscape:flex-row landscape:gap-3 landscape:justify-start landscape:px-3 landscape:py-1.5 vt-${mascot}`} aria-live="polite">
              <HorebBot size={56} mood={voice.listening ? 'listening' : mascot} />
              <div className="text-center landscape:text-left">
                <div className="text-[12px] font-extrabold text-violet-700 leading-tight">{voice.listening ? 'Listening to you' : session.looking ? 'Looking' : MASCOT_LABEL[mascot]}</div>
                <div className="hidden landscape:block text-[11px] text-slate-500 leading-tight">{session.phase ? PHASE_LABEL[session.phase] : 'Ready'}</div>
              </div>
            </div>
            <div className="vt-strip min-h-0 flex-1 rounded-2xl bg-white border border-slate-200 overflow-hidden px-3 py-2 text-[16px] leading-snug flex flex-col">
              <Phases phase={session.phase} />
              <div ref={linesRef} className="vt-lines min-h-0 flex-1 overflow-hidden flex flex-col justify-end">
              {pastLines.map((h) => (
                <p key={h.k} data-k={h.k} className={h.snap ? 'vt-child vt-snap' : h.who === 'child' ? 'vt-child' : 'vt-tutor'}>{h.text}</p>
              ))}
              {live ? live.sentences.map((s, k) => (live.words[k] > 0 && !goneLines.has(`t${session.turns}:${s.text}`) ? (
                <p key={`t${session.turns}:${s.text}`} data-k={`t${session.turns}:${s.text}`} className="vt-tutor vt-now">
                  {s.words.slice(0, live.words[k]).map((w, i) => (
                    <span key={i} className={i === live.words[k] - 1 && live.words[k] < s.words.length ? 'vt-word' : undefined}>{w.word} </span>
                  ))}
                </p>
              ) : null)) : null}
              {voice.listening ? <p className="vt-child vt-partial">{voice.partial || 'Listening...'}</p> : null}
              {session.error ? <p className="text-[13px] text-red-700">{session.error}</p> : null}
              </div>
            </div>
          </div>

          <form className="shrink-0 rounded-2xl bg-white border border-slate-200 p-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <div className="text-[13px] font-bold text-violet-700 px-1 pb-1 min-h-[1.4rem] truncate">{ask ? ask.prompt : ''}</div>
            {ask?.form === 'choice' ? (
              <div className="grid grid-cols-2 gap-1.5 pb-1.5">
                {ask.choices.map((c) => <button key={c} type="button" onClick={() => send(c)} className="rounded-xl border border-slate-300 px-2 py-1.5 text-sm font-bold text-left">{c}</button>)}
              </div>
            ) : null}
            {voice.message ? (
              <div className="vt-fallback flex items-center gap-2 text-[13px] font-bold rounded-xl px-3 py-1.5 mb-1.5" role="status">
                <span>{voice.message}</span>
                {voiceOn && voice.mode !== 'voice' && providers.current?.stt ? <button type="button" className="ml-auto underline" onClick={() => vdispatch({ type: 'retry' })}>Try voice again</button> : null}
              </div>
            ) : null}
            <div className="flex gap-2">
              {started && providers.current?.stt && canListen(voice) ? (
                <button type="button" onClick={() => talk()} disabled={session.status === 'ended' || session.status === 'thinking'} aria-pressed={voice.listening}
                  className={`vt-talk shrink-0 rounded-full px-4 font-extrabold flex items-center gap-1.5 disabled:opacity-40 ${voice.listening ? 'vt-talk-on' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3 8a5 5 0 0 0 10 0M8 13v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  {voice.listening ? 'Done' : 'Talk'}
                </button>
              ) : null}
              <input value={input} onChange={(e) => setInput(e.target.value)} disabled={!started || session.status === 'ended'}
                placeholder={!started ? 'Start the lesson first' : ask ? 'Type your answer' : session.status === 'speaking' ? 'Type to stop HOREB and talk' : 'Type to HOREB'}
                className="flex-1 min-w-0 rounded-full border border-slate-300 px-4 py-2 text-[16px] outline-none focus:border-violet-500" maxLength={300} inputMode="text" autoComplete="off" />
              <button type="submit" disabled={!input.trim() || session.status === 'thinking' || session.status === 'ended'} className="rounded-full bg-amber-400 px-5 font-extrabold disabled:opacity-40">Send</button>
            </div>
            {nudge && session.status === 'listening' ? <div className="text-[12px] text-slate-500 px-2 pt-1">Take your time, or tell HOREB if you would like it another way.</div> : null}
          </form>
        </aside>
      </main>

      {tester ? (
        <TesterPanel session={session} board={board} mode={mode} pics={pics} delays={delayLog} offsets={offsets.current} voice={voice} voiceName={providers.current ? `Voice: ${silentVoice.current ? 'none, silent (timed)' : voiceName}${providers.current.tts.timingMode ? `; word times ${providers.current.tts.timingMode === 'boundary' ? 'from the voice itself' : 'estimated from its pace'}` : ''}. Listening: ${providers.current.stt?.name || 'none (typing)'}.` : ''} onClose={() => setTester(false)}
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
// The child's tools, under the board: pen, eraser (their own ink only), undo,
// clear their ink, and Check my work. Big enough for a finger.
function InkBar({ tool, setTool, canUndo, hasInk: any, onUndo, onClear, onCheck, checking, note, disabled }) {
  const btn = 'h-10 min-w-10 px-3 rounded-full border text-[13px] font-bold flex items-center gap-1.5 disabled:opacity-40';
  return (
    <div className="vt-inkbar w-full shrink-0 flex items-center gap-1.5 flex-wrap" role="toolbar" aria-label="Your tools">
      <button type="button" aria-pressed={tool === 'pen'} disabled={disabled} onClick={() => setTool('pen')} className={`${btn} ${tool === 'pen' ? 'bg-white border-2' : 'bg-white/60 border-slate-300'}`} style={tool === 'pen' ? { borderColor: CHILD_INK, color: CHILD_INK } : undefined}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 14l1-4 8-8 3 3-8 8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>Pen
      </button>
      <button type="button" aria-pressed={tool === 'eraser'} disabled={disabled} onClick={() => setTool('eraser')} className={`${btn} ${tool === 'eraser' ? 'bg-white border-2 border-slate-700' : 'bg-white/60 border-slate-300'}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 14h8M3 10l6-7 5 5-5 6H6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>Eraser
      </button>
      <button type="button" disabled={disabled || !canUndo} onClick={onUndo} className={`${btn} bg-white border-slate-300`}>Undo</button>
      <button type="button" disabled={disabled || !any} onClick={onClear} className={`${btn} bg-white border-slate-300 hidden sm:flex`}>Clear mine</button>
      {note ? <span className="text-[12px] text-slate-500">{note}</span> : null}
      <button type="button" disabled={disabled || !any || checking} onClick={onCheck} className={`${btn} ml-auto bg-amber-400 border-amber-400 font-extrabold`}>{checking ? 'Looking...' : 'Check my work'}</button>
    </div>
  );
}

function TesterPanel({ session, board, mode, pics = [], delays = [], offsets = [], voice = null, voiceName = '', onExample = null, onFail = null, onClose }) {
  return (
    <div className="fixed inset-x-2 bottom-2 top-12 sm:left-auto sm:w-[400px] z-50 bg-white rounded-2xl border border-slate-300 overflow-y-auto p-4 text-sm">
      <div className="flex items-center"><b className="text-base">Tester view</b><button type="button" className="ml-auto font-bold" onClick={onClose}>Close</button></div>
      <p className="text-slate-500 mt-1">Mode: {mode === 'remote' ? 'live model' : 'scripted'}. Nothing is saved yet (storage and review come in milestone 4).</p>
      <h3 className="font-extrabold mt-3">Lesson</h3>
      <p>Target: {session.target ? skillName(session.target) : 'not chosen yet'}</p>
      <p>Weakest prerequisite: {session.prerequisite ? skillName(session.prerequisite) : 'none'}</p>
      <p>Part: {session.phase || 'not started'}. Turns: {session.turns}. Interruptions: {session.interruptions}.</p>
      <p>Spent: US${session.cost.sessionUsd.toFixed(3)} this session, US${session.cost.dayUsd.toFixed(3)} today (caps US$1.50 and US$3).</p>
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
.vt-board { box-shadow: inset 0 0 0 1px #E2DED0; }
.vt-tutor { margin: 0 0 .35rem; color: #1D1D27; font-weight: 600; }
.vt-tutor.vt-now { color: #3B17B0; }
.vt-child { margin: 0 0 .35rem auto; width: fit-content; max-width: 85%; background: #FFF0D4; color: #6B3D00; border-radius: 14px; padding: .2rem .65rem; font-weight: 700; }
.vt-snap { background: #E0F2F1; color: #0E5F66; }
.vt-snap::before { content: ''; display: inline-block; width: .7em; height: .7em; margin-right: .35em; border: 2px solid currentColor; border-radius: 2px; vertical-align: -.05em; }
.vt-partial { opacity: .65; font-style: italic; }
.vt-talk { background: #ECE8FF; color: #3B17B0; border: 2px solid #6D3FD6; }
.vt-talk-on { background: #6D3FD6; color: #fff; animation: vt-glow 1.2s ease-in-out infinite; }
.vt-fallback { background: #FFF0D4; color: #6B3D00; font-size: 12px; line-height: 1.3; }
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
