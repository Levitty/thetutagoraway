// ============================================================================
// THE FAMILY KIT FOR ANY SUBJECT-GRADE WHOSE ANSWERS ARE TAPPED OR TYPED WORDS (written 12 Nov 2026 from sci_lib.js,
// which Science Grade 5 was first written in; sci_lib.js is now one call to this).
//   const kit = makeKit({ subject, grade, prefix, map: { skills, outcomes, misFeedback }, signed });
//   kit.sfam({ id, cs, form, rung, gen })      cs is the skill code without '<PREFIX>.G<N>.'
// A family carries `subject`, `cskill` (the skill code), `outcome` (the official outcome code) and `skill` (= cskill: these
// skills are not in the practice engine's Maths graph). reviewed is true only when its id is in `signed` (the subject-grade's
// signed list); the one switch is in core.js, as for Maths.
//
// Three ways to write the gen():
//   choose(cases, opt)   a tap question. A case is [question, right, wrongs, why, extra?], a wrong is
//                        [text, 'M_CODE', ownFeedback?]. The feedback a child reads is the library's line for that
//                        misconception (map.misFeedback) unless the wrong carries its own.
//   typed(cases, opt)    a short typed answer. A case is [question, answer, accepted[], wrongs, why, extra?].
//   spot(cases, opt)     a child's explanation with one false step. A case is [question, steps, fix, 'M_CODE'];
//                        a step is [text, ok].
// opt: { h: [hint1, hint2], s1: first solution step, instruction }. extra: { t: { head, rows } } adds a table.
// A draw picks a case at random and shuffles the options, so a family needs at least five cases.
// Answers marked as words (English) use `marker: 'text'` and a different kit (eng_lib.js); this kit marks like Maths.
// ============================================================================
import { pick } from '../schema.js';
import { family } from './core.js';

export { pick };
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const tbl = (head, rows) => ({ type: 'table', data: { head, rows: rows.map(cells => ({ cells })) } });
const wrongs3 = (w) => (w.length > 3 ? shuffle(w).slice(0, 3) : w);
const hintsOf = (opt) => [opt.h?.[0], opt.h?.[1]].filter(Boolean);

export function makeKit({ subject, grade, prefix, map, signed }) {
  const { skills: SKILLS, outcomes: OUTCOMES, misFeedback: MIS_FEEDBACK } = map;
  // What a child reads after a wrong answer: the explanation for this very question first (the case's own "why"), then the
  // library's line naming the idea behind the mistake. The library line alone could miss the option picked, so it never
  // stands by itself; a wrong answer may still carry its own feedback in place of both.
  const feedback = (code, own, why) => {
    if (own) return own;
    const f = MIS_FEEDBACK[code];
    if (!f) throw new Error(`${subject} family: no misconception ${code}`);
    return why ? `${why} ${f}` : f;
  };

  const choose = (cases, opt = {}) => () => {
    const [q, r, w, why, extra = {}] = pick(cases);
    const wrong = wrongs3(w).map(([text, mis, own]) => ({ text: String(text), right: false, why: feedback(mis, own, why), mis }));
    const texts = [String(r), ...wrong.map(x => x.text)];
    if (new Set(texts).size !== texts.length) return null;
    const options = shuffle([{ text: String(r), right: true }, ...wrong]);
    return { question: q, options, instruction: extra.i || opt.instruction || 'Choose the best answer.', fixedOrder: !!extra.fixed,
      hints: hintsOf(opt), steps: [opt.s1 || 'Read the question and think about what it is asking.', why], ...(extra.t ? { model: tbl(extra.t.head, extra.t.rows) } : {}) };
  };

  const typed = (cases, opt = {}) => () => {
    const [q, a, ok = [], w, why, extra = {}] = pick(cases);
    const wrong = wrongs3(w).map(([text, mis, own]) => [String(text), feedback(mis, own, why), mis]);
    if (new Set([a, ...wrong.map(x => x[0])]).size !== wrong.length + 1) return null;
    const the = String(a).replace(/^(the|a|an) /i, '');
    return { question: q, answer: a, accepts: [...new Set([the, `the ${the}`, ...ok])], wrong, instruction: extra.i || opt.instruction || 'Type your answer.',
      hints: hintsOf(opt), steps: [opt.s1 || 'Read the question and think about what it is asking.', why], ...(extra.t ? { model: tbl(extra.t.head, extra.t.rows) } : {}) };
  };

  const spot = (cases, opt = {}) => () => {
    const [q, steps, fix, mis] = pick(cases);
    feedback(mis);
    return { question: q, working: steps.map(([text, ok]) => ({ text, ok })), fix, mis, hints: hintsOf(opt), steps: [opt.s1 || 'Check each step against what you know.'], topicDone: true };
  };

  const sfam = (d) => {
    const { cs, gen, id, form, rung, oc, ...rest } = d;
    const code = `${prefix}.G${grade}.${cs}`;
    const ck = SKILLS[code];
    if (!ck) throw new Error(`${id}: no ${subject} skill ${code}`);
    const outcome = oc ? ck.outcomes.find(o => o.endsWith(`.${oc}`)) : ck.outcome;
    if (!outcome || !OUTCOMES[outcome]) throw new Error(`${id}: outcome ${oc} not on ${cs}`);
    const draw = () => gen();
    return family({ reviewed: signed.includes(id), subject, ...rest, id, form, rung, skill: code, cskill: code, outcome, draw, make: x => x, check: () => true });
  };
  return { choose, typed, spot, sfam, pick, shuffle, tbl };
}
