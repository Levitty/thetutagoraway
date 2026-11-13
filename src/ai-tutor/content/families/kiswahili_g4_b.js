// ============================================================================
// KISWAHILI GRADE 4, SARUFI: NGELI (Themes 4 to 7): A-WA, U-I, LI-YA, KI-VI, LI-LI. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Every wrong answer names the library misconception behind it (curriculum/kiswahili/g4.json, codes M4_...).
// Nouns follow the examples in the KICD design where it gives them (jua and giza for LI-LI). LI-LI has only two nouns:
// the reviewer is asked for more. A native Kiswahili speaker must check every item: docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];
// C(prefixOfCodes, text, right, 'wrong:CODE wrong:CODE wrong:CODE', because) -> an item
const C = (pre, text, right, ws, because) => [text, right, ...ws.split(' ').map(w => { const [t, c] = w.split(':'); return [t, `M4_${pre}_${c}`]; }), because];
// N(pre, noun question, right, [wrong nouns], code, because)
const N = (pre, q, right, wrongs, code, because) => [q, right, ...wrongs.map(w => [w, `M4_${pre}_${code}`]), because];

// ---------------------------------------------------------------- A-WA
const AWA = [
  C('AWA', 'Mtoto mmoja ___naimba.', 'a', 'wa:PL ki:ANIMAL u:ANIMAL', 'Mtoto mmoja ni umoja, kwa hiyo kiambishi ni a-: anaimba.'),
  C('AWA', 'Watoto wawili ___naimba.', 'wa', 'a:PL vi:ANIMAL i:ANIMAL', 'Watoto ni wengi, kwa hiyo kiambishi ni wa-: wanaimba.'),
  C('AWA', 'Mwalimu wetu ___nafundisha.', 'a', 'wa:PL u:ANIMAL li:ANIMAL', 'Mwalimu ni mmoja, kwa hiyo kiambishi ni a-: anafundisha.'),
  C('AWA', 'Walimu wetu ___nafundisha.', 'wa', 'a:PL vi:ANIMAL zi:ANIMAL', 'Walimu ni wengi, kwa hiyo kiambishi ni wa-: wanafundisha.'),
  C('AWA', 'Paka mmoja ___meruka ukutani.', 'a', 'i:ANIMAL wa:PL ki:ANIMAL', 'Paka ni mnyama, na wanyama wako A-WA. Mmoja hutumia a-: ameruka.'),
  C('AWA', 'Ndege watatu ___meruka juu.', 'wa', 'a:PL zi:ANIMAL vi:ANIMAL', 'Ndege ni wanyama, na wanyama wako A-WA. Watatu hutumia wa-: wameruka.'),
  C('AWA', 'Mama yangu ___napika.', 'a', 'wa:PL u:ANIMAL i:ANIMAL', 'Mama ni mmoja, kwa hiyo kiambishi ni a-: anapika.'),
  C('AWA', 'Wazazi wangu ___napika.', 'wa', 'a:PL i:ANIMAL u:ANIMAL', 'Wazazi ni wengi, kwa hiyo kiambishi ni wa-: wanapika.'),
];
const AWA_ID = [
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'mwalimu', ['kitabu', 'mti', 'jiwe'], 'NOT', 'Mwalimu ni mtu, kwa hiyo yuko A-WA. Kitabu, mti na jiwe ni vitu.'),
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'paka', ['kiti', 'mlango', 'tunda'], 'NOT', 'Paka ni mnyama, kwa hiyo yuko A-WA. Kiti, mlango na tunda ni vitu.'),
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'ndege', ['kikombe', 'mwiko', 'embe'], 'NOT', 'Ndege ni mnyama, kwa hiyo yuko A-WA. Vingine ni vitu.'),
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'mama', ['mkoba', 'kisu', 'dirisha'], 'NOT', 'Mama ni mtu, kwa hiyo yuko A-WA. Vingine ni vitu.'),
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'mkulima', ['mkono', 'kiatu', 'jicho'], 'NOT', 'Mkulima ni mtu, kwa hiyo yuko A-WA. Vingine ni sehemu za mwili au vitu.'),
  N('AWA', 'Ni nomino ipi ni ya ngeli ya A-WA?', 'mbwa', ['mkate', 'kiazi', 'jino'], 'NOT', 'Mbwa ni mnyama, kwa hiyo yuko A-WA. Vingine ni vitu.'),
];
const AWA_PL = [
  N('AWA', 'Mtoto mmoja, ___ wawili.', 'watoto', ['vitoto', 'mitoto', 'mtoto'], 'PLNOUN', 'Wingi wa mtoto ni watoto: m- hubadilika kuwa wa-.'),
  N('AWA', 'Mwalimu mmoja, ___ wawili.', 'walimu', ['vilimu', 'milimu', 'mwalimu'], 'PLNOUN', 'Wingi wa mwalimu ni walimu: mw- hubadilika kuwa wa-.'),
  N('AWA', 'Mkulima mmoja, ___ wawili.', 'wakulima', ['vikulima', 'mikulima', 'mkulima'], 'PLNOUN', 'Wingi wa mkulima ni wakulima: m- hubadilika kuwa wa-.'),
  N('AWA', 'Mwanafunzi mmoja, ___ wawili.', 'wanafunzi', ['vifunzi', 'mifunzi', 'mwanafunzi'], 'PLNOUN', 'Wingi wa mwanafunzi ni wanafunzi: mw- hubadilika kuwa wa-.'),
  N('AWA', 'Mgeni mmoja, ___ wawili.', 'wageni', ['vigeni', 'migeni', 'mgeni'], 'PLNOUN', 'Wingi wa mgeni ni wageni: m- hubadilika kuwa wa-.'),
  N('AWA', 'Mvulana mmoja, ___ wawili.', 'wavulana', ['vivulana', 'mivulana', 'mvulana'], 'PLNOUN', 'Wingi wa mvulana ni wavulana: m- hubadilika kuwa wa-.'),
];

// ---------------------------------------------------------------- U-I
const UI = [
  C('UI', 'Mti mmoja ___meanguka.', 'u', 'i:SG_I a:PEOPLE wa:PEOPLE', 'Mti ni wa ngeli ya U-I. Mmoja hutumia u-: umeanguka.'),
  C('UI', 'Miti miwili ___meanguka.', 'i', 'u:PL_U wa:PEOPLE a:PEOPLE', 'Miti ni mingi. Wingi wa U-I hutumia i-: imeanguka.'),
  C('UI', 'Mlango mmoja ___mefunguka.', 'u', 'i:SG_I a:PEOPLE wa:PEOPLE', 'Mlango ni wa ngeli ya U-I. Mmoja hutumia u-: umefunguka.'),
  C('UI', 'Milango yote ___mefunguka.', 'i', 'u:PL_U wa:PEOPLE a:PEOPLE', 'Milango ni mingi. Wingi wa U-I hutumia i-: imefunguka.'),
  C('UI', 'Mkono wangu ___naumia.', 'u', 'i:SG_I a:PEOPLE wa:PEOPLE', 'Mkono ni wa ngeli ya U-I. Mmoja hutumia u-: unaumia.'),
  C('UI', 'Mikono yangu ___naumia.', 'i', 'u:PL_U wa:PEOPLE a:PEOPLE', 'Mikono ni mingi. Wingi wa U-I hutumia i-: inaumia.'),
  C('UI', 'Mkoba mpya ___meraruka.', 'u', 'i:SG_I a:PEOPLE wa:PEOPLE', 'Mkoba ni wa ngeli ya U-I. Mmoja hutumia u-: umeraruka.'),
  C('UI', 'Mikoba mipya ___meraruka.', 'i', 'u:PL_U wa:PEOPLE a:PEOPLE', 'Mikoba ni mingi. Wingi wa U-I hutumia i-: imeraruka.'),
];
const UI_ID = [
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mti', ['mtoto', 'kitabu', 'jiwe'], 'NOT', 'Mti ni kitu, na wingi wake ni miti: uko U-I. Mtoto yuko A-WA.'),
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mlango', ['mwalimu', 'kiti', 'tunda'], 'NOT', 'Mlango ni kitu, na wingi wake ni milango: uko U-I. Mwalimu yuko A-WA.'),
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mkono', ['mgeni', 'kikombe', 'embe'], 'NOT', 'Mkono una wingi mikono: uko U-I. Mgeni ni mtu, yuko A-WA.'),
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mkoba', ['mkulima', 'kisu', 'jicho'], 'NOT', 'Mkoba una wingi mikoba: uko U-I. Mkulima ni mtu, yuko A-WA.'),
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mwiko', ['mvulana', 'kiatu', 'dirisha'], 'NOT', 'Mwiko una wingi miiko: uko U-I. Mvulana ni mtu, yuko A-WA.'),
  N('UI', 'Ni nomino ipi ni ya ngeli ya U-I?', 'mguu', ['mzee', 'kijiko', 'jina'], 'NOT', 'Mguu una wingi miguu: uko U-I. Mzee ni mtu, yuko A-WA.'),
];
const UI_PL = [
  N('UI', 'Mti mmoja, ___ miwili.', 'miti', ['mamti', 'wamti', 'mti'], 'PLNOUN', 'Wingi wa mti ni miti: m- hubadilika kuwa mi-.'),
  N('UI', 'Mlango mmoja, ___ miwili.', 'milango', ['mamlango', 'wamlango', 'mlango'], 'PLNOUN', 'Wingi wa mlango ni milango: m- hubadilika kuwa mi-.'),
  N('UI', 'Mkono mmoja, ___ miwili.', 'mikono', ['mamkono', 'wamkono', 'mkono'], 'PLNOUN', 'Wingi wa mkono ni mikono: m- hubadilika kuwa mi-.'),
  N('UI', 'Mkoba mmoja, ___ miwili.', 'mikoba', ['mamkoba', 'wamkoba', 'mkoba'], 'PLNOUN', 'Wingi wa mkoba ni mikoba: m- hubadilika kuwa mi-.'),
  N('UI', 'Mwiko mmoja, ___ miwili.', 'miiko', ['mawiko', 'wawiko', 'mwiko'], 'PLNOUN', 'Wingi wa mwiko ni miiko: mw- hubadilika kuwa mi-.'),
  N('UI', 'Mguu mmoja, ___ miwili.', 'miguu', ['mamguu', 'wamguu', 'mguu'], 'PLNOUN', 'Wingi wa mguu ni miguu: m- hubadilika kuwa mi-.'),
];

// ---------------------------------------------------------------- LI-YA
const LIYA = [
  C('LIYA', 'Jiwe moja ___meanguka.', 'li', 'ya:SG_YA ki:OTHER u:OTHER', 'Jiwe ni la ngeli ya LI-YA. Moja hutumia li-: limeanguka.'),
  C('LIYA', 'Mawe mawili ___meanguka.', 'ya', 'li:PL_LI ki:OTHER i:OTHER', 'Mawe ni mengi. Wingi wa LI-YA hutumia ya-: yameanguka.'),
  C('LIYA', 'Jicho langu ___naumia.', 'li', 'ya:SG_YA ki:OTHER u:OTHER', 'Jicho ni la ngeli ya LI-YA. Moja hutumia li-: linaumia.'),
  C('LIYA', 'Macho yangu ___naumia.', 'ya', 'li:PL_LI ki:OTHER i:OTHER', 'Macho ni mengi. Wingi wa LI-YA hutumia ya-: yanaumia.'),
  C('LIYA', 'Tunda hili ___meiva.', 'li', 'ya:SG_YA ki:OTHER u:OTHER', 'Tunda ni la ngeli ya LI-YA. Moja hutumia li-: limeiva.'),
  C('LIYA', 'Matunda haya ___meiva.', 'ya', 'li:PL_LI ki:OTHER i:OTHER', 'Matunda ni mengi. Wingi wa LI-YA hutumia ya-: yameiva.'),
  C('LIYA', 'Dirisha moja ___mefunguka.', 'li', 'ya:SG_YA ki:OTHER u:OTHER', 'Dirisha ni la ngeli ya LI-YA. Moja hutumia li-: limefunguka.'),
  C('LIYA', 'Madirisha yote ___mefunguka.', 'ya', 'li:PL_LI ki:OTHER i:OTHER', 'Madirisha ni mengi. Wingi wa LI-YA hutumia ya-: yamefunguka.'),
];
const LIYA_ID = [
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'jiwe', ['kiti', 'mti', 'mtoto'], 'NOT', 'Jiwe lina wingi mawe: liko LI-YA. Kiti kina wingi viti: kiko KI-VI.'),
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'jicho', ['kikombe', 'mkono', 'mwalimu'], 'NOT', 'Jicho lina wingi macho: liko LI-YA.'),
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'tunda', ['kitabu', 'mlango', 'mgeni'], 'NOT', 'Tunda lina wingi matunda: liko LI-YA.'),
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'embe', ['kisu', 'mkoba', 'mkulima'], 'NOT', 'Embe lina wingi maembe: liko LI-YA.'),
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'dirisha', ['kiatu', 'mwiko', 'mvulana'], 'NOT', 'Dirisha lina wingi madirisha: liko LI-YA.'),
  N('LIYA', 'Ni nomino ipi ni ya ngeli ya LI-YA?', 'jina', ['kijiko', 'mguu', 'mzee'], 'NOT', 'Jina lina wingi majina: liko LI-YA.'),
];
const LIYA_PL = [
  N('LIYA', 'Jiwe moja, ___ matatu.', 'mawe', ['majiwe', 'viwe', 'jiwe'], 'PLNOUN', 'Wingi wa jiwe ni mawe: ji- hubadilika kuwa ma-.'),
  N('LIYA', 'Jicho moja, ___ mawili.', 'macho', ['majicho', 'vicho', 'jicho'], 'PLNOUN', 'Wingi wa jicho ni macho: ji- hubadilika kuwa ma-.'),
  N('LIYA', 'Tunda moja, ___ mengi.', 'matunda', ['watunda', 'vitunda', 'tunda'], 'PLNOUN', 'Wingi wa tunda ni matunda: ma- huongezwa mbele.'),
  N('LIYA', 'Embe moja, ___ matano.', 'maembe', ['viembe', 'miembe', 'embe'], 'PLNOUN', 'Wingi wa embe ni maembe: ma- huongezwa mbele.'),
  N('LIYA', 'Dirisha moja, ___ manne.', 'madirisha', ['vidirisha', 'midirisha', 'dirisha'], 'PLNOUN', 'Wingi wa dirisha ni madirisha: ma- huongezwa mbele.'),
  N('LIYA', 'Jina moja, ___ mawili.', 'majina', ['vijina', 'mijina', 'jina'], 'PLNOUN', 'Wingi wa jina ni majina: ji- hubaki na ma- huongezwa mbele.'),
];

// ---------------------------------------------------------------- KI-VI
const KIVI = [
  C('KIVI', 'Kiti kimoja ___meanguka.', 'ki', 'vi:SG_VI u:OTHER li:OTHER', 'Kiti ni cha ngeli ya KI-VI. Kimoja hutumia ki-: kimeanguka.'),
  C('KIVI', 'Viti viwili ___meanguka.', 'vi', 'ki:PL_KI i:OTHER ya:OTHER', 'Viti ni vingi. Wingi wa KI-VI hutumia vi-: vimeanguka.'),
  C('KIVI', 'Kitabu changu ___meraruka.', 'ki', 'vi:SG_VI li:OTHER u:OTHER', 'Kitabu ni cha ngeli ya KI-VI. Kimoja hutumia ki-: kimeraruka.'),
  C('KIVI', 'Vitabu vyangu ___meraruka.', 'vi', 'ki:PL_KI ya:OTHER i:OTHER', 'Vitabu ni vingi. Wingi wa KI-VI hutumia vi-: vimeraruka.'),
  C('KIVI', 'Kikombe kimoja ___mevunjika.', 'ki', 'vi:SG_VI ya:OTHER i:OTHER', 'Kikombe ni cha ngeli ya KI-VI. Kimoja hutumia ki-: kimevunjika.'),
  C('KIVI', 'Vikombe viwili ___mevunjika.', 'vi', 'ki:PL_KI ya:OTHER i:OTHER', 'Vikombe ni vingi. Wingi wa KI-VI hutumia vi-: vimevunjika.'),
  C('KIVI', 'Kisu hiki ___nakata vizuri.', 'ki', 'vi:SG_VI u:OTHER li:OTHER', 'Kisu ni cha ngeli ya KI-VI. Kimoja hutumia ki-: kinakata.'),
  C('KIVI', 'Visu hivi ___nakata vizuri.', 'vi', 'ki:PL_KI ya:OTHER i:OTHER', 'Visu ni vingi. Wingi wa KI-VI hutumia vi-: vinakata.'),
];
const KIVI_ID = [
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kitabu', ['mti', 'jiwe', 'mtoto'], 'NOT', 'Kitabu kina wingi vitabu: kiko KI-VI. Mti uko U-I na jiwe liko LI-YA.'),
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kikombe', ['mkono', 'jicho', 'mwalimu'], 'NOT', 'Kikombe kina wingi vikombe: kiko KI-VI.'),
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kisu', ['mlango', 'tunda', 'mgeni'], 'NOT', 'Kisu kina wingi visu: kiko KI-VI.'),
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kiatu', ['mkoba', 'embe', 'mkulima'], 'NOT', 'Kiatu kina wingi viatu: kiko KI-VI.'),
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kijiko', ['mwiko', 'dirisha', 'mvulana'], 'NOT', 'Kijiko kina wingi vijiko: kiko KI-VI.'),
  N('KIVI', 'Ni nomino ipi ni ya ngeli ya KI-VI?', 'kiti', ['mguu', 'jina', 'mzee'], 'NOT', 'Kiti kina wingi viti: kiko KI-VI.'),
];
const KIVI_PL = [
  N('KIVI', 'Kitabu kimoja, ___ viwili.', 'vitabu', ['vikitabu', 'mitabu', 'kitabu'], 'PLNOUN', 'Wingi wa kitabu ni vitabu: ki- hubadilika kuwa vi-.'),
  N('KIVI', 'Kiti kimoja, ___ vinne.', 'viti', ['vikiti', 'miti', 'kiti'], 'PLNOUN', 'Wingi wa kiti ni viti: ki- hubadilika kuwa vi-.'),
  N('KIVI', 'Kikombe kimoja, ___ vitatu.', 'vikombe', ['vikikombe', 'mikombe', 'kikombe'], 'PLNOUN', 'Wingi wa kikombe ni vikombe: ki- hubadilika kuwa vi-.'),
  N('KIVI', 'Kisu kimoja, ___ viwili.', 'visu', ['vikisu', 'misu', 'kisu'], 'PLNOUN', 'Wingi wa kisu ni visu: ki- hubadilika kuwa vi-.'),
  N('KIVI', 'Kiatu kimoja, ___ viwili.', 'viatu', ['vikiatu', 'miatu', 'kiatu'], 'PLNOUN', 'Wingi wa kiatu ni viatu: ki- hubadilika kuwa vi-.'),
  N('KIVI', 'Kijiko kimoja, ___ vitano.', 'vijiko', ['vikijiko', 'mijiko', 'kijiko'], 'PLNOUN', 'Wingi wa kijiko ni vijiko: ki- hubadilika kuwa vi-.'),
];

// ---------------------------------------------------------------- LI-LI (the design names jua and giza)
const LILI = [
  C('LILI', 'Jua ___metoka asubuhi.', 'li', 'ya:YA u:OTHER i:OTHER', 'Jua ni la ngeli ya LI-LI: kiambishi ni li-. Limetoka.'),
  C('LILI', 'Jua ___likuwa kali sana jana.', 'li', 'ya:YA u:OTHER i:OTHER', 'Jua ni la ngeli ya LI-LI: kiambishi ni li-. Lilikuwa kali.'),
  C('LILI', 'Giza ___meingia haraka.', 'li', 'ya:YA u:OTHER i:OTHER', 'Giza ni la ngeli ya LI-LI: kiambishi ni li-. Limeingia.'),
  C('LILI', 'Giza ___natisha watoto wadogo.', 'li', 'ya:YA u:OTHER i:OTHER', 'Giza ni la ngeli ya LI-LI: kiambishi ni li-. Linatisha.'),
  C('LILI', 'Jua ___natoa joto jingi.', 'li', 'ya:YA u:OTHER i:OTHER', 'Jua ni la ngeli ya LI-LI: kiambishi ni li-. Linatoa joto.'),
  C('LILI', 'Jua ___metua jioni.', 'li', 'ya:YA u:OTHER i:OTHER', 'Jua ni la ngeli ya LI-LI: kiambishi ni li-. Limetua.'),
  C('LILI', 'Giza ___metanda kijijini.', 'li', 'ya:YA u:OTHER i:OTHER', 'Giza ni la ngeli ya LI-LI: kiambishi ni li-. Limetanda.'),
];
const LILI_ID = [
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'jua', ['mtoto', 'kitabu', 'mlango'], 'NOT', 'Jua ni la LI-LI: jua limetoka. Mtoto yuko A-WA na kitabu kiko KI-VI.'),
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'giza', ['paka', 'kiti', 'mkono'], 'NOT', 'Giza ni la LI-LI: giza limeingia. Paka yuko A-WA.'),
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'jua', ['mwalimu', 'kisu', 'mti'], 'NOT', 'Jua ni la LI-LI. Mwalimu yuko A-WA, kisu kiko KI-VI na mti uko U-I.'),
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'giza', ['ndege', 'kikombe', 'mguu'], 'NOT', 'Giza ni la LI-LI. Ndege yuko A-WA, kikombe kiko KI-VI na mguu uko U-I.'),
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'jua', ['mkulima', 'kiatu', 'mkoba'], 'NOT', 'Jua ni la LI-LI. Mkulima yuko A-WA, kiatu kiko KI-VI na mkoba uko U-I.'),
  N('LILI', 'Ni nomino ipi ni ya ngeli ya LI-LI?', 'giza', ['mgeni', 'kijiko', 'mwiko'], 'NOT', 'Giza ni la LI-LI. Mgeni yuko A-WA, kijiko kiko KI-VI na mwiko uko U-I.'),
];

const CG = 'Andika kiambishi kinachokosekana:';
const CS = 'Chagua kiambishi kinachokosekana.';
export const FAMILIES = [
  // ---- A-WA
  ...trio('awa.upatanisho', 'SARUFI.T4_NGELI_YA_A_WA.A_WA', AWA, { stem: CS, gapStem: CG, oc: ['a', 'a', 'c'], topic: 'kuhusu ngeli ya A-WA', hints: H('Hesabu: mmoja au wengi?', 'Watu na wanyama wako katika ngeli moja.') }),
  ...one('awa.nomino', 'SARUFI.T4_NGELI_YA_A_WA.A_WA', AWA_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'nomino', rung: 1, hints: H('Je, ni mtu au mnyama?', 'Vitu havimo katika ngeli hii.') }),
  ...trio('awa.wingi', 'SARUFI.T4_NGELI_YA_A_WA.A_WA', AWA_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi wa nomino:', tag: 'wingi', oc: ['c', 'c', 'c'], topic: 'kuhusu wingi wa nomino za A-WA', hints: H('Nomino za watu zina wingi unaoanza na kiambishi kimoja.', 'Kiambishi cha mwanzo kinabadilika, mzizi unabaki.') }),
  // ---- U-I
  ...trio('ui.upatanisho', 'SARUFI.T5_NGELI_YA_U_I.U_I', UI, { stem: CS, gapStem: CG, oc: ['a', 'a', 'c'], topic: 'kuhusu ngeli ya U-I', hints: H('Hesabu: kimoja au vingi?', 'Mti na mlango ni vitu, si watu.') }),
  ...one('ui.nomino', 'SARUFI.T5_NGELI_YA_U_I.U_I', UI_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'nomino', rung: 1, hints: H('Je, ni mtu au mnyama? Basi hayuko hapa.', 'Nomino za ngeli hii zina wingi unaoanza na mi-.') }),
  ...trio('ui.wingi', 'SARUFI.T5_NGELI_YA_U_I.U_I', UI_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi wa nomino:', tag: 'wingi', oc: ['c', 'c', 'c'], topic: 'kuhusu wingi wa nomino za U-I', hints: H('Nomino za ngeli hii hupata kiambishi kimoja katika wingi.', 'Nomino za ngeli hii hupata mi- katika wingi.') }),
  // ---- LI-YA
  ...trio('liya.upatanisho', 'SARUFI.T6_NGELI_YA_LI_YA.LI_YA', LIYA, { stem: CS, gapStem: CG, oc: ['a', 'a', 'c'], topic: 'kuhusu ngeli ya LI-YA', hints: H('Hesabu: kimoja au vingi?', 'Wingi wa nomino hizi huanza na ma-.') }),
  ...one('liya.nomino', 'SARUFI.T6_NGELI_YA_LI_YA.LI_YA', LIYA_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'nomino', rung: 1, hints: H('Fikiria wingi wa nomino: unaanza na ma-?', 'Nomino za ngeli nyingine zina wingi tofauti.') }),
  ...trio('liya.wingi', 'SARUFI.T6_NGELI_YA_LI_YA.LI_YA', LIYA_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi wa nomino:', tag: 'wingi', oc: ['c', 'c', 'c'], topic: 'kuhusu wingi wa nomino za LI-YA', hints: H('Wingi wa nomino hizi huanza na ma-.', 'Nomino zinazoanza na ji- hupoteza ji- katika wingi, nyingine hubaki nazo.') }),
  // ---- KI-VI
  ...trio('kivi.upatanisho', 'SARUFI.T7_NGELI_YA_KI_VI.KI_VI', KIVI, { stem: CS, gapStem: CG, oc: ['a', 'a', 'c'], topic: 'kuhusu ngeli ya KI-VI', hints: H('Hesabu: kimoja au vingi?', 'Nomino hizi huanza na ki- au vi-.') }),
  ...one('kivi.nomino', 'SARUFI.T7_NGELI_YA_KI_VI.KI_VI', KIVI_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'nomino', rung: 1, hints: H('Nomino za ngeli hii huanza na ki- na wingi wake huanza na vi-.', 'Mti, jiwe na mtoto huanza na herufi nyingine.') }),
  ...trio('kivi.wingi', 'SARUFI.T7_NGELI_YA_KI_VI.KI_VI', KIVI_PL, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika wingi wa nomino:', tag: 'wingi', oc: ['c', 'c', 'c'], topic: 'kuhusu wingi wa nomino za KI-VI', hints: H('Ki- hubadilishwa na kiambishi kingine katika wingi.', 'Kiambishi hakiongezwi mbele ya kile cha kwanza: kinakibadilisha.') }),
  // ---- LI-LI
  ...trio('lili.upatanisho', 'SARUFI.T7_NGELI_YA_LI_LI.LI_LI', LILI, { stem: CS, gapStem: CG, oc: ['a', 'a', 'c'], topic: 'kuhusu ngeli ya LI-LI', thinOk: true, hints: H('Jua na giza haviongezi kiambishi katika nomino yenyewe.', 'Soma kitenzi kinachofuata.') }),
  ...one('lili.nomino', 'SARUFI.T7_NGELI_YA_LI_LI.LI_LI', LILI_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'nomino', rung: 1, hints: H('Kumbuka mifano miwili ya ngeli hii.', 'Nomino za watu, vitu na miti ziko katika ngeli nyingine.') }),
];
