// ============================================================================
// THE PROVIDER INTERFACE: one thin layer, so each part is swapped by a setting
// and the board code never changes.
//
//   tutor  turn(request, onEvent) -> Promise         the turn streams in as events:
//                                                     meta, step (each already checked), end
//          scripted (mockTutor) | remote (the voice-tutor function, streamed)
//   tts    clock() ms                                 the board's clock: what the child hears
//          unlock() -> { ok, reason }                 from the Start press (audio needs a tap)
//          open() -> stream                           one turn's voice:
//            stream.add(text)                           the next sentence, as soon as it is checked
//            stream.end()                               no more sentences this turn
//            stream.ready -> Promise<startAt>           the first sound (on the first audio)
//            stream.timing(k) -> { start, words, duration, complete }   so far: start in ms from
//                                                       startAt (null until it is heard), word times
//                                                       in ms from the sentence's start
//            stream.version()                           grows as times arrive
//            stream.failed / stream.stop()
//          stop()                                     silence at once (barge-in)
//          browser-voice (practice) | cartesia (live) | simulated (silent, where neither works)
//   stt    open({ onSpeech, onPartial, onPause, onUtterance, onNoise, onBargeIn, onError, pace })
//            -> { setMode('child'|'tutor'|'off'), close() }   one listening session for the whole lesson
//          cartesia-ink (live, continuous itself) | browser-listening (practice) and typed-as-speech
//          (the demo, which also has say(text)), both made continuous by listener.js | none
//
// Keys never reach the page: live mode asks voice-tutor-token for one short-lived
// Cartesia token (speaking and listening), behind the same switch, allowlist and caps.
// ============================================================================
import { createMockTutor } from '../mockTutor.js';
import { simulatedTts, fakeStt } from './mockVoice.js';
import { cartesiaTts } from './cartesia.js';
import { cartesiaStt } from './cartesiaStt.js';
import { webSpeechTts, webSpeechStt, hasWebSpeechStt } from './webSpeech.js';
import { readTurnStream } from './turnStream.js';
import { loopListener } from './listener.js';

export const INTERFACE = {
  tutor: ['turn'],
  tts: ['clock', 'unlock', 'open', 'stop'],
  stt: ['open'],
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

const errorText = async (res, fallback) => {
  try { const j = await res.json(); if (j?.error) return j.error; } catch { /* keep the fallback */ }
  return fallback;
};

/** The live tutor through the voice-tutor edge function, read as a stream of events. */
export const remoteTutor = (supabase) => ({
  name: 'remote',
  async turn(request, onEvent) {
    const { data: { session } = {} } = await supabase.auth.getSession();
    const res = await fetch(`${supabase.functionsUrl || `${supabase.supabaseUrl}/functions/v1`}/voice-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabase.supabaseKey, Authorization: `Bearer ${session?.access_token || supabase.supabaseKey}` },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(await errorText(res, 'The tutor could not answer.'));
    return readTurnStream(res.body, onEvent);
  },
});

/** One Cartesia token for speaking and listening, kept until shortly before it expires. */
export const tokenGetter = (supabase, sessionId, childId = () => null) => {
  let cached = null; let until = 0;
  return async () => {
    if (cached && Date.now() < until) return cached;
    const { data, error } = await supabase.functions.invoke('voice-tutor-token', { body: { session_id: sessionId(), child_id: childId() } });
    if (error) {
      // The function's own reason (status and the voice service's answer), for the tester view.
      let body = null; try { body = await error.context?.json?.(); } catch { /* not JSON */ }
      const e = new Error(`voice token ${error.context?.status || ''}: ${body?.detail || body?.error || error.message || 'no token'}`);
      e.kind = error.context?.status === 403 ? 'token-refused' : 'listen-failed';
      throw e;
    }
    cached = data; until = Date.now() + ((Number(data.expires_in) || 60) - 20) * 1000;
    return data;
  };
};

/**
 * mode 'mock' (practice, free): the scripted tutor; the browser's own voice and listening
 * (the page falls back to the silent clock, or to typing, where the browser cannot).
 * The self-playing demo "speaks" typed words instead of listening.
 * mode 'remote': the real tutor; with voice, Cartesia speaks and listens (Ink).
 */
export function providersFor(mode, { supabase = null, voice = true, sessionId = () => '', childId = () => null, demo = false, quiet = false } = {}) {
  if (mode !== 'remote') {
    return {
      tutor: createMockTutor(),
      tts: voice ? webSpeechTts({ quiet }) : simulatedTts(),
      stt: demo ? loopListener(fakeStt()) : (voice && hasWebSpeechStt() ? loopListener(webSpeechStt()) : null),
    };
  }
  const getToken = tokenGetter(supabase, sessionId, childId);
  return {
    tutor: remoteTutor(supabase),
    tts: voice ? cartesiaTts({ getToken }) : simulatedTts(),
    stt: voice ? cartesiaStt({ getToken }) : null,
  };
}

export default { providersFor, checkProviders, INTERFACE };
