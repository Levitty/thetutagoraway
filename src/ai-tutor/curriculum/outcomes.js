// ============================================================================
// CBC OUTCOMES: the one list every skill and question family is tagged to.
//
// Source for Grades 4 to 9: the official KICD designs in docs/curriculum-sources
// (Revised 2024), read directly. KICD has no outcome codes, so an id here is our
// own: G<grade>.<SUBSTRAND>.<letter>, where the letter is the design's own
// letter for that specific learning outcome. The text is condensed from the
// design, not copied word for word. Attitude outcomes ("appreciate", "promote
// use of") and "use IT devices" are left out: no question can test them.
//
// `code` is the shared sub-strand term from Tuta's migration 215
// (MATH.G7.MEASUR.TEMPERATURE). Migration 215 calls its list "starter" and in
// places differs from the KICD design; the design wins here, and
// tests/fixtures/migration215-substrand-codes.json records which of our codes
// that list does not have yet (printed in the review pack, BEFORE-AFTER.md).
//
// `signal` is how the quality gate decides a draw teaches this outcome: a
// pattern over what the child reads. It is a blunt tool on purpose. It catches
// "10 + 1" under Temperature; it cannot judge whether a question is good.
// `hands` marks outcomes a typed or tapped answer cannot truly test (draw,
// construct, collect): those stay with paper and the teacher.
//
// NOT VERIFIED AGAINST A DESIGN (status 'unverified' below):
//  - Grade 1: no design could be read (the KICD link returned 404). Sub-strands
//    are from migration 215's starter list.
//  - Grades 2 and 3: designs read at sub-strand level only.
//  - Grades 10 to 12: no design could be read. See UNVERIFIED_SENIOR.
// ============================================================================

const SHORT = { Numbers: 'NUMBER', Algebra: 'ALGEBR', Measurement: 'MEASUR', Measurements: 'MEASUR', Geometry: 'GEOMET', 'Data Handling': 'DATA_H', 'Data Handling and Probability': 'DATA_H' };
// The same rule as Tuta's tools/curriculum-seed.php, so the codes line up.
export const substrandCode = (grade, strand, name) =>
  `MATH.G${grade}.${SHORT[strand]}.${name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 24)}`;

const SUBSTRANDS = [];
const sub = (grade, strand, name, key, outcomes, status = 'read') => {
  SUBSTRANDS.push({ grade, strand, name, key, status, code: substrandCode(grade, strand, name), outcomes });
};
// [letter, text, signal, 'hands'?]
const N = 'Numbers', A = 'Algebra', M = 'Measurement', MS = 'Measurements', G = 'Geometry', D = 'Data Handling', DP = 'Data Handling and Probability';

// ---------------------------------------------------------------- Grade 4
sub(4, N, 'Whole numbers', 'WHOLE', [
  ['a', 'Place value and total value up to thousands', /place value|total value|thousands|hundreds|value of the digit/i],
  ['b', 'Read and write numbers to 10,000 in symbols', /in (figures|symbols)|write .*number|as a number/i],
  ['c', 'Read and write numbers to 1,000 in words', /in words|words/i],
  ['d', 'Order numbers to 1,000', /order|smallest|largest|biggest|greatest|ascending|descending|which is (more|less)/i],
  ['e', 'Round off to the nearest ten', /round|nearest/i],
  ['f', 'Factors of numbers to 50', /factor/i],
  ['g', 'Multiples of numbers to 100', /multiple/i],
  ['h', 'Even and odd numbers', /even|odd|what comes next/i],
  ['i', 'Patterns with even and odd numbers', /(even|odd).*(pattern|next|sequence)|pattern.*(even|odd)/i],
  ['j', 'Roman numerals to X', /[Rr]oman|\b[IVX]{1,4}\b/],
]);
sub(4, N, 'Addition', 'ADD', [
  ['a', 'Add to a sum of 10,000 with regrouping', /\d\s*\+\s*\d|add|sum|total|altogether|together|gives|have now|more/i],
  ['c', 'Estimate a sum by rounding to the nearest ten', /estimate|about how/i],
  ['d', 'Addition patterns', /pattern|next number|sequence/i],
]);
sub(4, N, 'Subtraction', 'SUB', [
  ['a', 'Subtract 4-digit numbers with regrouping', /\d\s*[−-]\s*\d|subtract|difference|how many (are )?(left|more)|left|take away|less than/i],
  ['c', 'Estimate a difference by rounding', /estimate|about how/i],
  ['d', 'Subtraction patterns', /pattern|next number|sequence/i],
]);
sub(4, N, 'Multiplication', 'MUL', [
  ['a', 'Multiply by a two-digit or one-digit number', /×|multipl|times|product|each|rows of|altogether/i],
  ['c', 'Estimate a product by rounding', /estimate|about how/i],
  ['d', 'Multiplication patterns', /pattern|next number|sequence/i],
]);
sub(4, N, 'Division', 'DIV', [
  ['a', 'Divide by a one-digit number', /÷|divide|share|each|how many .*(groups|bags|packets|in each)/i],
  ['b', 'Relate multiplication and division', /(×.*÷|÷.*×)|related|check .*(multiply|division)|inverse/i],
]);
sub(4, N, 'Fractions', 'FRAC', [
  ['a', 'Numerator and denominator', /numerator|denominator/i],
  ['b', 'A fraction as part of a whole and of a group, denominators to 12', /fraction|\d\/\d|shaded|of the/i],
  ['c', 'Types of fractions: proper, improper, mixed', /proper|improper|mixed/i],
  ['d', 'Improper to mixed fractions', /improper.*mixed|as a mixed/i],
  ['e', 'Mixed to improper fractions', /mixed.*improper|as an improper/i],
]);
sub(4, N, 'Decimals', 'DEC', [
  ['a', 'Tenths and hundredths', /tenth|hundredth|decimal/i],
  ['c', 'Place value of decimals to hundredths', /place value|tenths?|hundredths?/i],
  ['d', 'Order decimals to hundredths', /order|smallest|largest|bigger|greater|compare|<|>/i],
]);
sub(4, A, 'Use of letters', 'LETTERS', [
  ['a', 'Represent information with letters', /\b[a-z]\b.*(stands for|represents?|number)|letter/i],
  ['b', 'Form simple expressions from real life', /expression|(has|have|are) [a-z] /i],
  ['c', 'Simplify expressions', /simplify|\d?[a-z] [+−-] \d?[a-z]/i],
]);
sub(4, M, 'Length', 'LENGTH', [
  ['a', 'Measure in centimetres; metres and centimetres', /\bcm\b|centimetre/i],
  ['d', 'Convert metres and centimetres', /\bm\b.*\bcm\b|\bcm\b.*\bm\b|metres?.*centimetre|centimetre.*metre|km|kilomet/i],
  ['e', 'Perimeter of plane figures', /perimeter|around|fence|edging|border/i],
  ['f', 'Add, subtract, multiply and divide metres and centimetres', /\b(m|cm|km|metres?)\b/i],
]);
sub(4, M, 'Area', 'AREA', [
  ['b', 'Area of squares and rectangles by counting unit squares', /area|unit squares?|squares? (cover|fit)/i],
  ['c', 'Area as rows times columns', /area|rows|perimeter/i],
]);
sub(4, M, 'Volume', 'VOL', [
  ['a', 'Stacks of cubes and cuboids', /stack|pile|cubes?|layers?|blocks?/i],
  ['b', 'Volume of a cuboid by piling blocks', /volume|cub/i],
]);
sub(4, M, 'Capacity', 'CAP', [
  ['a', 'Measure capacity in litres', /litres?|capacity|container/i],
  ['c', 'Add and subtract litres', /litres?|\bml\b/i],
]);
sub(4, M, 'Mass', 'MASS', [
  ['a', 'Measure with kilogram, half and quarter kilogram masses', /\bkg\b|kilogram|\bgrams?\b|\bg\b|mass/i],
  ['c', 'Add and subtract kilograms', /\bkg\b|kilogram|\bg\b/i],
]);
sub(4, M, 'Time', 'TIME', [
  ['a', 'Read and tell time in a.m. and p.m.', /a\.?m\.?|p\.?m\.?|o.clock|past|clock|time/i],
  ['c', 'Convert units of time', /minutes?|hours?|days?|weeks?/i],
  ['e', 'Time durations', /how long|duration|minutes?|hours?|start|finish|end/i],
]);
sub(4, M, 'Money', 'MONEY', [
  ['a', 'Shillings to cents and cents to shillings', /\bcents?\b/i],
  ['b', 'Prepare a shopping list of three items', /shopping list|list|buys?/i],
  ['c', 'Total cost of a shopping list up to sh 10,000', /total|cost|altogether|spend|change|sh\b|shillings?/i],
]);
sub(4, G, 'Position and direction', 'POSITION', [
  ['a', 'Clockwise and anticlockwise turns', /clockwise|anti|turn/i],
  ['c', 'Quarter, half and three-quarter turns', /quarter|half|turn|facing|north|south|east|west/i],
]);
sub(4, G, 'Angles', 'ANGLES', [
  ['a', 'Identify and relate angles to turns', /angle|turn|acute|right|obtuse|corner/i],
]);
sub(4, G, 'Plane figures', 'PLANE', [
  ['a', 'Identify rectangles, squares, triangles, circles, ovals', /rectangle|square|triangle|circle|oval|shape|sides?/i],
  ['c', 'Lines of symmetry', /symmetr|fold/i],
  ['b', 'Draw shapes and make patterns', /draw|pattern/i, 'hands'],
  ['e', 'Properties of plane figures', /sides?|corners?|equal|propert/i],
]);
sub(4, D, 'Data', 'DATA', [
  ['b', 'Collect and record data in a table', /collect|record|survey/i, 'hands'],
  ['e', 'Interpret data from a table', /table|graph|chart|how many|most|least|data|tally|learners/i],
]);

// ---------------------------------------------------------------- Grade 5
sub(5, N, 'Whole numbers', 'WHOLE', [
  ['a', 'Place value to tens of thousands', /place value|total value|value of the|which place|digit|thousands/i],
  ['b', 'Read and write numbers to tens of thousands in words', /in words|words|in figures/i],
  ['c', 'Order numbers to tens of thousands', /order|smallest|largest|biggest|ascending|descending/i],
  ['d', 'Round to the nearest hundred and thousand', /round|nearest/i],
  ['e', 'Divisibility tests of 2, 5 and 10', /divisib|divide exactly|exactly by/i],
  ['f', 'Highest common factor', /HCF|highest common|greatest common|GCD|factor/i],
  ['g', 'Least common multiple', /LCM|lowest common|least common|multiple|same day|together again/i],
]);
sub(5, N, 'Addition', 'ADD', [
  ['a', 'Add up to 6-digit numbers with regrouping', /\d\s*\+\s*\d|add|sum|total|altogether|together|odd number plus|how many/i],
  ['c', 'Estimate a sum by rounding', /estimate|about how/i],
  ['d', 'Create patterns with addition', /pattern|next|sequence|rule/i],
]);
sub(5, N, 'Subtraction', 'SUB', [
  ['a', 'Subtract up to 6-digit numbers', /\d\s*[−-]\s*\d|subtract|difference|left|more|fewer|less/i],
  ['c', 'Estimate a difference by rounding', /estimate|about how/i],
  ['d', 'Combined addition and subtraction', /\+.*[−-]|[−-].*\+|then .*(gives|sells|buys|adds|more)|and then/i],
  ['e', 'Patterns with subtraction', /pattern|next|sequence/i],
]);
sub(5, N, 'Multiplication', 'MUL', [
  ['a', 'Multiply a 3-digit by a 2-digit number', /×|multipl|times|product|each/i],
  ['b', 'Estimate a product by rounding', /estimate|about how/i],
  ['c', 'Patterns with multiplication', /pattern|next|sequence/i],
]);
sub(5, N, 'Division', 'DIV', [
  ['a', 'Divide a 3-digit by a 2-digit number', /÷|divide|share|each|BODMAS|order of operations/i],
  ['b', 'Relate multiplication and division', /×.*÷|÷.*×|inverse|check/i],
  ['d', 'Estimate a quotient by rounding', /estimate|about how/i],
  ['e', 'Combined operations', /BODMAS|order of operations|\d\s*[+−×÷-]\s*\d\s*[+−×÷-]\s*\d/i],
]);
sub(5, N, 'Fractions', 'FRAC', [
  ['a', 'Simplify fractions', /simplif|simplest|equivalent|lowest terms/i],
  ['b', 'Compare and order fractions', /compare|order|bigger|larger|smaller|greater|<|>/i],
  ['d', 'Add and subtract fractions', /\d\/\d|fraction|half|quarter|third/i],
]);
sub(5, N, 'Decimals', 'DEC', [
  ['a', 'Place value of decimals to thousandths', /place value|tenths?|hundredths?|thousandths?/i],
  ['b', 'Order decimals', /order|smallest|largest|bigger|compare|<|>/i],
  ['c', 'Add and subtract decimals', /\d\.\d/],
  ['e', 'Multiply decimals by 10, 100, 1000', /×\s*(10|100|1,?000)\b|times (10|100|1,?000)\b|(10|100|1,?000) .*(packets|tins|bottles|items|boxes|tiles)/i],
]);
sub(5, A, 'Simple equations', 'EQUATIONS', [
  ['a', 'Form simple equations from real life', /(write|form|which) .*equation|equation for|let [a-z]/i],
  ['b', 'Solve simple equations', /solve|equation|find [a-z]|missing|\b[a-z] [+−-] \d|\d[a-z]\b|□|\?/i],
]);
sub(5, M, 'Length', 'LENGTH', [
  ['b', 'Estimate distance in kilometres', /estimate|about how|roughly/i],
  ['c', 'Kilometres and metres', /\bkm\b|kilomet|\bm\b|metres?|\bcm\b/i],
  ['e', 'Add, subtract, multiply and divide km and m', /\bkm\b|kilomet|\bm\b|metres?/i],
]);
sub(5, M, 'Area', 'AREA', [['b', 'Area in square units; rectangles, squares, triangles', /area|square|cm²|m²/i]]);
sub(5, M, 'Volume', 'VOL', [['c', 'Volume of cubes and cuboids in cubic units', /volume|cubic|cm³|m³|cub/i]]);
sub(5, M, 'Capacity', 'CAP', [['d', 'Litres and millilitres, all four operations', /litres?|\bml\b|millilitre|capacity|\bl\b/i]]);
sub(5, M, 'Mass', 'MASS', [['d', 'Kilograms and grams, all four operations', /\bkg\b|\bg\b|grams?|grammes?|kilogram|mass/i]]);
sub(5, M, 'Time', 'TIME', [['d', 'Minutes and seconds, all four operations; durations', /seconds?|minutes?|hours?|time|o.clock|duration|how long/i]]);
sub(5, M, 'Money', 'MONEY', [
  ['a', 'What a budget is and why it matters', /budget/i],
  ['c', 'Prepare a budget of up to 5 items', /budget/i],
  ['d', 'What tax is and why it is paid', /\btax/i],
  ['e', 'Services banks provide', /\bbank|saving|savings|account|deposit/i],
  ['f', 'Factors to consider when saving', /sav(e|ing)|\bbank|sacco/i],
]);
sub(5, G, 'Lines', 'LINES', [
  ['a', 'Identify horizontal, vertical, perpendicular and parallel lines', /parallel|perpendicular|horizontal|vertical|lines?/i],
  ['b', 'Draw lines', /draw/i, 'hands'],
]);
sub(5, G, 'Angles', 'ANGLES', [
  ['a', 'Relate turns to angles; types of angles', /angle|acute|obtuse|reflex|right|turn|degrees?|°/i],
  ['c', 'Measure angles with a protractor', /protractor/i, 'hands'],
]);
sub(5, G, 'Three dimension objects', '3D', [
  ['a', 'Describe 3-D objects and 2-D shapes', /cube|cuboid|cylinder|cone|sphere|pyramid|faces?|edges?|vertices|3-D|shape/i],
]);
sub(5, D, 'Data representation', 'DATA', [
  ['c', 'Tally marks and frequency tables', /tally|frequency|table/i],
  ['e', 'Interpret tally and frequency tables', /tally|table|frequency|how many|most|least|chart/i],
  ['a', 'Collect data', /collect|survey/i, 'hands'],
]);

// ---------------------------------------------------------------- Grade 6
sub(6, N, 'Whole numbers', 'WHOLE', [
  ['a', 'Place value to millions', /place value|total value|value of the|digit|million/i],
  ['b', 'Numbers up to millions in symbols', /million|thousand|in (figures|symbols)|\d{1,3},\d{3}/i],
  ['d', 'Order numbers up to 100,000', /order|smallest|largest|<|ascending|descending/i],
  ['c', 'Read and write numbers in words', /in words|words|in figures/i],
  ['e', 'Round off', /round|nearest/i],
  ['f', 'Squares of whole numbers', /square|²|\^2/i],
  ['g', 'Square roots of perfect squares to 10,000', /square root|√/i],
]);
sub(6, N, 'Multiplication', 'MUL', [
  ['a', 'Multiply a 4-digit by a 2-digit number', /×|multipl|times|product|each|pattern|sequence/i],
  ['b', 'Estimate a product', /estimate|about how/i],
  ['c', 'Patterns with multiplication', /pattern|next|sequence/i],
]);
sub(6, N, 'Division', 'DIV', [
  ['a', 'Divide a 4-digit by a 2-digit number', /÷|divide|share|each/i],
  ['b', 'Estimate a quotient', /estimate|about how/i],
  ['c', 'Combined operations', /\d\s*[+−×÷-]\s*\d\s*[+−×÷-]\s*\d|BODMAS/i],
]);
sub(6, N, 'Fractions', 'FRAC', [
  ['b', 'Subtract fractions using LCM', /\d\/\d|fraction/i],
  ['d', 'Subtract mixed numbers', /\d+ \d+\/\d+|mixed/i],
  ['h', 'Percentage to fraction', /per ?cent|%/i],
  ['a', 'Add and subtract fractions', /\d\/\d|fraction/i],
  ['c', 'Add and subtract mixed numbers', /\d \d\/\d|mixed/i],
  ['e', 'Reciprocals of fractions', /reciprocal/i],
  ['f', 'Squares of fractions', /square|²/i],
  ['g', 'A fraction as a percentage, and a percentage as a fraction', /per ?cent|%/i],
]);
sub(6, N, 'Decimals', 'DEC', [
  ['a', 'Decimals up to ten-thousandths', /decimal|tenths|thousandths|\d\.\d/i],
  ['d', 'Decimals and percentages', /per ?cent|%|decimal/i],
  ['f', 'Subtract decimals to 4 places', /\d\.\d{2,4}|subtract|left|cut/i],
  ['b', 'Round decimals to 3 places', /round|decimal place|nearest/i],
  ['c', 'Decimals to fractions and percentages', /\d\.\d.*(fraction|%|per ?cent)|(fraction|%|per ?cent).*\d\.\d|decimal/i],
  ['e', 'Add and subtract to 4 decimal places', /\d\.\d/],
]);
sub(6, N, 'Inequalities', 'INEQ', [
  ['b', 'Simplify inequalities in one unknown', /[≤≥<>]|inequalit/i],
  ['a', 'Form simple inequalities in one unknown', /inequality|at least|at most|more than|less than|≤|≥/i],
  ['c', 'Simplify and solve simple inequalities', /solve|[a-z]\s*[<>≤≥]|[<>≤≥]\s*\d/i],
]);
sub(6, M, 'Length', 'LENGTH', [
  ['a', 'Millimetres and centimetres', /\bmm\b|millimet|\bcm\b/i],
  ['b', 'Millimetres and centimetres: the relationship', /\bmm\b|millimet|\bcm\b/i],
  ['c', 'Convert cm and mm to mm', /\bmm\b|millimet|\bcm\b/i],
  ['e', 'Subtract cm and mm', /\bmm\b|millimet|\bcm\b/i],
  ['f', 'Multiply cm and mm by whole numbers', /\bmm\b|millimet|\bcm\b/i],
  ['g', 'Divide cm and mm by whole numbers', /\bmm\b|millimet|\bcm\b/i],
  ['i', 'Circumference and diameter', /circumference|diameter|round|edge/i],
  ['d', 'Operations on cm and mm; unit conversions', /\bmm\b|\bcm\b|\bm\b|\bkm\b|convert|change/i],
  ['h', 'Circumference and its link to diameter', /circumference|diameter|around .*(circle|round)/i],
]);
sub(6, M, 'Area', 'AREA', [
  ['a', 'Area of a triangle', /triangle|area/i],
  ['b', 'Area of combined shapes', /combined|composite|L-shaped|shape made|area/i],
  ['c', 'Area of a circle by counting squares', /circle.*squares?|counting squares|squares?.*circle/i],
]);
sub(6, M, 'Capacity', 'CAP', [
  ['a', 'Litres, millilitres and cm³', /litres?|\bml\b|cm³|capacity/i],
  ['b', 'Convert litres to millilitres', /litres?|\bml\b|millilitres?/i],
  ['c', 'Convert millilitres to litres', /litres?|\bml\b|millilitres?/i],
]);
sub(6, M, 'Mass', 'MASS', [
  ['a', 'The tonne as a unit; items measured in tonnes', /tonnes?|lorry|truck/i],
  ['b', 'Items measured in tonnes', /tonnes?/i],
  ['c', 'The kilogram and the tonne', /tonnes?|\bkg\b/i],
  ['d', 'Estimate mass in tonnes', /tonnes?|\bkg\b/i],
  ['f', 'Add tonnes and kilograms', /tonnes?|\bkg\b/i],
  ['g', 'Subtract tonnes and kilograms', /tonnes?|\bkg\b/i],
  ['h', 'Multiply tonnes and kilograms', /tonnes?|\bkg\b/i],
  ['i', 'Divide tonnes and kilograms', /tonnes?|\bkg\b/i],
  ['e', 'Kilograms and tonnes, all four operations', /tonnes?|\bkg\b/i],
]);
sub(6, M, 'Time', 'TIME', [
  ['a', 'Time in a.m. and p.m.', /a\.?m\.?|p\.?m\.?/i],
  ['b', 'Write time in a.m. and p.m.', /a\.?m\.?|p\.?m\.?/i],
  ['d', 'Convert between 12-hour and 24-hour time', /24|a\.?m\.?|p\.?m\.?|hours?|\d{2}:\d{2}/i],
  ['c', 'a.m. and p.m., and the 24-hour clock', /24|a\.?m\.?|p\.?m\.?|hours?|\d{2}:?\d{2}/i],
  ['e', 'Travel timetables', /timetable|departs?|arrives?|leaves|bus|train|matatu|journey/i],
]);
sub(6, M, 'Money', 'MONEY', [
  ['b', 'Buying and selling prices', /buy|buys|bought|sell|sells|sold|price|profit/i],
  ['d', 'Loss from sales', /loss|lose|lost|bought|buys|sold|sells/i],
  ['a', 'Prepare a simple budget', /budget/i],
  ['c', 'Profit and loss', /profit|loss|buying price|selling price|sells?/i],
  ['e', 'Types of taxes', /\btax|VAT|duty|PAYE/i],
]);
sub(6, G, 'Lines', 'LINES', [
  ['a', 'Parallel and perpendicular lines', /parallel|perpendicular|lines?/i],
  ['b', 'Bisect lines, construct perpendiculars by hand', /bisect|construct/i, 'hands'],
]);
sub(6, G, 'Angles', 'ANGLES', [
  ['c', 'Angles on a straight line sum to 180°', /straight|angle|°/i],
  ['a', 'Angles on a straight line and at a point', /straight line|at a point|angles?|°/i],
  ['b', 'Measure angles with a protractor', /protractor|measure|degrees?|°/i],
  ['d', 'Angle sum of rectangles and triangles', /triangle|rectangle|sum|°/i],
  ['e', 'Construct triangles', /construct/i, 'hands'],
]);
sub(6, G, '3-D objects', '3D', [
  ['a', 'Vertices, faces and edges of solids; plane figures in 3-D', /vertices|faces?|edges?|net|cube|cuboid|cylinder|cone|pyramid|prism/i],
  ['b', 'Faces and edges of cylinders', /cylinder|faces?|edges?|corners?/i],
  ['c', 'Plane figures in 3-D objects', /faces?|plane|circle|square|triangle|rectangle|solid/i],
]);
sub(6, D, 'Bar graphs', 'DATA', [
  ['a', 'Frequency tables', /frequency|tally|table/i],
  ['c', 'Pictographs and bar graphs from data', /graph|pictograph|chart|bar|how many|most|least|table|survey|data/i],
  ['b', 'Pictographs from data', /pictograph|symbol/i],
  ['d', 'Bar graphs from data', /bar graph|squares?|bars?|table/i],
  ['e', 'Interpret bar graphs', /bar graph|bar/i],
]);

// ---------------------------------------------------------------- Grade 7
sub(7, N, 'Whole numbers', 'WHOLE', [
  ['a', 'Place value and total value', /place value|total value|value of the digit|which place/i],
  ['b', 'Read and write numbers in symbols to hundreds of millions', /in (figures|symbols)|million/i],
  ['c', 'Read and write numbers in words to millions', /in words|words/i],
  ['d', 'Round off to the nearest hundred million', /round|nearest/i],
  ['e', 'Classify numbers: even, odd, prime', /even|odd|prime/i],
  ['f', 'Operations on whole numbers in real life', /\d\s*[+−×÷-]\s*\d|BODMAS|order of operations|total|each|share/i],
  ['g', 'Identify number sequences', /sequence|next|pattern|term/i],
  ['h', 'Create number sequences', /(create|write|make) .*sequence|rule/i],
]);
sub(7, N, 'Factors', 'FACTORS', [
  ['a', 'Divisibility tests to 11', /divisib|divide exactly|exactly by/i],
  ['b', 'Composite numbers as products of prime factors', /prime|composite|factor/i],
  ['c', 'Greatest common divisor', /GCD|greatest common|HCF|highest common/i],
  ['d', 'Least common multiple', /LCM|least common|lowest common|same time|together again|same day/i],
]);
sub(7, N, 'Fractions', 'FRAC', [
  ['a', 'Compare fractions', /compare|order|bigger|larger|smaller|greater|<|>/i],
  ['b', 'Add and subtract fractions', /\d\/\d|fraction/i],
  ['d', 'Multiply fractions', /×|of|multipl/i],
  ['e', 'Reciprocals', /reciprocal/i],
  ['f', 'Divide fractions', /÷|divide/i],
  ['h', 'Sequences of fractions', /sequence|next|pattern/i],
]);
sub(7, N, 'Decimals', 'DEC', [
  ['a', 'Place value and total value of decimals', /place value|total value|decimal|tenths?|hundredths?/i],
  ['b', 'Multiply decimals', /\d\.\d.*×|×.*\d\.\d|multipl|each/i],
  ['c', 'Divide decimals', /\d\.\d.*÷|÷.*\d\.\d|divid|share/i],
]);
sub(7, N, 'Squares and square roots', 'SQUARES', [
  ['a', 'Squares of whole numbers, fractions, decimals', /square|²/i],
  ['b', 'Square roots', /square root|√/i],
]);
sub(7, A, 'Algebraic expressions', 'EXPR', [
  ['a', 'Form expressions from real life', /expression|write|form/i],
  ['c', 'Simplify expressions', /simplif|collect|like terms|\d?[a-z] [+−-] \d?[a-z]|\b\d*x\b/i],
]);
sub(7, A, 'Linear equations', 'EQUATIONS', [
  ['a', 'Form linear equations in one unknown', /form|equation|let [a-z]/i],
  ['b', 'Solve linear equations', /solve|[a-z] =|equation/i],
  ['c', 'Apply linear equations in real life', /equation|how many|how much|age|cost/i],
]);
sub(7, A, 'Linear inequalities', 'INEQ', [
  ['a', 'Inequality symbols', /[<>≤≥]|symbol/i],
  ['b', 'Form simple linear inequalities', /(write|form|which) .*inequalit|at least|at most|no more than|fewer than|inequality for/i],
  ['c', 'Illustrate inequalities on a number line', /number line|open circle|closed circle|shaded/i],
  ['d', 'Compound inequalities', /compound|\d\s*[<≤]\s*[a-z]\s*[<≤]\s*\d|between/i],
]);
sub(7, MS, 'Pythagorean relationship', 'PYTH', [
  ['a', 'Sides of a right-angled triangle', /hypotenuse|right-angled|right angled|longest side/i],
  ['b', 'The Pythagorean relationship', /pythag|a²|²|triple|hypotenuse|right/i],
  ['c', 'Apply it in real life', /ladder|wall|diagonal|gate|pole|path|across|east|north|right-angled/i],
]);
sub(7, MS, 'Length', 'LENGTH', [
  ['a', 'Convert cm, dm, m, Dm, Hm, km', /\bdm\b|\bDm\b|\bHm\b|decimet|dekamet|decamet|hectomet|convert|change/],
  ['b', 'Operations on length', /\bm\b|\bcm\b|\bkm\b|\bmm\b/i],
  ['c', 'Perimeter of plane figures', /perimeter|fence|around/i],
  ['d', 'Circumference', /circumference|circular|wheel|round/i],
]);
sub(7, MS, 'Area', 'AREA', [
  ['a', 'Square metres, acres and hectares', /acres?|hectares?|\bha\b|m²|cm²/i],
  ['b', 'Area of rectangles, triangles, parallelograms, trapeziums', /area|rectangle|parallelogram|trapezium|rhombus/i],
  ['c', 'Area of a circle', /circle|circular|radius/i],
  ['d', 'Borders and combined shapes', /border|path around|combined|composite|L-shaped/i],
]);
sub(7, MS, 'Volume and capacity', 'VOL', [
  ['a', 'Cubic metres and cubic centimetres', /m³|cm³|cubic/i],
  ['c', 'Volume of cubes, cuboids, cylinders', /volume|cuboid|cube|cylinder|tank/i],
  ['d', 'cm³, ml and litres; capacity of containers', /litres?|\bml\b|capacity|tank|container/i],
]);
sub(7, MS, 'Time, distance and speed', 'SPEED', [
  ['a', 'Units of time: seconds to hours', /seconds?|minutes?.*hours?|hours?.*minutes?|change .*(hours|minutes)/i],
  ['c', 'Units of distance', /\bkm\b.*\bm\b|\bm\b.*\bkm\b|metres?/i],
  ['d', 'Speed as distance covered per unit of time', /speed|km\/h|m\/s/i],
  ['f', 'Convert km/h and m/s', /km\/h.*m\/s|m\/s.*km\/h/i],
]);
sub(7, MS, 'Temperature', 'TEMP', [
  ['a', 'Describe temperature: hot, warm, cool, cold', /hott|cold|warm|cool|hot\b/i],
  ['b', 'Compare temperatures', /hott|cold|warm|cool|higher|lower|difference|rise|fall|drop|°C/i],
  ['c', 'Units: degrees Celsius and kelvin', /°C|kelvin|\bK\b|thermometer/],
  ['d', 'Convert Celsius and kelvin', /kelvin|\d ?K\b/],
  ['e', 'Temperature in real life', /°C|kelvin|thermometer|temperature/i],
]);
sub(7, MS, 'Money', 'MONEY', [
  ['a', 'Profit and loss', /profit|loss/i],
  ['b', 'Percentage profit and loss', /(profit|loss).*(%|per ?cent)|(%|per ?cent).*(profit|loss)/i],
  ['c', 'Discount', /discount|percentage|%|change for/i],
  ['d', 'Commission', /commission/i],
  ['e', 'Interpret and prepare bills', /\bbill|receipt|invoice|tokens?|units|KPLC|water|change|buys/i],
  ['g', 'Postal charges', /postal|parcel|post office|postage/i],
  ['h', 'Mobile money', /M-?Pesa|mobile money|agent|send money|withdraw/i],
]);
sub(7, G, 'Angles', 'ANGLES', [
  ['a', 'Types of angles and angles at a point', /angles?|°|at a point/i],
  ['c', 'Angles on a transversal and parallel lines', /parallel|transversal|alternate|corresponding|co-?interior/i],
  ['d', 'Angles in a triangle and quadrilateral', /triangle|quadrilateral/i],
  ['e', 'Angle properties of a parallelogram', /parallelogram|rhombus|polygon/i],
  ['f', 'Interior and exterior angles of polygons', /interior|exterior|polygon|hexagon|pentagon/i],
]);
sub(7, G, 'Geometrical constructions', 'CONSTRUCT', [
  ['b', 'Facts behind bisecting and constructing angles', /bisect|construct|compass|ruler|protractor|angle|arc|perpendicular/i],
  ['d', 'Actually construct', /draw and measure/i, 'hands'],
]);
sub(7, DP, 'Data handling', 'DATA', [
  ['c', 'Frequency distribution tables', /frequency|tally/i],
  ['d', 'A suitable scale', /\bscale\b|each (square|symbol|picture|unit)|stands for|represents/i],
  ['f', 'Bar graphs and pictographs', /bar|pictograph|graph/i],
  ['h', 'Pie charts', /pie|sector|chart/i],
  ['j', 'Line graphs', /line graph/i],
  ['k', 'Travel graphs', /travel graph|journey|speed|distance/i],
  ['b', 'Draw graphs and collect data', /draw .*graph|collect/i, 'hands'],
]);

// ---------------------------------------------------------------- Grade 8
sub(8, N, 'Integers', 'INTEGERS', [
  ['c', 'Add and subtract integers on the number line', /number line|floor|[−-]\d/i],
  ['a', 'Integers and the number line', /integer|number line|negative|−\d|-\d|below|floor|debt|above/i],
  ['b', 'Operations on integers', /[−-]\d|\(−?-?\d|integer|×|÷|\+/i],
]);
sub(8, N, 'Fractions', 'FRAC', [
  ['a', 'Combined operations on fractions', /\d\/\d|fraction/i],
  ['b', 'Fractions in real life', /\d\/\d.*(of|shamba|land|money|tank|class|bag|sold|spent|left)|(of|shamba|land|money|tank|class|bag|sold|spent|left).*\d\/\d/i],
]);
sub(8, N, 'Decimals', 'DEC', [
  ['c', 'Recurring decimals to fractions', /recurring|repeat|\.\.\./i],
  ['e', 'Significant figures', /significant/i],
  ['f', 'Standard form of a number', /standard form|× ?10|10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/i],
  ['g', 'Combined operations on decimals', /\d\.\d|work out/i],
  ['h', 'Apply decimals in real life', /\d\.\d|sh /i],
  ['a', 'Convert decimals and fractions, recurring decimals', /recurring|repeating|\.\.\.|decimal|\d\.\d/i],
  ['b', 'Combined operations on decimals', /\d\.\d/],
  ['d', 'Standard form', /standard form|× ?10|scientific/i],
]);
sub(8, N, 'Squares and square roots', 'SQUARES', [
  ['c', 'Squares and square roots with a calculator', /square|²|calculator|√|root/i],
  ['a', 'Squares from tables', /square|²|tables?/i],
  ['b', 'Square roots from tables', /square root|√|tables?/i],
]);
sub(8, N, 'Rates, ratio, proportions and percentages', 'RATES', [
  ['b', 'Work out rates', /\brate\b|per (hour|day|kg|kilogram|litre|minute|person|km)/i],
  ['d', 'Compare ratios', /ratio|:/i],
  ['h', 'Percentage change', /per ?cent|%|increase|decrease/i],
  ['i', 'Identify direct and inverse proportion', /proportion|relationship|double/i],
  ['a', 'Rates in real life', /\brate\b|per (hour|day|kg|litre|minute|person|km)|an hour|a day|a kg/i],
  ['c', 'Ratios: forming, comparing', /ratio|\d:\d/i],
  ['e', 'Divide a quantity in a given ratio', /share|divide|ratio|\d:\d/i],
  ['f', 'Increase and decrease in a ratio', /(increase|decrease|in the ratio).*ratio|ratio.*(increase|decrease)/i],
  ['g', 'Percentage increase and decrease', /per ?cent|%|increase|decrease/i],
  ['j', 'Direct and inverse proportion', /proportion|how (many|much) .*(would|will|take|do|does)|workers|days|men|people/i],
]);
sub(8, A, 'Algebraic expressions', 'EXPR', [
  ['a', 'Factorise algebraic expressions', /factor|\(/i],
  ['b', 'Algebraic fractions', /[a-z]\/\d|\/[a-z]|algebraic fraction/i],
  ['c', 'Substitute values', /substitut|when [a-z] =|evaluate|expand|\(/i],
]);
sub(8, A, 'Linear equations', 'EQUATIONS', [
  ['c', 'Solve by elimination', /eliminat|solve|equations?|x \+ y/i],
  ['a', 'Form two equations in two unknowns', /two equations|form|let .*and/i],
  ['b', 'Solve by substitution and elimination', /solve|[a-z] =|equation|substitut|eliminat|[a-z]\s*[+−-]\s*\d?[a-z]\s*=/i],
  ['d', 'Apply in real life', /\b(cost|costs|altogether|together|sum|total)\b/i],
]);
sub(8, MS, 'Circles', 'CIRCLES', [
  ['a', 'Circumference', /circumference|radius|diameter/i],
  ['b', 'Arc length', /\barc\b/i],
  ['c', 'Perimeter of a sector', /sector|perimeter/i],
]);
sub(8, MS, 'Area', 'AREA', [
  ['a', 'Area of a circle', /circle|radius/i],
  ['b', 'Area of a sector', /sector/i],
  ['c', 'Surface area of cubes and cuboids', /surface|cube|cuboid|box|carton/i],
  ['d', 'Surface area of a cylinder', /cylind|tin|tank/i],
  ['e', 'Surface area of a triangular prism', /prism/i],
  ['f', 'Irregular shapes on a square grid', /irregular|grid|squares?/i],
]);
sub(8, MS, 'Money', 'MONEY', [
  ['a', 'Interest and principal', /interest|principal/i],
  ['b', 'Simple interest', /simple interest|interest/i],
  ['c', 'Compound interest', /compound/i],
  ['d', 'Appreciation and depreciation', /apprecia|deprecia|loses? .*value|value .*(falls|drops|rises)/i],
  ['e', 'Hire purchase; profit, loss and discount in trade', /hire purchase|deposit|instalment|profit|loss|discount/i],
]);
sub(8, G, 'Geometrical constructions', 'CONSTRUCT', [
  ['b', 'Divide a line in proportion', /proportion|equal parts|divide a line/i],
  ['c', 'Angle properties of polygons', /polygon|hexagon|pentagon|octagon|interior|exterior|bisect|construct|loci|locus|compass/i],
  ['d', 'Actually construct polygons', /draw and measure/i, 'hands'],
  ['f', 'Circumscribed and inscribed circles', /circumscrib|inscribe|circumcentre|incentre|touch(es|ing) .*sides|through all three corners|passes? through .*vertices/i],
]);
sub(8, G, 'Coordinates and graphs', 'GRAPHS', [
  ['c', 'Plot points on the Cartesian plane', /point|coordinate|origin|\(-?\d|\(−?\d|plane/i],
  ['h', 'Apply simultaneous equations in real life', /meet|charge|equal|graph/i],
  ['b', 'Identify and plot points', /\(-?\d+, ?-?\d+\)|point|coordinate|plot|axis/i],
  ['d', 'Table of values for a linear equation', /table of values|complete the table|table|find y when/i],
  ['e', 'A suitable scale', /\bscale\b/i],
  ['f', 'Draw a linear graph', /draw .*graph/i, 'hands'],
  ['g', 'Solve simultaneous equations by graph', /(meet|cross|intersect)|simultaneous/i],
]);
sub(8, G, 'Scale drawing', 'SCALE', [
  ['a', 'Represent a length to a given scale', /\bscale\b|plan|1 ?cm/i],
  ['c', 'Convert scale length to actual length', /\bscale\b|map|1 ?cm/i],
  ['e', 'Write a linear scale in statement form', /\bscale\b|represents|map/i],
  ['f', 'Interpret a linear scale in ratio form', /scale|1 ?:/i],
  ['g', 'Write a linear scale in ratio form', /scale|ratio|1 ?:/i],
  ['h', 'Convert statement form and ratio form', /scale|ratio|1 ?:|represents/i],
  ['b', 'Actual length and scale length', /\bscale\b|on the (map|plan|drawing)|represents|1 ?cm/i],
  ['d', 'Scales in statement and ratio form', /1 ?:|ratio form|statement|represents/i],
  ['i', 'Make a scale drawing', /make a scale drawing/i, 'hands'],
  ['j', 'Apply scale drawing in real life', /map|plan|plot|shamba|road/i],
]);
sub(8, G, 'Common solids', 'SOLIDS', [
  ['a', 'Identify common solids', /cube|cuboid|cylinder|cone|pyramid|prism|sphere|solid|vertices|faces?|edges?/i],
  ['b', 'Nets of cubes, cuboids, cylinders, cones, pyramids', /\bnets?\b/i],
  ['c', 'Surface area of solids from nets; volume', /surface|volume|net/i],
  ['d', 'Distance between points on a surface', /shortest|distance|ant|along the (surface|faces?)/i],
]);
sub(8, DP, 'Data presentation and interpretation', 'DATA', [
  ['d', 'Interpret line graphs', /line graph|graph|price/i],
  ['f', 'Mean of discrete data', /mean|average/i],
  ['g', 'Median of discrete data', /median/i],
  ['b', 'Bar graphs and line graphs', /bar|line graph|graph/i],
  ['e', 'Mode, mean and median', /mode|mean|median|average|range/i],
]);
sub(8, DP, 'Probability', 'PROB', [
  ['c', 'Write experimental probabilities', /experiment|times|tries/i],
  ['e', 'Probability as a decimal or percentage', /probab|decimal|percentage/i],
  ['g', 'Recognise events by chance', /chance|sure|happens/i],
  ['a', 'Events involving chance', /chance|likely|certain|impossible|probab/i],
  ['b', 'Experimental probability', /experiment|tossed .*times|\d+ times|trials?|relative frequency/i],
  ['d', 'Probability as a fraction, decimal, percentage; combined events', /probab|chance/i],
]);

// ---------------------------------------------------------------- Grade 9
sub(9, N, 'Integers', 'INTEGERS', [
  ['b', 'Combined operations on integers', /[−-]\d|\(−?-?\d|integer/i],
  ['c', 'Integers in real life', /(floor|below|above|debt|overdraft|temperature|sea level|loss|owes?|lift|goal|altitude|depth)/i],
]);
sub(9, N, 'Cubes and cube roots', 'CUBES', [
  ['a', 'Cubes by multiplication', /cube|³/i],
  ['b', 'Cubes from mathematical tables', /tables?/i],
  ['c', 'Cube roots by the factor method', /cube root|∛|prime factor/i],
  ['d', 'Cube roots from tables', /cube root.*tables?|tables?.*cube root/i],
  ['e', 'Cubes and cube roots in real life', /tank|box|container|carton|block|side length|edge/i],
]);
sub(9, N, 'Indices and logarithms', 'INDICES', [
  ['a', 'Numbers in index form', /index|power|\^|²|³|⁴/i],
  ['c', 'Laws of indices', /law|\^|simplif|index|power/i],
  ['d', 'Powers of 10 and common logarithms', /log|10\^|power of 10/i],
]);
sub(9, N, 'Compound proportions and rates of work', 'PROPORTION', [
  ['a', 'Divide quantities in ratio; proportional parts', /ratio|\d:\d|share|proportion/i],
  ['b', 'Relate different ratios', /(a|b|c)\s*:\s*(b|c)|ratio.*ratio|\d ?: ?\d.*\d ?: ?\d/i],
  ['c', 'Compound proportion', /workers?|men|machines?|people|painters|days|hours|varies|proportion/i],
  ['d', 'Rates of work', /days?|hours?|work|fill|pipe|tap|together/i],
]);
sub(9, A, 'Matrices', 'MATRICES', [
  ['a', 'Matrices: identify, order, position', /matri|order|row|column|\[/i],
  ['d', 'Compatibility of matrices', /compatib|can be added|same order/i],
  ['e', 'Add and subtract matrices', /matri|\+|[−-]|\[/i],
]);
sub(9, A, 'Equations of a straight line', 'LINE', [
  ['a', 'Gradient in real life', /gradient|slope|road|ramp|roof|hill|rises/i],
  ['b', 'Gradient from two points', /gradient/i],
  ['c', 'Equation from two points', /equation|y =/i],
  ['d', 'Equation from a point and gradient', /equation|y =|gradient/i],
  ['e', 'Write in the form y = mx + c', /y\s*=\s*mx|form|y =/i],
  ['g', 'x and y intercepts', /intercept|crosses|meets the/i],
]);
sub(9, A, 'Linear inequalities', 'INEQ', [
  ['a', 'Solve inequalities in one unknown', /solve|[a-z]\s*[<>≤≥]/i],
  ['b', 'Graph an inequality in one unknown', /graph|number line|shade|region|side of the line|boundary/i],
  ['c', 'Graph an inequality in two unknowns', /region|shade|side of the line|boundary|[a-z]\s*\+\s*[a-z]\s*[<>≤≥]|y\s*[<>≤≥]/i],
  ['d', 'Inequalities in real life', /at least|at most|no more|budget|can .*buy|maximum|minimum|fewest|most|greatest|largest/i],
]);
sub(9, MS, 'Area', 'AREA', [
  ['a', 'Area of a pentagon and hexagon', /pentagon|hexagon/i],
  ['b', 'Surface area of prisms', /prism/i],
  ['c', 'Surface area of pyramids', /pyramid/i],
  ['d', 'Area of sectors and segments', /sector|segment|arc/i],
  ['e', 'Surface area of a cone', /cone/i],
  ['f', 'Surface area of a sphere', /sphere|ball|dome|hemisphere/i],
]);
sub(9, MS, 'Volume of solids', 'VOL', [
  ['a', 'Volume of a prism', /prism|cylind/i],
  ['b', 'Volume of a pyramid', /pyramid/i],
  ['c', 'Volume of a cone', /cone/i],
  ['d', 'Volume of a frustum', /frustum|bucket|top .*cut off/i],
  ['e', 'Volume of a sphere', /sphere|ball|hemisphere/i],
]);
sub(9, MS, 'Mass, volume, weight and density', 'DENSITY', [
  ['a', 'Units of mass', /tonnes?|\bkg\b|\bg\b|grams?/i],
  ['b', 'Mass and weight', /weight|newton|gravity|\bN\b/],
  ['c', 'Mass, volume and density', /density|g\/cm|kg\/m/i],
  ['d', 'Density in real life', /float|sink|oil|water|milk|ice|metal|density/i],
]);
sub(9, MS, 'Time, distance and speed', 'SPEED', [
  ['a', 'Speed in km/h and m/s', /km\/h|m\/s|speed/i],
  ['b', 'Average speed', /average speed/i],
  ['c', 'Velocity', /velocity/i],
  ['d', 'Acceleration', /accelerat|decelerat|retard|m\/s²/i],
  ['g', 'Longitude and local time', /longitude|local time|time zone|°\s?[EW]\b/i],
]);
sub(9, MS, 'Money', 'MONEY', [
  ['b', 'Convert currency', /currency|exchange|US\$|dollars?|euros?|pounds?|Ush|Tsh|shillings? (to|into)|buying rate|selling rate/i],
  ['c', 'Import and export duty', /import|export|duty|customs/i],
  ['d', 'Excise duty', /excise/i],
  ['e', 'Value added tax', /\bVAT\b|value added|\bbill\b|hire purchase|\bPAYE\b|commission|\btax/i],
]);
sub(9, MS, 'Approximations and errors', 'APPROX', [
  ['a', 'Approximate quantities', /approximat|estimate|round|significant|decimal place|nearest/i],
  ['b', 'Errors from measurement', /error|tolerance|bound|nearest|limit/i],
  ['c', 'Percentage error', /percentage error|% error|error/i],
]);
sub(9, G, 'Coordinates and graphs', 'GRAPHS', [
  ['b', 'Draw a line from an equation', /draw .*line/i, 'hands'],
  ['d', 'Gradients of parallel lines', /parallel/i],
  ['f', 'Gradients of perpendicular lines', /perpendicular/i],
  ['g', 'Straight-line graphs in real life', /graph|charge|fare|fixed|per km|tariff/i],
]);
sub(9, G, 'Scale drawing', 'SCALE', [
  ['a', 'Compass and true bearings', /bearing|compass|N\d|°/i],
  ['b', 'Bearing of one point from another', /bearing of .* from|back bearing|reverse/i],
  ['c', 'Locate a point by bearing and distance', /(km|m) on a bearing|bearing .*(km|metres)|locate/i],
  ['d', 'Angles of elevation', /elevation/i],
  ['f', 'Angles of depression', /depression/i],
]);
sub(9, G, 'Similarity and enlargement', 'SIMILAR', [
  ['a', 'Similar figures', /similar/i],
  ['c', 'Properties of enlargement', /enlarge|centre of|image|translation|object/i],
  ['e', 'Linear, area and volume scale factor', /scale factor|linear scale|enlarge/i],
  ['b', 'Draw images', /draw the image/i, 'hands'],
]);
sub(9, G, 'Trigonometry', 'TRIG', [
  ['b', 'Sine, cosine and tangent', /sin|cos|tan|opposite|adjacent|hypotenuse/i],
  ['c', 'Read trigonometric tables', /tables?/i],
  ['e', 'Apply trigonometric ratios', /ladder|tree|building|tower|elevation|depression|shadow|wall|ramp|angle/i],
]);
sub(9, DP, 'Data interpretation', 'DATA', [
  ['a', 'Class widths and frequency tables for grouped data', /class|frequency|group|interval/i],
  ['c', 'Modal class', /modal/i],
  ['d', 'Mean of grouped data', /mean/i],
  ['e', 'Median of grouped data, cumulative frequency', /median|cumulative/i],
  ['b', 'Draw histogram and frequency polygon', /draw .*(histogram|polygon)/i, 'hands'],
]);
sub(9, DP, 'Probability', 'PROB', [
  ['b', 'Range of probability, simple events', /probab|chance|likely/i],
  ['c', 'Mutually exclusive events', /mutually exclusive|cannot both|either/i],
  ['e', 'Independent events, with and without replacement', /independent|replac|two|both|then|keeps|next draw|put back/i],
  ['f', 'Tree diagrams', /tree diagram/i],
]);

// ---------------------------------------------------------------- Grades 1 to 3
// The design's own outcomes (curriculum/mathematics/g1.json to g3.json), attitude and "play games
// on a device" outcomes left out as everywhere else: [letter, text, 1 if hands-on]. The text is
// the design's. The signal is /./ because no one has written a pattern for these yet.
const OFFICIAL_G1_3 = {
  'MATH.G1.NUMBER.PRE_NUMBER_ACTIVITIES': [["a", "sort objects according to similar attributes in different situations", 1], ["b", "match objects with similar attributes in the environment", 1], ["c", "order objects according to given criteria in different situations", 1], ["d", "create patterns of different sizes and shapes using real objects", 1]],
  'MATH.G1.NUMBER.WHOLE_NUMBERS': [["a", "count numbers forward up to 50", 0], ["b", "count numbers backward from 30", 0], ["c", "represent numbers 1 to 30 using concrete objects", 1], ["d", "read and write numbers 1 to 50 in symbols", 0], ["e", "read and write numbers 1 to 10 in words", 0], ["f", "identify missing numbers in number patterns up to 20", 0]],
  'MATH.G1.NUMBER.ADDITION': [["a", "model addition as putting objects together", 1], ["b", "use ' +' and ' =' signs in writing addition statements", 0], ["c", "add 2 single-digit numbers in different situations", 0], ["d", "add 3 single-digit numbers in different contexts", 0], ["e", "add a 2-digit number to a 1-digit number without regrouping with sum not exceeding 50", 0], ["f", "work out missing numbers in patterns involving the addition of whole numbers up to 50", 0]],
  'MATH.G1.NUMBER.SUBTRACTION': [["a", "model subtraction as 'taking away' using concrete objects", 1], ["b", "use the ' - ' and '='signs in writing subtraction sentences", 0], ["c", "subtract single digit numbers", 0], ["d", "subtract a 1-digit number from a 2-digit number without regrouping", 0], ["e", "work out missing numbers in patterns involving subtraction of whole numbers up to 50", 0]],
  'MATH.G1.MEASUR.LENGTH': [["a", "collect objects of different lengths from the immediate environment", 1], ["b", "compare the length of objects using longer than, shorter than, and same as", 0], ["c", "measure length using arbitrary units", 1]],
  'MATH.G1.MEASUR.MASS': [["a", "collect objects with different masses from the immediate environment", 1], ["b", "compare the mass of two objects using heavier than, lighter than, or same as", 0], ["c", "measure mass using arbitrary units", 1]],
  'MATH.G1.MEASUR.CAPACITY': [["a", "collect containers of different capacities from the immediate environment", 1], ["b", "compare the capacity of two containers using more than, less than, and same as", 0], ["c", "measure capacity using arbitrary units", 1]],
  'MATH.G1.MEASUR.TIME': [["a", "identify days of the week", 0], ["b", "relate days of the week to various activities", 0], ["c", "identify months of the year", 0]],
  'MATH.G1.MEASUR.MONEY': [["a", "identify Kenyan currency coins", 0], ["b", "identify the sh.50 Kenyan currency note", 0], ["c", "count Kenyan currency coins one at a time", 0], ["d", "use money to buy up to 2 items without balance", 0]],
  'MATH.G1.GEOMET.LINES': [["a", "identify straight lines in different situations", 0], ["b", "draw straight lines on different surfaces", 1], ["c", "identify curved lines in different situations", 0], ["d", "draw curved lines on different surfaces", 1], ["e", "recognise straight and curved lines from real objects in the environment", 0]],
  'MATH.G1.GEOMET.SHAPES': [["a", "identify rectangles, triangles, and circles in objects from the environment", 0], ["b", "make patterns involving rectangles, triangles, circles, and ovals", 1]],
  'MATH.G2.NUMBER.NUMBER_CONCEPT': [["a", "identify numbers 1 to 100 in symbols in different situations", 0], ["b", "represent numbers 1 to 100 using concrete objects from the environment", 1]],
  'MATH.G2.NUMBER.WHOLE_NUMBERS': [["a", "count numbers forward up to 100 in different situations", 0], ["b", "count numbers backward from number 50", 0], ["c", "read and write numbers 1 to 100 in symbols in different situations", 0], ["d", "identify the place value of numbers in ones and tens", 0], ["e", "read and write numbers 1 to 20 in words", 0], ["f", "work out missing numbers in number patterns up to 100", 0]],
  'MATH.G2.NUMBER.ADDITION': [["a", "add a 2 digit number to a 1 digit number without and with regrouping with sum not exceeding 100", 0], ["b", "add a 2 digit number to a 2 digit number without and with regrouping, with sum not exceeding 100", 0], ["c", "add two multiples of 10 whose sum does not exceed 100", 0], ["d", "work out missing numbers in patterns involving addition of whole numbers up to 100", 0]],
  'MATH.G2.NUMBER.SUBTRACTION': [["a", "subtract a 1 digit number from a 2 digit number without regrouping", 0], ["b", "subtract a 2 digit number from a 2 digit number without and with regrouping", 0], ["c", "subtract a lower multiple of from a higher multiple of 10", 0], ["d", "work out missing numbers in patterns involving subtraction up to 100", 0]],
  'MATH.G2.NUMBER.MULTIPLICATION': [["a", "represent multiplication as repeated addition using numbers 1, 2, 3, by 2 and 3", 0], ["b", "write repeated addition sentences as multiplication using ‘ ' sign", 0], ["c", "multiply 1 digit numbers by 1, 2, 3, 4 and 5", 0], ["d", "multiply 1 digit numbers by 10", 0]],
  'MATH.G2.NUMBER.DIVISION': [["a", "represent division as equal sharing up to number 20 by 2", 0], ["b", "represent division as equal grouping of numbers up to 25 by 3", 0], ["c", "use ' ' sign in writing division statements", 0], ["d", "divide numbers up to 25 by 4 and 5 without a remainder", 0]],
  'MATH.G2.NUMBER.FRACTIONS': [["a", "identify a as part of a whole in different situations", 0], ["b", "identify a as part of a whole in different situations", 0], ["c", "use fractions in day-to-day activities", 0]],
  'MATH.G2.MEASUR.LENGTH': [["a", "measure length using fixed units", 1], ["b", "identify the metre as a unit of measuring length", 0], ["c", "measure length in metres", 0]],
  'MATH.G2.MEASUR.MASS': [["a", "measure mass using fixed units", 1], ["b", "identify the kilogram as a unit of measuring mass", 0], ["c", "measure mass of different objects in kilograms", 0]],
  'MATH.G2.MEASUR.CAPACITY': [["a", "measure capacity using fixed units", 1], ["b", "identify the litre as a unit of measuring capacity", 0], ["c", "measure capacity in litres", 0]],
  'MATH.G2.MEASUR.TIME': [["a", "relate the months of the year to special occasions", 0], ["b", "recite the number of days in each month of the year", 1], ["c", "read the calendar in terms of day and date", 0], ["d", "measure time using arbitrary units", 1], ["e", "identify the minute and hour hand in clock face", 0], ["f", "read time by the hour from the clock face", 0], ["g", "write time by the hour shown by an analogue and digital clock", 0]],
  'MATH.G2.MEASUR.MONEY': [["a", "identify Kenyan currency coins and notes up to sh.100", 0], ["b", "count the number of sh. 10 and sh. 20 coins in different situations", 0], ["c", "count the number of sh. 50 and sh. 100 notes in different situations", 0], ["d", "add two denominations of money with a sum not exceeding sh. 100", 0], ["e", "use money to buy up to 3 items without balance", 0]],
  'MATH.G2.GEOMET.LINES': [["a", "model straight lines in different ways", 1], ["b", "draw straight lines in different ways", 1], ["c", "model curved lines in different ways", 1], ["d", "draw curved lines in different situations", 1]],
  'MATH.G2.GEOMET.SHAPES': [["a", "identify different shapes in the environment", 0], ["b", "draw shapes in different ways", 1], ["c", "draw patterns involving different shapes", 1]],
  'MATH.G3.NUMBER.NUMBER_CONCEPT': [["a", "order objects according size", 1], ["b", "identify position of objects from 1 st to 20 th", 0], ["c", "write the position of objects in numbers symbols and in words", 0]],
  'MATH.G3.NUMBER.WHOLE_NUMBERS': [["a", "count numbers forward up to 1000 starting from any point", 0], ["b", "count numbers backward in multiples of 100 from 1000", 0], ["c", "identify the place value of numbers up to hundreds", 0], ["d", "read numbers 1 to 1000 in symbols", 0], ["e", "read and write numbers 1 to 100 in words", 0], ["f", "identify missing numbers in number patterns up to 1000", 0]],
  'MATH.G3.NUMBER.ADDITION': [["a", "add a 3 digit number to up to a 2 digit number without regrouping with sum not exceeding 1000", 0], ["b", "add a 3 digit number to up to a 2 digit number with single regrouping with sum not exceeding 1000", 0], ["c", "add two 3 digit numbers without regrouping", 0], ["d", "add two 3 digit numbers with single regrouping with sum not exceeding 1000", 0], ["e", "create number patterns involving addition up to 1000", 1]],
  'MATH.G3.NUMBER.SUBTRACTION': [["a", "subtract a 2-digit number from a 3 digit number without regrouping", 0], ["b", "Subtract a 2 digit number from a three digit number with single regrouping", 0], ["c", "subtract a 3 digit number from a 3 digit number with single regrouping", 0], ["d", "subtract up to 3 digit numbers involving missing numbers with single regrouping", 0], ["e", "work out missing numbers in number patterns involving subtraction up to 1000", 0]],
  'MATH.G3.NUMBER.MULTIPLICATION': [["a", "model multiplication as repeated addition using numbers 1,2,3,4 and 5 by 4 and 5", 1], ["b", "multiply a single digit number by a single digit number", 0], ["c", "multiply single digit numbers by 10", 0]],
  'MATH.G3.NUMBER.DIVISION': [["a", "represent division of numbers up to 50 by 4 and 5 as repeated subtraction", 0], ["b", "divide a 2 digit number by a single digit number without a remainder", 0], ["c", "divide a 2 digit number by 10 without a remainder", 0]],
  'MATH.G3.NUMBER.FRACTIONS': [["a", "identify , and as part of a whole", 0], ["b", "identify , and as part of a group", 0]],
  'MATH.G3.MEASUR.LENGTH': [["a", "measure length in metres", 0], ["b", "add length in metres", 0], ["c", "subtract length in metres", 0], ["d", "estimate length up to 10 metres", 0]],
  'MATH.G3.MEASUR.MASS': [["a", "measure mass in kilograms", 0], ["b", "add mass in kilograms", 0], ["c", "subtract mass in kilograms", 0], ["d", "estimate mass up to 5 kilograms", 0]],
  'MATH.G3.MEASUR.CAPACITY': [["a", "measure capacity in litres", 0], ["b", "add capacity in litres", 0], ["c", "subtract capacity in litres", 0], ["d", "estimate capacity up to 5 litres", 0]],
  'MATH.G3.MEASUR.TIME': [["a", "identify the minute as a unit of measuring time", 0], ["b", "read and tell time using ‘past' and ‘to' the hour using the clock face", 0], ["c", "read and tell time using the digital clock or analogue clock", 0], ["d", "write time using ‘past' and ‘to' the hour", 0], ["e", "estimate time in hours", 0], ["f", "add time involving hours and minutes without conversion in real life situations", 0], ["g", "subtract time involving hours and minutes without conversion in real life situations", 0]],
  'MATH.G3.MEASUR.MONEY': [["a", "identify Kenyan currency notes up to sh.1000", 0], ["b", "count money in different denominations up to sh.1000", 0], ["c", "add money involving different denominations up to a sh.1000", 0], ["d", "subtract money involving different denominations up to a sh.1000", 0], ["e", "represent the same amount of money in different denominations", 0], ["f", "convert money into different denominations", 0], ["g", "use money to buy up to 3 items involving balance", 0]],
  'MATH.G3.GEOMET.POSITION_AND_DIRECTION': [["a", "move along a straight line from a point", 1], ["b", "identify the right and left side from a point", 0], ["c", "turn to the right from a point", 0], ["d", "turn to the left from a point", 0]],
  'MATH.G3.GEOMET.SHAPES': [["a", "identify the shapes in a combined shape made of two different shapes", 0], ["b", "draw a combined shape made of 2 shapes", 1], ["c", "model a combined shape made of two shapes", 1]],
};
// Each sub-strand also keeps one broad '0' outcome (the sub-strand as a whole), which the
// first families and every unmapped skill point at.
for (const [grade, status, list] of [
  [1, 'unverified', [[N,'Pre-number activities','PRENUMBER'],[N,'Whole numbers','WHOLE'],[N,'Addition','ADD'],[N,'Subtraction','SUB'],[M,'Length','LENGTH'],[M,'Mass','MASS'],[M,'Capacity','CAP'],[M,'Time','TIME'],[M,'Money','MONEY'],[G,'Lines','LINES'],[G,'Shapes','SHAPES']]],
  [2, 'sub-strand', [[N,'Whole numbers','WHOLE'],[N,'Addition','ADD'],[N,'Subtraction','SUB'],[N,'Multiplication','MUL'],[N,'Division','DIV'],[N,'Fractions','FRAC'],[M,'Length','LENGTH'],[M,'Mass','MASS'],[M,'Capacity','CAP'],[M,'Time','TIME'],[M,'Money','MONEY'],[G,'Lines','LINES'],[G,'Shapes','SHAPES']]],
  [3, 'sub-strand', [[N,'Whole numbers','WHOLE'],[N,'Addition','ADD'],[N,'Subtraction','SUB'],[N,'Multiplication','MUL'],[N,'Division','DIV'],[N,'Fractions','FRAC'],[M,'Length','LENGTH'],[M,'Mass','MASS'],[M,'Capacity','CAP'],[M,'Time','TIME'],[M,'Money','MONEY'],[G,'Position and direction','POSITION'],[G,'Shapes','SHAPES']]],
]) {
  for (const [strand, name, key] of list) {
    // '0' is the broad sub-strand tag the first Grade 1 to 3 families carry. The design's own outcomes
    // follow, with their own letters, so a skill can be tagged to the outcome it clearly tests.
    const official = OFFICIAL_G1_3[substrandCode(grade, strand, name)] || [];
    sub(grade, strand, name, key, [['0', `${name}, as the design's sub-strand`, /./], ...official.map(([letter, text, hands]) => [letter, text, /./, hands ? 'hands' : undefined])], status);
  }
}

// ---------------------------------------------------------------- flat views
export const CBC_SUBSTRANDS = SUBSTRANDS;
export const OUTCOMES = {};
for (const s of SUBSTRANDS) {
  for (const [letter, text, signal, hands] of s.outcomes) {
    const id = `G${s.grade}.${s.key}.${letter}`;
    OUTCOMES[id] = { id, grade: s.grade, strand: s.strand, substrand: s.name, substrandKey: s.key, code: s.code, letter, text, signal, hands: hands === 'hands', status: s.status };
  }
}
export const outcomesOf = (grade, key) => Object.values(OUTCOMES).filter(o => o.grade === grade && o.substrandKey === key);
// Grades 4 to 9, read from the designs: the list coverage is measured against.
export const TESTABLE_OUTCOMES = Object.values(OUTCOMES).filter(o => o.grade >= 4 && o.grade <= 9 && !o.hands);
