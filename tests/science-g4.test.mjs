// Science and Technology Grade 4 against the curriculum map HOREB owns (curriculum/science/g4.json), to the Grade 5 Maths
// standard (depth pass, 18 Nov 2026): prerequisites reach Grade 2 and 3 Environmental Activities, four misconceptions per skill,
// a teaching pack for every sub-strand. All draft until a CBC Science and Technology teacher reviews it.
import { scienceDepthTests } from './helpers/scienceDepth.mjs';

scienceDepthTests({ dir: 'science', subject: 'science', grade: 4, outcomes: 32, minDown: 0.6 });
