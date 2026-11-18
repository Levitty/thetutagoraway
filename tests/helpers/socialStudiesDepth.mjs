// The Grade 5 Maths standard for Social Studies Grades 4-9 (owner, 18 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md), through the
// same checks as Science (tests/helpers/scienceDepth.mjs). Social Studies has many outcomes that are values, attitudes or practical
// work (drawing a map, taking part in a project, practising democracy in school): they are seen and scored in class with the KICD
// rubric, not asked as tapped questions, so they need no skill. Every other outcome must have one.
import { scienceDepthTests } from './scienceDepth.mjs';

export const SOCIAL_NOT_TESTED = new RegExp('^(' + [
  // values and attitudes
  'appreciate', 'show interest', 'develop interest', 'advocate', 'acknowledge', 'desire', 'value', 'embrace', 'exhibit', 'cultivate',
  'respect', 'uphold', 'recognise', 'show empathy', 'develop qualities', 'develop national', 'develop assertiveness',
  'demonstrate assertiveness', 'apply assertiveness', 'build healthy', 'create awareness', 'explore personal interests',
  // practical work, scored from the learner's product or the teacher's observation
  'participate', 'practise', 'illustrate', 'model', 'draw', 'narrate', 'recite', 'execute', 'implement', 'write a report',
  'report/account', 'share goals', 'assess their', 'choose a possible track', 'design', 'construct', 'use chart', 'demonstrate how',
  'explore positive ways', 'explore ways of managing', 'apply (critical|creative|problem-solving|emotional|methods|ways|the bill)', 'use indigenous',
].join('|') + ')', 'i');

export const socialStudiesDepthTests = (opts) => scienceDepthTests({ dir: 'social_studies', subject: 'socialstudies', notTested: SOCIAL_NOT_TESTED, ...opts });
