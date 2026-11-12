// ============================================================================
// STEPS FROM A STREAM (milestone 3b): the model's turn arrives as JSON text a
// few characters at a time ({"steps":[{...},{...}]}). stepParser() is fed the
// text as it comes and hands back each step the moment its closing brace
// arrives, so a sentence can be checked, spoken and drawn while the model is
// still writing the next one.
//
// It only reads what the structured-output schema produces: one object with a
// "steps" array of objects. Strings (with escapes) are respected, so a brace
// inside a sentence never ends a step. A step that is not valid JSON is passed
// on as { __bad: text } so it can be dropped and logged like any other.
// Pure. Tested in tests/voice-tutor-stream.test.mjs.
// ============================================================================
// A step that is almost JSON (a raw line break inside a sentence, a trailing comma) is mended once; otherwise it is
// passed on as { __bad } with its text, which the tester view shows (12 Nov 2026).
export function repairStep(raw) {
  let t = ''; let inStr = false; let esc = false;
  for (const c of raw) {
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; else if (c === '\n' || c === '\r') { t += ' '; continue; } }
    else if (c === '"') inStr = true;
    t += c;
  }
  t = t.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(t); } catch { return { __bad: raw.slice(0, 200) }; }
}

export function stepParser() {
  let buf = '';
  let i = 0;
  let inArray = false;   // inside "steps": [ ... ]
  let depth = 0;         // object depth inside the array (1 = a step)
  let inString = false;
  let escaped = false;
  let start = -1;        // where the current step began in buf
  let keyAt = -1;
  return {
    /** Feed more text; returns the steps completed by it. */
    push(text) {
      buf += String(text || '');
      const out = [];
      for (; i < buf.length; i += 1) {
        const c = buf[i];
        if (inString) {
          if (escaped) escaped = false;
          else if (c === '\\') escaped = true;
          else if (c === '"') inString = false;
          continue;
        }
        if (c === '"') { inString = true; continue; }
        if (!inArray) {
          if (keyAt < 0) { const k = buf.indexOf('"steps"'); if (k >= 0 && k < i) keyAt = k; }
          if (keyAt >= 0 && c === '[') inArray = true;
          continue;
        }
        if (c === '{') { if (depth === 0) start = i; depth += 1; continue; }
        if (c === '}') {
          depth -= 1;
          if (depth === 0 && start >= 0) {
            const raw = buf.slice(start, i + 1);
            try { out.push(JSON.parse(raw)); } catch { out.push(repairStep(raw)); }
            start = -1;
          }
          continue;
        }
        if (c === ']' && depth === 0) inArray = false;
      }
      return out;
    },
    /** All the text so far (for logs). */
    text: () => buf,
  };
}

export default { stepParser };
