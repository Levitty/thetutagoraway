// ============================================================================
// TUTAGORA KNOWLEDGE GRAPH — Grade 5-12 Math (CBC Kenya + Universal)
// Based on "The Math Academy Way" methodology
// ============================================================================

// Strand constants
const S = {
  NUM: 'Numbers',
  ALG: 'Algebra',
  GEO: 'Geometry',
  MEA: 'Measurements',
  STA: 'Statistics',
};

// Skill builder helper
const skill = (id, name, grade, strand, opts = {}) => ({
  id,
  name,
  grade,
  strand,
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
// GRADE 5 — Foundation (~25 skills)
// ============================================================================

const GRADE_5 = {
  // Numbers
  G5_PLACE_VALUE: skill('G5_PLACE_VALUE', 'Place Value (Thousands)', 5, S.NUM, { w: 1, min: 5 }),
  G5_ADDITION: skill('G5_ADDITION', 'Addition (Multi-digit)', 5, S.NUM, { w: 1, min: 5 }),
  G5_SUBTRACTION: skill('G5_SUBTRACTION', 'Subtraction (Multi-digit)', 5, S.NUM, { w: 1, min: 5 }),
  G5_MULTIPLICATION: skill('G5_MULTIPLICATION', 'Multiplication (2-digit × 1-digit)', 5, S.NUM, { w: 2, min: 5 }),
  G5_DIVISION: skill('G5_DIVISION', 'Division (by 1-digit)', 5, S.NUM, { w: 2, min: 5 }),
  G5_FACTORS: skill('G5_FACTORS', 'Factors of a Number', 5, S.NUM, { pre: ['G5_MULTIPLICATION', 'G5_DIVISION'], w: 2 }),
  G5_MULTIPLES: skill('G5_MULTIPLES', 'Multiples of a Number', 5, S.NUM, { pre: ['G5_MULTIPLICATION'], w: 2 }),
  G5_FRACTIONS_INTRO: skill('G5_FRACTIONS_INTRO', 'Understanding Fractions', 5, S.NUM, { w: 2 }),
  G5_FRACTIONS_EQUIV: skill('G5_FRACTIONS_EQUIV', 'Equivalent Fractions', 5, S.NUM, { pre: ['G5_FRACTIONS_INTRO', 'G5_MULTIPLICATION'], w: 2 }),
  G5_FRACTIONS_ADD_LIKE: skill('G5_FRACTIONS_ADD_LIKE', 'Adding Fractions (Like Denominators)', 5, S.NUM, { pre: ['G5_FRACTIONS_INTRO', 'G5_ADDITION'], w: 2 }),
  G5_FRACTIONS_SUB_LIKE: skill('G5_FRACTIONS_SUB_LIKE', 'Subtracting Fractions (Like Denominators)', 5, S.NUM, { pre: ['G5_FRACTIONS_INTRO', 'G5_SUBTRACTION'], w: 2 }),
  G5_DECIMALS_INTRO: skill('G5_DECIMALS_INTRO', 'Understanding Decimals', 5, S.NUM, { pre: ['G5_FRACTIONS_INTRO'], w: 2 }),
  G5_DECIMALS_ADD: skill('G5_DECIMALS_ADD', 'Adding Decimals', 5, S.NUM, { pre: ['G5_DECIMALS_INTRO', 'G5_ADDITION'], w: 2 }),
  G5_DECIMALS_SUB: skill('G5_DECIMALS_SUB', 'Subtracting Decimals', 5, S.NUM, { pre: ['G5_DECIMALS_INTRO', 'G5_SUBTRACTION'], w: 2 }),

  // Geometry
  G5_ANGLES_INTRO: skill('G5_ANGLES_INTRO', 'Types of Angles', 5, S.GEO, { w: 1 }),
  G5_TRIANGLES_INTRO: skill('G5_TRIANGLES_INTRO', 'Types of Triangles', 5, S.GEO, { pre: ['G5_ANGLES_INTRO'], w: 2 }),
  G5_LINES: skill('G5_LINES', 'Parallel & Perpendicular Lines', 5, S.GEO, { w: 1 }),

  // Measurements
  G5_LENGTH: skill('G5_LENGTH', 'Measuring Length (cm, m, km)', 5, S.MEA, { w: 1 }),
  G5_MASS: skill('G5_MASS', 'Measuring Mass (g, kg)', 5, S.MEA, { w: 1 }),
  G5_TIME: skill('G5_TIME', 'Telling Time & Duration', 5, S.MEA, { w: 1 }),
  G5_PERIMETER_INTRO: skill('G5_PERIMETER_INTRO', 'Perimeter of Rectangles', 5, S.MEA, { pre: ['G5_ADDITION', 'G5_LENGTH'], w: 2 }),
  G5_AREA_INTRO: skill('G5_AREA_INTRO', 'Area of Rectangles (Counting Squares)', 5, S.MEA, { pre: ['G5_MULTIPLICATION'], w: 2 }),

  // Statistics
  G5_TALLY: skill('G5_TALLY', 'Tally Charts & Frequency Tables', 5, S.STA, { w: 1 }),
  G5_BAR_GRAPHS: skill('G5_BAR_GRAPHS', 'Reading Bar Graphs', 5, S.STA, { pre: ['G5_TALLY'], w: 1 }),
  G5_PICTOGRAPHS: skill('G5_PICTOGRAPHS', 'Reading Pictographs', 5, S.STA, { pre: ['G5_TALLY'], w: 1 }),
};

// ============================================================================
// GRADE 6 — Building Blocks (~30 skills)
// ============================================================================

const GRADE_6 = {
  // Numbers
  G6_PLACE_VALUE: skill('G6_PLACE_VALUE', 'Place Value (Millions)', 6, S.NUM, { pre: ['G5_PLACE_VALUE'], w: 2 }),
  G6_BODMAS_BASIC: skill('G6_BODMAS_BASIC', 'Order of Operations (BODMAS)', 6, S.NUM, { pre: ['G5_ADDITION', 'G5_SUBTRACTION', 'G5_MULTIPLICATION', 'G5_DIVISION'], w: 3, crit: true }),
  G6_FRACTIONS_ADD: skill('G6_FRACTIONS_ADD', 'Adding Fractions (Unlike Denominators)', 6, S.NUM, { pre: ['G5_FRACTIONS_ADD_LIKE', 'G5_FRACTIONS_EQUIV', 'G5_MULTIPLES'], w: 4, crit: true }),
  G6_FRACTIONS_SUB: skill('G6_FRACTIONS_SUB', 'Subtracting Fractions (Unlike Denominators)', 6, S.NUM, { pre: ['G5_FRACTIONS_SUB_LIKE', 'G5_FRACTIONS_EQUIV', 'G5_MULTIPLES'], w: 4 }),
  G6_FRACTIONS_MUL: skill('G6_FRACTIONS_MUL', 'Multiplying Fractions', 6, S.NUM, { pre: ['G5_FRACTIONS_INTRO', 'G5_MULTIPLICATION'], w: 3, crit: true }),
  G6_FRACTIONS_DIV: skill('G6_FRACTIONS_DIV', 'Dividing Fractions', 6, S.NUM, { pre: ['G6_FRACTIONS_MUL'], w: 4 }),
  G6_MIXED_NUMBERS: skill('G6_MIXED_NUMBERS', 'Mixed Numbers & Improper Fractions', 6, S.NUM, { pre: ['G6_FRACTIONS_ADD'], w: 3 }),
  G6_DECIMALS_MUL: skill('G6_DECIMALS_MUL', 'Multiplying Decimals', 6, S.NUM, { pre: ['G5_DECIMALS_INTRO', 'G5_MULTIPLICATION'], w: 4, crit: true }),
  G6_DECIMALS_DIV: skill('G6_DECIMALS_DIV', 'Dividing Decimals', 6, S.NUM, { pre: ['G6_DECIMALS_MUL'], w: 4 }),
  G6_FRACTIONS_DECIMALS: skill('G6_FRACTIONS_DECIMALS', 'Converting Fractions & Decimals', 6, S.NUM, { pre: ['G5_FRACTIONS_INTRO', 'G5_DECIMALS_INTRO', 'G5_DIVISION'], w: 3 }),
  G6_PERCENTAGES_INTRO: skill('G6_PERCENTAGES_INTRO', 'Understanding Percentages', 6, S.NUM, { pre: ['G6_FRACTIONS_DECIMALS'], w: 3, crit: true }),
  G6_RATIOS: skill('G6_RATIOS', 'Ratios & Proportions', 6, S.NUM, { pre: ['G6_FRACTIONS_MUL', 'G5_DIVISION'], w: 4 }),
  G6_INTEGERS_INTRO: skill('G6_INTEGERS_INTRO', 'Introduction to Integers', 6, S.NUM, { w: 2 }),
  G6_INTEGERS_ADD_SUB: skill('G6_INTEGERS_ADD_SUB', 'Adding & Subtracting Integers', 6, S.NUM, { pre: ['G6_INTEGERS_INTRO'], w: 3, crit: true }),
  G6_SQUARES: skill('G6_SQUARES', 'Squares (1-12)', 6, S.NUM, { pre: ['G5_MULTIPLICATION'], w: 2, mt: 0.90 }),

  // Algebra
  G6_PATTERNS: skill('G6_PATTERNS', 'Number Patterns & Sequences', 6, S.ALG, { pre: ['G5_ADDITION', 'G5_MULTIPLICATION'], w: 2 }),
  G6_SIMPLE_EQUATIONS: skill('G6_SIMPLE_EQUATIONS', 'Simple Equations (x + a = b)', 6, S.ALG, { pre: ['G5_ADDITION', 'G5_SUBTRACTION'], w: 3, crit: true }),

  // Geometry
  G6_ANGLE_MEASURE: skill('G6_ANGLE_MEASURE', 'Measuring Angles with Protractor', 6, S.GEO, { pre: ['G5_ANGLES_INTRO'], w: 2 }),
  G6_ANGLE_PROPERTIES: skill('G6_ANGLE_PROPERTIES', 'Angles on a Line & at a Point', 6, S.GEO, { pre: ['G6_ANGLE_MEASURE'], w: 3 }),
  G6_TRIANGLE_PROPERTIES: skill('G6_TRIANGLE_PROPERTIES', 'Triangle Angle Sum', 6, S.GEO, { pre: ['G5_TRIANGLES_INTRO', 'G6_ANGLE_MEASURE'], w: 3, crit: true }),
  G6_SYMMETRY: skill('G6_SYMMETRY', 'Lines of Symmetry', 6, S.GEO, { w: 1 }),

  // Measurements
  G6_PERIMETER: skill('G6_PERIMETER', 'Perimeter (All Shapes)', 6, S.MEA, { pre: ['G5_PERIMETER_INTRO', 'G6_DECIMALS_MUL'], w: 3 }),
  G6_AREA_RECT: skill('G6_AREA_RECT', 'Area of Rectangles & Squares', 6, S.MEA, { pre: ['G5_AREA_INTRO', 'G6_DECIMALS_MUL'], w: 3 }),
  G6_AREA_TRIANGLE: skill('G6_AREA_TRIANGLE', 'Area of Triangles', 6, S.MEA, { pre: ['G6_AREA_RECT', 'G6_FRACTIONS_MUL'], w: 3 }),
  G6_VOLUME_CUBOID: skill('G6_VOLUME_CUBOID', 'Volume of Cuboids', 6, S.MEA, { pre: ['G6_AREA_RECT'], w: 3 }),
  G6_UNIT_CONVERSIONS: skill('G6_UNIT_CONVERSIONS', 'Unit Conversions (Length, Mass, Capacity)', 6, S.MEA, { pre: ['G6_DECIMALS_MUL', 'G6_DECIMALS_DIV'], w: 3 }),

  // Statistics
  G6_MEAN: skill('G6_MEAN', 'Finding the Mean', 6, S.STA, { pre: ['G5_ADDITION', 'G5_DIVISION'], w: 2 }),
  G6_PIE_CHARTS: skill('G6_PIE_CHARTS', 'Reading Pie Charts', 6, S.STA, { pre: ['G6_PERCENTAGES_INTRO', 'G6_ANGLE_MEASURE'], w: 3 }),
  G6_DATA_COLLECTION: skill('G6_DATA_COLLECTION', 'Collecting & Organizing Data', 6, S.STA, { pre: ['G5_TALLY'], w: 1 }),
};

// ============================================================================
// GRADE 7 — Core Skills (~35 skills)
// ============================================================================

const GRADE_7 = {
  // Numbers
  G7_PLACE_VALUE: skill('G7_PLACE_VALUE', 'Place Value (Hundred Millions)', 7, S.NUM, { pre: ['G6_PLACE_VALUE'], w: 2 }),
  G7_BODMAS_ADV: skill('G7_BODMAS_ADV', 'BODMAS (Advanced)', 7, S.NUM, { pre: ['G6_BODMAS_BASIC'], w: 4, crit: true }),
  G7_PRIMES: skill('G7_PRIMES', 'Prime vs Composite Numbers', 7, S.NUM, { pre: ['G5_FACTORS'], w: 3 }),
  G7_DIVISIBILITY: skill('G7_DIVISIBILITY', 'Divisibility Tests', 7, S.NUM, { pre: ['G7_PRIMES'], w: 4 }),
  G7_PRIME_FACTORIZATION: skill('G7_PRIME_FACTORIZATION', 'Prime Factorization', 7, S.NUM, { pre: ['G7_DIVISIBILITY'], w: 5, crit: true }),
  G7_GCD: skill('G7_GCD', 'Greatest Common Divisor (GCD)', 7, S.NUM, { pre: ['G7_PRIME_FACTORIZATION'], w: 4 }),
  G7_LCM: skill('G7_LCM', 'Least Common Multiple (LCM)', 7, S.NUM, { pre: ['G7_PRIME_FACTORIZATION'], w: 4 }),
  G7_FRACTIONS_COMPARE: skill('G7_FRACTIONS_COMPARE', 'Comparing & Ordering Fractions', 7, S.NUM, { pre: ['G6_FRACTIONS_ADD'], w: 3 }),
  G7_FRACTIONS_ADD_UNLIKE: skill('G7_FRACTIONS_ADD_UNLIKE', 'Adding Fractions (Unlike, Advanced)', 7, S.NUM, { pre: ['G7_FRACTIONS_COMPARE', 'G7_LCM'], w: 3 }),
  G7_FRACTIONS_MUL: skill('G7_FRACTIONS_MUL', 'Multiplying Fractions (Advanced)', 7, S.NUM, { pre: ['G6_FRACTIONS_MUL', 'G7_FRACTIONS_COMPARE'], w: 4, crit: true }),
  G7_RECIPROCALS: skill('G7_RECIPROCALS', 'Reciprocals', 7, S.NUM, { pre: ['G7_FRACTIONS_MUL'], w: 2 }),
  G7_FRACTIONS_DIV: skill('G7_FRACTIONS_DIV', 'Dividing Fractions (Advanced)', 7, S.NUM, { pre: ['G7_FRACTIONS_MUL', 'G7_RECIPROCALS'], w: 4, crit: true }),
  G7_DECIMAL_PV: skill('G7_DECIMAL_PV', 'Decimal Place Value (Advanced)', 7, S.NUM, { pre: ['G5_DECIMALS_INTRO'], w: 2 }),
  G7_DECIMALS_MUL: skill('G7_DECIMALS_MUL', 'Multiplying Decimals (Advanced)', 7, S.NUM, { pre: ['G6_DECIMALS_MUL', 'G7_DECIMAL_PV'], w: 4, crit: true }),
  G7_DECIMALS_DIV: skill('G7_DECIMALS_DIV', 'Dividing Decimals (Advanced)', 7, S.NUM, { pre: ['G7_DECIMALS_MUL'], w: 4 }),
  G7_SQUARES_EXT: skill('G7_SQUARES_EXT', 'Squares (Extended)', 7, S.NUM, { pre: ['G6_SQUARES', 'G7_FRACTIONS_MUL', 'G7_DECIMALS_MUL'], w: 3 }),
  G7_SQUARE_ROOTS: skill('G7_SQUARE_ROOTS', 'Square Roots', 7, S.NUM, { pre: ['G7_SQUARES_EXT', 'G7_PRIME_FACTORIZATION'], w: 4, crit: true }),
  G7_INTEGERS_MUL_DIV: skill('G7_INTEGERS_MUL_DIV', 'Multiplying & Dividing Integers', 7, S.NUM, { pre: ['G6_INTEGERS_ADD_SUB', 'G5_MULTIPLICATION', 'G5_DIVISION'], w: 3, crit: true }),
  G7_PERCENTAGES: skill('G7_PERCENTAGES', 'Percentage Calculations', 7, S.NUM, { pre: ['G6_PERCENTAGES_INTRO', 'G7_DECIMALS_MUL'], w: 4, crit: true }),

  // Algebra
  G7_EXPRESSIONS: skill('G7_EXPRESSIONS', 'Forming Algebraic Expressions', 7, S.ALG, { pre: ['G7_BODMAS_ADV'], w: 3 }),
  G7_SIMPLIFY: skill('G7_SIMPLIFY', 'Simplifying Expressions', 7, S.ALG, { pre: ['G7_EXPRESSIONS'], w: 4 }),
  G7_EQUATIONS_FORM: skill('G7_EQUATIONS_FORM', 'Forming Equations', 7, S.ALG, { pre: ['G7_SIMPLIFY'], w: 3 }),
  G7_EQUATIONS_SOLVE: skill('G7_EQUATIONS_SOLVE', 'Solving Linear Equations', 7, S.ALG, { pre: ['G7_EQUATIONS_FORM'], w: 5, crit: true }),
  G7_INEQUALITIES_INTRO: skill('G7_INEQUALITIES_INTRO', 'Introduction to Inequalities', 7, S.ALG, { pre: ['G7_EQUATIONS_SOLVE'], w: 3 }),

  // Geometry & Measurements
  G7_PYTHAGORAS: skill('G7_PYTHAGORAS', 'Pythagorean Theorem', 7, S.GEO, { pre: ['G7_SQUARES_EXT', 'G7_SQUARE_ROOTS'], w: 5, crit: true }),
  G7_LENGTH_CONV: skill('G7_LENGTH_CONV', 'Length Conversions (Advanced)', 7, S.MEA, { pre: ['G6_UNIT_CONVERSIONS'], w: 2 }),
  G7_PERIMETER: skill('G7_PERIMETER', 'Perimeter (Advanced Shapes)', 7, S.MEA, { pre: ['G6_PERIMETER', 'G7_LENGTH_CONV'], w: 3 }),
  G7_CIRCUMFERENCE: skill('G7_CIRCUMFERENCE', 'Circumference of Circles', 7, S.MEA, { pre: ['G7_DECIMALS_MUL', 'G7_PERIMETER'], w: 4, crit: true }),
  G7_AREA_RECT: skill('G7_AREA_RECT', 'Area of Rectangles (Advanced)', 7, S.MEA, { pre: ['G6_AREA_RECT', 'G7_DECIMALS_MUL'], w: 3 }),
  G7_AREA_CIRCLE: skill('G7_AREA_CIRCLE', 'Area of Circles', 7, S.MEA, { pre: ['G7_CIRCUMFERENCE', 'G7_SQUARES_EXT'], w: 4, crit: true }),
  G7_VOLUME_CUBOID: skill('G7_VOLUME_CUBOID', 'Volume of Cuboids (Advanced)', 7, S.MEA, { pre: ['G6_VOLUME_CUBOID', 'G7_AREA_RECT'], w: 3 }),
  G7_VOLUME_CYLINDER: skill('G7_VOLUME_CYLINDER', 'Volume of Cylinders', 7, S.MEA, { pre: ['G7_AREA_CIRCLE', 'G7_VOLUME_CUBOID'], w: 4 }),
  G7_SPEED: skill('G7_SPEED', 'Speed, Distance, Time', 7, S.MEA, { pre: ['G7_LENGTH_CONV', 'G7_DECIMALS_DIV'], w: 5, crit: true }),

  // Statistics
  G7_MEAN_MEDIAN_MODE: skill('G7_MEAN_MEDIAN_MODE', 'Mean, Median, Mode', 7, S.STA, { pre: ['G6_MEAN'], w: 3 }),
  G7_DATA_REPRESENT: skill('G7_DATA_REPRESENT', 'Data Representation (Bar, Line, Pie)', 7, S.STA, { pre: ['G6_PIE_CHARTS', 'G7_PERCENTAGES'], w: 3 }),
};

// ============================================================================
// GRADE 8 — Intermediate (~35 skills)
// ============================================================================

const GRADE_8 = {
  // Numbers
  G8_INDICES_INTRO: skill('G8_INDICES_INTRO', 'Introduction to Indices', 8, S.NUM, { pre: ['G7_SQUARES_EXT', 'G7_INTEGERS_MUL_DIV'], w: 4, crit: true }),
  G8_INDICES_LAWS: skill('G8_INDICES_LAWS', 'Laws of Indices', 8, S.NUM, { pre: ['G8_INDICES_INTRO'], w: 5, crit: true }),
  G8_STANDARD_FORM: skill('G8_STANDARD_FORM', 'Standard Form (Scientific Notation)', 8, S.NUM, { pre: ['G8_INDICES_INTRO', 'G7_DECIMALS_MUL'], w: 4 }),
  G8_CUBES_CUBE_ROOTS: skill('G8_CUBES_CUBE_ROOTS', 'Cubes & Cube Roots', 8, S.NUM, { pre: ['G7_SQUARE_ROOTS', 'G8_INDICES_INTRO'], w: 4 }),
  G8_RATIO_PROPORTION: skill('G8_RATIO_PROPORTION', 'Ratio & Proportion (Advanced)', 8, S.NUM, { pre: ['G6_RATIOS', 'G7_FRACTIONS_DIV'], w: 4 }),
  G8_PERCENTAGE_CHANGE: skill('G8_PERCENTAGE_CHANGE', 'Percentage Increase & Decrease', 8, S.NUM, { pre: ['G7_PERCENTAGES'], w: 4, crit: true }),
  G8_PROFIT_LOSS: skill('G8_PROFIT_LOSS', 'Profit, Loss & Discount', 8, S.NUM, { pre: ['G8_PERCENTAGE_CHANGE'], w: 4 }),
  G8_SIMPLE_INTEREST: skill('G8_SIMPLE_INTEREST', 'Simple Interest', 8, S.NUM, { pre: ['G8_PERCENTAGE_CHANGE'], w: 4 }),
  G8_NUMBER_BASES: skill('G8_NUMBER_BASES', 'Number Bases (Binary, Octal)', 8, S.NUM, { pre: ['G7_PRIME_FACTORIZATION'], w: 5 }),

  // Algebra
  G8_EXPAND_BRACKETS: skill('G8_EXPAND_BRACKETS', 'Expanding Brackets', 8, S.ALG, { pre: ['G7_SIMPLIFY', 'G7_INTEGERS_MUL_DIV'], w: 4, crit: true }),
  G8_FACTORIZE_COMMON: skill('G8_FACTORIZE_COMMON', 'Factorizing (Common Factor)', 8, S.ALG, { pre: ['G8_EXPAND_BRACKETS', 'G7_GCD'], w: 4 }),
  G8_LINEAR_EQ_ADV: skill('G8_LINEAR_EQ_ADV', 'Linear Equations (Advanced)', 8, S.ALG, { pre: ['G7_EQUATIONS_SOLVE', 'G8_EXPAND_BRACKETS'], w: 5, crit: true }),
  G8_SIMULTANEOUS_INTRO: skill('G8_SIMULTANEOUS_INTRO', 'Simultaneous Equations (Introduction)', 8, S.ALG, { pre: ['G8_LINEAR_EQ_ADV'], w: 5, crit: true }),
  G8_INEQUALITIES: skill('G8_INEQUALITIES', 'Solving Inequalities', 8, S.ALG, { pre: ['G7_INEQUALITIES_INTRO', 'G8_LINEAR_EQ_ADV'], w: 4 }),
  G8_SEQUENCES: skill('G8_SEQUENCES', 'Arithmetic Sequences', 8, S.ALG, { pre: ['G6_PATTERNS', 'G7_EXPRESSIONS'], w: 4 }),
  G8_COORDINATES: skill('G8_COORDINATES', 'Coordinate Geometry Basics', 8, S.ALG, { pre: ['G6_INTEGERS_ADD_SUB'], w: 3, crit: true }),
  G8_LINEAR_GRAPHS: skill('G8_LINEAR_GRAPHS', 'Plotting Linear Graphs', 8, S.ALG, { pre: ['G8_COORDINATES', 'G7_EQUATIONS_SOLVE'], w: 4, crit: true }),
  G8_GRADIENT: skill('G8_GRADIENT', 'Gradient of a Line', 8, S.ALG, { pre: ['G8_LINEAR_GRAPHS', 'G7_FRACTIONS_DIV'], w: 4 }),
  G8_EQUATION_OF_LINE: skill('G8_EQUATION_OF_LINE', 'Equation of a Straight Line', 8, S.ALG, { pre: ['G8_GRADIENT', 'G8_LINEAR_EQ_ADV'], w: 5 }),

  // Geometry
  G8_ANGLE_RELATIONSHIPS: skill('G8_ANGLE_RELATIONSHIPS', 'Angle Relationships (Parallel Lines)', 8, S.GEO, { pre: ['G6_ANGLE_PROPERTIES'], w: 4, crit: true }),
  G8_POLYGON_ANGLES: skill('G8_POLYGON_ANGLES', 'Angles in Polygons', 8, S.GEO, { pre: ['G6_TRIANGLE_PROPERTIES', 'G8_ANGLE_RELATIONSHIPS'], w: 4 }),
  G8_CONGRUENCE: skill('G8_CONGRUENCE', 'Congruent Triangles', 8, S.GEO, { pre: ['G6_TRIANGLE_PROPERTIES'], w: 4 }),
  G8_SIMILARITY: skill('G8_SIMILARITY', 'Similar Figures', 8, S.GEO, { pre: ['G8_CONGRUENCE', 'G8_RATIO_PROPORTION'], w: 4, crit: true }),
  G8_TRANSFORMATIONS_INTRO: skill('G8_TRANSFORMATIONS_INTRO', 'Transformations (Reflection, Rotation)', 8, S.GEO, { pre: ['G8_COORDINATES', 'G6_SYMMETRY'], w: 3 }),

  // Measurements
  G8_AREA_COMPOSITE: skill('G8_AREA_COMPOSITE', 'Area of Composite Shapes', 8, S.MEA, { pre: ['G7_AREA_CIRCLE', 'G7_AREA_RECT', 'G6_AREA_TRIANGLE'], w: 4 }),
  G8_SURFACE_AREA: skill('G8_SURFACE_AREA', 'Surface Area (Cuboids, Cylinders)', 8, S.MEA, { pre: ['G7_AREA_CIRCLE', 'G7_AREA_RECT'], w: 4 }),
  G8_VOLUME_ADV: skill('G8_VOLUME_ADV', 'Volume (Prisms, Cylinders)', 8, S.MEA, { pre: ['G7_VOLUME_CYLINDER'], w: 4 }),
  G8_DENSITY: skill('G8_DENSITY', 'Density & Mass', 8, S.MEA, { pre: ['G8_VOLUME_ADV', 'G7_DECIMALS_DIV'], w: 4 }),

  // Statistics
  G8_PROBABILITY_INTRO: skill('G8_PROBABILITY_INTRO', 'Introduction to Probability', 8, S.STA, { pre: ['G6_FRACTIONS_DECIMALS'], w: 3, crit: true }),
  G8_PROBABILITY_COMBINED: skill('G8_PROBABILITY_COMBINED', 'Combined Events & Tree Diagrams', 8, S.STA, { pre: ['G8_PROBABILITY_INTRO', 'G7_FRACTIONS_MUL'], w: 4 }),
  G8_CUMULATIVE_FREQ: skill('G8_CUMULATIVE_FREQ', 'Cumulative Frequency', 8, S.STA, { pre: ['G7_MEAN_MEDIAN_MODE', 'G8_LINEAR_GRAPHS'], w: 4 }),
};

// ============================================================================
// GRADE 9 — Pre-Senior (~30 skills)
// ============================================================================

const GRADE_9 = {
  // Numbers
  G9_SURDS_INTRO: skill('G9_SURDS_INTRO', 'Introduction to Surds', 9, S.NUM, { pre: ['G7_SQUARE_ROOTS', 'G8_INDICES_LAWS'], w: 5, crit: true }),
  G9_SURDS_OPERATIONS: skill('G9_SURDS_OPERATIONS', 'Operations with Surds', 9, S.NUM, { pre: ['G9_SURDS_INTRO'], w: 5 }),
  G9_COMPOUND_INTEREST: skill('G9_COMPOUND_INTEREST', 'Compound Interest', 9, S.NUM, { pre: ['G8_SIMPLE_INTEREST', 'G8_INDICES_INTRO'], w: 5 }),
  G9_COMMERCIAL_ARITH: skill('G9_COMMERCIAL_ARITH', 'Commercial Arithmetic (Tax, Bills)', 9, S.NUM, { pre: ['G8_PERCENTAGE_CHANGE'], w: 4 }),

  // Algebra
  G9_QUADRATIC_EXPAND: skill('G9_QUADRATIC_EXPAND', 'Expanding Double Brackets', 9, S.ALG, { pre: ['G8_EXPAND_BRACKETS'], w: 4, crit: true }),
  G9_QUADRATIC_FACTORIZE: skill('G9_QUADRATIC_FACTORIZE', 'Factorizing Quadratics', 9, S.ALG, { pre: ['G9_QUADRATIC_EXPAND', 'G8_FACTORIZE_COMMON'], w: 5, crit: true }),
  G9_QUADRATIC_SOLVE: skill('G9_QUADRATIC_SOLVE', 'Solving Quadratic Equations', 9, S.ALG, { pre: ['G9_QUADRATIC_FACTORIZE'], w: 5, crit: true }),
  G9_QUADRATIC_FORMULA: skill('G9_QUADRATIC_FORMULA', 'Quadratic Formula', 9, S.ALG, { pre: ['G9_QUADRATIC_SOLVE', 'G9_SURDS_INTRO'], w: 5 }),
  G9_COMPLETING_SQUARE: skill('G9_COMPLETING_SQUARE', 'Completing the Square', 9, S.ALG, { pre: ['G9_QUADRATIC_EXPAND', 'G7_SQUARES_EXT'], w: 6 }),
  G9_SIMULTANEOUS_ADV: skill('G9_SIMULTANEOUS_ADV', 'Simultaneous Equations (Advanced)', 9, S.ALG, { pre: ['G8_SIMULTANEOUS_INTRO', 'G9_QUADRATIC_SOLVE'], w: 5 }),
  G9_VARIATION: skill('G9_VARIATION', 'Direct & Inverse Variation', 9, S.ALG, { pre: ['G8_RATIO_PROPORTION', 'G8_LINEAR_EQ_ADV'], w: 4 }),
  G9_FUNCTIONS_INTRO: skill('G9_FUNCTIONS_INTRO', 'Introduction to Functions', 9, S.ALG, { pre: ['G8_LINEAR_GRAPHS', 'G7_EXPRESSIONS'], w: 4, crit: true }),
  G9_QUADRATIC_GRAPHS: skill('G9_QUADRATIC_GRAPHS', 'Quadratic Graphs', 9, S.ALG, { pre: ['G9_QUADRATIC_SOLVE', 'G8_LINEAR_GRAPHS'], w: 5, crit: true }),

  // Geometry
  G9_CONSTRUCTION: skill('G9_CONSTRUCTION', 'Geometric Constructions', 9, S.GEO, { pre: ['G6_ANGLE_MEASURE', 'G5_LINES'], w: 3 }),
  G9_LOCI: skill('G9_LOCI', 'Loci & Locus', 9, S.GEO, { pre: ['G9_CONSTRUCTION', 'G7_CIRCUMFERENCE'], w: 4 }),
  G9_CIRCLE_THEOREMS_INTRO: skill('G9_CIRCLE_THEOREMS_INTRO', 'Circle Theorems (Introduction)', 9, S.GEO, { pre: ['G6_TRIANGLE_PROPERTIES', 'G7_AREA_CIRCLE'], w: 5, crit: true }),
  G9_TRIG_INTRO: skill('G9_TRIG_INTRO', 'Trigonometry (SOH CAH TOA)', 9, S.GEO, { pre: ['G7_PYTHAGORAS', 'G7_FRACTIONS_DIV'], w: 5, crit: true }),
  G9_TRIG_PROBLEMS: skill('G9_TRIG_PROBLEMS', 'Trigonometry Word Problems', 9, S.GEO, { pre: ['G9_TRIG_INTRO'], w: 5 }),
  G9_BEARINGS: skill('G9_BEARINGS', 'Bearings', 9, S.GEO, { pre: ['G9_TRIG_INTRO', 'G6_ANGLE_MEASURE'], w: 4 }),
  G9_TRANSFORMATIONS_ADV: skill('G9_TRANSFORMATIONS_ADV', 'Transformations (Translation, Enlargement)', 9, S.GEO, { pre: ['G8_TRANSFORMATIONS_INTRO', 'G8_SIMILARITY'], w: 4 }),

  // Measurements
  G9_ARC_LENGTH: skill('G9_ARC_LENGTH', 'Arc Length & Sector Area', 9, S.MEA, { pre: ['G7_CIRCUMFERENCE', 'G7_AREA_CIRCLE', 'G6_FRACTIONS_MUL'], w: 5 }),
  G9_SURFACE_AREA_ADV: skill('G9_SURFACE_AREA_ADV', 'Surface Area (Cones, Spheres)', 9, S.MEA, { pre: ['G8_SURFACE_AREA', 'G9_SURDS_INTRO'], w: 5 }),
  G9_VOLUME_ADV: skill('G9_VOLUME_ADV', 'Volume (Cones, Spheres, Pyramids)', 9, S.MEA, { pre: ['G8_VOLUME_ADV', 'G7_AREA_CIRCLE'], w: 5 }),

  // Statistics
  G9_GROUPED_DATA: skill('G9_GROUPED_DATA', 'Grouped Data & Histograms', 9, S.STA, { pre: ['G8_CUMULATIVE_FREQ', 'G6_AREA_RECT'], w: 4 }),
  G9_PROBABILITY_ADV: skill('G9_PROBABILITY_ADV', 'Probability (With/Without Replacement)', 9, S.STA, { pre: ['G8_PROBABILITY_COMBINED'], w: 4 }),
  G9_SCATTER_PLOTS: skill('G9_SCATTER_PLOTS', 'Scatter Plots & Correlation', 9, S.STA, { pre: ['G8_COORDINATES', 'G7_DATA_REPRESENT'], w: 3 }),
};

// ============================================================================
// GRADE 10 — Senior Foundation (~25 skills)
// ============================================================================

const GRADE_10 = {
  // Numbers
  G10_LOGARITHMS_INTRO: skill('G10_LOGARITHMS_INTRO', 'Introduction to Logarithms', 10, S.NUM, { pre: ['G8_INDICES_LAWS'], w: 6, crit: true }),
  G10_LOG_LAWS: skill('G10_LOG_LAWS', 'Laws of Logarithms', 10, S.NUM, { pre: ['G10_LOGARITHMS_INTRO'], w: 6, crit: true }),
  G10_SURDS_ADV: skill('G10_SURDS_ADV', 'Surds (Rationalizing Denominators)', 10, S.NUM, { pre: ['G9_SURDS_OPERATIONS', 'G9_QUADRATIC_EXPAND'], w: 5 }),

  // Algebra
  G10_POLYNOMIALS: skill('G10_POLYNOMIALS', 'Polynomials & Long Division', 10, S.ALG, { pre: ['G9_QUADRATIC_FACTORIZE', 'G6_FRACTIONS_DIV'], w: 5 }),
  G10_REMAINDER_THEOREM: skill('G10_REMAINDER_THEOREM', 'Remainder & Factor Theorem', 10, S.ALG, { pre: ['G10_POLYNOMIALS'], w: 5 }),
  G10_PARTIAL_FRACTIONS: skill('G10_PARTIAL_FRACTIONS', 'Partial Fractions', 10, S.ALG, { pre: ['G10_POLYNOMIALS', 'G8_SIMULTANEOUS_INTRO'], w: 6 }),
  G10_SEQUENCES_ADV: skill('G10_SEQUENCES_ADV', 'Arithmetic & Geometric Sequences', 10, S.ALG, { pre: ['G8_SEQUENCES', 'G9_FUNCTIONS_INTRO'], w: 5, crit: true }),
  G10_SERIES: skill('G10_SERIES', 'Arithmetic & Geometric Series', 10, S.ALG, { pre: ['G10_SEQUENCES_ADV'], w: 6 }),
  G10_BINOMIAL_THEOREM: skill('G10_BINOMIAL_THEOREM', 'Binomial Expansion', 10, S.ALG, { pre: ['G10_SEQUENCES_ADV', 'G9_QUADRATIC_EXPAND'], w: 6 }),
  G10_FUNCTIONS_ADV: skill('G10_FUNCTIONS_ADV', 'Functions (Composite & Inverse)', 10, S.ALG, { pre: ['G9_FUNCTIONS_INTRO', 'G8_LINEAR_EQ_ADV'], w: 5, crit: true }),
  G10_EXPONENTIAL_GRAPHS: skill('G10_EXPONENTIAL_GRAPHS', 'Exponential & Log Graphs', 10, S.ALG, { pre: ['G10_LOGARITHMS_INTRO', 'G9_QUADRATIC_GRAPHS'], w: 5 }),

  // Geometry
  G10_CIRCLE_THEOREMS_ADV: skill('G10_CIRCLE_THEOREMS_ADV', 'Circle Theorems (Advanced)', 10, S.GEO, { pre: ['G9_CIRCLE_THEOREMS_INTRO', 'G8_ANGLE_RELATIONSHIPS'], w: 6 }),
  G10_TRIG_IDENTITIES: skill('G10_TRIG_IDENTITIES', 'Trigonometric Identities', 10, S.GEO, { pre: ['G9_TRIG_INTRO', 'G9_QUADRATIC_SOLVE'], w: 6, crit: true }),
  G10_TRIG_EQUATIONS: skill('G10_TRIG_EQUATIONS', 'Solving Trigonometric Equations', 10, S.GEO, { pre: ['G10_TRIG_IDENTITIES'], w: 6 }),
  G10_SINE_COSINE_RULE: skill('G10_SINE_COSINE_RULE', 'Sine & Cosine Rule', 10, S.GEO, { pre: ['G9_TRIG_INTRO', 'G9_QUADRATIC_FORMULA'], w: 6, crit: true }),
  G10_3D_TRIG: skill('G10_3D_TRIG', '3D Trigonometry', 10, S.GEO, { pre: ['G10_SINE_COSINE_RULE', 'G7_PYTHAGORAS'], w: 6 }),
  G10_VECTORS_INTRO: skill('G10_VECTORS_INTRO', 'Introduction to Vectors', 10, S.GEO, { pre: ['G8_COORDINATES', 'G7_PYTHAGORAS'], w: 4, crit: true }),
  G10_VECTORS_OPS: skill('G10_VECTORS_OPS', 'Vector Operations', 10, S.GEO, { pre: ['G10_VECTORS_INTRO'], w: 5 }),

  // Statistics
  G10_PERMUTATIONS: skill('G10_PERMUTATIONS', 'Permutations', 10, S.STA, { pre: ['G8_INDICES_INTRO', 'G5_MULTIPLICATION'], w: 5 }),
  G10_COMBINATIONS: skill('G10_COMBINATIONS', 'Combinations', 10, S.STA, { pre: ['G10_PERMUTATIONS'], w: 5 }),
  G10_PROBABILITY_DISTRIBUTIONS: skill('G10_PROBABILITY_DISTRIBUTIONS', 'Probability Distributions', 10, S.STA, { pre: ['G9_PROBABILITY_ADV', 'G10_COMBINATIONS'], w: 5 }),
};

// ============================================================================
// GRADE 11 — Advanced (~20 skills)
// ============================================================================

const GRADE_11 = {
  // Algebra
  G11_MATRICES_INTRO: skill('G11_MATRICES_INTRO', 'Introduction to Matrices', 11, S.ALG, { pre: ['G8_SIMULTANEOUS_INTRO'], w: 5 }),
  G11_MATRICES_OPS: skill('G11_MATRICES_OPS', 'Matrix Operations', 11, S.ALG, { pre: ['G11_MATRICES_INTRO'], w: 5 }),
  G11_MATRICES_INVERSE: skill('G11_MATRICES_INVERSE', 'Inverse Matrices (2×2)', 11, S.ALG, { pre: ['G11_MATRICES_OPS'], w: 6 }),
  G11_LINEAR_PROGRAMMING: skill('G11_LINEAR_PROGRAMMING', 'Linear Programming', 11, S.ALG, { pre: ['G8_INEQUALITIES', 'G8_LINEAR_GRAPHS'], w: 5 }),

  // Calculus
  G11_LIMITS: skill('G11_LIMITS', 'Limits & Continuity', 11, S.ALG, { pre: ['G10_FUNCTIONS_ADV', 'G9_QUADRATIC_GRAPHS'], w: 5, crit: true }),
  G11_DIFF_FIRST_PRINCIPLES: skill('G11_DIFF_FIRST_PRINCIPLES', 'Differentiation from First Principles', 11, S.ALG, { pre: ['G11_LIMITS'], w: 6, crit: true }),
  G11_DIFF_POWER_RULE: skill('G11_DIFF_POWER_RULE', 'Differentiation (Power Rule)', 11, S.ALG, { pre: ['G11_DIFF_FIRST_PRINCIPLES', 'G8_INDICES_LAWS'], w: 5, crit: true }),
  G11_DIFF_CHAIN_RULE: skill('G11_DIFF_CHAIN_RULE', 'Chain Rule', 11, S.ALG, { pre: ['G11_DIFF_POWER_RULE', 'G10_FUNCTIONS_ADV'], w: 6, crit: true }),
  G11_DIFF_PRODUCT_QUOTIENT: skill('G11_DIFF_PRODUCT_QUOTIENT', 'Product & Quotient Rule', 11, S.ALG, { pre: ['G11_DIFF_CHAIN_RULE'], w: 6 }),
  G11_DIFF_APPLICATIONS: skill('G11_DIFF_APPLICATIONS', 'Applications of Differentiation', 11, S.ALG, { pre: ['G11_DIFF_POWER_RULE', 'G9_QUADRATIC_GRAPHS'], w: 6, crit: true }),
  G11_STATIONARY_POINTS: skill('G11_STATIONARY_POINTS', 'Stationary Points & Curve Sketching', 11, S.ALG, { pre: ['G11_DIFF_APPLICATIONS'], w: 6 }),

  // Geometry
  G11_TRIG_GRAPHS: skill('G11_TRIG_GRAPHS', 'Trigonometric Graphs', 11, S.GEO, { pre: ['G10_TRIG_EQUATIONS', 'G9_QUADRATIC_GRAPHS'], w: 5 }),
  G11_TRIG_ADDITION: skill('G11_TRIG_ADDITION', 'Addition Formulae (sin, cos, tan)', 11, S.GEO, { pre: ['G10_TRIG_IDENTITIES'], w: 6 }),
  G11_TRIG_DOUBLE_ANGLE: skill('G11_TRIG_DOUBLE_ANGLE', 'Double Angle Formulae', 11, S.GEO, { pre: ['G11_TRIG_ADDITION'], w: 6 }),
  G11_VECTORS_3D: skill('G11_VECTORS_3D', '3D Vectors', 11, S.GEO, { pre: ['G10_VECTORS_OPS'], w: 5 }),

  // Statistics
  G11_BINOMIAL_DISTRIBUTION: skill('G11_BINOMIAL_DISTRIBUTION', 'Binomial Distribution', 11, S.STA, { pre: ['G10_PROBABILITY_DISTRIBUTIONS', 'G10_BINOMIAL_THEOREM'], w: 6 }),
  G11_NORMAL_DISTRIBUTION: skill('G11_NORMAL_DISTRIBUTION', 'Normal Distribution', 11, S.STA, { pre: ['G11_BINOMIAL_DISTRIBUTION', 'G7_MEAN_MEDIAN_MODE'], w: 6 }),
};

// ============================================================================
// GRADE 12 — University Prep (~20 skills)
// ============================================================================

const GRADE_12 = {
  // Calculus
  G12_INTEGRATION_INTRO: skill('G12_INTEGRATION_INTRO', 'Introduction to Integration', 12, S.ALG, { pre: ['G11_DIFF_POWER_RULE'], w: 6, crit: true }),
  G12_INTEGRATION_POWER: skill('G12_INTEGRATION_POWER', 'Integration (Power Rule)', 12, S.ALG, { pre: ['G12_INTEGRATION_INTRO'], w: 5 }),
  G12_DEFINITE_INTEGRALS: skill('G12_DEFINITE_INTEGRALS', 'Definite Integrals', 12, S.ALG, { pre: ['G12_INTEGRATION_POWER'], w: 6, crit: true }),
  G12_AREA_UNDER_CURVE: skill('G12_AREA_UNDER_CURVE', 'Area Under a Curve', 12, S.ALG, { pre: ['G12_DEFINITE_INTEGRALS', 'G9_QUADRATIC_GRAPHS'], w: 6 }),
  G12_INTEGRATION_BY_PARTS: skill('G12_INTEGRATION_BY_PARTS', 'Integration by Parts', 12, S.ALG, { pre: ['G12_DEFINITE_INTEGRALS', 'G11_DIFF_PRODUCT_QUOTIENT'], w: 7 }),
  G12_INTEGRATION_SUBSTITUTION: skill('G12_INTEGRATION_SUBSTITUTION', 'Integration by Substitution', 12, S.ALG, { pre: ['G12_DEFINITE_INTEGRALS', 'G11_DIFF_CHAIN_RULE'], w: 7 }),
  G12_DIFF_EQ_INTRO: skill('G12_DIFF_EQ_INTRO', 'Differential Equations (Separable)', 12, S.ALG, { pre: ['G12_INTEGRATION_POWER', 'G11_DIFF_POWER_RULE'], w: 7 }),
  G12_FURTHER_DIFF: skill('G12_FURTHER_DIFF', 'Further Differentiation (Trig, Exp, Log)', 12, S.ALG, { pre: ['G11_DIFF_CHAIN_RULE', 'G10_LOGARITHMS_INTRO', 'G10_TRIG_IDENTITIES'], w: 7 }),
  G12_FURTHER_INTEGRATION: skill('G12_FURTHER_INTEGRATION', 'Further Integration (Trig, Partial Fractions)', 12, S.ALG, { pre: ['G12_INTEGRATION_SUBSTITUTION', 'G10_PARTIAL_FRACTIONS', 'G10_TRIG_IDENTITIES'], w: 7 }),

  // Algebra
  G12_PROOF: skill('G12_PROOF', 'Mathematical Proof', 12, S.ALG, { pre: ['G10_SEQUENCES_ADV', 'G8_INDICES_LAWS'], w: 6 }),
  G12_COMPLEX_NUMBERS: skill('G12_COMPLEX_NUMBERS', 'Complex Numbers (Introduction)', 12, S.NUM, { pre: ['G9_QUADRATIC_FORMULA', 'G9_SURDS_OPERATIONS'], w: 7 }),

  // Geometry
  G12_PARAMETRIC_EQ: skill('G12_PARAMETRIC_EQ', 'Parametric Equations', 12, S.GEO, { pre: ['G11_DIFF_CHAIN_RULE', 'G11_TRIG_GRAPHS'], w: 7 }),
  G12_POLAR_COORDS: skill('G12_POLAR_COORDS', 'Polar Coordinates', 12, S.GEO, { pre: ['G12_PARAMETRIC_EQ', 'G9_TRIG_INTRO'], w: 7 }),
  G12_VECTORS_ADV: skill('G12_VECTORS_ADV', 'Vectors (Dot & Cross Product)', 12, S.GEO, { pre: ['G11_VECTORS_3D', 'G10_SINE_COSINE_RULE'], w: 7 }),

  // Statistics
  G12_HYPOTHESIS_TESTING: skill('G12_HYPOTHESIS_TESTING', 'Hypothesis Testing', 12, S.STA, { pre: ['G11_NORMAL_DISTRIBUTION'], w: 6 }),
  G12_CORRELATION_REGRESSION: skill('G12_CORRELATION_REGRESSION', 'Correlation & Regression', 12, S.STA, { pre: ['G9_SCATTER_PLOTS', 'G8_GRADIENT'], w: 6 }),
};

// ============================================================================
// COMBINED SKILLS MAP
// ============================================================================

export const SKILLS = {
  ...GRADE_5,
  ...GRADE_6,
  ...GRADE_7,
  ...GRADE_8,
  ...GRADE_9,
  ...GRADE_10,
  ...GRADE_11,
  ...GRADE_12,
};

export const SKILL_COUNT = Object.keys(SKILLS).length;

export const STRANDS = [S.NUM, S.ALG, S.GEO, S.MEA, S.STA];

export const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];

// Get all skills for a specific grade
export const getSkillsByGrade = (grade) =>
  Object.values(SKILLS).filter(s => s.grade === grade);

// Get all skills for a specific strand
export const getSkillsByStrand = (strand) =>
  Object.values(SKILLS).filter(s => s.strand === strand);

// Get all post-requisites of a skill (skills that depend on it)
export const getPostRequisites = (skillId) =>
  Object.values(SKILLS).filter(s => s.prerequisites.includes(skillId));

// Get the full prerequisite chain (all ancestors)
export const getPrerequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const skill = SKILLS[skillId];
  if (!skill) return [];
  const chain = [...skill.prerequisites];
  for (const pre of skill.prerequisites) {
    chain.push(...getPrerequisiteChain(pre, visited));
  }
  return [...new Set(chain)];
};

// Get the full post-requisite chain (all descendants)
export const getPostRequisiteChain = (skillId, visited = new Set()) => {
  if (visited.has(skillId)) return [];
  visited.add(skillId);
  const posts = getPostRequisites(skillId);
  const chain = posts.map(p => p.id);
  for (const p of posts) {
    chain.push(...getPostRequisiteChain(p.id, visited));
  }
  return [...new Set(chain)];
};

export default SKILLS;
