// ============================================================================
// SOCIAL STUDIES GRADE 9, A (9 skills): pathways, pre-career support, community service steps, Stone Age practices, indigenous knowledge,
// poverty, population structure, peace, healthy relationships. Written offline from the KICD design through the curriculum map. Every
// wrong answer names the library misconception it reveals. All stay reviewed:false until a Social Studies teacher signs them off.
// ============================================================================
import { S } from './socialstudies_g9_lib.js';
const PC = 'SOCIAL.PATHWAY_CHOICES.', PS = 'SOCIAL.PRE_CAREER_SUPPORT_SYSTE.', CS = 'COMMUN.COMMUNITY_SERVICE_LEARNI.';
const SA = 'PEOPLE.SOCIO_ECONOMIC_PRACTICES.', IK = 'PEOPLE.INDIGENOUS_KNOWLEDGE_SYS.', PO = 'PEOPLE.POVERTY_REDUCTION.', PP = 'PEOPLE.POPULATION_STRUCTURE.', PE = 'PEOPLE.PEACEFUL_CONFLICT_RESOLU.', HR = 'PEOPLE.HEALTHY_RELATIONSHIPS.';

export const FAMILIES = [
  ...S('pw', PC, 'PATHWAYS', ['PW_NUMBER', 'PW_FACTOR', 'PW_NAME'], ['There are three pathways: STEM, Social Sciences, and Arts and Sports Science.', 'Choose by interests, abilities and career goals.'], [
    ['How many senior school pathways are there?', 'Three', 'Two pathways only', 'Five different pathways', 'Seven different pathways'],
    ['Which should guide a learner\'s choice of pathway?', 'Her interests, abilities and goals', 'Only where her friends are going', 'Only what her neighbour chose', 'Only the shortest route'],
    ['Which pathway includes law, history and languages?', 'Social Sciences', 'Trade and market only', 'Farming and fishing only', 'Transport and roads only'],
    ['Which pathway includes sports and the arts?', 'Arts and Sports Science', 'Mining and trade only', 'Kitchen and garden only', 'Shops and banks only'],
    ['Which pathway covers science, technology, engineering and mathematics?', 'STEM', 'Shopping and travel only', 'Forests and rivers only', 'Roads and rails only'],
  ], [
    ['Achieng likes science and mathematics and wants to be an engineer. Which pathway suits her interest?', 'STEM', 'Arts and Sports Science', 'No pathway at all', 'Any pathway whatsoever'],
    ['Wekesa loves football and music and wants a career in sport. Which pathway suits his interest?', 'Arts and Sports Science', 'STEM only', 'No pathway at all', 'Any pathway whatsoever'],
    ['Njeri enjoys history, languages and law. Which pathway suits her interest?', 'Social Sciences', 'STEM only', 'No pathway at all', 'Any pathway whatsoever'],
    ['A learner says she will choose the pathway her friends choose. What is a better way?', 'Choose by her interests and abilities', 'Copy her friends completely', 'Pick by the shortest name', 'Pick by drawing lots'],
    ['Before choosing, a learner talks to a parent and a teacher. Why is this useful?', 'They help her weigh her interests and abilities', 'They choose for her without asking', 'They make the choice harder', 'They are not needed at all'],
  ], [
    ['Which step is the mistake?', 'Step 1: Senior school has pathways.', 'Step 2: There are three of them.', 'Step 3: So there are only two pathways.', 'There are three pathways.', 0],
    ['Which step is the mistake?', 'Step 1: A pathway shapes future subjects.', 'Step 2: Interests and abilities matter.', 'Step 3: So we choose the same pathway as our friends.', 'We choose by interests, abilities and goals.', 1],
    ['Which step is the mistake?', 'Step 1: Social Sciences is a pathway.', 'Step 2: STEM is a pathway.', 'Step 3: So Trade and market only is a pathway.', 'The three pathways are STEM, Social Sciences, and Arts and Sports Science.', 2],
    ['Which step is the mistake?', 'Step 1: Counsellors help learners choose.', 'Step 2: Parents also advise.', 'Step 3: So a learner should ask nobody.', 'A learner can consult parents, teachers and counsellors.', 2],
    ['Which step is the mistake?', 'Step 1: Career goals matter in choosing.', 'Step 2: Performance matters too.', 'Step 3: So interests do not matter at all.', 'Interests matter too.', 2],
  ], ['a', 'b']),
  ...S('pc', PS, 'PRE_CAREER', ['PC_SUPPORT', 'PC_MAP', 'PC_ONLY'], ['Counsellors, teachers, parents and mentors support careers.', 'Mapping links interests and abilities to careers.'], [
    ['Which is a pre-career support system?', 'A school counsellor', 'A rumour in the market', 'A random guess', 'A quarrel at home'],
    ['What does pre-career mapping do?', 'Links interests and abilities to careers', 'Fixes the job for the whole of her life', 'Chooses the school for her at once', 'Ends all of her learning for ever'],
    ['Who can advise a learner on careers?', 'Parents, teachers, counsellors and mentors', 'Only the parents of the learner', 'Only the head of the village', 'Nobody at all'],
    ['Which is a pre-career activity at school?', 'A career talk by a visitor', 'A long holiday from classes', 'A game of football only', 'A rubbish clean-up only'],
    ['Why is pre-career mapping useful?', 'It helps a learner plan her growth', 'It stops her from learning anything new', 'It chooses all her friends for her', 'It makes all careers much harder'],
  ], [
    ['A learner meets the school counsellor to talk about careers. What is the counsellor?', 'A support system', 'A barrier to careers', 'A rumour about careers', 'A cost of careers'],
    ['A learner lists her interests and abilities and links them to jobs. What is this?', 'Pre-career mapping', 'Wasting time', 'Copying a friend', 'Choosing by luck'],
    ['A professional visits school to talk about her job. How does this help learners?', 'It shows real careers and how to reach them', 'It tells them to leave school at once', 'It makes them avoid all kinds of work', 'It is of no help to any of them'],
    ['A learner says only parents can advise on careers. What can you say?', 'Teachers, counsellors and mentors can also advise', 'She is right, only the parents can advise', 'Nobody at all can advise on careers', 'Only her friends can advise on careers'],
    ['A learner has no money for a career course. Which support might help?', 'A bursary or a scholarship', 'A rumour', 'A long holiday', 'A broken promise'],
  ], [
    ['Which step is the mistake?', 'Step 1: Counsellors give guidance.', 'Step 2: Teachers also guide.', 'Step 3: So a rumour is a pre-career support system.', 'A counsellor is a support system.', 0],
    ['Which step is the mistake?', 'Step 1: Mapping lists interests and abilities.', 'Step 2: It links them to careers.', 'Step 3: So it fixes a job for life.', 'It helps plan, but does not fix a job.', 2],
    ['Which step is the mistake?', 'Step 1: Many people can guide a learner.', 'Step 2: They include parents and teachers.', 'Step 3: So only parents can advise.', 'Many people can advise.', 2],
    ['Which step is the mistake?', 'Step 1: Career talks show real jobs.', 'Step 2: Learners ask questions.', 'Step 3: So career talks are not useful.', 'Career talks are useful.', 2],
    ['Which step is the mistake?', 'Step 1: Mapping supports growth.', 'Step 2: It looks ahead.', 'Step 3: So it ends learning.', 'It supports learning.', 2],
  ], ['a', 'd']),
  ...S('cs', CS, 'CSL_STEPS', ['CS_ORDER', 'CS_PLAN', 'CS_REPORT'], ['Identify, design, plan, implement, then report.', 'The report comes last.'], [
    ['What is the first step in a community service project?', 'Identify the problem', 'Write the report', 'Hold the closing party', 'Collect the thanks'],
    ['What comes before implementing a project?', 'Planning', 'Writing the report', 'Holding a party', 'Resting'],
    ['What comes last in a community service project?', 'Writing the report', 'Identifying the problem', 'Designing the solution', 'Planning'],
    ['How can a learner identify a community problem?', 'By observing and asking people', 'By guessing in the dark', 'By staying at home', 'By ignoring it'],
    ['What is designing a solution?', 'Thinking up a way to solve the problem', 'Writing the final report', 'Counting the money', 'Forgetting the problem'],
  ], [
    ['A class notices rubbish piling up near their school. What should they do first?', 'Identify it as the problem', 'Write the final report', 'Hold the closing party', 'Ignore it'],
    ['The class has a solution and now writes who will do what and when. What step is this?', 'Planning', 'Reporting', 'Identifying the problem', 'Celebrating'],
    ['After the clean-up, the class writes what they did. What step is this?', 'Reporting', 'Planning', 'Identifying the problem', 'Designing'],
    ['The class decides to dig a pit and sort the rubbish. What step is this?', 'Designing a solution', 'Writing a report', 'Resting', 'Ignoring it'],
    ['Which list is in the right order?', 'Identify, design, plan, implement, report', 'Report, plan, design, identify, implement', 'Plan, report, identify, design, implement', 'Implement, report, plan, design, identify'],
  ], [
    ['Which step is the mistake?', 'Step 1: A project starts with a problem.', 'Step 2: The class identifies it.', 'Step 3: So the first step is writing the report.', 'The first step is identifying the problem.', 2],
    ['Which step is the mistake?', 'Step 1: A solution is designed.', 'Step 2: A plan follows.', 'Step 3: So we implement before planning.', 'We plan before implementing.', 2],
    ['Which step is the mistake?', 'Step 1: The work is done.', 'Step 2: The class reflects.', 'Step 3: So the report is written first.', 'The report is written last.', 2],
    ['Which step is the mistake?', 'Step 1: Problems are found by observing.', 'Step 2: People can also be asked.', 'Step 3: So we do not need to look.', 'We observe and ask.', 2],
    ['Which step is the mistake?', 'Step 1: A solution should be realistic.', 'Step 2: It uses what the community has.', 'Step 3: So it should ignore the community.', 'It should involve the community.', 2],
  ], ['a', 'b', 'c']),
  ...S('sa', SA, 'STONE_AGE', ['SA_FARM', 'SA_TOOL', 'SA_SITE'], ['Early humans hunted and gathered and made stone tools.', 'Olduvai Gorge and Olorgesailie are famous sites.'], [
    ['How did early Stone Age humans get food?', 'By hunting and gathering', 'By farming crops', 'By buying at markets', 'By trading by ship'],
    ['What were Stone Age tools made of?', 'Stone', 'Iron', 'Plastic', 'Steel'],
    ['Which is a Stone Age site in East Africa?', 'Olduvai Gorge', 'Fort Jesus', 'Great Zimbabwe', 'Aswan Dam'],
    ['Where did early humans often live?', 'In caves and rock shelters', 'In tall brick houses', 'In towns with markets', 'In ships on the sea'],
    ['Which tool was made by early humans?', 'A hand axe', 'A tractor', 'A computer', 'A bicycle'],
  ], [
    ['Early humans followed animals and picked wild fruit. What way of life was this?', 'Hunting and gathering', 'Farming', 'Trading', 'Mining'],
    ['An archaeologist finds a sharp chopper of stone. What age is it likely from?', 'The Stone Age', 'The Iron Age', 'The modern age', 'The Space Age'],
    ['A scientist visits Olorgesailie in Kenya. What will she study there?', 'Stone Age tools', 'Modern ships', 'Roman coins', 'Tractor engines'],
    ['A family of early humans shelters from rain in a cave. Why?', 'Caves gave protection from weather and animals', 'They built tall towers', 'They had no need of shelter', 'They disliked the sun'],
    ['Later Stone Age people used small stone tools called microliths. Why?', 'They were sharp and could be fixed to handles', 'They were heavy and blunt', 'They were made of iron', 'They were bought in shops'],
  ], [
    ['Which step is the mistake?', 'Step 1: Early humans lived long ago.', 'Step 2: They hunted animals and gathered fruit.', 'Step 3: So they grew crops on big farms.', 'They hunted and gathered.', 2],
    ['Which step is the mistake?', 'Step 1: The Stone Age is named after stone.', 'Step 2: Tools were of stone.', 'Step 3: So Stone Age tools were of iron.', 'Tools were of stone.', 2],
    ['Which step is the mistake?', 'Step 1: Olduvai Gorge is in Tanzania.', 'Step 2: It has early human remains.', 'Step 3: So it is a medieval fort.', 'It is a Stone Age site.', 2],
    ['Which step is the mistake?', 'Step 1: Early humans needed shelter.', 'Step 2: Caves gave shelter.', 'Step 3: So they built tall brick houses.', 'They used caves and rock shelters.', 2],
    ['Which step is the mistake?', 'Step 1: Early humans learned to use fire.', 'Step 2: Fire gave warmth and protection.', 'Step 3: So fire was never used.', 'Fire was used.', 2],
  ], ['a', 'b']),
  ...S('ik', IK, 'INDIGENOUS_KNOWLEDGE', ['IK_WRITTEN', 'IK_TYPE', 'IK_USE'], ['Indigenous knowledge was passed on by word of mouth.', 'It includes herbal medicine, proverbs and farming skills.'], [
    ['How was indigenous knowledge mainly passed on?', 'By word of mouth', 'By printed books', 'By television', 'By the internet'],
    ['Which is an indigenous knowledge system?', 'Herbal medicine', 'A computer game', 'A mobile app', 'A video film'],
    ['What was indigenous knowledge used for?', 'Sustaining life', 'Nothing useful at all', 'Only for decoration', 'Only for play'],
    ['Which is an example of oral literature?', 'A proverb', 'A text message', 'A bank form', 'A printed map'],
    ['Who often taught indigenous knowledge?', 'Elders', 'Machines', 'Newspapers', 'Strangers online'],
  ], [
    ['Grandmother tells stories and proverbs to the children at night. How is she passing on knowledge?', 'By word of mouth', 'By printed books', 'By television', 'By the internet'],
    ['A healer uses plants to treat fever. Which knowledge system is this?', 'Herbal medicine', 'Space science', 'Computer science', 'Mobile banking'],
    ['Farmers read the clouds to know when it will rain. What is this knowledge used for?', 'Planning farm work and sustaining life', 'Nothing at all', 'Making noise', 'Passing time'],
    ['A learner says indigenous knowledge is useless today. What can you say?', 'It still helps us in many ways', 'She is right', 'It is never used', 'It harms people'],
    ['A community uses a proverb to teach honesty. What is this?', 'Oral literature', 'A bank form', 'A text message', 'A road sign'],
  ], [
    ['Which step is the mistake?', 'Step 1: Elders knew many things.', 'Step 2: They taught the young.', 'Step 3: So they used only printed books.', 'They taught by word of mouth.', 2],
    ['Which step is the mistake?', 'Step 1: Herbal medicine uses plants.', 'Step 2: It is passed down.', 'Step 3: So it is a computer game.', 'It is an indigenous knowledge system.', 2],
    ['Which step is the mistake?', 'Step 1: Indigenous knowledge helped people live.', 'Step 2: It guided farming and health.', 'Step 3: So it had no use.', 'It helped sustain life.', 2],
    ['Which step is the mistake?', 'Step 1: Proverbs carry advice.', 'Step 2: They are spoken.', 'Step 3: So proverbs are printed forms.', 'Proverbs are oral literature.', 2],
    ['Which step is the mistake?', 'Step 1: We can use old and new knowledge.', 'Step 2: Each helps decisions.', 'Step 3: So indigenous knowledge must be thrown away.', 'We can use both.', 2],
  ], ['a', 'b']),
  ...S('po', PO, 'POVERTY', ['PO_CAUSE', 'PO_OVER', 'PO_GOV'], ['Unemployment, corruption, drought and conflict cause poverty.', 'Overuse of resources can leave them empty.'], [
    ['Which is a cause of poverty?', 'Unemployment', 'High employment', 'Good harvests every year', 'Fair wages for all'],
    ['What can overexploiting resources lead to?', 'Empty resources and poverty', 'Endless wealth for everyone', 'Cleaner air at once', 'More jobs for ever'],
    ['Which can lead to poverty?', 'Corruption', 'Good governance', 'Honest leaders', 'Fair laws'],
    ['Which is a cause of poverty in Africa?', 'Drought and famine', 'Plentiful rain every year', 'Peace in all countries', 'Cheap food for all'],
    ['Which is overexploitation of a resource?', 'Cutting trees faster than they grow', 'Planting a tree for each one cut', 'Using only what is needed', 'Saving water'],
  ], [
    ['Many young people in a town cannot find work. What does this cause?', 'Poverty', 'Wealth', 'Plenty of food', 'Peace only'],
    ['A river is emptied of fish because of too much fishing. What is the result?', 'Fewer fish and less income', 'More fish for ever', 'Cheaper food for ever', 'More jobs for ever'],
    ['Officials steal money meant for schools. What may follow?', 'More poverty', 'More wealth for all', 'Better schools', 'Fewer problems'],
    ['Drought destroys a farmer\'s crops. What may follow?', 'Hunger and poverty', 'A big harvest', 'More money', 'Better soil at once'],
    ['A conflict forces families to leave their homes. What may follow?', 'Loss of property and poverty', 'More wealth', 'Better schools', 'Fewer problems'],
  ], [
    ['Which step is the mistake?', 'Step 1: People need jobs to earn.', 'Step 2: Unemployment means no earnings.', 'Step 3: So unemployment reduces poverty.', 'Unemployment causes poverty.', 2],
    ['Which step is the mistake?', 'Step 1: Resources are limited.', 'Step 2: Overuse empties them.', 'Step 3: So overuse brings endless wealth.', 'Overuse can bring poverty.', 2],
    ['Which step is the mistake?', 'Step 1: Public money is for services.', 'Step 2: Corruption steals it.', 'Step 3: So corruption helps reduce poverty.', 'Corruption increases poverty.', 2],
    ['Which step is the mistake?', 'Step 1: Drought kills crops.', 'Step 2: Farmers lose income.', 'Step 3: So drought makes people richer.', 'Drought can cause poverty.', 2],
    ['Which step is the mistake?', 'Step 1: Education helps people earn.', 'Step 2: Low education limits jobs.', 'Step 3: So low education reduces poverty.', 'Low education can cause poverty.', 2],
  ], ['a', 'b']),
  ...S('pp', PP, 'POPULATION', ['PP_SOURCE', 'PP_BASE', 'PP_GERMANY'], ['The census counts the population.', 'A developing country has a wide base; a developed one has a narrower base.'], [
    ['Which is a source of population data?', 'The census', 'A rumour', 'A weather report', 'A bus timetable'],
    ['What shape has a developing country\'s pyramid, such as Kenya\'s?', 'A wide base', 'A narrow base', 'A round shape', 'A flat shape'],
    ['What shape has a developed country\'s pyramid, such as Germany\'s?', 'A narrower base', 'A very wide base', 'A triangle only', 'A flat shape'],
    ['What does a wide base on a pyramid show?', 'Many children', 'Many old people', 'No children', 'No adults'],
    ['Which also records population facts?', 'Registration of births and deaths', 'A football score', 'A rain gauge', 'A price list'],
  ], [
    ['A government counts everyone in the country every ten years. What is this?', 'A census', 'A rumour', 'A rainfall record', 'A market day'],
    ['A country has many children and few old people. What shape is its pyramid?', 'A wide base', 'A narrow base', 'A round shape', 'A flat shape'],
    ['A country has many old people and fewer children. What is its pyramid like?', 'A narrower base', 'A very wide base', 'A triangle only', 'A flat shape'],
    ['Why do governments need population data?', 'To plan schools, health and resources', 'To plan the weather', 'To plan sports only', 'To plan nothing'],
    ['Which two countries are used to compare population structure?', 'Kenya and Germany', 'Kenya and Uganda only', 'Egypt and Ghana only', 'Chad and Niger only'],
  ], [
    ['Which step is the mistake?', 'Step 1: A census counts people.', 'Step 2: It gives population data.', 'Step 3: So a rumour is a good source.', 'The census is a source.', 2],
    ['Which step is the mistake?', 'Step 1: Kenya has many children.', 'Step 2: Many children make a wide base.', 'Step 3: So Kenya\'s pyramid has a narrow base.', 'Kenya\'s pyramid has a wide base.', 2],
    ['Which step is the mistake?', 'Step 1: Germany has fewer births.', 'Step 2: It has many older people.', 'Step 3: So its pyramid has a very wide base.', 'Its base is narrower.', 2],
    ['Which step is the mistake?', 'Step 1: A pyramid shows age and sex.', 'Step 2: Bars show how many people.', 'Step 3: So a pyramid shows rainfall.', 'A pyramid shows age and sex.', 2],
    ['Which step is the mistake?', 'Step 1: Births and deaths are registered.', 'Step 2: This gives population data.', 'Step 3: So it is not a source.', 'It is a source.', 2],
  ], ['a', 'b']),
  ...S('pe', PE, 'PEACE', ['PE_INNER', 'PE_BARRIER', 'PE_EQ'], ['Inner peace is calm within a person.', 'Prejudice and mistrust are barriers to resolving conflict.'], [
    ['What is inner peace?', 'Calmness within a person', 'Peace among nations', 'A treaty between parties', 'A school rule'],
    ['Which is a barrier to conflict resolution?', 'Prejudice', 'Listening', 'Honesty', 'Respect'],
    ['What does emotional intelligence help with?', 'Managing emotions', 'Fuelling anger', 'Starting fights', 'Hiding the truth'],
    ['Which is a type of peace?', 'Peace in the community', 'A war in the town', 'A long noise', 'A quarrel'],
    ['Which helps to resolve a quarrel?', 'Talking calmly and listening', 'Shouting loudly', 'Walking away in anger', 'Spreading rumours'],
  ], [
    ['A learner stays calm and thinks before she reacts. What is she showing?', 'Emotional intelligence', 'Anger', 'Prejudice', 'Mistrust'],
    ['Two groups refuse to listen to each other because of old suspicion. What is this?', 'A barrier to conflict resolution', 'A way to resolve conflict', 'A kind of peace', 'A friendship'],
    ['A person feels calm and content within herself. What kind of peace is this?', 'Inner peace', 'National peace', 'World peace', 'Peace treaty'],
    ['Neighbours talk and agree on a boundary. What kind of peace is this?', 'Community peace', 'Inner peace', 'War', 'A quarrel'],
    ['A learner is very angry. What can she do to manage it?', 'Breathe, calm down and then talk', 'Shout at others', 'Hit someone', 'Spread rumours'],
  ], [
    ['Which step is the mistake?', 'Step 1: Inner peace is calm within.', 'Step 2: It is about the person.', 'Step 3: So inner peace is peace among nations.', 'Inner peace is calm within a person.', 2],
    ['Which step is the mistake?', 'Step 1: Prejudice judges before knowing.', 'Step 2: It blocks listening.', 'Step 3: So prejudice helps resolve conflict.', 'Prejudice is a barrier.', 2],
    ['Which step is the mistake?', 'Step 1: Emotional intelligence manages feelings.', 'Step 2: It helps with anger.', 'Step 3: So it fuels anger.', 'It helps manage anger.', 2],
    ['Which step is the mistake?', 'Step 1: Peace has types.', 'Step 2: One is community peace.', 'Step 3: So peace is only between countries.', 'Peace also exists in the community.', 2],
    ['Which step is the mistake?', 'Step 1: Listening helps resolve conflict.', 'Step 2: Calm talk helps.', 'Step 3: So shouting helps.', 'Calm talk helps.', 2],
  ], ['a', 'b']),
  ...S('rl', HR, 'RELATIONSHIPS', ['RL_WAY', 'RL_BARRIER', 'RL_FORGIVE'], ['Respect, trust and forgiveness sustain relationships.', 'Jealousy and gossip are barriers.'], [
    ['Which sustains a healthy relationship?', 'Respect', 'Gossip', 'Jealousy', 'Insults'],
    ['Which is a barrier to a healthy relationship?', 'Jealousy', 'Trust', 'Honesty', 'Kindness'],
    ['What does forgiveness do?', 'Heals the relationship', 'Ends the friendship', 'Starts a fight', 'Hides the truth'],
    ['Which helps friends understand each other?', 'Honest talk and listening', 'Secret rumours', 'Shouting', 'Silence for years'],
    ['Which is a barrier to harmony?', 'Gossip', 'Sharing', 'Listening', 'Kindness'],
  ], [
    ['Two friends listen to each other and show respect. What are they doing?', 'Sustaining a healthy relationship', 'Breaking up the friendship', 'Gossiping about other people', 'Fighting about small things'],
    ['A girl is jealous of her friend\'s marks and avoids her. What is this?', 'A barrier to a healthy relationship', 'A way to sustain a friendship', 'A strong form of trust between them', 'A strong form of honest talk'],
    ['Wanjiru forgives her friend who said sorry. What is the effect?', 'The friendship is healed', 'The friendship ends', 'A fight starts', 'The truth is hidden'],
    ['Someone spreads gossip about a classmate. What may happen?', 'Trust is damaged', 'Friendship grows', 'Harmony grows', 'Nothing at all'],
    ['A learner is pressured by peers to do wrong. What is a good response?', 'Say no politely and stay true to herself', 'Give in at once to the pressure', 'Pressure other learners as well', 'Hide from everyone for a month'],
  ], [
    ['Which step is the mistake?', 'Step 1: Relationships need care.', 'Step 2: Respect sustains them.', 'Step 3: So gossip sustains them.', 'Respect sustains them.', 2],
    ['Which step is the mistake?', 'Step 1: Jealousy hurts friendships.', 'Step 2: It causes mistrust.', 'Step 3: So jealousy is a way to sustain a friendship.', 'Jealousy is a barrier.', 2],
    ['Which step is the mistake?', 'Step 1: People sometimes hurt each other.', 'Step 2: Forgiveness can heal.', 'Step 3: So forgiveness ends the friendship.', 'Forgiveness heals.', 2],
    ['Which step is the mistake?', 'Step 1: Honest talk builds trust.', 'Step 2: Listening shows respect.', 'Step 3: So we should never talk to friends.', 'We should talk and listen.', 2],
    ['Which step is the mistake?', 'Step 1: Peer pressure is a barrier.', 'Step 2: We can resist it.', 'Step 3: So we must always give in.', 'We can say no.', 2],
  ], ['a', 'b']),
];
