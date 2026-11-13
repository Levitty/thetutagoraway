// ============================================================================
// GRADE 4 CHRISTIAN RELIGIOUS EDUCATION, PART C: Christian living (Joseph and temptation, whom to trust, trusting God,
// truthfulness, obedience, Jesus blesses the children, caring for personal and school items, holiness). Bible facts asked are
// those stated in the passages the design names. No denominational claims. Every family stays reviewed:false until a CRE
// teacher signs it off (cre_g4_signed.js): none reaches a child.
// ============================================================================
import { C, w, F } from './cre_g4_lib.js';

const K = 'CHRIST.';
const jr = w('M_C4_JR_'), sp = w('M_C4_SP_'), tg = w('M_C4_TG_'), tr = w('M_C4_TR_'), ob = w('M_C4_OB_'), lc = w('M_C4_LC_'), ci = w('M_C4_CI_'), ho = w('M_C4_HOL_');

export const FAMILIES = [
  // ---------------------------------------------------------------- JOSEPH_RESISTS
  F('joseph.facts', `${K}TRUST.JOSEPH_RESISTS`, 'direct', 1, 'story facts', ['Genesis 39:7-12.', 'Joseph said it would be a sin against God.'], [
    C('Why did Joseph refuse to do wrong, according to Genesis 39:9?', 'It would be a sin against God', 'Joseph feared God more than people.', jr('He was afraid of his master', 'MASTER'), jr('Nobody else was in the house to see', 'PRIVATE'), jr('He wanted to stay and argue', 'STAYED')),
    C('What did Joseph do when she held on to his cloak?', 'He left it and ran out of the house', 'Genesis 39:12.', jr('He stayed to argue', 'STAYED'), jr('He took the cloak and sat down', 'STAYED'), jr('He hid in the house', 'PRIVATE')),
    C('Who else was in the house when Joseph refused?', 'None of the household servants was inside', 'Genesis 39:11. Joseph refused even though no one saw.', jr('The whole household watched him', 'MASTER'), jr('His master, who was at home', 'MASTER'), jr('His brothers', 'PRIVATE')),
    C('Whom did Joseph say he could not sin against?', 'God', 'Genesis 39:9.', jr('His master, Potiphar', 'MASTER'), jr('His brothers', 'MASTER'), jr('The servants watching', 'PRIVATE')),
    C('What did Joseph teach us by running away?', 'To flee from temptation', 'Sometimes the right thing is to run away.', jr('To stay and argue', 'STAYED'), jr('To stay because no one is looking', 'PRIVATE'), jr('To be afraid of the master', 'MASTER')),
  ], 'a'),
  F('joseph.lessons', `${K}TRUST.JOSEPH_RESISTS`, 'why', 2, 'lessons for us', ['Think about God who sees.', 'Joseph left the bad situation.'], [
    C('Mugambi is tempted to cheat in a test when the teacher is out of the room. What can he learn from Joseph?', 'Do right because God sees, even when no one else does', 'Joseph refused even when alone.', jr('Cheat, because nobody is looking', 'PRIVATE'), jr('Do right only if the teacher is afraid', 'MASTER'), jr('Stay and argue with the tempter', 'STAYED')),
    C('Friends tell Kamau to go with them to a bad place. What does Joseph\'s example suggest?', 'Leave quickly and do not stay', 'Joseph ran out of the house.', jr('Stay and argue with them', 'STAYED'), jr('Do it because nobody sees', 'PRIVATE'), jr('Go because the master is away', 'MASTER')),
    C('What should be our reason to say no to wrong?', 'We want to please God, who sees us always', 'Joseph feared God.', jr('We are afraid of being seen by a master', 'MASTER'), jr('We want to stay and argue', 'STAYED'), jr('We think nobody sees', 'PRIVATE')),
    C('Which is the wisest thing to do in a tempting situation?', 'Say no and leave', 'Joseph did.', jr('Stay and argue', 'STAYED'), jr('Wait and see if anyone is looking', 'PRIVATE'), jr('Ask the master', 'MASTER')),
    C('Does God see what we do when no one else is there?', 'Yes, God sees everything', 'That is why Joseph refused.', jr('No, only the master sees', 'MASTER'), jr('No, privacy hides everything', 'PRIVATE'), jr('No, only those who argue are seen', 'STAYED')),
  ], 'a'),

  // ---------------------------------------------------------------- SAFE_PEOPLE
  F('safe.whom', `${K}TRUST.SAFE_PEOPLE`, 'direct', 1, 'whom to trust and tell', ['A trusted person is known to your family and cares for you.', 'A trusted person never asks for a secret.'], [
    C('Which of these is a trusted person for a child?', 'A parent or a teacher I know', 'These are people who care for you.', sp('Any adult who tells me to come', 'ALL_ADULTS'), sp('A kind stranger with sweets', 'KIND_STRANGER'), sp('Nobody, I should tell no one', 'NO_TELL')),
    C('Whom can you report to if you are in danger?', 'Childline Kenya (116) or a teacher', 'You have safe people to tell.', sp('No one, they will not believe me', 'NO_TELL'), sp('A stranger who is kind', 'KIND_STRANGER'), sp('Any adult I meet', 'ALL_ADULTS')),
    C('A stranger offers you sweets and a lift home. What should you do?', 'Say NO, go away and tell a trusted adult', 'Never go with someone who offers gifts.', sp('Accept, because he is kind', 'KIND_STRANGER'), sp('Go with him, since he is an adult', 'ALL_ADULTS'), sp('Say nothing to anyone', 'NO_TELL')),
    C('Wanjiru has told a teacher about something wrong and nothing happened. What now?', 'Tell another trusted adult', 'Keep telling until someone helps.', sp('Stop telling, no one will help', 'NO_TELL'), sp('Tell the kind stranger', 'KIND_STRANGER'), sp('Go with the next adult who calls', 'ALL_ADULTS')),
    C('An adult you do not know says "come with me, your mother sent me". What should you do?', 'Do not go, and check with a trusted adult', 'Not every adult can be trusted.', sp('Go, he is an adult', 'ALL_ADULTS'), sp('Go, because he is kind', 'KIND_STRANGER'), sp('Tell nobody', 'NO_TELL')),
  ], 'c'),
  F('safe.say-no', `${K}TRUST.SAFE_PEOPLE`, 'why', 2, 'saying NO', ['Say NO, go away and tell.', 'A secret about touching is never to be kept.'], [
    C('Why is it good to say NO firmly to a stranger who offers a gift?', 'It keeps you safe, and then you tell a trusted adult', 'Saying NO and leaving protects you.', sp('Because kind people should be refused rudely only', 'KIND_STRANGER'), sp('Because every adult is a stranger', 'ALL_ADULTS'), sp('Because there is no one to tell', 'NO_TELL')),
    C('Achieng is told, "Do not tell your mother about our game, it is a secret." What should she do?', 'Tell her mother about it', 'Safe adults do not ask for secrets.', sp('Keep it, as he is kind to her', 'KIND_STRANGER'), sp('Keep it, because he is an adult', 'ALL_ADULTS'), sp('Keep it, no one will help', 'NO_TELL')),
    C('Which is a trusted place to go for help in the community?', 'The chief\'s office or a police station', 'Officers help children in danger.', sp('A stranger\'s car', 'KIND_STRANGER'), sp('Any adult who offers a lift', 'ALL_ADULTS'), sp('Nowhere, because nobody helps', 'NO_TELL')),
    C('Why must you say NO when somebody offers to take you somewhere alone?', 'Because you may be in danger', 'Saying NO is brave and right.', sp('Because a kind person is always right', 'KIND_STRANGER'), sp('Because all adults decide for you', 'ALL_ADULTS'), sp('Because there is no one to tell', 'NO_TELL')),
    C('A man you have never met says he is a friend of your father. He asks you to come with him. What do you say?', 'NO, and I go to a trusted adult', 'Do not go with people you do not know.', sp('Yes, he is an adult', 'ALL_ADULTS'), sp('Yes, he seems kind', 'KIND_STRANGER'), sp('Nothing, I tell nobody', 'NO_TELL')),
  ], 'b'),

  // ---------------------------------------------------------------- TRUST_GOD
  F('trustgod.verse', `${K}TRUST.TRUST_GOD`, 'direct', 1, 'what the verse says', ['Psalm 125:1.', 'Mount Zion cannot be shaken.'], [
    C('Psalm 125:1 says that those who trust in the Lord are like...', 'Mount Zion, which cannot be shaken', 'The Lord keeps those who trust in him firm.', tg('A tree that never faces trouble', 'NO_TROUBLE'), tg('A strong man who needs no help', 'OWN_STRENGTH'), tg('A person who does nothing', 'LAZY')),
    C('What does it mean to trust in the Lord?', 'To rely on him and stand firm in trouble', 'God is with us in all things.', tg('To have no trouble at all', 'NO_TROUBLE'), tg('To depend only on our own strength', 'OWN_STRENGTH'), tg('To do nothing ourselves', 'LAZY')),
    C('Why can those who trust in the Lord not be shaken?', 'Because God stands by them', 'Psalm 125 says the Lord surrounds his people.', tg('Because they are strong in themselves', 'OWN_STRENGTH'), tg('Because they never meet trouble', 'NO_TROUBLE'), tg('Because they do nothing', 'LAZY')),
    C('Which is a reason to trust God?', 'He is faithful and he cares for us', 'We can lean on him.', tg('Because trouble never comes', 'NO_TROUBLE'), tg('Because we are strong enough', 'OWN_STRENGTH'), tg('Because we can then stop trying', 'LAZY')),
    C('Mount Zion stands firm in a storm. What does this picture teach?', 'God keeps those who trust him steady', 'Trouble may come but God holds us.', tg('We will never have a storm', 'NO_TROUBLE'), tg('We stand by our own strength', 'OWN_STRENGTH'), tg('We need do nothing', 'LAZY')),
  ], 'd'),
  F('trustgod.apply', `${K}TRUST.TRUST_GOD`, 'why', 2, 'trusting God in daily life', ['We do our part and trust God with the rest.', 'Trust is not the same as having no problems.'], [
    C('Wanjiru trusts God to help her in an exam. What fits best?', 'She studies and prays', 'Trust and effort go together.', tg('She does not study, she only prays', 'LAZY'), tg('She believes she will have no problems', 'NO_TROUBLE'), tg('She trusts only her own strength', 'OWN_STRENGTH')),
    C('Baraka\'s family has a hard time. What can he do?', 'Trust God and keep doing what is right', 'God holds us in hard times.', tg('Say that trusting means no hard times', 'NO_TROUBLE'), tg('Do nothing', 'LAZY'), tg('Rely only on himself', 'OWN_STRENGTH')),
    C('Which child shows trust in God?', 'One who prays and does her best', 'Trust works with effort.', tg('One who stops trying', 'LAZY'), tg('One who says she needs no help from God', 'OWN_STRENGTH'), tg('One who expects no troubles', 'NO_TROUBLE')),
    C('Hassan\'s mother is ill. Which response shows trust in God?', 'Pray, help at home and keep hoping', 'Trust means leaning on God while we do our part.', tg('Believe that trust means she will not be ill', 'NO_TROUBLE'), tg('Do nothing', 'LAZY'), tg('Depend only on his own strength', 'OWN_STRENGTH')),
    C('When should we trust God?', 'In good times and in hard times', 'Psalm 125:1 says he keeps us firm.', tg('Only when there is no trouble', 'NO_TROUBLE'), tg('Only when we are weak', 'OWN_STRENGTH'), tg('Only when we have stopped working', 'LAZY')),
  ], 'd'),

  // ---------------------------------------------------------------- TRUTH
  F('truth.verses', `${K}TRUTHFULNESS_TRUTHFULNES.TRUTH`, 'direct', 1, 'what the verses say', ['Proverbs 12:19 and Ephesians 4:25.', 'Truth lasts, lies do not.'], [
    C('What does Proverbs 12:19 say?', 'Truthful lips last for ever, a lying tongue only a moment', 'Truth lasts.', tr('Lying lips last for ever', 'LIE_LASTS'), tr('A small lie is fine', 'WHITE_LIE'), tr('Hide the truth if it shames you', 'HIDE')),
    C('Ephesians 4:25 says to put away falsehood and...', 'Speak truthfully', 'We belong to one another.', tr('Tell small lies to avoid trouble', 'WHITE_LIE'), tr('Hide the truth', 'HIDE'), tr('Let lying last', 'LIE_LASTS')),
    C('Which lasts longer, according to Proverbs 12:19?', 'Truthful lips', 'A lying tongue lasts only a moment.', tr('A lying tongue', 'LIE_LASTS'), tr('A small lie', 'WHITE_LIE'), tr('A hidden truth', 'HIDE')),
    C('Why should we tell the truth?', 'It builds trust and pleases God', 'Truth keeps friendship and peace.', tr('Because small lies are harmless', 'WHITE_LIE'), tr('Because lies last', 'LIE_LASTS'), tr('Because the truth should be hidden', 'HIDE')),
    C('Ephesians 4:25 gives a reason for speaking truthfully. What is it?', 'We belong to one another', 'Lies harm others in the body.', tr('Because we should hide from others', 'HIDE'), tr('Because lying lasts', 'LIE_LASTS'), tr('Because a small lie is fine', 'WHITE_LIE')),
  ], 'b'),
  F('truth.apply', `${K}TRUTHFULNESS_TRUTHFULNES.TRUTH`, 'why', 2, 'what to do', ['Tell the truth even when it is hard.', 'Say sorry and make it right.'], [
    C('You broke a cup by accident. What should you say?', 'It was me, and I am sorry', 'Telling the truth keeps trust.', tr('It was not me', 'WHITE_LIE'), tr('Nothing, I will hide it', 'HIDE'), tr('A lie lasts, so I will say it was the cat', 'LIE_LASTS')),
    C('A child failed a test and is ashamed. What should he tell his father?', 'Tell him the truth and ask for help', 'Ephesians 4:25.', tr('Say he did well', 'WHITE_LIE'), tr('Hide his paper', 'HIDE'), tr('Say he passed', 'LIE_LASTS')),
    C('Nekesa told a lie yesterday. What can she do now?', 'Tell the truth, say sorry, and do better', 'We can put away falsehood.', tr('Keep the lie', 'LIE_LASTS'), tr('Tell another small lie', 'WHITE_LIE'), tr('Hide it', 'HIDE')),
    C('Which choice shows truthfulness?', 'Admitting a mistake', 'Truthful lips endure.', tr('Telling a small lie to avoid trouble', 'WHITE_LIE'), tr('Hiding a mistake', 'HIDE'), tr('Letting a lie last', 'LIE_LASTS')),
    C('Why is a small lie still wrong?', 'It is still a lie and it breaks trust', 'Ephesians 4:25.', tr('It is not wrong, it is small', 'WHITE_LIE'), tr('It lasts for ever', 'LIE_LASTS'), tr('It hides the truth, which is right', 'HIDE')),
  ], 'a'),

  // ---------------------------------------------------------------- OBEDIENCE
  F('obedience.verse', `${K}OBEDIENCE_OBEDIENCE.OBEDIENCE`, 'direct', 1, 'what the verse says', ['Exodus 20:12.', 'Honour your father and mother.'], [
    C('What does Exodus 20:12 tell children to do?', 'Honour their father and mother', 'There is a promise of a long life.', ob('Obey only when they agree', 'IF_AGREE'), ob('Obey only at home, not at school', 'RULES_HOME'), ob('Obey only if they are watched', 'NO_RESULT')),
    C('What does Exodus 20:12 promise?', 'A long life in the land God gives', 'This is the promise in the verse.', ob('No result at all', 'NO_RESULT'), ob('Getting what I want', 'IF_AGREE'), ob('Obedience only at school', 'RULES_HOME')),
    C('When should a child obey his parents?', 'Always when it is right and safe', 'Obedience is for our good.', ob('Only when I agree', 'IF_AGREE'), ob('Only when someone sees', 'NO_RESULT'), ob('Only at home', 'RULES_HOME')),
    C('Whose instructions should a child follow at school?', 'Teachers and school rules', 'Obedience applies at school too.', ob('Only my parents\'', 'RULES_HOME'), ob('Only the ones I like', 'IF_AGREE'), ob('None, if the teacher is out', 'NO_RESULT')),
    C('Why do we obey school rules?', 'For safety, peace and learning', 'Rules protect us.', ob('Only when I agree', 'IF_AGREE'), ob('Only to avoid being caught', 'NO_RESULT'), ob('School rules are not for us', 'RULES_HOME')),
  ], 'a'),
  F('obedience.results', `${K}OBEDIENCE_OBEDIENCE.OBEDIENCE`, 'why', 2, 'results of disobedience', ['Disobedience has results, even if nobody sees.', 'Obedience brings peace.'], [
    C('What may follow disobeying school rules?', 'Trouble, danger and lost trust', 'Results come, seen or not.', ob('Nothing, if the teacher is not looking', 'NO_RESULT'), ob('A prize for being clever', 'IF_AGREE'), ob('Nothing, rules are for home', 'RULES_HOME')),
    C('Mugambi runs in the corridor against the rule and trips a child. What is a result?', 'The child may get hurt and Mugambi loses trust', 'Rules keep us safe.', ob('Nothing happens, nobody saw', 'NO_RESULT'), ob('Nothing, because he disagreed with the rule', 'IF_AGREE'), ob('Nothing, school rules do not apply to corridors', 'RULES_HOME')),
    C('Which is a result of obeying parents and teachers?', 'Peace and a good name', 'Obedience brings harmony.', ob('Nothing, because only I decide', 'IF_AGREE'), ob('Nothing, nobody notices', 'NO_RESULT'), ob('Only trouble at school', 'RULES_HOME')),
    C('Achieng does not agree with a school rule. What does a child who obeys do?', 'Keep the rule, and ask politely about it', 'We obey for peace and safety.', ob('Break it because she disagrees', 'IF_AGREE'), ob('Break it if nobody sees', 'NO_RESULT'), ob('Keep it only at home', 'RULES_HOME')),
    C('Disobedience at school can lead to...', 'Punishment, danger and lost trust', 'It can hurt us and others.', ob('Nothing, if I am not caught', 'NO_RESULT'), ob('A good name with my friends', 'IF_AGREE'), ob('Nothing, rules are only at home', 'RULES_HOME')),
  ], 'd'),

  // ---------------------------------------------------------------- LOVE_CHILDREN
  F('lovechildren.facts', `${K}LOVE_LOVE.LOVE_CHILDREN`, 'direct', 1, 'story facts', ['Matthew 19:13-15.', 'Let the little children come to me.'], [
    C('What did the disciples do when people brought children to Jesus?', 'They told the people off', 'Matthew 19:13.', lc('They welcomed the children', 'DISCIPLES'), lc('They sent for Jesus', 'DISCIPLES'), lc('They asked the children to come', 'DISCIPLES')),
    C('What did Jesus say about the children?', '"Let the little children come to me"', 'Matthew 19:14.', lc('"Send them away, I am busy"', 'BUSY'), lc('"Not now, speak to the adults"', 'BUSY'), lc('"Only the disciples may come"', 'DISCIPLES')),
    C('What did Jesus do for the children?', 'He placed his hands on them and prayed for them', 'Matthew 19:13, 15.', lc('He only spoke to the adults', 'NO_HANDS'), lc('He sent them away', 'BUSY'), lc('He did nothing', 'NO_HANDS')),
    C('Who does the kingdom of heaven belong to, according to Jesus?', 'Those who are like little children', 'Matthew 19:14.', lc('Only the disciples', 'DISCIPLES'), lc('Only the busy', 'BUSY'), lc('Only the adults', 'NO_HANDS')),
    C('Why did people bring the children to Jesus?', 'So that he would pray for them', 'Matthew 19:13.', lc('So that the disciples would pray', 'DISCIPLES'), lc('So that Jesus would be busy', 'BUSY'), lc('So that he would speak to adults', 'NO_HANDS')),
  ], 'a'),
  F('lovechildren.shows', `${K}LOVE_LOVE.LOVE_CHILDREN`, 'why', 2, 'what it shows', ['Jesus loves children.', 'We show love by being kind to others.'], [
    C('What does the story show about Jesus?', 'He loves children and welcomes them', 'Matthew 19:14.', lc('He is too busy for children', 'BUSY'), lc('He blessed only the adults', 'NO_HANDS'), lc('He agreed with the disciples', 'DISCIPLES')),
    C('Wanjiru feels she is too small to matter to God. What can we tell her?', 'Jesus welcomed children, and God loves her', 'God loves children.', lc('Jesus was too busy for children', 'BUSY'), lc('Jesus only blessed adults', 'NO_HANDS'), lc('The disciples were right', 'DISCIPLES')),
    C('How can a child show love, as Jesus taught?', 'By being kind to others', 'Love is shown in kindness.', lc('By sending children away', 'BUSY'), lc('By telling others off, like the disciples', 'DISCIPLES'), lc('By praying only for adults', 'NO_HANDS')),
    C('Why did Jesus correct his disciples?', 'The children were welcome to him', 'He loves them.', lc('He was busy with the adults', 'BUSY'), lc('The disciples were right', 'DISCIPLES'), lc('He did not want to pray for children', 'NO_HANDS')),
    C('Which is a good way to follow Jesus\' example?', 'Welcome younger children kindly', 'We welcome others.', lc('Say I am too busy for them', 'BUSY'), lc('Tell them off, like the disciples', 'DISCIPLES'), lc('Pray only for grown-ups', 'NO_HANDS')),
  ], 'a'),

  // ---------------------------------------------------------------- CARE_ITEMS
  F('care.kinds', `${K}RESPONSIBILITY_PERSONAL_.CARE_ITEMS`, 'direct', 1, 'personal and school items', ['Personal items are yours. School property belongs to the whole school.', 'We care for both.'], [
    C('Which of these is a personal item?', 'A pullover', 'Personal items belong to one child.', ci('A desk', 'ONLY_PERSONAL'), ci('The school tank', 'NOBODY'), ci('The library books', 'NOBODY')),
    C('Which of these is school property?', 'A desk', 'School property belongs to the school.', ci('A pullover', 'ONLY_PERSONAL'), ci('My pencil case', 'ONLY_PERSONAL'), ci('My shoes', 'ONLY_PERSONAL')),
    C('Whose are the library books at school?', 'The whole school\'s, so we all care for them', 'We all use them.', ci('Nobody\'s, so it does not matter', 'NOBODY'), ci('Only mine', 'ONLY_PERSONAL'), ci('My parents\'', 'REPLACE')),
    C('Which items should a child look after?', 'My own things and the school\'s', 'A responsible child cares for both.', ci('Only my own things', 'ONLY_PERSONAL'), ci('None, my parents will replace them', 'REPLACE'), ci('None, they belong to nobody', 'NOBODY')),
    C('Which is a way of caring for a textbook?', 'Cover it and keep it clean and dry', 'Careful use keeps it for others too.', ci('Leave it in the rain, my parents will buy another', 'REPLACE'), ci('Tear a page, nobody owns it', 'NOBODY'), ci('Care only for my own books, not school ones', 'ONLY_PERSONAL')),
  ], 'a'),
  F('care.why', `${K}RESPONSIBILITY_PERSONAL_.CARE_ITEMS`, 'why', 2, 'why we take care', ['Things cost money and work.', 'The school belongs to all of us.'], [
    C('Your textbook is torn because you were careless. What is the best response?', 'Take better care and mend it', 'Taking care shows responsibility.', ci('It does not matter, my parents can buy another', 'REPLACE'), ci('It belongs to nobody anyway', 'NOBODY'), ci('Care only about my own things', 'ONLY_PERSONAL')),
    C('Why should we take care of the school desks?', 'They belong to all of us and other children will use them', 'We share school property.', ci('Nobody owns them, so it does not matter', 'NOBODY'), ci('They can easily be replaced', 'REPLACE'), ci('Only my own desk matters', 'ONLY_PERSONAL')),
    C('Hassan\'s pen is lost. What should he do?', 'Be more careful and tell his parents honestly', 'Care means being responsible.', ci('Say it does not matter, parents will buy another', 'REPLACE'), ci('Take someone else\'s pen', 'NOBODY'), ci('Say only school things matter', 'ONLY_PERSONAL')),
    C('Which is a way of showing thanks for what our parents give us?', 'Taking good care of our things', 'Things cost money and work.', ci('Leaving them anywhere, they will buy more', 'REPLACE'), ci('Breaking school property, it is nobody\'s', 'NOBODY'), ci('Caring only for school items', 'ONLY_PERSONAL')),
    C('A class latrine door is broken by a careless child. What shows responsibility?', 'Report it and help to look after the latrines', 'School property is for all of us.', ci('Ignore it, the school will mend it', 'NOBODY'), ci('Say parents can pay', 'REPLACE'), ci('Care only for my own things', 'ONLY_PERSONAL')),
  ], 'b'),

  // ---------------------------------------------------------------- HOLINESS
  F('holiness.verse', `${K}HOLINESS.HOLINESS`, 'direct', 1, 'what the verse says', ['1 Corinthians 6:19-20.', 'Your body is a temple of the Holy Spirit.'], [
    C('What does 1 Corinthians 6:19 say your body is?', 'A temple of the Holy Spirit', 'We honour God with it.', ho('Mine, to do what I like with', 'MY_BODY'), ho('A church building', 'BUILDING'), ho('A place to test sin', 'TEST')),
    C('In 1 Corinthians 6:19, what is the temple?', 'Your own body', 'The Holy Spirit lives in believers.', ho('The church building', 'BUILDING'), ho('A place of my own to do as I like', 'MY_BODY'), ho('A place to go near sin', 'TEST')),
    C('What does 1 Corinthians 6:20 say we should do with our bodies?', 'Honour God with them', 'We belong to God.', ho('Do whatever I like', 'MY_BODY'), ho('Build a temple', 'BUILDING'), ho('Test how close we can go to sin', 'TEST')),
    C('Which is a way of honouring God with your body?', 'Keeping clean, resting and avoiding drugs', 'We care for our bodies.', ho('Doing whatever I like with it', 'MY_BODY'), ho('Cleaning only the church building', 'BUILDING'), ho('Going near harmful things to test myself', 'TEST')),
    C('Whose are you, according to 1 Corinthians 6:19-20?', 'You belong to God, who bought you at a price', 'We are not our own.', ho('I am my own to do as I like', 'MY_BODY'), ho('I belong to the church building', 'BUILDING'), ho('I belong to those who test sin', 'TEST')),
  ], 'a'),
  F('holiness.avoid', `${K}HOLINESS.HOLINESS`, 'why', 2, 'keeping away from sin', ['Keep away from places and company that lead to sin.', 'Joseph ran away.'], [
    C('Your friends go to a place where children smoke. What is wise?', 'Keep away from that place', 'We keep away from situations that lead to sin.', ho('Go along and just watch', 'TEST'), ho('Go because my body is mine to use', 'MY_BODY'), ho('Go because it is not the church building', 'BUILDING')),
    C('Which is a way of keeping a holy life?', 'Choosing friends and places that please God', 'Holiness is a daily choice.', ho('Testing how close I can go to sin', 'TEST'), ho('Doing what I like with my body', 'MY_BODY'), ho('Keeping the church building clean only', 'BUILDING')),
    C('Amina is offered a harmful drink at a party. What should she do?', 'Say no and leave', 'Her body is a temple of the Holy Spirit.', ho('Say yes, her body is her own', 'MY_BODY'), ho('Stay and test herself', 'TEST'), ho('Say it is not the church building', 'BUILDING')),
    C('Why should a young person lead a holy life?', 'Because his body is God\'s temple and he belongs to God', 'We honour God.', ho('Because he owns his body', 'MY_BODY'), ho('Because the temple is a building', 'BUILDING'), ho('Because he can test sin safely', 'TEST')),
    C('Which choice honours God with the body?', 'Resting well and not smoking', 'We take care of what God gave us.', ho('Using my body as I like', 'MY_BODY'), ho('Cleaning only the church', 'BUILDING'), ho('Trying harmful things once', 'TEST')),
  ], 'b'),
];
