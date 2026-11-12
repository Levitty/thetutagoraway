// ============================================================================
// GRADE 5 CHRISTIAN RELIGIOUS EDUCATION, PART C: The Church and Christian Living
// (the early Church, the Lord's Supper, the Holy Spirit, Peter's rescue, friendship, adolescence, the sanctity of life,
// alcohol and drugs, social media). No denominational claims: the Lord's Supper asks only what Luke 22:14-20 says and that
// churches use different names; baptism and communion are not argued. Written offline. Every family stays reviewed:false
// (cre_g5_signed.js): none reaches a child.
// ============================================================================
import { sfam, choose, C } from './cre_g5_lib.js';

const H = 'THE_CH.';
const X = 'CHRIST.';
const H1 = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- EARLY_CHURCH
  sfam({ id: 'cre5.church.life', cs: `${H}THE_EARLY_CHURCH.EARLY_CHURCH`, oc: 'b', form: 'direct', rung: 1, kind: 'what they did',
    gen: choose([
      C('What did the early believers do with what they owned?', 'Shared it with anyone in need', 'Acts 2:44-45 says they had everything in common.', ['Kept it for themselves', 'M_EC_OWN'], ['Hid it from the apostles', 'M_EC_OWN'], ['Sold it for profit', 'M_EC_OWN']),
      C('Which one did the early believers devote themselves to?', 'The apostles\' teaching, fellowship, breaking bread and prayer', 'Acts 2:42 lists four things.', ['Selling things for profit', 'M_EC_WHAT_DEVOTED'], ['Travelling to other towns', 'M_EC_WHAT_DEVOTED'], ['Building houses', 'M_EC_WHAT_DEVOTED']),
      C('How did the early believers meet?', 'Daily, with glad and sincere hearts', 'Acts 2:46 says they met daily with glad hearts.', ['Once a year', 'M_EC_WHAT_DEVOTED'], ['In secret and in sadness', 'M_EC_WHAT_DEVOTED'], ['Only on special days', 'M_EC_WHAT_DEVOTED']),
      C('Which activity promoted unity in the early Church?', 'Eating together and sharing', 'Shared meals and giving built unity.', ['Working in different places and never meeting', 'M_EC_SAME_JOB'], ['Keeping property private', 'M_EC_OWN'], ['Avoiding one another', 'M_EC_SAME_JOB']),
      C('What did the Lord add to the believers each day?', 'Those who were being saved', 'Acts 2:47 says the Lord added to their number.', ['Gold and silver', 'M_EC_WHAT_DEVOTED'], ['New buildings', 'M_EC_WHAT_DEVOTED'], ['New rules', 'M_EC_WHAT_DEVOTED']),
    ], H1('Reread Acts 2:42-47.', 'They shared, prayed and met together.')) }),
  sfam({ id: 'cre5.church.unity', cs: `${H}THE_EARLY_CHURCH.EARLY_CHURCH`, oc: 'c', form: 'why', rung: 2, kind: 'values for unity',
    gen: choose([
      C('Which values keep a church united?', 'Love, sharing, forgiveness and humility', 'These values hold people together.', ['Everyone doing exactly the same job', 'M_EC_SAME_JOB'], ['Pride and competition', 'M_EC_SAME_JOB'], ['Keeping to yourself', 'M_EC_OWN']),
      C('Two church members quarrel. Which action promotes unity?', 'Forgive each other and talk it through', 'Unity grows through forgiveness.', ['Avoid each other for ever', 'M_EC_SAME_JOB'], ['Tell the whole church', 'M_EC_SAME_JOB'], ['Leave the church', 'M_EC_SAME_JOB']),
      C('Why is unity important in a church today?', 'It helps people to love, help and worship together', 'A united church can serve its community.', ['It makes everyone identical', 'M_EC_SAME_JOB'], ['It makes quarrels impossible', 'M_EC_SAME_JOB'], ['It stops sharing', 'M_EC_OWN']),
      C('A member of the church has no food this week. What would the early believers do?', 'Share what they have with the member', 'They shared with anyone in need.', ['Tell the member to work harder', 'M_EC_OWN'], ['Keep their food for themselves', 'M_EC_OWN'], ['Wait for someone else', 'M_EC_OWN']),
      C('Does unity mean everyone does the same thing?', 'No, people may do different things and still be one', 'Unity is in love and purpose, not sameness.', ['Yes, everyone must do the same job', 'M_EC_SAME_JOB'], ['Yes, everyone must look alike', 'M_EC_SAME_JOB'], ['Yes, everyone must speak alike', 'M_EC_SAME_JOB']),
    ], H1('Unity is held together by love, sharing and forgiveness.', 'People can differ and still be united.')) }),

  // ---------------------------------------------------------------- LORDS_SUPPER
  sfam({ id: 'cre5.supper.events', cs: `${H}THE_LORD_S_SUPPER.LORDS_SUPPER`, oc: 'a', form: 'direct', rung: 1, kind: 'events',
    gen: choose([
      C('With whom did Jesus share the Passover meal in Luke 22?', 'His apostles', 'Luke 22:14 says he sat at the table with the apostles.', ['A crowd of five thousand', 'M_LS2_WHEN'], ['The soldiers', 'M_LS2_WHEN'], ['The temple priests', 'M_LS2_WHEN']),
      C('What did Jesus do with the bread?', 'He gave thanks, broke it and gave it to them', 'Luke 22:19 describes this.', ['He threw it away', 'M_LS2_WHY'], ['He kept it all', 'M_LS2_WHY'], ['He sold it', 'M_LS2_WHY']),
      C('What did Jesus tell the apostles to do?', '"Do this in remembrance of me"', 'Luke 22:19 gives the words.', ['"Do this as a prize for the best behaved"', 'M_LS2_WHY'], ['"Do this only once a year"', 'M_LS2_WHY'], ['"Do not tell anyone"', 'M_LS2_WHY']),
      C('Which are names that different churches use for this remembrance?', 'Lord\'s Supper, Lord\'s Table, Holy Communion, Eucharist', 'Churches use different names for the same remembrance.', ['Only one name is correct and the rest are wrong', 'M_LS2_ONE_NAME'], ['Easter feast and Christmas meal', 'M_LS2_ONE_NAME'], ['Baptism and harvest', 'M_LS2_ONE_NAME']),
      C('What did Jesus say about the cup in Luke 22:20?', 'It is the new covenant in his blood, poured out for them', 'Luke 22:20 speaks of the new covenant.', ['It is only a drink', 'M_LS2_WHY'], ['It is for the soldiers', 'M_LS2_WHEN'], ['It must be hidden', 'M_LS2_WHY']),
    ], H1('Reread Luke 22:14-20.', 'Jesus ate with his apostles and asked them to remember him.')) }),
  sfam({ id: 'cre5.supper.meaning', cs: `${H}THE_LORD_S_SUPPER.LORDS_SUPPER`, oc: 'c', form: 'why', rung: 2, kind: 'significance and values',
    gen: choose([
      C('Why do Christians share the bread and the cup?', 'To remember Jesus and what he did for them', 'Jesus said, "Do this in remembrance of me."', ['To reward good behaviour', 'M_LS2_WHY'], ['For an ordinary meal', 'M_LS2_WHY'], ['To compete', 'M_LS2_WHY']),
      C('Which value is needed when taking part in the Lord\'s Table?', 'Reverence and thankfulness', 'It is a time to remember with respect.', ['Boasting', 'M_LS2_WHY'], ['Anger toward a brother', 'M_LS2_WHY'], ['Hurry', 'M_LS2_WHY']),
      C('Churches call the remembrance by different names. Which is true?', 'Different names are used by different churches for the same remembrance', 'Children in the same class may know different names.', ['Only one name is allowed', 'M_LS2_ONE_NAME'], ['Names do not matter at all and no one uses any', 'M_LS2_ONE_NAME'], ['It is called Easter', 'M_LS2_ONE_NAME']),
      C('Which attitude helps a Christian before taking part?', 'Forgiving others and being thankful', 'The meal is about love and remembrance.', ['Holding a grudge', 'M_LS2_WHY'], ['Thinking only of food', 'M_LS2_WHY'], ['Showing off', 'M_LS2_WHY']),
      C('Who was at the table with Jesus?', 'The apostles', 'Luke 22:14 says the apostles were with him.', ['Only the women', 'M_LS2_WHEN'], ['The crowd', 'M_LS2_WHEN'], ['The soldiers', 'M_LS2_WHEN']),
    ], H1('The meal is a remembrance of Jesus.', 'Values include thankfulness and forgiving others.')) }),

  // ---------------------------------------------------------------- HOLY_SPIRIT
  sfam({ id: 'cre5.spirit.gift', cs: `${H}THE_HOLY_SPIRIT.HOLY_SPIRIT`, oc: 'a', form: 'direct', rung: 1, kind: 'gifts',
    gen: choose([
      C('Paul lists gifts of the Holy Spirit in 1 Corinthians 12:1-11. Which one is on his list?', 'Prophecy', 'Prophecy is listed in 1 Corinthians 12:10.', ['Kindness', 'M_HS_MIX'], ['Patience', 'M_HS_MIX'], ['Self-control', 'M_HS_MIX']),
      C('A pastor says one gift of the Spirit is a power to heal the sick. Which gift in 1 Corinthians 12 is this?', 'Healing', 'Gifts of healing are in 1 Corinthians 12:9.', ['Joy', 'M_HS_MIX'], ['Gentleness', 'M_HS_MIX'], ['Peace', 'M_HS_MIX']),
      C('Which of these gifts of the Holy Spirit is named in 1 Corinthians 12:10?', 'Speaking in tongues', 'Tongues is in 1 Corinthians 12:10.', ['Love', 'M_HS_MIX'], ['Patience', 'M_HS_MIX'], ['Kindness', 'M_HS_MIX']),
      C('How many gifts of the Holy Spirit are listed in 1 Corinthians 12:8-10?', 'Nine', 'The list has nine gifts.', ['Five', 'M_HS_COUNT'], ['Seven', 'M_HS_COUNT'], ['Twelve', 'M_HS_COUNT']),
      C('Learners are asked to underline a gift, not a fruit, of the Spirit. Which one do they choose?', 'Miracles', 'Miracles are in 1 Corinthians 12:10.', ['Self-control', 'M_HS_MIX'], ['Peace', 'M_HS_MIX'], ['Joy', 'M_HS_MIX']),
    ], H1('The nine gifts are in 1 Corinthians 12:8-10.', 'Kindness, patience and joy belong to the other list.')) }),
  sfam({ id: 'cre5.spirit.fruit', cs: `${H}THE_HOLY_SPIRIT.HOLY_SPIRIT`, oc: 'b', form: 'word', rung: 2, kind: 'fruit and harmony',
    gen: choose([
      C('Which one is a fruit of the Holy Spirit in Galatians 5:22-23?', 'Kindness', 'Kindness is a fruit of the Spirit.', ['Prophecy', 'M_HS_MIX'], ['Healing', 'M_HS_MIX'], ['Miracles', 'M_HS_MIX']),
      C('Which one is a fruit of the Holy Spirit in Galatians 5:22-23?', 'Self-control', 'Self-control is a fruit of the Spirit.', ['Speaking in tongues', 'M_HS_MIX'], ['Prophecy', 'M_HS_MIX'], ['Miracles', 'M_HS_MIX']),
      C('How does the fruit of patience help Christians?', 'It helps them to bear with one another and live in harmony', 'Patient people forgive and wait.', ['It makes them leave quarrels unsolved', 'M_HS_HARMONY'], ['It makes them proud', 'M_HS_HARMONY'], ['It stops them praying', 'M_HS_HARMONY']),
      C('Two pupils disagree, and Amani speaks gently and listens. Which fruit is he showing?', 'Gentleness', 'Gentleness helps people live in harmony.', ['Prophecy', 'M_HS_MIX'], ['Healing', 'M_HS_MIX'], ['Miracles', 'M_HS_MIX']),
      C('How many fruit of the Holy Spirit are in Galatians 5:22-23?', 'Nine', 'The list has nine: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness and self-control.', ['Five', 'M_HS_COUNT'], ['Seven', 'M_HS_COUNT'], ['Twelve', 'M_HS_COUNT']),
      C('Which fruit of the Spirit helps people to love and care for one another?', 'Love and kindness', 'These help people live together in harmony.', ['Prophecy', 'M_HS_MIX'], ['Tongues', 'M_HS_MIX'], ['Healing', 'M_HS_MIX']),
    ], H1('The fruit are in Galatians 5:22-23.', 'Prophecy, healing and miracles are gifts, not fruit.')) }),

  // ---------------------------------------------------------------- PETER_RESCUE
  sfam({ id: 'cre5.rescue.facts', cs: `${H}PETER_S_MIRACULOUS_RESCU.PETER_RESCUE`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How did Peter get out of prison?', 'An angel woke him and the chains fell off', 'Acts 12:7 gives the account.', ['He broke the chains himself', 'M_PR_BROKE_OUT'], ['The guards freed him', 'M_PR_BROKE_OUT'], ['He climbed over the wall', 'M_PR_BROKE_OUT']),
      C('What was the church doing while Peter was in prison?', 'Praying earnestly to God for him', 'Acts 12:5 says earnest prayer was made.', ['Waiting quietly and doing nothing', 'M_PR_NO_PRAYER'], ['Planning an escape', 'M_PR_NO_PRAYER'], ['Hiding', 'M_PR_NO_PRAYER']),
      C('What did Rhoda do when she heard Peter\'s voice?', 'She ran in with joy and forgot to open the gate', 'Acts 12:14 says she did not open the gate for joy.', ['She opened the gate at once', 'M_PR_RHODA'], ['She went away', 'M_PR_RHODA'], ['She shouted at him', 'M_PR_RHODA']),
      C('How did the gate of the prison open?', 'By itself', 'Acts 12:10 says it opened of its own accord.', ['The guard opened it', 'M_PR_BROKE_OUT'], ['Peter broke it', 'M_PR_BROKE_OUT'], ['The angel used a key', 'M_PR_BROKE_OUT']),
      C('Who arrested Peter?', 'King Herod', 'Acts 12:3 says Herod arrested Peter.', ['The Pharisees', 'M_PR_NO_PRAYER'], ['A Roman soldier on his own', 'M_PR_NO_PRAYER'], ['The high priest of Jerusalem only', 'M_PR_NO_PRAYER']),
    ], H1('Reread Acts 12:3-17.', 'God rescued Peter while the church prayed.')) }),
  sfam({ id: 'cre5.rescue.lessons', cs: `${H}PETER_S_MIRACULOUS_RESCU.PETER_RESCUE`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Which lesson do we learn from Peter\'s rescue?', 'Pray for each other, and God answers', 'The church prayed and God rescued Peter.', ['Rely only on our own strength', 'M_PR_BROKE_OUT'], ['Prayer changes nothing', 'M_PR_NO_PRAYER'], ['Escape is always possible', 'M_PR_BROKE_OUT']),
      C('A pupil is ill, and his class prays for him. Which lesson from the story fits?', 'Pray earnestly for one another', 'The church prayed earnestly for Peter.', ['Do nothing', 'M_PR_NO_PRAYER'], ['Wait for someone else', 'M_PR_NO_PRAYER'], ['Forget about him', 'M_PR_NO_PRAYER']),
      C('What does Peter\'s rescue show about God?', 'God can rescue his people and answers prayer', 'The angel set Peter free.', ['God cannot help in prison', 'M_PR_NO_PRAYER'], ['God left Peter alone', 'M_PR_NO_PRAYER'], ['God does not use angels', 'M_PR_BROKE_OUT']),
      C('Which sentence is true?', 'Rhoda was so glad that she forgot to open the gate', 'Acts 12:14 describes her joy.', ['Rhoda opened the gate at once', 'M_PR_RHODA'], ['Rhoda was afraid and ran away', 'M_PR_RHODA'], ['Rhoda was not at the house', 'M_PR_RHODA']),
      C('How can we have faith like Peter?', 'Trust God even when things look hopeless', 'Peter slept in chains and trusted God.', ['Give up quickly', 'M_PR_NO_PRAYER'], ['Depend only on soldiers', 'M_PR_BROKE_OUT'], ['Never ask for help', 'M_PR_NO_PRAYER']),
    ], H1('The church prayed and God acted.', 'Faith trusts God in hard times.')) }),

  // ---------------------------------------------------------------- FRIENDS
  sfam({ id: 'cre5.friends.choose', cs: `${X}FRIENDSHIP_FORMATION.FRIENDS`, oc: 'a', form: 'direct', rung: 1, kind: 'qualities',
    gen: choose([
      C('Which is the best reason to choose a friend?', 'He is honest, kind and respectful', 'Good character makes a good friend.', ['He is popular and has nice things', 'M_FR_POPULAR'], ['He always agrees with you', 'M_FR_FOLLOW'], ['He is the tallest', 'M_FR_POPULAR']),
      C('Which quality should a good friend have?', 'Honesty', 'A good friend tells the truth.', ['Wealth', 'M_FR_POPULAR'], ['A loud voice', 'M_FR_POPULAR'], ['A quick temper', 'M_FR_PROVERB']),
      C('What does Proverbs 22:24-25 advise?', 'Do not make friends with a person who is easily angered', 'You may learn his ways.', ['Be friends with everyone who has a quick temper', 'M_FR_PROVERB'], ['Copy friends who are angry', 'M_FR_PROVERB'], ['Never speak to anyone', 'M_FR_PROVERB']),
      C('What does Proverbs 12:26 say about the righteous?', 'He chooses his friends carefully', 'Wise people choose friends with care.', ['He takes any friend', 'M_FR_POPULAR'], ['He has no friends', 'M_FR_POPULAR'], ['He follows the crowd', 'M_FR_FOLLOW']),
      C('Which friend would you rather choose?', 'One who respects others and does his homework', 'Good friends encourage good habits.', ['One who skips school with you', 'M_FR_FOLLOW'], ['One who has the newest phone', 'M_FR_POPULAR'], ['One who laughs at others', 'M_FR_POPULAR']),
    ], H1('Choose friends by their character.', 'Proverbs warns about angry friends and says to choose carefully.')) }),
  sfam({ id: 'cre5.friends.pressure', cs: `${X}FRIENDSHIP_FORMATION.FRIENDS`, oc: 'b', form: 'word', rung: 2, kind: 'avoid bad influence',
    gen: choose([
      C('A friend asks Juma to copy answers in a test. What should he do?', 'Say no politely and offer to help him study', 'A good friend does not push you to do wrong.', ['Copy so he keeps his friend', 'M_FR_FOLLOW'], ['Copy but promise not to do it again', 'M_FR_FOLLOW'], ['Tell everyone about it', 'M_FR_FOLLOW']),
      C('Friends tell Njeri to skip church to play. Which response is good?', 'Say no kindly and invite them to come with her', 'Peer pressure is resisted with courage.', ['Go with them to keep them happy', 'M_FR_FOLLOW'], ['Pretend to be ill', 'M_FR_FOLLOW'], ['Hide from them', 'M_FR_FOLLOW']),
      C('How can a learner avoid negative peer influence?', 'By choosing friends who do right and by saying no politely', 'Choosing carefully protects us.', ['By doing whatever friends ask', 'M_FR_FOLLOW'], ['By having no friends at all', 'M_FR_POPULAR'], ['By following the most popular group', 'M_FR_POPULAR']),
      C('Which of these friends is a bad influence?', 'One who tells you to lie to your parents', 'A friend who asks you to do wrong should not be followed.', ['One who helps you with homework', 'M_FR_POPULAR'], ['One who shares his lunch', 'M_FR_POPULAR'], ['One who prays for you', 'M_FR_POPULAR']),
      C('Mutua is told, "If you are my friend, you will do this wrong thing." What is the best reply?', '"A good friend would not ask me to do wrong"', 'A real friend respects your choice.', ['"Okay, I will do it"', 'M_FR_FOLLOW'], ['"Let us hide it"', 'M_FR_FOLLOW'], ['"I will do it just once"', 'M_FR_FOLLOW']),
    ], H1('A real friend does not push you to do wrong.', 'You can say no politely.')) }),

  // ---------------------------------------------------------------- ADOLESCENCE
  sfam({ id: 'cre5.adolescence.changes', cs: `${X}HUMAN_SEXUALITY.ADOLESCENCE`, oc: 'a', form: 'direct', rung: 1, kind: 'changes of growing up',
    gen: choose([
      C('Which is a normal change at adolescence?', 'Growing taller and growing body hair', 'These changes happen as children grow.', ['Becoming shorter', 'M_AD_BODY'], ['Losing all hair', 'M_AD_BODY'], ['Becoming younger', 'M_AD_BODY']),
      C('Which change usually happens in girls at adolescence?', 'Monthly periods begin', 'This is a normal change in girls.', ['The voice becomes deep', 'M_AD_BODY'], ['They lose all hair', 'M_AD_BODY'], ['They stop growing', 'M_AD_BODY']),
      C('Which change usually happens in boys at adolescence?', 'The voice becomes deeper', 'This is a normal change in boys.', ['Monthly periods begin', 'M_AD_BODY'], ['The body shrinks', 'M_AD_BODY'], ['The voice becomes a whisper', 'M_AD_BODY']),
      C('How should a child feel about changes of adolescence?', 'They are normal, and I can ask a trusted adult', 'Everyone goes through them.', ['Ashamed, and tell no one', 'M_AD_SHAME'], ['Afraid, and ask only friends', 'M_AD_FRIEND_INFO'], ['Proud, and boast about them', 'M_AD_SHAME']),
      C('Where is the best place to find the right information about growing up?', 'From a parent, guardian, teacher or health worker you trust', 'They give correct and caring answers.', ['From friends and anything on the internet', 'M_AD_FRIEND_INFO'], ['From strangers online', 'M_AD_FRIEND_INFO'], ['From rumours at school', 'M_AD_FRIEND_INFO']),
    ], H1('Changes of growing up are normal.', 'Ask a trusted adult for the right information.')) }),
  sfam({ id: 'cre5.adolescence.relationships', cs: `${X}HUMAN_SEXUALITY.ADOLESCENCE`, oc: 'c', form: 'why', rung: 2, kind: 'healthy or unhealthy',
    gen: choose([
      C('Which is a sign of an unhealthy friendship?', 'The friend says to keep it secret and gives gifts for favours', 'Secrecy and pressure are warning signs.', ['The friend respects you and your parents know', 'M_AD_SECRET'], ['The friends meet in a group at church', 'M_AD_SECRET'], ['The friend helps with homework', 'M_AD_SECRET']),
      C('Which is a sign of a healthy friendship?', 'It is respectful, honest and your parents know about it', 'Healthy friendships are open and respectful.', ['It is secret and exciting', 'M_AD_SECRET'], ['It involves pressure', 'M_AD_SECRET'], ['It involves gifts for favours', 'M_AD_SECRET']),
      C('An older person gives Amina gifts and says, "Do not tell your parents." What should she do?', 'Refuse the gifts and tell a trusted adult at once', 'A child should always tell a trusted adult.', ['Keep the secret', 'M_AD_SECRET'], ['Accept the gifts quietly', 'M_AD_SECRET'], ['Keep meeting him', 'M_AD_SECRET']),
      C('What can 1 Corinthians 6:18-19 teach a young person?', 'The body is precious and to be treated with respect', 'Our bodies are temples of the Holy Spirit.', ['The body is not important', 'M_AD_SHAME'], ['The body is a secret', 'M_AD_SHAME'], ['The body belongs to friends', 'M_AD_FRIEND_INFO']),
      C('Who can a child talk to if confused about the body or a friendship?', 'A parent, guardian, teacher or health worker', 'Trusted adults give right advice.', ['No one', 'M_AD_SHAME'], ['Only friends', 'M_AD_FRIEND_INFO'], ['A stranger online', 'M_AD_FRIEND_INFO']),
    ], H1('Warning signs are secrecy, pressure and gifts for favours.', 'Tell a trusted adult.')) }),

  // ---------------------------------------------------------------- SANCTITY_LIFE
  sfam({ id: 'cre5.life.teaching', cs: `${X}SANCTITY_OF_LIFE.SANCTITY_LIFE`, oc: 'a', form: 'direct', rung: 1, kind: 'teaching',
    gen: choose([
      C('According to Christian teaching, who is the source of life?', 'God, the giver of life', 'All life comes from God.', ['Only a person\'s parents', 'M_SL_SOURCE'], ['Chance', 'M_SL_SOURCE'], ['The government', 'M_SL_SOURCE']),
      C('Genesis 1:27 says that human beings were made...', 'In God\'s image', 'Every person is valuable.', ['By chance', 'M_SL_SOURCE'], ['Without purpose', 'M_SL_SOURCE'], ['Only for work', 'M_SL_SOURCE']),
      C('What does it mean that human life is sacred?', 'It is holy because it comes from God and is made in his image', 'We are not to take human life.', ['Animals must never be used', 'M_SL_ANIMALS'], ['Only adults matter', 'M_SL_ANIMALS'], ['Only the strong matter', 'M_SL_ANIMALS']),
      C('Which verse says that human life is not to be taken?', 'Exodus 20:13', 'The commandment says, "You shall not murder."', ['Genesis 2:15', 'M_SL_SOURCE'], ['Proverbs 9:10', 'M_SL_SOURCE'], ['Psalm 1:1', 'M_SL_SOURCE']),
      C('Who gives life to every person?', 'God', 'Parents bring children into the world, but God gives life.', ['Parents alone', 'M_SL_SOURCE'], ['Doctors', 'M_SL_SOURCE'], ['Teachers', 'M_SL_SOURCE']),
    ], H1('Life is a gift from God.', 'Genesis 1:27 and 9:6 and Exodus 20:13 speak about life.')) }),
  sfam({ id: 'cre5.life.anger', cs: `${X}SANCTITY_OF_LIFE.SANCTITY_LIFE`, oc: 'b', form: 'word', rung: 2, kind: 'causes and coping',
    gen: choose([
      C('Which is a cause of violence against life?', 'Uncontrolled anger and revenge', 'Anger that is not controlled can lead to harm.', ['Kindness', 'M_SL_ANGER'], ['Patience', 'M_SL_ANGER'], ['Forgiveness', 'M_SL_ANGER']),
      C('A classmate hits Kiprono. What is a safe way to cope with his anger?', 'Walk away, calm down and tell a teacher', 'A calm response avoids harm.', ['Hit back so he learns', 'M_SL_ANGER'], ['Plan revenge', 'M_SL_ANGER'], ['Hit a smaller child', 'M_SL_ANGER']),
      C('Which helps a person cope with a hard feeling?', 'Talking to a trusted person or praying', 'Sharing feelings helps.', ['Hitting someone', 'M_SL_ANGER'], ['Keeping it secret and angry', 'M_SL_ANGER'], ['Breaking things', 'M_SL_ANGER']),
      C('Which sentence about life is true?', 'Human life is sacred and every person is valuable', 'Genesis 1:27 shows God\'s image in people.', ['Only some people matter', 'M_SL_ANIMALS'], ['Life has no value', 'M_SL_SOURCE'], ['Parents alone own life', 'M_SL_SOURCE']),
      C('Which is a good response to jealousy?', 'Be thankful for what you have and congratulate others', 'Jealousy can cause harm if not handled.', ['Take revenge', 'M_SL_ANGER'], ['Hurt the other person', 'M_SL_ANGER'], ['Spread rumours', 'M_SL_ANGER']),
    ], H1('Walk away, calm down and talk to someone you trust.', 'Hitting back can harm.')) }),

  // ---------------------------------------------------------------- DRUGS
  sfam({ id: 'cre5.drugs.which', cs: `${X}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS`, oc: 'a', form: 'direct', rung: 1, kind: 'substances and effects',
    gen: choose([
      C('Which is drug abuse?', 'Sniffing glue to feel different', 'Misusing a substance harms the body and mind.', ['Taking medicine as the doctor says', 'M_DR_MEDICINE'], ['Drinking clean water', 'M_DR_MEDICINE'], ['Eating a balanced meal', 'M_DR_MEDICINE']),
      C('Which is a substance that young people misuse?', 'Alcohol', 'Alcohol is misused by some young people and harms them.', ['Water', 'M_DR_MEDICINE'], ['Milk', 'M_DR_MEDICINE'], ['Tea with no sugar', 'M_DR_MEDICINE']),
      C('What is an effect of alcohol and drug abuse?', 'Poor health, failing at school and quarrels', 'Substance abuse harms the person and others.', ['Better health and better marks', 'M_DR_EFFECT'], ['Being stronger', 'M_DR_EFFECT'], ['Being wiser', 'M_DR_EFFECT']),
      C('What does Proverbs 20:1 warn about?', 'Strong drink leads people astray', 'It warns us against being led astray by it.', ['That drink makes people wise', 'M_DR_EFFECT'], ['That drink is a gift', 'M_DR_EFFECT'], ['That drink is for children', 'M_DR_ONLY_ADULTS']),
      C('Is medicine taken as a health worker directs drug abuse?', 'No, it is used properly for health', 'Drug abuse is misuse that harms.', ['Yes, all medicine is drug abuse', 'M_DR_MEDICINE'], ['Yes, when it is bitter', 'M_DR_MEDICINE'], ['Yes, for children', 'M_DR_MEDICINE']),
      C('What is true about trying a harmful drug just once?', 'It can start a habit that is hard to stop', 'Many people started with one try.', ['One try can never harm you', 'M_DR_SAFE_ONE'], ['It makes you braver', 'M_DR_SAFE_ONE'], ['It is safe for children', 'M_DR_SAFE_ONE']),
    ], H1('Drug abuse is misuse that harms the body and mind.', 'Medicine used as directed is not abuse.')) }),
  sfam({ id: 'cre5.drugs.say-no', cs: `${X}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS`, oc: 'd', form: 'word', rung: 2, kind: 'why start and how to say no',
    gen: choose([
      C('Why do some young people start using drugs?', 'Peer pressure, stress and curiosity', 'Knowing the reasons helps us to avoid them.', ['Because it is good for them', 'M_DR_EFFECT'], ['Because adults ask them to for health', 'M_DR_MEDICINE'], ['Because it makes them taller', 'M_DR_EFFECT']),
      C('An older boy offers Baraka a cigarette. What should he do?', 'Say no and tell a trusted adult', 'Saying no is a sign of courage.', ['Try it just once', 'M_DR_SAFE_ONE'], ['Take it to keep the boy happy', 'M_DR_SAFE_ONE'], ['Keep it a secret', 'M_DR_SAFE_ONE']),
      C('Which value helps a young person to avoid alcohol and drugs?', 'Self-control', 'Self-control, courage and honesty help.', ['Curiosity at any cost', 'M_DR_SAFE_ONE'], ['Pride', 'M_DR_ONLY_ADULTS'], ['Greed', 'M_DR_ONLY_ADULTS']),
      C('Who can be tempted to use drugs?', 'Both adults and children, especially when friends pressure them', 'Children need to know the dangers.', ['Only adults', 'M_DR_ONLY_ADULTS'], ['Only older people', 'M_DR_ONLY_ADULTS'], ['No one', 'M_DR_ONLY_ADULTS']),
      C('Which message would you put on the school notice board?', 'Say no to alcohol, drugs and substance abuse', 'We can help others by spreading safe messages.', ['Try it once to see', 'M_DR_SAFE_ONE'], ['Drugs make you strong', 'M_DR_EFFECT'], ['Only adults need to know', 'M_DR_ONLY_ADULTS']),
    ], H1('Say no, and tell a trusted adult.', 'Self-control and courage help.')) }),

  // ---------------------------------------------------------------- SOCIAL_MEDIA
  sfam({ id: 'cre5.social.safe', cs: `${X}SOCIAL_MEDIA.SOCIAL_MEDIA`, oc: 'c', form: 'direct', rung: 1, kind: 'safety rules',
    gen: choose([
      C('Which information must you keep private online?', 'Your password and home address', 'Passwords and addresses can be used to harm you.', ['Your favourite colour', 'M_SM2_SHARE_ALL'], ['Your favourite song', 'M_SM2_SHARE_ALL'], ['The weather', 'M_SM2_SHARE_ALL']),
      C('A stranger online asks to meet you. What should you do?', 'Do not reply, and tell a parent or teacher', 'People online may not be who they say.', ['Meet him because he is kind', 'M_SM2_STRANGER'], ['Meet him with a friend', 'M_SM2_STRANGER'], ['Send him your address', 'M_SM2_SHARE_ALL']),
      C('You receive an unkind message about a classmate. What should you do?', 'Delete it and not pass it on', 'Passing it on can hurt a person.', ['Forward it to the class', 'M_SM2_FORWARD'], ['Laugh and share it', 'M_SM2_FORWARD'], ['Add to it', 'M_SM2_FORWARD']),
      C('What should you do if something online frightens you?', 'Tell a trusted adult', 'A trusted adult can help.', ['Keep it a secret', 'M_SM2_STRANGER'], ['Share it widely', 'M_SM2_FORWARD'], ['Ignore it and do it again', 'M_SM2_STRANGER']),
      C('Which is safe to share online?', 'A picture of a school project, with your parent\'s permission', 'Sharing carefully, with permission, is safer.', ['Your password', 'M_SM2_SHARE_ALL'], ['Your address and phone number', 'M_SM2_SHARE_ALL'], ['Your bank details', 'M_SM2_SHARE_ALL']),
    ], H1('Keep private things private and tell a trusted adult.', 'Never meet a stranger from the internet.')) }),
  sfam({ id: 'cre5.social.weigh', cs: `${X}SOCIAL_MEDIA.SOCIAL_MEDIA`, oc: 'b', form: 'word', rung: 2, kind: 'advantages and disadvantages',
    gen: choose([
      C('Which is an advantage of social media?', 'It helps you talk to relatives far away', 'It connects people.', ['It wastes time', 'M_SM2_ONLY_GOOD'], ['It can spread false messages', 'M_SM2_ONLY_GOOD'], ['It can be unsafe', 'M_SM2_ONLY_GOOD']),
      C('Which is a disadvantage of social media?', 'It can waste time and spread false or harmful messages', 'We must use it with care.', ['It lets you talk to relatives', 'M_SM2_ONLY_GOOD'], ['It helps you to learn', 'M_SM2_ONLY_GOOD'], ['It brings people together', 'M_SM2_ONLY_GOOD']),
      C('Which is a social media platform?', 'WhatsApp', 'WhatsApp is a messaging platform.', ['A textbook', 'M_SM2_ONLY_GOOD'], ['A school bell', 'M_SM2_ONLY_GOOD'], ['A newspaper', 'M_SM2_ONLY_GOOD']),
      C('Which sentence is true about social media?', 'It has both advantages and disadvantages', 'We should use it responsibly.', ['It has only advantages', 'M_SM2_ONLY_GOOD'], ['It has only disadvantages', 'M_SM2_ONLY_GOOD'], ['It has no effects', 'M_SM2_ONLY_GOOD']),
      C('How can a Christian use social media with integrity?', 'By sharing only true and kind things', 'Integrity means honesty and kindness.', ['By sharing every message he receives', 'M_SM2_FORWARD'], ['By posting unkind jokes', 'M_SM2_FORWARD'], ['By sharing false news', 'M_SM2_FORWARD']),
    ], H1('Social media has good and bad sides.', 'A Christian uses it with honesty and kindness.')) }),
];
