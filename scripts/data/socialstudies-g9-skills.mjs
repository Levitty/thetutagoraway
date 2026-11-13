// ============================================================================
// SOCIAL STUDIES GRADE 9: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/social_studies/g9.json by scripts/build-socialstudies-g9.mjs. KICD's outcomes and rubrics are never touched.
// One skill for each sub-strand whose knowledge outcome a tapped question can test. Designing, constructing maps and pyramids, community
// projects, reports, appreciation and participation are marked by the teacher (see the non-question note).
// Facts are those taught in Kenyan schools; dates and examples are limited to well-known ones, to confirm by a Social Studies teacher.
// Everything is draft until a Social Studies teacher reviews it.
// A skill: [sub-strand key after 'SOCI.G9.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const PC = 'SOCIAL.PATHWAY_CHOICES', PS = 'SOCIAL.PRE_CAREER_SUPPORT_SYSTE', CS = 'COMMUN.COMMUNITY_SERVICE_LEARNI';
const SA = 'PEOPLE.SOCIO_ECONOMIC_PRACTICES', IK = 'PEOPLE.INDIGENOUS_KNOWLEDGE_SYS', PO = 'PEOPLE.POVERTY_REDUCTION', PP = 'PEOPLE.POPULATION_STRUCTURE', PE = 'PEOPLE.PEACEFUL_CONFLICT_RESOLU', HR = 'PEOPLE.HEALTHY_RELATIONSHIPS';
const TM = 'NATURA.TOPOGRAPHICAL_MAPS', LF = 'NATURA.INTERNAL_LAND_FORMING_PR', RP = 'NATURA.MULTI_PURPOSE_RIVER_PROJ', EM = 'NATURA.MANAGEMENT_AND_CONSERVAT', WH = 'NATURA.WORLD_HERITAGE_SITES_IN_';
const CK = 'POLITI.THE_CONSTITUTION_OF_KENY', CE = 'POLITI.CIVIC_ENGAGEMENT_IN_GOVE', BR = 'POLITI.KENYA_S_BILL_OF_RIGHTS', CG = 'POLITI.CULTURAL_GLOBALISATION';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [PC, 'PATHWAYS', 'Name the senior school pathways and what to weigh in choosing one', ['a', 'b'], [], FM, 'The child names the three pathways (STEM; Social Sciences; Arts and Sports Science) and the factors for choosing (interests, abilities, career goals, performance and the subjects offered), and says a pathway is chosen with parents, teachers and counsellors.'],
  [PS, 'PRE_CAREER', 'Name pre-career support systems and why mapping matters', ['a', 'd'], ['PATHWAYS'], FM, 'The child names support systems (parents, teachers, counsellors, mentors, career talks, school clubs), and says pre-career mapping helps a learner link interests and abilities to careers.'],
  [CS, 'CSL_STEPS', 'Put the steps of a community service project in order', ['a', 'b', 'c'], [], FM, 'The child gives the order identify the problem, design a solution, plan, implement, then report, and says a problem is found by observing and asking the community.'],
  [SA, 'STONE_AGE', 'Describe the Stone Age practices and tools of early humans in Africa', ['a', 'b'], [], FM, 'The child says early humans were hunters and gatherers who lived in caves or rock shelters, made tools of stone (hand axes, choppers, flakes), later used fire and made small tools, and that Olduvai Gorge and Olorgesailie are famous sites.'],
  [IK, 'INDIGENOUS_KNOWLEDGE', 'Name indigenous knowledge systems and what they were used for', ['a', 'b'], [], FM, 'The child names oral literature (proverbs, stories, riddles), herbal medicine, weather forecasting, farming and craft skills, and says elders passed them on by word of mouth so that life could continue.'],
  [PO, 'POVERTY', 'Name causes of poverty in Africa and the effect of overexploitation', ['a', 'b'], [], FM, 'The child names causes (unemployment, drought, poor governance and corruption, conflict, low education, rapid population growth) and says overexploiting resources (cutting trees, overfishing, over-mining) can empty resources and deepen poverty.'],
  [PP, 'POPULATION', 'Name sources of population data and read population structure', ['a', 'b'], [], FM, 'The child names the census, sample surveys and registration of births and deaths as sources, and says a developing country such as Kenya has a wide-based pyramid (many children) and a developed country such as Germany has a narrower base (older population).'],
  [PE, 'PEACE', 'Name types of peace and barriers to resolving conflict', ['a', 'b'], [], FM, 'The child names inner peace, peace between people, community peace and national peace, and barriers (anger, prejudice, mistrust, poor communication), and says emotional intelligence helps handle anger.'],
  [HR, 'RELATIONSHIPS', 'Name ways of sustaining healthy relationships and barriers to them', ['a', 'b'], [], FM, 'The child names respect, honest talk, trust, forgiveness and listening as ways to sustain a relationship, and jealousy, mistrust, gossip and peer pressure as barriers.'],
  [TM, 'TOPO_MAPS', 'Read human activities and scale work on topographical maps', ['a', 'b', 'c'], [], FM, 'The child says a topographical map shows settlements, roads, railways, farms and markets by symbols, contour lines show height, a cross-section shows the shape of the land along a line, and a map is enlarged or reduced by changing the scale.'],
  [LF, 'LAND_FORMING', 'Name earth movements, faulting features and their effects', ['a', 'c', 'd'], [], FM, 'The child says tensional forces pull the crust apart and compressional forces push it together, that faulting makes rift valleys, block mountains and escarpments, that the Great Rift Valley crosses Kenya, and that faulting brings earthquakes, lakes and hot springs.'],
  [RP, 'RIVER_PROJECTS', 'Name multi-purpose river projects in Africa and their uses and challenges', ['a', 'c', 'd'], [], FM, 'The child names Aswan High Dam on the Nile, Kariba on the Zambezi, Akosombo on the Volta and the Seven Forks on the Tana, and says they give electricity, irrigation, water, flood control and fish, with challenges of high cost, displaced people and silting.'],
  [EM, 'ENV_DEGRADATION', 'Name causes, effects and answers to environmental degradation', ['a', 'b', 'c'], [], FM, 'The child names causes (deforestation, overgrazing, pollution, poor farming), effects (soil erosion, drought, floods, loss of wildlife) and answers (planting trees, terracing, recycling, laws).'],
  [WH, 'HERITAGE_SITES', 'Name World Heritage sites in Africa and why they are kept', ['a', 'b'], [], FM, 'The child names Lamu Old Town, Fort Jesus, Mount Kenya and Lake Turkana National Parks in Kenya, the Pyramids of Giza in Egypt, the Serengeti in Tanzania and Great Zimbabwe, and says they are kept for culture, tourism and history.'],
  [CK, 'CONSTITUTION_MAKING', 'Put the stages of making Kenya\'s Constitution in order and name roles', ['a', 'b', 'c'], [], FM, 'The child says the stages were collecting views from citizens, drafting, debate by Parliament, a referendum and promulgation in 2010, that Parliament debates and approves the draft, and that citizens give views and vote in the referendum.'],
  [CE, 'CIVIC_ENGAGEMENT', 'Name civic activities, parties and positions in a general election', ['a', 'b', 'c'], ['CONSTITUTION_MAKING'], FM, 'The child names voting, attending public forums, paying taxes and joining a party as civic activities, says parties field candidates and give citizens a voice, and names President, Governor, Senator, Member of the National Assembly, Woman Representative and Member of a County Assembly.'],
  [BR, 'BILL_OF_RIGHTS', 'Name rights in Kenya\'s Bill of Rights and groups needing special care', ['a', 'b'], ['CONSTITUTION_MAKING'], FM, 'The child says the Bill of Rights is in Chapter 4 of the 2010 Constitution, names rights (life, equality, expression, privacy, education), and says special groups such as children, persons with disabilities, youth, older persons and minorities are protected.'],
  [CG, 'GLOBAL_CULTURE', 'Name cultural elements with global recognition and how to keep them', ['a', 'b', 'c'], [], FM, 'The child names language, music, dance, dress, food and sport as elements of culture, says Kiswahili and Kenyan marathon running are recognised in the world, and says respect and dialogue promote a common humanity.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_SS9_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('PATHWAYS', 'PW_NUMBER', 'Gives the wrong number of pathways.', 'How many senior school pathways are there?', 'Two', 'Three', 'There are three pathways: STEM, Social Sciences, and Arts and Sports Science.'),
  m('PATHWAYS', 'PW_FACTOR', 'Chooses by a friend\'s pathway.', 'Which should guide a learner\'s choice of pathway?', 'Where her friends are going', 'Her interests, abilities and career goals', 'Choose by interests, abilities and career goals.'),
  m('PATHWAYS', 'PW_NAME', 'Names a non-pathway.', 'Which is a senior school pathway?', 'Trade and Business only', 'Social Sciences', 'Social Sciences is a pathway.'),
  m('PRE_CAREER', 'PC_SUPPORT', 'Names a non-support.', 'Which is a pre-career support system?', 'A rumour', 'A school counsellor', 'Counsellors, teachers and mentors support careers.'),
  m('PRE_CAREER', 'PC_MAP', 'Thinks mapping fixes the job at once.', 'What does pre-career mapping do?', 'Fixes the job for life', 'Links interests and abilities to careers', 'Mapping links interests and abilities to careers.'),
  m('PRE_CAREER', 'PC_ONLY', 'Thinks only parents advise.', 'Who can advise a learner on careers?', 'Only the parents', 'Parents, teachers, counsellors and mentors', 'Many people can advise.'),
  m('CSL_STEPS', 'CS_ORDER', 'Starts with the report.', 'What is the first step in a community service project?', 'Write the report', 'Identify the problem', 'The first step is to identify the problem.'),
  m('CSL_STEPS', 'CS_PLAN', 'Implements before planning.', 'What comes before implementing?', 'Writing the report', 'Planning', 'Plan before you implement.'),
  m('CSL_STEPS', 'CS_REPORT', 'Writes the report first.', 'What comes last?', 'Identifying the problem', 'Writing the report', 'The report comes last.'),
  m('STONE_AGE', 'SA_FARM', 'Says early humans were farmers.', 'How did early Stone Age humans get food?', 'By farming crops', 'By hunting and gathering', 'Early humans hunted and gathered.'),
  m('STONE_AGE', 'SA_TOOL', 'Says tools were of iron.', 'What were Stone Age tools made of?', 'Iron', 'Stone', 'Stone Age tools were made of stone.'),
  m('STONE_AGE', 'SA_SITE', 'Names a wrong site.', 'Which is a Stone Age site in East Africa?', 'Fort Jesus', 'Olduvai Gorge', 'Olduvai Gorge is a famous Stone Age site.'),
  m('INDIGENOUS_KNOWLEDGE', 'IK_WRITTEN', 'Says it was written down.', 'How was indigenous knowledge mainly passed on?', 'By printed books', 'By word of mouth', 'It was passed on by word of mouth.'),
  m('INDIGENOUS_KNOWLEDGE', 'IK_TYPE', 'Names a non-type.', 'Which is an indigenous knowledge system?', 'A computer game', 'Herbal medicine', 'Herbal medicine is indigenous knowledge.'),
  m('INDIGENOUS_KNOWLEDGE', 'IK_USE', 'Says it has no use now.', 'What was indigenous knowledge used for?', 'Nothing useful', 'Sustaining life', 'It helped sustain life.'),
  m('POVERTY', 'PO_CAUSE', 'Names a cause that reduces poverty.', 'Which is a cause of poverty?', 'High employment', 'Unemployment', 'Unemployment causes poverty.'),
  m('POVERTY', 'PO_OVER', 'Thinks overuse enriches for ever.', 'What can overexploiting resources lead to?', 'Endless wealth', 'Empty resources and poverty', 'Overuse can empty resources.'),
  m('POVERTY', 'PO_GOV', 'Says good governance causes poverty.', 'Which can lead to poverty?', 'Good governance', 'Corruption', 'Corruption can lead to poverty.'),
  m('POPULATION', 'PP_SOURCE', 'Names a non-source.', 'Which is a source of population data?', 'A rumour', 'The census', 'The census counts the population.'),
  m('POPULATION', 'PP_BASE', 'Gives a narrow base for Kenya.', 'What shape has a developing country\'s pyramid?', 'A narrow base', 'A wide base', 'A developing country has a wide base.'),
  m('POPULATION', 'PP_GERMANY', 'Gives a wide base for Germany.', 'What shape has a developed country\'s pyramid?', 'A very wide base', 'A narrower base', 'A developed country has a narrower base.'),
  m('PEACE', 'PE_INNER', 'Does not know inner peace.', 'What is inner peace?', 'Peace among nations', 'Calmness within a person', 'Inner peace is calm within a person.'),
  m('PEACE', 'PE_BARRIER', 'Names a help as a barrier.', 'Which is a barrier to conflict resolution?', 'Listening', 'Prejudice', 'Prejudice is a barrier.'),
  m('PEACE', 'PE_EQ', 'Thinks emotional intelligence is anger.', 'What does emotional intelligence help with?', 'Fuelling anger', 'Managing emotions', 'It helps manage emotions.'),
  m('RELATIONSHIPS', 'RL_WAY', 'Names a harm as a way.', 'Which sustains a healthy relationship?', 'Gossip', 'Respect', 'Respect sustains relationships.'),
  m('RELATIONSHIPS', 'RL_BARRIER', 'Names a help as a barrier.', 'Which is a barrier to a healthy relationship?', 'Trust', 'Jealousy', 'Jealousy is a barrier.'),
  m('RELATIONSHIPS', 'RL_FORGIVE', 'Thinks forgiveness is weakness.', 'What does forgiveness do?', 'Ends the friendship', 'Heals the relationship', 'Forgiveness heals relationships.'),
  m('TOPO_MAPS', 'TM_CONTOUR', 'Thinks contours show roads.', 'What do contour lines show?', 'Roads', 'Height of the land', 'Contour lines show height.'),
  m('TOPO_MAPS', 'TM_SECTION', 'Mixes cross-section and plan.', 'What does a cross-section show?', 'The map\'s title', 'The shape of the land along a line', 'A cross-section shows the shape of the land.'),
  m('TOPO_MAPS', 'TM_HUMAN', 'Names a physical item as human.', 'Which is a human activity shown on a map?', 'A river', 'A railway', 'A railway is a human feature.'),
  m('LAND_FORMING', 'LF_TENSION', 'Mixes tensional and compressional.', 'Which force pulls the crust apart?', 'Compressional', 'Tensional', 'Tensional forces pull the crust apart.'),
  m('LAND_FORMING', 'LF_RIFT', 'Says faulting makes volcanoes only.', 'Which feature is made by faulting?', 'A delta', 'A rift valley', 'Faulting makes rift valleys.'),
  m('LAND_FORMING', 'LF_EFFECT', 'Thinks faulting has no effects.', 'Which can faulting bring?', 'Nothing at all', 'Earthquakes and hot springs', 'Faulting can bring earthquakes and hot springs.'),
  m('RIVER_PROJECTS', 'RV_RIVER', 'Gives the wrong river.', 'On which river is the Aswan High Dam?', 'The Zambezi', 'The Nile', 'The Aswan High Dam is on the Nile.'),
  m('RIVER_PROJECTS', 'RV_USE', 'Names a harm as a use.', 'Which is a use of a multi-purpose dam?', 'Causing drought', 'Producing electricity', 'Dams produce electricity.'),
  m('RIVER_PROJECTS', 'RV_CHALLENGE', 'Names a benefit as a challenge.', 'Which is a challenge of a big dam?', 'Cheap power', 'Displacing people', 'People may be displaced.'),
  m('ENV_DEGRADATION', 'ED_CAUSE', 'Names a help as a cause.', 'Which causes environmental degradation?', 'Planting trees', 'Deforestation', 'Deforestation degrades the environment.'),
  m('ENV_DEGRADATION', 'ED_EFFECT', 'Gives a good effect.', 'Which is an effect of degradation?', 'Better soil', 'Soil erosion', 'Degradation causes soil erosion.'),
  m('ENV_DEGRADATION', 'ED_ANSWER', 'Names a harm as an answer.', 'Which helps to conserve the environment?', 'Burning forests', 'Terracing and afforestation', 'Terracing and afforestation conserve.'),
  m('HERITAGE_SITES', 'HS_LAMU', 'Places Lamu in Tanzania.', 'In which country is Lamu Old Town?', 'Tanzania', 'Kenya', 'Lamu Old Town is in Kenya.'),
  m('HERITAGE_SITES', 'HS_PYRAMIDS', 'Places the Pyramids in Kenya.', 'In which country are the Pyramids of Giza?', 'Kenya', 'Egypt', 'The Pyramids of Giza are in Egypt.'),
  m('HERITAGE_SITES', 'HS_WHY', 'Says sites are kept for nothing.', 'Why are heritage sites kept?', 'For no reason', 'For culture, history and tourism', 'They keep culture and history.'),
  m('CONSTITUTION_MAKING', 'CM_ORDER', 'Puts the referendum first.', 'Which stage comes first?', 'The referendum', 'Collecting views', 'Views are collected first.'),
  m('CONSTITUTION_MAKING', 'CM_PARLIAMENT', 'Gives Parliament the wrong role.', 'What does Parliament do with the draft?', 'Ignores it', 'Debates and approves it', 'Parliament debates the draft.'),
  m('CONSTITUTION_MAKING', 'CM_YEAR', 'Gives the wrong year.', 'In which year was Kenya\'s current Constitution promulgated?', '2002', '2010', 'The Constitution was promulgated in 2010.'),
  m('CIVIC_ENGAGEMENT', 'CE_ACT', 'Names a non-civic act.', 'Which is a civic activity?', 'Skipping school', 'Voting', 'Voting is a civic activity.'),
  m('CIVIC_ENGAGEMENT', 'CE_PARTY', 'Gives parties the wrong role.', 'What do political parties do?', 'Close schools', 'Field candidates in elections', 'Parties field candidates.'),
  m('CIVIC_ENGAGEMENT', 'CE_POST', 'Names a non-elected post.', 'Which post is vied for in a general election?', 'Head teacher', 'Governor', 'Governor is an elected post.'),
  m('BILL_OF_RIGHTS', 'BR_CHAPTER', 'Gives the wrong chapter.', 'In which chapter is the Bill of Rights?', 'Chapter 1', 'Chapter 4', 'The Bill of Rights is in Chapter 4.'),
  m('BILL_OF_RIGHTS', 'BR_RIGHT', 'Names a duty as a right.', 'Which is a right in the Bill of Rights?', 'The right to cheat', 'The right to life', 'The right to life is in the Bill of Rights.'),
  m('BILL_OF_RIGHTS', 'BR_SPECIAL', 'Names a non-special group.', 'Which is a special group protected by the Constitution?', 'Only adults with jobs', 'Persons with disabilities', 'Persons with disabilities are protected.'),
  m('GLOBAL_CULTURE', 'GC_ELEMENT', 'Names a non-element.', 'Which is an element of culture?', 'The price of petrol', 'Language and music', 'Language and music are elements of culture.'),
  m('GLOBAL_CULTURE', 'GC_KISWAHILI', 'Says Kiswahili is not recognised.', 'Which Kenyan language has global recognition?', 'None has any', 'Kiswahili', 'Kiswahili is recognised in the world.'),
  m('GLOBAL_CULTURE', 'GC_HUMANITY', 'Thinks cultures should compete.', 'What promotes a common humanity?', 'Mocking other cultures', 'Respect and dialogue', 'Respect and dialogue promote common humanity.'),
];
