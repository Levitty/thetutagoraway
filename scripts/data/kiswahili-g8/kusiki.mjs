// Kiswahili Grade 8, Kusikiliza na Kuzungumza: depth layer (18 Nov 2026, offline).
import { E, H } from '../kiswahili-depth-lib.mjs';
import { matamshi } from '../kiswahili-kinds.mjs';
import { simulizi, oral } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const K7 = (k) => `G7:KUSIKI.${k}`;
const FT7 = [K7('T3_TANZU_ZA_FASIHI.FASIHI_TANZU'), E, 'Grade 7 tanzu and vipera of fasihi.'];
const HD = (tag, aspect, sub, letters, id, w, pre) => simulizi({ G: 8, sub, tag, id, genre: 'hadithi', aspect, letters, pre, theme: w.theme, w });
const FOM = ['Paukwa!', 'Pakawa!'];
export const NEW = [
  oral({ G: 8, sub: 'KUSIKI.T1_KUSIKILIZA_NA_KUJIBU', tag: 'T1', id: 'MAHOJIANO', type: 'mahojiano', letters: ['a', 'b', 'c'], theme: 'usafi wa sehemu za umma', topic: 'usafi wa soko la mji',
    pre: [[K7('T1_KUSIKILIZA_NA_KUJIBU.MAZUNGUMZO'), E, 'Grade 7 listened and replied in conversation.'], [K7('T8_KUZUNGUMZA_ILI_KUPAS.KUPASHA_HABARI'), H, 'Grade 7 asked for and gave information.']] }),
  matamshi({ G: 8, sub: 'KUSIKI.T2_KUSIKILIZA_KWA_KINA', tag: 'T2', sounds: ['gh', 'g'], letters: ['a', 'b', 'c'], theme: 'matumizi yafaayo ya dawa',
    w: [['ghali', 'gali', 'expensive', 'not a Kiswahili word (a spelling error)'], ['lugha', 'luga', 'a language', 'not a Kiswahili word (a spelling error)']],
    tw: 'Ghafla Ghalib aligharimika gharama ghali ya dawa ya ghala.', notw: 'Meza dawa kwa kufuata maagizo ya daktari.',
    cause: '/gh/ is made further back in the throat than /g/ and comes into Kiswahili from Arabic; most Kenyan first languages have no /gh/, so the child says and writes g.',
    pre: [[K7('T2_KUSIKILIZA_KWA_KINA.MATAMSHI'), E, 'Grade 7 dh/th: another Arabic-origin sound.'], [K7('T9_KUSIKILIZA_KWA_KINA.MATAMSHI'), E, 'Grade 7 d/nd.']] }),
  matamshi({ G: 8, sub: 'KUSIKI.T9_KUSIKILIZA_KWA_KINA', tag: 'T9', sounds: ['ch', 'sh'], letters: ['a', 'b', 'c'], theme: 'majukumu ya mnunuzi',
    w: [['chaka', 'shaka', 'a thicket', 'doubt'], ['chali', 'shali', 'lying on one\'s back', 'a shawl']],
    tw: 'Shaban alishangaa chai ya Shani ilichemka chini ya shamba la Chacha.', notw: 'Mnunuzi aangalie tarehe ya mwisho wa matumizi.',
    cause: 'Several Kenyan first languages (Dholuo among them) have no /sh/ and say s or ch, so the child hears ch and sh as one sound.',
    pre: [['KUSIKI.T2_KUSIKILIZA_KWA_KINA.MATAMSHI', E, 'Theme 2 g/gh this year.'], ['G6:KUSIKI.T1_MATAMSHI_BORA.MATAMSHI', E, 'Grade 6 ch/sh with other pairs.']] }),
  HD('T3', 'maana', 'KUSIKI.T3_HADITHI', ['a', 'b', 'c', 'd'], 'MIGHANI', { theme: 'dhiki zinazokumba wanyama', aina: ['mighani', 'visasili'], mfano: 'Fumo Liyongo, shujaa wa Pate aliyeshindwa tu kwa sindano ya shaba kitovuni', tukio: 'kusimulia historia ya shujaa wa jamii na kumsifu', ujumbe: 'ushujaa na ulinzi wa jamii huheshimiwa.', mhusika: 'Fumo Liyongo', sifa: 'shujaa', ushahidi: 'aliwashinda maadui wengi peke yake', mbinu: ['mwenye nguvu kama ndovu', 'tashbihi', 'inakuza ushujaa wa mhusika'], fomula: FOM },
    [FT7, [K7('T13_WAHUSIKA_KATIKA_NYIM.WAHUSIKA_NYIMBO'), H, 'Grade 7 characters in songs.']]),
  HD('T4', 'uwasilishaji', 'KUSIKI.T4_HADITHI', ['a', 'b', 'c'], 'VISASILI', { theme: 'matumizi bora ya maliasili', aina: ['visasili', 'mighani'], mfano: 'Kwa nini kinyonga hutembea polepole', tukio: 'kueleza chanzo cha jambo au kiumbe katika jamii', ujumbe: 'jamii hueleza asili ya mambo kwa hadithi.', mhusika: 'Kinyonga', sifa: 'mwangalifu', ushahidi: 'hutembea polepole akihofia ardhi', mbinu: ['polepole, polepole', 'takriri', 'inaonyesha mwendo wa kinyonga'], fomula: FOM },
    [['KUSIKI.T3_HADITHI.MIGHANI', E, 'Theme 3 met mighani; visasili are the next kind.'], [K7('T11_KUZUNGUMZA_KWA_KUAMB.ISHARA'), E, 'Grade 7 spoke with gestures.']]),
  HD('T10', 'maana', 'KUSIKI.T10_HADITHI', ['a', 'b', 'c', 'd'], 'HURAFA_HEKAYA', { theme: 'kukabiliana na hisia', aina: ['hurafa', 'hekaya'], mfano: 'Sungura na Fisi waliogawana mavuno', tukio: 'jioni kuburudisha na kufunza watoto', ujumbe: 'ujanja wa kudanganya huleta adhabu; tushirikiane kwa haki.', mhusika: 'Sungura', sifa: 'mjanja', ushahidi: 'alimdanganya Fisi achukue mizizi badala ya mahindi', mbinu: ['Fisi mlafi', 'wahusika wanyama', 'huwakilisha watu walafi'], fomula: FOM },
    [['KUSIKI.T4_HADITHI.VISASILI', E, 'Theme 4 presented visasili.'], FT7]),
  HD('T13', 'wahusika', 'KUSIKI.T13_HADITHI', ['a', 'b', 'c'], 'WAHUSIKA_HADITHI', { theme: 'heshima kwa tamaduni za wengine', aina: ['hurafa', 'ngano'], mfano: 'Mzee Busara na wageni kutoka ng\'ambo', tukio: 'jioni kufunza heshima', ujumbe: 'tuheshimu tamaduni za wengine.', mhusika: 'Mzee Busara', sifa: 'mkarimu', ushahidi: 'aliwakaribisha wageni na kuwapikia chakula chao', mbinu: ['Busara', 'jina la mhusika', 'linaonyesha tabia yake'], fomula: FOM },
    [['KUSIKI.T10_HADITHI.HURAFA_HEKAYA', E, 'Theme 10 hurafa and hekaya.'], [K7('T13_WAHUSIKA_KATIKA_NYIM.WAHUSIKA_NYIMBO'), E, 'Grade 7 analysed characters in songs.']]),
  HD('T14', 'lugha', 'KUSIKI.T14_HADITHI', ['a', 'b', 'c'], 'LUGHA_HADITHI', { theme: 'kuweka akiba', aina: ['hurafa', 'ngano'], mfano: 'Chungu na Panzi: Chungu aliweka akiba, Panzi aliimba tu', tukio: 'kufunza watoto kuweka akiba', ujumbe: 'tuweke akiba wakati wa neema.', mhusika: 'Chungu', sifa: 'mwenye bidii', ushahidi: 'alikusanya chakula wakati wa kiangazi', mbinu: ['Panzi aliimba "tia tia tia"', 'tanakali za sauti', 'huleta uhai na burudani'], fomula: FOM },
    [['KUSIKI.T13_HADITHI.WAHUSIKA_HADITHI', E, 'Characters come before language devices.'], [K7('T14_LUGHA_KATIKA_NYIMBO.LUGHA_NYIMBO'), E, 'Grade 7 language in songs.']]),
  oral({ G: 8, sub: 'KUSIKI.T7_USIKILIZAJI_HUSISHI', tag: 'T7', id: 'USIKILIZAJI_HUSISHI', type: 'husishi', letters: ['a', 'b', 'c'], theme: 'kuhudumia wenye mahitaji maalum', topic: 'kumsaidia mwanafunzi mwenye ulemavu',
    pre: [['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MAHOJIANO', E, 'Theme 1 listened and replied in an interview.'], [K7('T1_KUSIKILIZA_NA_KUJIBU.MAZUNGUMZO'), E, 'Grade 7 listening features.']] }),
  oral({ G: 8, sub: 'KUSIKI.T15_USIKILIZAJI_HUSISHI', tag: 'T15', id: 'USIKILIZAJI_HUSISHI_2', type: 'husishi', letters: ['a', 'b', 'c', 'd'], theme: 'maadili ya kijamii', topic: 'rafiki aliyekosewa na wenzake',
    pre: [['KUSIKI.T7_USIKILIZAJI_HUSISHI.USIKILIZAJI_HUSISHI', E, 'Theme 7 practised active listening.'], ['KUSIKI.T11_KUZUNGUMZA_KWA_KUTUM.VIDOKEZO', H, 'Speaking from notes.']] }),
  oral({ G: 8, sub: 'KUSIKI.T8_UZUNGUMZAJI_WA_PAPO_', tag: 'T8', id: 'PAPO_KWA_HAPO', type: 'papo', letters: ['a', 'b', 'c'], theme: 'uhalifu wa mtandaoni', topic: 'jinsi ya kujikinga na wezi wa mtandaoni',
    pre: [[K7('T8_KUZUNGUMZA_ILI_KUPAS.KUPASHA_HABARI'), E, 'Grade 7 speaking to inform.'], [K7('T11_KUZUNGUMZA_KWA_KUAMB.ISHARA'), H, 'Grade 7 gestures.']] }),
  oral({ G: 8, sub: 'KUSIKI.T11_KUZUNGUMZA_KWA_KUTUM', tag: 'T11', id: 'VIDOKEZO', type: 'vidokezo', letters: ['a', 'b', 'c', 'd'], theme: 'haki za watoto', topic: 'haki ya mtoto kupata elimu',
    pre: [['KUSIKI.T8_UZUNGUMZAJI_WA_PAPO_.PAPO_KWA_HAPO', E, 'Impromptu speaking comes before speaking from notes.'], ['KUANDI.T9_INSHA_ZA_KUBUNI.KUBUNI_AYA', H, 'Building one idea per paragraph is the same planning.']] }),
];
export const ADD = [
  readAdd({ G: 8, ref: 'KUSIKI.T5_KUSIKILIZA_MAAGIZO.LS_MAAGIZO', kind: 'ls_maagizo', also: ['a', 'd'], topic: 'majukumu ya kijinsia',
    pre: [[K7('T7_KUSIKILIZA_KWA_UFAHA.LS_UJUMBE'), E, 'Grade 7 listened for the message.'], ['G7:KUANDI.T5_INSHA_YA_MAELEKEZO.MAELEKEZO', E, 'Grade 7 wrote instructions in order.']] }),
  readAdd({ G: 8, ref: 'KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_UJUMBE', kind: 'ls_ujumbe', topic: 'usalama nyumbani',
    pre: [[K7('T7_KUSIKILIZA_KWA_UFAHA.LS_UJUMBE'), E, 'Grade 7 message of a listening text.'], [K7('T6_KUSIKILIZA_KWA_KUFAS.LS_MASUALA'), E, 'Grade 7 interpreting what is heard.']] }),
  readAdd({ G: 8, ref: 'KUSIKI.T12_KUSIKILIZA_KWA_MAKIN.LS_HABARI', kind: 'ls_habari', topic: 'magonjwa yasiyoambukizwa',
    pre: [[K7('T15_KUSIKILIZA_HABARI_NA.LS_HABARI'), E, 'Grade 7 news, vocabulary and prediction from listening.'], ['KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_UJUMBE', E, 'Theme 6 listening for the message.']] }),
];
