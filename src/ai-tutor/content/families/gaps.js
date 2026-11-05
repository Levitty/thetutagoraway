// Skills still short of three question forms once the grade files were written.
import { randInt, pick } from '../schema.js';
import { family, commas, round } from './core.js';
import { person, sh } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });

export const FAMILIES = [
  fam({ id: 'g7.dec.tiles-row', skill: 'G6_DECIMALS_MUL', outcome: 'G7.DEC.b', rung: 2, form: 'word',
    draw: () => { const w = pick([0.25, 0.4, 0.6, 1.2, 1.5, 0.8]), n = randInt(4, 15); return { w, n, p: person() }; },
    make: ({ w, n, p }) => ({
      question: `${p.name} lays ${n} tiles in a row. Each tile is ${w} m wide. How long is the row, in metres?`,
      answer: round(w * n, 2),
      wrong: [[round(w + n, 2), 'Each tile adds its width, so that is a multiplication.'], [round((w * n) * 10, 2), 'Check the decimal point. One place in the question means one place in the answer.'], [round(n / w, 2), 'Dividing tells how many tiles fit. Here you know how many tiles there are.']],
      hints: ['Equal widths added again and again: multiply.', 'Multiply as if there were no point, then put the point back.'],
      steps: [`There are ${n} tiles, each ${w} m wide.`, `${n} × ${w} = ${round(w * n, 2)} m.`],
    }),
    check: ({ w, n }, a) => Math.abs(a / w - n) < 1e-9 }),
  fam({ id: 'g7.dec.point-spot', skill: 'G6_DECIMALS_MUL', outcome: 'G7.DEC.b', rung: 3, form: 'spot',
    draw: () => { const a = randInt(12, 48), b = randInt(2, 9); return a % 10 === 0 ? null : { a, b, p: person() }; },
    make: ({ a, b, p }) => {
      const whole = a * b, right = whole / 10, wrongShown = whole / 100;
      return { question: `${p.name} worked out ${a / 10} × ${b}. Which step has the mistake?`, story: false,
        working: [{ text: `Leave out the point: ${a} × ${b} = ${whole}`, ok: a * b === whole }, { text: `${a / 10} has 1 decimal place, so the answer needs 1 place.`, ok: true }, { text: `Put in the point: ${wrongShown}`, ok: wrongShown === right }],
        fix: `The answer needs 1 decimal place, so it is ${right}. The working put in 2 places.`,
        steps: [`${a} × ${b} = ${whole}.`, `With 1 decimal place: ${right}.`] };
    } }),
  fam({ id: 'g7.dec.share-litres', skill: 'G6_DECIMALS_DIV', outcome: 'G7.DEC.c', rung: 2, form: 'word',
    draw: () => { const each = pick([0.5, 1.2, 1.5, 2.5, 0.75, 1.25]), n = randInt(3, 8); return { each, n, p: person() }; },
    make: ({ each, n, p }) => ({
      question: `${p.name} shares ${round(each * n, 2)} litres of milk equally into ${n} bottles. How many litres go into each bottle?`,
      answer: each,
      wrong: [[round(each * n * n, 2), 'Sharing makes each amount smaller, so divide.'], [round((each * n) - n, 2), 'Sharing equally is a division, not taking away.'], [round(each * 10, 2), 'Check the decimal point in your answer.']],
      hints: ['Share equally means divide.', 'Keep the decimal point in line as you divide.'],
      steps: [`Total: ${round(each * n, 2)} litres, into ${n} bottles.`, `${round(each * n, 2)} ÷ ${n} = ${each} litres.`],
    }),
    check: ({ each, n }, a) => Math.abs(a * n - each * n) < 1e-9 }),
  fam({ id: 'g7.dec.how-many-packets', skill: 'G6_DECIMALS_DIV', outcome: 'G7.DEC.c', rung: 2, form: 'why',
    draw: () => { const s = pick([0.5, 0.25, 0.2]), k = randInt(3, 9); return { s, k }; },
    make: ({ s, k }) => ({
      question: `To divide ${k} by ${s}, a learner asks: how many lots of ${s} are in ${k}? Why is the answer bigger than ${k}?`, story: false,
      options: [{ text: `${s} is less than 1, so more than ${k} lots of it fit into ${k}`, right: true }, { text: 'Dividing always gives a bigger number', right: false, why: 'Dividing by a number greater than 1 gives a smaller answer.' }, { text: `The point must be moved to make ${k} bigger first`, right: false, why: 'Moving the point on its own changes the value. Think about how many lots fit.' }, { text: 'It is a mistake: the answer must be smaller', right: false, why: 'That is true only when dividing by more than 1.' }],
      hints: [`How many lots of ${s} make 1?`, `Then how many make ${k}?`],
      steps: [`${s} goes into 1 exactly ${round(1 / s, 0)} times.`, `So ${s} goes into ${k} exactly ${round(k / s, 0)} times, which is more than ${k}.`],
    }) }),
  fam({ id: 'g7.eq.money-left', skill: 'G6_SIMPLE_EQUATIONS', outcome: 'G7.EQUATIONS.c', rung: 2, form: 'word',
    draw: () => { const spent = pick([50, 80, 120, 150, 200]), left = pick([30, 70, 90, 110, 160]); return { spent, left, p: person() }; },
    make: ({ spent, left, p }) => ({
      question: `${p.name} has x shillings. After spending ${sh(spent)} on lunch, ${p.she} has ${sh(left)} left. Use the equation x − ${spent} = ${left} to find x.`,
      answer: spent + left,
      wrong: [[left - spent < 0 ? spent - left : left - spent, 'To undo taking away, add to both sides.'], [left, 'That is what is left. x is what there was at the start.'], [spent, 'That is the spending. x is what there was at the start.']],
      hints: ['What undoes taking away?', `Add ${spent} to both sides.`],
      steps: [`x − ${spent} = ${left}.`, `x = ${left} + ${spent}.`, `So x = ${spent + left}.`],
    }),
    check: ({ spent, left }, a) => a - spent === left }),
  fam({ id: 'g7.eq.balance-why', skill: 'G6_SIMPLE_EQUATIONS', outcome: 'G7.EQUATIONS.b', rung: 3, form: 'why',
    draw: () => ({ a: randInt(3, 15), r: randInt(4, 20) }),
    make: ({ a, r }) => ({
      question: `To solve x + ${a} = ${a + r}, a learner takes ${a} from both sides. Why must it come off both sides?`, story: false,
      options: [{ text: 'The two sides are equal, and doing the same to both keeps them equal', right: true }, { text: `Because ${a} is the bigger number`, right: false, why: 'The size of the number is not the reason.' }, { text: 'Because x must always be on the left', right: false, why: 'x can be on either side.' }, { text: 'So that the answer comes out even', right: false, why: 'The answer can be odd or even.' }],
      hints: ['Think of the equals sign as a balance.', 'What keeps a balance level?'],
      steps: ['An equation is like a level balance.', 'Taking the same from both sides keeps it level.'],
    }) }),
  fam({ id: 'g7.vol.box-carton', skill: 'G6_VOLUME_CUBOID', outcome: 'G7.VOL.c', rung: 2, form: 'word',
    draw: () => { const l = pick([20, 30, 40]), w = pick([10, 15, 20]), h = pick([10, 20]), s = pick([2, 5, 10]); return l % s || w % s || h % s ? null : { l, w, h, s }; },
    make: ({ l, w, h, s }) => {
      const v = l * w * h, n = (l / s | 0) * (w / s | 0) * (h / s | 0);
      return { question: `A carton is ${l} cm long, ${w} cm wide and ${h} cm high. How many cubes of soap with edge ${s} cm pack it exactly?`,
        answer: n,
        wrong: [[v, 'That is the volume of the carton in cm³. Each cube takes up more than 1 cm³.'], [round(v / s, 0), 'Divide by the volume of one cube, not by its edge.'], [round(l / s + w / s + h / s, 0), 'The rows, columns and layers are multiplied, not added.']],
        hints: ['How many cubes fit along each edge?', 'Multiply the three numbers.'],
        steps: [`Along the length ${l / s}, across ${w / s}, up ${h / s}.`, `${l / s} × ${w / s} × ${h / s} = ${n} cubes.`] };
    },
    check: ({ l, w, h, s }, a) => a * s * s * s === l * w * h }),
  fam({ id: 'g7.vol.find-height', skill: 'G6_VOLUME_CUBOID', outcome: 'G7.VOL.c', rung: 3, form: 'word',
    draw: () => { const l = pick([50, 60, 80]), w = pick([30, 40, 50]), h = pick([20, 25, 30, 40]); return { l, w, h }; },
    make: ({ l, w, h }) => ({
      question: `A cuboid water tank has a base ${l} cm by ${w} cm. Its volume is ${commas(l * w * h)} cm³. How high is the tank, in cm?`,
      answer: h,
      wrong: [[l * w * h - l * w, 'The volume is length × width × height. To find the height, divide.'], [l + w, 'Multiply the length and width, then divide the volume by that.'], [round((l * w * h) / l, 0), 'Divide by the width as well as the length.']],
      hints: ['Volume = base area × height.', 'Find the area of the base first.'],
      steps: [`Base area: ${l} × ${w} = ${commas(l * w)} cm².`, `Height: ${commas(l * w * h)} ÷ ${commas(l * w)} = ${h} cm.`],
    }),
    check: ({ l, w, h }, a) => a * l * w === l * w * h }),
  fam({ id: 'g7.whole.cheque-digit', skill: 'G7_PLACE_VALUE', outcome: 'G7.WHOLE.a', rung: 2, form: 'word',
    draw: () => { const m = randInt(2, 9), t = randInt(100, 900) , h = randInt(1, 9) * 100; return { n: m * 1000000 + t * 1000 + h, m, p: person() }; },
    make: ({ n, m, p }) => ({
      question: `${p.name} writes a cheque for ${sh(n)} for a county project. What is the total value of the digit ${m} at the start of the amount?`,
      answer: m * 1000000,
      wrong: [[m, 'That is the digit itself. Its total value depends on its place.'], [m * 100000, 'Count the places again: which column is the first digit in?'], [m * 10000000, 'Count the places again: which column is the first digit in?']],
      hints: ['Write the amount in a place value chart.', 'The first digit is in the millions place.'],
      steps: [`The digit ${m} is in the millions place.`, `Total value: ${m} × 1,000,000 = ${commas(m * 1000000)}.`],
    }),
    check: ({ n, m }, a) => Math.floor(n / 1000000) === m && a % 1000000 === 0 }),
  fam({ id: 'g7.whole.round-county-budget', skill: 'G7_ROUNDING_WHOLE', outcome: 'G7.WHOLE.d', rung: 3, form: 'why',
    draw: () => { const m = randInt(12, 58), r = randInt(100000, 899999); return r === 500000 ? null : { n: m * 1000000 + r, m, r, p: person() }; },
    make: ({ n, m, r, p }) => {
      const up = r >= 500000, right = (up ? m + 1 : m) * 1000000, wrong = (up ? m : m + 1) * 1000000;
      return { question: `A county's budget is ${sh(n)}. ${p.name} rounds it to the nearest million as ${sh(wrong)}. Why is this wrong?`,
        options: [{ text: up ? `The next digit is 5 or more, so it rounds up to ${commas(right)}` : `The next digit is less than 5, so it rounds down to ${commas(right)}`, right: true }, { text: 'Numbers are always rounded up', right: false, why: 'Rounding depends on the next digit.' }, { text: 'Only the last digit is looked at', right: false, why: 'Look at the digit just after the place you are rounding to.' }, { text: 'Money cannot be rounded', right: false, why: 'Large amounts are often rounded in reports.' }],
        hints: ['Find the millions digit.', 'Look at the digit straight after it.'],
        steps: [`The digit after the millions is ${Math.floor(r / 100000)}.`, `So ${commas(n)} rounds to ${commas(right)}.`] };
    } }),
  fam({ id: 'g7.angles.road-crossing', skill: 'G8_ANGLE_RELATIONSHIPS', outcome: 'G7.ANGLES.c', rung: 2, form: 'word',
    draw: () => { const a = randInt(35, 80); return { a, kind: pick(['alternate', 'corresponding']) }; },
    make: ({ a, kind }) => ({
      question: `A road cuts across a railway whose two rails are parallel. Where it meets rail A, the road makes an angle of ${a}°. What size is the ${kind} angle at rail B?`,
      answer: a,
      wrong: [[180 - a, `That would be for co-interior angles. ${kind === 'alternate' ? 'Alternate' : 'Corresponding'} angles are equal.`], [90 - a, 'These angles do not add up to 90°.'], [360 - a, 'That is the angle all the way round.']],
      hints: ['The rails are parallel.', `What do you know about ${kind} angles on parallel lines?`],
      steps: [`On parallel lines, ${kind} angles are equal.`, `So the angle is ${a}°.`],
    }),
    check: ({ a }, v) => v + (180 - a) === 180 }),
  fam({ id: 'g7.angles.parallel-reason', skill: 'G8_ANGLE_RELATIONSHIPS', outcome: 'G7.ANGLES.c', rung: 3, form: 'why',
    draw: () => { const a = randInt(50, 130); return a === 90 ? null : { a, p: person() }; },
    make: ({ a, p }) => ({
      question: `${p.name} marks a co-interior pair of angles between parallel lines as ${a}° and ${180 - a}°. Which fact supports this?`, story: false,
      options: [{ text: 'Co-interior angles between parallel lines add up to 180°', right: true }, { text: 'Co-interior angles are equal', right: false, why: 'Alternate and corresponding angles are equal. Co-interior angles are not.' }, { text: 'All angles on parallel lines add up to 90°', right: false, why: 'Angles at a right angle add to 90°. These lie between parallel lines.' }, { text: 'Angles at a point add up to 360°', right: false, why: 'That is true, but these two angles do not meet at one point.' }],
      hints: ['Co-interior angles sit on the same side, between the lines.', 'Do they look equal, or do they fill a straight line together?'],
      steps: [`Co-interior angles add up to 180°.`, `180 − ${a} = ${180 - a}°.`],
    }) }),
  fam({ id: 'g8.money.interest-table', skill: 'G9_COMPOUND_INTEREST', outcome: 'G8.MONEY.c', rung: 2, form: 'table',
    draw: () => { const P = pick([10000, 20000, 40000, 50000]), R = pick([5, 10, 20]); return { P, R }; },
    make: ({ P, R }) => {
      const A1 = P * (1 + R / 100), A2 = A1 * (1 + R / 100);
      return { question: `Read this SACCO table. Each year adds ${R}% to what is there at the start: compound interest. What goes in the empty box, in shillings?`,
        model: { type: 'table', data: { head: ['Year', 'Start (sh)', 'End (sh)'], rows: [{ cells: ['1', commas(P), commas(A1)] }, { cells: ['2', commas(A1), '?'] }] } },
        answer: A2,
        wrong: [[P + 2 * (P * R) / 100, `That is simple interest. Year 2's interest is worked on the new amount.`], [A2 - P, 'That is only the interest. The table asks for the whole amount at the end of the year.'], [(A1 * R) / 100, 'That is the interest in year 2. Add it to the amount at the start of the year.']],
        hints: ['Read the amount at the start of year 2.', `Add ${R}% of that amount.`],
        steps: [`Start of year 2: ${sh(A1)}.`, `Interest: ${R}% of ${commas(A1)} = ${sh((A1 * R) / 100)}.`, `End of year 2: ${sh(A2)}.`] };
    },
    check: ({ P, R }, a) => Math.abs(a / ((1 + R / 100) ** 2) - P) < 1e-6 }),
];
