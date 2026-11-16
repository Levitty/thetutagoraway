// ============================================================================
// THE TUTOR'S VOICE: Cartesia Sonic over a WebSocket, straight from the
// browser with a short-lived access token from the voice-tutor-token function
// (the API key never leaves the server). The turn itself (sentences as contexts,
// first sound on the first chunk, word times driving the board, barge-in) is
// socketVoice.js, shared with the ElevenLabs voice; this file is Cartesia's
// messages only. Sentences keep the timeline's gap (SENTENCE_GAP_MS, in socketVoice.js).
// ============================================================================
import { cartesiaWords, pcmF32FromBase64 } from './voice.js';
import { socketTts, openJsonSocket } from './socketVoice.js';
export { FIRST_CHUNK_TIMEOUT_MS, LEAD_MS } from './socketVoice.js';

/**
 * One Sonic request. generation_config.speed (0.6 to 1.5) and .emotion (neutral, calm, angry, content, sad)
 * are in Cartesia's TTS websocket docs (read 12 Nov 2026). `language` is the base code: en-KE is not a documented
 * accent, and `locale` and `language` must never both be set. Pure; tested.
 */
export function sonicRequest({ cfg, text, id, speed = null, emotion = null, voice = null }) {
  const gen = {};
  const sp = Number(speed ?? cfg.speed);
  if (Number.isFinite(sp) && sp > 0) gen.speed = Math.max(0.6, Math.min(1.5, sp));
  const EMOTIONS = ['neutral', 'calm', 'angry', 'content', 'sad'];
  const em = EMOTIONS.includes(emotion) ? emotion : cfg.emotion;
  if (EMOTIONS.includes(em)) gen.emotion = em;
  return {
    model_id: cfg.model, transcript: text, voice: { id: voice || cfg.voice }, language: 'en', context_id: id,
    output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: cfg.sample_rate },
    ...(Object.keys(gen).length ? { generation_config: gen } : {}),
    add_timestamps: true, continue: false,
  };
}

/** @param {{ getToken: () => Promise<{ token:string, url:string, model:string, voice:string, version:string, sample_rate:number, expires_in:number }> }} o */
export function cartesiaTts({ getToken }) {
  let cfg = null;
  let cfgUntil = 0;
  return socketTts({
    name: 'cartesia',
    async connect(onMessage) {
      if (!cfg || Date.now() > cfgUntil) { cfg = await getToken(); cfgUntil = Date.now() + (Number(cfg.expires_in) || 60) * 1000 - 5000; }
      return openJsonSocket(`${cfg.url}?access_token=${encodeURIComponent(cfg.token)}&cartesia_version=${encodeURIComponent(cfg.version)}`, onMessage);
    },
    rate: () => cfg.sample_rate,
    request: (s, { speed, emotion, voice }) => sonicRequest({ cfg, text: s.text, id: s.id, speed, emotion, voice }),
    cancel: (s) => ({ context_id: s.id, cancel: true }),
    read(m) {
      if (m.type === 'error') return { id: m.context_id, error: m.message || m.title || 'voice error' };
      return {
        id: m.context_id,
        audio: m.type === 'chunk' && m.data ? pcmF32FromBase64(m.data) : null,
        words: m.type === 'timestamps' ? cartesiaWords([m]) : null,
        done: !!(m.done || m.type === 'done'),
      };
    },
  });
}

export default { cartesiaTts };
