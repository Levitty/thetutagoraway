// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART F: African diasporas and citizenship in an interconnected world (6 skills).
// Written offline from the KICD design through the curriculum map. The history of the diasporas and Pan-Africanism is told as
// commonly taught, respectfully, and stays "to confirm by a teacher". Options are about the same length so the right answer is
// never the longest. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const AD = 'POLITI.AFRICAN_DIASPORAS.', CZ = 'POLITI.CITIZENSHIP.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- AD_FACTORS
  fam('ad.fa.which', `${AD}AD_FACTORS`, 'direct', 1, choose([
    Q('What is a diaspora?', 'A people living away from their homeland', w('AD_DIASPORA_WORD', 'The original homeland of the whole people', 'A kind of government run by Africans', 'A kind of tax'), 'A diaspora lives outside the original homeland.'),
    Q('Which factor brought many Africans to the Americas?', 'The forced slave trade', w('AD_ALL_VOLUNTARY', 'Voluntary holidays', 'A wish to farm there', 'Invitations from the Americas'), 'Many were taken by force in the slave trades.'),
    Q('Which is a later reason Africans moved abroad?', 'To work or study', w('AD_ALL_VOLUNTARY', 'To be sold', 'To be crowned kings', 'To avoid all work'), 'Later, many moved for work, study and trade.'),
    Q('Which trade carried Africans to the Americas?', 'The transatlantic slave trade', w('AD_ALL_VOLUNTARY', 'The Indian Ocean trade routes', 'The Sahara trade', 'The coastal trade'), 'The transatlantic trade crossed the Atlantic.'),
    Q('Which trade carried Africans to Arabia and India?', 'The Indian Ocean slave trade', w('AD_ALL_VOLUNTARY', 'The transatlantic trade ships', 'The Nile trade', 'The railway trade'), 'The Indian Ocean trade went east.'),
  ], { h: ['A diaspora is a people living away from home.', 'Many were taken by force.'], s1: 'Think of why people moved.' })),
  fam('ad.fa.story', `${AD}AD_FACTORS`, 'word', 2, choose([
    Q('A learner says all Africans abroad went by choice. What is a better reply?', 'Many were taken by force in the slave trades', w('AD_ALL_VOLUNTARY', 'The learner is right about all of this', 'None of them were taken by any force at all', 'All went as kings'), 'Many were taken by force.'),
    Q('The descendants of captives live in Brazil today. What do we call them?', 'Part of the African diaspora', w('AD_DIASPORA_WORD', 'Part of the original homeland', 'Visitors only', 'A government'), 'They are the diaspora in the Americas.'),
    Q('A Kenyan nurse works in Britain. Which kind of movement is this?', 'Moving for work, not by force', w('AD_ALL_VOLUNTARY', 'Taken away as a prisoner of war', 'Being sold', 'Being traded'), 'This is voluntary movement for work.'),
    Q('Why do war and hardship add to the diaspora?', 'People flee to find safety abroad', w('AD_ALL_VOLUNTARY', 'People are invited abroad', 'People want to lose their homeland', 'People do not leave'), 'Some flee war and hardship.'),
    Q('Which is the best description of the word diaspora?', 'A people spread away from their original home', w('AD_DIASPORA_WORD', 'A people living in their original home', 'A people with no history', 'A people with no language'), 'The word describes a people spread from the homeland.'),
  ], { h: ['Think of forced and voluntary movement.', 'A diaspora lives away from its homeland.'], s1: 'Think of why people moved.' })),

  // ---------------------------------------------------------------- AD_LOCATE
  fam('ad.lo.table', `${AD}AD_LOCATE`, 'table', 1, choose([
    Q('Look at the table. Which country is in the Caribbean?', 'Jamaica', w('AD_JAMAICA_ASIA', 'Brazil', 'India', 'Britain'), 'Jamaica is an island in the Caribbean.',
      T(['Country', 'Region'], [['Jamaica', 'The Caribbean'], ['Brazil', 'South America'], ['India', 'South Asia'], ['Britain', 'Europe']])),
    Q('Look at the table. Which country is in South America?', 'Brazil', w('AD_JAMAICA_ASIA', 'Jamaica', 'India', 'Britain'), 'Brazil is in South America.',
      T(['Country', 'Region'], [['Jamaica', 'The Caribbean'], ['Brazil', 'South America'], ['India', 'South Asia'], ['Britain', 'Europe']])),
    Q('Which region held a large African diaspora by 1960?', 'The Americas', w('AD_NO_AMERICAS', 'Only Asia', 'Only Antarctica', 'Only Australia'), 'The Americas held large diasporas.'),
    Q('Which of these is a country in North America with a large African diaspora?', 'The United States', w('AD_NO_AMERICAS', 'Egypt', 'Kenya', 'Ethiopia'), 'The United States has a large diaspora.'),
    Q('Which island in the Caribbean has a large African diaspora?', 'Haiti', w('AD_JAMAICA_ASIA', 'Zanzibar', 'Madagascar', 'Malta'), 'Haiti is in the Caribbean.'),
  ], { h: ['Think of the Americas, Europe and the Indian Ocean world.', 'Jamaica is in the Caribbean.'], s1: 'Place the country on the map.' })),
  fam('ad.lo.story', `${AD}AD_LOCATE`, 'word', 2, choose([
    Q('A learner puts Jamaica in Asia. In which region is Jamaica?', 'The Caribbean, in the Americas', w('AD_JAMAICA_ASIA', 'South Asia', 'Europe', 'Oceania'), 'Jamaica is in the Caribbean Sea.'),
    Q('Which ocean separates Africa from Brazil?', 'The Atlantic Ocean', w('AD_NO_AMERICAS', 'The Indian Ocean', 'The Pacific Ocean', 'The Arctic Ocean'), 'The Atlantic lies between Africa and Brazil.'),
    Q('Which European country had a growing African diaspora by 1960?', 'Britain', w('AD_NO_AMERICAS', 'Iceland', 'Finland', 'Poland'), 'Britain had one.'),
    Q('Which country in the Indian Ocean world had an African community called the Siddi?', 'India', w('AD_JAMAICA_ASIA', 'Brazil', 'Cuba', 'Canada'), 'The Siddi live in India. A teacher should confirm.'),
    Q('Which of these is part of the Americas?', 'Cuba', w('AD_JAMAICA_ASIA', 'Mauritius', 'Oman', 'Yemen'), 'Cuba is in the Caribbean.'),
  ], { h: ['Place each country on its region.', 'Caribbean, South America, Europe, Asia.'], s1: 'Place the country on its region.' })),

  // ---------------------------------------------------------------- AD_ROLE
  fam('ad.ro.which', `${AD}AD_ROLE`, 'direct', 1, choose([
    Q('What is Pan-Africanism?', 'The idea that African people should unite', w('AD_PAN_MEANING', 'A trading company', 'A kind of government run by Africans', 'A kind of tax'), 'Pan-Africanism is the idea of unity among African people.'),
    Q('Who was a leader of the diaspora who supported Pan-Africanism?', 'Marcus Garvey', w('AD_NO_ROLE', 'Otto von Bismarck', 'Cecil Rhodes', 'Napoleon'), 'Marcus Garvey of Jamaica supported Pan-African unity. A teacher should confirm.'),
    Q('Which leader of the diaspora wrote about the fight for equality, and helped Pan-African congresses?', 'W. E. B. Du Bois', w('AD_NO_ROLE', 'Lord Delamere', 'Alexander Graham Bell', 'Isaac Newton'), 'Du Bois was a leader of the Pan-African congresses. A teacher should confirm.'),
    Q('Which first president of Ghana studied abroad and supported Pan-Africanism?', 'Kwame Nkrumah', w('AD_NO_ROLE', 'Julius Nyerere', 'Jomo Kenyatta', 'Haile Selassie'), 'Nkrumah was strongly Pan-African. A teacher should confirm.'),
    Q('How did the diaspora help the independence struggle?', 'It spread the idea of unity and freedom', w('AD_NO_ROLE', 'It did not help', 'It opposed the push for independence', 'It ignored Africa'), 'Writers and leaders in the diaspora supported the push for freedom.'),
  ], { h: ['Pan-Africanism is the idea of unity.', 'The diaspora supported independence.'], s1: 'Think of unity and independence.' })),
  fam('ad.ro.story', `${AD}AD_ROLE`, 'word', 2, choose([
    Q('A learner says the diaspora played no part in independence. What is a better reply?', 'It supported Pan-African unity and freedom', w('AD_NO_ROLE', 'The learner is right about all of this', 'It opposed freedom and unity in Africa', 'It did nothing at all'), 'Leaders in the diaspora helped.'),
    Q('Why did Pan-African congresses bring Africans and the diaspora together?', 'To talk about freedom and unity', w('AD_PAN_MEANING', 'To plan a new trading company', 'To draw colonial borders', 'To sell goods'), 'They discussed freedom and unity.'),
    Q('Which is NOT what Pan-Africanism means?', 'A single company that controls trade', w('AD_PAN_MEANING', 'A call for unity', 'A call for freedom', 'A shared cause of all Africans'), 'Pan-Africanism is about unity and freedom.'),
    Q('The African Union grew from which idea?', 'Pan-Africanism', w('AD_PAN_MEANING', 'Colonial rule', 'Neo-colonialism', 'The Berlin Conference'), 'The African Union grew from the idea of African unity.'),
    Q('Why do Africans today still value the diaspora?', 'They share history and work together for Africa', w('AD_NO_ROLE', 'They have no link with the people of Africa', 'They are strangers', 'They opposed unity'), 'The diaspora and Africa share history and goals.'),
  ], { h: ['Pan-Africanism is unity and freedom.', 'The diaspora supported the struggle.'], s1: 'Think of unity and freedom.' })),

  // ---------------------------------------------------------------- CZ_INTERDEP
  fam('cz.in.which', `${CZ}CZ_INTERDEP`, 'direct', 1, choose([
    Q('Why do countries trade?', 'No country has every resource', w('CZ_SELF_SUFFICIENT', 'Each country makes everything it needs', 'To stop all trade', 'To close their borders'), 'No country has everything.'),
    Q('What does interdependence mean?', 'Countries need each other and both gain', w('CZ_INTERDEP_LOSS', 'A country is weak and begging', 'A country does not trade', 'A country is alone'), 'Interdependence means mutual need and benefit.'),
    Q('Which does Kenya sell to the world?', 'Tea and flowers', w('CZ_SELF_SUFFICIENT', 'Oil and cars', 'Machines and computers', 'Fridges and phones'), 'Kenya sells tea and flowers.'),
    Q('Which does Kenya buy from other countries?', 'Oil and vehicles', w('CZ_SELF_SUFFICIENT', 'Tea and coffee', 'Maize and beans', 'Flowers and fish'), 'Kenya buys oil and vehicles.'),
    Q('Which body helps countries work together in Africa?', 'The African Union', w('CZ_SELF_SUFFICIENT', 'The Berlin Conference', 'A colonial office', 'A trading company'), 'The African Union links African countries.'),
  ], { h: ['No country has everything.', 'Countries trade and share.'], s1: 'Think of what countries need.' })),
  fam('cz.in.story', `${CZ}CZ_INTERDEP`, 'word', 2, choose([
    Q('Kenya sells tea to Britain and buys oil from the Gulf. What does this show?', 'Countries depend on each other', w('CZ_SELF_SUFFICIENT', 'Kenya does not need anyone', 'Britain does not need Kenya', 'Trade is wrong'), 'Both gain from trade.'),
    Q('A learner says depending on other countries always means being weak. What is a better reply?', 'Both sides gain from trade', w('CZ_INTERDEP_LOSS', 'The learner is right about all of this', 'Only the poor gain', 'Nobody gains'), 'Interdependence helps both.'),
    Q('A country has plenty of coffee but no oil. What should it do?', 'Trade coffee for oil with another country', w('CZ_SELF_SUFFICIENT', 'Make oil from nothing at all in the country', 'Stop using oil', 'Avoid all trade'), 'Trade fills the gap.'),
    Q('Why do countries share medical research?', 'It helps to fight disease for all', w('CZ_SELF_SUFFICIENT', 'To keep it a secret from others', 'To avoid trade', 'To make people ill'), 'Shared knowledge helps all.'),
    Q('Which organisation joins countries to solve world problems?', 'The United Nations', w('CZ_SELF_SUFFICIENT', 'A single village', 'A trading stall', 'A colonial office'), 'The UN helps nations work together.'),
  ], { h: ['No country has everything.', 'Both sides gain from trade.'], s1: 'Think of what each country has and needs.' })),

  // ---------------------------------------------------------------- CZ_GLOBAL
  fam('cz.gl.which', `${CZ}CZ_GLOBAL`, 'direct', 1, choose([
    Q('What is globalisation?', 'The world becoming one connected place', w('CZ_GLOBAL_ONLINE', 'Only using the internet', 'Only using the internet to talk to people', 'A kind of government run by Africans'), 'Trade, travel, money and the internet connect the world.'),
    Q('Which is a good effect of globalisation?', 'Quick communication with people far away', w('CZ_GLOBAL_ALL_GOOD', 'Loss of local culture', 'Local firms being beaten by imports', 'Cybercrime'), 'Communication is easier.'),
    Q('Which is a bad effect of globalisation?', 'Loss of local culture and firms', w('CZ_GLOBAL_ALL_GOOD', 'Cheaper goods', 'Quick communication with far friends', 'New markets'), 'Globalisation can harm local culture and small firms.'),
    Q('Which is a good effect of globalisation?', 'New markets for Kenyan flowers', w('CZ_GLOBAL_ALL_GOOD', 'Spread of cybercrime', 'Quick spread of disease', 'Loss of local languages'), 'Global markets help exporters.'),
    Q('Which links countries in globalisation?', 'Trade, travel, money and the internet', w('CZ_GLOBAL_ONLINE', 'The internet and the radio only', 'Roads only', 'Radio only'), 'Many things connect countries.'),
  ], { h: ['Globalisation links the whole world.', 'It has good and bad effects.'], s1: 'Think of good and bad effects.' })),
  fam('cz.gl.story', `${CZ}CZ_GLOBAL`, 'word', 2, choose([
    Q('Cheap imported cloth makes a local weaver lose customers. Which effect is this?', 'A bad effect of globalisation', w('CZ_GLOBAL_ALL_GOOD', 'A good effect of globalisation', 'No effect', 'A rule of trade'), 'Local firms can lose out.'),
    Q('A learner in Nairobi video-calls a pen friend in Canada. Which effect is this?', 'A good effect, quick communication', w('CZ_GLOBAL_ALL_GOOD', 'A bad effect, lost local culture', 'A rule of trade', 'No effect'), 'Communication is quick.'),
    Q('A learner says globalisation is only the internet. What is a better reply?', 'It includes trade, travel and money too', w('CZ_GLOBAL_ONLINE', 'The learner is right about all of this', 'It is only travel', 'It is only trade'), 'Globalisation is wider than the internet.'),
    Q('A disease spreads quickly across the world through air travel. Which effect is this?', 'A bad effect of globalisation', w('CZ_GLOBAL_ALL_GOOD', 'A good effect of globalisation', 'A trade effect', 'No effect'), 'Disease can spread quickly.'),
    Q('Young people copy foreign songs and forget their own. Which effect is this?', 'Loss of local culture', w('CZ_GLOBAL_ALL_GOOD', 'More jobs', 'Cheaper goods', 'Faster travel'), 'Local culture can be lost.'),
  ], { h: ['Decide whether it helps or harms.', 'Globalisation has both effects.'], s1: 'Decide: good or bad effect?' })),

  // ---------------------------------------------------------------- CZ_CITIZEN
  fam('cz.ci.which', `${CZ}CZ_CITIZEN`, 'direct', 1, choose([
    Q('Can a global citizen love Kenya?', 'Yes, he serves the world and still loves his country', w('CZ_LOYAL_LOSS', 'No, he must give up his country and his people', 'No, he must hate Kenya', 'No, he must leave Kenya'), 'A global citizen stays loyal to his own country.'),
    Q('Who can be a global citizen?', 'Anyone who cares for people and the world', w('CZ_ONLY_RICH', 'Only rich people who often travel abroad', 'Only leaders', 'Only adults'), 'Anyone can be one.'),
    Q('Which is a quality of a global citizen?', 'Respect for other cultures', w('CZ_ONLY_RICH', 'Wealth', 'A large house', 'A foreign accent and a passport'), 'Respect for other cultures is a quality.'),
    Q('Which is a way of helping the world?', 'Caring for the environment', w('CZ_LOYAL_LOSS', 'Ignoring all other people', 'Dumping waste', 'Wasting water'), 'Caring for the environment helps the world.'),
    Q('Which action shows loyalty to Kenya while serving the world?', 'Kenyan peacekeepers serving with the UN', w('CZ_LOYAL_LOSS', 'Leaving Kenya to live abroad for ever', 'Hating Kenya', 'Ignoring Kenya'), 'Peacekeeping serves the world and honours Kenya.'),
  ], { h: ['A global citizen cares for others and for the world.', 'He can still love his country.'], s1: 'Think of caring for others.' })),
  fam('cz.ci.story', `${CZ}CZ_CITIZEN`, 'word', 2, choose([
    Q('A learner says only rich people can be global citizens. What is a better reply?', 'Anyone who cares for others can be one', w('CZ_ONLY_RICH', 'The learner is right about all of this', 'Only people who travel a lot can be one', 'Only leaders can'), 'Global citizenship is about care, not wealth.'),
    Q('A learner collects clothes for children in another country and still loves Kenya. What does this show?', 'One can serve the world and be loyal to Kenya', w('CZ_LOYAL_LOSS', 'He must give up Kenya', 'He is no longer a Kenyan citizen at all', 'He has lost his country and his home'), 'Service and loyalty go together.'),
    Q('A school plants trees to fight climate change. Which quality is shown?', 'Concern for the environment', w('CZ_ONLY_RICH', 'Wealth', 'Fame', 'Power over other people'), 'Caring for the environment is a quality.'),
    Q('Which is a way to promote Kenya while being a global citizen?', 'Buying and promoting Kenyan goods', w('CZ_LOYAL_LOSS', 'Refusing to speak well of Kenya', 'Hating Kenyan goods', 'Selling Kenya short'), 'Promoting Kenyan goods shows loyalty.'),
    Q('Which shows cooperation, a quality of a global citizen?', 'Working with people of other countries on a project', w('CZ_ONLY_RICH', 'Working alone always', 'Refusing to share', 'Avoiding all foreigners and their countries'), 'Cooperation builds a better world.'),
  ], { h: ['Global citizens care and cooperate.', 'They also stay loyal to their country.'], s1: 'Think of care and loyalty.' }), 'e'),
];
