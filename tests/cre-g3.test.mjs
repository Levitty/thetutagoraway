// CRE Grade 3 against the curriculum map HOREB owns (curriculum/cre/g3.json), mapped on 19 Nov 2026 from the KICD outcomes to
// the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 2, four misconceptions per skill, a teaching
// pack for every sub-strand, habits and performances marked by the teacher with the KICD rubric (strands 4 and 5 have no rubric
// in the file; the teacher uses the printed design). No question families exist yet: no subject entry, every skill awaiting.
// Build with: node scripts/build-cre-grade.mjs 3.
import { creDepthTests } from './helpers/creDepth.mjs';

await creDepthTests({ grade: 3, outcomes: 72, totals: [26, 52, 104] });
