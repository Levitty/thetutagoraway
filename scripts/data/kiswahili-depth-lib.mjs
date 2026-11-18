// Helpers for the Kiswahili depth layer (scripts/data/kiswahili-g<n>/*.mjs), written offline on 18 Nov 2026, no model call.
// The depth layer brings Grades 4 to 9 to the Grade 5 Maths standard (HOREB_MAPPING_PLAN.md): every sub-strand has skills,
// every testable outcome a skill, every skill at least two prerequisites and four misconceptions, and a teaching pack entry
// that gives every misconception a reveal question and a repair. scripts/build-kiswahili-grade.mjs merges it on top of the first
// pass (scripts/build-kiswahili-g<n>.mjs and its data), keeping every skill and misconception code the families already use.
// Language: what a child or the tutor says (examples, feedback, ask, repair, say, checks) is in Kiswahili sanifu; notes for the
// reviewer (error, cause, help, key_step, steps) are in English. Everything is draft until a native Kiswahili teacher reviews it.
export const TC = 'common learner error; to confirm by a native Kiswahili teacher';
export const ENG = 'English or mother-tongue interference on Kiswahili; to confirm by a native Kiswahili teacher';
export const MT = 'mother-tongue sound interference common in Kenyan classrooms; to confirm by a native Kiswahili teacher';
export const E = 'essential', H = 'helpful';

// A prerequisite: [ref, strength, reason]. ref:
//   'SUB.ID'          a skill of this grade (any sub-strand), '.ID' a skill of the same sub-strand
//   'G<n>:SUB.ID'     a skill of an earlier grade        'G<n>o:SUB.letter'  an outcome of an earlier grade
export const pre = (ref, strength, reason) => [ref, strength, reason];

// A misconception: m(short, error, [question, wrong, right], cause, help, feedback, ask, repair?, source?)
//   feedback  the line the child reads after the wrong answer (Kiswahili)
//   ask       the tutor's reveal question (Kiswahili); repair the short fix (Kiswahili, defaults to the feedback)
export const m = (short, error, ex, cause, help, feedback, ask, repair, source = TC) => ({
  short, error, example: { question: ex[0], wrong_answer: ex[1], correct_answer: ex[2] }, cause, help, feedback, ask,
  repair: repair || feedback, source,
  reveals: `The question "${ex[0]}" with "${ex[1]}" among the options.`,
});

// A teaching pack entry: p(key_step, floor, reps, steps, contexts, board, checks)
//   floor  [prerequisite, question, answer]       reps [3 ways to show it]     steps [what the child does, in order]
//   board  [write, [point, say], childTurn]  ->  write, point (say), pause, the child's turn (child_draws)
//   checks [[question, answer, shows], [question, answer, shows]]
export const p = (key_step, floor, reps, steps, contexts, board, checks) => ({
  key_step, floor, reps, steps, contexts,
  board: [['write', board[0]], ['point', board[1][0], board[1][1]], ['pause', 'Wait for the child to answer before saying anything.'], ['child_draws', board[2]]],
  checks,
});

// An existing skill deepened: x('SUB.ID', { also, pre, mis, fix, pack })
//   also  more outcome letters ('c' in its own sub-strand, or 'SUB.c')    fix { SHORT: [ask, repair] } for a first-pass misconception
export const x = (ref, d) => ({ ref, ...d });
// A new skill: s('SUB', 'ID', name, letters, mastery, forms, thinking, { pre, mis, pack })
export const s = (sub, id, name, outcomes, mastery, forms, thinking, d) => ({ sub, id, name, outcomes, mastery, question_forms: forms, thinking, ...d });
