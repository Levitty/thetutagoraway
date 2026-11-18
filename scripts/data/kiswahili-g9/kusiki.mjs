// Kiswahili Grade 9, Kusikiliza na Kuzungumza: depth layer (18 Nov 2026, offline).
import { E, H } from '../kiswahili-depth-lib.mjs';
import { matamshi } from '../kiswahili-kinds.mjs';
import { simulizi, oral } from '../kiswahili-kinds-upper.mjs';
import { readAdd } from '../kiswahili-reading-upper.mjs';
const K8 = (k) => `G8:KUSIKI.${k}`, K7 = (k) => `G7:KUSIKI.${k}`;
const SM = (tag, aspect, sub, letters, id, genre, w, pre) => simulizi({ G: 9, sub, tag, id, genre, aspect, letters, pre, theme: w.theme, w });
export const NEW = [
  oral({ G: 9, sub: 'KUSIKI.T1_KUSIKILIZA_NA_KUJIBU', tag: 'T1', id: 'MJADALA', type: 'mjadala', letters: ['a', 'b', 'c'], theme: 'usafi wa mazingira', topic: 'kupiga marufuku mifuko ya plastiki',
    pre: [[K8('T1_KUSIKILIZA_NA_KUJIBU.MAHOJIANO'), E, 'Grade 8 listening and replying in interviews.'], [K8('T11_KUZUNGUMZA_KWA_KUTUM.VIDOKEZO'), E, 'Grade 8 speaking from points.']] }),
  matamshi({ G: 9, sub: 'KUSIKI.T2_KUSIKILIZA_KWA_KINA', tag: 'T2', sounds: ['b', 'mb'], letters: ['a', 'b', 'c'], theme: 'mazoezi ya viungo vya mwili', nd: true,
    w: [['bali', 'mbali', 'but', 'far'], ['bega', 'mbega', 'a shoulder', 'a colobus monkey']],
    tw: 'Mbega mbele ya mbuzi alibeba mbegu mbili mbichi mbugani.', notw: 'Mazoezi ya asubuhi huimarisha mwili.',
    pre: [[K8('T9_KUSIKILIZA_KWA_KINA.MATAMSHI'), E, 'Grade 8 ch/sh.'], [K7('T9_KUSIKILIZA_KWA_KINA.MATAMSHI'), E, 'Grade 7 d/nd: the same nasal before a sound.']] }),
  matamshi({ G: 9, sub: 'KUSIKI.T9_KUSIKILIZA_KWA_KINA', tag: 'T9', sounds: ['j', 'nj'], letters: ['a', 'b', 'c'], theme: 'vifaa vya kidijitali katika biashara', nd: true,
    w: [['jia', 'njia', 'to come by way of', 'a path or a way'], ['jaa', 'njaa', 'to be full', 'hunger']],
    tw: 'Njoroge alijaa njaa njiani akanunua njugu kwa Juma.', notw: 'Biashara ya mtandaoni inakua kwa kasi.',
    pre: [['KUSIKI.T2_KUSIKILIZA_KWA_KINA.MATAMSHI', E, 'Theme 2 b/mb this year.'], ['G6:KUSIKI.T1_MATAMSHI_BORA.MATAMSHI', E, 'Grade 6 j/nj first met.']] }),
  SM('T3', 'maana', 'KUSIKI.T3_SEMI', ['a', 'b', 'c', 'd'], 'SEMI_TASHBIHI', 'semi', { theme: 'utunzaji wa wanyama', aina: ['tashbihi', 'sitiari'], mfano: 'Mkulima huyu ni simba wa shamba', tukio: 'kusifu au kukosoa tabia katika mazungumzo na hadithi', ujumbe: 'mkulima ana nguvu na ujasiri mkubwa kazini.', mhusika: 'mkulima', sifa: 'hodari', ushahidi: 'analima shamba kubwa peke yake', mbinu: ['mpole kama njiwa', 'tashbihi', 'hulinganisha upole wa mtu na njiwa kwa kutumia kama'], fomula: ['Methali husema...', 'msikilizaji hukamilisha'] },
    [[K7('T3_TANZU_ZA_FASIHI.FASIHI_TANZU'), E, 'Grade 7 semi as an utanzu.'], ['G6:KUSIKI.T10_SITIARI_ZA_TABIA.SITIARI', E, 'Grade 6 sitiari.']]),
  SM('T4', 'uwasilishaji', 'KUSIKI.T4_SEMI', ['a', 'b', 'c', 'd', 'e'], 'SEMI_VITENDAWILI', 'semi', { theme: 'utunzaji wa maliasili', aina: ['vitendawili', 'nahau'], mfano: 'Kamba yangu ndefu lakini haifungi kuni', tukio: 'jioni wakati wa burudani na kunoa akili', ujumbe: 'vitendawili hunoa akili na kufunza mazingira.', mhusika: 'mtegaji', sifa: 'mwerevu', ushahidi: 'anatega vitendawili vigumu', mbinu: ['kuvunja mbavu', 'nahau', 'maana yake ni kuchekesha sana'], fomula: ['Kitendawili!', 'Tega!'] },
    [['KUSIKI.T3_SEMI.SEMI_TASHBIHI', E, 'Theme 3 semi.'], ['G6:KUSIKI.T3_MATAMSHI_BORA.VITENDAWILI', E, 'Grade 6 riddles with the formula.']]),
  SM('T10', 'uwasilishaji', 'KUSIKI.T10_MAZUNGUMZO', ['a', 'b', 'c', 'd'], 'MALUMBANO', 'mazungumzo', { theme: 'kukabiliana na msongo wa mawazo', aina: ['malumbano ya utani', 'mawaidha'], mfano: 'Watani wa jadi wanatania kuhusu chakula cha jamii zao', tukio: 'harusini au sherehe kati ya jamii zenye utani wa jadi', ujumbe: 'utani hupunguza uhasama na kuleta furaha.', mhusika: 'mtani', sifa: 'mcheshi', ushahidi: 'anajibu kila utani kwa ucheshi bila hasira', mbinu: ['Wewe ni mlafi kama fisi!', 'tashbihi ya utani', 'huchekesha bila kuumiza'], fomula: ['Mtani wangu!', 'Naam mtani!'] },
    [['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MJADALA', E, 'Taking turns and replying in a debate.'], [K8('T14_HADITHI.LUGHA_HADITHI'), H, 'Grade 8 language devices in oral literature.']]),
  SM('T13', 'wahusika', 'KUSIKI.T13_MAZUNGUMZO', ['a', 'b', 'c', 'd', 'e', 'f'], 'MAWAIDHA', 'mazungumzo', { theme: 'mshikamano wa kijamii', aina: ['mawaidha', 'malumbano ya utani'], mfano: 'Bibi anawapa wajukuu mawaidha kabla ya kwenda shule ya bweni', tukio: 'wakati wa jando, harusi au mtoto anapoondoka nyumbani', ujumbe: 'tuishi kwa umoja na heshima.', mhusika: 'Bibi (mwawaidhi)', sifa: 'mwenye hekima', ushahidi: 'anatumia methali na mifano kuwaonya wajukuu', mbinu: ['Kidole kimoja hakivunji chawa', 'methali', 'husisitiza umoja'], fomula: ['Sikilizeni wanangu...', 'Tunasikiliza, bibi.'] },
    [['KUSIKI.T10_MAZUNGUMZO.MALUMBANO', E, 'Theme 10 malumbano ya utani.'], [K8('T13_HADITHI.WAHUSIKA_HADITHI'), E, 'Grade 8 characters in oral stories.']]),
  SM('T14', 'lugha', 'KUSIKI.T14_MAZUNGUMZO', ['a', 'b', 'c', 'd'], 'LUGHA_MAWAIDHA', 'mazungumzo', { theme: 'matumizi ya kodi', aina: ['mawaidha', 'malumbano ya utani'], mfano: 'Mzee anawaonya vijana walipe kodi kwa uaminifu', tukio: 'mkutano wa kijiji au baraza', ujumbe: 'tulipe kodi kwa uaminifu ili tujenge nchi.', mhusika: 'Mzee', sifa: 'mzalendo', ushahidi: 'anawahimiza vijana kulipa kodi', mbinu: ['Haba na haba hujaza kibaba', 'methali', 'inahimiza kulipa kodi kidogo kidogo'], fomula: ['Wanangu, sikilizeni...', 'Tunakusikiliza, mzee.'] },
    [['KUSIKI.T13_MAZUNGUMZO.MAWAIDHA', E, 'Theme 13 mawaidha and their participants.'], [K7('T11_KUZUNGUMZA_KWA_KUAMB.ISHARA'), E, 'Grade 7 gestures with speech.']]),
  oral({ G: 9, sub: 'KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ', tag: 'T5', id: 'UFAHAMU_KUSIKILIZA', type: 'ufahamu', letters: ['a', 'b', 'c', 'd'], theme: 'mitazamo hasi ya kijinsia', topic: 'kazi za nyumbani kwa wavulana na wasichana',
    pre: [[K8('T12_KUSIKILIZA_KWA_MAKIN.LS_HABARI'), E, 'Grade 8 listening for news and vocabulary.'], [K8('T15_USIKILIZAJI_HUSISHI.USIKILIZAJI_HUSISHI_2'), H, 'Grade 8 active listening.']] }),
  oral({ G: 9, sub: 'KUSIKI.T8_UZUNGUMZAJI_WA_KUSHA', tag: 'T8', id: 'KUSHAWISHI', type: 'kushawishi', letters: ['a', 'b', 'c', 'd'], theme: 'misukosuko ya kijamii', topic: 'kujiunga na klabu ya amani shuleni',
    pre: [['KUSIKI.T1_KUSIKILIZA_NA_KUJIBU.MJADALA', E, 'Theme 1 gave reasons in a debate.'], [K8('T8_UZUNGUMZAJI_WA_PAPO_.PAPO_KWA_HAPO'), H, 'Grade 8 impromptu speaking.']] }),
  oral({ G: 9, sub: 'KUSIKI.T11_UZUNGUMZAJI_KATIKA_S', tag: 'T11', id: 'SHEREHE', type: 'sherehe', letters: ['a', 'b', 'c', 'd', 'e'], theme: 'haki za kibinadamu', topic: 'sherehe ya kuhitimu darasa la tisa',
    pre: [['KUSIKI.T8_UZUNGUMZAJI_WA_KUSHA.KUSHAWISHI', E, 'Theme 8 persuasive speaking.'], ['G8:KUANDI.T12_INSHA_ZA_KIUAMILIFU.HOTUBA_UFAFANUZI', E, 'Grade 8 speeches with the itifaki.']] }),
  oral({ G: 9, sub: 'KUSIKI.T15_KUSIKILIZA_KWA_KUTAT', tag: 'T15', id: 'KUTATHMINI', type: 'kutathmini', letters: ['a', 'b', 'c'], theme: 'maadili ya kitaifa', topic: 'mchango wa vijana katika kudumisha amani',
    pre: [['KUSIKI.T7_KUSIKILIZA_KWA_KUTAT.LS_TATHMINI', E, 'Theme 7 judged a speaker\'s message.'], ['KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_MSIMAMO', E, 'Theme 6 the speaker\'s stand.']] }),
];
export const ADD = [
  readAdd({ G: 9, ref: 'KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_MSIMAMO', kind: 'ls_msimamo', also: ['a'], topic: 'usalama barabarani',
    pre: [[K8('T6_KUSIKILIZA_KWA_KUFAS.LS_UJUMBE'), E, 'Grade 8 interpreting a listening text.'], [K8('T12_KUSIKILIZA_KWA_MAKIN.LS_HABARI'), H, 'Grade 8 listening for facts.']] }),
  readAdd({ G: 9, ref: 'KUSIKI.T7_KUSIKILIZA_KWA_KUTAT.LS_TATHMINI', kind: 'ls_tathmini', also: ['a', 'b'], topic: 'huduma katika asasi za kijamii',
    pre: [['KUSIKI.T6_KUSIKILIZA_KWA_KUFAS.LS_MSIMAMO', E, 'Theme 6 the speaker\'s stand.'], ['KUSOMA.T9_KUSOMA_KWA_UFAHAMU.RS_USHAWISHI', H, 'Persuasive language in reading.']] }),
  readAdd({ G: 9, ref: 'KUSIKI.T12_UFAHAMU_WA_KUSIKILIZ.LS_UFAHAMU', kind: 'ls_ufahamu', also: ['c'], topic: 'magonjwa yanayotokana na mienendo ya maisha',
    pre: [['KUSIKI.T5_UFAHAMU_WA_KUSIKILIZ.UFAHAMU_KUSIKILIZA', E, 'Theme 5 rules and features of listening comprehension.'], ['KUSIKI.T7_KUSIKILIZA_KWA_KUTAT.LS_TATHMINI', E, 'Theme 7 views of a speaker (c).']] }),
];
