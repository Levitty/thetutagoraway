// ============================================================================
// KISWAHILI GRADE 6, SARUFI (Themes 1 to 3): vivumishi vya sifa, viashiria, vimilikishi, idadi, viulizi, amba-;
// viwakilishi vya nafsi, viashiria, idadi; alama za uakifishi. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Every wrong answer names the library misconception behind it (curriculum/kiswahili/g6.json).
// A native Kiswahili speaker must check every item: docs/qa/kiswahili-g6-items-for-native-speaker-2026-11-13.md.
// ============================================================================
import { trio, duo, STEM } from './kiswahili_g6_lib.js';

const H = (a, b) => [a, b];

const SIFA = [
  ['Wanafunzi ___ walipata zawadi.', 'wazuri', ['mzuri', 'M_SIFA_NUMBER'], ['kizuri', 'M_SIFA_NO_AGREE'], ['nzuri', 'M_SIFA_NO_AGREE'], 'Wanafunzi ni wengi, kwa hiyo kivumishi huchukua wa-: wazuri.'],
  ['Kitabu ___ kiko mezani.', 'kikubwa', ['vikubwa', 'M_SIFA_NUMBER'], ['mkubwa', 'M_SIFA_NO_AGREE'], ['zikubwa', 'M_SIFA_NO_AGREE'], 'Kitabu ni cha ngeli ya KI-VI, kwa hiyo kivumishi huchukua ki-: kikubwa.'],
  ['Mti ___ umeanguka barabarani.', 'mrefu', ['mirefu', 'M_SIFA_NUMBER'], ['kirefu', 'M_SIFA_NO_AGREE'], ['nrefu', 'M_SIFA_NO_AGREE'], 'Mti mmoja ni wa ngeli ya U-I, kwa hiyo kivumishi huchukua m-: mrefu.'],
  ['Nyumba ___ ya Bi Amina ina bustani.', 'kubwa', ['mkubwa', 'M_SIFA_NO_AGREE'], ['kikubwa', 'M_SIFA_NO_AGREE'], ['zikubwa', 'M_SIFA_NUMBER'], 'Nyumba moja ni ya ngeli ya I-ZI, kwa hiyo kivumishi hakibadiliki sana: nyumba kubwa.'],
  ['Miti ___ imepandwa shuleni.', 'mirefu', ['mrefu', 'M_SIFA_NUMBER'], ['virefu', 'M_SIFA_NO_AGREE'], ['nrefu', 'M_SIFA_NO_AGREE'], 'Miti ni wingi wa mti, kwa hiyo kivumishi huchukua mi-: mirefu.'],
  ['Watoto ___ walicheza uwanjani.', 'wadogo', ['mdogo', 'M_SIFA_NUMBER'], ['vidogo', 'M_SIFA_NO_AGREE'], ['kidogo', 'M_SIFA_NO_AGREE'], 'Watoto ni wengi na ni watu, kwa hiyo kivumishi huchukua wa-: wadogo.'],
  ['Kikombe ___ kimevunjika.', 'kidogo', ['vidogo', 'M_SIFA_NUMBER'], ['mdogo', 'M_SIFA_NO_AGREE'], ['ndogo', 'M_SIFA_NO_AGREE'], 'Kikombe kimoja ni cha ngeli ya KI-VI, kwa hiyo kivumishi huchukua ki-: kidogo.'],
  ['Mkulima ___ alipanda mahindi mengi.', 'mkarimu', ['wakarimu', 'M_SIFA_NUMBER'], ['kikarimu', 'M_SIFA_NO_AGREE'], ['ukarimu', 'M_SIFA_NOT_ADJ'], 'Mkulima mmoja huchukua m-: mkarimu. Ukarimu ni nomino, si kivumishi.'],
];

const VIASHIRIA = [
  ['Mtoto ___ ni mwanafunzi mpya.', 'huyu', ['hawa', 'M_VIASH_NUMBER'], ['hiki', 'M_VIASH_CLASS'], ['huu', 'M_VIASH_CLASS'], 'Mtoto mmoja wa karibu huchukua huyu.'],
  ['Vitabu ___ ni vya maktaba.', 'hivi', ['hiki', 'M_VIASH_NUMBER'], ['hawa', 'M_VIASH_CLASS'], ['hizi', 'M_VIASH_CLASS'], 'Vitabu ni wingi wa kitabu, kwa hiyo hivi: vitabu hivi.'],
  ['Miti ___ imepandwa mwaka jana.', 'hii', ['huu', 'M_VIASH_NUMBER'], ['hizi', 'M_VIASH_CLASS'], ['hiki', 'M_VIASH_CLASS'], 'Miti ni wingi wa mti (U-I), kwa hiyo hii: miti hii.'],
  ['Mtoto ___ aliye mbali na sisi ni mdogo wangu.', 'yule', ['huyu', 'M_VIASH_FAR'], ['wale', 'M_VIASH_NUMBER'], ['kile', 'M_VIASH_CLASS'], 'Mtoto aliye mbali huchukua yule, si huyu. Huyu ni wa karibu.'],
  ['Nyumba ___ ndiyo ninayoishi.', 'hii', ['huu', 'M_VIASH_CLASS'], ['hizi', 'M_VIASH_NUMBER'], ['hili', 'M_VIASH_CLASS'], 'Nyumba moja ya karibu huchukua hii: nyumba hii.'],
  ['Mawe ___ ni mazito.', 'haya', ['hili', 'M_VIASH_NUMBER'], ['hivi', 'M_VIASH_CLASS'], ['hizi', 'M_VIASH_CLASS'], 'Mawe ni wingi wa jiwe (LI-YA), kwa hiyo haya: mawe haya.'],
  ['Kiti ___ kilicho kule ni cha mwalimu.', 'kile', ['hiki', 'M_VIASH_FAR'], ['vile', 'M_VIASH_NUMBER'], ['ile', 'M_VIASH_CLASS'], 'Kiti kilicho mbali huchukua kile, si hiki.'],
  ['Ukuta ___ umejengwa na mafundi.', 'huu', ['hii', 'M_VIASH_CLASS'], ['huyu', 'M_VIASH_CLASS'], ['hiki', 'M_VIASH_CLASS'], 'Ukuta ni wa ngeli ya U-I, kwa hiyo huu: ukuta huu.'],
];

const VIMIL = [
  ['Mwalimu ___ anaitwa Bi Njeri.', 'wangu', ['yangu', 'M_VIMIL_CLASS'], ['changu', 'M_VIMIL_CLASS'], ['zangu', 'M_VIMIL_NUMBER'], 'Mwalimu ni wa ngeli ya A-WA, kwa hiyo wangu: mwalimu wangu.'],
  ['Kitabu ___ kimepotea.', 'changu', ['wangu', 'M_VIMIL_CLASS'], ['vyangu', 'M_VIMIL_NUMBER'], ['yangu', 'M_VIMIL_CLASS'], 'Kitabu ni cha ngeli ya KI-VI, kwa hiyo changu: kitabu changu.'],
  ['Watoto ___ wanasoma vizuri.', 'wake', ['yake', 'M_VIMIL_CLASS'], ['vyake', 'M_VIMIL_CLASS'], ['zake', 'M_VIMIL_CLASS'], 'Watoto ni wa ngeli ya A-WA, kwa hiyo wake: watoto wake.'],
  ['Sisi tunapenda shule ___.', 'yetu', ['yangu', 'M_VIMIL_PERSON'], ['yake', 'M_VIMIL_PERSON'], ['zetu', 'M_VIMIL_NUMBER'], 'Sisi ni wengi, kwa hiyo -etu: shule yetu. -angu ni la mimi peke yangu.'],
  ['Mti ___ ni mrefu kuliko ule.', 'wako', ['yako', 'M_VIMIL_CLASS'], ['chako', 'M_VIMIL_CLASS'], ['zako', 'M_VIMIL_NUMBER'], 'Mti ni wa ngeli ya U-I, kwa hiyo wako: mti wako.'],
  ['Vitabu ___ viko mezani.', 'vyenu', ['wenu', 'M_VIMIL_CLASS'], ['chenu', 'M_VIMIL_NUMBER'], ['zenu', 'M_VIMIL_CLASS'], 'Vitabu ni wingi wa kitabu, kwa hiyo vyenu: vitabu vyenu.'],
  ['Wakulima wanauza mazao ___ sokoni.', 'yao', ['wao', 'M_VIMIL_CLASS'], ['vyao', 'M_VIMIL_CLASS'], ['zao', 'M_VIMIL_CLASS'], 'Mazao ni ya ngeli ya YA-YA, kwa hiyo yao: mazao yao.'],
  ['Jicho ___ linauma.', 'langu', ['wangu', 'M_VIMIL_CLASS'], ['changu', 'M_VIMIL_CLASS'], ['yangu', 'M_VIMIL_CLASS'], 'Jicho ni la ngeli ya LI-YA, kwa hiyo langu: jicho langu.'],
];

const IDADI = [
  ['Wanafunzi ___ walichelewa.', 'wawili', ['viwili', 'M_IDADI_CLASS'], ['mbili', 'M_IDADI_CLASS'], ['wili', 'M_IDADI_NO_PREFIX'], 'Wanafunzi ni watu, kwa hiyo wa-: wawili.'],
  ['Vitabu ___ viko mezani.', 'vitatu', ['watatu', 'M_IDADI_CLASS'], ['mitatu', 'M_IDADI_CLASS'], ['tatu', 'M_IDADI_NO_PREFIX'], 'Vitabu ni wingi wa kitabu, kwa hiyo vi-: vitatu.'],
  ['Miti ___ imekatwa.', 'minne', ['wanne', 'M_IDADI_CLASS'], ['vinne', 'M_IDADI_CLASS'], ['nne', 'M_IDADI_NO_PREFIX'], 'Miti ni wingi wa mti, kwa hiyo mi-: minne.'],
  ['Mama alinunua mayai ___ sokoni.', 'matano', ['vitano', 'M_IDADI_CLASS'], ['watano', 'M_IDADI_CLASS'], ['tano', 'M_IDADI_NO_PREFIX'], 'Mayai ni wingi wa yai, kwa hiyo ma-: matano.'],
  ['Baba ana ng\'ombe ___.', 'sita', ['wasita', 'M_IDADI_SIX_PLUS'], ['zasita', 'M_IDADI_SIX_PLUS'], ['visita', 'M_IDADI_SIX_PLUS'], 'Kuanzia sita, nambari haichukui kiambishi cha ngeli: ng\'ombe sita.'],
  ['Mtoto ___ amelala.', 'mmoja', ['wamoja', 'M_IDADI_CLASS'], ['kimoja', 'M_IDADI_CLASS'], ['moja', 'M_IDADI_NO_PREFIX'], 'Mtoto mmoja huchukua m-: mmoja.'],
  ['Nyumba ___ zimeezekwa kwa mabati.', 'mbili', ['viwili', 'M_IDADI_CLASS'], ['wawili', 'M_IDADI_CLASS'], ['wili', 'M_IDADI_NO_PREFIX'], 'Nyumba ni ya ngeli ya I-ZI, kwa hiyo mbili: nyumba mbili.'],
];

const VIULIZI = [
  ['Wanafunzi ___ wamefika?', 'wangapi', ['vingapi', 'M_VIUL_CLASS'], ['mangapi', 'M_VIUL_CLASS'], ['gani', 'M_VIUL_KIND'], 'Tunauliza idadi ya watu, kwa hiyo wa-: wangapi.'],
  ['Vitabu ___ vimepotea?', 'vingapi', ['wangapi', 'M_VIUL_CLASS'], ['mingapi', 'M_VIUL_CLASS'], ['gani', 'M_VIUL_KIND'], 'Vitabu huchukua vi-: vingapi.'],
  ['Mwalimu ___ amefundisha leo?', 'yupi', ['upi', 'M_VIUL_CLASS'], ['kipi', 'M_VIUL_CLASS'], ['wapi', 'M_VIUL_NUMBER'], 'Mwalimu mmoja huchukua yupi: mwalimu yupi?'],
  ['Kitabu ___ ni chako?', 'kipi', ['vipi', 'M_VIUL_NUMBER'], ['yupi', 'M_VIUL_CLASS'], ['upi', 'M_VIUL_CLASS'], 'Kitabu huchukua kipi: kitabu kipi?'],
  ['Miti ___ imekatwa?', 'ipi', ['upi', 'M_VIUL_NUMBER'], ['zipi', 'M_VIUL_CLASS'], ['wapi', 'M_VIUL_CLASS'], 'Miti huchukua ipi: miti ipi?'],
  ['Nyumba ___ ni yenu?', 'ipi', ['zipi', 'M_VIUL_NUMBER'], ['yupi', 'M_VIUL_CLASS'], ['upi', 'M_VIUL_CLASS'], 'Nyumba moja huchukua ipi: nyumba ipi?'],
  ['Ulikula chakula ___ jana?', 'gani', ['wangapi', 'M_VIUL_KIND'], ['ngapi', 'M_VIUL_KIND'], 'Tunauliza aina ya chakula, si idadi, kwa hiyo gani.'],
];

const AMBA = [
  ['Mwalimu ___ alitufundisha ni mwema.', 'ambaye', ['ambao', 'M_AMBA_NUMBER'], ['ambacho', 'M_AMBA_CLASS'], ['amba', 'M_AMBA_NO_END'], 'Mwalimu ni mtu mmoja, kwa hiyo ambaye.'],
  ['Kitabu ___ nilinunua ni kizuri.', 'ambacho', ['ambavyo', 'M_AMBA_NUMBER'], ['ambaye', 'M_AMBA_CLASS'], ['ambao', 'M_AMBA_CLASS'], 'Kitabu ni cha KI-VI, kwa hiyo ambacho.'],
  ['Watoto ___ wanasoma ni werevu.', 'ambao', ['ambaye', 'M_AMBA_NUMBER'], ['ambavyo', 'M_AMBA_CLASS'], ['amba', 'M_AMBA_NO_END'], 'Watoto ni wengi na ni watu, kwa hiyo ambao.'],
  ['Miti ___ ilikatwa ilikuwa mizee.', 'ambayo', ['ambao', 'M_AMBA_CLASS'], ['ambalo', 'M_AMBA_CLASS'], ['ambazo', 'M_AMBA_CLASS'], 'Miti ni wingi wa mti (U-I), kwa hiyo ambayo.'],
  ['Jiwe ___ lilianguka ni kubwa.', 'ambalo', ['ambayo', 'M_AMBA_NUMBER'], ['ambacho', 'M_AMBA_CLASS'], ['ambavyo', 'M_AMBA_CLASS'], 'Jiwe ni la LI-YA, kwa hiyo ambalo.'],
  ['Nyumba ___ ilijengwa ni mpya.', 'ambayo', ['ambazo', 'M_AMBA_NUMBER'], ['ambao', 'M_AMBA_CLASS'], ['ambalo', 'M_AMBA_CLASS'], 'Nyumba moja ni ya I-ZI, kwa hiyo ambayo.'],
  ['Vitu ___ vilipotea vimepatikana.', 'ambavyo', ['ambacho', 'M_AMBA_NUMBER'], ['ambayo', 'M_AMBA_CLASS'], ['ambazo', 'M_AMBA_CLASS'], 'Vitu ni wingi wa kitu (KI-VI), kwa hiyo ambavyo.'],
  ['Mama ___ anauza mboga ni shangazi yangu.', 'ambaye', ['amba', 'M_AMBA_NO_END'], ['ambao', 'M_AMBA_NUMBER'], ['ambayo', 'M_AMBA_CLASS'], 'Mama mmoja ni mtu, kwa hiyo ambaye. Amba- haitumiki bila mwisho.'],
];

const NAFSI = [
  ['Mimi na wewe ni marafiki. "___ ni mwanafunzi wa darasa la sita," alisema Juma.', 'Mimi', ['Wewe', 'M_NAFSI_PERSON'], ['Yeye', 'M_NAFSI_PERSON'], ['Sisi', 'M_NAFSI_NUMBER'], 'Juma anajisemea yeye mwenyewe peke yake, kwa hiyo Mimi.'],
  ['Juma anamwambia Akinyi, "___ ni rafiki yangu."', 'Wewe', ['Mimi', 'M_NAFSI_PERSON'], ['Yeye', 'M_NAFSI_PERSON'], ['Ninyi', 'M_NAFSI_NUMBER'], 'Juma anamwambia mtu mmoja anayezungumza naye: Wewe.'],
  ['Wanafunzi wote walikuja. ___ walifurahi.', 'Wao', ['Sisi', 'M_NAFSI_PERSON'], ['Ninyi', 'M_NAFSI_PERSON'], ['Yeye', 'M_NAFSI_NUMBER'], 'Tunazungumzia wanafunzi wengi wasiokuwepo kwenye mazungumzo: Wao.'],
  ['Mwalimu aliwaambia wanafunzi, "___ nyote mnapaswa kusoma."', 'Ninyi', ['Sisi', 'M_NAFSI_PERSON'], ['Wao', 'M_NAFSI_PERSON'], ['Wewe', 'M_NAFSI_NUMBER'], 'Mwalimu anawaambia wengi wanaozungumza naye: Ninyi.'],
  ['Mimi na Otieno tunacheza mpira. ___ tunapenda mpira.', 'Sisi', ['Wao', 'M_NAFSI_PERSON'], ['Ninyi', 'M_NAFSI_PERSON'], ['Mimi', 'M_NAFSI_NUMBER'], 'Mimi na Otieno ni wawili, na sisi ni wazungumzaji: Sisi.'],
  ['Wanjiru alipata zawadi. ___ alifurahi sana.', 'Yeye', ['Wewe', 'M_NAFSI_PERSON'], ['Mimi', 'M_NAFSI_PERSON'], ['Wao', 'M_NAFSI_NUMBER'], 'Tunamzungumzia Wanjiru mmoja asiyekuwepo kwenye mazungumzo: Yeye.'],
  ['Mama anamwambia mtoto, "___ unastahili sifa."', 'Wewe', ['Yeye', 'M_NAFSI_PERSON'], ['Mimi', 'M_NAFSI_PERSON'], ['Ninyi', 'M_NAFSI_NUMBER'], 'Mama anamwambia mtoto mmoja: Wewe.'],
];

const VWASH = [
  ['___ ni rafiki yangu wa karibu. (mtu mmoja aliye karibu)', 'Huyu', ['Hawa', 'M_VWASH_NUMBER'], ['Hiki', 'M_VWASH_CLASS'], ['Huu', 'M_VWASH_CLASS'], 'Kiwakilishi kiashiria husimama peke yake mahali pa nomino: Huyu ni rafiki yangu.'],
  ['___ ni vitabu vya shule.', 'Hivi', ['Hiki', 'M_VWASH_NUMBER'], ['Hawa', 'M_VWASH_CLASS'], ['Hizi', 'M_VWASH_CLASS'], 'Vitabu ni wingi wa kitabu, kwa hiyo Hivi.'],
  ['___ ni mti wa mwembe.', 'Huu', ['Hii', 'M_VWASH_CLASS'], ['Hili', 'M_VWASH_CLASS'], ['Hawa', 'M_VWASH_CLASS'], 'Mti ni wa ngeli ya U-I, kwa hiyo Huu.'],
  ['___ ni nyumba yetu.', 'Hii', ['Huu', 'M_VWASH_CLASS'], ['Hizi', 'M_VWASH_NUMBER'], ['Hili', 'M_VWASH_CLASS'], 'Nyumba moja ni ya I-ZI, kwa hiyo Hii.'],
  ['___ ni mawe mazito.', 'Haya', ['Hili', 'M_VWASH_NUMBER'], ['Hivi', 'M_VWASH_CLASS'], ['Hizi', 'M_VWASH_CLASS'], 'Mawe ni wingi wa jiwe (LI-YA), kwa hiyo Haya.'],
  ['___ ni watoto wa jirani yetu.', 'Hawa', ['Huyu', 'M_VWASH_NUMBER'], ['Hivi', 'M_VWASH_CLASS'], ['Haya', 'M_VWASH_CLASS'], 'Watoto ni wengi na ni watu, kwa hiyo Hawa.'],
  ['___ ni kiti cha mwalimu.', 'Hiki', ['Hivi', 'M_VWASH_NUMBER'], ['Huyu', 'M_VWASH_CLASS'], ['Hii', 'M_VWASH_CLASS'], 'Kiti kimoja ni cha KI-VI, kwa hiyo Hiki.'],
];
const VWASH_S = [
  ['', 'Hiki ni kitabu changu.', ['Kitabu hiki ni kizuri.', 'M_VWASH_ADJ'], ['Kitabu hiki kimepotea.', 'M_VWASH_ADJ'], 'Kiwakilishi kiashiria husimama mahali pa nomino. Kitabu hiki ni kivumishi kwa sababu kinafuata nomino.'],
  ['', 'Hawa ni walimu wetu.', ['Walimu hawa wanafundisha vizuri.', 'M_VWASH_ADJ'], ['Walimu hawa ni wageni.', 'M_VWASH_ADJ'], 'Hawa ni kiwakilishi kwa sababu kinasimama peke yake. Walimu hawa ni kivumishi.'],
  ['', 'Huu ni mti wa mwembe.', ['Mti huu ni mrefu.', 'M_VWASH_ADJ'], ['Mti huu umeanguka.', 'M_VWASH_ADJ'], 'Huu peke yake ni kiwakilishi. Ukiwa nyuma ya nomino (mti huu), ni kivumishi.'],
  ['', 'Hizi ni nyumba za shule.', ['Nyumba hizi ni kubwa.', 'M_VWASH_ADJ'], ['Nyumba hizi zimejengwa upya.', 'M_VWASH_ADJ'], 'Hizi ni kiwakilishi kwa sababu hakuna nomino mbele yake.'],
  ['', 'Yule ni babu yangu.', ['Mzee yule ni babu yangu.', 'M_VWASH_ADJ'], ['Mzee yule anatembea polepole.', 'M_VWASH_ADJ'], 'Yule peke yake ni kiwakilishi. Mzee yule ni kivumishi.'],
  ['', 'Haya ni mazao yetu.', ['Mazao haya ni mengi.', 'M_VWASH_ADJ'], ['Mazao haya yameiva.', 'M_VWASH_ADJ'], 'Haya peke yake ni kiwakilishi. Mazao haya ni kivumishi.'],
];

const VWID = [
  ['Wanafunzi kumi walifika. ___ walichelewa. (wawili kati yao)', 'Wawili', ['Viwili', 'M_VWID_CLASS'], ['Mbili', 'M_VWID_CLASS'], ['Wili', 'M_VWID_NO_PREFIX'], 'Kiwakilishi cha idadi huchukua kiambishi cha nomino: wa- kwa watu.'],
  ['Nilinunua vitabu vitano. ___ nilimpa Wanjiru. (vitatu kati yake)', 'Vitatu', ['Watatu', 'M_VWID_CLASS'], ['Mitatu', 'M_VWID_CLASS'], ['Tatu', 'M_VWID_NO_PREFIX'], 'Vitabu ni wingi wa kitabu, kwa hiyo vi-: vitatu.'],
  ['Kuna miti sita shuleni. ___ ni ya mikunazi. (miwili kati yake)', 'Miwili', ['Viwili', 'M_VWID_CLASS'], ['Wawili', 'M_VWID_CLASS'], ['Wili', 'M_VWID_NO_PREFIX'], 'Miti ni wingi wa mti, kwa hiyo mi-: miwili.'],
  ['Mama alinunua mayai kumi. ___ yalivunjika. (manne kati yake)', 'Manne', ['Minne', 'M_VWID_CLASS'], ['Wanne', 'M_VWID_CLASS'], ['Nne', 'M_VWID_NO_PREFIX'], 'Mayai ni wingi wa yai, kwa hiyo ma-: manne.'],
  ['Walimu watano waliingia. ___ ni wa Kiswahili. (wawili kati yao)', 'Wawili', ['Viwili', 'M_VWID_CLASS'], ['Mbili', 'M_VWID_CLASS'], ['Wili', 'M_VWID_NO_PREFIX'], 'Walimu ni watu, kwa hiyo wa-: wawili.'],
  ['Nyumba nne zimejengwa. ___ ni za mbao. (mbili kati yake)', 'Mbili', ['Viwili', 'M_VWID_CLASS'], ['Wawili', 'M_VWID_CLASS'], ['Wili', 'M_VWID_NO_PREFIX'], 'Nyumba ni ya ngeli ya I-ZI, kwa hiyo mbili.'],
];

const UAK = [
  ['', 'Lo! Umefika mapema leo!', ['Lo. Umefika mapema leo.', 'M_UAK6_HISI'], ['Lo? Umefika mapema leo?', 'M_UAK6_HISI'], 'Alama ya hisi (!) huonyesha mshangao, furaha au amri kali.'],
  ['', 'Nyamaza! Mtoto amelala.', ['Nyamaza. Mtoto amelala!', 'M_UAK6_HISI'], ['Nyamaza? Mtoto amelala.', 'M_UAK6_HISI'], 'Amri kali huisha kwa alama ya hisi (!).'],
  ['', 'Mkulima ana ng\'ombe watano.', ['Mkulima ana ngombe watano.', 'M_UAK6_RITIFAA'], ['Mkulima ana ng ombe watano.', 'M_UAK6_RITIFAA'], 'Ritifaa (\') huonyesha kwamba ng ni sauti moja katika ng\'ombe.'],
  ['', 'Mama alinunua vitu hivi: mchele, sukari na chumvi.', ['Mama alinunua vitu hivi, mchele, sukari na chumvi.', 'M_UAK6_KOLONI'], ['Mama alinunua vitu hivi. mchele, sukari na chumvi.', 'M_UAK6_KOLONI'], 'Koloni (:) huja kabla ya orodha inayotangazwa.'],
  ['', 'Haraka! Basi linaondoka!', ['Haraka, Basi linaondoka.', 'M_UAK6_HISI'], ['Haraka? Basi linaondoka?', 'M_UAK6_HISI'], 'Amri ya haraka na jambo la dharura huisha kwa alama ya hisi (!).'],
  ['', 'Wanafunzi wa ng\'ambo walitutembelea.', ['Wanafunzi wa ngambo walitutembelea.', 'M_UAK6_RITIFAA'], ['Wanafunzi wa ng-ambo walitutembelea.', 'M_UAK6_RITIFAA'], 'Ritifaa (\') huandikwa katika ng\'ambo kama katika ng\'ombe.'],
  ['', 'Vifaa vinavyohitajika: kalamu, rula na kifutio.', ['Vifaa vinavyohitajika, kalamu, rula na kifutio.', 'M_UAK6_KOLONI'], ['Vifaa vinavyohitajika. kalamu, rula na kifutio.', 'M_UAK6_KOLONI'], 'Koloni (:) hutangulia orodha ya vitu.'],
];

export const FAMILIES = [
  ...trio('sifa', 'SARUFI.T1_VIVUMISHI_VYA_SIFA.SIFA', SIFA, { stem: 'Chagua kivumishi cha sifa kinachofaa.', gapStem: 'Andika kivumishi cha sifa kinachokosekana:', topic: 'kuhusu vivumishi vya sifa', hints: H('Kivumishi cha sifa hubadilika kulingana na ngeli ya nomino.', 'Tazama kama nomino ni moja au wengi, kisha ngeli yake.') }),
  ...trio('viashiria', 'SARUFI.T1_VIVUMISHI_VIASHIRIA.VIASHIRIA', VIASHIRIA, { stem: 'Chagua kivumishi kiashiria kinachofaa.', gapStem: 'Andika kivumishi kiashiria kinachokosekana:', topic: 'kuhusu vivumishi viashiria', hints: H('Kivumishi kiashiria hufuata nomino na huonyesha iko karibu au iko mbali.', 'Tazama ngeli na idadi ya nomino.') }),
  ...trio('vimilikishi', 'SARUFI.T1_VIVUMISHI_VIMILIKISH.VIMILIKISHI', VIMIL, { stem: 'Chagua kivumishi kimilikishi kinachofaa.', gapStem: 'Andika kivumishi kimilikishi kinachokosekana:', topic: 'kuhusu vivumishi vimilikishi', hints: H('Kivumishi kimilikishi hufuata ngeli ya kitu kinachomilikiwa.', 'Mwenye kitu (-angu, -ako, -ake, -etu, -enu, -ao) hubadilisha mwisho, na kitu hubadilisha mwanzo.') }),
  ...trio('idadi', 'SARUFI.T2_VIVUMISHI_VYA_IDADI.IDADI', IDADI, { stem: 'Chagua kivumishi cha idadi kinachofaa.', gapStem: 'Andika kivumishi cha idadi kinachokosekana:', topic: 'kuhusu vivumishi vya idadi', hints: H('Kuanzia moja hadi tano, nambari huchukua kiambishi cha ngeli ya nomino.', 'Nambari kubwa zaidi ya tano hazibadiliki kamwe.') }),
  ...trio('viulizi', 'SARUFI.T2_VIVUMISHI_VIULIZI.VIULIZI', VIULIZI, { stem: 'Chagua kivumishi kiulizi kinachofaa.', gapStem: 'Andika kivumishi kiulizi kinachokosekana:', topic: 'kuhusu vivumishi viulizi', hints: H('Kivumishi kiulizi hufuata nomino na huuliza swali.', 'Jiulize: swali linataka idadi, nomino moja kati ya nyingi, au aina?') }),
  ...trio('amba', 'SARUFI.T2_KIVUMISHI_KIREJESHI_.AMBA', AMBA, { stem: 'Chagua kivumishi kirejeshi kinachofaa.', gapStem: 'Andika kivumishi kirejeshi kinachokosekana:', topic: 'kuhusu kivumishi kirejeshi amba-', hints: H('Amba- hupewa mwisho unaolingana na ngeli na idadi ya nomino iliyo mbele yake.', 'Mtu mmoja, watu wengi, kitu na vitu huwa na mwisho tofauti.') }),
  ...trio('nafsi', 'SARUFI.T3_VIWAKILISHI_VYA_NAFS.NAFSI', NAFSI, { stem: 'Chagua kiwakilishi cha nafsi kinachofaa.', gapStem: 'Andika kiwakilishi cha nafsi kinachokosekana:', topic: 'kuhusu viwakilishi vya nafsi', hints: H('Nafsi ya kwanza ni anayesema, ya pili ni anayeambiwa, ya tatu ni anayezungumziwa.', 'Tazama kama ni mmoja au wengi.') }),
  ...trio('viwakilishi.viashiria', 'SARUFI.T3_VIWAKILISHI_VIASHIRI.VIWAKILISHI_VIASHIRIA', VWASH, { stem: 'Chagua kiwakilishi kiashiria kinachofaa.', gapStem: 'Andika kiwakilishi kiashiria kinachokosekana:', topic: 'kuhusu viwakilishi viashiria', hints: H('Kiwakilishi kiashiria husimama mahali pa nomino.', 'Tazama ngeli na idadi ya kinachoonyeshwa.') }),
  ...duo('viwakilishi.viashiria.tofautisha', 'SARUFI.T3_VIWAKILISHI_VIASHIRI.VIWAKILISHI_VIASHIRIA', VWASH_S, { stem: 'Chagua sentensi yenye kiwakilishi kiashiria (kinasimama peke yake).', tag: 'tofautisha', oc: ['a', 'b'], topic: 'kuhusu viwakilishi viashiria', hints: H('Kiwakilishi hakina nomino mbele yake.', 'Kikifuata nomino, ni kivumishi.') }),
  ...trio('viwakilishi.idadi', 'SARUFI.T3_VIWAKILISHI_VYA_IDAD.VIWAKILISHI_IDADI', VWID, { stem: 'Chagua kiwakilishi cha idadi kinachofaa.', gapStem: 'Andika kiwakilishi cha idadi kinachokosekana:', topic: 'kuhusu viwakilishi vya idadi', hints: H('Kiwakilishi cha idadi husimama mahali pa nomino na huchukua kiambishi cha nomino hiyo.', 'Wawili ni kwa watu, viwili ni kwa vitu vya KI-VI.') }),
  ...duo('uakifishi', 'SARUFI.T3_UAKIFISHI.ALAMA', UAK, { stem: STEM.sentence, topic: 'kuhusu alama ya hisi, ritifaa na koloni', hints: H('Hisi (!) huonyesha mshangao au amri, ritifaa (\') hutumika katika ng\'ombe, na koloni (:) hutangulia orodha.', 'Soma kila sentensi kwa sauti na usikie inahitaji alama gani.') }),
];
