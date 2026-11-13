// ============================================================================
// GRADE 8 SOCIAL STUDIES, PART A: self, community service, human origin and early civilisation (6 skills).
// Written offline from the KICD design through the curriculum map (curriculum/social_studies/g8.json). Every wrong answer names the
// library misconception it reveals. Options of each question are about the same length so the right answer is never the longest.
// Origin stories and the accounts of early humans and peoples are told as commonly taught and stay "to confirm by a teacher".
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g8_lib.js';

const SI = 'SOCIAL.SELF_IMPROVEMENT.', SA = 'SOCIAL.SELF_ESTEEM_ASSESSMENT.', CS = 'COMMUN.COMMUNITY_SERVICE_LEARNI.', SC = 'PEOPLE.SCIENTIFIC_THEORY_ABOUT_.', EC = 'PEOPLE.EARLY_CIVILISATION.';

export const FAMILIES = [
  // ---------------------------------------------------------------- PERSONALITY
  fam('si.pt.trait', `${SI}PERSONALITY`, 'direct', 1, choose([
    C('G8_PT_TRAIT_FEELING', 'Which is a personality trait?', 'Being patient', ['Feeling angry today', 'Feeling tired now', 'Feeling hungry at noon'], 'A trait is how a person usually is. A feeling comes and goes.'),
    C('G8_PT_TRAIT_FEELING', 'Wanjiru always helps a classmate who is stuck. Which trait does she show?', 'Kindness', ['A bad mood', 'Tiredness', 'Surprise'], 'Helping others again and again shows the trait of kindness.'),
    C('G8_PT_TRAIT_FEELING', 'Otieno finishes his work every day, even when it is hard. Which trait is this?', 'Perseverance', ['Boredom', 'Anger', 'Hunger'], 'Finishing hard work shows perseverance, a trait.'),
    C('G8_PT_TRAIT_FIXED', 'Can a person change an unhelpful trait such as impatience?', 'Yes, with effort and practice', ['No, traits never change', 'No, they are fixed at birth', 'Only adults can change them'], 'Traits can grow and change with effort and good habits.'),
    C('G8_PT_VALUE_TRAIT', 'How do values shape a person\'s traits?', 'They guide actions, and repeated actions become traits', ['They do not affect traits', 'They only matter at school', 'They only matter to adults'], 'Values guide actions, and repeated actions shape traits.'),
  ], { h: ['A trait is how a person usually is.', 'A feeling is for the moment.'], s1: 'Think about what the person does again and again.' })),
  fam('si.pt.value', `${SI}PERSONALITY`, 'why', 2, choose([
    C('G8_PT_VALUE_TRAIT', 'Juma values honesty. Which trait is he most likely to grow?', 'Being truthful', ['Being careless', 'Being greedy', 'Being rude'], 'A person who values honesty grows the trait of being truthful.'),
    C('G8_PT_TRAIT_FEELING', 'Baraka is shy only on the first day at a new school. What is shyness here?', 'A feeling of that day', ['A fixed trait for life', 'A value', 'A talent'], 'Shy for a short time is a feeling. A trait is how a person usually is.'),
    C('G8_PT_TRAIT_FIXED', 'Achieng says, "I am impatient and I can never change." What is a good reply?', 'You can practise waiting and grow more patient', ['You are right, it is fixed', 'Nobody can change', 'Only teachers can change'], 'Traits can change with practice.'),
    C('G8_PT_VALUE_TRAIT', 'Which value helps a person grow the trait of being hardworking?', 'Responsibility', ['Laziness', 'Carelessness', 'Boasting'], 'Responsibility pushes a person to work hard.'),
    C('G8_PT_TRAIT_FEELING', 'Which sentence describes a trait?', 'Mwende is generous with her time', ['Mwende is cross this afternoon', 'Mwende is sleepy now', 'Mwende is cold today'], 'Generous is how Mwende usually is.'),
  ], { h: ['A value guides actions; actions shape traits.', 'Traits can change.'], s1: 'Think about what is usual and what is for the moment.' })),
  fam('si.pt.spot', `${SI}PERSONALITY`, 'spot', 3, spot([
    S('Baraka explains traits.', ['A trait is how a person usually is.', '!A feeling is the same as a trait.', 'A feeling comes and goes.'], 'A feeling is for the moment. A trait is how a person usually is.', 'G8_PT_TRAIT_FEELING'),
    S('Wanjiru explains change.', ['Traits are shaped by values.', '!Traits can never change.', 'Practice helps a person grow.'], 'Traits can change with effort.', 'G8_PT_TRAIT_FIXED'),
    S('Kamau explains values.', ['Honesty is a value.', '!Values have no effect on traits.', 'Values guide actions.'], 'Values guide actions and so shape traits.', 'G8_PT_VALUE_TRAIT'),
    S('Mwende explains personality.', ['Patience is a trait.', '!Feeling angry today is a trait.', 'Kindness is a trait.'], 'Feeling angry today is a feeling.', 'G8_PT_TRAIT_FEELING'),
    S('Nekesa explains habits.', ['Repeated actions become habits.', 'Habits shape traits.', '!Traits are fixed at birth.'], 'Habits and values can change traits.', 'G8_PT_TRAIT_FIXED'),
  ], { h: ['Check each step: a trait is how a person usually is.', 'Values and habits shape traits.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SELF_ESTEEM
  fam('sa.se.what', `${SA}SELF_ESTEEM`, 'direct', 1, choose([
    C('G8_SA_PRIDE', 'What is self-esteem?', 'How you value and respect yourself', ['Boasting about yourself', 'Being better than others', 'Wearing nice clothes'], 'Self-esteem is how you value yourself. It does not mean boasting.'),
    C('G8_SA_PRIDE', 'Which is a sign of healthy self-esteem?', 'Trying new things and accepting mistakes', ['Boasting about every win', 'Looking down on others', 'Never trying in case of failure'], 'Healthy self-esteem tries new things and learns from mistakes.'),
    C('G8_SA_LOW_NO_EFFECT', 'What can low self-esteem lead to?', 'Giving up easily and staying away from others', ['Nothing at all, it has no real effect', 'Better marks at once without any effort', 'More friends at once and no worries'], 'Low self-esteem can lead to giving up and staying away.'),
    C('G8_SA_HIGH_GOOD', 'A boy brags that he is better than everyone. What is this?', 'Inflated self-esteem', ['Healthy self-esteem', 'Low self-esteem and shyness', 'No self-esteem'], 'Looking down on others is inflated self-esteem.'),
    C('G8_SA_LOW_NO_EFFECT', 'A girl says, "I am no good at anything," and stops trying. What is this?', 'Low self-esteem', ['Healthy self-esteem', 'Inflated self-esteem and pride', 'A talent'], 'Giving up because of a poor opinion of oneself is low self-esteem.'),
  ], { h: ['Self-esteem is how you value yourself.', 'Boasting is not healthy self-esteem.'], s1: 'Think about how the person treats himself and others.' })),
  fam('sa.se.effects', `${SA}SELF_ESTEEM`, 'why', 2, choose([
    C('G8_SA_LOW_NO_EFFECT', 'Which effect can low self-esteem have in daily social life?', 'A child avoids joining games and groups', ['A child leads every group', 'A child enjoys every contest', 'A child never worries'], 'Low self-esteem makes a child avoid others.'),
    C('G8_SA_HIGH_GOOD', 'Which effect can inflated self-esteem have?', 'A child refuses to listen and looks down on others', ['A child respects every classmate', 'A child asks for help', 'A child accepts mistakes'], 'Inflated self-esteem leads to arrogance.'),
    C('G8_SA_PRIDE', 'Which helps a child build healthy self-esteem?', 'Setting small goals and being proud of progress', ['Comparing yourself with the best pupil each day', 'Boasting to your friends about every win', 'Avoiding all challenges so you never fail'], 'Small goals and progress build healthy self-esteem.'),
    C('G8_SA_LOW_NO_EFFECT', 'How can low self-esteem affect school work?', 'A child may give up before trying', ['A child will always top the class', 'A child will work faster', 'A child will not care at all'], 'Low self-esteem makes a child give up early.'),
    C('G8_SA_HIGH_GOOD', 'Mwende says, "I never make mistakes, so I need no help." What is this?', 'Inflated self-esteem', ['Healthy self-esteem', 'Low self-esteem and shyness', 'Kindness'], 'Refusing help because of pride is inflated self-esteem.'),
  ], { h: ['Low self-esteem makes a child withdraw; inflated self-esteem makes a child boast.', 'Healthy self-esteem respects self and others.'], s1: 'Think about how the child behaves.' })),
  fam('sa.se.spot', `${SA}SELF_ESTEEM`, 'spot', 3, spot([
    S('Baraka explains self-esteem.', ['Self-esteem is how you value yourself.', '!Self-esteem means boasting.', 'Healthy self-esteem respects others.'], 'Self-esteem is valuing yourself. It does not mean boasting.', 'G8_SA_PRIDE'),
    S('Wanjiru explains low self-esteem.', ['It can make a child give up.', '!It has no effect on daily life.', 'It can make a child avoid others.'], 'Low self-esteem has real effects.', 'G8_SA_LOW_NO_EFFECT'),
    S('Kamau explains too much self-esteem.', ['A child may look down on others.', '!This is always good.', 'It can lead to arrogance.'], 'Inflated self-esteem is not always good.', 'G8_SA_HIGH_GOOD'),
    S('Mwende explains healthy esteem.', ['A child accepts mistakes.', 'A child tries new things.', '!A child brags about every win.'], 'Healthy self-esteem does not brag.', 'G8_SA_PRIDE'),
    S('Nekesa explains effects.', ['Low esteem can make a child quiet.', '!It never affects friends.', 'It can make a child give up.'], 'It can affect friends and school work.', 'G8_SA_LOW_NO_EFFECT'),
  ], { h: ['Check each step: healthy, low and inflated self-esteem.', 'Boasting is not healthy self-esteem.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- CSL_STEPS
  fam('cs.st.order', `${CS}CSL_STEPS`, 'steps', 1, choose([
    C('G8_CS_ORDER', 'What comes first in a community service project?', 'Identify a problem in the community', ['Carry out the work', 'Write the report', 'Collect the thanks'], 'First identify the problem.'),
    C('G8_CS_ORDER', 'Which step comes just after identifying the problem?', 'Design a solution', ['Write the report', 'Celebrate the end', 'Carry out the plan'], 'After the problem, design a solution.'),
    C('G8_CS_SKIP_PLAN', 'What should be done before carrying out the solution?', 'Plan who does what, with what, and when', ['Nothing, start at once', 'Write the report', 'Choose a new problem'], 'A plan says who, what, when and with what.'),
    C('G8_CS_REPORT_END', 'When is the project report written?', 'After the work is done', ['Before the work begins', 'While choosing the problem', 'Before the plan'], 'A report tells what was done, so it comes at the end.'),
    C('G8_CS_ORDER', 'Which is the correct order?', 'Identify, design, plan, carry out, report', ['Plan, report, identify, design, carry out', 'Carry out, plan, design, identify, report', 'Report, identify, carry out, plan, design'], 'The steps run: identify, design, plan, carry out, report.'),
  ], { h: ['Put the steps on cards in order.', 'The report comes last.'], s1: 'Think of what must happen first.' })),
  fam('cs.st.use', `${CS}CSL_STEPS`, 'word', 2, choose([
    C('G8_CS_ORDER', 'The class sees litter around the school gate. Which step is this?', 'Identifying a problem', ['Writing the report', 'Carrying out the plan', 'Designing a solution'], 'Seeing a gap or problem is the first step.'),
    C('G8_CS_ORDER', 'The class decides to put up bins and a rota for clearing. Which step is this?', 'Designing a solution', ['Identifying the problem', 'Reporting', 'Celebrating'], 'Deciding what to do is designing a solution.'),
    C('G8_CS_SKIP_PLAN', 'The class lists who brings bags, who sweeps and which day. Which step is this?', 'Planning the project', ['Reporting', 'Identifying the problem', 'Carrying out'], 'A list of who, what and when is a plan.'),
    C('G8_CS_REPORT_END', 'The class writes what they did, what they learned and the results. Which step is this?', 'Reporting on the project', ['Identifying the problem', 'Designing the solution', 'Planning'], 'This is the report, written at the end.'),
    C('G8_CS_ORDER', 'The class sweeps and puts up the bins as planned. Which step is this?', 'Carrying out the plan', ['Identifying the problem', 'Reporting', 'Designing a solution'], 'Doing the work is carrying out the plan.'),
  ], { h: ['Match what the class does to the step.', 'The order is identify, design, plan, carry out, report.'], s1: 'Think about what the class is doing in the story.' })),
  fam('cs.st.spot', `${CS}CSL_STEPS`, 'spot', 3, spot([
    S('Baraka explains the steps.', ['First the class finds a problem.', 'Then it designs a solution.', '!Then it writes the report.'], 'A plan and the work come before the report.', 'G8_CS_ORDER'),
    S('Wanjiru explains planning.', ['A plan says who does what.', '!A plan is not needed.', 'A plan says when the work is done.'], 'A plan is needed so the project does not fall apart.', 'G8_CS_SKIP_PLAN'),
    S('Kamau explains the report.', ['A report tells what was done.', '!It is written before the work.', 'It tells what was learned.'], 'The report is written after the work.', 'G8_CS_REPORT_END'),
    S('Mwende explains the order.', ['Identify the problem.', '!Carry out the plan before designing.', 'Report at the end.'], 'The solution is designed and planned before the work.', 'G8_CS_ORDER'),
    S('Nekesa explains planning again.', ['The team lists tasks.', '!The team starts without a list.', 'The team picks a date.'], 'A plan lists tasks and dates.', 'G8_CS_SKIP_PLAN'),
  ], { h: ['Check each step: identify, design, plan, carry out, report.', 'A plan comes before the work.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- EVOLUTION
  fam('sc.ev.order', `${SC}EVOLUTION`, 'direct', 1, choose([
    C('G8_EV_ORDER', 'Which early human came first?', 'Australopithecus', ['Homo sapiens', 'Homo erectus', 'Homo habilis'], 'The order is Australopithecus, Homo habilis, Homo erectus, Homo sapiens.'),
    C('G8_EV_ORDER', 'Which early human came last?', 'Homo sapiens', ['Australopithecus', 'Homo habilis', 'Homo erectus'], 'Homo sapiens, modern humans, came last.'),
    C('G8_EV_MONKEY', 'What does the scientific theory say about human origin?', 'Humans and apes share earlier ancestors and changed over millions of years', ['Humans came from the monkeys we see today', 'Humans appeared suddenly in one day', 'Humans have never changed'], 'Humans did not come from living monkeys.'),
    C('G8_EV_FAST', 'How long did the changes in early humans take?', 'Millions of years', ['A few hundred years', 'One year', 'A few weeks'], 'The changes took millions of years.'),
    C('G8_EV_ORDER', 'Which is a change in early humans over time?', 'Walking upright and a bigger brain', ['Learning to fly', 'Growing a tail', 'Living only in water'], 'Early humans came to walk upright and grew bigger brains.'),
  ], { h: ['The order is Australopithecus, Homo habilis, Homo erectus, Homo sapiens.', 'Humans did not come from monkeys alive today.'], s1: 'Put the names on a timeline.' })),
  fam('sc.ev.evidence', `${SC}EVOLUTION`, 'why', 2, choose([
    C('G8_EV_MONKEY', 'What evidence supports the theory?', 'Fossils and tools found in rocks', ['Stories told at home', 'Old songs only', 'Pictures in textbooks only'], 'Scientists study fossils and tools.'),
    C('G8_EV_FAST', 'Why are fossils found in old layers of rock?', 'Remains were buried over a very long time', ['They were buried only last year by workers', 'They fell from the sky long ago', 'They were made by machines in a factory'], 'Layers build up slowly over a very long time.'),
    C('G8_EV_ORDER', 'Which change helped early humans use their hands?', 'Walking upright', ['Growing fur', 'Living in trees only', 'Swimming'], 'Walking upright freed the hands to use tools.'),
    C('G8_EV_MONKEY', 'A classmate says humans came from monkeys at the zoo. What is the correct reply?', 'Humans and apes share distant ancestors', ['Yes, from the very monkeys at the zoo', 'Yes, from monkeys of the last century', 'Humans came from birds that learned to walk'], 'Humans did not come from living monkeys.'),
    C('G8_EV_FAST', 'How do scientists know the age of a fossil?', 'By testing the rock and the fossil with scientific methods', ['By asking an elder what he thinks', 'By looking at its colour and shine only', 'By guessing from its size and weight'], 'Scientists use dating tests on rocks and fossils.'),
  ], { h: ['Evidence is fossils and tools.', 'The changes took millions of years.'], s1: 'Think about what scientists study.' })),
  fam('sc.ev.spot', `${SC}EVOLUTION`, 'spot', 3, spot([
    S('Baraka explains the order.', ['Australopithecus came first.', 'Homo erectus came after Homo habilis.', '!Homo sapiens came before Australopithecus.'], 'Homo sapiens came last.', 'G8_EV_ORDER'),
    S('Wanjiru explains the theory.', ['Humans changed over millions of years.', '!Humans came from monkeys alive today.', 'Humans and apes share ancestors.'], 'Humans did not come from living monkeys.', 'G8_EV_MONKEY'),
    S('Kamau explains time.', ['The changes were slow.', '!They took a few hundred years.', 'They took millions of years.'], 'The changes took millions of years.', 'G8_EV_FAST'),
    S('Mwende explains changes.', ['Early humans came to walk upright.', 'Their brains grew bigger.', '!They grew wings.'], 'Early humans did not grow wings.', 'G8_EV_ORDER'),
    S('Nekesa explains evidence.', ['Fossils are evidence.', 'Tools are evidence.', '!A rumour is evidence.'], 'Scientists use fossils and tools as evidence.', 'G8_EV_MONKEY'),
  ], { h: ['Check each step: the order, the time, the evidence.', 'Humans did not come from living monkeys.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- CRADLE_AFRICA
  fam('sc.cr.why', `${SC}CRADLE_AFRICA`, 'direct', 1, choose([
    C('G8_CR_WHY', 'Why is Africa called the cradle of humanity?', 'The oldest fossils of early humans were found there', ['It is the biggest continent', 'It is the richest continent', 'It has the most people'], 'Africa is the cradle because the oldest human fossils were found there.'),
    C('G8_CR_PLACE', 'Where is Olduvai Gorge?', 'Tanzania', ['Kenya', 'Ethiopia', 'Egypt'], 'Olduvai Gorge is in Tanzania.'),
    C('G8_CR_PLACE', 'Koobi Fora, where important fossils were found, is near which Kenyan lake?', 'Lake Turkana', ['Lake Victoria', 'Lake Naivasha', 'Lake Baringo'], 'Koobi Fora is near Lake Turkana.'),
    C('G8_CR_WHY', 'Which family of scientists found many early human fossils in East Africa?', 'The Leakey family', ['The Kamau family', 'The Maathai family', 'The Nyerere family'], 'The Leakeys, Louis, Mary and Richard, found many fossils.'),
    C('G8_CR_WHY', 'Which part of Africa has many early human sites?', 'The Rift Valley in East Africa', ['The Sahara in the north', 'The Kalahari in the south', 'The Atlas Mountains'], 'The East African Rift Valley holds many early human sites.'),
  ], { h: ['The oldest human fossils were found in Africa.', 'Olduvai is in Tanzania; Koobi Fora is in Kenya.'], s1: 'Think about where the evidence was found.' })),
  fam('sc.cr.keep', `${SC}CRADLE_AFRICA`, 'why', 2, choose([
    C('G8_CR_PRESERVE', 'Which helps to preserve early human remains?', 'Keeping them in a museum with records', ['Taking them home to show friends', 'Leaving them in the rain', 'Washing them with strong soap'], 'Fossils are kept in museums with careful records.'),
    C('G8_CR_PRESERVE', 'Why are fossil sites protected?', 'So the remains are not damaged or stolen', ['So nobody ever learns from them', 'So they can be sold', 'So they can be broken up'], 'Protected sites keep the remains safe for study.'),
    C('G8_CR_PRESERVE', 'How should scientists dig up a fossil?', 'Slowly and carefully, with notes and labels', ['Quickly with a heavy hammer', 'With a bulldozer', 'Without any notes'], 'Careful digging and records protect fossils.'),
    C('G8_CR_WHY', 'Why do visitors come to Koobi Fora and Olduvai?', 'To learn about early humans', ['To buy fossils and take them home', 'To play football on the dig site', 'To grow crops on the old ground'], 'The sites show where early humans lived.'),
    C('G8_CR_PLACE', 'Which Kenyan museum keeps the Turkana Boy?', 'The National Museums of Kenya in Nairobi', ['Fort Jesus in Mombasa, which is a fort', 'The Gedi ruins on the Kenyan coast', 'The Kisumu Museum by the lake'], 'The Turkana Boy is kept by the National Museums of Kenya in Nairobi.'),
  ], { h: ['Remains need care, records and a safe place.', 'Museums and protected sites keep them safe.'], s1: 'Think about what keeps a fossil safe.' })),
  fam('sc.cr.spot', `${SC}CRADLE_AFRICA`, 'spot', 3, spot([
    S('Baraka explains why Africa is the cradle.', ['Old fossils were found in Africa.', '!Africa is the cradle because it is the biggest.', 'Many are in East Africa.'], 'Africa is the cradle because of the fossils, not its size.', 'G8_CR_WHY'),
    S('Wanjiru places the sites.', ['Olduvai is in Tanzania.', '!Olduvai is in Kenya.', 'Koobi Fora is in Kenya.'], 'Olduvai Gorge is in Tanzania.', 'G8_CR_PLACE'),
    S('Kamau explains preserving remains.', ['Fossils are kept in museums.', '!Fossils are handled by everyone.', 'Fossils have labels and records.'], 'Fossils are handled only by trained people.', 'G8_CR_PRESERVE'),
    S('Mwende explains the evidence.', ['Fossils come from rocks.', 'Tools are found with them.', '!Africa has no early fossils.'], 'Africa has the oldest known fossils.', 'G8_CR_WHY'),
    S('Nekesa explains the sites.', ['Koobi Fora is near Lake Turkana.', '!Koobi Fora is near Lake Victoria.', 'It is in Kenya.'], 'Koobi Fora is near Lake Turkana.', 'G8_CR_PLACE'),
  ], { h: ['Check each step: the evidence, the place, the care of fossils.', 'Olduvai is in Tanzania.'], s1: 'Find the step that is not true.' })),

  // ---------------------------------------------------------------- SWAHILI
  fam('ec.sw.cities', `${EC}SWAHILI`, 'direct', 1, choose([
    C('G8_SW_WHERE', 'Which of these was a Swahili city-state?', 'Kilwa', ['Timbuktu', 'Cairo', 'Kano'], 'Kilwa was a Swahili city-state on the coast.'),
    C('G8_SW_WHERE', 'Which Kenyan town was a Swahili city-state?', 'Lamu', ['Nakuru', 'Eldoret', 'Nyeri'], 'Lamu was a Swahili city-state.'),
    C('G8_SW_TRADE', 'With whom did the Swahili trade by dhow?', 'Arabia, Persia, India and China', ['Only Europe', 'Only West Africa', 'Only North America'], 'The monsoon winds carried dhows to Arabia, Persia, India and China.'),
    C('G8_SW_LANGUAGE', 'What is Kiswahili?', 'A Bantu language with some Arabic words', ['The Arabic language', 'An Indian language', 'A European language'], 'Kiswahili is a Bantu language with Arabic words.'),
    C('G8_SW_TRADE', 'What carried the Swahili traders across the ocean?', 'Dhows and the monsoon winds', ['Trains running on steel tracks', 'Lorries driven along tarmac roads', 'Aeroplanes flying over the sea'], 'Dhows used the monsoon winds.'),
  ], { h: ['Swahili city-states stood on the East African coast.', 'Kiswahili is a Bantu language.'], s1: 'Think about the coast and the ocean winds.' })),
  fam('ec.sw.legacy', `${EC}SWAHILI`, 'why', 2, choose([
    C('G8_SW_LANGUAGE', 'What did the Swahili civilisation give to the modern world?', 'The Kiswahili language and a coastal culture', ['The railway across the country', 'The motorcar and the petrol pump', 'The aeroplane and the airport'], 'Kiswahili and a coastal culture came from the Swahili.'),
    C('G8_SW_TRADE', 'Which goods did the Swahili trade?', 'Gold, ivory and cloth', ['Computers', 'Cars', 'Plastic toys'], 'The Swahili traded gold, ivory, cloth and other goods.'),
    C('G8_SW_WHERE', 'Which of these buildings is typical of the Swahili coast?', 'A coral-stone house or mosque', ['A glass tower with many floors', 'A mud igloo built in the cold', 'A wooden skyscraper in a city'], 'The Swahili built with coral stone.'),
    C('G8_SW_LANGUAGE', 'Why does Kiswahili have some Arabic words?', 'Traders from Arabia and the coast shared words', ['It is an Arabic language from Arabia', 'Arabic was invented at the Kenyan coast', 'There is no reason at all'], 'Trade brought Arabic words into Kiswahili.'),
    C('G8_SW_TRADE', 'How does the Swahili civilisation help Kenya today?', 'It gave a shared language and coastal heritage', ['It gave the railway to the coast', 'It gave the present constitution', 'It gave the airports and the harbours'], 'Kiswahili is a shared national language and the coast has a rich heritage.'),
  ], { h: ['The Swahili traded across the Indian Ocean.', 'They gave us Kiswahili.'], s1: 'Think about what the coast gave to Kenya.' })),
  fam('ec.sw.spot', `${EC}SWAHILI`, 'spot', 3, spot([
    S('Baraka explains the Swahili coast.', ['Kilwa was a Swahili city-state.', 'Lamu was a Swahili city-state.', '!Timbuktu was a Swahili city-state.'], 'Timbuktu is in West Africa.', 'G8_SW_WHERE'),
    S('Wanjiru explains trade.', ['Dhows crossed the ocean.', '!They traded first with Europe.', 'They used the monsoon winds.'], 'They traded with Arabia, Persia, India and China.', 'G8_SW_TRADE'),
    S('Kamau explains the language.', ['Kiswahili is a Bantu language.', '!Kiswahili is the Arabic language.', 'It has some Arabic words.'], 'Kiswahili is Bantu with some Arabic words.', 'G8_SW_LANGUAGE'),
    S('Mwende explains the goods.', ['They traded gold.', 'They traded ivory.', '!They traded motorcars.'], 'They traded gold, ivory and cloth.', 'G8_SW_TRADE'),
    S('Nekesa explains the cities.', ['Mombasa was a coastal city-state.', '!Mombasa is in West Africa.', 'Zanzibar was a coastal city-state.'], 'Mombasa is on the East African coast.', 'G8_SW_WHERE'),
  ], { h: ['Check each step: the place, the trade, the language.', 'The Swahili coast is in East Africa.'], s1: 'Find the step that is not true.' })),
];
