// ============================================================================
// GRADE 6 SOCIAL STUDIES, STRANDS 4B AND 5: REGIONAL CO-OPERATION, CITIZENSHIP, HUMAN RIGHTS, PEACE, REVENUE AND THE PREAMBLE (14 skills).
// The East African Community, the rights, responsibilities and qualities of a Kenyan citizen, human rights, causes of conflict and peaceful
// ways of settling it, how the government gets and spends money, and the preamble of the Constitution of Kenya. Written offline from the
// KICD 2024 design through the curriculum map (curriculum/social_studies/g6.json). Every wrong answer names the library misconception it
// reveals. The options of each question are about the same length. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w } from './socialstudies_g6_lib.js';

const RC = 'POLITI.REGIONAL_CO_OPERATIONS.', CZ = 'POLITI.CITIZENSHIP.', HR = 'POLITI.HUMAN_RIGHTS.', PC = 'GOVERN.PEACE_AND_CONFLICT_RESOL.', GR = 'GOVERN.GOVERNMENT_REVENUE_AND_E.', PR = 'GOVERN.THE_PREAMBLE_OF_THE_CONS.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- RC_OBJECTIVES
  fam('rc.ob.which', `${RC}RC_OBJECTIVES`, 'direct', 1, choose([
    Q('Where is the headquarters of the East African Community?', 'Arusha, in Tanzania', w('RC_HQ', 'Nairobi, in Kenya', 'Kampala, in Uganda', 'Kigali, in Rwanda'), 'The EAC headquarters is in Arusha, near Mount Kilimanjaro.'),
    Q('What is the main aim of the East African Community?', 'To make member countries work together in trade and other fields', w('RC_CUSTOMS', 'To make each country charge duties on partners', 'To make all the countries one single school', 'To end all trade between neighbouring countries'), 'The EAC links its members in trade, politics and social life.'),
    Q('What does a customs union do?', 'Lets partners trade without duty and share an outside tariff', w('RC_CUSTOMS', 'Makes each country tax its partners\' goods', 'Stops all goods from crossing the border', 'Lets only one country sell goods abroad'), 'Members trade without duty and charge one tariff on goods from outside.'),
    Q('What is the final aim of the East African Community?', 'A political federation of the partner states', w('RC_CUSTOMS', 'Closing all of the borders for ever', 'One national football team for all', 'Ending the use of all local languages'), 'The stages are a customs union, a common market, a monetary union and a political federation.'),
    Q('Which three countries were the first partners of the community?', 'Kenya, Uganda and Tanzania', w('RC_HQ', 'Kenya, Ethiopia and Somalia', 'Uganda, Rwanda and Burundi', 'Tanzania, Zambia and Malawi'), 'The first three partners were Kenya, Uganda and Tanzania.'),
  ], { h: ['Recall the aims and the headquarters of the community.', 'Arusha, customs union, common market, monetary union, political federation.'], s1: 'Recall what the EAC is for.' })),
  fam('rc.ob.story', `${RC}RC_OBJECTIVES`, 'word', 2, choose([
    Q('A lorry carries maize from Uganda to Kenya without paying duty. Which EAC aim is this?', 'The customs union', w('RC_CUSTOMS', 'The monetary union', 'The political federation', 'The head office'), 'Duty-free trade between partners is the customs union.'),
    Q('A Tanzanian teacher is allowed to take a job in Rwanda. Which aim is this?', 'The common market, with free movement of workers', w('RC_CUSTOMS', 'The customs union', 'The political federation', 'The EAC headquarters'), 'The common market allows free movement of people.'),
    Q('Learners are asked: where would a meeting of the EAC Secretariat be held?', 'Arusha', w('RC_HQ', 'Nairobi', 'Kampala', 'Dar es Salaam'), 'The EAC Secretariat is in Arusha.'),
    Q('The partners hope one day to use one money for all. Which stage is this?', 'The monetary union', w('RC_CUSTOMS', 'The customs union', 'The common market', 'The headquarters'), 'A monetary union means a shared currency.'),
    Q('Why did Kenya, Uganda and Tanzania want to work together?', 'To trade and grow together as a bigger market', w('RC_CUSTOMS', 'To stop all trade between them', 'To close their borders to each other', 'To avoid meeting each other'), 'Together they form a bigger market.'),
  ], { h: ['Which EAC stage does the story show?', 'Duty-free trade, free movement, shared money, then one government.'], s1: 'Match the story to an EAC stage.' })),

  // ---------------------------------------------------------------- RC_BENEFITS
  fam('rc.be.which', `${RC}RC_BENEFITS`, 'direct', 1, choose([
    Q('Who gains from a common market?', 'All the member countries and their people', w('RC_BENEFIT_ONE', 'Only the largest country in the region', 'Only the countries on the sea coast', 'Only the traders of the capital city'), 'A larger market helps every member.'),
    Q('What does the common market allow?', 'Free movement of people, goods and services', w('RC_NO_MOVE', 'Workers to stay only in their own country', 'Goods to cross borders only once a year', 'Services to be sold only at home'), 'People, goods and services can move more freely.'),
    Q('Which is a benefit of the EAC?', 'Shared roads, railways and ports help trade', w('RC_NO_MOVE', 'Closed borders make trade easier', 'Every country builds only its own roads', 'Goods stay in the port for months'), 'Shared transport links lower costs.'),
    Q('How does the EAC help learners and workers?', 'It allows study and work in partner countries', w('RC_NO_MOVE', 'It stops anyone leaving their home village', 'It bans study in other countries', 'It closes all the universities'), 'People can study and work across borders more easily.'),
    Q('How does the EAC help security?', 'Partners share information to fight crime together', w('RC_BENEFIT_ONE', 'Each country hides its problems from others', 'Only the largest country has an army', 'Partners keep all the police at home'), 'Shared work against crime and terror helps all.'),
  ], { h: ['Think what partners gain when borders are open.', 'Bigger market, free movement, shared roads and security.'], s1: 'Think about what the partners gain.' })),
  fam('rc.be.story', `${RC}RC_BENEFITS`, 'word', 2, choose([
    Q('A Kenyan farmer sells vegetables in Kampala without paying duty. Which benefit is this?', 'A larger market for his goods', w('RC_BENEFIT_ONE', 'A smaller market for his goods', 'A tax added to his goods', 'A ban on his goods'), 'The EAC gives farmers a bigger market.'),
    Q('A school in Arusha admits learners from Kenya and Uganda. Which benefit is this?', 'Shared education across the member states', w('RC_NO_MOVE', 'Education closed to people from outside', 'Learners kept only in their villages', 'Schools closed for all partners'), 'The EAC has links in education.'),
    Q('Why is a common market good for a small country such as Rwanda?', 'It gets a far bigger market for what it makes', w('RC_BENEFIT_ONE', 'It loses its only market to larger partners', 'It must stop all the trading it does', 'It gets nothing from the others'), 'Small countries gain most from a larger market.'),
    Q('Tourists visit Kenya, Uganda and Rwanda on one trip. Which benefit is this?', 'Joint tourism in the partner countries', w('RC_NO_MOVE', 'Tourists banned from crossing borders', 'Tourism closed in the three countries', 'Tourists allowed in one country only'), 'Partners can promote tourism together.'),
    Q('A trader from Tanzania opens a shop in Nairobi. What does the common market do for him?', 'Lets him set up business more easily in a partner country', w('RC_NO_MOVE', 'Stops him from leaving Tanzania', 'Makes him pay duty twice over', 'Closes the shop on the first day'), 'The common market helps people do business across borders.'),
  ], { h: ['Which benefit does the story show?', 'Larger market, free movement, shared services.'], s1: 'Match the story to a benefit.' })),

  // ---------------------------------------------------------------- RC_PROBLEMS
  fam('rc.pr.pair', `${RC}RC_PROBLEMS`, 'direct', 1, choose([
    Q('What helps to reduce delays at borders?', 'One-stop border posts and fewer non-tariff barriers', w('RC_PROBLEM_SOLUTION', 'Singing the EAC anthem at the gate', 'Adding more checks at every office', 'Closing the borders for a week each month'), 'Faster crossing helps trade.'),
    Q('How should disputes between partner states be settled?', 'By talks and the EAC Court of Justice', w('RC_WAR', 'By force and threats at the border', 'By closing the border for ever', 'By ignoring the other country'), 'Peaceful means such as talks and the court settle disputes.'),
    Q('What helps when partners have different laws on trade?', 'Making policies and laws more alike', w('RC_PROBLEM_SOLUTION', 'Keeping every law different on purpose', 'Making border checks stricter each year', 'Asking each lorry to pay twice'), 'Harmonised policies make trade simpler.'),
    Q('What helps when a small partner fears it gains less than the others?', 'Sharing the benefits fairly among all the partners', w('RC_PROBLEM_SOLUTION', 'Giving all the benefits to the largest partner', 'Closing the market to the smaller partner', 'Removing the small partner from the group'), 'Fair sharing builds trust.'),
    Q('What helps when poor roads slow trade between countries?', 'Building and linking roads and railways', w('RC_PROBLEM_SOLUTION', 'Closing the roads between the countries', 'Charging more at each toll station', 'Cutting down the number of lorries'), 'Good links lower the cost of trade.'),
  ], { h: ['Match each problem of the EAC to the action that solves it.', 'Delays: one-stop border posts. Disputes: talks and the court.'], s1: 'Match problem and solution.' })),
  fam('rc.pr.story', `${RC}RC_PROBLEMS`, 'word', 2, choose([
    Q('Two partners quarrel over a boundary. What should they do?', 'Talk and use the EAC Court of Justice', w('RC_WAR', 'Send soldiers to the boundary', 'Close the roads between them for ever', 'Stop talking to each other'), 'Peaceful settlement protects the community.'),
    Q('A lorry waits three days at a border while it is checked at every office. Which solution fits?', 'A one-stop border post with one set of checks', w('RC_PROBLEM_SOLUTION', 'More offices and more forms to fill in', 'A new fee at the gate of each office', 'A rule that stops lorries crossing at night'), 'One set of checks speeds crossing.'),
    Q('Each partner charges a different tax on the same good. Which solution fits?', 'Agree on common policies and taxes', w('RC_PROBLEM_SOLUTION', 'Let each country keep any tax it likes', 'Add a new tax in every country', 'Stop selling the good in other countries'), 'Common policies make trade fairer.'),
    Q('Why do partners need to trust each other?', 'Trust helps them keep promises and share benefits', w('RC_WAR', 'Trust makes them fight over the borders', 'Trust stops them from trading at all', 'Trust makes them close the borders'), 'The community depends on trust.'),
    Q('A partner delays paying its share to the community. What helps?', 'Meetings of leaders to agree on payment rules', w('RC_PROBLEM_SOLUTION', 'Ignoring the missing payment for years', 'Taking the money by force', 'Closing the community headquarters'), 'Agreeing rules and talking help.'),
  ], { h: ['What problem does the story show?', 'Disputes, delays, differences and trust each have an answer.'], s1: 'Match the problem to its solution.' }), 'e'),

  // ---------------------------------------------------------------- CZ_RIGHTS_RESP
  fam('cz.rr.which', `${CZ}CZ_RIGHTS_RESP`, 'direct', 1, choose([
    Q('Which is a responsibility of a Kenyan citizen?', 'Paying taxes', w('CZ_RIGHT_RESP', 'Owning property', 'Moving freely in Kenya', 'Getting a passport'), 'Paying taxes is a duty. The other three are rights.'),
    Q('Mercy turns 18 this year. What can she now do as a citizen of Kenya?', 'Vote in elections', w('CZ_VOTE_AGE', 'Vote only at 21', 'Vote only at 16', 'Never vote at all'), 'A Kenyan citizen can vote at 18.'),
    Q('At what age can a Kenyan citizen vote?', '18 years', w('CZ_VOTE_AGE', '16 years', '14 years', '21 years'), 'A Kenyan citizen can vote at 18.'),
    Q('Which is a right of a Kenyan citizen?', 'Moving freely in the country', w('CZ_RIGHT_RESP', 'Paying taxes on time', 'Obeying the law', 'Protecting public property'), 'Free movement is a right. The others are responsibilities.'),
    Q('Which duty must every Kenyan keep, whatever their age?', 'Obeying the law', w('CZ_RIGHT_RESP', 'Owning land', 'Getting an identity card', 'Joining a trade union'), 'Obeying the law is a duty.'),
    Q('Which of these is a duty of a good citizen, not a right?', 'Protecting public property and the environment', w('CZ_RIGHT_RESP', 'Holding a passport', 'Owning a house', 'Using public roads'), 'Looking after public property and the environment is a duty.'),
  ], { h: ['What does the citizen give, and what does the citizen receive?', 'Duties are what we must do. Rights are what we may enjoy.'], s1: 'Sort the statement into right or responsibility.' })),
  fam('cz.rr.story', `${CZ}CZ_RIGHTS_RESP`, 'word', 2, choose([
    Q('Wanjiku is 18 and gets her identity card. What is this?', 'The exercise of her right as a citizen', w('CZ_RIGHT_RESP', 'A tax that she must pay each year', 'A duty owed to her old school', 'A punishment given by the law'), 'Holding an identity card is a right of a citizen.'),
    Q('Omar pays his taxes on his small shop. What is this?', 'The responsibility of a citizen', w('CZ_RIGHT_RESP', 'A gift made to the government', 'A right to receive free goods', 'A reward for his hard work'), 'Paying taxes is a duty.'),
    Q('Learners clean up a public park. Which responsibility does this show?', 'Protecting public property and the environment', w('CZ_RIGHT_RESP', 'Moving freely in all parts of Kenya', 'Voting in a general election in the county', 'Owning the whole park for themselves alone'), 'Looking after public places is a duty.'),
    Q('Which person is using a right of a citizen?', 'A man who travels to another county for work', w('CZ_RIGHT_RESP', 'A man who protects a public forest well', 'A man who pays his income tax on time', 'A man who obeys all the traffic rules'), 'Free movement is a right.'),
    Q('Which person is carrying out a responsibility of a citizen?', 'A woman who obeys the law and pays her taxes', w('CZ_RIGHT_RESP', 'A woman who gets her new passport', 'A woman who travels freely in Kenya', 'A woman who buys a plot of land and owns it'), 'Obeying the law and paying taxes are duties.'),
  ], { h: ['Is the action something a citizen must do, or may enjoy?', 'Duty: must do. Right: may enjoy.'], s1: 'Decide whether it is a right or a duty.' })),

  // ---------------------------------------------------------------- CZ_QUALITIES
  fam('cz.qu.which', `${CZ}CZ_QUALITIES`, 'direct', 1, choose([
    Q('What is patriotism?', 'Love and loyalty for the country shown in actions', w('CZ_PATRIOT', 'Only singing the national anthem aloud', 'Only waving the flag on holidays', 'Only wearing national colours to events'), 'Patriotism shows in what a person does for the country.'),
    Q('Which action shows a good citizen?', 'Refusing to bribe and reporting corruption', w('CZ_CORRUPT', 'Paying a bribe to get quick service', 'Keeping quiet about a bribe', 'Offering gifts to jump a queue'), 'Honesty protects the country.'),
    Q('Which quality does a person show who returns lost money to its owner?', 'Honesty', w('CZ_CORRUPT', 'Laziness', 'Greed', 'Selfishness'), 'Returning lost money shows honesty.'),
    Q('Which quality is shown by a learner who works hard at school?', 'Hard work and responsibility', w('CZ_CORRUPT', 'Carelessness and delay', 'Laziness and neglect', 'Pride and boasting'), 'Hard work builds the nation.'),
    Q('Which quality is shown by people of different tribes who respect each other?', 'Tolerance and love of peace', w('CZ_PATRIOT', 'Hatred and suspicion', 'Pride in one tribe alone', 'Fear of other communities'), 'Tolerance holds the nation together.'),
  ], { h: ['Which action helps the country and other people?', 'Honesty, hard work, tolerance and respect for law.'], s1: 'Pick the action that helps the country.' })),
  fam('cz.qu.story', `${CZ}CZ_QUALITIES`, 'word', 2, choose([
    Q('Mrs Atieno is asked for a bribe to get a licence. She refuses and reports it. Which quality does she show?', 'Honesty and respect for the law', w('CZ_CORRUPT', 'Pride and unfairness towards others', 'Greed and fear of the officials', 'Laziness and carelessness at work'), 'Refusing a bribe shows honesty.'),
    Q('Learners plant trees on Tree Planting Day to help Kenya. Which quality do they show?', 'Patriotism, shown in an action', w('CZ_PATRIOT', 'Only making a long speech', 'Only wearing a school uniform', 'Only singing loudly on the day'), 'Patriotism is shown by actions that help the country.'),
    Q('A boy stops other boys from fighting a classmate from another tribe. Which quality does he show?', 'Tolerance and love of peace', w('CZ_PATRIOT', 'Hatred and deep suspicion of others', 'Pride and anger towards the boys', 'Fear and silence in front of them'), 'He protects peace and respects difference.'),
    Q('A man pays his taxes and obeys the law even when no one is watching. Which quality does he show?', 'Responsibility and respect for the law', w('CZ_CORRUPT', 'Pride in trickery and cheating', 'Greed and fear of being caught', 'Carelessness and delay in paying'), 'He does what a good citizen should.'),
    Q('Which learner is acting as a good citizen?', 'One who helps clean the school compound', w('CZ_CORRUPT', 'One who breaks the school fence down', 'One who hides away from all duties', 'One who drops litter everywhere'), 'Helping keep the compound clean shows responsibility.'),
  ], { h: ['Which quality does the action show?', 'Honesty, patriotism, tolerance and responsibility.'], s1: 'Name the quality in the story.' }), 'c'),
  fam('cz.qu.spot', `${CZ}CZ_QUALITIES`, 'spot', 3, spot([
    S('Titus says patriotism is only singing the anthem. Which step has the mistake?', ['Step 1: Titus loves the anthem.', '!Step 2: He says singing is the only way to love the country.', 'Step 3: He writes only singing.'], 'Patriotism is love and loyalty shown in actions that help the country.', 'CZ_PATRIOT'),
    S('Rachel says paying a bribe is good citizenship because it gets things done. Which step has the mistake?', ['Step 1: Rachel wants the work done quickly.', '!Step 2: She says dishonesty serves the country.', 'Step 3: She writes pay the bribe.'], 'A good citizen is honest. Refusing a bribe and reporting it protects the country.', 'CZ_CORRUPT'),
    S('Collins says waving the flag is all a patriot has to do. Which step has the mistake?', ['Step 1: Collins waves the flag on Jamhuri Day.', '!Step 2: He says waving is enough for loyalty.', 'Step 3: He writes enough.'], 'Patriotism needs actions such as work, honesty and helping others.', 'CZ_PATRIOT'),
    S('Beatrice says it is smart to give a gift to jump a queue. Which step has the mistake?', ['Step 1: Beatrice sees a long queue.', '!Step 2: She says a hidden gift is fair.', 'Step 3: She writes give the gift.'], 'Jumping a queue with a gift is a bribe and is unfair and dishonest.', 'CZ_CORRUPT'),
    S('Elijah says a patriot has no need to obey the law. Which step has the mistake?', ['Step 1: Elijah loves his country.', '!Step 2: He says love means freedom from laws.', 'Step 3: He writes no need.'], 'A patriot respects and obeys the law.', 'CZ_PATRIOT'),
  ], { h: ['Which step makes patriotism only words, or praises a bribe?', 'Good citizens show honesty and loyalty in action.'], s1: 'Check each step against good citizenship.' })),

  // ---------------------------------------------------------------- HR_CATEGORIES
  fam('hr.ca.which', `${HR}HR_CATEGORIES`, 'direct', 1, choose([
    Q('Which category is the right to vote in?', 'Political rights', w('HR_CAT_SWAP', 'Economic rights', 'Social rights', 'Cultural rights'), 'Voting and standing for election are political rights.'),
    Q('Which category is the right to education in?', 'Social rights', w('HR_EDU', 'Political rights', 'Economic rights', 'Criminal rights'), 'Education, health and housing are social rights.'),
    Q('Which category is the right to work and to get a just wage in?', 'Economic rights', w('HR_CAT_SWAP', 'Political rights', 'Social rights', 'Religious rights'), 'Work, fair pay and owning property are economic rights.'),
    Q('Which is a political right?', 'To stand for election', w('HR_CAT_SWAP', 'To get health care', 'To own a business', 'To get clean water'), 'Standing for election is a political right.'),
    Q('Which is an economic right?', 'To own property', w('HR_CAT_SWAP', 'To vote in elections', 'To join a political party', 'To stand for election'), 'Owning property is an economic right.'),
  ], { h: ['Is the right about running the country, welfare or earning a living?', 'Political: voting. Social: school, health. Economic: work, property.'], s1: 'Sort the right into political, social or economic.' })),
  fam('hr.ca.story', `${HR}HR_CATEGORIES`, 'word', 2, choose([
    Q('Mary joins a political party and votes. Which category of rights is she using?', 'Political rights', w('HR_CAT_SWAP', 'Economic rights', 'Social rights', 'Cultural rights'), 'Joining a party and voting are political.'),
    Q('Peter goes to the hospital for treatment. Which category of rights is he using?', 'Social rights', w('HR_EDU', 'Political rights', 'Economic rights', 'Legal rights'), 'Health care is a social right.'),
    Q('Njeri starts a small shop and earns a living. Which category of rights is she using?', 'Economic rights', w('HR_CAT_SWAP', 'Political rights', 'Social rights', 'Religious rights'), 'Running a business is an economic right.'),
    Q('A child goes to school each day. Which category of rights is this?', 'Social rights', w('HR_EDU', 'Political rights', 'Economic rights', 'Voting rights'), 'Education is a social right.'),
    Q('Workers form a trade union to ask for fair pay. Which category of rights is this?', 'Economic rights', w('HR_CAT_SWAP', 'Political rights', 'Social rights', 'Cultural rights'), 'Joining a union and fair pay are economic rights.'),
  ], { h: ['Is the person taking part in government, getting a service, or earning a living?', 'Political, social or economic.'], s1: 'Name the category the story shows.' })),

  // ---------------------------------------------------------------- HR_UPHOLD
  fam('hr.up.which', `${HR}HR_UPHOLD`, 'direct', 1, choose([
    Q('Who helps to uphold human rights in Kenya?', 'The courts, the Commission and every citizen', w('HR_ONLY_POLICE', 'Only the police force and the army', 'Only the teachers who work at a school', 'Only the head of state and his office'), 'Many bodies and all citizens uphold human rights.'),
    Q('When is Human Rights Day celebrated?', '10 December', w('HR_DAY', '1 June', '12 December', '20 October'), 'Human Rights Day is on 10 December.'),
    Q('Which body in Kenya looks into abuses of human rights?', 'The Kenya National Commission on Human Rights', w('HR_ONLY_POLICE', 'The Kenya Bureau of Standards in Nairobi', 'The Kenya Power and Lighting Company', 'The Kenya Meat Commission at Athi River'), 'The Commission investigates human rights abuses.'),
    Q('Which document in Kenya protects our rights?', 'The Constitution and its Bill of Rights', w('HR_ONLY_POLICE', 'The price list of the local market', 'The timetable of the school week', 'The weather report for the week'), 'The Bill of Rights is in the Constitution.'),
    Q('What should a learner do if a classmate\'s rights are abused?', 'Report to a teacher or an adult who can help', w('HR_ONLY_POLICE', 'Hide away and say nothing to anyone', 'Keep quiet and walk away from the abuse', 'Join in and laugh at the abuse as well'), 'Reporting abuse helps protect rights.'),
  ], { h: ['Think of laws, bodies and people who protect rights.', 'Courts, commissions, schools and every citizen.'], s1: 'Think about who protects rights.' })),
  fam('hr.up.story', `${HR}HR_UPHOLD`, 'word', 2, choose([
    Q('A boy is stopped from going to school because he is poor. Which action upholds his rights?', 'Report it so he can be helped to go to school', w('HR_ONLY_POLICE', 'Leave him at home as it is not our concern', 'Tell him to work instead of school', 'Laugh at him and walk away'), 'Education is a right, so we report such cases.'),
    Q('Learners respect a new classmate who uses a wheelchair. Which action is this?', 'Respecting the rights and dignity of others', w('HR_ONLY_POLICE', 'Keeping him out of all of the games', 'Laughing at the way that he moves about', 'Pushing him out of the class for ever'), 'Respect upholds the rights of every person.'),
    Q('A school holds a Human Rights Day lesson. Which action is this?', 'Teaching people about rights so they respect them', w('HR_DAY', 'Hiding all of the rights from learners', 'Punishing learners who ask any questions', 'Closing the school for a whole week'), 'Teaching rights helps to uphold them.'),
    Q('A man\'s rights are broken by an official. Where can he seek help?', 'In court or from the Commission on Human Rights', w('HR_ONLY_POLICE', 'From the traders in the local market', 'From the weather office of the town', 'Nowhere, because only the police can help'), 'Courts and commissions protect rights.'),
    Q('Why is it important that police themselves respect human rights?', 'Because they must follow the law like everyone else', w('HR_ONLY_POLICE', 'Because police officers are above the law', 'Because only police officers have any rights', 'Because rights apply to children and not adults'), 'Everyone, even police, must respect human rights.'),
  ], { h: ['Which action respects rights and who can help?', 'Respect, report and teach.'], s1: 'Choose the action that protects rights.' }), 'c'),
  fam('hr.up.spot', `${HR}HR_UPHOLD`, 'spot', 3, spot([
    S('Patrick says only the police uphold human rights. Which step has the mistake?', ['Step 1: Patrick sees the police at work.', '!Step 2: He says nobody else protects rights.', 'Step 3: He writes only the police.'], 'Courts, commissions, schools and every citizen also uphold rights.', 'HR_ONLY_POLICE'),
    S('Hellen says Human Rights Day is on 1 June. Which step has the mistake?', ['Step 1: Hellen knows 1 June is a national holiday.', '!Step 2: She says all national days are about rights.', 'Step 3: She writes 1 June.'], 'Human Rights Day is on 10 December.', 'HR_DAY'),
    S('Wilfred says a citizen has no part in protecting rights. Which step has the mistake?', ['Step 1: Wilfred sees officials at work.', '!Step 2: He says officials are the only ones to act.', 'Step 3: He writes no part.'], 'Every citizen helps by respecting and reporting abuses.', 'HR_ONLY_POLICE'),
    S('Gloria says Human Rights Day is on 25 December. Which step has the mistake?', ['Step 1: Gloria remembers a December date.', '!Step 2: She says the big December day is Human Rights Day.', 'Step 3: She writes 25 December.'], 'Human Rights Day is on 10 December. 25 December is Christmas Day.', 'HR_DAY'),
    S('Said says the courts have no part in protecting rights. Which step has the mistake?', ['Step 1: Said sees courts as places of punishment.', '!Step 2: He says courts cannot protect rights.', 'Step 3: He writes no part.'], 'Courts decide cases and protect rights under the Bill of Rights.', 'HR_ONLY_POLICE'),
  ], { h: ['Which step names one body only or the wrong date?', 'Many people and bodies protect rights.'], s1: 'Check each step against who protects rights.' })),

  // ---------------------------------------------------------------- PC_CAUSES
  fam('pc.ca.which', `${PC}PC_CAUSES`, 'direct', 1, choose([
    Q('Which is a common cause of conflict?', 'Competition for land, water and pasture', w('PC_NO_CAUSE', 'Conflicts have no cause, they just happen', 'Plenty of rain on all farms', 'Good friends who share lunch'), 'People quarrel over scarce land, water and pasture.'),
    Q('How should a quarrel between two friends be settled?', 'By talking and listening to each other', w('PC_VIOLENCE_SOLVE', 'By fighting until one gives up', 'By calling other children to fight', 'By staying angry for many days'), 'Talking settles quarrels without harm.'),
    Q('Which is a cause of conflict in a community?', 'Unfair sharing of resources and jobs', w('PC_NO_CAUSE', 'Fair sharing of food and jobs', 'Good roads and clean water', 'Respect among all the people'), 'Unfairness makes people angry.'),
    Q('Which is a cause of conflict in a school?', 'Bullying and rumours', w('PC_NO_CAUSE', 'Sharing books and games', 'Respecting other children', 'Working together on a project'), 'Bullying and rumours cause quarrels.'),
    Q('Which is a cause of conflict at election time?', 'Hatred between supporters of different parties', w('PC_NO_CAUSE', 'Respect for different views', 'Voting in a calm queue', 'Accepting the results in peace'), 'Political hatred can cause violence.'),
  ], { h: ['What do people compete or quarrel over?', 'Land, water, power, unfairness, rumours.'], s1: 'Think about what people quarrel over.' })),
  fam('pc.ca.story', `${PC}PC_CAUSES`, 'word', 2, choose([
    Q('Two herding communities both want the same river in a dry season. What caused the conflict?', 'Competition for water and pasture', w('PC_NO_CAUSE', 'Plenty of water for both groups', 'A new school in the area', 'A new bus route'), 'Scarce water and pasture cause conflicts.'),
    Q('A neighbour moves a fence into Mwangi\'s land and Mwangi is angry. What caused the conflict?', 'A boundary and land dispute', w('PC_NO_CAUSE', 'A sports day at school', 'Sharing a meal together', 'A new market day'), 'Boundary disputes are a common cause.'),
    Q('A rumour that a boy stole a pen makes his friends turn on him. What caused the conflict?', 'A rumour that was not checked', w('PC_NO_CAUSE', 'A fair game in the playground', 'A lesson on respect', 'A kind word from the teacher'), 'Rumours start conflicts.'),
    Q('Many young people in a town have no jobs and fall into crime and fights. What is a cause?', 'Unemployment and poverty', w('PC_NO_CAUSE', 'Plenty of jobs for everyone', 'Fair sharing of resources', 'Respect and unity in the town'), 'Unemployment can lead to conflict.'),
    Q('Why is fighting a poor way to settle a quarrel?', 'It hurts people and makes the quarrel worse', w('PC_VIOLENCE_SOLVE', 'It always makes both sides friends', 'It solves the quarrel at once', 'It makes the rules fairer'), 'Violence causes harm and more anger.'),
  ], { h: ['What is the source of the quarrel in the story?', 'Scarce resources, boundaries, rumours and unemployment.'], s1: 'Name the cause in the story.' })),

  // ---------------------------------------------------------------- PC_METHODS
  fam('pc.me.which', `${PC}PC_METHODS`, 'direct', 1, choose([
    Q('In which method does a third person decide the answer for the two sides?', 'Arbitration', w('PC_MED_ARB', 'Mediation', 'Negotiation', 'Dialogue'), 'In arbitration the third person decides. In mediation the third person helps.'),
    Q('In which method does a third person help the two sides to agree?', 'Mediation', w('PC_MED_ARB', 'Arbitration', 'A court judgment', 'A fight'), 'A mediator helps the two sides to reach their own agreement.'),
    Q('What is negotiation?', 'The two sides bargain to reach an agreement', w('PC_MED_ARB', 'A third person decides for them', 'The two sides stop talking to each other', 'One side wins by force'), 'In negotiation the two sides talk directly.'),
    Q('Which is a peaceful way besides court of settling a dispute?', 'A council of elders such as the Njuri Ncheke', w('PC_COURT_ONLY', 'There is none besides court', 'A fight between the two sides', 'A war between two groups'), 'Councils of elders settle disputes peacefully.'),
    Q('What is reconciliation?', 'Making peace again after a quarrel', w('PC_MED_ARB', 'Starting a quarrel with a neighbour', 'Ending a friendship for good', 'Punishing the other side'), 'Reconciliation restores good relations.'),
  ], { h: ['Who decides: the two sides, or a third person?', 'Mediator helps. Arbitrator decides.'], s1: 'Match the method to its meaning.' })),
  fam('pc.me.story', `${PC}PC_METHODS`, 'word', 2, choose([
    Q('Two girls quarrel over a pen. The teacher listens to both and helps them agree. Which method is this?', 'Mediation', w('PC_MED_ARB', 'Arbitration', 'A fight', 'A court case'), 'The teacher helped them agree, which is mediation.'),
    Q('Two traders ask a respected elder to decide who is right and promise to obey. Which method is this?', 'Arbitration', w('PC_MED_ARB', 'Mediation', 'Negotiation', 'A fight'), 'The elder decides and both obey, which is arbitration.'),
    Q('Two neighbours meet and agree to share a well. Which method is this?', 'Negotiation', w('PC_MED_ARB', 'Arbitration', 'Mediation', 'A court case'), 'They bargain on their own, which is negotiation.'),
    Q('Elders in a village hear a land quarrel and give advice. Which method is this?', 'A council of elders settling the dispute', w('PC_COURT_ONLY', 'A war between the two groups', 'A fight over the boundary', 'A strike by workers'), 'Elders settle many local disputes.'),
    Q('After a quarrel, two friends say sorry and shake hands. Which method is this?', 'Reconciliation', w('PC_MED_ARB', 'Arbitration', 'A court case', 'A fight'), 'Saying sorry and making peace is reconciliation.'),
  ], { h: ['Who helps, who decides, or do the two sides agree alone?', 'Mediator helps. Arbitrator decides.'], s1: 'Match the story to a method.' })),
  fam('pc.me.spot', `${PC}PC_METHODS`, 'spot', 3, spot([
    S('Mercy says in mediation the third person decides. Which step has the mistake?', ['Step 1: Mercy knows a third person is involved.', '!Step 2: She says the third person gives the final answer.', 'Step 3: She writes the third person decides.'], 'In mediation the third person helps the two sides to agree. In arbitration the third person decides.', 'PC_MED_ARB'),
    S('Kenneth says the only way to settle a dispute is in court. Which step has the mistake?', ['Step 1: Kenneth knows courts settle cases.', '!Step 2: He says nothing else can settle a dispute.', 'Step 3: He writes only court.'], 'Councils of elders, mediation and talks also settle disputes peacefully.', 'PC_COURT_ONLY'),
    S('Lucy says arbitration means the two sides agree alone. Which step has the mistake?', ['Step 1: Lucy remembers arbitration is peaceful.', '!Step 2: She says no third person is involved.', 'Step 3: She writes alone.'], 'In arbitration a third person decides.', 'PC_MED_ARB'),
    S('Hussein says elders have no part in settling disputes. Which step has the mistake?', ['Step 1: Hussein sees a modern court.', '!Step 2: He says only the courts can settle disputes.', 'Step 3: He writes no part.'], 'Councils of elders such as the Njuri Ncheke settle disputes.', 'PC_COURT_ONLY'),
    S('Wendy says negotiation needs a judge. Which step has the mistake?', ['Step 1: Wendy knows negotiation is peaceful.', '!Step 2: She says a judge must decide.', 'Step 3: She writes a judge.'], 'In negotiation the two sides talk and agree themselves.', 'PC_MED_ARB'),
  ], { h: ['Which step mixes mediation with arbitration, or says only courts settle disputes?', 'Mediator helps, arbitrator decides.'], s1: 'Check each step against the methods.' })),

  // ---------------------------------------------------------------- PC_PROMOTE
  fam('pc.pr.which', `${PC}PC_PROMOTE`, 'direct', 1, choose([
    Q('Which action promotes peace?', 'Forgiving others and talking about problems', w('PC_REVENGE', 'Taking revenge on those who hurt you', 'Fighting back at once', 'Refusing to speak to others'), 'Forgiveness and talk keep peace.'),
    Q('What does spreading rumours do?', 'Starts or increases conflict', w('PC_RUMOUR', 'Brings peace to the community', 'Helps people to trust each other', 'Does nothing at all to anyone'), 'Rumours cause suspicion and quarrels.'),
    Q('What does a school peace club do?', 'Teaches learners to settle quarrels peacefully', w('PC_REVENGE', 'Keeps the learners away from each other', 'Closes the school for a whole week', 'Teaches learners how to fight back'), 'Peace clubs teach peaceful ways.'),
    Q('Which activity helps two communities to live in peace?', 'Sports and cultural events between them', w('PC_REVENGE', 'Calling each other bad names often', 'Raids on each other\'s herds of cattle', 'Closing the road that links them'), 'Shared events build friendship.'),
    Q('Which Kenyan body was set up to promote national unity and peace?', 'The National Cohesion and Integration Commission', w('PC_RUMOUR', 'The Kenya Seed Company in Kitale', 'The Kenya Ports Authority at Mombasa', 'The Kenya Wildlife Service in Nairobi'), 'The NCIC promotes cohesion and fights hate speech.'),
  ], { h: ['Which action brings people together?', 'Forgiveness, talk, sharing and respect.'], s1: 'Pick the action that builds peace.' })),
  fam('pc.pr.story', `${PC}PC_PROMOTE`, 'word', 2, choose([
    Q('Learners from two schools play a football match and share lunch. What does this promote?', 'Friendship and peace between the schools', w('PC_REVENGE', 'Revenge for the old lost matches', 'Hatred between the two schools', 'Fear of the learners at the other school'), 'Sport builds friendship.'),
    Q('A boy hears a rumour about a classmate. What should he do?', 'Check the facts and not pass it on', w('PC_RUMOUR', 'Tell the whole school at once', 'Make the rumour even bigger', 'Use it to tease the classmate'), 'Not spreading rumours protects peace.'),
    Q('A girl is hit by another girl. Her friends want revenge. What promotes peace?', 'Tell a teacher and let the matter be settled fairly', w('PC_REVENGE', 'Plan to attack her after school', 'Stop speaking to her for good', 'Hit the other girl back at once'), 'Fair settlement avoids more harm.'),
    Q('Neighbours of different tribes share a well and a festival. What does this promote?', 'Peace through sharing and respect for differences', w('PC_REVENGE', 'Rivalry between the two tribes', 'Separate lives lived in fear', 'Suspicion of each other\'s ways'), 'Sharing builds peace.'),
    Q('A community sets up a peace committee of elders and youth. What does it do?', 'Settles disputes before they become fights', w('PC_REVENGE', 'Makes the quarrels last much longer', 'Plans raids on the rival groups', 'Closes all of the roads at night'), 'Peace committees settle trouble early.'),
  ], { h: ['Which action calms things and builds friendship?', 'Share, talk, forgive, check the facts.'], s1: 'Choose the action that builds peace.' })),

  // ---------------------------------------------------------------- GR_SOURCES
  fam('gr.so.which', `${GR}GR_SOURCES`, 'direct', 1, choose([
    Q('Which is a tax?', 'Income tax on salaries', w('GR_LOAN_TAX', 'A loan from a bank', 'A gift from a friend', 'A school fee paid to a school'), 'Income tax is a tax. A loan must be repaid.'),
    Q('Who collects national taxes in Kenya?', 'The Kenya Revenue Authority', w('GR_COLLECTOR', 'The Kenya Police Service', 'The county assembly', 'The Teachers Service Commission'), 'The Kenya Revenue Authority, or KRA, collects national taxes.'),
    Q('Which is a source of revenue for the national government?', 'Value added tax on goods and services', w('GR_LOAN_TAX', 'Pocket money from the school', 'Prizes won in a football match', 'Rent from a family house'), 'VAT is a tax on goods and services.'),
    Q('Which is a source of revenue?', 'Customs duty on goods brought into the country', w('GR_LOAN_TAX', 'A bus fare paid by a traveller', 'A tip paid to a waiter', 'A gift to a charity'), 'Customs duty is a tax on goods that cross the border.'),
    Q('Which is a source of money for the government that must be repaid?', 'Loans', w('GR_LOAN_TAX', 'Income tax', 'Customs duty', 'Fines in courts'), 'A loan is borrowed and must be repaid. Taxes need not be repaid.'),
  ], { h: ['A tax is compulsory and not repaid. A loan must be repaid.', 'KRA collects national taxes.'], s1: 'Tell a tax from other sources.' })),
  fam('gr.so.story', `${GR}GR_SOURCES`, 'word', 2, choose([
    Q('Mr Otieno pays 10 percent of his salary to the government each month. What is this?', 'Income tax', w('GR_LOAN_TAX', 'A loan to the government', 'A gift to the president', 'A fine for lateness'), 'A tax on salaries is income tax.'),
    Q('A shop adds 16 percent to the price of goods and sends it to the government. What is this?', 'Value added tax, or VAT', w('GR_LOAN_TAX', 'A loan to the shop', 'A fine for late goods', 'A gift to customers'), 'VAT is added to the price of goods and services.'),
    Q('The government borrows from other countries to build a road. What is this?', 'A loan, which must be repaid', w('GR_LOAN_TAX', 'A tax that need not be repaid', 'A gift that is not repaid', 'A fine from a court'), 'A loan is borrowed money.'),
    Q('A driver pays a fine for breaking a traffic rule. Where does the money go?', 'To the government as revenue', w('GR_COLLECTOR', 'To the driver of the other car', 'To the school nearby', 'To the local church'), 'Fines are a source of revenue.'),
    Q('Why must a company pay duty on goods it brings into Kenya?', 'Customs duty is a tax collected at the border', w('GR_COLLECTOR', 'To pay the driver of the lorry', 'To pay the shopkeeper in town', 'To pay a farmer in the village'), 'The government collects duty at the border.'),
  ], { h: ['Is it a tax, a loan, a fine or a fee?', 'Taxes are compulsory and not repaid.'], s1: 'Name the source of revenue in the story.' })),

  // ---------------------------------------------------------------- GR_SPENDING
  fam('gr.sp.which', `${GR}GR_SPENDING`, 'direct', 1, choose([
    Q('Which level of government pays teachers?', 'The national government', w('GR_LEVEL_SWAP', 'The county government', 'The village elders', 'The school itself'), 'Teachers are paid through the Teachers Service Commission, a national body.'),
    Q('What is tax money used for?', 'Roads, schools, hospitals and security', w('GR_TAX_WASTE', 'Kept only by officials for themselves', 'Burnt at the end of the year', 'Given back to those who paid it'), 'Tax money pays for public services.'),
    Q('Which service does a county government run?', 'County health services and county roads', w('GR_LEVEL_SWAP', 'The army and the navy', 'Passports and foreign affairs', 'National referral hospitals'), 'Counties run local health services and roads.'),
    Q('What does the national government spend on?', 'Defence, national roads and national referral hospitals', w('GR_LEVEL_SWAP', 'Local dispensaries and ECDE centres', 'County markets and county water points', 'Only village footpaths'), 'Defence and national roads are national.'),
    Q('Which level of government looks after early childhood education centres?', 'The county government', w('GR_LEVEL_SWAP', 'The national government', 'The Kenya Defence Forces', 'The Teachers Service Commission'), 'Pre-primary education is a county function.'),
  ], { h: ['Is the service national or local?', 'National: defence, teachers, national roads. County: local health, ECDE, markets.'], s1: 'Match the service to its level.' })),
  fam('gr.sp.story', `${GR}GR_SPENDING`, 'word', 2, choose([
    Q('A county builds a dispensary in a village. Whose money is used?', 'The county government\'s revenue', w('GR_LEVEL_SWAP', 'The national army\'s money', 'The village elders\' money', 'The money of one family'), 'Counties spend on local health care.'),
    Q('The national government buys equipment for the Kenya Defence Forces. Which type of spending is this?', 'National spending on defence and security', w('GR_LEVEL_SWAP', 'County spending on local roads', 'County spending on markets', 'Spending by a school'), 'Defence is a national responsibility.'),
    Q('Tax money builds a new class for a primary school and pays the teachers. What does it show?', 'Taxes are spent on education', w('GR_TAX_WASTE', 'Taxes are kept by officials', 'Taxes are thrown away', 'Taxes are given to private shops'), 'Education is paid for by taxes.'),
    Q('A county repairs a rural road and builds a market. What is this?', 'County spending on roads and markets', w('GR_LEVEL_SWAP', 'National spending on defence', 'National spending on passports', 'Spending on the army'), 'Counties handle county roads and markets.'),
    Q('Which of these does a county government NOT pay for?', 'The Kenya Defence Forces', w('GR_LEVEL_SWAP', 'County roads', 'County health services', 'Water points in the county'), 'Defence is a national function.'),
  ], { h: ['Is the service local or national?', 'Counties: local health, roads, markets. National: defence, teachers.'], s1: 'Match the story to a level of government.' })),

  // ---------------------------------------------------------------- PR_KEYWORDS
  fam('pr.kw.which', `${PR}PR_KEYWORDS`, 'direct', 1, choose([
    Q('Where in the Constitution of Kenya is the preamble?', 'At the beginning, as the opening statement', w('PR_WHAT', 'At the end, as the last words', 'In the middle, as chapter ten', 'In the schedules at the back'), 'Pre means before. The preamble comes first.'),
    Q('In the preamble, who holds the sovereign power?', 'The people of Kenya', w('PR_SOVEREIGN_WHO', 'The President of Kenya', 'The Parliament of Kenya', 'The Chief Justice of Kenya'), 'The preamble begins: We, the people of Kenya.'),
    Q('Which of these is a key word in the preamble?', 'Democracy', w('PR_WHAT', 'Tractor', 'Cement', 'Football'), 'Democracy is one of the values named in the preamble.'),
    Q('Which of these is a key word in the preamble?', 'Heritage', w('PR_WHAT', 'Mobile', 'Banking', 'Machine'), 'The preamble speaks of the environment as our heritage.'),
    Q('Which of these is NOT a value named in the preamble?', 'Corruption', w('PR_WHAT', 'Social justice', 'Equality', 'Freedom'), 'The preamble names justice, equality and freedom among its values.'),
  ], { h: ['Think of the first words of the Constitution.', 'The preamble names values such as democracy, equality and freedom.'], s1: 'Recall the preamble.' })),
  fam('pr.kw.story', `${PR}PR_KEYWORDS`, 'word', 2, choose([
    Q('The Constitution starts with the words "We, the people of Kenya". What does this show?', 'The people of Kenya hold the power', w('PR_SOVEREIGN_WHO', 'The President holds all the power', 'Parliament holds all the power', 'The courts hold all the power'), 'Sovereign power belongs to the people.'),
    Q('A learner looks for the opening statement of the Constitution. What is it called?', 'The preamble', w('PR_WHAT', 'The schedule', 'The chapter', 'The amendment'), 'The preamble is the opening statement.'),
    Q('Which word in the preamble means the power of the people to rule themselves?', 'Sovereign', w('PR_SOVEREIGN_WHO', 'Heritage', 'Diversity', 'Aspirations'), 'Sovereign means holding the supreme power.'),
    Q('Which word in the preamble speaks of differences between people such as tribe and religion?', 'Diversity', w('PR_WHAT', 'Sovereign', 'Indivisible', 'Supremacy'), 'The preamble is proud of our ethnic, cultural and religious diversity.'),
    Q('Which word in the preamble says Kenya is one nation that cannot be split?', 'Indivisible', w('PR_INDIVISIBLE', 'Diversity', 'Heritage', 'Aspirations'), 'Indivisible means cannot be divided.'),
  ], { h: ['Which word of the preamble fits the clue?', 'Sovereign, diversity, indivisible, heritage.'], s1: 'Match the clue to the key word.' })),

  // ---------------------------------------------------------------- PR_MEANING
  fam('pr.me.which', `${PR}PR_MEANING`, 'direct', 1, choose([
    Q('What does indivisible mean?', 'Cannot be divided', w('PR_INDIVISIBLE', 'Divided into counties', 'Shared by a few people', 'Taken apart each year'), 'Kenya is one indivisible nation.'),
    Q('What is heritage?', 'What we receive from the past and pass on', w('PR_HERITAGE', 'Money kept in a bank', 'A new house for a family', 'A gift from a friend'), 'Our heritage includes the environment and culture we hand on.'),
    Q('What does sovereign mean?', 'Having the highest power over oneself', w('PR_INDIVISIBLE', 'Having no power at all', 'Having power only over a county', 'Having power given by a foreign state'), 'Sovereign means supreme power.'),
    Q('What does diversity mean?', 'The differences among people in a country', w('PR_HERITAGE', 'Everyone being exactly the same', 'A group of people in a market', 'A kind of law in the courts'), 'Diversity is difference, such as of tribe and religion.'),
    Q('What does the rule of law mean?', 'Everyone, even leaders, must obey the law', w('PR_INDIVISIBLE', 'Only ordinary people obey the law', 'Leaders can break any law they wish', 'Laws apply only in the capital'), 'No one is above the law.'),
  ], { h: ['Break the word into parts: in-divisible, here-ditary.', 'Use the meaning in the preamble.'], s1: 'Recall the meaning of the word.' })),
  fam('pr.me.story', `${PR}PR_MEANING`, 'word', 2, choose([
    Q('Learners say Kenya has many tribes and religions yet is one nation. Which preamble idea is this?', 'Pride in our diversity and our unity', w('PR_HERITAGE', 'Only one tribe and one religion', 'Division of the country', 'Foreign power over Kenya'), 'Kenya is proud of its diversity and unity.'),
    Q('Grandfather says we should look after the forests for our grandchildren. Which preamble idea is this?', 'Respecting the environment as our heritage', w('PR_HERITAGE', 'Cutting every tree down for sale', 'Selling all of the forests for profit', 'Forgetting the generations to come'), 'The preamble says to sustain the environment for future generations.'),
    Q('A teacher says the president must obey the law like everyone else. Which idea is this?', 'The rule of law', w('PR_INDIVISIBLE', 'Rule by one man alone', 'Rule by the strongest', 'Rule by the oldest'), 'Everyone is equal before the law.'),
    Q('A child asks why we learn the preamble. What is the best answer?', 'It states the aims and values of the Constitution', w('PR_WHAT', 'It lists all the school fees paid', 'It lists the names of all counties', 'It gives the budget of the year'), 'The preamble sums up the spirit of the Constitution.'),
    Q('Which phrase in the preamble means that all people should get equal and just treatment?', 'Social justice and equality', w('PR_HERITAGE', 'The supremacy of a few leaders', 'The power of the rich over the poor', 'The rule of the strongest men'), 'Equality and social justice mean fair treatment.'),
  ], { h: ['Which preamble idea does the story show?', 'Diversity, heritage, rule of law and fairness.'], s1: 'Match the story to a preamble idea.' })),
  fam('pr.me.spot', `${PR}PR_MEANING`, 'spot', 3, spot([
    S('Allan says indivisible means divided into counties. Which step has the mistake?', ['Step 1: Allan knows Kenya has counties.', '!Step 2: He says in means into.', 'Step 3: He writes divided into counties.'], 'Indivisible means cannot be divided. Kenya is one nation.', 'PR_INDIVISIBLE'),
    S('Brenda says heritage is money in the bank. Which step has the mistake?', ['Step 1: Brenda has heard of inheritance.', '!Step 2: She says inheritance means only money.', 'Step 3: She writes money in the bank.'], 'Heritage is what we receive from the past and hand on, such as culture and the environment.', 'PR_HERITAGE'),
    S('Duncan says the preamble is the last part of the Constitution. Which step has the mistake?', ['Step 1: Duncan has a copy of the Constitution.', '!Step 2: He says the opening statement is at the back.', 'Step 3: He writes the end.'], 'The preamble is at the beginning. Pre means before.', 'PR_WHAT'),
    S('Janet says the President holds the sovereign power in the preamble. Which step has the mistake?', ['Step 1: Janet reads the word sovereign.', '!Step 2: She says the leader holds the power.', 'Step 3: She writes the President.'], 'The preamble begins with We, the people of Kenya. The people hold sovereign power.', 'PR_SOVEREIGN_WHO'),
    S('Stephen says an indivisible country can be split into two. Which step has the mistake?', ['Step 1: Stephen reads indivisible.', '!Step 2: He says indivisible means able to split.', 'Step 3: He writes can be split.'], 'Indivisible means that it cannot be divided.', 'PR_INDIVISIBLE'),
  ], { h: ['Which step gives a wrong meaning of the word?', 'Use the parts of the word and its use in the preamble.'], s1: 'Check each step against the word meanings.' })),
];
