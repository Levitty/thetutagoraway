// ============================================================================
// STEP-MARKED QUESTIONS (KJSEA Section B style, Grades 7-9)
//
// About 80% of the Grade 9 KJSEA marks are short structured questions where
// the working earns marks. HOREB used to mark only the final answer, so one
// slip at the end scored nothing and the child never learned which steps were
// right. These split a multi-step problem into parts, one mark each:
//   • each part is typed; a wrong part gets one more try with feedback;
//   • after that the right value is shown so the child carries on with it
//     (no cascading failure — the next part is still a fair test);
//   • marks = parts right first time, shown as "3 of 4".
// Kenyan contexts (hire purchase, VAT at 16%, matatu journeys, harambee,
// water tanks) are invented for HOREB; no exam item is copied.
// ============================================================================

import { randInt, pick } from './schema.js';

const c = (n) => Number(Number(n).toPrecision(12)).toLocaleString('en-US', { maximumFractionDigits: 2 });
const an = (n) => (/^(8|11|18)$/.test(String(n)) || /^8\d$/.test(String(n)) ? 'an' : 'a');
const s = (n) => String(Number(Number(n).toPrecision(12)));
const part = (prompt, answer, o = {}) => ({ prompt, answer: s(answer), accepts: [s(answer), c(answer), ...(o.accepts || [])], unit: o.unit || '', hint: o.hint || '', mistakes: (o.mistakes || []).filter(m => Number(m.when) > 0 && Number.isFinite(Number(m.when)) && Number(m.when) !== Number(answer)).map(m => ({ when: s(m.when), feedback: m.feedback })) });
const mk = (kind, question, parts, steps) => ({
  type: `steps-${kind}`,
  instruction: 'Answer each part. Each part earns a mark.',
  question,
  parts,
  answer: parts[parts.length - 1].answer,
  accepts: parts[parts.length - 1].accepts,
  marks: parts.length,
  solutionSteps: steps,
  solution: { steps: steps.map(t => ({ text: t })), answer: parts[parts.length - 1].answer },
  hint: parts[0].hint,
});

const B = {
  hirePurchase: () => {
    const cash = pick([18000, 24000, 30000, 36000, 45000]), dep = cash * pick([0.2, 0.25]), n = pick([6, 8, 10, 12]);
    const inst = Math.round(((cash - dep) * pick([1.15, 1.2, 1.25])) / n / 50) * 50, hp = dep + n * inst;
    const thing = pick(['A television', 'A fridge', 'A motorbike helmet set', 'A sewing machine', 'A solar panel']);
    return mk('hire-purchase', `${thing} costs sh ${c(cash)} cash. On hire purchase you pay a deposit of sh ${c(dep)} and ${n} monthly instalments of sh ${c(inst)}.`, [
      part(`How much are the ${n} instalments altogether? (sh)`, n * inst, { hint: `${n} × ${c(inst)}`, mistakes: [{ when: n + inst, feedback: `${n} instalments of sh ${c(inst)} each: multiply.` }] }),
      part('What is the total hire purchase price? (sh)', hp, { hint: 'Add the deposit.', mistakes: [{ when: n * inst, feedback: 'The deposit is paid too. Add it on.' }] }),
      part('How much more than the cash price is that? (sh)', hp - cash, { hint: `Hire purchase price − ${c(cash)}`, mistakes: [{ when: hp + cash, feedback: '"How much more" is the difference: subtract.' }] }),
    ], [`Instalments: ${n} × ${c(inst)} = sh ${c(n * inst)}.`, `Hire purchase price: ${c(dep)} + ${c(n * inst)} = sh ${c(hp)}.`, `Extra paid: ${c(hp)} − ${c(cash)} = sh ${c(hp - cash)}.`]);
  },
  simpleInterest: () => {
    const P = pick([20000, 25000, 40000, 50000, 60000, 80000]), R = pick([6, 8, 10, 12, 15]), T = randInt(2, 4), I1 = (P * R) / 100;
    return mk('simple-interest', `Wanjiru saves sh ${c(P)} in a SACCO at ${R}% simple interest a year for ${T} years.`, [
      part('How much interest does she earn in one year? (sh)', I1, { hint: `${R}% of ${c(P)}`, mistakes: [{ when: P * R, feedback: 'Per cent means out of 100: divide by 100.' }] }),
      part(`How much interest in ${T} years? (sh)`, I1 * T, { hint: `${T} years of the same interest.`, mistakes: [{ when: I1 + T, feedback: `Each year earns sh ${c(I1)}. There are ${T} years: multiply.` }] }),
      part(`How much does she have after ${T} years? (sh)`, P + I1 * T, { hint: 'Savings plus interest.', mistakes: [{ when: I1 * T, feedback: 'That is the interest only. Add her savings.' }] }),
    ], [`1 year: ${R}% of ${c(P)} = sh ${c(I1)}.`, `${T} years: ${c(I1)} × ${T} = sh ${c(I1 * T)}.`, `Total: ${c(P)} + ${c(I1 * T)} = sh ${c(P + I1 * T)}.`]);
  },
  compoundInterest: () => {
    const P = pick([10000, 20000, 50000, 100000]), R = pick([5, 10, 20]), A1 = P * (1 + R / 100), A2 = A1 * (1 + R / 100);
    return mk('compound-interest', `Kamau puts sh ${c(P)} in a bank that pays ${R}% compound interest each year.`, [
      part('How much is in the account after 1 year? (sh)', A1, { hint: `${c(P)} + ${R}% of ${c(P)}`, mistakes: [{ when: (P * R) / 100, feedback: 'That is the interest. Add it to the money in the account.' }] }),
      part('How much after 2 years? (sh)', A2, { hint: `Interest in year 2 is ${R}% of the NEW amount.`, mistakes: [{ when: P + (2 * P * R) / 100, feedback: `Compound interest: year 2's interest is ${R}% of sh ${c(A1)}, not of sh ${c(P)}.` }] }),
      part('How much interest was earned over the 2 years? (sh)', A2 - P, { hint: 'Final amount − starting amount.', mistakes: [{ when: A2, feedback: 'That is the whole amount. Take away the sh ' + c(P) + ' put in.' }] }),
    ], [`Year 1: ${c(P)} × ${1 + R / 100} = sh ${c(A1)}.`, `Year 2: ${c(A1)} × ${1 + R / 100} = sh ${c(A2)}.`, `Interest: ${c(A2)} − ${c(P)} = sh ${c(A2 - P)}.`]);
  },
  vat: () => {
    const price = pick([2500, 4000, 6000, 12500, 15000, 25000]), vat = (price * 16) / 100;
    const thing = pick(['a phone', 'a gas cylinder', 'a bicycle', 'a mattress']);
    return mk('vat', `The price of ${thing} before VAT is sh ${c(price)}. VAT in Kenya is 16%.`, [
      part('How much is the VAT? (sh)', vat, { hint: `16% of ${c(price)}`, mistakes: [{ when: price * 16, feedback: 'Per cent means out of 100: divide by 100.' }, { when: price / 16, feedback: '16% means 16 out of every 100, not dividing by 16.' }] }),
      part('What is the price with VAT? (sh)', price + vat, { hint: 'Add the VAT to the price.', mistakes: [{ when: price - vat, feedback: 'VAT is added to the price, not taken off.' }] }),
    ], [`VAT: 16% of ${c(price)} = sh ${c(vat)}.`, `Price with VAT: ${c(price)} + ${c(vat)} = sh ${c(price + vat)}.`]);
  },
  profit: () => {
    const n = pick([20, 24, 30, 40, 50]), cost = pick([30, 40, 45, 60]), sell = cost + pick([10, 15, 20, 30]);
    const C = n * cost, S = n * sell, pct = ((S - C) / C) * 100;
    if (!Number.isInteger(pct * 10)) return B.profit();
    return mk('profit', `A trader buys ${n} kg of tomatoes at sh ${cost} a kg. She sells them all at sh ${sell} a kg.`, [
      part('How much did she pay for them? (sh)', C, { hint: `${n} × ${cost}` }),
      part('How much did she get for them? (sh)', S, { hint: `${n} × ${sell}` }),
      part('What is her profit? (sh)', S - C, { hint: 'Money in − money out.', mistakes: [{ when: S + C, feedback: 'Profit is what is gained: selling price minus cost.' }] }),
      part('What is her profit as a percentage of the cost? (%)', pct, { hint: `profit ÷ ${c(C)} × 100`, mistakes: [{ when: Math.round(((S - C) / S) * 1000) / 10, feedback: 'Profit per cent is worked out on the COST, not the selling price.' }] }),
    ], [`Cost: ${n} × ${cost} = sh ${c(C)}.`, `Sales: ${n} × ${sell} = sh ${c(S)}.`, `Profit: ${c(S)} − ${c(C)} = sh ${c(S - C)}.`, `Profit %: ${c(S - C)} ÷ ${c(C)} × 100 = ${s(pct)}%.`]);
  },
  journey: () => {
    const [from, to, km] = pick([['Nairobi', 'Nakuru', 160], ['Nairobi', 'Thika', 45], ['Mombasa', 'Malindi', 120], ['Kisumu', 'Kakamega', 50], ['Eldoret', 'Kitale', 70], ['Nairobi', 'Machakos', 60]]);
    const mins = pick([30, 45, 60, 75, 90, 120, 150, 180]); const t = mins / 60, v = km / t;
    if (!Number.isInteger(v * 10)) return B.journey();
    const dh = randInt(6, 10), dm = pick([0, 15, 30, 45]), end = dh * 60 + dm + mins;
    const hm = (x) => `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
    return mk('journey', `A matatu leaves ${from} at ${hm(dh * 60 + dm)} and reaches ${to}, ${km} km away, at ${hm(end)}.`, [
      part('How many minutes does the journey take?', mins, { hint: 'Count from the start time to the end time.', mistakes: [{ when: end - (dh * 60 + dm) === mins ? Math.floor(end / 60) * 100 + (end % 60) - (dh * 100 + dm) : -1, feedback: 'Times are not ordinary numbers: an hour has 60 minutes, not 100.' }] }),
      part('How many hours is that?', t, { hint: `${mins} ÷ 60`, accepts: [s(t)], mistakes: [{ when: Math.floor(mins / 60) + (mins % 60) / 100, feedback: `${mins % 60} minutes is ${mins % 60}/60 of an hour, not 0.${mins % 60}.` }] }),
      part('What is its average speed? (km/h)', v, { hint: `${km} ÷ ${s(t)}`, mistakes: [{ when: km * t, feedback: 'Speed is distance ÷ time.' }, { when: km / mins, feedback: 'Speed in km/h uses the time in HOURS.' }] }),
    ], [`Time: ${mins} minutes.`, `${mins} ÷ 60 = ${s(t)} hours.`, `Speed: ${km} ÷ ${s(t)} = ${s(v)} km/h.`]);
  },
  lShape: () => {
    const W = randInt(8, 16), H = randInt(8, 14), w = randInt(3, W - 3), h = randInt(3, H - 3);
    return mk('area-composite', `A plot of land is ${an(W)} ${W} m by ${H} m rectangle with ${an(w)} ${w} m by ${h} m corner cut out for a road.`, [
      part('What is the area of the full rectangle? (m²)', W * H, { hint: `${W} × ${H}`, mistakes: [{ when: 2 * (W + H), feedback: 'That is the perimeter. Area is length × width.' }] }),
      part('What is the area of the corner cut out? (m²)', w * h, { hint: `${w} × ${h}` }),
      part('What is the area of the plot that is left? (m²)', W * H - w * h, { hint: 'Big rectangle − cut out part.', mistakes: [{ when: W * H + w * h, feedback: 'The corner was cut OUT: subtract it.' }] }),
    ], [`Full rectangle: ${W} × ${H} = ${W * H} m².`, `Cut out: ${w} × ${h} = ${w * h} m².`, `Left: ${W * H} − ${w * h} = ${W * H - w * h} m².`]);
  },
  ladder: () => {
    const [a, b, h] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
    return mk('pythagoras', `A ladder leans against a wall. Its foot is ${a} m from the wall and its top is ${b} m up the wall.`, [
      part(`What is ${a}² + ${b}²?`, a * a + b * b, { hint: `${a * a} + ${b * b}`, mistakes: [{ when: 2 * a + 2 * b, feedback: `${a}² means ${a} × ${a}, not ${a} × 2.` }] }),
      part('How long is the ladder? (m)', h, { hint: `√${a * a + b * b}`, mistakes: [{ when: (a * a + b * b) / 2, feedback: 'Undo squaring with a square root, not by halving.' }, { when: a + b, feedback: 'The ladder is not the two distances added. Use Pythagoras.' }] }),
      part('The ladder slides so its foot is 2 m further from the wall. How far is the foot from the wall now? (m)', a + 2, { hint: `${a} + 2` }),
    ], [`${a}² + ${b}² = ${a * a} + ${b * b} = ${h * h}.`, `Ladder = √${h * h} = ${h} m.`, `New distance: ${a} + 2 = ${a + 2} m.`]);
  },
  meanMissing: () => {
    const n = randInt(4, 6), mean = randInt(50, 80), xs = Array.from({ length: n - 1 }, () => randInt(mean - 15, mean + 15));
    const need = mean * n, sofar = xs.reduce((p, q) => p + q, 0), last = need - sofar;
    if (last < 20 || last > 100) return B.meanMissing();
    return mk('mean-missing', `Achieng's marks in ${n - 1} tests were ${xs.join(', ')}. She wants a mean of ${mean} after ${n} tests.`, [
      part(`What total do ${n} tests need for a mean of ${mean}?`, need, { hint: `${n} × ${mean}`, mistakes: [{ when: mean + n, feedback: 'Mean × number of tests gives the total.' }] }),
      part(`What is the total of her ${n - 1} marks so far?`, sofar, { hint: 'Add them up.' }),
      part(`What mark does she need in test ${n}?`, last, { hint: 'Total needed − total so far.', mistakes: [{ when: mean, feedback: 'She needs more (or less) than the mean to balance the others. Use the totals.' }] }),
    ], [`Total needed: ${n} × ${mean} = ${need}.`, `So far: ${xs.join(' + ')} = ${sofar}.`, `Needed: ${need} − ${sofar} = ${last}.`]);
  },
  tank: () => {
    const L = pick([100, 120, 150, 200]), W = pick([50, 60, 80, 100]), H = pick([100, 120, 150]), vol = L * W * H, litres = vol / 1000, use = pick([40, 50, 60, 75, 80, 100, 120]);
    const days = litres / use;
    if (!Number.isInteger(days)) return B.tank();
    return mk('tank', `A school water tank is a cuboid ${L} cm long, ${W} cm wide and ${H} cm high. The school uses ${use} litres a day.`, [
      part('What is its volume in cm³?', vol, { hint: `${L} × ${W} × ${H}`, mistakes: [{ when: L + W + H, feedback: 'Volume multiplies the three lengths.' }] }),
      part('How many litres does it hold? (1 litre = 1,000 cm³)', litres, { hint: `${c(vol)} ÷ 1,000`, mistakes: [{ when: vol * 1000, feedback: 'Litres are bigger than cm³, so there are FEWER of them: divide.' }] }),
      part('A full tank lasts how many days?', days, { hint: `${s(litres)} ÷ ${use}`, mistakes: [{ when: litres * use, feedback: 'Share the water into days: divide.' }] }),
    ], [`Volume: ${L} × ${W} × ${H} = ${c(vol)} cm³.`, `Litres: ${c(vol)} ÷ 1,000 = ${c(litres)}.`, `Days: ${c(litres)} ÷ ${use} = ${days}.`]);
  },
  ratioShare: () => {
    const a = randInt(2, 4), b = randInt(a + 1, 7), u = randInt(3, 20) * 100, N = u * (a + b);
    return mk('ratio', `A harambee raises sh ${c(N)}. It is shared between a school and a clinic in the ratio ${a}:${b}.`, [
      part('How many equal parts are there?', a + b, { hint: `${a} + ${b}` }),
      part('How much is one part? (sh)', u, { hint: `${c(N)} ÷ ${a + b}` }),
      part('How much does the clinic get? (sh)', u * b, { hint: `${b} parts`, mistakes: [{ when: u * a, feedback: `The clinic's share is ${b} parts, not ${a}.` }] }),
    ], [`Parts: ${a} + ${b} = ${a + b}.`, `One part: ${c(N)} ÷ ${a + b} = sh ${c(u)}.`, `Clinic: ${b} × ${c(u)} = sh ${c(u * b)}.`]);
  },
  percentChange: () => {
    const old = pick([200, 250, 400, 500, 800, 1200]), p = pick([10, 20, 25, 30]), up = Math.random() < 0.5;
    const ch = (old * p) / 100, nw = up ? old + ch : old - ch;
    const thing = pick(['A bus fare', 'The price of a bag of maize flour', 'A school trip fee']);
    return mk('percent-change', `${thing} was sh ${c(old)}. It ${up ? 'goes up' : 'comes down'} by ${p}%.`, [
      part(`How much is ${p}% of sh ${c(old)}? (sh)`, ch, { hint: `${c(old)} ÷ 100 × ${p}`, mistakes: [{ when: old * p, feedback: 'Divide by 100 as well.' }] }),
      part('What is the new price? (sh)', nw, { hint: up ? 'Add it on.' : 'Take it off.', mistakes: [{ when: up ? old - ch : old + ch, feedback: up ? 'The price goes UP: add.' : 'The price comes DOWN: subtract.' }] }),
    ], [`${p}% of ${c(old)} = sh ${c(ch)}.`, `New price: ${c(old)} ${up ? '+' : '−'} ${c(ch)} = sh ${c(nw)}.`]);
  },
};

const MAP = {
  G7_MONEY: ['vat', 'percentChange'], G8_PROFIT_LOSS: ['profit'], G8_SIMPLE_INTEREST: ['simpleInterest'],
  G9_COMPOUND_INTEREST: ['compoundInterest'], G9_COMMERCIAL_ARITH: ['hirePurchase', 'vat'],
  G7_SPEED: ['journey'], G9_SPEED_VELOCITY: ['journey'], G8_AREA_COMPOSITE: ['lShape'],
  G7_PYTHAGORAS: ['ladder'], G7_MEAN_MEDIAN_MODE: ['meanMissing'], G7_VOLUME_CUBOID: ['tank'],
  G8_RATIO_PROPORTION: ['ratioShare'], G8_PERCENTAGE_CHANGE: ['percentChange'], G7_PERCENTAGES: ['percentChange'],
};

export const hasStepsItem = (skillId) => !!MAP[skillId];
export const stepsItemFor = (skillId) => (MAP[skillId] ? B[pick(MAP[skillId])]() : null);
export const STEPS_BUILDERS = B;
