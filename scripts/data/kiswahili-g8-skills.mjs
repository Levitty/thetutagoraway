// ============================================================================
// KISWAHILI GRADE 8: authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/kiswahili/g8.json by scripts/build-kiswahili-g8.mjs. KICD's outcomes and rubrics are never touched.
// Skills cover the grammar (sarufi), punctuation, letter and email knowledge and ufupisho outcomes a tapped question can test.
// Listening, reading passages, composition, oral work and attitudes are not tested here (see the non-question note).
// Items whose answer depends on a contested rule are left out. Everything is draft until a native Kiswahili teacher reviews it.
// A skill: [sub-strand key after 'KISW.G8.', id, name, outcome letters, prerequisite ids, forms, mastery].
// ============================================================================
const V1 = 'SARUFI.T1_VIWAKILISHI', V2 = 'SARUFI.T2_VIWAKILISHI', V3 = 'SARUFI.T3_VIWAKILISHI', T4 = 'SARUFI.T4_NYAKATI_NA_HALI', T5 = 'SARUFI.T5_NYAKATI_NA_HALI';
const VV6 = 'SARUFI.T6_VIVUMISHI', VV7 = 'SARUFI.T7_VIVUMISHI', G8 = 'SARUFI.T8_NGELI_NA_UPATANISHO_', G9 = 'SARUFI.T9_NGELI_NA_UPATANISHO_';
const VN = 'SARUFI.T10_VINYUME_VYA_VITENZI_', MN = 'SARUFI.T11_MNYAMBULIKO_WA_VITEN', ST = 'SARUFI.T12_AINA_ZA_SENTENSI', UK = 'SARUFI.T13_UKANUSHAJI_KWA_KUZIN', UD = 'SARUFI.T14_UDOGO_WA_NOMINO', US = 'SARUFI.T15_USEMI_HALISI_NA_USEM';
const HR = 'KUANDI.T1_VIAKIFISHI', MM = 'KUANDI.T8_VIAKIFISHI', BS = 'KUANDI.T2_BARUA_YA_KIRAFIKI', BM = 'KUANDI.T10_BARUA_RASMI_YA_KUOMB', BE = 'KUANDI.T15_BARUAPEPE_YA_KIOFISI', UF = 'KUSOMA.T15_UFUPISHO';
const FM = ['chagua jibu sahihi', 'chagua jibu katika hadithi fupi', 'tafuta hatua yenye kosa'];
export const SKILLS = [
  [V1, 'VIW_NAFSI', 'Tambua viwakilishi vya nafsi, vionyeshi na vya idadi', ['a', 'b'], [], FM, 'Mtoto hutambua viwakilishi vya nafsi (mimi, wewe, yeye, sisi, ninyi, wao), vionyeshi (huyu, huyo, yule) na vya idadi (wawili, watatu), na huvitumia badala ya nomino.'],
  [V2, 'VIW_ULIZI', 'Tambua viwakilishi viulizi na vya sifa', ['a'], ['VIW_NAFSI'], FM, 'Mtoto hutambua viwakilishi viulizi (nani, nini, lipi, kipi, ngapi) vinavyouliza, na vya sifa vinavyochukua nafasi ya nomino na sifa yake (mrefu amefika).'],
  [V3, 'VIW_MILIKISHI', 'Tambua viwakilishi vimilikishi na visisitizi', ['a', 'b'], ['VIW_NAFSI'], FM, 'Mtoto hutambua kimilikishi (changu, chake, chetu, vyao) kinachoonyesha umiliki na kisisitizi (mwenyewe, wenyewe) kinachosisitiza mtu au kitu.'],
  [T4, 'MAZOEA_TIMILIFU', 'Tambua hali ya mazoea na hali timilifu', ['a', 'b'], [], FM, 'Mtoto hutambua hali ya mazoea inayotumia hu- (huenda sokoni kila siku) na hali timilifu inayotumia -me- (amefika) kuonyesha tendo lililokamilika.'],
  [T5, 'TIMILIFU_WAKATI', 'Tambua uliopita timilifu na ujao timilifu', ['a', 'b', 'c'], ['MAZOEA_TIMILIFU'], FM, 'Mtoto hutambua uliopita timilifu (alikuwa amefika) na ujao timilifu (atakuwa amefika), na hutofautisha kila mmoja na wakati rahisi.'],
  [VV6, 'VIVUMISHI_SIFA', 'Tambua vivumishi vya sifa na vya kuashiria', ['a'], [], FM, 'Mtoto hutambua kivumishi cha sifa (mzuri, refu) kinachoeleza nomino na kivumishi cha kuashiria (huyu, huo, ile) kinachoonyesha nomino.'],
  [VV7, 'VIVUMISHI_MILIKI', 'Tambua vivumishi vimilikishi na vya idadi', ['a'], ['VIVUMISHI_SIFA'], FM, 'Mtoto hutambua kivumishi kimilikishi (kitabu changu, nyumba yake) na cha idadi (watoto wawili, vitabu vitatu) kinachofuata nomino.'],
  [MM, 'MTAJO_MSHAZARI', 'Tumia alama za mtajo na mshazari', ['a', 'b'], [], FM, 'Mtoto hutumia alama za mtajo (" ") kunukuu maneno halisi ya mtu au kichwa cha kitabu, na mshazari (/) kutenga machaguo au kuandika tarehe.'],
  [HR, 'HISI_RITIFAA', 'Tumia alama ya hisi na ritifaa', ['a', 'b'], [], FM, 'Mtoto hutumia alama ya hisi (!) mwishoni mwa sentensi ya mshangao au amri kali, na ritifaa (\') katika maneno kama ng\'ombe na ng\'ambo.'],
  [G8, 'NGELI_IZI', 'Tumia ngeli ya I-ZI na upatanisho wa kisarufi', ['a', 'b', 'c'], [], FM, 'Mtoto hutambua nomino za I-ZI (nyumba, meza, ndege, barua) na hutumia viambishi i- (umoja) na zi- (wingi): nyumba inapendeza, nyumba zinapendeza.'],
  [G9, 'NGELI_UU_UYA', 'Tumia ngeli za U-U na U-YA na upatanisho wa kisarufi', ['a', 'b', 'c'], [], FM, 'Mtoto hutambua nomino za U-U (uji, ugali, unga, upendo) zinazotumia u-: uji umeiva, na za U-YA (ugonjwa, magonjwa) zinazotumia u- na ya-: ugonjwa unaumiza, magonjwa yanaumiza.'],
  [BS, 'BARUA_SHUKRANI', 'Tambua muundo na umuhimu wa barua ya kirafiki ya shukrani', ['a', 'b'], [], FM, 'Mtoto hueleza kuwa barua ya shukrani huonyesha kuthamini wema na hutambua vipengele vyake (anwani, tarehe, salamu, ujumbe, hitimisho, jina).'],
  [BM, 'BARUA_MSAADA', 'Tambua muundo wa barua rasmi ya kuomba msaada', ['a', 'b'], ['BARUA_SHUKRANI'], FM, 'Mtoto hutambua vipengele vya barua rasmi (anwani mbili, tarehe, salamu rasmi, kichwa, ujumbe, hitimisho) na kuwa lugha yake ni ya heshima.'],
  [VN, 'VINYUME_VITENZI', 'Tambua vinyume vya vitenzi na vielezi', ['a', 'b'], [], FM, 'Mtoto hueleza kinyume ni neno lenye maana kinyume na hutambua vinyume vya vitenzi (fungua na funga, nunua na uza) na vya vielezi (juu na chini, mbele na nyuma, polepole na haraka).'],
  [MN, 'KAULI_TENDEKA', 'Tambua kauli za kutendeka, kutendewa na kutendatenda', ['a', 'b'], [], FM, 'Mtoto hutambua kutendeka (pika, pikika), kutendewa (pikiwa) na kutendatenda (pigapiga, tendo linalorudiwa).'],
  [ST, 'SENTENSI_CHANGAMANO', 'Tambua sentensi changamano', ['a', 'b'], [], FM, 'Mtoto hueleza sentensi changamano ina kishazi huru (kinachojitegemea) na kishazi tegemezi (kisichojitegemea), kama "Mtoto aliyeshinda alipewa zawadi".'],
  [UK, 'UKANUSHAJI_TIMILIFU', 'Kanusha sentensi katika hali ya mazoea na timilifu', ['b', 'c'], ['MAZOEA_TIMILIFU'], FM, 'Mtoto hukanusha hali timilifu kwa ha-ja- (amefika, hajafika) na hali ya mazoea kwa kuondoa hu- (hufika, hafiki).'],
  [UD, 'UDOGO', 'Tambua nomino katika hali ya udogo', ['a', 'b'], [], FM, 'Mtoto hutambua kijiji (mji mdogo), kijiti (mti mdogo), kijumba (nyumba ndogo) na kitoto (mtoto mdogo), na kuwa ki- na kiambishi chake huonyesha udogo.'],
  [US, 'USEMI_TAARIFA', 'Tambua usemi halisi na wa taarifa', ['a', 'c'], [], FM, 'Mtoto hutambua usemi halisi (maneno kamili ndani ya alama za usemi) na wa taarifa (bila alama za usemi, kwa kutumia kwamba au kuwa), na hubadilisha mtu ipasavyo.'],
  [BE, 'BARUAPEPE', 'Tambua vipengele vya baruapepe ya kiofisi', ['a', 'b'], [], FM, 'Mtoto hutambua anwani ya mpokeaji, kichwa cha habari (mada), salamu, ujumbe, hitimisho na jina la mwandishi, na kuwa lugha ni rasmi na fupi.'],
  [UF, 'UFUPISHO', 'Eleza ufupisho na habari kuu ya aya', ['a', 'b'], [], FM, 'Mtoto hueleza ufupisho ni kutoa habari kuu bila kupoteza maana na hutambua habari kuu ya aya.'],
];

// [skill id, code, error (for the teacher), example question, wrong, right, feedback (child, Kiswahili)]
const m = (skill, code, error, q, wrong, right, feedback) => [skill, `M_KS8_${code}`, error, q, wrong, right, feedback];
export const MIS = [
  m('VIW_NAFSI', 'VN_NAFSI', 'Mixes person pronouns.', 'Ni kiwakilishi kipi cha nafsi ya kwanza wingi?', 'wao', 'sisi', 'Sisi ni nafsi ya kwanza wingi.'),
  m('VIW_NAFSI', 'VN_ONYESHI', 'Mixes demonstratives.', 'Ni kiwakilishi kipi cha kuonyesha mtu aliye karibu?', 'yule', 'huyu', 'Huyu huonyesha aliye karibu.'),
  m('VIW_NAFSI', 'VN_IDADI', 'Does not know number pronouns.', 'Ni kiwakilishi kipi cha idadi?', 'huyu', 'wawili', 'Wawili ni kiwakilishi cha idadi.'),
  m('VIW_ULIZI', 'VU_ULIZA', 'Uses an interrogative as a statement.', 'Ni kiwakilishi kipi kinauliza kuhusu mtu?', 'yeye', 'nani', 'Nani huuliza kuhusu mtu.'),
  m('VIW_ULIZI', 'VU_NINI', 'Mixes nani and nini.', 'Ni kiwakilishi kipi kinauliza kuhusu kitu?', 'nani', 'nini', 'Nini huuliza kuhusu kitu.'),
  m('VIW_ULIZI', 'VU_SIFA', 'Does not know the sifa pronoun.', 'Katika "Mrefu amefika", mrefu ni nini?', 'kivumishi', 'kiwakilishi cha sifa', 'Mrefu hapa linasimama badala ya nomino.'),
  m('VIW_MILIKISHI', 'VM_MILIKI', 'Mixes kimilikishi and kisisitizi.', 'Ni kiwakilishi kimilikishi kipi?', 'mwenyewe', 'changu', 'Changu ni kimilikishi.'),
  m('VIW_MILIKISHI', 'VM_SISITIZI', 'Mixes kisisitizi and kimilikishi.', 'Ni kiwakilishi kisisitizi kipi?', 'changu', 'mwenyewe', 'Mwenyewe ni kisisitizi.'),
  m('VIW_MILIKISHI', 'VM_UPATANISHO', 'Wrong agreement of possessive.', 'Kamilisha: kitabu ___ (changu/wangu)', 'wangu', 'changu', 'Kitabu hupatana na changu.'),
  m('MAZOEA_TIMILIFU', 'MT_HU', 'Thinks hu- shows a finished act.', 'Katika "Huenda sokoni kila siku", hali ni ipi?', 'timilifu', 'ya mazoea', 'Hu- huonyesha mazoea.'),
  m('MAZOEA_TIMILIFU', 'MT_ME', 'Thinks -me- shows habit.', 'Katika "Amefika", hali ni ipi?', 'ya mazoea', 'timilifu', '-me- huonyesha tendo lililokamilika.'),
  m('MAZOEA_TIMILIFU', 'MT_LI', 'Thinks -li- is timilifu.', 'Katika "Alifika", ni hali gani?', 'timilifu', 'wakati uliopita rahisi', '-li- ni wakati uliopita rahisi.'),
  m('TIMILIFU_WAKATI', 'TW_PAST', 'Mixes the two perfect tenses.', 'Ni sentensi ipi iko katika uliopita timilifu?', 'Atakuwa amefika', 'Alikuwa amefika', 'Alikuwa amefika ni uliopita timilifu.'),
  m('TIMILIFU_WAKATI', 'TW_FUT', 'Mixes the two perfect tenses.', 'Ni sentensi ipi iko katika ujao timilifu?', 'Alikuwa amefika', 'Atakuwa amefika', 'Atakuwa amefika ni ujao timilifu.'),
  m('TIMILIFU_WAKATI', 'TW_SIMPLE', 'Takes the simple tense as perfect.', 'Ni sentensi ipi ni timilifu?', 'Alifika jana', 'Alikuwa amefika jana', 'Timilifu ina ame- baada ya alikuwa.'),
  m('VIVUMISHI_SIFA', 'VS_SIFA', 'Mixes sifa and kuashiria.', 'Ni kivumishi cha sifa kipi?', 'huyu', 'mzuri', 'Mzuri ni kivumishi cha sifa.'),
  m('VIVUMISHI_SIFA', 'VS_ASHIRIA', 'Mixes kuashiria and sifa.', 'Ni kivumishi cha kuashiria kipi?', 'mzuri', 'huyu', 'Huyu ni kivumishi cha kuashiria.'),
  m('VIVUMISHI_SIFA', 'VS_NAFASI', 'Puts the adjective before the noun.', 'Ni sentensi ipi imepangwa sawa?', 'Mzuri mtoto', 'Mtoto mzuri', 'Kivumishi hufuata nomino.'),
  m('VIVUMISHI_MILIKI', 'VK_MILIKI', 'Mixes possessive and number.', 'Ni kivumishi kimilikishi kipi?', 'wawili', 'wangu', 'Wangu ni kivumishi kimilikishi.'),
  m('VIVUMISHI_MILIKI', 'VK_IDADI', 'Mixes number and possessive.', 'Ni kivumishi cha idadi kipi?', 'wangu', 'watatu', 'Watatu ni kivumishi cha idadi.'),
  m('VIVUMISHI_MILIKI', 'VK_NAFASI', 'Puts it before the noun.', 'Ni sentensi ipi imepangwa sawa?', 'Wawili watoto', 'Watoto wawili', 'Kivumishi hufuata nomino.'),
  m('MTAJO_MSHAZARI', 'MM_MTAJO', 'Uses brackets for speech.', 'Ni alama ipi hunukuu maneno halisi ya mtu?', 'mshazari', 'alama za mtajo', 'Alama za mtajo hunukuu maneno halisi.'),
  m('MTAJO_MSHAZARI', 'MM_MSHAZARI', 'Uses a comma for choices.', 'Ni alama ipi hutenga machaguo kama ama/au?', 'koma', 'mshazari', 'Mshazari hutenga machaguo.'),
  m('MTAJO_MSHAZARI', 'MM_TAREHE', 'Does not know dates use slash.', 'Ni tarehe ipi imeandikwa kwa mshazari?', '12.11.2026', '12/11/2026', 'Mshazari hutumika katika tarehe.'),
  m('HISI_RITIFAA', 'HR_HISI', 'Ends an exclamation with a full stop.', 'Sentensi ya mshangao huisha kwa nini?', 'kikomo', 'alama ya hisi', 'Sentensi ya mshangao huisha kwa alama ya hisi (!).'),
  m('HISI_RITIFAA', 'HR_RITIFAA', 'Writes ng\'ombe without the apostrophe.', 'Ni neno lipi limeandikwa sawa?', 'ngombe', 'ng\'ombe', 'Ng\'ombe huandikwa kwa ritifaa.'),
  m('HISI_RITIFAA', 'HR_AMRI', 'Ends a strong command with a question mark.', 'Amri kali huisha kwa nini?', 'kiulizi', 'alama ya hisi', 'Amri kali huisha kwa alama ya hisi.'),
  m('NGELI_IZI', 'GI_UMOJA', 'Uses zi- for the singular.', 'Chagua sentensi sahihi.', 'Nyumba zinapendeza.', 'Nyumba inapendeza.', 'Umoja wa I-ZI hutumia i-.'),
  m('NGELI_IZI', 'GI_WINGI', 'Uses i- for the plural.', 'Chagua sentensi sahihi kwa wingi.', 'Nyumba inapendeza sana.', 'Nyumba zinapendeza.', 'Wingi wa I-ZI hutumia zi-.'),
  m('NGELI_IZI', 'GI_NOMINO', 'Names a wrong noun for the ngeli.', 'Ni nomino ipi ni ya ngeli ya I-ZI?', 'mtoto', 'meza', 'Meza ni ya I-ZI.'),
  m('NGELI_UU_UYA', 'GU_UJI', 'Uses ki- for uji.', 'Chagua sentensi sahihi.', 'Uji kimeiva.', 'Uji umeiva.', 'Uji ni wa U-U na hutumia u-.'),
  m('NGELI_UU_UYA', 'GU_UGONJWA', 'Uses u- for the plural.', 'Chagua sentensi sahihi kwa wingi.', 'Magonjwa unaumiza.', 'Magonjwa yanaumiza.', 'Wingi wa U-YA hutumia ya-.'),
  m('NGELI_UU_UYA', 'GU_NOMINO', 'Names a wrong noun.', 'Ni nomino ipi ni ya ngeli ya U-U?', 'kitabu', 'ugali', 'Ugali ni wa U-U.'),
  m('BARUA_SHUKRANI', 'BH_MAANA', 'Thinks a thanks letter asks for something.', 'Barua ya shukrani huandikwa kwa nini?', 'kuomba kitu', 'kuthamini wema', 'Barua ya shukrani huthamini wema.'),
  m('BARUA_SHUKRANI', 'BH_SALAMU', 'Uses a formal greeting.', 'Ni salamu ipi inafaa barua ya shukrani ya kirafiki?', 'Mkuu wa Shule', 'Mpendwa rafiki yangu', 'Barua ya kirafiki hutumia salamu ya kirafiki.'),
  m('BARUA_SHUKRANI', 'BH_MWANZO', 'Starts with the closing.', 'Barua huanza kwa nini?', 'jina la mwandishi', 'anwani na tarehe', 'Barua huanza kwa anwani na tarehe.'),
  m('BARUA_MSAADA', 'BA_ANWANI', 'Gives one address.', 'Barua rasmi ina anwani ngapi?', 'moja', 'mbili', 'Barua rasmi ina anwani mbili.'),
  m('BARUA_MSAADA', 'BA_KICHWA', 'Leaves out the heading.', 'Barua rasmi huwa na nini kabla ya ujumbe?', 'hakuna kitu', 'kichwa cha barua', 'Barua rasmi ina kichwa cha barua.'),
  m('BARUA_MSAADA', 'BA_LUGHA', 'Uses slang.', 'Lugha ya barua rasmi ni ipi?', 'ya mtaani', 'ya heshima na sanifu', 'Barua rasmi hutumia lugha ya heshima.'),
  m('VINYUME_VITENZI', 'VT_KITENZI', 'Gives a wrong verb antonym.', 'Kinyume cha fungua ni kipi?', 'nunua', 'funga', 'Kinyume cha fungua ni funga.'),
  m('VINYUME_VITENZI', 'VT_KIELEZI', 'Gives a wrong adverb antonym.', 'Kinyume cha polepole ni kipi?', 'chini', 'haraka', 'Kinyume cha polepole ni haraka.'),
  m('VINYUME_VITENZI', 'VT_NUNUA', 'Gives a wrong antonym of nunua.', 'Kinyume cha nunua ni kipi?', 'pika', 'uza', 'Kinyume cha nunua ni uza.'),
  m('KAULI_TENDEKA', 'KT_TENDEKA', 'Confuses kutendeka with kutendewa.', 'Ni kitenzi kipi kiko katika kauli ya kutendeka?', 'pikiwa', 'pikika', 'Pikika ni kutendeka.'),
  m('KAULI_TENDEKA', 'KT_TENDEWA', 'Confuses kutendewa with kutendeka.', 'Ni kitenzi kipi kiko katika kauli ya kutendewa?', 'pikika', 'pikiwa', 'Pikiwa ni kutendewa.'),
  m('KAULI_TENDEKA', 'KT_TENDATENDA', 'Does not know the repeated act.', 'Pigapiga humaanisha nini?', 'kupiga mara moja', 'kupiga mara nyingi', 'Pigapiga ni kupiga mara nyingi.'),
  m('SENTENSI_CHANGAMANO', 'SC_MAANA', 'Thinks it has no subordinate clause.', 'Sentensi changamano ina nini?', 'kishazi kimoja tu', 'kishazi huru na tegemezi', 'Changamano ina kishazi huru na tegemezi.'),
  m('SENTENSI_CHANGAMANO', 'SC_TEGEMEZI', 'Thinks a dependent clause stands alone.', 'Kishazi tegemezi hufanya nini?', 'kinajitegemea', 'hakijitegemei', 'Kishazi tegemezi hakijitegemei.'),
  m('SENTENSI_CHANGAMANO', 'SC_SAHILI', 'Takes a simple sentence as complex.', 'Ni sentensi ipi ni changamano?', 'Mtoto analia.', 'Mtoto aliyeshinda alipewa zawadi.', 'Changamano ina kishazi tegemezi.'),
  m('UKANUSHAJI_TIMILIFU', 'UT_TIMILIFU', 'Uses hakuku- for timilifu.', 'Kanusha: Amefika.', 'Hakufika', 'Hajafika', 'Timilifu hukanushwa kwa ha-ja-.'),
  m('UKANUSHAJI_TIMILIFU', 'UT_MAZOEA', 'Does not drop hu-.', 'Kanusha: Hufika.', 'Hahufika', 'Hafiki', 'Hali ya mazoea hukanushwa kwa hafiki.'),
  m('UKANUSHAJI_TIMILIFU', 'UT_WINGI', 'Wrong plural negation.', 'Kanusha: Wamefika.', 'Hawakufika', 'Hawajafika', 'Wingi ni hawajafika.'),
  m('UDOGO', 'UD_KIJIJI', 'Gives the wrong small noun.', 'Kijiji ni nini?', 'mji mkubwa', 'mji mdogo', 'Kijiji ni mji mdogo.'),
  m('UDOGO', 'UD_KIJITI', 'Gives the wrong small noun.', 'Kijiti ni nini?', 'mti mkubwa', 'mti mdogo', 'Kijiti ni mti mdogo.'),
  m('UDOGO', 'UD_KIAMBISHI', 'Wrong prefix for udogo.', 'Ni kiambishi kipi cha udogo?', 'ji-', 'ki-', 'Udogo hutumia ki-.'),
  m('USEMI_TAARIFA', 'UTA_ALAMA', 'Keeps quotation marks.', 'Ni usemi upi ni wa taarifa?', 'Baba alisema, "Nimechoka."', 'Baba alisema kwamba amechoka.', 'Usemi wa taarifa hauna alama za usemi.'),
  m('USEMI_TAARIFA', 'UTA_HALISI', 'Mixes halisi with taarifa.', 'Ni usemi upi ni halisi?', 'Baba alisema kwamba amechoka.', 'Baba alisema, "Nimechoka."', 'Usemi halisi una alama za usemi.'),
  m('USEMI_TAARIFA', 'UTA_MTU', 'Keeps the person the same.', 'Juma alisema, "Mimi ni mgonjwa." Taarifa ni ipi?', 'Juma alisema kwamba mimi ni mgonjwa.', 'Juma alisema kwamba yeye ni mgonjwa.', 'Mtu hubadilika: mimi huwa yeye.'),
  m('BARUAPEPE', 'BP_MADA', 'Leaves out the subject line.', 'Ni sehemu ipi ya baruapepe inaonyesha kichwa cha habari?', 'jina la mwandishi', 'mada', 'Mada ni kichwa cha baruapepe.'),
  m('BARUAPEPE', 'BP_LUGHA', 'Uses slang in an office email.', 'Lugha ya baruapepe ya kiofisi ni ipi?', 'ya mtaani', 'rasmi na fupi', 'Baruapepe ya kiofisi ni rasmi na fupi.'),
  m('BARUAPEPE', 'BP_ANWANI', 'Uses the wrong address field.', 'Anwani ya mpokeaji huandikwa wapi?', 'mwishoni', 'sehemu ya "Kwa"', 'Mpokeaji huandikwa kwenye "Kwa".'),
  m('UFUPISHO', 'UF_NAKALA', 'Thinks a summary copies.', 'Ufupisho ni nini?', 'kunakili habari yote', 'kutoa habari kuu kwa ufupi', 'Ufupisho ni habari kuu kwa ufupi.'),
  m('UFUPISHO', 'UF_MAANA', 'Thinks meaning may change.', 'Ufupisho unapaswa kuwa vipi?', 'upoteze maana', 'uhifadhi maana', 'Ufupisho huhifadhi maana.'),
  m('UFUPISHO', 'UF_KUU', 'Picks a detail as the main idea.', 'Habari kuu ya aya ni ipi?', 'mfano mdogo', 'wazo kuu la aya', 'Habari kuu ni wazo kuu.'),
];
