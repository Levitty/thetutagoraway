// ============================================================================
// THE BOARD'S STATE: what is drawn, and the one function that changes it.
//
// applyStep(board, step, at) is the only way a command reaches the board. It
// takes a step that validateTurn already passed, and checks the board rules
// again against the board as it really is (an id must exist, a slot must be
// free, 30 items at most), because the browser's board is the truth.
//
// The child's ink is `board.childInk` (ink.js changes it) and nothing here touches
// it: `clear` removes tutor items only, after saving a snapshot.
// Pure: no React, no clock. `at` is the speech clock's time the stroke began,
// which Board.jsx uses to draw it on.
// ============================================================================
import { DRAWN, MAX_BOARD_ITEMS, cellsOf, resolveSlot, partsOf } from './commands.js';
import { emptyInk, inkCells } from './ink.js';

export const emptyBoard = () => ({
  items: {}, order: [], marks: [], pointer: null, ask: null, phase: null,
  diagnoses: [], snapshots: [], childInk: emptyInk(), ended: null, log: [],
});

const usedCells = (board) => new Set(board.order.flatMap((id) => cellsOf(board.items[id].slot)));

/** Tutor items as validateTurn wants them: [{ id, cmd, slot, ... }]. */
export const boardSummary = (board) => board.order.map((id) => {
  const { at, ...rest } = board.items[id];
  return rest;
});

export function applyStep(board, step, at = 0, H = 640) {
  const b = { ...board, log: board.log };
  const refuse = (reason) => ({ ...b, log: [...b.log, { at, cmd: step.cmd, reason }] });
  if (DRAWN.includes(step.cmd)) {
    if (b.items[step.id]) return refuse(`id ${step.id} is already on the board`);
    if (b.order.length >= MAX_BOARD_ITEMS) return refuse('the board is full');
    const slot = resolveSlot(usedCells(b), step.slot, new Set(inkCells(b.childInk, H)));
    if (!slot) return refuse('no free slot');
    return { ...b, items: { ...b.items, [step.id]: { ...step, slot, at } }, order: [...b.order, step.id] };
  }
  switch (step.cmd) {
    case 'highlight': case 'underline': {
      const it = b.items[step.target];
      if (!it) return refuse(`${step.target} is not on the board`);
      if (step.part && step.part > partsOf(it, step.bar)) return refuse('part out of range');
      return { ...b, marks: [...b.marks, { ...step, at }] };
    }
    case 'point': {
      if (!b.items[step.target]) return refuse(`${step.target} is not on the board`);
      return { ...b, pointer: { ...step, at } };
    }
    case 'erase': {
      const gone = new Set(step.targets);
      const items = { ...b.items };
      for (const id of gone) delete items[id];
      return {
        ...b, items, order: b.order.filter((id) => !gone.has(id)),
        marks: b.marks.filter((m) => !gone.has(m.target)),
        pointer: b.pointer && gone.has(b.pointer.target) ? null : b.pointer,
      };
    }
    case 'clear':
      // Snapshot first, then tutor ink only. childInk is left exactly as it was.
      return {
        ...b, items: {}, order: [], marks: [], pointer: null,
        snapshots: [...b.snapshots, { at, items: b.items, order: b.order, marks: b.marks }],
      };
    case 'ask': {
      // The browser only ever has the public half: the hidden answer is sealed.
      const { expected, accepts, wrong, ...pub } = step;
      return { ...b, ask: { ...pub, at } };
    }
    case 'set_phase': return { ...b, phase: step.phase };
    case 'record_diagnosis': return { ...b, diagnoses: [...b.diagnoses, { ...step, at }] };
    case 'end_session': return { ...b, ended: { summary: step.summary, at } };
    default: return b; // say and pause_for_child do not change the board
  }
}

/**
 * The board's height on an upright phone (it is always 1000 wide): about 36% of the
 * screen's height, so the conversation keeps room for the current sentence whole.
 * Between 600 and 1000; wide screens use 640.
 */
export const portraitBoardH = (w, h) => Math.max(600, Math.min(1000, Math.round((1000 * 0.36 * h) / Math.max(1, w - 16))));

/** Progress (0..1) of a stroke that began at `at`, at time `now`. */
export const drawProgress = (at, dur, now) => (dur <= 0 || now == null ? 1 : Math.max(0, Math.min(1, (now - at) / dur)));

export default { emptyBoard, applyStep, boardSummary, drawProgress };
