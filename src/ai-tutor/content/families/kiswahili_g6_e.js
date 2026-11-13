// ============================================================================
// KISWAHILI GRADE 6, KUSIKILIZA NA KUZUNGUMZA: the parts a question can test (recognition and meaning) of maamkuzi na maagano,
// maneno ya heshima, vitendawili, methali za umoja na ushirikiano, nahau za kazi na ushirikiano, visawe, sitiari za tabia,
// lugha rasmi na isiyo rasmi. DRAFT families, all off for children. Written offline by Claude (13 Nov 2026), no model call.
// Speaking, reciting and using these in talk stays with the teacher (see the non-question outcomes note).
// Claude could not read the design's own lists of methali and nahau: a native speaker must replace or confirm every one.
// ============================================================================
import { trio, duo, one } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];

const MAAM = [
  ['Unamsalimia mtu mmoja mnayekutana mchana: "___!"', 'Hujambo', ['Hamjambo', 'M_MAA_NUMBER'], ['Kwaheri', 'M_MAA_FAREWELL'], ['Lala salama', 'M_MAA_TIME'], 'Kwa mtu mmoja tunasema Hujambo. Hamjambo ni ya watu wengi.'],
  ['Unawasalimia wanafunzi wengi darasani: "___!"', 'Hamjambo', ['Hujambo', 'M_MAA_NUMBER'], ['Kwa herini', 'M_MAA_FAREWELL'], ['Lala salama', 'M_MAA_TIME'], 'Kwa watu wengi tunasema Hamjambo.'],
  ['Unaondoka na kumwaga mtu mmoja: "___!"', 'Kwaheri', ['Kwa herini', 'M_MAA_NUMBER'], ['Hujambo', 'M_MAA_FAREWELL'], ['Karibu', 'M_MAA_FAREWELL'], 'Kuaga mtu mmoja ni Kwaheri. Kwa herini ni ya watu wengi.'],
  ['Unaondoka na kuwaaga watu wengi: "___!"', 'Kwa herini', ['Kwaheri', 'M_MAA_NUMBER'], ['Hamjambo', 'M_MAA_FAREWELL'], ['Karibuni', 'M_MAA_FAREWELL'], 'Kuwaaga watu wengi ni Kwa herini.'],
  ['Usiku, kabla ya kulala, unamwambia mama: "___, mama."', 'Lala salama', ['Habari za asubuhi', 'M_MAA_TIME'], ['Hamjambo', 'M_MAA_NUMBER'], ['Karibu', 'M_MAA_FAREWELL'], 'Usiku tunaagana kwa Lala salama au Usiku mwema.'],
  ['Asubuhi unamwamkia mwalimu: "___, mwalimu."', 'Habari za asubuhi', ['Lala salama', 'M_MAA_TIME'], ['Kwaheri', 'M_MAA_FAREWELL'], ['Usiku mwema', 'M_MAA_TIME'], 'Asubuhi tunasalimia kwa Habari za asubuhi.'],
  ['Mdogo anamwambia mzee "Shikamoo". Mzee anajibu: "___."', 'Marahaba', ['Shikamoo', 'M_MAA_REPLY'], ['Kwaheri', 'M_MAA_FAREWELL'], ['Hamjambo', 'M_MAA_NUMBER'], 'Jibu la Shikamoo ni Marahaba.'],
];

const HESH = [
  ['Ukimwomba mwalimu kalamu unasema, "Mwalimu, nipe kalamu, ___."', 'tafadhali', ['asante', 'M_HESH_MISUSE'], ['pole', 'M_HESH_MISUSE'], ['kwaheri', 'M_HESH_MISUSE'], 'Tafadhali hutumika tunapoomba kitu kwa heshima.'],
  ['Mtu akikupa zawadi unamwambia ___.', 'asante', ['pole', 'M_HESH_MISUSE'], ['tafadhali', 'M_HESH_MISUSE'], ['karibu', 'M_HESH_MISUSE'], 'Asante hutumika kushukuru.'],
  ['Mwenzako akijikwaa na kuanguka, unamwambia ___.', 'pole', ['asante', 'M_HESH_MISUSE'], ['karibu', 'M_HESH_MISUSE'], ['hongera', 'M_HESH_MISUSE'], 'Pole hutumika kumfariji aliyepata shida.'],
  ['Umemkanyaga mtu kwa bahati mbaya. Unasema ___.', 'samahani', ['asante', 'M_HESH_MISUSE'], ['hongera', 'M_HESH_MISUSE'], ['karibu', 'M_HESH_MISUSE'], 'Samahani hutumika kuomba msamaha.'],
  ['Mgeni anapofika nyumbani kwenu, unamwambia ___.', 'karibu', ['kwaheri', 'M_HESH_MISUSE'], ['samahani', 'M_HESH_MISUSE'], ['pole', 'M_HESH_MISUSE'], 'Karibu hutumika kumkaribisha mgeni.'],
  ['Unapomsalimia babu kwa heshima unasema "___, babu."', 'Shikamoo', ['Marahaba', 'M_HESH_MISUSE'], ['Kwaheri', 'M_HESH_MISUSE'], ['Samahani', 'M_HESH_MISUSE'], 'Shikamoo ni salamu ya heshima kwa mkubwa. Marahaba ni jibu lake.'],
];
const HESH_S = [
  ['Ni sentensi ipi ina heshima zaidi?', 'Tafadhali nisaidie kubeba mzigo huu.', ['Nisaidie kubeba mzigo huu!', 'M_HESH_RUDE'], ['Wewe, beba mzigo huu!', 'M_HESH_RUDE'], 'Tafadhali hufanya ombi kuwa la heshima.'],
  ['Ni sentensi ipi ina heshima zaidi?', 'Naomba unipe maji, tafadhali.', ['Nipe maji haraka!', 'M_HESH_RUDE'], ['Maji yako wapi?', 'M_HESH_RUDE'], 'Naomba na tafadhali hufanya ombi kuwa la heshima.'],
  ['Ni sentensi ipi ina heshima zaidi?', 'Samahani, mwalimu, naomba kuuliza swali.', ['Mwalimu, nyamaza nikuulize!', 'M_HESH_RUDE'], ['Jibu swali langu sasa.', 'M_HESH_RUDE'], 'Samahani na naomba huonyesha heshima kwa mwalimu.'],
  ['Ni sentensi ipi ina heshima zaidi?', 'Asante kwa kunisaidia, shangazi.', ['Umenisaidia, basi.', 'M_HESH_RUDE'], ['Sikuomba msaada wako.', 'M_HESH_RUDE'], 'Asante huonyesha heshima na shukrani.'],
  ['Ni sentensi ipi ina heshima zaidi?', 'Pole kwa msiba, mzee.', ['Ni jambo la kawaida tu.', 'M_HESH_RUDE'], ['Msiba si kitu.', 'M_HESH_RUDE'], 'Pole humfariji mtu mwenye huzuni kwa heshima.'],
];

const METHALI = [
  ['Umoja ni nguvu, utengano ni ___.', 'udhaifu', ['ushindi', 'M_MET_WRONG_END'], ['utajiri', 'M_MET_WRONG_END'], ['upendo', 'M_MET_WRONG_END'], 'Methali inasema umoja ni nguvu na utengano ni udhaifu.'],
  ['Kidole kimoja hakivunji ___.', 'chawa', ['kuni', 'M_MET_WRONG_END'], ['jiwe', 'M_MET_WRONG_END'], ['mfupa', 'M_MET_WRONG_END'], 'Methali inasema kidole kimoja hakivunji chawa, yaani tunahitaji kushirikiana.'],
  ['Mkono mmoja haulei ___.', 'mwana', ['nyumba', 'M_MET_WRONG_END'], ['shamba', 'M_MET_WRONG_END'], ['chakula', 'M_MET_WRONG_END'], 'Methali inasema mkono mmoja haulei mwana, yaani kulea kunahitaji wengi.'],
  ['Wengi ___.', 'wape', ['wasikie', 'M_MET_WRONG_END'], ['wale', 'M_MET_WRONG_END'], ['waondoke', 'M_MET_WRONG_END'], 'Methali inasema wengi wape, yaani uamuzi hufuata walio wengi.'],
];
const METHALI_M = [
  ['Methali "Kidole kimoja hakivunji chawa" inafundisha nini?', 'Mtu peke yake hawezi kufanya kazi ngumu; tunahitaji kushirikiana.', ['Kidole hakifai kuua chawa.', 'M_MET_LITERAL'], ['Chawa ni wadudu hatari sana.', 'M_MET_LITERAL'], ['Kila mtu afanye kazi peke yake.', 'M_MET_WRONG_LESSON'], 'Methali haisemi kuhusu kidole na chawa tu. Inafundisha kushirikiana.'],
  ['Methali "Mkono mmoja haulei mwana" inafundisha nini?', 'Kulea mtoto kunahitaji ushirikiano wa watu wengi.', ['Mkono mmoja ni dhaifu kuliko miwili.', 'M_MET_LITERAL'], ['Mama pekee ndiye alee mtoto.', 'M_MET_WRONG_LESSON'], ['Watoto hawalelewi kwa mikono.', 'M_MET_LITERAL'], 'Methali inatumia mkono kuonyesha kwamba mtu mmoja hawezi kila kitu.'],
  ['Methali "Umoja ni nguvu" inafundisha nini?', 'Tukishirikiana tunakuwa na nguvu zaidi.', ['Kila mtu ajitegemee peke yake.', 'M_MET_WRONG_LESSON'], ['Nguvu hutokana na kula chakula kingi.', 'M_MET_LITERAL'], ['Watu wenye misuli ndio wenye umoja.', 'M_MET_LITERAL'], 'Umoja ni kushirikiana, na ushirikiano huleta nguvu.'],
  ['Methali "Wengi wape" inamaanisha nini?', 'Maamuzi hufuata maoni ya walio wengi.', ['Wale walio wengi wapewe zawadi.', 'M_MET_LITERAL'], ['Kila mtu apewe sehemu sawa ya chakula.', 'M_MET_LITERAL'], ['Aliye peke yake ndiye anayeamua.', 'M_MET_WRONG_LESSON'], 'Wape ni kuwapa uamuzi walio wengi.'],
];

const NAHAU = [
  ['Wanakijiji waliamua ___ njuga ili kujenga kisima haraka.', 'kuvaa', ['kuvua', 'M_NAH_WRONG_WORD'], ['kula', 'M_NAH_WRONG_WORD'], ['kununua', 'M_NAH_WRONG_WORD'], 'Kuvaa njuga ni kuanza kazi kwa nguvu na ari.'],
  ['Walimu wote walimwunga ___ mwenzao katika mpango huo.', 'mkono', ['mguu', 'M_NAH_WRONG_WORD'], ['kidole', 'M_NAH_WRONG_WORD'], ['kichwa', 'M_NAH_WRONG_WORD'], 'Kuunga mkono ni kusaidia au kukubaliana na jambo.'],
  ['Kamau alijikaza ___ ili asife moyo kwa kazi ngumu.', 'kisabuni', ['kichwani', 'M_NAH_WRONG_WORD'], ['kiunoni', 'M_NAH_WRONG_WORD'], ['kijembeni', 'M_NAH_WRONG_WORD'], 'Kujikaza kisabuni ni kujitahidi na kuvumilia.'],
  ['Wakulima walianza kutoa ___ mashambani wakati wa mvua.', 'jasho', ['maji', 'M_NAH_WRONG_WORD'], ['damu', 'M_NAH_WRONG_WORD'], ['machozi', 'M_NAH_WRONG_WORD'], 'Kutoa jasho ni kufanya kazi kwa bidii.'],
  ['Wanafunzi walichapa ___ ili kumaliza mradi wa shule.', 'kazi', ['mpira', 'M_NAH_WRONG_WORD'], ['chakula', 'M_NAH_WRONG_WORD'], ['kitabu', 'M_NAH_WRONG_WORD'], 'Kuchapa kazi ni kufanya kazi kwa bidii.'],
  ['Nahodha aliwaambia wachezaji wafunge ___ kabla ya mechi ngumu.', 'mkanda', ['mlango', 'M_NAH_WRONG_WORD'], ['kitabu', 'M_NAH_WRONG_WORD'], ['viatu', 'M_NAH_WRONG_WORD'], 'Kufunga mkanda ni kujiandaa kwa kazi ngumu.'],
];
const NAHAU_M = [
  ['Nahau "kuchapa kazi" ina maana gani?', 'kufanya kazi kwa bidii', ['kupiga kazi kwa mjeledi', 'M_NAH_LITERAL'], ['kuacha kazi', 'M_NAH_WRONG_MEANING'], ['kutafuta kazi', 'M_NAH_WRONG_MEANING'], 'Kuchapa kazi ni kufanya kazi kwa bidii, si kupiga kazi.'],
  ['Nahau "kuvaa njuga" ina maana gani?', 'kuanza kazi kwa nguvu na ari', ['kuvaa mapambo ya miguuni', 'M_NAH_LITERAL'], ['kuacha kazi', 'M_NAH_WRONG_MEANING'], ['kupumzika', 'M_NAH_WRONG_MEANING'], 'Njuga huvaliwa miguuni na wacheza ngoma wanapoanza. Nahau ni kuanza kwa nguvu.'],
  ['Nahau "kuunga mkono" ina maana gani?', 'kusaidia au kukubaliana na jambo', ['kuunganisha mikono miwili', 'M_NAH_LITERAL'], ['kupinga jambo', 'M_NAH_WRONG_MEANING'], ['kuchukua mkono wa mtu', 'M_NAH_LITERAL'], 'Kuunga mkono ni kusaidia au kukubali.'],
  ['Nahau "kutoa jasho" ina maana gani?', 'kufanya kazi kwa bidii', ['kuwa na joto jingi', 'M_NAH_LITERAL'], ['kupumzika', 'M_NAH_WRONG_MEANING'], ['kuoga', 'M_NAH_LITERAL'], 'Kutoa jasho ni kufanya kazi ngumu kwa bidii.'],
  ['Nahau "kujikaza kisabuni" ina maana gani?', 'kujitahidi na kuvumilia', ['kujisugua kwa sabuni', 'M_NAH_LITERAL'], ['kukata tamaa', 'M_NAH_WRONG_MEANING'], ['kujificha', 'M_NAH_WRONG_MEANING'], 'Kujikaza kisabuni ni kuvumilia shida.'],
  ['Nahau "kufunga mkanda" ina maana gani?', 'kujiandaa kwa kazi ngumu', ['kuvaa ukanda wa suruali', 'M_NAH_LITERAL'], ['kusimama kimya', 'M_NAH_WRONG_MEANING'], ['kuacha mchezo', 'M_NAH_WRONG_MEANING'], 'Kufunga mkanda ni kujiandaa kwa jambo gumu.'],
];

const VIS = [
  ['Neno lenye maana sawa na "furaha" ni ___.', 'bashasha', ['huzuni', 'M_VIS_OPPOSITE'], ['tabasamu', 'M_VIS_RELATED'], ['sherehe', 'M_VIS_RELATED'], 'Bashasha ni furaha. Huzuni ni kinyume cha furaha.'],
  ['Neno lenye maana sawa na "haraka" ni ___.', 'upesi', ['taratibu', 'M_VIS_OPPOSITE'], ['barabara', 'M_VIS_RELATED'], ['usafiri', 'M_VIS_RELATED'], 'Upesi na haraka zina maana sawa.'],
  ['Neno lenye maana sawa na "rafiki" ni ___.', 'sahibu', ['adui', 'M_VIS_OPPOSITE'], ['jirani', 'M_VIS_RELATED'], ['mwalimu', 'M_VIS_RELATED'], 'Sahibu na rafiki zina maana sawa.'],
  ['Neno lenye maana sawa na "maskini" ni ___.', 'fukara', ['tajiri', 'M_VIS_OPPOSITE'], ['mkulima', 'M_VIS_RELATED'], ['mgonjwa', 'M_VIS_RELATED'], 'Fukara na maskini zina maana sawa.'],
  ['Neno lenye maana sawa na "ugonjwa" ni ___.', 'maradhi', ['afya', 'M_VIS_OPPOSITE'], ['dawa', 'M_VIS_RELATED'], ['daktari', 'M_VIS_RELATED'], 'Maradhi na ugonjwa zina maana sawa.'],
  ['Neno lenye maana sawa na "tajiri" ni ___.', 'mkwasi', ['fukara', 'M_VIS_OPPOSITE'], ['mfanyabiashara', 'M_VIS_RELATED'], ['mkuu', 'M_VIS_RELATED'], 'Mkwasi na tajiri zina maana sawa.'],
];
const VIS_G = [
  ['Ni kundi lipi lina maneno yote yenye maana sawa na "furaha"?', 'bashasha, shangwe, raha, nderemo', ['huzuni, simanzi, majonzi, kilio', 'M_VIS_OPPOSITE'], ['bashasha, huzuni, raha, tabasamu', 'M_VIS_MIXED'], ['furaha, sherehe, keki, zawadi', 'M_VIS_RELATED'], 'Maneno yote ya kundi hili yanataja furaha.'],
  ['Ni kundi lipi lina maneno yote yenye maana sawa na "haraka"?', 'upesi, kasi, chapuchapu, harakaharaka', ['taratibu, polepole, shwari, tuli', 'M_VIS_OPPOSITE'], ['upesi, kasi, polepole, chapuchapu', 'M_VIS_MIXED'], ['haraka, gari, barabara, kasi', 'M_VIS_RELATED'], 'Maneno yote ya kundi hili yanataja haraka.'],
  ['Ni kundi lipi lina maneno yote yenye maana sawa na "rafiki"?', 'sahibu, swahiba, mwandani, mwenzi', ['adui, hasimu, mpinzani, bughudha', 'M_VIS_OPPOSITE'], ['sahibu, adui, mwandani, mwenzi', 'M_VIS_MIXED'], ['rafiki, shule, mwalimu, daftari', 'M_VIS_RELATED'], 'Maneno yote ya kundi hili yanataja rafiki.'],
  ['Ni kundi lipi lina maneno yote yenye maana sawa na "maskini"?', 'fukara, hohehahe, kapuku, maskini', ['tajiri, mkwasi, bwanyenye, mwenye mali', 'M_VIS_OPPOSITE'], ['fukara, tajiri, hohehahe, kapuku', 'M_VIS_MIXED'], ['maskini, mkulima, mgonjwa, mgeni', 'M_VIS_RELATED'], 'Maneno yote ya kundi hili yanataja mtu asiye na mali.'],
];

const SIT = [
  ['Kamau hufanya kazi kutwa nzima bila kuchoka. Kamau ni ___.', 'nyuki', ['simba', 'M_SIT_WRONG_ANIMAL'], ['kobe', 'M_SIT_WRONG_ANIMAL'], ['sungura', 'M_SIT_WRONG_ANIMAL'], 'Nyuki hufanya kazi bila kuchoka, kwa hiyo Kamau ni nyuki.'],
  ['Bi Wambui huchelewa kila jambo. Yeye ni ___.', 'kobe', ['nyuki', 'M_SIT_WRONG_ANIMAL'], ['simba', 'M_SIT_WRONG_ANIMAL'], ['tausi', 'M_SIT_WRONG_ANIMAL'], 'Kobe ni mwendo wa polepole, kwa hiyo anayechelewa ni kobe.'],
  ['Mkuu wa shule hana woga hata kidogo. Yeye ni ___.', 'simba', ['kobe', 'M_SIT_WRONG_ANIMAL'], ['sungura', 'M_SIT_WRONG_ANIMAL'], ['nyuki', 'M_SIT_WRONG_ANIMAL'], 'Simba ni mnyama jasiri, kwa hiyo mtu jasiri ni simba.'],
  ['Mwanaidi hubadili msimamo wake kila saa. Yeye ni ___.', 'kinyonga', ['simba', 'M_SIT_WRONG_ANIMAL'], ['kobe', 'M_SIT_WRONG_ANIMAL'], ['tausi', 'M_SIT_WRONG_ANIMAL'], 'Kinyonga hubadili rangi, kwa hiyo mtu anayebadilika kila mara ni kinyonga.'],
  ['Mzee Juma ni mjanja kupita kiasi katika biashara. Yeye ni ___.', 'mbweha', ['kobe', 'M_SIT_WRONG_ANIMAL'], ['simba', 'M_SIT_WRONG_ANIMAL'], ['nyuki', 'M_SIT_WRONG_ANIMAL'], 'Mbweha ni mnyama mjanja, kwa hiyo mtu mjanja ni mbweha.'],
  ['Msichana huyu anapenda kujionyesha kwa mavazi. Yeye ni ___.', 'tausi', ['kinyonga', 'M_SIT_WRONG_ANIMAL'], ['kobe', 'M_SIT_WRONG_ANIMAL'], ['nyuki', 'M_SIT_WRONG_ANIMAL'], 'Tausi hujionyesha kwa manyoya yake, kwa hiyo anayejionyesha ni tausi.'],
];
const SIT_S = [
  ['', 'Mwalimu ni simba.', ['Mwalimu ni kama simba.', 'M_SIT_TASHBIHI'], ['Mwalimu ana simba.', 'M_SIT_LITERAL'], 'Sitiari husema mtu ni kitu kingine bila kutumia "kama".'],
  ['', 'Mtoto huyu ni kobe.', ['Mtoto huyu ni kama kobe.', 'M_SIT_TASHBIHI'], ['Mtoto huyu ana kobe.', 'M_SIT_LITERAL'], 'Sitiari husema mtu ni kitu kingine bila "kama".'],
  ['', 'Rafiki yangu ni kinyonga.', ['Rafiki yangu ni kama kinyonga.', 'M_SIT_TASHBIHI'], ['Rafiki yangu ana kinyonga.', 'M_SIT_LITERAL'], 'Sitiari husema moja ni lingine bila "kama".'],
  ['', 'Dada ni tausi.', ['Dada ni kama tausi.', 'M_SIT_TASHBIHI'], ['Dada ana tausi.', 'M_SIT_LITERAL'], 'Sitiari haina "kama".'],
  ['', 'Mzee huyu ni mbweha.', ['Mzee huyu ni kama mbweha.', 'M_SIT_TASHBIHI'], ['Mzee huyu ana mbweha.', 'M_SIT_LITERAL'], 'Sitiari husema mzee ni mbweha, kuonyesha tabia yake.'],
  ['', 'Mama yetu ni nyuki.', ['Mama yetu ni kama nyuki.', 'M_SIT_TASHBIHI'], ['Mama yetu ana nyuki.', 'M_SIT_LITERAL'], 'Sitiari haina "kama".'],
];

const VIT = [
  ['Ni sentensi ipi ni kitendawili?', 'Nyumba yangu haina mlango. Ni nini?', ['Haba na haba hujaza kibaba.', 'M_VIT_METHALI'], ['Kuchapa kazi.', 'M_VIT_NAHAU'], ['Nyumba yetu ina mlango mmoja.', 'M_VIT_PLAIN'], 'Kitendawili kina maelezo ya fumbo na swali la kutegua.'],
  ['Ni sentensi ipi ni kitendawili?', 'Nina meno lakini sili. Ni nani?', ['Umoja ni nguvu.', 'M_VIT_METHALI'], ['Kutoa jasho.', 'M_VIT_NAHAU'], ['Mbwa ana meno makali.', 'M_VIT_PLAIN'], 'Kitendawili hukuacha ukitegue jibu.'],
  ['Ni sentensi ipi ni kitendawili?', 'Kitu gani kinaongezeka kikichukuliwa?', ['Kidole kimoja hakivunji chawa.', 'M_VIT_METHALI'], ['Kuvaa njuga.', 'M_VIT_NAHAU'], ['Mchanga umechukuliwa na lori.', 'M_VIT_PLAIN'], 'Kitendawili hutegwa kwa swali la kubuni.'],
  ['Ni sentensi ipi ni kitendawili?', 'Hukimbia bila miguu. Ni nini?', ['Mkono mmoja haulei mwana.', 'M_VIT_METHALI'], ['Kufunga mkanda.', 'M_VIT_NAHAU'], ['Mto uko karibu na shule.', 'M_VIT_PLAIN'], 'Kitendawili kina fumbo na swali la kutegua.'],
  ['Ni sentensi ipi ni kitendawili?', 'Nina jicho lakini siwezi kuona. Ni nini?', ['Wengi wape.', 'M_VIT_METHALI'], ['Kuunga mkono.', 'M_VIT_NAHAU'], ['Sindano iko mezani.', 'M_VIT_PLAIN'], 'Kitendawili huficha jibu katika fumbo.'],
  ['Ni sentensi ipi ni kitendawili?', 'Ninakufuata mchana lakini usiku sionekani. Ni nini?', ['Umoja ni nguvu.', 'M_VIT_METHALI'], ['Kujikaza kisabuni.', 'M_VIT_NAHAU'], ['Jua linawaka mchana.', 'M_VIT_PLAIN'], 'Kitendawili kina fumbo na swali la kutegua.'],
];
const VIT_A = [
  ['Kitendawili: "Nyumba yangu haina mlango." Jibu ni ___.', 'yai', ['kibanda', 'M_VIT_WRONG_ANSWER'], ['sanduku', 'M_VIT_WRONG_ANSWER'], ['gari', 'M_VIT_WRONG_ANSWER'], 'Yai lina ganda lakini halina mlango.'],
  ['Kitendawili: "Nina meno lakini sili." Jibu ni ___.', 'kitana', ['mbwa', 'M_VIT_WRONG_ANSWER'], ['duka', 'M_VIT_WRONG_ANSWER'], ['kikapu', 'M_VIT_WRONG_ANSWER'], 'Kitana kina meno ya kuchana nywele, lakini hakili.'],
  ['Kitendawili: "Kitu gani kinaongezeka kikichukuliwa?" Jibu ni ___.', 'shimo', ['mchanga', 'M_VIT_WRONG_ANSWER'], ['maji', 'M_VIT_WRONG_ANSWER'], ['pesa', 'M_VIT_WRONG_ANSWER'], 'Ukichukua udongo kutoka shimoni, shimo linakua kubwa.'],
  ['Kitendawili: "Ninakufuata mchana lakini usiku sionekani." Jibu ni ___.', 'kivuli', ['rafiki', 'M_VIT_WRONG_ANSWER'], ['mbwa', 'M_VIT_WRONG_ANSWER'], ['mwalimu', 'M_VIT_WRONG_ANSWER'], 'Kivuli hukufuata mchana kwenye jua na hupotea gizani.'],
  ['Kitendawili: "Hukimbia bila miguu." Jibu ni ___.', 'mto', ['gari', 'M_VIT_WRONG_ANSWER'], ['mbuzi', 'M_VIT_WRONG_ANSWER'], ['mpira', 'M_VIT_WRONG_ANSWER'], 'Mto hutiririka bila miguu.'],
  ['Kitendawili: "Nina jicho lakini siwezi kuona." Jibu ni ___.', 'sindano', ['mbuzi', 'M_VIT_WRONG_ANSWER'], ['mtoto', 'M_VIT_WRONG_ANSWER'], ['sufuria', 'M_VIT_WRONG_ANSWER'], 'Sindano ina tundu linaloitwa jicho, lakini haioni.'],
];

const MUK = [
  ['"Waheshimiwa wageni, tunawakaribisha." ni lugha ___.', 'rasmi', ['isiyo rasmi', 'M_MUK_MIX'], ['ya mtaani', 'M_MUK_MIX'], ['ya utani', 'M_MUK_MIX'], 'Lugha ya heshima inayotumika kwenye mikutano ni rasmi.'],
  ['"Niaje, msee?" ni lugha ___.', 'isiyo rasmi', ['rasmi', 'M_MUK_MIX'], ['ya bungeni', 'M_MUK_MIX'], ['ya kiserikali', 'M_MUK_MIX'], 'Maneno ya mtaani kati ya marafiki ni lugha isiyo rasmi.'],
  ['"Mheshimiwa mgeni rasmi, tunakushukuru kwa kuja." ni lugha ___.', 'rasmi', ['isiyo rasmi', 'M_MUK_MIX'], ['ya mtaani', 'M_MUK_MIX'], ['ya utani', 'M_MUK_MIX'], 'Kumwita mgeni "mheshimiwa" na kumshukuru kwa heshima ni lugha rasmi.'],
  ['"Twende tucheze, rafiki!" ni lugha ___.', 'isiyo rasmi', ['rasmi', 'M_MUK_MIX'], ['ya bungeni', 'M_MUK_MIX'], ['ya kiserikali', 'M_MUK_MIX'], 'Maneno ya marafiki wakicheza ni lugha isiyo rasmi.'],
  ['"Ninaomba kuwasilisha ombi langu kwa heshima." ni lugha ___.', 'rasmi', ['isiyo rasmi', 'M_MUK_MIX'], ['ya mtaani', 'M_MUK_MIX'], ['ya utani', 'M_MUK_MIX'], 'Maneno ya heshima na ya kuomba kwa mpangilio ni lugha rasmi.'],
  ['"Mambo vipi, dada?" ni lugha ___.', 'isiyo rasmi', ['rasmi', 'M_MUK_MIX'], ['ya bungeni', 'M_MUK_MIX'], ['ya kiserikali', 'M_MUK_MIX'], 'Salamu ya haraka kati ya marafiki ni lugha isiyo rasmi.'],
];
const MUK_S = [
  ['Chagua sentensi inayofaa mkutano rasmi wa shule.', 'Waheshimiwa wazazi, tunawakaribisha kwenye mkutano huu.', ['Jamani wazazi, karibuni bwana!', 'M_MUK_INFORMAL'], ['Wazazi, mko poa?', 'M_MUK_INFORMAL'], 'Mkutano rasmi hutumia lugha ya heshima.'],
  ['Chagua sentensi inayofaa unapozungumza na mwalimu mkuu.', 'Mwalimu mkuu, naomba ruhusa ya kuondoka mapema.', ['Mkuu, nitoke haraka bwana.', 'M_MUK_INFORMAL'], ['Nipe ruhusa tu.', 'M_MUK_INFORMAL'], 'Kwa mwalimu mkuu tunatumia lugha ya heshima.'],
  ['Chagua sentensi inayofaa unapozungumza na rafiki uwanjani.', 'Twende tucheze mpira, rafiki!', ['Mheshimiwa mwanafunzi, tunakualika kucheza mpira.', 'M_MUK_FORMAL_FRIEND'], ['Naomba kibali cha kuanza mchezo.', 'M_MUK_FORMAL_FRIEND'], 'Kwa rafiki tunatumia lugha ya kawaida ya kirafiki.'],
  ['Unamwandikia mkuu wa wilaya. Chagua sentensi inayofaa.', 'Ninaomba kuwasilisha ombi langu kwa heshima.', ['Habari yako msee, nataka kukuomba kitu.', 'M_MUK_INFORMAL'], ['Niaje boss, nisaidie.', 'M_MUK_INFORMAL'], 'Kwa kiongozi tunatumia lugha rasmi.'],
  ['Unamwambia dada yako nyumbani. Chagua sentensi inayofaa.', 'Dada, njoo unisaidie kuosha vyombo.', ['Dada mheshimiwa, tunaomba usaidizi wa kuosha vyombo.', 'M_MUK_FORMAL_FRIEND'], ['Naomba unipatie msaada kwa mujibu wa utaratibu.', 'M_MUK_FORMAL_FRIEND'], 'Kwa dada nyumbani tunatumia lugha ya kawaida.'],
];

export const FAMILIES = [
  ...trio('maamkuzi', 'KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', MAAM, { stem: 'Chagua salamu au kuaga kunakofaa.', gapStem: 'Andika salamu au kuaga kunakofaa:', topic: 'kuhusu maamkuzi na maagano', hints: H('Salamu na kuaga hutegemea wakati na idadi ya watu.', 'Jiulize unakutana na mtu au unaondoka, na ni mmoja au wengi.') }),
  ...trio('heshima', 'KUSIKI.T4_HESHIMA_ADABU_NA_VYE.HESHIMA', HESH, { stem: 'Chagua neno la heshima linalofaa.', gapStem: 'Andika neno la heshima linalofaa:', oc: ['a', 'b', 'b'], topic: 'kuhusu maneno ya heshima', hints: H('Kila neno la heshima lina kazi yake: kuomba, kushukuru, kuomba msamaha, kufariji au kukaribisha.', 'Fikiria hali ya sentensi kabla ya kuchagua.') }),
  ...duo('heshima.sentensi', 'KUSIKI.T4_HESHIMA_ADABU_NA_VYE.HESHIMA', HESH_S, { stem: 'Chagua sentensi yenye heshima zaidi.', tag: 'sentensi', oc: ['a', 'b'], topic: 'kuhusu maneno ya heshima', hints: H('Maneno kama tafadhali, naomba, samahani na asante huonyesha heshima.', 'Amri bila heshima si ya adabu.') }),
  ...trio('methali', 'KUSIKI.T5_METHALI_KUFIKIA_MWIS.METHALI', METHALI, { stem: 'Chagua neno linalokamilisha methali.', gapStem: 'Andika neno linalokamilisha methali:', topic: 'kuhusu methali za umoja na ushirikiano', hints: H('Methali ni msemo mfupi wenye mafundisho.', 'Kumbuka methali kamili.') }),
  ...one('methali.maana', 'KUSIKI.T5_METHALI_KUFIKIA_MWIS.METHALI', METHALI_M, { stem: 'Chagua maana sahihi ya methali.', oc: 'b', tag: 'maana', rung: 2, hints: H('Methali haimaanishi maneno yake kama yalivyo.', 'Fikiria funzo linalofundishwa.') }),
  ...trio('nahau', 'KUSIKI.T7_NAHAU.NAHAU', NAHAU, { stem: 'Chagua neno linalokamilisha nahau.', gapStem: 'Andika neno linalokamilisha nahau:', topic: 'kuhusu nahau za kazi na ushirikiano', hints: H('Nahau ni maneno yenye maana tofauti na maana ya kawaida.', 'Kumbuka nahau kamili.') }),
  ...one('nahau.maana', 'KUSIKI.T7_NAHAU.NAHAU', NAHAU_M, { stem: 'Chagua maana sahihi ya nahau.', oc: 'b', tag: 'maana', rung: 2, hints: H('Nahau haimaanishi maneno yake kama yalivyo.', 'Fikiria kinachomaanishwa.') }),
  ...trio('visawe', 'KUSIKI.T8_VISAWE.VISAWE', VIS, { stem: 'Chagua neno lenye maana sawa.', gapStem: 'Andika neno lenye maana sawa:', topic: 'kuhusu visawe', hints: H('Visawe ni maneno yenye maana sawa.', 'Kinyume ni neno la upande wa pili, si kisawe.') }),
  ...one('visawe.kundi', 'KUSIKI.T8_VISAWE.VISAWE', VIS_G, { stem: 'Chagua kundi sahihi.', oc: 'a', tag: 'kundi', rung: 2, hints: H('Kila neno la kundi lazima liwe na maana sawa na neno lililotajwa.', 'Kundi lenye kinyume kimoja si sahihi.') }),
  ...trio('sitiari', 'KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', SIT, { stem: 'Chagua neno linalokamilisha sitiari.', gapStem: 'Andika neno linalokamilisha sitiari:', topic: 'kuhusu sitiari za tabia', hints: H('Sitiari husema mtu ni kitu kingine kwa sababu ya tabia, bila kutumia "kama".', 'Fikiria tabia ya mnyama huyo.') }),
  ...duo('sitiari.tambua', 'KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', SIT_S, { stem: 'Chagua sentensi iliyo sitiari.', tag: 'tambua', oc: ['a', 'b'], topic: 'kuhusu sitiari', hints: H('Sitiari haina "kama".', 'Tashbihi ina "kama" au "mithili ya".') }),
  ...one('vitendawili.tambua', 'KUSIKI.T3_MATAMSHI_BORA.VITENDAWILI', VIT, { stem: 'Chagua kitendawili.', oc: 'a', tag: 'tambua', hints: H('Kitendawili ni fumbo lenye jibu la kutegua.', 'Methali na nahau si vitendawili.') }),
  ...trio('vitendawili.jibu', 'KUSIKI.T3_MATAMSHI_BORA.VITENDAWILI', VIT_A, { stem: 'Chagua jibu la kitendawili.', gapStem: 'Andika jibu la kitendawili:', oc: ['a', 'a', 'a'], topic: 'kuhusu vitendawili', hints: H('Fikiria kitu chenye sifa zote zilizotajwa.', 'Jibu ni kitu cha kawaida.') }),
  ...trio('muktadha', 'KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA', MUK, { stem: 'Chagua jibu sahihi.', gapStem: 'Andika jibu sahihi:', oc: ['a', 'a', 'a'], topic: 'kuhusu lugha rasmi na isiyo rasmi', hints: H('Maneno ya heshima kwa viongozi na mikutano ni ya aina moja; ya marafiki na nyumbani ni ya aina nyingine.', 'Jiulize anayezungumza ni nani na anamwambia nani.') }),
  ...one('muktadha.sentensi', 'KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA', MUK_S, { stem: 'Chagua sentensi inayofaa.', oc: 'b', tag: 'sentensi', rung: 2, hints: H('Fikiria unazungumza na nani na wapi.', 'Mkubwa na mkutano rasmi huhitaji lugha ya heshima.') }),
];
