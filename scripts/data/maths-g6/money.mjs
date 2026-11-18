import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'MEASUR.MONEY';
export const packNotes = 'Money is taught with a market stall or a school canteen: buying price (what the trader paid), selling price (what the customer pays), profit or loss (the difference). A budget is a two-column table, income and planned spending. Tax rates are always given in the question (VAT is 16% in Kenya at the time of writing).';
export const pre = {
  BUYING_SELLING_PRICE: [['G5:NUMBER.SUBTRACTION.SUB_WORD_PROBLEMS', E, 'Finding one price from another and a difference is an adding or taking-away story.']],
  PROFIT_FROM_SALES: [['G5:NUMBER.MULTIPLICATION.MULT_WORD_PROBLEMS', H, 'The profit on many items is the profit on one times the number of items.']],
  LOSS_FROM_SALES: [['G6:MEASUR.MONEY.BUYING_SELLING_PRICE', E, 'Telling the buying price from the selling price comes first.']],
};
export const mis = [
  mi('PREPARE_BUDGET', 'M_OVER_BUDGET_AS_LEFT', 'When spending is more than income, takes the smaller from the larger and says money is left.', ['Income Ksh 4,000, planned spending Ksh 4,600. What is the balance?', 'Ksh 600 left', 'Over budget by Ksh 600 (spending is Ksh 600 more than income)'], 'Always subtracts the smaller number from the larger.', 'A balance of money left as an option.', 'Ask: is there enough money for everything on the list? Compare the two totals first.'),
  mi('PREPARE_BUDGET', 'M_UNIT_PRICE_FOR_LINE', 'Writes the price of one unit as the cost of a budget line that buys several.', ['Budget line: 3 kg of sugar at Ksh 180 per kg. Cost?', 'Ksh 180', 'Ksh 540'], 'Copies the price without reading the quantity.', 'The unit price as the line cost.', 'Read each line as "how many, at what price": 3 x 180.'),
  mi('BUYING_SELLING_PRICE', 'M_PROFIT_TAKEN_OFF_FOR_SELLING', 'Takes the profit away from the buying price to find the selling price.', ['Bought at Ksh 600 and sold at a profit of Ksh 150. Selling price?', 'Ksh 450', 'Ksh 750'], 'Not sure whether profit is added or taken away.', 'The buying price minus the profit as an option.', 'A profit means the trader got more than they paid: selling price = buying price + profit.'),
  mi('BUYING_SELLING_PRICE', 'M_LOSS_TAKEN_OFF_FOR_BUYING', 'Takes the loss away from the selling price to find the buying price.', ['Sold for Ksh 650 at a loss of Ksh 150. Buying price?', 'Ksh 500', 'Ksh 800'], 'Not sure which way the loss goes.', 'The selling price minus the loss as an option.', 'A loss means the trader paid more than they got: buying price = selling price + loss.'),
  mi('PROFIT_FROM_SALES', 'M_PROFIT_IS_SELLING_PRICE', 'Gives the selling price as the profit.', ['Bought at Ksh 500, sold at Ksh 650. Profit?', 'Ksh 650', 'Ksh 150'], 'Thinks all the money received is profit.', 'The selling price as an option.', 'The trader first gets back the Ksh 500 paid; only what is above it is profit.'),
  mi('PROFIT_FROM_SALES', 'M_BULK_COST_AGAINST_ONE_PRICE', 'Compares the cost of a whole crate with the price of one item.', ['A crate of 30 eggs costs Ksh 360. Each egg is sold for Ksh 15. Profit on the crate?', 'Ksh 345 (360 - 15)', 'Ksh 90 (30 x 15 = 450, 450 - 360)'], 'Subtracts the two prices it sees without matching what each is for.', 'The difference between the crate cost and one price.', 'Make both totals for the same thing: the money from all 30 eggs, then take away the crate cost.'),
  mi('LOSS_FROM_SALES', 'M_EXTRA_COSTS_IGNORED', 'Leaves out other costs such as transport when deciding profit or loss.', ['Goods bought for Ksh 2,000, transport Ksh 300, sold for Ksh 2,100. Profit or loss?', 'Profit of Ksh 100', 'Loss of Ksh 200'], 'Compares only the two prices named buying and selling.', 'A profit when the extra cost makes it a loss.', 'Add every cost first: 2,000 + 300 = 2,300 spent.'),
  mi('LOSS_FROM_SALES', 'M_LOSS_ON_ONE_ITEM', 'Gives the loss on one item when the loss on all of them is asked.', ['10 pens bought at Ksh 30 each and sold at Ksh 25 each. Total loss?', 'Ksh 5', 'Ksh 50'], 'Stops after working out one item.', 'The loss on one item as an option.', 'Read the question again: all 10 pens. Multiply the loss on one by 10.'),
  mi('TYPES_OF_TAXES', 'M_DUTY_ON_LOCAL_GOODS', 'Believes import duty is charged on goods made and sold in Kenya.', ['Import duty is charged on?', 'goods made and sold in Kenya', 'goods brought into Kenya from other countries'], 'Mixes up the names of the taxes.', 'Local goods among the choices.', '"Import" means bringing in: the duty is paid when goods come into the country.'),
  mi('TYPES_OF_TAXES', 'M_TAX_AS_TOTAL', 'Gives the tax as the total price, or the total as the tax.', ['A radio costs Ksh 1,000 plus 16% VAT. What is the total price?', 'Ksh 160', 'Ksh 1,160'], 'Works out the tax and stops.', 'The tax on its own as the total.', 'Read the question: the total is the price and the tax together.'),
];
export const pack = {
  PREPARE_BUDGET: pk({
    key_step: 'The child totals the income and the planned spending separately and takes spending from income, saying whether money is left or the budget is over.',
    floor: ['Adds a list of prices.', 'What is Ksh 450 + Ksh 300 + Ksh 250?', 'Ksh 1,000'],
    reps: ['a family or class trip budget on paper', 'a two-column table: income and spending', 'the balance shown as left or over'],
    steps: ['List the income and total it.', 'List every planned item as quantity x price and total the spending.', 'Balance = income - spending.', 'If spending is more, say the budget is over by the difference.'],
    contexts: ['a class trip to Nairobi National Park', 'a family\'s weekly shopping', 'a chama\'s meeting'],
    board: [['draw', 'Draw a table with columns Income and Spending.'], ['write', 'Write income 4,000 and items 1,800, 1,500 and 1,300.'], ['count', 'Add the spending with the child.'], ['point', 'Point at the two totals.', 'Is there enough money for everything?'], ['pause', 'Wait for the child to compare.'], ['write', 'Write "over budget by 600".']],
    mis: {
      M_ADD_INCOME_TO_SPENDING: [['8,200', 'add them'], 'Does spending give you more money?', 'Balance is income take away spending.'],
      M_ITEM_LEFT_OUT: [['only three items'], 'Did you tick every line?', 'Tick each item as you add it.'],
      M_OVER_BUDGET_AS_LEFT: [['600 left'], 'Is the spending more or less than the income?', 'If spending is more, the budget is over, not left.'],
      M_UNIT_PRICE_FOR_LINE: [['180', 'one price'], 'How many kg of sugar are on the list?', 'Cost of a line = quantity x price.'],
    },
    checks: [P('Income Ksh 5,000, planned spending Ksh 3,200. What is the balance?', 'Ksh 1,800 left', 'money left'), P('Income Ksh 4,000, planned spending Ksh 4,600. What is the balance?', 'Over budget by Ksh 600', 'over budget')],
  }),
  BUYING_SELLING_PRICE: pk({
    key_step: 'The child says which price the trader paid and which the customer paid, and adds or takes away the profit or loss by asking who got more.',
    floor: ['Solves adding and subtracting stories.', 'Ksh 1,200 take away Ksh 200?', 'Ksh 1,000'],
    reps: ['a market stall role-play', 'a bar model: buying price and profit make the selling price', 'a table of buying price, selling price, profit or loss'],
    steps: ['Name the price you know: buying or selling.', 'Profit: selling = buying + profit; buying = selling - profit.', 'Loss: selling = buying - loss; buying = selling + loss.', 'Check the answer makes sense in the story.'],
    contexts: ['a mama mboga selling vegetables', 'a duka owner', 'a school tuck shop'],
    board: [['draw', 'Draw a bar: buying price, with a piece for profit on the end.'], ['write', 'Write buying 600, profit 150.'], ['point', 'Point at the whole bar.', 'What does the whole bar show?'], ['pause', 'Wait for the selling price.'], ['predict', 'Ask the child for the selling price.']],
    mis: {
      M_SELLING_FOR_BUYING: [['1,200', 'the same'], 'Did the trader pay 1,200 or get 1,200?', 'The buying price is what the trader paid: 1,200 - 200.'],
      M_ADD_LOSS: [['950', 'add the loss'], 'With a loss, did the trader get more or less than they paid?', 'Selling price = buying price - loss.'],
      M_PROFIT_TAKEN_OFF_FOR_SELLING: [['450', 'take away'], 'With a profit, does the trader get more or less than they paid?', 'Add the profit: 750.'],
      M_LOSS_TAKEN_OFF_FOR_BUYING: [['500'], 'With a loss, did the trader pay more or less than 650?', 'Buying price = selling price + loss: 800.'],
    },
    checks: [P('Bought at Ksh 600 and sold at a profit of Ksh 150. What is the selling price?', 'Ksh 750', 'add the profit'), P('Sold for Ksh 1,200 at a profit of Ksh 200. What was the buying price?', 'Ksh 1,000', 'take the profit away')],
  }),
  PROFIT_FROM_SALES: pk({
    key_step: 'The child works out the total money in and the total cost for the same goods and takes cost from money in.',
    floor: ['Multiplies money by a whole number.', 'What is 12 x Ksh 8?', 'Ksh 96'],
    reps: ['coins for money in and money out', 'a table: cost, money in, profit', 'per item and for all items side by side'],
    steps: ['Find the total cost of all the goods.', 'Find the total money from selling them.', 'Profit = money in - cost.', 'Check the question: per item or for all.'],
    contexts: ['mangoes at a market', 'eggs from a crate', 'mandazi at the canteen'],
    board: [['write', 'Write: 12 mangoes bought at Ksh 5 each, sold at Ksh 8 each.'], ['point', 'Point at the 12.', 'How many mangoes do we work with?'], ['pause', 'Wait for 12.'], ['child_draws', 'Ask the child to fill the table: cost 60, money in 96.'], ['reveal', 'Write profit 96 - 60 = Ksh 36.']],
    mis: {
      M_PROFIT_PER_ITEM_VS_TOTAL: [['3', 'on one'], 'How many mangoes were sold?', 'Profit on all 12: 12 x 3 = 36.'],
      M_SELLING_LESS_BUYING_REVERSED: [['minus 150', '1,150'], 'Which is bigger, the money in or the cost?', 'Profit = selling price - buying price.'],
      M_PROFIT_IS_SELLING_PRICE: [['650', 'all of it'], 'Did the trader pay anything for the goods?', 'Take away the cost first.'],
      M_BULK_COST_AGAINST_ONE_PRICE: [['345', '360 take 15'], 'Is 15 the money from the whole crate?', 'Money in for 30 eggs is 450; 450 - 360 = 90.'],
    },
    checks: [P('12 mangoes are bought at Ksh 5 each and sold at Ksh 8 each. What is the total profit?', 'Ksh 36', 'for all items'), P('A crate of 30 eggs costs Ksh 360 and each egg is sold for Ksh 15. What is the profit on the crate?', 'Ksh 90', 'bulk cost against sales')],
  }),
  LOSS_FROM_SALES: pk({
    key_step: 'The child adds every cost, compares the total cost with the money in, and calls it a loss when the money in is less.',
    floor: ['Works out profit.', 'Bought at Ksh 500, sold at Ksh 650. Profit?', 'Ksh 150'],
    reps: ['a market story with spoilt goods', 'a table: all costs, money in, profit or loss', 'two bars: cost longer than money in'],
    steps: ['Add every cost: buying price, transport and other costs.', 'Find the money in from the goods actually sold.', 'If money in is less, loss = cost - money in.', 'Answer for all items if the question asks.'],
    contexts: ['tomatoes that spoil', 'transport to market', 'a school fundraising sale'],
    board: [['draw', 'Draw two bars: costs and money in.'], ['write', 'Write costs 2,000 + 300 and money in 2,100.'], ['point', 'Point at the two bars.', 'Which bar is longer?'], ['pause', 'Wait for the child to say the costs.'], ['predict', 'Ask whether it is a profit or a loss, and how much.']],
    mis: {
      M_LOSS_AS_PROFIT: [['profit of 200'], 'Did the trader get back what they paid?', 'Selling for less than the cost is a loss.'],
      M_SPOILT_GOODS_IGNORED: [['sold all 20'], 'Can spoilt tomatoes be sold?', 'Only the goods sold bring money in.'],
      M_EXTRA_COSTS_IGNORED: [['profit of 100', 'forgot transport'], 'What else did the trader pay for?', 'Add every cost before comparing.'],
      M_LOSS_ON_ONE_ITEM: [['5', 'one pen'], 'How many pens were sold?', 'Multiply the loss on one by the number sold.'],
    },
    checks: [P('Bought at Ksh 900, sold at Ksh 700. Profit or loss, and how much?', 'Loss of Ksh 200', 'selling below cost'), P('10 pens are bought at Ksh 30 each and sold at Ksh 25 each. What is the total loss?', 'Ksh 50', 'for all items')],
  }),
  TYPES_OF_TAXES: pk({
    key_step: 'The child matches each tax to what it is charged on (VAT on goods and services, PAYE on pay, import duty on goods coming in, land rates on land) and adds a stated tax to a price for the total.',
    floor: ['Knows what a tax is.', 'Who collects taxes in Kenya?', 'the government (KRA, or the county for land rates)'],
    reps: ['a supermarket receipt with VAT shown', 'a payslip with PAYE', 'a sorting table: tax and what it is on'],
    steps: ['Read what is being taxed: a good, pay, an import or land.', 'Name the tax.', 'If a rate is given, work out the tax.', 'For the total, add the tax to the price.'],
    contexts: ['a receipt from a supermarket', 'a teacher\'s payslip', 'a car imported through Mombasa'],
    board: [['draw', 'Draw a receipt: radio Ksh 1,000, VAT 16%.'], ['point', 'Point at the VAT line.', 'What is 16% of 1,000?'], ['pause', 'Wait for 160.'], ['predict', 'Ask what the customer pays in all.'], ['write', 'Write 1,000 + 160 = Ksh 1,160.']],
    mis: {
      M_VAT_ON_PAY: [['VAT from pay'], 'Is VAT on what you buy or on what you earn?', 'PAYE is taken from pay; VAT is on goods and services.'],
      M_TAX_PERCENT_OFF_THE_PRICE: [['840', 'take it off'], 'Does tax make the price more or less?', 'Add the tax: 1,160.'],
      M_DUTY_ON_LOCAL_GOODS: [['goods made in Kenya'], 'What does import mean?', 'Import duty is paid on goods brought into Kenya.'],
      M_TAX_AS_TOTAL: [['160'], 'Is 160 what the customer pays in all?', 'Total = price + tax.'],
    },
    checks: [P('Which tax is taken from a worker\'s pay?', 'PAYE', 'name the tax'), P('A radio costs Ksh 1,000 plus 16% VAT. What is the total price?', 'Ksh 1,160', 'add the tax')],
  }),
};
