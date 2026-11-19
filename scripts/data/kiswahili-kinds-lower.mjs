// Kiswahili skill kinds for Grades 1 to 3 (18 Nov 2026, offline, no model call). The lower-primary design repeats the same
// kinds of sub-strand theme after theme: maamkuzi, maneno ya heshima, matamshi bora of target sounds, ufahamu wa kusikiliza,
// maagizo, mazungumzo, kusoma kwa ufasaha and kwa ufahamu, hati nadhifu, alama, imla and tahajia, a short insha, and the
// grammar of one pair of words (yeye/wao, huyu/hawa, -angu/-etu, umoja na wingi of one ngeli). The errors a young child makes
// in one are the errors he makes in the next: silabi split by letters, a vowel pushed into a cluster (mbwa -> mubwa),
// mother-tongue sounds (l for r, s for sh, z for dh), the noun class of a common noun (kiti mzuri, kitabu yangu), greetings
// answered with the same greeting. Each kind is written once here; each sub-strand fills in its own theme and words.
// Codes carry the theme tag (M3_SAL_REPLY_T1) so they never clash inside a grade. Used by scripts/data/kiswahili-g1..3/*.mjs.
// Language: what the child or tutor says is Kiswahili; notes for the reviewer (error, cause, help, steps) are English.
import { m, p, s, TC, MT, ENG } from './kiswahili-depth-lib.mjs';
import { syllables } from './kiswahili-kinds.mjs';
export { syllables };

const rule = (what) => `${what}, in 8 of 10 new items (the teacher also hears it in class, with the KICD rubric).`;

// ================================================================ KUSIKILIZA NA KUZUNGUMZA
// ---------------------------------------------------------------- maamkuzi na maagano
// time: [situation, wrong greeting, right greeting]  leave: [situation, wrong, right]
export function salamu({ G, sub, tag, letters, pre, theme, time, leave }) {
  const C = `M${G}_SAL`;
  return s(sub, 'MAAMKUZI', 'Tumia maamkuzi na maagano yafaayo na majibu yake', letters,
    rule('Chooses the greeting or farewell that fits who is met (a friend, an elder, a group), the time of day and whether arriving or leaving, and gives the right reply (Hujambo? Sijambo; Shikamoo, Marahaba; Hamjambo? Hatujambo)'),
    ['chagua salamu ifaayo', 'chagua jibu la salamu', 'igiza salamu (mwalimu anasikiliza)'], ['recall', 'application'], {
      pre,
      mis: [
        m(`${C}_REPLY_${tag}`, 'Answers a greeting with the same greeting (Hujambo? Hujambo!) instead of its reply.', ['Rafiki anakusalimu: "Hujambo?" Unajibu nini?', 'Hujambo', 'Sijambo'], 'The child hears the greeting as a sound to echo, as with "Hello" in English; the question-and-answer pair has not been learnt.', 'Act it as a ball game: the greeting is thrown, the reply is caught; the two words are on two different cards.', 'Ukiulizwa "Hujambo?" unajibu "Sijambo," maana yake sina tatizo.', '"Hujambo?" ni swali. Jibu lake ni lipi?', undefined, ENG),
        m(`${C}_ELDER_${tag}`, 'Greets an elder with a peer or Sheng greeting (Mambo! Sasa!) instead of Shikamoo.', ['Unamwona babu njiani. Unamsalimu vipi?', 'Mambo babu!', 'Shikamoo babu!'], 'Mambo and Sasa are what the child hears most among children and on the street; he has not been taught that an elder is greeted differently.', 'Sort picture cards of people (babu, rafiki, mwalimu) into two piles: Shikamoo and Hujambo.', 'Mzee husalimiwa kwa heshima: Shikamoo babu!', 'Unayemsalimu ni mzee au mtoto mwenzako?'),
        m(`${C}_MARAHABA_${tag}`, 'Gives the elder\'s reply to the child\'s greeting the wrong way round (the elder says Shikamoo, or the child says Marahaba).', ['Mtoto anamsalimu bibi: "Shikamoo bibi!" Bibi anajibu nini?', 'Shikamoo', 'Marahaba'], 'Both words are heard together and the child does not yet know which belongs to the young person and which to the elder.', 'Role-play with a hat for the elder: only the one with the hat may say Marahaba.', 'Mtoto anasema Shikamoo; mzee anajibu Marahaba.', 'Ni nani mdogo katika salamu hii, na anasema nini?'),
        m(`${C}_TIME_${tag}`, 'Uses the greeting of another time of day.', time, 'The child learnt one greeting as a set phrase and uses it at every hour.', 'A clock or sun chart: asubuhi, mchana, jioni, usiku; the child moves the arrow and says the greeting for that time.', `Salamu hufuata wakati: ${time[2]}`, 'Ni wakati gani wa siku sasa?'),
        m(`${C}_LEAVE_${tag}`, 'Uses a greeting when leaving, or a farewell when arriving.', leave, 'Greeting and farewell words are learnt on one chart and the child mixes the two columns.', 'Act out a door: walk in and greet, walk out and say goodbye.', `Unapoondoka unaaga: ${leave[2]}`, 'Unafika au unaondoka?'),
        m(`${C}_GROUP_${tag}`, 'Greets a group with the singular greeting (Hujambo?) or answers for a group with Sijambo.', ['Mwalimu anaingia darasani na kusema: "Hamjambo wanafunzi?" Darasa linajibu nini?', 'Sijambo', 'Hatujambo'], 'The child knows one pair only; the plural forms hamjambo/hatujambo follow the person marker (m-, tu-), which has not been noticed.', 'Greet one child, then the whole row; show that the word changes with one or many.', 'Watu wengi hujibu "Hatujambo."', 'Mwalimu alimsalimu mtu mmoja au darasa zima?'),
      ],
      pack: p('The child asks three questions before greeting: who is it, what time is it, am I arriving or leaving; then says the greeting and waits for its reply.',
        ['Says his own name and a friend\'s name.', 'Unaitwa nani?', 'Ninaitwa Baraka'],
        ['a chart of greetings with their replies side by side', 'picture cards: babu, rafiki, mwalimu, darasa', 'a sun chart for the time of day'],
        ['Look at who it is.', 'Think of the time of day.', 'Arriving or leaving?', 'Say the greeting, then listen for the reply.'],
        [theme, 'arriving at school in the morning', 'visiting grandmother at home'],
        ['Shikamoo! - ___', ['Point at the picture of babu.', 'Babu anajibu nini?'], 'The child greets a friend and then an elder, each with its own reply.'],
        [['Rafiki anasema "Hujambo?" Unajibu?', 'Sijambo', 'reply'], ['Unamsalimu bibi. Unasema?', 'Shikamoo bibi', 'elder']]),
    });
}

// ---------------------------------------------------------------- maneno ya heshima na adabu
export function heshima({ G, sub, tag, letters, pre, theme }) {
  const C = `M${G}_HES`;
  return s(sub, 'HESHIMA', 'Tumia maneno ya heshima na adabu: tafadhali, asante, samahani, pole, karibu', letters,
    rule('Picks and uses the polite word that fits the situation (tafadhali or naomba to ask, asante to thank, karibu to answer asante, samahani to apologise, pole to sympathise) and addresses an adult with a title'),
    ['chagua neno la adabu', 'kamilisha mazungumzo', 'igiza hali (mwalimu anasikiliza)'], ['application', 'discrimination'], {
      pre,
      mis: [
        m(`${C}_POLE_${tag}`, 'Says samahani when someone else is hurt by accident, where pole (sympathy) is meant.', ['Rafiki ameanguka mwenyewe uwanjani. Unamwambia nini?', 'Samahani', 'Pole'], 'English "sorry" covers both apology and sympathy; Kiswahili separates them: samahani when I did wrong, pole when you suffer.', 'Two pictures: I stepped on your foot (samahani); you fell by yourself (pole). The child names each.', 'Pole ni ya kumhurumia aliyeumia; samahani ni ya kuomba msamaha ukikosea.', 'Ni wewe uliyemwangusha?', undefined, ENG),
        m(`${C}_KARIBU_${tag}`, 'Answers "Asante" with "Asante" instead of "Karibu" (or "Si neno").', ['Ulimpa rafiki kalamu, akasema "Asante." Unajibu nini?', 'Asante', 'Karibu'], 'The child echoes the polite word he has just heard.', 'Practise the pair with two children: one gives, one thanks, the giver answers Karibu.', 'Ukishukuriwa, unajibu "Karibu."', 'Nani alipewa kitu, na nani alitoa?'),
        m(`${C}_COMMAND_${tag}`, 'Asks with a bare command (Nipe maji!) without tafadhali or naomba.', ['Unataka maji kutoka kwa mama. Unasemaje?', 'Nipe maji!', 'Mama, tafadhali naomba maji.'], 'At home and in play the child hears short commands and copies them to adults.', 'Say both versions; the child says which one makes mama want to help.', 'Ombi la adabu lina "tafadhali" au "naomba."', 'Mama atajisikiaje ukimwambia hivyo?'),
        m(`${C}_TITLE_${tag}`, 'Calls an adult by the bare first name without a title (Mwalimu, Mama, Baba, Bi., Bw.).', ['Unamwita mwalimu wako, Bi. Akinyi. Unasemaje?', 'Akinyi, njoo!', 'Mwalimu, tafadhali njoo.'], 'Children call each other by name and carry the habit to adults.', 'Make title cards (Mwalimu, Mama, Babu, Daktari); the child puts one before each name.', 'Mtu mzima huitwa kwa heshima: Mwalimu, Mama, Babu.', 'Unamwitaje mtu mzima?'),
        m(`${C}_POLEREPLY_${tag}`, 'Answers "Pole" with "Pole" instead of "Asante".', ['Rafiki anakuambia "Pole kwa kuumia." Unajibu?', 'Pole', 'Asante'], 'The child echoes the word, as with greetings.', 'Act it: one child is hurt, the other says pole, the hurt one says asante.', 'Ukiambiwa "pole" unashukuru: "Asante."', 'Ni nani aliumia, na anasema nini?'),
      ],
      pack: p('The child names the situation (asking, thanking, apologising, someone is hurt) before choosing the polite word.',
        ['Greets a classmate and an elder.', 'Bibi anakusalimu. Unasema?', 'Shikamoo bibi'],
        ['situation picture cards', 'a chart: tafadhali, naomba, asante, karibu, samahani, pole', 'role play in pairs'],
        ['Look at the situation.', 'Ask: am I asking, thanking, sorry, or is someone hurt?', 'Choose the word.', 'Say the whole sentence politely.'],
        [theme, 'borrowing a pencil in class', 'a friend falls in the playground'],
        ['Umemkanyaga mwenzako: ___', ['Point at the picture.', 'Uliyekosea ni nani? Unasema nini?'], 'The child says "Samahani" and acts out two more situations.'],
        [['Umepewa zawadi. Unasema?', 'Asante', 'thanking'], ['Rafiki ameumia mwenyewe. Unasema?', 'Pole', 'sympathy']]),
    });
}

// ---------------------------------------------------------------- matamshi bora: the syllables of target sounds
// sounds: ['py','vy','sh']  words: three words with the sounds   near: [target, near sound, word, wrong word]
// split: [word, wrong reading with an extra vowel] (or near2: a second [target, near, word, wrong] for sounds with no cluster)   drop: [word, wrong reading with the glide or nasal lost]
// (drop may be left out when the sounds have no glide or nasal to lose) noword: a word without any target sound   useLetter: the outcome letters that ask the child to use the words (optional)
export function sauti({ G, sub, tag, id = 'MATAMSHI', letters, pre, theme, sounds, words, near, near2, split, drop, noword, sentence, lname }) {
  const C = `M${G}_SAU`, L = sounds.map(x => `/${x}/`).join(', ');
  return s(sub, id, `Tambua na utamke silabi za sauti ${L} katika maneno na sentensi`, letters,
    rule(`Hears and says the target sounds ${L} in syllables and words (${words.join(', ')}), splits a word into its syllables, and picks or uses a word that carries the sound`),
    ['chagua neno lenye sauti', 'gawa neno kwa silabi', 'chagua matamshi sahihi', 'tamka neno (mwalimu anasikiliza)'], ['recall', 'discrimination'], {
      pre,
      mis: [
        m(`${C}_NEAR_${tag}`, `Says /${near[1]}/ for /${near[0]}/, so "${near[2]}" becomes "${near[3]}".`, [`Mwalimu anasema "${near[2]}". Neno lipi limetamkwa vizuri?`, near[3], near[2]], `Many Kenyan first languages have no /${near[0]}/, or do not separate it from /${near[1]}/; the child puts in the home sound.`, `Say the two side by side, slowly, watching the mouth; the child holds up a card for the sound he hears.`, `Sikiliza: "${near[2]}" ina sauti /${near[0]}/, si /${near[1]}/.`, `Ulisikia /${near[0]}/ au /${near[1]}/?`, undefined, MT),
        near2 ? m(`${C}_NEAR2_${tag}`, `Says /${near2[1]}/ for /${near2[0]}/, so "${near2[2]}" becomes "${near2[3]}".`, [`Neno lipi limetamkwa vizuri?`, near2[3], near2[2]], `/${near2[0]}/ and /${near2[1]}/ are close; a first language with only one of them puts that one in both places.`, `Contrast the two with a mirror and a hand before the mouth; the child says which he hears.`, `"${near2[2]}" ina sauti /${near2[0]}/.`, `Ulisikia /${near2[0]}/ au /${near2[1]}/?`, undefined, MT) :
        m(`${C}_VOWEL_${tag}`, `Pushes a vowel into the cluster, so "${split[0]}" is said "${split[1]}".`, [`Tamka neno "${split[0]}". Ni lipi sahihi?`, split[1], split[0]], 'In the child\'s first language, or in English loan habits, two consonants rarely sit together; he breaks them with a vowel.', 'Say the cluster in one beat, then the word; clap once for the cluster syllable.', `"${split[0]}" ina silabi ${syllables(split[0])}; hakuna irabu ya ziada.`, 'Unapiga makofi mangapi kwa neno hili?', undefined, MT),
        drop && m(`${C}_DROP_${tag}`, `Drops part of the target sound, so "${drop[0]}" becomes "${drop[1]}".`, [`Neno "${drop[0]}" limeandikwa au kutamkwa vipi kwa usahihi?`, drop[1], drop[0]], 'The second part of the sound (the w or y glide, or the soft nasal) is quick and quiet; the child does not hear it and leaves it out.', 'Stretch the syllable slowly (p-y-a), then say it fast; the child copies.', `Sikiliza tena: "${drop[0]}". Usiache sehemu ya sauti.`, `Kuna sauti gani baada ya herufi ya kwanza katika "${drop[0]}"?`, undefined, MT),
        m(`${C}_SYLL_${tag}`, `Splits "${words[0]}" by letters rather than by syllables (each Kiswahili syllable ends in a vowel).`, [`Neno "${words[0]}" lina silabi zipi?`, words[0].split('').join('-'), syllables(words[0])], 'The child has learnt letters one by one and has not been shown that a syllable is a sound that ends in a vowel.', 'Clap the word: one clap per vowel; the consonants go with the vowel after them.', `Kila silabi ya Kiswahili huishia kwa irabu: ${syllables(words[0])}.`, 'Kila silabi inaishia kwa herufi gani?'),
        lname && m(`${C}_NAME_${tag}`, `Says the English letter name instead of the Kiswahili sound (/${lname[0]}/ as "${lname[1]}"), so the syllable cannot be built.`, [`Sauti ya herufi "${lname[0]}" ni ipi?`, lname[1], `/${lname[0]}/`], 'English letter names are taught alongside and the child brings them to Kiswahili; a syllable is built from sounds, not names.', `Say the sound alone, short (/${lname[0]}/), then join it to a vowel: ${lname[0]}a, ${lname[0]}e, ${lname[0]}i.`, `Kwa Kiswahili tunatamka sauti: /${lname[0]}/.`, 'Ni jina la herufi au ni sauti yake?', undefined, ENG),
        m(`${C}_PICK_${tag}`, 'Picks a word with no target sound when asked for one that has it.', [`Ni neno lipi lina sauti ${L}?`, noword, words[1]], 'The child looks at the first letter or the picture, not at the sound.', 'Underline the target sound in each word on the card before choosing.', `"${words[1]}" ina sauti lengwa; "${noword}" haina.`, 'Sauti hiyo iko wapi katika neno hili?'),
      ].filter(Boolean),
      pack: p(`The child hears the target sound as one syllable (${syllables(words[0])}), says it in one beat, and checks it in the word.`,
        ['Says the five vowels a, e, i, o, u and reads open syllables (ma, me, mi, mo, mu).', 'Soma: ma - ma', 'mama'],
        [`word cards: ${words.join(', ')}`, 'clapping one beat for each syllable', `a sentence with the sounds: ${sentence}`],
        ['Listen to the word.', 'Find the target sound.', 'Clap the syllables.', 'Say the word in one go and use it in a sentence.'],
        [theme, 'a class word tree', 'a song with the sounds'],
        [syllables(words[0]), ['Point at the target syllable.', 'Silabi hii inatamkwaje?'], 'The child says each word on the card and claps its syllables.'],
        [[`Gawa "${words[2]}" kwa silabi.`, syllables(words[2]), 'syllables'], [`Ni neno lipi lina sauti lengwa: ${words[1]} au ${noword}?`, words[1], 'hearing the sound']]),
    });
}

// ---------------------------------------------------------------- ufahamu wa kusikiliza
// story: one-line summary of the heard passage; word: [word, wrong meaning, right meaning, a sentence that shows the meaning]; msg: [detail, message]
// order: [wrong order, right order] of three events
export function sikiliza({ G, sub, tag, letters, pre, theme, story, word, msg, order }) {
  const C = `M${G}_SIK`;
  return s(sub, 'UFAHAMU_KUSIKILIZA', 'Sikiliza kifungu, eleza ujumbe na msamiati wake, na usimulie upya', letters,
    rule(`After hearing a short passage (${story}), says its message, gives the meaning of a new word from it, uses the word in a sentence of his own and retells the events in order`),
    ['chagua ujumbe', 'chagua maana ya neno', 'panga matukio', 'simulia upya (mwalimu anasikiliza)'], ['comprehension', 'sequencing'], {
      pre,
      mis: [
        m(`${C}_DETAIL_${tag}`, 'Gives a detail of the passage as its message.', ['Ujumbe wa kifungu ulichosikiliza ni upi?', msg[0], msg[1]], 'The detail is the clearest thing the child remembers; he has not been asked what the passage teaches.', 'After listening, ask "Kifungu kinatufundisha nini?" and compare it with "Nini kilitokea?".', `Hilo ni tukio moja. Ujumbe ni: ${msg[1]}`, 'Kifungu kinataka tujifunze nini?'),
        m(`${C}_WORD_${tag}`, `Gives "${word[0]}" the meaning of a word that sounds like it.`, [`Neno "${word[0]}" katika kifungu lina maana gani?`, word[1], word[2]], 'The child matches the sound of the word to one he knows instead of listening to the sentence around it.', 'Replay the sentence; the child tries each meaning in it and keeps the one that makes sense.', `Katika kifungu, "${word[0]}" ni ${word[2]}.`, 'Sentensi ilisema nini kabla na baada ya neno hilo?'),
        m(`${C}_SENT_${tag}`, `Makes a "sentence" that only repeats the word and shows no meaning (${word[0]} ni ${word[0]}).`, [`Ni sentensi ipi inaonyesha maana ya "${word[0]}"?`, `${word[0][0].toUpperCase()}${word[0].slice(1)} ni ${word[0]}.`, word[3]], 'The child thinks any sentence with the word in it is enough.', 'Ask: if your friend did not know the word, would your sentence tell him what it means?', 'Sentensi nzuri inaonyesha maana ya neno.', 'Sentensi yako inamwambia mwenzako nini kuhusu neno hili?'),
        m(`${C}_ORDER_${tag}`, 'Retells the events out of order.', ['Panga matukio ya kifungu kama yalivyotokea.', order[0], order[1]], 'The child remembers the most exciting event and tells it first.', 'Three picture cards of the events; the child lays them left to right and retells with kwanza, kisha, mwishowe.', `Matukio yalifuatana hivi: ${order[1]}.`, 'Ni nini kilitokea kwanza kabisa?'),
        m(`${C}_ADD_${tag}`, 'Adds events that were not in the passage when retelling.', ['Unaposimulia upya, unaongeza mambo ambayo hayakuwa kwenye kifungu?', 'ndiyo, ili hadithi iwe tamu', 'hapana, ninasimulia yaliyokuwemo tu'], 'Retelling is taken as storytelling: the child invents to make it longer.', 'After the retelling, the class checks each event: was it in the passage? Thumbs up or down.', 'Kusimulia upya ni kusema yaliyokuwa kwenye kifungu tu.', 'Je, jambo hilo lilikuwa kwenye kifungu?'),
      ],
      pack: p('The child listens for three things: who, what happened in order, and what the passage teaches; then says them in his own words.',
        ['Answers a who-question about a sentence he hears.', 'Sikiliza: "Mama alipika ugali." Nani alipika?', 'Mama'],
        ['three picture cards of the events', 'the new word on a card with its sentence', 'a listening chart: Nani? Nini? Funzo?'],
        ['Listen to the whole passage.', 'Say who was in it.', 'Put the events in order.', 'Say the message and use the new word.'],
        [theme, 'a story told by the teacher', 'a radio or phone recording'],
        [order[1], ['Point at the first picture.', 'Nini kilitokea kwanza?'], 'The child retells the passage with kwanza, kisha, mwishowe.'],
        [[`"${word[0]}" ni nini?`, word[2], 'vocabulary'], ['Kifungu kinatufundisha nini?', msg[1], 'message']]),
    });
}

// ---------------------------------------------------------------- maagizo
// two: [two-step instruction, only first step done, both done]   dir: [instruction with a direction word, wrong, right]
export function maagizo({ G, sub, tag, letters, pre, theme, two, dir }) {
  const C = `M${G}_MAG`;
  return s(sub, 'MAAGIZO', 'Fuata na utoe maagizo mepesi kwa usahihi', letters,
    rule('Follows a one- or two-step instruction in the right order, reads the direction and action words in it (simama, keti, kulia, kushoto, juu, chini), and gives a clear, polite instruction that names what to do and to what'),
    ['chagua kitendo sahihi', 'panga hatua', 'toa agizo (mwalimu anasikiliza)'], ['comprehension', 'application'], {
      pre,
      mis: [
        m(`${C}_HALF_${tag}`, 'Carries out only the first part of a two-step instruction.', [`Agizo: "${two[0]}" Umefanya nini?`, two[1], two[2]], 'The child starts acting as soon as he hears the first verb and stops listening.', 'Hold up one finger for each step while giving the instruction; the child repeats the steps before moving.', 'Sikiliza agizo lote kwanza, kisha fanya hatua zote.', 'Agizo lilikuwa na hatua ngapi?'),
        m(`${C}_ORDER_${tag}`, 'Does the steps in the wrong order.', ['Agizo: "Osha mikono, kisha ule chakula." Ni nini kinatangulia?', 'kula chakula', 'kuosha mikono'], 'The child does the step he wants most first; the order words kwanza and kisha are not yet noticed.', 'Number the steps on the board with kwanza, kisha, mwishowe.', 'Neno "kisha" linaonyesha hatua inayofuata.', 'Neno lipi linakuambia hatua ya pili?'),
        m(`${C}_DIR_${tag}`, 'Mixes a direction or action word.', [`Agizo: "${dir[0]}" Ni kitendo kipi sahihi?`, dir[1], dir[2]], 'Pairs such as kulia/kushoto and juu/chini are learnt together and swapped.', 'Play "Mwalimu anasema": the teacher calls the word, the child acts it; mark the right hand with a band.', `${dir[0]} maana yake ni ${dir[2]}.`, 'Neno hilo linakuambia ufanye nini?'),
        m(`${C}_VAGUE_${tag}`, 'Gives an instruction that leaves out what to act on, or with no polite word (Lete!).', ['Ni agizo lipi liko wazi na lina adabu?', 'Lete!', 'Tafadhali lete kitabu chako mezani.'], 'The child knows what he means and does not see that the listener cannot.', 'The child gives the instruction to a partner, who does exactly what was said and no more.', 'Agizo zuri linasema nini kifanyike, kwa kitu gani, na kwa adabu.', 'Mwenzako atajuaje alete nini?'),
      ],
      pack: p('The child hears the whole instruction, counts its steps on his fingers, and does them in order; when giving one, he names the action and the thing.',
        ['Does a one-step action on hearing it.', 'Simama!', 'the child stands'],
        ['finger counting of steps', 'action cards: simama, keti, chukua, weka', 'a band on the right hand'],
        ['Listen to the whole instruction.', 'Count the steps.', 'Do them in order.', 'Give one instruction to a partner.'],
        [theme, 'lining up for assembly', 'helping at home'],
        ['Chukua kitabu, kisha ukiweke mezani.', ['Point at "kisha".', 'Hatua ya pili ni ipi?'], 'The child does both steps and gives a two-step instruction to a partner.'],
        [['Agizo "Keti kisha ufungue kitabu" lina hatua ngapi?', 'mbili', 'steps'], ['Toa agizo la adabu la kumwomba mwenzako afunge mlango.', 'Tafadhali funga mlango.', 'giving']]),
    });
}

// ---------------------------------------------------------------- mazungumzo
// topic: the theme talked about; mix: [sentence with English or Sheng words, the Kiswahili one]
export function mazungumzo({ G, sub, tag, letters, pre, theme, topic, mix }) {
  const C = `M${G}_MAZ`;
  return s(sub, 'MAZUNGUMZO', `Shiriki mazungumzo kuhusu ${topic} kwa zamu, kwa matamshi bora na ishara zifaazo`, letters,
    rule(`Takes part in a short conversation about ${topic}: keeps to the topic, waits for his turn, speaks Kiswahili without English or Sheng words, says sounds clearly and uses gestures that match the words`),
    ['chagua jibu linalofaa mada', 'tambua kosa la mazungumzo', 'zungumza (mwalimu anasikiliza)'], ['application', 'evaluation'], {
      pre,
      mis: [
        m(`${C}_TOPIC_${tag}`, 'Says something that has nothing to do with the topic.', [`Mnazungumza kuhusu ${topic}. Ni sentensi ipi inafaa?`, 'Jana nilitazama katuni nzuri.', mix[1]], 'The child says what is on his mind; he has not learnt that a conversation has a topic everyone keeps to.', 'Put the topic picture in the middle; before speaking the child points to it.', `Tunazungumza kuhusu ${topic}; sema jambo kuhusu hilo.`, 'Mada yetu ni nini?'),
        m(`${C}_TURN_${tag}`, 'Talks over others and does not wait for his turn.', ['Mwenzako anazungumza. Unafanya nini?', 'ninaanza kuzungumza pia', 'ninasikiliza mpaka amalize, kisha ninazungumza'], 'Eagerness: the child fears he will forget his idea.', 'Pass a talking object (a ball): only the one holding it speaks.', 'Subiri zamu yako; msikilize mwenzako kwanza.', 'Ni nani ana zamu ya kuzungumza sasa?'),
        m(`${C}_MIX_${tag}`, 'Mixes English or Sheng words into the Kiswahili sentence.', ['Sema kwa Kiswahili sanifu:', mix[0], mix[1]], 'At home and in town the child hears mixed speech and does not know the Kiswahili word.', 'Keep a word wall: the English or Sheng word, and its Kiswahili word next to it.', `Kwa Kiswahili tunasema: ${mix[1]}`, 'Neno hilo kwa Kiswahili ni lipi?', undefined, ENG),
        m(`${C}_GEST_${tag}`, 'Uses a gesture or face that does not match the words (smiling while giving sad news).', ['Unasema "Rafiki yangu ni mgonjwa." Uso wako unaonyesha nini?', 'tabasamu kubwa', 'huzuni'], 'The child smiles from shyness or does not link the face to the message.', 'Say one sentence with three faces; the class picks the face that fits.', 'Ishara zako zifuate ujumbe wako.', 'Ujumbe wako ni wa furaha au wa huzuni?'),
        m(`${C}_LR_${tag}`, 'Says /l/ for /r/ (or /r/ for /l/) while speaking: "rafiki" becomes "lafiki".', ['Tamka vizuri: rafiki', 'lafiki', 'rafiki'], 'Several Kenyan first languages do not separate /l/ and /r/; the home sound carries into Kiswahili.', 'Practise the pairs with a mirror: the tongue taps for r, it rests for l.', 'Tamka "rafiki" kwa /r/: ulimi unagonga mara moja.', 'Ulimi wako unafanya nini unaposema /r/?', undefined, MT),
      ],
      pack: p('The child keeps to the topic, waits for his turn, and says each sentence in clear Kiswahili with a matching face and hand.',
        ['Answers a simple question about himself in a full sentence.', 'Unapenda kula nini?', 'Ninapenda kula ndizi.'],
        ['a topic picture in the middle of the group', 'a talking ball', 'a word wall of Kiswahili words'],
        ['Look at the topic.', 'Wait for the ball.', 'Say one sentence on the topic.', 'Pass the ball and listen.'],
        [theme, topic, 'talking with a parent at home'],
        [mix[1], ['Point at the topic picture.', 'Sentensi hii inahusu mada yetu?'], 'The child says two sentences on the topic, waiting for his turn.'],
        [[mix[0] + ' Sema kwa Kiswahili.', mix[1], 'Kiswahili words'], ['Mwenzako anazungumza. Unafanya nini?', 'ninasikiliza mpaka amalize', 'turn taking']]),
    });
}

// ================================================================ KUSOMA
// ---------------------------------------------------------------- kusoma kwa ufasaha (with target sounds)
// sounds: target sounds or null; read: [word, wrong reading]; sentence: a plain sentence; question: a question sentence; wpm: words a minute
export function ufasaha({ G, sub, tag, letters, pre, theme, sounds, read, sentence, question, wpm }) {
  const C = `M${G}_UFS`, L = sounds ? sounds.map(x => `/${x}/`).join(', ') : '';
  return s(sub, 'KUSOMA_KWA_SAUTI', sounds ? `Soma kifungu chepesi chenye sauti ${L} kwa matamshi bora, sauti inayosikika, kasi ifaayo na ishara` : 'Soma kifungu chepesi kwa matamshi bora, sauti inayosikika, kasi ifaayo na ishara', letters,
    rule(`Finds the target sounds${sounds ? ` ${L}` : ''} in a short story, reads it aloud with every sound clear, loud enough for the class, at about ${wpm} words a minute, pausing at the koma and kikomo and raising the voice for a question; in the app picks the better reading of a line`),
    ['tambua sauti lengwa', 'chagua usomaji bora', 'tambua kosa la usomaji', 'kusoma kwa sauti (mwalimu anasikiliza)'], ['application', 'evaluation'], {
      pre,
      mis: [
        m(`${C}_SOUND_${tag}`, `Reads the target word wrongly: "${read[0]}" as "${read[1]}".`, [`Neno "${read[0]}" linasomwa vipi?`, read[1], read[0]], 'The child reads the letters with the sounds of his first language, or adds a vowel to break the cluster.', 'Pick out the target words before reading; practise them on cards, then read the passage.', `Soma "${read[0]}" kama lilivyoandikwa.`, 'Sauti lengwa katika neno hili ni ipi?', undefined, MT),
        m(`${C}_WORD_${tag}`, 'Reads word by word or syllable by syllable, so the sentence has no meaning when heard.', [`Ni usomaji upi ni wa ufasaha: "${sentence}"?`, sentence.split(' ').join(' ... '), sentence], 'The child is still decoding each word; he has not yet read a group of words as one piece.', 'Echo reading: the teacher reads a phrase, the child repeats it in one breath.', 'Soma maneno kwa pamoja kama unavyozungumza.', 'Ukisoma neno moja moja, mwenzako anaelewa?'),
        m(`${C}_QUIET_${tag}`, 'Reads so softly (or so loudly, shouting) that the class cannot follow.', ['Unaposoma mbele ya darasa, sauti yako inafaa kuwa vipi?', 'ya chini ili nisikosee mbele ya wenzangu', 'ya kusikika na wote darasani, bila kupiga kelele'], 'Shyness, or the belief that reading well means reading loud.', 'Stand the reader at the front and a listener at the back: the listener raises a hand when he hears every word.', 'Soma kwa sauti inayosikika na wote, bila kupiga kelele.', 'Mwenzako aliye nyuma anakusikia?'),
        m(`${C}_PACE_${tag}`, 'Reads as fast as possible and thinks the fastest reader is the best.', ['Kasi ifaayo ya kusoma kifungu ni ipi?', 'haraka iwezekanavyo', `kasi ya kuzungumza, karibu maneno ${wpm} kwa dakika`], 'Reading races in class reward speed; nobody asked whether the listeners understood.', 'Time two readings, one very fast and one at speaking pace; the listeners answer one question after each.', 'Kasi ifaayo ni ya kuzungumza: si haraka mno, si polepole mno.', 'Wasikilizaji waliweza kuelewa uliposoma haraka hivyo?'),
        m(`${C}_MARK_${tag}`, 'Reads a question in the flat voice of a statement and runs on through the koma and kikomo.', [`Sentensi "${question}" inasomwa vipi?`, 'kwa sauti ileile ya sentensi ya kawaida', 'sauti hupanda mwishoni kwa sababu ni swali'], 'The child looks at the words and not at the marks.', 'Read the same words three ways (. ? !); the child points at the mark that fits each reading; clap at each kikomo.', 'Kiulizi (?) hupandisha sauti mwishoni; simama kidogo kwenye koma na kikomo.', 'Alama iliyo mwishoni mwa sentensi hii ni ipi?'),
      ],
      pack: p('The child finds the target words first, then reads phrase by phrase, letting the marks set the pauses and the voice.',
        ['Reads short words with every sound clear.', 'Soma: "Baba anakula."', 'Baba anakula.'],
        ['the passage with phrase slashes', 'the target words on cards', 'the marks . , ? circled in colour'],
        ['Find the target sounds.', 'Read silently first.', 'Read aloud phrase by phrase.', 'Ask a listener one question about it.'],
        [theme, 'reading at the school assembly', 'reading to a younger brother or sister'],
        [question, ['Point at the kiulizi.', 'Sauti yako inafanya nini hapa?'], 'The child reads the line twice: once as a statement and once as the question.'],
        [[`Soma neno: ${read[0]}`, read[0], 'target sound'], ['Kasi ifaayo ya kusoma ni ipi?', 'kasi ya kuzungumza', 'pace']]),
    });
}

// ---------------------------------------------------------------- kusoma kwa ufahamu
// passage: the short passage (2-4 sentences); word: [word, wrong meaning, right]; msg: [detail, message]
// guess: [question, wrong guess, guess from the clues]; lesson: [retelling, lesson]; own: [question, answer from own life, answer from the passage]
export function ufahamu({ G, sub, tag, letters, pre, theme, passage, word, msg, guess, lesson, own, picture = false, parts = ['WORD', 'MSG', 'GUESS', 'LESSON', 'OWN'], about }) {
  const C = `M${G}_UFM`;
  const short = !parts.includes('GUESS');   // Grade 1 Themes 3 and 5: vocabulary and message only
  return s(sub, 'UFAHAMU', 'Soma kifungu chepesi: msamiati, ujumbe, kutabiri na mafunzo', letters,
    rule(short ? `Reads a very short passage on ${theme} and says what it is about, gives the meaning of a theme word from the sentence around it and says the message, answering from the passage and not from his own life` : `Reads a short passage on ${theme}, gives the meaning of a theme word from the sentence around it, says the message, predicts what happens next from the clues${picture ? ' in the picture' : ''} and says the lesson, answering from the passage and not from his own life`),
    short ? ['chagua maana ya neno', 'chagua ujumbe', 'jibu swali kutoka kifungu'] : ['chagua maana ya neno', 'chagua ujumbe', 'tabiri kitakachotokea', 'chagua funzo'], ['comprehension', 'inference'], {
      pre,
      mis: [
        parts.includes('DECODE') && m(`${C}_DECODE_${tag}`, 'Reads every word aloud but cannot say what the passage was about.', ['Umesoma kifungu. Kinahusu nini?', 'Sijui, nilikuwa nikisoma maneno tu.', about], 'All the child\'s effort goes into sounding out the words; nobody has asked him what the sentences said.', 'After each sentence stop and ask "Sentensi hii imesema nini?" before reading on.', `Soma tena polepole na ufikirie maana: ${about}`, 'Sentensi ya kwanza imesema nini?'),
        m(`${C}_WORD_${tag}`, `Gives "${word[0]}" the meaning of a word that looks or sounds like it.`, [`Soma: "${passage}" Neno "${word[0]}" lina maana gani?`, word[1], word[2]], 'The child matches the word to a known one by its look instead of reading the sentence around it.', 'Cover the word; the child says what word would fit the sentence, then uncovers it.', `Katika kifungu, "${word[0]}" ni ${word[2]}.`, 'Sentensi inasema nini kuhusu neno hilo?'),
        m(`${C}_MSG_${tag}`, 'Gives one detail of the passage as its message.', ['Ujumbe wa kifungu ni upi?', msg[0], msg[1]], 'The detail is what the child remembers best; he has not been asked what the writer wants us to know.', 'Ask two questions side by side: "Nini kilitokea?" and "Kifungu kinatuambia nini?"', `Hilo ni tukio moja. Ujumbe ni: ${msg[1]}`, 'Mwandishi anataka tujue nini?'),
        parts.includes('GUESS') && m(`${C}_GUESS_${tag}`, `Predicts something the passage gives no clue for${picture ? ', without looking at the picture' : ''}.`, guess, 'Prediction is taken as free imagination; the child has not been shown that clues in the text and picture point the way.', `Underline the clue words${picture ? ' and point at the picture' : ''}; the guess must fit them.`, `Tabiri kwa kutumia dalili${picture ? ' za picha na' : ''} za kifungu: ${guess[2]}`, 'Ni dalili gani katika kifungu inakuonyesha hivyo?'),
        parts.includes('LESSON') && m(`${C}_LESSON_${tag}`, 'Retells what happened when asked for the lesson.', ['Tunajifunza nini kutokana na kifungu?', lesson[0], lesson[1]], 'The lesson question sounds like a what-happened question to the child.', 'Start the answer with "Tunajifunza kwamba tunapaswa..."', `Funzo ni: ${lesson[1]}`, 'Kifungu kinatufundisha tufanye nini?'),
        m(`${C}_OWN_${tag}`, 'Answers from his own life instead of from the passage.', own, 'The child links the question to what he knows from home and does not check the text.', 'Ask the child to point at the line in the passage that gives the answer.', `Jibu liko kwenye kifungu: ${own[2]}`, 'Ni sentensi gani katika kifungu inatoa jibu hilo?'),
      ].filter(Boolean),
      pack: p('The child reads the passage twice, answers each question by pointing at the line that gives it, and tells the lesson as what we should do.',
        ['Reads a short sentence and answers a who-question about it.', 'Soma: "Juma analima shamba." Nani analima?', 'Juma'],
        ['the passage on a chart with clue words underlined', `${picture ? 'the picture beside the passage' : 'a picture of the theme'}`, 'question cards: Nini? Ujumbe? Kitatokea nini? Funzo?'],
        ['Read the passage.', 'Read the question.', 'Find the line with the answer.', 'Say the answer in your own words.'],
        [theme, 'a class reader', 'a story read at home with a parent'],
        [passage, ['Point at the new word.', 'Neno hili lina maana gani hapa?'], 'The child says the meaning, then the message and the lesson.'],
        [[`"${word[0]}" ni nini?`, word[2], 'vocabulary'], short ? ['Kifungu kinatuambia nini?', msg[1], 'message'] : ['Tunajifunza nini?', lesson[1], 'lesson']]),
    });
}

// ================================================================ KUANDIKA
// ---------------------------------------------------------------- hati nadhifu
// focus: 'kubwa' (capital letters), 'ndogo' (small letters), 'kifungu' (a clean paragraph); words: the length asked; line: a theme sentence
export function hati({ G, sub, tag, id = 'HATI_NADHIFU', letters, pre, theme, focus, words, line }) {
  const C = `M${G}_HAT`;
  const name = { kubwa: 'Andika kwa hati nadhifu ukitumia herufi kubwa ifaavyo', ndogo: 'Andika kwa hati nadhifu ukitumia herufi ndogo ifaavyo', kifungu: 'Andika kifungu kwa hati nadhifu' }[focus];
  const own = {
    kubwa: [
      m(`${C}_CAPSTART_${tag}`, 'Starts a sentence or a name with a small letter.', [`Andika kwa usahihi: ${line.toLowerCase()}`, line.toLowerCase(), line], 'The child copies words, not sentences; the rule that a sentence and a name begin with a capital is not yet used.', 'Circle the first letter of each sentence and each name in a passage in red.', 'Sentensi na jina la mtu au mahali huanza kwa herufi kubwa.', 'Sentensi hii inaanza kwa herufi gani?'),
      m(`${C}_CAPMID_${tag}`, 'Puts capital letters in the middle of words (JuMa, Kitabu KiKubwa).', ['Ni lipi limeandikwa vizuri?', 'JuMa ANakula', 'Juma anakula'], 'Some capitals (K, M, S) are easier to form than the small letter, so the child uses them anywhere.', 'Sort letter cards: capital only at the start; the rest small.', 'Herufi kubwa iko mwanzoni tu; nyingine ni ndogo.', 'Kwa nini herufi hii ni kubwa katikati ya neno?'),
    ],
    ndogo: [
      m(`${C}_TALL_${tag}`, 'Writes the tall small letters (b, d, h, k, l) short, so h looks like n.', ['Andika neno "habari". Ni lipi limeandikwa vizuri?', 'nabari', 'habari'], 'The child does not use the lines of the book: tall letters must reach the top line.', 'Write on three-line paper; the child colours the part of h that goes up.', 'Herufi h, k, l, b, d hupanda juu ya mstari wa kati.', 'Herufi hii inapanda mpaka wapi?'),
      m(`${C}_SIZE_${tag}`, 'Writes some small letters as big as capitals (kiti written kiTi or KITI).', ['Ni neno lipi limeandikwa kwa herufi ndogo vizuri?', 'KITI', 'kiti'], 'Capitals were learnt first in pre-primary and feel safer to write.', 'Compare k/K, s/S, t/T on cards; the child picks the small one for the middle of a word.', 'Ndani ya neno tumia herufi ndogo.', 'Herufi hizi ni kubwa au ndogo?'),
    ],
    kifungu: [
      m(`${C}_DRAFT_${tag}`, 'Hands in the first draft with crossings and does not make a clean copy.', ['Ni hatua gani ya mwisho ya kuandika kifungu?', 'nakala ya kwanza', 'nakala safi'], 'The child thinks writing ends when the words are down; the steps maandalizi, nakala ya kwanza, urekebishaji, nakala safi are new.', 'Show the four steps as four boxes; the child ticks each one.', 'Baada ya kurekebisha, andika nakala safi.', 'Umerekebisha makosa na kuandika nakala safi?'),
      m(`${C}_COPY_${tag}`, 'Leaves out words or a whole line when copying.', [`Nakili: "${line}"`, line.split(' ').filter((_, i) => i !== 1).join(' '), line], 'The child copies letter by letter and loses his place when looking back.', 'Copy phrase by phrase, moving a finger along the line; read the copy back against the original.', 'Soma nakala yako na ulinganishe na ya asili.', 'Neno lipi limeachwa?'),
    ],
  }[focus];
  return s(sub, id, name, letters,
    rule(`Writes a passage of about ${words} words in neat handwriting: letters well formed and on the line, ${focus === 'kubwa' ? 'capitals only at the start of a sentence or name' : focus === 'ndogo' ? 'small letters of the right height' : 'space between words, through the steps to a clean copy'}`),
    ['chagua maandishi nadhifu', 'tambua kosa', 'andika kifungu (mwalimu anasahihisha)'], ['application', 'evaluation'], {
      pre,
      mis: [...own,
        m(`${C}_SPACE_${tag}`, 'Leaves no space between words (Mamaanapika).', ['Ni lipi limeandikwa vizuri?', 'Mamaanapikachakula.', 'Mama anapika chakula.'], 'Spoken Kiswahili runs words together; the child writes the stream as he hears it.', 'Put a finger space after every word.', 'Acha nafasi ya kidole kati ya neno na neno.', 'Kuna maneno mangapi hapa?'),
        m(`${C}_TURN_${tag}`, 'Turns b and d (or p and q) round: dada written "baba" or "bada".', ['Andika neno "dada".', 'bada', 'dada'], 'Mirror letters are common in early writing; the child has not fixed the direction.', 'Teach d as "c then a tall line"; trace it in sand.', 'Herufi d huanza kama c, kisha mstari mrefu.', 'Herufi hii inaangalia upande gani?'),
        m(`${C}_LINE_${tag}`, 'Writes letters floating above the line or of mixed sizes, so the line goes up and down.', ['Maandishi nadhifu yanakaa wapi?', 'popote kwenye ukurasa', 'juu ya mstari, herufi zikiwa na ukubwa sawa'], 'The child writes fast and does not look at the line.', 'Trace the line with a finger first; every letter sits on it.', 'Kila herufi ikae juu ya mstari.', 'Herufi zako zinakaa wapi?'),
      ],
      pack: p('The child forms each letter from the right starting point, sits it on the line, leaves a finger space after each word, and checks before the clean copy.',
        ['Holds the pencil well and writes his own name.', 'Andika jina lako.', 'the child writes his name'],
        ['three-line paper', 'letter shapes traced in sand or air', 'a model passage on the board'],
        ['Look at the model.', 'Write each letter on the line.', 'Leave a space after each word.', 'Check and write the clean copy.'],
        [theme, 'copying the date from the board', 'writing a note to a parent'],
        [line, ['Point at the first letter.', 'Herufi hii inaanzaje?'], 'The child writes the line neatly and reads it back.'],
        [[`Andika vizuri: ${line}`, line, 'neat writing'], ['Unaacha nini kati ya maneno?', 'nafasi', 'spacing']]),
    });
}

// ---------------------------------------------------------------- nafasi: pambizo, aya, nafasi kati ya maneno
export function nafasi({ G, sub, tag, letters, pre, theme, words, split }) {
  const C = `M${G}_NAF`;
  return s(sub, 'PAMBIZO_AYA', 'Andika kifungu ukizingatia pambizo, aya na nafasi kati ya maneno', letters,
    rule(`Writes a passage of up to ${words} words that keeps out of the margin, leaves space between words, starts a new aya for a new idea and breaks a long word at the end of a line only between syllables`),
    ['tambua pambizo na aya', 'chagua mpangilio sahihi', 'andika kifungu (mwalimu anasahihisha)'], ['application'], {
      pre,
      mis: [
        m(`${C}_MARGIN_${tag}`, 'Writes into the margin, from the edge of the page.', ['Pambizo ni nini?', 'sehemu ya kuandikia kwanza', 'nafasi iliyoachwa ukingoni mwa ukurasa bila maandishi'], 'The child wants to fit more on the page and does not see the margin line as a rule.', 'Colour the margin; nothing may enter the coloured strip.', 'Usiandike ndani ya pambizo.', 'Mstari wa pambizo uko wapi?'),
        m(`${C}_NOAYA_${tag}`, 'Writes everything in one block with no new aya.', ['Unaanza aya mpya lini?', 'sianzi; ninaandika kila kitu pamoja', 'ninapoanza wazo jipya'], 'The child has not been shown that a new idea gets a new aya.', 'Give a passage with two ideas; the child marks where the second starts.', 'Wazo jipya, aya mpya.', 'Wazo jipya linaanza wapi?'),
        m(`${C}_EVERYLINE_${tag}`, 'Starts every sentence on a new line, as if each were an aya.', ['Kila sentensi ianze mstari mpya?', 'ndiyo', 'hapana; sentensi za wazo moja hufuatana katika aya moja'], 'Early copying from the board was one sentence a line.', 'Rewrite three sentences about one idea as one aya.', 'Sentensi za wazo moja hukaa pamoja katika aya moja.', 'Sentensi hizi zinahusu wazo moja?'),
        m(`${C}_SPLIT_${tag}`, `Breaks a word at the end of a line in the middle of a syllable (${split[1]}).`, ['Neno ni refu na mstari umeisha. Ni mgawanyo upi sahihi?', split[1], split[0]], 'The child cuts where the space ends, not at a syllable.', 'Clap the syllables first; break only between two claps, with a dash.', 'Gawa neno kati ya silabi na uweke kistari.', 'Silabi za neno hili ni zipi?'),
      ],
      pack: p('The child marks the margin first, writes inside it with spaces between words, and starts a new aya for each new idea.',
        ['Writes a sentence with spaces between words.', 'Andika: Mama anapika.', 'Mama anapika.'],
        ['a page with the margin coloured', 'a model passage with two aya', 'syllable claps for a long word'],
        ['Find the margin.', 'Write the first idea.', 'Start a new aya for the next idea.', 'Check the margin and spaces.'],
        [theme, 'writing in the exercise book', 'a short letter to a friend'],
        [split[0], ['Point at the dash.', 'Kwa nini neno limegawanywa hapa?'], 'The child writes two aya about the theme inside the margin.'],
        [['Pambizo ni nini?', 'nafasi ukingoni mwa ukurasa', 'margin'], ['Unaanza aya mpya lini?', 'wazo jipya linapoanza', 'paragraph']]),
    });
}

// ---------------------------------------------------------------- alama za uakifishi: kikomo, kiulizi (or both)
// mark: 'kikomo' | 'kiulizi' | 'uakifishi'; q: a question; st: a statement
export function alama({ G, sub, tag, letters, pre, theme, mark, q, st, words }) {
  const C = `M${G}_ALA`;
  const all = {
    STOPQ: m(`${C}_STOPQ_${tag}`, 'Ends a question with a kikomo.', ['Weka alama sahihi: Unaenda wapi', 'Unaenda wapi.', 'Unaenda wapi?'], 'The child ends every sentence the same way.', 'Read the sentence aloud: if the voice rises and asks, it takes a kiulizi.', 'Swali huishia kwa kiulizi (?).', 'Sentensi hii inauliza au inaeleza?'),
    QST: m(`${C}_QST_${tag}`, 'Puts a kiulizi after a statement.', ['Weka alama sahihi: Mimi ninaenda sokoni', 'Mimi ninaenda sokoni?', 'Mimi ninaenda sokoni.'], 'The child uses ? as a decoration or thinks any sentence about himself is a question.', 'Ask: does the sentence want an answer? If not, kikomo.', 'Sentensi ya kueleza huishia kwa kikomo (.).', 'Sentensi hii inataka jibu?'),
    REPORTED: m(`${C}_REPORTED_${tag}`, 'Puts a kiulizi after a reported question (Mama aliniuliza ninaenda wapi?).', ['Weka alama sahihi: Mama aliniuliza ninaenda wapi', 'Mama aliniuliza ninaenda wapi?', 'Mama aliniuliza ninaenda wapi.'], 'The question word wapi makes the child think the sentence is a question; it only tells that one was asked.', 'Compare "Unaenda wapi?" (asked now) with "Aliniuliza ninaenda wapi." (told).', 'Sentensi hii inaeleza kwamba swali liliulizwa; huishia kwa kikomo.', 'Ni nani anauliza sasa hivi?'),
    NOSTOP: m(`${C}_NOSTOP_${tag}`, 'Runs sentences together with no kikomo.', ['Ni lipi limeandikwa vizuri?', 'Juma alienda shuleni alisoma vizuri alirudi nyumbani', 'Juma alienda shuleni. Alisoma vizuri. Alirudi nyumbani.'], 'The child writes as he speaks, one long breath.', 'Read the writing aloud; where the breath stops, put a kikomo.', 'Kila sentensi huishia kwa kikomo.', 'Wazo la kwanza linaishia wapi?'),
    LINE: m(`${C}_LINE_${tag}`, 'Puts a kikomo at the end of every line of writing, not at the end of the sentence.', ['Kikomo huwekwa wapi?', 'mwishoni mwa kila mstari wa daftari', 'mwishoni mwa sentensi'], 'The line of the book looks like the end of a sentence.', 'Write one sentence that runs over two lines; the child finds where it really ends.', 'Kikomo huwekwa sentensi inapoisha, si mstari.', 'Sentensi hii inaisha wapi?'),
    CAP: m(`${C}_CAP_${tag}`, 'Writes a small letter after a kikomo or kiulizi.', ['Ni lipi sahihi?', `${st} mama alifurahi.`, `${st} Mama alifurahi.`], 'The child does not link the mark to the capital that follows it.', 'Every kikomo is a gate: the next word starts big.', 'Baada ya kikomo, herufi kubwa.', 'Neno linalofuata kikomo linaanza kwa herufi gani?'),
    MANY: m(`${C}_MANY_${tag}`, 'Puts several kiulizi (???) for a strong question.', ['Ni lipi sahihi?', `${q.slice(0, -1)}???`, q], 'Text messages and cartoons use many marks; the child copies them.', 'One question, one kiulizi; show a page from the class reader.', 'Swali moja, kiulizi kimoja.', 'Kiulizi kimoja kinatosha?'),
  };
  const pick = { kikomo: ['NOSTOP', 'LINE', 'CAP', 'STOPQ'], kiulizi: ['STOPQ', 'QST', 'REPORTED', 'MANY', 'CAP'], uakifishi: ['NOSTOP', 'STOPQ', 'QST', 'CAP', 'LINE'] }[mark];
  const nm = { kikomo: 'Tumia kikomo na herufi kubwa ipasavyo katika maandishi', kiulizi: 'Tumia alama ya kiulizi ipasavyo katika maandishi', uakifishi: 'Tumia kikomo, kiulizi na herufi kubwa ipasavyo katika maandishi' }[mark];
  return s(sub, 'ALAMA', nm, letters,
    rule(`Tells a question from a statement, ends each with its mark (? or .), starts the next sentence with a capital, and writes a passage of about ${words} words with the marks in place`),
    ['weka alama sahihi', 'chagua sentensi iliyoakifishwa vizuri', 'andika kifungu (mwalimu anasahihisha)'], ['application', 'discrimination'], {
      pre, mis: pick.map(k => all[k]),
      pack: p('The child reads each sentence aloud and asks: does it want an answer? Then he puts ? or . and starts the next one big.',
        ['Writes a short sentence with a capital at the start.', 'Andika: Baba analima.', 'Baba analima.'],
        ['a question card and a statement card', 'the marks . and ? cut out to place', 'a passage with the marks missing'],
        ['Read the sentence aloud.', 'Ask: does it ask or tell?', 'Put the mark.', 'Start the next sentence with a capital.'],
        [theme, 'writing questions for a class interview', 'a note home'],
        [q, ['Point at the end of the sentence.', 'Sentensi hii inaishia kwa alama gani?'], 'The child writes one question and one statement about the theme with their marks.'],
        [[`Weka alama: ${q.slice(0, -1)}`, q, 'kiulizi'], [`Weka alama: ${st.slice(0, -1)}`, st, 'kikomo']]),
    });
}

// ---------------------------------------------------------------- imla and tahajia: writing words with their right spelling
// mode: 'imla' (the teacher reads, the child writes) | 'tahajia' (spelling in his own writing) | 'maneno' (writing single words)
// mt: [word, mother-tongue spelling]  nasal: [word, word without the nasal]  vowel: [word with a long vowel, short spelling, meaning]
export function tahajia({ G, sub, tag, id, letters, pre, theme, mode, mt, nasal, vowel, words }) {
  const C = `M${G}_TAH`;
  const nm = { imla: 'Andika maneno yanayotamkwa kwenye imla kwa tahajia sahihi', tahajia: 'Andika insha fupi kwa tahajia sahihi za maneno', maneno: 'Andika maneno kwa tahajia sahihi' }[mode];
  return s(sub, id || (mode === 'imla' ? 'IMLA' : 'TAHAJIA'), nm, letters,
    rule(`Writes ${mode === 'imla' ? 'the words the teacher reads' : 'the words of his own writing'} (about ${words} words) with the right letters: the Kiswahili sound and not the home sound, the nasal kept (nd, mb, ng), long vowels doubled and ng' with its apostrophe`),
    ['chagua tahajia sahihi', 'sahihisha neno', mode === 'imla' ? 'imla (mwalimu anasoma)' : 'andika (mwalimu anasahihisha)'], ['recall', 'application'], {
      pre,
      mis: [
        m(`${C}_MT_${tag}`, `Spells the word with the sound of his first language: "${mt[0]}" written "${mt[1]}".`, [`Ni tahajia ipi sahihi?`, mt[1], mt[0]], 'The child writes as he says the word; if his first language merges the two sounds, the letter is a guess.', 'Keep a list of the class\'s hard pairs (l/r, s/sh, z/dh, s/th); say each word slowly before writing.', `Andika "${mt[0]}" kama linavyotamkwa kwa Kiswahili sanifu.`, 'Unasikia sauti gani hapa?', undefined, MT),
        m(`${C}_NASAL_${tag}`, `Drops the nasal: "${nasal[0]}" written "${nasal[1]}".`, ['Ni tahajia ipi sahihi?', nasal[1], nasal[0]], 'The n or m before a consonant is soft and quick; the child does not hear it.', 'Hum the nasal before the word (mmm-bwa, nnn-dege).', `"${nasal[0]}" lina sauti ya pua mwanzoni.`, 'Unasikia sauti ya pua?', undefined, MT),
        m(`${C}_VOWEL_${tag}`, `Writes a long vowel short, so the word changes: "${vowel[0]}" written "${vowel[1]}".`, [`Andika neno lenye maana ya "${vowel[2]}".`, vowel[1], vowel[0]], 'The child hears the length but does not know it is shown by two letters.', 'Clap the two vowels as two beats; compare a word with one and two vowels.', `"${vowel[0]}" lina irabu mbili zinazofuatana.`, 'Irabu ngapi unasikia?'),
        m(`${C}_NGAPOS_${tag}`, "Writes ng' without the apostrophe (ngombe for ng'ombe), or puts it where it does not belong (ng'oma for ngoma).", ['Ni tahajia ipi sahihi ya mnyama anayetupa maziwa?', 'ngombe', "ng'ombe"], "Ng' and ng are two sounds; the apostrophe looks like dirt on the page to the child.", "Say ng'ombe and ngoma: the first has no g sound; mark it with the apostrophe.", "Ng'ombe huandikwa na kibainishi: ng'.", 'Unasikia /g/ katika neno hili?'),
        m(`${C}_JOIN_${tag}`, 'Joins two words into one, or splits one word into two (kwasababu; mwana funzi).', ['Ni lipi sahihi?', 'Nilichelewa kwasababu ya mvua.', 'Nilichelewa kwa sababu ya mvua.'], 'In speech the words run together; the child has not seen each written apart.', 'Count the words aloud with a finger for each before writing.', '"Kwa sababu" ni maneno mawili.', 'Ni maneno mangapi hapa?'),
      ],
      pack: p('The child says the word slowly, listens for the hard part (the sound, the nasal, the long vowel), writes it and reads it back.',
        ['Writes simple open-syllable words (mama, baba, kaka).', 'Andika: kaka', 'kaka'],
        ['a list of hard pairs', 'syllable claps', 'a word wall of the theme words'],
        ['Listen to the word.', 'Say it slowly.', 'Write it syllable by syllable.', 'Read it back and check.'],
        [theme, 'a weekly spelling test', 'writing a shopping list'],
        [syllables(nasal[0]), ['Point at the nasal.', 'Unasikia nini mwanzoni?'], 'The child writes three theme words read by the teacher and checks them.'],
        [[`Andika: ${mt[0]}`, mt[0], 'sound'], [`Andika: ${nasal[0]}`, nasal[0], 'nasal']]),
    });
}

// ---------------------------------------------------------------- a short insha or kifungu
// type: 'kisa' | 'masimulizi' | 'maelezo' | 'picha' (a paragraph from a picture)  title: a title; mix: [English word sentence, Kiswahili]
// tense: [past sentence that slips to present, all past]
export function insha({ G, sub, tag, id = 'INSHA', letters, pre, theme, type, title, words, mix, tense }) {
  const C = `M${G}_INS`;
  const nm = { kisa: 'Andika kisa kifupi chenye mwanzo, kati na mwisho', masimulizi: 'Andika insha fupi ya masimulizi', maelezo: 'Andika insha fupi ya maelezo', picha: 'Andika kifungu kifupi kutokana na picha' }[type];
  const first = type === 'maelezo'
    ? m(`${C}_STORY_${tag}`, 'Tells a story of events instead of describing the thing (what it is, what it looks like, what it is for).', [`Insha ya maelezo kuhusu "${title}" inaanza vipi?`, 'Siku moja nilienda mjini...', `${title} ni kitu ambacho...`], 'Every insha the child has written before was a story.', 'Give three question cards: Ni nini? Kinaonekanaje? Kinatumiwaje? One aya each.', 'Insha ya maelezo inaeleza kitu kilivyo na kazi yake.', 'Unaeleza kitu au unasimulia tukio?')
    : type === 'picha'
      ? m(`${C}_NAME_${tag}`, 'Lists the things in the picture (mti, mtoto, mbwa) instead of writing sentences about what is happening.', ['Ni kipi ni kifungu kuhusu picha?', 'mti. mtoto. mbwa.', 'Mtoto anacheza na mbwa chini ya mti.'], 'Naming pictures was the earlier task; the child has not moved to sentences.', 'Ask "Nani? Anafanya nini? Wapi?" for each part of the picture.', 'Kifungu kina sentensi zinazoeleza kinachotokea.', 'Mtoto anafanya nini?')
      : m(`${C}_LIST_${tag}`, 'Writes a list of sentences with no beginning, middle and end.', ['Kisa kizuri kina sehemu gani?', 'sentensi nyingi tu', 'mwanzo, kati na mwisho'], 'The child thinks length makes a story.', 'Plan on three boxes: mwanzo (who, where), kati (what happened), mwisho (how it ended).', 'Kisa kina mwanzo, kati na mwisho.', 'Kisa chako kinaishaje?');
  return s(sub, id, nm, letters,
    rule(`Writes a ${type === 'picha' ? 'short paragraph about a picture' : `short ${type === 'kisa' ? 'story' : `insha ya ${type}`} of about ${words} words`} on ${theme}: a title that fits, sentences in order, one tense, Kiswahili words only, capitals and kikomo in place`),
    ['chagua kichwa kifaacho', 'panga sentensi', 'tambua kosa', 'andika (mwalimu anasahihisha)'], ['application', 'sequencing'], {
      pre,
      mis: [first,
        m(`${C}_TITLE_${tag}`, 'Writes no title, or a title that does not fit the writing.', [`Kichwa kipi kinafaa insha kuhusu ${theme}?`, 'Insha', title], 'The child thinks the word "insha" or the date is the title.', 'Read the finished writing and ask: what is it about in three words?', `Kichwa kinasema insha inahusu nini: ${title}.`, 'Insha yako inahusu nini?'),
        m(`${C}_HALAFU_${tag}`, 'Joins every sentence with "na halafu", so the writing is one long sentence.', ['Ni lipi limeandikwa vizuri?', 'Tuliamka na halafu tukaoga na halafu tukaenda sokoni.', 'Tuliamka asubuhi. Tulioga, kisha tukaenda sokoni.'], 'Spoken retelling joins events with na halafu; the child writes as he talks.', 'Give a word bank: kwanza, kisha, baadaye, mwishowe; one per sentence.', 'Tumia kikomo na maneno kama kisha, baadaye.', 'Unaweza kuweka kikomo wapi hapa?'),
        m(`${C}_TENSE_${tag}`, 'Slips from one tense to another in the middle of the writing (past -li- to present -na-, or habitual hu- to past).', ['Ni lipi sahihi?', tense[0], tense[1]], 'The child thinks of the events as he writes and the tense of the moment comes in.', 'Underline every verb; all the tense markers should match.', 'Tumia wakati mmoja katika insha nzima.', 'Kitendo hiki kilitokea lini?'),
        m(`${C}_MIX_${tag}`, 'Puts English or Sheng words into the Kiswahili writing.', ['Sahihisha:', mix[0], mix[1]], 'The child does not know the Kiswahili word and fills the gap with the one he knows.', 'Keep a word bank of theme words on the board before writing.', `Kwa Kiswahili: ${mix[1]}`, 'Neno hilo ni la lugha gani?', undefined, ENG),
      ],
      pack: p('The child plans in three boxes, writes one idea per sentence in one tense with Kiswahili words, then reads it back and corrects it.',
        ['Writes a sentence with a capital and a kikomo.', 'Andika sentensi kuhusu shule yako.', 'Shule yangu ni nzuri.'],
        ['a three-box plan', 'a word bank of theme words and kwanza, kisha, mwishowe', 'a model insha on the board'],
        ['Plan: who, where, what happened, end.', 'Write the title.', 'Write one idea per sentence.', 'Read it back and correct.'],
        [theme, 'a class story wall', 'a story to read to a parent'],
        [title, ['Point at the title.', 'Insha hii itahusu nini?'], 'The child writes the first two sentences of the insha and reads them aloud.'],
        [[`Kichwa kifaacho insha kuhusu ${theme} ni?`, title, 'title'], ['Sahihisha: ' + tense[0], tense[1], 'tense']]),
    });
}

// ================================================================ SARUFI
// One grammar point of lower primary. The error types are written once below (what the child does, why, how to help, the line
// the child reads, the tutor's question); each sub-strand passes its own example for each error it uses:
//   sarufi({ G, sub, tag, id, name, what, letters, pre, theme, ex: { CODE: [question, wrong, right], ... }, model, checks })
// model: [a model sentence, the word to point at, the tutor's question]; checks: two [question, answer, shows]
const GRAM = {
  // nafsi (pronouns and the subject marker)
  PREFIX: ['The pronoun and the subject marker on the verb do not agree (Wao anacheza).', 'The child learns the pronoun as a word and the verb as a fixed form; he has not seen that the verb changes with the person.', 'Colour the pronoun and the verb\'s first syllable the same colour: yeye a-, wao wa-, mimi ni-, sisi tu-, wewe u-, nyinyi m-.', 'Kitendo hufuata nafsi: Wao wanacheza; Yeye anacheza.', 'Mwanzo wa kitendo unakubaliana na nani?', ENG],
  NUMBER: ['Uses the one-person pronoun for many people, or the reverse.', 'The child has not linked the pronoun pair to one and many.', 'Point at one child, then at a group, saying the right pronoun each time.', 'Mtu mmoja ni yeye; watu wengi ni wao.', 'Ni mtu mmoja au watu wengi?', TC],
  PERSON: ['Repeats the pronoun of the question in the answer (Wewe unaenda wapi? Wewe ninaenda sokoni.) instead of switching to mimi.', 'The child copies the words he heard; changing person between speakers is new.', 'Ask and answer in pairs with a pointing finger: wewe points out, mimi points to the chest.', 'Ukiulizwa kwa "wewe", unajibu kwa "mimi".', 'Unazungumza kuhusu nani, wewe mwenyewe?', TC],
  GENDER: ['Thinks yeye is for a boy only and looks for another word for a girl (English he/she).', 'English separates he and she; Kiswahili yeye is any one person.', 'Use yeye for Amina and for Juma in the same lesson; ask the class to find the difference (there is none).', 'Yeye ni mtu mmoja, mvulana au msichana.', 'Neno yeye linaweza kumtaja msichana?', ENG],
  OBJ: ['Puts the pronoun after the verb instead of the object marker inside it (Mama alimpa mimi for Mama alinipa).', 'English says "gave me"; the child adds the separate word instead of -ni- inside the verb.', 'Show the verb with the object marker coloured: a-li-ni-pa; compare with the wrong form.', 'Tunasema "Mama alinipa", si "alimpa mimi".', 'Alama ya mtendwa iko wapi ndani ya kitendo?', ENG],
  // umoja na wingi
  WRONGCLASS: ['Makes the plural with the prefix of another noun class (kitabu -> watabu).', 'The child knows that wa- makes people plural and uses it for everything; the ngeli of the noun is not yet known.', 'Sort noun cards into ngeli families (m-wa, ki-vi, li-ma, n-n) and say each plural aloud.', 'Kila ngeli ina wingi wake: kitabu - vitabu, mtoto - watoto.', 'Neno hili ni la ngeli gani?', TC],
  NUMWORD: ['Shows the plural only with a number word and leaves the noun singular (kitabu mbili).', 'English and some first languages keep the noun and add a number; Kiswahili changes the noun and the number agrees.', 'Line up two books: the child says vitabu viwili; then three: vitabu vitatu.', 'Nomino hubadilika pia: vitabu viwili.', 'Nomino inabadilikaje ikiwa zaidi ya moja?', MT],
  AGREE: ['Changes the noun but not the verb or the word that agrees with it (Vitabu kimeanguka).', 'The child changes the word he was asked to change and stops there.', 'Colour the noun prefix and the verb prefix the same; read the sentence and check every coloured part.', 'Sentensi nzima hubadilika: Vitabu vimeanguka.', 'Kitendo kinakubaliana na nomino?', TC],
  NCLASS: ['Gives a noun of the n-n class a plural prefix (nyumba -> manyumba), or changes an irregular noun wrongly (jicho -> majicho).', 'The child expects every plural to look different; n-n nouns stay the same and some li-ma nouns change their stem.', 'Keep a short list of the same-in-both nouns (nyumba, ndizi, kalamu) and the irregular ones (jicho - macho, jino - meno).', 'Baadhi ya nomino hazibadiliki, na baadhi hubadilika kwa njia yake.', 'Neno hili linabadilikaje katika wingi?', TC],
  REVERSE: ['Takes the plural form for the singular (miti for one tree, vitabu for one book).', 'The child heard the plural more often (a tree is usually among trees) and learnt it as the name.', 'Hold one object, then many; the child names each.', 'Kimoja ni kitabu; vingi ni vitabu.', 'Ni kimoja au ni vingi?', TC],
  // vionyeshi
  CLASSDEM: ['Uses the people word (huyu, yule) for a thing (kiti huyu).', 'Huyu was the first pointing word learnt; the child uses it for anything.', 'Point at a child (huyu) and at a chair (hiki); then sort pictures by the pointing word they take.', 'Kitu cha ngeli ya ki-vi huonyeshwa kwa hiki; mtu huonyeshwa kwa huyu.', 'Ni mtu au ni kitu?', TC],
  NUMDEM: ['Uses the one-thing pointing word with a plural noun (watoto huyu).', 'The child changes the noun but not the pointing word.', 'Pair the forms on cards: huyu-hawa, yule-wale, hiki-hivi, hili-haya.', 'Watoto ni wengi: watoto hawa.', 'Ni mmoja au ni wengi?', TC],
  DIST: ['Mixes near and far pointing words (huyu for someone far away; yule for someone close).', 'The child has not linked the forms to distance from the speaker.', 'Stand near one child and far from another; point and say huyu and yule; then swap places.', 'Huyu ni karibu nami; yule ni mbali.', 'Yuko karibu nawe au mbali?', TC],
  HII: ['Uses hii for every noun (kitabu hii, mtoto hii), as in town Kiswahili.', 'Hii is the pointing word heard most in town speech, where the noun class is dropped.', 'Read pairs aloud: kitabu hiki, mtoto huyu, nyumba hii; the child hears the match.', 'Kitabu hiki; mtoto huyu; nyumba hii.', 'Neno hili la kuonyesha linakubaliana na nomino?', MT],
  // vimilikishi
  CONCPOSS: ['Uses the wrong noun-class form of the possessive (kitabu yangu for kitabu changu).', 'Town Kiswahili uses yangu, yako, yake for every noun; the child has not seen the ngeli agreement.', 'Pair nouns and possessives by colour: kitabu changu, kiti chake, mtoto wangu.', 'Kitabu changu; kiti chake: kimilikishi hufuata ngeli.', 'Nomino ni ya ngeli gani?', MT],
  NUMPOSS: ['Leaves the possessive singular with a plural noun (vitabu changu).', 'The child changes the noun and forgets the possessive.', 'Change one object to many in front of the child; both words change.', 'Vitabu vyangu: vyote viwili hubadilika.', 'Vitabu ni vingi; kimilikishi kimebadilika?', TC],
  OWNER: ['Uses the possessive of the wrong owner (-ake for something that is his own, -ake for many owners).', 'The child has not linked -angu, -ako, -ake, -etu, -enu, -ao to who owns the thing.', 'Hold up an object: Ni cha nani? Answer with the owner first, then the possessive.', 'Mwenye kitu ni nani? Mimi: changu; yeye: chake; wao: chao.', 'Kitu hiki ni cha nani?', TC],
  ORDERPOSS: ['Puts the possessive before the noun (yangu kalamu), in English word order.', 'English puts "my" before the noun; Kiswahili puts it after.', 'Build the phrase with cards: the noun first, then the possessive.', 'Nomino kwanza, kimilikishi baadaye: kalamu yangu.', 'Neno lipi linaanza?', ENG],
  // vivumishi
  CONCADJ: ['Gives the adjective the people prefix whatever the noun (kiti mzuri).', 'Mzuri is the form the child hears most (mtoto mzuri) and is used everywhere.', 'Match noun and adjective by colour: kiti kizuri, mtoto mzuri, vitu vizuri.', 'Kivumishi hufuata ngeli: kiti kizuri.', 'Kiti ni ngeli gani?', TC],
  NADJ: ['Gives an n-n noun the m- form of the adjective (nyumba mzuri for nyumba nzuri).', 'The n- prefix and its sound changes (nzuri, ndefu, nyeupe) are new to the child.', 'Read pairs aloud: nyumba nzuri, kalamu ndefu, nguo nyeupe.', 'Nyumba nzuri; nguo nyeupe.', 'Nomino hii inabadilika katika wingi?', TC],
  ORDERADJ: ['Puts the adjective before the noun (mzuri mtoto), in English word order.', 'English puts the describing word first.', 'Build with cards: noun first, then the adjective.', 'Nomino kwanza: mtoto mzuri.', 'Neno lipi linaanza?', ENG],
  PLADJ: ['Leaves the adjective singular with a plural noun (watoto mzuri).', 'The child changes the noun only.', 'Change the noun to many and ask the child to change every word that goes with it.', 'Watoto wazuri: vyote hubadilika.', 'Nomino imebadilika; kivumishi je?', TC],
  OPPADJ: ['Picks the opposite member of the pair (mrefu for a short person).', 'The pair is learnt together and the two words are swapped.', 'Act the pairs with the body: stretch for refu, crouch for fupi.', 'Angalia picha tena na uchague neno linalofaa.', 'Picha inaonyesha nini?', TC],
  VOWELADJ: ['Writes the colour word without the sound change (kiti kieupe for kiti cheupe; nguo eupe for nguo nyeupe).', 'The child sticks the prefix on the stem; the sound change when ki- or n- meets the vowel (ki + eupe = cheupe) is new.', 'Say the joined forms slowly: ki-eupe becomes cheupe; n-eupe becomes nyeupe.', 'Kiti cheupe; nguo nyeupe; mtoto mweusi.', 'Kiambishi kinaungana vipi na -eupe?', TC],
  // ukanushaji
  FINALA: ['Keeps the final -a in the negative present (hasoma for hasomi).', 'The child adds the negative prefix and leaves the rest of the verb as it was.', 'Show the pair with the end of the verb circled: anasoma - hasomi.', 'Katika ukanushaji wa wakati uliopo, -a inakuwa -i: hasomi.', 'Herufi ya mwisho ya kitendo hiki ni ipi?', TC],
  KEEPNA: ['Keeps the tense marker -na- in the negative (hanasomi for hasomi).', 'The child negates by adding ha- to the whole positive verb.', 'Cross out na in the positive form and change the end.', 'Hasomi: hakuna -na- katika ukanushaji huu.', 'Kuna -na- katika ukanushaji?', TC],
  SIPLUS: ['Negates by putting si before the positive verb (Yeye si anasoma).', 'Si is the negative the child knows (si mimi), so he puts it in front of any sentence.', 'Show si as the negative of ni (Yeye si mwalimu) and ha- as the negative of a verb.', 'Kitendo hukanushwa kwa ha-: Yeye hasomi.', 'Ni kitendo au ni "ni"?', TC],
  PERSNEG: ['Uses the negative prefix of another person (Wao hasomi for hawasomi; Mimi hasomi for sisomi).', 'The child learnt one negative form (ha-) and uses it for all persons.', 'Table of persons: si-, hu-, ha-, hatu-, ham-, hawa-; the child points before writing.', 'Wao hawasomi; mimi sisomi.', 'Ni nafsi gani hapa?', TC],
  // vihusishi
  DROPYA: ['Leaves out ya (juu meza for juu ya meza).', 'In fast speech ya is quick and the child does not hear it.', 'Say the phrase slowly with a clap on ya.', 'Tunasema "juu ya meza".', 'Neno gani limekosekana kati ya "juu" na "meza"?', TC],
  KWA: ['Uses kwa in place of ya (ndani kwa sanduku).', 'Kwa is a common joining word and the child reaches for it.', 'Pair cards: juu ya, ndani ya, mbele ya; kwa is not among them.', 'Tunasema "ndani ya sanduku".', 'Neno linalofuata "ndani" ni lipi?', TC],
  SWAPPOS: ['Mixes the place words (juu ya for chini ya, mbele ya for nyuma ya).', 'The pairs are learnt together and swapped.', 'Place a real ball on, under, in, in front of a box; the child says where.', 'Angalia tena mpira ulipo.', 'Mpira uko wapi hasa?', TC],
  DOUBLENI: ['Adds -ni to the noun as well as ndani ya (ndani ya sandukuni).', 'Both ways of saying "in" are known; the child uses both at once.', 'Show the two ways side by side: sandukuni, or ndani ya sanduku; never both.', 'Sema "ndani ya sanduku" au "sandukuni", si vyote viwili.', 'Umetumia njia mbili kwa pamoja?', TC],
  // vielezi (vizuri, vibaya, polepole, haraka)
  ADVADJ: ['Uses the adjective form for how something is done (anaimba mzuri for anaimba vizuri).', 'Mzuri is the form the child knows best and he uses it for actions too.', 'Ask "Anaimbaje?" (how) and "Ni mtoto wa namna gani?" (what kind); the first takes vizuri, the second mzuri.', 'Kitendo hufanywa vizuri: anaimba vizuri.', 'Unaeleza kitendo au mtu?', TC],
  ADVOPP: ['Picks the opposite word of the pair (polepole for haraka, vizuri for vibaya).', 'The pairs are learnt together and swapped.', 'Act the pairs: walk polepole, then haraka; the child names each.', 'Angalia kitendo tena na uchague neno linalofaa.', 'Kitendo kinafanywa kwa namna gani?', TC],
  ADVKI: ['Writes the manner word with ki- (kizuri) instead of vi- (vizuri).', 'Ki-/vi- are heard as one family and the child picks the wrong member.', 'Show that vizuri and vibaya always start with vi- when they tell how something is done.', 'Tunasema "vizuri" na "vibaya".', 'Neno hili linaeleza kitendo kilivyofanywa?', TC],
  ADVTHING: ['Uses the manner word for a quality of a thing (Chakula ni vizuri for Chakula ni kizuri).', 'Vizuri is heard everywhere ("ni vizuri") and the child uses it for things too.', 'Sort sentences: how something is done (vizuri) and what a thing is like (kizuri, mzuri, nzuri).', 'Kitu kizuri: chakula ni kizuri; kitendo kizuri: anapika vizuri.', 'Unaeleza kitu au jinsi kitendo kilivyofanywa?', TC],
  // maneno yanayoashiria vitendo (Grade 1)
  VNOUN: ['Picks a thing word as the action word (in "Mama anapika ugali" chooses ugali).', 'The child looks for the word he knows best, often the thing he can picture.', 'Act the sentence: the word you can do is the action word.', 'Neno la kitendo ni lile tunaloweza kulifanya: anapika.', 'Unaweza kulifanya neno hilo?', TC],
  VBARE: ['Writes the bare verb with no person marker (Mama pika ugali for Mama anapika ugali).', 'The command form (pika!) is heard most at home and the child uses it in every sentence.', 'Colour the a-na- in front of the verb; read the sentence with and without it.', 'Tunasema "Mama anapika", si "Mama pika".', 'Ni nani anapika, na neno linaanzaje?', TC],
  VAGREE: ['Gives the verb the marker of the wrong person or number (Mama wanapika; Watoto anacheza).', 'The child has not linked the start of the verb to who is doing it.', 'Point at the doer, then at the start of the verb; they must match (mmoja a-, wengi wa-).', 'Mtu mmoja: anapika; watu wengi: wanapika.', 'Anayefanya ni mmoja au wengi?', TC],
  VADJ: ['Takes a describing word for an action word (in "Sahani ni safi" chooses safi as the action).', 'Any word after the noun looks like what the noun "does".', 'Ask "Inafanya nini?" If there is no answer, there is no action word.', 'Neno la kitendo linaonyesha kinachofanywa, kama "anaosha".', 'Sahani inafanya kitendo gani?', TC],
  // vinyume vya vitendo
  NEGATE: ['Gives the negative of the verb (hafungui) instead of its opposite action (funga).', 'The child thinks "opposite" means "not doing it".', 'Act it: fungua the door, then funga it; not doing anything is not the opposite.', 'Kinyume cha kitendo ni kitendo kingine: fungua - funga.', 'Ni kitendo gani kinarudisha hali ilivyokuwa?', TC],
  ADDUA: ['Makes an opposite by adding -ua to any verb (keti -> ketua).', 'Fungua/funga and vaa/vua show a pattern, and the child uses it everywhere.', 'Sort pairs into two piles: made with -ua (funga-fungua) and different words (keti-simama).', 'Kinyume cha keti ni simama.', 'Je, "ketua" ni neno la Kiswahili?', TC],
  SAME: ['Gives a word of the same meaning as the opposite (simama - inuka).', 'The child knows the words go together but not that they mean the same.', 'Act both words: if the action is the same, it is not the opposite.', 'Kinyume ni kitendo kinachopingana.', 'Vitendo hivi vinafanana au vinapingana?', TC],
  NOUNOPP: ['Gives a place or thing word as the opposite of an action (ingia - nje).', 'Ingia and nje are heard together in "ingia ndani, toka nje".', 'Ask "Ni kitendo?" before accepting: the opposite of an action is an action.', 'Kinyume cha ingia ni toka.', 'Jibu lako ni kitendo?', TC],
};
export function sarufi({ G, sub, tag, id, name, what, letters, pre, theme, ex, model, checks, forms }) {
  const C = `M${G}_SAR`;
  return s(sub, id, name, letters, rule(what),
    forms || ['chagua neno sahihi', 'jaza pengo', 'sahihisha sentensi', 'tunga sentensi (mwalimu anasahihisha)'], ['application', 'discrimination'], {
      pre,
      mis: Object.entries(ex).map(([code, e]) => {
        const g = GRAM[code] || (() => { throw new Error(`no grammar error type ${code}`); })();
        return m(`${C}_${code}_${tag}`, g[0], e, g[1], g[2], `${g[3]} (${e[2]})`, g[4], undefined, g[5]);
      }),
      pack: p(`The child finds the word the grammar point depends on (the person, the noun and its ngeli, one or many) before choosing the form.`,
        model[3] || ['Names everyday things and people in Kiswahili.', 'Hiki ni nini? (kiti)', 'kiti'],
        ['picture and word cards sorted by ngeli or person', 'colour matching of the parts that agree', `a short passage on ${theme} using the words`],
        ['Find the noun or person.', 'Ask: one or many? Which ngeli or person?', 'Choose the form.', 'Read the whole sentence back.'],
        [theme, 'a game with real objects in class', 'talking with a parent at home'],
        [model[0], [`Point at "${model[1]}".`, model[2]], 'The child makes his own sentence with the form and reads it aloud.'],
        checks),
    });
}

// A prerequisite in the grade below, by outcome ('SUB.letter'): once that grade is built, the skill that carries the outcome
// is named instead (build the grades 1, 2, 3 in order and rebuild to move the refs from outcomes to skills).
import { readFileSync as _read } from 'node:fs';
const _cache = {};
export function down(g, key) {
  const j = _cache[g] || (_cache[g] = JSON.parse(_read(new URL(`../../curriculum/kiswahili/g${g}.json`, import.meta.url), 'utf8')));
  const code = `KISW.G${g}.${key}`, sub = key.slice(0, key.lastIndexOf('.'));
  for (const s of j.sub_strands) for (const k of s.skills || []) if (k.outcomes.includes(code)) return `G${g}:${k.code.slice(`KISW.G${g}.`.length)}`;
  if (!j.sub_strands.some(s => s.code === `KISW.G${g}.${sub}`)) throw new Error(`no Grade ${g} sub-strand ${sub}`);
  return `G${g}o:${key}`;
}
