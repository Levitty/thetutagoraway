// ============================================================================
// THE TURN ON THE WIRE (milestone 3b): the voice-tutor function streams a turn
// as one JSON event per line (meta, step, step, ..., end). Each step is sent
// only after the server has checked it, so the page can speak and draw it at
// once. lines() splits text into whole lines as it arrives; readTurnStream()
// reads a fetch body and calls onEvent for each event.
// ============================================================================
export function lines() {
  let rest = '';
  return (chunk) => {
    rest += chunk;
    const parts = rest.split('\n');
    rest = parts.pop();
    return parts.map((l) => l.trim()).filter(Boolean);
  };
}

/** @returns {Promise<object>} the `end` event (or an error event if the line broke) */
export async function readTurnStream(body, onEvent) {
  const reader = body.getReader();
  const dec = new TextDecoder();
  const split = lines();
  let end = null;
  const take = (l) => {
    let ev; try { ev = JSON.parse(l); } catch { return; }
    if (ev.type === 'end') end = ev;
    onEvent?.(ev);
  };
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    split(dec.decode(value, { stream: true })).forEach(take);
  }
  split('\n').forEach(take);
  if (!end) { end = { type: 'end', guard: ['connection-lost'], broken: true }; onEvent?.(end); }
  return end;
}

export default { lines, readTurnStream };
