// ============================================================================
// AGRICULTURE GRADE 9, CONSERVATION AND FOOD PRODUCTION (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the first 13 of the 23 skills
// mapped on 18 Nov (conserving forage and hay, leftover food, integrated farming, organic gardening, storing crop produce,
// flour mixtures). Written offline from the KICD design through the curriculum map. The app asks the method, the order and the
// reason; making hay, cooking, building a model or a store is marked by the teacher with the KICD rubric. Hot oil and the knife
// are an adult's. Every wrong answer names the library misconception it reveals. All stay reviewed:false.
// ============================================================================
import { T } from './agriculture_g9_lib.js';

const M = (...s) => s.map(x => `M_AG9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('hm', 'CONSER.CONSERVING_ANIMAL_FEED_H.HAY_METHODS', M('HM_RAINY', 'HM_STANDING', 'HM_STOVER', 'HM_LOSS'),
    ['Think about when grass is plentiful and what animals will eat when it is gone.', 'Forage is conserved in the rainy season as hay, standing forage or stored crop residues, so animals stay strong at home through a drought.'], [
      ['When is forage conserved for a drought?', 'In the rainy season', 'During the drought|0', 'Only once animals are thin|0', 'Never; animals can be moved|3'],
      ['What is standing forage?', 'Grass left uncut to graze later', 'Grass cut and stood in heaps|1', 'Maize stover that is burnt|2', 'Grass cut in the drought|0'],
      ['What is done with maize stover after harvest?', 'Store it dry as feed', 'Burn it to clear the shamba|2', 'Leave it in heaps to rot|2', 'Stand it up in the field as hay|1'],
      ['Why conserve feed instead of moving herds in a drought?', 'Moving is far, costly and risky', 'Moving is always better|3', 'Feed can only be made in drought|0', 'Stover is only for burning|2'],
      ['Which is a method of conserving forage?', 'Haymaking', 'Burning crop residues|2', 'Waiting until the drought|0', 'Walking the herd far away|3'],
    ], [
      ['In April the grass on Kiplagat\'s farm is tall and green. In August it will be dry. When should he make hay?', 'Now, while grass is plenty', 'In August, in the dry spell|0', 'Never, he can move the cows|3', 'After burning the stover|2'],
      ['Nasieku fences off a paddock and leaves its grass uncut until the dry season. What is this called?', 'Standing forage', 'Cut grass in heaps|1', 'Burning the paddock|2', 'Moving the herd|3'],
      ['After harvest, Wafula plans to burn his maize stalks. What would help his cows in the dry season more?', 'Store the stover as feed', 'Burn them as planned|2', 'Cut grass in the drought|0', 'Walk the cows to Uganda|3'],
      ['In a drought, Lekishon walks his cattle 60 km for grass and loses three. What could he have done?', 'Stored hay and stover earlier', 'Walked them even further|3', 'Waited for the drought to cut grass|0', 'Burnt the remaining grass|2'],
      ['A school dairy unit wants feed for January, the driest month. Which plan is best?', 'Make hay in the long rains', 'Cut grass in January|0', 'Burn the stalks in December|2', 'Stand cut grass in heaps|1'],
    ], [
      ['Kamau explains conserving feed. ' + STEP, 'Droughts leave little grass.', 'Animals need feed all year.', 'So feed is best conserved during the drought.', 'Conserve it in the rainy season, when grass is plentiful.', 0],
      ['Achieng explains standing forage. ' + STEP, 'It is a way of conserving feed.', 'It is used in the dry season.', 'It means grass cut and stood in heaps.', 'It is grass left uncut in a fenced paddock.', 1],
      ['Otieno explains crop residues. ' + STEP, 'After harvest maize stalks are left.', 'Animals can eat them.', 'So he burns them to clear the shamba.', 'Store stover dry as animal feed.', 2],
      ['Mumbi explains drought plans. ' + STEP, 'Her family keeps goats.', 'Droughts come every few years.', 'They need not store feed; they can always move.', 'Moving is far and risky; stored feed keeps animals strong.', 3],
      ['Juma explains hay. ' + STEP, 'Hay is dried grass.', 'It is fed in the dry season.', 'It is best made once the drought has started.', 'Make hay in the rainy season, when grass is plentiful.', 0],
    ]),

  ...T('hk', 'CONSER.CONSERVING_ANIMAL_FEED_H.HAYMAKING', M('HK_LATE', 'HK_OPEN', 'HK_WET', 'HK_GROUND'),
    ['Think about when grass is most nutritious and what makes stored hay go bad.', 'Cut grass at flowering, dry it until dry but still green, bale or stack it on a raised base with a sloping top, and store it covered and off the ground.'], [
      ['When is grass cut for hay?', 'At flowering, still green', 'When old, dry and brown|0', 'After it has seeded and died|0', 'While it is wet with rain|2'],
      ['Where are hay bales kept?', 'Under cover, off the ground', 'Out in the field|1', 'On wet ground in the open|1', 'In a flat heap on the soil|3'],
      ['Why is grass not baled while still wet?', 'It goes mouldy and heats up', 'It keeps better wet|2', 'It is too green to bale|0', 'Wet bales are easier to store outside|1'],
      ['How is a haystack built?', 'On a raised base, sloping top', 'On the ground, flat top|3', 'In the open with no cover|1', 'From old brown grass|0'],
      ['How do you know hay is ready to bale?', 'Dry but still green', 'Still wet and heavy|2', 'Brown and brittle|0', 'Left out in the rain|1'],
    ], [
      ['Wanjiru cuts her napier for hay when it is brown and dry. Her cows hardly eat it. Why?', 'It was cut too late', 'It was cut too early|0', 'It was baled dry|2', 'It was stored under a roof|1'],
      ['Kibet leaves his bales in the field. After the rains they are black and smelly. What should he have done?', 'Stored them under cover', 'Left them out longer|1', 'Baled them wetter|2', 'Stacked them flat on soil|3'],
      ['Mwende bales grass the day it is cut, still wet. A week later the bales are hot inside. Why?', 'Wet hay heats and moulds', 'Wet hay keeps better|2', 'It was cut at flowering|0', 'It was off the ground|3'],
      ['Ali stacks hay on bare ground with a flat top. The bottom and top rot. What is better?', 'A raised base and sloping top', 'A bigger flat stack|3', 'Leaving it uncovered|1', 'Wetter grass|2'],
      ['A school cuts Rhodes grass at flowering and turns it in the sun for two days. What comes next?', 'Bale it and store it dry', 'Leave the bales outside|1', 'Wait until it turns brown|0', 'Stack it flat on the soil|3'],
    ], [
      ['Faith explains cutting grass for hay. ' + STEP, 'She chose a good grass.', 'She planned to dry it in the sun.', 'She cut it when it was old, dry and brown.', 'Cut it at flowering, still green and leafy.', 0],
      ['Brian explains storing bales. ' + STEP, 'He baled the dry hay.', 'He counted the bales.', 'He left them in the field until needed.', 'Store them under a roof, off the ground.', 1],
      ['Nekesa explains drying. ' + STEP, 'She cut the grass at flowering.', 'She spread it in the sun.', 'She baled it at once while still wet.', 'Dry and turn it until dry but still green, then bale.', 2],
      ['Kioko explains a haystack. ' + STEP, 'He collected the dry hay.', 'He chose a dry place.', 'He stacked it on the bare ground with a flat top.', 'Stack it on a raised base with a sloping, covered top.', 3],
      ['Halima explains feeding hay. ' + STEP, 'She made hay in the long rains.', 'She stored it dry.', 'She keeps it in the open so the cows can reach it.', 'Keep it covered and off the ground until fed.', 1],
    ]),

  ...T('lw', 'CONSER.CONSERVING_LEFTOVER_FOOD.LEFTOVER_WHY', M('LW_OPEN', 'LW_SMELL', 'LW_WASTE', 'LW_DAYS'),
    ['Think about money, waste and germs.', 'Conserving leftovers saves food and money; they must be cooled quickly, covered, kept cool and used by the next day, because germs grow without changing the smell.'], [
      ['Why should leftover food be conserved?', 'It saves food and money', 'There is no reason|2', 'Leftovers are rubbish|2', 'So it can be kept a week|3'],
      ['How is leftover food kept safe?', 'Cooled, covered, kept cool', 'Left uncovered in the warm pot|0', 'Kept for a week anywhere|3', 'Thrown out at once|2'],
      ['Is food that smells fine always safe?', 'No, germs may not smell', 'Yes, it smells fine|1', 'Yes, if it is a week old|3', 'Yes, if it was left open|0'],
      ['Without a fridge, how long can leftovers be kept?', 'Until the next day', 'A week|3', 'Until they smell bad|1', 'As long as the pot is warm|0'],
      ['What can unsafe leftovers cause?', 'Food poisoning', 'Nothing, if they smell fine|1', 'Nothing; they are just waste|2', 'Nothing in a warm pot|0'],
    ], [
      ['After supper Mama Njeri leaves the githeri in the warm sufuria, uncovered, overnight. What is the risk?', 'Germs grow in it', 'None, warm is safe|0', 'It smells fine, so none|1', 'It will keep a week|3'],
      ['Odera says the stew from three days ago is fine because it smells fine. What is true?', 'It may still carry germs', 'Smell shows it is safe|1', 'Old stew is rubbish|2', 'It is safe for a week|3'],
      ['Wanjiku throws away the rice left after every meal. What does her family lose?', 'Food and money', 'Nothing, leftovers are rubbish|2', 'Nothing, they smell|1', 'Only the pot|0'],
      ['Mutua keeps leftover beans in a cupboard for a week. What should he do?', 'Use them by the next day', 'Keep them a week more|3', 'Leave them in the warm pot|0', 'Sniff them first, then eat|1'],
      ['A school has leftover ugali and beans after lunch. Which plan is best?', 'Cool, cover and use tomorrow', 'Leave it in the warm pot|0', 'Throw it all away|2', 'Keep it for the next week|3'],
    ], [
      ['Atieno explains keeping leftovers. ' + STEP, 'She saves leftovers to avoid waste.', 'She wants them to stay safe.', 'She leaves them in the warm pot, uncovered.', 'Cool them quickly, cover them and keep them cool.', 0],
      ['Kevin explains safety. ' + STEP, 'Germs grow in food left too long.', 'Some germs cause food poisoning.', 'If the food smells fine, it is always safe.', 'Germs may grow without changing the smell.', 1],
      ['Rose explains why conserve leftovers. ' + STEP, 'Food costs money.', 'Waste fills the bin.', 'There is no reason to keep leftovers.', 'Keeping them saves food and money and cuts waste.', 2],
      ['Peter explains storing without a fridge. ' + STEP, 'He cools the food fast.', 'He covers it.', 'He keeps it for a week in the cupboard.', 'Use it by the next meal or next day.', 3],
      ['Lilian explains food poisoning. ' + STEP, 'Leftovers can grow germs.', 'Covering and cooling slow them down.', 'Uncovered food in a warm pot is the safest.', 'Warm, uncovered food grows germs fastest.', 0],
    ]),

  ...T('lp', 'CONSER.CONSERVING_LEFTOVER_FOOD.LEFTOVER_PREP', M('LP_WARM', 'LP_MIXOLD', 'LP_TWICE', 'LP_RECIPE'),
    ['Think about heat that kills germs, and dishes that use leftovers well.', 'Reheat leftovers once until steaming hot all through, keep them apart from fresh food, or make a new dish such as fried rice or mukimo.'], [
      ['How hot should leftover food be when reheated?', 'Steaming hot all through', 'Just warm|0', 'Lukewarm in the middle|0', 'Reheated many times|2'],
      ['How many times can leftovers be reheated?', 'Once only', 'As many times as needed|2', 'Twice a day for a week|2', 'Until they are just warm|0'],
      ['Should old leftovers be mixed into freshly cooked food?', 'No, keep them apart', 'Yes, it saves food|1', 'Yes, then reheat many times|2', 'Yes, warm them a little|0'],
      ['Which new dish can be made from leftover rice?', 'Fried rice', 'None, only reheating|3', 'Rice mixed into fresh stew|1', 'Rice warmed a little|0'],
      ['What is done with leftovers already reheated once?', 'Throw them away', 'Reheat them again|2', 'Mix them into new food|1', 'Warm them gently|0'],
    ], [
      ['Wangari warms yesterday\'s stew until just warm and serves it. What is the risk?', 'Germs may still be alive', 'None, warm is enough|0', 'None, reheat again later|2', 'None, mix it with fresh|1'],
      ['Kiprop adds yesterday\'s leftover beans to the fresh pot of beans to use them up. What is better?', 'Keep them apart; use them first', 'Mix them in, it saves food|1', 'Reheat both many times|2', 'Just warm them|0'],
      ['Shiru reheats the same pilau for lunch, then supper, then breakfast. What is wrong?', 'Reheat once only', 'Nothing, any number is fine|2', 'It should only be warm|0', 'She should add it to fresh food|1'],
      ['There is leftover ugali after supper. Grace says it can only be reheated. What else can she make?', 'Fried ugali', 'Nothing, only reheating|3', 'Ugali mixed in fresh food|1', 'Ugali warmed many times|2'],
      ['Leftover mashed potatoes and peas are in the fridge. Which plan is best?', 'Make mukimo, steaming hot', 'Warm them a little|0', 'Reheat them three times|2', 'Stir them into fresh food|1'],
    ], [
      ['Omondi explains reheating. ' + STEP, 'He checked the food smelt and looked fine.', 'He put it in a pan.', 'He warmed it until just warm and served it.', 'Reheat until steaming hot all the way through.', 0],
      ['Esther explains using leftovers. ' + STEP, 'She had leftover chicken stew.', 'She was cooking fresh stew.', 'She mixed the old stew into the fresh to use it up.', 'Keep them apart and use the leftovers first.', 1],
      ['Musa explains reheating rules. ' + STEP, 'Reheat until steaming hot.', 'Serve at once.', 'The same food can be reheated again and again.', 'Reheat leftovers once only.', 2],
      ['Mueni explains new dishes. ' + STEP, 'She had leftover rice.', 'She did not want to waste it.', 'Leftovers can only be reheated, not changed.', 'Make a new dish, such as fried rice.', 3],
      ['Daudi explains serving. ' + STEP, 'He made soup from leftover vegetables.', 'He heated it until steaming hot.', 'He kept the rest to reheat again tomorrow.', 'Food reheated once is not reheated again.', 2],
    ]),

  ...T('ip', 'CONSER.INTEGRATED_FARMING.INTEGRATED_PARTS', M('IP_MIXED', 'IP_DUNG', 'IP_POND', 'IP_LAND'),
    ['Ask what each part gives the others.', 'In integrated farming the parts feed each other: droppings feed fish or manure crops, pond water waters vegetables, crop waste feeds animals, so a small plot gives more.'], [
      ['What makes a farm integrated?', 'Each part\'s waste feeds another', 'Many parts, each on its own|0', 'Only one crop on a big farm|3', 'Droppings thrown away|1'],
      ['How are rabbit droppings used on an integrated farm?', 'To feed fish or manure crops', 'They are waste|1', 'Thrown into the river|1', 'Kept apart from all parts|0'],
      ['How can fish pond water be used?', 'To water the vegetables', 'It cannot be used|2', 'Thrown away as dirty|2', 'Only for washing animals|0'],
      ['Does integrated farming need more land than one enterprise?', 'No, parts share space', 'Yes, it needs more land|3', 'Yes, each part needs its own farm|0', 'Only if dung is wasted|1'],
      ['Which is a component of integrated farming?', 'A fish pond', 'A rubbish pit for droppings|1', 'A separate farm for each animal|0', 'Unused pond water|2'],
    ], [
      ['Atieno keeps chickens, fish and kale on one plot, but none of them is linked. Is it integrated?', 'No, the parts must feed each other', 'Yes, it has many parts|0', 'Yes, because it needs more land|3', 'Yes, if dung is thrown out|1'],
      ['Wekesa throws his rabbit droppings on the rubbish heap. How could he use them?', 'To feed fish or manure kale', 'They are only waste|1', 'Pour them in the river|1', 'Keep them away from all parts|0'],
      ['Nanjala empties her fish pond into a ditch. What could she do with the water?', 'Water her vegetables', 'Nothing, it is useless|2', 'Throw it on the road|2', 'Use it only for fish|0'],
      ['Moses has only a quarter acre. He thinks integrated farming needs more land. What is true?', 'The parts share space and inputs', 'He needs ten acres|3', 'He must buy a farm for each|0', 'He must waste the dung|1'],
      ['A school has a poultry house, a pond and a garden. Which link makes the farm integrated?', 'Poultry droppings into the pond', 'Each part fenced off alone|0', 'Pond water poured away|2', 'Droppings burnt in a pit|1'],
    ], [
      ['Kendi explains integrated farming. ' + STEP, 'Her farm has fish, rabbits and vegetables.', 'They are on one plot.', 'Each part is kept on its own with no links.', 'The parts feed each other; one part\'s waste is another\'s input.', 0],
      ['Barasa explains droppings. ' + STEP, 'His goats make a lot of droppings.', 'His vegetables need manure.', 'He throws the droppings away as waste.', 'Use them to manure the vegetables or feed the pond.', 1],
      ['Wairimu explains the pond. ' + STEP, 'Her fish pond water is rich in nutrients.', 'Her kale needs water.', 'Pond water is useless for crops.', 'Pond water is rich in nutrients and waters the vegetables.', 2],
      ['Ouma explains land. ' + STEP, 'His plot is small.', 'He wants more food from it.', 'Integrated farming needs more land, so he cannot.', 'The parts share space and inputs; a small plot gives more.', 3],
      ['Joy explains crop waste. ' + STEP, 'Her kale leaves feed her rabbits.', 'Rabbit droppings manure her kale.', 'Her fish pond is kept apart and linked to nothing.', 'Link the pond too: droppings feed fish, pond water waters crops.', 0],
    ]),

  ...T('im', 'CONSER.INTEGRATED_FARMING.INTEGRATED_MODEL', M('IM_ARROW', 'IM_LABEL', 'IM_PLACE', 'IM_SKETCH'),
    ['Plan first, then place each part where it can feed the next and show the links.', 'Sketch the plot first, place each part beside what it feeds (hutch over the pond, compost near the garden), draw arrows from giver to receiver, and label everything.'], [
      ['Which way does the arrow go between a rabbit hutch and a fish pond?', 'From the hutch to the pond', 'From the pond to the hutch|0', 'No arrow is needed|1', 'Both ways at random|0'],
      ['Why does a model of integrated farming need labels?', 'So others see each part and link', 'It is not needed|1', 'To hide the links|1', 'Arrows are enough alone|0'],
      ['Where is the compost pit placed in the model?', 'Near the garden and animal houses', 'Far from the garden|2', 'Inside the fish pond|2', 'Anywhere, at random|3'],
      ['What is done before building the model?', 'Sketch the plot and plan', 'Start building at once|3', 'Label nothing|1', 'Draw arrows backwards|0'],
      ['Where is a rabbit hutch best placed in the model?', 'Over the fish pond', 'Far from every other part|2', 'Anywhere, no plan|3', 'Under the compost pit|2'],
    ], [
      ['Kibet\'s model has an arrow from the fish pond to the rabbit hutch. What should it show?', 'Droppings go from hutch to pond', 'It is right as drawn|0', 'Arrows are not needed|1', 'The pond feeds the hutch|0'],
      ['Mary\'s model has no labels or key. Visitors cannot tell the parts apart. What should she add?', 'Labels and a key', 'Nothing, models need no labels|1', 'More arrows backwards|0', 'A compost pit far away|2'],
      ['In Odhiambo\'s model the compost pit is at the far corner, away from the garden. What is better?', 'Next to the garden', 'Even further away|2', 'Inside the pond|2', 'With no plan at all|3'],
      ['Wambui glues her model together without a sketch. The pond does not fit. What did she skip?', 'A sketch and plan of the plot', 'The labels only|1', 'Backwards arrows|0', 'A far-off compost pit|2'],
      ['A group is making a model for the science fair. Which order is right?', 'Sketch, place, arrows, label', 'Build first, sketch later|3', 'Arrows from pond to hutch|0', 'No labels needed|1'],
    ], [
      ['Hassan explains his model. ' + STEP, 'He sketched the plot first.', 'He put the hutch over the pond.', 'He drew the arrow from the pond to the hutch.', 'Droppings go from the hutch to the pond: draw it that way.', 0],
      ['Grace explains finishing her model. ' + STEP, 'She placed each part.', 'She drew the arrows.', 'She left out labels as they are not needed.', 'Label each part so others can see the links.', 1],
      ['Kiprono explains placing parts. ' + STEP, 'Compost feeds the garden.', 'Animal houses give waste for compost.', 'So he put the compost pit far from the garden.', 'Put it near the garden and the animal houses.', 2],
      ['Zawadi explains starting. ' + STEP, 'She collected boxes and clay.', 'She chose the parts.', 'She started building at once with no sketch.', 'Sketch the plot and plan where each part goes.', 3],
      ['Peter explains links. ' + STEP, 'Pond water goes to the crops.', 'Crop waste goes to the rabbits.', 'Rabbit droppings come from the pond.', 'Droppings go from the hutch to the pond or garden.', 0],
    ]),

  ...T('op', 'FOOD_P.ORGANIC_GARDENING.ORGANIC_PRACTICES', M('OP_NOTHING', 'OP_YIELD', 'OP_HEALTH', 'OP_ROTATE'),
    ['Organic does not mean no care; it means natural inputs.', 'Organic gardening uses compost, manure, organic sprays, foliar feeds, mulch, hand weeding and crop rotation instead of synthetic chemicals, and gives good yields with care.'], [
      ['What is organic gardening?', 'Growing with natural inputs', 'Growing with no inputs or care|0', 'Using synthetic fertiliser only|2', 'Never rotating crops|3'],
      ['Can organic crops grow well?', 'Yes, with good compost and care', 'No, never|1', 'Only with synthetic sprays|2', 'Only if left alone|0'],
      ['How is organic food better for health?', 'No harmful chemical residues', 'There is no difference|2', 'It is grown with no care|0', 'It is never rotated|3'],
      ['How does crop rotation help an organic garden?', 'It breaks pest and disease cycles', 'It is not used|3', 'It means doing nothing|0', 'It needs chemicals|2'],
      ['Which is an organic practice?', 'Mulching', 'Synthetic pesticide spraying|2', 'Leaving pests alone|0', 'Growing one crop for ever|3'],
    ], [
      ['Atieno says she gardens organically because she uses no manure and no pest control. What has she misunderstood?', 'Organic uses natural inputs and care', 'Nothing, she is right|0', 'Organic needs chemicals|2', 'Organic cannot yield well|1'],
      ['Wekesa says organic kale will never grow well. Juma\'s organic kale is lush. What made the difference?', 'Compost, foliar feeds and care', 'Luck only|1', 'Synthetic fertiliser|2', 'Doing nothing|0'],
      ['A buyer asks why organic tomatoes cost more. Which reason is true?', 'No harmful chemical residues', 'There is no difference|2', 'They were grown with no care|0', 'They were never rotated|3'],
      ['Moraa grows kale in the same bed every season organically. Pests build up. Which organic practice would help?', 'Crop rotation', 'Doing nothing|0', 'Synthetic sprays|2', 'Accepting low yields|1'],
      ['A school wants an organic garden. Which plan fits?', 'Compost, mulch and organic sprays', 'No inputs and no weeding|0', 'Chemical fertiliser and spray|2', 'One crop for ever|3'],
    ], [
      ['Kioko explains organic gardening. ' + STEP, 'It avoids synthetic chemicals.', 'It aims for healthy food.', 'It means doing nothing: no manure and no pest control.', 'It uses natural inputs such as compost and organic sprays.', 0],
      ['Halima explains yields. ' + STEP, 'Organic gardens use compost.', 'They use foliar feeds.', 'But organic crops cannot grow well at all.', 'With good compost and care, organic crops grow well.', 1],
      ['Ali explains health. ' + STEP, 'Synthetic chemicals can leave residues.', 'Organic gardening avoids them.', 'So there is no difference for health or the soil.', 'Organic food has no harmful residues; soil and water stay healthy.', 2],
      ['Nduta explains organic practices. ' + STEP, 'She uses compost.', 'She weeds by hand.', 'Crop rotation is not part of organic gardening.', 'Rotation breaks pest and disease cycles without chemicals.', 3],
      ['Brian explains mulching. ' + STEP, 'Mulch keeps moisture in.', 'It adds organic matter.', 'An organic garden needs no inputs at all.', 'It uses natural inputs such as mulch and compost.', 0],
    ]),

  ...T('oi', 'FOOD_P.ORGANIC_GARDENING.ORGANIC_INPUTS', M('OI_STRONG', 'OI_SOAK', 'OI_NOON', 'OI_FRESHMANURE'),
    ['Think about strength, time and the hour of the day.', 'Soak Mexican sunflower or manure for about two weeks, dilute the foliar feed, spray organic pesticides early morning or evening, and use well-rotted manure.'], [
      ['How is a foliar feed used?', 'Diluted with water', 'Poured on undiluted|0', 'Sprayed at midday|2', 'Used the day after soaking|1'],
      ['How long is Mexican sunflower soaked for a foliar feed?', 'About two weeks', 'One day|1', 'One hour|1', 'Until noon|2'],
      ['When are organic pesticides sprayed?', 'Early morning or evening', 'At midday|2', 'In the hottest sun|2', 'Only undiluted|0'],
      ['Which manure is put on crops?', 'Well-rotted manure', 'Fresh manure from the shed|3', 'Undiluted foliar feed|0', 'Manure soaked one day|1'],
      ['Which is an organic pesticide?', 'Chilli and garlic spray', 'Fresh manure on leaves|3', 'Undiluted foliar feed|0', 'A spray used at noon|2'],
    ], [
      ['Achieng pours her foliar feed straight onto her spinach without water. The leaves scorch. What did she miss?', 'Diluting it', 'Soaking it one day only|1', 'Spraying at midday|2', 'Adding fresh manure|3'],
      ['Kimani soaks Mexican sunflower leaves and uses the liquid the next day. It is weak. What should he do?', 'Soak it about two weeks', 'Use it at once|1', 'Spray it at noon|2', 'Add it undiluted|0'],
      ['Lucy sprays her neem mixture at 1 pm in hot sun. It works poorly. When is better?', 'Early morning or evening', 'At midday again|2', 'Undiluted at noon|0', 'Right after soaking a day|1'],
      ['Omar spreads fresh cow dung straight from the shed onto his young kale. Some plants burn. What is better?', 'Well-rotted manure or compost', 'More fresh dung|3', 'Undiluted foliar feed|0', 'Spraying at noon|2'],
      ['A school wants to feed its tomatoes organically. Which plan is right?', 'Rotted compost and a diluted feed', 'Fresh dung and undiluted feed|3', 'A one-day soak, used neat|1', 'Spraying at midday|2'],
    ], [
      ['Wairimu explains her foliar feed. ' + STEP, 'She chopped Mexican sunflower.', 'She soaked it in water for two weeks.', 'She poured it on the crop without diluting it.', 'Dilute it with water before spraying or watering.', 0],
      ['Kibet explains soaking. ' + STEP, 'He put manure in a sack.', 'He hung it in a drum of water.', 'He used the liquid the next day.', 'Soak it about two weeks, stirring now and then.', 1],
      ['Rehema explains spraying. ' + STEP, 'She made a chilli and garlic spray.', 'She strained it.', 'She sprayed it at midday in the hot sun.', 'Spray in the early morning or evening.', 2],
      ['Musa explains manuring. ' + STEP, 'He collected manure from the cow shed.', 'He wanted to feed his crops.', 'He put the fresh manure straight on the crops.', 'Use well-rotted manure or compost.', 3],
      ['Esther explains weed control. ' + STEP, 'She pulls weeds by hand.', 'She uses a jembe between rows.', 'She sprays her organic pesticide undiluted at noon.', 'Dilute sprays and use them early morning or evening.', 2],
    ]),

  ...T('sp', 'FOOD_P.STORAGE_OF_CROP_PRODUCE.STORE_PREP', M('SP_CRACKS', 'SP_ROOF', 'SP_RAT', 'SP_BAGS'),
    ['Think about every way pests, rats and water can get in.', 'Empty and clean the store, seal cracks, repair leaks, fit rat guards, and clean and check old sacks before new produce goes in.'], [
      ['Why are cracks in a store sealed?', 'Pests hide and breed in them', 'Small cracks do not matter|0', 'For air only|0', 'Cats use them|2'],
      ['When is a leaking store roof repaired?', 'Before storing', 'Store first and fix later|1', 'After the rains end|1', 'Never, a cat guards it|2'],
      ['Why are rat guards fitted to a granary?', 'So rats cannot climb in', 'A cat is enough|2', 'Cracks keep rats out|0', 'To hold old sacks|3'],
      ['What is done with last year\'s sacks?', 'Clean, dry and check them', 'Use them as they are|3', 'Fill them at once|3', 'Leave them in the cracks|0'],
      ['Which comes first in preparing a store?', 'Empty and clean it', 'Fill it with new produce|1', 'Leave old grain inside|3', 'Rely on a cat|2'],
    ], [
      ['Wanjala sees small cracks in his granary walls and says they do not matter. What can happen?', 'Weevils hide and breed there', 'Nothing, they are small|0', 'The cat stops them|2', 'The sacks seal them|3'],
      ['Mama Kerubo stores her beans first, planning to fix the roof leak later. What happens in the rain?', 'The beans get wet and rot', 'Nothing, store first|1', 'Rats leave the store|2', 'The cracks close|0'],
      ['Tom says his cat keeps rats away, so no rat guards are needed. What is true?', 'Guards stop rats climbing in', 'The cat is enough|2', 'Cracks keep rats out|0', 'Old sacks keep rats out|3'],
      ['Faith fills last year\'s sacks with new maize without shaking them out. Weevils appear. Why?', 'The sacks carried old pests', 'New maize brings weevils|3', 'The roof was fixed|1', 'The cracks were sealed|0'],
      ['A school prepares its store for maize. Which order is right?', 'Clean, seal, repair, then store', 'Store, then repair|1', 'Leave cracks for air|0', 'Use the cat instead of guards|2'],
    ], [
      ['Kariuki explains preparing his store. ' + STEP, 'He emptied last season\'s maize.', 'He swept and dusted.', 'He left the small cracks because they do not matter.', 'Seal cracks; weevils hide and breed in them.', 0],
      ['Akinyi explains the roof. ' + STEP, 'She cleaned the store.', 'She sealed the cracks.', 'She stored the beans and will fix the leak later.', 'Repair leaks before storing.', 1],
      ['Otieno explains rats. ' + STEP, 'Rats eat stored grain.', 'They climb the granary legs.', 'His cat is enough, so he fitted no guards.', 'Fit rat guards so rats cannot climb in.', 2],
      ['Mumbi explains sacks. ' + STEP, 'She keeps last year\'s sacks.', 'She wants to save money.', 'She uses them as they are.', 'Shake out, clean, dry and check them for holes and pests.', 3],
      ['Juma explains pallets. ' + STEP, 'He put pallets on the floor.', 'Sacks will sit on them, off the ground.', 'He then stored before the floor had dried.', 'Let the store dry and air before storing.', 1],
    ], ['a', 'b', 'b']),

  ...T('sm', 'FOOD_P.STORAGE_OF_CROP_PRODUCE.STORE_MANAGE', M('SM_FORGET', 'SM_HEAT', 'SM_SPOILT', 'SM_AIR'),
    ['Stored produce is checked, aired and cleaned out, not forgotten.', 'Check stored produce every week or two for moisture, pests, mould and heat, keep air moving, and remove spoilt produce at once.'], [
      ['How often is stored grain checked?', 'Every week or two', 'Never, once stored|0', 'Only at the end of the year|0', 'Only if it smells|1'],
      ['A patch of stored maize feels warm. What does it mean?', 'Damp or pests are spoiling it', 'It is normal|1', 'It is drying well|1', 'It needs more air sealed out|3'],
      ['What is done with spoilt produce in a store?', 'Remove it and dispose of it', 'Leave it with the rest|2', 'Mix it in to save it|2', 'Close the store tight|3'],
      ['Why is air kept moving in a store?', 'It keeps produce dry and cool', 'Closed is better|3', 'It is not needed|0', 'Warm grain is normal|1'],
      ['How can a farmer test if beans are dry enough to store?', 'The bite test', 'Never test them|0', 'Feel if they are warm|1', 'Close the store and see|3'],
    ], [
      ['Kiplagat stores his maize in May and does not look again until December. Half is eaten by weevils. What should he have done?', 'Checked it every week or two', 'Nothing, store and forget|0', 'Closed it tighter|3', 'Left spoilt grain in|2'],
      ['Nyambura puts her hand in a sack of beans and it feels warm inside. What should she do?', 'Dry it and check for pests', 'Nothing, it is normal|1', 'Seal the store tight|3', 'Leave it with the rest|2'],
      ['Wafula finds a mouldy sack among his good ones. He leaves it to avoid waste. What can happen?', 'The mould spreads to the rest', 'Nothing, it saves food|2', 'The mould dries away|1', 'Weevils leave|0'],
      ['Chebet blocks every window in her store to keep it safe. The grain becomes damp. Why?', 'No air moved to keep it dry', 'Closed is always better|3', 'Damp grain is normal|1', 'She checked it too often|0'],
      ['A school stores 20 bags of maize. Which plan is right?', 'Check often, air it, remove spoilt', 'Store and never check|0', 'Seal out all air|3', 'Keep spoilt bags in|2'],
    ], [
      ['Mwangi explains his store. ' + STEP, 'He dried the maize well.', 'He stored it in clean bags.', 'Once stored, it needs no more checking.', 'Check it every week or two.', 0],
      ['Esther explains warm grain. ' + STEP, 'She checks her store often.', 'She found a warm patch.', 'Warm patches are normal, so she left it.', 'Damp or pests are spoiling it; dry and check it.', 1],
      ['Omondi explains spoilt produce. ' + STEP, 'He found mouldy beans.', 'He wanted to avoid waste.', 'He left them with the good beans.', 'Remove spoilt produce and dispose of it away from the store.', 2],
      ['Faith explains air. ' + STEP, 'Air helps keep grain cool.', 'Rats must be kept out.', 'So she closed the store completely so no air enters.', 'Keep air moving; screen the openings against rats.', 3],
      ['Kevin explains rodent control. ' + STEP, 'He fitted rat guards.', 'He keeps the surroundings clean.', 'He never checks the store after that.', 'Check stored produce regularly.', 0],
    ]),

  ...T('fm', 'FOOD_P.COOKING_USING_FLOUR_MIXT.FLOUR_MIXTURES', M('FM_SWAP', 'FM_RATIO', 'FM_MANDAZI', 'FM_ONLY'),
    ['Is it runny and poured, or stiff and kneaded?', 'A batter has more liquid than flour and is poured (pancakes); a dough has more flour than liquid and is kneaded and shaped (chapati, mandazi, bread); many flours can be used.'], [
      ['What kind of flour mixture is chapati made from?', 'A dough', 'A batter|0', 'A runny pour|0', 'A thin liquid|1'],
      ['Which mixture has more liquid than flour?', 'A batter', 'A dough|1', 'A chapati mixture|0', 'A stiff mixture|1'],
      ['What are mandazi made from?', 'A soft dough', 'A batter, as they are fried|2', 'A runny pour|2', 'Wheat flour only, poured|3'],
      ['Can flours other than wheat make flour mixtures?', 'Yes, such as millet flour', 'No, only wheat flour|3', 'Only for batters|3', 'Only for mandazi|2'],
      ['What kind of mixture are pancakes made from?', 'A batter', 'A dough|0', 'A kneaded mixture|0', 'A stiff mixture|1'],
    ], [
      ['Wanjiru calls her pancake mixture a dough. It is runny and she pours it. What is it?', 'A batter', 'A dough, as she said|0', 'A stiff mixture|1', 'A mandazi dough|2'],
      ['Kevin\'s mixture is stiff, with more flour than water, and he kneads it. What is it?', 'A dough', 'A batter|1', 'A pour|1', 'A batter, if fried|2'],
      ['Fatuma says mandazi come from a batter because they are fried. What is true?', 'They come from a dough', 'She is right|2', 'They come from a pour|2', 'Only wheat can be used|3'],
      ['Baraka wants to make a flour mixture but has only sorghum flour. Can he?', 'Yes, other flours work', 'No, only wheat|3', 'Only for pancakes|3', 'Only as a batter|1'],
      ['Mama Akinyi pours a thin mixture into a pan for crepes. Which type is it?', 'A batter', 'A dough|0', 'A kneaded mixture|0', 'A stiff mixture|1'],
    ], [
      ['Joy explains flour mixtures. ' + STEP, 'Chapati mixture is kneaded.', 'It has more flour than water.', 'So chapati mixture is a batter.', 'It is a dough.', 0],
      ['Kibet explains batters. ' + STEP, 'A batter is poured.', 'It is used for pancakes.', 'It has more flour than liquid.', 'A batter has more liquid than flour.', 1],
      ['Zawadi explains mandazi. ' + STEP, 'Mandazi are fried.', 'They are rolled and cut first.', 'So they come from a batter.', 'They come from a soft dough.', 2],
      ['Ouma explains flours. ' + STEP, 'Wheat flour makes chapati.', 'Maize flour is used in Kenya too.', 'Only wheat flour makes flour mixtures.', 'Maize, millet, sorghum and cassava flours are used too.', 3],
      ['Mercy explains bread. ' + STEP, 'Bread dough is kneaded.', 'It is shaped into loaves.', 'Bread is made from a runny batter.', 'Bread is made from a dough.', 0],
    ]),

  ...T('mp', 'FOOD_P.COOKING_USING_FLOUR_MIXT.MIXTURE_PREP', M('MP_ALLWATER', 'MP_KNEAD', 'MP_LUMPS', 'MP_NOMEASURE'),
    ['Measure, sift, add liquid little by little, then knead a dough or beat a batter smooth.', 'Measure the ingredients, sift the flour, add liquid gradually, knead dough until smooth and stretchy, beat batter until smooth, and rest both.'], [
      ['How is water added to flour for a dough?', 'A little at a time', 'All at once|0', 'Without measuring|3', 'After kneading|1'],
      ['Why is chapati dough kneaded?', 'To make it smooth and stretchy', 'It does not need it|1', 'To add lumps|2', 'To add all water at once|0'],
      ['How are lumps kept out of pancake batter?', 'Sift and add liquid gradually', 'Stir once and leave lumps|2', 'Add all liquid at once|0', 'Guess the amounts|3'],
      ['Why are ingredients measured?', 'For the right thickness each time', 'Guessing is fine|3', 'To add all water at once|0', 'So kneading is not needed|1'],
      ['What is done after kneading a dough?', 'Rest it, covered', 'Add all the water now|0', 'Leave lumps in it|2', 'Skip it; no kneading|1'],
    ], [
      ['Kendi pours all the water into her chapati flour at once. It turns into a sticky mess. What is better?', 'Add water little by little', 'Add even more water|0', 'Skip kneading|1', 'Guess the amounts|3'],
      ['Kiprono skips kneading his chapati dough. The chapatis are hard. What did he miss?', 'Kneading the dough', 'Adding all water at once|0', 'Leaving lumps|2', 'Guessing amounts|3'],
      ['Mwende\'s pancakes have lumps of dry flour inside. What should she do next time?', 'Sift, then beat in the milk', 'Stir once and leave it|2', 'Pour in all the milk at once|0', 'Use no measures|3'],
      ['Barasa guesses the flour and milk. One day his batter is thick, the next thin. What should he do?', 'Measure the ingredients', 'Keep guessing|3', 'Pour all at once|0', 'Leave the lumps|2'],
      ['A class is making chapati dough. Which order is right?', 'Measure, sift, add slowly, knead', 'Pour in all the water, skip kneading|0', 'Guess amounts, stir once|3', 'Leave lumps, no rest|2'],
    ], [
      ['Atieno explains making dough. ' + STEP, 'She measured the flour.', 'She sifted it.', 'She poured all the water in at once.', 'Add the water a little at a time while mixing.', 0],
      ['Hassan explains chapati dough. ' + STEP, 'He mixed flour, salt and water.', 'He formed a ball.', 'He did not knead it, as it does not need it.', 'Knead until smooth and stretchy so the chapati is soft.', 1],
      ['Lucy explains her batter. ' + STEP, 'She measured flour, eggs and milk.', 'She mixed them in a bowl.', 'She stirred once and left the lumps.', 'Sift the flour and beat in the liquid gradually.', 2],
      ['Kamau explains amounts. ' + STEP, 'He wants soft chapatis every time.', 'He uses the same recipe.', 'He guesses the flour and water each day.', 'Measure so the dough is the same every time.', 3],
      ['Neema explains resting. ' + STEP, 'She kneaded the dough well.', 'She covered it.', 'She then added more water all at once.', 'Rest it covered; do not pour in more water.', 0],
    ]),

  ...T('fp', 'FOOD_P.COOKING_USING_FLOUR_MIXT.FLOUR_PRODUCTS', M('FP_COLDPAN', 'FP_TURN', 'FP_THICK', 'FP_OILTEMP'),
    ['Think about heat: a hot pan, hot oil, and when to turn.', 'Pour pancake batter into a hot greased pan and turn when bubbles burst; roll chapati thin and cook both sides; an adult fries mandazi in hot oil until golden.'], [
      ['When is pancake batter poured into the pan?', 'When the greased pan is hot', 'Into a cold pan|0', 'Before greasing|0', 'Into cool oil|3'],
      ['When is a pancake turned?', 'When bubbles burst', 'At once|1', 'Before it touches the pan|1', 'When the pan is cold|0'],
      ['Why is chapati rolled thin?', 'So it cooks through and stays soft', 'Thick is better|2', 'So it can be turned at once|1', 'So the pan can be cold|0'],
      ['Why is mandazi fried in hot oil?', 'In cool oil it goes greasy', 'It does not matter|3', 'So it stays thick|2', 'So it can be turned at once|1'],
      ['How do you know a chapati is cooked?', 'Brown spots on both sides', 'It was turned at once|1', 'It is thick and pale|2', 'It sat in a cold pan|0'],
    ], [
      ['Wanjiku pours her batter into a cold pan. The pancake sticks and is pale. What should she do?', 'Heat the greased pan first', 'Use a colder pan|0', 'Turn it at once|1', 'Make it thicker|2'],
      ['Ali flips his pancake straight after pouring. It breaks. When should he turn it?', 'When bubbles burst', 'Straight away|1', 'Into cool oil|3', 'Thicker first|2'],
      ['Rose rolls her chapati thick so it is filling. It is raw inside. What should she do?', 'Roll it thinner', 'Roll it thicker|2', 'Use a cold pan|0', 'Turn it at once|1'],
      ['An adult fries mandazi before the oil is hot. They come out greasy and heavy. Why?', 'Cool oil soaks into them', 'Oil heat does not matter|3', 'They were rolled thin|2', 'The pan was greased|0'],
      ['A class makes chapati with the teacher. Which steps are right?', 'Roll thin, cook both sides hot', 'Roll thick, cold pan|2', 'Turn at once, cold pan|1', 'Cook in cool oil|3'],
    ], [
      ['Imani explains pancakes. ' + STEP, 'She made a smooth batter.', 'She greased the pan.', 'She poured the batter into the cold pan.', 'Pour the batter when the greased pan is hot.', 0],
      ['Kibet explains turning. ' + STEP, 'He poured a thin layer of batter.', 'He watched the edges.', 'He turned it at once before any bubbles.', 'Turn when bubbles appear and burst and the edges set.', 1],
      ['Mumbi explains chapati. ' + STEP, 'She oiled and folded the dough.', 'She rolled it out.', 'She left it thick so it is more filling.', 'Roll it thin so it cooks through and stays soft.', 2],
      ['Otieno explains mandazi. ' + STEP, 'He cut the dough into triangles.', 'The teacher fried them.', 'The oil temperature does not matter.', 'Hot oil is needed; in cool oil mandazi go greasy.', 3],
      ['Faith explains cooking chapati. ' + STEP, 'She heated the pan.', 'She cooked one side, then the other.', 'She rolled the next one thick to save time.', 'Roll each one thin so it cooks through.', 2],
    ]),
];
