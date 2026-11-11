// ============================================================================
// THE FREE VOICE (scripted mode, and the fallback when there is no real voice).
//
//   simulatedTts   no audio: word times at speaking pace (speakingTimes), the
//                  page's own clock. The board moves exactly as it will with
//                  real audio, because only the word times differ.
//   fakeStt        typed text "spoken": speech starts at once (so barge-in
//                  happens), the words appear one by one as partials, then
//                  end-of-speech gives the final text, as Deepgram does.
// Same interface as cartesia.js and deepgram.js (see providers/index.js).
// ============================================================================
import { speakingTimes } from '../timeline.js';

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export const simulatedTts = () => ({
  name: 'simulated',
  hasAudio: false,
  clock: now,
  async unlock() {},
  /** Every sentence is known at once: speaking-pace word times, ready now. */
  speak(texts) {
    const t = texts.map((text) => ({ ...speakingTimes(text), complete: true }));
    return { ready: Promise.resolve(now()), timing: (k) => t[k], version: () => 1, failed: false, stop() {} };
  },
  stop() {},
  close() {},
});

export const PARTIAL_MS = 220;   // one word of "speech"
export const END_OF_SPEECH_MS = 450;

/** @param {{ schedule?: (fn:Function, ms:number)=>any, cancel?: (id:any)=>void }} [timers] for tests */
export const fakeStt = (timers = {}) => {
  const schedule = timers.schedule || ((fn, ms) => setTimeout(fn, ms));
  const cancel = timers.cancel || ((id) => clearTimeout(id));
  return {
    name: 'typed-as-speech',
    listens: true,
    async prepare() {},
    start(h = {}) {
      const ids = [];
      let done = false;
      const finish = (text, seconds) => { if (done) return; done = true; ids.forEach(cancel); h.onFinal?.(text, seconds); };
      return {
        say(text) {
          const words = String(text || '').trim().split(/\s+/).filter(Boolean);
          if (!words.length) { finish('', 0); return; }
          h.onSpeech?.();
          words.forEach((_, i) => ids.push(schedule(() => !done && h.onPartial?.(words.slice(0, i + 1).join(' ')), PARTIAL_MS * (i + 1))));
          ids.push(schedule(() => finish(words.join(' '), (PARTIAL_MS * words.length + END_OF_SPEECH_MS) / 1000), PARTIAL_MS * words.length + END_OF_SPEECH_MS));
        },
        stop() { finish('', 0); },
        cancel() { done = true; ids.forEach(cancel); },
      };
    },
    close() {},
  };
};

export default { simulatedTts, fakeStt };
