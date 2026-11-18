// Helpers for the Grade 1 to 3 Maths skill data (scripts/data/maths-g3/, -g2/, -g1/), authored offline on 18 Nov 2026, no model
// call at run time. The Grade 4 to 9 file shape: one file per sub-strand exporting { key, notes, skills, mis, pack, links }, built by
// the one grade builder (node scripts/build-maths-grade.mjs 3) at the depth standard: every skill two prerequisites or more and four
// misconceptions or more, every misconception a reveal question and a repair in the teaching pack.
// What is new here: a misconception and its repair in the teaching pack are written once, together (m), and `assemble` splits them
// into the library (`mis`) and the pack entries (`pack[skill].mis`), so the two can never drift apart.
// A prerequisite ref: 'G2o:SUB.letter' (a Grade 2 outcome, before Grade 2 had skills), 'G2:SUB.SKILL' (a Grade 2 skill),
// 'G3:SKILL' (same sub-strand), 'G3x:SUB.SKILL' (another Grade 3 sub-strand), and for Grade 1 'PP2:NAME' (a readiness skill).
// The errors are those of young children (counting on from the wrong number, reversed digits, zero in place value, the clock hands).
export { E, H } from '../maths-g7/lib.mjs';
export { LIT, TC, sk } from '../maths-g4/lib.mjs';
import { TC } from '../maths-g4/lib.mjs';
// a misconception with its pack repair: skill suffix, short code, error, [question, wrong, right], cause, help, ask, repair, source
export const m = (skill, short, error, ex, cause, help, ask, repair, source = TC, reveals) => ({ skill, short, error, ex, cause, help, ask, repair, source, reveals });
// a teaching pack entry without its misconceptions: key step, floor [prerequisite, question, answer], pictures, steps, contexts,
// board [[beat, do, say?]], checks [[question, answer, shows] x2]
export const pk = (key_step, floor, reps, steps, contexts, board, checks) => ({ key_step, floor, reps, steps, contexts, board, checks });
export function assemble(ms, pack) {
  const mis = ms.map(x => ({ skill: x.skill, short: x.short, error: x.error, example: { question: x.ex[0], wrong_answer: String(x.ex[1]), correct_answer: String(x.ex[2]) }, cause: x.cause, help: x.help, reveals: x.reveals || `The answer ${x.ex[1]} as a wrong option, with a reason that names the idea.`, source: x.source }));
  const out = {};
  for (const [k, p] of Object.entries(pack)) out[k] = { ...p, mis: Object.fromEntries(ms.filter(x => x.skill === k).map(x => [x.short, [[String(x.ex[1])], x.ask, x.repair]])) };
  return { mis, pack: out };
}
