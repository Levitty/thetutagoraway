// ============================================================================
// KISWAHILI GRADE 7, KUANDIKA, FASIHI NA UFUPISHO (6 skills): herufi kubwa na kikomo, kiulizi na koma, barua ya kirafiki ya mwaliko,
// barua rasmi ya kuomba msamaha, maana ya fasihi na tanzu zake, ufupisho. Written offline. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a native Kiswahili teacher signs them off.
// ============================================================================
import { S } from './kiswahili_g7_lib.js';

export const FAMILIES = [
  ...S('hk', 'KUANDI.T1_VIAKIFISHI.', 'HERUFI_KUBWA', ['HK_JINA', 'HK_KIKOMO', 'HK_KATIKATI'], ['Herufi kubwa mwanzoni mwa sentensi na kwa majina ya pekee.', 'Sentensi ya kawaida huisha kwa kikomo.'], [
    ['Sentensi ya kawaida huisha kwa nini?', 'kikomo', 'kiulizi', 'koma', 'herufi kubwa'],
    ['Ni neno lipi linahitaji herufi kubwa katikati ya sentensi?', 'Kisumu', 'mji', 'ziwa', 'barabara'],
    ['Sentensi huanza kwa herufi gani?', 'Herufi kubwa', 'Herufi ndogo', 'Herufi nzito', 'Herufi yoyote'],
    ['Ni jina lipi la pekee linalohitaji herufi kubwa?', 'Wanjiru', 'msichana', 'mwalimu', 'mama'],
    ['Kikomo ni alama gani?', 'Nukta', 'Koma', 'Kiulizi', 'Mkato'],
  ], [
    ['Katika "Amina alisafiri hadi Mombasa", ni maneno yapi yanahitaji herufi kubwa?', 'Amina na Mombasa', 'alisafiri na hadi', 'hadi na Mombasa', 'Amina pekee'],
    ['Katika "Baba alinunua mkate", mkate ni nomino ya kawaida. Huandikwa kwa herufi gani?', 'Herufi ndogo', 'Herufi kubwa', 'Herufi nzito', 'Herufi ndefu'],
    ['Kamilisha kwa alama sahihi: Mama anapika chakula ___', '.', '?', ',', '!'],
    ['Katika "Kenya ni nchi nzuri", ni neno gani linahitaji herufi kubwa?', 'Kenya', 'nchi', 'nzuri', 'ni'],
    ['Katika "Mwalimu amefika leo", neno la kwanza huandikwa vipi?', 'kwa herufi kubwa', 'kwa herufi ndogo', 'kwa herufi nzito', 'kwa herufi yoyote'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Nairobi ni jina la pekee.', 'Hatua 2: Majina ya pekee huanza kwa herufi kubwa.', 'Hatua 3: Kwa hiyo naandika "nairobi".', 'Naandika "Nairobi" kwa herufi kubwa.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Sentensi ya kawaida inaisha kwa kikomo.', 'Hatua 2: Kikomo ni nukta.', 'Hatua 3: Kwa hiyo naiacha sentensi bila alama yoyote.', 'Naweka kikomo mwishoni.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mkate ni nomino ya kawaida.', 'Hatua 2: Haitaji herufi kubwa katikati.', 'Hatua 3: Kwa hiyo naandika "Mkate" kwa herufi kubwa.', 'Naandika "mkate".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Sentensi huanza kwa herufi kubwa.', 'Hatua 2: Neno la kwanza ni "juma".', 'Hatua 3: Kwa hiyo naliandika "juma".', 'Naandika "Juma".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kisumu ni mji.', 'Hatua 2: Ni jina la pekee.', 'Hatua 3: Kwa hiyo naandika "kisumu" kwa herufi ndogo.', 'Naandika "Kisumu".', 2],
  ], ['a', 'b']),
  ...S('kk', 'KUANDI.T8_VIAKIFISHI.', 'KIULIZI_KOMA', ['KK_KIKOMO', 'KK_KOMA', 'KK_SALAMU'], ['Swali huisha kwa kiulizi (?).', 'Koma hutenganisha vitu katika orodha.'], [
    ['Swali huisha kwa nini?', 'kiulizi', 'kikomo', 'koma', 'nukta'],
    ['Ni sentensi ipi ina koma sahihi?', 'Nilinunua mkate, maziwa na sukari.', 'Nilinunua, mkate maziwa na sukari.', 'Nilinunua mkate maziwa, na sukari.', 'Nilinunua mkate maziwa na, sukari.'],
    ['Ni swali lipi limeandikwa sawa?', 'Unaitwa nani?', 'Unaitwa nani.', 'Unaitwa nani,', 'Unaitwa nani!'],
    ['Koma hutumiwa kufanya nini?', 'Kutenganisha vitu katika orodha', 'Kumaliza swali', 'Kuanza sentensi', 'Kuonyesha jina'],
    ['Ni salamu ipi ina koma?', 'Mpendwa rafiki yangu,', 'Mpendwa rafiki yangu', 'Mpendwa rafiki yangu.', 'Mpendwa rafiki yangu?'],
  ], [
    ['Kamilisha kwa alama sahihi: Unaenda wapi ___', '?', '.', ',', '!'],
    ['Chagua sentensi sahihi.', 'Tulinunua nyanya, vitunguu na karoti.', 'Tulinunua nyanya vitunguu, na karoti.', 'Tulinunua, nyanya vitunguu na karoti.', 'Tulinunua nyanya vitunguu na, karoti.'],
    ['Chagua swali lililoandikwa sawa.', 'Nani amefika?', 'Nani amefika.', 'Nani amefika,', 'Nani amefika!'],
    ['Ni wapi tunaweka koma katika "Jumatatu Jumanne na Jumatano"?', 'Baada ya Jumatatu', 'Baada ya na', 'Kabla ya Jumatatu', 'Baada ya Jumatano'],
    ['Salamu ya barua huisha kwa alama gani?', 'koma', 'kikomo', 'kiulizi', 'hakuna'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Unaitwa nani" ni swali.', 'Hatua 2: Swali huisha kwa kiulizi.', 'Hatua 3: Kwa hiyo naliandika "Unaitwa nani."', 'Naliandika "Unaitwa nani?"', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Orodha ya vitu hutenganishwa kwa koma.', 'Hatua 2: Naandika "mkate, maziwa na sukari".', 'Hatua 3: Kwa hiyo naondoa koma zote.', 'Koma hutenganisha vitu katika orodha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Salamu ya barua huisha kwa koma.', 'Hatua 2: Naandika "Mpendwa rafiki yangu,".', 'Hatua 3: Kwa hiyo naweka kikomo badala ya koma.', 'Salamu huisha kwa koma.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Nani amefika" ni swali.', 'Hatua 2: Linahitaji kiulizi.', 'Hatua 3: Kwa hiyo naweka kikomo.', 'Naweka kiulizi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Koma ni alama ndogo.', 'Hatua 2: Hutenganisha vitu.', 'Hatua 3: Kwa hiyo koma huisha swali.', 'Kiulizi huisha swali.', 2],
  ], ['a', 'b']),
  ...S('bm', 'KUANDI.T2_BARUA_YA_KIRAFIKI_YA.', 'BARUA_MWALIKO', ['BM_HITIMISHO', 'BM_SALAMU', 'BM_UMUHIMU'], ['Barua ya kirafiki ina anwani, tarehe, salamu, ujumbe na hitimisho.', 'Mwaliko humwita mtu kwenye tukio.'], [
    ['Barua ya kirafiki huanza kwa nini?', 'anwani ya mwandishi na tarehe', 'jina la mwandishi', 'ujumbe wote', 'hitimisho'],
    ['Ni salamu ipi inafaa barua ya kirafiki?', 'Mpendwa rafiki yangu', 'Mkuu wa Shule', 'Kwa Mkurugenzi', 'Bwana Mkuu'],
    ['Mwaliko huandikwa kwa nini?', 'kumwita mtu kwenye tukio', 'kumkaripia mtu', 'kuomba kazi', 'kutoa taarifa ya kifo'],
    ['Barua ya kirafiki huisha kwa nini?', 'hitimisho na jina la mwandishi', 'anwani', 'tarehe', 'salamu'],
    ['Barua ya mwaliko hutaja nini?', 'tukio, tarehe na mahali', 'adhabu', 'deni', 'matokeo ya mtihani'],
  ], [
    ['Juma anamwandikia rafiki kumwalika kwenye sherehe. Ni salamu ipi inafaa?', 'Mpendwa rafiki yangu Amina,', 'Mheshimiwa Mkurugenzi,', 'Kwa Mkuu wa Shule,', 'Bwana Mkubwa,'],
    ['Katika barua ya mwaliko, ni kipi hutangulia ujumbe?', 'salamu', 'jina la mwandishi', 'hitimisho', 'saini'],
    ['Amina anataka rafiki aje kwenye sherehe. Ni barua ipi anaandika?', 'barua ya mwaliko', 'barua ya kuomba kazi', 'barua ya malalamiko', 'barua ya msamaha'],
    ['Ni kipi hakifai katika barua ya kirafiki?', 'lugha ya mtaani yenye matusi', 'salamu ya kirafiki', 'tarehe', 'hitimisho'],
    ['Ni kipi huja mwishoni mwa barua ya mwaliko?', 'jina la mwandishi', 'anwani', 'tarehe', 'salamu'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua ya kirafiki ina vipengele kadhaa.', 'Hatua 2: Huanza kwa anwani na tarehe.', 'Hatua 3: Kwa hiyo huanza kwa jina la mwandishi.', 'Huanza kwa anwani na tarehe.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mwaliko humwita mtu kwenye tukio.', 'Hatua 2: Hutaja mahali na wakati.', 'Hatua 3: Kwa hiyo mwaliko hutumika kumkaripia mtu.', 'Mwaliko humwita mtu kwenye tukio.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua ya kirafiki hutumia salamu ya kirafiki.', 'Hatua 2: Kwa mfano "Mpendwa rafiki yangu".', 'Hatua 3: Kwa hiyo huanza kwa "Mkuu wa Shule".', 'Huanza kwa salamu ya kirafiki.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua huwa na hitimisho.', 'Hatua 2: Hitimisho hufuata ujumbe.', 'Hatua 3: Kwa hiyo hitimisho huja kabla ya salamu.', 'Hitimisho huja baada ya ujumbe.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mwaliko hutaja tukio.', 'Hatua 2: Hutaja tarehe na mahali.', 'Hatua 3: Kwa hiyo hauhitaji kutaja tukio.', 'Hutaja tukio, tarehe na mahali.', 2],
  ], ['a', 'c']),
  ...S('bs', 'KUANDI.T10_BARUA_RASMI_YA_KUOMB.', 'BARUA_MSAMAHA', ['BS_ANWANI', 'BS_KICHWA', 'BS_LUGHA'], ['Barua rasmi ina anwani mbili na kichwa cha barua.', 'Lugha ya barua rasmi ni ya heshima.'], [
    ['Barua rasmi ina anwani ngapi?', 'mbili', 'moja', 'tatu', 'hakuna'],
    ['Barua rasmi huwa na nini kabla ya ujumbe?', 'kichwa cha barua', 'hakuna kitu', 'jina la mwandishi', 'mchoro'],
    ['Lugha ya barua rasmi ni ipi?', 'ya heshima na sanifu', 'ya mtaani', 'ya matusi', 'ya vichekesho'],
    ['Ni salamu ipi inafaa barua rasmi?', 'Mkuu wa Shule', 'Mpendwa rafiki', 'Habari rafiki', 'Mambo vipi'],
    ['Barua rasmi ya kuomba msamaha huandikwa kwa nini?', 'kukiri kosa na kuomba msamaha', 'kualika mtu sherehe', 'kuomba kazi', 'kupongeza mtu'],
  ], [
    ['Juma anaomba msamaha kwa mkuu wa shule. Ni salamu ipi inafaa?', 'Mkuu wa Shule,', 'Mpendwa rafiki,', 'Habari yako rafiki,', 'Mambo vipi mwalimu,'],
    ['Katika barua rasmi, kichwa cha barua hutaja nini?', 'jambo la barua', 'jina la mkuu', 'tarehe tu', 'anwani tu'],
    ['Barua rasmi ya msamaha inapaswa kuwa na lugha gani?', 'ya heshima', 'ya mtaani', 'ya kuchekesha', 'ya hasira'],
    ['Anwani za barua rasmi ni zipi?', 'ya mwandishi na ya mwandikiwa', 'ya mwandishi pekee', 'ya mwandikiwa pekee', 'hakuna'],
    ['Ni hitimisho lipi linafaa barua rasmi?', 'Wako mwaminifu', 'Rafiki yako', 'Wako tu', 'Kwaherini wapendwa'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua rasmi huwa na anwani ya mwandishi.', 'Hatua 2: Huwa pia na anwani ya mwandikiwa.', 'Hatua 3: Kwa hiyo huwa na anwani moja tu.', 'Barua rasmi ina anwani mbili.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua rasmi ina salamu rasmi.', 'Hatua 2: Ina kichwa cha barua.', 'Hatua 3: Kwa hiyo haina kichwa.', 'Ina kichwa cha barua.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua rasmi hutumia lugha sanifu.', 'Hatua 2: Lugha huwa ya heshima.', 'Hatua 3: Kwa hiyo tunatumia lugha ya mtaani.', 'Tunatumia lugha ya heshima na sanifu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua ya msamaha hukiri kosa.', 'Hatua 2: Huomba msamaha.', 'Hatua 3: Kwa hiyo hualika mtu kwenye sherehe.', 'Barua ya msamaha huomba msamaha.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Barua rasmi huisha kwa hitimisho rasmi.', 'Hatua 2: Mfano ni "Wako mwaminifu".', 'Hatua 3: Kwa hiyo huisha kwa "Rafiki yako".', 'Huisha kwa "Wako mwaminifu".', 2],
  ], ['a', 'c']),
  ...S('fa', 'KUSIKI.T3_TANZU_ZA_FASIHI.', 'FASIHI_TANZU', ['FT_SIMULIZI', 'FT_ANDISHI', 'FT_TANZU'], ['Fasihi simulizi hupitishwa kwa mdomo.', 'Fasihi andishi huandikwa.'], [
    ['Fasihi simulizi hupitishwa kwa njia gani?', 'kwa mdomo', 'kwa maandishi', 'kwa picha', 'kwa muziki tu'],
    ['Fasihi andishi hupitishwa kwa njia gani?', 'kwa maandishi', 'kwa mdomo', 'kwa kuimba', 'kwa kucheza'],
    ['Ni tanzu ipi ya fasihi simulizi?', 'methali', 'riwaya', 'tamthilia', 'barua'],
    ['Ni tanzu ipi ya fasihi andishi?', 'riwaya', 'methali', 'kitendawili', 'hadithi ya mdomo'],
    ['Fasihi ni nini?', 'sanaa inayotumia lugha', 'sanaa ya uchoraji', 'kazi ya ufundi', 'mchezo wa kuigiza tu'],
  ], [
    ['Bibi anawasimulia wajukuu hadithi usiku. Ni fasihi ya aina gani?', 'simulizi', 'andishi', 'ya picha', 'ya muziki'],
    ['Mwanafunzi anasoma riwaya ya kuandikwa. Ni fasihi ya aina gani?', 'andishi', 'simulizi', 'ya mdomo', 'ya kuigiza'],
    ['Mzee anatega kitendawili kwa watoto. Ni tanzu ipi?', 'kitendawili', 'riwaya', 'tamthilia', 'barua'],
    ['Ni tanzu ipi ya fasihi andishi?', 'tamthilia', 'methali', 'kitendawili', 'hadithi ya mdomo'],
    ['Watu wanaimba wimbo wa kijadi. Ni fasihi ya aina gani?', 'simulizi', 'andishi', 'ya uchoraji', 'ya ujenzi'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Fasihi simulizi husimuliwa.', 'Hatua 2: Hupitishwa kwa mdomo.', 'Hatua 3: Kwa hiyo huandikwa tu.', 'Fasihi simulizi hupitishwa kwa mdomo.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Fasihi andishi huandikwa.', 'Hatua 2: Mfano ni riwaya.', 'Hatua 3: Kwa hiyo hupitishwa kwa mdomo tu.', 'Fasihi andishi huandikwa.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Methali ni fupi.', 'Hatua 2: Hutolewa kwa mdomo.', 'Hatua 3: Kwa hiyo ni tanzu ya fasihi andishi.', 'Methali ni tanzu ya fasihi simulizi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Riwaya huandikwa.', 'Hatua 2: Husomwa kitabuni.', 'Hatua 3: Kwa hiyo ni tanzu ya fasihi simulizi.', 'Riwaya ni ya fasihi andishi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Fasihi hutumia lugha kwa sanaa.', 'Hatua 2: Huwa na tanzu.', 'Hatua 3: Kwa hiyo barua rasmi ni tanzu ya fasihi simulizi.', 'Methali ni tanzu ya fasihi simulizi, si barua rasmi.', 2],
  ], ['a', 'c']),
  ...S('uf', 'KUSOMA.T7_UFUPISHO.', 'UFUPISHO', ['UF_NAKALA', 'UF_MAANA', 'UF_HABARI_KUU'], ['Ufupisho hutoa habari kuu bila kupoteza maana.', 'Habari kuu ni wazo kuu la aya.'], [
    ['Ufupisho ni nini?', 'kutoa habari kuu kwa ufupi', 'kunakili habari yote', 'kuongeza habari mpya', 'kubadilisha maana'],
    ['Ufupisho unapaswa kuwa vipi?', 'uhifadhi maana ya habari', 'upoteze maana ya habari', 'uongeze maoni yako', 'uwe mrefu kuliko kifungu'],
    ['Habari kuu ya aya ni ipi?', 'wazo kuu la aya nzima', 'mfano mdogo mmoja', 'neno la kwanza', 'neno la mwisho'],
    ['Ufupisho huandikwa kwa maneno gani?', 'yako mwenyewe kwa ufupi', 'kila neno la kifungu', 'maneno ya mwalimu', 'maneno ya kigeni'],
    ['Ni kipi hakifai katika ufupisho?', 'mifano yote ya kina', 'habari kuu', 'sentensi fupi', 'maana ya kifungu'],
  ], [
    ['Aya inaeleza faida za maji kwa mwili. Habari kuu ni ipi?', 'maji yana faida kwa mwili', 'mtu mmoja anakunywa maji', 'maji hupatikana mtoni', 'maji yana rangi'],
    ['Mwanafunzi anakunakili kifungu chote. Je, huo ni ufupisho?', 'Hapana, ufupisho hutoa habari kuu tu', 'Ndiyo, ni ufupisho mzuri', 'Ndiyo, kwa kuwa ni sahihi', 'Ndiyo, kwa kuwa ni mrefu'],
    ['Ufupisho mzuri hufanya nini?', 'huhifadhi maana ya kifungu', 'hupoteza maana ya kifungu', 'huongeza habari mpya', 'huondoa kila wazo'],
    ['Aya ya pili inaeleza jinsi mkulima anavyolima. Habari kuu ni ipi?', 'jinsi mkulima anavyolima', 'jina la mkulima', 'rangi ya shamba', 'bei ya mbegu'],
    ['Ni sentensi ipi ni ufupisho wa aya kuhusu mvua?', 'Mvua ni muhimu kwa kilimo.', 'Mvua ilinyesha jana usiku.', 'Mvua ina matone.', 'Mvua huja na radi.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ufupisho hutoa habari kuu.', 'Hatua 2: Ni mfupi kuliko kifungu.', 'Hatua 3: Kwa hiyo ni kunakili kifungu chote.', 'Ufupisho hautoi kila neno la kifungu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ufupisho unahifadhi maana.', 'Hatua 2: Habari kuu hubaki.', 'Hatua 3: Kwa hiyo maana inaweza kubadilishwa.', 'Maana haibadilishwi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Habari kuu ni wazo kuu la aya.', 'Hatua 2: Mifano midogo hubaki kando.', 'Hatua 3: Kwa hiyo habari kuu ni mfano mdogo.', 'Habari kuu ni wazo kuu.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ufupisho huandikwa kwa maneno mafupi.', 'Hatua 2: Hubaki na maana ile ile.', 'Hatua 3: Kwa hiyo huongeza maoni ya mwandishi.', 'Haongezi maoni mapya.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ufupisho unahitaji kusoma kifungu.', 'Hatua 2: Kisha kuchagua habari kuu.', 'Hatua 3: Kwa hiyo hauhitaji kusoma kifungu.', 'Unahitaji kusoma kifungu kwanza.', 2],
  ], ['a', 'b']),
];
