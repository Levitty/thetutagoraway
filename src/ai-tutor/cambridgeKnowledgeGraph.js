// ============================================================================
// CAMBRIDGE MATHEMATICS KNOWLEDGE GRAPH
// Primary (Stages 1–6) + IGCSE 0580 (Core & Extended)
// Structured to the Cambridge topic areas; grounded in the 0580 syllabus and
// the 2025 specimen papers. `stage` is the Cambridge stage (1–6 Primary,
// 7–9 Lower Secondary bridge, 10 IGCSE Core, 11 IGCSE Extended). `tier` marks
// Core vs Extended so a Core student is never pushed into Extended-only skills.
// ============================================================================

// Cambridge topic areas (0580 strands)
const S = {
  NUM: 'Number',
  ALG: 'Algebra & Graphs',
  COORD: 'Coordinate Geometry',
  GEO: 'Geometry',
  MEN: 'Mensuration',
  TRIG: 'Trigonometry',
  VEC: 'Transformations & Vectors',
  PROB: 'Probability',
  STA: 'Statistics',
};

const skill = (id, name, stage, strand, opts = {}) => ({
  id,
  name,
  grade: stage,                 // reuse `grade` field name for engine compatibility
  strand,
  tier: opts.tier || 'core',    // 'primary' | 'core' | 'extended'
  prerequisites: opts.pre || [],
  keyPrerequisites: opts.keyPre || opts.pre || [],
  encompassings: opts.enc || [],
  weight: opts.w || 3,
  critical: opts.crit || false,
  knowledgePoints: opts.kp || 3,
  masteryThreshold: opts.mt || 0.85,
  minProblems: opts.min || 6,
  estimatedMinutes: opts.mins || 15,
  xpValue: opts.xp || 15,
});

// ============================================================================
// PRIMARY (Stages 1–6) — number sense, operations, fractions, basic geometry,
// measure and data. The foundation an IGCSE student is assumed to have.
// ============================================================================
const PRIMARY = {
  // Number & counting
  CP_COUNTING:       skill('CP_COUNTING', 'Counting & Number to 100', 1, S.NUM, { tier: 'primary', w: 1, min: 5 }),
  CP_PLACE_VALUE:    skill('CP_PLACE_VALUE', 'Place Value (to 10,000)', 3, S.NUM, { tier: 'primary', pre: ['CP_COUNTING'], w: 2 }),
  CP_ADD_SUB:        skill('CP_ADD_SUB', 'Addition & Subtraction', 2, S.NUM, { tier: 'primary', pre: ['CP_COUNTING'], w: 2, crit: true }),
  CP_MULTIPLY:       skill('CP_MULTIPLY', 'Multiplication (Times Tables)', 3, S.NUM, { tier: 'primary', pre: ['CP_ADD_SUB'], w: 2, crit: true }),
  CP_DIVIDE:         skill('CP_DIVIDE', 'Division', 4, S.NUM, { tier: 'primary', pre: ['CP_MULTIPLY'], w: 2, crit: true }),
  CP_FACTORS:        skill('CP_FACTORS', 'Factors, Multiples & Primes', 5, S.NUM, { tier: 'primary', pre: ['CP_MULTIPLY', 'CP_DIVIDE'], w: 3 }),
  CP_NEGATIVES:      skill('CP_NEGATIVES', 'Negative Numbers', 5, S.NUM, { tier: 'primary', pre: ['CP_ADD_SUB'], w: 2 }),

  // Fractions, decimals, percentages
  CP_FRACTIONS:      skill('CP_FRACTIONS', 'Understanding Fractions', 3, S.NUM, { tier: 'primary', pre: ['CP_DIVIDE'], w: 2, crit: true }),
  CP_FRACTIONS_OPS:  skill('CP_FRACTIONS_OPS', 'Adding & Subtracting Fractions', 5, S.NUM, { tier: 'primary', pre: ['CP_FRACTIONS', 'CP_FACTORS'], w: 3 }),
  CP_FRACTIONS_MD:   skill('CP_FRACTIONS_MD', 'Multiplying & Dividing Fractions', 6, S.NUM, { tier: 'primary', pre: ['CP_FRACTIONS_OPS'], w: 3 }),
  CP_DECIMALS:       skill('CP_DECIMALS', 'Decimals', 4, S.NUM, { tier: 'primary', pre: ['CP_PLACE_VALUE', 'CP_FRACTIONS'], w: 2 }),
  CP_DECIMALS_OPS:   skill('CP_DECIMALS_OPS', 'Decimal Operations', 6, S.NUM, { tier: 'primary', pre: ['CP_DECIMALS', 'CP_MULTIPLY'], w: 3 }),
  CP_PERCENT:        skill('CP_PERCENT', 'Percentages', 6, S.NUM, { tier: 'primary', pre: ['CP_FRACTIONS', 'CP_DECIMALS'], w: 3, crit: true }),

  // Geometry & measure
  CP_SHAPES:         skill('CP_SHAPES', '2D & 3D Shapes', 2, S.GEO, { tier: 'primary', w: 1 }),
  CP_ANGLES:         skill('CP_ANGLES', 'Angles & Turns', 4, S.GEO, { tier: 'primary', pre: ['CP_SHAPES'], w: 2 }),
  CP_PERIMETER_AREA: skill('CP_PERIMETER_AREA', 'Perimeter & Area', 5, S.MEN, { tier: 'primary', pre: ['CP_MULTIPLY', 'CP_SHAPES'], w: 3 }),
  CP_MEASURE:        skill('CP_MEASURE', 'Measure (Length, Mass, Time)', 3, S.MEN, { tier: 'primary', pre: ['CP_ADD_SUB'], w: 2 }),

  // Statistics
  CP_DATA:           skill('CP_DATA', 'Handling Data (Charts)', 4, S.STA, { tier: 'primary', pre: ['CP_COUNTING'], w: 2 }),
  CP_AVERAGES:       skill('CP_AVERAGES', 'Mode, Median & Mean', 6, S.STA, { tier: 'primary', pre: ['CP_ADD_SUB', 'CP_DIVIDE'], w: 3 }),
};

// ============================================================================
// LOWER SECONDARY (Stages 7–9) — the bridge into IGCSE.
// ============================================================================
const LOWER_SEC = {
  LS_INTEGERS:       skill('LS_INTEGERS', 'Integer Operations', 7, S.NUM, { tier: 'core', pre: ['CP_NEGATIVES', 'CP_MULTIPLY'], w: 3, crit: true }),
  LS_INDICES:        skill('LS_INDICES', 'Indices (Powers & Roots)', 8, S.NUM, { tier: 'core', pre: ['CP_MULTIPLY', 'CP_FACTORS'], w: 4, crit: true }),
  LS_ROUNDING:       skill('LS_ROUNDING', 'Rounding & Significant Figures', 7, S.NUM, { tier: 'core', pre: ['CP_DECIMALS'], w: 2 }),
  LS_RATIO:          skill('LS_RATIO', 'Ratio & Proportion', 8, S.NUM, { tier: 'core', pre: ['CP_FRACTIONS_MD', 'CP_DIVIDE'], w: 4, crit: true }),
  LS_EXPRESSIONS:    skill('LS_EXPRESSIONS', 'Algebraic Expressions', 7, S.ALG, { tier: 'core', pre: ['LS_INTEGERS'], w: 3, crit: true }),
  LS_EQUATIONS:      skill('LS_EQUATIONS', 'Linear Equations', 8, S.ALG, { tier: 'core', pre: ['LS_EXPRESSIONS'], w: 4, crit: true }),
  LS_COORDINATES:    skill('LS_COORDINATES', 'Coordinates & Straight Lines', 8, S.COORD, { tier: 'core', pre: ['LS_INTEGERS'], w: 3, crit: true }),
  LS_ANGLES:         skill('LS_ANGLES', 'Angle Rules & Parallel Lines', 7, S.GEO, { tier: 'core', pre: ['CP_ANGLES'], w: 3, crit: true }),
  LS_TRANSFORM:      skill('LS_TRANSFORM', 'Transformations (Basic)', 9, S.VEC, { tier: 'core', pre: ['LS_COORDINATES'], w: 3 }),
};

// ============================================================================
// IGCSE 0580 — CORE (stage 10). The common content all candidates take.
// ============================================================================
const IGCSE_CORE = {
  // Number
  IG_STANDARD_FORM:  skill('IG_STANDARD_FORM', 'Standard Form', 10, S.NUM, { tier: 'core', pre: ['LS_INDICES', 'LS_ROUNDING'], w: 4, crit: true }),
  IG_PERCENT_APP:    skill('IG_PERCENT_APP', 'Percentage Applications (Interest, Change)', 10, S.NUM, { tier: 'core', pre: ['CP_PERCENT', 'LS_RATIO'], w: 4, crit: true }),
  IG_BOUNDS:         skill('IG_BOUNDS', 'Bounds & Estimation', 10, S.NUM, { tier: 'core', pre: ['LS_ROUNDING'], w: 3 }),
  IG_LCM_HCF:        skill('IG_LCM_HCF', 'LCM, HCF & Prime Factorisation', 10, S.NUM, { tier: 'core', pre: ['CP_FACTORS'], w: 3 }),

  // Algebra & graphs
  IG_EXPAND:         skill('IG_EXPAND', 'Expanding Brackets', 10, S.ALG, { tier: 'core', pre: ['LS_EXPRESSIONS'], w: 4, crit: true }),
  IG_FACTORISE:      skill('IG_FACTORISE', 'Factorising (Common Factor)', 10, S.ALG, { tier: 'core', pre: ['IG_EXPAND'], w: 4 }),
  IG_EQUATIONS_ADV:  skill('IG_EQUATIONS_ADV', 'Equations (Brackets, Both Sides)', 10, S.ALG, { tier: 'core', pre: ['LS_EQUATIONS', 'IG_EXPAND'], w: 5, crit: true }),
  IG_SIMULTANEOUS:   skill('IG_SIMULTANEOUS', 'Simultaneous Equations', 10, S.ALG, { tier: 'core', pre: ['IG_EQUATIONS_ADV'], w: 5, crit: true }),
  IG_INEQUALITIES:   skill('IG_INEQUALITIES', 'Inequalities', 10, S.ALG, { tier: 'core', pre: ['IG_EQUATIONS_ADV'], w: 4 }),
  IG_SEQUENCES:      skill('IG_SEQUENCES', 'Sequences & nth Term', 10, S.ALG, { tier: 'core', pre: ['LS_EXPRESSIONS'], w: 4 }),
  IG_LINEAR_GRAPHS:  skill('IG_LINEAR_GRAPHS', 'Linear Graphs (y = mx + c)', 10, S.COORD, { tier: 'core', pre: ['LS_COORDINATES', 'LS_EQUATIONS'], w: 5, crit: true }),

  // Geometry & mensuration
  IG_POLYGONS:       skill('IG_POLYGONS', 'Angles in Polygons', 10, S.GEO, { tier: 'core', pre: ['LS_ANGLES'], w: 3 }),
  IG_AREA_PERIMETER: skill('IG_AREA_PERIMETER', 'Area & Perimeter (Circle, Composite)', 10, S.MEN, { tier: 'core', pre: ['CP_PERIMETER_AREA'], w: 4, crit: true }),
  IG_VOLUME:         skill('IG_VOLUME', 'Volume & Surface Area', 10, S.MEN, { tier: 'core', pre: ['IG_AREA_PERIMETER'], w: 4, crit: true }),
  IG_PYTHAGORAS:     skill('IG_PYTHAGORAS', 'Pythagoras’ Theorem', 10, S.TRIG, { tier: 'core', pre: ['LS_INDICES', 'IG_AREA_PERIMETER'], w: 4, crit: true }),
  IG_TRIG_BASIC:     skill('IG_TRIG_BASIC', 'Right-Angled Trigonometry (SOHCAHTOA)', 10, S.TRIG, { tier: 'core', pre: ['IG_PYTHAGORAS', 'LS_RATIO'], w: 5, crit: true }),

  // Probability & statistics
  IG_PROBABILITY:    skill('IG_PROBABILITY', 'Probability', 10, S.PROB, { tier: 'core', pre: ['CP_FRACTIONS_OPS'], w: 4, crit: true }),
  IG_AVERAGES:       skill('IG_AVERAGES', 'Averages & Range', 10, S.STA, { tier: 'core', pre: ['CP_AVERAGES'], w: 3 }),
  IG_STATS_DIAGRAMS: skill('IG_STATS_DIAGRAMS', 'Statistical Diagrams', 10, S.STA, { tier: 'core', pre: ['CP_DATA', 'IG_AVERAGES'], w: 3 }),
};

// ============================================================================
// IGCSE 0580 — EXTENDED (stage 11). Additional content beyond Core.
// ============================================================================
const IGCSE_EXTENDED = {
  // Number
  IG_SURDS:          skill('IG_SURDS', 'Surds', 11, S.NUM, { tier: 'extended', pre: ['LS_INDICES', 'IG_STANDARD_FORM'], w: 5, crit: true }),
  IG_INDICES_FRAC:   skill('IG_INDICES_FRAC', 'Fractional & Negative Indices', 11, S.NUM, { tier: 'extended', pre: ['LS_INDICES', 'CP_FRACTIONS_MD'], w: 5 }),
  IG_EXP_GROWTH:     skill('IG_EXP_GROWTH', 'Exponential Growth & Decay', 11, S.NUM, { tier: 'extended', pre: ['IG_PERCENT_APP', 'LS_INDICES'], w: 5 }),

  // Algebra & graphs
  IG_QUAD_EXPAND:    skill('IG_QUAD_EXPAND', 'Expanding Quadratics', 11, S.ALG, { tier: 'extended', pre: ['IG_EXPAND'], w: 5, crit: true }),
  IG_QUAD_FACTOR:    skill('IG_QUAD_FACTOR', 'Factorising Quadratics', 11, S.ALG, { tier: 'extended', pre: ['IG_QUAD_EXPAND', 'IG_FACTORISE'], w: 5, crit: true }),
  IG_QUAD_SOLVE:     skill('IG_QUAD_SOLVE', 'Solving Quadratics (Factorising)', 11, S.ALG, { tier: 'extended', pre: ['IG_QUAD_FACTOR'], w: 5, crit: true }),
  IG_QUAD_FORMULA:   skill('IG_QUAD_FORMULA', 'Quadratic Formula', 11, S.ALG, { tier: 'extended', pre: ['IG_QUAD_SOLVE', 'IG_SURDS'], w: 6 }),
  IG_COMPLETE_SQ:    skill('IG_COMPLETE_SQ', 'Completing the Square', 11, S.ALG, { tier: 'extended', pre: ['IG_QUAD_EXPAND'], w: 6 }),
  IG_ALG_FRACTIONS:  skill('IG_ALG_FRACTIONS', 'Algebraic Fractions', 11, S.ALG, { tier: 'extended', pre: ['IG_QUAD_FACTOR', 'CP_FRACTIONS_OPS'], w: 6 }),
  IG_FUNCTIONS:      skill('IG_FUNCTIONS', 'Functions (Composite & Inverse)', 11, S.ALG, { tier: 'extended', pre: ['IG_EQUATIONS_ADV'], w: 6, crit: true }),
  IG_VARIATION:      skill('IG_VARIATION', 'Direct & Inverse Variation', 11, S.ALG, { tier: 'extended', pre: ['LS_RATIO', 'IG_EQUATIONS_ADV'], w: 5 }),
  IG_QUAD_GRAPHS:    skill('IG_QUAD_GRAPHS', 'Quadratic & Cubic Graphs', 11, S.COORD, { tier: 'extended', pre: ['IG_QUAD_SOLVE', 'IG_LINEAR_GRAPHS'], w: 6 }),

  // Geometry & trig
  IG_CIRCLE_THEOREMS: skill('IG_CIRCLE_THEOREMS', 'Circle Theorems', 11, S.GEO, { tier: 'extended', pre: ['IG_POLYGONS'], w: 6, crit: true }),
  IG_SIMILAR:        skill('IG_SIMILAR', 'Similar Shapes (Area & Volume)', 11, S.GEO, { tier: 'extended', pre: ['LS_RATIO', 'IG_VOLUME'], w: 5 }),
  IG_SINE_COSINE:    skill('IG_SINE_COSINE', 'Sine & Cosine Rules', 11, S.TRIG, { tier: 'extended', pre: ['IG_TRIG_BASIC', 'IG_QUAD_FORMULA'], w: 6, crit: true }),

  // Vectors & transformations
  IG_VECTORS:        skill('IG_VECTORS', 'Vectors', 11, S.VEC, { tier: 'extended', pre: ['LS_TRANSFORM', 'IG_PYTHAGORAS'], w: 5 }),

  // Statistics
  IG_CUMULATIVE:     skill('IG_CUMULATIVE', 'Cumulative Frequency & Histograms', 11, S.STA, { tier: 'extended', pre: ['IG_STATS_DIAGRAMS'], w: 5 }),
};

export const CAMBRIDGE_SKILLS = {
  ...PRIMARY,
  ...LOWER_SEC,
  ...IGCSE_CORE,
  ...IGCSE_EXTENDED,
};

export const CAMBRIDGE_SKILL_COUNT = Object.keys(CAMBRIDGE_SKILLS).length;
export const CAMBRIDGE_STRANDS = Object.values(S);
export const CAMBRIDGE_STAGES = [...new Set(Object.values(CAMBRIDGE_SKILLS).map(s => s.grade))].sort((a, b) => a - b);

export const getCambridgeByStage = (stage) => Object.values(CAMBRIDGE_SKILLS).filter(s => s.grade === stage);
export const getCambridgeByStrand = (strand) => Object.values(CAMBRIDGE_SKILLS).filter(s => s.strand === strand);
export const getCambridgePostRequisites = (skillId) => Object.values(CAMBRIDGE_SKILLS).filter(s => s.prerequisites.includes(skillId));

export default CAMBRIDGE_SKILLS;
