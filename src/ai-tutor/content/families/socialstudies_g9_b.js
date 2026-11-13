// ============================================================================
// SOCIAL STUDIES GRADE 9, B (9 skills): topographical maps, internal land-forming processes, multi-purpose river projects, environmental
// degradation, world heritage sites, making Kenya's Constitution, civic engagement, the Bill of Rights, cultural globalisation. Written offline.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a Social Studies teacher signs them off.
// ============================================================================
import { S } from './socialstudies_g9_lib.js';
const TM = 'NATURA.TOPOGRAPHICAL_MAPS.', LF = 'NATURA.INTERNAL_LAND_FORMING_PR.', RP = 'NATURA.MULTI_PURPOSE_RIVER_PROJ.', EM = 'NATURA.MANAGEMENT_AND_CONSERVAT.', WH = 'NATURA.WORLD_HERITAGE_SITES_IN_.';
const CK = 'POLITI.THE_CONSTITUTION_OF_KENY.', CE = 'POLITI.CIVIC_ENGAGEMENT_IN_GOVE.', BR = 'POLITI.KENYA_S_BILL_OF_RIGHTS.', CG = 'POLITI.CULTURAL_GLOBALISATION.';

export const FAMILIES = [
  ...S('tm', TM, 'TOPO_MAPS', ['TM_CONTOUR', 'TM_SECTION', 'TM_HUMAN'], ['Contour lines show the height of the land.', 'A cross-section shows the shape of the land along a line.'], [
    ['What do contour lines show?', 'The height of the land', 'The roads of a town', 'The names of the farms', 'The rainfall of a place'],
    ['What does a cross-section show?', 'The shape of the land along a line', 'The map\'s title and date', 'The names of all the towns', 'The colours of the soil'],
    ['Which is a human feature shown on a map?', 'A railway', 'A river', 'A hill', 'A lake'],
    ['Which is a human feature shown on a map?', 'A settlement', 'A valley', 'A waterfall', 'A swamp'],
    ['Which is a physical feature shown on a map?', 'A river', 'A road', 'A school', 'A market'],
  ], [
    ['Lines close together on a topographical map show what kind of slope?', 'A steep slope', 'A gentle slope', 'Flat land', 'A lake'],
    ['A learner draws the shape of the land along a line on a map. What is this?', 'A cross-section', 'A plan', 'A title', 'A scale'],
    ['A map shows a road, a railway and a market. What do these show?', 'Human activities', 'Physical features', 'Weather', 'Rock types'],
    ['A learner makes a map twice as big as the original. What is this called?', 'Enlargement', 'Reduction', 'A cross-section', 'A contour'],
    ['A learner copies a map to half its size. What is this called?', 'Reduction', 'Enlargement', 'A cross-section', 'A contour'],
  ], [
    ['Which step is the mistake?', 'Step 1: Contours join places of equal height.', 'Step 2: They show relief.', 'Step 3: So contour lines show roads.', 'Contour lines show height.', 2],
    ['Which step is the mistake?', 'Step 1: A cross-section is drawn along a line.', 'Step 2: It shows the shape of the land.', 'Step 3: So it shows the map\'s title.', 'It shows the shape of the land.', 2],
    ['Which step is the mistake?', 'Step 1: People build railways.', 'Step 2: Railways are human features.', 'Step 3: So a railway is a physical feature.', 'A railway is a human feature.', 2],
    ['Which step is the mistake?', 'Step 1: Close contours show steep land.', 'Step 2: Wide contours show gentle land.', 'Step 3: So close contours show flat land.', 'Close contours show a steep slope.', 2],
    ['Which step is the mistake?', 'Step 1: To enlarge a map we change its scale.', 'Step 2: The new map is bigger.', 'Step 3: So enlarging makes it smaller.', 'Enlarging makes it bigger.', 2],
  ], ['a', 'c']),
  ...S('lf', LF, 'LAND_FORMING', ['LF_TENSION', 'LF_RIFT', 'LF_EFFECT'], ['Tensional forces pull apart; compressional forces push together.', 'Faulting makes rift valleys and brings earthquakes.'], [
    ['Which force pulls the crust apart?', 'Tensional force', 'Compressional force', 'Wind force', 'Water force'],
    ['Which feature is made by faulting?', 'A rift valley', 'A delta', 'A sand dune', 'A sea cave'],
    ['Which can faulting bring?', 'Earthquakes and hot springs', 'Nothing at all', 'Only snow', 'Only fog'],
    ['Which force pushes the crust together?', 'Compressional force', 'Tensional force', 'Wind force', 'Water force'],
    ['Where does the Great Rift Valley run in Kenya?', 'From north to south across the country', 'Only along the coast', 'Only along the border', 'Nowhere in Kenya'],
  ], [
    ['A crack opens as two blocks of the crust move apart. Which force acts?', 'Tensional force', 'Compressional force', 'Wind force', 'Water force'],
    ['A block between two faults sinks and forms a long valley. What is it?', 'A rift valley', 'A delta', 'A sand dune', 'A lagoon'],
    ['A region near a fault has frequent earthquakes and hot springs. What causes this?', 'Faulting', 'Rainfall', 'Wind', 'Farming'],
    ['Crust is pushed together and folds. Which force acts?', 'Compressional force', 'Tensional force', 'Wind force', 'Water force'],
    ['Which lake in Kenya lies in the Great Rift Valley?', 'Lake Nakuru', 'Lake Victoria', 'The Indian Ocean', 'Lake Albert'],
  ], [
    ['Which step is the mistake?', 'Step 1: Forces move the crust.', 'Step 2: Tensional forces pull it apart.', 'Step 3: So tensional forces push it together.', 'Compressional forces push it together.', 2],
    ['Which step is the mistake?', 'Step 1: Faulting breaks the crust.', 'Step 2: Blocks move up or down.', 'Step 3: So faulting makes deltas.', 'Faulting makes rift valleys.', 2],
    ['Which step is the mistake?', 'Step 1: Faulting moves large blocks.', 'Step 2: It can cause earthquakes.', 'Step 3: So faulting has no effects.', 'Faulting has effects such as earthquakes.', 2],
    ['Which step is the mistake?', 'Step 1: Compressional forces squeeze rock.', 'Step 2: Rocks fold or fault.', 'Step 3: So they pull rock apart.', 'They push rock together.', 2],
    ['Which step is the mistake?', 'Step 1: The Great Rift Valley crosses Kenya.', 'Step 2: It formed by faulting.', 'Step 3: So it formed by river deposits.', 'It formed by faulting.', 2],
  ], ['d', 'c', 'a']),
  ...S('rv', RP, 'RIVER_PROJECTS', ['RV_RIVER', 'RV_USE', 'RV_CHALLENGE'], ['Aswan High Dam is on the Nile; Kariba is on the Zambezi.', 'Dams give electricity, water and flood control.'], [
    ['On which river is the Aswan High Dam?', 'The Nile', 'The Zambezi', 'The Congo', 'The Niger'],
    ['Which is a use of a multi-purpose dam?', 'Producing electricity', 'Causing drought', 'Making the river dirty', 'Drying the farms'],
    ['Which is a challenge of a big dam?', 'Displacing people', 'Cheap power for ever', 'More rainfall for ever', 'No cost at all'],
    ['On which river is the Kariba Dam?', 'The Zambezi', 'The Nile', 'The Tana', 'The Volta'],
    ['On which river are the Seven Forks dams in Kenya?', 'The Tana', 'The Nile', 'The Zambezi', 'The Congo'],
  ], [
    ['A dam on the Nile in Egypt gives electricity and water for irrigation. Which dam is it?', 'The Aswan High Dam', 'The Kariba Dam', 'The Akosombo Dam', 'The Seven Forks'],
    ['A dam controls floods and also waters farms. What do we call such a project?', 'A multi-purpose project', 'A one-use project', 'A harmful project', 'A useless project'],
    ['Villages are flooded and families must move when a dam is built. What is this?', 'A challenge of dams', 'A benefit of dams', 'A kind of irrigation', 'A kind of fishing'],
    ['Fishing on a new dam lake gives families food and income. What is this?', 'An economic benefit', 'A challenge', 'A cost', 'A disaster'],
    ['Soil washed down the river fills the dam over time. What is this problem?', 'Silting', 'Irrigation', 'Fishing', 'Tourism'],
  ], [
    ['Which step is the mistake?', 'Step 1: The Nile flows through Egypt.', 'Step 2: A big dam is built on it.', 'Step 3: So the Aswan High Dam is on the Zambezi.', 'The Aswan High Dam is on the Nile.', 2],
    ['Which step is the mistake?', 'Step 1: A dam holds water.', 'Step 2: It can drive turbines.', 'Step 3: So a dam causes drought and no electricity.', 'A dam gives electricity.', 2],
    ['Which step is the mistake?', 'Step 1: Dams are costly.', 'Step 2: People may lose their homes.', 'Step 3: So dams have no challenges.', 'Dams have challenges.', 2],
    ['Which step is the mistake?', 'Step 1: Kariba is a big dam.', 'Step 2: It is on a great river.', 'Step 3: So Kariba is on the Nile.', 'Kariba is on the Zambezi.', 2],
    ['Which step is the mistake?', 'Step 1: Dams store water.', 'Step 2: Stored water is used for irrigation.', 'Step 3: So dams cannot help farming.', 'Dams help farming.', 2],
  ], ['d', 'c', 'a']),
  ...S('ed', EM, 'ENV_DEGRADATION', ['ED_CAUSE', 'ED_EFFECT', 'ED_ANSWER'], ['Deforestation and pollution degrade the environment.', 'Planting trees and terracing conserve it.'], [
    ['Which causes environmental degradation?', 'Deforestation', 'Planting trees', 'Terracing the land', 'Recycling waste'],
    ['Which is an effect of environmental degradation?', 'Soil erosion', 'Better soil', 'More clean water', 'More wildlife'],
    ['Which helps to conserve the environment?', 'Terracing and afforestation', 'Burning forests', 'Dumping waste in rivers', 'Overgrazing the land'],
    ['Which is a cause of land degradation?', 'Overgrazing', 'Planting grass', 'Mulching', 'Contour farming'],
    ['Which is a way of managing waste?', 'Recycling', 'Burning plastic', 'Dumping in rivers', 'Burying in the garden'],
  ], [
    ['A hillside has lost its trees and soil is washed away. What caused the problem?', 'Deforestation', 'Afforestation', 'Terracing', 'Recycling'],
    ['A river is brown with soil after heavy rain on bare land. What is this an effect of?', 'Soil erosion', 'Good farming', 'Recycling', 'Afforestation'],
    ['A village plants trees and builds terraces. What is this?', 'Conserving the environment', 'Degrading the environment', 'Wasting land', 'Overgrazing'],
    ['Too many cattle graze on a small field until it is bare. What is this called?', 'Overgrazing', 'Afforestation', 'Terracing', 'Recycling'],
    ['A school sorts plastic and sends it for recycling. What does this do?', 'Reduces pollution', 'Causes pollution', 'Wastes plastic', 'Harms the soil'],
  ], [
    ['Which step is the mistake?', 'Step 1: Trees hold soil.', 'Step 2: Cutting them exposes soil.', 'Step 3: So deforestation protects the environment.', 'Deforestation degrades the environment.', 2],
    ['Which step is the mistake?', 'Step 1: Bare land is washed by rain.', 'Step 2: Soil is carried away.', 'Step 3: So erosion improves the soil.', 'Erosion harms the soil.', 2],
    ['Which step is the mistake?', 'Step 1: Terraces slow water.', 'Step 2: Trees hold soil.', 'Step 3: So burning forests conserves land.', 'Planting trees and terracing conserve land.', 2],
    ['Which step is the mistake?', 'Step 1: Grass protects the soil.', 'Step 2: Too many animals eat all the grass.', 'Step 3: So overgrazing protects the land.', 'Overgrazing degrades land.', 2],
    ['Which step is the mistake?', 'Step 1: Plastic does not rot.', 'Step 2: Recycling reuses it.', 'Step 3: So burning plastic is the best way.', 'Recycling is better.', 2],
  ], ['b', 'c', 'a']),
  ...S('wh', WH, 'HERITAGE_SITES', ['HS_LAMU', 'HS_PYRAMIDS', 'HS_WHY'], ['Lamu Old Town and Fort Jesus are in Kenya; the Pyramids of Giza are in Egypt.', 'Heritage sites keep culture and history.'], [
    ['In which country is Lamu Old Town?', 'Kenya', 'Tanzania', 'Egypt', 'South Africa'],
    ['In which country are the Pyramids of Giza?', 'Egypt', 'Kenya', 'Ghana', 'Zimbabwe'],
    ['Why are heritage sites kept?', 'For culture, history and tourism', 'For no reason at all', 'To be forgotten', 'To be destroyed'],
    ['In which country is the Serengeti?', 'Tanzania', 'Egypt', 'Mali', 'Zimbabwe'],
    ['In which country is Great Zimbabwe?', 'Zimbabwe', 'Kenya', 'Egypt', 'Tanzania'],
  ], [
    ['Tourists walk the old streets of Lamu Old Town. Which country are they in?', 'Kenya', 'Tanzania', 'Egypt', 'Ghana'],
    ['Visitors admire the Great Pyramids. Which country are they in?', 'Egypt', 'Kenya', 'Ghana', 'Zimbabwe'],
    ['A guide says the fort teaches about the past. Why is it kept?', 'To preserve history and culture', 'To waste money', 'To block roads', 'To hide it'],
    ['Fort Jesus in Mombasa is a World Heritage site. In which country is it?', 'Kenya', 'Tanzania', 'Egypt', 'Zimbabwe'],
    ['A World Heritage site brings visitors who spend money. What does this show?', 'Heritage sites support tourism', 'Heritage sites have no value', 'Heritage sites cost nothing', 'Heritage sites are hidden'],
  ], [
    ['Which step is the mistake?', 'Step 1: Lamu Old Town is an old Swahili town.', 'Step 2: It is on the Kenyan coast.', 'Step 3: So it is in Tanzania.', 'It is in Kenya.', 2],
    ['Which step is the mistake?', 'Step 1: The Pyramids are very old.', 'Step 2: They are near Cairo.', 'Step 3: So they are in Kenya.', 'They are in Egypt.', 2],
    ['Which step is the mistake?', 'Step 1: Heritage sites keep the past.', 'Step 2: They draw tourists.', 'Step 3: So they have no value.', 'They keep culture and history.', 2],
    ['Which step is the mistake?', 'Step 1: The Serengeti has migrating animals.', 'Step 2: It is a World Heritage site.', 'Step 3: So it is in Egypt.', 'It is in Tanzania.', 2],
    ['Which step is the mistake?', 'Step 1: Heritage sites need care.', 'Step 2: Communities can protect them.', 'Step 3: So nobody should protect them.', 'We should conserve them.', 2],
  ], ['a', 'b']),
  ...S('ck', CK, 'CONSTITUTION_MAKING', ['CM_ORDER', 'CM_PARLIAMENT', 'CM_YEAR'], ['Views were collected first, and the Constitution was promulgated in 2010.', 'Parliament debates and approves the draft.'], [
    ['Which stage comes first in making the Constitution?', 'Collecting views', 'The referendum', 'The promulgation', 'The celebration'],
    ['What does Parliament do with the draft?', 'Debates and approves it', 'Ignores it', 'Burns it', 'Hides it'],
    ['In which year was Kenya\'s current Constitution promulgated?', '2010', '2002', '1963', '1992'],
    ['What is a referendum?', 'A vote by citizens on a proposal', 'A meeting of ministers', 'A court case', 'A school exam'],
    ['What is promulgation?', 'Officially putting a law into force', 'Drafting a law', 'Collecting views', 'Debating the draft'],
  ], [
    ['Teams travel the country to hear what citizens want in the new Constitution. What stage is this?', 'Collecting views', 'Referendum', 'Promulgation', 'Drafting'],
    ['MPs discuss the draft and vote on it. What are they doing?', 'Debating and approving it', 'Ignoring it', 'Hiding it', 'Burning it'],
    ['Citizens vote yes or no on the draft in 2010. What is this?', 'A referendum', 'A general election', 'A census', 'A school vote'],
    ['The President signs the new Constitution at a public ceremony in 2010. What is this?', 'Promulgation', 'Collecting views', 'A referendum', 'A debate'],
    ['Which role can a citizen play in making a Constitution?', 'Give views and vote in the referendum', 'Ignore all steps', 'Hide the draft', 'Burn the draft'],
  ], [
    ['Which step is the mistake?', 'Step 1: Citizens gave their views.', 'Step 2: A draft was written.', 'Step 3: So the referendum came before the views.', 'Views were collected first.', 2],
    ['Which step is the mistake?', 'Step 1: Parliament reviews the draft.', 'Step 2: It debates it.', 'Step 3: So Parliament ignores the draft.', 'Parliament debates and approves it.', 2],
    ['Which step is the mistake?', 'Step 1: The people voted in a referendum.', 'Step 2: The Constitution was then promulgated.', 'Step 3: So it was promulgated in 2002.', 'It was promulgated in 2010.', 2],
    ['Which step is the mistake?', 'Step 1: A referendum is a vote.', 'Step 2: Citizens say yes or no.', 'Step 3: So a referendum is a court case.', 'A referendum is a vote.', 2],
    ['Which step is the mistake?', 'Step 1: Citizens have a role.', 'Step 2: They give views.', 'Step 3: So citizens have no role.', 'Citizens give views and vote.', 2],
  ], ['b', 'c', 'a']),
  ...S('ce', CE, 'CIVIC_ENGAGEMENT', ['CE_ACT', 'CE_PARTY', 'CE_POST'], ['Voting and attending public forums are civic activities.', 'Governor, Senator and Member of the National Assembly are elected posts.'], [
    ['Which is a civic activity?', 'Voting', 'Skipping school', 'Breaking rules', 'Littering'],
    ['What do political parties do?', 'Field candidates in elections', 'Close schools', 'Set exams', 'Collect rubbish'],
    ['Which post is vied for in a general election?', 'Governor', 'Head teacher', 'Class monitor only', 'Shopkeeper'],
    ['Which is a civic duty?', 'Paying taxes', 'Dodging taxes', 'Cheating at exams', 'Ignoring the law'],
    ['Which post is vied for in a general election?', 'Member of the National Assembly', 'School prefect', 'Chief of a village market', 'Bus conductor'],
  ], [
    ['Wanjiru attends a public forum on a county budget. What is she doing?', 'Civic engagement', 'Skipping her duty', 'Breaking the law', 'Wasting time'],
    ['A group of people with shared goals fields candidates in an election. What is it?', 'A political party', 'A school club', 'A bank', 'A market'],
    ['A person stands to lead a county in a general election. Which post is this?', 'Governor', 'Head teacher', 'Prefect', 'Shopkeeper'],
    ['A citizen casts a vote on election day. What is this?', 'A civic activity', 'A crime', 'A punishment', 'A holiday'],
    ['A person stands to represent a county in the Senate. Which post is this?', 'Senator', 'Governor', 'Chief', 'Prefect'],
  ], [
    ['Which step is the mistake?', 'Step 1: Citizens take part in governance.', 'Step 2: Voting is one way.', 'Step 3: So skipping school is civic engagement.', 'Voting is civic engagement.', 2],
    ['Which step is the mistake?', 'Step 1: Parties have members and leaders.', 'Step 2: They field candidates.', 'Step 3: So parties close schools.', 'Parties field candidates.', 2],
    ['Which step is the mistake?', 'Step 1: A general election fills posts.', 'Step 2: Governor is one of them.', 'Step 3: So head teacher is one of them.', 'Governor is an elected post.', 2],
    ['Which step is the mistake?', 'Step 1: Taxes fund services.', 'Step 2: Citizens pay them.', 'Step 3: So dodging taxes is civic engagement.', 'Paying taxes is a civic duty.', 2],
    ['Which step is the mistake?', 'Step 1: Parties give citizens a voice.', 'Step 2: Citizens may join them.', 'Step 3: So citizens may not join a party.', 'Citizens may join a party.', 2],
  ], ['a', 'b', 'c']),
  ...S('br', BR, 'BILL_OF_RIGHTS', ['BR_CHAPTER', 'BR_RIGHT', 'BR_SPECIAL'], ['The Bill of Rights is in Chapter 4 of the 2010 Constitution.', 'Special groups include children, persons with disabilities and older persons.'], [
    ['In which chapter is the Bill of Rights?', 'Chapter 4', 'Chapter 1', 'Chapter 8', 'Chapter 12'],
    ['Which is a right in the Bill of Rights?', 'The right to life', 'The right to cheat', 'The right to steal', 'The right to harm others'],
    ['Which is a special group protected by the Constitution?', 'Persons with disabilities', 'Only adults with jobs', 'Only the rich', 'Only city people'],
    ['Which is a right of every child?', 'The right to education', 'The right to hit others', 'The right to cheat', 'The right to litter'],
    ['What does the right to equality mean?', 'Everyone is treated fairly', 'Only some are treated well', 'Rules apply only to the poor', 'Only adults count'],
  ], [
    ['A student looks for the rights of citizens in the Constitution. Where does she find them?', 'Chapter 4', 'Chapter 1', 'Chapter 8', 'Chapter 12'],
    ['A person is not killed without lawful reason. Which right protects this?', 'The right to life', 'The right to cheat', 'The right to steal', 'The right to trade'],
    ['A ramp is built so a learner in a wheelchair can enter school. Whom does this protect?', 'Persons with disabilities', 'Only adults with jobs', 'Only the rich', 'Only city people'],
    ['A girl is allowed to go to school like a boy. Which right is shown?', 'Equality and education', 'The right to cheat', 'The right to steal', 'The right to litter'],
    ['A learner stands up for a classmate who is bullied. Which value does she show?', 'Respect for human rights', 'Selfishness', 'Cruelty', 'Pride'],
  ], [
    ['Which step is the mistake?', 'Step 1: Rights are in the Constitution.', 'Step 2: The Bill of Rights is Chapter 4.', 'Step 3: So it is Chapter 1.', 'It is in Chapter 4.', 2],
    ['Which step is the mistake?', 'Step 1: Rights protect people.', 'Step 2: The right to life is one.', 'Step 3: So the right to cheat is one.', 'The right to life is a right.', 2],
    ['Which step is the mistake?', 'Step 1: Special groups may face barriers.', 'Step 2: The Constitution protects them.', 'Step 3: So persons with disabilities are not protected.', 'They are protected.', 2],
    ['Which step is the mistake?', 'Step 1: Children have rights.', 'Step 2: Education is one.', 'Step 3: So children have no rights.', 'Children have rights.', 2],
    ['Which step is the mistake?', 'Step 1: Equality means fair treatment.', 'Step 2: It applies to all.', 'Step 3: So it applies only to some.', 'It applies to all.', 2],
  ], ['a', 'b']),
  ...S('gc', CG, 'GLOBAL_CULTURE', ['GC_ELEMENT', 'GC_KISWAHILI', 'GC_HUMANITY'], ['Language, music, dance, dress, food and sport are elements of culture.', 'Respect and dialogue promote a common humanity.'], [
    ['Which is an element of culture?', 'Language and music', 'The price of petrol', 'The speed of a car', 'The height of a hill'],
    ['Which Kenyan language has global recognition?', 'Kiswahili', 'None has any', 'No language at all', 'Only English'],
    ['What promotes a common humanity?', 'Respect and dialogue', 'Mocking other cultures', 'Ignoring other people', 'Fighting about culture'],
    ['Which is a cultural practice?', 'A traditional dance', 'A traffic jam', 'A broken road', 'A power cut'],
    ['Which sport has made Kenya known across the world?', 'Long-distance running', 'Ice hockey', 'Skiing', 'Curling'],
  ], [
    ['A Kenyan dance group is admired abroad. What does this show?', 'Culture can gain global recognition', 'Culture has no value at all today', 'Culture should be kept hidden away', 'Culture is harmful to the young'],
    ['Visitors learn greetings in Kiswahili. What is this?', 'Sharing a language of the world', 'A waste of time for the visitors', 'A cultural conflict between countries', 'A mistake by the visitors'],
    ['Two groups with different customs listen and respect each other. What does this promote?', 'A common humanity', 'Conflict', 'Mistrust', 'Separation'],
    ['A community teaches children its songs so they are not lost. What is this?', 'Preserving culture', 'Losing culture', 'Selling culture', 'Hiding culture'],
    ['Ubuntu means "I am because we are". What value does it teach?', 'Common humanity and sharing', 'Selfishness above all other things', 'Pride in being better than others', 'Division between people of all kinds'],
  ], [
    ['Which step is the mistake?', 'Step 1: Culture has many elements.', 'Step 2: Language and music are two.', 'Step 3: So the price of petrol is an element.', 'Language and music are elements.', 2],
    ['Which step is the mistake?', 'Step 1: Kiswahili is spoken in many countries.', 'Step 2: It is recognised worldwide.', 'Step 3: So no Kenyan language is recognised.', 'Kiswahili is recognised.', 2],
    ['Which step is the mistake?', 'Step 1: People differ in culture.', 'Step 2: Respect builds common humanity.', 'Step 3: So mocking other cultures builds it.', 'Respect and dialogue build it.', 2],
    ['Which step is the mistake?', 'Step 1: Culture can be lost.', 'Step 2: Teaching the young preserves it.', 'Step 3: So we should hide it.', 'We should preserve it.', 2],
    ['Which step is the mistake?', 'Step 1: Sport is part of culture.', 'Step 2: Kenyan runners are famous.', 'Step 3: So sport is not part of culture.', 'Sport is part of culture.', 2],
  ], ['b', 'c', 'a']),
];
