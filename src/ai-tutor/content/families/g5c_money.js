// ============================================================================
// GRADE 5 MEASUREMENT: MONEY (9 skills): budgets, tax, banks, digital money, saving.
// Real shop prices come from kenya.js. No emojis, no brand names beyond what a child sees.
// ============================================================================
import { fam, randInt, pick, shuffle, commas, person, sh, price, mc, tbl } from './g5c_lib.js';

const Y = 'MEASUR.MONEY.';
const ask = (right, wrongs, q, hints, steps, instruction = 'Choose the best answer.') => { const options = mc(right, wrongs); return options ? { question: q, options, instruction, hints, steps } : null; };
const pool = (items, lead) => () => { const x = pick(items); return ask(x.r, x.w, `${lead(person())}${x.q}`, x.h || ['Think about what the words mean.', 'Check each choice against what you know.'], [x.s, `So: ${x.r}.`]); };
const spot = (stem, steps3, badIdx, fix, mis, hint) => ({ question: stem, working: steps3.map((text, i) => ({ text, ok: i !== badIdx })), fix, mis, hints: [hint], steps: [fix] });

export const FAMILIES = [
  // ---------------------------------------------------------------- BUDGET_MEANING
  fam({ id: 'g5c.mon.bm.which', cs: `${Y}BUDGET_MEANING`, form: 'direct', rung: 1,
    gen: pool([
      { q: 'wrote a list before going to Marikiti market with the items and the money for each. Which is this?', r: 'A budget, made before spending', w: [['A receipt, a record of what was bought and paid for', 'A receipt is written after buying. A budget is made before.', 'M_BUDGET_IS_RECEIPT'], ['A shopping list with no money on it at all', 'This list has the money for each item. A budget also has the cost of each item.', 'M_BUDGET_NO_MONEY_LIMIT']], s: 'A budget is a plan, made before spending, for money you have.' },
      { q: 'got a paper from the shop after buying sugar and bread. It shows what was bought and the total paid. Is it a budget?', r: 'No, it is a receipt', w: [['Yes, because it shows money paid', 'A budget is a plan made before spending.', 'M_BUDGET_IS_RECEIPT'], ['Yes, because it lists the items bought', 'Items and amounts after buying make a receipt.', 'M_BUDGET_IS_RECEIPT']], s: 'A receipt is a record, not a plan.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.mon.bm.complete', cs: `${Y}BUDGET_MEANING`, form: 'why', rung: 2,
    gen: () => {
      const n = pick([300, 500, 700, 1000]), items = shuffle(['sugar', 'bread', 'milk', 'rice']).slice(0, 3), p = person();
      const options = mc('No, it needs costs, a total and the money', [['Yes, because it lists what is wanted to buy', 'A budget needs costs and a total compared with the money available.', 'M_BUDGET_NO_MONEY_LIMIT'], [`Yes, because ${p.she} has ${sh(n)} to spend`, 'Having money is not a plan. The costs must be written down too.', 'M_BUDGET_NO_MONEY_LIMIT']]);
      return { question: `${p.name} has ${sh(n)}. ${p.She} writes only: ${items.join(', ')}. Is this a complete budget?`, options, instruction: 'Choose the best answer.',
        hints: ['What does a budget show for each item?', 'It also compares the total with the money available.'], steps: ['A complete budget has the cost of each item.', 'It also has the total and the money available.'] };
    } }),
  fam({ id: 'g5c.mon.bm.who', cs: `${Y}BUDGET_MEANING`, form: 'word', rung: 2,
    gen: () => {
      const m = pick([50, 100, 200, 500]), p = person();
      const options = mc('Yes. Anyone with money to spend can plan with a budget', [['No, budgets are only for the government and big businesses', 'Anyone with money can plan how to use it.', 'M_BUDGET_ONLY_FOR_GOVERNMENT'], ['No, budgets are for adults only', 'A child with pocket money can budget too.', 'M_BUDGET_ONLY_FOR_GOVERNMENT']]);
      return { question: `${p.name} gets ${sh(m)} pocket money each week. Does ${p.she} need a budget?`, options, instruction: 'Choose the best answer.',
        hints: ['Who can make a plan for money?', 'A budget helps anyone use money well.'], steps: ['A budget is a plan for the money you have.', 'It is for anyone, not only governments.'] };
    } }),

  // ---------------------------------------------------------------- BUDGET_IMPORTANCE
  fam({ id: 'g5c.mon.bi.fail', cs: `${Y}BUDGET_IMPORTANCE`, form: 'why', rung: 2,
    gen: () => {
      const b = pick([500, 800, 1000, 1500]), s = b - pick([100, 150, 200]), p = person();
      const options = mc(`No. ${p.she[0].toUpperCase() + p.she.slice(1)} spent within the budget and kept ${sh(b - s)}`, [['Yes, because the money was not all spent', 'A budget does not mean spending everything. Money left over can be saved.', 'M_BUDGET_MEANS_SPEND_ALL'], ['Yes, the budget failed because money is left', 'Spending less than the budget is good.', 'M_BUDGET_MEANS_SPEND_ALL']]);
      return { question: `${p.name} made a budget of ${sh(b)} for the week and spent ${sh(s)}. Did the budget fail?`, options, instruction: 'Choose the best answer.',
        hints: ['Did she spend more than she planned?', 'Money left over is not a failure.'], steps: [`${b} − ${s} = ${b - s}.`, 'She spent within her budget.'] };
    } }),
  fam({ id: 'g5c.mon.bi.drop', cs: `${Y}BUDGET_IMPORTANCE`, form: 'direct', rung: 2,
    gen: () => {
      const a = pick([230, 250, 280]), b = pick([100, 120, 150]), c = pick([40, 60, 80]), p = person();
      const options = mc('The treat, because it is a want', [['Maize flour, because it costs the most', 'Food is a need. Drop a want first.', 'M_DROP_MOST_EXPENSIVE'], ['Soap, because it is cheaper than the flour', 'Soap is a need. The treat is a want.', 'M_DROP_MOST_EXPENSIVE']]);
      return { question: `${p.name}'s budget is too high. The items are maize flour (${sh(a)}), soap (${sh(b)}) and a treat (${sh(c)}). Which should be dropped first?`, options, instruction: 'Choose the item to drop first.',
        hints: ['Which are needs and which are wants?', 'Drop a want before a need.'], steps: ['Flour and soap are needs.', 'The treat is a want, so drop it first.'] };
    } }),
  fam({ id: 'g5c.mon.bi.reasons', cs: `${Y}BUDGET_IMPORTANCE`, form: 'word', rung: 3,
    gen: () => {
      const b = pick([1000, 1500, 2000]), s = b - pick([150, 250, 350]), save = b - s;
      return { question: `${person().name} budgets ${sh(b)} for the week and spends only ${sh(s)}. How much can ${'be'} saved? Give the number of shillings.`.replace('${\'be\'}', 'be'), answer: save,
        wrong: [[b, 'That is the whole budget. Money saved is what is left over.', 'M_BUDGET_MEANS_SPEND_ALL'], [s, 'That is what was spent.', 'M_BUDGET_MEANS_SPEND_ALL'], [b + s, 'Take away what was spent to find what is left.', 'M_BUDGET_MEANS_SPEND_ALL'], [0, 'Money not spent is saved. A budget does not have to be spent in full.', 'M_BUDGET_MEANS_SPEND_ALL']],
        hints: ['Money left over can be saved.', 'Subtract the spending from the budget.'], steps: [`${b} − ${s} = ${b - s}.`, `${sh(b - s)} can be saved.`], chk: (v) => v + s === b };
    } }),

  // ---------------------------------------------------------------- BUDGET_ITEM_COSTS
  fam({ id: 'g5c.mon.bic.line', cs: `${Y}BUDGET_ITEM_COSTS`, form: 'word', rung: 1,
    gen: () => {
      const item = pick(['kg of sugar', 'kg of rice', 'litre of milk', 'kg of tomatoes']), pr = price(item), q = randInt(2, 7), p = person();
      return { question: `${p.name}'s budget needs ${q} ${item.replace('kg of', 'kg of').replace('litre of', 'litres of')}, at ${sh(pr)} for each. What is the cost of this line of the budget?`.replace(/litres of litres|kg of kg/, ''), answer: q * pr,
        wrong: [[pr, 'That is the price of one. The line has several.', 'M_UNIT_PRICE_AS_COST'], [pr + q, 'Multiply the quantity by the price. Do not add.', 'M_ADD_QTY_AND_PRICE'], [q * pr + 100, 'Check the multiplication and the carry.', 'M_FORGET_CARRY'], [q * (pr - (pr % 10)), 'Multiply the whole price, including the ones digit.', 'M_FORGET_CARRY']],
        hints: ['Quantity × price of one.', 'Write the answer in shillings.'], steps: [`${q} × ${pr} = ${q * pr}.`, `${sh(q * pr)}.`], chk: (v) => v / q === pr };
    } }),
  fam({ id: 'g5c.mon.bic.table', cs: `${Y}BUDGET_ITEM_COSTS`, form: 'table', rung: 2,
    gen: () => {
      const items = shuffle([['Bread', 'loaf of bread'], ['Milk', 'litre of milk'], ['Eggs', 'egg'], ['Sugar', 'kg of sugar']]).slice(0, 3), q = items.map(() => randInt(2, 6)), pr = items.map(i => price(i[1])), k = randInt(0, 2);
      return { question: `The budget table shows items with their quantity and price of one. What is the cost of ${items[k][0].toLowerCase()}?`, model: tbl(['Item', 'Quantity', 'Price of one'], items.map((it, i) => [it[0], String(q[i]), sh(pr[i])])), answer: q[k] * pr[k],
        wrong: [[pr[k], 'That is the price of one. Multiply by the quantity.', 'M_UNIT_PRICE_AS_COST'], [q[k] + pr[k], 'Multiply, do not add.', 'M_ADD_QTY_AND_PRICE'], [q[(k + 1) % 3] * pr[k], 'Use the quantity from the same row.', 'M_UNIT_PRICE_AS_COST'], [q[k] * pr[k] + 10, 'Check the carry.', 'M_FORGET_CARRY']],
        hints: ['Find the row for the item.', 'Quantity × price of one.'], steps: [`${q[k]} × ${pr[k]} = ${q[k] * pr[k]}.`, `${sh(q[k] * pr[k])}.`], chk: (v) => v === q[k] * pr[k] };
    } }),
  fam({ id: 'g5c.mon.bic.spot', cs: `${Y}BUDGET_ITEM_COSTS`, form: 'spot', rung: 3,
    gen: () => { const p = person(), q = randInt(3, 6), pr = pick([45, 65, 85]); return spot(`${p.name} works out the cost of ${q} exercise books at ${sh(pr)} each. Which step has the mistake?`, [`Step 1: One book costs ${sh(pr)}.`, `Step 2: The cost of ${q} books is ${pr} + ${q} = ${pr + q}.`, `Step 3: The line costs ${sh(pr + q)}.`], 1, `Several equal items: multiply. ${q} × ${pr} = ${q * pr}, so the line costs ${sh(q * pr)}.`, 'M_ADD_QTY_AND_PRICE', 'Is the cost of 5 books really close to the cost of 1?'); } }),

  // ---------------------------------------------------------------- BUDGET_TOTAL_BALANCE
  fam({ id: 'g5c.mon.bt.balance', cs: `${Y}BUDGET_TOTAL_BALANCE`, form: 'word', rung: 2,
    gen: () => {
      const have = pick([1000, 1500, 2000]), total = have - randInt(1, 9) * 50 - pick([0, 15, 30]), p = person();
      if (total <= 0) return null;
      return { question: `${p.name} has ${sh(have)}. ${p.Her} budget total is ${sh(total)}. How much will be left over?`, answer: have - total,
        wrong: [[have + total, 'The balance is what is left, so take away.', 'M_BALANCE_ADDED'], [total, 'That is the budget total, not the balance.', 'M_BALANCE_ADDED'], [have, 'That is the money available.', 'M_BALANCE_ADDED'], [Math.abs(have - total) + 100, 'Check the subtraction.', 'M_SMALLER_FROM_LARGER']],
        hints: ['Money available minus the budget total.', 'Check by adding.'], steps: [`${have} − ${total} = ${have - total}.`, `${sh(have - total)} left.`], chk: (v) => v + total === have };
    } }),
  fam({ id: 'g5c.mon.bt.total', cs: `${Y}BUDGET_TOTAL_BALANCE`, form: 'table', rung: 3,
    gen: () => {
      const items = shuffle([['Rice', 'kg of rice', 2], ['Cooking oil', 'litre of cooking oil', 1], ['Sugar', 'kg of sugar', 3], ['Bread', 'loaf of bread', 2]]).slice(0, 3).map(x => ({ n: x[0], pr: price(x[1]), q: x[2] })), lines = items.map(i => i.q * i.pr), tot = lines.reduce((a, b) => a + b, 0);
      return { question: 'The budget table shows each item, the quantity, the price of one and the cost of the line. What is the budget total?', model: tbl(['Item', 'Quantity', 'Price of one', 'Cost'], items.map((i, k) => [i.n, String(i.q), sh(i.pr), sh(lines[k])])), answer: tot,
        wrong: [[items.reduce((a, i) => a + i.pr, 0), 'You added the prices of one. Add the cost of each line.', 'M_TOTAL_OF_UNIT_PRICES'], [tot - lines[2], 'One line is missing from the total.', 'M_TOTAL_OF_UNIT_PRICES'], [tot + 100, 'Check the addition.', 'M_SMALLER_FROM_LARGER'], [lines[0], 'That is one line only.', 'M_TOTAL_OF_UNIT_PRICES']],
        hints: ['Add the Cost column.', 'Do not add the price of one.'], steps: [`${lines.join(' + ')} = ${tot}.`, `${sh(tot)}.`], chk: (v) => v === lines.reduce((a, b) => a + b, 0) };
    } }),
  fam({ id: 'g5c.mon.bt.afford', cs: `${Y}BUDGET_TOTAL_BALANCE`, form: 'why', rung: 3,
    gen: () => {
      const have = pick([400, 500, 800]), over = pick([40, 60, 80]), tot = have + over, p = person();
      const options = mc(`No, ${p.she} is short by ${sh(over)}`, [[`Yes, the balance is ${sh(over)} more`, 'The total is more than the money available, so there is a shortfall, not a balance.', 'M_SHORTFALL_IGNORED'], ['Yes, because the two numbers are close', 'The total is more than the money. She cannot buy everything.', 'M_SHORTFALL_IGNORED']]);
      return { question: `${p.name} has ${sh(have)}. ${p.Her} budget total is ${sh(tot)}. Can ${p.she} buy everything?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Compare the total with the money.', 'Is the total more or less?'], steps: [`${tot} is more than ${have}.`, `She is short by ${tot} − ${have} = ${over}.`] };
    } }),

  // ---------------------------------------------------------------- TAX_MEANING
  fam({ id: 'g5c.mon.tm.what', cs: `${Y}TAX_MEANING`, form: 'direct', rung: 1,
    gen: pool([
      { q: 'asks what tax is. Which answer is right?', r: 'Money paid to the government for public services', w: [['Money paid as a punishment for breaking a rule', 'That is a fine. Tax is paid by everyone for public services.', 'M_TAX_IS_FINE'], ['Money kept by the shop as extra profit', 'The shop collects tax for the government.', 'M_TAX_KEPT_BY_SHOP']], s: 'Tax pays for roads, schools and hospitals.' },
      { q: 'sees tax on a supermarket receipt. Who gets this money in the end?', r: 'The government', w: [['The supermarket', 'The shop collects it and passes it to the government.', 'M_TAX_KEPT_BY_SHOP'], ['The cashier', 'The cashier is not paid tax money. It goes to the government.', 'M_TAX_KEPT_BY_SHOP']], s: 'The shop collects tax and pays it to the government.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.mon.tm.why', cs: `${Y}TAX_MEANING`, form: 'why', rung: 2,
    gen: pool([
      { q: 'asks why the government collects taxes. Which is the best reason?', r: 'To pay for roads, schools and hospitals', w: [['It does not need to, because it can print money', 'Printing money does not build roads. Taxes pay for services.', 'M_GOVT_PRINTS_MONEY'], ['To fine people who break rules', 'That is a fine, not tax.', 'M_TAX_IS_FINE']], s: 'Public services are paid for with taxes.' },
      { q: 'asks which of these is paid for by tax: a public school, or a shop owner\'s own car?', r: 'A public school', w: [['A shop owner\'s own car', 'Taxes pay for public services, not private things.', 'M_TAX_KEPT_BY_SHOP'], ['Neither, because tax is a fine', 'Tax is paid for public services.', 'M_TAX_IS_FINE']], s: 'Public schools are paid for with taxes.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.mon.tm.tf', cs: `${Y}TAX_MEANING`, form: 'spot', rung: 3,
    gen: () => { const p = person(); return spot(`${p.name} explains tax. Which step has the mistake?`, ['Step 1: Tax is money that people and businesses pay to the government.', 'Step 2: The tax on a shop receipt is kept by the shop as extra profit.', 'Step 3: The government uses tax for roads, schools and hospitals.'], 1, 'The shop collects the tax from the customer and passes it to the government. It is not extra profit for the shop.', 'M_TAX_KEPT_BY_SHOP', 'Who gets the tax money in the end?'); } }),

  // ---------------------------------------------------------------- TAX_ON_RECEIPT
  fam({ id: 'g5c.mon.tr.amount', cs: `${Y}TAX_ON_RECEIPT`, form: 'table', rung: 1,
    gen: () => {
      const goods = randInt(5, 12) * 100, tax = Math.round(goods * 0.16), tot = goods + tax;
      return { question: 'The shop receipt shows these lines. How much tax was paid, in shillings?', model: tbl(['Line', 'Amount'], [['Goods', sh(goods)], ['Tax (16%)', sh(tax)], ['Total paid', sh(tot)]]), answer: tax,
        wrong: [[16, 'That is the tax rate, 16%. The tax paid is in the Amount column.', 'M_TAX_RATE_AS_AMOUNT'], [goods, 'That is the price of goods before tax.', 'M_TAX_RATE_AS_AMOUNT'], [tot, 'That is the total paid, which already includes the tax.', 'M_ADD_TAX_AGAIN'], [tax + 10, 'Read the tax line again.', 'M_TAX_RATE_AS_AMOUNT']],
        hints: ['Find the line that says tax.', 'Read the amount, not the rate.'], steps: [`The tax line is ${sh(tax)}.`, `Tax paid: ${sh(tax)}.`], chk: (v) => v === tax };
    } }),
  fam({ id: 'g5c.mon.tr.total', cs: `${Y}TAX_ON_RECEIPT`, form: 'word', rung: 2,
    gen: () => {
      const tot = randInt(5, 14) * 100 + 80, tax = Math.round(tot * 16 / 116), p = person();
      return { question: `A receipt shows TOTAL ${sh(tot)} and below it "VAT 16% included: ${sh(tax)}". How much did ${p.name} pay in all, in shillings?`, answer: tot,
        wrong: [[tot + tax, 'The total already includes the tax. Do not add it again.', 'M_ADD_TAX_AGAIN'], [tax, 'That is only the tax inside the total.', 'M_TAX_RATE_AS_AMOUNT'], [tot - tax, 'That is the price before tax. The customer pays the total.', 'M_ADD_TAX_AGAIN'], [16, 'That is the tax rate.', 'M_TAX_RATE_AS_AMOUNT']],
        hints: ['The word included means the tax is inside the total.', 'The customer pays the total.'], steps: ['The total includes the tax.', `${sh(tot)}.`], chk: (v) => v === tot };
    } }),
  fam({ id: 'g5c.mon.tr.before', cs: `${Y}TAX_ON_RECEIPT`, form: 'direct', rung: 3,
    gen: () => {
      const goods = randInt(5, 12) * 100, tax = Math.round(goods * 0.16), tot = goods + tax;
      const options = mc(sh(goods), [[sh(tot + tax), 'The total already has the tax inside. Take the tax away from the total.', 'M_ADD_TAX_AGAIN'], [sh(tax), 'That is only the tax.', 'M_TAX_RATE_AS_AMOUNT'], [sh(tot), 'That is the price with tax. We want the price before tax.', 'M_ADD_TAX_AGAIN']]);
      return { question: `A receipt shows TOTAL ${sh(tot)} with VAT of ${sh(tax)} included. What was the price before tax?`, options, instruction: 'Choose the price before tax.',
        hints: ['Total = price before tax + tax.', 'Take the tax from the total.'], steps: [`${tot} − ${tax} = ${goods}.`, `${sh(goods)}.`] };
    } }),

  // ---------------------------------------------------------------- BANK_SERVICES
  fam({ id: 'g5c.mon.bs.match', cs: `${Y}BANK_SERVICES`, form: 'direct', rung: 1,
    gen: pool([
      { q: 'puts money into a bank account. What is this called?', r: 'A deposit', w: [['A withdrawal', 'Taking money out is a withdrawal. Putting it in is a deposit.', 'M_DEPOSIT_WITHDRAW_SWAP'], ['A loan', 'A loan is money borrowed from the bank.', 'M_LOAN_IS_GIFT']], s: 'Putting money in is a deposit.' },
      { q: 'takes money out of a bank account. What is this called?', r: 'A withdrawal', w: [['A deposit', 'A deposit puts money in. Taking money out is a withdrawal.', 'M_DEPOSIT_WITHDRAW_SWAP'], ['Interest', 'Interest is money the bank adds to savings.', 'M_DEPOSIT_WITHDRAW_SWAP']], s: 'Taking money out is a withdrawal.' },
      { q: 'keeps her land title in the bank\'s strong room for safety. Which bank service is this?', r: 'Safe custody', w: [['A loan', 'A loan is money borrowed from the bank.', 'M_LOAN_IS_GIFT'], ['A withdrawal', 'A withdrawal takes money out of an account. Keeping a valuable safe is safe custody.', 'M_DEPOSIT_WITHDRAW_SWAP']], s: 'Banks keep valuables safe.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.mon.bs.loan', cs: `${Y}BANK_SERVICES`, form: 'why', rung: 2,
    gen: () => {
      const a = pick([10000, 20000, 50000]), p = person();
      const options = mc(`Yes, it is paid back with interest`, [['No, because the bank gave her the money', 'A loan is not a gift. It must be paid back with interest.', 'M_LOAN_IS_GIFT'], ['No, only if she feels like paying', 'A loan must be repaid.', 'M_LOAN_IS_GIFT']]);
      return { question: `${p.name} borrows ${sh(a)} from a bank to buy a posho mill. Does ${p.she} have to pay it back?`, options, instruction: 'Choose the answer.',
        hints: ['Is a loan a gift?', 'What does the bank add?'], steps: ['A loan must be paid back.', 'The bank adds interest.'] };
    } }),
  fam({ id: 'g5c.mon.bs.notes', cs: `${Y}BANK_SERVICES`, form: 'word', rung: 3,
    gen: () => {
      const a = pick([500, 1000]), p = person();
      const options = mc('No, the bank records the amount', [['Yes, the bank keeps his note in a box with his name on it', 'The bank records how much is in the account. You get money of the same amount, not the same note.', 'M_BANK_KEEPS_SAME_NOTES'], ['Yes, because every note is always returned', 'The same amount is returned, not the same note.', 'M_BANK_KEEPS_SAME_NOTES']]);
      return { question: `${p.name} deposits a ${sh(a)} note. When ${p.she} withdraws ${sh(a)}, must ${p.she} get the same note back?`, options, instruction: 'Choose the answer.',
        hints: ['What does the bank keep a record of?', 'The amount, not the note.'], steps: ['The bank records the amount in the account.', 'You get the same amount of money.'] };
    } }),

  // ---------------------------------------------------------------- MONEY_TRANSFER_DIGITAL
  fam({ id: 'g5c.mon.mt.pin', cs: `${Y}MONEY_TRANSFER_DIGITAL`, form: 'direct', rung: 1,
    gen: pool([
      { q: 'gets a call from a person who says he is from the bank and asks for her PIN to fix her account. What should she do?', r: 'Never share it, hang up, tell an adult', w: [['Tell him the PIN so he can fix her account', 'A PIN is secret. The bank never asks for it.', 'M_SHARE_PIN'], ['Give the PIN only to a trusted friend', 'A PIN is never shared with anyone.', 'M_SHARE_PIN']], s: 'A PIN is secret.' },
      { q: 'is asked by an agent to say the PIN aloud so the agent can send money quickly. What should be done?', r: 'Keep it secret, enter it yourself', w: [['Say the PIN aloud to save time', 'Never say the PIN. Someone may hear it.', 'M_SHARE_PIN'], ['Write the PIN on the back of the phone', 'Never write a PIN where others can see it.', 'M_SHARE_PIN']], s: 'Enter the PIN yourself in private.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.mon.mt.check', cs: `${Y}MONEY_TRANSFER_DIGITAL`, form: 'why', rung: 2,
    gen: () => {
      const a = pick([300, 500, 1000]), name = pick(['JANE ACHIENG', 'OTIENO KAMAU', 'AMINA HASSAN']), wrong = pick(['JOHN OCHIENG', 'PETER MUTUA']);
      const options = mc('Cancel, and check the number and the name', [['Press send, as the money will find the right person', 'Money sent to the wrong person is hard to get back. Check first.', 'M_NO_CHECK_RECIPIENT'], ['Press send, the name does not matter', 'The name must match the person you mean to pay.', 'M_NO_CHECK_RECIPIENT']]);
      return { question: `${person().name} wants to send ${sh(a)} to ${name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}. The phone screen says "Send ${a} to ${wrong}?" What should be done?`, options, instruction: 'Choose the best action.',
        hints: ['Does the name on the screen match?', 'Check before you press send.'], steps: ['The name on the screen is different.', 'Cancel and check the number.'] };
    } }),
  fam({ id: 'g5c.mon.mt.order', cs: `${Y}MONEY_TRANSFER_DIGITAL`, form: 'word', rung: 3,
    gen: () => {
      const steps = ['Choose send money', 'Enter the number', 'Enter the amount', 'Check the name', 'Enter the PIN and confirm'];
      const right = steps.join(', then '), alt = (a) => a.map(i => steps[i]).join(', then ');
      const options = mc(right, [[alt([4, 0, 1, 2, 3]), 'The PIN comes last, after checking the name.', 'M_NO_CHECK_RECIPIENT'], [alt([0, 1, 2, 4, 3]), 'Check the name before entering the PIN.', 'M_NO_CHECK_RECIPIENT'], [alt([0, 1, 3, 2, 4]), 'Enter the amount before checking the details.', 'M_NO_CHECK_RECIPIENT']]);
      return { question: `${person().name} sends money from a phone. Which is the correct order of steps?`, options, instruction: 'Choose the order.',
        hints: ['Check before you confirm.', 'The PIN is last.'], steps: ['Choose, number, amount, check the name.', 'Then the PIN and confirm.'] };
    } }),

  // ---------------------------------------------------------------- SAVING_FACTORS
  fam({ id: 'g5c.mon.sf.plan', cs: `${Y}SAVING_FACTORS`, form: 'direct', rung: 1,
    gen: () => {
      const m = pick([100, 200, 300]), save = m / 4, p = person();
      const options = mc(`Plan B: put ${sh(save)} aside first, then spend the rest`, [[`Plan A: spend on what ${p.she} wants and save what is left`, 'Saving what is left often means saving nothing. Decide the saving amount first.', 'M_SAVE_WHATS_LEFT'], ['Plan C: spend it all and borrow later', 'Borrowing leaves debt. Save first.', 'M_SAVE_WHATS_LEFT']]);
      return { question: `${p.name} gets ${sh(m)} pocket money each week. Which is the wiser plan?`, options, instruction: 'Choose the wiser plan.',
        hints: ['When is the saving amount decided?', 'Save first, spend the rest.'], steps: ['Deciding the saving first makes sure it is saved.', `Put ${sh(save)} aside first.`] };
    } }),
  fam({ id: 'g5c.mon.sf.safe', cs: `${Y}SAVING_FACTORS`, form: 'why', rung: 2,
    gen: () => {
      const a = pick([2000, 5000, 10000]), p = person();
      const options = mc('In a bank or SACCO account, which is protected', [['In a tin under the bed, which is as safe as a bank', 'A tin at home can be stolen, lost or burnt. A bank or SACCO is safer.', 'M_HOME_AS_SAFE_AS_BANK'], ['In a pocket, so it is easy to spend', 'A pocket is easy to lose from. A bank is safer.', 'M_HOME_AS_SAFE_AS_BANK']]);
      return { question: `${p.name} has saved ${sh(a)} for school fees. Where is the safest place to keep it?`, options, instruction: 'Choose the safest place.',
        hints: ['Which place protects the money from theft and fire?', 'A bank or SACCO keeps records.'], steps: ['A bank or SACCO protects savings.', 'A tin at home is not as safe.'] };
    } }),
  fam({ id: 'g5c.mon.sf.small', cs: `${Y}SAVING_FACTORS`, form: 'word', rung: 3,
    gen: () => {
      const d = pick([10, 20, 25]), p = person();
      return { question: `${p.name} gets ${sh(d * 2)} a day and decides to save ${sh(d)} each day. How many shillings will ${p.she} have saved after 7 days?`, answer: d * 7,
        wrong: [[d, 'That is one day of saving. There are 7 days.', 'M_SAVING_ONLY_FOR_RICH'], [0, 'Even a small amount adds up. Saving is for anyone.', 'M_SAVING_ONLY_FOR_RICH'], [d * 2 * 7, 'That is all the money received. Only half is saved.', 'M_SAVE_WHATS_LEFT'], [d + 7, 'Multiply the daily saving by 7.', 'M_SAVING_ONLY_FOR_RICH']],
        hints: ['Saving each day adds up.', 'Multiply by 7.'], steps: [`${d} × 7 = ${d * 7}.`, `${sh(d * 7)}.`], chk: (v) => v / 7 === d };
    } }),
];
