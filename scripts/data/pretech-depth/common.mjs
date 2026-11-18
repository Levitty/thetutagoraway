// Pre-Technical Studies depth pass (owner, 18 Nov 2026: every subject to the Grade 5 Maths standard). Shared rules and short
// helpers for scripts/data/pretech-depth/g<N>.mjs, read by scripts/build-pretechnical-grade.mjs and tests/helpers/pretechDepth.mjs.
// Everything is a draft until a Pre-Technical Studies teacher reviews it. Practical and making outcomes (draw, sketch, print,
// use a tool or a computer, extinguish, construct, make, fill in, prepare) have a knowledge skill a question can test; the
// making itself is marked by the teacher with the KICD rubric, never by a tap. Every safety line (workshop, fire, height,
// hazardous substances, online and data safety) carries SAFETY in its source so a teacher confirms it before any child sees it.

// Outcomes that are attitudes or habits: seen in class over the term, never asked as a question. Every other outcome has a skill.
export const PRETECH_NOT_TESTED = new RegExp('^(' + [
  'appreciate', 'embrace', 'acknowledge', 'value', 'recognise the importance', 'observe',
].join('|') + ')', 'i');

export const REVIEWER = 'a Pre-Technical Studies teacher';
export const TC = 'To confirm by a Pre-Technical Studies teacher: a common classroom error, not traced to a study by the author.';
export const SAFETY = 'To confirm by a Pre-Technical Studies teacher (SAFETY: the rule must match the school\'s workshop rules and the Kenyan guidance before a child sees it): a common classroom error, not traced to a study by the author.';
export const MONEY = 'To confirm by a Pre-Technical Studies teacher (MONEY: figures, rates and institution names change; check against current Kenyan practice): a common classroom error, not traced to a study by the author.';
export const RULE = ' Evidence rule: at least four of the last five fresh questions right across at least two question forms, and no repeated pick of the same misconception.';
export const RUBRIC = ' The practical part (the drawing, the item made, the tool or computer used) is marked by the teacher with the KICD rubric, never by a tap.';

// A teaching pack entry, short form:
//   P(key_step, [prerequisite, floor question, answer], reps[], steps[], contexts[], board, [[question, answer, shows] x2])
// board: B(write, point, ask, wait, end): write or draw on the board, point and ask, pause for the learner, then reveal.
export const B = (write, point, ask, wait, end) => [['write', write], ['point', point, ask], ['pause', wait], ['reveal', end]];
export const P = (key_step, floor, reps, steps, contexts, board, checks) => ({ key_step, floor, reps, steps, contexts, board, checks });
// A fix for a first-pass misconception: a real cause and repair, and when the first pass was vague, a sharper error and example.
export const M = (cause, help, error, question, wrong, right, source) => ({ cause, help, ...(error ? { error } : {}), ...(question ? { question } : {}), ...(wrong ? { wrong } : {}), ...(right ? { right } : {}), ...(source ? { source } : {}) });
