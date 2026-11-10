// ============================================================================
// GRADE 5 MEASUREMENT: the skills that are not unit arithmetic. Choosing and reading
// units, scales, estimates (Length, Capacity, Mass, Time), Area and Volume.
// ============================================================================
import { fam, randInt, pick, shuffle, rnd, commas, person, sh, mc, tbl, distinct } from './g5c_lib.js';

const M = 'MEASUR.';
// A tap question with three or four options.
const opts = (right, wrongs, question, hints, steps, instruction = 'Choose the best answer.') => { const options = mc(right, wrongs); return options ? { question, options, instruction, hints, steps } : null; };

// ---------------------------------------------------------------- unit tables
const DIST = [['the distance from Nairobi to Nakuru', 'km'], ['the length of a pencil', 'cm'], ['the height of a classroom door', 'm'], ['a marathon race', 'km'], ['the width of an exercise book', 'cm'], ['the length of a football pitch', 'm'], ['the road from Kisumu to Kakamega', 'km'], ['the length of a bus', 'm'], ['the length of a rubber', 'cm'], ['a boda boda ride between two towns', 'km']];
const UNITS_L = ['cm', 'm', 'km'];
const WHY_L = { cm: 'A centimetre is very short, about the width of a finger.', m: 'A metre is about one big step, too short for this.', km: 'A kilometre is a long distance, about a 12 minute walk. It is too long for this.' };
const ML = [['a spoon of cough medicine', 'ml'], ['a cup of chai', 'ml'], ['a jerrycan of water', 'l'], ['a bucket of water', 'l'], ['a bottle of soda', 'ml'], ['a drum of cooking oil', 'l'], ['a dose of eye drops', 'ml'], ['a water tank on a roof', 'l']];
const GM = [['an egg', 'g'], ['a sack of potatoes', 'kg'], ['a pencil', 'g'], ['a bag of sugar', 'kg'], ['a packet of chewing gum', 'g'], ['a schoolchild', 'kg'], ['a tomato', 'g'], ['a bag of cement', 'kg']];
const NAMES_ML = { ml: 'millilitres', l: 'litres' };

// distance-unit items need three distinct units
const unitOpts = (right, units, mismatch, extra) => mc(right, [...units.filter(u => u !== right).map(u => [u, `${WHY_L[u] || ''} ${mismatch || ''}`.trim(), 'M_UNIT_SIZE_MISMATCH']), ...(extra ? [extra] : [])]);

export const FAMILIES = [
  // ================================================================ LENGTH
  fam({ id: 'g5c.lenc.kmid.choose', cs: `${M}LENGTH.KM_IDENTIFY_UNIT`, form: 'direct', rung: 1,
    gen: () => {
      const [d, right] = pick(DIST), p = person();
      const options = unitOpts(right, UNITS_L, '');
      return { question: `${p.name} wants to measure ${d}. Which unit is best?`, options, instruction: 'Choose the best unit.',
        hints: ['Is it a short length or a long distance?', 'A kilometre is about a 12 minute walk.'], steps: [`${d} is ${right === 'km' ? 'a long distance' : right === 'm' ? 'a medium length' : 'a short length'}.`, `The best unit is ${right}.`] };
    } }),
  fam({ id: 'g5c.lenc.kmid.sign', cs: `${M}LENGTH.KM_IDENTIFY_UNIT`, form: 'word', rung: 2,
    gen: () => {
      const town = pick(['Thika', 'Naivasha', 'Machakos', 'Nyeri', 'Kitale', 'Embu']), n = randInt(8, 90);
      const options = mc('km', [['kg', 'Kilo is in both words, but kg measures mass and km measures distance.', 'M_KM_KG_CONFUSION'], ['cm', 'A road sign for a town far away would need a long unit. A centimetre is tiny.', 'M_UNIT_SIZE_MISMATCH'], ['m', 'A town ' + n + ' metres away would be down the road. Road signs use a longer unit.', 'M_UNIT_SIZE_MISMATCH']]);
      return { question: `A road sign reads "${town} ${n}". The number shows how far ${town} is from the sign. ${town} is ${n} ___ away. Which unit fills the blank?`, options, instruction: 'Choose the unit.',
        hints: ['Road signs show long distances.', 'Which unit measures distance: km or kg?'], steps: ['Road signs give the distance in kilometres.', `${town} is ${n} km away.`] };
    } }),
  fam({ id: 'g5c.lenc.kmid.sort', cs: `${M}LENGTH.KM_IDENTIFY_UNIT`, form: 'table', rung: 2,
    gen: () => {
      const longs = shuffle(DIST.filter(d => d[1] === 'km')).slice(0, 1), shorts = shuffle(DIST.filter(d => d[1] !== 'km')).slice(0, 3), all = shuffle([...longs, ...shorts]);
      const options = mc(longs[0][0].replace(/^the |^a /, ''), shorts.map(s => [s[0].replace(/^the |^a /, ''), `${s[0]} is ${s[1] === 'm' ? 'a few metres' : 'a few centimetres'} long, so it is not measured in km.`, 'M_UNIT_SIZE_MISMATCH']));
      if (!options) return null;
      return { question: 'The table lists four things to measure. Which one is measured in kilometres?', model: tbl(['Thing to measure'], all.map(a => [a[0].replace(/^the |^a /, '')])), options, instruction: 'Choose the one measured in km.',
        hints: ['Which one is a long distance?', 'Kilometres are for distances between places.'], steps: [`${longs[0][0]} is a long distance.`, 'Kilometres are used for long distances.'] };
    } }),

  fam({ id: 'g5c.lenc.kmest.pick', cs: `${M}LENGTH.KM_ESTIMATE_DISTANCE`, form: 'direct', rung: 1,
    gen: () => {
      const t = pick([10, 15, 20, 30]), km = Math.round(t / 12), p = person();
      const options = mc(`about ${km || 1} km`, [[`about ${(km || 1) * 50} km`, 'That would take many hours on foot. Use a walk of about 12 minutes for 1 km.', 'M_UNREALISTIC_ESTIMATE'], [`about ${(km || 1) * 10} m`, 'That is only a short way, much less than a 15 minute walk.', 'M_UNREALISTIC_ESTIMATE'], [`about ${t} minutes`, 'That is a time, not a distance. Distance is measured in km.', 'M_TIME_AS_DISTANCE']]);
      return { question: `${p.name} walks to school in about ${t} minutes. A walk of about 12 minutes is roughly 1 km. About how far is ${p.her} school?`, options, instruction: 'Choose the most reasonable estimate.',
        hints: ['Use the benchmark: 12 minutes is about 1 km.', 'The answer is a distance.'], steps: [`${t} minutes is about ${km || 1} lots of 12 minutes.`, `About ${km || 1} km.`] };
    } }),
  fam({ id: 'g5c.lenc.kmest.compare', cs: `${M}LENGTH.KM_ESTIMATE_DISTANCE`, form: 'word', rung: 2,
    gen: () => {
      const a = pick([['Nairobi', 'Thika', 45], ['Nairobi', 'Machakos', 60], ['Nairobi', 'Nakuru', 160], ['Kisumu', 'Kakamega', 50]]), p = person();
      const est = Math.round(a[2] / 10) * 10 || 10;
      return { question: `The road from ${a[0]} to ${a[1]} is about ${est} km. A matatu travels at about 50 km each hour. About how many kilometres does it travel in 2 hours? Estimate a whole number of kilometres.`, answer: 100,
        wrong: [[2 * 12, 'That uses the walking benchmark. A matatu goes much faster.', 'M_UNREALISTIC_ESTIMATE'], [2, 'That is the number of hours, not the distance.', 'M_TIME_AS_DISTANCE'], [120, 'The matatu travels 50 km each hour. Two hours is 2 × 50.', 'M_UNREALISTIC_ESTIMATE'], [1000, 'That is far too long for 2 hours.', 'M_UNREALISTIC_ESTIMATE']],
        hints: ['One hour is about 50 km.', 'Two hours is twice as far.'], steps: ['2 × 50 = 100.', 'About 100 km.'], chk: (v) => v === 100, _a: a, _p: p };
    } }),
  fam({ id: 'g5c.lenc.kmest.sense', cs: `${M}LENGTH.KM_ESTIMATE_DISTANCE`, form: 'why', rung: 3,
    gen: () => {
      const place = pick(['the shop at the end of the road', 'the school gate from the classroom', 'the next town']), tru = { 'the shop at the end of the road': '1 km', 'the school gate from the classroom': '100 m', 'the next town': '15 km' }[place];
      const wrongs = ['1 km', '100 m', '15 km', '500 km'].filter(x => x !== tru).slice(0, 3);
      const options = mc(tru, wrongs.map(w => [w, `${w} is not a sensible distance for ${place}. Think about how long it would take to walk.`, 'M_UNREALISTIC_ESTIMATE']));
      return { question: `${person().name} asks: which is the most sensible estimate of the distance to ${place}?`, options, instruction: 'Choose the most reasonable estimate.',
        hints: ['How long would it take to walk there?', '1 km is about 12 minutes on foot.'], steps: [`${place} is about ${tru} away.`, 'The other distances are too short or too long.'] };
    } }),

  // ================================================================ CAPACITY
  fam({ id: 'g5c.capc.mlid.label', cs: `${M}CAPACITY.ML_IDENTIFY_UNIT`, form: 'direct', rung: 1,
    gen: () => {
      const [d, right] = pick(ML), other = right === 'ml' ? 'l' : 'ml', p = person();
      const options = mc(right === 'ml' ? 'millilitres, ml' : 'litres, l', [[right === 'ml' ? 'litres, l' : 'millilitres, ml', 'Think about how much it holds. ' + (right === 'ml' ? 'A litre is a lot for this.' : 'A millilitre is only a few drops, too small for this.'), 'M_WRONG_UNIT_FOR_SMALL_AMOUNT'], ['grammes, g', 'Grammes measure mass, not how much a container holds.', 'M_MASS_LABEL_AS_CAPACITY'], ['centimetres, cm', 'Centimetres measure length.', 'M_MASS_LABEL_AS_CAPACITY']]);
      return { question: `${p.name} wants to measure how much ${d} holds. Which unit is best?`, options, instruction: 'Choose the unit.',
        hints: ['Is it a small amount or a large amount?', 'Capacity is measured in ml or l.'], steps: [`${d} ${right === 'ml' ? 'holds a small amount' : 'holds a large amount'}.`, `Use ${NAMES_ML[right]}.`] };
    } }),
  fam({ id: 'g5c.capc.mlid.odd', cs: `${M}CAPACITY.ML_IDENTIFY_UNIT`, form: 'table', rung: 2,
    gen: () => {
      const a = pick([250, 300, 500, 330]), b = pick([250, 500, 750]), c = pick([1, 2, 5]);
      const rows = shuffle([['Sugar packet', `${b} g`], ['Milk packet', `${a} ml`], ['Ruler', `${c * 10} cm`]]);
      const options = mc(`${a} ml on the milk packet`, [[`${b} g on the sugar packet`, 'Grammes measure mass, not capacity.', 'M_MASS_LABEL_AS_CAPACITY'], [`${c * 10} cm on the ruler`, 'Centimetres measure length.', 'M_MASS_LABEL_AS_CAPACITY']]);
      return { question: 'These labels are on three things. Which label shows capacity?', model: tbl(['Thing', 'Label'], rows), options, instruction: 'Choose the label that shows capacity.',
        hints: ['Capacity is how much a container holds.', 'ml and l are units of capacity.'], steps: ['ml shows how much liquid a container holds.', `The milk packet label, ${a} ml, shows capacity.`] };
    } }),
  fam({ id: 'g5c.capc.mlid.more', cs: `${M}CAPACITY.ML_IDENTIFY_UNIT`, form: 'why', rung: 3,
    gen: () => {
      const a = pick([250, 500, 750]), b = pick([1, 2, 3]), p = person();
      const options = mc(`The ${b} l bottle, because ${b} l = ${b * 1000} ml`, [[`The ${a} ml bottle, because ${a} is more than ${b}`, 'The units are different. Change both to millilitres before comparing.', 'M_BIGGER_NUMBER_MEANS_MORE'], [`They hold the same amount`, `${b} l is ${b * 1000} ml, which is more than ${a} ml.`, 'M_BIGGER_NUMBER_MEANS_MORE']]);
      return { question: `${p.name} compares a ${a} ml bottle of water with a ${b} l bottle of cooking oil. Which holds more?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['1 l = 1000 ml.', 'Compare the two in the same unit.'], steps: [`${b} l = ${b * 1000} ml.`, `${b * 1000} ml is more than ${a} ml.`] };
    } }),

  fam({ id: 'g5c.capc.mlscale.read', cs: `${M}CAPACITY.ML_MEASURE_SCALE`, form: 'word', rung: 2,
    gen: () => {
      const gap = pick([100, 200]), n = pick([3, 4]), step = gap / (n + 1), base = pick([100, 200, 300, 400]), k = randInt(1, n), ans = base + k * step;
      if (!Number.isInteger(step)) return null;
      const p = person();
      return { question: `A jug is labelled ${base} ml and ${base + gap} ml, with ${n} small marks between the labels. The water is at the ${['', 'first', 'second', 'third', 'fourth'][k]} small mark above ${base} ml. How many millilitres of water are in the jug?`, answer: ans,
        wrong: [[base + k, 'You counted each small mark as 1 ml. First work out what each small mark is worth.', 'M_EACH_MARK_IS_ONE'], [base, 'The water is above the lower label. Count the small marks.', 'M_EACH_MARK_IS_ONE'], [base + gap, 'The water has not reached the next label yet.', 'M_EACH_MARK_IS_ONE'], [ans + step, 'Count the marks again.', 'M_READS_FROM_ABOVE']],
        hints: ['Count how many equal spaces there are between the two labels.', 'Find the value of one small mark, then count up.'], steps: [`One small mark is ${gap} ÷ ${n + 1} = ${step} ml.`, `${base} + ${k} × ${step} = ${ans} ml.`], chk: (v) => (v - base) * (n + 1) === k * gap };
    } }),
  fam({ id: 'g5c.capc.mlscale.step', cs: `${M}CAPACITY.ML_MEASURE_SCALE`, form: 'direct', rung: 2,
    gen: () => {
      const gap = pick([100, 200, 500]), n = pick([1, 3, 4, 9]), step = gap / (n + 1);
      if (!Number.isInteger(step) || step === 1) return null;
      const options = mc(`${step} ml`, [['1 ml', 'The small marks are not 1 ml each. Share the gap by the number of equal spaces.', 'M_EACH_MARK_IS_ONE'], [`${gap / n} ml`, `There are ${n + 1} spaces, not ${n}. Count the spaces between the labels.`, 'M_EACH_MARK_IS_ONE'], [`${gap} ml`, 'That is the gap between the labelled marks, not one small step.', 'M_EACH_MARK_IS_ONE']]);
      return { question: `On a measuring jug, the labels are ${gap} ml apart and there are ${n} small marks between them. How much is each small step worth?`, options, instruction: 'Choose the value of one small step.',
        hints: [`${n} marks make ${n + 1} equal spaces.`, 'Divide the gap by the number of spaces.'], steps: [`${gap} ÷ ${n + 1} = ${step}.`, `Each step is ${step} ml.`] };
    } }),
  fam({ id: 'g5c.capc.mlscale.eye', cs: `${M}CAPACITY.ML_MEASURE_SCALE`, form: 'why', rung: 3,
    gen: () => {
      const p = person();
      const options = mc('Eyes level with the water, jug on a table', [['Look down into the jug from above it', 'Looking from above makes the water look higher or lower than it is.', 'M_READS_FROM_ABOVE'], ['Tilt the jug to see the level better', 'A tilted jug makes the level slope and gives a wrong reading.', 'M_READS_FROM_ABOVE'], ['Read only the nearest labelled mark', 'The small marks matter. Work out what each one is worth.', 'M_EACH_MARK_IS_ONE']]);
      return { question: `${p.name} wants an accurate reading of how much water is in a measuring jug marked in ml. What is the best way to read it?`, options, instruction: 'Choose the best way.',
        hints: ['Where should your eyes be?', 'Should the jug be level?'], steps: ['Put the jug on a flat table.', 'Read with your eyes level with the water.'] };
    } }),

  fam({ id: 'g5c.capc.fill.count', cs: `${M}CAPACITY.ML_MEASURE_BY_FILLING`, form: 'word', rung: 1,
    gen: () => {
      const size = pick([5, 10, 25, 50, 100, 250]), n = randInt(3, 12), p = person();
      return { question: `${p.name} fills a cup using a ${size} ml spoon ${n} times. How many millilitres does the cup hold?`, answer: size * n,
        wrong: [[n, `${n} is the number of fills. Each fill is ${size} ml.`, 'M_GIVES_NUMBER_OF_FILLS'], [size + n, 'Repeated fills mean multiply, not add.', 'M_GIVES_NUMBER_OF_FILLS'], [size * n + size, 'Count the fills again.', 'M_GIVES_NUMBER_OF_FILLS'], [size * n / 10, 'Check the number of zeros.', 'M_GIVES_NUMBER_OF_FILLS']],
        hints: ['How much is one fill? How many fills?', 'Multiply the two.'], steps: [`${n} × ${size} = ${size * n}.`, `${size * n} ml.`], chk: (v) => v / n === size };
    } }),
  fam({ id: 'g5c.capc.fill.compare', cs: `${M}CAPACITY.ML_MEASURE_BY_FILLING`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(3, 5), b = a + randInt(1, 3), [n1, n2] = ['Cup A', 'Cup B'];
      const options = mc('Cup A, because it needs fewer cupfuls', [['Cup B, because it needed more cupfuls', 'More fills means each fill is smaller. The cup that fills the jug in fewer goes is the bigger cup.', 'M_MORE_FILLS_BIGGER_CUP'], ['They both hold the same amount', `Cup A fills the jug in ${a} fills and Cup B needs ${b}. They are not the same size.`, 'M_MORE_FILLS_BIGGER_CUP']]);
      return { question: `${person().name} fills the same jug with two cups. Cup A fills it in ${a} cupfuls. Cup B fills it in ${b} cupfuls. Which cup holds more?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['The jug is always the same size.', 'A bigger cup needs fewer fills.'], steps: [`Cup A: ${a} fills. Cup B: ${b} fills.`, 'Fewer fills means a bigger cup.'] };
    } }),
  fam({ id: 'g5c.capc.fill.needed', cs: `${M}CAPACITY.ML_MEASURE_BY_FILLING`, form: 'steps', rung: 3,
    gen: () => {
      const cap = pick([500, 750, 1000, 1500]), size = pick([50, 100, 250, 125]), p = person();
      if (cap % size) return null;
      return { question: `${p.name} wants to fill a ${cap} ml bottle using a ${size} ml cup.`,
        parts: [{ prompt: 'How many cupfuls are needed?', answer: cap / size, hint: 'How many lots of the cup fit into the bottle?', wrong: [[cap * size, 'Dividing finds how many cups fit. Multiplying would give a much larger number.', 'M_GIVES_NUMBER_OF_FILLS'], [cap - size, 'Take the number of cups that fit, do not subtract.', 'M_GIVES_NUMBER_OF_FILLS'], [cap / size + 1, 'Check by multiplying the cups by ' + size + '.', 'M_GIVES_NUMBER_OF_FILLS']] },
          { prompt: `With a cup of ${size * 2} ml instead, how many cupfuls are needed?`, answer: cap / (size * 2), hint: 'A bigger cup needs fewer fills.', wrong: [[cap / size * 2, 'A bigger cup needs fewer fills, not more.', 'M_MORE_FILLS_BIGGER_CUP'], [cap / size, 'That was the number for the smaller cup.', 'M_MORE_FILLS_BIGGER_CUP'], [cap / size / 2 + 1, 'Check by multiplying.', 'M_MORE_FILLS_BIGGER_CUP']] }],
        steps: [`${cap} ÷ ${size} = ${cap / size}.`, `${cap} ÷ ${size * 2} = ${cap / (size * 2)}.`], chk: (x, v) => v[0] * size === cap && v[1] * size * 2 === cap };
    } }),

  fam({ id: 'g5c.capc.mlest.best', cs: `${M}CAPACITY.ML_ESTIMATE`, form: 'direct', rung: 1,
    gen: () => {
      const [d, ml] = pick([['a cup of chai', 250], ['a bottle of soda', 500], ['a spoon of cough syrup', 5], ['a small packet of milk', 500], ['a mug of uji', 300]]);
      const options = mc(`${ml} ml`, [[`${ml * 10} ml`, 'That is ten times too much. Think of how big the container is.', 'M_NO_BENCHMARKS'], [`${Math.max(1, ml / 100)} ml`, 'That is far too little, only a few drops.', 'M_NO_BENCHMARKS'], [`${ml * 100} ml`, `That is ${ml / 10} litres. Much too large.`.replace(/(\d+\.?\d*) litres/, (m, x) => `${x} litres`), 'M_NO_BENCHMARKS']]);
      return { question: `Which is the best estimate for how much ${d} holds?`, options, instruction: 'Choose the best estimate.',
        hints: ['A cup is about 250 ml and a soda bottle is about 500 ml.', 'Compare with the benchmark.'], steps: [`${d} is about ${ml} ml.`, 'The others are far too large or too small.'] };
    } }),
  fam({ id: 'g5c.capc.mlest.which', cs: `${M}CAPACITY.ML_ESTIMATE`, form: 'why', rung: 2,
    gen: () => {
      const tall = pick([200, 250]), wide = pick([500, 600]), p = person();
      const options = mc('The short wide bowl', [['The tall thin glass', 'Height alone does not tell the capacity. A wide container can hold more.', 'M_TALLER_HOLDS_MORE'], ['They hold the same', 'They do not look the same size once width is counted. Measure to check.', 'M_TALLER_HOLDS_MORE']]);
      return { question: `${p.name} has a tall thin glass and a short wide bowl. The glass holds ${tall} ml and the bowl holds ${wide} ml, but ${p.she} has not measured them yet. Which does ${p.she} think holds more, if ${p.she} looks at the whole shape and not only the height?`, options, instruction: 'Choose the better estimate.',
        hints: ['Think about how wide the container is as well as how tall.', 'Measure to check.'], steps: ['A wide bowl can hold more than a tall thin glass.', `The bowl holds ${wide} ml, the glass ${tall} ml.`] };
    } }),
  fam({ id: 'g5c.capc.mlest.record', cs: `${M}CAPACITY.ML_ESTIMATE`, form: 'word', rung: 3,
    gen: () => {
      const est = pick([200, 250, 300, 400]), meas = est - randInt(1, 4) * 10, p = person();
      return { question: `${p.name} estimates that a cup holds ${est} ml and then measures it as ${meas} ml. By how many millilitres was the estimate out? Give a whole number.`, answer: est - meas,
        wrong: [[meas, 'That is the measured amount. Find the difference between estimate and measure.', 'M_NO_BENCHMARKS'], [est, 'That is the estimate.', 'M_NO_BENCHMARKS'], [est + meas, 'Take the smaller from the larger to find a difference.', 'M_NO_BENCHMARKS'], [est - meas + 10, 'Check the subtraction.', 'M_NO_BENCHMARKS']],
        hints: ['Subtract the smaller amount from the larger.', 'The estimate does not have to be exact.'], steps: [`${est} − ${meas} = ${est - meas}.`, 'The estimate was out by that much.'], chk: (v) => v === est - meas };
    } }),

  // ================================================================ MASS
  fam({ id: 'g5c.masc.gram.label', cs: `${M}MASS.MASS_GRAMME_RECOGNISE`, form: 'word', rung: 1,
    gen: () => {
      const n = pick([250, 500, 100, 200, 400]), item = pick(['tea leaves', 'salt', 'sugar', 'cocoa']);
      const options = mc(`${n} g`, [[`${n} kg`, 'kg is a kilogramme, a thousand times more than g. A small packet is measured in grammes.', 'M_G_KG_SYMBOL_SWAP'], [`${n} ml`, 'ml measures liquid. A solid has its mass in g or kg.', 'M_MASS_CAPACITY_UNITS'], [`${n} l`, 'l is for liquids.', 'M_MASS_CAPACITY_UNITS']]);
      return { question: `A packet of ${item} is labelled "${n} g". What is its mass?`, options, instruction: 'Choose the correct mass.',
        hints: ['g stands for grammes.', 'It is a small packet.'], steps: [`${n} g is ${n} grammes.`, 'The mass is ' + n + ' g.'] };
    } }),
  fam({ id: 'g5c.masc.gram.which', cs: `${M}MASS.MASS_GRAMME_RECOGNISE`, form: 'table', rung: 2,
    gen: () => {
      const a = pick([1, 2, 5]), rows = shuffle([['Sugar', `${a} kg`], ['Cooking oil', `${a} l`], ['Milk', `${a * 250} ml`]]);
      const options = mc(`${a} kg on the sugar`, [[`${a} l on the cooking oil`, 'l shows capacity for liquids, not the mass of a solid.', 'M_MASS_CAPACITY_UNITS'], [`${a * 250} ml on the milk`, 'ml shows capacity, not mass.', 'M_MASS_CAPACITY_UNITS']]);
      return { question: 'Three things have labels. Which label shows a mass?', model: tbl(['Thing', 'Label'], rows), options, instruction: 'Choose the label that shows mass.',
        hints: ['Mass is measured in g or kg.', 'l and ml are for liquids.'], steps: ['kg is a unit of mass.', 'The sugar label shows mass.'] };
    } }),
  fam({ id: 'g5c.masc.gram.spot', cs: `${M}MASS.MASS_GRAMME_RECOGNISE`, form: 'spot', rung: 3,
    gen: () => {
      const n = pick([250, 500, 100]), p = person();
      return { question: `A packet of tea leaves is labelled ${n} g. ${p.name} describes it. Which step has the mistake?`,
        working: [{ text: 'Step 1: The label has a number and a unit.', ok: true }, { text: `Step 2: The unit g is kilogrammes, so the packet has a mass of ${n} kg.`, ok: false }, { text: `Step 3: A ${n} kg packet is a very heavy tea packet.`, ok: true }],
        fix: `g stands for grammes, not kilogrammes. The packet is ${n} g, a small light packet.`, mis: 'M_G_KG_SYMBOL_SWAP', hints: ['Does a tea packet really weigh that much?'], steps: [`${n} g.`] };
    } }),

  fam({ id: 'g5c.masc.unit.choose', cs: `${M}MASS.MASS_CHOOSE_UNIT`, form: 'direct', rung: 1,
    gen: () => {
      const [d, right] = pick(GM), p = person();
      const options = mc(right === 'g' ? 'grammes' : 'kilogrammes', [[right === 'g' ? 'kilogrammes' : 'grammes', right === 'g' ? 'A kilogramme is 1000 g, much too big for something so light.' : 'A gramme is tiny. A heavy thing would be a huge number of grammes.', 'M_UNIT_UNREASONABLE_MAGNITUDE'], ['litres', 'Litres measure liquid, not the mass of a solid thing.', 'M_UNIT_UNREASONABLE_MAGNITUDE'], ['centimetres', 'Centimetres measure length.', 'M_UNIT_UNREASONABLE_MAGNITUDE']]);
      return { question: `A market trader asks ${p.name} which unit to use when weighing ${d}. Which unit is best?`, options, instruction: 'Choose the best unit.',
        hints: ['Is it light or heavy?', 'An egg is about 60 g. A bag of sugar is about 2 kg.'], steps: [`${d} is ${right === 'g' ? 'light' : 'heavy'}.`, `Use ${right === 'g' ? 'grammes' : 'kilogrammes'}.`] };
    } }),
  fam({ id: 'g5c.masc.unit.complete', cs: `${M}MASS.MASS_CHOOSE_UNIT`, form: 'word', rung: 2,
    gen: () => {
      const [d, right] = pick(GM), n = right === 'g' ? pick([20, 60, 100, 150, 250]) : pick([2, 5, 20, 50, 60]);
      const options = mc(right, [[right === 'g' ? 'kg' : 'g', `${n} ${right === 'g' ? 'kg' : 'g'} does not make sense for ${d}. Check if the number and unit fit together.`, 'M_UNIT_UNREASONABLE_MAGNITUDE'], ['l', 'Litres are for liquids.', 'M_SIZE_DECIDES_UNIT'], ['cm', 'Centimetres measure length.', 'M_SIZE_DECIDES_UNIT']]);
      return { question: `Complete the sentence: ${d[0].toUpperCase() + d.slice(1)} has a mass of about ${n} ___.`, options, instruction: 'Choose g or kg.',
        hints: ['Think of how heavy it is.', 'Does the number and unit fit?'], steps: [`${d} is ${right === 'g' ? 'light' : 'heavy'}.`, `About ${n} ${right}.`] };
    } }),
  fam({ id: 'g5c.masc.unit.size', cs: `${M}MASS.MASS_CHOOSE_UNIT`, form: 'why', rung: 3,
    gen: () => {
      const p = person();
      const thing = pick([['a big empty cardboard carton', 'light'], ['a small stone', 'heavy'], ['a large bag of cotton wool', 'light']]);
      const options = mc(thing[1] === 'light' ? 'Grammes, as it is light though big' : 'Kilogrammes, as it is heavy though small', [[thing[1] === 'light' ? 'Kilogrammes, because it looks big' : 'Grammes, because it looks small to me', 'Size alone does not decide the unit. How heavy it is decides.', 'M_SIZE_DECIDES_UNIT'], ['Litres, because it takes up space', 'Litres measure liquids.', 'M_SIZE_DECIDES_UNIT']]);
      return { question: `${p.name} must choose a unit for the mass of ${thing[0]}. Which unit and reason is best?`, options, instruction: 'Choose the unit and reason.',
        hints: ['Is the thing heavy or light?', 'Big things can be light and small things can be heavy.'], steps: [`${thing[0]} is ${thing[1]}.`, 'So choose the unit that fits its mass.'] };
    } }),

  fam({ id: 'g5c.masc.bal.sum', cs: `${M}MASS.MASS_MEASURE_BALANCE`, form: 'word', rung: 1,
    gen: () => {
      const m = [pick([100, 200]), pick([50, 20]), pick([10, 20, 50])], t = m[0] + m[1] + m[2], item = pick(['tomato', 'mango', 'avocado', 'onion']);
      return { question: `A ${item} balances a ${m[0]} g, a ${m[1]} g and a ${m[2]} g mass on a beam balance. What is the mass of the ${item} in grammes?`, answer: t,
        wrong: [[3, 'That counts the masses. Add the value written on each one.', 'M_COUNT_MASSES_NOT_VALUES'], [m[0], 'That is only the biggest mass. All three balance the object.', 'M_COUNT_MASSES_NOT_VALUES'], [t + 100, 'Check the addition.', 'M_COUNT_MASSES_NOT_VALUES'], [m[0] + m[1], 'The third mass is missing.', 'M_COUNT_MASSES_NOT_VALUES']],
        hints: ['When the balance is level, the masses add up to the object.', 'Add the values on the masses.'], steps: [`${m[0]} + ${m[1]} + ${m[2]} = ${t}.`, `${t} g.`], chk: (v) => v === m[0] + m[1] + m[2] };
    } }),
  fam({ id: 'g5c.masc.bal.heavier', cs: `${M}MASS.MASS_MEASURE_BALANCE`, form: 'why', rung: 2,
    gen: () => {
      const [a, b] = shuffle(['an avocado', 'an orange', 'a mango', 'a lemon']).slice(0, 2);
      const options = mc(`${a[0].toUpperCase() + a.slice(1)}, because its pan went down`, [[`${b[0].toUpperCase() + b.slice(1)}, because its pan went up`, 'The heavier object pushes its pan down. The pan that rises holds the lighter object.', 'M_HEAVIER_SIDE_UP'], ['They have the same mass', 'If they were the same, the pans would be level.', 'M_HEAVIER_SIDE_UP']]);
      return { question: `On a beam balance, the pan with ${a} goes down and the pan with ${b} goes up. Which is heavier?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['The heavier object pulls its pan down.', 'The pan that goes up is lighter.'], steps: ['The heavier side goes down.', `${a} is heavier.`] };
    } }),
  fam({ id: 'g5c.masc.bal.which-masses', cs: `${M}MASS.MASS_MEASURE_BALANCE`, form: 'direct', rung: 3,
    gen: () => {
      const target = pick([350, 270, 180, 460]), sets = { 350: [200, 100, 50], 270: [200, 50, 20], 180: [100, 50, 20, 10], 460: [200, 200, 50, 10] }[target];
      const options = mc(sets.join(' g + ') + ' g', [[[...sets.slice(0, -1)].join(' g + ') + ' g', 'These do not add up to the mass. Check the total of the values.', 'M_COUNT_MASSES_NOT_VALUES'], [[sets.length + ' masses'].join(''), 'The number of masses is not the mass. Use the values on the masses.', 'M_COUNT_MASSES_NOT_VALUES'], [[...sets, 100].join(' g + ') + ' g', 'These add up to more than the mass.', 'M_COUNT_MASSES_NOT_VALUES']]);
      return { question: `Which masses on a balance will exactly balance ${target} g of sugar?`, options, instruction: 'Choose the masses that add up.',
        hints: ['Add the values on the masses.', `Does the total equal ${target} g?`], steps: [`${sets.join(' + ')} = ${target}.`, 'These masses balance the sugar.'] };
    } }),

  fam({ id: 'g5c.masc.scale.dial', cs: `${M}MASS.MASS_READ_SCALE`, form: 'word', rung: 2,
    gen: () => {
      const n = pick([4, 9]), step = 100 / (n + 1), base = pick([0, 100, 200, 300, 400]), k = randInt(1, n), ans = base + k * step;
      return { question: `A dial scale is labelled 0, 100, 200, 300, 400 and 500 g. Between each pair of labels there are ${n} small marks. The pointer is on the ${['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'][k] || k + 'th'} small mark after ${base} g. What mass does it show, in grammes?`, answer: ans,
        wrong: [[base + k, 'You counted each small mark as 1 g. First find what each small mark is worth.', 'M_EACH_MARK_ONE_UNIT'], [base, 'The pointer is past the label. Count the small marks.', 'M_READ_NEAREST_LABEL'], [base + 100, 'The pointer has not reached the next label yet.', 'M_READ_NEAREST_LABEL'], [ans + step, 'Count the marks again.', 'M_EACH_MARK_ONE_UNIT']],
        hints: [`${n} small marks make ${n + 1} equal spaces between labels.`, 'Divide 100 g by the number of spaces.'], steps: [`Each small mark is 100 ÷ ${n + 1} = ${step} g.`, `${base} + ${k} × ${step} = ${ans} g.`], chk: (v) => (v - base) * (n + 1) === k * 100 };
    } }),
  fam({ id: 'g5c.masc.scale.half', cs: `${M}MASS.MASS_READ_SCALE`, form: 'direct', rung: 1,
    gen: () => {
      const base = pick([100, 200, 300, 400, 500]), options = mc(`${base + 50} g`, [[`${base} g`, 'The pointer is past the label. Do not read the nearest label.', 'M_READ_NEAREST_LABEL'], [`${base + 100} g`, 'The pointer is halfway, not at the next label.', 'M_READ_NEAREST_LABEL'], [`${base + 5} g`, 'Halfway between labels 100 g apart is 50 g past the lower label.', 'M_EACH_MARK_ONE_UNIT']]);
      return { question: `${person().name} weighs flour. The pointer rests exactly halfway between the ${base} g mark and the ${base + 100} g mark. What mass is that?`, options, instruction: 'Choose the mass.',
        hints: ['Halfway between two labels.', 'Half of the gap of 100 g is 50 g.'], steps: [`${base} + 50 = ${base + 50}.`, `${base + 50} g.`] };
    } }),
  fam({ id: 'g5c.masc.scale.diff', cs: `${M}MASS.MASS_READ_SCALE`, form: 'steps', rung: 3,
    gen: () => {
      const n = 4, step = 20, a = pick([100, 200]) + step * randInt(1, 4), b = a + step * randInt(1, 4) + 100, p = person();
      return { question: `A dial scale has labels every 100 g with ${n} small marks between them. ${p.name} weighs two loads. The first pointer is at ${a} g and the second is at ${b} g.`,
        parts: [{ prompt: 'What is each small mark worth, in grammes?', answer: step, hint: `${n} marks make ${n + 1} equal spaces in 100 g.`, wrong: [[1, 'Do not count each mark as 1 g.', 'M_EACH_MARK_ONE_UNIT'], [25, `${n} marks make ${n + 1} spaces, not ${n}.`, 'M_EACH_MARK_ONE_UNIT'], [100, 'That is the gap between labels.', 'M_READ_NEAREST_LABEL']] },
          { prompt: 'How much heavier is the second load than the first, in grammes?', answer: b - a, hint: 'Subtract the first reading from the second.', wrong: [[a + b, 'Take away to find a difference.', 'M_EACH_MARK_ONE_UNIT'], [b, 'That is the second reading, not the difference.', 'M_EACH_MARK_ONE_UNIT'], [b - a + 20, 'Check the subtraction.', 'M_EACH_MARK_ONE_UNIT']] }],
        steps: [`100 ÷ ${n + 1} = ${step} g.`, `${b} − ${a} = ${b - a} g.`], chk: (x, v) => v[0] === step && v[1] === b - a };
    } }),

  fam({ id: 'g5c.masc.est.bench', cs: `${M}MASS.MASS_ESTIMATE_GRAMMES`, form: 'word', rung: 2,
    gen: () => {
      const per = pick([5, 10, 20]), n = pick([10, 20, 30, 50]), p = person();
      return { question: `One bottle top of sand has a mass of about ${per} g. A cup holds ${n} bottle tops of sand. About what mass of sand is in the cup, in grammes?`, answer: per * n,
        wrong: [[per + n, 'The benchmark is repeated, so multiply. Do not add.', 'M_BENCHMARK_ADD_NOT_REPEAT'], [n, 'That is the number of bottle tops, not their mass.', 'M_BENCHMARK_ADD_NOT_REPEAT'], [per * n * 10, 'Check the zeros.', 'M_BENCHMARK_ADD_NOT_REPEAT'], [per, 'That is the mass of one bottle top.', 'M_BENCHMARK_ADD_NOT_REPEAT']],
        hints: ['One bottle top is the benchmark.', 'Repeat it for every bottle top.'], steps: [`${n} × ${per} = ${per * n}.`, `About ${per * n} g.`], chk: (v) => v / n === per };
    } }),
  fam({ id: 'g5c.masc.est.heavier', cs: `${M}MASS.MASS_ESTIMATE_GRAMMES`, form: 'why', rung: 2,
    gen: () => {
      const options = mc('The small stone, because dense things can be heavy even when small', [['The big bag of cotton wool, because it is bigger', 'Bigger does not always mean heavier. Cotton wool is very light.', 'M_SIZE_EQUALS_MASS'], ['They have the same mass because they are both big enough to hold', 'You cannot tell the mass from the size alone. Check on a balance.', 'M_SIZE_EQUALS_MASS']]);
      return { question: `${person().name} thinks about a large bag of cotton wool and a small stone the size of a matchbox. Which is likely to be heavier?`, options, instruction: 'Choose the best answer.',
        hints: ['Is size the same as mass?', 'Check on a balance.'], steps: ['Cotton wool is light, a stone is dense.', 'The stone is likely heavier.'] };
    } }),
  fam({ id: 'g5c.masc.est.record', cs: `${M}MASS.MASS_ESTIMATE_GRAMMES`, form: 'direct', rung: 3,
    gen: () => {
      const est = pick([200, 250, 300]), meas = est - randInt(1, 3) * 10;
      const options = mc(`Estimate ${est} g, measured ${meas} g`, [[`Estimate ${meas} g, measured ${meas} g`, 'Keep your first estimate. It shows how close you were and helps you improve.', 'M_CHANGE_ESTIMATE'], [`Estimate ${meas} g only`, 'Record both the estimate and the measured mass.', 'M_CHANGE_ESTIMATE'], [`Measured ${est} g`, 'The measured mass is what the balance showed.', 'M_CHANGE_ESTIMATE']]);
      return { question: `${person().name} estimates a bar of soap at ${est} g and then measures it at ${meas} g. What should ${'they'} record?`, options, instruction: 'Choose the correct record.',
        hints: ['An estimate does not have to be exact.', 'Keep the estimate and the measurement.'], steps: [`The estimate was ${est} g.`, `The measured mass was ${meas} g.`] };
    } }),

  // ================================================================ TIME
  fam({ id: 'g5c.timc.sec.hand', cs: `${M}TIME.SECOND_IDENTIFY`, form: 'direct', rung: 1,
    gen: () => {
      const options = mc('The long thin hand that moves fastest', [['The short thick hand that shows hours', 'The short hand shows hours and moves slowly.', 'M_SECOND_MINUTE_HAND_SWAP'], ['The long thick hand that shows minutes', 'The long thick hand shows minutes. It moves more slowly than the thin hand.', 'M_SECOND_MINUTE_HAND_SWAP'], ['The numbers printed on the clock face', 'The numbers are marked on the face. They are not hands.', 'M_SECOND_MINUTE_HAND_SWAP']]);
      return { question: `${person().name} looks at a classroom clock. Which part of the clock shows seconds?`, options, instruction: 'Choose the correct part.',
        hints: ['One hand moves fastest.', 'It is long and thin and ticks once each second.'], steps: ['The second hand is thin and long.', 'It ticks once each second.'] };
    } }),
  fam({ id: 'g5c.timc.sec.which', cs: `${M}TIME.SECOND_IDENTIFY`, form: 'word', rung: 2,
    gen: () => {
      const h = randInt(1, 12), m = randInt(1, 11), s = randInt(1, 11);
      return { question: `On a clock the short hand is just past ${h}, the thick long hand points to ${m} and the thin long hand points to ${s}. How many seconds past the minute does the clock show? (Each numeral is 5 seconds.)`, answer: s * 5,
        wrong: [[s, 'The numeral is not the number of seconds. Count in fives from 12.', 'M_SECOND_MINUTE_HAND_SWAP'], [m * 5, 'That is the minute hand. The thin hand shows seconds.', 'M_SECOND_MINUTE_HAND_SWAP'], [h * 5, 'That is the hour hand. The thin hand shows seconds.', 'M_SECOND_MINUTE_HAND_SWAP'], [s * 5 + 5, 'Count in fives again.', 'M_SECOND_MINUTE_HAND_SWAP']],
        hints: ['The thin long hand shows seconds.', 'Count in fives from 12.'], steps: [`The thin hand points to ${s}.`, `${s} × 5 = ${s * 5} seconds.`], chk: (v) => v === s * 5 };
    } }),
  fam({ id: 'g5c.timc.sec.tf', cs: `${M}TIME.SECOND_IDENTIFY`, form: 'why', rung: 2,
    gen: () => {
      const options = mc('False. The second hand is the thin hand', [['True. The long hand is always the minute hand', 'There are two long hands. The thin one is the second hand.', 'M_SECOND_MINUTE_HAND_SWAP'], ['True. The short hand shows seconds', 'The short hand shows hours.', 'M_SECOND_MINUTE_HAND_SWAP']]);
      return { question: `${person().name} says that on a clock with three hands, the long hand that moves fastest is the minute hand. Is this true or false?`, options, instruction: 'Choose true or false.',
        hints: ['There can be two long hands.', 'The thin one moves fastest.'], steps: ['The thin long hand is the second hand.', 'So the statement is false.'] };
    } }),

  fam({ id: 'g5c.timc.dur.which', cs: `${M}TIME.SECOND_DURATION_SENSE`, form: 'direct', rung: 1,
    gen: () => {
      const T = [['writing your first name', 10], ['clapping your hands 10 times', 10], ['walking across the classroom', 10], ['blinking once', 1], ['cooking ugali for the family', 1800], ['a school assembly', 1800]];
      const a = pick(T.filter(t => t[1] === 10)), others = shuffle(T.filter(t => t[1] !== 10)).slice(0, 3);
      const options = mc(a[0], others.map(o => [o[0], o[1] === 1 ? 'That takes about 1 second, not 10.' : 'That takes many minutes, much more than 10 seconds.', 'M_SECOND_SIZE_MISJUDGED']));
      return { question: `${person().name} times short activities. Which of these takes about 10 seconds?`, options, instruction: 'Choose the best answer.',
        hints: ['Count aloud 1, 2, 3, ... slowly to 10.', 'Which can be done in that time?'], steps: [`${a[0]} takes about 10 seconds.`, 'The others take much less or much more time.'] };
    } }),
  fam({ id: 'g5c.timc.dur.measure', cs: `${M}TIME.SECOND_DURATION_SENSE`, form: 'word', rung: 2,
    gen: () => {
      const n = randInt(8, 15), t = randInt(2, 4) * 5, p = person();
      return { question: `${p.name} claps ${n} times in ${n} seconds. At the same steady pace, how many times will ${p.she} clap in ${n * 3} seconds?`, answer: n * 3,
        wrong: [[n, 'That is the number of claps in the first time. The time is three times as long.', 'M_SECOND_SIZE_MISJUDGED'], [n + 3, 'Three times as long means three times as many claps.', 'M_SECOND_SIZE_MISJUDGED'], [n * 2, 'The time is three times as long.', 'M_SECOND_SIZE_MISJUDGED'], [n * 4, 'Check the multiplication.', 'M_SECOND_SIZE_MISJUDGED']],
        hints: ['One clap each second.', 'The time is three times as long.'], steps: [`${n * 3} seconds, one clap each second.`, `${n * 3} claps.`], chk: (v) => v === n * 3 };
    } }),
  fam({ id: 'g5c.timc.dur.order', cs: `${M}TIME.SECOND_DURATION_SENSE`, form: 'why', rung: 3,
    gen: () => {
      const base = [['blinking', 1], ['writing your name', 10], ['reading a short page', 60]].map(x => x[0]);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(q => q.map(i => base[i]).join(', then '));
      const shown = shuffle(base), right = perms[0];
      const options = mc(right, shuffle(perms.slice(1)).slice(0, 3).map(w => [w, 'Think how long each really takes before you put them in order: about 1 second, 10 seconds, 1 minute.', 'M_SECOND_SIZE_MISJUDGED']));
      return { question: `Put these in order from the shortest time to the longest: ${shown.join(', ')}.`, options, instruction: 'Choose the correct order.',
        hints: ['Blinking is about 1 second, writing your name about 10 seconds, reading a page about a minute.', 'Shortest first.'], steps: ['About 1 s, about 10 s, about 60 s.', right + '.'] };
    } }),

  fam({ id: 'g5c.timc.read.analog', cs: `${M}TIME.READ_SECONDS_ANALOGUE`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(1, 11), p = person();
      return { question: `On an analogue clock the second hand points exactly at the ${n}. How many seconds does it show? Each numeral is 5 seconds.`, answer: n * 5,
        wrong: [[n, 'The numeral is not the number of seconds. Count in fives.', 'M_NUMERAL_AS_SECONDS'], [n * 10, 'Each numeral is 5 seconds, not 10.', 'M_NUMERAL_AS_SECONDS'], [n * 5 + 5, 'Count in fives again.', 'M_NUMERAL_AS_SECONDS'], [60 - n * 5 || 5, 'Count from 12 going clockwise.', 'M_NUMERAL_AS_SECONDS']],
        hints: ['Count in fives from the 12.', 'Each numeral on the clock face is five seconds.'], steps: [`${n} × 5 = ${n * 5}.`, `${n * 5} seconds.`], chk: (v) => v === n * 5 };
    } }),
  fam({ id: 'g5c.timc.read.marks', cs: `${M}TIME.READ_SECONDS_ANALOGUE`, form: 'direct', rung: 2,
    gen: () => {
      const n = randInt(2, 10), k = randInt(1, 4), right = n * 5 + k;
      const options = mc(`${right} seconds`, [[`${n + k} seconds`, 'You added the small marks to the numeral. Each numeral is 5 seconds, so start from the numeral times 5.', 'M_SMALL_MARKS_ADDED_TO_NUMERAL'], [`${n * 5} seconds`, 'The hand is past the numeral. Count the small marks too.', 'M_NUMERAL_AS_SECONDS'], [`${n} seconds`, 'The numeral is not the number of seconds.', 'M_NUMERAL_AS_SECONDS']]);
      return { question: `A stopwatch dial has its second hand ${k} small ${k === 1 ? 'mark' : 'marks'} beyond the ${n}. Give the seconds shown.`, options, instruction: 'Choose the number of seconds.',
        hints: [`The ${n} is ${n * 5} seconds.`, 'Add one second for each small mark.'], steps: [`${n} × 5 = ${n * 5}.`, `${n * 5} + ${k} = ${right} seconds.`] };
    } }),
  fam({ id: 'g5c.timc.read.spot', cs: `${M}TIME.READ_SECONDS_ANALOGUE`, form: 'spot', rung: 3,
    gen: () => {
      const n = randInt(2, 10), k = randInt(1, 4), p = person();
      return { question: `${p.name} reads the second hand, which is ${k} small marks past the ${n}. Which step has the mistake?`,
        working: [{ text: `Step 1: The hand is past the ${n}.`, ok: true }, { text: `Step 2: Add ${k} to ${n}, as the marks are worth 1 each. ${n} + ${k} = ${n + k}.`, ok: false }, { text: `Step 3: The clock shows ${n + k} seconds.`, ok: true }],
        fix: `The ${n} stands for ${n * 5} seconds. Add the ${k} marks to that: ${n * 5 + k} seconds.`, mis: 'M_SMALL_MARKS_ADDED_TO_NUMERAL', hints: ['What does the numeral on the second hand stand for?'], steps: [`${n * 5 + k} seconds.`] };
    } }),

  fam({ id: 'g5c.timc.dig.stopwatch', cs: `${M}TIME.READ_SECONDS_DIGITAL`, form: 'direct', rung: 1,
    gen: () => {
      const m = randInt(1, 9), s = randInt(10, 59), p = person(), disp = `0${m}:${s}`;
      const options = mc(`${m} minutes ${s} seconds`, [[`${m} hours ${s} minutes`, 'A stopwatch shows minutes and seconds, not hours and minutes.', 'M_STOPWATCH_AS_HOURS'], [`${s} minutes ${m} seconds`, 'The first part shows the minutes.', 'M_STOPWATCH_AS_HOURS'], [`${m} seconds`, 'The seconds digits are missing.', 'M_DIGITAL_SECONDS_IGNORED']]);
      return { question: `A stopwatch shows ${disp} after ${p.name} runs round the school field. How long did ${p.she} take?`, options, instruction: 'Choose the time taken.',
        hints: ['A stopwatch shows minutes then seconds.', 'The digits after the colon are seconds.'], steps: [`${disp} means ${m} minutes ${s} seconds.`, `${p.name} took ${m} minutes ${s} seconds.`] };
    } }),
  fam({ id: 'g5c.timc.dig.clock', cs: `${M}TIME.READ_SECONDS_DIGITAL`, form: 'word', rung: 2,
    gen: () => {
      const h = randInt(6, 11), m = randInt(10, 50), s = randInt(10, 59);
      return { question: `A digital clock shows 0${h}:${m}:${s}. How many seconds are shown past the minute? (The last two digits.)`, answer: s,
        wrong: [[m, 'The middle pair is minutes. Seconds are the last pair.', 'M_DIGITAL_SECONDS_IGNORED'], [h, 'The first pair is hours.', 'M_DIGITAL_SECONDS_IGNORED'], [s + m, 'Do not add the pairs. Read the last pair as seconds.', 'M_DIGITAL_SECONDS_IGNORED'], [0, 'The seconds are shown. Read the last two digits.', 'M_DIGITAL_SECONDS_IGNORED']],
        hints: ['A digital clock shows hours, minutes, seconds.', 'Seconds are the last two digits.'], steps: [`0${h}:${m}:${s} is ${h} hours ${m} minutes ${s} seconds.`, `${s} seconds.`], chk: (v) => v === s };
    } }),
  fam({ id: 'g5c.timc.dig.match', cs: `${M}TIME.READ_SECONDS_DIGITAL`, form: 'why', rung: 3,
    gen: () => {
      const m = randInt(1, 9), s = randInt(10, 59);
      const options = mc(`${m} minutes ${s} seconds`, [[`${m} hours ${s} minutes`, 'A stopwatch shows mm:ss, not hh:mm.', 'M_STOPWATCH_AS_HOURS'], [`${m} minutes`, 'The seconds are part of the reading too.', 'M_DIGITAL_SECONDS_IGNORED']]);
      return { question: `Wanjiru's stopwatch reads 0${m}:${s}. Which way of saying it is correct?`, options, instruction: 'Choose the correct reading.',
        hints: ['A stopwatch reading mm:ss.', 'Do not read the digits as hours.'], steps: ['The digits before the colon are minutes.', `So it reads ${m} minutes ${s} seconds.`] };
    } }),

  // ================================================================ AREA
  fam({ id: 'g5c.arec.unit.which', cs: `${M}AREA.CM2_UNIT_MEANING`, form: 'direct', rung: 1,
    gen: () => {
      const a = randInt(3, 9), b = randInt(2, 8), p = person();
      if (a === b) return null;
      const options = mc(`${a * b} cm²`, [[`${a * b} cm`, 'cm is a length. An area is measured in square centimetres, cm².', 'M_CM_FOR_AREA'], [`${a * b * 2} cm`, 'The small 2 in cm² is not "times 2". It means square centimetres.', 'M_SQUARED_MEANS_DOUBLE'], [`${a + b} cm²`, 'Multiply the length by the width to get the number of squares.', 'M_CM_FOR_AREA']]);
      return { question: `A rectangle is ${a} cm long and ${b} cm wide. ${p.name} works out how many 1 cm squares cover it. Which answer has the right unit?`, options, instruction: 'Choose the area with the correct unit.',
        hints: ['Area is measured in square centimetres.', `${a} × ${b} squares.`], steps: [`${a} × ${b} = ${a * b}.`, `${a * b} cm².`] };
    } }),
  fam({ id: 'g5c.arec.unit.side2', cs: `${M}AREA.CM2_UNIT_MEANING`, form: 'word', rung: 2,
    gen: () => {
      const s = randInt(3, 9);
      return { question: `A square tile has sides of ${s} cm. How many square centimetres is its area?`, answer: s * s,
        wrong: [[1, 'Only a square with sides of 1 cm has an area of 1 cm². This one is bigger.', 'M_ANY_SQUARE_IS_ONE_CM2'], [s * 2, 'The area is side × side, not side × 2.', 'M_SQUARED_MEANS_DOUBLE'], [s + s, 'Multiply the side by itself.', 'M_SQUARED_MEANS_DOUBLE'], [s * 4, 'That adds the four sides. Area uses multiplication of two sides.', 'M_CM_FOR_AREA']],
        hints: ['Count how many 1 cm squares fit in each row.', 'Multiply by the number of rows.'], steps: [`${s} squares in each of ${s} rows.`, `${s} × ${s} = ${s * s} cm².`], chk: (v) => v === s * s };
    } }),
  fam({ id: 'g5c.arec.unit.mean', cs: `${M}AREA.CM2_UNIT_MEANING`, form: 'why', rung: 3,
    gen: () => {
      const n = randInt(3, 9);
      const options = mc(`${n} squares, each 1 cm by 1 cm`, [[`${n * 2} cm in length, ${n} twice`, 'The small 2 does not mean times 2. cm² is for area, not length.', 'M_SQUARED_MEANS_DOUBLE'], [`A line that is ${n} cm long`, 'cm measures length. cm² measures the space covered.', 'M_CM_FOR_AREA'], [`${n} squares of any size you like`, 'Each square must be 1 cm by 1 cm.', 'M_ANY_SQUARE_IS_ONE_CM2']]);
      return { question: `${person().name} writes ${n} cm² in a book. What does ${n} cm² mean?`, options, instruction: 'Choose the meaning.',
        hints: ['cm² is square centimetres.', 'One cm² is a square 1 cm by 1 cm.'], steps: [`1 cm² is the space covered by a 1 cm by 1 cm square.`, `${n} cm² is ${n} such squares.`] };
    } }),

  fam({ id: 'g5c.arec.cover.count', cs: `${M}AREA.AREA_COVER_AND_COUNT`, form: 'word', rung: 1,
    gen: () => {
      const l = randInt(3, 7), w = randInt(2, 5), p = person();
      return { question: `A rectangle on 1 cm grid paper is ${l} squares long and ${w} squares wide. How many square centimetres is its area?`, answer: l * w,
        wrong: [[(l + 1) * (w + 1), 'You counted grid lines, not squares. Count the squares.', 'M_COUNT_LINES_NOT_SQUARES'], [2 * (l + w) - 4, 'That counts only the squares around the edge. Count the inside ones too.', 'M_COUNT_BORDER_ONLY'], [l + w, 'Multiply the squares in a row by the number of rows.', 'M_COUNT_BORDER_ONLY'], [l * w + l, 'Count each square once.', 'M_GAPS_OVERLAPS']],
        hints: ['Count the squares in one row.', 'How many rows?'], steps: [`${l} squares in each row, ${w} rows.`, `${l} × ${w} = ${l * w} cm².`], chk: (v) => v === l * w };
    } }),
  fam({ id: 'g5c.arec.cover.stamp', cs: `${M}AREA.AREA_COVER_AND_COUNT`, form: 'direct', rung: 2,
    gen: () => {
      const l = randInt(3, 6), w = randInt(2, 4);
      const options = mc(`${l * w} cm²`, [[`${l * w - 2} cm²`, 'There are gaps between your squares. Squares must touch without gaps.', 'M_GAPS_OVERLAPS'], [`${l * w + 2} cm²`, 'Squares that overlap are counted twice. Squares must not overlap.', 'M_GAPS_OVERLAPS'], [`${2 * (l + w)} cm²`, 'You counted only the border squares or the sides. Count all the squares.', 'M_COUNT_BORDER_ONLY']]);
      return { question: `${person().name} covers a postage stamp ${l} cm by ${w} cm with 1 cm squares, with no gaps or overlaps. What is the area of the stamp?`, options, instruction: 'Choose the area.',
        hints: ['Cover with no gaps and no overlaps.', 'Count the squares used.'], steps: [`${l} × ${w} squares.`, `${l * w} cm².`] };
    } }),
  fam({ id: 'g5c.arec.cover.spot', cs: `${M}AREA.AREA_COVER_AND_COUNT`, form: 'spot', rung: 3,
    gen: () => {
      const l = randInt(4, 7), w = randInt(3, 5), p = person();
      return { question: `${p.name} counts the squares in a ${l} by ${w} rectangle on 1 cm grid paper. Which step has the mistake?`,
        working: [{ text: `Step 1: The rectangle is ${l} squares long and ${w} squares wide.`, ok: true }, { text: `Step 2: Count only the squares along the edge: 2 × ${l} + 2 × ${w} − 4 = ${2 * l + 2 * w - 4}.`, ok: false }, { text: `Step 3: The area is ${2 * l + 2 * w - 4} cm².`, ok: true }],
        fix: `All the squares must be counted, inside and edge: ${l} × ${w} = ${l * w} cm².`, mis: 'M_COUNT_BORDER_ONLY', hints: ['Do the inside squares count?'], steps: [`${l * w} cm².`] };
    } }),

  fam({ id: 'g5c.arec.real.pick', cs: `${M}AREA.CM2_REAL_LIFE`, form: 'direct', rung: 1,
    gen: () => {
      const A = shuffle(['the top of a postage stamp', 'the cover of an exercise book', 'the screen of a phone']), B = shuffle(['the length of a pencil', 'the height of a door', 'the mass of a mango', 'the water in a cup']);
      const options = mc(A[0], B.slice(0, 3).map(b => [b, b.includes('mass') ? 'Mass is measured in grammes, not cm².' : b.includes('water') ? 'Water in a cup is capacity, measured in ml.' : 'A length is measured in cm or m, not cm².', 'M_CM2_FOR_LENGTH']));
      return { question: `${person().name} wants to measure something in square centimetres. Which would ${'they'} measure in cm²?`, options, instruction: 'Choose the one measured in cm².',
        hints: ['cm² measures flat surfaces.', 'Which is a flat surface?'], steps: [`${A[0]} is a flat surface.`, 'Flat surfaces are measured in cm².'] };
    } }),
  fam({ id: 'g5c.arec.real.unit', cs: `${M}AREA.CM2_REAL_LIFE`, form: 'why', rung: 2,
    gen: () => {
      const [d, u] = pick([['the area of a mobile phone screen', 'cm²'], ['the length of a pencil', 'cm'], ['the mass of a mango', 'g'], ['the cover of a textbook', 'cm²'], ['the height of a table', 'm']]);
      const units = ['cm²', 'cm', 'g', 'm'].filter(x => x !== u);
      const options = mc(u, shuffle(units).slice(0, 3).map(x => [x, x === 'cm²' ? 'cm² is for flat surfaces. This is not an area.' : x === 'g' ? 'g measures mass.' : 'This does not fit the thing measured.', 'M_CM2_FOR_LENGTH']));
      return { question: `Which unit is used for ${d}?`, options, instruction: 'Choose the unit.',
        hints: ['Is it a length, a flat surface or a mass?', 'cm² is for flat surfaces.'], steps: [`Think about what is being measured in: ${d}.`, `It uses ${u}.`] };
    } }),
  fam({ id: 'g5c.arec.real.list', cs: `${M}AREA.CM2_REAL_LIFE`, form: 'table', rung: 3,
    gen: () => {
      const rows = shuffle([['Postage stamp', 'area'], ['Pencil', 'length'], ['Mango', 'mass']]);
      const options = mc('Postage stamp', [['Pencil', 'A pencil is measured by its length, in cm.', 'M_CM2_FOR_LENGTH'], ['Mango', 'A mango is measured by its mass, in g.', 'M_CM2_FOR_LENGTH']]);
      return { question: 'The table shows what we measure for each thing. Which thing is measured in cm²?', model: tbl(['Thing', 'What we measure'], rows), options, instruction: 'Choose the thing.',
        hints: ['cm² is for area.', 'Which row says area?'], steps: ['Area is measured in cm².', 'The postage stamp row says area.'] };
    } }),

  fam({ id: 'g5c.arec.rows.array', cs: `${M}AREA.AREA_ROWS_BY_COLUMNS`, form: 'word', rung: 1,
    gen: () => {
      const r = randInt(3, 8), c = randInt(3, 9);
      return { question: `A tray of mandazi is drawn with ${r} rows and ${c} in each row, each taking 1 cm² on the drawing. What is the area covered, in cm²?`, answer: r * c,
        wrong: [[r + c, 'Multiply the rows by the number in each row. Adding does not count the squares.', 'M_ADD_ROWS_COLUMNS'], [r * 2 + c * 2, 'That is the distance round the edge, not the squares.', 'M_ADD_ROWS_COLUMNS'], [r * c + r, 'Count each square once.', 'M_ADD_ROWS_COLUMNS'], [c, 'That is the number in one row only.', 'M_PARTIAL_GRID_COUNT']],
        hints: ['Rows × squares in each row.', 'Each square is 1 cm².'], steps: [`${r} × ${c} = ${r * c}.`, `${r * c} cm².`], chk: (v) => v === r * c };
    } }),
  fam({ id: 'g5c.arec.rows.partial', cs: `${M}AREA.AREA_ROWS_BY_COLUMNS`, form: 'direct', rung: 2,
    gen: () => {
      const l = randInt(4, 8), w = randInt(3, 6);
      const options = mc(`${l * w} cm²`, [[`${l + w - 1} cm²`, 'You counted only the first row and column drawn. The rest of the grid is blank, but it still counts.', 'M_PARTIAL_GRID_COUNT'], [`${l + w} cm²`, 'Multiply the squares along the top by the squares down the side.', 'M_ADD_ROWS_COLUMNS'], [`${(l + w) * 2} cm²`, 'That is the length round the shape, not its area.', 'M_ADD_ROWS_COLUMNS']]);
      return { question: `A rectangle shows ${l} squares along the top and ${w} squares down the side. The rest is blank. What is its area?`, options, instruction: 'Choose the area.',
        hints: ['The blank part is filled with squares too.', 'Rows × columns.'], steps: [`${w} rows of ${l}.`, `${l * w} cm².`] };
    } }),
  fam({ id: 'g5c.arec.rows.why', cs: `${M}AREA.AREA_ROWS_BY_COLUMNS`, form: 'why', rung: 3,
    gen: () => {
      const r = randInt(3, 6), c = randInt(4, 8);
      const options = mc(`Multiply: ${r} rows of ${c} squares`, [[`Add the rows and the columns, ${r} + ${c}`, 'Adding counts the edge numbers, not the squares inside.', 'M_ADD_ROWS_COLUMNS'], [`Count only the squares drawn at the edge`, 'The inside squares matter too.', 'M_PARTIAL_GRID_COUNT']]);
      return { question: `${person().name} says the area of a rectangle with ${r} rows of ${c} squares is ${r} × ${c}. Why does multiplying work?`, options, instruction: 'Choose the reason.',
        hints: ['Count the squares in one row.', 'Each row has the same number.'], steps: [`${r} rows each with ${c} squares.`, `${r} × ${c} = ${r * c} cm².`] };
    } }),

  fam({ id: 'g5c.arec.calc.word', cs: `${M}AREA.AREA_RECT_SQUARE_CALC`, form: 'word', rung: 1,
    gen: () => {
      const l = randInt(6, 15), w = randInt(3, 9);
      if (l === w) return null;
      return { question: `A rectangular label is ${l} cm long and ${w} cm wide. What is its area in cm²?`, answer: l * w,
        wrong: [[2 * (l + w), 'That is the distance round the edge. The area is length × width.', 'M_AREA_AS_PERIMETER'], [l + w, 'Multiply the length by the width.', 'M_AREA_AS_PERIMETER'], [l * w * 2, 'Check the multiplication.', 'M_MULTIPLY_ALL_SIDES'], [l * l * w * w, 'Multiply the length by the width only once.', 'M_MULTIPLY_ALL_SIDES']],
        hints: ['Area of a rectangle: length × width.', 'Write the unit cm².'], steps: [`${l} × ${w} = ${l * w}.`, `${l * w} cm².`], chk: (v) => v / w === l };
    } }),
  fam({ id: 'g5c.arec.calc.square', cs: `${M}AREA.AREA_RECT_SQUARE_CALC`, form: 'direct', rung: 2,
    gen: () => {
      const s = randInt(4, 12);
      const options = mc(`${s * s} cm²`, [[`${s * 2} cm²`, 'For a square, multiply the side by itself, not by 2.', 'M_SQUARE_SIDE_DOUBLED'], [`${s * 4} cm²`, 'That is the distance round the edge.', 'M_AREA_AS_PERIMETER'], [`${s * s * s * s} cm²`, 'Multiply the sides only twice.', 'M_MULTIPLY_ALL_SIDES']]);
      return { question: `A square tile has sides of ${s} cm. Which is its area?`, options, instruction: 'Choose the area.',
        hints: ['Area of a square: side × side.', 'The unit is cm².'], steps: [`${s} × ${s} = ${s * s}.`, `${s * s} cm².`] };
    } }),
  fam({ id: 'g5c.arec.calc.labelled', cs: `${M}AREA.AREA_RECT_SQUARE_CALC`, form: 'table', rung: 2,
    gen: () => {
      const l = randInt(5, 12), w = randInt(3, 8);
      if (l === w) return null;
      return { question: 'The table gives the four labelled sides of a rectangle. Find its area in cm².', model: tbl(['Side', 'Length'], [['Top', `${l} cm`], ['Right', `${w} cm`], ['Bottom', `${l} cm`], ['Left', `${w} cm`]]), answer: l * w,
        wrong: [[l * w * l * w, 'Multiply only two different sides, the length and the width.', 'M_MULTIPLY_ALL_SIDES'], [2 * (l + w), 'That adds all four sides. Area uses length × width.', 'M_AREA_AS_PERIMETER'], [l + w, 'Multiply the length and the width.', 'M_AREA_AS_PERIMETER'], [l * w + l, 'Check the multiplication.', 'M_MULTIPLY_ALL_SIDES']],
        hints: ['Opposite sides are equal.', 'Length × width.'], steps: [`${l} × ${w} = ${l * w}.`, `${l * w} cm².`], chk: (v) => v / l === w };
    } }),

  fam({ id: 'g5c.arec.prob.cloth', cs: `${M}AREA.AREA_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const l = randInt(12, 30), w = randInt(8, 20), p = person();
      if (l === w) return null;
      return { question: `${p.name} wants to cover the top of a box that is ${l} cm long and ${w} cm wide with kitenge cloth. How many square centimetres of cloth are needed?`, answer: l * w,
        wrong: [[2 * (l + w), 'That is the distance round the top. We want the area, the space to cover.', 'M_CONTEXT_WRONG_MEASURE'], [l + w, 'Multiply the length and width.', 'M_CONTEXT_WRONG_MEASURE'], [l * w * 2, 'Check the multiplication.', 'M_CONTEXT_WRONG_MEASURE'], [Math.round(l * w / 2), 'Use the whole top, length × width.', 'M_CONTEXT_WRONG_MEASURE']],
        hints: ['Covering a surface needs area.', 'Length × width.'], steps: [`${l} × ${w} = ${l * w}.`, `${l * w} cm² of cloth.`], chk: (v) => v / w === l };
    } }),
  fam({ id: 'g5c.arec.prob.side', cs: `${M}AREA.AREA_PROBLEMS`, form: 'direct', rung: 3,
    gen: () => {
      const l = randInt(6, 12), w = randInt(3, 8), a = l * w;
      if (l === w) return null;
      const options = mc(`${w} cm`, [[`${a - l} cm`, 'Do not subtract. Divide the area by the known side.', 'M_MISSING_SIDE_SUBTRACT'], [`${a - l} cm²`, 'The missing side is a length in cm, not an area.', 'M_MISSING_SIDE_SUBTRACT'], [`${a + l} cm`, 'Divide the area by the side to find the other side.', 'M_MISSING_SIDE_SUBTRACT']]);
      return { question: `Otieno's exercise book cover has an area of ${a} cm² and a length of ${l} cm. What is its width?`, options, instruction: 'Choose the width.',
        hints: ['Area = length × width, so width = area ÷ length.', 'The answer is a length in cm.'], steps: [`${a} ÷ ${l} = ${w}.`, `${w} cm.`] };
    } }),
  fam({ id: 'g5c.arec.prob.choose', cs: `${M}AREA.AREA_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const l = randInt(10, 25), w = randInt(6, 15), area = Math.random() < 0.5;
      const options = mc(area ? `Area: ${l} × ${w} = ${l * w} cm²` : `Perimeter: ${2 * (l + w)} cm`, [[area ? `Perimeter: ${2 * (l + w)} cm` : `Area: ${l} × ${w} = ${l * w} cm²`, area ? 'Covering a surface needs area, not the distance round the edge.' : 'A fence goes round the edge, so it needs the perimeter.', 'M_CONTEXT_WRONG_MEASURE'], [`Add the length and width: ${l + w} cm`, 'Neither area nor perimeter is just length + width.', 'M_CONTEXT_WRONG_MEASURE']]);
      return { question: area ? `A tile is ${l} cm long and ${w} cm wide. ${person().name} wants to know how much of the floor it covers. Which measure is needed?` : `A small garden bed is ${l} cm long and ${w} cm wide. ${person().name} wants to put a border round its edge. Which measure is needed?`, options, instruction: 'Choose the measure and its value.',
        hints: [area ? 'Covering is area.' : 'Going round is perimeter.', 'Choose the right calculation.'], steps: [area ? 'Covering a flat surface needs the area.' : 'A border goes round the edge, so it needs the perimeter.', area ? `Area = ${l} × ${w} = ${l * w} cm².` : `Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} cm.`] };
    } }),

  // ================================================================ VOLUME
  fam({ id: 'g5c.volc.cm3.cubes', cs: `${M}VOLUME.CM3_UNIT_IDENTIFY`, form: 'direct', rung: 1,
    gen: () => {
      const n = randInt(6, 40), p = person();
      const options = mc(`${n} cm³`, [[`${n} cm²`, 'cm² is for area. Volume uses cubic centimetres, cm³.', 'M_CM3_WRONG_UNIT'], [`${n} cm`, 'cm is a length unit.', 'M_CM3_WRONG_UNIT'], [`${n * 3} cm³`, 'Each cube is 1 cm³. Count the cubes.', 'M_CM3_MEANS_3CM']]);
      return { question: `${p.name} builds a box shape using ${n} cubes, each with edges of 1 cm. What is its volume?`, options, instruction: 'Choose the volume with the right unit.',
        hints: ['Each 1 cm cube is 1 cm³.', 'Count the cubes.'], steps: [`${n} cubes of 1 cm³ each.`, `${n} cm³.`] };
    } }),
  fam({ id: 'g5c.volc.cm3.edge', cs: `${M}VOLUME.CM3_UNIT_IDENTIFY`, form: 'why', rung: 2,
    gen: () => {
      const options = mc('1 cm', [['3 cm', 'The small 3 in cm³ does not mean 3 cm. It means cubic centimetres.', 'M_CM3_MEANS_3CM'], ['1 cm³', 'Edges are lengths, measured in cm, not cm³.', 'M_CM3_WRONG_UNIT'], ['3 cm³', 'Edges are lengths, measured in cm.', 'M_CM3_MEANS_3CM']]);
      return { question: `A factory makes sugar cubes, each of volume 1 cm³. ${person().name} wants the length of one edge. What is it?`, options, instruction: 'Choose the edge length.',
        hints: ['1 cm³ is the volume of a cube with edges 1 cm.', 'Edges are lengths.'], steps: ['Edges are lengths, measured in cm.', 'A 1 cm³ cube has edges of 1 cm.'] };
    } }),
  fam({ id: 'g5c.volc.cm3.mass', cs: `${M}VOLUME.CM3_UNIT_IDENTIFY`, form: 'word', rung: 3,
    gen: () => {
      const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 5), n = a * b * c;
      return { question: `A wooden cube and an iron cube both have edges of 1 cm. ${person().name} puts ${n} of the wooden cubes in a box. How many cm³ is the volume of the wooden cubes? An iron cube would be heavier but take up the same space.`, answer: n,
        wrong: [[n * 8, 'Each cube is 1 cm³ whatever it is made of. Do not multiply by the mass.', 'M_VOLUME_IS_MASS'], [n * 3, 'Each cube is 1 cm³. Count the cubes.', 'M_CM3_MEANS_3CM'], [Math.round(n / 2), 'Count all the cubes.', 'M_VOLUME_IS_MASS'], [n + 1, 'Count the cubes again.', 'M_VOLUME_IS_MASS']],
        hints: ['Each cube has a volume of 1 cm³.', 'Count the cubes.'], steps: [`${n} cubes × 1 cm³.`, `${n} cm³.`], chk: (v) => v === n };
    } }),

  fam({ id: 'g5c.volc.count.layers', cs: `${M}VOLUME.VOLUME_COUNT_CM3_CUBES`, form: 'word', rung: 1,
    gen: () => {
      const l = randInt(2, 5), w = randInt(2, 4), h = randInt(2, 4);
      return { question: `${person().name} piles 1 cm cubes in ${h} layers, each layer ${l} by ${w}. How many cm³ is the pile?`, answer: l * w * h,
        wrong: [[l * w, 'That is only one layer. Count all the layers.', 'M_COUNT_ONE_LAYER'], [2 * (l * w + l * h + w * h), 'That counts the squares on the faces. Count the cubes.', 'M_COUNT_FACE_SQUARES'], [l + w + h, 'Multiply, do not add.', 'M_COUNT_ONE_LAYER'], [l * w * h + l * w, 'Count each cube once.', 'M_COUNT_FACE_SQUARES']],
        hints: ['How many cubes in one layer?', 'Multiply by the number of layers.'], steps: [`One layer: ${l} × ${w} = ${l * w}.`, `${l * w} × ${h} = ${l * w * h} cm³.`], chk: (v) => v / h === l * w };
    } }),
  fam({ id: 'g5c.volc.count.picture', cs: `${M}VOLUME.VOLUME_COUNT_CM3_CUBES`, form: 'direct', rung: 2,
    gen: () => {
      const l = randInt(2, 4), w = randInt(2, 3), h = randInt(2, 3), v = l * w * h, faces = l * w + l * h + w * h;
      if (faces === v) return null;
      const options = mc(`${v} cm³`, [[`${faces} cm³`, 'You counted the squares on the faces you can see. Cubes inside and behind count too.', 'M_COUNT_FACE_SQUARES'], [`${l * w} cm³`, 'That is one layer. Count all the layers.', 'M_COUNT_ONE_LAYER'], [`${l + w + h} cm³`, 'Add would not count all the cubes. Multiply the three numbers.', 'M_COUNT_ONE_LAYER']]);
      return { question: `A diagram of a cuboid built from 1 cm cubes shows it ${l} cubes long, ${w} wide and ${h} high. Which is its volume?`, options, instruction: 'Choose the volume.',
        hints: ['Count the cubes in one layer, then all the layers.', 'Hidden cubes count.'], steps: [`${l} × ${w} × ${h} = ${v}.`, `${v} cm³.`] };
    } }),
  fam({ id: 'g5c.volc.count.same', cs: `${M}VOLUME.VOLUME_COUNT_CM3_CUBES`, form: 'why', rung: 3,
    gen: () => {
      const n = pick([12, 16, 24]), p = person();
      const options = mc(`They are equal: both are ${n} cm³`, [['The taller one, because it is taller', 'The same cubes take up the same space however they are arranged.', 'M_NO_CONSERVATION_VOLUME'], ['The longer one, because it is longer', 'Same cubes, same volume.', 'M_NO_CONSERVATION_VOLUME']]);
      return { question: `${p.name} makes a cuboid from ${n} cubes lying flat. Then ${p.she} rebuilds the same ${n} cubes into a taller tower. Which has the larger volume?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Are any cubes added or taken away?', 'Volume counts the cubes.'], steps: [`The same ${n} cubes are used.`, `The volume stays ${n} cm³.`] };
    } }),

  fam({ id: 'g5c.volc.derive.table', cs: `${M}VOLUME.CUBOID_FORMULA_DERIVE`, form: 'table', rung: 2,
    gen: () => {
      const l = randInt(2, 5), w = randInt(2, 4), h = randInt(2, 4);
      return { question: 'A learner builds a cuboid from 1 cm cubes. The table shows the cubes along the length, along the width, and the number of layers. How many cubes are used in all?', model: tbl(['Along the length', 'Along the width', 'Layers'], [[String(l), String(w), String(h)]]), answer: l * w * h,
        wrong: [[l * w + h, 'Add the layers? No: each layer has the same number of cubes. Multiply.', 'M_ADD_LAYERS'], [l + w + h, 'Multiply the three numbers.', 'M_ADD_LAYERS'], [l * w, 'That is one layer.', 'M_ADD_LAYERS'], [l * w * h + l * w, 'Check the multiplication.', 'M_ADD_LAYERS']],
        hints: ['Cubes in one layer: length × width.', 'Multiply by the number of layers.'], steps: [`${l} × ${w} = ${l * w} cubes in a layer.`, `${l * w} × ${h} = ${l * w * h}.`], chk: (v) => v / h === l * w };
    } }),
  fam({ id: 'g5c.volc.derive.why', cs: `${M}VOLUME.CUBOID_FORMULA_DERIVE`, form: 'why', rung: 2,
    gen: () => {
      const r = randInt(3, 5), c = randInt(2, 4), n = randInt(3, 6);
      const options = mc(`${r} × ${c} for a layer, then × ${n}`, [[`${r * c} + ${n} layers added on to it`, 'The layers are all the same, so multiply the cubes in a layer by the number of layers.', 'M_ADD_LAYERS'], [`${r} + ${c} + ${n} all added together`, 'Adding does not count the cubes. Multiply the three numbers.', 'M_ADD_LAYERS'], [`${r * c} only, the cubes in one layer`, 'That is one layer. Count all the layers.', 'M_ADD_LAYERS']]);
      return { question: `One layer of a cuboid has ${c} rows of ${r} cubes. There are ${n} layers. How should we find the number of cubes?`, options, instruction: 'Choose the correct way.',
        hints: ['First find the cubes in one layer.', 'Then think of all the layers.'], steps: [`${r} × ${c} = ${r * c} in one layer.`, `${r * c} × ${n} = ${r * c * n}.`] };
    } }),
  fam({ id: 'g5c.volc.derive.rotate', cs: `${M}VOLUME.CUBOID_FORMULA_DERIVE`, form: 'direct', rung: 3,
    gen: () => {
      const l = randInt(4, 6), w = randInt(2, 3), h = randInt(1, 2), v = l * w * h;
      const options = mc(`${v} cm³, the same`, [[`More than ${v} cm³, because it is taller now`, 'Standing the box on its end does not change how much space it takes up.', 'M_ROTATION_CHANGES_VOLUME'], [`Less than ${v} cm³, because it is narrower`, 'The volume stays the same however the box stands.', 'M_ROTATION_CHANGES_VOLUME'], [`${l + w + h} cm³`, 'Multiply l × w × h, which does not change when the box turns.', 'M_ADD_LAYERS']]);
      return { question: `A matchbox-shaped cuboid is ${l} cm long, ${w} cm wide and ${h} cm high when lying flat. ${person().name} stands it on its end. What is its volume now?`, options, instruction: 'Choose the volume.',
        hints: ['Multiply the same three numbers in a different order.', 'Does the order change the answer?'], steps: [`${l} × ${w} × ${h} = ${v}.`, `Standing it up gives the same volume: ${v} cm³.`] };
    } }),

  fam({ id: 'g5c.volc.calc.word', cs: `${M}VOLUME.CUBOID_VOLUME_CALC`, form: 'word', rung: 1,
    gen: () => {
      const l = randInt(4, 12), w = randInt(3, 8), h = randInt(2, 6);
      return { question: `Dimensions of a cuboid: length ${l} cm, width ${w} cm, height ${h} cm. Work out the space it takes up, in cm³.`, answer: l * w * h,
        wrong: [[l + w + h, 'Multiply the three numbers.', 'M_ADD_DIMENSIONS'], [l * w, 'That is the area of the base. Multiply by the height too.', 'M_TWO_DIMENSIONS_ONLY'], [2 * (l * w + w * h + l * h), 'That is the surface area. Volume is length × width × height.', 'M_ADD_DIMENSIONS'], [l * w * h + l, 'Check the multiplication.', 'M_TWO_DIMENSIONS_ONLY']],
        hints: ['Volume = length × width × height.', 'Write the unit cm³.'], steps: [`${l} × ${w} = ${l * w}.`, `${l * w} × ${h} = ${l * w * h} cm³.`], chk: (v) => v / h === l * w };
    } }),
  fam({ id: 'g5c.volc.calc.table', cs: `${M}VOLUME.CUBOID_VOLUME_CALC`, form: 'table', rung: 2,
    gen: () => {
      const l = randInt(5, 12), w = randInt(3, 8), h = randInt(2, 5);
      return { question: 'The table gives the sizes of a block of soap. What is its volume in cm³?', model: tbl(['Length', 'Width', 'Height'], [[`${l} cm`, `${w} cm`, `${h} cm`]]), answer: l * w * h,
        wrong: [[l + w + h, 'Multiply the three numbers.', 'M_ADD_DIMENSIONS'], [l * w, 'Use the height too.', 'M_TWO_DIMENSIONS_ONLY'], [w * h, 'Use the length too.', 'M_TWO_DIMENSIONS_ONLY'], [l * w * h - l, 'Check the multiplication.', 'M_TWO_DIMENSIONS_ONLY']],
        hints: ['Multiply the three sizes.', 'The unit is cm³.'], steps: [`${l} × ${w} × ${h} = ${l * w * h}.`, `${l * w * h} cm³.`], chk: (v) => v / h === l * w };
    } }),
  fam({ id: 'g5c.volc.calc.spot', cs: `${M}VOLUME.CUBOID_VOLUME_CALC`, form: 'spot', rung: 3,
    gen: () => {
      const l = randInt(5, 9), w = randInt(3, 6), h = randInt(2, 5), p = person();
      return { question: `${p.name} works out the volume of a cuboid ${l} cm long, ${w} cm wide and ${h} cm high. Which step has the mistake?`,
        working: [{ text: `Step 1: Volume uses length, width and height.`, ok: true }, { text: `Step 2: Add them: ${l} + ${w} + ${h} = ${l + w + h}.`, ok: false }, { text: `Step 3: The volume is ${l + w + h} cm³.`, ok: true }],
        fix: `Multiply the three: ${l} × ${w} × ${h} = ${l * w * h} cm³.`, mis: 'M_ADD_DIMENSIONS', hints: ['Do we add or multiply for volume?'], steps: [`${l * w * h} cm³.`] };
    } }),

  fam({ id: 'g5c.volc.prob.metre', cs: `${M}VOLUME.CUBOID_VOLUME_PROBLEMS`, form: 'word', rung: 3,
    gen: () => {
      const w = pick([10, 20]), h = pick([5, 10]), p = person();
      return { question: `The inside of a wooden crate is 1 m long, ${w} cm wide and ${h} cm high. Find the space inside it in cm³. (Remember 1 m = 100 cm.)`, answer: 100 * w * h,
        wrong: [[w * h, 'The length is in metres. Change 1 m to 100 cm before multiplying.', 'M_MIXED_UNITS'], [10 * w * h, '1 m is 100 cm, not 10 cm.', 'M_MIXED_UNITS'], [100 + w + h, 'Multiply, do not add.', 'M_MIXED_UNITS'], [1000 * w * h, '1 m is 100 cm.', 'M_MIXED_UNITS']],
        hints: ['Change metres to centimetres first.', 'Then multiply the three lengths.'], steps: [`1 m = 100 cm.`, `100 × ${w} × ${h} = ${100 * w * h} cm³.`], chk: (v) => v === 100 * w * h };
    } }),
  fam({ id: 'g5c.volc.prob.extra', cs: `${M}VOLUME.CUBOID_VOLUME_PROBLEMS`, form: 'direct', rung: 2,
    gen: () => {
      const l = randInt(8, 12), w = randInt(4, 7), h = randInt(3, 6), price = pick([50, 80, 100]);
      const options = mc(`${l * w * h} cm³`, [[`${l * w * h * price} cm³`, `${price} shillings is the price, not a length. Do not multiply by it.`, 'M_MULTIPLY_ALL_NUMBERS'], [`${l + w + h} cm³`, 'Multiply the three lengths.', 'M_MULTIPLY_ALL_NUMBERS'], [`${l * w} cm³`, 'Use the height too.', 'M_MULTIPLY_ALL_NUMBERS']]);
      return { question: `A box of chalk costs sh ${price}. It is ${l} cm long, ${w} cm wide and ${h} cm high. What is its volume?`, options, instruction: 'Choose the volume.',
        hints: ['Which numbers are lengths?', 'The price is not needed.'], steps: [`${l} × ${w} × ${h} = ${l * w * h}.`, `${l * w * h} cm³.`] };
    } }),
  fam({ id: 'g5c.volc.prob.fill', cs: `${M}VOLUME.CUBOID_VOLUME_PROBLEMS`, form: 'steps', rung: 3,
    gen: () => {
      const l = randInt(8, 15), w = randInt(4, 8), h = randInt(3, 6), p = person();
      return { question: `${p.name} has a box ${l} cm long, ${w} cm wide and ${h} cm high, and wants to fill it with 1 cm cubes.`,
        parts: [{ prompt: 'How many cubes are in one layer on the bottom?', answer: l * w, hint: 'Length × width.', wrong: [[l + w, 'Multiply, do not add.', 'M_ADD_DIMENSIONS'], [l * w * h, 'That is all the layers. One layer is length × width.', 'M_TWO_DIMENSIONS_ONLY'], [2 * (l + w), 'That is the distance round the edge.', 'M_ADD_DIMENSIONS']] },
          { prompt: 'How many cubes fill the whole box?', answer: l * w * h, hint: 'One layer × the number of layers.', wrong: [[l * w, 'That is one layer. Count all the layers.', 'M_TWO_DIMENSIONS_ONLY'], [l + w + h, 'Multiply the three.', 'M_ADD_DIMENSIONS'], [l * w + h, 'Multiply the layer by the height.', 'M_ADD_DIMENSIONS']] }],
        steps: [`${l} × ${w} = ${l * w}.`, `${l * w} × ${h} = ${l * w * h}.`], chk: (x, v) => v[0] === l * w && v[1] === l * w * h };
    } }),

  fam({ id: 'g5c.volc.cubederive.build', cs: `${M}VOLUME.CUBE_FORMULA_DERIVE`, form: 'word', rung: 1,
    gen: () => {
      const s = randInt(2, 7);
      return { question: `A cube is built from 1 cm cubes with ${s} cubes along each edge. How many cubes are used?`, answer: s ** 3,
        wrong: [[s, 'That is the number along one edge. Count all the cubes in the layers.', 'M_EDGE_EQUALS_VOLUME'], [s * 3, 'Multiply the edge by itself three times.', 'M_EDGE_EQUALS_VOLUME'], [s * s, 'That is one layer. There are more layers.', 'M_EDGE_EQUALS_VOLUME'], [s ** 3 + s, 'Check the multiplication.', 'M_EDGE_EQUALS_VOLUME']],
        hints: ['One layer is s × s.', 'There are s layers.'], steps: [`${s} × ${s} = ${s * s} in a layer.`, `${s * s} × ${s} = ${s ** 3}.`], chk: (v) => v === s ** 3 };
    } }),
  fam({ id: 'g5c.volc.cubederive.tf', cs: `${M}VOLUME.CUBE_FORMULA_DERIVE`, form: 'why', rung: 2,
    gen: () => {
      const s = randInt(2, 5);
      const options = mc(`False. A cube with edges of ${s} cm has a volume of ${s ** 3} cm³`, [[`True. The volume is the same number as the edge`, 'The volume of a cube is edge × edge × edge, not the edge alone.', 'M_EDGE_EQUALS_VOLUME'], [`True. ${s} cm³ is correct because of the unit`, 'cm³ is the right unit, but the number is edge × edge × edge.', 'M_EDGE_EQUALS_VOLUME']]);
      return { question: `True or false: a cube with edges of ${s} cm has a volume of ${s} cm³.`, options, instruction: 'Choose true or false.',
        hints: ['A cube has three equal sizes: length, width and height.', 'Multiply the three.'], steps: [`${s} × ${s} × ${s} = ${s ** 3}.`, 'The statement is false.'] };
    } }),
  fam({ id: 'g5c.volc.cubederive.which', cs: `${M}VOLUME.CUBE_FORMULA_DERIVE`, form: 'direct', rung: 3,
    gen: () => {
      const s = randInt(2, 6);
      const options = mc(`${s} cm by ${s} cm by ${s} cm`, [[`${s} cm by ${s} cm by ${s + 1} cm`, 'A cube needs three equal edges. One edge is different here.', 'M_EDGE_EQUALS_VOLUME'], [`${s} cm by ${s + 1} cm by ${s + 2} cm`, 'A cube has three equal edges.', 'M_EDGE_EQUALS_VOLUME'], [`${s} cm by ${s * 2} cm by ${s} cm`, 'A cube has three equal edges.', 'M_EDGE_EQUALS_VOLUME']]);
      return { question: `${person().name} wants a cube with edges of ${s} cm. Which of these cuboids is a cube?`, options, instruction: 'Choose the cube.',
        hints: ['A cube has length = width = height.', 'Check each cuboid.'], steps: [`All three sizes are ${s} cm.`, `Volume = ${s} × ${s} × ${s} = ${s ** 3} cm³.`] };
    } }),

  fam({ id: 'g5c.volc.cube.calc', cs: `${M}VOLUME.CUBE_VOLUME_CALC`, form: 'word', rung: 1,
    gen: () => {
      const s = randInt(3, 9);
      return { question: `A cube-shaped box has edges of ${s} cm. What is its volume in cm³?`, answer: s ** 3,
        wrong: [[s * 3, 'Multiply the edge by itself three times, not by 3.', 'M_CUBE_S_TIMES_3'], [s * s, 'That is one face. Multiply by the edge again.', 'M_CUBE_S_SQUARED'], [s + s + s, 'Multiply, do not add.', 'M_CUBE_S_TIMES_3'], [s ** 3 + s, 'Check the multiplication.', 'M_CUBE_S_SQUARED']],
        hints: ['Volume of a cube = s × s × s.', 'The unit is cm³.'], steps: [`${s} × ${s} = ${s * s}.`, `${s * s} × ${s} = ${s ** 3} cm³.`], chk: (v) => v === s ** 3 };
    } }),
  fam({ id: 'g5c.volc.cube.dice', cs: `${M}VOLUME.CUBE_VOLUME_CALC`, form: 'direct', rung: 2,
    gen: () => {
      const s = randInt(2, 10);
      const options = mc(`${s ** 3} cm³`, [[`${s * 3} cm³`, 'A cube has volume s × s × s, not s × 3.', 'M_CUBE_S_TIMES_3'], [`${s * s} cm³`, 'That is the area of one face.', 'M_CUBE_S_SQUARED'], [`${s * 6} cm³`, 'Multiply the edge by itself twice more.', 'M_CUBE_S_TIMES_3']]);
      return { question: `A sugar cube has edges of ${s} mm and a toy block has edges of ${s} cm. Which is the volume of the toy block?`, options, instruction: 'Choose the volume.',
        hints: ['Use the toy block: edges in cm.', 's × s × s.'], steps: [`${s} × ${s} × ${s} = ${s ** 3}.`, `${s ** 3} cm³.`] };
    } }),
  fam({ id: 'g5c.volc.cube.table', cs: `${M}VOLUME.CUBE_VOLUME_CALC`, form: 'table', rung: 3,
    gen: () => {
      const a = randInt(2, 6), b = a + randInt(1, 3);
      return { question: 'The table shows the edges of two cube-shaped boxes. How much more volume does the bigger box have, in cm³?', model: tbl(['Box', 'Edge'], [['Small box', `${a} cm`], ['Big box', `${b} cm`]]), answer: b ** 3 - a ** 3,
        wrong: [[b - a, 'That is the difference of the edges. Work out each volume first.', 'M_CUBE_S_TIMES_3'], [b * b - a * a, 'That compares the faces. Volume is s × s × s.', 'M_CUBE_S_SQUARED'], [b ** 3 + a ** 3, 'Take away to find how much more.', 'M_CUBE_S_TIMES_3'], [3 * b - 3 * a, 'Volume is edge × edge × edge.', 'M_CUBE_S_TIMES_3']],
        hints: ['Find the volume of each box.', 'Subtract the smaller volume.'], steps: [`${b} × ${b} × ${b} = ${b ** 3} and ${a} × ${a} × ${a} = ${a ** 3}.`, `${b ** 3} − ${a ** 3} = ${b ** 3 - a ** 3}.`], chk: (v) => v + a ** 3 === b ** 3 };
    } }),
];
