// ============================================================================
// LISTENING (live mode): Cartesia Ink speech-to-text over a WebSocket, straight
// from the browser with the short-lived token from voice-tutor-token (the key
// stays on the server). Same key and token as the tutor's voice.
//
// One listening session for the whole lesson (owner, 12 Nov 2026: "it needs to
// constantly be listening"). open() takes the microphone once and keeps one
// sound graph running until the lesson ends. The page sets the mode:
//   'child'  the child's turn (and while HOREB thinks): every frame goes to Ink, from
//            the first one (a quiet microphone is still heard). The end of an utterance
//            is 2 to 3.4 s of quiet after the last loud frame or the last word Ink
//            heard (childVoice.js endSilenceMs: longer when it sounds unfinished);
//            then "finalize", the final words, and a new connection opens at once for
//            the next utterance. Thinking aloud is held, never sent (utteranceGate).
//   'tutor'  HOREB is speaking: nothing is sent (its own voice would be heard). The
//            microphone is watched at the barge-in level (higher than speech, held for
//            about a quarter of a second, so echo, a click or a cough does not count);
//            when a real voice holds, onBargeIn() and the child's words are heard from
//            the frames just before (the start is not clipped).
//   'off'    muted, or the lesson is over: nothing is sent or watched.
// Echo cancellation is asked for, since the tutor may be speaking.
// ============================================================================
import { sttUrl, cartesiaSttEvent, pcm16, speechEnd, rmsOf, bargeDetector } from './voice.js';
import { CHILD_LISTEN, MATHS_KEYTERMS, keytermsText, endSilenceMs, utteranceGate } from '../childVoice.js';

export const MAX_UTTERANCE_MS = CHILD_LISTEN.maxUtteranceMs;
export const FLUSH_WAIT_MS = 1500;
const BUFFER_FRAMES = 30;      // sound kept while the connection opens (2048-sample frames: about 4 s at 16 kHz)
const BARGE_PREROLL = 6;       // frames before a barge-in that go with it (about 0.75 s)
const MAX_FAILS = 3;           // connections failing in a row before listening is called broken

/** @param {{ getToken: () => Promise<{ token:string, version:string }> }} o */
export function cartesiaStt({ getToken }) {
  let stream = null;
  // What the listening saw, for the tester view: did sound arrive, how loud, did the service answer (12 Nov 2026).
  const stats = { frames: 0, loudest: 0, socket: 'not opened', said: '', heard: 0, ctx: '', sentS: 0, utterances: 0 };
  const mic = async () => {
    if (stream && stream.getAudioTracks().some((t) => t.readyState === 'live')) return stream;
    if (!navigator.mediaDevices?.getUserMedia) { const e = new Error('no microphone'); e.kind = 'mic-missing'; throw e; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
    } catch (err) {
      const e = new Error(err.message);
      e.kind = err.name === 'NotAllowedError' || err.name === 'SecurityError' ? 'mic-denied' : err.name === 'NotFoundError' ? 'mic-missing' : 'listen-failed';
      throw e;
    }
    return stream;
  };

  return {
    name: 'cartesia-ink',
    listens: true,
    continuous: true,
    stats,
    async prepare() { await mic(); },
    /**
     * The lesson's listening. h: { onSpeech(), onPartial(text), onPause(), onUtterance(text, seconds),
     * onNoise(text), onBargeIn(), onError(kind, detail), pace() -> { level } }.
     * Returns { setMode('child'|'tutor'|'off'), close() }.
     */
    open(h = {}) {
      let mode = 'off'; let closed = false; let fails = 0;
      let ctx = null; let src = null; let node = null; let rate = 16000;
      let seg = null;              // the utterance being heard: { ws, open, finals, partial, speechAt, flushTimer, hard, done, pre }
      const recent = [];           // the last few frames, for a barge-in
      const barge = bargeDetector();
      const gate = utteranceGate({ onSend: (t, s) => h.onUtterance?.(t, s), onDrop: (t) => h.onNoise?.(t) });
      const vad = speechEnd({ silenceMs: () => endSilenceMs(`${gate.held()} ${seg ? `${seg.finals}${seg.partial}` : ''}`, h.pace?.() || {}), pauseMs: CHILD_LISTEN.pauseNudgeMs });

      const closeWs = (ws) => {
        try { if (ws?.readyState === WebSocket.OPEN) ws.send('close'); } catch { /* closed */ }
        setTimeout(() => { try { ws?.close(); } catch { /* closed */ } }, 500);
      };
      const endSeg = (s, deliver) => {
        if (!s || s.done) return;
        s.done = true; clearTimeout(s.flushTimer); clearTimeout(s.hard);
        closeWs(s.ws);
        if (seg === s) seg = null;
        vad.reset();
        if (!deliver) return;
        const said = s.finals.trim();
        const secs = s.speechAt ? (performance.now() - s.speechAt) / 1000 : 0;
        if (said) { stats.utterances += 1; gate.final(said, secs); } else if (s.speechAt) gate.final('', secs);
      };
      const finalize = (s) => {
        if (!s || s.done || s.flushTimer) return;
        if (!s.open) { endSeg(s, true); return; }
        try { s.ws.send('finalize'); } catch { endSeg(s, true); return; }
        s.flushTimer = setTimeout(() => endSeg(s, true), FLUSH_WAIT_MS);
      };
      const spoke = (s) => {
        if (s.speechAt) return;
        s.speechAt = performance.now();
        gate.speech();
        clearTimeout(s.hard);
        s.hard = setTimeout(() => finalize(s), MAX_UTTERANCE_MS);
        h.onSpeech?.();
      };
      const openSeg = (pre = []) => {
        const s = { ws: null, open: false, finals: '', partial: '', speechAt: 0, flushTimer: null, hard: null, done: false, pre: [...pre] };
        seg = s;
        (async () => {
          let tok;
          try { tok = await getToken(); } catch (e) { s.done = true; if (seg === s) seg = null; fail(e.kind === 'token-refused' ? 'token-refused' : 'listen-failed', e?.message); return; }
          if (s.done || closed) return;
          stats.socket = 'opening';
          const ws = new WebSocket(sttUrl({ token: tok.token, version: tok.version, rate, model: CHILD_LISTEN.model, language: CHILD_LISTEN.language, maxSilenceSecs: CHILD_LISTEN.maxSilenceSecs, keyterms: keytermsText(MATHS_KEYTERMS) }));
          s.ws = ws;
          ws.binaryType = 'arraybuffer';
          ws.onopen = () => {
            if (s.done) { closeWs(ws); return; }
            s.open = true; stats.socket = 'open'; fails = 0;
            for (const b of s.pre.splice(0)) { ws.send(b); stats.sentS += b.byteLength / 2 / rate; }
          };
          ws.onerror = () => { stats.socket = 'failed'; };
          ws.onclose = (ce) => {
            if (!s.open) stats.socket = `closed before opening (code ${ce?.code ?? '?'})`;
            if (s.done) return;
            // Closed under us: what was heard is kept; a connection that never worked counts as a failure.
            if (!s.open) { s.done = true; if (seg === s) seg = null; fails += 1; if (fails >= MAX_FAILS) fail('listen-failed', `listening closed (code ${ce?.code ?? '?'}${ce?.reason ? `, ${ce.reason}` : ''})`); return; }
            endSeg(s, true);
          };
          ws.onmessage = (e) => {
            let m; try { m = JSON.parse(e.data); } catch { return; }
            const ev = cartesiaSttEvent(m);
            if (!ev || s.done) return;
            if ((ev.kind === 'partial' || ev.kind === 'final') && ev.text.trim()) { spoke(s); vad.heard(); }
            if (ev.kind === 'partial') { s.partial = ev.text; h.onPartial?.(`${gate.held()} ${s.finals}${s.partial}`.trim()); }
            if (ev.kind === 'final') { s.finals += ev.text; stats.heard += 1; stats.said = s.finals.trim().slice(0, 80); s.partial = ''; h.onPartial?.(`${gate.held()} ${s.finals}`.trim()); }
            if (ev.kind === 'flushed' || ev.kind === 'done') endSeg(s, true);
            if (ev.kind === 'error') { fails += 1; endSeg(s, true); if (fails >= MAX_FAILS) fail('listen-failed', `listening service: ${String(m.message || m.error || m.title || JSON.stringify(m)).slice(0, 140)}`); }
          };
        })();
        return s;
      };
      const fail = (kind, detail) => { if (closed) return; mode = 'off'; endSeg(seg, false); h.onError?.(kind, detail); };

      const onFrame = (f) => {
        const rms = rmsOf(f);
        stats.frames += 1; stats.loudest = Math.max(stats.loudest, rms);
        const bytes = pcm16(f);
        recent.push(bytes); if (recent.length > BARGE_PREROLL) recent.shift();
        if (mode === 'off') return;
        if (mode === 'tutor') {
          if (barge.feed(rms)) {
            // A real voice over HOREB: it stops (the page), and this is the start of the child's words.
            mode = 'child'; barge.reset();
            h.onBargeIn?.();
            const s = openSeg(recent.splice(0));
            spoke(s); vad.heard();
          }
          return;
        }
        // The child's turn: every frame goes to the service.
        const s = seg && !seg.flushTimer ? seg : openSeg();
        if (s.open) { s.ws.send(bytes); stats.sentS += f.length / rate; } else { s.pre.push(bytes); if (s.pre.length > BUFFER_FRAMES) s.pre.shift(); }
        const said = vad.feed(rms, (f.length / rate) * 1000);
        if (said === 'speech') spoke(s);
        if (!s.speechAt) return;
        if (said === 'pause') h.onPause?.();
        if (said === 'end') finalize(s);
      };

      (async () => {
        let st;
        try { st = await mic(); } catch (e) { fail(e.kind || 'listen-failed', `microphone: ${e?.message || e}`); return; }
        if (closed) return;
        try { ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 }); } catch { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
        // A context made after an await may start suspended: then no sound ever reaches the detector.
        try { if (ctx.state !== 'running') await ctx.resume(); } catch { /* reported in the tester view */ }
        rate = Math.round(ctx.sampleRate);
        stats.ctx = ctx.state;
        src = ctx.createMediaStreamSource(st);
        node = ctx.createScriptProcessor(2048, 1, 1);
        node.onaudioprocess = (e) => { if (!closed) onFrame(e.inputBuffer.getChannelData(0)); };
        src.connect(node); node.connect(ctx.destination);
      })();

      return {
        get mode() { return mode; },
        setMode(m) {
          if (closed || m === mode) return;
          const was = mode; mode = m;
          barge.reset();
          if (m === 'child') return;
          // Leaving the child's turn: words being spoken are finished and kept (HOREB is about to speak over
          // them: the page answers them); a connection with nothing heard is closed.
          if (was === 'child' && seg) { if (seg.speechAt) finalize(seg); else endSeg(seg, false); }
          if (m === 'off') gate.clear();
        },
        close() {
          closed = true; mode = 'off'; endSeg(seg, false); gate.clear();
          try { node?.disconnect(); src?.disconnect(); ctx?.close(); } catch { /* closed */ }
        },
      };
    },
    close() { stream?.getTracks().forEach((t) => t.stop()); stream = null; },
  };
}

export default { cartesiaStt };
