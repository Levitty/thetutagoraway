// ============================================================================
// THE TUTOR'S VOICE, SECOND OPTION: ElevenLabs (owner, 16 Nov 2026: "i want us to
// try eleven labs"). Asked for with ?tts=elevenlabs on the live tutor; listening
// stays on Cartesia Ink. The turn engine is socketVoice.js, the same as Cartesia's.
//
// Multi-context WebSocket (docs read 16 Nov 2026):
//   wss://api.elevenlabs.io/v1/text-to-speech/{voice}/multi-stream-input
//     ?model_id=eleven_flash_v2_5&output_format=pcm_24000&sync_alignment=true&single_use_token=...
//   one context per sentence: { text, context_id, voice_settings } then { context_id, flush: true },
//   then { context_id, close_context: true } (at most 5 open contexts per socket);
//   back: { audio (base64 16-bit PCM), alignment { chars, charStartTimesMs, charDurationsMs }, contextId },
//   and { isFinal: true, contextId } when the context is done. Alignment times are per chunk.
// The single-use token is spent when the socket opens, so every connection asks the
// voice-tutor-token function for a new one; the API key never reaches the page.
// ============================================================================
import { socketTts, openJsonSocket } from './socketVoice.js';

/** Base64 16-bit little-endian PCM to Float32 samples (-1 to 1). Pure; tested. */
export function pcm16FromBase64(b64) {
  const bin = atob(String(b64 || ''));
  const n = Math.floor(bin.length / 2);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    let v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8);
    if (v >= 0x8000) v -= 0x10000;
    out[i] = v / 0x8000;
  }
  return out;
}

/**
 * ElevenLabs character times to words, in ms from the sentence's start. `offsetMs` is the
 * length of the audio already received for the sentence (alignment is per chunk). Pure; tested.
 */
export function elevenWords(alignment, offsetMs = 0) {
  const chars = alignment?.chars || [];
  const st = alignment?.charStartTimesMs || [];
  const du = alignment?.charDurationsMs || [];
  const words = [];
  let cur = null;
  chars.forEach((ch, i) => {
    const t0 = offsetMs + Number(st[i] || 0);
    const t1 = t0 + Number(du[i] || 0);
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { word: '', start: Math.round(t0), end: Math.round(t1) };
    cur.word += ch; cur.end = Math.round(t1);
  });
  if (cur) words.push(cur);
  return words;
}

/** The messages that speak one sentence in its own context. Speed is ElevenLabs' 0.7 to 1.2. Pure; tested. */
export function elevenRequest({ text, id, speed = null }) {
  const vs = { stability: 0.5, similarity_boost: 0.75 };
  const sp = Number(speed);
  if (Number.isFinite(sp) && sp > 0) vs.speed = Math.max(0.7, Math.min(1.2, sp));
  return [
    { text: `${String(text).trim()} `, context_id: id, voice_settings: vs },
    { context_id: id, flush: true },
    { context_id: id, close_context: true },
  ];
}

/** @param {{ getToken: () => Promise<{ token:string, url:string, model:string, voice:string, sample_rate:number }> }} o */
export function elevenlabsTts({ getToken }) {
  let cfg = null;
  const heard = new Map();   // context id -> samples received so far (to place each chunk's alignment)
  return socketTts({
    name: 'elevenlabs',
    async connect(onMessage) {
      cfg = await getToken();
      const q = new URLSearchParams({ model_id: cfg.model, output_format: `pcm_${cfg.sample_rate}`, sync_alignment: 'true', inactivity_timeout: '180', single_use_token: cfg.token });
      const conn = await openJsonSocket(`${cfg.url}/${encodeURIComponent(cfg.voice)}/multi-stream-input?${q}`, onMessage);
      // The first message on a connection is a single space (the API's rule).
      conn.send({ text: ' ' });
      return conn;
    },
    rate: () => cfg.sample_rate,
    // The tester's voice picker lists Cartesia voices, so it is not passed here: the ElevenLabs voice is a server setting.
    request: (s, { speed }) => elevenRequest({ text: s.text, id: s.id, speed }),
    cancel: (s) => ({ context_id: s.id, close_context: true }),
    read(m) {
      const id = m.contextId || m.context_id;
      if (!id) return null;
      if (m.error || m.message_type === 'error') return { id, error: String(m.error || m.message || 'voice error') };
      const audio = m.audio ? pcm16FromBase64(m.audio) : null;
      const before = heard.get(id) || 0;
      const words = m.alignment ? elevenWords(m.alignment, Math.round((before / cfg.sample_rate) * 1000)) : null;
      if (audio) heard.set(id, before + audio.length);
      const done = !!(m.isFinal || m.is_final);
      if (done) heard.delete(id);
      return { id, audio, words, done };
    },
  });
}

export default { elevenlabsTts, pcm16FromBase64, elevenWords, elevenRequest };
