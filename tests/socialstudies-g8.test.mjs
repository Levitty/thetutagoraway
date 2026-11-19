// Social Studies Grade 8 against the curriculum map HOREB owns (curriculum/social_studies/g8.json), to the Grade 5 Maths standard
// (depth pass, 18 Nov 2026): two or more prerequisites per skill reaching Grades 5-7, four misconceptions per skill, a teaching pack
// for every sub-strand, every family filed under a real skill. CLIMATE_CHANGE and HR_COMMUNICATE were added in the depth pass; their
// families followed on 19 Nov 2026 (socialstudies_g8_d.js). All draft until a teacher reviews it.
import { socialStudiesDepthTests } from './helpers/socialStudiesDepth.mjs';

socialStudiesDepthTests({
  grade: 8, outcomes: 79,
  noFamilies: [],
});
