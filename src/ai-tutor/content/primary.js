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
  G3_TIME: 'G5_TIME',
  // Grade 4
  G4_FRACTIONS: 'G5_FRACTIONS_EQUIV',
  G4_DECIMALS: 'G5_DECIMALS_INTRO',     // structured decimal grid
  G4_TIME: 'G5_TIME',
  G4_MASS: 'G5_MASS',
  G4_DATA: 'G5_BAR_GRAPHS',

  // ── Grade 7 sub-strands the graph was missing vs the KICD document ──────────
  // Verified against "Mathematics Grade 7 – July 2024 – Revised" (KICD).
  // Real content today via the closest existing builder; grade-tune later.
  G5_SIMPLE_EQUATIONS: 'G6_SIMPLE_EQUATIONS', // tier-1 linear equation builder
  // Grade 6 additions from the KICD Grade 6 summary (rationalised design)
  G6_CAPACITY: 'G5_MASS',
  G6_MASS: 'G5_MASS',
  G6_TIME: 'G5_TIME',
  G6_LINES: 'G5_TRIANGLES_INTRO',
  G6_3D_OBJECTS: 'G6_VOLUME_CUBOID',
  // Grade 5 additions from the KICD appendix (volume/capacity/money/3-D)
  G5_VOLUME: 'G6_VOLUME_CUBOID',
  G5_CAPACITY: 'G5_MASS',
  G5_3D_OBJECTS: 'G6_VOLUME_CUBOID',
  G7_MONEY: 'G8_PERCENTAGE_CHANGE',      // profit/loss/discount = % change
  G7_TEMPERATURE: 'G6_INTEGERS_ADD_SUB', // rises/falls on an integer scale
  G7_ANGLES: 'G8_ANGLE_RELATIONSHIPS',   // angles on transversals/parallels
  G7_CONSTRUCTIONS: 'G9_CONSTRUCTION',
  G8_SCALE_DRAWING: 'G8_RATIO_PROPORTION',
  G9_APPROX_ERRORS: 'G8_PERCENTAGE_CHANGE',
  G9_SPEED_VELOCITY: 'G7_SPEED',   // perpendiculars, bisectors
};
