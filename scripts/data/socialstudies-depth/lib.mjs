// Shared shorthand for the Social Studies depth pass (18 Nov 2026), read by scripts/science-depth.mjs with { derive: true }.
//   pk(key_step, floor, reps, steps, contexts, board, checks, mis?)  one skill's teaching pack entry
//     floor   [the prerequisite the child needs, a question that tests it, its answer]
//     board   [[beat, what to do, what to say?], ...]  beats: draw, point, count, predict, pause, child_draws, reveal, write
//     checks  exactly two [question, answer, what it shows]
//     mis     optional { SHORT: [[listen for], ask, repair] }; a misconception left out takes the library's wrong answer,
//             example question and help (derive), so every misconception of the skill is in the pack.
// Map questions name real Kenyan places only where the fact is fixed (Kenya's neighbours, Lake Victoria, Mount Kenya); a county
// on a described map is an imaginary one, as in the first pass. Everything is draft until a Social Studies teacher reviews it.
export const pk = (key_step, floor, reps, steps, contexts, board, checks, mis) => ({ key_step, floor, reps, steps, contexts, board, checks, ...(mis ? { mis } : {}) });
