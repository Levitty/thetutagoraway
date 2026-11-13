// ============================================================================
// GRADE 8 PRE-TECHNICAL STUDIES, MATERIALS, TOOLS AND ENTREPRENEURSHIP (8 skills): Composite Materials, Ceramic Materials, Cutting Tools,
// Computer Software, Bookkeeping, Income and Budgeting, Marketing of Goods and Services, and Distribution of Goods and Services. Written offline
// from the KICD design through the curriculum map. Every wrong answer names the library misconception it reveals. All stay reviewed:false until
// a teacher signs them off: they reach no child. Using a cutting tool and preparing statements are practical and are not asked here.
// ============================================================================
import { S, fam, choose, c } from './pretechnical_g8_lib.js';
const CM = 'MATERI.COMPOSITE_MATERIALS.', CR = 'MATERI.CERAMIC_MATERIALS.', CT = 'TOOLS_.CUTTING_TOOLS.', SW = 'TOOLS_.COMPUTER_SOFTWARE.';
const BK = 'ENTREP.BOOKKEEPING.', IB = 'ENTREP.INCOME_AND_BUDGETING.', MK = 'ENTREP.OF_GOODS_AND_SERVICES.', DI = 'ENTREP.DISTRIBUTION_OF_GOODS_AN.';

export const FAMILIES = [
  ...S('cm', CM, 'COMPOSITE', ['CM_SINGLE', 'CM_PLYWOOD', 'CM_USE'], ['A composite joins two or more materials.', 'Think of what goes into the mixture.'], [
    ['What is concrete made of?', 'Cement, sand, ballast and water', 'One material only, taken from the ground', 'Thin layers of wood glued together', 'Glass fibre and clay only'],
    ['How is plywood made?', 'Thin layers of wood glued crosswise', 'From one solid piece of cut wood', 'By melting plastic and pouring it', 'By baking clay in a hot kiln'],
    ['What is reinforced concrete used for?', 'Buildings, bridges and slabs', 'Making cups and plates for the table', 'Making clothes from cotton thread', 'Making pens for the school'],
    ['Which material is a composite?', 'Reinforced concrete with steel bars', 'A pure sheet of aluminium', 'A single piece of solid granite', 'A plain glass of water'],
    ['What is fibreglass made of?', 'Glass fibre in resin', 'Only solid iron melted in a mould', 'Only cement and sand with water', 'Only thin sheets of paper'],
  ], [
    ['A builder mixes cement, sand, ballast and water for a floor. What is this called?', 'Concrete', 'Plywood', 'Fibreglass', 'Solid granite'],
    ['A carpenter glues thin sheets of wood with the grain crosswise. What does he make?', 'Plywood', 'Concrete', 'Fibreglass', 'Solid timber'],
    ['A builder pours concrete round steel bars for a bridge. Which material is this?', 'Reinforced concrete', 'Solid iron only', 'Plain sand only', 'Pure plastic'],
    ['Why is steel put inside concrete?', 'To make it stronger when pulled or bent', 'To make it lighter than water', 'To make it softer for cutting', 'To make it taste better'],
    ['A farmer builds a wall of mud and straw. Why is straw added?', 'To join with the mud and hold it together', 'To make the wall much heavier', 'To make the wall melt in rain', 'To make a loud noise'],
  ], [
    ['Which step is the mistake when Allan says concrete is a single material?', 'Step 1: Concrete is used for floors.', 'Step 2: A mixer holds cement and sand.', 'Step 3: Allan says concrete is one material only.', 'Concrete is a mixture of cement, sand, ballast and water.', 0],
    ['Which step is the mistake when Bella says plywood is a solid piece of wood?', 'Step 1: Plywood boards are flat.', 'Step 2: Their edges show layers.', 'Step 3: Bella says it is one solid piece.', 'Plywood is made of thin layers glued crosswise.', 1],
    ['Which step is the mistake when Carl says reinforced concrete is used for cups?', 'Step 1: Reinforced concrete is strong.', 'Step 2: It has steel bars in it.', 'Step 3: Carl says it is used to make cups.', 'Reinforced concrete is used in buildings, bridges and slabs.', 2],
    ['Which step is the mistake when Dora says a composite has only one material?', 'Step 1: A composite is made for better use.', 'Step 2: Concrete is an example.', 'Step 3: Dora says a composite has just one material.', 'A composite joins two or more materials.', 0],
    ['Which step is the mistake when Eddie says fibreglass is made of only cement?', 'Step 1: Fibreglass is used for tanks.', 'Step 2: It has strong fibres.', 'Step 3: Eddie says it is made of only cement.', 'Fibreglass is glass fibre in resin.', 0],
  ], ['b', 'c']),
  ...S('cr', CR, 'CERAMIC', ['CR_BRITTLE', 'CR_CONDUCT', 'CR_METAL'], ['Ceramics are hard but break when hit.', 'Ceramics do not carry electricity.'], [
    ['What happens when a clay pot is dropped on a hard floor?', 'It breaks or cracks', 'It bends and keeps its shape', 'It stretches and then returns', 'It melts into a puddle'],
    ['Why are ceramics used as electrical insulators?', 'They do not conduct electricity', 'They conduct electricity very well', 'They are soft and easy to cut', 'They melt at a low temperature'],
    ['Which is a ceramic material?', 'A clay brick', 'An iron nail', 'A copper wire', 'A steel spoon'],
    ['Why are floor tiles made of ceramic?', 'They are hard and last a long time', 'They are soft and bend easily', 'They burn when the floor is hot', 'They melt in the rain'],
    ['Which is a property of ceramics?', 'They resist heat and corrosion', 'They bend into new shapes easily', 'They carry electricity well', 'They rust in the rain'],
  ], [
    ['A cup slips from Nina\'s hand onto the floor. What is likely?', 'The cup breaks', 'The cup bends', 'The cup stretches', 'The cup melts'],
    ['An insulator on an electric pole is made of ceramic. Why?', 'Ceramic does not carry electricity', 'Ceramic carries electricity very well', 'Ceramic is soft and bends easily', 'Ceramic is cheaper than any metal'],
    ['Which of these objects at home is made of ceramic?', 'A porcelain cup', 'A steel spoon', 'A plastic basin', 'A copper pan'],
    ['A bathroom wall is covered in tiles. Why?', 'Tiles are hard and resist water', 'Tiles are soft and bend with the wall', 'Tiles carry electricity safely', 'Tiles melt in warm water'],
    ['A potter fires clay in a hot kiln. What does this do?', 'It hardens the clay into ceramic', 'It turns the clay into iron', 'It makes the clay soft again', 'It turns the clay into plastic'],
  ], [
    ['Which step is the mistake when Omari says ceramics never break?', 'Step 1: Ceramics are hard.', 'Step 2: A cup can crack when dropped.', 'Step 3: Omari says ceramics never break.', 'Ceramics are hard but brittle, so they break when dropped.', 0],
    ['Which step is the mistake when Pam says ceramics conduct electricity?', 'Step 1: An insulator is on a pole.', 'Step 2: It is made of ceramic.', 'Step 3: Pam says ceramics conduct electricity well.', 'Ceramics do not conduct electricity, so they are used as insulators.', 1],
    ['Which step is the mistake when Raj says a brick is a metal?', 'Step 1: A brick is made from clay.', 'Step 2: It is baked in a kiln.', 'Step 3: Raj says it is a metal.', 'A clay brick is ceramic. Iron and copper are metals.', 2],
    ['Which step is the mistake when Sia says ceramics bend easily?', 'Step 1: Tiles are ceramic.', 'Step 2: They are hard.', 'Step 3: Sia says they bend like wire.', 'Ceramics are hard but brittle, so they crack rather than bend.', 0],
    ['Which step is the mistake when Tito says ceramics rust?', 'Step 1: Iron rusts in water.', 'Step 2: Ceramics resist corrosion.', 'Step 3: Tito says ceramic cups rust.', 'Ceramics resist corrosion, so they do not rust.', 2],
  ], ['b', 'c']),
  ...S('ct', CT, 'CUT_TOOLS', ['CT_WOOD_METAL', 'CT_PLANE', 'CT_BLUNT'], ['Match the tool to the material it cuts.', 'Sharp, clean tools are safer.'], [
    ['Which saw is used to cut metal?', 'A hacksaw', 'A tenon saw', 'A coping saw for wood', 'A bow saw for logs'],
    ['Which tool smooths the surface of a wooden board?', 'A plane', 'A chisel', 'A hacksaw', 'A pair of snips'],
    ['Why should a cutting tool be kept sharp?', 'A sharp tool cuts easily and slips less', 'A blunt tool is safer because it cuts less', 'A sharp tool breaks the wood faster', 'A blunt tool needs less force'],
    ['Which tool cuts curves in thin wood?', 'A coping saw', 'A hacksaw', 'A tenon saw', 'A plane'],
    ['Which tool cuts thin sheet metal?', 'Tin snips', 'A tenon saw', 'A plane', 'A wood chisel'],
  ], [
    ['Mutua must cut an iron bar in the workshop. Which saw does he choose?', 'A hacksaw', 'A tenon saw', 'A coping saw for wood', 'A plane'],
    ['Nancy wants a smooth surface on a table top. Which tool does she use?', 'A plane', 'A chisel', 'A hacksaw', 'A pair of snips'],
    ['A teacher says to sharpen the chisel before use. Why?', 'A sharp tool cuts easily and is less likely to slip', 'A blunt tool is safer to use', 'A sharp tool wastes wood quickly', 'A blunt tool is easier to hold'],
    ['After work, Ouma carries a saw with the points down and keeps a guard on it. Why?', 'To prevent injuries and protect the blade', 'To make the saw blunt', 'To make the blade rusty', 'To make the saw heavier'],
    ['Pauline needs to cut a sheet of tin for a cover. Which tool does she use?', 'Tin snips', 'A tenon saw', 'A plane', 'A chisel'],
  ], [
    ['Which step is the mistake when Lenny uses a tenon saw to cut iron?', 'Step 1: A tenon saw has fine teeth.', 'Step 2: It is used on wood.', 'Step 3: Lenny uses it to cut a steel bar.', 'A hacksaw cuts metal. A tenon saw cuts wood.', 0],
    ['Which step is the mistake when Mona says a chisel smooths a whole board?', 'Step 1: A chisel has a sharp edge.', 'Step 2: It is used for joints.', 'Step 3: Mona says it smooths a whole board.', 'A plane smooths wood. A chisel shapes joints.', 1],
    ['Which step is the mistake when Nate says a blunt tool is safer?', 'Step 1: A blunt tool needs more force.', 'Step 2: Force can make a tool slip.', 'Step 3: Nate says a blunt tool is safer.', 'A sharp tool cuts easily and slips less.', 2],
    ['Which step is the mistake when Olga stores a saw without a guard in a loose pile?', 'Step 1: Tools are put away after use.', 'Step 2: Sharp teeth can cut people.', 'Step 3: Olga says no care is needed.', 'Tools are stored with guards and kept clean and sharp.', 2],
    ['Which step is the mistake when Phil cuts thin sheet metal with a plane?', 'Step 1: A plane has a blade.', 'Step 2: It smooths wood.', 'Step 3: Phil cuts the sheet metal with it.', 'Tin snips cut thin sheet metal.', 1],
  ], ['b', 'd']),
  ...S('sw', SW, 'SOFTWARE', ['SW_TOUCH', 'SW_OS', 'SW_APP'], ['Software is the programs; hardware is the parts you can touch.', 'Think about the task each program does.'], [
    ['Which can you touch?', 'Hardware, such as a mouse', 'Software, such as a word processor', 'An operating system running', 'An application program'],
    ['Which is an operating system?', 'Windows', 'A word processor', 'A spreadsheet', 'An antivirus program'],
    ['Which application is used for calculations in a table?', 'A spreadsheet', 'A word processor', 'A presentation program', 'A web browser'],
    ['Which application is used to write a letter?', 'A word processor', 'A spreadsheet', 'A database', 'An operating system'],
    ['What does utility software such as antivirus do?', 'Looks after and protects the computer', 'Plays videos and music for fun', 'Draws shapes and pictures', 'Types letters for the user'],
  ], [
    ['Quin wants to make slides for a talk. Which application does she use?', 'A presentation program', 'A spreadsheet', 'An operating system', 'An antivirus'],
    ['Rhoda wants to total the monthly sales of a shop. Which application helps?', 'A spreadsheet', 'A word processor', 'A web browser', 'A presentation program'],
    ['A computer needs software to start and run all other programs. What is it?', 'An operating system', 'A word processor', 'A spreadsheet', 'A browser'],
    ['Stan needs to look up a website. Which application does he use?', 'A web browser', 'A word processor', 'A spreadsheet', 'A database'],
    ['A school keeps records of all learners. Which application stores them?', 'A database', 'A presentation program', 'A word processor for letters', 'An operating system'],
  ], [
    ['Which step is the mistake when Uma says software can be touched?', 'Step 1: A mouse is hardware.', 'Step 2: A program is software.', 'Step 3: Uma says software can be held in the hand.', 'Hardware can be touched. Software is the programs.', 0],
    ['Which step is the mistake when Vic says a word processor is an operating system?', 'Step 1: Windows is an operating system.', 'Step 2: A word processor writes letters.', 'Step 3: Vic says a word processor is an operating system.', 'A word processor is an application. Windows and Android are operating systems.', 1],
    ['Which step is the mistake when Wendy says a word processor does calculations?', 'Step 1: A spreadsheet has cells.', 'Step 2: It adds numbers.', 'Step 3: Wendy says a word processor is best for calculations.', 'A spreadsheet is used for tables and calculations.', 2],
    ['Which step is the mistake when Xena says antivirus writes letters?', 'Step 1: Antivirus is utility software.', 'Step 2: It protects the computer.', 'Step 3: Xena says antivirus writes letters.', 'A word processor writes letters. Antivirus protects the computer.', 2],
    ['Which step is the mistake when Yan says a computer runs without an operating system?', 'Step 1: Applications need a base.', 'Step 2: The operating system manages the computer.', 'Step 3: Yan says no operating system is needed.', 'An operating system runs the computer and the applications.', 1],
  ], 'b'),
  ...S('bk', BK, 'BOOKKEEPING', ['BK_BIG_ONLY', 'BK_ASSET', 'BK_CASH'], ['Think about why a shop writes down what comes in and goes out.', 'Cash is paid now and credit is paid later.'], [
    ['Which businesses should keep records?', 'Every business, big or small', 'Only big businesses in towns', 'Only businesses with many workers', 'Only businesses that pay tax'],
    ['A debt owed to a supplier is a...', 'Liability', 'Asset', 'Income', 'Capital'],
    ['A customer takes goods and will pay next week. What is this sale?', 'A credit sale', 'A cash sale', 'A gift', 'A loan from the bank'],
    ['Which is an asset of a business?', 'A delivery van that it owns', 'A bill it has not paid', 'A loan it has not repaid', 'A tax it still owes'],
    ['Why does a business keep records?', 'To know its income, spending and profit', 'To hide the money from the owner', 'To make the shop look busy', 'To avoid paying its suppliers'],
  ], [
    ['Mama Joyce sells vegetables at the roadside. Should she keep records?', 'Yes, to know her income and profit', 'No, only big shops keep records', 'No, a small business never needs them', 'Yes, but only after she pays tax'],
    ['A shop owes KES 5 000 to a supplier. How does the shop list this?', 'As a liability', 'As an asset', 'As cash sales', 'As the capital of the owner'],
    ['A buyer pays KES 300 at once for sugar. What kind of sale is this?', 'A cash sale', 'A credit sale', 'A loan', 'A gift'],
    ['A shop owns a fridge. How does it list the fridge?', 'As an asset', 'As a liability', 'As an expense for the day', 'As a debt owed'],
    ['The owner puts KES 20 000 of her own money into the business. What is this called?', 'Capital', 'A liability to the bank', 'A credit sale', 'An expense'],
  ], [
    ['Which step is the mistake when Zack says only big businesses keep records?', 'Step 1: A kiosk sells airtime.', 'Step 2: The owner wants to know her profit.', 'Step 3: Zack says she does not need records.', 'Every business keeps records to know its income, spending and profit.', 0],
    ['Which step is the mistake when Abby says a debt is an asset?', 'Step 1: A shop owes money to a supplier.', 'Step 2: It must pay it back.', 'Step 3: Abby says the debt is an asset.', 'What a business owes is a liability. What it owns is an asset.', 1],
    ['Which step is the mistake when Bob calls a credit sale a cash sale?', 'Step 1: A customer takes goods.', 'Step 2: He will pay next week.', 'Step 3: Bob says it is a cash sale.', 'A credit sale is paid later. A cash sale is paid now.', 2],
    ['Which step is the mistake when Cleo says expenditure is money coming in?', 'Step 1: Income is money coming in.', 'Step 2: Expenditure is spending.', 'Step 3: Cleo says expenditure is money coming in.', 'Expenditure is money spent. Income is money coming in.', 0],
    ['Which step is the mistake when Dino says the capital is money owed to a bank?', 'Step 1: The owner puts in her own money.', 'Step 2: That money starts the business.', 'Step 3: Dino says it is money owed to a bank.', 'Capital is what the owner puts in, not what the business owes.', 1],
  ], 'b'),
  ...S('bu', IB, 'BUDGET', ['BU_INCOME', 'BU_NO_NEED', 'BU_UNETHICAL'], ['Think about what brings money in and how to plan spending.', 'An honest budget is open about money.'], [
    ['Which is a source of income?', 'A salary from a job', 'A bill for electricity', 'A fee to be paid', 'A loan to be repaid'],
    ['Why make a budget?', 'To plan income and spending and save some', 'Because planning money is not needed', 'To spend all the money at once', 'To hide where the money goes'],
    ['Which is unethical in budgeting?', 'Hiding spending from the family', 'Planning to save part of the income', 'Putting needs before wants', 'Writing down all the income'],
    ['Which should come first in a budget?', 'Needs such as food and school fees', 'Wants such as sweets and toys', 'Treats for friends only', 'Unplanned shopping trips'],
    ['What is money from selling farm produce called?', 'Income from sales', 'A liability', 'An expense', 'A gift to the buyer'],
  ], [
    ['Wanjala earns money selling mangoes at the market. What is this money?', 'Income from his business', 'A bill he must pay', 'A loan he must repay', 'A tax paid to the county'],
    ['Pam gets KES 1 000 and plans how to use it. Why is a budget useful?', 'It helps her spend wisely and save', 'It helps her spend everything at once', 'It makes her money double', 'It is not useful at all'],
    ['A man uses money meant for school fees to buy a radio, and hides it. Is this ethical?', 'No, it is dishonest use of money', 'Yes, because the money was his', 'Yes, as nobody saw it', 'Yes, since radios are needed'],
    ['A family lists food and fees before buying new shoes. Why?', 'Needs come before wants', 'Wants come before needs', 'Shoes are always cheaper', 'Food can wait'],
    ['Which is an honest budget practice?', 'Writing down all income and spending', 'Leaving out spending to look richer', 'Borrowing with no plan to repay', 'Cheating a buyer on the price'],
  ], [
    ['Which step is the mistake when Abel says a bill is income?', 'Step 1: Income is money that comes in.', 'Step 2: A bill is money that must be paid.', 'Step 3: Abel says a bill is a source of income.', 'A bill is spending. A salary or sales is income.', 0],
    ['Which step is the mistake when Bea says a budget is not needed?', 'Step 1: Money can run out.', 'Step 2: A budget plans how it is used.', 'Step 3: Bea says planning is of no use.', 'A budget plans spending so that needs come first and some is saved.', 1],
    ['Which step is the mistake when Chege hides his spending from the family?', 'Step 1: He spends on a toy.', 'Step 2: He does not tell anyone.', 'Step 3: He says hiding spending is honest.', 'Hiding spending or using money meant for something else is unethical.', 2],
    ['Which step is the mistake when Dee puts wants before needs?', 'Step 1: She has KES 500.', 'Step 2: Food is a need.', 'Step 3: She buys sweets first and no food.', 'Needs come first in a budget.', 1],
    ['Which step is the mistake when Eli says gifts are not income?', 'Step 1: Money from gifts comes in.', 'Step 2: Income is money coming in.', 'Step 3: Eli says gifts are not income at all.', 'Gifts and pocket money are sources of income.', 0],
  ], ['b', 'd']),
  ...S('mk', MK, 'MARKETING', ['MK_SELLING_ONLY', 'MK_INFO', 'MK_FACTOR', 'MK_TOOL'], ['Marketing helps a business find customers.', 'Think about what customers want and how they hear about goods.'], [
    ['What does marketing do for a business?', 'Finds customers and tells them about goods', 'Only takes the money at the till', 'Only counts the goods in the store', 'Only cleans the shop'],
    ['Which is a source of market information?', 'Asking customers or a survey', 'Guessing without asking anyone', 'Closing the shop for a week', 'Counting the shop\'s windows'],
    ['Which is a factor in choosing a market?', 'Customer demand and location', 'The colour of the shop door', 'The name of the shop cat', 'The weather on the day'],
    ['Which is a marketing tool?', 'A poster or a radio advert', 'A broken door at the shop', 'A closed notice on the door', 'A pile of empty boxes'],
    ['Which helps a trader know what customers want?', 'Watching what competitors sell and asking buyers', 'Staying at home all day', 'Selling nothing for a month', 'Changing the shop name daily'],
  ], [
    ['A new tailor wants customers to know about her shop. What should she do?', 'Make a poster and tell people', 'Wait for customers to find her', 'Close the shop for a whole week', 'Sell only to her own family'],
    ['A trader asks buyers what they would like to buy. What is this?', 'Collecting market information', 'Cleaning and tidying the shop', 'Counting the stock on the shelves', 'Closing the shop for the day'],
    ['Where should a shop selling school bags open?', 'Near a school where buyers pass', 'Far from any buyers or any road', 'In a quiet place nobody visits', 'Where no school can be seen'],
    ['A shop gives free samples of a new juice. What is this?', 'A marketing tool', 'A wasted product', 'A debt to the supplier', 'A tax payment'],
    ['A baker watches what the next bakery sells and its price. Why?', 'To learn about competitors and the market', 'To copy the paint colour of the walls', 'To close the shop for the week', 'To count the customers\' shoes at the door'],
  ], [
    ['Which step is the mistake when Fay says marketing is only taking money?', 'Step 1: A shop sells goods.', 'Step 2: Customers need to hear about the goods.', 'Step 3: Fay says marketing is only taking money at the till.', 'Marketing helps a business find customers and sell.', 0],
    ['Which step is the mistake when Gus says guessing is the best market information?', 'Step 1: Information helps a business.', 'Step 2: A survey asks customers.', 'Step 3: Gus says guessing is best.', 'Asking customers, surveys and watching competitors give market information.', 1],
    ['Which step is the mistake when Hope says the shop door colour decides the market?', 'Step 1: A trader chooses where to sell.', 'Step 2: Demand and location matter.', 'Step 3: Hope says the door colour matters most.', 'Demand, price, location and competition matter in choosing a market.', 2],
    ['Which step is the mistake when Ike says a broken door is a marketing tool?', 'Step 1: A poster promotes goods.', 'Step 2: A radio advert does too.', 'Step 3: Ike says a broken door promotes goods.', 'Posters, radio, social media and samples are marketing tools.', 3],
    ['Which step is the mistake when Jill says marketing is not needed for a new shop?', 'Step 1: A new shop has no customers yet.', 'Step 2: People must learn about it.', 'Step 3: Jill says marketing is not needed.', 'Marketing helps a business find customers.', 0],
  ], ['b', 'c', 'd']),
  fam('mk.why', `${MK}MARKETING`, 'word', 2, choose([
    c('Why does a new shop need marketing?', 'So that customers learn the shop exists', 'Marketing helps a business find customers and sell.', ['M_PT8_MK_SELLING_ONLY', 'So that the shop can close earlier each day', 'So that goods stay unsold on the shelves'], ['M_PT8_MK_INFO', 'So that the owner can guess what buyers want']),
    c('Which is the best reason for a shop to advertise?', 'To bring more customers to buy its goods', 'Marketing helps a business find customers and sell.', ['M_PT8_MK_SELLING_ONLY', 'To keep the till drawer from opening at all', 'To make customers forget the shop name'], ['M_PT8_MK_TOOL', 'To fill the shop with empty broken boxes']),
    c('What does marketing help a business to do?', 'Reach buyers and sell more goods', 'Marketing helps a business find customers and sell.', ['M_PT8_MK_SELLING_ONLY', 'Hide the goods from buyers in the store', 'Count its money and then stop trading'], ['M_PT8_MK_FACTOR', 'Choose a shop door colour']),
    c('A trader says marketing is only the work at the till. What is wrong with this?', 'Marketing also finds customers and tells them about goods', 'Marketing helps a business find customers and sell.', ['M_PT8_MK_SELLING_ONLY', 'Nothing, marketing is only taking the money', 'Marketing is only cleaning the shop each day'], ['M_PT8_MK_INFO', 'Marketing is only guessing what buyers need']),
    c('Why do businesses study the market before they sell?', 'To know what buyers want and will pay for', 'Marketing helps a business find customers and sell.', ['M_PT8_MK_INFO', 'To guess what buyers want without asking them', 'To avoid meeting any buyers at all'], ['M_PT8_MK_SELLING_ONLY', 'To count only the money at the till']),
  ], { h: ['Marketing helps a business find customers.', 'Think about what customers want and how they hear about goods.'], s1: 'Marketing helps a business find customers.' }), 'a'),
  ...S('ds', DI, 'DISTRIBUTION', ['DS_MIDDLEMAN_BAD', 'DS_CHANNEL', 'DS_ETHICS'], ['Follow goods from the producer to the buyer.', 'Fair and honest trade is ethical.'], [
    ['What does a wholesaler do?', 'Buys in bulk and sells to retailers', 'Does nothing useful at all', 'Sells only one item to each buyer', 'Grows the goods on a farm'],
    ['Which is the longest channel of distribution?', 'Producer, wholesaler, retailer, consumer', 'Producer to consumer directly', 'Consumer to producer only', 'Retailer to retailer only'],
    ['Which is ethical in distribution?', 'Giving honest weights and fair prices', 'Hiding goods to raise the price', 'Giving short weights to buyers', 'Delivering spoilt goods to buyers'],
    ['What does a retailer do?', 'Sells goods to the final buyer', 'Makes the goods in a factory', 'Buys from no one at all', 'Sells only to other wholesalers'],
    ['What does an agent do?', 'Brings buyers and sellers together', 'Grows the crops for sale', 'Makes the goods in a workshop', 'Keeps all the goods for himself'],
  ], [
    ['A farmer sells maize straight to a family at his gate. Which channel is this?', 'Producer to consumer', 'Producer to wholesaler to retailer', 'Wholesaler to retailer only', 'Retailer to wholesaler'],
    ['A shop buys a sack of sugar from a wholesaler and sells it by the kilogram. Who is the shopkeeper?', 'A retailer', 'A producer', 'An agent', 'A consumer'],
    ['A trader hides sacks of flour to sell at a higher price when it is scarce. Is this ethical?', 'No, hoarding is unfair to buyers', 'Yes, because the flour is his', 'Yes, as prices must go up', 'Yes, since hiding is allowed'],
    ['A shopkeeper uses a scale that shows less than the real weight. Is this ethical?', 'No, it cheats the buyer', 'Yes, it saves the shopkeeper money', 'Yes, as customers never notice', 'Yes, because scales can be wrong'],
    ['A person finds buyers for a farmer and takes a small fee. What is he?', 'An agent', 'A producer', 'A retailer', 'A consumer'],
  ], [
    ['Which step is the mistake when Kyle says wholesalers do nothing useful?', 'Step 1: A farmer grows maize.', 'Step 2: A wholesaler buys many sacks.', 'Step 3: Kyle says wholesalers do nothing useful.', 'Wholesalers buy in bulk and sell to retailers.', 0],
    ['Which step is the mistake when Lia says the longest channel has no middlemen?', 'Step 1: A channel is a path for goods.', 'Step 2: Some channels have more steps.', 'Step 3: Lia says the longest channel has no middlemen.', 'The longest channel has a wholesaler and a retailer between producer and consumer.', 1],
    ['Which step is the mistake when Max says hoarding is fair?', 'Step 1: Goods are scarce.', 'Step 2: A trader hides them.', 'Step 3: Max says this is fair trade.', 'Hoarding is unfair. Honest weights and fair prices are ethical.', 2],
    ['Which step is the mistake when Nia says a retailer makes the goods?', 'Step 1: A retailer has a shop.', 'Step 2: He buys from a wholesaler.', 'Step 3: Nia says he makes the goods.', 'A retailer sells goods to the final buyer.', 0],
    ['Which step is the mistake when Ona says cheating on weights is allowed?', 'Step 1: A buyer pays for a kilogram.', 'Step 2: The scale shows less.', 'Step 3: Ona says this is allowed.', 'Honest weights and measures are ethical. Cheating is not.', 2],
  ], ['b', 'c']),
];
