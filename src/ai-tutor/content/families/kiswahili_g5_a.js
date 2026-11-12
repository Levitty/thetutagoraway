// ============================================================================
// KISWAHILI GRADE 5, SARUFI: AINA ZA NOMINO (Themes 1 to 3) and UAKIFISHI. DRAFT families, all off for children.
// Written offline by Claude (12 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Every wrong answer names the library misconception behind it (curriculum/kiswahili/g5.json).
// A native Kiswahili speaker must check every item: docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { trio, duo, STEM } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- nomino za pekee
const PEKEE = [
  ['Mto ___ ni mrefu kuliko mito yote nchini Kenya.', 'Tana', ['maji', 'M_PEKEE_GENERAL'], ['nchi', 'M_PEKEE_GENERAL'], ['mvuvi', 'M_PEKEE_ROLE'], 'Mto huu una jina lake maalum: Tana. Jina maalum la mahali ni nomino ya pekee.'],
  ['Mwalimu mkuu wa shule yetu anaitwa ___.', 'Kamau', ['mwalimu', 'M_PEKEE_ROLE'], ['mtu', 'M_PEKEE_GENERAL'], ['shule', 'M_PEKEE_GENERAL'], 'Kamau ni jina la mtu mmoja. Mwalimu ni cheo, na watu wengi wanaweza kuwa walimu.'],
  ['Tulisafiri hadi ___ kwa basi la asubuhi.', 'Kisumu', ['mji', 'M_PEKEE_GENERAL'], ['nchi', 'M_PEKEE_GENERAL'], ['daktari', 'M_PEKEE_ROLE'], 'Kisumu ni jina maalum la mji mmoja, kwa hiyo ni nomino ya pekee.'],
  ['Mwalimu alimpa ___ kitabu darasani.', 'Wanjiru', ['Mwalimu', 'M_PEKEE_START'], ['mwanafunzi', 'M_PEKEE_GENERAL'], ['darasa', 'M_PEKEE_GENERAL'], 'Wanjiru ni jina la mtu mmoja. Neno la kwanza la sentensi huanza kwa herufi kubwa kila wakati, hata likiwa nomino ya kawaida.'],
  ['Mwezi wa ___ huja baada ya Julai.', 'Agosti', ['mwezi', 'M_PEKEE_GENERAL'], ['wiki', 'M_PEKEE_GENERAL'], ['mwaka', 'M_PEKEE_GENERAL'], 'Agosti ni jina maalum la mwezi mmoja. Majina ya miezi ni nomino za pekee.'],
  ['Mlima ___ ndio mrefu zaidi nchini Kenya.', 'Kenya', ['mlima', 'M_PEKEE_GENERAL'], ['kilele', 'M_PEKEE_GENERAL'], ['nchi', 'M_PEKEE_GENERAL'], 'Mlima Kenya ni jina maalum la mlima mmoja. Mlima ni nomino ya kawaida.'],
  ['Daktari ___ alituhudumia hospitalini.', 'Otieno', ['daktari', 'M_PEKEE_ROLE'], ['mgonjwa', 'M_PEKEE_GENERAL'], ['hospitali', 'M_PEKEE_GENERAL'], 'Otieno ni jina la mtu. Daktari ni kazi anayofanya.'],
  ['Familia yetu iliogelea katika ziwa ___ wikendi.', 'Victoria', ['ziwa', 'M_PEKEE_GENERAL'], ['maji', 'M_PEKEE_GENERAL'], ['samaki', 'M_PEKEE_GENERAL'], 'Victoria ni jina maalum la ziwa moja, kwa hiyo ni nomino ya pekee.'],
];
const PEKEE_ID = [
  ['Ni nomino ipi ya pekee katika sentensi hii: "Mwalimu alimpa Wanjiru kitabu."', 'Wanjiru', ['Mwalimu', 'M_PEKEE_START'], ['kitabu', 'M_PEKEE_GENERAL'], 'Wanjiru ni jina la mtu. Mwalimu huanza kwa herufi kubwa kwa sababu ni neno la kwanza la sentensi.'],
  ['Ni nomino ipi ya pekee katika sentensi hii: "Mkulima alisafiri hadi Nakuru."', 'Nakuru', ['Mkulima', 'M_PEKEE_START'], ['safari', 'M_PEKEE_GENERAL'], 'Nakuru ni jina maalum la mji. Mkulima ni kazi.'],
  ['Ni nomino ipi ya pekee katika sentensi hii: "Mvulana alivuka mto Nzoia."', 'Nzoia', ['Mvulana', 'M_PEKEE_START'], ['mto', 'M_PEKEE_GENERAL'], 'Nzoia ni jina la mto mmoja. Mto ni jina la jumla la mito yote.'],
  ['Ni nomino ipi ya pekee katika sentensi hii: "Daktari alimwona Achieng jana."', 'Achieng', ['Daktari', 'M_PEKEE_ROLE'], ['jana', 'M_PEKEE_GENERAL'], 'Achieng ni jina la mtu mmoja. Daktari ni cheo.'],
  ['Ni nomino ipi ya pekee katika sentensi hii: "Msichana alicheza Mombasa wiki jana."', 'Mombasa', ['Msichana', 'M_PEKEE_START'], ['wiki', 'M_PEKEE_GENERAL'], 'Mombasa ni jina maalum la mji.'],
  ['Ni nomino ipi ya pekee katika sentensi hii: "Mama alimpigia simu Hassan."', 'Hassan', ['Mama', 'M_PEKEE_START'], ['simu', 'M_PEKEE_GENERAL'], 'Hassan ni jina la mtu mmoja. Mama ni nomino ya kawaida hapa.'],
];

// ---------------------------------------------------------------- nomino za kawaida
const KAWAIDA = [
  ['Juma alienda Mombasa kwa ___.', 'basi', ['Kamau', 'M_KAWAIDA_NAME'], ['Nairobi', 'M_KAWAIDA_NAME'], ['alienda', 'M_KAWAIDA_NOT_NOUN'], 'Basi ni jina la jumla la aina ya gari, si jina la pekee.'],
  ['Mtoto mdogo alikunywa ___ asubuhi.', 'maziwa', ['Wanjiru', 'M_KAWAIDA_NAME'], ['alikunywa', 'M_KAWAIDA_NOT_NOUN'], ['mdogo', 'M_KAWAIDA_NOT_NOUN'], 'Maziwa ni jina la jumla la kinywaji. Si jina la mtu wala la mahali.'],
  ['Wanjiru ana ___ nyekundu mpya.', 'kalamu', ['Otieno', 'M_KAWAIDA_NAME'], ['nyekundu', 'M_KAWAIDA_NOT_NOUN'], ['ana', 'M_KAWAIDA_NOT_NOUN'], 'Kalamu ni nomino ya kawaida: jina la aina ya kitu.'],
  ['Kuku walikuwa wanakula ___ uani.', 'mahindi', ['Kisumu', 'M_KAWAIDA_NAME'], ['wanakula', 'M_KAWAIDA_NOT_NOUN'], ['wengi', 'M_KAWAIDA_NOT_NOUN'], 'Mahindi ni nomino ya kawaida: jina la aina ya chakula.'],
  ['Baba alinunua ___ kubwa sokoni.', 'sufuria', ['Hassan', 'M_KAWAIDA_NAME'], ['alinunua', 'M_KAWAIDA_NOT_NOUN'], ['kubwa', 'M_KAWAIDA_NOT_NOUN'], 'Sufuria ni jina la jumla la aina ya chombo cha kupikia.'],
  ['___ wetu hufundisha Kiswahili.', 'Mwalimu', ['Atieno', 'M_KAWAIDA_NAME'], ['hufundisha', 'M_KAWAIDA_NOT_NOUN'], ['vizuri', 'M_KAWAIDA_NOT_NOUN'], 'Mwalimu ni nomino ya kawaida: jina la jumla la watu wanaofundisha.'],
  ['Tulikaa chini ya ___ kubwa wakati wa mapumziko.', 'mti', ['Nyeri', 'M_KAWAIDA_NAME'], ['tulikaa', 'M_KAWAIDA_NOT_NOUN'], ['chini', 'M_KAWAIDA_NOT_NOUN'], 'Mti ni nomino ya kawaida: jina la jumla la miti yote.'],
  ['Mkulima alipanda ___ shambani.', 'mbegu', ['Mwangi', 'M_KAWAIDA_NAME'], ['alipanda', 'M_KAWAIDA_NOT_NOUN'], ['vizuri', 'M_KAWAIDA_NOT_NOUN'], 'Mbegu ni nomino ya kawaida: jina la jumla la kitu kinachopandwa.'],
];

// ---------------------------------------------------------------- nomino za wingi
const WINGI = [
  ['Kitabu kimoja, ___ viwili.', 'vitabu', ['kitabu', 'M_WINGI_UNCHANGED'], ['watabu', 'M_WINGI_WRONG_PREFIX'], ['vivitabu', 'M_WINGI_DOUBLE'], 'Wingi wa kitabu ni vitabu: ki- hubadilika kuwa vi-.'],
  ['Mtoto mmoja, ___ wawili.', 'watoto', ['mtoto', 'M_WINGI_UNCHANGED'], ['vitoto', 'M_WINGI_WRONG_PREFIX'], ['wawatoto', 'M_WINGI_DOUBLE'], 'Wingi wa mtoto ni watoto: m- hubadilika kuwa wa-.'],
  ['Mti mmoja, ___ miwili.', 'miti', ['mti', 'M_WINGI_UNCHANGED'], ['viti', 'M_WINGI_WRONG_PREFIX'], ['mimiti', 'M_WINGI_DOUBLE'], 'Wingi wa mti ni miti: m- hubadilika kuwa mi-. Viti ni wingi wa kiti.'],
  ['Jiwe moja, ___ matatu.', 'mawe', ['jiwe', 'M_WINGI_UNCHANGED'], ['viwe', 'M_WINGI_WRONG_PREFIX'], ['majiwe', 'M_WINGI_DOUBLE'], 'Wingi wa jiwe ni mawe: ji- hubadilika kuwa ma-.'],
  ['Kalamu moja, ___ tano.', 'kalamu', ['makalamu', 'M_WINGI_WRONG_PREFIX'], ['vikalamu', 'M_WINGI_WRONG_PREFIX'], ['wakalamu', 'M_WINGI_WRONG_PREFIX'], 'Kalamu haibadiliki katika wingi: kalamu moja, kalamu tano.'],
  ['Kisu kimoja, ___ viwili.', 'visu', ['kisu', 'M_WINGI_UNCHANGED'], ['misu', 'M_WINGI_WRONG_PREFIX'], ['vivisu', 'M_WINGI_DOUBLE'], 'Wingi wa kisu ni visu: ki- hubadilika kuwa vi-.'],
  ['Mwalimu mmoja, ___ wawili.', 'walimu', ['mwalimu', 'M_WINGI_UNCHANGED'], ['vilimu', 'M_WINGI_WRONG_PREFIX'], ['wawalimu', 'M_WINGI_DOUBLE'], 'Wingi wa mwalimu ni walimu: mw- hubadilika kuwa wa-.'],
  ['Mkono mmoja, ___ miwili.', 'mikono', ['mkono', 'M_WINGI_UNCHANGED'], ['wakono', 'M_WINGI_WRONG_PREFIX'], ['mimikono', 'M_WINGI_DOUBLE'], 'Wingi wa mkono ni mikono: m- hubadilika kuwa mi-.'],
  ['Kiti kimoja, ___ vinne.', 'viti', ['kiti', 'M_WINGI_UNCHANGED'], ['miti', 'M_WINGI_WRONG_PREFIX'], ['vikiti', 'M_WINGI_DOUBLE'], 'Wingi wa kiti ni viti: ki- hubadilika kuwa vi-.'],
];

// ---------------------------------------------------------------- nomino za vitenzi-jina
const VJ = [
  ['___ vitabu vya hadithi kunakuza akili.', 'Kusoma', ['Soma', 'M_VJ_NO_KU'], ['Anasoma', 'M_VJ_CONJUGATED'], ['Msomaji', 'M_VJ_DOER'], 'Kitenzi-jina huanza na ku-: kusoma. Kinatumika kama nomino, bila mtu wala wakati.'],
  ['___ mpira kwenye uwanja ni mchezo ninaoupenda.', 'Kucheza', ['Cheza', 'M_VJ_NO_KU'], ['Anacheza', 'M_VJ_CONJUGATED'], ['Mchezaji', 'M_VJ_DOER'], 'Kucheza ni kitenzi-jina: kitendo kinachotumika kama nomino.'],
  ['___ shambani ni kazi ya wazazi wetu.', 'Kulima', ['Lima', 'M_VJ_NO_KU'], ['Analima', 'M_VJ_CONJUGATED'], ['Mkulima', 'M_VJ_DOER'], 'Kulima ni kitendo chenyewe. Mkulima ni mtu anayelima.'],
  ['___ nyimbo za shule hunifurahisha.', 'Kuimba', ['Imba', 'M_VJ_NO_KU'], ['Anaimba', 'M_VJ_CONJUGATED'], ['Mwimbaji', 'M_VJ_DOER'], 'Kuimba ni kitenzi-jina. Mwimbaji ni mtu anayeimba.'],
  ['___ maji kwa wingi hulinda afya.', 'Kunywa', ['Nywa', 'M_VJ_NO_KU'], ['Ananywa', 'M_VJ_CONJUGATED'], ['Mnywaji', 'M_VJ_DOER'], 'Kunywa ni kitenzi-jina kinachoanza na ku-.'],
  ['___ mapema huleta afya njema.', 'Kuamka', ['Amka', 'M_VJ_NO_KU'], ['Anaamka', 'M_VJ_CONJUGATED'], ['Aliamka', 'M_VJ_CONJUGATED'], 'Kuamka ni kitenzi-jina. Anaamka na aliamka ni vitenzi vyenye mtu na wakati.'],
  ['___ chakula bila kunawa mikono si salama.', 'Kula', ['La', 'M_VJ_NO_KU'], ['Anakula', 'M_VJ_CONJUGATED'], ['Mlaji', 'M_VJ_DOER'], 'Kula ni kitenzi-jina: kitendo kinachotumika kama nomino.'],
  ['___ kwa makini darasani huongeza uelewa.', 'Kusikiliza', ['Sikiliza', 'M_VJ_NO_KU'], ['Anasikiliza', 'M_VJ_CONJUGATED'], ['Msikilizaji', 'M_VJ_DOER'], 'Kusikiliza ni kitenzi-jina. Msikilizaji ni mtu anayesikiliza.'],
];

// ---------------------------------------------------------------- nomino za makundi
const MAKUNDI = [
  ['Alipofika sokoni, aliona ___ wa watu wengi.', 'umati', ['mkungu', 'M_MAK_WRONG_GROUP'], ['tita', 'M_MAK_WRONG_GROUP'], ['mtu', 'M_MAK_SINGLE'], 'Kundi kubwa la watu huitwa umati.'],
  ['Mama alinunua ___ wa ndizi sokoni.', 'mkungu', ['umati', 'M_MAK_WRONG_GROUP'], ['jeshi', 'M_MAK_WRONG_GROUP'], ['ndizi', 'M_MAK_SINGLE'], 'Ndizi zinazoning\'inia pamoja huitwa mkungu wa ndizi.'],
  ['___ la askari liliandamana kwenye gwaride.', 'jeshi', ['mkungu', 'M_MAK_WRONG_GROUP'], ['kapu', 'M_MAK_WRONG_GROUP'], ['askari', 'M_MAK_SINGLE'], 'Kundi la askari huitwa jeshi.'],
  ['___ wa magari ulipita barabarani kuelekea Mombasa.', 'msafara', ['mkungu', 'M_MAK_WRONG_GROUP'], ['jeshi', 'M_MAK_WRONG_GROUP'], ['gari', 'M_MAK_SINGLE'], 'Magari yanayosafiri pamoja huitwa msafara wa magari.'],
  ['Kuna ___ la ndege juu ya mti.', 'kundi', ['mkungu', 'M_MAK_WRONG_GROUP'], ['msafara', 'M_MAK_WRONG_GROUP'], ['ndege', 'M_MAK_SINGLE'], 'Ndege wengi pamoja huitwa kundi la ndege.'],
  ['Bibi alibeba ___ la kuni kichwani.', 'tita', ['umati', 'M_MAK_WRONG_GROUP'], ['mkungu', 'M_MAK_WRONG_GROUP'], ['mti', 'M_MAK_SINGLE'], 'Kuni zilizofungwa pamoja huitwa tita la kuni.'],
  ['___ la nyuki liliruka kutoka kwenye mzinga.', 'kundi', ['tita', 'M_MAK_WRONG_GROUP'], ['mkungu', 'M_MAK_WRONG_GROUP'], ['nyuki', 'M_MAK_SINGLE'], 'Nyuki wengi pamoja huitwa kundi la nyuki.'],
  ['Mchungaji alipeleka ___ la mbuzi malishoni.', 'kundi', ['tita', 'M_MAK_WRONG_GROUP'], ['mkungu', 'M_MAK_WRONG_GROUP'], ['mbuzi', 'M_MAK_SINGLE'], 'Mbuzi wengi pamoja huitwa kundi la mbuzi.'],
];

// ---------------------------------------------------------------- nomino ambata
const AMBATA = [
  ['Mtoto anayesoma shuleni ni ___.', 'mwanafunzi', ['mwalimu', 'M_AMBATA_SIMPLE'], ['mwana funzi', 'M_AMBATA_SPLIT'], ['mzazi', 'M_AMBATA_SIMPLE'], 'Mwanafunzi ni nomino ambata: mwana + funzi, limeandikwa kama neno moja.'],
  ['Mtu anayeandika habari kwa ajili ya gazeti ni ___.', 'mwanahabari', ['mwandishi', 'M_AMBATA_SIMPLE'], ['mwana habari', 'M_AMBATA_SPLIT'], ['mhariri', 'M_AMBATA_SIMPLE'], 'Mwanahabari ni nomino ambata: mwana + habari.'],
  ['Mtu anayeshiriki michezo kama mpira ni ___.', 'mwanamichezo', ['mchezaji', 'M_AMBATA_SIMPLE'], ['mwana michezo', 'M_AMBATA_SPLIT'], ['mshindi', 'M_AMBATA_SIMPLE'], 'Mwanamichezo ni nomino ambata: mwana + michezo.'],
  ['Mtu anayesomea masuala ya sayansi ni ___.', 'mwanasayansi', ['daktari', 'M_AMBATA_SIMPLE'], ['mwana sayansi', 'M_AMBATA_SPLIT'], ['mkulima', 'M_AMBATA_SIMPLE'], 'Mwanasayansi ni nomino ambata: mwana + sayansi.'],
  ['Mtu anayeishi kijijini ni ___.', 'mwanakijiji', ['mkulima', 'M_AMBATA_SIMPLE'], ['mwana kijiji', 'M_AMBATA_SPLIT'], ['jirani', 'M_AMBATA_SIMPLE'], 'Mwanakijiji ni nomino ambata: mwana + kijiji.'],
  ['Mtu mzima wa jinsia ya kike ni ___.', 'mwanamke', ['msichana', 'M_AMBATA_SIMPLE'], ['mwana mke', 'M_AMBATA_SPLIT'], ['binti', 'M_AMBATA_SIMPLE'], 'Mwanamke ni nomino ambata: mwana + mke.'],
  ['Mtu mzima wa jinsia ya kiume ni ___.', 'mwanamume', ['mvulana', 'M_AMBATA_SIMPLE'], ['mwana mume', 'M_AMBATA_SPLIT'], ['kijana', 'M_AMBATA_SIMPLE'], 'Mwanamume ni nomino ambata: mwana + mume.'],
  ['Mtu anayesoma chuoni ni ___.', 'mwanachuo', ['mhadhiri', 'M_AMBATA_SIMPLE'], ['mwana chuo', 'M_AMBATA_SPLIT'], ['mwalimu', 'M_AMBATA_SIMPLE'], 'Mwanachuo ni nomino ambata: mwana + chuo.'],
];

// ---------------------------------------------------------------- nomino za dhahania
const DHAHANIA = [
  ['Mama ana moyo wa ___ kwa watoto wake.', 'upendo', ['kupenda', 'M_DHA_VERB'], ['mpenzi', 'M_DHA_PERSON'], ['kitabu', 'M_DHA_CONCRETE'], 'Upendo ni hisia. Haishikiki kwa mkono, kwa hiyo ni nomino ya dhahania.'],
  ['Bibi yetu ana ___ mwingi; hukaribisha kila mgeni.', 'ukarimu', ['mkarimu', 'M_DHA_PERSON'], ['kukarimu', 'M_DHA_VERB'], ['chakula', 'M_DHA_CONCRETE'], 'Ukarimu ni tabia. Mkarimu ni mtu mwenye tabia hiyo.'],
  ['Wananchi wote wanataka ___ katika nchi yao.', 'amani', ['kupatana', 'M_DHA_VERB'], ['mpatanishi', 'M_DHA_PERSON'], ['nyumba', 'M_DHA_CONCRETE'], 'Amani ni hali isiyoshikika, kwa hiyo ni nomino ya dhahania.'],
  ['Alipopata zawadi, alijawa na ___.', 'furaha', ['kufurahi', 'M_DHA_VERB'], ['mcheshi', 'M_DHA_PERSON'], ['zawadi', 'M_DHA_CONCRETE'], 'Furaha ni hisia, kwa hiyo ni nomino ya dhahania.'],
  ['___ ni tabia mbaya ya kusema yasiyo kweli.', 'Uongo', ['Kudanganya', 'M_DHA_VERB'], ['Mwongo', 'M_DHA_PERSON'], ['Kalamu', 'M_DHA_CONCRETE'], 'Uongo ni wazo la kusema yasiyo kweli. Mwongo ni mtu anayesema uongo.'],
  ['Mwalimu anatufundisha kuonyesha ___ kwa wazee.', 'heshima', ['kuheshimu', 'M_DHA_VERB'], ['mheshimiwa', 'M_DHA_PERSON'], ['kiti', 'M_DHA_CONCRETE'], 'Heshima ni tabia ya moyo, kwa hiyo ni nomino ya dhahania.'],
  ['Mtoto alilia kwa ___ kwa sababu alipoteza daftari lake.', 'huzuni', ['kuhuzunika', 'M_DHA_VERB'], ['mhuzunifu', 'M_DHA_PERSON'], ['meza', 'M_DHA_CONCRETE'], 'Huzuni ni hisia, kwa hiyo ni nomino ya dhahania.'],
  ['Kila mwanafunzi anahitaji ___ ili apate alama nzuri.', 'bidii', ['kujitahidi', 'M_DHA_VERB'], ['mchapakazi', 'M_DHA_PERSON'], ['mlima', 'M_DHA_CONCRETE'], 'Bidii ni tabia ya kujitahidi, kwa hiyo ni nomino ya dhahania.'],
];
const DHA_ID = [
  ['Ni neno lipi ni nomino ya dhahania?', 'ukarimu', ['kitabu', 'M_DHA_CONCRETE'], ['kusoma', 'M_DHA_VERB'], ['mkarimu', 'M_DHA_PERSON'], 'Ukarimu hauwezi kushikwa kwa mkono: ni tabia.'],
  ['Neno lipi linataja wazo au hisia usiyoweza kushika?', 'upendo', ['mkono', 'M_DHA_CONCRETE'], ['kupenda', 'M_DHA_VERB'], ['mpenzi', 'M_DHA_PERSON'], 'Upendo ni hisia. Haishikiki.'],
  ['Ni neno lipi ni nomino ya dhahania?', 'amani', ['mti', 'M_DHA_CONCRETE'], ['kupatana', 'M_DHA_VERB'], ['mpatanishi', 'M_DHA_PERSON'], 'Amani ni hali, si kitu kinachoshikika.'],
  ['Ni neno lipi ni nomino ya dhahania?', 'heshima', ['kiti', 'M_DHA_CONCRETE'], ['kuheshimu', 'M_DHA_VERB'], ['mheshimiwa', 'M_DHA_PERSON'], 'Heshima ni tabia ya moyo. Haishikiki.'],
  ['Neno lipi linataja wazo au hisia usiyoweza kushika?', 'huzuni', ['mlango', 'M_DHA_CONCRETE'], ['kuhuzunika', 'M_DHA_VERB'], ['mhuzunifu', 'M_DHA_PERSON'], 'Huzuni ni hisia. Haishikiki.'],
  ['Ni neno lipi ni nomino ya dhahania?', 'uongo', ['mwamba', 'M_DHA_CONCRETE'], ['kudanganya', 'M_DHA_VERB'], ['mwongo', 'M_DHA_PERSON'], 'Uongo ni wazo la kusema yasiyo kweli. Mwongo ni mtu.'],
];

// ---------------------------------------------------------------- uakifishi (whole sentences)
const UAK = [
  ['', 'Wanjiru alienda sokoni.', ['wanjiru alienda sokoni.', 'M_UAK_NO_CAPITAL'], ['Wanjiru alienda sokoni?', 'M_UAK_WRONG_MARK'], ['Wanjiru alienda Sokoni.', 'M_UAK_CAPITAL_COMMON'], 'Jina la mtu huanza kwa herufi kubwa, na sentensi ya kawaida huisha kwa kikomo.'],
  ['', 'Unaenda wapi?', ['Unaenda wapi.', 'M_UAK_WRONG_MARK'], ['unaenda wapi?', 'M_UAK_NO_CAPITAL'], ['Unaenda Wapi?', 'M_UAK_CAPITAL_COMMON'], 'Swali huisha kwa kiulizi (?).'],
  ['', 'Mama alinunua mchele, sukari na chumvi.', ['Mama alinunua mchele sukari na chumvi.', 'M_UAK_NO_COMMA'], ['mama alinunua mchele, sukari na chumvi.', 'M_UAK_NO_CAPITAL'], ['Mama alinunua mchele, sukari na chumvi?', 'M_UAK_WRONG_MARK'], 'Koma hutenganisha vitu katika orodha.'],
  ['', 'Baba amelima mahindi, maharagwe na viazi.', ['Baba amelima mahindi maharagwe na viazi.', 'M_UAK_NO_COMMA'], ['baba amelima mahindi, maharagwe na viazi.', 'M_UAK_NO_CAPITAL'], ['Baba amelima Mahindi, maharagwe na viazi.', 'M_UAK_CAPITAL_COMMON'], 'Orodha ya vitu hutenganishwa kwa koma, na herufi kubwa ni ya mwanzo wa sentensi tu.'],
  ['', 'Ulikula chakula gani leo?', ['Ulikula chakula gani leo.', 'M_UAK_WRONG_MARK'], ['ulikula chakula gani leo?', 'M_UAK_NO_CAPITAL'], ['Ulikula Chakula gani leo?', 'M_UAK_CAPITAL_COMMON'], 'Hili ni swali, kwa hiyo huisha kwa kiulizi.'],
  ['', 'Otieno anaishi Kisumu.', ['Otieno anaishi kisumu.', 'M_UAK_NO_CAPITAL'], ['Otieno anaishi Kisumu?', 'M_UAK_WRONG_MARK'], ['Otieno Anaishi Kisumu.', 'M_UAK_CAPITAL_COMMON'], 'Otieno na Kisumu ni majina ya pekee, kwa hiyo huanza kwa herufi kubwa.'],
  ['', 'Tulienda shuleni asubuhi.', ['Tulienda Shuleni asubuhi.', 'M_UAK_CAPITAL_COMMON'], ['tulienda shuleni asubuhi.', 'M_UAK_NO_CAPITAL'], ['Tulienda shuleni asubuhi?', 'M_UAK_WRONG_MARK'], 'Shuleni si jina la pekee, kwa hiyo huandikwa kwa herufi ndogo katikati ya sentensi.'],
  ['', 'Je, umefanya kazi yako ya nyumbani?', ['Je umefanya kazi yako ya nyumbani?', 'M_UAK_NO_COMMA'], ['Je, umefanya kazi yako ya nyumbani.', 'M_UAK_WRONG_MARK'], ['je, umefanya kazi yako ya nyumbani?', 'M_UAK_NO_CAPITAL'], 'Weka koma baada ya "Je", na umalize swali kwa kiulizi.'],
  ['', 'Wanafunzi walinunua daftari, kalamu na rula.', ['Wanafunzi walinunua daftari kalamu na rula.', 'M_UAK_NO_COMMA'], ['wanafunzi walinunua daftari, kalamu na rula.', 'M_UAK_NO_CAPITAL'], ['Wanafunzi walinunua daftari, kalamu na rula?', 'M_UAK_WRONG_MARK'], 'Orodha ya vitu hutenganishwa kwa koma.'],
];

export const FAMILIES = [
  ...trio('nomino.pekee', 'SARUFI.T1_AINA_ZA_NOMINO.PEKEE', PEKEE, { stem: 'Chagua nomino ya pekee inayokamilisha sentensi.', gapStem: 'Andika nomino ya pekee inayokosekana:', topic: 'kuhusu nomino za pekee', hints: H('Nomino ya pekee ni jina la mtu mmoja au mahali pamoja.', 'Kazi na vyeo, kama mwalimu au daktari, si nomino za pekee.') }),
  ...duo('nomino.pekee.sentensi', 'SARUFI.T1_AINA_ZA_NOMINO.PEKEE', PEKEE_ID, { stem: 'Chagua nomino ya pekee.', tag: 'tafuta', oc: ['a', 'a'], topic: 'kuhusu nomino za pekee', hints: H('Tafuta jina la mtu mmoja au mahali pamoja.', 'Neno la kwanza la sentensi huanza kwa herufi kubwa kila wakati, hata likiwa nomino ya kawaida.') }),
  ...trio('nomino.kawaida', 'SARUFI.T1_AINA_ZA_NOMINO_2.KAWAIDA', KAWAIDA, { stem: 'Chagua nomino ya kawaida inayokamilisha sentensi.', gapStem: 'Andika nomino ya kawaida inayokosekana:', topic: 'kuhusu nomino za kawaida', hints: H('Nomino ya kawaida ni jina la jumla la aina ya kitu, mtu au mahali.', 'Majina ya watu na miji si nomino za kawaida. Vitenzi na vivumishi pia si nomino.') }),
  ...trio('nomino.wingi', 'SARUFI.T2_AINA_ZA_NOMINO.WINGI', WINGI, { stem: 'Chagua wingi sahihi.', gapStem: 'Andika neno la wingi linalokosekana:', topic: 'kuhusu nomino za umoja na wingi', hints: H('Wingi mara nyingi hubadilisha mwanzo wa neno.', 'Soma sentensi nzima: neno la pili linaonyesha ni wingi.') }),
  ...trio('nomino.vitenzijina', 'SARUFI.T2_AINA_ZA_NOMINO_2.VITENZI_JINA', VJ, { stem: 'Chagua kitenzi-jina kinachokamilisha sentensi.', gapStem: 'Andika kitenzi-jina kinachokosekana:', topic: 'kuhusu vitenzi-jina', hints: H('Kitenzi-jina huanza na ku-.', 'Kitenzi-jina hutumika kama nomino: hakina mtu wala wakati.') }),
  ...trio('nomino.makundi', 'SARUFI.T3_AINA_ZA_NOMINO.MAKUNDI', MAKUNDI, { stem: 'Chagua nomino ya kundi inayokamilisha sentensi.', gapStem: 'Andika nomino ya kundi inayokosekana:', topic: 'kuhusu nomino za makundi', hints: H('Nomino ya kundi hutaja wengi kwa pamoja.', 'Kila kundi lina jina lake: watu, askari, magari, ndizi, kuni, ndege.') }),
  ...trio('nomino.ambata', 'SARUFI.T3_AINA_ZA_NOMINO_2.AMBATA', AMBATA, { stem: 'Chagua nomino ambata inayokamilisha sentensi.', gapStem: 'Andika nomino ambata inayokosekana:', topic: 'kuhusu nomino ambata', hints: H('Nomino ambata huundwa kwa maneno mawili yaliyoungana.', 'Huandikwa kama neno moja, bila nafasi katikati.') }),
  ...trio('nomino.dhahania', 'SARUFI.T3_AINA_ZA_NOMINO_3.DHAHANIA', DHAHANIA, { stem: 'Chagua nomino ya dhahania inayokamilisha sentensi.', gapStem: 'Andika nomino ya dhahania inayokosekana:', topic: 'kuhusu nomino za dhahania', hints: H('Nomino ya dhahania ni wazo au hisia isiyoshikika.', 'Kitenzi na neno la mtu havifai hapa: tafuta jina la tabia au hisia.') }),
  ...duo('nomino.dhahania.tambua', 'SARUFI.T3_AINA_ZA_NOMINO_3.DHAHANIA', DHA_ID, { stem: 'Chagua nomino ya dhahania.', tag: 'tambua', oc: ['a', 'b'], topic: 'kuhusu nomino za dhahania', hints: H('Jiulize: naweza kuishika kwa mkono?', 'Nomino ya dhahania ni hisia, tabia au wazo.') }),
  ...duo('uakifishi', 'SARUFI.T3_UAKIFISHI.UAKIFISHI', UAK, { stem: STEM.sentence, topic: 'kuhusu alama za uakifishi', hints: H('Angalia herufi ya kwanza ya sentensi na ya kila jina la pekee.', 'Angalia alama ya mwisho na mahali pa kupumzika katika orodha.') }),
];
