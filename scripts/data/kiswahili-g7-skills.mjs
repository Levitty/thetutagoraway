// ============================================================================
// KISWAHILI GRADE 7: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/kiswahili/g7.json by scripts/build-kiswahili-g7.mjs. KICD's outcomes and rubrics are never touched.
// Skills cover the grammar (sarufi), punctuation, letter-writing knowledge, tanzu za fasihi and ufupisho outcomes a tapped question can test.
// Listening, reading passages, composition, oral work and attitudes are not tested here (see the non-question note).
// Everything is draft until a native Kiswahili teacher who teaches Kiswahili reviews it.
// A skill: [sub-strand key after 'KISW.G7.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const N = 'SARUFI.T1_AINA_ZA_NOMINO', N2 = 'SARUFI.T2_AINA_ZA_NOMINO', N3 = 'SARUFI.T3_AINA_ZA_NOMINO', T4 = 'SARUFI.T4_NYAKATI_NA_HALI', T5 = 'SARUFI.T5_NYAKATI_NA_HALI';
const V6 = 'SARUFI.T6_VITENZI', V7 = 'SARUFI.T7_VITENZI_VISHIRIKISHI', G8 = 'SARUFI.T8_NGELI_NA_UPATANISHO_', G9 = 'SARUFI.T9_NGELI_NA_UPATANISHO_';
const VN = 'SARUFI.T10_VINYUME', MN = 'SARUFI.T11_MNYAMBULIKO_WA_VITEN', ST = 'SARUFI.T12_AINA_ZA_SENTENSI', UK = 'SARUFI.T13_UKANUSHAJI_KWA_KUZIN', UB = 'SARUFI.T14_UKUBWA_WA_NOMINO', US = 'SARUFI.T15_USEMI_HALISI_NA_USEM';
const VH = 'KUANDI.T1_VIAKIFISHI', VK = 'KUANDI.T8_VIAKIFISHI', BM = 'KUANDI.T2_BARUA_YA_KIRAFIKI_YA', BS = 'KUANDI.T10_BARUA_RASMI_YA_KUOMB', FA = 'KUSIKI.T3_TANZU_ZA_FASIHI', UF = 'KUSOMA.T7_UFUPISHO';
const FM = ['chagua jibu sahihi', 'chagua jibu katika hadithi fupi', 'tafuta hatua yenye kosa'];
export const SKILLS = [
  [N, 'NOMINO_PEKEE', 'Tambua nomino za pekee na za kawaida', ['a', 'b', 'c'], [], FM, 'Mtoto hutambua nomino ya pekee (jina la mtu, mahali au kitu kimoja mahususi) na nomino ya kawaida (jina la jumla), na huandika ya pekee kwa herufi kubwa.'],
  [N2, 'NOMINO_MAKUNDI', 'Tambua nomino za makundi na za dhahania', ['a', 'b'], ['NOMINO_PEKEE'], FM, 'Mtoto hutambua nomino za makundi (kundi la viumbe au vitu, k.m. kikosi, jeshi) na za dhahania (mambo yasiyoshikika, k.m. upendo, furaha).'],
  [N3, 'NOMINO_WINGI', 'Tambua nomino za wingi na vitenzi-jina', ['a', 'b'], ['NOMINO_PEKEE'], FM, 'Mtoto hutambua nomino za wingi (maji, mafuta) na kitenzi-jina (kuimba, kusoma) kinachoanza kwa ku-.'],
  [T4, 'NYAKATI_MSINGI', 'Tambua wakati uliopo, uliopita na ujao', ['a', 'b'], [], FM, 'Mtoto hutambua kiambishi -na- (uliopo), -li- (uliopita) na -ta- (ujao), na hutumia wakati unaofaa.'],
  [T5, 'NYAKATI_KUENDELEA', 'Tambua uliopita hali ya kuendelea na ujao hali ya kuendelea', ['a', 'b'], ['NYAKATI_MSINGI'], FM, 'Mtoto hutambua alikuwa akisoma (uliopita hali ya kuendelea) na atakuwa akisoma (ujao hali ya kuendelea).'],
  [V6, 'VITENZI_VIKUU', 'Tambua vitenzi vikuu na visaidizi', ['a', 'b'], ['NYAKATI_MSINGI'], FM, 'Mtoto hutambua kitenzi kikuu (hubeba tendo) na kisaidizi (hutangulia kikuu na kusaidia, k.m. alikuwa, atakuwa).'],
  [V7, 'VISHIRIKISHI', 'Tambua na utumie vitenzi vishirikishi', ['a', 'b'], ['VITENZI_VIKUU'], FM, 'Mtoto hutambua kitenzi kishirikishi (ni, si, yuko, wako, ndiye, ndio) na hukitumia sentensi.'],
  [G8, 'NGELI_AWA_UI', 'Tumia ngeli za A-WA na U-I na upatanisho wa kisarufi', ['a', 'b', 'c'], ['NOMINO_PEKEE'], FM, 'Mtoto hutambua nomino za A-WA (mtu, mtoto, mnyama: wa-) na U-I (mti, mlima: mi-) na hutumia viambishi vya upatanisho (a-/wa-, u-/i-).'],
  [G9, 'NGELI_KIVI_LIYA', 'Tumia ngeli za KI-VI na LI-YA na upatanisho wa kisarufi', ['a', 'b', 'c'], ['NGELI_AWA_UI'], FM, 'Mtoto hutambua nomino za KI-VI (kitabu: vi-) na LI-YA (jiwe: ma-) na hutumia viambishi vya upatanisho (ki-/vi-, li-/ya-).'],
  [VN, 'VINYUME', 'Eleza na tumia vinyume vya nomino na vivumishi', ['a', 'b', 'c'], ['NOMINO_PEKEE'], FM, 'Mtoto hueleza kinyume cha neno (neno lenye maana kinyume) na hutambua vinyume vya nomino na vivumishi.'],
  [MN, 'KAULI', 'Tambua kauli za kutenda, kutendea na kutendwa', ['a', 'b'], ['NYAKATI_MSINGI'], FM, 'Mtoto hutambua kutenda (pika), kutendea (pikia) na kutendwa (pikwa) na hutumia kitenzi katika kauli inayofaa.'],
  [ST, 'SENTENSI', 'Tofautisha sentensi sahili na ambatano', ['a', 'b', 'c'], ['VITENZI_VIKUU'], FM, 'Mtoto hutambua sentensi sahili (wazo moja) na ambatano (mawazo mawili au zaidi yaliyounganishwa kwa kiunganishi).'],
  [UK, 'UKANUSHAJI', 'Kanusha sentensi katika nyakati tatu', ['c', 'd'], ['NYAKATI_MSINGI'], FM, 'Mtoto hukanusha sentensi katika wakati uliopo (hasomi), uliopita (hakusoma) na ujao (hatasoma).'],
  [UB, 'UKUBWA', 'Tambua nomino katika hali ya ukubwa', ['a', 'b', 'c'], ['NOMINO_PEKEE'], FM, 'Mtoto hutambua hali ya ukubwa (jibwa, jitu, jumba), viambishi vya ji- na ma- vya ukubwa, na hutumia nomino ipasavyo.'],
  [US, 'USEMI', 'Badilisha usemi halisi kuwa usemi wa taarifa', ['a', 'b', 'c'], ['NYAKATI_MSINGI'], FM, 'Mtoto hutambua usemi halisi (maneno ya msemaji kwa alama za usemi) na wa taarifa, na hubadilisha mtu na wakati ipasavyo.'],
  [VH, 'HERUFI_KUBWA', 'Tumia herufi kubwa na kikomo', ['a', 'b'], [], FM, 'Mtoto hutumia herufi kubwa mwanzoni mwa sentensi na kwa majina ya pekee, na kikomo (.) mwishoni mwa sentensi ya kawaida.'],
  [VK, 'KIULIZI_KOMA', 'Tumia kiulizi na koma', ['a', 'b'], ['HERUFI_KUBWA'], FM, 'Mtoto hutumia kiulizi (?) mwishoni mwa swali na koma (,) kutenganisha vitu katika orodha na baada ya salamu au kiunganishi.'],
  [BM, 'BARUA_MWALIKO', 'Tambua muundo wa barua ya kirafiki ya mwaliko', ['a', 'c'], ['HERUFI_KUBWA'], FM, 'Mtoto hutambua vipengele vya barua ya kirafiki (anwani, tarehe, salamu, ujumbe, hitimisho, jina) na umuhimu wa mwaliko.'],
  [BS, 'BARUA_MSAMAHA', 'Tambua muundo wa barua rasmi ya kuomba msamaha', ['a', 'c'], ['BARUA_MWALIKO'], FM, 'Mtoto hutambua vipengele vya barua rasmi (anwani mbili, tarehe, salamu rasmi, kichwa, ujumbe, hitimisho) na lugha ya heshima.'],
  [FA, 'FASIHI_TANZU', 'Eleza maana ya fasihi na tanzu zake', ['a', 'b', 'c'], [], FM, 'Mtoto hueleza fasihi, hutambua fasihi simulizi (kutumia mdomo) na andishi (kuandikwa), na hutambua tanzu kama hadithi, methali na ushairi.'],
  [UF, 'UFUPISHO', 'Eleza maana ya ufupisho na habari kuu', ['a', 'b'], [], FM, 'Mtoto hueleza ufupisho (kutoa habari kuu bila kupoteza maana) na hutambua habari kuu ya aya.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback (child, Kiswahili)]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_KS7_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('NOMINO_PEKEE', 'NP_KAWAIDA_KUBWA', 'Writes a common noun with a capital letter.', 'Ni nomino ipi ni ya pekee?', 'mji', 'Kisumu', 'Nomino ya pekee ni jina mahususi la mtu au mahali, kama Kisumu.'),
  m('NOMINO_PEKEE', 'NP_PEKEE_NDOGO', 'Writes a proper noun with a small letter.', 'Nomino ya pekee huandikwa kwa herufi gani mwanzoni?', 'Herufi ndogo', 'Herufi kubwa', 'Nomino ya pekee huanza kwa herufi kubwa.'),
  m('NOMINO_PEKEE', 'NP_JINA_JUMLA', 'Thinks a general name like mwalimu is a proper noun.', 'Ni nomino ipi ni ya kawaida?', 'Wanjiru', 'kijiji', 'Nomino ya kawaida ni jina la jumla, kama kijiji.'),
  m('NOMINO_MAKUNDI', 'NM_MOJA', 'Thinks a collective noun names one thing.', 'Ni nomino ipi ni ya makundi?', 'mwanafunzi', 'kikosi', 'Nomino ya makundi hutaja kundi la viumbe au vitu, kama kikosi.'),
  m('NOMINO_MAKUNDI', 'NM_SHIKIKA', 'Thinks an abstract noun can be touched.', 'Ni nomino ipi ni ya dhahania?', 'meza', 'upendo', 'Nomino ya dhahania haishikiki, kama upendo.'),
  m('NOMINO_MAKUNDI', 'NM_KUNDI_DHAHANIA', 'Mixes collective and abstract nouns.', 'Neno jeshi ni nomino ya aina gani?', 'dhahania', 'makundi', 'Jeshi ni kundi la askari, kwa hiyo ni nomino ya makundi.'),
  m('NOMINO_WINGI', 'NW_KITENZI_JINA', 'Does not know the ku- verbal noun.', 'Ni kitenzi-jina kipi?', 'mwimbaji', 'kuimba', 'Kitenzi-jina huanza kwa ku-, kama kuimba.'),
  m('NOMINO_WINGI', 'NW_MAJI_MOJA', 'Treats maji as singular.', 'Ni nomino ipi ya wingi?', 'kiti', 'maji', 'Maji ni nomino ya wingi; haina umoja.'),
  m('NOMINO_WINGI', 'NW_KUSOMA', 'Calls the verbal noun a main verb only.', 'Neno kusoma katika "Kusoma ni muhimu" ni nini?', 'kitenzi kikuu', 'kitenzi-jina', 'Hapa kusoma ni jina la jambo, kwa hiyo ni kitenzi-jina.'),
  m('NYAKATI_MSINGI', 'NY_LI', 'Mixes the markers -li- and -ta-.', 'Katika "Juma alicheza jana", wakati ni upi?', 'ujao', 'uliopita', 'Kiambishi -li- huonyesha wakati uliopita.'),
  m('NYAKATI_MSINGI', 'NY_NA', 'Thinks -na- is past.', 'Katika "Mama anapika sasa", wakati ni upi?', 'uliopita', 'uliopo', 'Kiambishi -na- huonyesha wakati uliopo.'),
  m('NYAKATI_MSINGI', 'NY_TA', 'Thinks -ta- is present.', 'Katika "Tutasafiri kesho", wakati ni upi?', 'uliopo', 'ujao', 'Kiambishi -ta- huonyesha wakati ujao.'),
  m('NYAKATI_KUENDELEA', 'NK_AKISOMA', 'Uses the past continuous for a future event.', 'Ni sentensi ipi iko katika ujao hali ya kuendelea?', 'Alikuwa akisoma jana', 'Atakuwa akisoma kesho', 'Ujao hali ya kuendelea hutumia atakuwa akisoma.'),
  m('NYAKATI_KUENDELEA', 'NK_ALIKUWA', 'Thinks alikuwa means a finished act.', 'Alikuwa akipika humaanisha nini?', 'Alimaliza kupika', 'Alikuwa katikati ya kupika wakati huo', 'Alikuwa akipika ni uliopita hali ya kuendelea: tendo lilikuwa likiendelea.'),
  m('NYAKATI_KUENDELEA', 'NK_PAST_SIMPLE', 'Does not tell the simple past from the continuous.', 'Ni sentensi ipi ni uliopita hali ya kuendelea?', 'Alisoma jana', 'Walikuwa wakicheza uwanjani', 'Walikuwa wakicheza ni uliopita hali ya kuendelea.'),
  m('VITENZI_VIKUU', 'VV_KISAIDIZI_KUU', 'Calls the helping verb the main verb.', 'Katika "Alikuwa akisoma", kitenzi kikuu ni kipi?', 'alikuwa', 'akisoma', 'Kitenzi kikuu hubeba tendo: akisoma.'),
  m('VITENZI_VIKUU', 'VV_KUU_KISAIDIZI', 'Calls the main verb the helping verb.', 'Katika "Atakuwa akifanya kazi", kitenzi kisaidizi ni kipi?', 'akifanya', 'atakuwa', 'Kitenzi kisaidizi hutangulia kikuu: atakuwa.'),
  m('VITENZI_VIKUU', 'VV_SENTENSI', 'Thinks a sentence has only one verb word.', 'Katika "Walikuwa wakicheza", kuna vitenzi vingapi?', 'kimoja', 'viwili: walikuwa na wakicheza', 'Sentensi hii ina kisaidizi na kikuu.'),
  m('VISHIRIKISHI', 'VS_NI_SI', 'Mixes ni and si.', 'Ni kitenzi kishirikishi kipi cha kukanusha?', 'ni', 'si', 'Si ni kishirikishi cha kukanusha; ni cha kuthibitisha.'),
  m('VISHIRIKISHI', 'VS_YUKO', 'Uses yuko for a plural subject.', 'Kamilisha: Wanafunzi ___ darasani.', 'yuko', 'wako', 'Wanafunzi ni wengi, kwa hiyo tunasema wako.'),
  m('VISHIRIKISHI', 'VS_SIO', 'Does not know that si- is negative.', 'Neno sio katika "Huyu sio mwalimu" linaonyesha nini?', 'kuthibitisha', 'kukanusha', 'Sio ni kishirikishi cha kukanusha.'),
  m('NGELI_AWA_UI', 'GA_MTI_AWA', 'Puts mti in A-WA.', 'Mti ni wa ngeli gani?', 'A-WA', 'U-I', 'Mti ni wa ngeli ya U-I; wingi wake ni miti.'),
  m('NGELI_AWA_UI', 'GA_MTOTO_UI', 'Puts mtoto in U-I.', 'Mtoto ni wa ngeli gani?', 'U-I', 'A-WA', 'Mtoto ni mtu, kwa hiyo ni wa ngeli ya A-WA.'),
  m('NGELI_AWA_UI', 'GA_UPATANISHO', 'Uses the wrong agreement prefix.', 'Chagua sentensi sahihi.', 'Mti unakua na mtoto anakua zinakua', 'Mti unakua na watoto wanakua', 'A-WA: a-, wa-. U-I: u-, i-.'),
  m('NGELI_KIVI_LIYA', 'GK_KITABU', 'Puts kitabu in LI-YA.', 'Kitabu ni cha ngeli gani?', 'LI-YA', 'KI-VI', 'Kitabu ni cha ngeli ya KI-VI; wingi wake ni vitabu.'),
  m('NGELI_KIVI_LIYA', 'GK_JIWE', 'Puts jiwe in KI-VI.', 'Jiwe ni la ngeli gani?', 'KI-VI', 'LI-YA', 'Jiwe ni la ngeli ya LI-YA; wingi wake ni mawe.'),
  m('NGELI_KIVI_LIYA', 'GK_UPATANISHO', 'Uses the wrong agreement prefix.', 'Chagua sentensi sahihi.', 'Kitabu kimeanguka na vitabu limeanguka', 'Kitabu kimeanguka na vitabu vimeanguka', 'KI-VI: ki-, vi-. LI-YA: li-, ya-.'),
  m('VINYUME', 'VN_MAANA', 'Thinks an antonym is a synonym.', 'Kinyume cha neno ni nini?', 'Neno lenye maana sawa', 'Neno lenye maana kinyume', 'Kinyume cha neno ni neno lenye maana kinyume, kama kubwa na dogo.'),
  m('VINYUME', 'VN_KIVUMISHI', 'Gives the wrong antonym of an adjective.', 'Kinyume cha mrefu ni kipi?', 'mnene', 'mfupi', 'Kinyume cha mrefu ni mfupi.'),
  m('VINYUME', 'VN_NOMINO', 'Gives the wrong antonym of a noun.', 'Kinyume cha mchana ni kipi?', 'asubuhi', 'usiku', 'Kinyume cha mchana ni usiku.'),
  m('KAULI', 'KA_KUTENDEA', 'Confuses kutendea with kutendwa.', 'Ni kitenzi kipi katika kauli ya kutendea?', 'pikwa', 'pikia', 'Kutendea huonyesha kwa ajili ya nani, kama pikia.'),
  m('KAULI', 'KA_KUTENDWA', 'Does not know the passive.', 'Ni kitenzi kipi katika kauli ya kutendwa?', 'pikia', 'pikwa', 'Kutendwa huonyesha anayepokea tendo, kama pikwa.'),
  m('KAULI', 'KA_KUTENDA', 'Calls the base form a different voice.', 'Ni kitenzi kipi katika kauli ya kutenda?', 'pikwa', 'pika', 'Kutenda ni umbo la kawaida, kama pika.'),
  m('SENTENSI', 'ST_AMBATANO_MOJA', 'Thinks a compound sentence has one idea.', 'Sentensi ambatano ina nini?', 'Wazo moja tu', 'Mawazo mawili au zaidi yaliyounganishwa', 'Sentensi ambatano huunganisha mawazo mawili au zaidi.'),
  m('SENTENSI', 'ST_KIUNGANISHI', 'Does not see the conjunction.', 'Ni sentensi ipi ni ambatano?', 'Mama anapika.', 'Mama anapika na baba analima.', 'Kiunganishi na huunganisha mawazo mawili.'),
  m('SENTENSI', 'ST_SAHILI_NYINGI', 'Calls a long simple sentence compound.', 'Ni sentensi ipi ni sahili?', 'Alikuja lakini aliondoka.', 'Mtoto mwerevu anasoma kitabu kikubwa.', 'Sentensi sahili ina wazo moja, hata ikiwa ndefu.'),
  m('UKANUSHAJI', 'UK_ULIOPO', 'Negates the present with ha-ku-.', 'Kanusha: Anasoma.', 'Hakusoma', 'Hasomi', 'Ukanushaji wa uliopo ni hasomi.'),
  m('UKANUSHAJI', 'UK_ULIOPITA', 'Negates the past without -ku-.', 'Kanusha: Alisoma.', 'Hasomi', 'Hakusoma', 'Ukanushaji wa uliopita ni hakusoma.'),
  m('UKANUSHAJI', 'UK_UJAO', 'Negates the future wrongly.', 'Kanusha: Atasoma.', 'Hakusoma', 'Hatasoma', 'Ukanushaji wa ujao ni hatasoma.'),
  m('UKUBWA', 'UB_UDOGO', 'Mixes augmentative and diminutive.', 'Jibwa ni nini?', 'mbwa mdogo', 'mbwa mkubwa', 'Jibwa ni mbwa mkubwa: hali ya ukubwa.'),
  m('UKUBWA', 'UB_KIAMBISHI', 'Does not know the ji- prefix.', 'Ni kiambishi kipi cha ukubwa?', 'ki-', 'ji-', 'Kiambishi cha ukubwa ni ji-, kama jitu.'),
  m('UKUBWA', 'UB_JUMBA', 'Does not know jumba.', 'Jumba ni nini?', 'nyumba ndogo', 'nyumba kubwa', 'Jumba ni nyumba kubwa.'),
  m('USEMI', 'US_MTU', 'Keeps "mimi" in reported speech.', 'Badilisha: Juma alisema, "Mimi nitaenda." (usemi wa taarifa)', 'Juma alisema kwamba mimi nitaenda.', 'Juma alisema kwamba atakwenda.', 'Katika usemi wa taarifa mtu hubadilika: mimi huwa yeye.'),
  m('USEMI', 'US_ALAMA', 'Keeps quotation marks in reported speech.', 'Ni usemi upi ni wa taarifa?', 'Juma alisema, "Nitakuja."', 'Juma alisema kwamba atakuja.', 'Usemi wa taarifa hauna alama za usemi.'),
  m('USEMI', 'US_WAKATI', 'Does not change the tense.', 'Usemi halisi una nini?', 'Maneno ya msemaji bila alama', 'Maneno kamili ya msemaji katika alama za usemi', 'Usemi halisi ni maneno kamili ya msemaji katika alama za usemi.'),
  m('HERUFI_KUBWA', 'HK_JINA', 'Does not capitalise a name.', 'Ni sentensi ipi imeandikwa sawa?', 'tuliona nairobi jana.', 'Tuliona Nairobi jana.', 'Sentensi huanza kwa herufi kubwa, na majina ya pekee pia.'),
  m('HERUFI_KUBWA', 'HK_KIKOMO', 'Leaves out the full stop.', 'Sentensi ya kawaida huisha kwa nini?', 'kiulizi', 'kikomo', 'Sentensi ya kawaida huisha kwa kikomo (.).'),
  m('HERUFI_KUBWA', 'HK_KATIKATI', 'Capitalises words in the middle for no reason.', 'Ni sentensi ipi ina herufi kubwa isiyofaa?', 'Mama alinunua Mkate.', 'Mama alinunua mkate.', 'Herufi kubwa si kwa nomino ya kawaida katikati ya sentensi.'),
  m('KIULIZI_KOMA', 'KK_KIKOMO', 'Ends a question with a full stop.', 'Swali huisha kwa nini?', 'kikomo', 'kiulizi', 'Swali huisha kwa kiulizi (?).'),
  m('KIULIZI_KOMA', 'KK_KOMA', 'Does not use the comma in a list.', 'Ni sentensi ipi ina koma sahihi?', 'Nilinunua, mkate maziwa na sukari.', 'Nilinunua mkate, maziwa na sukari.', 'Koma hutenganisha vitu katika orodha.'),
  m('KIULIZI_KOMA', 'KK_SALAMU', 'Omits the comma after a greeting word.', 'Ni salamu ipi ina koma?', 'Mpendwa rafiki yangu', 'Mpendwa rafiki yangu,', 'Salamu ya barua huishia kwa koma.'),
  m('BARUA_MWALIKO', 'BM_HITIMISHO', 'Puts the closing line first.', 'Barua ya kirafiki huanza kwa nini?', 'jina la mwandishi', 'anwani ya mwandishi na tarehe', 'Barua huanza kwa anwani na tarehe, huisha kwa hitimisho na jina.'),
  m('BARUA_MWALIKO', 'BM_SALAMU', 'Uses a formal greeting in a friendly letter.', 'Ni salamu ipi inafaa barua ya kirafiki?', 'Mkuu wa Shule', 'Mpendwa rafiki yangu', 'Barua ya kirafiki huanza kwa salamu ya kirafiki.'),
  m('BARUA_MWALIKO', 'BM_UMUHIMU', 'Does not know why an invitation is written.', 'Mwaliko huandikwa kwa nini?', 'kumkaripia mtu', 'kumwita mtu kwenye tukio', 'Mwaliko humwita mtu kwenye tukio.'),
  m('BARUA_MSAMAHA', 'BS_ANWANI', 'Gives one address in a formal letter.', 'Barua rasmi ina anwani ngapi?', 'moja', 'mbili: ya mwandishi na ya mwandikiwa', 'Barua rasmi ina anwani mbili.'),
  m('BARUA_MSAMAHA', 'BS_KICHWA', 'Leaves out the heading of a formal letter.', 'Barua rasmi huwa na nini kabla ya ujumbe?', 'hakuna kitu', 'kichwa cha barua', 'Barua rasmi ina kichwa cha barua.'),
  m('BARUA_MSAMAHA', 'BS_LUGHA', 'Uses slang in a formal letter.', 'Lugha ya barua rasmi ni ipi?', 'ya mtaani', 'ya heshima na sanifu', 'Barua rasmi hutumia lugha ya heshima na sanifu.'),
  m('FASIHI_TANZU', 'FT_SIMULIZI', 'Thinks oral literature is written.', 'Fasihi simulizi hupitishwa kwa njia gani?', 'kwa maandishi', 'kwa mdomo', 'Fasihi simulizi hupitishwa kwa mdomo.'),
  m('FASIHI_TANZU', 'FT_ANDISHI', 'Thinks written literature is spoken.', 'Fasihi andishi hupitishwa kwa njia gani?', 'kwa mdomo', 'kwa maandishi', 'Fasihi andishi huandikwa.'),
  m('FASIHI_TANZU', 'FT_TANZU', 'Names a non-literature item as a tanzu.', 'Ni tanzu ipi ya fasihi simulizi?', 'barua rasmi', 'methali', 'Methali ni tanzu ya fasihi simulizi.'),
  m('UFUPISHO', 'UF_NAKALA', 'Thinks a summary copies the passage.', 'Ufupisho ni nini?', 'kunakili habari yote', 'kutoa habari kuu kwa ufupi', 'Ufupisho ni kutoa habari kuu bila kupoteza maana.'),
  m('UFUPISHO', 'UF_MAANA', 'Thinks a summary may change the meaning.', 'Ufupisho unapaswa kuwa vipi?', 'upoteze maana ya habari', 'uhifadhi maana ya habari', 'Ufupisho huhifadhi maana ya habari.'),
  m('UFUPISHO', 'UF_HABARI_KUU', 'Picks a detail as the main idea.', 'Habari kuu ya aya ni ipi?', 'mfano mdogo uliotolewa', 'wazo kuu la aya nzima', 'Habari kuu ni wazo kuu la aya nzima.'),
];
