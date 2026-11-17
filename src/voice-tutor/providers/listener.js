// ============================================================================
// ONE LISTENING SESSION FOR THE LESSON, over a listener that hears one utterance at a time
// (the browser's own speech recognition in practice mode, and the demo's typed-as-speech).
// Live mode's Ink listener (cartesiaStt.js) is continuous itself; this gives the others the
// same open() so the page has one way to listen:
//   open(h) -> { setMode('child'|'tutor'|'off'), say(text), close() }
// In 'child' mode an utterance is always being listened for: when one ends (with words or
// without), the next starts at once. In 'tutor' mode nothing is listened to (the browser's
// voice would be heard), except the demo child, who may speak over HOREB (say()). What was
// heard passes the same gate as live mode (childVoice.js utteranceGate: thinking aloud is held).
// ============================================================================
import { utteranceGate } from '../childVoice.js';

export function loopListener(stt, timers = {}) {
  const later = timers.schedule || ((fn, ms) => setTimeout(fn, ms));
  return {
    ...stt,
    continuous: true,
    open(h = {}) {
      let mode = 'off'; let closed = false; let cur = null; let fails = 0;
      const gate = utteranceGate({ onSend: (t, s) => h.onUtterance?.(t, s), onDrop: (t) => h.onNoise?.(t), schedule: timers.schedule, cancel: timers.cancel });
      const begin = () => {
        if (closed || mode !== 'child' || cur) return null;
        const mine = stt.start({
          onSpeech: () => { gate.speech(); h.onSpeech?.(); },
          onPartial: (t) => h.onPartial?.(`${gate.held()} ${t}`.trim()),
          onPause: () => h.onPause?.(),
          pace: h.pace,
          onFinal: (said, seconds) => {
            if (cur === mine) cur = null;
            fails = 0;
            if (String(said || '').trim()) gate.final(said, seconds);
            // The next utterance is listened for at once (a short breath, so a browser listener can restart).
            later(begin, 120);
          },
          onError: (kind, detail) => { if (cur === mine) cur = null; fails += 1; if (fails >= 3 || kind === 'mic-denied' || kind === 'mic-missing') { mode = 'off'; h.onError?.(kind, detail); } else later(begin, 600); },
        });
        cur = mine;
        return mine;
      };
      const stopCur = () => { const c = cur; cur = null; c?.cancel?.(); };
      return {
        get mode() { return mode; },
        setMode(m) {
          if (closed || m === mode) return;
          mode = m;
          if (m === 'child') begin(); else { stopCur(); if (m === 'off') gate.clear(); }
        },
        /** The demo child speaks (typed words heard as speech). Over HOREB, that is a barge-in. */
        say(text) {
          if (closed || mode === 'off') return;
          if (mode === 'tutor') { h.onBargeIn?.(); mode = 'child'; }
          stopCur();
          const c = begin();
          c?.say?.(text);
        },
        close() { closed = true; mode = 'off'; stopCur(); gate.clear(); },
      };
    },
  };
}

export default { loopListener };
