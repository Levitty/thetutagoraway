// ============================================================================
// SAT MATH KNOWLEDGE GRAPH — the four Digital SAT math content domains.
// `grade` here is a difficulty band (1 foundational → 4 hardest) used by the
// engine for placement; SAT has no year levels.
// ============================================================================
const S = {
  ALG: 'Algebra',
  ADV: 'Advanced Math',
  DATA: 'Problem Solving & Data Analysis',
  GEO: 'Geometry & Trigonometry',
};

const skill = (id, name, band, strand, opts = {}) => ({
  id, name, grade: band, strand,
  prerequisites: opts.pre || [],
  keyPrerequisites: opts.keyPre || opts.pre || [],
  encompassings: [], weight: opts.w || 3, critical: opts.crit || false,
  knowledgePoints: 3, masteryThreshold: 0.85, minProblems: 6, estimatedMinutes: 15, xpValue: 15,
});

export const SAT_SKILLS = {
  // ---- Foundations (band 1) ----
  SAT_ARITHMETIC:   skill('SAT_ARITHMETIC', 'Fractions, Decimals & Integers', 1, S.DATA, { w: 2, crit: true }),
  SAT_RATIOS:       skill('SAT_RATIOS', 'Ratios, Rates & Proportions', 1, S.DATA, { pre: ['SAT_ARITHMETIC'], w: 3, crit: true }),
  SAT_PERCENT:      skill('SAT_PERCENT', 'Percentages', 1, S.DATA, { pre: ['SAT_ARITHMETIC'], w: 3, crit: true }),
  SAT_UNITS:        skill('SAT_UNITS', 'Units & Conversions', 1, S.DATA, { pre: ['SAT_RATIOS'], w: 2 }),

  // ---- Algebra (band 2) ----
  SAT_LINEAR_EQ:    skill('SAT_LINEAR_EQ', 'Linear Equations (1 variable)', 2, S.ALG, { pre: ['SAT_ARITHMETIC'], w: 4, crit: true }),
  SAT_LINEAR_2V:    skill('SAT_LINEAR_2V', 'Linear Equations (2 variables)', 2, S.ALG, { pre: ['SAT_LINEAR_EQ'], w: 4, crit: true }),
  SAT_LINEAR_FUNC:  skill('SAT_LINEAR_FUNC', 'Linear Functions & Graphs', 2, S.ALG, { pre: ['SAT_LINEAR_2V'], w: 4, crit: true }),
  SAT_SYSTEMS:      skill('SAT_SYSTEMS', 'Systems of Linear Equations', 2, S.ALG, { pre: ['SAT_LINEAR_2V'], w: 5, crit: true }),
  SAT_INEQUALITIES: skill('SAT_INEQUALITIES', 'Linear Inequalities', 2, S.ALG, { pre: ['SAT_LINEAR_EQ'], w: 4 }),

  // ---- Data analysis (band 2) ----
  SAT_PERCENT_CHANGE: skill('SAT_PERCENT_CHANGE', 'Percent Change', 2, S.DATA, { pre: ['SAT_PERCENT'], w: 3 }),
  SAT_STATISTICS:   skill('SAT_STATISTICS', 'Mean, Median, Mode & Range', 2, S.DATA, { pre: ['SAT_ARITHMETIC'], w: 3, crit: true }),
  SAT_PROBABILITY:  skill('SAT_PROBABILITY', 'Probability', 2, S.DATA, { pre: ['SAT_ARITHMETIC'], w: 3 }),
  SAT_SCATTER:      skill('SAT_SCATTER', 'Scatterplots & Models', 3, S.DATA, { pre: ['SAT_LINEAR_FUNC', 'SAT_STATISTICS'], w: 4 }),

  // ---- Advanced math (band 3) ----
  SAT_EXPONENTS:    skill('SAT_EXPONENTS', 'Exponents & Radicals', 3, S.ADV, { pre: ['SAT_ARITHMETIC'], w: 4, crit: true }),
  SAT_EQUIV_EXPR:   skill('SAT_EQUIV_EXPR', 'Equivalent Expressions (Expand/Simplify)', 3, S.ADV, { pre: ['SAT_LINEAR_EQ'], w: 4, crit: true }),
  SAT_FACTOR:       skill('SAT_FACTOR', 'Factoring Quadratics', 3, S.ADV, { pre: ['SAT_EQUIV_EXPR'], w: 5, crit: true }),
  SAT_QUADRATICS:   skill('SAT_QUADRATICS', 'Quadratic Equations', 3, S.ADV, { pre: ['SAT_FACTOR'], w: 5, crit: true }),
  SAT_QUAD_FORMULA: skill('SAT_QUAD_FORMULA', 'The Quadratic Formula', 4, S.ADV, { pre: ['SAT_QUADRATICS'], w: 6 }),
  SAT_NONLINEAR:    skill('SAT_NONLINEAR', 'Nonlinear Functions & Graphs', 4, S.ADV, { pre: ['SAT_QUADRATICS', 'SAT_LINEAR_FUNC'], w: 6, crit: true }),

  // ---- Geometry & trigonometry (band 2–3) ----
  SAT_ANGLES:       skill('SAT_ANGLES', 'Lines, Angles & Triangles', 2, S.GEO, { pre: ['SAT_LINEAR_EQ'], w: 3, crit: true }),
  SAT_AREA_VOLUME:  skill('SAT_AREA_VOLUME', 'Area & Volume', 2, S.GEO, { pre: ['SAT_ARITHMETIC'], w: 3 }),
  SAT_PYTHAGORAS:   skill('SAT_PYTHAGORAS', 'Pythagorean Theorem', 3, S.GEO, { pre: ['SAT_EXPONENTS', 'SAT_ANGLES'], w: 4, crit: true }),
  SAT_TRIG:         skill('SAT_TRIG', 'Right-Triangle Trigonometry', 3, S.GEO, { pre: ['SAT_PYTHAGORAS', 'SAT_RATIOS'], w: 5 }),
  SAT_CIRCLES:      skill('SAT_CIRCLES', 'Circles', 3, S.GEO, { pre: ['SAT_AREA_VOLUME', 'SAT_ANGLES'], w: 4 }),
  SAT_SIMILAR:      skill('SAT_SIMILAR', 'Similar Triangles', 3, S.GEO, { pre: ['SAT_ANGLES', 'SAT_RATIOS'], w: 4 }),
};

export const SAT_SKILL_COUNT = Object.keys(SAT_SKILLS).length;
export const SAT_STRANDS = Object.values(S);
export const SAT_BANDS = [...new Set(Object.values(SAT_SKILLS).map(s => s.grade))].sort((a, b) => a - b);
export const getSatByBand = (b) => Object.values(SAT_SKILLS).filter(s => s.grade === b);
export const getSatByStrand = (st) => Object.values(SAT_SKILLS).filter(s => s.strand === st);
export const getSatPostRequisites = (id) => Object.values(SAT_SKILLS).filter(s => s.prerequisites.includes(id));
export default SAT_SKILLS;
