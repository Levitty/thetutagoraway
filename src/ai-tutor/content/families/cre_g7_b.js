// ============================================================================
// CRE GRADE 7, B (8 skills): Moses as a leader, prophecies about the Messiah, John the Baptist, the birth and childhood of Jesus,
// worship, and the Church in education and health. Written offline. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a CRE teacher signs them off. Facts are those of the named Bible passages; nothing denominational.
// ============================================================================
import { S } from './cre_g7_lib.js';
const LI = 'THE_BI.LEADERSHIP_IN_ISRAEL.', PM = 'THE_EA.PROPHECIES_ABOUT_THE_MES.', JB = 'THE_EA.JOHN_THE_BAPTIST.', BC = 'THE_EA.THE_BIRTH_AND_CHILDHOOD_.', WO = 'THE_CH.SELECTED_FORMS_OF_WORSHI.', CE = 'THE_CH.ROLE_OF_THE_CHURCH_IN_ED.';

export const FAMILIES = [
  ...S('mp', LI, 'MOSES_PREPARED', ['MP_PALACE', 'MP_BUSH', 'MP_AARON'], ['Moses grew up in Pharaoh\'s palace and was called at the burning bush.', 'Aaron helped Moses speak.'], [
    ['Where did Moses grow up?', 'In Pharaoh\'s palace', 'In a village of Israel', 'In the desert', 'In a temple'],
    ['Where did God call Moses to lead Israel?', 'At the burning bush', 'At the Red Sea', 'At the Jordan', 'In Pharaoh\'s court'],
    ['Who helped Moses speak to Pharaoh?', 'Aaron', 'Joshua', 'Caleb', 'Miriam alone'],
    ['How was baby Moses saved?', 'He was placed in a basket on the river', 'He was hidden in a cave', 'He was sent to the desert', 'He was taken to the Temple'],
    ['Whom did Moses lead out of Egypt?', 'The Israelites', 'The Philistines', 'The Romans', 'The Egyptians'],
  ], [
    ['A learner says Moses grew up in a village. What is true?', 'He grew up in Pharaoh\'s palace', 'He grew up in a village', 'He grew up in a temple', 'He grew up in the desert'],
    ['God spoke to Moses from a bush that burned but was not burnt up. What is this?', 'The burning bush', 'The Red Sea', 'The plague', 'The Passover'],
    ['Moses said he could not speak well. Who did God send to help?', 'Aaron, his brother', 'Joshua, his servant', 'Pharaoh', 'Jethro'],
    ['Moses led the people through the Red Sea. What is this event called?', 'The Exodus', 'The Exile', 'The Passover only', 'The Plague'],
    ['Moses\' mother put him in a basket. Who found him?', 'Pharaoh\'s daughter', 'Pharaoh\'s son', 'Aaron', 'Joshua'],
  ], [
    ['Which step is the mistake?', 'Step 1: Moses was saved as a baby.', 'Step 2: He was brought up in the palace.', 'Step 3: So he grew up in a village of Israel.', 'He grew up in Pharaoh\'s palace.', 2],
    ['Which step is the mistake?', 'Step 1: God called Moses.', 'Step 2: The call came from a burning bush.', 'Step 3: So God called him at the Red Sea.', 'God called him at the burning bush.', 2],
    ['Which step is the mistake?', 'Step 1: Moses felt he could not speak well.', 'Step 2: God sent a helper.', 'Step 3: So Joshua spoke to Pharaoh.', 'Aaron helped Moses speak.', 2],
    ['Which step is the mistake?', 'Step 1: Moses was prepared by God.', 'Step 2: He was taught in the palace.', 'Step 3: So he needed no help from God.', 'God prepared and helped him.', 2],
    ['Which step is the mistake?', 'Step 1: The Israelites were slaves.', 'Step 2: Moses led them out of Egypt.', 'Step 3: So the Egyptians led them out.', 'Moses led them out.', 2],
  ], ['a', 'b']),
  ...S('mq', LI, 'MOSES_QUALITIES', ['MQ_PRIDE', 'MQ_LEADER', 'MQ_FEAR'], ['Moses was humble and obeyed God.', 'A good leader is honest and fair.'], [
    ['Which quality did Moses show?', 'Humility and obedience to God', 'Pride', 'Greed', 'Laziness'],
    ['What should a good leader be?', 'Honest and fair', 'Dishonest to win', 'Selfish', 'Careless'],
    ['Who helped Moses lead the people?', 'God and people such as Aaron', 'Nobody helped him', 'Only soldiers', 'Only Pharaoh'],
    ['Which quality helps a leader to lead well?', 'Patience', 'Anger', 'Laziness', 'Pride'],
    ['What did Moses do when the people were in trouble?', 'He prayed to God for them', 'He left them', 'He hid from them', 'He blamed them only'],
  ], [
    ['A class captain shares equally and listens. Which quality of Moses is this?', 'Fairness and care', 'Pride', 'Selfishness', 'Anger'],
    ['A leader takes money meant for the school. What is this?', 'Dishonesty', 'Integrity', 'Humility', 'Obedience'],
    ['Moses obeyed God even when it was hard. Which quality is this?', 'Obedience', 'Pride', 'Laziness', 'Greed'],
    ['A learner says leaders never need help. What can you say?', 'Moses was helped by God and others', 'He is right', 'Moses led alone', 'Leaders must hide'],
    ['Which leader should we choose, as Moses teaches?', 'One of integrity', 'One who promises gifts to cheat', 'One who is dishonest', 'One who shouts the loudest'],
  ], [
    ['Which step is the mistake?', 'Step 1: Moses led the Israelites.', 'Step 2: He was humble.', 'Step 3: So a good leader is proud.', 'A good leader is humble.', 2],
    ['Which step is the mistake?', 'Step 1: A leader serves people.', 'Step 2: A leader should be honest.', 'Step 3: So a leader may cheat to win.', 'A leader should not cheat.', 2],
    ['Which step is the mistake?', 'Step 1: Moses prayed for the people.', 'Step 2: Prayer was part of his leading.', 'Step 3: So Moses never prayed.', 'Moses prayed.', 2],
    ['Which step is the mistake?', 'Step 1: Moses had a helper, Aaron.', 'Step 2: Others also helped.', 'Step 3: So Moses led entirely alone.', 'God and others helped him.', 2],
    ['Which step is the mistake?', 'Step 1: We choose leaders.', 'Step 2: We should choose honest ones.', 'Step 3: So we choose those who give us gifts to vote.', 'We choose leaders of integrity.', 2],
  ], ['c', 'c']),
  ...S('ms', PM, 'MESSIAH_PROPHECY', ['MS_BETHLEHEM', 'MS_VIRGIN', 'MS_FULFIL'], ['Micah 5:2 names Bethlehem; Isaiah 7:14 speaks of a virgin and Immanuel.', 'Fulfilled means came true.'], [
    ['Which town did Micah 5:2 name as the Messiah\'s birthplace?', 'Bethlehem', 'Nazareth', 'Jerusalem', 'Capernaum'],
    ['Which prophet said a virgin would bear a son called Immanuel?', 'Isaiah', 'Moses', 'Elijah', 'Jonah'],
    ['What does "fulfilled" mean?', 'Came true', 'Was forgotten', 'Was lost', 'Was denied'],
    ['What does Immanuel mean?', 'God with us', 'God above us', 'God far away', 'God forgotten'],
    ['What is a prophet?', 'A messenger who speaks for God', 'A king of Israel', 'A soldier', 'A merchant'],
  ], [
    ['A learner says Jesus was born in Bethlehem. Which prophecy came true?', 'Micah 5:2', 'Exodus 3:2', 'Psalm 23:1', 'Jonah 1:1'],
    ['Isaiah said a virgin would bear a son. Which child do Christians say this is?', 'Jesus', 'John', 'Moses', 'Samuel'],
    ['A teacher says the prophecy was fulfilled. What does she mean?', 'It came true', 'It was forgotten', 'It was changed', 'It was denied'],
    ['Which name does Isaiah 9:6 give the Messiah?', 'Prince of Peace', 'King of War', 'Lord of Wealth', 'Judge of Rivers'],
    ['The Old Testament prophets spoke about whom?', 'The coming Messiah', 'The Roman emperor', 'The kings of Egypt', 'Their own families'],
  ], [
    ['Which step is the mistake?', 'Step 1: Micah spoke about the Messiah.', 'Step 2: He named a town.', 'Step 3: So the town was Nazareth.', 'Micah named Bethlehem.', 2],
    ['Which step is the mistake?', 'Step 1: Isaiah spoke of a virgin\'s son.', 'Step 2: He was called Immanuel.', 'Step 3: So Moses said this.', 'Isaiah said this.', 2],
    ['Which step is the mistake?', 'Step 1: A prophecy is spoken before.', 'Step 2: It is fulfilled when it comes true.', 'Step 3: So a fulfilled prophecy is forgotten.', 'Fulfilled means came true.', 2],
    ['Which step is the mistake?', 'Step 1: Immanuel is a name.', 'Step 2: It means God with us.', 'Step 3: So it means God is far away.', 'It means God with us.', 2],
    ['Which step is the mistake?', 'Step 1: Prophets spoke for God.', 'Step 2: Some foretold the Messiah.', 'Step 3: So prophets were Roman soldiers.', 'Prophets spoke for God.', 2],
  ], ['a', 'b']),
  ...S('jb', JB, 'JOHN_BAPTIST', ['JB_PARENTS', 'JB_ROLE', 'JB_MESSAGE'], ['John was the son of Zechariah and Elizabeth.', 'John prepared the way for the Messiah.'], [
    ['Who were the parents of John the Baptist?', 'Zechariah and Elizabeth', 'Joseph and Mary', 'Abraham and Sarah', 'Isaac and Rebecca'],
    ['What was John\'s role?', 'To prepare the way for the Messiah', 'To be the Messiah', 'To be a king', 'To be a judge'],
    ['What did John tell people to do?', 'Repent and share', 'Seek wealth', 'Fight each other', 'Leave their homes'],
    ['Which angel told Zechariah about John\'s birth?', 'Gabriel', 'Michael', 'Raphael', 'Uriel'],
    ['What did John tell tax collectors?', 'Collect no more than is due', 'Take as much as possible', 'Hide the money', 'Stop working'],
  ], [
    ['Gabriel told Zechariah that Elizabeth would have a son. What was he named?', 'John', 'Jesus', 'Peter', 'James'],
    ['A learner says John was the Messiah. What is true?', 'John prepared the way for the Messiah', 'He was the Messiah who was promised', 'He was a king who ruled in Judea', 'He was a soldier in the Roman army'],
    ['John told those with two coats to do what?', 'Share with those who have none', 'Keep both coats for themselves', 'Sell them for a good price', 'Hide them from the poor'],
    ['John told soldiers not to do what?', 'Take by force or accuse falsely', 'Keep their clothes and their food', 'Share food with the poor people', 'Pray before every battle'],
    ['John\'s message was to turn from sin. What is this called?', 'Repentance', 'Revenge', 'Riches', 'Rest'],
  ], [
    ['Which step is the mistake?', 'Step 1: Gabriel told Zechariah about a son.', 'Step 2: His wife was Elizabeth.', 'Step 3: So John\'s parents were Joseph and Mary.', 'His parents were Zechariah and Elizabeth.', 2],
    ['Which step is the mistake?', 'Step 1: John preached by the Jordan.', 'Step 2: He called people to repent.', 'Step 3: So John was the Messiah.', 'John prepared the way for the Messiah.', 2],
    ['Which step is the mistake?', 'Step 1: John taught people to share.', 'Step 2: He taught tax collectors to be fair.', 'Step 3: So he taught people to take what they could.', 'He taught fairness and sharing.', 2],
    ['Which step is the mistake?', 'Step 1: John baptised people.', 'Step 2: His baptism was a sign of repentance.', 'Step 3: So baptism meant nothing.', 'It was a sign of repentance.', 2],
    ['Which step is the mistake?', 'Step 1: Elizabeth was old.', 'Step 2: God gave her a son.', 'Step 3: So John was born by chance.', 'God gave her a son.', 2],
  ], ['a', 'b', 'd']),
  ...S('jr', BC, 'JESUS_BIRTH', ['JBR_PLACE', 'JBR_ANGEL', 'JBR_DEDICATION'], ['Jesus was born in Bethlehem; Gabriel told Mary.', 'Jesus was dedicated at the Temple in Jerusalem.'], [
    ['Where was Jesus born?', 'Bethlehem', 'Nazareth', 'Jerusalem', 'Egypt'],
    ['Which angel told Mary she would bear Jesus?', 'Gabriel', 'Michael', 'Raphael', 'Uriel'],
    ['Where was baby Jesus dedicated?', 'In the Temple at Jerusalem', 'In the River Jordan', 'In Nazareth', 'In Egypt'],
    ['Where was baby Jesus laid after birth?', 'In a manger', 'In a palace', 'In a temple', 'In a boat'],
    ['Who first heard the angels\' message about Jesus\' birth?', 'Shepherds', 'Kings', 'Soldiers', 'Priests'],
  ], [
    ['Mary and Joseph travelled to Bethlehem. Why did Jesus end up born there?', 'They went there for the census', 'They lived there always', 'They wanted a holiday', 'They fled from soldiers'],
    ['An angel told Mary she would have a son. Who was the angel?', 'Gabriel', 'Michael', 'Raphael', 'Uriel'],
    ['Simeon and Anna blessed baby Jesus. Where were they?', 'In the Temple', 'In Bethlehem', 'In Egypt', 'In Nazareth'],
    ['Jesus\' parents dedicated Him to God. What do some churches do today?', 'Dedicate babies to God', 'Ignore babies', 'Sell babies', 'Hide babies'],
    ['Which group visited baby Jesus in the manger?', 'Shepherds', 'Fishermen', 'Soldiers', 'Merchants'],
  ], [
    ['Which step is the mistake?', 'Step 1: Jesus was born in a small town.', 'Step 2: The town was Bethlehem.', 'Step 3: So He was born in Nazareth.', 'He was born in Bethlehem.', 2],
    ['Which step is the mistake?', 'Step 1: An angel visited Mary.', 'Step 2: The angel was Gabriel.', 'Step 3: So it was Michael.', 'It was Gabriel.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus was dedicated as a baby.', 'Step 2: It was done at the Temple.', 'Step 3: So it was done in the River Jordan.', 'It was done at the Temple.', 2],
    ['Which step is the mistake?', 'Step 1: There was no room at the inn.', 'Step 2: Jesus was laid in a manger.', 'Step 3: So He was laid in a palace bed.', 'He was laid in a manger.', 2],
    ['Which step is the mistake?', 'Step 1: Angels announced the birth.', 'Step 2: Shepherds heard first.', 'Step 3: So kings heard first.', 'Shepherds heard first.', 2],
  ], ['a', 'b', 'c']),
  ...S('jt', BC, 'JESUS_TEMPLE', ['JT_AGE', 'JT_DAYS', 'JT_HOME'], ['Jesus was twelve; His parents found Him after three days.', 'He went home and obeyed His parents.'], [
    ['How many years old was Jesus when He stayed in the Temple?', 'Twelve years', 'Six years', 'Thirty years', 'Eight years'],
    ['After how many days did His parents find Him?', 'Three days', 'One day', 'Seven days', 'Ten days'],
    ['What did Jesus do after His parents found Him?', 'Went home and obeyed them', 'Stayed in the Temple', 'Ran away again', 'Became a priest'],
    ['Whom was Jesus listening to and asking questions?', 'The teachers in the Temple', 'The soldiers', 'The merchants', 'The shepherds'],
    ['What did Jesus say He must be about?', 'His Father\'s house', 'His own house', 'The market', 'The farm'],
  ], [
    ['At which feast did Jesus\' family go to Jerusalem?', 'The Passover', 'The harvest', 'The wedding', 'The market day'],
    ['Where did Mary and Joseph find Jesus?', 'In the Temple among the teachers', 'On the road', 'At the market', 'At home'],
    ['Jesus obeyed His parents after this. What value does this teach?', 'Obedience', 'Pride', 'Disobedience', 'Laziness'],
    ['The teachers were amazed. At what?', 'His understanding and answers', 'His clothes', 'His singing', 'His running'],
    ['Why were His parents worried?', 'They could not find Him', 'He was sick', 'He was rich', 'He was late for school'],
  ], [
    ['Which step is the mistake?', 'Step 1: Jesus went to Jerusalem at twelve.', 'Step 2: He stayed in the Temple.', 'Step 3: So He was six years old.', 'He was twelve.', 2],
    ['Which step is the mistake?', 'Step 1: His parents looked for Him.', 'Step 2: They found Him in the Temple.', 'Step 3: So they found Him after one day.', 'They found Him after three days.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus was found.', 'Step 2: He went home with them.', 'Step 3: So He disobeyed them.', 'He obeyed them.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus listened to the teachers.', 'Step 2: He asked questions.', 'Step 3: So He knew nothing at all.', 'The teachers were amazed at His understanding.', 2],
    ['Which step is the mistake?', 'Step 1: Jesus said He must be in His Father\'s house.', 'Step 2: This shows His closeness to God.', 'Step 3: So He did not care about His parents.', 'He went home and obeyed them.', 2],
  ], ['d', 'e']),
  ...S('wf', WO, 'WORSHIP_FORMS', ['WF_FASTING', 'WF_PRAYER', 'WF_THANKS'], ['Jesus taught to pray and fast without showing off.', 'Praise and thanksgiving honour God.'], [
    ['How should one fast, as Jesus taught?', 'Quietly, without showing off', 'Showing everyone how hungry he is', 'Complaining loudly all day long', 'Only in public where all can see'],
    ['What is prayer?', 'Talking with God', 'Only asking for things', 'Only reading', 'Only singing'],
    ['What is thanksgiving?', 'Thanking God for what He has done', 'Complaining to God about our troubles', 'Asking God for more and more things', 'Hiding from God when we do wrong'],
    ['What is fasting?', 'Going without food to draw near to God', 'Eating more than usual at every meal', 'Sleeping late on a day of rest', 'Buying food for the whole village'],
    ['Which is a form of worship?', 'Praise and prayer', 'Cheating', 'Gossip', 'Fighting'],
  ], [
    ['A boy fasts and tells everyone to be praised. What did Jesus teach?', 'To fast quietly', 'To announce it', 'To do it for praise', 'To stop fasting'],
    ['Wanjiru talks with God every morning. What is this?', 'Prayer', 'Fasting', 'Dancing', 'Trading'],
    ['A choir thanks God for a good harvest. What is this?', 'Thanksgiving', 'Complaining', 'Fasting', 'Gossip'],
    ['Jesus taught His followers the Lord\'s Prayer. Where is it?', 'Matthew 6:9-13', 'Genesis 1:1', 'Psalm 23', 'Exodus 20'],
    ['A family sings praise at home. What are they doing?', 'Worshipping God', 'Wasting time', 'Fasting', 'Trading'],
  ], [
    ['Which step is the mistake?', 'Step 1: Jesus taught about fasting.', 'Step 2: He said not to look gloomy.', 'Step 3: So we must show everyone we fast.', 'We fast quietly.', 2],
    ['Which step is the mistake?', 'Step 1: Prayer is speaking to God.', 'Step 2: It includes thanks and requests.', 'Step 3: So prayer is only asking for things.', 'Prayer is talking with God.', 2],
    ['Which step is the mistake?', 'Step 1: Thanksgiving honours God.', 'Step 2: It remembers what He has done.', 'Step 3: So thanksgiving is complaining.', 'Thanksgiving is thanking God.', 2],
    ['Which step is the mistake?', 'Step 1: Fasting is going without food.', 'Step 2: It is done to draw near to God.', 'Step 3: So fasting means eating more.', 'Fasting means going without food for a time.', 2],
    ['Which step is the mistake?', 'Step 1: Worship takes many forms.', 'Step 2: Praise and prayer are two.', 'Step 3: So worship is only for church buildings.', 'Worship can be at home, church and school.', 2],
  ], ['a', 'b', 'c']),
  ...S('cs', CE, 'CHURCH_SERVICE', ['CS_SCHOOLS', 'CS_BARRIER', 'CS_SOLUTION'], ['Churches started many schools and hospitals in Kenya.', 'Barriers include poverty and long distances.'], [
    ['What did the Church start in Kenya?', 'Many schools and hospitals', 'No schools or hospitals', 'Only banks', 'Only shops'],
    ['Which is a barrier to mission work?', 'Poverty and long distances', 'Enough workers for every place', 'Good roads leading to every village', 'Plenty of money for every need'],
    ['Which is a way to answer the barriers?', 'Training workers and working together', 'Giving up the work because it is hard', 'Fighting each other over who leads', 'Closing the church for good'],
    ['Which helps the Church to serve the sick?', 'Running clinics and hospitals', 'Closing the clinics in the villages', 'Refusing to visit the sick people', 'Ignoring the sick in the community'],
    ['Why did missionaries start schools?', 'To teach people to read and know God', 'To keep people ignorant of the world', 'To make money from the village only', 'To close the villages for good'],
  ], [
    ['A church builds a school in a village. What is this?', 'Service in education', 'Wasting money', 'Harming the village', 'Ignoring the village'],
    ['A church clinic treats the poor free. What is this?', 'Service in health', 'Business', 'Politics', 'Sport'],
    ['A mission station is far and roads are bad. What barrier is this?', 'Long distances', 'Too many workers', 'Too much money', 'Good roads'],
    ['A church lacks workers. What can help?', 'Training and sending more workers', 'Closing the work', 'Waiting alone', 'Blaming others'],
    ['Different churches work together to build a hospital. What is this?', 'A good answer to barriers', 'A mistake', 'A quarrel', 'A waste'],
  ], [
    ['Which step is the mistake?', 'Step 1: Missionaries came to Kenya.', 'Step 2: They started schools.', 'Step 3: So churches started no schools.', 'Churches started many schools.', 2],
    ['Which step is the mistake?', 'Step 1: Mission work meets barriers.', 'Step 2: Poverty is one.', 'Step 3: So poverty helps mission work.', 'Poverty is a barrier.', 2],
    ['Which step is the mistake?', 'Step 1: Barriers can be answered.', 'Step 2: Training workers helps.', 'Step 3: So the work should be given up.', 'Training and working together help.', 2],
    ['Which step is the mistake?', 'Step 1: Churches run clinics.', 'Step 2: They treat the sick.', 'Step 3: So they avoid the sick.', 'They care for the sick.', 2],
    ['Which step is the mistake?', 'Step 1: Education helps people.', 'Step 2: Churches helped educate.', 'Step 3: So churches kept people from learning.', 'Churches helped people learn.', 2],
  ], ['a', 'b', 'c']),
];
