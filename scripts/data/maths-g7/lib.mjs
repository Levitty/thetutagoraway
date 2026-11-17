// Small helpers for the Grade 7 Maths skill data (scripts/data/maths-g7/*.mjs). Authored offline (17 Nov 2026), no model call at run time.
// One file per sub-strand. Each exports { key, notes, skills, mis, pack, links }:
//   skills  the skills (sk), prerequisites included
//   mis     the misconception library (mi), status draft
//   pack    the teaching pack entry per skill (pk), written to curriculum/mathematics/teaching/g7/
//   links   the existing question families filed under a curriculum skill (applied once by scripts/link-maths-g7-families.mjs)
export const TC = 'to be confirmed by a teacher (no source yet)';
export const LIT = 'a familiar error type in maths education (no single source cited); how often Kenyan learners make it is to be confirmed by a teacher';
export const E = 'essential', H = 'helpful';
// A prerequisite is [ref, strength, reason]. ref: 'G6:SUB.SKILL' or 'G5:SUB.SKILL' (a skill), 'G6o:SUB.letter' or 'G5o:SUB.letter'
// (a KICD outcome, when no skill carries it), 'G7:SKILL' (a skill of the same sub-strand) or 'G7x:SUB.SKILL' (another Grade 7 sub-strand).
export const sk = (code, name, outcomes, mastery, forms, thinking, horeb, pre) => ({ code, name, outcomes, mastery, question_forms: forms, thinking, horeb_skill_ids: horeb, pre });
// misconception: skill suffix, short code, error, [question, wrong, right], cause, help, reveals (optional: defaults to the wrong answer as a distractor)
export const mi = (skill, short, error, ex, cause, help, reveals, source = TC) => ({ skill, short, error, example: { question: ex[0], wrong_answer: ex[1], correct_answer: ex[2] }, cause, help, reveals: reveals || `The answer ${ex[1]} as a wrong option, with a reason that names the idea.`, source });
// teaching pack entry. floor [prerequisite, question, answer]; board [[beat, do, say?], ...]; mis { SHORT: [[listen_for...], ask, repair] }; checks [[question, answer, shows] x2]
export const pk = (skill, o) => ({ skill, ...o });
// family link: familyId: [skill suffix, outcome letter, [wrong-option codes in the order the family lists them], mis code for a find-the-mistake working (optional)]
