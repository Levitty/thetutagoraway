// ============================================================================
// GRADE 9 MEASUREMENTS: area, volume, mass and density, speed, money, errors.
// Every answer is computed from the draw. Every family is unreviewed.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price, route, LONGITUDES, lonText } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const PI = 22 / 7;
const dp = (x, k = 2) => Math.abs(x * 10 ** k - Math.round(x * 10 ** k)) < 1e-6;
const distinct = (...v) => new Set(v.map(x => round(x, 4))).size === v.length;
const T = commas;
const CUR = { 'US dollars': [127, 131, 'US$'], euros: [138, 146, '€'], pounds: [163, 172, '£'] };
const rate = (name) => { const [lo, hi] = CUR[name]; const buy = randInt(lo, hi); return { buy, sell: buy + pick([3, 4, 5]) }; };
const clock = (min) => `${Math.floor(min / 60)}:${String(Math.round(min) % 60).padStart(2, '0')}`;
const clock24 = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min) % 60).padStart(2, '0')}`;
const ROADS = [['Nairobi', 'Nakuru', 160], ['Nairobi', 'Thika', 45], ['Nairobi', 'Machakos', 60], ['Nairobi', 'Nyeri', 150], ['Mombasa', 'Malindi', 120], ['Kisumu', 'Kakamega', 50], ['Nakuru', 'Eldoret', 155], ['Eldoret', 'Kitale', 70], ['Nairobi', 'Meru', 225], ['Nakuru', 'Kisumu', 185]];

// right-angled triples: [a, b, hypotenuse]
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];

export const FAMILIES = [
  // ======================================================== AREA: pentagon, hexagon
  fam({ id: 'g9.area.hexagon-slab', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.a', rung: 2, form: 'word',
    draw: () => { const [s, h] = pick([[20, 17.3], [30, 26], [40, 34.6], [50, 43.3], [60, 52]]); return { s, h, what: pick(['paving slab', 'table top', 'flower bed']) }; },
    make: ({ s, h, what }) => {
      const tri = round(0.5 * s * h, 2), a = round(6 * tri, 2);
      return { question: `A ${what} is a regular hexagon with six equal sides of ${s} cm. Six identical triangles meet at its centre. Each triangle is ${h} cm high, measured from the centre to the middle of a side. Find the area of the ${what}, in cm².`,
        answer: a,
        wrong: [[tri, 'That is one triangle. A hexagon is made of six of them.'], [round(6 * s * h, 2), 'Each triangle has an area of half base times height. Do not forget the half.'], [round(5 * tri, 2), 'A hexagon has six sides, so it is made of six triangles, not five.'], [round(s * 6, 2), 'That is the distance around the edge. Area needs the height as well.']],
        hints: ['Find the area of one triangle first.', 'Then count how many equal triangles make the hexagon.'],
        steps: [`One triangle: ½ × ${s} × ${h} = ${T(tri)} cm².`, `Six triangles: 6 × ${T(tri)} = ${T(a)} cm².`] };
    },
    check: ({ s, h }, a) => Math.abs(a / 3 / s - h) < 1e-6 }),

  fam({ id: 'g9.area.pentagon-plot', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.a', rung: 2, form: 'steps',
    draw: () => { const w = pick([8, 10, 12, 16, 20]), l = pick([15, 20, 25, 30]), t = pick([3, 4, 5, 6, 9]); return { w, l, t, who: person() }; },
    make: ({ w, l, t, who }) => {
      const rect = w * l, tri = (w * t) / 2;
      return { question: `${who.name}'s plot has five sides. It is a rectangle ${w} m wide and ${l} m long, with a triangle on one of its ${w} m sides. The triangle has a base of ${w} m and a height of ${t} m. Together the two shapes make a pentagon.`,
        parts: [
          { prompt: 'Area of the rectangle, in m²:', answer: rect, unit: 'm²', hint: 'Width times length.', wrong: [[2 * (w + l), 'That is the distance around the rectangle. Area is width times length.'], [w + l, 'Multiply the two sides.']] },
          { prompt: 'Area of the triangle, in m²:', answer: tri, unit: 'm²', hint: 'Half the base times the height.', wrong: [[w * t, 'A triangle is half of a rectangle with the same base and height.'], [w + t, 'Area uses multiplication, not addition.']] },
          { prompt: 'Area of the whole plot, in m²:', answer: rect + tri, unit: 'm²', hint: 'Add the two areas.', wrong: [[rect, 'That leaves out the triangle on top.'], [tri, 'That leaves out the rectangle.']] },
        ],
        hints: ['Split the pentagon into shapes you know.'],
        steps: [`Rectangle: ${w} × ${l} = ${rect} m².`, `Triangle: ½ × ${w} × ${t} = ${T(tri)} m².`, `Plot: ${rect} + ${T(tri)} = ${T(rect + tri)} m².`] };
    },
    check: ({ w, l, t }, v) => v[0] === l * w && v[1] * 2 === w * t && v[2] - v[1] === w * l }),

  fam({ id: 'g9.area.pentagon-spot', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.a', rung: 2, form: 'spot',
    draw: () => { const [s, a] = pick([[6, 4.1], [8, 5.5], [10, 6.9], [12, 8.3]]); return { s, a, kind: pick(['half', 'count']), who: person() }; },
    make: ({ s, a, kind, who }) => {
      const n = kind === 'count' ? 6 : 5, f = kind === 'half' ? 1 : 0.5;
      const tri = round(f * s * a, 2), total = round(n * tri, 2);
      return { question: `${who.name} cuts a regular pentagon into triangles from its centre. A side is ${s} cm and each triangle is ${a} cm high. Here is the working for the area of the pentagon. Which step has the mistake?`,
        working: [
          { text: `A regular pentagon is split into ${n} equal triangles.`, ok: n === 5 },
          { text: f === 0.5 ? `Area of one triangle = ½ × ${s} × ${a}` : `Area of one triangle = ${s} × ${a}`, ok: f === 0.5 },
          { text: `Area of one triangle = ${T(tri)} cm²`, ok: tri === round(f * s * a, 2) },
          { text: `Area of the pentagon = ${n} × ${T(tri)} = ${T(total)} cm²`, ok: total === round(n * tri, 2) },
        ],
        fix: kind === 'half' ? 'The area of a triangle is half of base times height. The half was left out.' : 'A pentagon has five sides, so it splits into five triangles, not six.',
        steps: [`Five triangles, each ½ × ${s} × ${a} = ${T(round(0.5 * s * a, 2))} cm².`, `Pentagon: 5 × ${T(round(0.5 * s * a, 2))} = ${T(round(2.5 * s * a, 2))} cm².`] };
    } }),

  fam({ id: 'g9.area.centre-angle-why', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.a', rung: 3, form: 'why',
    draw: () => ({ n: pick([5, 6]), s: pick([10, 12, 15, 20]), what: pick(['paving block', 'tile', 'garden bed']) }),
    make: ({ n, s, what }) => {
      const sides = n === 5 ? 'pentagonal' : 'hexagonal', ang = 360 / n;
      return { question: `A regular ${sides} ${what} has sides of ${s} cm. Joining its centre to every corner splits it into ${n} equal triangles. Why is the angle at the centre of each triangle ${ang}°?`,
        options: [
          { text: `The angles around the centre make a full turn of 360°, shared equally by ${n} triangles`, right: true },
          { text: `The angles around the centre make a half turn of 180°, shared equally by ${n} triangles`, right: false, why: 'Angles all the way round a point add up to 360°, not 180°.' },
          { text: `Each angle of the ${n === 5 ? 'pentagon' : 'hexagon'} is ${ang}°`, right: false, why: 'The angle inside the corner of the shape is bigger. This question is about the angle at the centre.' },
          { text: `The angle at the centre is the same as ${s}°, the length of the side`, right: false, why: 'A length in cm cannot be an angle in degrees.' },
        ],
        hints: ['What do all the angles around a point add up to?', 'The triangles are equal, so their centre angles are equal.'],
        steps: [`The angles round the centre add up to 360°.`, `360° ÷ ${n} = ${ang}° for each triangle.`] };
    } }),

  // ======================================================== AREA: prisms
  fam({ id: 'g9.area.prism-doorstop', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.b', rung: 2, form: 'steps',
    draw: () => { const t = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15]]); return { a: t[0], b: t[1], c: t[2], L: pick([10, 12, 15, 20]) }; },
    make: ({ a, b, c, L }) => ({
      question: `A wooden doorstop is a solid triangular prism. Its two triangular ends are right-angled with sides ${a} cm, ${b} cm and ${c} cm. The doorstop is ${L} cm long. It will be painted all over.`,
      parts: [
        { prompt: 'Area of the two triangular ends together, in cm²:', answer: a * b, unit: 'cm²', hint: 'One end is half of the two short sides multiplied.', wrong: [[(a * b) / 2, 'That is one triangle. There are two ends.'], [a + b + c, 'That is the distance around one end. Area uses multiplication.']] },
        { prompt: 'Area of the three rectangular faces together, in cm²:', answer: (a + b + c) * L, unit: 'cm²', hint: 'The three rectangles have the same length. Their widths are the three sides of the triangle.', wrong: [[(a + b) * L, 'There are three rectangles. The sloping one is missing.'], [((a * b) / 2) * L, 'That is the volume of the prism. You need the area of the rectangles.']] },
        { prompt: 'Total surface area, in cm²:', answer: a * b + (a + b + c) * L, unit: 'cm²', hint: 'Add the ends and the rectangles.', wrong: [[(a + b + c) * L, 'That leaves out the two ends.'], [(a * b) / 2 + (a + b + c) * L, 'That has only one triangular end.']] },
      ],
      hints: ['Open the prism out: two triangles and three rectangles.'],
      steps: [`Two ends: 2 × ½ × ${a} × ${b} = ${a * b} cm².`, `Rectangles: (${a} + ${b} + ${c}) × ${L} = ${(a + b + c) * L} cm².`, `Total: ${a * b} + ${(a + b + c) * L} = ${a * b + (a + b + c) * L} cm².`],
    }),
    check: ({ a, b, c, L }, v) => v[0] === 2 * ((a * b) / 2) && v[1] === a * L + b * L + c * L && v[2] === v[0] + v[1] }),

  fam({ id: 'g9.area.prism-trough', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.b', rung: 3, form: 'word',
    draw: () => { const [o, h, c] = pick([[6, 8, 10], [9, 12, 15], [15, 20, 25]]); const b = pick([20, 30, 40]); return { o, h, c, b, a: b + 2 * o, L: pick([60, 80, 100]) }; },
    make: ({ o, h, c, b, a, L }) => {
      const end = ((a + b) / 2) * h, sa = 2 * end + (b + 2 * c) * L;
      return { question: `A metal water trough is a prism. Its ends are trapeziums. The top of the trough is open. Each end has a top edge of ${a} cm, a bottom edge of ${b} cm, a height of ${h} cm and sloping sides of ${c} cm. The trough is ${L} cm long. Find the area of metal used, in cm².`,
        answer: sa,
        wrong: [[sa + a * L, 'The top is open, so there is no metal there.'], [end + (b + 2 * c) * L, 'There are two ends, not one.'], [2 * end + b * L, 'The two sloping sides are metal too. They are missing.'], [2 * end + (a + b + 2 * c) * L, 'Check which faces exist: bottom, two slopes, two ends. The top is open.']],
        hints: ['List the faces that are metal: two ends, the bottom and two sloping sides.', 'The area of a trapezium is half of the sum of the parallel sides times the height.'],
        steps: [`One end: ½ × (${a} + ${b}) × ${h} = ${T(end)} cm². Two ends: ${T(2 * end)} cm².`, `Bottom and two slopes: (${b} + ${c} + ${c}) × ${L} = ${T((b + 2 * c) * L)} cm².`, `Total: ${T(2 * end)} + ${T((b + 2 * c) * L)} = ${T(sa)} cm².`] };
    },
    check: ({ b, c, h, a, L }, ans) => ans - (b * L + 2 * c * L) - (a + b) * h === 0 }),

  // ======================================================== AREA: pyramids
  fam({ id: 'g9.area.pyramid-slant', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.c', rung: 3, form: 'steps',
    draw: () => { const [hb, h, l] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]); return { b: 2 * hb, hb, h, l }; },
    make: ({ b, hb, h, l }) => {
      const face = (b * l) / 2;
      return { question: `A solid model of a pyramid has a square base of side ${b} cm. Its vertical height is ${h} cm. The top of the pyramid is directly above the centre of the base. The model is painted on all five faces.`,
        parts: [
          { prompt: 'Slant height of a triangular face, in cm:', answer: l, unit: 'cm', hint: `Make a right-angled triangle with the vertical height and half of the base.`, wrong: [[h + hb, 'Adding the two sides does not give the slope. Use Pythagoras.'], [h, 'That is the vertical height. The slant height is along the face.']] },
          { prompt: 'Area of one triangular face, in cm²:', answer: face, unit: 'cm²', hint: 'Half the base times the slant height.', wrong: [[(b * h) / 2, 'The height of the triangular face is the slant height, not the vertical height.'], [b * l, 'A triangle is half of base times height.']] },
          { prompt: 'Total surface area, in cm²:', answer: 4 * face + b * b, unit: 'cm²', hint: 'Four triangular faces and one square base.', wrong: [[4 * face, 'That leaves out the square base.'], [face + b * b, 'There are four triangular faces.']] },
        ],
        hints: ['The slant height is found from a right-angled triangle inside the pyramid.'],
        steps: [`Half of the base is ${hb} cm. Slant height² = ${h}² + ${hb}² = ${h * h + hb * hb}, so it is ${l} cm.`, `One face: ½ × ${b} × ${l} = ${T(face)} cm².`, `Total: 4 × ${T(face)} + ${b} × ${b} = ${T(4 * face + b * b)} cm².`] };
    },
    check: ({ b, hb, h }, v) => v[0] ** 2 === h ** 2 + hb ** 2 && v[1] * 2 === b * v[0] && v[2] === 2 * b * v[0] + b ** 2 }),

  fam({ id: 'g9.area.pyramid-spot', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.c', rung: 2, form: 'spot',
    draw: () => { const [hb, h, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]); return { b: 2 * hb, h, l, kind: pick(['vertical', 'faces', 'base']), who: person() }; },
    make: ({ b, h, l, kind, who }) => {
      const used = kind === 'vertical' ? h : l, nf = kind === 'faces' ? 3 : 4;
      const face = (b * used) / 2, fs = nf * face, base = kind === 'base' ? 2 * b : b * b, tot = fs + base;
      return { question: `${who.name} covers a closed pyramid with card. The base is a square of ${b} cm. The pyramid stands ${h} cm tall and each sloping face is ${l} cm from the edge of the base to the top. The working for the card needed is shown. Which step has the mistake?`,
        working: [
          { text: `Area of one triangular face = ½ × ${b} × ${used} = ${T(face)} cm²`, ok: used === l },
          { text: `${nf} faces = ${nf} × ${T(face)} = ${T(fs)} cm²`, ok: nf === 4 },
          { text: kind === 'base' ? `Area of the base = ${b} + ${b} = ${2 * b} cm²` : `Area of the base = ${b} × ${b} = ${b * b} cm²`, ok: base === b * b },
          { text: `Total = ${T(fs)} + ${T(base)} = ${T(tot)} cm²`, ok: tot === fs + base },
        ],
        fix: kind === 'vertical' ? 'The height of a triangular face is the slant height. The vertical height of the pyramid is not on the face.' : kind === 'faces' ? 'A square-based pyramid has four triangular faces, one on each side of the base.' : 'The area of a square is side times side, not side added to side.',
        steps: [`Face: ½ × ${b} × ${l} = ${T((b * l) / 2)} cm². Four faces: ${T(2 * b * l)} cm².`, `Base: ${b * b} cm². Total: ${T(2 * b * l + b * b)} cm².`] };
    } }),

  fam({ id: 'g9.area.pyramid-roof', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.c', rung: 3, form: 'word',
    draw: () => { const b = pick([4, 6, 8, 10]), l = pick([3, 4, 5, 6]), rate = pick([50, 80, 120]); return { b, l, rate, who: person() }; },
    make: ({ b, l, rate, who }) => {
      const area = 2 * b * l;
      return { question: `The roof of a garden shelter is a square-based pyramid with no base. Each side of the square is ${b} m. The slant height of each triangular face is ${l} m. ${who.name} paints the roof. The paint costs ${sh(rate)} for each m². How much does the paint cost?`,
        answer: area * rate,
        wrong: [[(area + b * b) * rate, 'The roof has no base, so only the four triangular faces are painted.'], [(area / 4) * rate, 'The roof has four triangular faces, not one.'], [area, 'That is the area in m². The question asks for the cost.'], [(b * l * 4) * rate, 'Each triangular face is half of base times height. Do not forget the half.']],
        hints: ['A roof of this shape has four triangular faces.', 'Find the area, then multiply by the cost of each m².'],
        steps: [`One face: ½ × ${b} × ${l} = ${T((b * l) / 2)} m². Four faces: ${area} m².`, `Cost: ${area} × ${rate} = ${sh(area * rate)}.`] };
    },
    check: ({ b, l, rate }, a) => a / rate / 4 * 2 === b * l }),

  // ======================================================== AREA: sectors and segments
  fam({ id: 'g9.area.sector-light', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.d', rung: 2, form: 'word',
    draw: () => { const r = pick([7, 14, 21]), th = pick([30, 45, 60, 90, 120, 180, 270]); const a = (th / 360) * PI * r * r; return dp(a, 2) ? { r, th, a: round(a, 2), what: pick(['A security light lights part of a compound.', 'A sprinkler waters part of a lawn.']) } : null; },
    make: ({ r, th, a, what }) => {
      const full = round(PI * r * r, 2), arc = round(2 * PI * r * (th / 360), 2);
      return { question: `${what} It reaches ${r} m and sweeps through an angle of ${th}° at the centre. This part is a sector of a circle. Find its area in m². (Use π = 22/7)`,
        answer: a,
        wrong: [[full, 'That is the whole circle. The sector is only a part of it.'], [arc, 'That is the length of the curved edge. Area needs the radius squared.'], [round(full * (360 / th), 2), 'The sector is smaller than the circle, so multiply by the fraction angle ÷ 360, not the other way round.'], [round(full * th / 180, 2), 'A full turn is 360°, not 180°.']],
        hints: ['What fraction of a full turn is the angle?', 'Find the area of the whole circle, then take that fraction of it.'],
        steps: [`Whole circle: 22/7 × ${r} × ${r} = ${T(full)} m².`, `Fraction: ${th}/360.`, `Sector: ${T(full)} × ${th}/360 = ${T(a)} m².`] };
    },
    check: ({ r, th }, a) => Math.abs((a * 360) / th - (22 / 7) * r * r) < 0.06 }),

  fam({ id: 'g9.area.sector-angle', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.d', rung: 3, form: 'word',
    draw: () => { const r = pick([7, 14, 21]), th = pick([45, 60, 90, 120, 270]); const a = (th / 360) * PI * r * r; return dp(a, 2) ? { r, th, a: round(a, 2) } : null; },
    make: ({ r, th, a }) => {
      const full = round(PI * r * r, 2);
      return { question: `A slice of a round cake is a sector with a radius of ${r} cm. The top of the slice has an area of ${T(a)} cm². What is the angle of the slice at the tip? Use π = 22/7.`,
        answer: th,
        wrong: [[round(a / full, 3), 'That is the fraction of the circle. Multiply it by 360 to get degrees.'], [round((a / full) * 180, 1), 'A full turn is 360°, not 180°.'], [360 - th, 'That is the angle of the other part of the circle.'], [round(a / (PI * r), 1), 'The area of a circle uses r × r. Divide by the whole circle area, not by π × r.']],
        hints: ['Find what fraction of the whole circle the sector is.', 'A whole circle is 360°.'],
        steps: [`Whole circle: 22/7 × ${r} × ${r} = ${T(full)} cm².`, `Fraction: ${T(a)} ÷ ${T(full)}, which is ${th}/360.`, `Angle: ${th}°.`] };
    },
    check: ({ r, a }, ans) => Math.abs((ans / 360) * (22 / 7) * r * r - a) < 0.06 }),

  fam({ id: 'g9.area.segment-bed', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.d', rung: 3, form: 'steps',
    draw: () => ({ r: pick([7, 14, 21]), who: person() }),
    make: ({ r, who }) => {
      const sec = round(PI * r * r / 4, 2), tri = (r * r) / 2;
      return { question: `${who.name} has a circular flower bed with centre O and radius ${r} m. A straight path joins two points A and B on its edge. The angle AOB is 90°. The part of the bed between the path and the curved edge is a segment. Use π = 22/7.`,
        parts: [
          { prompt: 'Area of the sector OAB, in m²:', answer: sec, unit: 'm²', hint: 'A 90° angle is a quarter of a full turn.', wrong: [[round(PI * r * r, 2), 'That is the whole circle. The angle is a quarter turn.'], [round(PI * r * r / 2, 2), 'A 90° angle is a quarter of a turn, not a half.']] },
          { prompt: 'Area of the triangle OAB, in m²:', answer: tri, unit: 'm²', hint: 'OA and OB are both radii and meet at a right angle. Use half base times height.', wrong: [[r * r, 'A triangle is half of base times height.'], [r, 'Multiply the two radii, then halve.']] },
          { prompt: 'Area of the segment, in m²:', answer: round(sec - tri, 2), unit: 'm²', hint: 'Take the triangle away from the sector.', wrong: [[round(sec + tri, 2), 'The segment is what is left when the triangle is taken away.'], [sec, 'The triangle must be taken away.']] },
        ],
        hints: ['Segment = sector minus triangle.'],
        steps: [`Sector: ¼ × 22/7 × ${r} × ${r} = ${T(sec)} m².`, `Triangle: ½ × ${r} × ${r} = ${T(tri)} m².`, `Segment: ${T(sec)} − ${T(tri)} = ${T(round(sec - tri, 2))} m².`] };
    },
    check: ({ r }, v) => Math.abs(v[0] * 4 - (22 / 7) * r * r) < 0.06 && v[1] * 2 === r * r && Math.abs(v[2] + v[1] - v[0]) < 0.01 }),

  // ======================================================== AREA: cones
  fam({ id: 'g9.area.cone-top', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.e', rung: 3, form: 'steps',
    draw: () => { const c = pick([{ r: 7, h: 24, l: 25, p: 22 / 7, pt: '22/7' }, { r: 21, h: 20, l: 29, p: 22 / 7, pt: '22/7' }, { r: 14, h: 48, l: 50, p: 22 / 7, pt: '22/7' }, { r: 6, h: 8, l: 10, p: 3.14, pt: '3.14' }, { r: 5, h: 12, l: 13, p: 3.14, pt: '3.14' }, { r: 9, h: 12, l: 15, p: 3.14, pt: '3.14' }, { r: 8, h: 15, l: 17, p: 3.14, pt: '3.14' }]); return c; },
    make: ({ r, h, l, p, pt }) => {
      const csa = round(p * r * l, 2), tot = round(p * r * (r + l), 2);
      return { question: `A solid wooden spinning top is a cone. Its base has a radius of ${r} cm. Its vertical height is ${h} cm. It will be varnished all over. (Use π = ${pt})`,
        parts: [
          { prompt: 'Slant height of the cone, in cm:', answer: l, unit: 'cm', hint: 'Use the vertical height and the radius as the two short sides of a right-angled triangle.', wrong: [[r + h, 'Adding the two sides does not give the slant side. Use Pythagoras.'], [h, 'That is the vertical height. The slant height runs along the curved surface.']] },
          { prompt: 'Curved surface area, in cm²:', answer: csa, unit: 'cm²', hint: 'Curved surface = π × r × slant height.', wrong: [[round(p * r * h, 2), 'The curved surface uses the slant height, not the vertical height.'], [round(p * r * r, 2), 'That is the flat circle at the bottom.']] },
          { prompt: 'Total surface area, in cm²:', answer: tot, unit: 'cm²', hint: 'Add the flat circular base.', wrong: [[csa, 'The flat base also needs varnish.'], [round(csa + 2 * p * r, 2), 'The area of a circle is π × r × r, not 2 × π × r.']] },
        ],
        hints: ['First find the slant height.'],
        steps: [`Slant height² = ${r}² + ${h}² = ${r * r + h * h}, so it is ${l} cm.`, `Curved surface: ${pt} × ${r} × ${l} = ${T(csa)} cm².`, `Base: ${pt} × ${r} × ${r} = ${T(round(p * r * r, 2))} cm². Total: ${T(tot)} cm².`] };
    },
    check: ({ r, h, p }, v) => v[0] ** 2 === r ** 2 + h ** 2 && Math.abs(v[1] - p * r * v[0]) < 0.011 && Math.abs(v[2] - v[1] - p * r * r) < 0.02 }),

  fam({ id: 'g9.area.cone-spot', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.e', rung: 2, form: 'spot',
    draw: () => { const c = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]); return { r: c[0], h: c[1], l: c[2], kind: pick(['vertical', 'base', 'slant']), who: person() }; },
    make: ({ r, h, l, kind, who }) => {
      const p = 3.14, ls = kind === 'slant' ? r + h : l, used = kind === 'vertical' ? h : ls;
      const csa = round(p * r * used, 2), base = kind === 'base' ? round(2 * p * r, 2) : round(p * r * r, 2), tot = round(csa + base, 2);
      return { question: `${who.name} works out how much tin makes a closed cone-shaped funnel with radius ${r} cm and height ${h} cm. Use π = 3.14. Which step of the working is wrong?`,
        working: [
          { text: kind === 'slant' ? `Slant height = ${r} + ${h} = ${ls} cm` : `Slant height² = ${r}² + ${h}² = ${r * r + h * h}, so the slant height is ${l} cm`, ok: kind !== 'slant' },
          { text: `Curved surface = 3.14 × ${r} × ${used} = ${T(csa)} cm²`, ok: used === ls },
          { text: kind === 'base' ? `Area of the base = 2 × 3.14 × ${r} = ${T(base)} cm²` : `Area of the base = 3.14 × ${r} × ${r} = ${T(base)} cm²`, ok: base === round(p * r * r, 2) },
          { text: `Total = ${T(csa)} + ${T(base)} = ${T(tot)} cm²`, ok: tot === round(csa + base, 2) },
        ],
        fix: kind === 'slant' ? 'The slant height is the long side of a right-angled triangle. Use Pythagoras, not addition.' : kind === 'vertical' ? 'The curved surface uses the slant height. The vertical height does not lie on the surface.' : 'The area of a circle is π × r × r. The 2 × π × r is the distance around the circle.',
        steps: [`Slant height: ${l} cm.`, `Curved surface ${T(round(p * r * l, 2))} cm², base ${T(round(p * r * r, 2))} cm², total ${T(round(p * r * (r + l), 2))} cm².`] };
    } }),

  // ======================================================== AREA: spheres
  fam({ id: 'g9.area.sphere-tank-paint', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.f', rung: 3, form: 'word',
    draw: () => ({ r: pick([3.5, 7, 10.5, 14]), who: person() }),
    make: ({ r, who }) => {
      const sa = round(4 * PI * r * r, 2), cover = 14, litres = sa / cover;
      return { question: `A water tank is a sphere of radius ${r} m. ${who.name} paints all of the outside. One litre of paint covers 14 m². How many litres of paint are needed? (Use π = 22/7)`,
        answer: litres,
        wrong: [[round((2 * PI * r * r) / cover, 2), 'A sphere has more surface than half a sphere. The area is 4 × π × r × r.'], [round((PI * r * r) / cover, 2), 'That is the area of a circle through the middle. The surface of a sphere is four times that.'], [sa, 'That is the area in m². Now find how many litres cover it.'], [round(((4 / 3) * PI * r ** 3) / cover, 2), 'That is based on the volume. Paint covers surface, so use the surface area.']],
        hints: ['Find the surface area of the sphere first.', 'Then divide by the area one litre covers.'],
        steps: [`Surface area: 4 × 22/7 × ${r} × ${r} = ${T(sa)} m².`, `Litres: ${T(sa)} ÷ 14 = ${T(litres)}.`] };
    },
    check: ({ r }, a) => Math.abs(a * 14 - 4 * (22 / 7) * r * r) < 0.06 }),

  fam({ id: 'g9.area.hemisphere-dome', skill: 'G9_SURFACE_AREA_ADV', outcome: 'G9.AREA.f', rung: 3, form: 'steps',
    draw: () => ({ r: pick([3.5, 7, 10.5, 14, 21]) }),
    make: ({ r }) => {
      const curved = round(2 * PI * r * r, 2), flat = round(PI * r * r, 2);
      return { question: `A workshop makes a metal half-ball, a solid hemisphere, of radius ${r} cm. Both its curved top and its flat base are to be chromed. Use π = 22/7.`,
        parts: [
          { prompt: 'Area of the curved surface, in cm²:', answer: curved, unit: 'cm²', hint: 'A hemisphere is half of a sphere, and a sphere has a surface of 4πr².', wrong: [[round(4 * PI * r * r, 2), 'That is a whole sphere. The hemisphere is half of it.'], [flat, 'That is only a circle.']] },
          { prompt: 'Area of the flat base, in cm²:', answer: flat, unit: 'cm²', hint: 'The base is a circle.', wrong: [[curved, 'That is the curved top.'], [round(2 * PI * r, 2), 'That is the distance around the circle. Area is π × r × r.']] },
          { prompt: 'Total surface area, in cm²:', answer: round(curved + flat, 2), unit: 'cm²', hint: 'Add the curved top and the flat base.', wrong: [[curved, 'The flat base is a surface too.'], [round(4 * PI * r * r + flat, 2), 'The curved part is half a sphere, not a whole one.']] },
        ],
        hints: ['A hemisphere has two surfaces: one curved and one flat.'],
        steps: [`Curved: 2 × 22/7 × ${r} × ${r} = ${T(curved)} cm².`, `Base: 22/7 × ${r} × ${r} = ${T(flat)} cm².`, `Total: ${T(curved)} + ${T(flat)} = ${T(round(curved + flat, 2))} cm².`] };
    },
    check: ({ r }, v) => Math.abs(v[2] - 3 * (22 / 7) * r * r) < 0.07 && Math.abs(v[0] - 2 * v[1]) < 0.02 }),

  // ======================================================== VOLUME
  fam({ id: 'g9.vol.prism-trough', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.a', rung: 2, form: 'word',
    draw: () => { const b = pick([40, 60, 80, 100]), h = pick([30, 40, 50]), L = pick([100, 150, 200, 250]); const l = (b * h * L) / 2 / 1000; return dp(l, 1) ? { b, h, L, l } : null; },
    make: ({ b, h, L, l }) => ({
      question: `A feeding trough for calves is a prism. Its ends are triangles with a base of ${b} cm and a height of ${h} cm. The trough is ${L} cm long. How many litres of water can it hold when full? (1 litre = 1,000 cm³)`,
      answer: l,
      wrong: [[(b * h * L) / 1000, 'The end of the trough is a triangle, so its area is half of base times height.'], [(b * h * L) / 2, 'That is the volume in cm³. Change it to litres.'], [(b * h * L) / 6000, 'The volume of a prism is the area of the end times the length. The one third is for a pyramid.'], [(b * h * L) / 200, 'To change cm³ to litres, divide by 1,000.']],
      hints: ['Volume of a prism = area of the end × length.', 'The end is a triangle.'],
      steps: [`End: ½ × ${b} × ${h} = ${T((b * h) / 2)} cm².`, `Volume: ${T((b * h) / 2)} × ${L} = ${T((b * h * L) / 2)} cm³.`, `Litres: ${T((b * h * L) / 2)} ÷ 1,000 = ${T(l)}.`] }),
    check: ({ b, h, L }, a) => a * 1000 * 2 === b * h * L }),

  fam({ id: 'g9.vol.prism-pool', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.a', rung: 3, form: 'steps',
    draw: () => ({ d1: pick([1, 1.5]), d2: pick([2.5, 3, 3.5]), len: pick([10, 20, 25]), w: pick([5, 8, 10]) }),
    make: ({ d1, d2, len, w }) => {
      const side = ((d1 + d2) / 2) * len, vol = side * w;
      return { question: `A swimming pool is a prism, ${w} m wide. Its floor slopes. The depth is ${d1} m at the shallow end and ${d2} m at the deep end. The pool is ${len} m long. The side wall of the pool is a trapezium.`,
        parts: [
          { prompt: 'Area of the side wall, in m²:', answer: side, unit: 'm²', hint: 'Trapezium: half of the sum of the parallel sides times the distance between them. The parallel sides are the two depths.', wrong: [[d1 * len + d2 * len, 'Take the average of the two depths first, or use half of the sum of the two depths.'], [(d1 + d2) * len, 'The area of a trapezium has a half in it.']] },
          { prompt: 'Volume of the pool, in m³:', answer: vol, unit: 'm³', hint: 'Area of the side × width.', wrong: [[side * len, 'The pool is as wide as the width given. Multiply by the width.'], [side, 'That is the area of one wall. Multiply by the width to get a volume.']] },
          { prompt: 'Litres of water when full (1 m³ = 1,000 litres):', answer: vol * 1000, unit: 'litres', hint: 'Multiply by 1,000.', wrong: [[vol * 100, '1 m³ is 1,000 litres, not 100.'], [vol / 1000, 'A cubic metre is a lot of litres. Multiply, do not divide.']] },
        ],
        hints: ['The pool is a prism lying on its side. Its cross-section is the trapezium.'],
        steps: [`Side: ½ × (${d1} + ${d2}) × ${len} = ${T(side)} m².`, `Volume: ${T(side)} × ${w} = ${T(vol)} m³.`, `Litres: ${T(vol)} × 1,000 = ${T(vol * 1000)}.`] };
    },
    check: ({ d1, d2, len, w }, v) => Math.abs(v[0] - ((d1 + d2) * len) / 2) < 1e-9 && v[1] === v[0] * w && v[2] === v[1] * 1000 }),

  fam({ id: 'g9.vol.prism-spot', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.a', rung: 2, form: 'spot',
    draw: () => { const b = pick([40, 60, 80, 100]), h = pick([30, 40, 50]), L = pick([100, 150, 200]); return { b, h, L, kind: pick(['half', 'times', 'litres']), who: person() }; },
    make: ({ b, h, L, kind, who }) => {
      const area = kind === 'half' ? b * h : (b * h) / 2;
      const vol = kind === 'times' ? area + L : area * L, lit = kind === 'litres' ? vol / 100 : vol / 1000;
      return { question: `${who.name} is asked how many litres a water tank holds. It is a prism ${L} cm long. Each end is a triangle with a base of ${b} cm and a height of ${h} cm. The working is shown. Which step has the mistake?`,
        working: [
          { text: kind === 'half' ? `Area of the end = ${b} × ${h} = ${T(area)} cm²` : `Area of the end = ½ × ${b} × ${h} = ${T(area)} cm²`, ok: area === (b * h) / 2 },
          { text: kind === 'times' ? `Volume = ${T(area)} + ${L} = ${T(vol)} cm³` : `Volume = ${T(area)} × ${L} = ${T(vol)} cm³`, ok: vol === area * L },
          { text: kind === 'litres' ? `Litres = ${T(vol)} ÷ 100 = ${T(lit)}` : `Litres = ${T(vol)} ÷ 1,000 = ${T(lit)}`, ok: lit === vol / 1000 },
        ],
        fix: kind === 'half' ? 'The area of a triangle is half of base times height. The half is missing.' : kind === 'times' ? 'The volume of a prism is the area of the end times the length, not plus.' : 'There are 1,000 cm³ in a litre, so divide by 1,000.',
        steps: [`End: ½ × ${b} × ${h} = ${T((b * h) / 2)} cm².`, `Volume: ${T((b * h) / 2)} × ${L} = ${T((b * h * L) / 2)} cm³, which is ${T((b * h * L) / 2000)} litres.`] };
    } }),

  fam({ id: 'g9.vol.pyramid-third', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.b', rung: 1, form: 'word',
    draw: () => ({ v: pick([120, 180, 240, 300, 450, 600]), what: pick(['tank', 'store', 'bin']) }),
    make: ({ v, what }) => ({
      question: `Two ${what}s have the same square base and the same height. One is a cuboid and holds ${v} litres. The other is a pyramid. How many litres does the pyramid ${what} hold?`,
      answer: v / 3,
      wrong: [[v / 2, 'A pyramid takes up one third of the prism with the same base and height, not one half.'], [v, 'The pyramid comes to a point at the top, so it holds less than the cuboid.'], [v * 3, 'The pyramid holds less than the cuboid, not more.'], [(2 * v) / 3, 'That is the amount the pyramid is missing. The pyramid is one third of the cuboid.']],
      hints: ['A pyramid is one third of the prism with the same base and height.', 'Divide the cuboid volume to get the pyramid volume.'],
      steps: [`A pyramid is ⅓ of the cuboid.`, `${v} ÷ 3 = ${v / 3} litres.`] }),
    check: ({ v }, a) => a * 3 === v }),

  fam({ id: 'g9.vol.pyramid-height', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.b', rung: 3, form: 'word',
    draw: () => { const b = pick([3, 5, 6, 9, 10, 12]), h = pick([4, 6, 9, 12, 15]); const v = (b * b * h) / 3; return Number.isInteger(v) ? { b, h, v } : null; },
    make: ({ b, h, v }) => ({
      question: `A monument is made of ${T(v)} m³ of concrete. It is a solid pyramid standing on a ${b} m by ${b} m square. How tall is the monument, in metres?`,
      answer: h,
      wrong: [[round(v / (b * b), 2), 'The volume of a pyramid has a one third in it. Multiply by 3 before dividing.'], [round((3 * v) / b, 2), 'The base area is the side times the side, so divide by b × b.'], [round(v * 3 * b * b, 2), 'To find the height you divide the volume by the base area. Do not multiply.'], [round(v / 3 / b, 2), 'You need to multiply the volume by 3 and divide by the base area.']],
      hints: ['Volume = ⅓ × base area × height.', 'Work backwards: multiply the volume by 3, then divide by the base area.'],
      steps: [`Base area: ${b} × ${b} = ${b * b} m².`, `${T(v)} = ⅓ × ${b * b} × h, so h = ${T(v)} × 3 ÷ ${b * b} = ${h} m.`] }),
    check: ({ b, v }, a) => (b * b * a) / 3 === v }),

  fam({ id: 'g9.vol.cone-sand', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.c', rung: 3, form: 'word',
    draw: () => { const h = pick([3, 6, 9, 12]); return { r: 7, h, cap: 14, who: person() }; },
    make: ({ r, h, cap, who }) => {
      const v = round((PI * r * r * h) / 3, 2);
      return { question: `A heap of sand is a cone with a radius of ${r} m and a height of ${h} m. ${who.name} hires a lorry that carries ${cap} m³ of sand each trip. How many trips are needed to move all the sand? (Use π = 22/7)`,
        answer: v / cap,
        wrong: [[round((PI * r * r * h) / cap, 2), 'A cone is one third of a cylinder with the same base and height. Remember the ⅓.'], [round((PI * r * r * h) / 3 / cap / 2, 2), 'Check the radius. The base area is π × r × r.'], [v, 'That is the volume of the heap in m³. Divide by the load of each trip.'], [round((PI * (2 * r) * (2 * r) * h) / 3 / cap, 2), 'The radius is given, not the diameter. Do not double it.']],
        hints: ['First find the volume of the cone.', 'Then divide by the amount in one trip.'],
        steps: [`Volume: ⅓ × 22/7 × ${r} × ${r} × ${h} = ${T(v)} m³.`, `Trips: ${T(v)} ÷ ${cap} = ${T(v / cap)}.`] };
    },
    check: ({ r, h, cap }, a) => Math.abs((a * cap * 3) / h - (22 / 7) * r * r) < 0.01 }),

  fam({ id: 'g9.vol.bucket-frustum', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.d', rung: 3, form: 'steps',
    draw: () => ({ h: pick([18, 24, 30]), who: person() }),
    make: ({ h, who }) => {
      const H = 2 * h, big = round((PI * 14 * 14 * H) / 3, 2), small = round((PI * 7 * 7 * h) / 3, 2), bucket = round(big - small, 2);
      return { question: `${who.name}'s bucket is a cone with its pointed end cut off. The cone it was cut from has a radius of 14 cm at the top and a height of ${H} cm. The piece cut off is a small cone with a radius of 7 cm and a height of ${h} cm. Use π = 22/7.`,
        parts: [
          { prompt: 'Volume of the whole cone, in cm³:', answer: big, unit: 'cm³', hint: 'Volume of a cone = ⅓ × π × r × r × height.', wrong: [[round(PI * 14 * 14 * H, 2), 'A cone has one third of the volume of a cylinder.'], [round((PI * 7 * 7 * H) / 3, 2), 'Use the radius of the big cone, 14 cm.']] },
          { prompt: 'Volume of the small cone that was cut off, in cm³:', answer: small, unit: 'cm³', hint: 'Use its own radius and its own height.', wrong: [[round((PI * 7 * 7 * H) / 3, 2), 'The small cone is only as tall as the piece cut off.'], [round((PI * 14 * 14 * h) / 3, 2), 'The small cone has a radius of 7 cm.']] },
          { prompt: 'Volume of the bucket, in cm³:', answer: bucket, unit: 'cm³', hint: 'Take the small cone away from the whole cone.', wrong: [[round(big + small, 2), 'The small cone was cut away, so take it away.'], [big, 'The cut-off piece is not part of the bucket.']] },
          { prompt: 'How many litres does the bucket hold? (1 litre = 1,000 cm³)', answer: bucket / 1000, unit: 'litres', hint: 'Divide by 1,000.', wrong: [[bucket / 100, 'There are 1,000 cm³ in a litre.'], [bucket * 1000, 'Divide, because a litre is bigger than a cm³.']] },
        ],
        hints: ['Bucket = whole cone minus the cut-off cone.'],
        steps: [`Whole cone: ⅓ × 22/7 × 14 × 14 × ${H} = ${T(big)} cm³.`, `Small cone: ⅓ × 22/7 × 7 × 7 × ${h} = ${T(small)} cm³.`, `Bucket: ${T(big)} − ${T(small)} = ${T(bucket)} cm³.`, `Litres: ${T(bucket)} ÷ 1,000 = ${T(bucket / 1000)}.`] };
    },
    check: ({ h }, v) => Math.abs(v[0] - v[1] * 8) < 0.01 && Math.abs(v[2] - (v[0] - v[1])) < 0.01 && Math.abs(v[3] * 1000 - v[2]) < 0.01 && Math.abs(v[1] - (22 / 7 / 3) * 49 * h) < 0.01 }),

  fam({ id: 'g9.vol.frustum-scale', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.d', rung: 3, form: 'word',
    draw: () => { const k = pick([2, 3]), m = pick([10, 20, 30, 40, 50]); return { k, v: k ** 3 * m, who: person() }; },
    make: ({ k, v, who }) => {
      const small = v / k ** 3;
      return { question: `${who.name} makes a bucket by cutting the pointed end off a cone. The whole cone would hold ${T(v)} cm³ of water. The piece cut off is a small cone of the same shape, only ${k === 2 ? 'half' : 'one third'} as tall as the whole cone. How many cm³ does the bucket hold?`,
        answer: v - small,
        wrong: [[v - v / k, 'The small cone is smaller than that. Volumes change by the scale factor cubed.'], [v - v / k ** 2, `Area changes by the scale factor squared, but volume changes by the scale factor cubed.`], [small, 'That is the volume of the piece cut off. The bucket is what is left.'], [v, 'The small cone has been cut off, so it is not part of the bucket.']],
        hints: ['Similar solids: the volume is multiplied by the scale factor cubed.', 'Bucket = whole cone minus the small cone.'],
        steps: [`The small cone is ${k === 2 ? 'half' : 'one third'} as tall, so its volume is 1/${k ** 3} of the whole.`, `Small cone: ${T(v)} ÷ ${k ** 3} = ${T(small)} cm³.`, `Bucket: ${T(v)} − ${T(small)} = ${T(v - small)} cm³.`] };
    },
    check: ({ k, v }, a) => a * k ** 3 === v * (k ** 3 - 1) }),

  fam({ id: 'g9.vol.hemisphere-bowl', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.e', rung: 2, form: 'word',
    draw: () => ({ r: pick([10.5, 21]), what: pick(['gourd bowl', 'wooden bowl', 'clay pot']) }),
    make: ({ r, what }) => {
      const v = round((2 / 3) * PI * r ** 3, 2), full = round((4 / 3) * PI * r ** 3, 2);
      return { question: `A ${what} is exactly half of a ball. From the middle of its flat top to the rim is ${r} cm. How many cm³ of porridge does it hold when full? Use π = 22/7.`,
        answer: v,
        wrong: [[full, 'That is the volume of a whole sphere. The bowl is half of one.'], [round((2 / 3) * PI * r * r, 2), 'Volume needs the radius three times: r × r × r.'], [round(PI * r ** 3 * 2, 2), 'A sphere is ⁴⁄₃ π r³. Half of that is ⅔ π r³.'], [round(PI * r * r * r / 3, 2), 'The sphere has ⁴⁄₃ π r³, so the half has ⅔ π r³, not ⅓.']],
        hints: ['A sphere has volume ⁴⁄₃ π r³.', 'The bowl is half of that.'],
        steps: [`Whole sphere: ⁴⁄₃ × 22/7 × ${r}³ = ${T(full)} cm³.`, `Half: ${T(full)} ÷ 2 = ${T(v)} cm³.`] };
    },
    check: ({ r }, a) => Math.abs(a * 2 - (4 / 3) * (22 / 7) * r ** 3) < 0.02 }),

  fam({ id: 'g9.vol.sphere-recast', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.e', rung: 3, form: 'word',
    draw: () => { const [R, r] = pick([[6, 3], [9, 3], [12, 3], [15, 3], [4, 2], [6, 2], [8, 2], [10, 5]]); return { R, r }; },
    make: ({ R, r }) => ({
      question: `A metalworker melts one solid metal sphere of radius ${R} cm. The metal is cast into small solid spheres of radius ${r} cm. No metal is lost. How many small spheres can be made?`,
      answer: (R / r) ** 3,
      wrong: [[R / r, 'The radius is ' + (R / r) + ' times bigger, but the volume grows with the radius three times over.'], [(R / r) ** 2, 'That compares surface areas. Compare volumes, which use r × r × r.'], [R ** 3 - r ** 3, 'Divide the big volume by the small volume. Do not subtract.'], [(R - r) ** 3, 'Divide the volume of the big sphere by the volume of a small one.']],
      hints: ['The metal keeps the same volume. Compare the volume of the big sphere with the volume of one small sphere.', 'Volume of a sphere = ⁴⁄₃ π r³. The ⁴⁄₃ π cancels.'],
      steps: [`Big sphere: ⁴⁄₃ π × ${R}³. Small sphere: ⁴⁄₃ π × ${r}³.`, `Number = ${R}³ ÷ ${r}³ = ${R ** 3} ÷ ${r ** 3} = ${(R / r) ** 3}.`] }),
    check: ({ R, r }, a) => a * r ** 3 === R ** 3 }),

  // ======================================================== MASS, WEIGHT AND DENSITY
  fam({ id: 'g9.density.lorry-weighbridge', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.a', rung: 2, form: 'word',
    draw: () => { const gross = pick([14.5, 18.5, 22.4, 25.6, 28.3]), empty = pick([5200, 6200, 6800, 7500, 8400]); return gross * 1000 > empty + 2000 ? { gross, empty } : null; },
    make: ({ gross, empty }) => {
      const load = round((gross * 1000 - empty) / 1000, 3);
      return { question: `A lorry and its load are weighed at a weighbridge. The scale shows ${gross} tonnes. The empty lorry has a mass of ${T(empty)} kg. Find the mass of the load in tonnes.`,
        answer: load,
        wrong: [[round(gross - empty, 3), 'The two masses are in different units. Change them to the same unit first.'], [round(gross - empty / 100, 3), 'There are 1,000 kg in a tonne, not 100.'], [round(gross * 1000 - empty, 1), 'That is the load in kg. The question asks for tonnes.'], [round(gross + empty / 1000, 3), 'The scale already includes the lorry. Take the lorry away.']],
        hints: ['Write both masses in the same unit.', '1 tonne = 1,000 kg.'],
        steps: [`Empty lorry: ${T(empty)} kg = ${T(empty / 1000)} tonnes.`, `Load: ${gross} − ${T(empty / 1000)} = ${T(load)} tonnes.`] };
    },
    check: ({ gross, empty }, a) => Math.abs(a * 1000 + empty - gross * 1000) < 0.01 }),

  fam({ id: 'g9.density.load-table', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.a', rung: 2, form: 'table',
    draw: () => {
      const items = [['maize', 90], ['beans', 50], ['sugar', 50], ['cement', 50], ['rice', 25]].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = items.map(([n, m]) => ({ n, m, c: pick([10, 20, 30, 40, 50, 60]) }));
      const tot = rows.reduce((a, r) => a + r.c * r.m, 0);
      return dp(tot / 1000, 2) && tot > 1500 ? { rows, tot } : null;
    },
    make: ({ rows, tot }) => ({
      question: 'The table shows the bags on a lorry. Find the total mass of the load in tonnes.',
      model: { type: 'table', data: { head: ['Goods', 'Number of bags', 'Mass of one bag (kg)'], rows: rows.map(r => ({ cells: [`Bags of ${r.n}`, String(r.c), String(r.m)] })) } },
      answer: tot / 1000,
      wrong: [[tot, 'That is the total in kg. Change it to tonnes.'], [round(rows.reduce((a, r) => a + r.m, 0) / 1000, 3), 'That adds the masses of one bag of each. Multiply by the number of bags first.'], [round(rows.reduce((a, r) => a + r.c, 0) / 1000, 3), 'That adds the number of bags. Each bag has a mass to be used.'], [round(rows.reduce((a, r) => a + r.c * r.m, 0) / 100, 2), 'There are 1,000 kg in a tonne.']],
      hints: ['Find the mass of each kind of bag: number × mass of one.', 'Add them, then change kg to tonnes.'],
      steps: [...rows.map(r => `${r.n}: ${r.c} × ${r.m} = ${T(r.c * r.m)} kg.`), `Total: ${T(tot)} kg = ${T(tot / 1000)} tonnes.`] }),
    check: ({ rows }, a) => Math.abs(a * 1000 - rows.reduce((t, r) => t + r.m * r.c, 0)) < 0.01 }),

  fam({ id: 'g9.density.weight-newtons', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.b', rung: 1, form: 'word',
    draw: () => ({ m: pick([5, 12, 25, 40, 50, 65, 90]), what: pick(['bag of cement', 'sack of maize flour', 'jerrican of water', 'bag of fertiliser']) }),
    make: ({ m, what }) => ({
      question: `A ${what} has a mass of ${m} kg. Each kilogram is pulled down with a force of 10 N (gravity g = 10 N/kg). What is the weight of the ${what}, in newtons?`,
      answer: m * 10,
      wrong: [[m / 10, 'Weight in newtons is bigger than the mass in kg here. Multiply by 10.'], [m, 'That is the mass in kg. Weight is a force in newtons.'], [m + 10, 'Each kilogram has a weight of 10 N, so multiply.']],
      hints: ['Weight = mass × gravity.', 'Each kilogram weighs 10 N.'],
      steps: [`Weight = mass × g.`, `${m} × 10 = ${m * 10} N.`] }),
    check: ({ m }, a) => a / 10 === m }),

  fam({ id: 'g9.density.weight-moon', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.b', rung: 3, form: 'why',
    draw: () => ({ w: pick([60, 80, 100, 120, 150]) }),
    make: ({ w }) => {
      const m = w / 10, mw = round(1.6 * m, 2);
      return { question: `A rock weighs ${w} N on Earth, where g = 10 N/kg. The rock is taken to the Moon, where g = 1.6 N/kg. Which statement is true on the Moon?`,
        options: [
          { text: `Its mass is ${m} kg and its weight is ${T(mw)} N`, right: true },
          { text: `Its mass is ${m} kg and its weight is still ${w} N`, right: false, why: 'Weight is a pull from gravity. The Moon pulls less, so the weight changes.' },
          { text: `Its mass is ${T(mw)} kg and its weight is ${T(mw)} N`, right: false, why: 'Mass is the amount of matter. It does not change when the rock moves.' },
          { text: `Its mass is ${T(round(w / 1.6, 2))} kg and its weight is ${w} N`, right: false, why: 'Mass stays the same everywhere. Find it on Earth: weight ÷ 10.' },
        ],
        hints: ['Mass stays the same wherever the rock is. Weight depends on gravity.', 'Mass = weight ÷ g, using the gravity on Earth.'],
        steps: [`On Earth: mass = ${w} ÷ 10 = ${m} kg. Mass does not change.`, `On the Moon: weight = ${m} × 1.6 = ${T(mw)} N.`] };
    } }),

  fam({ id: 'g9.density.find-volume', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.c', rung: 2, form: 'word',
    draw: () => { const [name, rho] = pick([['aluminium', 2.7], ['iron', 7.8], ['copper', 8.9], ['lead', 11.3]]); const v = pick([20, 50, 80, 100, 150, 200]); const m = round(rho * v, 1); return dp(m, 1) ? { name, rho, v, m } : null; },
    make: ({ name, rho, v, m }) => ({
      question: `A blacksmith holds a lump of ${name}. It has a mass of ${T(m)} g. The density of ${name} is ${rho} g/cm³. How much space does the lump take up, in cm³?`,
      answer: v,
      wrong: [[round(m * rho, 1), 'Volume = mass ÷ density. Multiplying gives a mass, not a volume.'], [round(rho / m, 4), 'That is density ÷ mass, upside down.'], [round(m - rho, 1), 'Mass and density are not found by subtraction. Divide.']],
      hints: ['Density = mass ÷ volume.', 'Rearrange it to find the volume.'],
      steps: [`Density = mass ÷ volume, so volume = mass ÷ density.`, `${T(m)} ÷ ${rho} = ${v} cm³.`] }),
    check: ({ rho, m }, a) => Math.abs(rho * a - m) < 0.01 }),

  fam({ id: 'g9.density.convert-units', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.c', rung: 2, form: 'direct',
    draw: () => { const [rho, what] = pick([[0.8, 'Paraffin'], [0.92, 'A cooking oil'], [1.03, 'Fresh milk'], [2.7, 'Aluminium'], [7.8, 'Iron'], [0.6, 'A kind of wood']]); return { rho, what, toKg: pick([true, false]) }; },
    make: ({ rho, toKg, what }) => {
      const kg = round(rho * 1000, 1);
      return toKg
        ? { question: `${what} has a density of ${rho} g/cm³. Write its density in kg/m³.`, story: false, answer: kg,
            wrong: [[round(rho / 1000, 6), 'A kg/m³ number is bigger than the g/cm³ number. Multiply, do not divide.'], [round(rho * 1000000, 1), 'A g/cm³ is 1,000 kg/m³. 1,000,000 is the number of cm³ in a m³, but grams change to kg as well.'], [round(rho * 100, 1), '1 m³ has 1,000,000 cm³ and 1 kg has 1,000 g. The change is 1,000 times.']],
            hints: ['1 m³ = 1,000,000 cm³ and 1 kg = 1,000 g.', 'So the number is multiplied by 1,000.'], steps: [`1 g/cm³ = 1,000 kg/m³.`, `${rho} × 1,000 = ${T(kg)} kg/m³.`] }
        : { question: `${what} has a density of ${T(kg)} kg/m³. Write its density in g/cm³.`, story: false, answer: rho,
            wrong: [[round(kg * 1000, 1), 'A g/cm³ number is smaller than the kg/m³ number. Divide, do not multiply.'], [round(kg / 100, 2), '1 g/cm³ is 1,000 kg/m³, so divide by 1,000.'], [round(kg / 1000000, 6), 'The change is 1,000 times, not 1,000,000 times.']],
            hints: ['1 g/cm³ = 1,000 kg/m³.', 'Divide by 1,000.'], steps: [`${T(kg)} ÷ 1,000 = ${rho} g/cm³.`, 'Check: 1 g/cm³ is the density of water, 1,000 kg/m³.'] };
    },
    check: ({ rho, toKg }, a) => (toKg ? Math.abs(a / 1000 - rho) < 1e-9 : Math.abs(a - rho) < 1e-9) }),

  fam({ id: 'g9.density.iron-block', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.c', rung: 2, form: 'steps',
    draw: () => { const [name, rho] = pick([['iron', 7.8], ['aluminium', 2.7], ['copper', 8.9]]); const l = pick([10, 20, 25]), w = pick([4, 5, 10]), h = pick([2, 4, 5]); const m = round(rho * l * w * h, 1); return dp(m / 1000, 3) ? { name, rho, l, w, h, m } : null; },
    make: ({ name, rho, l, w, h, m }) => ({
      question: `${name[0].toUpperCase() + name.slice(1)} is cast into a cuboid ${l} cm long, ${w} cm wide and ${h} cm high. Its density is ${rho} g/cm³.`,
      parts: [
        { prompt: 'Volume of the block, in cm³:', answer: l * w * h, unit: 'cm³', hint: 'Length × width × height.', wrong: [[l + w + h, 'Volume is found by multiplying the three sides.']] },
        { prompt: 'Mass of the block, in grams:', answer: m, unit: 'g', hint: 'Mass = density × volume.', wrong: [[round((l * w * h) / rho, 1), 'Density is mass ÷ volume, so mass is density × volume.'], [l * w * h, 'That is the volume. Multiply it by the density.']] },
        { prompt: 'Mass of the block, in kg:', answer: m / 1000, unit: 'kg', hint: '1 kg = 1,000 g.', wrong: [[m * 1000, 'A kg is bigger than a gram. Divide.'], [m / 100, 'There are 1,000 g in a kg.']] },
      ],
      hints: ['Volume first, then mass = density × volume.'],
      steps: [`Volume: ${l} × ${w} × ${h} = ${l * w * h} cm³.`, `Mass: ${rho} × ${l * w * h} = ${T(m)} g.`, `In kg: ${T(m)} ÷ 1,000 = ${T(m / 1000)} kg.`] }),
    check: ({ rho, l, w, h }, v) => v[0] === l * w * h && Math.abs(v[1] / v[0] - rho) < 1e-6 && Math.abs(v[2] * 1000 - v[1]) < 1e-6 }),

  fam({ id: 'g9.density.sample-table', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.c', rung: 3, form: 'table',
    draw: () => {
      const mats = [['wood', 0.6], ['glass', 2.5], ['aluminium', 2.7], ['iron', 7.8], ['copper', 8.9], ['lead', 11.3]].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = mats.map(([n, r]) => { const v = pick([20, 50, 100, 200]); return { n, r, v, m: round(r * v, 1) }; });
      if (rows.some(x => !dp(x.m, 1))) return null;
      const top = rows.reduce((a, b) => (b.r > a.r ? b : a)), heavy = rows.reduce((a, b) => (b.m > a.m ? b : a));
      return top === heavy ? null : { rows, top };
    },
    make: ({ rows, top }) => ({
      question: 'A learner measures three samples. The table shows the mass and volume of each. Which sample has the greatest density?',
      model: { type: 'table', data: { head: ['Sample', 'Mass (g)', 'Volume (cm³)'], rows: rows.map(x => ({ cells: [x.n[0].toUpperCase() + x.n.slice(1), T(x.m), String(x.v)] })) } },
      options: rows.map(x => ({ text: x.n[0].toUpperCase() + x.n.slice(1), right: x === top, why: x === top ? undefined : x.m === Math.max(...rows.map(y => y.m)) ? 'It has the biggest mass, but it also has a big volume. Density is mass ÷ volume.' : 'Work out mass ÷ volume for each sample and compare.' })),
      hints: ['Density = mass ÷ volume. Work it out for every row.', 'The biggest mass is not always the biggest density.'],
      steps: rows.map(x => `${x.n}: ${T(x.m)} ÷ ${x.v} = ${x.r} g/cm³.`).concat([`The greatest is ${top.n}.`]) }) }),

  fam({ id: 'g9.density.float-sink-why', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.d', rung: 2, form: 'why',
    draw: () => { const rho = pick([0.6, 0.8, 0.9, 1.2, 2.5, 7.8]), v = pick([20, 50, 100]); return { rho, v, m: round(rho * v, 1), who: person() }; },
    make: ({ rho, v, m, who }) => {
      const floats = rho < 1, opp = floats ? 'sinks' : 'floats', same = floats ? 'floats' : 'sinks';
      return { question: `${who.name} lowers a block into a basin of water. The block has a mass of ${T(m)} g and a volume of ${v} cm³. Water has a density of 1 g/cm³. Choose the best explanation.`,
        options: [
          { text: `It ${same}, because its density is ${rho} g/cm³, which is ${floats ? 'less' : 'more'} than water`, right: true },
          { text: `It ${opp}, because an object ${floats ? 'with a low density' : 'with a high density'} ${opp}`, right: false, why: 'An object floats when it is less dense than the liquid, and sinks when it is denser.' },
          { text: `It ${same}, because its mass of ${T(m)} g is ${floats ? 'small' : 'large'}`, right: false, why: 'Mass alone does not decide it. A big ship floats and a small pin sinks. Compare densities.' },
          { text: `It ${opp}, because its volume of ${v} cm³ is ${floats ? 'large' : 'small'}`, right: false, why: 'Volume alone does not decide it. Find the density, which uses both mass and volume.' },
        ],
        hints: ['Work out the density of the block: mass ÷ volume.', 'Compare it with the density of water.'],
        steps: [`Density = ${T(m)} ÷ ${v} = ${rho} g/cm³.`, `Water is 1 g/cm³. The block is ${floats ? 'less' : 'more'} dense, so it ${same}.`] };
    } }),

  fam({ id: 'g9.density.ice-volume', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.d', rung: 3, form: 'word',
    draw: () => ({ m: pick([90, 180, 270, 450, 540, 720]), who: person() }),
    make: ({ m, who }) => {
      const ice = m / 0.9;
      return { question: `A tray holds ${m} g of water. ${who.name} puts it in a freezer and it turns to ice. 1 cm³ of ice has a mass of 0.9 g. How many cm³ does the ice fill?`,
        answer: ice,
        wrong: [[m, 'The water takes up this much space. Ice is less dense, so the same mass takes more space.'], [round(m * 0.9, 1), 'Volume = mass ÷ density. Multiplying by the density does not give a volume.'], [round(m / 1.1, 1), 'The density of ice is 0.9 g/cm³. Divide by 0.9.'], [round(m - 0.9, 1), 'Divide the mass by the density. Do not subtract.']],
        hints: ['The mass stays the same when water freezes.', 'Volume = mass ÷ density.'],
        steps: [`Mass of ice: ${m} g.`, `Volume = ${m} ÷ 0.9 = ${T(ice)} cm³.`] };
    },
    check: ({ m }, a) => Math.abs(a * 0.9 - m) < 0.01 }),

  fam({ id: 'g9.density.liquid-mix', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.d', rung: 3, form: 'word',
    draw: () => { const r1 = pick([0.8, 0.9]), r2 = pick([1, 1.1, 1.2]), v1 = pick([100, 200, 300]), v2 = pick([100, 200, 300]); const d = (r1 * v1 + r2 * v2) / (v1 + v2); return v1 !== v2 && dp(d, 2) ? { r1, r2, v1, v2 } : null; },
    make: ({ r1, r2, v1, v2 }) => {
      const m = round(r1 * v1 + r2 * v2, 2), d = round(m / (v1 + v2), 2);
      return { question: `A learner pours ${v1} cm³ of oil with a density of ${r1} g/cm³ into a jar. Then ${v2} cm³ of salt water with a density of ${r2} g/cm³ is added. Find the mean density of the two liquids together, in g/cm³.`,
        answer: d,
        wrong: [[round((r1 + r2) / 2, 2), 'The amounts are different, so you cannot just average the two densities. Use total mass ÷ total volume.'], [m, 'That is the total mass. Divide it by the total volume.'], [round(m / v1, 2), 'Divide by the volume of both liquids together.'], [round(r1 * v1 / (v1 + v2) + r2, 2), 'Find the mass of each liquid first. Then add the masses and divide by the total volume.']],
        hints: ['Find the mass of each liquid: density × volume.', 'Mean density = total mass ÷ total volume.'],
        steps: [`Oil: ${r1} × ${v1} = ${T(round(r1 * v1, 2))} g. Salt water: ${r2} × ${v2} = ${T(round(r2 * v2, 2))} g.`, `Total mass: ${T(m)} g. Total volume: ${v1 + v2} cm³.`, `Density: ${T(m)} ÷ ${v1 + v2} = ${T(d)} g/cm³.`] };
    },
    check: ({ r1, r2, v1, v2 }, a) => Math.abs(a * (v1 + v2) - (r1 * v1 + r2 * v2)) < 0.011 }),

  fam({ id: 'g9.density.stone-cylinder', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.d', rung: 2, form: 'steps',
    draw: () => { const rho = pick([2.5, 2.7, 3]), rise = pick([20, 30, 40]), start = pick([50, 60, 80]), chip = pick([10, 20, 50]); return { rho, rise, start, chip, m: round(rho * rise, 1), who: person() }; },
    make: ({ rho, rise, start, chip, m, who }) => ({
      question: `${who.name} drops a stone with a mass of ${T(m)} g into a measuring cylinder holding ${start} cm³ of water. The stone sinks. The water level rises to ${start + rise} cm³.`,
      parts: [
        { prompt: 'Volume of the stone, in cm³:', answer: rise, unit: 'cm³', hint: 'The stone pushes aside its own volume of water.', wrong: [[start + rise, 'That is the final reading, which includes the water.'], [start, 'That is the water at the start.']] },
        { prompt: 'Density of the stone, in g/cm³:', answer: rho, unit: 'g/cm³', hint: 'Mass ÷ volume.', wrong: [[round(rise / m, 3), 'Density is mass ÷ volume, not the other way round.'], [round(m / (start + rise), 3), 'Use the volume of the stone only, not the final reading.']] },
        { prompt: `Mass of a chip of the same stone with a volume of ${chip} cm³, in grams:`, answer: round(rho * chip, 2), unit: 'g', hint: 'Mass = density × volume.', wrong: [[round(chip / rho, 2), 'Mass = density × volume.'], [m, 'That is the mass of the first stone.']] },
      ],
      hints: ['The rise in the water level is the volume of the stone.'],
      steps: [`Volume: ${start + rise} − ${start} = ${rise} cm³.`, `Density: ${T(m)} ÷ ${rise} = ${rho} g/cm³.`, `Chip: ${rho} × ${chip} = ${T(round(rho * chip, 2))} g.`] }),
    check: ({ rho, rise, start, chip }, v) => v[0] === rise && Math.abs(v[1] * v[0] - rho * rise) < 1e-6 && Math.abs(v[2] / chip - v[1]) < 1e-6 }),

  // ======================================================== SPEED
  fam({ id: 'g9.speed.stage-table', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.a', rung: 2, form: 'table',
    draw: () => {
      const rs = [...ROADS].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = rs.map(([a, b, d]) => { const v = pick([40, 45, 50, 60, 75, 80]); return { a, b, d, v, min: (d / v) * 60 }; });
      if (rows.some(r => !Number.isInteger(r.min)) || new Set(rows.map(r => r.v)).size < 3) return null;
      return { rows, k: randInt(0, 2) };
    },
    make: ({ rows, k }) => {
      const r = rows[k], other = rows[(k + 1) % 3];
      return { question: `The table shows the stages of a bus journey. Find the speed of the bus on the stage from ${r.a} to ${r.b}, in km/h.`,
        model: { type: 'table', data: { head: ['Stage', 'Distance (km)', 'Time (minutes)'], rows: rows.map(x => ({ cells: [`${x.a} to ${x.b}`, String(x.d), String(x.min)] })) } },
        answer: r.v,
        wrong: [[round(r.d / r.min, 2), 'That is the speed in km per minute. The question asks for km per hour.'], [round(r.d / (r.min / 100), 1), 'An hour is not made of 100 minutes. Change the minutes to hours before dividing.'], [other.v, 'That is the speed on a different stage. Check you read the right row.'], [r.min, 'That is the time in minutes. Speed = distance ÷ time.']],
        hints: ['Speed = distance ÷ time, with the time in hours.', 'Change minutes to hours by dividing by 60.'],
        steps: [`The time is ${r.min} minutes. There are 60 minutes in an hour, so speed = distance × 60 ÷ minutes.`, `${r.d} × 60 ÷ ${r.min} = ${r.v} km/h.`] };
    },
    check: ({ rows, k }, a) => Math.abs((a * rows[k].min) / 60 - rows[k].d) < 1e-6 }),

  fam({ id: 'g9.speed.meet-on-road', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.a', rung: 3, form: 'steps',
    draw: () => { const [a, b, D] = pick(ROADS.filter(r => r[2] >= 120)); const v1 = pick([40, 50, 60, 70, 80]), v2 = pick([60, 70, 80, 90, 100]); const t = D / (v1 + v2); return v1 !== v2 && Math.abs(t * 2 - Math.round(t * 2)) < 1e-9 ? { a, b, D, v1, v2 } : null; },
    make: ({ a, b, D, v1, v2 }) => {
      const t = D / (v1 + v2);
      return { question: `A bus leaves ${a} for ${b} at ${v1} km/h. At the same moment a matatu leaves ${b} for ${a} at ${v2} km/h on the same road. The road is ${D} km long. The two vehicles meet on the way.`,
        parts: [
          { prompt: 'How many km closer do they get to each other every hour?', answer: v1 + v2, unit: 'km', hint: 'They travel towards each other, so add their speeds.', wrong: [[Math.abs(v2 - v1), 'They move towards each other, so the gaps add. Do not subtract.']] },
          { prompt: 'After how many hours do they meet?', answer: t, unit: 'hours', hint: 'Time = distance ÷ speed. Use the distance between the towns and how fast they close it.', wrong: [[round(D / v1, 2), 'Both vehicles are moving. Use the speed at which the gap closes.'], [round(D / Math.abs(v2 - v1), 2), 'They are moving towards each other, so add the speeds.']] },
          { prompt: `How far from ${a} do they meet, in km?`, answer: v1 * t, unit: 'km', hint: `The bus has been travelling for the time you found.`, wrong: [[v2 * t, `That is the distance from ${b}.`], [round(D / 2, 1), 'They are not travelling at the same speed, so they do not meet half way.']] },
        ],
        hints: ['Think of the gap between the vehicles shrinking.'],
        steps: [`The gap closes by ${v1} + ${v2} = ${v1 + v2} km every hour.`, `Time: ${D} ÷ ${v1 + v2} = ${T(t)} hours.`, `Distance from ${a}: ${v1} × ${T(t)} = ${T(v1 * t)} km.`] };
    },
    check: ({ D, v1, v2 }, v) => v[0] === v1 + v2 && Math.abs(v[1] * v[0] - D) < 1e-6 && Math.abs(v[2] + v2 * v[1] - D) < 1e-6 }),

  fam({ id: 'g9.speed.journey-table', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.b', rung: 2, form: 'table',
    draw: () => {
      const d1 = pick([60, 90, 120, 150]), t1 = pick([1, 1.5, 2, 2.5, 3]), d2 = pick([60, 80, 100, 120]), t2 = pick([1, 1.5, 2, 2.5]), rest = pick([0.5, 1]);
      const avg = (d1 + d2) / (t1 + t2 + rest);
      return dp(avg, 1) && distinct(avg, (d1 + d2) / (t1 + t2), (d1 / t1 + d2 / t2) / 2) ? { d1, t1, d2, t2, rest, who: person() } : null;
    },
    make: ({ d1, t1, d2, t2, rest }) => {
      const D = d1 + d2, Tt = t1 + t2 + rest, avg = round(D / Tt, 2);
      return { question: 'A matatu makes a journey in two parts with a rest in between. The table shows the journey. Find its average speed for the whole journey, including the rest, in km/h.',
        model: { type: 'table', data: { head: ['Part', 'Distance (km)', 'Time (hours)'], rows: [{ cells: ['First part', String(d1), String(t1)] }, { cells: ['Rest', '0', String(rest)] }, { cells: ['Second part', String(d2), String(t2)] }] } },
        answer: avg,
        wrong: [[round(D / (t1 + t2), 2), 'The rest is part of the journey time. Include it.'], [round((d1 / t1 + d2 / t2) / 2, 2), 'The two parts last different times, so you cannot just average the two speeds. Use total distance ÷ total time.'], [round(D, 2), 'That is the total distance. Divide it by the total time.'], [round(Tt, 2), 'That is the total time. Average speed is distance ÷ time.']],
        hints: ['Average speed = total distance ÷ total time.', 'Add the three times, including the rest.'],
        steps: [`Total distance: ${d1} + ${d2} = ${D} km.`, `Total time: ${t1} + ${rest} + ${t2} = ${T(Tt)} hours.`, `Average speed: ${D} ÷ ${T(Tt)} = ${T(avg)} km/h.`] };
    },
    check: ({ d1, d2, t1, t2, rest }, a) => Math.abs(a * (t1 + t2 + rest) - (d1 + d2)) < 0.011 }),

  fam({ id: 'g9.speed.there-and-back-spot', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.b', rung: 3, form: 'spot',
    draw: () => { const [a, b, D] = pick(ROADS); const v1 = pick([40, 50, 80, 100]), v2 = pick([40, 50, 80, 100]); if (v1 === v2 || !dp(D / v1, 2) || !dp(D / v2, 2)) return null; return { a, b, D, v1, v2, kind: pick(['once', 'speeds']), who: person() }; },
    make: ({ a, b, D, v1, v2, kind, who }) => {
      const Tt = round(D / v1 + D / v2, 3), dist = kind === 'once' ? D : 2 * D, shown = kind === 'speeds' ? (v1 + v2) / 2 : round(dist / Tt, 1);
      return { question: `${who.name} drives from ${a} to ${b} at ${v1} km/h. ${who.She} drives back along the same road at ${v2} km/h. The road is ${D} km long. The working for the average speed of the whole trip is shown. Which step has the mistake?`,
        working: [
          { text: kind === 'once' ? `Distance there and back = ${D} km` : `Distance there and back = 2 × ${D} = ${dist} km`, ok: dist === 2 * D },
          { text: `Time = ${D} ÷ ${v1} + ${D} ÷ ${v2} = ${T(round(D / v1, 3))} + ${T(round(D / v2, 3))} = ${T(Tt)} hours`, ok: true },
          { text: kind === 'speeds' ? `Average speed = (${v1} + ${v2}) ÷ 2 = ${T(shown)} km/h` : `Average speed = ${dist} ÷ ${T(Tt)} = ${T(shown)} km/h`, ok: Math.abs(shown - dist / Tt) < 0.06 },
        ],
        fix: kind === 'once' ? 'The trip is there and back, so the total distance is the road length twice.' : 'The two parts take different times, so the speeds cannot just be averaged. Use total distance ÷ total time.',
        steps: [`Total distance: ${2 * D} km. Total time: ${T(Tt)} hours.`, `Average speed: ${2 * D} ÷ ${T(Tt)} = ${T(round((2 * D) / Tt, 1))} km/h, to 1 decimal place.`] };
    } }),

  fam({ id: 'g9.speed.whole-journey-stop', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.b', rung: 2, form: 'word',
    draw: () => {
      const [a, b, D] = pick(ROADS.filter(r => r[2] >= 150)), dep = pick([360, 390, 420, 450, 480]), span = pick([180, 210, 240, 270, 300, 360]), stop = pick([30, 60]);
      const w = D / (span / 60), m = D / ((span - stop) / 60);
      return dp(w, 1) && dp(m, 1) && distinct(w, m) ? { a, b, D, dep, span, stop } : null;
    },
    make: ({ a, b, D, dep, span, stop }) => {
      const w = round(D / (span / 60), 2), m = round(D / ((span - stop) / 60), 2);
      return { question: `A bus leaves ${a} at ${clock(dep)} in the morning. It reaches ${b}, ${D} km away, at ${clock(dep + span)}. On the way it stops for ${stop} minutes. Find the average speed for the whole journey, including the stop, in km/h.`,
        answer: w,
        wrong: [[m, 'The stop is part of the journey time. The question asks for the whole journey, including the stop.'], [round(D / span, 3), 'The time is in minutes. Change it to hours first.'], [round(D / (span / 60 + stop / 60), 2), 'The time between leaving and arriving already includes the stop. Do not add it again.'], [round(span / 60, 2), 'That is the time in hours. Average speed is distance ÷ time.']],
        hints: ['Find the time from leaving to arriving.', 'Average speed = total distance ÷ total time.'],
        steps: [`Time: ${clock(dep)} to ${clock(dep + span)} is ${span} minutes = ${T(span / 60)} hours.`, `Speed: ${D} ÷ ${T(span / 60)} = ${T(w)} km/h.`] };
    },
    check: ({ D, span }, a) => Math.abs((a * span) / 60 - D) < 0.011 }),

  fam({ id: 'g9.speed.velocity-two-legs', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.c', rung: 3, form: 'word',
    draw: () => { const [a, b, c] = pick(TRIPLES.concat([[12, 16, 20], [15, 20, 25]])); const t = pick([1, 2, 2.5, 4, 5]); return dp(c / t, 1) && distinct(c / t, (a + b) / t, c) ? { a: a * 1, b, c, t, who: person() } : null; },
    make: ({ a, b, c, t, who }) => ({
      question: `${who.name} rides a boda boda ${a} km due east and then ${b} km due north. The whole ride takes ${t} hours. Find the size of ${who.her} average velocity for the ride, in km/h.`,
      answer: round(c / t, 2),
      wrong: [[round((a + b) / t, 2), 'That is the distance ÷ time, which is the average speed. Velocity uses the straight-line displacement from start to end.'], [c, 'That is the displacement. Now divide it by the time.'], [round(Math.abs(b - a) / t, 2), 'The two legs are at right angles. Use Pythagoras to find the displacement.'], [round(c * t, 2), 'Velocity is displacement divided by time.']],
      hints: ['Average velocity = displacement ÷ time.', 'The displacement is the straight line from the start to the end. The two legs are at right angles.'],
      steps: [`Displacement² = ${a}² + ${b}² = ${a * a + b * b}, so the displacement is ${c} km.`, `Velocity: ${c} ÷ ${t} = ${T(round(c / t, 2))} km/h.`] }),
    check: ({ a, b, t }, ans) => Math.abs((ans * t) ** 2 - (a * a + b * b)) < 0.01 }),

  fam({ id: 'g9.speed.accel-table', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.d', rung: 2, form: 'table',
    draw: () => { const u = pick([2, 4, 6]), a = pick([1, 1.5, 2, 3]); const v = (t) => u + a * t; return distinct(a, v(6) / 6, 4 * a, v(8) / 8) ? { u, a, what: pick(['car', 'train', 'motorbike']) } : null; },
    make: ({ u, a, what }) => {
      const v = (t) => round(u + a * t, 2);
      return { question: `A ${what} speeds up steadily on a straight road. The table shows its velocity. Find its acceleration between 2 s and 6 s, in m/s².`,
        model: { type: 'table', data: { head: ['Time (s)', 'Velocity (m/s)'], rows: [0, 2, 4, 6, 8].map(t => ({ label: String(t), value: String(v(t)) })) } },
        answer: a,
        wrong: [[round(v(6) / 6, 2), 'The car did not start from rest. Use the change in velocity between the two times.'], [round(v(6) - v(2), 2), 'That is the change in velocity. Divide it by the time it took.'], [round(v(8) / 8, 2), 'Use the readings at 2 s and 6 s, and the change between them.'], [round(4 / (v(6) - v(2)), 3), 'Acceleration is change in velocity ÷ time, the other way up.']],
        hints: ['Acceleration = change in velocity ÷ time taken.', 'Read the velocity at 2 s and at 6 s.'],
        steps: [`At 2 s: ${v(2)} m/s. At 6 s: ${v(6)} m/s. Change: ${T(round(v(6) - v(2), 2))} m/s.`, `Time taken: 6 − 2 = 4 s.`, `Acceleration: ${T(round(v(6) - v(2), 2))} ÷ 4 = ${a} m/s².`] };
    },
    check: ({ u, a }, ans) => Math.abs(u + ans * 6 - (u + ans * 2) - 4 * ans) < 1e-9 && Math.abs((u + a * 6) - (u + a * 2) - 4 * ans) < 1e-9 }),

  fam({ id: 'g9.speed.accel-graph', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.d', rung: 2, form: 'graph',
    draw: () => ({ u: pick([5, 10]), a: pick([2, 3, 4]), what: pick(['train', 'lorry', 'bus']) }),
    make: ({ u, a, what }) => {
      const ts = [0, 2, 4, 6, 8], top = u + 8 * a, step = top > 25 ? 10 : 5, yTicks = []; for (let y = 0; y <= top + step; y += step) yTicks.push(y);
      return { question: `A ${what} moves on a straight track. Its velocity is drawn as a line on the graph. Use the slope of the line to find how fast the velocity grows each second. Give the acceleration in m/s².`,
        model: { type: 'line-graph', data: { points: ts.map(t => ({ x: t, y: u + a * t })), xTicks: ts, yTicks, xLabel: 'Time (s)', yLabel: 'Velocity (m/s)' } },
        answer: a,
        wrong: [[round(top / 8, 2), 'The line does not start at zero. Use the change in velocity, not the final velocity.'], [8 * a, 'That is the total change in velocity. Divide it by the 8 seconds.'], [u, 'That is the velocity at the start. Acceleration is how fast the velocity changes.'], [round(1 / a, 3), 'Acceleration is the gradient: how far up for each second along.']],
        hints: ['Acceleration is the gradient of a velocity-time graph.', 'Pick two points on the line and divide the rise by the run.'],
        steps: [`At 0 s the velocity is ${u} m/s. At 8 s it is ${top} m/s.`, `Gradient: (${top} − ${u}) ÷ 8 = ${a} m/s².`] };
    },
    check: ({ u, a }, ans) => u + ans * 8 === u + a * 8 }),

  fam({ id: 'g9.speed.distance-from-graph', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.d', rung: 3, form: 'graph',
    draw: () => ({ t1: pick([5, 10]), v: pick([10, 15, 20]), t2: pick([15, 20, 25, 30]), who: person() }),
    make: ({ t1, v, t2, who }) => {
      const xTicks = []; for (let x = 0; x <= t2; x += 5) xTicks.push(x);
      const yTicks = []; for (let y = 0; y <= v + 5; y += 5) yTicks.push(y);
      const dist = round(0.5 * t1 * v + (t2 - t1) * v, 2);
      return { question: `A bus leaves a stop, accelerates steadily and then travels at a constant velocity. The graph shows its velocity. ${who.name} says the distance travelled is the area under the graph. How far does the bus travel in the first ${t2} seconds, in metres?`,
        model: { type: 'line-graph', data: { points: [{ x: 0, y: 0 }, { x: t1, y: v }, { x: t2, y: v }], xTicks, yTicks, xLabel: 'Time (s)', yLabel: 'Velocity (m/s)' } },
        answer: dist,
        wrong: [[v * t2, 'The bus did not travel at full velocity from the start. The first part is a triangle.'], [round(0.5 * t2 * v, 2), 'Only the first part is a triangle. After that the velocity is constant, which is a rectangle.'], [(t2 - t1) * v, 'That is only the constant-velocity part. Add the distance while speeding up.'], [round(0.5 * t1 * v, 2), 'That is only the speeding-up part. The bus kept going afterwards.']],
        hints: ['Split the area under the line into a triangle and a rectangle.', 'Triangle: half base times height. Rectangle: base times height.'],
        steps: [`Triangle: ½ × ${t1} × ${v} = ${T(0.5 * t1 * v)} m.`, `Rectangle: (${t2} − ${t1}) × ${v} = ${T((t2 - t1) * v)} m.`, `Total: ${T(dist)} m.`] };
    },
    check: ({ t1, v, t2 }, ans) => Math.abs(ans - 0.5 * (t2 + (t2 - t1)) * v) < 1e-6 }),

  fam({ id: 'g9.speed.brake-time', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.d', rung: 3, form: 'word',
    draw: () => { const kmh = pick([36, 54, 72, 90, 108]), a = pick([2, 2.5, 4, 5]); const t = kmh / 3.6 / a; return dp(t, 1) && distinct(t, kmh / a, (kmh / 3.6) * a) ? { kmh, a, who: person() } : null; },
    make: ({ kmh, a, who }) => {
      const ms = kmh / 3.6, t = round(ms / a, 2);
      return { question: `${who.name} drives a matatu at ${kmh} km/h. ${who.She} brakes and the matatu slows down steadily by ${a} m/s² until it stops. How many seconds does it take to stop?`,
        answer: t,
        wrong: [[round(kmh / a, 2), 'The speed is in km/h but the deceleration uses metres and seconds. Change the speed to m/s first.'], [round(ms * a, 2), 'Time = change in velocity ÷ deceleration. Divide.'], [round(ms / a / 3.6, 2), 'You changed the units twice. Divide by 3.6 once only, then divide by the deceleration.'], [ms, 'That is the speed in m/s. Divide by how much speed is lost each second.']],
        hints: ['Change the speed to m/s: divide km/h by 3.6.', 'Time = change in velocity ÷ deceleration.'],
        steps: [`${kmh} km/h ÷ 3.6 = ${T(round(ms, 2))} m/s.`, `Time: ${T(round(ms, 2))} ÷ ${a} = ${T(t)} s.`] };
    },
    check: ({ kmh, a }, ans) => Math.abs(ans * a * 3.6 - kmh) < 0.01 }),

  // ---- longitude and local time
  fam({ id: 'g9.speed.longitude-minutes', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.g', rung: 2, form: 'word',
    draw: () => { const [c1, c2] = [pick(LONGITUDES), pick(LONGITUDES)]; const d = Math.abs(c1[1] - c2[1]); return d >= 4 && d <= 80 ? { c1, c2, d } : null; },
    make: ({ c1, c2, d }) => ({
      question: `${c1[0]} is on longitude ${lonText(c1[1])} and ${c2[0]} is on longitude ${lonText(c2[1])}. The sun's position moves round the Earth, so the local time changes by 4 minutes for every degree of longitude. By how many minutes do the local times of the two places differ?`,
      answer: 4 * d,
      wrong: [[d, 'The local time changes by 4 minutes for every degree, not 1 minute.'], [15 * d, 'It is 15 degrees for each hour. For each degree it is 4 minutes.'], [round(d / 4, 2), 'Multiply the difference in degrees by 4. Do not divide.'], [4 * (Math.abs(c1[1]) + Math.abs(c2[1])), 'Add the longitudes only if the places are on opposite sides of 0°. Otherwise subtract.']].filter(w => w[0] !== 4 * d),
      hints: ['Find how many degrees of longitude separate the two places.', 'Each degree is 4 minutes of time.'],
      steps: [`Difference in longitude: ${d}°.`, `Time difference: ${d} × 4 = ${4 * d} minutes.`] }),
    check: ({ c1, c2 }, a) => a / 4 === Math.abs(c1[1] - c2[1]) }),

  fam({ id: 'g9.speed.local-time-options', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.g', rung: 2, form: 'word',
    draw: () => {
      const c1 = pick(LONGITUDES), c2 = pick(LONGITUDES), d = c2[1] - c1[1];
      if (Math.abs(d) < 8 || Math.abs(d) > 100 || (4 * d) % 60 === 0) return null;
      const right = 720 + 4 * d, rev = 720 - 4 * d, deg = 720 + d, hr = 720 + Math.trunc((4 * d) / 60) * 60;
      return distinct(right, rev, deg, hr) && [right, rev, deg, hr].every(x => x > 0 && x < 1440) ? { c1, c2, d, right, rev, deg, hr } : null;
    },
    make: ({ c1, c2, d, right, rev, deg, hr }) => ({
      question: `It is 12:00 noon local time in ${c1[0]}, on longitude ${lonText(c1[1])}. ${c2[0]} is on longitude ${lonText(c2[1])}. What is the local time in ${c2[0]}? Remember: the Earth turns towards the east, so places to the east are ahead.`,
      options: [
        { text: clock24(right), right: true },
        { text: clock24(rev), right: false, why: `${c2[0]} is to the ${d > 0 ? 'east' : 'west'} of ${c1[0]}. East is ahead in time and west is behind.` },
        { text: clock24(deg), right: false, why: 'Each degree is 4 minutes of time, not 1 minute.' },
        { text: clock24(hr), right: false, why: 'The leftover minutes count too. Do not drop them.' },
      ],
      hints: ['Find the difference in longitude, then multiply by 4 minutes.', `East of ${c1[0]} the time is later. West of it the time is earlier.`],
      steps: [`Difference: ${Math.abs(d)}°. Time difference: ${Math.abs(d)} × 4 = ${4 * Math.abs(d)} minutes.`, `${c2[0]} is ${d > 0 ? 'east' : 'west'}, so add${d > 0 ? '' : ' (no: take away)'} to noon: ${clock24(right)}.`].map((x, i) => (i === 1 ? `${c2[0]} is ${d > 0 ? 'east, so the time is later' : 'west, so the time is earlier'}: ${clock24(right)}.` : x)) }) }),

  fam({ id: 'g9.speed.find-longitude', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.g', rung: 3, form: 'word',
    draw: () => {
      const [name, base] = pick([['Nairobi', 37], ['Mombasa', 40], ['Kisumu', 35]]), dd = pick([5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 22]), ahead = pick([true, false]);
      const lon = ahead ? base + dd : base - dd;
      if (lon < 1 || (4 * dd) % 60 === 0) return null;
      return { name, base, dd, ahead, lon };
    },
    make: ({ name, base, dd, ahead, lon }) => {
      const mins = 4 * dd, h = Math.floor(mins / 60), m = mins % 60;
      const gap = `${h ? `${h} h ` : ''}${m} min`;
      return { question: `A town east of the Greenwich meridian has a local time that is ${gap} ${ahead ? 'ahead of' : 'behind'} the local time in ${name}. ${name} is on longitude ${base}°E. What is the longitude of the town, in degrees east?`,
        answer: lon,
        wrong: [[ahead ? base - dd : base + dd, ahead ? 'Places that are ahead in time lie further east, so the longitude gets bigger.' : 'Places that are behind in time lie further west, so the longitude gets smaller.'], [ahead ? base + mins : base - mins, 'Each degree is 4 minutes. Divide the minutes by 4 to get degrees.'], [ahead ? base + 15 * h : base - 15 * h, 'The minutes count too. Change the whole time difference to minutes first.'], [dd, 'That is the difference in longitude. Add it to, or take it from, the longitude of ' + name + '.']].filter(w => w[0] !== lon),
        hints: ['Change the time difference to minutes, then divide by 4 to find degrees.', 'Ahead in time means further east. Behind means further west.'],
        steps: [`Time difference: ${gap} = ${mins} minutes.`, `Degrees: ${mins} ÷ 4 = ${dd}°.`, `${ahead ? 'Ahead, so east' : 'Behind, so west'}: ${base} ${ahead ? '+' : '−'} ${dd} = ${lon}°E.`] };
    },
    check: ({ base, ahead, dd }, a) => (ahead ? a - base : base - a) * 4 === 4 * dd }),

  fam({ id: 'g9.speed.longitude-spot', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.g', rung: 3, form: 'spot',
    draw: () => { const base = pick([['Nairobi', 37], ['Mombasa', 40], ['Kisumu', 35], ['Dar es Salaam', 39]]), other = pick([['New York', -74], ['Lima', -77]]); return { base, other, kind: pick(['hemisphere', 'perdeg', 'direction']), who: person() }; },
    make: ({ base, other, kind, who }) => {
      const a = base[1], b = Math.abs(other[1]), trueDiff = a + b, shownDiff = kind === 'hemisphere' ? b - a : trueDiff;
      const mins = kind === 'perdeg' ? shownDiff : 4 * shownDiff, h = Math.floor(mins / 60), m = mins % 60;
      const behind = kind !== 'direction', t = behind ? 720 - mins : 720 + mins;
      return { question: `It is 12:00 noon local time in ${base[0]}, on longitude ${base[1]}°E. ${who.name} works out the local time in ${other[0]}, on longitude ${b}°W. The working is shown. Which step has the mistake?`,
        working: [
          { text: kind === 'hemisphere' ? `${base[0]} is east and ${other[0]} is west of 0°, so the difference in longitude is ${b} − ${a} = ${shownDiff}°` : `${base[0]} is east and ${other[0]} is west of 0°, so the difference in longitude is ${a} + ${b} = ${shownDiff}°`, ok: shownDiff === trueDiff },
          { text: kind === 'perdeg' ? `Time difference = ${shownDiff} × 1 = ${mins} minutes` : `Time difference = ${shownDiff} × 4 = ${mins} minutes`, ok: mins === shownDiff * 4 },
          { text: `${mins} minutes = ${h} h ${m} min`, ok: h * 60 + m === mins },
          { text: `${other[0]} is ${behind ? 'west, so it is behind' : 'ahead of'} ${base[0]}, so the local time is ${clock(t)}`, ok: behind === true },
        ],
        fix: kind === 'hemisphere' ? 'The places are on opposite sides of 0°, so the angles add. Taking one from the other is wrong.' : kind === 'perdeg' ? 'Each degree of longitude is 4 minutes of time, not 1 minute.' : 'West is behind in time, so the later steps should subtract from noon.',
        steps: [`Difference: ${a} + ${b} = ${trueDiff}°. Time: ${trueDiff} × 4 = ${4 * trueDiff} minutes, which is ${Math.floor((4 * trueDiff) / 60)} h ${(4 * trueDiff) % 60} min.`, `${other[0]} is west, so it is behind: ${clock(720 - 4 * trueDiff)}.`] };
    } }),

  fam({ id: 'g9.speed.flight-local-arrival', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.g', rung: 3, form: 'steps',
    draw: () => {
      const [city, lon, dur] = pick([['Dubai', 55, 5], ['Delhi', 77, 6], ['London', 0, 8], ['Lagos', 3, 6]]);
      const dep = pick([8, 9, 10]) * 60, d = lon - 37, mins = 4 * d, arr = dep + dur * 60 + mins;
      return arr >= 600 && arr < 1440 ? { city, lon, dur, dep, d, mins, arr } : null;
    },
    make: ({ city, lon, dur, dep, d, mins, arr }) => ({
      question: `A plane leaves Nairobi (longitude 37°E) at ${clock24(dep)} Nairobi time. The flight to ${city} (longitude ${lonText(lon)}) takes ${dur} hours.`,
      parts: [
        { prompt: `By how many degrees of longitude do Nairobi and ${city} differ?`, answer: Math.abs(d), unit: '°', hint: 'Both places are on the same side of the 0° line, or on opposite sides. Check which.', wrong: [[37 + lon, d > 0 ? 'Both places are east of 0°, so subtract.' : 'Think about which side of 0° each place is on.']].filter(w => w[0] !== Math.abs(d)) },
        { prompt: `By how many minutes does the local time in ${city} differ from Nairobi time?`, answer: Math.abs(mins), unit: 'minutes', hint: 'Each degree is 4 minutes.', wrong: [[Math.abs(d), 'Each degree is 4 minutes, not 1 minute.'], [Math.abs(d) * 15, '15 degrees make an hour. For each degree it is 4 minutes.']] },
        { prompt: `What is the local time in ${city} when the plane lands? Write it as four figures in 24-hour time, for example 1530.`, answer: Number(clock24(arr).replace(':', '')), hint: `${city} is ${d > 0 ? 'east, so its time is ahead' : 'west, so its time is behind'} of Nairobi. Add the flight time to the leaving time first.`, wrong: [[Number(clock24(dep + dur * 60).replace(':', '')), 'That is the Nairobi time when the plane lands. Change it to the local time of the other city.'], [Number(clock24(dep + dur * 60 - mins).replace(':', '')), d > 0 ? 'The east is ahead, so add the time difference.' : 'The west is behind, so take the time difference away.']] },
      ],
      hints: ['Work in minutes, then change back to hours and minutes.'],
      steps: [`Difference in longitude: ${Math.abs(d)}°. Time difference: ${Math.abs(d)} × 4 = ${Math.abs(mins)} minutes.`, `Landing in Nairobi time: ${clock24(dep)} + ${dur} h = ${clock24(dep + dur * 60)}.`, `${city} is ${d > 0 ? 'ahead' : 'behind'} by ${Math.abs(mins)} minutes, so the local time is ${clock24(arr)}.`] }),
    check: ({ dep, dur, d }, v) => v[0] === Math.abs(d) && v[1] === 4 * v[0] && v[2] === Number(clock24(dep + dur * 60 + (d > 0 ? v[1] : -v[1])).replace(':', '')) }),

  // ======================================================== MONEY
  fam({ id: 'g9.money.bureau-sell', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.b', rung: 1, form: 'word',
    draw: () => { const cur = pick(Object.keys(CUR)), r = rate(cur); return { cur, ...r, n: pick([50, 100, 150, 200, 250, 400]), who: person() }; },
    make: ({ cur, buy, sell, n, who }) => ({
      question: `${who.name} comes home with ${n} ${cur} and takes them to a forex bureau to change into Kenyan shillings. The board says the bureau buys at sh ${buy} and sells at sh ${sell}. How many shillings does ${who.she} receive?`,
      answer: n * buy,
      wrong: [[n * sell, `The bureau is buying, so it uses its lower buying rate. The selling rate is for when it sells to a customer.`], [round(n / buy, 2), 'Each unit of foreign money is worth some shillings. Multiply, do not divide.'], [n * (buy + sell) / 2, 'Use one rate only. Which rate does a bureau use when it buys?'], [n + buy, 'Each unit is worth the rate in shillings. Multiply by the number of units.']],
      hints: ['A bureau buys foreign money at the lower rate and sells at the higher rate.', 'Multiply the amount by the rate that applies.'],
      steps: [`The bureau is buying, so it uses the buying rate: sh ${buy}.`, `${n} × ${buy} = ${sh(n * buy)}.`] }),
    check: ({ buy, n }, a) => a / n === buy }),

  fam({ id: 'g9.money.bureau-trip', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.b', rung: 3, form: 'steps',
    draw: () => { const cur = pick(Object.keys(CUR)), r = rate(cur), n = pick([200, 300, 400, 500]), left = pick([20, 40, 50, 60, 80]); return { cur, ...r, n, left, who: person() }; },
    make: ({ cur, buy, sell, n, left, who }) => ({
      question: `Before a trip, ${who.name} buys ${n} ${cur} from a bureau. The bureau sells at sh ${sell} and buys at sh ${buy}. After the trip ${who.she} has ${left} ${cur} left and sells them back to the same bureau.`,
      parts: [
        { prompt: `How many shillings does ${who.name} pay for the foreign money?`, answer: n * sell, unit: 'sh', hint: 'The bureau is selling to the customer, so it uses its selling rate.', wrong: [[n * buy, 'When the bureau sells to a customer it uses the higher selling rate.']] },
        { prompt: `How many shillings does ${who.name} get for the money sold back?`, answer: left * buy, unit: 'sh', hint: 'Now the bureau is buying.', wrong: [[left * sell, 'When the bureau buys it uses the lower buying rate.']] },
        { prompt: `How many shillings does the trip cost ${who.herObj} in the end?`, answer: n * sell - left * buy, unit: 'sh', hint: 'What was paid, take away what came back.', wrong: [[n * sell + left * buy, 'What came back reduces the cost.'], [(n - left) * sell, 'The money sold back was bought at a different rate from the one it was sold at.']] },
      ],
      hints: ['A bureau sells at the higher rate and buys at the lower rate.'],
      steps: [`She buys at the selling rate: ${n} × ${sell} = ${sh(n * sell)}.`, `She sells back at the buying rate: ${left} × ${buy} = ${sh(left * buy)}.`, `Cost: ${sh(n * sell)} − ${sh(left * buy)} = ${sh(n * sell - left * buy)}.`] }),
    check: ({ sell, buy, n, left }, v) => v[0] / n === sell && v[1] / left === buy && v[0] - v[1] === v[2] }),

  fam({ id: 'g9.money.rate-board', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.b', rung: 2, form: 'table',
    draw: () => { const names = Object.keys(CUR); const rows = names.map(n => ({ n, ...rate(n) })); const k = pick(rows), toKes = pick([true, false]); return { rows, k, toKes, amt: pick([50, 100, 200, 250, 500]), who: person() }; },
    make: ({ rows, k, toKes, amt, who }) => {
      const other = rows.find(r => r !== k);
      return { question: toKes
        ? `The board at a forex bureau shows its rates in Kenyan shillings for one unit of each currency. The board is an example only. ${who.name} changes ${amt} ${k.n} into Kenyan shillings. How many shillings does ${who.she} get?`
        : `The board at a forex bureau shows its rates in Kenyan shillings for one unit of each currency. The board is an example only. ${who.name} pays Kenyan shillings to buy ${amt} ${k.n}. How many shillings does ${who.she} pay?`,
        model: { type: 'table', data: { head: ['Currency', 'Bureau buys at (sh)', 'Bureau sells at (sh)'], rows: rows.map(r => ({ cells: [r.n[0].toUpperCase() + r.n.slice(1), String(r.buy), String(r.sell)] })) } },
        answer: amt * (toKes ? k.buy : k.sell),
        wrong: [[amt * (toKes ? k.sell : k.buy), toKes ? 'The bureau is buying from her, so read the "buys" column.' : 'The bureau is selling to him or her, so read the "sells" column.'], [amt * (toKes ? other.buy : other.sell), 'That row is for a different currency.'], [round(amt / (toKes ? k.buy : k.sell), 2), 'Each unit is worth that many shillings. Multiply, do not divide.']],
        hints: ['Decide: is the bureau buying or selling the foreign money?', 'Use the matching column and the right row.'],
        steps: [toKes ? `The bureau buys ${k.n} from ${who.herObj}, so use the "buys" rate: sh ${k.buy}.` : `The bureau sells ${k.n}, so use the "sells" rate: sh ${k.sell}.`, `${amt} × ${toKes ? k.buy : k.sell} = ${sh(amt * (toKes ? k.buy : k.sell))}.`] };
    },
    check: ({ k, toKes, amt }, a) => a / amt === (toKes ? k.buy : k.sell) }),

  fam({ id: 'g9.money.cross-ush', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.b', rung: 3, form: 'word',
    draw: () => { const usd = pick([125, 128, 130]), ush = pick([3500, 3600, 3640, 3750]); const k = pick([10, 20, 40, 50]); const sh0 = usd * k; const out = ush * k; return Number.isInteger(out) ? { usd, ush, k, sh0, out, who: person() } : null; },
    make: ({ usd, ush, k, sh0, out, who }) => ({
      question: `${who.name} is going to Kampala to buy goods and changes Kenyan shillings into Ugandan shillings (USh) by way of US dollars. In this question, 1 US dollar buys sh ${usd} and 1 US dollar buys USh ${commas(ush)}. ${who.name} changes ${sh(sh0)}. How many Ugandan shillings does ${who.she} get?`,
      answer: out,
      wrong: [[sh0 * ush, 'First change the Kenyan shillings to dollars, then the dollars to Ugandan shillings.'], [round(sh0 / ush, 3), 'You must go through the dollars: shillings to dollars, then dollars to USh.'], [round(sh0 / usd, 2), 'That is the number of dollars. Now change the dollars to USh.'], [out + sh0, 'Change the dollars to USh by multiplying by the rate. Do not add.']].filter(w => w[0] !== out),
      hints: ['Two steps: Kenyan shillings to dollars, then dollars to Ugandan shillings.', 'Shillings to dollars: divide by the number of shillings one dollar buys.'],
      steps: [`Dollars: ${commas(sh0)} ÷ ${usd} = ${k}.`, `USh: ${k} × ${commas(ush)} = ${commas(out)}.`] }),
    check: ({ usd, ush, sh0 }, a) => Math.abs((a / ush) * usd - sh0) < 0.5 }),

  fam({ id: 'g9.money.duty-rate', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.c', rung: 2, form: 'word',
    draw: () => { const item = pick(['television', 'radio', 'mobile phone', 'solar panel', 'sewing machine']), n = pick([4, 5, 8, 10]), rt = pick([10, 25, 35]); const V = price(item) * n; const D = (V * rt) / 100; return Number.isInteger(D) ? { item, n, rt, V, D, who: person() } : null; },
    make: ({ item, n, rt, V, D, who }) => ({
      question: `${who.name} imports ${n} ${item}s. The customs value of the whole load is ${sh(V)}. The customs officer charges import duty of ${sh(D)}. What percentage of the customs value is the duty?`,
      answer: rt,
      wrong: [[round((D / (V + D)) * 100, 1), 'The duty is a percentage of the customs value, which is the value before the duty is added.'], [round(D / n, 1), 'That is the duty on one item, in shillings. The question asks for a percentage.'], [round(V / D, 1), 'That divides the wrong way round. Percentage = duty ÷ value × 100.'], [round(D / 100, 1), 'Divide the duty by the customs value, then multiply by 100.']],
      hints: ['Percentage = duty ÷ customs value × 100.', 'The customs value is the amount before duty.'],
      steps: [`Duty ÷ value = ${commas(D)} ÷ ${commas(V)}.`, `× 100 = ${rt}%.`] }),
    check: ({ V, D }, a) => Math.abs((V * a) / 100 - D) < 0.01 }),

  fam({ id: 'g9.money.duty-shipment', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.c', rung: 2, form: 'table',
    draw: () => {
      const goods = [['Radios', 0], ['Phones', 0], ['Solar panels', 0], ['School textbooks', 0], ['Bicycles', 0]].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = goods.map(([g]) => ({ g, v: pick([100000, 200000, 250000, 400000, 500000]), r: pick([0, 10, 25, 35]) }));
      const tot = rows.reduce((a, x) => a + (x.v * x.r) / 100, 0);
      return new Set(rows.map(x => x.r)).size >= 2 && tot > 0 ? { rows, tot } : null;
    },
    make: ({ rows, tot }) => ({
      question: 'A trading company brings in three kinds of goods in one shipment. The table shows the customs value of each and the rate of import duty on it. How much import duty must the company pay on the whole shipment?',
      model: { type: 'table', data: { head: ['Goods', 'Customs value (sh)', 'Import duty rate (%)'], rows: rows.map(x => ({ cells: [x.g, commas(x.v), String(x.r)] })) } },
      answer: tot,
      wrong: [[round(rows.reduce((a, x) => a + x.v, 0) * (rows.reduce((a, x) => a + x.r, 0) / 100), 0), 'The rates are different for each kind of goods. Work out the duty on each row, then add.'], [round(rows.reduce((a, x) => a + x.v, 0), 0), 'That is the total customs value. Work out the duty on each row.'], [round(Math.max(...rows.map(x => (x.v * x.r) / 100)), 0), 'That is the duty on one kind of goods only. The whole shipment has three.'], [round((rows.reduce((a, x) => a + x.v, 0) * Math.max(...rows.map(x => x.r))) / 100, 0), 'Each kind of goods has its own rate. Do not use the highest rate for all of them.']],
      hints: ['Find the duty on each row: value × rate ÷ 100.', 'Add the duties together.'],
      steps: [...rows.map(x => `${x.g}: ${commas(x.v)} × ${x.r}% = ${commas((x.v * x.r) / 100)}.`), `Total duty: ${sh(tot)}.`] }),
    check: ({ rows }, a) => Math.abs(a - rows.map(x => x.v * x.r).reduce((p, c) => p + c, 0) / 100) < 0.01 }),

  fam({ id: 'g9.money.duty-excise-vat-steps', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.c', rung: 3, form: 'steps',
    draw: () => { const V = pick([20000, 40000, 50000, 60000, 80000]), du = pick([10, 25]), ex = pick([10, 20]); const D = (V * du) / 100, E = ((V + D) * ex) / 100, Vt = ((V + D + E) * 16) / 100; return [D, E, Vt].every(Number.isInteger) ? { V, du, ex, D, E, Vt, who: person() } : null; },
    make: ({ V, du, ex, D, E, Vt, who }) => ({
      question: `${who.name} imports a machine. Its customs value is ${sh(V)}. Import duty is ${du}% of the customs value. Excise duty is ${ex}% of the customs value plus the import duty. VAT is 16% of the total after the excise duty has been added.`,
      parts: [
        { prompt: 'Import duty, in shillings:', answer: D, unit: 'sh', hint: `${du}% of the customs value.`, wrong: [[V + D, 'That is the value with the duty added. The duty alone is the percentage.']] },
        { prompt: 'Excise duty, in shillings:', answer: E, unit: 'sh', hint: `${ex}% of the value plus the import duty.`, wrong: [[(V * ex) / 100, 'Excise is charged on the customs value plus the import duty, not on the customs value alone.']] },
        { prompt: 'VAT, in shillings:', answer: Vt, unit: 'sh', hint: '16% of the value plus both duties.', wrong: [[((V + D) * 16) / 100, 'VAT is charged after the excise duty has been added too.'], [(V * 16) / 100, 'VAT is charged on the value plus both duties.']] },
        { prompt: 'Total cost to the importer, in shillings:', answer: V + D + E + Vt, unit: 'sh', hint: 'Add the customs value and all three taxes.', wrong: [[V + D + E, 'VAT must be added as well.']] },
      ],
      hints: ['Each tax is worked out on a bigger amount than the one before.'],
      steps: [`Duty: ${du}% of ${commas(V)} = ${commas(D)}.`, `Excise: ${ex}% of ${commas(V + D)} = ${commas(E)}.`, `VAT: 16% of ${commas(V + D + E)} = ${commas(Vt)}.`, `Total: ${commas(V + D + E + Vt)}.`] }),
    check: ({ V, du, ex }, v) => v[0] * 100 === V * du && v[1] * 100 === (V + v[0]) * ex && v[2] * 100 === (V + v[0] + v[1]) * 16 && v[3] === V + v[0] + v[1] + v[2] }),

  fam({ id: 'g9.money.excise-per-litre', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.d', rung: 2, form: 'word',
    draw: () => ({ n: pick([2000, 4000, 5000, 8000]), ml: pick([300, 500]), rt: pick([5, 10, 15]), who: person() }),
    make: ({ n, ml, rt, who }) => {
      const L = (n * ml) / 1000;
      return { question: `A bottling company makes ${commas(n)} bottles of soda. Each bottle holds ${ml} ml. In this question, excise duty on soda is sh ${rt} for every litre. How much excise duty does the company pay?`,
        answer: L * rt,
        wrong: [[n * rt, 'The excise duty is for each litre, not each bottle. Find the number of litres first.'], [n * ml * rt, 'That uses millilitres. The rate is for each litre.'], [L, 'That is the number of litres. Multiply by the rate for each litre.'], [round((n * ml * rt) / 100, 1), 'There are 1,000 ml in a litre.']].filter(w => w[0] !== L * rt),
        hints: ['Find the total volume in litres.', '1,000 ml = 1 litre.'],
        steps: [`Volume: ${commas(n)} × ${ml} ml = ${commas(n * ml)} ml = ${commas(L)} litres.`, `Excise: ${commas(L)} × ${rt} = ${sh(L * rt)}.`] };
    },
    check: ({ n, ml, rt }, a) => (a / rt) * 1000 === n * ml }),

  fam({ id: 'g9.money.excise-find-factory', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.d', rung: 3, form: 'word',
    draw: () => { const F = pick([500, 800, 1000, 1200, 2000, 2500]), r = pick([10, 20, 25]); return { F, r, P: F + (F * r) / 100, what: pick(['box of tea', 'carton of juice', 'pack of biscuits']) }; },
    make: ({ F, r, P, what }) => ({
      question: `A ${what} is sold for ${sh(P)} after excise duty of ${r}% of the factory price has been added. What was the factory price of the ${what}, before the excise duty?`,
      answer: F,
      wrong: [[round(P * (1 - r / 100), 2), `The duty is ${r}% of the factory price, which is less than the selling price. Taking the same percentage off the selling price takes off too much.`], [round(P - r, 2), 'The duty is a percentage, not a number of shillings.'], [round(P / (r / 100), 2), 'The price is 100% plus the duty rate. Divide by that, as a decimal.'], [round(P * (1 + r / 100), 2), 'The duty was already added. You need to go back to the price before it.']],
      hints: ['The selling price is the factory price plus the duty, so it is more than 100% of the factory price.', `Selling price = factory price × ${1 + r / 100}.`],
      steps: [`Selling price = ${100 + r}% of the factory price.`, `Factory price = ${commas(P)} ÷ ${1 + r / 100} = ${sh(F)}.`] }),
    check: ({ r, P }, a) => Math.abs(a * (1 + r / 100) - P) < 0.01 }),

  fam({ id: 'g9.money.layered-tax-spot', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.d', rung: 3, form: 'spot',
    draw: () => { const V = pick([20000, 40000, 50000, 80000]), du = pick([10, 25]), ex = pick([10, 20]), kind = pick(['excise', 'vat']); const D = (V * du) / 100, E = ((V + D) * ex) / 100; return Number.isInteger(E) && Number.isInteger(((V + D + E) * 16) / 100) && Number.isInteger((V * ex) / 100) ? { V, du, ex, kind, D, who: person() } : null; },
    make: ({ V, du, ex, kind, D, who }) => {
      const E = kind === 'excise' ? (V * ex) / 100 : ((V + D) * ex) / 100, Vt = kind === 'vat' ? (V * 16) / 100 : ((V + D + E) * 16) / 100, tot = V + D + E + Vt;
      return { question: `${who.name} works out the taxes on an imported machine with a customs value of ${sh(V)}. The rules: import duty is ${du}% of the customs value. Excise duty is ${ex}% of the customs value plus the import duty. VAT is 16% of everything so far, with the excise duty included. Which step has the mistake?`,
        working: [
          { text: `Import duty = ${du}% of ${commas(V)} = ${commas(D)}`, ok: D === (V * du) / 100 },
          { text: kind === 'excise' ? `Excise duty = ${ex}% of ${commas(V)} = ${commas(E)}` : `Excise duty = ${ex}% of ${commas(V + D)} = ${commas(E)}`, ok: E === ((V + D) * ex) / 100 },
          { text: kind === 'vat' ? `VAT = 16% of ${commas(V)} = ${commas(Vt)}` : `VAT = 16% of ${commas(V + D + E)} = ${commas(Vt)}`, ok: Vt === ((V + D + E) * 16) / 100 },
          { text: `Total = ${commas(V)} + ${commas(D)} + ${commas(E)} + ${commas(Vt)} = ${commas(tot)}`, ok: tot === V + D + E + Vt },
        ],
        fix: kind === 'excise' ? 'Excise duty is worked out on the customs value plus the import duty, not on the customs value alone.' : 'VAT is worked out on the customs value plus the import duty and the excise duty, not on the customs value alone.',
        steps: [`Duty: ${commas(D)}. Excise is on ${commas(V + D)}.`, `VAT is on the value with both duties added.`] };
    } }),

  fam({ id: 'g9.money.vat-find-price', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.e', rung: 3, form: 'word',
    draw: () => { const item = pick(['radio', 'mobile phone', 'solar panel', 'bicycle', 'television']); const F = price(item); return { item, F, P: round(F * 1.16, 2) }; },
    make: ({ item, F, P }) => ({
      question: `The label on a ${item} says ${sh(P)}, with a note: "16% VAT included". What would the ${item} cost without the VAT?`,
      answer: F,
      wrong: [[round(P * 0.84, 2), 'The 16% is of the price before VAT, which is smaller than the selling price. Taking 16% off the selling price takes off too much.'], [round(P - 16, 2), 'VAT is a percentage, not 16 shillings.'], [round(P * 0.16, 2), 'That is 16% of the selling price, which is not the VAT either. The selling price is 116% of the original.'], [round(P / 1.6, 2), 'The selling price is 116% of the original price. Divide by 1.16.']],
      hints: ['The price with VAT is 116% of the price before VAT.', 'Divide by 1.16 to go back.'],
      steps: [`Price with VAT = 116% of the price before VAT.`, `${commas(P)} ÷ 1.16 = ${sh(F)}.`] }),
    check: ({ P }, a) => Math.abs(a * 1.16 - P) < 0.01 }),

  fam({ id: 'g9.money.vat-receipt', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.e', rung: 2, form: 'table',
    draw: () => {
      const items = ['radio', 'mobile phone', 'solar panel', 'bicycle', 'sewing machine'].sort(() => Math.random() - 0.5).slice(0, 4);
      const rows = items.map(n => ({ n, p: price(n), v: Math.random() < 0.7 }));
      const tot = rows.filter(r => r.v).reduce((a, r) => a + r.p, 0);
      return rows.some(r => !r.v) && rows.filter(r => r.v).length >= 2 && dp(tot * 0.16, 1) ? { rows, tot } : null;
    },
    make: ({ rows, tot }) => ({
      question: 'A shop prints a bill. VAT of 16% is charged only on the items marked Yes in the last column. How much VAT is charged on the whole bill?',
      model: { type: 'table', data: { head: ['Item', 'Price before VAT (sh)', 'VAT charged?'], rows: rows.map(r => ({ cells: [r.n[0].toUpperCase() + r.n.slice(1), commas(r.p), r.v ? 'Yes' : 'No'] })) } },
      answer: round(tot * 0.16, 2),
      wrong: [[round(rows.reduce((a, r) => a + r.p, 0) * 0.16, 2), 'Items marked No have no VAT. Leave them out of the sum.'], [tot, 'That is the total price of the items with VAT, before the tax. Find 16% of it.'], [round(tot * 1.16, 2), 'That is the price with VAT included. The question asks for the VAT only.'], [round(rows.filter(r => !r.v).reduce((a, r) => a + r.p, 0) * 0.16, 2), 'VAT is charged on the Yes items, not the No items.']].filter(w => w[0] !== round(tot * 0.16, 2)),
      hints: ['Add up only the prices of the items marked Yes.', 'Then find 16% of that total.'],
      steps: [`Items with VAT: ${rows.filter(r => r.v).map(r => commas(r.p)).join(' + ')} = ${commas(tot)}.`, `VAT: 16% of ${commas(tot)} = ${sh(round(tot * 0.16, 2))}.`] }),
    check: ({ rows }, a) => Math.abs(a * 100 - 16 * rows.filter(r => r.v).reduce((p, r) => p + r.p, 0)) < 0.5 }),

  fam({ id: 'g9.money.vat-base-why', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.e', rung: 3, form: 'why',
    draw: () => { const F = pick([1000, 2000, 2500, 5000, 8000]); return { F, P: round(F * 1.16, 2), who: person() }; },
    make: ({ F, P, who }) => {
      const wrongVat = round(P * 0.16, 2), vat = round(F * 0.16, 2);
      return { question: `A phone costs ${sh(P)} with VAT of 16% included. ${who.name} says the VAT in the price is 16% of ${commas(P)}, which is ${sh(wrongVat)}. Why is this wrong?`,
        options: [
          { text: `The 16% is worked out on the price before VAT, so the VAT is ${sh(vat)}`, right: true },
          { text: `The VAT is 16 shillings for each phone`, right: false, why: 'VAT is a percentage of a price, not a fixed amount in shillings.' },
          { text: `The VAT should be worked out on the price with VAT, but ${who.name} did the sum wrongly`, right: false, why: 'The sum is right. The mistake is which price the percentage is taken from.' },
          { text: `The VAT is found by taking 16% off, so the VAT is ${sh(round(P * 0.84, 2))}`, right: false, why: 'Taking 16% off the price gives a smaller price, not the VAT. VAT is a share of the price before VAT.' },
        ],
        hints: ['VAT is added to the price before VAT.', 'The price with VAT is 116% of the price before it.'],
        steps: [`The price with VAT is 116% of the price before VAT: ${commas(P)} ÷ 1.16 = ${commas(F)}.`, `VAT = 16% of ${commas(F)} = ${sh(vat)}.`] };
    } }),

  // ======================================================== APPROXIMATIONS AND ERRORS
  fam({ id: 'g9.approx.upper-bound-area', skill: 'G9_ERRORS', outcome: 'G9.APPROX.b', rung: 3, form: 'word',
    draw: () => ({ l: pick([12, 15, 20, 24]), w: pick([6, 8, 9, 10]), who: person() }),
    make: ({ l, w, who }) => {
      const up = (l + 0.5) * (w + 0.5);
      return { question: `${who.name} measures a vegetable garden. The length is ${l} m and the width is ${w} m. Each is correct to the nearest metre. What is the greatest possible area of the garden, in m²?`,
        answer: up,
        wrong: [[l * w, 'That uses the measurements as they are. The greatest area comes from the largest possible length and width.'], [(l + 1) * (w + 1), 'Each measurement can be at most half a metre too small, not a whole metre.'], [(l - 0.5) * (w - 0.5), 'That is the smallest possible area. You need the greatest.'], [round(up + 0.5 * 0.5, 2), 'Both the length and the width go up by half a metre. Multiply the two upper bounds.']].filter(w2 => w2[0] !== up),
        hints: ['A length given to the nearest metre can be up to half a metre more.', 'Use the upper bound of the length and the upper bound of the width.'],
        steps: [`Upper bound of the length: ${l + 0.5} m. Upper bound of the width: ${w + 0.5} m.`, `Greatest area: ${l + 0.5} × ${w + 0.5} = ${T(up)} m².`] };
    },
    check: ({ l, w }, a) => Math.abs(a / (w + 0.5) - (l + 0.5)) < 1e-6 }),

  fam({ id: 'g9.approx.error-table', skill: 'G9_ERRORS', outcome: 'G9.APPROX.c', rung: 3, form: 'table',
    draw: () => {
      const names = ['Sack of maize', 'Bag of sugar', 'Packet of salt', 'Tin of cooking fat'].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = names.map(n => { const t = pick([1, 2, 5, 10, 50, 90]); const e = pick([0.1, 0.2, 0.5, 1, 2, 4]); return { n, t, m: round(t + pick([-1, 1]) * e, 2), e, pc: (e / t) * 100 }; });
      if (rows.some(r => r.m <= 0)) return null;
      const top = rows.reduce((a, b) => (b.pc > a.pc ? b : a)), big = rows.reduce((a, b) => (b.e > a.e ? b : a));
      return new Set(rows.map(r => round(r.pc, 3))).size === 3 && top !== big ? { rows, top } : null;
    },
    make: ({ rows, top }) => ({
      question: 'A shopkeeper measures the mass of three items. The table shows the true mass and the measured mass of each. Which measurement has the greatest percentage error?',
      model: { type: 'table', data: { head: ['Item', 'True mass (kg)', 'Measured mass (kg)'], rows: rows.map(r => ({ cells: [r.n, String(r.t), String(r.m)] })) } },
      options: rows.map(r => ({ text: r.n, right: r === top, why: r === top ? undefined : r.e === Math.max(...rows.map(x => x.e)) ? 'It has the biggest error in kg, but the percentage error compares the error with the true mass.' : 'Work out error ÷ true mass × 100 for every item and compare.' })),
      hints: ['Percentage error = error ÷ true value × 100.', 'Work it out for each row.'],
      steps: rows.map(r => `${r.n}: ${T(r.e)} ÷ ${r.t} × 100 = ${T(round(r.pc, 2))}%.`).concat([`The greatest is ${top.n}.`]) }) }),

  fam({ id: 'g9.approx.estimate-then-check', skill: 'G9_ROUNDING', outcome: 'G9.APPROX.a', rung: 2, form: 'steps',
    draw: () => { const n = pick([18, 24, 32, 48, 52, 63, 76]), p = pick([800, 1200, 1400, 1900, 2300, 2500]); const r1 = (x) => { const k = 10 ** (String(Math.abs(x)).length - 1); return Math.round(x / k) * k; }; const est = r1(n) * r1(p), exact = n * p; return est !== exact && distinct(est, exact, Math.abs(est - exact)) ? { n, p, est, exact, a: r1(n), b: r1(p), who: person() } : null; },
    make: ({ n, p, est, exact, a, b, who }) => ({
      question: `A school wants to buy ${n} school bags. Each bag costs ${sh(p)}. ${who.name} estimates the total cost by rounding both numbers to 1 significant figure.`,
      parts: [
        { prompt: 'The estimate of the total cost, in shillings:', answer: est, unit: 'sh', hint: 'Round the number of bags and the price to 1 significant figure, then multiply.', wrong: [[n * p, 'That is the exact cost. An estimate uses the rounded numbers.'], [a + b, 'Multiply the two rounded numbers.']] },
        { prompt: 'The exact total cost, in shillings:', answer: exact, unit: 'sh', hint: 'Multiply the real numbers.', wrong: [[est, 'That is the estimate. Use the real numbers.']] },
        { prompt: 'By how many shillings is the estimate different from the exact cost? (Give the size of the difference.)', answer: Math.abs(est - exact), unit: 'sh', hint: 'Subtract the smaller from the larger.', wrong: [[est + exact, 'The difference comes from subtracting.']] },
      ],
      hints: ['Round first, multiply second.'],
      steps: [`${n} rounds to ${a} and ${commas(p)} rounds to ${commas(b)}. ${a} × ${commas(b)} = ${commas(est)}.`, `Exact: ${n} × ${commas(p)} = ${commas(exact)}.`, `Difference: ${commas(Math.abs(est - exact))}.`] }),
    check: ({ n, p }, v) => v[1] === n * p && Math.abs(v[0] - v[1]) === v[2] }),

  // ======================================================== MORE PICTURES AND REASONS
  fam({ id: 'g9.money.rate-graph', skill: 'G9_COMMERCIAL_ARITH', outcome: 'G9.MONEY.b', rung: 2, form: 'graph',
    draw: () => { const [cur, r] = pick([['US dollars', 125], ['US dollars', 130], ['euros', 140], ['euros', 150], ['pounds', 160], ['pounds', 170]]); return { r, cur }; },
    make: ({ r, cur }) => {
      const xs = [0, 10, 20, 30, 40], yTicks = []; for (let y = 0; y <= r * 40 + 1000; y += 1000) yTicks.push(y);
      return { question: `The line graph shows how many shillings a bureau pays for different amounts of ${cur}. The line is straight. What exchange rate does the graph show, in shillings for 1 ${cur.replace('US dollars', 'US dollar').replace('euros', 'euro').replace('pounds', 'pound')}?`,
        model: { type: 'line-graph', data: { points: xs.map(x => ({ x, y: r * x })), xTicks: xs, yTicks, xLabel: cur[0].toUpperCase() + cur.slice(1), yLabel: 'Shillings' } },
        answer: r,
        wrong: [[r * 40, 'That is the number of shillings for 40 of them. The rate is for just one.'], [round(40 / (r * 40), 4), 'That is units of foreign money for one shilling, the wrong way up.'], [r * 40 - 40, 'Divide the shillings by the dollars. Do not subtract.'], [r * 10, 'That is the number of shillings for 10 of them. Divide by 10.']],
        hints: ['Pick a point on the line and read both numbers.', 'Rate = shillings ÷ dollars.'],
        steps: [`At 40 the line shows ${commas(r * 40)} shillings.`, `Rate: ${commas(r * 40)} ÷ 40 = ${r} shillings for 1.`] };
    },
    check: ({ r }, a) => a * 40 === r * 40 }),

  fam({ id: 'g9.density.mass-volume-graph', skill: 'G8_DENSITY', outcome: 'G9.DENSITY.c', rung: 2, form: 'graph',
    draw: () => ({ rho: pick([2.5, 4, 5, 8]), what: pick(['metal', 'material', 'solid']) }),
    make: ({ rho, what }) => {
      const xs = [0, 10, 20, 30, 40], top = rho * 40, step = top / 4, yTicks = [0, step, 2 * step, 3 * step, 4 * step];
      return { question: `A learner weighs different volumes of the same ${what}. The graph shows the mass against the volume. Use the graph to find the density of the ${what}, in g/cm³.`,
        model: { type: 'line-graph', data: { points: xs.map(x => ({ x, y: rho * x })), xTicks: xs, yTicks, xLabel: 'Volume (cm³)', yLabel: 'Mass (g)' } },
        answer: rho,
        wrong: [[top, 'That is the mass at 40 cm³. Density is the mass of 1 cm³: divide by the volume.'], [round(1 / rho, 3), 'That is volume ÷ mass, upside down.'], [top - 40, 'Divide the mass by the volume. Do not subtract.'], [round(top / 10, 2), 'The point at the end of the line is at 40 cm³, not 10 cm³. Divide by the volume at that point.']],
        hints: ['Pick a point on the line and read the volume and the mass.', 'Density = mass ÷ volume.'],
        steps: [`At 40 cm³ the line shows a mass of ${T(top)} g.`, `Density: ${T(top)} ÷ 40 = ${rho} g/cm³.`] };
    },
    check: ({ rho }, a) => a * 40 === rho * 40 }),

  fam({ id: 'g9.vol.sphere-double-why', skill: 'G9_VOLUME_ADV', outcome: 'G9.VOL.e', rung: 3, form: 'why',
    draw: () => ({ k: pick([2, 3]), r: pick([2, 3, 4, 5]), what: pick(['ball', 'water tank', 'sphere of clay']) }),
    make: ({ k, r, what }) => ({
      question: `The radius of a ${what} is ${r} cm. It is made ${k} times as wide, so its radius is ${k * r} cm. A learner says its volume becomes ${k ** 3} times as big. Why?`,
      options: [
        { text: `The volume of a sphere uses r × r × r, so multiplying r by ${k} multiplies the volume by ${Array(3).fill(k).join(' × ')}`, right: true },
        { text: `The volume of a sphere uses r × r, so multiplying r by ${k} multiplies the volume by ${k} × ${k}`, right: false, why: 'That is how the surface area grows. Volume has the radius three times: r × r × r.' },
        { text: `The volume grows by the same number as the radius, so it is multiplied by ${k}`, right: false, why: 'Volume does not grow in step with the radius. It uses the radius three times over.' },
        { text: `The volume of a sphere uses the number 3, so it is multiplied by ${k} + ${k} + ${k}`, right: false, why: 'The 3 in r³ means r × r × r, not r + r + r.' },
      ],
      hints: ['What is the formula for the volume of a sphere? How many times does r appear?', 'Try it: put r and then k × r into the formula.'],
      steps: [`Volume = ⁴⁄₃ π r³. With radius ${k}r the volume is ⁴⁄₃ π (${k}r)³ = ${k ** 3} × ⁴⁄₃ π r³.`, `So the volume is ${k ** 3} times as big.`] }) }),
];
