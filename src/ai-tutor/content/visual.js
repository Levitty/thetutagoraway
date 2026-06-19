// ============================================================================
// VISUAL ANSWER MODE — content whose answer is an INTERACTION, not text.
//
// Design: a structured problem carries a `visual` spec —
//   { type, data, check, target, tolerance }
// The lesson renders the widget (InteractiveVisual) from `visual.data`; the
// student's interaction produces structured data; `checkVisualAnswer` compares
// it to `visual.target`. Crucially every visual problem ALSO carries a text
// `answer`/`accepts` (the coordinate written out) so it degrades gracefully:
//   · the diagnostic and any non-visual surface still work (type the answer)
//   · the quality gate verifies it via the `point` kind (no UI needed)
//   · the student can CLICK or TYPE
//
// This first slice is the coordinate grid (plot a point), which unlocks
// coordinate geometry and transformations. New `check`/`type` pairs extend it.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const BOUNDS = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const coordStr = (x, y) => `(${x}, ${y})`;
const coordAccepts = (x, y) => accepts(`(${x},${y})`, `(${x}, ${y})`, `${x},${y}`, `${x}, ${y}`);

// Compare a student's structured answer to the spec. Returns true/false.
export function checkVisualAnswer(given, visual) {
  if (!given || !visual) return false;
  if (visual.check === 'point') {
    const t = visual.tolerance ?? 0.4;
    return Math.abs(given.x - visual.target.x) <= t && Math.abs(given.y - visual.target.y) <= t;
  }
  if (visual.check === 'fraction-bar') {
    if (given.total == null) return false;
    return Math.abs(given.shaded / given.total - visual.target) <= (visual.tolerance ?? 0.001);
  }
  if (visual.check === 'number-line') {
    if (given.value == null) return false;
    return Math.abs(given.value - visual.target) <= (visual.tolerance ?? 0.001);
  }
  return false;
}

// Assemble a point-plotting problem (text-answerable + visual).
const pointProblem = ({ type, instruction, question, target, markers, hints, steps, misconceptions }) => ({
  type,
  instruction,
  question,
  answer: coordStr(target.x, target.y),
  accepts: coordAccepts(target.x, target.y),
  hints,
  solution: { steps, answer: coordStr(target.x, target.y) },
  misconceptions: misconceptions || [],
  visual: { type: 'plot_point', data: { bounds: BOUNDS, markers: markers || [] }, check: 'point', target, tolerance: 0.4 },
  verify: { kind: 'point', x: target.x, y: target.y },
});

// ---- plot a given coordinate ----
export function buildPlotPoint() {
  const x = randInt(-5, 5), y = randInt(-5, 5);
  return pointProblem({
    type: 'plot-point',
    instruction: 'Plot the point on the grid.',
    question: `Plot the point ${coordStr(x, y)}.`,
    target: { x, y },
    hints: hintLadder(
      'The first number is x (left/right), the second is y (up/down).',
      `Go ${Math.abs(x)} ${x >= 0 ? 'right' : 'left'} along the x-axis.`,
      `Then ${Math.abs(y)} ${y >= 0 ? 'up' : 'down'}.`,
    ),
    steps: [
      { text: `Start at the origin. Move ${Math.abs(x)} ${x >= 0 ? 'right' : 'left'}.`, expr: `x = ${x}` },
      { text: `Then move ${Math.abs(y)} ${y >= 0 ? 'up' : 'down'}.`, expr: coordStr(x, y) },
    ],
    misconceptions: [{ when: coordStr(y, x), feedback: 'Coordinates are (x, y) — x first (across), then y (up). Don’t swap them.' }],
  });
}

// ---- reflect a point in an axis ----
export function buildReflectPoint() {
  const a = randInt(-5, 5) || 1, b = randInt(-5, 5) || 1;
  const axis = pick(['x', 'y']);
  const target = axis === 'x' ? { x: a, y: -b } : { x: -a, y: b };
  return pointProblem({
    type: 'reflect-point',
    instruction: 'Plot the image after the reflection.',
    question: `Plot the image of ${coordStr(a, b)} after reflection in the ${axis}-axis.`,
    target,
    markers: [{ x: a, y: b, label: 'P' }],
    hints: hintLadder(
      `Reflecting in the ${axis}-axis flips the ${axis === 'x' ? 'y' : 'x'}-coordinate's sign.`,
      axis === 'x' ? 'The x stays the same; the y becomes its opposite.' : 'The y stays the same; the x becomes its opposite.',
      `So ${coordStr(a, b)} → ${coordStr(target.x, target.y)}.`,
    ),
    steps: [
      { text: `Reflection in the ${axis}-axis negates the ${axis === 'x' ? 'y' : 'x'}-coordinate.`, expr: `${axis === 'x' ? `y: ${b} → ${-b}` : `x: ${a} → ${-a}`}` },
      { text: 'Plot the image.', expr: coordStr(target.x, target.y) },
    ],
    misconceptions: [{ when: coordStr(-a, -b), feedback: `Reflection in the ${axis}-axis changes only ONE coordinate, not both.` }],
  });
}

// ---- translate a point by a vector ----
export function buildTranslatePoint() {
  let a, b, dx, dy, tx, ty;
  do {
    a = randInt(-4, 4); b = randInt(-4, 4);
    dx = randInt(-4, 4) || 2; dy = randInt(-4, 4) || -2;
    tx = a + dx; ty = b + dy;
  } while (Math.abs(tx) > 6 || Math.abs(ty) > 6);
  return pointProblem({
    type: 'translate-point',
    instruction: 'Plot the image after the translation.',
    question: `Plot the image of ${coordStr(a, b)} after translating by (${dx}, ${dy}).`,
    target: { x: tx, y: ty },
    markers: [{ x: a, y: b, label: 'P' }],
    hints: hintLadder(
      'A translation adds the vector to the coordinates.',
      `Add ${dx} to x and ${dy} to y.`,
      `${coordStr(a, b)} + (${dx}, ${dy}) = ${coordStr(tx, ty)}.`,
    ),
    steps: [
      { text: 'Add the translation vector to the point.', expr: `(${a}+${dx}, ${b}+${dy})` },
      { text: 'Plot the image.', expr: coordStr(tx, ty) },
    ],
  });
}

// ---- midpoint of two points (engineered to be integer) ----
export function buildMidpoint() {
  const ax = randInt(-5, 5), bx = ax + 2 * randInt(-3, 3);   // same parity ⇒ integer midpoint
  const ay = randInt(-5, 5), by = ay + 2 * randInt(-3, 3);
  const tx = (ax + bx) / 2, ty = (ay + by) / 2;
  return pointProblem({
    type: 'midpoint',
    instruction: 'Plot the midpoint.',
    question: `Plot the midpoint of A${coordStr(ax, ay)} and B${coordStr(bx, by)}.`,
    target: { x: tx, y: ty },
    markers: [{ x: ax, y: ay, label: 'A' }, { x: bx, y: by, label: 'B' }],
    hints: hintLadder(
      'The midpoint is the average of the coordinates.',
      `x: (${ax} + ${bx}) ÷ 2.   y: (${ay} + ${by}) ÷ 2.`,
    ),
    steps: [
      { text: 'Average the x-coordinates and the y-coordinates.', expr: `((${ax}+${bx})/2, (${ay}+${by})/2)` },
      { text: 'Plot the midpoint.', expr: coordStr(tx, ty) },
    ],
  });
}

export const VISUAL_CONTENT = {
  G8_COORDINATES:           withWorkedExample(() => (coin() ? buildPlotPoint() : buildMidpoint())),
  G8_TRANSFORMATIONS_INTRO: withWorkedExample(() => (coin() ? buildReflectPoint() : buildTranslatePoint())),
  G9_TRANSFORMATIONS_ADV:   withWorkedExample(() => (coin() ? buildReflectPoint() : buildTranslatePoint())),
};

export const VISUAL_SKILL_IDS = Object.keys(VISUAL_CONTENT);
