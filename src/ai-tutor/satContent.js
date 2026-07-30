// SAT MATH CONTENT — reuses HOREB's existing verified content by mapping each
// SAT skill to the equivalent maths skill id. Zero new content to launch.
import { generateProblem, generateWorkedExample } from './problemGenerators.js';

export const SAT_MAP = {
  SAT_ARITHMETIC: 'G6_FRACTIONS_ADD',       // structured
  SAT_RATIOS: 'G8_RATIO_PROPORTION',
  SAT_PERCENT: 'G7_PERCENTAGES',
  SAT_UNITS: 'G7_LENGTH_CONV',
  SAT_LINEAR_EQ: 'G7_EQUATIONS_SOLVE',      // structured
  SAT_LINEAR_2V: 'G8_LINEAR_EQ_ADV',        // structured
  SAT_LINEAR_FUNC: 'G9_FUNCTIONS_INTRO',    // structured
  SAT_SYSTEMS: 'G8_SIMULTANEOUS_INTRO',
  SAT_INEQUALITIES: 'G8_INEQUALITIES',
  SAT_PERCENT_CHANGE: 'G8_PERCENTAGE_CHANGE', // structured
  SAT_STATISTICS: 'G7_MEAN_MEDIAN_MODE',    // structured
  SAT_PROBABILITY: 'G8_PROBABILITY_INTRO',  // structured
  SAT_SCATTER: 'G9_SCATTER_PLOTS',
  SAT_EXPONENTS: 'G8_INDICES_LAWS',         // structured
  SAT_EQUIV_EXPR: 'G8_EXPAND_BRACKETS',     // structured
  SAT_FACTOR: 'G9_QUADRATIC_FACTORIZE',     // structured
  SAT_QUADRATICS: 'G9_QUADRATIC_SOLVE',     // structured
  SAT_QUAD_FORMULA: 'G9_QUADRATIC_FORMULA', // structured
  SAT_NONLINEAR: 'G9_QUADRATIC_GRAPHS',
  SAT_ANGLES: 'G6_TRIANGLE_PROPERTIES',     // structured
  SAT_AREA_VOLUME: 'G7_VOLUME_CYLINDER',    // structured
  SAT_PYTHAGORAS: 'G7_PYTHAGORAS',          // structured
  SAT_TRIG: 'G9_TRIG_INTRO',                // structured
  SAT_CIRCLES: 'G7_AREA_CIRCLE',            // structured
  SAT_SIMILAR: 'G8_SIMILARITY',
};

export const satGenerate = (id, opts = {}) => generateProblem(SAT_MAP[id] || id, opts);
export const satGenerateExample = (id) => generateWorkedExample(SAT_MAP[id] || id);
