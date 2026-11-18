// ============================================================================
// IS THE WORKED EXAMPLE THE SAME KIND OF QUESTION? (feedback F11)
//
// A child who taps "show me how" must see how to do THIS kind of question with
// other numbers. withWorkedExample draws the example from the same generator,
// and a generator that picks among variants could pick another variant: a pie
// chart under a travel graph, a cone under a pyramid, alternate angles under
// co-interior. One rule, used wherever an example is chosen.
// ============================================================================

// How many times an example is redrawn before the last draw is kept. The
// question snapshot test sets it to 0: it fingerprints the questions, and the
// example choice is tested on its own (tests/worked-example-kind.test.mjs).
export const EXAMPLE_REDRAWS = { max: 60 };

// Instruction with numbers and single letters ignored.
export const instructionKind = (t) =>
  String(t || '').trim().toLowerCase().replace(/\d+/g, '#').replace(/\b[a-z]\b/g, '_');

// Words that name what a question is about. If the question names exactly one
// word from a group, the example must not name a different one from it.
export const KIND_GROUPS = [
  ['cone', 'cylinder', 'sphere', 'cuboid', 'prism', 'pyramid', 'hemisphere'],
  ['vertically opposite', 'corresponding', 'alternate', 'co-interior', 'allied'],
  ['mean', 'median', 'mode', 'range'],
  ['arc', 'sector'],
  ['hire purchase', 'vat', 'paye', 'commission', 'discount', 'standing charge'],
  ['p\\.m\\.', 'a\\.m\\.'],
].map((g) => g.map((w) => [w, new RegExp(`\\b${w}\\b`)]));

const stepWords = (st) => (typeof st === 'string' ? st : `${st?.text || ''} ${st?.expr || ''}`);
const questionText = (p) => `${p.instruction || ''} ${p.question || ''}`.toLowerCase();
const exampleText = (ex) =>
  [ex.question, ex.instruction, ...(ex.solution?.steps || []).map(stepWords)].filter(Boolean).join(' ').toLowerCase();

const sameQuestion = (a, b) =>
  JSON.stringify([a.question, a.model, a.visual, a.picture]) === JSON.stringify([b.question, b.model, b.visual, b.picture]);

// Why `ex` is not a fair worked example for `p`, or null if it is.
export function exampleMismatch(p, ex) {
  if (!ex) return 'no example';
  if (instructionKind(ex.instruction) !== instructionKind(p.instruction)) return 'another instruction';
  if (p.type && ex.type && p.type !== ex.type) return 'another type';
  if (sameQuestion(ex, p)) return 'the same question';
  const q = questionText(p), w = exampleText(ex);
  for (const group of KIND_GROUPS) {
    const inQ = group.filter(([, re]) => re.test(q));
    if (inQ.length !== 1) continue;
    const inW = group.filter(([, re]) => re.test(w));
    if (inW.length && !inW.some(([word]) => word === inQ[0][0])) return `about ${inW.map(([x]) => x).join(', ')}, not ${inQ[0][0]}`;
  }
  return null;
}
