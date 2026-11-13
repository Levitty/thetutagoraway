// ============================================================================
// KISWAHILI GRADE 4, KUSIKILIZA NA KUZUNGUMZA: maamkuzi na maagano, vitendawili, maneno ya upole, methali za malezi,
// msamiati wa shairi la taifa, nahau za maadili na uraia, visawe, mazungumzo yasiyo rasmi, tashbihi za kimo na umbo.
// DRAFT families, all off for children. Written offline by Claude (13 Nov 2026), no model call.
// A question can test only the recognition and the meaning here. Saying, reciting, riddling and speaking in turn are for a teacher
// (speaking check): see docs/qa/kiswahili-g4-routes-2026-11-13.md. A native Kiswahili speaker must check every item, above all
// the methali, the nahau (the design's own list could not be read) and the riddles: docs/qa/kiswahili-g4-native-check-2026-11-13.md.
// ============================================================================
import { trio, duo, one } from './kiswahili_g4_lib.js';

const H = (a, b) => [a, b];
// W(pre, text, right, 'wrong:CODE ...', because): the code is M4_<pre>_<CODE>; an underscore inside a wrong text is a space
const W = (pre, text, right, ws, because) => [text, right, ...ws.split(' ').map(w => { const [t, c] = w.split(':'); return [t.replace(/_/g, ' '), `M4_${pre}_${c}`]; }), because];

// ---------------------------------------------------------------- maamkuzi na maagano
const MAA = [
  W('MAA', 'Mtu akikusalimia "Hujambo?", unajibu "___."', 'Sijambo', 'Hujambo:REPLY Marahaba:REPLY Kwaheri:REPLY', 'Hujambo hujibiwa kwa "Sijambo".'),
  W('MAA', 'Unamsalimia babu yako kwa kusema "___."', 'Shikamoo', 'Hujambo:ELDER Kwaheri:ELDER Sijambo:REPLY', 'Mdogo humsalimia mkubwa kwa "Shikamoo".'),
  W('MAA', 'Babu akijibu salamu ya mjukuu husema "___."', 'Marahaba', 'Shikamoo:REPLY Sijambo:REPLY Kwaheri:REPLY', 'Mkubwa hujibu "Shikamoo" kwa "Marahaba".'),
  W('MAA', 'Kabla ya kulala usiku unamwambia mama, "___."', 'Usiku mwema', 'Habari_za_asubuhi:TIME Habari_za_mchana:TIME Marahaba:REPLY', '"Usiku mwema" husemwa usiku kabla ya kulala.'),
  W('MAA', 'Asubuhi unamwona mwalimu na kusema "Habari za ___."', 'asubuhi', 'usiku:TIME jioni:TIME mchana:TIME', 'Asubuhi tunasema "Habari za asubuhi".'),
  W('MAA', 'Unaondoka kwa rafiki yako nyumbani kwao. Unasema "___."', 'Kwaheri', 'Karibu:REPLY Hujambo:REPLY Habari_za_asubuhi:TIME', '"Kwaheri" ni agano la kuaga.'),
  W('MAA', 'Mgeni anapofika nyumbani kwenu, mwenyeji husema "___."', 'Karibu', 'Kwaheri:REPLY Marahaba:REPLY Sijambo:REPLY', '"Karibu" ni neno la kumkaribisha mgeni.'),
  W('MAA', 'Rafiki akikuuliza "Habari yako?", unajibu "___."', 'Nzuri', 'Shikamoo:ELDER Kwaheri:REPLY Marahaba:REPLY', '"Habari yako?" hujibiwa kwa "Nzuri".'),
];

// ---------------------------------------------------------------- vitendawili
const VIT_FORMULA = [
  W('VIT', 'Mtegaji husema "Kitendawili!" Mtegua hujibu "___!"', 'Tega', 'Karibu:FORMULA Asante:FORMULA Pole:FORMULA', 'Mtegaji husema "Kitendawili!" na mtegua hujibu "Tega!".'),
  W('VIT', 'Mtu anaposhindwa kutegua kitendawili husema "Nipe ___."', 'mji', 'nyumba:FORMULA shamba:FORMULA chai:FORMULA', 'Anayeshindwa kutegua husema "Nipe mji."'),
  W('VIT', 'Mtegaji akitaka kuanza kutega husema "___!"', 'Kitendawili', 'Tega:FORMULA Pole:FORMULA Hodi:FORMULA', 'Mtegaji huanza kwa kusema "Kitendawili!".'),
  W('VIT', 'Anayetega kitendawili huitwa ___.', 'mtegaji', 'mtegua:FORMULA msimulizi:FORMULA mwalimu:FORMULA', 'Anayetega huitwa mtegaji.'),
  W('VIT', 'Anayetegua kitendawili huitwa ___.', 'mtegua', 'mtegaji:FORMULA msikilizaji:FORMULA mshairi:FORMULA', 'Anayetegua huitwa mtegua.'),
];
const VIT_ID = [
  W('VIT', 'Ni kitendawili kipi?', 'Popote niendapo hunifuata', 'Mtoto_umleavyo_ndivyo_akuavyo:METHALI kupiga_moyo_konde:NAHAU Kuna_mti_mkubwa_uwanjani:PLAIN', 'Kitendawili huficha jibu (hapa ni kivuli). Methali hutoa funzo na nahau ni maneno yenye maana maalum.'),
  W('VIT', 'Ni kitendawili kipi?', 'Nyumba yangu haina mlango', 'Samaki_mkunje_angali_mbichi:METHALI kukata_tamaa:NAHAU Nyumba_yetu_ina_milango_miwili:PLAIN', 'Kitendawili huficha jibu (hapa ni yai). Methali hutoa funzo na nahau ni maneno yenye maana maalum.'),
  W('VIT', 'Ni kitendawili kipi?', 'Kila nikienda hunifuata, nikisimama husimama', 'Heshima_si_utumwa:METHALI kula_kiapo:NAHAU Mimi_na_rafiki_yangu_tunasimama_darasani:PLAIN', 'Kitendawili huficha jibu (hapa ni kivuli). Hakitaji kitu moja kwa moja.'),
  W('VIT', 'Ni kitendawili kipi?', 'Nina mgongo lakini sina miguu', 'Asiyefunzwa_na_mamaye_hufunzwa_na_ulimwengu:METHALI kujikaza_kisabuni:NAHAU Kitabu_kiko_mezani:PLAIN', 'Kitendawili huficha jibu (hapa ni kitabu). Sentensi ya kawaida inataja kitu wazi.'),
  W('VIT', 'Ni kitendawili kipi?', 'Ninakwenda bila miguu, ninaimba bila mdomo', 'Mwana_wa_nyoka_ni_nyoka:METHALI kuvunja_moyo:NAHAU Upepo_unavuma_leo:PLAIN', 'Kitendawili huficha jibu (hapa ni upepo). Sentensi ya kawaida inataja kitu wazi.'),
];

// ---------------------------------------------------------------- maneno ya upole
const UPO = [
  W('UPO', 'Unataka kuomba kalamu kwa mwenzako. Utasema "___, nipe kalamu."', 'Tafadhali', 'Haraka:RUDE Sasa:RUDE Wewe:RUDE', '"Tafadhali" ni neno la upole tunapoomba kitu.'),
  W('UPO', 'Mtu amekupa zawadi. Utasema "___."', 'Asante', 'Tafadhali:SWAP Pole:SWAP Samahani:SWAP', '"Asante" husemwa tunapopewa kitu.'),
  W('UPO', 'Umemgonga mwenzako kwa bahati mbaya. Utasema "___."', 'Samahani', 'Asante:SWAP Karibu:SWAP Kwaheri:SWAP', '"Samahani" husemwa tunapokosea.'),
  W('UPO', 'Mwenzako ameumia. Utasema "___."', 'Pole', 'Asante:SWAP Hongera:SWAP Karibu:SWAP', '"Pole" husemwa kwa aliyeumia au mwenye huzuni.'),
  W('UPO', 'Unamwomba mwalimu ruhusa: "Mwalimu, ___ niende chooni."', 'naomba', 'nataka:RUDE lazima:RUDE sasa:RUDE', '"Naomba" ni neno la upole la kuomba ruhusa.'),
  W('UPO', 'Unaomba maji kwa mama: "Mama, ___ maji."', 'naomba', 'nipe:RUDE leta:RUDE lete:RUDE', '"Naomba" ni neno la upole la kuomba kitu.'),
  W('UPO', 'Unakataa ofa kwa upole kwa kusema "Hapana, ___."', 'asante', 'tafadhali:SWAP pole:SWAP haraka:RUDE', '"Hapana, asante" ni njia ya upole ya kukataa.'),
];
const UPO_SENT = [
  W('UPO', '', 'Tafadhali, naomba maji.', 'Nipe_maji!:RUDE Leta_maji_sasa!:RUDE', 'Tunapoomba tunatumia "tafadhali" na "naomba", si amri.'),
  W('UPO', '', 'Samahani, nimechelewa.', 'Nimechelewa,_basi!:RUDE Sijali_nimechelewa.:RUDE', '"Samahani" ni neno la upole tunapokosea.'),
  W('UPO', '', 'Asante kwa msaada wako.', 'Msaada_wako_si_kitu.:RUDE Sikuomba_msaada.:RUDE', '"Asante" ni neno la upole tunaposaidiwa.'),
  W('UPO', '', 'Tafadhali, naomba kitabu chako.', 'Nipe_kitabu_changu!:RUDE Toa_kitabu!:RUDE', 'Tunapoomba tunatumia "tafadhali" na "naomba".'),
  W('UPO', '', 'Pole kwa kuumia, rafiki yangu.', 'Sijali_umeumia.:RUDE Acha_kulia!:RUDE', '"Pole" ni neno la upole kwa aliyeumia.'),
  W('UPO', '', 'Naomba kuingia, mwalimu.', 'Niruhusu_niingie!:RUDE Nifungulie_mlango!:RUDE', '"Naomba" ni neno la upole la kuomba ruhusa.'),
];
const UPO_ID = [
  W('UPO', 'Ni sentensi ipi ina neno la upole?', 'Tafadhali, ingia.', 'Nimekuja.:NOT Mlango_uko_wapi?:NOT Kaa_chini.:NOT', '"Tafadhali" ni neno la upole.'),
  W('UPO', 'Ni sentensi ipi ina neno la upole?', 'Samahani, nimechelewa.', 'Nimechelewa_leo.:NOT Darasa_limeanza.:NOT Ingia_haraka.:NOT', '"Samahani" ni neno la upole.'),
  W('UPO', 'Ni sentensi ipi ina neno la upole?', 'Asante sana, mwalimu.', 'Mwalimu_ameingia.:NOT Kitabu_changu_kiko_wapi?:NOT Toka_hapa.:NOT', '"Asante" ni neno la upole.'),
  W('UPO', 'Ni sentensi ipi ina neno la upole?', 'Naomba maji, mama.', 'Mama_yuko_jikoni.:NOT Maji_ni_baridi.:NOT Leta_maji.:NOT', '"Naomba" ni neno la upole.'),
  W('UPO', 'Ni sentensi ipi ina neno la upole?', 'Pole sana, rafiki.', 'Rafiki_amekuja.:NOT Sikia_hapa.:NOT Uwanja_ni_mkubwa.:NOT', '"Pole" ni neno la upole.'),
];

// ---------------------------------------------------------------- methali za malezi
const MET_MEAN = [
  W('MET', 'Methali "Samaki mkunje angali mbichi" ina maana gani?', 'Mtoto afundishwe angali mdogo', 'Samaki_hukunjwa_akiwa_mbichi:LITERAL Tabia_ya_mtoto_hutokana_na_malezi_yake:OTHER Heshima_haimaanishi_kuwa_mtumwa:OTHER', 'Samaki mbichi hukunjika kwa urahisi; mtoto mdogo hufundishika kwa urahisi.'),
  W('MET', 'Methali "Mtoto umleavyo ndivyo akuavyo" ina maana gani?', 'Tabia ya mtoto hutokana na malezi yake', 'Mtoto_hukua_kwa_kunywa_maziwa_tu:LITERAL Mtoto_afundishwe_angali_mdogo:OTHER Mtoto_asiyefunzwa_nyumbani_hujifunza_ulimwenguni:OTHER', 'Mtoto hukua kama alivyolelewa: malezi mazuri huleta tabia nzuri.'),
  W('MET', 'Methali "Asiyefunzwa na mamaye hufunzwa na ulimwengu" ina maana gani?', 'Mtoto asiyefunzwa nyumbani hujifunza kwa shida ulimwenguni', 'Mama_hufunza_watoto_wake_kila_siku:LITERAL Tabia_ya_mtoto_hutokana_na_malezi_yake:OTHER Mtoto_afundishwe_angali_mdogo:OTHER', 'Asiyefunzwa nyumbani hujifunza ulimwenguni, mara nyingi kwa shida.'),
  W('MET', 'Methali "Heshima si utumwa" ina maana gani?', 'Kuheshimu watu hakumfanyi mtu kuwa mtumwa', 'Watumwa_hawapaswi_kuheshimiwa:LITERAL Mtoto_afundishwe_angali_mdogo:OTHER Tabia_ya_mtoto_hutokana_na_malezi_yake:OTHER', 'Heshima ni jambo jema; mtu mwenye heshima si mtumwa.'),
  W('MET', 'Methali "Mwana wa nyoka ni nyoka" ina maana gani?', 'Mtoto huiga tabia za wazazi wake', 'Nyoka_huzaa_nyoka_tu:LITERAL Mtoto_afundishwe_angali_mdogo:OTHER Kuheshimu_watu_hakumfanyi_mtu_kuwa_mtumwa:OTHER', 'Watoto mara nyingi hufanana na wazazi wao katika tabia.'),
];
const MET_FILL = [
  W('MET', 'Samaki mkunje ___ mbichi.', 'angali', 'akiwa:WORDS bado:WORDS wakati:WORDS', 'Methali kamili ni "Samaki mkunje angali mbichi".'),
  W('MET', 'Mtoto umleavyo ndivyo ___.', 'akuavyo', 'anavyotaka:WORDS anavyoishi:WORDS apendavyo:WORDS', 'Methali kamili ni "Mtoto umleavyo ndivyo akuavyo".'),
  W('MET', 'Asiyefunzwa na mamaye hufunzwa na ___.', 'ulimwengu', 'baba:WORDS mwalimu:WORDS rafiki:WORDS', 'Methali kamili ni "Asiyefunzwa na mamaye hufunzwa na ulimwengu".'),
  W('MET', 'Heshima si ___.', 'utumwa', 'utajiri:WORDS adabu:WORDS kazi:WORDS', 'Methali kamili ni "Heshima si utumwa".'),
  W('MET', 'Mwana wa nyoka ni ___.', 'nyoka', 'mtoto:WORDS binadamu:WORDS mnyama:WORDS', 'Methali kamili ni "Mwana wa nyoka ni nyoka".'),
];
const MET_ID = [
  W('MET', 'Ni methali ipi?', 'Samaki mkunje angali mbichi', 'Samaki_wanaishi_majini:NOT Mvuvi_alikwenda_ziwani:NOT Jiko_liko_nje:NOT', 'Methali ni maneno machache yanayotoa funzo la maisha.'),
  W('MET', 'Ni methali ipi?', 'Mtoto umleavyo ndivyo akuavyo', 'Mtoto_anacheza_uwanjani:NOT Mama_amempeleka_shuleni:NOT Watoto_wengi_wamefika:NOT', 'Methali ni maneno machache yanayotoa funzo la maisha.'),
  W('MET', 'Ni methali ipi?', 'Asiyefunzwa na mamaye hufunzwa na ulimwengu', 'Mama_yangu_ni_mwalimu:NOT Ulimwengu_ni_mkubwa:NOT Mama_anapika_jikoni:NOT', 'Methali ni maneno machache yanayotoa funzo la maisha.'),
  W('MET', 'Ni methali ipi?', 'Heshima si utumwa', 'Utumwa_ulikomeshwa_zamani:NOT Heshima_ilikuwepo_jana:NOT Mtumwa_alikuwa_shambani:NOT', 'Methali ni maneno machache yanayotoa funzo la maisha.'),
  W('MET', 'Ni methali ipi?', 'Mwana wa nyoka ni nyoka', 'Nyoka_ameingia_shambani:NOT Mwana_wa_mfalme_amefika:NOT Nyoka_ni_mnyama_hatari:NOT', 'Methali ni maneno machache yanayotoa funzo la maisha.'),
];

// ---------------------------------------------------------------- msamiati wa shairi la taifa
const SMS = [
  W('SMS', 'Kitambaa chenye rangi kinachopeperushwa kuonyesha nchi huitwa ___.', 'bendera', 'benki:LOOKALIKE wimbo:NEARBY mpaka:NEARBY', 'Bendera ni kitambaa chenye rangi kinachoonyesha nchi.'),
  W('SMS', 'Nchi na watu wake kwa pamoja huitwa ___.', 'taifa', 'nafaka:LOOKALIKE mji:NEARBY kabila:NEARBY', 'Taifa ni nchi na watu wake.'),
  W('SMS', 'Hali ya kuwa huru bila kutawaliwa na wengine huitwa ___.', 'uhuru', 'utumwa:OPPOSITE uhuni:LOOKALIKE utajiri:NEARBY', 'Uhuru ni hali ya kuwa huru.'),
  W('SMS', 'Mtu jasiri aliyefanya kazi kubwa kwa ajili ya nchi huitwa ___.', 'shujaa', 'mwoga:OPPOSITE mgeni:NEARBY shuhuda:LOOKALIKE', 'Shujaa ni mtu jasiri aliyefanya kazi kubwa kwa ajili ya wengine.'),
  W('SMS', 'Hali ya watu kushirikiana na kuwa pamoja huitwa ___.', 'mshikamano', 'ugomvi:OPPOSITE mshahara:LOOKALIKE mshindi:NEARBY', 'Mshikamano ni watu kushirikiana na kuwa pamoja.'),
  W('SMS', 'Hali ya utulivu bila vita huitwa ___.', 'amani', 'vita:OPPOSITE amali:LOOKALIKE kelele:NEARBY', 'Amani ni hali ya utulivu bila vita.'),
];
const SMS_MEAN = [
  W('SMS', 'Neno "taifa" lina maana gani?', 'nchi na watu wake', 'nafaka_ya_shambani:LOOKALIKE bendera_ya_nchi:NEARBY mji_mkubwa:NEARBY', 'Taifa ni nchi na watu wake.'),
  W('SMS', 'Neno "bendera" lina maana gani?', 'kitambaa chenye rangi kinachoonyesha nchi', 'benki_ya_pesa:LOOKALIKE wimbo_wa_nchi:NEARBY mpaka_wa_nchi:NEARBY', 'Bendera ni kitambaa chenye rangi kinachoonyesha nchi.'),
  W('SMS', 'Neno "uhuru" lina maana gani?', 'hali ya kuwa huru', 'hali_ya_kuwa_mtumwa:OPPOSITE tabia_mbaya:LOOKALIKE hali_ya_kuwa_tajiri:NEARBY', 'Uhuru ni hali ya kuwa huru bila kutawaliwa na wengine.'),
  W('SMS', 'Neno "shujaa" lina maana gani?', 'mtu jasiri aliyefanya kazi kubwa', 'mtu_mwoga:OPPOSITE shahidi_mahakamani:LOOKALIKE mgeni_wa_nchi:NEARBY', 'Shujaa ni mtu jasiri aliyefanya kazi kubwa kwa ajili ya wengine.'),
  W('SMS', 'Neno "mshikamano" lina maana gani?', 'watu kushirikiana na kuwa pamoja', 'watu_kugombana:OPPOSITE mshahara_wa_mwezi:LOOKALIKE mshindi_wa_mbio:NEARBY', 'Mshikamano ni watu kushirikiana na kuwa pamoja.'),
  W('SMS', 'Neno "amani" lina maana gani?', 'utulivu bila vita', 'vita_na_ugomvi:OPPOSITE amali_njema:LOOKALIKE sauti_kubwa:NEARBY', 'Amani ni hali ya utulivu bila vita.'),
];

// ---------------------------------------------------------------- nahau za maadili na uraia
const NAH_MEAN = [
  W('NAH', 'Nahau "kupiga moyo konde" ina maana gani?', 'kuwa jasiri na kuvumilia', 'kupiga_moyo_kwa_fimbo:LITERAL kuapa_kusema_ukweli:OTHER kuacha_kujaribu:OTHER', 'Kupiga moyo konde ni kuwa jasiri na kuvumilia hali ngumu.'),
  W('NAH', 'Nahau "kujikaza kisabuni" ina maana gani?', 'kuvumilia shida bila kulalamika', 'kujikaza_kwa_sabuni:LITERAL kuapa_kusema_ukweli:OTHER kuiba:OTHER', 'Kujikaza kisabuni ni kuvumilia shida bila kulalamika.'),
  W('NAH', 'Nahau "kula kiapo" ina maana gani?', 'kuapa kusema ukweli au kutimiza ahadi', 'kula_chakula_cha_kiapo:LITERAL kuvumilia_shida:OTHER kuacha_kujaribu:OTHER', 'Kula kiapo ni kuapa kusema ukweli au kutimiza ahadi.'),
  W('NAH', 'Nahau "kukata tamaa" ina maana gani?', 'kuacha kujaribu kwa kukosa matumaini', 'kukata_kitu_kwa_tamaa:LITERAL kuwa_jasiri:OTHER kuapa_kusema_ukweli:OTHER', 'Kukata tamaa ni kuacha kujaribu kwa kukosa matumaini.'),
  W('NAH', 'Nahau "kuwa na mkono mrefu" ina maana gani?', 'kuwa mwizi', 'kuwa_na_mkono_wenye_urefu_mkubwa:LITERAL kuvumilia_shida:OTHER kuapa_kusema_ukweli:OTHER', 'Kuwa na mkono mrefu ni kuwa mwizi.'),
  W('NAH', 'Nahau "kuvunja moyo" ina maana gani?', 'kumkatisha mtu tamaa na kumhuzunisha', 'kuvunja_kitu_kilicho_moyoni:LITERAL kuwa_jasiri:OTHER kuiba:OTHER', 'Kuvunja moyo ni kumkatisha mtu tamaa na kumhuzunisha.'),
];
const NAH_FILL = [
  W('NAH', 'Alipopata shida nyingi, alipiga moyo ___ akaendelea kusoma.', 'konde', 'kubwa:WORDS mkali:WORDS mzito:WORDS', 'Nahau kamili ni "kupiga moyo konde".'),
  W('NAH', 'Mgonjwa alijikaza ___ ili asilalamike.', 'kisabuni', 'kimya:WORDS kitandani:WORDS kisiri:WORDS', 'Nahau kamili ni "kujikaza kisabuni".'),
  W('NAH', 'Shahidi alikula ___ mahakamani kusema ukweli.', 'kiapo', 'chakula:WORDS kiasi:WORDS kiunga:WORDS', 'Nahau kamili ni "kula kiapo".'),
  W('NAH', 'Baada ya kushindwa mara tatu, hakutaka ___ tamaa.', 'kukata', 'kuweka:WORDS kupata:WORDS kununua:WORDS', 'Nahau kamili ni "kukata tamaa".'),
  W('NAH', 'Mwizi huyo ana mkono ___, huiba vitu vya watu.', 'mrefu', 'mfupi:WORDS mkubwa:WORDS mzito:WORDS', 'Nahau kamili ni "kuwa na mkono mrefu".'),
];
const NAH_ID = [
  W('NAH', 'Ni nahau ipi?', 'kukata tamaa', 'Haba_na_haba_hujaza_kibaba:NOT Mama_amepika_chakula:NOT Heshima_si_utumwa:NOT', 'Nahau ni kifungu kifupi chenye maana maalum, si sentensi nzima yenye funzo.'),
  W('NAH', 'Ni nahau ipi?', 'kula kiapo', 'Mtoto_umleavyo_ndivyo_akuavyo:NOT Shule_iko_karibu:NOT Samaki_mkunje_angali_mbichi:NOT', 'Nahau ni kifungu kifupi chenye maana maalum, si sentensi nzima yenye funzo.'),
  W('NAH', 'Ni nahau ipi?', 'kupiga moyo konde', 'Mwana_wa_nyoka_ni_nyoka:NOT Baba_amerudi_nyumbani:NOT Heshima_si_utumwa:NOT', 'Nahau ni kifungu kifupi chenye maana maalum, si sentensi nzima yenye funzo.'),
  W('NAH', 'Ni nahau ipi?', 'kujikaza kisabuni', 'Asiyefunzwa_na_mamaye_hufunzwa_na_ulimwengu:NOT Sabuni_imeisha:NOT Mvua_inanyesha:NOT', 'Nahau ni kifungu kifupi chenye maana maalum, si sentensi nzima yenye funzo.'),
  W('NAH', 'Ni nahau ipi?', 'kuvunja moyo', 'Samaki_mkunje_angali_mbichi:NOT Kikombe_kimevunjika:NOT Mtoto_analia:NOT', 'Nahau ni kifungu kifupi chenye maana maalum, si sentensi nzima yenye funzo.'),
];

// ---------------------------------------------------------------- visawe
const VIS = [
  W('VIS', 'Kisawe cha "haraka" ni ___.', 'upesi', 'harufu:LOOKALIKE polepole:OPPOSITE safari:RELATED', 'Haraka na upesi zina maana sawa.'),
  W('VIS', 'Kisawe cha "furaha" ni ___.', 'raha|shangwe', 'huzuni:OPPOSITE furushi:LOOKALIKE kicheko:RELATED', 'Furaha, raha na shangwe zina maana sawa.'),
  W('VIS', 'Kisawe cha "shida" ni ___.', 'taabu|tabu|dhiki', 'raha:OPPOSITE shindano:LOOKALIKE kazi:RELATED', 'Shida, taabu na dhiki zina maana sawa.'),
  W('VIS', 'Kisawe cha "tajiri" ni ___.', 'mkwasi', 'maskini:OPPOSITE mfanyabiashara:RELATED mkulima:RELATED', 'Tajiri na mkwasi wana maana sawa.'),
  W('VIS', 'Kisawe cha "rafiki" ni ___.', 'swahiba|sahibu', 'adui:OPPOSITE ndugu:RELATED jirani:RELATED', 'Rafiki, swahiba na sahibu wana maana sawa.'),
  W('VIS', 'Kisawe cha "kimya" ni ___.', 'tulivu', 'kelele:OPPOSITE kimbia:LOOKALIKE sauti:RELATED', 'Kimya na tulivu zina maana sawa.'),
  W('VIS', 'Kisawe cha "njia" ni ___.', 'barabara', 'mlango:RELATED njaa:LOOKALIKE kizuizi:OPPOSITE', 'Njia na barabara zina maana sawa.'),
];
const VIS_ID = [
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'haraka na upesi', 'haraka_na_polepole:OPPOSITE daktari_na_hospitali:RELATED haraka_na_harufu:LOOKALIKE', 'Haraka na upesi zina maana sawa.'),
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'furaha na raha', 'furaha_na_huzuni:OPPOSITE mama_na_dada:RELATED furaha_na_furushi:LOOKALIKE', 'Furaha na raha zina maana sawa.'),
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'shida na taabu', 'shida_na_raha:OPPOSITE kalamu_na_kitabu:RELATED shida_na_shindano:LOOKALIKE', 'Shida na taabu zina maana sawa.'),
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'tajiri na mkwasi', 'tajiri_na_maskini:OPPOSITE mkulima_na_shamba:RELATED tajiri_na_tangazo:LOOKALIKE', 'Tajiri na mkwasi wana maana sawa.'),
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'rafiki na swahiba', 'rafiki_na_adui:OPPOSITE baba_na_mama:RELATED rafiki_na_rangi:LOOKALIKE', 'Rafiki na swahiba wana maana sawa.'),
  W('VIS', 'Ni jozi ipi ina maneno yenye maana sawa?', 'kimya na tulivu', 'kimya_na_kelele:OPPOSITE shule_na_darasa:RELATED kimya_na_kiini:LOOKALIKE', 'Kimya na tulivu zina maana sawa.'),
];

// ---------------------------------------------------------------- mazungumzo yasiyo rasmi
const MAZ_SET = [
  W('MAZ', 'Ni mazungumzo yapi si rasmi?', 'mazungumzo na rafiki uwanjani', 'hotuba_ya_mwalimu_mkuu_kwenye_gwaride:FORMAL mahojiano_ya_kazi_ofisini:FORMAL mkutano_wa_wazazi_na_walimu:FORMAL', 'Mazungumzo na rafiki uwanjani si rasmi. Hotuba, mahojiano na mikutano ni rasmi.'),
  W('MAZ', 'Ni mazungumzo yapi si rasmi?', 'mazungumzo ya kaka na dada nyumbani', 'mahojiano_ya_mwandishi_na_waziri:FORMAL mkutano_wa_bunge:FORMAL hotuba_ya_mgeni_rasmi_shuleni:FORMAL', 'Mazungumzo ya ndugu nyumbani si rasmi.'),
  W('MAZ', 'Ni mazungumzo yapi si rasmi?', 'kupiga soga na marafiki wakati wa mapumziko', 'mjadala_wa_bunge:FORMAL mahojiano_ya_kazi:FORMAL hotuba_ya_siku_ya_shule:FORMAL', 'Kupiga soga na marafiki si rasmi.'),
  W('MAZ', 'Ni mazungumzo yapi si rasmi?', 'mazungumzo na binamu yako wakati wa kucheza', 'mkutano_rasmi_wa_kamati_ya_shule:FORMAL hotuba_ya_waziri:FORMAL mahojiano_ya_redio:FORMAL', 'Mazungumzo ya binamu wakicheza si rasmi.'),
  W('MAZ', 'Ni mazungumzo yapi si rasmi?', 'mazungumzo na jirani nyumbani kwao', 'mkutano_wa_chama:FORMAL mahojiano_ya_televisheni:FORMAL hotuba_ya_gavana:FORMAL', 'Mazungumzo ya majirani nyumbani si rasmi.'),
];
const MAZ_WORDS = [
  W('MAZ', 'Unamsalimia rafiki yako uwanjani. Utasema nini?', 'Mambo vipi?', 'Mabibi_na_mabwana,_hamjambo?:REGISTER Mheshimiwa,_nakusalimu_kwa_heshima.:REGISTER Hamjambo_wageni_waalikwa?:REGISTER', 'Kwa rafiki tunatumia lugha ya kawaida. Maneno mengine ni ya hotuba.'),
  W('MAZ', 'Unamwomba kaka yako akupe kalamu. Utasema nini?', 'Kaka, nipe kalamu tafadhali.', 'Mheshimiwa_kaka,_naomba_kuwasilisha_ombi_langu.:REGISTER Waheshimiwa,_nawasilisha_ombi.:REGISTER Ninakuomba_rasmi_uniruhusu.:REGISTER', 'Kwa kaka tunatumia lugha ya kawaida. Maneno mengine ni rasmi.'),
  W('MAZ', 'Unamwambia rafiki kuwa mnaelekea nyumbani. Utasema nini?', 'Twende nyumbani sasa.', 'Tunaomba_kuahirisha_kikao.:REGISTER Kikao_kimeisha,_waheshimiwa.:REGISTER Ninawasilisha_hoja_ya_kuondoka.:REGISTER', 'Kwa rafiki tunatumia lugha ya kawaida. Maneno mengine ni ya mkutano.'),
  W('MAZ', 'Unamtania mwenzako uwanjani. Utasema nini?', 'Wewe ni mjanja kweli!', 'Naomba_kutoa_maoni_rasmi.:REGISTER Hii_ni_hotuba_yangu_rasmi.:REGISTER Mheshimiwa,_nikuombe_radhi.:REGISTER', 'Kutaniana ni kwa lugha ya kawaida. Maneno mengine ni rasmi.'),
  W('MAZ', 'Unamwambia dada yako ulivyofurahia mchezo. Utasema nini?', 'Mchezo ulikuwa mtamu sana!', 'Napenda_kuwashukuru_wote_waliohudhuria.:REGISTER Kwa_niaba_ya_kamati,_nawashukuru.:REGISTER Mgeni_rasmi,_karibu.:REGISTER', 'Kwa dada tunatumia lugha ya kawaida. Maneno mengine ni ya hotuba.'),
];

// ---------------------------------------------------------------- tashbihi za kimo na umbo
const TASH = [
  W('TASH', 'Mtu mrefu sana ni mrefu kama ___.', 'twiga|mnazi', 'sungura:WRONG_ANIMAL kiboko:WRONG_ANIMAL chungu:WRONG_ANIMAL', 'Tunasema mrefu kama twiga au kama mnazi.'),
  W('TASH', 'Mtu mnene sana ni mnene kama ___.', 'kiboko|pipa', 'twiga:WRONG_ANIMAL sungura:WRONG_ANIMAL sindano:WRONG_ANIMAL', 'Tunasema mnene kama kiboko.'),
  W('TASH', 'Mtu mwembamba sana ni mwembamba kama ___.', 'sindano', 'kiboko:WRONG_ANIMAL ndovu:WRONG_ANIMAL mlima:WRONG_ANIMAL', 'Tunasema mwembamba kama sindano.'),
  W('TASH', 'Mtu mfupi sana ni mfupi kama ___.', 'kibete', 'twiga:WRONG_ANIMAL mnazi:WRONG_ANIMAL ndovu:WRONG_ANIMAL', 'Tunasema mfupi kama kibete.'),
  W('TASH', 'Kitu kikubwa sana ni kikubwa kama ___.', 'ndovu', 'sisimizi:WRONG_ANIMAL sindano:WRONG_ANIMAL chungu:WRONG_ANIMAL', 'Tunasema mkubwa kama ndovu.'),
  W('TASH', 'Kitu kidogo sana ni kidogo kama ___.', 'sisimizi', 'ndovu:WRONG_ANIMAL mlima:WRONG_ANIMAL kiboko:WRONG_ANIMAL', 'Tunasema mdogo kama sisimizi.'),
];
const TASH_MEAN = [
  W('TASH', '"Baba ni mrefu kama twiga" maana yake nini?', 'Baba ni mrefu sana', 'Baba_ni_twiga:LITERAL Baba_ni_mnyama:LITERAL Baba_anapenda_twiga:LITERAL', 'Tashbihi inaelezea kwa kulinganisha: baba ni mrefu sana.'),
  W('TASH', '"Juma ni mnene kama kiboko" maana yake nini?', 'Juma ni mnene sana', 'Juma_ni_kiboko:LITERAL Juma_anaishi_mtoni:LITERAL Juma_anapenda_kiboko:LITERAL', 'Tashbihi inaelezea kwa kulinganisha: Juma ni mnene sana.'),
  W('TASH', '"Atieno ni mwembamba kama sindano" maana yake nini?', 'Atieno ni mwembamba sana', 'Atieno_ni_sindano:LITERAL Atieno_anashona_nguo:LITERAL Atieno_ana_sindano:LITERAL', 'Tashbihi inaelezea kwa kulinganisha: Atieno ni mwembamba sana.'),
  W('TASH', '"Mwalimu wetu ni mfupi kama kibete" maana yake nini?', 'Mwalimu wetu ni mfupi sana', 'Mwalimu_wetu_ni_kibete:LITERAL Mwalimu_wetu_anaishi_na_kibete:LITERAL Mwalimu_wetu_ni_mrefu:LITERAL', 'Tashbihi inaelezea kwa kulinganisha: mwalimu ni mfupi sana.'),
  W('TASH', '"Mdudu yule ni mdogo kama sisimizi" maana yake nini?', 'Mdudu yule ni mdogo sana', 'Mdudu_yule_ni_sisimizi:LITERAL Mdudu_yule_anakaa_na_sisimizi:LITERAL Mdudu_yule_ni_mkubwa:LITERAL', 'Tashbihi inaelezea kwa kulinganisha: mdudu ni mdogo sana.'),
];
const TASH_ID = [
  W('TASH', 'Ni tashbihi ipi?', 'mrefu kama twiga', 'Yeye_ni_twiga:NO_KAMA Yeye_ni_mrefu_sana:NO_KAMA Twiga_ni_mnyama:NO_KAMA', 'Tashbihi hutumia "kama": mrefu kama twiga. "Yeye ni twiga" ni sitiari.'),
  W('TASH', 'Ni tashbihi ipi?', 'mnene kama kiboko', 'Yeye_ni_kiboko:NO_KAMA Yeye_ni_mnene_sana:NO_KAMA Kiboko_anaishi_mtoni:NO_KAMA', 'Tashbihi hutumia "kama": mnene kama kiboko.'),
  W('TASH', 'Ni tashbihi ipi?', 'mwembamba kama sindano', 'Yeye_ni_sindano:NO_KAMA Yeye_ni_mwembamba_sana:NO_KAMA Sindano_ni_kali:NO_KAMA', 'Tashbihi hutumia "kama": mwembamba kama sindano.'),
  W('TASH', 'Ni tashbihi ipi?', 'mkubwa kama ndovu', 'Yeye_ni_ndovu:NO_KAMA Yeye_ni_mkubwa_sana:NO_KAMA Ndovu_ni_mnyama_mkubwa:NO_KAMA', 'Tashbihi hutumia "kama": mkubwa kama ndovu.'),
  W('TASH', 'Ni tashbihi ipi?', 'mdogo kama sisimizi', 'Yeye_ni_sisimizi:NO_KAMA Yeye_ni_mdogo_sana:NO_KAMA Sisimizi_hupanda_mti:NO_KAMA', 'Tashbihi hutumia "kama": mdogo kama sisimizi.'),
];

export const FAMILIES = [
  // ---- MAAMKUZI NA MAAGANO
  ...trio('maamkuzi', 'KUSIKI.T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI', MAA, { stem: 'Chagua salamu au agano linalofaa.', gapStem: 'Andika salamu au agano:', oc: ['a', 'b', 'b'], topic: 'kuhusu maamkuzi na maagano', hints: H('Fikiria nani anasalimiwa na ni wakati gani.', 'Salamu na jibu lake ni maneno tofauti.') }),
  // ---- VITENDAWILI
  ...trio('vitendawili.maneno', 'KUSIKI.T3_VITENDAWILI.VITENDAWILI', VIT_FORMULA, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'a', 'a'], tag: 'maneno', topic: 'kuhusu vitendawili', hints: H('Fikiria jinsi watu wanavyocheza mchezo wa kutega.', 'Anayetega na anayetegua wana maneno yao.') }),
  ...one('vitendawili.tambua', 'KUSIKI.T3_VITENDAWILI.VITENDAWILI', VIT_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', rung: 1, hints: H('Kitendawili huficha jibu na humtaka mtu kukitegua.', 'Methali hutoa funzo na nahau ina maana maalum.') }),
  // ---- MANENO YA UPOLE
  ...trio('upole', 'KUSIKI.T4_MANENO_YA_UPOLE.UPOLE', UPO, { stem: 'Chagua neno la upole linalofaa.', gapStem: 'Andika neno la upole:', oc: ['a', 'b', 'b'], topic: 'kuhusu maneno ya upole', hints: H('Fikiria ulichofanya au unachotaka kusema kwa upole.', 'Amri bila neno la upole si upole.') }),
  ...duo('upole.sentensi', 'KUSIKI.T4_MANENO_YA_UPOLE.UPOLE', UPO_SENT, { stem: 'Chagua sentensi yenye upole.', oc: ['b', 'b'], tag: 'sentensi', topic: 'kuhusu maneno ya upole', hints: H('Fikiria ungependa kuombwa kwa maneno gani.', 'Amri hukosa neno la upole.') }),
  ...one('upole.tambua', 'KUSIKI.T4_MANENO_YA_UPOLE.UPOLE', UPO_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', rung: 1, hints: H('Tafuta neno kama tafadhali, samahani, asante, pole au naomba.', 'Sentensi ya kawaida haina neno la upole.') }),
  // ---- METHALI
  ...one('methali.maana', 'KUSIKI.T5_METHALI.METHALI', MET_MEAN, { stem: 'Chagua maana sahihi.', oc: 'b', tag: 'maana', rung: 2, hints: H('Methali hutoa funzo, si maneno yake tu.', 'Soma kila maana na uone ni ipi inalingana na methali yote.') }),
  ...trio('methali.kamilisha', 'KUSIKI.T5_METHALI.METHALI', MET_FILL, { stem: 'Chagua neno linalokamilisha methali.', gapStem: 'Andika neno linalokosekana kwenye methali:', oc: ['b', 'b', 'a'], tag: 'kamilisha', topic: 'kuhusu methali', hints: H('Sema methali yote kwa sauti kuanzia mwanzo.', 'Maneno ya methali hayabadilishwi.') }),
  ...one('methali.tambua', 'KUSIKI.T5_METHALI.METHALI', MET_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', rung: 1, hints: H('Methali hutoa funzo la maisha kwa maneno machache.', 'Sentensi ya kawaida inasema jambo tu.') }),
  // ---- MSAMIATI WA SHAIRI
  ...trio('shairi.msamiati', 'KUSIKI.T6_SHAIRI.SHAIRI_MSAMIATI', SMS, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['c', 'c', 'c'], topic: 'kuhusu msamiati wa shairi', hints: H('Soma maelezo ya neno kwa makini.', 'Neno linalofanana na jingine kwa sauti si lazima liwe na maana sawa.') }),
  ...one('shairi.msamiati.maana', 'KUSIKI.T6_SHAIRI.SHAIRI_MSAMIATI', SMS_MEAN, { stem: 'Chagua maana sahihi.', oc: 'b', tag: 'maana', rung: 2, hints: H('Fikiria neno hilo linapotumika katika shairi la nchi.', 'Jaribu kila maana mahali pa neno.') }),
  // ---- NAHAU
  ...one('nahau.maana', 'KUSIKI.T7_NAHAU.NAHAU', NAH_MEAN, { stem: 'Chagua maana sahihi.', oc: 'b', tag: 'maana', rung: 2, hints: H('Maana ya nahau si maana ya maneno yake moja moja.', 'Fikiria hali ambayo watu hutumia nahau hiyo.') }),
  ...trio('nahau.kamilisha', 'KUSIKI.T7_NAHAU.NAHAU', NAH_FILL, { stem: 'Chagua neno linalokamilisha nahau.', gapStem: 'Andika neno linalokosekana kwenye nahau:', oc: ['a', 'a', 'a'], tag: 'kamilisha', topic: 'kuhusu nahau', hints: H('Sema nahau yote kwa sauti kuanzia mwanzo.', 'Maneno ya nahau hayabadilishwi.') }),
  ...one('nahau.tambua', 'KUSIKI.T7_NAHAU.NAHAU', NAH_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', rung: 1, hints: H('Nahau ni kifungu kifupi chenye maana maalum.', 'Methali ni sentensi nzima yenye funzo.') }),
  // ---- VISAWE
  ...trio('visawe', 'KUSIKI.T8_VISAWE.VISAWE', VIS, { stem: 'Chagua kisawe sahihi.', gapStem: 'Andika kisawe:', oc: ['b', 'b', 'b'], topic: 'kuhusu visawe', hints: H('Kisawe ni neno lenye maana sawa na lingine.', 'Neno la kinyume au linalofanana kwa herufi si kisawe.') }),
  ...duo('visawe.jozi', 'KUSIKI.T8_VISAWE.VISAWE', VIS_ID, { stem: 'Chagua jozi yenye maana sawa.', oc: ['a', 'a'], tag: 'jozi', topic: 'kuhusu visawe', hints: H('Jozi ya visawe ina maneno yenye maana sawa.', 'Maneno ya kinyume au yanayohusiana tu si visawe.') }),
  // ---- MAZUNGUMZO YASIYO RASMI
  ...one('mazungumzo.mazingira', 'KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MAZUNGUMZO', MAZ_SET, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'mazingira', rung: 1, hints: H('Fikiria nani anazungumza na nani, na wapi.', 'Hotuba na mahojiano ni rasmi.') }),
  ...one('mazungumzo.maneno', 'KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.MAZUNGUMZO', MAZ_WORDS, { stem: 'Chagua maneno yanayofaa.', oc: 'b', tag: 'maneno', rung: 2, hints: H('Fikiria ungemwambia nani maneno hayo.', 'Lugha ya hotuba haifai kwa rafiki.') }),
  // ---- TASHBIHI
  ...trio('tashbihi', 'KUSIKI.T10_TASHBIHI.TASHBIHI', TASH, { stem: 'Chagua neno linalokamilisha tashbihi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'c', 'c'], topic: 'kuhusu tashbihi', hints: H('Fikiria mnyama au kitu ambacho watu husema kina kimo au umbo hilo.', 'Tashbihi hutumia ulinganisho wa kawaida.') }),
  ...one('tashbihi.maana', 'KUSIKI.T10_TASHBIHI.TASHBIHI', TASH_MEAN, { stem: 'Chagua maana sahihi.', oc: 'a', tag: 'maana', rung: 2, hints: H('Tashbihi hulinganisha ili kuelezea mtu au kitu.', 'Mtu hawezi kuwa mnyama kweli: ni ulinganisho.') }),
  ...one('tashbihi.tambua', 'KUSIKI.T10_TASHBIHI.TASHBIHI', TASH_ID, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', rung: 1, hints: H('Tashbihi ina neno "kama".', 'Bila neno "kama" si tashbihi.') }),
];
