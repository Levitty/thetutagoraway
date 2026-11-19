// CRE Grade 1 against the curriculum map HOREB owns (curriculum/cre/g1.json), mapped on 19 Nov 2026 from the KICD outcomes to
// the Grade 5 Maths standard: two or more prerequisites per skill, below Grade 1 naming the pre-primary readiness skills HOREB
// defines in g1.json (readiness, CRE.PP2.READINESS.*, for a CRE teacher to confirm against the PP1-PP2 design), four
// misconceptions per skill, a teaching pack for every sub-strand, habits and performances marked by the teacher with the KICD
// rubric. No question families exist yet: no subject entry, every skill awaiting. Build with: node scripts/build-cre-grade.mjs 1.
import { creDepthTests } from './helpers/creDepth.mjs';

await creDepthTests({ grade: 1, outcomes: 58, totals: [20, 40, 80] });
