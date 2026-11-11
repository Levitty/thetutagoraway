// ============================================================================
// THE TUTOR'S VOICE: Cartesia Sonic over a WebSocket, straight from the
// browser with a short-lived access token from the voice-tutor-token function
// (the API key never leaves the server).
//
// speak(texts) sends every sentence of the turn (one context each, on one
// socket) and starts the first sound on the first audio chunk. Word timestamps
// stream in beside the audio; the page rebuilds the board timeline from them as
// they come, so a stroke starts as its word is heard and never before. The
// board's clock (clock()) is the audio clock less the output latency: what the
// child hears. stop() silences everything at once (barge-in).
// ============================================================================
import { cartesiaWords, pcmF32FromBase64, sentenceTiming } from './voice.js';
import { SENTENCE_GAP_MS, speakingTimes } from '../timeline.js';

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `c${Date.now()}${Math.random().toString(36).slice(2)}`);
export const FIRST_CHUNK_TIMEOUT_MS = 6000;
export const LEAD_MS = 40;   // scheduling lead for the first chunk

/** @param {{ getToken: () => Promise<{ token:string, url:string, model:string, voice:string, version:string, sample_rate:number, expires_in:number }> }} o */
export function cartesiaTts({ getToken }) {
  let ctx = null;
  let ws = null;
  let cfg = null;
  let cfgUntil = 0;
  const routes = new Map();   // context_id -> handler(message)
  const playing = new Set();
  const streams = new Set();

  const audio = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };
  // What the child hears lags the audio clock by the output latency; the board follows the ear.
  const heardNow = () => (ctx ? (ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0)) * 1000 : performance.now());
  const socket = async () => {
    if (!cfg || Date.now() > cfgUntil) { cfg = await getToken(); cfgUntil = Date.now() + (Number(cfg.expires_in) || 60) * 1000 - 5000; if (ws) { ws.close(); ws = null; } }
    if (ws && ws.readyState === WebSocket.OPEN) return ws;
    ws = new WebSocket(`${cfg.url}?access_token=${encodeURIComponent(cfg.token)}&cartesia_version=${encodeURIComponent(cfg.version)}`);
    ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch { return; } routes.get(m.context_id)?.(m); };
    ws.onclose = () => { for (const h of routes.values()) h({ type: 'error', message: 'voice connection closed' }); routes.clear(); ws = null; };
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = () => reject(new Error('voice connection failed')); });
    ws.onerror = null;
    return ws;
  };

  return {
    name: 'cartesia',
    hasAudio: true,
    clock: heardNow,
    /** Call from a tap: browsers only allow audio after one. */
    async unlock() { await audio().resume(); },
    /**
     * Speak the turn's sentences. All are sent at once (one context each); the first
     * sound starts on sentence 1's first audio chunk; sentence k plays right after
     * sentence k-1 plus the timeline's gap, so word times line up with the board.
     */
    speak(texts) {
      const c = audio();
      const rate = () => cfg.sample_rate;
      const S = texts.map((text) => ({ text, words: [], samples: 0, duration: null, complete: false, offset: null, queue: [], id: uid() }));
      let version = 0; let startAt = null; let stopped = false;
      let readyRes; let readyRej;
      const ready = new Promise((res, rej) => { readyRes = res; readyRej = rej; });
      const stream = { ready, failed: false, version: () => version, timing: (k) => ({ words: S[k].words, duration: S[k].duration, complete: S[k].complete }), stop: () => stopAll() };
      streams.add(stream);
      const firstTimer = setTimeout(() => { if (startAt == null) fail(new Error('voice too slow')); }, FIRST_CHUNK_TIMEOUT_MS);

      const schedule = (k, samples) => {
        const s = S[k];
        const buf = c.createBuffer(1, samples.length, rate());
        buf.getChannelData(0).set(samples);
        const src = c.createBufferSource();
        src.buffer = buf; src.connect(c.destination);
        src.onended = () => playing.delete(src);
        // On the audio clock (not the heard clock): both move together.
        const when = (startAt + s.offset) / 1000 + (s.samples - samples.length) / rate() + (ctx.outputLatency || ctx.baseLatency || 0);
        src.start(Math.max(c.currentTime, when));
        playing.add(src);
      };
      const place = (k) => {
        const s = S[k];
        if (s.offset != null) return;
        if (k === 0) s.offset = 0;
        else if (S[k - 1].complete && S[k - 1].offset != null) s.offset = S[k - 1].offset + S[k - 1].duration + SENTENCE_GAP_MS;
        else return;
        for (const q of s.queue) schedule(k, q);
        s.queue = [];
        if (s.complete && k + 1 < S.length) place(k + 1);
      };
      const fail = (err) => {
        if (stream.failed) return;
        stream.failed = true;
        clearTimeout(firstTimer);
        if (startAt == null) { readyRej(err); return; }
        // Mid-turn: finish the board silently on speaking-pace times, so the child keeps their place.
        S.forEach((s) => { if (!s.complete) { const t = speakingTimes(s.text); const known = s.words.length; s.words = known ? s.words : t.words; s.duration = Math.max(t.duration, s.words.length ? s.words[s.words.length - 1].end : 0); s.complete = true; } });
        S.forEach((_, k) => place(k));
        version += 1;
      };
      const stopAll = () => {
        stopped = true;
        clearTimeout(firstTimer);
        for (const s of S) { routes.delete(s.id); if (ws?.readyState === WebSocket.OPEN && !s.complete) ws.send(JSON.stringify({ context_id: s.id, cancel: true })); }
        streams.delete(stream);
      };

      (async () => {
        let sock;
        try { sock = await socket(); } catch (e) { fail(e); return; }
        S.forEach((s, k) => {
          routes.set(s.id, (m) => {
            if (stopped) return;
            if (m.type === 'error') { fail(new Error(m.message || m.title || 'voice error')); return; }
            if (m.type === 'chunk' && m.data) {
              const samples = pcmF32FromBase64(m.data);
              s.samples += samples.length;
              if (startAt == null && k === 0) { startAt = heardNow() + LEAD_MS; clearTimeout(firstTimer); place(0); readyRes(startAt); }
              if (s.offset != null) schedule(k, samples); else s.queue.push(samples);
            }
            if (m.type === 'timestamps') { s.words = [...s.words, ...cartesiaWords([m])]; version += 1; }
            if (m.done || m.type === 'done') {
              routes.delete(s.id);
              s.duration = Math.max(Math.round((s.samples / rate()) * 1000), s.words.length ? s.words[s.words.length - 1].end : 0);
              s.complete = true; version += 1;
              if (!s.words.length) s.words = sentenceTiming(s.text, [], s.samples, rate()).words;
              place(k);
            }
          });
          sock.send(JSON.stringify({
            model_id: cfg.model, transcript: s.text, voice: { id: cfg.voice }, language: 'en', context_id: s.id,
            output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: cfg.sample_rate },
            add_timestamps: true, continue: false,
          }));
        });
      })();
      return stream;
    },
    stop() {
      for (const s of playing) { try { s.stop(); s.disconnect(); } catch { /* already stopped */ } }
      playing.clear();
      for (const st of [...streams]) st.stop();
    },
    close() { this.stop(); ws?.close(); ws = null; },
  };
}

export default { cartesiaTts };
