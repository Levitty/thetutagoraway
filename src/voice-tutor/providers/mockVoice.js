// ============================================================================
// THE FREE VOICE (scripted mode, and the fallback when there is no real voice).
//
//   simulatedTts   no audio: word times at speaking pace (speakingTimes), the
//                  page's own clock. Used only where the browser has no voice
//                  that sends word times (the page says so), and in tests.
//   fakeStt        typed text "spoken", for the self-playing demo (?demo=auto)
//                  and tests: speech starts at once (so barge-in happens), the
//                  words appear one by one as partials, then end of speech
//                  gives the final text, as a real listener does.
// Same interface as the other providers (providers/index.js).
// ============================================================================
import { speakingTimes, SENTENCE_GAP_MS } from '../timeline.js';

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export const simulatedTts = () => ({
  name: 'simulated',
  hasAudio: false,
  clock: now,
  async unlock() { return { ok: true, reason: null }; },
  /** Each sentence is timed at speaking pace the moment it arrives; ready on the first. */
  open() {
    const S = [];
    let t0 = null; let v = 0; let res;
    const ready = new Promise((r) => { res = r; });
    return {
      ready, failed: false,
      version: () => v,
      timing: (k) => S[k] || { start: null, words: [], duration: null, complete: false },
      add(text) {
        const n = now();
        if (t0 == null) { t0 = n; res(t0); }
        const prev = S[S.length - 1];
        // After the sentence before (and the gap), or now if this one came late.
        const start = Math.max(prev ? prev.start + prev.duration + SENTENCE_GAP_MS : 0, n - t0);
        S.push({ start, ...speakingTimes(text), complete: true });
        v += 1;
      },
      end() {},
      stop() {},
    };
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
