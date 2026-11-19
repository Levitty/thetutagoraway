// ============================================================================
// SOCIAL STUDIES GRADE 9, THE SIX DEPTH-PASS SKILLS AWAITING FAMILIES (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): challenges in
// pre-career support, age-sex pyramids, managing emotions for peace, continental drift and plate tectonics, the Tana River
// projects, and factors of healthy cultural relationships. Constructing a pyramid is drawn on paper and marked by the teacher;
// the app asks the reading and the reasons. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a Social Studies teacher signs them off.
// ============================================================================
import { T } from './socialstudies_g9_lib.js';

const M = (...s) => s.map(x => `M_SS9_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('sc', 'SOCIAL.PRE_CAREER_SUPPORT_SYSTE.SUPPORT_CHALLENGES', M('SC_NO_CHALLENGE', 'SC_PARENT_FORCE', 'SC_ONLINE_TRUE', 'SC_SOLUTION_MATCH', 'SC_COST_ONLY'),
    ['Name the challenge first, then pick the solution that fits that very challenge.', 'Support systems face too few counsellors, little career information, family pressure and online misinformation; fit each with peer mentors, career days, open talks with parents and checking sources.'], [
      ['Which is a challenge in pre-career support in many schools?', 'Too few career counsellors', 'There are no challenges|0', 'Money is the only challenge|4', 'Every online claim is true|2'],
      ['A school has too few counsellors. Which solution fits?', 'Train peer mentors and invite visiting counsellors', 'Buy more textbooks|3', 'Believe career videos online|2', 'Let parents choose every career|1'],
      ['A parent insists on one career that the learner has no interest in. What helps?', 'Talk openly with the parent and a counsellor', 'Do what the parent says without talking|1', 'Find a website that agrees|2', 'Buy more books|3'],
      ['A video claims a career pays millions in a year with no training. What should a learner do?', 'Check it with a counsellor or official source', 'Believe it|2', 'Choose it at once|2', 'Tell parents to decide|1'],
      ['Apart from money, which is a challenge in career support?', 'Pressure from family', 'There is none besides money|4', 'There are no challenges|0', 'Too many textbooks|3'],
    ], [
      ['In a rural school in Marsabit, learners have never heard of many careers. Which solution fits this challenge?', 'Hold career days and visits', 'Buy more exercise books|3', 'Say there is no problem|0', 'Let parents decide alone|1'],
      ['Wanjiru loves design, but her father insists she must study medicine. What should she do?', 'Talk it over with him', 'Obey without talking|1', 'Trust a random website|2', 'Pretend there is no challenge|0'],
      ['Kevin read online that coding needs no school at all. What should he do?', 'Check it with a counsellor', 'Believe it and leave school|2', 'Let his mother choose|1', 'Say it is only about money|4'],
      ['A school says career support is fine because fees are paid. What has it missed?', 'Misinformation, for one', 'Nothing; money is the only issue|4', 'Nothing; there are no challenges|0', 'The need for more textbooks|3'],
      ['A county has one counsellor for 3,000 learners. Which solution fits?', 'Peer mentors and visitors', 'More textbooks|3', 'Online rumours|2', 'Parents choosing for all|1'],
    ], [
      ['Achieng explains support systems. ' + STEP, 'Schools, parents and mentors support career choices.', 'They help learners find their strengths.', 'These systems have no challenges at all.', 'They face challenges such as too few counsellors.', 0],
      ['Musa explains career choice. ' + STEP, 'His mother wants him to be a lawyer.', 'He loves agriculture.', 'He must follow his mother\'s choice without talking.', 'Talk openly with the parent and a counsellor.', 1],
      ['Faith explains online advice. ' + STEP, 'She watched a career video.', 'It made big promises.', 'She believed every claim in it.', 'Check claims with a counsellor or official source.', 2],
      ['Juma pairs a challenge with a solution. ' + STEP, 'The challenge is too few counsellors.', 'Learners cannot get advice in time.', 'The solution is to buy more textbooks.', 'Train peer mentors and invite visiting counsellors.', 3],
      ['Neema explains challenges. ' + STEP, 'Mentorship can be costly.', 'Some schools lack money.', 'Money is the only challenge.', 'Family pressure and misinformation are challenges too.', 4],
    ], ['b', 'c', 'b']),

  ...T('py', 'PEOPLE.POPULATION_STRUCTURE.POP_PYRAMIDS', M('PY_SIDES', 'PY_DEPENDANTS', 'PY_RESOURCE_SAME', 'PY_SCALE'),
    ['Read the pyramid from the base (youngest) up, and ask who depends on whom.', 'The youngest are at the base; dependants are children and older people; a young population needs schools and child health care, an older one pensions and care; bars follow the scale.'], [
      ['Where is the youngest age group on an age-sex pyramid?', 'At the bottom (the base)', 'At the top|0', 'In the middle|0', 'On the left only|0'],
      ['Who are the dependants in a population?', 'Children and older people', 'Only children|1', 'Only working adults|1', 'Only older people|1'],
      ['A country\'s pyramid has a wide base. What does it need most?', 'More schools and child health care', 'More homes for the elderly|2', 'Fewer schools|2', 'The same as an old country|2'],
      ['On a pyramid, one group is 4 million and another 2 million. How do their bars compare?', 'The first is twice as long', 'About the same length|3', 'The second is longer|3', 'Any length that looks nice|3'],
      ['Which pyramid shape shows a developed country?', 'Narrow base, wide top', 'Wide base, narrow top|2', 'Youngest at the top|0', 'Bars drawn without a scale|3'],
    ], [
      ['Kiprop draws Kenya\'s pyramid with the 0-4 years group at the top. What should he change?', 'Put the youngest at the base', 'Nothing, the top is right|0', 'Make all bars the same|3', 'Leave out the elderly|1'],
      ['Wambui says Kenya\'s dependants are only its children. What has she left out?', 'The older people', 'Nothing, only children|1', 'Working adults|1', 'The bars\' scale|3'],
      ['A county\'s pyramid has a very wide base. The governor plans mostly homes for the elderly. What would suit better?', 'More schools and health care for mothers and children', 'More homes for the elderly|2', 'Nothing different|2', 'Fewer clinics|2'],
      ['Moraa draws bars for 6 million and 3 million about the same length. What is wrong?', 'She did not use a scale', 'Nothing, they look fine|3', 'The youngest must be on top|0', 'Only children count|1'],
      ['Japan has many older people and few children. What does its government need to plan most?', 'Pensions and care for the aged', 'Many more primary schools|2', 'Nothing for older people|1', 'A pyramid with youngest on top|0'],
    ], [
      ['Otieno reads a pyramid. ' + STEP, 'Males are on one side.', 'Females are on the other.', 'The youngest group is at the top.', 'The youngest group is at the base.', 0],
      ['Mercy explains dependants. ' + STEP, 'Dependants rely on working adults.', 'Children are dependants.', 'Older people are not dependants.', 'Children and older people are both dependants.', 1],
      ['Kamau explains resource planning. ' + STEP, 'Kenya has a young population.', 'Young people need schools and health care.', 'So Kenya needs the same services as an older country.', 'A young and an old population need different services.', 2],
      ['Esther draws a pyramid. ' + STEP, 'She drew the age groups up the middle.', 'She put males left and females right.', 'She drew the bars about the same length without a scale.', 'Use a scale so bar lengths match the numbers.', 3],
      ['Brian compares two pyramids. ' + STEP, 'A wide base means many children.', 'Kenya has a wide base.', 'So Kenya mainly needs more homes for the aged.', 'Many children means more schools and child health care.', 2],
    ], ['c', 'd', 'd']),

  ...T('ep', 'PEOPLE.PEACEFUL_CONFLICT_RESOLU.EMOTIONS_PEACE', M('EP_SUPPRESS', 'EP_EMPATHY_AGREE', 'EP_REACT_FAST', 'EP_SELF_ONLY'),
    ['Notice the feeling, calm it, then think how the other side feels.', 'Managing emotions is noticing and calming them, not hiding them; empathy is understanding, not agreeing; pause before answering; emotional intelligence includes others\' feelings.'], [
      ['What does managing anger mean?', 'Noticing it and calming down', 'Pretending you are not angry|0', 'Shouting back at once|2', 'Thinking only of your feelings|3'],
      ['Can you show empathy to someone you disagree with?', 'Yes, by understanding how they feel', 'No, empathy means agreeing|1', 'No, only your own feelings matter|3', 'Only by hiding your anger|0'],
      ['Someone insults you at a community meeting. What shows emotional intelligence?', 'Pause and answer calmly', 'Shout back at once|2', 'Pretend nothing happened|0', 'Agree with the insult|1'],
      ['Which parts of emotional intelligence are about other people?', 'Empathy and social skills', 'None of it|3', 'Only hiding feelings|0', 'Only quick replies|2'],
      ['Which is a way to manage a strong emotion?', 'Breathe and count to ten', 'Hide it and pretend|0', 'Reply angrily at once|2', 'Agree with everyone|1'],
    ], [
      ['Two families quarrel over a boundary. Kibet\'s uncle shouts back at once to show strength. What would help more?', 'Pause and talk later', 'Shout back louder|2', 'Pretend he is not angry|0', 'Agree to everything|1'],
      ['Atieno is very angry with her friend but smiles and says she is fine. What is a better way to manage it?', 'Calm down, then talk', 'Keep pretending|0', 'Shout at once|2', 'Think only of herself|3'],
      ['In a dispute over a water point, Juma listens to how the other village feels but keeps his own view. What is he showing?', 'Empathy', 'Agreement with them|1', 'Hiding his feelings|0', 'A quick reply|2'],
      ['Lucy says emotional intelligence is only about her own feelings. What has she left out?', 'Empathy and social skills', 'Nothing at all|3', 'Pretending to be calm|0', 'Answering fast|2'],
      ['Boda boda riders quarrel at a stage. Which step should the chairman take first?', 'Listen to both sides', 'Shout to show who is boss|2', 'Pretend there is no quarrel|0', 'Agree with the loudest|1'],
    ], [
      ['Hassan explains managing anger. ' + STEP, 'He felt angry when teased.', 'He knew anger is a normal feeling.', 'He decided managing it means pretending he is not angry.', 'Notice the anger and calm down before acting.', 0],
      ['Grace explains empathy. ' + STEP, 'Her neighbour was upset about noise.', 'Grace listened to her.', 'To show empathy, Grace had to agree with everything.', 'Empathy is understanding how she feels, not agreeing.', 1],
      ['Peter explains a quarrel. ' + STEP, 'A man insulted him at the market.', 'Peter felt hot with anger.', 'He shouted back at once to show strength.', 'Pause, stay calm and answer respectfully or later.', 2],
      ['Zawadi explains emotional intelligence. ' + STEP, 'It includes knowing your feelings.', 'It includes managing them.', 'It does not include other people\'s feelings.', 'Empathy and social skills are part of it.', 3],
      ['Daniel explains a community meeting. ' + STEP, 'People disagreed about a road.', 'He listened to each side.', 'When someone mocked him, he hit back with an angry reply.', 'Pause and answer calmly; quick anger makes it worse.', 2],
    ], ['c', 'd', 'c']),

  ...T('pt', 'NATURA.INTERNAL_LAND_FORMING_PR.PLATE_TECTONICS', M('PT_FIXED', 'PT_FAST', 'PT_EVIDENCE', 'PT_PLATE_COUNTRY'),
    ['Think about time: millions of years, a few centimetres a year.', 'The continents were once one land mass, Pangaea, and slowly drifted apart; the crust is broken into huge plates that move a few centimetres a year; fitting coasts and fossils are the evidence.'], [
      ['Have the continents always been where they are now?', 'No, they were once joined', 'Yes, always|0', 'Yes, they never move|0', 'Each was always on its own plate|3'],
      ['How fast do plates move?', 'A few centimetres a year', 'Many kilometres a year|1', 'Fast enough to see each week|1', 'They do not move|0'],
      ['Which is evidence for continental drift?', 'Africa and South America\'s coasts fit', 'There is none|2', 'Each country has its own plate|3', 'Continents move kilometres yearly|1'],
      ['How big is a tectonic plate?', 'Huge, carrying many countries and oceans', 'One country each|3', 'One town each|3', 'Too small to matter|2'],
      ['What was the single land mass called?', 'Pangaea', 'There never was one|0', 'Each country\'s own plate|3', 'A land that split last year|1'],
    ], [
      ['Looking at a map, Wanjiku notices that Brazil\'s coast fits into West Africa. What does this suggest?', 'The continents were once joined', 'Nothing, it is chance|2', 'They split apart last century|1', 'Each has its own country plate|3'],
      ['Mutua says Kenya will move into Asia within his lifetime. What is true?', 'Plates move only a few centimetres a year', 'He is right, plates move fast|1', 'Kenya never moves|0', 'Kenya has its own plate|3'],
      ['Fossils of the same reptile are found in Africa and India. What does this show?', 'The land was once joined', 'Nothing, it proves nothing|2', 'The continents never moved|0', 'Each country is a plate|3'],
      ['A learner says Kenya and Uganda each sit on their own plate. What is right?', 'One plate carries many countries', 'Yes, every country has a plate|3', 'There are no plates|0', 'Plates move kilometres yearly|1'],
      ['The Rift Valley is where plates are slowly pulling apart. How long has it taken to form?', 'Millions of years', 'A few weeks|1', 'It has always been there|0', 'No one can tell, there is no evidence|2'],
    ], [
      ['Kiprono explains continental drift. ' + STEP, 'Alfred Wegener studied the continents.', 'He said they were once one land mass.', 'He said the continents have always been where they are now.', 'He said they were once joined and slowly moved apart.', 0],
      ['Nyambura explains plate movement. ' + STEP, 'The crust is broken into plates.', 'The plates move on the mantle.', 'They move many kilometres each year.', 'They move only a few centimetres a year.', 1],
      ['Ali explains the evidence. ' + STEP, 'Wegener had a theory.', 'He needed evidence.', 'But there is no evidence for continental drift.', 'Fitting coasts and matching fossils are evidence.', 2],
      ['Rose explains plates. ' + STEP, 'The crust is made of plates.', 'The African Plate is one of them.', 'Each country sits on its own plate.', 'One plate carries many countries and oceans.', 3],
      ['Barasa explains the Rift Valley. ' + STEP, 'Plates can pull apart.', 'The land between them sinks.', 'This happened in one year, very fast.', 'It took millions of years; plates move slowly.', 1],
    ]),

  ...T('rc', 'NATURA.MULTI_PURPOSE_RIVER_PROJ.RIVER_CONDITIONS', M('RC_FLAT_SITE', 'RC_SEASONAL', 'RC_SILT_FIX', 'RC_DISPLACED'),
    ['Think about the water, the rock and the people.', 'The Tana dams need a permanent river, deep gorges with hard rock and sparse settlement; silting is fixed in the catchment, and displaced people are consulted, compensated and resettled.'], [
      ['Which site suited the Seven Forks dams on the Tana?', 'A deep gorge with hard rock', 'A flat, open plain|0', 'A wide, shallow swamp|0', 'Soft sandy ground|0'],
      ['Why could the Tana feed big dams?', 'It flows all year', 'Any river would do|1', 'It dries up each year|1', 'It is a seasonal stream|1'],
      ['How is silting of a dam best reduced?', 'Plant trees in the catchment', 'Build a higher wall|2', 'Move people without a plan|3', 'Build on a flat plain|0'],
      ['How should people moved for a dam be treated?', 'Consulted and compensated', 'Just moved|3', 'Moved without notice|3', 'Left to find land alone|3'],
      ['Which condition helped the Tana projects?', 'Few people lived there', 'A flat, crowded plain|0', 'A river that dries up|1', 'Soft rock for foundations|0'],
    ], [
      ['Engineers must choose between a flat plain and a narrow gorge on a river. Where should the dam go?', 'The narrow rocky gorge', 'The flat plain|0', 'Either, any site works|0', 'A seasonal stream nearby|1'],
      ['A county wants a big dam on a stream that flows only in the long rains. What is the problem?', 'It is not a permanent river', 'None, any river would do|1', 'It needs a flat plain|0', 'The wall is too low|2'],
      ['Masinga Dam is filling with silt. An official wants to raise the wall. What is better?', 'Plant trees in the catchment', 'Raise the wall higher|2', 'Move people with no plan|3', 'Move the dam to a plain|0'],
      ['Families must leave land for a new dam. A planner says just move them. What is fair?', 'Consult and compensate them', 'Just move them|3', 'Raise the wall|2', 'Build on the plain instead|0'],
      ['A dam on the Tana loses water in a drought. Which plan helps?', 'Protect the catchment', 'Build on a flat plain|0', 'Choose a seasonal river|1', 'Just raise the wall|2'],
    ], [
      ['Kendi explains the Tana projects. ' + STEP, 'The Tana is a permanent river.', 'It has steep falls and gorges.', 'The best dam site is a wide flat plain.', 'A deep gorge with hard rock is the best site.', 0],
      ['Ouma explains the river. ' + STEP, 'Big dams need a lot of water.', 'The water must flow all year.', 'So any seasonal river would do.', 'It needs a permanent river with water all year.', 1],
      ['Halima explains silting. ' + STEP, 'Soil washes into the river.', 'It settles behind the dam.', 'The fix is to build a higher wall.', 'Plant trees and stop soil erosion in the catchment.', 2],
      ['Wafula explains displacement. ' + STEP, 'A dam floods land behind it.', 'Families living there must move.', 'They can just be moved with no plan.', 'Consult them, compensate fairly and resettle them well.', 3],
      ['Joyce explains the conditions. ' + STEP, 'Hard rock makes strong foundations.', 'Few people lived at the sites.', 'A flat plain is better than a gorge for holding water.', 'A gorge holds deep water behind a short wall.', 0],
    ], ['b', 'e', 'e']),

  ...T('cf', 'POLITI.CULTURAL_GLOBALISATION.CULTURE_FACTORS', M('CF_STEREOTYPE', 'CF_LANGUAGE_NONE', 'CF_MEDIA_ALL_GOOD', 'CF_EXCHANGE_NONE'),
    ['Ask whether it helps people meet, understand and respect each other.', 'Respect, learning languages, cultural exchange and responsible media build healthy cultural relationships; stereotypes and hateful media harm them.'], [
      ['Do stereotypes help people understand other cultures?', 'No, they spread wrong ideas', 'Yes, they explain people quickly|0', 'Yes, they build respect|0', 'They are the same as exchange|3'],
      ['How does learning another language help?', 'People understand each other', 'It does not|1', 'It spreads stereotypes|0', 'Only media matter|2'],
      ['Can media harm cultural relationships?', 'Yes, if they spread hate', 'No, media only help|2', 'No, all media are good|2', 'Only languages harm them|1'],
      ['How do cultural festivals help?', 'People meet and share', 'They do not|3', 'They spread stereotypes|0', 'Only media help|2'],
      ['Which promotes healthy cultural relationships?', 'Respect and tolerance', 'Mocking other accents|0', 'Refusing to learn languages|1', 'Sharing hateful videos|2'],
    ], [
      ['A video online mocks people from another country. Kevin says media always help cultures. What is true?', 'Media can spread hate too', 'Yes, media always help|2', 'Stereotypes help understanding|0', 'Languages do not matter|1'],
      ['Wairimu is learning French and Kiswahili. How does this help cultural relationships?', 'She understands more people', 'It does not help|1', 'It spreads stereotypes|0', 'Only festivals help|3'],
      ['A school hosts a music exchange with a school in Uganda. What is gained?', 'Learners meet and share', 'Nothing at all|3', 'Only new stereotypes|0', 'Only media matter|2'],
      ['Odera says all people from one country are lazy. What is wrong?', 'It is a stereotype', 'Nothing, it explains them|0', 'He should learn no language|1', 'Media will fix it|2'],
      ['A county plans a culture week for its many communities. Which plan helps most?', 'Festivals and food sharing', 'Jokes about each community|0', 'No contact at all|3', 'Hateful posts online|2'],
    ], [
      ['Achieng explains stereotypes. ' + STEP, 'People come from many cultures.', 'Some judge others quickly.', 'Stereotypes help us understand other cultures.', 'Stereotypes spread wrong ideas and disrespect.', 0],
      ['Kimani explains languages. ' + STEP, 'Kenya has many languages.', 'The world has many more.', 'Learning another language does not help cultural relationships.', 'It helps people understand and respect each other.', 1],
      ['Mueni explains the media. ' + STEP, 'Media share news and culture.', 'They reach many people.', 'So all media spread healthy relationships.', 'Media can also spread stereotypes or hate.', 2],
      ['Baraka explains exchange. ' + STEP, 'Exchange programmes send learners abroad.', 'Sport brings teams together.', 'Cultural exchange does not build relationships.', 'People meet, share and learn to respect each other.', 3],
      ['Lilian explains tolerance. ' + STEP, 'Respect builds good relationships.', 'Tolerance helps people live together.', 'Mocking other accents is harmless fun that builds friendships.', 'Mockery is a stereotype; it spreads disrespect.', 0],
    ]),
];
