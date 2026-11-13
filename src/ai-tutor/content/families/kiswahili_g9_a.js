// ============================================================================
// KISWAHILI GRADE 9, SARUFI A (11 skills): vihusishi vya mahali, wakati, sababu na ulinganisho, -ki- na -ka-, -nge- na -ngali-, vielezi vya
// namna, wakati, mahali na idadi, koloni na semi koloni, mabano na kistari. Written offline from the KICD design through the curriculum map.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a native Kiswahili teacher signs them off.
// ============================================================================
import { S } from './kiswahili_g9_lib.js';

export const FAMILIES = [
  ...S('vm', 'SARUFI.T1_VIHUSISHI.', 'VIH_MAHALI', ['VM_MAHALI', 'VM_WAKATI', 'VM_SENTENSI'], ['Mbele ya, nyuma ya na juu ya ni vya mahali; kabla ya na baada ya ni vya wakati.', 'Vihusishi hivi hufuatwa na ya.'], [
    ['Ni kihusishi kipi cha mahali katika orodha hii?', 'mbele ya', 'baada ya', 'kabla ya', 'wakati wa'],
    ['Ni kihusishi kipi cha wakati katika orodha hii?', 'kabla ya', 'mbele ya', 'nyuma ya', 'juu ya'],
    ['Chagua sentensi sahihi kuhusu kitabu.', 'Kitabu kiko juu ya meza.', 'Kitabu kiko juu meza.', 'Kitabu kiko juu na meza.', 'Kitabu kiko juu wa meza.'],
    ['Ni kihusishi gani cha mahali miongoni mwa hivi?', 'chini ya', 'baada ya', 'kabla ya', 'wakati wa'],
    ['Ni kihusishi gani cha wakati miongoni mwa hivi?', 'baada ya', 'ndani ya', 'nje ya', 'juu ya'],
  ], [
    ['Mtoto alisimama ___ nyumba. Chagua kihusishi cha mahali.', 'mbele ya', 'baada ya', 'kabla ya', 'wakati wa'],
    ['Tulikula ___ kusoma. Chagua kihusishi cha wakati.', 'baada ya', 'mbele ya', 'nyuma ya', 'juu ya'],
    ['Paka alikaa ___ kiti. Chagua kihusishi cha mahali.', 'chini ya', 'baada ya', 'kabla ya', 'wakati wa'],
    ['Aliamka ___ jua kuchomoza. Chagua kihusishi cha wakati.', 'kabla ya', 'ndani ya', 'nje ya', 'juu ya'],
    ['Ni sentensi ipi ina kihusishi cha mahali?', 'Kiko ndani ya sanduku.', 'Alifika baada ya mvua.', 'Aliondoka kabla ya jua.', 'Aliimba wakati wa sherehe.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mbele ya huonyesha mahali.', 'Hatua 2: Kabla ya huonyesha wakati.', 'Hatua 3: Kwa hiyo baada ya ni cha mahali.', 'Baada ya ni cha wakati.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kabla ya huonyesha wakati.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo kabla ya ni cha mahali.', 'Kabla ya ni cha wakati.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Juu ya ni kihusishi.', 'Hatua 2: Hufuatwa na ya.', 'Hatua 3: Kwa hiyo tunasema "juu meza".', 'Tunasema "juu ya meza".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Chini ya huonyesha mahali.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo chini ya ni cha wakati.', 'Chini ya ni cha mahali.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Baada ya huonyesha wakati.', 'Hatua 2: Mfano ni baada ya mvua.', 'Hatua 3: Kwa hiyo baada ya ni cha mahali.', 'Baada ya ni cha wakati.', 2],
  ], ['a', 'b']),
  ...S('vs', 'SARUFI.T2_VIHUSISHI.', 'VIH_SABABU', ['VS_UNGANIFU', 'VS_SABABU', 'VS_UPATANISHO'], ['Cha, wa na ya ni vya -a unganifu; kwa sababu ya ni cha sababu.', '-a unganifu hupatana na nomino.'], [
    ['Ni kihusishi kipi cha -a unganifu?', 'cha', 'kwa sababu ya', 'kwa ajili ya', 'kutokana na'],
    ['Ni kihusishi kipi cha sababu?', 'kwa sababu ya', 'cha', 'wa', 'ya'],
    ['Kamilisha: kitabu ___ mwalimu.', 'cha', 'wa', 'la', 'ya'],
    ['Kamilisha: mtoto ___ mama.', 'wa', 'cha', 'la', 'za'],
    ['Ni kihusishi kipi cha sababu?', 'kutokana na', 'cha', 'vya', 'wa'],
  ], [
    ['Tuliahirisha mchezo ___ mvua. Chagua kihusishi cha sababu.', 'kwa sababu ya', 'cha', 'wa', 'ya'],
    ['Hii ni nyumba ___ baba. Chagua kihusishi cha -a unganifu.', 'ya', 'cha', 'wa', 'za'],
    ['Alifaulu ___ bidii yake. Chagua kihusishi cha sababu.', 'kutokana na', 'cha', 'vya', 'wa'],
    ['Hiki ni kiti ___ mwalimu. Chagua kihusishi cha -a unganifu.', 'cha', 'wa', 'la', 'ya'],
    ['Alifanya kazi ___ ajili ya familia. Chagua neno linalokosekana.', 'kwa', 'cha', 'wa', 'ya'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Cha ni kihusishi.', 'Hatua 2: Hupatana na kitabu.', 'Hatua 3: Kwa hiyo cha ni cha sababu.', 'Cha ni cha -a unganifu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kwa sababu ya huonyesha sababu.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo ni cha -a unganifu.', 'Ni cha sababu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kitabu hupatana na cha.', 'Hatua 2: Kiti pia hupatana na cha.', 'Hatua 3: Kwa hiyo tunasema "kitabu wa mwalimu".', 'Tunasema "kitabu cha mwalimu".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mtoto hupatana na wa.', 'Hatua 2: Ni -a unganifu.', 'Hatua 3: Kwa hiyo tunasema "mtoto cha mama".', 'Tunasema "mtoto wa mama".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kutokana na huonyesha sababu.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo ni -a unganifu.', 'Ni cha sababu.', 2],
  ], ['a', 'a']),
  ...S('vl', 'SARUFI.T3_VIHUSISHI.', 'VIH_LINGANISHI', ['VL_KULIKO', 'VL_NA', 'VL_KAMA'], ['Kuliko na kama hulinganisha; pamoja na huonyesha kuwa pamoja.', 'Na huonyesha pamoja.'], [
    ['Ni kihusishi kipi kinalinganisha?', 'kuliko', 'pamoja na', 'kabla ya', 'baada ya'],
    ['Katika "Alikuja na rafiki yake", na inaonyesha nini?', 'pamoja', 'ulinganisho', 'sababu', 'wakati'],
    ['Ni kihusishi kipi kinalinganisha vitu viwili?', 'kama', 'kwa ajili ya', 'baada ya', 'juu ya'],
    ['Kamilisha: Yeye ni mrefu ___ mimi.', 'kuliko', 'pamoja na', 'kabla ya', 'baada ya'],
    ['Kamilisha: Alikwenda sokoni ___ mama yake.', 'pamoja na', 'kuliko', 'kama', 'mithili ya'],
  ], [
    ['Juma ni mfupi ___ Amina. Chagua kihusishi cha kulinganisha.', 'kuliko', 'pamoja na', 'kabla ya', 'baada ya'],
    ['Njeri alicheza ___ rafiki zake. Chagua kihusishi cha pamoja.', 'pamoja na', 'kuliko', 'kama', 'mithili ya'],
    ['Alikimbia ___ upepo. Chagua kihusishi cha kulinganisha.', 'kama', 'kwa ajili ya', 'baada ya', 'juu ya'],
    ['Ni sentensi ipi ina ulinganisho?', 'Gari ni kubwa kuliko baiskeli.', 'Alikuja na baba yake.', 'Aliondoka kabla ya jua.', 'Alikaa juu ya kiti.'],
    ['Ni sentensi ipi inaonyesha pamoja?', 'Alienda na dada yake.', 'Gari ni kubwa kuliko baiskeli.', 'Alikimbia kama upepo.', 'Aliondoka baada ya mvua.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kuliko hulinganisha.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo kuliko huonyesha pamoja.', 'Kuliko hulinganisha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Katika "Alikuja na rafiki", na huunganisha.', 'Hatua 2: Huonyesha pamoja.', 'Hatua 3: Kwa hiyo huonyesha ulinganisho.', 'Huonyesha pamoja.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kama hulinganisha.', 'Hatua 2: Mfano ni "mrefu kama mti".', 'Hatua 3: Kwa hiyo kama huonyesha sababu.', 'Kama hulinganisha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Pamoja na huonyesha kuwa pamoja.', 'Hatua 2: Ni kihusishi.', 'Hatua 3: Kwa hiyo hulinganisha.', 'Huonyesha pamoja.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mithili ya hulinganisha.', 'Hatua 2: Mfano ni "mithili ya simba".', 'Hatua 3: Kwa hiyo huonyesha mahali.', 'Hulinganisha.', 2],
  ], ['a', 'a']),
  ...S('kk', 'SARUFI.T4_NYAKATI_NA_HALI.', 'KI_KA', ['KK_KI', 'KK_KA', 'KK_MATUMIZI'], ['-ki- huonyesha sharti; -ka- huonyesha tendo linalofuata.', 'Tendo linalofuata hutumia -ka-.'], [
    ['Katika "Ukisoma utafaulu", -ki- inaonyesha nini?', 'sharti', 'kufuatana', 'wakati uliopita', 'ukanushaji'],
    ['Katika "Alifika akaketi", -ka- inaonyesha nini?', 'kufuatana', 'sharti', 'ukanushaji', 'swali'],
    ['Kamilisha: Aliamka ___oga.', 'akaoga', 'akioga', 'akaogi', 'akiogi'],
    ['Kamilisha: Ukifika mapema ___pata kiti.', 'utapata', 'ukapata', 'unapata', 'ulipata'],
    ['Ni sentensi ipi ina -ka- ya kufuatana?', 'Alipika akala.', 'Ukipika utakula.', 'Angepika angekula.', 'Hapiki.'],
  ], [
    ['Mama alisema, "Ukifanya bidii utafaulu." -ki- inaonyesha nini?', 'sharti', 'kufuatana', 'ukanushaji', 'swali'],
    ['Juma aliingia akakaa. -ka- inaonyesha nini?', 'tendo linalofuata', 'sharti', 'ukanushaji', 'swali'],
    ['Alifika nyumbani ___pumzika. Chagua kiambishi cha kufuatana.', 'akapumzika', 'akipumzika', 'akapumziki', 'akipumziki'],
    ['Mvua ___nyesha, tutakaa ndani. Chagua kiambishi cha sharti.', 'ikinyesha', 'ikanyesha', 'ikanyeshi', 'ikinyeshi'],
    ['Ni sentensi ipi ina sharti?', 'Ukiamka mapema utafika.', 'Aliamka akaosha uso.', 'Alifika akala.', 'Alinunua akarudi.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Katika "Ukisoma utafaulu" kuna -ki-.', 'Hatua 2: Inaonyesha sharti.', 'Hatua 3: Kwa hiyo -ki- huonyesha kufuatana.', '-ki- huonyesha sharti.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Katika "Alifika akaketi" kuna -ka-.', 'Hatua 2: Tendo la pili hufuata la kwanza.', 'Hatua 3: Kwa hiyo -ka- huonyesha sharti.', '-ka- huonyesha kufuatana.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Aliamka kisha akaoga.', 'Hatua 2: Tendo la pili hufuata.', 'Hatua 3: Kwa hiyo tunasema "akioga".', 'Tunasema "akaoga".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Sharti hutumia -ki-.', 'Hatua 2: Mfano ni "ukija".', 'Hatua 3: Kwa hiyo sharti hutumia -ka-.', 'Sharti hutumia -ki-.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kufuatana hutumia -ka-.', 'Hatua 2: Mfano ni "akaenda".', 'Hatua 3: Kwa hiyo kufuatana hutumia -ki-.', 'Kufuatana hutumia -ka-.', 2],
  ], ['a', 'b']),
  ...S('nn', 'SARUFI.T5_HALI_ZA_MASHARTI.', 'NGE_NGALI', ['NN_MAANA', 'NN_NGE', 'NN_NGALI'], ['-nge- na -ngali- huonyesha sharti lisilotimia.', 'Angejua ina -nge-; angalijua ina -ngali-.'], [
    ['Hali ya masharti ya -nge- huonyesha nini?', 'sharti lisilotimia', 'ukweli uliotimia', 'amri', 'swali'],
    ['Ni sentensi ipi ina -nge-?', 'Angejua angekuja.', 'Angalijua angalikuja.', 'Alijua alikuja.', 'Atajua atakuja.'],
    ['Ni sentensi ipi ina -ngali-?', 'Angalijua angalikuja.', 'Angejua angekuja.', 'Alijua alikuja.', 'Atajua atakuja.'],
    ['Kamilisha: Ningejua, ___ kukusaidia.', 'ningekuja', 'nilikuja', 'nitakuja', 'ninakuja'],
    ['Hali ya masharti ni nini?', 'Hali inayoonyesha sharti', 'Hali inayoonyesha amri', 'Hali inayoonyesha swali', 'Hali inayoonyesha ukweli'],
  ], [
    ['Baba alisema, "Ungesoma ungefaulu." Je, mwanafunzi alisoma?', 'Hapana, sharti halikutimia', 'Ndiyo, alisoma', 'Ndiyo, alifaulu', 'Hajulikani kamwe'],
    ['Amina anasema, "Ningejua ningekuja." Ni hali gani?', 'ya masharti', 'ya amri', 'ya swali', 'ya mazoea'],
    ['Ni sentensi ipi ina -nge-?', 'Mvua ingenyesha tungelala.', 'Mvua ilinyesha tulilala.', 'Mvua itanyesha tutalala.', 'Mvua inanyesha tunalala.'],
    ['Ni sentensi ipi ina -ngali-?', 'Angalikuwepo angalisaidia.', 'Alikuwepo alisaidia.', 'Atakuwepo atasaidia.', 'Yupo anasaidia.'],
    ['Kamilisha: Angalijua, ___ kuja mapema.', 'angalikuja', 'alikuja', 'atakuja', 'anakuja'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: -nge- huonyesha sharti.', 'Hatua 2: Sharti halikutimia.', 'Hatua 3: Kwa hiyo -nge- huonyesha ukweli uliotimia.', '-nge- huonyesha sharti lisilotimia.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Angejua angekuja" ina -nge-.', 'Hatua 2: Ni hali ya masharti.', 'Hatua 3: Kwa hiyo ina -ngali-.', 'Ina -nge-.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Angalijua angalikuja" ina -ngali-.', 'Hatua 2: Ni hali ya masharti.', 'Hatua 3: Kwa hiyo ina -nge-.', 'Ina -ngali-.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Masharti huhusu "kama".', 'Hatua 2: Tendo halikufanyika.', 'Hatua 3: Kwa hiyo hali ya masharti ni amri.', 'Ni hali ya sharti.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: -nge- hutumika katika masharti.', 'Hatua 2: -ngali- hutumika pia.', 'Hatua 3: Kwa hiyo hazihusu masharti.', 'Zote huhusu masharti.', 2],
  ], ['a', 'b', 'c']),
  ...S('vn', 'SARUFI.T6_VIELEZI.', 'VIE_NAMNA', ['VN_NAMNA', 'VN_WAKATI', 'VN_SWALI'], ['Polepole ni cha namna; kesho ni cha wakati.', 'Namna hujibu "vipi"; wakati hujibu "lini".'], [
    ['Ni kielezi kipi cha namna?', 'polepole', 'jana', 'kesho', 'leo'],
    ['Ni kielezi kipi cha wakati?', 'kesho', 'polepole', 'haraka', 'kwa upole'],
    ['Kielezi cha namna hujibu swali gani?', 'Vipi?', 'Lini?', 'Wapi?', 'Ngapi?'],
    ['Kielezi cha wakati hujibu swali gani?', 'Lini?', 'Vipi?', 'Wapi?', 'Ngapi?'],
    ['Ni kielezi kipi cha namna?', 'haraka', 'jioni', 'mapema', 'sasa'],
  ], [
    ['Alitembea polepole sokoni. Polepole ni kielezi cha nini?', 'namna', 'wakati', 'mahali', 'idadi'],
    ['Tutasafiri kesho. Kesho ni kielezi cha nini?', 'wakati', 'namna', 'mahali', 'idadi'],
    ['Mtoto alijibu kwa upole. Kwa upole ni kielezi cha nini?', 'namna', 'wakati', 'mahali', 'idadi'],
    ['Aliamka mapema. Mapema ni kielezi cha nini?', 'wakati', 'namna', 'mahali', 'idadi'],
    ['Ni sentensi ipi ina kielezi cha namna?', 'Alikimbia haraka.', 'Alifika jana.', 'Atakuja kesho.', 'Alikuja mapema.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Polepole huonyesha jinsi tendo lilivyofanyika.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha wakati.', 'Ni cha namna.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kesho huonyesha lini.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha namna.', 'Ni cha wakati.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kielezi cha namna hujibu "vipi".', 'Hatua 2: Mfano ni haraka.', 'Hatua 3: Kwa hiyo hujibu "lini".', 'Hujibu "vipi".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kielezi cha wakati hujibu "lini".', 'Hatua 2: Mfano ni jana.', 'Hatua 3: Kwa hiyo hujibu "vipi".', 'Hujibu "lini".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jioni ni wakati.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha namna.', 'Ni cha wakati.', 2],
  ], ['a', 'a']),
  ...S('ve', 'SARUFI.T7_VIELEZI.', 'VIE_MAHALI', ['VE_MAHALI', 'VE_IDADI', 'VE_SWALI'], ['Pale na huku ni vya mahali; mara mbili ni cha idadi.', 'Mahali hujibu "wapi"; idadi hujibu "mara ngapi?".'], [
    ['Ni kielezi kipi cha mahali katika orodha hii?', 'pale', 'mara mbili', 'sana', 'kidogo'],
    ['Ni kielezi kipi cha idadi katika orodha hii?', 'mara mbili', 'huku', 'hapa', 'nyumbani'],
    ['Kielezi cha mahali hujibu swali gani?', 'Wapi?', 'Lini?', 'Vipi?', 'Nani?'],
    ['Ni kielezi gani cha mahali miongoni mwa hivi?', 'nyumbani', 'mara nyingi', 'kidogo', 'sana'],
    ['Ni kielezi gani cha idadi miongoni mwa hivi?', 'mara nyingi', 'kule', 'mjini', 'pale'],
  ], [
    ['Alikaa pale kwa saa moja. Pale ni kielezi cha nini?', 'mahali', 'idadi', 'wakati', 'namna'],
    ['Alipiga ngoma mara tatu. Mara tatu ni kielezi cha nini?', 'idadi', 'mahali', 'wakati', 'namna'],
    ['Njoo huku. Huku ni kielezi cha nini?', 'mahali', 'idadi', 'wakati', 'namna'],
    ['Alikula kidogo tu. Kidogo ni kielezi cha nini?', 'idadi', 'mahali', 'wakati', 'namna'],
    ['Ni sentensi ipi ina kielezi cha mahali?', 'Wanafunzi wako darasani.', 'Alirudi mara mbili.', 'Alikula kidogo.', 'Alikuja mapema.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Pale huonyesha mahali.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha idadi.', 'Ni cha mahali.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mara mbili huonyesha idadi.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha mahali.', 'Ni cha idadi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kielezi cha mahali hujibu "wapi".', 'Hatua 2: Mfano ni kule.', 'Hatua 3: Kwa hiyo hujibu "lini".', 'Hujibu "wapi".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kidogo huonyesha kiasi.', 'Hatua 2: Ni kielezi cha idadi.', 'Hatua 3: Kwa hiyo ni cha mahali.', 'Ni cha idadi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Nyumbani huonyesha mahali.', 'Hatua 2: Ni kielezi.', 'Hatua 3: Kwa hiyo ni cha idadi.', 'Ni cha mahali.', 2],
  ], ['a', 'a']),
  ...S('ko', 'KUANDI.T1_VIAKIFISHI.', 'KOLONI', ['KO_KOLONI', 'KO_SEMI', 'KO_MFANO'], ['Koloni (:) huleta orodha; semi koloni (;) hutenganisha sentensi zinazohusiana.', 'Orodha hufuata maelezo kisha koloni.'], [
    ['Ni alama ipi huleta orodha?', 'koloni', 'semi koloni', 'kiulizi', 'hisi'],
    ['Ni alama ipi hutenganisha sentensi mbili zinazohusiana?', 'semi koloni', 'koloni', 'kiulizi', 'hisi'],
    ['Ni sentensi ipi imetumia koloni sawa?', 'Nilinunua vitu hivi: mkate, maziwa na sukari.', 'Nilinunua: vitu hivi mkate maziwa na sukari.', 'Nilinunua vitu hivi mkate: maziwa na sukari.', 'Nilinunua vitu hivi mkate maziwa: na sukari.'],
    ['Alama ya koloni ni ipi?', ':', ';', '?', '!'],
    ['Alama ya semi koloni ni ipi?', ';', ':', '?', '!'],
  ], [
    ['Mwalimu aliandika: "Vifaa vinavyohitajika: kalamu, kitabu na rula." Koloni imetumika kwa nini?', 'kuleta orodha', 'kuuliza swali', 'kuonyesha mshangao', 'kumaliza sentensi'],
    ['Mvua ilinyesha; mto ulifurika. Semi koloni imetumika kwa nini?', 'kutenganisha sentensi zinazohusiana', 'kuleta orodha', 'kuuliza swali', 'kuonyesha mshangao'],
    ['Ni sentensi ipi ina alama sahihi ya kuleta orodha?', 'Tunahitaji haya: unga, sukari na mafuta.', 'Tunahitaji haya; unga, sukari na mafuta.', 'Tunahitaji haya? unga, sukari na mafuta.', 'Tunahitaji haya! unga, sukari na mafuta.'],
    ['Ni sentensi ipi ina semi koloni sahihi?', 'Alisoma sana; alifaulu vizuri.', 'Alisoma sana: alifaulu vizuri.', 'Alisoma sana? alifaulu vizuri.', 'Alisoma sana! alifaulu vizuri.'],
    ['Kabla ya orodha ya vitu, mwandishi huweka alama ipi?', 'koloni', 'semi koloni', 'kiulizi', 'hisi'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Orodha huletwa kwa alama.', 'Hatua 2: Alama hiyo ni koloni.', 'Hatua 3: Kwa hiyo orodha huletwa kwa semi koloni.', 'Orodha huletwa kwa koloni.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Sentensi mbili zinaweza kuhusiana.', 'Hatua 2: Semi koloni huzitenganisha.', 'Hatua 3: Kwa hiyo koloni huzitenganisha.', 'Semi koloni huzitenganisha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Koloni hufuata maelezo.', 'Hatua 2: Kisha huja orodha.', 'Hatua 3: Kwa hiyo koloni huja katikati ya orodha.', 'Koloni huja kabla ya orodha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Semi koloni ni alama (;).', 'Hatua 2: Hutenganisha sentensi.', 'Hatua 3: Kwa hiyo huleta orodha.', 'Koloni huleta orodha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Alama zina kazi tofauti.', 'Hatua 2: Koloni na semi koloni ni tofauti.', 'Hatua 3: Kwa hiyo ni alama moja.', 'Ni alama mbili tofauti.', 2],
  ], ['a', 'b']),
  ...S('mk', 'KUANDI.T8_VIAKIFISHI.', 'MABANO_KISTARI', ['MK_MABANO', 'MK_KISTARI', 'MK_NENO'], ['Mabano huweka maelezo ya ziada; kistari kifupi hutumika kati ya tarakimu.', 'Kistari pia huvunja neno mwishoni mwa mstari.'], [
    ['Ni alama ipi huweka maelezo ya ziada?', 'mabano', 'kistari kifupi', 'koloni', 'hisi'],
    ['Ni alama ipi hutumika kati ya tarakimu kama kurasa 5 hadi 10?', 'kistari kifupi', 'mabano', 'koloni', 'hisi'],
    ['Ni alama ipi hutumika kuvunja neno mwishoni mwa mstari?', 'kistari kifupi', 'koloni', 'kiulizi', 'hisi'],
    ['Ni sentensi ipi imetumia mabano sawa?', 'Nairobi (mji mkuu) ni mkubwa.', 'Nairobi: mji mkuu) ni mkubwa.', 'Nairobi ((mji mkuu ni mkubwa.', 'Nairobi mji mkuu() ni mkubwa.'],
    ['Soma kurasa 5-10. Kistari kifupi kinaonyesha nini?', 'kuanzia hadi', 'swali', 'mshangao', 'orodha'],
  ], [
    ['Mwalimu alisema (kwa sauti ya chini) kuwa mtihani umeahirishwa. Mabano yamewekwa kwa nini?', 'kuweka maelezo ya ziada', 'kuuliza swali', 'kuleta orodha', 'kuonyesha mshangao'],
    ['Soma kurasa 12-18. Alama ya kistari inaonyesha nini?', 'kuanzia hadi', 'swali', 'mshangao', 'orodha'],
    ['Mwishoni mwa mstari neno "mwalimu" halitoshi. Mwandishi ataweka alama ipi?', 'kistari kifupi', 'koloni', 'kiulizi', 'hisi'],
    ['Ni sentensi ipi ina mabano sahihi?', 'Kenya (nchi yetu) ni nzuri.', 'Kenya: nchi yetu) ni nzuri.', 'Kenya ((nchi yetu ni nzuri.', 'Kenya nchi yetu() ni nzuri.'],
    ['Ni alama ipi hufunga maelezo ya ziada?', 'mabano ya kufunga', 'kistari kifupi', 'koloni', 'hisi'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Maelezo ya ziada huwekwa.', 'Hatua 2: Mabano huyashika.', 'Hatua 3: Kwa hiyo kistari kifupi huyashika.', 'Mabano huyashika.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kurasa 5 hadi 10 huandikwa kwa alama.', 'Hatua 2: Alama hiyo ni kistari kifupi.', 'Hatua 3: Kwa hiyo ni mabano.', 'Ni kistari kifupi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Neno halitoshi mwishoni mwa mstari.', 'Hatua 2: Linavunjwa.', 'Hatua 3: Kwa hiyo hutumika koloni.', 'Hutumika kistari kifupi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mabano huja kwa jozi.', 'Hatua 2: Moja hufungua, lingine hufunga.', 'Hatua 3: Kwa hiyo moja linatosha.', 'Yote mawili yanahitajika.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kistari kifupi ni alama ndogo.', 'Hatua 2: Kina kazi mbili.', 'Hatua 3: Kwa hiyo kinaweka maelezo ya ziada.', 'Mabano huweka maelezo ya ziada.', 2],
  ], ['a', 'a']),
];
