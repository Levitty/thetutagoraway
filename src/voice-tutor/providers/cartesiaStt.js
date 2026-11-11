// ============================================================================
// LISTENING (live mode): Cartesia Ink speech-to-text over a WebSocket, straight
// from the browser with the short-lived token from voice-tutor-token (the key
// stays on the server). Same key and token as the tutor's voice.
//
// Press to talk: one tap opens the microphone (browsers need a tap) and starts
// one utterance. Audio is sent only once the child starts speaking (with the
// 0.4 s just before, so the first word is not clipped), until the end of
// speech (0.8 s quiet, a second tap, or 30 s); then "finalize" and the final
// words. 8 s with no speech ends it with nothing. Echo cancellation is asked
// for, since the tutor may be speaking.
// ============================================================================
import { sttUrl, cartesiaSttEvent, pcm16, speechEnd, rmsOf, bargeDetector } from './voice.js';
import { CHILD_LISTEN, MATHS_KEYTERMS, keytermsText, endSilenceMs } from '../childVoice.js';

export const NO_SPEECH_MS = CHILD_LISTEN.noSpeechMs;
export const MAX_UTTERANCE_MS = CHILD_LISTEN.maxUtteranceMs;
export const FLUSH_WAIT_MS = 1500;
const PREROLL_FRAMES = 3;

/** @param {{ getToken: () => Promise<{ token:string, version:string }> }} o */
export function cartesiaStt({ getToken }) {
  let stream = null;
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
    async prepare() { await mic(); },
    /** h: { onSpeech(), onPartial(text), onPause(), onFinal(text, seconds), onError(kind), pace() -> { level } } */
    start(h = {}) {
      let done = false;
      let ws = null; let ctx = null; let node = null; let src = null;
      let finals = ''; let partial = '';
      let speechAt = 0; let flushTimer = null; let noSpeech = null; let hard = null;
      const pre = [];
      // A child thinks aloud: the end of their turn waits longer when what they have said sounds unfinished or very short.
      const vad = speechEnd({ silenceMs: () => endSilenceMs(`${finals}${partial}`, h.pace?.() || {}), pauseMs: CHILD_LISTEN.pauseNudgeMs });
      const seconds = () => (speechAt ? (performance.now() - speechAt) / 1000 : 0);
      const cleanup = () => {
        clearTimeout(flushTimer); clearTimeout(noSpeech); clearTimeout(hard);
        try { node?.disconnect(); src?.disconnect(); ctx?.close(); } catch { /* closed */ }
        try { if (ws?.readyState === WebSocket.OPEN) ws.send('close'); } catch { /* closed */ }
        setTimeout(() => { try { ws?.close(); } catch { /* closed */ } }, 500);
      };
      const finish = () => { if (done) return; done = true; const s = seconds(); cleanup(); h.onFinal?.(finals.trim(), s); };
      const fail = (kind) => { if (done) return; done = true; cleanup(); h.onError?.(kind); };
      const finalize = () => {
        if (done || flushTimer) return;
        try { node?.disconnect(); } catch { /* stopped */ }
        if (!speechAt || ws?.readyState !== WebSocket.OPEN) { finish(); return; }
        ws.send('finalize');
        flushTimer = setTimeout(finish, FLUSH_WAIT_MS);
      };
      (async () => {
        let s; let tok;
        try { s = await mic(); } catch (e) { fail(e.kind || 'listen-failed'); return; }
        try { tok = await getToken(); } catch (e) { fail(e.kind === 'token-refused' ? 'token-refused' : 'listen-failed'); return; }
        if (done) return;
        try { ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 }); } catch { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
        ws = new WebSocket(sttUrl({ token: tok.token, version: tok.version, rate: Math.round(ctx.sampleRate), model: CHILD_LISTEN.model, language: CHILD_LISTEN.language, maxSilenceSecs: CHILD_LISTEN.maxSilenceSecs, keyterms: keytermsText(MATHS_KEYTERMS) }));
        ws.binaryType = 'arraybuffer';
        ws.onerror = () => fail('listen-failed');
        ws.onclose = () => { if (!done) { if (finals.trim()) finish(); else fail('listen-failed'); } };
        ws.onmessage = (e) => {
          let m; try { m = JSON.parse(e.data); } catch { return; }
          const ev = cartesiaSttEvent(m);
          if (!ev) return;
          if (ev.kind === 'partial') { partial = ev.text; h.onPartial?.(`${finals}${partial}`.trim()); }
          if (ev.kind === 'final') { finals += ev.text; partial = ''; h.onPartial?.(finals.trim()); }
          if (ev.kind === 'flushed' || ev.kind === 'done') finish();
          if (ev.kind === 'error') fail('listen-failed');
        };
        src = ctx.createMediaStreamSource(s);
        node = ctx.createScriptProcessor(2048, 1, 1);
        node.onaudioprocess = (e) => {
          if (done) return;
          const f = e.inputBuffer.getChannelData(0);
          const bytes = pcm16(f);
          const said = vad.feed(rmsOf(f), (f.length / ctx.sampleRate) * 1000);
          if (said === 'speech' && !speechAt) {
            speechAt = performance.now(); clearTimeout(noSpeech); h.onSpeech?.();
            if (ws.readyState === WebSocket.OPEN) pre.splice(0).forEach((b) => ws.send(b));
          }
          if (!speechAt) { pre.push(bytes); if (pre.length > PREROLL_FRAMES) pre.shift(); return; }
          if (ws.readyState === WebSocket.OPEN) { pre.splice(0).forEach((b) => ws.send(b)); ws.send(bytes); } else pre.push(bytes);
          if (said === 'pause') h.onPause?.();
          if (said === 'end') finalize();
        };
        src.connect(node); node.connect(ctx.destination);
        noSpeech = setTimeout(finish, NO_SPEECH_MS);
        hard = setTimeout(finalize, MAX_UTTERANCE_MS);
      })();
      return { stop: finalize, cancel() { done = true; cleanup(); } };
    },
    /**
     * Listen for the child speaking over HOREB (no tap): calls onSpeech once when the microphone
     * holds above the barge-in level for two frames (about a quarter of a second). Needs the
     * microphone already allowed (prepare()); returns { stop() }.
     */
    watch({ onSpeech } = {}) {
      let ctx = null; let node = null; let src = null; let live = true;
      const det = bargeDetector();
      const stop = () => { live = false; try { node?.disconnect(); src?.disconnect(); ctx?.close(); } catch { /* closed */ } };
      (async () => {
        let s; try { s = await mic(); } catch { return; }
        if (!live) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        src = ctx.createMediaStreamSource(s);
        node = ctx.createScriptProcessor(2048, 1, 1);
        node.onaudioprocess = (e) => { if (live && det.feed(rmsOf(e.inputBuffer.getChannelData(0)))) { stop(); onSpeech?.(); } };
        src.connect(node); node.connect(ctx.destination);
      })();
      return { stop };
    },
    close() { stream?.getTracks().forEach((t) => t.stop()); stream = null; },
  };
}

export default { cartesiaStt };
