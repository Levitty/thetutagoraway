// Small helpers for the Grade 6 Maths skill data (scripts/data/maths-g6-*.mjs). Authored offline, no model call.
export const LIT = 'a familiar error type in maths education (no single source cited); how often Kenyan learners make it is to be confirmed by a teacher';
export const TC = 'to be confirmed by a teacher (no source yet)';
// pre entries: [code, strength ('essential' | 'helpful'), reason]; code 'G5:NUMBER.X.Y' or 'G6:SUB.SKILL' (written without MATH.)
export const sk = (code, name, outcomes, mastery, forms, thinking, horeb, pre, hands) => ({ code, name, outcomes, mastery, question_forms: forms, thinking, horeb_skill_ids: horeb, pre, ...(hands ? { hands_on: hands } : {}) });
// misconception: skill suffix, short code, error, [question, wrong, right], cause, reveals, help, source
export const mi = (skill, short, error, ex, cause, reveals, help, source = TC) => ({ skill, short, error, example: { question: ex[0], wrong_answer: ex[1], correct_answer: ex[2] }, cause, reveals, help, source });
export const E = 'essential', H = 'helpful';
// teaching pack entry (18 Nov 2026, same shape as Grade 7): floor [prerequisite, question, answer]; reps; steps; contexts;
// board [[beat, do, say?], ...]; mis { SHORT: [[listen_for...], ask, repair] }; checks [[question, answer, shows] x2]
export const pk = (o) => o;
export const P = (q, a, s) => [q, a, s];
