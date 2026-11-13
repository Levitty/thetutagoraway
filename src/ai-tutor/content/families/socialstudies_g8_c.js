// ============================================================================
// GRADE 8 SOCIAL STUDIES, PART C: climate and vegetation of Africa, historical sites, the Constitution of Kenya, human rights and
// citizenship (6 skills). Written offline from the KICD design. Every wrong answer names the library misconception it reveals.
// Options are about the same length so the right answer is never the longest. History and facts about sites and laws are told as
// commonly taught and stay "to confirm by a teacher". All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g8_lib.js';

const WC = 'NATURA.WEATHER_AND_CLIMATE.', VG = 'NATURA.VEGETATION_IN_AFRICA.', HS = 'NATURA.HISTORICAL_SITES_AND_MON.', CN = 'POLITI.THE_CONSTITUTION_OF_KENY.', HR = 'POLITI.HUMAN_RIGHTS.', CZ = 'POLITI.CITIZENSHIP.';

export const FAMILIES = [
  // ---------------------------------------------------------------- CLIMATE_AFRICA
  fam('wc.cl.factors', `${WC}CLIMATE_AFRICA`, 'direct', 1, choose([
    C('G8_CL_LAT', 'Which factors affect climate?', 'Latitude, altitude, distance from the sea, currents and winds', ['Only latitude', 'Only the colour of the soil', 'Only the number of people'], 'Many factors affect climate.'),
    C('G8_CL_ALT', 'What happens to temperature as you climb a mountain?', 'It falls', ['It rises', 'It stays the same', 'It doubles'], 'Temperature falls about 6.5 degrees Celsius for every 1000 metres.'),
    C('G8_CL_ALT', 'Why is Nairobi cooler than Mombasa although both are near the equator?', 'Nairobi is much higher above sea level', ['Nairobi is nearer the sea', 'Nairobi has no sun', 'Nairobi is further south than Cape Town'], 'Altitude makes Nairobi cooler.'),
    C('G8_CL_LAT', 'Which place is usually hottest?', 'A place on the equator at low height', ['A place far from the equator', 'A high mountain top', 'A place with snow'], 'Places near the equator at low height are hot.'),
    C('G8_CL_LAT', 'How does the sea affect the coast?', 'It makes the climate milder and wetter', ['It makes the climate colder than inland', 'It makes the climate dry like a desert', 'It has no effect'], 'The sea keeps coasts milder and brings moisture.'),
  ], { h: ['Latitude, altitude, sea, currents and winds all matter.', 'Higher places are cooler.'], s1: 'Think about height and nearness to the sea.' })),
  fam('wc.cl.regions', `${WC}CLIMATE_AFRICA`, 'word', 2, choose([
    C('G8_CL_REGION', 'Which climate has hot, wet weather all year?', 'Equatorial', ['Desert', 'Mediterranean', 'Mountain'], 'The equatorial climate is hot and wet all year.'),
    C('G8_CL_REGION', 'Which climate has rain in winter and a hot, dry summer?', 'Mediterranean', ['Equatorial', 'Desert', 'Savanna'], 'The Mediterranean climate has wet winters and dry summers.'),
    C('G8_CL_REGION', 'Which climate has a wet season and a dry season?', 'Tropical savanna', ['Equatorial', 'Desert', 'Mountain'], 'Tropical savanna has wet and dry seasons.'),
    C('G8_CL_REGION', 'The Sahara has what kind of climate?', 'Hot desert with very little rain', ['Wet equatorial', 'Cool mountain', 'Mediterranean'], 'The Sahara is a hot desert.'),
    C('G8_CL_REGION', 'The Congo basin has what kind of climate?', 'Equatorial', ['Desert', 'Mediterranean', 'Tropical savanna'], 'The Congo basin lies on the equator and is hot and wet.'),
  ], { h: ['Match the region to its rain and heat.', 'Equatorial is hot and wet; desert is hot and dry.'], s1: 'Think about rain through the year.' })),
  fam('wc.cl.spot', `${WC}CLIMATE_AFRICA`, 'spot', 3, spot([
    S('Baraka explains climate.', ['Latitude affects climate.', '!Only latitude affects climate.', 'Altitude affects climate.'], 'Many factors affect climate.', 'G8_CL_LAT'),
    S('Wanjiru explains height.', ['Higher places are cooler.', '!Temperature rises as you climb.', 'Mount Kenya has snow.'], 'Temperature falls as you climb.', 'G8_CL_ALT'),
    S('Kamau explains regions.', ['The Sahara is a desert.', '!The Sahara has an equatorial climate.', 'The Congo basin is wet.'], 'The Sahara is a desert.', 'G8_CL_REGION'),
    S('Mwende explains the sea.', ['The sea makes coasts milder.', 'The sea brings moisture.', '!The sea has no effect on climate.'], 'The sea affects the coast.', 'G8_CL_LAT'),
    S('Nekesa explains regions again.', ['Savanna has wet and dry seasons.', '!Savanna is hot and wet all year.', 'The equatorial region is wet all year.'], 'Savanna has wet and dry seasons.', 'G8_CL_REGION'),
  ], { h: ['Check each step: factors, height, regions.', 'Temperature falls as you climb.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- VEGETATION
  fam('vg.vg.regions', `${VG}VEGETATION`, 'direct', 1, choose([
    C('G8_VG_REGION', 'Which vegetation grows in the Congo basin?', 'Tropical rainforest', ['Desert scrub', 'Mediterranean shrubs', 'Mountain moorland'], 'The Congo basin is hot and wet, with tropical rainforest.'),
    C('G8_VG_REGION', 'Which vegetation covers much of East Africa\'s plains?', 'Savanna: grass with scattered trees', ['Dense rainforest with tall trees', 'Desert sand with no plants at all', 'Snow covering the ground all year'], 'Savanna has grass and scattered trees.'),
    C('G8_VG_FACTOR', 'Which factor affects vegetation?', 'Rainfall', ['The colour of the sky', 'The name of the country', 'The number of schools'], 'Rainfall, temperature, altitude and soil affect vegetation.'),
    C('G8_VG_REGION', 'Which vegetation is found in the Sahara?', 'Few plants that survive with little water', ['Thick rainforest', 'Tall evergreen trees', 'Wet swamp'], 'Few plants survive in the desert.'),
    C('G8_VG_FACTOR', 'Why do the slopes of Mount Kenya have zones of different vegetation?', 'Temperature and rainfall change with height', ['The mountain is painted', 'The soil is the same everywhere', 'It has no rain'], 'Vegetation changes in zones with height.'),
  ], { h: ['Match vegetation to rain and heat.', 'Rainfall, temperature, altitude and soil matter.'], s1: 'Think about what plants need.' })),
  fam('vg.vg.conserve', `${VG}VEGETATION`, 'why', 2, choose([
    C('G8_VG_CONSERVE', 'Which method conserves vegetation?', 'Planting trees and protecting forests', ['Burning bushes to clear land', 'Cutting all the trees', 'Overgrazing the land'], 'Planting trees and protecting forests conserve vegetation.'),
    C('G8_VG_CONSERVE', 'Achieng\'s school plants trees on bare land. What is this?', 'Afforestation', ['Deforestation', 'Overgrazing', 'Mining'], 'Planting trees is afforestation.'),
    C('G8_VG_CONSERVE', 'Why should grazing be controlled?', 'So grass can grow back and the soil stays covered', ['So animals go hungry in the dry season', 'So there is more bare land to see', 'So soil is washed away by the rain'], 'Controlled grazing protects the grass.'),
    C('G8_VG_FACTOR', 'Why does the desert have few plants?', 'There is very little rain', ['There is too much rain', 'There is too much snow', 'There are too many animals'], 'Little rain means few plants.'),
    C('G8_VG_CONSERVE', 'Which is a way a farmer can conserve vegetation?', 'Growing trees on the farm (agroforestry)', ['Burning the whole farm each year', 'Clearing the river bank of all plants', 'Cutting the last trees on the hill'], 'Agroforestry keeps trees on the farm.'),
  ], { h: ['Conserve means protect and plant, not clear and burn.', 'Rain decides how many plants grow.'], s1: 'Think about what protects the plants.' })),
  fam('vg.vg.spot', `${VG}VEGETATION`, 'spot', 3, spot([
    S('Baraka explains vegetation.', ['Rainfall affects vegetation.', '!The Congo basin has desert scrub.', 'Temperature affects vegetation.'], 'The Congo basin has tropical rainforest.', 'G8_VG_REGION'),
    S('Wanjiru explains the factors.', ['Altitude affects vegetation.', '!The colour of the sky affects vegetation.', 'Soil affects vegetation.'], 'Rainfall, temperature, altitude and soil matter.', 'G8_VG_FACTOR'),
    S('Kamau explains conservation.', ['Plant trees.', 'Protect forests.', '!Burn bushes to clear land.'], 'Burning destroys vegetation.', 'G8_VG_CONSERVE'),
    S('Mwende explains the savanna.', ['The savanna has grass.', '!The savanna is thick rainforest.', 'It has scattered trees.'], 'The savanna has grass and scattered trees.', 'G8_VG_REGION'),
    S('Nekesa explains grazing.', ['Controlled grazing protects grass.', '!Overgrazing protects grass.', 'Cover protects the soil.'], 'Overgrazing destroys the grass.', 'G8_VG_CONSERVE'),
  ], { h: ['Check each step: regions, factors, conservation.', 'Planting and protecting conserve vegetation.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SITES
  fam('hs.st.where', `${HS}SITES`, 'direct', 1, choose([
    C('G8_HS_PLACE', 'In which country is Great Zimbabwe?', 'Zimbabwe', ['Egypt', 'Ethiopia', 'Kenya'], 'Great Zimbabwe is in Zimbabwe.'),
    C('G8_HS_PLACE', 'In which country are the Pyramids of Giza?', 'Egypt', ['Zimbabwe', 'Mali', 'Tanzania'], 'The Pyramids of Giza are in Egypt.'),
    C('G8_HS_PLACE', 'In which country are the rock-hewn churches of Lalibela?', 'Ethiopia', ['Egypt', 'Kenya', 'Mali'], 'Lalibela is in Ethiopia.'),
    C('G8_HS_PLACE', 'In which Kenyan town is Fort Jesus?', 'Mombasa', ['Kisumu', 'Nakuru', 'Eldoret'], 'Fort Jesus is in Mombasa.'),
    C('G8_HS_PLACE', 'In which country is Timbuktu?', 'Mali', ['Tanzania', 'Egypt', 'Zimbabwe'], 'Timbuktu is in Mali.'),
  ], { h: ['Find the sites on a map of Africa.', 'Giza is in Egypt; Lalibela is in Ethiopia.'], s1: 'Picture the map of Africa.' })),
  fam('hs.st.why', `${HS}SITES`, 'why', 2, choose([
    C('G8_HS_USELESS', 'Why are historical sites important?', 'They show our history and bring visitors', ['They have no use for us today', 'They are only old stones and dust', 'They should be sold to the highest bidder'], 'Sites show a people\'s history and attract visitors.'),
    C('G8_HS_CONSERVE', 'How should visitors behave at a historical site?', 'Follow the guide and leave things as they are', ['Climb the walls and write names', 'Take stones home', 'Make fires inside'], 'Visitors follow the rules and leave the site as they found it.'),
    C('G8_HS_CONSERVE', 'Which helps to conserve a site?', 'Laws, guides and repair work', ['Letting everyone climb it', 'Using it as a rubbish dump', 'Digging at night'], 'Laws, guides and repairs protect a site.'),
    C('G8_HS_USELESS', 'Which is a benefit of a historical site for a community?', 'Visitors bring income and jobs', ['It makes the town poorer', 'It stops all learning', 'It has no benefit'], 'Visitors bring income and jobs.'),
    C('G8_HS_CONSERVE', 'Otieno finds names scratched on an old wall. What should he do?', 'Tell the guide and not add his own', ['Add his name to the wall too', 'Scratch more names beside the others', 'Ignore it and walk on past'], 'Writing on walls damages the site.'),
  ], { h: ['Sites show history and bring visitors.', 'We protect them and leave them as found.'], s1: 'Think about what we lose if a site is damaged.' })),
  fam('hs.st.spot', `${HS}SITES`, 'spot', 3, spot([
    S('Baraka places the sites.', ['The Pyramids are in Egypt.', '!Great Zimbabwe is in Egypt.', 'Lalibela is in Ethiopia.'], 'Great Zimbabwe is in Zimbabwe.', 'G8_HS_PLACE'),
    S('Wanjiru explains the importance.', ['Sites show history.', '!Sites have no use today.', 'Sites bring visitors.'], 'Sites show history and bring visitors.', 'G8_HS_USELESS'),
    S('Kamau explains conservation.', ['Follow the guide.', 'Leave things as they are.', '!Write your name on the wall.'], 'Writing on walls damages a site.', 'G8_HS_CONSERVE'),
    S('Mwende places Fort Jesus.', ['Fort Jesus is in Kenya.', '!Fort Jesus is in Kisumu.', 'It stands on the coast.'], 'Fort Jesus is in Mombasa.', 'G8_HS_PLACE'),
    S('Nekesa explains benefits.', ['Visitors bring income.', '!Visitors always damage sites.', 'Guides help protect sites.'], 'Visitors who follow the rules do not damage sites.', 'G8_HS_CONSERVE'),
  ], { h: ['Check each step: the place, the importance, the care.', 'Fort Jesus is in Mombasa.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- CONSTITUTION
  fam('cn.co.arms', `${CN}CONSTITUTION`, 'direct', 1, choose([
    C('G8_CN_ARM', 'Which arm interprets the law and settles disputes?', 'The Judiciary', ['The Legislature', 'The Executive', 'The Police'], 'The Judiciary interprets the law and settles disputes.'),
    C('G8_CN_ARM', 'Which arm makes laws?', 'The Legislature', ['The Judiciary', 'The Executive', 'The Army'], 'The Legislature (Parliament) makes laws.'),
    C('G8_CN_ARM', 'Which arm carries out the laws?', 'The Executive', ['The Legislature', 'The Judiciary', 'The Senate only'], 'The Executive carries out the laws.'),
    C('G8_CN_CHAPTER', 'Which chapter is the Bill of Rights?', 'Chapter 4', ['Chapter 6', 'Chapter 1', 'Chapter 18'], 'The Bill of Rights is Chapter 4.'),
    C('G8_CN_CHAPTER', 'Which chapter deals with Leadership and Integrity?', 'Chapter 6', ['Chapter 4', 'Chapter 8', 'Chapter 12'], 'Leadership and Integrity is Chapter 6.'),
  ], { h: ['Legislature makes, Executive carries out, Judiciary interprets.', 'Bill of Rights is Chapter 4; Leadership and Integrity is Chapter 6.'], s1: 'Link each arm to one verb.' })),
  fam('cn.co.lead', `${CN}CONSTITUTION`, 'why', 2, choose([
    C('G8_CN_PRINCIPLE', 'Which is a principle of leadership and integrity?', 'Selection on merit', ['Selection on tribe', 'Selection on wealth', 'Selection by bribe'], 'Leaders are chosen on merit.'),
    C('G8_CN_PRINCIPLE', 'What does selfless service mean for a leader?', 'Serving the people before oneself', ['Serving oneself first', 'Serving one\'s friends only', 'Taking gifts'], 'Selfless service puts the people first.'),
    C('G8_CN_ARM', 'Parliament passes a new law. Which arm has acted?', 'The Legislature', ['The Judiciary', 'The Executive', 'The Police'], 'Parliament is the Legislature.'),
    C('G8_CN_PRINCIPLE', 'A school prefect returns found money to the teacher. Which principle does she show?', 'Integrity', ['Greed', 'Favouritism', 'Cheating'], 'Honesty with money shows integrity.'),
    C('G8_CN_CHAPTER', 'When was the Constitution of Kenya promulgated?', 'On 27 August 2010', ['On 12 December 1963', 'On 1 June 1980', 'On 5 May 2002'], 'The present Constitution was promulgated on 27 August 2010.'),
  ], { h: ['Leaders are chosen on merit and serve with integrity.', 'The Constitution was promulgated on 27 August 2010.'], s1: 'Think about what makes a fair leader.' })),
  fam('cn.co.spot', `${CN}CONSTITUTION`, 'spot', 3, spot([
    S('Baraka explains the arms.', ['The Legislature makes laws.', '!The Legislature interprets laws.', 'The Judiciary interprets laws.'], 'The Legislature makes laws. The Judiciary interprets them.', 'G8_CN_ARM'),
    S('Wanjiru explains the chapters.', ['The Bill of Rights is Chapter 4.', '!The Bill of Rights is Chapter 6.', 'Leadership and Integrity is Chapter 6.'], 'The Bill of Rights is Chapter 4.', 'G8_CN_CHAPTER'),
    S('Kamau explains leadership.', ['Leaders serve selflessly.', '!Leaders are chosen on tribe.', 'Leaders are accountable.'], 'Leaders are chosen on merit.', 'G8_CN_PRINCIPLE'),
    S('Mwende explains the Executive.', ['The Executive carries out laws.', '!The Executive makes laws.', 'The President is part of the Executive.'], 'The Legislature makes laws.', 'G8_CN_ARM'),
    S('Nekesa explains integrity.', ['Integrity means honesty.', 'Integrity builds trust.', '!Integrity means taking gifts.'], 'Integrity means being honest and not taking bribes.', 'G8_CN_PRINCIPLE'),
  ], { h: ['Check each step: the arms, the chapters, the principles.', 'Chapter 4 is the Bill of Rights.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- HUMAN_RIGHTS
  fam('hr.hr.child', `${HR}HUMAN_RIGHTS`, 'direct', 1, choose([
    C('G8_HR8_CHILD', 'Do children have rights in Kenya?', 'Yes, such as education, health care and protection', ['No, only adults have rights in Kenya', 'Only some children have rights, not all', 'Only children who live in the big towns'], 'Children have rights, including free basic education, health care and protection.'),
    C('G8_HR8_CHILD', 'Which is a right of a child in Kenya?', 'Free and compulsory basic education', ['The right to vote from the age of ten', 'The right to drive a car to school each day', 'The right to marry while still at school'], 'Basic education is a right of every child.'),
    C('G8_HR8_CHILD', 'Which is a right of every child?', 'Protection from abuse and neglect', ['Freedom to work all day', 'Freedom from all school rules', 'Freedom to leave home'], 'Children have the right to be protected.'),
    C('G8_HR8_DUTY', 'What comes with a right?', 'A responsibility to respect the rights of others', ['Nothing, rights are free of duties', 'A reward from the government', 'A fine for those who use it'], 'Every right comes with a responsibility.'),
    C('G8_HR8_CHILD', 'Which right is named in Article 53 of the Constitution?', 'A name and nationality from birth', ['A free car from the state', 'A pocket money allowance each week', 'A holiday every month abroad'], 'Every child has the right to a name and nationality.'),
  ], { h: ['Children have rights to education, health, shelter and protection.', 'Rights come with responsibilities.'], s1: 'Think about what every child needs.' })),
  fam('hr.hr.protect', `${HR}HUMAN_RIGHTS`, 'why', 2, choose([
    C('G8_HR8_REPORT', 'A child is being abused. What should a person do?', 'Tell a trusted adult or call Childline 116', ['Keep quiet to avoid getting into trouble', 'Tell no one, it is a family matter', 'Laugh about it with friends'], 'Report to a trusted adult, the chief, the police or Childline Kenya 116.'),
    C('G8_HR8_REPORT', 'Who protects children against abuse?', 'Parents, teachers, the chief and the police', ['Only the children themselves', 'No one', 'Only shop owners'], 'Many people share the duty to protect children.'),
    C('G8_HR8_CHILD', 'A boy of ten is made to work all day instead of going to school. Which right is broken?', 'The right to education and protection from child labour', ['The right to drive a car to school each day', 'The right to vote in an election at school age', 'The right to a long holiday abroad every year'], 'Child labour breaks the right to education.'),
    C('G8_HR8_DUTY', 'Wanjiru uses her right to speak to insult others. What is wrong?', 'She forgets her responsibility to respect others', ['Nothing, because rights have no limits', 'Speech is not a right at all', 'She must stay silent in future'], 'Rights come with responsibilities.'),
    C('G8_HR8_REPORT', 'What number can a child call in Kenya to get help?', '116 (Childline Kenya)', ['999 only for sweets', '000', '555'], 'Childline Kenya is 116.'),
  ], { h: ['A trusted adult, the chief, the police and Childline 116 protect children.', 'Rights come with responsibilities.'], s1: 'Think about who can help and what a right needs.' })),
  fam('hr.hr.spot', `${HR}HUMAN_RIGHTS`, 'spot', 3, spot([
    S('Baraka explains child rights.', ['Children have a right to education.', '!Only adults have rights.', 'Children have a right to protection.'], 'Children have rights too.', 'G8_HR8_CHILD'),
    S('Wanjiru explains duties.', ['Every right has a responsibility.', '!Rights have no duties.', 'We respect the rights of others.'], 'Every right comes with a responsibility.', 'G8_HR8_DUTY'),
    S('Kamau explains reporting.', ['Tell a trusted adult.', '!Keep quiet about abuse.', 'Call Childline 116.'], 'We must report abuse.', 'G8_HR8_REPORT'),
    S('Mwende explains protection.', ['The chief can help.', 'The police can help.', '!Nobody can help.'], 'Many people can help a child.', 'G8_HR8_REPORT'),
    S('Nekesa explains rights.', ['A name is a right.', 'Basic education is a right.', '!A free car is a right.'], 'A free car is not a right.', 'G8_HR8_CHILD'),
  ], { h: ['Check each step: rights, duties, who to tell.', 'Childline Kenya is 116.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- CITIZENSHIP
  fam('cz.cz.qualities', `${CZ}CITIZENSHIP`, 'direct', 1, choose([
    C('G8_CZ8_LOCAL', 'Which is a quality of a global citizen?', 'Respecting other cultures and caring for the environment', ['Caring only about my own country', 'Ignoring other people', 'Wasting resources'], 'A global citizen respects others and cares for the shared world.'),
    C('G8_CZ8_LOCAL', 'Which action shows a global citizen?', 'Joining a clean-up and helping those in need', ['Dropping litter', 'Ignoring a hungry neighbour', 'Mocking other cultures'], 'A global citizen takes action for the common good.'),
    C('G8_CZ8_LOCAL', 'Who won the Nobel Peace Prize in 2004 for planting trees and the Green Belt Movement?', 'Wangari Maathai', ['Jomo Kenyatta', 'Julius Nyerere', 'Nelson Mandela'], 'Wangari Maathai won the Nobel Peace Prize in 2004.'),
    C('G8_CZ8_EAC', 'Which country is a member of the East African Community?', 'Rwanda', ['Egypt', 'Nigeria', 'Ghana'], 'Rwanda is a member of the East African Community.'),
    C('G8_CZ8_EAC', 'Which country is a member of the East African Community?', 'Tanzania', ['Morocco', 'Senegal', 'Algeria'], 'Tanzania is a member of the East African Community.'),
  ], { h: ['A global citizen respects others and cares for the world.', 'The EAC includes Kenya, Uganda, Tanzania and Rwanda.'], s1: 'Think about care for others and the world.' })),
  fam('cz.cz.harmony', `${CZ}CITIZENSHIP`, 'why', 2, choose([
    C('G8_CZ8_HARMONY', 'Which helps citizens of East Africa live in harmony?', 'Respect and a shared language, Kiswahili', ['Looking down on other groups', 'Closing the borders to all', 'Mocking other accents'], 'Respect and a shared language help people live in harmony.'),
    C('G8_CZ8_HARMONY', 'How does trade help East African neighbours?', 'It brings people together for mutual benefit', ['It makes them enemies for ever', 'It stops all travel across the border', 'It ends friendships between the countries'], 'Trade builds links between neighbours.'),
    C('G8_CZ8_LOCAL', 'Otieno helps a refugee family find a school place. What is this?', 'Active participation and empathy', ['Mockery of those in need', 'Selfishness towards the refugees', 'Neglect of the family'], 'Helping others shows empathy and active citizenship.'),
    C('G8_CZ8_HARMONY', 'Which is a way to settle a dispute between two countries peacefully?', 'Talks and agreements', ['War', 'Insults', 'Closing all roads'], 'Peaceful talks settle disputes.'),
    C('G8_CZ8_EAC', 'What does the East African Community encourage among member states?', 'Cooperation in trade and movement', ['Closed borders', 'War', 'Separate languages only'], 'The EAC encourages cooperation.'),
  ], { h: ['Respect, shared language, trade and talks bring harmony.', 'A global citizen helps others.'], s1: 'Think about what builds peace between neighbours.' })),
  fam('cz.cz.spot', `${CZ}CITIZENSHIP`, 'spot', 3, spot([
    S('Baraka explains a global citizen.', ['A global citizen respects others.', '!A global citizen cares only about his own country.', 'A global citizen cares for the environment.'], 'A global citizen cares for the shared world.', 'G8_CZ8_LOCAL'),
    S('Wanjiru names EAC members.', ['Kenya is a member.', 'Tanzania is a member.', '!Egypt is a member.'], 'Egypt is not a member of the East African Community.', 'G8_CZ8_EAC'),
    S('Kamau explains harmony.', ['Respect brings harmony.', '!Looking down on others brings harmony.', 'Trade helps neighbours.'], 'Looking down on others breaks harmony.', 'G8_CZ8_HARMONY'),
    S('Mwende explains Wangari Maathai.', ['She planted trees.', 'She started the Green Belt Movement.', '!She won the Nobel Prize in 1994.'], 'She won the Nobel Peace Prize in 2004.', 'G8_CZ8_LOCAL'),
    S('Nekesa explains cooperation.', ['Talks settle disputes.', '!War settles disputes best.', 'Trade links countries.'], 'Peaceful talks settle disputes.', 'G8_CZ8_HARMONY'),
  ], { h: ['Check each step: qualities, members, harmony.', 'Wangari Maathai won in 2004.'], s1: 'Find the step that is not true.' })),
];
