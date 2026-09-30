// Read-aloud for the Grade 4+ practice screen (the young lessons have their
// own). Kenyan children learn maths in their second language; hearing the
// question separates "can't read it" from "can't do it" (research:
// docs/qa/research/learning-science.md §7). Uses the device's own voice,
// preferring Kenyan or British English; speech is an extra, never required.

let voice = null;
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  voice = vs.find(v => /en[-_]KE/i.test(v.lang)) || vs.find(v => /en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// Maths symbols as words a listener understands.
export const speakable = (t) => String(t || '')
  .replace(/(\d)\s*\/\s*(\d)/g, '$1 over $2')
  .replace(/(\d)\^(\d)/g, '$1 to the power $2')
  .replace(/²/g, ' squared').replace(/³/g, ' cubed').replace(/√/g, ' the square root of ')
  .replace(/\bsh\s?(?=\d)/gi, 'shillings ').replace(/km\/h/g, 'kilometres per hour')
  .replace(/(\d)\s?km\b/g, '$1 kilometres').replace(/(\d)\s?cm²/g, '$1 square centimetres').replace(/(\d)\s?m²/g, '$1 square metres')
  .replace(/(\d)\s?cm\b/g, '$1 centimetres').replace(/(\d)\s?kg\b/g, '$1 kilograms').replace(/(\d)\s?ml\b/g, '$1 millilitres')
  .replace(/%/g, ' percent').replace(/°C/g, ' degrees Celsius').replace(/°/g, ' degrees')
  .replace(/\s\+\s/g, ' plus ').replace(/\s[−-]\s/g, ' minus ').replace(/−(?=\d)/g, 'minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
  .replace(/=\s*\?/g, ' equals what?').replace(/\s=\s/g, ' equals ').replace(/☐|\?(?=\s*\/)/g, ' blank ')
  .replace(/\s+/g, ' ').trim();

export function speak(text, { rate = 0.92 } = {}) {
  if (!canSpeak() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(speakable(text));
    if (voice) u.voice = voice;
    u.rate = rate;
    window.speechSynthesis.speak(u);
  } catch { /* an extra, never a dependency */ }
}

export const stopSpeaking = () => { try { if (canSpeak()) window.speechSynthesis.cancel(); } catch { /* ignore */ } };

// Everything a child would need to hear for one question.
export function questionScript(problem) {
  if (!problem) return '';
  const parts = [problem.question];
  if (problem.shownSteps) problem.shownSteps.forEach((s, i) => parts.push(`Step ${i + 1}. ${s}.`));
  if (problem.parts) problem.parts.forEach((p, i) => parts.push(`Part ${String.fromCharCode(97 + i)}. ${p.prompt}`));
  if (problem.mc && !problem.shownSteps) parts.push(`Is it: ${problem.mc.map((o, i) => `${'ABCD'[i]}, ${o}`).join('; ')}?`);
  return parts.join(' ');
}
