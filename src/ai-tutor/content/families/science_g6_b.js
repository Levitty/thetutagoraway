// ============================================================================
// GRADE 6 SCIENCE AND TECHNOLOGY, MATTER (8 skills): Change of State, Composition of Air.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/science/g6.json). Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, c, sp } from './science_g6_lib.js';

const CS = 'MATTER.CHANGE_OF_STATE.', AR = 'MATTER.COMPOSITION_OF_AIR.';

export const FAMILIES = [
  // ---------------------------------------------------------------- STATE_CHANGE_NAMES
  fam('cs.names.direct', `${CS}STATE_CHANGE_NAMES`, 'direct', 1, choose([
    c('What is it called when ice becomes water?', 'Melting', 'Melting is a solid changing into a liquid when heated.', ['M_SN_MELT_DISSOLVE', 'Dissolving', 'Evaporation'], ['M_SN_CONDENSE_MIXUP', 'Condensation']),
    c('What is it called when water vapour turns into liquid water?', 'Condensation', 'Condensation is a gas turning into a liquid.', ['M_SN_CONDENSE_MIXUP', 'Evaporation', 'Melting'], ['M_SN_EVAP_BOIL', 'Boiling']),
    c('When does water evaporate?', 'At any temperature, faster when warm', 'Evaporation happens from the surface of a liquid all the time.', ['M_SN_EVAP_BOIL', 'Only when it boils', 'Only when it freezes'], ['M_SN_CONDENSE_MIXUP', 'Only when it is cooled in a freezer']),
    c('What is it called when liquid water becomes ice?', 'Freezing', 'Freezing is a liquid changing into a solid.', ['M_SN_MELT_DISSOLVE', 'Melting', 'Dissolving'], ['M_SN_CONDENSE_MIXUP', 'Condensation']),
    c('Why do drops form on the outside of a cold bottle?', 'Water vapour in the air turns to liquid on the cold surface', 'The vapour in the air cools and condenses on the cold bottle.', ['M_SN_CONDENSE_MIXUP', 'Water leaks out through tiny holes in the glass wall', 'The bottle makes water'], ['M_SN_EVAP_BOIL', 'The water in the bottle boils']),
  ], { h: ['Melting: solid to liquid. Freezing: liquid to solid.', 'Evaporation: liquid to gas. Condensation: gas to liquid.'], s1: 'Think of the states before and after the change.' })),
  fam('cs.names.story', `${CS}STATE_CHANGE_NAMES`, 'word', 2, choose([
    c('Wanjiru leaves a piece of candle wax in the sun and it turns to liquid. What change is this?', 'Melting', 'A solid becomes a liquid when heated.', ['M_SN_MELT_DISSOLVE', 'Dissolving', 'Condensation'], ['M_SN_EVAP_BOIL', 'Boiling']),
    c('Wet clothes hang on a line on a windy day and dry. What is the change of state?', 'Evaporation', 'The liquid water becomes water vapour in the air.', ['M_SN_EVAP_BOIL', 'Boiling', 'Freezing'], ['M_SN_CONDENSE_MIXUP', 'Condensation']),
    c('A mirror in the bathroom gets misty after a hot bath. What change of state is this?', 'Condensation', 'Water vapour cools on the cold mirror and turns to liquid.', ['M_SN_CONDENSE_MIXUP', 'Evaporation', 'Melting'], ['M_SN_EVAP_BOIL', 'Boiling']),
    c('Ouma puts water in the freezer to make ice. What is the change?', 'Freezing', 'A liquid changes into a solid.', ['M_SN_MELT_DISSOLVE', 'Melting', 'Dissolving'], ['M_SN_CONDENSE_MIXUP', 'Condensation']),
    c('Atieno says water only evaporates when it boils. What is true?', 'It evaporates slowly at any temperature', 'A puddle dries without boiling.', ['M_SN_EVAP_BOIL', 'She is right', 'It evaporates only in the freezer'], ['M_SN_MELT_DISSOLVE', 'It only dissolves']),
  ], { h: ['Name the state before and after the change.', 'Gas to liquid is condensation.'], s1: 'Decide which change of state is in the story.' })),
  fam('cs.names.spot', `${CS}STATE_CHANGE_NAMES`, 'spot', 3, spot([
    sp('Mark says ice melts and dissolves in the same way. Which step has the mistake?', 'Step 1: Mark puts ice in the sun.', 'Step 2: It turns into water.', 'Step 3: He says melting is the same as dissolving.', 'Melting is a solid becoming a liquid. Dissolving is a solid mixing into a liquid.', 'M_SN_MELT_DISSOLVE'),
    sp('Lina says puddles dry only when they boil. Which step has the mistake?', 'Step 1: Lina sees a puddle after rain.', 'Step 2: The puddle dries by afternoon.', 'Step 3: She says it must have boiled.', 'Water evaporates at any temperature.', 'M_SN_EVAP_BOIL'),
    sp('Sam says the drops on a cold glass come from inside the glass. Which step has the mistake?', 'Step 1: Sam pours a cold drink.', 'Step 2: Drops form on the outside.', 'Step 3: He says the water came through the glass.', 'The drops are condensed water vapour from the air.', 'M_SN_CONDENSE_MIXUP'),
    sp('Rita says sugar in tea melts. Which step has the mistake?', 'Step 1: Rita stirs sugar in hot tea.', 'Step 2: The sugar disappears.', 'Step 3: She says the sugar melted.', 'The sugar dissolved. Melting is a solid becoming a liquid by heat.', 'M_SN_MELT_DISSOLVE'),
    sp('Joe says evaporation is the same as condensation. Which step has the mistake?', 'Step 1: Joe sees steam rise from a pot.', 'Step 2: He sees drops on the lid.', 'Step 3: He says both are the same change.', 'Evaporation is liquid to gas. Condensation is gas to liquid.', 'M_SN_CONDENSE_MIXUP'),
  ], { h: ['Which step mixes up two changes?', 'Melting is not dissolving. Evaporation is not condensation.'], s1: 'Check each step against the names of the changes.' })),

  // ---------------------------------------------------------------- STATE_CHANGE_HEAT
  fam('cs.heat.direct', `${CS}STATE_CHANGE_HEAT`, 'direct', 1, choose([
    c('Why does ice melt in the sun?', 'It takes in heat from its surroundings', 'Ice melts when it gains heat.', ['M_SH_COLD_MELTS', 'It takes in cold from the warm air', 'It gives out heat'], ['M_SH_FREEZE_HEAT', 'It is being frozen']),
    c('What must happen to water for it to freeze?', 'Heat must be taken away from it', 'A freezer takes heat away.', ['M_SH_FREEZE_HEAT', 'It must be heated', 'It must be boiled for a long time first'], ['M_SH_COLD_MELTS', 'It must take in cold']),
    c('What do we see above a boiling pot?', 'Tiny drops of liquid water, because steam itself cannot be seen', 'Steam is invisible. The white cloud is tiny drops.', ['M_SH_STEAM_SMOKE', 'Water vapour, which we can see rising above the hot pot', 'Smoke from the water'], ['M_SH_FREEZE_HEAT', 'Ice']),
    c('Which change needs heat to go in?', 'Melting', 'Melting, evaporation and sublimation need heat.', ['M_SH_FREEZE_HEAT', 'Freezing', 'Condensation'], ['M_SH_COLD_MELTS', 'Deposition']),
    c('Which change happens when heat is taken away?', 'Condensation', 'Condensation, freezing and deposition happen when heat is lost.', ['M_SH_FREEZE_HEAT', 'Evaporation', 'Melting'], ['M_SH_COLD_MELTS', 'Sublimation']),
  ], { h: ['Heat in: melting, evaporation, sublimation.', 'Heat out: freezing, condensation, deposition.'], s1: 'Decide if the substance is heated or cooled.' })),
  fam('cs.heat.story', `${CS}STATE_CHANGE_HEAT`, 'word', 2, choose([
    c('Aisha holds an ice cube in her hand and it melts. Which way does the heat go?', 'From her hand into the ice', 'Ice gains heat from the warm hand.', ['M_SH_COLD_MELTS', 'The cold goes from the ice into her hand', 'Heat goes from the ice to her hand'], ['M_SH_FREEZE_HEAT', 'Heat is taken from the ice']),
    c('Wambui puts a cup of water in the freezer. What does the freezer do?', 'Takes heat away from the water', 'Taking heat away makes the water freeze.', ['M_SH_FREEZE_HEAT', 'Adds heat to the water', 'Adds cold to the water'], ['M_SH_COLD_MELTS', 'Pushes cold into the water']),
    c('Ken says the white cloud over a boiling kettle is the gas called steam. What is true?', 'Steam is invisible; the cloud is tiny drops of water', 'The vapour cools in the air and forms tiny drops.', ['M_SH_STEAM_SMOKE', 'He is right', 'The cloud is smoke'], ['M_SH_FREEZE_HEAT', 'The cloud is made of tiny pieces of ice and smoke']),
    c('Fatuma heats wax in a pot and it turns to liquid. What happened to the wax?', 'It took in heat and melted', 'Melting needs heat.', ['M_SH_FREEZE_HEAT', 'It lost heat and froze', 'It lost heat and melted'], ['M_SH_COLD_MELTS', 'It took in cold']),
    c('A glass of cold juice gets drops on the outside. What happens to the water vapour near the glass?', 'It loses heat and condenses', 'Condensation happens when heat is lost.', ['M_SH_FREEZE_HEAT', 'It gains heat and condenses', 'It gains heat and freezes'], ['M_SH_COLD_MELTS', 'It takes in cold']),
  ], { h: ['Is the substance heated or cooled?', 'Cold is the lack of heat.'], s1: 'Decide the direction of heat in the story.' })),
  fam('cs.heat.spot', `${CS}STATE_CHANGE_HEAT`, 'spot', 3, spot([
    sp('Neema says ice melts because it takes in cold. Which step has the mistake?', 'Step 1: Neema leaves ice in the sun.', 'Step 2: The ice melts.', 'Step 3: She says it took in cold from the air.', 'Ice melts because it gains heat.', 'M_SH_COLD_MELTS'),
    sp('Paul says water freezes when it is heated. Which step has the mistake?', 'Step 1: Paul puts water in the freezer.', 'Step 2: It turns to ice.', 'Step 3: He says the freezer added heat.', 'The freezer takes heat away.', 'M_SH_FREEZE_HEAT'),
    sp('Maria says we can see steam above a pot. Which step has the mistake?', 'Step 1: Maria boils water.', 'Step 2: She sees a white cloud.', 'Step 3: She says the cloud is steam, the gas itself.', 'Steam is invisible. The cloud is tiny drops of water.', 'M_SH_STEAM_SMOKE'),
    sp('Tony says melting happens when heat leaves a solid. Which step has the mistake?', 'Step 1: Tony watches wax melt.', 'Step 2: He sees the wax become liquid.', 'Step 3: He says heat left the wax.', 'Heat goes into the wax.', 'M_SH_FREEZE_HEAT'),
    sp('Gift says ice has cold in it that moves into the water. Which step has the mistake?', 'Step 1: Gift drops ice in a drink.', 'Step 2: The drink becomes cooler.', 'Step 3: She says cold moved from the ice into the drink.', 'Heat moves from the drink into the ice.', 'M_SH_COLD_MELTS'),
  ], { h: ['Which step has the heat going the wrong way?', 'Heat goes in to melt and out to freeze.'], s1: 'Check each step for the direction of heat.' })),

  // ---------------------------------------------------------------- STATE_APPLICATIONS
  fam('cs.app.direct', `${CS}STATE_APPLICATIONS`, 'direct', 1, choose([
    c('What happens to the water when wet clothes dry on a line?', 'It evaporates into the air', 'The water changes into vapour.', ['M_SA_CLOTHES_SOAK', 'It soaks into the rope', 'It freezes in the clothes'], ['M_SA_CLOUD_SMOKE', 'It becomes a cloud at once']),
    c('How do clouds form?', 'Water vapour cools and condenses into tiny drops', 'Clouds are tiny drops of water in the air.', ['M_SA_CLOUD_SMOKE', 'Smoke from fires gathers high up in the sky', 'Cotton wool rises'], ['M_SA_SALT_SEA', 'Salt melts in the sky']),
    c('How do salt pans make salt from sea water?', 'The sun makes the water evaporate and the salt stays', 'Evaporation leaves the salt behind.', ['M_SA_SALT_SEA', 'The sun freezes the water and the salt is left', 'The sun melts the salt'], ['M_SA_CLOUD_SMOKE', 'Clouds drop the salt']),
    c('Which change of state is used to make ice blocks?', 'Freezing', 'Water freezes when heat is removed.', ['M_SA_CLOUD_SMOKE', 'Evaporation', 'Condensation'], ['M_SA_CLOTHES_SOAK', 'Soaking']),
    c('Which change of state makes candle wax into a liquid that can be moulded?', 'Melting', 'Heat makes wax melt.', ['M_SA_CLOTHES_SOAK', 'Evaporation', 'Freezing'], ['M_SA_SALT_SEA', 'Condensation']),
  ], { h: ['Think: is a liquid becoming a gas, a gas a liquid, a liquid a solid?', 'Evaporation dries things.'], s1: 'Decide which change of state is at work.' })),
  fam('cs.app.story', `${CS}STATE_APPLICATIONS`, 'word', 2, choose([
    c('At Lake Magadi people leave sea-like water in shallow pans in the sun, and white salt is left. Which change happened to the water?', 'It evaporated', 'Water evaporates in the sun and salt stays.', ['M_SA_SALT_SEA', 'It froze', 'It melted'], ['M_SA_CLOUD_SMOKE', 'It condensed into a cloud']),
    c('Mama Njeri spreads maize on a mat in the sun to dry it. What is the water doing?', 'Evaporating into the air', 'The sun makes the water in the maize evaporate.', ['M_SA_CLOTHES_SOAK', 'Soaking into the mat', 'Freezing in the maize'], ['M_SA_CLOUD_SMOKE', 'Turning into smoke']),
    c('Early morning dew forms on grass. Where did the water come from?', 'Water vapour in the air that condensed on the cold grass', 'Vapour cools and turns to liquid.', ['M_SA_CLOUD_SMOKE', 'Smoke from the night fires', 'Water from the soil melting'], ['M_SA_CLOTHES_SOAK', 'Water that soaked out of the soil into the grass blades']),
    c('A jeweller pours melted gold into a mould to make a ring. Which change of state does the gold go through as it cools?', 'Freezing, liquid to solid', 'A liquid becomes solid when it loses heat.', ['M_SA_CLOTHES_SOAK', 'Evaporation', 'Condensation'], ['M_SA_SALT_SEA', 'Melting']),
    c('Atieno says clouds are made of smoke. What is true?', 'Clouds are tiny drops of water', 'Water vapour condenses into drops.', ['M_SA_CLOUD_SMOKE', 'She is right', 'Clouds are balls of cotton'], ['M_SA_SALT_SEA', 'Clouds are made of salt']),
  ], { h: ['Which way is the state changing?', 'Evaporation dries; condensation forms drops.'], s1: 'Decide which change of state the story uses.' })),
  fam('cs.app.spot', `${CS}STATE_APPLICATIONS`, 'spot', 3, spot([
    sp('Dan says clothes dry because the water soaks into the rope. Which step has the mistake?', 'Step 1: Dan hangs a wet shirt.', 'Step 2: It is dry by noon.', 'Step 3: He says the rope took the water.', 'The water evaporated into the air.', 'M_SA_CLOTHES_SOAK'),
    sp('Hope says clouds are made of smoke. Which step has the mistake?', 'Step 1: Hope looks at clouds.', 'Step 2: They look grey.', 'Step 3: She says they are smoke from fires.', 'Clouds are tiny drops of water from condensed vapour.', 'M_SA_CLOUD_SMOKE'),
    sp('Luke says salt is made when the sun freezes sea water. Which step has the mistake?', 'Step 1: Luke visits a salt pan.', 'Step 2: He sees white salt.', 'Step 3: He says the sun froze the water.', 'The sun made the water evaporate and the salt stayed.', 'M_SA_SALT_SEA'),
    sp('Eve says wet maize dries because water goes into the mat. Which step has the mistake?', 'Step 1: Eve dries maize on a mat.', 'Step 2: The maize becomes dry.', 'Step 3: She says the mat took the water.', 'The water evaporated.', 'M_SA_CLOTHES_SOAK'),
    sp('Ben says clouds are made of cotton. Which step has the mistake?', 'Step 1: Ben sees white clouds.', 'Step 2: They look soft.', 'Step 3: He says they are cotton.', 'Clouds are tiny drops of water.', 'M_SA_CLOUD_SMOKE'),
  ], { h: ['Which step does not match the change of state?', 'Evaporation dries things.'], s1: 'Check each step against the changes of state.' })),

  // ---------------------------------------------------------------- AIR_COMPONENTS
  fam('ar.comp.direct', `${AR}AIR_COMPONENTS`, 'direct', 1, choose([
    c('Which gas is the biggest part of air?', 'Nitrogen', 'About four fifths of air is nitrogen.', ['M_AC_MOSTLY_OXYGEN', 'Oxygen', 'Carbon dioxide'], ['M_AC_ONE_GAS', 'Hydrogen']),
    c('What is air?', 'A mixture of gases', 'Air is nitrogen, oxygen and other gases.', ['M_AC_ONE_GAS', 'A single gas', 'Nothing at all'], ['M_AC_MOSTLY_OXYGEN', 'Only oxygen']),
    c('About how much of the air is oxygen?', 'About one fifth', 'Oxygen is about one fifth of the air.', ['M_AC_MOSTLY_OXYGEN', 'About four fifths', 'All of it'], ['M_AC_ONE_GAS', 'None']),
    c('A candle burns in a closed jar over water and goes out. The water rises about one fifth of the jar. What does this show?', 'The candle used the oxygen, about one fifth of the air', 'Oxygen is about one fifth of air.', ['M_AC_CANDLE_ALL', 'The candle used up all the air that was in the jar', 'The candle made water'], ['M_AC_MOSTLY_OXYGEN', 'Air is mostly oxygen']),
    c('Which gas is present in air in only a very small amount?', 'Carbon dioxide', 'There is very little carbon dioxide.', ['M_AC_MOSTLY_OXYGEN', 'Nitrogen', 'Oxygen'], ['M_AC_ONE_GAS', 'All gases are in equal amounts']),
  ], { h: ['Air is a mixture. Nitrogen is the most.', 'Oxygen is about one fifth.'], s1: 'Think of the gases in air.' })),
  fam('ar.comp.story', `${AR}AIR_COMPONENTS`, 'word', 2, choose([
    c('A table shows: nitrogen 78, oxygen 21, other gases 1. Which gas is the biggest part of air?', 'Nitrogen', 'Nitrogen is 78 parts in every 100.', ['M_AC_MOSTLY_OXYGEN', 'Oxygen', 'Other gases'], ['M_AC_ONE_GAS', 'All the same']),
    c('Njoki says air is only oxygen because we breathe it. What is true?', 'Air is a mixture of gases, mostly nitrogen', 'Air has several gases.', ['M_AC_ONE_GAS', 'She is right', 'Air is made only of the gas carbon dioxide'], ['M_AC_MOSTLY_OXYGEN', 'Air is mostly oxygen']),
    c('A burning candle goes out in a closed jar. Why does it go out?', 'It used up the oxygen', 'Burning needs oxygen. The air that is left cannot keep it burning.', ['M_AC_CANDLE_ALL', 'It used up all the air', 'The jar is too small for the air'], ['M_AC_MOSTLY_OXYGEN', 'There was too much oxygen']),
    c('A pie chart shows the make-up of air. The biggest slice is about four fifths. Which gas is it?', 'Nitrogen', 'Nitrogen is the biggest part.', ['M_AC_MOSTLY_OXYGEN', 'Oxygen', 'Carbon dioxide'], ['M_AC_ONE_GAS', 'Air']),
    c('Which of these is NOT a part of air?', 'Chlorine', 'Air has nitrogen, oxygen, carbon dioxide, water vapour and rare gases.', ['M_AC_ONE_GAS', 'Oxygen', 'Carbon dioxide'], ['M_AC_MOSTLY_OXYGEN', 'Nitrogen']),
  ], { h: ['Nitrogen is about four fifths and oxygen about one fifth.', 'Air is a mixture.'], s1: 'Read the amounts and name the biggest gas.' })),
  fam('ar.comp.spot', `${AR}AIR_COMPONENTS`, 'spot', 3, spot([
    sp('Kofi says air is mostly oxygen. Which step has the mistake?', 'Step 1: Kofi breathes in air.', 'Step 2: He learns oxygen keeps him alive.', 'Step 3: He says air is mostly oxygen.', 'Air is mostly nitrogen. Oxygen is about one fifth.', 'M_AC_MOSTLY_OXYGEN'),
    sp('Ada says air is one gas. Which step has the mistake?', 'Step 1: Ada blows up a balloon.', 'Step 2: The balloon is full of air.', 'Step 3: She says air is just one gas.', 'Air is a mixture of gases.', 'M_AC_ONE_GAS'),
    sp('Yusuf says the candle used up all the air. Which step has the mistake?', 'Step 1: Yusuf lights a candle in a jar.', 'Step 2: The water rises a little.', 'Step 3: He says all the air was used.', 'Only the oxygen was used, about one fifth.', 'M_AC_CANDLE_ALL'),
    sp('Beth says nitrogen is a small part of air. Which step has the mistake?', 'Step 1: Beth looks at a pie chart of air.', 'Step 2: She sees a big slice labelled nitrogen.', 'Step 3: She says it is a small part.', 'Nitrogen is the biggest part of air.', 'M_AC_MOSTLY_OXYGEN'),
    sp('Carl says air is empty. Which step has the mistake?', 'Step 1: Carl waves his hand.', 'Step 2: He feels no weight.', 'Step 3: He says air is nothing.', 'Air is a mixture of gases that takes up space.', 'M_AC_ONE_GAS'),
  ], { h: ['Which step does not match what air is?', 'Nitrogen about four fifths, oxygen one fifth.'], s1: 'Check each step against the make-up of air.' })),

  // ---------------------------------------------------------------- AIR_USES
  fam('ar.uses.direct', `${AR}AIR_USES`, 'direct', 1, choose([
    c('What do green plants use carbon dioxide for?', 'To make their food using sunlight', 'Plants use carbon dioxide to make food.', ['M_AU_CO2_ONLY_OUT', 'Nothing, it is only a waste gas', 'To breathe in'], ['M_AU_N_USELESS', 'To make nitrogen']),
    c('Why does a fire need air?', 'Oxygen helps the fuel to burn', 'The fuel burns; oxygen is needed.', ['M_AU_OXYGEN_FUEL', 'Oxygen is the fuel that burns', 'Air is the fuel'], ['M_AU_CO2_ONLY_OUT', 'Carbon dioxide helps it burn']),
    c('Why is nitrogen important to plants?', 'It is changed in the soil into plant food', 'Plants need nitrogen compounds to grow.', ['M_AU_N_USELESS', 'It is not important', 'It is only used by animals, not by plants'], ['M_AU_CO2_ONLY_OUT', 'It is a waste gas']),
    c('Which gas do living things use for breathing?', 'Oxygen', 'Oxygen is used in breathing.', ['M_AU_N_USELESS', 'Nitrogen', 'Water vapour'], ['M_AU_CO2_ONLY_OUT', 'Carbon dioxide']),
    c('Which gas helps to form clouds and rain?', 'Water vapour', 'Water vapour condenses into clouds.', ['M_AU_N_USELESS', 'Nitrogen', 'Oxygen'], ['M_AU_OXYGEN_FUEL', 'Oxygen']),
  ], { h: ['Oxygen: breathing and burning.', 'Carbon dioxide: plants make food. Nitrogen: plant food.'], s1: 'Match the gas with its use.' })),
  fam('ar.uses.story', `${AR}AIR_USES`, 'word', 2, choose([
    c('A fire extinguisher sprays a gas that stops a fire. Which gas is it?', 'Carbon dioxide', 'Carbon dioxide does not help burning, so it puts out fires.', ['M_AU_OXYGEN_FUEL', 'Oxygen', 'Hot air'], ['M_AU_N_USELESS', 'Nitrogen']),
    c('Wanjiku puts a cup over a lit candle and the flame goes out. Why?', 'The oxygen under the cup was used up', 'Burning needs oxygen.', ['M_AU_OXYGEN_FUEL', 'The oxygen burned itself away', 'The cup made the flame cold'], ['M_AU_CO2_ONLY_OUT', 'The carbon dioxide helped it burn']),
    c('A farmer grows beans next to his maize because beans add plant food to the soil. Which gas becomes plant food?', 'Nitrogen', 'Nitrogen from air is changed into plant food.', ['M_AU_N_USELESS', 'Oxygen', 'Carbon dioxide'], ['M_AU_CO2_ONLY_OUT', 'Water vapour']),
    c('Njeri says plants do not need air. What is true?', 'Plants take in carbon dioxide from air to make food', 'Plants need carbon dioxide from the air.', ['M_AU_CO2_ONLY_OUT', 'She is right', 'Plants need only oxygen from the air to live'], ['M_AU_N_USELESS', 'Plants use air to feed on nitrogen only']),
    c('A fizzy drink has gas bubbles. Which gas is added to make it fizzy?', 'Carbon dioxide', 'Carbon dioxide dissolves under pressure.', ['M_AU_CO2_ONLY_OUT', 'Oxygen', 'Nitrogen'], ['M_AU_OXYGEN_FUEL', 'Hydrogen']),
  ], { h: ['Burning needs oxygen but the fuel burns.', 'Plants use carbon dioxide.'], s1: 'Decide which gas does the job in the story.' })),
  fam('ar.uses.spot', `${AR}AIR_USES`, 'spot', 3, spot([
    sp('Ali says plants do not use carbon dioxide. Which step has the mistake?', 'Step 1: Ali knows people breathe out carbon dioxide.', 'Step 2: He sees plants in the garden.', 'Step 3: He says plants have no use for it.', 'Plants use carbon dioxide to make food.', 'M_AU_CO2_ONLY_OUT'),
    sp('Mia says oxygen is the fuel that burns. Which step has the mistake?', 'Step 1: Mia lights a candle.', 'Step 2: The wax slowly gets used up.', 'Step 3: She says oxygen is what burns.', 'Wax is the fuel. Oxygen helps it burn.', 'M_AU_OXYGEN_FUEL'),
    sp('Tim says nitrogen is useless because we cannot breathe it. Which step has the mistake?', 'Step 1: Tim learns air is mostly nitrogen.', 'Step 2: He knows we breathe oxygen.', 'Step 3: He says nitrogen is useless.', 'Nitrogen is turned into plant food in the soil.', 'M_AU_N_USELESS'),
    sp('Rhoda says carbon dioxide is only a waste gas. Which step has the mistake?', 'Step 1: Rhoda breathes out on a cold mirror.', 'Step 2: She learns the breath has carbon dioxide.', 'Step 3: She says it has no use.', 'Plants use carbon dioxide.', 'M_AU_CO2_ONLY_OUT'),
    sp('Vic says the fuel is not needed if there is oxygen. Which step has the mistake?', 'Step 1: Vic puts a candle in a jar of oxygen.', 'Step 2: It burns brightly.', 'Step 3: He says the wax is not needed.', 'The wax is the fuel and it is used up.', 'M_AU_OXYGEN_FUEL'),
  ], { h: ['Which step gives a gas the wrong job?', 'Oxygen helps burning; plants use carbon dioxide.'], s1: 'Check each step against the uses of gases.' })),

  // ---------------------------------------------------------------- AIR_POLLUTANTS
  fam('ar.pol.direct', `${AR}AIR_POLLUTANTS`, 'direct', 1, choose([
    c('Which of these pollutes the air in a home?', 'Smoke from cooking with firewood in a closed room', 'Smoke is an air pollutant.', ['M_AP_ONLY_FACTORY', 'Only factory chimneys', 'Only vehicles'], ['M_AP_ONLY_SMELL', 'Nothing, if the air has no smell it is clean']),
    c('Which statement is true?', 'Some harmful gases have no smell', 'Carbon monoxide has no smell.', ['M_AP_ONLY_SMELL', 'If the air has no smell, it is clean', 'Only smelly air is harmful'], ['M_AP_ONLY_FACTORY', 'Only factories make harmful gases']),
    c('Is dust from a quarry a pollutant?', 'Yes, it harms the lungs and eyes', 'Too much dust pollutes the air.', ['M_AP_DUST_NOT', 'No, dust is part of the soil', 'No, dust is harmless'], ['M_AP_ONLY_FACTORY', 'Only if from a factory']),
    c('Which of these is an air pollutant?', 'Smoke from burning rubbish', 'Burning rubbish gives harmful smoke.', ['M_AP_DUST_NOT', 'Fresh wind', 'Rain'], ['M_AP_ONLY_SMELL', 'The scent of a flower garden']),
    c('Which of these does NOT pollute the air?', 'Trees', 'Trees help to clean the air.', ['M_AP_ONLY_FACTORY', 'Vehicle exhaust', 'Burning tyres'], ['M_AP_DUST_NOT', 'Dust clouds']),
  ], { h: ['Smoke and dust can be pollutants.', 'Not all harmful gases have a smell.'], s1: 'Think about what can make air harmful.' })),
  fam('ar.pol.story', `${AR}AIR_POLLUTANTS`, 'word', 2, choose([
    c('Near the school a man burns a heap of plastic. What is happening?', 'Harmful smoke is polluting the air', 'Burning plastic gives off harmful gases.', ['M_AP_DUST_NOT', 'The rubbish is just disappearing', 'Nothing harmful'], ['M_AP_ONLY_FACTORY', 'Only factories can pollute']),
    c('A lorry carrying stones goes by and a cloud of dust rises. Is this pollution?', 'Yes, dust in the air can harm the lungs', 'Dust is an air pollutant.', ['M_AP_DUST_NOT', 'No, dust is harmless', 'No, dust is natural soil and not a pollutant'], ['M_AP_ONLY_FACTORY', 'Only black smoke is pollution']),
    c('A charcoal jiko burns in a closed room and has no smell. Is the air safe?', 'No, it may have a harmful gas', 'Carbon monoxide has no smell.', ['M_AP_ONLY_SMELL', 'Yes, it has no smell', 'Yes, charcoal is clean'], ['M_AP_ONLY_FACTORY', 'Yes, only factories pollute']),
    c('Onyango says only big factories pollute the air. What is true?', 'Vehicles, burning rubbish and cooking smoke also pollute', 'Many everyday things pollute air.', ['M_AP_ONLY_FACTORY', 'He is right', 'Only power stations and big factories pollute the air'], ['M_AP_ONLY_SMELL', 'Only smelly things pollute']),
    c('Which is the best example of an air pollutant at school?', 'Dust from a dry playground swept by wind', 'Dust can pollute the air.', ['M_AP_DUST_NOT', 'Fresh air from the windows', 'Rain falling'], ['M_AP_ONLY_FACTORY', 'None, because a school has no factories']),
  ], { h: ['Smoke, dust and exhaust gases pollute the air.', 'Clean air can still carry harmful gases.'], s1: 'Decide if the thing in the story pollutes air.' })),
  fam('ar.pol.spot', `${AR}AIR_POLLUTANTS`, 'spot', 3, spot([
    sp('Moses says only factories pollute air. Which step has the mistake?', 'Step 1: Moses sees factory smoke.', 'Step 2: He sees vehicles pass by.', 'Step 3: He says only factories pollute.', 'Vehicles and burning rubbish also pollute the air.', 'M_AP_ONLY_FACTORY'),
    sp('Joy says air without a smell is always clean. Which step has the mistake?', 'Step 1: Joy sniffs the air near a jiko.', 'Step 2: She smells nothing.', 'Step 3: She says it is clean.', 'Some harmful gases have no smell.', 'M_AP_ONLY_SMELL'),
    sp('Sam says dust is not pollution. Which step has the mistake?', 'Step 1: Sam walks on a dusty road.', 'Step 2: He coughs.', 'Step 3: He says dust is not pollution.', 'Too much dust pollutes the air and harms people.', 'M_AP_DUST_NOT'),
    sp('Eve says burning rubbish does no harm to the air. Which step has the mistake?', 'Step 1: Eve sees rubbish burn.', 'Step 2: Smoke rises.', 'Step 3: She says the smoke is harmless.', 'Smoke from burning rubbish is harmful.', 'M_AP_DUST_NOT'),
    sp('Dan says only black smoke is pollution. Which step has the mistake?', 'Step 1: Dan sees black smoke from a lorry.', 'Step 2: He sees no smoke from a jiko.', 'Step 3: He says the jiko cannot pollute.', 'A jiko can give off harmful gases with no colour or smell.', 'M_AP_ONLY_SMELL'),
  ], { h: ['Which step has something not true about air pollution?', 'Many things pollute air, big and small.'], s1: 'Check each step against air pollutants.' })),

  // ---------------------------------------------------------------- AIR_EFFECTS
  fam('ar.eff.direct', `${AR}AIR_EFFECTS`, 'direct', 1, choose([
    c('Where can air pollution go after smoke leaves a chimney?', 'The wind can carry it to places far from the chimney', 'Polluted air moves with the wind.', ['M_AE_ONLY_NEAR', 'It stays next to the chimney where it was made', 'It never moves'], ['M_AE_PLANTS_FINE', 'It stops at the compound']),
    c('What can acid rain do?', 'Harm plants, buildings and water life', 'Acid rain damages many things.', ['M_AE_PLANTS_FINE', 'Nothing, rain is always good', 'Make plants grow better'], ['M_AE_ONLY_NEAR', 'Only harm the people who live nearest']),
    c('What can too much carbon dioxide in the air do?', 'Make the Earth warmer and change the weather', 'It traps heat.', ['M_AE_WARM_GOOD', 'Make the air cleaner', 'Make the Earth colder and cause more snow'], ['M_AE_PLANTS_FINE', 'Make plants stronger']),
    c('What illness can polluted air cause?', 'Coughs and breathing problems', 'Smoke and dust harm the lungs.', ['M_AE_ONLY_NEAR', 'Only bruises and cuts on the skin', 'Nothing'], ['M_AE_PLANTS_FINE', 'Broken bones']),
    c('Which is an effect of air pollution on plants?', 'Leaves can be damaged and plants grow poorly', 'Polluted air harms plants.', ['M_AE_PLANTS_FINE', 'Plants are not harmed by polluted air at all', 'Plants grow faster'], ['M_AE_WARM_GOOD', 'Plants get more water']),
  ], { h: ['Wind carries polluted air far.', 'Pollution harms people, plants and the Earth.'], s1: 'Think about what polluted air does.' })),
  fam('ar.eff.story', `${AR}AIR_EFFECTS`, 'word', 2, choose([
    c('A factory is three kilometres from a school. Wind blows smoke towards the school. What can happen?', 'The learners may cough and their eyes may sting', 'Wind carries smoke far.', ['M_AE_ONLY_NEAR', 'Nothing, the smoke only harms the factory workers', 'Only the factory is harmed'], ['M_AE_PLANTS_FINE', 'The smoke makes the plants grow faster']),
    c('After heavy smoke in the air, rain falls and the leaves of the trees turn brown. What may have happened?', 'Acid rain harmed the leaves', 'Pollution can mix with rain.', ['M_AE_PLANTS_FINE', 'Rain cannot harm leaves', 'The leaves were fed by the smoke'], ['M_AE_ONLY_NEAR', 'Only trees near the smoke are harmed']),
    c('Scientists say the Earth is getting warmer because of too much carbon dioxide. Is this good news?', 'No, it changes rainfall and can bring drought', 'Warming changes the weather.', ['M_AE_WARM_GOOD', 'Yes, because warm weather is always nice', 'Yes, it helps all crops'], ['M_AE_ONLY_NEAR', 'It only matters in one country']),
    c('A child living near a busy road coughs often. What may be the cause?', 'Smoke and dust from vehicles', 'Polluted air harms breathing.', ['M_AE_ONLY_NEAR', 'Only the sun', 'The road itself'], ['M_AE_PLANTS_FINE', 'The plants growing nearby']),
    c('Njeri says air pollution does not harm animals. What is true?', 'Animals can get breathing problems too', 'Animals breathe polluted air.', ['M_AE_PLANTS_FINE', 'She is right', 'Animals are helped'], ['M_AE_ONLY_NEAR', 'Only people are harmed, animals never are']),
  ], { h: ['Pollution harms people, plants and animals.', 'It can travel on the wind.'], s1: 'Decide what the polluted air does in the story.' })),
  fam('ar.eff.spot', `${AR}AIR_EFFECTS`, 'spot', 3, spot([
    sp('Ben says smoke never travels far. Which step has the mistake?', 'Step 1: Ben sees smoke rise from a fire.', 'Step 2: Wind blows it away.', 'Step 3: He says it stays by the fire.', 'Wind carries polluted air far.', 'M_AE_ONLY_NEAR'),
    sp('Lucy says acid rain is good for plants. Which step has the mistake?', 'Step 1: Lucy knows rain helps crops.', 'Step 2: She hears about acid rain.', 'Step 3: She says it is just as good.', 'Acid rain harms plants and soil.', 'M_AE_PLANTS_FINE'),
    sp('Hugo says a warmer Earth is only good. Which step has the mistake?', 'Step 1: Hugo likes warm days.', 'Step 2: He hears the Earth is warming.', 'Step 3: He says it can only bring good.', 'Warming changes rainfall and can cause drought.', 'M_AE_WARM_GOOD'),
    sp('Kim says pollution only harms people near the smoke. Which step has the mistake?', 'Step 1: Kim sees a factory.', 'Step 2: She sees smoke drift.', 'Step 3: She says only nearby people are harmed.', 'The wind carries the smoke far away.', 'M_AE_ONLY_NEAR'),
    sp('Ron says plants are not harmed by smoke. Which step has the mistake?', 'Step 1: Ron looks at leaves near a road.', 'Step 2: They are covered in dust.', 'Step 3: He says the plants are fine.', 'Dust and smoke harm plants.', 'M_AE_PLANTS_FINE'),
  ], { h: ['Which step has something not true about the effects of pollution?', 'Pollution travels and harms many things.'], s1: 'Check each step against the effects of pollution.' })),

  // ---------------------------------------------------------------- AIR_REDUCE
  fam('ar.red.direct', `${AR}AIR_REDUCE`, 'direct', 1, choose([
    c('What is the best way to deal with plastic rubbish?', 'Collect it and take it for recycling or proper disposal', 'Burning plastic makes harmful smoke.', ['M_AR_BURN_RUBBISH', 'Burn it', 'Burn it at night when nobody can see the smoke from it'], ['M_AR_TREES_NOT', 'Leave it under a tree']),
    c('Does a taller factory chimney remove pollution?', 'No, the smoke still enters the air; filters help', 'A tall chimney only moves smoke higher.', ['M_AR_TALL_CHIMNEY', 'Yes, the smoke disappears when it goes higher up', 'Yes, tall chimneys clean smoke'], ['M_AR_BURN_RUBBISH', 'Yes, if rubbish is burnt']),
    c('How do trees help to reduce air pollution?', 'They take in carbon dioxide and trap dust', 'Trees clean the air.', ['M_AR_TREES_NOT', 'They do not help', 'They only give shade and do nothing for air'], ['M_AR_BURN_RUBBISH', 'They burn rubbish']),
    c('Which action cuts smoke in the home?', 'Cooking with a cleaner stove or fuel', 'Cleaner fuel gives less smoke.', ['M_AR_BURN_RUBBISH', 'Burning more wood', 'Burning old tyres'], ['M_AR_TALL_CHIMNEY', 'Building a taller house with a high roof']),
    c('Which way of travelling pollutes the air least?', 'Walking', 'Walking gives no smoke.', ['M_AR_TALL_CHIMNEY', 'Driving alone in an old car', 'Using a smoky lorry'], ['M_AR_TREES_NOT', 'Standing still']),
  ], { h: ['Do not burn rubbish; plant trees; use cleaner fuel.', 'A taller chimney does not remove smoke.'], s1: 'Think about what reduces smoke and dust.' })),
  fam('ar.red.story', `${AR}AIR_REDUCE`, 'word', 2, choose([
    c('The school compound has a heap of dry leaves and paper. Which is the best way to deal with it?', 'Compost the leaves and recycle the paper', 'Burning makes smoke.', ['M_AR_BURN_RUBBISH', 'Burn it all', 'Burn it after school'], ['M_AR_TREES_NOT', 'Leave it near the trees for the wind']),
    c('A factory builds a taller chimney to solve its smoke problem. What is true?', 'The smoke still pollutes; it needs filters or cleaner fuel', 'A tall chimney does not clean smoke.', ['M_AR_TALL_CHIMNEY', 'The problem is solved', 'The smoke is gone'], ['M_AR_BURN_RUBBISH', 'The factory should burn more fuel to clear the smoke']),
    c('The head teacher plants trees around the school. How does this help?', 'The trees take in carbon dioxide and trap dust', 'Trees help to clean the air.', ['M_AR_TREES_NOT', 'It does not help to clean the air at all', 'It only gives shade'], ['M_AR_BURN_RUBBISH', 'The trees burn the dust']),
    c('A family cooks with firewood in a closed room and the smoke makes them cough. What change helps most?', 'Cook in a ventilated place or use a cleaner stove', 'Less smoke means cleaner air.', ['M_AR_BURN_RUBBISH', 'Burn more wood', 'Close all the windows and the door so smoke stays in'], ['M_AR_TALL_CHIMNEY', 'Make a taller house']),
    c('Many learners come to school in separate cars. How could this reduce pollution?', 'Share vehicles or walk', 'Fewer vehicles give less smoke.', ['M_AR_TALL_CHIMNEY', 'Buy bigger cars', 'Drive faster'], ['M_AR_TREES_NOT', 'Cut down trees']),
  ], { h: ['Cut smoke at the source.', 'Trees and cleaner fuels help.'], s1: 'Decide which action reduces pollution.' })),
  fam('ar.red.spot', `${AR}AIR_REDUCE`, 'spot', 3, spot([
    sp('Ian says burning rubbish gets rid of it. Which step has the mistake?', 'Step 1: Ian burns a heap of plastic.', 'Step 2: The heap gets smaller.', 'Step 3: He says the problem is gone.', 'The smoke pollutes the air.', 'M_AR_BURN_RUBBISH'),
    sp('Joy says a taller chimney removes pollution. Which step has the mistake?', 'Step 1: Joy sees a tall chimney.', 'Step 2: She sees the smoke rise high.', 'Step 3: She says the smoke is gone.', 'The smoke is still in the air and wind carries it away.', 'M_AR_TALL_CHIMNEY'),
    sp('Kofi says trees do not help the air. Which step has the mistake?', 'Step 1: Kofi sees trees along a road.', 'Step 2: He wipes a leaf and finds dust.', 'Step 3: He says trees do not help the air.', 'Trees trap dust and take in carbon dioxide.', 'M_AR_TREES_NOT'),
    sp('Lea says burning tyres is a good way to get rid of them. Which step has the mistake?', 'Step 1: Lea has old tyres.', 'Step 2: She lights them.', 'Step 3: She says this is safe for the air.', 'Burning tyres releases harmful smoke.', 'M_AR_BURN_RUBBISH'),
    sp('Max says tall chimneys mean cleaner air. Which step has the mistake?', 'Step 1: Max sees a new factory.', 'Step 2: It has a very tall chimney.', 'Step 3: He says the air will be clean.', 'The smoke only goes higher; filters are needed.', 'M_AR_TALL_CHIMNEY'),
  ], { h: ['Which step has a wrong idea about cutting pollution?', 'Do not burn rubbish; trees help.'], s1: 'Check each step against ways to reduce pollution.' })),
];
