// Kiswahili skill kinds that come back theme after theme and grade after grade (18 Nov 2026, offline, no model call).
// The KICD design repeats the same kind of sub-strand in many themes: matamshi bora for a pair of sounds, kusoma kwa ufasaha,
// kusoma kwa mapana, kusoma kidijitali, an insha of one type, masimulizi. The errors a child makes in one are the errors the
// child makes in the next, so each kind is written once here, in depth (the skill, four or five misconceptions with what the child
// writes and why, the teaching pack), and each sub-strand fills in its own theme, words and examples. The codes carry the theme
// (M5_MAT_SWAP_T1) so they never clash inside a grade. Used by scripts/data/kiswahili-g<n>/*.mjs.
import { m, p, s, TC, MT, ENG } from './kiswahili-depth-lib.mjs';

// ---------------------------------------------------------------- matamshi bora: a pair (or pairs) of sounds
// w: [[wordA, wordB, meaningA, meaningB], [..]] two minimal pairs, wordA with the first sound, wordB with the second;
// tw: a kitanzandimi (tongue twister) on the sounds; notw: a sentence that is not one (it does not repeat the sounds)
// letters: outcome letters; nd: true when the pair is a sound and its nasal partner (d/nd, b/mb, j/nj, g/ng)
export function matamshi({ G, sub, tag, id = 'MATAMSHI', sounds, label, w, tw, notw, letters, pre, theme, nd = false, cause }) {
  const [a, b] = sounds, [w1, w2, m1, m2] = w[0], [v1, v2, n1, n2] = w[1];
  const L = label || `/${a}/ na /${b}/`;
  const C = `M${G}_MAT`;
  const why = cause || (nd
    ? `The nasal (n- or m-) before ${b.replace(/^n|^m/, '')} is soft and quick; a child who does not hear it writes and says the word without it, or adds it where it does not belong, and the meaning changes.`
    : `/${a}/ and /${b}/ are made at the same place in the mouth and differ in one feature only; several Kenyan first languages do not separate the two, so the child hears one sound and writes either letter.`);
  return s(sub, id, `Tofautisha sauti ${L} katika silabi, maneno na vitanzandimi`, letters,
    `Hears, says and writes the right sound in syllables and words with ${L} (${w1} and ${w2}, ${v1} and ${v2}), picks the word that matches the meaning, and tells a real kitanzandimi from an ordinary sentence, in 8 of 10 new items.`,
    ['chagua neno ulilosikia', 'chagua maana ya neno', 'jaza pengo kwa neno sahihi', 'tambua kitanzandimi'], ['recall', 'discrimination'], {
      pre,
      mis: [
        m(`${C}_SWAP_${tag}`, `Hears or says /${b}/ for /${a}/, so ${w1} (${m1}) becomes ${w2} (${m2}).`, [`Mwalimu anasema: "${w1}". Umesikia neno lipi?`, w2, w1], why, `Say the pair slowly with a hand on the throat (or watching the lips); the child says which word was heard before writing.`, `Sikiliza tena: "${w1}" ina sauti /${a}/. "${w2}" ni neno lingine lenye maana nyingine.`, `Neno "${w1}" lina maana gani, na "${w2}" lina maana gani?`, `"${w1}" ni ${m1}; "${w2}" ni ${m2}. Sauti moja hubadilisha maana.`, MT),
        m(`${C}_SPELL_${tag}`, `Writes the word with the letter of the other sound (${v2} where ${v1} is meant).`, [`Jaza pengo: ___ maana yake ni "${n1}".`, v2, v1], `The child spells as he speaks; if the two sounds are one sound in his speech, the letter is a guess.`, `Pair each spelling with its meaning on a card; the child sorts the cards by meaning, then by letter.`, `Neno lenye maana ya "${n1}" ni "${v1}". "${v2}" lina maana ya "${n2}".`, `Ukiandika "${v2}", msomaji ataelewa nini?`, undefined, MT),
        m(`${C}_SAME_${tag}`, `Thinks the two words are one word said in two ways, with one meaning.`, [`"${v1}" na "${v2}" ni maneno yenye maana moja?`, 'ndiyo', 'hapana'], `The child has heard both said by different people for the same thing and takes the difference for an accent.`, `Use both words in two sentences that cannot swap: the child says which sentence breaks.`, `Hapana. "${v1}" ni ${n1}, na "${v2}" ni ${n2}.`, `Ukibadilisha neno moja kwa jingine katika sentensi, maana inabaki ileile?`),
        m(`${C}_TWISTER_${tag}`, `Takes any long sentence for a kitanzandimi, though it does not repeat the target sounds.`, ['Ni kipi ni kitanzandimi?', notw, tw], `The child thinks a kitanzandimi is any sentence that is hard to say, not one built by repeating close sounds.`, `Underline the target sounds in the real kitanzandimi; count them; the ordinary sentence has few or none.`, `Kitanzandimi hurudia sauti zinazokaribiana, kama ${L}, ili kiwe kigumu kutamka.`, 'Ni sauti gani zinarudiwa katika sentensi hii?'),
        m(`${C}_SYLL_${tag}`, nd ? `Splits the syllable with the nasal wrongly (${w2.slice(0, 1)}-${w2.slice(1)} instead of keeping the nasal with its consonant).` : `Breaks the word into syllables at the wrong place, so the target sound is lost (${w1.slice(0, 2)}-${w1.slice(2)} read as two wrong parts).`,
          [`Neno "${nd ? w2 : w1}" lina silabi zipi?`, nd ? `${w2.slice(0, 1)}-${w2.slice(1)}` : `${w1.slice(0, 1)}-${w1.slice(1)}`, syllables(nd ? w2 : w1)], `In Kiswahili every syllable ends in a vowel, and a nasal with its consonant (nd, mb, nj, ng) starts one syllable; the child splits by letters, not by sound.`, `Clap the word: one clap per vowel; the nasal goes with the consonant after it.`, `Kila silabi ya Kiswahili huishia kwa irabu: ${syllables(nd ? w2 : w1)}.`, 'Kila silabi inaishia kwa herufi gani?'),
      ],
      pack: p(`The child hears the one feature that separates ${L} and checks the meaning of the word before writing it.`,
        ['Says the five vowels and reads open syllables (ba, be, bi, bo, bu).', `Soma: ${syllables(w1)}`, w1],
        [`a pair card: ${w1} / ${w2}`, 'a hand on the throat to feel the voice (or the lips for a nasal)', `a picture for each meaning (${m1}, ${m2})`],
        ['Listen to the whole word.', `Ask: which sound, /${a}/ or /${b}/?`, 'Think of the meaning in the sentence.', 'Write it and read it back.'],
        [theme, 'a class reading aloud', 'a word game in the playground'],
        [`${w1} - ${w2}`, ['Point at the first letter of each word.', `Neno lipi lina maana ya "${m1}"?`], `The child writes both words under their pictures and says each one.`],
        [[`Andika neno lenye maana ya "${n2}".`, v2, 'spelling by meaning'], ['Ni kipi ni kitanzandimi?', tw, 'kitanzandimi']]),
    });
}
// a word split into Kiswahili syllables: each ends in a vowel; ng' and nasal clusters go with the consonant
export function syllables(word) {
  const out = []; let cur = '';
  for (const ch of word) { cur += ch; if (/[aeiou]/i.test(ch)) { out.push(cur); cur = ''; } }
  if (cur) out.push(cur);
  return out.join('-');
}

// ---------------------------------------------------------------- kusoma kwa ufasaha: reading a passage aloud
// letters: the reading-aloud outcomes (b..e or a..d); text: a short theme sentence pair [question sentence, exclamation]
export function ufasaha({ G, sub, tag, id = 'KUSOMA_KWA_SAUTI', letters, pre, theme, sentence, question, exclaim, lr }) {
  const C = `M${G}_UFS`;
  return s(sub, id, 'Soma kifungu kwa sauti kwa matamshi bora, kasi ifaayo, sauti ifaayo na ishara', letters,
    `Reads a short passage aloud at a speaking pace, pauses at the koma and the kikomo, raises the voice for a question and shows feeling for an exclamation, says every sound clearly (no l for r), and uses a matching gesture, judged by the teacher with the KICD rubric; in the app picks the better reading of a line in 8 of 10 new items.`,
    ['chagua usomaji bora', 'tambua kosa la usomaji', 'kusoma kwa sauti (mwalimu anasikiliza)'], ['application', 'evaluation'], {
      pre,
      mis: [
        m(`${C}_WORDBYWORD_${tag}`, 'Reads word by word or syllable by syllable, so the sentence has no meaning when heard.', [`Ni usomaji upi ni wa ufasaha: "${sentence}"?`, sentence.split(' ').join(' ... '), sentence], 'The child is still decoding each word and has not yet learnt to read a phrase as one piece.', 'Echo reading: the teacher reads a phrase, the child repeats it as one breath; then phrase-cut the passage with slashes.', 'Usomaji wa ufasaha husoma kundi la maneno kwa pamoja, kama tunavyozungumza.', 'Ukisoma neno moja moja, msikilizaji anaelewa sentensi?'),
        m(`${C}_RACE_${tag}`, 'Reads as fast as possible and thinks the fastest reader is the best.', ['Ni kasi ipi ifaayo ya kusoma kifungu darasani?', 'haraka iwezekanavyo', 'kasi ya kuzungumza, ili kila neno lisikike'], 'Reading races in class reward speed; the child has not been asked whether listeners understood.', 'Time two readings: one very fast, one at speaking pace; listeners answer one question after each.', 'Kasi ifaayo ni ile ya kuzungumza: si haraka mno, si polepole mno.', 'Wasikilizaji waliweza kuelewa uliposoma haraka hivyo?'),
        m(`${C}_FLAT_${tag}`, 'Reads a question and an exclamation in the same flat voice as a statement.', [`Sentensi "${question}" inasomwa vipi?`, 'kwa sauti ileile ya sentensi ya kawaida', 'sauti hupanda mwishoni kwa sababu ni swali'], 'The child looks at the words and not at the mark at the end.', 'Read the same words three ways (. ? !); the child points at the mark that matches each reading.', 'Kiulizi (?) hupandisha sauti mwishoni; alama ya hisi (!) huonyesha hisia.', 'Alama iliyo mwishoni mwa sentensi hii ni ipi?'),
        m(`${C}_NOPAUSE_${tag}`, 'Reads on through the koma and the kikomo without a pause.', [`Unasoma: "${exclaim}" Unasimama wapi kidogo?`, 'hapana mahali, unasoma moja kwa moja', 'kwenye koma na kwenye kikomo au alama ya hisi'], 'The marks are read as decoration; the child has not linked them to breath.', 'Clap once at a koma, twice at a kikomo while reading together.', 'Simama kidogo kwenye koma, na zaidi kwenye kikomo.', 'Koma inakuambia ufanye nini unaposoma?'),
        m(`${C}_SOUND_${tag}`, lr ? `Says /l/ for /r/ or /r/ for /l/ while reading (${lr[0]} read as ${lr[1]}).` : 'Drops or changes a sound while reading (a mother-tongue sound in place of the Kiswahili one).', lr ? [`Neno "${lr[0]}" linatamkwa vipi?`, lr[1], lr[0]] : ['Neno "dhahabu" linatamkwa vipi?', 'zahabu', 'dhahabu'], 'The first language of the child does not separate these sounds, so the reading carries the home sound.', 'Make a list of the passage words with the hard sound; practise them before reading the passage.', lr ? `Tamka "${lr[0]}" kama lilivyoandikwa; "${lr[1]}" ni neno jingine au si neno.` : 'Tamka kila sauti kama ilivyoandikwa: dh si z.', 'Sikiliza tofauti kati ya maneno haya mawili. Yanatofautiana wapi?', undefined, MT),
      ],
      pack: p('The child reads a phrase as one breath, lets the marks set the pauses and the voice, and checks the listener understood.',
        ['Reads short words with every sound clear.', 'Soma: "Mama anapika."', 'Mama anapika.'],
        ['the passage with phrase slashes', 'the marks . , ? ! circled in colour', 'a recording of the child played back'],
        ['Read the sentence silently first.', 'Find the marks.', 'Read phrase by phrase aloud.', 'Ask a listener one question about it.'],
        [theme, 'reading at the school assembly', 'reading a story to a younger sibling'],
        [question, ['Point at the kiulizi.', 'Sauti yako inafanya nini hapa?'], 'The child reads the sentence aloud twice: once as a statement, once as the question.'],
        [[`Sentensi "${exclaim}" inasomwa kwa hisia kwa sababu ya alama ipi?`, 'alama ya hisi', 'marks'], ['Kasi ifaayo ya kusoma ni ipi?', 'kasi ya kuzungumza', 'pace']]),
    });
}

// ---------------------------------------------------------------- kusoma kwa mapana: choosing and reading a text of one's choice
// kinds: the text kinds of the theme; topic: the theme; book: a book title on the theme; detail/message: a detail and the message
export function mapana({ G, sub, tag, id = 'MATINI_YA_KUCHAGUA', letters, pre, topic, book, detail, message, word }) {
  const C = `M${G}_MAP`;
  return s(sub, id, 'Chagua matini ya kusoma na ueleze ujumbe wake', letters,
    `Chooses a text that suits his reading level and interest from its title, blurb and first page (not from the cover alone), tells the kind of text (hadithi, shairi, makala, gazeti), says its message in one sentence, and works out a new word from the sentence around it, in 8 of 10 new items.`,
    ['chagua matini ifaayo', 'chagua ujumbe', 'tambua aina ya matini', 'eleza maana ya neno'], ['evaluation', 'inference'], {
      pre,
      mis: [
        m(`${C}_COVER_${tag}`, 'Chooses a book by its cover picture or its thickness only.', [`Unataka kusoma kuhusu ${topic}. Utachaguaje kitabu?`, 'kwa picha nzuri ya jalada', 'kwa kusoma anwani, maelezo ya nyuma na ukurasa wa kwanza'], 'Nobody has shown the child the title, the blurb and the first page as clues.', 'Hold up two books; read the title and the back of each aloud; the child chooses and says which clue decided it.', 'Anwani, maelezo ya nyuma ya kitabu na ukurasa wa kwanza hukuambia kitabu kinahusu nini.', 'Jalada linakuambia nini kuhusu maneno yaliyo ndani?'),
        m(`${C}_LEVEL_${tag}`, 'Chooses a text far above his reading level and gives up after a page.', [`Ukisoma ukurasa wa kwanza wa "${book}" na hujui maneno mengi sana, ufanye nini?`, 'endelea tu hata kama huelewi', 'chagua matini nyingine iliyo ya kiwango chako'], 'The child thinks a harder book is a better book, or chooses the book a friend chose.', 'The five-finger check: on one page, a finger for each unknown word; five fingers means the book is too hard for now.', 'Matini ifaayo ni ile unayoweza kuisoma na kuielewa ukiwa peke yako.', 'Ni maneno mangapi kwenye ukurasa huu ambayo hujui?'),
        m(`${C}_TITLEMSG_${tag}`, 'Gives the title as the message of the text.', [`Ujumbe wa matini "${book}" ni upi?`, book, message], 'The title is the only sentence about the whole text that the child is sure of.', 'Ask what the writer wants the reader to learn or do; the title only names the topic.', 'Anwani hutaja mada; ujumbe ni funzo au wazo kuu ambalo mwandishi anataka ulipate.', 'Mwandishi anataka ujifunze nini baada ya kusoma?'),
        m(`${C}_DETAIL_${tag}`, 'Gives one detail of the text as its message.', [`Ni ipi ni ujumbe wa matini kuhusu ${topic}?`, detail, message], 'The detail was striking and is remembered; the child has not asked what the whole text is about.', 'Two boxes: "ujumbe" (one) and "maelezo" (many); the child sorts sentences from the text.', 'Ujumbe unahusu matini yote; jambo moja dogo ni maelezo tu.', 'Je, jambo hili linahusu matini yote au sehemu moja tu?'),
        m(`${C}_KIND_${tag}`, 'Does not tell one kind of text from another (takes a newspaper report for a story, or a poem for a story).', ['Matini yenye beti na mishororo ni ya aina gani?', 'hadithi', 'shairi'], 'The child has met most texts as "kitabu" and has not been shown the signs of each kind.', 'Lay out a story, a poem, a newspaper page and a dictionary; the child names one sign of each.', 'Shairi lina beti na mishororo; hadithi ina aya; gazeti lina habari na tarehe.', 'Matini hii imepangwa kwa aya au kwa beti?'),
        m(`${C}_WORD_${tag}`, `Guesses a new word from how it looks, not from the sentence it is in (${word[0]}).`, [`Katika matini: "${word[1]}" Neno "${word[0]}" lina maana gani?`, word[3], word[2]], 'The child matches the word to a word it looks like instead of reading the sentence around it.', 'Cover the word; the child reads the sentence and says what word would fit; then compares.', `Soma sentensi nzima: "${word[0]}" hapa ni ${word[2]}.`, 'Sentensi inayozunguka neno hili inakuambia nini?'),
      ],
      pack: p('The child judges a text by its title, blurb and first page, then reads it for one message.',
        ['Reads a short story and answers who and what.', 'Hadithi hii inamhusu nani?', 'mhusika mkuu'],
        ['three real books from the class library', 'the five-finger check on one page', 'a one-sentence message strip'],
        ['Read the title and the back.', 'Read the first page; count unknown words.', 'Read it all.', 'Say the message in one sentence.'],
        [`the class library corner (${topic})`, 'the county library', 'a newspaper at home'],
        [book, ['Point at the title and the back cover.', 'Kitabu hiki kinahusu nini?'], 'The child reads the first page and shows the five-finger check.'],
        [[`Ni ipi ni ujumbe wa matini kuhusu ${topic}: "${detail}" au "${message}"?`, message, 'message'], ['Matini yenye beti ni ya aina gani?', 'shairi', 'kind of text']]),
    });
}

// ---------------------------------------------------------------- kusoma kidijitali: opening a file, searching safely, reading
export function kidijitali({ G, sub, tag, id = 'KUSOMA_KIDIJITALI', letters, pre, topic, file, keywords }) {
  const C = `M${G}_KID`;
  return s(sub, id, 'Fungua faili, sakura kwenye tovuti salama na usome matini ya kidijitali', letters,
    `Opens a saved file with the passage (finds the folder, double-clicks the file), searches a safe site with two or three key words, ignores pop-ups and adverts, and reads the passage for its message, in 8 of 10 new items or tasks.`,
    ['chagua hatua sahihi', 'panga hatua', 'chagua maneno ya kutafutia', 'tambua kosa'], ['procedure', 'evaluation'], {
      pre,
      mis: [
        m(`${C}_FOLDER_${tag}`, 'Mixes up a folder and a file: looks for the passage on the screen without opening the folder it is in.', [`Kifungu "${file}" kimehifadhiwa ndani ya folda "Kiswahili". Utakifunguaje?`, `bonyeza "${file}" kwenye skrini ya mwanzo`, `fungua folda "Kiswahili", kisha bonyeza mara mbili faili "${file}"`], 'The child has only used apps on a phone, where there are no folders.', 'Show a real folder (a box file) holding papers; then the same on the screen.', 'Faili huhifadhiwa ndani ya folda; fungua folda kwanza, kisha faili.', 'Faili hii iko ndani ya nini?'),
        m(`${C}_SEARCH_${tag}`, 'Types a whole long question, with spelling mistakes, into the search box.', [`Unatafuta habari kuhusu ${topic}. Utaandika nini kwenye kisanduku cha kutafutia?`, `naomba unipe habari zote kuhusu ${topic} tafadhali`, keywords], 'The child talks to the search box as to a person.', 'Underline the two or three words that carry the meaning; search with those; compare the results.', 'Andika maneno mawili au matatu muhimu tu, na uyaandike kwa tahajia sahihi.', 'Ni maneno gani muhimu katika swali hili?'),
        m(`${C}_POPUP_${tag}`, 'Clicks a pop-up or an advert that says he has won a prize.', ['Ukiwa unasoma, ujumbe unatokea: "Umeshinda simu! Bonyeza hapa." Ufanye nini?', 'bonyeza ili kupokea simu', 'usibonyeze; funga ujumbe na umwambie mwalimu au mzazi'], 'Offers of prizes are exciting and the child does not know they are traps.', 'Show two screenshots, one real page and one trap; the child finds three signs of the trap.', 'Ujumbe wa zawadi usiotarajiwa ni mtego; usiubonyeze.', 'Je, ulishiriki shindano lolote? Kwa nini ushinde simu?'),
        m(`${C}_SITE_${tag}`, 'Uses any site that comes up and gives his name, school or phone number when a site asks.', ['Tovuti inakuuliza jina lako kamili, shule yako na nambari ya simu ya mzazi kabla ya kusoma hadithi. Ufanye nini?', 'jaza ili usome hadithi', 'usijaze; tumia tovuti salama aliyokupa mwalimu'], 'The child wants the story and does not see personal details as worth protecting.', 'List the details that are private; practise saying no to a form.', 'Usimpe mtu yeyote mtandaoni jina lako kamili, shule yako wala nambari ya simu.', 'Kwa nini tovuti ya hadithi ihitaji nambari ya simu?'),
        m(`${C}_ORDER_${tag}`, 'Puts the steps of finding and reading a passage in the wrong order (reads before searching, or searches before switching on).', ['Ni hatua ipi huja kwanza?', 'andika maneno ya kutafutia', 'washa tarakilishi na ufungue kivinjari'], 'The child has watched an adult do the steps quickly and remembers the parts, not the order.', 'Step cards: the child orders them, then does them on a real device.', 'Washa kifaa, fungua kivinjari, andika maneno muhimu, chagua tovuti salama, soma.', 'Unaweza kutafuta kabla ya kufungua kivinjari?'),
      ],
      pack: p('The child opens the folder before the file and searches with two or three key words on a safe site.',
        ['Switches a computer or tablet on and off safely.', 'Ni kitufe kipi huwasha tarakilishi?', 'kitufe cha kuwasha'],
        ['a real box file with papers (folder and file)', 'step cards', 'two screenshots: a real page and a trap'],
        ['Open the folder.', 'Double-click the file.', 'Search with key words on a safe site.', 'Read and say the message.'],
        [`the school computer lab (${topic})`, 'a tablet at home', 'a cyber café'],
        [`Kiswahili > ${file}`, ['Point at the folder.', 'Tutafungua nini kwanza?'], 'The child opens the folder and the file on a real device or in order on cards.'],
        [[`Andika maneno muhimu ya kutafuta habari kuhusu ${topic}.`, keywords, 'key words'], ['Ujumbe "Umeshinda!" ukitokea, ufanye nini?', 'usibonyeze; umwambie mwalimu', 'safety']]),
    });
}

// ---------------------------------------------------------------- insha (one type), Grades 4 to 6: recognising and writing it
// type: 'masimulizi' | 'maelezo' | 'wasifu' | 'barua' (kirafiki) | 'rasmi' (barua rasmi) | 'baruapepe'
// title: a title on the theme; past/now: one sentence of the story in the past and the same in the present (masimulizi);
// good/weak: a describing sentence with detail and without (maelezo, wasifu); focus: extra error keys to use
export function insha({ G, sub, tag, id, type, letters, pre, theme, title, past, now, good, weak, steps, agree, focus = [] }) {
  const C = `M${G}_INS`;
  const T = { masimulizi: 'insha ya masimulizi', maelezo: 'insha ya maelezo', wasifu: 'insha ya wasifu', barua: 'barua ya kirafiki', rasmi: 'barua rasmi', baruapepe: 'baruapepe' }[type];
  const B = {
    STORYFACT: () => m(`${C}_FACTS_${tag}`, 'Writes facts or an explanation where a story of events is asked.', [`Ni sentensi ipi ni mwanzo wa insha ya masimulizi yenye anwani "${title}"?`, weak || 'Watu wengi hupenda michezo kwa sababu huleta afya.', past], 'The child knows a lot about the topic and writes what he knows instead of telling what happened.', 'Ask: who, where, what happened first, then, in the end? A story answers these; an explanation does not.', 'Masimulizi husimulia matukio yaliyotokea: nani, wapi, nini kilitokea.', 'Ni nani anafanya nini katika sentensi hii?'),
    TENSE: () => m(`${C}_TENSE_${tag}`, 'Tells a past story in the present tense (-na-), or mixes -na- and -li- in one story.', [`Ni sentensi ipi inafaa katika masimulizi ya jambo lililotokea jana: "${title}"?`, now, past], 'The child writes as he speaks while remembering, and English stories in class are told in the present too.', 'Circle every verb; check its tense marker against the time words (jana, siku moja).', 'Jambo lililotokea husimuliwa kwa wakati uliopita: -li-.', 'Jambo hili lilitokea lini? Kitenzi kinaonyesha wakati gani?', undefined, ENG),
    ORDER: () => m(`${C}_ORDER_${tag}`, 'Puts the events in an order that cannot have happened (the end before the start), with no linking words.', [`Ni mpangilio upi wa matukio unafaa katika insha "${title}"?`, steps ? [...steps].reverse().join(', ') : 'tulirudi nyumbani, tuliondoka asubuhi, tulifika', steps ? steps.join(', ') : 'tuliondoka asubuhi, tulifika, tulirudi nyumbani'], 'The child writes events as they come to mind; nobody has asked for a plan first.', 'Plan with three boxes (mwanzo, kati, mwisho) and linking words (kwanza, kisha, hatimaye) before writing.', 'Panga matukio yanavyofuatana, na utumie maneno kama kwanza, kisha na hatimaye.', 'Ni jambo lipi lilitokea kwanza?'),
    END: () => m(`${C}_END_${tag}`, 'Ends the insha abruptly ("Mwisho." or "The end") with no closing paragraph (hitimisho).', [`Ni ipi ni hitimisho bora la insha "${title}"?`, 'Mwisho.', `Tangu siku hiyo, nimejifunza ${type === 'masimulizi' ? 'kuwa mwangalifu kila wakati' : 'mengi kuhusu jambo hili'}.`], 'Storybooks for young readers end with "Mwisho" and the child copies that.', 'Show three endings; the child picks the one that closes the main idea or the lesson.', 'Hitimisho hufunga insha kwa kueleza funzo au hisia, si kwa neno "Mwisho" tu.', 'Msomaji anajifunza nini katika aya ya mwisho?'),
    TITLE: () => m(`${C}_TITLE_${tag}`, 'Writes the title as a full sentence with a full stop, or leaves it out.', ['Ni anwani ipi imeandikwa ipasavyo?', `${title.toLowerCase()}.`, title.toUpperCase()], 'The child treats the title as the first sentence of the insha.', 'Show where the title sits and how it is written (herufi kubwa, no kikomo, often underlined).', 'Anwani huandikwa juu katikati, bila kikomo, kwa herufi kubwa.', 'Anwani ni sentensi au ni jina la insha?'),
    CODEMIX: () => m(`${C}_MIX_${tag}`, 'Puts English or Sheng words in the insha (tulienda kwa party, mathe, form).', ['Ni sentensi ipi imeandikwa kwa Kiswahili sanifu?', 'Mathe alinipea form ya kujaza.', 'Mama alinipa fomu ya kujaza.'], 'The child speaks a mixed language at home and with friends and does not notice the switch in writing.', 'Underline each non-Kiswahili word; find the Kiswahili word together (mama, sherehe, fomu).', 'Insha huandikwa kwa Kiswahili sanifu, bila maneno ya Kiingereza wala Sheng.', 'Ni neno lipi hapa si la Kiswahili sanifu?', undefined, ENG),
    STORY: () => m(`${C}_STORY_${tag}`, `Tells a story of what happened where the insha should ${type === 'wasifu' ? 'describe the person, place or thing' : 'explain or describe'}.`, [`Ni sentensi ipi inafaa katika ${T} kuhusu "${title}"?`, past || 'Siku moja tulienda sokoni tukapotea.', good], 'Stories are the kind of writing the child has done most and he falls back on it.', `Ask what the reader should know about the topic at the end: ${type === 'wasifu' ? 'what it looks like, what it is for' : 'what it is, how it works or is done'}.`, `${T[0].toUpperCase() + T.slice(1)} hueleza ${type === 'wasifu' ? 'jinsi kitu au mtu alivyo' : 'jambo lilivyo au jinsi linavyofanywa'}, si matukio ya siku moja.`, 'Sentensi hii inaeleza au inasimulia?'),
    DETAIL: () => m(`${C}_DETAIL_${tag}`, 'Describes with empty words (kizuri sana, kibaya) and no detail that makes a picture.', [`Ni sentensi ipi inajenga picha dhahiri kuhusu "${title}"?`, weak, good], 'The child knows the thing well and assumes the reader sees it too.', 'Five senses chart: what do you see, hear, smell, touch, taste? Turn one row into a sentence.', 'Tumia vivumishi na maelezo ya rangi, umbo, ukubwa na sauti ili msomaji aone picha.', 'Msomaji anaona nini akisoma sentensi hii?'),
    AGREE: () => m(`${C}_AGREE_${tag}`, 'Uses a describing word that does not agree with its noun (bendera mzuri, miti mrefu).', ['Ni sentensi ipi ni sahihi?', agree ? agree[1] : 'Bendera yetu ni mzuri sana.', agree ? agree[0] : 'Bendera yetu ni nzuri sana.'], 'The child uses one form of the adjective (m-) for every noun, as he hears it for people.', 'Find the noun first, then its ngeli, then the prefix of the adjective.', 'Kivumishi hupatana na nomino yake: bendera nzuri, miti mirefu, mtoto mzuri.', 'Nomino hii iko katika ngeli gani?'),
    STEPS: () => m(`${C}_STEPS_${tag}`, 'Gives the steps of how to do something in a mixed-up order.', [`Ni mpangilio upi unafaa katika maelezo ya "${title}"?`, steps ? [...steps].reverse().join(', ') : 'kausha, osha, loweka', steps ? steps.join(', ') : 'loweka, osha, kausha'], 'The child remembers the steps as a set, not as a sequence.', 'Act out the steps; number them; write them with kwanza, kisha, mwishowe.', 'Maelezo ya jinsi ya kufanya jambo hufuata hatua kwa mpangilio.', 'Unaweza kufanya hatua hii kabla ya ile?'),
    OFFTOPIC: () => m(`${C}_OFFTOPIC_${tag}`, 'Puts in points that are not about the title.', [`Katika ${T} yenye anwani "${title}", ni sentensi ipi haifai?`, 'Rafiki yangu ana baiskeli mpya ya rangi ya bluu.', good || past], 'The child adds whatever he remembers so the insha is long enough.', 'Read each sentence and ask: does it tell the reader about the title? Cross out the ones that do not.', 'Kila sentensi ya insha inapaswa kuhusu anwani.', 'Sentensi hii inahusiana vipi na anwani?'),
    PARAS: () => m(`${C}_PARAS_${tag}`, 'Writes the whole insha as one paragraph with no utangulizi, kiini and hitimisho.', [`Insha "${title}" ina sehemu zipi?`, 'aya moja ndefu', 'utangulizi, kiini (aya kadhaa) na hitimisho'], 'The child writes until the space is full and has not planned the parts.', 'Fold the page into three; one part in each; one idea per paragraph in the middle.', 'Insha ina utangulizi, kiini chenye aya kadhaa, na hitimisho.', 'Aya yako ya kwanza inafanya kazi gani?'),
  };
  const L = {
    barua: [
      m(`${C}_FORMAL_${tag}`, 'Writes to a friend in the stiff words of an official letter (Mheshimiwa, Kuhusu:, Wako mtiifu).', ['Ni salamu ipi inafaa katika barua kwa rafiki?', 'Mheshimiwa Bwana,', 'Mpendwa rafiki yangu Amina,'], 'The child has seen official letters at school and thinks every letter is written that way.', 'Put a friendly and an official letter side by side; the child highlights the words that differ.', 'Barua ya kirafiki hutumia lugha ya kirafiki: Mpendwa rafiki, Wako akupendaye.', 'Unamwandikia nani? Ungezungumza naye hivi?'),
      m(`${C}_NOASK_${tag}`, 'Starts with the news straight after the greeting, with no asking after the friend (maulizo ya hali).', ['Baada ya salamu, ni sentensi ipi inafuata katika barua ya kirafiki?', 'Nataka kukueleza kuhusu safari yetu.', 'Hujambo? Natumai u buheri wa afya.'], 'The child goes to what he wants to say, as in a text message.', 'Order the parts on cards: anwani, tarehe, salamu, maulizo ya hali, ujumbe, hitimisho, jina.', 'Baada ya salamu, uliza hali ya rafiki yako kabla ya kueleza ujumbe.', 'Umemuuliza rafiki yako hali yake?'),
      m(`${C}_DATE_${tag}`, 'Leaves out the date or writes it in the middle of the letter.', ['Tarehe huandikwa wapi katika barua ya kirafiki?', 'mwishoni, baada ya jina', 'chini ya anwani ya mwandishi, upande wa kulia juu'], 'The date is not part of what the child wants to say, so he forgets it.', 'Label a model letter; the child places a date card on a blank layout.', 'Tarehe huandikwa chini ya anwani ya mwandishi, juu upande wa kulia.', 'Rafiki atajuaje barua iliandikwa lini?'),
      m(`${C}_SIGN_${tag}`, 'Ends with "Wako mtiifu" and a full name and title, as in an official letter.', ['Ni hitimisho lipi linafaa katika barua kwa rafiki?', 'Wako mtiifu, Bw. Juma Hamisi', 'Ni mimi rafiki yako, Juma'], 'Again the official model is the only one the child has copied.', 'Collect three friendly closings and keep them in the exercise book.', 'Barua ya kirafiki humalizika kwa "Ni mimi rafiki yako," na jina la kwanza.', 'Rafiki yako anakuita kwa jina gani?'),
    ],
    rasmi: [
      m(`${C}_ONEADDR_${tag}`, 'Writes only one address, or puts the receiver\'s address at the top right.', ['Barua rasmi ina anwani ngapi?', 'moja, ya mwandishi', 'mbili: ya mwandishi (kulia juu) na ya mpokeaji (kushoto)'], 'The friendly letter has one address and the child carries it over.', 'Label both addresses on a model; the child writes his own and the receiver\'s on a blank layout.', 'Barua rasmi ina anwani mbili: ya mwandishi kulia juu, ya mpokeaji kushoto chini yake.', 'Barua hii itamfikia nani? Anwani yake iko wapi?'),
      m(`${C}_NOREF_${tag}`, 'Leaves out the subject line (KUH: or YAH:) or writes it as a long sentence.', [`Ni kichwa kipi kinafaa katika barua rasmi kuhusu ${title.toLowerCase()}?`, 'Nimeandika barua hii kwa sababu ninataka kukueleza mambo mengi.', `KUH: ${title.toUpperCase()}`], 'The child does not know the reader of an official letter needs the subject before reading.', 'Underline the KUH: line on three real letters; it is short and in capitals.', 'Kichwa cha barua rasmi huanza KUH: au YAH: na huandikwa kwa herufi kubwa, kwa ufupi.', 'Msomaji atajuaje barua inahusu nini bila kuisoma yote?'),
      m(`${C}_CASUAL_${tag}`, 'Uses friendly words in an official letter (Mpendwa rafiki, Hujambo?, Wako akupendaye).', ['Ni salamu ipi inafaa katika barua kwa Mwalimu Mkuu?', 'Hujambo mwalimu wangu mpendwa!', 'Kwa Mwalimu Mkuu,'], 'The friendly letter is the first letter learnt and its words come first.', 'Sort salamu and closing cards into "kirafiki" and "rasmi".', 'Barua rasmi hutumia lugha rasmi: Kwa Mwalimu Mkuu, Wako mtiifu.', 'Ungemsalimu Mwalimu Mkuu hivi katika mkutano rasmi?'),
      m(`${C}_SIGNOFF_${tag}`, 'Ends with only a first name and no signature, or with "Ni mimi rafiki yako".', ['Barua rasmi humalizika vipi?', 'Ni mimi rafiki yako, Wanjiku', 'Wako mtiifu, sahihi, na jina kamili: Wanjiku Kamau'], 'The friendly closing is a habit.', 'Model the closing block (Wako mtiifu, sahihi, jina kamili) and have the child copy it once.', 'Barua rasmi humalizika kwa "Wako mtiifu," sahihi na jina kamili.', 'Mpokeaji atajuaje ni nani hasa aliyeandika?'),
    ],
    baruapepe: [
      m(`${C}_NOSUBJ_${tag}`, 'Leaves the subject box empty or writes the whole message in it.', ['Katika baruapepe, kisanduku cha "Kichwa" kinaandikwa nini?', 'ujumbe wote', `maneno machache yanayotaja ujumbe, kama "${title}"`], 'The child has used chat apps that have no subject line.', 'Show an inbox: the subject is all the reader sees before opening.', 'Kichwa cha baruapepe ni maneno machache yanayoeleza ujumbe unahusu nini.', 'Mpokeaji ataona nini kwanza kwenye sanduku lake?'),
      m(`${C}_ADDR_${tag}`, 'Writes a postal address and a date at the top, as in a paper letter.', ['Baruapepe huanza vipi?', 'S.L.P. 120, Nakuru, na tarehe juu kulia', 'salamu kwa mpokeaji, kama "Habari Amina,"'], 'The paper letter is the model the child knows.', 'Compare a paper letter and an email; the email programme adds the address and date.', 'Baruapepe haina anwani ya posta wala tarehe juu; kifaa huziweka chenyewe.', 'Kifaa kinaonyesha tarehe wapi?'),
      m(`${C}_TOFIELD_${tag}`, 'Puts the receiver\'s name, not the email address, in the "Kwa" box.', ['Kisanduku cha "Kwa" kinaandikwa nini?', 'Amina Otieno', 'amina.otieno@mfano.co.ke'], 'The child writes the person as on an envelope.', 'Show what an email address looks like (jina@mahali); practise reading it aloud.', 'Kisanduku cha "Kwa" huandikwa anwani ya baruapepe ya mpokeaji, yenye @.', 'Anwani ya baruapepe ina alama gani?'),
      m(`${C}_TEXTSPEAK_${tag}`, 'Writes in short chat forms (sawa, poa, nkt, 2moro) and no closing.', ['Ni sentensi ipi inafaa katika baruapepe?', 'Poa, tutaonana 2moro.', 'Asante. Tutaonana kesho.'], 'Chat habits come into the email.', 'Rewrite one chat message as a short email with a greeting and a closing.', 'Baruapepe huandikwa kwa lugha sahihi, na humalizika kwa hitimisho na jina.', 'Maneno haya yangeeleweka na kila mtu?'),
    ],
  };
  const keys = { masimulizi: ['STORYFACT', 'TENSE', 'ORDER', 'END'], maelezo: ['STORY', 'DETAIL', 'STEPS', 'OFFTOPIC'], wasifu: ['STORY', 'DETAIL', 'AGREE', 'OFFTOPIC'] }[type] || [];
  const mis = [...keys.map(k => B[k]()), ...(L[type] || []), ...focus.map(k => B[k]())];
  const nameOf = { masimulizi: 'Tambua na andika insha ya masimulizi', maelezo: 'Tambua na andika insha ya maelezo', wasifu: 'Tambua na andika insha ya wasifu', barua: 'Andika barua ya kirafiki kwa muundo na lugha ifaayo', rasmi: 'Andika barua rasmi kwa muundo na lugha ifaayo', baruapepe: 'Andika baruapepe kwa muundo na lugha ifaayo' }[type];
  const what = {
    masimulizi: 'a story of events in the past tense, in order, with a title, an opening, a middle and a closing that gives the lesson',
    maelezo: 'an explanation or description on the topic, in order, with detail that makes a picture and no point off the topic',
    wasifu: 'a description of a person, place or thing with describing words that agree with their nouns and no story of events',
    barua: 'a friendly letter with the address, date, greeting, asking after the friend, the news, and a friendly closing',
    rasmi: 'an official letter with two addresses, the date, a formal greeting, a KUH: line, the message and Wako mtiifu with a signature',
    baruapepe: 'an email with the receiver\'s address, a short subject, a greeting, the message in correct Kiswahili and a closing',
  }[type];
  return s(sub, id, nameOf, letters,
    `Tells ${T} from other kinds of writing and its parts, and writes ${what}; the teacher marks the writing with the KICD rubric, and in the app the child picks the right sentence, order or part in 8 of 10 new items.`,
    ['chagua sentensi ifaayo', 'panga sehemu au matukio', 'tambua kosa katika insha', 'kuandika (mwalimu anasahihisha)'], ['application', 'creation'], {
      pre, mis,
      pack: p(`The child plans ${T} before writing: the parts in order, then one idea at a time, then checks it against the type.`,
        ['Writes a correct sentence with a capital letter and a kikomo.', 'Andika sentensi moja kuhusu shule yako.', 'Shule yetu ina madarasa kumi.'],
        ['a model text with its parts labelled', 'a three-box plan (mwanzo, kiini, mwisho)', 'a checklist for the type'],
        ['Read the title and say the type.', 'Plan the parts.', 'Write one idea per paragraph.', 'Check against the checklist and correct.'],
        [theme, 'the class magazine', 'a letter or story for a family member'],
        [title, ['Point at the title.', `Insha hii ni ya aina gani, na itakuwa na sehemu zipi?`], `The child fills the three-box plan for "${title}".`],
        [[`Ni sentensi ipi inafaa katika ${T} kuhusu "${title}"?`, type === 'masimulizi' ? past : good || 'Mpendwa rafiki yangu,', 'type'], [`${T[0].toUpperCase() + T.slice(1)} ina sehemu zipi?`, type === 'barua' || type === 'rasmi' || type === 'baruapepe' ? 'anwani au kichwa, salamu, ujumbe, hitimisho' : 'utangulizi, kiini, hitimisho', 'parts']]),
    });
}

// ---------------------------------------------------------------- masimulizi (oral): listening to a narration and telling one
export function masimulizi({ G, sub, tag, id = 'MASIMULIZI', letters, pre, theme, story, message, detail, gesture }) {
  const C = `M${G}_MSM`;
  return s(sub, id, 'Sikiliza masimulizi kwa ujumbe na usimulie kwa ishara zifaazo', letters,
    `Listens to a short narration and gives its message (not a detail), retells it in order, and tells his own story on the topic in Kiswahili sanifu with gestures that match the words; the teacher scores the telling with the KICD rubric, and in the app the child picks the message, order or gesture in 8 of 10 new items.`,
    ['chagua ujumbe', 'panga matukio uliyosikia', 'chagua ishara ifaayo', 'kusimulia (mwalimu anasikiliza)'], ['listening', 'application'], {
      pre,
      mis: [
        m(`${C}_DETAIL_${tag}`, 'Gives a detail of the narration as its message.', [`Ulisikiliza masimulizi kuhusu ${story}. Ujumbe wake ni upi?`, detail, message], 'The detail was vivid; the child has not asked what the whole narration teaches.', 'After listening, ask: what did the speaker want us to learn? Then: what is one thing that happened?', 'Ujumbe ni funzo la masimulizi yote; jambo moja ni maelezo tu.', 'Msimulizi alitaka tujifunze nini?'),
        m(`${C}_ORDER_${tag}`, 'Retells the events in a mixed order, starting with the most exciting part.', ['Unaposimulia, unaanza na nini?', 'sehemu ya kusisimua zaidi', 'mwanzo: nani, wapi, lini'], 'The child jumps to the part that impressed him most.', 'Retell with three fingers: mwanzo, kati, mwisho.', 'Simulia kwa mpangilio: mwanzo, kati, mwisho.', 'Ni jambo lipi lilitokea kwanza?'),
        m(`${C}_GESTURE_${tag}`, 'Uses gestures or a face that do not match the words (smiles while telling a sad part, stands still for an action).', [`Unasimulia: "${gesture[0]}" Ishara ipi inafaa?`, gesture[2], gesture[1]], 'The child is nervous and does not link the body to the words.', 'Mirror game in pairs: one says a line, the other shows the feeling; swap.', 'Ishara na sura yako ziendane na unachosema.', 'Uso wako unaonyesha hisia gani hapa?'),
        m(`${C}_MIX_${tag}`, 'Mixes English or Sheng into the telling (Then tukaenda..., ilikuwa poa sana).', ['Ni sentensi ipi inafaa unaposimulia darasani?', 'Then tukaenda home, ilikuwa poa sana.', 'Kisha tukaenda nyumbani; ilikuwa siku nzuri sana.'], 'The child narrates as he talks with friends.', 'Record a telling; play it back; the child finds the non-Kiswahili words and replaces them.', 'Simulia kwa Kiswahili sanifu: kisha, nyumbani, nzuri.', 'Ni neno lipi si la Kiswahili?', undefined, ENG),
        m(`${C}_OFFTOPIC_${tag}`, `Tells a story that is not on the topic given (${theme}).`, [`Mada ni ${theme}. Ni masimulizi yapi yanafaa?`, 'Siku nilipotazama mechi ya mpira', `Siku ${story}`], 'The child tells the story he knows best, whatever the topic.', 'Write the topic on the board; before telling, the child says in one sentence how his story fits it.', 'Masimulizi yako yahusu mada uliyopewa.', 'Hadithi yako inahusianaje na mada?'),
      ],
      pack: p('The child listens for what the narration teaches, then tells his own in order with gestures that fit.',
        ['Answers who and what after hearing a short story.', 'Hadithi ilimhusu nani?', 'mhusika mkuu'],
        ['a short narration read aloud', 'three picture cards to order', 'a mirror or a partner for gestures'],
        ['Listen to the end.', 'Say the message in one sentence.', 'Plan your story in three parts.', 'Tell it with matching gestures.'],
        [theme, 'telling a story at the evening fire', 'the class sharing time'],
        [story, ['Point at the three picture cards.', 'Ni kipi kilitokea kwanza?'], 'The child orders the cards and retells the story with one gesture for each part.'],
        [[`Ujumbe wa masimulizi kuhusu ${story} ni upi?`, message, 'message'], ['Unaposimulia, unaanza na nini?', 'mwanzo: nani, wapi, lini', 'order']]),
    });
}
