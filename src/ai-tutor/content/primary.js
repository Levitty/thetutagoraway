// ============================================================================
// CONTENT ALIASES — skills whose problems come from another skill's builder.
// Grade-banded lower-primary content now lives in lowerPrimary.js (checked
// BEFORE this map via STRUCTURED_CONTENT); what remains here are topics whose
// existing builder is already level-appropriate, plus upper-grade additions.
// ============================================================================
export const PRIMARY_ALIAS = {
  // Grade 1
  // Grade 2
  // Grade 3
  // G3_TIME pointed at G5_TIME, so a Grade 3 learner got Grade 5 durations on
  // a 24-hour clock. The Grade 2 clock/days/months content is the level.
  G3_TIME: 'G2_TIME',
  // Grade 4: FRACTIONS, DECIMALS, TIME, MASS and DATA are now authored in
  // lowerPrimary.js at the Grade 4 bar. They used to alias up to Grade 5/6
  // content (or fall through to a thin legacy generator with no hints, no
  // steps and no misconception feedback).

  // ── Grade 7 sub-strands the graph was missing vs the KICD document ──────────
  // Verified against "Mathematics Grade 7 – July 2024 – Revised" (KICD).
  // Real content today via the closest existing builder; grade-tune later.
  // G5_SIMPLE_EQUATIONS is authored in grade5.js now. The alias to
  // G6_SIMPLE_EQUATIONS served a Grade 5 learner equations like x − 10 = −13.
  // Grade 6 additions from the KICD Grade 6 summary (rationalised design)
  G6_TIME: 'G5_TIME',
  G6_3D_OBJECTS: 'G6_VOLUME_CUBOID',
  // Grade 5 additions from the KICD appendix (volume/capacity/money/3-D).
  // G5_3D_OBJECTS is authored in grade5.js now: it aliased to
  // G6_VOLUME_CUBOID, which asks for the volume of a cuboid — a different
  // skill from naming 3-D objects and counting their faces and edges.
  G5_VOLUME: 'G6_VOLUME_CUBOID',
  G7_MONEY: 'G8_PERCENTAGE_CHANGE',      // profit/loss/discount = % change
  G7_TEMPERATURE: 'G6_INTEGERS_ADD_SUB', // rises/falls on an integer scale
  G7_ANGLES: 'G8_ANGLE_RELATIONSHIPS',   // angles on transversals/parallels
  G7_CONSTRUCTIONS: 'G9_CONSTRUCTION',
  G8_SCALE_DRAWING: 'G8_RATIO_PROPORTION',
  G9_APPROX_ERRORS: 'G8_PERCENTAGE_CHANGE',
  G9_SPEED_VELOCITY: 'G7_SPEED',   // perpendiculars, bisectors
};
