// Helpers for the Grade 8 Maths skill data (scripts/data/maths-g8/*.mjs), authored offline on 18 Nov 2026, no model call at run time.
// The same helpers and file shape as Grade 7 (scripts/data/maths-g7/lib.mjs): one file per sub-strand exporting
// { key, notes, skills, mis, pack, links }. Grade 8 is held to the depth standard (scripts/build-maths-grade.mjs 8):
// every skill at least two prerequisites and four misconceptions, every misconception a reveal question and a repair in the pack.
// A prerequisite ref: 'G7:SUB.SKILL', 'G6:SUB.SKILL', 'G5:SUB.SKILL' (an earlier grade's skill), 'G7o:SUB.letter' (an earlier
// grade's outcome), 'G8:SKILL' (same sub-strand) or 'G8x:SUB.SKILL' (another Grade 8 sub-strand).
// A link may carry a 6th element, reveals: a family tied at family level (misMapped: false), for the coverage kit's families.
export { TC, LIT, E, H, sk, mi, pk } from '../maths-g7/lib.mjs';
export const L = (...x) => x;
