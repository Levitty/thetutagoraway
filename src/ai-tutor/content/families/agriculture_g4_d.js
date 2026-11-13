// ============================================================================
// GRADE 4 AGRICULTURE AND NUTRITION, STRANDS 3 AND 4: HYGIENE PRACTICES AND PRODUCTION TECHNIQUES (8 skills).
// Personal hygiene and hand washing, cleaning the home, protective clothing and its care, tacking stitches.
// The practical halves (washing hands, cleaning a room, cleaning protective clothing, making an item with tacking) are tasks for the
// teacher: see docs/qa/agriculture-g4-non-question-outcomes-2026-11-12.md. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, Q, S } from './agriculture_g4_lib.js';

const PE = 'HYGIEN.PERSONAL_HYGIENE.', DO = 'HYGIEN.DOMESTIC_HYGIENE.', PP = 'HYGIEN.CLEANING_PERSONAL_PROTEC.', TA = 'PRODUC.MAKING_TACKING_STITCHES.';

export const FAMILIES = [
  // ---------------------------------------------------------------- HYGIENE_PRACTICES
  fam('hyg.pract.which', `${PE}HYGIENE_PRACTICES`, 'direct', 1, choose([
    Q('Which keeps the body clean?', 'Bathing with soap and water', ['Putting on perfume|HP_PERFUME', 'Putting on body oil only|HP_PERFUME', 'Putting on powder|HP_PERFUME'], 'Soap and water take dirt and germs off the body.'),
    Q('How often should teeth be brushed?', 'In the morning and at night', ['Once a week|HP_RARE', 'Only on Sundays|HP_RARE', 'Only when they hurt|HP_RARE'], 'Brush teeth in the morning and at night.'),
    Q('Why must hands that look clean still be washed before eating?', 'Germs are too small to see', ['Hands that look clean cannot have germs|HP_HANDS', 'Dirty hands taste better|HP_HANDS', 'Soap is free|HP_HANDS'], 'Wash before eating even if the hands look clean.'),
    Q('Which of these is a healthy practice?', 'Keeping the nails short and clean', ['Letting nails grow long and dirty|HP_HANDS', 'Biting the nails|HP_HANDS', 'Wearing the same shirt all week|HP_RARE'], 'Short clean nails hold less dirt.'),
    Q('How often should the body be bathed?', 'Every day', ['Once a month|HP_RARE', 'Only when it smells|HP_PERFUME', 'Only on special days|HP_RARE'], 'Bathe every day.'),
  ], { h: ['What really takes away dirt and germs?', 'Soap and water, brushing teeth, clean nails and clean clothes.'], s1: 'Think about what really cleans.' })),
  fam('hyg.pract.story', `${PE}HYGIENE_PRACTICES`, 'word', 2, choose([
    Q('Mutua sprays perfume instead of bathing before school. What is the best advice?', 'Perfume only hides the smell, so bathe with soap', ['Perfume cleans the skin well|HP_PERFUME', 'Perfume is better than soap|HP_PERFUME', 'Bathing is only for weekends|HP_RARE'], 'Perfume does not remove dirt or germs.'),
    Q('Njoki brushes her teeth once each week. What should she do?', 'Brush in the morning and at night', ['Brush once a month|HP_RARE', 'Never brush if there is no pain|HP_RARE', 'Brush only on Sundays|HP_RARE'], 'Brush teeth twice a day.'),
    Q('Ali says his hands look clean so he will skip washing before lunch. What is the best reply?', 'Germs are too small to see, so wash with soap', ['Right, clean-looking hands are safe|HP_HANDS', 'Right, soap spoils the food|HP_HANDS', 'Right, only dirty hands carry germs|HP_HANDS'], 'You cannot see germs.'),
    Q('Which girl is keeping herself clean?', 'The one who bathes every day and wears clean clothes', ['The one who wears perfume to hide dirt|HP_PERFUME', 'The one who bathes once a week|HP_RARE', 'The one with clean-looking hands who never washes|HP_HANDS'], 'Daily washing and clean clothes keep the body healthy.'),
    Q('Which habit helps to prevent tooth decay?', 'Brushing teeth morning and night', ['Brushing once a week|HP_RARE', 'Using perfume|HP_PERFUME', 'Wiping with a dry cloth only|HP_HANDS'], 'Daily brushing keeps teeth healthy.'),
  ], { h: ['What really cleans the body?', 'Washing with soap and water, regular brushing, clean clothes.'], s1: 'Think about which habit really cleans.' })),

  // ---------------------------------------------------------------- HAND_WASHING
  fam('hyg.hand.which', `${PE}HAND_WASHING`, 'direct', 1, choose([
    Q('What do we use to wash hands properly?', 'Soap and clean water', ['Water only|HW_NOSOAP', 'A dry cloth|HW_NOSOAP', 'Sand only|HW_NOSOAP'], 'Soap lifts dirt and germs off the skin.'),
    Q('What is the right time to rub soap on the hands?', 'About as long as a short song', ['One second, a quick dip is enough|HW_QUICK', 'No need to rub them at all|HW_QUICK', 'Until all the soap has gone|HW_QUICK'], 'Rub all parts of the hands for a short song.'),
    Q('When must hands be washed?', 'Before eating and after the toilet', ['After eating only, not before it|HW_BEFORE', 'Only on Sundays and holidays|HW_BEFORE', 'Only when they look very dirty|HW_BEFORE'], 'Wash before eating or cooking, and after the toilet.'),
    Q('Which part of the hands must be washed too?', 'Between fingers, under nails', ['Only the palms of the hands|HW_QUICK', 'Only the backs of the hands|HW_QUICK', 'Only the thumbs and the wrists|HW_QUICK'], 'Germs hide between the fingers and under the nails.'),
    Q('After washing, hands are dried with what?', 'A clean cloth or the air', ['Your dirty clothes|HW_QUICK', 'A dirty rag|HW_QUICK', 'The soil|HW_QUICK'], 'A dirty cloth puts germs back on clean hands.'),
  ], { h: ['What cleans hands well?', 'Soap, rubbing all parts, rinsing, and washing at the right times.'], s1: 'Think about how to wash well.' })),
  fam('hyg.hand.story', `${PE}HAND_WASHING`, 'word', 2, choose([
    Q('Kamau rinses his hands in water only before lunch. What is missing?', 'Soap', ['A dry cloth|HW_NOSOAP', 'More water|HW_NOSOAP', 'Nothing, water is enough|HW_NOSOAP'], 'Soap lifts dirt and germs.'),
    Q('Sofia dips her hands in the basin and takes them out at once. What should she do?', 'Rub soap on all parts for a short song', ['Do the same dip twice as fast|HW_QUICK', 'Keep the dip in the water longer|HW_QUICK', 'Nothing, a quick dip is enough|HW_QUICK'], 'Rubbing takes time.'),
    Q('Brian washes his hands only after eating. When else should he wash?', 'Before eating', ['Never|HW_BEFORE', 'Only on Fridays|HW_BEFORE', 'Only after playing|HW_BEFORE'], 'Wash before eating too.'),
    Q('Why must we wash hands after using the toilet?', 'To remove germs that cause sickness', ['To make them smell nice and fresh|HW_NOSOAP', 'To make them feel cold and wet|HW_NOSOAP', 'To use up the water in the basin|HW_NOSOAP'], 'Germs from the toilet can make people ill.'),
    Q('A class washes hands before the school meal. What do they do first?', 'Wet the hands with clean water', ['Dry them with a dirty rag|HW_QUICK', 'Rub them on the classroom wall|HW_QUICK', 'Put on gloves without washing|HW_QUICK'], 'The first step is to wet the hands.'),
  ], { h: ['What did the child leave out?', 'Wet, soap, rub all parts, rinse, dry on a clean cloth.'], s1: 'Find the step that is missing or wrong.' })),
  fam('hyg.hand.spot', `${PE}HAND_WASHING`, 'spot', 3, spot([
    S('Mumbi shows how she washes her hands. Which step has the mistake?', ['Step 1: I wet my hands with clean water.', '!Step 2: I rub them with no soap.', 'Step 3: I rinse and dry them on a clean cloth.'], 'Use soap. It lifts dirt and germs.', 'HW_NOSOAP'),
    S('Tony explains hand washing. Which step has the mistake?', ['Step 1: I wet my hands.', '!Step 2: I rub them for one second.', 'Step 3: I rinse them.'], 'Rub soap on all parts of the hands for about a short song.', 'HW_QUICK'),
    S('Diana says when to wash hands. Which step has the mistake?', ['Step 1: I wash after using the toilet.', '!Step 2: I wash after eating but not before.', 'Step 3: I wash after playing outside.'], 'Wash before eating too.', 'HW_BEFORE'),
    S('Victor describes washing before cooking. Which step has the mistake?', ['Step 1: I wet my hands.', 'Step 2: I rub soap between my fingers and under my nails.', '!Step 3: I wipe my hands on my dirty apron.'], 'Dry hands on a clean cloth, not a dirty one.', 'HW_QUICK'),
    S('Beth tells why she uses soap. Which step has the mistake?', ['Step 1: Soap lifts dirt off the skin.', 'Step 2: It takes germs away.', '!Step 3: Water alone does the same job.'], 'Water alone does not remove germs well. Use soap.', 'HW_NOSOAP'),
  ], { h: ['Which step skips soap, time or the right moment?', 'Wet, soap, rub, rinse, dry.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- CLEANING_METHODS
  fam('home.clean.which', `${DO}CLEANING_METHODS`, 'direct', 1, choose([
    Q('Which method removes dry dirt from a floor?', 'Sweeping', ['Mopping|CLM_MIX', 'Dusting|CLM_MIX', 'Washing clothes|CLM_MIX'], 'Sweeping removes dry dirt with a broom.'),
    Q('What is dusting?', 'Wiping dust off shelves and furniture', ['Sweeping the compound outside|CLM_DUST', 'Digging the garden|CLM_DUST', 'Washing the floor with water|CLM_DUST'], 'Dusting wipes furniture with a cloth.'),
    Q('Where should rubbish from the house go?', 'Into a bin or a rubbish pit', ['Anywhere outside, the wind will take it|CLM_RUBBISH', 'Into the river|CLM_RUBBISH', 'Under the bed|CLM_RUBBISH'], 'Loose rubbish attracts flies and rats.'),
    Q('Which method cleans a floor with a wet cloth and water?', 'Mopping', ['Sweeping|CLM_MIX', 'Dusting|CLM_DUST', 'Scattering|CLM_MIX'], 'Mopping uses a wet cloth.'),
    Q('Which of these cleans dirty plates?', 'Washing with water and soap', ['Sweeping|CLM_MIX', 'Dusting|CLM_DUST', 'Wiping with a dry cloth only|CLM_MIX'], 'Washing removes grease and food.'),
  ], { h: ['Which job is it: dry dirt, dust, wet cleaning or washing?', 'Sweep for dry dirt, mop for a wet clean, dust for furniture, wash plates.'], s1: 'Think about the kind of dirt.' })),
  fam('home.clean.story', `${DO}CLEANING_METHODS`, 'word', 2, choose([
    Q('Mama Achieng uses a broom on a dry dusty floor. Which method is this?', 'Sweeping', ['Mopping|CLM_MIX', 'Dusting|CLM_DUST', 'Washing|CLM_MIX'], 'A broom sweeps dry dirt.'),
    Q('Peter wipes the table and shelves with a cloth. What is this called?', 'Dusting', ['Sweeping|CLM_DUST', 'Mopping|CLM_MIX', 'Digging|CLM_DUST'], 'Dusting wipes furniture.'),
    Q('The class puts banana peelings and paper into a bin. Why?', 'Loose rubbish attracts flies and rats', ['Wind carries bins away|CLM_RUBBISH', 'Rubbish should be thrown anywhere|CLM_RUBBISH', 'Rubbish is good for rats|CLM_RUBBISH'], 'A bin keeps rubbish in one place.'),
    Q('A muddy kitchen floor needs a clean with water. What should Rehema do?', 'Mop it with a wet cloth', ['Dust it|CLM_DUST', 'Sweep it dry only|CLM_MIX', 'Leave it|CLM_RUBBISH'], 'Mopping cleans a floor with water.'),
    Q('Mr Kiprono tells the children to sweep the classroom. What does sweeping remove?', 'Dry dirt', ['Wet mud only|CLM_MIX', 'Dishes|CLM_MIX', 'Germs from hands|CLM_MIX'], 'Sweeping removes dry dirt.'),
  ], { h: ['What kind of job is it?', 'Sweeping is for dry dirt. Mopping is for a wet clean. Dusting is for furniture.'], s1: 'Name the method from the job.' })),

  // ---------------------------------------------------------------- CLEANING_ORDER
  fam('home.order.which', `${DO}CLEANING_ORDER`, 'direct', 1, choose([
    Q('Which job comes first when cleaning a room?', 'Dusting the shelves', ['Sweeping the floor|CO_FLOOR', 'Mopping the floor|CO_FLOOR', 'Washing the cloths|CO_FLOOR'], 'Dust falls to the floor, so dust first.'),
    Q('What comes first, sweeping or mopping?', 'Sweeping', ['Mopping|CO_MOP', 'Both at the same time|CO_MOP', 'Neither|CO_MOP'], 'Sweep to lift dry dirt, then mop.'),
    Q('Which should be washed first?', 'The cups and plates', ['The greasy sufuria|CO_GREASY', 'The dirtiest pot|CO_GREASY', 'The frying pan|CO_GREASY'], 'Clean things first, greasy pots last.'),
    Q('What is the right tool for sweeping dry dirt?', 'A broom', ['A mop|CO_MOP', 'A wet cloth|CO_MOP', 'A bucket|CO_MOP'], 'A broom is for dry dirt.'),
    Q('What is done last when cleaning a floor?', 'Mopping', ['Sweeping|CO_MOP', 'Dusting shelves|CO_FLOOR', 'Opening the windows|CO_FLOOR'], 'Mop last so the floor comes out clean.'),
  ], { h: ['Dust falls down, so start high. Dry dirt before wet cleaning.', 'Wash cleaner things first, greasy last.'], s1: 'Think about where the dirt falls and goes.' })),
  fam('home.order.story', `${DO}CLEANING_ORDER`, 'word', 2, choose([
    Q('Wanjiru swept the floor and then dusted the shelf. What happened to the floor?', 'Dust fell on it again', ['Nothing happened|CO_FLOOR', 'It became cleaner|CO_FLOOR', 'It dried faster|CO_FLOOR'], 'Dust the shelves before sweeping.'),
    Q('Sam mopped a dusty floor and got mud. What should he have done first?', 'Swept it', ['Mopped twice|CO_MOP', 'Dusted the shelves|CO_FLOOR', 'Washed the cloth|CO_MOP'], 'Sweep first, mop last.'),
    Q('Joyce washes the greasy sufuria first in the basin. What happens to the plates?', 'The water is greasy and they stay greasy', ['They become cleaner|CO_GREASY', 'They shine|CO_GREASY', 'Nothing happens|CO_GREASY'], 'Wash plates first and greasy pots last.'),
    Q('Which order of cleaning a room is best?', 'Open windows, dust, sweep, mop', ['Mop, sweep, dust, open windows|CO_MOP', 'Sweep, dust, mop|CO_FLOOR', 'Mop, dust, sweep|CO_MOP'], 'High to low and dry before wet.'),
    Q('Mercy picks a broom for a dry floor and a mop for a wet clean. Is she right?', 'Yes, a broom is for dry dirt and a mop for a wet clean', ['No, a mop is for dry dirt|CO_MOP', 'No, a broom is for water|CO_MOP', 'No, both do the same job|CO_MOP'], 'She has the tools right.'),
  ], { h: ['Where does the dirt go? Dry before wet. Cleaner before greasy.', 'Dust high, sweep, then mop.'], s1: 'Find the right order.' })),
  fam('home.order.spot', `${DO}CLEANING_ORDER`, 'spot', 3, spot([
    S('Grace explains how she cleans a room. Which step has the mistake?', ['Step 1: I open the windows.', '!Step 2: I sweep the floor before dusting the shelves.', 'Step 3: I mop last.'], 'Dust the shelves first, because dust falls on the floor.', 'CO_FLOOR'),
    S('Otieno explains cleaning a floor. Which step has the mistake?', ['Step 1: I dust the shelves.', '!Step 2: I mop the floor, then sweep.', 'Step 3: I wash the cloth.'], 'Sweep first. Mop last.', 'CO_MOP'),
    S('Salome washes up after supper. Which step has the mistake?', ['Step 1: I scrape the plates.', '!Step 2: I wash the greasy sufuria first.', 'Step 3: I dry and put the things away.'], 'Wash the cups and plates first and the greasy pots last.', 'CO_GREASY'),
    S('Pius describes cleaning the classroom. Which step has the mistake?', ['Step 1: I dust the desks.', 'Step 2: I sweep the floor.', '!Step 3: I sweep again after mopping, to finish.'], 'Mop is last. Sweeping after mopping dirties the floor.', 'CO_MOP'),
    S('Linet says how to clean the kitchen. Which step has the mistake?', ['Step 1: I wash the cups first.', 'Step 2: I wash the plates next.', '!Step 3: I wash the greasy pot first to get it done.'], 'Greasy pots go last.', 'CO_GREASY'),
  ], { h: ['Which step is in the wrong order?', 'High before low, dry before wet, clean before greasy.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- PPE_ITEMS
  fam('ppe.item.which', `${PP}PPE_ITEMS`, 'direct', 1, choose([
    Q('Which item protects the eyes?', 'Goggles', ['Gloves|PI_MATCH', 'Gumboots|PI_MATCH', 'An apron|PI_MATCH'], 'Goggles protect the eyes.'),
    Q('Why does a farmer wear a face mask when spraying?', 'To keep the spray out of the nose and mouth', ['To look smart|PI_FASHION', 'To keep warm|PI_FASHION', 'To hide the face|PI_FASHION'], 'A mask protects the nose and mouth.'),
    Q('Which footwear protects a farmer in wet muddy ground?', 'Gumboots', ['Open sandals|PI_SANDALS', 'No shoes at all|PI_SANDALS', 'Flip-flops|PI_SANDALS'], 'Gumboots cover the whole foot.'),
    Q('Which item protects the hands?', 'Gloves', ['Goggles|PI_MATCH', 'A hat|PI_MATCH', 'A mask|PI_MATCH'], 'Gloves protect the hands.'),
    Q('Why do cooks and farmers wear an apron or overall?', 'To keep dirt off their clothes and skin', ['To look smart for visitors|PI_FASHION', 'To keep the sun away from the eyes|PI_MATCH', 'To go to a party|PI_FASHION'], 'An apron protects clothes and skin.'),
  ], { h: ['Which body part does the item cover?', 'Goggles: eyes. Gloves: hands. Gumboots: the whole foot. Mask: nose and mouth. Apron: body.'], s1: 'Think about which body part each item covers.' })),
  fam('ppe.item.story', `${PP}PPE_ITEMS`, 'word', 2, choose([
    Q('Mama Rehema sprays the beans with medicine. What should she wear over her nose and mouth?', 'A mask', ['Goggles only|PI_MATCH', 'Gloves only|PI_MATCH', 'Perfume|PI_FASHION'], 'A mask keeps the spray out of the nose and mouth.'),
    Q('Wafula goes to work in wet muddy ground. Which footwear should he wear?', 'Gumboots', ['Open sandals|PI_SANDALS', 'No shoes at all|PI_SANDALS', 'Dress shoes|PI_SANDALS'], 'Gumboots keep out mud, thorns and snakes.'),
    Q('Brenda says protective clothing is just for looks. What is the best reply?', 'It keeps dirt, germs and chemicals off the body', ['She is right, it is for looks|PI_FASHION', 'It is for parties|PI_FASHION', 'It is for hiding|PI_FASHION'], 'Protective clothing protects the body.'),
    Q('A boy cuts thorny hedge and needs to protect his hands. Which item should he wear?', 'Gloves', ['Goggles|PI_MATCH', 'A hat|PI_MATCH', 'Gumboots|PI_MATCH'], 'Gloves protect the hands from thorns.'),
    Q('Mr Karimi grinds grain and dust flies. What should he wear to protect his eyes?', 'Goggles', ['Gumboots|PI_MATCH', 'Gloves|PI_MATCH', 'A mask|PI_MATCH'], 'Goggles protect the eyes from dust.'),
  ], { h: ['What does the job put at risk?', 'Match the item to the body part.'], s1: 'Match the job with the right protection.' })),

  // ---------------------------------------------------------------- PPE_CARE
  fam('ppe.care.which', `${PP}PPE_CARE`, 'direct', 1, choose([
    Q('What is done with a muddy apron after work?', 'Wash it with soap and water', ['Hang it away just as it is|PC_DIRTY', 'Fold it up while it is dirty|PC_DIRTY', 'Throw it away in the bin|PC_DIRTY'], 'Dirty protective clothing keeps germs and chemicals.'),
    Q('How should washed gloves be stored?', 'Fully dry, in a clean, dry place', ['Packed away while still wet|PC_WET', 'Put away in a bag that is wet|PC_WET', 'Left outside in the mud and rain|PC_WET'], 'Wet items grow mould and smell.'),
    Q('Two children want the same dirty gloves. What is best?', 'Wash them first, or use a clean pair', ['Share them, gloves are just gloves|PC_SHARE', 'Share them without washing them|PC_SHARE', 'Wear one glove each, left and right|PC_SHARE'], 'Dirty clothing can pass germs.'),
    Q('Why are gumboots washed after use?', 'To remove mud and germs', ['To make them wet|PC_DIRTY', 'To fit them tighter|PC_DIRTY', 'To hide them|PC_DIRTY'], 'Mud and germs stay on boots if not washed.'),
    Q('Where should clean protective clothing be kept?', 'In a clean, dry place', ['In a wet corner|PC_WET', 'In the mud|PC_DIRTY', 'On the ground|PC_DIRTY'], 'A dry clean place keeps it fresh.'),
  ], { h: ['Is the item clean and dry before it is put away?', 'Wash, rinse, dry, store.'], s1: 'Think about what keeps germs and chemicals away.' })),
  fam('ppe.care.story', `${PP}PPE_CARE`, 'word', 2, choose([
    Q('Faith puts her muddy apron in the cupboard without washing it. What will happen?', 'It will smell and keep the germs', ['It will clean itself in the dark|PC_DIRTY', 'It will become as good as new|PC_DIRTY', 'Nothing at all will happen to it|PC_DIRTY'], 'Wash it after use.'),
    Q('Kevin packs wet gloves into a bag and finds them mouldy later. What went wrong?', 'He stored them while wet', ['He dried them too well|PC_WET', 'He washed them too much|PC_WET', 'They were new|PC_WET'], 'Dry gloves before storing.'),
    Q('Njeri used a mask while spraying. Her friend wants it next. What should Njeri do?', 'Wash it, or get a clean one', ['Hand it over just as it is|PC_SHARE', 'Wipe it quickly on her skirt|PC_SHARE', 'Share it without any washing|PC_SHARE'], 'A dirty mask can hold chemicals.'),
    Q('What is the first step in cleaning muddy gumboots?', 'Rinse off the mud', ['Put them away|PC_DIRTY', 'Wear them again|PC_DIRTY', 'Leave the mud on|PC_DIRTY'], 'Remove mud first, then wash.'),
    Q('Why do we scrub rubber gloves and boots with soap?', 'To remove dirt and germs', ['To make them slippery and shiny|PC_DIRTY', 'To make them thin and light|PC_DIRTY', 'To use up the soap in the house|PC_DIRTY'], 'Soap cleans them well.'),
  ], { h: ['What should be done before putting it away?', 'Wash, dry, store clean. Do not share dirty items.'], s1: 'Think about what keeps the item clean.' })),
  fam('ppe.care.spot', `${PP}PPE_CARE`, 'spot', 3, spot([
    S('Leah explains how she cleans her apron. Which step has the mistake?', ['Step 1: I shake off the dirt.', '!Step 2: I put it away without washing.', 'Step 3: I hang it in a clean dry place.'], 'Wash it with soap and water first.', 'PC_DIRTY'),
    S('Moses tells how he cares for his gloves. Which step has the mistake?', ['Step 1: I wash them with soap.', 'Step 2: I rinse them.', '!Step 3: I pack them away while they are still wet.'], 'Dry them fully before storing.', 'PC_WET'),
    S('Nelly explains using a shared mask. Which step has the mistake?', ['Step 1: I use the mask for spraying.', '!Step 2: I hand the dirty mask to my friend.', 'Step 3: I wash my hands after.'], 'Wash it first or give a clean one.', 'PC_SHARE'),
    S('Oscar tells how he cleans his gumboots. Which step has the mistake?', ['Step 1: I rinse off the mud.', '!Step 2: I put them away with the mud on.', 'Step 3: I wash my hands.'], 'Scrub and wash the boots before storing them.', 'PC_DIRTY'),
    S('Pauline tells how she stores her hat and apron. Which step has the mistake?', ['Step 1: I wash them.', 'Step 2: I dry them in the sun.', '!Step 3: I fold them while they are still damp.'], 'They must be fully dry before storing.', 'PC_WET'),
  ], { h: ['Which step skips washing, drying or cleanliness?', 'Wash, rinse, dry, store. Never share dirty items.'], s1: 'Check each step against what you know.' })),

  // ---------------------------------------------------------------- TACK_TYPES
  fam('tack.type.which', `${TA}TACK_TYPES`, 'direct', 1, choose([
    Q('What is tacking used for?', 'To hold the cloth together for a short time', ['To join the cloth for good|TT_PERM', 'To make the cloth stronger forever|TT_PERM', 'To decorate the cloth|TT_PERM'], 'Tacking is temporary.'),
    Q('Which tacking has long stitches on top and short stitches underneath?', 'Uneven tacking', ['Even tacking|TT_NAME', 'Diagonal tacking|TT_NAME', 'Back stitch|TT_NAME'], 'Uneven tacking has long top stitches and short ones underneath.'),
    Q('What are tacking stitches like?', 'Long and loose', ['Tiny and tight|TT_SMALL', 'Tiny and strong|TT_SMALL', 'Short and tight|TT_SMALL'], 'They are easy to make and to take out.'),
    Q('Which tacking has stitches and gaps of the same length?', 'Even tacking', ['Uneven tacking|TT_NAME', 'Diagonal tacking|TT_NAME', 'Running stitch|TT_NAME'], 'Even tacking has equal stitches.'),
    Q('Which tacking makes slanting stitches to hold the layers flat?', 'Diagonal tacking', ['Even tacking|TT_NAME', 'Uneven tacking|TT_NAME', 'Back stitch|TT_NAME'], 'Diagonal tacking slants.'),
  ], { h: ['Tacking is a guide, not the final stitching.', 'Even: same lengths. Uneven: long on top, short underneath. Diagonal: slanting.'], s1: 'Think about what tacking is for and how it looks.' })),
  fam('tack.type.story', `${TA}TACK_TYPES`, 'word', 2, choose([
    Q('Mama Fatuma tacks two pieces of cloth before sewing. Why?', 'To hold them in place until she sews', ['To join them for good|TT_PERM', 'To make the stitches strong|TT_PERM', 'To decorate the cloth|TT_PERM'], 'Tacking is temporary.'),
    Q('Joy makes stitches that are the same length with the same gaps. Which tacking is this?', 'Even tacking', ['Uneven tacking|TT_NAME', 'Diagonal tacking|TT_NAME', 'Strong stitching|TT_SMALL'], 'Even tacking is equal.'),
    Q('Wesley says tacking stitches should be tiny and tight. What is the best reply?', 'Tacking is long and loose so it comes out easily', ['He is right, tiny and tight|TT_SMALL', 'Tacking is strong forever|TT_PERM', 'Tacking is the same as back stitch|TT_SMALL'], 'Tacking is easy to remove.'),
    Q('A tailor sews slanting stitches over the layers of a thick cloth. Which tacking is it?', 'Diagonal tacking', ['Even tacking|TT_NAME', 'Uneven tacking|TT_NAME', 'Hemming|TT_NAME'], 'Diagonal tacking holds layers flat.'),
    Q('Which tacking has long stitches on top and short stitches underneath?', 'Uneven tacking', ['Even tacking|TT_NAME', 'Diagonal tacking|TT_NAME', 'Back stitch|TT_NAME'], 'Uneven tacking is long on top.'),
  ], { h: ['Is the stitch temporary? Look at the length and the slant.', 'Even, uneven and diagonal tacking are all long and loose.'], s1: 'Look at how the stitch is made.' })),

  // ---------------------------------------------------------------- TACK_USE
  fam('tack.use.which', `${TA}TACK_USE`, 'direct', 1, choose([
    Q('What is done with the tacking when the sewing is finished?', 'It is pulled out', ['It is left in the cloth|TU_KEEP', 'It is sewn again|TU_KEEP', 'It is dyed|TU_KEEP'], 'Tacking is only a guide.'),
    Q('What comes first, tacking or the final stitching?', 'Tacking', ['Final stitching|TU_ORDER', 'Both together|TU_ORDER', 'Neither|TU_ORDER'], 'Tack first to hold the cloth.'),
    Q('How should tacking be sewn?', 'With long, loose stitches in a thread that shows', ['With tiny, strong stitches|TU_STRONG', 'With very tight stitches|TU_STRONG', 'With matching thread so it hides|TU_STRONG'], 'Long loose stitches are easy to see and pull out.'),
    Q('Which tacking is best to hold thick or slippery layers flat?', 'Diagonal tacking', ['No tacking|TU_ORDER', 'Tiny back stitches|TU_STRONG', 'Final stitching first|TU_ORDER'], 'Diagonal tacking holds layers flat.'),
    Q('Why is a thread that shows used for tacking?', 'It is easy to see and pull out', ['It makes the garment look better|TU_KEEP', 'It makes the seam strong|TU_STRONG', 'It hides the stitches|TU_STRONG'], 'A thread of another colour can be found easily.'),
  ], { h: ['Tacking is a guide that comes out.', 'Pin, tack, sew the final stitching, then pull out the tacking.'], s1: 'Think about the order and what tacking is for.' })),
  fam('tack.use.story', `${TA}TACK_USE`, 'word', 2, choose([
    Q('Mama Wambui finishes sewing a skirt with the tacking still in it. What should she do?', 'Pull out the tacking', ['Leave it in for strength|TU_KEEP', 'Sew over it again|TU_KEEP', 'Cut the skirt|TU_KEEP'], 'Tacking is pulled out when the sewing is done.'),
    Q('Daniel sews the final seam and then tacks. What is wrong?', 'Tacking should come first', ['Nothing is wrong with his order|TU_ORDER', 'He should use tiny strong stitches|TU_STRONG', 'He should leave the tacking in|TU_KEEP'], 'Tack first, then sew, because the cloth slides while he sews.'),
    Q('Cynthia tacks with tiny strong stitches in matching thread. What is the problem?', 'It is hard to see and pull out', ['It is much too loose to hold|TU_STRONG', 'Nothing, it is just perfect|TU_STRONG', 'The thread is too colourful|TU_STRONG'], 'Use long loose stitches in a thread that shows.'),
    Q('Which is the right order for sewing a seam?', 'Pin, tack, stitch, remove tacking', ['Stitch, tack, pin, leave it in|TU_ORDER', 'Tack, pull out, stitch, pin|TU_ORDER', 'Pin, stitch, leave tacking in|TU_KEEP'], 'This is the order a tailor follows.'),
    Q('The cloth is thick and slides about. What helps?', 'Diagonal tacking', ['No tacking at all|TU_ORDER', 'Strong tiny stitches|TU_STRONG', 'Sewing the seam first|TU_ORDER'], 'Diagonal tacking holds layers flat.'),
  ], { h: ['What is the right order and the right stitch?', 'Pin, tack, final stitch, pull out the tacking.'], s1: 'Find what is wrong in the order or the stitch.' })),
  fam('tack.use.spot', `${TA}TACK_USE`, 'spot', 3, spot([
    S('Mwende explains how she sewed a seam. Which step has the mistake?', ['Step 1: I pinned the pieces.', '!Step 2: I sewed the final seam, then tacked it.', 'Step 3: I pressed the seam.'], 'Tack first to hold the cloth, then sew.', 'TU_ORDER'),
    S('Kevin describes finishing a bag. Which step has the mistake?', ['Step 1: I tacked the pieces.', 'Step 2: I sewed beside the tacking.', '!Step 3: I left the tacking in the bag.'], 'Pull the tacking out when the sewing is done.', 'TU_KEEP'),
    S('Janet tells how she tacked a dress. Which step has the mistake?', ['Step 1: I pinned the layers.', '!Step 2: I tacked with tiny strong stitches in matching thread.', 'Step 3: I sewed the seam.'], 'Tack with long loose stitches in a thread that shows.', 'TU_STRONG'),
    S('Ibrahim explains his shirt seam. Which step has the mistake?', ['Step 1: I tacked the layers.', '!Step 2: I sewed the final stitching first.', 'Step 3: I pulled out the tacking.'], 'Tacking must come before the final stitching.', 'TU_ORDER'),
    S('Rita describes a seam on thick cloth. Which step has the mistake?', ['Step 1: I pinned the layers.', 'Step 2: I used diagonal tacking.', '!Step 3: I kept the tacking in forever for strength.'], 'Tacking is temporary. Pull it out.', 'TU_KEEP'),
  ], { h: ['Which step has the wrong order or wrong stitch?', 'Pin, tack with long loose stitches, sew, pull out the tacking.'], s1: 'Check each step against what you know.' })),
];
