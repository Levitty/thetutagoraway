// ============================================================================
// GRADE 6 CHRISTIAN RELIGIOUS EDUCATION, PART B: The Life of Jesus Christ (the call of the disciples, the temptations,
// the Roman officer's servant, the bleeding woman, Lazarus, the hidden treasure, the rich man and Lazarus). Written offline
// from the KICD 2024 design through the curriculum map. Bible facts asked are those stated in the passages the design names.
// Every family stays reviewed:false until a CRE teacher signs it off (cre_g6_signed.js): none reaches a child.
// ============================================================================
import { sfam, choose, C } from './cre_g6_lib.js';

const L = 'THE_LI.';
const H1 = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- DISCIPLES
  sfam({ id: 'cre6.disciples.facts', cs: `${L}THE_CALL_OF_DISCIPLES.DISCIPLES`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What were Simon and Andrew doing when Jesus called them (Mark 1:16)?', 'Casting a net into the sea', 'Mark 1:16 says they were fishermen casting a net.', ['Collecting taxes', 'M_DIS6_JOB'], ['Planting seeds', 'M_DIS6_JOB'], ['Teaching in the synagogue', 'M_DIS6_JOB']),
      C('What did Jesus say to Simon and Andrew (Mark 1:17)?', '"Follow me, and I will make you fishers of men"', 'Mark 1:17 records these words.', ['"Come and rest"', 'M_DIS6_WORDS'], ['"Go home to your families"', 'M_DIS6_WORDS'], ['"Sell your boat and keep the money"', 'M_DIS6_WORDS']),
      C('What did Simon and Andrew do when Jesus called them?', 'They left their nets and followed him', 'Mark 1:18 says they immediately left their nets and followed him.', ['They refused', 'M_DIS6_WORDS'], ['They asked for a year to decide', 'M_DIS6_WORDS'], ['They went to ask the priest', 'M_DIS6_WORDS']),
      C('Which two brothers did Jesus call next (Mark 1:19)?', 'James and John', 'Jesus then called James and John, the sons of Zebedee.', ['Peter and Philip', 'M_DIS6_JOB'], ['Thomas and Matthew', 'M_DIS6_JOB'], ['Judas and Thaddaeus', 'M_DIS6_JOB']),
      C('What were James and John doing when Jesus called them?', 'Mending their nets in a boat with their father Zebedee', 'Mark 1:19-20 says they were in the boat mending their nets.', ['Selling fish in the market', 'M_DIS6_JOB'], ['Collecting taxes', 'M_DIS6_JOB'], ['Praying in the temple', 'M_DIS6_JOB']),
    ], H1('Read Mark 1:16-20 and find the detail asked.', 'The disciples were fishermen when Jesus called them.')) }),
  sfam({ id: 'cre6.disciples.today', cs: `${L}THE_CALL_OF_DISCIPLES.DISCIPLES`, oc: 'b', form: 'why', rung: 2, kind: 'called today',
    gen: choose([
      C('Who is called to serve God today?', 'People in many kinds of work and roles', 'God calls teachers, nurses, farmers, parents and pastors to serve him.', ['Only pastors and priests', 'M_DIS6_ONLY_CLERGY'], ['Only adults', 'M_DIS6_ONLY_CLERGY'], ['Only those who live in the city', 'M_DIS6_ONLY_CLERGY']),
      C('Nurse Achieng cares for the sick as part of her faith. What is she doing?', 'Serving God in her daily work', 'Serving others in daily work answers God\'s call.', ['Nothing special for God', 'M_DIS6_ONLY_CLERGY'], ['Doing work reserved for pastors', 'M_DIS6_ONLY_CLERGY'], ['Ignoring the call', 'M_DIS6_ONLY_CLERGY']),
      C('Which child is answering Jesus\' call to follow him?', 'Baraka, who helps at church and treats others kindly', 'Following Jesus means serving and loving others.', ['Baraka, who only watches others serve', 'M_DIS6_ONLY_CLERGY'], ['Baraka, who thinks only adults may serve', 'M_DIS6_ONLY_CLERGY'], ['Baraka, who refuses to help anyone', 'M_DIS6_ONLY_CLERGY']),
      C('What did the first disciples leave to follow Jesus?', 'Their nets and their work', 'They left their nets and their father in the boat to follow him.', ['Their country', 'M_DIS6_JOB'], ['Their whole families for ever', 'M_DIS6_JOB'], ['Their church', 'M_DIS6_JOB']),
      C('What does "fishers of men" mean for a Christian today?', 'Bringing others to know Jesus by word and example', 'Jesus meant that his followers would draw people to him.', ['Catching fish with nets from the boat on the lake', 'M_DIS6_WORDS'], ['Selling people to make money in the market', 'M_DIS6_WORDS'], ['Collecting money', 'M_DIS6_WORDS']),
    ], H1('God calls people to serve in many ways, not only as pastors.', 'The first disciples were ordinary fishermen.')) }),

  // ---------------------------------------------------------------- TEMPTATIONS
  sfam({ id: 'cre6.temptations.facts', cs: `${L}THE_TEMPTATIONS_OF_JESUS.TEMPTATIONS`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('How long did Jesus fast in the wilderness (Luke 4:2)?', 'Forty days', 'Luke 4:2 says he ate nothing for forty days.', ['Seven days', 'M_TEM6_FIRST'], ['Three days', 'M_TEM6_FIRST'], ['One day', 'M_TEM6_FIRST']),
      C('What was the first temptation (Luke 4:3)?', 'To turn a stone into bread', 'The devil told him to command the stone to become bread.', ['To jump from the temple', 'M_TEM6_FIRST'], ['To worship the devil', 'M_TEM6_FIRST'], ['To go home', 'M_TEM6_FIRST']),
      C('What did the devil offer Jesus for worshipping him (Luke 4:5-7)?', 'All the kingdoms of the world', 'He showed him all the kingdoms and offered them for worship.', ['A great feast', 'M_TEM6_FIRST'], ['A long life', 'M_TEM6_FIRST'], ['A new name', 'M_TEM6_FIRST']),
      C('Where did the devil take Jesus for the third temptation (Luke 4:9)?', 'To the highest point of the temple', 'He told him to throw himself down from the temple.', ['To a mountain in Galilee', 'M_TEM6_FIRST'], ['To the sea', 'M_TEM6_FIRST'], ['To a market', 'M_TEM6_FIRST']),
      C('How did Jesus answer each temptation?', 'With words from Scripture', 'Jesus answered, "It is written..." each time.', ['By giving in on the second', 'M_TEM6_GAVE_IN'], ['By arguing with a long speech', 'M_TEM6_GAVE_IN'], ['By staying silent and giving in', 'M_TEM6_GAVE_IN']),
    ], H1('Read Luke 4:1-13 and find what the verse says.', 'Forty days, bread, kingdoms, the temple, and Scripture as the answer.')) }),
  sfam({ id: 'cre6.temptations.today', cs: `${L}THE_TEMPTATIONS_OF_JESUS.TEMPTATIONS`, oc: 'b', form: 'why', rung: 2, kind: 'temptation today',
    gen: choose([
      C('What can a young person do when tempted to cheat in an exam?', 'Pray, remember God\'s word and ask a trusted adult for help', 'Jesus used God\'s word. We can pray and ask for help.', ['Give in so as not to look weak in front of the others', 'M_TEM6_ALONE'], ['Face it alone and say nothing to anyone about it', 'M_TEM6_ALONE'], ['Cheat only once', 'M_TEM6_ALONE']),
      C('Which is a temptation young people meet today?', 'Friends pushing them to lie or use drugs', 'Young people are tempted by pressure to do wrong.', ['Being asked to say a prayer', 'M_TEM6_ALONE'], ['A holiday from school', 'M_TEM6_ALONE'], ['A gift from a parent', 'M_TEM6_ALONE']),
      C('Did Jesus give in to any temptation?', 'No, he answered each time with Scripture', 'Jesus did not give in.', ['Yes, he gave in to the second temptation at the temple', 'M_TEM6_GAVE_IN'], ['Yes, he gave in to the third temptation in the desert', 'M_TEM6_GAVE_IN'], ['Yes, to the first', 'M_TEM6_GAVE_IN']),
      C('Kamau is tempted to lie to avoid trouble. Which choice follows Jesus\' example?', 'Tell the truth and remember God\'s word', 'Jesus resisted by trusting God\'s word.', ['Lie because everyone else in the class does it too', 'M_TEM6_ALONE'], ['Blame a friend so that he gets the punishment', 'M_TEM6_ALONE'], ['Say nothing and hide', 'M_TEM6_ALONE']),
      C('Why does the story of the temptations matter to us?', 'It shows we can resist with God\'s help', 'Jesus faced temptation and did not sin, and he helps us.', ['It shows temptation is sin', 'M_TEM6_GAVE_IN'], ['It shows Jesus was weak', 'M_TEM6_GAVE_IN'], ['It shows we must face it alone', 'M_TEM6_ALONE']),
    ], H1('Jesus resisted by using God\'s word, and we can ask for help.', 'Being tempted is not a sin; giving in is.')) }),

  // ---------------------------------------------------------------- ROMAN OFFICER
  sfam({ id: 'cre6.officer.facts', cs: `${L}MIRACLES_OF_JESUS_CHRIST.ROMAN_OFFICER`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('Who was sick in Matthew 8:6?', 'The officer\'s servant', 'Matthew 8:6 says his servant lay at home paralysed.', ['The officer\'s son', 'M_ROM6_WHO'], ['The officer\'s wife', 'M_ROM6_WHO'], ['The officer himself', 'M_ROM6_WHO']),
      C('Where did the officer meet Jesus?', 'In Capernaum', 'Matthew 8:5 says it was when Jesus entered Capernaum.', ['In Jerusalem', 'M_ROM6_WENT'], ['In Nazareth', 'M_ROM6_WENT'], ['In Bethlehem', 'M_ROM6_WENT']),
      C('What did the officer say about Jesus coming to his house?', '"I am not worthy to have you come under my roof"', 'Matthew 8:8 records his humility.', ['"Come at once and lay your hands on him"', 'M_ROM6_WENT'], ['"Do not come"', 'M_ROM6_WENT'], ['"Bring him to the temple"', 'M_ROM6_WENT']),
      C('How was the servant healed?', 'Jesus spoke the word and he was healed at that hour', 'Matthew 8:13 says the servant was healed at that very hour.', ['Jesus went to the house and laid hands on him', 'M_ROM6_WENT'], ['Doctors treated him for a week', 'M_ROM6_WENT'], ['He recovered slowly on his own', 'M_ROM6_WENT']),
      C('What did Jesus say about the officer\'s faith (Matthew 8:10)?', 'He had not found such great faith in Israel', 'Jesus was amazed at the officer\'s faith.', ['It was too small', 'M_ROM6_FAITH'], ['It was not enough', 'M_ROM6_FAITH'], ['It was a sin', 'M_ROM6_FAITH']),
    ], H1('Read Matthew 8:5-13 and pick what the verse says.', 'A servant, humility, "only say the word", and great faith.')) }),
  sfam({ id: 'cre6.officer.lessons', cs: `${L}MIRACLES_OF_JESUS_CHRIST.ROMAN_OFFICER`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Which lesson do we learn from the Roman officer?', 'Have faith and care for others', 'The officer had great faith and cared for his servant.', ['Faith is only for the proud', 'M_ROM6_FAITH'], ['Only family deserves help', 'M_ROM6_WHO'], ['Jesus must be present to heal', 'M_ROM6_WENT']),
      C('What does the officer\'s humility teach?', 'We should not think we deserve God\'s help by our own importance', 'He said he was not worthy yet trusted Jesus\' word.', ['We should boast of our rank and importance before God', 'M_ROM6_FAITH'], ['We should say that Jesus owes us a miracle for our faith', 'M_ROM6_FAITH'], ['We should not ask', 'M_ROM6_WENT']),
      C('How can a child follow Jesus\' example in Matthew 8?', 'By praying for the sick and caring for them', 'Jesus cared for the sick. We can pray for them and help.', ['By ignoring the sick', 'M_ROM6_WHO'], ['By waiting for adults to pray', 'M_ROM6_WHO'], ['By laughing at them', 'M_ROM6_FAITH']),
      C('Why was Jesus amazed?', 'A Roman officer trusted his word without seeing it', 'Great faith in Jesus\' word amazed him.', ['The officer refused his help', 'M_ROM6_FAITH'], ['The servant was well already', 'M_ROM6_WENT'], ['The officer asked for money', 'M_ROM6_FAITH']),
      C('Which sentence best sums up the story?', 'Faith in Jesus\' word brings healing', 'The officer trusted and the servant was healed.', ['Faith is for the rich', 'M_ROM6_FAITH'], ['Jesus heals only in person', 'M_ROM6_WENT'], ['Only family members are healed', 'M_ROM6_WHO']),
    ], H1('Think about faith, humility and caring for others.', 'The servant was healed at a distance.')) }),

  // ---------------------------------------------------------------- BLEEDING WOMAN
  sfam({ id: 'cre6.bleeding.facts', cs: `${L}MIRACLE_OF_HEALING.BLEEDING_WOMAN`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('For how long had the woman been bleeding (Luke 8:43)?', 'Twelve years', 'Luke 8:43 says she had bled for twelve years.', ['Seven years', 'M_BLE6_YEARS'], ['Two years', 'M_BLE6_YEARS'], ['One year', 'M_BLE6_YEARS']),
      C('What had she done before meeting Jesus?', 'She had spent all she had on doctors, but none could heal her', 'Luke 8:43 says no one could heal her.', ['She had been healed by the doctors after a short time', 'M_BLE6_DOCTORS'], ['She had never asked for help from anyone in the town', 'M_BLE6_DOCTORS'], ['She had stayed at home', 'M_BLE6_DOCTORS']),
      C('How did she touch Jesus?', 'She touched the edge of his cloak from behind', 'Luke 8:44 says she touched the edge of his cloak.', ['She held his hand and asked him to come to her house', 'M_BLE6_WORDS'], ['She shouted his name loudly across the crowd', 'M_BLE6_WORDS'], ['She knelt in front of him', 'M_BLE6_WORDS']),
      C('What did Jesus say to her (Luke 8:48)?', '"Daughter, your faith has healed you; go in peace"', 'Luke 8:48 records these words.', ['"You are not worthy"', 'M_BLE6_WORDS'], ['"Why did you touch me?" and he walked away', 'M_BLE6_WORDS'], ['"Go and sin no more"', 'M_BLE6_WORDS']),
      C('Who healed the woman?', 'Jesus, when she touched his cloak in faith', 'She was healed by Jesus\' power, through her faith.', ['The doctors, after she had paid them everything', 'M_BLE6_DOCTORS'], ['Her family, who had prayed for her for years', 'M_BLE6_DOCTORS'], ['The crowd, who pushed against Jesus on every side', 'M_BLE6_DOCTORS']),
    ], H1('Read Luke 8:43-48 and find the detail asked.', 'Twelve years, doctors could not help, the edge of the cloak, and "your faith has healed you".')) }),
  sfam({ id: 'cre6.bleeding.help', cs: `${L}MIRACLE_OF_HEALING.BLEEDING_WOMAN`, oc: 'b', form: 'why', rung: 2, kind: 'help for the sick today',
    gen: choose([
      C('Who helps the sick in society today?', 'Both the church and the government', 'Churches and the government both run hospitals and clinics.', ['Only the church and no one else cares for the sick', 'M_BLE6_HELP'], ['Only the government and not the church cares for the sick', 'M_BLE6_HELP'], ['Nobody', 'M_BLE6_HELP']),
      C('Which is a way the government helps the sick?', 'Public hospitals, clinics and vaccination', 'Government health services reach many people.', ['Closing hospitals', 'M_BLE6_HELP'], ['Telling people to stay silent', 'M_BLE6_HELP'], ['Charging only the poor', 'M_BLE6_HELP']),
      C('Which is a way the church helps the sick?', 'Running mission hospitals, praying and visiting', 'Churches care for the body and the spirit.', ['Telling the sick to hide in their homes and stay silent', 'M_BLE6_HELP'], ['Ignoring them because it is not the church\'s work', 'M_BLE6_HELP'], ['Blaming them for the illness that they have caught', 'M_BLE6_HELP']),
      C('What lesson does the woman\'s story teach us about faith?', 'Trust in Jesus when no one else can help', 'She trusted Jesus after doctors failed.', ['Doctors can never help', 'M_BLE6_DOCTORS'], ['Faith means ignoring doctors', 'M_BLE6_DOCTORS'], ['Faith is for the crowd', 'M_BLE6_WORDS']),
      C('How can a child help a sick neighbour?', 'Pray for him and run small errands', 'Christians care for the sick by prayer and kindness.', ['Avoid him because his illness might spread to you', 'M_BLE6_HELP'], ['Laugh at him when he is weak and cannot do things', 'M_BLE6_HELP'], ['Ask him for money', 'M_BLE6_HELP']),
    ], H1('The church and the government both help the sick.', 'Faith and care go together.')) }),

  // ---------------------------------------------------------------- LAZARUS RAISED
  sfam({ id: 'cre6.lazarus.facts', cs: `${L}RAISING_LAZARUS_FROM_THE.LAZARUS_RAISED`, oc: 'a', form: 'direct', rung: 1, kind: 'story facts',
    gen: choose([
      C('What did Jesus do when he saw Mary weeping (John 11:35)?', 'Jesus wept', 'John 11:35, the shortest verse, says Jesus wept.', ['He was angry with her', 'M_LAZ6_WEPT'], ['He laughed', 'M_LAZ6_WEPT'], ['He walked away', 'M_LAZ6_WEPT']),
      C('For how many days had Lazarus been in the tomb (John 11:39)?', 'Four days', 'John 11:39 says he had been dead four days.', ['One day', 'M_LAZ6_DAYS'], ['Seven days', 'M_LAZ6_DAYS'], ['Three days', 'M_LAZ6_DAYS']),
      C('What did Jesus tell the people to do at the tomb (John 11:39)?', 'Take away the stone', 'Jesus said, "Take away the stone."', ['Close the tomb', 'M_LAZ6_WORDS'], ['Break the tomb', 'M_LAZ6_WORDS'], ['Go home', 'M_LAZ6_WORDS']),
      C('What did Jesus call out at the tomb (John 11:43)?', '"Lazarus, come out!"', 'John 11:43 records these words.', ['"Lazarus, wake up and eat"', 'M_LAZ6_WORDS'], ['"Lazarus, rest"', 'M_LAZ6_WORDS'], ['"Lazarus, stay"', 'M_LAZ6_WORDS']),
      C('How did Lazarus come out of the tomb?', 'Wrapped in strips of linen', 'John 11:44 says his hands and feet were wrapped with strips of linen.', ['Dressed in new clothes', 'M_LAZ6_WORDS'], ['Carried by the people', 'M_LAZ6_WORDS'], ['Wearing a crown', 'M_LAZ6_WORDS']),
    ], H1('Read John 11:32-45 and find the detail asked.', 'Jesus wept, four days, the stone, and "Lazarus, come out!"')) }),
  sfam({ id: 'cre6.lazarus.lessons', cs: `${L}RAISING_LAZARUS_FROM_THE.LAZARUS_RAISED`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('What does the raising of Lazarus show about Jesus?', 'He has power over death', 'Jesus raised a man dead four days.', ['He cannot change sorrow', 'M_LAZ6_WEPT'], ['He was too late to help', 'M_LAZ6_DAYS'], ['He was angry', 'M_LAZ6_WEPT']),
      C('Why does it matter that Jesus wept?', 'It shows he cares about our sorrow', 'Jesus shared in the grief of Mary and Martha.', ['It shows he had no power', 'M_LAZ6_WEPT'], ['It shows he was weak', 'M_LAZ6_WEPT'], ['It shows he did not care', 'M_LAZ6_WEPT']),
      C('Which lesson can a Christian take in a time of sorrow?', 'Trust that God has power and cares for us', 'Jesus cares and has power over death.', ['God has left us alone and does not see our grief', 'M_LAZ6_WEPT'], ['It is too late for God to help us after a death', 'M_LAZ6_DAYS'], ['There is no hope for those who have lost someone', 'M_LAZ6_DAYS']),
      C('Why did four days matter in the story?', 'It showed the miracle was beyond human power', 'After four days no one could say Lazarus only seemed dead.', ['It meant that Jesus failed to arrive in time to help', 'M_LAZ6_DAYS'], ['It was a mistake in the story that did not matter at all', 'M_LAZ6_DAYS'], ['It meant Lazarus was alive', 'M_LAZ6_DAYS']),
      C('Which sentence best sums up the miracle?', 'Jesus has power over sickness and death', 'The miracle shows his power and care.', ['Jesus avoids funerals', 'M_LAZ6_WEPT'], ['Jesus is powerless in sorrow', 'M_LAZ6_WEPT'], ['Death cannot be changed', 'M_LAZ6_DAYS']),
    ], H1('Think about Jesus\' power and care.', 'Four days meant no one could doubt the miracle.')) }),

  // ---------------------------------------------------------------- HIDDEN TREASURE
  sfam({ id: 'cre6.treasure.facts', cs: `${L}THE_HIDDEN_TREASURE.HIDDEN_TREASURE`, oc: 'a', form: 'direct', rung: 1, kind: 'parable facts',
    gen: choose([
      C('Where was the treasure hidden (Matthew 13:44)?', 'In a field', 'Matthew 13:44 says it was hidden in a field.', ['In a house', 'M_HID6_PLACE'], ['In a cave', 'M_HID6_PLACE'], ['In a boat', 'M_HID6_PLACE']),
      C('What did the man do when he found the treasure?', 'He hid it again, then sold all he had and bought the field', 'He sold everything in his joy and bought the field.', ['He kept what he had and took the treasure', 'M_HID6_KEEP'], ['He told no one and left it', 'M_HID6_KEEP'], ['He gave it to the poor and left', 'M_HID6_KEEP']),
      C('How did the man feel when he found the treasure?', 'He was full of joy', 'Matthew 13:44 says that in his joy he sold all he had.', ['He was afraid', 'M_HID6_KEEP'], ['He was angry', 'M_HID6_KEEP'], ['He was bored', 'M_HID6_KEEP']),
      C('What does Jesus say the kingdom of heaven is like?', 'Treasure hidden in a field', 'Jesus said the kingdom of heaven is like treasure hidden in a field.', ['A big house', 'M_HID6_PLACE'], ['A rich harvest', 'M_HID6_PLACE'], ['A strong king', 'M_HID6_PLACE']),
      C('What did the man buy?', 'The field', 'He bought the field that held the treasure.', ['A house in the city', 'M_HID6_PLACE'], ['A herd of animals', 'M_HID6_PLACE'], ['A boat', 'M_HID6_PLACE']),
    ], H1('Read Matthew 13:44 and pick what the verse says.', 'A treasure in a field, joy, selling all, buying the field.')) }),
  sfam({ id: 'cre6.treasure.lessons', cs: `${L}THE_HIDDEN_TREASURE.HIDDEN_TREASURE`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('What does the treasure stand for?', 'The kingdom of heaven', 'The treasure is the kingdom of God, worth more than all we have.', ['Money and wealth', 'M_HID6_RICH'], ['A way to become rich', 'M_HID6_RICH'], ['A farmer\'s land', 'M_HID6_PLACE']),
      C('What is the main lesson of the parable?', 'The kingdom of heaven is worth more than anything else', 'The man gave up everything for it.', ['How to get rich quickly by finding hidden money', 'M_HID6_RICH'], ['How to find a good field to buy cheaply for farming', 'M_HID6_PLACE'], ['How to hide valuable things in a safe place', 'M_HID6_KEEP']),
      C('How can a child show that God\'s kingdom matters most?', 'By putting God first and committing life to Christ', 'The man gave up all he had. We put God first.', ['By collecting treasure and money for ourselves each day', 'M_HID6_RICH'], ['By hiding good things from others so they are not lost', 'M_HID6_KEEP'], ['By buying a field and farming it with great care', 'M_HID6_PLACE']),
      C('Why did the man sell all he had?', 'He knew the treasure was worth more', 'The treasure was worth more than all he owned.', ['He was foolish with money', 'M_HID6_RICH'], ['He wanted to be a seller', 'M_HID6_KEEP'], ['He was told to by his family', 'M_HID6_KEEP']),
      C('Which sentence best sums up the parable?', 'Commit your life to Christ and his kingdom', 'The kingdom is worth every sacrifice.', ['Always look for money in fields', 'M_HID6_RICH'], ['Keep your treasure secret', 'M_HID6_KEEP'], ['Be a farmer', 'M_HID6_PLACE']),
    ], H1('The treasure is the kingdom of heaven, not money.', 'The man gave up all he had for it.')) }),

  // ---------------------------------------------------------------- RICH MAN AND LAZARUS
  sfam({ id: 'cre6.richman.facts', cs: `${L}THE_RICH_MAN_AND_LAZARUS.RICH_MAN`, oc: 'a', form: 'direct', rung: 1, kind: 'parable facts',
    gen: choose([
      C('Where did the beggar Lazarus lie (Luke 16:20)?', 'At the rich man\'s gate', 'He lay at the gate, covered with sores.', ['In the market', 'M_RIC6_CHASM'], ['In the temple', 'M_RIC6_CHASM'], ['In a hospital', 'M_RIC6_CHASM']),
      C('What did the rich man do every day (Luke 16:19)?', 'Dressed in fine clothes and feasted', 'The rich man lived in luxury every day.', ['Gave food to the poor', 'M_RIC6_WEALTH'], ['Worked in the field', 'M_RIC6_WEALTH'], ['Prayed in the temple', 'M_RIC6_WEALTH']),
      C('Where did Lazarus go after he died (Luke 16:22)?', 'He was carried by angels to Abraham', 'Angels carried him to Abraham\'s side.', ['He was left unburied', 'M_RIC6_CHASM'], ['He went to the rich man\'s house', 'M_RIC6_CHASM'], ['He came back to life', 'M_RIC6_SAME']),
      C('What lay between the rich man and Lazarus (Luke 16:26)?', 'A great chasm', 'Luke 16:26 says a great chasm had been fixed between them.', ['A river', 'M_RIC6_CHASM'], ['A high wall', 'M_RIC6_CHASM'], ['A forest', 'M_RIC6_CHASM']),
      C('Which Lazarus is in this parable?', 'A beggar in a parable of Jesus', 'In the parable Lazarus is a beggar. The Lazarus of John 11 was the brother of Mary and Martha.', ['The brother of Mary and Martha', 'M_RIC6_SAME'], ['A disciple of Jesus', 'M_RIC6_SAME'], ['The rich man\'s brother', 'M_RIC6_SAME']),
    ], H1('Read Luke 16:19-31 and pick what the verse says.', 'A beggar at the gate, angels, a great chasm.')) }),
  sfam({ id: 'cre6.richman.lessons', cs: `${L}THE_RICH_MAN_AND_LAZARUS.RICH_MAN`, oc: 'b', form: 'why', rung: 2, kind: 'lessons',
    gen: choose([
      C('Why was the rich man in torment?', 'He ignored the beggar at his gate', 'The parable condemns ignoring those in need.', ['Only because he was rich', 'M_RIC6_WEALTH'], ['Because he owned a gate', 'M_RIC6_WEALTH'], ['Because he fed Lazarus', 'M_RIC6_WEALTH']),
      C('What can Christians learn from the parable?', 'Share with the poor and do not ignore people in need', 'The rich man never helped Lazarus.', ['Keep wealth to ourselves and never share it with anyone', 'M_RIC6_WEALTH'], ['Do not look at beggars so that we are not troubled', 'M_RIC6_WEALTH'], ['Rich people are always wrong and should be avoided', 'M_RIC6_WEALTH']),
      C('Baraka sees a hungry child at school and shares his lunch. Which lesson does he follow?', 'Care for the needy', 'He does what the rich man did not do.', ['Keep what you have', 'M_RIC6_WEALTH'], ['Look away from the poor', 'M_RIC6_WEALTH'], ['The rich should not give', 'M_RIC6_WEALTH']),
      C('What did the great chasm show?', 'After death a person\'s choices cannot be undone', 'The chasm shows the rich man could not cross over.', ['It was a river to be crossed', 'M_RIC6_CHASM'], ['It was a gate to open', 'M_RIC6_CHASM'], ['It was a bridge', 'M_RIC6_CHASM']),
      C('The rich man asked that his brothers be warned. What does this teach?', 'We should listen to God\'s word now and live rightly', 'The word of God is enough to guide us.', ['Wealth guarantees a good end for those who have it', 'M_RIC6_WEALTH'], ['Nothing, because it is only a story and not a lesson', 'M_RIC6_SAME'], ['Lazarus will become rich if people warn his brothers', 'M_RIC6_SAME']),
    ], H1('The rich man was blamed for ignoring Lazarus, not only for being rich.', 'Think about sharing and listening to God\'s word.')) }),
];
