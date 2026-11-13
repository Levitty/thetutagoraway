// ============================================================================
// CHRISTIAN RELIGIOUS EDUCATION GRADE 8: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/cre/g8.json by scripts/build-cre-g8.mjs. KICD's outcomes and rubrics are never touched.
// Rules: only widely agreed Bible facts are asked, each stated in the named passage; no denominational claims; values, attitudes, praying,
// applying and community service are for teacher judgement, never scored by a tap; sensitive topics (abuse, sexuality, life and death,
// bullying) ask for knowledge and safe, caring responses only, never detail, and always name a trusted adult. Suicide and abortion are not
// asked about as causes: only the sacredness of life and where to seek help.
// Skill codes start CRES (four capitals the registry needs); the official outcome codes stay CRE.G8.
// Everything is draft until a CRE teacher who knows the school's tradition reviews it.
// A skill: [sub-strand key after 'CRE.G8.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const OS = 'CREATI.ORIGIN_AND_CONSEQUENCES_', RD = 'CREATI.GOD_S_PLAN_FOR_REDEMPTIO';
const AB = 'THE_BI.FAITH_AND_GOD_S_PROMISES', CV = 'THE_BI.ABRAHAMIC_COVENANT', KS = 'THE_BI.LEADERSHIP_IN_ISRAEL_SAU';
const BA = 'THE_LI.HEALING_OF_BLIND_BARTIMA', ST = 'THE_LI.CALMING_THE_STORM', PA = 'THE_LI.HEALING_OF_THE_PARALYTIC';
const PR = 'TEACHI.TEACHINGS_ON_PRAYER', LS = 'TEACHI.THE_LOST_SHEEP', HS = 'THE_CH.THE_HOLY_SPIRIT', AC = 'THE_CH.ACTS_OF_COMPASSION';
const FR = 'CHRIST.FAMILY_RELATIONSHIPS', SX = 'CHRIST.HUMAN_SEXUALITY_RESPONSI', SL = 'CHRIST.SACREDNESS_OF_LIFE', BU = 'CHRIST.BULLYING', TA = 'CHRIST.WORK_TALENTS_GIFTS_AND_A', LE = 'CHRIST.LEISURE';
const FM = ['pick the right answer', 'pick the right answer in a short story', 'find the false step in a learner\'s reason'];
export const SKILLS = [
  [OS, 'SIN_ORIGIN', 'Tell the origin and consequences of sin (Genesis 3)', ['a', 'b'], [], FM, 'The child says Adam and Eve ate the fruit God had forbidden after the serpent tempted them (Genesis 3), and that the results were shame, being sent out of the garden, hard work, pain and death, and separation from God.'],
  [RD, 'REDEMPTION', 'Say how God showed love after the fall and planned salvation', ['a', 'b', 'c'], ['SIN_ORIGIN'], FM, 'The child says God made clothes for Adam and Eve (Genesis 3:21), promised that the woman\'s offspring would defeat the serpent (Genesis 3:15), and that Christians believe He sent Jesus to save people (John 3:16).'],
  [AB, 'ABRAHAM_FAITH', 'Tell the call of Abraham and his faith', ['a', 'b'], [], FM, 'The child says God called Abram to leave his country and go to a land God would show him (Genesis 12:1-4), and he obeyed, and that he showed faith by trusting God when he was told to offer Isaac and God provided a ram (Genesis 22).'],
  [AB, 'ABRAHAM_PROMISES', 'Name God\'s promises to Abraham', ['d', 'e'], ['ABRAHAM_FAITH'], FM, 'The child names the promises of a land, many descendants, a great name, and a blessing for all families of the earth (Genesis 12:1-3), and says Christians trust God to keep His promises.'],
  [CV, 'COVENANT_ABRAHAM', 'Say what the covenant with Abraham was and its sign', ['b', 'c', 'd'], ['ABRAHAM_PROMISES'], FM, 'The child says a covenant is a binding agreement, God made a covenant with Abraham (Genesis 15 and 17) promising land and descendants, and circumcision was the sign of that covenant for his descendants (Genesis 17:10-11).'],
  [KS, 'KINGSHIP_ISRAEL', 'Give reasons for and against kingship in Israel', ['a', 'b'], [], FM, 'The child says Israel asked for a king because Samuel was old, his sons did not follow his ways and they wanted to be like other nations (1 Samuel 8), and Samuel warned a king would take their sons, daughters and land for himself.'],
  [KS, 'SAUL_FAILURES', 'Name Saul\'s failures and their consequences', ['c', 'd'], ['KINGSHIP_ISRAEL'], FM, 'The child says Saul offered the sacrifice himself instead of waiting for Samuel (1 Samuel 13) and spared the best of the Amalekites\' flocks against God\'s command (1 Samuel 15), and so God rejected him as king.'],
  [BA, 'BARTIMAEUS', 'Tell the healing of blind Bartimaeus', ['a', 'b'], [], FM, 'The child says Bartimaeus was a blind beggar beside the road at Jericho who called out "Son of David, have mercy on me", Jesus called him, asked what he wanted and said his faith had healed him, and he followed Jesus (Mark 10:46-52).'],
  [ST, 'CALMING_STORM', 'Tell the calming of the storm', ['a', 'b'], [], FM, 'The child says Jesus was asleep in the boat when a storm rose on the lake, the disciples woke Him in fear, He told the wind and waves to be still, and asked why they had so little faith (Mark 4:35-41).'],
  [PA, 'PARALYTIC', 'Tell the healing of the paralytic', ['a', 'b', 'c'], [], FM, 'The child says four friends lowered a paralysed man through the roof because of the crowd, Jesus first told him his sins were forgiven, the teachers of the law objected, and Jesus then told him to take up his mat and walk (Mark 2:1-12).'],
  [PR, 'PRAYER', 'Say what Jesus taught about prayer', ['a', 'b'], [], FM, 'The child says Jesus taught the Lord\'s Prayer (Matthew 6:9-13), to pray with faith (Mark 11:24) and to keep on praying, as in the story of the friend at midnight (Luke 11:5-10).'],
  [LS, 'LOST_SHEEP', 'Tell the parable of the lost sheep', ['a'], [], FM, 'The child says a shepherd with a hundred sheep left the ninety-nine to look for the one that was lost, rejoiced when he found it, and that there is joy in heaven over one sinner who repents (Luke 15:1-7).'],
  [HS, 'HOLY_SPIRIT', 'Tell Pentecost and name the fruit of the Spirit', ['a', 'b'], [], FM, 'The child says on the day of Pentecost the Holy Spirit came on the disciples with a sound like wind and tongues like fire and they spoke in other languages (Acts 2), and names the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control (Galatians 5:22-23).'],
  [AC, 'COMPASSION', 'Tell the acts of compassion in Matthew 25', ['a', 'c', 'e'], [], FM, 'The child says in Matthew 25:31-46 the king welcomes those who fed the hungry, gave drink to the thirsty, welcomed strangers, clothed the naked, and visited the sick and prisoners, saying whatever was done for the least was done for Him.'],
  [FR, 'FAMILY_ROLES', 'Name family roles, causes of conflict and healthy practices', ['a', 'b', 'c', 'e'], [], FM, 'The child names roles of parents (providing, guiding, caring) and children (obeying and helping), healthy practices (talking, sharing duties, forgiving) and causes of conflict (selfishness, lack of listening, quarrels over money), and says children honour parents (Ephesians 6:1-3).'],
  [SX, 'ABUSE_SAFETY', 'Know how to stay safe from abuse and where to get help', ['a', 'd'], [], FM, 'The child says abuse means someone hurting, frightening or taking advantage of a child, and says a child who is unsafe or unsure tells a trusted adult such as a parent, teacher or counsellor, and does not keep it secret; values such as self-control and respect keep people safe.'],
  [SL, 'LIFE_SACRED', 'Tell why life is sacred and where to get help', ['a', 'b', 'c'], [], FM, 'The child says life is a gift from God, people are made in His image (Genesis 1:27), and "You shall not murder" (Exodus 20:13), and that a person who feels hopeless should tell a trusted adult or counsellor straight away.'],
  [BU, 'BULLYING', 'Name causes and effects of bullying and values that stop it', ['a', 'b', 'c'], [], FM, 'The child names causes (wanting power, jealousy, copying others) and effects (fear, low marks, loneliness), and values from the Bible such as kindness (Ephesians 4:32) and treating others as you wish to be treated (Luke 6:31), and says to tell a trusted adult.'],
  [TA, 'TALENTS_PARABLE', 'Tell the parable of the talents', ['c', 'd'], [], FM, 'The child says the master gave servants five, two and one talents, the first two traded and doubled theirs, the third buried his, and the master praised the faithful servants and rebuked the one who did nothing (Matthew 25:14-30).'],
  [LE, 'LEISURE', 'Tell constructive use of leisure from misuse', ['a', 'b', 'c', 'd'], [], FM, 'The child says leisure is free time, names misuse (too much idleness, gambling, drugs, too many games) and its effects (poor school work, poor health) and constructive uses (reading, sport, hobbies, helping at home, rest), and says God gave a day of rest (Exodus 20:8-10).'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_CR8_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('SIN_ORIGIN', 'SO_FRUIT', 'Says the forbidden thing was something else.', 'What did Adam and Eve eat that God had forbidden?', 'Honey from the garden', 'Fruit of the tree of knowledge', 'They ate the forbidden fruit.'),
  m('SIN_ORIGIN', 'SO_TEMPT', 'Says God tempted them.', 'Who tempted Eve in the garden?', 'God', 'The serpent', 'The serpent tempted Eve.'),
  m('SIN_ORIGIN', 'SO_RESULT', 'Gives a good result of the fall.', 'What was a result of the fall?', 'They stayed in the garden for ever', 'They were sent out of the garden', 'They were sent out of Eden.'),
  m('REDEMPTION', 'RD_CLOTHES', 'Says God abandoned them.', 'What did God do for Adam and Eve after the fall?', 'Left them without help', 'Made clothes for them', 'God made clothes for them.'),
  m('REDEMPTION', 'RD_JOHN', 'Misquotes John 3:16.', 'What does John 3:16 say God gave?', 'A new garden', 'His only Son', 'God gave His only Son.'),
  m('REDEMPTION', 'RD_WHY', 'Does not know why redemption matters.', 'Why is redemption important?', 'It is not important', 'It restores people to God', 'Redemption restores people to God.'),
  m('ABRAHAM_FAITH', 'AF_CALL', 'Gives the wrong instruction.', 'What did God tell Abram to do?', 'Stay in his country', 'Leave his country for a land God would show', 'God told him to leave his country.'),
  m('ABRAHAM_FAITH', 'AF_ISAAC', 'Says Isaac was sacrificed.', 'What did God provide instead of Isaac?', 'A lamb of Isaac\'s age', 'A ram', 'God provided a ram.'),
  m('ABRAHAM_FAITH', 'AF_FAITH', 'Says Abraham doubted and refused.', 'How did Abraham respond to God\'s call?', 'He refused', 'He obeyed', 'Abraham obeyed.'),
  m('ABRAHAM_PROMISES', 'AP_LAND', 'Names a wrong promise.', 'Which was a promise to Abraham?', 'Great wealth in gold only', 'Many descendants', 'God promised many descendants.'),
  m('ABRAHAM_PROMISES', 'AP_BLESS', 'Says only Abraham would be blessed.', 'Who would be blessed through Abraham?', 'Only his family', 'All families of the earth', 'All families would be blessed.'),
  m('ABRAHAM_PROMISES', 'AP_TRUST', 'Says promises are useless today.', 'Why do Christians value God\'s promises?', 'They are useless', 'They can trust God to keep them', 'Christians trust God\'s promises.'),
  m('COVENANT_ABRAHAM', 'CA_MEANING', 'Thinks a covenant is a gift.', 'What is a covenant?', 'A free gift', 'A binding agreement', 'A covenant is a binding agreement.'),
  m('COVENANT_ABRAHAM', 'CA_SIGN', 'Gives the wrong sign.', 'What was the sign of God\'s covenant with Abraham?', 'A rainbow', 'Circumcision', 'Circumcision was the sign.'),
  m('COVENANT_ABRAHAM', 'CA_NAME', 'Gives the wrong new name.', 'What was Abram renamed?', 'Isaac', 'Abraham', 'Abram became Abraham.'),
  m('KINGSHIP_ISRAEL', 'KI_REASON', 'Gives a wrong reason for asking for a king.', 'Why did Israel ask for a king?', 'Samuel was young', 'Samuel was old and his sons did not follow his ways', '1 Samuel 8 gives this reason.'),
  m('KINGSHIP_ISRAEL', 'KI_WARNING', 'Says Samuel welcomed a king.', 'What did Samuel warn a king would do?', 'Give them gifts', 'Take their sons and land', 'Samuel warned the king would take their sons and land.'),
  m('KINGSHIP_ISRAEL', 'KI_NATIONS', 'Says Israel wanted to be unlike other nations.', 'Why did the people want to be like the nations?', 'They wanted no king', 'They wanted a king to lead them', 'They wanted a king like other nations.'),
  m('SAUL_FAILURES', 'SF_SACRIFICE', 'Says Saul waited for Samuel.', 'What did Saul do at Gilgal?', 'Waited for Samuel', 'Offered the sacrifice himself', 'Saul offered the sacrifice himself.'),
  m('SAUL_FAILURES', 'SF_AMALEK', 'Says Saul destroyed everything.', 'What did Saul do with the best Amalekite flocks?', 'Destroyed them', 'Spared them', 'Saul spared the best flocks.'),
  m('SAUL_FAILURES', 'SF_RESULT', 'Says God kept Saul as king.', 'What was the result of Saul\'s disobedience?', 'God made him greater', 'God rejected him as king', 'God rejected Saul as king.'),
  m('BARTIMAEUS', 'BT_PLACE', 'Gives the wrong town.', 'Where was Bartimaeus healed?', 'Jerusalem', 'Jericho', 'Bartimaeus was at Jericho.'),
  m('BARTIMAEUS', 'BT_CRY', 'Gives the wrong cry.', 'What did Bartimaeus call out?', 'Teacher, teach me', 'Son of David, have mercy on me', 'He cried "Son of David".'),
  m('BARTIMAEUS', 'BT_RESULT', 'Says he went home.', 'What did Bartimaeus do after he was healed?', 'Went home alone', 'Followed Jesus', 'He followed Jesus.'),
  m('CALMING_STORM', 'CS_SLEEP', 'Says Jesus was steering the boat.', 'What was Jesus doing in the storm?', 'Steering the boat', 'Sleeping', 'Jesus was asleep.'),
  m('CALMING_STORM', 'CS_WORDS', 'Gives the wrong command.', 'What did Jesus say to the storm?', 'Rise higher', 'Be still', 'He said "Be still".'),
  m('CALMING_STORM', 'CS_FAITH', 'Says the disciples had great faith.', 'What did Jesus ask the disciples?', 'Why they were so brave', 'Why they had so little faith', 'He asked about their faith.'),
  m('PARALYTIC', 'PL_ROOF', 'Says he came through the door.', 'How did the friends bring the man to Jesus?', 'Through the front door', 'Through the roof', 'They lowered him through the roof.'),
  m('PARALYTIC', 'PL_SINS', 'Says Jesus first healed the legs.', 'What did Jesus first say to the paralytic?', 'Your sins are forgiven', 'Take your mat', 'Jesus first forgave his sins.'),
  m('PARALYTIC', 'PL_OPPOSITION', 'Says the crowd opposed Him.', 'Who objected to Jesus forgiving sins?', 'The disciples', 'The teachers of the law', 'The teachers of the law objected.'),
  m('PRAYER', 'PR_LORDS', 'Gives the wrong reference.', 'Where is the Lord\'s Prayer in Matthew?', 'Matthew 1', 'Matthew 6:9-13', 'It is in Matthew 6.'),
  m('PRAYER', 'PR_FAITH', 'Says faith is not needed.', 'How should we pray, according to Jesus?', 'Without faith', 'With faith', 'Jesus taught to pray with faith.'),
  m('PRAYER', 'PR_PERSIST', 'Says give up quickly.', 'What does the story of the friend at midnight teach?', 'Give up quickly', 'Keep on praying', 'It teaches persistence.'),
  m('LOST_SHEEP', 'LS_NUMBER', 'Gives the wrong number.', 'How many sheep did the shepherd leave?', 'Ten', 'Ninety-nine', 'He left ninety-nine.'),
  m('LOST_SHEEP', 'LS_ACTION', 'Says he ignored the lost sheep.', 'What did the shepherd do about the lost sheep?', 'Ignored it', 'Looked for it', 'He looked for it.'),
  m('LOST_SHEEP', 'LS_JOY', 'Says heaven is sad over a lost sinner.', 'Who rejoices when one sinner repents?', 'Nobody', 'Heaven', 'There is joy in heaven.'),
  m('HOLY_SPIRIT', 'HS_DAY', 'Gives the wrong day.', 'On which day did the Spirit come on the disciples?', 'Passover', 'Pentecost', 'It was the day of Pentecost.'),
  m('HOLY_SPIRIT', 'HS_SIGN', 'Gives the wrong signs.', 'What signs came with the Spirit?', 'An earthquake and snow', 'A sound like wind and tongues like fire', 'There was a sound like wind and tongues like fire.'),
  m('HOLY_SPIRIT', 'HS_FRUIT', 'Names a non-fruit.', 'Which is a fruit of the Spirit?', 'Anger', 'Love', 'Love is a fruit of the Spirit.'),
  m('COMPASSION', 'CM_FED', 'Leaves out feeding the hungry.', 'What did the king say was done for Him?', 'Feeding the hungry', 'Ignoring the hungry', 'Feeding the hungry was done for Him.'),
  m('COMPASSION', 'CM_STRANGER', 'Says strangers should be avoided.', 'How should strangers be treated?', 'Turned away', 'Welcomed', 'The king said "I was a stranger and you welcomed me".'),
  m('COMPASSION', 'CM_LEAST', 'Misreads "the least of these".', 'What does the king say about helping the least?', 'It is for nothing', 'It was done for Him', 'What was done for the least was done for Him.'),
  m('FAMILY_ROLES', 'FRL_PARENT', 'Says parents only punish.', 'What do parents do for children?', 'Only punish them', 'Provide, guide and care for them', 'Parents provide, guide and care.'),
  m('FAMILY_ROLES', 'FRL_HEALTHY', 'Names an unhealthy practice.', 'Which is a healthy family practice?', 'Shouting at each other', 'Talking and forgiving', 'Talking and forgiving are healthy.'),
  m('FAMILY_ROLES', 'FRL_CHILD', 'Says children need not obey.', 'What does Ephesians 6:1 say children should do?', 'Ignore their parents', 'Obey their parents', 'Children obey their parents.'),
  m('ABUSE_SAFETY', 'AS_TELL', 'Says to keep it secret.', 'What should a child do if someone hurts or frightens her?', 'Keep it secret', 'Tell a trusted adult', 'Tell a trusted adult.'),
  m('ABUSE_SAFETY', 'AS_MEANING', 'Does not know what abuse is.', 'What is abuse?', 'Playing a game', 'Hurting or taking advantage of someone', 'Abuse is hurting or taking advantage of someone.'),
  m('ABUSE_SAFETY', 'AS_VALUE', 'Names a harmful value.', 'Which value helps people stay safe?', 'Pressure', 'Respect and self-control', 'Respect and self-control keep people safe.'),
  m('LIFE_SACRED', 'LF_GIFT', 'Says life is cheap.', 'Where does life come from?', 'From chance only', 'From God as a gift', 'Life is a gift from God.'),
  m('LIFE_SACRED', 'LF_COMMAND', 'Gives the wrong commandment.', 'What does Exodus 20:13 say?', 'You shall not steal', 'You shall not murder', 'You shall not murder.'),
  m('LIFE_SACRED', 'LF_HELP', 'Says to hide hopeless feelings.', 'What should a child do who feels hopeless?', 'Hide it', 'Tell a trusted adult or counsellor', 'Tell a trusted adult or counsellor.'),
  m('BULLYING', 'BL_CAUSE', 'Names a good cause.', 'Which can cause bullying?', 'Kindness', 'Wanting power over others', 'Wanting power causes bullying.'),
  m('BULLYING', 'BL_EFFECT', 'Names a good effect.', 'Which is an effect of bullying?', 'Happiness', 'Fear and loneliness', 'Bullying causes fear and loneliness.'),
  m('BULLYING', 'BL_VALUE', 'Names a harmful value.', 'Which value stops bullying?', 'Cruelty', 'Kindness', 'Kindness stops bullying.'),
  m('TALENTS_PARABLE', 'TP_NUMBER', 'Gives the wrong talents.', 'How many talents did the first servant get?', 'One', 'Five', 'The first servant got five.'),
  m('TALENTS_PARABLE', 'TP_BURY', 'Says the third servant traded.', 'What did the third servant do?', 'Traded and doubled', 'Buried the talent', 'He buried it.'),
  m('TALENTS_PARABLE', 'TP_LESSON', 'Misses the lesson.', 'What does the parable teach?', 'Hide what you have', 'Use what you have faithfully', 'Use what you have faithfully.'),
  m('LEISURE', 'LE_MEANING', 'Thinks leisure is work.', 'What is leisure?', 'Hard work', 'Free time', 'Leisure is free time.'),
  m('LEISURE', 'LE_MISUSE', 'Names a good use as misuse.', 'Which is a misuse of leisure?', 'Reading a book', 'Gambling or taking drugs', 'Gambling and drugs are misuse.'),
  m('LEISURE', 'LE_GOOD', 'Names a harmful use as good.', 'Which is a constructive use of leisure?', 'Idling all day', 'Sport or helping at home', 'Sport and helping are constructive.'),
];
