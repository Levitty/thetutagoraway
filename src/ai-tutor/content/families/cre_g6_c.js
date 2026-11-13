// ============================================================================
// GRADE 6 CHRISTIAN RELIGIOUS EDUCATION, PART C: The Church (the Apostles' Creed, the Trinity, Paul's suffering, church unity)
// and Christian Living Today (friendship, responsible behaviour, the sanctity of life, alcohol and drugs). Written offline
// from the KICD 2024 design through the curriculum map. No denominational claims: the creed is asked only for what its words
// say, and the sensitive topics are written for Grade 6 with a trusted adult always named as the place to turn.
// Every family stays reviewed:false until a CRE teacher signs it off (cre_g6_signed.js): none reaches a child.
// ============================================================================
import { sfam, choose, C } from './cre_g6_lib.js';

const T = 'THE_CH.';
const K = 'CHRIST.';
const H1 = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- CREED
  sfam({ id: 'cre6.creed.lines', cs: `${T}APOSTLES_CREED.CREED_TEACHING`, oc: 'b', form: 'direct', rung: 1, kind: 'what the creed says',
    gen: choose([
      C('Which line is in the Apostles\' Creed?', 'Born of the Virgin Mary', 'The creed says Jesus Christ was born of the Virgin Mary.', ['Born in the city of Rome', 'M_CRE6_OTHER'], ['Born in a palace', 'M_CRE6_OTHER'], ['Born to a king of Egypt', 'M_CRE6_OTHER']),
      C('How does the creed begin?', '"I believe in God, the Father Almighty, maker of heaven and earth"', 'The creed begins with belief in God the Father, maker of heaven and earth.', ['"I believe in the Bible only"', 'M_CRE6_BIBLE'], ['"I believe in Jesus alone, maker of the world"', 'M_CRE6_ORDER'], ['"I believe in the church building"', 'M_CRE6_OTHER']),
      C('Whom does the creed call maker of heaven and earth?', 'God the Father Almighty', 'The creed begins with God the Father Almighty, maker of heaven and earth.', ['Jesus Christ, the judge', 'M_CRE6_ORDER'], ['The Holy Spirit', 'M_CRE6_ORDER'], ['Pontius Pilate', 'M_CRE6_ORDER']),
      C('Under whose rule does the creed say Jesus suffered?', 'Pontius Pilate', 'The creed says Jesus suffered under Pontius Pilate.', ['King Herod', 'M_CRE6_OTHER'], ['The emperor Nero', 'M_CRE6_OTHER'], ['King David', 'M_CRE6_OTHER']),
      C('What does the creed say happened on the third day?', 'He rose again from the dead', 'The creed says that on the third day he rose again.', ['He was born', 'M_CRE6_OTHER'], ['He was buried', 'M_CRE6_OTHER'], ['He was tried', 'M_CRE6_OTHER']),
      C('What does the creed say Jesus will do?', 'Come to judge the living and the dead', 'The creed says he will come to judge the living and the dead.', ['Come to build a new temple', 'M_CRE6_OTHER'], ['Come to be crowned king of Rome', 'M_CRE6_OTHER'], ['Come to rest', 'M_CRE6_OTHER']),
    ], H1('Recall the words of the creed, line by line.', 'The creed names the Father, the Son and the Holy Spirit.')) }),
  sfam({ id: 'cre6.creed.use', cs: `${T}APOSTLES_CREED.CREED_TEACHING`, oc: 'c', form: 'why', rung: 2, kind: 'why Christians say it',
    gen: choose([
      C('What is the Apostles\' Creed?', 'A short statement of Christian belief', 'It summarises what Christians believe.', ['A book of the Bible', 'M_CRE6_BIBLE'], ['A list of church rules', 'M_CRE6_BIBLE'], ['A story of the apostles\' journeys', 'M_CRE6_OTHER']),
      C('Why do Christians say the creed together?', 'To affirm their faith in Christ', 'Saying the creed shows what they believe together.', ['To prove the Bible wrong', 'M_CRE6_OTHER'], ['To count the apostles', 'M_CRE6_OTHER'], ['To keep a secret', 'M_CRE6_OTHER']),
      C('Which sentence about the creed is true?', 'It states the faith of Christians in a short form', 'It sums up Christian belief in a few lines.', ['It is a chapter of the Gospel of Mark', 'M_CRE6_BIBLE'], ['It was written by Pontius Pilate', 'M_CRE6_OTHER'], ['It is only for pastors', 'M_CRE6_OTHER']),
      C('The creed mentions the forgiveness of sins. What does that teach?', 'God forgives those who turn to him', 'The forgiveness of sins is one of the beliefs of the creed.', ['Sins do not matter because everyone does wrong', 'M_CRE6_OTHER'], ['No one is forgiven, however sorry he may be', 'M_CRE6_OTHER'], ['Only pastors are forgiven, ordinary people are not', 'M_CRE6_OTHER']),
      C('Which line in the creed speaks about the future?', 'He will come to judge the living and the dead', 'The creed looks forward to Christ\'s return.', ['Born of the Virgin Mary and laid in a manger', 'M_CRE6_ORDER'], ['Suffered under Pontius Pilate and was crowned a king', 'M_CRE6_ORDER'], ['Crucified, died and was buried in the garden of Eden', 'M_CRE6_ORDER']),
    ], H1('The creed is a statement of belief and not a book of the Bible.', 'It begins with God the Father and ends with life everlasting.')) }),
  sfam({ id: 'cre6.trinity.persons', cs: `${T}APOSTLES_CREED.TRINITY`, oc: 'd', form: 'direct', rung: 1, kind: 'name the persons',
    gen: choose([
      C('Which are the three persons of the Holy Trinity?', 'The Father, the Son and the Holy Spirit', 'Christians believe in the Father, the Son and the Holy Spirit.', ['Moses, David and Paul', 'M_TRI6_MEMBER'], ['Peter, James and John', 'M_TRI6_MEMBER'], ['Michael, Gabriel and Raphael', 'M_TRI6_MEMBER']),
      C('The Holy Trinity is...', 'One God in three persons', 'Christians believe in one God.', ['Three different gods', 'M_TRI6_THREE_GODS'], ['Two gods and an angel', 'M_TRI6_THREE_GODS'], ['A group of apostles', 'M_TRI6_MEMBER']),
      C('Which is the third person of the Holy Trinity?', 'The Holy Spirit', 'The three persons are the Father, the Son and the Holy Spirit.', ['The archangel Michael', 'M_TRI6_MEMBER'], ['Mary', 'M_TRI6_MEMBER'], ['John the Baptist', 'M_TRI6_MEMBER']),
      C('Which person of the Trinity is called the Son?', 'Jesus Christ', 'Jesus Christ is God the Son.', ['The Holy Spirit', 'M_TRI6_ROLE'], ['God the Father', 'M_TRI6_ROLE'], ['Moses', 'M_TRI6_MEMBER']),
      C('How many gods do Christians worship?', 'One God', 'The Trinity is one God in three persons.', ['Three gods', 'M_TRI6_THREE_GODS'], ['Two gods', 'M_TRI6_THREE_GODS'], ['Many gods', 'M_TRI6_THREE_GODS']),
    ], H1('Father, Son and Holy Spirit are the three persons of one God.', 'The Trinity is not three gods.')) }),
  sfam({ id: 'cre6.trinity.roles', cs: `${T}APOSTLES_CREED.TRINITY`, oc: 'e', form: 'why', rung: 2, kind: 'what each person does',
    gen: choose([
      C('Who is called the creator in the creed?', 'God the Father', 'The creed names the Father as maker of heaven and earth.', ['The Holy Spirit', 'M_TRI6_ROLE'], ['Jesus Christ', 'M_TRI6_ROLE'], ['The apostles', 'M_TRI6_MEMBER']),
      C('Who is the saviour who died and rose again?', 'God the Son, Jesus Christ', 'Jesus died and rose to save people.', ['God the Father', 'M_TRI6_ROLE'], ['The Holy Spirit', 'M_TRI6_ROLE'], ['An angel', 'M_TRI6_MEMBER']),
      C('Who is the helper and comforter who lives in believers?', 'The Holy Spirit', 'The Holy Spirit helps and comforts believers.', ['God the Father alone', 'M_TRI6_ROLE'], ['Jesus Christ, who is not living', 'M_TRI6_ROLE'], ['The church leaders', 'M_TRI6_MEMBER']),
      C('Why is the Holy Trinity important to Christians?', 'It teaches that God is Father, Son and Spirit and is near to us', 'It shows the nature of the one God.', ['It means there are three gods', 'M_TRI6_THREE_GODS'], ['It is not important', 'M_TRI6_THREE_GODS'], ['It is only for pastors', 'M_TRI6_MEMBER']),
      C('Which sentence is false?', 'There are three separate gods', 'Christians believe in one God in three persons.', ['The Father, the Son and the Holy Spirit are one God', 'M_TRI6_THREE_GODS'], ['The Holy Spirit is a helper', 'M_TRI6_ROLE'], ['The Son is Jesus Christ', 'M_TRI6_ROLE']),
    ], H1('Father: creator. Son: saviour. Holy Spirit: helper.', 'There is one God, not three.')) }),

  // ---------------------------------------------------------------- PAUL
  sfam({ id: 'cre6.paul.suffering', cs: `${T}STANDING_FIRM_IN_FAITH_A.PAUL_SUFFERING`, oc: 'a', form: 'direct', rung: 1, kind: 'what the apostles suffered',
    gen: choose([
      C('Which of these is in Paul\'s list of hardships in 2 Corinthians 6:5?', 'Beatings and imprisonments', '2 Corinthians 6:5 lists beatings, imprisonments, riots, hard work, sleepless nights and hunger.', ['Wealth and comfort', 'M_PAU6_LIST'], ['A life of ease', 'M_PAU6_LIST'], ['Honours from kings', 'M_PAU6_LIST']),
      C('Which hardship did the apostles face?', 'Hunger and sleepless nights', 'These are in 2 Corinthians 6:5.', ['Comfortable houses', 'M_PAU6_LIST'], ['Large crowds cheering them', 'M_PAU6_LIST'], ['Long holidays', 'M_PAU6_LIST']),
      C('Why did the apostles suffer?', 'They served Christ and were not stopped by hardship', 'Paul lists these as part of faithful service.', ['God was angry with them', 'M_PAU6_PUNISH'], ['They had done something wrong', 'M_PAU6_PUNISH'], ['They were lazy', 'M_PAU6_PUNISH']),
      C('Which virtue does Paul name in 2 Corinthians 6:6?', 'Patience and kindness', '2 Corinthians 6:6 names purity, understanding, patience, kindness and sincere love.', ['Pride', 'M_PAU6_VIRTUE'], ['Revenge', 'M_PAU6_VIRTUE'], ['Greed', 'M_PAU6_VIRTUE']),
      C('Which of these is a virtue in Paul\'s life?', 'Sincere love', 'Sincere love is one of the virtues Paul names.', ['Boasting', 'M_PAU6_VIRTUE'], ['Anger', 'M_PAU6_VIRTUE'], ['Selfishness', 'M_PAU6_VIRTUE']),
    ], H1('Read 2 Corinthians 6:3-7 and find the list of hardships and virtues.', 'Beatings, prison, hunger; patience, kindness, sincere love.')) }),
  sfam({ id: 'cre6.paul.firm', cs: `${T}STANDING_FIRM_IN_FAITH_A.PAUL_SUFFERING`, oc: 'c', form: 'why', rung: 2, kind: 'stand firm today',
    gen: choose([
      C('Amina is laughed at for praying at school. Which virtue of Paul helps her?', 'Patience and kindness', 'Paul showed patience and kindness in hardship.', ['Revenge', 'M_PAU6_VIRTUE'], ['Pride', 'M_PAU6_VIRTUE'], ['Giving up her faith', 'M_PAU6_PUNISH']),
      C('How can a child stand firm in faith when others tease?', 'Keep praying and stay kind, without hitting back', 'Paul stood firm with patience and love.', ['Give up faith to avoid teasing', 'M_PAU6_PUNISH'], ['Hit back at those who tease', 'M_PAU6_VIRTUE'], ['Hide the faith for ever', 'M_PAU6_PUNISH']),
      C('A Christian suffers because of her faith. What can she remember?', 'The apostles also faced hardship and stood firm', 'Suffering does not mean God is angry.', ['God must be angry with her for something she did', 'M_PAU6_PUNISH'], ['She did something wrong and deserves the suffering', 'M_PAU6_PUNISH'], ['She should stop believing so that she is left in peace', 'M_PAU6_PUNISH']),
      C('Which value from Paul helps in a hard time?', 'Sincere love for others', 'Love keeps us faithful.', ['Boasting', 'M_PAU6_VIRTUE'], ['Anger', 'M_PAU6_VIRTUE'], ['Selfishness', 'M_PAU6_VIRTUE']),
      C('What does it mean to stand firm in faith?', 'To keep believing and doing right even when it is hard', 'Paul did not give up when he suffered.', ['To give up when others disagree', 'M_PAU6_PUNISH'], ['To argue with everyone', 'M_PAU6_VIRTUE'], ['To hide', 'M_PAU6_PUNISH']),
    ], H1('Suffering does not mean God is angry; stand firm with love and patience.', 'Choose the answer that keeps faith without hitting back.')) }),

  // ---------------------------------------------------------------- UNITY
  sfam({ id: 'cre6.unity.verses', cs: `${T}CHURCH_UNITY.CHURCH_UNITY`, oc: 'b', form: 'direct', rung: 1, kind: 'what a verse teaches',
    gen: choose([
      C('1 Corinthians 12:12 compares the church to what?', 'One body with many parts', 'Paul says the body is one though it has many parts.', ['A building of one stone', 'M_UNI6_BUILDING'], ['An army of equal soldiers', 'M_UNI6_SAME'], ['A market', 'M_UNI6_RANK']),
      C('What does Galatians 3:28 say about people in Christ?', 'All are one in Christ Jesus', 'Galatians 3:28 says there is neither Jew nor Greek, slave nor free, male nor female: all are one in Christ.', ['Some are more important than others', 'M_UNI6_RANK'], ['Tribes must stay apart', 'M_UNI6_RANK'], ['Only leaders are one', 'M_UNI6_RANK']),
      C('In Matthew 16:18 Jesus says, "I will build my..."', 'Church', 'Jesus said he would build his church.', ['Hall', 'M_UNI6_BUILDING'], ['House', 'M_UNI6_BUILDING'], ['Palace', 'M_UNI6_BUILDING']),
      C('Which verse says that all are one in Christ whatever their tribe or status?', 'Galatians 3:28', 'Galatians 3:28 says all are one in Christ Jesus.', ['1 Corinthians 12:12', 'M_UNI6_SAME'], ['Matthew 16:18', 'M_UNI6_BUILDING'], ['Genesis 2:24', 'M_UNI6_RANK']),
      C('Which verse compares the church to a body?', '1 Corinthians 12:12', 'Paul compares the church to one body with many parts.', ['Galatians 3:28', 'M_UNI6_SAME'], ['Matthew 16:18', 'M_UNI6_BUILDING'], ['Luke 4:1', 'M_UNI6_RANK']),
    ], H1('Read the verse the question names.', 'One body with many parts; all one in Christ; Jesus builds his church.')) }),
  sfam({ id: 'cre6.unity.meaning', cs: `${T}CHURCH_UNITY.CHURCH_UNITY`, oc: 'c', form: 'why', rung: 2, kind: 'what unity means',
    gen: choose([
      C('What does unity in the church mean?', 'Different people working together as one in Christ', 'Unity is not sameness. It is working together in love.', ['Everyone is exactly the same', 'M_UNI6_SAME'], ['Everyone obeys one leader without speaking', 'M_UNI6_RANK'], ['Everyone sits in one building', 'M_UNI6_BUILDING']),
      C('How does church unity help people live in peace?', 'People respect one another and work together', 'Unity brings peace and cooperation.', ['People compete for the highest place', 'M_UNI6_RANK'], ['People look down on others', 'M_UNI6_RANK'], ['People stay apart by tribe', 'M_UNI6_RANK']),
      C('A church has members from different tribes. Which response shows unity?', 'They worship and serve together as one family', 'All are one in Christ.', ['They sit separately by tribe', 'M_UNI6_RANK'], ['They compete for position', 'M_UNI6_RANK'], ['They ignore each other', 'M_UNI6_SAME']),
      C('Why is the church compared to a body?', 'Each part has different work and all are needed', 'A body works when all its parts work together.', ['All parts are the same and do the same work', 'M_UNI6_SAME'], ['Only the head matters, since the rest only follows it', 'M_UNI6_RANK'], ['It is a building', 'M_UNI6_BUILDING']),
      C('What is the church, according to Jesus\' words in Matthew 16:18?', 'His people, which he builds', 'The church is Christ\'s people, not only a building.', ['Only a building with a roof', 'M_UNI6_BUILDING'], ['Only the pastors', 'M_UNI6_RANK'], ['A club', 'M_UNI6_RANK']),
    ], H1('Unity means working together in love, not being the same.', 'The church is Christ\'s people.')) }),

  // ---------------------------------------------------------------- FRIENDSHIP
  sfam({ id: 'cre6.friends.verses', cs: `${K}FRIENDSHIP_FORMATION.FRIENDSHIP`, oc: 'b', form: 'direct', rung: 1, kind: 'what the verse says',
    gen: choose([
      C('What does 1 Corinthians 15:33 say?', 'Bad company corrupts good character', 'The verse warns that bad company ruins good morals.', ['Bad company does not change a person', 'M_FRI6_BAD'], ['Bad friends are fun', 'M_FRI6_POPULAR'], ['Good friends are rich', 'M_FRI6_POPULAR']),
      C('What does Proverbs 13:20 say about the one who walks with the wise?', 'He grows wise', 'Proverbs 13:20 says whoever walks with the wise grows wise.', ['He grows poor', 'M_FRI6_POPULAR'], ['He grows foolish', 'M_FRI6_BAD'], ['He stays the same', 'M_FRI6_BAD']),
      C('What does Proverbs 13:20 say about a companion of fools?', 'He suffers harm', 'A companion of fools suffers harm.', ['He grows rich', 'M_FRI6_POPULAR'], ['He grows wise', 'M_FRI6_BAD'], ['He is always safe', 'M_FRI6_BAD']),
      C('What does Proverbs 16:28 say a gossip does?', 'Separates close friends', 'A gossip separates close friends.', ['Brings friends closer', 'M_FRI6_GOSSIP'], ['Makes friends rich', 'M_FRI6_GOSSIP'], ['Protects friends', 'M_FRI6_GOSSIP']),
      C('Which verse warns that bad company corrupts good character?', '1 Corinthians 15:33', 'It is in 1 Corinthians 15:33.', ['Proverbs 13:20', 'M_FRI6_BAD'], ['Proverbs 16:28', 'M_FRI6_BAD'], ['Genesis 2:24', 'M_FRI6_BAD']),
    ], H1('Read the verse the question names.', 'Bad company corrupts; the wise make you wise; a gossip separates friends.')) }),
  sfam({ id: 'cre6.friends.choose', cs: `${K}FRIENDSHIP_FORMATION.FRIENDSHIP`, oc: 'a', form: 'why', rung: 2, kind: 'choosing friends',
    gen: choose([
      C('What makes a good friend?', 'Being honest, kind and helping you do right', 'A good friend helps you do right.', ['Being popular and rich', 'M_FRI6_POPULAR'], ['Always agreeing with you', 'M_FRI6_BAD'], ['Keeping secrets about wrongdoing', 'M_FRI6_BAD']),
      C('A friend wants you to skip school. What is the right response?', 'Refuse kindly and go to school', 'A good friend does not lead you into wrong.', ['Go along to keep the friend', 'M_FRI6_BAD'], ['Go along only once', 'M_FRI6_BAD'], ['Lie to the teacher', 'M_FRI6_BAD']),
      C('Mwende notices her friend spreads rumours about others. What should she do?', 'Refuse to join in and speak kindly', 'Gossip separates friends, so she should avoid it.', ['Join in so that she stays popular with the others', 'M_FRI6_GOSSIP'], ['Spread them faster so that everyone hears at once', 'M_FRI6_GOSSIP'], ['Say nothing and laugh along with the others', 'M_FRI6_GOSSIP']),
      C('Why choose friends who help you do right?', 'Bad company corrupts good character', 'We become like those we spend time with.', ['Because good friends are rich', 'M_FRI6_POPULAR'], ['Because bad friends are never fun', 'M_FRI6_BAD'], ['Because friends do not matter', 'M_FRI6_BAD']),
      C('Which friend is wise to keep?', 'One who encourages you to study and pray', 'Such a friend walks with the wise.', ['One who pushes you to cheat', 'M_FRI6_BAD'], ['One who is only popular', 'M_FRI6_POPULAR'], ['One who gossips about everyone', 'M_FRI6_GOSSIP']),
    ], H1('A good friend helps you do right.', 'Bad company corrupts good character.')) }),

  // ---------------------------------------------------------------- SEXUALITY (written for Grade 6: respect, self-control, a trusted adult)
  sfam({ id: 'cre6.body.bible', cs: `${K}HUMAN_SEXUALITY_7_LESSON.SEXUALITY_BIBLE`, oc: 'a', form: 'direct', rung: 1, kind: 'what the verse says',
    gen: choose([
      C('Why should we respect our bodies (1 Corinthians 6:19)?', 'The body is the temple of the Holy Spirit', 'The verse says our body is a temple of the Holy Spirit.', ['We can do what we like with them', 'M_SEX6_BODY'], ['They are only ours to use as we please', 'M_SEX6_BODY'], ['They do not matter to God', 'M_SEX6_BODY']),
      C('According to James 1:14-15, when does temptation lead to sin?', 'When desire is allowed to grow and is acted on', 'James says desire gives birth to sin when it is acted on.', ['The moment a person is tempted, even if he does nothing', 'M_SEX6_TEMPT'], ['It never leads to sin, however long it is allowed to grow', 'M_SEX6_TEMPT'], ['Only when other people see what the person has done', 'M_SEX6_TEMPT']),
      C('Is being tempted itself a sin?', 'No, the sin is in giving in', 'Jesus was tempted and did not sin.', ['Yes, at once, as soon as the feeling comes', 'M_SEX6_TEMPT'], ['Yes, if you feel it strongly for a long time', 'M_SEX6_TEMPT'], ['Only for children', 'M_SEX6_TEMPT']),
      C('Which sentence agrees with 1 Corinthians 6:19?', 'Our bodies are to be treated with respect', 'The body is a temple to be honoured.', ['Our bodies are for showing off', 'M_SEX6_BODY'], ['Our bodies are not important', 'M_SEX6_BODY'], ['Our bodies belong to peer groups', 'M_SEX6_BODY']),
      C('What does the Bible teach young people about self-control?', 'To wait and to say no to wrong desires', 'The Bible teaches self-control.', ['To follow every desire', 'M_SEX6_TEMPT'], ['To hide everything from parents', 'M_SEX6_SECRET'], ['To copy the group', 'M_SEX6_BODY']),
    ], H1('Read 1 Corinthians 6:19 and James 1:14-15.', 'The body is a temple, and temptation is not itself a sin.')) }),
  sfam({ id: 'cre6.body.help', cs: `${K}HUMAN_SEXUALITY_7_LESSON.SEXUALITY_BIBLE`, oc: 'd', form: 'why', rung: 2, kind: 'a wise choice',
    gen: choose([
      C('A child is troubled about changes in growing up. What is wise?', 'Talk to a parent or trusted adult', 'A trusted adult can help.', ['Hide it from every adult', 'M_SEX6_SECRET'], ['Ask only friends who pressure you', 'M_SEX6_SECRET'], ['Pretend it is not happening', 'M_SEX6_SECRET']),
      C('Which choice shows respect for the body?', 'Dressing and behaving with respect', 'Respect for the body shows in how we behave.', ['Showing off in front of friends', 'M_SEX6_BODY'], ['Doing what friends dare', 'M_SEX6_BODY'], ['Keeping dangerous secrets', 'M_SEX6_SECRET']),
      C('A friend dares you to do something unsafe. Which is right?', 'Say no and walk away', 'Self-control and courage keep us safe.', ['Do it so as not to be teased', 'M_SEX6_BODY'], ['Do it only once', 'M_SEX6_TEMPT'], ['Do it in secret', 'M_SEX6_SECRET']),
      C('Why do we tell a trusted adult when something frightens us?', 'They can protect and guide us', 'Secrets about harm keep a child in danger.', ['Adults should not know', 'M_SEX6_SECRET'], ['It is a sign of weakness', 'M_SEX6_SECRET'], ['It is not necessary', 'M_SEX6_SECRET']),
      C('Which value helps a young person live responsibly?', 'Self-control', 'Self-control helps us choose well.', ['Following the crowd', 'M_SEX6_BODY'], ['Hiding things', 'M_SEX6_SECRET'], ['Daring', 'M_SEX6_TEMPT']),
    ], H1('A trusted adult, self-control and respect are the safe choices.', 'Never keep a secret that frightens you.')) }),
  sfam({ id: 'cre6.skills.causes', cs: `${K}HUMAN_SEXUALITY_7_LESSON.SEXUALITY_SKILLS`, oc: 'b', form: 'direct', rung: 1, kind: 'causes',
    gen: choose([
      C('Which can lead a young person into irresponsible behaviour?', 'Peer pressure and too little guidance', 'Pressure from friends and too little guidance are common causes.', ['Staying busy with school and sport', 'M_SEX6_CAUSE'], ['Praying and reading', 'M_SEX6_CAUSE'], ['Helping at home', 'M_SEX6_CAUSE']),
      C('Which is a cause of irresponsible behaviour among youth?', 'Harmful content on phones and television', 'Harmful media can mislead young people.', ['Good advice from parents', 'M_SEX6_CAUSE'], ['Sports clubs', 'M_SEX6_CAUSE'], ['A reading corner', 'M_SEX6_CAUSE']),
      C('How can idleness lead a youth into trouble?', 'With nothing to do, a youth may follow bad company', 'Idleness opens the door to bad company.', ['It keeps a youth busy and out of trouble each day', 'M_SEX6_CAUSE'], ['It builds good friends who keep him on the right path', 'M_SEX6_CAUSE'], ['It has no effect on what a young person chooses', 'M_SEX6_CAUSE']),
      C('An older person offers gifts in return for favours. What is right?', 'Refuse and tell a trusted adult', 'Gifts offered for favours are a trap.', ['Accept, it is only a gift', 'M_SEX6_GIFT'], ['Accept but tell no one', 'M_SEX6_GIFT'], ['Accept if the gift is big', 'M_SEX6_GIFT']),
      C('Which can lower a young person\'s judgment?', 'Alcohol and drugs', 'Alcohol and drugs cloud judgment and lead to risk.', ['A good night\'s sleep', 'M_SEX6_CAUSE'], ['A healthy meal', 'M_SEX6_CAUSE'], ['Prayer', 'M_SEX6_CAUSE']),
    ], H1('Pressure, harmful content, idleness, gifts for favours, and drugs are causes.', 'Good guidance protects young people.')) }),
  sfam({ id: 'cre6.skills.help', cs: `${K}HUMAN_SEXUALITY_7_LESSON.SEXUALITY_SKILLS`, oc: 'c', form: 'why', rung: 2, kind: 'life skills',
    gen: choose([
      C('A friend pushes you to do wrong. What do you do?', 'Say no firmly and walk away', 'Assertiveness and refusal skills help us say no.', ['Give in so as to stay in the group', 'M_SEX6_PRESSURE'], ['Give in only once', 'M_SEX6_PRESSURE'], ['Laugh and agree', 'M_SEX6_PRESSURE']),
      C('Which life skill helps you resist pressure?', 'Assertiveness, which means saying no clearly and politely', 'Assertiveness helps a person stand firm.', ['Aggression, which means shouting', 'M_SEX6_PRESSURE'], ['Silence, which means giving in', 'M_SEX6_PRESSURE'], ['Hiding', 'M_SEX6_PRESSURE']),
      C('Which value helps a young person make good choices?', 'Self-control', 'Self-control helps a person wait and choose well.', ['Following the group', 'M_SEX6_PRESSURE'], ['Taking gifts for favours', 'M_SEX6_GIFT'], ['Staying idle', 'M_SEX6_CAUSE']),
      C('A person offers you gifts for favours. What do you do?', 'Refuse and tell a trusted adult', 'A trusted adult can protect you.', ['Accept, since it is only a gift', 'M_SEX6_GIFT'], ['Take the gift in secret', 'M_SEX6_GIFT'], ['Ask for more', 'M_SEX6_GIFT']),
      C('Who can you talk to when you are unsure what to do?', 'A parent, teacher or other trusted adult', 'Trusted adults can guide us.', ['Nobody, keep it secret', 'M_SEX6_PRESSURE'], ['Only friends who pressure you', 'M_SEX6_PRESSURE'], ['A stranger', 'M_SEX6_GIFT']),
    ], H1('Say no firmly and tell a trusted adult.', 'Never accept gifts in return for favours.')) }),

  // ---------------------------------------------------------------- SANCTITY OF LIFE
  sfam({ id: 'cre6.life.teaching', cs: `${K}SANCTITY_OF_LIFE.SANCTITY_LIFE`, oc: 'c', form: 'direct', rung: 1, kind: 'what the Bible teaches',
    gen: choose([
      C('Where does life come from?', 'It is a gift from God', 'Life is a gift from God.', ['From ourselves alone', 'M_SAN6_OWN'], ['From luck', 'M_SAN6_OWN'], ['From the government', 'M_SAN6_OWN']),
      C('What does Exodus 20:13 say?', '"You shall not murder"', 'Exodus 20:13 forbids murder.', ['"You shall not eat"', 'M_SAN6_OWN'], ['"You shall always fight back"', 'M_SAN6_MOB'], ['"Take revenge on thieves"', 'M_SAN6_MOB']),
      C('What does Jesus teach about anger in Matthew 5:21-22?', 'Anger and hatred also harm and must be dealt with', 'Jesus taught that anger toward a brother is also serious.', ['Anger is harmless', 'M_SAN6_ANGER'], ['Only hitting matters', 'M_SAN6_ANGER'], ['Anger is good', 'M_SAN6_ANGER']),
      C('A crowd catches a thief and wants to beat him. What is right?', 'Hand him to the police, since life must be protected', 'Mob justice violates the right to life.', ['Join in, he deserves it', 'M_SAN6_MOB'], ['Beat him once', 'M_SAN6_MOB'], ['Shout and watch', 'M_SAN6_MOB']),
      C('Why must we protect life?', 'Every person is made by God and valued by him', 'Human life is valuable because it is God\'s gift.', ['A life is ours to do with as we please', 'M_SAN6_OWN'], ['Only strong lives matter', 'M_SAN6_OWN'], ['Only adults\' lives matter', 'M_SAN6_OWN']),
    ], H1('Life is God\'s gift; Exodus 20:13 forbids murder.', 'Jesus teaches that anger also harms.')) }),
  sfam({ id: 'cre6.life.practice', cs: `${K}SANCTITY_OF_LIFE.SANCTITY_LIFE`, oc: 'a', form: 'why', rung: 2, kind: 'practices, effects and virtues',
    gen: choose([
      C('Which practice violates the right to life?', 'Mob justice', 'Beating a person to death is taking life.', ['Visiting the sick', 'M_SAN6_MOB'], ['Planting a tree', 'M_SAN6_MOB'], ['Sharing food', 'M_SAN6_MOB']),
      C('Which is an effect of violence against life?', 'Grief, orphans and broken families', 'Violence leaves grief and loss.', ['Peace in the home and more love for each other', 'M_SAN6_OWN'], ['More friends and a happier life in the village', 'M_SAN6_OWN'], ['Better health and a longer life for the family', 'M_SAN6_OWN']),
      C('Which virtue helps young people protect life?', 'Forgiveness and patience', 'Forgiveness and patience stop anger from growing.', ['Revenge', 'M_SAN6_ANGER'], ['Hatred', 'M_SAN6_ANGER'], ['Jealousy', 'M_SAN6_ANGER']),
      C('Otieno is very angry with a classmate. Which is the safe way to cope?', 'Walk away, talk to someone and pray', 'Coping without harm protects life and friendship.', ['Hit him to teach him', 'M_SAN6_ANGER'], ['Plan revenge', 'M_SAN6_ANGER'], ['Hold on to hatred', 'M_SAN6_ANGER']),
      C('Which practice puts life at risk?', 'Driving after drinking alcohol', 'Drink-driving can kill.', ['Walking to school', 'M_SAN6_OWN'], ['Using a seat belt', 'M_SAN6_OWN'], ['Praying before travel', 'M_SAN6_OWN']),
    ], H1('Choose the answer that protects life and avoids revenge.', 'Forgiveness, patience, respect and self-control protect life.')) }),

  // ---------------------------------------------------------------- ALCOHOL AND DRUGS
  sfam({ id: 'cre6.drugs.verses', cs: `${K}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS_BIBLE`, oc: 'a', form: 'direct', rung: 1, kind: 'what the verse says',
    gen: choose([
      C('What does Ephesians 5:18 say?', 'Do not get drunk on wine, but be filled with the Spirit', 'Ephesians 5:18 warns against drunkenness and calls for being filled with the Spirit.', ['Drink wine with joy', 'M_DRU6_VERSE'], ['Wine is the best gift', 'M_DRU6_VERSE'], ['Drink in secret', 'M_DRU6_VERSE']),
      C('What does Hosea 4:11 say wine does?', 'Takes away understanding', 'Hosea 4:11 says wine takes away understanding.', ['Gives wisdom', 'M_DRU6_VERSE'], ['Gives strength', 'M_DRU6_VERSE'], ['Makes people holy', 'M_DRU6_VERSE']),
      C('Which is drug abuse?', 'Sniffing glue', 'Sniffing glue harms the body and mind.', ['Taking medicine as the doctor directs', 'M_DRU6_MEDICINE'], ['Taking a prescribed tablet from the clinic', 'M_DRU6_MEDICINE'], ['Drinking clean water', 'M_DRU6_MEDICINE']),
      C('Which substance is misused by young people?', 'Alcohol', 'Alcohol, bhang, miraa, cigarettes and glue are misused.', ['Clean water', 'M_DRU6_MEDICINE'], ['Maize', 'M_DRU6_MEDICINE'], ['Milk', 'M_DRU6_MEDICINE']),
      C('A girl takes tablets as her nurse directed. Is this drug abuse?', 'No, medicine taken as directed is not abuse', 'Medicine taken as a health worker directs is not abuse.', ['Yes, all medicine is abuse', 'M_DRU6_MEDICINE'], ['Yes, it is a sin', 'M_DRU6_MEDICINE'], ['Yes, because she is young', 'M_DRU6_MEDICINE']),
    ], H1('Read Ephesians 5:18 and Hosea 4:11.', 'Medicine taken as directed is not abuse.')) }),
  sfam({ id: 'cre6.drugs.dangers', cs: `${K}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS_BIBLE`, oc: 'd', form: 'why', rung: 2, kind: 'dangers',
    gen: choose([
      C('What is true of trying a harmful drug once?', 'It can start an addiction', 'Trying once can lead to addiction.', ['It is harmless', 'M_DRU6_TRY'], ['It makes you brave', 'M_DRU6_TRY'], ['It is a good test', 'M_DRU6_TRY']),
      C('Which is a danger of substance abuse?', 'Poor health, failing school and addiction', 'Substance abuse harms the body, school and life.', ['Better marks because the mind is sharper', 'M_DRU6_TRY'], ['More friends and a happier life in the village', 'M_DRU6_TRY'], ['Greater strength for sport and hard work', 'M_DRU6_TRY']),
      C('Baraka says, "One try will do no harm." What is the wise reply?', 'It can lead to addiction, so do not try', 'Even one try can start a habit.', ['You are right', 'M_DRU6_TRY'], ['Try it quietly', 'M_DRU6_TRY'], ['Only adults get addicted', 'M_DRU6_TRY']),
      C('Which value helps you avoid drugs?', 'Self-control and courage', 'These help a young person say no.', ['Following friends', 'M_DRU6_TRY'], ['Daring', 'M_DRU6_TRY'], ['Pride', 'M_DRU6_TRY']),
      C('Why do some young people start using alcohol or drugs?', 'Peer pressure, stress or copying others', 'These are common reasons. They are not good reasons.', ['Because it is healthy', 'M_DRU6_TRY'], ['Because God asks for it', 'M_DRU6_VERSE'], ['Because it makes them wise', 'M_DRU6_VERSE']),
    ], H1('Even one try can lead to addiction.', 'Self-control and courage help us say no.')) }),
  sfam({ id: 'cre6.prevent.agencies', cs: `${K}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS_PREVENT`, oc: 'b', form: 'direct', rung: 1, kind: 'who acts',
    gen: choose([
      C('Which authority runs campaigns against alcohol and drug abuse in Kenya?', 'NACADA', 'NACADA is the National Authority for the Campaign Against Alcohol and Drug Abuse.', ['The National Examinations Council', 'M_DRP6_AGENCY'], ['The Kenya Football Federation', 'M_DRP6_AGENCY'], ['The Kenya Bureau of Weather', 'M_DRP6_AGENCY']),
      C('What do the police and the courts do about drug trafficking?', 'Arrest traffickers and bring them to court under the law', 'The law controls drugs and punishes traffickers.', ['Ignore it because drugs are not their business', 'M_DRP6_AGENCY'], ['Help sell drugs to young people for money', 'M_DRP6_AGENCY'], ['Teach children to try them so they are not afraid', 'M_DRP6_AGENCY']),
      C('Which is a Christian way to prevent drug abuse?', 'Prayer, counselling and youth programmes', 'Churches offer care, guidance and activities.', ['Hiding the problem', 'M_DRP6_HIDE'], ['Rejecting those who struggle', 'M_DRP6_HIDE'], ['Spreading rumours', 'M_DRP6_HIDE']),
      C('A friend is addicted to drugs. What is the Christian response?', 'Support him and help him find a counsellor', 'Christians care for those who struggle.', ['Avoid him and tell no one about his problem at all', 'M_DRP6_HIDE'], ['Laugh at him when he is weak and cannot do things', 'M_DRP6_HIDE'], ['Join him so that he does not feel alone with it', 'M_DRP6_HIDE']),
      C('What do rehabilitation centres do?', 'Help people recover from addiction', 'They give treatment and support to those who struggle.', ['Sell drugs', 'M_DRP6_AGENCY'], ['Punish children', 'M_DRP6_AGENCY'], ['Keep addicts hidden for ever', 'M_DRP6_HIDE']),
    ], H1('NACADA, the police, the courts and the church all work against drug abuse.', 'Christians care for those who struggle.')) }),
  sfam({ id: 'cre6.prevent.sayno', cs: `${K}ALCOHOL_DRUGS_AND_SUBSTA.DRUGS_PREVENT`, oc: 'd', form: 'why', rung: 2, kind: 'say no',
    gen: choose([
      C('A friend offers you cigarettes. What do you do?', 'Refuse firmly, walk away and tell an adult', 'Saying no firmly takes courage.', ['Accept so as not to look weak', 'M_DRP6_SAYNO'], ['Accept once', 'M_DRP6_SAYNO'], ['Accept and hide them', 'M_DRP6_SAYNO']),
      C('Which life skill helps you say no to drugs?', 'Assertiveness', 'Assertiveness means saying no clearly and politely.', ['Giving in', 'M_DRP6_SAYNO'], ['Silence', 'M_DRP6_SAYNO'], ['Shouting', 'M_DRP6_SAYNO']),
      C('Older boys offer you alcohol at a party. What do you do?', 'Say no, leave and tell a trusted adult', 'Leaving and telling an adult keeps you safe.', ['Take a sip to fit in with the older boys at the party', 'M_DRP6_SAYNO'], ['Stay and watch what the others do at the party', 'M_DRP6_SAYNO'], ['Take some home to try later in secret', 'M_DRP6_SAYNO']),
      C('Which Christian value helps a young person avoid drugs?', 'Self-control', 'Self-control helps us refuse what harms.', ['Daring', 'M_DRP6_SAYNO'], ['Following the group', 'M_DRP6_SAYNO'], ['Secrecy', 'M_DRP6_HIDE']),
      C('A classmate keeps asking you to try glue. What do you do?', 'Keep saying no and tell a teacher', 'Keep refusing and tell an adult.', ['Try it once', 'M_DRP6_SAYNO'], ['Say nothing', 'M_DRP6_HIDE'], ['Join him to be kind', 'M_DRP6_SAYNO']),
    ], H1('Say no firmly, walk away and tell an adult.', 'Self-control and courage are values that help.')) }),
];
