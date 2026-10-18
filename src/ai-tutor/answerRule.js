// ============================================================================
// THE ANSWER RULE — nothing shown beside a question may name that question's
// answer. This is a property of CONTENT, so it lives with the engine:
// tests/hints.test.mjs holds every authored hint to it.
//
// The AI layer reuses it rather than keeping a second copy (src/ai/replyGuard.js
// imports it to check a model's reply). The dependency only ever runs that way
// round — the engine must not import anything under src/ai, so that the tutor
// still works with the model switched off entirely.
// ============================================================================

export const norm = (s) => String(s ?? '').toLowerCase()
  .replace(/−/g, '-').replace(/\s+/g, '').replace(/,/g, '');

// Digit-boundary containment: "144" must not match inside "1440".
// A hint that merely QUOTES THE QUESTION reveals nothing the child cannot
// already see ("Work out how far clockwise N 14° E is" restates the prompt),
// so a match that also appears in the question does not count as a leak.
export const revealed = (answer, hint, question) => {
  const a = norm(answer);
  // Only a SINGLE character is too collision-prone to judge. Skipping every
  // 1-2 character answer hid a real leak for months — Grade 4 and 5 answers are
  // mostly two digits ("98 ÷ 7 = ?" with the hint "7 × 14 = 98.").
  if (a.length < 2) return false;
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Boundaries depend on what kind of answer it is, or the looser rule reports
  // noise instead of leaks:
  //   a word     — whole words only, so "no" does not match inside "No long
  //                division needed".
  //   a negative — the sign must not be a subtraction or a formula's own minus,
  //                so "-1" does not match inside "(n-1)" or "a = -9".
  //   a number   — digit boundaries, so "144" does not match inside "1440".
  const isWord = /^[a-z][a-z\s'-]*$/.test(a);
  const isNeg = /^-/.test(a);
  const pre = isWord ? '\\b' : isNeg ? '(?<![\\w.])' : /^[\d.]/.test(a) ? '(?<![\\d./])' : '';
  const post = isWord ? '\\b' : /[\d.]$/.test(a) ? '(?![\\d.])' : '';
  const re = new RegExp(pre + esc + post);

  // A hint that merely QUOTES THE QUESTION reveals nothing the child cannot
  // already see, so a match that also appears in the question does not count.
  // The question side is deliberately LOOSE — a plain containment check. The
  // strict boundaries above exist to avoid false alarms in the hint; applying
  // them to the question has the opposite effect, refusing to excuse a number
  // the child is plainly looking at ("Place -1 on the number line" hinting
  // "-1 is 1 step to the left of 0").
  return re.test(norm(hint)) && !norm(question).includes(a);
};

export default { norm, revealed };
