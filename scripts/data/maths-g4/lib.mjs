// Helpers for the Grade 4 Maths skill data (scripts/data/maths-g4/*.mjs), authored offline, no model call at run time.
// The Grade 7 to 9 file shape (scripts/data/maths-g7/lib.mjs): one file per sub-strand exporting { key, notes, skills, mis, pack, links }.
// The first Grade 4 pass (12 Nov 2026) was in scripts/data/maths-g4-numbers.mjs, -measure.mjs and -geometry-data.mjs; it was moved
// here on 18 Nov 2026 and taken to the depth standard (scripts/build-maths-grade.mjs 4): every skill at least two prerequisites and
// four misconceptions, every misconception a reveal question and a repair in the teaching pack.
// A prerequisite ref: 'G3o:SUB.letter' (a Grade 3 outcome: Grade 3 has no skills yet), 'G4:SKILL' (same sub-strand) or
// 'G4x:SUB.SKILL' (another Grade 4 sub-strand).
// A skill may carry a 9th argument, hands_on: what is done with real objects in class (a skill with no question forms is hands-on only).
export { E, H, pk } from '../maths-g7/lib.mjs';
export const LIT = 'widely reported in maths-education research; how often Kenyan learners make it is to be confirmed by a teacher';
export const TC = 'to confirm by a teacher';
export const L = (...x) => x;
export const sk = (code, name, outcomes, mastery, forms, thinking, horeb, pre, hands) => ({ code, name, outcomes, mastery, question_forms: forms, thinking, horeb_skill_ids: horeb, pre, ...(hands ? { hands_on: hands } : {}) });
// misconception: skill suffix, short code, error, [question, wrong, right], cause, help, reveals (optional), source
export const mi = (skill, short, error, ex, cause, help, reveals, source = TC) => ({ skill, short, error, example: { question: ex[0], wrong_answer: ex[1], correct_answer: ex[2] }, cause, help, reveals: reveals || `The answer ${ex[1]} as a wrong option, with a reason that names the idea.`, source });
