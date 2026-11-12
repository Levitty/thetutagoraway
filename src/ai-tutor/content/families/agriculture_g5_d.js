// ============================================================================
// GRADE 5 AGRICULTURE AND NUTRITION, STRANDS 3 AND 4: HYGIENE PRACTICES AND PRODUCTION TECHNIQUES (10 skills).
// Good grooming, home hygiene (cleaning surfaces), laundering cotton, repairing garments, constructing innovative gardens.
// Written offline from the KICD 2024 design through the curriculum map. The questions test the knowledge behind the practical
// outcomes (cleaning, laundering, stitching, building a garden); those tasks are for the teacher. Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g5_lib.js';

const GR = 'HYGIEN.GOOD_GROOMING_PRACTICES.', HO = 'HYGIEN.HOME_HYGIENE.', LA = 'HYGIEN.LAUNDERING_COTTON_ITEM.';
const RE = 'PRODUC.REPAIRING_GARMENTS.', GA = 'PRODUC.CONSTRUCTING_INNOVATIVE_.';

export const FAMILIES = [
  // ---------------------------------------------------------------- GROOMING_HABITS
  fam('gr.ha.which', `${GR}GROOMING_HABITS`, 'direct', 1, choose([
    Q('Which of these is part of good grooming every day?', 'Bathing and wearing clean clothes', ['Wearing the most costly clothes|GROOM_EXPENSIVE', 'Using perfume instead of a bath|GROOM_PERFUME', 'Keeping it only for special days|GROOM_SPECIAL'], 'Good grooming is about being clean and neat, not about cost.'),
    Q('How often should a child brush their teeth?', 'In the morning and at night', ['Only on special days|GROOM_SPECIAL', 'Only when going to a party|GROOM_SPECIAL', 'Once a month on a Sunday|GROOM_SPECIAL'], 'Brushing twice a day keeps teeth healthy.'),
    Q('Which keeps a child healthy and fresh?', 'Bathing with soap and water', ['Putting on perfume without a bath|GROOM_PERFUME', 'Powdering over dirty skin|GROOM_PERFUME', 'Wearing shiny new shoes|GROOM_EXPENSIVE'], 'Soap and water remove dirt and germs. Scent only covers smell.'),
    Q('Why are fingernails kept short and clean?', 'Dirt and germs hide under long nails', ['Short nails look rich and costly|GROOM_EXPENSIVE', 'Long nails are only for parties|GROOM_SPECIAL', 'Clean nails need special soap|GROOM_EXPENSIVE'], 'Germs hide under dirty nails and can reach food.'),
    Q('Can a child be well groomed in an old but clean shirt?', 'Yes, being clean and neat is what counts', ['No, only new clothes count|GROOM_EXPENSIVE', 'No, only costly clothes count|GROOM_EXPENSIVE', 'No, grooming is for special days|GROOM_SPECIAL'], 'Grooming does not depend on cost.'),
  ], { h: ['Grooming is a habit for every day.', 'Clean body, teeth, hair, nails and clothes.'], s1: 'Think about what keeps the body clean and healthy.' })),
  fam('gr.ha.story', `${GR}GROOMING_HABITS`, 'word', 2, choose([
    Q('Achieng uses much perfume but does not bathe on school days. What should her teacher say?', 'Bathing with soap and water is needed first', ['Perfume is enough to make a child clean|GROOM_PERFUME', 'More perfume is the best answer to this|GROOM_PERFUME', 'Bathing is needed only on special days|GROOM_SPECIAL'], 'Perfume covers smell but does not remove germs.'),
    Q('Mutua says he will groom himself only when going to church or a party. What is the problem?', 'Good grooming is needed every day', ['Nothing, that is enough|GROOM_SPECIAL', 'It is needed only in the dry season|GROOM_SPECIAL', 'Only grown-ups need it daily|GROOM_SPECIAL'], 'Good grooming is a daily health habit.'),
    Q('Wambui says her family cannot afford new clothes, so she cannot be well groomed. What is the best reply?', 'Clean, mended clothes and a clean body are enough', ['She is right, grooming needs brand new clothes|GROOM_EXPENSIVE', 'It needs the most costly clothes in the whole town|GROOM_EXPENSIVE', 'It needs a new school bag and shoes every year|GROOM_EXPENSIVE'], 'Grooming means being clean and neat.'),
    Q('Which daily routine is the best for a school child?', 'Bath, brush teeth, comb hair, wear clean uniform', ['Wear perfume, skip the bath and the toothbrush|GROOM_PERFUME', 'Wear a brand new uniform only once each term|GROOM_EXPENSIVE', 'Bathe only on a Saturday evening each week|GROOM_SPECIAL'], 'These habits are done every day.'),
    Q('Which part of the uniform should be washed often and why?', 'Socks and underwear, to stop germs and smell', ['Only the blazer, so you always look costly|GROOM_EXPENSIVE', 'Only the tie, so you are ready for a party|GROOM_SPECIAL', 'Nothing, because perfume will do instead|GROOM_PERFUME'], 'Clothes next to the skin need washing often.'),
  ], { h: ['What does the body really need to stay clean?', 'Soap, water and clean clothes, every day.'], s1: 'Decide which habit keeps the body clean.' })),

  // ---------------------------------------------------------------- DRESS_ETIQUETTE
  fam('gr.de.which', `${GR}DRESS_ETIQUETTE`, 'direct', 1, choose([
    Q('What is best to wear for farm work at school?', 'Old clothes, gumboots and an apron', ['Your best Sunday clothes|DRESS_SAME', 'Your party dress or suit|DRESS_SAME', 'Your clean white uniform|DRESS_SAME'], 'Dress to suit the job. Best clothes would be spoiled in the mud.'),
    Q('What is the best thing to wear for a games lesson?', 'Sports clothes and strong shoes', ['A tie and a long coat|DRESS_SAME', 'A party dress|DRESS_SAME', 'Your church clothes|DRESS_SAME'], 'Sports clothes let you move freely.'),
    Q('A visitor comes to school. What is good manners?', 'Greet her politely', ['Ignore her, she is a stranger|ETIQ_GREET', 'Hide until she leaves|ETIQ_GREET', 'Stare and say nothing|ETIQ_GREET'], 'A polite greeting shows respect.'),
    Q('Which words show good manners when you ask for something?', 'Please and thank you', ['Give me, I want it|ETIQ_GREET', 'Hurry up and bring it|ETIQ_GREET', 'You must give it to me|ETIQ_GREET'], 'Polite words show respect.'),
    Q('Why do we wear different clothes for different jobs?', 'Each job needs its own kind of clothes', ['One outfit suits every job and place|DRESS_SAME', 'Clothes make no difference to a job|DRESS_SAME', 'Only rich people ever change clothes|DRESS_SAME'], 'Dress should suit the place and the work.'),
  ], { h: ['Think about the activity and the place.', 'Dress to suit the job, and use polite words and greetings.'], s1: 'Match the clothes and manners to the occasion.' })),
  fam('gr.de.story', `${GR}DRESS_ETIQUETTE`, 'word', 2, choose([
    Q('Kamau is going to plant kale at school. What should he wear?', 'Old clothes and gumboots', ['His best shirt and shoes|DRESS_SAME', 'His smart party clothes|DRESS_SAME', 'His church clothes|DRESS_SAME'], 'Old clothes can get muddy.'),
    Q('Amina visits her grandmother in the village. What is good etiquette when she arrives?', 'Greet her warmly and offer to help', ['Walk in without greeting|ETIQ_GREET', 'Play with her phone only|ETIQ_GREET', 'Wait for her to speak first|ETIQ_GREET'], 'Greetings and helping show respect.'),
    Q('Atieno wears the same clothes for the farm, church and sports and says clothes do not matter. What is wrong?', 'Different places need different clothes', ['Nothing, she is quite right about it|DRESS_SAME', 'Only church needs special clothes|DRESS_SAME', 'Only sports need special clothes|DRESS_SAME'], 'Dress should match the activity.'),
    Q('At lunch, the class sits to eat together. Which is good table manners?', 'Wash hands and wait for everyone to be served', ['Start eating before the others have sat|ETIQ_GREET', 'Talk loudly with food in your mouth|ETIQ_GREET', 'Reach across the table for food|ETIQ_GREET'], 'Washing hands and waiting show respect.'),
    Q('Njoroge is shy and does not greet the new teacher. What should his friend say?', 'It is polite to greet people you meet', ['You only greet the people you know|ETIQ_GREET', 'Greetings are only meant for the old|ETIQ_GREET', 'Greetings are just a waste of time|ETIQ_GREET'], 'We greet visitors and new people politely.'),
  ], { h: ['What does the place or person need from you?', 'Dress for the job. Greet and thank people.'], s1: 'Match the clothes and manners to the occasion.' })),

  // ---------------------------------------------------------------- SURFACE_TYPES
  fam('ho.st.which', `${HO}SURFACE_TYPES`, 'direct', 1, choose([
    Q('A floor is made of smooth shiny squares laid side by side. What is it?', 'A tiled floor', ['A cemented floor|SURF_TILE_CEMENT', 'An earthen floor|SURF_TILE_CEMENT', 'A wooden floor|SURF_TILE_CEMENT'], 'Tiles are smooth and glazed squares.'),
    Q('A window pane is smooth and see-through. What is it made of?', 'Glass', ['Wood|SURF_TILE_GLASS', 'Tile|SURF_TILE_GLASS', 'Cement|SURF_TILE_GLASS'], 'Glass lets light through.'),
    Q('A rough, grey, hard floor in a kitchen is probably what?', 'A cemented floor', ['A tiled floor|SURF_TILE_CEMENT', 'A glass floor|SURF_TILE_GLASS', 'A soil floor smeared with mud|SURF_TILE_CEMENT'], 'Cement is rough and grey.'),
    Q('A floor of packed soil, smeared smooth with mud, is called what?', 'An earthen floor', ['A tiled floor|SURF_TILE_CEMENT', 'A cemented floor|SURF_TILE_CEMENT', 'A glass floor|SURF_TILE_GLASS'], 'Many homes have earthen floors.'),
    Q('Which of these is made of wood?', 'A door', ['A window pane|SURF_TILE_GLASS', 'A mirror|SURF_TILE_GLASS', 'A bathroom wall tile|SURF_TILE_GLASS'], 'Doors and tables are often wood. Windows and mirrors are glass.'),
  ], { h: ['Think about how the surface looks and feels.', 'Glass: see-through. Tile: smooth squares. Cement: rough grey. Earth: packed soil. Wood: grain.'], s1: 'Match the look to the material.' })),
  fam('ho.st.story', `${HO}SURFACE_TYPES`, 'word', 2, choose([
    Q('Wanjiru cleans the bathroom wall of smooth shiny squares. What material is the wall?', 'Tiles', ['Cement|SURF_TILE_CEMENT', 'Wood|SURF_TILE_CEMENT', 'Glass|SURF_TILE_GLASS'], 'Shiny glazed squares are tiles.'),
    Q('At Grandmother\'s home in the village, the floor is packed soil. What is it?', 'An earthen floor', ['A tiled floor|SURF_TILE_CEMENT', 'A cemented floor|SURF_TILE_CEMENT', 'A glass floor|SURF_TILE_GLASS'], 'It is made of soil.'),
    Q('Njoki points at the kitchen window and calls it wood. What should her teacher say?', 'It is glass, because it is see-through', ['She is right, it is wood|SURF_TILE_GLASS', 'It is tile, because it is shiny|SURF_TILE_GLASS', 'It is cement, because it is hard|SURF_TILE_GLASS'], 'Glass lets light through.'),
    Q('Otieno says a shiny tiled floor is cement. How can he tell the difference?', 'Tiles are smooth and glazed, cement is rough', ['They look exactly the same|SURF_TILE_CEMENT', 'Cement is shiny, tiles are rough|SURF_TILE_CEMENT', 'Both are made of glass|SURF_TILE_GLASS'], 'Feel the surface.'),
    Q('A school classroom has a rough grey floor that is hard and cool. What is it likely to be?', 'Cement', ['Tile|SURF_TILE_CEMENT', 'Glass|SURF_TILE_GLASS', 'Wood|SURF_TILE_CEMENT'], 'Cement floors are rough and grey.'),
  ], { h: ['Feel and look: smooth or rough, shiny or dull?', 'Glass, tiles, cement, earth and wood each look different.'], s1: 'Decide from the look and feel.' })),

  // ---------------------------------------------------------------- SURFACE_CLEANING
  fam('ho.sc.which', `${HO}SURFACE_CLEANING`, 'direct', 1, choose([
    Q('How should a wooden table be cleaned?', 'Wipe with a damp cloth and dry it', ['Pour lots of water on it|CLEAN_SOAK_WOOD', 'Soak it in a bucket of water|CLEAN_SOAK_WOOD', 'Scrub it hard with a wet brush|CLEAN_SOAK_WOOD'], 'Too much water swells and rots wood.'),
    Q('How is an earthen floor cleaned?', 'Sprinkle a little water and sweep softly', ['Scrub it with plenty of water|CLEAN_EARTH_SCRUB', 'Wash it with a hosepipe|CLEAN_EARTH_SCRUB', 'Scrub it hard with soap|CLEAN_EARTH_SCRUB'], 'Plenty of water turns earth into mud.'),
    Q('After mopping a tiled floor, what should be done?', 'Dry it so that nobody slips', ['Leave it wet to dry alone|CLEAN_WET_SLIP', 'Pour more water on it|CLEAN_WET_SLIP', 'Leave it shiny and wet|CLEAN_WET_SLIP'], 'Wet tiles are slippery.'),
    Q('What comes first in cleaning a cemented floor?', 'Sweep away the dust', ['Scrub it with water|CLEAN_WASH_FIRST', 'Pour water over the dust|CLEAN_WASH_FIRST', 'Mop it wet at once|CLEAN_WASH_FIRST'], 'Sweep or dust first, then wash.'),
    Q('How is a glass window cleaned?', 'Wipe with a damp cloth and dry it', ['Scrub it with a dry brush|CLEAN_SOAK_WOOD', 'Pour water on it and leave it|CLEAN_SOAK_WOOD', 'Rub it with sand|CLEAN_SOAK_WOOD'], 'Drying stops streaks.'),
  ], { h: ['Think about what each material can bear.', 'Wood and earth need little water. Tiles are dried. Dust comes off before washing.'], s1: 'Match the cleaning method to the surface.' })),
  fam('ho.sc.story', `${HO}SURFACE_CLEANING`, 'word', 2, choose([
    Q('Mama Njeri cleans an earthen floor in her home. What should she do?', 'Sprinkle a little water and sweep softly', ['Scrub it with plenty of water|CLEAN_EARTH_SCRUB', 'Pour a bucket of water on it|CLEAN_EARTH_SCRUB', 'Wash it with soap and a brush|CLEAN_EARTH_SCRUB'], 'Too much water makes mud.'),
    Q('Wafula soaks the classroom wooden desks with a bucket of water. What is likely to happen?', 'The wood may swell and rot', ['The desks will shine|CLEAN_SOAK_WOOD', 'The desks will last longer|CLEAN_SOAK_WOOD', 'Nothing will change|CLEAN_SOAK_WOOD'], 'Wipe wood with a damp cloth.'),
    Q('Halima has mopped the tiled kitchen and a visitor nearly slips. What should she have done?', 'Dried the floor or put up a warning', ['Left it wet for longer|CLEAN_WET_SLIP', 'Poured on more water|CLEAN_WET_SLIP', 'Waxed it while wet|CLEAN_WET_SLIP'], 'Wet tiles are slippery.'),
    Q('Baraka pours water on a dusty cement floor and gets mud. What should he have done first?', 'Swept the dust away', ['Scrubbed it harder|CLEAN_WASH_FIRST', 'Poured on more water|CLEAN_WASH_FIRST', 'Left the dust alone|CLEAN_WASH_FIRST'], 'Sweep before washing.'),
    Q('The class cleans the classroom windows. Which is the right order?', 'Wipe with a damp cloth, then dry', ['Dry first, then wipe with water|CLEAN_WASH_FIRST', 'Pour water, then leave it|CLEAN_WASH_FIRST', 'Rub with a dry brush only|CLEAN_WASH_FIRST'], 'Dry the glass to avoid streaks.'),
  ], { h: ['What happens if the surface gets too wet?', 'Match the method to the material.'], s1: 'Think about what the surface can take.' })),

  // ---------------------------------------------------------------- LAUNDRY_STEPS
  fam('la.st.which', `${LA}LAUNDRY_STEPS`, 'direct', 1, choose([
    Q('Which step comes first in laundering clothes?', 'Sorting the clothes', ['Ironing them|LAUN_ORDER', 'Drying them in the sun|LAUN_ORDER', 'Rinsing them|LAUN_ORDER'], 'Sort white and coloured clothes first.'),
    Q('Why wash white and coloured clothes separately?', 'Colour can run and stain the white ones', ['There is no good reason to separate them|LAUN_MIX', 'It only saves soap and water|LAUN_MIX', 'White clothes need cold water only|LAUN_MIX'], 'Colour from new coloured clothes can stain whites.'),
    Q('Why must soap be rinsed out of clothes?', 'Left-over soap makes them stiff and itchy', ['It does not matter at all if soap stays in|LAUN_RINSE', 'Soap left in keeps them clean for much longer|LAUN_RINSE', 'Soap left in makes them softer|LAUN_RINSE'], 'Rinse until the water is clear.'),
    Q('Which is the correct order?', 'Sort, soak, wash, rinse, dry, iron', ['Iron, wash, sort, dry, rinse, soak|LAUN_ORDER', 'Dry, wash, iron, sort, rinse, soak|LAUN_ORDER', 'Wash, iron, rinse, sort, dry, soak|LAUN_ORDER'], 'Washing comes before drying and ironing.'),
    Q('What is checked before washing a shirt?', 'The pockets, for things left inside', ['The colour of the sky above|LAUN_ORDER', 'How old the shirt is, in years|LAUN_ORDER', 'How much the shirt cost in the shop|LAUN_ORDER'], 'Pockets may hold pens or paper that spoil the wash.'),
  ], { h: ['Think about what each step does to the clothes.', 'Sort, soak, wash, rinse, dry, iron.'], s1: 'Put the steps in a sensible order.' })),
  fam('la.st.story', `${LA}LAUNDRY_STEPS`, 'word', 2, choose([
    Q('Wangari has a pile with a white shirt and a new red cloth. What should she do?', 'Wash them separately', ['Wash them together to save water|LAUN_MIX', 'Wash them together in hot water|LAUN_MIX', 'Wash them together in the sun|LAUN_MIX'], 'The red colour may run onto the white shirt.'),
    Q('Otieno finishes washing a shirt. What is the next step?', 'Rinse out the soap', ['Iron it while it is soapy|LAUN_RINSE', 'Hang it with the soap still in|LAUN_RINSE', 'Put it away at once|LAUN_RINSE'], 'Rinse until the water is clear.'),
    Q('A learner irons a dirty shirt and then washes it. What is wrong?', 'The order is wrong: wash, dry, then iron', ['Nothing, the order is fine|LAUN_ORDER', 'Washing is only for the weekend|LAUN_ORDER', 'Ironing comes before sorting|LAUN_ORDER'], 'Wash first, then iron.'),
    Q('Mercy\'s mother says soap left in clothes does not matter. What is the best reply?', 'Soap left in makes cloth stiff and itchy', ['She is right, it does not matter|LAUN_RINSE', 'Soap left in keeps clothes new|LAUN_RINSE', 'Soap left in makes cloth whiter|LAUN_RINSE'], 'Rinse well.'),
    Q('The class does a laundry lesson. Which step is missing: sort, wash, rinse, dry, iron?', 'Soaking in soapy water', ['Cooking the clothes|LAUN_ORDER', 'Burying the clothes|LAUN_ORDER', 'Painting the clothes|LAUN_ORDER'], 'Soaking loosens the dirt before washing.'),
  ], { h: ['What happens to the clothes at each step?', 'Sort, soak, wash, rinse, dry, iron.'], s1: 'Put the steps in the right order.' })),
  fam('la.st.spot', `${LA}LAUNDRY_STEPS`, 'spot', 3, spot([
    S('Faith explains how she washed her uniform. Which step has the mistake?', ['Step 1: I checked the pockets.', '!Step 2: I washed the white shirt with the new red scarf.', 'Step 3: I rinsed until the water was clear.'], 'Wash white and coloured items separately. The colour may run.', 'LAUN_MIX'),
    S('Brian describes washing his socks. Which step has the mistake?', ['Step 1: I soaked them in soapy water.', 'Step 2: I rubbed them clean.', '!Step 3: I hung them up without rinsing the soap.'], 'Rinse out the soap before drying.', 'LAUN_RINSE'),
    S('Salma tells how she did the laundry. Which step has the mistake?', ['Step 1: I sorted the clothes.', '!Step 2: I ironed them while dirty.', 'Step 3: I washed them afterwards.'], 'Wash first, then dry and iron.', 'LAUN_ORDER'),
    S('Joseph explains his laundry day. Which step has the mistake?', ['Step 1: I sorted the white clothes from the coloured ones.', 'Step 2: I washed the whites first.', '!Step 3: I ironed them before they were rinsed.'], 'Rinse, then dry, then iron.', 'LAUN_ORDER'),
    S('Linet tells how she did her washing. Which step has the mistake?', ['Step 1: I took things out of the pockets.', '!Step 2: I put everything in one tub together.', 'Step 3: I rinsed and dried each item.'], 'Sort white from coloured so the colours do not stain.', 'LAUN_MIX'),
  ], { h: ['Which step is out of order, or spoils the clothes?', 'Sort, soak, wash, rinse, dry, iron.'], s1: 'Check each step against the order.' })),

  // ---------------------------------------------------------------- LAUNDRY_CARE
  fam('la.ca.which', `${LA}LAUNDRY_CARE`, 'direct', 1, choose([
    Q('What is best for washing coloured cotton?', 'Cool or warm water', ['Very hot water|CARE_HOT', 'Boiling water every time|CARE_HOT', 'Water as hot as possible|CARE_HOT'], 'Hot water can make colours run.'),
    Q('How should coloured clothes be dried?', 'Inside out in the shade', ['Face out in the hot sun|CARE_SUN', 'Face out on a bright rock|CARE_SUN', 'Face out on the roof at noon|CARE_SUN'], 'Strong sun fades colours.'),
    Q('How is cotton ironed?', 'With a hot iron while a little damp', ['With a cool iron when soaking wet|CARE_IRON', 'With a cold iron when bone dry|CARE_IRON', 'With no iron at all|CARE_IRON'], 'Cotton can take a hot iron.'),
    Q('What does a fast colour mean?', 'The colour does not run in water', ['The colour is very bright|CARE_HOT', 'The colour dries very fast|CARE_HOT', 'The colour is very dark|CARE_HOT'], 'Fast colours stay put.'),
    Q('Why are white cotton clothes dried in the sun?', 'The sun helps keep them bright', ['The sun makes them colourful|CARE_SUN', 'The sun shrinks them nicely|CARE_SUN', 'The sun irons them for you|CARE_IRON'], 'Sunshine whitens cotton.'),
  ], { h: ['What spoils colour, and what keeps white bright?', 'Coloured: cool water, shade, inside out. White: sun.'], s1: 'Think about what the cloth needs.' })),
  fam('la.ca.story', `${LA}LAUNDRY_CARE`, 'word', 2, choose([
    Q('Wangui hangs her blue school shirt in strong sun and the blue fades. What should she do next time?', 'Dry it inside out in the shade', ['Dry it face out at noon|CARE_SUN', 'Dry it in the hottest place|CARE_SUN', 'Dry it on a bright rock|CARE_SUN'], 'Strong sun fades colours.'),
    Q('Kamau uses boiling water for a coloured shirt and the dye runs. What went wrong?', 'The water was too hot for the colour', ['The water was too cool|CARE_HOT', 'The soap was too mild|CARE_HOT', 'The shirt was too dry|CARE_HOT'], 'Use cool or warm water.'),
    Q('Njeri irons a soaking wet cotton shirt on a cool setting. What should she change?', 'Use a hot iron when it is slightly damp', ['Use a cooler iron still|CARE_IRON', 'Iron it while it is dripping|CARE_IRON', 'Do not iron cotton at all|CARE_IRON'], 'Cotton needs heat and a little dampness.'),
    Q('Hassan\'s mother dries the white sheets in the sun. Why?', 'The sun keeps them bright', ['The sun colours them blue|CARE_SUN', 'The sun makes them smaller|CARE_SUN', 'The sun washes them again|CARE_SUN'], 'Sunshine whitens cotton.'),
    Q('Which of these fast coloured items should be washed apart from whites?', 'A new red dress', ['A white towel|CARE_HOT', 'A white sock|CARE_HOT', 'A cream blouse|CARE_HOT'], 'Coloured clothes should be washed apart from white ones.'),
  ], { h: ['What did the cloth need?', 'Coloured: cool water, shade. White: sun. Cotton: hot iron, slightly damp.'], s1: 'Match the care to the cloth.' })),

  // ---------------------------------------------------------------- STITCH_TYPES
  fam('re.st.which', `${RE}STITCH_TYPES`, 'direct', 1, choose([
    Q('Which stitch goes back to meet the last stitch, leaving no gap?', 'Back stitch', ['Running stitch|STITCH_SWAP', 'Tacking stitch|STITCH_SWAP', 'Loose stitch|STITCH_SWAP'], 'Back stitch has no gaps.'),
    Q('Which stitch goes in and out in a straight line with even gaps?', 'Running stitch', ['Back stitch|STITCH_SWAP', 'Double stitch|STITCH_SWAP', 'Cross stitch|STITCH_SWAP'], 'Running stitch is quick, with gaps.'),
    Q('Which stitch is stronger?', 'Back stitch', ['Running stitch|STITCH_RUN_STRONG', 'Both are the same|STITCH_RUN_STRONG', 'Neither is strong|STITCH_RUN_STRONG'], 'Back stitch has no gaps and holds well.'),
    Q('Which stitch leaves gaps between stitches on the front?', 'Running stitch', ['Back stitch|STITCH_BACK_GAPS', 'Both leave gaps|STITCH_BACK_GAPS', 'Neither leaves gaps|STITCH_BACK_GAPS'], 'Running stitch has gaps. Back stitch does not.'),
    Q('Which stitch would you use where the seam will be pulled hard?', 'Back stitch', ['Running stitch|STITCH_RUN_STRONG', 'A single loose stitch|STITCH_RUN_STRONG', 'A pin only|STITCH_RUN_STRONG'], 'Back stitch is strong.'),
  ], { h: ['Picture how the needle moves.', 'Running: in and out with gaps. Back: goes back, no gaps, strong.'], s1: 'Think of the shape of each stitch.' })),
  fam('re.st.story', `${RE}STITCH_TYPES`, 'word', 2, choose([
    Q('Mercy sews quickly in a straight line with even gaps for a light seam. Which stitch is she using?', 'Running stitch', ['Back stitch|STITCH_SWAP', 'Cross stitch|STITCH_SWAP', 'Zigzag stitch|STITCH_SWAP'], 'In and out with gaps is running stitch.'),
    Q('Otieno\'s trouser seam splits when he sits. Which stitch should be used to repair it?', 'Back stitch', ['Running stitch|STITCH_RUN_STRONG', 'A loose tacking stitch|STITCH_RUN_STRONG', 'No stitch|STITCH_RUN_STRONG'], 'Back stitch is strong.'),
    Q('Wafula says running stitch is the strongest stitch. What does his teacher reply?', 'Back stitch is stronger, as it has no gaps', ['He is right|STITCH_RUN_STRONG', 'Both are equally strong|STITCH_RUN_STRONG', 'Neither can hold cloth|STITCH_RUN_STRONG'], 'Back stitch has no gaps.'),
    Q('Njoki looks at the front of her sewing and sees even gaps between stitches. Which stitch is it?', 'Running stitch', ['Back stitch|STITCH_BACK_GAPS', 'Both stitches look the same|STITCH_BACK_GAPS', 'A knot|STITCH_BACK_GAPS'], 'Back stitch has no gaps.'),
    Q('A learner swaps the names of running stitch and back stitch. Which statement is right?', 'Back stitch goes back to meet the last stitch', ['Running stitch goes back each time|STITCH_SWAP', 'Running stitch has no gaps|STITCH_SWAP', 'Back stitch is always loose|STITCH_SWAP'], 'Back stitch doubles back.'),
  ], { h: ['Picture the stitches on the cloth.', 'Running: gaps, quick. Back: no gaps, strong.'], s1: 'Match the stitch with its look and job.' })),

  // ---------------------------------------------------------------- SEAM_REPAIR
  fam('re.sr.which', `${RE}SEAM_REPAIR`, 'direct', 1, choose([
    Q('Which stitch repairs a gaping seam?', 'Back stitch', ['Running stitch|SEAM_RUN', 'Loose tacking|SEAM_RUN', 'No stitch|SEAM_RUN'], 'Use back stitch for strength.'),
    Q('Where should the repair of a gaping seam start?', 'A little before the gap on the sound seam', ['Exactly at the very first gap|SEAM_START', 'In the middle of the open gap|SEAM_START', 'Far away from the gap on the hem|SEAM_START'], 'Start before and end after the gap.'),
    Q('How should you finish the repair?', 'With two small stitches over each other', ['With no stitches at all, just a knot|SEAM_START', 'With one long loose loop of thread|SEAM_START', 'With a big knot on the outside|SEAM_START'], 'Secure the thread so it does not unravel.'),
    Q('How tight should the thread be pulled?', 'Firm but not puckering the cloth', ['As tight as possible|SEAM_TIGHT', 'Tight enough to bunch up|SEAM_TIGHT', 'Very tight, to make it strong|SEAM_TIGHT'], 'Too tight puckers the cloth.'),
    Q('Which thread is best for repairing a blue school shirt?', 'Blue thread that matches the cloth', ['Bright red thread of any kind|SEAM_START', 'Thick white string from the shop|SEAM_START', 'Black wool from an old jersey|SEAM_START'], 'Matching thread hides the repair.'),
  ], { h: ['Think about strength and neatness.', 'Back stitch, start before the gap, secure the end, do not pull too tight.'], s1: 'Think about how to make the repair strong.' })),
  fam('re.sr.story', `${RE}SEAM_REPAIR`, 'word', 2, choose([
    Q('Kamau repairs a split side seam using running stitch, and it splits again. What should he change?', 'Use back stitch', ['Use longer running stitches|SEAM_RUN', 'Use a thinner thread|SEAM_RUN', 'Use no thread|SEAM_RUN'], 'Back stitch is stronger.'),
    Q('Amina starts sewing exactly at the first gap and the seam opens at the end. What went wrong?', 'She did not start before and end after the gap', ['She started in exactly the right place|SEAM_START', 'She used a thread that was too long|SEAM_START', 'She sewed the stitches too neatly|SEAM_START'], 'Overlap the sound seam on both sides.'),
    Q('Njeri pulls the thread tight and the seam puckers. What should she do?', 'Pull it firm but not too tight', ['Pull it even tighter|SEAM_TIGHT', 'Leave it loose, baggy and untidy|SEAM_TIGHT', 'Add many more knots to it|SEAM_TIGHT'], 'Too tight puckers the cloth.'),
    Q('Which plan repairs a gaping seam properly?', 'Matching thread, back stitch, overlap, secure the end', ['Any thread, running stitch, no overlap, no knot|SEAM_RUN', 'Wool, long stitches, no overlap, no knot|SEAM_START', 'Thick string pulled very tight and knotted|SEAM_TIGHT'], 'This plan makes a strong, neat repair.'),
    Q('Atieno has finished sewing. What should she do with the loose thread?', 'Fasten it and trim the end', ['Leave it long and loose|SEAM_START', 'Pull it hard until it snaps|SEAM_TIGHT', 'Tie it to a button|SEAM_START'], 'Secure and trim.'),
  ], { h: ['Which part of the repair was done wrongly?', 'Back stitch, overlap the ends, secure, firm but not tight.'], s1: 'Find what made the repair weak.' }), 'c'),
  fam('re.sr.spot', `${RE}SEAM_REPAIR`, 'spot', 3, spot([
    S('Mwangi explains how he mended a gaping seam. Which step has the mistake?', ['Step 1: I chose thread that matched the cloth.', '!Step 2: I used running stitch to hold the seam.', 'Step 3: I fastened the thread at the end.'], 'Use back stitch for a gaping seam, since it is strong.', 'SEAM_RUN'),
    S('Fatuma describes her repair. Which step has the mistake?', ['Step 1: I turned the garment inside out.', '!Step 2: I started exactly at the gap with no knot.', 'Step 3: I sewed with back stitch.'], 'Start a little before the gap on the sound seam and secure the thread.', 'SEAM_START'),
    S('Peter tells how he repaired his shorts. Which step has the mistake?', ['Step 1: I used back stitch along the gap.', '!Step 2: I pulled each stitch as tight as I could.', 'Step 3: I trimmed the thread.'], 'Pull firm, not tight, or the cloth will pucker.', 'SEAM_TIGHT'),
    S('Grace explains the repair of her skirt. Which step has the mistake?', ['Step 1: I matched the thread colour.', 'Step 2: I used back stitch.', '!Step 3: I stopped sewing exactly at the end of the gap.'], 'Sew a little past the gap, then secure the thread.', 'SEAM_START'),
    S('Brian describes the mending of his shirt. Which step has the mistake?', ['Step 1: I picked up the shirt and found the split.', '!Step 2: I chose running stitch because it is the quickest.', 'Step 3: I fastened the thread.'], 'A split seam needs back stitch, which is stronger.', 'SEAM_RUN'),
  ], { h: ['Which step makes the repair weak?', 'Back stitch, start before the gap, end after it, secure, not too tight.'], s1: 'Check each step for strength.' })),

  // ---------------------------------------------------------------- GARDEN_TYPES
  fam('ga.ty.which', `${GA}GARDEN_TYPES`, 'direct', 1, choose([
    Q('A sack garden is which kind of garden?', 'A vertical garden', ['A horizontal garden|GTYPE_SWAP', 'A flat garden|GTYPE_SWAP', 'A garden on the ground only|GTYPE_SWAP'], 'A sack garden grows crops upwards.'),
    Q('A flat bed of kale at ground level is which kind of garden?', 'A horizontal garden', ['A vertical garden|GTYPE_SWAP', 'A hanging garden|GTYPE_SWAP', 'A wall garden|GTYPE_SWAP'], 'It spreads along the ground.'),
    Q('Which kind of garden needs the least ground?', 'A vertical garden', ['A horizontal garden|GTYPE_NEED_LAND', 'A flat garden|GTYPE_NEED_LAND', 'A big field|GTYPE_NEED_LAND'], 'Vertical gardens grow upwards.'),
    Q('Which of these is a vertical garden?', 'Plastic bottles hung on a wall', ['A flat bed of spinach|GTYPE_SWAP', 'A field of maize|GTYPE_SWAP', 'A seedbed on the ground|GTYPE_SWAP'], 'Hanging bottles use height.'),
    Q('Which of these is a horizontal garden?', 'A flat raised bed of vegetables', ['A tower of tyres filled with soil|GTYPE_SWAP', 'A sack with holes in the sides|GTYPE_SWAP', 'Bottles hung from a rope|GTYPE_SWAP'], 'It lies along the ground.'),
  ], { h: ['Vertical means upwards. Horizontal means flat.', 'Sacks, hanging bottles and towers are vertical.'], s1: 'Picture the direction the garden grows.' })),
  fam('ga.ty.story', `${GA}GARDEN_TYPES`, 'word', 2, choose([
    Q('Wanjiru lives in a town flat with only a small balcony. Which garden suits her best?', 'A vertical garden in sacks or bottles', ['A big horizontal field behind the flat|GTYPE_NEED_LAND', 'A maize shamba on a large plot|GTYPE_NEED_LAND', 'A large flat plot of ground|GTYPE_NEED_LAND'], 'Vertical gardens need little ground.'),
    Q('Otieno says a vertical garden needs more land than a flat one. What is the best reply?', 'It needs less, as it grows upwards', ['He is right, it needs more land|GTYPE_NEED_LAND', 'It needs exactly the same land|GTYPE_NEED_LAND', 'It needs twice as much land|GTYPE_NEED_LAND'], 'It saves ground.'),
    Q('The school fills a sack with soil and plants kale in holes in the sides. What is this?', 'A vertical garden', ['A horizontal garden|GTYPE_SWAP', 'A flat seedbed|GTYPE_SWAP', 'A rice paddy|GTYPE_SWAP'], 'It grows upwards.'),
    Q('Amina makes a flat tray of spinach on the ground. Which garden is it?', 'A horizontal garden', ['A vertical garden|GTYPE_SWAP', 'A wall garden|GTYPE_SWAP', 'A hanging garden|GTYPE_SWAP'], 'It lies flat on the ground.'),
    Q('A class has a small compound and many learners. Which choice helps them grow the most crops?', 'Vertical gardens on walls and sacks', ['One big flat plot at the school|GTYPE_NEED_LAND', 'A flat plot far away from school|GTYPE_NEED_LAND', 'No gardens, as there is no room|GTYPE_NEED_LAND'], 'Vertical gardens use height.'),
  ], { h: ['How much ground does the garden need?', 'Vertical: upwards, little ground. Horizontal: flat on the ground.'], s1: 'Think about space.' })),

  // ---------------------------------------------------------------- GARDEN_BUILD
  fam('ga.bu.which', `${GA}GARDEN_BUILD`, 'direct', 1, choose([
    Q('Which crop suits a sack garden?', 'Kale', ['Maize|GBUILD_ANY_CROP', 'Cassava|GBUILD_ANY_CROP', 'Sweet potato|GBUILD_ANY_CROP'], 'Small crops with shallow roots grow well in a sack.'),
    Q('Why is a column of stones placed in the middle of a sack garden?', 'To let water reach the lower soil', ['For decoration only|GBUILD_DRAIN', 'To make the sack heavier|GBUILD_DRAIN', 'To keep the kale from growing|GBUILD_DRAIN'], 'The stones spread water through the sack.'),
    Q('How often does a sack garden need water?', 'Regularly, through the stone column', ['Never, the sack keeps it|GBUILD_NO_WATER', 'Only once a year|GBUILD_NO_WATER', 'Only when it is cold|GBUILD_NO_WATER'], 'It dries quickly and needs regular watering.'),
    Q('What is made in plastic bottles before planting?', 'Small holes for drainage', ['No holes at all|GBUILD_DRAIN', 'Large holes in the base|GBUILD_DRAIN', 'A hole for the seeds only|GBUILD_DRAIN'], 'Extra water must be able to drain out.'),
    Q('Which of these crops is a good choice for a vertical garden?', 'Spinach', ['Maize|GBUILD_ANY_CROP', 'Bananas|GBUILD_ANY_CROP', 'Sugarcane|GBUILD_ANY_CROP'], 'Spinach is small and has shallow roots.'),
  ], { h: ['Think about the size of the roots and the water.', 'Small crops, a stone column, drainage holes, regular watering.'], s1: 'Think about what the small garden needs.' })),
  fam('ga.bu.story', `${GA}GARDEN_BUILD`, 'word', 2, choose([
    Q('Kamau plants maize in a sack garden and it grows poorly. Why?', 'Maize is too big for a sack', ['Maize needs almost no water|GBUILD_ANY_CROP', 'The sack was far too clean|GBUILD_ANY_CROP', 'The sack was too wide|GBUILD_ANY_CROP'], 'Choose small, shallow-rooted crops.'),
    Q('Njeri\'s sack garden is dry at the bottom and wet at the top. What did she leave out?', 'The column of stones for watering', ['A bag of salt poured on top|GBUILD_DRAIN', 'A layer of sand spread on the top|GBUILD_DRAIN', 'A second sack to hold the first one|GBUILD_DRAIN'], 'The column spreads water down.'),
    Q('Wafula thinks his vertical garden needs no watering. What will happen?', 'It will dry out and the crops will wilt', ['It will grow very well on its own|GBUILD_NO_WATER', 'It will grow bigger if kept dark|GBUILD_NO_WATER', 'It will turn into a small pond|GBUILD_NO_WATER'], 'Small gardens dry fast.'),
    Q('Amina fills bottles with soil but makes no holes at the bottom. What may happen?', 'The soil stays too wet and the roots rot', ['The soil will dry out at once|GBUILD_DRAIN', 'The crops will grow much faster|GBUILD_DRAIN', 'The bottles will float away in rain|GBUILD_DRAIN'], 'Water needs a way out.'),
    Q('The school plans a sack garden. Which plan is best?', 'Stone column, soil with manure, kale in side holes', ['Solid soil only, with maize planted on top|GBUILD_ANY_CROP', 'Sand only, with cassava in the side holes|GBUILD_ANY_CROP', 'No holes, no stone column and no watering|GBUILD_NO_WATER'], 'This plan lets water reach all the plants.'),
  ], { h: ['What does the small garden need to live?', 'Small crops, stone column, drainage, regular water.'], s1: 'Find what the garden is missing.' })),
  fam('ga.bu.spot', `${GA}GARDEN_BUILD`, 'spot', 3, spot([
    S('Mercy explains how the class built a sack garden. Which step has the mistake?', ['Step 1: We put a column of stones in the middle.', 'Step 2: We filled around it with soil and manure.', '!Step 3: We planted maize in the side holes.'], 'Maize is too big. Choose kale, spinach or spring onions.', 'GBUILD_ANY_CROP'),
    S('Brian describes his bottle garden. Which step has the mistake?', ['Step 1: I cut a window in the bottle.', '!Step 2: I filled it with soil and made no drainage holes.', 'Step 3: I hung it on the wall.'], 'Make small holes so extra water can drain out.', 'GBUILD_DRAIN'),
    S('Fatuma tells how she cared for the sack garden. Which step has the mistake?', ['Step 1: I filled the sack with soil and manure.', 'Step 2: I planted spinach in the side holes.', '!Step 3: I decided it needs no watering, because the sack holds water for ever.'], 'A sack garden dries quickly. Water it regularly through the stone column.', 'GBUILD_NO_WATER'),
    S('Peter explains his plan. Which step has the mistake?', ['Step 1: I chose kale.', '!Step 2: I left out the stone column so the soil would be solid.', 'Step 3: I watered the top every morning.'], 'Without the column, water does not reach the lower soil.', 'GBUILD_DRAIN'),
    S('Grace describes her vertical garden. Which step has the mistake?', ['Step 1: I used a sack on a small patch of ground.', 'Step 2: I put in a stone column.', '!Step 3: I planted cassava in the sides.'], 'Cassava has big roots. Choose small crops.', 'GBUILD_ANY_CROP'),
  ], { h: ['Which step would harm the garden?', 'Small crops, stone column, drainage, regular water.'], s1: 'Check each step against what the garden needs.' })),
];
