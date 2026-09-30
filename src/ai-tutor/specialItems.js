// ============================================================================
// SPECIAL QUESTIONS — when a lesson serves something other than the skill's
// usual question: reasoning (spot the mistake, always/sometimes/never),
// Kenyan word problems with a bar model, and step-marked questions.
//
// Rules (docs/qa/research/learning-science.md):
//  • Reasoning only after the child has answered this skill right at least
//    twice: see the right method first, then judge a wrong one (Booth 2013).
//  • Word problems and step-marked questions mix in from the start.
//  • Each kind is a minority of a session, so most questions stay the
//    skill's own typed practice.
// ============================================================================

import { reasoningFor, hasReasoning } from './content/reasoning.js';
import { wordProblemFor, hasWordProblem } from './content/wordProblems.js';
import { stepsItemFor, hasStepsItem } from './content/stepsItems.js';

export const RATES = { reasoning: 0.18, word: 0.2, steps: 0.25 };

export function specialItemFor(skillId, { correctSoFar = 0, random = Math.random } = {}) {
  const r = random();
  let acc = 0;
  if (hasStepsItem(skillId)) { acc += RATES.steps; if (r < acc) return stepsItemFor(skillId); }
  if (hasWordProblem(skillId)) { acc += RATES.word; if (r < acc) return wordProblemFor(skillId); }
  if (hasReasoning(skillId) && correctSoFar >= 2) { acc += RATES.reasoning; if (r < acc) return reasoningFor(skillId); }
  return null;
}
