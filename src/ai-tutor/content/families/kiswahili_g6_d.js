// ============================================================================
// KISWAHILI GRADE 6, KUSOMA: ufahamu wa hadithi, msamiati, mchezo wa kuigiza (igizo), shairi (aina za mashairi, ukwapi na utao),
// kamusi, kusoma kwa ufasaha, usalama wa kidijitali. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. The three passages and the play below are original (never copied
// from a textbook): Kenyan names and places, short sentences for an eleven-year-old. A passage rides on the problem as
// passage: { title, text }; a UI that shows it is still to be built before any family is switched on.
// A native Kiswahili speaker must check every passage and item.
// ============================================================================
import { kw, mc, feedbackOf, shuffle, pick, randInt, trio, duo, one, outcomeLetters } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];

// An entry is [question, right, [wrong, 'M_CODE']..., because, {flags}]. {t:1}: a short answer that can also be typed (right may be 'a|b').
const PASSAGES = [
  {
    id: 'soko', title: 'Siku ya Soko Kijijini', kind: 'hadithi',
    text: 'Kila Jumamosi, kijiji cha Mwingi huwa na soko kubwa. Bi Mwikali alibeba nyanya, vitunguu na mchicha hadi sokoni kuuza. Alifika mapema ili apate mahali pazuri pa kuweka bidhaa zake.\n\nMwanawe Kioko alimsaidia kupanga mboga kwenye mkeka. Mnunuzi mmoja alikuja na kuuliza bei ya nyanya. Bi Mwikali alimwambia kwamba rundo moja ni shilingi hamsini. Mnunuzi alinunua marundo matatu.\n\nJioni, Bi Mwikali alihesabu pesa zake. Alifurahi kwa sababu bidhaa zote ziliuzwa. Alimnunulia Kioko daftari jipya.',
    who: [
      ['Nani alibeba mboga hadi sokoni?', 'Bi Mwikali', ['Kioko', 'M_UFA_WRONG_PERSON'], ['mnunuzi', 'M_UFA_WRONG_PERSON'], ['jirani yake', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema Bi Mwikali alibeba nyanya, vitunguu na mchicha hadi sokoni.', { t: 1 }],
      ['Nani alimsaidia Bi Mwikali kupanga mboga?', 'Kioko|mwanawe', ['mnunuzi', 'M_UFA_WRONG_PERSON'], ['mwalimu', 'M_UFA_WRONG_PERSON'], ['dada yake', 'M_UFA_WRONG_PERSON'], 'Mwanawe Kioko alimsaidia kupanga mboga kwenye mkeka.', { t: 1 }],
      ['Nani alinunua marundo matatu ya nyanya?', 'mnunuzi', ['Kioko', 'M_UFA_WRONG_PERSON'], ['Bi Mwikali', 'M_UFA_WRONG_PERSON'], ['mkulima', 'M_UFA_WRONG_PERSON'], 'Mnunuzi mmoja alinunua marundo matatu.', { t: 1 }],
    ],
    fact: [
      ['Kijiji chenye soko kinaitwa nini?', 'Mwingi', ['Kamukunji', 'M_UFA_OUTSIDE'], ['Kisumu', 'M_UFA_OUTSIDE'], ['Soko', 'M_UFA_DETAIL_MIX'], 'Kifungu kinasema kijiji cha Mwingi huwa na soko kubwa.', { t: 1 }],
      ['Soko hufanyika siku gani?', 'Jumamosi', ['Jumapili', 'M_UFA_OUTSIDE'], ['Ijumaa', 'M_UFA_OUTSIDE'], ['Jumatatu', 'M_UFA_OUTSIDE'], 'Kila Jumamosi kijiji huwa na soko kubwa.', { t: 1 }],
      ['Rundo moja la nyanya liliuzwa kwa shilingi ngapi?', 'shilingi hamsini|hamsini', ['shilingi mia moja', 'M_UFA_OUTSIDE'], ['shilingi thelathini', 'M_UFA_OUTSIDE'], ['shilingi tatu', 'M_UFA_DETAIL_MIX'], 'Rundo moja ni shilingi hamsini. Tatu ni idadi ya marundo.', { t: 1 }],
      ['Bi Mwikali alimnunulia Kioko nini?', 'daftari jipya|daftari', ['kalamu mpya', 'M_UFA_OUTSIDE'], ['viatu vipya', 'M_UFA_OUTSIDE'], ['mkeka', 'M_UFA_DETAIL_MIX'], 'Kifungu kinasema alimnunulia Kioko daftari jipya.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Bidii na kuamka mapema huleta mafanikio.', ['Nyanya ni mboga ya bei ghali.', 'M_UFA_DETAIL_AS_MAIN'], ['Mkeka hutumika sokoni.', 'M_UFA_DETAIL_AS_MAIN'], ['Watoto hawapaswi kwenda sokoni.', 'M_UFA_OUTSIDE'], 'Bi Mwikali alifika mapema, akauza kila kitu na akafurahi. Hilo ndilo funzo la hadithi nzima.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Mauzo ya Bi Mwikali sokoni', ['Mkeka wa Kioko', 'M_UFA_DETAIL_AS_MAIN'], ['Rundo la nyanya', 'M_UFA_DETAIL_AS_MAIN'], ['Shamba la Mwingi', 'M_UFA_OUTSIDE'], 'Hadithi nzima inamhusu Bi Mwikali na kuuza kwake mboga sokoni.'],
    ],
    order: ['Bi Mwikali alibeba mboga hadi sokoni.', 'Kioko alipanga mboga kwenye mkeka.', 'Mnunuzi alinunua marundo matatu ya nyanya.', 'Bi Mwikali alimnunulia Kioko daftari.'],
    vocab: [
      ['bidhaa', 'vitu vinavyouzwa', ['bidii ya kazi', 'M_MSA_LOOKALIKE'], ['mahali pa kuuzia', 'M_MSA_NEARBY'], ['pesa za kununulia', 'M_MSA_NEARBY'], 'Bi Mwikali aliweka nyanya, vitunguu na mchicha mkekani ili avuze. Bidhaa ni vitu vinavyouzwa.'],
      ['mnunuzi', 'mtu anayenunua', ['mtu anayeuza', 'M_MSA_OPPOSITE'], ['mtu anayepanga mboga', 'M_MSA_NEARBY'], ['mwanafunzi wa shule', 'M_MSA_LOOKALIKE'], 'Mnunuzi alikuja kuuliza bei na kununua nyanya. Mnunuzi ni mtu anayenunua.'],
      ['rundo', 'kikundi cha vitu vilivyowekwa pamoja', ['kikapu kikubwa', 'M_MSA_NEARBY'], ['mkeka wa sokoni', 'M_MSA_NEARBY'], ['jina la kijiji', 'M_MSA_LOOKALIKE'], 'Rundo moja la nyanya ni nyanya zilizowekwa pamoja kwa bei moja. Rundo ni kikundi cha vitu.'],
    ],
  },
  {
    id: 'kisima', title: 'Kisima cha Ndalani', kind: 'hadithi',
    text: 'Kijiji cha Ndalani kilikuwa na tatizo la maji kwa miaka mingi. Wanawake walitembea kilomita tano kila asubuhi kuchota maji mtoni. Mzee Mutuku aliwaita wanakijiji wote mkutanoni.\n\nWanakijiji walichanga pesa na kuchimba kisima karibu na shule. Kila familia ilileta mchanga na mawe. Baada ya miezi mitatu, kisima kilikamilika.\n\nSiku ya kwanza, watoto walishangilia walipoona maji safi yakitoka kwenye pampu. Mzee Mutuku alisema, "Umoja ni nguvu."',
    who: [
      ['Nani aliwaita wanakijiji mkutanoni?', 'Mzee Mutuku', ['mwalimu mkuu', 'M_UFA_WRONG_PERSON'], ['mwenyekiti wa shule', 'M_UFA_WRONG_PERSON'], ['mkuu wa kijiji', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema Mzee Mutuku aliwaita wanakijiji wote mkutanoni.', { t: 1 }],
      ['Nani walishangilia siku ya kwanza ya pampu?', 'watoto', ['wanawake', 'M_UFA_WRONG_PERSON'], ['mafundi', 'M_UFA_WRONG_PERSON'], ['walimu', 'M_UFA_WRONG_PERSON'], 'Watoto walishangilia walipoona maji safi yakitoka kwenye pampu.', { t: 1 }],
    ],
    fact: [
      ['Wanawake walitembea kilomita ngapi kila asubuhi?', 'tano', ['tatu', 'M_UFA_DETAIL_MIX'], ['kumi', 'M_UFA_OUTSIDE'], ['mbili', 'M_UFA_OUTSIDE'], 'Kifungu kinasema walitembea kilomita tano. Tatu ni idadi ya miezi.', { t: 1 }],
      ['Kisima kilichimbwa karibu na nini?', 'shule', ['mto', 'M_UFA_DETAIL_MIX'], ['kanisa', 'M_UFA_OUTSIDE'], ['soko', 'M_UFA_OUTSIDE'], 'Wanakijiji walichimba kisima karibu na shule. Mto ni mahali walipochota maji awali.', { t: 1 }],
      ['Kila familia ilileta nini?', 'mchanga na mawe|mchanga', ['pesa na chakula', 'M_UFA_DETAIL_MIX'], ['mbao na misumari', 'M_UFA_OUTSIDE'], ['maji na ndoo', 'M_UFA_OUTSIDE'], 'Kila familia ilileta mchanga na mawe. Pesa walichanga, si kuleta.', { t: 1 }],
      ['Kisima kilikamilika baada ya muda gani?', 'miezi mitatu|mitatu', ['miaka mingi', 'M_UFA_DETAIL_MIX'], ['wiki mbili', 'M_UFA_OUTSIDE'], ['siku moja', 'M_UFA_OUTSIDE'], 'Baada ya miezi mitatu kisima kilikamilika. Miaka mingi ilikuwa muda wa tatizo la maji.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Tukishirikiana, tunaweza kutatua matatizo yetu.', ['Mto uko mbali na shule.', 'M_UFA_DETAIL_AS_MAIN'], ['Pampu ni bora kuliko ndoo.', 'M_UFA_OUTSIDE'], ['Wanawake wanapaswa kutembea mbali.', 'M_UFA_OUTSIDE'], 'Wanakijiji walichanga na kujenga kisima pamoja, na Mzee Mutuku akasema umoja ni nguvu.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Wanakijiji wanachimba kisima', ['Mto wa Ndalani', 'M_UFA_DETAIL_AS_MAIN'], ['Pampu ya shule', 'M_UFA_DETAIL_AS_MAIN'], ['Kilomita tano', 'M_UFA_DETAIL_AS_MAIN'], 'Hadithi nzima inaonyesha wanakijiji wakichimba kisima pamoja.'],
    ],
    order: ['Wanawake walitembea mbali kuchota maji.', 'Mzee Mutuku aliwaita wanakijiji mkutanoni.', 'Wanakijiji walichimba kisima.', 'Watoto walishangilia maji safi.'],
    vocab: [
      ['kuchanga', 'kutoa pesa kidogo kidogo kila mmoja ili kupata kiasi kikubwa', ['kuchangia kuni', 'M_MSA_LOOKALIKE'], ['kuchimba kisima', 'M_MSA_NEARBY'], ['kutunza pesa peke yake', 'M_MSA_OPPOSITE'], 'Wanakijiji walichanga pesa ili kujenga kisima. Kuchanga ni kutoa pesa kidogo kidogo kila mmoja.'],
      ['mkutano', 'kikao cha watu wengi waliokusanyika', ['mtu mmoja anayekuja', 'M_MSA_OPPOSITE'], ['mto wa kijiji', 'M_MSA_NEARBY'], ['mkate wa kijiji', 'M_MSA_LOOKALIKE'], 'Mzee Mutuku aliwaita wanakijiji mkutanoni. Mkutano ni kikao cha watu wengi.'],
      ['kushangilia', 'kupiga kelele za furaha', ['kulia kwa huzuni', 'M_MSA_OPPOSITE'], ['kuchota maji', 'M_MSA_NEARBY'], ['kushangaa bila sauti', 'M_MSA_LOOKALIKE'], 'Watoto walishangilia walipoona maji safi. Kushangilia ni kupiga kelele za furaha.'],
    ],
  },
  {
    id: 'mbwa', title: 'Simba, Mbwa wa Mzee Kamau', kind: 'hadithi',
    text: 'Mbwa wa Mzee Kamau aliitwa Simba. Kila jioni, Simba alimsubiri mzee kwenye lango la shamba. Siku moja, mzee alipotea msituni alipokuwa akitafuta kuni.\n\nSimba alibweka kwa sauti kubwa hadi majirani wakaja. Walimfuata mbwa hadi walipompata mzee ameketi chini ya mti, amechoka. Walimbeba hadi nyumbani.\n\nTangu siku hiyo, Mzee Kamau alimpa Simba mfupa mkubwa kila Jumapili.',
    who: [
      ['Nani alibweka kwa sauti kubwa?', 'Simba|mbwa', ['Mzee Kamau', 'M_UFA_WRONG_PERSON'], ['majirani', 'M_UFA_WRONG_PERSON'], ['mkulima mmoja', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema Simba alibweka kwa sauti kubwa hadi majirani wakaja.', { t: 1 }],
      ['Nani walimfuata mbwa msituni?', 'majirani', ['watoto wa shule', 'M_UFA_WRONG_PERSON'], ['Mzee Kamau', 'M_UFA_WRONG_PERSON'], ['mwalimu', 'M_UFA_WRONG_PERSON'], 'Majirani walimfuata mbwa hadi walipompata mzee.', { t: 1 }],
    ],
    fact: [
      ['Mzee Kamau alipotea wapi?', 'msituni', ['shambani', 'M_UFA_DETAIL_MIX'], ['sokoni', 'M_UFA_OUTSIDE'], ['mtoni', 'M_UFA_OUTSIDE'], 'Mzee alipotea msituni. Shamba ni mahali pa lango ambapo mbwa alimsubiri.', { t: 1 }],
      ['Mzee alikuwa akitafuta nini msituni?', 'kuni', ['mbwa', 'M_UFA_DETAIL_MIX'], ['maji', 'M_UFA_OUTSIDE'], ['matunda', 'M_UFA_OUTSIDE'], 'Mzee alipotea alipokuwa akitafuta kuni.', { t: 1 }],
      ['Walimkuta mzee ameketi wapi?', 'chini ya mti', ['kwenye lango la shamba', 'M_UFA_DETAIL_MIX'], ['ndani ya nyumba', 'M_UFA_OUTSIDE'], ['karibu na mto', 'M_UFA_OUTSIDE'], 'Walimpata mzee ameketi chini ya mti. Lango la shamba ni mahali ambapo Simba alimsubiri.', { t: 1 }],
      ['Mzee Kamau alimpa Simba nini kila Jumapili?', 'mfupa mkubwa|mfupa', ['maziwa mengi', 'M_UFA_OUTSIDE'], ['nyama ya kuku', 'M_UFA_OUTSIDE'], ['kuni', 'M_UFA_DETAIL_MIX'], 'Tangu siku hiyo mzee alimpa Simba mfupa mkubwa kila Jumapili.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Mnyama mwaminifu anaweza kuokoa maisha ya mtu.', ['Mbwa hubweka kila wakati.', 'M_UFA_DETAIL_AS_MAIN'], ['Kuni zinapatikana msituni tu.', 'M_UFA_DETAIL_AS_MAIN'], ['Mifupa ni chakula bora cha mbwa.', 'M_UFA_OUTSIDE'], 'Simba alibweka, majirani wakaja na mzee akaokolewa. Hilo ndilo funzo la hadithi nzima.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Mbwa aliyemwokoa mzee', ['Mfupa wa Jumapili', 'M_UFA_DETAIL_AS_MAIN'], ['Msitu wa kuni', 'M_UFA_DETAIL_AS_MAIN'], ['Lango la shamba', 'M_UFA_DETAIL_AS_MAIN'], 'Hadithi nzima inamhusu Simba aliyemwokoa Mzee Kamau.'],
    ],
    order: ['Mzee Kamau alipotea msituni.', 'Simba alibweka kwa sauti kubwa.', 'Majirani walimpata mzee chini ya mti.', 'Mzee Kamau alimpa Simba mfupa mkubwa.'],
    vocab: [
      ['kupotea', 'kukosa njia na kutojulikana alipo', ['kupoteza pesa', 'M_MSA_LOOKALIKE'], ['kupata njia', 'M_MSA_OPPOSITE'], ['kutafuta kuni', 'M_MSA_NEARBY'], 'Mzee alipotea msituni, yaani hakujua njia na hakujulikana alipo. Kupotea ni kukosa njia.'],
      ['kubweka', 'kutoa sauti ya mbwa', ['kubeba mzigo', 'M_MSA_LOOKALIKE'], ['kunyamaza kimya', 'M_MSA_OPPOSITE'], ['kumsubiri mzee', 'M_MSA_NEARBY'], 'Simba alibweka kwa sauti kubwa. Kubweka ni sauti ya mbwa.'],
      ['kuketi', 'kukaa chini', ['kusimama wima', 'M_MSA_OPPOSITE'], ['kutembea msituni', 'M_MSA_NEARBY'], ['kuketisha mtoto', 'M_MSA_LOOKALIKE'], 'Mzee alikuwa ameketi chini ya mti, yaani alikuwa amekaa. Kuketi ni kukaa chini.'],
    ],
  },
  {
    id: 'mstarini', title: 'Mstarini Asubuhi', kind: 'igizo',
    text: 'Mahali: Uwanjani, Shule ya Msingi ya Mwangaza, saa tatu asubuhi.\n\nMwalimu: (Anapiga kengele) Wanafunzi, tafadhali jipangeni mstarini.\nAtieno: (Anakimbia) Samahani, mwalimu, nimechelewa kidogo.\nMwalimu: Ulikuwa wapi, Atieno?\nAtieno: (Anainamisha kichwa) Nilimsaidia bibi kubeba kuni, mwalimu.\nKimani: (Anasimama mbele) Mwalimu, mimi pia nilimwona. Alisema ukweli.\nMwalimu: Asante, Kimani. Atieno, ingia mstarini. Kusaidia wazee ni jambo jema.',
    who: [
      ['Nani alisema "Samahani, mwalimu, nimechelewa kidogo"?', 'Atieno', ['Mwalimu', 'M_IGI_WRONG_SPEAKER'], ['Kimani', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Mstari huo unaanza na "Atieno:", kwa hiyo Atieno ndiye aliyesema.', { t: 1 }],
      ['Nani alisema "Asante, Kimani"?', 'Mwalimu', ['Atieno', 'M_IGI_WRONG_SPEAKER'], ['Kimani', 'M_IGI_WRONG_SPEAKER'], ['mwanafunzi mwingine', 'M_IGI_WRONG_SPEAKER'], 'Mstari huo unaanza na "Mwalimu:", kwa hiyo mwalimu ndiye aliyesema.', { t: 1 }],
      ['Nani alisema "Alisema ukweli"?', 'Kimani', ['Atieno', 'M_IGI_WRONG_SPEAKER'], ['Mwalimu', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Mstari huo unaanza na "Kimani:", kwa hiyo Kimani ndiye aliyesema.', { t: 1 }],
    ],
    who2: [
      ['Nani alipiga kengele?', 'Mwalimu', ['Atieno', 'M_IGI_WRONG_SPEAKER'], ['Kimani', 'M_IGI_WRONG_SPEAKER'], ['mwanafunzi mwingine', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Mwalimu: (Anapiga kengele)".', { t: 1 }],
      ['Nani alikimbia?', 'Atieno', ['Mwalimu', 'M_IGI_WRONG_SPEAKER'], ['Kimani', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Atieno: (Anakimbia)".', { t: 1 }],
      ['Nani alisimama mbele?', 'Kimani', ['Atieno', 'M_IGI_WRONG_SPEAKER'], ['Mwalimu', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Kimani: (Anasimama mbele)".', { t: 1 }],
    ],
    fact: [
      ['Igizo hili hufanyika wapi?', 'uwanjani|uwanjani shuleni', ['darasani', 'M_IGI_DETAIL'], ['kanisani', 'M_IGI_DETAIL'], ['sokoni', 'M_IGI_DETAIL'], 'Mwanzoni imeandikwa "Mahali: Uwanjani".', { t: 1 }],
      ['Igizo linaanza saa ngapi?', 'saa tatu asubuhi|saa tatu', ['saa mbili asubuhi', 'M_IGI_DETAIL'], ['saa nne asubuhi', 'M_IGI_DETAIL'], ['saa tisa alasiri', 'M_IGI_DETAIL'], 'Mwanzoni imeandikwa "saa tatu asubuhi".', { t: 1 }],
      ['Atieno alikuwa akifanya nini kabla ya kuchelewa?', 'alimsaidia bibi kubeba kuni|kumsaidia bibi', ['alicheza mpira', 'M_IGI_DETAIL'], ['alipika chakula', 'M_IGI_DETAIL'], ['alisoma kitabu', 'M_IGI_DETAIL'], 'Atieno alisema, "Nilimsaidia bibi kubeba kuni, mwalimu."', { t: 1 }],
      ['Mwalimu alisema kusaidia nani ni jambo jema?', 'wazee', ['wanafunzi', 'M_IGI_DETAIL'], ['walimu', 'M_IGI_DETAIL'], ['wageni', 'M_IGI_DETAIL'], 'Mwalimu alisema, "Kusaidia wazee ni jambo jema."', { t: 1 }],
    ],
    dir: [
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anapiga kengele)', ['Mwalimu: Wanafunzi, tafadhali jipangeni mstarini.', 'M_IGI_STAGE_AS_SPEECH'], ['Atieno: Samahani, mwalimu.', 'M_IGI_STAGE_AS_SPEECH'], ['Mahali: Uwanjani.', 'M_IGI_STAGE_AS_SPEECH'], 'Kilicho kwenye mabano ni maelekezo ya kitendo: (Anapiga kengele).'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anakimbia)', ['Atieno: Nimechelewa kidogo.', 'M_IGI_STAGE_AS_SPEECH'], ['Mwalimu: Ulikuwa wapi, Atieno?', 'M_IGI_STAGE_AS_SPEECH'], ['Kimani: Alisema ukweli.', 'M_IGI_STAGE_AS_SPEECH'], 'Maneno kwenye mabano yanaonyesha kitendo cha muigizaji: (Anakimbia).'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anainamisha kichwa)', ['Mwalimu: Asante, Kimani.', 'M_IGI_STAGE_AS_SPEECH'], ['Atieno: Nilimsaidia bibi.', 'M_IGI_STAGE_AS_SPEECH'], ['Mahali: Uwanjani.', 'M_IGI_STAGE_AS_SPEECH'], 'Maelekezo ya jukwaani huwekwa kwenye mabano: (Anainamisha kichwa).'],
      ['Ni maneno yapi ni maneno ambayo mhusika anayasema?', 'Kimani: Mwalimu, mimi pia nilimwona.', ['(Anasimama mbele)', 'M_IGI_STAGE_AS_SPEECH'], ['(Anapiga kengele)', 'M_IGI_STAGE_AS_SPEECH'], ['(Anakimbia)', 'M_IGI_STAGE_AS_SPEECH'], 'Maneno ya mhusika huja baada ya jina lake na nukta mbili. Yaliyo kwenye mabano ni maelekezo.'],
    ],
    vocab: [
      ['samahani', 'neno la kuomba msamaha', ['neno la kusalimia', 'M_IGI_VOCAB'], ['neno la kuaga', 'M_IGI_VOCAB'], ['neno la kushukuru', 'M_IGI_VOCAB'], 'Atieno alisema samahani kwa sababu amechelewa. Samahani ni neno la kuomba msamaha.'],
      ['kuinamisha', 'kushusha chini', ['kuinua juu', 'M_IGI_VOCAB'], ['kugeuza upande', 'M_IGI_VOCAB'], ['kukimbia mbele', 'M_IGI_VOCAB'], 'Atieno aliinamisha kichwa kwa aibu. Kuinamisha ni kushusha chini.'],
      ['mstarini', 'mahali wanafunzi wamesimama mmoja nyuma ya mwingine', ['darasani', 'M_IGI_VOCAB'], ['jikoni', 'M_IGI_VOCAB'], ['sokoni', 'M_IGI_VOCAB'], 'Mwalimu aliwaambia wajipange mstarini, yaani mmoja nyuma ya mwingine.'],
      ['ukweli', 'jambo lisilo la uongo', ['jambo la uongo', 'M_IGI_VOCAB'], ['jambo la kuchekesha', 'M_IGI_VOCAB'], ['jambo la kusikitisha', 'M_IGI_VOCAB'], 'Kimani alisema Atieno alisema ukweli, yaani hakudanganya. Ukweli ni jambo lisilo la uongo.'],
    ],
  },
];

const byId = Object.fromEntries(PASSAGES.map(p => [p.id, p]));
const showP = (p) => ({ title: p.title, text: p.text });

// ---------------------------------------------------------------- builders
const flat = (key, kind) => PASSAGES.filter(p => (kind ? p.kind === kind : true) && p[key]).flatMap(p => [...p[key], ...(p[`${key}2`] || [])].map(e => ({ p, e })));
const norm = (key, e) => {
  const a = [...e];
  const flags = a.length && !Array.isArray(a[a.length - 1]) && typeof a[a.length - 1] === 'object' ? a.pop() : {};
  const because = a.pop();
  if (key === 'vocab') return { q: `Katika kifungu, neno "${a[0]}" lina maana gani?`, right: a[1], wrongs: a.slice(2), because, flags };
  return { q: a[0], right: a[1], wrongs: a.slice(2), because, flags };
};
const optionsOf = (cskill, wrongs, right) => mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
// choose from a passage question
const passChoose = (key, { hints, kind, onlyTyped = false }) => (cskill) => {
  const { p, e } = pick(flat(key, kind).filter(x => !onlyTyped || norm(key, x.e).flags.t));
  const n = norm(key, e), options = optionsOf(cskill, n.wrongs, n.right.split('|')[0]);
  if (!options) return null;
  return { passage: showP(p), question: n.q, options, instruction: 'Soma kifungu. Kisha chagua jibu sahihi.', hints, steps: [n.because, `Jibu ni "${n.right.split('|')[0]}".`] };
};
// type a short answer (entries flagged t:1)
const passType = (key, { hints, kind }) => (cskill) => {
  const { p, e } = pick(flat(key, kind).filter(x => norm(key, x.e).flags.t));
  const n = norm(key, e), [shown, ...alt] = n.right.split('|');
  return { passage: showP(p), question: n.q, answer: shown, accepts: alt, wrong: n.wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]), instruction: 'Soma kifungu. Kisha andika jibu fupi.', hints: [...hints, `Jibu linaanza na herufi "${shown[0]}".`], steps: [n.because, `Jibu ni "${shown}".`], chk: (a) => [shown, ...alt].includes(String(a)) };
};
// put four events in order
const orderGen = (cskill) => {
  const p = pick(PASSAGES.filter(x => x.order && x.kind === 'hadithi'));
  const ev = p.order;
  let show; do { show = shuffle(ev.map((t, i) => i)); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3];
  const right = seq(base), reversed = seq([...base].reverse());
  const i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const rot = seq([3, 0, 1, 2]);
  const options = mc(right, [[reversed, feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER'], [seq(sw), feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER'], [rot, feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER']]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { passage: showP(p), question: `Matukio manne ya hadithi yamechanganywa. Ni orodha ipi inaonyesha mpangilio ambao yalitokea? ${list}`, options, fixedOrder: false, instruction: 'Soma kifungu. Kisha chagua jibu sahihi.',
    hints: ['Tafuta tukio la kwanza kwenye kifungu, kisha linalofuata.', 'Angalia maneno ya wakati kama "kisha", "baadaye" na "baada ya".'], steps: [`Katika hadithi matukio yalitokea hivi: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Kwa herufi ni ${right}.`], chk: () => true };
};


// ---------------------------------------------------------------- word and sentence pools
const MSA_GAP = [
  ['Wanakijiji walikusanyika mkutanoni na kuamua ___ pesa za kujenga kisima.', 'kuchanga', ['kuchangia kuni', 'M_MSA_LOOKALIKE'], ['kuchimba', 'M_MSA_NEARBY'], ['kutunza peke yake', 'M_MSA_OPPOSITE'], 'Kuchanga ni kutoa pesa kidogo kidogo kila mmoja ili kupata kiasi kikubwa.'],
  ['Bi Mwikali alipanga ___ zake kwenye mkeka ili wanunuzi waziona.', 'bidhaa', ['bidii', 'M_MSA_LOOKALIKE'], ['mahali', 'M_MSA_NEARBY'], ['pesa', 'M_MSA_NEARBY'], 'Bidhaa ni vitu vinavyouzwa.'],
  ['Mzee alipotea msituni kwa sababu alikosa ___ ya kurudi nyumbani.', 'njia', ['nia', 'M_MSA_LOOKALIKE'], ['kuni', 'M_MSA_NEARBY'], ['mbwa', 'M_MSA_NEARBY'], 'Kupotea ni kukosa njia ya kwenda.'],
  ['Watoto ___ walipoona maji safi yakitoka kwenye pampu.', 'walishangilia', ['walishangaa', 'M_MSA_LOOKALIKE'], ['walilia', 'M_MSA_OPPOSITE'], ['walichota', 'M_MSA_NEARBY'], 'Kushangilia ni kupiga kelele za furaha.'],
  ['Mbwa ___ kwa sauti kubwa ili watu wasikie.', 'alibweka', ['alibeba', 'M_MSA_LOOKALIKE'], ['alinyamaza', 'M_MSA_OPPOSITE'], ['alimsubiri', 'M_MSA_NEARBY'], 'Kubweka ni sauti ya mbwa.'],
];

const KAMUSI = [
  ['Kati ya "ua", "chungwa" na "wali", neno linalokuja kwanza kwenye kamusi ni ___.', 'chungwa', ['ua', 'M_KAM_LENGTH'], ['wali', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya chungwa ni c, na c huja kabla ya u na w.'],
  ['Kati ya "mto", "baraza" na "zulia", neno linalokuja kwanza kwenye kamusi ni ___.', 'baraza', ['mto', 'M_KAM_LENGTH'], ['zulia', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya baraza ni b, na b huja kabla ya m na z.'],
  ['Kati ya "ndege", "kalamu" na "mbu", neno linalokuja kwanza kwenye kamusi ni ___.', 'kalamu', ['mbu', 'M_KAM_LENGTH'], ['ndege', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya kalamu ni k, na k huja kabla ya m na n.'],
  ['Kati ya "tai", "hospitali" na "wimbo", neno linalokuja kwanza kwenye kamusi ni ___.', 'hospitali', ['tai', 'M_KAM_LENGTH'], ['wimbo', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya hospitali ni h, na h huja kabla ya t na w.'],
  ['Kati ya "rula", "daftari" na "sanduku", neno linalokuja kwanza kwenye kamusi ni ___.', 'daftari', ['rula', 'M_KAM_LENGTH'], ['sanduku', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya daftari ni d, na d huja kabla ya r na s.'],
  ['Kati ya "kuku", "kabati" na "kiti", neno linalokuja kwanza kwenye kamusi ni ___.', 'kabati', ['kuku', 'M_KAM_FIRST_ONLY'], ['kiti', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na k. Herufi ya pili: a huja kabla ya i na u, kwa hiyo kabati linakuja kwanza.'],
  ['Kati ya "shule", "samaki" na "sahani", neno linalokuja kwanza kwenye kamusi ni ___.', 'sahani', ['samaki', 'M_KAM_FIRST_ONLY'], ['shule', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na s. Sahani na samaki zinaendelea na a, lakini shule inaendelea na h, na h huja baada ya a. Kati ya sahani na samaki, h huja kabla ya m, kwa hiyo sahani inakuja kwanza.'],
  ['Kati ya "mbuzi", "mama" na "mwalimu", neno linalokuja kwanza kwenye kamusi ni ___.', 'mama', ['mbuzi', 'M_KAM_FIRST_ONLY'], ['mwalimu', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na m. Herufi ya pili: a huja kabla ya b na w, kwa hiyo mama linakuja kwanza.'],
  ['Kati ya "tembo", "tunda" na "taa", neno linalokuja kwanza kwenye kamusi ni ___.', 'taa', ['tembo', 'M_KAM_FIRST_ONLY'], ['tunda', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na t. Herufi ya pili: a huja kabla ya e na u, kwa hiyo taa linakuja kwanza.'],
  ['Kati ya "ua", "chungwa" na "wali", neno linalokuja mwisho kwenye kamusi ni ___.', 'wali', ['ua', 'M_KAM_LENGTH'], ['chungwa', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya wali ni w, na w ndiyo ya mwisho katika alfabeti kati ya c, u na w.'],
  ['Kati ya "pia", "asali" na "zeze", neno linalokuja mwisho kwenye kamusi ni ___.', 'zeze', ['pia', 'M_KAM_LENGTH'], ['asali', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya zeze ni z, na z ndiyo ya mwisho katika alfabeti kati ya a, p na z.'],
];

// shairi: aina za mashairi (kwa idadi ya mishororo katika ubeti) na ukwapi na utao (vipande viwili vya mshororo)
const SHAIRI = [
  ['Ubeti wenye mishororo miwili huitwa ___.', 'tathnia', ['tathlitha', 'M_SHA_AINA_SWAP'], ['tarbia', 'M_SHA_AINA_SWAP'], ['takhmisa', 'M_SHA_AINA_SWAP'], 'Tathnia ni ubeti wenye mishororo miwili.'],
  ['Ubeti wenye mishororo mitatu huitwa ___.', 'tathlitha', ['tathnia', 'M_SHA_AINA_SWAP'], ['tarbia', 'M_SHA_AINA_SWAP'], ['takhmisa', 'M_SHA_AINA_SWAP'], 'Tathlitha ni ubeti wenye mishororo mitatu.'],
  ['Ubeti wenye mishororo minne huitwa ___.', 'tarbia', ['tathnia', 'M_SHA_AINA_SWAP'], ['tathlitha', 'M_SHA_AINA_SWAP'], ['takhmisa', 'M_SHA_AINA_SWAP'], 'Tarbia ni ubeti wenye mishororo minne.'],
  ['Ubeti huu ni wa aina gani? "Shule yetu ni nzuri, / Walimu wetu ni wema, / Tunasoma kwa bidii."', 'tathlitha', ['tathnia', 'M_SHA_AINA_COUNT'], ['tarbia', 'M_SHA_AINA_COUNT'], ['takhmisa', 'M_SHA_AINA_COUNT'], 'Ubeti una mishororo mitatu, kwa hiyo ni tathlitha.'],
  ['Ubeti huu ni wa aina gani? "Jua limechomoza, / Ndege wanaimba, / Wakulima wanaamka, / Kijiji kimeamka."', 'tarbia', ['tathnia', 'M_SHA_AINA_COUNT'], ['tathlitha', 'M_SHA_AINA_COUNT'], ['takhmisa', 'M_SHA_AINA_COUNT'], 'Ubeti una mishororo minne, kwa hiyo ni tarbia.'],
  ['Ubeti huu ni wa aina gani? "Mvua imenyesha, / Mito imejaa."', 'tathnia', ['tathlitha', 'M_SHA_AINA_COUNT'], ['tarbia', 'M_SHA_AINA_COUNT'], ['takhmisa', 'M_SHA_AINA_COUNT'], 'Ubeti una mishororo miwili, kwa hiyo ni tathnia.'],
  ['Kipande cha kwanza cha mshororo wa shairi huitwa ___.', 'ukwapi', ['utao', 'M_SHA_UKWAPI_SWAP'], ['vina', 'M_SHA_PART_MIX'], ['mizani', 'M_SHA_PART_MIX'], 'Mshororo hugawanyika katika vipande viwili. Cha kwanza ni ukwapi.'],
  ['Kipande cha pili cha mshororo wa shairi huitwa ___.', 'utao', ['ukwapi', 'M_SHA_UKWAPI_SWAP'], ['vina', 'M_SHA_PART_MIX'], ['mizani', 'M_SHA_PART_MIX'], 'Mshororo hugawanyika katika vipande viwili. Cha pili ni utao.'],
];

const IGI_PART = [
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Atieno: Nilimsaidia bibi kubeba kuni, mwalimu.', ['Atieno alimsaidia bibi kubeba kuni.', 'M_IGI_STORY'], ['Atieno alikuwa mwanafunzi mwema.', 'M_IGI_STORY'], ['Bibi alikuwa na kuni nyingi.', 'M_IGI_STORY'], 'Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.'],
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Kimani: Mwalimu, mimi pia nilimwona.', ['Kimani alimwona Atieno akibeba kuni.', 'M_IGI_STORY'], ['Kimani alisimama mbele ya mstari.', 'M_IGI_STORY'], ['Kimani alikuwa mkweli.', 'M_IGI_STORY'], 'Mstari wa igizo huanza na jina la mhusika na nukta mbili.'],
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Mwalimu: Ulikuwa wapi, Atieno?', ['Mwalimu alimuuliza Atieno alikokuwa.', 'M_IGI_STORY'], ['Mwalimu alikasirika kidogo.', 'M_IGI_STORY'], ['Mwalimu alipiga kengele asubuhi.', 'M_IGI_STORY'], 'Maneno ya mhusika katika igizo yameandikwa baada ya jina lake.'],
  ['Ni kipi kati ya hivi kinatoka kwenye hadithi, si igizo?', 'Mzee alipotea msituni alipokuwa akitafuta kuni.', ['Mzee: Nimepotea msituni.', 'M_IGI_STORY'], ['Simba: Hau hau hau!', 'M_IGI_STORY'], ['Majirani: Tumekupata, mzee!', 'M_IGI_STORY'], 'Hadithi huelezwa na msimulizi. Igizo huwa na majina ya wahusika na nukta mbili.'],
];

const UFS = [
  ['Msomaji hodari afanye nini anapofika kwenye neno gumu?', 'Apunguze kasi na alitamke polepole', ['Alirukie ili amalize haraka', 'M_UFS_SPEED'], ['Alisome kwa sauti kubwa sana', 'M_UFS_LOUD'], ['Aache kusoma kabisa', 'M_UFS_IGNORE_MARKS'], 'Msomaji hodari hutamka kila neno kwa usahihi, hata kama ni gumu, kwa kasi ifaayo.'],
  ['Ni nini kinachomsaidia msikilizaji kuelewa unachosoma?', 'Matamshi bora na sauti inayosikika wazi', ['Kusoma haraka kuliko wote', 'M_UFS_SPEED'], ['Kupiga kelele', 'M_UFS_LOUD'], ['Kusoma bila kupumzika', 'M_UFS_IGNORE_MARKS'], 'Matamshi bora na sauti ifaayo humsaidia msikilizaji kuelewa.'],
  ['Unaposoma na kufika kwenye alama ya kiulizi, ufanye nini?', 'Nipandishe sauti kidogo kuonyesha swali', ['Nisome kwa sauti ileile bila mabadiliko', 'M_UFS_IGNORE_MARKS'], ['Nipige kelele', 'M_UFS_LOUD'], ['Nisome haraka zaidi', 'M_UFS_SPEED'], 'Alama za uakifishi zinaonyesha jinsi ya kusoma: kiulizi huonyesha swali.'],
  ['Unaposoma na kufika kwenye alama ya hisi, ufanye nini?', 'Nionyeshe hisia, kama mshangao au furaha, kwa sauti', ['Nisome bila hisia yoyote', 'M_UFS_IGNORE_MARKS'], ['Nisome kwa kasi sana', 'M_UFS_SPEED'], ['Nipige kelele kila wakati', 'M_UFS_LOUD'], 'Alama ya hisi inaonyesha mshangao au hisia kali, kwa hiyo sauti hubadilika ipasavyo.'],
  ['Ishara za mwili wakati wa kusoma kifungu kwa sauti zinafaa kuwa za aina gani?', 'Zinazofaa maneno yanayosomwa', ['Nyingi sana ili kila mtu acheke', 'M_UFS_SPEED'], ['Hakuna ishara kabisa', 'M_UFS_IGNORE_MARKS'], ['Ishara zisizohusiana na kifungu', 'M_UFS_LOUD'], 'Ishara zifaazo huongeza maana ya kifungu bila kumvuruga msikilizaji.'],
];
const UFS_S = [
  ['', 'Msomaji mzuri hutamka maneno kwa usahihi.', ['Msomaji mzuri hurukia maneno magumu.', 'M_UFS_SPEED'], ['Msomaji mzuri hunong\'ona kila wakati.', 'M_UFS_LOUD'], 'Matamshi bora humsaidia msikilizaji kuelewa kila neno.'],
  ['', 'Msomaji mzuri hupumzika kidogo kwenye koma.', ['Msomaji mzuri husoma bila kuzingatia alama.', 'M_UFS_IGNORE_MARKS'], ['Msomaji mzuri husoma kwa kasi sana kwenye koma.', 'M_UFS_SPEED'], 'Koma inaonyesha mahali pa kupumzika kidogo.'],
  ['', 'Msomaji mzuri hubadilisha sauti kwenye swali.', ['Msomaji mzuri husoma swali kama sentensi ya kawaida.', 'M_UFS_IGNORE_MARKS'], ['Msomaji mzuri hupiga kelele kwenye swali.', 'M_UFS_LOUD'], 'Kiulizi huonyesha swali, na sauti hupanda kidogo.'],
  ['', 'Msomaji mzuri husoma kwa kasi ya wastani.', ['Msomaji mzuri husoma haraka iwezekanavyo.', 'M_UFS_SPEED'], ['Msomaji mzuri husoma polepole sana.', 'M_UFS_SPEED'], 'Kasi ifaayo si haraka sana wala polepole sana.'],
  ['', 'Msomaji mzuri hutumia sauti inayosikika wazi.', ['Msomaji mzuri hupiga kelele ili asikike.', 'M_UFS_LOUD'], ['Msomaji mzuri husoma kwa sauti ya chini sana.', 'M_UFS_LOUD'], 'Sauti ifaayo inasikika wazi bila kupiga kelele.'],
];

const DIG_SITUATION = [
  ['Unatafuta kifungu cha kusoma mtandaoni kwa ajili ya kazi ya shule. Ufanye nini kwanza?', 'Nimwombe mwalimu au mzazi anielekeze tovuti salama', ['Nifungue tovuti yoyote inayotokea kwanza', 'M_DIG_UNSAFE_SITE'], ['Nibofye tangazo linalosema nimeshinda zawadi', 'M_DIG_LINK'], ['Niandike nenosiri langu kwenye tovuti ya kwanza', 'M_DIG_SHARE'], 'Tovuti salama hupendekezwa na mwalimu au mzazi.'],
  ['Tovuti inakuomba jina kamili, anwani na nambari ya simu kabla ya kukuruhusu kusoma. Ufanye nini?', 'Nisitoe maelezo hayo na nimwonyeshe mtu mzima', ['Nitoe maelezo yote ili nisome', 'M_DIG_SHARE'], ['Nitoe nusu ya maelezo', 'M_DIG_SHARE'], ['Nimwambie rafiki anitolee', 'M_DIG_SHARE'], 'Tovuti salama ya kusoma haihitaji maelezo yako binafsi.'],
  ['Rafiki anakutumia kiungo kisichojulikana akisema ni hadithi nzuri. Ufanye nini?', 'Nimwonyeshe mtu mzima kabla ya kukifungua', ['Nikifungue haraka', 'M_DIG_LINK'], ['Nikitume kwa wengine', 'M_DIG_LINK'], ['Nikibofye mara mbili', 'M_DIG_LINK'], 'Viungo visivyojulikana vinaweza kuwa hatari.'],
  ['Unamaliza kusoma kwenye tarakilishi ya maktaba. Ufanye nini?', 'Nitoke kwenye akaunti yangu na kufunga ukurasa', ['Niache ukurasa wazi', 'M_DIG_SHARE'], ['Nimwachie mwenzangu nenosiri langu', 'M_DIG_SHARE'], ['Niandike nenosiri langu kwenye karatasi', 'M_DIG_SHARE'], 'Ukitoka kwenye akaunti yako, hakuna mwingine anayeweza kuitumia.'],
  ['Ujumbe wa mtu usiyemjua unakuomba umpe nenosiri la akaunti yako. Ufanye nini?', 'Nikatae na nimweleze mzazi', ['Nimpe kwa kuwa anaonekana mwema', 'M_DIG_SHARE'], ['Nimpe baada ya siku moja', 'M_DIG_SHARE'], ['Nimtumie nusu ya nenosiri', 'M_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu yeyote.'],
];
const DIG_STATEMENT = [
  ['', 'Ninasoma kwenye tovuti salama iliyopendekezwa na mwalimu.', ['Ninasoma kwenye tovuti yoyote inayoomba nambari yangu ya simu.', 'M_DIG_UNSAFE_SITE'], ['Ninaingiza maelezo yangu kwenye tovuti ya zawadi.', 'M_DIG_UNSAFE_SITE'], 'Tumia tovuti salama na usitoe maelezo yako binafsi.'],
  ['', 'Ninaweka nenosiri langu siri.', ['Ninampa rafiki yangu nenosiri langu.', 'M_DIG_SHARE'], ['Ninaandika nenosiri langu ubaoni.', 'M_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu mwingine.'],
  ['', 'Ninamwonyesha mzazi kiungo kisichojulikana kabla ya kukifungua.', ['Ninafungua kila kiungo ninachotumiwa.', 'M_DIG_LINK'], ['Ninatuma kiungo kwa wengine bila kukisoma.', 'M_DIG_LINK'], 'Viungo visivyojulikana vinaweza kuwa hatari.'],
  ['', 'Ninatoka kwenye akaunti yangu ninapomaliza kusoma.', ['Ninaiacha akaunti yangu wazi.', 'M_DIG_SHARE'], ['Ninamwachia mwenzangu nenosiri langu.', 'M_DIG_SHARE'], 'Ukitoka kwenye akaunti, hakuna mwingine anayeweza kuitumia.'],
  ['', 'Ninauliza mwalimu kabla ya kupakua faili.', ['Ninapakua faili yoyote ninayoiona.', 'M_DIG_LINK'], ['Ninafungua faili kutoka kwa mtu nisiyemjua.', 'M_DIG_LINK'], 'Faili zisizojulikana zinaweza kuwa hatari. Uliza mtu mzima kwanza.'],
];

const C_MSA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.MSAMIATI', C_UFA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', C_IGI = 'KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO', C_SHA = 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI_AINA', C_KAM = 'KUSOMA.T2_KUSOMA_KWA_KINA.KAMUSI';
const C_UFS = 'KUSOMA.T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE', C_DIG = 'KUSOMA.T4_KUSOMA_KWA_MAPANA.USALAMA_DIJITALI';

export const FAMILIES = [
  // ---- MSAMIATI
  kw({ id: 'kiswahili6.msamiati.maana', cs: C_MSA, oc: 'a', kind: 'choose-meaning', form: 'word', rung: 2, gen: passChoose('vocab', { kind: 'hadithi', hints: H('Soma sentensi lenye neno hilo, na sentensi zilizo karibu nalo.', 'Jaribu kila maana mahali pa neno. Ipi inafaa?') }) }),
  ...trio('msamiati.tumia', C_MSA, MSA_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'b', 'b'], tag: 'tumia', topic: 'kuhusu msamiati', hints: H('Fikiria maana ya kila neno kabla ya kuchagua.', 'Neno linaloonekana kama jingine si lazima liwe na maana sawa nalo.') }),
  // ---- UFAHAMU WA HADITHI
  kw({ id: 'kiswahili6.hadithi.nani', cs: C_UFA, oc: 'c', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu aliyefanya kitendo.', 'Jibu liko kwenye kifungu.') }) }),
  kw({ id: 'kiswahili6.hadithi.nini', cs: C_UFA, oc: 'c', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu. Tafuta sentensi inayojibu swali.', 'Hakikisha jibu linalingana na kinachoulizwa, si neno moja tu la swali.') }) }),
  kw({ id: 'kiswahili6.hadithi.andika', cs: C_UFA, oc: 'c', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili6.hadithi.nani.andika', cs: C_UFA, oc: 'c', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu huyo.', 'Andika jina au cheo tu.') }) }),
  kw({ id: 'kiswahili6.hadithi.ujumbe', cs: C_UFA, oc: 'c', kind: 'choose-main', form: 'word', rung: 2, gen: passChoose('main', { kind: 'hadithi', hints: H('Ujumbe mkuu ni funzo la hadithi nzima.', 'Jambo moja dogo ndani ya hadithi si ujumbe mkuu.') }) }),
  kw({ id: 'kiswahili6.hadithi.mpangilio', cs: C_UFA, oc: 'c', kind: 'order-events', form: 'steps', rung: 2, gen: orderGen }),
  // ---- IGIZO
  kw({ id: 'kiswahili6.igizo.tambua', cs: C_IGI, oc: 'a', kind: 'choose-form', form: 'direct', rung: 1, gen: (cskill) => {
    const it = pick(IGI_PART.map(x => ({ q: x[0], right: x[1], wrongs: x.slice(2, -1), because: x[x.length - 1] })));
    const options = optionsOf(cskill, it.wrongs, it.right);
    return options && { question: it.q, options, instruction: 'Chagua jibu sahihi.', hints: H('Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.', 'Hadithi huelezwa na msimulizi bila majina na nukta mbili.'), steps: [it.because, `Jibu ni "${it.right}".`] };
  } }),
  kw({ id: 'kiswahili6.igizo.maelekezo', cs: C_IGI, oc: 'a', kind: 'choose-direction', form: 'word', rung: 2, gen: passChoose('dir', { kind: 'igizo', hints: H('Maelekezo ya jukwaani yako kwenye mabano.', 'Mabano yanamwonyesha muigizaji afanye nini, si aseme nini.') }) }),
  kw({ id: 'kiswahili6.igizo.msamiati', cs: C_IGI, oc: 'a', kind: 'choose-meaning', form: 'word', rung: 2, gen: passChoose('vocab', { kind: 'igizo', hints: H('Soma mstari ambao neno hilo limetumika.', 'Fikiria nani anafanya nini na nani.') }) }),
  kw({ id: 'kiswahili6.igizo.nani', cs: C_IGI, oc: 'c', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'igizo', hints: H('Tafuta mstari huo na usome jina lililo mbele ya nukta mbili.', 'Jina hilo ni la mtu anayesema.') }) }),
  kw({ id: 'kiswahili6.igizo.nini', cs: C_IGI, oc: 'c', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'igizo', hints: H('Jibu liko kwenye igizo. Tafuta mstari unaolitaja.', 'Soma tena mstari huo.') }) }),
  kw({ id: 'kiswahili6.igizo.andika', cs: C_IGI, oc: 'c', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'igizo', hints: H('Jibu liko kwenye igizo.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili6.igizo.nani.andika', cs: C_IGI, oc: 'c', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'igizo', hints: H('Tafuta mstari huo kwenye igizo.', 'Andika jina la mhusika tu.') }) }),
  // ---- SHAIRI
  ...trio('shairi.aina', C_SHA, SHAIRI, { stem: 'Chagua jibu sahihi.', gapStem: 'Andika jibu sahihi:', oc: ['a', 'b', 'b'], topic: 'kuhusu aina za mashairi', hints: H('Jina la ubeti hutegemea idadi ya mishororo yake.', 'Hesabu mishororo kabla ya kutaja aina.') }),
  // ---- KUSOMA KWA UFASAHA (what a fluent reader does: the reading aloud itself is for the teacher)
  ...one('ufasaha.tambua', C_UFS, UFS, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Alama za uakifishi zinaonyesha jinsi ya kusoma.') }),
  ...duo('ufasaha.sentensi', C_UFS, UFS_S, { stem: 'Chagua sentensi sahihi kuhusu kusoma kwa ufasaha.', oc: ['a', 'a'], tag: 'sentensi', topic: 'kuhusu kusoma kwa ufasaha', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Kasi ifaayo na sauti ipasavyo si ya kupindukia.') }),
  // ---- USALAMA WA KIDIJITALI
  ...one('usalama.hali', C_DIG, DIG_SITUATION, { stem: 'Chagua hatua ya kiusalama.', oc: 'a', tag: 'hali', rung: 2, hints: H('Nenosiri na maelezo yako binafsi ni siri.', 'Mwonyeshe mtu mzima kiungo kisichojulikana kabla ya kukifungua.') }),
  ...duo('usalama.sentensi', C_DIG, DIG_STATEMENT, { stem: 'Chagua sentensi inayoonyesha hatua ya kiusalama.', oc: ['a', 'a'], tag: 'sentensi', topic: 'kuhusu usalama wa kidijitali', hints: H('Tovuti salama hupendekezwa na mwalimu au mzazi.', 'Usitoe maelezo yako binafsi.') }),
  // ---- KAMUSI
  ...trio('kamusi', C_KAM, KAMUSI, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'b', 'a'], thinOk: true, topic: 'kuhusu mpangilio wa maneno kwenye kamusi', hints: H('Kamusi hupanga maneno kwa mpangilio wa alfabeti.', 'Herufi za kwanza zikifanana, tazama herufi ya pili, kisha ya tatu.') }),
];
