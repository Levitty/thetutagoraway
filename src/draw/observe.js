// ============================================================================
// THE TUTOR WATCHING THE CHILD (rendering engine phase 2; rebuilt from the
// sketch branch's src/render/observe.js): what the child did with a figure, as
// plain facts the tutor reads on its next turn. No picture, so it costs a few
// words, not an image.
//
//   startPlay(item)                    the figure as the child finds it
//   act(item, play, control, value, t) the only way a child's action changes a
//                                      figure: only a control the tutor gave,
//                                      checked by the figure's own rules, logged;
//                                      the goal is marked here, by the app
//   summarise(item, play)              what the child did, in order (a drag is
//                                      one move, not thirty), what the figure
//                                      shows now, and whether the goal is met
//                                      and after how many moves
// Pure: no React, no clock (callers pass t). Tested in tests/draw-figures.test.mjs.
// ============================================================================
import { FIGURE, goalMet, goalText } from './figures.js';

export const MAX_LOG = 200;
export const MAX_NOTE = 600;

export const startPlay = (item) => ({ state: FIGURE[item.type].start(item.params), log: [], changes: 0, metAt: null, met: false });

/** The child acts on a figure. Returns the new play, or the same object when the action is not allowed or changes nothing. */
export function act(item, play, control, value, t = 0) {
  if (!item || item.cmd !== 'figure' || !(item.controls || []).includes(control)) return play;
  const type = FIGURE[item.type];
  const cur = play || startPlay(item);
  const r = type.controls[control].act(item.params, cur.state, value);
  if (!r) return play;
  const changes = cur.changes + 1;
  const met = item.goal ? goalMet(item, r.state) : false;
  const log = [...cur.log, { t, control, text: r.text, fold: r.fold || null }].slice(-MAX_LOG);
  return { state: r.state, log, changes, met, metAt: cur.metAt ?? (met ? changes : null) };
}

/** The facts for the tutor, in a sentence or three. */
export function summarise(item, play) {
  const type = FIGURE[item.type];
  const cur = play || startPlay(item);
  const now = type.describe(item.params, cur.state, item.controls || []);
  const goal = item.goal ? goalText(item) : null;
  if (!cur.changes) return clip(`The child has not touched the ${type.title} yet. It shows ${now}.${goal ? ` Their task: ${goal}. Not done yet.` : ''}`);
  // A run of the same drag is one move: only where it ended counts.
  const moves = [];
  for (const e of cur.log) {
    const last = moves[moves.length - 1];
    if (last && e.fold && last.fold === e.fold) last.text = e.text; else moves.push({ ...e });
  }
  const told = moves.slice(-6).map((m) => m.text);
  const left = moves.length - told.length;
  const met = !goal ? '' : cur.met ? ` Their task (${goal}): done${cur.metAt ? `, first after ${cur.metAt} move${cur.metAt === 1 ? '' : 's'}` : ''}.`
    : cur.metAt ? ` Their task (${goal}): done after ${cur.metAt} moves, but undone since.` : ` Their task (${goal}): not done yet.`;
  return clip(`The child ${told.join(', then ')}${left > 0 ? ` (after ${left} earlier moves)` : ''}. It shows ${now}.${met}`);
}
const clip = (s) => (s.length > MAX_NOTE ? `${s.slice(0, MAX_NOTE - 3)}...` : s);

/** The notes for every figure on the board the child could handle: [{ id, note }], for the next turn. */
export const figureNotes = (board) => board.order
  .map((id) => board.items[id])
  .filter((it) => it.cmd === 'figure' && it.controls?.length)
  .slice(-3)
  .map((it) => ({ id: it.id, note: summarise(it, board.play?.[it.id]) }));

export default { startPlay, act, summarise, figureNotes, MAX_LOG };
