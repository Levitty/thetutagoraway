// ============================================================================
// GRADE 4 MATHEMATICS, MEASUREMENT: TIME and MONEY (the skills that had fewer than two question forms).
// Written from the KICD 2024 design through the curriculum map. Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, sh, mc } from './g4c_lib.js';

const T = 'MEASUR.TIME.', Y = 'MEASUR.MONEY.';
const pad = (m) => String(m).padStart(2, '0');
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const HM = (h, m) => (h && m ? `${plural(h, 'hour')} ${plural(m, 'minute')}` : h ? plural(h, 'hour') : plural(m, 'minute'));
const EVENTS = [['get up for school', 6, 'a.m.'], ['start school assembly', 8, 'a.m.'], ['eat lunch', 1, 'p.m.'], ['go home after games', 4, 'p.m.'], ['eat supper', 7, 'p.m.'], ['go to bed', 9, 'p.m.']];

export const FAMILIES = [
  // ------------------------------------------------------------ TELL_TIME_AM_PM
  fam({ id: 'g4c.time.tell.hands', cs: `${T}TELL_TIME_AM_PM`, form: 'direct', rung: 1,
    gen: () => {
      const h = randInt(1, 10), m = pick([1, 2, 3, 4, 7, 8, 9, 10, 11]), mm = m * 5, pe = person();
      const right = `${h}:${pad(mm)}`, swapped = `${m}:${pad(h * 5)}`, mirror = `${h}:${pad(60 - mm)}`, next = `${h + 1}:${pad(mm)}`;
      const options = mc(right, [[swapped, 'The short hand shows the hour and the long hand shows the minutes. You swapped them.', 'M_TIME_HANDS_SWAPPED'], [mirror, 'Check which side of the clock the long hand is on: past the hour is the right side.', 'M_TIME_PAST_TO_SWAP'], [next, 'The short hand is just past ' + h + ', so the hour is still ' + h + '.', 'M_TIME_HANDS_SWAPPED']]);
      if (!options) return null;
      return { question: `${pe.name} looks at a clock. The short hand is just past the ${h} and the long hand points to the ${m}. Which digital time is shown?`, options, instruction: 'Choose the time.',
        hints: ['The short hand tells the hour. The long hand tells the minutes.', 'Each number on the clock face is 5 minutes.'], steps: [`The short hand is just past ${h}, so the hour is ${h}.`, `The long hand at ${m} is ${mm} minutes past: ${right}.`] };
    } }),
  fam({ id: 'g4c.time.tell.ampm', cs: `${T}TELL_TIME_AM_PM`, form: 'word', rung: 2,
    gen: () => {
      const e = pick(EVENTS), h = e[1], per = e[2], other = per === 'a.m.' ? 'p.m.' : 'a.m.', pe = person(), min = pick([0, 15, 30, 45]);
      const right = `${h}:${pad(min)} ${per}`;
      const options = mc(right, [[`${h}:${pad(min)} ${other}`, 'Think about the part of the day. a.m. is morning, before noon. p.m. is after noon.', 'M_TIME_AMPM_WRONG'], [`${h === 12 ? 1 : h + 1}:${pad(min)} ${per}`, 'The hour is one too late. Check the hour.', 'M_TIME_PAST_TO_SWAP'], [`${h === 1 ? 12 : h - 1}:${pad(min)} ${per}`, 'The hour is one too early. Check the hour.', 'M_TIME_PAST_TO_SWAP']]);
      return { question: `In the class diary ${pe.name} has to write down the time to ${e[0]}. The teacher says it is ${h}${min ? `:${pad(min)}` : " o'clock"} ${per === 'a.m.' ? 'in the morning, before the sun is overhead' : 'after midday, when the sun has started to go down'}. Which way of writing the time in the diary is correct?`, options, instruction: 'Choose the time with a.m. or p.m.',
        hints: ['a.m. is from midnight to noon. p.m. is from noon to midnight.', 'Look at the part of the day in the sentence.'], steps: [`${per === 'a.m.' ? 'Morning' : 'Afternoon or evening'} times use ${per}.`, `The time is ${right}.`] };
    } }),

  // ------------------------------------------------------------ ESTIMATE_TIME
  fam({ id: 'g4c.time.est.event', cs: `${T}ESTIMATE_TIME`, form: 'direct', rung: 1,
    gen: () => {
      const e = pick(EVENTS), other = e[2] === 'a.m.' ? 'p.m.' : 'a.m.';
      const mins = (h, ap) => ((h % 12) + (ap === 'p.m.' ? 12 : 0)) * 60, right = `${e[1]}:00 ${e[2]}`, tr = mins(e[1], e[2]);
      const flip = (x) => `${x[1]}:00 ${x[2] === 'a.m.' ? 'p.m.' : 'a.m.'}`;
      // A wrong time must be clearly wrong: at least four hours from the right one (8 p.m. is a fair bedtime, 7 a.m. a fair time to get up).
      const far = EVENTS.filter(x => x !== e).filter(x => { const t = mins(x[1], x[2] === 'a.m.' ? 'p.m.' : 'a.m.'), dd = Math.abs(t - tr); return Math.min(dd, 1440 - dd) >= 240; });
      const picked = shuffle(far).slice(0, 2);
      if (picked.length < 2) return null;
      const options = mc(right, [[`${e[1]}:00 ${other}`, 'Think about the sun: is it morning or afternoon for this?', 'M_TIME_AMPM_WRONG'], ...picked.map(x => [flip(x), 'That is the wrong time of day for this.', 'M_TIME_AMPM_WRONG'])].filter(w => w[0] !== right));
      if (!options) return null;
      return { question: `${person().name} wants to ${e[0]}. Which time is the most sensible for this?`, options, instruction: 'Choose the most sensible time.',
        hints: ['Think about when this usually happens in the day.', 'Morning is a.m. and afternoon or evening is p.m.'], steps: [`This usually happens in the ${e[2] === 'a.m.' ? 'morning' : 'afternoon or evening'}.`, `${right} is sensible.`] };
    } }),
  fam({ id: 'g4c.time.est.shadow', cs: `${T}ESTIMATE_TIME`, form: 'word', rung: 2,
    gen: () => {
      const sets = [['9:00 a.m.', '12:00 noon', '4:00 p.m.'], ['8:00 a.m.', '12:00 noon', '5:00 p.m.'], ['10:00 a.m.', '12:00 noon', '3:00 p.m.'], ['7:00 a.m.', '12:00 noon', '5:00 p.m.']], s = pick(sets), obj = pick(['tree', 'flagpole', 'school building', 'goal post', 'water tank']), pe = person();
      const options = mc('12:00 noon', [[s[0], 'The sun is lower in the morning, so shadows are long.', 'M_TIME_SHADOW_DIRECTION'], [s[2], 'The sun is lower in the late afternoon, so shadows are long.', 'M_TIME_SHADOW_DIRECTION'], ['The shadow stays the same length all day.', 'The sun moves across the sky, so the shadow changes.', 'M_TIME_SHADOW_DIRECTION']]);
      return { question: `${pe.name} measures the shadow of a ${obj} at ${s[0]}, ${s[1]} and ${s[2]}. At which time is the shadow shortest?`.replace('..', '.'), options, instruction: 'Choose the time.',
        hints: ['The shadow is shortest when the sun is highest in the sky.', 'When is the sun highest?'], steps: ['The sun is highest at noon.', 'So the shadow is shortest at 12:00 noon.'] };
    } }),

  // ------------------------------------------------------------ CONVERT_HOURS_MINUTES
  fam({ id: 'g4c.time.conv.to-min', cs: `${T}CONVERT_HOURS_MINUTES`, form: 'word', rung: 1,
    gen: () => {
      const k = randInt(2, 9), pe = person(), th = pick(['journey by bus', 'school trip', 'journey to Mombasa', 'journey to Kisumu']);
      return { question: `The ${th} that ${pe.name} goes to takes ${k} hours. How many minutes is that?`, answer: 60 * k,
        wrong: [[100 * k, 'There are 60 minutes in one hour, not 100.', 'M_TIME_100_MINUTES'], [10 * k, 'There are 60 minutes in one hour, not 10.', 'M_TIME_100_MINUTES'], [k + 60, 'Each hour has 60 minutes: multiply.', 'M_TIME_DIVIDES_TO_MULTIPLY'], [30 * k, 'That is half hours. Each full hour is 60 minutes.', 'M_TIME_100_MINUTES']],
        hints: ['One hour is 60 minutes.', 'Multiply the hours by 60.'], steps: [`1 hour = 60 minutes.`, `${k} x 60 = ${60 * k} minutes.`], chk: (x) => x === 60 * k };
    } }),
  fam({ id: 'g4c.time.conv.to-hm', cs: `${T}CONVERT_HOURS_MINUTES`, form: 'direct', rung: 2,
    gen: () => {
      const h = randInt(1, 5), m = pick([10, 15, 20, 25, 30, 40, 45, 50]), Tm = h * 60 + m, pe = person();
      const options = mc(HM(h, m), [[HM(h - 1, m + 60), 'Take out as many whole hours as you can. 60 minutes make one hour.', 'M_TIME_REMAINDER_AS_DECIMAL'], [HM(Math.floor(Tm / 100), Tm % 100), 'There are 60 minutes in an hour, not 100.', 'M_TIME_100_MINUTES'], [HM(m, h), 'The hours come first, then the minutes.', 'M_TIME_100_MINUTES']].filter(w => !/^0/.test(w[0])));
      if (!options) return null;
      return { question: `The clock shows that a bus journey took ${Tm} minutes. Write ${Tm} minutes as hours and minutes.`, options, instruction: 'Choose the correct time.',
        hints: ['Divide the minutes by 60 to find the whole hours.', 'The minutes left over stay as minutes.'], steps: [`${Tm} divided by 60 is ${h} with ${m} left over.`, `${Tm} minutes is ${HM(h, m)}.`] };
    } }),

  // ------------------------------------------------------------ CONVERT_DAYS_WEEKS
  fam({ id: 'g4c.time.conv.days-hours', cs: `${T}CONVERT_DAYS_WEEKS`, form: 'word', rung: 1,
    gen: () => {
      const k = randInt(2, 9), pe = person(), th = pick(['holiday', 'seed to sprout', 'visit to the coast', 'stay with a grandmother']);
      return { question: `A ${th} for ${pe.name} lasts ${k} days. How many hours is that?`, answer: 24 * k,
        wrong: [[12 * k, 'There are 24 hours in a day, not 12.', 'M_TIME_10_HOURS_DAY'], [10 * k, 'There are 24 hours in a day, not 10.', 'M_TIME_10_HOURS_DAY'], [k + 24, 'Each day has 24 hours: multiply.', 'M_TIME_10_HOURS_DAY'], [20 * k, 'There are 24 hours in a day, not 20.', 'M_TIME_10_HOURS_DAY']],
        hints: ['One day is 24 hours.', 'Multiply the days by 24.'], steps: ['1 day = 24 hours.', `${k} x 24 = ${24 * k} hours.`], chk: (x) => x === 24 * k };
    } }),
  fam({ id: 'g4c.time.conv.weeks', cs: `${T}CONVERT_DAYS_WEEKS`, form: 'direct', rung: 2,
    gen: () => {
      const w = randInt(2, 6), d = randInt(1, 6), N = 7 * w + d;
      const options = mc(`${plural(w, 'week')} ${plural(d, 'day')}`, [[plural(w, 'week'), 'The days left over must be written too.', 'M_TIME_DAYS_TO_WEEKS_REMAINDER'], [`${plural(Math.floor(N / 5), 'week')} ${plural(N % 5, 'day')}`.replace(/ 0 days/, ' 0 days'), 'A week has 7 days, not 5.', 'M_TIME_WEEK_NOT_7'], [`${plural(Math.floor(N / 10), 'week')} ${plural(N % 10, 'day')}`, 'A week has 7 days, not 10.', 'M_TIME_WEEK_NOT_7']]);
      if (!options) return null;
      return { question: `${person().name} has ${N} days until a school trip. How many weeks and days is that?`, options, instruction: 'Choose the correct time.',
        hints: ['Divide the days by 7 to find the whole weeks.', 'The days left over stay as days.'], steps: [`${N} divided by 7 is ${w} with ${d} left over.`, `${N} days is ${plural(w, 'week')} ${plural(d, 'day')}.`] };
    } }),

  // ------------------------------------------------------------ RECORD_DURATION
  fam({ id: 'g4c.time.dur.lesson', cs: `${T}RECORD_DURATION`, form: 'word', rung: 1,
    gen: () => {
      const sh1 = randInt(8, 10), sm = pick([0, 15, 30]), dh = randInt(1, 2), dm = pick([15, 30, 45]), eh = sh1 + dh + Math.floor((sm + dm) / 60), em = (sm + dm) % 60, pe = person();
      const endH = eh > 12 ? eh - 12 : eh, endAp = eh >= 12 ? 'p.m.' : 'a.m.';
      const dd = eh - sh1 - (em < sm ? 1 : 0), mm = (em - sm + 60) % 60;
      const options = mc(HM(dd, mm), [[`${endH}:${pad(em)} ${endAp}`, 'That is when it ends. The question asks how long it lasts.', 'M_TIME_DURATION_END_TIME'], [`${dd}.${pad(mm)} hours`, 'Hours and minutes are not a decimal. Write the hours and the minutes.', 'M_TIME_DURATION_WRONG_UNITS'], [HM(dd + 1, mm), 'Count the hours again from the start time to the finish time.', 'M_TIME_DURATION_WRONG_UNITS']]);
      if (!options || mm === 0) return null;
      return { question: `A lesson starts at ${sh1}:${pad(sm)} a.m. and ends at ${endH}:${pad(em)} ${endAp} How long does the lesson last?`, options, instruction: 'Choose the duration.',
        hints: ['Duration is how long, not when it ends.', 'Count the hours and then the minutes from the start to the end.'], steps: [`From ${sh1}:${pad(sm)} to ${endH}:${pad(em)}.`, `The lesson lasts ${HM(dd, mm)}.`] };
    } }),
  fam({ id: 'g4c.time.dur.to-min', cs: `${T}RECORD_DURATION`, form: 'word', rung: 2,
    gen: () => {
      const h = randInt(1, 4), m = pick([10, 15, 20, 30, 40, 45]), pe = person(), th = pick(['film', 'journey by matatu', 'church service', 'visit to the clinic']);
      return { question: `A ${th} lasts ${HM(h, m)}. For how many minutes does it last?`, answer: h * 60 + m,
        wrong: [[h * 100 + m, 'An hour has 60 minutes, not 100.', 'M_TIME_DURATION_WRONG_UNITS'], [h + m, 'Change the hours to minutes first, then add the minutes.', 'M_TIME_DURATION_WRONG_UNITS'], [h * 60, 'The extra minutes are missing.', 'M_TIME_DURATION_WRONG_UNITS'], [h * 10 + m, 'An hour has 60 minutes, not 10.', 'M_TIME_DURATION_WRONG_UNITS']],
        hints: ['Change the hours to minutes.', 'Then add the minutes.'], steps: [`${h} hours = ${h * 60} minutes.`, `${h * 60} + ${m} = ${h * 60 + m} minutes.`], chk: (x) => x - m === h * 60 };
    } }),

  // ------------------------------------------------------------ WORK_OUT_DURATION
  fam({ id: 'g4c.time.work.between', cs: `${T}WORK_OUT_DURATION`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(6, 10), m1 = pick([35, 40, 45, 50, 55]), b = a + randInt(1, 3), m2 = pick([5, 10, 15, 20]), dh = b - a - 1, dm = 60 + m2 - m1;
      const options = mc(HM(dh, dm), [[HM(b - a, m1 - m2), 'You took the smaller number of minutes from the larger. Count up to the next hour first.', 'M_TIME_SUBTRACT_AS_DECIMAL'], [HM(dh, 100 + m2 - m1), 'An hour has 60 minutes, not 100.', 'M_TIME_SUBTRACT_AS_DECIMAL'], [HM(b - a, m2), 'Count the minutes from the start time to the next hour as well.', 'M_TIME_SUBTRACT_AS_DECIMAL']]);
      if (!options || dm === 60) return null;
      return { question: `${person().name} starts a journey at ${a}:${pad(m1)} a.m. and arrives at ${b}:${pad(m2)} a.m. How long is the journey?`, options, instruction: 'Choose the duration.',
        hints: ['Count up to the next hour first, then on to the finish time.', 'Add the minutes and the hours.'], steps: [`${a}:${pad(m1)} to ${a + 1}:00 is ${60 - m1} minutes. Then ${a + 1}:00 to ${b}:${pad(m2)} is ${HM(b - a - 1, m2)}.`, `In all: ${HM(dh, dm)}.`] };
    } }),
  fam({ id: 'g4c.time.work.finish', cs: `${T}WORK_OUT_DURATION`, form: 'word', rung: 3,
    gen: () => {
      const m = randInt(20, 55), dur = randInt(40, 90), tot = m + dur, H = 11 + Math.floor(tot / 60), M = tot % 60, hh = H === 12 ? 12 : H - 12;
      if (M === 0) return null;
      const right = `${hh}:${pad(M)} p.m.`;
      const options = mc(right, [[`${hh}:${pad(M)} a.m.`, 'The time has passed noon. Times after noon are p.m.', 'M_TIME_NOON_AMPM'], [`11:${m + dur} a.m.`, 'There are only 60 minutes in an hour. Carry into the next hour.', 'M_TIME_ADD_MINUTES_OVER_60'], [`${hh + 1}:${pad(M)} p.m.`, 'Count the minutes again: only one hour has been passed.', 'M_TIME_ADD_MINUTES_OVER_60']]);
      return { question: `At the school sports day the first round of races begins at 11:${pad(m)} a.m. and, with all the changeovers, it lasts ${plural(dur, 'minute')}. At what time will the first round be over?`, options, instruction: 'Choose the finishing time.',
        hints: ['Add the minutes. When they pass 60, carry one hour.', 'Remember a.m. changes to p.m. after noon.'], steps: [`11:${pad(m)} + ${dur} minutes = 11:${tot} which is ${H}:${pad(M)}.`, `After noon it is p.m.: ${right}.`] };
    } }),

  // ------------------------------------------------------------ DIGITAL_CLOCK
  fam({ id: 'g4c.time.digital.words', cs: `${T}DIGITAL_CLOCK`, form: 'direct', rung: 1,
    gen: () => {
      const h = randInt(2, 11), quarterTo = Math.random() < 0.5, pe = person();
      const right = quarterTo ? `${h - 1}:45` : `${h}:15`, wrong1 = quarterTo ? `${h}:45` : `${h}:45`, wrong2 = quarterTo ? `${h - 1}:15` : `${h + 1}:15`, wrong3 = quarterTo ? `${h}:15` : `${h - 1}:45`;
      const options = mc(right, [[wrong1, quarterTo ? 'Quarter to is before the hour: it is 45 minutes past the hour before.' : '45 minutes past is a quarter to the next hour. Quarter past is 15 minutes.', 'M_TIME_DIGITAL_ANALOGUE_SWAP'], [wrong2, 'Check the hour and the minutes again.', 'M_TIME_DIGITAL_ANALOGUE_SWAP'], [wrong3, 'Check the hour and the minutes again.', 'M_TIME_DIGITAL_ANALOGUE_SWAP']]);
      if (!options) return null;
      return { question: `${pe.name}'s analogue clock shows a quarter ${quarterTo ? 'to' : 'past'} ${h}. Which digital clock shows the same time?`, options, instruction: 'Choose the digital time.',
        hints: ['A quarter is 15 minutes.', quarterTo ? 'To means before the hour: the hour before and 45 minutes.' : 'Past means after the hour.'], steps: [quarterTo ? `A quarter to ${h} is 15 minutes before ${h}:00.` : `A quarter past ${h} is 15 minutes after ${h}:00.`, `The digital time is ${right}.`] };
    } }),
  fam({ id: 'g4c.time.digital.h24', cs: `${T}DIGITAL_CLOCK`, form: 'word', rung: 2,
    gen: () => {
      const H = randInt(13, 22), m = pick([0, 15, 30, 45]), pe = person(), right = `${H - 12}:${pad(m)} p.m.`;
      const options = mc(right, [[`${H - 12}:${pad(m)} a.m.`, 'A 24-hour time after 12 is in the afternoon or evening, so it is p.m.', 'M_TIME_24H_AS_AM'], [`${H}:${pad(m)} p.m.`, 'Take away 12 from the hour on a 12-hour clock.', 'M_TIME_24H_AS_AM'], [`${H - 10}:${pad(m)} p.m.`, 'Take away 12, not 10, from the hour.', 'M_TIME_24H_AS_AM']]);
      return { question: `A bus board at the stage shows ${H}:${pad(m)}. ${pe.name} writes the time on a 12-hour clock with a.m. or p.m. Which is correct?`, options, instruction: 'Choose the 12-hour time.',
        hints: ['After 12:00 noon, take 12 away from the hour.', 'These times are in the afternoon or evening.'], steps: [`${H} - 12 = ${H - 12}.`, `The time is ${right}.`] };
    } }),

  // ------------------------------------------------------------ MONEY
  fam({ id: 'g4c.money.list.line', cs: `${Y}SHOPPING_LIST`, form: 'word', rung: 1,
    gen: () => {
      const q = randInt(2, 9), p = pick([20, 25, 30, 40, 55, 60, 75, 90, 120]), th = pick(['loaves of bread', 'packets of milk', 'bars of soap', 'exercise books', 'tins of beans']), pe = person();
      return { question: `On ${pe.name}'s shopping list, ${q} ${th} cost sh ${p} each. How much do the ${q} ${th} cost altogether?`, answer: q * p,
        wrong: [[p, `That is the price of one. There are ${q}.`, 'M_LIST_OMITS_QUANTITY'], [q + p, 'Several items at the same price are found by multiplying, not adding.', 'M_COST_ADDS_QUANTITY'], [q * p + p, 'Count the items again: only ' + q + ' are bought.', 'M_LIST_OMITS_QUANTITY'], [q * p - p, 'Count the items again: ' + q + ' are bought.', 'M_LIST_OMITS_QUANTITY']],
        hints: ['Find the cost of one item and the number of items.', 'Multiply the price by the number of items.'], steps: [`${q} x ${p} = ${q * p}.`, `They cost sh ${commas(q * p)}.`], chk: (x) => x === q * p };
    } }),
  fam({ id: 'g4c.money.total.change', cs: `${Y}TOTAL_COST`, form: 'word', rung: 2,
    gen: () => {
      const items = [['bread', 60], ['milk', 55], ['sugar', 130], ['rice', 140], ['maize flour', 120]], pick3 = [...items].sort(() => Math.random() - 0.5).slice(0, 3), qs = pick3.map(() => randInt(1, 3));
      const costs = pick3.map((it, i) => it[1] * qs[i]), total = costs.reduce((a, b) => a + b, 0), note = total <= 500 ? 500 : 1000, pe = person();
      if (total > 900 || total < 200) return null;
      const list = pick3.map((it, i) => `${qs[i]} ${it[0]} at sh ${it[1]} each`).join(', ');
      return { question: `${pe.name} buys ${list}. ${pe.She} pays with a sh ${note} note. How much change does ${pe.she} get?`, answer: note - total,
        wrong: [[note + total, 'Change is what the shopkeeper gives back: take the cost away from the note.', 'M_COST_CHANGE_ADDS'], [note - costs[0] - costs[1], 'The third item is missing from the total cost.', 'M_COST_ONE_ITEM_ONLY'], [note - pick3.reduce((a, b) => a + b[1], 0), 'Several items at the same price must be multiplied by the number bought.', 'M_COST_ADDS_QUANTITY'], [total, 'That is the total cost. The question asks for the change.', 'M_COST_CHANGE_ADDS']],
        hints: ['Find the cost of each line, then the total cost.', 'Take the total cost away from the note.'], steps: [`Costs: ${costs.join(' + ')} = ${total}.`, `${note} - ${total} = ${note - total}.`], chk: (x) => x + total === note };
    } }),
];
