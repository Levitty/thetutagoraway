// ============================================================================
// KISWAHILI GRADE 5, FASIHI SIMULIZI NA LUGHA: methali, nahau, visawe, tashbihi, vitendawili, maneno ya heshima.
// DRAFT families, all off for children. Written offline by Claude (12 Nov 2026), no model call.
// These skills sit under outcomes the design files as oral (Kusikiliza na Kuzungumza). A question can test only the
// recognition and the meaning (the first two outcomes of each sub-strand); saying, setting and using them in speech
// stays with the teacher (docs/qa/kiswahili-g5-review-2026-11-12.md, "Not testable by a question").
// A native Kiswahili speaker must check every item, and above all the meanings of the methali and nahau and the
// riddles and their answers: docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- methali za bidii
const METHALI_END = [
  ['Haba na haba hujaza ___.', 'kibaba', ['chupa', 'M_MET_WRONG_END'], ['kikapu', 'M_MET_WRONG_END'], ['mfuko', 'M_MET_WRONG_END'], 'Methali ni "Haba na haba hujaza kibaba": vitu vidogo vikiongezwa polepole hujaza.'],
  ['Mchumia juani hulia ___.', 'kivulini', ['jikoni', 'M_MET_WRONG_END'], ['nyumbani', 'M_MET_WRONG_END'], ['shambani', 'M_MET_WRONG_END'], 'Methali ni "Mchumia juani hulia kivulini": anayefanya kazi kwa bidii hufurahia matunda yake.'],
  ['Mtaka cha mvunguni sharti ___.', 'ainame', ['aombe', 'M_MET_WRONG_END'], ['alale', 'M_MET_WRONG_END'], ['akimbie', 'M_MET_WRONG_END'], 'Methali ni "Mtaka cha mvunguni sharti ainame": anayetaka kitu lazima afanye juhudi.'],
  ['Bandu bandu huisha ___.', 'gogo', ['mti', 'M_MET_WRONG_END'], ['kuni', 'M_MET_WRONG_END'], ['mbao', 'M_MET_WRONG_END'], 'Methali ni "Bandu bandu huisha gogo": kazi ngumu humalizika kwa kuendelea kidogo kidogo.'],
  ['Penye nia pana ___.', 'njia', ['barabara', 'M_MET_WRONG_END'], ['mlango', 'M_MET_WRONG_END'], ['nyumba', 'M_MET_WRONG_END'], 'Methali ni "Penye nia pana njia": mwenye nia ya kweli hupata njia ya kufanikiwa.'],
  ['Mvumilivu hula ___.', 'mbivu', ['mbichi', 'M_MET_WRONG_END'], ['chakula', 'M_MET_WRONG_END'], ['maembe', 'M_MET_WRONG_END'], 'Methali ni "Mvumilivu hula mbivu": mtu mvumilivu hupata mema mwishowe.'],
];
const METHALI_MEANING = [
  ['Haba na haba hujaza kibaba. Maana yake ni nini?', 'Vitu vidogo vikiongezwa polepole huwa vingi', ['Umoja ni nguvu', 'M_MET_WRONG_LESSON'], ['Kibaba ni chombo cha kupimia unga', 'M_MET_LITERAL'], ['Anayekaa pekee hupata kidogo', 'M_MET_WRONG_LESSON'], 'Methali hii inafundisha kwamba kidogo kidogo hujaza: tukiweka akiba au tukifanya kazi kila siku, tunafika mbali.'],
  ['Mchumia juani hulia kivulini. Maana yake ni nini?', 'Anayefanya kazi kwa bidii atafurahia matunda yake baadaye', ['Anayekaa juani hulia', 'M_MET_LITERAL'], ['Kazi nyingi huchosha mwili', 'M_MET_WRONG_LESSON'], ['Kivuli ni kizuri kuliko jua', 'M_MET_LITERAL'], 'Anayechuma juani anafanya kazi ngumu; kivulini ni mahali pa kupumzika. Methali inafundisha kwamba bidii huleta raha baadaye.'],
  ['Mtaka cha mvunguni sharti ainame. Maana yake ni nini?', 'Anayetaka kitu lazima afanye juhudi', ['Kitu cha mvunguni ni kikubwa', 'M_MET_LITERAL'], ['Anayeinama huumwa na mgongo', 'M_MET_LITERAL'], ['Mvumilivu hula mbivu', 'M_MET_WRONG_LESSON'], 'Kitu kilicho mvunguni hakipatikani bila kuinama. Methali inafundisha kwamba tunahitaji juhudi ili tupate tunachotaka.'],
  ['Bandu bandu huisha gogo. Maana yake ni nini?', 'Kazi ngumu hukamilika kwa kuendelea kidogo kidogo', ['Gogo ni kuni kubwa', 'M_MET_LITERAL'], ['Kila kitu kina mwisho wake', 'M_MET_WRONG_LESSON'], ['Mtu asiyefanya kazi hushindwa', 'M_MET_WRONG_LESSON'], 'Kukata gogo kubwa kunaweza kuonekana kugumu, lakini ukilikata kipande kidogo kila siku litaisha. Methali inafundisha uvumilivu na bidii.'],
  ['Penye nia pana njia. Maana yake ni nini?', 'Mwenye nia ya kweli hupata njia ya kufanikiwa', ['Njia nzuri huwa na watu wengi', 'M_MET_LITERAL'], ['Umoja ni nguvu', 'M_MET_WRONG_LESSON'], ['Kila nia ni njia ya barabara', 'M_MET_LITERAL'], 'Nia ni kusudi la kufanya jambo. Methali inafundisha kwamba tukiamua kweli, tutapata njia ya kufanikiwa.'],
  ['Mvumilivu hula mbivu. Maana yake ni nini?', 'Mtu mvumilivu hupata mema mwishowe', ['Mbivu ni matunda matamu', 'M_MET_LITERAL'], ['Mtu anapaswa kufanya kazi haraka', 'M_MET_WRONG_LESSON'], ['Matunda mabichi ni mabaya', 'M_MET_LITERAL'], 'Anayesubiri matunda yaive hula mbivu. Methali inafundisha kwamba uvumilivu huleta mema.'],
];

// ---------------------------------------------------------------- nahau
const NAHAU_END = [
  ['Usikate ___ ukishindwa mara moja; jaribu tena.', 'tamaa', ['kamba', 'M_NAH_WRONG_WORD'], ['shingo', 'M_NAH_WRONG_WORD'], ['mkono', 'M_NAH_WRONG_WORD'], 'Nahau ni "kukata tamaa": kuacha kuwa na matumaini.'],
  ['Mgonjwa alipiga moyo ___ alipoambiwa atadungwa sindano.', 'konde', ['mbele', 'M_NAH_WRONG_WORD'], ['kali', 'M_NAH_WRONG_WORD'], ['nyuma', 'M_NAH_WRONG_WORD'], 'Nahau ni "kupiga moyo konde": kujipa ujasiri.'],
  ['Vichekesho vya msanii vilituvunja ___ jana.', 'mbavu', ['mifupa', 'M_NAH_WRONG_WORD'], ['mikono', 'M_NAH_WRONG_WORD'], ['meno', 'M_NAH_WRONG_WORD'], 'Nahau ni "kuvunja mbavu": kuchekesha sana.'],
  ['Mzee huyu amekula ___ nyingi; ana busara ya miaka mingi.', 'chumvi', ['sukari', 'M_NAH_WRONG_WORD'], ['pilipili', 'M_NAH_WRONG_WORD'], ['mafuta', 'M_NAH_WRONG_WORD'], 'Nahau ni "kula chumvi": kuwa na umri mkubwa na uzoefu.'],
  ['Walimu walitutaka tutie ___ maneno yao.', 'maanani', ['kichwani', 'M_NAH_WRONG_WORD'], ['mkononi', 'M_NAH_WRONG_WORD'], ['mguuni', 'M_NAH_WRONG_WORD'], 'Nahau ni "kutia maanani": kuzingatia jambo.'],
  ['Walifunga ___ yao ya kwenda Mombasa alfajiri.', 'safari', ['mlango', 'M_NAH_WRONG_WORD'], ['barabara', 'M_NAH_WRONG_WORD'], ['gari', 'M_NAH_WRONG_WORD'], 'Nahau ni "kufunga safari": kuanza safari.'],
];
const NAHAU_MEANING = [
  ['Nahau "kukata tamaa" maana yake ni nini?', 'kuacha kuwa na matumaini', ['kukata kamba ya tamaa', 'M_NAH_LITERAL'], ['kupata matumaini mapya', 'M_NAH_WRONG_MEANING'], ['kuwa na nia kubwa', 'M_NAH_WRONG_MEANING'], 'Hakuna kitu kinachokatwa kwa kisu. "Kukata tamaa" ni kuacha kuwa na matumaini.'],
  ['Nahau "kupiga moyo konde" maana yake ni nini?', 'kujipa ujasiri', ['kupiga moyo kwa fimbo', 'M_NAH_LITERAL'], ['kuogopa sana', 'M_NAH_WRONG_MEANING'], ['kupumzika', 'M_NAH_WRONG_MEANING'], 'Mtu anayepiga moyo konde anajipa ujasiri ili afanye jambo gumu.'],
  ['Nahau "kuvunja mbavu" maana yake ni nini?', 'kuchekesha sana', ['kuvunja mifupa ya kifua', 'M_NAH_LITERAL'], ['kuumiza mtu', 'M_NAH_WRONG_MEANING'], ['kulia sana', 'M_NAH_WRONG_MEANING'], 'Hakuna mfupa unaovunjika. Kitu kikikuvunja mbavu, kinakuchekesha sana.'],
  ['Nahau "kula chumvi" maana yake ni nini?', 'kuwa na umri mkubwa na uzoefu', ['kula chakula chenye chumvi nyingi', 'M_NAH_LITERAL'], ['kuwa na njaa', 'M_NAH_WRONG_MEANING'], ['kupika vizuri', 'M_NAH_WRONG_MEANING'], 'Aliyekula chumvi nyingi ameishi miaka mingi na ana uzoefu.'],
  ['Nahau "kutia maanani" maana yake ni nini?', 'kuzingatia jambo', ['kutia kitu mkononi', 'M_NAH_LITERAL'], ['kusahau jambo', 'M_NAH_WRONG_MEANING'], ['kupuuza jambo', 'M_NAH_WRONG_MEANING'], 'Kutia maanani ni kufikiria na kuzingatia jambo kwa makini.'],
  ['Nahau "kufunga safari" maana yake ni nini?', 'kuanza safari', ['kufunga mlango wa safari', 'M_NAH_LITERAL'], ['kumaliza safari', 'M_NAH_WRONG_MEANING'], ['kukataa kusafiri', 'M_NAH_WRONG_MEANING'], 'Kufunga safari ni kujiandaa na kuondoka kuanza safari.'],
];

// ---------------------------------------------------------------- visawe
const VISAWE = [
  ['Kisawe cha "furaha" ni ___.', 'bashasha|shangwe|raha', ['huzuni', 'M_VIS_OPPOSITE'], ['kicheko', 'M_VIS_RELATED'], ['farasi', 'M_VIS_LOOKALIKE'], 'Furaha na bashasha zina maana sawa. Huzuni ni kinyume cha furaha.'],
  ['Kisawe cha "rafiki" ni ___.', 'sahibu|swahiba|mwandani', ['adui', 'M_VIS_OPPOSITE'], ['jirani', 'M_VIS_RELATED'], ['rafu', 'M_VIS_LOOKALIKE'], 'Rafiki na sahibu zina maana sawa. Adui ni kinyume cha rafiki.'],
  ['Kisawe cha "haraka" ni ___.', 'upesi|kasi', ['polepole', 'M_VIS_OPPOSITE'], ['safari', 'M_VIS_RELATED'], ['harufu', 'M_VIS_LOOKALIKE'], 'Haraka na upesi zina maana sawa. Polepole ni kinyume chake.'],
  ['Kisawe cha "huzuni" ni ___.', 'simanzi|majonzi', ['furaha', 'M_VIS_OPPOSITE'], ['kilio', 'M_VIS_RELATED'], ['simu', 'M_VIS_LOOKALIKE'], 'Huzuni na simanzi zina maana sawa. Furaha ni kinyume cha huzuni.'],
  ['Kisawe cha "shule" ni ___.', 'skuli', ['chuo', 'M_VIS_RELATED'], ['shuka', 'M_VIS_LOOKALIKE'], ['darasa', 'M_VIS_RELATED'], 'Shule na skuli ni maneno mawili ya kitu kimoja. Chuo na darasa ni vitu vinavyohusiana tu.'],
  ['Kisawe cha "kuogopa" ni ___.', 'kuhofu|kutishika', ['kuthubutu', 'M_VIS_OPPOSITE'], ['kukimbia', 'M_VIS_RELATED'], ['kuoga', 'M_VIS_LOOKALIKE'], 'Kuogopa na kuhofu zina maana sawa. Kuthubutu ni kinyume chake.'],
  ['Kisawe cha "kutazama" ni ___.', 'kuangalia', ['kufumba', 'M_VIS_OPPOSITE'], ['kusikia', 'M_VIS_RELATED'], ['kutamba', 'M_VIS_LOOKALIKE'], 'Kutazama na kuangalia zina maana sawa.'],
];

// ---------------------------------------------------------------- tashbihi za tabia
const TASH = [
  ['Baba yetu ni mkali kama ___.', 'simba', ['sungura', 'M_TASH_WRONG_ANIMAL'], ['kondoo', 'M_TASH_WRONG_ANIMAL'], ['kobe', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "mkali kama simba" kwa mtu mkali sana.'],
  ['Mtoto huyo ni mwoga kama ___.', 'sungura', ['simba', 'M_TASH_WRONG_ANIMAL'], ['ndovu', 'M_TASH_WRONG_ANIMAL'], ['chui', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "mwoga kama sungura" kwa mtu mwenye hofu nyingi.'],
  ['Bibi yetu ni mpole kama ___.', 'kondoo', ['simba', 'M_TASH_WRONG_ANIMAL'], ['chui', 'M_TASH_WRONG_ANIMAL'], ['nyoka', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "mpole kama kondoo" kwa mtu mpole sana.'],
  ['Mwanariadha huyu ni mwepesi kama ___.', 'swala', ['kobe', 'M_TASH_WRONG_ANIMAL'], ['ndovu', 'M_TASH_WRONG_ANIMAL'], ['kiboko', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "mwepesi kama swala" kwa mtu anayekimbia kwa kasi.'],
  ['Mjomba wetu ni mchapakazi kama ___.', 'sisimizi', ['konokono', 'M_TASH_WRONG_ANIMAL'], ['kiboko', 'M_TASH_WRONG_ANIMAL'], ['bundi', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "mchapakazi kama sisimizi" kwa mtu anayefanya kazi kwa bidii.'],
  ['Mkulima huyo ana nguvu kama ___.', 'ndovu', ['sungura', 'M_TASH_WRONG_ANIMAL'], ['kondoo', 'M_TASH_WRONG_ANIMAL'], ['konokono', 'M_TASH_WRONG_ANIMAL'], 'Tunasema "ana nguvu kama ndovu" kwa mtu mwenye nguvu nyingi.'],
];
const TASH_ID = [
  ['Ni tashbihi ipi?', 'Yeye ni mkali kama simba', ['Yeye ni simba', 'M_TASH_NO_KAMA'], ['Yeye ni mkali sana', 'M_TASH_NO_KAMA'], ['Simba alikula nyama', 'M_TASH_NO_KAMA'], 'Tashbihi hutumia kama au mithili ya kulinganisha: mkali kama simba.'],
  ['Ni tashbihi ipi?', 'Mtoto yule ni mwoga kama sungura', ['Mtoto yule ni sungura', 'M_TASH_NO_KAMA'], ['Mtoto yule anaogopa giza', 'M_TASH_NO_KAMA'], ['Sungura anakula karoti', 'M_TASH_NO_KAMA'], 'Tashbihi ina neno kama: mwoga kama sungura.'],
  ['"Juma ni mwoga kama sungura" maana yake nini?', 'Juma ana hofu nyingi', ['Juma ni sungura', 'M_TASH_LITERAL'], ['Juma anapenda karoti', 'M_TASH_LITERAL'], ['Juma anaruka sana', 'M_TASH_LITERAL'], 'Tashbihi inaelezea tabia kwa kulinganisha. Mwoga kama sungura ni mtu mwenye hofu nyingi.'],
  ['"Bibi ni mpole kama kondoo" maana yake nini?', 'Bibi ni mpole sana', ['Bibi ni kondoo', 'M_TASH_LITERAL'], ['Bibi ana pamba', 'M_TASH_LITERAL'], ['Bibi hula nyasi', 'M_TASH_LITERAL'], 'Tashbihi inaelezea tabia: mpole kama kondoo ni mpole sana.'],
  ['Ni tashbihi ipi?', 'Mwanariadha ni mwepesi kama swala', ['Mwanariadha ni swala', 'M_TASH_NO_KAMA'], ['Mwanariadha anakimbia sana', 'M_TASH_NO_KAMA'], ['Swala hukimbia porini', 'M_TASH_NO_KAMA'], 'Tashbihi ina kama: mwepesi kama swala.'],
];

// ---------------------------------------------------------------- vitendawili
const VIT_ID = [
  ['Ni kipi kati ya hivi ni kitendawili?', 'Nyumba yangu haina mlango', ['Haba na haba hujaza kibaba', 'M_VIT_METHALI'], ['Kukata tamaa', 'M_VIT_NAHAU'], ['Yai ni chakula kizuri', 'M_VIT_PLAIN'], 'Kitendawili huficha jibu na humtaka mtu kukitegua: ni nini isiyo na mlango? (Jibu ni yai.)'],
  ['Ni kipi kati ya hivi ni kitendawili?', 'Popote niendapo hunifuata', ['Mchumia juani hulia kivulini', 'M_VIT_METHALI'], ['Kula chumvi', 'M_VIT_NAHAU'], ['Kivuli kinaonekana jua likiwaka', 'M_VIT_PLAIN'], 'Kitendawili hakitaji kitu wazi: ni nini kinachomfuata mtu popote aendapo? (Jibu ni kivuli.)'],
  ['Ni kipi kati ya hivi ni kitendawili?', 'Nina meno mengi lakini siumi', ['Penye nia pana njia', 'M_VIT_METHALI'], ['Kuvunja mbavu', 'M_VIT_NAHAU'], ['Kitana kinapangusa nywele', 'M_VIT_PLAIN'], 'Kitendawili huficha kitu kwa fumbo: ni nini chenye meno mengi lakini hakiumi? (Jibu ni kitana.)'],
  ['Ni kipi kati ya hivi ni kitendawili?', 'Nina jicho moja lakini siwezi kuona', ['Bandu bandu huisha gogo', 'M_VIT_METHALI'], ['Kupiga moyo konde', 'M_VIT_NAHAU'], ['Sindano hutumika kushonea', 'M_VIT_PLAIN'], 'Kitendawili hukuacha ukisema "ni nini?". (Jibu ni sindano.)'],
  ['Ni kipi kati ya hivi ni kitendawili?', 'Nje ni ganda gumu, ndani kuna maji meupe na ya manjano', ['Mvumilivu hula mbivu', 'M_VIT_METHALI'], ['Kutia maanani', 'M_VIT_NAHAU'], ['Mayai huuzwa sokoni', 'M_VIT_PLAIN'], 'Kitendawili hukielezea kitu bila kukitaja jina: ni nini? (Jibu ni yai.)'],
  ['Ni kipi kati ya hivi ni kitendawili?', 'Hunifuata jua likiwaka na hupotea gizani', ['Haba na haba hujaza kibaba', 'M_VIT_METHALI'], ['Kufunga safari', 'M_VIT_NAHAU'], ['Jua huwaka mchana', 'M_VIT_PLAIN'], 'Kitendawili hukielezea kitu bila kukitaja jina: ni nini? (Jibu ni kivuli.)'],
];
const VIT_ANS = [
  ['Kitendawili: "Nyumba yangu haina mlango." Jibu ni ___.', 'yai', ['nyumba', 'M_VIT_WRONG_ANSWER'], ['mlango', 'M_VIT_WRONG_ANSWER'], ['kuku', 'M_VIT_WRONG_ANSWER'], 'Yai lina ganda lakini halina mlango.'],
  ['Kitendawili: "Popote niendapo hunifuata." Jibu ni ___.', 'kivuli', ['mbwa', 'M_VIT_WRONG_ANSWER'], ['mtoto', 'M_VIT_WRONG_ANSWER'], ['upepo', 'M_VIT_WRONG_ANSWER'], 'Kivuli humfuata mtu popote aendapo jua likiwaka.'],
  ['Kitendawili: "Nina meno mengi lakini siumi." Jibu ni ___.', 'kitana', ['mbwa', 'M_VIT_WRONG_ANSWER'], ['kitabu', 'M_VIT_WRONG_ANSWER'], ['kikapu', 'M_VIT_WRONG_ANSWER'], 'Kitana kina meno mengi lakini hakiumi.'],
  ['Kitendawili: "Nina jicho moja lakini siwezi kuona." Jibu ni ___.', 'sindano', ['taa', 'M_VIT_WRONG_ANSWER'], ['kioo', 'M_VIT_WRONG_ANSWER'], ['jua', 'M_VIT_WRONG_ANSWER'], 'Sindano ina tundu la kuingiza uzi, linaloitwa jicho, lakini haioni.'],
  ['Kitendawili: "Nje ni ganda gumu, ndani kuna maji meupe na ya manjano." Jibu ni ___.', 'yai', ['nazi', 'M_VIT_WRONG_ANSWER'], ['kokwa', 'M_VIT_WRONG_ANSWER'], ['chungwa', 'M_VIT_WRONG_ANSWER'], 'Yai lina ganda gumu, na ndani kuna sehemu nyeupe na ya manjano.'],
  ['Kitendawili: "Hunifuata jua likiwaka na hupotea gizani." Jibu ni ___.', 'kivuli', ['mbwa', 'M_VIT_WRONG_ANSWER'], ['kioo', 'M_VIT_WRONG_ANSWER'], ['mwezi', 'M_VIT_WRONG_ANSWER'], 'Kivuli huonekana jua likiwaka na hupotea gizani.'],
];

// ---------------------------------------------------------------- maneno ya heshima ya udugu
const HES = [
  ['Dada ya baba yako anaitwa ___.', 'shangazi', ['mjomba', 'M_HES_SIDE'], ['binamu', 'M_HES_COUSIN'], ['mama mdogo', 'M_HES_SIDE'], 'Dada ya baba ni shangazi. Mjomba ni kaka wa mama.'],
  ['Kaka wa mama yako anaitwa ___.', 'mjomba', ['shangazi', 'M_HES_SIDE'], ['binamu', 'M_HES_COUSIN'], ['baba mkubwa', 'M_HES_SIDE'], 'Kaka wa mama ni mjomba. Shangazi ni dada ya baba.'],
  ['Mtoto wa shangazi yako anaitwa ___.', 'binamu', ['kaka', 'M_HES_COUSIN'], ['dada', 'M_HES_COUSIN'], ['mjomba', 'M_HES_SIDE'], 'Mtoto wa shangazi au mjomba ni binamu.'],
  ['Mtoto humsalimia babu kwa kusema ___.', 'shikamoo', ['marahaba', 'M_HES_GREETING'], ['hujambo', 'M_HES_GREETING'], ['kwaheri', 'M_HES_GREETING'], 'Mdogo humsalimia mkubwa kwa "shikamoo".'],
  ['Mtoto akisema "shikamoo", babu hujibu ___.', 'marahaba', ['shikamoo', 'M_HES_GREETING'], ['hujambo', 'M_HES_GREETING'], ['asante', 'M_HES_GREETING'], 'Mkubwa hujibu "shikamoo" kwa "marahaba".'],
  ['Mama wa baba yako anaitwa ___.', 'bibi', ['shangazi', 'M_HES_SIDE'], ['mama mkubwa', 'M_HES_SIDE'], ['binamu', 'M_HES_COUSIN'], 'Mama wa baba (na wa mama) ni bibi.'],
  ['Baba wa baba yako anaitwa ___.', 'babu', ['mjomba', 'M_HES_SIDE'], ['baba mkubwa', 'M_HES_SIDE'], ['binamu', 'M_HES_COUSIN'], 'Baba wa baba (na wa mama) ni babu.'],
];

export const FAMILIES = [
  // ---- METHALI
  ...trio('methali.kamilisha', 'KUSIKI.T5_METHALI.METHALI', METHALI_END, { stem: 'Chagua neno linalokamilisha methali.', gapStem: 'Andika neno linalokamilisha methali:', oc: ['a', 'a', 'a'], topic: 'kuhusu methali za bidii', hints: H('Sema methali yote tangu mwanzo.', 'Methali haibadiliki: kila neno liko mahali pake.') }),
  ...one('methali.maana', 'KUSIKI.T5_METHALI.METHALI', METHALI_MEANING, { stem: 'Chagua maana sahihi.', oc: 'b', tag: 'maana', rung: 2, hints: H('Methali ina maana ya pili, si maneno yake peke yake.', 'Jiulize methali inafundisha nini kuhusu maisha.') }),
  // ---- NAHAU
  ...trio('nahau.kamilisha', 'KUSIKI.T7_NAHAU.NAHAU', NAHAU_END, { stem: 'Chagua neno linalokamilisha nahau.', gapStem: 'Andika neno linalokamilisha nahau:', oc: ['a', 'a', 'a'], topic: 'kuhusu nahau', hints: H('Nahau haibadiliki: sema nahau yote.', 'Soma sentensi nzima kabla ya kuchagua.') }),
  ...one('nahau.maana', 'KUSIKI.T7_NAHAU.NAHAU', NAHAU_MEANING, { stem: 'Chagua maana sahihi.', oc: 'b', tag: 'maana', rung: 2, hints: H('Nahau ina maana tofauti na maneno yake.', 'Jiulize: je, kitu hicho kinatendeka kweli?') }),
  // ---- VISAWE
  ...trio('visawe', 'KUSIKI.T8_VISAWE.VISAWE', VISAWE, { stem: 'Chagua kisawe sahihi.', gapStem: 'Andika kisawe kinachokosekana:', oc: ['a', 'a', 'a'], topic: 'kuhusu visawe', hints: H('Kisawe ni neno lenye maana sawa na jingine.', 'Kinyume na neno linalohusiana si visawe.') }),
  // ---- TASHBIHI
  ...trio('tashbihi.kamilisha', 'KUSIKI.T10_TASHBIHI.TASHBIHI', TASH, { stem: 'Chagua neno linalokamilisha tashbihi.', gapStem: 'Andika neno linalokamilisha tashbihi:', oc: ['b', 'b', 'b'], topic: 'kuhusu tashbihi', hints: H('Tashbihi hulinganisha tabia na mnyama kwa neno kama.', 'Fikiria mnyama anayejulikana kwa tabia hiyo.') }),
  ...one('tashbihi.tambua', 'KUSIKI.T10_TASHBIHI.TASHBIHI', TASH_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', hints: H('Tashbihi ina neno kama au mithili ya.', 'Tashbihi inaelezea tabia kwa kulinganisha, si kusema mtu ni mnyama.') }),
  // ---- VITENDAWILI
  ...one('vitendawili.tambua', 'KUSIKI.T3_VITENDAWILI.VITENDAWILI', VIT_ID, { stem: 'Chagua kitendawili.', oc: 'a', tag: 'tambua', hints: H('Kitendawili huficha jibu na huuliza "ni nini?".', 'Methali hufundisha, na nahau zina maana maalum, lakini hazina jibu la kutegua.') }),
  ...trio('vitendawili.jibu', 'KUSIKI.T3_VITENDAWILI.VITENDAWILI', VIT_ANS, { stem: 'Chagua jibu la kitendawili.', gapStem: 'Andika jibu la kitendawili:', oc: ['a', 'a', 'a'], tag: 'jibu', topic: 'kuhusu vitendawili na majibu yake', hints: H('Jibu lazima lilingane na kila sehemu ya kitendawili.', 'Jaribu kila jibu dhidi ya maneno yote ya kitendawili.') }),
  // ---- MANENO YA HESHIMA
  ...trio('heshima', 'KUSIKI.T4_MANENO_YA_HESHIMA_NA.HESHIMA', HES, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], topic: 'kuhusu maneno ya heshima ya udugu', hints: H('Ndugu wa baba na ndugu wa mama wana majina tofauti.', 'Mdogo hutangulia kusalimia mkubwa, na mkubwa hujibu.') }),
];
