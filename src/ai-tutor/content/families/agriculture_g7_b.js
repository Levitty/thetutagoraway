// ============================================================================
// AGRICULTURE GRADE 7, THE KNOWLEDGE HALF OF THE PRACTICALS (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the 12 skills the depth pass
// added for the practical outcomes (building a retention ditch, planting a tree, tilth, crop management, eggs and honey, grilling
// and steaming, cleaning an animal house, laundering loose colours, knitting, the suspended garden frame, adding value, soap).
// The app asks only which step, order, tool, measure or reason; the doing is marked by the teacher with the KICD rubric.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until an Agriculture teacher signs them.
// Heat, lye and sharp tools are never asked of a child as an action; questions ask for names, order and reasons only.
// ============================================================================
import { T } from './agriculture_g7_lib.js';

const M = (...s) => s.map(x => `M_AG7_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('rb', 'CONSER.CONSTRUCTING_WATER_RETEN.RETENTION_BUILD', M('RB_DOWN', 'RB_BANK', 'RB_CROP', 'RB_SILT'),
    ['Picture where the water runs and where you want it to stop.', 'A retention ditch runs across the slope, the soil makes a bank downhill, and it is kept clear of silt.'], [
      ['How is a water retention ditch laid out on a slope?', 'Across the slope, on the contour', 'Straight down the slope|0', 'From the top to the bottom|0', 'Wherever the soil is soft|3'],
      ['Where is the dug soil thrown when a retention ditch is made?', 'On the downhill side', 'On the uphill side|1', 'Back into the ditch|3', 'Down the middle of the slope|0'],
      ['Which crop suits a retention pit that stays wet?', 'Arrowroots', 'Maize|2', 'Beans|2', 'Millet that needs dry soil|2'],
      ['Why is a retention ditch cleared after the rains?', 'Silt fills it and it holds less water', 'It never needs clearing|3', 'To make it run downhill|0', 'To move the bank uphill|1'],
      ['What is put in a retention pit before planting?', 'Manure mixed with topsoil', 'Nothing, it stays bare|3', 'Stones to speed the water|0', 'The subsoil from the uphill side|1'],
    ], [
      ['Kiprono digs a ditch from the top of his shamba straight to the bottom. What will the run-off do?', 'Rush down faster and carry soil', 'Stay in the ditch and soak in|0', 'Stop moving at once|0', 'Turn into silt that feeds maize|2'],
      ['Akinyi throws the soil from her ditch on the uphill side. What goes wrong?', 'The ditch has no bank to hold water', 'Nothing, any side is fine|1', 'The ditch fills with water faster|1', 'The crops in it grow better|2'],
      ['Mwangi has a retention pit that stays wet most of the year. What should he plant in it?', 'Bananas or napier grass', 'Beans that rot in wet soil|2', 'Dry-land millet|2', 'Nothing, the pit stays empty|3'],
      ['A year after digging, Wanjiku sees her retention ditch is half full of mud. What should she do?', 'Clear out the silt', 'Leave it, ditches look after themselves|3', 'Dig a new one down the slope|0', 'Pile the mud on the uphill side|1'],
      ['A school marks a retention ditch with pegs. Where should the pegs go?', 'Along the contour line', 'In a line down the slope|0', 'Only at the top of the hill|0', 'Inside the old ditch|3'],
    ], [
      ['Otieno explains how he made a retention ditch. ' + STEP, 'He marked a line along the contour with pegs.', 'He dug the ditch along that line.', 'He threw the soil on the uphill side to make the bank.', 'The soil goes on the downhill side as a bank that holds the water.', 1],
      ['Nekesa explains how her retention pit is used. ' + STEP, 'She mixed manure with topsoil in the pit.', 'She chose a crop that likes wet soil.', 'She planted maize because it grows well in waterlogged soil.', 'Bananas, arrowroots or napier suit the wet pit; maize does not.', 2],
      ['Kamau explains where to site a ditch. ' + STEP, 'He watched where the run-off flowed in the rain.', 'He chose a place where the water could be caught.', 'He dug the ditch straight down the slope to follow the water.', 'The ditch runs across the slope, on the contour, to catch the water.', 0],
      ['Chebet explains how she keeps her ditch working. ' + STEP, 'She checks the ditch after heavy rain.', 'She repairs any break in the bank.', 'She leaves the silt in because a ditch never needs clearing.', 'Silt fills the ditch; clear it so it keeps holding water.', 3],
      ['Juma explains the parts of a retention ditch. ' + STEP, 'The ditch catches the run-off.', 'The soil bank stops the water flowing on.', 'The bank is best made on the uphill side of the ditch.', 'The bank is made on the downhill side.', 1],
    ]),

  ...T('tp', 'CONSER.GROWING_TREES.TREE_PLANTING', M('TP_SLEEVE', 'TP_SITE', 'TP_ONCE', 'TP_TYPE'),
    ['Think about the roots and the years the tree will need to grow.', 'Choose a tree that suits the place, remove the sleeve, plant at nursery depth, then water, mulch and protect it until it is established.'], [
      ['What is done with a seedling\'s polythene sleeve at planting?', 'Remove it without breaking the soil', 'Leave it on to protect the roots|0', 'Cut small holes and leave it on|0', 'Bury it beside the tree|0'],
      ['Where should a tree that will grow big be planted?', 'Away from houses and power lines', 'Right next to the house wall|1', 'Under the power lines|1', 'Over the old pit latrine|1'],
      ['How long is a newly planted tree watered and weeded?', 'Until it is established', 'Only on the day it is planted|2', 'Only for the first week|2', 'Never, rain does it|2'],
      ['Why is eucalyptus not planted beside a spring?', 'It uses a lot of water', 'It does not matter which tree|3', 'It makes the spring flow faster|3', 'It is too small to matter|3'],
      ['How deep is a seedling planted?', 'At the depth it grew in the nursery', 'Deeper, with the stem buried|3', 'With the sleeve still on|0', 'Anywhere, depth does not matter|2'],
    ], [
      ['Faith planted a seedling with its sleeve on. A year later it is weak. Why?', 'The roots could not grow out', 'It was not watered on the first day|2', 'The tree was the wrong colour|3', 'The sleeve fed it too much|0'],
      ['Baraka wants to plant a mango tree. Which spot is best?', 'An open place far from the house', 'Next to the kitchen wall|1', 'Under the electricity line|1', 'On top of the old latrine|1'],
      ['Mutua watered his seedling on planting day and then left it. In the dry spell it died. What did he forget?', 'Watering until it was established', 'To leave the sleeve on|0', 'To plant it near the house|1', 'To plant any tree he liked|3'],
      ['A group wants trees beside a wetland. Which choice shows good thinking?', 'A tree that suits wet places', 'Eucalyptus, any tree will do|3', 'The tallest tree they can find|3', 'A tree planted over a latrine|1'],
      ['After planting, Lilian puts dry grass around her seedling and a small fence. Why?', 'To keep moisture in and animals away', 'So she need not water it again|2', 'To make the sleeve rot faster|0', 'So it can grow close to the wall|1'],
    ], [
      ['Achieng explains how she planted a seedling. ' + STEP, 'She dug the hole early and kept the topsoil apart.', 'She mixed the topsoil with manure.', 'She planted the seedling with its polythene sleeve still on.', 'Remove the sleeve carefully; roots cannot grow through it.', 0],
      ['Kibet explains where he planted a cypress. ' + STEP, 'He chose a tree that grows well in his area.', 'He thought about how big it would grow.', 'He planted it right beside the house wall for shade.', 'Plant it away from buildings, power lines and latrines.', 1],
      ['Wairimu explains how she cares for a new tree. ' + STEP, 'She mulched around the seedling.', 'She put a fence round it against goats.', 'She stopped watering after the first day.', 'Water and weed it until it is established.', 2],
      ['Ouma explains which tree to plant by a spring. ' + STEP, 'Different trees need different amounts of water.', 'A spring needs its water kept.', 'So eucalyptus is a good tree beside the spring.', 'Eucalyptus uses a lot of water and can dry the spring.', 3],
      ['Njeri explains the planting depth. ' + STEP, 'She removed the sleeve gently.', 'She kept the ball of soil whole.', 'She buried the stem deeper than it grew in the nursery.', 'Plant at the same depth it grew in the nursery.', 3],
    ]),

  ...T('tlp', 'FOOD_P.CROP_ESTABLISHMENT.TILTH_PREP', M('TP_RAKE', 'TP_WET', 'TP_ROOTS', 'TP_TOOL'),
    ['Think about the order: clear, dig, clean out, then break the clods.', 'Clear the site, dig with a jembe when the soil is moist, remove roots and stones, then break clods to the tilth the crop needs.'], [
      ['What is the first step in preparing a seedbed?', 'Clearing the site', 'Raking the soil fine|0', 'Sowing the seeds|0', 'Breaking the clods|0'],
      ['When is the best time to dig a seedbed?', 'When the soil is moist, not wet', 'When the soil is soaking wet|1', 'Straight after a heavy storm|1', 'When the soil is like mud|1'],
      ['Why are couch grass roots removed from a seedbed?', 'They grow again and compete with the crop', 'They add manure to the soil|2', 'They make the tilth fine|2', 'They help the seeds germinate|2'],
      ['Which tool is used for primary cultivation of hard ground?', 'A forked jembe', 'A rake|3', 'A watering can|3', 'A garden fork for raking|3'],
      ['Which tilth suits carrot seeds?', 'Fine', 'Coarse, with big clods|3', 'Left as dug, unbroken|0', 'Full of grass roots|2'],
    ], [
      ['Musa rakes his plot before he has dug it. What has he missed?', 'Clearing and digging first', 'Nothing, raking comes first|0', 'Leaving the roots in|2', 'Waiting for the soil to be soaking|1'],
      ['After heavy rain, Halima digs while the soil is sticky mud. What happens?', 'The soil forms hard clods and is damaged', 'It makes the best fine tilth|1', 'The roots die at once|2', 'The rake works better|3'],
      ['Wekesa leaves couch grass roots in his seedbed. What will happen?', 'The grass grows back among the crop', 'The roots turn into manure|2', 'The seeds grow faster|2', 'The tilth becomes coarse|0'],
      ['Esther tries to break hard ground with a rake. Which tool should she use?', 'A jembe', 'A bigger rake|3', 'A panga for raking|3', 'Her hands only|3'],
      ['Omondi is planting sweet potato vines. Which tilth should he prepare?', 'Coarse', 'Very fine, raked many times|0', 'Muddy and wet|1', 'Fine, with roots left in|2'],
    ], [
      ['Atieno explains her seedbed. ' + STEP, 'She cleared the site of bush.', 'She dug with a forked jembe.', 'She left the weed roots in to rot as manure.', 'Remove roots; they grow again and compete with the crop.', 2],
      ['Kariuki explains when he dug. ' + STEP, 'He waited for rain to soften the ground.', 'He wanted the soil easy to work.', 'He dug while the soil was soaking wet and sticky.', 'Dig when the soil is moist, not wet.', 1],
      ['Rehema explains the steps. ' + STEP, 'She broke the clods to a fine tilth for kale seeds.', 'She removed stones and roots.', 'Her first step was raking before any clearing or digging.', 'Clear and dig first; raking comes at the end.', 0],
      ['Kimani explains his tools. ' + STEP, 'He used a jembe for digging.', 'He used a rake to level the bed.', 'He broke the hard ground first with a rake.', 'Primary cultivation uses a jembe or forked jembe.', 3],
      ['Zawadi explains tilth. ' + STEP, 'Small seeds need a fine tilth.', 'Maize and beans need a medium tilth.', 'So cassava cuttings also need a very fine, raked tilth.', 'Tubers, vines and cuttings grow in a coarse tilth.', 0],
    ]),

  ...T('ps', 'FOOD_P.SELECTED_CROP_MANAGEMENT.PRACTICE_STEPS', M('PS_LATEGAP', 'PS_THINWEAK', 'PS_THINDRY', 'PS_DEEPWEED'),
    ['Ask when the practice is done and what it must not harm.', 'Gap within about two weeks of germination, thin moist soil leaving the strongest, weed shallowly, and earth up round the stems.'], [
      ['When is gapping done?', 'Within about two weeks of germination', 'A month or more after germination|0', 'Just before harvest|0', 'When the crop flowers|0'],
      ['Which seedlings are left when thinning?', 'The strongest and healthiest', 'The smallest ones|1', 'The weakest ones|1', 'Any, chosen by chance|1'],
      ['When is thinning best done?', 'When the soil is moist', 'When the soil is dry and hard|2', 'In the hottest part of a dry day|2', 'When the soil is cracked|2'],
      ['How should weeds close to the crop be removed?', 'Pulled by hand or weeded shallowly', 'Dug deep with a jembe by the stem|3', 'Chopped into the crop roots|3', 'Left until harvest|0'],
      ['What is earthing-up?', 'Heaping soil round the stems', 'Pulling out the biggest plants|1', 'Digging deep beside the stems|3', 'Filling gaps a month later|0'],
    ], [
      ['Kiptoo sees gaps in his maize five weeks after it came up. He fills them now. What is the problem?', 'The new plants will lag behind', 'None, gaps can be filled at any time|0', 'He used the same crop|0', 'The soil is too moist|2'],
      ['Mary thins her carrots and pulls out the biggest ones. What is wrong?', 'She should leave the strongest', 'Nothing, big ones take space|1', 'She should thin when the soil is dry|2', 'She should dig deep instead|3'],
      ['Ali thins his seedlings when the soil is dry and hard. What happens?', 'The plants left are pulled and damaged', 'Dry soil is the best time to thin seedlings|2', 'The weak ones grow stronger|1', 'Gaps are filled by themselves|0'],
      ['Njoki weeds deep with a jembe right next to her beans. What can happen?', 'She cuts the crop roots', 'The beans grow faster|3', 'The weeds are pulled more gently|3', 'The soil becomes moist|2'],
      ['Wafula heaps soil round his potato stems. Why?', 'To cover tubers and hold the plant up', 'To fill the gaps left in the rows|0', 'To thin out the weakest plants in the row|1', 'To cut the weeds\' roots deep|3'],
    ], [
      ['Hassan explains his gapping. ' + STEP, 'He found places where seeds did not come up.', 'He planted the same crop in the gaps.', 'He waited a month after germination before gapping.', 'Gap within about two weeks so the new plants keep up.', 0],
      ['Grace explains her thinning. ' + STEP, 'She watered the bed first.', 'She thinned while the soil was moist.', 'She pulled out the strongest seedlings and left the small ones.', 'Leave the strongest and healthiest at the right spacing.', 1],
      ['Kioko explains when he thins. ' + STEP, 'Thinning gives each plant space.', 'It is done soon after the crop comes up.', 'It is best done when the soil is dry and hard.', 'Thin when the soil is moist, so the plants left are not disturbed.', 2],
      ['Auma explains her weeding. ' + STEP, 'She weeds before the weeds make seeds.', 'She pulls weeds by hand near the crop.', 'She digs deep with a jembe right next to each stem.', 'Weed shallowly near the crop so its roots are not cut.', 3],
      ['Tom explains earthing-up. ' + STEP, 'He heaps soil round the maize stems.', 'This helps hold the plants up in the wind.', 'He did it by pulling out the biggest plants first.', 'Earthing-up heaps soil; it does not remove plants.', 1],
    ]),

  ...T('eh', 'FOOD_P.PREPARING_ANIMAL_PRODUCT.EGG_HONEY_PREP', M('EH_GRADE', 'EH_POINT', 'EH_WATER', 'EH_OPEN'),
    ['Think about what keeps eggs whole and honey from spoiling.', 'Sort out cracked eggs, pack them broad end up, never add water to honey and keep it in a clean, dry, airtight container.'], [
      ['How are eggs placed in a tray?', 'Broad end up', 'Pointed end up|1', 'Lying on their sides|1', 'Any way they fit|1'],
      ['What is done with cracked eggs when sorting?', 'Removed and used first at home', 'Packed with the others|0', 'Hidden in the middle of the tray|0', 'Sold at the top of the tray|0'],
      ['Why is water never added to honey?', 'Watered honey ferments and goes sour', 'Water makes more honey to sell|2', 'Water makes it set hard|2', 'Water keeps the bees away|3'],
      ['How is honey stored?', 'In a clean, dry, airtight container', 'In an open basin|3', 'In a wet jar with no lid|3', 'Mixed with water in a bucket|2'],
      ['What is honey strained through after crushing?', 'A clean cloth', 'An open basin of water|2', 'Nothing, it is packed as crushed|3', 'A tray for eggs|1'],
    ], [
      ['Mama Wanjala packs cracked eggs with whole ones to sell. What is the problem?', 'Cracked eggs spoil and lose buyers', 'None, eggs are all the same|0', 'The tray will be too light|1', 'They must be packed pointed end up|1'],
      ['Peter packs his eggs pointed end up. What can happen?', 'The air space moves and they keep less well', 'They stay fresher|1', 'They become cracked eggs|0', 'Nothing, any way is fine|1'],
      ['Joyce adds water to her honey to fill more bottles. What will happen?', 'It ferments and goes sour', 'She has more good honey|2', 'It sets into wax|2', 'It keeps longer|3'],
      ['Ochieng keeps his strained honey in an open basin. What can go wrong?', 'It takes in water and dirt and spoils', 'Nothing, honey never spoils|3', 'It becomes sweeter|3', 'It turns into eggs|0'],
      ['A farmer candles eggs before packing them. Why?', 'To find cracked or bad eggs', 'To make them heavier|1', 'To add water inside|2', 'To mix them all together|0'],
    ], [
      ['Kerubo explains how she prepares eggs. ' + STEP, 'She collects eggs often.', 'She wipes them clean and dry.', 'She packs the cracked ones in the same tray to sell.', 'Remove cracked eggs and use them first at home.', 0],
      ['Simon explains how eggs are packed. ' + STEP, 'He grades eggs by size.', 'He keeps the trays in a cool place.', 'He puts each egg pointed end up.', 'Eggs are packed broad end up.', 1],
      ['Mueni explains how she prepares honey. ' + STEP, 'She crushes the ripe comb.', 'She strains it through a clean cloth.', 'She adds water so there is more to sell.', 'Never add water; watered honey ferments.', 2],
      ['Daudi explains how he stores honey. ' + STEP, 'He lets the honey settle.', 'He labels each container.', 'He keeps it in an open basin so it can breathe.', 'Keep honey in a clean, dry, airtight container.', 3],
      ['Neema explains honey hygiene. ' + STEP, 'Her hands and tools are clean.', 'The containers are dry.', 'Rinsing the jars and filling them wet is fine.', 'Wet jars add water and the honey can ferment.', 2],
    ]),

  ...T('cpr', 'FOOD_P.COOKING_FOOD.COOKING_PRACTICE', M('CPR_DRY', 'CPR_TURN', 'CPR_RAW', 'CPR_SLEEVE'),
    ['Think about what keeps the food cooking evenly and the cook safe.', 'Top up the steamer, turn food on the grill, check the inside is cooked, and keep sleeves and hair away from the heat.'], [
      ['What must be watched while steaming food?', 'That the water does not boil dry', 'Nothing, steaming looks after itself|0', 'That the lid stays off|0', 'That the food sits in the water|0'],
      ['Why is food on a grill turned?', 'So both sides cook evenly', 'It is not needed|1', 'To make it cook more slowly|1', 'So the fat drips onto it|1'],
      ['How do you tell grilled chicken is cooked?', 'The juices run clear inside', 'The outside is brown|2', 'It smells of smoke|2', 'It has been on for two minutes|2'],
      ['What should a cook wear near a grill?', 'Sleeves rolled up, hair tied back', 'Any clothes are fine|3', 'Loose sleeves to stay cool|3', 'Long hair untied|3'],
      ['Which method cooks food in steam above boiling water?', 'Steaming', 'Grilling, turned once|1', 'Roasting in ashes|1', 'Boiling dry in a pan|0'],
    ], [
      ['Nyambura steams cabbage and goes out for an hour. What could happen?', 'The pan boils dry and burns', 'The cabbage cooks perfectly|0', 'The water multiplies|0', 'The lid cooks it alone|0'],
      ['Odhiambo leaves fish on the grill without turning it. What happens?', 'One side burns, the other is raw', 'It cooks evenly|1', 'It steams instead|0', 'It is safer to eat|2'],
      ['Shiru\'s chicken is brown outside but pink inside. Is it ready?', 'No, it needs more cooking', 'Yes, brown means cooked|2', 'Yes, pink is fine|2', 'Only if turned once|1'],
      ['Kevin leans over the jiko with loose sleeves. What is the danger?', 'His sleeves could catch fire', 'None, sleeves do not burn|3', 'The food will not turn|1', 'The water will boil dry|0'],
      ['Mama Akoth roasts maize over coals and keeps turning it. Why?', 'So it cooks evenly without burning', 'So it stays raw inside|2', 'Turning is not needed|1', 'To boil the water dry|0'],
    ], [
      ['Imani explains steaming. ' + STEP, 'She puts the food above boiling water.', 'She keeps the lid on.', 'She never checks the water because steaming looks after itself.', 'Check the water and top it up with boiling water.', 0],
      ['Brian explains grilling. ' + STEP, 'He heats the grill first.', 'He lets the fat drip away.', 'He leaves the meat on one side until it is done.', 'Turn the food so both sides cook evenly.', 1],
      ['Wambui explains how she knows chicken is cooked. ' + STEP, 'She cuts into the thickest part.', 'She looks at the juices.', 'If the outside is brown, she says it is cooked.', 'Juices run clear and the inside is not pink.', 2],
      ['Salim explains safety at the grill. ' + STEP, 'He wears an apron.', 'He uses tongs to turn the food.', 'His long sleeves can hang loose over the coals.', 'Roll sleeves up and tie hair back.', 3],
      ['Lucy explains roasting. ' + STEP, 'Roasting uses dry heat.', 'Food can be roasted over coals or in ashes.', 'Roasted food is cooked when the skin looks brown, whatever the inside.', 'Check the inside is cooked, not only the outside.', 2],
    ]),

  ...T('hc', 'HYGIEN.HYGIENE_IN_REARING_ANIMA.HOUSE_CLEANING', M('HC_WETBED', 'HC_FEEDER', 'HC_NOGLOVES', 'HC_ORDER'),
    ['Think about the order: protect yourself, remove dirt, scrub, disinfect, dry, then add bedding.', 'Wear gloves and a mask, remove old bedding before disinfecting, let the house dry before new bedding, and wash feeders daily.'], [
      ['When is fresh bedding put in a cleaned animal house?', 'After the house has dried', 'Straight after scrubbing, while wet|0', 'Before the droppings are removed|3', 'On top of the old bedding|3'],
      ['How often are feeders and waterers washed?', 'Every day before refilling', 'Never, only topped up|1', 'Once a term|1', 'Only when they look green|1'],
      ['What should you wear to clean out droppings?', 'Gloves, a mask and gumboots', 'Nothing special|2', 'Bare hands are fine|2', 'Your school uniform|2'],
      ['What is done before disinfecting an animal house?', 'Remove bedding and droppings and scrub', 'Nothing, spray it straight away|3', 'Add new bedding first|0', 'Fill the waterers|1'],
      ['What happens to the animals while their house is cleaned?', 'They are moved out', 'They stay on the wet floor|0', 'They drink from the dirty waterer|1', 'They stay while it is sprayed|3'],
    ], [
      ['Kiplagat puts dry grass on the rabbit house floor while it is still wet. What can happen?', 'The bedding goes mouldy and rabbits fall sick', 'The wet floor helps the new bedding dry faster|0', 'It saves the need to scrub|3', 'The feeders stay clean|1'],
      ['Amina only tops up her chickens\' water trough and never washes it. What is the risk?', 'Germs build up and the birds fall ill', 'None, water in a trough always stays clean|1', 'The trough gets lighter|1', 'The bedding gets wet|0'],
      ['Jacob scoops goat droppings with his bare hands. What should he use?', 'Gloves and a shovel', 'His bare hands are fine|2', 'A wet floor first|0', 'Disinfectant on his hands only|3'],
      ['Mercy sprays disinfectant on top of the old bedding. What is wrong?', 'The dirt stops the disinfectant working', 'Nothing, spraying over it is quicker and works|3', 'She should add new bedding first|0', 'She forgot to top up the water|1'],
      ['A school cleans its poultry house. Which order is right?', 'Remove litter, scrub, disinfect, dry', 'Disinfect, then remove the litter|3', 'Scrub, add bedding, then dry|0', 'Add bedding, then scrub|0'],
    ], [
      ['Waweru explains cleaning a poultry house. ' + STEP, 'He moved the birds out.', 'He scrubbed the walls and floor.', 'He put the new bedding down while the floor was still wet.', 'Let the house dry before adding clean bedding.', 0],
      ['Fatuma explains her daily routine. ' + STEP, 'She feeds the rabbits every morning.', 'She checks they look healthy.', 'She only tops up the waterers without washing them.', 'Wash and dry feeders and waterers every day before refilling.', 1],
      ['Kamau explains what he wears. ' + STEP, 'He wears gumboots.', 'He wears an apron.', 'He removes the droppings with bare hands to work faster.', 'Wear gloves and a mask when handling droppings.', 2],
      ['Moraa explains the order. ' + STEP, 'She put on her protective clothing.', 'She moved the goats out.', 'She sprayed disinfectant before removing the old bedding.', 'Remove bedding and droppings and scrub first; then disinfect.', 3],
      ['Onyango explains the end of cleaning. ' + STEP, 'He opened the windows to air the house.', 'He waited for the floor to dry.', 'He left the feeders dirty because the house was clean.', 'Feeders and waterers are washed too.', 1],
    ]),

  ...T('cs', 'HYGIEN.LAUNDRY_LOOSE_COLOURED_I.COLOUR_STEPS', M('CS_NOTEST', 'CS_HOT', 'CS_RUB', 'CS_FOLDWET'),
    ['Think about what makes a loose colour run.', 'Test for colour fastness, wash quickly in cool water by kneading and squeezing, rinse till clear and dry it at once, inside out in shade.'], [
      ['How do you test whether a colour will run?', 'Press a damp white cloth on a hidden part', 'There is no way to know until it is washed|0', 'Wash it with white clothes|0', 'Iron it hot first|1'],
      ['Which water is used for loose colours?', 'Cool or lukewarm water', 'Hot water|1', 'Boiling water|1', 'Water left overnight with the item|3'],
      ['How is a loose-coloured article washed?', 'Quickly, by kneading and squeezing', 'Scrubbed hard on a board for a long time|2', 'Rubbed on a stone|2', 'Soaked for a whole day|3'],
      ['Why is a wet loose-coloured shirt not folded in a heap?', 'The colour runs into other parts', 'Nothing happens|3', 'It dries faster and keeps its shape|3', 'It becomes colour fast|0'],
      ['Where is a loose-coloured article dried?', 'Inside out in the shade', 'Folded in a basin|3', 'In hot sun, right side out|1', 'Under the white sheets|0'],
    ], [
      ['Atieno washes her new red kanga with white shirts without testing it. What can happen?', 'The red runs into the white shirts', 'Nothing, new things never run|0', 'The kanga turns white|1', 'The shirts get cleaner|2'],
      ['Kim washes his coloured T-shirt in very hot water. What happens?', 'More colour comes out', 'It gets brighter|1', 'It becomes colour fast|1', 'It needs scrubbing harder|2'],
      ['Zainabu scrubs her coloured dress on a rough stone. What is wrong?', 'Rubbing loosens more colour', 'Nothing, scrubbing is best|2', 'The water is too cool|1', 'She tested it first|0'],
      ['Omar folds his wet coloured shirt and leaves it in a bucket. What will he find?', 'Patches where the colour ran', 'A clean, bright shirt|3', 'A dry shirt|3', 'A shirt that is now colour fast|0'],
      ['Wangari rinses her coloured blouse in cool water until the water is clear. Why?', 'To remove soap and loose dye', 'To make the colour run more|1', 'Rinsing is not needed|3', 'To test it after washing|0'],
    ], [
      ['Mwende explains how she launders a coloured skirt. ' + STEP, 'She sorted it apart from the white clothes.', 'She used lukewarm soapy water.', 'She skipped the colour test because the skirt was new.', 'Test for colour fastness first, especially on a new item.', 0],
      ['Juma explains the water he uses. ' + STEP, 'He makes soapy water.', 'He washes quickly.', 'He uses hot water to get loose colours cleaner.', 'Use cool or lukewarm water for loose colours.', 1],
      ['Achieng explains how she washes. ' + STEP, 'She kneads the article in the water.', 'She squeezes it gently.', 'She then scrubs it hard on a board for a long time.', 'Wash quickly by kneading and squeezing, not scrubbing.', 2],
      ['Nduta explains drying. ' + STEP, 'She rinsed until the water was clear.', 'She squeezed out the water gently.', 'She folded it wet and left it to dry later.', 'Dry it at once, inside out in the shade.', 3],
      ['Cheruiyot explains ironing. ' + STEP, 'He let the shirt dry in the shade.', 'He turned it inside out.', 'He tested for colour after ironing it.', 'The colour test comes first, before washing.', 0],
    ]),

  ...T('ka', 'PRODUC.KNITTING_SKILLS.KNIT_ARTICLE', M('KA_DROP', 'KA_TIGHT', 'KA_ENDS', 'KA_COUNT'),
    ['Think about the order: slip knot, cast on, knit rows, cast off, finish the ends.', 'Count the stitches you cast on, keep the tension even, pick up dropped stitches and sew in the ends.'], [
      ['What happens if a dropped stitch is ignored?', 'It runs down and leaves a hole', 'Nothing|0', 'The article gets wider|3', 'The ends sew themselves in|2'],
      ['Why should casting on not be very tight?', 'The needle cannot go into the stitches', 'Tight is always stronger|1', 'So stitches will not drop ever|0', 'So you need not count|3'],
      ['What is done with the yarn ends after casting off?', 'Sew them in along the edge', 'Cut them short and leave them|2', 'Tie them in a big knot|2', 'Leave them long and loose|2'],
      ['How do you know how many stitches to cast on?', 'Knit a test square and measure it', 'Cast on until it looks wide enough|3', 'Always cast on ten|3', 'Cast on tightly and guess|1'],
      ['What is the first thing made before casting on?', 'A slip knot', 'A cast-off edge|2', 'A dropped stitch|0', 'A purl row|1'],
    ], [
      ['Wanjiru drops a stitch and carries on knitting her mat. What will she see?', 'A ladder or hole in the mat', 'A neater mat|0', 'Thicker yarn|1', 'Fewer ends to sew|2'],
      ['Moses casts on so tightly his needle will not go in. What should he do?', 'Cast on again more loosely', 'Pull harder on the yarn|1', 'Cut the ends short|2', 'Add more stitches without counting|3'],
      ['Halima cuts her yarn ends short and leaves them. What happens?', 'The work can come undone', 'It looks finished and strong|2', 'The mat gets wider|3', 'The stitches get tighter|1'],
      ['Brian casts on without counting. His table mat is too narrow. What should he have done?', 'Measured and counted the stitches needed', 'Cast on more tightly|1', 'Ignored the dropped stitches|0', 'Left the ends loose|2'],
      ['Esther knits every row to make garter stitch. What else keeps her work neat?', 'Even tension in every row', 'Very tight casting on|1', 'Skipping dropped stitches|0', 'Guessing the width|3'],
    ], [
      ['Akinyi explains her knitting. ' + STEP, 'She made a slip knot.', 'She cast on the stitches.', 'When a stitch dropped, she kept knitting and left it.', 'Pick up a dropped stitch, or it runs into a hole.', 0],
      ['Kiprop explains casting on. ' + STEP, 'He chose needles to suit the yarn.', 'He made a slip knot on one needle.', 'He cast on as tightly as he could so stitches would not slide.', 'Cast on evenly, not too tight, so the needle goes in.', 1],
      ['Rose explains finishing. ' + STEP, 'She cast off the last row.', 'She pressed the article.', 'She cut the yarn ends short and left them loose.', 'Sew the ends in along the edge.', 2],
      ['Daniel explains how wide his scarf will be. ' + STEP, 'He decided how wide it should be.', 'He chose his yarn and needles.', 'He cast on until it looked wide enough without counting.', 'Knit a test square, measure it and cast on the number needed.', 3],
      ['Mumbi explains stocking stitch. ' + STEP, 'She knits one row.', 'She purls the next row.', 'When a stitch drops she leaves it, as it does not matter.', 'A dropped stitch runs down; pick it up.', 0],
    ]),

  ...T('fb', 'PRODUC.CONSTRUCTING_FRAMED_SUSP.FRAME_BUILD', M('FB_WEAK', 'FB_SHADE', 'FB_POSTS', 'FB_NOPLAN'),
    ['Think about the weight of wet soil and where the light comes from.', 'Sketch and measure first, use strong materials, fix the uprights firmly, and space the containers so every plant gets light.'], [
      ['Why are strong poles used for a suspended garden?', 'Wet soil in many containers is heavy', 'It does not carry much, so thin sticks do|0', 'Thin sticks look neater|0', 'Strong poles give more shade|1'],
      ['How are the containers hung on the frame?', 'Spaced or staggered so all get light', 'As close together as possible to save room|1', 'All in one shady row|1', 'Directly on top of each other|1'],
      ['How are the uprights of the frame set up?', 'Dug into the ground or braced firmly', 'Stood loosely on top of the ground|2', 'Leaned on a wall loosely|2', 'Tied to a thin stick|0'],
      ['What is done before cutting and joining the frame?', 'Sketch the frame and measure', 'Nothing, start cutting the poles|3', 'Fill the containers|3', 'Plant the seedlings|3'],
      ['Why do the containers need holes in the bottom?', 'So extra water drains out', 'So they are lighter to hang|0', 'So they shade the lower ones|1', 'Holes are not needed|3'],
    ], [
      ['Kioko builds a frame from thin sticks. When the containers are watered, it bends. Why?', 'Wet soil is too heavy for thin sticks', 'Water makes thin sticks stronger and stiffer|0', 'The containers were spaced out|1', 'He sketched it first|3'],
      ['Nekesa hangs her top row of sacks right above the lower row. The lower plants are pale. Why?', 'They are shaded by the top row', 'They get too much light from above|1', 'The poles are too strong|0', 'The frame was measured|3'],
      ['Ali stands his poles on the ground. After a windy night the frame has fallen. What should he have done?', 'Dug the poles into the ground', 'Used thinner, lighter poles instead|0', 'Hung the sacks closer|1', 'Skipped the sketch|3'],
      ['Faith starts cutting planks without a plan. The cross bars are all different lengths. What did she miss?', 'Sketching and measuring first', 'Using thinner planks|0', 'Standing the posts loosely|2', 'Hanging containers closer|1'],
      ['Mutiso waters the top containers of his frame. Why does this work well?', 'Water drains down to the lower ones', 'The top row shades the rest of them|1', 'The frame needs no posts|2', 'Wet soil is very light|0'],
    ], [
      ['Wambui explains the materials. ' + STEP, 'She chose local poles and wire.', 'She thought about the weight to be carried.', 'She used thin sticks because the garden does not carry much.', 'Wet soil in many containers is heavy; use strong poles.', 0],
      ['Otieno explains hanging the containers. ' + STEP, 'He made drainage holes in each container.', 'He filled them with soil and manure.', 'He hung them as close together as possible to save space.', 'Space or stagger them so every plant gets light.', 1],
      ['Lilian explains the uprights. ' + STEP, 'She measured where each post would go.', 'She joined the cross bars level.', 'She stood the posts on the ground without fixing them.', 'Dig the uprights in or brace them firmly.', 2],
      ['Barasa explains how he started. ' + STEP, 'He chose a sunny place.', 'He collected strong poles.', 'He started cutting and joining without a sketch.', 'Sketch the frame and measure before cutting.', 3],
      ['Jane explains planting. ' + STEP, 'She planted kale in the containers.', 'She watered from the top.', 'She hung the big sacks so they shaded the small ones below.', 'Upper containers must not shade the lower ones.', 1],
    ]),

  ...T('vs', 'PRODUC.ADDING_VALUE_TO_CROP_PRO.VALUE_STEPS', M('VS_PACK', 'VS_THICK', 'VS_LABEL', 'VS_SPOILT'),
    ['Think about what the buyer gets and what keeps the product good.', 'Choose sound produce, slice evenly, dry or fry, cool, pack in a sealed packet and label it.'], [
      ['How are dried chips packed?', 'Cooled, in a clean sealed packet', 'Warm, in an open bag|0', 'Hot, in a wet tin|0', 'Loose on a tray|0'],
      ['Why are potatoes sliced evenly?', 'So they cook or dry evenly', 'It does not matter|1', 'So they look different|1', 'So the thick ones stay soft|1'],
      ['What is a label on a packet for?', 'To tell the buyer what is inside', 'Only to look nice|2', 'To hide the date|2', 'To keep the chips warm|0'],
      ['Should cassava with rotten parts be used?', 'No, sort it out', 'Yes, it saves money|3', 'Yes, rot adds taste|3', 'Yes, frying kills the rot|3'],
      ['Which produce is chosen for making crisps?', 'Sound, fresh produce', 'Produce with rotten parts|3', 'Bitter pieces to use them up|3', 'Any, the label hides it|2'],
    ], [
      ['Achieng packs her sweet potato crisps while still warm. Next day they are soft. Why?', 'Steam was trapped in the packet', 'They were sliced too thinly to stay crisp|1', 'They had a label|2', 'She used sound potatoes|3'],
      ['Kibet cuts his pumpkin into thick and thin pieces to dry. What happens?', 'The thin ones dry, the thick ones rot', 'All the pieces dry at the same time|1', 'The label falls off|2', 'They need warm packing|0'],
      ['Wanjiku sells groundnuts in plain bags with no label. What is missing for the buyer?', 'What it is, the weight and the date', 'Nothing, labels are decoration|2', 'Warmer nuts|0', 'Thicker nuts|1'],
      ['Omari adds bitter cassava pieces to his chips to make more. What can happen?', 'The whole batch tastes bad', 'He makes more money safely|3', 'The chips dry evenly|1', 'The label changes|2'],
      ['A group compares raw potatoes with packed crisps. What do they find?', 'Crisps keep longer and sell for more', 'Raw potatoes keep longer and sell for more|0', 'There is no difference|2', 'Crisps need no packing|0'],
    ], [
      ['Mwende explains how she makes cassava crisps. ' + STEP, 'She chose sound cassava.', 'She peeled and washed it.', 'She sliced it in thick, uneven pieces because size does not matter.', 'Slice evenly so the pieces cook or dry evenly.', 1],
      ['Hassan explains packing. ' + STEP, 'He fried the slices with an adult.', 'He drained off the oil.', 'He packed them warm in an open bag.', 'Cool them, then pack in a clean sealed packet.', 0],
      ['Nanjala explains labelling. ' + STEP, 'She packed the crisps in sealed packets.', 'She weighed each packet.', 'She left out the label because it is only decoration.', 'A label tells the buyer what it is, its weight, the date and the maker.', 2],
      ['Peter explains sorting. ' + STEP, 'He washed the potatoes.', 'He checked each one.', 'He kept the rotten ones to save money.', 'Sort out rotten produce; it spoils the batch.', 3],
      ['Joy explains drying simsim snacks. ' + STEP, 'She dried them well in the sun.', 'She let them cool.', 'She packed them still warm so they stay crisp.', 'Warm packing traps steam and makes them soft.', 0],
    ]),

  ...T('sm', 'PRODUC.MAKING_HOMEMADE_SOAP.SOAP_MAKING', M('SM_FAT', 'SM_CURE', 'SM_POT', 'SM_SALT'),
    ['Think about what soap is made of and why it must wait.', 'Soap is lye from ashes with fat or oil, salt helps it set, it cures for weeks, and its pot is never used for food. The teacher handles the lye.'], [
      ['Besides lye from ashes, what is needed to make soap?', 'Animal fat or plant oil', 'Nothing else is needed|0', 'Sugar|0', 'Only more water|0'],
      ['When can homemade soap be used?', 'After it has hardened and cured', 'As soon as it is poured|1', 'While it is still warm|1', 'The same afternoon|1'],
      ['Can the soap-making pot be used for food again?', 'No, keep a separate pot', 'Yes, after a rinse|2', 'Yes, it adds flavour|2', 'Yes, soap kills germs in food|2'],
      ['Why is salt added to soap?', 'To help it separate and set hard', 'For taste|3', 'To make it smell sweet|3', 'To make it soft and runny|1'],
      ['Which pot is used for making soap at school?', 'A pot kept only for soap', 'The class cooking pot, rinsed|2', 'Any sufuria from the kitchen|2', 'The pot used for porridge|2'],
    ], [
      ['Nyokabi mixes ash water alone and waits for soap. Nothing forms. What is missing?', 'Fat or oil', 'More ash only|0', 'Salt for taste|3', 'A cooking pot for food|2'],
      ['Mwangi pours his soap into moulds and uses a bar that evening. His skin stings. Why?', 'The soap had not cured', 'It had too much fat|0', 'It had no taste|3', 'The pot was new|2'],
      ['After making soap, Auma wants to cook ugali in the same sufuria. What should she do?', 'Use a different pot for food', 'Rinse it and cook|2', 'Add salt and cook|3', 'Cook straight away|2'],
      ['Kiprono\'s soap stays soft and does not set. What might he have left out?', 'The salt', 'More water|1', 'The taste|3', 'A food pot|2'],
      ['A school makes soap from goat fat and ash water. How long do the bars rest before use?', 'Some weeks, to cure', 'One minute|1', 'No time at all|1', 'Until they cool only|1'],
    ], [
      ['Wanjiru explains soap ingredients. ' + STEP, 'Water is passed through wood ashes to make lye.', 'The teacher handles the lye.', 'Nothing else is needed: ash water alone makes soap.', 'Soap needs animal fat or plant oil as well.', 0],
      ['Odera explains using the soap. ' + STEP, 'The mixture is poured into moulds.', 'It is left to harden.', 'It can be used on the day it is poured.', 'It must cure for some weeks before use.', 1],
      ['Kendi explains the pots. ' + STEP, 'The lye and fat are heated in a pot.', 'An adult stirs it.', 'The same pot is rinsed and used for cooking supper.', 'Keep a separate pot only for soap making.', 2],
      ['Baraka explains salt. ' + STEP, 'Salt is added near the end.', 'It is stirred in.', 'It is there to give the soap a good taste.', 'Salt helps the soap separate and set hard.', 3],
      ['Sharon explains when the soap is ready. ' + STEP, 'The soap was poured into moulds.', 'It cooled and became firm.', 'Once it was cool it was ready to use that day.', 'Cool is not cured; it must cure for some weeks.', 1],
    ]),
];
