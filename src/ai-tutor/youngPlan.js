// Which tap-buttons a young learner gets for a problem (Grades 1-4). Pure, so
// scripts/test-engine.mjs can check the right answer is always a button.

export const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const uniq = (a) => [...new Set(a)];

/**
 * Decide whether (and how) a problem can be taught in young mode.
 * Returns null when it can't — the caller falls back to the standard UI.
 */
export function planYoungLesson(problem) {
  if (!problem || problem.placeholder) return null;
  const answer = String(problem.answer).trim();
  const v = parseFloat(answer);

  // Counters: pure single-digit addition ("4 + 5 = ?") — the concrete layer.
  const m = /^(\d+)\s*\+\s*(\d+)\s*=\s*\?$/.exec(problem.question?.trim() || '');
  const counters = m && +m[1] <= 9 && +m[2] <= 9 ? [+m[1], +m[2]] : null;

  // Choices: three big buttons. A problem can name its own choices (e.g. a
  // "which is bigger, a or b" compares the two actual numbers, not near-misses);
  // otherwise numeric answers get near-miss distractors plus any misconception value.
  let choices = null;
  if (Array.isArray(problem.choices) && problem.choices.length >= 2) {
    choices = shuffle(uniq(problem.choices.map(c => String(c))));
  } else if (/^\d{1,2}:\d{2}$/.test(answer)) {
    // Clock times ("13:45"): parseFloat would read 13 and the right answer
    // would never be a button. Offer nearby times instead.
    const [h, mm] = answer.split(':').map(Number);
    const t = h * 60 + mm;
    const fmt = (x) => { x = (x + 1440) % 1440; return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };
    choices = shuffle(uniq([answer, fmt(t + 15), fmt(t - 15), fmt(t + 60)]).slice(0, 3));
  } else if (/^-?\d+$/.test(answer) && Number.isFinite(v) && Number.isInteger(v)) {
    const mis = parseFloat(problem.misconceptions?.[0]?.when);
    const pool = uniq([v, Number.isFinite(mis) && mis >= 0 && mis !== v ? mis : v + 1, v > 0 ? v - 1 : v + 2, v + 1])
      .filter(n => n >= 0).slice(0, 3);
    while (pool.length < 3) pool.push(v + pool.length);
    choices = shuffle(uniq(pool).slice(0, 3));
  } else if (problem.type === 'line-type') {
    choices = shuffle(['straight', 'curved']);
  } else if (problem.type === 'time-day') {
    const i = DAYS.indexOf(answer);
    if (i >= 0) choices = shuffle(uniq([answer, DAYS[(i + 1) % 7], DAYS[(i + 6) % 7]]));
  } else if (problem.type === 'time-month') {
    const i = MONTHS.indexOf(answer);
    if (i >= 0) choices = shuffle(uniq([answer, MONTHS[(i + 1) % 12], MONTHS[(i + 11) % 12]]));
  }
  if (!choices || choices.length < 2) return null;

  return { counters, choices, answer };
}
