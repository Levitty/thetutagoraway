// ============================================================================
// LISTENING: Deepgram live transcription, straight from the browser with a
// short-lived token from the voice-tutor-token function (the key stays on
// the server).
//
// Press to talk: one tap opens the microphone (browsers need a tap) and starts
// one utterance; audio is sent only from then until end of speech (Deepgram's
// endpointing / UtteranceEnd), a second tap, 8 s of silence, or 30 s. Then the
// microphone stops sending. Partial words come back as the child speaks.
// Echo cancellation is asked for, since the tutor may be speaking.
// ============================================================================
import { deepgramEvent, DEEPGRAM_URL } from './voice.js';

export const SILENCE_MS = 8000;
export const MAX_UTTERANCE_MS = 30000;

/** @param {{ getToken: () => Promise<{ token:string, url?:string }> }} o */
export function deepgramStt({ getToken }) {
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
    name: 'deepgram',
    listens: true,
    /** From a tap: asks for the microphone once. */
    async prepare() { await mic(); },
    /**
     * h: { onSpeech(), onPartial(text), onFinal(text, seconds), onError(kind) }
     * @returns {{ stop():void, cancel():void }}
     */
    start(h = {}) {
      let done = false;
      let ws = null; let rec = null; let startedAt = 0;
      const queue = [];
      let finals = '';
      let silence = null; let hard = null; let finalizeWait = null;
      const fail = (kind) => { if (done) return; done = true; cleanup(); h.onError?.(kind); };
      const finish = () => {
        if (done) return;
        done = true;
        const seconds = startedAt ? (performance.now() - startedAt) / 1000 : 0;
        cleanup();
        h.onFinal?.(finals.trim(), seconds);
      };
      const cleanup = () => {
        clearTimeout(silence); clearTimeout(hard); clearTimeout(finalizeWait);
        try { if (rec && rec.state !== 'inactive') rec.stop(); } catch { /* stopped */ }
        try { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'CloseStream' })); } catch { /* closed */ }
        setTimeout(() => { try { ws?.close(); } catch { /* closed */ } }, 500);
      };
      const quiet = () => { clearTimeout(silence); silence = setTimeout(finish, SILENCE_MS); };
      (async () => {
        let tok; let s;
        try { s = await mic(); } catch (e) { fail(e.kind || 'listen-failed'); return; }
        try { tok = await getToken(); } catch (e) { fail(e.kind === 'token-refused' ? 'token-refused' : 'listen-failed'); return; }
        if (done) return;
        // A temporary token goes in the WebSocket subprotocol, as Deepgram's own browser SDK does.
        ws = new WebSocket(tok.url || DEEPGRAM_URL, ['bearer', tok.token]);
        ws.onopen = () => { while (queue.length) ws.send(queue.shift()); };
        ws.onerror = () => fail('listen-failed');
        ws.onclose = () => { if (!done) { if (finals.trim()) finish(); else fail('listen-failed'); } };
        ws.onmessage = (e) => {
          let m; try { m = JSON.parse(e.data); } catch { return; }
          const ev = deepgramEvent(m);
          if (!ev) return;
          if (ev.kind === 'speech') { quiet(); h.onSpeech?.(); }
          if (ev.kind === 'partial') { quiet(); h.onPartial?.(`${finals} ${ev.text}`.trim()); }
          if (ev.kind === 'final') {
            if (ev.text) { finals = `${finals} ${ev.text}`.trim(); quiet(); h.onPartial?.(finals); }
            if (ev.speechFinal && finals) finish();
          }
          if (ev.kind === 'end' && finals) finish();
          if (ev.kind === 'error') fail('listen-failed');
        };
        const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((t) => window.MediaRecorder?.isTypeSupported?.(t));
        if (!window.MediaRecorder || !type) { fail('listen-failed'); return; }
        rec = new MediaRecorder(s, { mimeType: type });
        rec.ondataavailable = (e) => { if (!e.data?.size) return; if (ws.readyState === WebSocket.OPEN) ws.send(e.data); else queue.push(e.data); };
        rec.start(200);
        startedAt = performance.now();
        quiet();
        hard = setTimeout(finish, MAX_UTTERANCE_MS);
      })();
      return {
        // A second tap: flush what was said, then finish.
        stop() {
          if (done) return;
          try { if (rec && rec.state !== 'inactive') rec.stop(); } catch { /* stopped */ }
          try { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'Finalize' })); } catch { /* closed */ }
          finalizeWait = setTimeout(finish, 1500);
        },
        cancel() { done = true; cleanup(); },
      };
    },
    close() { stream?.getTracks().forEach((t) => t.stop()); stream = null; },
  };
}

export default { deepgramStt };
