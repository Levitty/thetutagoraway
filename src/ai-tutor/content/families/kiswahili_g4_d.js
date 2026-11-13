// ============================================================================
// KISWAHILI GRADE 4, KUSOMA: msamiati, ufahamu wa hadithi, makala, mchezo wa kuigiza (igizo), shairi (ubeti na mshororo),
// kamusi, kusoma kwa ufasaha (vipengele), usalama wa kidijitali. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. The passages below are original (never copied from a textbook):
// Kenyan names and places, short sentences for a nine-year-old. A passage rides on the problem as passage: { title, text };
// a UI that shows it is still to be built before any family is switched on. The English reading-level rule does not apply to
// Kiswahili: the checks keep the sentence length (22 words) and the length of a passage, and a native speaker judges the level.
// Reading aloud, choosing texts in a library and using a computer are not testable by a question: see the routes note.
// A native Kiswahili speaker must check every passage and item: docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { kw, mc, feedbackOf, shuffle, pick, randInt, trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- the passages
// An entry is [question, right, [wrong, 'M_CODE']..., because, {flags}]. {t:1}: a short answer that can also be typed (right may be 'a|b').
const PASSAGES = [
  {
    id: 'soko', title: 'Soko la Jumamosi', kind: 'hadithi',
    text: 'Achieng aliamka mapema Jumamosi asubuhi. Mjomba wake, Mzee Otieno, alimwomba waende sokoni pamoja. Walipofika sokoni, Achieng aliona wauzaji wengi wakipanga bidhaa zao.\n\nMjomba alinunua nyanya na vitunguu. Achieng alinunua mkungu wa ndizi kwa ajili ya bibi yake. Ghafla, mvua kubwa ilianza kunyesha, na wote wakakimbilia chini ya kibanda.\n\nMvua ilipokoma, walirudi nyumbani wakiwa wamechoka lakini wamefurahi. Achieng alijifunza kwamba kuamka mapema huleta mafanikio.',
    who: [
      ['Nani alimwomba Achieng waende sokoni?', 'mjomba wake|mjomba|Mzee Otieno', ['bibi yake', 'M4_UFA_WRONG_PERSON'], ['mama yake', 'M4_UFA_WRONG_PERSON'], ['mwalimu wake', 'M4_UFA_WRONG_PERSON'], 'Kifungu kinasema kwamba mjomba wake, Mzee Otieno, alimwomba waende sokoni.', { t: 1 }],
      ['Nani alinunua mkungu wa ndizi?', 'Achieng', ['Mzee Otieno', 'M4_UFA_WRONG_PERSON'], ['bibi yake', 'M4_UFA_WRONG_PERSON'], ['mama yake', 'M4_UFA_WRONG_PERSON'], 'Kifungu kinasema "Achieng alinunua mkungu wa ndizi".', { t: 1 }],
      ['Achieng alimnunulia nani ndizi?', 'bibi yake|bibi', ['mjomba wake', 'M4_UFA_WRONG_PERSON'], ['mama yake', 'M4_UFA_WRONG_PERSON'], ['mwalimu wake', 'M4_UFA_WRONG_PERSON'], 'Achieng alinunua mkungu wa ndizi kwa ajili ya bibi yake.', { t: 1 }],
    ],
    fact: [
      ['Achieng aliamka siku gani?', 'Jumamosi', ['Ijumaa', 'M4_UFA_OUTSIDE'], ['Jumapili', 'M4_UFA_OUTSIDE'], ['Jumatatu', 'M4_UFA_OUTSIDE'], 'Kifungu kinasema Achieng aliamka mapema Jumamosi asubuhi.', { t: 1 }],
      ['Mjomba alinunua nini?', 'nyanya na vitunguu|nyanya', ['mkungu wa ndizi', 'M4_UFA_DETAIL_MIX'], ['mkate na maziwa', 'M4_UFA_OUTSIDE'], ['samaki', 'M4_UFA_OUTSIDE'], 'Mjomba alinunua nyanya na vitunguu. Achieng ndiye aliyenunua ndizi.', { t: 1 }],
      ['Wote walikimbilia wapi mvua ilipoanza?', 'chini ya kibanda|kibandani|kibanda', ['nyumbani', 'M4_UFA_DETAIL_MIX'], ['shuleni', 'M4_UFA_OUTSIDE'], ['kanisani', 'M4_UFA_OUTSIDE'], 'Kifungu kinasema wote wakakimbilia chini ya kibanda.', { t: 1 }],
      ['Mvua ilipokoma, walifanya nini?', 'walirudi nyumbani|walirudi', ['walinunua nyanya', 'M4_UFA_DETAIL_MIX'], ['walienda shuleni', 'M4_UFA_OUTSIDE'], ['walilala sokoni', 'M4_UFA_OUTSIDE'], 'Mvua ilipokoma, walirudi nyumbani wakiwa wamechoka lakini wamefurahi.'],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Kuamka mapema huleta mafanikio.', ['Nyanya na vitunguu ni vitamu.', 'M4_UFA_DETAIL_AS_MAIN'], ['Mvua hunyesha kila Jumamosi.', 'M4_UFA_DETAIL_AS_MAIN'], ['Mjomba ni mwalimu mzuri.', 'M4_UFA_OUTSIDE'], 'Achieng alijifunza kwamba kuamka mapema huleta mafanikio. Hilo ndilo funzo la hadithi nzima.'],
      ['Hadithi hii inatufundisha nini?', 'Tukiamka mapema, tunafanya mambo mengi.', ['Mkungu wa ndizi ni mzito.', 'M4_UFA_DETAIL_AS_MAIN'], ['Mvua huja alasiri.', 'M4_UFA_DETAIL_AS_MAIN'], ['Bibi hupenda ndizi kuliko nyanya.', 'M4_UFA_OUTSIDE'], 'Achieng aliamka mapema na siku yake ilikuwa nzuri. Funzo ni kuamka mapema.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Safari ya sokoni ya Achieng', ['Mkungu wa ndizi', 'M4_UFA_DETAIL_AS_MAIN'], ['Mvua kubwa', 'M4_UFA_DETAIL_AS_MAIN'], ['Nyumba ya bibi', 'M4_UFA_OUTSIDE'], 'Kichwa kizuri kinataja kinachoendelea katika hadithi nzima: safari ya Achieng sokoni.'],
    ],
    order: ['Achieng aliamka mapema.', 'Walifika sokoni.', 'Mvua kubwa ilianza kunyesha.', 'Walirudi nyumbani.'],
    vocab: [
      ['bidhaa', 'vitu vinavyouzwa sokoni au dukani', ['kazi ngumu ya kila siku', 'M4_MSA_LOOKALIKE'], ['wauzaji wa sokoni', 'M4_MSA_NEARBY'], ['vitu visivyo na thamani', 'M4_MSA_OPPOSITE'], 'Wauzaji walipanga bidhaa zao sokoni. Bidhaa ni vitu vinavyouzwa.'],
      ['kibanda', 'nyumba ndogo ya muda', ['kibao cha shule', 'M4_MSA_LOOKALIKE'], ['soko kubwa la mji', 'M4_MSA_NEARBY'], ['jengo kubwa la ghorofa', 'M4_MSA_OPPOSITE'], 'Wote walikimbilia chini ya kibanda ili wasilowe. Kibanda ni nyumba ndogo ya muda.'],
      ['mkungu', 'kundi la ndizi lililoshikana', ['mkufu wa shingoni', 'M4_MSA_LOOKALIKE'], ['shina la mgomba', 'M4_MSA_NEARBY'], ['ndizi moja iliyoiva', 'M4_MSA_OPPOSITE'], 'Achieng alinunua mkungu wa ndizi. Mkungu ni kundi la ndizi nyingi zilizoshikana.'],
      ['ghafla', 'bila kutarajia', ['polepole', 'M4_MSA_OPPOSITE'], ['jioni mapema', 'M4_MSA_NEARBY'], ['kila siku', 'M4_MSA_NEARBY'], 'Mvua kubwa ilianza ghafla: hawakuitarajia. Ghafla ni bila kutarajia.'],
    ],
  },
  {
    id: 'mvua', title: 'Mvua ya Kwanza', kind: 'hadithi',
    text: 'Kwa miezi mingi, kijiji cha Baraka kilikuwa kimekauka. Mto ulikuwa na maji kidogo, na mazao yalikauka shambani.\n\nSiku moja alasiri, mawingu mazito yalitanda angani. Baraka alimwita dada yake, Neema, waweke ndoo uani. Mvua ilianza kunyesha kwa nguvu, na ndoo zote zikajaa maji.\n\nWanakijiji walishangilia na kuimba. Baraka na Neema walikusanya maji kwa ajili ya kunywa na kumwagilia miche. Walishukuru kwa mvua hiyo.',
    who: [
      ['Baraka alimwita nani waweke ndoo uani?', 'dada yake|Neema|dada', ['mama yake', 'M4_UFA_WRONG_PERSON'], ['bibi yake', 'M4_UFA_WRONG_PERSON'], ['mwalimu wake', 'M4_UFA_WRONG_PERSON'], 'Kifungu kinasema Baraka alimwita dada yake, Neema, waweke ndoo uani.', { t: 1 }],
      ['Nani alishangilia na kuimba?', 'wanakijiji', ['Baraka peke yake', 'M4_UFA_WRONG_PERSON'], ['walimu', 'M4_UFA_WRONG_PERSON'], ['wageni', 'M4_UFA_WRONG_PERSON'], 'Kifungu kinasema wanakijiji walishangilia na kuimba.', { t: 1 }],
    ],
    fact: [
      ['Mawingu mazito yalitanda lini?', 'alasiri', ['usiku', 'M4_UFA_OUTSIDE'], ['asubuhi', 'M4_UFA_OUTSIDE'], ['jioni', 'M4_UFA_OUTSIDE'], 'Kifungu kinasema siku moja alasiri, mawingu mazito yalitanda angani.', { t: 1 }],
      ['Baraka na Neema waliweka nini uani?', 'ndoo', ['miche', 'M4_UFA_DETAIL_MIX'], ['vikombe', 'M4_UFA_OUTSIDE'], ['sufuria', 'M4_UFA_OUTSIDE'], 'Waliweka ndoo uani, na zikajaa maji.', { t: 1 }],
      ['Walikusanya maji kwa ajili ya nini?', 'kunywa na kumwagilia miche', ['kuogelea mtoni', 'M4_UFA_OUTSIDE'], ['kuosha gari', 'M4_UFA_OUTSIDE'], ['kujenga nyumba', 'M4_UFA_OUTSIDE'], 'Kifungu kinasema walikusanya maji kwa ajili ya kunywa na kumwagilia miche.'],
      ['Mto ulikuwa na maji kiasi gani kabla ya mvua?', 'maji kidogo', ['maji mengi', 'M4_UFA_DETAIL_MIX'], ['hakuna mto', 'M4_UFA_OUTSIDE'], ['maji ya chumvi', 'M4_UFA_OUTSIDE'], 'Kifungu kinasema mto ulikuwa na maji kidogo.'],
    ],
    main: [
      ['Hadithi hii inatufundisha nini?', 'Mvua ni baraka kwa wakulima na wanakijiji.', ['Ndoo ni muhimu kuliko mto.', 'M4_UFA_DETAIL_AS_MAIN'], ['Dada na kaka hupenda kuimba.', 'M4_UFA_DETAIL_AS_MAIN'], ['Mawingu hutanda kila alasiri.', 'M4_UFA_DETAIL_AS_MAIN'], 'Mvua ilileta maji na furaha kijijini. Hilo ndilo funzo la hadithi nzima.'],
      ['Ujumbe mkuu wa hadithi ni upi?', 'Tunapaswa kushukuru kwa tunachopata.', ['Baraka ana dada anayeitwa Neema.', 'M4_UFA_DETAIL_AS_MAIN'], ['Ndoo zilijaa maji.', 'M4_UFA_DETAIL_AS_MAIN'], ['Mto una maji kidogo.', 'M4_UFA_DETAIL_AS_MAIN'], 'Mwishoni, wote walishukuru kwa mvua. Funzo ni kushukuru.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Mvua inapofika kijijini', ['Ndoo za uani', 'M4_UFA_DETAIL_AS_MAIN'], ['Mto mdogo', 'M4_UFA_DETAIL_AS_MAIN'], ['Dada wa Baraka', 'M4_UFA_DETAIL_AS_MAIN'], 'Hadithi nzima inasimulia mvua ilipofika kijijini.'],
    ],
    order: ['Mawingu mazito yalitanda angani.', 'Baraka na Neema waliweka ndoo uani.', 'Mvua ilinyesha na ndoo zikajaa.', 'Wanakijiji walishangilia na kuimba.'],
    vocab: [
      ['kukauka', 'kuwa bila maji au unyevu', ['kukaa chini', 'M4_MSA_LOOKALIKE'], ['kunyesha mvua', 'M4_MSA_OPPOSITE'], ['kupika chakula', 'M4_MSA_NEARBY'], 'Kijiji kilikauka kwa sababu mvua haikunyesha. Kukauka ni kuwa bila maji.'],
      ['mawingu', 'vitu angani vinavyoleta mvua', ['mawimbi ya baharini', 'M4_MSA_LOOKALIKE'], ['jua kali la mchana', 'M4_MSA_OPPOSITE'], ['nyota za usiku', 'M4_MSA_NEARBY'], 'Mawingu mazito yalitanda kabla ya mvua. Mawingu ni vitu angani vinavyoleta mvua.'],
      ['kushangilia', 'kufurahi kwa sauti na vitendo', ['kushangaa kwa hofu', 'M4_MSA_LOOKALIKE'], ['kulia kwa huzuni', 'M4_MSA_OPPOSITE'], ['kunyamaza kimya', 'M4_MSA_OPPOSITE'], 'Wanakijiji walishangilia na kuimba kwa furaha. Kushangilia ni kufurahi kwa sauti na vitendo.'],
      ['kumwagilia', 'kuweka maji kwenye mimea', ['kumwaga chai chini', 'M4_MSA_LOOKALIKE'], ['kukata mimea', 'M4_MSA_OPPOSITE'], ['kupanda mbegu', 'M4_MSA_NEARBY'], 'Walikusanya maji kwa ajili ya kumwagilia miche. Kumwagilia ni kuweka maji kwenye mimea.'],
    ],
  },
  {
    id: 'maji', title: 'Maji Safi', kind: 'makala',
    text: 'Maji safi ni muhimu kwa afya yetu. Maji yasiyochemshwa yanaweza kuwa na vijidudu vinavyosababisha magonjwa kama kuhara.\n\nIli kupata maji salama ya kunywa, tunapaswa kuyachemsha kwa dakika kumi. Kisha tuyaweke kwenye chombo kilichofunikwa ili yasichafuke tena.\n\nPia ni muhimu kunawa mikono kwa maji na sabuni kabla ya kula. Tukifuata hatua hizi, tutaepuka magonjwa na kuwa na afya njema.',
    fact: [
      ['Maji yasiyochemshwa yanaweza kuwa na nini?', 'vijidudu', ['sukari', 'M4_MAK_OUTSIDE'], ['chumvi', 'M4_MAK_OUTSIDE'], ['mafuta', 'M4_MAK_OUTSIDE'], 'Makala inasema maji yasiyochemshwa yanaweza kuwa na vijidudu.', { t: 1 }],
      ['Maji yachemshwe kwa muda gani?', 'dakika kumi', ['dakika tano', 'M4_MAK_OUTSIDE'], ['saa moja', 'M4_MAK_OUTSIDE'], ['dakika thelathini', 'M4_MAK_OUTSIDE'], 'Makala inasema tunapaswa kuyachemsha kwa dakika kumi.', { t: 1 }],
      ['Maji yaliyochemshwa yawekwe wapi?', 'kwenye chombo kilichofunikwa|kwenye chombo', ['kwenye ndoo wazi', 'M4_MAK_DETAIL_MIX'], ['mtoni', 'M4_MAK_OUTSIDE'], ['sakafuni', 'M4_MAK_OUTSIDE'], 'Makala inasema maji yawekwe kwenye chombo kilichofunikwa ili yasichafuke tena.'],
      ['Tunanawa mikono kwa kutumia nini?', 'maji na sabuni', ['maji peke yake', 'M4_MAK_DETAIL_MIX'], ['mchanga', 'M4_MAK_OUTSIDE'], ['kitambaa kikavu', 'M4_MAK_OUTSIDE'], 'Makala inasema tunanawa mikono kwa maji na sabuni kabla ya kula.', { t: 1 }],
      ['Ni ugonjwa upi uliotajwa kwenye makala?', 'kuhara', ['malaria', 'M4_MAK_OUTSIDE'], ['mafua', 'M4_MAK_OUTSIDE'], ['surua', 'M4_MAK_OUTSIDE'], 'Makala inasema vijidudu vinasababisha magonjwa kama kuhara.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa makala ni upi?', 'Tunapaswa kunywa maji safi na salama ili tuwe na afya njema.', ['Maji huchemshwa kwa dakika kumi.', 'M4_MAK_DETAIL_AS_MAIN'], ['Kuhara ni ugonjwa mbaya.', 'M4_MAK_DETAIL_AS_MAIN'], ['Sabuni inauzwa sokoni.', 'M4_MAK_DETAIL_AS_MAIN'], 'Makala nzima inaeleza jinsi ya kupata maji safi na kuwa na afya njema.'],
      ['Ni kichwa kipi kinafaa zaidi kwa makala hii?', 'Umuhimu wa maji safi', ['Dakika kumi', 'M4_MAK_DETAIL_AS_MAIN'], ['Sabuni na mikono', 'M4_MAK_DETAIL_AS_MAIN'], ['Vijidudu vya mtoni', 'M4_MAK_DETAIL_AS_MAIN'], 'Makala nzima inahusu umuhimu wa maji safi.'],
      ['Makala hii inatufundisha nini?', 'Tuchemshe maji na tunawe mikono ili tuepuke magonjwa.', ['Vijidudu havionekani kwa macho.', 'M4_MAK_DETAIL_AS_MAIN'], ['Chombo kinafunikwa kwa kifuniko.', 'M4_MAK_DETAIL_AS_MAIN'], ['Kula ni muhimu kuliko kunywa.', 'M4_MAK_OUTSIDE'], 'Makala inasema tukifuata hatua hizi tutaepuka magonjwa.'],
    ],
  },
  {
    id: 'mimea', title: 'Kutunza Mimea Shuleni', kind: 'makala',
    text: 'Shule nyingi hupanda miti na maua katika uwanja wa shule. Mimea hupendeza mazingira na hutoa kivuli.\n\nIli mimea ikue vizuri, wanafunzi huimwagilia maji kila asubuhi. Pia huondoa magugu yanayoizunguka.\n\nMwalimu mkuu husema kwamba mimea ni rafiki wa binadamu. Kwa hiyo, kila mwanafunzi anapaswa kuitunza.',
    fact: [
      ['Wanafunzi humwagilia mimea wakati gani?', 'kila asubuhi|asubuhi', ['kila jioni', 'M4_MAK_DETAIL_MIX'], ['kila wiki', 'M4_MAK_OUTSIDE'], ['kila mwezi', 'M4_MAK_OUTSIDE'], 'Makala inasema wanafunzi huimwagilia maji kila asubuhi.', { t: 1 }],
      ['Wanafunzi huondoa nini karibu na mimea?', 'magugu', ['mawe', 'M4_MAK_OUTSIDE'], ['takataka', 'M4_MAK_OUTSIDE'], ['maji', 'M4_MAK_DETAIL_MIX'], 'Makala inasema huondoa magugu yanayoizunguka.', { t: 1 }],
      ['Mimea hutoa nini kwa shule?', 'kivuli', ['mvua', 'M4_MAK_OUTSIDE'], ['joto', 'M4_MAK_OUTSIDE'], ['mawe', 'M4_MAK_OUTSIDE'], 'Makala inasema mimea hupendeza mazingira na hutoa kivuli.', { t: 1 }],
      ['Nani husema mimea ni rafiki wa binadamu?', 'mwalimu mkuu', ['mkulima', 'M4_MAK_OUTSIDE'], ['daktari', 'M4_MAK_OUTSIDE'], ['mwanafunzi', 'M4_MAK_DETAIL_MIX'], 'Makala inasema mwalimu mkuu husema mimea ni rafiki wa binadamu.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa makala ni upi?', 'Kila mwanafunzi anapaswa kutunza mimea.', ['Wanafunzi huondoa magugu.', 'M4_MAK_DETAIL_AS_MAIN'], ['Shule nyingi hupanda maua.', 'M4_MAK_DETAIL_AS_MAIN'], ['Magugu ni mabaya kuliko miti.', 'M4_MAK_OUTSIDE'], 'Makala inamalizia kwa kusema kila mwanafunzi anapaswa kuitunza mimea.'],
      ['Ni kichwa kipi kinafaa zaidi kwa makala hii?', 'Kutunza mimea shuleni', ['Magugu ya shule', 'M4_MAK_DETAIL_AS_MAIN'], ['Mwalimu mkuu', 'M4_MAK_DETAIL_AS_MAIN'], ['Kivuli cha jua', 'M4_MAK_DETAIL_AS_MAIN'], 'Makala nzima inahusu jinsi ya kutunza mimea shuleni.'],
    ],
  },
  {
    id: 'duka', title: 'Kwenye Duka la Mzee Juma', kind: 'igizo',
    text: 'Mzee Juma: Karibu, mwanangu. Unataka nini leo?\nAtieno: Hujambo, Mzee Juma. Naomba kilo mbili za unga.\nMzee Juma: (anapima unga) Hizi hapa. Ni shilingi mia mbili.\nAtieno: (anatoa pesa) Asante sana. Mama alisema nikusalimie.\nMzee Juma: (anatabasamu) Mwambie asante. Safari njema, mwanangu.',
    who: [
      ['Nani alisema, "Naomba kilo mbili za unga"?', 'Atieno', ['Mzee Juma', 'M4_IGI_WRONG_SPEAKER'], ['mama yake', 'M4_IGI_WRONG_SPEAKER'], ['mnunuzi mwingine', 'M4_IGI_WRONG_SPEAKER'], 'Jina lililo mbele ya nukta mbili ni Atieno, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
      ['Nani alisema, "Karibu, mwanangu"?', 'Mzee Juma', ['Atieno', 'M4_IGI_WRONG_SPEAKER'], ['mama yake Atieno', 'M4_IGI_WRONG_SPEAKER'], ['mteja mwingine', 'M4_IGI_WRONG_SPEAKER'], 'Jina lililo mbele ya nukta mbili ni Mzee Juma, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
      ['Nani alisema, "Mama alisema nikusalimie"?', 'Atieno', ['Mzee Juma', 'M4_IGI_WRONG_SPEAKER'], ['mama yake', 'M4_IGI_WRONG_SPEAKER'], ['jirani', 'M4_IGI_WRONG_SPEAKER'], 'Mstari huu uko chini ya jina Atieno, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
      ['Nani alisema, "Asante sana"?', 'Atieno', ['Mzee Juma', 'M4_IGI_WRONG_SPEAKER'], ['mama yake', 'M4_IGI_WRONG_SPEAKER'], ['jirani', 'M4_IGI_WRONG_SPEAKER'], 'Mstari huu uko chini ya jina Atieno, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
      ['Nani alisema, "Safari njema, mwanangu"?', 'Mzee Juma', ['Atieno', 'M4_IGI_WRONG_SPEAKER'], ['mama yake Atieno', 'M4_IGI_WRONG_SPEAKER'], ['mteja mwingine', 'M4_IGI_WRONG_SPEAKER'], 'Mstari huu uko chini ya jina Mzee Juma, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
      ['Nani alisema, "Hizi hapa. Ni shilingi mia mbili"?', 'Mzee Juma', ['Atieno', 'M4_IGI_WRONG_SPEAKER'], ['mama yake', 'M4_IGI_WRONG_SPEAKER'], ['jirani', 'M4_IGI_WRONG_SPEAKER'], 'Mstari huu uko chini ya jina Mzee Juma, kwa hiyo yeye ndiye aliyesema.', { t: 1 }],
    ],
    fact: [
      ['Atieno alinunua nini dukani?', 'unga', ['sukari', 'M4_IGI_OUTSIDE'], ['mchele', 'M4_IGI_OUTSIDE'], ['mafuta', 'M4_IGI_OUTSIDE'], 'Atieno alisema, "Naomba kilo mbili za unga."', { t: 1 }],
      ['Unga ulikuwa wa shilingi ngapi?', 'shilingi mia mbili|mia mbili', ['shilingi mia tano', 'M4_IGI_OUTSIDE'], ['shilingi ishirini', 'M4_IGI_OUTSIDE'], ['shilingi elfu moja', 'M4_IGI_OUTSIDE'], 'Mzee Juma alisema, "Ni shilingi mia mbili."', { t: 1 }],
      ['Atieno alinunua unga kilo ngapi?', 'kilo mbili|mbili', ['kilo moja', 'M4_IGI_OUTSIDE'], ['kilo tano', 'M4_IGI_OUTSIDE'], ['kilo kumi', 'M4_IGI_OUTSIDE'], 'Atieno alisema, "Naomba kilo mbili za unga."', { t: 1 }],
      ['Mzee Juma alisema nini mwishoni?', 'Safari njema, mwanangu.', ['Karibu tena kesho.', 'M4_IGI_OUTSIDE'], ['Pole kwa safari.', 'M4_IGI_OUTSIDE'], ['Nipe pesa zangu.', 'M4_IGI_OUTSIDE'], 'Mstari wa mwisho wa Mzee Juma ni "Safari njema, mwanangu."', { t: 1 }],
      ['Mzee Juma alifanya nini kabla ya kutaja bei?', 'alipima unga|alipima', ['alitoa pesa', 'M4_IGI_WRONG_SPEAKER'], ['alitabasamu', 'M4_IGI_WRONG_SPEAKER'], ['alifunga duka', 'M4_IGI_OUTSIDE'], 'Maelekezo yanasema "(anapima unga)" kabla ya Mzee Juma kutaja bei.', { t: 1 }],
    ],
    dir: [
      ['Ni maelekezo ya jukwaani yapi?', '(anapima unga)', ['Hizi hapa.', 'M4_IGI_DIRECTION'], ['Asante sana.', 'M4_IGI_DIRECTION'], ['Mzee Juma:', 'M4_IGI_DIRECTION'], 'Maelekezo ya jukwaani yako kwenye mabano. "(anapima unga)" inamwonyesha Mzee Juma afanye nini.'],
      ['Ni maelekezo ya jukwaani yapi?', '(anatoa pesa)', ['Naomba kilo mbili za unga.', 'M4_IGI_DIRECTION'], ['Atieno:', 'M4_IGI_DIRECTION'], ['Ni shilingi mia mbili.', 'M4_IGI_DIRECTION'], '"(anatoa pesa)" iko kwenye mabano, kwa hiyo ni maelekezo ya jukwaani.'],
      ['Ni maelekezo ya jukwaani yapi?', '(anatabasamu)', ['Mwambie asante.', 'M4_IGI_DIRECTION'], ['Safari njema, mwanangu.', 'M4_IGI_DIRECTION'], ['Mzee Juma:', 'M4_IGI_DIRECTION'], '"(anatabasamu)" iko kwenye mabano, kwa hiyo ni maelekezo ya jukwaani.'],
      ['Mabano katika igizo yanaonyesha nini?', 'maelekezo ya jukwaani', ['maneno ya mhusika', 'M4_IGI_DIRECTION'], ['jina la igizo', 'M4_IGI_DIRECTION'], ['jina la mwandishi', 'M4_IGI_DIRECTION'], 'Maneno yaliyo kwenye mabano ni maelekezo ya jukwaani: yanaonyesha muigizaji afanye nini.'],
      ['"(anapima unga)" inamwonyesha muigizaji afanye nini?', 'apime unga', ['aseme "Karibu"', 'M4_IGI_DIRECTION'], ['atoe pesa', 'M4_IGI_WRONG_SPEAKER'], ['aondoke dukani', 'M4_IGI_OUTSIDE'], 'Maelekezo yanasema "anapima unga", kwa hiyo Mzee Juma anapaswa kupima unga.'],
    ],
  },
  {
    id: 'shairi1', title: 'Mvua', kind: 'shairi',
    text: 'Mvua imenyesha, kijiji kimefurahi,\nMito imejaa, maji ni tele.\nWakulima wanapanda, mbegu zao shambani,\nTuombe baraka, mavuno yawe mengi.\n\nWatoto wanacheza, nje kwenye matope,\nMama anapika, uji wa moto.\nBaba anaangalia, mawingu ya angani,\nFuraha imetanda, kote kijijini.\n\nMvua ni zawadi, kutoka kwa Mungu,\nTuitunze vizuri, maji tusipoteze.\nTuyahifadhi kwa ndoo, kwa siku za jua,\nShukrani kwa mvua, tunaimba pamoja.',
    beti: 3, per: 4,
    lines: [['Mvua imenyesha, kijiji kimefurahi,', 'Mito imejaa, maji ni tele.', 'Wakulima wanapanda, mbegu zao shambani,', 'Tuombe baraka, mavuno yawe mengi.'], ['Watoto wanacheza, nje kwenye matope,', 'Mama anapika, uji wa moto.', 'Baba anaangalia, mawingu ya angani,', 'Furaha imetanda, kote kijijini.'], ['Mvua ni zawadi, kutoka kwa Mungu,', 'Tuitunze vizuri, maji tusipoteze.', 'Tuyahifadhi kwa ndoo, kwa siku za jua,', 'Shukrani kwa mvua, tunaimba pamoja.']],
  },
  {
    id: 'shairi2', title: 'Shule Yetu', kind: 'shairi',
    text: 'Shule yetu ni nyumba, ya elimu na adabu,\nWalimu ni wazazi, wanaotuongoza.\nTunasoma kila siku, kwa moyo wa bidii,\nKesho tutakuwa, viongozi wa nchi.\n\nDarasani tunacheka, tunajifunza pamoja,\nUwanjani tunacheza, kwa amani na upendo.\nKila mtoto anathaminiwa, bila ubaguzi,\nShule yetu ni nuru, katika kijiji chetu.',
    beti: 2, per: 4,
    lines: [['Shule yetu ni nyumba, ya elimu na adabu,', 'Walimu ni wazazi, wanaotuongoza.', 'Tunasoma kila siku, kwa moyo wa bidii,', 'Kesho tutakuwa, viongozi wa nchi.'], ['Darasani tunacheka, tunajifunza pamoja,', 'Uwanjani tunacheza, kwa amani na upendo.', 'Kila mtoto anathaminiwa, bila ubaguzi,', 'Shule yetu ni nuru, katika kijiji chetu.']],
  },
];
// the poems carry their count questions, built from beti, per and lines
for (const p of PASSAGES.filter(x => x.kind === 'shairi')) {
  const other = (n, k) => { const s = new Set([String(n)]); const out = []; for (const x of [n + 1, n - 1, n * 2, p.beti * p.per, p.per, p.beti, 3]) { const v = String(x); if (x > 0 && !s.has(v)) { s.add(v); out.push([v, 'M4_SHA_COUNT']); } } return out.slice(0, 3); };
  const ordinal = ['kwanza', 'pili', 'tatu'];
  const total = p.beti * p.per;
  p.count = [
    ['Shairi hili lina beti ngapi?', String(p.beti), ...other(p.beti), `Hesabu makundi ya mishororo yaliyotenganishwa: ni ${p.beti}, kwa hiyo shairi lina beti ${p.beti}.`, { t: 1 }],
    ['Shairi lote lina mishororo mingapi?', String(total), ...other(total), `Beti ${p.beti} zenye mishororo ${p.per} kila moja ni mishororo ${total}.`, { t: 1 }],
    ...Array.from({ length: p.beti }, (_, i) => [`Ubeti wa ${ordinal[i]} una mishororo mingapi?`, String(p.per), ...other(p.per), `Ubeti wa ${ordinal[i]} una mishororo ${p.per}: hesabu mistari ya ubeti huo tu.`, { t: 1 }]),
  ];
  p.line = p.lines.flatMap((v, vi) => [0, 1].map(li => {
    const right = v[li], wrongs = [];
    const pool = [...p.lines.flatMap((w, wi) => w.map((l, k) => ({ l, wi, k }))).filter(x => x.l !== right)];
    for (const x of shuffle(pool).slice(0, 3)) wrongs.push([x.l, 'M4_SHA_UBETI_MIX']);
    return [`Mshororo wa ${ordinal[li]} wa ubeti wa ${ordinal[vi]} ni upi?`, right, ...wrongs, `Fungua ubeti wa ${ordinal[vi]} na usome mshororo wa ${ordinal[li]}.`];
  }));
}
const showP = (p) => ({ title: p.title, text: p.text });

// ---------------------------------------------------------------- builders
const flat = (key, kind) => PASSAGES.filter(p => (kind ? p.kind === kind : true) && p[key]).flatMap(p => p[key].map(e => ({ p, e })));
const norm = (key, e) => {
  const a = [...e];
  const flags = a.length && !Array.isArray(a[a.length - 1]) && typeof a[a.length - 1] === 'object' ? a.pop() : {};
  const because = a.pop();
  if (key === 'vocab') return { q: `Katika kifungu, neno "${a[0]}" lina maana gani?`, right: a[1], wrongs: a.slice(2), because, flags };
  return { q: a[0], right: a[1], wrongs: a.slice(2), because, flags };
};
const optionsOf = (cskill, wrongs, right) => mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
const passChoose = (key, { hints, kind, label = 'Soma kifungu. Kisha chagua jibu sahihi.' }) => (cskill) => {
  const { p, e } = pick(flat(key, kind));
  const n = norm(key, e), options = optionsOf(cskill, n.wrongs, n.right.split('|')[0]);
  if (!options) return null;
  return { passage: showP(p), question: n.q, options, instruction: label, hints, steps: [n.because, `Jibu ni "${n.right.split('|')[0]}".`] };
};
const passType = (key, { hints, kind, label = 'Soma kifungu. Kisha andika jibu fupi.' }) => (cskill) => {
  const { p, e } = pick(flat(key, kind).filter(x => norm(key, x.e).flags.t));
  const n = norm(key, e), [shown, ...alt] = n.right.split('|');
  return { passage: showP(p), question: n.q, answer: shown, accepts: alt, wrong: n.wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]), instruction: label, hints: [...hints, `Jibu linaanza na herufi "${shown[0]}".`], steps: [n.because, `Jibu ni "${shown}".`], chk: (a) => [shown, ...alt].includes(String(a)) };
};
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
  const f = feedbackOf(cskill, 'M4_UFA_ORDER');
  const options = mc(right, [[reversed, f, 'M4_UFA_ORDER'], [seq(sw), f, 'M4_UFA_ORDER'], [rot, f, 'M4_UFA_ORDER']]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { passage: showP(p), question: `Matukio manne ya hadithi yamechanganywa. Ni orodha ipi inaonyesha mpangilio ambao yalitokea? ${list}`, options, fixedOrder: false, instruction: 'Soma kifungu. Kisha chagua jibu sahihi.',
    hints: ['Tafuta tukio la kwanza kwenye kifungu, kisha linalofuata.', 'Angalia maneno ya wakati kama "kisha", "baadaye" na "baada ya".'], steps: [`Katika hadithi matukio yalitokea hivi: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Kwa herufi ni ${right}.`], chk: () => true };
};

// ---------------------------------------------------------------- word and sentence pools
const MSA_GAP = [
  ['Mama alinunua ___ wa ndizi sokoni.', 'mkungu', ['mkufu', 'M4_MSA_LOOKALIKE'], ['mgomba', 'M4_MSA_NEARBY'], ['mkate', 'M4_MSA_NEARBY'], 'Mkungu ni kundi la ndizi lililoshikana.'],
  ['Wauzaji walipanga ___ zao mezani.', 'bidhaa', ['bidii', 'M4_MSA_LOOKALIKE'], ['biashara', 'M4_MSA_NEARBY'], ['bibi', 'M4_MSA_LOOKALIKE'], 'Bidhaa ni vitu vinavyouzwa sokoni au dukani.'],
  ['Tulikimbilia chini ya ___ ili tusilowe na mvua.', 'kibanda', ['kibao', 'M4_MSA_LOOKALIKE'], ['kiberiti', 'M4_MSA_LOOKALIKE'], ['mto', 'M4_MSA_NEARBY'], 'Kibanda ni nyumba ndogo ya muda inayotukinga na mvua.'],
  ['Mvua ilianza kunyesha ___, hatukuitarajia.', 'ghafla', ['polepole', 'M4_MSA_OPPOSITE'], ['taratibu', 'M4_MSA_OPPOSITE'], ['jana', 'M4_MSA_NEARBY'], 'Ghafla ni bila kutarajia.'],
  ['Wakulima wanasubiri mvua kwa sababu mazao yameanza ___.', 'kukauka', ['kukaa', 'M4_MSA_LOOKALIKE'], ['kukua', 'M4_MSA_OPPOSITE'], ['kuiva', 'M4_MSA_NEARBY'], 'Kukauka ni kuwa bila maji au unyevu.'],
  ['Watoto walifurahi na ___ baada ya mvua kunyesha.', 'kushangilia', ['kushangaa', 'M4_MSA_LOOKALIKE'], ['kulia', 'M4_MSA_OPPOSITE'], ['kunyamaza', 'M4_MSA_OPPOSITE'], 'Kushangilia ni kufurahi kwa sauti na vitendo.'],
  ['Mkulima huanza ___ miche asubuhi ili ikue.', 'kumwagilia', ['kumwaga', 'M4_MSA_LOOKALIKE'], ['kukata', 'M4_MSA_OPPOSITE'], ['kupanda', 'M4_MSA_NEARBY'], 'Kumwagilia ni kuweka maji kwenye mimea.'],
];
const SHA_DEF = [
  ['Mstari mmoja wa shairi huitwa ___.', 'mshororo', ['ubeti', 'M4_SHA_UBETI_MIX'], ['aya', 'M4_SHA_PARAGRAPH'], ['kichwa', 'M4_SHA_PARAGRAPH'], 'Mshororo ni mstari mmoja wa shairi.'],
  ['Kundi la mishororo katika shairi huitwa ___.', 'ubeti', ['mshororo', 'M4_SHA_UBETI_MIX'], ['aya', 'M4_SHA_PARAGRAPH'], ['kichwa', 'M4_SHA_PARAGRAPH'], 'Ubeti ni kundi la mishororo.'],
  ['Maandishi yenye mishororo mifupi iliyopangwa katika beti huitwa ___.', 'shairi', ['makala', 'M4_SHA_PARAGRAPH'], ['barua', 'M4_SHA_PARAGRAPH'], ['aya', 'M4_SHA_PARAGRAPH'], 'Shairi lina mishororo mifupi iliyopangwa katika beti.'],
  ['Shairi lina vitu viwili vikuu: mishororo na ___.', 'beti', ['aya', 'M4_SHA_PARAGRAPH'], ['herufi', 'M4_SHA_PARAGRAPH'], ['sentensi', 'M4_SHA_PARAGRAPH'], 'Mishororo hupangwa katika beti.'],
  ['Mshororo ni sehemu ya ___.', 'ubeti', ['aya', 'M4_SHA_PARAGRAPH'], ['neno', 'M4_SHA_UBETI_MIX'], ['herufi', 'M4_SHA_UBETI_MIX'], 'Mishororo kadhaa hufanya ubeti mmoja.'],
];
const SHA_UMBO = [
  ['Ni maandishi yapi ni shairi?', 'Mistari mifupi iliyopangwa katika beti', ['Aya ndefu inayoendelea bila kukatika', 'M4_SHA_PARAGRAPH'], ['Mazungumzo yenye majina ya wahusika na nukta mbili', 'M4_SHA_PARAGRAPH'], ['Orodha ya vitu vya kununua', 'M4_SHA_PARAGRAPH'], 'Shairi lina mishororo mifupi iliyopangwa katika beti.'],
  ['Shairi linaonekanaje ukurasani?', 'Lina mishororo mifupi iliyopangwa katika vikundi vinavyoitwa beti', ['Lina aya ndefu zenye sentensi nyingi', 'M4_SHA_PARAGRAPH'], ['Lina majina ya wahusika upande wa kushoto', 'M4_SHA_PARAGRAPH'], ['Lina jedwali la namba', 'M4_SHA_PARAGRAPH'], 'Umbo la shairi ni mishororo mifupi katika beti.'],
  ['Tunaweza kutambua shairi kwa kuangalia ___.', 'umbo lake la mishororo na beti', ['rangi ya karatasi', 'M4_SHA_PARAGRAPH'], ['urefu wa kichwa', 'M4_SHA_PARAGRAPH'], ['jina la mwandishi', 'M4_SHA_PARAGRAPH'], 'Shairi hutambuliwa kwa umbo lake: mishororo na beti.'],
  ['Ni kipi kinaonyesha kwamba maandishi ni shairi?', 'Yamepangwa katika mishororo na beti', ['Yana picha nyingi', 'M4_SHA_PARAGRAPH'], ['Yameandikwa kwa wino mweusi', 'M4_SHA_PARAGRAPH'], ['Yana aya tatu ndefu', 'M4_SHA_PARAGRAPH'], 'Shairi hupangwa katika mishororo na beti.'],
  ['Katika shairi, kila mstari mfupi huandikwa ___.', 'peke yake kama mshororo', ['ndani ya aya', 'M4_SHA_PARAGRAPH'], ['ndani ya jedwali', 'M4_SHA_PARAGRAPH'], ['bila mpangilio', 'M4_SHA_PARAGRAPH'], 'Kila mstari mfupi wa shairi ni mshororo na huandikwa peke yake.'],
];
const KAMUSI = [
  ['Kati ya "nyoka", "ndizi" na "samaki", neno linalokuja kwanza kwenye kamusi ni ___.', 'ndizi', ['nyoka', 'M4_KAM_FIRST_ONLY'], ['samaki', 'M4_KAM_REVERSE'], 'Maneno mawili yanaanza na n. Herufi ya pili: d huja kabla ya y, kwa hiyo ndizi inakuja kwanza.'],
  ['Kati ya "kiti", "chungu" na "meza", neno linalokuja kwanza kwenye kamusi ni ___.', 'chungu', ['kiti', 'M4_KAM_LENGTH'], ['meza', 'M4_KAM_REVERSE'], 'Herufi ya kwanza ya chungu ni c, na c huja kabla ya k na m.'],
  ['Kati ya "paka", "ubao" na "farasi", neno linalokuja kwanza kwenye kamusi ni ___.', 'farasi', ['paka', 'M4_KAM_LENGTH'], ['ubao', 'M4_KAM_REVERSE'], 'Herufi ya kwanza ya farasi ni f, na f huja kabla ya p na u.'],
  ['Kati ya "jembe", "kuku" na "boga", neno linalokuja kwanza kwenye kamusi ni ___.', 'boga', ['jembe', 'M4_KAM_LENGTH'], ['kuku', 'M4_KAM_REVERSE'], 'Herufi ya kwanza ya boga ni b, na b huja kabla ya j na k.'],
  ['Kati ya "dada", "dawa" na "daftari", neno linalokuja kwanza kwenye kamusi ni ___.', 'dada', ['dawa', 'M4_KAM_FIRST_ONLY'], ['daftari', 'M4_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na da. Herufi ya tatu: d huja kabla ya f na w, kwa hiyo dada inakuja kwanza.'],
  ['Kati ya "mkoba", "mkono" na "mkate", neno linalokuja kwanza kwenye kamusi ni ___.', 'mkate', ['mkoba', 'M4_KAM_FIRST_ONLY'], ['mkono', 'M4_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na mk. Herufi ya tatu: a huja kabla ya o, kwa hiyo mkate unakuja kwanza.'],
  ['Kati ya "sufuria", "sanduku" na "sahani", neno linalokuja kwanza kwenye kamusi ni ___.', 'sahani', ['sanduku', 'M4_KAM_FIRST_ONLY'], ['sufuria', 'M4_KAM_REVERSE'], 'Maneno yote yanaanza na s. Herufi ya pili: a huja kabla ya u. Kisha h huja kabla ya n, kwa hiyo sahani inakuja kwanza.'],
  ['Kati ya "ndizi", "chungwa" na "tikiti", neno linalokuja mwisho kwenye kamusi ni ___.', 'tikiti', ['chungwa', 'M4_KAM_REVERSE'], ['ndizi', 'M4_KAM_LENGTH'], 'Herufi ya kwanza ya tikiti ni t, na t huja baada ya c na n.'],
];
const KAMUSI_USE = [
  ['Kamusi hutusaidia kupata ___ ya neno.', 'maana', ['picha', 'M4_KAM_PURPOSE'], ['rangi', 'M4_KAM_PURPOSE'], ['harufu', 'M4_KAM_PURPOSE'], 'Kamusi ni kitabu chenye maneno na maana zake.'],
  ['Maneno kwenye kamusi yamepangwa kwa mpangilio wa ___.', 'alfabeti', ['urefu', 'M4_KAM_LENGTH'], ['rangi', 'M4_KAM_PURPOSE'], ['umri', 'M4_KAM_PURPOSE'], 'Kamusi hupanga maneno kwa mpangilio wa alfabeti, ili tuyapate kwa urahisi.'],
  ['Mwanafunzi hutumia ___ kutafuta maana ya neno asilolijua.', 'kamusi', ['atlasi', 'M4_KAM_PURPOSE'], ['ratiba', 'M4_KAM_PURPOSE'], ['gazeti', 'M4_KAM_PURPOSE'], 'Kamusi ndicho kitabu cha kutafuta maana za maneno.'],
  ['Kamusi huanza na maneno yanayoanza na herufi ___.', 'a', ['z', 'M4_KAM_REVERSE'], ['m', 'M4_KAM_REVERSE'], ['k', 'M4_KAM_REVERSE'], 'Alfabeti huanza na a, kwa hiyo kamusi huanza na maneno ya herufi a.'],
  ['Kamusi ni kitabu chenye maneno na ___ zake.', 'maana', ['hadithi', 'M4_KAM_PURPOSE'], ['picha', 'M4_KAM_PURPOSE'], ['nyimbo', 'M4_KAM_PURPOSE'], 'Kamusi hutoa maana ya kila neno.'],
];
const UFS = [
  ['Kusoma kwa ufasaha kunamaanisha nini?', 'Kusoma kwa matamshi bora, sauti inayosikika na kasi ifaayo', ['Kusoma haraka kuliko wenzako', 'M4_UFS_SPEED'], ['Kusoma kwa sauti ya juu zaidi darasani', 'M4_UFS_LOUD'], ['Kusoma bila kuangalia alama za uakifishi', 'M4_UFS_IGNORE_MARKS'], 'Kusoma kwa ufasaha ni kusoma kwa matamshi bora, sauti inayosikika na kasi ifaayo.'],
  ['Msomaji anafaa kufanya nini anapofika kwenye kikomo?', 'Apumzike kwa muda mrefu kidogo kuliko kwenye koma', ['Aendelee bila kupumzika', 'M4_UFS_IGNORE_MARKS'], ['Apige kelele', 'M4_UFS_LOUD'], ['Aharakishe kusoma', 'M4_UFS_SPEED'], 'Kikomo kinaonyesha mwisho wa sentensi, kwa hiyo tunapumzika muda mrefu kidogo.'],
  ['Ni sauti ipi inafaa kwa kusoma darasani?', 'Sauti inayosikika wazi bila kupiga kelele', ['Sauti ya kunong\'ona', 'M4_UFS_LOUD'], ['Sauti ya kupiga kelele', 'M4_UFS_LOUD'], ['Kunyamaza kabisa', 'M4_UFS_IGNORE_MARKS'], 'Sauti inayofaa inasikika wazi bila kupiga kelele wala kunong\'ona.'],
  ['Kasi ifaayo ya kusoma ni ipi?', 'Si haraka sana wala polepole sana', ['Haraka sana', 'M4_UFS_SPEED'], ['Polepole sana', 'M4_UFS_SPEED'], ['Kasi ya mkimbiaji', 'M4_UFS_SPEED'], 'Kasi ifaayo ni ya wastani, ili msikilizaji aelewe kila neno.'],
  ['Msomaji anapofika kwenye koma, afanye nini?', 'Apumzike kidogo', ['Aendelee bila kupumzika', 'M4_UFS_IGNORE_MARKS'], ['Asimame kabisa na anyamaze', 'M4_UFS_IGNORE_MARKS'], ['Aongeze kasi', 'M4_UFS_SPEED'], 'Koma inaonyesha mahali pa kupumzika kidogo.'],
  ['Msomaji anaposoma kwa ufasaha, msikilizaji anapaswa kuelewa nini?', 'Kila neno na ujumbe', ['Maneno ya mwanzo tu', 'M4_UFS_SPEED'], ['Sauti ya msomaji tu', 'M4_UFS_LOUD'], ['Hakuna kitu', 'M4_UFS_IGNORE_MARKS'], 'Lengo la kusoma kwa ufasaha ni msikilizaji aelewe kila neno na ujumbe.'],
];
const UFS_S = [
  ['', 'Msomaji mzuri husoma kwa kasi ya wastani.', ['Msomaji mzuri husoma kwa kasi ya kukimbia.', 'M4_UFS_SPEED'], ['Msomaji mzuri husoma polepole sana.', 'M4_UFS_SPEED'], 'Kasi ya wastani humwezesha msikilizaji kuelewa kila neno.'],
  ['', 'Msomaji mzuri hupumzika kwenye alama za uakifishi.', ['Msomaji mzuri haangalii alama za uakifishi.', 'M4_UFS_IGNORE_MARKS'], ['Msomaji mzuri husoma bila kupumzika.', 'M4_UFS_IGNORE_MARKS'], 'Alama za uakifishi zinaonyesha mahali pa kupumzika.'],
  ['', 'Msomaji mzuri hutamka kila neno vizuri.', ['Msomaji mzuri huruka maneno magumu.', 'M4_UFS_SPEED'], ['Msomaji mzuri humeza maneno ili amalize haraka.', 'M4_UFS_SPEED'], 'Matamshi bora humsaidia msikilizaji kuelewa kila neno.'],
  ['', 'Msomaji mzuri hutumia sauti inayosikika wazi.', ['Msomaji mzuri hupiga kelele kila wakati.', 'M4_UFS_LOUD'], ['Msomaji mzuri hunong\'ona anaposoma.', 'M4_UFS_LOUD'], 'Sauti inayofaa inasikika wazi bila kupiga kelele.'],
  ['', 'Msomaji mzuri hupumzika muda mrefu kidogo kwenye kikomo.', ['Msomaji mzuri hukimbia kwenye kikomo.', 'M4_UFS_SPEED'], ['Msomaji mzuri hupaza sauti kwenye kikomo.', 'M4_UFS_LOUD'], 'Kikomo kinaonyesha mwisho wa sentensi, kwa hiyo tunapumzika.'],
];
const DIG_SIT = [
  ['Mtu usiyemjua mtandaoni anakuuliza jina la shule yako. Ufanye nini?', 'Nisimjibu na nimweleze mzazi au mwalimu', ['Nimwambie jina la shule', 'M4_DIG_SHARE'], ['Nimtumie picha yangu pia', 'M4_DIG_SHARE'], ['Nimwulize jina lake la ukweli', 'M4_DIG_SHARE'], 'Maelezo kama jina la shule si ya kumpa mtu usiyemjua. Mweleze mtu mzima.'],
  ['Ujumbe unasema umeshinda simu mpya, bonyeza kiungo. Ufanye nini?', 'Nimwonyeshe mzazi au mwalimu kwanza', ['Nibonyeze haraka', 'M4_DIG_LINK'], ['Nitume kwa marafiki wote', 'M4_DIG_LINK'], ['Nijibu kwa nambari yangu ya simu', 'M4_DIG_SHARE'], 'Viungo visivyojulikana vinaweza kuwa hatari. Mwonyeshe mtu mzima kabla ya kukifungua.'],
  ['Unamaliza kutumia simu ya mzazi. Ufanye nini?', 'Nitoke kwenye programu na nirudishe simu', ['Niache akaunti wazi kwa wengine', 'M4_DIG_SHARE'], ['Nimwachie rafiki nenosiri langu', 'M4_DIG_SHARE'], ['Niandike nenosiri langu kwenye simu', 'M4_DIG_SHARE'], 'Ukitoka kwenye akaunti, hakuna mwingine anayeweza kuitumia.'],
  ['Tovuti inakuomba nambari ya simu ya mama kabla ya kusoma hadithi. Ufanye nini?', 'Niache tovuti hiyo na nimweleze mzazi', ['Niandike nambari', 'M4_DIG_UNSAFE_SITE'], ['Niandike nambari ya uongo', 'M4_DIG_UNSAFE_SITE'], ['Niendelee kusoma bila kujali', 'M4_DIG_UNSAFE_SITE'], 'Tovuti salama haidai nambari ya simu ili usome. Mweleze mtu mzima.'],
  ['Mwenzako anakuomba nenosiri la simu yako. Ufanye nini?', 'Nikatae na niweke nenosiri siri', ['Nimpe nikimwambia asimwambie mtu', 'M4_DIG_SHARE'], ['Nimwandikie kwenye karatasi', 'M4_DIG_SHARE'], ['Nimpe nusu ya nenosiri', 'M4_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu mwingine, hata rafiki.'],
  ['Unatafuta kifungu cha kusoma kwenye mtandao. Utatumia tovuti ipi?', 'Tovuti aliyopendekeza mwalimu', ['Tovuti yoyote inayotokea kwanza', 'M4_DIG_UNSAFE_SITE'], ['Tovuti inayodai pesa', 'M4_DIG_UNSAFE_SITE'], ['Tovuti isiyojulikana', 'M4_DIG_UNSAFE_SITE'], 'Tumia tovuti salama zilizopendekezwa na mwalimu au mzazi.'],
];
const DIG_STATEMENT = [
  ['', 'Ninaweka nenosiri langu siri.', ['Ninampa rafiki nenosiri langu.', 'M4_DIG_SHARE'], ['Ninaandika nenosiri langu ubaoni.', 'M4_DIG_SHARE'], 'Nenosiri ni siri yako. Usimpe mtu mwingine.'],
  ['', 'Ninamwonyesha mtu mzima kiungo nisichokijua.', ['Ninafungua kila kiungo ninachotumiwa.', 'M4_DIG_LINK'], ['Ninatuma kiungo kisichojulikana kwa wengine.', 'M4_DIG_LINK'], 'Viungo visivyojulikana vinaweza kuwa hatari. Mwonyeshe mtu mzima kwanza.'],
  ['', 'Ninasoma kwenye tovuti ya shule.', ['Ninasoma kwenye tovuti inayoomba nambari yangu.', 'M4_DIG_UNSAFE_SITE'], ['Ninaingiza maelezo yangu kwenye tovuti ya zawadi.', 'M4_DIG_UNSAFE_SITE'], 'Tumia tovuti salama na usitoe maelezo yako binafsi.'],
  ['', 'Ninatoka kwenye akaunti ninapomaliza.', ['Ninaiacha akaunti yangu wazi.', 'M4_DIG_SHARE'], ['Ninamwachia mwenzangu nenosiri langu.', 'M4_DIG_SHARE'], 'Ukitoka kwenye akaunti yako, hakuna mwingine anayeweza kuitumia.'],
  ['', 'Ninauliza mwalimu kabla ya kupakua faili.', ['Ninapakua faili yoyote ninayoiona.', 'M4_DIG_LINK'], ['Ninafungua faili kutoka kwa mtu nisiyemjua.', 'M4_DIG_LINK'], 'Faili zisizojulikana zinaweza kuwa hatari. Uliza mtu mzima kwanza.'],
];

const C_MSA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.MSAMIATI', C_UFA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', C_MAK = 'KUSOMA.T6_KUSOMA_KWA_KINA.MAKALA', C_IGI = 'KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO',
  C_SHA = 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI', C_KAM = 'KUSOMA.T2_KUSOMA_KWA_KINA.KAMUSI', C_UFS = 'KUSOMA.T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE', C_DIG = 'KUSOMA.T4_KUSOMA_KWA_MAPANA.USALAMA_DIJITALI';

export const FAMILIES = [
  // ---- MSAMIATI
  kw({ id: 'kiswahili4.msamiati.maana', cs: C_MSA, oc: 'a', kind: 'choose-meaning', form: 'word', rung: 2, gen: passChoose('vocab', { kind: 'hadithi', hints: H('Soma sentensi lenye neno hilo, na sentensi zilizo karibu nalo.', 'Jaribu kila maana mahali pa neno. Ipi inafaa?') }) }),
  ...trio('msamiati.tumia', C_MSA, MSA_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'b', 'b'], tag: 'tumia', topic: 'kuhusu msamiati', hints: H('Fikiria maana ya kila neno kabla ya kuchagua.', 'Neno linaloonekana kama jingine si lazima liwe na maana sawa nalo.') }),
  // ---- UFAHAMU WA HADITHI
  kw({ id: 'kiswahili4.hadithi.nani', cs: C_UFA, oc: 'c', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu aliyefanya kitendo.', 'Jibu liko kwenye kifungu.') }) }),
  kw({ id: 'kiswahili4.hadithi.nini', cs: C_UFA, oc: 'c', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu. Tafuta sentensi inayojibu swali.', 'Hakikisha jibu linalingana na kinachoulizwa, si neno moja tu la swali.') }) }),
  kw({ id: 'kiswahili4.hadithi.andika', cs: C_UFA, oc: 'c', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili4.hadithi.nani.andika', cs: C_UFA, oc: 'c', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu huyo.', 'Andika jina au cheo tu.') }) }),
  kw({ id: 'kiswahili4.hadithi.ujumbe', cs: C_UFA, oc: 'c', kind: 'choose-main', form: 'word', rung: 2, gen: passChoose('main', { kind: 'hadithi', hints: H('Ujumbe mkuu ni funzo la hadithi nzima.', 'Jambo moja dogo ndani ya hadithi si ujumbe mkuu.') }) }),
  kw({ id: 'kiswahili4.hadithi.mpangilio', cs: C_UFA, oc: 'c', kind: 'order-events', form: 'steps', rung: 2, gen: orderGen }),
  // ---- MAKALA
  kw({ id: 'kiswahili4.makala.nini', cs: C_MAK, oc: 'a', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'makala', label: 'Soma makala. Kisha chagua jibu sahihi.', hints: H('Jibu limeandikwa kwenye makala. Tafuta sentensi inayojibu swali.', 'Usijibu kwa unachojua: tafuta kwenye makala.') }) }),
  kw({ id: 'kiswahili4.makala.andika', cs: C_MAK, oc: 'a', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'makala', label: 'Soma makala. Kisha andika jibu fupi.', hints: H('Jibu limeandikwa kwenye makala.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili4.makala.ujumbe', cs: C_MAK, oc: 'b', kind: 'choose-main', form: 'word', rung: 2, gen: passChoose('main', { kind: 'makala', label: 'Soma makala. Kisha chagua jibu sahihi.', hints: H('Ujumbe mkuu unatokana na makala nzima.', 'Sentensi moja au kitu kimoja kidogo si ujumbe mkuu.') }) }),
  // ---- IGIZO
  kw({ id: 'kiswahili4.igizo.tambua', cs: C_IGI, oc: 'b', kind: 'choose-form', form: 'direct', rung: 1, gen: (cskill) => {
    const FORMS = [
      ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Juma: Hujambo, mzee?', ['Juma aliingia dukani na kusalimia.', 'M4_IGI_STORY'], ['Mzee alimjibu kwa upole.', 'M4_IGI_STORY'], ['Duka lilikuwa na watu wengi.', 'M4_IGI_STORY'], 'Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.'],
      ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Neema: Nipe mkate mmoja, tafadhali.', ['Neema aliomba mkate mmoja.', 'M4_IGI_STORY'], ['Neema alikuwa na njaa.', 'M4_IGI_STORY'], ['Mkate ulikuwa mtamu.', 'M4_IGI_STORY'], 'Mstari wa igizo huanza na jina la mhusika na nukta mbili.'],
      ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Mama: Njoo hapa haraka.', ['Mama alimwita mtoto wake.', 'M4_IGI_STORY'], ['Mama alikuwa jikoni.', 'M4_IGI_STORY'], ['Mtoto alikimbia kwa mama.', 'M4_IGI_STORY'], 'Maneno ya mhusika katika igizo yameandikwa baada ya jina lake.'],
      ['Ni kipi kati ya hivi kinatoka kwenye hadithi, si igizo?', 'Achieng alienda sokoni asubuhi.', ['Achieng: Naenda sokoni.', 'M4_IGI_STORY'], ['Mjomba: Twende pamoja.', 'M4_IGI_STORY'], ['Bibi: Njoo, mjukuu wangu.', 'M4_IGI_STORY'], 'Hadithi huelezwa na msimulizi. Igizo huwa na majina ya wahusika na nukta mbili.'],
      ['Ni kipi kati ya hivi kinatoka kwenye hadithi, si igizo?', 'Baraka aliweka ndoo uani.', ['Baraka: Weka ndoo uani.', 'M4_IGI_STORY'], ['Neema: Mvua inaanza!', 'M4_IGI_STORY'], ['Mwalimu: Tazameni mawingu.', 'M4_IGI_STORY'], 'Hadithi huelezwa na msimulizi bila majina na nukta mbili.'],
    ];
    const it = pick(FORMS.map(x => ({ q: x[0], right: x[1], wrongs: x.slice(2, -1), because: x[x.length - 1] })));
    const options = optionsOf(cskill, it.wrongs, it.right);
    return options && { question: it.q, options, instruction: 'Chagua jibu sahihi.', hints: H('Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.', 'Hadithi huelezwa na msimulizi bila majina na nukta mbili.'), steps: [it.because, `Jibu ni "${it.right}".`] };
  } }),
  kw({ id: 'kiswahili4.igizo.maelekezo', cs: C_IGI, oc: 'c', kind: 'choose-direction', form: 'word', rung: 2, gen: passChoose('dir', { kind: 'igizo', label: 'Soma igizo. Kisha chagua jibu sahihi.', hints: H('Maelekezo ya jukwaani yako kwenye mabano.', 'Mabano yanamwonyesha muigizaji afanye nini, si aseme nini.') }) }),
  kw({ id: 'kiswahili4.igizo.nani', cs: C_IGI, oc: 'c', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'igizo', label: 'Soma igizo. Kisha chagua jibu sahihi.', hints: H('Tafuta mstari huo na usome jina lililo mbele ya nukta mbili.', 'Jina hilo ni la mtu anayesema.') }) }),
  kw({ id: 'kiswahili4.igizo.nani.andika', cs: C_IGI, oc: 'c', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'igizo', label: 'Soma igizo. Kisha andika jibu fupi.', hints: H('Tafuta mstari huo kwenye igizo.', 'Andika jina la mhusika tu.') }) }),
  kw({ id: 'kiswahili4.igizo.nini', cs: C_IGI, oc: 'c', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'igizo', label: 'Soma igizo. Kisha chagua jibu sahihi.', hints: H('Jibu liko kwenye igizo. Tafuta mstari unaolitaja.', 'Soma tena mstari huo.') }) }),
  kw({ id: 'kiswahili4.igizo.andika', cs: C_IGI, oc: 'c', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'igizo', label: 'Soma igizo. Kisha andika jibu fupi.', hints: H('Jibu liko kwenye igizo.', 'Andika jibu fupi tu.') }) }),
  // ---- SHAIRI: ubeti, mshororo, umbo
  ...trio('shairi.maana', C_SHA, SHA_DEF, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], topic: 'kuhusu shairi', hints: H('Fikiria maandishi haya yanavyopangwa ukurasani.', 'Mstari mmoja na kundi la mistari vina majina tofauti.') }),
  ...one('shairi.umbo', C_SHA, SHA_UMBO, { stem: 'Chagua jibu sahihi.', oc: 'd', tag: 'umbo', rung: 1, hints: H('Fikiria shairi linavyoonekana ukurasani.', 'Aya ndefu si shairi.') }),
  kw({ id: 'kiswahili4.shairi.hesabu', cs: C_SHA, oc: 'c', kind: 'choose-count', form: 'word', rung: 2, gen: passChoose('count', { kind: 'shairi', label: 'Soma shairi. Kisha chagua jibu sahihi.', hints: H('Beti zimetenganishwa kwa nafasi tupu. Mshororo ni mstari mmoja.', 'Hesabu kwa makini, mmoja mmoja.') }) }),
  kw({ id: 'kiswahili4.shairi.hesabu.andika', cs: C_SHA, oc: 'c', kind: 'type-count', form: 'word', rung: 2, gen: passType('count', { kind: 'shairi', label: 'Soma shairi. Kisha andika nambari.', hints: H('Beti zimetenganishwa kwa nafasi tupu. Mshororo ni mstari mmoja.', 'Hesabu kwa makini, mmoja mmoja.') }) }),
  kw({ id: 'kiswahili4.shairi.mshororo', cs: C_SHA, oc: 'c', kind: 'choose-line', form: 'word', rung: 3, gen: passChoose('line', { kind: 'shairi', label: 'Soma shairi. Kisha chagua jibu sahihi.', hints: H('Tafuta ubeti unaotajwa, kisha mshororo unaotajwa ndani yake.', 'Hesabu mishororo kuanzia juu ya ubeti huo.') }) }),
  // ---- KAMUSI
  ...trio('kamusi', C_KAM, KAMUSI, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['b', 'b', 'b'], thinOk: true, topic: 'kuhusu mpangilio wa maneno kwenye kamusi', hints: H('Kamusi hupanga maneno kwa mpangilio wa alfabeti.', 'Herufi za kwanza zikifanana, tazama herufi ya pili, kisha ya tatu.') }),
  ...trio('kamusi.matumizi', C_KAM, KAMUSI_USE, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], tag: 'matumizi', thinOk: true, topic: 'kuhusu kamusi', hints: H('Fikiria kitabu unachotumia kutafuta neno usilolijua.', 'Maneno hupangwa kwa utaratibu maalum.') }),
  // ---- KUSOMA KWA UFASAHA (what a fluent reader does; the reading aloud itself is for the teacher)
  ...one('ufasaha.tambua', C_UFS, UFS, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Alama za uakifishi zinaonyesha mahali pa kupumzika.') }),
  ...duo('ufasaha.sentensi', C_UFS, UFS_S, { stem: 'Chagua sentensi sahihi kuhusu kusoma kwa ufasaha.', oc: ['a', 'a'], tag: 'sentensi', topic: 'kuhusu kusoma kwa ufasaha', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Kasi ifaayo na sauti ipasavyo si ya kupindukia.') }),
  // ---- USALAMA WA KIDIJITALI
  ...one('usalama.hali', C_DIG, DIG_SIT, { stem: 'Chagua hatua ya kiusalama.', oc: 'b', tag: 'hali', rung: 2, hints: H('Nenosiri na maelezo yako binafsi ni siri.', 'Mwonyeshe mtu mzima kabla ya kufungua kitu usichokijua.') }),
  ...duo('usalama.sentensi', C_DIG, DIG_STATEMENT, { stem: 'Chagua sentensi inayoonyesha hatua ya kiusalama.', oc: ['b', 'b'], tag: 'sentensi', topic: 'kuhusu usalama wa kidijitali', hints: H('Hatua salama hulinda nenosiri na maelezo yako.', 'Hatua isiyo salama humpa mtu usiyemjua nafasi ya kuingia kwenye akaunti yako.') }),
];
