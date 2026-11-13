// ============================================================================
// CRE GRADE 8, B (10 skills): prayer, the lost sheep, the Holy Spirit, acts of compassion, family roles, staying safe from abuse, the
// sacredness of life, bullying, the parable of the talents, leisure. Written offline. Sensitive topics ask for knowledge and safe, caring
// responses only and always name a trusted adult. Every wrong answer names the library misconception it reveals. All stay reviewed:false
// until a CRE teacher signs them off.
// ============================================================================
import { S } from './cre_g8_lib.js';
const PR = 'TEACHI.TEACHINGS_ON_PRAYER.', LS = 'TEACHI.THE_LOST_SHEEP.', HS = 'THE_CH.THE_HOLY_SPIRIT.', AC = 'THE_CH.ACTS_OF_COMPASSION.';
const FR = 'CHRIST.FAMILY_RELATIONSHIPS.', SX = 'CHRIST.HUMAN_SEXUALITY_RESPONSI.', SL = 'CHRIST.SACREDNESS_OF_LIFE.', BU = 'CHRIST.BULLYING.', TA = 'CHRIST.WORK_TALENTS_GIFTS_AND_A.', LE = 'CHRIST.LEISURE.';

export const FAMILIES = [
  ...S('pr', PR, 'PRAYER', ['PR_LORDS', 'PR_FAITH', 'PR_PERSIST'], ['The Lord\'s Prayer is in Matthew 6:9-13.', 'Jesus taught to pray with faith and to keep on praying.'], [
    ['Where is the Lord\'s Prayer in Matthew?', 'Matthew 6:9-13', 'Matthew 1:1', 'Matthew 28:1', 'Matthew 3:3'],
    ['How should we pray, according to Jesus?', 'With faith', 'Without faith', 'Only in public', 'Only once a year'],
    ['What does the story of the friend at midnight teach?', 'Keep on praying', 'Give up quickly', 'Pray only once', 'Do not pray'],
    ['What is prayer?', 'Talking with God', 'Only asking for things', 'Only reading', 'Only singing'],
    ['How did Jesus say we should address God in the Lord\'s Prayer?', 'Our Father', 'Our King of war', 'Our Judge', 'Our Servant'],
  ], [
    ['A learner wants to recite the prayer Jesus taught. Where does she find it?', 'Matthew 6:9-13', 'Matthew 1:1', 'Matthew 28:1', 'Matthew 3:3'],
    ['Jesus said "whatever you ask in prayer, believe that you have received it." What is He teaching?', 'To pray with faith', 'To pray without faith', 'To stop praying', 'To pray only in public'],
    ['A man keeps knocking until his friend opens the door at midnight. What does Jesus teach?', 'Persistence in prayer', 'Giving up', 'Praying once', 'Not praying'],
    ['A youth prays for her sick friend every day. What is she showing?', 'Love and persistence', 'Fear', 'Pride', 'Doubt'],
    ['Wekesa begins his prayer "Our Father in heaven". Whose prayer is this?', 'The Lord\'s Prayer', 'A prayer of Moses', 'A song of David', 'A creed'],
  ], [
    ['Which step is the mistake?', 'Step 1: Jesus taught His followers to pray.', 'Step 2: The Lord\'s Prayer is in Matthew 6.', 'Step 3: So it is in Matthew 1.', 'It is in Matthew 6:9-13.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus taught about prayer.', 'Step 2: Faith matters.', 'Step 3: So we pray without faith.', 'We pray with faith.', 2],
    ['Which step is the mistake?', 'Step 1: The friend at midnight kept asking.', 'Step 2: He received help.', 'Step 3: So we should give up quickly.', 'We should keep on praying.', 2],
    ['Which step is the mistake?', 'Step 1: Prayer is talking with God.', 'Step 2: We can thank and ask.', 'Step 3: So prayer is only asking.', 'Prayer includes thanks and praise.', 2],
    ['Which step is the mistake?', 'Step 1: Christians pray for others.', 'Step 2: This shows love.', 'Step 3: So we should pray only for ourselves.', 'We pray for all people.', 2],
  ], ['a', 'b']),
  ...S('ls', LS, 'LOST_SHEEP', ['LS_NUMBER', 'LS_ACTION', 'LS_JOY'], ['The shepherd left the ninety-nine to find the one.', 'There is joy in heaven over one sinner who repents.'], [
    ['How many sheep did the shepherd leave?', 'Ninety-nine', 'Ten', 'Fifty', 'Nine'],
    ['What did the shepherd do about the lost sheep?', 'Looked for it', 'Ignored it', 'Sold the others', 'Gave up'],
    ['Who rejoices when one sinner repents?', 'Heaven', 'Nobody', 'Only the shepherd', 'Only the sheep'],
    ['In which Gospel is the lost sheep parable found?', 'Luke 15', 'Genesis 15', 'Exodus 15', 'Psalm 15'],
    ['What does the lost sheep represent?', 'A person who has strayed from God', 'A farm animal only', 'A wealthy man', 'A king'],
  ], [
    ['A shepherd has a hundred sheep and one is lost. How many remain in the flock?', 'Ninety-nine', 'Ten', 'Fifty', 'Nine'],
    ['The shepherd goes out looking until he finds the sheep. What does this show?', 'God seeks the lost', 'God ignores the lost', 'God forgets the lost', 'God punishes the lost'],
    ['The shepherd calls friends to rejoice. What does Jesus say about this?', 'Heaven rejoices over one sinner who repents', 'Heaven ignores sinners', 'Heaven is sad', 'Heaven is silent'],
    ['A learner reaches out to a lonely classmate. What does this reflect?', 'God\'s care for the lost', 'God\'s anger', 'God\'s silence', 'God\'s absence'],
    ['The sheep represent people. Who is the shepherd?', 'God', 'A king', 'A thief', 'A hunter'],
  ], [
    ['Which step is the mistake?', 'Step 1: A shepherd had a hundred sheep.', 'Step 2: One was lost.', 'Step 3: So he left ten behind.', 'He left ninety-nine.', 2],
    ['Which step is the mistake?', 'Step 1: The sheep was lost.', 'Step 2: The shepherd cared.', 'Step 3: So he ignored it.', 'He looked for it.', 2],
    ['Which step is the mistake?', 'Step 1: The sheep was found.', 'Step 2: The shepherd rejoiced.', 'Step 3: So heaven is sad when a sinner repents.', 'Heaven rejoices.', 2],
    ['Which step is the mistake?', 'Step 1: The story shows God\'s love.', 'Step 2: He seeks those who stray.', 'Step 3: So He ignores them.', 'He seeks them.', 2],
    ['Which step is the mistake?', 'Step 1: Christians share God\'s love.', 'Step 2: They reach out to the lost.', 'Step 3: So they avoid the lost.', 'They reach out to the lost.', 2],
  ], ['a', 'a']),
  ...S('hs', HS, 'HOLY_SPIRIT', ['HS_DAY', 'HS_SIGN', 'HS_FRUIT'], ['The Spirit came on Pentecost with a sound like wind and tongues like fire.', 'Love, joy and peace are fruit of the Spirit.'], [
    ['On which day did the Spirit come on the disciples?', 'Pentecost', 'Passover', 'Christmas', 'The Sabbath only'],
    ['What signs came with the Spirit?', 'A sound like wind and tongues like fire', 'An earthquake and snow', 'A flood and darkness', 'A rainbow and stars'],
    ['Which is a fruit of the Spirit?', 'Love', 'Anger', 'Jealousy', 'Pride'],
    ['Where is the fruit of the Spirit listed?', 'Galatians 5:22-23', 'Genesis 1:1', 'Exodus 20:1', 'Psalm 23:1'],
    ['What did the disciples do after receiving the Spirit?', 'Spoke in other languages', 'Went into hiding', 'Went fishing', 'Fell asleep'],
  ], [
    ['The disciples were gathered together when a sound like wind came. Which day was this?', 'The day of Pentecost', 'Passover', 'Christmas', 'The Sabbath only'],
    ['Tongues like fire rested on each disciple. What did this show?', 'The coming of the Holy Spirit', 'A fire in the house', 'An earthquake', 'A flood'],
    ['A learner is patient and kind to a hard classmate. Which fruit does she show?', 'Patience and kindness', 'Anger', 'Jealousy', 'Pride'],
    ['The crowd heard the disciples speaking in their own languages. What did this show?', 'The power of the Spirit', 'A trick', 'A mistake', 'A game'],
    ['Peter preached and about three thousand believed. What happened on that day?', 'The church grew', 'The church ended', 'The disciples fled', 'The city fell'],
  ], [
    ['Which step is the mistake?', 'Step 1: The Spirit came on the disciples.', 'Step 2: This was in Acts 2.', 'Step 3: So it was at Passover.', 'It was at Pentecost.', 2],
    ['Which step is the mistake?', 'Step 1: There was a sound like wind.', 'Step 2: There were tongues like fire.', 'Step 3: So there was snow.', 'There was no snow.', 2],
    ['Which step is the mistake?', 'Step 1: The Spirit produces fruit.', 'Step 2: Love and joy are fruit.', 'Step 3: So anger is fruit of the Spirit.', 'Anger is not.', 2],
    ['Which step is the mistake?', 'Step 1: The fruit of the Spirit is in Galatians.', 'Step 2: It lists nine qualities.', 'Step 3: So it is in Genesis.', 'It is in Galatians 5.', 2],
    ['Which step is the mistake?', 'Step 1: The Spirit gave power.', 'Step 2: The disciples spoke boldly.', 'Step 3: So they went into hiding.', 'They spoke boldly.', 2],
  ], ['a', 'b']),
  ...S('ac', AC, 'COMPASSION', ['CM_FED', 'CM_STRANGER', 'CM_LEAST'], ['The king welcomes those who fed the hungry and welcomed strangers.', 'What was done for the least was done for Him.'], [
    ['What did the king say was done for Him?', 'Feeding the hungry', 'Ignoring the hungry', 'Closing the door', 'Selling goods'],
    ['How should strangers be treated, according to Matthew 25?', 'Welcomed', 'Turned away', 'Ignored', 'Blamed'],
    ['What does the king say about helping the least?', 'It was done for Him', 'It was for nothing', 'It was a waste', 'It was a mistake'],
    ['Which is an act of compassion in Matthew 25?', 'Visiting the sick', 'Avoiding the sick', 'Laughing at the sick', 'Ignoring the sick'],
    ['Which is an act of compassion in Matthew 25?', 'Visiting those in prison', 'Locking prison doors', 'Avoiding the prisoners', 'Mocking the prisoners'],
  ], [
    ['A learner shares her lunch with a hungry classmate. What does Matthew 25 say about this?', 'It is done for Jesus', 'It is a waste', 'It is a mistake', 'It is unimportant'],
    ['A family welcomes a traveller who has nowhere to stay. Which act is this?', 'Welcoming a stranger', 'Turning away', 'Ignoring a need', 'Blaming'],
    ['A church gives clothes to a family in need. Which act is this?', 'Clothing the naked', 'Wasting clothes', 'Hiding clothes', 'Selling clothes'],
    ['A youth group visits a sick neighbour. Which act is this?', 'Visiting the sick', 'Avoiding the sick', 'Laughing at the sick', 'Ignoring the sick'],
    ['In the story, those who did nothing for the needy were told to depart. What does this teach?', 'Not helping others is wrong', 'Helping is optional', 'Helping is a mistake', 'Helping is a waste'],
  ], [
    ['Which step is the mistake?', 'Step 1: The king was hungry.', 'Step 2: Some fed Him.', 'Step 3: So feeding the hungry is a waste.', 'Feeding the hungry is done for Him.', 2],
    ['Which step is the mistake?', 'Step 1: A stranger came.', 'Step 2: Some welcomed him.', 'Step 3: So strangers should be turned away.', 'Strangers should be welcomed.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus spoke of the least.', 'Step 2: Helping them is serving Him.', 'Step 3: So helping the least means nothing.', 'It is done for Him.', 2],
    ['Which step is the mistake?', 'Step 1: The sick need care.', 'Step 2: Visiting is compassion.', 'Step 3: So we should avoid the sick.', 'We should visit the sick.', 2],
    ['Which step is the mistake?', 'Step 1: Some did not help the needy.', 'Step 2: They were rebuked.', 'Step 3: So not helping is right.', 'Not helping is wrong.', 2],
  ], ['e', 'c', 'a']),
  ...S('fr', FR, 'FAMILY_ROLES', ['FRL_PARENT', 'FRL_HEALTHY', 'FRL_CHILD'], ['Parents provide, guide and care; children obey and help.', 'Talking and forgiving make healthy families.'], [
    ['What do parents do for children?', 'Provide, guide and care for them', 'Only punish them', 'Ignore them', 'Leave them alone'],
    ['Which is a healthy family practice?', 'Talking and forgiving', 'Shouting at each other', 'Keeping secrets', 'Refusing to listen'],
    ['What does Ephesians 6:1 say children should do?', 'Obey their parents', 'Ignore their parents', 'Argue with their parents', 'Leave their parents'],
    ['Which is a cause of conflict in families?', 'Selfishness', 'Sharing', 'Listening', 'Forgiving'],
    ['Which helps to solve family conflict?', 'Honest and calm talk', 'Shouting', 'Silence for weeks', 'Blaming others'],
  ], [
    ['A mother works to feed and teach her children. What role is she playing?', 'Providing and guiding', 'Ignoring', 'Punishing only', 'Leaving them alone'],
    ['A family sits together each evening to talk and listen. Is this healthy?', 'Yes, talking builds closeness', 'No, it wastes time', 'No, it causes conflict', 'No, it hides problems'],
    ['A girl is asked to help with chores and does so gladly. Which value is this?', 'Obedience and responsibility', 'Laziness', 'Pride', 'Anger'],
    ['Two brothers quarrel over a toy because each wants it all. What is the cause?', 'Selfishness', 'Sharing', 'Listening', 'Forgiving'],
    ['Parents and children disagree. Which approach helps most?', 'Honest and calm talk', 'Shouting', 'Silence for weeks', 'Blaming others'],
  ], [
    ['Which step is the mistake?', 'Step 1: Parents have duties.', 'Step 2: They provide and guide.', 'Step 3: So they only punish.', 'They also care.', 2],
    ['Which step is the mistake?', 'Step 1: Families have problems.', 'Step 2: Talking helps.', 'Step 3: So shouting helps most.', 'Calm talk helps.', 2],
    ['Which step is the mistake?', 'Step 1: Ephesians 6 speaks to children.', 'Step 2: It says obey your parents.', 'Step 3: So children need not obey.', 'Children obey their parents.', 2],
    ['Which step is the mistake?', 'Step 1: Conflict has causes.', 'Step 2: Selfishness is one.', 'Step 3: So sharing causes conflict.', 'Sharing builds harmony.', 2],
    ['Which step is the mistake?', 'Step 1: Family members have different roles.', 'Step 2: Roles help everyone.', 'Step 3: So one person does everything.', 'Roles are shared.', 2],
  ], ['c', 'e', 'a']),
  ...S('as', SX, 'ABUSE_SAFETY', ['AS_TELL', 'AS_MEANING', 'AS_VALUE'], ['Tell a trusted adult if someone hurts or frightens you.', 'Respect and self-control keep people safe.'], [
    ['What should a child do if someone hurts or frightens her?', 'Tell a trusted adult', 'Keep it a secret for ever', 'Hide from everyone around her', 'Blame herself for what happened'],
    ['What is abuse?', 'Hurting or using someone', 'Playing a game with friends', 'Doing the homework at night', 'Helping a friend in need'],
    ['Which value helps people stay safe?', 'Respect and self-control', 'Pressure on others to obey', 'Secrecy about everything', 'Cruelty towards the weak'],
    ['Who is a trusted adult?', 'A parent, teacher or counsellor', 'A stranger you met online', 'Anyone who gives you gifts', 'Anyone who asks you for secrets'],
    ['If a friend tells you she is being hurt, what should you do?', 'Urge her to tell a trusted adult', 'Keep it a secret from all', 'Laugh about it with others', 'Tell the whole school about it'],
  ], [
    ['A learner feels unsafe because of something an older person said to her. What should she do?', 'Tell a parent, teacher or counsellor', 'Keep it to herself for ever', 'Hide from everyone she knows', 'Blame herself for what happened'],
    ['A person forces a child to do something she does not want. What is this?', 'Abuse', 'A game', 'A lesson', 'A gift'],
    ['A teacher shows respect to every learner and keeps boundaries. What does this protect?', 'Everyone\'s safety', 'Nobody', 'Only adults', 'Only teachers'],
    ['A friend hints that someone is hurting her. What should you do?', 'Urge her to tell a trusted adult', 'Keep it a secret from everyone', 'Laugh about it with the others', 'Ignore it and say nothing at all'],
    ['A message from a stranger asks to meet you secretly. What should you do?', 'Not reply and tell a trusted adult', 'Reply and agree to meet him', 'Share your home address with him', 'Keep it secret from your family'],
  ], [
    ['Which step is the mistake?', 'Step 1: Abuse hurts people.', 'Step 2: A child who is unsafe needs help.', 'Step 3: So she should keep it secret.', 'She should tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: Abuse means hurting or taking advantage.', 'Step 2: It is wrong.', 'Step 3: So it is a game.', 'It is not a game.', 2],
    ['Which step is the mistake?', 'Step 1: Values protect people.', 'Step 2: Respect is a value.', 'Step 3: So pressure keeps people safe.', 'Respect keeps people safe.', 2],
    ['Which step is the mistake?', 'Step 1: Trusted adults help.', 'Step 2: Parents and teachers are examples.', 'Step 3: So any stranger is a trusted adult.', 'Strangers are not.', 2],
    ['Which step is the mistake?', 'Step 1: Friends may be hurting.', 'Step 2: We can support them.', 'Step 3: So we should keep their secret.', 'We should urge them to tell a trusted adult.', 2],
  ], ['a', 'd']),
  ...S('sl', SL, 'LIFE_SACRED', ['LF_GIFT', 'LF_COMMAND', 'LF_HELP'], ['Life is a gift from God; Exodus 20:13 says do not murder.', 'A person who feels hopeless should tell a trusted adult or counsellor.'], [
    ['Where does life come from?', 'From God as a gift', 'From chance only', 'From money', 'From machines'],
    ['What does Exodus 20:13 say?', 'You shall not murder', 'You shall not steal', 'You shall honour your parents', 'You shall keep the Sabbath'],
    ['What should a child do who feels hopeless?', 'Tell a trusted adult or counsellor', 'Hide it', 'Say nothing for ever', 'Blame herself'],
    ['In whose image are people made, according to Genesis 1:27?', 'God\'s image', 'The animals\' image', 'The angels\' image', 'The kings\' image'],
    ['Which way can the right to life be violated?', 'Murder', 'Sharing food', 'Healing the sick', 'Planting trees'],
  ], [
    ['A learner says life has no value. What can you say?', 'Life is a gift from God', 'She is right', 'Life is cheap', 'Life is an accident'],
    ['A teacher reads "You shall not murder". Where is this?', 'Exodus 20:13', 'Genesis 1:1', 'Psalm 23:1', 'John 3:16'],
    ['A friend says she feels hopeless. What should you encourage her to do?', 'Talk to a trusted adult or counsellor', 'Hide it', 'Say nothing for ever', 'Blame herself'],
    ['A speaker says every person is made in God\'s image. What follows?', 'Every life is valuable', 'Some lives are cheap', 'Life is an accident', 'Life has no meaning'],
    ['A war kills many innocent people. What is violated?', 'The right to life', 'The right to trade', 'The right to rest', 'The right to travel'],
  ], [
    ['Which step is the mistake?', 'Step 1: God made people.', 'Step 2: Life is His gift.', 'Step 3: So life has no value.', 'Life is sacred.', 2],
    ['Which step is the mistake?', 'Step 1: The commandments guide life.', 'Step 2: One says do not murder.', 'Step 3: So it says do not steal.', 'Exodus 20:13 says do not murder.', 2],
    ['Which step is the mistake?', 'Step 1: Some people feel hopeless.', 'Step 2: Help is available.', 'Step 3: So they should hide it.', 'They should tell a trusted adult.', 2],
    ['Which step is the mistake?', 'Step 1: People are made in God\'s image.', 'Step 2: Life is precious.', 'Step 3: So some lives matter less.', 'Every life matters.', 2],
    ['Which step is the mistake?', 'Step 1: The right to life must be protected.', 'Step 2: Violence violates it.', 'Step 3: So violence is acceptable.', 'Violence is wrong.', 2],
  ], ['b', 'c', 'a']),
  ...S('bu', BU, 'BULLYING', ['BL_CAUSE', 'BL_EFFECT', 'BL_VALUE'], ['Bullying can come from wanting power; it causes fear and loneliness.', 'Kindness and treating others as you wish to be treated stop bullying.'], [
    ['Which can cause bullying?', 'Wanting power over others', 'Kindness', 'Sharing', 'Listening'],
    ['Which is an effect of bullying?', 'Fear and loneliness', 'Happiness', 'Good marks', 'More friends'],
    ['Which value stops bullying?', 'Kindness', 'Cruelty', 'Pride', 'Jealousy'],
    ['What does Luke 6:31 say?', 'Treat others as you want to be treated', 'Take what you want', 'Hide from others', 'Ignore others'],
    ['What should you do if you see someone being bullied?', 'Tell a trusted adult', 'Join in', 'Laugh', 'Walk away silently'],
  ], [
    ['A boy picks on smaller learners to feel powerful. What is the cause?', 'Wanting power over others', 'Kindness', 'Sharing', 'Listening'],
    ['A girl who is bullied stops coming to school. What is an effect?', 'Fear and low marks', 'Happiness', 'More friends', 'Good health'],
    ['A class makes a rule to be kind to all. Which value is this?', 'Kindness', 'Cruelty', 'Pride', 'Jealousy'],
    ['"Do to others what you would want them to do to you." Which verse says this?', 'Luke 6:31', 'Genesis 1:1', 'Psalm 23:1', 'John 3:16'],
    ['A learner sees a classmate being teased. What is the best action?', 'Tell a trusted adult', 'Join in', 'Laugh', 'Walk away silently'],
  ], [
    ['Which step is the mistake?', 'Step 1: Bullies often want power.', 'Step 2: They choose weaker people.', 'Step 3: So kindness causes bullying.', 'Wanting power causes bullying.', 2],
    ['Which step is the mistake?', 'Step 1: Bullying hurts.', 'Step 2: Victims feel afraid.', 'Step 3: So bullying makes them happy.', 'It causes fear.', 2],
    ['Which step is the mistake?', 'Step 1: Values guide behaviour.', 'Step 2: Kindness is a value.', 'Step 3: So cruelty stops bullying.', 'Kindness stops bullying.', 2],
    ['Which step is the mistake?', 'Step 1: Luke 6:31 is the golden rule.', 'Step 2: It asks us to treat others well.', 'Step 3: So it says to take what we want.', 'It says treat others as you want to be treated.', 2],
    ['Which step is the mistake?', 'Step 1: Bystanders can help.', 'Step 2: They can tell an adult.', 'Step 3: So they should join in.', 'They should tell an adult.', 2],
  ], ['b', 'c', 'a']),
  ...S('tp', TA, 'TALENTS_PARABLE', ['TP_NUMBER', 'TP_BURY', 'TP_LESSON'], ['The servants got five, two and one talents; the third buried his.', 'Use what God gives you faithfully.'], [
    ['How many talents did the first servant get?', 'Five', 'One', 'Two', 'Ten'],
    ['What did the third servant do with his talent?', 'Buried it', 'Traded and doubled it', 'Gave it away', 'Spent it'],
    ['What does the parable teach?', 'Use what you have faithfully', 'Hide what you have', 'Waste what you have', 'Ignore what you have'],
    ['Where is the parable of the talents?', 'Matthew 25:14-30', 'Genesis 25:14', 'Exodus 25:14', 'John 25:14'],
    ['What did the master say to the faithful servants?', 'Well done, good and faithful servant', 'You are wasteful', 'You have failed', 'Go away'],
  ], [
    ['A master leaves five talents with one servant. How many did the first servant receive?', 'Five', 'One', 'Two', 'Ten'],
    ['The third servant was afraid and hid the money in the ground. What did he do?', 'Buried the talent', 'Traded and doubled it', 'Gave it away', 'Spent it'],
    ['A learner has a gift for singing and practises to serve in church. What does this reflect?', 'Using talents faithfully', 'Hiding talents', 'Wasting talents', 'Ignoring talents'],
    ['The master praised two servants who doubled their talents. What does this show?', 'Faithfulness is rewarded', 'Faithfulness is ignored', 'Hiding is rewarded', 'Wasting is rewarded'],
    ['A youth says her talent is too small to matter. What can you say?', 'Use it faithfully like the servants', 'She is right, hide it', 'It does not matter', 'Throw it away'],
  ], [
    ['Which step is the mistake?', 'Step 1: The servants got different talents.', 'Step 2: The first got five.', 'Step 3: So the first got one.', 'The first got five.', 2],
    ['Which step is the mistake?', 'Step 1: The third servant was afraid.', 'Step 2: He hid his talent.', 'Step 3: So he traded and doubled it.', 'He buried it.', 2],
    ['Which step is the mistake?', 'Step 1: Talents are gifts.', 'Step 2: They should be used.', 'Step 3: So they should be hidden.', 'They should be used faithfully.', 2],
    ['Which step is the mistake?', 'Step 1: The master returned.', 'Step 2: He praised the faithful.', 'Step 3: So he praised the one who hid his talent.', 'He rebuked the one who did nothing.', 2],
    ['Which step is the mistake?', 'Step 1: Everyone has a gift.', 'Step 2: Gifts differ.', 'Step 3: So only some should use them.', 'Everyone should use theirs.', 2],
  ], ['c', 'd']),
  ...S('le', LE, 'LEISURE', ['LE_MEANING', 'LE_MISUSE', 'LE_GOOD'], ['Leisure is free time; gambling and drugs are misuse.', 'Sport and helping at home are constructive.'], [
    ['What is leisure?', 'Free time', 'Hard work', 'School time only', 'Sleep only'],
    ['Which is a misuse of leisure?', 'Gambling or taking drugs', 'Reading a book', 'Playing sports', 'Helping at home'],
    ['Which is a constructive use of leisure?', 'Sport or helping at home', 'Idling all day', 'Gambling', 'Taking drugs'],
    ['What is an effect of misusing leisure?', 'Poor school work and health', 'Better marks', 'More energy', 'More friends'],
    ['What did God give people as a day of rest?', 'The Sabbath', 'Market day', 'A holiday every month', 'No day of rest'],
  ], [
    ['After school Njeri has two hours free. What is this time called?', 'Leisure', 'Work', 'Exams', 'Sleep'],
    ['A youth spends all his free time gambling online. What is this?', 'Misuse of leisure', 'Good use of leisure', 'Rest', 'Study'],
    ['A girl reads, plays netball and helps at home in her free time. What is this?', 'Constructive use of leisure', 'Misuse of leisure', 'Idleness', 'Waste'],
    ['A learner plays games every night and her marks drop. What is the effect?', 'Poor school work', 'Better marks', 'More energy', 'More friends'],
    ['A family rests on the Sabbath. What does this reflect?', 'God\'s command to rest', 'Idleness', 'A mistake', 'A punishment'],
  ], [
    ['Which step is the mistake?', 'Step 1: Leisure is free time.', 'Step 2: It can be used well.', 'Step 3: So leisure is hard work.', 'Leisure is free time.', 2],
    ['Which step is the mistake?', 'Step 1: Some free time is misused.', 'Step 2: Gambling is one misuse.', 'Step 3: So gambling is constructive.', 'Gambling is misuse.', 2],
    ['Which step is the mistake?', 'Step 1: Free time can build skills.', 'Step 2: Sport and reading help.', 'Step 3: So idling all day is best.', 'Sport and reading are constructive.', 2],
    ['Which step is the mistake?', 'Step 1: Misuse of leisure harms.', 'Step 2: Health and school work suffer.', 'Step 3: So misuse improves marks.', 'Misuse harms school work.', 2],
    ['Which step is the mistake?', 'Step 1: God gave a day of rest.', 'Step 2: Rest renews people.', 'Step 3: So rest is wasteful.', 'Rest is valuable.', 2],
  ], ['b', 'c', 'd']),
];
