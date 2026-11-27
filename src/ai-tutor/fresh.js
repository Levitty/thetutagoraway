// A sitting never shows the same question twice (F14).
//
// What a child would call "the same question": the same instruction, the same
// question text and the same picture. A re-ask of a wrong answer keeps the
// problem on screen and never comes through here, so it is not affected.

const pictureKey = (v) => {
  if (v == null) return '';
  try { return JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : x)).slice(0, 400); }
  catch { return String(v.type || ''); }
};

export const questionKey = (p) =>
  p ? `${p.instruction || ''}|${p.question || ''}|${pictureKey(p.visual)}` : '';

// make() draws a problem; seen is the sitting's Set of keys. Draws again (up to
// `tries` times) while the question was already shown in this sitting. If a
// skill truly has fewer questions than the sitting needs, the last draw is
// served rather than nothing. The served key is added to seen.
export function freshProblem(make, seen, tries = 25) {
  let p = make();
  for (let i = 1; i < tries && p && seen?.has(questionKey(p)); i++) p = make();
  if (p && seen) seen.add(questionKey(p));
  return p;
}
