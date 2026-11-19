// ============================================================================
// AGRICULTURE GRADE 8, THE KNOWLEDGE HALF OF THE PRACTICALS (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): the 11 skills the depth pass
// added (soil conservation on a slope, water harvesting, the kitchen garden, building and using a poultry fold, pest control
// without harmful chemicals, a balanced meal, kitchen cleaning, seams, an innovative waterer, ICT support services).
// The app asks which step, order, material or reason; the doing is marked by the teacher with the KICD rubric.
// Every wrong answer names the library misconception it reveals. Farm chemicals and bleach are never handled by a learner.
// All stay reviewed:false until an Agriculture teacher signs them off.
// ============================================================================
import { T } from './agriculture_g8_lib.js';

const M = (...s) => s.map(x => `M_AG8_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('ca2', 'CONSER.SOIL_CONSERVATION_MEASUR.CONSERVE_ACTIVITY', M('CA_LEVEL', 'CA_WATERWAY', 'CA_STRIPS', 'CA_REPAIR'),
    ['Think about which way water runs on a slope and what holds the soil.', 'Mark the contour with an A-frame, build lines and strips across the slope, keep the waterway grassed, and repair after heavy rain.'], [
      ['How is a contour marked before laying stone lines?', 'With an A-frame or line level', 'By eye, roughly across|0', 'Straight down the slope|2', 'It is not needed at all|3'],
      ['Why is a waterway kept grassed?', 'Grass holds the soil as water flows', 'So it only looks nice|1', 'Bare soil lets water flow freely|1', 'So it never needs repair|3'],
      ['Which way do the strips run in strip cropping?', 'Across the slope', 'Down the slope|2', 'From top to bottom|2', 'Any way, by eye|0'],
      ['What is done to bunds after heavy rain?', 'Check and repair breaks', 'Nothing, they last for ever|3', 'Dig them down the slope|2', 'Remove the grass on them|1'],
      ['What happens if a stone line slopes to one end?', 'Water runs along it and cuts a gully', 'Nothing, it holds the same|0', 'The waterway gets grass|1', 'The strips run across|2'],
    ], [
      ['Kiprotich lays his trash lines by eye. After rain, water runs along them to one corner and cuts a gully. What did he miss?', 'Marking the contour with an A-frame', 'Leaving the waterway bare|1', 'Planting strips down the slope|2', 'Nothing, gullies always form|3'],
      ['Wanjiku digs the grass out of her waterway so water flows faster. What happens?', 'The bare waterway is eroded', 'It works better without grass|1', 'Her strips now run across|2', 'The bunds repair themselves|3'],
      ['Omondi plants strips of maize and grass running down his hillside. What is wrong?', 'The strips should run across the slope', 'Nothing, down the slope is best|2', 'He used an A-frame|0', 'He should leave the waterway bare|1'],
      ['After a storm, Halima sees a break in her soil bund. What should she do?', 'Repair it straight away', 'Leave it; bunds last for ever|3', 'Dig a new one down the slope|2', 'Remove the grass around it|1'],
      ['A school wants to stop soil washing off its sloping garden. Which plan is best?', 'Contour lines with grass strips across', 'Lines laid by eye, roughly|0', 'Strips running down the slope|2', 'A bare waterway, never checked|1'],
    ], [
      ['Kariuki explains laying stone lines. ' + STEP, 'He collected stones from the field.', 'He laid them in a line across the slope.', 'He placed the line by eye, without marking the contour.', 'Mark the contour with an A-frame or line level first.', 0],
      ['Achieng explains her waterway. ' + STEP, 'It carries extra water off the farm.', 'It runs to a safe place.', 'She keeps it bare so water flows freely.', 'Grass holds the soil while the water flows over it.', 1],
      ['Musa explains strip cropping. ' + STEP, 'He alternates crops with grass.', 'This slows the water down.', 'He lays the strips running down the slope.', 'Strips run across the slope.', 2],
      ['Nekesa explains her bunds. ' + STEP, 'She built the bunds along the contour.', 'She planted grass on them.', 'She never checks them, as bunds last for ever.', 'Check and repair breaks after heavy rain.', 3],
      ['Juma explains the A-frame. ' + STEP, 'An A-frame finds points at the same level.', 'Pegs mark those points.', 'Then he lays the stone line between the pegs, but down the slope.', 'The line follows the pegs across the slope, on the contour.', 2],
    ]),

  ...T('hs2', 'CONSER.WATER_HARVESTING_AND_STO.HARVEST_SETUP', M('HS_FIRST', 'HS_GUTTER', 'HS_TAP', 'HS_CLEAN'),
    ['Think about dirt: where it comes from and where it settles.', 'Let the first dirty flush away, slope gutters to the tank, fit the tap above the bottom, and clean roof, gutters and tank regularly.'], [
      ['What is done with the first rain off a dusty roof?', 'Let it run away, then collect', 'Let it straight into the tank|0', 'Store it for drinking first|0', 'Pour it into the gutter again|1'],
      ['How are gutters fixed?', 'Sloping gently towards the tank', 'Flat along the roof|1', 'Sloping away from the tank|1', 'Any way, water finds it|1'],
      ['Where is the tank tap fitted?', 'A little above the bottom', 'At the very bottom|2', 'On the roof|1', 'Inside the gutter|1'],
      ['When are the roof, gutters and tank cleaned?', 'Before the rains and regularly after', 'Never|3', 'Only when the tank is full|3', 'Only once when it is built|3'],
      ['Why is a mesh put at the top of the down pipe?', 'To keep out leaves and dirt', 'To slow the gutter flat|1', 'To let the first flush in|0', 'It means cleaning is never needed|3'],
    ], [
      ['The first rain of the season washes dust and bird droppings off the school roof straight into the tank. What should the school have done?', 'Let the first flush run away', 'Nothing, all rain is clean|0', 'Fixed the gutters flat|1', 'Moved the tap to the bottom|2'],
      ['Water overflows from the middle of Kamau\'s gutter and little reaches the tank. Why?', 'The gutter is flat, not sloping', 'The tap is above the bottom|2', 'He let the first flush go|0', 'He cleaned the roof|3'],
      ['Water from Njeri\'s tank tap is muddy. The tap is at the very bottom. Why?', 'It draws the dirt that settles there', 'Muddy water is normal|3', 'The gutters slope to the tank|1', 'She let the first rain go|0'],
      ['A school tank has not been cleaned for three years. The water smells. What should be done?', 'Clean the tank, roof and gutters', 'Nothing, tanks clean themselves|3', 'Move the tap to the bottom|2', 'Let the first rain straight in|0'],
      ['Peter is setting up a water tank at home. Which plan is right?', 'Sloping gutters, a mesh and a first flush', 'Flat gutters and a tap at the bottom|1', 'No mesh and no cleaning|3', 'First rain straight into the tank|0'],
    ], [
      ['Faith explains her rain tank. ' + STEP, 'Her gutters slope to the down pipe.', 'A mesh keeps leaves out.', 'She lets the first dirty rain run straight into the tank.', 'Let the first flush run away, then collect the cleaner water.', 0],
      ['Otieno explains fixing gutters. ' + STEP, 'He fixed brackets along the roof edge.', 'He joined the gutter to the down pipe.', 'He fixed the gutter flat so water stays level.', 'Gutters slope gently towards the down pipe and tank.', 1],
      ['Wairimu explains the tank. ' + STEP, 'The tank stands on a firm base.', 'It has a cover.', 'The tap is at the very bottom to use every drop.', 'Fit the tap above the bottom so settled dirt stays in.', 2],
      ['Kioko explains care of the system. ' + STEP, 'The tank is covered.', 'The tap is above the bottom.', 'Once it is built it never needs cleaning.', 'Clean the roof, gutters and tank before the rains and regularly.', 3],
      ['Esther explains run-off harvesting. ' + STEP, 'She dug a shallow pan where run-off flows.', 'She lined it to hold water.', 'Her roof water goes into the tank with no first flush.', 'Let the first dirty roof water run away.', 0],
    ]),

  ...T('gs2', 'FOOD_P.KITCHEN_AND_BACKYARD_GAR.GARDEN_SETUP', M('GS_ALLONCE', 'GS_FAR', 'GS_FENCE', 'GS_HERB'),
    ['Think about a steady supply, easy care and keeping animals out.', 'Site it near the house and water in the sun, fence it, plant small amounts every few weeks, and include herbs.'], [
      ['How are vegetables planted for a steady supply?', 'Small amounts every two or three weeks', 'Everything on one day|0', 'All of one kind at once|0', 'Only herbs from the shop|3'],
      ['Where is a kitchen garden best sited?', 'Near the house and water, in the sun', 'Far from the house in the shade|1', 'Under a big tree far away|1', 'Where goats graze freely|2'],
      ['Why is a kitchen garden fenced?', 'To keep chickens and goats out', 'It is not needed|2', 'To give the plants shade|1', 'So all crops ripen together|0'],
      ['Which herb can be grown in a backyard garden?', 'Dhania', 'None, herbs come only from shops|3', 'Only maize|3', 'Herbs grow only far away|1'],
      ['Which garden design saves water near the house?', 'A keyhole garden', 'A garden far from water|1', 'An open, unfenced plot|2', 'One big planting on one day|0'],
    ], [
      ['Mama Atieno planted all her sukuma, spinach and onions on one day. Now everything is ready at once, then nothing. What should she do?', 'Plant small amounts every few weeks', 'Plant everything on one day again|0', 'Move the garden far from water|1', 'Stop fencing it|2'],
      ['Wekesa\'s garden is at the far end of the plot, under trees. It dries out and grows poorly. Why?', 'It is far from water and in the shade', 'It is too close to the house|1', 'It is fenced|2', 'He grows dhania|3'],
      ['Chickens keep eating Zawadi\'s seedlings. What does her garden need?', 'A fence', 'Nothing, chickens help|2', 'To be moved into the shade|1', 'All crops planted on one day|0'],
      ['Brian says his family must buy all its dhania and mint. What can he tell them?', 'They can grow herbs at home', 'Herbs grow only in shops|3', 'Herbs need a garden far away|1', 'Herbs need no fence|2'],
      ['A family in a small compound wants vegetables all year. Which plan is best?', 'A fenced keyhole garden near the tap', 'One big planting far from the house|1', 'An open plot where goats walk|2', 'Everything planted in one day|0'],
    ], [
      ['Kimani explains his kitchen garden. ' + STEP, 'He chose a sunny place.', 'He fenced it.', 'He put it far from the house and the water point.', 'Site it near the house and water so it is easy to care for.', 1],
      ['Nanjala explains her planting. ' + STEP, 'She prepared beds with manure.', 'She chose a mix of vegetables.', 'She planted them all on the same day.', 'Plant small amounts every two or three weeks for a steady supply.', 0],
      ['Ali explains his garden. ' + STEP, 'It is near the kitchen.', 'It gets the morning sun.', 'He left it unfenced because the goats are tied up sometimes.', 'Fence it to keep chickens, goats and other animals out.', 2],
      ['Moraa explains her crops. ' + STEP, 'She grows kale and tomatoes.', 'She grows onions.', 'She buys all her herbs because herbs cannot grow at home.', 'Dhania, mint and rosemary grow well at home.', 3],
      ['Omar explains a keyhole garden. ' + STEP, 'It is a raised round bed with a path to the centre.', 'Kitchen water goes into a basket in the middle.', 'It is best built far from the house.', 'It is built near the house so kitchen water reaches it.', 1],
    ]),

  ...T('fb2', 'FOOD_P.POULTRY_REARING_IN_A_FOL.FOLD_BUILD', M('FB_HEAVY', 'FB_NOROOF', 'FB_MESH', 'FB_SIZE'),
    ['Think about who moves the fold, what the birds need inside, and what must stay out.', 'A fold is light enough for two people to move, has a roofed part, small mesh with no gaps, and room for every bird.'], [
      ['Why is a poultry fold built of light materials?', 'So two people can move it', 'Light materials are cheaper only|0', 'So it can be tiny|3', 'So it needs no roof|1'],
      ['Why does a fold have a roofed part?', 'For shelter, laying and roosting', 'It does not need one|1', 'To make it heavy and strong|0', 'So more birds fit in|3'],
      ['Which mesh is used for a fold?', 'Small holes with no gaps at joints', 'Big holes for more air|2', 'Any mesh with gaps|2', 'Heavy iron sheets only|0'],
      ['How big is a fold built?', 'Big enough for each bird to move and rest', 'As small as possible|3', 'Tiny, with many birds|3', 'So heavy no one can move it|0'],
      ['What does a fold have so it can be moved?', 'Handles or wheels', 'Heavy timber legs dug in|0', 'No roof at all|1', 'Gaps at the joints|2'],
    ], [
      ['Kiplagat builds his fold from heavy timber and iron sheets. Now nobody can move it. What went wrong?', 'It is too heavy to move', 'Heavy is always better|0', 'It has no roofed part|1', 'The mesh holes are small|2'],
      ['Wanjiru\'s fold is all mesh. In the rain, her hens are soaked. What is missing?', 'A roofed shelter', 'Bigger mesh holes|2', 'Heavier poles|0', 'More hens inside|3'],
      ['A mongoose got into Otieno\'s fold through a gap at a corner. What should he fix?', 'Close the gaps with small mesh', 'Make the mesh holes bigger for air|2', 'Remove the roof to see it|1', 'Crowd more birds in|3'],
      ['Mueni puts twenty hens in a fold built for five. What will happen?', 'They crowd, fight and fall sick', 'They stay warm and lay more eggs|3', 'The fold becomes easier to move|0', 'The roof keeps them apart|1'],
      ['A school is building a fold for eight hens. Which plan is right?', 'A light frame, small mesh and a roof', 'Heavy iron sheets, too heavy to move|0', 'All mesh, no roof|1', 'Large mesh with gaps|2'],
    ], [
      ['Hassan explains his fold. ' + STEP, 'He sketched the fold first.', 'He made handles for carrying.', 'He used heavy timber and iron sheets so it is strong.', 'Use light materials so two people can move it.', 0],
      ['Grace explains the shelter. ' + STEP, 'The run is made of wire mesh.', 'There is a door for feeding.', 'She left out the roof because the birds are outside.', 'A roofed part gives shelter and a place to lay and roost.', 1],
      ['Daudi explains the mesh. ' + STEP, 'He used a light wooden frame.', 'He added a roofed part.', 'He chose mesh with big holes for more air.', 'Small mesh with no gaps keeps out mongooses and snakes.', 2],
      ['Rose explains the size. ' + STEP, 'She counted her ten birds.', 'She chose light materials.', 'She made the fold as small as possible.', 'Make it big enough for each bird to move, eat and rest.', 3],
      ['Kevin explains finishing. ' + STEP, 'He fitted handles at each end.', 'He made a door.', 'He left gaps at the joints of the mesh.', 'Gaps at joints let predators in.', 2],
    ]),

  ...T('fr2', 'FOOD_P.POULTRY_REARING_IN_A_FOL.FOLD_REARING', M('FR_LITTER', 'FR_STAY', 'FR_WATER', 'FR_SUN'),
    ['Think about fresh ground, water all day and shade.', 'Move the fold to fresh ground every few days, leave droppings as manure, give clean water all day, and keep shade at midday.'], [
      ['How often is a fold moved?', 'Every few days, to fresh ground', 'Once a term|1', 'Never, it stays put|1', 'Only when it rains|1'],
      ['What happens to the droppings when the fold is moved?', 'They are left to manure the ground', 'They are swept away as rubbish|0', 'They are moved with the fold|0', 'They are burnt at once|0'],
      ['How is water given to birds in a fold?', 'Clean water all day, refilled', 'Once in the morning|2', 'Only every few days|2', 'Only when it is sunny|3'],
      ['Where is a fold placed on a hot day?', 'Where there is shade', 'In full sun at midday|3', 'On the same patch for weeks|1', 'Where the water runs out|2'],
      ['What is done with a sick bird in the fold?', 'It is separated from the others', 'It stays in full sun|3', 'It is given water once a day|2', 'It stays on the old patch|1'],
    ], [
      ['Mwende leaves her fold on the same patch for a month. The ground is bare and smelly. What should she do?', 'Move it to fresh ground every few days', 'Leave it there for another month|1', 'Sweep the droppings away|0', 'Put it in full sun|3'],
      ['After moving the fold, Kibet sweeps up the droppings and throws them in a pit. What is better?', 'Leave them to manure the grass', 'Sweep even more carefully|0', 'Move the fold once a term|1', 'Give water only at dawn|2'],
      ['Njoki fills the waterer at 7 am. By noon it is empty and the birds pant. What should she do?', 'Refill it so there is water all day', 'Wait until the next morning to fill it|2', 'Move the fold into full sun|3', 'Leave the fold on one patch|1'],
      ['On a hot afternoon, Odhiambo moves his fold into an open field with no shade. What is the danger?', 'The birds suffer from heat', 'They lay more eggs in the sun|3', 'The droppings dry and vanish|0', 'They need less water|2'],
      ['A school rears chicks in a fold. Which plan is right?', 'Move it often and keep water and shade', 'Leave it a term and water it once|1', 'Sweep droppings away daily|0', 'Full sun all afternoon|3'],
    ], [
      ['Atieno explains rearing in her fold. ' + STEP, 'She feeds the birds every morning.', 'She gives clean water.', 'She sweeps the droppings away as rubbish after moving the fold.', 'Leave the droppings to manure the grass or garden.', 0],
      ['Kamau explains moving the fold. ' + STEP, 'Two people lift it by the handles.', 'They put it on fresh grass.', 'They do this once a term.', 'Move it every few days to fresh ground.', 1],
      ['Lilian explains watering. ' + STEP, 'She washes the waterer.', 'She fills it with clean water.', 'She fills it only once, in the morning.', 'Give clean water all day, refilled as needed.', 2],
      ['Barasa explains where he puts the fold. ' + STEP, 'He looks for fresh grass.', 'He checks there are no gaps for predators.', 'At midday he moves it into full sun.', 'Keep it where the roof or a tree gives shade.', 3],
      ['Joyce explains her checks. ' + STEP, 'She watches for sick birds.', 'She separates any sick bird.', 'She leaves the fold on the same patch for weeks.', 'Move it every few days so the ground stays fresh.', 1],
    ]),

  ...T('pcm', 'FOOD_P.CROP_PEST_AND_DISEASE_CO.PEST_CONTROL_METHODS', M('PCM_COMPOST', 'PCM_SAME', 'PCM_LATE', 'PCM_SPRAY'),
    ['Think about how pests and diseases spread and when to act.', 'Act at the first signs, burn or bury diseased plants away from the garden, rotate crops, and leave chemicals to trained adults.'], [
      ['What is done with tomato plants that have a disease?', 'Uproot and burn or bury them away', 'Put them on the compost heap|0', 'Leave them to recover|2', 'Spray them yourself|3'],
      ['Why are tomatoes not grown in the same bed every season?', 'Soil diseases die out when the crop moves', 'It does not matter which bed is used|1', 'Compost stops all diseases|0', 'Spraying makes it safe|3'],
      ['When is pest control started?', 'As soon as the first signs are seen', 'When most plants are damaged|2', 'At harvest time, when it is over|2', 'Only after spraying|3'],
      ['Who mixes and sprays farm chemicals?', 'A trained adult in protective clothing', 'Any learner who reads the label|3', 'The youngest learner|3', 'Anyone without gloves|3'],
      ['Which is a way to control aphids without harmful chemicals?', 'Dusting with wood ash', 'Waiting until all leaves are eaten|2', 'Putting infested leaves on compost|0', 'Planting kale in the same bed for ever|1'],
    ], [
      ['Shiru puts her blighted tomato plants on the compost heap. Next season the disease is back. Why?', 'The disease survived in the compost', 'Compost always kills disease|0', 'She rotated her crops|1', 'She acted too early|2'],
      ['Musa plants tomatoes in the same bed every season. Wilt gets worse each year. What should he do?', 'Rotate to a different crop', 'Keep the same bed|1', 'Wait until all plants die|2', 'Let a learner spray it|3'],
      ['Wambui sees a few caterpillars on her cabbages but waits. A week later most leaves are eaten. What should she have done?', 'Handpicked them at once', 'Waited even longer|2', 'Put the leaves on compost|0', 'Mixed a spray herself|3'],
      ['A Grade 8 learner wants to mix a pesticide for the school garden. What is right?', 'Only a trained adult sprays chemicals', 'Any learner can spray|3', 'Spray only when all is eaten|2', 'Spray the compost heap|0'],
      ['A school garden has a few aphids on kale. Which plan is best?', 'Act now with ash or a natural spray', 'Wait until most kale is spoilt|2', 'Learners mix a chemical spray|3', 'Grow kale in the same bed for ever|1'],
    ], [
      ['Kiprono explains how he deals with disease. ' + STEP, 'He found plants with blight.', 'He uprooted them.', 'He put them on the compost heap.', 'Burn or bury diseased plants away from the garden.', 0],
      ['Nyambura explains her beds. ' + STEP, 'Diseases can stay in the soil.', 'Some attack only one crop.', 'So she grows tomatoes in the same bed every season.', 'Rotate crops so soil diseases die out.', 1],
      ['Peter explains timing. ' + STEP, 'He checks his crops often.', 'He saw the first holes in the leaves.', 'He decided to wait until most plants were damaged.', 'Act as soon as the first signs are seen.', 2],
      ['Amina explains spraying. ' + STEP, 'Some pests need a chemical spray.', 'Chemicals can harm people.', 'So learners can mix and spray them carefully.', 'Only a trained adult with protective clothing sprays.', 3],
      ['Daniel explains handpicking. ' + STEP, 'He picks caterpillars off by hand.', 'He drops them into soapy water.', 'He puts the infested leaves on the compost heap.', 'Burn or bury infested parts away from the garden.', 0],
    ]),

  ...T('mpr', 'FOOD_P.COOKING_PREPARING_A_BALA.MEAL_PREP', M('MPR_ORDER', 'MPR_STYLE', 'MPR_BUDGET', 'MPR_SICK'),
    ['Think about who the meal is for, what takes longest, and how it is served.', 'Plan all food groups for the person and budget, cook the slowest food first, and serve in family style or blue plate style.'], [
      ['Which food is started first for beans, rice and cabbage?', 'The beans, they take longest', 'The cabbage, then the rice|0', 'All three at the same time|0', 'The rice, then the cabbage|0'],
      ['What is blue plate style?', 'Food is put on each plate in the kitchen', 'Dishes on the table for all to share|1', 'Food served without plates|1', 'A meal that must have meat|2'],
      ['Can a balanced meal be made without meat?', 'Yes, beans, eggs or omena give protein', 'No, meat is always needed|2', 'No, it is too costly|2', 'Only for a sick person|3'],
      ['Which meal suits a sick person?', 'Light, soft food with plenty of fluids', 'Heavy fried food|3', 'The same chips as everyone|3', 'A large plate of nyama choma|3'],
      ['What is family style serving?', 'Dishes on the table to help yourself', 'Each plate filled in the kitchen|1', 'One plate shared by two|1', 'Only cold food|0'],
    ], [
      ['Achieng cooks the cabbage first, then the rice, then the beans. The cabbage is cold at lunch. What should she do?', 'Start the beans first, cabbage last', 'Cook the cabbage first again|0', 'Serve it blue plate style|1', 'Add meat to the cabbage|2'],
      ['At a family dinner, the dishes are put in the middle of the table and everyone helps themselves. Which style is this?', 'Family style', 'Blue plate style|1', 'Sick-person style|3', 'It is not a serving style|1'],
      ['At a hotel, each guest gets a plate already filled in the kitchen. Which style is this?', 'Blue plate style', 'Family style|1', 'Self-service at the table|1', 'A meal with no protein|2'],
      ['Wekesa says his family cannot afford a balanced meal because meat is too dear. What can he use instead?', 'Ndengu or omena', 'Nothing, meat is needed|2', 'Only rice and potatoes|2', 'Fried chips|3'],
      ['Mumbi\'s grandmother is unwell. Which meal should Mumbi plan?', 'Soft porridge, soup and fruit juice', 'Fried chips and sausages|3', 'Heavy stew with fried meat|3', 'Whatever cooks fastest first|0'],
    ], [
      ['Kevin explains his meal plan. ' + STEP, 'He chose foods from all the food groups.', 'He listed the ingredients.', 'He cooked the cabbage first and the beans last.', 'Cook the slowest food (beans) first and the cabbage last.', 0],
      ['Faith explains serving. ' + STEP, 'She set the table.', 'She put the dishes in the middle for all to share.', 'She called it blue plate style.', 'That is family style; blue plate is filled in the kitchen.', 1],
      ['Ouma explains his budget. ' + STEP, 'He has little money for the meal.', 'He needs protein.', 'So a balanced meal is impossible without meat.', 'Beans, ndengu, eggs or omena give protein cheaply.', 2],
      ['Halima explains a meal for her sick brother. ' + STEP, 'She thought about his health.', 'She planned plenty of fluids.', 'She cooked him the usual heavy fried meal.', 'A sick person needs light, soft, easy food.', 3],
      ['Zainabu explains timing. ' + STEP, 'She wants everything ready together.', 'She knows beans take longest.', 'So she starts the beans last.', 'Start the beans first so all is ready together.', 0],
    ], ['b', 'c', 'b']),

  ...T('kr', 'HYGIEN.CLEANING_THE_KITCHEN.KITCHEN_ROUTINE', M('KR_BOTTOM', 'KR_MIX', 'KR_STORE', 'KR_SPONGE'),
    ['Think about where dirt falls and what is safe to mix.', 'Clean from top to bottom, never mix bleach with other cleaners, empty and scrub the store, and dry sponges and cloths.'], [
      ['Which is cleaned last in a kitchen?', 'The floor', 'The shelves|0', 'The stove top|0', 'The window sills|0'],
      ['Why is bleach never mixed with other cleaners?', 'Some mixtures give off poisonous gases', 'Mixing makes them stronger and better|1', 'It saves money on cleaners|1', 'So the floor is cleaned first|0'],
      ['What is done in special cleaning of the food store?', 'Empty it, scrub shelves, check for pests', 'Only add new food|2', 'Mix bleach with soap on the food|1', 'Leave old food at the back|2'],
      ['What is done with dish sponges after use?', 'Wash, rinse and dry them', 'Leave them wet in the sink|3', 'Mix them with bleach and soap|1', 'Put them in the food store|2'],
      ['Which is a daily kitchen job?', 'Wiping surfaces and washing dishes', 'Scrubbing the walls only|2', 'Emptying the store every day|2', 'Mopping before wiping shelves|0'],
    ], [
      ['Nduta mops the floor, then wipes the shelves. Crumbs fall on the clean floor. What should she do?', 'Wipe shelves first, floor last', 'Mop first again|0', 'Mix cleaners to work faster|1', 'Leave the sponge in the sink|3'],
      ['Mwangi mixes bleach and another cleaner to clean the sink. He starts coughing. Why?', 'The mixture gave off a harmful gas', 'The mixture is stronger and safe|1', 'He mopped the floor last|0', 'He dried the sponge|3'],
      ['Weevils are found in the back of Chebet\'s food store. Nobody ever empties it. What should be done?', 'Empty and scrub it and throw spoilt food', 'Add new food on top|2', 'Mix bleach into the flour|1', 'Mop before the shelves|0'],
      ['Grace leaves the wet dish sponge in the sink every night. It smells. Why?', 'Germs grow in a wet sponge', 'Sponges never hold germs|3', 'She cleaned top to bottom|0', 'She emptied the store|2'],
      ['A school kitchen is being cleaned. Which order is right?', 'Shelves, stove, then floor', 'Floor, then shelves|0', 'Mix all cleaners first|1', 'Only add food to the store|2'],
    ], [
      ['Brian explains daily cleaning. ' + STEP, 'He washes the dishes.', 'He wipes the stove.', 'He mops the floor before wiping the shelves.', 'Work top to bottom: shelves first, floor last.', 0],
      ['Akinyi explains cleaners. ' + STEP, 'She reads the label on each cleaner.', 'She uses the right one for each surface.', 'She mixes bleach with other cleaners to make them stronger.', 'Never mix bleach; some mixtures give off poisonous gases.', 1],
      ['Kioko explains the food store. ' + STEP, 'He checks dates on packets.', 'He keeps the store dry.', 'He never empties it, only adds new food.', 'Empty, scrub, check for pests and throw out spoilt food.', 2],
      ['Esther explains the end of the day. ' + STEP, 'She wipes the surfaces.', 'She empties the waste bin.', 'She leaves the sponge wet in the sink overnight.', 'Wash, rinse and dry sponges and cloths.', 3],
      ['Salim explains weekly cleaning. ' + STEP, 'He cleans the cupboards.', 'He wipes the windows.', 'He mops the floor first and then cleans the shelves.', 'The floor is cleaned last.', 0],
    ]),

  ...T('sew', 'PRODUC.SEWING_SKILLS_CONSTRUCTI.SEAM_MAKING', M('SEW_RIGHT', 'SEW_EDGE', 'SEW_NEATEN', 'SEW_PRESS'),
    ['Think about which side shows, where the stitch line is, and what keeps the seam strong and flat.', 'Place right sides together, stitch about 1.5 cm in on the fitting line, neaten the raw edges and press the seam.'], [
      ['Which sides are put together for a plain seam?', 'The right sides', 'The wrong sides|0', 'One right and one wrong side|0', 'It does not matter|0'],
      ['Where is a seam stitched?', 'About 1.5 cm in, on the fitting line', 'Right at the raw edge|1', 'In the middle of the cloth|1', 'Anywhere near the edge|1'],
      ['Why are the raw edges of a seam neatened?', 'To stop them fraying', 'It is not needed|2', 'So the seam is at the edge|1', 'So the wrong sides show|0'],
      ['Why is a seam pressed?', 'So it lies flat and neat', 'Only to look nice|3', 'To make it fray less|2', 'To join the wrong sides|0'],
      ['How is an open seam pressed?', 'Open, with edges on each side', 'Not pressed at all|3', 'With the wrong sides out|0', 'At the raw edge only|1'],
    ], [
      ['Wanjiru sews a cushion cover with the wrong sides together. When she turns it, the seam allowance shows outside. What went wrong?', 'She should put the right sides together', 'She pressed the seam open too much|3', 'She stitched 1.5 cm in|1', 'She neatened the edges|2'],
      ['Odera stitches his bag right at the raw edge. The stitches pull out. What should he do?', 'Stitch on the fitting line, 1.5 cm in', 'Stitch even nearer to the raw edge|1', 'Put wrong sides together|0', 'Skip pressing|3'],
      ['After a few washes, the edges inside Atieno\'s pillow case have frayed. What did she skip?', 'Neatening the raw edges', 'Stitching at the edge|1', 'Putting wrong sides together|0', 'Leaving it unpressed|3'],
      ['Kimani\'s finished pillow case looks puckered and bulky at the seams. What should he have done?', 'Pressed the seams', 'Nothing, pressing is only for looks|3', 'Stitched at the raw edge|1', 'Left the edges raw|2'],
      ['A class is making bags with plain seams. Which plan is right?', 'Right sides together, neatened, pressed', 'Wrong sides together, stitched at the edge|0', 'Stitch at the edge, leave raw|1', 'No neatening, no pressing|2'],
    ], [
      ['Nekesa explains her plain seam. ' + STEP, 'She pinned the two pieces.', 'She tacked on the fitting line.', 'She had put the wrong sides together first.', 'Place the right sides together.', 0],
      ['Juma explains stitching. ' + STEP, 'He used small running stitches.', 'He removed the tacking after.', 'He stitched right at the raw edge.', 'Stitch about 1.5 cm in, on the fitting line.', 1],
      ['Mercy explains the edges. ' + STEP, 'She stitched the seam.', 'She pressed it to one side.', 'She left the raw edges, as neatening is not needed.', 'Neaten raw edges to stop fraying.', 2],
      ['Ochieng explains finishing. ' + STEP, 'He stitched with back stitch.', 'He neatened the edges.', 'He did not press the seam, since it only looks nice.', 'Press so the seam lies flat and the item takes shape.', 3],
      ['Joy explains making a cushion cover. ' + STEP, 'She cut two pieces the same size.', 'She neatened the edges.', 'She sewed the pieces wrong sides together and turned it.', 'Sew right sides together so the seam is inside.', 0],
    ], ['b', 'c', 'b']),

  ...T('wd', 'PRODUC.CONSTRUCTING_INNOVATIVE_.WATERER_DESIGN', M('WD_TEST', 'WD_CHEM', 'WD_CLEAN', 'WD_PROBLEM'),
    ['Think about the order: problem, design, safe materials, build, test, improve.', 'Name the problem first, use clean safe materials (never a pesticide tin), design it to be cleaned, then test and adjust.'], [
      ['What is the first step in designing a waterer?', 'Name the problem with the old one', 'Start building|3', 'Give it to the animals|0', 'Find any old container|1'],
      ['Can an old pesticide container be used for a waterer?', 'No, poison stays in it', 'Yes, after washing|1', 'Yes, if it is big|1', 'Yes, if it is never cleaned|2'],
      ['Why must a waterer be easy to open and clean?', 'Slime and germs build up inside', 'It does not need cleaning|2', 'So it can hold pesticide|1', 'So it need not be tested|0'],
      ['What is done after building a waterer?', 'Test it for leaks and watch it used', 'Give it to the animals and leave it|0', 'Paint over the inside|2', 'Start again without a plan|3'],
      ['Which material is safe for a chick waterer?', 'A clean plastic bottle and dish', 'A rinsed pesticide tin|1', 'A sealed tin that cannot open|2', 'Whatever is lying around|3'],
    ], [
      ['Kibet builds a new waterer and puts it in the hen house without trying it. It leaks and wets the litter. What did he skip?', 'Testing it first', 'Naming a new colour|3', 'Using a pesticide tin|1', 'Sealing it shut|2'],
      ['Wairimu wants to use an empty pesticide can as a goat waterer after rinsing it. What should she do?', 'Use a clean, safe container instead', 'Rinse it and use it|1', 'Use it without testing|0', 'Seal it so it never opens|2'],
      ['Mutua\'s waterer is sealed shut. After a month, green slime grows inside. What was the design mistake?', 'It cannot be opened to clean', 'It was tested|0', 'He named the problem first|3', 'He used a clean bottle|1'],
      ['A group starts cutting bottles before deciding what is wrong with the old waterer. What should they do first?', 'Name the problem with the old one', 'Keep cutting|3', 'Use pesticide tins|1', 'Skip testing|0'],
      ['A school designs a waterer for rabbits. Which plan is right?', 'Problem, design, safe materials, test', 'Build, then give it out untested|0', 'Pesticide can, sealed shut|1', 'Start with no problem named|3'],
    ], [
      ['Achieng explains her waterer design. ' + STEP, 'She sketched an upturned bottle in a dish.', 'She built it at the hens\' height.', 'She gave it to the hens without testing it.', 'Test it for leaks and spills, watch it used, then adjust.', 0],
      ['Baraka explains his materials. ' + STEP, 'He looked for reused containers.', 'He found an old pesticide can.', 'He rinsed it and used it for the calves.', 'Never use a pesticide container; poison stays in it.', 1],
      ['Lucy explains her design. ' + STEP, 'It stops spilling.', 'It keeps out dirt.', 'It is sealed and never needs cleaning.', 'It must open so slime and germs can be washed out daily.', 2],
      ['Omari explains his start. ' + STEP, 'He gathered bottles and wire.', 'He began cutting at once.', 'He thought about the problem only after building.', 'Name the problem with the old waterer first.', 3],
      ['Wanjala explains testing. ' + STEP, 'He filled it with water.', 'He checked for leaks.', 'Then he left it with the animals and never checked it again.', 'Watch the animals use it and adjust it.', 0],
    ]),

  ...T('ia', 'PRODUC.ICT_SUPPORT_SERVICES.ICT_ACCESS', M('IA_FAKE', 'IA_CHECK', 'IA_LOGOUT', 'IA_STEPS'),
    ['Think about who sent it, whether it can be checked, and who else uses the device.', 'Use the official code or site, check information against another source, never send money to an unknown message, and log out.'], [
      ['A message says you have won a prize and must send money first. What is it?', 'A scam; tell an adult', 'A real service; send the money|0', 'A market price update|1', 'A code to try at random|3'],
      ['Why check market prices from more than one source?', 'One source can be wrong or old', 'It is not needed|1', 'All messages are true|0', 'So you can stay logged in|2'],
      ['What do you do when you finish on a shared computer?', 'Log out', 'Just close the window|2', 'Leave it open for the next person|2', 'Dial a random code|3'],
      ['How do you find the USSD code for a weather service?', 'From the provider or a trusted source', 'Try any code|3', 'Trust a stranger\'s SMS|0', 'Guess and send money|0'],
      ['Who should know your mobile money PIN?', 'Only you', 'Anyone who sends an SMS|0', 'The next user of the computer|2', 'Whoever answers a random code|3'],
    ], [
      ['Mama Njeri gets an SMS: "Your vet loan is ready, send 500 shillings to claim." What should she do?', 'Not reply and tell someone she trusts', 'Send the money quickly|0', 'Check prices on one site only|1', 'Dial random codes to reply|3'],
      ['Otieno sees a maize price on one website and wants to sell all his maize today. What should he do first?', 'Check the price with another source', 'Sell at once, it must be right|1', 'Send money to the site|0', 'Leave his account open|2'],
      ['Wanjiku checks her account at the cyber café and just closes the window. What is the risk?', 'The next person can use her account', 'None, closing is the same|2', 'Her prices become wrong|1', 'She gets a scam SMS|0'],
      ['Kiprop wants extension advice by USSD and keeps trying random codes. What should he do?', 'Use the official code from the provider', 'Keep trying any code|3', 'Reply to any SMS that offers help|0', 'Stay logged in|2'],
      ['A farmer wants tomorrow\'s weather by SMS. Which plan is right?', 'Use the official service and check it', 'Trust any message that says weather|0', 'Dial random numbers|3', 'Share the account with all|2'],
    ], [
      ['Grace explains how she used a vet advice service. ' + STEP, 'She found the official number on the county website.', 'She sent her question by SMS.', 'Then she sent money to a stranger who said he was the vet.', 'Do not send money to an unknown sender; it may be a scam.', 0],
      ['Hassan explains market prices. ' + STEP, 'He opened a market price app.', 'He found today\'s price for beans.', 'He sold all his beans without checking any other source.', 'Check the price against another source first.', 1],
      ['Mumbi explains using a shared computer. ' + STEP, 'She logged in to the service.', 'She found the information.', 'She closed the window without logging out.', 'Log out on a shared computer.', 2],
      ['Daniel explains reaching a service. ' + STEP, 'He wanted a weather forecast.', 'He did not know the code.', 'He dialled random codes until one worked.', 'Use the official code from the provider or a trusted source.', 3],
      ['Neema explains keeping safe. ' + STEP, 'She keeps her PIN private.', 'She logs out after use.', 'She replies to every SMS that claims to be a bank.', 'Messages claiming to be a service may be scams; check first.', 0],
    ]),
];
