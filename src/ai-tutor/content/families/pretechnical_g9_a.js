// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 9, A (9 skills): raised platforms, hazardous substances, talents, oblique projection, visual programming, wood,
// waste. Written offline from the KICD design through the curriculum map. Every wrong answer names the library misconception it reveals. All
// stay reviewed:false until a CBC Pre-Technical teacher signs them off. Working at height and handling substances are done only with a
// teacher; questions ask for names, reasons and order.
// ============================================================================
import { S } from './pretechnical_g9_lib.js';
const RP = 'FOUNDA.SAFETY_ON_RAISED_PLATFOR.', HZ = 'FOUNDA.HANDLING_HAZARDOUS_SUBST.', SE = 'FOUNDA.SELF_EXPLORATION_AND_CAR.';
const OB = 'COMMUN.OBLIQUE_PROJECTION.', VP = 'COMMUN.VISUAL_PROGRAMMING.', WD = 'MATERI.WOOD.', WS = 'MATERI.HANDLING_WASTE_MATERIALS.';

export const FAMILIES = [
  ...S('rp', RP, 'RAISED_PLATFORMS', ['RP_SAFE', 'RP_RISK', 'RP_TYPE'], ['Work at height needs a trained adult and a helper.', 'The main risk at height is falling.'], [
    ['Who should work on a raised platform?', 'A trained adult with a helper', 'A learner working alone', 'A child who likes climbing', 'Anyone who is in a hurry'],
    ['Which is a risk of working at height?', 'Falling', 'Getting a cold', 'Getting bored', 'Getting thirsty'],
    ['Which is a raised platform?', 'A scaffold', 'A flat floor', 'A grass lawn', 'A tarmac road'],
    ['Which is a raised platform?', 'A step ladder', 'A rug on the floor', 'A mat at the door', 'A bench on the ground'],
    ['What can fall and hurt people below a platform?', 'Tools and materials', 'Only the clouds', 'Only the rain', 'Only the shade'],
  ], [
    ['A painter climbs a ladder to paint a high wall. Who should be at the bottom?', 'A helper holding the ladder', 'Nobody at all', 'A child playing nearby', 'Someone with no task'],
    ['A learner wants to climb a scaffold alone to see the view. What should the teacher say?', 'No, only trained adults work at height', 'Yes, because it is quite safe', 'Yes, but only for five minutes', 'Yes, if the climb is quick'],
    ['A worker drops a hammer from a platform. What is the danger?', 'It can hurt people below', 'It makes noise only', 'It cools the ground', 'There is no danger'],
    ['A ladder rests on soft, uneven ground. What may happen?', 'It may slip and cause a fall', 'It will be extra safe there', 'It will grow much stronger', 'Nothing at all may happen'],
    ['Which of these is used to reach a high place at work?', 'A ladder', 'A rug', 'A pillow', 'A basket on the ground'],
  ], [
    ['Which step is the mistake?', 'Step 1: Working at height is risky.', 'Step 2: A fall can cause serious harm.', 'Step 3: So a learner may climb alone.', 'Only a trained adult with a helper works at height.', 2],
    ['Which step is the mistake?', 'Step 1: Platforms are raised above the ground.', 'Step 2: People can fall from them.', 'Step 3: So the main risk is catching a cold.', 'The main risk is falling.', 2],
    ['Which step is the mistake?', 'Step 1: A scaffold holds workers up.', 'Step 2: It is a raised platform.', 'Step 3: So a flat floor is a raised platform.', 'A flat floor is not a raised platform.', 2],
    ['Which step is the mistake?', 'Step 1: Tools can fall from heights.', 'Step 2: People below may be hurt.', 'Step 3: So nobody needs to watch below.', 'People below must be kept clear.', 2],
    ['Which step is the mistake?', 'Step 1: A ladder needs firm ground.', 'Step 2: A helper holds it.', 'Step 3: So any ground will do.', 'Firm, level ground is needed.', 2],
  ], ['a', 'b']),
  ...S('hc', HZ, 'HAZARD_CLASSIFY', ['HC_FLAMMABLE', 'HC_CORROSIVE', 'HC_PETROL'], ['Flammable catches fire; corrosive eats away; toxic poisons.', 'Petrol is flammable.'], [
    ['Which word means catches fire easily?', 'Flammable', 'Corrosive', 'Toxic', 'Harmless'],
    ['Which word means eats away skin and metal?', 'Corrosive', 'Toxic', 'Flammable', 'Harmless'],
    ['How is petrol classified?', 'Flammable', 'Safe', 'Harmless', 'Edible'],
    ['Which word means poisonous?', 'Toxic', 'Flammable', 'Corrosive', 'Harmless'],
    ['Which is a hazardous substance?', 'Pesticide', 'Clean water', 'Maize flour', 'Cooking salt'],
  ], [
    ['A bottle shows a flame symbol. What is it warning about?', 'It catches fire easily', 'It is sweet', 'It is cold', 'It is harmless'],
    ['A bottle of strong acid eats through cloth. What kind of hazard is it?', 'Corrosive', 'Flammable', 'Harmless', 'Edible'],
    ['A can of paraffin sits near a stove. Why is this unsafe?', 'It is flammable', 'It is heavy', 'It is cold', 'It is sweet'],
    ['A pesticide can harm a person who swallows it. What kind of hazard is it?', 'Toxic', 'Flammable', 'Harmless', 'Edible'],
    ['A label shows a skull and crossbones. What does it warn about?', 'Poison', 'Fire', 'Cold', 'Sweetness'],
  ], [
    ['Which step is the mistake?', 'Step 1: Petrol burns easily.', 'Step 2: A flammable substance catches fire.', 'Step 3: So petrol is a safe substance.', 'Petrol is flammable.', 2],
    ['Which step is the mistake?', 'Step 1: Strong acid damages skin.', 'Step 2: It also damages metal.', 'Step 3: So it is flammable.', 'It is corrosive.', 2],
    ['Which step is the mistake?', 'Step 1: Flammable means catches fire.', 'Step 2: Matches start fires.', 'Step 3: So flammable means eats away metal.', 'Flammable means catches fire.', 2],
    ['Which step is the mistake?', 'Step 1: Pesticides kill pests.', 'Step 2: They can harm people too.', 'Step 3: So pesticides are harmless to people.', 'They are toxic.', 2],
    ['Which step is the mistake?', 'Step 1: Labels show the hazard.', 'Step 2: Each symbol has a meaning.', 'Step 3: So labels need not be read.', 'Labels must be read.', 2],
  ], ['a', 'b']),
  ...S('hh', HZ, 'HAZARD_HANDLING', ['HH_LABEL', 'HH_MIX', 'HH_STORE'], ['Read the label, never mix cleaners, store in labelled containers out of reach.', 'Ask a teacher or adult for anything dangerous.'], [
    ['What should you do before using a substance?', 'Read the label', 'Open it at once', 'Smell it closely', 'Taste a little'],
    ['What should you do with two cleaners?', 'Never mix them', 'Mix them to be stronger', 'Mix them in a bottle', 'Mix them with food'],
    ['How should paraffin be stored?', 'In a labelled container out of reach', 'In a drink bottle on the table', 'In a cup near the stove', 'In an open bowl'],
    ['What should you wear to handle a harmful cleaner?', 'Gloves', 'Nothing at all', 'A wet cloth only', 'A hat only'],
    ['Where should you use a strong cleaner?', 'In a place with fresh air', 'In a closed small room', 'Near a fire', 'Near food'],
  ], [
    ['Wekesa finds a bottle with no label. What should he do?', 'Leave it and tell a teacher', 'Smell it to find out', 'Taste a drop', 'Mix it with water'],
    ['Njeri wants to clean the sink with two cleaners together. What should she do?', 'Use one at a time as the label says', 'Mix both for more cleaning power', 'Add a third cleaner as well', 'Pour them both into one bottle'],
    ['A family keeps pesticide in an old juice bottle. What is wrong?', 'A child may drink it by mistake', 'Nothing is wrong', 'It makes the juice sweet', 'It keeps the pesticide cool'],
    ['A teacher keeps a harmful chemical locked up. Why?', 'To keep it out of reach of children', 'To hide it from the sun only', 'To make it dry out slowly', 'To save space in the room'],
    ['A cook eats lunch while using a strong cleaner. What is wrong?', 'Never eat or drink near hazardous substances', 'Nothing is wrong with doing so', 'It keeps the cleaner fresh and strong', 'It makes lunch taste a lot better'],
  ], [
    ['Which step is the mistake?', 'Step 1: Labels give instructions.', 'Step 2: They warn about hazards.', 'Step 3: So we use the substance without reading.', 'We read the label first.', 2],
    ['Which step is the mistake?', 'Step 1: Cleaners react with each other.', 'Step 2: Some mixtures give off poisonous gas.', 'Step 3: So we mix them to be stronger.', 'We never mix cleaners.', 2],
    ['Which step is the mistake?', 'Step 1: Paraffin is flammable.', 'Step 2: It needs a safe container.', 'Step 3: So we store it in a drink bottle.', 'We store it in a labelled container out of reach.', 2],
    ['Which step is the mistake?', 'Step 1: Gloves protect the skin.', 'Step 2: Fresh air helps.', 'Step 3: So we handle chemicals without gloves in a closed room.', 'We wear gloves and use fresh air.', 2],
    ['Which step is the mistake?', 'Step 1: Young children may swallow things.', 'Step 2: Chemicals must be out of reach.', 'Step 3: So we leave them on a low shelf.', 'We keep them out of reach.', 2],
  ], ['c', 'c']),
  ...S('ta', SE, 'TALENTS', ['TA_GROW', 'TA_ETHIC', 'TA_CAREER'], ['Talents grow by practice and guidance.', 'Fair play is ethical; cheating is not.'], [
    ['How do talents grow?', 'By practice and guidance', 'Without any effort', 'By staying idle', 'By hiding them'],
    ['Which is an ethical use of a talent?', 'Playing fairly', 'Cheating to win', 'Harming a rival', 'Lying about it'],
    ['Which career links to a talent for drawing?', 'Designer', 'Driver', 'Cook only', 'Guard'],
    ['Which career links to a talent for caring for the sick?', 'Nurse', 'Mechanic', 'Painter', 'Pilot'],
    ['Which career links to a talent for running fast?', 'Athlete', 'Teacher only', 'Banker', 'Farmer only'],
  ], [
    ['Achieng loves singing and practises daily with her teacher. What does this show?', 'Talents grow by practice and guidance', 'Talents need no effort', 'Talents should be hidden', 'Talents are useless'],
    ['A footballer is offered money to lose on purpose. What is the ethical choice?', 'Refuse and play fairly', 'Accept the money', 'Hide the offer', 'Lose on purpose'],
    ['Wekesa draws well and wants a career. Which suits his talent?', 'Architect', 'Driver', 'Guard', 'Cashier'],
    ['A girl with a gift for caring wants a career. Which suits her talent?', 'Nurse', 'Mechanic', 'Painter', 'Pilot'],
    ['A learner uses her computer skill to cheat in an exam. What is this?', 'Unethical use of a talent', 'Ethical use of a talent', 'A good career', 'A fair practice'],
  ], [
    ['Which step is the mistake?', 'Step 1: A talent is a natural gift.', 'Step 2: It can be developed.', 'Step 3: So it needs no practice.', 'Talents grow by practice.', 2],
    ['Which step is the mistake?', 'Step 1: Sport has rules.', 'Step 2: Fair play is ethical.', 'Step 3: So cheating is ethical.', 'Cheating is unethical.', 2],
    ['Which step is the mistake?', 'Step 1: Drawing is a talent.', 'Step 2: Designers draw plans.', 'Step 3: So drawing links to driving.', 'Drawing links to design.', 2],
    ['Which step is the mistake?', 'Step 1: Kind people care for others.', 'Step 2: Nurses care for the sick.', 'Step 3: So caring links to being a pilot.', 'Caring links to nursing.', 2],
    ['Which step is the mistake?', 'Step 1: Talents can help others.', 'Step 2: They can also harm others.', 'Step 3: So using talents to harm is ethical.', 'Using talents to harm is unethical.', 2],
  ], ['b', 'c', 'a']),
  ...S('ob', OB, 'OBLIQUE', ['OB_FRONT', 'OB_ANGLE', 'OB_CABINET'], ['The front face is true shape; depth lines slope at 45 degrees.', 'In cabinet the depth is half size.'], [
    ['In oblique drawing the front face is drawn...', 'True shape', 'At an angle and distorted', 'Not at all', 'As a circle'],
    ['At what angle are depth lines usually drawn?', '45 degrees', '90 degrees', '10 degrees', '180 degrees'],
    ['In cabinet projection the depth is...', 'Half size', 'Full size', 'Double size', 'Left out'],
    ['In cavalier projection the depth is...', 'Full size', 'Half size', 'Left out', 'Double size'],
    ['What do the sloping lines show?', 'The depth of the object', 'The front only', 'The colours', 'The materials'],
  ], [
    ['A learner draws the front of a box as a true square. Which drawing is this?', 'Oblique drawing', 'A map', 'A poster', 'A sketch of a person'],
    ['A box is 8 cm deep. In cabinet projection the depth line is...', '4 cm', '8 cm', '16 cm', '2 cm'],
    ['A box is 8 cm deep. In cavalier projection the depth line is...', '8 cm', '4 cm', '16 cm', '2 cm'],
    ['A learner draws depth lines at a steep 90 degrees. What is wrong?', 'They should usually be at 45 degrees', 'Nothing is wrong', 'They should be at 180 degrees', 'They should be left out'],
    ['Why do engineers use oblique drawings?', 'To show an object in 3D simply', 'To show only colours', 'To show only words', 'To hide the shape'],
  ], [
    ['Which step is the mistake?', 'Step 1: Oblique drawing shows 3D shapes.', 'Step 2: The front face is drawn flat.', 'Step 3: So the front face is distorted.', 'The front face is true shape.', 2],
    ['Which step is the mistake?', 'Step 1: Depth lines slope.', 'Step 2: The usual angle is 45 degrees.', 'Step 3: So the usual angle is 90 degrees.', 'The usual angle is 45 degrees.', 2],
    ['Which step is the mistake?', 'Step 1: Cabinet projection shortens depth.', 'Step 2: It looks more natural.', 'Step 3: So depth is drawn full size.', 'Depth is half size.', 2],
    ['Which step is the mistake?', 'Step 1: Cavalier projection keeps depth.', 'Step 2: It looks long.', 'Step 3: So depth is drawn half size.', 'Depth is full size.', 2],
    ['Which step is the mistake?', 'Step 1: Oblique drawing helps makers.', 'Step 2: It shows depth.', 'Step 3: So it shows only colour.', 'It shows shape and depth.', 2],
  ], ['a', 'a']),
  ...S('va', VP, 'VISUAL_APPS', ['VA_USE', 'VA_BLOCK', 'VA_SOLVE'], ['Visual programming makes games, animations and simple apps from blocks.', 'It solves problems step by step.'], [
    ['Which can be made with visual programming?', 'A simple game', 'A brick wall', 'A cup of tea', 'A paper cup'],
    ['How is a program built in visual programming?', 'By joining blocks', 'By typing every line', 'By drawing on paper only', 'By shouting at a computer'],
    ['What can a visual program do?', 'Solve a problem step by step', 'Nothing useful', 'Only draw circles', 'Only print a page'],
    ['Which tool is used for visual programming?', 'Scratch', 'A hammer', 'A measuring tape', 'A spanner'],
    ['Which is a use of a phone app made with blocks?', 'A quiz for revision', 'Building a wall', 'Boiling water', 'Cutting wood'],
  ], [
    ['A class builds a quiz app with blocks. What kind of tool is this?', 'Visual programming', 'Typing text code only', 'A drawing board', 'A calculator'],
    ['A learner joins blocks to make a character walk. What is this?', 'An animation', 'A brick wall', 'A spanner', 'A table'],
    ['A farmer\'s son makes an app with blocks to remind him when to water crops. What does it do?', 'Solves a daily problem', 'Does nothing', 'Wastes time', 'Breaks the phone'],
    ['A learner says visual programming is only for games. What can you tell her?', 'It is also used for apps and for controlling devices', 'She is right', 'It is used only in banks', 'It is used only in farms'],
    ['A learner snaps a loop block to repeat a step. What does this save?', 'Repeating the same blocks many times', 'Electric power', 'Paper', 'Water'],
  ], [
    ['Which step is the mistake?', 'Step 1: Visual programming uses blocks.', 'Step 2: Blocks are joined into programs.', 'Step 3: So it can make a brick wall.', 'It makes programs such as games and apps.', 2],
    ['Which step is the mistake?', 'Step 1: Blocks are snapped together.', 'Step 2: This avoids typing code.', 'Step 3: So every line must be typed.', 'Blocks are joined.', 2],
    ['Which step is the mistake?', 'Step 1: A problem can be broken into steps.', 'Step 2: Blocks follow those steps.', 'Step 3: So a visual program solves nothing.', 'It solves problems step by step.', 2],
    ['Which step is the mistake?', 'Step 1: Scratch is a tool.', 'Step 2: App Inventor is a tool.', 'Step 3: So a hammer is a visual programming tool.', 'A hammer is not.', 2],
    ['Which step is the mistake?', 'Step 1: A phone app can be made with blocks.', 'Step 2: It can help with revision.', 'Step 3: So apps cannot be useful.', 'Apps can be useful.', 2],
  ], ['a', 'a']),
  ...S('wd', WD, 'WOOD_TYPES', ['WT_HARD', 'WT_SOFT', 'WT_BOARD'], ['Mahogany and mvule are hardwoods; pine and cypress are softwoods.', 'Plywood is made of glued layers.'], [
    ['Which is a hardwood?', 'Mahogany', 'Pine', 'Cypress', 'Plywood'],
    ['Which is a softwood?', 'Pine', 'Mvule', 'Mahogany', 'Teak'],
    ['What is plywood?', 'A board of glued wood layers', 'One solid plank', 'A kind of metal', 'A kind of stone'],
    ['Which wood is often used for good furniture?', 'Hardwood such as mahogany', 'Wet grass', 'Plain mud', 'Sponge'],
    ['Which is a manufactured board?', 'Chipboard', 'Mvule', 'Pine', 'Teak'],
  ], [
    ['A carpenter makes a durable table from mahogany. What type of wood is it?', 'Hardwood', 'Softwood', 'Plastic', 'Metal'],
    ['A builder uses pine for roof beams. What type of wood is it?', 'Softwood', 'Hardwood', 'Metal', 'Stone'],
    ['A board is made of thin wood layers glued crosswise. What is it?', 'Plywood', 'A solid plank', 'A metal sheet', 'A stone slab'],
    ['A school desk top is made of chipboard. How is chipboard made?', 'From wood chips pressed with glue', 'From solid logs only', 'From metal', 'From paper only'],
    ['Which wood grows faster and is cheaper?', 'Softwood', 'Hardwood', 'Teak', 'Mahogany'],
  ], [
    ['Which step is the mistake?', 'Step 1: Hardwoods come from broad-leaved trees.', 'Step 2: Mahogany is one.', 'Step 3: So pine is a hardwood.', 'Pine is a softwood.', 2],
    ['Which step is the mistake?', 'Step 1: Softwoods come from cone-bearing trees.', 'Step 2: Pine is one.', 'Step 3: So mvule is a softwood.', 'Mvule is a hardwood.', 2],
    ['Which step is the mistake?', 'Step 1: Plywood has layers.', 'Step 2: The layers are glued.', 'Step 3: So plywood is one solid plank.', 'Plywood is made of glued layers.', 2],
    ['Which step is the mistake?', 'Step 1: Softwoods grow faster.', 'Step 2: So they are cheaper.', 'Step 3: So softwoods are always harder.', 'Hardwoods are usually harder.', 2],
    ['Which step is the mistake?', 'Step 1: Furniture needs strong wood.', 'Step 2: Hardwoods are strong.', 'Step 3: So furniture uses only sponge.', 'Furniture uses hardwood or boards.', 2],
  ], ['a', 'c']),
  ...S('wp', WD, 'WOOD_PREP', ['WP_SEASON', 'WP_ORDER', 'WP_TREAT'], ['Sawing, seasoning, planing, then treating.', 'Seasoning dries timber so it does not warp.'], [
    ['Why is timber seasoned?', 'To dry it so it does not warp', 'To make it wet again each day', 'To make it heavy for carrying', 'To make it bend like rubber'],
    ['Which comes first in preparing wood?', 'Sawing the log into planks', 'Varnishing the finished table', 'Selling the finished table', 'Polishing the finished table'],
    ['Why is wood treated with a preservative?', 'To protect it from rot and insects', 'To make it rot more slowly only', 'To make it soft and spongy', 'To make it bend like a reed'],
    ['What does planing do?', 'Makes the wood smooth', 'Dries the wood', 'Cuts the log', 'Treats the wood'],
    ['What can happen to wood that is not seasoned?', 'It can warp and crack', 'It will last for ever', 'It becomes metal', 'It shines'],
  ], [
    ['A carpenter stacks planks in a shed to dry them for months. What is this?', 'Seasoning', 'Planing', 'Sawing', 'Varnishing'],
    ['A log is cut into planks with a saw. What is this stage?', 'Conversion by sawing', 'Seasoning', 'Varnishing', 'Selling'],
    ['A carpenter paints a preservative on fence posts. Why?', 'To protect them from rot and insects', 'To make them rot in the soil', 'To make them soft and weak', 'To make them very heavy'],
    ['A carpenter smooths a rough board with a plane. What does this do?', 'Makes the surface smooth', 'Dries the wood', 'Cuts the log', 'Treats the wood'],
    ['A table made from green wood twists after a month. What was missed?', 'Seasoning', 'Painting', 'Selling', 'Counting'],
  ], [
    ['Which step is the mistake?', 'Step 1: Fresh timber contains water.', 'Step 2: Seasoning dries it.', 'Step 3: So seasoning makes it wet.', 'Seasoning dries timber.', 2],
    ['Which step is the mistake?', 'Step 1: Logs are large.', 'Step 2: They must be cut first.', 'Step 3: So varnishing comes first.', 'Sawing comes first.', 2],
    ['Which step is the mistake?', 'Step 1: Insects eat wood.', 'Step 2: Preservatives protect it.', 'Step 3: So preservatives make wood rot.', 'Preservatives protect wood.', 2],
    ['Which step is the mistake?', 'Step 1: Planing smooths wood.', 'Step 2: It follows seasoning.', 'Step 3: So planing dries the wood.', 'Seasoning dries the wood.', 2],
    ['Which step is the mistake?', 'Step 1: Warped wood is hard to use.', 'Step 2: Seasoning reduces warping.', 'Step 3: So seasoning is not needed.', 'Seasoning is needed.', 2],
  ], ['b', 'b']),
  ...S('ws', WS, 'WASTE', ['WS_BURN', 'WS_ORGANIC', 'WS_SHARP'], ['Sort waste, reduce, reuse and recycle; never burn plastic.', 'Organic waste makes compost.'], [
    ['What should be done with plastic waste?', 'Sort and recycle it', 'Burn it', 'Bury it near a river', 'Throw it in the road'],
    ['What can be done with kitchen peelings?', 'Make compost', 'Burn them in the house', 'Throw them in a river', 'Hide them in the school'],
    ['How should broken glass be handled?', 'Wrapped and disposed of safely', 'Left on the path', 'Thrown in a river', 'Put in a pocket'],
    ['Which is organic waste?', 'Vegetable peelings', 'Plastic bottles', 'Tins', 'Glass'],
    ['What does recycling do?', 'Turns waste into new items', 'Makes more waste', 'Burns waste', 'Hides waste'],
  ], [
    ['A school sorts bottles, paper and peelings into three bins. What is this?', 'Sorting waste', 'Wasting time', 'Making noise', 'Polluting the school'],
    ['A family burns plastic in the compound. What is wrong?', 'It gives off harmful smoke', 'It makes compost', 'It saves money', 'Nothing is wrong'],
    ['A farmer puts peelings and leaves in a pit to rot. What does this make?', 'Compost for the garden', 'Plastic', 'Glass', 'Metal'],
    ['A learner sees a broken bottle on the path. What should she do?', 'Tell a teacher so it is cleared safely', 'Kick it away', 'Pick it up barehanded', 'Leave it for others'],
    ['A shop reuses crates instead of throwing them away. What is this?', 'Reuse', 'Dumping', 'Burning', 'Littering'],
  ], [
    ['Which step is the mistake?', 'Step 1: Plastic does not rot.', 'Step 2: Recycling gives it a new use.', 'Step 3: So burning plastic is the best way.', 'Do not burn plastic.', 2],
    ['Which step is the mistake?', 'Step 1: Peelings rot.', 'Step 2: They make compost.', 'Step 3: So we burn them.', 'We make compost.', 2],
    ['Which step is the mistake?', 'Step 1: Broken glass is sharp.', 'Step 2: It can cut people.', 'Step 3: So we leave it on the path.', 'We dispose of it safely.', 2],
    ['Which step is the mistake?', 'Step 1: Waste has types.', 'Step 2: Sorting helps recycling.', 'Step 3: So we mix all waste together.', 'We sort waste.', 2],
    ['Which step is the mistake?', 'Step 1: Reducing waste helps.', 'Step 2: Reusing helps too.', 'Step 3: So we should buy and throw away more.', 'We should reduce and reuse.', 2],
  ], ['b', 'c', 'a']),
];
