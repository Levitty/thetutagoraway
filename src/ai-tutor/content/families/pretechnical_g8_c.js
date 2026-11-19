// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 8, THE SEVEN SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): putting out a fire,
// constructing combined shapes, scale sizes, visual programming, using cutting tools, simple financial statements and a budget.
// The app asks the method, the order, the size or the figure; the doing is marked by the teacher with the KICD rubric.
// Every wrong answer names the library misconception it reveals; the figures were worked by hand and are for the teacher to check.
// Fire and tool safety lines are for the teacher to confirm first. All stay reviewed:false.
// ============================================================================
import { T } from './pretechnical_g8_lib.js';

const M = (...s) => s.map(x => `M_PT8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('fe', 'FOUNDA.FIRE_SAFETY.FIRE_EXTINGUISH', M('FE_WATER_OIL', 'FE_WATER_ELEC', 'FE_AIM_TOP', 'FE_RUN', 'FE_FIGHT_FIRST'),
    ['Ask what is burning, and which of heat, fuel or air you can take away safely.', 'Smother burning oil, switch off power before an electrical fire, aim at the base, stop drop and roll, and raise the alarm first for a growing fire.'], [
      ['A pan of cooking oil catches fire. What do you do?', 'Turn off the heat and cover it', 'Pour water on it at once|0', 'Aim water at the tops of the flames|2', 'Run outside to fetch water|3'],
      ['A computer socket is on fire. What is done first, if it is safe?', 'Switch off the power at the main', 'Throw a bucket of water on it|1', 'Aim at the tops of the flames|2', 'Pour water on the cables|1'],
      ['Where is a fire extinguisher aimed?', 'At the base of the fire', 'At the tops of the flames|2', 'At the smoke above it|2', 'At the ceiling|2'],
      ['Your clothes catch fire. What do you do?', 'Stop, drop and roll', 'Run to find water|3', 'Run outside into the wind|3', 'Fight the fire with a bucket|4'],
      ['A fire in the store is spreading fast. What comes first?', 'Raise the alarm and get everyone out', 'Fight it alone with a bucket|4', 'Pour water on the oil|0', 'Aim at the flame tops|2'],
    ], [
      ['Achieng\'s sufuria of oil bursts into flames on the jiko. Her brother runs for water. What should she do instead?', 'Cover it with a lid or damp cloth', 'Let him pour the water on it at once|0', 'Aim water at the flame tops|2', 'Run out of the kitchen|3'],
      ['The extension cable in the computer lab starts to burn. Kamau grabs a bucket of water. What is right?', 'Switch off the power, then use CO2', 'Throw the bucket of water on it now|1', 'Aim the water at the tops|2', 'Fight it before telling anyone|4'],
      ['Wanjiku uses the extinguisher on a bin fire, spraying the flame tips. The fire keeps burning. Why?', 'She should aim at the base', 'She used too little water|0', 'She should switch off the power|1', 'She should run away|3'],
      ['Kibet\'s sleeve catches fire at a bonfire. He starts to run. What should he do?', 'Stop, drop and roll', 'Run faster to the tap|3', 'Throw water at the bonfire|0', 'Fight the bonfire first|4'],
      ['Smoke is pouring from the dormitory. Otieno wants to fight it alone with a bucket. What should he do first?', 'Raise the alarm and get people out', 'Fight it alone first with the bucket|4', 'Aim at the smoke|2', 'Pour water on the sockets|1'],
    ], [
      ['Faith explains a kitchen fire. ' + STEP, 'The oil in the pan caught fire.', 'She turned off the gas.', 'She poured water on the pan to cool it.', 'Never pour water on burning oil; cover the pan.', 0],
      ['Brian explains an electrical fire. ' + STEP, 'A socket in the office started burning.', 'He called the teacher.', 'He threw water on it while the power was on.', 'Switch off the power first, then use CO2 or dry powder.', 1],
      ['Nekesa explains using an extinguisher. ' + STEP, 'She pulled the pin.', 'She stood a safe distance away.', 'She aimed at the tops of the flames.', 'Aim at the base, sweeping from side to side.', 2],
      ['Juma explains what to do if clothes burn. ' + STEP, 'Fire needs air to keep burning.', 'Running feeds it more air.', 'So the person should run to find water.', 'Stop, drop and roll to smother it.', 3],
      ['Wairimu explains a fire drill. ' + STEP, 'She saw smoke in the library.', 'The fire was growing.', 'She fought it alone before telling anyone.', 'Raise the alarm and get everyone out first.', 4],
    ]),

  ...T('gc', 'COMMUN.PLANE_GEOMETRY.GEOM_CONSTRUCT', M('GC_HEX_SIDE', 'GC_BISECT_SHORT', 'GC_SLOT_RADIUS', 'GC_PROTRACTOR'),
    ['Think about which length each construction step uses.', 'A hexagon\'s side equals the radius, a bisecting compass is more than half the line, a slot end has a radius of half its width, and 60 degrees comes from equal arcs.'], [
      ['A hexagon is drawn in a circle of radius 30 mm. What length is each side?', '30 mm', '60 mm|0', '15 mm|0', '90 mm|0'],
      ['To bisect line AB, what is the compass set to?', 'More than half of AB', 'Less than half of AB|1', 'Exactly a quarter of AB|1', 'Any small width|1'],
      ['A slot is 20 mm wide. What radius are its semicircular ends?', '10 mm', '20 mm|2', '40 mm|2', '5 mm|2'],
      ['How is a 60 degree angle constructed without a protractor?', 'Two equal arcs from the line', 'It cannot be; a protractor is needed|3', 'With a compass set less than half|1', 'By stepping the diameter|0'],
      ['A hexagon is drawn in a circle of diameter 80 mm. What is the compass set to when stepping off the sides?', '40 mm', '80 mm|0', '160 mm|0', '20 mm|0'],
    ], [
      ['Wekesa steps off a hexagon in a 50 mm diameter circle with his compass at 50 mm. It does not close. What should he use?', '25 mm, the radius', '50 mm, as he did|0', '100 mm|0', 'Less than half the line|1'],
      ['Mwende sets her compass to less than half of her line to bisect it. The arcs do not meet. What should she do?', 'Set it to more than half the line', 'Make it even smaller|1', 'Use the diameter|0', 'Use a protractor only|3'],
      ['Ali draws a slot 30 mm wide and uses 30 mm as the radius of the ends. They are too big. What radius is right?', '15 mm', '30 mm|2', '60 mm|2', '45 mm|2'],
      ['Zawadi has no protractor and says she cannot draw 60 degrees. What can she do?', 'Use equal compass arcs', 'Nothing, a protractor is needed|3', 'Step off with the diameter|0', 'Set the compass very short|1'],
      ['A sign is a 40 mm wide slot with semicircular ends. Where are the centres of the ends?', 'On the centre line, radius 20 mm', 'On the edge, radius 40 mm|2', 'Anywhere, radius 80 mm|2', 'Found with a protractor only|3'],
    ], [
      ['Kioko explains his hexagon. ' + STEP, 'He drew a circle of radius 35 mm.', 'He kept the compass at the same setting.', 'He stepped round the circle with the diameter, 70 mm.', 'Step off with the radius, 35 mm.', 0],
      ['Halima explains bisecting a line. ' + STEP, 'She drew line AB.', 'She drew arcs from A and from B.', 'She set the compass to less than half of AB.', 'Set it to more than half of AB so the arcs cross.', 1],
      ['Peter explains drawing a slot. ' + STEP, 'The slot is 24 mm wide.', 'He marked the centres on the centre line.', 'He set the compass to 24 mm for the ends.', 'The radius is half the width, 12 mm.', 2],
      ['Mumbi explains a 60 degree angle. ' + STEP, 'She drew a line and marked a point.', 'She drew an arc from the point.', 'She then said she needed a protractor to finish.', 'Arc again with the same radius from where it cuts; join to the crossing.', 3],
      ['Ouma explains a 90 degree angle. ' + STEP, 'He bisected a straight line.', 'He used arcs from both ends.', 'He set the compass to less than half the line.', 'The setting must be more than half the line.', 1],
    ]),

  ...T('sv', 'COMMUN.PLAIN_SCALE_DRAWING.SCALE_CONVERT', M('SV_UNITS', 'SV_MULTIPLY', 'SV_ENLARGE', 'SV_FIT'),
    ['Change the real size to millimetres first, then divide for a reduction or multiply for an enlargement.', 'At 1:50 divide the millimetres by 50; at 2:1 multiply by 2; choose a scale that keeps the drawing on the sheet.'], [
      ['A wall is 6 m long. How long is it drawn at 1:50?', '120 mm', '0.12 mm|0', '300,000 mm|1', '12 mm|0'],
      ['A table top is 2 m long. How long is it drawn at 1:20?', '100 mm', '40,000 mm|1', '0.1 mm|0', '10 mm|0'],
      ['A screw is 15 mm long. How long is it drawn at 2:1?', '30 mm', '7.5 mm|2', '3 mm|2', '0.03 mm|0'],
      ['A room is 8 m long. Which scale fits it on an A4 sheet about 297 mm long?', '1:50, giving 160 mm', '1:10, giving 800 mm|3', '1:5, giving 1,600 mm|3', '2:1, giving 16,000 mm|3'],
      ['A door is 2,100 mm high. How high is it drawn at 1:30?', '70 mm', '63,000 mm|1', '0.07 mm|0', '7 mm|0'],
    ], [
      ['Njeri draws her 4 m classroom wall at 1:100. She writes 0.04 mm. What should it be?', '40 mm', '0.04 mm|0', '400,000 mm|1', '4 mm|0'],
      ['Omondi draws a 3 m bench at 1:20 and gets 60,000 mm. What did he do wrong?', 'He multiplied; it is 150 mm', 'Nothing, 60,000 mm is right|1', 'He forgot to change to cm|0', 'He should use 2:1|2'],
      ['Chebet draws a 12 mm washer at 2:1. Her drawing is 6 mm. What should it be?', '24 mm', '6 mm|2', '3 mm|2', '0.024 mm|0'],
      ['Kevin tries 1:10 for a 10 m hall on an A3 sheet about 420 mm long, and runs off the page. Which scale should he use?', '1:50, giving 200 mm', '1:10, giving 1,000 mm|3', '1:20, giving 500 mm|3', '1:5, giving 2,000 mm|3'],
      ['Amina draws a 1.5 m gate at 1:25 and her line is 6 mm long. What should it be?', '60 mm', '37,500 mm|1', '0.06 mm|0', '6 mm|0'],
    ], [
      ['Kimani works out a 5 m wall at 1:50. ' + STEP, '5 m is 5,000 mm.', 'This is a reduction, so he divides.', '5,000 x 50 = 250,000 mm.', 'Divide: 5,000 / 50 = 100 mm.', 1],
      ['Rose works out a 9 m fence at 1:100. ' + STEP, 'The scale 1:100 is a reduction.', 'She divides by 100.', '9 / 100 = 0.09 mm.', 'Change to millimetres first: 9,000 / 100 = 90 mm.', 0],
      ['Daudi works out a 20 mm nut at 2:1. ' + STEP, '2:1 is an enlargement.', 'The real size is 20 mm.', '20 / 2 = 10 mm.', 'Multiply for an enlargement: 20 x 2 = 40 mm.', 2],
      ['Lucy chooses a scale for a 7 m room on A4. ' + STEP, 'A4 is about 297 mm long.', '7 m is 7,000 mm.', 'At 1:10 the room is 700 mm, so 1:10 fits.', '700 mm is bigger than the sheet; use 1:50 (140 mm).', 3],
      ['Salim works out a 2.4 m door at 1:20. ' + STEP, '2.4 m is 2,400 mm.', '1:20 is a reduction.', '2,400 x 20 = 48,000 mm.', 'Divide: 2,400 / 20 = 120 mm.', 1],
    ]),

  ...T('vs8', 'COMMUN.VISUAL_PROGRAMMING.VP_SEQUENCE', M('VS_ORDER', 'VS_LOOP', 'VS_NO_EVENT', 'VS_IF_ALWAYS'),
    ['Read the blocks from the top, check the event block and count the repeats.', 'Blocks run top to bottom under an event block, a repeat block runs its blocks the stated number of times, and an if-block runs only when its condition is true.'], [
      ['Under "when green flag clicked": repeat 4 [move 100, turn 90]. What does the sprite draw?', 'A square', 'One straight line|1', 'A triangle|1', 'Nothing, there is no event|2'],
      ['A stack has "open door" then "walk to door". What is wrong?', 'The order: it opens before it gets there', 'Nothing, order does not matter|0', 'It needs a repeat block|1', 'The if-block always runs|3'],
      ['Some blocks sit alone with no event block on top. What happens when the flag is clicked?', 'They do not run', 'They run as usual|2', 'They run twice|1', 'They run in any order|0'],
      ['"if touching water then say Splash". The sprite is not touching water. What happens?', 'Nothing is said', 'It says Splash anyway|3', 'It says Splash four times|1', 'The blocks run backwards|0'],
      ['Under the flag: repeat 3 [move 50, turn 120]. What is drawn?', 'A triangle', 'One line of 50 steps|1', 'Nothing; repeat runs once|1', 'A square|1'],
    ], [
      ['Wafula wants his robot to pick up a ball and then put it in a box. His blocks say "drop in box" then "pick up ball". What happens?', 'It drops nothing, then picks up', 'The same as the right order|0', 'It repeats four times|1', 'Nothing runs at all|2'],
      ['Moraa writes repeat 6 [move 40, turn 60] under the flag. She expects one line. What will she see?', 'A hexagon', 'One straight line|1', 'Nothing, no event|2', 'Only when it touches|3'],
      ['Baraka puts his blocks on the screen but forgets "when green flag clicked". He clicks the flag. What happens?', 'Nothing runs', 'All the blocks run|2', 'Only the if-block runs|3', 'They run in any order|0'],
      ['A game says: if score = 10 then say "You win". Score is 7. Kendi thinks it says You win. What happens?', 'Nothing is said yet', 'It says You win anyway|3', 'It says it 10 times|1', 'It does not need an event|2'],
      ['A traffic light program should show red, then green. Its blocks show green first. What should Hassan do?', 'Swap the blocks so red is first', 'Leave them, order does not matter|0', 'Remove the event block|2', 'Put both in a repeat 1|1'],
    ], [
      ['Atieno explains her square program. ' + STEP, 'She started with "when green flag clicked".', 'She used repeat 4 with move 100 and turn 90.', 'The repeat block runs its blocks only once, so it draws one side.', 'Repeat 4 runs them four times and draws a square.', 1],
      ['Kiprop explains his door program. ' + STEP, 'The robot must walk to the door, then open it.', 'He put "open door" above "walk to door".', 'The order of blocks does not matter, so it works.', 'Blocks run top to bottom; walk to the door first.', 0],
      ['Grace explains starting a program. ' + STEP, 'She built a stack of move blocks.', 'She left out the event block.', 'When she clicked the flag, the stack ran.', 'A stack needs an event block on top to run.', 2],
      ['Ochieng explains an if-block. ' + STEP, 'The block says if touching edge then turn.', 'The sprite was in the middle.', 'The sprite turned anyway, because if-blocks always run.', 'The blocks inside run only when the condition is true.', 3],
      ['Joy explains a triangle. ' + STEP, 'She used the green flag event.', 'She used repeat 3 with move and turn 120.', 'She expected one straight line, since repeat runs once.', 'Repeat 3 runs three times and draws a triangle.', 1],
    ]),

  ...T('cu8', 'TOOLS_.CUTTING_TOOLS.CUT_USE', M('CU_TOWARDS', 'CU_HAND_HOLD', 'CU_BLADE_BACK', 'CU_PRESS_HARD', 'CU_CARRY'),
    ['Ask where the edge would go if it slipped, and what holds the work.', 'Clamp the work, cut away from the body, fit hacksaw teeth away from the handle, start gently, and carry edged tools pointing down.'], [
      ['Which way is a chisel pushed?', 'Away from the body', 'Towards the body for control|0', 'Towards the holding hand|0', 'In any direction|0'],
      ['How is a small piece of wood held for sawing?', 'Clamped in a vice', 'In one hand while the other saws|1', 'Held between the knees|1', 'Pressed down with a foot|1'],
      ['Which way do hacksaw teeth point?', 'Away from the handle', 'Towards the handle|2', 'Up towards the frame|2', 'It does not matter|2'],
      ['How is a saw cut started?', 'Light strokes to make a groove', 'Press hard with fast short strokes|3', 'One heavy push|3', 'Pull back hard first|3'],
      ['How is a chisel carried in the workshop?', 'In the hand, edge pointing down', 'In a pocket, blade up|4', 'Edge up over the shoulder|4', 'Thrown to a friend|4'],
    ], [
      ['Musa trims a stick with a knife, cutting towards his thumb. What is the danger?', 'The blade can slip into his hand', 'None, it gives more control|0', 'The stick is clamped|1', 'The teeth face the handle|2'],
      ['Wanjiru holds a short piece of metal in one hand and hacksaws it with the other. What should she do?', 'Hold it in a vice', 'Hold it tighter in her hand|1', 'Saw faster|3', 'Cut towards her body|0'],
      ['Kibet\'s hacksaw barely cuts on the forward stroke. The teeth point to the handle. What should he do?', 'Turn the blade so teeth point away', 'Press harder and faster|3', 'Hold the work in his hand|1', 'Carry it in his pocket|4'],
      ['Esther starts her saw cut by pressing hard with fast strokes. The saw jumps out of the line. What is better?', 'Light strokes to start a groove', 'Even harder strokes|3', 'Holding the wood in her hand|1', 'Teeth towards the handle|2'],
      ['Odhiambo walks to the bench with a chisel in his shirt pocket, blade up. What should he do?', 'Carry it in his hand, edge down', 'Keep it in his pocket|4', 'Hold it edge up|4', 'Cut towards his body|0'],
    ], [
      ['Achieng explains chiselling. ' + STEP, 'She clamped the wood in the vice.', 'She kept both hands behind the edge.', 'She pushed the chisel towards her body for control.', 'Cut away from the body.', 0],
      ['Ali explains sawing a small piece. ' + STEP, 'He marked the cutting line.', 'He chose a tenon saw.', 'He held the piece in one hand while sawing with the other.', 'Clamp it in a vice or with a G-clamp.', 1],
      ['Nduta explains fitting a hacksaw blade. ' + STEP, 'She loosened the wing nut.', 'She put the blade on the pins.', 'She set the teeth pointing towards the handle.', 'Teeth point away from the handle.', 2],
      ['Barasa explains starting a cut. ' + STEP, 'He put the saw on the line.', 'He held the work firmly.', 'He pressed hard with fast short strokes.', 'Start with light strokes, then long steady strokes.', 3],
      ['Shiru explains moving with tools. ' + STEP, 'She finished her cut.', 'She took the chisel to the rack.', 'She carried it in her pocket with the blade up.', 'Carry it in the hand by the side, edge down.', 4],
    ]),

  ...T('fs', 'ENTREP.BOOKKEEPING.FIN_STATEMENTS', M('FS_SALES_PROFIT', 'FS_GROSS_NET', 'FS_CAPITAL_ADD', 'FS_CASH_ADD'),
    ['Write the rule first, then put the figures in.', 'Gross profit = sales - cost of goods; net profit = gross profit - expenses; capital = assets - liabilities; closing cash = opening + received - paid.'], [
      ['Sales are 20,000 shillings and the goods cost 12,000. Expenses are 3,000. What is the net profit?', '5,000 shillings', '20,000 shillings|0', '8,000 shillings|1', '35,000 shillings|0'],
      ['A shop has assets of 50,000 and liabilities of 10,000 shillings. What is the capital?', '40,000 shillings', '60,000 shillings|2', '50,000 shillings|2', '5,000 shillings|2'],
      ['Opening cash is 2,000. 5,000 is received and 3,500 paid out. What is the closing cash?', '3,500 shillings', '10,500 shillings|3', '7,000 shillings|3', '1,500 shillings|3'],
      ['Sales are 15,000 and the goods cost 9,000. What is the gross profit?', '6,000 shillings', '15,000 shillings|0', '24,000 shillings|0', '9,000 shillings|0'],
      ['Gross profit is 10,000 and expenses are 4,000. What is the net profit?', '6,000 shillings', '10,000 shillings|1', '14,000 shillings|1', '4,000 shillings|1'],
    ], [
      ['Mama Wanjiku sold vegetables for 8,000 shillings. They cost her 5,000 and transport was 1,000. She says her profit is 8,000. What is her net profit?', '2,000 shillings', '8,000 shillings|0', '3,000 shillings|1', '14,000 shillings|0'],
      ['A school tuck shop has stock and cash worth 30,000 and owes a supplier 6,000. Kioko adds them for the capital. What is it?', '24,000 shillings', '36,000 shillings|2', '30,000 shillings|2', '6,000 shillings|2'],
      ['Juma started the week with 1,500, received 4,000 and paid out 2,500. He wrote 8,000 as his cash. What should it be?', '3,000 shillings', '8,000 shillings|3', '5,500 shillings|3', '2,500 shillings|3'],
      ['Chebet\'s bead business made a gross profit of 6,000 and paid 2,500 in expenses. What is her net profit?', '3,500 shillings', '6,000 shillings|1', '8,500 shillings|1', '2,500 shillings|1'],
      ['A tailor sold clothes for 25,000. The cloth cost 14,000 and rent was 5,000. What is the net profit?', '6,000 shillings', '25,000 shillings|0', '11,000 shillings|1', '44,000 shillings|0'],
    ], [
      ['Otieno works out his profit. ' + STEP, 'His sales were 12,000 shillings.', 'His goods cost 7,000 and expenses were 2,000.', 'So his profit is 12,000, the total sales.', 'Net profit = 12,000 - 7,000 - 2,000 = 3,000.', 0],
      ['Wambui works out her net profit. ' + STEP, 'Sales were 18,000 and goods cost 10,000.', 'Gross profit is 8,000.', 'So her net profit is also 8,000.', 'Take away the expenses from gross profit to get net profit.', 1],
      ['Kibet works out his capital. ' + STEP, 'His assets are 45,000 shillings.', 'His liabilities are 15,000 shillings.', 'Capital = 45,000 + 15,000 = 60,000.', 'Capital = assets - liabilities = 30,000.', 2],
      ['Nekesa works out her closing cash. ' + STEP, 'Opening cash was 3,000.', 'She received 6,000 and paid out 4,000.', 'Closing cash = 3,000 + 6,000 + 4,000 = 13,000.', 'Take away money paid out: 3,000 + 6,000 - 4,000 = 5,000.', 3],
      ['Peter checks a statement. ' + STEP, 'Gross profit = sales - cost of goods.', 'Net profit = gross profit - expenses.', 'Capital = assets + liabilities.', 'Capital = assets - liabilities.', 2],
    ]),

  ...T('bp', 'ENTREP.INCOME_AND_BUDGETING.BUDGET_PREPARE', M('BP_DEFICIT', 'BP_WANTS_FIRST', 'BP_SAVE_LAST', 'BP_SURPLUS_LOSS'),
    ['Total the spending, take it from the income, and put needs and saving first.', 'Balance = income - spending: positive is a surplus, negative is a deficit. Needs come before wants and saving is planned at the start.'], [
      ['Income is 3,000 shillings and planned spending is 3,400. What is the budget?', 'In deficit by 400', 'Balanced|0', 'In surplus by 400|3', 'A profit of 3,400|0'],
      ['Which item goes into a learner\'s budget first?', 'Bus fare to school', 'A new phone cover|1', 'Sweets for the weekend|1', 'A music download|1'],
      ['When is saving put into a budget?', 'At the start, as a planned item', 'Only if money is left at the end|2', 'Never, it is not spending|2', 'After all the wants|1'],
      ['Income is 2,500 and spending is 2,100. What is the 400 left over?', 'A surplus', 'A loss|3', 'A deficit|0', 'A want|1'],
      ['A budget is in deficit. What can fix it?', 'Cut wants or raise income', 'Call it balanced|0', 'Stop saving and buy more wants|2', 'Call the deficit a surplus|3'],
    ], [
      ['Atieno gets 1,000 shillings pocket money and plans to spend 1,200. She says her budget is balanced. What is it?', 'In deficit by 200', 'Balanced|0', 'In surplus by 200|3', 'A loss of 1,000|3'],
      ['Wekesa\'s budget lists a new football, then airtime, then school lunch money. What should come first?', 'School lunch money', 'The new football|1', 'Airtime for chatting|1', 'Whatever costs most|1'],
      ['Faith saves only what is left at the end of each month, and it is always nothing. What should she do?', 'Plan saving at the start', 'Keep saving at the end|2', 'Spend on wants first|1', 'Call it a surplus|3'],
      ['Mutua earns 4,000 from a holiday job and spends 3,300. He calls the 700 a loss. What is it?', 'A surplus he can save', 'A loss|3', 'A deficit|0', 'Balanced|0'],
      ['Halima\'s budget shows income 2,000 and spending 2,600. Which is a good fix?', 'Drop some wants from the list', 'Call it balanced|0', 'Stop planned saving only|2', 'Add a new want|1'],
    ], [
      ['Kamau checks his budget. ' + STEP, 'His income is 1,500 shillings.', 'His spending totals 1,800.', 'So his budget is balanced.', 'Spending is more than income: a deficit of 300.', 0],
      ['Njeri plans her spending. ' + STEP, 'She listed her income first.', 'She listed her items.', 'She put a new bag before her bus fare.', 'Plan needs, such as bus fare, before wants.', 1],
      ['Omar plans saving. ' + STEP, 'He wants to save for a bicycle.', 'He made a budget.', 'He will save only what is left at the end.', 'Put saving in at the start, as a planned item.', 2],
      ['Lilian works out her balance. ' + STEP, 'Income is 3,000 and spending 2,400.', 'Balance = 3,000 - 2,400 = 600.', 'The 600 is a loss.', 'Money left over is a surplus, which can be saved.', 3],
      ['Daniel fixes a deficit. ' + STEP, 'His spending is more than his income.', 'He looks at his list of wants.', 'He decides to call the budget balanced instead.', 'A deficit is fixed by cutting wants or raising income.', 0],
    ]),
];
