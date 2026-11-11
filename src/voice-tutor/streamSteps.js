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
            try { out.push(JSON.parse(raw)); } catch { out.push({ __bad: raw.slice(0, 200) }); }
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
