// ============================================================================
// GRADE 4 CHRISTIAN RELIGIOUS EDUCATION, PART D: the Church and the digital world (the house of God, the twelve disciples,
// how the early church began, Stephen and Antioch, the Lord's Prayer, the fruit of the Holy Spirit, self-control, social media).
// Bible facts asked are those stated in the passages the design names. No denominational claims (nothing on how baptism is done
// or how the Lord's Supper works). Every family stays reviewed:false until a CRE teacher signs it off (cre_g4_signed.js): none
// reaches a child.
// ============================================================================
import { C, w, F } from './cre_g4_lib.js';

const H = 'THE_CH.';
const hg = w('M_C4_HG_'), td = w('M_C4_TD_'), cb = w('M_C4_CB_'), st = w('M_C4_ST_'), lp = w('M_C4_LP_'), fr = w('M_C4_FR_'), sc = w('M_C4_SC_'), sm = w('M_C4_SM_');

export const FAMILIES = [
  // ---------------------------------------------------------------- HOUSE_OF_GOD
  F('housegod.temple', `${H}HOUSE_OF_GOD.HOUSE_OF_GOD`, 'direct', 1, 'story facts', ['Matthew 21:12-14.', 'Jesus said God\'s house is a house of prayer.'], [
    C('Whom did Jesus drive out of the temple?', 'Those who were buying and selling there', 'Matthew 21:12.', hg('The people who were praying', 'DROVE_WORSHIPPERS'), hg('The children who sang', 'DROVE_WORSHIPPERS'), hg('Only the priests', 'DROVE_WORSHIPPERS')),
    C('What did Jesus say God\'s house should be called?', 'A house of prayer', 'Matthew 21:13.', hg('A market for buying and selling', 'BUSINESS_OK'), hg('A place used only on service days', 'SERVICE_ONLY'), hg('A house for traders', 'BUSINESS_OK')),
    C('What did Jesus overturn in the temple?', 'The tables of the money changers', 'Matthew 21:12.', hg('The seats of the worshippers', 'DROVE_WORSHIPPERS'), hg('The offering boxes of the poor', 'BUSINESS_OK'), hg('The doors of the church', 'SERVICE_ONLY')),
    C('Who came to Jesus in the temple and were healed?', 'The blind and the lame', 'Matthew 21:14.', hg('The traders', 'BUSINESS_OK'), hg('The money changers', 'BUSINESS_OK'), hg('Nobody, he only chased them away', 'DROVE_WORSHIPPERS')),
    C('Is it right to do business in the house of God?', 'No, it is a house of prayer', 'Jesus drove the traders out.', hg('Yes, business is part of daily life', 'BUSINESS_OK'), hg('Yes, except during a service', 'SERVICE_ONLY'), hg('Yes, if the worshippers are sent away', 'DROVE_WORSHIPPERS')),
  ], 'a'),
  F('housegod.respect', `${H}HOUSE_OF_GOD.HOUSE_OF_GOD`, 'why', 2, 'respecting the church', ['The church is God\'s house, a holy place.', '1 Corinthians 14:26: everything done to build up the church.'], [
    C('When should we respect the church?', 'Always, because it is God\'s house', 'It is a holy place.', hg('Only during the service', 'SERVICE_ONLY'), hg('Only when traders are there', 'BUSINESS_OK'), hg('Only when worshippers have gone', 'DROVE_WORSHIPPERS')),
    C('Which is a way of respecting the church?', 'Keeping it clean and speaking quietly', 'We respect God\'s house.', hg('Selling snacks inside during a prayer', 'BUSINESS_OK'), hg('Respecting it only on Sunday', 'SERVICE_ONLY'), hg('Sending the worshippers away', 'DROVE_WORSHIPPERS')),
    C('1 Corinthians 14:26 says that in the church everything must be done...', 'So that the church is built up', 'Our activities should help one another grow.', hg('So that traders can make money', 'BUSINESS_OK'), hg('So that it is used only on Sunday', 'SERVICE_ONLY'), hg('So that the worshippers go away', 'DROVE_WORSHIPPERS')),
    C('Kamau wants to sell sweets to children inside the church during prayers. What should we tell him?', 'God\'s house is for prayer, so he should wait outside', 'Matthew 21:13.', hg('That is fine, business is allowed in church', 'BUSINESS_OK'), hg('Only during service is it wrong', 'SERVICE_ONLY'), hg('Send the children away', 'DROVE_WORSHIPPERS')),
    C('Which activity helps us grow spiritually at church?', 'Singing, praying and learning from God\'s word', 'These build up the church.', hg('Doing business', 'BUSINESS_OK'), hg('Going only on service days', 'SERVICE_ONLY'), hg('Chasing people out', 'DROVE_WORSHIPPERS')),
  ], 'a'),

  // ---------------------------------------------------------------- TWELVE_DISCIPLES
  F('twelve.names', `${H}THE_EARLY_CHURCH.TWELVE_DISCIPLES`, 'direct', 1, 'who the disciples were', ['Matthew 10:1-4.', 'Paul was not one of the twelve.'], [
    C('Which of these was one of the twelve disciples?', 'Philip', 'Philip is in the list in Matthew 10:3.', td('Paul', 'PAUL'), td('Stephen', 'PAUL'), td('Barnabas', 'PAUL')),
    C('Whose brother was Andrew?', 'Simon Peter\'s', 'Matthew 10:2.', td('John\'s', 'BROTHERS'), td('Philip\'s', 'BROTHERS'), td('Thomas\'s', 'BROTHERS')),
    C('How many disciples did Jesus choose?', 'Twelve', 'Matthew 10:1-4.', td('Seven', 'COUNT'), td('Ten', 'COUNT'), td('Three', 'COUNT')),
    C('Who were the sons of Zebedee?', 'James and John', 'Matthew 10:2.', td('Peter and Andrew', 'BROTHERS'), td('Philip and Thomas', 'BROTHERS'), td('Paul and James', 'PAUL')),
    C('Which disciple was a tax collector?', 'Matthew', 'Matthew 10:3.', td('Paul', 'PAUL'), td('Andrew', 'BROTHERS'), td('Judas Iscariot', 'BROTHERS')),
  ], 'a'),
  F('twelve.count', `${H}THE_EARLY_CHURCH.TWELVE_DISCIPLES`, 'word', 2, 'sort the disciples', ['Count the names in Matthew 10:2-4.', 'Peter and Andrew are brothers. James and John are brothers.'], [
    C('Which pair were brothers among the disciples?', 'Peter and Andrew', 'Matthew 10:2.', td('Peter and Thomas', 'BROTHERS'), td('Philip and Matthew', 'BROTHERS'), td('Paul and Peter', 'PAUL')),
    C('Which group contains only disciples from Matthew 10:2-4?', 'Peter, Andrew, Philip and Thomas', 'These are from the list.', td('Peter, Paul, Philip and Thomas', 'PAUL'), td('Peter, Andrew, Stephen and Thomas', 'PAUL'), td('Peter, Andrew, Philip and Barnabas', 'PAUL')),
    C('Wanjiru says there were seven disciples. What is correct?', 'There were twelve', 'Matthew 10:1.', td('She is right', 'COUNT'), td('There were three', 'COUNT'), td('There were eleven', 'COUNT')),
    C('Which disciple betrayed Jesus?', 'Judas Iscariot', 'Matthew 10:4.', td('Paul', 'PAUL'), td('Andrew', 'BROTHERS'), td('Matthew', 'BROTHERS')),
    C('Which of these is NOT one of the twelve?', 'Paul', 'Paul became an apostle later and is not in Matthew 10:2-4.', td('Simon the Zealot', 'PAUL'), td('Thaddaeus', 'PAUL'), td('Bartholomew', 'PAUL')),
  ], 'a'),

  // ---------------------------------------------------------------- CHURCH_BEGINS
  F('church.facts', `${H}THE_EARLY_CHURCH.CHURCH_BEGINS`, 'direct', 1, 'story facts', ['Acts 2:38-41.', 'Peter preached and about three thousand joined.'], [
    C('Who preached to the crowd in Acts 2?', 'Peter', 'Acts 2:14.', cb('Jesus', 'WHO'), cb('Stephen', 'WHO'), cb('Paul', 'WHO')),
    C('About how many people joined the believers that day?', 'Three thousand', 'Acts 2:41.', cb('Twelve', 'NUMBER'), cb('One hundred', 'NUMBER'), cb('Seven', 'NUMBER')),
    C('What did Peter tell the people to do, according to Acts 2:38?', 'Repent and be baptised', 'Acts 2:38.', cb('Only be baptised', 'ONLY_BAPTISM'), cb('Wait for Jesus to preach', 'WHO'), cb('Count how many were there', 'NUMBER')),
    C('What question did the people ask Peter?', '"What shall we do?"', 'Acts 2:37.', cb('"Who is preaching?"', 'WHO'), cb('"How many are we?"', 'NUMBER'), cb('"Do we only need baptism?"', 'ONLY_BAPTISM')),
    C('Which first step did Peter name?', 'Repent', 'Acts 2:38.', cb('Baptism, with no change of life', 'ONLY_BAPTISM'), cb('Preaching', 'WHO'), cb('Counting', 'NUMBER')),
  ], 'b'),
  F('church.repent', `${H}THE_EARLY_CHURCH.CHURCH_BEGINS`, 'why', 2, 'what repenting means', ['To repent is to turn away from sin.', 'Acts 2:38 begins with the word repent.'], [
    C('What does it mean to repent?', 'To turn away from sin', 'Acts 2:38.', cb('Only to be baptised', 'ONLY_BAPTISM'), cb('To preach like Peter', 'WHO'), cb('To join a crowd', 'NUMBER')),
    C('Why did Peter say "repent" first?', 'Turning from sin is the beginning of a new life', 'Repentance comes first.', cb('Because baptism is all that is needed', 'ONLY_BAPTISM'), cb('Because Jesus himself preached', 'WHO'), cb('Because three thousand were counted', 'NUMBER')),
    C('Which is a way of turning away from sin today?', 'Saying sorry to God and leaving the wrong behaviour', 'This follows Acts 2:38.', cb('Doing a ceremony and going on as before', 'ONLY_BAPTISM'), cb('Joining the crowd', 'NUMBER'), cb('Asking Jesus to preach for you', 'WHO')),
    C('How did the church grow on that day?', 'Three thousand joined', 'Acts 2:41.', cb('Twelve people joined', 'NUMBER'), cb('Jesus preached to them', 'WHO'), cb('Only baptism counted', 'ONLY_BAPTISM')),
    C('Mugambi turned away from stealing and returned what he took. Which word fits?', 'He repented', 'He turned away from sin.', cb('He was only baptised', 'ONLY_BAPTISM'), cb('He preached to the crowd', 'WHO'), cb('He became one of three thousand', 'NUMBER')),
  ], 'c'),

  // ---------------------------------------------------------------- STEPHEN
  F('stephen.facts', `${H}STANDING_FIRM_IN_FAITH.STEPHEN`, 'direct', 1, 'story facts', ['Acts 7:54-60 and Acts 11:26.', 'Stephen prayed for those who hurt him.'], [
    C('In which city were believers first called Christians?', 'Antioch', 'Acts 11:26.', st('Jerusalem', 'CITY'), st('Rome', 'CITY'), st('Nazareth', 'CITY')),
    C('What did Stephen pray for those stoning him?', '"Lord, do not hold this sin against them"', 'Acts 7:60.', st('That God would punish them', 'REVENGE'), st('That they would leave him', 'GROUP'), st('That Jerusalem would be destroyed', 'CITY')),
    C('What did Stephen see as he looked up to heaven?', 'God\'s glory and Jesus', 'Acts 7:55.', st('A city called Antioch', 'CITY'), st('A crowd to join', 'GROUP'), st('An army to punish them', 'REVENGE')),
    C('How did Stephen die?', 'He was stoned for standing firm in his faith', 'Acts 7:58-60.', st('He was punished for joining a group', 'GROUP'), st('He died in Antioch', 'CITY'), st('He fought back', 'REVENGE')),
    C('Which young man looked after the coats of those who stoned Stephen?', 'A young man named Saul', 'Acts 7:58.', st('A man from Antioch', 'CITY'), st('A friend of Stephen', 'GROUP'), st('A man who wanted revenge', 'REVENGE')),
  ], 'b'),
  F('stephen.lessons', `${H}STANDING_FIRM_IN_FAITH.STEPHEN`, 'why', 2, 'lessons and ungodly groups', ['Stand firm and forgive.', 'Do not join groups that do not follow Jesus.'], [
    C('Your friends join a group that mocks Jesus. What should you do?', 'Politely say no', 'Stephen stood firm.', st('Join them to fit in', 'GROUP'), st('Hit them back', 'REVENGE'), st('Go to another city', 'CITY')),
    C('Which is a lesson from Stephen\'s death?', 'Stand firm in faith and forgive those who hurt us', 'Acts 7:60.', st('Take revenge on those who hurt us', 'REVENGE'), st('Join the group to be safe', 'GROUP'), st('Leave for Antioch', 'CITY')),
    C('Why should we stay away from groups that reject Jesus?', 'They can lead us away from our faith', 'Stephen\'s faith was firm.', st('Because they are in another city', 'CITY'), st('Because we should take revenge', 'REVENGE'), st('Because we should join them', 'GROUP')),
    C('Achieng is mocked for praying. What does Stephen\'s example teach?', 'Stay firm, forgive, and keep praying', 'He prayed even for his attackers.', st('Pray for punishment on them', 'REVENGE'), st('Give up praying to fit in', 'GROUP'), st('Move to Antioch', 'CITY')),
    C('Where were believers first called Christians, and what does the name mean?', 'Antioch, followers of Christ', 'Acts 11:26.', st('Jerusalem, followers of Moses', 'CITY'), st('Antioch, members of any group', 'GROUP'), st('Rome, people who take revenge', 'REVENGE')),
  ], 'd'),

  // ---------------------------------------------------------------- LORDS_PRAYER
  F('prayer.lines', `${H}THE_LORD_S_PRAYER.LORDS_PRAYER`, 'direct', 1, 'what the prayer asks', ['Matthew 6:9-13.', 'Jesus gave it as a pattern for prayer.'], [
    C('What do we ask for when we pray "Give us today our daily bread"?', 'What we need each day', 'Matthew 6:11.', lp('Riches for ever', 'BREAD'), lp('Only bread and nothing else', 'BREAD'), lp('Forgiveness only', 'FORGIVE')),
    C('What does the Lord\'s Prayer say about forgiveness?', 'Forgive us as we forgive others', 'Matthew 6:12.', lp('Forgive us and we need not forgive others', 'FORGIVE'), lp('Forgive us only in church', 'ONLY_CHURCH'), lp('Give us riches', 'BREAD')),
    C('Who gave us the Lord\'s Prayer?', 'Jesus', 'Matthew 6:9.', lp('A priest only for church', 'ONLY_CHURCH'), lp('A person who asked for riches', 'BREAD'), lp('A man who forgave nobody', 'FORGIVE')),
    C('The prayer begins, "Our Father in heaven..." What does this tell us?', 'We pray to God as our Father', 'Matthew 6:9.', lp('We pray only in church', 'ONLY_CHURCH'), lp('We pray for riches', 'BREAD'), lp('We forgive nobody', 'FORGIVE')),
    C('Which request is in the Lord\'s Prayer?', 'Keep us from temptation and from evil', 'Matthew 6:13.', lp('Make us rich for ever', 'BREAD'), lp('We need not forgive others', 'FORGIVE'), lp('Let us pray only in church', 'ONLY_CHURCH')),
  ], 'a'),
  F('prayer.daily', `${H}THE_LORD_S_PRAYER.LORDS_PRAYER`, 'why', 2, 'why pray every day', ['We can pray at home, at school and at church.', 'We pray for others as well.'], [
    C('When should we pray?', 'Every day, at home and anywhere', 'Jesus taught us to pray.', lp('Only at church', 'ONLY_CHURCH'), lp('Only when we ask for riches', 'BREAD'), lp('Only when we forgive nobody', 'FORGIVE')),
    C('Why should we pray for our parents and friends?', 'Because we love them and God cares for them', 'We pray for others.', lp('Because prayer is only for church', 'ONLY_CHURCH'), lp('Because we want riches for them', 'BREAD'), lp('Because they must forgive us first', 'FORGIVE')),
    C('Wafula prays only on Sunday at church. What should we tell him?', 'He can pray every day, anywhere', 'Prayer is not only for church.', lp('He is right, prayer is only for church', 'ONLY_CHURCH'), lp('He should ask only for riches', 'BREAD'), lp('He should not forgive anyone', 'FORGIVE')),
    C('Which is a good time to pray?', 'Morning, before meals and at bedtime', 'We can pray every day.', lp('Only during the church service', 'ONLY_CHURCH'), lp('Only when I want riches', 'BREAD'), lp('Only after I get revenge', 'FORGIVE')),
    C('Why do we pray every day, as Christians?', 'To grow close to God and spiritually', 'Daily prayer builds our relationship.', lp('Only to ask for riches', 'BREAD'), lp('Because prayer is only for church', 'ONLY_CHURCH'), lp('To avoid forgiving others', 'FORGIVE')),
  ], 'b'),

  // ---------------------------------------------------------------- FRUIT_SPIRIT
  F('fruit.list', `${H}FRUIT_OF_THE_HOLY_SPIRIT.FRUIT_SPIRIT`, 'direct', 1, 'which is a fruit', ['Galatians 5:22-23.', 'Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.'], [
    C('Which of these is a fruit of the Spirit?', 'Kindness', 'Galatians 5:22.', fr('Mango', 'FOOD'), fr('Jealousy', 'BAD'), fr('Anger', 'BAD')),
    C('The fruit of the Spirit in Galatians 5:22-23 are things like...', 'Love, joy, peace and patience', 'They are qualities of a godly life.', fr('Mangoes and bananas', 'FOOD'), fr('Anger and jealousy', 'BAD'), fr('Things shown only in church', 'CHURCH_ONLY')),
    C('Which one is NOT a fruit of the Spirit?', 'Jealousy', 'Jealousy is not a fruit of the Spirit.', fr('Joy', 'BAD'), fr('Patience', 'BAD'), fr('Self-control', 'BAD')),
    C('Where should the fruit of the Spirit show?', 'At home, at school, at play and at church', 'They show in the whole of life.', fr('Only at church', 'CHURCH_ONLY'), fr('Only in the garden', 'FOOD'), fr('Only in some people\'s anger', 'BAD')),
    C('Self-control is a...', 'Fruit of the Spirit', 'Galatians 5:23.', fr('Fruit you eat', 'FOOD'), fr('Bad habit', 'BAD'), fr('Fruit shown only at church', 'CHURCH_ONLY')),
  ], 'a'),
  F('fruit.apply', `${H}FRUIT_OF_THE_HOLY_SPIRIT.FRUIT_SPIRIT`, 'why', 2, 'which fruit fits', ['Match the fruit to the situation.', 'The fruit show in how we live.'], [
    C('Achieng waits kindly for a slow classmate. Which fruit is she showing?', 'Patience', 'She shows patience and kindness.', fr('Jealousy', 'BAD'), fr('A mango', 'FOOD'), fr('Anger', 'BAD')),
    C('Mwende shares her lunch with a child who has none. Which fruit is she showing?', 'Kindness', 'Sharing shows kindness.', fr('Jealousy', 'BAD'), fr('Fruit she eats', 'FOOD'), fr('Showing off in church', 'CHURCH_ONLY')),
    C('Kamau stays calm when a friend teases him. Which fruit is he showing?', 'Self-control', 'He chooses what is right.', fr('Anger', 'BAD'), fr('A banana', 'FOOD'), fr('Church fruit only', 'CHURCH_ONLY')),
    C('Which behaviour shows the fruit of peace?', 'Helping friends make up after a quarrel', 'Peace brings people together.', fr('Joining a quarrel', 'BAD'), fr('Eating mangoes', 'FOOD'), fr('Being peaceful only at church', 'CHURCH_ONLY')),
    C('Why should we have the fruit of the Spirit?', 'So that our lives please God and help others', 'The fruit show God\'s work in us.', fr('So that we can eat fruit', 'FOOD'), fr('So that we are good only at church', 'CHURCH_ONLY'), fr('So that we can show jealousy', 'BAD')),
  ], 'b'),

  // ---------------------------------------------------------------- SELF_CONTROL
  F('selfcontrol.meaning', `${H}SELF_CONTROL.SELF_CONTROL`, 'direct', 1, 'what self-control is', ['Galatians 5:23-25.', 'Self-control is a fruit of the Spirit.'], [
    C('What is self-control?', 'Choosing right over feeling', 'Galatians 5:23.', sc('Doing whatever I feel like', 'FEELINGS'), sc('Using only my own strength', 'OWN_POWER'), sc('Doing wrong in secret', 'SECRET_OK')),
    C('Where does self-control come from, according to Galatians 5:22-25?', 'It is a fruit of the Holy Spirit', 'We keep in step with the Spirit.', sc('Only from my own strength', 'OWN_POWER'), sc('From doing what I feel', 'FEELINGS'), sc('From secrets', 'SECRET_OK')),
    C('Galatians 5:25 says to keep in step with...', 'The Spirit', 'The Holy Spirit guides us.', sc('My feelings', 'FEELINGS'), sc('My own power', 'OWN_POWER'), sc('Secret friends', 'SECRET_OK')),
    C('Which child shows self-control?', 'One who walks away when angry', 'He chooses what is right.', sc('One who does whatever he feels', 'FEELINGS'), sc('One who relies only on himself', 'OWN_POWER'), sc('One who does wrong in secret', 'SECRET_OK')),
    C('Which does the Holy Spirit help us do?', 'Choose right and say no to harmful things', 'He guides us.', sc('Follow every feeling', 'FEELINGS'), sc('Do it all alone', 'OWN_POWER'), sc('Hide what we do', 'SECRET_OK')),
  ], 'a'),
  F('selfcontrol.body', `${H}SELF_CONTROL.SELF_CONTROL`, 'why', 2, 'avoiding what harms the body', ['Harmful things are wrong even in secret.', 'Ask the Holy Spirit for help.'], [
    C('A friend offers you a harmful video to watch in secret. What shows self-control?', 'Refuse and stay clean', 'Harmful things are wrong even in secret.', sc('Watch it, since no one will know', 'SECRET_OK'), sc('Watch it because you feel like it', 'FEELINGS'), sc('Watch it and trust yourself alone', 'OWN_POWER')),
    C('Which of these harms the body?', 'Drugs', 'Harmful things damage us.', ['Eating good food and resting', 'FEELINGS', 'Food and rest keep the body well. Drugs are the harmful thing here.'], sc('Asking the Spirit for help', 'OWN_POWER'), sc('Staying away from secrets', 'SECRET_OK')),
    C('Hassan feels like shouting at his sister. What helps?', 'Stop, breathe and ask for God\'s help', 'Self-control is a fruit of the Spirit.', sc('Do whatever he feels', 'FEELINGS'), sc('Rely on his own strength only', 'OWN_POWER'), sc('Do it in secret', 'SECRET_OK')),
    C('Why is it wrong to use drugs even in secret?', 'They harm the body and mind', 'We care for our bodies.', sc('It is fine if no one knows', 'SECRET_OK'), sc('It is fine if I feel like it', 'FEELINGS'), sc('It is fine if I am strong', 'OWN_POWER')),
    C('Which decision is guided by the Holy Spirit?', 'Saying no to wrong and choosing good', 'He helps us choose right.', sc('Following my feelings', 'FEELINGS'), sc('Doing it by myself alone', 'OWN_POWER'), sc('Doing it in secret', 'SECRET_OK')),
  ], 'c'),

  // ---------------------------------------------------------------- SOCIAL_MEDIA
  F('social.safe', `MORALI.USE_OF_SOCIAL_MEDIA.SOCIAL_MEDIA`, 'direct', 1, 'safe use', ['Keep passwords and your address private.', 'Never meet an online stranger.'], [
    C('A stranger online asks to chat in private and meet. What should you do?', 'Not reply, and tell a parent or teacher', 'People online may not be who they say.', sm('Chat and meet, he is friendly', 'STRANGER'), sm('Share my address', 'PRIVATE'), sm('Chat, nobody will know', 'NOBODY')),
    C('Which should you keep private online?', 'My password and home address', 'Sharing them can let others harm you.', sm('My favourite song', 'PRIVATE'), sm('My name only', 'PRIVATE'), sm('Nothing, I trust everyone', 'STRANGER')),
    C('Which of these is a digital device?', 'A mobile phone', 'Phones, tablets and computers are digital devices.', sm('A pencil', 'DEVICE'), sm('An exercise book', 'DEVICE'), sm('A ruler', 'DEVICE')),
    C('You find a way to send an unkind joke about a classmate without your name. What shows integrity?', 'Do not send it, because it would hurt', 'Integrity is doing right when no one is watching.', sm('Send it, nobody will know', 'NOBODY'), sm('Send it to a stranger', 'STRANGER'), sm('Send it with my password', 'PRIVATE')),
    C('Which of these is a digital device?', 'A tablet', 'Tablets use screens and power.', sm('A mat', 'DEVICE'), sm('A bucket', 'DEVICE'), sm('A pen', 'DEVICE')),
  ], 'a'),
  F('social.integrity', `MORALI.USE_OF_SOCIAL_MEDIA.SOCIAL_MEDIA`, 'why', 2, 'integrity online', ['Do right even when no one is watching.', 'Tell a trusted adult about unsafe messages.'], [
    C('Zawadi gets a message from an unknown person asking for her password. What should she do?', 'Not reply, and tell a parent or teacher', 'Never share a password.', sm('Give it, he sounds friendly', 'STRANGER'), sm('Share it, a password is no secret', 'PRIVATE'), sm('Reply, nobody will find out', 'NOBODY')),
    C('Why should we not chat with strangers online?', 'They may not be who they say they are', 'We tell a trusted adult.', sm('Because they are always friendly', 'STRANGER'), sm('Because passwords are public', 'PRIVATE'), sm('Because nobody sees us', 'NOBODY')),
    C('Otieno\'s friend asks for his phone password. What should he do?', 'Keep it private and say no politely', 'A password is private.', sm('Share it, friends share everything', 'PRIVATE'), sm('Share it with a stranger instead', 'STRANGER'), sm('Share it, nobody will know', 'NOBODY')),
    C('Which is a way of showing integrity online?', 'Not forwarding an unkind message', 'Integrity is right even when unseen.', sm('Forwarding it, nobody will know', 'NOBODY'), sm('Sending it to a stranger', 'STRANGER'), sm('Sharing my password with the sender', 'PRIVATE')),
    C('Which of these is a device a family may use at home?', 'A computer', 'Computers, tablets and phones are digital devices.', sm('A broom', 'DEVICE'), sm('A bucket', 'DEVICE'), sm('A mat', 'DEVICE')),
  ], 'c'),
];
