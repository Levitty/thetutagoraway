// ============================================================================
// GRADE 8 SOCIAL STUDIES, PART B: the Trans-Saharan trade, population, diversity, peer pressure, family conflict and
// topographical maps (6 skills). Written offline from the KICD design. Every wrong answer names the library misconception it
// reveals. Options are about the same length so the right answer is never the longest. History and population figures are told as
// commonly taught (figures rounded) and stay "to confirm by a teacher". All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g8_lib.js';

const TS = 'PEOPLE.TRANS_SAHARAN_SLAVE_TRAD.', PG = 'PEOPLE.POPULATION_GROWTH_IN_AFR.', DV = 'PEOPLE.DIVERSITY_AND_INTERPERSO.', PC = 'PEOPLE.PEACEFUL_CONFLICT_RESOLU.', MP = 'NATURA.MAP_READING_AND_INTERPRE.';

export const FAMILIES = [
  // ---------------------------------------------------------------- TRANS_SAHARAN
  fam('ts.tr.how', `${TS}TRANS_SAHARAN`, 'direct', 1, choose([
    C('G8_TS_ROUTE', 'How did traders cross the Sahara?', 'By camel caravans', ['By ship', 'By train', 'By aeroplane'], 'The trade crossed the desert by camel caravans.'),
    C('G8_TS_FACTOR', 'Which factor helped the Trans-Saharan trade grow?', 'The camel and a demand for labour in North Africa', ['Railways across the desert', 'Motorcars on tarmac roads', 'The telephone'], 'The camel, the desert routes and the demand for labour helped it grow.'),
    C('G8_TS_ROUTE', 'Where did the Trans-Saharan trade run between?', 'West and Central Africa and North Africa', ['East Africa and India', 'Europe and America', 'Australia and Asia'], 'The trade ran across the Sahara from West and Central Africa to North Africa.'),
    C('G8_TS_FACTOR', 'Which helped traders cross the desert safely?', 'Oases along the route and local guides', ['Fast lorries on tarred roads', 'Bridges built over the sand', 'Air conditioning for the caravans'], 'Oases gave water and guides knew the routes.'),
    C('G8_TS_ROUTE', 'Which animal carried the goods across the Sahara?', 'The camel', ['The horse', 'The elephant', 'The ox'], 'The camel could cross the desert with little water.'),
  ], { h: ['Think of what can cross a desert.', 'Camels and oases made the trade possible.'], s1: 'Think about the desert and the animal.' })),
  fam('ts.tr.effects', `${TS}TRANS_SAHARAN`, 'why', 2, choose([
    C('G8_TS_EFFECT', 'Which was an effect of the Trans-Saharan slave trade?', 'Families were broken and villages emptied', ['Villages grew larger and richer', 'Families were reunited', 'Schools were built'], 'The trade took many lives and emptied villages.'),
    C('G8_TS_EFFECT', 'What happened to the people who were captured?', 'They were taken far from home and suffered', ['They were paid well', 'They were returned home quickly', 'They became rulers'], 'Captives were taken far from home and suffered greatly.'),
    C('G8_TS_FACTOR', 'Why is the trade seen as wrong today?', 'People were treated as goods and denied their freedom', ['It was too quick to harm anyone in the villages', 'It used camels to carry the heavy loads', 'It crossed a desert in the burning heat'], 'It denied people their freedom and dignity.'),
    C('G8_TS_EFFECT', 'How did the trade affect the communities where the raids happened?', 'People lived in fear and insecurity', ['They lived in peace and plenty', 'They became richer from the raids', 'They grew in number every year'], 'Raids brought fear and loss.'),
    C('G8_TS_ROUTE', 'Which towns grew as trading centres on the Saharan routes?', 'Timbuktu and Gao', ['Mombasa and Lamu', 'Nairobi and Kisumu', 'Cape Town and Durban'], 'Timbuktu and Gao grew as centres of the desert trade.'),
  ], { h: ['Think about what happened to the people and the villages.', 'Fear, loss and broken families were effects.'], s1: 'Think about the people who were taken.' })),
  fam('ts.tr.spot', `${TS}TRANS_SAHARAN`, 'spot', 3, spot([
    S('Baraka explains the trade.', ['It crossed the Sahara.', '!It went by sea.', 'It used camel caravans.'], 'The Trans-Saharan trade crossed the desert by camel.', 'G8_TS_ROUTE'),
    S('Wanjiru explains the factors.', ['Camels helped the trade.', '!Railways helped the trade.', 'There was a demand for labour.'], 'There were no railways across the desert in this period.', 'G8_TS_FACTOR'),
    S('Kamau explains the effects.', ['Families were broken.', '!Villages grew richer.', 'People lived in fear.'], 'Villages were emptied by raids.', 'G8_TS_EFFECT'),
    S('Mwende explains the routes.', ['The routes had oases.', 'Guides led the caravans.', '!The routes were roads for lorries.'], 'The routes were desert tracks for camels.', 'G8_TS_ROUTE'),
    S('Nekesa explains the loss.', ['Many people lost their lives.', '!Families were happy.', 'Villages were emptied.'], 'Families were broken by the trade.', 'G8_TS_EFFECT'),
  ], { h: ['Check each step: how, why and what happened.', 'It was a desert caravan trade.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- POPULATION
  fam('pg.po.causes', `${PG}POPULATION`, 'direct', 1, choose([
    C('G8_PG_CAUSE', 'Which helps the population to grow?', 'More births than deaths', ['More deaths than births', 'Fewer babies and more disease', 'People leaving the country'], 'A population grows when births are more than deaths.'),
    C('G8_PG_CAUSE', 'Which cause of growth comes from better health care?', 'Fewer deaths', ['More deaths', 'Fewer hospitals', 'More hunger'], 'Better health care lowers the death rate.'),
    C('G8_PG_EFFECT', 'What is an effect of rapid population growth?', 'Pressure on land, food, houses and jobs', ['Plenty of jobs and land for all', 'Empty schools', 'Falling demand for food'], 'Rapid growth puts pressure on resources.'),
    C('G8_PG_MIGRATION', 'Which is a type of migration?', 'Moving from the countryside to a town', ['Only moving to another country', 'Staying at home', 'Visiting a neighbour'], 'Rural-urban migration is movement from the countryside to a town.'),
    C('G8_PG_MIGRATION', 'People leave their homes because of war. What kind of migration is this?', 'Forced migration', ['Voluntary migration', 'Seasonal holiday', 'Trade'], 'Fleeing war is forced migration.'),
  ], { h: ['Births, deaths and people moving change the population.', 'Fast growth puts pressure on resources.'], s1: 'Think about births and deaths.' })),
  fam('pg.po.kenya', `${PG}POPULATION`, 'word', 2, choose([
    C('G8_PG_EFFECT', 'About how many people lived in Kenya at the 2019 census?', 'About 47.6 million', ['About 4.7 million', 'About 470 million', 'About 7 million'], 'The 2019 census counted about 47.6 million people.'),
    C('G8_PG_EFFECT', 'What is true of Kenya\'s population?', 'It is young, with many children and youth', ['It is mostly old', 'It has no children', 'It is falling each year'], 'Kenya has a young population.'),
    C('G8_PG_CAUSE', 'Achieng\'s family has seven children and farms a small plot. What can happen?', 'The plot may not feed everyone', ['The plot will grow bigger', 'Food will be plentiful', 'Nothing will change'], 'A small plot may not feed a large family.'),
    C('G8_PG_MIGRATION', 'Many young people move from villages to Nairobi for work. What is this?', 'Rural-urban migration', ['Forced migration only', 'Tourism', 'Trade'], 'Moving from a village to a town is rural-urban migration.'),
    C('G8_PG_EFFECT', 'What can a fast-growing town struggle to provide?', 'Enough houses, water and jobs', ['Empty streets', 'Silence', 'Free land for all'], 'Fast growth strains houses, water and jobs.'),
  ], { h: ['Remember about 47.6 million at the 2019 census.', 'Fast growth puts pressure on land, food, houses and jobs.'], s1: 'Think about Kenya\'s numbers and what a crowded place needs.' })),
  fam('pg.po.spot', `${PG}POPULATION`, 'spot', 3, spot([
    S('Baraka explains growth.', ['Births raise the population.', '!More deaths raise the population.', 'Moving in raises it too.'], 'More deaths than births lower the population.', 'G8_PG_CAUSE'),
    S('Wanjiru explains migration.', ['People move from the countryside to a town.', '!Migration is only moving to another country.', 'Some people flee war.'], 'Migration includes movement within a country.', 'G8_PG_MIGRATION'),
    S('Kamau explains effects.', ['Land can become scarce.', '!Fast growth makes jobs plentiful for all.', 'Houses can become crowded.'], 'Fast growth can make jobs scarce.', 'G8_PG_EFFECT'),
    S('Mwende explains Kenya.', ['Kenya had about 47.6 million people in 2019.', '!Kenya had about 4.7 million people in 2019.', 'Kenya has a young population.'], 'Kenya had about 47.6 million people.', 'G8_PG_EFFECT'),
    S('Nekesa explains causes.', ['Better health care lowers deaths.', '!Better health care raises deaths.', 'More births than deaths grows the population.'], 'Better health care lowers deaths.', 'G8_PG_CAUSE'),
  ], { h: ['Check each step: births, deaths, migration, effects.', 'About 47.6 million in 2019.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- DIVERSITY
  fam('dv.dv.kenya', `${DV}DIVERSITY`, 'direct', 1, choose([
    C('G8_DV8_ONE_CULTURE', 'How many cultures does Kenya have?', 'More than forty communities with their own cultures', ['Only one single culture for all', 'Only two cultures in the whole country', 'None, it has no communities'], 'Kenya has more than forty communities.'),
    C('G8_DV8_ONE_CULTURE', 'Which is a sign of cultural diversity in Kenya?', 'Different languages, foods and dress', ['One language only in the whole country', 'One food only in every home', 'One dress only for every people'], 'Different languages, foods and dress show diversity.'),
    C('G8_DV8_BETTER', 'How should we treat other cultures?', 'Respect and learn from them', ['See ours as better than theirs', 'Laugh at them in front of others', 'Ignore them and avoid them'], 'We respect and learn from all cultures.'),
    C('G8_DV8_ESTEEM', 'How does healthy self-esteem grow in a diverse society?', 'By being proud of our own culture and respecting others', ['By feeling better than all the others in the class', 'By hiding our culture from other people', 'By copying only one other culture closely'], 'Healthy self-esteem respects self and others.'),
    C('G8_DV8_BETTER', 'Wanjiru finds that her friend\'s food is different from hers. What should she do?', 'Ask about it and try it politely', ['Say it is bad', 'Refuse to sit with her', 'Laugh at it'], 'Curiosity and respect build friendship.'),
  ], { h: ['Kenya has more than forty communities.', 'We respect every culture.'], s1: 'Think about respect and difference.' })),
  fam('dv.dv.use', `${DV}DIVERSITY`, 'why', 2, choose([
    C('G8_DV8_ESTEEM', 'Otieno is proud of his Luo culture and also respects his Kikuyu friend\'s culture. What is this?', 'Healthy self-esteem in a diverse society', ['Inflated self-esteem and pride', 'Low self-esteem and shyness', 'Disrespect for another culture'], 'Pride in oneself together with respect for others is healthy.'),
    C('G8_DV8_BETTER', 'Why is diversity a strength for Kenya?', 'People share ideas, foods and skills', ['It divides everyone into groups', 'It stops trade between people', 'It stops learning from others'], 'Diversity brings new ideas and skills.'),
    C('G8_DV8_ONE_CULTURE', 'Which is an example of religious diversity in Kenya?', 'Christians, Muslims and others live side by side', ['Everyone follows only one religion in Kenya', 'There are no religions in the country', 'Religion is forbidden by the government'], 'Kenya has several religions.'),
    C('G8_DV8_ESTEEM', 'A girl hides her home language because she is ashamed of it. What would help her?', 'Learning to value her culture', ['Copying only what others do and say', 'Staying silent about her home language', 'Boasting about it to everyone she meets'], 'Valuing one\'s culture builds healthy self-esteem.'),
    C('G8_DV8_BETTER', 'Which action shows respect for a community with a different custom?', 'Learning about the custom before judging it', ['Making fun of it with friends', 'Asking them to stop at once', 'Banning it for everyone'], 'Learning first shows respect.'),
  ], { h: ['Respect every culture and be proud of your own.', 'Diversity is a strength.'], s1: 'Think about pride and respect together.' })),
  fam('dv.dv.spot', `${DV}DIVERSITY`, 'spot', 3, spot([
    S('Baraka explains diversity.', ['Kenya has many communities.', '!Kenya has one culture only.', 'They have different languages.'], 'Kenya has more than forty communities.', 'G8_DV8_ONE_CULTURE'),
    S('Wanjiru explains respect.', ['We respect other cultures.', '!One culture is better than others.', 'We learn from each other.'], 'No culture is better.', 'G8_DV8_BETTER'),
    S('Kamau explains self-esteem.', ['Be proud of your culture.', 'Respect other cultures.', '!Feel better than others.'], 'Healthy self-esteem respects others.', 'G8_DV8_ESTEEM'),
    S('Mwende explains customs.', ['Learn about a custom first.', '!Make fun of a custom you do not know.', 'Ask politely.'], 'Making fun shows disrespect.', 'G8_DV8_BETTER'),
    S('Nekesa explains communities.', ['Kenya has different foods.', 'Kenya has different dress.', '!Kenya has only one language.'], 'Kenya has many languages.', 'G8_DV8_ONE_CULTURE'),
  ], { h: ['Check each step: many cultures, respect, healthy self-esteem.', 'No culture is better than another.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- PEER_PRESSURE
  fam('dv.pr.refuse', `${DV}PEER_PRESSURE`, 'direct', 1, choose([
    C('G8_PR_GIVE_IN', 'A friend pushes you to do wrong. What should you do?', 'Say no clearly and walk away', ['Give in to be liked', 'Give in once', 'Say nothing and stay'], 'Say no clearly and walk away. A real friend respects it.'),
    C('G8_PR_GIVE_IN', 'Which is a good way to refuse peer pressure?', 'Give a reason and keep good friends', ['Pretend to agree and then slip away', 'Run away from school for the day', 'Hit the friend who is pushing'], 'Give a reason and stay with good friends.'),
    C('G8_PR_HIDE', 'What should you do with a strong feeling?', 'Name it and talk to a trusted person', ['Hide it for ever', 'Shout at everyone around you', 'Pretend it is not there'], 'Naming a feeling and talking about it helps.'),
    C('G8_PR_ANGER', 'What is a healthy way to handle anger?', 'Pause, breathe and then talk calmly', ['Hit the person at once in front of others', 'Shout at everyone around you', 'Break something in the room'], 'Pause, breathe and talk calmly.'),
    C('G8_PR_GIVE_IN', 'Who can help a child who is under peer pressure?', 'A trusted adult', ['Only the friends who push', 'No one', 'A stranger online'], 'A trusted adult can guide a child.'),
  ], { h: ['Say no, give a reason, walk away.', 'Pause and breathe before you act on anger.'], s1: 'Think about what keeps you safe and kind.' })),
  fam('dv.pr.emotion', `${DV}PEER_PRESSURE`, 'why', 2, choose([
    C('G8_PR_ANGER', 'Achieng is very angry with her sister. What should she do first?', 'Pause and breathe before she speaks', ['Hit her sister', 'Shout across the house', 'Throw her things'], 'A pause lets the anger cool.'),
    C('G8_PR_HIDE', 'How can strong emotions affect other people?', 'Anger can hurt, while joy can lift others', ['They never affect other people at all', 'They only affect adults and not children', 'They only affect pets and animals'], 'Emotions change how we treat others and how they feel.'),
    C('G8_PR_GIVE_IN', 'Baraka\'s friends dare him to skip class. What should he do?', 'Say no and go to class', ['Join them to fit in', 'Join them once', 'Hide in the toilets'], 'He should say no and stay with his responsibilities.'),
    C('G8_PR_HIDE', 'Wanjiru feels sad and keeps it secret for weeks. What would help?', 'Talking to a trusted adult', ['Staying silent for longer', 'Shouting at friends', 'Staying away from everyone'], 'Sharing a feeling with a trusted person helps.'),
    C('G8_PR_ANGER', 'Which words show a calm way to say you are upset?', '"I feel upset when you take my things."', ['"You are useless."', '"I will hit you."', '"Leave me alone for ever."'], 'An I-statement says how you feel without blaming.'),
  ], { h: ['Pause, breathe and talk calmly.', 'Say no to pressure and tell a trusted adult.'], s1: 'Think about the kindest safe choice.' })),
  fam('dv.pr.spot', `${DV}PEER_PRESSURE`, 'spot', 3, spot([
    S('Baraka explains refusing.', ['Say no clearly.', '!Give in to be liked.', 'Walk away.'], 'Do not give in. Say no clearly.', 'G8_PR_GIVE_IN'),
    S('Wanjiru explains feelings.', ['Name the feeling.', '!Hide it for ever.', 'Talk to a trusted person.'], 'Do not hide feelings for ever.', 'G8_PR_HIDE'),
    S('Kamau explains anger.', ['Pause first.', 'Breathe slowly.', '!Hit the person at once.'], 'Pause and talk calmly.', 'G8_PR_ANGER'),
    S('Mwende explains friends.', ['Choose friends who respect you.', '!Give in to every friend.', 'Tell a trusted adult.'], 'Do not give in to every friend.', 'G8_PR_GIVE_IN'),
    S('Nekesa explains calm talk.', ['Use I-statements.', '!Shout so they listen.', 'Use a calm voice.'], 'Shouting makes things worse.', 'G8_PR_ANGER'),
  ], { h: ['Check each step: say no, name the feeling, pause.', 'A trusted adult can help.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- FAMILY_CONFLICT
  fam('pc.fc.causes', `${PC}FAMILY_CONFLICT`, 'direct', 1, choose([
    C('G8_FC_WIN', 'What is the aim of resolving a family conflict?', 'To understand each other and make peace', ['To win the argument', 'To punish the other person', 'To prove who is right'], 'The aim is peace, not winning.'),
    C('G8_FC_SILENCE', 'Which is a peaceful way to resolve a conflict?', 'Talking calmly and listening', ['Not speaking to each other for months', 'Shouting until one gives in', 'Leaving the house'], 'Talking calmly and listening resolves conflict.'),
    C('G8_FC_FIGHT', 'Which is NOT a peaceful way?', 'Shouting and hitting', ['Asking an elder to help', 'Apologising', 'Listening carefully'], 'Shouting and hitting make a conflict worse.'),
    C('G8_FC_WIN', 'Which can cause a conflict in a family?', 'Favouritism, poverty or disrespect', ['Sharing chores fairly', 'Talking kindly', 'Listening to each other'], 'Favouritism, poverty and disrespect cause conflicts.'),
    C('G8_FC_SILENCE', 'Who can help a family settle a serious dispute?', 'An elder or a counsellor', ['Only the one who shouts', 'No one', 'The neighbour\'s children'], 'Elders and counsellors help settle disputes.'),
  ], { h: ['Peace comes from listening and talking calmly.', 'Shouting and silence do not solve conflict.'], s1: 'Think about what brings peace.' })),
  fam('pc.fc.skills', `${PC}FAMILY_CONFLICT`, 'why', 2, choose([
    C('G8_FC_FIGHT', 'Otieno and his brother quarrel over a bicycle. What should they do?', 'Take turns and talk to their parents', ['Fight for it outside the house', 'Break it so that neither has it', 'Hide it from both of them and from the family'], 'Sharing and talking resolves it.'),
    C('G8_FC_WIN', 'Which is a good communication habit?', 'Listen without interrupting', ['Talk louder than the others', 'Interrupt often', 'Walk away while someone speaks'], 'Listening without interrupting helps understanding.'),
    C('G8_FC_SILENCE', 'Mother and father stop speaking for weeks. What should a child suggest?', 'Talking with a trusted elder', ['More silence between them for weeks', 'Shouting louder at one another', 'Leaving home until it is over'], 'A trusted elder can help them talk.'),
    C('G8_FC_WIN', 'Which sentence is a calm way to speak?', '"I feel hurt when I am left out."', ['"You never listen to me."', '"You are always wrong."', '"I hate this house."'], 'An I-statement says how you feel without blaming.'),
    C('G8_FC_FIGHT', 'Which action builds a healthy relationship in the family?', 'Saying sorry and forgiving', ['Keeping a grudge', 'Hitting back', 'Shouting louder at one another'], 'Sorry and forgiveness build peace.'),
  ], { h: ['Listen, speak calmly, say sorry, forgive.', 'Shouting and hitting do not help.'], s1: 'Think about what builds trust.' })),
  fam('pc.fc.spot', `${PC}FAMILY_CONFLICT`, 'spot', 3, spot([
    S('Baraka explains peace.', ['Peace needs listening.', '!The aim is to win the argument.', 'Peace needs calm talk.'], 'The aim is peace, not winning.', 'G8_FC_WIN'),
    S('Wanjiru explains silence.', ['Talking helps.', '!Silence for months solves conflict.', 'Listening helps.'], 'Silence leaves the problem unsolved.', 'G8_FC_SILENCE'),
    S('Kamau explains shouting.', ['Shouting hurts.', '!Shouting solves conflict.', 'A calm voice helps.'], 'Shouting makes conflict worse.', 'G8_FC_FIGHT'),
    S('Mwende explains causes.', ['Favouritism can cause conflict.', 'Disrespect can cause conflict.', '!Fair sharing causes conflict.'], 'Fair sharing prevents conflict.', 'G8_FC_WIN'),
    S('Nekesa explains help.', ['Elders can help.', '!Nobody can help.', 'A counsellor can help.'], 'Elders and counsellors can help.', 'G8_FC_SILENCE'),
  ], { h: ['Check each step: aim, silence, shouting, causes, help.', 'Peace comes from calm talk.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- TOPO_MAPS
  fam('mp.tm.info', `${MP}TOPO_MAPS`, 'direct', 1, choose([
    C('G8_TM_KEY', 'What does the key (legend) of a map show?', 'What the signs on the map mean', ['The direction of north', 'The age of the map', 'The name of the teacher'], 'The key explains the signs.'),
    C('G8_TM_KEY', 'Which part of a map shows direction?', 'The north arrow', ['The key', 'The title', 'The scale'], 'The north arrow shows direction.'),
    C('G8_TM_RELIEF', 'Which shows relief on a topographical map?', 'Contours', ['The scale', 'The title', 'The border'], 'Contours join places of the same height.'),
    C('G8_TM_RELIEF', 'Which number on a map is a spot height?', 'A figure that gives the height of one point', ['A figure that gives the year', 'A figure that gives the page', 'A figure that gives the distance'], 'A spot height gives the height of one point.'),
    C('G8_TM_KEY', 'What does the scale of a map tell you?', 'How map distances match real distances', ['Which way is north on the map', 'What the colours on the map mean', 'Who made the map and when'], 'The scale links map distance to real distance.'),
  ], { h: ['The key explains signs; the north arrow shows direction.', 'Contours show relief.'], s1: 'Think about which part of the map does the job.' })),
  fam('mp.tm.area', `${MP}TOPO_MAPS`, 'word', 2, choose([
    C('G8_TM_AREA', 'A lake covers 4 grid squares by 3 grid squares of 1 square kilometre each. What is its area?', '12 square kilometres', ['7 square kilometres', '1 square kilometre', '43 square kilometres'], 'Area is 4 times 3, which is 12 square kilometres.'),
    C('G8_TM_AREA', 'A farm covers 5 squares by 2 squares of 1 square kilometre each. What is its area?', '10 square kilometres', ['7 square kilometres', '25 square kilometres', '52 square kilometres'], 'Area is 5 times 2, which is 10 square kilometres.'),
    C('G8_TM_AREA', 'A forest covers 6 squares by 3 squares of 1 square kilometre each. What is its area?', '18 square kilometres', ['9 square kilometres', '63 square kilometres', '36 square kilometres'], 'Area is 6 times 3, which is 18 square kilometres.'),
    C('G8_TM_AREA', 'A town covers 4 squares by 4 squares of 1 square kilometre each. What is its area?', '16 square kilometres', ['8 square kilometres', '44 square kilometres', '4 square kilometres'], 'Area is 4 times 4, which is 16 square kilometres.'),
    C('G8_TM_AREA', 'A grid square on a topographical map is 1 km by 1 km. What is the area of one square?', '1 square kilometre', ['2 square kilometres', '1 kilometre', '10 square kilometres'], 'One square is 1 km by 1 km, so 1 square kilometre.'),
  ], { h: ['Multiply the squares across by the squares down.', 'One square is 1 square kilometre.'], s1: 'Multiply length by width in squares.' })),
  fam('mp.tm.spot', `${MP}TOPO_MAPS`, 'spot', 3, spot([
    S('Baraka explains map parts.', ['The title names the map.', '!The key shows direction.', 'The north arrow shows direction.'], 'The north arrow shows direction. The key explains the signs.', 'G8_TM_KEY'),
    S('Wanjiru explains relief.', ['Contours show relief.', '!The scale shows relief.', 'Spot heights give heights.'], 'The scale shows distance. Contours show relief.', 'G8_TM_RELIEF'),
    S('Kamau finds an area.', ['A lake is 4 squares by 3 squares.', '!He adds 4 and 3 to get 7.', 'Each square is 1 square kilometre.'], 'He should multiply: 4 times 3 is 12 square kilometres.', 'G8_TM_AREA'),
    S('Mwende explains the key.', ['The key has signs.', '!The key shows the north.', 'It tells what each sign means.'], 'The key explains the signs.', 'G8_TM_KEY'),
    S('Nekesa finds another area.', ['A farm is 5 squares by 2 squares.', '!She adds 5 and 2 to get 7.', 'Each square is 1 square kilometre.'], 'She should multiply: 5 times 2 is 10 square kilometres.', 'G8_TM_AREA'),
  ], { h: ['Check each step: the key explains, the arrow gives direction, contours show relief, area is length times width.', 'Multiply the squares.'], s1: 'Find the step that is not true.' })),
];
