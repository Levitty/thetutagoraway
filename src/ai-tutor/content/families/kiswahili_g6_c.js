// ============================================================================
// KISWAHILI GRADE 6, SARUFI (Themes 8 to 11): mnyambuliko (kutendeana, kutendesha, kutendua), vinyume vya vivumishi,
// hali ya masharti, ukanushaji wa masharti, ukubwa na udogo wa nomino za ki-. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. A native Kiswahili speaker must check every item,
// above all the kutendeana glosses and the ji- and kiji- forms.
// ============================================================================
import { trio, one } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];

const MNY = [
  ['Majirani hao ___ chakula kila Jumapili. (kila mmoja humpikia mwenzake)', 'hupikiana', ['hupikia', 'M_MNY_ONEWAY'], ['hupika', 'M_MNY_BASE'], ['hupikisha', 'M_MNY_WRONG_FORM'], 'Kutendeana ni kutendea kila mmoja mwenzake: hupikiana.'],
  ['Otieno na Achieng ___ barua kila mwezi.', 'huandikiana', ['huandikia', 'M_MNY_ONEWAY'], ['huandika', 'M_MNY_BASE'], ['huandikisha', 'M_MNY_WRONG_FORM'], 'Kila mmoja humwandikia mwenzake, kwa hiyo huandikiana.'],
  ['Mwalimu ___ watoto kuimba wimbo mpya. (huwafanya waimbe)', 'huimbisha', ['huimba', 'M_MNY_BASE'], ['huimbiana', 'M_MNY_WRONG_FORM'], ['huimbua', 'M_MNY_WRONG_FORM'], 'Kutendesha ni kumfanya mtu atende: huimbisha ni kuwafanya waimbe.'],
  ['Mama ___ mtoto kila asubuhi. (hufanya mtoto aoge)', 'huogesha', ['huoga', 'M_MNY_BASE'], ['huogeana', 'M_MNY_WRONG_FORM'], ['huogea', 'M_MNY_ONEWAY'], 'Kutendesha ni kumfanya mtu atende: huogesha ni kumfanya mtoto aoge.'],
  ['Baba ___ mlango asubuhi. (hufanya kinyume cha kufunga)', 'hufungua', ['hufunga', 'M_MNY_BASE'], ['hufungiana', 'M_MNY_WRONG_FORM'], ['hufungisha', 'M_MNY_WRONG_FORM'], 'Kutendua ni kufanya kinyume cha kitendo: kufunga ni kinyume cha kufungua.'],
  ['Mvulana ___ viatu vyake kabla ya kuingia. (alifanya kinyume cha kuvaa)', 'alivua', ['alivaa', 'M_MNY_BASE'], ['alivalia', 'M_MNY_ONEWAY'], ['alivalisha', 'M_MNY_WRONG_FORM'], 'Kutendua ni kufanya kinyume cha kitendo: kuvaa ni kinyume cha kuvua.'],
  ['Mama ___ sufuria ili kuona chakula. (aliondoa kifuniko)', 'alifunua', ['alifunika', 'M_MNY_BASE'], ['alifunikia', 'M_MNY_ONEWAY'], ['alifunikisha', 'M_MNY_WRONG_FORM'], 'Kufunua ni kinyume cha kufunika: kuondoa kifuniko.'],
  ['Wasichana hao ___ nywele zao kila Jumamosi. (kila mmoja humsukia mwenzake)', 'husukiana', ['husuka', 'M_MNY_BASE'], ['husukia', 'M_MNY_ONEWAY'], ['husukisha', 'M_MNY_WRONG_FORM'], 'Kutendeana ni kutendea kila mmoja mwenzake: husukiana.'],
];

const VINY = [
  ['Mti huu ni mrefu lakini ule ni ___.', 'mfupi', ['mdogo', 'M_VINY_OTHER'], ['refu', 'M_VINY_NO_AGREE'], ['mrefu', 'M_VINY_SAME'], 'Kinyume cha mrefu ni mfupi, na hupatana na mti.'],
  ['Kisu hiki ni kikali lakini kile ni ___.', 'butu', ['kidogo', 'M_VINY_OTHER'], ['kikali', 'M_VINY_SAME'], ['chafu', 'M_VINY_OTHER'], 'Kinyume cha kikali ni butu: kisu kikali, kisu butu.'],
  ['Mfuko huu ni mzito lakini ule ni ___.', 'mwepesi', ['mfupi', 'M_VINY_OTHER'], ['mzuri', 'M_VINY_OTHER'], ['mzito', 'M_VINY_SAME'], 'Kinyume cha mzito ni mwepesi.'],
  ['Mto huu ni mpana lakini ule ni ___.', 'mwembamba', ['mrefu', 'M_VINY_OTHER'], ['mpana', 'M_VINY_SAME'], ['mfupi', 'M_VINY_OTHER'], 'Kinyume cha mpana ni mwembamba.'],
  ['Wanafunzi wa darasa letu ni wengi lakini wa darasa lile ni ___.', 'wachache', ['wadogo', 'M_VINY_OTHER'], ['wengi', 'M_VINY_SAME'], ['chache', 'M_VINY_NO_AGREE'], 'Kinyume cha wengi ni wachache, na hupatana na wanafunzi.'],
  ['Kiti hiki ni kigumu lakini kile ni ___.', 'laini', ['kikubwa', 'M_VINY_OTHER'], ['kigumu', 'M_VINY_SAME'], ['kilaini', 'M_VINY_NO_AGREE'], 'Kinyume cha kigumu ni laini.'],
  ['Mkulima huyu ni mwerevu lakini yule ni ___.', 'mjinga', ['mdogo', 'M_VINY_OTHER'], ['mwerevu', 'M_VINY_SAME'], ['jinga', 'M_VINY_NO_AGREE'], 'Kinyume cha mwerevu ni mjinga, na hupatana na mkulima.'],
  ['Maji ya kisima ni baridi lakini ya kuoga ni ___.', 'moto', ['baridi', 'M_VINY_SAME'], ['mengi', 'M_VINY_OTHER'], ['mazuri', 'M_VINY_OTHER'], 'Kinyume cha baridi ni moto: maji baridi, maji moto.'],
];

const MASH = [
  ['___ kwa bidii, utafaulu mtihani.', 'Ukisoma', ['Ulisoma', 'M_MASH_TENSE'], ['Unasoma', 'M_MASH_TENSE'], ['Usiposoma', 'M_MASH_NEG'], 'Ki- hutumika kuonyesha sharti: Ukisoma, utafaulu.'],
  ['___ mapema, utamkuta mwalimu.', 'Ukiamka', ['Uliamka', 'M_MASH_TENSE'], ['Unaamka', 'M_MASH_TENSE'], ['Usipoamka', 'M_MASH_NEG'], 'Sharti la kufanya jambo lifuate: Ukiamka mapema, utamkuta mwalimu.'],
  ['___ mimea, itakauka.', 'Usipomwagilia', ['Ukimwagilia', 'M_MASH_NEG'], ['Ulimwagilia', 'M_MASH_TENSE'], ['Unamwagilia', 'M_MASH_TENSE'], '-sipo- huonyesha sharti la kutofanya: Usipomwagilia, itakauka.'],
  ['___ tajiri, ningejenga shule kijijini.', 'Ningekuwa', ['Nilikuwa', 'M_MASH_TENSE'], ['Nitakuwa', 'M_MASH_TENSE'], ['Ninakuwa', 'M_MASH_TENSE'], '-nge- huonyesha jambo ambalo halikutokea: Ningekuwa tajiri, ningejenga shule.'],
  ['Wanafunzi ___ pamoja, watamaliza kazi haraka.', 'wakifanya', ['walifanya', 'M_MASH_TENSE'], ['wanafanya', 'M_MASH_TENSE'], ['wasipofanya', 'M_MASH_NEG'], 'Ki- hutumika kuonyesha sharti: wakifanya pamoja, watamaliza haraka.'],
  ['Mkulima ___ mbegu bora, atavuna mazao mengi.', 'akipanda', ['alipanda', 'M_MASH_TENSE'], ['anapanda', 'M_MASH_TENSE'], ['asipopanda', 'M_MASH_NEG'], 'Ki- hutumika kuonyesha sharti: akipanda mbegu bora, atavuna mengi.'],
];
const MASH_ID = [
  ['Ni kiambishi kipi cha masharti katika "Ukisoma, utafaulu"?', '-ki-', ['-ta-', 'M_MASH_ID_TENSE'], ['-u-', 'M_MASH_ID_PERSON'], 'Ki- ndicho kiambishi cha sharti. Ta- ni cha wakati ujao, na u- ni cha mtu wa pili.'],
  ['Ni kiambishi kipi cha masharti katika "Usiposoma, hutafaulu"?', '-sipo-', ['-hu-', 'M_MASH_ID_PERSON'], ['-ta-', 'M_MASH_ID_TENSE'], '-sipo- ni kiambishi cha sharti hasi. Ta- ni cha wakati ujao.'],
  ['Ni kiambishi kipi cha masharti katika "Ningesoma, ningefaulu"?', '-nge-', ['-ni-', 'M_MASH_ID_PERSON'], ['-fa-', 'M_MASH_ID_TENSE'], '-nge- ni kiambishi cha sharti la jambo lisilotokea. Ni- ni cha mtu wa kwanza.'],
  ['Ni kiambishi kipi cha masharti katika "Mkitembea haraka, mtafika mapema"?', '-ki-', ['-m-', 'M_MASH_ID_PERSON'], ['-ta-', 'M_MASH_ID_TENSE'], 'Ki- ndicho kiambishi cha sharti. M- ni cha mtu wa pili wingi.'],
  ['Ni kiambishi kipi cha masharti katika "Asipokuja, tutaanza bila yeye"?', '-sipo-', ['-a-', 'M_MASH_ID_PERSON'], ['-ta-', 'M_MASH_ID_TENSE'], '-sipo- ni kiambishi cha sharti hasi. A- ni cha mtu wa tatu.'],
  ['Ni kiambishi kipi cha masharti katika "Angekuja, angeona"?', '-nge-', ['-a-', 'M_MASH_ID_PERSON'], ['-ku-', 'M_MASH_ID_TENSE'], '-nge- ni kiambishi cha sharti la jambo lisilotokea.'],
];

const UKAN = [
  ['Neno "Ukisoma" likikanushwa huwa ___.', 'Usiposoma', ['Usikisoma', 'M_UKM_SI_ONLY'], ['Hukisoma', 'M_UKM_KEEP_KI'], ['Usisome', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo- katika ukanushaji: Ukisoma, Usiposoma.'],
  ['Neno "Akija" likikanushwa huwa ___.', 'Asipokuja', ['Asikija', 'M_UKM_SI_ONLY'], ['Hakija', 'M_UKM_KEEP_KI'], ['Asije', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo-: Akija, Asipokuja.'],
  ['Neno "Mkilima" likikanushwa huwa ___.', 'Msipolima', ['Msikilima', 'M_UKM_SI_ONLY'], ['Hamkilima', 'M_UKM_KEEP_KI'], ['Msilime', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo-: Mkilima, Msipolima.'],
  ['Neno "Wakiimba" likikanushwa huwa ___.', 'Wasipoimba', ['Wasikiimba', 'M_UKM_SI_ONLY'], ['Hawakiimba', 'M_UKM_KEEP_KI'], ['Wasiimbe', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo-: Wakiimba, Wasipoimba.'],
  ['Neno "Tukicheza" likikanushwa huwa ___.', 'Tusipocheza', ['Tusikicheza', 'M_UKM_SI_ONLY'], ['Hatukicheza', 'M_UKM_KEEP_KI'], ['Tusicheze', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo-: Tukicheza, Tusipocheza.'],
  ['Neno "Nikipata" likikanushwa huwa ___.', 'Nisipopata', ['Nisikipata', 'M_UKM_SI_ONLY'], ['Sikipata', 'M_UKM_KEEP_KI'], ['Nisipate', 'M_UKM_COMMAND'], 'Ki- hubadilika kuwa -sipo-: Nikipata, Nisipopata.'],
];

const UKUB = [
  ['Kitabu kikubwa sana huitwa ___.', 'jitabu', ['kijitabu', 'M_UKUB_SWAP'], ['vitabu', 'M_UKUB_PLURAL'], ['kitabu', 'M_UKUB_NO_CHANGE'], 'Ukubwa wa nomino ya ki- hupata ji-: kitabu, jitabu.'],
  ['Kitabu kidogo sana huitwa ___.', 'kijitabu', ['jitabu', 'M_UKUB_SWAP'], ['vitabu', 'M_UKUB_PLURAL'], ['kitabu', 'M_UKUB_NO_CHANGE'], 'Udogo wa nomino ya ki- hupata kiji-: kitabu, kijitabu.'],
  ['Kikapu kikubwa huitwa ___.', 'jikapu', ['kijikapu', 'M_UKUB_SWAP'], ['vikapu', 'M_UKUB_PLURAL'], ['kikapu', 'M_UKUB_NO_CHANGE'], 'Ukubwa hupata ji-: kikapu, jikapu.'],
  ['Kikombe kidogo huitwa ___.', 'kijikombe', ['jikombe', 'M_UKUB_SWAP'], ['vikombe', 'M_UKUB_PLURAL'], ['kikombe', 'M_UKUB_NO_CHANGE'], 'Udogo hupata kiji-: kikombe, kijikombe.'],
  ['Kitanda kikubwa huitwa ___.', 'jitanda', ['kijitanda', 'M_UKUB_SWAP'], ['vitanda', 'M_UKUB_PLURAL'], ['kitanda', 'M_UKUB_NO_CHANGE'], 'Ukubwa hupata ji-: kitanda, jitanda.'],
  ['Kibanda kidogo huitwa ___.', 'kijibanda', ['jibanda', 'M_UKUB_SWAP'], ['vibanda', 'M_UKUB_PLURAL'], ['kibanda', 'M_UKUB_NO_CHANGE'], 'Udogo hupata kiji-: kibanda, kijibanda.'],
  ['Kisiwa kikubwa huitwa ___.', 'jisiwa', ['kijisiwa', 'M_UKUB_SWAP'], ['visiwa', 'M_UKUB_PLURAL'], ['kisiwa', 'M_UKUB_NO_CHANGE'], 'Ukubwa hupata ji-: kisiwa, jisiwa.'],
  ['Kisu kidogo huitwa ___.', 'kijisu', ['jisu', 'M_UKUB_SWAP'], ['visu', 'M_UKUB_PLURAL'], ['kisu', 'M_UKUB_NO_CHANGE'], 'Udogo hupata kiji-: kisu, kijisu.'],
];
const UKUB_PL = [
  ['Wingi wa "jitabu" ni ___.', 'majitabu', ['vijitabu', 'M_UKUB_SWAP'], ['vitabu', 'M_UKUB_NO_CHANGE'], ['jitabu', 'M_UKUB_SINGULAR'], 'Ukubwa huchukua ma- katika wingi: jitabu, majitabu.'],
  ['Wingi wa "kijikapu" ni ___.', 'vijikapu', ['majikapu', 'M_UKUB_SWAP'], ['vikapu', 'M_UKUB_NO_CHANGE'], ['kijikapu', 'M_UKUB_SINGULAR'], 'Udogo huchukua vi- katika wingi: kijikapu, vijikapu.'],
  ['Wingi wa "jikombe" ni ___.', 'majikombe', ['vijikombe', 'M_UKUB_SWAP'], ['vikombe', 'M_UKUB_NO_CHANGE'], ['jikombe', 'M_UKUB_SINGULAR'], 'Ukubwa huchukua ma- katika wingi: jikombe, majikombe.'],
  ['Wingi wa "kijitanda" ni ___.', 'vijitanda', ['majitanda', 'M_UKUB_SWAP'], ['vitanda', 'M_UKUB_NO_CHANGE'], ['kijitanda', 'M_UKUB_SINGULAR'], 'Udogo huchukua vi- katika wingi: kijitanda, vijitanda.'],
  ['Wingi wa "jisu" ni ___.', 'majisu', ['vijisu', 'M_UKUB_SWAP'], ['visu', 'M_UKUB_NO_CHANGE'], ['jisu', 'M_UKUB_SINGULAR'], 'Ukubwa huchukua ma- katika wingi: jisu, majisu.'],
  ['Wingi wa "kijibanda" ni ___.', 'vijibanda', ['majibanda', 'M_UKUB_SWAP'], ['vibanda', 'M_UKUB_NO_CHANGE'], ['kijibanda', 'M_UKUB_SINGULAR'], 'Udogo huchukua vi- katika wingi: kijibanda, vijibanda.'],
];

export const FAMILIES = [
  ...trio('mnyambuliko', 'SARUFI.T8_MNYAMBULIKO_WA.MNYAMBULIKO', MNY, { stem: 'Chagua kitenzi kinachofaa.', gapStem: 'Andika kitenzi kinachokosekana:', topic: 'kuhusu kutendeana, kutendesha na kutendua', hints: H('Kutendeana ni kila mmoja kumtendea mwenzake, kutendesha ni kumfanya mtu atende, kutendua ni kufanya kinyume.', 'Soma maelezo yaliyo kwenye mabano.') }),
  ...trio('vinyume.vivumishi', 'SARUFI.T9_VINYUME_VYA_VIVUMISH.VINYUME_VIVUMISHI', VINY, { stem: 'Chagua kinyume cha kivumishi.', gapStem: 'Andika kinyume kinachokosekana:', topic: 'kuhusu vinyume vya vivumishi', hints: H('Kinyume ni neno lenye maana ya upande wa pili.', 'Kinyume lazima kipatane na nomino iliyo mbele yake.') }),
  ...trio('masharti', 'SARUFI.T10_HALI_YA_MASHARTI_NGE.MASHARTI', MASH, { stem: 'Chagua kitenzi cha masharti kinachofaa.', gapStem: 'Andika kitenzi cha masharti kinachokosekana:', topic: 'kuhusu hali ya masharti', hints: H('Hali ya masharti hutumia -ki-, -sipo- au -nge-.', 'Kitenzi cha masharti hakina -li-, -na- wala -ta-.') }),
  ...one('masharti.tambua', 'SARUFI.T10_HALI_YA_MASHARTI_NGE.MASHARTI', MASH_ID, { stem: 'Chagua kiambishi cha masharti.', oc: 'a', tag: 'tambua', n: 2, hints: H('Kiambishi cha masharti huonyesha sharti: -ki-, -sipo- au -nge-.', 'Ta- ni cha wakati ujao, si cha sharti.') }),
  ...trio('ukanushaji.masharti', 'SARUFI.T11_UKANUSHAJI_WA_MANENO.UKANUSHAJI_MASHARTI', UKAN, { stem: 'Chagua ukanushaji sahihi.', gapStem: 'Andika ukanushaji sahihi:', topic: 'kuhusu ukanushaji wa masharti', hints: H('Ki- hubadilika kuwa -sipo- katika ukanushaji.', 'Kitenzi hakirudii ki-, na si- haiji mbele ya ki-.') }),
  ...trio('ukubwa.ki', 'SARUFI.T11_UKUBWA_NA_UDOGO_WA_N.UKUBWA_KI', UKUB, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'b', 'b'], topic: 'kuhusu ukubwa na udogo wa nomino za ki-', hints: H('Ukubwa na udogo hubadilisha mwanzo wa nomino ya ki-.', 'Ukubwa hupata ji-, na udogo hupata kiji- mbele ya shina la neno.') }),
  ...trio('ukubwa.ki.wingi', 'SARUFI.T11_UKUBWA_NA_UDOGO_WA_N.UKUBWA_KI', UKUB_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi unaokosekana:', oc: ['c', 'c', 'c'], tag: 'wingi', topic: 'kuhusu wingi wa ukubwa na udogo', hints: H('Ukubwa (ji-) hupata ma- katika wingi, udogo (kiji-) hupata vi-.', 'Wingi wa kitabu cha kawaida (vitabu) si wingi wa jitabu.') }),
];
