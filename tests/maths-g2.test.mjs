// Grade 2 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g2.json), mapped on 18 Nov 2026 to the depth
// standard of Grades 4 to 9. The checks are shared with Grades 1 and 3 (tests/lib/maths-lower-grade.mjs). Grade 2's prerequisites
// first named Grade 1 outcomes and name Grade 1 skills once Grade 1 is mapped; Grade 3's name these Grade 2 skills.
import { lowerGradeTests } from './lib/maths-lower-grade.mjs';
await lowerGradeTests({ grade: 2, subs: 14, linked: 29, perOption: 28, hands: ['GEOMET.SHAPES.DRAW_SHAPES'], sqlFile: '20261124_maths_g2_skills_misconceptions.sql' });
