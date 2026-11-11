// ============================================================================
// THE PRACTICE VOICE, FREE (owner, 11 Nov 2026): the browser's own speech.
//
//   webSpeechTts   speechSynthesis. If the browser has ANY English voice, HOREB
//                  speaks (owner, 11 Nov 2026: silence is the worst outcome).
//                  Each sentence is one utterance. Word times: from the voice's
//                  word boundary events when it sends them; otherwise estimated
//                  from the sentence's real start (onstart) and this voice's
//                  speaking pace, learned from every sentence it finishes and
//                  re-anchored at each sentence's start and end, so drift never
//                  builds up across a turn. Which of the two is in use is learned
//                  from the first real sentence and shown in the tester view.
//                  Voice: a local English voice first (Kenya, then British, South
//                  African, other English), then network voices; never a novelty
//                  voice. Only a browser with no voice at all goes silent (said so).
//   webSpeechStt   SpeechRecognition (Chrome, Safari): press to talk, partial
//                  words, end of speech by the browser. Where there is none,
//                  the child types, and the page says so.
// Same interface as cartesia.js / cartesiaStt.js (providers/index.js).
// ============================================================================

// Voices made for fun or effect, never for teaching a child.
const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|ralph|fred|junior|kathy|princess|pipe organ|grandma|grandpa|rocko)\b/i;
const LANG_RANK = { 'en-ke': 50, 'en-gb': 40, 'en-za': 38, 'en-ie': 32, 'en-au': 30, 'en-nz': 30, 'en-in': 28, 'en-us': 26 };

/** English voices for a Kenyan child, best first: Kenyan, British, other English; local voices
 *  (they send word boundaries) ahead of network ones; never a novelty voice. */
export function rankVoices(voices = []) {
  const score = (v) => {
    const lang = String(v.lang || '').toLowerCase().replace('_', '-');
    // A voice on the device always beats a network one (they speak at once and keep better time).
    return (v.localService ? 100 : 0) + (LANG_RANK[lang] ?? 20) + (v.default ? 1 : 0);
  };
  return voices
    .filter((v) => String(v.lang || '').toLowerCase().startsWith('en') && !NOVELTY.test(String(v.name || '')))
    .map((v, i) => ({ v, s: score(v), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.v);
}
/** The best voice, or null. */
export const pickVoice = (voices = []) => rankVoices(voices)[0] || null;

/** The word a boundary event points at. */
export const wordAt = (text, charIndex, charLength) => {
  const rest = String(text).slice(charIndex);
  return (charLength ? rest.slice(0, charLength) : (rest.match(/^\S+/) || [''])[0]).trim();
};

export const VOICE_LIST_WAIT_MS = 2500;   // for the voice list to load ('voiceschanged')
export const START_MS_PER_CHAR = 68;      // a first guess at the pace (rate 0.95), until the voice has finished a sentence
const PAUSE_CHARS = { ',': 3, ';': 4, ':': 4, '.': 5, '?': 5, '!': 5 };

/**
 * Estimated word times for a sentence at `msPerChar`, in ms from its start: each word takes
 * its letters plus a space, with a little more after a comma or a full stop.
 */
export function estimateWords(text, msPerChar = START_MS_PER_CHAR) {
  const words = [];
  let at = 0;
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const len = (word.length + 1) * msPerChar;
    words.push({ word, start: Math.round(at), end: Math.round(at + len) });
    at += len + (PAUSE_CHARS[word.slice(-1)] || 0) * msPerChar;
  }
  return { words, duration: Math.round(at) };
}
/** Estimated characters of a sentence, as estimateWords counts them (for learning the pace). */
const paceChars = (text) => estimateWords(text, 1).duration;

/**
 * @param {{ quiet?: boolean }} [o]  quiet: speak at volume 0 (screen recordings only: the
 *   voice still runs and still times the board) and log when each sentence started in
 *   window.__vtSpeech, so a recording's sound can be added after.
 */
export function webSpeechTts({ quiet = false } = {}) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  let voice = null;
  let usable = false;
  let timing = null;            // 'boundary' | 'estimated', learned from the first real sentence
  let msPerChar = START_MS_PER_CHAR;
  const now = () => performance.now();
  // The voice list loads asynchronously ('voiceschanged'), sometimes in two batches (network
  // voices first, the device's own later). Wait for it before choosing.
  const voicesNow = () => new Promise((resolve) => {
    const hasLocalEnglish = (vs) => vs.some((v) => v.localService && String(v.lang || '').toLowerCase().startsWith('en'));
    let done = false;
    const finish = () => { if (done) return; done = true; synth.removeEventListener?.('voiceschanged', onChange); resolve(synth.getVoices()); };
    const onChange = () => { if (hasLocalEnglish(synth.getVoices())) finish(); };
    if (hasLocalEnglish(synth.getVoices())) { finish(); return; }
    synth.addEventListener?.('voiceschanged', onChange);
    setTimeout(finish, VOICE_LIST_WAIT_MS);
  });
  const utter = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-GB';
    u.rate = 0.95; u.pitch = 1;
    if (quiet) u.volume = 0;
    return u;
  };

  return {
    name: 'browser-voice',
    hasAudio: true,
    get voiceName() { return voice ? `${voice.name} (${voice.lang}${voice.localService ? ', on this device' : ', online'})` : 'the browser\'s own English voice'; },
    /** 'boundary' (the voice's own word times), 'estimated' (from its pace), or null before the first sentence. */
    get timingMode() { return timing; },
    clock: now,
    /**
     * From the Start press. A blank utterance goes out inside the tap (some browsers allow
     * speech only after a tap; this decides nothing). Then the voice is chosen once the list
     * has loaded. { ok:false, reason:'no-voice' } only when the browser truly has no English voice.
     */
    unlock() {
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return Promise.resolve({ ok: false, reason: 'no-voice' });
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch { /* fine */ }
      return voicesNow().then((vs) => {
        voice = pickVoice(vs);
        // A list with voices but none English: no voice for HOREB. An empty list (some browsers
        // never list them): the default voice, asked for in British English.
        usable = !!voice || vs.length === 0;
        return usable ? { ok: true, reason: null } : { ok: false, reason: 'no-voice' };
      });
    },
    open() {
      const S = [];
      let t0 = null; let version = 0; let stopped = false; let ended = false;
      let readyRes; let readyRej;
      const ready = new Promise((res, rej) => { readyRes = res; readyRej = rej; });
      const failSafe = setTimeout(() => { if (t0 == null && S.length) readyRej(new Error('the browser did not speak')); }, 6000);
      const stream = {
        ready,
        failed: false,
        version: () => version,
        timing: (k) => (S[k] ? { start: S[k].start, words: S[k].words, duration: S[k].duration, complete: S[k].complete } : { start: null, words: [], duration: null, complete: false }),
        add(text) {
          if (stopped) return;
          const s = { text, start: null, words: [], duration: null, complete: false, at: 0, heardWords: 0 };
          S.push(s);
          const u = utter(text);
          u.onstart = () => {
            const n = now();
            if (t0 == null) { t0 = n; clearTimeout(failSafe); readyRes(t0); }
            s.at = n;
            // Re-anchored on its real start: estimated times count from here, so drift never carries over.
            s.start = n - t0;
            if (timing !== 'boundary') s.words = estimateWords(text, msPerChar).words;
            version += 1;
            if (quiet) (window.__vtSpeech = window.__vtSpeech || []).push({ text, at: performance.timeOrigin + n, voice: voice?.name || null, rate: 0.95 });
          };
          u.onboundary = (e) => {
            if (e.name && e.name !== 'word') return;
            const w = wordAt(text, e.charIndex, e.charLength);
            if (!w) return;
            const at = now() - s.at;
            // The voice sends word times: they replace the estimate, from this sentence on.
            if (!s.heardWords) { s.words = []; timing = 'boundary'; }
            if (s.words.length) s.words[s.words.length - 1].end = at;
            s.words.push({ word: w, start: at, end: at + 250 });
            s.heardWords += 1;
            version += 1;
          };
          u.onend = () => {
            const dur = now() - s.at;
            s.duration = dur;
            if (!s.heardWords) {
              if (timing == null) timing = 'estimated';
              // Learn this voice's pace from what it really took, for the next sentence.
              const chars = paceChars(text);
              if (chars > 0 && dur > 200) msPerChar = Math.round(0.5 * msPerChar + 0.5 * (dur / chars));
            } else if (s.words.length) s.words[s.words.length - 1].end = dur;
            s.complete = true; version += 1;
          };
          u.onerror = (e) => {
            if (e.error === 'interrupted' || e.error === 'canceled') return;
            stream.failed = true;
            if (t0 == null) { clearTimeout(failSafe); readyRej(new Error(e.error || 'speech failed')); return; }
            s.duration = s.duration ?? (now() - (s.at || now())); s.complete = true; version += 1;
          };
          synth.speak(u);
        },
        end() { ended = true; },
        get ended() { return ended; },
        stop() { stopped = true; clearTimeout(failSafe); synth.cancel(); },
      };
      return stream;
    },
    stop() { synth?.cancel(); },
    close() { synth?.cancel(); },
  };
}

/** Listening with the browser's own speech recognition, where there is one. */
export const hasWebSpeechStt = () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export function webSpeechStt() {
  const R = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  return {
    name: 'browser-listening',
    listens: true,
    async prepare() {},
    start(h = {}) {
      let done = false; let finals = ''; let spoke = 0;
      const rec = new R();
      rec.lang = 'en-KE'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      const finish = () => { if (done) return; done = true; h.onFinal?.(finals.trim(), spoke ? (performance.now() - spoke) / 1000 : 0); };
      rec.onspeechstart = () => { if (!spoke) spoke = performance.now(); h.onSpeech?.(); };
      rec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i += 1) {
          const r = e.results[i];
          if (r.isFinal) finals += `${r[0].transcript} `; else interim += r[0].transcript;
        }
        if (!spoke) spoke = performance.now();
        h.onPartial?.(`${finals}${interim}`.trim());
      };
      rec.onerror = (e) => {
        if (done) return;
        if (e.error === 'no-speech' || e.error === 'aborted') { finish(); return; }
        done = true;
        h.onError?.(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'mic-denied' : e.error === 'audio-capture' ? 'mic-missing' : 'listen-failed');
      };
      rec.onend = finish;
      try { rec.start(); } catch { done = true; h.onError?.('listen-failed'); }
      return { stop() { try { rec.stop(); } catch { /* stopped */ } }, cancel() { done = true; try { rec.abort(); } catch { /* stopped */ } } };
    },
    close() {},
  };
}

export default { webSpeechTts, webSpeechStt, pickVoice, rankVoices, estimateWords, hasWebSpeechStt };
