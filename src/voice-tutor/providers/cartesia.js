// ============================================================================
// THE TUTOR'S VOICE: Cartesia Sonic over a WebSocket, straight from the
// browser with a short-lived access token from the voice-tutor-token function
// (the API key never leaves the server).
//
// open() gives a turn's voice; add(text) sends each sentence as soon as the
// tutor's streamed reply has checked it (one context each, on one socket), and
// the first sound starts on the first audio chunk. Word timestamps stream in
// beside the audio; the page rebuilds the board timeline from them as they
// come, so a stroke starts as its word is heard and never before. The
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
    async unlock() { await audio().resume(); return { ok: true, reason: null }; },
    /**
     * A turn's voice. Sentences are added one by one as the tutor's reply streams in
     * (each already checked); each goes to Cartesia at once as its own context. The first
     * sound starts on the first audio chunk. Sentence k starts when its audio arrives,
     * but never before sentence k-1 has ended plus the timeline's gap; its start is
     * reported, so the board timeline uses exactly the time the child hears it.
     */
    open() {
      const c = audio();
      const rate = () => cfg.sample_rate;
      const S = [];
      let version = 0; let startAt = null; let stopped = false;
      let readyRes; let readyRej;
      const ready = new Promise((res, rej) => { readyRes = res; readyRej = rej; });
      const sock = socket();
      sock.catch(() => {});
      let firstTimer = null;
      const stream = {
        ready, failed: false,
        version: () => version,
        timing: (k) => (S[k] ? { start: S[k].offset, words: S[k].words, duration: S[k].duration, complete: S[k].complete } : { start: null, words: [], duration: null, complete: false }),
        add: (text) => add(text),
        end() {},
        stop: () => stopAll(),
      };
      streams.add(stream);

      const schedule = (k, samples) => {
        const s = S[k];
        const buf = c.createBuffer(1, samples.length, rate());
        buf.getChannelData(0).set(samples);
        const src = c.createBufferSource();
        src.buffer = buf; src.connect(c.destination);
        src.onended = () => playing.delete(src);
        // On the audio clock: the heard time plus the output latency.
        const when = (startAt + s.offset) / 1000 + (s.played / rate()) + (ctx.outputLatency || ctx.baseLatency || 0);
        src.start(Math.max(c.currentTime, when));
        s.played += samples.length;
        playing.add(src);
      };
      const place = (k) => {
        const s = S[k];
        if (!s || s.offset != null || !s.queue.length) return;
        const prev = S[k - 1];
        if (prev && !(prev.complete && prev.offset != null)) return;
        const earliest = prev ? prev.offset + prev.duration + SENTENCE_GAP_MS : 0;
        s.offset = Math.max(earliest, heardNow() + LEAD_MS - startAt);
        version += 1;
        for (const q of s.queue) schedule(k, q);
        s.queue = [];
      };
      const fail = (err) => {
        if (stream.failed) return;
        stream.failed = true;
        clearTimeout(firstTimer);
        if (startAt == null) { readyRej(err); return; }
        // Mid-turn: finish the board silently on speaking-pace times, so the child keeps their place.
        S.forEach((s, k) => {
          if (s.complete) return;
          const t = speakingTimes(s.text);
          if (!s.words.length) s.words = t.words;
          s.duration = Math.max(t.duration, s.words.length ? s.words[s.words.length - 1].end : 0);
          s.complete = true;
          if (s.offset == null) { const p = S[k - 1]; s.offset = Math.max(p ? p.offset + p.duration + SENTENCE_GAP_MS : 0, heardNow() - startAt); }
        });
        version += 1;
      };
      const stopAll = () => {
        stopped = true;
        clearTimeout(firstTimer);
        for (const s of S) { routes.delete(s.id); if (ws?.readyState === WebSocket.OPEN && !s.complete) ws.send(JSON.stringify({ context_id: s.id, cancel: true })); }
        streams.delete(stream);
      };
      const add = (text) => {
        if (stopped || stream.failed) return;
        const k = S.length;
        const s = { text, words: [], samples: 0, played: 0, duration: null, complete: false, offset: null, queue: [], id: uid() };
        S.push(s);
        if (k === 0) firstTimer = setTimeout(() => { if (startAt == null) fail(new Error('voice too slow')); }, FIRST_CHUNK_TIMEOUT_MS);
        sock.then((w) => {
          if (stopped) return;
          routes.set(s.id, (m) => {
            if (stopped) return;
            if (m.type === 'error') { fail(new Error(m.message || m.title || 'voice error')); return; }
            if (m.type === 'chunk' && m.data) {
              const samples = pcmF32FromBase64(m.data);
              s.samples += samples.length;
              if (startAt == null && k === 0) { startAt = heardNow() + LEAD_MS; clearTimeout(firstTimer); readyRes(startAt); }
              if (s.offset != null) schedule(k, samples); else { s.queue.push(samples); place(k); }
            }
            if (m.type === 'timestamps') { s.words = [...s.words, ...cartesiaWords([m])]; version += 1; }
            if (m.done || m.type === 'done') {
              routes.delete(s.id);
              s.duration = Math.max(Math.round((s.samples / rate()) * 1000), s.words.length ? s.words[s.words.length - 1].end : 0);
              if (!s.words.length) s.words = sentenceTiming(s.text, [], s.samples, rate()).words;
              s.complete = true; version += 1;
              place(k + 1);
            }
          });
          w.send(JSON.stringify({
            model_id: cfg.model, transcript: s.text, voice: { id: cfg.voice }, language: 'en', context_id: s.id,
            output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: cfg.sample_rate },
            add_timestamps: true, continue: false,
          }));
        }, (e) => fail(e));
      };
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
