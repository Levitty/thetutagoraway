// CRE Grade 2 against the curriculum map HOREB owns (curriculum/cre/g2.json), mapped on 19 Nov 2026 from the KICD outcomes to
// the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 1, four misconceptions per skill, a teaching
// pack for every sub-strand, habits and performances marked by the teacher with the KICD rubric. Outcomes x4 to x8 of the sky
// sub-strand are a reading-the-Bible sub-strand folded in by the text layer, kept word for word for a reviewer.
// No question families exist yet: no subject entry, every skill awaiting. Build with: node scripts/build-cre-grade.mjs 2.
import { creDepthTests } from './helpers/creDepth.mjs';

await creDepthTests({ grade: 2, outcomes: 74, totals: [25, 50, 100] });
