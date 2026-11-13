// ============================================================================
// CRE GRADE 8, A (10 skills): the fall and redemption, Abraham's call, promises and covenant, kingship and Saul's failures, Bartimaeus, the
// storm and the paralytic. Written offline from the KICD design through the curriculum map. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a CRE teacher signs them off. Facts are those of the named Bible passages.
// ============================================================================
import { S } from './cre_g8_lib.js';
const OS = 'CREATI.ORIGIN_AND_CONSEQUENCES_.', RD = 'CREATI.GOD_S_PLAN_FOR_REDEMPTIO.', AB = 'THE_BI.FAITH_AND_GOD_S_PROMISES.', CV = 'THE_BI.ABRAHAMIC_COVENANT.', KS = 'THE_BI.LEADERSHIP_IN_ISRAEL_SAU.';
const BA = 'THE_LI.HEALING_OF_BLIND_BARTIMA.', ST = 'THE_LI.CALMING_THE_STORM.', PA = 'THE_LI.HEALING_OF_THE_PARALYTIC.';

export const FAMILIES = [
  ...S('so', OS, 'SIN_ORIGIN', ['SO_FRUIT', 'SO_TEMPT', 'SO_RESULT'], ['They ate the forbidden fruit; the serpent tempted Eve.', 'They were sent out of the garden of Eden.'], [
    ['What did Adam and Eve eat that God had forbidden?', 'Fruit of the tree of knowledge', 'Honey from the garden', 'Bread from the field', 'Fish from the river'],
    ['Who tempted Eve in the garden?', 'The serpent', 'God', 'Adam', 'An angel'],
    ['What was a result of the fall?', 'They were sent out of the garden', 'They stayed in the garden for ever', 'They became kings', 'They were given gold'],
    ['How did Adam and Eve feel after disobeying?', 'Ashamed and afraid', 'Proud and happy', 'Rich and strong', 'Calm and brave'],
    ['What is sin?', 'Disobeying God', 'Obeying God', 'Praying to God', 'Thanking God'],
  ], [
    ['Eve sees the forbidden fruit and a serpent tells her to eat. Who tempted her?', 'The serpent', 'God', 'Adam', 'An angel'],
    ['After eating the fruit, Adam and Eve hid from God. Why?', 'They were ashamed and afraid', 'They were proud of what they did', 'They were sleepy after the meal', 'They were hungry for more fruit'],
    ['God sent Adam and Eve out of Eden. What does this show?', 'Sin has consequences', 'Sin has no result', 'God was unkind for no reason', 'Eden was closed for repairs'],
    ['A learner says sin began when God made Adam. What is true?', 'Sin began when they disobeyed God', 'She is right, God made sin', 'God made sin on the first day', 'Sin always existed in Eden'],
    ['After the fall, work became hard. What does Genesis 3 say about the ground?', 'It would bring thorns and thistles', 'It would give gold to the farmer', 'It would stay perfect for ever', 'It would turn into clear water'],
  ], [
    ['Which step is the mistake?', 'Step 1: God forbade the fruit.', 'Step 2: Adam and Eve ate it.', 'Step 3: So they obeyed God.', 'They disobeyed God.', 2],
    ['Which step is the mistake?', 'Step 1: A serpent spoke to Eve.', 'Step 2: It tempted her.', 'Step 3: So God tempted Eve.', 'The serpent tempted Eve.', 2],
    ['Which step is the mistake?', 'Step 1: Adam and Eve sinned.', 'Step 2: Sin has consequences.', 'Step 3: So they stayed in the garden for ever.', 'They were sent out of the garden.', 2],
    ['Which step is the mistake?', 'Step 1: Sin broke the bond with God.', 'Step 2: They felt shame.', 'Step 3: So they felt proud.', 'They felt ashamed.', 2],
    ['Which step is the mistake?', 'Step 1: Sin harms people.', 'Step 2: It harms creation too.', 'Step 3: So sin has no effects.', 'Sin has effects.', 2],
  ], ['a', 'b']),
  ...S('rd', RD, 'REDEMPTION', ['RD_CLOTHES', 'RD_JOHN', 'RD_WHY'], ['God made clothes for Adam and Eve and sent His Son.', 'Redemption restores people to God.'], [
    ['What did God do for Adam and Eve after the fall?', 'Made clothes for them', 'Left them without help', 'Sent them to war', 'Forgot them'],
    ['What does John 3:16 say God gave?', 'His only Son', 'A new garden', 'A golden crown', 'A great army'],
    ['Why is redemption important?', 'It restores people to God', 'It is not important', 'It makes people rich', 'It ends all work'],
    ['Who do Christians say fulfils God\'s plan of salvation?', 'Jesus Christ', 'Adam', 'Moses', 'Abraham'],
    ['What does "redeem" mean?', 'To buy back or set free', 'To lose', 'To forget', 'To hide'],
  ], [
    ['Adam and Eve were ashamed and God gave them clothes. What does this show?', 'God cared for them even after the fall', 'God had abandoned them', 'God was angry for ever', 'God forgot them'],
    ['A learner quotes "God so loved the world that He gave His only Son". Which verse is this?', 'John 3:16', 'Genesis 1:1', 'Psalm 23:1', 'Exodus 20:13'],
    ['A pastor explains that Jesus came to save people. What is this called?', 'God\'s plan of salvation', 'God\'s plan for rain', 'God\'s plan for war', 'God\'s plan for trade'],
    ['A youth shares God\'s love with a friend in need. What is she doing?', 'Sharing the love of God', 'Hiding the love of God', 'Wasting time', 'Spoiling the friend'],
    ['A learner says redemption does not matter. What can you say?', 'It restores people to God', 'She is right', 'It is only a story', 'It has no meaning'],
  ], [
    ['Which step is the mistake?', 'Step 1: After the fall Adam and Eve were ashamed.', 'Step 2: God clothed them.', 'Step 3: So God abandoned them.', 'God cared for them.', 2],
    ['Which step is the mistake?', 'Step 1: John 3:16 speaks of God\'s love.', 'Step 2: God gave His Son.', 'Step 3: So God gave a new garden.', 'God gave His only Son.', 2],
    ['Which step is the mistake?', 'Step 1: Sin separated people from God.', 'Step 2: Redemption restores them.', 'Step 3: So redemption is not needed.', 'Redemption is needed.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus is the Saviour.', 'Step 2: Christians trust Him.', 'Step 3: So Moses saves people from sin.', 'Christians say Jesus saves.', 2],
    ['Which step is the mistake?', 'Step 1: God loves people.', 'Step 2: He made a plan to save them.', 'Step 3: So He made no plan.', 'He made a plan.', 2],
  ], ['c', 'b', 'a']),
  ...S('af', AB, 'ABRAHAM_FAITH', ['AF_CALL', 'AF_ISAAC', 'AF_FAITH'], ['God told Abram to leave his country; Abraham obeyed.', 'God provided a ram instead of Isaac.'], [
    ['What did God tell Abram to do?', 'Leave his country for a land God would show', 'Stay in his country', 'Build a tower', 'Make an idol'],
    ['What did God provide instead of Isaac?', 'A ram', 'A lamb of Isaac\'s age', 'A goat from Egypt', 'A bird from the sky'],
    ['How did Abraham respond to God\'s call?', 'He obeyed', 'He refused', 'He argued all night', 'He ran away'],
    ['Whom did Abram take with him when he left?', 'Sarai and Lot', 'Moses', 'David', 'Joshua'],
    ['Where was Abraham told to offer Isaac?', 'On a mountain God showed him', 'In his home', 'In the city', 'By the river'],
  ], [
    ['Abram was told to leave home without knowing where to go. What did he show?', 'Faith in God', 'Fear of God', 'Anger at God', 'Doubt in God'],
    ['Abraham raised the knife and an angel stopped him. What did God provide?', 'A ram caught in a thicket', 'A lamb of Isaac\'s age', 'A goat from Egypt', 'A bird from the sky'],
    ['A learner says Abraham refused God\'s call. What is true?', 'He obeyed God', 'She is right', 'He argued all night', 'He ran away'],
    ['Abram left Haran with Sarai and Lot. Whose call was he following?', 'God\'s call', 'A king\'s call', 'A friend\'s call', 'A prophet\'s call'],
    ['Abraham trusted that God would provide a sacrifice. What is this called?', 'Faith', 'Doubt', 'Pride', 'Fear'],
  ], [
    ['Which step is the mistake?', 'Step 1: God called Abram.', 'Step 2: He was told to leave his country.', 'Step 3: So he stayed at home.', 'He went as God told him.', 2],
    ['Which step is the mistake?', 'Step 1: Abraham was ready to obey.', 'Step 2: God stopped him.', 'Step 3: So God provided a lamb of Isaac\'s age.', 'God provided a ram.', 2],
    ['Which step is the mistake?', 'Step 1: Abraham trusted God.', 'Step 2: He obeyed.', 'Step 3: So he refused God\'s call.', 'He obeyed God\'s call.', 2],
    ['Which step is the mistake?', 'Step 1: Faith means trusting God.', 'Step 2: Abraham trusted Him.', 'Step 3: So Abraham doubted God completely.', 'Abraham trusted God.', 2],
    ['Which step is the mistake?', 'Step 1: Abram left Haran.', 'Step 2: He went to Canaan.', 'Step 3: So he went back to Ur at once.', 'He went to Canaan.', 2],
  ], ['a', 'b']),
  ...S('ap', AB, 'ABRAHAM_PROMISES', ['AP_LAND', 'AP_BLESS', 'AP_TRUST'], ['God promised land, descendants, a great name and blessing for all families.', 'Christians trust God to keep His promises.'], [
    ['Which was a promise to Abraham?', 'Many descendants', 'Great wealth in gold only', 'A palace in Egypt', 'A long sleep'],
    ['Who would be blessed through Abraham?', 'All families of the earth', 'Only his family', 'Only his servants', 'Only kings'],
    ['Why do Christians value God\'s promises?', 'They can trust God to keep them', 'They are useless', 'They are old stories only', 'They are a game'],
    ['Which land did God promise Abraham?', 'The land of Canaan', 'The land of Egypt', 'The land of Babylon', 'The land of Rome'],
    ['What did God promise about Abraham\'s name?', 'It would be great', 'It would be forgotten', 'It would change daily', 'It would be hidden'],
  ], [
    ['Abram is old and has no children. God promises many descendants. What is this?', 'A promise of God', 'A threat from God', 'A game', 'A dream only'],
    ['Abraham\'s blessing would reach all nations. What does this show?', 'God\'s blessing is for all families', 'God\'s blessing is only for one family', 'God\'s blessing is a secret', 'God\'s blessing ended'],
    ['A youth trusts God\'s promise to be with her. What is this?', 'Applying God\'s promises in daily life', 'Ignoring God\'s promises', 'Doubting God', 'Wasting time'],
    ['A learner says God\'s promises to Abraham are useless today. What can you say?', 'Christians still trust God to keep His promises', 'She is right', 'They are only old stories', 'They are a game'],
    ['God told Abraham to look at the stars and count them. What was the promise?', 'Descendants as many as the stars', 'Gold as many as the stars', 'Cattle as many as the stars', 'Friends as many as the stars'],
  ], [
    ['Which step is the mistake?', 'Step 1: God promised Abraham descendants.', 'Step 2: He also promised land.', 'Step 3: So He promised only gold.', 'He promised land and descendants.', 2],
    ['Which step is the mistake?', 'Step 1: God blessed Abraham.', 'Step 2: Through him all families would be blessed.', 'Step 3: So only his family would be blessed.', 'All families would be blessed.', 2],
    ['Which step is the mistake?', 'Step 1: God keeps His promises.', 'Step 2: Christians trust Him.', 'Step 3: So promises are useless.', 'Promises are trusted.', 2],
    ['Which step is the mistake?', 'Step 1: God promised a land.', 'Step 2: The land was Canaan.', 'Step 3: So the land was Rome.', 'The land was Canaan.', 2],
    ['Which step is the mistake?', 'Step 1: God promised a great name.', 'Step 2: Abraham is honoured by many.', 'Step 3: So his name was forgotten.', 'His name is great.', 2],
  ], ['d', 'e']),
  ...S('ca', CV, 'COVENANT_ABRAHAM', ['CA_MEANING', 'CA_SIGN', 'CA_NAME'], ['A covenant is a binding agreement; circumcision was the sign.', 'Abram was renamed Abraham.'], [
    ['What is a covenant?', 'A binding agreement', 'A free gift', 'A secret', 'A game'],
    ['What was the sign of God\'s covenant with Abraham?', 'Circumcision', 'A rainbow', 'A pillar of fire', 'A burning bush'],
    ['What was Abram renamed?', 'Abraham', 'Isaac', 'Jacob', 'Israel'],
    ['What was Sarai renamed?', 'Sarah', 'Rebecca', 'Rachel', 'Leah'],
    ['Why is a covenant important?', 'It binds the parties to their promises', 'It has no meaning', 'It is a decoration', 'It is a joke'],
  ], [
    ['Two friends sign an agreement to share a farm. What is this like?', 'A covenant', 'A game', 'A gift', 'A secret'],
    ['Every male in Abraham\'s house was marked as part of the covenant. What was the sign?', 'Circumcision', 'A rainbow', 'A pillar of fire', 'A burning bush'],
    ['God changed Abram\'s name to mean "father of many". What was the new name?', 'Abraham', 'Isaac', 'Jacob', 'Israel'],
    ['God promised land and descendants in a covenant with Abraham. What does this show?', 'God binds Himself to His promises', 'God forgets His promises', 'God changes His mind daily', 'God makes no promises'],
    ['A learner says ungodly covenants can be trusted. What should she do?', 'Test them by God\'s word and ask a trusted adult', 'Accept them all', 'Ignore advice', 'Sign at once'],
  ], [
    ['Which step is the mistake?', 'Step 1: Covenants are agreements.', 'Step 2: They bind the parties.', 'Step 3: So a covenant is a free gift.', 'A covenant is a binding agreement.', 2],
    ['Which step is the mistake?', 'Step 1: God gave a sign to Abraham.', 'Step 2: The sign was circumcision.', 'Step 3: So the sign was a rainbow.', 'The rainbow was Noah\'s sign.', 2],
    ['Which step is the mistake?', 'Step 1: God renamed Abram.', 'Step 2: The new name means father of many.', 'Step 3: So he was renamed Isaac.', 'He was renamed Abraham.', 2],
    ['Which step is the mistake?', 'Step 1: God made a covenant.', 'Step 2: He keeps His covenant.', 'Step 3: So covenants mean nothing.', 'Covenants matter.', 2],
    ['Which step is the mistake?', 'Step 1: Some agreements are ungodly.', 'Step 2: They go against God\'s word.', 'Step 3: So we should accept all of them.', 'We should test them by God\'s word.', 2],
  ], ['b', 'd', 'c']),
  ...S('ki', KS, 'KINGSHIP_ISRAEL', ['KI_REASON', 'KI_WARNING', 'KI_NATIONS'], ['Samuel was old and his sons did not follow his ways.', 'Samuel warned a king would take their sons and land.'], [
    ['Why did Israel ask for a king?', 'Samuel was old and his sons did not follow his ways', 'Samuel was young', 'They had a king already', 'They hated Samuel'],
    ['What did Samuel warn a king would do?', 'Take their sons and land', 'Give them gifts', 'Cancel all taxes', 'Build free houses'],
    ['Why did the people want to be like other nations?', 'They wanted a king to lead them', 'They wanted no king', 'They wanted no army', 'They wanted no land'],
    ['Who was the prophet at the time Israel asked for a king?', 'Samuel', 'Moses', 'Elijah', 'Isaiah'],
    ['Who was chosen as the first king of Israel?', 'Saul', 'David', 'Solomon', 'Ahab'],
  ], [
    ['The elders say to Samuel: "You are old, and your sons do not follow you." What do they ask for?', 'A king', 'A new prophet', 'A new temple', 'A new law'],
    ['Samuel warns the people a king will take their fields and sons. Is this for or against kingship?', 'Against kingship', 'For kingship', 'Neither', 'Both'],
    ['The people want to be like other nations. What do they want?', 'A king', 'A temple', 'A war', 'A feast'],
    ['God told Samuel to listen to the people. Who was the first king?', 'Saul', 'David', 'Solomon', 'Ahab'],
    ['A learner says Samuel welcomed a king with joy. What is true?', 'He warned them of the costs', 'She is right', 'He gave a feast', 'He cancelled the king'],
  ], [
    ['Which step is the mistake?', 'Step 1: Samuel was old.', 'Step 2: His sons did not follow his ways.', 'Step 3: So the people were happy with them.', 'The people asked for a king.', 2],
    ['Which step is the mistake?', 'Step 1: Samuel warned the people.', 'Step 2: A king would take their sons.', 'Step 3: So kings only give gifts.', 'A king would take from them.', 2],
    ['Which step is the mistake?', 'Step 1: The nations around had kings.', 'Step 2: Israel wanted one too.', 'Step 3: So Israel wanted no king.', 'Israel wanted a king.', 2],
    ['Which step is the mistake?', 'Step 1: God told Samuel to listen.', 'Step 2: Saul was anointed.', 'Step 3: So David was the first king.', 'Saul was the first king.', 2],
    ['Which step is the mistake?', 'Step 1: Israel asked for a king.', 'Step 2: Samuel prayed.', 'Step 3: So Samuel refused to pray.', 'Samuel prayed.', 2],
  ], ['a', 'b']),
  ...S('sf', KS, 'SAUL_FAILURES', ['SF_SACRIFICE', 'SF_AMALEK', 'SF_RESULT'], ['Saul offered the sacrifice himself and spared the best flocks.', 'God rejected Saul as king.'], [
    ['What did Saul do at Gilgal when Samuel was late?', 'Offered the sacrifice himself', 'Waited quietly for Samuel', 'Went home to his family', 'Sent a gift to the priests'],
    ['What did Saul do with the best Amalekite flocks?', 'Spared them', 'Destroyed them', 'Gave them to Samuel', 'Sold them in Egypt'],
    ['What was the result of Saul\'s disobedience?', 'God rejected him as king', 'God made him greater', 'God rewarded him', 'God ignored it'],
    ['Whom did God choose to replace Saul?', 'David', 'Jonathan', 'Solomon', 'Abner'],
    ['What lesson can a leader learn from Saul?', 'Obey God fully', 'Do what is easy', 'Follow the crowd', 'Ignore God\'s word'],
  ], [
    ['Samuel was late, so Saul offered the sacrifice. What was wrong?', 'It was not his role and he did not wait', 'Nothing was wrong with what he did', 'He was too early in the day', 'He used too little wood for it'],
    ['God said to destroy the Amalekites, but Saul kept the best sheep. What was this?', 'Disobedience', 'Obedience', 'Faith', 'Humility'],
    ['After these failures, Samuel told Saul that God had rejected him as king. What did this show?', 'Disobedience has consequences', 'Disobedience is always rewarded', 'God does not care about leaders', 'Kings can never be changed'],
    ['A school leader wants to learn from Saul. What should she do?', 'Obey and be honest', 'Break the rules', 'Hide mistakes', 'Blame others'],
    ['Saul was jealous of David. What did jealousy do?', 'It harmed Saul\'s leadership', 'It helped his leadership grow', 'It made him very wise', 'It made him very strong'],
  ], [
    ['Which step is the mistake?', 'Step 1: Samuel was late.', 'Step 2: Saul was impatient.', 'Step 3: So Saul did the right thing.', 'Saul disobeyed.', 2],
    ['Which step is the mistake?', 'Step 1: God told Saul to destroy the Amalekites.', 'Step 2: Saul kept the best flocks.', 'Step 3: So he obeyed fully.', 'He disobeyed.', 2],
    ['Which step is the mistake?', 'Step 1: Saul disobeyed.', 'Step 2: God rejected him as king.', 'Step 3: So disobedience has no effect.', 'Disobedience has consequences.', 2],
    ['Which step is the mistake?', 'Step 1: David was chosen.', 'Step 2: He was a shepherd.', 'Step 3: So Saul chose David himself.', 'God chose David.', 2],
    ['Which step is the mistake?', 'Step 1: Leaders are watched.', 'Step 2: They should obey God.', 'Step 3: So leaders may ignore God.', 'Leaders should obey God.', 2],
  ], ['c', 'd']),
  ...S('ba', BA, 'BARTIMAEUS', ['BT_PLACE', 'BT_CRY', 'BT_RESULT'], ['Bartimaeus was a blind beggar at Jericho who called "Son of David".', 'After he was healed he followed Jesus.'], [
    ['Where was Bartimaeus healed?', 'Jericho', 'Jerusalem', 'Nazareth', 'Capernaum'],
    ['What did Bartimaeus call out?', 'Son of David, have mercy on me', 'Teacher, teach me', 'Lord, give me gold', 'Master, send me away'],
    ['What did Bartimaeus do after he was healed?', 'Followed Jesus', 'Went home alone', 'Hid from the crowd', 'Asked for money'],
    ['What did Jesus ask Bartimaeus?', 'What do you want me to do for you', 'Why are you here', 'Who sent you', 'How much money do you have'],
    ['What did Jesus say healed him?', 'His faith', 'The crowd', 'A medicine', 'A pool'],
  ], [
    ['A blind man sat by the roadside begging as Jesus left Jericho. Who was he?', 'Bartimaeus', 'Zacchaeus', 'Lazarus', 'Nicodemus'],
    ['The crowd told Bartimaeus to be quiet but he shouted louder. What did this show?', 'His persistence and faith', 'His anger', 'His pride', 'His fear'],
    ['Jesus asked Bartimaeus what he wanted. What did he ask for?', 'To see', 'Money', 'Food', 'A house'],
    ['After being healed Bartimaeus followed Jesus on the road. What does this show?', 'Gratitude and faith', 'Pride', 'Fear', 'Anger'],
    ['A learner says Bartimaeus was healed in Jerusalem. What is true?', 'He was healed at Jericho', 'She is right', 'He was healed in Nazareth', 'He was healed in Capernaum'],
  ], [
    ['Which step is the mistake?', 'Step 1: Jesus was leaving Jericho.', 'Step 2: A blind man called to Him.', 'Step 3: So the healing was in Jerusalem.', 'The healing was at Jericho.', 2],
    ['Which step is the mistake?', 'Step 1: Bartimaeus cried out.', 'Step 2: He called Jesus "Son of David".', 'Step 3: So he asked Jesus to teach him.', 'He asked for mercy.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus healed him.', 'Step 2: He could see.', 'Step 3: So he went home alone.', 'He followed Jesus.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus said his faith healed him.', 'Step 2: Faith matters.', 'Step 3: So faith has no role.', 'Faith has a role.', 2],
    ['Which step is the mistake?', 'Step 1: The crowd told him to be quiet.', 'Step 2: He did not give up.', 'Step 3: So he stopped shouting.', 'He shouted louder.', 2],
  ], ['a', 'b']),
  ...S('cs', ST, 'CALMING_STORM', ['CS_SLEEP', 'CS_WORDS', 'CS_FAITH'], ['Jesus was asleep in the boat and said "Be still".', 'He asked why they had so little faith.'], [
    ['What was Jesus doing in the storm?', 'Sleeping', 'Steering the boat', 'Fishing', 'Praying on the shore'],
    ['What did Jesus say to the storm?', 'Be still', 'Rise higher', 'Come closer', 'Blow harder'],
    ['What did Jesus ask the disciples?', 'Why they had so little faith', 'Why they were so brave', 'Who sent them', 'Where the fish were'],
    ['On which water did the storm happen?', 'The Sea of Galilee', 'The Red Sea', 'The Dead Sea', 'The River Jordan'],
    ['How did the disciples feel in the storm?', 'Afraid', 'Calm', 'Bored', 'Sleepy'],
  ], [
    ['The waves filled the boat but Jesus slept on a cushion. What does this show?', 'He was at peace', 'He was afraid', 'He was angry', 'He was lost'],
    ['The disciples woke Jesus and He told the wind to be still. What happened?', 'It became calm', 'It got worse', 'It turned to snow', 'It moved the boat away'],
    ['Jesus asked the disciples why they were afraid. What was He teaching?', 'To trust Him', 'To fear storms', 'To avoid boats', 'To give up'],
    ['A youth faces a hard exam and remembers the storm miracle. What can she do?', 'Trust God and keep calm', 'Give up', 'Panic', 'Blame others'],
    ['Which lake did they cross?', 'The Sea of Galilee', 'The Dead Sea', 'The Red Sea', 'The Nile'],
  ], [
    ['Which step is the mistake?', 'Step 1: A storm rose on the lake.', 'Step 2: Jesus slept in the boat.', 'Step 3: So Jesus was steering.', 'Jesus was asleep.', 2],
    ['Which step is the mistake?', 'Step 1: The disciples woke Jesus.', 'Step 2: He spoke to the wind.', 'Step 3: So He said "Rise higher".', 'He said "Be still".', 2],
    ['Which step is the mistake?', 'Step 1: The disciples were afraid.', 'Step 2: Jesus asked about their faith.', 'Step 3: So He praised their great faith.', 'He asked why they had so little faith.', 2],
    ['Which step is the mistake?', 'Step 1: The storm was calmed.', 'Step 2: The disciples were amazed.', 'Step 3: So nothing changed.', 'The sea became calm.', 2],
    ['Which step is the mistake?', 'Step 1: Youths face challenges.', 'Step 2: Jesus can help.', 'Step 3: So they should never pray.', 'They should trust God and pray.', 2],
  ], ['a', 'b']),
  ...S('pl', PA, 'PARALYTIC', ['PL_ROOF', 'PL_SINS', 'PL_OPPOSITION'], ['Four friends lowered him through the roof; Jesus forgave his sins first.', 'The teachers of the law objected.'], [
    ['How did the friends bring the man to Jesus?', 'Through the roof', 'Through the front door', 'By a boat', 'On a donkey'],
    ['What did Jesus first say to the paralytic?', 'Your sins are forgiven', 'Take your mat', 'Go home at once', 'Wash in the pool'],
    ['Who objected to Jesus forgiving sins?', 'The teachers of the law', 'The disciples', 'The crowd', 'The soldiers'],
    ['What did Jesus tell the man to do after healing?', 'Take up his mat and walk', 'Stay on his mat', 'Lie down again', 'Wait in the crowd'],
    ['How many friends carried the paralytic?', 'Four', 'Two', 'Ten', 'One'],
  ], [
    ['The house was packed and the door blocked. What did the friends do?', 'Lowered the man through the roof', 'Went home', 'Pushed the crowd', 'Broke the door'],
    ['Jesus saw the friends\' faith. What did He first say to the man?', 'Your sins are forgiven', 'Take your mat', 'Go home at once', 'Wash in the pool'],
    ['The teachers of the law said "Only God can forgive sins." What were they doing?', 'Objecting to Jesus', 'Praising Jesus', 'Healing the man', 'Leaving quietly'],
    ['Jesus told the man to rise and walk. What did this show?', 'His power over sickness', 'His weakness', 'His anger', 'His fear'],
    ['A learner says the friends only watched. What is true?', 'They carried and lowered him', 'She is right', 'They went away', 'They shouted'],
  ], [
    ['Which step is the mistake?', 'Step 1: The crowd blocked the door.', 'Step 2: The friends found another way.', 'Step 3: So they went through the front door.', 'They went through the roof.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus saw their faith.', 'Step 2: He spoke to the man.', 'Step 3: So He first told him to walk.', 'He first forgave his sins.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus forgave sins.', 'Step 2: Some thought this was wrong.', 'Step 3: So the disciples objected.', 'The teachers of the law objected.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus healed the man.', 'Step 2: The man walked home.', 'Step 3: So Jesus has no power.', 'Jesus has power over sickness.', 2],
    ['Which step is the mistake?', 'Step 1: Four friends helped.', 'Step 2: Their faith mattered.', 'Step 3: So friends cannot help.', 'Friends can help.', 2],
  ], ['c', 'b', 'a']),
];
