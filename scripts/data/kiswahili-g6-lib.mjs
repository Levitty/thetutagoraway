// Helpers shared by the Kiswahili Grade 6 authoring parts (scripts/data/kiswahili-g6-*.mjs).
// Written offline by Claude (13 Nov 2026). Everything is DRAFT until a native Kiswahili teacher reviews it.
export const TO_CONFIRM = 'common learner error; to confirm by a native Kiswahili teacher';
export const INTERFERENCE = 'English or mother-tongue influence on Kiswahili (to confirm by a native Kiswahili teacher)';
// S(sub, id, name, outcomes, mastery, questionForms, prerequisites, thinking)
export const S = (sub, id, name, outcomes, mastery, forms, pre = [], thinking = ['recall']) => ({ sub, id, name, outcomes, mastery, forms, pre, thinking });
// M(skill, code, error, question, wrong, right, cause, help, feedback, source): the revealing question is the example question
export const M = (skill, code, error, question, wrong, right, cause, help, feedback, source = TO_CONFIRM) => ({
  skill, code, error, example: { question, wrong_answer: wrong, correct_answer: right }, cause,
  reveals: `The question "${question}" with "${wrong}" among the options.`, help, feedback, source });
export const G5 = (c) => `KISW.G5.${c}`;   // a Grade 5 outcome, as a prerequisite from the grade below
