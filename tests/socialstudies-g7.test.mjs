// Social Studies Grade 7 against the curriculum map HOREB owns (curriculum/social_studies/g7.json), to the Grade 5 Maths standard
// (depth pass, 18 Nov 2026): two or more prerequisites per skill reaching Grade 4-6 Social Studies, Maths and Science, four misconceptions
// per skill, a teaching pack for every sub-strand, every family filed under a real skill. All draft until a teacher reviews it.
import { socialStudiesDepthTests } from './helpers/socialStudiesDepth.mjs';

socialStudiesDepthTests({ grade: 7, outcomes: 84 });
