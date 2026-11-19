// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 9, THE SEVEN SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): safety on raised
// platforms, oblique drawing, building a visual program, holding tools, driving tools, planning a project and a business plan.
// The app asks the rule, the order, the length or the missing part; the making is marked by the teacher with the KICD rubric.
// Every wrong answer names the library misconception it reveals. Safety lines are for the teacher to confirm first.
// All stay reviewed:false.
// ============================================================================
import { T } from './pretechnical_g9_lib.js';

const M = (...s) => s.map(x => `M_PT9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('pr', 'FOUNDA.SAFETY_ON_RAISED_PLATFOR.PLATFORM_RULES', M('PR_ANGLE', 'PR_OVERREACH', 'PR_TOP_STEP', 'PR_CONTACT', 'PR_FOOTING'),
    ['Picture the ladder slipping or the climber falling, and ask what stops it.', 'Firm level footing with a helper, about 1 out for every 4 up, three points of contact, no leaning out, and never the top steps.'], [
      ['A ladder reaches 4 m up a wall. How far out is its foot?', 'About 1 m', 'As close to the wall as possible|0', 'About 4 m|0', 'About 3 m|0'],
      ['A spot is out of reach to the side of the ladder. What do you do?', 'Climb down and move the ladder', 'Lean out to reach it|1', 'Stand on the top step|2', 'Put the ladder on bricks|4'],
      ['Where must you not stand on a step ladder?', 'On the top steps', 'On the bottom step|2', 'With both feet on a step|2', 'Facing the ladder|2'],
      ['How are tools carried up a ladder?', 'In a belt or bag', 'Holding them in both hands|3', 'In the mouth|3', 'Under one arm, using one hand|3'],
      ['Where is a ladder stood?', 'On firm, level ground with a helper', 'On a box to make it taller|4', 'On soft, wet soil|4', 'Upright against the wall|0'],
    ], [
      ['Kiprono stands a ladder almost straight up against the classroom wall to paint. What is the danger?', 'It can tip backwards', 'None, upright is safest|0', 'He will reach less|1', 'It is on bricks|4'],
      ['Wanjiru is fixing a gutter and leans far out to the side to reach a bracket. What should she do?', 'Climb down and move the ladder', 'Lean out further|1', 'Stand on the top step|2', 'Hold the tools in both hands|3'],
      ['Omondi\'s step ladder is too short, so he stands on the very top step. What should he do?', 'Get a taller ladder', 'Keep standing on the top|2', 'Put it on a box|4', 'Lean out sideways|1'],
      ['Faith climbs a ladder carrying a hammer and nails in both hands. What should she do?', 'Put the tools in a belt or bag', 'Climb faster|3', 'Stand the ladder upright|0', 'Lean out to the side|1'],
      ['A ladder is too short, so Juma stands it on a pile of bricks. What should he do?', 'Use a longer ladder on firm ground', 'Add more bricks|4', 'Stand on the top step|2', 'Stand it nearly upright|0'],
    ], [
      ['Kamau explains setting up a ladder. ' + STEP, 'He chose firm, level ground.', 'A helper held the foot.', 'He stood it as close to the wall as possible.', 'About 1 out for every 4 up.', 0],
      ['Achieng explains painting a wall. ' + STEP, 'She kept the ladder footed.', 'She kept three points of contact.', 'When she could not reach, she leaned out to the side.', 'Climb down and move the ladder.', 1],
      ['Musa explains using a step ladder. ' + STEP, 'He opened it fully.', 'He locked the spreaders.', 'He stood on the top step to reach higher.', 'Do not stand on the top steps; get a taller ladder.', 2],
      ['Nekesa explains climbing. ' + STEP, 'She checked the rungs.', 'She faced the ladder.', 'She held her tools in both hands as she climbed.', 'Carry tools in a belt or bag; keep three points of contact.', 3],
      ['Peter explains a scaffold job. ' + STEP, 'The scaffold had guard rails.', 'It had toe boards.', 'He put the ladder on a box to reach the scaffold.', 'Stand it on firm, level ground.', 4],
    ]),

  ...T('od', 'COMMUN.OBLIQUE_PROJECTION.OBLIQUE_DRAW', M('OD_CIRCLE_FACE', 'OD_DEPTH_FULL', 'OD_START', 'OD_CONVERGE'),
    ['Draw what is true first, then the depth.', 'Put the face with circles at the front, draw it true shape first, then parallel receding lines at 45 degrees, half depth in cabinet oblique.'], [
      ['Which face of a block goes to the front in oblique?', 'The face with the hole or circle', 'Any face; it does not matter|0', 'The plainest face|0', 'The face with the receding lines|2'],
      ['A block is 60 mm deep. What length is the depth drawn in cabinet oblique?', '30 mm', '60 mm|1', '120 mm|1', '45 mm|1'],
      ['What is drawn first in oblique?', 'The front face, true shape', 'The receding (depth) lines|2', 'A point where lines meet|3', 'The back face|2'],
      ['How are the receding lines drawn?', 'Parallel, at 45 degrees', 'Meeting at a point in the distance|3', 'At any angle each|3', 'Upright|3'],
      ['A block is 80 mm deep. What length is the depth in cavalier oblique?', '80 mm', '40 mm|1', '160 mm|1', '20 mm|1'],
    ], [
      ['Wafula draws a block with a round hole on its side face. The hole comes out as a hard ellipse. What should he do?', 'Turn it so the hole faces front', 'Keep the hole on the side|0', 'Draw the depth in full|1', 'Make the lines meet|3'],
      ['Moraa draws a 50 mm deep block in cabinet oblique with 50 mm depth lines. It looks too long. What should they be?', '25 mm', '50 mm|1', '100 mm|1', '10 mm|1'],
      ['Ali starts his oblique drawing with the 45 degree lines and the front face does not fit. What should he draw first?', 'The front face', 'The depth lines|2', 'A vanishing point|3', 'The back corner|2'],
      ['Esther\'s receding lines all meet at one point, like a road in a photo. What is wrong?', 'They must be parallel', 'Nothing, that is oblique|3', 'The hole is on the side|0', 'The depth is halved|1'],
      ['A cylinder lies on its side. Which way is it turned for an oblique drawing?', 'With its round end at the front', 'With its curved side at the front|0', 'Any way, it does not matter|0', 'With its depth lines first|2'],
    ], [
      ['Kioko explains his oblique sketch. ' + STEP, 'He drew the front face true shape.', 'He drew the depth lines at 45 degrees.', 'He put the face with the hole on the side.', 'Put the face with the circle at the front.', 0],
      ['Halima explains cabinet oblique. ' + STEP, 'The block is 40 mm deep.', 'She drew the front face first.', 'She drew the depth lines 40 mm long.', 'Cabinet uses half depth: 20 mm.', 1],
      ['Brian explains the order. ' + STEP, 'He chose the face with the most detail.', 'He planned to put it at the front.', 'He started with the receding lines.', 'Start with the front face, true shape.', 2],
      ['Grace explains receding lines. ' + STEP, 'She drew the front face.', 'She drew lines back from each corner.', 'She made them meet at one point in the distance.', 'Receding lines are parallel, all at 45 degrees.', 3],
      ['Otieno explains a shaped block. ' + STEP, 'He drew the L-shaped front face true shape.', 'He drew parallel lines at 45 degrees.', 'For cabinet he drew the full 60 mm depth.', 'Cabinet depth is half: 30 mm.', 1],
    ], ['c', 'b', 'c']),

  ...T('vb', 'COMMUN.VISUAL_PROGRAMMING.VP_APP_BUILD', M('VB_PLAN', 'VB_VARIABLE', 'VB_RESET', 'VB_TEST_ONCE'),
    ['Ask what the program must remember, where it starts, and how you know it works.', 'State the problem and plan first, keep a changing value in a variable, set it at the start of each run, and test with right, wrong and unusual inputs.'], [
      ['What is the first step in building an app?', 'State the problem and plan the steps', 'Drag blocks until something works|0', 'Test with one answer|3', 'Make a variable for everything|1'],
      ['A quiz app must keep the score. What does it need?', 'A variable called score', 'Nothing; it remembers by itself|1', 'Just a green flag block|2', 'One test with a right answer|3'],
      ['Where is the score set to 0?', 'When the green flag is clicked', 'Never; scores should add up|2', 'Only at the very end|2', 'Only after one test|3'],
      ['How is an app tested?', 'With right, wrong and unusual inputs', 'Try one right answer and stop|3', 'It needs no testing|3', 'Drag more blocks instead|0'],
      ['Why is a plan made before building?', 'So the blocks solve the real problem', 'It is faster to drag blocks first|0', 'Plans replace variables|1', 'So no testing is needed|3'],
    ], [
      ['Kibet starts dragging blocks for a shopping-list app before deciding what it must do. It keeps changing. What should he have done?', 'Stated the problem and planned the steps', 'Kept dragging blocks until it worked|0', 'Tested once and stopped|3', 'Removed the variables|1'],
      ['Wairimu\'s spelling game shows the score going up, but it is never stored. What is missing?', 'A score variable', 'Nothing, apps remember|1', 'More testing once|3', 'A plan after building|0'],
      ['In Odera\'s game, the second player starts with the first player\'s score. What did he forget?', 'Set score to 0 at the green flag', 'Nothing, scores should add up|2', 'To drag more blocks|0', 'To test once only|3'],
      ['Shiru tests her bus-fare calculator with one correct fare and says it works. What should she do?', 'Test wrong and unusual inputs too', 'Stop, one right test is enough|3', 'Delete the variables|1', 'Skip the plan next time|0'],
      ['A class builds an app to count library books. Which plan is right?', 'Plan, use a variable, reset, test', 'Drag blocks, then test it only once|0', 'No variable, no reset|1', 'Never reset the count|2'],
    ], [
      ['Musa explains building his app. ' + STEP, 'He wanted an app to quiz his sister on times tables.', 'He opened the visual programming tool.', 'He dragged blocks until something worked, with no plan.', 'State the problem and plan the steps first.', 0],
      ['Achieng explains her score. ' + STEP, 'Her quiz asks ten questions.', 'Each right answer should add 1.', 'The app remembers the score without a variable.', 'Make a variable called score and change it by 1.', 1],
      ['Kevin explains starting his game. ' + STEP, 'He made a score variable.', 'It goes up by 1 for each catch.', 'He never sets it to 0, so scores add up between games.', 'Set score to 0 when the green flag is clicked.', 2],
      ['Lucy explains testing. ' + STEP, 'Her app checks a PIN.', 'She tried the right PIN and it worked.', 'So she stopped testing.', 'Also try wrong PINs and unusual inputs.', 3],
      ['Hassan explains his timer app. ' + STEP, 'He planned the steps.', 'He used a variable for time.', 'He did not reset the time at the start of each run.', 'Set the variable to its start value at the green flag.', 2],
    ]),

  ...T('hu', 'TOOLS_.HOLDING_TOOLS.HOLD_USE', M('HU_HIGH', 'HU_PACKING', 'HU_DRILL_HAND', 'HU_SUPPORT'),
    ['Ask what will move, bend or get marked when you work on it.', 'Hold work low in the vice, pack finished work with soft jaws, clamp work for drilling, and support the free end of long work.'], [
      ['How far does work stick up above the vice jaws for filing?', 'Only a little', 'As much as possible|0', 'Half its length|0', 'It does not matter|0'],
      ['How is a finished, varnished piece held in a steel vice?', 'With soft packing between jaws and work', 'Straight in the steel jaws|1', 'With extra tightening|1', 'By hand on the bench|2'],
      ['How is a small plate held for drilling?', 'In a machine vice or clamped', 'By hand, pressed down firmly|2', 'Between two fingers|2', 'High in the bench vice|0'],
      ['A long plank is held by one end in the vice. What is needed?', 'Support at the other end', 'Nothing; the vice holds it|3', 'It is held higher|0', 'Steel jaws only|1'],
      ['Why is work held low in the vice when sawing?', 'So it does not vibrate or bend', 'So it is easier to reach|0', 'So it needs no clamp|2', 'So no packing is needed|1'],
    ], [
      ['Kendi clamps a strip of metal high above the vice and files it. It rattles and bends. What should she do?', 'Clamp it lower in the vice', 'Clamp it even higher|0', 'Hold it by hand|2', 'Remove the packing|1'],
      ['Barasa tightens his varnished shelf straight in the steel vice. The jaws leave dents. What should he use?', 'Soft packing or soft jaws', 'Tighter steel jaws|1', 'His hands only|2', 'Higher clamping|0'],
      ['Mueni holds a small aluminium plate with her fingers while it is drilled. What is the danger?', 'It can spin and cut her', 'None, fingers are firm|2', 'It will be dented|1', 'It will bend high up|0'],
      ['Daudi saws the end of a long plank held only at one end. It sags and the saw jams. What does he need?', 'Support at the free end', 'Nothing, the vice holds it|3', 'Steel jaws without packing|1', 'To hold it by hand|2'],
      ['A class is filing the edges of finished picture frames. Which set-up is right?', 'Low in the vice with soft packing', 'High in bare steel jaws|0', 'Held by hand only|2', 'One end in the vice, unsupported|3'],
    ], [
      ['Wekesa explains filing. ' + STEP, 'He chose the right file.', 'He tightened the vice firmly.', 'He left most of the piece sticking up above the jaws.', 'Hold the work low so it does not vibrate.', 0],
      ['Nyambura explains holding a finished piece. ' + STEP, 'The piece was sanded and varnished.', 'She needed to trim one end.', 'She tightened it straight in the steel jaws.', 'Put soft packing between the jaws and the work.', 1],
      ['Ochieng explains drilling. ' + STEP, 'He marked and punched the hole.', 'He chose the drill bit.', 'He held the plate by hand while drilling.', 'Clamp it in a machine vice or to the table.', 2],
      ['Rehema explains sawing a long piece. ' + STEP, 'She marked the cut.', 'She held one end in the vice.', 'She left the far end unsupported.', 'Support the far end with a stop, clamp or helper.', 3],
      ['Kimani explains a set-up. ' + STEP, 'He used soft jaws.', 'He clamped the work low.', 'He held a small part by hand for drilling.', 'Clamp small parts for drilling.', 2],
    ]),

  ...T('du', 'TOOLS_.DRIVING_TOOLS.DRIVE_USE', M('DU_GRIP', 'DU_START_NAIL', 'DU_SPANNER_FIT', 'DU_SCREWDRIVER_SIZE', 'DU_PUSH'),
    ['Ask what gives a straight, strong drive without slipping.', 'Grip a hammer near the handle end and start nails with light taps, use a screwdriver that fills the slot, a spanner that fits exactly, and pull it towards you.'], [
      ['Where is a hammer held to drive a nail?', 'Near the end of the handle', 'Close to the head, for control|0', 'In the middle of the head|0', 'By the claw|0'],
      ['How is a nail started?', 'Light taps, then move fingers away', 'Hit it hard from the first blow|1', 'Hold it and hit hard|1', 'Push it in by hand|1'],
      ['A spanner is a little too big for the nut. What happens?', 'It slips and rounds off the nut', 'Nothing; it still turns|2', 'It tightens better|2', 'It pushes away more easily|4'],
      ['Which screwdriver is used for a slotted screw?', 'One whose blade fills the slot', 'Any size that goes in|3', 'The smallest one|3', 'One much wider than the head|3'],
      ['How is a spanner moved on a tight nut?', 'Pulled towards you', 'Pushed away hard|4', 'Hit with a hammer|0', 'Any size, pushed away|2'],
    ], [
      ['Atieno holds the hammer just below its head. Her nails bend over. What should she change?', 'Hold it near the end of the handle', 'Hold it even closer to the head|0', 'Hit the nail harder at first|1', 'Use a smaller screwdriver|3'],
      ['Kiptoo holds the nail with his fingers and hits it hard at once. What is the danger?', 'He can hit his fingers', 'None, it saves time|1', 'The spanner slips|2', 'The slot is too small|3'],
      ['Mama Akinyi uses a slightly big spanner on a bicycle nut. It slips and the corners round off. What should she do?', 'Use the spanner that fits exactly', 'Push harder with it|4', 'Keep using the big one, it turns|2', 'Hold the nut by hand|1'],
      ['Omar uses a tiny screwdriver on a large slotted screw. The tip slips and damages the slot. What is right?', 'A blade that fills the slot', 'Any size of tip that goes in|3', 'Pushing harder|4', 'A hammer instead|0'],
      ['Wanjala pushes the spanner away from himself on a stuck nut. It suddenly gives and he falls forward. What is safer?', 'Pull it towards you, standing steady', 'Push it away harder next time|4', 'Use a bigger spanner|2', 'Hold the hammer near the head|0'],
    ], [
      ['Zawadi explains nailing. ' + STEP, 'She marked where the nail goes.', 'She started it with light taps.', 'She held the hammer close to its head.', 'Hold it near the end of the handle for a straight blow.', 0],
      ['Kibet explains starting a nail. ' + STEP, 'He held the hammer near the end.', 'He placed the nail on the mark.', 'He held it with his fingers and hit it hard first time.', 'Tap lightly to start it, then move your fingers away.', 1],
      ['Esther explains loosening a nut. ' + STEP, 'She stood steady.', 'She pulled the spanner towards her.', 'She used one that was a little too big.', 'Use a spanner that fits the nut exactly.', 2],
      ['Ouma explains screwing. ' + STEP, 'He drilled a pilot hole.', 'He kept the screwdriver upright.', 'He used any size of tip that went into the slot.', 'Use one that fills the slot fully.', 3],
      ['Mary explains using a spanner. ' + STEP, 'She chose a spanner of the right size.', 'She put it fully on the nut.', 'She pushed it away from her hard.', 'Pull it towards you, standing steady.', 4],
    ]),

  ...T('pp', 'TOOLS_.PROJECT.PROJECT_PLAN', M('PP_NO_DRAWING', 'PP_NO_COST', 'PP_FINISH_FIRST', 'PP_LOOKS_ONLY'),
    ['Think about the order: draw, list and cost, make, finish, then test against the problem.', 'Begin with a sketch and working drawing and a costed materials list; mark, cut, join and sand before the finish; judge the item by whether it solves the problem.'], [
      ['What comes before cutting materials for a project?', 'A sketch and a working drawing', 'Nothing; start cutting the wood|0', 'The varnish|2', 'Judging how it looks|3'],
      ['Why is a materials and cost list made?', 'To know what to get and what it costs', 'It is a waste of time|1', 'To decide the colour of paint only|3', 'So drawing is not needed|0'],
      ['When is paint or varnish put on?', 'Last, after making and sanding', 'Before cutting and joining|2', 'Before the drawing|0', 'Never, if it looks nice|3'],
      ['How is a finished item evaluated?', 'By whether it solves the problem', 'By whether it looks nice|3', 'By how fast it was made by the class|3', 'By the colour of paint|2'],
      ['Which order of making is right?', 'Mark, cut, join, sand, finish', 'Finish first, then mark and cut|2', 'Cut, then draw|0', 'Join, then list costs|1'],
    ], [
      ['Wangari cuts her planks for a shoe rack with no drawing. The pieces do not fit. What did she skip?', 'A working drawing with sizes', 'A coat of varnish|2', 'A look at the colour|3', 'Nothing, cutting comes first|0'],
      ['Halfway through, Mwangi runs out of nails and money for his bird table. What did he not make?', 'A materials and cost list', 'A coat of paint|2', 'A judgement on looks|3', 'A faster start|0'],
      ['Nanjala paints each part of her stool before joining. The paint is scraped off when she joins and sands. What is right?', 'Paint last, after making', 'Paint even earlier|2', 'Skip the drawing|0', 'Judge it by its colour|3'],
      ['Kevin made a water-bottle holder. He says it is good because it looks nice, but it tips over. How should he judge it?', 'Whether it holds the bottles safely', 'By how nice it looks|3', 'By the cost list only|1', 'By painting it again|2'],
      ['A class must make a rack for the school\'s brooms. Which plan is right?', 'Draw, cost, make, finish, test', 'Cut first, draw later|0', 'Varnish, then cut|2', 'Judge by looks only|3'],
    ], [
      ['Otieno explains his project. ' + STEP, 'His problem: books fall off his shelf.', 'He chose wood and nails.', 'He started cutting without any drawing.', 'Make a sketch and a working drawing with sizes first.', 0],
      ['Faith explains her plan. ' + STEP, 'She drew the item.', 'She wrote the order of making.', 'She skipped the materials and cost list as a waste of time.', 'The list shows what to get and what it costs.', 1],
      ['Kamau explains making. ' + STEP, 'He marked and cut the parts.', 'He sanded them.', 'He varnished the parts before he joined them.', 'Varnish last, after joining and sanding.', 2],
      ['Mumbi explains her evaluation. ' + STEP, 'Her problem was a dirty, wet floor at the door.', 'She made a mat from old sacks.', 'She judged it good because it looks nice.', 'Judge it by whether it keeps the floor clean and dry.', 3],
      ['Salim explains improving his item. ' + STEP, 'He tested his rack with real brooms.', 'It wobbled.', 'He decided it was fine because the paint was bright.', 'Judge it against the problem and name improvements.', 3],
    ], ['c', 'd', 'c']),

  ...T('bt', 'ENTREP.BUSINESS_PLAN.BP_TEMPLATE', M('BT_STARTUP', 'BT_PROFIT', 'BT_SUMMARY', 'BT_COMPETITORS'),
    ['Go part by part through the template and ask what each part must show.', 'Start-up capital is equipment, licence and first stock; profit = sales - costs; name the competitors; write the executive summary last.'], [
      ['A juice stall needs a blender, cups, a licence and fruit. What is the start-up capital?', 'All four together', 'Only the fruit|0', 'Only the blender|0', 'Only the licence|0'],
      ['Projected sales are 30,000 shillings and costs are 22,000. What is the projected profit?', '8,000 shillings', '30,000 shillings|1', '52,000 shillings|1', '22,000 shillings|1'],
      ['When is the executive summary written?', 'Last, though placed first', 'First, before any other part|2', 'Never, it is not needed|2', 'In the middle|2'],
      ['Two kiosks near the school sell snacks. What goes in the plan?', 'Name them as competitors', 'Nothing; competitors need not be in it|3', 'Write no competitors|3', 'Only the profit|1'],
      ['Projected sales are 12,000 and costs are 7,500. What is the projected profit?', '4,500 shillings', '12,000 shillings|1', '19,500 shillings|1', '7,500 shillings|1'],
    ], [
      ['Achieng plans a mandazi business. Her start-up list shows only flour and oil. What has she left out?', 'The cooker, pans and licence', 'Nothing, stock is enough|0', 'The profit|1', 'The summary|2'],
      ['Juma\'s plan says: profit 40,000 shillings. That is his sales figure; his costs are 25,000. What should the profit line say?', '15,000 shillings', '40,000 shillings|1', '65,000 shillings|1', '25,000 shillings|1'],
      ['Wambui writes her executive summary first, then changes everything else. What should she do?', 'Write it last', 'Write it first again|2', 'Leave it out|2', 'Put it at the end|2'],
      ['Baraka writes no competitors for his phone-charging stall, though two shops nearby charge phones. What should he write?', 'Name the two shops', 'No competitors|3', 'Only his sales|1', 'Only his summary|2'],
      ['A group plans a school car wash. Which template entry is right?', 'Start-up: buckets, soap, hose, permit', 'Start-up: soap only|0', 'Profit: total sales|1', 'Competitors: none, always|3'],
    ], [
      ['Nekesa explains her start-up capital. ' + STEP, 'Her business sells eggs.', 'She needs trays, a stall and a licence.', 'Her start-up capital is only the first eggs.', 'Start-up capital includes equipment, licence and first stock.', 0],
      ['Brian explains his profit. ' + STEP, 'Projected sales are 20,000.', 'Projected costs are 14,000.', 'Projected profit is 20,000.', 'Profit = sales - costs = 6,000.', 1],
      ['Rose explains writing the plan. ' + STEP, 'The summary is placed at the front.', 'It sums up the whole plan.', 'So she writes it first, before any other part.', 'Write it last, after the other parts.', 2],
      ['Peter explains his market part. ' + STEP, 'His customers are learners and parents.', 'Three kiosks sell the same snacks nearby.', 'He wrote no competitors.', 'Name the kiosks and how his stall will differ.', 3],
      ['Lilian explains her costs. ' + STEP, 'Sales are projected at 18,000.', 'Costs are 11,000.', 'Profit is 18,000 + 11,000 = 29,000.', 'Profit = 18,000 - 11,000 = 7,000.', 1],
    ]),
];
