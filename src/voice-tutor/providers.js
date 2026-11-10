// ============================================================================
// THE PROVIDER INTERFACE: one thin layer, so each part can be swapped by a
// setting without touching the board.
//
//   tutor  turn(request) -> a validated turn       mock (scripted, free) | remote (the edge function)
//   tts    speak(text)   -> { words, duration }    simulated (milestone 1: no audio, words at
//                                                  speaking pace) | Cartesia in milestone 3
//   stt    listen()                               typed only in milestone 1 (Deepgram in milestone 3)
//
// The speech clock: tts.speak returns word times relative to the start of the
// sentence, and the player schedules every stroke from them. A real voice in
// milestone 3 returns its own word times in the same shape.
// ============================================================================
import { speakingTimes } from './timeline.js';
import { createMockTutor } from './mockTutor.js';

export const simulatedTts = {
  name: 'simulated',
  hasAudio: false,
  speak: (text) => speakingTimes(text),
};

export const typedStt = { name: 'typed', listens: false };

/** The live tutor through the voice-tutor edge function. Keys stay on the server. */
export const remoteTutor = (supabase) => ({
  name: 'remote',
  async turn(request) {
    const { data, error } = await supabase.functions.invoke('voice-tutor', { body: request });
    if (error) {
      let msg = error.message || 'The tutor could not answer.';
      try { const j = await error.context?.json?.(); if (j?.error) msg = j.error; } catch { /* keep the message */ }
      throw new Error(msg);
    }
    return data;
  },
});

export const providersFor = (mode, supabase) => ({
  tutor: mode === 'remote' ? remoteTutor(supabase) : createMockTutor(),
  tts: simulatedTts,
  stt: typedStt,
});

export default { providersFor, simulatedTts, remoteTutor };
