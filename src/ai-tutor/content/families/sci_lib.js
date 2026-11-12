// ============================================================================
// GRADE 5 SCIENCE AND TECHNOLOGY FAMILIES: the small kit the sci_g5_*.js files are written in.
// Same shape as Grade 5 Maths (g5c_lib.js), generalised for a subject whose answers are words, not numbers:
//   sfam({ id, cs, form, rung, gen })      cs is the skill without SCIE.G5., e.g. 'LIVING.VERTEBRATES.VERTEBRATE_GROUPS'
// A family carries subject 'science', cskill (the skill code), outcome (the official outcome code) and
// skill (= cskill: science skills are not in the practice engine's SKILLS yet). reviewed is false until a
// teacher signs it off (sci_signed.js); the one switch is in core.js, as for Maths.
//
// Three ways to write the gen():
//   choose(cases, opt)   a tap question. A case is [question, right, wrongs, why, extra?], a wrong is
//                        [text, 'M_CODE', ownFeedback?]. The feedback a child reads is the library's line for that
//                        misconception (MIS_FEEDBACK) unless the wrong carries its own.
//   typed(cases, opt)    a short typed answer. A case is [question, answer, accepted[], wrongs, why, extra?].
//   spot(cases, opt)     a child's explanation with one false step. A case is [question, steps, fix, 'M_CODE'];
//                        a step is [text, ok].
// opt: { h: [hint1, hint2], s1: first solution step, instruction }. extra: { t: { head, rows } } adds a table.
// A draw picks a case at random and shuffles the options, so a family needs at least five cases.
// ============================================================================
import { pick } from '../schema.js';
import { family } from './core.js';
import { SKILLS_SCI_G5, OUTCOMES_SCI_G5, MIS_FEEDBACK } from '../curriculumMap.science.g5.js';
import { SIGNED_SCIENCE } from './sci_signed.js';

export { pick };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const tbl = (head, rows) => ({ type: 'table', data: { head, rows: rows.map(cells => ({ cells })) } });

// What a child reads after a wrong answer: the explanation for this very question first (the case's own "why"), then the
// library's line naming the idea behind the mistake. The library line alone could miss the option picked, so it never
// stands by itself; a wrong answer may still carry its own feedback in place of both.
const feedback = (code, own, why) => {
  if (own) return own;
  const f = MIS_FEEDBACK[code];
  if (!f) throw new Error(`science family: no misconception ${code}`);
  return why ? `${why} ${f}` : f;
};
const wrongs3 = (w) => (w.length > 3 ? shuffle(w).slice(0, 3) : w);
const hintsOf = (opt, c) => [opt.h?.[0], opt.h?.[1]].filter(Boolean);

export const choose = (cases, opt = {}) => () => {
  const [q, r, w, why, extra = {}] = pick(cases);
  const wrong = wrongs3(w).map(([text, mis, own]) => ({ text: String(text), right: false, why: feedback(mis, own, why), mis }));
  const texts = [String(r), ...wrong.map(x => x.text)];
  if (new Set(texts).size !== texts.length) return null;
  const options = shuffle([{ text: String(r), right: true }, ...wrong]);
  return { question: q, options, instruction: extra.i || opt.instruction || 'Choose the best answer.', fixedOrder: !!extra.fixed,
    hints: hintsOf(opt), steps: [opt.s1 || 'Read the question and think about what it is asking.', why], ...(extra.t ? { model: tbl(extra.t.head, extra.t.rows) } : {}) };
};

export const typed = (cases, opt = {}) => () => {
  const [q, a, ok = [], w, why, extra = {}] = pick(cases);
  const wrong = wrongs3(w).map(([text, mis, own]) => [String(text), feedback(mis, own, why), mis]);
  if (new Set([a, ...wrong.map(x => x[0])]).size !== wrong.length + 1) return null;
  const the = String(a).replace(/^(the|a|an) /i, '');
  return { question: q, answer: a, accepts: [...new Set([the, `the ${the}`, ...ok])], wrong, instruction: extra.i || opt.instruction || 'Type your answer.',
    hints: hintsOf(opt), steps: [opt.s1 || 'Read the question and think about what it is asking.', why], ...(extra.t ? { model: tbl(extra.t.head, extra.t.rows) } : {}) };
};

export const spot = (cases, opt = {}) => () => {
  const [q, steps, fix, mis] = pick(cases);
  feedback(mis);
  return { question: q, working: steps.map(([text, ok]) => ({ text, ok })), fix, mis, hints: hintsOf(opt), steps: [opt.s1 || 'Check each step against what you know.'], topicDone: true };
};

export const sfam = (d) => {
  const { cs, gen, id, form, rung, oc, ...rest } = d;
  const code = `SCIE.G5.${cs}`;
  const ck = SKILLS_SCI_G5[code];
  if (!ck) throw new Error(`${id}: no science skill ${code}`);
  const outcome = oc ? ck.outcomes.find(o => o.endsWith(`.${oc}`)) : ck.outcome;
  if (!outcome || !OUTCOMES_SCI_G5[outcome]) throw new Error(`${id}: outcome ${oc} not on ${cs}`);
  const draw = () => gen();
  return family({ reviewed: SIGNED_SCIENCE.includes(id), subject: 'science', ...rest, id, form, rung, skill: code, cskill: code, outcome, draw, make: x => x, check: () => true });
};
