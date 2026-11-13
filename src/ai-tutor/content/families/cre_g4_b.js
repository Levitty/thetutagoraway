// ============================================================================
// GRADE 4 CHRISTIAN RELIGIOUS EDUCATION, PART B: the life and teaching of Jesus (the annunciation, the birth of John the
// Baptist, Bartimaeus, the ten lepers, the widow's son, forgiveness, helping the needy, the lost coin, the mustard seed,
// Nicodemus). Bible facts asked are those stated in the passages the design names. No denominational claims. Every family
// stays reviewed:false until a CRE teacher signs it off (cre_g4_signed.js): none reaches a child.
// ============================================================================
import { C, w, F } from './cre_g4_lib.js';

const L = 'THE_LI.';
const an = w('M_C4_ANN_'), jb = w('M_C4_JB_'), ba = w('M_C4_BART_'), le = w('M_C4_LEP_'), wi = w('M_C4_WID_'), fo = w('M_C4_FOR_'), he = w('M_C4_HELP_'), co = w('M_C4_COIN_'), mu = w('M_C4_MUS_'), ni = w('M_C4_NIC_');

export const FAMILIES = [
  // ---------------------------------------------------------------- ANNUNCIATION
  F('annunciation.facts', `${L}THE_ANNUNCIATION.ANNUNCIATION`, 'direct', 1, 'story facts', ['Luke 1:26-37.', 'The angel Gabriel came to Mary at Nazareth.'], [
    C('To whom did the angel Gabriel bring the news that Jesus would be born?', 'Mary, who lived in Nazareth', 'Luke 1:26-31 says the angel came to Mary.', an('Zechariah, in the temple', 'ZECHARIAH'), an('Joseph, in Bethlehem', 'PLACE'), an('Elizabeth, who would name him John', 'NAME')),
    C('In which town was Mary when the angel came to her?', 'Nazareth in Galilee', 'Luke 1:26 says Nazareth, a town in Galilee.', an('Bethlehem', 'PLACE'), an('Jerusalem, in the temple', 'ZECHARIAH'), an('The hill country where Elizabeth lived', 'PLACE')),
    C('What name did the angel tell Mary to give her son?', 'Jesus', 'Luke 1:31 says, "You are to call him Jesus."', an('John', 'NAME'), an('Zechariah', 'ZECHARIAH'), an('Gabriel', 'NAME')),
    C('What did the angel say would come upon Mary?', 'The Holy Spirit', 'Luke 1:35 says the Holy Spirit would come upon her.', an('The name John', 'NAME'), an('A message to the priest Zechariah', 'ZECHARIAH'), an('A long journey to Bethlehem', 'PLACE')),
    C('Mary was engaged to a man called...', 'Joseph', 'Luke 1:27 says she was engaged to Joseph, a descendant of David.', an('Zechariah', 'ZECHARIAH'), an('John', 'NAME'), an('Gabriel', 'NAME')),
  ], 'a'),
  F('annunciation.unique', `${L}THE_ANNUNCIATION.ANNUNCIATION`, 'why', 2, 'why the birth is unique', ['Luke 1:37 tells us that nothing is impossible for God.', 'Mary\'s son would be the Son of the Most High.'], [
    C('What does Luke 1:37 teach us?', 'For God nothing is impossible', 'The angel said this when Mary asked how it could be.', an('Only the priest Zechariah believed God', 'ZECHARIAH'), an('God works only in Nazareth', 'PLACE'), an('The angel chose the baby\'s name himself', 'NAME')),
    C('Why is the birth of Jesus unique?', 'The Holy Spirit came upon Mary, and her son is the Son of God', 'Luke 1:35 says the holy one to be born will be called the Son of God.', an('He was born in the temple like John', 'ZECHARIAH'), an('He was named by the angel and not by God', 'NAME'), an('He was born in Nazareth and not in Bethlehem', 'PLACE')),
    C('Achieng says, "God cannot help me with this hard thing." Which verse can encourage her?', 'Luke 1:37, "For God nothing is impossible"', 'Mary trusted God\'s power and so can we.', an('The message to Zechariah in the temple', 'ZECHARIAH'), an('The name John in Luke 1:13', 'NAME'), an('The town of Nazareth', 'PLACE')),
    C('How did Mary respond to the angel\'s news at last?', 'She trusted God and said she was the Lord\'s servant', 'Luke 1:38 shows her trust.', an('She doubted, like Zechariah, and was silent', 'ZECHARIAH'), an('She asked the angel to change the name', 'NAME'), an('She went to Bethlehem at once', 'PLACE')),
    C('What can a Grade 4 child learn from Mary?', 'To trust God\'s power and lead a holy life', 'Mary trusted God.', an('To wait in the temple', 'ZECHARIAH'), an('To choose any name', 'NAME'), an('To go to Bethlehem alone', 'PLACE')),
  ], 'b'),

  // ---------------------------------------------------------------- JOHN_BIRTH
  F('johnbirth.facts', `${L}BIRTH_OF_JOHN_THE_BAPTIS.JOHN_BIRTH`, 'direct', 1, 'story facts', ['Luke 1:5-13, 57.', 'Zechariah the priest and Elizabeth.'], [
    C('Who were the parents of John the Baptist?', 'Zechariah and Elizabeth', 'Luke 1:5 names Zechariah the priest and Elizabeth.', jb('Mary and Joseph', 'MOTHER'), jb('Mary and Zechariah', 'MOTHER'), jb('Elizabeth and Joseph', 'MOTHER')),
    C('Where did the angel appear to Zechariah?', 'In the temple, beside the altar of incense', 'Luke 1:8-11 says it happened as Zechariah served in the temple.', jb('In Nazareth', 'MOTHER'), jb('On a road, as Zechariah was travelling', 'YOUNG_PARENTS'), jb('At Bethlehem', 'MOTHER')),
    C('What did the angel tell Zechariah to name his son?', 'John', 'Luke 1:13 says, "you are to call him John."', jb('Zechariah', 'MOTHER'), jb('Jesus', 'MESSIAH'), jb('Messiah', 'MESSIAH')),
    C('What was true about Zechariah and Elizabeth?', 'They had no child and were well along in years', 'Luke 1:7 says Elizabeth could not have children and they were both old.', jb('They were young and had many children', 'YOUNG_PARENTS'), jb('They were Mary\'s parents', 'MOTHER'), jb('They were the parents of Jesus', 'MOTHER')),
    C('What did the angel say to Zechariah when he was afraid?', '"Do not be afraid, your prayer has been heard"', 'Luke 1:13.', jb('"You are the Messiah"', 'MESSIAH'), jb('"You are too old to have a child"', 'YOUNG_PARENTS'), jb('"Go to Nazareth"', 'MOTHER')),
  ], 'a'),
  F('johnbirth.way', `${L}BIRTH_OF_JOHN_THE_BAPTIS.JOHN_BIRTH`, 'why', 2, 'how John prepared the way', ['Luke 1:76.', 'John was to go before the Lord and prepare his way.'], [
    C('What was John\'s work, according to Luke 1:76?', 'To prepare the way for Jesus', 'John prepared people to meet Jesus.', jb('To be the Messiah himself', 'MESSIAH'), jb('To be the son of Mary', 'MOTHER'), jb('To be a priest in old age', 'YOUNG_PARENTS')),
    C('Wafula says that John the Baptist was the Messiah. What should we tell him?', 'John prepared the way for Jesus', 'Luke 1:76 says John would go before the Lord.', jb('He is right', 'MESSIAH'), jb('John was the son of Mary', 'MOTHER'), jb('John was born to young parents', 'YOUNG_PARENTS')),
    C('How did John prepare people for Jesus, according to Luke 1:77?', 'By teaching forgiveness of sins', 'Luke 1:77 speaks of salvation through the forgiveness of sins.', jb('By becoming the Messiah', 'MESSIAH'), jb('By being Mary\'s child', 'MOTHER'), jb('By growing up with young parents', 'YOUNG_PARENTS')),
    C('Why was John\'s birth a surprise?', 'His parents were old and had no child', 'God did what seemed impossible.', jb('His parents were young', 'YOUNG_PARENTS'), jb('His mother was Mary', 'MOTHER'), jb('He was the Messiah', 'MESSIAH')),
    C('What can a child learn from John\'s birth?', 'God hears prayer and keeps his promises', 'The angel said, "your prayer has been heard."', jb('God only answers young parents', 'YOUNG_PARENTS'), jb('John is the Messiah', 'MESSIAH'), jb('Mary was John\'s mother', 'MOTHER')),
  ], 'b'),

  // ---------------------------------------------------------------- BARTIMAEUS
  F('bartimaeus.facts', `${L}HEALING_OF_BLIND_BARTIMA.BARTIMAEUS`, 'direct', 1, 'story facts', ['Mark 10:46-52.', 'He shouted louder when told to be quiet.'], [
    C('Where was Bartimaeus when Jesus passed by?', 'Sitting by the roadside, begging', 'Mark 10:46 says he sat by the roadside, begging.', ba('Inside his house', 'WENT_HOME'), ba('In the temple', 'QUIET'), ba('On a boat', 'TOUCH')),
    C('What did Bartimaeus do when many people told him to be quiet?', 'He shouted even louder', 'Mark 10:48 says he shouted all the more.', ba('He kept quiet', 'QUIET'), ba('He went home', 'WENT_HOME'), ba('He asked Jesus to touch him', 'TOUCH')),
    C('What did Bartimaeus say to Jesus?', '"Son of David, have mercy"', 'Mark 10:47.', ba('Nothing, he stayed quiet', 'QUIET'), ba('"Touch my eyes"', 'TOUCH'), ba('"Take me home"', 'WENT_HOME')),
    C('What did Jesus say to Bartimaeus?', '"Go, your faith has healed you"', 'Mark 10:52. Jesus did not touch his eyes.', ba('Nothing, he only touched his eyes', 'TOUCH'), ba('"Go home to your family"', 'WENT_HOME'), ba('"Be quiet"', 'QUIET')),
    C('What did Bartimaeus do after he could see?', 'He followed Jesus along the road', 'Mark 10:52.', ba('He went home', 'WENT_HOME'), ba('He kept quiet in the crowd', 'QUIET'), ba('He asked for a touch again', 'TOUCH')),
  ], 'a'),
  F('bartimaeus.faith', `${L}HEALING_OF_BLIND_BARTIMA.BARTIMAEUS`, 'why', 2, 'faith and Jesus\' power', ['Faith means trusting that Jesus could help.', 'He kept asking.'], [
    C('How did Bartimaeus show faith in Jesus?', 'He kept calling out to Jesus, believing he could heal him', 'He did not give up when told to be quiet.', ba('He stayed quiet', 'QUIET'), ba('He went home to wait', 'WENT_HOME'), ba('He waited for a touch', 'TOUCH')),
    C('What does the healing of Bartimaeus show about Jesus?', 'Jesus has power over sickness and disease', 'Jesus gave him his sight with a word.', ba('Jesus must touch every person to heal', 'TOUCH'), ba('Jesus helps only quiet people', 'QUIET'), ba('Jesus sends the healed home', 'WENT_HOME')),
    C('Achieng is unwell and the crowd says to wait quietly. What can Bartimaeus teach her?', 'Keep praying with faith, as he kept calling', 'He shouted all the more.', ba('Stay quiet and say nothing', 'QUIET'), ba('Go home and forget', 'WENT_HOME'), ba('Wait until someone touches her', 'TOUCH')),
    C('How did Bartimaeus thank Jesus?', 'He followed him', 'Mark 10:52 says he followed Jesus.', ba('He went home', 'WENT_HOME'), ba('He kept quiet', 'QUIET'), ba('He touched Jesus\' eyes', 'TOUCH')),
    C('When Jesus asked Bartimaeus what he wanted, what did he say?', '"I want to see"', 'Mark 10:51.', ba('"Be quiet, please"', 'QUIET'), ba('"Take me home"', 'WENT_HOME'), ba('"Touch my eyes"', 'TOUCH')),
  ], 'b'),

  // ---------------------------------------------------------------- LEPERS
  F('lepers.facts', `${L}HEALING_BY_THE_END_OF_TH.LEPERS`, 'direct', 1, 'story facts', ['Luke 17:11-19.', 'One of the ten came back.'], [
    C('How many of the ten lepers came back to thank Jesus?', 'One', 'Luke 17:15-17 says one came back. Jesus asked where the other nine were.', le('All ten', 'COUNT'), le('None', 'COUNT'), le('Nine', 'COUNT')),
    C('Who was the man who came back to thank Jesus?', 'A Samaritan', 'Luke 17:16.', le('A priest', 'WHO'), le('One of the disciples', 'WHO'), le('A Pharisee', 'WHO')),
    C('What did Jesus tell the ten men to do?', 'Show themselves to the priests', 'Luke 17:14. They were cleansed as they went.', le('Come back and thank him, all ten', 'COUNT'), le('Give thanks only when they needed help again', 'THANKS_NEED'), le('Find a Samaritan', 'WHO')),
    C('What did the returning man do when he saw he was healed?', 'He praised God loudly and thanked Jesus', 'Luke 17:15-16.', le('He kept silent and went on', 'COUNT'), le('He prayed only when in need', 'THANKS_NEED'), le('He became a priest', 'WHO')),
    C('What did Jesus ask about the others?', '"Where are the other nine?"', 'Luke 17:17.', le('"Where are all ten?"', 'COUNT'), le('"Where is the priest?"', 'WHO'), le('"Why do you ask for help?"', 'THANKS_NEED')),
  ], 'a'),
  F('lepers.gratitude', `${L}HEALING_BY_THE_END_OF_TH.LEPERS`, 'why', 2, 'showing gratitude to God', ['Gratitude is shown every day, not only when we need something.', 'Thank God and thank people who help you.'], [
    C('Which is a way of showing gratitude to God?', 'Thanking him in prayer and song every day', 'We thank God for family, food, health and life.', le('Praying only when we need something', 'THANKS_NEED'), le('Waiting for all ten to say thank you', 'COUNT'), le('Thanking only priests', 'WHO')),
    C('Mwende is thanking God for a good harvest. Which story does she follow?', 'The one man who came back to thank Jesus', 'He praised God and thanked Jesus.', le('The nine who went away', 'COUNT'), le('The priests, who asked for help', 'WHO'), le('Those who only pray when in need', 'THANKS_NEED')),
    C('When should we thank God?', 'Every day, not only when we need help', 'We are thankful for what God has already given.', le('Only when we need help', 'THANKS_NEED'), le('Only priests need to thank him', 'WHO'), le('Only one in ten should thank him', 'COUNT')),
    C('What can a child write in a "Thank you note" to God?', 'Thanks for life, family, food and friends', 'Gratitude names what we have received.', le('A list of what I still need', 'THANKS_NEED'), le('A note to one of the nine', 'COUNT'), le('A note to a priest', 'WHO')),
    C('Jesus said to the Samaritan, "Your faith has made you well." What is a lesson from this?', 'Gratitude and faith go together', 'The man who thanked Jesus showed faith.', le('Only those who ask when in need are healed', 'THANKS_NEED'), le('Only a priest can give thanks', 'WHO'), le('All ten gave thanks', 'COUNT')),
  ], 'b'),

  // ---------------------------------------------------------------- WIDOW_SON
  F('widow.facts', `${L}JESUS_RAISES_A_WIDOW_S_S.WIDOW_SON`, 'direct', 1, 'story facts', ['Luke 7:11-16.', 'The town was Nain.'], [
    C('Whom did Jesus raise to life at Nain?', 'The only son of a widow', 'Luke 7:12.', wi('The daughter of Jairus', 'JAIRUS'), wi('The widow\'s husband', 'HUSBAND'), wi('A man begged for by the crowd', 'ASKED')),
    C('Why did Jesus raise the widow\'s son?', 'He felt compassion for her', 'Luke 7:13.', wi('The crowd begged him to', 'ASKED'), wi('Jairus asked him to', 'JAIRUS'), wi('He was the widow\'s husband', 'HUSBAND')),
    C('What did Jesus say to the young man?', '"Young man, I say to you, get up!"', 'Luke 7:14.', wi('"Little girl, get up!"', 'JAIRUS'), wi('"Man, rise from the dead"', 'HUSBAND'), wi('"I will if you ask"', 'ASKED')),
    C('What happened when Jesus spoke?', 'The dead man sat up and began to talk', 'Luke 7:15.', wi('The girl got up and ate', 'JAIRUS'), wi('The husband woke up', 'HUSBAND'), wi('The crowd stopped and begged', 'ASKED')),
    C('How did the people react?', 'They praised God', 'Luke 7:16.', wi('They said Jairus had asked him', 'JAIRUS'), wi('They begged him to leave', 'ASKED'), wi('They said the husband had risen', 'HUSBAND')),
  ], 'a'),
  F('widow.lessons', `${L}JESUS_RAISES_A_WIDOW_S_S.WIDOW_SON`, 'why', 2, 'what it shows', ['John 11:25.', 'Jesus has power over life and death and cares for those who suffer.'], [
    C('What does the miracle at Nain show about Jesus?', 'He has power over death and cares for those who suffer', 'Jesus raised the dead man out of compassion.', wi('He heals only when begged', 'ASKED'), wi('He heals only children of Jairus', 'JAIRUS'), wi('He raised the husband of the widow', 'HUSBAND')),
    C('How did Jesus show compassion to the widow?', 'He told her not to cry and gave her son back', 'Luke 7:13-15.', wi('He waited until the crowd begged him', 'ASKED'), wi('He raised her daughter', 'JAIRUS'), wi('He gave back her husband', 'HUSBAND')),
    C('Which verse says, "I am the resurrection and the life"?', 'John 11:25', 'John 11:25 shows Jesus\' power over life and death.', wi('Luke 7:12, about the husband', 'HUSBAND'), wi('Luke 8:41, about Jairus', 'JAIRUS'), wi('Luke 7:16, about the crowd begging', 'ASKED')),
    C('Wanjiru sees a neighbour who has lost her only child. How can she follow Jesus?', 'Show kindness, comfort her and pray for her', 'Jesus showed compassion.', wi('Wait until the crowd begs her to help', 'ASKED'), wi('Do nothing, because it is not her child', 'JAIRUS'), wi('Say nothing about the husband', 'HUSBAND')),
    C('A child is facing a great trouble. What does this story teach?', 'Pray to God, who cares and has power', 'Jesus has power over life and death.', wi('Wait for the crowd to beg first', 'ASKED'), wi('Look for a story about Jairus only', 'JAIRUS'), wi('Believe that no one cares', 'HUSBAND')),
  ], 'b'),

  // ---------------------------------------------------------------- FORGIVE
  F('forgive.verse', `${L}FORGIVENESS.FORGIVE`, 'direct', 1, 'what the verse teaches', ['Matthew 5:39.', 'We do not pay back evil with evil.'], [
    C('What does Matthew 5:39 teach us?', 'Not to pay back evil with evil', 'Jesus teaches us to forgive and not to take revenge.', fo('Hit back so that they learn', 'REVENGE'), fo('Forgiving means weakness', 'WEAK'), fo('Pretend nothing happened', 'FORGET')),
    C('Someone hits you at school. Following Matthew 5:39, what do you do?', 'Do not hit back, walk away and tell a teacher', 'We do not take revenge, but we may tell a trusted adult.', fo('Hit back to teach him a lesson', 'REVENGE'), fo('Say nothing, because forgiving is weak', 'WEAK'), fo('Pretend it never happened', 'FORGET')),
    C('Why should we not pay back evil with evil?', 'It makes two wrongs and keeps the quarrel going', 'Forgiving brings peace.', fo('Because strong children hit back', 'REVENGE'), fo('Because forgiving is weak', 'WEAK'), fo('Because nothing really happened', 'FORGET')),
    C('Which is a good reason to forgive?', 'God forgives us and forgiving brings peace', 'Forgiveness restores friendship.', fo('So that I can take revenge later', 'REVENGE'), fo('So that people think I am weak', 'WEAK'), fo('So that I forget everything', 'FORGET')),
    C('What does it mean to forgive?', 'To let go of the wish to pay back', 'Forgiveness is a choice.', fo('To get even', 'REVENGE'), fo('To be weak', 'WEAK'), fo('To pretend it never happened', 'FORGET')),
  ], 'a'),
  F('forgive.apply', `${L}FORGIVENESS.FORGIVE`, 'why', 2, 'what to do when wronged', ['Forgive, make peace, and tell a trusted adult if the hurt continues.', 'Strong people forgive.'], [
    C('Kamau\'s friend broke his pen on purpose. What is the best response?', 'Tell him it hurt, forgive him and ask for peace', 'Forgiving brings peace.', fo('Break his friend\'s pen too', 'REVENGE'), fo('Say forgiving is weakness and stay angry', 'WEAK'), fo('Pretend the pen was never broken', 'FORGET')),
    C('Is forgiving a sign of weakness?', 'No, it takes strength', 'Forgiving is a brave choice.', fo('Yes, strong children hit back', 'WEAK'), fo('Yes, because revenge shows strength', 'REVENGE'), fo('Yes, as it means forgetting', 'FORGET')),
    C('A big boy keeps hurting Hassan. What should Hassan do?', 'Forgive him in his heart, and tell a teacher so that he is safe', 'Forgiving does not mean letting someone keep hurting you.', fo('Hit him back', 'REVENGE'), fo('Stay silent because forgiving means putting up with it', 'WEAK'), fo('Pretend nothing happens', 'FORGET')),
    C('Which choice shows that a child has forgiven?', 'He stops planning to pay back and is kind again', 'Forgiving changes our heart and our actions.', fo('He plans to pay back later', 'REVENGE'), fo('He is weak and quiet', 'WEAK'), fo('He acts as if nothing happened', 'FORGET')),
    C('Nekesa says "I forgive her" but still plans to hurt her. Is that forgiveness?', 'No, forgiving means letting go of revenge', 'Matthew 5:39.', fo('Yes, revenge is fair', 'REVENGE'), fo('Yes, it is only weakness', 'WEAK'), fo('Yes, if she forgets', 'FORGET')),
  ], 'b'),

  // ---------------------------------------------------------------- HELPING
  F('helping.verse', `${L}HELPING_THE_NEEDY.HELPING`, 'direct', 1, 'what the verse teaches', ['Matthew 5:42.', 'Give to the one who asks.'], [
    C('What does Matthew 5:42 teach?', 'Give to the one who asks you', 'We help those who ask.', he('Only rich people should help', 'RICH'), he('Help only with money', 'MONEY_ONLY'), he('Help so that others will praise you', 'PRAISE')),
    C('Which of these is a way of helping someone in need?', 'Sharing your lunch or a pencil', 'We can help with what we have.', he('Waiting until I am rich', 'RICH'), he('Giving only money', 'MONEY_ONLY'), he('Helping only when people are watching', 'PRAISE')),
    C('Who can help a person in need?', 'Anyone, even with a little', 'A child can share a pencil, lunch or time.', he('Only rich people', 'RICH'), he('Only people with money', 'MONEY_ONLY'), he('Only people who want praise', 'PRAISE')),
    C('Why should a Christian help the needy?', 'Out of love for God and for others', 'We help because we love.', he('So that people will praise me', 'PRAISE'), he('Because I am rich', 'RICH'), he('Because I have money to give', 'MONEY_ONLY')),
    C('Wafula has little money. His friend needs a pencil. What can Wafula do?', 'Share his own pencil', 'Helping does not need money.', he('Do nothing, because only rich people help', 'RICH'), he('Do nothing, because helping means money', 'MONEY_ONLY'), he('Share only if others will clap', 'PRAISE')),
  ], 'a'),
  F('helping.ways', `${L}HELPING_THE_NEEDY.HELPING`, 'why', 2, 'ways of helping', ['We help at home, at school and at church.', 'We give help without waiting for praise.'], [
    C('Achieng carries a neighbour\'s heavy basket. Is this helping?', 'Yes, helping can be work and not only money', 'Matthew 5:42.', he('No, helping is only giving money', 'MONEY_ONLY'), he('No, only rich people help', 'RICH'), he('Yes, but only if everyone watches', 'PRAISE')),
    C('Which is a good way of helping at church?', 'Sharing food with a child who has none', 'Helping can be done anywhere.', he('Giving only money and boasting about it', 'PRAISE'), he('Waiting until I am rich', 'RICH'), he('Saying money is the only help', 'MONEY_ONLY')),
    C('Mugambi shared his lunch and told everyone to praise him. What should he remember?', 'Help out of love, not for praise', 'A Christian helps because of love.', he('Praise is the reason to help', 'PRAISE'), he('Only rich children help', 'RICH'), he('Only money counts', 'MONEY_ONLY')),
    C('A classmate has no school bag. Which is the best help?', 'Share a spare bag or ask the teacher for help', 'We help with what is available.', he('Say only rich children can help', 'RICH'), he('Say only money helps', 'MONEY_ONLY'), he('Help only if people clap', 'PRAISE')),
    C('Which is the best answer to "How do you help those in need?"', 'By sharing and caring', 'We can help in many ways.', he('Only by waiting to be rich', 'RICH'), he('Only by giving money', 'MONEY_ONLY'), he('Only to be praised', 'PRAISE')),
  ], 'a'),

  // ---------------------------------------------------------------- COIN
  F('coin.facts', `${L}PARABLE_OF_THE_LOST_COIN.COIN`, 'direct', 1, 'story facts', ['Luke 15:8-10.', 'She had ten coins and lost one.'], [
    C('How many silver coins did the woman have at first?', 'Ten', 'Luke 15:8.', co('Nine', 'NINE'), co('Eleven', 'NINE'), co('One', 'NINE')),
    C('What did the woman do after she lost the coin?', 'She lit a lamp, swept the house and searched until she found it', 'Luke 15:8.', co('She gave up because she had nine more', 'GAVE_UP'), co('She counted her money again', 'MONEY_LESSON'), co('She asked her neighbours to find it for her', 'GAVE_UP')),
    C('What did she do when she found it?', 'She called her friends and neighbours to rejoice with her', 'Luke 15:9.', co('She kept it secret', 'GAVE_UP'), co('She put it with the nine', 'NINE'), co('She counted it again', 'MONEY_LESSON')),
    C('When did the woman stop looking for the coin?', 'When she found it', 'Luke 15:8 says she searched carefully until she found it.', co('Soon, because she had nine more', 'GAVE_UP'), co('When she had nine coins', 'NINE'), co('When she had saved more money', 'MONEY_LESSON')),
    C('Who rejoices when one sinner repents, according to Luke 15:10?', 'The angels of God', 'Luke 15:10.', co('Nobody, it is only a coin', 'MONEY_LESSON'), co('The nine other coins', 'NINE'), co('The woman who gave up', 'GAVE_UP')),
  ], 'a'),
  F('coin.lesson', `${L}PARABLE_OF_THE_LOST_COIN.COIN`, 'why', 2, 'the lesson', ['The coin stands for a person God loves.', 'God searches for the lost and rejoices when they return.'], [
    C('What does the parable of the lost coin teach?', 'God searches for sinners and rejoices', 'Jesus told it to show God\'s love.', co('We should count our money carefully', 'MONEY_LESSON'), co('We should give up on small things', 'GAVE_UP'), co('Nine is enough', 'NINE')),
    C('What does the lost coin stand for?', 'A person who is lost in sin', 'God values each person.', co('Money we should save', 'MONEY_LESSON'), co('A small thing to forget', 'GAVE_UP'), co('The nine remaining coins', 'NINE')),
    C('How should a Christian live because God loves the sinner?', 'Live a righteous life and turn from sin', 'God\'s love calls us to an upright life.', co('Count money and save', 'MONEY_LESSON'), co('Give up when things are hard', 'GAVE_UP'), co('Be content with nine', 'NINE')),
    C('Otieno has wandered off from the right way. Which part of the parable comforts him?', 'God searches for the lost, as the woman did', 'God does not give up.', co('The woman gave up quickly', 'GAVE_UP'), co('The woman kept her money safe', 'MONEY_LESSON'), co('The nine coins were enough', 'NINE')),
    C('Why did the woman call her friends?', 'She was full of joy', 'There is joy when the lost is found.', co('She wanted to show off her money', 'MONEY_LESSON'), co('She gave up and needed help', 'GAVE_UP'), co('She had nine coins', 'NINE')),
  ], 'b'),

  // ---------------------------------------------------------------- MUSTARD
  F('mustard.facts', `${L}PARABLE_OF_THE_MUSTARD_S.MUSTARD`, 'direct', 1, 'story facts', ['Luke 13:18-19.', 'A small seed grows into a tree.'], [
    C('What did the man do with the mustard seed?', 'He planted it in his garden', 'Luke 13:19.', mu('He ate it', 'BIRDS'), mu('He gave it to the birds', 'BIRDS'), mu('He planted it in a big, mighty field', 'BIG_START')),
    C('What did the mustard seed become?', 'A tree', 'Luke 13:19.', mu('A bird', 'BIRDS'), mu('A big tree from the start', 'BIG_START'), mu('Food for adults only', 'ADULTS_ONLY')),
    C('What did the birds do in the tree?', 'They perched in its branches', 'Luke 13:19.', mu('They ate the seed', 'BIRDS'), mu('They made the tree grow', 'ADULTS_ONLY'), mu('They flew away', 'BIRDS')),
    C('Jesus compared the kingdom of God to...', 'A mustard seed', 'Luke 13:18-19.', mu('A big tree from the start', 'BIG_START'), mu('A bird', 'BIRDS'), mu('A pastor', 'ADULTS_ONLY')),
    C('How does God\'s kingdom begin, in the parable?', 'Small, like a seed, and then it grows', 'Luke 13:19.', mu('Big and powerful at once', 'BIG_START'), mu('With adults only', 'ADULTS_ONLY'), mu('With birds', 'BIRDS')),
  ], 'a'),
  F('mustard.grow', `${L}PARABLE_OF_THE_MUSTARD_S.MUSTARD`, 'why', 2, 'how the kingdom grows', ['A child can help the kingdom grow.', 'Pray, live well and tell others.'], [
    C('Who can help God\'s kingdom grow?', 'Every Christian, including children', 'A seed grows when it is cared for.', mu('Only pastors and adults', 'ADULTS_ONLY'), mu('Only the birds', 'BIRDS'), mu('Only those who start big', 'BIG_START')),
    C('Which is a way a child helps God\'s kingdom grow?', 'Praying and being kind', 'These help others come to know Jesus.', mu('Waiting until I am an adult', 'ADULTS_ONLY'), mu('Waiting for a big start', 'BIG_START'), mu('Feeding the birds', 'BIRDS')),
    C('Amina thinks she is too small to help God\'s kingdom. What do we say?', 'It starts small and she can help', 'Small things grow.', mu('She is right, only adults help', 'ADULTS_ONLY'), mu('She must start big', 'BIG_START'), mu('She should feed the birds', 'BIRDS')),
    C('What do the birds in the branches stand for?', 'People finding a place in God\'s kingdom', 'The tree gives shelter to many.', mu('Birds that eat seeds', 'BIRDS'), mu('Adults only', 'ADULTS_ONLY'), mu('A big start', 'BIG_START')),
    C('Why do we plant a seed and watch it grow in this lesson?', 'To see a small seed grow large', 'It helps us picture the parable.', mu('To show that adults are needed', 'ADULTS_ONLY'), mu('To feed the birds', 'BIRDS'), mu('To make a big start at once', 'BIG_START')),
  ], 'c'),

  // ---------------------------------------------------------------- NICODEMUS
  F('nicodemus.facts', `${L}NICODEMUS_ENCOUNTER_WITH.NICODEMUS`, 'direct', 1, 'story facts', ['John 3:1-5.', 'He came at night.'], [
    C('When did Nicodemus come to Jesus?', 'At night', 'John 3:2.', ni('In the daytime in front of everyone', 'DAY'), ni('At noon', 'DAY'), ni('After the crowd left', 'DAY')),
    C('What kind of man was Nicodemus?', 'A Pharisee and a member of the ruling council', 'John 3:1.', ni('A fisherman', 'FEW'), ni('A Roman soldier', 'FEW'), ni('A child', 'LITERAL')),
    C('What did Jesus tell Nicodemus about the kingdom of God?', 'No one can see it unless he is born again', 'John 3:3.', ni('No one can see it unless he is born from his mother again', 'LITERAL'), ni('Only the Jews can see it', 'FEW'), ni('Come by day to see it', 'DAY')),
    C('What did Nicodemus first think "born again" meant?', 'Being born a second time from his mother', 'John 3:4.', ni('A new life from God', 'LITERAL'), ni('Only for the Jews', 'FEW'), ni('Coming by night', 'DAY')),
    C('What did Jesus say about being born of water and the Spirit?', 'It is a new life from God', 'John 3:5.', ni('It is a second birth from the mother', 'LITERAL'), ni('It is only for the Pharisees', 'FEW'), ni('It happens only at night', 'DAY')),
  ], 'a'),
  F('nicodemus.john316', `${L}NICODEMUS_ENCOUNTER_WITH.NICODEMUS`, 'why', 2, 'John 3:16', ['John 3:16.', 'God loves the whole world.'], [
    C('What does John 3:16 say about God\'s love?', 'God loved the world so much that he gave his only Son', 'Whoever believes has eternal life.', ni('God loved only the Jews', 'FEW'), ni('God loves those who come at night', 'DAY'), ni('God loves those born a second time from a mother', 'LITERAL')),
    C('Who will have eternal life, according to John 3:16?', 'Whoever believes in Jesus', 'The offer is for everyone.', ni('Only the Pharisees', 'FEW'), ni('Only those who visit at night', 'DAY'), ni('Only those born twice from a mother', 'LITERAL')),
    C('How can a child respond to John 3:16?', 'Believe in Jesus and turn from sin', 'Repentance draws us close to Christ.', ni('Wait until night', 'DAY'), ni('Wait for a second birth', 'LITERAL'), ni('Say it is only for some people', 'FEW')),
    C('Why did Nicodemus meet Jesus?', 'He wanted to learn from him', 'He called Jesus a teacher from God.', ni('To see him in front of everyone', 'DAY'), ni('To be born from his mother again', 'LITERAL'), ni('To tell him that only the Jews are loved', 'FEW')),
    C('Whom does God love, according to John 3:16?', 'The whole world', 'John 3:16.', ni('Only the Jews', 'FEW'), ni('Only those who come at night', 'DAY'), ni('Only the once-born', 'LITERAL')),
  ], 'd'),
];
