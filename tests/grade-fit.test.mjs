// ============================================================================
// GRADE FIT — is every skill we serve one this learner should be doing?
//
// Two defects reached a real child before this existed: "What number comes
// just after 35?" and "80 + 3 = ?", both to a Grade 5, both found by a person
// looking at a screen rather than by a test. They were in different functions,
// and fixing the first made the second MORE likely, because the engine has
// several independent paths that can each put a question in front of a child
// and they did not share a rule.
//
// scripts/audit-grade-fit.mjs asks every one of those paths the same question
// for virtual learners at every grade. This runs it on each commit.
//
// The rules being asserted are the engine's own:
//   below — assumedKnown()/longSecure() write off a skill three or more grades
//           under the learner, unless they have actually struggled with it
//   above — getNextToLearn allows one grade of stretch over what the learner
//           has demonstrated
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditGradeFit } from '../scripts/audit-grade-fit.mjs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';
import { getNextToLearn, getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';

const report = auditGradeFit({ n: 150, seed: 7 });

const describe = (rows) => rows.slice(0, 6)
  .map((x) => `Grade ${x.declared} learner served [G${x.skillGrade}] ${x.name}`)
  .join('\n    ');

test('no path serves a learner work years below their grade', () => {
  for (const [path, r] of Object.entries(report)) {
    assert.equal(
      r.below.length, 0,
      `\n  ${path} served ${r.below.length} skills 3+ grades too low:\n    ${describe(r.below)}\n`,
    );
  }
});

test('no path serves a learner work years above their grade', () => {
  for (const [path, r] of Object.entries(report)) {
    assert.equal(
      r.above.length, 0,
      `\n  ${path} served ${r.above.length} skills too far above:\n    ${describe(r.above)}\n`,
    );
  }
});

test('the paths that choose work are actually choosing some', () => {
  // The failure mode of the two tests above is a filter tightened until the
  // path returns nothing: no skills served means no skills mis-served, and
  // both pass while the learner is handed an empty screen. These are the
  // paths that must always have something for somebody.
  for (const path of ['getNextToLearn', 'getRecommendedPath', 'getReviews', 'selectReviewProblems']) {
    assert.ok(
      report[path].served > 0,
      `${path} served nothing at all across 150 learners — the filter is too tight, not the engine clean`,
    );
  }
});

test('no learner is left with nothing to learn', () => {
  // The specific risk in capping how far above their level a learner may be
  // offered work: someone who has finished everything at their own level has
  // nowhere to go but up, and a ceiling pinned to a months-old placement
  // would strand them. The ceiling rises with the highest grade they have
  // actually mastered, and this is what holds that true.
  let seed = 11;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const LIST = Object.values(SKILLS).filter((s) => Number.isFinite(s.grade));

  const starved = [];
  for (let i = 0; i < 120; i++) {
    const declared = 1 + Math.floor(rnd() * 10);
    const level = Math.max(1, declared + pick([0, 0, -1, -2, 1]));
    const complete = rnd() < 0.4;            // finished everything at their level
    const balances = {};
    for (const s of LIST) {
      if (s.grade <= level) balances[s.id] = complete ? 2.0 : (rnd() < 0.2 ? -1.0 : 2.0);
    }
    const progress = {
      declaredGrade: declared, placementGrade: level, diagnosed: true,
      skills: processDiagnosticResults(balances, { skills: SKILLS }),
    };
    if (!(getNextToLearn(progress, undefined) || []).length) {
      starved.push(`Grade ${declared} placed ${level}${complete ? ' (level complete)' : ''}`);
    }
    if (!(getRecommendedPath(progress, undefined) || []).length) {
      starved.push(`Grade ${declared} placed ${level}: empty path`);
    }
  }
  assert.deepEqual(starved, [], `\n  learners with nothing to do:\n    ${starved.slice(0, 8).join('\n    ')}\n`);
});
