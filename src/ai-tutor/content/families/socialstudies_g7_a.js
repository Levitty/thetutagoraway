// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART A: personal development, enterprise, human origin and early civilisation (9 skills).
// Written offline from the KICD design through the curriculum map (curriculum/social_studies/g7.json). Every wrong answer names the
// library misconception it reveals. Options of each question are about the same length so the right answer is never the longest.
// Origin stories and the history of ancient kingdoms are told as commonly taught and stay "to confirm by a teacher".
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const SE = 'SOCIAL.SELF_EXPLORATION.', EO = 'SOCIAL.ENTREPRENEURIAL_OPPORTUN.', HO = 'PEOPLE.HUMAN_ORIGIN.', EC = 'PEOPLE.EARLY_CIVILISATION.';
const T = (head, rows) => ({ t: { head, rows } });

export const FAMILIES = [
  // ---------------------------------------------------------------- SE_ABILITIES
  fam('se.ab.which', `${SE}SE_ABILITIES`, 'direct', 1, choose([
    Q('Which of these is an interest?', 'Liking to draw cartoons in free time', w('SE_INTEREST_ABILITY', 'Winning the school drawing contest', 'Drawing a perfect map in a test', 'Being the best artist in the class'), 'An interest is what a person likes to do. A prize shows an ability.'),
    C('SE_TALENT_ONLY', 'Which of these is an ability that needs no stage?', 'Listening well when others speak', ['Winning a prize on stage', 'Being famous in the school', 'Singing in front of a crowd'], 'Abilities are many. Listening, counting and caring all count, not only prizes.'),
    Q('Which shows a talent?', 'Learning a tune on the nyatiti by ear', w('SE_INTEREST_ABILITY', 'Wishing to be a great singer one day', 'Liking to watch music shows at night', 'Being told that music is good for you'), 'A talent is a natural gift. Learning a tune by ear shows one.'),
    C('SE_TALENT_ONLY', 'Mercy fixes broken desks at school with a hammer. What is this?', 'An ability that helps the class', ['A habit that is not useful', 'Not an ability, since it is quiet', 'Only a hobby with no value'], 'Practical skills are abilities too. Not all strengths happen on a stage.'),
    Q('Which is the best way to grow a talent?', 'Practise often and ask for advice', w('SE_INTEREST_ABILITY', 'Wait for it to grow by itself', 'Compare yourself with others daily', 'Stop if it is hard at first'), 'Talents grow with practice and feedback.'),
  ], { h: ['An interest is what you like. An ability is what you can do.', 'Think of strengths that are not only on a stage.'], s1: 'Tell what a person likes from what a person can do.' })),
  fam('se.ab.story', `${SE}SE_ABILITIES`, 'word', 2, choose([
    Q('Amina likes football but has not played much. What is football for her?', 'An interest she can grow into an ability', w('SE_INTEREST_ABILITY', 'A strong ability already', 'A talent that needs no work', 'A skill she has already fully learnt'), 'An interest is what you like. Practice turns it into an ability.'),
    C('SE_TALENT_ONLY', 'Peter is quiet in class, but he explains maths to friends very well. What can we say?', 'He has an ability to teach others', ['He has no abilities to share', 'Only loud learners have abilities', 'He cannot help anyone at all'], 'Explaining is an ability. It does not need to be loud.'),
    Q('Wanjiru learns to knit every day after school and now makes good caps. What did she grow?', 'A skill, through practice', w('SE_INTEREST_ABILITY', 'A wish, through waiting', 'An interest only, by watching', 'A rumour, from a friend'), 'A skill is learnt by practice.'),
    Q('Otieno likes animals and joins the school wildlife club to learn more. What is he doing?', 'Using an interest to grow his abilities', w('SE_INTEREST_ABILITY', 'Hiding his talents from the other members', 'Wasting time in a club', 'Copying what friends do'), 'Clubs help interests grow into abilities.'),
    C('SE_TALENT_ONLY', 'Which learner shows an ability that helps the whole class?', 'Faith, who keeps the class tidy and organised', ['Dan, who only likes watching sport', 'Mary, who is tired most days', 'Kip, who hides all of his work from others'], 'Organising is an ability. It helps the class.'),
  ], { h: ['Ask whether it is something liked or something done well.', 'Practice turns an interest into an ability.'], s1: 'Decide if it is liked, done well or learnt.' })),

  // ---------------------------------------------------------------- SE_VALUES
  fam('se.va.which', `${SE}SE_VALUES`, 'direct', 1, choose([
    Q('Which is a personal value?', 'Honesty', w('SE_VALUES_THINGS', 'A new phone', 'A big house', 'Money in a bank'), 'A value is a belief about what is right. Honesty is a value.'),
    Q('What does a value guide a person to do?', 'Act in the way they believe is right', w('SE_VALUES_THINGS', 'Buy things they like', 'Win every game', 'Look like others'), 'Values guide our actions.'),
    Q('Friends dare Kevin to copy in a test. What does a steady person do?', 'Say no and keep his values', w('SE_VALUES_PEER', 'Copy to please them', 'Copy only once', 'Copy and then say nothing about it'), 'A steady person keeps his values under pressure.'),
    Q('Which value is shown by returning a lost wallet?', 'Integrity', w('SE_VALUES_THINGS', 'Wealth', 'Fame', 'Luck'), 'Returning what is not yours shows integrity.'),
    Q('Which is a value that helps a learner finish hard work?', 'Perseverance', w('SE_VALUES_THINGS', 'A smart bag', 'A loud voice', 'A long pencil'), 'Perseverance means keeping on when it is hard.'),
  ], { h: ['A value is a belief about what is right.', 'Possessions are not values.'], s1: 'Think of beliefs about right and wrong.' })),
  fam('se.va.story', `${SE}SE_VALUES`, 'word', 2, choose([
    Q('Wanjiru tells the truth even though she will be scolded. Which value does she show?', 'Honesty', w('SE_VALUES_THINGS', 'Wealth', 'Speed', 'Fame'), 'Telling the truth shows honesty.'),
    Q('Peers want Otieno to skip class. He refuses politely. What does this show?', 'A steady personality built on his values', w('SE_VALUES_PEER', 'A weak personality', 'A fear of friends', 'A wish to be alone'), 'He keeps his values under pressure.'),
    Q('A learner says her best value is her new shoes. What is a better reply?', 'Values are beliefs such as respect, not things', w('SE_VALUES_THINGS', 'She is right', 'Shoes are a kind of value', 'Only rich learners have any real values'), 'Values are beliefs, not possessions.'),
    Q('Mutua keeps his promise to help clean the class each Friday. Which value does he show?', 'Responsibility', w('SE_VALUES_THINGS', 'Wealth', 'Luck', 'Strength'), 'Keeping promises shows responsibility.'),
    Q('A group makes fun of a new learner. Faith does not join. Which value does she show?', 'Respect', w('SE_VALUES_PEER', 'Fear', 'Pride', 'Jealousy'), 'Refusing to tease shows respect.'),
  ], { h: ['Match the action to the value.', 'Steady people keep their values.'], s1: 'Match the action to the value.' })),

  // ---------------------------------------------------------------- SE_EMOTIONS
  fam('se.em.which', `${SE}SE_EMOTIONS`, 'direct', 1, choose([
    Q('Kamau is angry because a friend broke his pencil. What is the best thing to do?', 'Breathe slowly, then tell his friend what happened', w('SE_REVENGE', 'Break his friend\'s pencil as well', 'Shout at his friend in front of the whole class', 'Hit the desk and refuse to speak'), 'Calm down first, then talk. Hitting back makes things worse.'),
    C('SE_ANGER_BAD', 'Which is true about anger?', 'It is a normal feeling that we must manage', ['It is wrong and must never be felt', 'It should always be hidden for ever', 'It shows that a person is bad'], 'Feeling angry is normal. We learn to manage what we do with it.'),
    Q('Before a test, Njeri feels afraid. Which is a healthy way to cope?', 'Take deep breaths and think of how she prepared', w('SE_ANGER_BAD', 'Pretend that she feels nothing at all', 'Tell herself that she is a failure', 'Run away from the classroom'), 'Deep breaths and good thoughts calm fear.'),
    Q('A learner is very sad because a relative died. What helps?', 'Talk to a trusted adult or a counsellor', w('SE_ANGER_BAD', 'Keep it hidden and never talk about it', 'Stay away from everyone for months', 'Pretend that nothing has happened'), 'Sharing sad feelings with someone we trust helps us heal.'),
    Q('Which is a harmful way to deal with anger?', 'Insulting people until they cry', w('SE_ANGER_BAD', 'Walking away to cool down', 'Writing down how you feel', 'Playing a sport to let off steam'), 'Insults hurt people and the friendship. Calming ways do not.'),
  ], { h: ['A healthy way calms you and does not hurt anyone.', 'Pause, breathe, then talk.'], s1: 'Pick the way that calms and hurts no one.' })),
  fam('se.em.story', `${SE}SE_EMOTIONS`, 'word', 2, choose([
    Q('Brian\'s team lost the match and he is angry. His friends tease him. What should he do?', 'Walk away, calm down and talk later', w('SE_REVENGE', 'Push the boy who teased him', 'Throw the ball at the wall', 'Shout loudly until the teasing stops'), 'Walking away to calm down avoids a fight.'),
    Q('Halima is very happy because she won a prize. A friend is sad that she lost. What shows maturity?', 'Share her joy and comfort her friend kindly', w('SE_ANGER_BAD', 'Boast loudly in front of her friend', 'Ignore her friend completely', 'Hide the prize and say nothing to her friend'), 'We manage our feelings and think of the feelings of others.'),
    Q('Mutua feels angry with his sister. He writes how he feels in his book and later speaks to her. What did he do?', 'Managed his anger in a healthy way', w('SE_REVENGE', 'Lost control of his anger', 'Hid the anger for ever', 'Passed the anger to his sister'), 'Writing and then talking are healthy ways to manage anger.'),
    Q('Grace is afraid to speak in front of the class. Which helps most?', 'Practise at home and take slow breaths first', w('SE_ANGER_BAD', 'Skip school on the day to avoid it', 'Say she is ill when she is not', 'Tell the class that she is not afraid'), 'Practice and calm breathing build courage.'),
    Q('A boy feels very jealous of his friend\'s new bag. What is a healthy response?', 'Be glad for him and work towards his own goals', w('SE_REVENGE', 'Hide the bag so that his friend cries', 'Say bad things about the bag to many others', 'Stop speaking to his friend for ever'), 'Jealousy is managed by thinking of our own goals.'),
  ], { h: ['Which choice calms the feeling and keeps friends?', 'Healthy ways are calm, kind and honest.'], s1: 'Pick the calm and kind choice.' })),

  // ---------------------------------------------------------------- EO_OPPORTUNITY
  fam('eo.op.which', `${EO}EO_OPPORTUNITY`, 'direct', 1, choose([
    Q('What does a good business idea need first?', 'A need that people have', w('EO_CAPITAL_ONLY', 'A large amount of money', 'A shop with a big sign', 'A friend who owns a bank'), 'A business begins with a need that people want met.'),
    Q('What does a social entrepreneur do?', 'Solves a community problem through a business', w('EO_SOCIAL_PROFIT', 'Makes the most profit at any cost', 'Gives away everything and earns nothing', 'Works only for the government'), 'A social entrepreneur earns by solving a community problem.'),
    Q('Which learner could start a school stationery shop? The one who is...', 'Honest, good with numbers and friendly', w('EO_CAPITAL_ONLY', 'Rich, shy and keen to hide', 'Lazy but with a lot of pocket money', 'Rude to customers but quick'), 'Honesty, numbers and friendliness suit a shop.'),
    Q('A youth group collects plastic bottles and turns them into paving blocks. What does this show?', 'A social enterprise that cleans and earns', w('EO_SOCIAL_PROFIT', 'A way to dump plastic quickly', 'A business with no customers', 'A game that only the youth play'), 'The group solves a litter problem and earns money.'),
    Q('Which is needed to start a small business?', 'A plan, some capital and a customer', w('EO_CAPITAL_ONLY', 'A great deal of luck only', 'A loan with no plan to repay', 'A name on a sign without goods'), 'Planning, money and customers all matter.'),
  ], { h: ['Think of the need first, then the plan and money.', 'A social entrepreneur solves a problem and earns.'], s1: 'Start with the need.' }), 'b'),
  fam('eo.op.story', `${EO}EO_OPPORTUNITY`, 'word', 2, choose([
    Q('Kerubo loves cooking and is good at saving. Which opportunity suits her best?', 'Selling snacks to learners at break', w('EO_CAPITAL_ONLY', 'Repairing cars without any training', 'Running a bank with no money', 'Building houses on her own'), 'Cooking and saving suit a snack business.'),
    Q('Ali is good at fixing phones. Which is a good opportunity?', 'A small repair business for his neighbourhood', w('EO_CAPITAL_ONLY', 'Selling cloth when he knows nothing of it', 'Teaching farming without a farm', 'Opening a shop with no goods'), 'He should use the ability he has.'),
    Q('A village has no clean water. A group sells safe water at low prices. Why is it social entrepreneurship?', 'It meets a community need and earns money', w('EO_SOCIAL_PROFIT', 'It earns the most money it can', 'It does not need customers', 'It is run only by the government'), 'A social enterprise meets a need and also earns.'),
    Q('Which is a requirement of a social enterprise?', 'A clear community problem to solve', w('EO_CAPITAL_ONLY', 'A big car for the owner to use', 'A promise to earn nothing at all', 'A large office in the city centre'), 'It starts with a real problem.'),
    Q('Tabitha wants to start a poultry business. What should she do first?', 'Find out if people nearby will buy eggs', w('EO_CAPITAL_ONLY', 'Buy a hundred hens at once', 'Build a big shed before she plans', 'Wait to see what others do'), 'Check the market before spending money.'),
  ], { h: ['Match the learner\'s strength to a business that fits.', 'A need, a plan and customers come first.'], s1: 'Match strength to opportunity.' })),

  // ---------------------------------------------------------------- HO_TRADITIONAL
  fam('ho.tr.which', `${HO}HO_TRADITIONAL`, 'direct', 1, choose([
    Q('In the Agikuyu story of origin, who were the first man and woman?', 'Gikuyu and Mumbi', w('HO_SAME_STORY', 'Adam and Eve', 'Wanjiru and Otieno', 'Mwangi and Akinyi'), 'The Agikuyu tell of Gikuyu and Mumbi. Adam and Eve are in the Bible.'),
    Q('Do all African communities tell the same story of how people began?', 'No, each community has its own story', w('HO_SAME_STORY', 'Yes, they all tell the same story', 'Yes, only one story exists in Africa', 'No, because Africans have no stories'), 'Each community has its own story, though some ideas are shared.'),
    Q('How were traditional stories of origin passed on?', 'By elders telling them aloud to children', w('HO_STORY_FALSE', 'Only through books in school', 'By television, radio and the internet alone', 'They were never told'), 'Elders told the stories to the young by mouth.'),
    Q('How should we treat the origin stories of other communities?', 'With respect, as the beliefs of that community', w('HO_STORY_FALSE', 'As silly tales to laugh at', 'As lies that should be forgotten', 'As things to hide from visitors'), 'These stories hold the beliefs and values of a people.'),
    Q('In the Agikuyu story, who gave the land and the fig tree to the first couple?', 'Ngai, the creator', w('HO_SAME_STORY', 'Mumbi, the first mother', 'The chief of the clan', 'The elders of the village'), 'Ngai, the Agikuyu creator, gave the land and the Mukuru wa Gathanga tree.'),
  ], { h: ['Each community has its own story and creator.', 'Treat each story with respect.'], s1: 'Think of the community and its story.' })),
  fam('ho.tr.why', `${HO}HO_TRADITIONAL`, 'word', 2, choose([
    Q('A teacher asks learners to bring a story of origin from home. Why is this a good idea?', 'To learn that communities have different stories', w('HO_SAME_STORY', 'To prove that one story is true', 'To show that every story told is just the same', 'To find out whose story is silly'), 'Stories differ, and each is valued.'),
    Q('Nasimiyu asks her grandmother how her people began. Which source is she using?', 'An elder who tells stories aloud', w('HO_STORY_FALSE', 'A written book from the shop', 'A film from a museum', 'A map of her village'), 'Elders keep stories of origin.'),
    Q('A learner laughs at another community\'s story of origin. What should the teacher say?', 'Every community\'s story deserves respect', w('HO_STORY_FALSE', 'Laughing is allowed at old stories', 'Only your own story is true', 'Stories of origin are not important'), 'We respect what other people believe.'),
    Q('Why do communities tell stories of origin?', 'To explain how people began and how to live', w('HO_SAME_STORY', 'To get money from visitors', 'To scare children at night', 'To make the others feel small and unimportant'), 'They explain beginnings and teach values.'),
    Q('The Maasai say Enkai, their creator, sent cattle down to them. What does this story show?', 'That cattle are very valued in Maasai life', w('HO_SAME_STORY', 'That all communities keep cattle as the Maasai do', 'That the story is not important', 'That cattle came from Europe'), 'The story shows how important cattle are to the Maasai. A teacher or elder should confirm the details.'),
  ], { h: ['Think about why a community keeps a story.', 'Respect, and do not mix one story with another.'], s1: 'Think of the community and why it keeps the story.' })),

  // ---------------------------------------------------------------- HO_RELIGIOUS
  fam('ho.re.which', `${HO}HO_RELIGIOUS`, 'direct', 1, choose([
    Q('In the Christian story, who are the first man and woman?', 'Adam and Eve', w('HO_ADAM_ONLY', 'Gikuyu and Mumbi', 'Noah and Sarah', 'Moses and Mary'), 'The Bible names Adam and Eve, made by God.'),
    Q('Which religions tell about Adam as the first man?', 'Christianity and Islam both do', w('HO_ADAM_ONLY', 'Only Christianity', 'Only Islam', 'Neither of them'), 'Adam is in the stories of both faiths.'),
    Q('What do traditional and religious stories of origin often share?', 'A creator and a first man and woman', w('HO_NO_COMMON', 'No ideas at all', 'The same names for the first people', 'The same place for every story'), 'Many stories share a creator and a first couple.'),
    Q('In the Christian story, where did God place Adam and Eve?', 'In the garden of Eden', w('HO_ADAM_ONLY', 'On Mount Kenya', 'In the land of Ur', 'On the shores of Lake Victoria'), 'Genesis names the garden of Eden.'),
    Q('Who made people according to the Islamic story?', 'Allah', w('HO_NO_COMMON', 'Ngai', 'Enkai', 'The Sun'), 'In Islam, Allah made Adam, the first man.'),
  ], { h: ['Adam is in both Christian and Islamic stories.', 'Look for ideas that stories share.'], s1: 'Think of which faith the story belongs to.' })),
  fam('ho.re.common', `${HO}HO_RELIGIOUS`, 'word', 2, choose([
    Q('Which is a common aspect of religious and traditional stories of human origin?', 'A creator who made the first people', w('HO_NO_COMMON', 'A story with no first people', 'A claim that people made themselves', 'A rule that nobody may tell it'), 'Both kinds often have a creator and first people.', { i: 'Choose the best answer.' }),
    Q('A learner says religious and traditional stories have nothing in common. What can you show?', 'Both name a creator and a first man and woman', w('HO_NO_COMMON', 'Both are only in books', 'Both were written down by one single person', 'Both have the same names'), 'They share a creator and first people.'),
    Q('Which idea do many origin stories teach?', 'People have a purpose and must be respected', w('HO_NO_COMMON', 'Some people are born better than other people', 'People came without any cause', 'Only one group is human'), 'Many stories teach respect for people.'),
    Q('Which is a difference between the Agikuyu story and the Christian story?', 'They name different first couples', w('HO_ADAM_ONLY', 'Only one of them has ever been told aloud', 'They disagree that people have a creator', 'They are about different planets'), 'Gikuyu and Mumbi are not Adam and Eve, but both have a creator.'),
    Q('Why should we learn about different stories of human origin?', 'To respect what different people believe', w('HO_NO_COMMON', 'To decide whose story is silly', 'To prove that everyone must follow just one', 'To avoid meeting other people'), 'Learning builds respect for others.'),
  ], { h: ['Look for the idea that is the same in different stories.', 'Both kinds often have a creator and a first couple.'], s1: 'Look for what the stories share.' }), 'c'),

  // ---------------------------------------------------------------- EC_FACTORS
  fam('ec.fa.which', `${EC}EC_FACTORS`, 'direct', 1, choose([
    Q('Which factor helped ancient Egypt grow?', 'The fertile land along the River Nile', w('EC_NILE_EVERY', 'Cattle and gold at Great Zimbabwe', 'Copper from the Congo only', 'Snow from the mountains'), 'Egypt grew on the fertile Nile valley.'),
    Q('Which factor helped Great Zimbabwe grow?', 'Cattle, gold and trade with the coast', w('EC_NILE_EVERY', 'The yearly floods of the great Nile river', 'The Suez Canal', 'The coal mines of Europe'), 'Great Zimbabwe grew from cattle, gold and trade.'),
    Q('Which factor helped the Kingdom of Kongo grow?', 'Fertile land by the Congo River and metal work', w('EC_NILE_EVERY', 'The pyramids of Giza', 'Trade in cattle with the kingdom of Egypt', 'The gold of the Nile'), 'Kongo grew from farming, iron and copper work and trade.'),
    Q('Who built the stone walls of Great Zimbabwe?', 'The ancestors of the Shona people', w('EC_WHITE_BUILT', 'Visitors who came from Europe', 'Traders from far Asia', 'Nobody knows, as they just appeared'), 'Great Zimbabwe was built by Africans, the ancestors of the Shona. A teacher should confirm.'),
    Q('Why were strong rulers important to these kingdoms?', 'They kept order and organised trade and work', w('EC_NILE_EVERY', 'They made the rain fall', 'They stopped all of the farming in the land', 'They closed the roads'), 'Strong rule kept order and organised trade.'),
  ], { h: ['Each kingdom grew for its own reasons.', 'Egypt, the Nile. Zimbabwe, cattle and gold. Kongo, the Congo River and metal work.'], s1: 'Match the factor to the kingdom.' })),
  fam('ec.fa.story', `${EC}EC_FACTORS`, 'word', 2, choose([
    Q('A guide says Great Zimbabwe grew rich because of the Nile floods. What is wrong?', 'The Nile is in Egypt, far from Zimbabwe', w('EC_NILE_EVERY', 'Nothing is wrong at all', 'The Nile has no floods', 'Great Zimbabwe did not grow rich at all'), 'Great Zimbabwe grew from cattle, gold and trade, not the Nile.'),
    Q('Why did farmers in Egypt like the yearly flood?', 'It left rich silt that made soil fertile', w('EC_NILE_EVERY', 'It carried away their crops each year', 'It made the desert wider', 'It brought gold into the fields'), 'Silt from the flood fed the crops.'),
    Q('Great Zimbabwe lay between the Limpopo and Zambezi. How did this help trade?', 'Gold and goods could move to the coast by routes', w('EC_NILE_EVERY', 'It cut the whole kingdom off from everyone else', 'It stopped all travel on the land', 'It made farming impossible'), 'Routes to the coast linked Great Zimbabwe to world trade.'),
    Q('A child says only outsiders could have built Great Zimbabwe. What is the correct reply?', 'Africans built it, as the evidence shows', w('EC_WHITE_BUILT', 'The child is right, since it is so grand', 'It was built by travellers from Egypt', 'Nobody has studied it'), 'Studies show the builders were Shona ancestors. A teacher should confirm.'),
    Q('Which helped Kongo\'s rulers to control a large area?', 'A strong central government and trade routes', w('EC_NILE_EVERY', 'Having no government of any kind at all', 'The yearly Nile floods', 'The snow on the mountains'), 'The Manikongo ruled through a central government.'),
  ], { h: ['Ask which kingdom the clue belongs to.', 'The Nile belongs to Egypt.'], s1: 'Match the clue to the kingdom.' })),

  // ---------------------------------------------------------------- EC_LOCATE
  fam('ec.lo.which', `${EC}EC_LOCATE`, 'table', 1, choose([
    Q('Look at the table. Which kingdom was in north-east Africa?', 'Ancient Egypt', w('EC_EGYPT_WEST', 'Great Zimbabwe', 'The Kingdom of Kongo', 'None of them'), 'Ancient Egypt was along the Nile in the north-east.',
      T(['Kingdom', 'Region'], [['Ancient Egypt', 'North-east Africa'], ['Great Zimbabwe', 'Southern Africa'], ['Kingdom of Kongo', 'West-central Africa']])),
    Q('Look at the table. Where was Great Zimbabwe?', 'Southern Africa', w('EC_KONGO_NORTH', 'North-east Africa', 'West-central Africa', 'Eastern Africa'), 'Great Zimbabwe was in southern Africa.',
      T(['Kingdom', 'Region'], [['Ancient Egypt', 'North-east Africa'], ['Great Zimbabwe', 'Southern Africa'], ['Kingdom of Kongo', 'West-central Africa']])),
    Q('Which river lay near the Kingdom of Kongo?', 'The Congo River', w('EC_KONGO_NORTH', 'The Nile', 'The Limpopo', 'The Zambezi'), 'Kongo lay near the mouth of the Congo River.'),
    Q('Which sea lies to the north of ancient Egypt?', 'The Mediterranean Sea', w('EC_EGYPT_WEST', 'The Indian Ocean', 'The Atlantic Ocean', 'The Arabian Sea'), 'Egypt lies on the Mediterranean in the north.'),
    Q('Which modern country holds the remains of Great Zimbabwe?', 'Zimbabwe', w('EC_KONGO_NORTH', 'Egypt', 'Angola', 'Ghana'), 'The ruins are in modern Zimbabwe, which is named after them.'),
  ], { h: ['Think of the river or sea near each kingdom.', 'Egypt in the north-east, Zimbabwe in the south, Kongo in the west-centre.'], s1: 'Match the kingdom to its region.' })),
  fam('ec.lo.story', `${EC}EC_LOCATE`, 'word', 2, choose([
    Q('A learner says Great Zimbabwe was near the River Congo. Where was it?', 'Between the Limpopo and Zambezi rivers', w('EC_KONGO_NORTH', 'Near the mouth of the Congo', 'On the Nile in Egypt', 'In West Africa'), 'Great Zimbabwe lay in southern Africa between two rivers.'),
    Q('Which kingdom lay near the Atlantic coast of west-central Africa?', 'The Kingdom of Kongo', w('EC_EGYPT_WEST', 'Ancient Egypt', 'Great Zimbabwe', 'The Axum kingdom'), 'Kongo was near the mouth of the Congo, on the Atlantic coast.'),
    Q('Which direction from Kenya is ancient Egypt?', 'North', w('EC_EGYPT_WEST', 'South', 'West', 'East'), 'Egypt lies north of Kenya.'),
    Q('Which direction from Kenya is Great Zimbabwe?', 'South-west', w('EC_KONGO_NORTH', 'North-east', 'North', 'East'), 'Zimbabwe lies south-west of Kenya.'),
    Q('The Nile flows through which kingdom?', 'Ancient Egypt', w('EC_EGYPT_WEST', 'Great Zimbabwe', 'The Kingdom of Kongo', 'None of them'), 'Ancient Egypt was built on the Nile.'),
  ], { h: ['Use the compass and the nearby river or sea.', 'Egypt north, Zimbabwe south-west of Kenya, Kongo west.'], s1: 'Think of the compass direction.' })),

  // ---------------------------------------------------------------- EC_CONTRIB
  fam('ec.co.which', `${EC}EC_CONTRIB`, 'direct', 1, choose([
    Q('Which kingdom gave the world hieroglyphs and papyrus?', 'Ancient Egypt', w('EC_MIX_GIFT', 'Great Zimbabwe', 'The Kingdom of Kongo', 'The Maasai kingdom'), 'Egypt gave writing in hieroglyphs and papyrus paper.'),
    Q('Which kingdom is famous for stone walls built without mortar?', 'Great Zimbabwe', w('EC_MIX_GIFT', 'Ancient Egypt', 'The Kingdom of Kongo', 'The Kingdom of Buganda'), 'Great Zimbabwe\'s walls were built from dry stone.'),
    Q('Which kingdom was famed for skilled copper and iron work?', 'The Kingdom of Kongo', w('EC_MIX_GIFT', 'Ancient Egypt', 'Great Zimbabwe', 'The kingdom of Axum'), 'Kongo was known for its metal work and cloth.'),
    Q('Do ancient African kingdoms still matter to the world today?', 'Yes, their ideas are still used', w('EC_NO_GIFT', 'No, they ended long ago', 'No, they gave nothing', 'Yes, but only in Egypt'), 'The calendar, writing and metal work still matter.'),
    Q('Which idea from ancient Egypt do we still use?', 'A calendar of 365 days', w('EC_NO_GIFT', 'Coins made of cowrie shells', 'Printing with machines', 'Electric lamps'), 'The Egyptians made a calendar of 365 days.'),
  ], { h: ['Match each gift to its kingdom.', 'Egypt, writing and calendar. Zimbabwe, stone building. Kongo, metal work.'], s1: 'Match the gift to the kingdom.' })),
  fam('ec.co.story', `${EC}EC_CONTRIB`, 'word', 2, choose([
    Q('A builder uses geometry to measure fields after floods. Which kingdom is known for using this?', 'Ancient Egypt', w('EC_MIX_GIFT', 'Great Zimbabwe', 'The Kingdom of Kongo', 'The kingdom of Bunyoro'), 'Egyptians used geometry to mark fields.'),
    Q('A museum shows delicate copper crosses and woven cloth from the Congo River. Which kingdom made them?', 'The Kingdom of Kongo', w('EC_MIX_GIFT', 'Ancient Egypt', 'Great Zimbabwe', 'The kingdom of Ghana'), 'Kongo made fine metal work and cloth.'),
    Q('Why do historians value Great Zimbabwe today?', 'It shows African skill in stone building', w('EC_NO_GIFT', 'It proves that Africans built nothing', 'It has no value any more', 'It shows only trade in Europe'), 'The ruins show great building skill.'),
    Q('A learner says ancient Africa gave the world nothing. What should you say?', 'Egypt, for example, gave writing and a calendar', w('EC_NO_GIFT', 'It is true, nothing was given', 'Only Europe gave ideas', 'Only the Nile gave ideas'), 'Many modern ideas have African roots.'),
    Q('Which is a use of papyrus?', 'Making paper to write on', w('EC_MIX_GIFT', 'Building stone walls without mortar', 'Making copper tools', 'Melting gold for trade'), 'Egyptians made papyrus paper from a reed.'),
  ], { h: ['Think of what each kingdom is known for.', 'Egypt, writing. Zimbabwe, stone. Kongo, metal.'], s1: 'Match the gift to the kingdom.' })),
];
