// Science and Technology Grade 6 against the curriculum map HOREB owns (curriculum/science/g6.json), to the Grade 5 Maths
// standard (depth pass, 18 Nov 2026): prerequisites reach Grades 4 and 5, four misconceptions per skill, a teaching pack for
// every sub-strand. All draft until a CBC Science and Technology teacher reviews it.
import { scienceDepthTests } from './helpers/scienceDepth.mjs';

scienceDepthTests({ dir: 'science', subject: 'science', grade: 6, outcomes: 34, minDown: 0.6 });
