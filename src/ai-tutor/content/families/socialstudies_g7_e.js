// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART E: the scramble for Africa, the Constitution of Kenya and human rights (10 skills).
// Written offline from the KICD design through the curriculum map. The history of the scramble and colonial rule is told as
// commonly taught and stays "to confirm by a teacher". Options are about the same length so the right answer is never the longest.
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const PD = 'POLITI.POLITICAL_DEVELOPMENT_IN.', CK = 'POLITI.THE_CONSTITUTION_OF_KENY.', HR = 'POLITI.HUMAN_RIGHTS.';

export const FAMILIES = [
  // ---------------------------------------------------------------- PD_SCRAMBLE
  fam('pd.sc.which', `${PD}PD_SCRAMBLE`, 'direct', 1, choose([
    Q('Who decided how Africa was divided at Berlin?', 'European powers', w('PD_ASK_AFRICANS', 'African leaders', 'The people of Africa together', 'Traders from Asia'), 'European powers decided. No African leaders were at the table.'),
    Q('What was a role of missionaries in the scramble?', 'They opened stations and schools and often prepared the way', w('PD_MISSION_ONLY', 'They had no part at all', 'They fought all the wars', 'They closed down all the mission schools and stations'), 'Missionaries brought schools and religion, and in many places prepared the way for colonial rule.'),
    Q('What did explorers do in the scramble?', 'Mapped routes and reported on resources', w('PD_ASK_AFRICANS', 'Signed the treaty at Berlin for Africa', 'Ran the colonial courts', 'Built the railways'), 'Explorers mapped Africa and reported what they found.'),
    Q('Why did European countries want African land?', 'For raw materials, markets and national pride', w('PD_ASK_AFRICANS', 'Because the African leaders invited them in', 'To end all trade', 'To protect Africa from Asia'), 'Industry needed raw materials and markets.'),
    Q('What did chartered companies, such as the Imperial British East Africa Company, do?', 'Set up trade and signed treaties for their country', w('PD_MISSION_ONLY', 'Built schools only', 'Helped to free all the slaves in the land only', 'Fought against Britain'), 'Companies traded and prepared the way for rule.'),
  ], { h: ['Europeans took part as explorers, missionaries, traders and officers.', 'Africans were not asked.'], s1: 'Think of who took part.' })),
  fam('pd.sc.story', `${PD}PD_SCRAMBLE`, 'word', 2, choose([
    Q('A learner says Africans invited the Europeans to divide Africa. What is the correct reply?', 'The Europeans decided without Africans', w('PD_ASK_AFRICANS', 'The learner is right about all of this', 'Africans drew the map', 'Africans signed at Berlin'), 'No African leader was invited.'),
    Q('A mission station teaches reading and also supports the colonial officer. What does this show?', 'Missionaries often prepared the way for colonial rule', w('PD_MISSION_ONLY', 'Missionaries were always against colonial rule', 'Missionaries had no effect', 'Missionaries ended all trade'), 'Their work often helped colonial rule.'),
    Q('Factories in Europe needed cotton and rubber. How did this affect Africa?', 'It made Europeans want African raw materials', w('PD_ASK_AFRICANS', 'It made them leave Africa alone', 'It made Africans sell machines', 'It stopped all trade'), 'Raw materials drew them to Africa.'),
    Q('Which group first reported on the lakes and rivers of East Africa?', 'European explorers', w('PD_ASK_AFRICANS', 'Colonial soldiers', 'Colonial judges', 'Colonial teachers'), 'Explorers were among the first to map and report on routes.'),
    Q('Why did national pride matter in the scramble?', 'Countries wanted more colonies than their rivals', w('PD_ASK_AFRICANS', 'They wanted to share equally with Africans', 'They wanted no land at all', 'They wanted to close trade'), 'Rival powers competed for colonies.'),
  ], { h: ['Which group took part, and what did they do?', 'Explorers, missionaries, traders and officers.'], s1: 'Think of which group did what.' })),

  // ---------------------------------------------------------------- PD_BERLIN
  fam('pd.be.which', `${PD}PD_BERLIN`, 'direct', 1, choose([
    Q('What did the Berlin Conference decide?', 'Rules for claiming African land', w('PD_BERLIN_DIVIDED', 'Exact borders for every African country', 'That Africans should rule themselves', 'That Africa should stay free'), 'Berlin set the rules. Borders were drawn later.'),
    Q('Who attended the Berlin Conference?', 'European powers, with the United States as an observer', w('PD_BERLIN_AFRICANS', 'African chiefs and Europeans', 'Only African kings', 'Only Asian rulers'), 'No African leaders were invited.'),
    Q('Which German leader hosted the conference?', 'Otto von Bismarck', w('PD_BERLIN_DIVIDED', 'Kaiser Wilhelm II', 'Adolf Hitler', 'Napoleon'), 'Bismarck hosted the conference in 1884 to 1885.'),
    Q('What did the rule of effective occupation say?', 'A power must really control a region to claim it', w('PD_BERLIN_DIVIDED', 'A power could claim any land by writing it down', 'A power could never claim land', 'Africans could claim any land'), 'Effective occupation meant real control.'),
    Q('Which two rivers did Berlin open to trade?', 'The Congo and the Niger', w('PD_BERLIN_DIVIDED', 'The Nile and the Zambezi', 'The Limpopo and the Tana', 'The Orange and the Senegal'), 'The Congo and Niger were opened to trade.'),
  ], { h: ['Berlin 1884 to 1885: European rules for claiming land.', 'No Africans were invited.'], s1: 'Think of who was there and what was set.' })),
  fam('pd.be.story', `${PD}PD_BERLIN`, 'word', 2, choose([
    Q('A learner says the whole of Africa was divided at Berlin. What is more correct?', 'Berlin set rules, and borders were drawn after', w('PD_BERLIN_DIVIDED', 'Every border was drawn at the Berlin talks', 'Berlin gave Africa independence', 'Berlin ended the scramble'), 'Borders were drawn in later agreements.'),
    Q('Why is it unfair that no African leaders attended?', 'Decisions about Africa were made without Africans', w('PD_BERLIN_AFRICANS', 'Africans did not want to go', 'Africans were at the table', 'Africa had no leaders'), 'Africans had no say.'),
    Q('Which year did the Berlin Conference begin?', '1884', w('PD_BERLIN_DIVIDED', '1914', '1963', '1805'), 'It began in 1884 and ended in 1885.'),
    Q('A country said it owned a coast but had no officers there. Under Berlin rules, what was needed?', 'Effective occupation of the land', w('PD_BERLIN_DIVIDED', 'A letter from an African leader', 'A larger navy only', 'Nothing more'), 'Real control was needed.'),
    Q('Which country was the host of the Berlin Conference?', 'Germany', w('PD_BERLIN_AFRICANS', 'Kenya', 'Egypt', 'Portugal only'), 'Germany hosted it.'),
  ], { h: ['Think of what Berlin decided and who was missing.', 'Rules for claims, no Africans.'], s1: 'Think of the rules and the people.' })),

  // ---------------------------------------------------------------- PD_IMPLICATIONS
  fam('pd.im.which', `${PD}PD_IMPLICATIONS`, 'direct', 1, choose([
    Q('Which is a harm of colonial rule?', 'Loss of land and independence', w('PD_ALL_GOOD', 'More freedom for Africans', 'Lower taxes for Africans', 'Less forced labour'), 'Colonial rule took land and independence.'),
    Q('What did colonial borders do to communities?', 'Split some communities and joined others', w('PD_BORDERS_FAIR', 'Kept each community together', 'Followed the homes of every people', 'Made all communities equal'), 'Borders were drawn without regard to peoples.'),
    Q('Who did the colonial railways mainly serve?', 'The colonial economy', w('PD_ALL_GOOD', 'African farmers alone', 'African schools', 'Local markets only'), 'Railways carried raw materials to ports.'),
    Q('What did colonial taxes force many Africans to do?', 'Work for wages or grow cash crops', w('PD_ALL_GOOD', 'Stop all work', 'Move to Europe', 'Close markets'), 'Taxes in money pushed people to earn.'),
    Q('Which crop was grown for export under colonial rule?', 'Coffee', w('PD_ALL_GOOD', 'Cassava only', 'Millet only', 'Yams only'), 'Cash crops such as coffee and tea were grown for export.'),
  ], { h: ['Think of who gained and who lost.', 'Colonial rule took land and independence.'], s1: 'Think of who gained and who lost.' })),
  fam('pd.im.story', `${PD}PD_IMPLICATIONS`, 'word', 2, choose([
    Q('A community lives on both sides of a colonial border. What happened to it?', 'It was split between two colonies', w('PD_BORDERS_FAIR', 'It was kept together', 'It was made bigger', 'It was given its full independence'), 'Many peoples were split by borders.'),
    Q('A learner says colonial rule brought only benefits. What is a better reply?', 'It brought some changes but also harm', w('PD_ALL_GOOD', 'The learner is right about all of this', 'It brought nothing at all', 'It brought only harm and no change'), 'Colonial rule had mixed effects.'),
    Q('Forced labour on settler farms was one effect. What was it?', 'A harm to African people', w('PD_ALL_GOOD', 'A benefit to African people', 'A game', 'A payment'), 'Forced labour was harmful.'),
    Q('Schools and hospitals were built, but mostly for what purpose?', 'To support colonial interests', w('PD_ALL_GOOD', 'To end colonial rule', 'To close missions', 'To stop trade'), 'Many services served colonial interests.'),
    Q('Local culture and languages under colonial rule were...', 'Often looked down on', w('PD_ALL_GOOD', 'Always protected', 'Taught to all Europeans', 'Made the official language'), 'Colonial rule often belittled local culture.'),
  ], { h: ['Think of effects on land, work, borders and culture.', 'Mixed effects, but great harm.'], s1: 'Think of effects on people.' })),

  // ---------------------------------------------------------------- PD_NEO
  fam('pd.ne.which', `${PD}PD_NEO`, 'direct', 1, choose([
    Q('What is neo-colonialism?', 'Control of a free country through money, trade and debt', w('PD_NEO_SAME', 'Direct rule by a foreign army and foreign officers', 'A new kind of school', 'A treaty between friends'), 'A free country is still controlled by others through money.'),
    Q('Which helps to end neo-colonialism?', 'Honest, accountable leaders', w('PD_NEO_CORRUPT', 'Taking bribes from foreign firms', 'Selling all resources cheaply', 'Hiding the budget'), 'Honest government keeps resources for the people.'),
    Q('Which is an example of good governance?', 'Publishing how public money is spent', w('PD_NEO_CORRUPT', 'Hiding how public money is spent', 'Giving contracts to friends', 'Ignoring court orders'), 'Transparency is good governance.'),
    Q('Why can a large debt lead to neo-colonialism?', 'The lender may control how the country is run', w('PD_NEO_SAME', 'The debt makes the whole country much richer', 'The debt ends all trade', 'The debt is never paid'), 'Debt can give the lender power.'),
    Q('Which builds a country\'s freedom?', 'Making goods at home and trading fairly', w('PD_NEO_CORRUPT', 'Selling raw materials to other countries only', 'Taking only loans', 'Closing all factories'), 'Local industry makes a country stronger.'),
  ], { h: ['Neo means new. The control is by money, not by an army.', 'Good governance helps.'], s1: 'Think of money and control.' })),
  fam('pd.ne.story', `${PD}PD_NEO`, 'word', 2, choose([
    Q('A country owes a huge debt and must follow the lender\'s orders on its budget. Which is this?', 'Neo-colonialism', w('PD_NEO_SAME', 'Direct colonial rule', 'Independence', 'Regional cooperation'), 'The country is free in name only.'),
    Q('Officials take bribes to give mining rights cheaply to a foreign company. What does this do?', 'It weakens the country and helps neo-colonialism', w('PD_NEO_CORRUPT', 'It strengthens the country and its people at home', 'It ends neo-colonialism', 'It helps citizens equally'), 'Corruption lets outsiders take the country\'s wealth.'),
    Q('Which action by citizens helps good governance?', 'Voting and asking leaders to account', w('PD_NEO_CORRUPT', 'Selling votes', 'Staying silent when leaders steal money', 'Paying bribes'), 'Active citizens hold leaders to account.'),
    Q('A learner says neo-colonialism is the same as colonialism. What is the difference?', 'There are no foreign officers, but money still controls', w('PD_NEO_SAME', 'There is no difference', 'Neo-colonialism has foreign armies and foreign officers', 'Neo-colonialism is older'), 'It is control by money and trade.'),
    Q('A country builds its own factories to process coffee. How does this help?', 'It keeps more of the value at home', w('PD_NEO_CORRUPT', 'It sends all the profit abroad', 'It ends all trade', 'It makes the debt larger'), 'Processing locally keeps value in the country.'),
  ], { h: ['Is the control by an army or by money and trade?', 'Good governance and local industry help.'], s1: 'Think of money, debt and control.' })),

  // ---------------------------------------------------------------- CK_IMPORTANCE
  fam('ck.im.which', `${CK}CK_IMPORTANCE`, 'direct', 1, choose([
    Q('Which is the supreme law of Kenya?', 'The Constitution', w('CK_AUTHORITY', 'The President\'s word', 'A decision of a chief', 'The rules of a school'), 'The Constitution is supreme. Everyone must obey it.'),
    Q('When was the current Constitution promulgated?', '27 August 2010', w('CK_DATE_MIX', '12 December 1963', '1 June 1963', '12 December 2010'), 'It was promulgated on 27 August 2010.'),
    Q('Which part of the Constitution lists the rights of every person?', 'The Bill of Rights', w('CK_AUTHORITY', 'The preamble', 'The schedules', 'The index'), 'Chapter Four is the Bill of Rights.'),
    Q('Who must obey the Constitution?', 'Every person and every leader', w('CK_AUTHORITY', 'Only citizens', 'Only the poor', 'Only the police'), 'Everyone, including the President, must obey it.'),
    Q('What does the Constitution share between the national and county governments?', 'Power and duties', w('CK_DATE_MIX', 'Only money', 'Only land', 'Only schools'), 'Devolution shares power with the counties.'),
  ], { h: ['The Constitution is the highest law.', 'Promulgated on 27 August 2010.'], s1: 'Think of the highest law.' })),
  fam('ck.im.story', `${CK}CK_IMPORTANCE`, 'word', 2, choose([
    Q('A leader says he is above the Constitution. What is the correct reply?', 'Everyone, including leaders, must obey it', w('CK_AUTHORITY', 'He is right', 'Only the President of Kenya may break it', 'It is only a guide'), 'The Constitution is supreme.'),
    Q('A learner says the Constitution was promulgated at independence. What is correct?', 'Independence was in 1963 and the Constitution in 2010', w('CK_DATE_MIX', 'Both were in 1963, on the day of independence', 'Both were in 2010 after the election', 'Neither of them has a date at all'), 'Independence was 12 December 1963. The present Constitution came in 2010.'),
    Q('A woman is denied a job only because of her gender. Which part of the Constitution protects her?', 'The Bill of Rights', w('CK_AUTHORITY', 'The preamble only', 'The county laws only', 'The school rules'), 'The Bill of Rights guarantees equality.'),
    Q('Why does a country need a constitution?', 'To set out rights and how it is governed', w('CK_AUTHORITY', 'To give the leader power over everyone', 'To stop all elections', 'To close schools'), 'It sets out rights and the structure of government.'),
    Q('Which is protected by the Constitution?', 'The right of every person to life and dignity', w('CK_DATE_MIX', 'The wealth of leaders only', 'The land that belongs to rich people only', 'The names of towns'), 'Rights belong to everyone.'),
  ], { h: ['The Constitution binds everyone.', 'It protects rights and organises government.'], s1: 'Think of who must obey it.' })),

  // ---------------------------------------------------------------- CK_UPHOLD
  fam('ck.up.which', `${CK}CK_UPHOLD`, 'direct', 1, choose([
    Q('Which action upholds the Constitution?', 'Voting in elections', w('CK_BRIBE_OK', 'Giving a bribe to a police officer', 'Ignoring court orders', 'Using hate speech'), 'Voting is a way of taking part.'),
    Q('Which action breaks the values of the Constitution?', 'Giving a bribe to a police officer', w('CK_BRIBE_OK', 'Paying taxes', 'Voting', 'Reporting corruption to the police'), 'Bribes break the rule of law and integrity.'),
    Q('Who must protect the Constitution?', 'Every citizen', w('CK_ONLY_LEADERS', 'Only leaders', 'Only judges', 'Only the police'), 'Every citizen has a duty.'),
    Q('Which helps to protect the Constitution?', 'Learning what it says', w('CK_ONLY_LEADERS', 'Leaving it to leaders', 'Ignoring it', 'Hiding it'), 'Knowing the Constitution helps citizens protect it.'),
    Q('What should a citizen do on seeing corruption?', 'Report it to the right office', w('CK_BRIBE_OK', 'Join in', 'Ignore it and keep quiet for ever', 'Demand a share'), 'Reporting corruption protects the Constitution.'),
  ], { h: ['Every citizen has a duty.', 'Obey the law and refuse bribes.'], s1: 'Think of what every citizen can do.' })),
  fam('ck.up.story', `${CK}CK_UPHOLD`, 'word', 2, choose([
    Q('A driver offers a small bribe to a traffic officer. What does the officer who accepts do?', 'Breaks the rule of law', w('CK_BRIBE_OK', 'Helps the country', 'Upholds the Constitution', 'Does no harm at all'), 'Even a small bribe breaks the law.'),
    Q('A learner says only leaders must protect the Constitution. What is a better reply?', 'Every citizen must protect it', w('CK_ONLY_LEADERS', 'The learner is right about all of this', 'Only judges must', 'Nobody must'), 'Everyone has a duty.'),
    Q('Which is a way learners can uphold the Constitution?', 'Respecting the rights of classmates', w('CK_BRIBE_OK', 'Bribing teachers for marks', 'Ignoring school rules', 'Bullying others'), 'Respecting rights upholds the Constitution.'),
    Q('Which action shows respect for the law?', 'Obeying a court order', w('CK_BRIBE_OK', 'Ignoring a court order', 'Tearing a notice', 'Hiding from the court'), 'Obeying the courts upholds the rule of law.'),
    Q('Why do citizens pay taxes?', 'To fund services for all', w('CK_ONLY_LEADERS', 'To make leaders rich', 'To avoid the law', 'To close schools'), 'Taxes pay for roads, schools and hospitals.'),
  ], { h: ['Choose the action that respects law and rights.', 'Every citizen has a duty.'], s1: 'Choose the lawful action.' })),

  // ---------------------------------------------------------------- CK_VALUES
  fam('ck.va.which', `${CK}CK_VALUES`, 'direct', 1, choose([
    Q('Which is a national value in the Constitution?', 'Integrity', w('CK_VALUE_MIX', 'Wealth', 'Fame', 'Power over other people'), 'Integrity is a national value.'),
    Q('What is patriotism?', 'Love and loyalty to your country', w('CK_PATRIOT_BLIND', 'Saying other countries are bad', 'Leaving your country', 'Hating other people'), 'Patriotism is love for your country without hate for others.'),
    Q('Which is a national value?', 'Sharing and devolution of power', w('CK_VALUE_MIX', 'Keeping power in one place', 'Winning at any cost', 'Collecting money only'), 'Sharing and devolution of power is a value.'),
    Q('Which value is shown by telling the truth and being honest with public money?', 'Integrity', w('CK_VALUE_MIX', 'Fame', 'Wealth', 'Strength'), 'Integrity means honesty.'),
    Q('Which value says that everyone gets a just share?', 'Equity and social justice', w('CK_VALUE_MIX', 'Wealth', 'Power over other people', 'Fame'), 'Equity and social justice mean fairness.'),
  ], { h: ['The national values are in Article 10.', 'Integrity, unity, equity, democracy and more.'], s1: 'Recall the values of Article 10.' })),
  fam('ck.va.story', `${CK}CK_VALUES`, 'word', 2, choose([
    Q('Mercy finds a lost wallet and returns it. Which value does she show?', 'Integrity', w('CK_VALUE_MIX', 'Fame', 'Wealth', 'Power over other people'), 'She shows honesty.'),
    Q('Learners of different communities work in one team and respect each other. Which value is this?', 'National unity', w('CK_VALUE_MIX', 'Wealth', 'Competition', 'Fame'), 'Working together shows national unity.'),
    Q('A learner says patriotism means saying other countries are bad. What is wrong?', 'Patriotism is love for your country, not hate for others', w('CK_PATRIOT_BLIND', 'Nothing is wrong', 'Patriotism is hating foreigners and other countries', 'Patriotism is leaving the country'), 'Patriotism does not mean hating others.'),
    Q('A school lets all learners vote for class leaders. Which value is this?', 'Democracy and participation', w('CK_VALUE_MIX', 'Wealth', 'Power for one person only', 'Fame'), 'Voting shows democracy.'),
    Q('Why must public money be spent openly?', 'Transparency and accountability', w('CK_VALUE_MIX', 'Wealth and fame for the leaders', 'Power and secrecy', 'Strength and speed'), 'Open spending shows transparency.'),
  ], { h: ['Match the action to a national value.', 'Honesty is integrity. Voting is democracy.'], s1: 'Match action and value.' })),

  // ---------------------------------------------------------------- HR_CLASSIFY
  fam('hr.cl.which', `${HR}HR_CLASSIFY`, 'direct', 1, choose([
    Q('Which is a civil and political right?', 'The right to vote', w('HR_VOTE_SOCIAL', 'The right to education', 'The right to health', 'The right to a clean environment'), 'Voting is a political right.'),
    Q('Which is an economic, social and cultural right?', 'The right to education', w('HR_VOTE_SOCIAL', 'The right to vote', 'The right to free speech', 'The right to a fair trial'), 'Education is a social right.'),
    Q('Which was adopted by the United Nations in 1948?', 'The Universal Declaration of Human Rights', w('HR_UDHR_KENYA', 'The African Charter on Human and Peoples\' Rights', 'The Constitution of Kenya', 'The Treaty of Berlin'), 'The UDHR was adopted in 1948.'),
    Q('Which instrument was adopted by African states in 1981?', 'The African Charter on Human and Peoples\' Rights', w('HR_UDHR_KENYA', 'The Universal Declaration of Human Rights', 'The Berlin Act', 'The Magna Carta'), 'The African Charter was adopted in 1981.'),
    Q('Which chapter of the Constitution of Kenya is the Bill of Rights?', 'Chapter Four', w('HR_UDHR_KENYA', 'Chapter One', 'Chapter Ten', 'Chapter Fifteen'), 'Chapter Four is the Bill of Rights.'),
  ], { h: ['Political rights are about taking part. Social rights are about needs.', 'UDHR 1948. African Charter 1981.'], s1: 'Sort the right into its group.' })),
  fam('hr.cl.story', `${HR}HR_CLASSIFY`, 'word', 2, choose([
    Q('Mercy is allowed to join a peaceful protest. Which group is her right in?', 'Civil and political rights only', w('HR_VOTE_SOCIAL', 'Economic, social and cultural rights', 'Group rights', 'No group'), 'Free assembly is a civil and political right.'),
    Q('A child has the right to see a doctor when ill. Which group is this?', 'Economic, social and cultural rights', w('HR_VOTE_SOCIAL', 'Civil and political rights only', 'No group', 'Group rights'), 'Health is a social right.'),
    Q('A community has the right to a clean and healthy environment. Which group is this?', 'Group or peoples\' rights', w('HR_VOTE_SOCIAL', 'Political rights', 'Civil rights only', 'No group'), 'A clean environment is a group right.'),
    Q('Which body of the United Nations adopted the Universal Declaration of Human Rights?', 'The United Nations General Assembly', w('HR_UDHR_KENYA', 'The African Union', 'The East African Community Council', 'The Kenyan Parliament'), 'The UN General Assembly adopted it.'),
    Q('Which instrument is Kenya\'s own law on rights?', 'The Bill of Rights in the Constitution', w('HR_UDHR_KENYA', 'The Berlin Act', 'The African Charter and nothing else', 'The school rules'), 'The Bill of Rights is part of Kenya\'s Constitution.'),
  ], { h: ['Is the right about taking part, about needs, or about a group?', 'Sort it into its group.'], s1: 'Sort the right into its group.' })),

  // ---------------------------------------------------------------- HR_EQUITY
  fam('hr.eq.which', `${HR}HR_EQUITY`, 'direct', 1, choose([
    Q('What is equity?', 'Everyone gets what is fair for their need', w('HR_EQUAL_EQUITY', 'Everyone gets exactly the same amount', 'Some people get more', 'Nobody gets anything'), 'Equity gives what each person needs to be treated fairly.'),
    Q('Can human rights be taken away?', 'No, they belong to everyone', w('HR_EARNED', 'Yes, if a person is naughty', 'Yes, if a person is poor', 'Yes, if a person is young'), 'Human rights are inalienable.'),
    Q('What does it mean that human rights are universal?', 'They belong to all people everywhere', w('HR_EARNED', 'They belong to only the rich people', 'They belong only to adults', 'They belong only to citizens'), 'Universal means for all people.'),
    Q('What is discrimination?', 'Unfair treatment because of who a person is', w('HR_EQUAL_EQUITY', 'Treating everyone the same at all times', 'Helping a person in need', 'Following the law'), 'Discrimination is unfair treatment.'),
    Q('Which is true about rights?', 'They are not earned by good behaviour', w('HR_EARNED', 'They must be earned by good deeds', 'They can be bought', 'They end at age ten'), 'Rights are not earned.'),
  ], { h: ['Equality is the same for all. Equity is fair for each need.', 'Rights belong to everyone.'], s1: 'Think of fairness and need.' })),
  fam('hr.eq.story', `${HR}HR_EQUITY`, 'word', 2, choose([
    Q('A learner cannot see the board well. The teacher gives her a seat near the front. What is this?', 'Equity', w('HR_EQUAL_EQUITY', 'Equality only', 'Discrimination', 'Punishment'), 'She gets what she needs.'),
    Q('Every learner is given shoes of the same size, though people differ in size. What is wrong?', 'It is equal but not fair for each need', w('HR_EQUAL_EQUITY', 'Nothing is wrong', 'It is equity', 'It is a right'), 'Equity gives what fits each need.'),
    Q('A boy says a child who steals loses all rights. What is the reply?', 'Human rights cannot be taken away', w('HR_EARNED', 'He is right', 'Rights end with a mistake', 'Rights are for good people only'), 'Rights belong to everyone.'),
    Q('A shop refuses to serve a person because of her tribe. What is this?', 'Discrimination', w('HR_EQUAL_EQUITY', 'Equity', 'Equality', 'A right'), 'Unfair treatment because of tribe is discrimination.'),
    Q('Which shows solidarity?', 'Standing with a group who are treated unfairly', w('HR_EARNED', 'Laughing at the group', 'Ignoring the group', 'Joining in with those who are being unfair'), 'Solidarity means standing together.'),
  ], { h: ['Equity gives what each person needs.', 'Discrimination is unfair treatment.'], s1: 'Think of need and fairness.' }), 'c'),

  // ---------------------------------------------------------------- HR_ACTION
  fam('hr.ac.which', `${HR}HR_ACTION`, 'direct', 1, choose([
    Q('A classmate walks with a stick and others laugh at him. What should you do?', 'Stand by him and say it is wrong', w('HR_JOIN_TEASE', 'Laugh too', 'Walk away from him without a word', 'Tease him quietly'), 'Teasing breaks human dignity. Speak up.'),
    Q('Who can protect human rights?', 'Everyone', w('HR_NOT_MY_BUSINESS', 'Only the police', 'Only judges', 'Only the government'), 'Everyone, including children, can protect rights.'),
    Q('A girl is not allowed to play football because she is a girl. What is the right action?', 'Speak up so that she can play', w('HR_NOT_MY_BUSINESS', 'Say it is not your business', 'Agree with the teasing', 'Stop playing too'), 'Everyone has the right to play.'),
    Q('What should you do if you see a child being abused?', 'Tell a trusted adult or report it', w('HR_NOT_MY_BUSINESS', 'Say nothing to anyone about it', 'Join in', 'Laugh'), 'Report abuse to protect the child.'),
    Q('Why do human rights matter?', 'They protect the dignity of every person', w('HR_NOT_MY_BUSINESS', 'They protect only the rich', 'They protect only the leaders of a country', 'They protect only adults'), 'Rights protect everyone\'s dignity.'),
  ], { h: ['Choose the action that protects dignity.', 'Speak up, include and report.'], s1: 'Choose the action that protects dignity.' })),
  fam('hr.ac.story', `${HR}HR_ACTION`, 'word', 2, choose([
    Q('A new learner speaks a different language and is left out of games. What should you do?', 'Invite her to join and show her the game', w('HR_JOIN_TEASE', 'Tease her accent', 'Leave her alone', 'Tell all the other learners to avoid her'), 'Including others respects their dignity.'),
    Q('Peter calls a classmate with a disability a bad name. You hear it. What is the best action?', 'Tell Peter it is hurtful and support your classmate', w('HR_JOIN_TEASE', 'Join Peter', 'Ignore it and say nothing to anyone else at all', 'Laugh quietly'), 'Speaking up stops discrimination.'),
    Q('A friend says defending rights is only for the police. What is a better reply?', 'We can all stand up for rights', w('HR_NOT_MY_BUSINESS', 'You are right', 'Rights do not need defending', 'Children cannot help'), 'Everyone can protect rights.'),
    Q('Which shows equity in class?', 'Giving extra help to a learner who needs it', w('HR_JOIN_TEASE', 'Teasing the slow learner', 'Ignoring the slow learner', 'Giving all of the help to the fastest'), 'Equity gives help where it is needed.'),
    Q('A girl is told she cannot be a class leader because she is a girl. What is this?', 'Discrimination that must be challenged', w('HR_NOT_MY_BUSINESS', 'A fair rule', 'A normal tradition', 'A choice made by the whole class'), 'It is unfair and should be challenged.'),
  ], { h: ['Choose the action that respects dignity and includes everyone.', 'Speak up and include.'], s1: 'Choose the action that includes everyone.' })),
];
