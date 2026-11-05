// ============================================================================
// GRADE 5 QUESTION FAMILIES: money, estimating, equations, decimals, patterns,
// measures and the other skills that had one or two forms.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const rot = (a, k) => [...a.slice(k), ...a.slice(0, k)];
const distinct = (...v) => new Set(v).size === v.length;
const rnd = (n, to) => Math.round(n / to) * to;
const fl = (n, to) => Math.floor(n / to) * to;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export const FAMILIES = [
  // ================================================================ MONEY
  fam({ id: 'g5.money.budget-table', skill: 'G5_MONEY', outcome: 'G5.MONEY.c', rung: 2, form: 'table',
    draw: () => {
      const food = randInt(6, 12) * 100, water = randInt(2, 6) * 50, fare = randInt(4, 10) * 50, air = randInt(2, 6) * 50, clothes = randInt(2, 5) * 100;
      const total = food + water + fare + air + clothes, have = rnd(total, 500) + 500 * randInt(0, 1);
      const left = have - total;
      return left > 0 && distinct(left, total, have - (total - clothes), have + total) ? { food, water, fare, air, clothes, total, have, left, p: person() } : null;
    },
    make: ({ food, water, fare, air, clothes, total, have, left, p }) => ({
      question: `The table shows ${p.name}'s budget for one month. How much of the money coming in is left after all five items are paid?`,
      model: { type: 'table', data: { head: ['Item', 'Amount'], rows: [{ label: 'Money coming in', value: sh(have) }, { label: 'Food', value: sh(food) }, { label: 'Water', value: sh(water) }, { label: 'Bus fares', value: sh(fare) }, { label: 'Airtime', value: sh(air) }, { label: 'Clothes', value: sh(clothes) }] } },
      answer: left,
      wrong: [[total, 'That is the total of the five items. Take it from the money coming in.'], [have - (total - clothes), 'Four items are taken away. The budget has five.'], [have + total, 'Spending takes money away, so subtract.']],
      hints: ['Add the five items first.', 'Then compare the total with the money coming in.'],
      steps: [`Five items: ${food} + ${water} + ${fare} + ${air} + ${clothes} = ${sh(total)}.`, `Left: ${have} − ${total} = ${sh(left)}.`],
    }),
    check: ({ have, food, water, fare, air, clothes }, a) => have - a - clothes - air - fare - water === food }),

  fam({ id: 'g5.money.budget-steps', skill: 'G5_MONEY', outcome: 'G5.MONEY.c', rung: 3, form: 'steps',
    draw: () => {
      const a = randInt(6, 12) * 100, b = randInt(2, 6) * 100, c = randInt(1, 4) * 50, save = pick([200, 250, 300, 350, 400]);
      const total = a + b + c, P = total + save, m = randInt(3, 8), X = save * m;
      return distinct(total, save, m, a + b, P) ? { a, b, c, save, total, P, m, X, p: person() } : null;
    },
    make: ({ a, b, c, save, total, P, m, X, p }) => ({
      question: `${p.name} earns ${sh(P)} a month at a kiosk. ${p.Her} budget is: food ${sh(a)}, bus fares ${sh(b)} and airtime ${sh(c)}. ${p.She} saves the rest.`,
      parts: [
        { prompt: 'How much does the budget spend on the three items?', answer: total, unit: 'sh', hint: 'Add the three items.', wrong: [[a + b, 'Airtime is also in the budget.'], [P, 'That is the money coming in, not the spending.']] },
        { prompt: 'How much is left to save each month?', answer: save, unit: 'sh', hint: 'Take the spending from the money coming in.', wrong: [[P + total, 'Spending takes money away, so subtract.'], [total, 'That is the spending. How much is left?']] },
        { prompt: `${p.She} wants to save ${sh(X)}. How many months will it take?`, answer: m, unit: 'months', hint: 'How many monthly savings make the whole amount?', wrong: [[X - save, 'Taking away one saving is not enough. How many savings make the amount?'], [X + save, 'Share the amount by the monthly saving.']] },
      ],
      steps: [`Spending: ${a} + ${b} + ${c} = ${sh(total)}.`, `Savings: ${P} − ${total} = ${sh(save)} a month.`, `Months: ${X} ÷ ${save} = ${m}.`],
    }),
    check: ({ P, X }, v) => v[0] + v[1] === P && v[1] * v[2] === X }),

  fam({ id: 'g5.money.budget-spot', skill: 'G5_MONEY', outcome: 'G5.MONEY.c', rung: 3, form: 'spot',
    draw: () => {
      const a = randInt(5, 10) * 100, b = randInt(2, 5) * 100, c = randInt(1, 4) * 100, P = a + b + c + randInt(2, 5) * 100;
      return { a, b, c, P, k: randInt(0, 2), p: person(), months: randInt(3, 6) };
    },
    make: ({ a, b, c, P, k, p, months }) => {
      const t1 = k === 0 ? a + b : a + b + c, t2 = k === 1 ? P + t1 : P - t1, t3 = k === 2 ? t2 + months : t2 * months;
      return {
        question: `${p.name} has ${sh(P)} a month. The budget has food ${sh(a)}, rent share ${sh(b)} and clothes ${sh(c)}. ${p.She} works out how much ${p.she} can save in ${months} months. Which step has the mistake?`,
        working: [
          { text: `Spending: ${a} + ${b} + ${c} = ${commas(t1)}`, ok: t1 === a + b + c },
          { text: `Left each month: ${commas(P)} − ${commas(t1)} = ${commas(t2)}`, ok: t2 === P - t1 },
          { text: `Saved in ${months} months: ${commas(t2)} × ${months} = ${commas(t3)}`, ok: t3 === t2 * months },
        ],
        fix: k === 0 ? 'The spending leaves out the clothes. All three items are in the budget.' : k === 1 ? 'What is left is the money coming in minus the spending. Here the two were added.' : `Saving the same amount for ${months} months means multiplying, not adding.`,
        hints: ['Check each step against the one before it.', 'Does each step use the right sign: add for spending, subtract for what is left?'],
        steps: [`Spending: ${a} + ${b} + ${c} = ${a + b + c}.`, `Left: ${P} − ${a + b + c} = ${P - a - b - c}.`, `In ${months} months: ${P - a - b - c} × ${months} = ${(P - a - b - c) * months}.`],
      };
    } }),

  fam({ id: 'g5.money.budget-cut-why', skill: 'G5_MONEY', outcome: 'G5.MONEY.a', rung: 2, form: 'why',
    draw: () => ({ short: randInt(2, 8) * 50, k: randInt(0, 3), p: person() }),
    make: ({ short, k, p }) => {
      const opts = [
        { text: 'Cut the sweets and the toy, because they are wants and the other items are needs', right: true },
        { text: 'Cut the food, because a person can wait to eat', right: false, why: 'Food is a need. A budget pays for needs first.' },
        { text: 'Cut the school books, because books are not important', right: false, why: 'School books are a need. They come before wants.' },
        { text: 'Cut nothing, because a budget does not change', right: false, why: 'A budget is a plan, and a plan can change when the money is not enough.' },
      ];
      return { question: `${p.name}'s budget is ${sh(short)} more than the money ${p.she} has. It lists food, school books, sweets and a toy. What should ${p.she} cut first, and why?`,
        instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['A need is something a person must have. A want is something nice to have.', 'Which items could wait?'],
        steps: ['A budget pays for needs first: food and school books.', 'Wants such as sweets and a toy are cut first when money is short.'] };
    } }),

  fam({ id: 'g5.money.tax-add', skill: 'G5_MONEY', outcome: 'G5.MONEY.d', rung: 2, form: 'word',
    draw: () => { const n = randInt(2, 9), r = pick([5, 10, 15]), p = person(); return { n, r, p, goods: n * 100, thing: pick(['a school jersey', 'a pair of school shoes', 'a basket of groceries']) }; },
    make: ({ n, r, p, goods, thing }) => {
      const tax = n * r, tot = goods + tax;
      return { question: `In this question, a shop adds tax of ${sh(r)} on every sh 100 of goods. ${p.name} buys ${thing} for ${sh(goods)}. How much does ${p.she} pay in all, in shillings?`,
        answer: tot,
        wrong: [[tax, 'That is the tax alone. The customer pays the goods and the tax.'], [goods + r, 'The tax is charged on every sh 100, not once.'], [goods - tax, 'Tax is added to the price, not taken off.']],
        hints: ['How many sh 100 are in the price of the goods?', 'Find the tax, then add it to the price.'],
        steps: [`${goods} has ${n} lots of sh 100. Tax: ${n} × ${r} = ${sh(tax)}.`, `Total: ${goods} + ${tax} = ${sh(tot)}.`] };
    },
    check: ({ goods, r }, a) => (a - goods) * 100 === (goods * r) }),

  fam({ id: 'g5.money.tax-receipt', skill: 'G5_MONEY', outcome: 'G5.MONEY.d', rung: 2, form: 'table',
    draw: () => { const a = price('loaf of bread'), b = price('litre of milk'), c = price('kg of sugar'), tax = pick([10, 15, 20, 25]); return { a, b, c, tax }; },
    make: ({ a, b, c, tax }) => {
      const goods = a + b + c, tot = goods + tax;
      return { question: 'A till slip shows the goods bought and the tax charged. Tax is money paid to the government. How much must the customer pay in all?',
        story: true,
        model: { type: 'table', data: { head: ['Item', 'Amount'], rows: [{ label: 'Loaf of bread', value: sh(a) }, { label: 'Litre of milk', value: sh(b) }, { label: 'Kilogram of sugar', value: sh(c) }, { label: 'Tax', value: sh(tax) }] } },
        answer: tot,
        wrong: [[goods, 'The tax must be paid too. Add it.'], [goods - tax, 'Tax is added on top of the goods. It is not taken off.'], [goods + 2 * tax, 'The tax is on the slip once. Add it once.']],
        hints: ['Is the tax part of what the customer pays?', 'Add the goods and the tax.'],
        steps: [`Goods: ${a} + ${b} + ${c} = ${sh(goods)}.`, `With tax: ${goods} + ${tax} = ${sh(tot)}.`] };
    },
    check: ({ a, b, c, tax }, v) => v - tax - a - b === c }),

  fam({ id: 'g5.money.bank-interest', skill: 'G5_MONEY', outcome: 'G5.MONEY.e', rung: 2, form: 'word',
    draw: () => { const n = randInt(2, 9), r = pick([2, 3, 4, 5]), p = person(); return { n, r, p, sav: n * 500 }; },
    make: ({ n, r, p, sav }) => {
      const interest = (sav / 100) * r, tot = sav + interest;
      return { question: `${p.name} puts ${sh(sav)} in a savings account. Interest is extra money the bank adds to savings. In this question the bank adds ${sh(r)} for every sh 100 saved for one year. How much is in the account after one year?`,
        answer: tot,
        wrong: [[interest, 'That is the interest only. The savings are still in the account.'], [sav + r, 'The bank adds the interest for every sh 100, not once.'], [sav - interest, 'Interest is added to the account, not taken away.']],
        hints: ['How many lots of sh 100 are in the savings?', 'Find the interest, then add it to the savings.'],
        steps: [`${sav} has ${sav / 100} lots of sh 100. Interest: ${sav / 100} × ${r} = ${sh(interest)}.`, `In the account: ${sav} + ${interest} = ${sh(tot)}.`] };
    },
    check: ({ sav, r }, a) => (a - sav) * 100 === sav * r }),

  fam({ id: 'g5.money.bank-statement', skill: 'G5_MONEY', outcome: 'G5.MONEY.e', rung: 3, form: 'table',
    draw: () => {
      const S = randInt(8, 30) * 100, d1 = randInt(2, 8) * 100, w1 = randInt(2, 8) * 100, d2 = randInt(1, 6) * 100, w2 = randInt(1, 5) * 100;
      const end = S + d1 - w1 + d2 - w2;
      return end > 0 && distinct(end, S + d1 + w1 + d2 + w2, S + d1 - w1, d1 + d2 - w1 - w2) ? { S, d1, w1, d2, w2, end, p: person() } : null;
    },
    make: ({ S, d1, w1, d2, w2, end, p }) => ({
      question: `The table shows what happened in ${p.name}'s bank account in one week. A deposit puts money in. A withdrawal takes money out. How much is in the account at the end of Saturday?`,
      model: { type: 'table', data: { head: ['Day', 'What happened', 'Amount'], rows: [{ cells: ['Monday', 'Opening balance', sh(S)] }, { cells: ['Tuesday', 'Deposit', sh(d1)] }, { cells: ['Wednesday', 'Withdrawal', sh(w1)] }, { cells: ['Friday', 'Deposit', sh(d2)] }, { cells: ['Saturday', 'Withdrawal', sh(w2)] }] } },
      answer: end,
      wrong: [[S + d1 + w1 + d2 + w2, 'A withdrawal takes money out, so subtract it.'], [S + d1 - w1, 'Two more things happened on Friday and Saturday.'], [d1 + d2 - w1 - w2, 'The account began with the opening balance. Start from it.']],
      hints: ['Start with the opening balance.', 'Add each deposit and take away each withdrawal in order.'],
      steps: [`Start: ${sh(S)}. Tuesday: ${S} + ${d1} = ${S + d1}.`, `Wednesday: ${S + d1} − ${w1} = ${S + d1 - w1}. Friday: + ${d2} = ${S + d1 - w1 + d2}.`, `Saturday: − ${w2} = ${sh(end)}.`],
    }),
    check: ({ S, d1, w1, d2, w2 }, a) => a + w1 + w2 === S + d1 + d2 }),

  fam({ id: 'g5.money.save-goal-steps', skill: 'G5_MONEY', outcome: 'G5.MONEY.f', rung: 3, form: 'steps',
    draw: () => {
      const p = price('radio'), s = pick([100, 150, 200, 250]), w = pick([4, 6, 8, 10, 12]), have = p - s * w;
      return have >= 100 && have <= p / 2 && have % 50 === 0 ? { p, s, w, have, who: person() } : null;
    },
    make: ({ p, s, w, have, who }) => ({
      question: `${who.name} wants a radio that costs ${sh(p)}. ${who.She} has already saved ${sh(have)} in a SACCO and adds ${sh(s)} every week.`,
      parts: [
        { prompt: 'How much more money does the radio need?', answer: p - have, unit: 'sh', hint: 'Take what is saved from the price.', wrong: [[p + have, 'The saved money goes towards the price, so subtract it.'], [have, 'That is what is already saved. How much is still needed?']] },
        { prompt: 'How many weeks will it take to save that amount?', answer: w, unit: 'weeks', hint: 'How many weekly savings make the amount still needed?', wrong: [[(p - have) / s + 1, 'Check by multiplying the weeks by the weekly saving.'], [p / s, 'The first savings are already in the SACCO. Use the amount still needed.']] },
        { prompt: `${who.name} wants to finish in half that many weeks. How much must ${who.she} save each week?`, answer: s * 2, unit: 'sh', hint: 'The same amount in half the time means saving more each week.', wrong: [[s / 2, 'Fewer weeks means more each week, not less.'], [s + w, 'Share the amount still needed by the new number of weeks.']] },
      ],
      steps: [`Still needed: ${p} − ${have} = ${sh(p - have)}.`, `Weeks: ${p - have} ÷ ${s} = ${w}.`, `In ${w / 2} weeks: ${p - have} ÷ ${w / 2} = ${sh(s * 2)} a week.`],
    }),
    check: ({ p, s, w, have }, v) => v[0] === p - have && v[1] * s === v[0] && v[2] * (w / 2) === v[0] }),

  fam({ id: 'g5.money.save-place-why', skill: 'G5_MONEY', outcome: 'G5.MONEY.f', rung: 2, form: 'why',
    draw: () => ({ amt: pick([3000, 5000, 8000, 12000]), months: pick([4, 6, 8]), k: randInt(0, 3), p: person() }),
    make: ({ amt, months, k, p }) => {
      const opts = [
        { text: 'A SACCO or bank account, because the money is safe and can earn interest', right: true },
        { text: 'In a pocket, because ready cash is easy to spend when you want', right: false, why: 'Saving needs money kept away from daily spending. Cash in a pocket is easy to lose and easy to spend.' },
        { text: 'With a stranger, because strangers always return money', right: false, why: 'Saving needs a safe place. Money given to a stranger can be lost.' },
        { text: 'Under the bed, because nobody can ever find it', right: false, why: 'Money at home can be stolen or burnt, and it earns no interest.' },
      ];
      return { question: `${p.name} wants to save ${sh(amt)} for ${months} months for school things. Where is it best to save the money, and why?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Think about safety, and about whether the money grows.', 'Which place do trained people look after?'],
        steps: ['When saving, think about safety first.', 'A SACCO or bank keeps the money safe and may add interest.'] };
    } }),

  fam({ id: 'g5.money.save-spot', skill: 'G5_MONEY', outcome: 'G5.MONEY.f', rung: 3, form: 'spot',
    draw: () => {
      const s = pick([50, 100, 150, 200]), w = randInt(4, 12), have = pick([200, 300, 400, 500]), X = have + s * w;
      const k = randInt(0, 1);
      return k === 0 && (X + have) % s !== 0 ? null : { s, w, have, X, k, p: person() };
    },
    make: ({ s, w, have, X, k, p }) => {
      const need = k === 0 ? X + have : X - have, weeks = k === 1 ? need * s : need / s;
      return {
        question: `${p.name} wants a school bag that costs ${sh(X)}. ${p.She} already has ${sh(have)} saved and saves ${sh(s)} a week. ${p.She} works out how many weeks to wait. Which step has the mistake?`,
        working: [
          { text: `The bag costs ${commas(X)} and ${commas(have)} is saved.`, ok: true },
          { text: `Still to save: ${commas(X)} ${k === 0 ? '+' : '−'} ${commas(have)} = ${commas(need)}`, ok: need === X - have },
          { text: `Weeks: ${commas(need)} ${k === 1 ? '×' : '÷'} ${s} = ${commas(weeks)}`, ok: weeks === need / s },
        ],
        fix: k === 0 ? 'The money already saved goes towards the price. It is taken away, not added.' : 'The weeks come from sharing the amount still needed by the weekly saving. Here it was multiplied.',
        hints: ['Check each step against the one before it.', 'Does the saved money add to the price, or come off it?'],
        steps: [`Still to save: ${X} − ${have} = ${X - have}.`, `Weeks: ${X - have} ÷ ${s} = ${w}.`],
      };
    } }),

  // ================================================================ ESTIMATING
  fam({ id: 'g5.add.estimate-word', skill: 'G5_ADDITION', outcome: 'G5.ADD.c', rung: 2, form: 'word',
    draw: () => {
      const u = pick([100, 1000]), a = u === 100 ? randInt(1200, 9800) : randInt(12000, 98000), b = u === 100 ? randInt(1200, 9800) : randInt(12000, 98000);
      if (a % u === 0 || b % u === 0 || a % u === u / 2 || b % u === u / 2) return null;
      const ra = rnd(a, u), rb = rnd(b, u), u2 = u === 100 ? 1000 : 100;
      const right = ra + rb, w = [a + b, fl(a, u) + fl(b, u), rnd(a, u2) + rnd(b, u2), ra + b];
      return distinct(right, ...w) ? { a, b, u, ra, rb, u2, s: pick([0, 1, 2]), p: person() } : null;
    },
    make: ({ a, b, u, ra, rb, u2, s }) => {
      const stories = [
        [`On Saturday ${commas(a)} people visit a county show. On Sunday ${commas(b)} people visit.`, 'people visit on the two days'],
        [`A dairy collects ${commas(a)} litres of milk on Monday and ${commas(b)} litres on Tuesday.`, 'litres of milk does it collect in the two days'],
        [`A tea factory packs ${commas(a)} kg of tea in May and ${commas(b)} kg in June.`, 'kg of tea does it pack in the two months'],
      ];
      const unit = u === 100 ? 'hundred' : 'thousand', unit2 = u === 100 ? 'thousand' : 'hundred';
      return { question: `${stories[s][0]} Estimate the total by rounding each number to the nearest ${unit}. About how many ${stories[s][1]}?`,
        answer: ra + rb,
        wrong: [[a + b, 'That is the exact total. The question asks for an estimate made by rounding first.'], [fl(a, u) + fl(b, u), `Rounding to the nearest ${unit} looks at the next digit. It does not just cut the number off.`], [rnd(a, u2) + rnd(b, u2), `The question says the nearest ${unit}, not the nearest ${unit2}.`], [ra + b, 'Only one of the numbers was rounded. Round both.']],
        hints: [`Round each number to the nearest ${unit}.`, 'Add the two rounded numbers.'],
        steps: [`${commas(a)} rounds to ${commas(ra)}. ${commas(b)} rounds to ${commas(rb)}.`, `${commas(ra)} + ${commas(rb)} = ${commas(ra + rb)}.`] };
    },
    check: ({ ra, rb }, a) => a - rb === ra }),

  fam({ id: 'g5.add.estimate-spot', skill: 'G5_ADDITION', outcome: 'G5.ADD.c', rung: 3, form: 'spot',
    draw: () => {
      const u = pick([100, 1000]), a = u === 100 ? randInt(1200, 9800) : randInt(12000, 98000), b = u === 100 ? randInt(1200, 9800) : randInt(12000, 98000);
      return a % u < u / 2 || b % u < u / 2 || a % u === 0 || b % u === 0 || a % u === u / 2 || b % u === u / 2 ? null : { a, b, u, k: randInt(0, 2), p: person() };
    },
    make: ({ a, b, u, k, p }) => {
      const sa = k === 0 ? fl(a, u) : rnd(a, u), sb = k === 1 ? fl(b, u) : rnd(b, u), t = k === 2 ? sa - sb : sa + sb;
      return {
        question: `${p.name} estimates ${commas(a)} + ${commas(b)} by rounding each number to the nearest ${u === 100 ? 'hundred' : 'thousand'}. Which step has the mistake?`,
        working: [
          { text: `${commas(a)} rounds to ${commas(sa)}.`, ok: sa === rnd(a, u) },
          { text: `${commas(b)} rounds to ${commas(sb)}.`, ok: sb === rnd(b, u) },
          { text: `${commas(sa)} + ${commas(sb)} = ${commas(t)}.`, ok: t === sa + sb },
          { text: `The sum is about ${commas(t)}.`, ok: true },
        ],
        fix: k < 2 ? `${commas(k === 0 ? a : b)} is closer to ${commas(rnd(k === 0 ? a : b, u))}. The digit after the rounding place is 5 or more, so round up.` : `Estimating a sum means adding the rounded numbers. Here the second was taken from the first.`,
        hints: ['Check each rounding by looking at the digit after the rounding place.', 'Does the last step use the sign for a sum?'],
        steps: [`${commas(a)} rounds to ${commas(rnd(a, u))}. ${commas(b)} rounds to ${commas(rnd(b, u))}.`, `The estimate is ${commas(rnd(a, u) + rnd(b, u))}.`],
      };
    } }),

  fam({ id: 'g5.add.estimate-check-why', skill: 'G5_ADDITION', outcome: 'G5.ADD.c', rung: 3, form: 'why',
    draw: () => {
      const a = randInt(12, 98) * 1000 + randInt(1, 9) * 100 + randInt(1, 9), b = randInt(12, 98) * 1000 + randInt(1, 9) * 100 + randInt(1, 9);
      return { a, b, ra: rnd(a, 1000), rb: rnd(b, 1000), k: randInt(0, 3), p: person() };
    },
    make: ({ a, b, ra, rb, k, p }) => {
      const claim = a + b + 10000;
      const opts = [
        { text: `Rounding gives about ${commas(ra + rb)}, and ${commas(claim)} is far from that`, right: true },
        { text: 'The answer is bigger than both numbers', right: false, why: 'A sum is always bigger than the numbers added. That cannot show a mistake.' },
        { text: 'The answer does not end in zero', right: false, why: 'Sums need not end in zero. Rounding is a better check.' },
        { text: 'The answer has a different last digit from the first number', right: false, why: 'Adding changes the last digit. That tells us nothing about a mistake.' },
      ];
      return { question: `${p.name} adds ${commas(a)} + ${commas(b)} and gets ${commas(claim)}. Which reason, using an estimate, shows that the answer cannot be right?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Round each number to the nearest thousand and add.', 'Is the answer close to your estimate?'],
        steps: [`${commas(a)} is about ${commas(ra)}. ${commas(b)} is about ${commas(rb)}.`, `The estimate is ${commas(ra + rb)}, so ${commas(claim)} is too far away.`] };
    } }),

  fam({ id: 'g5.sub.estimate-word', skill: 'G5_SUBTRACTION', outcome: 'G5.SUB.c', rung: 2, form: 'word',
    draw: () => {
      const u = pick([100, 1000]), a = u === 100 ? randInt(5200, 9800) : randInt(52000, 98000), b = u === 100 ? randInt(1200, 4800) : randInt(12000, 48000);
      if (a % u === 0 || b % u === 0 || a % u === u / 2 || b % u === u / 2) return null;
      const ra = rnd(a, u), rb = rnd(b, u), u2 = u === 100 ? 1000 : 100;
      const right = ra - rb, w = [a - b, ra + rb, fl(a, u) - fl(b, u), rnd(a, u2) - rnd(b, u2)];
      return distinct(right, ...w) && right > 0 ? { a, b, u, ra, rb, u2, s: pick([0, 1]) } : null;
    },
    make: ({ a, b, u, ra, rb, u2, s }) => {
      const stories = [
        [`A cooperative has ${commas(a)} kg of maize in store. It sells ${commas(b)} kg.`, 'kg of maize are left'],
        [`A stadium has ${commas(a)} seats. On match day ${commas(b)} seats are not used.`, 'seats are used'],
      ];
      const unit = u === 100 ? 'hundred' : 'thousand', unit2 = u === 100 ? 'thousand' : 'hundred';
      return { question: `${stories[s][0]} Estimate by rounding each number to the nearest ${unit}. About how many ${stories[s][1]}?`,
        answer: ra - rb,
        wrong: [[a - b, 'That is the exact answer. The question asks for an estimate made by rounding first.'], [ra + rb, 'The question is about what is left or used, so take away.'], [fl(a, u) - fl(b, u), `Rounding to the nearest ${unit} looks at the next digit. It does not just cut the number off.`], [rnd(a, u2) - rnd(b, u2), `The question says the nearest ${unit}, not the nearest ${unit2}.`]],
        hints: [`Round each number to the nearest ${unit}.`, 'Take the smaller rounded number from the bigger.'],
        steps: [`${commas(a)} rounds to ${commas(ra)}. ${commas(b)} rounds to ${commas(rb)}.`, `${commas(ra)} − ${commas(rb)} = ${commas(ra - rb)}.`] };
    },
    check: ({ ra, rb }, a) => a + rb === ra }),

  fam({ id: 'g5.sub.estimate-table', skill: 'G5_SUBTRACTION', outcome: 'G5.SUB.c', rung: 2, form: 'table',
    draw: () => {
      const v = [0, 1, 2, 3].map(() => randInt(21, 98) * 100 + randInt(1, 9) * 10 + randInt(0, 9));
      const hi = v.indexOf(Math.max(...v)), lo = v.indexOf(Math.min(...v));
      const est = rnd(v[hi], 100) - rnd(v[lo], 100);
      return new Set(v.map(x => rnd(x, 100))).size === 4 && distinct(est, v[hi] - v[lo], rnd(v[hi], 100) + rnd(v[lo], 100)) && est > 0 ? { v, hi, lo, est } : null;
    },
    make: ({ v, hi, lo, est }) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      return { question: `The table shows the litres of water a town used each day. Round each amount to the nearest hundred to estimate how many more litres the busiest day used than the quietest day.`,
        model: { type: 'table', data: { head: ['Day', 'Litres used'], rows: days.map((d, i) => ({ label: d, value: commas(v[i]) })) } },
        answer: est,
        wrong: [[v[hi] - v[lo], 'That is the exact difference. The question asks for an estimate made by rounding first.'], [rnd(v[hi], 100) + rnd(v[lo], 100), '"How many more" asks for a difference, so subtract.'], [rnd(v[hi], 100), 'That is only the bigger day. Take the other day away.']],
        hints: ['Find the biggest and the smallest amounts in the table.', 'Round both to the nearest hundred, then subtract.'],
        steps: [`${days[hi]}: ${commas(v[hi])} is about ${commas(rnd(v[hi], 100))}. ${days[lo]}: ${commas(v[lo])} is about ${commas(rnd(v[lo], 100))}.`, `${commas(rnd(v[hi], 100))} − ${commas(rnd(v[lo], 100))} = ${commas(est)}.`] };
    },
    check: ({ v, hi, lo }, a) => a + rnd(v[lo], 100) === rnd(v[hi], 100) }),

  fam({ id: 'g5.sub.estimate-spot', skill: 'G5_SUBTRACTION', outcome: 'G5.SUB.c', rung: 3, form: 'spot',
    draw: () => {
      const u = pick([100, 1000]), a = u === 100 ? randInt(5200, 9800) : randInt(52000, 98000), b = u === 100 ? randInt(1200, 4800) : randInt(12000, 48000);
      return a % u === 0 || b % u === 0 || a % u === u / 2 || b % u === u / 2 || rnd(a, u) <= rnd(b, u) ? null : { a, b, u, k: randInt(0, 2), p: person() };
    },
    make: ({ a, b, u, k, p }) => {
      const ra = rnd(a, u), rb = rnd(b, u), sa = k === 0 ? ra + u * pick([1, 2]) : ra, sb = k === 1 ? rb - u : rb, t = k === 2 ? sa + sb : sa - sb;
      const unit = u === 100 ? 'hundred' : 'thousand';
      return {
        question: `${p.name} estimates ${commas(a)} − ${commas(b)} by rounding each number to the nearest ${unit}. Which step has the mistake?`,
        working: [
          { text: `${commas(a)} rounds to ${commas(sa)}.`, ok: sa === ra },
          { text: `${commas(b)} rounds to ${commas(sb)}.`, ok: sb === rb },
          { text: `${commas(sa)} − ${commas(sb)} = ${commas(t)}.`, ok: t === sa - sb },
          { text: `The difference is about ${commas(t)}.`, ok: true },
        ],
        fix: k === 2 ? 'The estimate of a difference takes one rounded number from the other. Here they were added.' : `Look at the digit after the ${unit}s place to decide whether to round up or down. That rounding is not right.`,
        hints: ['Check each rounding by looking at the digit after the rounding place.', 'Does the last step use the sign for a difference?'],
        steps: [`${commas(a)} rounds to ${commas(ra)}. ${commas(b)} rounds to ${commas(rb)}.`, `The estimate is ${commas(ra - rb)}.`],
      };
    } }),

  fam({ id: 'g5.mul.estimate-word', skill: 'G5_MULTIPLICATION', outcome: 'G5.MUL.b', rung: 2, form: 'word',
    draw: () => {
      const a = randInt(110, 890), b = randInt(12, 88);
      if (a % 100 === 0 || b % 10 === 0 || b % 10 === 5 || a % 100 < 15 || a % 100 > 85 || a % 100 === 50) return null;
      const ra = rnd(a, 100), rb = rnd(b, 10);
      return distinct(ra * rb, a * b, ra * b, a * rb, ra + rb) ? { a, b, ra, rb, s: pick([0, 1, 2]) } : null;
    },
    make: ({ a, b, ra, rb, s }) => {
      const stories = [
        [`A bakery bakes ${a} loaves each day. It bakes for ${b} days.`, 'loaves does it bake'],
        [`A bus carries ${a} passengers each day. It runs for ${b} days.`, 'passengers does it carry'],
        [`A farm packs ${a} eggs in each crate. It fills ${b} crates.`, 'eggs does it pack'],
      ];
      return { question: `${stories[s][0]} Estimate the total by rounding ${a} to the nearest hundred and ${b} to the nearest ten. About how many ${stories[s][1]}?`,
        answer: ra * rb,
        wrong: [[a * b, 'That is the exact answer. The question asks for an estimate made by rounding first.'], [ra * b, `Both numbers must be rounded. ${b} is still to be rounded.`], [a * rb, `Both numbers must be rounded. ${a} is still to be rounded.`], [ra + rb, 'The story has a number in each and a number of days or crates, so multiply.']],
        hints: ['Round each number first.', 'Then multiply the two rounded numbers.'],
        steps: [`${a} rounds to ${commas(ra)}. ${b} rounds to ${rb}.`, `${commas(ra)} × ${rb} = ${commas(ra * rb)}.`] };
    },
    check: ({ ra, rb }, x) => x / rb === ra }),

  fam({ id: 'g5.mul.estimate-choose', skill: 'G5_MULTIPLICATION', outcome: 'G5.MUL.b', rung: 1, form: 'direct',
    draw: () => {
      const a = randInt(210, 890), b = randInt(12, 88);
      if (a % 100 < 15 || a % 100 > 85 || a % 100 === 50 || b % 10 === 0 || b % 10 === 5) return null;
      const ra = rnd(a, 100), rb = rnd(b, 10);
      return distinct(ra * rb, ra * rb / 10, ra * rb * 10, ra + rb) ? { a, b, ra, rb, k: randInt(0, 3) } : null;
    },
    make: ({ a, b, ra, rb, k }) => {
      const opts = [
        { text: commas(ra * rb), right: true },
        { text: commas(ra * rb / 10), right: false, why: 'This answer is too small. Count the zeros in the rounded numbers.' },
        { text: commas(ra * rb * 10), right: false, why: 'This answer is too big. Count the zeros in the rounded numbers.' },
        { text: commas(ra + rb), right: false, why: 'The rounded numbers must be multiplied, not added.' },
      ];
      return { question: `Which is the best estimate of ${a} × ${b}?`, story: false, instruction: 'Round each number first.', options: rot(opts, k),
        hints: [`Round ${a} to the nearest hundred and ${b} to the nearest ten.`, 'Multiply the rounded numbers. Count the zeros.'],
        steps: [`${a} is about ${commas(ra)}. ${b} is about ${rb}.`, `${commas(ra)} × ${rb} = ${commas(ra * rb)}.`] };
    } }),

  fam({ id: 'g5.mul.estimate-steps', skill: 'G5_MULTIPLICATION', outcome: 'G5.MUL.b', rung: 3, form: 'steps',
    draw: () => {
      const a = randInt(110, 890), b = randInt(12, 88);
      if (a % 100 === 0 || b % 10 === 0 || b % 10 === 5 || a % 100 < 15 || a % 100 > 85 || a % 100 === 50) return null;
      const ra = rnd(a, 100), rb = rnd(b, 10), ex = a * b, est = ra * rb;
      return est !== ex && Math.abs(est - ex) > 0 && distinct(est, ex, Math.abs(est - ex), ra, rb) ? { a, b, ra, rb, ex, est, p: person() } : null;
    },
    make: ({ a, b, ra, rb, ex, est, p }) => ({
      question: `${p.name} buys ${b} school desks for a village school. Each desk costs ${sh(a)}. ${p.She} wants to estimate the cost first, then check it.`,
      parts: [
        { prompt: `Round ${sh(a)} to the nearest hundred.`, answer: ra, unit: 'sh', hint: `Look at the tens digit of ${a}.`, wrong: [[fl(a, 100), 'The tens digit is 5 or more, so round up.'], [a, 'Round it to a hundred.']] },
        { prompt: `Round ${b} desks to the nearest ten.`, answer: rb, hint: `Look at the ones digit of ${b}.`, wrong: [[fl(b, 10), 'The ones digit is 5 or more, so round up.'], [b, 'Round it to a ten.']] },
        { prompt: 'Estimate the cost of all the desks, in shillings.', answer: est, unit: 'sh', hint: 'Multiply the two rounded numbers.', wrong: [[ra + rb, 'Cost of many desks is found by multiplying.'], [ra * b, `The number of desks was not rounded.`]] },
        { prompt: `The exact cost is ${sh(ex)}. How far is the estimate from the exact cost, in shillings?`, answer: Math.abs(est - ex), unit: 'sh', hint: 'Find the difference between the two amounts.', wrong: [[est + ex, 'How far apart two amounts are is a difference. Subtract.']] },
      ],
      steps: [`${a} is about ${commas(ra)}. ${b} is about ${rb}.`, `Estimate: ${commas(ra)} × ${rb} = ${commas(est)}.`, `Difference: ${commas(Math.max(est, ex))} − ${commas(Math.min(est, ex))} = ${commas(Math.abs(est - ex))}.`],
    }),
    check: ({ a, b, ex, est }, v) => v[0] % 100 === 0 && v[1] % 10 === 0 && v[2] === v[0] * v[1] && (v[3] === est - ex || v[3] === ex - est) && a * b === ex }),

  fam({ id: 'g5.mul.estimate-why', skill: 'G5_MULTIPLICATION', outcome: 'G5.MUL.b', rung: 3, form: 'why',
    draw: () => {
      const a = randInt(210, 890), b = randInt(12, 88);
      if (a % 100 < 15 || a % 100 > 85 || a % 100 === 50 || b % 10 === 0 || b % 10 === 5) return null;
      return { a, b, ra: rnd(a, 100), rb: rnd(b, 10), k: randInt(0, 3), p: person() };
    },
    make: ({ a, b, ra, rb, k, p }) => {
      const claim = a * b * 10;
      const opts = [
        { text: `${a} is about ${commas(ra)} and ${b} is about ${rb}. ${commas(ra)} × ${rb} is about ${commas(ra * rb)}, far from ${commas(claim)}`, right: true },
        { text: 'A product is always bigger than both numbers, so it must be wrong', right: false, why: 'A product of two numbers above 1 is bigger than both. That does not show a mistake.' },
        { text: 'The answer ends in zero, and products cannot end in zero', right: false, why: 'Products can end in zero. This is not a reason.' },
        { text: 'The answer is bigger than the sum of the two numbers', right: false, why: 'A product like this is bigger than the sum. That is normal and shows no mistake.' },
      ];
      return { question: `${p.name} works out ${a} × ${b} and gets ${commas(claim)}. Which reason, using an estimate, shows that the answer is wrong?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Round each number and multiply the rounded numbers.', 'Compare the estimate with the answer given.'],
        steps: [`${a} is about ${commas(ra)}, ${b} is about ${rb}.`, `The estimate is ${commas(ra * rb)}. The answer ${commas(claim)} is much too big.`] };
    } }),

  fam({ id: 'g5.div.estimate-word', skill: 'G5_DIVISION', outcome: 'G5.DIV.d', rung: 2, form: 'word',
    draw: () => {
      const rb = pick([20, 30, 40, 50]), q = randInt(5, 24), ra = rb * q;
      if (ra % 100 !== 0 || ra < 200 || ra > 900) return null;
      const a = ra + randInt(-40, 40), b = rb + pick([-4, -3, -2, 2, 3, 4]);
      if (a % 100 === 0 || Math.abs(a - ra) < 5 || b <= 0) return null;
      return distinct(q, ra - rb, ra + rb, ra / (rb / 10), a - b) ? { a, b, ra, rb, q, s: pick([0, 1, 2]) } : null;
    },
    make: ({ a, b, ra, rb, q, s }) => {
      const stories = [
        [`A school has ${a} learners. They sit ${b} to a bench.`, 'benches are needed'],
        [`${a} oranges are packed ${b} to a box.`, 'boxes are needed'],
        [`A school bus fund has ${sh(a)} to share. Each trip costs ${sh(b)}.`, 'trips can be paid for'],
      ];
      return { question: `${stories[s][0]} Estimate by rounding ${a} to the nearest hundred and ${b} to the nearest ten. About how many ${stories[s][1]}?`,
        answer: q,
        wrong: [[ra - rb, 'The story is about sharing into equal groups, so divide.'], [ra + rb, 'The story is about sharing into equal groups, so divide.'], [ra / (rb / 10), `Round ${b} to the nearest ten. Do not drop the zero when you divide.`], [a - b, 'The story is about sharing into equal groups, so divide.']],
        hints: ['Round each number first.', 'Then divide the rounded numbers.'],
        steps: [`${a} rounds to ${ra}. ${b} rounds to ${rb}.`, `${ra} ÷ ${rb} = ${q}.`] };
    },
    check: ({ ra, rb }, x) => x * rb === ra }),

  fam({ id: 'g5.div.estimate-spot', skill: 'G5_DIVISION', outcome: 'G5.DIV.d', rung: 3, form: 'spot',
    draw: () => {
      const rb = pick([20, 30, 40, 50]), q = randInt(5, 24), ra = rb * q;
      if (ra % 100 !== 0 || ra < 200 || ra > 900) return null;
      const a = ra + randInt(-40, 40), b = rb + pick([-4, -3, -2, 2, 3, 4]);
      return a % 100 === 0 || Math.abs(a - ra) < 5 || b <= 0 ? null : { a, b, ra, rb, q, k: randInt(0, 2), p: person() };
    },
    make: ({ a, b, ra, rb, q, k, p }) => {
      const sa2 = k === 0 ? ra + 100 : ra, sb = k === 1 ? b : rb, t = k === 2 ? sa2 * sb : sa2 / sb;
      return {
        question: `${p.name} estimates ${a} ÷ ${b} by rounding ${a} to the nearest hundred and ${b} to the nearest ten. Which step has the mistake?`,
        working: [
          { text: `${a} rounds to ${sa2}.`, ok: sa2 === ra },
          { text: `${b} rounds to ${sb}.`, ok: sb === rb },
          { text: `${sa2} ${k === 2 ? '×' : '÷'} ${sb} = ${commas(round(t, 2))}.`, ok: k !== 2 },
          { text: `The answer is about ${commas(round(t, 2))}.`, ok: true },
        ],
        fix: k === 0 ? `${a} is closer to ${ra}. Look at the tens digit to decide whether to round up or down.` : k === 1 ? `${b} must be rounded to the nearest ten before dividing.` : 'The question is about sharing into equal groups, so the rounded numbers are divided. Here they were multiplied.',
        hints: ['Check each rounding against the digit after the rounding place.', 'Does the last step use the right operation for sharing?'],
        steps: [`${a} rounds to ${ra}. ${b} rounds to ${rb}.`, `${ra} ÷ ${rb} = ${q}.`],
      };
    } }),

  // ================================================================ EQUATIONS
  fam({ id: 'g5.eq.let-add', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.a', rung: 2, form: 'word',
    draw: () => { const kind = pick(['add', 'sub']), x = randInt(8, 60), a = randInt(5, 30); return { kind, x, a, b: kind === 'add' ? x + a : x - a, p: person(), thing: pick(['pencils', 'sweets', 'mangoes', 'books']) }; },
    make: ({ kind, x, a, b, p, thing }) => ({
      question: kind === 'add'
        ? `A box has some ${thing}. ${p.name} puts in ${a} more ${thing}. Now the box has ${b} ${thing}. Let n stand for the number of ${thing} the box had at first. Form an equation and solve it. What is n?`
        : `A bag has some ${thing}. ${p.name} takes out ${a} ${thing}. ${b} ${thing} are left in the bag. Let n stand for the number of ${thing} the bag had at first. Form an equation and solve it. What is n?`,
      answer: x,
      wrong: kind === 'add' ? [[b + a, `The equation is n + ${a} = ${b}. Undo the + ${a} by taking ${a} away.`], [b, 'That is the number after the change. n is the number at the start.'], [a, 'That is the number added. n is the number at the start.']]
        : [[b - a, `The equation is n − ${a} = ${b}. Undo the − ${a} by adding ${a}.`], [b, 'That is the number left. n is the number at the start.'], [a, 'That is the number taken out. n is the number at the start.']],
      hints: ['Write the story as an equation with n.', 'Use the opposite operation to get n alone.'],
      steps: kind === 'add' ? [`n + ${a} = ${b}.`, `n = ${b} − ${a} = ${x}.`] : [`n − ${a} = ${b}.`, `n = ${b} + ${a} = ${x}.`],
    }),
    check: ({ kind, a, b }, v) => (kind === 'add' ? v + a === b : v - a === b) }),

  fam({ id: 'g5.eq.let-twostep', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.a', rung: 3, form: 'word',
    draw: () => {
      const a = randInt(2, 6), x = randInt(3, 15), b = a * randInt(1, 5), c = a * x + b;
      return distinct(x, c - b, (c + b) / a, c / a) ? { a, x, b, c, p: person() } : null;
    },
    make: ({ a, x, b, c, p }) => ({
      question: `${p.name} puts ${a} identical bags of flour and one ${b} kg bag of rice on a scale. The scale reads ${c} kg. Let m stand for the mass of one bag of flour in kilograms. Form an equation and solve it. What is m?`,
      answer: x,
      wrong: [[c - b, `The equation is ${a}m + ${b} = ${c}. After taking ${b} away, there are still ${a} bags to share out.`], [(c + b) / a, `The ${b} kg bag is on the scale as well, so it is taken away from ${c}, not added.`], [c / a, `Take the ${b} kg of rice away first. Then share among the bags.`]],
      hints: ['Write the story as an equation with m. Bags of flour are multiplied, then the rice is added.', 'Undo the adding first, then undo the multiplying.'],
      steps: [`${a}m + ${b} = ${c}.`, `${a}m = ${c} − ${b} = ${c - b}.`, `m = ${c - b} ÷ ${a} = ${x} kg.`],
    }),
    check: ({ a, b, c }, v) => a * v + b === c }),

  fam({ id: 'g5.eq.balance-word', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.b', rung: 1, form: 'word',
    draw: () => { const kind = pick(['plus', 'twice']), x = randInt(2, 14), a = randInt(2, 9); return { kind, x, a, b: kind === 'plus' ? x + a : 2 * x, p: person() }; },
    make: ({ kind, x, a, b, p }) => ({
      question: kind === 'plus'
        ? `A balance is level. The left pan has a bag of rice and a ${a} kg mass. The right pan has a ${b} kg mass. Find x, the mass of the bag of rice in kilograms.`
        : `A balance is level. The left pan has two identical bags of flour. The right pan has a ${b} kg mass. Find x, the mass of one bag of flour in kilograms.`,
      answer: x,
      wrong: kind === 'plus' ? [[b + a, 'The two pans have the same mass. The bag and the mass on the left make the mass on the right.'], [b, `That is the mass on the right pan. The bag and the ${a} kg mass together make it.`], [a, 'That is the small mass. Find the mass of the bag.']]
        : [[b, 'That is the mass of both bags together.'], [b + 2, 'Two equal bags make the mass on the right. Share it out equally.'], [b * 2, 'Sharing the mass between two bags makes each smaller, not bigger.']],
      hints: ['The pans are level, so both sides have the same mass.', 'Write an equation with x and solve it.'],
      steps: kind === 'plus' ? [`x + ${a} = ${b}.`, `x = ${b} − ${a} = ${x} kg.`] : [`x + x = ${b}, so 2x = ${b}.`, `x = ${b} ÷ 2 = ${x} kg.`],
    }),
    check: ({ kind, a, b }, v) => (kind === 'plus' ? v + a === b : v + v === b) }),

  fam({ id: 'g5.eq.form-spot', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.a', rung: 3, form: 'spot',
    draw: () => { const x = randInt(20, 60), a = randInt(5, 15); return { x, a, c: x + a, k: randInt(0, 1), p: person() }; },
    make: ({ x, a, c, k, p }) => {
      const op = k === 0 ? '−' : '+', v = c + a;
      return {
        question: `A school has ${c} learners after ${a} new learners joined. ${p.name} forms an equation to find how many there were before. Which step has the mistake?`,
        working: [
          { text: 'Let p stand for the number of learners before.', ok: true },
          { text: `Equation: p ${op} ${a} = ${c}`, ok: op === '+' },
          { text: `Solve: p = ${c} + ${a}`, ok: '+' === (op === '+' ? '−' : '+') },
          { text: `So there were ${v} learners before.`, ok: true },
        ],
        fix: k === 0 ? 'New learners joined, so the number before plus the new ones makes the number now. The equation is p + ' + a + ' = ' + c + '.' : `To get p alone from p + ${a} = ${c}, take ${a} away. Here it was added.`,
        hints: ['Check each step against the story.', 'Does the equation match what happened: learners joined?'],
        steps: [`p + ${a} = ${c}.`, `p = ${c} − ${a} = ${x}.`],
      };
    } }),

  fam({ id: 'g5.eq.form-why', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.a', rung: 2, form: 'why',
    draw: () => { const f = randInt(3, 6), n = randInt(5, 40) * 10, k = randInt(0, 3); return { f, T: f * n, n, k }; },
    make: ({ f, T, k }) => {
      const opts = [
        { text: `${f}n = ${T}, because ${f} equal payments of n shillings make the whole cost`, right: true },
        { text: `n + ${f} = ${T}, because the friends add ${f} to the cost`, right: false, why: `n is what each friend pays. The number of friends is not added to it.` },
        { text: `n ÷ ${f} = ${T}, because the cost is shared`, right: false, why: `n is one share. Sharing the cost ${T} gives n, so n is the answer, not the starting number.` },
        { text: `${f} − n = ${T}, because the cost is taken from ${f}`, right: false, why: 'The friends do not take money away from the number of friends.' },
      ];
      return { question: `${f} friends share the cost of a gift equally. Each friend pays n shillings. The gift costs ${sh(T)}. Which equation fits the story, and why?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['n is one friend\'s payment. How many payments are there?', 'All the payments together make the cost of the gift.'],
        steps: [`${f} friends each pay n shillings.`, `So ${f} × n = ${T}, written ${f}n = ${T}.`] };
    } }),

  fam({ id: 'g5.eq.choose-direct', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.a', rung: 1, form: 'direct',
    draw: () => { const a = randInt(4, 15), b = randInt(5, 30), thing = pick(['oranges', 'eggs', 'books', 'balls']), k = randInt(0, 3); if (a === b) return null; return { a, b, thing, k, p: person() }; },
    make: ({ a, b, thing, k, p }) => {
      const opts = [
        { text: `n − ${a} = ${b}`, right: true },
        { text: `n + ${a} = ${b}`, right: false, why: `${p.name} takes ${thing} out, so the number gets smaller. Use −.` },
        { text: `${a} − n = ${b}`, right: false, why: `n is the number at the start. It is the number the ${a} is taken from, not the number taken away.` },
        { text: `${b} − n = ${a}`, right: false, why: `The ${b} left is the answer after taking ${a} away from n.` },
      ];
      return { question: `A basket has n ${thing}. ${p.name} takes out ${a} ${thing}. Then ${b} ${thing} are left. Which equation shows this?`, story: false, instruction: 'Choose the equation.', options: rot(opts, k),
        hints: [`n is the number at the start. What happens to it?`, 'The result of the change is written after the equals sign.'],
        steps: [`Start: n. Take away ${a}: n − ${a}.`, `That leaves ${b}, so n − ${a} = ${b}.`] };
    } }),

  fam({ id: 'g5.eq.solve-why', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.b', rung: 2, form: 'why',
    draw: () => { const kind = pick(['add', 'sub', 'mul']), a = randInt(3, 12), y = randInt(4, 15); return { kind, a, y, c: kind === 'add' ? y + a : kind === 'sub' ? y - a : y * a, k: randInt(0, 3) }; },
    make: ({ kind, a, y, c, k }) => {
      const eq = kind === 'add' ? `y + ${a} = ${c}` : kind === 'sub' ? `y − ${a} = ${c}` : `${a}y = ${c}`;
      const doIt = kind === 'add' ? `take ${a} away from both sides` : kind === 'sub' ? `add ${a} to both sides` : `divide both sides by ${a}`;
      const opts = [
        { text: `To solve ${eq}, we ${doIt}, because that undoes what was done to y and leaves y alone`, right: true },
        { text: `To solve ${eq}, we ${kind === 'add' ? `add ${a} to both sides` : kind === 'sub' ? `take ${a} away from both sides` : `multiply both sides by ${a}`}, because the same sign is in the equation`, right: false, why: 'Doing the same operation again makes y harder to find. We need the opposite operation.' },
        { text: `To solve ${eq}, we guess the biggest number, because y is always large`, right: false, why: 'y is not always large. Guessing is not a method.' },
        { text: `To solve ${eq}, we take ${c} from ${a}, because the smaller number goes first`, right: false, why: 'The order of the numbers is set by the equation, not by their size.' },
      ];
      return { question: `Solve ${eq}. Which reason explains the first step?`, story: false, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['What has been done to y in the equation?', 'Undo it with the opposite operation, on both sides.'],
        steps: [`In ${eq}, y has been ${kind === 'add' ? 'added to' : kind === 'sub' ? 'taken from' : 'multiplied by'} ${a}.`, `We ${doIt}, so y = ${y}.`] };
    } }),

  fam({ id: 'g5.eq.solve-spot', skill: 'G5_SIMPLE_EQUATIONS', outcome: 'G5.EQUATIONS.b', rung: 3, form: 'spot',
    draw: () => { const a = randInt(2, 6), x = randInt(3, 14), b = a * randInt(1, 5), c = a * x + b; return { a, x, b, c, k: randInt(0, 1), p: person() }; },
    make: ({ a, x, b, c, k, p }) => {
      const t = k === 0 ? c + b : c - b, v = k === 1 ? a * t : t / a;
      return {
        question: `${p.name} solves ${a}x + ${b} = ${c}. Which step has the mistake?`,
        working: [
          { text: `Take ${b} from both sides: ${a}x = ${t}`, ok: t === c - b },
          { text: `Divide both sides by ${a}: x = ${commas(v)}`, ok: v === t / a },
          { text: `Check: ${a} × ${commas(v)} + ${b} = ${commas(a * v + b)}`, ok: true },
        ],
        fix: k === 0 ? `To undo + ${b}, take ${b} away from both sides. Here it was added.` : `${a}x means ${a} times x. To undo it, divide both sides by ${a}. Here they were multiplied.`,
        hints: ['Check each step against the one before it.', 'Does each step use the opposite operation?'],
        steps: [`${a}x = ${c} − ${b} = ${c - b}.`, `x = ${c - b} ÷ ${a} = ${x}.`],
      };
    } }),

  fam({ id: 'g5.missing.story', skill: 'G5_MISSING_NUMBER', outcome: 'G5.EQUATIONS.b', rung: 2, form: 'word',
    draw: () => {
      const kind = pick(['sub', 'add', 'mul', 'div']);
      const x = kind === 'mul' || kind === 'div' ? randInt(3, 12) : randInt(20, 80), a = kind === 'mul' || kind === 'div' ? randInt(3, 9) : randInt(8, 30);
      const b = { sub: x - a, add: x + a, mul: x * a, div: x / a }[kind];
      const w = { sub: [b + a, b, a], add: [b - a, b, a], mul: [b - a, b + a, b / a * a === b ? a : 0], div: [b * a, a + b, b] }[kind];
      return distinct(x, ...w) && w.every(v => v > 0) ? { kind, x, a, b, w, p: person() } : null;
    },
    make: ({ kind, x, a, b, w, p }) => {
      const q = {
        sub: `A matatu has some passengers. At a stop, ${a} get off. ${b} passengers stay on. The number sentence is □ − ${a} = ${b}. Find the missing number.`,
        add: `A farmer has some hens. She buys ${a} more and then has ${b} hens. The number sentence is □ + ${a} = ${b}. Find the missing number.`,
        mul: `${p.name} puts sweets into ${a} equal bags and uses ${b} sweets in all. The number sentence is ${a} × □ = ${b}. Find the missing number, the sweets in each bag.`,
        div: `Some oranges are shared equally among ${a} children. Each child gets ${b} oranges. The number sentence is □ ÷ ${a} = ${b}. Find the missing number.`,
      }[kind];
      const fb = { sub: ['Adding is not the way back from taking away.', 'That is the number left, not the number at the start.', 'That is the number taken away, not the number at the start.'], add: ['Taking away is the way back from adding.', 'That is the number after buying, not before.', 'That is the number bought, not the number at the start.'], mul: ['Taking away does not undo multiplying.', 'Adding does not undo multiplying.', 'That is the number of bags. Find the sweets in one bag.'], div: ['The way back from dividing is multiplying.', 'Adding does not undo dividing.', 'That is the amount each child gets, not the number shared.'] }[kind];
      return { question: q, answer: x, wrong: w.map((v, i) => [v, fb[i]]),
        hints: ['Use the opposite operation to get back to the missing number.', 'Check by putting your number back into the sentence.'],
        steps: [{ sub: `□ = ${b} + ${a} = ${x}.`, add: `□ = ${b} − ${a} = ${x}.`, mul: `□ = ${b} ÷ ${a} = ${x}.`, div: `□ = ${b} × ${a} = ${x}.` }[kind], 'Check: put the number back in the sentence. It works.'] };
    },
    check: ({ kind, a, b }, v) => ({ sub: v - a === b, add: v + a === b, mul: a * v === b, div: v / a === b })[kind] }),

  fam({ id: 'g5.missing.machine-table', skill: 'G5_MISSING_NUMBER', outcome: 'G5.EQUATIONS.b', rung: 3, form: 'table',
    draw: () => {
      const m = randInt(2, 5), c0 = randInt(1, 5), n = pick([8, 9, 10, 12]), out = (v) => m * v + c0;
      return distinct(out(n), m * n, n + m + c0, out(4) + n) ? { m, c0, n, out } : null;
    },
    make: ({ m, c0, n, out }) => ({
      question: `A number machine follows one rule. The table shows what goes in and what comes out. Find the missing number: what comes out when ${n} goes in?`,
      model: { type: 'table', data: { head: ['In', 'Out'], rows: [1, 2, 3, 4].map(v => ({ label: String(v), value: String(out(v)) })).concat([{ label: String(n), value: '?' }]) } },
      answer: out(n),
      wrong: [[m * n, `The rule has a second step. Check it against the row with 1 in and ${out(1)} out.`], [n + m + c0, 'The rule is not adding the same number to what goes in. Look at how far apart the outs are.'], [out(4) + n, 'Adding what goes in to the last out does not follow the rule in the table.']],
      hints: ['Look at how much Out grows each time In goes up by 1.', 'Test your rule on a row of the table.'],
      steps: [`Out grows by ${m} each time, so the rule begins with × ${m}.`, `1 × ${m} = ${m}, but ${out(1)} comes out, so add ${c0}.`, `${n} × ${m} + ${c0} = ${out(n)}.`],
    }),
    check: ({ m, c0, n }, a) => (a - c0) / m === n }),

  fam({ id: 'g5.missing.think-number', skill: 'G5_MISSING_NUMBER', outcome: 'G5.EQUATIONS.b', rung: 3, form: 'word',
    draw: () => {
      const m = randInt(2, 5), x = randInt(3, 15), b = m * randInt(1, 5), op = pick(['+', '−']), c = op === '+' ? m * x + b : m * x - b;
      const w = [op === '+' ? c - b : c + b, op === '+' ? (c + b) / m : (c - b) / m, c / m];
      return c > 0 && distinct(x, ...w) ? { m, x, b, op, c, w } : null;
    },
    make: ({ m, x, b, op, c, w }) => ({
      question: `I think of a number. I multiply it by ${m}. Then I ${op === '+' ? 'add' : 'take away'} ${b}. The answer is ${c}. What is my number?`,
      answer: x,
      wrong: [[w[0], `That finishes only the first step back. My number was multiplied by ${m}.`], [w[1], `The last thing I did was ${op === '+' ? 'add' : 'take away'} ${b}. To undo it, ${op === '+' ? 'take it away' : 'add it'}.`], [w[2], `The ${b} was ${op === '+' ? 'added' : 'taken away'} after multiplying. Undo it first.`]],
      hints: ['Work backwards from the answer, undoing the last step first.', 'Then undo the multiplying.'],
      steps: [`Undo the last step: ${c} ${op === '+' ? '−' : '+'} ${b} = ${op === '+' ? c - b : c + b}.`, `Undo the multiplying: ${op === '+' ? c - b : c + b} ÷ ${m} = ${x}.`],
    }),
    check: ({ m, b, op, c }, v) => (op === '+' ? v * m + b === c : v * m - b === c) }),

  // ================================================================ DECIMALS
  fam({ id: 'g5.dec.place-expanded', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.a', rung: 2, form: 'word',
    draw: () => {
      const t = randInt(1, 9), h = Math.random() < 0.5 ? 0 : randInt(1, 9), th = randInt(1, 9);
      const ans = round(t / 10 + h / 100 + th / 1000, 3), A = Number(`0.${t}${th}`), C = Number(`0.${th}${h}${t}`), F = h === 0 ? Number(`0.${t}00${th}`) : Number(`0.${t}${th}${h}`);
      return distinct(ans, A, C, F) ? { t, h, th, ans, A, C, F } : null;
    },
    make: ({ t, h, th, ans, A, C, F }) => ({
      question: `A scale reading is made of ${t} tenths, ${h} hundredths and ${th} thousandths of a kilogram. Write the reading as a decimal, in kilograms.`,
      answer: ans,
      wrong: [[A, h === 0 ? 'A zero is needed in the hundredths place. Without it the digits slide into the wrong places.' : 'The hundredths digit is missing from the number.'], [C, 'The tenths digit comes first after the decimal point, then the hundredths, then the thousandths.'], [F, h === 0 ? 'The thousandths digit goes in the third place after the point, not the fourth.' : 'The hundredths digit goes before the thousandths digit.']],
      hints: ['The first place after the point is tenths, then hundredths, then thousandths.', 'A place with none in it is filled with a zero.'],
      steps: [`Tenths: ${t}. Hundredths: ${h}. Thousandths: ${th}.`, `Written as a decimal: 0.${t}${h}${th} kg.`],
    }),
    check: ({ t, h, th }, a) => Math.round(a * 1000) === t * 100 + h * 10 + th }),

  fam({ id: 'g5.dec.place-table', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.a', rung: 2, form: 'table',
    draw: () => {
      const ds = [randInt(1, 9), randInt(1, 9), randInt(1, 9), randInt(1, 9)];
      const n = ds[0] + ds[1] / 10 + ds[2] / 100 + ds[3] / 1000;
      return new Set(ds).size === 4 ? { ds, n: round(n, 3) } : null;
    },
    make: ({ ds, n }) => ({
      question: 'A place value chart has columns for ones, tenths, hundredths and thousandths. It shows the distance of a race in kilometres. Write the distance as a decimal.',
      model: { type: 'table', data: { head: ['Ones', 'Tenths', 'Hundredths', 'Thousandths'], rows: [{ cells: ds.map(String) }] } },
      answer: n,
      wrong: [[round(ds[0] + ds[2] / 10 + ds[1] / 100 + ds[3] / 1000, 3), 'Check which digit sits in the tenths column and which in the hundredths column.'], [round(ds[0] + ds[1] / 10 + ds[2] / 100, 2), 'The thousandths column has a digit too.'], [round(ds[3] + ds[2] / 10 + ds[1] / 100 + ds[0] / 1000, 3), 'The ones column is on the left, before the decimal point.']],
      hints: ['The digit in the ones column goes before the decimal point.', 'The other three digits go after it, in order.'],
      steps: [`Ones: ${ds[0]}. Tenths: ${ds[1]}. Hundredths: ${ds[2]}. Thousandths: ${ds[3]}.`, `The number is ${ds[0]}.${ds[1]}${ds[2]}${ds[3]} km.`],
    }),
    check: ({ ds }, a) => Math.round(a * 1000) === ds[0] * 1000 + ds[1] * 100 + ds[2] * 10 + ds[3] }),

  fam({ id: 'g5.dec.place-spot', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.a', rung: 3, form: 'spot',
    draw: () => {
      const ds = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
      return new Set(ds).size === 3 ? { ds, k: randInt(0, 2), p: person() } : null;
    },
    make: ({ ds, k, p }) => {
      const shown = ds.map((d, i) => round(d / 10 ** (k === i ? i : i + 1), k === i ? Math.max(i, 1) : i + 1));
      const total = round(shown[0] + shown[1] + shown[2], 3);
      const places = ['tenths', 'hundredths', 'thousandths'];
      return {
        question: `${p.name} writes 0.${ds.join('')} as the sum of the values of its digits. Which step has the mistake?`,
        working: ds.map((d, i) => ({ text: `The digit ${d} is in the ${places[i]} place. Its value is ${shown[i]}.`, ok: shown[i] === round(d / 10 ** (i + 1), i + 1) }))
          .concat([{ text: `The three values add to ${total}.`, ok: true }]),
        fix: `The digit ${ds[k]} is in the ${places[k]} place, so its value is ${round(ds[k] / 10 ** (k + 1), k + 1)}. The value was taken from the wrong place.`,
        hints: ['Check each place name: tenths, hundredths, thousandths.', 'A digit in the hundredths place is worth hundredths of one.'],
        steps: [`${round(ds[0] / 10, 1)} + ${round(ds[1] / 100, 2)} + ${round(ds[2] / 1000, 3)} = 0.${ds.join('')}.`],
      };
    } }),

  fam({ id: 'g5.dec.order-word', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.b', rung: 2, form: 'word',
    draw: () => {
      const w = randInt(2, 5), fr = [];
      while (fr.length < 4) { const len = randInt(1, 3), f = String(randInt(1, 999)).padStart(len, '0').slice(0, len); if (!f.endsWith('0') && !fr.some(x => Number('0.' + x) === Number('0.' + f))) fr.push(f); }
      const vals = fr.map(f => Number(`${w}.${f}`)), small = Math.random() < 0.5;
      const right = small ? Math.min(...vals) : Math.max(...vals);
      const byInt = [...fr].sort((a, b) => (small ? Number(a) - Number(b) : Number(b) - Number(a)));
      const byLen = [...fr].sort((a, b) => (small ? a.length - b.length : b.length - a.length));
      const cand = [[Number(`${w}.${byInt[0]}`), 'whole'], [small ? Math.max(...vals) : Math.min(...vals), 'end'], [Number(`${w}.${byLen[0]}`), 'len'], [vals[0], 'first'], [Number(`${w}.${byInt[1]}`), 'second']];
      const seen = new Set([right]), wr = cand.filter(([v]) => (seen.has(v) ? false : (seen.add(v), true)));
      return wr.length >= 3 && wr.some(([, k]) => k === 'whole') ? { w, vals, small, right, wr, thing: pick(['melons', 'pumpkins', 'sacks of onions']) } : null;
    },
    make: ({ vals, small, right, wr, thing }) => {
      const fb = { whole: 'Compare the tenths first, then the hundredths. Do not read the digits after the point as one whole number.', end: `That is the ${small ? 'largest' : 'smallest'} mass. Read the question again.`, len: `The number of digits does not tell which decimal is ${small ? 'smaller' : 'bigger'}. Compare place by place.`, first: 'That is just the first mass in the list.', second: `That is the second ${small ? 'smallest' : 'largest'} mass, not the ${small ? 'smallest' : 'largest'}.` };
      const f = (v) => v.toFixed(3).replace(/0+$/, '');
      return { question: `Four ${thing} have these masses in kilograms: ${vals.map(f).join(', ')}. Put the masses in order from smallest to largest. What is the ${small ? 'smallest' : 'largest'} mass, in kilograms?`,
        answer: right,
        wrong: wr.map(([v, k]) => [v, fb[k]]),
        hints: ['The whole parts are the same. Compare the tenths first.', 'If the tenths match, compare the hundredths.'],
        steps: ['Compare tenths, then hundredths, then thousandths.', `In order: ${[...vals].sort((a, b) => a - b).map(f).join(', ')}.`, `The ${small ? 'smallest' : 'largest'} is ${right}.`] };
    },
    check: ({ vals, small }, a) => vals.includes(a) && vals.filter(v => (small ? v < a : v > a)).length === 0 }),

  fam({ id: 'g5.dec.order-why', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.b', rung: 3, form: 'why',
    draw: () => { const u = randInt(3, 9), v = randInt(1, u - 1), w = randInt(1, 9); return { u, v, w, k: randInt(0, 3), p: person() }; },
    make: ({ u, v, w, k, p }) => {
      const opts = [
        { text: `0.${u} is ${u}0 hundredths and 0.${v}${w} is ${v}${w} hundredths. ${u}0 hundredths is more than ${v}${w} hundredths`, right: true },
        { text: `0.${v}${w} has more digits, and more digits means a bigger number`, right: false, why: 'More digits after the point does not make a decimal bigger.' },
        { text: 'Decimals with different numbers of digits cannot be compared', right: false, why: 'They can. Write both with the same number of decimal places.' },
        { text: `0.${u} is the same as 0.0${u}`, right: false, why: `0.${u} is ${u} tenths, which is 0.${u}0. It is not 0.0${u}.` },
      ];
      return { question: `${p.name} says that 0.${v}${w} is bigger than 0.${u} because ${v}${w} is bigger than ${u}. Which reason shows ${p.she} is wrong?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Write both decimals with the same number of places.', 'Compare tenths first.'],
        steps: [`0.${u} = 0.${u}0.`, `${u}0 hundredths is more than ${v}${w} hundredths, so 0.${u} is bigger.`] };
    } }),

  fam({ id: 'g5.dec.order-table', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.b', rung: 2, form: 'table',
    draw: () => {
      const names = ['Achieng', 'Baraka', 'Chebet', 'Dennis', 'Elijah'], t = [];
      while (t.length < 5) { const len = randInt(1, 2), f = String(randInt(1, 99)).padStart(len, '0').slice(0, len); if (!f.endsWith('0') && !t.some(x => Number(x) === Number(`13.${f}`))) t.push(Number(`13.${f}`)); }
      const best = Math.min(...t), fs = t.map(x => String(x).split('.')[1]);
      const naive = t[fs.indexOf([...fs].sort((a, b) => Number(a) - Number(b))[0])];
      const cand = [[naive, 'whole'], [Math.max(...t), 'max'], [t[0], 'first'], [t[fs.indexOf([...fs].sort((a, b) => a.length - b.length || Number(a) - Number(b))[0])], 'short']];
      const seen = new Set([best]), wr = cand.filter(([v]) => (seen.has(v) ? false : (seen.add(v), true)));
      return wr.length >= 3 && naive !== best ? { names, t, best, wr } : null;
    },
    make: ({ names, t, best, wr }) => {
      const fb = { whole: 'Compare tenths first. A time with one decimal place is not always smaller than one with two.', max: 'That is the slowest time. The winner took the smallest time.', first: 'That is the first time in the list, not the smallest.', short: 'The number of digits does not tell which time is smaller. Compare place by place.' };
      return { question: 'The table shows the time in seconds that five learners took to run 100 metres. The winner has the smallest time. Put the times in order from smallest to largest. What is the winning time?',
        model: { type: 'table', data: { head: ['Learner', 'Time (seconds)'], rows: names.map((n, i) => ({ label: n, value: String(t[i]) })) } },
        answer: best,
        wrong: wr.map(([v, k]) => [v, fb[k]]),
        hints: ['All the times start with the same whole number. Compare the tenths.', 'If two times have the same tenths, compare the hundredths.'],
        steps: [`Order the times: ${[...t].sort((a, b) => a - b).join(', ')}.`, `The smallest is ${best} seconds.`] };
    },
    check: ({ t }, a) => t.includes(a) && t.every(x => x >= a) }),

  fam({ id: 'g5.decadd.word', skill: 'G5_DECIMALS_ADD', outcome: 'G5.DEC.c', rung: 2, form: 'word',
    draw: () => {
      const a = round(randInt(110, 690) / 100, 2), b = round(randInt(11, 69) / 10, 1);
      if (a * 100 % 10 === 0 || b === Math.floor(b)) return null;
      const sum = round(a + b, 2), mis = (x) => Math.floor(x) + round((x - Math.floor(x)) / 10, 3);
      const w = [round(a + mis(b), 3), Math.floor(a) + Math.floor(b), round(Math.abs(a - b), 2)];
      return distinct(sum, ...w) ? { a, b, sum, w, s: pick([0, 1, 2]) } : null;
    },
    make: ({ a, b, sum, w, s }) => {
      const st = [[`A parcel has a mass of ${a} kg. A second parcel has a mass of ${b} kg. What is their total mass in kilograms?`], [`Wanjiru walks ${a} km to school. After school she walks ${b} km to her aunt. How many kilometres does she walk altogether?`], [`A bucket holds ${a} litres of water. Another bucket holds ${b} litres. How many litres is that together?`]];
      return { question: st[s][0], answer: sum,
        wrong: [[w[0], 'The decimal points must line up. Tenths go under tenths and hundredths under hundredths.'], [w[1], 'The decimal parts have been left out. Add them too.'], [w[2], 'The question asks for the total, so add.']],
        hints: ['Write the numbers one under the other with the decimal points lined up.', 'You can write a zero to make the numbers the same length.'],
        steps: [`${a.toFixed(2)} + ${b.toFixed(2)}`, `= ${sum}.`] };
    },
    check: ({ a, b }, v) => Math.round((v - b) * 100) === Math.round(a * 100) }),

  fam({ id: 'g5.decadd.table', skill: 'G5_DECIMALS_ADD', outcome: 'G5.DEC.c', rung: 2, form: 'table',
    draw: () => {
      const a = round(randInt(11, 59) / 10, 1), b = round(randInt(110, 590) / 100, 2), c = round(randInt(11, 59) / 10, 1);
      if (b * 100 % 10 === 0) return null;
      const mis = (x) => Math.floor(x) + round((x - Math.floor(x)) / 10, 3), sum = round(a + b + c, 2);
      const w = [round(a + b + c - Math.min(a, b, c), 2), round(mis(a) + b + mis(c), 3), Math.floor(a) + Math.floor(b) + Math.floor(c)];
      return distinct(sum, ...w) ? { a, b, c, sum, w } : null;
    },
    make: ({ a, b, c, sum, w }) => ({
      question: 'The table shows the mass of three parcels in kilograms. Find the total mass of all the parcels.',
      model: { type: 'table', data: { head: ['Parcel', 'Mass (kg)'], rows: [{ label: 'Parcel A', value: String(a) }, { label: 'Parcel B', value: String(b) }, { label: 'Parcel C', value: String(c) }] } },
      answer: sum,
      wrong: [[w[0], 'There are three parcels. Add all three.'], [w[1], 'Line up the decimal points. A number with one decimal place has tenths, not hundredths.'], [w[2], 'The decimal parts have been left out. Add them too.']],
      hints: ['Write each mass with two decimal places.', 'Add the numbers with the decimal points lined up.'],
      steps: [`${a.toFixed(2)} + ${b.toFixed(2)} + ${c.toFixed(2)}`, `= ${sum} kg.`],
    }),
    check: ({ a, b, c }, v) => Math.round(v * 100) - Math.round(c * 100) - Math.round(b * 100) === Math.round(a * 100) }),

  fam({ id: 'g5.decsub.word', skill: 'G5_DECIMALS_SUB', outcome: 'G5.DEC.c', rung: 2, form: 'word',
    draw: () => {
      const a = round(randInt(41, 99) / 10, 1), b = round(randInt(110, 390) / 100, 2);
      if (b * 100 % 10 === 0 || a <= b || a === Math.floor(a)) return null;
      const colAbs = (x, y) => { const X = String(Math.round(x * 100)).padStart(4, '0'), Y = String(Math.round(y * 100)).padStart(4, '0'); return Number([...X].map((d, i) => Math.abs(d - Y[i])).join('')) / 100; };
      const mis = Math.floor(a) + round((a - Math.floor(a)) / 10, 3), ans = round(a - b, 2), w = [round(mis - b, 3), colAbs(a, b), round(a + b, 2)];
      return distinct(ans, ...w) && w[0] > 0 ? { a, b, ans, w, p: person() } : null;
    },
    make: ({ a, b, ans, w, p }) => ({
      question: `${p.name} has a rope ${a} m long. ${p.She} cuts off ${b} m. How many metres of rope are left?`,
      answer: ans,
      wrong: [[w[0], 'The decimal points must line up. Write the rope length with a zero to make hundredths.'], [w[1], 'Where the top digit is smaller, regroup. Do not take the smaller digit from the bigger one.'], [w[2], 'The rope is cut, so take away.']],
      hints: ['Write both lengths with two decimal places.', 'Subtract with the decimal points lined up. Regroup when needed.'],
      steps: [`${a.toFixed(2)} − ${b.toFixed(2)}`, `= ${ans} m.`],
    }),
    check: ({ a, b }, v) => Math.round(v * 100) + Math.round(b * 100) === Math.round(a * 100) }),

  fam({ id: 'g5.decsub.spot', skill: 'G5_DECIMALS_SUB', outcome: 'G5.DEC.c', rung: 3, form: 'spot',
    draw: () => {
      const a = round(randInt(51, 99) / 10, 1), b = round(randInt(110, 390) / 100, 2);
      if (b * 100 % 10 === 0 || a <= b || a === Math.floor(a)) return null;
      const colAbs = (x, y) => { const X = String(Math.round(x * 100)).padStart(4, '0'), Y = String(Math.round(y * 100)).padStart(4, '0'); return Number([...X].map((d, i) => Math.abs(d - Y[i])).join('')) / 100; };
      const ans = round(a - b, 2);
      return colAbs(a, b) !== ans ? { a, b, ans, wrongRes: colAbs(a, b), k: randInt(0, 1), p: person() } : null;
    },
    make: ({ a, b, ans, wrongRes, k, p }) => {
      const A = k === 0 ? `${Math.floor(a)}.0${Math.round((a % 1) * 10)}` : a.toFixed(2), res = k === 1 ? wrongRes : round(Number(A) - b, 2);
      return {
        question: `${p.name} works out ${a} − ${b}. Which step has the mistake?`,
        working: [
          { text: `Write ${a} with two decimal places: ${A}`, ok: Number(A) === a },
          { text: `Subtract: ${A} − ${b.toFixed(2)} = ${res}`, ok: Math.abs(res - round(Number(A) - b, 2)) < 1e-9 },
          { text: `So the answer is ${res}.`, ok: true },
        ],
        fix: k === 0 ? `${a} has 1 decimal place. A zero is added at the end to make hundredths: ${a.toFixed(2)}. Here it was put in the wrong place.` : 'Where a top digit is smaller than the one below it, regroup from the next column. Here the smaller digit was taken from the bigger one.',
        hints: ['Check each step against the one before it.', 'Is the zero added at the end of the decimal? Are the columns regrouped?'],
        steps: [`${a} = ${a.toFixed(2)}.`, `${a.toFixed(2)} − ${b.toFixed(2)} = ${ans}.`],
      };
    } }),

  fam({ id: 'g5.decmul.word', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.e', rung: 2, form: 'word',
    draw: () => {
      const m = pick([10, 100, 1000]), a = round(randInt(11, 99) / 100, 2), thing = pick(['packets of seeds', 'tins of paint', 'bottles of juice']);
      if (a * 100 % 10 === 0) return null;
      const ans = round(a * m, 3);
      return distinct(ans, round(a * m * 10, 3), round(a * m / 10, 3), round(a + m, 2)) ? { m, a, thing, ans, p: person() } : null;
    },
    make: ({ m, a, thing, ans, p }) => {
      const unit = thing.startsWith('packets') ? 'kg' : 'litres', one = thing.startsWith('packets') ? 'packet of seeds has a mass of' : thing.startsWith('tins') ? 'tin of paint holds' : 'bottle of juice holds';
      return { question: `One ${one} ${a} ${unit}. ${p.name} buys ${commas(m)} ${thing}. How many ${unit} is that in all?`,
        answer: ans,
        wrong: [[round(a * m * 10, 3), `Multiplying by ${commas(m)} moves each digit ${String(m).length - 1} place${m === 10 ? '' : 's'} to the left. This moves it one place too many.`], [round(a * m / 10, 3), `Multiplying by ${commas(m)} moves each digit ${String(m).length - 1} place${m === 10 ? '' : 's'} to the left. This moves it too few.`], [round(a + m, 2), 'The packets are many equal parts, so multiply, not add.']],
        hints: [`${commas(m)} has ${String(m).length - 1} zero${m === 10 ? '' : 's'}. Each zero moves the digits one place to the left.`, 'Check that the answer is bigger than the amount of one.'],
        steps: [`${a} × ${commas(m)}: each digit moves ${String(m).length - 1} place${m === 10 ? '' : 's'} to the left.`, `${a} × ${commas(m)} = ${commas(ans)} ${unit}.`] };
    },
    check: ({ m, a }, v) => Math.round(v / m * 1000) / 1000 === a }),

  fam({ id: 'g5.decmul.table', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.e', rung: 2, form: 'table',
    draw: () => {
      const a = round(randInt(11, 99) / 100, 2);
      return a * 100 % 10 === 0 ? null : { a, p: person() };
    },
    make: ({ a, p }) => ({
      question: `${p.name} sells floor tiles. The table shows the mass of some tiles. How many kilograms do 1,000 tiles have?`,
      model: { type: 'table', data: { head: ['Number of tiles', 'Mass (kg)'], rows: [{ label: '1', value: String(a) }, { label: '10', value: String(round(a * 10, 3)) }, { label: '100', value: String(round(a * 100, 3)) }, { label: '1,000', value: '?' }] } },
      answer: round(a * 1000, 3),
      wrong: [[round(a * 100, 3), 'That is the mass of 100 tiles. 1,000 is ten times as many.'], [round(a * 1000 * 10, 3), 'Look at the pattern in the table. Each row moves the digits one place, no more.'], [round(a + 1000, 2), '1,000 tiles are 1,000 equal masses, so multiply the mass of one tile.']],
      hints: ['Look at how the mass changes from row to row.', 'Each time there are ten times as many tiles, the digits move one place to the left.'],
      steps: [`The mass of 100 tiles is ${round(a * 100, 3)} kg.`, `For 1,000 tiles, move the digits once more: ${round(a * 1000, 3)} kg.`],
    }),
    check: ({ a }, v) => Math.round(v) === Math.round(a * 1000) }),

  fam({ id: 'g5.decmul.why', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.e', rung: 3, form: 'why',
    draw: () => { const m = pick([10, 100, 1000]), a = round(randInt(11, 99) / 100, 2), z = String(m).length - 1; return a * 100 % 10 === 0 ? null : { m, a, z, k: randInt(0, 3), p: person() }; },
    make: ({ m, a, z, k, p }) => {
      const wrongAns = a + '0'.repeat(z);
      const opts = [
        { text: `Multiplying by ${commas(m)} makes the number ${commas(m)} times bigger. Each digit moves ${z} place${z > 1 ? 's' : ''} to the left`, right: true },
        { text: `The decimal point stays, and ${z} zero${z > 1 ? 's are' : ' is'} added at the end, because zeros show multiplying`, right: false, why: `Zeros added at the end of a decimal do not change its value. ${a} × ${commas(m)} is bigger than ${a}.` },
        { text: 'The answer is the same, because multiplying a decimal does not change it', right: false, why: 'Multiplying by a number bigger than 1 makes the answer bigger.' },
        { text: `The digits move ${z} place${z > 1 ? 's' : ''} to the right, because decimals are small`, right: false, why: 'Moving digits to the right makes the number smaller. Multiplying by 10, 100 or 1,000 makes it bigger.' },
      ];
      return { question: `${p.name} writes ${a} × ${commas(m)} = ${wrongAns}. Which reason shows this is wrong, and what is the right method?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Is the answer bigger or smaller than the number you started with?', `Each zero in ${commas(m)} moves the digits one place.`],
        steps: [`${commas(m)} has ${z} zero${z > 1 ? 's' : ''}, so the digits move ${z} place${z > 1 ? 's' : ''} to the left.`, `${a} × ${commas(m)} = ${commas(round(a * m, 3))}.`] };
    } }),

  fam({ id: 'g5.decmul.steps', skill: 'G5_DECIMALS_INTRO', outcome: 'G5.DEC.e', rung: 2, form: 'steps',
    draw: () => { const a = round(randInt(11, 99) / 100, 2); return a * 100 % 10 === 0 ? null : { a, p: person() }; },
    make: ({ a, p }) => ({
      question: `Each bottle of oil holds ${a} litres. ${p.name} fills 10 bottles, then 100 bottles, then 1,000 bottles. Find the number of litres each time.`,
      parts: [
        { prompt: 'How many litres are in 10 bottles?', answer: round(a * 10, 3), unit: 'litres', hint: 'Each digit moves one place to the left.', wrong: [[round(a * 100, 3), '10 has one zero. Move the digits one place only.'], [round(a + 10, 2), '10 equal bottles means multiply.']] },
        { prompt: 'How many litres are in 100 bottles?', answer: round(a * 100, 3), unit: 'litres', hint: 'Each digit moves two places to the left.', wrong: [[round(a * 10, 3), '100 has two zeros. Move the digits two places.'], [round(a * 1000, 3), '100 has two zeros. Move the digits two places only.']] },
        { prompt: 'How many litres are in 1,000 bottles?', answer: round(a * 1000, 3), unit: 'litres', hint: 'Each digit moves three places to the left.', wrong: [[round(a * 100, 3), '1,000 has three zeros. Move the digits three places.'], [round(a * 10000, 3), '1,000 has three zeros. Move the digits three places only.']] },
      ],
      steps: [`10 bottles: ${a} × 10 = ${round(a * 10, 3)} litres.`, `100 bottles: ${a} × 100 = ${round(a * 100, 3)} litres.`, `1,000 bottles: ${a} × 1,000 = ${commas(round(a * 1000, 3))} litres.`],
    }),
    check: ({ a }, v) => Math.round(v[0] * 10) === Math.round(v[1]) && Math.round(v[1] * 10) === Math.round(v[2]) && Math.round(v[0] * 100) === Math.round(a * 1000) }),

  // ================================================================ PATTERNS
  fam({ id: 'g5.pat.add-word', skill: 'G5_PATTERNS', outcome: 'G5.ADD.d', rung: 2, form: 'word',
    draw: () => { const a = randInt(5, 30), d = randInt(3, 9), n = randInt(6, 12); return distinct(a + d * (n - 1), a + d * n, d * n, a + d) ? { a, d, n, thing: pick(['seedlings', 'cabbages', 'banana suckers']), p: person() } : null; },
    make: ({ a, d, n, thing, p }) => ({
      question: `${p.name} plants ${thing} in rows that follow a pattern. Row 1 has ${a} ${thing}. Each next row has ${d} more ${thing} than the row before. How many ${thing} are in row ${n}?`,
      answer: a + d * (n - 1),
      wrong: [[a + d * n, `Row 1 already has ${a}. From row 1 to row ${n} there are ${n - 1} steps, not ${n}.`], [d * n, `The first row starts with ${a}, not with ${d}. Start from it.`], [a + d, `That is row 2. Keep adding ${d} for each row up to row ${n}.`]],
      hints: ['How many times is the same number added to get from row 1 to the row asked for?', 'Start at the first row and add that many times.'],
      steps: [`From row 1 to row ${n} the rule is used ${n - 1} times.`, `${a} + ${n - 1} × ${d} = ${a + d * (n - 1)}.`],
    }),
    check: ({ a, d, n }, v) => (v - a) / (n - 1) === d }),

  fam({ id: 'g5.pat.add-spot', skill: 'G5_PATTERNS', outcome: 'G5.ADD.d', rung: 3, form: 'spot',
    draw: () => { const a = randInt(4, 30), d = randInt(3, 9); return { a, d, k: randInt(0, 2), p: person() }; },
    make: ({ a, d, k, p }) => {
      const seq = [0, 1, 2, 3].map(i => a + d * i), last = seq[3], r = k === 0 ? d + 1 : d, x = k === 1 ? last + r + 1 : last + r, y = k === 2 ? x + r + 1 : x + r;
      return {
        question: `${p.name} continues this pattern: ${seq.join(', ')}. ${p.She} wants the next two numbers. Which step has the mistake?`,
        working: [
          { text: `The rule: each number is ${r} more than the one before.`, ok: r === d },
          { text: `The next number: ${last} + ${r} = ${x}`, ok: x === last + r },
          { text: `The number after that: ${x} + ${r} = ${y}`, ok: y === x + r },
        ],
        fix: k === 0 ? `Each number is ${d} more than the one before. Check: ${seq[1]} − ${seq[0]} = ${d}.` : 'The sum in this step is not right. Add again carefully.',
        hints: ['Check each step against the one before it.', 'Find how much each number grows by, and test it on the numbers shown.'],
        steps: [`${seq[1]} − ${seq[0]} = ${d}, so the rule is add ${d}.`, `${last} + ${d} = ${last + d}, and ${last + d} + ${d} = ${last + 2 * d}.`],
      };
    } }),

  fam({ id: 'g5.pat.sub-word', skill: 'G5_PATTERNS', outcome: 'G5.SUB.e', rung: 2, form: 'word',
    draw: () => {
      const a = randInt(60, 90) * 10, d = pick([30, 40, 50, 60, 70]), n = randInt(6, 9), v = a - d * (n - 1);
      return v > 0 && distinct(v, a - d * n, a - d * (n - 2), d * (n - 1)) ? { a, d, n, v } : null;
    },
    make: ({ a, d, n, v }) => ({
      question: `A tank had ${commas(a)} litres on Monday, ${commas(a - d)} litres on Tuesday and ${commas(a - 2 * d)} litres on Wednesday. The amounts keep to this pattern. Day 1 is Monday. How many litres are in the tank on day ${n}?`,
      answer: v,
      wrong: [[a - d * n, `From day 1 to day ${n} there are ${n - 1} steps, not ${n}.`], [a - d * (n - 2), `That is day ${n - 1}. Take away one more step.`], [d * (n - 1), 'That is the water that has gone. The question asks what is in the tank.']],
      hints: ['How much does the amount fall each day?', 'How many times does it fall between day 1 and the day asked for?'],
      steps: [`${commas(a)} − ${commas(a - d)} = ${d}, so it falls by ${d} each day.`, `${commas(a)} − ${n - 1} × ${d} = ${commas(v)}.`],
    }),
    check: ({ a, d, n }, x) => (a - x) / (n - 1) === d }),

  fam({ id: 'g5.pat.mul-word', skill: 'G5_PATTERNS', outcome: 'G5.MUL.c', rung: 2, form: 'word',
    draw: () => {
      const a = randInt(2, 5), r = pick([2, 3]), n = pick([4, 5, 6]), v = a * r ** (n - 1);
      return distinct(v, a * r ** n, a * r * (n - 1), a + r * (n - 1)) ? { a, r, n, v, p: person() } : null;
    },
    make: ({ a, r, n, v, p }) => ({
      question: `${p.name}'s pumpkin patch follows a pattern. In week 1 there are ${a} pumpkins. Each next week the number is ${r === 2 ? 'doubled' : 'multiplied by 3'}. How many pumpkins are there in week ${n}?`,
      answer: v,
      wrong: [[a * r ** n, `From week 1 to week ${n} there are ${n - 1} steps, not ${n}.`], [a * r * (n - 1), `The number is multiplied by ${r} again and again, not just added up.`], [a + r * (n - 1), 'The rule is multiplying, not adding.']],
      hints: ['Write the numbers for week 1, week 2 and week 3 first.', 'Multiply each number by the same amount to get the next.'],
      steps: [`Week 1: ${a}. Each week × ${r}.`, `${Array.from({ length: n }, (_, i) => a * r ** i).join(', ')}.`, `Week ${n}: ${v}.`],
    }),
    check: ({ a, r, n }, x) => x === Array.from({ length: n - 1 }).reduce((t) => t * r, a) }),

  fam({ id: 'g5.pat.mul-why', skill: 'G5_PATTERNS', outcome: 'G5.MUL.c', rung: 3, form: 'why',
    draw: () => {
      const a = pick([3, 4, 5, 6]), r = pick([2, 3, 4]), k = randInt(0, 3);
      const t = [a, a * r, a * r * r, a * r ** 3];
      return distinct(a * r - a, r + 1, r, a) ? { a, r, t, k } : null;
    },
    make: ({ a, r, t, k }) => {
      const opts = [
        { text: `Start at ${a} and multiply by ${r} each time: ${t[0]} × ${r} = ${t[1]}, ${t[1]} × ${r} = ${t[2]}`, right: true },
        { text: `Start at ${a} and add ${t[1] - t[0]} each time`, right: false, why: `${t[1]} + ${t[1] - t[0]} = ${2 * t[1] - t[0]}, not ${t[2]}.` },
        { text: `Start at ${a} and add ${r} each time`, right: false, why: `${t[0]} + ${r} = ${a + r}, not ${t[1]}.` },
        { text: `Start at ${a} and multiply by ${r + 1} each time`, right: false, why: `${t[0]} × ${r + 1} = ${a * (r + 1)}, not ${t[1]}.` },
      ];
      return { question: `Which rule makes this pattern: ${t.join(', ')}?`, story: false, instruction: 'Choose the rule and its reason.', options: rot(opts, k),
        hints: ['Test each rule on the first two numbers.', 'A rule must work for every step.'],
        steps: [`${t[1]} ÷ ${t[0]} = ${r}, and ${t[2]} ÷ ${t[1]} = ${r}.`, `The pattern multiplies by ${r} each time.`] };
    } }),

  // ================================================================ ROUNDING
  fam({ id: 'g5.round.news-word', skill: 'G5_ROUNDING', outcome: 'G5.WHOLE.d', rung: 2, form: 'word',
    draw: () => {
      const u = pick([100, 1000]), n = randInt(12000, 98000) + randInt(1, 9) * 10 + randInt(0, 9);
      const r = rnd(n, u), u2 = u === 100 ? 1000 : 100;
      return n % u === 0 || n % u === u / 2 || new Set([fl(n, u), fl(n, u) + u, rnd(n, u2), rnd(n, u * 10)].filter(v => v !== r)).size < 3 ? null : { n, u, r, u2, s: pick([0, 1]) };
    },
    make: ({ n, u, r, u2, s }) => {
      const unit = u === 100 ? 'hundred' : 'thousand', unit2 = u === 100 ? 'thousand' : 'hundred';
      const st = [`A bus company carried ${commas(n)} passengers in a year. A newspaper gives the number to the nearest ${unit}.`, `A county sold ${commas(n)} kg of tea. The report gives the amount to the nearest ${unit}.`];
      return { question: `${st[s]} What number does it give?`,
        answer: r,
        wrong: [[fl(n, u), `The digit after the ${unit}s place is 5 or more here, so the number rounds up.`], [fl(n, u) + u, 'Look at the digit after the rounding place. If it is less than 5, round down.'], [rnd(n, u2), `The question says the nearest ${unit}, not the nearest ${unit2}.`], [rnd(n, u * 10), `The question says the nearest ${unit}. This rounds to a bigger place.`]].filter(([v]) => v !== r),
        hints: [`Find the ${unit}s place.`, 'Look at the next digit to the right. If it is 5 or more, round up.'],
        steps: [`The ${unit}s place and the digit after it decide the rounding.`, `${commas(n)} rounds to ${commas(r)}.`] };
    },
    check: ({ n, u }, a) => a % u === 0 && Math.abs(a - n) < u / 2 }),

  fam({ id: 'g5.round.crowd-table', skill: 'G5_ROUNDING', outcome: 'G5.WHOLE.d', rung: 2, form: 'table',
    draw: () => {
      const v = [0, 1, 2, 3].map(() => randInt(11, 59) * 1000 + randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(0, 9));
      const big = Math.max(...v), sm = Math.min(...v);
      return v.every(x => x % 1000 !== 500 && x % 100 !== 0) && distinct(rnd(big, 1000), fl(big, 1000), rnd(big, 100), rnd(sm, 1000)) && new Set(v).size === 4 && big % 1000 !== 500 ? { v, big, sm } : null;
    },
    make: ({ v, big, sm }) => ({
      question: 'The table shows the crowds at four football matches. A newspaper prints each crowd to the nearest thousand. What does it print for the biggest crowd?',
      model: { type: 'table', data: { head: ['Match', 'Crowd'], rows: v.map((x, i) => ({ label: `Match ${i + 1}`, value: commas(x) })) } },
      answer: rnd(big, 1000),
      wrong: [[fl(big, 1000), 'Check the hundreds digit. It decides whether to round up or down.'], [rnd(big, 100), 'The question says the nearest thousand, not the nearest hundred.'], [rnd(sm, 1000), 'That is the smallest crowd. The question asks about the biggest.']].filter(([x]) => x !== rnd(big, 1000)),
      hints: ['Find the biggest crowd in the table first.', 'Look at the hundreds digit to round to the nearest thousand.'],
      steps: [`The biggest crowd is ${commas(big)}.`, `To the nearest thousand it is ${commas(rnd(big, 1000))}.`],
    }),
    check: ({ big }, a) => a % 1000 === 0 && Math.abs(a - big) < 500 }),

  fam({ id: 'g5.round.spot', skill: 'G5_ROUNDING', outcome: 'G5.WHOLE.d', rung: 3, form: 'spot',
    draw: () => {
      const n = randInt(12, 98) * 1000 + randInt(0, 9) * 100 + randInt(5, 9) * 10 + randInt(0, 4), k = randInt(0, 1);
      return { n, k, p: person() };
    },
    make: ({ n, k, p }) => {
      const H = Math.floor(n / 100) % 10, T = Math.floor(n / 10) % 10, O = n % 10;
      const shownD = k === 0 ? O : T, up = k === 1 ? false : shownD >= 5, res = up ? fl(n, 100) + 100 : fl(n, 100);
      return {
        question: `${p.name} rounds ${commas(n)} to the nearest hundred. Which step has the mistake?`,
        working: [
          { text: `The hundreds digit is ${H}.`, ok: true },
          { text: `The digit next to it, on the right, is ${shownD}.`, ok: shownD === T },
          { text: `${shownD} is ${up ? '5 or more, so round up' : 'less than 5, so round down'}.`, ok: up === (shownD >= 5) },
          { text: `${commas(n)} rounds to ${commas(res)}.`, ok: true },
        ],
        fix: k === 0 ? `The digit just to the right of the hundreds place is the tens digit, ${T}, not the ones digit.` : `${T} is 5 or more, so the hundreds digit goes up by one.`,
        hints: ['Find the digit just to the right of the hundreds place.', 'If it is 5 or more round up, if less round down.'],
        steps: [`The tens digit is ${T}, which is 5 or more, so round up.`, `${commas(n)} rounds to ${commas(fl(n, 100) + 100)}.`],
      };
    } }),

  // ================================================================ LENGTH
  fam({ id: 'g5.length.est-route', skill: 'G5_LENGTH', outcome: 'G5.LENGTH.b', rung: 2, form: 'word',
    draw: () => {
      const pairs = [['Nairobi', 'Nakuru', 160, 80], ['Nairobi', 'Mombasa', 480, 60], ['Nairobi', 'Kisumu', 350, 50], ['Nairobi', 'Eldoret', 310, 62], ['Nairobi', 'Machakos', 60, 60], ['Nakuru', 'Eldoret', 155, 62]];
      const [a, b, km] = pick([['Nairobi', 'Nakuru', 160], ['Nairobi', 'Mombasa', 480], ['Nairobi', 'Kisumu', 350], ['Mombasa', 'Malindi', 120], ['Eldoret', 'Kitale', 70]]);
      void pairs;
      const sp = pick([50, 60, 80]);
      return km % sp === 0 && km / sp >= 2 ? { a, b, km, sp, h: km / sp } : null;
    },
    make: ({ a, b, km, sp, h }) => ({
      question: `A matatu from ${a} to ${b} travels at about ${sp} km every hour. The journey takes about ${h} hours. Estimate the distance between ${a} and ${b} by road, in kilometres.`,
      answer: km,
      wrong: [[sp + h, 'Distance is speed times time. Do not add them.'], [sp / h, 'Distance is found by multiplying the speed by the time.'], [km + sp, 'Each hour covers a set distance. Multiply it by the number of hours.']],
      hints: ['In one hour the matatu travels the same distance.', 'How many hours does it travel?'],
      steps: [`In 1 hour: ${sp} km. The journey takes ${h} hours.`, `${sp} × ${h} = ${km} km.`],
    }),
    check: ({ sp, h }, a) => a / h === sp }),

  fam({ id: 'g5.length.est-trip-table', skill: 'G5_LENGTH', outcome: 'G5.LENGTH.b', rung: 2, form: 'table',
    draw: () => {
      const rows = [['Thika', 45], ['Nakuru', 160], ['Nyeri', 150], ['Eldoret', 310], ['Kisumu', 350], ['Mombasa', 480], ['Garissa', 370]];
      const [town, km] = pick(rows);
      return km % 100 === 50 || km < 100 || km % 100 === 0 ? null : { rows: rows.filter(r => r[1] % 100 !== 50).slice(0, 5).concat([[town, km]]).filter((r, i, a) => a.findIndex(q => q[0] === r[0]) === i), town, km, r: rnd(km, 100) };
    },
    make: ({ rows, town, km, r }) => ({
      question: `The table shows road distances from Nairobi, in kilometres. Estimate the total distance of a trip from Nairobi to ${town} and back. Round the one-way distance to the nearest 100 km first.`,
      model: { type: 'table', data: { head: ['Town', 'Distance from Nairobi (km)'], rows: rows.map(([t, d]) => ({ label: t, value: String(d) })) } },
      answer: 2 * r,
      wrong: [[r, 'The trip goes there and back. Count both ways.'], [2 * km, 'That is the exact total. The question asks for an estimate with the distance rounded first.'], [km, 'That is one way, and it is not rounded.']],
      hints: ['Find the town in the table and round its distance.', 'A trip there and back covers the distance twice.'],
      steps: [`${km} km is about ${r} km.`, `There and back: 2 × ${r} = ${2 * r} km.`],
    }),
    check: ({ km }, a) => a % 200 === 0 && Math.abs(a / 2 - km) < 50 }),

  // ================================================================ MASS AND CAPACITY
  fam({ id: 'g5.mass.shop-left', skill: 'G5_MASS_OPS', outcome: 'G5.MASS.d', rung: 2, form: 'word',
    draw: () => {
      const a = randInt(3, 9), pk = pick([250, 500]), n = randInt(3, 12), left = a * 1000 - pk * n;
      return left > 0 && distinct(left, a * 100 - pk * n, pk * n, a * 1000 + pk * n) ? { a, pk, n, left, p: person() } : null;
    },
    make: ({ a, pk, n, left, p }) => ({
      question: `${p.name} has ${a} kg of sugar in a shop. ${p.She} sells ${n} packets of ${pk} g each. How many grams of sugar are left?`,
      answer: left,
      wrong: [[a * 100 - pk * n, '1 kg is 1,000 g. Change the kilograms to grams first.'], [pk * n, 'That is the sugar sold. The question asks what is left.'], [a * 1000 + pk * n, 'Selling takes sugar away, so subtract.']],
      hints: ['Change the kilograms to grams first.', 'Find the grams in all the packets, then take them away.'],
      steps: [`${a} kg = ${commas(a * 1000)} g. Sold: ${n} × ${pk} = ${commas(n * pk)} g.`, `Left: ${commas(a * 1000)} − ${commas(n * pk)} = ${commas(left)} g.`],
    }),
    check: ({ a, pk, n }, v) => v + pk * n === a * 1000 }),

  fam({ id: 'g5.mass.parcels-table', skill: 'G5_MASS_OPS', outcome: 'G5.MASS.d', rung: 2, form: 'table',
    draw: () => {
      const g1 = pick([250, 500, 750, 1250, 1500]), k2 = randInt(1, 4), g3 = pick([250, 500, 750, 1250]), total = g1 + k2 * 1000 + g3;
      return distinct(total / 1000, g1 + k2 + g3, total / 100, (g1 + g3) / 1000 + k2 * 10) ? { g1, k2, g3, total } : null;
    },
    make: ({ g1, k2, g3, total }) => ({
      question: 'The table shows the mass of three parcels. Find the total mass of the three parcels in kilograms.',
      model: { type: 'table', data: { head: ['Parcel', 'Mass'], rows: [{ label: 'Parcel A', value: `${commas(g1)} g` }, { label: 'Parcel B', value: `${k2} kg` }, { label: 'Parcel C', value: `${commas(g3)} g` }] } },
      answer: total / 1000,
      wrong: [[g1 + k2 + g3, 'The masses are in different units. Change them to the same unit first.'], [total / 100, '1 kg is 1,000 g, not 100 g.'], [(g1 + g3) / 1000 + k2 * 10, '1 kg is 1,000 g. Check how many kilograms the parcel in kg has.']],
      hints: ['Change every mass to grams, or every mass to kilograms.', 'Add them, then give the answer in kilograms.'],
      steps: [`${commas(g1)} g + ${k2 * 1000} g + ${commas(g3)} g = ${commas(total)} g.`, `${commas(total)} g = ${total / 1000} kg.`],
    }),
    check: ({ g1, k2, g3 }, a) => Math.round(a * 1000) - g1 - g3 === k2 * 1000 }),

  fam({ id: 'g5.mass.written-why', skill: 'G5_MASS', outcome: 'G5.MASS.d', rung: 3, form: 'why',
    draw: () => { const kg = randInt(2, 9), g = pick([20, 30, 40, 50, 60, 70, 80]), k = randInt(0, 3); return { kg, g, k, p: person() }; },
    make: ({ kg, g, k, p }) => {
      const claim = `${kg}.${g / 10}`, right = `${kg}.0${g / 10}`;
      const opts = [
        { text: `1 kg is 1,000 g, so ${g} g is ${g / 1000} kg. The mass is ${right} kg`, right: true },
        { text: `1 kg is 100 g, so ${g} g is ${g / 100} kg. The mass is ${claim} kg`, right: false, why: '1 kg is 1,000 g, not 100 g.' },
        { text: `The grams are written just as they are after the point, so the mass is ${kg}.${g} kg`, right: false, why: 'The grams must be written as a part of 1,000 g, with the digits in their right places.' },
        { text: `The grams cannot be changed into kilograms, so the mass stays ${kg} kg ${g} g`, right: false, why: 'Grams can be changed into kilograms. 1,000 g make 1 kg.' },
      ];
      return { question: `${p.name} writes ${kg} kg ${g} g as ${claim} kg. Which reason shows what is wrong, and gives the right mass?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['How many grams are there in 1 kg?', 'Write the grams as a part of a kilogram, in thousandths.'],
        steps: [`${g} g = ${g} ÷ 1,000 = ${g / 1000} kg.`, `${kg} kg ${g} g = ${right} kg.`] };
    } }),

  fam({ id: 'g5.cap.dairy-left', skill: 'G5_CAPACITY_OPS', outcome: 'G5.CAP.d', rung: 3, form: 'word',
    draw: () => {
      const a = randInt(8, 30), pk = pick([250, 500]), n = randInt(4, 16), used = pk * n, left = a * 1000 - used;
      return left > 0 && used % 250 === 0 && distinct(left / 1000, a - n * pk / 100, used / 1000, a + used / 1000) ? { a, pk, n, left, p: person() } : null;
    },
    make: ({ a, pk, n, left, p }) => ({
      question: `A dairy has ${a} litres of milk. ${p.name} fills ${n} packets of ${pk} ml each. How many litres of milk are left?`,
      answer: left / 1000,
      wrong: [[a - n * pk / 100, '1 litre is 1,000 ml, not 100 ml.'], [n * pk / 1000, 'That is the milk put in the packets. The question asks what is left.'], [a + n * pk / 1000, 'Filling packets takes milk away, so subtract.']],
      hints: ['Find the millilitres in all the packets, then change them to litres.', 'Take that amount from the litres the dairy has.'],
      steps: [`${n} × ${pk} = ${commas(n * pk)} ml = ${n * pk / 1000} litres.`, `Left: ${a} − ${n * pk / 1000} = ${left / 1000} litres.`],
    }),
    check: ({ a, pk, n }, v) => Math.round((v + a - a) * 1000) + pk * n === a * 1000 }),

  fam({ id: 'g5.cap.drums-table', skill: 'G5_CAPACITY_OPS', outcome: 'G5.CAP.d', rung: 2, form: 'table',
    draw: () => {
      const l1 = randInt(2, 9), ml1 = pick([250, 500, 750]), l2 = randInt(1, 6), ml2 = pick([250, 500, 750]);
      const t = l1 * 1000 + ml1 + l2 * 1000 + ml2;
      return distinct(t / 1000, l1 + l2 + ml1 + ml2, t / 100) ? { l1, ml1, l2, ml2, t } : null;
    },
    make: ({ l1, ml1, l2, ml2, t }) => ({
      question: 'The table shows the water in two drums. All the water is poured into one big tank. How many millilitres of water are in the tank?',
      model: { type: 'table', data: { head: ['Drum', 'Water'], rows: [{ label: 'Drum A', value: `${l1} l ${ml1} ml` }, { label: 'Drum B', value: `${l2} l ${ml2} ml` }] } },
      answer: t,
      wrong: [[l1 + l2 + ml1 + ml2, 'Litres and millilitres are different units. Change the litres to millilitres.'], [(l1 + l2) * 100 + ml1 + ml2, '1 litre is 1,000 ml, not 100 ml.'], [(l1 + l2) * 1000, 'The millilitres in the drums have been left out.']],
      hints: ['Change each amount to millilitres.', 'Add the two amounts.'],
      steps: [`Drum A: ${l1} l ${ml1} ml = ${commas(l1 * 1000 + ml1)} ml. Drum B: ${l2} l ${ml2} ml = ${commas(l2 * 1000 + ml2)} ml.`, `Total: ${commas(t)} ml.`],
    }),
    check: ({ l1, ml1, l2, ml2 }, a) => a - ml1 - ml2 === (l1 + l2) * 1000 }),

  fam({ id: 'g5.cap.cups-word', skill: 'G5_CAPACITY', outcome: 'G5.CAP.d', rung: 2, form: 'word',
    draw: () => { const cup = pick([200, 250, 500]), n = randInt(4, 16), l = (cup * n) / 1000; return Number.isInteger(l * 2) && l >= 1 && distinct(n, l, n * cup, cup) ? { cup, n, l, p: person() } : null; },
    make: ({ cup, n, l, p }) => ({
      question: `${p.name} pours milk from a ${l} litre jug into cups. Each cup holds ${cup} ml. How many cups can ${p.she} fill?`,
      answer: n,
      wrong: [[(l * 100) / cup, '1 litre is 1,000 ml, not 100 ml.'], [l * cup, 'The jug is shared out into cups, so divide, not multiply.'], [l * 1000 - cup, 'That takes one cup away from the millilitres in the jug. Count how many cups fit.']],
      hints: ['Change the litres to millilitres first.', 'How many cups of that size fit into the jug?'],
      steps: [`${l} litres = ${commas(l * 1000)} ml.`, `${commas(l * 1000)} ÷ ${cup} = ${n} cups.`],
    }),
    check: ({ cup, l }, a) => a * cup === l * 1000 }),

  fam({ id: 'g5.cap.sensible-why', skill: 'G5_CAPACITY', outcome: 'G5.CAP.d', rung: 2, form: 'why',
    draw: () => {
      const items = [['a bucket of drinking water', '10 litres', '10 ml', '10,000 litres', 'A bucket holds about 10 litres, and 10 ml is only two teaspoons.'], ['a small cup of tea', '200 millilitres', '200 litres', '2 millilitres', 'A cup holds about 200 ml. 200 litres would fill a big drum.'], ['a jerrican of cooking oil', '20 litres', '20 ml', '2,000 litres', 'A jerrican holds about 20 litres, as much as two buckets.']];
      return { it: pick(items), k: randInt(0, 3), p: person() };
    },
    make: ({ it, k, p }) => {
      const opts = [
        { text: `${it[1]}, because it is about the amount that ${it[0]} holds`, right: true },
        { text: `${it[2]}, because small units are always right`, right: false, why: it[4] },
        { text: `${it[3]}, because a big number means a big container`, right: false, why: it[4] },
        { text: 'Any of them, because litres and millilitres are the same', right: false, why: '1 litre is 1,000 ml. They are not the same size.' },
      ];
      return { question: `${p.name} wants to say how much ${it[0]} holds. Which amount is sensible, and why?`, instruction: 'Choose the best reason.', options: rot(opts, k),
        hints: ['Picture the container. Is it as big as a bucket or as small as a spoon?', '1 litre is 1,000 millilitres.'],
        steps: [`${it[0]} holds about ${it[1]}.`, it[4]] };
    } }),

  // ================================================================ FRACTIONS
  fam({ id: 'g5.frac.sub-word', skill: 'G5_FRACTIONS_SUB_LIKE', outcome: 'G5.FRAC.d', rung: 2, form: 'word',
    draw: () => { const d = pick([5, 6, 8, 10, 12]), a = randInt(d - 3, d - 1), b = randInt(1, a - 1); return a - b > 0 && distinct(a - b, a + b, a, d) ? { d, a, b, p: person() } : null; },
    make: ({ d, a, b, p }) => ({
      question: `A tank is ${a}/${d} full of water. ${p.name} uses ${b}/${d} of a tank for the garden. The rest stays in the tank. How many ${d === 5 ? 'fifths' : d === 6 ? 'sixths' : d === 8 ? 'eighths' : d === 10 ? 'tenths' : 'twelfths'} of the tank are still full?`,
      answer: a - b,
      wrong: [[a + b, 'Using water takes it away, so subtract.'], [a, 'That is the amount at the start. Some has been used.'], [d - b, `The tank was not full at the start. It had ${a}/${d}.`]].filter(([v]) => v !== a - b),
      hints: ['The parts are all the same size, so take the fractions away like numbers.', 'The size of the part stays the same.'],
      steps: [`${a}/${d} − ${b}/${d}: the denominators are the same.`, `${a} − ${b} = ${a - b}, so ${a - b}/${d} of the tank.`],
    }),
    check: ({ a, b }, v) => v + b === a }),

  fam({ id: 'g5.frac.sub-spot', skill: 'G5_FRACTIONS_SUB_LIKE', outcome: 'G5.FRAC.d', rung: 3, form: 'spot',
    draw: () => { const d = pick([6, 8, 9, 10, 12]), a = randInt(4, d - 1), b = randInt(1, a - 1); return a - b > 0 && distinct(a - b, a + b, d - b) ? { d, a, b, k: randInt(0, 1), p: person() } : null; },
    make: ({ d, a, b, k, p }) => {
      const num = k === 0 ? a + b : a - b, den = k === 1 ? d - b : d;
      return {
        question: `${p.name} works out ${a}/${d} − ${b}/${d}. Which step has the mistake?`,
        working: [
          { text: `Both fractions have the denominator ${d}.`, ok: true },
          { text: `Numerators: ${a} ${k === 0 ? '+' : '−'} ${b} = ${num}`, ok: num === a - b },
          { text: `Denominator: ${k === 1 ? `${d} − ${b} = ${den}` : `stays ${d}`}`, ok: den === d },
          { text: `So the answer is ${num}/${den}.`, ok: true },
        ],
        fix: k === 0 ? 'Subtracting fractions takes the numerators away. Here they were added.' : 'The denominator tells the size of the parts. It does not change when fractions with the same denominator are subtracted.',
        hints: ['Check each step against the one before it.', 'Which parts change when like fractions are subtracted: the number of parts or their size?'],
        steps: [`${a} − ${b} = ${a - b}.`, `The denominator stays ${d}: ${a - b}/${d}.`],
      };
    } }),

  fam({ id: 'g5.frac.add-word', skill: 'G5_FRACTIONS_ADD_LIKE', outcome: 'G5.FRAC.d', rung: 2, form: 'word',
    draw: () => { const d = pick([8, 10, 12]), a = randInt(2, 5), b = randInt(2, 5), c = randInt(1, 3); return a + b + c < d && distinct(a + b + c, a + b, d - a - b - c) ? { d, a, b, c, p: person() } : null; },
    make: ({ d, a, b, c, p }) => {
      const nm = { 8: 'eighths', 10: 'tenths', 12: 'twelfths' }[d];
      return { question: `A chapati is cut into ${d} equal parts. ${p.name} eats ${a}/${d} for breakfast, ${b}/${d} for lunch and ${c}/${d} for supper. How many ${nm} of the chapati did ${p.she} eat in all?`,
        answer: a + b + c,
        wrong: [[a + b, 'There are three meals. Add all three fractions.'], [d - a - b - c, 'That is the part that is left. The question asks for the part eaten.'], [(a + b + c) * d, 'The size of the part does not change when like fractions are added.']],
        hints: ['All the parts are the same size, so add the numerators.', 'Count all three meals.'],
        steps: [`${a}/${d} + ${b}/${d} + ${c}/${d}: the denominators are the same.`, `${a} + ${b} + ${c} = ${a + b + c}, so ${a + b + c}/${d}.`] };
    },
    check: ({ a, b, c }, v) => v - c - b === a }),

  fam({ id: 'g5.frac.equiv-word', skill: 'G5_FRACTIONS_EQUIV', outcome: 'G5.FRAC.a', rung: 2, form: 'word',
    draw: () => { const d1 = pick([2, 3, 4, 5]), n1 = randInt(1, d1 - 1), m = randInt(2, 6); return distinct(n1 * m, n1 + m, d1 * m) ? { d1, n1, m, p: person(), q: person() } : null; },
    make: ({ d1, n1, m, p }) => ({
      question: `${p.name} cuts a mandazi into ${d1} equal pieces and eats ${n1} of them. ${p.Her} friend cuts an equal mandazi into ${d1 * m} equal pieces. The two children eat equivalent fractions. How many of the smaller pieces does the friend eat?`,
      answer: n1 * m,
      wrong: [[n1 + m, 'Both numbers must be multiplied, not added to, to keep the fraction equal.'], [n1, `There are ${m} times as many pieces, so ${m} times as many are eaten.`], [d1 * m - n1, 'That is the number of pieces not eaten.']],
      hints: ['How many times more pieces are there in the second mandazi?', 'Eat the same number of times more pieces.'],
      steps: [`${n1}/${d1} = ?/${d1 * m}. The bottom is multiplied by ${m}.`, `Multiply the top by ${m} too: ${n1} × ${m} = ${n1 * m}.`],
    }),
    check: ({ d1, n1, m }, a) => a * d1 === n1 * d1 * m }),

  fam({ id: 'g5.frac.simplify-spot', skill: 'G5_FRACTIONS_EQUIV', outcome: 'G5.FRAC.a', rung: 3, form: 'spot',
    draw: () => { const g = pick([2, 3, 4, 5, 6]), n = pick([1, 2, 3, 5, 7]), d = pick([4, 5, 7, 9, 11]); return n < d && n * g !== d * g && new Set([n, d]).size === 2 && gcd(n, d) === 1 ? { g, n, d, k: randInt(0, 1), p: person() } : null; },
    make: ({ g, n, d, k, p }) => {
      const top = n * g, bot = d * g, top2 = k === 1 ? n + 1 : n, bot2 = k === 0 ? d + 1 : d;
      return {
        question: `${p.name} writes ${top}/${bot} in its simplest form. Which step has the mistake?`,
        working: [
          { text: `${top} and ${bot} can both be divided by ${g}.`, ok: top % g === 0 && bot % g === 0 },
          { text: `Top: ${top} ÷ ${g} = ${top2}`, ok: top / g === top2 },
          { text: `Bottom: ${bot} ÷ ${g} = ${bot2}`, ok: bot / g === bot2 },
          { text: `So ${top}/${bot} = ${top2}/${bot2}.`, ok: true },
        ],
        fix: k === 0 ? `${bot} ÷ ${g} = ${d}, not ${bot2}. Check the division.` : `${top} ÷ ${g} = ${n}, not ${top2}. Check the division.`,
        hints: ['Check each division on its own.', 'Multiply your answer back by the number divided by to check it.'],
        steps: [`${top} ÷ ${g} = ${n}, ${bot} ÷ ${g} = ${d}.`, `${top}/${bot} = ${n}/${d}.`],
      };
    } }),

  // END
];
