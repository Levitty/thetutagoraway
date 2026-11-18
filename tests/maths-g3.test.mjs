// Grade 3 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g3.json), mapped on 18 Nov 2026 to the depth
// standard of Grades 4 to 9. The checks are shared with Grades 1 and 2 (tests/lib/maths-lower-grade.mjs). Grade 3's prerequisites
// first named Grade 2 outcomes and now name Grade 2 skills; Grade 4's name these Grade 3 skills.
import { lowerGradeTests } from './lib/maths-lower-grade.mjs';
await lowerGradeTests({ grade: 3, subs: 14, linked: 11, perOption: 8, hands: ['GEOMET.SHAPES.DRAW_COMBINED', 'GEOMET.SHAPES.MODEL_COMBINED'], sqlFile: '20261124_maths_g3_skills_misconceptions.sql' });
