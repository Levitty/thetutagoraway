// ============================================================================
// GRADE 7 PRE-TECHNICAL STUDIES, MATERIALS AND TOOLS (13 skills): Introduction to Materials, Metallic Materials, Non-Metallic Materials,
// Measuring and Marking Out Tools and Computer Hardware. Written offline from the KICD 2024 design through the curriculum map.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off. Natural or
// synthetic is asked only for clear cases (paper, glass, cement and ceramics are left to the teacher).
// ============================================================================
import { fam, choose, spot, c, sp } from './pretechnical_g7_lib.js';

const MI = 'MATERI.INTRODUCTION_TO_MATERIAL.', ME = 'MATERI.METALLIC_MATERIALS.', NM = 'MATERI.NON_METALLIC_MATERIALS.';
const MT = 'TOOLS_.MEASURING_AND_MARKING_OU.', HW = 'TOOLS_.COMPUTER_HARDWARE.';

export const FAMILIES = [
  // ---------------------------------------------------------------- MAT_METAL_NONMETAL
  fam('mi.sort.direct', `${MI}MAT_METAL_NONMETAL`, 'direct', 1, choose([
    c('Which of these is a metal?', 'Copper', 'Copper, steel, aluminium and iron are metals.', ['M_MM_SHINY', 'Glass', 'A shiny plastic bottle'], ['M_MM_HARD_METAL', 'Granite stone']),
    c('Which of these is non-metallic?', 'Wood', 'Wood is not a metal.', ['M_MM_HARD_METAL', 'Aluminium', 'Steel'], ['M_MM_SHINY', 'Copper wire']),
    c('Glass shines like a metal. What is it?', 'Non-metallic', 'Shining does not make a material a metal.', ['M_MM_SHINY', 'A metal, because it shines', 'A metal that is see-through'], ['M_MM_HARD_METAL', 'A metal, because it is hard']),
    c('Stone is hard and heavy. What is it?', 'Non-metallic', 'Hard and heavy do not make a material a metal.', ['M_MM_HARD_METAL', 'A metal, because it is hard', 'A metal, because it is heavy'], ['M_MM_SHINY', 'A metal, because it can shine']),
    c('Which of these is a material, not a product?', 'Rubber', 'A material is what things are made from.', ['M_MM_PRODUCT', 'A chair', 'A sufuria'], ['M_MM_HARD_METAL', 'A wheelbarrow']),
  ], { h: ['A material is what a thing is made from.', 'Shine, weight and hardness do not decide whether a material is a metal.'], s1: 'Think about what the material is.' })),
  fam('mi.sort.story', `${MI}MAT_METAL_NONMETAL`, 'word', 2, choose([
    c('A jua kali worker makes a jiko from old steel drums. What is the material?', 'Steel, a metal', 'The jiko is the product and steel is the material.', ['M_MM_PRODUCT', 'The jiko', 'The workshop'], ['M_MM_SHINY', 'Glass']),
    c('Atieno sorts a spoon, a pencil, a window pane and a nail into metals and non-metals. Which is a non-metal?', 'The window pane', 'Glass is not a metal, even though it shines.', ['M_MM_SHINY', 'The nail', 'The spoon'], ['M_MM_HARD_METAL', 'The spoon, because it is hard']),
    c('Baraka says a heavy rock is a metal because it is heavy. Is he right?', 'No, a rock is non-metallic', 'Weight does not make a metal.', ['M_MM_HARD_METAL', 'Yes, heavy things are metals', 'Yes, rocks contain only metal'], ['M_MM_SHINY', 'Yes, if it is shiny']),
    c('A carpenter makes a table from timber. The table is a product. What is the material?', 'Wood', 'Wood is the material the table is made from.', ['M_MM_PRODUCT', 'The table', 'The nails'], ['M_MM_HARD_METAL', 'Steel']),
    c('Njeri says a foil-wrapped sweet has shiny paper, so the paper is aluminium. How can she check?', 'Test with a magnet and look, aluminium is a metal', 'Foil is thin aluminium, but shine alone proves nothing.', ['M_MM_SHINY', 'Anything shiny is metal, no need to check', 'A shiny wrapper is always a metal'], ['M_MM_HARD_METAL', 'Hardness shows whether it is a metal']),
  ], { h: ['What is the thing made from?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide whether each material is a metal.' }), 'b'),
  fam('mi.sort.spot', `${MI}MAT_METAL_NONMETAL`, 'spot', 3, spot([
    sp('Juma says glass is a metal because it shines. Which step has the mistake?', 'Step 1: Juma sees a window shine in the sun.', 'Step 2: He knows metals can shine.', 'Step 3: He says everything shiny is a metal.', 'Glass shines but it is non-metallic.', 'M_MM_SHINY'),
    sp('Lucy says stone is a metal because it is hard. Which step has the mistake?', 'Step 1: Lucy knocks on a stone.', 'Step 2: It feels very hard.', 'Step 3: She says hard materials are metals.', 'Stone is hard but non-metallic.', 'M_MM_HARD_METAL'),
    sp('Samuel says a chair is a material. Which step has the mistake?', 'Step 1: Samuel looks at a wooden chair.', 'Step 2: He knows it is made from wood.', 'Step 3: He says the chair is the material.', 'The chair is a product. Wood is the material.', 'M_MM_PRODUCT'),
    sp('Eunice says plastic is a metal because it is light and shiny. Which step has the mistake?', 'Step 1: Eunice picks up a shiny plastic cup.', 'Step 2: It is light.', 'Step 3: She says shiny things are metals.', 'Plastic is non-metallic. Shine does not make a metal.', 'M_MM_SHINY'),
    sp('Peter says granite is a metal because it is heavy. Which step has the mistake?', 'Step 1: Peter lifts a piece of granite.', 'Step 2: It is heavy.', 'Step 3: He says heavy materials are metals.', 'Granite is a stone, non-metallic.', 'M_MM_HARD_METAL'),
  ], { h: ['Which step says something that is not true about metals?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against what makes a metal.' })),

  // ---------------------------------------------------------------- MAT_SUSTAINABLE
  fam('mi.sus.direct', `${MI}MAT_SUSTAINABLE`, 'direct', 1, choose([
    c('A carpenter has plenty of timber. What is a good habit?', 'Plan the cuts and use offcuts', 'Saving materials helps even when they are plentiful.', ['M_MS_WASTE_OK', 'Waste it, there is plenty', 'Cut without measuring'], ['M_MS_NEW_ONLY', 'Throw away the offcuts']),
    c('What is a better use of scrap metal?', 'Recycle it into new things', 'Jua kali workers melt and reshape scrap.', ['M_MS_BURN_OFFCUTS', 'Burn it', 'Bury it'], ['M_MS_WASTE_OK', 'Leave it to rust']),
    c('A chair leg is worn but can be repaired. What is sustainable?', 'Repair and reuse it', 'Repair saves materials and money.', ['M_MS_NEW_ONLY', 'Throw it away and buy new', 'Burn it'], ['M_MS_WASTE_OK', 'Buy as many chairs as you like']),
    c('What should be planted where timber is cut?', 'New trees', 'New trees replace the timber taken.', ['M_MS_WASTE_OK', 'Nothing, trees grow back by themselves', 'Nothing, there is plenty'], ['M_MS_NEW_ONLY', 'Plastic trees']),
    c('Which is a sustainable way of using plastic bottles?', 'Reuse or recycle them', 'Reuse and recycling keep plastic out of the soil.', ['M_MS_BURN_OFFCUTS', 'Burn them in the open', 'Throw them in a river'], ['M_MS_NEW_ONLY', 'Always buy new ones']),
  ], { h: ['Sustainable means using materials so they last and are not wasted.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about wasting less.' })),
  fam('mi.sus.spot', `${MI}MAT_SUSTAINABLE`, 'spot', 3, spot([
    sp('Juma says there is no need to save timber because there is plenty. Which step has the mistake?', 'Step 1: Juma sees a pile of timber.', 'Step 2: He knows trees take years to grow.', 'Step 3: He says it is fine to waste it.', 'Plan the cuts and use offcuts, even when timber is plentiful.', 'M_MS_WASTE_OK'),
    sp('Lucy says burning scrap is the best way to get rid of it. Which step has the mistake?', 'Step 1: Lucy has a heap of scrap metal and plastic.', 'Step 2: She wants it gone.', 'Step 3: She says burning is best.', 'Scrap metal can be recycled. Burning plastic harms the air.', 'M_MS_BURN_OFFCUTS'),
    sp('Samuel says new materials are always better than reusing. Which step has the mistake?', 'Step 1: Samuel sees a worn table.', 'Step 2: It could be repaired.', 'Step 3: He says buying new is always better.', 'Repair and reuse save materials and money.', 'M_MS_NEW_ONLY'),
    sp('Eunice says offcuts are rubbish. Which step has the mistake?', 'Step 1: Eunice cuts a board.', 'Step 2: Small pieces are left.', 'Step 3: She says offcuts are rubbish to throw away.', 'Offcuts can be used for small jobs.', 'M_MS_WASTE_OK'),
    sp('Peter says old tyres cannot be used. Which step has the mistake?', 'Step 1: Peter sees old tyres by the road.', 'Step 2: A jua kali worker cuts them.', 'Step 3: Peter says tyres cannot become anything useful.', 'Old tyres can be made into sandals and buckets.', 'M_MS_NEW_ONLY'),
  ], { h: ['Which step does not help save materials?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against sustainable use.' })),

  // ---------------------------------------------------------------- METAL_TYPES
  fam('me.typ.direct', `${ME}METAL_TYPES`, 'direct', 1, choose([
    c('A silvery, light metal does not stick to a magnet. What is it likely to be?', 'Aluminium', 'Aluminium is light, silvery and not magnetic.', ['M_MT_ALU_STEEL', 'Steel', 'Iron'], ['M_MT_MAGNET_ALL', 'Any metal sticks to a magnet']),
    c('Which metal is reddish-brown?', 'Copper', 'Copper is reddish-brown.', ['M_MT_COPPER_COLOUR', 'Aluminium', 'Steel'], ['M_MT_ALU_STEEL', 'Silver-coloured steel']),
    c('A grey, hard metal sticks to a magnet. What is it likely to be?', 'Steel', 'Steel is magnetic.', ['M_MT_ALU_STEEL', 'Aluminium', 'Copper'], ['M_MT_MAGNET_ALL', 'Any metal, all stick']),
    c('A magnet does not pick up a metal spoon. What can you say?', 'It may be aluminium or copper', 'Only iron and steel stick to a magnet.', ['M_MT_MAGNET_ALL', 'It cannot be metal', 'It must be made of wood'], ['M_MT_ALU_STEEL', 'It is steel']),
    c('Which pair of metals does a magnet NOT pick up?', 'Aluminium and copper', 'These two are not magnetic.', ['M_MT_MAGNET_ALL', 'Steel and iron', 'Every metal'], ['M_MT_COPPER_COLOUR', 'Copper and steel']),
  ], { h: ['Steel and iron stick to a magnet. Aluminium and copper do not.', 'Copper is reddish-brown.'], s1: 'Think about the colour and the magnet test.' })),
  fam('me.typ.story', `${ME}METAL_TYPES`, 'word', 2, choose([
    c('Atieno strips the plastic off an electric wire and sees a reddish-brown metal. Which metal is it?', 'Copper', 'Copper is reddish-brown.', ['M_MT_COPPER_COLOUR', 'Aluminium', 'Steel'], ['M_MT_ALU_STEEL', 'Iron']),
    c('Baraka touches a magnet to a cooking pot and nothing happens. The pot is light and silvery. Which metal?', 'Aluminium', 'Light, silvery and not magnetic: aluminium.', ['M_MT_ALU_STEEL', 'Steel', 'Iron'], ['M_MT_MAGNET_ALL', 'It cannot be a metal']),
    c('Wanjiru\'s magnet picks up a nail. What kind of metal is the nail likely to be?', 'Iron or steel', 'Only iron and steel are magnetic.', ['M_MT_MAGNET_ALL', 'Any metal', 'Aluminium'], ['M_MT_COPPER_COLOUR', 'Copper']),
    c('Otieno says aluminium is a kind of steel. How can a magnet help him?', 'Steel sticks to it and aluminium does not', 'The magnet separates them.', ['M_MT_ALU_STEEL', 'Both stick to it, so they are the same', 'Neither sticks to it'], ['M_MT_MAGNET_ALL', 'A magnet picks up everything']),
    c('Njeri finds a metal coin that a magnet does not pick up. What can she say?', 'It is not iron or steel', 'Iron and steel are the common magnetic metals.', ['M_MT_MAGNET_ALL', 'It is not a metal at all', 'It is not a coin'], ['M_MT_ALU_STEEL', 'It is steel']),
  ], { h: ['Colour and the magnet help tell the metals apart.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide which metal fits the clues.' })),
  fam('me.typ.spot', `${ME}METAL_TYPES`, 'spot', 3, spot([
    sp('Juma says aluminium sticks to a magnet. Which step has the mistake?', 'Step 1: Juma holds a magnet to a light, silvery metal.', 'Step 2: Nothing sticks.', 'Step 3: He says it must be steel because all metals stick.', 'It does not stick, so it is aluminium or copper, not steel.', 'M_MT_ALU_STEEL'),
    sp('Lucy says copper is silvery grey. Which step has the mistake?', 'Step 1: Lucy looks at a bare wire.', 'Step 2: It is reddish-brown.', 'Step 3: She says copper is silvery grey.', 'Copper is reddish-brown.', 'M_MT_COPPER_COLOUR'),
    sp('Samuel says a magnet picks up every metal. Which step has the mistake?', 'Step 1: Samuel tests a nail and it sticks.', 'Step 2: He tests a sufuria and it does not.', 'Step 3: He says the sufuria is not a metal.', 'Aluminium is a metal that does not stick to a magnet.', 'M_MT_MAGNET_ALL'),
    sp('Eunice says steel and aluminium are the same metal. Which step has the mistake?', 'Step 1: Eunice sees a steel nail and an aluminium foil.', 'Step 2: Both are grey-silver.', 'Step 3: She says they are the same metal.', 'Steel is hard and magnetic. Aluminium is light and not magnetic.', 'M_MT_ALU_STEEL'),
    sp('Peter says all grey metals stick to a magnet. Which step has the mistake?', 'Step 1: Peter tests a grey nail and it sticks.', 'Step 2: He tests a grey foil and it does not.', 'Step 3: He says all grey metals must stick.', 'Only iron and steel stick. Aluminium does not.', 'M_MT_MAGNET_ALL'),
  ], { h: ['Which step is not true?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the magnet test.' })),

  // ---------------------------------------------------------------- METAL_PROPERTIES
  fam('me.prp.direct', `${ME}METAL_PROPERTIES`, 'direct', 1, choose([
    c('Which metal does a magnet pick up?', 'Steel', 'Only iron and steel are magnetic.', ['M_MP_ALL_MAGNETIC', 'Copper', 'Aluminium'], ['M_MP_ALL_RUST', 'Brass']),
    c('Which metal rusts?', 'Iron and steel', 'Rust forms on iron and steel.', ['M_MP_ALL_RUST', 'Copper and aluminium as well', 'Every metal'], ['M_MP_ALL_MAGNETIC', 'Only magnets rust']),
    c('Why does a metal spoon get hot in hot tea?', 'Metals conduct heat well', 'Metals carry heat quickly.', ['M_MP_NO_HEAT', 'Metals do not carry heat', 'Metals keep heat out'], ['M_MP_BRITTLE', 'Metals melt in tea']),
    c('What happens when a piece of steel is hammered while hot?', 'It can be shaped', 'Metals can be hammered into shape.', ['M_MP_BRITTLE', 'It shatters like glass', 'It turns to dust'], ['M_MP_NO_HEAT', 'It stays the same']),
    c('Which metal is used for electric wire because it conducts electricity well?', 'Copper', 'Copper conducts electricity very well.', ['M_MP_ALL_MAGNETIC', 'Steel', 'Wood'], ['M_MP_NO_HEAT', 'A metal that does not conduct']),
  ], { h: ['Metals conduct heat and electricity, can be shaped, and only iron and steel are magnetic and rust.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about the properties of metals.' })),
  fam('me.prp.story', `${ME}METAL_PROPERTIES`, 'word', 2, choose([
    c('Atieno leaves a steel panga out in the rain. A week later it is red-brown. What happened?', 'It rusted', 'Iron and steel rust in damp air.', ['M_MP_ALL_RUST', 'Every metal does this, so it is normal', 'It melted'], ['M_MP_BRITTLE', 'It shattered']),
    c('Baraka leaves an aluminium sufuria in the rain. It stays shiny. Why?', 'Aluminium does not rust like iron', 'Aluminium and copper do not rust like iron.', ['M_MP_ALL_RUST', 'All metals rust, it will happen later', 'It was magnetic'], ['M_MP_BRITTLE', 'It is too soft to rust']),
    c('Wanjiru says the sufuria handle is plastic because metals do not carry heat. What is wrong?', 'Metals do carry heat well', 'The plastic stops the heat reaching the hand.', ['M_MP_NO_HEAT', 'Nothing, metals do not carry heat', 'Plastic is used because it is shiny'], ['M_MP_ALL_MAGNETIC', 'The handle is magnetic']),
    c('A jua kali worker hammers a hot piece of metal into a flat sheet. What property does this show?', 'They can be shaped', 'Metals do not shatter when hammered.', ['M_MP_BRITTLE', 'Metals are brittle', 'Metals melt at once'], ['M_MP_ALL_RUST', 'Metals rust']),
    c('Otieno says every metal is magnetic. How can he test?', 'Try a magnet on aluminium foil', 'Aluminium and copper are not magnetic.', ['M_MP_ALL_MAGNETIC', 'Try it on a steel nail only', 'He has no way to test it'], ['M_MP_ALL_RUST', 'Leave it outside in the rain']),
  ], { h: ['Which property does the story show?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide which property of metals is shown.' })),
  fam('me.prp.spot', `${ME}METAL_PROPERTIES`, 'spot', 3, spot([
    sp('Juma says all metals are magnetic. Which step has the mistake?', 'Step 1: Juma tests a nail with a magnet.', 'Step 2: The nail sticks.', 'Step 3: He says every metal will stick.', 'Only iron and steel stick to a magnet.', 'M_MP_ALL_MAGNETIC'),
    sp('Lucy says every metal rusts. Which step has the mistake?', 'Step 1: Lucy sees a rusty panga.', 'Step 2: She sees a shiny aluminium pot.', 'Step 3: She says the pot will rust like the panga.', 'Aluminium does not rust like iron.', 'M_MP_ALL_RUST'),
    sp('Samuel says metals do not carry heat. Which step has the mistake?', 'Step 1: Samuel puts a spoon in hot tea.', 'Step 2: The handle becomes hot.', 'Step 3: He says metals do not carry heat.', 'Metals carry heat well.', 'M_MP_NO_HEAT'),
    sp('Eunice says copper breaks like glass when hammered. Which step has the mistake?', 'Step 1: Eunice watches a worker hammer copper.', 'Step 2: The copper becomes a flat sheet.', 'Step 3: She says metals shatter like glass.', 'Metals can be hammered into sheets without shattering.', 'M_MP_BRITTLE'),
    sp('Peter says aluminium rusts like steel. Which step has the mistake?', 'Step 1: Peter sees an old panga with rust.', 'Step 2: He sees an aluminium pot in the same rain.', 'Step 3: He says the pot is also rusty.', 'Aluminium does not rust like iron or steel.', 'M_MP_ALL_RUST'),
  ], { h: ['Which step is not true?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the properties of metals.' })),

  // ---------------------------------------------------------------- METAL_USES
  fam('me.use.direct', `${ME}METAL_USES`, 'direct', 1, choose([
    c('Which metal makes electric wire?', 'Copper', 'Copper conducts electricity well.', ['M_MU_WIRE_STEEL', 'Steel', 'Iron'], ['M_MU_ALU_HEAVY', 'Lead']),
    c('Why is a sufuria often made of aluminium?', 'It is light and carries heat', 'Aluminium is light and conducts heat.', ['M_MU_ALU_HEAVY', 'It is very heavy', 'It is magnetic'], ['M_MU_PROPERTY_SWAP', 'It does not conduct heat']),
    c('Why is steel used for a jembe blade?', 'It is hard and strong', 'A jembe digs hard ground.', ['M_MU_PROPERTY_SWAP', 'It does not conduct heat', 'It is as light as foil'], ['M_MU_WIRE_STEEL', 'It carries electricity best']),
    c('Which metal makes a strong nail or panga blade?', 'Steel', 'Steel is hard and strong.', ['M_MU_PROPERTY_SWAP', 'Copper, because it is red', 'Aluminium, because it is light'], ['M_MU_WIRE_STEEL', 'Copper wire']),
    c('Why are window frames sometimes made of aluminium?', 'It is light and does not rust', 'Aluminium is light and resists rust.', ['M_MU_ALU_HEAVY', 'It is heavy and strong', 'It is magnetic'], ['M_MU_PROPERTY_SWAP', 'It rusts slowly in water']),
  ], { h: ['Choose the metal whose property fits the job.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about the property the job needs.' })),
  fam('me.use.story', `${ME}METAL_USES`, 'word', 2, choose([
    c('A jua kali worker needs a metal to make strong nails. Which should he use?', 'Steel', 'Steel is hard and strong.', ['M_MU_PROPERTY_SWAP', 'Copper wire', 'Aluminium foil'], ['M_MU_WIRE_STEEL', 'The metal in electric wire']),
    c('An electrician wants a wire that carries electricity well. Which metal?', 'Copper', 'Copper conducts electricity very well.', ['M_MU_WIRE_STEEL', 'Steel', 'Aluminium foil only'], ['M_MU_ALU_HEAVY', 'The heaviest metal']),
    c('Mama Achieng wants a cooking pot that is light to carry and heats quickly. Which metal suits?', 'Aluminium', 'It is light and conducts heat.', ['M_MU_ALU_HEAVY', 'Heavy steel only', 'A very heavy metal'], ['M_MU_PROPERTY_SWAP', 'A metal that does not carry heat']),
    c('Why is a bridge made of steel?', 'Steel is strong and can carry heavy loads', 'Strength is needed for a bridge.', ['M_MU_PROPERTY_SWAP', 'Steel does not carry heat', 'Steel is light'], ['M_MU_WIRE_STEEL', 'Steel carries electricity']),
    c('Otieno says aluminium is used because it is heavy. What is wrong?', 'Aluminium is light, and that is why it is used', 'Light weight is useful for pots and frames.', ['M_MU_ALU_HEAVY', 'Nothing, aluminium is heavy', 'Aluminium is heavier than steel'], ['M_MU_PROPERTY_SWAP', 'Aluminium is used because it rusts']),
  ], { h: ['Which property does the job need?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide the property, then the metal.' })),
  fam('me.use.spot', `${ME}METAL_USES`, 'spot', 3, spot([
    sp('Juma says electric wire is made of steel. Which step has the mistake?', 'Step 1: Juma strips a wire.', 'Step 2: He sees a reddish metal inside.', 'Step 3: He says it is steel.', 'It is copper, which conducts electricity well.', 'M_MU_WIRE_STEEL'),
    sp('Lucy says a sufuria is aluminium because it is heavy. Which step has the mistake?', 'Step 1: Lucy lifts a sufuria.', 'Step 2: It is quite light.', 'Step 3: She says it is aluminium because aluminium is heavy.', 'Aluminium is light, which is why it is used.', 'M_MU_ALU_HEAVY'),
    sp('Samuel says a jembe is steel because steel does not carry heat. Which step has the mistake?', 'Step 1: Samuel looks at a jembe.', 'Step 2: He knows it digs hard ground.', 'Step 3: He says steel is used because it does not carry heat.', 'Steel is used because it is hard and strong.', 'M_MU_PROPERTY_SWAP'),
    sp('Eunice says bridges use copper because copper is strong. Which step has the mistake?', 'Step 1: Eunice sees a bridge.', 'Step 2: She knows it carries heavy loads.', 'Step 3: She says copper is the strongest metal for it.', 'Bridges use steel, which is hard and strong.', 'M_MU_PROPERTY_SWAP'),
    sp('Peter says steel makes the best electric wire. Which step has the mistake?', 'Step 1: Peter looks at a power line.', 'Step 2: It carries electricity.', 'Step 3: He says steel is the best wire metal.', 'Copper conducts electricity better than steel.', 'M_MU_WIRE_STEEL'),
  ], { h: ['Which step gives the wrong reason?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the property of the metal.' })),

  // ---------------------------------------------------------------- NONMETAL_CLASS
  fam('nm.cls.direct', `${NM}NONMETAL_CLASS`, 'direct', 1, choose([
    c('What does synthetic mean?', 'Made by people from chemicals', 'Synthetic materials are made in factories.', ['M_NC_SYNTH_FAKE', 'Fake', 'Of poor quality'], ['M_NC_NATURAL_UNMADE', 'Never changed by people']),
    c('Which of these is synthetic?', 'A polythene bag', 'Plastics are synthetic.', ['M_NC_PLASTIC_NATURAL', 'Cotton', 'Wool'], ['M_NC_WOOL_SYNTH', 'Wood']),
    c('Which cloth fibre is natural?', 'Cotton', 'Cotton comes from a plant.', ['M_NC_WOOL_SYNTH', 'Nylon', 'Plastic'], ['M_NC_SYNTH_FAKE', 'Fake wool']),
    c('Wood is made into a table. Is the wood still natural?', 'Yes, it comes from a tree', 'Natural describes where a material comes from.', ['M_NC_NATURAL_UNMADE', 'No, people changed it', 'No, it is now synthetic'], ['M_NC_PLASTIC_NATURAL', 'It is plastic now']),
    c('Which of these is natural?', 'Stone', 'Stone comes from the ground.', ['M_NC_PLASTIC_NATURAL', 'Polythene', 'A plastic jerrican'], ['M_NC_WOOL_SYNTH', 'Nylon rope']),
  ], { h: ['Natural: from plants, animals or the ground. Synthetic: made by people from chemicals.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about where the material comes from.' })),
  fam('nm.cls.story', `${NM}NONMETAL_CLASS`, 'word', 2, choose([
    c('Atieno has a sisal basket and a plastic basin. Which is synthetic?', 'The plastic basin', 'Plastic is made by people from chemicals.', ['M_NC_PLASTIC_NATURAL', 'The sisal basket', 'Both are natural'], ['M_NC_SYNTH_FAKE', 'Neither, synthetic means fake']),
    c('Baraka says nylon is natural like cotton. Which is right?', 'Nylon is synthetic and cotton is natural', 'Cotton grows on a plant, nylon is made in factories.', ['M_NC_WOOL_SYNTH', 'Both are natural', 'Nylon is natural and cotton is synthetic'], ['M_NC_SYNTH_FAKE', 'Nylon is fake cotton']),
    c('Wanjiru says her plastic chair is not real because it is synthetic. What is wrong?', 'Synthetic means made by people, not fake', 'The chair is a real chair of a real material.', ['M_NC_SYNTH_FAKE', 'Nothing, synthetic means fake', 'Plastic is a natural material'], ['M_NC_PLASTIC_NATURAL', 'The chair is natural']),
    c('Otieno says a wooden stool is not natural because a carpenter shaped it. What is right?', 'Wood is natural, because it comes from a tree', 'Shaping does not change where the wood came from.', ['M_NC_NATURAL_UNMADE', 'He is right, shaping makes it synthetic', 'He is right, natural means untouched'], ['M_NC_PLASTIC_NATURAL', 'Wood is plastic']),
    c('Njeri sorts wool, cotton, nylon and sisal. Which one is synthetic?', 'Nylon', 'Nylon is made from chemicals.', ['M_NC_WOOL_SYNTH', 'Wool', 'Sisal'], ['M_NC_PLASTIC_NATURAL', 'Cotton']),
  ], { h: ['Is the material from a plant, animal or the ground, or made by people from chemicals?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide natural or synthetic.' }), 'b'),
  fam('nm.cls.spot', `${NM}NONMETAL_CLASS`, 'spot', 3, spot([
    sp('Juma says synthetic means fake. Which step has the mistake?', 'Step 1: Juma holds a plastic bucket.', 'Step 2: It is a real, useful bucket.', 'Step 3: He says synthetic means fake.', 'Synthetic means made by people from chemicals.', 'M_NC_SYNTH_FAKE'),
    sp('Lucy says plastic is natural. Which step has the mistake?', 'Step 1: Lucy looks at a polythene bag.', 'Step 2: It is made in a factory.', 'Step 3: She says plastic is a natural material.', 'Plastic is synthetic.', 'M_NC_PLASTIC_NATURAL'),
    sp('Samuel says a wooden table is not natural. Which step has the mistake?', 'Step 1: Samuel sees a table made of timber.', 'Step 2: A carpenter cut and joined the wood.', 'Step 3: He says shaped wood is no longer natural.', 'Wood is natural because it comes from a tree.', 'M_NC_NATURAL_UNMADE'),
    sp('Eunice says nylon is natural. Which step has the mistake?', 'Step 1: Eunice reads that nylon is a fibre.', 'Step 2: It is made from chemicals.', 'Step 3: She says it is a natural fibre like cotton.', 'Nylon is synthetic. Cotton is natural.', 'M_NC_WOOL_SYNTH'),
    sp('Peter says natural materials are never changed by people. Which step has the mistake?', 'Step 1: Peter sees cotton cloth.', 'Step 2: People spun and woven it.', 'Step 3: He says it is not natural.', 'Cotton cloth is natural because the fibre comes from a plant.', 'M_NC_NATURAL_UNMADE'),
  ], { h: ['Which step is not true about natural and synthetic?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against where the material comes from.' })),

  // ---------------------------------------------------------------- NONMETAL_PROPERTIES
  fam('nm.prp.direct', `${NM}NONMETAL_PROPERTIES`, 'direct', 1, choose([
    c('Which non-metal does not burn?', 'A clay brick', 'Clay products are baked in a hot kiln and do not burn.', ['M_NP_ALL_BURN', 'Wood', 'Paper'], ['M_NP_PLASTIC_HEAT', 'A plastic cup']),
    c('What happens to a plastic basin on a hot jiko?', 'It softens and melts', 'Plastics melt in heat.', ['M_NP_PLASTIC_HEAT', 'Nothing, plastic is heat-proof', 'It turns to stone'], ['M_NP_ALL_BURN', 'It stays cold']),
    c('Glass is hard. Can it break?', 'Yes, glass is hard but brittle', 'Hard does not mean unbreakable.', ['M_NP_HARD_UNBREAKABLE', 'No, hard materials never break', 'No, glass bends instead'], ['M_NP_ALL_BURN', 'Only when it burns']),
    c('Why do electricians wear rubber gloves?', 'Rubber does not carry electricity', 'Rubber is an insulator.', ['M_NP_RUBBER_CONDUCT', 'Rubber carries electricity well', 'Rubber is a metal'], ['M_NP_PLASTIC_HEAT', 'Rubber melts in electricity']),
    c('Which of these burns easily?', 'Dry wood', 'Wood and paper burn.', ['M_NP_ALL_BURN', 'A ceramic tile', 'A stone'], ['M_NP_HARD_UNBREAKABLE', 'Glass']),
  ], { h: ['Wood and paper burn; plastics melt; stone and ceramics do not burn; glass is hard but brittle; rubber does not carry electricity.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about the property of the material.' })),
  fam('nm.prp.story', `${NM}NONMETAL_PROPERTIES`, 'word', 2, choose([
    c('Atieno puts a plastic cup on a hot jiko. What happens?', 'It melts', 'Plastic softens and melts in heat.', ['M_NP_PLASTIC_HEAT', 'It stays the same', 'It becomes harder'], ['M_NP_ALL_BURN', 'It turns to ash at once']),
    c('A brick wall is near a fire. Does it burn?', 'No, bricks do not burn', 'Clay bricks do not burn.', ['M_NP_ALL_BURN', 'Yes, all non-metals burn', 'Yes, in the same way as wood'], ['M_NP_PLASTIC_HEAT', 'It melts']),
    c('Baraka drops a glass cup on the floor and it breaks. He says it should not, because glass is hard. What is wrong?', 'Glass is hard but brittle', 'Hard materials can still break.', ['M_NP_HARD_UNBREAKABLE', 'Nothing, hard things never break', 'The floor was too soft'], ['M_NP_ALL_BURN', 'The cup burned']),
    c('An electrician repairs a wire. Why does he cover it with rubber or plastic?', 'They do not carry electricity', 'They protect people from shocks.', ['M_NP_RUBBER_CONDUCT', 'They carry electricity better than copper', 'They are shiny'], ['M_NP_PLASTIC_HEAT', 'They melt']),
    c('Wanjiru says all non-metals burn. Which one does not?', 'Stone', 'Stone and ceramics do not burn.', ['M_NP_ALL_BURN', 'Paper', 'Dry wood'], ['M_NP_PLASTIC_HEAT', 'A plastic bag']),
  ], { h: ['What does the material do in heat, or when hit?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide which property is shown.' })),
  fam('nm.prp.spot', `${NM}NONMETAL_PROPERTIES`, 'spot', 3, spot([
    sp('Juma says all non-metals burn. Which step has the mistake?', 'Step 1: Juma burns a piece of paper.', 'Step 2: He sees a brick in the fire.', 'Step 3: He says the brick burns too.', 'Bricks and stone do not burn.', 'M_NP_ALL_BURN'),
    sp('Lucy says plastic is heat-proof. Which step has the mistake?', 'Step 1: Lucy puts a plastic spoon in hot water.', 'Step 2: It bends.', 'Step 3: She says plastic is heat-proof.', 'Plastics soften and melt in heat.', 'M_NP_PLASTIC_HEAT'),
    sp('Samuel says glass cannot break because it is hard. Which step has the mistake?', 'Step 1: Samuel taps a glass.', 'Step 2: It feels very hard.', 'Step 3: He says hard things cannot break.', 'Glass is hard but brittle, so it breaks.', 'M_NP_HARD_UNBREAKABLE'),
    sp('Eunice says rubber carries electricity. Which step has the mistake?', 'Step 1: Eunice sees an electrician in rubber gloves.', 'Step 2: He is safe from shocks.', 'Step 3: She says this is because rubber carries electricity.', 'Rubber does not carry electricity, so it protects.', 'M_NP_RUBBER_CONDUCT'),
    sp('Peter says ceramic burns like wood. Which step has the mistake?', 'Step 1: Peter sees a clay pot on a fire.', 'Step 2: The pot stays whole.', 'Step 3: He says clay burns like wood.', 'Clay and ceramics do not burn.', 'M_NP_ALL_BURN'),
  ], { h: ['Which step is not true?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the properties.' })),

  // ---------------------------------------------------------------- NONMETAL_USES
  fam('nm.use.direct', `${NM}NONMETAL_USES`, 'direct', 1, choose([
    c('Which material suits a water tank?', 'Plastic', 'Plastic is light, waterproof and does not rust.', ['M_NU_GLASS_HANDLE', 'Glass', 'Paper'], ['M_NU_WOOD_ANY', 'Wood']),
    c('Which material suits a kitchen floor tile?', 'Ceramic', 'Ceramic is hard, waterproof and does not burn.', ['M_NU_WOOD_ANY', 'Wood', 'Paper'], ['M_NU_GLASS_HANDLE', 'Rubber']),
    c('What does cement do in a wall?', 'It joins the blocks as it sets', 'Cement is mixed with sand and water.', ['M_NU_CEMENT', 'It is the wall', 'It is the paint'], ['M_NU_WOOD_ANY', 'It is the timber']),
    c('Which material makes tyres?', 'Rubber', 'Rubber is elastic and grips the road.', ['M_NU_GLASS_HANDLE', 'Glass', 'Stone'], ['M_NU_WOOD_ANY', 'Wood']),
    c('Which material suits a window pane?', 'Glass', 'Glass lets light through.', ['M_NU_GLASS_HANDLE', 'Rubber', 'Wood'], ['M_NU_WOOD_ANY', 'Paper']),
  ], { h: ['Pick the material whose property fits the job.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about the property the job needs.' })),
  fam('nm.use.story', `${NM}NONMETAL_USES`, 'word', 2, choose([
    c('A school needs a strong, waterproof tank that will not rust. Which material?', 'Plastic', 'Plastic does not rust and is waterproof.', ['M_NU_GLASS_HANDLE', 'Glass', 'Paper'], ['M_NU_WOOD_ANY', 'Wood']),
    c('A builder says cement is the wall itself. What is right?', 'Cement joins the blocks and makes concrete', 'It sets hard when mixed with sand and water.', ['M_NU_CEMENT', 'He is right, cement is the wall', 'Cement is a kind of paint'], ['M_NU_WOOD_ANY', 'Cement is wood']),
    c('Atieno needs a floor in a wet kitchen that does not soak up water or burn. Which material?', 'Ceramic tiles', 'Tiles are hard and waterproof.', ['M_NU_WOOD_ANY', 'Wood boards', 'Paper'], ['M_NU_GLASS_HANDLE', 'Rubber']),
    c('A bicycle needs tyres that grip and bend. Which material?', 'Rubber', 'Rubber is elastic.', ['M_NU_GLASS_HANDLE', 'Glass', 'Stone'], ['M_NU_WOOD_ANY', 'Wood']),
    c('A hut needs a window that lets light in. Which material?', 'Glass', 'Glass is transparent.', ['M_NU_GLASS_HANDLE', 'Rubber', 'Stone'], ['M_NU_WOOD_ANY', 'Wood']),
  ], { h: ['What property does the job need?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Match the property to the material.' })),
  fam('nm.use.spot', `${NM}NONMETAL_USES`, 'spot', 3, spot([
    sp('Juma says glass is best for a water tank. Which step has the mistake?', 'Step 1: Juma wants a tank for a school.', 'Step 2: It must not break when knocked.', 'Step 3: He says glass is best.', 'Plastic is light and does not break easily, so it suits a tank.', 'M_NU_GLASS_HANDLE'),
    sp('Lucy says wood is best for every job. Which step has the mistake?', 'Step 1: Lucy likes wood for a table.', 'Step 2: She wants a kitchen floor.', 'Step 3: She says wood is best for a wet floor as well.', 'Ceramic tiles do not soak up water or burn.', 'M_NU_WOOD_ANY'),
    sp('Samuel says cement is the wall. Which step has the mistake?', 'Step 1: Samuel sees a wall of blocks.', 'Step 2: Grey stuff is between the blocks.', 'Step 3: He says the grey stuff is the wall.', 'Cement joins the blocks as it sets.', 'M_NU_CEMENT'),
    sp('Eunice says glass is good for a handle. Which step has the mistake?', 'Step 1: Eunice wants a hammer handle.', 'Step 2: It must not break when knocked.', 'Step 3: She says glass is a good handle material.', 'Wood is a better handle: glass is brittle.', 'M_NU_GLASS_HANDLE'),
    sp('Peter says cement is a paint. Which step has the mistake?', 'Step 1: Peter sees a grey powder.', 'Step 2: It sets hard with water.', 'Step 3: He says it is paint.', 'Cement is mixed with sand and water to join blocks or make concrete.', 'M_NU_CEMENT'),
  ], { h: ['Which step names a material that does not fit the job?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the property the job needs.' })),

  // ---------------------------------------------------------------- MEAS_TOOLS
  fam('mt.mea.direct', `${MT}MEAS_TOOLS`, 'direct', 1, choose([
    c('Which tool measures voltage?', 'Voltmeter', 'A voltmeter measures voltage in volts.', ['M_MV_VOLT_AMP', 'Ammeter', 'Stopwatch'], ['M_MV_BALANCE_LEN', 'Weighing balance']),
    c('What does a weighing balance measure?', 'Mass', 'A balance measures mass in kilograms or grams.', ['M_MV_BALANCE_LEN', 'Length', 'Time'], ['M_MV_STOPWATCH', 'Speed']),
    c('What does a stopwatch measure?', 'Time', 'A stopwatch measures time in seconds.', ['M_MV_STOPWATCH', 'Speed', 'Length'], ['M_MV_BALANCE_LEN', 'Mass']),
    c('Which tool measures the length of a long wall?', 'Tape measure', 'A tape measure measures long lengths.', ['M_MV_RULER_ALL', 'Steel rule', 'Callipers'], ['M_MV_STOPWATCH', 'Stopwatch']),
    c('Which tool measures electric current?', 'Ammeter', 'An ammeter measures current in amperes.', ['M_MV_VOLT_AMP', 'Voltmeter', 'Weighing balance'], ['M_MV_STOPWATCH', 'Stopwatch']),
  ], { h: ['Tape: long lengths. Steel rule: short lengths. Callipers: diameter. Balance: mass. Stopwatch: time. Ammeter: current. Voltmeter: voltage.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what each tool measures.' })),
  fam('mt.mea.story', `${MT}MEAS_TOOLS`, 'word', 2, choose([
    c('Atieno wants to find the mass of a bag of flour. Which tool?', 'A weighing balance', 'A balance measures mass.', ['M_MV_BALANCE_LEN', 'A tape measure', 'A stopwatch'], ['M_MV_RULER_ALL', 'A steel rule']),
    c('Baraka wants to time a runner in seconds. Which tool?', 'A stopwatch', 'A stopwatch measures time.', ['M_MV_STOPWATCH', 'A tape measure', 'A balance'], ['M_MV_VOLT_AMP', 'A voltmeter']),
    c('A technician wants to measure the voltage of a battery. Which tool?', 'A voltmeter', 'A voltmeter measures voltage.', ['M_MV_VOLT_AMP', 'An ammeter', 'A balance'], ['M_MV_STOPWATCH', 'A stopwatch']),
    c('Wanjiru wants the length of the school field. Which tool?', 'A tape measure', 'It measures long lengths.', ['M_MV_RULER_ALL', 'A steel rule 30 cm long', 'A stopwatch'], ['M_MV_BALANCE_LEN', 'A balance']),
    c('A fundi wants the diameter of a round bar exactly. Which tool?', 'Callipers', 'Callipers grip round parts.', ['M_MV_RULER_ALL', 'A steel rule', 'A tape measure'], ['M_MV_BALANCE_LEN', 'A balance']),
  ], { h: ['What quantity must be measured?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide what is measured, then the tool.' })),
  fam('mt.mea.spot', `${MT}MEAS_TOOLS`, 'spot', 3, spot([
    sp('Juma says a voltmeter measures current. Which step has the mistake?', 'Step 1: Juma reads a meter in volts.', 'Step 2: He knows it measures electricity.', 'Step 3: He says it measures current.', 'A voltmeter measures voltage. An ammeter measures current.', 'M_MV_VOLT_AMP'),
    sp('Lucy says a balance measures length. Which step has the mistake?', 'Step 1: Lucy places a bag on a balance.', 'Step 2: It shows 2 kg.', 'Step 3: She says that is the length of the bag.', 'A balance measures mass.', 'M_MV_BALANCE_LEN'),
    sp('Samuel says a stopwatch measures speed. Which step has the mistake?', 'Step 1: Samuel times a race.', 'Step 2: The watch shows 12 seconds.', 'Step 3: He says it measures speed.', 'A stopwatch measures time.', 'M_MV_STOPWATCH'),
    sp('Eunice says a steel rule is best for a long wall. Which step has the mistake?', 'Step 1: Eunice has a 30 cm steel rule.', 'Step 2: The wall is 6 metres long.', 'Step 3: She says the rule is the best tool for it.', 'A tape measure measures long lengths.', 'M_MV_RULER_ALL'),
    sp('Peter says an ammeter measures voltage. Which step has the mistake?', 'Step 1: Peter reads an ammeter.', 'Step 2: The reading is in amperes.', 'Step 3: He says it shows voltage.', 'An ammeter measures current in amperes.', 'M_MV_VOLT_AMP'),
  ], { h: ['Which step names the wrong quantity?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against what the tool measures.' })),

  // ---------------------------------------------------------------- MARK_TOOLS
  fam('mt.mrk.direct', `${MT}MARK_TOOLS`, 'direct', 1, choose([
    c('What does a dot punch do?', 'Makes a small dent to mark a centre', 'The dent guides the drill.', ['M_MK_PUNCH_HOLE', 'Makes the hole', 'Cuts the metal'], ['M_MK_DIVIDER_CUT', 'Draws a circle']),
    c('What is a divider used for?', 'Marking circles and arcs', 'A divider has two points like a compass.', ['M_MK_DIVIDER_CUT', 'Cutting metal', 'Measuring mass'], ['M_MK_SQUARE_LENGTH', 'Checking a right angle']),
    c('What does a try-square check?', 'A right angle', 'The corner of a try-square is a right angle.', ['M_MK_SQUARE_LENGTH', 'The length of a board', 'The mass of a board'], ['M_MK_DIVIDER_CUT', 'A circle']),
    c('Which tool marks a fine line on steel?', 'Scriber', 'A scriber scratches a fine lasting line on metal.', ['M_MK_PENCIL_METAL', 'Pencil', 'Chalk'], ['M_MK_PUNCH_HOLE', 'Dot punch']),
    c('Which tool is used to mark a line parallel to the edge of a board?', 'Marking gauge', 'A marking gauge scribes a line at a set distance from an edge.', ['M_MK_SQUARE_LENGTH', 'Try-square', 'Dot punch'], ['M_MK_DIVIDER_CUT', 'Divider']),
  ], { h: ['Divider: circles and arcs. Try-square: right angle. Marking gauge: parallel line. Dot punch: dent for the centre. Scriber: line on metal.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what each tool does.' })),
  fam('mt.mrk.story', `${MT}MARK_TOOLS`, 'word', 2, choose([
    c('Atieno must mark where to drill a hole in a metal plate. Which tool marks the centre?', 'A dot punch', 'The dent keeps the drill from slipping.', ['M_MK_PUNCH_HOLE', 'A drill', 'A try-square'], ['M_MK_DIVIDER_CUT', 'A divider']),
    c('Baraka needs to draw a circle on sheet metal. Which tool?', 'A divider', 'It marks circles and arcs.', ['M_MK_DIVIDER_CUT', 'A try-square', 'A balance'], ['M_MK_PENCIL_METAL', 'A pencil']),
    c('Wanjiru wants to check a corner of a frame is a right angle. Which tool?', 'A try-square', 'It checks right angles.', ['M_MK_SQUARE_LENGTH', 'A tape measure', 'A stopwatch'], ['M_MK_DIVIDER_CUT', 'A divider']),
    c('Otieno marks a steel bar with a pencil, but the line rubs off. Which tool marks it better?', 'A scriber', 'It leaves a fine, lasting line.', ['M_MK_PENCIL_METAL', 'A thicker pencil', 'A piece of chalk'], ['M_MK_PUNCH_HOLE', 'A dot punch']),
    c('Njeri wants a line the same distance from the edge of a board all along. Which tool?', 'A marking gauge', 'It scribes a line parallel to the edge.', ['M_MK_SQUARE_LENGTH', 'A try-square', 'A tape measure'], ['M_MK_DIVIDER_CUT', 'A divider']),
  ], { h: ['What job does the marking tool do?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide the job, then the tool.' })),
  fam('mt.mrk.spot', `${MT}MARK_TOOLS`, 'spot', 3, spot([
    sp('Juma says a dot punch makes the hole. Which step has the mistake?', 'Step 1: Juma taps a dot punch on metal.', 'Step 2: A small dent appears.', 'Step 3: He says the punch has made the hole.', 'It only makes a dent to mark the centre. A drill makes the hole.', 'M_MK_PUNCH_HOLE'),
    sp('Lucy says a divider cuts metal. Which step has the mistake?', 'Step 1: Lucy opens a divider.', 'Step 2: She scratches a circle on a plate.', 'Step 3: She says the divider cuts the metal.', 'It marks circles and arcs. It does not cut.', 'M_MK_DIVIDER_CUT'),
    sp('Samuel says a try-square measures length. Which step has the mistake?', 'Step 1: Samuel puts a try-square against a board.', 'Step 2: The corner fits the edge.', 'Step 3: He says it measures the length.', 'A try-square checks a right angle.', 'M_MK_SQUARE_LENGTH'),
    sp('Eunice says a pencil is best for steel. Which step has the mistake?', 'Step 1: Eunice marks a steel bar with a pencil.', 'Step 2: The line is thick and rubs off.', 'Step 3: She says a pencil is the best tool for steel.', 'A scriber leaves a fine, lasting line on metal.', 'M_MK_PENCIL_METAL'),
    sp('Peter says a scriber is used to measure. Which step has the mistake?', 'Step 1: Peter holds a scriber.', 'Step 2: It has a sharp point.', 'Step 3: He says it measures lengths.', 'A scriber scratches a line on metal.', 'M_MK_PUNCH_HOLE'),
  ], { h: ['Which step gives the wrong job?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against what the tool does.' })),

  // ---------------------------------------------------------------- TOOL_CHOOSE
  fam('mt.cho.direct', `${MT}TOOL_CHOOSE`, 'direct', 1, choose([
    c('Which tool measures the diameter of a bolt most exactly?', 'Callipers', 'Callipers grip a small round part.', ['M_TC_TAPE_ALL', 'Tape measure', 'Steel rule'], ['M_TC_PRECISION', 'Whatever is nearest']),
    c('You need a right angle on a board. What do you pick?', 'A try-square', 'A try-square is made for right angles.', ['M_TC_NEAREST', 'Whatever is nearest', 'A tape measure'], ['M_TC_TAPE_ALL', 'A tape measure for everything']),
    c('Why use a scriber rather than a pencil on steel?', 'It gives a finer line that lasts', 'A finer line means a more accurate cut.', ['M_TC_PRECISION', 'No reason, both are the same', 'A pencil is sharper'], ['M_TC_NEAREST', 'It is nearer']),
    c('Which tool measures the length of a person for a suit?', 'A tape measure', 'A tape bends round the body.', ['M_TC_TAPE_ALL', 'Callipers', 'A try-square'], ['M_TC_NEAREST', 'A stiff steel rule only']),
    c('Which tool marks the centre of a hole to be drilled in metal?', 'A dot punch', 'It makes a dent for the drill to start in.', ['M_TC_PRECISION', 'A pencil', 'Chalk'], ['M_TC_NEAREST', 'A ruler']),
  ], { h: ['Choose the tool made for the job.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what the job needs.' })),
  fam('mt.cho.story', `${MT}TOOL_CHOOSE`, 'word', 2, choose([
    c('Atieno uses a tape measure to find the diameter of a thin pipe, and gets a poor reading. Which tool is better?', 'Callipers', 'Callipers grip round parts for an exact reading.', ['M_TC_TAPE_ALL', 'A longer tape measure', 'The same tape, read more slowly'], ['M_TC_NEAREST', 'Whatever is on the bench']),
    c('Baraka needs a right angle on a timber frame. The try-square is on the other bench, so he uses his eye. What should he do?', 'Fetch the try-square', 'The right tool gives a better result.', ['M_TC_NEAREST', 'Use whatever is nearest', 'Guess the angle'], ['M_TC_PRECISION', 'It makes no difference']),
    c('Wanjiru marks a steel plate with a pencil and the cut goes wrong. Which tool should she have used?', 'A scriber', 'A scriber gives a fine, lasting line.', ['M_TC_PRECISION', 'A thicker pencil', 'Chalk'], ['M_TC_NEAREST', 'Her finger nail']),
    c('A tailor must measure round a customer\'s waist. Which tool?', 'A tape measure', 'A tape measure bends round curved shapes.', ['M_TC_TAPE_ALL', 'A steel rule', 'Callipers'], ['M_TC_NEAREST', 'A divider']),
    c('Otieno says one measuring tool is good for every job. What is wrong?', 'Different jobs need different tools', 'A tape, a rule and callipers each fit different jobs.', ['M_TC_TAPE_ALL', 'Nothing, a tape does everything', 'Nothing, any tool will do'], ['M_TC_NEAREST', 'The nearest tool is always best']),
  ], { h: ['Which tool is made for this job?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Match the task to the tool.' })),
  fam('mt.cho.spot', `${MT}TOOL_CHOOSE`, 'spot', 3, spot([
    sp('Juma says a tape measure measures a bolt as well as callipers. Which step has the mistake?', 'Step 1: Juma wants the diameter of a bolt.', 'Step 2: He holds a tape measure round it.', 'Step 3: He says a tape is as exact as callipers.', 'Callipers measure the diameter of small round parts most exactly.', 'M_TC_TAPE_ALL'),
    sp('Lucy says she should use the nearest tool. Which step has the mistake?', 'Step 1: Lucy needs a right angle.', 'Step 2: The try-square is across the room.', 'Step 3: She says to use whatever is nearest.', 'Fetch the right tool, a try-square.', 'M_TC_NEAREST'),
    sp('Samuel says a pencil and a scriber are the same on steel. Which step has the mistake?', 'Step 1: Samuel marks steel with a pencil.', 'Step 2: Then he marks it with a scriber.', 'Step 3: He says the two give the same accuracy.', 'A scriber gives a finer, lasting line, so it is more accurate.', 'M_TC_PRECISION'),
    sp('Eunice says a steel rule measures a classroom best. Which step has the mistake?', 'Step 1: Eunice has a 30 cm rule.', 'Step 2: The classroom is 8 metres long.', 'Step 3: She says the rule is best for it.', 'A tape measure measures long lengths.', 'M_TC_TAPE_ALL'),
    sp('Peter says any tool will do for a right angle. Which step has the mistake?', 'Step 1: Peter needs to check a corner.', 'Step 2: He holds a tape against it.', 'Step 3: He says a tape checks a right angle well.', 'A try-square checks a right angle.', 'M_TC_NEAREST'),
  ], { h: ['Which step gives a poor choice of tool?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against the job.' })),

  // ---------------------------------------------------------------- TOOL_CARE
  fam('mt.car.direct', `${MT}TOOL_CARE`, 'direct', 1, choose([
    c('What do you do to a steel tool after use?', 'Dry it and oil it', 'Oil keeps steel from rusting.', ['M_CT_NO_OIL', 'Put it away wet', 'Leave it outside'], ['M_CT_HEAP', 'Throw it in the box']),
    c('What should you not do with a steel rule?', 'Use it as a hammer', 'It bends and gives wrong readings.', ['M_CT_HAMMER', 'Nothing, it is strong', 'Keep it clean'], ['M_CT_HEAP', 'Hang it up']),
    c('Where do tools go at the end of the lesson?', 'Back in its place, clean', 'Tidy tools last longer.', ['M_CT_HEAP', 'In a heap in the box', 'On the floor'], ['M_CT_NO_OIL', 'Wet in a bucket']),
    c('How do you store a scriber or divider?', 'With its point covered', 'Covered points do not hurt or blunt.', ['M_CT_POINTS_OPEN', 'With the sharp point uncovered', 'Point up in a pocket'], ['M_CT_HEAP', 'Loose in a heap']),
    c('Why are steel tools stored in a dry place?', 'Damp makes steel rust', 'Rust spoils tools.', ['M_CT_NO_OIL', 'Damp makes steel stronger', 'It does not matter'], ['M_CT_HAMMER', 'To use them as hammers']),
  ], { h: ['Clean, dry, a little oil, covered points, in their place.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about what keeps tools in good order.' })),
  fam('mt.car.story', `${MT}TOOL_CARE`, 'word', 2, choose([
    c('Atieno puts away a wet steel try-square. A week later it has red-brown spots. What went wrong?', 'It was not dried and so it rusted', 'Wet steel rusts.', ['M_CT_NO_OIL', 'Nothing, all spots are normal', 'It was too clean'], ['M_CT_HEAP', 'It was put in a heap']),
    c('Baraka uses a steel rule to open a tin lid, and it bends. What should he do next time?', 'Use the right tool and not the rule', 'A bent rule gives wrong readings.', ['M_CT_HAMMER', 'Use it for prying again', 'Hit it flat with a hammer'], ['M_CT_HEAP', 'Throw it in the box']),
    c('Wanjiru throws all the tools in one box and the callipers get damaged. What is a better way?', 'Put each tool in its place', 'Tools stored apart are not damaged.', ['M_CT_HEAP', 'Throw them in harder', 'Leave them on the bench'], ['M_CT_POINTS_OPEN', 'Leave the points uncovered']),
    c('Otieno puts a divider in his pocket with the points out. What may happen?', 'It may hurt him and the points may blunt', 'Cover sharp points.', ['M_CT_POINTS_OPEN', 'Nothing, pockets are safe', 'The points get sharper'], ['M_CT_NO_OIL', 'It will rust']),
    c('At the end of the lesson Njeri wipes each tool, oils the steel ones and returns them. What is this?', 'Good care of tools', 'Clean, oil and return.', ['M_CT_NO_OIL', 'A waste of time', 'Unnecessary'], ['M_CT_HEAP', 'A mess']),
  ], { h: ['What would a careful worker do?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide the care that the tool needs.' })),
  fam('mt.car.spot', `${MT}TOOL_CARE`, 'spot', 3, spot([
    sp('Juma says a wet steel tool can be put away. Which step has the mistake?', 'Step 1: Juma finishes work with a steel tool.', 'Step 2: It is wet from the rain.', 'Step 3: He puts it away without drying.', 'Dry it and oil it lightly, or it will rust.', 'M_CT_NO_OIL'),
    sp('Lucy says a steel rule can be used as a hammer. Which step has the mistake?', 'Step 1: Lucy has a stubborn nail.', 'Step 2: She picks up her steel rule.', 'Step 3: She says it will do as a hammer.', 'Measuring tools must not be used as hammers or levers.', 'M_CT_HAMMER'),
    sp('Samuel says tools can be thrown in a heap. Which step has the mistake?', 'Step 1: The lesson ends.', 'Step 2: Samuel is in a hurry.', 'Step 3: He throws the tools in a heap.', 'Tools go back in their place so they are not damaged.', 'M_CT_HEAP'),
    sp('Eunice says a scriber point need not be covered. Which step has the mistake?', 'Step 1: Eunice puts her scriber in her bag.', 'Step 2: The point is open.', 'Step 3: She says it is safe.', 'Cover sharp points so they do not hurt you or become blunt.', 'M_CT_POINTS_OPEN'),
    sp('Peter says oil is not needed on steel tools. Which step has the mistake?', 'Step 1: Peter keeps his tools in a damp shed.', 'Step 2: They get brown spots.', 'Step 3: He says oil would make no difference.', 'A light film of oil protects steel from rust.', 'M_CT_NO_OIL'),
  ], { h: ['Which step is poor care of tools?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against good tool care.' })),

  // ---------------------------------------------------------------- HW_CLASSIFY
  fam('hw.cls.direct', `${HW}HW_CLASSIFY`, 'direct', 1, choose([
    c('A printer is a type of what?', 'Output device (hardcopy)', 'A printer gives results on paper.', ['M_HW_PRINTER_IN', 'Input device', 'Storage device'], ['M_HW_MONITOR_HARD', 'Softcopy device']),
    c('Which output is softcopy?', 'Monitor', 'A monitor shows results on a screen.', ['M_HW_MONITOR_HARD', 'Printer', 'Plotter'], ['M_HW_SCANNER_OUT', 'Scanner']),
    c('A scanner sends a picture into the computer. What is it?', 'Input device', 'It sends data in.', ['M_HW_SCANNER_OUT', 'Output device', 'Storage device'], ['M_HW_PRINTER_IN', 'Printer']),
    c('A flash disk keeps files. What is it?', 'Storage device', 'It keeps data for later.', ['M_HW_STORAGE_INPUT', 'Input device', 'Output device'], ['M_HW_PRINTER_IN', 'Printer']),
    c('Which is an input device?', 'Keyboard', 'A keyboard sends data in.', ['M_HW_PRINTER_IN', 'Printer', 'Monitor'], ['M_HW_STORAGE_INPUT', 'Flash disk']),
  ], { h: ['Input sends data in. Output gives results out (hardcopy on paper, softcopy on a screen or as sound). Storage keeps data.', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Think about which way the data goes.' })),
  fam('hw.cls.story', `${HW}HW_CLASSIFY`, 'word', 2, choose([
    c('Atieno scans her drawing and then prints a copy. Which device is the input?', 'The scanner', 'The scanner sends the picture in.', ['M_HW_SCANNER_OUT', 'The printer', 'The paper'], ['M_HW_PRINTER_IN', 'Both are input']),
    c('Baraka reads a report on a screen and then prints it. Which is hardcopy?', 'The printed paper', 'Hardcopy is on paper.', ['M_HW_MONITOR_HARD', 'The screen', 'Both are hardcopy'], ['M_HW_PRINTER_IN', 'The keyboard']),
    c('Wanjiru saves her work on a flash disk. What does the disk do?', 'Stores data for later', 'It is a storage device.', ['M_HW_STORAGE_INPUT', 'It sends data in', 'It gives results out'], ['M_HW_PRINTER_IN', 'It prints']),
    c('Otieno speaks into a microphone to record his voice. Which kind of device is it?', 'Input device', 'It sends sound into the computer.', ['M_HW_SCANNER_OUT', 'Output device', 'Storage device'], ['M_HW_PRINTER_IN', 'A printer']),
    c('A speaker plays music from a laptop. What kind of device is it?', 'Output device, softcopy', 'It gives results as sound.', ['M_HW_MONITOR_HARD', 'Output device, hardcopy', 'Input device'], ['M_HW_PRINTER_IN', 'Storage']),
  ], { h: ['Does data go in, come out or stay stored?', 'Cross out the answers that are plainly wrong, then choose.'], s1: 'Decide the job of the device.' })),
  fam('hw.cls.spot', `${HW}HW_CLASSIFY`, 'spot', 3, spot([
    sp('Juma says a printer is an input device. Which step has the mistake?', 'Step 1: Juma sends a file to a printer.', 'Step 2: Paper comes out.', 'Step 3: He says the printer is input.', 'A printer gives results out, so it is an output device.', 'M_HW_PRINTER_IN'),
    sp('Lucy says a monitor gives hardcopy. Which step has the mistake?', 'Step 1: Lucy sees a picture on a monitor.', 'Step 2: Nothing is on paper.', 'Step 3: She says this is hardcopy.', 'Monitor output is softcopy. Hardcopy is on paper.', 'M_HW_MONITOR_HARD'),
    sp('Samuel says a scanner is output. Which step has the mistake?', 'Step 1: Samuel puts a page in a scanner.', 'Step 2: The picture goes into the computer.', 'Step 3: He says the scanner is an output device.', 'A scanner sends data in: it is input.', 'M_HW_SCANNER_OUT'),
    sp('Eunice says a flash disk is an input device. Which step has the mistake?', 'Step 1: Eunice saves a file on a flash disk.', 'Step 2: The disk keeps it.', 'Step 3: She says it is an input device.', 'A flash disk is a storage device.', 'M_HW_STORAGE_INPUT'),
    sp('Peter says a keyboard is a storage device. Which step has the mistake?', 'Step 1: Peter types a word.', 'Step 2: The word goes into the computer.', 'Step 3: He says the keyboard keeps it for later.', 'A keyboard is an input device. It does not store.', 'M_HW_STORAGE_INPUT'),
  ], { h: ['Which step names the wrong kind of device?', 'Read each step in turn and ask whether it is really true.'], s1: 'Check each step against input, output and storage.' })),
];
