// ============================================================================
// GRADE 5 CREATIVE ARTS, THEME C: ATHLETICS, FABRIC DECORATION AND KENYAN FOLK DANCE KNOWLEDGE (10 skills).
// Knowledge half only: running, dyeing, sewing and dancing are practical (see the non-question outcomes doc). Community and
// occasion facts for the dances are for the CBC teacher reviewer to confirm. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g5_lib.js';

const AT = 'PERFOR.ATHLETICS.', FD = 'PERFOR.FABRIC_DECORATION.', FN = 'PERFOR.KENYAN_FOLK_DANCE.';

export const FAMILIES = [
  // ---------------------------------------------------------------- AT.BATON
  fam('at.bt.which', `${AT}BATON`, 'direct', 1, choose([
    ['In a visual baton change, where does the receiver look?', 'Back at the baton', [...w('M_AT_VISUAL_LOOK_AHEAD', 'Straight ahead'), ...w('M_AT_VISUAL_LOOK_AHEAD', 'At the ground'), ...w('M_AT_VISUAL_LOOK_AHEAD', 'At the crowd')], 'In a visual change the receiver sees the baton come.'],
    ['In a non-visual change, what does the receiver do?', 'Looks ahead and puts a hand back on a call', [...w('M_AT_NON_VISUAL_STOP', 'Stops and turns round'), ...w('M_AT_NON_VISUAL_STOP', 'Walks to the giver'), ...w('M_AT_NON_VISUAL_STOP', 'Closes both eyes and waits')], 'The receiver keeps running and looking ahead.'],
    ['In an upsweep, which way does the baton move into the hand?', 'Upward', [...w('M_AT_UP_DOWN_SWAP', 'Downward'), ...w('M_AT_UP_DOWN_SWAP', 'Sideways'), ...w('M_AT_UP_DOWN_SWAP', 'It is dropped')], 'An upsweep moves the baton up.'],
    ['In a downsweep, which way does the baton move into the hand?', 'Downward', [...w('M_AT_UP_DOWN_SWAP', 'Upward'), ...w('M_AT_UP_DOWN_SWAP', 'Sideways'), ...w('M_AT_THROW_BATON', 'It is thrown')], 'A downsweep moves the baton down.'],
    ['How is the baton passed to the next runner?', 'Placed in the hand', [...w('M_AT_THROW_BATON', 'Thrown to them'), ...w('M_AT_THROW_BATON', 'Rolled along the track'), ...w('M_AT_THROW_BATON', 'Dropped for them to pick up')], 'The baton is handed over, never thrown.'],
  ], { h: ['Think about eyes, hand and direction.', 'Visual: look back. Non-visual: look ahead.'], s1: 'Recall the two methods.' })),
  fam('at.bt.story', `${AT}BATON`, 'word', 2, choose([
    ['Njeri takes the baton in a visual change. Her coach tells her to keep her eyes on one thing. What is it?', 'The baton coming to her hand', [...w('M_AT_VISUAL_LOOK_AHEAD', 'The finish line only'), ...w('M_AT_VISUAL_LOOK_AHEAD', 'The runners in the next lane'), ...w('M_AT_VISUAL_LOOK_AHEAD', 'The crowd')], 'She looks back and sees the baton.'],
    ['Otieno runs the second leg of a relay with a non-visual change. His giver shouts "hand". What does he do next?', 'Puts his hand back without looking', [...w('M_AT_NON_VISUAL_STOP', 'Stops and turns to look'), ...w('M_AT_NON_VISUAL_STOP', 'Turns round and walks back'), ...w('M_AT_NON_VISUAL_STOP', 'Slows to a stop')], 'He keeps running and puts the hand back on the call.'],
    ['Amina\'s coach says the baton goes up into the receiver\'s hand. Which change is this?', 'An upsweep', [...w('M_AT_UP_DOWN_SWAP', 'A downsweep'), ...w('M_AT_THROW_BATON', 'A throw'), ...w('M_AT_UP_DOWN_SWAP', 'A drop')], 'Upward is an upsweep.'],
    ['Kamau throws the baton to save time. His coach stops him. What is the rule?', 'The baton is handed over', [...w('M_AT_THROW_BATON', 'Throwing is allowed'), ...w('M_AT_THROW_BATON', 'Throwing is allowed on the bend'), ...w('M_AT_THROW_BATON', 'Throwing is allowed for fast runners')], 'Never throw the baton.'],
    ['Zawadi\'s coach says the baton is pushed down into the hand. Which change is this?', 'A downsweep', [...w('M_AT_UP_DOWN_SWAP', 'An upsweep'), ...w('M_AT_THROW_BATON', 'A throw'), ...w('M_AT_NON_VISUAL_STOP', 'A stop')], 'Downward is a downsweep.'],
  ], { h: ['Think about eyes, hand and direction.', 'Up is upsweep. Down is downsweep.'], s1: 'Match the change to the description.' })),
  fam('at.bt.spot', `${AT}BATON`, 'spot', 3, spot([
    sp('Wekesa explains a visual change. Which step has the mistake?', ['Step 1: The giver runs up.', 'Step 2: The receiver looks straight ahead.', 'Step 3: The baton is handed over.'], 1, 'In a visual change the receiver looks back.', 'M_AT_VISUAL_LOOK_AHEAD'),
    sp('Chebet explains a non-visual change. Which step has the mistake?', ['Step 1: The giver calls.', 'Step 2: The receiver stops to turn round.', 'Step 3: The baton is handed over.'], 1, 'The receiver keeps running and puts a hand back.', 'M_AT_NON_VISUAL_STOP'),
    sp('Juma explains the sweeps. Which step has the mistake?', ['Step 1: An upsweep goes upward.', 'Step 2: A downsweep goes downward.', 'Step 3: He says an upsweep goes downward.'], 2, 'An upsweep goes upward.', 'M_AT_UP_DOWN_SWAP'),
    sp('Njeri explains the pass. Which step has the mistake?', ['Step 1: She nears the receiver.', 'Step 2: She throws the baton.', 'Step 3: The receiver runs on.'], 1, 'Place the baton in the hand.', 'M_AT_THROW_BATON'),
    sp('Amina describes a change. Which step has the mistake?', ['Step 1: The receiver starts running.', 'Step 2: The receiver looks ahead in a visual change.', 'Step 3: The baton passes.'], 1, 'Visual means looking back.', 'M_AT_VISUAL_LOOK_AHEAD'),
  ], { h: ['Check each step.', 'Visual looks back. Non-visual looks ahead.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AT.RELAY
  fam('at.rl.rule', `${AT}RELAY`, 'direct', 1, choose([
    ['Where must the baton be passed in a relay?', 'Inside the exchange zone', [...w('M_AT_PASS_ANYWHERE', 'Anywhere on the track'), ...w('M_AT_PASS_ANYWHERE', 'On the finish line'), ...w('M_AT_PASS_ANYWHERE', 'Before the start')], 'The baton must be passed in the zone.'],
    ['The baton is dropped. Who picks it up?', 'The runner who dropped it', [...w('M_AT_DROP_LEAVE_IT', 'The nearest teammate'), ...w('M_AT_DROP_LEAVE_IT', 'The coach'), ...w('M_AT_DROP_LEAVE_IT', 'Nobody, it is left')], 'The runner who dropped it picks it up.'],
    ['When has a relay team finished?', 'When the last runner crosses the line with the baton', [...w('M_AT_FINISH_ANY', 'When the first runner crosses'), ...w('M_AT_FINISH_ANY', 'When any runner crosses'), ...w('M_AT_FINISH_ANY', 'When the coach says')], 'The last runner finishes the race.'],
    ['How is the baton carried?', 'In the hand', [...w('M_AT_PASS_ANYWHERE', 'In the mouth'), ...w('M_AT_PASS_ANYWHERE', 'In a pocket'), ...w('M_AT_PASS_ANYWHERE', 'Tucked in a sock')], 'The runner carries it in the hand.'],
    ['Why is the exchange zone marked?', 'So passes happen in a safe, fair place', [...w('M_AT_PASS_ANYWHERE', 'So runners rest there'), ...w('M_AT_PASS_ANYWHERE', 'So the baton can be thrown'), ...w('M_AT_PASS_ANYWHERE', 'So the crowd can see')], 'The zone keeps the race fair.'],
  ], { h: ['Think of the race rules.', 'Pass in the zone, pick up your own drop, last runner finishes.'], s1: 'Recall the relay rules.' })),
  fam('at.rl.story', `${AT}RELAY`, 'word', 2, choose([
    ['Njeri passes the baton well before the zone. What should happen?', 'The pass should be repeated in the zone', [...w('M_AT_PASS_ANYWHERE', 'The pass counts anyway'), ...w('M_AT_PASS_ANYWHERE', 'The team wins at once'), ...w('M_AT_PASS_ANYWHERE', 'The baton is thrown away')], 'Passes happen inside the zone.'],
    ['Otieno drops the baton on the bend. What does he do?', 'Picks it up himself and runs on', [...w('M_AT_DROP_LEAVE_IT', 'Waits for a teammate to pick it'), ...w('M_AT_DROP_LEAVE_IT', 'Leaves it and runs on'), ...w('M_AT_DROP_LEAVE_IT', 'Calls the coach')], 'He picks up his own baton.'],
    ['Amina\'s team has four runners. The first runner crosses the line. Has the team finished?', 'No, the last runner must cross', [...w('M_AT_FINISH_ANY', 'Yes, the first runner finished'), ...w('M_AT_FINISH_ANY', 'Yes, any runner counts'), ...w('M_AT_FINISH_ANY', 'Yes, if the team shouts')], 'The last runner finishes.'],
    ['Kamau wants to cut across lanes to catch up. What is the rule?', 'Stay in your own lane', [...w('M_AT_PASS_ANYWHERE', 'Cut across when no one looks'), ...w('M_AT_PASS_ANYWHERE', 'Cut across on the bend'), ...w('M_AT_PASS_ANYWHERE', 'Cut across if you are slow')], 'Staying in lane keeps everyone safe.'],
    ['Zawadi\'s team wins when who crosses the line with the baton?', 'Their last runner', [...w('M_AT_FINISH_ANY', 'Their first runner'), ...w('M_AT_FINISH_ANY', 'Their coach'), ...w('M_AT_FINISH_ANY', 'Any runner')], 'The last runner finishes the race.'],
  ], { h: ['Think of the race rules.', 'Pass in the zone, pick up your own drop, last runner finishes.'], s1: 'Decide the rule that applies.' })),
  fam('at.rl.spot', `${AT}RELAY`, 'spot', 3, spot([
    sp('Wekesa explains a drop. Which step has the mistake?', ['Step 1: The baton falls.', 'Step 2: A teammate picks it up.', 'Step 3: The race goes on.'], 1, 'The runner who dropped it picks it up.', 'M_AT_DROP_LEAVE_IT'),
    sp('Chebet explains the finish. Which step has the mistake?', ['Step 1: Four runners take turns.', 'Step 2: The first crosses the line.', 'Step 3: She says the team has finished.'], 2, 'The team finishes when the last runner crosses.', 'M_AT_FINISH_ANY'),
    sp('Juma explains the pass. Which step has the mistake?', ['Step 1: The runners meet.', 'Step 2: They pass anywhere on the track.', 'Step 3: The next runner goes.'], 1, 'Pass inside the exchange zone.', 'M_AT_PASS_ANYWHERE'),
    sp('Njeri explains a drop. Which step has the mistake?', ['Step 1: She drops the baton.', 'Step 2: She leaves it.', 'Step 3: She runs on.'], 1, 'She must pick it up herself.', 'M_AT_DROP_LEAVE_IT'),
    sp('Amina explains the zone. Which step has the mistake?', ['Step 1: The zone is marked.', 'Step 2: The pass happens in the zone.', 'Step 3: She says passes can happen outside it.'], 2, 'Passes must be inside the zone.', 'M_AT_PASS_ANYWHERE'),
  ], { h: ['Check each step.', 'Zone, own drop, last runner.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- AT.PLAITING
  fam('at.pl.which', `${AT}PLAITING`, 'direct', 1, choose([
    ['How many strands are in a plaited rope?', 'Three', [...w('M_AT_PLAIT_TWO', 'Two'), ...w('M_AT_PLAIT_TWO', 'One'), ...w('M_AT_PLAIT_TWO', 'Ten')], 'A plait uses three strands.'],
    ['How do the strands cross in a plait?', 'The outer strands cross over the middle one in turn', [...w('M_AT_PLAIT_SAME_STRAND', 'The same strand goes over each time'), ...w('M_AT_PLAIT_SAME_STRAND', 'They do not cross'), ...w('M_AT_PLAIT_SAME_STRAND', 'They are tied in knots')], 'Outer strands cross the middle, first right then left.'],
    ['What should the three strands be like at the start?', 'Equal in length', [...w('M_AT_PLAIT_UNEQUAL', 'Different in length'), ...w('M_AT_PLAIT_UNEQUAL', 'As short as possible'), ...w('M_AT_PLAIT_UNEQUAL', 'Wet and dripping')], 'Equal strands give a neat plait.'],
    ['Which material can be plaited into a rope?', 'Sisal', [...w('M_AT_PLAIT_TWO', 'A stone'), ...w('M_AT_PLAIT_TWO', 'Smoke'), ...w('M_AT_PLAIT_TWO', 'Water')], 'Sisal, leather strips and old cloth strips can be plaited.'],
    ['What is a plaited rope used for in athletics?', 'As the tape at the end of a race', [...w('M_AT_PLAIT_TWO', 'As the baton'), ...w('M_AT_PLAIT_TWO', 'As the starting gun'), ...w('M_AT_PLAIT_TWO', 'As a stopwatch')], 'It is stretched as the finishing tape.'],
  ], { h: ['Think of a hair plait.', 'Three strands, equal length, outer over middle.'], s1: 'Recall how a plait is made.' })),
  fam('at.pl.story', `${AT}PLAITING`, 'word', 2, choose([
    ['Njeri has two strips of sisal and wants to plait. What does she need?', 'A third strip', [...w('M_AT_PLAIT_TWO', 'Nothing more'), ...w('M_AT_PLAIT_TWO', 'Only glue'), ...w('M_AT_PLAIT_TWO', 'A fourth and fifth strip')], 'A plait needs three strands.'],
    ['Otieno\'s plait is uneven. The strands were different lengths. What should he do next time?', 'Cut the strands equal', [...w('M_AT_PLAIT_UNEQUAL', 'Pull harder'), ...w('M_AT_PLAIT_UNEQUAL', 'Use fewer strands'), ...w('M_AT_PLAIT_UNEQUAL', 'Use only one strand')], 'Equal strands plait neatly.'],
    ['Amina moves the same strand over each time and her rope twists. What is the right way?', 'Outer strands cross over the middle in turn', [...w('M_AT_PLAIT_SAME_STRAND', 'Keep moving the same strand'), ...w('M_AT_PLAIT_SAME_STRAND', 'Move the middle strand only'), ...w('M_AT_PLAIT_SAME_STRAND', 'Tie the strands once')], 'Alternate the outer strands.'],
    ['Kamau needs a finishing tape for the school race. Which is a good plan?', 'Plait three strips of old cloth', [...w('M_AT_PLAIT_TWO', 'Twist two sticks together'), ...w('M_AT_PLAIT_TWO', 'Use one thin thread'), ...w('M_AT_PLAIT_TWO', 'Tie two strings in one knot')], 'Three strands plaited make a strong tape.'],
    ['Zawadi dyes her sisal strips before plaiting. Which step comes first?', 'Cut the strips to the same size', [...w('M_AT_PLAIT_UNEQUAL', 'Plait without measuring'), ...w('M_AT_PLAIT_UNEQUAL', 'Dye and plait at once'), ...w('M_AT_PLAIT_UNEQUAL', 'Leave them uncut')], 'Prepare equal strips first.'],
  ], { h: ['Three strands, equal length, outer over middle.', 'Think of a hair plait.'], s1: 'Decide what a good plait needs.' })),
  fam('at.pl.spot', `${AT}PLAITING`, 'spot', 3, spot([
    sp('Wekesa plaits a rope. Which step has the mistake?', ['Step 1: He cuts the strands.', 'Step 2: He takes two strands.', 'Step 3: He crosses them.'], 1, 'A plait uses three strands.', 'M_AT_PLAIT_TWO'),
    sp('Chebet explains crossing. Which step has the mistake?', ['Step 1: Outer right over the middle.', 'Step 2: Outer left over the middle.', 'Step 3: She moves the same strand each time.'], 2, 'Alternate the outer strands.', 'M_AT_PLAIT_SAME_STRAND'),
    sp('Juma prepares strands. Which step has the mistake?', ['Step 1: He gets three strips.', 'Step 2: He cuts them different lengths.', 'Step 3: He plaits.'], 1, 'Cut them equal.', 'M_AT_PLAIT_UNEQUAL'),
    sp('Njeri plaits. Which step has the mistake?', ['Step 1: She fixes the top.', 'Step 2: She crosses the outer strands over the middle.', 'Step 3: She says two strands is enough.'], 2, 'Three strands are needed.', 'M_AT_PLAIT_TWO'),
    sp('Amina plaits. Which step has the mistake?', ['Step 1: Right over middle.', 'Step 2: Right over middle again.', 'Step 3: Left over middle.'], 1, 'Alternate left and right.', 'M_AT_PLAIT_SAME_STRAND'),
  ], { h: ['Check each step.', 'Three strands, equal length, alternate.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FD.DECOR_TYPES
  fam('fd.dt.which', `${FD}DECOR_TYPES`, 'direct', 1, choose([
    ['Which technique sews or sticks cut shapes of cloth onto another cloth?', 'Appliqué', [...w('M_FD_TD_APPLIQUE_SWAP', 'Tie and dye'), ...w('M_FD_TIE_DYE_WAX', 'Batik'), ...w('M_FD_APPLIQUE_PAINT', 'Painting')], 'Appliqué uses cut shapes.'],
    ['Which technique ties cloth so the dye cannot reach some parts?', 'Tie and dye', [...w('M_FD_TD_APPLIQUE_SWAP', 'Appliqué'), ...w('M_FD_TIE_DYE_WAX', 'Batik'), ...w('M_FD_APPLIQUE_PAINT', 'Painting')], 'Tied parts keep the cloth\'s own colour.'],
    ['What is appliqué?', 'Sewing cut shapes onto cloth', [...w('M_FD_APPLIQUE_PAINT', 'Painting patterns on cloth'), ...w('M_FD_TIE_DYE_WAX', 'Using wax to keep dye out'), ...w('M_FD_TD_APPLIQUE_SWAP', 'Tying cloth before dyeing')], 'Appliqué is shapes sewn or stuck onto cloth.'],
    ['Which technique uses wax to keep dye out of parts of the cloth?', 'Batik', [...w('M_FD_TIE_DYE_WAX', 'Tie and dye'), ...w('M_FD_TD_APPLIQUE_SWAP', 'Appliqué'), ...w('M_FD_APPLIQUE_PAINT', 'Embroidery')], 'Batik uses wax.'],
    ['Which technique uses thread stitches to make a design?', 'Embroidery', [...w('M_FD_TD_APPLIQUE_SWAP', 'Tie and dye'), ...w('M_FD_APPLIQUE_PAINT', 'Painting'), ...w('M_FD_TIE_DYE_WAX', 'Batik')], 'Embroidery uses stitches.'],
  ], { h: ['Think how each pattern is made.', 'Tie and dye ties. Appliqué adds shapes.'], s1: 'Match each technique to how it works.' })),
  fam('fd.dt.story', `${FD}DECOR_TYPES`, 'word', 2, choose([
    ['Njeri cuts a flower from red cloth and sews it on a white cloth. What technique is this?', 'Appliqué', [...w('M_FD_TD_APPLIQUE_SWAP', 'Tie and dye'), ...w('M_FD_TIE_DYE_WAX', 'Batik'), ...w('M_FD_APPLIQUE_PAINT', 'Fabric painting')], 'Cut shapes sewn on is appliqué.'],
    ['Otieno ties circles in a cotton cloth and dips it in dye. What technique is this?', 'Tie and dye', [...w('M_FD_TD_APPLIQUE_SWAP', 'Appliqué'), ...w('M_FD_TIE_DYE_WAX', 'Batik'), ...w('M_FD_APPLIQUE_PAINT', 'Embroidery')], 'Tying and dyeing is tie and dye.'],
    ['Amina says appliqué is painting on cloth. Her teacher corrects her. What does the teacher say?', 'Appliqué is sewing or sticking shapes', [...w('M_FD_APPLIQUE_PAINT', 'Appliqué is painting with a brush'), ...w('M_FD_APPLIQUE_PAINT', 'Appliqué is printing with ink'), ...w('M_FD_TIE_DYE_WAX', 'Appliqué is using wax')], 'It is shapes added to cloth.'],
    ['Kamau thinks tie and dye uses wax. Which technique really uses wax?', 'Batik', [...w('M_FD_TIE_DYE_WAX', 'Tie and dye'), ...w('M_FD_TD_APPLIQUE_SWAP', 'Appliqué'), ...w('M_FD_APPLIQUE_PAINT', 'Painting')], 'Batik uses wax; tie and dye uses tying.'],
    ['Zawadi wants a cloth with round white patterns made by tying. Which technique?', 'Tie and dye', [...w('M_FD_TD_APPLIQUE_SWAP', 'Appliqué'), ...w('M_FD_TIE_DYE_WAX', 'Batik'), ...w('M_FD_APPLIQUE_PAINT', 'Embroidery')], 'Tied parts stay white.'],
  ], { h: ['Think how each pattern is made.', 'Tie and dye ties. Appliqué adds shapes.'], s1: 'Match the technique to the description.' })),
  fam('fd.dt.spot', `${FD}DECOR_TYPES`, 'spot', 3, spot([
    sp('Wekesa explains techniques. Which step has the mistake?', ['Step 1: Tie and dye uses tying.', 'Step 2: Appliqué uses cut shapes.', 'Step 3: Appliqué uses tied cloth.'], 2, 'Appliqué adds shapes. Tie and dye uses tying.', 'M_FD_TD_APPLIQUE_SWAP'),
    sp('Chebet explains appliqué. Which step has the mistake?', ['Step 1: She cuts shapes.', 'Step 2: She paints them on.', 'Step 3: She calls it appliqué.'], 1, 'Appliqué is sewn or stuck, not painted.', 'M_FD_APPLIQUE_PAINT'),
    sp('Juma explains tie and dye. Which step has the mistake?', ['Step 1: He ties the cloth.', 'Step 2: He covers it in wax.', 'Step 3: He dips it in dye.'], 1, 'Wax is for batik, not tie and dye.', 'M_FD_TIE_DYE_WAX'),
    sp('Njeri explains batik. Which step has the mistake?', ['Step 1: Wax goes on.', 'Step 2: Dye goes on.', 'Step 3: She says batik uses tied circles.'], 2, 'Tied circles are tie and dye.', 'M_FD_TD_APPLIQUE_SWAP'),
    sp('Amina explains appliqué. Which step has the mistake?', ['Step 1: She cuts a shape.', 'Step 2: She says it is a painting.', 'Step 3: She sews it.'], 1, 'Appliqué is not painting.', 'M_FD_APPLIQUE_PAINT'),
  ], { h: ['Check each step.', 'Tie and dye ties. Appliqué adds shapes. Batik uses wax.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FD.TIE_DYE
  fam('fd.td.order', `${FD}TIE_DYE`, 'steps', 1, choose([
    ['When is the cloth untied in tie and dye?', 'After dyeing and rinsing', [...w('M_FD_TD_UNTIE_FIRST', 'Before dyeing'), ...w('M_FD_TD_UNTIE_FIRST', 'While it is in the dye'), ...w('M_FD_TD_UNTIE_FIRST', 'Before it is wet')], 'Untie at the end to show the pattern.'],
    ['What colour are the tied parts after dyeing?', 'The cloth\'s own colour', [...w('M_FD_TD_TIED_DARK', 'The darkest dye colour'), ...w('M_FD_TD_TIED_DARK', 'Black'), ...w('M_FD_TD_TIED_DARK', 'A new colour')], 'The dye cannot reach tied parts.'],
    ['Why is a dye fastener such as salt used?', 'It helps the colour stay in the cloth', [...w('M_FD_TD_NO_FIXER', 'It is not needed'), ...w('M_FD_TD_NO_FIXER', 'It makes the cloth heavier'), ...w('M_FD_TD_NO_FIXER', 'It removes the colour')], 'A fastener helps hold the colour.'],
    ['What is done to the cloth first?', 'It is wetted and tied', [...w('M_FD_TD_UNTIE_FIRST', 'It is dyed and untied'), ...w('M_FD_TD_UNTIE_FIRST', 'It is dried in the sun'), ...w('M_FD_TD_UNTIE_FIRST', 'It is cut up')], 'Wet and tie first.'],
    ['Where is the dyed cloth dried?', 'In the shade', [...w('M_FD_TD_NO_FIXER', 'In the dye bucket'), ...w('M_FD_TD_NO_FIXER', 'In a closed bag'), ...w('M_FD_TD_NO_FIXER', 'Under a heavy stone')], 'Shade stops the colours fading.'],
  ], { h: ['Think of the order: wet, tie, dye, rinse, untie, dry.', 'Tied parts stay the cloth colour.'], s1: 'Put the steps in order.' })),
  fam('fd.td.story', `${FD}TIE_DYE`, 'word', 2, choose([
    ['Njeri unties her cloth before putting it in the dye. What is wrong?', 'The pattern will not form', [...w('M_FD_TD_UNTIE_FIRST', 'Nothing is wrong'), ...w('M_FD_TD_UNTIE_FIRST', 'The dye will be hot'), ...w('M_FD_TD_UNTIE_FIRST', 'The cloth will shrink')], 'Untie after dyeing.'],
    ['Otieno opens his dyed cloth. The tied circles are white. Why?', 'The dye could not reach them', [...w('M_FD_TD_TIED_DARK', 'They soaked up the most dye'), ...w('M_FD_TD_TIED_DARK', 'They were bleached'), ...w('M_FD_TD_TIED_DARK', 'They were painted white')], 'Tied parts keep the cloth colour.'],
    ['Amina\'s colour washes out. Her teacher says she skipped something. What?', 'The dye fastener', [...w('M_FD_TD_NO_FIXER', 'The tying'), ...w('M_FD_TD_NO_FIXER', 'The shade drying'), ...w('M_FD_TD_NO_FIXER', 'The rinsing')], 'A fastener helps the colour stay.'],
    ['Kamau pours dye with bare hands. What should he do instead?', 'Wear gloves and ask an adult', [...w('M_FD_TD_NO_FIXER', 'Wear nothing'), ...w('M_FD_TD_NO_FIXER', 'Wash his hands first'), ...w('M_FD_TD_NO_FIXER', 'Hurry up')], 'Dye needs gloves and an adult.'],
    ['Zawadi wants big circles. How does she make them?', 'Pinch the middle and tie tightly', [...w('M_FD_TD_UNTIE_FIRST', 'Cut the cloth in circles'), ...w('M_FD_TD_UNTIE_FIRST', 'Paint circles in wax'), ...w('M_FD_TD_UNTIE_FIRST', 'Fold and leave it loose')], 'Pinch and tie.'],
  ], { h: ['Think of the order: wet, tie, dye, rinse, untie, dry.', 'Tied parts stay the cloth colour.'], s1: 'Decide what the learner should do.' })),
  fam('fd.td.spot', `${FD}TIE_DYE`, 'spot', 3, spot([
    sp('Wekesa explains the steps. Which step has the mistake?', ['Step 1: Wet and tie the cloth.', 'Step 2: Untie it.', 'Step 3: Dye it.'], 1, 'Untie after dyeing.', 'M_FD_TD_UNTIE_FIRST'),
    sp('Chebet explains the result. Which step has the mistake?', ['Step 1: She dyes the cloth.', 'Step 2: She unties it.', 'Step 3: She says tied parts are the darkest.'], 2, 'Tied parts stay the cloth colour.', 'M_FD_TD_TIED_DARK'),
    sp('Juma explains care. Which step has the mistake?', ['Step 1: He dyes the cloth.', 'Step 2: He says a fastener is not needed.', 'Step 3: He rinses it.'], 1, 'A fastener helps hold the colour.', 'M_FD_TD_NO_FIXER'),
    sp('Njeri explains order. Which step has the mistake?', ['Step 1: Dye.', 'Step 2: Untie before rinsing and drying.', 'Step 3: Dry in the shade.'], 1, 'Rinse before untying and drying.', 'M_FD_TD_UNTIE_FIRST'),
    sp('Amina explains the circles. Which step has the mistake?', ['Step 1: She ties a circle.', 'Step 2: She dyes the cloth.', 'Step 3: She says the circle is darker than the rest.'], 2, 'The circle stays the cloth colour.', 'M_FD_TD_TIED_DARK'),
  ], { h: ['Check each step.', 'Wet, tie, dye, rinse, untie, dry.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FD.APPLIQUE
  fam('fd.ap.which', `${FD}APPLIQUE`, 'direct', 1, choose([
    ['What happens to the background cloth in appliqué?', 'It stays whole', [...w('M_FD_APP_CUT_BACKGROUND', 'Shapes are cut out of it'), ...w('M_FD_APP_CUT_BACKGROUND', 'It is torn in two'), ...w('M_FD_APP_CUT_BACKGROUND', 'It is thrown away')], 'Shapes go on top of it.'],
    ['How are the shapes held on?', 'Sewn or stuck round the edges', [...w('M_FD_APP_LOOSE', 'They stay loose'), ...w('M_FD_APP_LOOSE', 'They are only pressed'), ...w('M_FD_APP_LOOSE', 'They are tied with wool')], 'Edges must be fixed.'],
    ['What should be done before sewing the shapes?', 'Pin or tack them in place', [...w('M_FD_APP_NO_PIN', 'Nothing, just sew'), ...w('M_FD_APP_NO_PIN', 'Wash them in dye'), ...w('M_FD_APP_NO_PIN', 'Cut them smaller')], 'Pinning stops them slipping.'],
    ['Which tool cuts the shapes from cloth?', 'Fabric scissors', [...w('M_FD_APP_CUT_BACKGROUND', 'A saw'), ...w('M_FD_APP_CUT_BACKGROUND', 'A hammer'), ...w('M_FD_APP_CUT_BACKGROUND', 'A spoon')], 'Scissors cut cloth.'],
    ['Which is needed to sew the shapes on?', 'Needle and thread', [...w('M_FD_APP_LOOSE', 'Wax and a brush'), ...w('M_FD_APP_LOOSE', 'Dye and a bucket'), ...w('M_FD_APP_LOOSE', 'Sand and water')], 'Stitches hold the shapes on.'],
  ], { h: ['Think: cut, place, fix.', 'The background stays whole.'], s1: 'Recall how appliqué is made.' })),
  fam('fd.ap.story', `${FD}APPLIQUE`, 'word', 2, choose([
    ['Njeri wants a yellow sun on a blue cloth. How does she make it by appliqué?', 'Sews a yellow circle on top', [...w('M_FD_APP_CUT_BACKGROUND', 'Cuts a circle out of the blue cloth'), ...w('M_FD_APP_LOOSE', 'Lays a yellow circle on, loose'), ...w('M_FD_APP_CUT_BACKGROUND', 'Burns a hole in the blue cloth')], 'She adds a shape on top.'],
    ['Otieno\'s shapes slip while he sews. What should he have done?', 'Pinned them first', [...w('M_FD_APP_NO_PIN', 'Sewn faster'), ...w('M_FD_APP_NO_PIN', 'Used bigger shapes'), ...w('M_FD_APP_NO_PIN', 'Used wet cloth')], 'Pin or tack first.'],
    ['Amina\'s shapes fall off after washing. What was missing?', 'Stitches or glue on the edges', [...w('M_FD_APP_LOOSE', 'More dye on the cloth'), ...w('M_FD_APP_LOOSE', 'Wax on the shapes'), ...w('M_FD_APP_LOOSE', 'A wooden frame round it')], 'The edges must be fixed.'],
    ['Kamau cuts a hole in his background and sews a shape behind it. Is this appliqué?', 'No, shapes go on top of the background', [...w('M_FD_APP_CUT_BACKGROUND', 'Yes, this is how it is done'), ...w('M_FD_APP_CUT_BACKGROUND', 'Yes, if the shape is red'), ...w('M_FD_APP_CUT_BACKGROUND', 'Yes, if the hole is round')], 'The background stays whole.'],
    ['Zawadi chooses fabrics for appliqué. Which choice is right?', 'Cotton and scrap cloth', [...w('M_FD_APP_LOOSE', 'A paper background only'), ...w('M_FD_APP_LOOSE', 'Wax paper shapes only'), ...w('M_FD_APP_LOOSE', 'A wet sponge only')], 'Cloth shapes on a cloth background.'],
  ], { h: ['Think: cut, place, fix.', 'The background stays whole.'], s1: 'Decide what the learner should do.' })),
  fam('fd.ap.spot', `${FD}APPLIQUE`, 'spot', 3, spot([
    sp('Wekesa explains appliqué. Which step has the mistake?', ['Step 1: Cut a shape.', 'Step 2: Cut a hole in the background.', 'Step 3: Sew the shape.'], 1, 'The background stays whole.', 'M_FD_APP_CUT_BACKGROUND'),
    sp('Chebet explains fixing. Which step has the mistake?', ['Step 1: Place the shape.', 'Step 2: Leave it loose.', 'Step 3: Admire the work.'], 1, 'Sew or stick the edges.', 'M_FD_APP_LOOSE'),
    sp('Juma explains the steps. Which step has the mistake?', ['Step 1: Cut shapes.', 'Step 2: Start sewing without placing them.', 'Step 3: Finish the edges.'], 1, 'Pin or tack them in place first.', 'M_FD_APP_NO_PIN'),
    sp('Njeri explains the cloth. Which step has the mistake?', ['Step 1: The background is cotton.', 'Step 2: She cuts it into pieces.', 'Step 3: The shapes go on top.'], 1, 'Keep the background whole.', 'M_FD_APP_CUT_BACKGROUND'),
    sp('Amina explains finishing. Which step has the mistake?', ['Step 1: Pin the shape.', 'Step 2: Sew round the edges.', 'Step 3: Say it does not need fixing.'], 2, 'The edges must be fixed.', 'M_FD_APP_LOOSE'),
  ], { h: ['Check each step.', 'Cut, place, fix.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FN.BACKGROUND
  fam('fn.bg.match', `${FN}BACKGROUND`, 'direct', 1, choose([
    ['The isukuti is a dance of which community?', 'The Luhya', [...w('M_FN_COMMUNITY_MIX', 'The Maasai'), ...w('M_FN_COMMUNITY_MIX', 'The Luo'), ...w('M_FN_COMMUNITY_MIX', 'The Swahili')], 'Isukuti belongs to the Luhya.'],
    ['The adumu, a jumping dance, is from which community?', 'The Maasai', [...w('M_FN_COMMUNITY_MIX', 'The Luhya'), ...w('M_FN_COMMUNITY_MIX', 'The Kikuyu'), ...w('M_FN_COMMUNITY_MIX', 'The Luo')], 'Adumu is a Maasai dance.'],
    ['The chakacha is danced mostly at which occasion?', 'Weddings and celebrations', [...w('M_FN_OCCASION_SAME', 'Only funerals'), ...w('M_FN_OCCASION_SAME', 'Only school exams'), ...w('M_FN_OCCASION_SAME', 'Only harvests')], 'Chakacha is danced at weddings and celebrations.'],
    ['Who leads the song in a call-and-response dance?', 'The soloist', [...w('M_FN_SOLOIST_CHORUS_SWAP', 'The chorus'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'The audience'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'The drum')], 'The soloist leads.'],
    ['Who answers the soloist?', 'The chorus', [...w('M_FN_SOLOIST_CHORUS_SWAP', 'The soloist'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'The drummer'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'The teacher')], 'The chorus gives the response.'],
  ], { h: ['Think of the dance and its people.', 'Soloist leads, chorus answers.'], s1: 'Recall the background of the dance.' })),
  fam('fn.bg.story', `${FN}BACKGROUND`, 'word', 2, choose([
    ['Njeri watches a dance with drums at a Luhya celebration. Which dance is it likely to be?', 'Isukuti', [...w('M_FN_COMMUNITY_MIX', 'Adumu'), ...w('M_FN_COMMUNITY_MIX', 'Chakacha'), ...w('M_FN_COMMUNITY_MIX', 'Ohangla')], 'Isukuti is a Luhya drum dance.'],
    ['Otieno sees young Maasai men jump high one after another. Which dance is this?', 'Adumu', [...w('M_FN_COMMUNITY_MIX', 'Isukuti'), ...w('M_FN_COMMUNITY_MIX', 'Chakacha'), ...w('M_FN_COMMUNITY_MIX', 'Mwomboko')], 'Adumu is the Maasai jumping dance.'],
    ['Amina is told the chakacha is from the coast. Which people are they?', 'The Swahili', [...w('M_FN_COMMUNITY_MIX', 'The Luo'), ...w('M_FN_COMMUNITY_MIX', 'The Maasai'), ...w('M_FN_COMMUNITY_MIX', 'The Luhya')], 'Chakacha is a Swahili dance.'],
    ['Kamau leads a song and the group answers. What is his role?', 'Soloist', [...w('M_FN_SOLOIST_CHORUS_SWAP', 'Chorus'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'Audience'), ...w('M_FN_SOLOIST_CHORUS_SWAP', 'Instrumentalist')], 'The leader of the song is the soloist.'],
    ['Zawadi says every folk dance is performed at the same kind of occasion. What is wrong?', 'Different dances have different occasions', [...w('M_FN_OCCASION_SAME', 'Nothing is wrong'), ...w('M_FN_OCCASION_SAME', 'All dances are for funerals'), ...w('M_FN_OCCASION_SAME', 'All dances are for sports')], 'Occasions differ by dance.'],
  ], { h: ['Think of the dance and its people.', 'Soloist leads, chorus answers.'], s1: 'Match the dance to its people or role.' })),
  fam('fn.bg.spot', `${FN}BACKGROUND`, 'spot', 3, spot([
    sp('Wekesa gives background. Which step has the mistake?', ['Step 1: Isukuti is danced with drums.', 'Step 2: It is a Maasai dance.', 'Step 3: It is danced at celebrations.'], 1, 'Isukuti is a Luhya dance.', 'M_FN_COMMUNITY_MIX'),
    sp('Chebet explains roles. Which step has the mistake?', ['Step 1: The soloist leads.', 'Step 2: The chorus leads the song.', 'Step 3: The dancers dance.'], 1, 'The soloist leads and the chorus answers.', 'M_FN_SOLOIST_CHORUS_SWAP'),
    sp('Juma explains occasions. Which step has the mistake?', ['Step 1: Chakacha is danced at weddings.', 'Step 2: All dances are only for funerals.', 'Step 3: Different dances suit different events.'], 1, 'Occasions differ.', 'M_FN_OCCASION_SAME'),
    sp('Njeri names a dance. Which step has the mistake?', ['Step 1: Adumu is a jumping dance.', 'Step 2: It is danced by the Luo.', 'Step 3: It is performed at ceremonies.'], 1, 'Adumu is Maasai.', 'M_FN_COMMUNITY_MIX'),
    sp('Amina explains call and response. Which step has the mistake?', ['Step 1: One singer calls.', 'Step 2: The group answers.', 'Step 3: She says the group is the soloist.'], 2, 'The single leader is the soloist.', 'M_FN_SOLOIST_CHORUS_SWAP'),
  ], { h: ['Check each step.', 'Soloist leads, chorus answers.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FN.COMPONENTS
  fam('fn.cp.name', `${FN}COMPONENTS`, 'direct', 1, choose([
    ['Beads worn on the neck are which component?', 'Ornaments', [...w('M_FN_ORNAMENT_COSTUME', 'Costume'), ...w('M_FN_PROP_INSTRUMENT', 'Props'), ...w('M_FN_FORMATION_WORN', 'Formation')], 'Beads are ornaments.'],
    ['A drum belongs to which component?', 'Instruments', [...w('M_FN_PROP_INSTRUMENT', 'Props'), ...w('M_FN_ORNAMENT_COSTUME', 'Costume'), ...w('M_FN_FORMATION_WORN', 'Formation')], 'A drum makes music.'],
    ['What is a formation in a dance?', 'The shape the dancers make', [...w('M_FN_FORMATION_WORN', 'A costume worn'), ...w('M_FN_FORMATION_WORN', 'A drum beat'), ...w('M_FN_ORNAMENT_COSTUME', 'Beads')], 'A circle or a line is a formation.'],
    ['The clothes dancers wear are called what?', 'Costume', [...w('M_FN_ORNAMENT_COSTUME', 'Ornaments'), ...w('M_FN_FORMATION_WORN', 'Formation'), ...w('M_FN_PROP_INSTRUMENT', 'Props')], 'Clothes worn are the costume.'],
    ['A shield carried by a dancer is which component?', 'A prop', [...w('M_FN_PROP_INSTRUMENT', 'An instrument'), ...w('M_FN_ORNAMENT_COSTUME', 'An ornament'), ...w('M_FN_FORMATION_WORN', 'A formation')], 'A prop is something carried.'],
  ], { h: ['Think: worn, carried, played, shaped.', 'Ornament beads, costume clothes, prop carried, instrument played.'], s1: 'Name the component.' })),
  fam('fn.cp.story', `${FN}COMPONENTS`, 'word', 2, choose([
    ['Njeri wears a beaded necklace and anklets in a dance. What are they?', 'Ornaments', [...w('M_FN_ORNAMENT_COSTUME', 'Costume'), ...w('M_FN_PROP_INSTRUMENT', 'Props'), ...w('M_FN_FORMATION_WORN', 'Formation')], 'Beads are ornaments.'],
    ['Otieno beats a drum for the dancers. What component is the drum?', 'An instrument', [...w('M_FN_PROP_INSTRUMENT', 'A prop'), ...w('M_FN_ORNAMENT_COSTUME', 'A costume'), ...w('M_FN_FORMATION_WORN', 'A formation')], 'A drum is played, so it is an instrument.'],
    ['The dancers move from a line into a circle. What changed?', 'Their formation', [...w('M_FN_FORMATION_WORN', 'Their costume'), ...w('M_FN_ORNAMENT_COSTUME', 'Their ornaments'), ...w('M_FN_PROP_INSTRUMENT', 'Their props')], 'A formation is the shape the dancers make.'],
    ['Amina says her skirt is an ornament. What is it really?', 'Costume', [...w('M_FN_ORNAMENT_COSTUME', 'An ornament'), ...w('M_FN_FORMATION_WORN', 'A formation'), ...w('M_FN_PROP_INSTRUMENT', 'A prop')], 'Clothes are costume.'],
    ['Kamau carries a stick in the dance. Which component is it?', 'A prop', [...w('M_FN_PROP_INSTRUMENT', 'An instrument'), ...w('M_FN_ORNAMENT_COSTUME', 'An ornament'), ...w('M_FN_FORMATION_WORN', 'A formation')], 'Something carried is a prop.'],
  ], { h: ['Think: worn, carried, played, shaped.', 'Ornament beads, costume clothes, prop carried, instrument played.'], s1: 'Name the component.' })),
  fam('fn.cp.spot', `${FN}COMPONENTS`, 'spot', 3, spot([
    sp('Wekesa sorts items. Which step has the mistake?', ['Step 1: Beads are ornaments.', 'Step 2: A drum is a prop.', 'Step 3: A skirt is costume.'], 1, 'A drum is an instrument.', 'M_FN_PROP_INSTRUMENT'),
    sp('Chebet sorts items. Which step has the mistake?', ['Step 1: A circle is a formation.', 'Step 2: A necklace is costume.', 'Step 3: A stick is a prop.'], 1, 'A necklace is an ornament.', 'M_FN_ORNAMENT_COSTUME'),
    sp('Juma explains formation. Which step has the mistake?', ['Step 1: Dancers stand in a line.', 'Step 2: Then in a circle.', 'Step 3: He says a formation is something they wear.'], 2, 'A formation is a shape.', 'M_FN_FORMATION_WORN'),
    sp('Njeri sorts items. Which step has the mistake?', ['Step 1: A horn is an instrument.', 'Step 2: A shield is a prop.', 'Step 3: Anklets are costume.'], 2, 'Anklets are ornaments.', 'M_FN_ORNAMENT_COSTUME'),
    sp('Amina sorts items. Which step has the mistake?', ['Step 1: A skirt is costume.', 'Step 2: A rattle that makes music is a prop.', 'Step 3: Beads are ornaments.'], 1, 'A rattle that makes music is an instrument.', 'M_FN_PROP_INSTRUMENT'),
  ], { h: ['Check each step.', 'Ornament beads, costume clothes, prop carried, instrument played.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FN.ROLES
  fam('fn.rl.which', `${FN}ROLES`, 'direct', 1, choose([
    ['Which is a role of folk dance in a community?', 'Handing down culture and values', [...w('M_FN_ROLE_FUN_ONLY', 'Only passing time'), ...w('M_FN_ROLE_OLD_ONLY', 'Only for old people'), ...w('M_FN_ROLE_NO_WORK', 'It can never earn money')], 'Dance passes on culture.'],
    ['Folk dances are performed by whom?', 'People of different ages', [...w('M_FN_ROLE_OLD_ONLY', 'Only old people'), ...w('M_FN_ROLE_OLD_ONLY', 'Only the very young'), ...w('M_FN_ROLE_OLD_ONLY', 'Only one family')], 'Many ages take part.'],
    ['How can folk dance earn an income?', 'Performers are paid at events', [...w('M_FN_ROLE_NO_WORK', 'It cannot earn an income'), ...w('M_FN_ROLE_NO_WORK', 'Dancers must pay to dance'), ...w('M_FN_ROLE_NO_WORK', 'Only the audience is paid')], 'Performers can be paid.'],
    ['Folk dance helps people to do what?', 'Come together', [...w('M_FN_ROLE_FUN_ONLY', 'Stay apart'), ...w('M_FN_ROLE_FUN_ONLY', 'Forget their customs'), ...w('M_FN_ROLE_FUN_ONLY', 'Stop talking')], 'Dance brings people together.'],
    ['Which event may be marked by a folk dance?', 'A wedding', [...w('M_FN_ROLE_FUN_ONLY', 'Nothing at all'), ...w('M_FN_ROLE_FUN_ONLY', 'Only a sports match'), ...w('M_FN_ROLE_FUN_ONLY', 'Only a test')], 'Dances mark events.'],
  ], { h: ['Dance is more than fun.', 'Culture, values, togetherness, events, income.'], s1: 'Think of what dance does for people.' })),
  fam('fn.rl.story', `${FN}ROLES`, 'word', 2, choose([
    ['Njeri says dance is only for fun. Her grandmother says it also teaches what?', 'Culture and values', [...w('M_FN_ROLE_FUN_ONLY', 'Only the steps'), ...w('M_FN_ROLE_FUN_ONLY', 'Nothing more'), ...w('M_FN_ROLE_FUN_ONLY', 'How to count')], 'Dances hand down culture and values.'],
    ['Otieno thinks only old people dance. Who danced at the school day?', 'Learners and elders together', [...w('M_FN_ROLE_OLD_ONLY', 'Only elders'), ...w('M_FN_ROLE_OLD_ONLY', 'Only teachers'), ...w('M_FN_ROLE_OLD_ONLY', 'Nobody')], 'All ages can take part.'],
    ['Amina\'s cousin is paid to dance at hotels. What role of dance is this?', 'Earning an income', [...w('M_FN_ROLE_NO_WORK', 'Passing time'), ...w('M_FN_ROLE_NO_WORK', 'Doing a favour'), ...w('M_FN_ROLE_NO_WORK', 'Avoiding work')], 'Dance can earn an income.'],
    ['Kamau\'s village dances at a harvest. Which role is this?', 'Marking an event', [...w('M_FN_ROLE_FUN_ONLY', 'Doing nothing'), ...w('M_FN_ROLE_FUN_ONLY', 'Hiding the harvest'), ...w('M_FN_ROLE_FUN_ONLY', 'Stopping work')], 'Dance marks events like harvests.'],
    ['Zawadi\'s school dances with a neighbouring school. Which role is this?', 'Bringing people together', [...w('M_FN_ROLE_FUN_ONLY', 'Keeping people apart'), ...w('M_FN_ROLE_FUN_ONLY', 'Having a contest'), ...w('M_FN_ROLE_FUN_ONLY', 'Earning marks')], 'Dance brings people together.'],
  ], { h: ['Dance is more than fun.', 'Culture, values, togetherness, events, income.'], s1: 'Decide which role fits.' })),
  fam('fn.rl.spot', `${FN}ROLES`, 'spot', 3, spot([
    sp('Wekesa lists roles. Which step has the mistake?', ['Step 1: Dance hands down culture.', 'Step 2: Dance is only for fun.', 'Step 3: Dance brings people together.'], 1, 'Dance has many roles.', 'M_FN_ROLE_FUN_ONLY'),
    sp('Chebet describes dancers. Which step has the mistake?', ['Step 1: Children dance.', 'Step 2: Adults dance.', 'Step 3: Only old people dance.'], 2, 'People of all ages can take part.', 'M_FN_ROLE_OLD_ONLY'),
    sp('Juma describes work. Which step has the mistake?', ['Step 1: Performers are invited to weddings.', 'Step 2: They are paid.', 'Step 3: He says dance can never earn money.'], 2, 'Dance can earn an income.', 'M_FN_ROLE_NO_WORK'),
    sp('Njeri lists roles. Which step has the mistake?', ['Step 1: Marks events.', 'Step 2: Teaches values.', 'Step 3: It is only to pass time.'], 2, 'It has more roles than that.', 'M_FN_ROLE_FUN_ONLY'),
    sp('Amina describes a group. Which step has the mistake?', ['Step 1: The group includes learners.', 'Step 2: It includes elders.', 'Step 3: She says elders are not allowed.'], 2, 'Elders can take part.', 'M_FN_ROLE_OLD_ONLY'),
  ], { h: ['Check each step.', 'Dance has many roles.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FN.DANCE_SAFETY
  fam('fn.sf.rule', `${FN}DANCE_SAFETY`, 'direct', 1, choose([
    ['What should dancers do before dancing?', 'Warm up', [...w('M_FN_NO_WARMUP', 'Start straight away'), ...w('M_FN_NO_WARMUP', 'Sit still for an hour'), ...w('M_FN_NO_WARMUP', 'Eat a big meal')], 'Warming up protects muscles.'],
    ['What is the respectful action when another community dances?', 'Watch politely and clap', [...w('M_FN_MOCK_OTHER', 'Laugh at the steps'), ...w('M_FN_MOCK_OTHER', 'Copy them to tease'), ...w('M_FN_MOCK_OTHER', 'Walk away loudly')], 'Respect every community\'s dances.'],
    ['What should be done to the dancing space?', 'Clear stones and sharp things', [...w('M_FN_CROWDED_SPACE', 'Nothing'), ...w('M_FN_CROWDED_SPACE', 'Add more stones'), ...w('M_FN_CROWDED_SPACE', 'Leave it as found')], 'A clear space is safer.'],
    ['Why is a warm-up needed?', 'To get muscles ready and avoid injury', [...w('M_FN_NO_WARMUP', 'To make the dance shorter'), ...w('M_FN_NO_WARMUP', 'To make dancers tired'), ...w('M_FN_NO_WARMUP', 'To pass time')], 'Warm muscles are safer.'],
    ['What should dancers do with loose ornaments?', 'Fix them securely', [...w('M_FN_CROWDED_SPACE', 'Let them hang loose'), ...w('M_FN_CROWDED_SPACE', 'Throw them away mid-dance'), ...w('M_FN_CROWDED_SPACE', 'Swing them at friends')], 'Loose ornaments can hurt or trip.'],
  ], { h: ['Think safe and respectful.', 'Warm up, clear space, respect others.'], s1: 'Recall the safety and respect rules.' })),
  fam('fn.sf.story', `${FN}DANCE_SAFETY`, 'word', 2, choose([
    ['Njeri\'s class is about to rehearse. What should come first?', 'A warm-up', [...w('M_FN_NO_WARMUP', 'The whole dance at full speed'), ...w('M_FN_NO_WARMUP', 'A long rest'), ...w('M_FN_NO_WARMUP', 'A race')], 'Warm up first.'],
    ['Otieno\'s friends laugh at a Luo dance on stage. What should Otieno do?', 'Ask them to be respectful', [...w('M_FN_MOCK_OTHER', 'Laugh too'), ...w('M_FN_MOCK_OTHER', 'Imitate the dancers'), ...w('M_FN_MOCK_OTHER', 'Leave early')], 'Respect all dances.'],
    ['Amina sees a sharp stone in the dancing area. What should she do?', 'Pick it up and move it away', [...w('M_FN_CROWDED_SPACE', 'Dance around it'), ...w('M_FN_CROWDED_SPACE', 'Ignore it'), ...w('M_FN_CROWDED_SPACE', 'Kick it to a friend')], 'Clear the space.'],
    ['Kamau\'s beads are loose and might fall. What is the safe action?', 'Fix them before dancing', [...w('M_FN_CROWDED_SPACE', 'Dance anyway'), ...w('M_FN_CROWDED_SPACE', 'Give them to a friend mid-dance'), ...w('M_FN_CROWDED_SPACE', 'Leave them on the floor')], 'Secure ornaments.'],
    ['Zawadi wants to skip the warm-up to start sooner. What is the right reply?', 'Warm up first to stay safe', [...w('M_FN_NO_WARMUP', 'Skip it, it wastes time'), ...w('M_FN_NO_WARMUP', 'Warm up after the dance'), ...w('M_FN_NO_WARMUP', 'Only the teacher warms up')], 'Warm-ups prevent injury.'],
  ], { h: ['Think safe and respectful.', 'Warm up, clear space, respect others.'], s1: 'Decide the safe and respectful action.' })),
  fam('fn.sf.spot', `${FN}DANCE_SAFETY`, 'spot', 3, spot([
    sp('Wekesa plans a rehearsal. Which step has the mistake?', ['Step 1: He checks the space.', 'Step 2: He skips the warm-up.', 'Step 3: He starts the music.'], 1, 'Warm up first.', 'M_FN_NO_WARMUP'),
    sp('Chebet watches another group. Which step has the mistake?', ['Step 1: She sits quietly.', 'Step 2: She laughs at their dance.', 'Step 3: She claps at the end.'], 1, 'Respect their dance.', 'M_FN_MOCK_OTHER'),
    sp('Juma prepares the space. Which step has the mistake?', ['Step 1: He sweeps the floor.', 'Step 2: He leaves sharp stones.', 'Step 3: He tells everyone to start.'], 1, 'Clear stones and sharp things.', 'M_FN_CROWDED_SPACE'),
    sp('Njeri plans safety. Which step has the mistake?', ['Step 1: Warm up.', 'Step 2: Fix ornaments.', 'Step 3: Mock the other group.'], 2, 'Respect others.', 'M_FN_MOCK_OTHER'),
    sp('Amina plans a performance. Which step has the mistake?', ['Step 1: Clear the space.', 'Step 2: Warm up.', 'Step 3: Say a warm-up is a waste of time.'], 2, 'Warm-ups matter.', 'M_FN_NO_WARMUP'),
  ], { h: ['Check each step.', 'Warm up, clear space, respect others.'], s1: 'Find the step that is not safe or respectful.' })),
];
