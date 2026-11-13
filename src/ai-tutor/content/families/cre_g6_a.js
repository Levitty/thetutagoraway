// ============================================================================
// GRADE 6 CHRISTIAN RELIGIOUS EDUCATION, PART A: Creation (purpose, marriage and family, leisure) and the Bible
// (the inspired word, translation, the Ten Commandments, Samson, Elisha, Jacob). Written offline from the KICD 2024 design
// through the curriculum map. Bible facts asked are those stated in the passages the design names. No denominational
// claims. Every family stays reviewed:false until a CRE teacher signs it off (cre_g6_signed.js): none reaches a child.
// ============================================================================
import { sfam, choose, C } from './cre_g6_lib.js';

const P = 'CREATI.MY_PURPOSE.';
const M = 'CREATI.MARRIAGE_AND_FAMILY.';
const L = 'CREATI.LEISURE.';
const B = 'THE_BI.';
const H1 = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- TALENTS
  sfam({ id: 'cre6.talents.verses', cs: `${P}TALENTS`, oc: 'b', form: 'direct', rung: 1, kind: 'verses on talents',
    gen: choose([
      C('Exodus 31:3 says that God filled Bezalel with the Spirit of God. What did God give him?', 'Wisdom, understanding, knowledge and skill in craftwork', 'The verse says God gave Bezalel wisdom, understanding, knowledge and all kinds of skill.', ['Great wealth and land', 'M_TAL6_SOURCE'], ['Fame among the people', 'M_TAL6_SHOW'], ['Strength to fight in wars', 'M_TAL6_SOURCE']),
      C('Romans 12:4 compares the church to a body. What does it say about the parts of the body?', 'They are many and do not all have the same work', 'Romans 12:4 says one body has many members and not all have the same function.', ['They all do the same work', 'M_TAL6_VERSE'], ['Only the head is important', 'M_TAL6_SHOW'], ['They work only for themselves', 'M_TAL6_SHOW']),
      C('Which verse says the body has many parts with different work?', 'Romans 12:4', 'Romans 12:4 speaks of one body with many members and different work.', ['Exodus 31:3', 'M_TAL6_VERSE'], ['Genesis 2:24', 'M_TAL6_VERSE'], ['Judges 15:15', 'M_TAL6_VERSE']),
      C('Which verse tells about a man filled with the Spirit of God to make beautiful things?', 'Exodus 31:3', 'Exodus 31:3 tells how God filled Bezalel with the Spirit and skill for craftwork.', ['Romans 12:4', 'M_TAL6_VERSE'], ['Mark 1:17', 'M_TAL6_VERSE'], ['Luke 8:48', 'M_TAL6_VERSE']),
      C('According to the Bible, where does Bezalel\'s skill come from?', 'From God', 'Exodus 31:3 says God filled him with skill.', ['From luck', 'M_TAL6_SOURCE'], ['From his own cleverness alone', 'M_TAL6_SOURCE'], ['From his teachers only', 'M_TAL6_SOURCE']),
    ], H1('Think about which verse is about the Spirit of God and skill, and which is about the body.', 'Exodus is about Bezalel; Romans is about one body with many parts.')) }),
  sfam({ id: 'cre6.talents.use', cs: `${P}TALENTS`, oc: 'c', form: 'why', rung: 2, kind: 'use a talent',
    gen: choose([
      C('Achieng draws well. How can she use her talent as God wants?', 'Draw posters for the church and the school', 'Talents are given to serve others, as the parts of one body serve the whole.', ['Draw only to win prizes', 'M_TAL6_SHOW'], ['Hide her drawings from everyone', 'M_TAL6_SHOW'], ['Say the talent came from luck', 'M_TAL6_SOURCE']),
      C('Juma wins a running race and says, "My ability comes from luck." What does the Bible teach?', 'His ability is a gift from God', 'Abilities are gifts from God, as Bezalel\'s skill was.', ['He is right, abilities come from luck', 'M_TAL6_SOURCE'], ['Abilities are only for showing off', 'M_TAL6_SHOW'], ['Only adults receive abilities', 'M_TAL6_SOURCE']),
      C('Which value helps a talent grow?', 'Practice and patience', 'Practice, patience and discipline help a talent grow.', ['Boasting about it', 'M_TAL6_SHOW'], ['Waiting for luck', 'M_TAL6_SOURCE'], ['Hiding it', 'M_TAL6_SHOW']),
      C('Wanjiru sings well. Which choice shows she is using her talent for others?', 'She sings at a sick neighbour\'s bedside', 'A talent is for serving others.', ['She sings only to compare with others', 'M_TAL6_SHOW'], ['She refuses to sing at church', 'M_TAL6_SHOW'], ['She thinks her voice came by luck', 'M_TAL6_SOURCE']),
      C('Why do the parts of the body in Romans 12:4 matter to us?', 'Each person has a different gift and all are needed', 'Different gifts make a whole body that works together.', ['Only one gift is needed', 'M_TAL6_VERSE'], ['Everyone has the same gift', 'M_TAL6_VERSE'], ['Gifts are to be hidden', 'M_TAL6_SHOW']),
    ], H1('Ask: is the gift being used to serve others?', 'Remember Bezalel and the one body with many parts.')) }),

  // ---------------------------------------------------------------- MARRIAGE
  sfam({ id: 'cre6.marriage.facts', cs: `${M}MARRIAGE_BIBLE`, form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What did God use to make the woman (Genesis 2:21-22)?', 'A rib taken from the man', 'Genesis 2:21-22 says God took one of the man\'s ribs and made the woman.', ['The dust of the ground', 'M_MAR6_ORIGIN'], ['A piece of clay from a river', 'M_MAR6_ORIGIN'], ['A branch of the tree of life', 'M_MAR6_ORIGIN']),
      C('What did God do to the man before taking the rib?', 'He put him into a deep sleep', 'Genesis 2:21 says God caused the man to fall into a deep sleep.', ['He woke him up', 'M_MAR6_SLEEP'], ['He sent him on a journey', 'M_MAR6_SLEEP'], ['He gave him a name', 'M_MAR6_SLEEP']),
      C('What does Genesis 2:24 say a man does when he marries?', 'He leaves his father and mother and is joined to his wife', 'Genesis 2:24 says a man leaves his parents and is united to his wife.', ['He stays with his parents and has no change', 'M_MAR6_LEAVE'], ['He leaves his wife with her parents', 'M_MAR6_LEAVE'], ['He lives alone', 'M_MAR6_LEAVE']),
      C('What did the man say when God brought the woman to him?', '"This is now bone of my bones and flesh of my flesh"', 'Genesis 2:23 records that the man called her bone of his bones.', ['"I do not know her"', 'M_MAR6_ORIGIN'], ['"She is made of dust"', 'M_MAR6_ORIGIN'], ['"Take her away"', 'M_MAR6_LEAVE']),
      C('According to Genesis 2:24, what do a man and his wife become?', 'One flesh, joined together', 'Genesis 2:24 says the two become one flesh.', ['Two people who live apart', 'M_MAR6_LEAVE'], ['Brother and sister', 'M_MAR6_LEAVE'], ['Strangers to their families', 'M_MAR6_LEAVE']),
    ], H1('Find Genesis 2:21-24 and read the verse the question names.', 'The woman was made from a rib; the man leaves his parents and is joined to his wife.')) }),
  sfam({ id: 'cre6.marriage.meaning', cs: `${M}MARRIAGE_BIBLE`, form: 'why', rung: 2, kind: 'meaning for today',
    gen: choose([
      C('Why does the Bible say a man leaves his father and mother when he marries?', 'He and his wife start a new family together', 'Marriage forms a new home where the husband and wife are joined.', ['He stops respecting his parents', 'M_MAR6_LEAVE'], ['He moves away to be alone', 'M_MAR6_LEAVE'], ['He makes the woman do all the work', 'M_MAR6_LEAVE']),
      C('The woman was made from the man\'s rib. What does this show?', 'That husband and wife belong together as partners', 'The story shows the closeness of man and woman as partners.', ['That women are made from dust', 'M_MAR6_ORIGIN'], ['That one is better than the other', 'M_MAR6_LEAVE'], ['That God made her by accident', 'M_MAR6_ORIGIN']),
      C('Who brought the woman to the man in Genesis 2:22?', 'God', 'God brought the woman to the man.', ['The man\'s parents', 'M_MAR6_LEAVE'], ['An angel', 'M_MAR6_SLEEP'], ['The man himself', 'M_MAR6_SLEEP']),
      C('Which statement about marriage agrees with Genesis 2:24?', 'Marriage joins a man and a woman as one', 'Genesis 2:24 says the two become one flesh.', ['Marriage is for children who are told to marry', 'M_MAR6_LEAVE'], ['Marriage keeps a man tied only to his parents', 'M_MAR6_LEAVE'], ['Marriage is a trick of the man', 'M_MAR6_ORIGIN']),
      C('Which part of Genesis 2:21-24 shows God\'s care for the man?', 'God made a helper for him', 'God saw it was not good for the man to be alone and made a helper.', ['God left him alone', 'M_MAR6_SLEEP'], ['God sent him away', 'M_MAR6_LEAVE'], ['God made him sleep forever', 'M_MAR6_SLEEP']),
    ], H1('Think about what the verses say about being joined and being one.', 'The rib shows closeness, not that one is better.')) }),

  sfam({ id: 'cre6.earlymarriage.results', cs: `${M}EARLY_MARRIAGE`, oc: 'b', form: 'direct', rung: 1, kind: 'results of early marriage',
    gen: choose([
      C('Which is a result of early marriage for a girl?', 'She may leave school and face health risks of early pregnancy', 'Early marriage often ends school and brings health risks.', ['She gets a better future and more money for her family', 'M_EM6_BENEFIT'], ['She is free from poverty because her husband provides for her', 'M_EM6_BENEFIT'], ['She is safe from all harm', 'M_EM6_BENEFIT']),
      C('In Kenya, at what age may a person marry?', '18 years', 'The law in Kenya says a person must be 18 to marry.', ['14 years', 'M_EM6_RIGHT'], ['16 years', 'M_EM6_RIGHT'], ['Whenever the parents agree', 'M_EM6_RIGHT']),
      C('Which is a negative result of early marriage for a family?', 'It can deepen poverty because the girl stops learning', 'A girl who leaves school has fewer chances to earn a living.', ['It makes the family richer for ever', 'M_EM6_BENEFIT'], ['It always brings peace', 'M_EM6_BENEFIT'], ['It helps the girl finish school faster', 'M_EM6_BENEFIT']),
      C('Who decides when a young person marries, under Kenyan law?', 'The person, when 18 years or older', 'The law sets 18 as the age to marry, and the person must agree.', ['The parents alone, at any age', 'M_EM6_RIGHT'], ['The village elders alone', 'M_EM6_RIGHT'], ['Whoever pays the dowry', 'M_EM6_RIGHT']),
      C('Which is a danger to a girl\'s body in an early marriage?', 'Early pregnancy, which is risky for a young body', 'A girl who is still growing faces health risks in early pregnancy.', ['Better health than other girls', 'M_EM6_BENEFIT'], ['No danger at all', 'M_EM6_BENEFIT'], ['More time at school', 'M_EM6_BENEFIT']),
    ], H1('Think about school, health and the age set by the law.', 'The law in Kenya sets 18 as the age to marry.')) }),
  sfam({ id: 'cre6.earlymarriage.values', cs: `${M}EARLY_MARRIAGE`, oc: 'c', form: 'why', rung: 2, kind: 'values and help',
    gen: choose([
      C('Which value helps a girl avoid early marriage?', 'Courage to say no and to tell an adult', 'Courage and respect for herself help her refuse and seek help.', ['Keeping quiet to respect elders', 'M_EM6_KEEP_QUIET'], ['Giving in to pressure', 'M_EM6_KEEP_QUIET'], ['Believing it will give her a better future', 'M_EM6_BENEFIT']),
      C('Nekesa is told she will be married next month. She is 13. What should she do?', 'Tell a teacher, the chief or call Childline 116', 'A child at risk should tell a safe adult. Help is available, including Childline Kenya 116.', ['Keep quiet to respect her elders', 'M_EM6_KEEP_QUIET'], ['Run away alone at night', 'M_EM6_KEEP_QUIET'], ['Agree because it is the custom', 'M_EM6_RIGHT']),
      C('Which value helps young people wait to marry?', 'Patience and self-control', 'Patience and self-control help us wait for the right time.', ['Rushing to be grown up', 'M_EM6_BENEFIT'], ['Following every friend', 'M_EM6_KEEP_QUIET'], ['Ignoring the law', 'M_EM6_RIGHT']),
      C('A teacher hears of a girl about to be married early. What is the right step?', 'Report to the chief or the children\'s officer', 'A child\'s right to learn and grow must be protected, and reports help.', ['Say nothing to avoid trouble', 'M_EM6_KEEP_QUIET'], ['Tell the girl it is an honour', 'M_EM6_BENEFIT'], ['Pay the dowry', 'M_EM6_RIGHT']),
      C('Which Christian value helps parents protect their daughters?', 'Responsibility and love', 'Responsible and loving parents keep their children in school and safe.', ['Greed for the dowry', 'M_EM6_BENEFIT'], ['Fear of what neighbours say', 'M_EM6_KEEP_QUIET'], ['Pride in the custom', 'M_EM6_RIGHT']),
    ], H1('Choose the answer that protects the child and tells a safe adult.', 'Remember the law sets 18 as the age to marry.')) }),

  // ---------------------------------------------------------------- LEISURE
  sfam({ id: 'cre6.rest.facts', cs: `${L}LEISURE_REST`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('On which day did God rest, according to Genesis 2:2?', 'The seventh day', 'Genesis 2:2 says God rested on the seventh day.', ['The sixth day', 'M_LEI6_DAY'], ['The first day', 'M_LEI6_DAY'], ['The third day', 'M_LEI6_DAY']),
      C('What did God do with the seventh day (Genesis 2:3)?', 'He blessed it and made it holy', 'Genesis 2:3 says God blessed the seventh day and made it holy.', ['He worked all through it', 'M_LEI6_TIRED'], ['He left it empty', 'M_LEI6_IDLE'], ['He gave it to the animals', 'M_LEI6_DAY']),
      C('Why did God rest on the seventh day?', 'He had finished his work of creation', 'Genesis 2:2 says God finished his work and rested.', ['He was tired', 'M_LEI6_TIRED'], ['He was ill', 'M_LEI6_TIRED'], ['He was bored', 'M_LEI6_IDLE']),
      C('What does 1 Timothy 5:13 warn about idleness?', 'It can lead to gossip and meddling in other people\'s affairs', '1 Timothy 5:13 says idle people go about gossiping and being busybodies.', ['It is the best way to rest', 'M_LEI6_IDLE'], ['It brings wealth', 'M_LEI6_IDLE'], ['It makes people kind', 'M_LEI6_IDLE']),
      C('Which sentence about rest agrees with Genesis 2:1-3?', 'Rest is a good gift from God', 'God himself rested and made the day holy, so rest is good.', ['Rest is a waste of time', 'M_LEI6_IDLE'], ['Rest means doing nothing useful', 'M_LEI6_IDLE'], ['Rest is a sign of weakness', 'M_LEI6_TIRED']),
    ], H1('Read Genesis 2:1-3 and 1 Timothy 5:13 and pick what they say.', 'God rested on the seventh day because he had finished, and the day is holy.')) }),
  sfam({ id: 'cre6.rest.meaning', cs: `${L}LEISURE_REST`, oc: 'b', form: 'why', rung: 2, kind: 'why rest is good',
    gen: choose([
      C('Why is rest good for a child?', 'It restores the body and mind and gives time to worship and enjoy family', 'Rest is a gift from God that helps us grow strong.', ['It lets a child do nothing at all and never work again', 'M_LEI6_IDLE'], ['It shows that a child is lazy and does not want to learn', 'M_LEI6_IDLE'], ['It is only for adults', 'M_LEI6_DAY']),
      C('Which child follows God\'s example of rest in a good way?', 'One who rests after work and spends time with family', 'God rested after finishing his work.', ['One who never works but only rests all week long', 'M_LEI6_IDLE'], ['One who rests because God was tired', 'M_LEI6_TIRED'], ['One who gossips all day and does nothing else useful', 'M_LEI6_IDLE']),
      C('A boy says, "God rested because he was tired." What is the correct reply?', 'No, God had finished his work and made the day holy', 'Genesis 2:2-3 says he had finished, and the day is holy.', ['Yes, that is what Genesis says about the seventh day', 'M_LEI6_TIRED'], ['God never rests', 'M_LEI6_DAY'], ['The day was empty and God did nothing with it', 'M_LEI6_IDLE']),
      C('What is the danger of idleness in 1 Timothy 5:13?', 'Gossip and meddling', 'Idleness can lead to gossip and meddling.', ['Too much exercise', 'M_LEI6_IDLE'], ['Too much sleep only', 'M_LEI6_IDLE'], ['Too much prayer', 'M_LEI6_IDLE']),
      C('Which is the best reason to keep a day of rest?', 'God blessed it and made it holy', 'Genesis 2:3 says God blessed the day and made it holy.', ['To avoid all work for ever', 'M_LEI6_IDLE'], ['Because God was too tired to go on', 'M_LEI6_TIRED'], ['To sleep all day', 'M_LEI6_IDLE']),
    ], H1('Rest is a good gift; idleness is the danger.', 'Remember: God finished his work, then rested.')) }),
  sfam({ id: 'cre6.leisure.use', cs: `${L}LEISURE_USE`, oc: 'c', form: 'direct', rung: 1, kind: 'good use or misuse',
    gen: choose([
      C('Which is a good use of free time?', 'Reading, sport or helping at home', 'These build the body, mind and family.', ['Gambling with friends', 'M_LEI6_MISUSE'], ['Staying on the phone all night', 'M_LEI6_MISUSE'], ['Drinking alcohol', 'M_LEI6_MISUSE']),
      C('Which is a misuse of leisure time by young people today?', 'Using drugs or gambling', 'Drugs and gambling harm health and money.', ['Playing football with friends', 'M_LEI6_NO_LIMIT'], ['Visiting a sick neighbour', 'M_LEI6_NO_LIMIT'], ['Reading a good book', 'M_LEI6_NO_LIMIT']),
      C('Otieno spends the whole weekend on his phone and does not do his chores. What is wrong?', 'He is misusing his free time', 'Too much phone time wastes time that could be used well.', ['Nothing, free time has no limits', 'M_LEI6_NO_LIMIT'], ['He is doing what God wants', 'M_LEI6_MISUSE'], ['It is good for his health', 'M_LEI6_MISUSE']),
      C('Which activity is a healthy use of the school holiday?', 'Joining a youth club that plants trees', 'Helping others and caring for creation uses free time well.', ['Drinking with older boys', 'M_LEI6_MISUSE'], ['Gambling at the market', 'M_LEI6_MISUSE'], ['Sitting idle and gossiping', 'M_LEI6_MISUSE']),
      C('Which free-time habit can lead a youth into trouble?', 'Idle gossip and bad company', 'Idleness leads to gossip and wrong choices.', ['Reading the Bible', 'M_LEI6_NO_LIMIT'], ['Helping at home', 'M_LEI6_NO_LIMIT'], ['Practising a hobby', 'M_LEI6_NO_LIMIT']),
    ], H1('Choose the activity that helps the body, mind or others.', 'Drugs, gambling and endless phone time are misuse.')) }),
  sfam({ id: 'cre6.leisure.values', cs: `${L}LEISURE_USE`, oc: 'd', form: 'why', rung: 2, kind: 'values for leisure',
    gen: choose([
      C('Which value helps a youth use leisure well?', 'Self-control', 'Self-control helps us stop and use time well.', ['Doing whatever pleases the group', 'M_LEI6_NO_LIMIT'], ['Following every trend', 'M_LEI6_MISUSE'], ['Never resting', 'M_LEI6_NO_LIMIT']),
      C('Mwende plans her Saturday: chores, some reading, football with friends. Which value does this show?', 'Responsibility and time management', 'Planning time well is responsibility and good use of leisure.', ['Laziness', 'M_LEI6_MISUSE'], ['Wasting time', 'M_LEI6_MISUSE'], ['Selfishness', 'M_LEI6_NO_LIMIT']),
      C('Which Christian value helps you refuse a friend who invites you to gamble?', 'Self-control and courage', 'These values help us say no.', ['Going along to be liked', 'M_LEI6_MISUSE'], ['Staying quiet', 'M_LEI6_MISUSE'], ['Pride', 'M_LEI6_NO_LIMIT']),
      C('Which is the best plan for the holidays?', 'A mix of rest, chores, church and play', 'A balanced plan uses time well.', ['Nothing but sleeping', 'M_LEI6_NO_LIMIT'], ['Only watching videos', 'M_LEI6_MISUSE'], ['Only gambling with friends', 'M_LEI6_MISUSE']),
      C('Why should a young person use free time well?', 'Time is a gift from God that should not be wasted', 'We are stewards of the time God gives.', ['Free time does not matter', 'M_LEI6_NO_LIMIT'], ['Free time is only for sleeping', 'M_LEI6_NO_LIMIT'], ['Free time should be spent on whatever is fun', 'M_LEI6_MISUSE']),
    ], H1('Choose the answer with self-control or responsibility.', 'Free time is a gift to use well.')) }),

  // ---------------------------------------------------------------- THE BIBLE
  sfam({ id: 'cre6.inspired.verse', cs: `${B}INSPIRED_WORD_OF_GOD.INSPIRED`, oc: 'a', form: 'direct', rung: 1, kind: 'what the verse says',
    gen: choose([
      C('What does 2 Timothy 3:16 say about all Scripture?', 'It is God-breathed', '2 Timothy 3:16 says all Scripture is God-breathed.', ['It is only the ideas of wise men', 'M_INS6_HUMAN'], ['It was written by one man', 'M_INS6_ONE'], ['It was written for kings only', 'M_INS6_HUMAN']),
      C('What is Scripture useful for, according to 2 Timothy 3:16?', 'Teaching, rebuking, correcting and training in righteousness', 'The verse lists teaching, rebuking, correcting and training in righteousness.', ['Winning arguments and making money', 'M_INS6_USE'], ['Showing off knowledge', 'M_INS6_USE'], ['Frightening people', 'M_INS6_USE']),
      C('According to 2 Timothy 3:17, what is the result of Scripture for a servant of God?', 'He is equipped for every good work', 'The verse says the servant of God is thoroughly equipped for every good work.', ['He becomes rich', 'M_INS6_USE'], ['He becomes famous', 'M_INS6_USE'], ['He needs no more learning', 'M_INS6_USE']),
      C('How many people wrote the books of the Bible?', 'Many people, inspired by God', 'The Bible has many human authors, inspired by God.', ['One person only', 'M_INS6_ONE'], ['Two people only', 'M_INS6_ONE'], ['Nobody, it fell from the sky', 'M_INS6_HUMAN']),
      C('Which three are authors of books of the Bible?', 'Moses, David and Paul', 'Moses, David and Paul each wrote or are credited with books of the Bible.', ['Solomon, Pilate and Herod', 'M_INS6_ONE'], ['Pilate, Herod and Caesar', 'M_INS6_ONE'], ['Satan, Pilate and Judas', 'M_INS6_HUMAN']),
    ], H1('Find 2 Timothy 3:16-17 and read what Scripture is and what it is for.', 'Inspired means God-breathed.')) }),
  sfam({ id: 'cre6.inspired.meaning', cs: `${B}INSPIRED_WORD_OF_GOD.INSPIRED`, oc: 'b', form: 'why', rung: 2, kind: 'what inspired means',
    gen: choose([
      C('What does it mean that the Bible is inspired by God?', 'God guided the people who wrote it', 'God inspired people who wrote his message.', ['God wrote it himself with no people', 'M_INS6_HUMAN'], ['It is only human ideas', 'M_INS6_HUMAN'], ['One man invented it', 'M_INS6_ONE']),
      C('David wrote many psalms. Which statement is true?', 'David was one of many human authors inspired by God', 'The Bible has many authors, including David.', ['David wrote the whole Bible by himself over many years', 'M_INS6_ONE'], ['Psalms are not in the Bible', 'M_INS6_HUMAN'], ['David was not inspired because he was a king and not a prophet', 'M_INS6_HUMAN']),
      C('Why should a Christian read all of Scripture?', 'It is useful to teach, correct and train us', 'All Scripture is useful for teaching and training.', ['To win every quiz and look clever before others', 'M_INS6_USE'], ['To make others feel small by quoting verses at them', 'M_INS6_USE'], ['To avoid prayer', 'M_INS6_USE']),
      C('Paul wrote many letters in the New Testament. What does this show?', 'God used different people to write his message', 'God inspired many people, including Paul.', ['Only Paul wrote the Bible', 'M_INS6_ONE'], ['The letters are not inspired', 'M_INS6_HUMAN'], ['The Bible has no author', 'M_INS6_HUMAN']),
      C('Which sentence is correct?', 'The Bible has many authors but one message from God', 'Many people wrote, but God inspired them.', ['The Bible has one author only', 'M_INS6_ONE'], ['The Bible is only human writing', 'M_INS6_HUMAN'], ['The Bible is useful only for kings', 'M_INS6_USE']),
    ], H1('Inspired means God guided many people to write.', 'Moses, David and Paul are among the authors.')) }),
  sfam({ id: 'cre6.translation.reasons', cs: `${B}INSPIRED_WORD_OF_GOD.TRANSLATION`, oc: 'c', form: 'direct', rung: 1, kind: 'reasons for translation',
    gen: choose([
      C('Why was the Bible translated into local languages?', 'So people can understand it in their own language', 'People understand best in the language they use at home.', ['So it would be shorter', 'M_TRA6_COST'], ['So only English speakers could read it', 'M_TRA6_ENGLISH'], ['To change its message', 'M_TRA6_CHANGE']),
      C('Does translating the Bible change its message?', 'No, it puts the same message into another language', 'Translators carry the same message into a new language.', ['Yes, each translation has a new message', 'M_TRA6_CHANGE'], ['Yes, it makes the Bible shorter', 'M_TRA6_COST'], ['Yes, it removes the hard parts', 'M_TRA6_CHANGE']),
      C('Which is a reason for translating the Bible?', 'To spread the gospel to more people', 'Translation helps more people hear and read the gospel.', ['To hide it from some people who might misunderstand', 'M_TRA6_ENGLISH'], ['To save paper', 'M_TRA6_COST'], ['To make it harder to read for those who speak English', 'M_TRA6_CHANGE']),
      C('Which is also a reason for translating the Bible?', 'So families can read it at home in their own language', 'People can read and discuss it in small groups and at home.', ['Because only English is a holy language for the Bible', 'M_TRA6_ENGLISH'], ['To make it a secret book that only leaders may read', 'M_TRA6_CHANGE'], ['To cut out parts', 'M_TRA6_COST']),
      C('Which sentence about translation is false?', 'Translation changes the message of the Bible', 'Translation does not change the message. It puts it in another language.', ['Translation helps people understand', 'M_TRA6_CHANGE'], ['Translation helps spread the gospel', 'M_TRA6_ENGLISH'], ['Translation helps people read at home', 'M_TRA6_COST']),
    ], H1('Think: translation helps people understand and does not change the message.', 'Look for the reason about understanding.')) }),
  sfam({ id: 'cre6.translation.advantages', cs: `${B}INSPIRED_WORD_OF_GOD.TRANSLATION`, oc: 'd', form: 'why', rung: 2, kind: 'advantages',
    gen: choose([
      C('Which is an advantage of reading the Bible in your own language?', 'You understand it better and more people can read it', 'Reading in your language helps understanding.', ['It becomes a shorter book with the hard parts removed', 'M_TRA6_COST'], ['It is not the real Bible', 'M_TRA6_CHANGE'], ['You can skip the parts you dislike and keep the rest', 'M_TRA6_CHANGE']),
      C('A grandmother can read only Kikuyu. How does a Kikuyu Bible help her?', 'She can read God\'s word herself and grow in faith', 'Translation lets people read for themselves.', ['It changes God\'s word for her', 'M_TRA6_CHANGE'], ['It is a lesser Bible', 'M_TRA6_ENGLISH'], ['It makes the Bible cheap', 'M_TRA6_COST']),
      C('Which advantage helps teaching in church?', 'Everyone in the congregation understands the reading', 'A translated Bible can be read aloud and understood by all.', ['Only the pastor understands the reading in the church', 'M_TRA6_ENGLISH'], ['The message becomes different for each language group', 'M_TRA6_CHANGE'], ['It saves money', 'M_TRA6_COST']),
      C('Which is an advantage of translating into many languages?', 'More people can come to know God\'s word', 'Translation makes the Bible available to more people.', ['Fewer people read it', 'M_TRA6_ENGLISH'], ['The Bible gets lost', 'M_TRA6_CHANGE'], ['It is no longer inspired', 'M_TRA6_CHANGE']),
      C('Which statement is true of a translated Bible?', 'It carries the same message as the first one', 'Translation puts the same message into another language.', ['It carries a new message that is different from the first', 'M_TRA6_CHANGE'], ['It is only for children who cannot read the first Bible', 'M_TRA6_ENGLISH'], ['It is not holy', 'M_TRA6_ENGLISH']),
    ], H1('Pick the advantage that is about understanding and reach.', 'A translation does not change the message.')) }),

  // ---------------------------------------------------------------- TEN COMMANDMENTS
  sfam({ id: 'cre6.ten.outline', cs: `${B}THE_TEN_COMMANDMENTS.TEN_OUTLINE`, oc: 'a', form: 'direct', rung: 1, kind: 'what the commands say',
    gen: choose([
      C('Which of these is one of the Ten Commandments?', 'Honour your father and your mother', 'Exodus 20 says to honour your father and mother.', ['Give a tenth of your harvest', 'M_TEN6_OTHER_LAW'], ['Pray three times a day', 'M_TEN6_INVENTED'], ['Always eat before praying', 'M_TEN6_INVENTED']),
      C('Which of these is one of the Ten Commandments?', 'You shall not steal', 'Exodus 20 forbids stealing.', ['Wear a white robe on holy days', 'M_TEN6_INVENTED'], ['Give a tenth of your harvest', 'M_TEN6_OTHER_LAW'], ['Pray three times a day', 'M_TEN6_INVENTED']),
      C('Which of these is not in the Ten Commandments?', 'Pray three times a day', 'The Ten Commandments in Exodus 20:3-17 do not set the number of daily prayers.', ['You shall not kill', 'M_TEN6_OTHER_LAW'], ['You shall not give false witness', 'M_TEN6_OTHER_LAW'], ['Remember the day of rest', 'M_TEN6_OTHER_LAW']),
      C('Otieno takes a pen that is not his. Which command does that break?', 'You shall not steal', 'Taking what belongs to someone else breaks the command not to steal.', ['You shall not give false witness', 'M_TEN6_WRONG_MATCH'], ['Honour your father and your mother', 'M_TEN6_WRONG_MATCH'], ['Remember the day of rest', 'M_TEN6_WRONG_MATCH']),
      C('Wanjiru tells the teacher a lie about a friend. Which command does that break?', 'You shall not give false witness', 'Telling a lie about someone breaks the command not to give false witness.', ['You shall not steal', 'M_TEN6_WRONG_MATCH'], ['You shall not kill', 'M_TEN6_WRONG_MATCH'], ['Honour your father and your mother', 'M_TEN6_WRONG_MATCH']),
      C('Which of these is not in the Ten Commandments?', 'Give a tenth of your harvest', 'The tithe is a different law. It is not one of the Ten Commandments of Exodus 20.', ['You shall have no other gods', 'M_TEN6_OTHER_LAW'], ['You shall not covet', 'M_TEN6_OTHER_LAW'], ['Honour your father and your mother', 'M_TEN6_OTHER_LAW']),
    ], H1('Remember Exodus 20:3-17 and pick what it contains.', 'A law found in another part of the Bible is not one of the Ten.')) }),
  sfam({ id: 'cre6.ten.situation', cs: `${B}THE_TEN_COMMANDMENTS.TEN_OUTLINE`, oc: 'a', form: 'why', rung: 2, kind: 'a situation and a command',
    gen: choose([
      C('Baraka wants his friend\'s new bicycle and plans to take it. Which command is he about to break?', 'You shall not steal', 'Taking a friend\'s bicycle is stealing.', ['Honour your father and your mother', 'M_TEN6_WRONG_MATCH'], ['Remember the day of rest', 'M_TEN6_WRONG_MATCH'], ['You shall not give false witness', 'M_TEN6_WRONG_MATCH']),
      C('Amina talks back rudely to her mother. Which command is she breaking?', 'Honour your father and your mother', 'Disrespect to a parent breaks the command to honour them.', ['You shall not steal', 'M_TEN6_WRONG_MATCH'], ['You shall not kill', 'M_TEN6_WRONG_MATCH'], ['You shall have no other gods', 'M_TEN6_WRONG_MATCH']),
      C('Kamau says, "Give a tenth of everything is one of the Ten Commandments." Is he right?', 'No, the tithe is a different law', 'The Ten Commandments of Exodus 20 do not include the tithe.', ['Yes, it is the eighth', 'M_TEN6_OTHER_LAW'], ['Yes, it is the first', 'M_TEN6_OTHER_LAW'], ['Yes, but only for adults', 'M_TEN6_OTHER_LAW']),
      C('Mwende says, "Praying three times a day is a commandment in Exodus 20." Is she right?', 'No, Exodus 20 does not say this', 'The Ten Commandments do not set the number of daily prayers.', ['Yes, it is in Exodus 20', 'M_TEN6_INVENTED'], ['Yes, it is the first commandment', 'M_TEN6_INVENTED'], ['Yes, but only for children', 'M_TEN6_INVENTED']),
      C('A child envies a neighbour\'s new things and wants them. Which command speaks to this?', 'You shall not covet', 'To covet is to long for what belongs to another.', ['You shall not steal', 'M_TEN6_WRONG_MATCH'], ['Honour your father and your mother', 'M_TEN6_WRONG_MATCH'], ['Remember the day of rest', 'M_TEN6_WRONG_MATCH']),
    ], H1('Say what the child is doing, then find the command about it.', 'Not every law in the Bible is in Exodus 20.')) }),
  sfam({ id: 'cre6.ten.values', cs: `${B}THE_TEN_COMMANDMENTS.TEN_VALUES`, oc: 'b', form: 'direct', rung: 1, kind: 'command and value',
    gen: choose([
      C('Which value does "honour your father and your mother" teach?', 'Respect', 'Honouring parents teaches respect.', ['Honesty', 'M_TEN6_VALUE'], ['Courage', 'M_TEN6_VALUE'], ['Wealth', 'M_TEN6_VALUE']),
      C('Which value does "you shall not steal" teach?', 'Honesty', 'Not stealing teaches honesty.', ['Respect', 'M_TEN6_VALUE'], ['Courage', 'M_TEN6_VALUE'], ['Patience', 'M_TEN6_VALUE']),
      C('Which value does "you shall not give false witness" teach?', 'Truthfulness', 'Not giving false witness teaches telling the truth.', ['Generosity', 'M_TEN6_VALUE'], ['Obedience only', 'M_TEN6_VALUE'], ['Strength', 'M_TEN6_VALUE']),
      C('Which value does "you shall not covet" teach?', 'Contentment', 'Not coveting teaches being content with what we have.', ['Greed', 'M_TEN6_VALUE'], ['Boldness', 'M_TEN6_VALUE'], ['Speed', 'M_TEN6_VALUE']),
      C('Which value does "you shall not kill" teach?', 'Respect for life', 'It teaches that all life is valuable.', ['Winning', 'M_TEN6_VALUE'], ['Cleverness', 'M_TEN6_VALUE'], ['Wealth', 'M_TEN6_VALUE']),
    ], H1('Link each command to the value it protects.', 'Honesty and truthfulness are not the same value.')) }),
  sfam({ id: 'cre6.ten.lessons', cs: `${B}THE_TEN_COMMANDMENTS.TEN_VALUES`, oc: 'c', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('What do the Ten Commandments guide?', 'How we treat God and how we treat other people', 'Some commands are about God and some are about other people.', ['Only how we worship God', 'M_TEN6_RELIGIOUS_ONLY'], ['Only how we treat our parents', 'M_TEN6_RELIGIOUS_ONLY'], ['Only the rules of the church building', 'M_TEN6_RELIGIOUS_ONLY']),
      C('Which lesson from the commands helps a school?', 'Be honest, respect others and do not take what is not yours', 'These values help a school live in peace.', ['Care only about your own things and keep them for yourself', 'M_TEN6_VALUE'], ['Obey the rules only when a teacher is watching you', 'M_TEN6_RELIGIOUS_ONLY'], ['Compete at any cost, even if you must cheat to win', 'M_TEN6_VALUE']),
      C('Juma finds money on the road and hands it to the teacher. Which value does he show?', 'Honesty', 'He chose not to steal what was not his.', ['Greed', 'M_TEN6_VALUE'], ['Laziness', 'M_TEN6_VALUE'], ['Fear only', 'M_TEN6_VALUE']),
      C('Why do we keep a day of rest and worship?', 'To honour God and renew ourselves', 'The command to rest teaches us to worship and keep self-control with our time.', ['Because work is evil and rest is the only good thing', 'M_TEN6_RELIGIOUS_ONLY'], ['Only to avoid work and spend the day doing nothing', 'M_TEN6_RELIGIOUS_ONLY'], ['To avoid learning', 'M_TEN6_VALUE']),
      C('Which sentence best sums up the Ten Commandments?', 'They teach us to love God and respect others', 'The commands guide love for God and for neighbour.', ['They are rules only for priests', 'M_TEN6_RELIGIOUS_ONLY'], ['They are only about money', 'M_TEN6_VALUE'], ['They have no use today', 'M_TEN6_RELIGIOUS_ONLY']),
    ], H1('The commands guide both our worship and our dealings with people.', 'Think about the value a good choice shows.')) }),

  // ---------------------------------------------------------------- SAMSON
  sfam({ id: 'cre6.samson.facts', cs: `${B}BIBLE_STORIES_SAMSON_DEF.SAMSON`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What came on Samson with power when the Philistines shouted (Judges 15:14)?', 'The Spirit of the Lord', 'Judges 15:14 says the Spirit of the Lord came upon him in power.', ['His own anger and muscles', 'M_SAM6_OWN'], ['A sword from heaven', 'M_SAM6_WEAPON'], ['A band of soldiers', 'M_SAM6_OWN']),
      C('What happened to the ropes on Samson\'s arms (Judges 15:14)?', 'They became like burnt flax and fell off', 'The ropes became like burnt flax and dropped from his hands.', ['They got tighter', 'M_SAM6_OWN'], ['They turned to gold', 'M_SAM6_OWN'], ['They were cut by the Philistines', 'M_SAM6_OWN']),
      C('What did Samson use to strike the Philistines (Judges 15:15)?', 'The jawbone of a donkey', 'He found a fresh jawbone of a donkey.', ['A sword', 'M_SAM6_WEAPON'], ['A spear', 'M_SAM6_WEAPON'], ['A club of wood', 'M_SAM6_WEAPON']),
      C('How many men did Samson kill with it (Judges 15:15)?', 'One thousand', 'Judges 15:15 says he killed a thousand men.', ['One hundred', 'M_SAM6_NUMBER'], ['Ten', 'M_SAM6_NUMBER'], ['Three thousand', 'M_SAM6_NUMBER']),
      C('Which people came shouting against Samson in Judges 15:14?', 'The Philistines', 'The Philistines came shouting.', ['The Egyptians', 'M_SAM6_OWN'], ['The Romans', 'M_SAM6_OWN'], ['The Assyrians', 'M_SAM6_OWN']),
    ], H1('Read Judges 15:14-17 and find what the verse names.', 'The Spirit of the Lord, burnt flax, a donkey\'s jawbone, a thousand men.')) }),
  sfam({ id: 'cre6.samson.lessons', cs: `${B}BIBLE_STORIES_SAMSON_DEF.SAMSON`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Where did Samson\'s strength come from?', 'From the Lord', 'The Spirit of the Lord gave him power.', ['From his own muscles', 'M_SAM6_OWN'], ['From the jawbone', 'M_SAM6_WEAPON'], ['From luck', 'M_SAM6_OWN']),
      C('What can Christians learn from the story of Samson?', 'To depend on God to overcome challenges', 'Samson\'s power came from God, and God helps us in hard times.', ['To trust only in our own strength', 'M_SAM6_OWN'], ['To fight whenever we are angry', 'M_SAM6_OWN'], ['To rely on weapons', 'M_SAM6_WEAPON']),
      C('Kamau faces a very hard exam. Which lesson from Samson helps him?', 'Ask God for strength and do his best', 'We depend on God and work hard.', ['Trust only in himself', 'M_SAM6_OWN'], ['Give up at once', 'M_SAM6_OWN'], ['Find a weapon', 'M_SAM6_WEAPON']),
      C('A friend says, "Samson was strong because of luck." What should you say?', 'No, the Spirit of the Lord gave him power', 'Judges 15:14 says the Spirit of the Lord came upon him.', ['Yes, you are right', 'M_SAM6_OWN'], ['It was because of his sword', 'M_SAM6_WEAPON'], ['It was because of his friends', 'M_SAM6_OWN']),
      C('Which sentence is a lesson from Samson\'s story?', 'God can give strength in difficult times', 'Samson depended on God\'s strength.', ['Strength comes from fighting often', 'M_SAM6_OWN'], ['One thousand men is a small number', 'M_SAM6_NUMBER'], ['Weapons win every fight', 'M_SAM6_WEAPON']),
    ], H1('The power came from the Spirit of the Lord.', 'The lesson is dependence on God.')) }),

  // ---------------------------------------------------------------- ELISHA
  sfam({ id: 'cre6.elisha.facts', cs: `${B}FAITH_IN_GOD_ELISHA.ELISHA`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('Where were the prophets cutting down trees (2 Kings 6:1-4)?', 'By the Jordan', 'They went to the Jordan to cut logs.', ['By a lake', 'M_ELI6_OWNER'], ['In the desert', 'M_ELI6_OWNER'], ['On a mountain', 'M_ELI6_OWNER']),
      C('What fell into the water (2 Kings 6:5)?', 'The iron axe head', 'The iron axe head fell into the water.', ['A sack of grain', 'M_ELI6_OWNER'], ['A basket', 'M_ELI6_OWNER'], ['A sword', 'M_ELI6_OWNER']),
      C('Whose axe head fell into the water?', 'It belonged to a man who had borrowed it', '2 Kings 6:5 says "It was borrowed!"', ['It was Elisha\'s own axe', 'M_ELI6_OWNER'], ['It was a king\'s axe', 'M_ELI6_OWNER'], ['It belonged to nobody', 'M_ELI6_OWNER']),
      C('How was the axe head recovered (2 Kings 6:6)?', 'Elisha threw in a stick and the iron floated', 'Elisha cut a stick, threw it in, and the iron floated.', ['Elisha dived in and found it', 'M_ELI6_SWIM'], ['A man dug it out of the mud', 'M_ELI6_SWIM'], ['God made a new axe', 'M_ELI6_SWIM']),
      C('What did Elisha say to the man at the end (2 Kings 6:7)?', '"Lift it out"', 'Elisha told the man to lift it out and he picked it up.', ['"Leave it there"', 'M_ELI6_SWIM'], ['"Buy a new one"', 'M_ELI6_SWIM'], ['"It is lost for ever"', 'M_ELI6_SMALL']),
    ], H1('Read 2 Kings 6:1-7 and pick what the verse says.', 'A borrowed axe, a stick, and iron that floated.')) }),
  sfam({ id: 'cre6.elisha.faith', cs: `${B}FAITH_IN_GOD_ELISHA.ELISHA`, oc: 'b', form: 'why', rung: 2, kind: 'lessons on faith',
    gen: choose([
      C('What does the story teach about small problems?', 'We can take even small needs to God', 'God cared about a borrowed axe head.', ['God cares only about big problems', 'M_ELI6_SMALL'], ['We should hide small problems', 'M_ELI6_SMALL'], ['Only prophets may ask God', 'M_ELI6_SMALL']),
      C('Nekesa loses a borrowed book. Which lesson from Elisha helps her?', 'Tell the truth and ask God and her teacher to help', 'The man told Elisha it was borrowed. We can be honest and trust God.', ['Hide it and hope that nobody finds out about it', 'M_ELI6_SMALL'], ['Blame someone else so that she does not get in trouble', 'M_ELI6_SMALL'], ['Say it does not matter', 'M_ELI6_SMALL']),
      C('Which sentence shows faith like Elisha\'s?', 'Believing God can help when we are in need', 'Elisha trusted God to help.', ['Believing only in our own cleverness', 'M_ELI6_SWIM'], ['Believing there is no help', 'M_ELI6_SMALL'], ['Believing luck will help', 'M_ELI6_SWIM']),
      C('What does the floating iron show?', 'God has power over things that seem impossible', 'Iron does not float, but God made it float.', ['Iron always floats', 'M_ELI6_SWIM'], ['A stick has magic', 'M_ELI6_SWIM'], ['The man was a good swimmer', 'M_ELI6_SWIM']),
      C('How can a child show faith in God when something goes wrong?', 'Pray and trust, and do what is right', 'We pray and trust God and act rightly.', ['Give up at once', 'M_ELI6_SMALL'], ['Blame others', 'M_ELI6_SMALL'], ['Hide the problem', 'M_ELI6_SMALL']),
    ], H1('Choose the answer that takes the problem to God and tells the truth.', 'God cares about small needs too.')) }),

  // ---------------------------------------------------------------- JACOB
  sfam({ id: 'cre6.jacob.facts', cs: `${B}JACOB_WRESTLES_AN_ANGEL.JACOB`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('Which river did Jacob\'s family cross (Genesis 32:22)?', 'The Jabbok', 'Genesis 32:22 says they crossed the ford of the Jabbok.', ['The Jordan', 'M_JAC6_PLACE'], ['The Nile', 'M_JAC6_PLACE'], ['The Tigris', 'M_JAC6_PLACE']),
      C('How long did the man wrestle with Jacob (Genesis 32:24)?', 'Until daybreak', 'The man wrestled with him until daybreak.', ['For one hour', 'M_JAC6_WON'], ['For a whole week', 'M_JAC6_WON'], ['Only a moment', 'M_JAC6_WON']),
      C('What did Jacob say to the man (Genesis 32:26)?', '"I will not let you go unless you bless me"', 'Jacob refused to let go until he was blessed.', ['"Please let me go"', 'M_JAC6_WON'], ['"I am stronger than you"', 'M_JAC6_WON'], ['"I do not need a blessing"', 'M_JAC6_WON']),
      C('What new name did Jacob receive (Genesis 32:28)?', 'Israel', 'The man said, "Your name will no longer be Jacob, but Israel."', ['Isaac', 'M_JAC6_NAME'], ['Esau', 'M_JAC6_NAME'], ['Abraham', 'M_JAC6_NAME']),
      C('What did Jacob call the place (Genesis 32:30)?', 'Peniel', 'He named the place Peniel, because he had seen God face to face.', ['Bethel', 'M_JAC6_PLACE'], ['Jabbok', 'M_JAC6_PLACE'], ['Hebron', 'M_JAC6_PLACE']),
    ], H1('Read Genesis 32:22-30 and find the detail asked.', 'The Jabbok, daybreak, "I will not let you go unless you bless me", Israel, Peniel.')) }),
  sfam({ id: 'cre6.jacob.lessons', cs: `${B}JACOB_WRESTLES_AN_ANGEL.JACOB`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Why was Jacob blessed?', 'He held on and asked for a blessing', 'Jacob was blessed because he refused to let go until he was blessed.', ['He was stronger than the man', 'M_JAC6_WON'], ['He wrestled the whole night and won', 'M_JAC6_WON'], ['He ran away', 'M_JAC6_WON']),
      C('What lesson does Jacob teach us about prayer?', 'Be persistent and do not give up', 'Jacob did not let go until he was blessed.', ['Pray once and stop', 'M_JAC6_WON'], ['Pray only when strong', 'M_JAC6_WON'], ['Prayer is a contest', 'M_JAC6_WON']),
      C('Which value did Jacob show?', 'Persistence', 'He held on until he received a blessing.', ['Laziness', 'M_JAC6_WON'], ['Pride in his strength', 'M_JAC6_WON'], ['Carelessness', 'M_JAC6_WON']),
      C('Mwende prays every day for her sick grandmother and does not give up. Whom does she follow?', 'Jacob, who kept holding on', 'Persistence in prayer follows Jacob.', ['Samson, who used a jawbone', 'M_JAC6_WON'], ['Elisha, who cut a stick', 'M_JAC6_WON'], ['No one in the Bible', 'M_JAC6_WON']),
      C('What does the new name Israel show?', 'God gave Jacob a new beginning and a blessing', 'God changed his name and blessed him.', ['That he won a prize', 'M_JAC6_NAME'], ['That he was tired', 'M_JAC6_NAME'], ['That he was a thief', 'M_JAC6_NAME']),
    ], H1('Jacob was blessed because he persisted, not because he was stronger.', 'Persistence in prayer is the lesson.')) }),
];
