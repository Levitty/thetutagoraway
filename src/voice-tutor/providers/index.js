// ============================================================================
// THE PROVIDER INTERFACE: one thin layer, so each part is swapped by a setting
// and the board code never changes.
//
//   tutor  turn(request) -> a turn                    scripted (mockTutor) | remote (voice-tutor function)
//   tts    clock() ms                                 the board's clock: what the child hears, when there is audio
//          unlock()                                   from a tap (browsers allow audio only after one)
//          speak(texts) -> stream                     stream.ready: Promise<startAt> on the first audio chunk
//                                                     stream.timing(k): { words, duration|null, complete } so far
//                                                       (word times in ms from sentence k's start; sentence k
//                                                       starts after k-1 plus the timeline's SENTENCE_GAP_MS)
//                                                     stream.version(): grows as word times arrive
//                                                     stream.failed: the voice failed mid-turn (board carries on)
//          stop()                                     silence at once (barge-in)
//                                                     simulated (free, silent) | cartesia
//   stt    prepare()                                  from a tap: the microphone
//          start({ onSpeech, onPartial, onFinal, onError }) -> { stop(), cancel() }
//                                                     typed-as-speech (free) | deepgram | none
//
// Keys never reach the page: the remote providers ask voice-tutor-token for a
// short-lived token, behind the same switch, allowlist and caps as the tutor.
// ============================================================================
import { createMockTutor } from '../mockTutor.js';
import { simulatedTts, fakeStt } from './mockVoice.js';
import { cartesiaTts } from './cartesia.js';
import { deepgramStt } from './deepgram.js';

export const INTERFACE = {
  tutor: ['turn'],
  tts: ['clock', 'unlock', 'speak', 'stop'],
  stt: ['prepare', 'start'],
};

/** Every provider has the whole interface (a missing method is a bug, found at once). */
export function checkProviders(p) {
  const missing = [];
  for (const [part, methods] of Object.entries(INTERFACE)) {
    if (part === 'stt' && p.stt === null) continue;   // no listening: typing only
    for (const m of methods) if (typeof p[part]?.[m] !== 'function') missing.push(`${part}.${m}`);
  }
  return missing;
}

/** The live tutor through the voice-tutor edge function. */
export const remoteTutor = (supabase) => ({
  name: 'remote',
  async turn(request) {
    const { data, error } = await supabase.functions.invoke('voice-tutor', { body: request });
    if (error) throw new Error(await errorText(error, 'The tutor could not answer.'));
    return data;
  },
});

const errorText = async (error, fallback) => {
  try { const j = await error.context?.json?.(); if (j?.error) return j.error; } catch { /* keep the message */ }
  return error.message || fallback;
};

/** A token for the voice services, from voice-tutor-token. */
export const tokenGetter = (supabase, kind, sessionId) => async () => {
  const { data, error } = await supabase.functions.invoke('voice-tutor-token', { body: { kind, session_id: sessionId() } });
  if (error) {
    const e = new Error(await errorText(error, 'No voice token.'));
    e.kind = error.context?.status === 403 ? 'token-refused' : 'listen-failed';
    throw e;
  }
  return data;
};

/**
 * mode 'mock': scripted tutor, silent voice at speaking pace, typed text "spoken".
 * mode 'remote': the real tutor; with voice, Cartesia speaks and Deepgram listens;
 * without, the board runs on the simulated clock and the child types.
 */
export function providersFor(mode, { supabase = null, voice = false, sessionId = () => '' } = {}) {
  if (mode !== 'remote') return { tutor: createMockTutor(), tts: simulatedTts(), stt: fakeStt() };
  return {
    tutor: remoteTutor(supabase),
    tts: voice ? cartesiaTts({ getToken: tokenGetter(supabase, 'tts', sessionId) }) : simulatedTts(),
    stt: voice ? deepgramStt({ getToken: tokenGetter(supabase, 'stt', sessionId) }) : null,
  };
}

export default { providersFor, checkProviders, INTERFACE };
