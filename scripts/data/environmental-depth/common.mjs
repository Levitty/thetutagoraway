// Environmental Activities Grades 1-3 depth pass (owner, 18-19 Nov 2026: every subject to the Grade 5 Maths standard). Shared
// rules and short helpers for scripts/data/environmental-depth/g<N>.mjs, read by scripts/build-environmental-grade.mjs and
// tests/helpers/environmentalDepth.mjs. Everything is a draft until a CBC Environmental Activities teacher reviews it.
// Misconceptions are those of children aged six to nine: what the child says or picks, and the reason a young child has.
// Lines that touch a child's safety (accidents, strangers, unsafe places, dangerous weather, bedwetting, poisonous plants)
// carry SAFE in their source line so a teacher reads them first.

// Attitude outcomes: seen in class, never asked as a question. Practical outcomes are not here: each goes to the teacher's
// KICD rubric through a knowledge skill (rubric: [...] on the skill; scripts/lib/lower-grade.mjs).
export const EA_NOT_TESTED = /^(appreciate|advocate|acknowledge|embrace|value|reflect|develop curiosity)\b/i;
export const REVIEWER = 'a CBC Environmental Activities teacher';
export const TC = 'To confirm by a CBC Environmental Activities teacher: a common error of young children, not traced to a study by the author.';
export const SAFE = 'To confirm by a CBC Environmental Activities teacher (SAFE: child-safety content, read first): a common error of young children, not traced to a study by the author.';
export const RULE = ' Evidence rule: at least four of the last five fresh questions right across at least two question forms (read aloud to the child, with pictures), and no repeated pick of the same misconception.';

// A teaching pack entry, short form (as scripts/data/cre-depth/common.mjs):
//   P(key_step, [prerequisite, floor question, answer], reps[], steps[], contexts[], board, [[question, answer, shows] x2])
export const B = (write, point, ask, wait, end) => [['draw', write], ['point', point, ask], ['pause', wait], ['reveal', end]];
export const P = (key_step, floor, reps, steps, contexts, board, checks) => ({ key_step, floor, reps, steps, contexts, board, checks });
// One skill: S(sub, id, name, outcomes, forms, mastery, pre, mis, pack, rubric?)
export const S = (sub, id, name, outcomes, forms, mastery, pre, mis, pack, rubric) => ({ sub, id, name, outcomes, forms, mastery: mastery + RULE, thinking: ['recall', 'reasoning'], pre, mis, pack, ...(rubric ? { rubric } : {}) });
