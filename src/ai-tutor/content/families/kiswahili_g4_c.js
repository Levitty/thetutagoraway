// ============================================================================
// KISWAHILI GRADE 4, SARUFI (Themes 8 to 11): kauli za kutenda, kutendea na kutendwa; vinyume vya nomino; nyakati
// (-li-, -na-, -ta-); ukanushaji; ukubwa na udogo wa nomino za m-. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Every wrong answer names the library misconception behind it (curriculum/kiswahili/g4.json, codes M4_...).
// A native Kiswahili speaker must check every item: docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];
// W(pre, text, right, 'wrong:CODE ...', because): a pool item; the code is M4_<pre>_<CODE>
const W = (pre, text, right, ws, because) => [text, right, ...ws.split(' ').map(w => { const [t, c] = w.split(':'); return [t.replace(/_/g, ' '), `M4_${pre}_${c}`]; }), because];

// ---------------------------------------------------------------- mnyambuliko: kutenda, kutendea, kutendwa
const MNY = [
  W('MNY', 'Mwalimu ___ wanafunzi barua.', 'anawaandikia', 'anaandika:NO_FOR anawaandika:NO_FOR anaandikwa:MIX', 'Barua inaandikiwa wanafunzi: kitendo kinafanyiwa mtu. Kitenzi kinaisha -ia: anawaandikia.'),
  W('MNY', 'Barua ___ na mwalimu.', 'imeandikwa', 'imeandika:NO_BY imeandikia:MIX', 'Barua ndiyo iliyofanyiwa kitendo. Kitenzi kinaisha -wa: imeandikwa.'),
  W('MNY', 'Bibi ___ mjukuu wake kitabu.', 'anamsomea', 'anasoma:NO_FOR anamsoma:NO_FOR anasomwa:MIX', 'Kitabu kinasomewa mjukuu: kitendo kinafanyiwa mtu. Kitenzi kinaisha -ea: anamsomea.'),
  W('MNY', 'Hadithi ___ na watoto wote.', 'inasomwa', 'inasoma:NO_BY inasomea:MIX', 'Hadithi ndiyo inayofanyiwa kitendo. Kitenzi kinaisha -wa: inasomwa.'),
  W('MNY', 'Fundi ___ Wanjiru gauni.', 'anamshonea', 'anashona:NO_FOR anamshona:NO_FOR anashonwa:MIX', 'Gauni linashonewa Wanjiru: kitendo kinafanyiwa mtu. Kitenzi kinaisha -ea: anamshonea.'),
  W('MNY', 'Gauni ___ na fundi.', 'limeshonwa', 'limeshona:NO_BY limeshonea:MIX', 'Gauni ndilo lililofanyiwa kitendo. Kitenzi kinaisha -wa: limeshonwa.'),
  W('MNY', 'Shamba ___ na wakulima wote.', 'limelimwa', 'limelima:NO_BY limelimia:MIX', 'Shamba ndilo lililofanyiwa kitendo. Kitenzi kinaisha -wa: limelimwa.'),
  W('MNY', 'Mkulima ___ mzee shamba.', 'anamlimia', 'analima:NO_FOR anamlima:NO_FOR analimwa:MIX', 'Shamba linalimiwa mzee: kitendo kinafanyiwa mtu. Kitenzi kinaisha -ia: anamlimia.'),
];
const KAULI = [
  W('MNY', 'Kitenzi "anaandika" kiko katika kauli ya ___.', 'kutenda', 'kutendea:MIX kutendwa:MIX', 'Anaandika ni kitenzi cha kawaida: kauli ya kutenda.'),
  W('MNY', 'Kitenzi "anamwandikia" kiko katika kauli ya ___.', 'kutendea', 'kutenda:MIX kutendwa:MIX', 'Anamwandikia: kitendo kinamfanyia mtu mwingine, kauli ya kutendea.'),
  W('MNY', 'Kitenzi "kinaandikwa" kiko katika kauli ya ___.', 'kutendwa', 'kutenda:MIX kutendea:MIX', 'Kinaandikwa: kitu kinafanyiwa kitendo, kauli ya kutendwa.'),
  W('MNY', 'Kitenzi "wanapika" kiko katika kauli ya ___.', 'kutenda', 'kutendea:MIX kutendwa:MIX', 'Wanapika ni kitenzi cha kawaida: kauli ya kutenda.'),
  W('MNY', 'Kitenzi "wanampikia" kiko katika kauli ya ___.', 'kutendea', 'kutenda:MIX kutendwa:MIX', 'Wanampikia: kitendo kinamfanyia mtu mwingine, kauli ya kutendea.'),
  W('MNY', 'Kitenzi "inapikwa" kiko katika kauli ya ___.', 'kutendwa', 'kutenda:MIX kutendea:MIX', 'Inapikwa: kitu kinafanyiwa kitendo, kauli ya kutendwa.'),
  W('MNY', 'Kitenzi "analima" kiko katika kauli ya ___.', 'kutenda', 'kutendea:MIX kutendwa:MIX', 'Analima ni kitenzi cha kawaida: kauli ya kutenda.'),
  W('MNY', 'Kitenzi "anamlimia" kiko katika kauli ya ___.', 'kutendea', 'kutenda:MIX kutendwa:MIX', 'Anamlimia: kitendo kinamfanyia mtu mwingine, kauli ya kutendea.'),
];

// ---------------------------------------------------------------- vinyume vya nomino
const VNOM = [
  W('VNOM', 'Kinyume cha "usiku" ni ___.', 'mchana', 'jioni:RELATED giza:RELATED alfajiri:RELATED', 'Usiku na mchana ni vinyume. Jioni, giza na alfajiri ziko karibu na usiku lakini si vinyume.'),
  W('VNOM', 'Kinyume cha "rafiki" ni ___.', 'adui', 'ndugu:RELATED jirani:RELATED swahiba:SAME', 'Rafiki na adui ni vinyume. "Swahiba" ina maana sawa na rafiki.'),
  W('VNOM', 'Kinyume cha "furaha" ni ___.', 'huzuni', 'raha:SAME kicheko:RELATED shangwe:SAME', 'Furaha na huzuni ni vinyume. "Raha" na "shangwe" zina maana sawa na furaha.'),
  W('VNOM', 'Kinyume cha "tajiri" ni ___.', 'maskini', 'mkwasi:SAME mfanyabiashara:RELATED mkulima:RELATED', 'Tajiri na maskini ni vinyume. "Mkwasi" ana maana sawa na tajiri.'),
  W('VNOM', 'Kinyume cha "mgeni" ni ___.', 'mwenyeji', 'rafiki:ONE_SIDE jirani:ONE_SIDE ndugu:ONE_SIDE', 'Mgeni ni anayetembelea, na mwenyeji ni anayepokea. Ni vinyume.'),
  W('VNOM', 'Kinyume cha "amani" ni ___.', 'vita', 'utulivu:SAME ushindi:RELATED askari:RELATED', 'Amani na vita ni vinyume. "Utulivu" una maana sawa na amani.'),
  W('VNOM', 'Kinyume cha "upendo" ni ___.', 'chuki', 'mapenzi:SAME urafiki:RELATED huruma:RELATED', 'Upendo na chuki ni vinyume. "Mapenzi" yana maana sawa na upendo.'),
  W('VNOM', 'Kinyume cha "mwanga" ni ___.', 'giza', 'nuru:SAME jua:RELATED taa:RELATED', 'Mwanga na giza ni vinyume. "Nuru" ina maana sawa na mwanga.'),
];
const VNOM_ID = [
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'usiku na mchana', 'furaha_na_raha:SAME mama_na_baba:RELATED mwalimu_na_mwanafunzi:RELATED', '"Usiku" na "mchana" ni vinyume. Jozi nyingine zina maana sawa au zinahusiana tu.'),
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'tajiri na maskini', 'haraka_na_upesi:SAME kalamu_na_kitabu:RELATED daktari_na_hospitali:RELATED', '"Tajiri" na "maskini" ni vinyume.'),
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'amani na vita', 'shida_na_taabu:SAME shule_na_darasa:RELATED mkulima_na_shamba:RELATED', '"Amani" na "vita" ni vinyume.'),
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'rafiki na adui', 'furaha_na_shangwe:SAME ndugu_na_dada:RELATED jirani_na_mgeni:RELATED', '"Rafiki" na "adui" ni vinyume.'),
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'mwanga na giza', 'mwanga_na_nuru:SAME jua_na_mwezi:RELATED taa_na_kibatari:RELATED', '"Mwanga" na "giza" ni vinyume.'),
  W('VNOM', 'Ni jozi ipi ina maneno yenye maana kinyume?', 'upendo na chuki', 'upendo_na_mapenzi:SAME baba_na_mama:RELATED mti_na_msitu:RELATED', '"Upendo" na "chuki" ni vinyume.'),
];

// ---------------------------------------------------------------- nyakati: -li-, -na-, -ta-
const NYA = [
  W('NYA', 'Jana, Juma a___soma kitabu.', 'li', 'na:NA_ALL ta:SWAP', 'Jana ni wakati uliopita. Kiambishi ni -li-: alisoma.'),
  W('NYA', 'Kesho, Wanjiru a___soma kitabu.', 'ta', 'na:NA_ALL li:SWAP', 'Kesho ni wakati ujao. Kiambishi ni -ta-: atasoma.'),
  W('NYA', 'Sasa hivi, mimi ni___soma kitabu.', 'na', 'li:SWAP ta:SWAP', 'Sasa hivi ni wakati uliopo. Kiambishi ni -na-: ninasoma.'),
  W('NYA', 'Wiki iliyopita, sisi tu___cheza mpira.', 'li', 'na:NA_ALL ta:SWAP', 'Wiki iliyopita ni wakati uliopita. Kiambishi ni -li-: tulicheza.'),
  W('NYA', 'Mwaka ujao, wao wa___safiri kwa ndege.', 'ta', 'na:NA_ALL li:SWAP', 'Mwaka ujao ni wakati ujao. Kiambishi ni -ta-: watasafiri.'),
  W('NYA', 'Sasa, mama a___pika chakula jikoni.', 'na', 'li:SWAP ta:SWAP', 'Sasa ni wakati uliopo. Kiambishi ni -na-: anapika.'),
  W('NYA', 'Juzi, baba a___nunua gari.', 'li', 'na:NA_ALL ta:SWAP', 'Juzi ni wakati uliopita. Kiambishi ni -li-: alinunua.'),
  W('NYA', 'Mwezi ujao, mimi ni___enda Mombasa.', 'ta', 'na:NA_ALL li:SWAP', 'Mwezi ujao ni wakati ujao. Kiambishi ni -ta-: nitaenda.'),
];
const NYA_FULL = [
  W('NYA', 'Jana mimi ___ kwa basi.', 'nilisafiri', 'ninasafiri:NA_ALL nitasafiri:SWAP tulisafiri:PERSON', 'Jana ni wakati uliopita na "mimi" ni ni-: nilisafiri.'),
  W('NYA', 'Kesho sisi ___ shambani.', 'tutalima', 'tunalima:NA_ALL tulilima:SWAP nitalima:PERSON', 'Kesho ni wakati ujao na "sisi" ni tu-: tutalima.'),
  W('NYA', 'Sasa hivi wanafunzi ___ darasani.', 'wanasoma', 'walisoma:SWAP watasoma:SWAP anasoma:PERSON', 'Sasa hivi ni wakati uliopo na "wanafunzi" ni wa-: wanasoma.'),
  W('NYA', 'Wiki iliyopita wewe ___ sokoni.', 'ulienda', 'unaenda:NA_ALL utaenda:SWAP walienda:PERSON', 'Wiki iliyopita ni wakati uliopita na "wewe" ni u-: ulienda.'),
  W('NYA', 'Mwaka ujao Atieno ___ darasa la tano.', 'ataingia', 'anaingia:NA_ALL aliingia:SWAP wataingia:PERSON', 'Mwaka ujao ni wakati ujao na "Atieno" ni a-: ataingia.'),
  W('NYA', 'Jana jioni mimi na Juma ___ mpira.', 'tulicheza', 'tunacheza:NA_ALL tutacheza:SWAP walicheza:PERSON', 'Jana ni wakati uliopita na "mimi na Juma" ni tu-: tulicheza.'),
];
const NYA_ID = [
  W('NYA', 'Kitenzi "alisoma" kiko katika wakati gani?', 'uliopita', 'uliopo:SWAP ujao:SWAP', 'Alisoma lina -li-, kwa hiyo ni wakati uliopita.'),
  W('NYA', 'Kitenzi "anasoma" kiko katika wakati gani?', 'uliopo', 'uliopita:SWAP ujao:SWAP', 'Anasoma lina -na-, kwa hiyo ni wakati uliopo.'),
  W('NYA', 'Kitenzi "atasoma" kiko katika wakati gani?', 'ujao', 'uliopita:SWAP uliopo:SWAP', 'Atasoma lina -ta-, kwa hiyo ni wakati ujao.'),
  W('NYA', 'Kitenzi "walicheza" kiko katika wakati gani?', 'uliopita', 'uliopo:SWAP ujao:SWAP', 'Walicheza lina -li-, kwa hiyo ni wakati uliopita.'),
  W('NYA', 'Kitenzi "tunaimba" kiko katika wakati gani?', 'uliopo', 'uliopita:SWAP ujao:SWAP', 'Tunaimba lina -na-, kwa hiyo ni wakati uliopo.'),
  W('NYA', 'Kitenzi "mtapika" kiko katika wakati gani?', 'ujao', 'uliopita:SWAP uliopo:SWAP', 'Mtapika lina -ta-, kwa hiyo ni wakati ujao.'),
];

// ---------------------------------------------------------------- ukanushaji
const NEG_GAP = [
  W('NEG', 'Jana Juma ___ kitabu hata kimoja.', 'hakusoma', 'hasomi:TENSE halisoma:KEEP_LI hatasoma:TENSE', 'Jana ni wakati uliopita. Kukanusha: -li- huwa -ku- na ha- huwekwa mbele: hakusoma.'),
  W('NEG', 'Mimi ___ mpira sasa hivi.', 'sichezi', 'sinacheza:HA_ONLY sikucheza:TENSE sitacheza:TENSE', 'Sasa hivi ni wakati uliopo. Kukanusha: -na- huondolewa na kitenzi huishia -i: sichezi.'),
  W('NEG', 'Kesho wanafunzi ___ nyimbo.', 'hawataimba', 'hawaimbi:TENSE hawakuimba:TENSE hawanaimba:HA_ONLY', 'Kesho ni wakati ujao. Kukanusha: -ta- hubaki na ha- huwekwa mbele: hawataimba.'),
  W('NEG', 'Jana wewe ___ chakula kitamu.', 'hukupika', 'hupiki:TENSE hulipika:KEEP_LI hutapika:TENSE', 'Jana ni wakati uliopita. Kukanusha: hukupika.'),
  W('NEG', 'Sasa mama ___ jikoni.', 'hapiki', 'hanapika:HA_ONLY hakupika:TENSE hatapika:TENSE', 'Sasa ni wakati uliopo. Kukanusha: -na- huondolewa na kitenzi huishia -i: hapiki.'),
  W('NEG', 'Wiki ijayo sisi ___ mtihani.', 'hatutafanya', 'hatufanyi:TENSE hatukufanya:TENSE hatunafanya:HA_ONLY', 'Wiki ijayo ni wakati ujao. Kukanusha: -ta- hubaki: hatutafanya.'),
  W('NEG', 'Jana wao ___ mbio uwanjani.', 'hawakukimbia', 'hawakimbii:TENSE hawalikimbia:KEEP_LI hawatakimbia:TENSE', 'Jana ni wakati uliopita. Kukanusha: hawakukimbia.'),
];
const NEG_SENT = [
  W('NEG', 'Kanusha: "Mimi ninasoma."', 'Mimi sisomi.', 'Mimi_sinasoma.:HA_ONLY Mimi_sikusoma.:TENSE Mimi_sitasoma.:TENSE', 'Wakati uliopo ukikanushwa, -na- huondolewa: ninasoma-sisomi.'),
  W('NEG', 'Kanusha: "Wanjiru alipika."', 'Wanjiru hakupika.', 'Wanjiru_halipika.:KEEP_LI Wanjiru_hapiki.:TENSE Wanjiru_hatapika.:TENSE', 'Wakati uliopita ukikanushwa, -li- huwa -ku-: alipika-hakupika.'),
  W('NEG', 'Kanusha: "Tutacheza."', 'Hatutacheza.', 'Hatucheza.:TENSE Hatukucheza.:TENSE Tuhatacheza.:HA_ONLY', 'Wakati ujao ukikanushwa, -ta- hubaki na ha- huwekwa mbele: hatutacheza.'),
  W('NEG', 'Kanusha: "Wanafunzi wanaimba."', 'Wanafunzi hawaimbi.', 'Wanafunzi_hawanaimba.:HA_ONLY Wanafunzi_hawakuimba.:TENSE Wanafunzi_hawataimba.:TENSE', 'Wakati uliopo ukikanushwa, -na- huondolewa na kitenzi huishia -i: hawaimbi.'),
  W('NEG', 'Kanusha: "Wewe ulicheza."', 'Wewe hukucheza.', 'Wewe_hulicheza.:KEEP_LI Wewe_huchezi.:TENSE Wewe_hutacheza.:TENSE', 'Wakati uliopita ukikanushwa, -li- huwa -ku-: ulicheza-hukucheza.'),
  W('NEG', 'Kanusha: "Juma atasafiri."', 'Juma hatasafiri.', 'Juma_hasafiri.:TENSE Juma_hakusafiri.:TENSE Juma_hanasafiri.:HA_ONLY', 'Wakati ujao ukikanushwa, -ta- hubaki: atasafiri-hatasafiri.'),
];
const NEG_ID = [
  W('NEG', 'Ni neno lipi limekanushwa?', 'hasomi', 'anasoma:NOT_NEG alisoma:NOT_NEG atasoma:NOT_NEG', '"Hasomi" lina ha- na linaonyesha kwamba hasomi. Maneno mengine hayakukanushwa.'),
  W('NEG', 'Ni neno lipi limekanushwa?', 'hakusoma', 'anasoma:NOT_NEG alisoma:NOT_NEG atasoma:NOT_NEG', '"Hakusoma" lina ha-ku- na linaonyesha kwamba hakusoma.'),
  W('NEG', 'Ni neno lipi limekanushwa?', 'hatapika', 'anapika:NOT_NEG alipika:NOT_NEG atapika:NOT_NEG', '"Hatapika" lina ha-ta- na linaonyesha kwamba hatapika.'),
  W('NEG', 'Ni neno lipi limekanushwa?', 'sisomi', 'ninasoma:NOT_NEG nilisoma:NOT_NEG nitasoma:NOT_NEG', '"Sisomi" lina si- na linaonyesha kwamba sisomi.'),
  W('NEG', 'Ni neno lipi limekanushwa?', 'hawaimbi', 'wanaimba:NOT_NEG waliimba:NOT_NEG wataimba:NOT_NEG', '"Hawaimbi" lina ha- na linaonyesha kwamba hawaimbi.'),
  W('NEG', 'Ni neno lipi limekanushwa?', 'hatucheza', 'tunacheza:NOT_NEG tulicheza:NOT_NEG tutacheza:NOT_NEG', '"Hatucheza" lina ha- na linaonyesha kwamba hatucheza.'),
];

// ---------------------------------------------------------------- ukubwa na udogo wa nomino za m-
const UKU = [
  W('UKU', 'Mti mkubwa sana huitwa ___.', 'jiti', 'kijiti:KI mti:SAME majiti:PL', 'Ukubwa wa mti ni jiti: m- hubadilika kuwa ji-.'),
  W('UKU', 'Mji mkubwa sana huitwa ___.', 'jiji', 'kijiji:KI mji:SAME majiji:PL', 'Ukubwa wa mji ni jiji.'),
  W('UKU', 'Mto mkubwa sana huitwa ___.', 'jito', 'kijito:KI mto:SAME majito:PL', 'Ukubwa wa mto ni jito.'),
  W('UKU', 'Mtu mkubwa sana huitwa ___.', 'jitu', 'kijitu:KI mtu:SAME majitu:PL', 'Ukubwa wa mtu ni jitu.'),
  W('UKU', 'Miti mikubwa sana huitwa ___.', 'majiti', 'vijiti:KI miti:SAME jiti:PL', 'Wingi wa jiti ni majiti: ma- huongezwa mbele.'),
  W('UKU', 'Miji mikubwa sana huitwa ___.', 'majiji', 'vijiji:KI miji:SAME jiji:PL', 'Wingi wa jiji ni majiji.'),
  W('UKU', 'Mito mikubwa sana huitwa ___.', 'majito', 'vijito:KI mito:SAME jito:PL', 'Wingi wa jito ni majito.'),
  W('UKU', 'Watu wakubwa sana huitwa ___.', 'majitu', 'vijitu:KI watu:SAME jitu:PL', 'Wingi wa jitu ni majitu.'),
];
const UKU_ID = [
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (kimoja)?', 'jiti', 'kijiti:KI mti:SAME miti:SAME', 'Jiti ni ukubwa wa mti: lina ji-. Kijiti ni udogo.'),
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (kimoja)?', 'jito', 'kijito:KI mto:SAME mito:SAME', 'Jito ni ukubwa wa mto: lina ji-.'),
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (kimoja)?', 'jiji', 'kijiji:KI mji:SAME miji:SAME', 'Jiji ni ukubwa wa mji: lina ji-.'),
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (kimoja)?', 'jitu', 'kijitu:KI mtu:SAME watu:SAME', 'Jitu ni ukubwa wa mtu: lina ji-.'),
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (wengi)?', 'majiti', 'vijiti:KI miti:SAME jiti:PL', 'Majiti ni wingi wa jiti: lina ma-.'),
  W('UKU', 'Ni neno lipi liko katika hali ya ukubwa (wengi)?', 'majiji', 'vijiji:KI miji:SAME jiji:PL', 'Majiji ni wingi wa jiji: lina ma-.'),
];
const UDO = [
  W('UDO', 'Mti mdogo sana huitwa ___.', 'kijiti', 'jiti:JI mti:SAME vijiti:PL', 'Udogo wa mti ni kijiti: m- hubadilika kuwa kiji-.'),
  W('UDO', 'Mji mdogo sana huitwa ___.', 'kijiji', 'jiji:JI mji:SAME vijiji:PL', 'Udogo wa mji ni kijiji.'),
  W('UDO', 'Mto mdogo sana huitwa ___.', 'kijito', 'jito:JI mto:SAME vijito:PL', 'Udogo wa mto ni kijito.'),
  W('UDO', 'Mtu mdogo sana huitwa ___.', 'kijitu', 'jitu:JI mtu:SAME vijitu:PL', 'Udogo wa mtu ni kijitu.'),
  W('UDO', 'Miti midogo sana huitwa ___.', 'vijiti', 'majiti:JI miti:SAME kijiti:PL', 'Wingi wa kijiti ni vijiti: ki- hubadilika kuwa vi-.'),
  W('UDO', 'Miji midogo sana huitwa ___.', 'vijiji', 'majiji:JI miji:SAME kijiji:PL', 'Wingi wa kijiji ni vijiji.'),
  W('UDO', 'Mito midogo sana huitwa ___.', 'vijito', 'majito:JI mito:SAME kijito:PL', 'Wingi wa kijito ni vijito.'),
  W('UDO', 'Watu wadogo sana huitwa ___.', 'vijitu', 'majitu:JI watu:SAME kijitu:PL', 'Wingi wa kijitu ni vijitu.'),
];
const UDO_ID = [
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (kimoja)?', 'kijiti', 'jiti:JI mti:SAME miti:SAME', 'Kijiti ni udogo wa mti: kina kiji-. Jiti ni ukubwa.'),
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (kimoja)?', 'kijito', 'jito:JI mto:SAME mito:SAME', 'Kijito ni udogo wa mto: kina kiji-.'),
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (kimoja)?', 'kijiji', 'jiji:JI mji:SAME miji:SAME', 'Kijiji ni udogo wa mji: kina kiji-.'),
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (kimoja)?', 'kijitu', 'jitu:JI mtu:SAME watu:SAME', 'Kijitu ni udogo wa mtu: kina kiji-.'),
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (vingi)?', 'vijiti', 'majiti:JI miti:SAME kijiti:PL', 'Vijiti ni wingi wa kijiti: kina vi-.'),
  W('UDO', 'Ni neno lipi liko katika hali ya udogo (vingi)?', 'vijiji', 'majiji:JI miji:SAME kijiji:PL', 'Vijiji ni wingi wa kijiji: kina vi-.'),
];

export const FAMILIES = [
  // ---- MNYAMBULIKO
  ...trio('mnyambuliko', 'SARUFI.T8_MNYAMBULIKO_WA_VITEN.MNYAMBULIKO', MNY, { stem: 'Chagua kitenzi kinachofaa.', gapStem: 'Andika kitenzi kinachokosekana:', oc: ['d', 'd', 'd'], topic: 'kuhusu kauli za vitenzi', thinOk: true, hints: H('Jiulize: kitendo kinafanyiwa mtu, au kitu ndicho kilichofanyiwa kitendo?', 'Mwisho wa kitenzi unabadilika: -ia au -ea kwa mtu, -wa kwa kitu.') }),
  ...trio('mnyambuliko.kauli', 'SARUFI.T8_MNYAMBULIKO_WA_VITEN.MNYAMBULIKO', KAULI, { stem: 'Chagua kauli sahihi.', gapStem: 'Andika kauli:', tag: 'kauli', oc: ['b', 'c', 'c'], topic: 'kuhusu kauli za vitenzi', thinOk: true, hints: H('Tazama mwisho wa kitenzi na anayefanyiwa kitendo.', 'Kauli tatu zinatofautiana kwa mwisho wa kitenzi.') }),
  // ---- VINYUME VYA NOMINO
  ...trio('vinyume.nomino', 'SARUFI.T9_VINYUME_VYA_NOMINO.VINYUME_NOMINO', VNOM, { stem: 'Chagua kinyume sahihi.', gapStem: 'Andika kinyume:', oc: ['c', 'c', 'c'], topic: 'kuhusu vinyume vya nomino', hints: H('Kinyume kina maana ya upande wa pili kabisa.', 'Neno lenye maana sawa si kinyume.') }),
  ...duo('vinyume.jozi', 'SARUFI.T9_VINYUME_VYA_NOMINO.VINYUME_NOMINO', VNOM_ID, { stem: 'Chagua jozi ya vinyume.', tag: 'jozi', oc: ['b', 'b'], topic: 'kuhusu vinyume vya nomino', hints: H('Jozi ya vinyume ina maneno yanayopingana kabisa.', 'Maneno yenye maana sawa, au yanayohusiana tu, si vinyume.') }),
  // ---- NYAKATI
  ...trio('nyakati', 'SARUFI.T10_NYAKATI_NA_HALI.NYAKATI', NYA, { stem: 'Chagua kiambishi kinachofaa.', gapStem: 'Andika kiambishi cha wakati:', oc: ['a', 'a', 'c'], topic: 'kuhusu nyakati', thinOk: true, hints: H('Soma neno la wakati kwenye sentensi: jana, sasa au kesho.', 'Kiambishi cha wakati kinakaa katikati ya kitenzi.') }),
  ...trio('nyakati.kitenzi', 'SARUFI.T10_NYAKATI_NA_HALI.NYAKATI', NYA_FULL, { stem: 'Chagua kitenzi sahihi.', gapStem: 'Andika kitenzi sahihi:', tag: 'kitenzi', oc: ['c', 'c', 'c'], topic: 'kuhusu nyakati', hints: H('Soma neno la wakati na ujue anayefanya ni nani.', 'Kitenzi kina kiambishi cha mtu, cha wakati, kisha mzizi.') }),
  ...one('nyakati.tambua', 'SARUFI.T10_NYAKATI_NA_HALI.NYAKATI', NYA_ID, { stem: 'Chagua wakati sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Tazama kiambishi cha wakati kilicho katikati ya kitenzi.', 'Uliopita, uliopo na ujao ni nyakati tatu.') }),
  // ---- UKANUSHAJI
  ...trio('ukanushaji', 'SARUFI.T11_UKANUSHAJI.UKANUSHAJI', NEG_GAP, { stem: 'Chagua kitenzi kilichokanushwa ipasavyo.', gapStem: 'Andika kitenzi kilichokanushwa:', oc: ['c', 'd', 'd'], topic: 'kuhusu ukanushaji', hints: H('Soma neno la wakati: kitenzi kikanushwe katika wakati huohuo.', 'Ukanushaji una ha- au si-, na kiambishi cha wakati kinabadilika.') }),
  ...duo('ukanushaji.sentensi', 'SARUFI.T11_UKANUSHAJI.UKANUSHAJI', NEG_SENT, { stem: 'Chagua sentensi iliyokanushwa ipasavyo.', tag: 'sentensi', oc: ['d', 'd'], topic: 'kuhusu ukanushaji', hints: H('Kanusha katika wakati ule ule wa sentensi ya kwanza.', 'Usiweke ha- mbele tu na kuacha kiambishi kama kilivyo.') }),
  ...one('ukanushaji.tambua', 'SARUFI.T11_UKANUSHAJI.UKANUSHAJI', NEG_ID, { stem: 'Chagua neno lililokanushwa.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Tafuta neno lenye ha- au si- mwanzoni.', 'Neno lililokanushwa linasema kwamba kitendo hakifanyiki.') }),
  // ---- UKUBWA
  ...trio('ukubwa', 'SARUFI.T11_UKUBWA_WA_NOMINO.UKUBWA', UKU, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno la ukubwa:', oc: ['b', 'd', 'e'], topic: 'kuhusu ukubwa wa nomino', hints: H('Ukubwa wa nomino za m- hutumia kiambishi kinachoanza na j.', 'Kitu kimoja kina umbo moja, vingi vina umbo jingine.') }),
  ...one('ukubwa.tambua', 'SARUFI.T11_UKUBWA_WA_NOMINO.UKUBWA', UKU_ID, { stem: 'Chagua jibu sahihi.', oc: 'c', tag: 'tambua', rung: 1, hints: H('Kiambishi cha ukubwa huanza na j.', 'Neno la kawaida halionyeshi ukubwa.') }),
  // ---- UDOGO
  ...trio('udogo', 'SARUFI.T11_UDOGO_WA_NOMINO.UDOGO', UDO, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno la udogo:', oc: ['b', 'd', 'e'], topic: 'kuhusu udogo wa nomino', hints: H('Udogo wa nomino za m- hutumia kiambishi kinachoanza na k.', 'Kitu kimoja kina umbo moja, vingi vina umbo jingine.') }),
  ...one('udogo.tambua', 'SARUFI.T11_UDOGO_WA_NOMINO.UDOGO', UDO_ID, { stem: 'Chagua jibu sahihi.', oc: 'c', tag: 'tambua', rung: 1, hints: H('Kiambishi cha udogo huanza na k kwa kimoja na v kwa vingi.', 'Neno la kawaida halionyeshi udogo.') }),
];
