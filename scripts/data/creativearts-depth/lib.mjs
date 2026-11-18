// Shared shorthand for the Creative Arts depth pass (18 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md), read by
// scripts/science-depth.mjs with { derive: true } (the pass Science and Social Studies use).
//   pk(key_step, floor, reps, steps, contexts, board, checks, mis?)  one skill's teaching pack entry
//     floor   [the prerequisite the child needs, a question that tests it, its answer]
//     board   [[beat, what to do, what to say?], ...]  beats: draw, point, count, predict, pause, child_draws, reveal, write
//     checks  exactly two [question, answer, what it shows]
//     mis     optional { SHORT: [[listen for], ask, repair] }; a misconception left out takes the library's wrong answer,
//             example question and help, so every misconception of the skill is in the pack.
// applyRubric(g, depth, prefix): Creative Arts is half making, performing and sport. A sub-strand entry's
//   rubric { SKILL: ['d', 'e'] } names the practical outcomes (make, draw, paint, compose, play, sing, perform, swim) that the
//   skill's knowledge supports: the teacher marks them with the KICD rubric indicators of the sub-strand, never a phone question.
//   They are written to the skill as teacher_rubric { outcomes, indicators, by } and said in its mastery rule, so the SQL row
//   carries them too.
// Everything is draft until a CBC Creative Arts (Grades 4-6) or Creative Arts and Sports (Grades 7-9) teacher reviews it.
export const pk = (key_step, floor, reps, steps, contexts, board, checks, mis) => ({ key_step, floor, reps, steps, contexts, board, checks, ...(mis ? { mis } : {}) });

const ATTITUDE = /^(appreciate|enjoy|value|acknowledge|realise|recognise|show interest|participate)/i;
const fail = (m) => { throw new Error(m); };

export function applyRubric(g, depth, prefix) {
  let n = 0;
  for (const d of depth) {
    if (!d.rubric) continue;
    const s = g.sub_strands.find(x => x.code === `${prefix}${d.key}`) || fail(`rubric for unknown sub-strand ${d.key}`);
    for (const [key, letters] of Object.entries(d.rubric)) {
      const k = (s.skills || []).find(x => x.code === `${s.code}.${key}`) || fail(`${s.code}: rubric for unknown skill ${key}`);
      const outs = letters.map(l => s.outcomes.find(o => o.code === `${s.code}.${l}`) || fail(`${k.code}: no outcome ${l}`));
      for (const o of outs) if (ATTITUDE.test(o.text.trim())) fail(`${o.code} is an attitude outcome, not a practical one`);
      const indicators = s.rubric_indicators || [];
      if (!indicators.length) fail(`${s.code}: no KICD rubric indicators to mark with`);
      k.teacher_rubric = { outcomes: outs.map(o => o.code), indicators, by: 'teacher' };
      const said = outs.map(o => `${o.code.slice(s.code.length + 1).replace(/_2$/, ' (second set)').replace(/_$/, '')}) ${o.text.trim()}`).join('; ');
      k.mastery = `${k.mastery} Practical, marked by the teacher with the KICD rubric (${indicators.join(', ')}), never as a phone question: ${said}.`;
      n += outs.length;
    }
  }
  return n;
}
