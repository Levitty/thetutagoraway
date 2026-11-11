// ============================================================================
// VOICE, the parts that are pure (milestones 3 and 3b): tested in node, used by
// the browser providers (cartesia.js, cartesiaStt.js, webSpeech.js,
// mockVoice.js) and the page.
//
//   cartesiaWords(msgs)     Cartesia `timestamps` messages (seconds) -> the
//                           timeline's word times ({ word, start, end } in ms)
//   pcmF32FromBase64(b64)   a Cartesia audio chunk (raw pcm_f32le) as samples
//   cartesiaSttEvent(msg)   a Cartesia Ink message -> { kind: 'partial'|'final'|'flushed'|'done'|'error', text }
//   pcm16(float32)          microphone samples as the pcm_s16le Ink is sent
//   SpeechEnd               end of speech from the microphone's loudness (press to talk, then silence ends it)
//   voiceReducer(s, ev)     is the voice working, and if not, what the child is told:
//                           typing is always the fallback, shown plainly
//   bargeIn({ player, tts, now })  the child spoke: the voice stops at once, the
//                           strokes already due are drawn, the rest dropped
//   speechCost / listenCost the voice's price, for the caps and the cost log
// ============================================================================
import { interrupt } from '../timeline.js';

// ---------------------------------------------------------------- Cartesia
/** Word times from Cartesia `timestamps` messages, in ms from the start of the sentence. */
export function cartesiaWords(msgs) {
  const words = [];
  for (const m of msgs || []) {
    const w = m?.word_timestamps;
    if (!w || !Array.isArray(w.words)) continue;
    w.words.forEach((word, i) => {
      const start = Math.round(Number(w.start?.[i]) * 1000);
      const end = Math.round(Number(w.end?.[i]) * 1000);
      if (word && Number.isFinite(start)) words.push({ word: String(word), start, end: Number.isFinite(end) ? end : start });
    });
  }
  return words.sort((a, b) => a.start - b.start);
}

/** Raw little-endian float32 PCM, base64 -> Float32Array. */
export function pcmF32FromBase64(b64) {
  const bin = atob(String(b64 || ''));
  const n = Math.floor(bin.length / 4);
  const buf = new ArrayBuffer(n * 4);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < n * 4; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(buf);
}

/**
 * One sentence's synthesis: audio duration (from the samples) and words. If
 * the voice gave no word times, they are spread over the audio by length, so
 * the board still moves with the voice (sentence-level sync).
 */
export function sentenceTiming(text, words, samples, sampleRate) {
  const duration = Math.round((samples / sampleRate) * 1000);
  if (words.length) return { words, duration: Math.max(duration, words[words.length - 1].end) };
  const toks = String(text).split(/\s+/).filter(Boolean);
  const total = toks.reduce((s, t) => s + t.length + 1, 0) || 1;
  let at = 0;
  return {
    duration,
    words: toks.map((word) => { const d = (duration * (word.length + 1)) / total; const w = { word, start: Math.round(at), end: Math.round(at + d) }; at += d; return w; }),
  };
}

// ---------------------------------------------------------------- Cartesia Ink (listening)
// wss://api.cartesia.ai/stt/websocket (Cartesia docs, read 11 Nov 2026). ink-whisper takes `language`
// and `max_silence_duration_secs`; text arrives as deltas: concatenate the final ones as they are.
export const CARTESIA_STT_URL = 'wss://api.cartesia.ai/stt/websocket';
export const STT_MODEL = 'ink-whisper';
export const STT_RATE = 16000;
export const sttUrl = ({ token, version, rate = STT_RATE, model = STT_MODEL, language = 'en', maxSilenceSecs = 0.8, keyterms = [] }) => {
  const q = [`model=${encodeURIComponent(model)}`, `language=${encodeURIComponent(language)}`, 'encoding=pcm_s16le', `sample_rate=${rate}`, `max_silence_duration_secs=${maxSilenceSecs}`, `cartesia_version=${encodeURIComponent(version)}`];
  // keyterm is documented for ink-2 and ink-preview only (up to 100 terms, 1200 characters); ink-whisper takes none.
  if (!/^ink-whisper/.test(model)) for (const t of keyterms) q.push(`keyterm=${encodeURIComponent(t)}`);
  q.push(`access_token=${encodeURIComponent(token)}`);
  return `${CARTESIA_STT_URL}?${q.join('&')}`;
};

/** A Cartesia Ink message, as what the page needs. */
export function cartesiaSttEvent(msg) {
  if (!msg || typeof msg !== 'object') return null;
  if (msg.type === 'transcript') return { kind: msg.is_final ? 'final' : 'partial', text: String(msg.text ?? '') };
  if (msg.type === 'flush_done') return { kind: 'flushed' };
  if (msg.type === 'done') return { kind: 'done' };
  if (msg.type === 'error') return { kind: 'error', text: String(msg.message || msg.title || 'speech service error') };
  return null;
}

/** Float32 microphone samples -> little-endian 16-bit PCM bytes. */
export function pcm16(f32) {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i += 1) { const v = Math.max(-1, Math.min(1, f32[i])); out[i] = v < 0 ? v * 0x8000 : v * 0x7fff; }
  return out.buffer;
}

/**
 * End of speech from loudness, for press to talk: speech has started once a
 * frame is louder than `speak`, and ends after `silenceMs` below `quiet`.
 * feed(rms, ms) -> 'speech' (it started) | 'end' (it ended) | null.
 */
export function speechEnd({ speak = 0.02, quiet = 0.012, silenceMs = 800, pauseMs = 0 } = {}) {
  let talking = false; let quietFor = 0; let nudged = false;
  const limit = () => (typeof silenceMs === 'function' ? silenceMs() : silenceMs);
  return {
    // Also 'pause' (once per quiet stretch) when pauseMs is set: the child is thinking, not finished.
    feed(rms, ms) {
      if (!talking) { if (rms >= speak) { talking = true; quietFor = 0; nudged = false; return 'speech'; } return null; }
      if (rms < quiet) {
        quietFor += ms;
        if (quietFor >= limit()) { talking = false; return 'end'; }
        if (pauseMs && !nudged && quietFor >= pauseMs) { nudged = true; return 'pause'; }
      } else { quietFor = 0; nudged = false; }
      return null;
    },
    get talking() { return talking; },
  };
}

/**
 * The child speaking over HOREB, from the microphone's loudness while HOREB is talking. The level is
 * higher than for the child's own turn (the speaker leaks into the microphone even with echo
 * cancellation) and it must hold for `frames` frames in a row, so a click or a cough does not stop the
 * lesson. feed(rms) -> true once, when it holds.
 */
export function bargeDetector({ level = 0.06, frames = 2 } = {}) {
  let run = 0; let fired = false;
  return { feed(rms) { if (fired) return false; run = rms >= level ? run + 1 : 0; if (run >= frames) { fired = true; return true; } return false; }, reset() { run = 0; fired = false; } };
}
export const rmsOf = (f32) => { let s = 0; for (let i = 0; i < f32.length; i += 1) s += f32[i] * f32[i]; return Math.sqrt(s / (f32.length || 1)); };

// ---------------------------------------------------------------- the fallback
// mode: 'voice' (talk and listen), 'speaker' (the tutor speaks, the child types:
// no microphone), 'typed' (no voice at all). A failure never stops the lesson:
// it moves down a mode and says so plainly.
export const VOICE_MESSAGES = {
  'no-listening': 'This browser cannot listen, so please type your answers.',
  'no-voice': 'This browser has no English voice, so HOREB is silent: read along as the words appear.',
  'mic-denied': 'The microphone is not allowed, so please type your answers.',
  'mic-missing': 'No microphone was found, so please type your answers.',
  'listen-failed': 'Listening is not working just now, so please type your answers.',
  'token-refused': 'Voice is not available for this account, so please type.',
  'speak-failed': 'HOREB cannot speak just now. Read the words on the screen and type your answers.',
  'audio-blocked': 'Tap the screen to let HOREB speak.',
  offline: 'The connection dropped, so voice is off. Please type your answers.',
};
export const initialVoice = (wanted = 'voice') => ({ mode: wanted, message: '', failures: 0, listening: false, partial: '' });

export function voiceReducer(s, ev) {
  switch (ev.type) {
    case 'listen': return s.mode === 'voice' ? { ...s, listening: true, partial: '' } : s;
    case 'partial': return { ...s, partial: String(ev.text || '') };
    case 'heard': case 'stopped': return { ...s, listening: false, partial: '' };
    case 'fail': {
      const kind = VOICE_MESSAGES[ev.kind] ? ev.kind : 'listen-failed';
      const listenKinds = ['mic-denied', 'mic-missing', 'listen-failed', 'no-listening'];
      // Losing the microphone keeps the voice; losing the voice or the line drops to typing.
      const mode = listenKinds.includes(kind) ? (s.mode === 'typed' ? 'typed' : 'speaker')
        : kind === 'audio-blocked' ? s.mode
          : kind === 'no-voice' ? (s.mode === 'voice' ? 'voice' : s.mode)   // silent board, listening still works
            : 'typed';
      // Two things can be wrong at once (no voice and no listening): say both, once each.
      const both = !!s.message && !s.message.includes(VOICE_MESSAGES[kind]) && kind !== 'audio-blocked';
      const message = both ? `${s.message} ${VOICE_MESSAGES[kind]}` : VOICE_MESSAGES[kind];
      return { ...s, mode, listening: false, partial: '', message, failures: s.failures + 1 };
    }
    case 'retry': return { ...s, mode: ev.mode || 'voice', message: '' };
    default: return s;
  }
}
export const canListen = (s) => s.mode === 'voice';
export const canSpeak = (s) => s.mode !== 'typed';

// ---------------------------------------------------------------- barge-in
/**
 * The child started speaking over the tutor. The voice stops at once (tts.stop),
 * strokes already due are returned to be drawn at once, the rest are dropped,
 * and `heard` is what the child actually heard. Uses the timeline's interrupt,
 * so the board code is the same as for typing over.
 */
export function bargeIn({ player, tts, now }) {
  tts?.stop?.();
  if (!player || player.stopped) return { due: [], dropped: [], heard: null, words: [], finished: true, interrupted: false };
  const r = interrupt(player, now);
  return { ...r, heard: r.finished ? null : r.heard, interrupted: !r.finished };
}

// ---------------------------------------------------------------- price
// Cartesia, both ways (owner, 11 Nov 2026). Source: cartesia.ai/pricing, read 11 Nov 2026:
// Pro US$5 a month for 100K credits (US$0.00005 a credit); Sonic 1 credit a character;
// Ink speech-to-text 3 credits a second, so 180 a minute. Scale (US$299 for 8M) is cheaper:
// US$0.0000374 a character, about US$0.0067 a minute (the page quotes US$0.39 an hour).
export const PRICES = {
  ttsUsdPerChar: 5 / 100000,               // Sonic: 1 credit a character at Pro
  sttUsdPerMinute: (180 * 5) / 100000,     // Ink: 3 credits a second at Pro = US$0.009 a minute, only while the child speaks
};
export const speechCost = (chars, p = PRICES) => Math.max(0, chars) * p.ttsUsdPerChar;
export const listenCost = (seconds, p = PRICES) => (Math.max(0, seconds) / 60) * p.sttUsdPerMinute;
/** Characters the tutor will speak in a turn (every `say`). */
export const spokenChars = (steps) => (steps || []).filter((s) => s.cmd === 'say').reduce((n, s) => n + String(s.text).length, 0);

export default { cartesiaWords, pcmF32FromBase64, sentenceTiming, cartesiaSttEvent, pcm16, speechEnd, voiceReducer, bargeIn, speechCost, listenCost, spokenChars };
