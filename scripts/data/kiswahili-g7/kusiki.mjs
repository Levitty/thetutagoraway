// Kiswahili Grade 7, Kusikiliza na Kuzungumza: depth layer (18 Nov 2026, offline).
import { m, p, s, x, E, H, ENG } from '../kiswahili-depth-lib.mjs';
import { matamshi } from '../kiswahili-kinds.mjs';
import { simulizi, oral } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const K6 = (k) => `G6:KUSIKI.${k}`;
const FT = 'KUSIKI.T3_TANZU_ZA_FASIHI.FASIHI_TANZU';
const NY = (tag, aspect, sub, letters, w, pre) => simulizi({ G: 7, sub, tag, id: { maana: 'NYIMBO', wahusika: 'WAHUSIKA_NYIMBO', lugha: 'LUGHA_NYIMBO' }[aspect], genre: 'nyimbo', aspect, letters, pre, theme: w.theme, w });
export const NEW = [
  oral({ G: 7, sub: 'KUSIKI.T1_KUSIKILIZA_NA_KUJIBU', tag: 'T1', id: 'MAZUNGUMZO', type: 'mazungumzo', letters: ['a', 'b', 'c'], theme: 'usafi wa kibinafsi (personal hygiene)', topic: 'usafi wa kibinafsi',
    pre: [[K6('T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA'), E, 'Grade 6 chose language to fit the setting.'], [K6('T11_KUJIELEZA_KWA_UFASAH.KUJIELEZA'), H, 'Grade 6 spoke in front of others with gestures.']] }),
  matamshi({ G: 7, sub: 'KUSIKI.T2_KUSIKILIZA_KWA_KINA', tag: 'T2', sounds: ['dh', 'th'], letters: ['a', 'b', 'c'], theme: 'lishe bora (healthy eating)',
    w: [['dhamini', 'thamini', 'to sponsor or guarantee', 'to value'], ['dhibiti', 'thibiti', 'to control', 'to prove']],
    tw: 'Dhahabu ya thamani ya Dhahiri ilithibitishwa na dhamana ya thelathini.', notw: 'Mboga na matunda hujenga mwili.',
    cause: 'Many Kenyan speakers say z for dh (zahabu) and s for th (sumuni) because their first languages lack these Arabic-origin sounds; the child then cannot tell dh from th either.',
    pre: [[K6('T1_MATAMSHI_BORA.MATAMSHI'), E, 'Grade 6 told close sounds apart.'], ['G5:KUSIKI.T1_MATAMSHI_BORA_SAUTI_.MATAMSHI', E, 'Grade 5 met th/dh first, with f/v, s/z and l/r.']] }),
  matamshi({ G: 7, sub: 'KUSIKI.T9_KUSIKILIZA_KWA_KINA', tag: 'T9', sounds: ['d', 'nd'], letters: ['a', 'b'], theme: 'vifaa vya kidijitali (digital devices)', nd: true,
    w: [['doa', 'ndoa', 'a stain', 'a marriage'], ['dege', 'ndege', 'a small bird (or a game)', 'a bird or an aeroplane']],
    tw: 'Ndege wa Dadi alidondoka ndani ya ndoo ya dada.', notw: 'Simu yangu mpya ina kamera nzuri.',
    pre: [['KUSIKI.T2_KUSIKILIZA_KWA_KINA.MATAMSHI', E, 'Theme 2 practised close sounds this year.'], [K6('T1_MATAMSHI_BORA.MATAMSHI'), E, 'Grade 6 d/nd with other nasal pairs.']] }),
  NY('T4', 'maana', 'KUSIKI.T4_NYIMBO', ['a', 'b', 'c', 'd'], { theme: 'aina za maliasili', aina: ['bembelezi', 'wimbo wa watoto'], mfano: 'Lala mtoto lala, mama yuaja, lala', tukio: 'mama anapombembeleza mtoto alale', ujumbe: 'mtoto atulie na alale kwa amani.', mhusika: 'mtoto', sifa: 'mpendwa', ushahidi: 'mama anamwimbia kwa upole', mbinu: ['lala, lala', 'takriri', 'kurudia hutuliza na kuleta mapigo ya wimbo'], fomula: ['Lala, lala', 'kuitikia kwa sauti ya chini'] },
    [[FT, E, 'Knowing the kinds of literature (fasihi simulizi) comes first.'], [K6('T6_MATAMSHI_BORA.SHAIRI_USAWA'), H, 'Grade 6 recited and sang a poem with its beat.']]),
  NY('T10', 'maana', 'KUSIKI.T10_NYIMBO', ['a', 'b', 'c', 'd'], { theme: 'kujithamini', aina: ['wimbo wa kazi', 'wimbo wa dini'], mfano: 'Tupige jembe pamoja, shamba letu litastawi', tukio: 'watu wanapolima au kufanya kazi pamoja', ujumbe: 'kazi ya pamoja huwa nyepesi na huleta mafanikio.', mhusika: 'wakulima', sifa: 'wenye bidii', ushahidi: 'wanalima pamoja wakiimba', mbinu: ['tupige jembe, tupige jembe', 'takriri', 'kurudia huwapa wafanyakazi mapigo ya pamoja'], fomula: ['kiongozi huimba', 'wengine huitikia'] },
    [['KUSIKI.T4_NYIMBO.NYIMBO', E, 'Theme 4 met lullabies and children\'s songs.'], [FT, E, 'The kinds of literature.']]),
  NY('T13', 'wahusika', 'KUSIKI.T13_WAHUSIKA_KATIKA_NYIM', ['a', 'b', 'c'], { theme: 'utatuzi wa mizozo', aina: ['wimbo wa kazi', 'wimbo wa watoto'], mfano: 'Sungura mjanja aliwapatanisha Tembo na Kiboko', tukio: 'jioni watoto wanapocheza', ujumbe: 'tutatue mizozo kwa mazungumzo.', mhusika: 'Sungura', sifa: 'mpatanishi', ushahidi: 'aliwaita Tembo na Kiboko wazungumze', mbinu: ['Tembo na Kiboko', 'wahusika wanyama', 'huwakilisha watu wanaogombana'], fomula: ['kiongozi', 'kiitikio'] },
    [['KUSIKI.T10_NYIMBO.NYIMBO', E, 'The kinds of songs come before their characters.'], ['G6:KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO', H, 'Grade 6 found characters and their traits in a play.']]),
  NY('T14', 'lugha', 'KUSIKI.T14_LUGHA_KATIKA_NYIMBO', ['a', 'b'], { theme: 'matumizi ya pesa', aina: ['wimbo wa kazi', 'wimbo wa watoto'], mfano: 'Senti senti hujaza kibubu, tuweke akiba', tukio: 'watoto wanapojifunza kuweka akiba', ujumbe: 'tuweke akiba kidogo kidogo.', mhusika: 'mtoto', sifa: 'mwangalifu', ushahidi: 'anaweka senti kibubuni', mbinu: ['senti senti hujaza kibubu', 'takriri na methali', 'husisitiza kuweka akiba kidogo kidogo'], fomula: ['kiongozi', 'kiitikio'] },
    [['KUSIKI.T13_WAHUSIKA_KATIKA_NYIM.WAHUSIKA_NYIMBO', E, 'The characters of songs were analysed in Theme 13.'], [K6('T10_SITIARI_ZA_TABIA.SITIARI'), E, 'Grade 6 sitiari: a device of language.']]),
  oral({ G: 7, sub: 'KUSIKI.T8_KUZUNGUMZA_ILI_KUPAS', tag: 'T8', id: 'KUPASHA_HABARI', type: 'kupasha', letters: ['a', 'b', 'c', 'd'], theme: 'ulaguzi wa binadamu (human trafficking)', topic: 'tahadhari kuhusu ulaguzi wa binadamu',
    pre: [['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MAZUNGUMZO', E, 'Listening and replying come before informing others.'], [K6('T9_MAZUNGUMZO_YA_KIMUKT.MUKTADHA'), E, 'Formal language for formal settings.']] }),
  oral({ G: 7, sub: 'KUSIKI.T11_KUZUNGUMZA_KWA_KUAMB', tag: 'T11', id: 'ISHARA', type: 'ishara', letters: ['a', 'b', 'c', 'd'], theme: 'majukumu ya watoto (children\'s duties)', topic: 'majukumu ya watoto nyumbani',
    pre: [['KUSIKI.T8_KUZUNGUMZA_ILI_KUPAS.KUPASHA_HABARI', E, 'Speaking to inform comes before adding gestures.'], [K6('T11_KUJIELEZA_KWA_UFASAH.KUJIELEZA'), E, 'Grade 6 told a story with gestures.']] }),
  s('KUSIKI.T5_MAZUNGUMZO_MAHUSUSI', 'MAAMKUZI_JAMII', 'Tumia maamkuzi na maagano ya nyakati na makundi mbalimbali ya kijamii', ['a', 'b', 'c', 'd'],
    'Greets and takes leave to fit the time of day (alfajiri, asubuhi, mchana, jioni, usiku) and the group (elders, age-mates, religious groups with Bwana asifiwe or Salaam aleikum, the bereaved), and gives the right reply, in 8 of 10 new items.',
    ['chagua salamu ifaayo', 'chagua jibu la salamu', 'tambua kosa', 'igiza (mwalimu anasikiliza)'], ['application'], {
      pre: [[K6('T2_MAAMKUZI_NA_MAAGANO.MAAMKUZI'), E, 'Grade 6 greetings for one and many and for the time.'], [K6('T4_HESHIMA_ADABU_NA_VYE.HESHIMA'), E, 'Grade 6 titles and respect.']],
      mis: [
        m('M7_MJM_RELIGIOUS_REPLY', 'Answers a religious greeting with the reply of another (Salaam aleikum - Amina; Bwana asifiwe - Aleikum salaam).', ['Mtu akikusalimu "Asalaam aleikum", unajibu?', 'Amina', 'Waaleikum salaam'], 'The replies are learnt as a list without the greeting each belongs to.', 'Pair cards: greeting with its reply; practise in pairs.', '"Asalaam aleikum" hujibiwa "Waaleikum salaam".', 'Salamu hii hujibiwa kwa maneno gani?'),
        m('M7_MJM_TIME', 'Uses the greeting of another part of the day (Habari za asubuhi at 7 p.m.; Usiku mwema on arrival).', ['Ni saa moja usiku unamtembelea jirani. Unasalimu vipi?', 'Habari za asubuhi', 'Habari za jioni (au za usiku)'], 'The child uses the greeting he uses at school in the morning.', 'Clock face game: greeting cards placed by time.', 'Salamu hufuata wakati: jioni ni "Habari za jioni".', 'Sasa ni wakati gani?'),
        m('M7_MJM_BEREAVED', 'Greets the bereaved with a cheerful greeting (Habari njema?) instead of words of sympathy (Pole kwa msiba).', ['Unamtembelea rafiki aliyefiwa na babu. Unaanza kwa?', 'Habari njema rafiki?', 'Pole sana kwa msiba.'], 'Habari is the default greeting.', 'Role-play a condolence visit.', 'Aliyefiwa hupewa pole: "Pole kwa msiba."', 'Rafiki yako yuko katika hali gani?'),
        m('M7_MJM_AGEMATE', 'Uses Shikamoo to an age-mate, or Mambo/Vipi to an elder.', ['Unamsalimu mwanafunzi mwenzako wa darasa la saba. Ni salamu ipi inafaa?', 'Shikamoo', 'Hujambo? / Habari yako?'], 'The child knows Shikamoo is respectful and uses it everywhere, or the reverse.', 'Sort people by age and role; match each to a greeting.', 'Shikamoo ni kwa mkubwa; mwenzako husalimiwa "Hujambo".', 'Mtu huyu ni mkubwa kwako au rika lako?'),
      ],
      pack: p('The child names the time, the group and the state of the person, then chooses the greeting or farewell and its reply.', ['Greets for the time of day.', 'Asubuhi tunasema?', 'Habari za asubuhi'], ['a clock face', 'greeting-reply pair cards (religious, elders, bereaved)', 'role play cards'], ['What time is it?', 'Which group or state?', 'Choose the greeting.', 'Give or expect the right reply.'], ['gender-based violence: comforting a friend', 'a mosque or church visit', 'a funeral'], ['Bwana asifiwe! - ___', ['Point at the church card.', 'Jibu lake ni lipi?'], 'The child acts three greetings with their replies.'], [['Jibu la "Bwana asifiwe" ni?', 'Amina / Milele na milele', 'religious reply'], ['Unaagaje usiku?', 'Usiku mwema / Lala salama', 'farewell']]),
    }),
];
export const ADD = [
  x(FT, { also: ['d'],
    pre: [['G6:KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO', H, 'A play is one genre the child already knows.'], [K6('T6_MATAMSHI_BORA.SHAIRI_USAWA'), H, 'A poem recited in Grade 6 is fasihi too.']],
    mis: [m('M7_FT_TANZU_VIPERA', 'Mixes tanzu (genres: hadithi, ushairi, semi, mazungumzo) with vipera (their kinds: hurafa, methali, vitendawili).', ['Methali ni utanzu au kipera?', 'utanzu', 'kipera cha utanzu wa semi'], 'Both are lists of kinds of literature.', 'Draw a tree: fasihi simulizi -> tanzu -> vipera; place each word.', 'Methali ni kipera cha semi.', 'Methali iko chini ya utanzu gani?')],
    pack: p('The child explains fasihi, tells simulizi (by mouth, no known author) from andishi (written, known author), names the tanzu and places a piece he presents.', ['Knows a riddle and a methali.', 'Kitendawili! - ?', 'Tega!'], ['a tree diagram of fasihi', 'genre cards', 'a short piece to present'], ['Ask: spoken or written?', 'Known author or community?', 'Name the utanzu and kipera.', 'Present one piece.'], ['animal freedom (uhuru wa wanyama)', 'a cultural festival', 'the class library'], ['fasihi simulizi / fasihi andishi', ['Point at the tree.', 'Hadithi ya Sungura iko upande gani?'], 'The child places five pieces on the tree and presents one.'], [['Fasihi simulizi hupokezwa vipi?', 'kwa mdomo', 'oral'], ['Novela ni ya fasihi ipi?', 'fasihi andishi', 'written']]),
  }),
  readAdd({ G: 7, ref: 'KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_MASUALA', kind: 'ls_masuala', also: ['b', 'd'], topic: 'usalama shuleni',
    pre: [['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MAZUNGUMZO', E, 'Listening features of Theme 1.'], ['G6:KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', H, 'Finding issues in a read passage.']] }),
  readAdd({ G: 7, ref: 'KUSIKI.T7_KUSIKILIZA_KWA_UFAHA.LS_UJUMBE', kind: 'ls_ujumbe', also: ['c'], topic: 'kuhudumia jamii shuleni',
    pre: [['KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_MASUALA', E, 'Theme 6 listened for issues.'], ['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MAZUNGUMZO', H, 'Listening features.']] }),
  readAdd({ G: 7, ref: 'KUSIKI.T12_KUSIKILIZA_KWA_MAKIN.LS_HOJA', kind: 'ls_hoja', also: ['b'], topic: 'magonjwa ambukizi',
    pre: [['KUSIKI.T7_KUSIKILIZA_KWA_UFAHA.LS_UJUMBE', E, 'Listening for the message came first.'], ['KUSIKI.T8_KUZUNGUMZA_ILI_KUPAS.KUPASHA_HABARI', H, 'Presenting points to others.']] }),
  readAdd({ G: 7, ref: 'KUSIKI.T15_KUSIKILIZA_HABARI_NA.LS_HABARI', kind: 'ls_habari', also: ['c'], topic: 'maadili ya mtu binafsi',
    pre: [['KUSIKI.T12_KUSIKILIZA_KWA_MAKIN.LS_HOJA', E, 'Main points of what is heard.'], ['KUSOMA.T1_KUSOMA_KWA_UFAHAMU.RS_UTABIRI', E, 'Predicting from clues in a read text.']] }),
];
