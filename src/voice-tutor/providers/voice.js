// ============================================================================
// VOICE, the parts that are pure (milestone 3): tested in node, used by the
// browser providers (cartesia.js, deepgram.js, mockVoice.js) and the page.
//
//   cartesiaWords(msgs)     Cartesia `timestamps` messages (seconds) -> the
//                           timeline's word times ({ word, start, end } in ms)
//   pcmF32FromBase64(b64)   a Cartesia audio chunk (raw pcm_f32le) as samples
//   deepgramEvent(msg)      a Deepgram message -> { kind: 'speech'|'partial'|'final'|'end'|'error', text }
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

// ---------------------------------------------------------------- Deepgram
/** A Deepgram live message, as what the page needs to know. */
export function deepgramEvent(msg) {
  if (!msg || typeof msg !== 'object') return null;
  if (msg.type === 'SpeechStarted') return { kind: 'speech' };
  if (msg.type === 'UtteranceEnd') return { kind: 'end' };
  if (msg.type === 'Error' || msg.type === 'error') return { kind: 'error', text: String(msg.description || msg.message || 'speech service error') };
  if (msg.type === 'Results') {
    const text = String(msg.channel?.alternatives?.[0]?.transcript || '').trim();
    if (msg.is_final) return { kind: 'final', text, speechFinal: !!msg.speech_final };
    return text ? { kind: 'partial', text } : null;
  }
  return null;
}

/** Live query for Deepgram (the token comes from voice-tutor-token; the key never reaches the page). */
export const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true&interim_results=true&endpointing=400&utterance_end_ms=1200&vad_events=true';

// ---------------------------------------------------------------- the fallback
// mode: 'voice' (talk and listen), 'speaker' (the tutor speaks, the child types:
// no microphone), 'typed' (no voice at all). A failure never stops the lesson:
// it moves down a mode and says so plainly.
export const VOICE_MESSAGES = {
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
      const listenKinds = ['mic-denied', 'mic-missing', 'listen-failed'];
      // Losing the microphone keeps the voice; losing the voice or the line drops to typing.
      const mode = listenKinds.includes(kind) ? (s.mode === 'typed' ? 'typed' : 'speaker') : kind === 'audio-blocked' ? s.mode : 'typed';
      return { ...s, mode, listening: false, partial: '', message: VOICE_MESSAGES[kind], failures: s.failures + 1 };
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
// Option B (owner, 10 Nov 2026). Confirm against the vendors' pages before paying.
export const PRICES = {
  ttsUsdPerChar: 65 / 1e6,       // Cartesia Pro: US$65 a million credits, 1 credit a character
  sttUsdPerMinute: 0.0077,       // Deepgram streaming, only while the child speaks
};
export const speechCost = (chars, p = PRICES) => Math.max(0, chars) * p.ttsUsdPerChar;
export const listenCost = (seconds, p = PRICES) => (Math.max(0, seconds) / 60) * p.sttUsdPerMinute;
/** Characters the tutor will speak in a turn (every `say`). */
export const spokenChars = (steps) => (steps || []).filter((s) => s.cmd === 'say').reduce((n, s) => n + String(s.text).length, 0);

export default { cartesiaWords, pcmF32FromBase64, sentenceTiming, deepgramEvent, voiceReducer, bargeIn, speechCost, listenCost, spokenChars };
