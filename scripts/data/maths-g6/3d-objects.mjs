import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'GEOMET.3_D_OBJECTS';
export const packNotes = 'Real objects first: a chalk box (cuboid), a dice (cube), a tin of Kimbo or a piece of pipe (cylinder). The child touches and counts faces, edges and vertices, marking each with chalk so nothing is counted twice or missed; drawings come after.';
export const pre = {
  PLANE_FIGURES_IN_SOLIDS: [['G5:GEOMET.3_D_OBJECTS.NAME_3D_OBJECTS', E, 'Naming the solid comes before naming the shape of its faces.']],
};
export const mis = [
  mi('CUBOID_CUBE_PARTS', 'M_HIDDEN_VERTEX_MISSED', 'Counts only the vertices that can be seen in a drawing.', ['How many vertices has the cube in this drawing?', '7', '8'], 'Counts what the picture shows and forgets the corner at the back.', 'The count of visible vertices as an option.', 'Count on a real box, marking each corner with chalk: 4 on top, 4 at the bottom.'),
  mi('CUBOID_CUBE_PARTS', 'M_WIRE_ONE_OF_EACH', 'Adds one length, one width and one height for the wire of all the edges of a cuboid.', ['A cuboid frame is 5 cm by 3 cm by 2 cm. What length of wire makes all its edges?', '10 cm', '40 cm (4 x 5 + 4 x 3 + 4 x 2)'], 'Counts one edge of each length, not four.', 'The sum of the three lengths as an option.', 'Run a finger along every edge of a box: there are 4 edges of each length.'),
  mi('CYLINDER_PARTS', 'M_CURVED_SURFACE_NOT_COUNTED', 'Counts only the flat faces when asked for all the surfaces of a cylinder.', ['How many surfaces does a cylinder have in all?', '2', '3 (2 flat faces and 1 curved surface)'], 'Thinks only flat parts count as surfaces.', 'Only the flat faces as an option.', 'Wrap paper round a tin: the curved part is a surface too.'),
  mi('CYLINDER_PARTS', 'M_SIDE_LINES_AS_EDGES', 'Counts the two straight side lines of a drawing as edges of the cylinder.', ['How many edges does a cylinder have, and what kind?', '2 straight edges down the sides (from the drawing)', '2 curved edges, one round each end'], 'Reads the outline of the drawing as edges.', 'Straight edges as an option.', 'Run a finger down the side of a tin: there is no edge, it is smooth. The edges are where the flat ends meet the curve.'),
  mi('PLANE_FIGURES_IN_SOLIDS', 'M_CUBOID_ALL_SQUARES', 'Says all the faces of a cuboid are squares.', ['What shape are the faces of a chalk box (a cuboid)?', 'squares', 'rectangles (two of them may be squares)'], 'Mixes up the cube and the cuboid.', 'Squares for a cuboid as an option.', 'Measure the sides of a face: a square has all four sides equal.'),
  mi('PLANE_FIGURES_IN_SOLIDS', 'M_PYRAMID_ALL_TRIANGLES', 'Says all the faces of a square-based pyramid are triangles.', ['What are the faces of a square-based pyramid?', '5 triangles', '4 triangles and 1 square'], 'Remembers a pyramid as "triangles" and forgets the base.', 'All triangles as an option.', 'Stand the pyramid on the table and look at the face it stands on.'),
];
export const pack = {
  CUBOID_CUBE_PARTS: pk({
    key_step: 'The child counts faces, edges and vertices on a real box by marking each one, and says a cube and a cuboid both have 6 faces, 12 edges and 8 vertices.',
    floor: ['Names a cube and a cuboid.', 'What is a dice: a cube or a cylinder?', 'a cube'],
    reps: ['a chalk box marked with chalk', 'a drawing of a cuboid with hidden edges dashed', 'a net of a cube'],
    steps: ['Faces: the flat sides. Count them, marking each.', 'Edges: where two faces meet. There are 4 of each length.', 'Vertices: the corners. 4 on top, 4 at the bottom.', 'In a drawing, count the dashed hidden parts too.'],
    contexts: ['a chalk box', 'a box of exercise books', 'a wire frame for a model house'],
    board: [['draw', 'Draw a cuboid with the hidden edges dashed.'], ['point', 'Point at the top face.', 'How many edges are round the top?'], ['count', 'Count the edges with the child: top, bottom, sides.'], ['pause', 'Wait for 12.'], ['predict', 'Ask how many vertices there are.']],
    mis: {
      M_EDGES_AS_FACES: [['12 faces'], 'Is a face a flat side or a line?', 'Faces are the flat sides: 6.'],
      M_HIDDEN_EDGES_MISSED: [['9 edges'], 'What about the dashed lines at the back?', 'Count the hidden edges too: 12.'],
      M_HIDDEN_VERTEX_MISSED: [['7 corners'], 'Is there a corner at the back you cannot see?', '4 on top and 4 at the bottom: 8.'],
      M_WIRE_ONE_OF_EACH: [['10 cm', 'add the three'], 'How many edges are 5 cm long?', '4 of each length: 4 x (5 + 3 + 2) = 40 cm.'],
    },
    checks: [P('How many faces has a cube?', '6', 'faces'), P('A cuboid frame is 5 cm by 3 cm by 2 cm. What length of wire makes all its edges?', '40 cm', '4 edges of each length')],
  }),
  CYLINDER_PARTS: pk({
    key_step: 'The child says a cylinder has 2 flat circular faces, 1 curved surface and 2 curved edges, and no vertices, by feeling a tin.',
    floor: ['Knows the parts of a cuboid.', 'How many vertices has a cuboid?', '8'],
    reps: ['a tin or a piece of pipe', 'paper wrapped round a tin and unrolled', 'a drawing with the ends as ovals'],
    steps: ['Feel the flat ends: 2 circular faces.', 'Feel the side: 1 curved surface.', 'Feel where the ends meet the side: 2 curved edges.', 'Look for corners: there are none.'],
    contexts: ['a tin of cooking fat', 'a water pipe', 'a drum'],
    board: [['draw', 'Draw a cylinder.'], ['point', 'Point at the side lines of the drawing.', 'If you run a finger down a real tin, is there an edge here?'], ['pause', 'Wait for the child to say no.'], ['point', 'Point at the top circle.', 'Where are the edges?'], ['predict', 'Ask how many vertices a cylinder has.']],
    mis: {
      M_CYLINDER_THREE_FACES_ALL_FLAT: [['3 flat faces'], 'Is the side of a tin flat?', '2 flat faces and 1 curved surface.'],
      M_CYLINDER_HAS_VERTICES: [['2 vertices'], 'Is there a sharp corner anywhere on a tin?', 'A cylinder has no vertices.'],
      M_CURVED_SURFACE_NOT_COUNTED: [['2 surfaces'], 'Is the paper round the tin on a surface?', 'The curved side is a surface: 3 in all.'],
      M_SIDE_LINES_AS_EDGES: [['straight edges'], 'Can you feel an edge down the side of the tin?', 'The edges are the two circles at the ends.'],
    },
    checks: [P('How many flat faces has a cylinder?', '2', 'flat faces'), P('How many vertices has a cylinder?', '0', 'no corners')],
  }),
  PLANE_FIGURES_IN_SOLIDS: pk({
    key_step: 'The child traces round each face of a solid on paper and names the flat shape it makes.',
    floor: ['Names squares, rectangles, triangles and circles.', 'What shape has four equal sides and four right angles?', 'a square'],
    reps: ['faces of real solids traced on paper', 'a table: solid and the shapes of its faces', 'nets of solids'],
    steps: ['Put the solid on paper and trace round one face.', 'Name the flat shape.', 'Do the same for every face.', 'A solid is not a face: name the flat shape.'],
    contexts: ['a dice', 'a chalk box', 'a tin', 'a pyramid-shaped tea packet'],
    board: [['draw', 'Draw the outline of a chalk box face traced on paper.'], ['point', 'Point at the outline.', 'What flat shape is this?'], ['pause', 'Wait for the child to name it.'], ['child_draws', 'Ask the child to trace round the other faces of a box at home.']],
    mis: {
      M_FACE_AS_SOLID: [['cube'], 'Is the trace on the paper flat or solid?', 'A face is a flat shape: a square.'],
      M_CYLINDER_FACE_OVAL: [['oval'], 'Trace round the end of the tin: what shape is it?', 'The flat end of a cylinder is a circle.'],
      M_CUBOID_ALL_SQUARES: [['squares'], 'Are all four sides of the face equal?', 'A cuboid has rectangular faces.'],
      M_PYRAMID_ALL_TRIANGLES: [['5 triangles'], 'What shape is the face it stands on?', '4 triangles and a square base.'],
    },
    checks: [P('What shape is a face of a cube?', 'a square', 'name the plane figure'), P('What are the faces of a square-based pyramid?', '4 triangles and 1 square', 'the base too')],
  }),
};
