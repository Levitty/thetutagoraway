// ============================================================================
// KISWAHILI GRADE 7, SARUFI A (7 skills): nomino za pekee na za kawaida, makundi na dhahania, wingi na vitenzi-jina, nyakati, hali ya
// kuendelea, vitenzi vikuu na visaidizi, vitenzi vishirikishi. Written offline from the KICD design through the curriculum map. Every wrong
// answer names the library misconception it reveals. All stay reviewed:false until a native Kiswahili teacher signs them off.
// ============================================================================
import { S } from './kiswahili_g7_lib.js';

export const FAMILIES = [
  ...S('np', 'SARUFI.T1_AINA_ZA_NOMINO.', 'NOMINO_PEKEE', ['NP_KAWAIDA_KUBWA', 'NP_PEKEE_NDOGO', 'NP_JINA_JUMLA'], ['Nomino ya pekee ni jina mahususi.', 'Nomino ya pekee huanza kwa herufi kubwa; ya kawaida ni jina la jumla.'], [
    ['Ni nomino ipi ni ya pekee?', 'Kisumu', 'mji', 'ziwa', 'shule'],
    ['Ni nomino ipi ni ya kawaida?', 'kijiji', 'Wanjiru', 'Mombasa', 'Kenya'],
    ['Nomino ya pekee huandikwa kwa herufi gani mwanzoni?', 'Herufi kubwa', 'Herufi ndogo', 'Herufi yoyote', 'Herufi nzito'],
    ['Katika "Otieno anasoma kitabu", ni nomino ipi ni ya pekee?', 'Otieno', 'kitabu', 'anasoma', 'sentensi'],
    ['Ni jozi ipi ina nomino ya pekee na ya kawaida?', 'Tana na mto', 'mto na ziwa', 'Nairobi na Kisumu', 'mlima na mji'],
  ], [
    ['Wanjiru alisafiri hadi Mombasa kwa basi. Ni nomino ipi ni ya pekee ya mahali?', 'Mombasa', 'safari', 'basi', 'barabara'],
    ['Mwalimu alitufundisha jana. Ni nomino ipi ni ya kawaida?', 'mwalimu', 'jana', 'Kenya', 'Juma'],
    ['Mto Nile ni mrefu. Ni neno lipi ni la pekee?', 'Nile', 'mto', 'mrefu', 'ni'],
    ['Amina alinunua kitabu sokoni. Ni nomino ipi ya kawaida ya mahali?', 'sokoni', 'Amina', 'kitabu', 'alinunua'],
    ['Tuliona milima Kilimanjaro na Kenya. Ni nomino ipi ni ya kawaida?', 'milima', 'Kilimanjaro', 'Kenya', 'Tuliona'],
  ], [
    ['Ni hatua ipi ina kosa kuhusu nomino ya pekee?', 'Hatua 1: Nairobi ni jina la mji mahususi.', 'Hatua 2: Ni nomino ya pekee.', 'Hatua 3: Kwa hiyo naiandika "nairobi" kwa herufi ndogo.', 'Nomino ya pekee huandikwa kwa herufi kubwa: Nairobi.', 1],
    ['Ni hatua ipi ina kosa kuhusu nomino ya kawaida?', 'Hatua 1: Neno mji ni jina la jumla.', 'Hatua 2: Halimtaji mji mmoja mahususi.', 'Hatua 3: Kwa hiyo mji ni nomino ya pekee.', 'Mji ni nomino ya kawaida kwa sababu ni jina la jumla.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Wanjiru ni jina la msichana.', 'Hatua 2: Ni jina mahususi.', 'Hatua 3: Kwa hiyo ni nomino ya kawaida.', 'Wanjiru ni nomino ya pekee kwa sababu ni jina mahususi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mto ni jina la jumla.', 'Hatua 2: Mto Tana ni jina mahususi.', 'Hatua 3: Kwa hiyo naandika "Mto" kwa herufi kubwa kila mahali katikati ya sentensi.', 'Nomino ya kawaida haihitaji herufi kubwa katikati ya sentensi.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kenya ni jina la nchi.', 'Hatua 2: Ni nomino ya pekee.', 'Hatua 3: Naiandika "kenya" kwa herufi ndogo.', 'Nomino ya pekee huanza kwa herufi kubwa: Kenya.', 1],
  ], ['a', 'c', 'b']),
  ...S('nm', 'SARUFI.T2_AINA_ZA_NOMINO.', 'NOMINO_MAKUNDI', ['NM_MOJA', 'NM_SHIKIKA', 'NM_KUNDI_DHAHANIA'], ['Nomino ya makundi hutaja kundi.', 'Nomino ya dhahania haishikiki.'], [
    ['Ni nomino ipi ni ya makundi?', 'kikosi', 'mwanafunzi', 'meza', 'upendo'],
    ['Ni nomino ipi ni ya dhahania?', 'upendo', 'meza', 'kikosi', 'kitabu'],
    ['Neno jeshi ni nomino ya aina gani?', 'makundi', 'dhahania', 'pekee', 'kitenzi'],
    ['Ni nomino ipi huonyesha hisia isiyoshikika?', 'furaha', 'mbuzi', 'kundi', 'daftari'],
    ['Ni neno lipi hutaja kundi?', 'kundi la ndege', 'ndege mmoja', 'wingu', 'manyoya'],
  ], [
    ['Wanajeshi walijitahidi kwa ushujaa. Ni nomino ipi ni ya dhahania?', 'ushujaa', 'wanajeshi', 'walijitahidi', 'kwa'],
    ['Kikosi cha polisi kilifika mapema. Ni nomino ipi ni ya makundi?', 'kikosi', 'polisi', 'mapema', 'kilifika'],
    ['Mama ana huruma nyingi. Ni nomino ipi ni ya dhahania?', 'huruma', 'mama', 'nyingi', 'ana'],
    ['Kundi la ng\'ombe lilivuka mto. Ni nomino ipi ni ya makundi?', 'kundi', 'mto', 'ng\'ombe', 'lilivuka'],
    ['Watoto walicheka kwa furaha. Ni nomino ipi ni ya dhahania?', 'furaha', 'watoto', 'walicheka', 'kwa'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kikosi hutaja askari wengi pamoja.', 'Hatua 2: Ni kundi.', 'Hatua 3: Kwa hiyo kikosi ni nomino ya dhahania.', 'Kikosi ni nomino ya makundi kwa sababu hutaja kundi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Upendo ni hisia.', 'Hatua 2: Hauwezi kushikwa.', 'Hatua 3: Kwa hiyo ni nomino inayoshikika.', 'Upendo ni nomino ya dhahania kwa sababu haishikiki.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jeshi lina askari wengi.', 'Hatua 2: Hutaja kundi.', 'Hatua 3: Kwa hiyo jeshi ni nomino ya dhahania.', 'Jeshi ni nomino ya makundi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Furaha ni hisia.', 'Hatua 2: Hatuwezi kuigusa.', 'Hatua 3: Kwa hiyo furaha ni jina la kitu kimoja kinachoshikika.', 'Furaha ni nomino ya dhahania.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kundi la ndege lina ndege wengi.', 'Hatua 2: Ni nomino ya kundi.', 'Hatua 3: Kwa hiyo kundi hutaja kitu kimoja tu.', 'Nomino ya makundi hutaja viumbe au vitu vingi pamoja.', 0],
  ], ['a', 'b']),
  ...S('nw', 'SARUFI.T3_AINA_ZA_NOMINO.', 'NOMINO_WINGI', ['NW_KITENZI_JINA', 'NW_MAJI_MOJA', 'NW_KUSOMA'], ['Kitenzi-jina huanza kwa ku-.', 'Nomino za wingi kama maji hazina umoja.'], [
    ['Ni kitenzi-jina kipi?', 'kuimba', 'mwimbaji', 'wimbo', 'huimba'],
    ['Ni nomino ipi ya wingi isiyo na umoja?', 'maji', 'kiti', 'mti', 'kitabu'],
    ['Ni kitenzi-jina kipi miongoni mwa hivi?', 'kusoma', 'msomaji', 'somo', 'alisoma'],
    ['Ni neno lipi halina umoja?', 'mafuta', 'mbwa', 'shule', 'mkono'],
    ['Ni neno lipi huanza kwa ku- na hutaja tendo?', 'kucheza', 'mchezo', 'mchezaji', 'tulicheza'],
  ], [
    ['Kusoma ni muhimu. Neno kusoma ni nini?', 'kitenzi-jina', 'kitenzi kikuu', 'kielezi', 'kivumishi'],
    ['Mama alinunua mafuta. Mafuta ni nomino ya aina gani?', 'wingi', 'pekee', 'ya makundi', 'ya dhahania'],
    ['Kuimba hufurahisha. Ni kitenzi-jina kipi?', 'kuimba', 'hufurahisha', 'mwimbaji', 'wimbo'],
    ['Tulikunywa maji. Ni nomino ipi ya wingi?', 'maji', 'tulikunywa', 'kunywa', 'mnywaji'],
    ['Kulima ni kazi ngumu. Ni kitenzi-jina kipi?', 'kulima', 'kazi', 'ngumu', 'mkulima'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kuimba huanza kwa ku-.', 'Hatua 2: Ni jina la tendo.', 'Hatua 3: Kwa hiyo si kitenzi-jina.', 'Kuimba ni kitenzi-jina kwa sababu huanza kwa ku- na hutaja tendo.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Maji hayahesabiki kwa umoja.', 'Hatua 2: Ni nomino ya wingi.', 'Hatua 3: Kwa hiyo tunasema "maji moja".', 'Maji ni ya wingi, hayana umoja.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Kusoma ni muhimu" ina neno kusoma.', 'Hatua 2: Linataja jambo.', 'Hatua 3: Kwa hiyo ni kitenzi kikuu pekee.', 'Hapa kusoma ni kitenzi-jina.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mafuta ni nomino ya wingi.', 'Hatua 2: Hayana umoja.', 'Hatua 3: Kwa hiyo tunasema "mafuta mawili" kama vitu vya kuhesabu bila kipimo.', 'Mafuta hupimwa kwa vipimo, hayahesabiwi kama vitu vimoja.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kucheza ni kitenzi-jina.', 'Hatua 2: Huanza kwa ku-.', 'Hatua 3: Kwa hiyo mchezaji ni kitenzi-jina pia.', 'Mchezaji ni jina la mtu, si kitenzi-jina.', 0],
  ], ['a', 'b']),
  ...S('ny', 'SARUFI.T4_NYAKATI_NA_HALI.', 'NYAKATI_MSINGI', ['NY_LI', 'NY_NA', 'NY_TA'], ['-li- ni uliopita, -na- ni uliopo, -ta- ni ujao.', 'Tazama kiambishi cha wakati katika kitenzi.'], [
    ['Katika "Juma alicheza jana", wakati ni upi?', 'uliopita', 'ujao', 'uliopo', 'wa masharti'],
    ['Katika "Mama anapika sasa", wakati ni upi?', 'uliopo', 'uliopita', 'ujao', 'wa masharti'],
    ['Katika "Tutasafiri kesho", wakati ni upi?', 'ujao', 'uliopo', 'uliopita', 'wa masharti'],
    ['Ni kiambishi kipi cha wakati uliopita?', '-li-', '-ta-', '-na-', '-ku-'],
    ['Ni kitenzi kipi kiko katika wakati ujao?', 'atafika', 'amefika', 'alifika', 'anafika'],
  ], [
    ['Jana nilisoma kitabu. Kitenzi nilisoma kiko katika wakati upi?', 'uliopita', 'ujao', 'uliopo', 'wa masharti'],
    ['Sasa watoto wanacheza. Kitenzi wanacheza kiko katika wakati upi?', 'uliopo', 'uliopita', 'ujao', 'wa masharti'],
    ['Kesho tutaenda sokoni. Kitenzi tutaenda kiko katika wakati upi?', 'ujao', 'uliopo', 'uliopita', 'wa masharti'],
    ['Kamilisha kwa wakati uliopita: Baba ___ kazini jana. (kwenda)', 'alikwenda', 'atakwenda', 'anakwenda', 'hakwenda'],
    ['Kamilisha kwa wakati ujao: Wanafunzi ___ kesho. (kuja)', 'watakuja', 'walikuja', 'wanakuja', 'hawakuja'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Alicheza" lina kiambishi -li-.', 'Hatua 2: -li- huonyesha tendo lililotokea.', 'Hatua 3: Kwa hiyo "alicheza" ni wakati ujao.', '"Alicheza" ni wakati uliopita.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Anapika" lina kiambishi -na-.', 'Hatua 2: Tendo linaendelea sasa.', 'Hatua 3: Kwa hiyo ni wakati uliopita.', '"Anapika" ni wakati uliopo.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Tutasafiri" lina kiambishi -ta-.', 'Hatua 2: Tendo bado halijatokea.', 'Hatua 3: Kwa hiyo ni wakati uliopo.', '"Tutasafiri" ni wakati ujao.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jana ni wakati uliopita.', 'Hatua 2: Tunatumia -li- kwa jana.', 'Hatua 3: Kwa hiyo tunasema "Jana atasoma".', 'Tunasema "Jana alisoma".', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kesho ni wakati ujao.', 'Hatua 2: Tunatumia -ta- kwa kesho.', 'Hatua 3: Kwa hiyo tunasema "Kesho alisoma".', 'Tunasema "Kesho atasoma".', 2],
  ], ['a', 'b']),
  ...S('nk', 'SARUFI.T5_NYAKATI_NA_HALI.', 'NYAKATI_KUENDELEA', ['NK_AKISOMA', 'NK_ALIKUWA', 'NK_PAST_SIMPLE'], ['Alikuwa akisoma ni uliopita hali ya kuendelea.', 'Atakuwa akisoma ni ujao hali ya kuendelea.'], [
    ['Ni sentensi ipi iko katika ujao hali ya kuendelea?', 'Atakuwa akisoma kesho', 'Alikuwa akisoma jana', 'Anasoma sasa', 'Alisoma jana'],
    ['Alikuwa akipika humaanisha nini?', 'Alikuwa katikati ya kupika wakati huo', 'Alimaliza kupika', 'Atapika kesho', 'Hapiki kamwe'],
    ['Ni sentensi ipi ni uliopita hali ya kuendelea?', 'Walikuwa wakicheza uwanjani', 'Walicheza uwanjani', 'Watacheza uwanjani', 'Wanacheza uwanjani'],
    ['Ni sentensi ipi ni ujao hali ya kuendelea?', 'Tutakuwa tukiimba', 'Tulikuwa tukiimba', 'Tuliimba', 'Tunaimba'],
    ['Alikuwa akiandika ni wakati upi?', 'uliopita hali ya kuendelea', 'ujao hali ya kuendelea', 'uliopo', 'ujao'],
  ], [
    ['Mama aliingia nyumbani. Baba ___ akipika. Chagua kitenzi sahihi.', 'alikuwa', 'atakuwa', 'anakuwa', 'amekuwa'],
    ['Saa tatu kesho, mimi ___ nikisoma. Chagua kitenzi sahihi.', 'nitakuwa', 'nilikuwa', 'ninakuwa', 'nimekuwa'],
    ['Ni sentensi ipi inaonyesha tendo lililokuwa likiendelea jana?', 'Wanafunzi walikuwa wakiandika', 'Wanafunzi waliandika', 'Wanafunzi wataandika', 'Wanafunzi wanaandika'],
    ['Jioni ya kesho watoto ___ wakicheza. Chagua kitenzi sahihi.', 'watakuwa', 'walikuwa', 'wanakuwa', 'wamekuwa'],
    ['Ni sentensi ipi iko katika uliopita hali ya kuendelea?', 'Nilikuwa nikiimba', 'Nitakuwa nikiimba', 'Naimba', 'Niliimba'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Atakuwa akisoma" ina -ta-.', 'Hatua 2: Tendo litakuwa likiendelea baadaye.', 'Hatua 3: Kwa hiyo ni uliopita hali ya kuendelea.', '"Atakuwa akisoma" ni ujao hali ya kuendelea.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Alikuwa akipika" ina -li-.', 'Hatua 2: Tendo lilikuwa likiendelea.', 'Hatua 3: Kwa hiyo alimaliza kupika.', '"Alikuwa akipika" humaanisha alikuwa katikati ya kupika.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Walicheza" ni kitenzi kimoja.', 'Hatua 2: Hakina "walikuwa".', 'Hatua 3: Kwa hiyo ni uliopita hali ya kuendelea.', '"Walicheza" ni uliopita wa kawaida.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Tutakuwa tukiimba" ina -ta-.', 'Hatua 2: Tendo litakuwa likiendelea.', 'Hatua 3: Kwa hiyo ni wakati uliopita.', 'Ni ujao hali ya kuendelea.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Hali ya kuendelea hutumia kisaidizi.', 'Hatua 2: Kisaidizi ni alikuwa au atakuwa.', 'Hatua 3: Kwa hiyo tunasema "Alisoma akiwa".', 'Tunasema "Alikuwa akisoma".', 0],
  ], ['a', 'b']),
  ...S('vv', 'SARUFI.T6_VITENZI.', 'VITENZI_VIKUU', ['VV_KISAIDIZI_KUU', 'VV_KUU_KISAIDIZI', 'VV_SENTENSI'], ['Kitenzi kikuu hubeba tendo.', 'Kisaidizi hutangulia kitenzi kikuu.'], [
    ['Katika "Alikuwa akisoma", kitenzi kikuu ni kipi?', 'akisoma', 'alikuwa', 'Alikuwa akisoma', 'hakuna'],
    ['Katika "Atakuwa akifanya kazi", kisaidizi ni kipi?', 'atakuwa', 'akifanya', 'kazi', 'hakuna'],
    ['Katika "Walikuwa wakicheza", kitenzi kikuu ni kipi?', 'wakicheza', 'walikuwa', 'Walikuwa', 'hakuna'],
    ['Kitenzi kisaidizi hufanya nini?', 'Husaidia kitenzi kikuu', 'Hubeba tendo pekee', 'Huchukua nafasi ya nomino', 'Huisha sentensi'],
    ['Katika "Tutakuwa tukiimba", kitenzi kikuu ni kipi?', 'tukiimba', 'tutakuwa', 'tutakuwa tukiimba', 'hakuna'],
  ], [
    ['Mama alikuwa akipika. Ni neno lipi ni kitenzi kisaidizi?', 'alikuwa', 'akipika', 'Mama', 'hakuna'],
    ['Juma atakuwa akisoma. Ni neno lipi ni kitenzi kikuu?', 'akisoma', 'atakuwa', 'Juma', 'hakuna'],
    ['Watoto walikuwa wakiimba. Kisaidizi ni kipi?', 'walikuwa', 'wakiimba', 'Watoto', 'hakuna'],
    ['Nilikuwa nikilima. Kitenzi kikuu ni kipi?', 'nikilima', 'nilikuwa', 'Nilikuwa', 'hakuna'],
    ['Walikuwa wakicheza. Sentensi hii ina vitenzi vingapi?', 'viwili', 'kimoja', 'vitatu', 'hakuna'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Katika "Alikuwa akisoma" kuna maneno mawili ya kitenzi.', 'Hatua 2: Linalobeba tendo ni "akisoma".', 'Hatua 3: Kwa hiyo "alikuwa" ni kitenzi kikuu.', '"Akisoma" ndicho kitenzi kikuu; "alikuwa" ni kisaidizi.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Atakuwa" hutangulia kitenzi kingine.', 'Hatua 2: Hakibebi tendo kikuu.', 'Hatua 3: Kwa hiyo "atakuwa" ni kitenzi kikuu.', '"Atakuwa" ni kitenzi kisaidizi.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Walikuwa wakicheza" ina maneno mawili ya kitenzi.', 'Hatua 2: Kimoja ni kisaidizi.', 'Hatua 3: Kwa hiyo sentensi ina kitenzi kimoja tu.', 'Sentensi ina vitenzi viwili: kisaidizi na kikuu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kitenzi kikuu hubeba tendo.', 'Hatua 2: "Nikilima" hubeba tendo la kulima.', 'Hatua 3: Kwa hiyo "nilikuwa" ndicho kikuu.', '"Nikilima" ni kikuu.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Visaidizi husaidia vikuu.', 'Hatua 2: Hutangulia vikuu.', 'Hatua 3: Kwa hiyo hufuata vikuu daima.', 'Visaidizi hutangulia vikuu.', 0],
  ], ['a', 'b']),
  ...S('vs', 'SARUFI.T7_VITENZI_VISHIRIKISHI.', 'VISHIRIKISHI', ['VS_NI_SI', 'VS_YUKO', 'VS_SIO'], ['Si hukanusha; ni huthibitisha.', 'Yuko ni kwa mmoja; wako ni kwa wengi.'], [
    ['Ni kitenzi kishirikishi kipi cha kukanusha?', 'si', 'ni', 'ndiye', 'yuko'],
    ['Kamilisha: Wanafunzi ___ darasani.', 'wako', 'yuko', 'ni', 'si'],
    ['Kamilisha: Mwalimu ___ darasani.', 'yuko', 'wako', 'kuko', 'mko'],
    ['Katika "Huyu si mwalimu", si ina kazi gani?', 'kukanusha', 'kuthibitisha', 'kuuliza', 'kuita'],
    ['Ni sentensi ipi ina kishirikishi cha kuthibitisha?', 'Yeye ni daktari', 'Yeye si daktari', 'Yeye hasomi', 'Yeye hakuja'],
  ], [
    ['Kamilisha: Baba na mama ___ nyumbani.', 'wako', 'yuko', 'si', 'kuko'],
    ['Kamilisha: Kitabu ___ mezani.', 'kiko', 'wako', 'yuko', 'si'],
    ['Kamilisha: Juma ___ mwanafunzi mzuri.', 'ni', 'si', 'wako', 'yuko'],
    ['Kamilisha: Mimi ___ mgonjwa leo; nimepona.', 'si', 'ni', 'wako', 'yuko'],
    ['Kamilisha: Ndugu zangu ___ shuleni.', 'wako', 'yuko', 'si', 'ni'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Wanafunzi ni wengi.', 'Hatua 2: Tunatumia kishirikishi cha wingi.', 'Hatua 3: Kwa hiyo tunasema "Wanafunzi yuko darasani".', 'Tunasema "Wanafunzi wako darasani".', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Si hukanusha.', 'Hatua 2: Ni huthibitisha.', 'Hatua 3: Kwa hiyo "Yeye si mwalimu" inathibitisha.', '"Si" hukanusha: yeye si mwalimu.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Huyu sio mwalimu" ina neno sio.', 'Hatua 2: Sio ni kishirikishi cha kukanusha.', 'Hatua 3: Kwa hiyo sentensi inathibitisha.', 'Sentensi inakanusha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mwalimu ni mmoja.', 'Hatua 2: Tunasema "yuko".', 'Hatua 3: Kwa hiyo tunasema "Mwalimu wako darasani".', 'Tunasema "Mwalimu yuko darasani".', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kishirikishi cha kuthibitisha ni ni.', 'Hatua 2: "Yeye ni daktari" inathibitisha.', 'Hatua 3: Kwa hiyo "ni" hukanusha.', '"Ni" huthibitisha.', 0],
  ], ['a', 'b']),
];
