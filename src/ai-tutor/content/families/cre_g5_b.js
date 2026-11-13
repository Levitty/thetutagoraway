// ============================================================================
// GRADE 5 CHRISTIAN RELIGIOUS EDUCATION, PART B: The Life of Jesus Christ
// (John the Baptist, the baptism of Jesus, calming the storm, the feeding of the four thousand, the paralysed man,
// the lost sheep, the Sermon on the Mount, the rich young man, the friend at midnight). Facts asked are those stated in
// the passage the KICD design names. Written offline. Every family stays reviewed:false (cre_g5_signed.js): none reaches a child.
// ============================================================================
import { sfam, choose, C } from './cre_g5_lib.js';

const L = 'THE_LI.';
const H1 = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- JOHN_BAPTIST
  sfam({ id: 'cre5.john.teaching', cs: `${L}JOHN_THE_BAPTIST.JOHN_BAPTIST`, oc: 'a', form: 'direct', rung: 1, kind: 'what John taught',
    gen: choose([
      C('What did John the Baptist tell the tax collectors?', 'Collect no more than you are ordered to', 'Luke 3:13 shows John teaching honesty in work.', ['Collect more so you can be rich', 'M_JB_TAX'], ['Stop collecting taxes forever', 'M_JB_TAX'], ['Give all the money to John for his work', 'M_JB_TAX']),
      C('What did John say to people who had two coats?', 'Share one with the person who has none', 'Luke 3:11 teaches sharing with those in need.', ['Keep both coats safe', 'M_JB_SHARE'], ['Sell them to John to get a good price', 'M_JB_SHARE'], ['Hide them from the poor', 'M_JB_SHARE']),
      C('What did John call people to do in Luke 3:3?', 'Repent and be baptised', 'Luke 3:3 says John preached a baptism of repentance.', ['Build a temple', 'M_JB_REPENT_SORRY'], ['Pay him money', 'M_JB_TAX'], ['Fight the soldiers', 'M_JB_TAX']),
      C('What does repentance mean?', 'Turning away from wrong and living a changed life', 'Repentance shows in changed actions, "fruits" (Luke 3:8).', ['Only saying sorry in words', 'M_JB_REPENT_SORRY'], ['Being baptised once and then forgetting about it', 'M_JB_REPENT_SORRY'], ['Feeling afraid', 'M_JB_REPENT_SORRY']),
      C('What did John tell the soldiers?', 'Do not take money by force, and be content with your pay', 'Luke 3:14 teaches honesty and contentment.', ['Take more from the crowd', 'M_JB_TAX'], ['Never be soldiers again and go back to their farms', 'M_JB_TAX'], ['Fight each other and take what you want', 'M_JB_TAX']),
    ], H1('Reread Luke 3:3-14.', 'John taught honesty and sharing.')) }),
  sfam({ id: 'cre5.john.lessons', cs: `${L}JOHN_THE_BAPTIST.JOHN_BAPTIST`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Which lesson do we learn from the teachings of John the Baptist?', 'Repent, share and be honest', 'John taught that faith shows in how we live.', ['Be rich at any cost', 'M_JB_TAX'], ['Keep everything to ourselves', 'M_JB_SHARE'], ['Say sorry and do not change', 'M_JB_REPENT_SORRY']),
      C('Njoroge says "sorry" for hitting a friend and then hits him again the next day. What does John\'s teaching say?', 'Real repentance changes our actions', 'John said to bear fruits that fit repentance.', ['Saying sorry is enough', 'M_JB_REPENT_SORRY'], ['He should keep fighting and not say sorry', 'M_JB_REPENT_SORRY'], ['He should hide it', 'M_JB_REPENT_SORRY']),
      C('Chebet has two pairs of shoes, and a classmate has none. Which advice of John fits?', 'Share one pair with the classmate', 'Luke 3:11 teaches sharing.', ['Keep both pairs', 'M_JB_SHARE'], ['Sell one to the classmate', 'M_JB_SHARE'], ['Hide them and say that you have none', 'M_JB_SHARE']),
      C('A shopkeeper charges more than the real price. Which teaching of John does he forget?', 'Be honest and do not take more than is right', 'John told the tax collectors to take no more than was due.', ['Take as much as you can', 'M_JB_TAX'], ['Share your shop', 'M_JB_SHARE'], ['Stop selling and close the shop for ever', 'M_JB_TAX']),
      C('Which value did John teach the soldiers?', 'Contentment with their pay', 'Luke 3:14 says to be content with your wages.', ['Greed for more money than the pay they receive', 'M_JB_TAX'], ['Pride', 'M_JB_TAX'], ['Revenge', 'M_JB_TAX']),
    ], H1('John taught that faith shows in how we live.', 'Think of honesty, sharing and contentment.')) }),

  // ---------------------------------------------------------------- BAPTISM_JESUS
  sfam({ id: 'cre5.baptism.events', cs: `${L}THE_BAPTISM_OF_JESUS_CHR.BAPTISM_JESUS`, oc: 'a', form: 'direct', rung: 1, kind: 'events',
    gen: choose([
      C('What came down on Jesus at his baptism?', 'The Holy Spirit, like a dove', 'Luke 3:22 says the Holy Spirit came down in bodily form like a dove.', ['An ordinary dove from the river', 'M_BJ_SIGN'], ['A bright fire', 'M_BJ_SIGN'], ['A white cloud', 'M_BJ_SIGN']),
      C('What did the voice from heaven say?', '"You are my beloved Son; with you I am well pleased"', 'Luke 3:22 gives the words.', ['"You must repent and be baptised again today"', 'M_BJ_VOICE'], ['"Follow John and listen to his words"', 'M_BJ_VOICE'], ['"Go to Jerusalem"', 'M_BJ_VOICE']),
      C('What was Jesus doing when heaven opened?', 'Praying', 'Luke 3:21 says that Jesus was praying.', ['Preaching to the crowd', 'M_BJ_VOICE'], ['Walking on water', 'M_BJ_SIGN'], ['Teaching in the temple', 'M_BJ_VOICE']),
      C('What happened to heaven when Jesus was baptised?', 'It opened', 'Luke 3:21 says that heaven was opened.', ['It stayed closed', 'M_BJ_SIGN'], ['It became dark', 'M_BJ_SIGN'], ['It shook', 'M_BJ_SIGN']),
      C('Why was Jesus baptised?', 'To obey God and stand with the people he came to save', 'Jesus had no sin to confess. He showed humility and obedience.', ['Because he had sins to confess before the people', 'M_BJ_SINNED'], ['Because the people forced him', 'M_BJ_SINNED'], ['Because John was his teacher', 'M_BJ_SINNED']),
    ], H1('Reread Luke 3:21-22.', 'Think about heaven, the Spirit and the voice.')) }),
  sfam({ id: 'cre5.baptism.meaning', cs: `${L}THE_BAPTISM_OF_JESUS_CHR.BAPTISM_JESUS`, oc: 'b', form: 'why', rung: 2, kind: 'what baptism shows',
    gen: choose([
      C('In the Bible, what does baptism show?', 'A new life and belonging to God, and turning away from wrong', 'Baptism is a sign of repentance and new life.', ['That a person has no sins left to confess', 'M_BJ_SINNED'], ['That a person is better than other people in the church', 'M_BJ_SINNED'], ['That a person is rich and has a high place', 'M_BJ_SINNED']),
      C('What did the voice at the baptism tell about Jesus?', 'That God was pleased with his Son', 'The voice said, "with you I am well pleased".', ['That he must repent', 'M_BJ_VOICE'], ['That he was a prophet only and not God\'s Son', 'M_BJ_VOICE'], ['That he had sinned', 'M_BJ_SINNED']),
      C('Which quality did Jesus show by being baptised?', 'Humility and obedience to God', 'He stood with the people he came to save.', ['Pride in his own power and position', 'M_BJ_SINNED'], ['Fear', 'M_BJ_SINNED'], ['Greed', 'M_BJ_SINNED']),
      C('Which sentence is true about the baptism of Jesus?', 'The Holy Spirit came down like a dove', 'The dove was a sign of the Spirit.', ['A real dove was caught from the river bank', 'M_BJ_SIGN'], ['Only John heard the voice', 'M_BJ_VOICE'], ['Jesus confessed his sins', 'M_BJ_SINNED']),
      C('How can a Christian follow Jesus\' example at his baptism?', 'By living humbly and obeying God', 'Jesus gave an example of humility.', ['By boasting about faith', 'M_BJ_SINNED'], ['By ignoring God and living as one likes', 'M_BJ_SINNED'], ['By hiding faith', 'M_BJ_SINNED']),
    ], H1('Baptism is a sign of new life and belonging to God.', 'Jesus gave an example of humility.')) }),

  // ---------------------------------------------------------------- CALMING_STORM
  sfam({ id: 'cre5.storm.facts', cs: `${L}CALMING_THE_STORM.CALMING_STORM`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What was Jesus doing when the storm came?', 'Sleeping on a cushion at the back of the boat', 'Mark 4:38 says he was asleep on the cushion.', ['Steering the boat while the disciples rested', 'M_CS_AWAKE'], ['Praying on the shore', 'M_CS_AWAKE'], ['Fishing with a net', 'M_CS_AWAKE']),
      C('What did the disciples ask Jesus?', '"Teacher, do you not care that we are perishing?"', 'They woke Jesus because they were afraid.', ['"Where is the shore, and how far must we row?"', 'M_CS_DISCIPLES_CALMED'], ['"Can you teach us to row?"', 'M_CS_DISCIPLES_CALMED'], ['"Is it morning yet?"', 'M_CS_AWAKE']),
      C('Who calmed the storm?', 'Jesus, by speaking to the wind and the waves', 'Mark 4:39 says Jesus rebuked the wind and said, "Peace! Be still!"', ['The disciples, by rowing hard', 'M_CS_DISCIPLES_CALMED'], ['The wind, by itself, when it got tired', 'M_CS_DISCIPLES_CALMED'], ['The other boats', 'M_CS_DISCIPLES_CALMED']),
      C('What happened after Jesus spoke to the wind and the waves?', 'There was a great calm', 'Mark 4:39 says there was a great calm.', ['The storm grew stronger', 'M_CS_DISCIPLES_CALMED'], ['The boat sank', 'M_CS_DISCIPLES_CALMED'], ['It started to rain', 'M_CS_DISCIPLES_CALMED']),
      C('What did Jesus ask the disciples after the storm?', '"Why are you afraid? Do you still have no faith?"', 'Mark 4:40 shows Jesus calling them to trust him.', ['"Who is steering the boat to the shore?"', 'M_CS_AWAKE'], ['"Where is the fish that we are to catch?"', 'M_CS_AWAKE'], ['"Can we go home?"', 'M_CS_AWAKE']),
    ], H1('Reread Mark 4:35-39.', 'Jesus was asleep and then calmed the storm.')) }),
  sfam({ id: 'cre5.storm.lessons', cs: `${L}CALMING_THE_STORM.CALMING_STORM`, oc: 'b', form: 'why', rung: 2, kind: 'lessons and challenges',
    gen: choose([
      C('Which lesson do we learn from the calming of the storm?', 'Jesus has power over nature and is with us in trouble', 'The disciples were afraid, but Jesus was in the boat.', ['Christians never meet trouble when they have faith in him', 'M_CS_NO_TROUBLE'], ['The disciples calmed the storm', 'M_CS_DISCIPLES_CALMED'], ['Jesus does not care what happens in the boat', 'M_CS_AWAKE']),
      C('Amani is afraid before an important exam. Which lesson from the storm helps him?', 'Trust in God and pray when afraid', 'The disciples called on Jesus in their fear.', ['Never be afraid again for the rest of your life', 'M_CS_NO_TROUBLE'], ['Stay away from school', 'M_CS_NO_TROUBLE'], ['Do the exam alone', 'M_CS_NO_TROUBLE']),
      C('Which sentence is true about Christians and challenges?', 'Christians also meet challenges and can depend on God', 'The disciples were in the storm with Jesus.', ['Christians never meet any challenge', 'M_CS_NO_TROUBLE'], ['Faith removes all trouble from a Christian at once', 'M_CS_NO_TROUBLE'], ['God does not help in storms', 'M_CS_AWAKE']),
      C('What did the miracle show the disciples about Jesus?', 'That even the wind and sea obey him', 'The disciples were amazed.', ['That he was tired and needed to sleep', 'M_CS_AWAKE'], ['That he was weak', 'M_CS_AWAKE'], ['That he could not help', 'M_CS_AWAKE']),
      C('Which is a challenge Christians face today?', 'Sickness, fear and loss', 'God can help us in challenges.', ['Having too much peace', 'M_CS_NO_TROUBLE'], ['Having no worries', 'M_CS_NO_TROUBLE'], ['Having too many friends', 'M_CS_NO_TROUBLE']),
    ], H1('Jesus is with us in trouble.', 'Faith does not mean no storms but trust in the storm.')) }),

  // ---------------------------------------------------------------- FEEDING_4000
  sfam({ id: 'cre5.feeding.facts', cs: `${L}FEEDING_THE_FOUR_THOUSAN.FEEDING_4000`, oc: 'b', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How many loaves did Jesus have when he fed the four thousand?', 'Seven loaves', 'Matthew 15:34 says seven loaves and a few small fish.', ['Five loaves', 'M_F4_FIVE_THOUSAND'], ['Twelve loaves', 'M_F4_FIVE_THOUSAND'], ['Two loaves', 'M_F4_FIVE_THOUSAND']),
      C('How many baskets of food were left over?', 'Seven baskets', 'Matthew 15:37 says seven baskets were left.', ['Twelve baskets', 'M_F4_FIVE_THOUSAND'], ['Five baskets', 'M_F4_FIVE_THOUSAND'], ['One basket', 'M_F4_FIVE_THOUSAND']),
      C('Why did Jesus feed the crowd?', 'He had compassion because they had nothing to eat', 'Matthew 15:32 shows his compassion.', ['To impress the people and make them praise him', 'M_F4_WHY'], ['To make the crowd follow him wherever he went', 'M_F4_WHY'], ['To test the disciples only', 'M_F4_WHY']),
      C('For how long had the crowd been with Jesus?', 'Three days', 'Matthew 15:32 says they had been with him three days.', ['One hour', 'M_F4_WHY'], ['Seven days', 'M_F4_WHY'], ['One night', 'M_F4_WHY']),
      C('Which miracle used five loaves and two fish?', 'The feeding of the five thousand', 'The feeding of the four thousand used seven loaves.', ['The feeding of the four thousand', 'M_F4_FIVE_THOUSAND'], ['The calming of the storm', 'M_F4_FIVE_THOUSAND'], ['The healing of the paralysed man', 'M_F4_FIVE_THOUSAND']),
    ], H1('Reread Matthew 15:32-38.', 'Seven loaves and seven baskets in this story.')) }),
  sfam({ id: 'cre5.feeding.help', cs: `${L}FEEDING_THE_FOUR_THOUSAN.FEEDING_4000`, oc: 'a', form: 'word', rung: 2, kind: 'ways of helping the needy',
    gen: choose([
      C('Which is a way of helping the needy?', 'Sharing food, clothes or school items', 'We can help in many ways, not only by money.', ['Giving only money and nothing else', 'M_F4_NEEDY_MONEY'], ['Ignoring them', 'M_F4_NEEDY_MONEY'], ['Selling them things', 'M_F4_NEEDY_MONEY']),
      C('A classmate comes to school without lunch. What can Mutua do?', 'Share part of his lunch', 'Sharing food follows Jesus\' compassion.', ['Eat in secret', 'M_F4_WHY'], ['Laugh at him', 'M_F4_WHY'], ['Tell him to go home', 'M_F4_WHY']),
      C('Which action shows the value of love for the needy?', 'Visiting a sick neighbour and sharing food', 'Love acts to meet needs.', ['Only praying and doing nothing else', 'M_F4_NEEDY_MONEY'], ['Giving money only for show', 'M_F4_NEEDY_MONEY'], ['Avoiding them', 'M_F4_NEEDY_MONEY']),
      C('What can a Grade 5 child give besides money to help the needy?', 'Time, clothes and kind words', 'Helping is more than giving money.', ['Nothing, because children cannot help', 'M_F4_NEEDY_MONEY'], ['Only toys for show', 'M_F4_NEEDY_MONEY'], ['Only loud prayers', 'M_F4_NEEDY_MONEY']),
      C('Which lesson do we learn from the feeding of the four thousand?', 'Jesus cares for the hungry, and we should care too', 'Jesus had compassion on the crowd.', ['Jesus wanted to show off in front of the crowd', 'M_F4_WHY'], ['We should keep our food', 'M_F4_NEEDY_MONEY'], ['The crowd was five thousand and not four thousand', 'M_F4_FIVE_THOUSAND']),
    ], H1('Jesus felt compassion for the hungry.', 'We can help in many ways.')) }),

  // ---------------------------------------------------------------- PARALYSED_MAN
  sfam({ id: 'cre5.paralysed.facts', cs: `${L}HEALING_THE_PARALYSED_MA.PARALYSED_MAN`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How did the friends get the paralysed man to Jesus?', 'They made an opening in the roof and let him down', 'The crowd blocked the door (Mark 2:4).', ['Through the front door', 'M_PM_DOOR'], ['Through a window at the back of the house', 'M_PM_DOOR'], ['By waiting outside until the crowd had gone home', 'M_PM_DOOR']),
      C('What did Jesus first say to the paralysed man?', '"Son, your sins are forgiven"', 'Mark 2:5 gives these first words.', ['"Rise, take up your mat"', 'M_PM_HEALED_FIRST'], ['"Go home at once and tell no one about this"', 'M_PM_HEALED_FIRST'], ['"Who brought you here, and why did you come?"', 'M_PM_HEALED_FIRST']),
      C('How many men carried the paralysed man?', 'Four', 'Mark 2:3 says four men carried him.', ['Two', 'M_PM_ALONE'], ['Six', 'M_PM_ALONE'], ['Ten', 'M_PM_ALONE']),
      C('Whose faith did Jesus see?', 'The faith of the man and of his friends', 'Mark 2:5 says, "When Jesus saw their faith".', ['Only the man\'s faith, because he was alone', 'M_PM_ALONE'], ['Only the crowd\'s faith', 'M_PM_ALONE'], ['Only the faith of the disciples who were with Jesus', 'M_PM_ALONE']),
      C('Why could the friends not go through the door?', 'The crowd was so large that there was no room', 'Mark 2:2 says there was no room even at the door.', ['The door was locked and no one could open it', 'M_PM_DOOR'], ['It was night', 'M_PM_DOOR'], ['The house had no door at all', 'M_PM_DOOR']),
    ], H1('Reread Mark 2:1-5.', 'The friends were determined to reach Jesus.')) }),
  sfam({ id: 'cre5.paralysed.lessons', cs: `${L}HEALING_THE_PARALYSED_MA.PARALYSED_MAN`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Which lesson do we learn from the story of the paralysed man?', 'Good friends bring others to Jesus, and we should pray when in need', 'The friends did all they could.', ['Friends should leave us alone when we are in trouble or ill', 'M_PM_ALONE'], ['Only the sick should believe in Jesus and pray', 'M_PM_ALONE'], ['Healing comes before forgiveness always', 'M_PM_HEALED_FIRST']),
      C('Wanjiru\'s friend is sad because her grandmother is ill. Which lesson from the story fits?', 'Help her friend and pray with her', 'The friends carried the man to Jesus.', ['Leave her alone', 'M_PM_ALONE'], ['Tell her not to pray and to stay at home instead', 'M_PM_ALONE'], ['Ignore it and hope that it goes away by itself', 'M_PM_ALONE']),
      C('What does the story show about faith?', 'Faith shows itself in action', 'The friends acted on their faith.', ['Faith is only a feeling', 'M_PM_ALONE'], ['Faith needs no action', 'M_PM_ALONE'], ['Faith is for the sick only', 'M_PM_ALONE']),
      C('Which statement is true?', 'Jesus said the man\'s sins were forgiven before he healed him', 'Mark 2:5 comes before the healing.', ['Jesus healed him first and then forgave his sins when the crowd left', 'M_PM_HEALED_FIRST'], ['The man walked into the house alone and sat down', 'M_PM_ALONE'], ['The friends used the door', 'M_PM_DOOR']),
      C('What is a good thing to do when faced with illness or trouble?', 'Pray to God and ask friends to help', 'The man was helped by his friends and by Jesus.', ['Hide it from everyone', 'M_PM_ALONE'], ['Wait without praying until the trouble ends', 'M_PM_ALONE'], ['Blame others for the trouble and get angry', 'M_PM_ALONE']),
    ], H1('The friends helped the man to reach Jesus.', 'Prayer and friends help in trouble.')) }),

  // ---------------------------------------------------------------- LOST_SHEEP
  sfam({ id: 'cre5.sheep.facts', cs: `${L}PARABLE_OF_THE_LOST_SHEE.LOST_SHEEP`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How many sheep did the shepherd have in the parable?', 'One hundred', 'Luke 15:4 says he had a hundred sheep.', ['Ninety-nine', 'M_LS_NINETY_NINE'], ['Ten', 'M_LS_NINETY_NINE'], ['One thousand', 'M_LS_NINETY_NINE']),
      C('What did the shepherd do when one sheep was lost?', 'He left the ninety-nine and went to look for it', 'Each sheep matters to the shepherd.', ['He said one sheep was not worth looking for', 'M_LS_NINETY_NINE'], ['He sold the others', 'M_LS_NINETY_NINE'], ['He waited at home', 'M_LS_NINETY_NINE']),
      C('How did the shepherd bring the sheep home?', 'On his shoulders, rejoicing', 'Luke 15:5 says he lifted it onto his shoulders.', ['By beating it', 'M_LS_PUNISH'], ['By leaving it behind in the field to find its own way', 'M_LS_PUNISH'], ['By tying its legs and dragging it home', 'M_LS_PUNISH']),
      C('What did the shepherd do when he got home?', 'He called his friends to rejoice with him', 'Luke 15:6 says he called friends and neighbours.', ['He punished the sheep for running away', 'M_LS_PUNISH'], ['He locked the sheep away in a small shed', 'M_LS_PUNISH'], ['He said nothing', 'M_LS_PUNISH']),
      C('What did Jesus say about heaven in Luke 15:7?', 'There is joy over one sinner who repents', 'Every person matters to God.', ['There is no joy over a sinner', 'M_LS_JOY'], ['Heaven is only for the righteous', 'M_LS_JOY'], ['Heaven cares only about large groups', 'M_LS_JOY']),
    ], H1('Reread Luke 15:1-7.', 'Think about what the shepherd did for the one sheep.')) }),
  sfam({ id: 'cre5.sheep.lessons', cs: `${L}PARABLE_OF_THE_LOST_SHEE.LOST_SHEEP`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Who does the lost sheep stand for in the parable?', 'A person who has gone astray from God', 'The shepherd stands for God\'s care.', ['An animal only, with no meaning for people', 'M_LS_NINETY_NINE'], ['A bad person God hates', 'M_LS_PUNISH'], ['The shepherd who went out to look for it', 'M_LS_NINETY_NINE']),
      C('Which lesson do we learn from the lost sheep?', 'God cares for every person and welcomes those who return', 'The shepherd rejoiced when he found the sheep.', ['God punishes those who go astray and sends them away', 'M_LS_PUNISH'], ['God cares only for large groups', 'M_LS_NINETY_NINE'], ['Lost people are not worth finding', 'M_LS_NINETY_NINE']),
      C('A pupil named Kiprono has stopped coming to church. How can Wafula follow the parable?', 'Visit him kindly and invite him back', 'We should reach out to the lost as Jesus taught.', ['Gossip about him with the other pupils at school', 'M_LS_PUNISH'], ['Ignore him and hope that he will return', 'M_LS_NINETY_NINE'], ['Punish him', 'M_LS_PUNISH']),
      C('Which is true about the shepherd?', 'He rejoiced when he found the lost sheep', 'Luke 15:5-6 shows his joy.', ['He was angry with the sheep', 'M_LS_PUNISH'], ['He gave up quickly and went home without it', 'M_LS_NINETY_NINE'], ['He sold the sheep to a neighbour in the market', 'M_LS_NINETY_NINE']),
      C('What does repentance bring, according to Jesus?', 'Joy in heaven', 'Luke 15:7 says there is joy in heaven over one who repents.', ['Shame in heaven', 'M_LS_JOY'], ['Anger in heaven', 'M_LS_JOY'], ['No change', 'M_LS_JOY']),
    ], H1('The shepherd stands for God who cares for each person.', 'We should reach out to the lost.')) }),

  // ---------------------------------------------------------------- SERMON_MOUNT
  sfam({ id: 'cre5.sermon.promises', cs: `${L}SERMON_ON_THE_MOUNT.SERMON_MOUNT`, oc: 'a', form: 'direct', rung: 1, kind: 'virtue and promise',
    gen: choose([
      C('What did Jesus say about the merciful in Matthew 5:7?', 'They will receive mercy', 'Mercy is returned to those who show it.', ['They will be rich', 'M_SM_MERCY_WEAK'], ['They will be weak', 'M_SM_MERCY_WEAK'], ['They will see God', 'M_SM_PURE_CLEAN']),
      C('What did Jesus say about the pure in heart in Matthew 5:8?', 'They will see God', 'A pure heart is honest and loves God.', ['They will receive mercy', 'M_SM_PURE_CLEAN'], ['They will be called children of God', 'M_SM_PURE_CLEAN'], ['They will be clean', 'M_SM_PURE_CLEAN']),
      C('What did Jesus say about the peacemakers in Matthew 5:9?', 'They will be called children of God', 'Peacemakers work to bring peace.', ['They will see God in heaven some day', 'M_SM_PEACE_NO_FIGHT'], ['They will receive mercy from God and people', 'M_SM_PEACE_NO_FIGHT'], ['They will have no quarrels', 'M_SM_PEACE_NO_FIGHT']),
      C('What is a pure heart?', 'A heart that is honest and loves God, without pretending', 'Purity of heart is about honesty and love.', ['A clean body and neat, ironed clothes every day', 'M_SM_PURE_CLEAN'], ['A heart that never feels anger toward anyone', 'M_SM_PURE_CLEAN'], ['A heart that is rich', 'M_SM_PURE_CLEAN']),
      C('What does it mean to be merciful?', 'To show kindness and forgive when you could punish', 'Mercy is strength used with kindness.', ['To be weak and let everyone win every argument', 'M_SM_MERCY_WEAK'], ['To be afraid of others and run away from them', 'M_SM_MERCY_WEAK'], ['To ignore wrong', 'M_SM_MERCY_WEAK']),
    ], H1('Reread Matthew 5:7-9.', 'Each virtue has a promise.')) }),
  sfam({ id: 'cre5.sermon.live', cs: `${L}SERMON_ON_THE_MOUNT.SERMON_MOUNT`, oc: 'b', form: 'word', rung: 2, kind: 'apply the virtue',
    gen: choose([
      C('Two friends quarrel during a football match. What does a peacemaker do?', 'Helps them to talk and make up', 'Peacemakers bring people together.', ['Takes the side of the stronger friend', 'M_SM_PEACE_NO_FIGHT'], ['Walks away and says nothing', 'M_SM_PEACE_NO_FIGHT'], ['Cheers them to fight', 'M_SM_PEACE_NO_FIGHT']),
      C('Mutua knocks over Hassan\'s book by accident. Which response shows mercy?', 'Forgive him and help pick up the book', 'Mercy forgives and helps.', ['Shout at him and tell him to be careful next time', 'M_SM_MERCY_WEAK'], ['Hit him back so that he learns a lesson', 'M_SM_MERCY_WEAK'], ['Never speak to him again', 'M_SM_MERCY_WEAK']),
      C('Which action shows a pure heart?', 'Telling the truth even when no one is watching', 'A pure heart is honest.', ['Washing hands before every meal at school', 'M_SM_PURE_CLEAN'], ['Wearing clean clothes', 'M_SM_PURE_CLEAN'], ['Staying quiet in class and never asking anything', 'M_SM_PURE_CLEAN']),
      C('During inter-class games, a team loses. What response shows peace?', 'Congratulating the winners and encouraging teammates', 'Good relations in competitions show peacemaking.', ['Blaming the other team and shouting at the referee', 'M_SM_PEACE_NO_FIGHT'], ['Refusing to play again and walking off the field', 'M_SM_PEACE_NO_FIGHT'], ['Making fun of them', 'M_SM_PEACE_NO_FIGHT']),
      C('A pupil has no pen. Which response shows mercy?', 'Lending him a pen kindly', 'Mercy helps those in need.', ['Telling him it is his fault', 'M_SM_MERCY_WEAK'], ['Laughing at him', 'M_SM_MERCY_WEAK'], ['Saying he is lazy', 'M_SM_MERCY_WEAK']),
    ], H1('Mercy forgives and helps; peace brings people together.', 'A pure heart is honest.')) }),

  // ---------------------------------------------------------------- RICH_YOUNG_MAN
  sfam({ id: 'cre5.rich.facts', cs: `${L}THE_RICH_YOUNG_MAN.RICH_YOUNG_MAN`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What did the young man ask Jesus?', 'What good thing he must do to have eternal life', 'Matthew 19:16 gives his question.', ['How he could get more money', 'M_RY_OLD'], ['Where Jesus lived and how far it was from the town', 'M_RY_OLD'], ['How he could become a ruler in the land', 'M_RY_OLD']),
      C('What did Jesus first tell him to do?', 'Keep the commandments', 'Matthew 19:17 shows Jesus pointing to the commandments.', ['Sell everything at once', 'M_RY_SOLD'], ['Build a synagogue', 'M_RY_RICH_SIN'], ['Pray all night', 'M_RY_RICH_SIN']),
      C('What did Jesus tell him to do with his possessions?', 'Sell them and give to the poor', 'Matthew 19:21 says to sell and give to the poor, then follow.', ['Keep them for his children', 'M_RY_RICH_SIN'], ['Hide them', 'M_RY_RICH_SIN'], ['Give them to Jesus only', 'M_RY_RICH_SIN']),
      C('How did the young man respond?', 'He went away sad, because he had great wealth', 'Matthew 19:22 says he went away sorrowful.', ['He sold everything he had and followed Jesus at once', 'M_RY_SOLD'], ['He thanked Jesus and left the place very happy', 'M_RY_SOLD'], ['He gave half to the poor at once', 'M_RY_SOLD']),
      C('How is the man described in the story?', 'A young man with great wealth', 'Matthew 19:20, 22 says young man and great possessions.', ['An old man without money', 'M_RY_OLD'], ['A priest who served in the temple', 'M_RY_OLD'], ['A beggar who asked people for money', 'M_RY_OLD']),
    ], H1('Reread Matthew 19:16-22.', 'The man went away sad.')) }),
  sfam({ id: 'cre5.rich.lessons', cs: `${L}THE_RICH_YOUNG_MAN.RICH_YOUNG_MAN`, oc: 'c', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Which lesson do we learn from the rich young man?', 'Put God first and share what we have', 'His wealth held his heart.', ['Being rich is always a sin', 'M_RY_RICH_SIN'], ['Keep wealth to yourself and never share with anyone', 'M_RY_RICH_SIN'], ['Jesus wants everyone to be poor and have nothing', 'M_RY_RICH_SIN']),
      C('Did Jesus say that owning things is wrong?', 'No, he showed that wealth had a hold on this man\'s heart', 'He needed to put God first.', ['Yes, owning anything at all is wrong for a Christian', 'M_RY_RICH_SIN'], ['Yes, for everyone', 'M_RY_RICH_SIN'], ['Yes, but only for rich men and not for others', 'M_RY_RICH_SIN']),
      C('Achieng has many toys and a classmate has none. Which lesson from the story fits?', 'Share with the classmate', 'The man was told to share with the poor.', ['Hide the toys', 'M_RY_RICH_SIN'], ['Keep them all', 'M_RY_RICH_SIN'], ['Sell them for profit', 'M_RY_RICH_SIN']),
      C('Why did the young man go away sad?', 'He did not want to give up his wealth', 'His wealth held his heart.', ['He was ill and needed to go home to rest', 'M_RY_SOLD'], ['He had no money and could not pay for his needs', 'M_RY_OLD'], ['He was lost', 'M_RY_SOLD']),
      C('What does it mean to put God first?', 'To value God above money and things', 'Wealth must not rule our hearts.', ['To hate money and refuse to touch it', 'M_RY_RICH_SIN'], ['To own nothing and give away everything at once', 'M_RY_RICH_SIN'], ['To work only on Sundays', 'M_RY_RICH_SIN']),
    ], H1('The young man loved his wealth more than he loved to follow.', 'Sharing is part of following Jesus.')) }),

  // ---------------------------------------------------------------- FRIEND_MIDNIGHT
  sfam({ id: 'cre5.midnight.facts', cs: `${L}A_FRIEND_AT_MIDNIGHT.FRIEND_MIDNIGHT`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How many loaves did the man ask his friend for?', 'Three loaves', 'Luke 11:5 says three loaves.', ['Seven loaves', 'M_FM_LOAVES'], ['Five loaves', 'M_FM_LOAVES'], ['Twelve loaves', 'M_FM_LOAVES']),
      C('Why did the man ask for bread at midnight?', 'A traveller had arrived and he had nothing to give him', 'Luke 11:6 gives the reason.', ['He was hungry himself and wanted something to eat', 'M_FM_FRIENDSHIP_ONLY'], ['He wanted to sell it to the traveller in the morning', 'M_FM_FRIENDSHIP_ONLY'], ['He was lost', 'M_FM_FRIENDSHIP_ONLY']),
      C('What did the friend inside first say?', 'Do not bother me, the door is shut and the children are in bed', 'Luke 11:7 shows him refusing at first.', ['Come in and take what you need, my friend, for the door is open', 'M_FM_FRIENDSHIP_ONLY'], ['I have no friends who can help you tonight', 'M_FM_FRIENDSHIP_ONLY'], ['Wait until morning at the market', 'M_FM_FRIENDSHIP_ONLY']),
      C('Why did the friend at last get up and give the loaves?', 'Because the man kept asking', 'Luke 11:8 says it was because of his persistence.', ['Only because of friendship', 'M_FM_FRIENDSHIP_ONLY'], ['Because he was afraid', 'M_FM_FRIENDSHIP_ONLY'], ['Because it was morning', 'M_FM_FRIENDSHIP_ONLY']),
      C('What did Jesus say we should do when we pray?', 'Ask, seek and knock', 'Luke 11:9 teaches persistence in prayer.', ['Ask once only', 'M_FM_ONE_PRAYER'], ['Stay silent', 'M_FM_ONE_PRAYER'], ['Wait without praying', 'M_FM_ONE_PRAYER']),
    ], H1('Reread Luke 11:5-10.', 'The man kept asking and did not give up.')) }),
  sfam({ id: 'cre5.midnight.lessons', cs: `${L}A_FRIEND_AT_MIDNIGHT.FRIEND_MIDNIGHT`, oc: 'b', form: 'why', rung: 2, kind: 'lessons about prayer',
    gen: choose([
      C('Which lesson do we learn from the parable?', 'We should keep praying and not give up', 'Persistence is the lesson.', ['One short prayer is enough', 'M_FM_ONE_PRAYER'], ['God dislikes being asked more than once', 'M_FM_ONE_PRAYER'], ['We should pray only at night', 'M_FM_FRIENDSHIP_ONLY']),
      C('Njeri prays for her sick grandmother every day. Which part of the parable does this follow?', 'Persistence in prayer', 'The man kept asking.', ['Praying once only', 'M_FM_ONE_PRAYER'], ['Asking for loaves', 'M_FM_LOAVES'], ['Praying only for friends', 'M_FM_FRIENDSHIP_ONLY']),
      C('Which sentence is true?', 'Jesus told this parable to teach persistent prayer', 'The lesson is to keep asking.', ['Jesus told it to teach about baking', 'M_FM_LOAVES'], ['Jesus told it to teach about travel', 'M_FM_LOAVES'], ['Jesus told it to teach about friendship only', 'M_FM_FRIENDSHIP_ONLY']),
      C('Kamau prayed once about his exam and stopped. What does the parable advise?', 'Keep praying and trusting God', 'Do not give up praying.', ['Stop praying', 'M_FM_ONE_PRAYER'], ['Pray only once', 'M_FM_ONE_PRAYER'], ['Pray only when he is afraid', 'M_FM_ONE_PRAYER']),
      C('What does "ask, seek and knock" teach?', 'To pray with hope and keep trying', 'Jesus encourages persistence in prayer.', ['To ask only once', 'M_FM_ONE_PRAYER'], ['To bang on doors at night until neighbours wake up', 'M_FM_LOAVES'], ['To search all the houses for loaves of bread', 'M_FM_LOAVES']),
    ], H1('Keep praying, as the man kept asking.', 'Ask, seek and knock.')) }),
];
