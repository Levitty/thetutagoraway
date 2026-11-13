// ============================================================================
// KISWAHILI GRADE 4, SARUFI: AINA ZA MANENO (Themes 1 to 3): nomino, vitenzi, vivumishi, viwakilishi, vielezi,
// viunganishi, vihusishi, vihisishi. DRAFT families, all off for children.
// Written offline by Claude (13 Nov 2026), no model call. Original sentences, Kenyan names and places.
// Every wrong answer names the library misconception behind it (curriculum/kiswahili/g4.json, codes M4_...).
// A native Kiswahili speaker must check every item: docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- nomino
const NOM_GAP = [
  ['Mama ananunua ___ sokoni.', 'mboga', ['anapika', 'M4_NOM_VERB'], ['nzuri', 'M4_NOM_ADJ'], ['haraka', 'M4_NOM_ADV'], 'Mboga ni jina la kitu, kwa hiyo ni nomino. "Anapika" ni kitenzi.'],
  ['Wanafunzi wanasoma ___ darasani.', 'vitabu', ['wanaandika', 'M4_NOM_VERB'], ['vikubwa', 'M4_NOM_ADJ'], ['vizuri', 'M4_NOM_ADV'], 'Vitabu ni jina la vitu. Nomino hutaja mtu, mnyama, mahali au kitu.'],
  ['Baba amenunua ___ mpya.', 'gari', ['amelima', 'M4_NOM_VERB'], ['nzuri', 'M4_NOM_ADJ'], ['jana', 'M4_NOM_ADV'], 'Gari ni jina la chombo, kwa hiyo ni nomino. "Mpya" linaeleza gari likoje.'],
  ['Juma anapenda kucheza ___ uwanjani.', 'mpira', ['anakimbia', 'M4_NOM_VERB'], ['mrefu', 'M4_NOM_ADJ'], ['leo', 'M4_NOM_ADV'], 'Mpira ni jina la kitu cha kuchezea. Ni nomino.'],
  ['Mkulima anapanda ___ shambani.', 'mahindi', ['analima', 'M4_NOM_VERB'], ['mengi', 'M4_NOM_ADJ'], ['mapema', 'M4_NOM_ADV'], 'Mahindi ni jina la mmea, kwa hiyo ni nomino.'],
  ['Tulikunywa ___ baridi baada ya mchezo.', 'maji', ['tulicheza', 'M4_NOM_VERB'], ['tamu', 'M4_NOM_ADJ'], ['sana', 'M4_NOM_ADV'], 'Maji ni jina la kinywaji. "Baridi" linaeleza maji yakoje.'],
  ['Bibi alituletea ___ tamu.', 'embe', ['alikuja', 'M4_NOM_VERB'], ['kubwa', 'M4_NOM_ADJ'], ['jana', 'M4_NOM_ADV'], 'Embe ni jina la tunda. Ni nomino.'],
  ['Nomino ni neno linalotaja ___.', 'mtu, mnyama, mahali au kitu', ['kitendo', 'M4_NOM_VERB'], ['sifa', 'M4_NOM_ADJ'], ['wakati', 'M4_NOM_ADV'], 'Nomino ni jina la mtu, mnyama, mahali au kitu. Kitendo ni kitenzi.'],
];
const NOM_ID = [
  ['Ni neno lipi ni nomino?', 'kitabu', ['soma', 'M4_NOM_VERB'], ['kubwa', 'M4_NOM_ADJ'], ['haraka', 'M4_NOM_ADV'], 'Kitabu ni jina la kitu. Soma ni kitenzi, kubwa ni kivumishi na haraka ni kielezi.'],
  ['Ni neno lipi ni nomino?', 'mwalimu', ['anafundisha', 'M4_NOM_VERB'], ['mzuri', 'M4_NOM_ADJ'], ['polepole', 'M4_NOM_ADV'], 'Mwalimu ni jina la mtu. Ni nomino.'],
  ['Ni neno lipi ni nomino?', 'Nairobi', ['tulienda', 'M4_NOM_VERB'], ['kubwa', 'M4_NOM_ADJ'], ['jana', 'M4_NOM_ADV'], 'Nairobi ni jina la mji. Ni nomino ya mahali.'],
  ['Ni neno lipi ni nomino?', 'paka', ['anaruka', 'M4_NOM_VERB'], ['mweusi', 'M4_NOM_ADJ'], ['haraka', 'M4_NOM_ADV'], 'Paka ni jina la mnyama. Ni nomino.'],
  ['Ni neno lipi ni nomino?', 'meza', ['andika', 'M4_NOM_VERB'], ['ndefu', 'M4_NOM_ADJ'], ['kesho', 'M4_NOM_ADV'], 'Meza ni jina la kitu. Ni nomino.'],
  ['Ni neno lipi ni nomino?', 'shule', ['inafunguliwa', 'M4_NOM_VERB'], ['nzuri', 'M4_NOM_ADJ'], ['mapema', 'M4_NOM_ADV'], 'Shule ni jina la mahali. Ni nomino.'],
];

// ---------------------------------------------------------------- vitenzi
const VERB_GAP = [
  ['Juma ___ mpira uwanjani.', 'anacheza', ['uwanja', 'M4_VERB_NOUN'], ['mkubwa', 'M4_VERB_ADJ'], ['kesho', 'M4_VERB_OTHER'], 'Anacheza ni kitenzi: kinaonyesha kitendo cha Juma. Uwanja ni nomino.'],
  ['Mama ___ chakula jikoni.', 'anapika', ['jiko', 'M4_VERB_NOUN'], ['kitamu', 'M4_VERB_ADJ'], ['sasa', 'M4_VERB_OTHER'], 'Anapika ni kitenzi: kinaonyesha kitendo cha mama. Jiko ni nomino.'],
  ['Wakulima ___ mahindi shambani.', 'wanapanda', ['shamba', 'M4_VERB_NOUN'], ['mengi', 'M4_VERB_ADJ'], ['mapema', 'M4_VERB_OTHER'], 'Wanapanda ni kitenzi: kinaonyesha kitendo cha wakulima.'],
  ['Ndege ___ angani.', 'wanaruka', ['anga', 'M4_VERB_NOUN'], ['weusi', 'M4_VERB_ADJ'], ['juu', 'M4_VERB_OTHER'], 'Wanaruka ni kitenzi: kinaonyesha kitendo cha ndege.'],
  ['Mimi ___ maji kila asubuhi.', 'ninakunywa', ['kikombe', 'M4_VERB_NOUN'], ['baridi', 'M4_VERB_ADJ'], ['mapema', 'M4_VERB_OTHER'], 'Ninakunywa ni kitenzi: kinaonyesha kitendo ninachofanya.'],
  ['Baba ___ gari jana.', 'alinunua', ['duka', 'M4_VERB_NOUN'], ['jipya', 'M4_VERB_ADJ'], ['leo', 'M4_VERB_OTHER'], 'Alinunua ni kitenzi: kinaonyesha kitendo cha baba.'],
  ['Kitenzi ni neno linaloonyesha ___.', 'kitendo', ['jina', 'M4_VERB_NOUN'], ['sifa', 'M4_VERB_ADJ'], ['mahali', 'M4_VERB_OTHER'], 'Kitenzi ni neno linaloonyesha kitendo, kama kusoma, kucheza na kupika.'],
  ['Neno linaloonyesha kinachofanyika huitwa ___.', 'kitenzi', ['nomino', 'M4_VERB_NOUN'], ['kivumishi', 'M4_VERB_ADJ'], ['kielezi', 'M4_VERB_OTHER'], 'Kitenzi kinaonyesha kitendo. Nomino ni jina, kivumishi ni sifa.'],
];
const VERB_ID = [
  ['Ni neno lipi ni kitenzi?', 'anacheza', ['mchezo', 'M4_VERB_NOUN'], ['mzuri', 'M4_VERB_ADJ'], ['kesho', 'M4_VERB_OTHER'], 'Anacheza ni kitendo. Mchezo ni nomino na mzuri ni kivumishi.'],
  ['Ni neno lipi ni kitenzi?', 'wanaimba', ['wimbo', 'M4_VERB_NOUN'], ['mrefu', 'M4_VERB_ADJ'], ['sana', 'M4_VERB_OTHER'], 'Wanaimba ni kitendo cha watu. Wimbo ni nomino.'],
  ['Ni neno lipi ni kitenzi?', 'alisoma', ['kitabu', 'M4_VERB_NOUN'], ['kikubwa', 'M4_VERB_ADJ'], ['jana', 'M4_VERB_OTHER'], 'Alisoma ni kitendo. Kitabu ni nomino.'],
  ['Ni neno lipi ni kitenzi?', 'tunakula', ['chakula', 'M4_VERB_NOUN'], ['kitamu', 'M4_VERB_ADJ'], ['pamoja', 'M4_VERB_OTHER'], 'Tunakula ni kitendo. Chakula ni nomino.'],
  ['Ni neno lipi ni kitenzi?', 'atalima', ['shamba', 'M4_VERB_NOUN'], ['kubwa', 'M4_VERB_ADJ'], ['kesho', 'M4_VERB_OTHER'], 'Atalima ni kitendo kitakachofanyika. Shamba ni nomino.'],
  ['Ni neno lipi ni kitenzi?', 'wanaandika', ['barua', 'M4_VERB_NOUN'], ['ndefu', 'M4_VERB_ADJ'], ['upesi', 'M4_VERB_OTHER'], 'Wanaandika ni kitendo. Barua ni nomino.'],
];

// ---------------------------------------------------------------- vivumishi
const ADJ_GAP = [
  ['Mtoto ___ anacheza uwanjani.', 'mdogo', ['mwalimu', 'M4_ADJ_NOUN'], ['anacheza', 'M4_ADJ_VERB'], ['wadogo', 'M4_ADJ_AGREE'], 'Mdogo ni kivumishi: kinaeleza mtoto yukoje. Mtoto mmoja huenda na "mdogo".'],
  ['Watoto ___ wanacheza uwanjani.', 'wadogo', ['walimu', 'M4_ADJ_NOUN'], ['wanaimba', 'M4_ADJ_VERB'], ['mdogo', 'M4_ADJ_AGREE'], 'Watoto ni wengi, kwa hiyo kivumishi ni "wadogo".'],
  ['Kiti ___ kiko darasani.', 'kikubwa', ['kitabu', 'M4_ADJ_NOUN'], ['kimeanguka', 'M4_ADJ_VERB'], ['mkubwa', 'M4_ADJ_AGREE'], 'Kiti ni cha ngeli ya KI-VI, kwa hiyo kivumishi ni "kikubwa".'],
  ['Mti ___ umeanguka shambani.', 'mrefu', ['mkulima', 'M4_ADJ_NOUN'], ['umekatwa', 'M4_ADJ_VERB'], ['virefu', 'M4_ADJ_AGREE'], 'Mti mmoja huenda na "mrefu". Kivumishi kinaeleza mti ukoje.'],
  ['Miti ___ imeota karibu na mto.', 'mirefu', ['mito', 'M4_ADJ_NOUN'], ['imekua', 'M4_ADJ_VERB'], ['mrefu', 'M4_ADJ_AGREE'], 'Miti ni mingi, kwa hiyo kivumishi ni "mirefu".'],
  ['Nyumba ___ ina bustani.', 'nzuri', ['bibi', 'M4_ADJ_NOUN'], ['inaonekana', 'M4_ADJ_VERB'], ['mzuri', 'M4_ADJ_AGREE'], 'Nyumba nzuri: kivumishi kinaeleza nyumba ikoje.'],
  ['Mwalimu ___ alitufundisha jana.', 'mwema', ['mwanafunzi', 'M4_ADJ_NOUN'], ['alisoma', 'M4_ADJ_VERB'], ['wema', 'M4_ADJ_AGREE'], 'Mwalimu mmoja huenda na "mwema". Kivumishi kinaeleza mwalimu yukoje.'],
  ['Kivumishi ni neno linaloeleza ___ ikoje.', 'nomino', ['kitenzi', 'M4_ADJ_VERB'], ['kielezi', 'M4_ADJ_AGREE'], ['kiunganishi', 'M4_ADJ_AGREE'], 'Kivumishi hueleza nomino ikoje au ni ngapi, kama "mrefu" na "nzuri".'],
];
const ADJ_ID = [
  ['Ni neno lipi ni kivumishi: "Mtoto mdogo analia shuleni."', 'mdogo', ['Mtoto', 'M4_ADJ_NOUN'], ['analia', 'M4_ADJ_VERB'], ['shuleni', 'M4_ADJ_NOUN'], 'Mdogo linaeleza mtoto yukoje. Mtoto na shuleni ni nomino, analia ni kitenzi.'],
  ['Ni neno lipi ni kivumishi: "Kitabu kizuri kiko mezani."', 'kizuri', ['Kitabu', 'M4_ADJ_NOUN'], ['kiko', 'M4_ADJ_VERB'], ['mezani', 'M4_ADJ_NOUN'], 'Kizuri linaeleza kitabu kikoje. Kitabu na mezani ni nomino, kiko ni kitenzi.'],
  ['Ni neno lipi ni kivumishi: "Mkulima mwema amelima shamba kubwa jana."', 'mwema', ['Mkulima', 'M4_ADJ_NOUN'], ['amelima', 'M4_ADJ_VERB'], ['shamba', 'M4_ADJ_NOUN'], 'Mwema linaeleza mkulima yukoje. Mkulima na shamba ni nomino.'],
  ['Ni neno lipi ni kivumishi: "Maembe matamu yameiva shambani."', 'matamu', ['Maembe', 'M4_ADJ_NOUN'], ['yameiva', 'M4_ADJ_VERB'], ['shambani', 'M4_ADJ_NOUN'], 'Matamu linaeleza maembe yakoje. Maembe ni nomino na yameiva ni kitenzi.'],
  ['Ni neno lipi ni kivumishi: "Nyumba ndefu iko karibu na barabara."', 'ndefu', ['Nyumba', 'M4_ADJ_NOUN'], ['iko', 'M4_ADJ_VERB'], ['barabara', 'M4_ADJ_NOUN'], 'Ndefu linaeleza nyumba ikoje. Nyumba na barabara ni nomino.'],
  ['Ni neno lipi ni kivumishi: "Wanafunzi wengi wanasoma darasani."', 'wengi', ['Wanafunzi', 'M4_ADJ_NOUN'], ['wanasoma', 'M4_ADJ_VERB'], ['darasani', 'M4_ADJ_NOUN'], 'Wengi linaeleza wanafunzi ni wangapi. Wanafunzi ni nomino na wanasoma ni kitenzi.'],
];

// ---------------------------------------------------------------- viwakilishi
const PRON_GAP = [
  ['Wanjiru ni msichana. ___ anapenda kusoma.', 'Yeye', ['Wanjiru', 'M4_PRON_NOUN'], ['Wao', 'M4_PRON_NUMBER'], ['Mimi', 'M4_PRON_PERSON'], 'Wanjiru ni mtu mmoja. "Yeye" husimama mahali pa jina lake ili tusilirudie.'],
  ['Juma na Otieno ni marafiki. ___ wanacheza pamoja.', 'Wao', ['Juma', 'M4_PRON_NOUN'], ['Yeye', 'M4_PRON_NUMBER'], ['Sisi', 'M4_PRON_PERSON'], 'Juma na Otieno ni wawili. "Wao" huwakilisha watu wengi.'],
  ['Mimi na wewe ni marafiki. ___ tunasoma pamoja.', 'Sisi', ['marafiki', 'M4_PRON_NOUN'], ['Wao', 'M4_PRON_PERSON'], ['Yeye', 'M4_PRON_NUMBER'], '"Sisi" ni mimi na wewe. "Wao" ni watu wengine, bila sisi.'],
  ['Angalia, ___ ni mwalimu wetu, ameketi karibu nami.', 'Huyu', ['Mwalimu', 'M4_PRON_NOUN'], ['Yule', 'M4_PRON_DIST'], ['Hawa', 'M4_PRON_NUMBER'], 'Mwalimu ni mmoja na yuko karibu, kwa hiyo ni "huyu".'],
  ['___ ni marafiki zangu, wamesimama karibu nami.', 'Hawa', ['Wanafunzi', 'M4_PRON_NOUN'], ['Wale', 'M4_PRON_DIST'], ['Huyu', 'M4_PRON_NUMBER'], 'Marafiki ni wengi na wako karibu, kwa hiyo ni "hawa".'],
  ['___ anayesimama mbali kule ni baba yangu.', 'Yule', ['Baba', 'M4_PRON_NOUN'], ['Huyu', 'M4_PRON_DIST'], ['Wale', 'M4_PRON_NUMBER'], 'Baba ni mmoja na yuko mbali, kwa hiyo ni "yule".'],
  ['___ wanaocheza mbali ni wanafunzi wetu.', 'Wale', ['Wanafunzi', 'M4_PRON_NOUN'], ['Hawa', 'M4_PRON_DIST'], ['Yule', 'M4_PRON_NUMBER'], 'Wanafunzi ni wengi na wako mbali, kwa hiyo ni "wale".'],
  ['Kiwakilishi ni neno linalosimama mahali pa ___.', 'nomino', ['kitenzi', 'M4_PRON_NOUN'], ['kielezi', 'M4_PRON_NOUN'], ['kiunganishi', 'M4_PRON_NOUN'], 'Kiwakilishi husimama mahali pa nomino, kama "yeye" mahali pa jina la mtu.'],
];
const PRON_ID = [
  ['Ni neno lipi ni kiwakilishi: "Otieno ni mwalimu. Yeye anafundisha darasani."', 'Yeye', ['Otieno', 'M4_PRON_NOUN'], ['mwalimu', 'M4_PRON_NOUN'], ['anafundisha', 'M4_PRON_NOUN'], '"Yeye" linasimama mahali pa Otieno. Ni kiwakilishi.'],
  ['Ni neno lipi ni kiwakilishi: "Wanafunzi wamefika. Wao wanasoma kitabu."', 'Wao', ['Wanafunzi', 'M4_PRON_NOUN'], ['wamefika', 'M4_PRON_NOUN'], ['kitabu', 'M4_PRON_NOUN'], '"Wao" linasimama mahali pa wanafunzi. Ni kiwakilishi.'],
  ['Ni neno lipi ni kiwakilishi: "Huyu ni dada yangu mdogo."', 'Huyu', ['dada', 'M4_PRON_NOUN'], ['ni', 'M4_PRON_NOUN'], ['mdogo', 'M4_PRON_NOUN'], '"Huyu" linamwonyesha mtu aliye karibu bila kumtaja jina. Ni kiwakilishi.'],
  ['Ni neno lipi ni kiwakilishi: "Sisi tunacheza mpira uwanjani."', 'Sisi', ['mpira', 'M4_PRON_NOUN'], ['tunacheza', 'M4_PRON_NOUN'], ['uwanjani', 'M4_PRON_NOUN'], '"Sisi" linasimama mahali pa watu wanaozungumza. Ni kiwakilishi.'],
  ['Ni neno lipi ni kiwakilishi: "Wale wanaimba nyimbo nzuri."', 'Wale', ['wanaimba', 'M4_PRON_NOUN'], ['nyimbo', 'M4_PRON_NOUN'], ['nzuri', 'M4_PRON_NOUN'], '"Wale" linawaonyesha watu walio mbali bila kuwataja. Ni kiwakilishi.'],
  ['Ni neno lipi ni kiwakilishi: "Mimi ninapenda kusoma vitabu."', 'Mimi', ['kusoma', 'M4_PRON_NOUN'], ['ninapenda', 'M4_PRON_NOUN'], ['vitabu', 'M4_PRON_NOUN'], '"Mimi" linasimama mahali pa jina la anayesema. Ni kiwakilishi.'],
];

// ---------------------------------------------------------------- vielezi
const ADV_GAP = [
  ['Mtoto alikimbia ___ kuelekea nyumbani.', 'haraka', ['mrefu', 'M4_ADV_ADJ'], ['barabara', 'M4_ADV_NOUN'], ['mtoto', 'M4_ADV_NOUN'], 'Haraka ni kielezi: kinaonyesha mtoto alikimbiaje.'],
  ['Wanafunzi wanaimba ___ darasani.', 'vizuri', ['nzuri', 'M4_ADV_ADJ'], ['wimbo', 'M4_ADV_NOUN'], ['darasa', 'M4_ADV_NOUN'], 'Vizuri ni kielezi: kinaonyesha jinsi wanavyoimba. "Nzuri" ni kivumishi cha nomino.'],
  ['Bibi anatembea ___ kwa sababu ni mzee.', 'polepole', ['mrefu', 'M4_ADV_ADJ'], ['fimbo', 'M4_ADV_NOUN'], ['bibi', 'M4_ADV_NOUN'], 'Polepole ni kielezi cha jinsi: kinaonyesha bibi anatembeaje.'],
  ['Baba alirudi nyumbani ___ jioni.', 'jana', ['nzuri', 'M4_ADV_ADJ'], ['gari', 'M4_ADV_NOUN'], ['nyumba', 'M4_ADV_NOUN'], 'Jana ni kielezi cha wakati: kinaonyesha lini baba alirudi.'],
  ['Wageni wanaishi ___ ya mji huu.', 'mbali', ['wengi', 'M4_ADV_ADJ'], ['mji', 'M4_ADV_NOUN'], ['wageni', 'M4_ADV_NOUN'], 'Mbali ni kielezi cha mahali: kinaonyesha wageni wanaishi wapi.'],
  ['Mama anazungumza ___ na jirani.', 'kwa upole|upole', ['mpole', 'M4_ADV_ADJ'], ['jirani', 'M4_ADV_NOUN'], ['mama', 'M4_ADV_NOUN'], 'Kwa upole ni kielezi cha jinsi: kinaonyesha mama anazungumzaje.'],
  ['Tutaenda sokoni ___ asubuhi na mapema.', 'kesho', ['kubwa', 'M4_ADV_ADJ'], ['soko', 'M4_ADV_NOUN'], ['asubuhi', 'M4_ADV_NOUN'], 'Kesho ni kielezi cha wakati: kinaonyesha lini tutaenda.'],
];
const ADV_TYPE = [
  ['Kielezi "polepole" kinaonyesha ___.', 'jinsi|namna', ['wakati', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Polepole kinaonyesha jinsi kitendo kinavyofanyika.'],
  ['Kielezi "jana" kinaonyesha ___.', 'wakati', ['jinsi', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Jana kinaonyesha lini kitendo kilifanyika.'],
  ['Kielezi "hapa" kinaonyesha ___.', 'mahali', ['wakati', 'M4_ADV_TYPE'], ['jinsi', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Hapa kinaonyesha kitendo kinafanyikia wapi.'],
  ['Kielezi "haraka" kinaonyesha ___.', 'jinsi|namna', ['wakati', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Haraka kinaonyesha jinsi kitendo kinavyofanyika.'],
  ['Kielezi "kesho" kinaonyesha ___.', 'wakati', ['jinsi', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Kesho kinaonyesha lini kitendo kitafanyika.'],
  ['Kielezi "mbali" kinaonyesha ___.', 'mahali', ['wakati', 'M4_ADV_TYPE'], ['jinsi', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Mbali kinaonyesha mahali penye umbali.'],
  ['Kielezi "usiku" kinaonyesha ___.', 'wakati', ['jinsi', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Usiku kinaonyesha wakati wa kitendo.'],
  ['Kielezi "vizuri" kinaonyesha ___.', 'jinsi|namna', ['wakati', 'M4_ADV_TYPE'], ['mahali', 'M4_ADV_TYPE'], ['idadi', 'M4_ADV_TYPE'], 'Vizuri kinaonyesha jinsi kitendo kinavyofanyika.'],
];

// ---------------------------------------------------------------- viunganishi
const CONJ = [
  ['Juma ___ Otieno ni marafiki.', 'na', ['lakini', 'M4_CONJ_SWAP'], ['kwa sababu', 'M4_CONJ_SWAP'], ['ili', 'M4_CONJ_SWAP'], '"Na" huunganisha majina mawili: Juma na Otieno.'],
  ['Alitaka kuogelea, ___ ziwa lilikuwa na mawimbi makali.', 'lakini', ['kwa sababu', 'M4_CONJ_SWAP'], ['ili', 'M4_CONJ_SWAP'], ['au', 'M4_CONJ_SWAP'], '"Lakini" huonyesha kinyume: alitaka, ila ziwa lilikuwa na mawimbi.'],
  ['Hatukucheza mpira ___ mvua ilikuwa inanyesha.', 'kwa sababu', ['ili', 'M4_CONJ_SWAP'], ['au', 'M4_CONJ_SWAP'], ['na', 'M4_CONJ_SWAP'], '"Kwa sababu" hutoa sababu: mvua ndiyo sababu ya kutocheza.'],
  ['Utakunywa chai ___ maziwa?', 'au', ['ili', 'M4_CONJ_SWAP'], ['kwa sababu', 'M4_CONJ_SWAP'], ['lakini', 'M4_CONJ_SWAP'], '"Au" huonyesha uchaguzi kati ya vitu viwili.'],
  ['Mimi ni mdogo, ___ ninapenda kusoma.', 'lakini', ['kwa sababu', 'M4_CONJ_SWAP'], ['au', 'M4_CONJ_SWAP'], ['ili', 'M4_CONJ_SWAP'], '"Lakini" huonyesha kinyume: ni mdogo, ila anapenda kusoma.'],
  ['Mama alienda sokoni ___ anunue mboga.', 'ili', ['lakini', 'M4_CONJ_SWAP'], ['kwa sababu', 'M4_CONJ_SWAP'], ['au', 'M4_CONJ_SWAP'], '"Ili" huonyesha kusudi: alienda sokoni kwa kusudi la kununua mboga.'],
  ['Kiunganishi ni neno linalofanya nini?', 'huunganisha maneno au sentensi|huunganisha', ['hutaja kitu', 'M4_CONJ_NOT'], ['huonyesha kitendo', 'M4_CONJ_NOT'], ['huonyesha sifa', 'M4_CONJ_NOT'], 'Kiunganishi huunganisha maneno au sentensi, kama "na", "lakini" na "kwa sababu".'],
];
const CONJ_ID = [
  ['Ni neno lipi ni kiunganishi: "Juma na Otieno wanacheza."', 'na', ['Juma', 'M4_CONJ_NOT'], ['Otieno', 'M4_CONJ_NOT'], ['wanacheza', 'M4_CONJ_NOT'], '"Na" huunganisha majina mawili. Ni kiunganishi.'],
  ['Ni neno lipi ni kiunganishi: "Alitaka kuja lakini alikuwa mgonjwa."', 'lakini', ['Alitaka', 'M4_CONJ_NOT'], ['kuja', 'M4_CONJ_NOT'], ['mgonjwa', 'M4_CONJ_NOT'], '"Lakini" huunganisha sehemu mbili za sentensi. Ni kiunganishi.'],
  ['Ni neno lipi ni kiunganishi: "Hatukwenda kwa sababu mvua ilinyesha."', 'kwa sababu', ['Hatukwenda', 'M4_CONJ_NOT'], ['mvua', 'M4_CONJ_NOT'], ['ilinyesha', 'M4_CONJ_NOT'], '"Kwa sababu" huunganisha kitendo na sababu yake. Ni kiunganishi.'],
  ['Ni neno lipi ni kiunganishi: "Wanjiru anapenda kusoma na kuandika."', 'na', ['Wanjiru', 'M4_CONJ_NOT'], ['kusoma', 'M4_CONJ_NOT'], ['kuandika', 'M4_CONJ_NOT'], '"Na" huunganisha vitendo viwili. Ni kiunganishi.'],
  ['Ni neno lipi ni kiunganishi: "Tuende sokoni au dukani?"', 'au', ['Tuende', 'M4_CONJ_NOT'], ['sokoni', 'M4_CONJ_NOT'], ['dukani', 'M4_CONJ_NOT'], '"Au" huunganisha machaguo mawili. Ni kiunganishi.'],
  ['Ni neno lipi ni kiunganishi: "Baba alinunua mkate pia maziwa."', 'pia', ['Baba', 'M4_CONJ_NOT'], ['mkate', 'M4_CONJ_NOT'], ['maziwa', 'M4_CONJ_NOT'], '"Pia" huongeza kitu kingine. Ni kiunganishi.'],
];

// ---------------------------------------------------------------- vihusishi
const PREP_ID = [
  ['Ni kihusishi kipi katika sentensi: "Kitabu kiko juu ya meza."', 'juu ya', ['Kitabu', 'M4_PREP_NOT'], ['kiko', 'M4_PREP_NOT'], ['meza', 'M4_PREP_NOT'], '"Juu ya" inaonyesha mahali kitabu kilipo kuhusiana na meza. Ni kihusishi.'],
  ['Ni kihusishi kipi katika sentensi: "Baba alikata mkate kwa kisu."', 'kwa', ['Baba', 'M4_PREP_NOT'], ['alikata', 'M4_PREP_NOT'], ['mkate', 'M4_PREP_NOT'], '"Kwa" inaonyesha chombo kilichotumika. Ni kihusishi.'],
  ['Ni kihusishi kipi katika sentensi: "Paka amejificha chini ya kitanda."', 'chini ya', ['Paka', 'M4_PREP_NOT'], ['amejificha', 'M4_PREP_NOT'], ['kitanda', 'M4_PREP_NOT'], '"Chini ya" inaonyesha mahali paka alipo. Ni kihusishi.'],
  ['Ni kihusishi kipi katika sentensi: "Wanafunzi wanasoma ndani ya darasa."', 'ndani ya', ['Wanafunzi', 'M4_PREP_NOT'], ['wanasoma', 'M4_PREP_NOT'], ['darasa', 'M4_PREP_NOT'], '"Ndani ya" inaonyesha mahali wanafunzi wanaposoma. Ni kihusishi.'],
  ['Ni kihusishi kipi katika sentensi: "Otieno ni mrefu kuliko Juma."', 'kuliko', ['Otieno', 'M4_PREP_NOT'], ['mrefu', 'M4_PREP_NOT'], ['Juma', 'M4_PREP_NOT'], '"Kuliko" hulinganisha Otieno na Juma. Ni kihusishi.'],
  ['Ni kihusishi kipi katika sentensi: "Wanafunzi wawili walikaa karibu na mti."', 'karibu na', ['Wanafunzi', 'M4_PREP_NOT'], ['walikaa', 'M4_PREP_NOT'], ['mti', 'M4_PREP_NOT'], '"Karibu na" inaonyesha mahali walipokaa. Ni kihusishi.'],
];
const PREP_A = [
  ['Kitabu ___ mwalimu kiko mezani.', 'cha', ['wa', 'M4_PREP_A_CLASS'], ['ya', 'M4_PREP_A_CLASS'], ['la', 'M4_PREP_A_CLASS'], 'Kitabu ni cha ngeli ya KI-VI. Kihusishi ni "cha": kitabu cha mwalimu.'],
  ['Vitabu ___ mwalimu viko mezani.', 'vya', ['cha', 'M4_PREP_A_CLASS'], ['wa', 'M4_PREP_A_CLASS'], ['za', 'M4_PREP_A_CLASS'], 'Vitabu ni vya ngeli ya KI-VI (wingi). Kihusishi ni "vya": vitabu vya mwalimu.'],
  ['Mlango ___ darasa umefunguliwa.', 'wa', ['cha', 'M4_PREP_A_CLASS'], ['ya', 'M4_PREP_A_CLASS'], ['la', 'M4_PREP_A_CLASS'], 'Mlango ni wa ngeli ya U-I. Kihusishi ni "wa": mlango wa darasa.'],
  ['Milango ___ darasa imefunguliwa.', 'ya', ['wa', 'M4_PREP_A_CLASS'], ['cha', 'M4_PREP_A_CLASS'], ['la', 'M4_PREP_A_CLASS'], 'Milango ni ya ngeli ya U-I (wingi). Kihusishi ni "ya": milango ya darasa.'],
  ['Jina ___ mtoto ni Achieng.', 'la', ['wa', 'M4_PREP_A_CLASS'], ['cha', 'M4_PREP_A_CLASS'], ['ya', 'M4_PREP_A_CLASS'], 'Jina ni la ngeli ya LI-YA. Kihusishi ni "la": jina la mtoto.'],
  ['Nyumba ___ bibi iko kijijini.', 'ya', ['wa', 'M4_PREP_A_CLASS'], ['cha', 'M4_PREP_A_CLASS'], ['la', 'M4_PREP_A_CLASS'], 'Nyumba ni ya ngeli ya I-ZI. Kihusishi ni "ya": nyumba ya bibi.'],
  ['Mtoto ___ Atieno anasoma.', 'wa', ['cha', 'M4_PREP_A_CLASS'], ['la', 'M4_PREP_A_CLASS'], ['ya', 'M4_PREP_A_CLASS'], 'Mtoto ni wa ngeli ya A-WA. Kihusishi ni "wa": mtoto wa Atieno.'],
];
const PREP_PLACE = [
  ['Samaki wanaishi ___ ya maji, si nje yake.', 'ndani', ['juu', 'M4_PREP_SWAP'], ['nyuma', 'M4_PREP_SWAP'], ['mbali', 'M4_PREP_SWAP'], '"Ndani ya" ni kinyume cha "nje ya": samaki wanaishi ndani ya maji.'],
  ['Ndege wanaruka ___ ya miti, angani, na si ardhini.', 'juu', ['chini', 'M4_PREP_SWAP'], ['ndani', 'M4_PREP_SWAP'], ['karibu', 'M4_PREP_SWAP'], '"Juu ya" ni kinyume cha "chini ya": ndege wanaruka juu ya miti.'],
  ['Mizizi ya mti iko ___ ya ardhi, si juu yake.', 'chini', ['juu', 'M4_PREP_SWAP'], ['nje', 'M4_PREP_SWAP'], ['mbali', 'M4_PREP_SWAP'], '"Chini ya" ni kinyume cha "juu ya": mizizi iko chini ya ardhi.'],
  ['Wanafunzi walicheza ___ ya darasa, si ndani yake.', 'nje', ['ndani', 'M4_PREP_SWAP'], ['chini', 'M4_PREP_SWAP'], ['juu', 'M4_PREP_SWAP'], '"Nje ya" ni kinyume cha "ndani ya": walicheza nje ya darasa.'],
  ['Shule yetu iko ___ na kanisa, hatuendi mbali.', 'karibu', ['mbali', 'M4_PREP_SWAP'], ['juu', 'M4_PREP_SWAP'], ['nje', 'M4_PREP_SWAP'], '"Karibu na" ni kinyume cha "mbali na": shule iko karibu na kanisa.'],
  ['Kijiji cha bibi kiko ___ na mji, tunasafiri saa nzima.', 'mbali', ['karibu', 'M4_PREP_SWAP'], ['ndani', 'M4_PREP_SWAP'], ['chini', 'M4_PREP_SWAP'], '"Mbali na" ni kinyume cha "karibu na": kijiji kiko mbali na mji.'],
];

// ---------------------------------------------------------------- vihisishi
const INT_SIT = [
  ['Mwenzako ameanguka na kuumia. Utasema ___!', 'Pole', ['Hongera', 'M4_INT_SWAP'], ['Karibu', 'M4_INT_SWAP'], ['Kwaheri', 'M4_INT_SWAP'], '"Pole!" husemwa kwa mtu aliyeumia au mwenye huzuni.'],
  ['Rafiki yako amepita mtihani. Utasema ___!', 'Hongera', ['Pole', 'M4_INT_SWAP'], ['Samahani', 'M4_INT_SWAP'], ['Kwaheri', 'M4_INT_SWAP'], '"Hongera!" husemwa kwa mtu aliyefanikiwa.'],
  ['Umemgonga mwenzako kwa bahati mbaya. Utasema ___!', 'Samahani', ['Hongera', 'M4_INT_SWAP'], ['Karibu', 'M4_INT_SWAP'], ['Kwaheri', 'M4_INT_SWAP'], '"Samahani!" husemwa ukikosea au ukimkosea mtu.'],
  ['Mgeni amefika nyumbani kwenu. Utasema ___!', 'Karibu', ['Kwaheri', 'M4_INT_SWAP'], ['Hongera', 'M4_INT_SWAP'], ['Samahani', 'M4_INT_SWAP'], '"Karibu!" husemwa kumkaribisha mgeni.'],
  ['Mgeni anaondoka nyumbani kwenu. Utasema ___!', 'Kwaheri', ['Karibu', 'M4_INT_SWAP'], ['Hongera', 'M4_INT_SWAP'], ['Samahani', 'M4_INT_SWAP'], '"Kwaheri!" husemwa mtu anapoondoka.'],
  ['Umeona nyoka mkubwa ghafla. Utasema ___!', 'Lo', ['Hongera', 'M4_INT_SWAP'], ['Karibu', 'M4_INT_SWAP'], ['Kwaheri', 'M4_INT_SWAP'], '"Lo!" huonyesha mshangao au hofu ya ghafla.'],
  ['Kihisishi ni neno linaloonyesha ___.', 'hisia', ['jina', 'M4_INT_NOT'], ['kitendo', 'M4_INT_NOT'], ['mahali', 'M4_INT_NOT'], 'Kihisishi kinaonyesha hisia, kama furaha, huzuni au mshangao, na huandikwa pamoja na alama ya hisi (!).'],
];
const INT_ID = [
  ['Ni kihisishi kipi katika sentensi: "Hongera! Juma ameshinda mbio za shule."', 'Hongera', ['Juma', 'M4_INT_NOT'], ['ameshinda', 'M4_INT_NOT'], ['mbio', 'M4_INT_NOT'], '"Hongera!" kinaonyesha furaha na kina alama ya hisi. Ni kihisishi.'],
  ['Ni kihisishi kipi katika sentensi: "Pole! Mtoto ameanguka uwanjani."', 'Pole', ['Mtoto', 'M4_INT_NOT'], ['ameanguka', 'M4_INT_NOT'], ['uwanjani', 'M4_INT_NOT'], '"Pole!" kinaonyesha huruma na kina alama ya hisi. Ni kihisishi.'],
  ['Ni kihisishi kipi katika sentensi: "Lo! Nyoka ameingia nyumbani."', 'Lo', ['Nyoka', 'M4_INT_NOT'], ['ameingia', 'M4_INT_NOT'], ['nyumbani', 'M4_INT_NOT'], '"Lo!" kinaonyesha mshangao na kina alama ya hisi. Ni kihisishi.'],
  ['Ni kihisishi kipi katika sentensi: "Oyee! Timu yetu imeshinda mechi."', 'Oyee', ['Timu', 'M4_INT_NOT'], ['imeshinda', 'M4_INT_NOT'], ['mechi', 'M4_INT_NOT'], '"Oyee!" kinaonyesha shangwe na kina alama ya hisi. Ni kihisishi.'],
  ['Ni kihisishi kipi katika sentensi: "Ala! Mvua imenyesha tena leo."', 'Ala', ['Mvua', 'M4_INT_NOT'], ['imenyesha', 'M4_INT_NOT'], ['leo', 'M4_INT_NOT'], '"Ala!" kinaonyesha mshangao na kina alama ya hisi. Ni kihisishi.'],
  ['Ni kihisishi kipi katika sentensi: "Samahani! Nimekuchelewesha kwa dakika kumi."', 'Samahani', ['Nimekuchelewesha', 'M4_INT_NOT'], ['dakika', 'M4_INT_NOT'], ['kumi', 'M4_INT_NOT'], '"Samahani!" kinaonyesha kujuta na kina alama ya hisi. Ni kihisishi.'],
];

export const FAMILIES = [
  // ---- NOMINO
  ...trio('nomino', 'SARUFI.T1_NOMINO.NOMINO', NOM_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika nomino inayokosekana:', topic: 'kuhusu nomino', thinOk: true, hints: H('Fikiria majina ya watu, wanyama, mahali na vitu unavyoviona kila siku.', 'Neno la kufanya jambo si jina la kitu.') }),
  ...one('nomino.tambua', 'SARUFI.T1_NOMINO.NOMINO', NOM_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Jiulize: je, ni jina la mtu, mnyama, mahali au kitu?', 'Neno la kitendo si nomino.') }),
  // ---- VITENZI
  ...trio('vitenzi', 'SARUFI.T1_VITENZI.VITENZI', VERB_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika neno linalokosekana:', topic: 'kuhusu vitenzi', hints: H('Fikiria: nani anafanya nini?', 'Jina la kitu halisemi nani anafanya nini.') }),
  ...one('vitenzi.tambua', 'SARUFI.T1_VITENZI.VITENZI', VERB_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Jiulize: je, neno hili linaonyesha kitendo?', 'Kitenzi hubadilika kulingana na anayefanya na wakati.') }),
  // ---- VIVUMISHI
  ...trio('vivumishi', 'SARUFI.T1_VIVUMISHI.VIVUMISHI', ADJ_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika kivumishi kinachokosekana:', topic: 'kuhusu vivumishi', thinOk: true, hints: H('Fikiria neno linaloeleza kitu au mtu kikoje au ni wangapi.', 'Neno hili hubadilika kulingana na jina lake: moja au nyingi.') }),
  ...one('vivumishi.tambua', 'SARUFI.T1_VIVUMISHI.VIVUMISHI', ADJ_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Kivumishi kinaeleza nomino ikoje au ni ngapi.', 'Nomino ni jina la kitu, si kivumishi.') }),
  // ---- VIWAKILISHI
  ...trio('viwakilishi', 'SARUFI.T2_VIWAKILISHI.VIWAKILISHI', PRON_GAP, { stem: 'Chagua kiwakilishi kinachokamilisha sentensi.', gapStem: 'Andika kiwakilishi kinachokosekana:', topic: 'kuhusu viwakilishi', thinOk: true, hints: H('Hesabu watu: mmoja au wengi? Wako karibu au mbali?', 'Neno hili linasimama mahali pa jina, kwa hiyo hatulirudii jina.') }),
  ...one('viwakilishi.tambua', 'SARUFI.T2_VIWAKILISHI.VIWAKILISHI', PRON_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Kiwakilishi hutumika mahali pa jina la mtu.', 'Jina lenyewe si kiwakilishi.') }),
  // ---- VIELEZI
  ...trio('vielezi', 'SARUFI.T2_VIELEZI.VIELEZI', ADV_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika kielezi kinachokosekana:', topic: 'kuhusu vielezi', hints: H('Kielezi kinaonyesha jinsi, wakati au mahali kitendo kinapofanyika.', 'Kivumishi huenda na nomino, kielezi huenda na kitenzi.') }),
  ...duo('vielezi.aina', 'SARUFI.T2_VIELEZI.VIELEZI', ADV_TYPE.map(([t, r, ...rest]) => [t, r, ...rest]), { stem: 'Chagua jibu sahihi.', tag: 'aina', oc: ['a', 'a'], topic: 'kuhusu aina za vielezi', hints: H('Jiulize: kielezi hiki kinajibu "lini", "wapi" au "vipi"?', 'Vielezi vya wakati, mahali na jinsi ni aina tatu.') }),
  // ---- VIUNGANISHI
  ...trio('viunganishi', 'SARUFI.T3_VIUNGANISHI.VIUNGANISHI', CONJ, { stem: 'Chagua kiunganishi kinachofaa.', gapStem: 'Andika kiunganishi kinachokosekana:', topic: 'kuhusu viunganishi', hints: H('Soma sehemu mbili za sentensi: zinaongezana, zinapingana, au moja ni sababu?', 'Kila kiunganishi kina kazi yake.') }),
  ...one('viunganishi.tambua', 'SARUFI.T3_VIUNGANISHI.VIUNGANISHI', CONJ_ID, { stem: 'Chagua jibu sahihi.', oc: 'b', tag: 'tambua', rung: 1, hints: H('Kiunganishi huunganisha maneno au sehemu za sentensi.', 'Jina na kitenzi si viunganishi.') }),
  // ---- VIHUSISHI
  ...duo('vihusishi.tambua', 'SARUFI.T3_VIHUSISHI.VIHUSISHI', PREP_ID, { stem: 'Chagua jibu sahihi.', oc: ['b', 'b'], topic: 'kuhusu vihusishi', hints: H('Kihusishi huonyesha mahali, chombo au ulinganisho.', 'Jina la kitu si kihusishi.') }),
  ...trio('vihusishi.a', 'SARUFI.T3_VIHUSISHI.VIHUSISHI', PREP_A, { stem: 'Chagua kihusishi cha "a" kinachofaa.', gapStem: 'Andika kihusishi kinachokosekana:', tag: 'a', oc: ['c', 'c', 'c'], topic: 'kuhusu kihusishi cha "a"', hints: H('Jiulize: nomino iko katika ngeli gani?', 'Kihusishi hubadilika kulingana na ngeli ya nomino.') }),
  ...one('vihusishi.mahali', 'SARUFI.T3_VIHUSISHI.VIHUSISHI', PREP_PLACE, { stem: 'Chagua neno linalokamilisha sentensi.', oc: 'c', tag: 'mahali', rung: 2, hints: H('Soma kidokezo kilicho kwenye sentensi.', '"Ndani" na "nje" ni vinyume, na "juu" na "chini" pia.') }),
  // ---- VIHISISHI
  ...trio('vihisishi', 'SARUFI.T3_VIHISISHI.VIHISISHI', INT_SIT, { stem: 'Chagua kihisishi kinachofaa.', gapStem: 'Andika kihisishi kinachofaa:', topic: 'kuhusu vihisishi', hints: H('Fikiria mtu huyo anahisi nini.', 'Kihisishi huandikwa na alama ya hisi (!).') }),
  ...duo('vihisishi.tambua', 'SARUFI.T3_VIHISISHI.VIHISISHI', INT_ID, { stem: 'Chagua jibu sahihi.', oc: ['b', 'd'], tag: 'tambua', topic: 'kuhusu vihisishi', hints: H('Kihisishi kinaonyesha hisia na huwa na alama ya hisi (!).', 'Jina na kitenzi si vihisishi.') }),
];
