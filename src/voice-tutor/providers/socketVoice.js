// ============================================================================
// ONE TURN'S VOICE OVER A WEBSOCKET, for any voice service (16 Nov 2026: taken out
// of cartesia.js so ElevenLabs could be tried beside Cartesia without a second copy).
//
// open() gives a turn's voice; add(text) sends each sentence as soon as the
// tutor's streamed reply has checked it (one context each, on one socket), and
// the first sound starts on the first audio chunk. Word timestamps stream in
// beside the audio; the page rebuilds the board timeline from them as they
// come, so a stroke starts as its word is heard and never before. The
// board's clock (clock()) is the audio clock less the output latency: what the
// child hears. stop() silences everything at once (barge-in).
//
// A service is a transport:
//   name
//   connect(onMessage) -> Promise<{ send(obj), close(), isOpen() }>   (tokens are its own business;
//                          it calls onMessage(raw parsed message) and onMessage(null) when the socket closes)
//   rate()                 sample rate of its audio
//   request(s, opts)       the message (or messages, in order) that ask for sentence s ({ id, text }) with the turn's speed, emotion, voice
//   cancel(s)              the message that cancels s, or null
//   read(m)                -> { id, audio?: Float32Array, words?: [{word,start,end}], done?: true, error?: string }
//                          words in ms from the sentence's start (the transport adds earlier chunks' length)
// ============================================================================
import { sentenceTiming } from './voice.js';
import { SENTENCE_GAP_MS, speakingTimes } from '../timeline.js';

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `c${Date.now()}${Math.random().toString(36).slice(2)}`);
export const FIRST_CHUNK_TIMEOUT_MS = 6000;
export const LEAD_MS = 40;   // scheduling lead for the first chunk

export function socketTts(transport) {
  let ctx = null;
  let conn = null;
  const routes = new Map();   // sentence id -> handler(read message)
  const playing = new Set();
  const streams = new Set();

  const audio = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };
  // What the child hears lags the audio clock by the output latency; the board follows the ear.
  const heardNow = () => (ctx ? (ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0)) * 1000 : performance.now());
  const onMessage = (m) => {
    if (m === null) { for (const h of routes.values()) h({ error: 'voice connection closed' }); routes.clear(); conn = null; return; }
    const r = transport.read(m);
    if (r?.id) routes.get(r.id)?.(r);
  };
  const socket = async () => {
    if (conn && conn.isOpen()) return conn;
    conn = await transport.connect(onMessage);
    return conn;
  };

  return {
    name: transport.name,
    hasAudio: true,
    clock: heardNow,
    /** Call from a tap: browsers only allow audio after one. */
    async unlock() { await audio().resume(); return { ok: true, reason: null }; },
    /**
     * A turn's voice. Sentences are added one by one as the tutor's reply streams in
     * (each already checked); each goes to the service at once as its own context. The first
     * sound starts on the first audio chunk. Sentence k starts when its audio arrives,
     * but never before sentence k-1 has ended plus the timeline's gap; its start is
     * reported, so the board timeline uses exactly the time the child hears it.
     */
    open({ speed = null, emotion = null, voice = null, gapMs = SENTENCE_GAP_MS } = {}) {
      const c = audio();
      const rate = () => transport.rate();
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
        const earliest = prev ? prev.offset + prev.duration + gapMs : 0;
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
          if (s.offset == null) { const p = S[k - 1]; s.offset = Math.max(p ? p.offset + p.duration + gapMs : 0, heardNow() - startAt); }
        });
        version += 1;
      };
      const stopAll = () => {
        stopped = true;
        clearTimeout(firstTimer);
        for (const s of S) {
          routes.delete(s.id);
          const cm = !s.complete && transport.cancel(s);
          if (cm && conn?.isOpen()) conn.send(cm);
        }
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
          routes.set(s.id, (r) => {
            if (stopped) return;
            if (r.error) { fail(new Error(r.error)); return; }
            if (r.audio && r.audio.length) {
              s.samples += r.audio.length;
              if (startAt == null && k === 0) { startAt = heardNow() + LEAD_MS; clearTimeout(firstTimer); readyRes(startAt); }
              if (s.offset != null) schedule(k, r.audio); else { s.queue.push(r.audio); place(k); }
            }
            if (r.words?.length) { s.words = [...s.words, ...r.words].sort((a, b) => a.start - b.start); version += 1; }
            if (r.done) {
              routes.delete(s.id);
              s.duration = Math.max(Math.round((s.samples / rate()) * 1000), s.words.length ? s.words[s.words.length - 1].end : 0);
              if (!s.words.length) s.words = sentenceTiming(s.text, [], s.samples, rate()).words;
              s.complete = true; version += 1;
              place(k + 1);
            }
          });
          const msgs = transport.request(s, { speed, emotion, voice });
          for (const m of Array.isArray(msgs) ? msgs : [msgs]) w.send(m);
        }, (e) => fail(e));
      };
      return stream;
    },
    stop() {
      for (const s of playing) { try { s.stop(); s.disconnect(); } catch { /* already stopped */ } }
      playing.clear();
      for (const st of [...streams]) st.stop();
    },
    close() { this.stop(); conn?.close(); conn = null; },
  };
}

/** A WebSocket as a transport connection: JSON in and out. */
export function openJsonSocket(url, onMessage) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch { return; } onMessage(m); };
    ws.onerror = () => reject(new Error('voice connection failed'));
    ws.onclose = () => onMessage(null);
    ws.onopen = () => {
      ws.onerror = null;
      resolve({ send: (o) => ws.send(JSON.stringify(o)), close: () => ws.close(), isOpen: () => ws.readyState === WebSocket.OPEN });
    };
  });
}

export default { socketTts, openJsonSocket };
