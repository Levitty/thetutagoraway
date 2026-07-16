// ============================================================================
// CAMBRIDGE CONTENT — reuses HOREB's existing (verified) problem content.
//
// Cambridge maths overlaps almost entirely with the maths content already
// built. Rather than re-author, each Cambridge skill maps to the equivalent
// existing skill id; problems are generated from that. Skills mapped to a
// structured-content id get the full CPA treatment (worked example, hints,
// misconceptions, concrete escalation); the rest use the reliable legacy
// generators. Zero new content required to launch Cambridge.
// ============================================================================

import { generateProblem, generateWorkedExample } from './problemGenerators.js';

// Cambridge skill id  ->  existing math skill id (structured or legacy)
export const CAMBRIDGE_MAP = {
  // ---- Primary ----
  CP_COUNTING: 'G5_PLACE_VALUE',
  CP_PLACE_VALUE: 'G6_PLACE_VALUE',          // structured place-value chart
  CP_ADD_SUB: 'G5_ADDITION',
  CP_MULTIPLY: 'G5_MULTIPLICATION',          // structured array model
  CP_DIVIDE: 'G5_DIVISION',                  // structured array model
  CP_FACTORS: 'G7_PRIMES',                   // structured prime/composite
  CP_NEGATIVES: 'G6_INTEGERS_INTRO',         // structured number line
  CP_FRACTIONS: 'G5_FRACTIONS_INTRO',        // structured shade/place
  CP_FRACTIONS_OPS: 'G6_FRACTIONS_ADD',      // structured (escalates to bars)
  CP_FRACTIONS_MD: 'G6_FRACTIONS_MUL',       // structured (area model)
  CP_DECIMALS: 'G5_DECIMALS_INTRO',          // structured decimal grid
  CP_DECIMALS_OPS: 'G5_DECIMALS_ADD',        // structured
  CP_PERCENT: 'G6_PERCENTAGES_INTRO',        // structured (100-grid)
  CP_SHAPES: 'G5_TRIANGLES_INTRO',
  CP_ANGLES: 'G6_TRIANGLE_PROPERTIES',       // structured angle sum
  CP_PERIMETER_AREA: 'G6_AREA_RECT',         // structured
  CP_MEASURE: 'G5_LENGTH',
  CP_DATA: 'G5_BAR_GRAPHS',
  CP_AVERAGES: 'G6_MEAN',                    // structured

  // ---- Lower Secondary ----
  LS_INTEGERS: 'G6_INTEGERS_ADD_SUB',        // structured (number-line jumps)
  LS_INDICES: 'G8_INDICES_INTRO',            // structured
  LS_ROUNDING: 'G6_PLACE_VALUE',
  LS_RATIO: 'G8_RATIO_PROPORTION',
  LS_EXPRESSIONS: 'G7_EXPRESSIONS',          // structured (collect terms)
  LS_EQUATIONS: 'G7_EQUATIONS_SOLVE',        // structured
  LS_COORDINATES: 'G8_COORDINATES',          // structured (plot points)
  LS_ANGLES: 'G6_ANGLE_PROPERTIES',          // structured (angles on line)
  LS_TRANSFORM: 'G8_TRANSFORMATIONS_INTRO',  // structured (reflect/translate)

  // ---- IGCSE Core ----
  IG_STANDARD_FORM: 'G8_STANDARD_FORM',
  IG_PERCENT_APP: 'G8_PERCENTAGE_CHANGE',    // structured
  IG_BOUNDS: 'G8_STANDARD_FORM',
  IG_LCM_HCF: 'G7_LCM',                      // structured
  IG_EXPAND: 'G8_EXPAND_BRACKETS',           // structured
  IG_FACTORISE: 'G8_FACTORIZE_COMMON',       // structured
  IG_EQUATIONS_ADV: 'G8_LINEAR_EQ_ADV',      // structured
  IG_SIMULTANEOUS: 'G8_SIMULTANEOUS_INTRO',
  IG_INEQUALITIES: 'G8_INEQUALITIES',
  IG_SEQUENCES: 'G8_SEQUENCES',              // structured
  IG_LINEAR_GRAPHS: 'G8_LINEAR_GRAPHS',
  IG_POLYGONS: 'G8_POLYGON_ANGLES',          // structured
  IG_AREA_PERIMETER: 'G7_AREA_CIRCLE',       // structured
  IG_VOLUME: 'G7_VOLUME_CYLINDER',           // structured
  IG_PYTHAGORAS: 'G7_PYTHAGORAS',            // structured
  IG_TRIG_BASIC: 'G9_TRIG_INTRO',            // structured (trig ratio)
  IG_PROBABILITY: 'G8_PROBABILITY_INTRO',    // structured
  IG_AVERAGES: 'G7_MEAN_MEDIAN_MODE',        // structured
  IG_STATS_DIAGRAMS: 'G6_PIE_CHARTS',

  // ---- IGCSE Extended ----
  IG_SURDS: 'G9_SURDS_INTRO',
  IG_INDICES_FRAC: 'G8_INDICES_LAWS',        // structured
  IG_EXP_GROWTH: 'G9_COMPOUND_INTEREST',
  IG_QUAD_EXPAND: 'G9_QUADRATIC_EXPAND',     // structured
  IG_QUAD_FACTOR: 'G9_QUADRATIC_FACTORIZE',  // structured
  IG_QUAD_SOLVE: 'G9_QUADRATIC_SOLVE',       // structured
  IG_QUAD_FORMULA: 'G9_QUADRATIC_FORMULA',   // structured
  IG_COMPLETE_SQ: 'G9_COMPLETING_SQUARE',    // structured
  IG_ALG_FRACTIONS: 'G9_QUADRATIC_FACTORIZE',
  IG_FUNCTIONS: 'G9_FUNCTIONS_INTRO',        // structured
  IG_VARIATION: 'G9_VARIATION',
  IG_QUAD_GRAPHS: 'G9_QUADRATIC_GRAPHS',
  IG_CIRCLE_THEOREMS: 'G9_CIRCLE_THEOREMS_INTRO',
  IG_SIMILAR: 'G8_SIMILARITY',
  IG_SINE_COSINE: 'G10_SINE_COSINE_RULE',
  IG_VECTORS: 'G10_VECTORS_INTRO',
  IG_CUMULATIVE: 'G8_CUMULATIVE_FREQ',
};

export const cambridgeGenerate = (skillId, opts = {}) =>
  generateProblem(CAMBRIDGE_MAP[skillId] || skillId, opts);

export const cambridgeGenerateExample = (skillId) =>
  generateWorkedExample(CAMBRIDGE_MAP[skillId] || skillId);
