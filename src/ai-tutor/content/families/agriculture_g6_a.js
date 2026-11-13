// ============================================================================
// GRADE 6 AGRICULTURE AND NUTRITION, PART A: CONSERVATION OF RESOURCES (4 skills).
// Soil erosion (types and control), seedbeds that keep moisture, deterrents for wild animals. Written offline from the KICD 2024
// design through the curriculum map (curriculum/agriculture/g6.json). The questions test the knowledge behind the practical
// outcomes; the practical half (building terraces, preparing a seedbed, setting a deterrent) is a task for the teacher (see
// docs/qa/agriculture-g6-non-question-outcomes-2026-11-13.md). Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g6_lib.js';

const ER = 'CONSER.CONTROLLING_SOIL_EROSION.', WT = 'CONSER.CONSERVING_WATER.', WL = 'CONSER.CONSERVING_WILD_ANIMALS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- EROSION_TYPES
  fam('er.ty.name', `${ER}EROSION_TYPES`, 'direct', 1, choose([
    Q('Which erosion washes away a thin layer of soil evenly?', 'Sheet erosion', ['Gully erosion|ER_MIX', 'Splash erosion|ER_MIX', 'Rill erosion|ER_MIX'], 'Sheet erosion removes a thin layer evenly across a field.'),
    Q('Which erosion cuts deep channels in the soil?', 'Gully erosion', ['Sheet erosion|ER_MIX', 'Splash erosion|ER_MIX', 'Rill erosion|ER_MIX'], 'Gully erosion cuts deep channels. It is the most harmful kind.'),
    Q('Which erosion happens when raindrops knock the soil loose?', 'Splash erosion', ['Gully erosion|ER_MIX', 'Sheet erosion|ER_MIX', 'Rill erosion|ER_MIX'], 'Raindrops hit bare soil and splash it loose.'),
    Q('Which erosion makes many small channels in the soil?', 'Rill erosion', ['Gully erosion|ER_GULLY', 'Splash erosion|ER_MIX', 'Sheet erosion|ER_MIX'], 'Rills are small channels. A gully is a deep channel.'),
    Q('What is gully erosion?', 'Deep channels cut in the soil by running water', ['A thin layer of soil washed away evenly|ER_GULLY', 'Soil knocked loose by raindrops|ER_MIX', 'Soil blown away by the wind|ER_MIX'], 'A gully is a deep channel cut by running water.'),
  ], { h: ['Think of what each one looks like: thin sheet, small channel, deep channel.', 'Splash is from raindrops.'], s1: 'Match the name to what you can see on the land.' })),
  fam('er.ty.cause', `${ER}EROSION_TYPES`, 'why', 2, choose([
    Q('Which action causes soil erosion?', 'Cutting down the trees on a slope', ['Planting grass on the slope|ER_CAUSE', 'Mulching the garden beds|ER_CAUSE', 'Making terraces on the slope|ER_CAUSE'], 'Without trees the soil is bare and the rain washes it away.'),
    Q('Why does heavy rain on bare ground cause erosion?', 'Nothing holds the soil, so the water carries it away', ['The rain makes the soil heavier so it sinks|ER_CAUSE', 'The sun dries the soil first|ER_CAUSE', 'The soil is happy to move|ER_CAUSE'], 'Roots and plants hold the soil. Bare soil is washed away.'),
    Q('Wanjiru sees a deep channel growing across a field after each rain. Which erosion is it?', 'Gully erosion', ['Sheet erosion|ER_GULLY', 'Splash erosion|ER_MIX', 'Wind erosion|ER_MIX'], 'A deep channel that grows with each rain is a gully.'),
    Q('Otieno\'s goats eat all the grass on a hillside. What is likely to happen?', 'The soil will be washed away when it rains', ['The grass will grow back at once|ER_CAUSE', 'The soil will become richer|ER_CAUSE', 'Nothing will change|ER_CAUSE'], 'Overgrazing leaves the soil bare.'),
    Q('Which farm practice makes erosion worse on a steep slope?', 'Ploughing up and down the slope', ['Ploughing across the slope|ER_CAUSE', 'Planting cover crops|ER_CAUSE', 'Making grass strips|ER_CAUSE'], 'Furrows up and down let the water run fast.'),
  ], { h: ['Bare soil and fast water cause erosion.', 'Plants hold the soil.'], s1: 'Think about what holds the soil and what makes the water run fast.' })),
  fam('er.ty.spot', `${ER}EROSION_TYPES`, 'spot', 3, spot([
    S('Achieng explains the types of erosion.', ['Splash erosion starts when raindrops hit bare soil.', 'Sheet erosion removes a thin layer.', '!Gully erosion is a thin layer washed away evenly.'], 'A gully is a deep channel. A thin even layer is sheet erosion.', 'ER_GULLY'),
    S('Baraka explains what causes erosion.', ['!Planting grass causes erosion.', 'Cutting trees can cause erosion.', 'Overgrazing can cause erosion.'], 'Planting grass holds the soil. It does not cause erosion.', 'ER_CAUSE'),
    S('Wanjiru explains the names.', ['Rill erosion cuts small channels.', '!Sheet erosion cuts deep channels.', 'Gully erosion cuts deep channels.'], 'Sheet erosion removes a thin layer. Gullies cut deep channels.', 'ER_MIX'),
    S('Kamau explains what to look for.', ['Bare ground can wash away.', 'A gully is the most harmful kind.', '!A gully is the smallest kind.'], 'A gully is the largest and most harmful kind.', 'ER_GULLY'),
    S('Mwende explains erosion on a slope.', ['Rain can wash soil down a slope.', '!Ploughing up and down helps the soil stay.', 'Bare slopes erode fastest.'], 'Ploughing up and down lets water run fast and carry soil away.', 'ER_CAUSE'),
  ], { h: ['Check each step against what each type looks like.', 'A gully is a deep channel.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- EROSION_CONTROL
  fam('er.ct.pick', `${ER}EROSION_CONTROL`, 'direct', 1, choose([
    Q('How should a slope be ploughed to control erosion?', 'Across the slope, along the contour', ['Up and down the slope|EC_DOWNHILL', 'In circles around the field|EC_DOWNHILL', 'In any direction|EC_DOWNHILL'], 'Rows across the slope hold the water back.'),
    Q('Which action helps control erosion?', 'Planting grass and trees on the slope', ['Clearing all the plants from the slope|EC_BARE', 'Leaving the ground bare|EC_BARE', 'Burning the slope every year|EC_BARE'], 'Plants and roots hold the soil.'),
    Q('What are terraces?', 'Steps cut across a slope that hold water and soil', ['Walls built along a river to keep the water in|EC_BARE', 'Holes dug in rows for planting young trees|EC_BARE', 'Roads cut into a hillside for the buses|EC_BARE'], 'Terraces slow the water and hold soil on a slope.'),
    Q('How does a cover crop protect the soil?', 'Its leaves and roots cover and hold the soil', ['It makes the soil hotter and the water run faster|EC_BARE', 'It makes the rain fall heavier on the field|EC_BARE', 'It removes the soil from the field each year|EC_BARE'], 'Cover crops shield the soil from rain and hold it with roots.'),
    Q('Which is a way to close a small gully?', 'Pack stones across it and plant grass', ['Dig it deeper|EC_BARE', 'Leave it so it grows|EC_BARE', 'Pour water into it|EC_BARE'], 'Stones slow the water and grass holds the soil.'),
  ], { h: ['Slow the water and hold the soil.', 'Plough across the slope and keep the ground covered.'], s1: 'Think about what slows the water.' })),
  fam('er.ct.why', `${ER}EROSION_CONTROL`, 'why', 2, choose([
    Q('Why do terraces control erosion?', 'They slow the running water so the soil stays', ['They make the rain stop falling on the slope|EC_DOWNHILL', 'They make the slope steeper so water flows|EC_DOWNHILL', 'They carry the soil away faster to the river|EC_DOWNHILL'], 'Terraces slow the water on a slope.'),
    Q('Achieng\'s father plants Napier grass strips across a slope. What does this do?', 'Slows the water and traps soil', ['Makes the soil wash faster|EC_DOWNHILL', 'Takes away the topsoil|EC_BARE', 'Burns the soil|EC_BARE'], 'Grass strips trap soil and slow the water.'),
    Q('Otieno wants to stop a bare slope from washing away. What should he do first?', 'Cover the soil with plants or mulch', ['Leave it bare so it dries|EC_BARE', 'Plough it up and down|EC_DOWNHILL', 'Let goats graze it|EC_GRAZE'], 'Covering the soil protects it from rain.'),
    Q('How does overgrazing affect the soil?', 'It leaves the ground bare so it washes away', ['It protects the soil because animals leave manure|EC_GRAZE', 'It makes the soil stronger and harder to wash|EC_GRAZE', 'It has no effect on the soil at all|EC_GRAZE'], 'Animals eat the cover and leave bare soil.'),
    Q('Which action makes erosion worse?', 'Ploughing up and down a steep slope', ['Planting cover crops|EC_DOWNHILL', 'Making terraces|EC_DOWNHILL', 'Planting trees|EC_DOWNHILL'], 'Furrows up and down let water run fast.'),
  ], { h: ['Controls work by slowing the water or holding the soil.', 'Bare ground and rows downhill make it worse.'], s1: 'Ask how the action changes the water.' })),
  fam('er.ct.spot', `${ER}EROSION_CONTROL`, 'spot', 3, spot([
    S('Baraka plans to stop erosion on his slope.', ['He will plant grass strips.', '!He will plough up and down the slope.', 'He will make terraces.'], 'Ploughing up and down makes erosion worse. Plough across the slope.', 'EC_DOWNHILL'),
    S('Wanjiru plans to stop erosion on her slope.', ['She will plant trees.', 'She will mulch the beds.', '!She will clear all the plants first.'], 'Plants hold the soil, so she should not clear them.', 'EC_BARE'),
    S('Kamau plans to protect his hillside.', ['He will fence off the slope.', '!He will let the goats eat all the grass.', 'He will plant cover crops.'], 'Overgrazing leaves the soil bare.', 'EC_GRAZE'),
    S('Mwende explains terraces.', ['A terrace is a step across a slope.', 'It slows the water.', '!It makes the water run faster.'], 'A terrace slows the water so the soil stays.', 'EC_DOWNHILL'),
    S('Nekesa plans to close a gully.', ['She will pack stones across it.', '!She will leave it bare.', 'She will plant grass beside it.'], 'A bare gully grows. Stones and grass slow the water.', 'EC_BARE'),
  ], { h: ['Check each step: does it slow the water or hold the soil?', 'Cover the soil and plough across the slope.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SEEDBEDS
  fam('wt.sb.pick', `${WT}SEEDBEDS`, 'direct', 1, choose([
    Q('Which seedbed keeps moisture best in a dry place?', 'A sunken bed', ['A raised bed|SB_RAISED_DRY', 'A bed on a hill top|SB_RAISED_DRY', 'A bed with no soil|SB_RAISED_DRY'], 'A sunken bed holds water in a dry place.'),
    Q('Which seedbed suits a very wet place?', 'A raised bed', ['A sunken bed|SB_WET', 'A bed in a hollow|SB_WET', 'A bed under a gutter|SB_WET'], 'A raised bed drains and does not flood.'),
    Q('What does mulch do on a seedbed?', 'It keeps the soil moist and cool', ['Nothing, it only looks tidy|SB_BARE', 'It makes the soil dry out|SB_BARE', 'It takes the water from the seeds|SB_BARE'], 'Mulch shades the soil so less water evaporates.'),
    Q('Which material is good as mulch?', 'Dry grass or dry leaves', ['Plastic bags that block air|SB_BARE', 'Stones with nothing under them|SB_BARE', 'Wet mud|SB_BARE'], 'Dry grass and leaves shade the soil and let it breathe.'),
    Q('Why does a raised bed dry out quickly?', 'Water drains away and the sun dries the sides', ['It has no soil|SB_RAISED_DRY', 'It is too deep|SB_RAISED_DRY', 'It is under shade|SB_RAISED_DRY'], 'Raised beds drain and dry faster than sunken beds.'),
  ], { h: ['Dry place: keep water in. Wet place: let it drain.', 'Mulch shades the soil.'], s1: 'Think about water staying or draining.' })),
  fam('wt.sb.place', `${WT}SEEDBEDS`, 'word', 2, choose([
    Q('Achieng lives where it rarely rains. Which bed should she make?', 'A sunken bed with mulch', ['A raised bed with no mulch|SB_RAISED_DRY', 'A raised bed on the ridge|SB_RAISED_DRY', 'A flat bed in the sun with no cover|SB_BARE'], 'A sunken bed with mulch keeps the moisture.'),
    Q('Otieno lives where it rains every day and water stands on the land. Which bed should he make?', 'A raised bed', ['A sunken bed|SB_WET', 'A sunken bed in a hollow|SB_WET', 'A bed with no drainage|SB_WET'], 'A raised bed drains away extra water.'),
    Q('Wanjiru sows seeds and leaves the bed bare in the hot sun. What may happen?', 'The soil dries and the seeds may not grow', ['The seeds grow faster|SB_BARE', 'Nothing will change|SB_BARE', 'The seeds will be washed up|SB_BARE'], 'Bare soil loses water fast.'),
    Q('What should she do after sowing to keep the soil moist?', 'Cover the bed with mulch and water it', ['Leave it uncovered|SB_BARE', 'Dig it up again|SB_BARE', 'Put stones on the seeds|SB_BARE'], 'Mulch keeps the water in.'),
    Q('Which bed holds the most water?', 'A sunken bed', ['A raised bed|SB_RAISED_DRY', 'A bed on a rock|SB_RAISED_DRY', 'A bed with sand only|SB_RAISED_DRY'], 'A sunken bed collects and holds water.'),
  ], { h: ['Match the bed to the place: dry or wet.', 'Mulch always helps keep moisture.'], s1: 'Think about the rain in the place.' })),
  fam('wt.sb.spot', `${WT}SEEDBEDS`, 'spot', 3, spot([
    S('Baraka plans a seedbed in a dry place.', ['He will make a sunken bed.', '!He will make a raised bed to keep water.', 'He will put mulch on top.'], 'A raised bed dries out. Use a sunken bed in a dry place.', 'SB_RAISED_DRY'),
    S('Wanjiru plans a seedbed in a very wet place.', ['!She will make a sunken bed so water gathers.', 'She will make a raised bed.', 'She will let the water drain.'], 'A sunken bed would flood. Use a raised bed.', 'SB_WET'),
    S('Kamau explains mulch.', ['Mulch is dry grass on the bed.', '!Mulch makes the soil dry out.', 'Mulch keeps the soil cool.'], 'Mulch keeps the soil moist.', 'SB_BARE'),
    S('Mwende plans her seedbed.', ['She will sow the seeds.', '!She will leave the soil bare.', 'She will water gently.'], 'She should cover the bed with mulch.', 'SB_BARE'),
    S('Nekesa explains the beds.', ['A sunken bed holds water.', '!A raised bed holds the most water.', 'A raised bed drains well.'], 'A sunken bed holds more water than a raised bed.', 'SB_RAISED_DRY'),
  ], { h: ['Check each step against the place and the water.', 'Sunken for dry, raised for wet, mulch for both.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- DETERRENTS
  fam('wl.dt.pick', `${WL}DETERRENTS`, 'direct', 1, choose([
    Q('Which deterrent keeps birds off the crops?', 'A scarecrow or shiny strips', ['A beehive fence|DT_WRONG', 'A deep trench|DT_WRONG', 'A thorn fence|DT_WRONG'], 'Scarecrows and shiny strips scare birds.'),
    Q('Which deterrent keeps elephants away from a farm?', 'A beehive fence', ['A scarecrow|DT_WRONG', 'A fishing net|DT_WRONG', 'A bell on a cow|DT_WRONG'], 'Elephants avoid bees, so a beehive fence keeps them away.'),
    Q('Which is a safe deterrent?', 'Noise from a tin or a guard dog', ['A snare set along the path|DT_SNARE', 'Poison in the crop|DT_KILL', 'A trap in the field|DT_SNARE'], 'A deterrent keeps animals away without hurting them.'),
    Q('What should a farmer do about wild animals that raid his crops?', 'Use a deterrent to keep them away', ['Poison them with chemicals in the field|DT_KILL', 'Kill them all before they reach the farm|DT_KILL', 'Trap them in the field with strong wire|DT_SNARE'], 'Wild animals are conserved, so they are kept away.'),
    Q('What does a thorn or live fence do?', 'Keeps animals out of the farm', ['Calls the animals in|DT_WRONG', 'Feeds the animals|DT_WRONG', 'Gives them shade|DT_WRONG'], 'A thorn or live fence keeps animals out.'),
  ], { h: ['Match the deterrent to the animal.', 'A deterrent keeps animals away and does not harm them.'], s1: 'Think about what the animal fears.' })),
  fam('wl.dt.why', `${WL}DETERRENTS`, 'why', 2, choose([
    Q('Why are wild animals not killed when they raid crops?', 'Wild animals are protected and part of our heritage', ['They are not important|DT_KILL', 'They are too many to kill|DT_KILL', 'It is cheaper to leave them|DT_KILL'], 'Wild animals are conserved.'),
    Q('Achieng\'s family loses maize to monkeys. Which deterrent could they try?', 'Noise makers and a guard to scare them off', ['Poison on the maize at the edge of the field|DT_KILL', 'A snare on the path the animals use|DT_SNARE', 'Leaving the maize unguarded at night and day|DT_WRONG'], 'Noise and watching scare monkeys without harming them.'),
    Q('A farmer uses chilli on a rope fence. What is it for?', 'To keep elephants away', ['To feed the elephants|DT_WRONG', 'To attract birds|DT_WRONG', 'To water the plants|DT_WRONG'], 'Elephants dislike the smell of chilli.'),
    Q('Which choice protects both the crop and the animal?', 'A beehive fence', ['A snare|DT_SNARE', 'Poison|DT_KILL', 'A trap with a spear|DT_SNARE'], 'A beehive fence keeps elephants away without harm.'),
    Q('Otieno finds a snare near the farm. What should he do?', 'Tell an adult and not set snares', ['Set more snares|DT_SNARE', 'Leave it in place|DT_SNARE', 'Use it to catch animals|DT_SNARE'], 'Snares harm animals, so they are not used.'),
  ], { h: ['A deterrent keeps animals away without harm.', 'Wild animals are conserved.'], s1: 'Think about conservation.' })),
  fam('wl.dt.spot', `${WL}DETERRENTS`, 'spot', 3, spot([
    S('Baraka plans to protect the crops from birds.', ['He will put a scarecrow in the field.', '!He will set poison for them.', 'He will hang shiny strips.'], 'Wild animals are not poisoned. Use a scarecrow or shiny strips.', 'DT_KILL'),
    S('Wanjiru plans to keep elephants away.', ['She will build a beehive fence.', '!She will use a scarecrow.', 'She will use chilli.'], 'A scarecrow does not keep elephants away. Use a beehive fence or chilli.', 'DT_WRONG'),
    S('Kamau explains deterrents.', ['A deterrent keeps animals away.', '!A snare is a deterrent.', 'Noise can be a deterrent.'], 'A snare traps and harms. It is not a deterrent.', 'DT_SNARE'),
    S('Mwende explains conservation.', ['Wild animals are conserved.', '!We kill the animals that raid crops.', 'We keep them away from crops.'], 'Wild animals are not killed.', 'DT_KILL'),
    S('Nekesa explains fences.', ['A thorn fence keeps animals out.', 'A live fence is made of plants.', '!A live fence attracts animals to the crops.'], 'A live fence keeps animals out.', 'DT_WRONG'),
  ], { h: ['Check each step: does it keep the animal away without harming it?', 'Match the deterrent to the animal.'], s1: 'Find the step that is not true.' })),
];
