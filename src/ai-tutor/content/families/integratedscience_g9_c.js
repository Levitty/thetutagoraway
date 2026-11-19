// ============================================================================
// INTEGRATED SCIENCE GRADE 9, THE TWO DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the physical
// properties of pure water, and locating images in curved mirrors with ray diagrams. Drawing the diagram on paper is marked by
// the teacher; the app asks the rules and where the image is. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until an Integrated Science teacher signs them off.
// ============================================================================
import { T } from './integratedscience_g9_lib.js';

const M = (...s) => s.map(x => `M_IS9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('wpp', 'MIXTUR.WATER_HARDNESS.WATER_PROPERTIES', M('WA_BOIL_ANY', 'WA_ICE_HEAVIER', 'WA_PURE_TASTE', 'WA_DISSOLVES_NOTHING'),
    ['Think of a fixed boiling point, what happens when water freezes, and what pure water looks and tastes like.', 'Pure water is colourless, odourless and tasteless, boils at 100 degrees Celsius and freezes at 0 at sea level, expands on freezing so ice floats, and dissolves many substances.'], [
      ['At what temperature does pure water boil at sea level?', '100 degrees Celsius', 'It depends on the pot size|0', 'Any temperature once it bubbles|0', '50 degrees Celsius|0'],
      ['Why does ice float on water?', 'Ice is less dense than water', 'It does not; ice sinks|1', 'Ice is heavier than water|1', 'Ice dissolves nothing|3'],
      ['What does pure water look and taste like?', 'Colourless and tasteless', 'Sweet and slightly blue|2', 'Fresh with a mint taste|2', 'Brown and salty|2'],
      ['Can water dissolve gases?', 'Yes, such as oxygen', 'No, only solids dissolve|3', 'No, only sugar and salt|3', 'Only when it is ice|1'],
      ['At what temperature does pure water freeze at sea level?', '0 degrees Celsius', 'Any cold temperature, it varies|0', '100 degrees Celsius|0', 'It never freezes|1'],
    ], [
      ['Wanjiru heats water in a big sufuria and Kimani in a small pan, both at the coast. Which boils at a lower temperature?', 'Neither; both boil at 100 degrees', 'The small pan|0', 'The big sufuria|0', 'Whichever bubbles first|0'],
      ['Ice cubes float in Achieng\'s glass of water. Her brother says ice should sink because it is solid. What is true?', 'Water expands on freezing, so ice floats', 'He is right, ice should sink|1', 'Ice is heavier than water|1', 'Water dissolves the ice at once|3'],
      ['A water seller says his water is pure because it tastes sweet. What is true?', 'Pure water has no taste', 'Sweet taste shows purity|2', 'Pure water is slightly blue|2', 'Taste has nothing to do with it|3'],
      ['Fish breathe oxygen in a pond. Where does the oxygen come from?', 'Oxygen dissolved in the water', 'Water cannot dissolve gases|3', 'From ice sinking|1', 'From water boiling at any temperature|0'],
      ['Kibet tests a liquid: it boils at 104 degrees at sea level. What does this show?', 'It is not pure water', 'It is pure; boiling varies|0', 'It is ice|1', 'It is pure if it tastes sweet|2'],
    ], [
      ['Musa explains boiling. ' + STEP, 'He heated pure water at sea level.', 'It began to bubble steadily.', 'He said water boils at any temperature as long as it bubbles.', 'Pure water boils at a fixed 100 degrees Celsius at sea level.', 0],
      ['Faith explains ice. ' + STEP, 'Water freezes at 0 degrees Celsius.', 'Ice is a solid.', 'So ice is heavier than water and sinks.', 'Water expands on freezing; ice is less dense and floats.', 1],
      ['Peter explains pure water. ' + STEP, 'Pure water has no smell.', 'It has a density of about 1 g per cm3.', 'It is slightly blue and sweet.', 'Pure water is colourless and tasteless.', 2],
      ['Nekesa explains dissolving. ' + STEP, 'Sugar dissolves in water.', 'Salt dissolves in water.', 'Gases cannot dissolve in water.', 'Water dissolves many substances, including oxygen.', 3],
      ['Daudi explains testing purity. ' + STEP, 'He checked the colour.', 'He measured the boiling point at sea level.', 'It boiled at 102 degrees, so he said it is pure.', 'Pure water boils at 100; a different value shows impurity.', 0],
    ]),

  ...T('rd', 'FORCE_.CURVED_MIRRORS.RAY_DIAGRAMS', M('RD_ONE_RAY', 'RD_PARALLEL_RULE', 'RD_CONVEX_REAL', 'RD_CLOSE_INVERTED'),
    ['Draw two rays from the top of the object and follow each rule.', 'A ray parallel to the axis reflects through F (or away from F for convex); a ray through C comes back on itself; the image is where two rays meet.'], [
      ['How many rays are needed to locate an image?', 'Two', 'One|0', 'Only the one along the axis|0', 'None|0'],
      ['A ray parallel to the axis hits a concave mirror. Where does it go?', 'Through the focus F', 'Back parallel to the axis|1', 'Through the pole only|1', 'Behind the mirror|2'],
      ['Where is the image in a convex mirror?', 'Behind the mirror, virtual', 'In front of the mirror, real|2', 'At C, real and inverted|2', 'At F, real|2'],
      ['An object is between F and a concave mirror. What is the image like?', 'Upright, larger and virtual', 'Inverted and smaller|3', 'Real and in front|2', 'Found with one ray|0'],
      ['A ray goes through the centre of curvature C. How does it reflect?', 'Back along itself', 'Parallel to the axis|1', 'Through F only|1', 'It is not used|0'],
    ], [
      ['Atieno draws one ray and marks the image where it crosses the axis. What should she do?', 'Draw a second ray', 'Keep the one ray|0', 'Reflect it parallel|1', 'Put the image behind a convex mirror|2'],
      ['Kevin draws a ray parallel to the axis bouncing back parallel off a concave mirror. What is wrong?', 'It should pass through F', 'Nothing, parallel stays parallel|1', 'He needs only one ray|0', 'It makes an upright image|3'],
      ['A car\'s side mirror is convex. Wambui says it forms a real image in front of it. What is true?', 'It is virtual, behind it', 'She is right|2', 'It is real at F|2', 'It is inverted and small|3'],
      ['Kioko holds a concave shaving mirror close to his face, inside F. What does he see?', 'An upright, larger image', 'An inverted, smaller image|3', 'A real image in front|2', 'No image without two mirrors|0'],
      ['An object stands beyond C of a concave mirror. Where is the image?', 'Between F and C, inverted', 'Behind the mirror, upright|2', 'At the object, one ray only|0', 'At infinity, parallel rays|1'],
    ], [
      ['Grace explains her ray diagram. ' + STEP, 'She drew the object in front of a concave mirror.', 'She drew a ray from its top parallel to the axis.', 'She marked the image where that one ray crossed the axis.', 'Draw a second ray; the image is where the two rays meet.', 0],
      ['Ochieng explains the parallel ray. ' + STEP, 'The ray leaves the top of the object.', 'It travels parallel to the principal axis.', 'It reflects back parallel to the axis.', 'It reflects through the principal focus F.', 1],
      ['Lucy explains a convex mirror. ' + STEP, 'Convex mirrors curve outwards.', 'Rays spread out after reflection.', 'So the image is real, in front of the mirror.', 'The image is virtual, behind the mirror.', 2],
      ['Hassan explains a close object. ' + STEP, 'The object is between F and the concave mirror.', 'The reflected rays spread out.', 'The image is inverted and smaller.', 'The image is upright, larger and virtual.', 3],
      ['Moraa explains the ray through C. ' + STEP, 'She drew a ray through C.', 'It came back on itself.', 'She used it alone to mark the image.', 'Two rays are needed; the image is where they meet.', 0],
    ]),
];
