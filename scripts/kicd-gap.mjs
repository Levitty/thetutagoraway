// Compare the HOREB skill graph against the official KICD curriculum designs
// (docs/curriculum-sources/). Sub-strands transcribed from each design's own
// "Summary of Strands and Sub Strands" table and strand sections.
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const K = {
  2: { Numbers:[['Number patterns',/pattern/i],['Whole numbers',/whole number|counting|place value|number.*(1|10|100)/i],['Addition',/addition|adding/i],['Subtraction',/subtract/i],['Multiplication',/multipl/i],['Division',/division|divid/i],['Fractions',/fraction/i]],
       Measurement:[['Length',/length|metre|centimetre/i],['Mass',/mass|weight|kg|gram/i],['Capacity',/capacity|litre/i],['Time',/time|clock|hour/i],['Money',/money|shilling/i]],
       Geometry:[['Lines',/line/i],['Shapes',/shape/i]] },
  3: { Numbers:[['Number patterns',/pattern/i],['Whole numbers',/whole number|place value|number.*1000/i],['Addition',/addition|adding/i],['Subtraction',/subtract/i],['Multiplication',/multipl/i],['Division',/division|divid/i],['Fractions',/fraction/i]],
       Measurement:[['Length',/length|metre/i],['Mass',/mass|weight|kg|gram/i],['Capacity',/capacity|litre/i],['Time',/time|clock/i],['Money',/money|shilling/i]],
       Geometry:[['Position',/position|direction|turn/i],['Shapes',/shape/i]] },
  4: { Numbers:[['Whole numbers',/whole number|place value/i],['Addition',/addition|adding/i],['Subtraction',/subtract/i],['Multiplication',/multipl/i],['Division',/division|divid/i],['Fractions',/fraction/i],['Decimals',/decimal/i],['Use of letters (pre-algebra)',/letter|unknown|missing number|algebra|expression/i]],
       Measurement:[['Length',/length/i],['Area',/area/i],['Volume',/volume/i],['Capacity',/capacity|litre/i],['Mass',/mass|weight/i],['Time',/time/i],['Money',/money/i]],
       Geometry:[['Lines',/line/i],['Angles',/angle/i],['Shapes / 3-D',/shape|solid|3-?D|cube|cylinder/i]],
       'Data Handling':[['Data',/data|graph|chart|tally|pictograph/i]] },
  5: { Numbers:[['Whole numbers (LCM, HCF, divisibility)',/lcm|least common|hcf|highest common|gcd|divisib/i],['Addition (to 6-digit)',/addition|adding/i],['Subtraction (to 6-digit)',/subtract/i],['Multiplication (3-digit x 2-digit)',/multipl/i],['Division (3-digit by 2-digit)',/division|divid/i],['Fractions',/fraction/i],['Decimals (thousandths)',/decimal/i],['Simple equations',/equation/i],['Combined operations',/combined operation|order of operations|bodmas/i]],
       Measurement:[['Length',/length/i],['Area',/area/i],['Volume',/volume/i],['Capacity',/capacity|litre/i],['Mass',/mass/i],['Time',/time/i],['Money',/money/i]],
       Geometry:[['Lines',/line/i],['Angles',/angle/i],['3-D objects',/3-?D|cube|cuboid|cylinder|solid/i]],
       'Data Handling':[['Data representation',/data|graph|chart|tally|pictograph/i]] },
  6: { Numbers:[['Whole numbers',/whole number|place value|lcm|hcf|gcd/i],['Multiplication',/multipl/i],['Division',/division|divid/i],['Fractions',/fraction/i],['Decimals',/decimal/i],['Inequalities',/inequalit/i]],
       Measurement:[['Length',/length/i],['Area',/area/i],['Capacity',/capacity|litre/i],['Mass',/mass/i],['Time',/time/i],['Money',/money|profit|loss/i]],
       Geometry:[['Lines',/line/i],['Angles',/angle|triangle/i],['3-D objects',/3-?D|cube|cuboid|solid/i]],
       'Data Handling':[['Bar graphs',/bar graph|graph|data|chart/i]] },
  7: { Numbers:[['Whole numbers',/whole number|place value/i],['Factors',/factor|prime|lcm|gcd|hcf/i],['Fractions',/fraction/i],['Decimals',/decimal/i],['Squares and square roots',/square/i]],
       Algebra:[['Algebraic expressions',/expression|algebra|bracket|simplif/i],['Linear equations',/equation/i],['Linear inequalities',/inequalit/i]],
       Measurements:[['Pythagorean relationship',/pythagor/i],['Length',/length|perimeter|circumference/i],['Area',/area/i],['Volume and capacity',/volume|capacity/i],['Time, distance and speed',/speed|distance|time/i],['Temperature',/temperature/i],['Money',/money|profit|interest|discount/i]],
       Geometry:[['Angles',/angle/i],['Geometrical constructions',/construct|bisect/i]],
       'Data Handling':[['Data handling',/data|graph|mean|median|mode|chart/i]] },
  8: { Numbers:[['Integers',/integer|negative/i],['Fractions',/fraction/i],['Decimals',/decimal/i],['Squares, square roots',/square/i],['Rates, ratio, proportion, percentage',/rate|ratio|proportion|percent/i]],
       Algebra:[['Algebraic expressions',/expression|bracket|factoris|factoriz|simplif/i],['Linear equations and inequalities',/equation|inequalit/i]],
       Measurements:[['Circles',/circle|circumference|pi\b/i],['Area',/area/i],['Money',/money|interest|profit|loss/i]],
       Geometry:[['Geometrical constructions',/construct|bisect|locus/i],['Coordinates and graphs',/coordinate|cartesian|graph/i],['Scale drawing',/scale/i],['Common solids',/solid|net|prism|pyramid|cube|cylinder/i]],
       'Data Handling':[['Data',/data|mean|median|mode|graph/i],['Probability',/probabilit|chance/i]] },
  9: { Numbers:[['Integers',/integer/i],['Cubes and cube roots',/cube root|cubes/i],['Indices and logarithms',/indice|index|logarithm/i],['Compound proportions, rates of work',/compound|proportion|rates of work/i]],
       Algebra:[['Matrices',/matri/i],['Equations (incl. quadratic)',/equation|quadratic/i],['Linear inequalities',/inequalit/i]],
       Measurements:[['Area',/area/i],['Volume',/volume/i],['Mass, volume, weight, density',/density|mass|weight/i],['Time, distance, speed',/speed|distance/i],['Money',/money|interest|depreciat/i],['Approximations and errors',/approximat|error|round|estimat|significant/i]],
       Geometry:[['Coordinates / graphs',/coordinate|graph|cartesian/i],['Scale drawing',/scale|bearing/i],['Similarity and enlargement',/similar|enlarge/i],['Trigonometry',/trigonometr|sine|cosine|tangent/i]],
       'Data Handling':[['Data',/data|mean|median|mode|frequency/i],['Probability',/probabilit/i]] },
};

const all = Object.values(SKILLS);
const at = (g) => all.filter(s => s.grade === g);
const anywhere = (re) => all.filter(s => re.test(s.name)).map(s => `G${s.grade} ${s.name}`);

let missing = [], late = [], early = [];
console.log('KICD CURRICULUM DESIGN  vs  HOREB SKILL GRAPH\n' + '='.repeat(78));
for (const g of [2,3,4,5,6,7,8,9]) {
  console.log(`\n───────── GRADE ${g} ─────────`);
  for (const [strand, subs] of Object.entries(K[g])) {
    for (const [name, re] of subs) {
      const here = at(g).filter(s => re.test(s.name));
      if (here.length) { continue; }
      const elsewhere = anywhere(re);
      if (!elsewhere.length) { console.log(`  ABSENT    ${strand} / ${name}`); missing.push([g, strand, name]); }
      else {
        const grades = [...new Set(elsewhere.map(x => +x.slice(1,3).trim()))].sort((a,b)=>a-b);
        const nearest = grades.reduce((p,c)=>Math.abs(c-g)<Math.abs(p-g)?c:p);
        const dir = nearest > g ? 'TOO LATE ' : 'TOO EARLY';
        console.log(`  ${dir} ${strand} / ${name}  →  we teach it at G${grades.join(',G')}`);
        (nearest > g ? late : early).push([g, strand, name, grades]);
      }
    }
  }
}
console.log('\n' + '='.repeat(78));
console.log(`ABSENT from the graph entirely: ${missing.length}`);
console.log(`Taught LATER than KICD expects: ${late.length}`);
console.log(`Taught EARLIER than KICD expects: ${early.length}`);
