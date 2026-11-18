// Helpers for the Grade 9 Maths skill data (scripts/data/maths-g9/*.mjs), authored offline on 18 Nov 2026, no model call at run time.
// The same helpers and file shape as Grades 7 and 8 (scripts/data/maths-g7/lib.mjs): one file per sub-strand exporting
// { key, notes, skills, mis, pack, links }. Grade 9 is held to the depth standard (scripts/build-maths-grade.mjs 9):
// every skill at least two prerequisites and four misconceptions, every misconception a reveal question and a repair in the pack.
// A prerequisite ref: 'G8:SUB.SKILL', 'G7:SUB.SKILL', 'G6:SUB.SKILL', 'G5:SUB.SKILL' (an earlier grade's skill), 'G8o:SUB.letter'
// (an earlier grade's outcome), 'G9:SKILL' (same sub-strand) or 'G9x:SUB.SKILL' (another Grade 9 sub-strand).
// A link may carry a 6th element, reveals: a family tied at family level (misMapped: false) when its wrong answers are built in a
// form the linker cannot tag one by one.
export { TC, LIT, E, H, sk, mi, pk } from '../maths-g7/lib.mjs';
export const L = (...x) => x;
