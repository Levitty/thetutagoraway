import { sk, m, pk, assemble, E, H, LIT, TC } from './lib.mjs';
export const key = "GEOMET.SHAPES";
export const notes = "Outcomes a and b are KICD's words; c is attitudinal. Rectangles, triangles and circles in objects (ovals in patterns); patterns of these shapes.";
export const skills = [
  sk("IDENTIFY_SHAPES", "Identify rectangles, triangles and circles in objects from the environment", ["a"], "The child names rectangles, triangles and circles in objects and pictures (a door, a roof, a clock), in any position, by their sides and corners (a triangle has 3 sides and 3 corners; a circle has none).", ["name the shape","which object is a circle","how many sides","pick the shape with 3 corners"], ["recall"], ["G1_SHAPES"], [["PP2:BASIC_SHAPES", E, "Named circles, squares and triangles."], ["G1x:GEOMET.LINES.IDENTIFY_LINES", H, "Tells straight from curved."]]),
  sk("SHAPE_PATTERNS_1", "Make patterns involving rectangles, triangles, circles and ovals", ["b"], "The child copies, continues and makes a repeating pattern of shapes (circle, triangle, circle, triangle) and says which shape comes next.", ["what comes next","what is missing","which part repeats","make a shape pattern"], ["reasoning"], ["G1_SHAPES"], [["G1:IDENTIFY_SHAPES", E, "Names the shapes."], ["G1x:NUMBER.PRE_NUMBER_ACTIVITIES.OBJECT_PATTERNS", E, "Makes patterns with objects."]], "Making and colouring shape patterns is done in class."),
];
const ms = [
  m("IDENTIFY_SHAPES", "M_SHP1_TURNED_TRIANGLE", "Says a triangle on its point is not a triangle.", ["A shape with 3 sides points down. Is it a triangle?", "no", "yes"], "Has only seen triangles on a base.", "Count the sides: any 3-sided shape is a triangle.", "How many sides?", "3: a triangle.", LIT),
  m("IDENTIFY_SHAPES", "M_SHP1_OVAL_CIRCLE", "Calls an oval a circle.", ["An egg shape: circle or not?", "circle", "not a circle (an oval)"], "Calls round shapes circles.", "A circle is the same width every way.", "Is it longer one way?", "Yes: an oval."),
  m("IDENTIFY_SHAPES", "M_SHP1_SIDE_COUNT", "Counts the sides wrongly and names the wrong shape.", ["A shape has 4 sides. Is it a triangle?", "yes", "no, a rectangle or square"], "Miscounts or guesses.", "Touch each side as you count.", "How many sides did you touch?", "4: not a triangle."),
  m("IDENTIFY_SHAPES", "M_SHP1_OBJECT_NAME", "Names the object instead of the shape.", ["What shape is a door?", "door", "rectangle"], "Answers with the object.", "Ask: what shape is it?", "How many sides and corners?", "4: a rectangle."),
  m("SHAPE_PATTERNS_1", "M_SPAT1_REPEATS_LAST", "Repeats the last shape instead of the pattern.", ["circle, triangle, circle, triangle, circle, __", "circle", "triangle"], "Copies the last.", "Say the pattern aloud from the start.", "What comes after circle?", "Triangle."),
  m("SHAPE_PATTERNS_1", "M_SPAT1_ALWAYS_AB", "Treats every pattern as two parts.", ["circle, circle, triangle, circle, circle, __", "circle", "triangle"], "Uses the AB habit.", "Ring the part that repeats.", "How many circles before each triangle?", "Two: triangle."),
  m("SHAPE_PATTERNS_1", "M_SPAT1_COLOUR", "Follows the colour and ignores the shape.", ["red circle, blue triangle, red circle, blue __", "circle", "triangle"], "Looks at colour only.", "Say the shape names aloud.", "What shape is blue?", "Triangle."),
  m("SHAPE_PATTERNS_1", "M_SPAT1_MISSING", "Fills a gap with the shape after the gap.", ["triangle, __, triangle, circle, triangle, circle", "triangle", "circle"], "Copies a neighbour.", "Say the pattern from the start.", "What comes after a triangle?", "A circle."),
];
const pack = {
  IDENTIFY_SHAPES: pk("The child counts the sides and corners to name the shape, whichever way it is turned.", ["Named basic shapes (PP2).", "What shape is a ball's outline?", "a circle"], ["cut-outs", "objects in the class", "pictures turned different ways"], ["Count the sides.", "Count the corners.", "Straight or round?", "Name it."], ["a door", "a roof", "a clock"], [["draw", "Draw a triangle on its point."], ["point", "Point at each side.", "How many?"], ["pause", "Wait for 3."], ["reveal", "Write: triangle."]], [["A shape with no corners and no straight sides: what is it?", "a circle", "circle"], ["A window has 4 sides. Triangle or rectangle?", "rectangle", "rectangle"]]),
  SHAPE_PATTERNS_1: pk("The child says the shapes aloud, rings the part that repeats, and continues it.", ["Makes patterns with objects.", "red, blue, red, __", "blue"], ["shape cut-outs", "a drawn row", "fabric"], ["Say it aloud.", "Find the repeat.", "Ring it.", "Say what comes next."], ["kitenge cloth", "beadwork", "a painted wall"], [["draw", "Draw circle, circle, triangle, circle, circle, __."], ["child_draws", "The child rings each repeat."], ["pause", "Wait for the next shape."], ["reveal", "Draw a triangle."]], [["triangle, circle, triangle, circle, __", "triangle", "AB"], ["circle, circle, rectangle, circle, circle, __", "rectangle", "AAB"]]),
};
export const { mis, pack: packOut } = assemble(ms, pack);
export { packOut as pack };
export const links = {
  'g1.shapes.which-shape': ["IDENTIFY_SHAPES", "a", null, null, null, ["M_SHP1_SIDE_COUNT", "M_SHP1_TURNED_TRIANGLE"]],
};
