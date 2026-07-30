// ============================================================================
// CONTENT INDEX — single merge point for all authored, structured content.
// problemGenerators.js and the quality gate both read from here.
// ============================================================================
import { ALGEBRA_CONTENT } from './algebra.js';
import { CALCULUS_CONTENT } from './calculus.js';
import { FRACTIONS_CONTENT } from './fractions.js';
import { NUMBERS_CONTENT } from './numbers.js';
import { MEASUREMENT_CONTENT } from './measurement.js';
import { STATISTICS_CONTENT } from './statistics.js';
import { GEOMETRY_CONTENT } from './geometry.js';
import { VISUAL_CONTENT } from './visual.js';
import { LOWER_PRIMARY_CONTENT } from './lowerPrimary.js';

export const STRUCTURED_CONTENT = {
  ...ALGEBRA_CONTENT,
  ...CALCULUS_CONTENT,
  ...FRACTIONS_CONTENT,
  ...NUMBERS_CONTENT,
  ...MEASUREMENT_CONTENT,
  ...STATISTICS_CONTENT,
  ...GEOMETRY_CONTENT,
  ...VISUAL_CONTENT,
  ...LOWER_PRIMARY_CONTENT,
};

export const STRUCTURED_IDS = Object.keys(STRUCTURED_CONTENT);
