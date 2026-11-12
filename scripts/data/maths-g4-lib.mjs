// Small helpers for the Grade 4 Maths skill data (scripts/data/maths-g4-*.mjs). Authored offline, no model call.
export const LIT = 'widely reported in maths-education research; how often Kenyan learners make it is to be confirmed by a teacher';
export const TC = 'to confirm by a teacher';
// pre entries: [code, strength ('essential' | 'helpful'), reason].
//   code 'G3:SUBSTRAND.letter' is a Grade 3 outcome (written without MATH. or the strand, for example 'G3:ADDITION.d');
//   any other code is a Grade 4 skill of this file, by its short code (for example 'ADD_SINGLE_REGROUP').
export const sk = (code, name, outcomes, mastery, forms, thinking, horeb, pre, hands) => ({ code, name, outcomes, mastery, question_forms: forms, thinking, horeb_skill_ids: horeb, pre, ...(hands ? { hands_on: hands } : {}) });
// misconception: skill suffix, short code, error, [question, wrong, right], cause, reveals, help, source
export const mi = (skill, short, error, ex, cause, reveals, help, source = TC) => ({ skill, short, error, example: { question: ex[0], wrong_answer: ex[1], correct_answer: ex[2] }, cause, reveals, help, source });
export const E = 'essential', H = 'helpful';
