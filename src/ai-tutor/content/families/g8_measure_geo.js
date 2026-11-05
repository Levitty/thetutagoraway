// ============================================================================
// GRADE 8 MEASUREMENTS, GEOMETRY AND DATA: new question forms, written in advance.
// Circles, area, money, constructions, graphs, scale, solids, data, probability.
// All unreviewed until a person signs them off.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, twoPeople, sh, price, route } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const PI = 22 / 7;
const uniq = (...v) => new Set(v.map(x => String(round(x, 4)))).size === v.length;
const near = (a, b) => Math.abs(a - b) < 1e-6;
const circ = (r) => 2 * PI * r;                 // use with r a multiple of 7
const nice = (v) => Number.isInteger(v * 2);   // whole or .5

export const FAMILIES = [
  // ================================================================ CIRCLES
  fam({ id: 'g8.circ.wheel-distance', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.a', rung: 2, form: 'word',
    draw: () => {
      const d = pick([56, 63, 70, 84, 98]), n = randInt(5, 40), c = (22 * d) / 7, tot = c * n;
      if (tot % 50 !== 0) return null;
      const a = tot / 100;
      return uniq(a, tot, tot / 200, c / 100) ? { d, n, c, tot, a } : null;
    },
    make: ({ d, n, c, tot, a }) => ({
      question: `The wheel of a boda boda has a diameter of ${d} cm. It makes ${n} full turns along a road. How far does it travel, in metres? (Use π = 22/7)`,
      answer: a,
      wrong: [[tot, 'The distance is in cm here. Change it to metres: there are 100 cm in 1 m.'], [tot / 200, 'You used half the diameter. Circumference is π times the whole diameter.'], [c / 100, 'That is the distance for one turn only. The wheel turns many times.']],
      hints: ['One full turn takes the wheel once round its rim. That distance is the circumference.', 'Circumference = π × diameter. Then count all the turns, and change cm to m.'],
      steps: [`One turn: 22/7 × ${d} = ${c} cm.`, `${n} turns: ${n} × ${c} = ${tot} cm.`, `${tot} ÷ 100 = ${a} m.`],
    }),
    check: ({ d, n }, a) => near((a * 100) / n / d, 22 / 7) }),

  fam({ id: 'g8.circ.radius-slip', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.a', rung: 2, form: 'why',
    draw: () => ({ r: pick([7, 14, 21, 28]), p: person() }),
    make: ({ r, p }) => ({
      question: `${p.name} wants the circumference of a circle with a radius of ${r} cm. ${p.She} writes C = π × ${r}. Why is this wrong?`,
      options: [
        { text: `Circumference is π × diameter, and the diameter is ${2 * r} cm, not ${r} cm`, right: true },
        { text: `${p.She} should have squared the radius: π × ${r} × ${r}`, right: false, why: 'Squaring the radius gives the area inside the circle. Circumference is the distance round it.' },
        { text: `${p.She} should have added the radius: π + ${r}`, right: false, why: 'Circumference is found by multiplying, not adding. The number π is a multiplier.' },
        { text: `${p.She} should have divided by π, to get ${r} ÷ π`, right: false, why: 'Dividing by π goes the wrong way. From a length across the circle to a length round it, you multiply by π.' },
      ],
      hints: ['Circumference = π × diameter.', 'How is the diameter related to the radius?'],
      steps: [`The radius is ${r} cm, so the diameter is 2 × ${r} = ${2 * r} cm.`, 'Circumference = π × diameter, so it is π × diameter, not π × radius.'],
    }) }),

  fam({ id: 'g8.circ.track-laps', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.a', rung: 3, form: 'steps',
    draw: () => { const r = pick([35, 49, 63, 70]), n = randInt(3, 5), m = randInt(5, 10), c = (44 * r) / 7; return { r, n, m, c, p: person() }; },
    make: ({ r, n, m, c, p }) => ({
      question: `A school has a round running track with a radius of ${r} m. Use π = 22/7.`,
      parts: [
        { prompt: 'How long is one lap of the track, in metres?', answer: c, unit: 'm', hint: 'One lap is once round: the circumference.', wrong: [[(22 * r) / 7, 'You left out the 2. Circumference = 2 × π × radius.'], [round((22 * r * r) / 7, 0), 'That is the area inside the track, not the distance round it.']] },
        { prompt: `${p.name} runs ${n} laps. How far is that, in metres?`, answer: c * n, unit: 'm', hint: 'Multiply the length of one lap by the number of laps.', wrong: [[c + n, 'Laps are repeated, so multiply.']] },
        { prompt: `${p.name} wants to run ${commas(c * m)} m. How many laps is that?`, answer: m, unit: 'laps', hint: 'How many laps of the length in the first part fit into the distance?', wrong: [[c * m * c, 'Divide the distance by the length of one lap.']] },
      ],
      steps: [`One lap: 2 × 22/7 × ${r} = ${c} m.`, `${n} laps: ${n} × ${c} = ${c * n} m.`, `${commas(c * m)} ÷ ${c} = ${m} laps.`],
    }),
    check: ({ r, n, m, c }, v) => v[0] * 7 === 44 * r && v[1] === v[0] * n && v[2] * v[0] === c * m }),

  fam({ id: 'g8.arc.flowerbed', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.b', rung: 2, form: 'word',
    draw: () => {
      const r = pick([7, 14, 21, 28, 35, 42]), th = pick([30, 45, 60, 72, 90, 120, 135, 180, 270]);
      const arc = (th / 360) * circ(r);
      if (!nice(arc) || arc < 3) return null;
      const full = circ(r), halfArc = arc / 2, areaFrac = round((th / 360) * PI * r * r, 1);
      return uniq(arc, full, halfArc, areaFrac) ? { r, th, arc, full, halfArc, areaFrac } : null;
    },
    make: ({ r, th, arc, full, halfArc, areaFrac }) => ({
      question: `A farmer plants a hedge along the curved side of a pie-shaped shamba. The hedge is an arc: it covers ${th}° of the way round a circle of radius ${r} m. How many metres long is the hedge? (Use π = 22/7)`,
      answer: arc,
      wrong: [[full, `That is all the way round the circle. The arc is only ${th}/360 of it.`], [halfArc, 'You used π × radius for the whole circle. The circumference has a 2: 2 × π × radius.'], [areaFrac, 'That multiplies by the radius twice. It is the area of the slice, not the length of its curved edge.']],
      hints: ['First find the circumference of the whole circle.', `The arc is the fraction ${th}/360 of the circumference.`],
      steps: [`Whole circle: 2 × 22/7 × ${r} = ${full} m.`, `Fraction of the circle: ${th}/360.`, `Arc = ${th}/360 × ${full} = ${arc} m.`],
    }),
    check: ({ r, th }, a) => near((a * 360) / th, (44 * r) / 7) }),

  fam({ id: 'g8.arc.minute-hand', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.b', rung: 3, form: 'word',
    draw: () => {
      const r = pick([14, 21, 35]), m = pick([3, 5, 6, 9, 10, 15, 20, 25, 30, 45]);
      const arc = (m / 60) * circ(r);
      if (!nice(arc) || arc < 3) return null;
      const full = circ(r), asDeg = round((m / 360) * circ(r), 1), asHour = round((m / 12) * circ(r), 1);
      return uniq(arc, full, asDeg, asHour) ? { r, m, arc, full, asDeg, asHour, p: person() } : null;
    },
    make: ({ r, m, arc, full, asDeg, asHour, p }) => ({
      question: `The minute hand of a wall clock is ${r} cm long. Its tip moves along an arc of a circle. How far does the tip move in ${m} minutes? Give the answer in cm. (Use π = 22/7)`,
      answer: arc,
      wrong: [[full, 'That is the distance in a whole hour, one full turn of the hand.'], [asDeg, 'The minute hand turns 6 degrees each minute, so the angle is not the number of minutes.'], [asHour, 'The hand makes a full turn in 60 minutes, not 12.']],
      hints: ['A minute hand goes once round in 60 minutes. What fraction of a turn is that?', 'The tip travels that fraction of the circumference of its circle.'],
      steps: [`In ${m} minutes the hand turns ${m}/60 of a full turn.`, `The tip's full circle is 2 × 22/7 × ${r} = ${full} cm.`, `Distance = ${m}/60 × ${full} = ${arc} cm.`],
    }),
    check: ({ r, m }, a) => near((a * 60) / m, (44 * r) / 7) }),

  fam({ id: 'g8.arc.table-angles', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.b', rung: 2, form: 'table',
    draw: () => {
      const set = pick([{ r: 21, a: [30, 60, 90, 120, 180, 270] }, { r: 14, a: [45, 90, 135, 180, 225, 270] }]);
      const angs = [...set.a].sort(() => Math.random() - 0.5).slice(0, 4);
      const arcOf = (t) => (t / 360) * circ(set.r);
      const known = angs.slice(0, 3), miss = angs[3], arc = arcOf(miss);
      const wr = [miss, circ(set.r), Math.max(...known.map(arcOf))];
      return uniq(arc, ...wr) ? { r: set.r, known, miss, arc, arcOf, full: circ(set.r) } : null;
    },
    make: ({ r, known, miss, arc, arcOf, full }) => ({
      question: `A metal worker bends rims of radius ${r} cm. The table shows how much rim is needed for each angle. What is the missing length of the arc, in cm? (Use π = 22/7)`,
      model: { type: 'table', data: { head: ['Angle of the rim piece', 'Arc length (cm)'], rows: [...known.map(t => ({ label: `${t}°`, value: String(arcOf(t)) })), { label: `${miss}°`, value: '?' }] } },
      answer: arc,
      wrong: [[miss, 'That is the angle. The question asks for a length in cm.'], [full, 'That is the whole circle, 360°. The arc is smaller.'], [Math.max(...known.map(arcOf)), 'That is the longest arc in the table. Compare the angle with the angles shown.']],
      hints: ['Arc length grows in step with the angle. Look at how the rows are related.', 'Or find the whole circumference, then the fraction of it.'],
      steps: [`Whole circle: 2 × 22/7 × ${r} = ${full} cm.`, `Arc for ${miss}°: ${miss}/360 × ${full} = ${arc} cm.`],
    }),
    check: ({ r, miss }, a) => near((a * 360) / miss, (44 * r) / 7) }),

  fam({ id: 'g8.arc.spot-fraction', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.b', rung: 2, form: 'spot',
    draw: () => {
      const r = pick([14, 21, 28, 35]), th = pick([30, 45, 60, 72, 90, 120, 180]), arc = (th / 360) * circ(r);
      return Number.isInteger(arc) && arc > 4 ? { r, th, k: 360 / th, c: circ(r), arc, m: pick([0, 1]), p: person() } : null;
    },
    make: ({ r, th, k, c, arc, m, p }) => {
      const c1 = m === 0 ? c / 2 : c, f = m === 1 ? k : 1 / k;
      const a3 = m === 1 ? c1 * k : c1 / k;
      return {
        question: `${p.name} cuts a slice from a round cake of radius ${r} cm. The slice has an angle of ${th}° at its point. ${p.She} works out the length of the curved crust, using π = 22/7. Which step has the mistake?`,
        working: [
          { text: m === 0 ? `Circumference = 22/7 × ${r} = ${c1} cm` : `Circumference = 2 × 22/7 × ${r} = ${c1} cm`, ok: c1 === c },
          { text: m === 1 ? `Fraction of the circle: 360 ÷ ${th} = ${k}` : `Fraction of the circle: ${th} ÷ 360 = 1/${k}`, ok: f === 1 / k },
          { text: m === 1 ? `Arc = ${c1} × ${k} = ${a3} cm` : `Arc = ${c1} ÷ ${k} = ${a3} cm`, ok: near(a3, m === 1 ? c1 * f : c1 * f) },
        ],
        fix: m === 0 ? 'The circumference is 2 × π × radius. Step 1 left out the 2, so everything after it is half the right size.' : `The arc is ${th}/360 of the circle, a fraction smaller than 1. Step 2 turned it upside down, so the arc came out longer than the whole circle.`,
        steps: [`Circumference = 2 × 22/7 × ${r} = ${c} cm.`, `Fraction = ${th}/360 = 1/${k}.`, `Arc = ${c} ÷ ${k} = ${arc} cm.`],
      };
    } }),

  fam({ id: 'g8.sector.fence', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.c', rung: 2, form: 'word',
    draw: () => {
      const r = pick([7, 14, 21, 28, 35]), th = pick([45, 60, 90, 120, 180, 270]);
      const arc = (th / 360) * circ(r);
      if (!nice(arc) || arc < 5) return null;
      const per = arc + 2 * r;
      return uniq(per, arc, arc + r, circ(r) + 2 * r) ? { r, th, arc, per, p: person() } : null;
    },
    make: ({ r, th, arc, per, p }) => ({
      question: `${p.name}'s garden bed is a sector of a circle. The radius is ${r} m and the angle at the centre is ${th}°. A fence goes all the way round the edge of the bed. Find the perimeter of the bed, in metres. (Use π = 22/7)`,
      answer: per,
      wrong: [[arc, 'That is the curved edge only. The perimeter also has two straight edges.'], [arc + r, 'A sector has two straight edges, and each is a radius. Add both.'], [circ(r) + 2 * r, 'You used the whole circle for the curved edge. It is only a part of it.']],
      hints: ['Draw the sector. How many edges does it have, and which are straight?', 'The curved edge is an arc: a fraction of the circumference.'],
      steps: [`Arc: ${th}/360 × 2 × 22/7 × ${r} = ${arc} m.`, `Two straight edges: 2 × ${r} = ${2 * r} m.`, `Perimeter: ${arc} + ${2 * r} = ${per} m.`],
    }),
    check: ({ r, th }, a) => near(a - 2 * r, (th * 44 * r) / (7 * 360)) }),

  fam({ id: 'g8.sector.semicircle-radius', skill: 'G9_ARC_LENGTH', outcome: 'G8.CIRCLES.c', rung: 3, form: 'word',
    draw: () => {
      const k = randInt(1, 6), r = 7 * k, P = 36 * k;
      const w = [round((7 * P) / 22, 1), round((7 * P) / 29, 1), round((7 * P) / 58, 1)];
      return uniq(r, ...w) ? { r, P, w, p: person() } : null;
    },
    make: ({ r, P, w, p }) => ({
      question: `${p.name}'s plot is a half circle. Its perimeter is ${P} m. This is the curved edge plus the straight edge across the diameter. Find the radius of the plot, in metres. (Use π = 22/7)`,
      answer: r,
      wrong: [[w[0], 'You used the curved edge only. The straight edge is part of the perimeter too.'], [w[1], 'The straight edge is a diameter, which is 2 radii, not 1.'], [w[2], 'The curved edge of a half circle is half of 2πr, which is πr.']],
      hints: ['Write the perimeter in terms of r: the curved edge plus the diameter.', 'Curved edge = π × r. Diameter = 2 × r. Together they make (π + 2) × r.'],
      steps: [`Perimeter = 22/7 × r + 2r = 36/7 × r.`, `So ${P} = 36/7 × r.`, `r = ${P} × 7 ÷ 36 = ${r} m.`],
    }),
    check: ({ r, P }, a) => near(a * (22 / 7 + 2), P) }),

  // ================================================================ AREA
  fam({ id: 'g8.area.path-round-field', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.a', rung: 3, form: 'steps',
    draw: () => { const r = pick([14, 21, 28]), w = pick([7, 14]), R = r + w; return { r, w, R, A1: (22 * r * r) / 7, A2: (22 * R * R) / 7 }; },
    make: ({ r, w, R, A1, A2 }) => ({
      question: `A round football field has a radius of ${r} m. A path ${w} m wide goes all the way round the outside of the field. Use π = 22/7.`,
      parts: [
        { prompt: 'What is the area of the field, in m²?', answer: A1, unit: 'm²', hint: 'Area of a circle = π × radius × radius.', wrong: [[(44 * r) / 7, 'That is the distance round the field. Area is π × r × r.']] },
        { prompt: 'The field and the path together make a bigger circle. What is its radius, in metres?', answer: R, unit: 'm', hint: 'The path is added all round the edge.', wrong: [[r + 2 * w, 'The path is added once to the radius, not twice.'], [w, 'That is the width of the path only.']] },
        { prompt: 'What is the area of the path alone, in m²?', answer: A2 - A1, unit: 'm²', hint: 'Take the area of the field away from the area of the bigger circle.', wrong: [[(22 * w * w) / 7, 'That is the area of a circle as wide as the path. The path is a ring.'], [A2, 'That includes the field. Take the field away.']] },
      ],
      steps: [`Field: 22/7 × ${r} × ${r} = ${A1} m².`, `Bigger circle radius: ${r} + ${w} = ${R} m.`, `Bigger circle area: 22/7 × ${R} × ${R} = ${A2} m².`, `Path: ${A2} − ${A1} = ${A2 - A1} m².`],
    }),
    check: ({ r, w, A1, A2 }, v) => v[0] === A1 && v[1] === r + w && v[2] + A1 === A2 }),

  fam({ id: 'g8.area.arched-window', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.a', rung: 3, form: 'word',
    draw: () => {
      const w = pick([70, 140]), h = pick([100, 120, 150, 180]), r = w / 2, semi = (11 * w * w) / 28, rect = w * h;
      return uniq(rect + semi, rect + 2 * semi, rect, rect + (11 * w * w) / 7) ? { w, h, r, semi, rect } : null;
    },
    make: ({ w, h, r, semi, rect }) => ({
      question: `A church window is a rectangle ${w} cm wide and ${h} cm tall. On top of it sits a half circle whose flat side is the top of the rectangle. Find the area of glass in the whole window, in cm². (Use π = 22/7)`,
      answer: rect + semi,
      wrong: [[rect + 2 * semi, 'That adds a whole circle. Only half a circle sits on top.'], [rect, 'That is the rectangle only. The half circle on top has glass too.'], [rect + (11 * w * w) / 7, 'You used the whole width as the radius. The radius is half the width.']],
      hints: ['Split the window into two shapes: a rectangle and a half circle.', 'The flat side of the half circle is as long as the width. How does the radius relate to that?'],
      steps: [`Rectangle: ${w} × ${h} = ${rect} cm².`, `Radius of the half circle: ${w} ÷ 2 = ${r} cm.`, `Half circle: 1/2 × 22/7 × ${r} × ${r} = ${semi} cm².`, `Total: ${rect} + ${semi} = ${rect + semi} cm².`],
    }),
    check: ({ w, h }, a) => near(a, w * h + 0.5 * PI * (w / 2) ** 2) }),

  fam({ id: 'g8.area.double-radius', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.a', rung: 3, form: 'why',
    draw: () => ({ k: pick([3, 4, 5]), p: person() }),
    make: ({ k, p }) => ({
      question: `${p.name} digs a round fish pond. ${p.She} then digs a second round pond with a radius ${k} times as long. How many times as much water surface does the second pond have?`,
      options: [
        { text: `${k * k} times as much, because the radius is multiplied twice in π × r × r`, right: true },
        { text: `${k} times as much, because the radius is ${k} times as long`, right: false, why: 'The area uses the radius twice. A circle that is wider is also taller in every direction.' },
        { text: `${2 * k} times as much, because the area has a 2 in it`, right: false, why: 'The 2 belongs to the circumference, 2 × π × r. The area formula is π × r × r.' },
        { text: `${k * k * k} times as much, because the area is a cube`, right: false, why: 'A flat area uses two lengths multiplied, not three. Three lengths give a volume.' },
      ],
      hints: ['Try it: a pond with radius 1 unit, then one with radius multiplied by the number in the question.', 'Area = π × r × r. What happens to r × r when r is multiplied?'],
      steps: [`Area = π × r × r. Replace r with ${k} × r.`, `π × (${k}r) × (${k}r) = ${k * k} × π × r × r.`, `So the area is ${k * k} times as much.`],
    }) }),

  fam({ id: 'g8.sector.sprinkler-area', skill: 'G9_ARC_LENGTH', outcome: 'G8.AREA.b', rung: 2, form: 'word',
    draw: () => {
      const r = pick([7, 14, 21]), th = pick([30, 45, 60, 90, 120, 135, 180, 270]), A = (th / 360) * PI * r * r;
      if (!nice(A) || A < 10) return null;
      const w = [PI * r * r, (th / 360) * circ(r), round((th / 360) * PI * r, 1)];
      return uniq(A, ...w) ? { r, th, A, w } : null;
    },
    make: ({ r, th, A, w }) => ({
      question: `A sprinkler on a farm waters a sector-shaped patch of a field. It reaches ${r} m from the sprinkler and swings through ${th}°. What area does it water, in m²? (Use π = 22/7)`,
      answer: A,
      wrong: [[w[0], 'That is the whole circle. The sprinkler swings through only part of a full turn.'], [w[1], 'That is the length of the curved edge. Area uses the radius twice.'], [w[2], 'You used the radius once. Area of a circle = π × r × r.']],
      hints: ['What fraction of a full turn (360°) does the sprinkler swing through?', 'The area watered is that fraction of the area of the whole circle.'],
      steps: [`Whole circle: 22/7 × ${r} × ${r} = ${PI * r * r} m².`, `Fraction: ${th}/360.`, `Area watered: ${th}/360 × ${PI * r * r} = ${A} m².`],
    }),
    check: ({ r, th }, a) => near((a * 360) / th, (22 * r * r) / 7) }),

  fam({ id: 'g8.sector.find-angle', skill: 'G9_ARC_LENGTH', outcome: 'G8.AREA.b', rung: 3, form: 'word',
    draw: () => {
      const th = pick([60, 120, 240, 90, 270]), r = 21, A = round((th * 1386) / 360, 2);
      return nice(A) ? { th, r, A, w: [360 - th, round(A / 1386, 2), th / 2] } : null;
    },
    make: ({ th, r, A, w }) => ({
      question: `A floodlight on a school gate lights a sector of the compound. The light reaches ${r} m, and the area lit is ${A} m². Through what angle, in degrees, does the light spread? (Use π = 22/7)`,
      answer: th,
      wrong: [[w[0], 'That is the angle for the part of the compound that is NOT lit.'], [w[1], 'That is the fraction of the circle. Turn the fraction into degrees by multiplying by 360.'], [w[2], 'Check the area of the whole circle. It is π × r × r with no 2 and no half.']],
      hints: ['Find the area of the whole circle first.', 'The angle is the fraction (area lit ÷ whole circle) of 360°.'],
      steps: [`Whole circle: 22/7 × ${r} × ${r} = 1,386 m².`, `Fraction lit: ${A} ÷ 1,386.`, `Angle: that fraction × 360 = ${th}°.`],
    }),
    check: ({ th, r, A }, a) => near((A / 1386) * 360, a) && r === 21 }),

  fam({ id: 'g8.sector.fraction-why', skill: 'G9_ARC_LENGTH', outcome: 'G8.AREA.b', rung: 3, form: 'why',
    draw: () => { const th = pick([60, 90, 120, 45, 72]); return { th, n: 360 / th, p: person() }; },
    make: ({ th, n, p }) => ({
      question: `A round table cloth has a pattern. ${p.name} says a sector of angle ${th}° has exactly 1/${n} of the area of the whole circle, without using the radius. Why is that right?`,
      options: [
        { text: `A full turn is 360° and ${th}° is 1/${n} of 360°, and area is shared out in the same fractions as angle`, right: true },
        { text: `${th}° means ${th}% of the circle, and ${th}% is 1/${n}`, right: false, why: 'A full turn is 360°, not 100°. Degrees are not per cent.' },
        { text: 'The area of any sector is always half of the circle', right: false, why: 'Only a half circle, 180°, has half the area. The fraction depends on the angle.' },
        { text: `The radius cancels, so the area is ${th} ÷ 100 of the circle`, right: false, why: 'The radius does not cancel like that. The angle is compared with the 360° of a full turn.' },
      ],
      hints: ['How many degrees are there in a full turn?', 'Write the angle of the sector as a fraction of that.'],
      steps: [`A full turn is 360°.`, `${th}/360 = 1/${n}.`, `Equal turns cut equal slices, so the sector is 1/${n} of the circle's area.`],
    }) }),

  fam({ id: 'g8.surface.carton-table', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.c', rung: 2, form: 'table',
    draw: () => {
      for (let t = 0; t < 3000; t++) {
        const sizes = [0, 1, 2].map(() => [randInt(2, 8) * 5, randInt(2, 8) * 5, randInt(2, 8) * 5]);
        const sa = sizes.map(([l, w, h]) => 2 * (l * w + l * h + w * h)), vol = sizes.map(([l, w, h]) => l * w * h);
        const top = sa.indexOf(Math.max(...sa)), topV = vol.indexOf(Math.max(...vol));
        if (new Set(sa).size === 3 && new Set(vol).size === 3 && top !== topV) return { sizes, sa, top };
      }
      return null;
    },
    make: ({ sizes, sa, top }) => {
      const L = ['A', 'B', 'C'];
      return {
        question: 'A factory makes closed cartons from card. The table shows three cuboid cartons. Which carton needs the most card, with no overlaps?', story: true,
        model: { type: 'table', data: { head: ['Carton', 'Length (cm)', 'Width (cm)', 'Height (cm)'], rows: sizes.map((s, i) => ({ cells: [L[i], ...s.map(String)] })) } },
        options: L.map((x, i) => ({ text: `Carton ${x}`, right: i === top, why: i === top ? undefined : `Carton ${x} has a surface area of ${sa[i]} cm². Work out all three and compare them.` })),
        hints: ['The card covers every face, so find the surface area of each carton.', 'A cuboid has three pairs of equal faces: length × width, length × height, width × height.'],
        steps: sizes.map((s, i) => `Carton ${L[i]}: 2 × (${s[0]}×${s[1]} + ${s[0]}×${s[2]} + ${s[1]}×${s[2]}) = ${sa[i]} cm².`).concat([`The largest is Carton ${L[top]}.`]),
      };
    } }),

  fam({ id: 'g8.surface.classroom-paint', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.c', rung: 3, form: 'steps',
    draw: () => {
      const l = pick([8, 9, 10, 12]), w = pick([6, 7, 8]), h = pick([3, 4]), o = pick([6, 8, 10, 12]), cov = pick([8, 10, 12]);
      const walls = 2 * (l + w) * h, ceil = l * w, paint = walls + ceil - o;
      return paint % cov === 0 ? { l, w, h, o, cov, walls, ceil, paint, lit: paint / cov } : null;
    },
    make: ({ l, w, h, o, cov, walls, ceil, paint, lit }) => ({
      question: `A classroom is a cuboid, ${l} m long, ${w} m wide and ${h} m high. The four walls and the ceiling are to be painted. The doors and windows cover ${o} m² and are not painted. One litre of paint covers ${cov} m².`,
      parts: [
        { prompt: 'What is the area of the four walls, in m²?', answer: walls, unit: 'm²', hint: 'The walls make a long strip: the distance round the floor times the height.', wrong: [[l * w, 'That is the floor or ceiling. The walls stand around it.'], [(l + w) * h, 'There are four walls: two of each size.']] },
        { prompt: 'What is the area of the ceiling, in m²?', answer: ceil, unit: 'm²', hint: 'The ceiling is a rectangle the same size as the floor.', wrong: [[l + w, 'Area is length times width.']] },
        { prompt: 'What area must be painted, in m²?', answer: paint, unit: 'm²', hint: 'Add the walls and ceiling. Then take away the doors and windows.', wrong: [[walls + ceil, 'The doors and windows are not painted. Take them away.'], [walls + ceil + o, 'Take the doors and windows away, do not add them.']] },
        { prompt: 'How many litres of paint are needed?', answer: lit, unit: 'litres', hint: 'How many lots of the coverage of one litre fit into the area?', wrong: [[paint * cov, 'One litre covers a fixed area. Divide to find how many litres.']] },
      ],
      steps: [`Walls: 2 × (${l} + ${w}) × ${h} = ${walls} m².`, `Ceiling: ${l} × ${w} = ${ceil} m².`, `To paint: ${walls} + ${ceil} − ${o} = ${paint} m².`, `Paint: ${paint} ÷ ${cov} = ${lit} litres.`],
    }),
    check: ({ l, w, h, o, cov }, v) => v[0] === 2 * h * (l + w) && v[1] === l * w && v[2] === v[0] + v[1] - o && v[3] * cov === v[2] }),

  fam({ id: 'g8.surface.spot-cuboid', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.c', rung: 2, form: 'spot',
    draw: () => {
      const l = randInt(4, 12), w = randInt(3, 9), h = randInt(2, 8);
      return new Set([l, w, h]).size === 3 ? { l, w, h, m: randInt(0, 2), p: person() } : null;
    },
    make: ({ l, w, h, m, p }) => {
      const faces = [[l, w, 'Top and bottom'], [l, h, 'Front and back'], [w, h, 'Two sides']];
      const shown = faces.map(([a, b], i) => (i === m ? a * b : 2 * a * b));
      const total = shown[0] + shown[1] + shown[2];
      return {
        question: `${p.name} wraps a gift in paper with no overlap. The gift is a box shaped like a cuboid, ${l} cm by ${w} cm by ${h} cm. ${p.She} works out how much paper covers the box. Which step has the mistake?`,
        working: [
          ...faces.map(([a, b, name], i) => ({ text: i === m ? `${name}: ${a} × ${b} = ${a * b} cm²` : `${name}: 2 × ${a} × ${b} = ${2 * a * b} cm²`, ok: shown[i] === 2 * a * b })),
          { text: `Total: ${shown[0]} + ${shown[1]} + ${shown[2]} = ${total} cm²`, ok: shown[0] + shown[1] + shown[2] === total },
        ],
        fix: `${faces[m][2]} is two faces, one on each side, so the area of one face must be doubled. That step used only one face.`,
        steps: [`Top and bottom: 2 × ${l} × ${w} = ${2 * l * w} cm².`, `Front and back: 2 × ${l} × ${h} = ${2 * l * h} cm².`, `Two sides: 2 × ${w} × ${h} = ${2 * w * h} cm².`, `Total = ${2 * (l * w + l * h + w * h)} cm².`],
      };
    } }),

  fam({ id: 'g8.surface.open-water-tank', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.d', rung: 2, form: 'word',
    draw: () => {
      const r = pick([35, 70]), h = pick([80, 100, 120, 150]), base = (22 * r * r) / 7, side = 2 * PI * r * h;
      return uniq(base + side, base * 2 + side, side, PI * r * r * h) ? { r, h, base, side } : null;
    },
    make: ({ r, h, base, side }) => ({
      question: `A welder makes a water tank from metal sheet. The tank is a cylinder with a round base and no lid. Its radius is ${r} cm and its height is ${h} cm. How much sheet metal is needed, in cm²? (Use π = 22/7)`,
      answer: base + side,
      wrong: [[base * 2 + side, 'That has two circles. This tank has a base only, no lid.'], [side, 'That is the curved side only. The base needs metal too.'], [round(PI * r * r * h, 0), 'That is the volume, how much water it holds. The question asks for the metal.']],
      hints: ['Count the pieces of metal: a curved side and how many circles?', 'Curved side = 2 × π × r × h. One circle = π × r × r.'],
      steps: [`Curved side: 2 × 22/7 × ${r} × ${h} = ${side} cm².`, `Base, one circle: 22/7 × ${r} × ${r} = ${base} cm².`, `Total: ${side} + ${base} = ${base + side} cm².`],
    }),
    check: ({ r, h }, a) => near(a, PI * r * (r + 2 * h)) }),

  fam({ id: 'g8.surface.tin-label', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.d', rung: 2, form: 'word',
    draw: () => {
      const d = pick([7, 14, 21]), h = pick([8, 10, 12, 15]), a = (22 * d * h) / 7;
      return uniq(a, 2 * a, a + 2 * PI * (d / 2) ** 2, (d / 2) * h) ? { d, h, a, p: person() } : null;
    },
    make: ({ d, h, a, p }) => ({
      question: `${p.name} wraps a paper label once round the curved side of a tin of beans. The tin is a cylinder ${d} cm across and ${h} cm tall. The label has no overlap. What is the area of the label, in cm²? (Use π = 22/7)`,
      answer: a,
      wrong: [[2 * a, 'You used the diameter where the formula needs the radius.'], [a + 2 * PI * (d / 2) ** 2, 'That adds the top and bottom circles. The label covers the curved side only.'], [(d / 2) * h, 'That misses the distance round the tin. The label is as long as the circumference.']],
      hints: ['Picture the label unrolled flat. What shape is it?', 'Its length is the distance round the tin, and its width is the height of the tin.'],
      steps: [`Length of the label: π × ${d} = ${(22 * d) / 7} cm, the circumference.`, `Area: ${(22 * d) / 7} × ${h} = ${a} cm².`],
    }),
    check: ({ d, h }, a) => near(a / h, PI * d) }),

  fam({ id: 'g8.prism.tent', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.e', rung: 3, form: 'word',
    draw: () => {
      const [a, h, s] = pick([[1.5, 2, 2.5], [3, 4, 5], [2, 1.5, 2.5]]), L = pick([3, 4, 5, 6]);
      const ends = 2 * a * h, slopes = 2 * s * L, floor = 2 * a * L, tot = ends + slopes + floor;
      return uniq(tot, tot - floor, tot - ends, 2 * a * s + slopes + floor) ? { a, h, s, L, ends, slopes, floor, tot, p: person() } : null;
    },
    make: ({ a, h, s, L, ends, slopes, floor, tot, p }) => ({
      question: `${p.name}'s camping tent is a triangular prism lying on its side. Each triangular end is ${2 * a} m wide at the floor and ${h} m high. Each sloping side is ${s} m from the floor to the top, and the tent is ${L} m long. The floor is sewn in. How much cloth is needed for the whole tent, in m²?`,
      answer: tot,
      wrong: [[tot - floor, 'The floor is sewn in, so it needs cloth too.'], [tot - ends, 'The two triangular ends need cloth as well as the sloping sides.'], [2 * a * s + slopes + floor, 'The area of each triangle uses the height (the straight up measure), not the sloping side.']],
      hints: ['List the faces: two triangles, two sloping rectangles, and the floor.', 'Each triangle is half of base × height. Each sloping side is the sloping length × the length of the tent.'],
      steps: [`Two triangles: 2 × 1/2 × ${2 * a} × ${h} = ${ends} m².`, `Two sloping sides: 2 × ${s} × ${L} = ${slopes} m².`, `Floor: ${2 * a} × ${L} = ${floor} m².`, `Total: ${ends} + ${slopes} + ${floor} = ${tot} m².`],
    }),
    check: ({ a, h, s, L }, v) => near(v, a * h * 2 + L * (2 * s + 2 * a)) }),

  fam({ id: 'g8.prism.table-faces', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.e', rung: 2, form: 'table',
    draw: () => {
      const [b, h, s] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]), L = pick([10, 12, 15, 20]);
      const tot = b * h + (b + h + s) * L;
      return uniq(tot, tot - (b * h) / 2, tot + b * h, tot - s * L) ? { b, h, s, L, tot } : null;
    },
    make: ({ b, h, s, L, tot }) => ({
      question: 'The table lists the faces of a closed triangular prism made from card. What is the total surface area of the prism, in cm²?',
      model: { type: 'table', data: { head: ['Face', 'How many', 'Measures (cm)'], rows: [{ cells: ['Triangle', '2', `base ${b}, height ${h}`] }, { cells: ['Rectangle', '1', `${b} by ${L}`] }, { cells: ['Rectangle', '1', `${h} by ${L}`] }, { cells: ['Rectangle', '1', `${s} by ${L}`] }] } },
      answer: tot,
      wrong: [[tot - (b * h) / 2, 'There are two triangles in the table. Count both.'], [tot + b * h, 'The area of a triangle is half of base × height.'], [tot - s * L, 'Use all three rectangles in the table.']],
      hints: ['Work out the area of one of each kind of face. Then use the "How many" column.', 'Area of a triangle = 1/2 × base × height. Area of a rectangle = length × width.'],
      steps: [`Triangles: 2 × 1/2 × ${b} × ${h} = ${b * h} cm².`, `Rectangles: ${b}×${L} + ${h}×${L} + ${s}×${L} = ${(b + h + s) * L} cm².`, `Total: ${b * h} + ${(b + h + s) * L} = ${tot} cm².`],
    }),
    check: ({ b, h, s, L }, a) => near(a, b * h + L * b + L * h + L * s) }),

  fam({ id: 'g8.prism.spot-working', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.e', rung: 2, form: 'spot',
    draw: () => { const [b, h, s] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); return { b, h, s, L: pick([10, 12, 15, 20]), m: pick([0, 1]), p: person() }; },
    make: ({ b, h, s, L, m, p }) => {
      const tri = m === 0 ? b * h : (b * h) / 2, two = 2 * tri, rectLen = m === 1 ? b + h : b + h + s, rect = rectLen * L, tot = two + rect;
      return {
        question: `${p.name} finds the total surface area of a closed triangular prism. The ends are right-angled triangles with sides ${b} cm, ${h} cm and ${s} cm. The prism is ${L} cm long. Which step has the mistake?`,
        working: [
          { text: m === 0 ? `One triangle: ${b} × ${h} = ${tri} cm²` : `One triangle: 1/2 × ${b} × ${h} = ${tri} cm²`, ok: tri === (b * h) / 2 },
          { text: `Two triangles: 2 × ${tri} = ${two} cm²`, ok: two === 2 * tri },
          { text: m === 1 ? `Three rectangles: (${b} + ${h}) × ${L} = ${rect} cm²` : `Three rectangles: (${b} + ${h} + ${s}) × ${L} = ${rect} cm²`, ok: rectLen === b + h + s },
          { text: `Total: ${two} + ${rect} = ${tot} cm²`, ok: tot === two + rect },
        ],
        fix: m === 0 ? 'The area of a triangle is half of base × height. Step 1 left out the half.' : 'There are three rectangles, one for each side of the triangle. Step 3 used only two of the sides.',
        steps: [`One triangle: 1/2 × ${b} × ${h} = ${(b * h) / 2} cm².`, `Two triangles: ${b * h} cm².`, `Three rectangles: (${b} + ${h} + ${s}) × ${L} = ${(b + h + s) * L} cm².`, `Total: ${b * h + (b + h + s) * L} cm².`],
      };
    } }),

  fam({ id: 'g8.grid.count-squares', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.f', rung: 2, form: 'table',
    draw: () => { const F = randInt(18, 60), P = 2 * randInt(4, 12); return { F, P, p: person() }; },
    make: ({ F, P, p }) => ({
      question: `${p.name} traces the outline of a leaf on a grid. The leaf has an irregular shape. Each square of the grid is 1 cm². The table shows how many squares were counted. A part square is counted as half a square. Estimate the area of the leaf, in cm².`,
      model: { type: 'table', data: { head: ['Squares', 'Number'], rows: [{ label: 'Whole squares', value: String(F) }, { label: 'Part squares', value: String(P) }] } },
      answer: F + P / 2,
      wrong: [[F + P, 'A part square is only part of a square. Count each as half.'], [F, 'The part squares cover some of the leaf too. Add half of them.'], [P / 2, 'That is the part squares only. Add the whole squares as well.']],
      hints: ['Whole squares count as one each. Part squares count as one half each.', 'Add the two amounts together.'],
      steps: [`Part squares as half: ${P} ÷ 2 = ${P / 2}.`, `Area: ${F} + ${P / 2} = ${F + P / 2} cm².`],
    }),
    check: ({ F, P }, a) => 2 * a === 2 * F + P }),

  fam({ id: 'g8.grid.scaled-plot', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.f', rung: 3, form: 'steps',
    draw: () => { const side = pick([2, 5, 10]), F = randInt(15, 50), P = 2 * randInt(4, 10); return { side, F, P }; },
    make: ({ side, F, P }) => ({
      question: `The outline of an irregular plot of land is drawn on a square grid. Each square of the grid stands for ${side} m by ${side} m. The outline covers ${F} whole squares and ${P} part squares. Count the part squares as half squares.`,
      parts: [
        { prompt: 'How many m² does one square stand for?', answer: side * side, unit: 'm²', hint: 'Area of a square = side × side.', wrong: [[side * 4, 'That is the distance round one square. Area is side × side.'], [side, 'Multiply the side by itself to get the area.']] },
        { prompt: 'How many whole squares is the plot, if part squares count as half?', answer: F + P / 2, hint: 'Add half of the part squares to the whole squares.', wrong: [[F + P, 'Count each part square as half.'], [F, 'Add half of the part squares.']] },
        { prompt: 'What is the estimated area of the plot, in m²?', answer: (F + P / 2) * side * side, unit: 'm²', hint: 'Multiply the number of squares by the area of one square.', wrong: [[(F + P / 2) * side, 'Each square stands for an area of side × side, not just the side.']] },
      ],
      steps: [`One square: ${side} × ${side} = ${side * side} m².`, `Squares: ${F} + ${P} ÷ 2 = ${F + P / 2}.`, `Area: ${F + P / 2} × ${side * side} = ${(F + P / 2) * side * side} m².`],
    }),
    check: ({ side, F, P }, v) => v[0] === side * side && 2 * v[1] === 2 * F + P && v[2] === v[1] * v[0] }),

  fam({ id: 'g8.grid.compare-fields', skill: 'G8_AREA_COMPOSITE', outcome: 'G8.AREA.f', rung: 3, form: 'table',
    draw: () => {
      for (let t = 0; t < 3000; t++) {
        const fs = [0, 1, 2].map(() => [randInt(12, 40), 2 * randInt(2, 14)]);
        const est = fs.map(([F, P]) => F + P / 2), tch = fs.map(([F, P]) => F + P), whole = fs.map(([F]) => F);
        const i = est.indexOf(Math.max(...est));
        if (new Set(est).size === 3 && tch.indexOf(Math.max(...tch)) !== i && whole.indexOf(Math.max(...whole)) !== i) return { fs, est, i };
      }
      return null;
    },
    make: ({ fs, est, i }) => {
      const L = ['A', 'B', 'C'];
      return {
        question: 'Three irregular fields are drawn on the same grid. The table shows the squares counted for each field. A part square counts as half. Which field has the largest area?', story: true,
        model: { type: 'table', data: { head: ['Field', 'Whole squares', 'Part squares'], rows: fs.map((f, j) => ({ cells: [L[j], String(f[0]), String(f[1])] })) } },
        options: L.map((x, j) => ({ text: `Field ${x}`, right: j === i, why: j === i ? undefined : `Field ${x} comes to ${est[j]} squares when part squares count as half. Find the estimate for every field before you compare.` })),
        hints: ['Find an estimate for each field: whole squares plus half of the part squares.', 'Compare the three estimates.'],
        steps: fs.map((f, j) => `Field ${L[j]}: ${f[0]} + ${f[1]} ÷ 2 = ${est[j]} squares.`).concat([`The largest is Field ${L[i]}.`]),
      };
    } }),

  // ================================================================ MONEY
  fam({ id: 'g8.money.compound-two-years', skill: 'G8_SIMPLE_INTEREST', outcome: 'G8.MONEY.c', rung: 2, form: 'word',
    draw: () => {
      const r = pick([5, 10, 20]), P = r === 5 ? pick([4000, 8000, 12000, 16000, 20000]) : pick([5000, 10000, 20000, 25000, 40000]);
      const A = (P * (100 + r) * (100 + r)) / 10000;
      if (!Number.isInteger(A)) return null;
      const simple = (P * (100 + 2 * r)) / 100, one = (P * (100 + r)) / 100;
      return uniq(A, simple, one, A - P) ? { r, P, A, simple, one, p: person() } : null;
    },
    make: ({ r, P, A, simple, one, p }) => ({
      question: `${p.name} puts ${sh(P)} into a SACCO account. The SACCO pays compound interest of ${r}% a year. ${p.She} takes nothing out. How much is in the account after 2 years?`,
      answer: A,
      wrong: [[simple, 'That is simple interest: the same interest each year on the first amount. Compound interest in year 2 is worked out on the new amount.'], [one, 'That is the amount after 1 year only. The money stays in for 2 years.'], [A - P, 'That is only the interest earned. The question asks for all the money in the account.']],
      hints: ['After year 1, the interest is added to the money. Year 2 starts with the bigger amount.', 'Find the amount after year 1. Then find the interest on that amount.'],
      steps: [`Year 1: ${P} × ${(100 + r) / 100} = ${one}.`, `Year 2: ${one} × ${(100 + r) / 100} = ${A}.`, `The account holds ${sh(A)}.`],
    }),
    check: ({ r, P }, a) => near((a * 100 * 100) / ((100 + r) * (100 + r)), P) }),

  fam({ id: 'g8.money.compound-steps', skill: 'G8_SIMPLE_INTEREST', outcome: 'G8.MONEY.c', rung: 3, form: 'steps',
    draw: () => {
      const r = pick([5, 10, 20]), P = r === 5 ? pick([4000, 8000, 16000]) : pick([5000, 10000, 20000]);
      const A1 = (P * (100 + r)) / 100, I2 = (A1 * r) / 100, A2 = A1 + I2;
      return [A1, I2, A2].every(Number.isInteger) ? { r, P, A1, I2, A2 } : null;
    },
    make: ({ r, P, A1, I2, A2 }) => ({
      question: `A chama invests ${sh(P)} for 2 years. It earns compound interest of ${r}% a year, and the interest is added to the money at the end of each year.`,
      parts: [
        { prompt: 'How much money is there at the end of year 1, in shillings?', answer: A1, unit: 'sh', hint: 'Add the first year\'s interest to the money put in.', wrong: [[(P * r) / 100, 'That is the interest only. The money put in stays in the account.']] },
        { prompt: 'How much interest is earned in year 2, in shillings?', answer: I2, unit: 'sh', hint: 'Year 2 interest is worked out on the money at the end of year 1.', wrong: [[(P * r) / 100, 'That is the interest on the first amount. In year 2 the money is bigger.']] },
        { prompt: 'How much money is there at the end of year 2, in shillings?', answer: A2, unit: 'sh', hint: 'Add the year 2 interest to the money at the end of year 1.', wrong: [[P + 2 * ((P * r) / 100), 'That is simple interest. Year 2 earned more than year 1.']] },
        { prompt: 'How much compound interest was earned altogether, in shillings?', answer: A2 - P, unit: 'sh', hint: 'Compare the final amount with the amount first put in.', wrong: [[A2, 'That is all the money. Take away what was put in.']] },
      ],
      steps: [`Year 1: ${P} × ${(100 + r) / 100} = ${A1}.`, `Year 2 interest: ${r}% of ${A1} = ${I2}.`, `End of year 2: ${A1} + ${I2} = ${A2}.`, `Interest altogether: ${A2} − ${P} = ${A2 - P}.`],
    }),
    check: ({ r, P }, v) => v[0] === P + (P * r) / 100 && v[1] === (v[0] * r) / 100 && v[2] === v[0] + v[1] && v[3] + P === v[2] }),

  fam({ id: 'g8.money.compound-why', skill: 'G8_SIMPLE_INTEREST', outcome: 'G8.MONEY.c', rung: 3, form: 'why',
    draw: () => { const P = pick([10000, 20000, 30000, 50000]), [a, b] = twoPeople(); return { P, a, b, simple: P * 1.3, comp: P * 1.331 }; },
    make: ({ P, a, b, simple, comp }) => ({
      question: `${a.name} and ${b.name} each save ${sh(P)} for 3 years at 10% a year. ${a.name}'s account pays simple interest and ends with ${sh(simple)}. ${b.name}'s account pays compound interest and ends with ${sh(comp)}. Why does ${b.name} end with more?`,
      options: [
        { text: `Each year ${b.her} interest is added to the money, so next year's interest is worked out on a bigger amount`, right: true },
        { text: `${b.Her} account has a higher rate than ${a.her} account`, right: false, why: 'Both accounts pay 10% a year. The rate is the same. It is the way the interest is worked out that differs.' },
        { text: `Simple interest is only paid in the first year`, right: false, why: 'Simple interest is paid every year, but always on the amount first saved.' },
        { text: `Compound interest is paid each month, not each year`, right: false, why: 'Here the interest is paid once a year in both accounts. The difference is what the interest is worked out on.' },
      ],
      hints: ['Both accounts have the same rate and the same time. What is different about how the interest is worked out?', 'Look at what the interest in year 2 is calculated on.'],
      steps: [`Simple interest: 10% of ${sh(P)} each year, always the same.`, `Compound interest: year 2 interest is 10% of the larger amount from year 1.`, 'The interest earns interest, so the compound account grows faster.'],
    }) }),

  fam({ id: 'g8.money.depreciate-motorcycle', skill: 'G8_PROFIT_LOSS', outcome: 'G8.MONEY.d', rung: 2, form: 'word',
    draw: () => {
      const P = price('motorcycle'), r = pick([10, 20]), V = (P * (100 - r) * (100 - r)) / 10000;
      if (!Number.isInteger(V)) return null;
      const simple = (P * (100 - 2 * r)) / 100, one = (P * (100 - r)) / 100;
      return uniq(V, simple, one, P - V) ? { P, r, V, simple, one, p: person() } : null;
    },
    make: ({ P, r, V, simple, one, p }) => ({
      question: `${p.name} buys a boda boda motorcycle for ${sh(P)}. The motorcycle loses ${r}% of its value each year. What is its value after 2 years?`,
      answer: V,
      wrong: [[simple, `Taking ${r}% of the first price twice is not right. The second ${r}% is taken from the smaller value after year 1.`], [one, 'That is the value after 1 year. The question asks about 2 years.'], [P - V, 'That is how much value has been lost. The question asks for what is left.']],
      hints: ['Find the value after year 1. Year 2 starts from that smaller value.', `Each year the motorcycle keeps ${100 - r}% of its value.`],
      steps: [`Year 1: ${P} × ${(100 - r) / 100} = ${one}.`, `Year 2: ${one} × ${(100 - r) / 100} = ${V}.`],
    }),
    check: ({ P, r }, a) => near((a * 10000) / ((100 - r) * (100 - r)), P) }),

  fam({ id: 'g8.money.depreciate-table', skill: 'G8_PROFIT_LOSS', outcome: 'G8.MONEY.d', rung: 3, form: 'table',
    draw: () => {
      const P = pick([40000, 50000, 60000, 64000, 80000]), r = pick([10, 20, 25]), k = (100 - r) / 100;
      const V1 = P * k, V2 = V1 * k, V3 = V2 * k;
      if (![V1, V2, V3].every(Number.isInteger)) return null;
      const w = [P - 3 * (P - V1), 2 * V2 - V1, V2 - (r / 100) * P];
      return uniq(V3, ...w) && w.every(x => x > 0) ? { P, r, V1, V2, V3, w } : null;
    },
    make: ({ P, V1, V2, V3, w }) => ({
      question: 'The table shows the value of a fridge as it gets older. The value falls by the same per cent each year. What is its value after 3 years, in shillings?',
      model: { type: 'table', data: { head: ['Age of the fridge', 'Value (sh)'], rows: [{ label: 'New', value: commas(P) }, { label: 'After 1 year', value: commas(V1) }, { label: 'After 2 years', value: commas(V2) }, { label: 'After 3 years', value: '?' }] } },
      answer: V3,
      wrong: [[w[0], 'The value does not fall by the same amount each year. It falls by the same per cent, so the fall gets smaller.'], [w[1], 'Each year\'s fall is a per cent of that year\'s value. The fall is smaller in year 3 than in year 2.'], [w[2], 'The per cent is taken from the value at the start of year 3, not from the price when new.']],
      hints: ['First find the per cent by which the value falls: compare year 1 with new.', 'Then take that per cent off the value after 2 years.'],
      steps: [`${V1} ÷ ${P} = ${V1 / P}, so the fridge keeps ${(V1 / P) * 100}% of its value each year.`, `After 3 years: ${V2} × ${V1 / P} = ${V3}.`],
    }),
    check: ({ P, V1, V3 }, a) => near(a * P * P, V1 * V1 * V1) && V3 > 0 }),

  fam({ id: 'g8.money.depreciate-why', skill: 'G8_PROFIT_LOSS', outcome: 'G8.MONEY.d', rung: 3, form: 'why',
    draw: () => { const r = pick([10, 20, 30]), P = 10000, V2 = (P * (100 - r) * (100 - r)) / 10000; return { r, P, V2, tot: 2 * r, real: 2 * r - (r * r) / 100, wrongUp: 2 * r + (r * r) / 100, p: person() }; },
    make: ({ r, P, V2, tot, real, wrongUp, p }) => ({
      question: `A phone costs ${sh(P)} new. It loses ${r}% of its value in year 1 and another ${r}% of its value in year 2. ${p.name} says it has lost ${tot}% of its price altogether. Why is that wrong?`,
      options: [
        { text: `The second ${r}% is taken from the smaller value after year 1, so the loss is ${real}%, which is less than ${tot}%`, right: true },
        { text: `The loss should be ${wrongUp}%, because the second ${r}% is taken from a bigger value`, right: false, why: 'After a fall, the value is smaller, not bigger. The second year\'s loss is taken from the smaller value.' },
        { text: `The phone only loses value in the first year`, right: false, why: 'The question says it loses value in year 2 as well.' },
        { text: `Per cent changes can never be added`, right: false, why: 'They can be added when they are all taken from the same starting value. Here the starting value changes.' },
      ],
      hints: [`Work out the value after year 1, then the value after year 2, in shillings.`, 'Compare the total loss in shillings with the price when new.'],
      steps: [`Year 1: ${P} − ${r}% = ${(P * (100 - r)) / 100}.`, `Year 2: ${(P * (100 - r)) / 100} − ${r}% = ${V2}.`, `Loss: ${P - V2} out of ${P} is ${real}%, not ${tot}%.`],
    }) }),

  fam({ id: 'g8.money.hp-extra', skill: 'G8_PROFIT_LOSS', outcome: 'G8.MONEY.e', rung: 2, form: 'word',
    draw: () => {
      const item = pick(['television', 'fridge', 'sewing machine']), C = price(item), D = C * pick([0.2, 0.25, 0.1]), n = pick([6, 8, 10, 12]);
      if (!Number.isInteger(D)) return null;
      const m = Math.ceil(((C - D) * pick([1.1, 1.15, 1.2])) / n / 50) * 50, T = D + n * m;
      return uniq(T - C, T, C - D, n * m) && T > C ? { item, C, D, n, m, T, p: person() } : null;
    },
    make: ({ item, C, D, n, m, T, p }) => ({
      question: `A ${item} has a cash price of ${sh(C)}. ${p.name} buys it on hire purchase. ${p.She} pays a deposit of ${sh(D)}, then ${n} monthly instalments of ${sh(m)}. How much more than the cash price does ${p.she} pay altogether?`,
      answer: T - C,
      wrong: [[T, 'That is the total paid. The question asks how much MORE than the cash price.'], [C - D, 'That is the balance after the deposit, not the extra that hire purchase costs.'], [n * m, 'That is the instalments only. The deposit is paid too.']],
      hints: ['Find the total paid on hire purchase: the deposit and all the instalments.', 'Compare that total with the cash price.'],
      steps: [`Instalments: ${n} × ${m} = ${n * m}.`, `Total paid: ${D} + ${n * m} = ${T}.`, `Extra: ${T} − ${C} = ${T - C}.`],
    }),
    check: ({ C, D, n, m }, a) => C + a === D + n * m }),

  fam({ id: 'g8.money.hp-plans', skill: 'G8_PROFIT_LOSS', outcome: 'G8.MONEY.e', rung: 3, form: 'table',
    draw: () => {
      for (let t = 0; t < 3000; t++) {
        const C = price('television'), plans = [0, 1, 2].map(() => {
          const D = C * pick([0.1, 0.2, 0.25, 0.3]), n = pick([6, 9, 12, 18]);
          return Number.isInteger(D) ? { D, n, m: Math.ceil(((C - D) * pick([1.05, 1.1, 1.15, 1.2, 1.3])) / n / 50) * 50 } : null;
        });
        if (plans.some(x => !x)) continue;
        const tot = plans.map(x => x.D + x.n * x.m), lowM = plans.map(x => x.m);
        const best = tot.indexOf(Math.min(...tot));
        if (new Set(tot).size === 3 && new Set(lowM).size === 3 && lowM.indexOf(Math.min(...lowM)) !== best) return { plans, tot, best };
      }
      return null;
    },
    make: ({ plans, tot, best }) => {
      const L = ['A', 'B', 'C'];
      return {
        question: 'A shop sells the same television in three hire purchase plans, shown in the table. Which plan costs the least altogether?', story: true,
        model: { type: 'table', data: { head: ['Plan', 'Deposit (sh)', 'Monthly payment (sh)', 'Months'], rows: plans.map((x, i) => ({ cells: [L[i], commas(x.D), commas(x.m), String(x.n)] })) } },
        options: L.map((x, i) => ({ text: `Plan ${x}`, right: i === best, why: i === best ? undefined : `Plan ${x} costs ${sh(tot[i])} altogether. Add the deposit and all the monthly payments for every plan, then compare.` })),
        hints: ['For each plan, the total is the deposit plus all the monthly payments.', 'A low monthly payment can still cost more if it is paid for many months.'],
        steps: plans.map((x, i) => `Plan ${L[i]}: ${commas(x.D)} + ${x.n} × ${commas(x.m)} = ${commas(tot[i])}.`).concat([`The least is Plan ${L[best]}.`]),
      };
    } }),

  // ================================================================ CONSTRUCTIONS
  fam({ id: 'g8.construct.ray-parts', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.b', rung: 1, form: 'direct',
    draw: () => { const [a, b] = pick([[2, 3], [3, 4], [1, 4], [3, 5], [2, 5], [4, 5], [1, 3]]); return uniq(a + b, a * b, a, b) ? { a, b } : null; },
    make: ({ a, b }) => ({
      question: `You divide a line AB in the ratio ${a}:${b}. You draw a ray from A and mark equal parts along it with compasses. How many equal parts do you mark on the ray altogether?`, story: false,
      answer: a + b,
      wrong: [[a * b, 'The parts of the ratio are added to make the total number of equal parts, not multiplied.'], [a, `That is only the first part of the ratio. The ray must hold both parts.`], [b, 'That is only the second part of the ratio. The ray must hold both parts.']],
      hints: ['A ratio of two numbers splits a line into that many equal parts, shared between the two sides.', 'How many equal parts are in the whole line?'],
      steps: [`The ratio ${a}:${b} has ${a} parts and ${b} parts.`, `Altogether: ${a} + ${b} = ${a + b} equal parts.`],
    }),
    check: ({ a, b }, v) => v - a === b }),

  fam({ id: 'g8.construct.divide-fence', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.b', rung: 2, form: 'steps',
    draw: () => { const [a, b] = pick([[2, 3], [3, 4], [1, 4], [3, 2], [2, 5], [4, 1]]), k = pick([2, 3, 4, 5]); return { a, b, k, L: (a + b) * k, p: person() }; },
    make: ({ a, b, k, L, p }) => ({
      question: `On a drawing, a boundary AB is ${L} cm long. ${p.name} shares it between two plots in the ratio ${a}:${b}, using the method of equal parts.`,
      parts: [
        { prompt: 'How many equal parts are marked on the ray?', answer: a + b, hint: 'Add the two numbers of the ratio.', wrong: [[a * b, 'Add the numbers of the ratio, do not multiply.']] },
        { prompt: 'The equal parts cut AB into equal pieces. How long is one piece, in cm?', answer: k, unit: 'cm', hint: 'Share the length of AB equally between all the parts.', wrong: [[L - a - b, 'Divide the length by the number of parts.'], [L * (a + b), 'Divide the length by the number of parts.']] },
        { prompt: `How far is the dividing point from A, in cm? (The part next to A has ${a} pieces.)`, answer: a * k, unit: 'cm', hint: 'Count the pieces from A up to the dividing point.', wrong: [[b * k, `The part next to A is the ${a} part of the ratio.`], [L, 'That is the whole line AB.']] },
      ],
      steps: [`Equal parts: ${a} + ${b} = ${a + b}.`, `One piece: ${L} ÷ ${a + b} = ${k} cm.`, `Dividing point from A: ${a} × ${k} = ${a * k} cm.`],
    }),
    check: ({ a, b, k, L }, v) => v[0] === a + b && v[1] * v[0] === L && v[2] === v[1] * a }),

  fam({ id: 'g8.construct.parallel-why', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.b', rung: 3, form: 'why',
    draw: () => { const [a, b] = pick([[2, 3], [3, 4], [1, 4], [3, 5], [2, 5]]); return { a, b, p: person() }; },
    make: ({ a, b, p }) => ({
      question: `${p.name} divides a line AB in the ratio ${a}:${b}. ${p.She} marks ${a + b} equal parts on a ray from A and joins the last mark to B. Then ${p.she} draws lines through the other marks parallel to that line. Why must these lines be parallel?`,
      options: [
        { text: 'Parallel lines cut AB into parts in the same ratio as the equal parts on the ray', right: true },
        { text: 'Parallel lines are always as long as AB', right: false, why: 'The length of a parallel line has nothing to do with the ratio. What matters is where it cuts AB.' },
        { text: 'Parallel lines make right angles with AB, so the cuts are fair', right: false, why: 'Parallel lines do not make right angles. They keep the same slope as the line to B.' },
        { text: 'Parallel lines stop the compasses from slipping', right: false, why: 'The compasses are used earlier, to mark the equal parts. The parallel lines carry the equal parts over to AB.' },
      ],
      hints: ['The equal parts on the ray are easy to measure. How do we carry them across to AB?', 'Think about what keeps the pieces in proportion.'],
      steps: ['The marks on the ray are equal distances apart.', 'Lines parallel to the one that ends at B carry those equal steps across to AB.', 'So AB is cut into the same ratio as the ray.'],
    }) }),

  fam({ id: 'g8.construct.circle-right-triangle', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.f', rung: 3, form: 'word',
    draw: () => {
      const [a, b, c] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [10, 24, 26], [20, 21, 29]]);
      return uniq(c / 2, c, (a + b) / 2, b / 2) ? { a, b, c, p: person() } : null;
    },
    make: ({ a, b, c, p }) => ({
      question: `${p.name} draws a circle that passes through all three corners of a right-angled triangle. The two shorter sides are ${a} cm and ${b} cm. The centre of the circle is the midpoint of the longest side. What is the radius of the circle, in cm?`,
      answer: c / 2,
      wrong: [[c, 'That is the length of the longest side. It is the whole diameter of the circle, so the radius is half of it.'], [(a + b) / 2, 'The centre is the midpoint of the longest side, not the middle of the two shorter sides.'], [b / 2, 'You halved a shorter side. The circle is built on the longest side.']],
      hints: ['The longest side of a right-angled triangle is its hypotenuse. Find its length first.', 'The hypotenuse is a diameter of the circle.'],
      steps: [`Longest side: the square root of ${a}² + ${b}² = ${c} cm.`, `It is a diameter, so the radius is ${c} ÷ 2 = ${c / 2} cm.`],
    }),
    check: ({ a, b }, r) => near((2 * r) ** 2, a * a + b * b) }),

  fam({ id: 'g8.construct.which-centre-lines', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.f', rung: 3, form: 'why',
    draw: () => ({ inside: pick([true, false]), p: person() }),
    make: ({ inside, p }) => {
      const bis = { text: 'Bisect two of the angles. The centre is where the bisectors meet', ok: inside, why: 'Angle bisectors give a point the same distance from the sides, so they find the circle that touches the sides, not the one through the corners.' };
      const perp = { text: 'Draw the perpendicular bisectors of two sides. The centre is where they meet', ok: !inside, why: 'Perpendicular bisectors give a point the same distance from the corners, so they find the circle through the corners, not the one that touches the sides.' };
      const med = { text: 'Join each corner to the midpoint of the opposite side. The centre is where these lines meet', ok: false, why: 'That meeting point balances the triangle but is not the same distance from the corners or from the sides.' };
      const alt = { text: 'Draw a line from each corner straight to the opposite side at a right angle. The centre is where they meet', ok: false, why: 'Those lines meet at a point that is not the same distance from the corners or from the sides.' };
      const q = inside
        ? `${p.name} wants the centre of the biggest circle that fits inside a triangular plot and touches all three sides. Which construction finds the centre?`
        : `${p.name} wants the centre of a circle that passes through all three vertices of a triangular plot. Which construction finds the centre?`;
      return { question: q,
        options: [bis, perp, med, alt].map(o => ({ text: o.text, right: o.ok, why: o.ok ? undefined : o.why })),
        hints: inside ? ['The circle touches each side, so its centre is the same distance from each side.', 'Which line has every point the same distance from two sides?'] : ['The circle passes through each vertex, so its centre is the same distance from each vertex.', 'Which line has every point the same distance from two ends of a side?'],
        steps: inside ? ['An angle bisector is the same distance from the two sides of the angle.', 'Two bisectors meet at a point the same distance from all three sides: the incentre.'] : ['A perpendicular bisector is the same distance from the two ends of a side.', 'Two of them meet at a point the same distance from all three vertices: the circumcentre.'] };
    } }),

  // ================================================================ COORDINATES AND GRAPHS
  fam({ id: 'g8.graphs.shop-point', skill: 'G8_COORDINATES', outcome: 'G8.GRAPHS.b', rung: 2, form: 'word',
    draw: () => {
      const x = randInt(1, 6), y = randInt(1, 6), dx = randInt(2, 5), dy = randInt(2, 5), pt = (a, b) => `(${a}, ${b})`;
      const right = pt(x + dx, y + dy), w = [pt(y + dy, x + dx), pt(dx, dy), pt(x + dx, y)];
      return new Set([right, ...w]).size === 4 ? { x, y, dx, dy, right, w, p: person() } : null;
    },
    make: ({ x, y, dx, dy, right, w, p }) => ({
      question: `On a map grid, ${p.name}'s school is at the point (${x}, ${y}). The shop is ${dx} units to the right of the school and ${dy} units above it. Which point shows the shop?`,
      options: [{ text: right, right: true }, { text: w[0], right: false, why: 'The first number is how far across, the second is how far up. These two have been swapped.' }, { text: w[1], right: false, why: 'Those are the moves only. The shop is found by starting at the school.' }, { text: w[2], right: false, why: 'The shop is also above the school. Move up as well as across.' }],
      hints: ['Start at the school. Move across first, then up.', 'Add the move across to the first number, and the move up to the second number.'],
      steps: [`Across: ${x} + ${dx} = ${x + dx}.`, `Up: ${y} + ${dy} = ${y + dy}.`, `The shop is at ${right}.`],
    }) }),

  fam({ id: 'g8.graphs.rectangle-corners', skill: 'G8_COORDINATES', outcome: 'G8.GRAPHS.b', rung: 2, form: 'steps',
    draw: () => ({ x0: randInt(1, 3), y0: randInt(1, 3), W: randInt(4, 8), H: randInt(3, 6) }),
    make: ({ x0, y0, W, H }) => ({
      question: `A rectangular plot ABCD is drawn on a grid. The corner A is at (${x0}, ${y0}), B is at (${x0 + W}, ${y0}) and C is at (${x0 + W}, ${y0 + H}). Each unit on the grid is 1 m. D is the fourth corner.`,
      parts: [
        { prompt: 'What is the first number (across) of the point D?', answer: x0, hint: 'D is straight above A, so it is the same distance across.', wrong: [[x0 + W, 'That is the first number of B and C. D is above A.']] },
        { prompt: 'What is the second number (up) of the point D?', answer: y0 + H, hint: 'D is level with C, so it is the same height.', wrong: [[y0, 'That is the height of A and B. D is level with C.']] },
        { prompt: 'What is the perimeter of the plot, in metres?', answer: 2 * (W + H), unit: 'm', hint: 'Find the length AB and the length BC from the coordinates.', wrong: [[W + H, 'The perimeter goes all the way round: both pairs of sides.']] },
        { prompt: 'What is the area of the plot, in m²?', answer: W * H, unit: 'm²', hint: 'Area = length × width.', wrong: [[2 * (W + H), 'That is the perimeter. Area is length × width.']] },
      ],
      steps: [`D is above A, so across is ${x0}.`, `D is level with C, so up is ${y0 + H}.`, `AB = ${W} m and BC = ${H} m. Perimeter = 2 × (${W} + ${H}) = ${2 * (W + H)} m.`, `Area = ${W} × ${H} = ${W * H} m².`],
    }),
    check: ({ x0, y0, W, H }, v) => v[0] === x0 && v[1] === y0 + H && v[2] === 2 * W + 2 * H && v[3] * 2 === 2 * W * H }),

  fam({ id: 'g8.graphs.table-pattern', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.d', rung: 3, form: 'table',
    draw: () => {
      const m = randInt(2, 5), c = randInt(1, 5), y = (x) => m * x + c, w = [6 * m, 2 * y(3), y(4)];
      return uniq(y(6), ...w) ? { m, c, y, w } : null;
    },
    make: ({ m, c, y, w }) => ({
      question: 'The table shows points on a straight line. The line has an equation of the form y = mx + c. Use the pattern in the table to find y when x = 6.',
      model: { type: 'table', data: { head: ['x', '0', '1', '2', '3'], rows: [{ cells: ['y', ...[0, 1, 2, 3].map(x => String(y(x)))] }] } },
      answer: y(6),
      wrong: [[w[0], 'You used the step in y but forgot where the line starts, the value of y when x is 0.'], [w[1], 'Doubling x does not double y, because the line does not start at 0.'], [w[2], 'That is y when x is 4, the next column of the pattern. Carry on to x = 6.']],
      hints: ['Look at how much y goes up each time x goes up by 1.', 'The value of y when x = 0 is where the line starts.'],
      steps: [`y goes up by ${m} each time, so m = ${m}.`, `When x = 0, y = ${c}, so c = ${c}.`, `y = ${m} × 6 + ${c} = ${y(6)}.`],
    }),
    check: ({ m, c }, a) => (a - c) / m === 6 }),

  fam({ id: 'g8.graphs.spot-negative-x', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.d', rung: 2, form: 'spot',
    draw: () => ({ m: randInt(2, 4), c: randInt(1, 6), x: -randInt(1, 4), k: pick([0, 1]), p: person() }),
    make: ({ m, c, x, k, p }) => {
      const mx = m * x, y = mx - c;
      const s2 = k === 0 ? -mx : mx, s3 = s2 - c;
      return {
        question: `${p.name} completes a table of values for the line y = ${m}x − ${c}. ${p.She} works out y when x = ${x}. Which step has the mistake?`,
        working: [
          { text: `Put x = ${x} into the equation: y = ${m} × (${x}) − ${c}`, ok: true },
          { text: `${m} × (${x}) = ${s2}`, ok: s2 === mx },
          { text: k === 1 ? `y = ${s2} − ${c} = ${s2 - c + 2 * c}` : `y = ${s2} − ${c} = ${s3}`, ok: k === 1 ? false : true },
          { text: `So the point (${x}, ${k === 1 ? s2 - c + 2 * c : s3}) is on the line`, ok: true },
        ],
        fix: k === 0 ? `A positive number times a negative number is negative. Step 2 gave ${-mx} instead of ${mx}.` : `Taking ${c} away from ${s2} makes the number smaller still. Step 3 added ${c} instead of taking it away.`,
        steps: [`${m} × (${x}) = ${mx}.`, `y = ${mx} − ${c} = ${y}.`, `The point is (${x}, ${y}).`],
      };
    } }),

  fam({ id: 'g8.graphs.scale-why', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.e', rung: 2, form: 'why',
    draw: () => {
      const s = pick([2, 5, 10]), V = s === 2 ? pick([30, 36, 40]) : s === 5 ? pick([60, 70, 80]) : pick([120, 150, 180]);
      return { s, V, p: person() };
    },
    make: ({ s, V, p }) => ({
      question: `${p.name} wants to graph values up to ${V}. The vertical axis has 10 big squares. ${p.She} chooses a scale of 1 big square to ${s} units. Why is this scale not suitable?`,
      options: [
        { text: `10 big squares of ${s} units reach only ${10 * s}, so ${V} will not fit on the axis`, right: true },
        { text: `${s} is too small a number to use as a scale`, right: false, why: 'The size of the number does not matter by itself. What matters is whether the largest value fits on the axis.' },
        { text: 'A scale must always be 1 big square to 1 unit', right: false, why: 'Scales are chosen to fit the data. 1 big square to 1 unit would only fit tiny values.' },
        { text: `A scale must be bigger than ${V}`, right: false, why: 'A scale is how many units one square stands for. It is never as large as the biggest value.' },
      ],
      hints: ['Find how far the axis reaches: the number of big squares times the units in each.', 'Compare that with the largest value to be shown.'],
      steps: [`The axis reaches 10 × ${s} = ${10 * s}.`, `${V} is bigger than ${10 * s}, so the largest value is off the graph.`],
    }) }),

  fam({ id: 'g8.graphs.scale-number', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.e', rung: 1, form: 'word',
    draw: () => {
      const L = pick([8, 10, 12, 20]), s = pick([2, 5, 10, 20, 50]), V = L * s;
      return uniq(s, V - L, L / V) ? { L, s, V, what: pick(['the kilograms of maize sold', 'the number of learners present', 'the litres of water used']), p: person() } : null;
    },
    make: ({ L, s, V, what, p }) => ({
      question: `${p.name} draws a graph of ${what}. The vertical axis is ${L} cm long and runs from 0 to ${V}. What scale does ${p.she} use? Give the number of units that 1 cm stands for.`,
      answer: s,
      wrong: [[V - L, 'Do not take away. The scale says how many units each centimetre stands for.'], [round(L / V, 2), 'You divided the wrong way round. Divide the units by the centimetres.'], [V, 'That is the whole axis in units. Share it between the centimetres.']],
      hints: ['How many units does the whole axis show? How many cm is the axis?', 'Share the units equally between the centimetres.'],
      steps: [`The axis shows ${V} units over ${L} cm.`, `${V} ÷ ${L} = ${s} units for each cm.`],
    }),
    check: ({ L, V }, a) => a * L === V }),

  fam({ id: 'g8.graphs.scale-choose', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.e', rung: 2, form: 'table',
    draw: () => {
      const NICE = [1, 2, 5, 10, 20, 50, 100], i = pick([2, 3, 4]), r = NICE[i], prev = NICE[i - 1];
      const M = r * 10 - 5 * pick([0, 1, 2]) * (r >= 10 ? 1 : 0);
      if (!(M > prev * 10 && M <= r * 10)) return null;
      const others = [0.3, 0.5, 0.7, 0.9].map(f => Math.round((M * f) / 5) * 5 || 5).slice(0, 3);
      const vals = [...others, M].sort(() => Math.random() - 0.5);
      return { r, prev, nx: NICE[i + 1], nx2: NICE[i + 2], M, vals };
    },
    make: ({ r, prev, nx, nx2, M, vals }) => ({
      question: 'The table shows the rainfall measured in four months. The vertical axis of a graph has 10 big squares. What is the smallest scale, in mm for each big square, that lets every value fit?',
      model: { type: 'table', data: { head: ['Month', 'Rainfall (mm)'], rows: vals.map((v, j) => ({ label: ['March', 'April', 'May', 'June'][j], value: String(v) })) } },
      options: [
        { text: `1 big square to ${prev} mm`, right: false, why: `10 big squares of ${prev} mm reach only ${10 * prev} mm, so the largest value does not fit.` },
        { text: `1 big square to ${r} mm`, right: true },
        { text: `1 big square to ${nx} mm`, right: false, why: `That fits, but it is not the smallest scale that fits. A smaller scale also fits.` },
        { text: `1 big square to ${nx2} mm`, right: false, why: 'That fits, but the graph would be squashed into a small corner. A smaller scale also fits.' },
      ],
      story: true,
      hints: ['Find the largest value in the table.', 'The axis reaches 10 times the scale. It must reach at least the largest value.'],
      steps: [`The largest value is ${M} mm.`, `10 squares of ${prev} mm reach ${10 * prev}, which is too small.`, `10 squares of ${r} mm reach ${10 * r}, which fits.`],
    }) }),

  fam({ id: 'g8.graphs.hall-hire-graph', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.g', rung: 2, form: 'graph',
    draw: () => {
      const m1 = pick([50, 100, 150]), m2 = pick([200, 250, 300]), b = pick([0, 100, 200]), x0 = pick([2, 4, 6]);
      const a = b + (m2 - m1) * x0, y0 = a + m1 * x0;
      return uniq(x0, y0, x0 + 2, x0 - 2) ? { m1, m2, a, b, x0, y0 } : null;
    },
    make: ({ m1, m2, a, b, x0, y0 }) => {
      const xs = [0, 2, 4, 6, 8], A = xs.map(x => ({ x, y: a + m1 * x })), B = xs.map(x => ({ x, y: b + m2 * x }));
      const top = Math.max(...A.map(q => q.y), ...B.map(q => q.y)), step = [100, 200, 250, 500, 1000].find(s => top / s <= 6);
      const yTicks = []; for (let v = 0; v <= Math.ceil(top / step) * step; v += step) yTicks.push(v);
      return { question: 'Two halls can be hired for a harambee. The graph shows the cost in shillings of each hall for different numbers of hours. The two lines meet at one point. For how many hours is the cost of the two halls the same?',
        model: { type: 'line-graph', data: { lines: [A, B], xTicks: xs, yTicks, xLabel: 'Hours of hire', yLabel: 'Cost (sh)' } },
        answer: x0,
        wrong: [[y0, 'That is the cost where the lines meet, read up the side. The question asks for the hours, read along the bottom.'], [x0 + 2, 'At that time the lines have already crossed and one hall is dearer. Read where they meet.'], [x0 - 2, 'The lines have not yet met at that time. Read along from where they cross.']],
        hints: ['The cost is the same where the two lines meet.', 'From the meeting point, go straight down to the axis along the bottom.'],
        steps: ['Find the point where the two lines cross.', `Go down to the hours axis: ${x0} hours.`, `At that time both halls cost ${sh(y0)}.`] };
    },
    check: ({ m1, m2, a, b }, v) => a + m1 * v === b + m2 * v }),

  fam({ id: 'g8.graphs.table-meet', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.g', rung: 2, form: 'table',
    draw: () => {
      const m1 = pick([50, 100]), m2 = pick([150, 200, 250]), b = pick([0, 100]), x0 = pick([2, 3, 4]);
      const a = b + (m2 - m1) * x0, y0 = a + m1 * x0;
      return uniq(x0, y0, x0 + 1, x0 - 1) ? { m1, m2, a, b, x0, y0 } : null;
    },
    make: ({ m1, m2, a, b, x0, y0 }) => ({
      question: 'The table shows the cost of hiring two public address systems for different numbers of hours. If the two cost lines were drawn on a graph, at how many hours would they meet?',
      model: { type: 'table', data: { head: ['Hours', '0', '1', '2', '3', '4', '5'], rows: [{ cells: ['System A (sh)', ...[0, 1, 2, 3, 4, 5].map(x => commas(a + m1 * x))] }, { cells: ['System B (sh)', ...[0, 1, 2, 3, 4, 5].map(x => commas(b + m2 * x))] }] } },
      answer: x0,
      wrong: [[y0, 'That is the cost at the meeting point. The question asks for the number of hours.'], [x0 + 1, 'At that time the costs have already crossed over. Find the column where the two costs are equal.'], [x0 - 1, 'At that time the two costs are still different. Find the column where they are equal.']],
      hints: ['The lines meet where both systems cost the same.', 'Look along the two rows for a column where the numbers match.'],
      steps: ['Compare the two rows column by column.', `They match in the column for ${x0} hours: both are ${commas(y0)}.`],
    }),
    check: ({ m1, m2, a, b }, v) => a + m1 * v === b + m2 * v }),

  fam({ id: 'g8.graphs.cross-why', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.g', rung: 3, form: 'why',
    draw: () => { const x0 = randInt(1, 5), y0 = randInt(2, 8), c1 = y0 - x0, c2 = y0 + x0; return c1 === 0 ? null : { x0, y0, c1, c2, p: person() }; },
    make: ({ x0, y0, c1, c2, p }) => {
      const e1 = `y = x ${c1 < 0 ? '−' : '+'} ${Math.abs(c1)}`, e2 = `y = −x + ${c2}`;
      return {
        question: `${p.name} draws the lines ${e1} and ${e2} on one graph. They cross at the point (${x0}, ${y0}). ${p.She} says that x = ${x0} and y = ${y0} solve the two equations together. Why is that right?`,
        options: [
          { text: `The crossing point is the only point on both lines, so its x and y fit both equations`, right: true },
          { text: 'The lines cross where each one meets the y-axis', right: false, why: 'The lines cross each other at one point. That point is not on the y-axis here.' },
          { text: `The crossing point is where both equations equal zero`, right: false, why: 'Check by putting the numbers in. Neither equation gives zero at the crossing point.' },
          { text: 'Every point on one line also fits the other equation', right: false, why: 'Different lines have different points. Only the crossing point is shared by both.' },
        ],
        hints: ['A point on a line fits that line\'s equation.', 'Which point is on both lines?'],
        steps: [`Put x = ${x0} into ${e1}: y = ${y0}.`, `Put x = ${x0} into ${e2}: y = ${y0}.`, 'Both give the same y, so the crossing point fits both equations.'],
      };
    } }),

  // ================================================================ SCALE
  fam({ id: 'g8.scale.plan-table', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.b', rung: 2, form: 'table',
    draw: () => {
      const s = pick([2, 4, 5]), cl = randInt(3, 5), lib = randInt(6, 8), hall = randInt(9, 13);
      return uniq((hall - cl) * s, hall - cl, hall * s, (hall + cl) * s) ? { s, cl, lib, hall, p: person() } : null;
    },
    make: ({ s, cl, lib, hall, p }) => ({
      question: `${p.name} draws a plan of the school with a scale of 1 cm to ${s} m. The table shows the lengths of three rooms on the plan. How many metres longer is the real hall than the real classroom?`,
      model: { type: 'table', data: { head: ['Room', 'Length on the plan (cm)'], rows: [{ label: 'Classroom', value: String(cl) }, { label: 'Library', value: String(lib) }, { label: 'Hall', value: String(hall) }] } },
      answer: (hall - cl) * s,
      wrong: [[hall - cl, 'That is the difference on the plan, in cm. Use the scale to change it to real metres.'], [hall * s, 'That is the real length of the hall alone. The question asks for how much longer it is.'], [(hall + cl) * s, 'Longer means a difference, so subtract.']],
      hints: ['You can find both real lengths, then subtract. Or subtract on the plan, then use the scale.', 'Each cm on the plan stands for the number of metres in the scale.'],
      steps: [`Hall: ${hall} × ${s} = ${hall * s} m.`, `Classroom: ${cl} × ${s} = ${cl * s} m.`, `Difference: ${hall * s} − ${cl * s} = ${(hall - cl) * s} m.`],
    }),
    check: ({ s, cl, hall }, a) => a / s + cl === hall }),

  fam({ id: 'g8.scale.ratio-to-km', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.d', rung: 2, form: 'word',
    draw: () => { const n = pick([20000, 50000, 200000, 250000, 400000, 500000]); return { n, km: n / 100000, p: person() }; },
    make: ({ n, km, p }) => ({
      question: `${p.name} is reading a county map. Its scale is written as 1 : ${commas(n)}. What does 1 cm on the map stand for in real life? Give the answer in kilometres.`,
      answer: km,
      wrong: [[n, 'That is the distance in cm. Change it to kilometres.'], [n / 1000, 'That is the distance in metres. Change it to kilometres.'], [n / 100, 'Dividing by 100 changes cm to metres, which is not enough. A kilometre is 100,000 cm.']],
      hints: ['The ratio 1 : n says that 1 cm on the map stands for n cm in real life.', 'There are 100 cm in 1 m and 1,000 m in 1 km.'],
      steps: [`1 cm on the map stands for ${commas(n)} cm.`, `${commas(n)} ÷ 100 = ${commas(n / 100)} m.`, `${commas(n / 100)} ÷ 1,000 = ${km} km.`],
    }),
    check: ({ n }, a) => near(a * 100000, n) }),

  fam({ id: 'g8.scale.spot-ratio', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.d', rung: 2, form: 'spot',
    draw: () => ({ m: pick([5, 10, 20, 25, 50]), k: pick([0, 1]), p: person() }),
    make: ({ m, k, p }) => {
      const cm = k === 0 ? m * 10 : m * 100, ratio = k === 1 ? `${m * 100} : 1` : `1 : ${cm}`;
      return {
        question: `A plan of the school field says: "1 cm represents ${m} m". ${p.name} wants to write this scale as a ratio, 1 : n, and does it in steps. Which step has the mistake?`,
        working: [
          { text: `1 cm on the drawing stands for ${m} m on the ground`, ok: true },
          { text: `${m} m = ${m} × ${k === 0 ? 10 : 100} = ${cm} cm`, ok: k !== 0 },
          { text: `So 1 cm on the drawing stands for ${cm} cm on the ground`, ok: true },
          { text: `The ratio form is ${ratio}`, ok: k !== 1 },
        ],
        fix: k === 0 ? 'There are 100 cm in 1 m, not 10. Step 2 multiplied by the wrong number.' : 'In a scale ratio, the drawing comes first and is written as 1. The numbers were the wrong way round.',
        steps: [`${m} m = ${m} × 100 = ${m * 100} cm.`, `So 1 cm stands for ${m * 100} cm.`, `Ratio form: 1 : ${m * 100}.`],
      };
    } }),

  fam({ id: 'g8.scale.more-detail-why', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.d', rung: 3, form: 'why',
    draw: () => {
      const [small, big] = pick([[10000, 50000], [25000, 100000], [50000, 250000], [20000, 200000]]);
      return Math.random() < 0.5 ? { x: 'A', y: 'B', sx: small, sy: big, win: 'A' } : { x: 'A', y: 'B', sx: big, sy: small, win: 'B' };
    },
    make: ({ sx, sy, win }) => {
      const lose = win === 'A' ? 'B' : 'A';
      return {
        question: `Map A has a scale of 1 : ${commas(sx)}. Map B shows the same town with a scale of 1 : ${commas(sy)}. Which map shows more detail, and why?`,
        options: [
          { text: `Map ${win}, because 1 cm on it stands for a shorter real distance, so the town is drawn bigger`, right: true },
          { text: `Map ${lose}, because the number in its scale is bigger`, right: false, why: 'A bigger number after the 1 means each cm covers more ground, so the town is drawn smaller with less room for detail.' },
          { text: `Map ${lose}, because it covers more ground on the same sheet`, right: false, why: 'Covering more ground on the same paper means each cm stands for more, so there is less detail.' },
          { text: 'Neither, because both maps show the same town', right: false, why: 'The same town can be drawn bigger or smaller. The bigger drawing has room for more detail.' },
        ],
        hints: ['Compare how much real ground 1 cm stands for on each map.', 'Which map draws the same town bigger?'],
        steps: [`On Map ${win}, 1 cm stands for fewer real centimetres.`, `So the same town takes up more paper on Map ${win}.`, `More paper means more room for detail.`],
      };
    } }),

  fam({ id: 'g8.scale.find-scale-route', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.j', rung: 3, form: 'word',
    draw: () => {
      const [a, b, km] = route(), n = pick([500000, 1000000, 2000000, 2500000]), cm = (km * 100000) / n;
      if (!nice(cm) || cm < 3 || cm > 40) return null;
      const w = [round(km / cm, 2), round((km * 1000) / cm, 2), round((cm * 100000) / km, 2)];
      return uniq(n, ...w) ? { a, b, km, n, cm, w } : null;
    },
    make: ({ a, b, km, n, cm, w }) => ({
      question: `On a map, the distance between ${a} and ${b} is ${cm} cm. In real life it is ${km} km. The scale of the map is 1 : n. What is n?`,
      answer: n,
      wrong: [[w[0], 'That is the number of km that 1 cm stands for. A scale ratio uses the same unit for both numbers: cm.'], [w[1], 'That is the number of metres for 1 cm. Both numbers in the ratio must be in cm.'], [w[2], 'The map distance is the 1 side and the real distance is the n side. You divided the wrong way round.']],
      hints: ['Change the real distance to cm. There are 100 cm in 1 m and 1,000 m in 1 km.', 'Divide the real distance in cm by the map distance in cm to find what 1 cm stands for.'],
      steps: [`${km} km = ${commas(km * 100000)} cm.`, `1 cm on the map stands for ${commas(km * 100000)} ÷ ${cm} = ${commas(n)} cm.`, `The scale is 1 : ${commas(n)}.`],
    }),
    check: ({ km, cm }, a) => near(a * cm, km * 100000) }),

  fam({ id: 'g8.scale.two-legs', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.j', rung: 3, form: 'word',
    draw: () => {
      const [x, y, z, k1, k2] = pick([['Nairobi', 'Nakuru', 'Kisumu', 160, 185], ['Nairobi', 'Nakuru', 'Eldoret', 160, 155], ['Nakuru', 'Eldoret', 'Kitale', 155, 70]]), n = pick([500000, 1000000]);
      const c1 = (k1 * 100000) / n, c2 = (k2 * 100000) / n, tot = k1 + k2;
      return uniq(tot, c1 + c2, ((c1 + c2) * n) / 100000 / 100, k1) ? { x, y, z, n, c1, c2, tot, k1, p: person() } : null;
    },
    make: ({ x, y, z, n, c1, c2, tot, k1, p }) => ({
      question: `${p.name} travels from ${x} to ${y} and then on to ${z}. On a road map with a scale of 1 : ${commas(n)}, the road from ${x} to ${y} measures ${c1} cm and the road from ${y} to ${z} measures ${c2} cm. How many kilometres is the whole journey?`,
      answer: tot,
      wrong: [[c1 + c2, 'That is the length on the map. Use the scale to change it to real distance.'], [((c1 + c2) * n) / 100000 / 100, 'That divides by 100 too many times. There are 100,000 cm in 1 km.'], [k1, 'That is the first part of the journey only. Add the second part.']],
      hints: ['Find the total length on the map first, or each part on its own.', `1 cm on this map stands for ${commas(n)} cm in real life. There are 100,000 cm in 1 km.`],
      steps: [`On the map: ${c1} + ${c2} = ${c1 + c2} cm.`, `Real distance: ${c1 + c2} × ${commas(n)} = ${commas((c1 + c2) * n)} cm.`, `In km: ${commas((c1 + c2) * n)} ÷ 100,000 = ${tot} km.`],
    }),
    check: ({ c1, c2, n }, a) => near(((c1 + c2) * n) / 100000, a) }),

  fam({ id: 'g8.scale.shamba-area', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.j', rung: 3, form: 'steps',
    draw: () => {
      const s = pick([10, 20, 25, 50]), l = randInt(3, 9), w = randInt(2, 6), A = l * s * w * s;
      return l !== w && A % 5000 === 0 ? { s, l, w, A } : null;
    },
    make: ({ s, l, w, A }) => ({
      question: `A plan of a shamba is a rectangle ${l} cm long and ${w} cm wide. The scale of the plan is 1 cm to ${s} m.`,
      parts: [
        { prompt: 'What is the real length of the shamba, in metres?', answer: l * s, unit: 'm', hint: 'Each cm on the plan stands for the number of metres in the scale.', wrong: [[l + s, 'Multiply by the scale, do not add.']] },
        { prompt: 'What is the real width of the shamba, in metres?', answer: w * s, unit: 'm', hint: 'Use the same scale for the width.', wrong: [[w + s, 'Multiply by the scale, do not add.']] },
        { prompt: 'What is the real area of the shamba, in m²?', answer: A, unit: 'm²', hint: 'Use the real length and the real width, not the sizes on the plan.', wrong: [[l * w * s, 'Area uses both lengths. Each length must be multiplied by the scale, so the area is multiplied by the scale twice.']] },
        { prompt: 'What is the area in hectares? (1 hectare = 10,000 m²)', answer: A / 10000, unit: 'ha', hint: 'Divide the area in m² by the number of m² in one hectare.', wrong: [[A / 100, 'A hectare is 10,000 m², not 100 m².'], [A * 10000, 'To change m² into hectares you divide.']] },
      ],
      steps: [`Length: ${l} × ${s} = ${l * s} m.`, `Width: ${w} × ${s} = ${w * s} m.`, `Area: ${l * s} × ${w * s} = ${commas(A)} m².`, `Hectares: ${commas(A)} ÷ 10,000 = ${A / 10000} ha.`],
    }),
    check: ({ s, l, w }, v) => v[0] === l * s && v[1] === w * s && v[2] === v[0] * v[1] && near(v[3] * 10000, v[2]) }),

  // ================================================================ SOLIDS
  fam({ id: 'g8.solids.edges-euler', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.a', rung: 3, form: 'word',
    draw: () => {
      const [F, V] = pick([[8, 12], [7, 10], [6, 6], [7, 7], [5, 6], [5, 5]]), E = F + V - 2;
      return uniq(E, F + V, F + V + 2, V - F + 2) ? { F, V, E } : null;
    },
    make: ({ F, V, E }) => ({
      question: `A model solid has ${F} faces and ${V} vertices. For a solid like this, faces + vertices − edges = 2. How many edges does the solid have?`,
      answer: E,
      wrong: [[F + V, 'The rule has "− edges" in it. Put the numbers in and find the number of edges that makes the rule true.'], [F + V + 2, 'Check the rule: faces + vertices is 2 MORE than the edges, so the edges are fewer.'], [V - F + 2, 'Be careful when you rearrange. Faces and vertices are both added.']],
      hints: ['Put the number of faces and vertices into the rule.', 'Faces + vertices is 2 more than the number of edges.'],
      steps: [`${F} + ${V} − edges = 2.`, `${F + V} − edges = 2, so edges = ${F + V} − 2 = ${E}.`],
    }),
    check: ({ F, V }, e) => F + V - e === 2 }),

  fam({ id: 'g8.solids.cylinder-net', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.b', rung: 2, form: 'word',
    draw: () => { const r = pick([7, 14, 21]); return { r, L: (44 * r) / 7, p: person() }; },
    make: ({ r, L, p }) => ({
      question: `${p.name} draws the net of a closed tin with a base radius of ${r} cm. The net has two circles and one rectangle that wraps round the side. How long is the rectangle on the edge that wraps round the tin, in cm? (Use π = 22/7)`,
      answer: L,
      wrong: [[round((22 * r * r) / 7, 0), 'That is the area of one circle. The edge of the rectangle is as long as the distance round the circle.'], [(22 * r) / 7, 'That is π × radius. The distance round a circle is 2 × π × radius.'], [2 * r, 'That is the width of the circle across. The rectangle wraps all the way round it.']],
      hints: ['When the rectangle wraps round the tin, its long edge touches the whole edge of a circle.', 'What is the distance round a circle called?'],
      steps: [`The long edge of the rectangle meets the edge of a circle all the way round.`, `So it equals the circumference: 2 × 22/7 × ${r} = ${L} cm.`],
    }),
    check: ({ r }, a) => near((a * 7) / 44, r) }),

  fam({ id: 'g8.solids.cube-net-yes-no', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.b', rung: 3, form: 'why',
    draw: () => {
      const p1 = randInt(1, 4), p2 = randInt(1, 4), side2 = pick(['above', 'below']);
      return p1 === p2 && side2 === 'above' ? null : { p1, p2, side2, ok: side2 === 'below' };
    },
    make: ({ p1, p2, side2, ok }) => ({
      question: `A net is made of squares. Four squares sit in a row. One more square is joined above square ${p1} of the row, counting from the left. Another square is joined ${side2} square ${p2}. Does this net fold into a cube?`,
      options: [
        { text: 'Yes, it folds into a cube', right: ok, why: ok ? undefined : 'Both extra squares are on the same side of the row, so they fold onto the same face. One face of the cube would be covered twice and the opposite face left open.' },
        { text: 'No, it does not fold into a cube', right: !ok, why: ok ? 'The row of four squares makes the four sides. One extra square goes on top and one underneath, so all six faces are covered.' : undefined },
      ],
      fixedOrder: true,
      hints: ['The row of four squares folds round to make four sides of the cube.', 'The other two squares must make the top and the bottom. Are they on opposite sides of the row?'],
      steps: ok ? ['The row makes four sides.', 'One extra square is above and one is below, so they make the top and the bottom.', 'All six faces are covered, so it folds into a cube.'] : ['The row makes four sides.', 'Both extra squares are above the row, so both fold to the top.', 'The bottom face is missing, so it does not fold into a cube.'],
    }) }),

  fam({ id: 'g8.solids.cylinder-net-steps', skill: 'G8_SURFACE_AREA', outcome: 'G8.SOLIDS.c', rung: 3, form: 'steps',
    draw: () => { const r = pick([7, 14, 21]), L = (44 * r) / 7, w = pick([10, 15, 20]); return { r, L, w }; },
    make: ({ r, L, w }) => ({
      question: `The net of a closed cylinder has a rectangle ${L} cm long and ${w} cm wide, and two circles. The ${L} cm edge fits once round the edge of a circle. Use π = 22/7.`,
      parts: [
        { prompt: 'What is the radius of each circle, in cm?', answer: r, unit: 'cm', hint: 'The rectangle\'s long edge is the circumference of the circle.', wrong: [[(L * 7) / 22, 'That is the diameter. The radius is half of it.'], [L / 2, 'Circumference is 2 × π × radius, not 2 × radius.']] },
        { prompt: 'What is the area of the rectangle, in cm²?', answer: L * w, unit: 'cm²', hint: 'Area of a rectangle = length × width.', wrong: [[2 * (L + w), 'That is the perimeter of the rectangle. Area is length × width.']] },
        { prompt: 'What is the area of the two circles together, in cm²?', answer: (44 * r * r) / 7, unit: 'cm²', hint: 'Area of one circle = π × r × r. There are two circles.', wrong: [[(22 * r * r) / 7, 'That is one circle. The net has two.']] },
        { prompt: 'What is the total surface area of the cylinder, in cm²?', answer: L * w + (44 * r * r) / 7, unit: 'cm²', hint: 'The surface is all the pieces of the net together.', wrong: [[L * w + (22 * r * r) / 7, 'Use both circles.']] },
      ],
      steps: [`${L} = 2 × 22/7 × r, so r = ${r} cm.`, `Rectangle: ${L} × ${w} = ${L * w} cm².`, `Two circles: 2 × 22/7 × ${r} × ${r} = ${(44 * r * r) / 7} cm².`, `Total: ${L * w} + ${(44 * r * r) / 7} = ${L * w + (44 * r * r) / 7} cm².`],
    }),
    check: ({ r, L, w }, v) => v[0] === r && v[1] === L * w && v[2] * 7 === 44 * r * r && v[3] === v[1] + v[2] }),

  fam({ id: 'g8.solids.tray-volume', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.c', rung: 3, form: 'word',
    draw: () => {
      const L = pick([30, 40, 50]), W = pick([20, 30]), x = pick([2, 3, 4, 5]);
      return uniq((L - 2 * x) * (W - 2 * x) * x, L * W * x, (L - x) * (W - x) * x, (L - 2 * x) * (W - 2 * x)) ? { L, W, x, p: person() } : null;
    },
    make: ({ L, W, x, p }) => ({
      question: `${p.name} makes a tray from a flat sheet of card ${L} cm long and ${W} cm wide. ${p.She} cuts a square of side ${x} cm from each corner, then folds up the sides. What is the volume of the tray, in cm³?`,
      answer: (L - 2 * x) * (W - 2 * x) * x,
      wrong: [[L * W * x, 'The base of the tray is smaller than the sheet, because the corners were cut away.'], [(L - x) * (W - x) * x, 'A square is cut from both ends of the length, so take away 2 × the side, not 1 ×.'], [(L - 2 * x) * (W - 2 * x), 'That is the area of the base. Volume also needs the height.']],
      hints: ['After cutting the corners and folding, the height of the tray is the side of the cut-out square.', 'The length and the width of the base each lose a square at both ends.'],
      steps: [`Base length: ${L} − 2 × ${x} = ${L - 2 * x} cm.`, `Base width: ${W} − 2 × ${x} = ${W - 2 * x} cm.`, `Volume: ${L - 2 * x} × ${W - 2 * x} × ${x} = ${(L - 2 * x) * (W - 2 * x) * x} cm³.`],
    }),
    check: ({ L, W, x }, a) => a / x / (L - 2 * x) === W - 2 * x }),

  fam({ id: 'g8.solids.double-edge-why', skill: 'G8_SURFACE_AREA', outcome: 'G8.SOLIDS.c', rung: 3, form: 'why',
    draw: () => ({ k: pick([2, 3]), p: person() }),
    make: ({ k, p }) => ({
      question: `${p.name} makes a small cube from clay. ${p.She} then makes a bigger cube with edges ${k} times as long. What happens to the surface area and to the volume?`,
      options: [
        { text: `The surface area is ${k * k} times as big and the volume is ${k * k * k} times as big`, right: true },
        { text: `Both are ${k} times as big`, right: false, why: 'Surface area is length × length and volume is length × length × length. They grow faster than the edge.' },
        { text: `The surface area is ${k} times as big and the volume is ${k * k} times as big`, right: false, why: 'Surface area uses two lengths multiplied, and volume uses three. Each one grows by one more factor than you said.' },
        { text: `Both are ${k * k * k} times as big`, right: false, why: 'Volume uses three lengths, but surface area is a flat measure that uses only two.' },
      ],
      hints: ['Try a cube of edge 1 and one of edge made bigger by the number in the question.', 'Surface area is made of squares. Volume is made of layers of squares.'],
      steps: [`A face is edge × edge, so each face is ${k} × ${k} = ${k * k} times as big.`, `Volume is edge × edge × edge: ${k} × ${k} × ${k} = ${k * k * k} times as big.`],
    }) }),

  fam({ id: 'g8.solids.ant-two-faces', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.d', rung: 3, form: 'word',
    draw: () => {
      const [x, y, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), flip = Math.random() < 0.5, a = flip ? x : y, r = flip ? y : x;
      const p = randInt(1, a - 1), q = a - p, spaceWrong = round(Math.sqrt(p * p + q * q + r * r), 1);
      return uniq(c, a + r, a, spaceWrong) ? { p, q, r, c, a, spaceWrong, who: person() } : null;
    },
    make: ({ p, q, r, c, a, spaceWrong, who }) => ({
      question: `A box has a top face and a side face that meet along an edge. An ant is on the top, ${p} cm from the edge. A crumb is on the side, ${q} cm from the same edge. Along the edge, they are ${r} cm apart. The ant must stay on the surface of the box. What is the shortest distance the ant can walk, in cm?`,
      answer: c,
      wrong: [[a + r, 'That is the walk along two straight lines at right angles. A straight line across the two faces is shorter.'], [a, 'That ignores the sideways distance along the edge.'], [spaceWrong, 'That goes straight through the inside of the box. The ant must stay on the surface.']],
      hints: ['Imagine the side face folded flat, so the two faces make one flat rectangle.', 'Now the shortest path is a straight line. Use Pythagoras\' theorem.'],
      steps: [`Flat out, the two distances from the edge add up: ${p} + ${q} = ${a} cm.`, `The sideways distance is ${r} cm.`, `Straight line: the square root of ${a}² + ${r}² = ${c} cm.`],
    }),
    check: ({ a, r }, d) => near(d * d, a * a + r * r) }),

  fam({ id: 'g8.solids.beetle-tin', skill: 'G8_VOLUME_ADV', outcome: 'G8.SOLIDS.d', rung: 2, form: 'word',
    draw: () => { const r = pick([7, 14, 21, 28, 35]); return { r, d: (22 * r) / 7, p: person() }; },
    make: ({ r, d, p }) => ({
      question: `A beetle is on the curved side of a round tin of radius ${r} cm. It walks from a point A on the bottom rim to a point B on the same rim, directly opposite A. It must stay on the curved surface. What is the shortest distance it can walk, in cm? (Use π = 22/7)`,
      answer: d,
      wrong: [[(44 * r) / 7, 'That is all the way round the tin. B is only halfway round.'], [2 * r, 'That goes straight through the tin. The beetle must stay on the surface.'], [round((22 * r * r) / 7, 0), 'That is an area. The beetle walks a distance along the rim.']],
      hints: ['A and B are on the same rim, directly opposite each other. How far round is that?', 'The rim is a circle. B is half way round it from A.'],
      steps: [`The rim is a circle with circumference 2 × 22/7 × ${r} = ${2 * d} cm.`, `Half way round: ${2 * d} ÷ 2 = ${d} cm.`],
    }),
    check: ({ r }, a) => near(2 * a, circ(r)) }),

  // ================================================================ DATA
  fam({ id: 'g8.data.bar-top-two', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.b', rung: 2, form: 'graph',
    draw: () => {
      const vals = [0, 1, 2, 3].map(() => randInt(4, 16) * 5);
      if (new Set(vals).size < 4) return null;
      const s = [...vals].sort((a, b) => b - a), top = s[0] + s[1], bot = s[2] + s[3];
      return uniq(top - bot, top, top + bot, s[0] - s[3]) ? { vals, top, bot, s } : null;
    },
    make: ({ vals, top, bot, s }) => ({
      question: 'The bar graph shows the number of learners in four classes. How many more learners are in the two biggest classes together than in the two smallest classes together?',
      model: { type: 'bar-chart', data: { bars: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'].map((label, i) => ({ label, value: vals[i] })) } },
      answer: top - bot,
      wrong: [[top, 'That is the two biggest classes only. Take away the two smallest classes together.'], [s[0] - s[3], 'That compares one class with one class. The question uses two classes in each group.'], [top + bot, '"How many more" is a difference, so subtract.']],
      hints: ['Read the height of each bar. Then pick out the two tallest and the two shortest.', 'Add the two tallest, add the two shortest, then subtract.'],
      steps: [`The two tallest bars: ${s[0]} + ${s[1]} = ${top}.`, `The two shortest bars: ${s[2]} + ${s[3]} = ${bot}.`, `Difference: ${top} − ${bot} = ${top - bot}.`],
    }),
    check: ({ top, bot }, a) => bot + a === top }),

  fam({ id: 'g8.data.line-biggest-rise', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.b', rung: 2, form: 'graph',
    draw: () => {
      const ys = [randInt(2, 6) * 10]; for (let i = 0; i < 5; i++) ys.push(Math.max(10, ys[i] + pick([-20, -10, 10, 20, 30, 40, 50])));
      const d = ys.slice(1).map((v, i) => v - ys[i]), sorted = [...d].sort((a, b) => b - a);
      if (sorted[0] <= 0 || sorted[0] === sorted[1] || Math.max(...ys) > 250) return null;
      const w = [Math.max(...ys), ys[5] - ys[0], sorted[1]];
      return uniq(sorted[0], ...w) && w.every(x => x > 0) ? { ys, best: sorted[0], w } : null;
    },
    make: ({ ys, best, w }) => ({
      question: 'The line graph shows the litres of water in a tank, read every hour. What is the biggest rise in water between two readings that are next to each other?',
      model: { type: 'line-graph', data: { points: ys.map((y, x) => ({ x, y })), xTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 50, 100, 150, 200, 250, 300].filter(t => t <= Math.ceil(Math.max(...ys) / 50) * 50), xLabel: 'Hours after 6 am', yLabel: 'Water (litres)' } },
      answer: best,
      wrong: [[w[0], 'That is the highest reading, not a rise. A rise is how much the line goes up between two readings.'], [w[1], 'That is the rise from the first reading to the last. The question asks about readings next to each other.'], [w[2], 'That is the second biggest rise. Compare all of the steps up.']],
      hints: ['For each pair of neighbouring readings, find how much the line goes up. Ignore the steps where it goes down.', 'Compare the rises and pick the biggest.'],
      steps: ys.slice(1).map((v, i) => `Hour ${i} to ${i + 1}: ${ys[i]} to ${v}, change ${v - ys[i] > 0 ? '+' : '−'}${Math.abs(v - ys[i])}.`).concat([`The biggest rise is ${best} litres.`]),
    }),
    check: ({ ys, best }, a) => ys.slice(1).some((v, i) => v - ys[i] === a) && ys.slice(1).every((v, i) => v - ys[i] <= a) }),

  fam({ id: 'g8.data.table-bar-squares', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.b', rung: 1, form: 'table',
    draw: () => {
      const s = pick([5, 10, 20]), vals = [0, 1, 2, 3, 4].map(() => randInt(2, 9) * s), mx = Math.max(...vals);
      return vals.filter(v => v === mx).length === 1 ? { s, vals, mx, p: person() } : null;
    },
    make: ({ s, vals, mx, p }) => ({
      question: `${p.name} will draw a bar graph of the table. On the vertical axis, 1 square stands for ${s} eggs. How many squares tall is the tallest bar?`,
      model: { type: 'table', data: { head: ['Day', 'Eggs sold'], rows: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((label, i) => ({ label, value: String(vals[i]) })) } },
      answer: mx / s,
      wrong: [[mx, 'That is the number of eggs. Each square stands for more than one egg, so the bar needs fewer squares.'], [mx * s, 'Each square stands for several eggs, so you divide, not multiply.'], [Math.min(...vals) / s, 'That is the shortest bar. The question asks about the tallest.']],
      hints: ['Find the largest number in the table.', 'How many squares of the size given are needed to reach that number?'],
      steps: [`The largest number is ${mx} eggs.`, `${mx} ÷ ${s} = ${mx / s} squares.`],
    }),
    check: ({ s, mx }, a) => a * s === mx }),

  fam({ id: 'g8.data.which-graph-why', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.b', rung: 2, form: 'why',
    draw: () => {
      const S = [['the number of learners in each of Grades 4 to 8', 'bar'], ['how many learners chose each of four school clubs', 'bar'], ['the maize harvest of five farmers', 'bar'], ['the temperature of a school every hour of the day', 'line'], ['the price of a kilogram of maize in each month of the year', 'line'], ['the height of a seedling at the end of each week', 'line']];
      const [what, kind] = pick(S); return { what, kind, p: person() };
    },
    make: ({ what, kind, p }) => ({
      question: `${p.name} wants to show ${what}. Which graph is best, and why?`,
      options: [
        { text: 'A bar graph, because the groups are separate and not joined by time', right: kind === 'bar', why: kind === 'bar' ? undefined : 'These values come one after another in time. A bar graph does not show how they change from one time to the next.' },
        { text: 'A line graph, because it shows how a value changes over time', right: kind === 'line', why: kind === 'line' ? undefined : 'These are separate groups, not points in time. Joining them with a line would suggest values in between that do not exist.' },
        { text: 'A line graph, because the groups are separate', right: false, why: 'A line joins one point to the next, which only makes sense when the values follow each other in time.' },
        { text: 'A bar graph, because it shows how a value changes from one time to the next', right: false, why: 'A line graph does that job. A bar graph shows separate groups side by side.' },
      ],
      hints: ['Are the values in separate groups, or do they come one after another in time?', 'A line joins one reading to the next.'],
      steps: kind === 'bar' ? ['The values are for separate groups.', 'Bars stand side by side without joining, so a bar graph suits them.'] : ['The values come one after another in time.', 'A line shows the way the value rises and falls, so a line graph suits them.'],
    }) }),

  fam({ id: 'g8.data.table-mean', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.e', rung: 2, form: 'table',
    draw: () => {
      for (let t = 0; t < 5000; t++) {
        const f = [0, 1, 2, 3, 4].map(() => randInt(1, 8)), n = f.reduce((a, b) => a + b, 0), tot = f.reduce((a, b, x) => a + b * x, 0);
        if (n >= 10 && nice(tot / n) && f.filter(c => c === Math.max(...f)).length === 1 && uniq(tot / n, 2, tot, f.indexOf(Math.max(...f)))) return { f, n, tot, mean: tot / n };
      }
      return null;
    },
    make: ({ f, n, tot, mean }) => ({
      question: 'The table shows the number of goals a school team scored in each of its matches. What is the mean number of goals scored in a match?',
      model: { type: 'table', data: { head: ['Goals in a match', 'Number of matches'], rows: f.map((c, x) => ({ label: String(x), value: String(c) })) } },
      answer: mean,
      wrong: [[2, 'That is the mean of 0, 1, 2, 3, 4. Some scores happened more often than others, so they count more.'], [tot, 'That is the total number of goals. Divide it by the number of matches.'], [f.indexOf(Math.max(...f)), 'That is the mode, the score that happened most often. The mean uses every match.']],
      hints: ['Work out the total goals: each score times the number of matches with that score.', 'Divide the total goals by the total number of matches.'],
      steps: [`Total goals: ${f.map((c, x) => `${x}×${c}`).join(' + ')} = ${tot}.`, `Total matches: ${f.join(' + ')} = ${n}.`, `Mean: ${tot} ÷ ${n} = ${mean}.`],
    }),
    check: ({ n, tot }, a) => near(a * n, tot) }),

  fam({ id: 'g8.data.table-median', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.e', rung: 2, form: 'table',
    draw: () => {
      const f = [0, 1, 2, 3, 4].map(() => randInt(1, 7)), n = f.reduce((a, b) => a + b, 0), list = [];
      f.forEach((c, i) => { for (let k = 0; k < c; k++) list.push(i + 1); });
      const med = n % 2 ? list[(n - 1) / 2] : (list[n / 2 - 1] + list[n / 2]) / 2, mean = list.reduce((a, b) => a + b, 0) / n;
      const mode = f.indexOf(Math.max(...f)) + 1;
      return f.filter(c => c === Math.max(...f)).length === 1 && uniq(med, 3, mode, round(mean, 1)) && nice(med) ? { f, n, med, mode, mean: round(mean, 1) } : null;
    },
    make: ({ f, n, med, mode, mean }) => ({
      question: 'The table shows the marks out of 5 that learners got in a quick quiz. What is the median mark?',
      model: { type: 'table', data: { head: ['Mark', 'Number of learners'], rows: f.map((c, i) => ({ label: String(i + 1), value: String(c) })) } },
      answer: med,
      wrong: [[3, 'That is the middle of the list of marks 1 to 5. The median is the middle of ALL the learners\' marks, so count each learner.'], [mode, 'That is the mode, the mark that most learners got.'], [mean, 'That is the mean. The median is the middle mark when all the marks are in order.']],
      hints: ['There are as many marks as learners. Count all the learners first.', 'Find the middle position, then count along the table from the lowest mark until you reach it.'],
      steps: [`Number of learners: ${f.join(' + ')} = ${n}.`, n % 2 ? `The middle one is number ${(n + 1) / 2}.` : `The middle is between numbers ${n / 2} and ${n / 2 + 1}.`, `Counting along the table from mark 1 gives the median ${med}.`],
    }),
    check: ({ f, n, med }) => { let c = 0; const at = (k) => { let s = 0; for (let i = 0; i < 5; i++) { s += f[i]; if (k <= s) return i + 1; } return 0; }; return n % 2 ? at((n + 1) / 2) === med : (at(n / 2) + at(n / 2 + 1)) / 2 === med; } }),

  fam({ id: 'g8.data.new-mean', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.e', rung: 3, form: 'word',
    draw: () => {
      const m = randInt(40, 60), x = randInt(30, 90);
      if ((4 * m + x) % 5 !== 0) return null;
      const a = (4 * m + x) / 5;
      return uniq(a, (m + x) / 2, round(m + x / 5, 1), x) && a !== m ? { m, x, a } : null;
    },
    make: ({ m, x, a }) => ({
      question: `The mean mass of 4 sacks of maize is ${m} kg. A fifth sack of ${x} kg is added to the pile. What is the mean mass of all 5 sacks, in kg?`,
      answer: a,
      wrong: [[(m + x) / 2, 'That treats the four sacks as one sack. The mean of 4 sacks stands for the total of 4 sacks.'], [round(m + x / 5, 1), 'Share the TOTAL mass between 5 sacks. Do not add part of one sack to the mean.'], [m, 'The mean changes when a sack of a different mass is added.']],
      hints: ['The total mass of the first 4 sacks is 4 times their mean.', 'Add the fifth sack to that total, then share it between 5 sacks.'],
      steps: [`Total of the first 4 sacks: 4 × ${m} = ${4 * m} kg.`, `With the fifth sack: ${4 * m} + ${x} = ${4 * m + x} kg.`, `Mean: ${4 * m + x} ÷ 5 = ${a} kg.`],
    }),
    check: ({ m, x }, a) => a * 5 === 4 * m + x }),

  fam({ id: 'g8.data.seven-days', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.e', rung: 2, form: 'steps',
    draw: () => {
      for (let t = 0; t < 2000; t++) {
        const mode = randInt(12, 30), others = [0, 1, 2, 3, 4].map(() => randInt(10, 40)), list = [mode, mode, ...others];
        const cnt = (v) => list.filter(q => q === v).length;
        const sorted = [...list].sort((a, b) => a - b), sum = list.reduce((a, b) => a + b, 0);
        if (sum % 7 === 0 && cnt(mode) === 2 && list.every(v => cnt(v) <= 2) && list.filter(v => cnt(v) === 2).length === 2 && sorted[3] !== mode && sum / 7 !== mode && sum / 7 !== sorted[3]) {
          const shuffled = [...list].sort(() => Math.random() - 0.5); return { list: shuffled, mode, med: sorted[3], mean: sum / 7, sorted };
        }
      }
      return null;
    },
    make: ({ list, mode, med, mean, sorted }) => ({
      question: `A shop sold these numbers of mandazi on seven days: ${list.join(', ')}.`,
      parts: [
        { prompt: 'What is the mode?', answer: mode, hint: 'The mode is the number that appears most often.', wrong: [[Math.max(...list), 'That is the biggest number. The mode is the one that appears most often.']] },
        { prompt: 'What is the median?', answer: med, hint: 'Put the numbers in order first. Then pick the middle one.', wrong: [[list[3], 'The numbers must be put in order before you pick the middle one.']] },
        { prompt: 'What is the mean?', answer: mean, hint: 'Add all seven numbers and divide by 7.', wrong: [[(Math.min(...list) + Math.max(...list)) / 2, 'That is halfway between the smallest and the biggest. The mean uses all seven numbers.']] },
      ],
      steps: [`Appears twice, so the mode is ${mode}.`, `In order: ${sorted.join(', ')}. The middle (4th) is ${med}.`, `Total ${sorted.reduce((a, b) => a + b, 0)} ÷ 7 = ${mean}.`],
    }),
    check: ({ list, sorted }, v) => list.filter(q => q === v[0]).length === 2 && sorted[3] === v[1] && v[2] * 7 === list.reduce((a, b) => a + b, 0) }),

  fam({ id: 'g8.data.which-average-why', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.e', rung: 3, form: 'why',
    draw: () => {
      const S = [['A shoe seller wants to know which size to stock the most of.', 'mode'], ['A tailor wants to know which school uniform size is bought most often, to sew more of it.', 'mode'], ['A duka owner records the flavour of soda bought each day and wants to know which to order the most of.', 'mode'],
        ['Five farmers pool their maize and then share it out equally between them.', 'mean'], ['A chama collects money from its members and then shares the whole amount out equally between them.', 'mean'], ['Four boda boda riders pool a week of fares and share it out equally.', 'mean'],
        ['Four farmers harvest between 40 and 50 bags, and one harvests 200 bags. A reporter wants one value that shows a typical farmer.', 'median'], ['Most houses in a village rent for about sh 3,000, but one big house rents for sh 60,000. A teacher wants one value that shows a typical rent.', 'median'], ['Four learners walk about 2 km to school, and one walks 15 km. A teacher wants one value that shows a typical walk.', 'median']];
      const [what, right] = pick(S); return { what, right };
    },
    make: ({ what, right }) => {
      const T = { mode: ['The mode, because it is the value that happens most often', 'The mode only tells you which value happens most. It does not share a total out or show the middle.'], mean: ['The mean, because it shares the total equally between all the values', 'The mean shares a total equally. That is not what is needed here.'], median: ['The median, because it is the middle value and one very large value does not pull it up', 'The median is the middle value. It is not the best answer to this question.'], range: ['The range, because it shows how spread out the values are', 'The range only tells you how far apart the biggest and smallest are. It is not an average.'] };
      return {
        question: `${what} Which average should be used, and why?`,
        options: ['mode', 'mean', 'median', 'range'].map(k => ({ text: T[k][0], right: k === right, why: k === right ? undefined : (k === 'mode' || k === 'mean' || k === 'median' ? `${T[k][1]} Think about what the question needs.` : T.range[1]) })),
        hints: ['Ask what the question needs: the most common value, an equal share, or a typical value?', 'Match that need to what each average does.'],
        steps: [`The question needs the ${right}.`, T[right][0] + '.'],
      };
    } }),

  // ================================================================ PROBABILITY
  fam({ id: 'g8.prob.bottle-top-table', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.b', rung: 1, form: 'table',
    draw: () => {
      const n = pick([20, 25, 40, 50]), side = randInt(2, 6) * 2, up = randInt(3, 8) * 2, down = n - side - up;
      if (down < 4) return null;
      const a = side / n, far = [1 - a, side / (n - side)].every(w => Math.abs(w - a) / a > 0.35);
      return far && uniq(a, 1 - a, side, round(side / (n - side), 3)) ? { n, side, up, down, p: person() } : null;
    },
    make: ({ n, side, up, down, p }) => ({
      question: `${p.name} tosses a bottle top many times. The table shows how it landed. What is the experimental probability that it lands on its side? Give the answer as a decimal.`,
      model: { type: 'table', data: { head: ['How it landed', 'Number of times'], rows: [{ label: 'On its side', value: String(side) }, { label: 'Top up', value: String(up) }, { label: 'Top down', value: String(down) }] } },
      answer: round(side / n, 3),
      wrong: [[round(1 - side / n, 3), 'That is the probability that it does NOT land on its side.'], [side, 'That is the number of times. A probability is that number out of ALL the tosses.'], [round(side / (n - side), 3), 'You divided by the other results only. Divide by the total number of tosses, which includes the side results.']],
      hints: ['First find the total number of tosses from the table.', 'Probability = the times it landed on its side ÷ the total number of tosses.'],
      steps: [`Total tosses: ${side} + ${up} + ${down} = ${n}.`, `Experimental probability = ${side} ÷ ${n} = ${round(side / n, 3)}.`],
    }),
    check: ({ n, side }, a) => near(a * n, side) }),

  fam({ id: 'g8.prob.spinner-expected', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.b', rung: 2, form: 'steps',
    draw: () => {
      const n = pick([20, 25, 40, 50]), g = randInt(3, 9) * (n === 25 ? 1 : 2), red = randInt(3, 8), blue = n - g - red;
      if (blue < 3 || g >= n / 2) return null;
      const a = g / n, w = g / (red + blue);
      return Math.abs(w - a) / a > 0.35 ? { n, g, red, blue, N: 200, p: person() } : null;
    },
    make: ({ n, g, red, blue, N, p }) => ({
      question: `${p.name} spins a spinner many times and records the colour it stops on. It stops on green ${g} times, on red ${red} times and on blue ${blue} times.`,
      parts: [
        { prompt: 'How many spins were there altogether?', answer: n, hint: 'Add the three results.', wrong: [[g, 'That is only the green results. Add all three colours.']] },
        { prompt: 'What is the experimental probability of green, as a decimal?', answer: round(g / n, 3), hint: 'Divide the green results by the total number of spins.', wrong: [[round(g / (red + blue), 3), 'Divide by ALL the spins, including the green ones.']] },
        { prompt: `About how many times would green come up in ${N} more spins?`, answer: round((g / n) * N, 1), hint: 'Multiply the probability by the number of spins.', wrong: [[g + N - n, 'Do not add. Use the probability of green times the number of spins.']] },
      ],
      steps: [`Total spins: ${g} + ${red} + ${blue} = ${n}.`, `P(green) = ${g} ÷ ${n} = ${round(g / n, 3)}.`, `In ${N} spins: ${round(g / n, 3)} × ${N} = ${round((g / n) * N, 1)}.`],
    }),
    check: ({ n, g, N }, v) => v[0] === g + (n - g) && near(v[1] * v[0], g) && near(v[2], (g * N) / n) }),

  fam({ id: 'g8.prob.expected-times', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.b', rung: 2, form: 'word',
    draw: () => {
      const n = pick([40, 50, 80, 100]), c = randInt(2, 9) * (n === 50 || n === 100 ? 5 : 2), N = pick([200, 300, 400, 500]), a = (c * N) / n;
      if (!Number.isInteger(a) || c >= n / 2) return null;
      return uniq(a, c + (N - n), N - c, (c * N) / 100) ? { n, c, N, a, p: person() } : null;
    },
    make: ({ n, c, N, a, p }) => ({
      question: `${p.name} tossed a bottle top ${n} times. It landed on its side ${c} times. If ${p.she} tosses it ${N} times, about how many times should it land on its side?`,
      answer: a,
      wrong: [[c + (N - n), 'The number of times grows in proportion to the number of tosses. Do not add the extra tosses to the result.'], [N - c, 'That takes away the side results from the new total. Use the chance of landing on its side.'], [(c * N) / 100, 'The result is out of the number of tosses, not out of 100.']],
      hints: ['Find the experimental probability from the first set of tosses.', 'Multiply that probability by the new number of tosses.'],
      steps: [`Experimental probability = ${c} ÷ ${n}.`, `Expected: ${c} ÷ ${n} × ${N} = ${a} times.`],
    }),
    check: ({ n, c, N }, a) => a * n === c * N }),

  fam({ id: 'g8.prob.more-tosses-why', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.b', rung: 3, form: 'why',
    draw: () => {
      const [a, b] = twoPeople(), n1 = pick([10, 20]), h1 = n1 === 10 ? 7 : 14, n2 = pick([400, 500, 1000]), h2 = n2 * 0.52;
      return Number.isInteger(h2) ? { a, b, n1, h1, n2, h2 } : null;
    },
    make: ({ a, b, n1, h1, n2, h2 }) => ({
      question: `${a.name} tossed a fair coin ${n1} times and got ${h1} heads. ${b.name} tossed the same coin ${n2} times and got ${h2} heads. Whose result is likely to be closer to the true probability of heads, and why?`,
      options: [
        { text: `${b.name}'s, because more tosses usually give a result nearer to the true probability`, right: true },
        { text: `${a.name}'s, because ${h1} out of ${n1} is a bigger fraction of heads`, right: false, why: 'A bigger fraction is not a better one. A result from few tosses can easily be far from the true probability.' },
        { text: 'Both are equally good, because it is the same coin', right: false, why: 'The same coin does not make a short run of tosses as reliable as a long run.' },
        { text: `${a.name}'s, because fewer tosses means fewer mistakes in counting`, right: false, why: 'The question is about chance, not about counting mistakes. A long run evens out the lucky and unlucky tosses.' },
      ],
      hints: ['A fair coin has a probability of heads that stays the same on every toss.', 'Does a short run of tosses or a long run give a more steady result?'],
      steps: [`${a.name}: ${h1} ÷ ${n1} = ${round(h1 / n1, 2)}.`, `${b.name}: ${h2} ÷ ${n2} = ${round(h2 / n2, 2)}.`, 'More tosses even out the lucky and unlucky ones, so the long run is usually nearer to the true probability.'],
    }) }),
];
