// ============================================================================
// ALGEBRA CONTENT — the strand vertical, authored to the full pedagogical bar.
//
// Each skill is a thin composition of builders (schema.js) across difficulty
// tiers. `withWorkedExample` attaches a SEPARATE solved instance as the worked
// example — the student studies one fully-worked problem, then practises a
// different one (the correct application of the worked-example effect).
//
// Coverage here is the foundational algebra core: collecting terms, expanding,
// factorising, and solving linear equations through to variables-both-sides.
// These are the load-bearing skills every later algebra/calculus skill needs.
// ============================================================================

import {
  buildLinearEquation, buildSimplify, buildDistribute, buildBinomial,
  buildFactorizeCommon, buildFactorizeQuadratic, buildSolveQuadratic,
  buildEvaluateFunction, buildDifferentiate, buildIntegrate, buildDefiniteIntegral,
  buildQuadraticFormula, buildCompleteSquare, buildArithmeticSequence,
  buildGeometricSequence, buildArithmeticSeries, buildStationaryPoints,
  withWorkedExample, coin,
} from './schema.js';

export const ALGEBRA_CONTENT = {
  // Forming & collecting
  G7_EXPRESSIONS:      withWorkedExample(() => buildSimplify({ tier: 1 })),
  G7_SIMPLIFY:         withWorkedExample(() => buildSimplify({ tier: 2 })),

  // Expanding & factorising
  G8_EXPAND_BRACKETS:  withWorkedExample(buildDistribute),
  G9_QUADRATIC_EXPAND: withWorkedExample(buildBinomial),
  G8_FACTORIZE_COMMON: withWorkedExample(buildFactorizeCommon),

  // Solving linear equations — increasing difficulty up the spine
  G6_SIMPLE_EQUATIONS: withWorkedExample(() => buildLinearEquation({ tier: 1 })),
  G7_EQUATIONS_FORM:   withWorkedExample(() => buildLinearEquation({ tier: 2 })),
  G7_EQUATIONS_SOLVE:  withWorkedExample(() => buildLinearEquation({ tier: coin() ? 2 : 3 })),
  G8_LINEAR_EQ_ADV:    withWorkedExample(() => buildLinearEquation({ tier: 3 })),

  // Quadratics & functions (G9)
  G9_QUADRATIC_FACTORIZE: withWorkedExample(buildFactorizeQuadratic),
  G9_QUADRATIC_SOLVE:     withWorkedExample(buildSolveQuadratic),
  G9_QUADRATIC_FORMULA:   withWorkedExample(buildQuadraticFormula),
  G9_COMPLETING_SQUARE:   withWorkedExample(buildCompleteSquare),
  G9_FUNCTIONS_INTRO:     withWorkedExample(() => buildEvaluateFunction({ quadratic: coin() })),

  // Sequences & series (G8/G10)
  G8_SEQUENCES:       withWorkedExample(buildArithmeticSequence),
  G10_SEQUENCES_ADV:  withWorkedExample(() => coin() ? buildGeometricSequence() : buildArithmeticSequence()),
  G10_SERIES:         withWorkedExample(buildArithmeticSeries),

  // Calculus — differentiation (G11) & integration (G12), incl. the previously
  // single-problem skills that broke spaced repetition.
  G11_DIFF_POWER_RULE:   withWorkedExample(buildDifferentiate),
  G11_STATIONARY_POINTS: withWorkedExample(buildStationaryPoints),
  G12_INTEGRATION_INTRO: withWorkedExample(buildIntegrate),
  G12_INTEGRATION_POWER: withWorkedExample(buildIntegrate),
  G12_DEFINITE_INTEGRALS: withWorkedExample(buildDefiniteIntegral),
};

export const ALGEBRA_SKILL_IDS = Object.keys(ALGEBRA_CONTENT);
