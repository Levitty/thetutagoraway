// ============================================================================
// KISWAHILI GRADE 5, KUSOMA: ufahamu wa hadithi, msamiati, mchezo wa kuigiza (igizo), shairi (mizani na vina), kamusi.
// DRAFT families, all off for children. Written offline by Claude (12 Nov 2026), no model call.
// The three passages below are original (never copied from a textbook): Kenyan names and places, short sentences
// for a ten-year-old. A passage rides on the problem as passage: { title, text }; a UI that shows it is still to be
// built before any family is switched on. The English reading-level rule does not apply to Kiswahili: the checks keep
// the sentence length (22 words) and the length of a passage, and a native speaker judges the level.
// A native Kiswahili speaker must check every passage and item: docs/qa/kiswahili-g5-native-check-2026-11-12.md.
// ============================================================================
import { kw, mc, feedbackOf, shuffle, pick, randInt, trio, duo, one, outcomeLetters } from './kiswahili_g5_lib.js';

const H = (a, b) => [a, b];

// ---------------------------------------------------------------- the passages
// An entry is [question, right, [wrong, 'M_CODE']..., because, {flags}]. {t:1}: a short answer that can also be typed (right may be 'a|b').
const PASSAGES = [
  {
    id: 'uji', title: 'Uji wa Bibi', kind: 'hadithi',
    text: 'Wanjiru ni msichana wa darasa la tano katika Shule ya Msingi ya Kamukunji. Jumamosi moja, bibi yake alimwita jikoni. "Leo tutapika uji wa ulezi," bibi alisema.\n\nWanjiru alichemsha maji katika sufuria kubwa. Bibi alikoroga unga taratibu ili usiwe na madonge. Kisha walimimina uji ndani ya vikombe.\n\nBaadaye, jirani yao Mzee Otieno alikuja kuwatembelea. Wanjiru alimpa kikombe cha uji moto. Mzee Otieno alifurahi sana. "Mpishi mzuri hujifunza kutoka kwa wakubwa," alisema. Wanjiru alijifunza kwamba kusaidiana kunafanya kazi iwe rahisi.',
    who: [
      ['Nani alimwita Wanjiru jikoni?', 'bibi yake|bibi', ['mama yake', 'M_UFA_WRONG_PERSON'], ['Mzee Otieno', 'M_UFA_WRONG_PERSON'], ['mwalimu wake', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema kwamba bibi yake alimwita jikoni.', { t: 1 }],
      ['Wanjiru alimpa nani kikombe cha uji?', 'Mzee Otieno|Otieno', ['bibi yake', 'M_UFA_WRONG_PERSON'], ['mwalimu wake', 'M_UFA_WRONG_PERSON'], ['mama yake', 'M_UFA_WRONG_PERSON'], 'Jirani yao Mzee Otieno alikuja kuwatembelea, na Wanjiru alimpa kikombe cha uji moto.', { t: 1 }],
      ['Nani alikoroga unga taratibu?', 'bibi yake|bibi', ['Wanjiru', 'M_UFA_WRONG_PERSON'], ['Mzee Otieno', 'M_UFA_WRONG_PERSON'], ['jirani wa pili', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema "Bibi alikoroga unga taratibu".', { t: 1 }],
    ],
    fact: [
      ['Walipika uji wa aina gani?', 'uji wa ulezi|ulezi', ['uji wa mahindi', 'M_UFA_OUTSIDE'], ['uji wa mtama', 'M_UFA_OUTSIDE'], ['uji wa mchele', 'M_UFA_OUTSIDE'], 'Bibi alisema, "Leo tutapika uji wa ulezi."', { t: 1 }],
      ['Wanjiru alichemsha maji katika nini?', 'sufuria kubwa|sufuria', ['kikombe', 'M_UFA_DETAIL_MIX'], ['chungu cha udongo', 'M_UFA_OUTSIDE'], ['birika', 'M_UFA_OUTSIDE'], 'Kifungu kinasema alichemsha maji katika sufuria kubwa.', { t: 1 }],
      ['Walimimina uji ndani ya nini?', 'vikombe', ['sufuria', 'M_UFA_DETAIL_MIX'], ['bakuli', 'M_UFA_OUTSIDE'], ['chupa', 'M_UFA_OUTSIDE'], 'Kifungu kinasema walimimina uji ndani ya vikombe.', { t: 1 }],
      ['Bibi alikoroga unga ili usiwe na nini?', 'madonge', ['maji', 'M_UFA_DETAIL_MIX'], ['moshi', 'M_UFA_OUTSIDE'], ['chumvi', 'M_UFA_OUTSIDE'], 'Bibi alikoroga unga taratibu ili usiwe na madonge.', { t: 1 }],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Kusaidiana kunafanya kazi iwe rahisi.', ['Uji wa ulezi ni mtamu kuliko chai.', 'M_UFA_DETAIL_AS_MAIN'], ['Wanjiru alichemsha maji katika sufuria kubwa.', 'M_UFA_DETAIL_AS_MAIN'], ['Mzee Otieno hupenda kutembelea majirani.', 'M_UFA_DETAIL_AS_MAIN'], 'Wanjiru alijifunza kwamba kusaidiana kunafanya kazi iwe rahisi. Hilo ndilo funzo la hadithi nzima.'],
      ['Hadithi hii inatufundisha nini?', 'Tunapofanya kazi pamoja, tunamaliza haraka na kwa raha.', ['Uji unapikwa kwa sufuria kubwa tu.', 'M_UFA_DETAIL_AS_MAIN'], ['Wageni wanapenda uji wa moto.', 'M_UFA_DETAIL_AS_MAIN'], ['Bibi anajua kupika kuliko mama.', 'M_UFA_OUTSIDE'], 'Wanjiru na bibi walipika pamoja, na kazi ikawa rahisi. Funzo ni kusaidiana.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Kupika uji na bibi', ['Sufuria kubwa', 'M_UFA_DETAIL_AS_MAIN'], ['Mzee Otieno na vikombe', 'M_UFA_DETAIL_AS_MAIN'], ['Safari ya Kamukunji', 'M_UFA_OUTSIDE'], 'Kichwa kizuri kinataja kinachoendelea katika hadithi nzima: kupika uji na bibi.'],
    ],
    order: ['Bibi alimwita Wanjiru jikoni.', 'Wanjiru alichemsha maji.', 'Walimimina uji ndani ya vikombe.', 'Mzee Otieno alipewa kikombe cha uji.'],
    vocab: [
      ['kuchemsha', 'kupasha maji moto hadi yatokote', ['kuchemka kwa maji yenyewe', 'M_MSA_LOOKALIKE'], ['kuchuma majani ya chai', 'M_MSA_NEARBY'], ['kupoza maji', 'M_MSA_OPPOSITE'], 'Wanjiru alichemsha maji kwenye sufuria ili yawe moto. Kuchemsha ni kupasha maji moto.'],
      ['kukoroga', 'kuchanganya kwa kijiko au mwiko', ['kukorofishana', 'M_MSA_LOOKALIKE'], ['kumimina uji vikombeni', 'M_MSA_NEARBY'], ['kuacha uji upoe', 'M_MSA_OPPOSITE'], 'Bibi alikoroga unga taratibu ili usiwe na madonge. Kukoroga ni kuchanganya.'],
      ['madonge', 'vipande vidogo vya unga vilivyoshikana', ['madongo ya udongo', 'M_MSA_LOOKALIKE'], ['vikombe vya uji', 'M_MSA_NEARBY'], ['unga laini', 'M_MSA_OPPOSITE'], 'Bibi alikoroga ili unga usiwe na madonge. Madonge ni vipande vya unga vilivyoshikana.'],
    ],
  },
  {
    id: 'miti', title: 'Siku ya Kupanda Miti', kind: 'hadithi',
    text: 'Shule ya Msingi ya Kilimani ilifanya siku ya kupanda miti Ijumaa. Kila mwanafunzi alipewa mche mmoja. Baraka alipewa mche wa mwembe.\n\nAliuchimbia shimo karibu na uzio wa shule. Kisha alimimina maji ya kutosha. Mwalimu Achieng aliwakumbusha wanafunzi kwamba miti hutoa hewa safi na kivuli.\n\nBaada ya wiki mbili, mche wa Baraka ulikuwa na majani mapya. Baraka alifurahi na aliahidi kuutunza kila siku.',
    who: [
      ['Nani alipewa mche wa mwembe?', 'Baraka', ['Mwalimu Achieng', 'M_UFA_WRONG_PERSON'], ['mwalimu mkuu', 'M_UFA_WRONG_PERSON'], ['mkulima wa kijiji', 'M_UFA_WRONG_PERSON'], 'Kifungu kinasema "Baraka alipewa mche wa mwembe".', { t: 1 }],
      ['Nani aliwakumbusha wanafunzi faida za miti?', 'Mwalimu Achieng|Achieng', ['Baraka', 'M_UFA_WRONG_PERSON'], ['mkulima', 'M_UFA_WRONG_PERSON'], ['mwalimu mkuu', 'M_UFA_WRONG_PERSON'], 'Mwalimu Achieng aliwakumbusha wanafunzi kwamba miti hutoa hewa safi na kivuli.', { t: 1 }],
    ],
    fact: [
      ['Baraka aliuchimbia mche shimo wapi?', 'karibu na uzio wa shule|karibu na uzio', ['karibu na darasa', 'M_UFA_DETAIL_MIX'], ['shambani kwao', 'M_UFA_OUTSIDE'], ['chini ya mti mkubwa', 'M_UFA_OUTSIDE'], 'Kifungu kinasema aliuchimbia shimo karibu na uzio wa shule.', { t: 1 }],
      ['Mche wa Baraka ulikuwa na nini baada ya wiki mbili?', 'majani mapya', ['maua mekundu', 'M_UFA_OUTSIDE'], ['matunda', 'M_UFA_OUTSIDE'], ['shimo jipya', 'M_UFA_DETAIL_MIX'], 'Baada ya wiki mbili, mche ulikuwa na majani mapya.', { t: 1 }],
      ['Siku ya kupanda miti ilifanyika siku gani?', 'Ijumaa', ['Jumamosi', 'M_UFA_OUTSIDE'], ['Jumatatu', 'M_UFA_OUTSIDE'], ['Jumapili', 'M_UFA_OUTSIDE'], 'Kifungu kinasema shule ilifanya siku ya kupanda miti Ijumaa.', { t: 1 }],
      ['Mwalimu Achieng alisema miti hutoa nini?', 'hewa safi na kivuli', ['kuni na makaa', 'M_UFA_OUTSIDE'], ['maji ya kutosha', 'M_UFA_DETAIL_MIX'], ['chakula cha ndege', 'M_UFA_OUTSIDE'], 'Mwalimu aliwakumbusha kwamba miti hutoa hewa safi na kivuli.'],
    ],
    main: [
      ['Ujumbe mkuu wa hadithi ni upi?', 'Miti ni muhimu, na tunapaswa kuipanda na kuitunza.', ['Baraka alipewa mche wa mwembe.', 'M_UFA_DETAIL_AS_MAIN'], ['Shule ya Kilimani ina uzio.', 'M_UFA_DETAIL_AS_MAIN'], ['Ijumaa ni siku nzuri ya shule.', 'M_UFA_DETAIL_AS_MAIN'], 'Hadithi nzima inaonyesha faida za miti na umuhimu wa kuitunza.'],
      ['Hadithi hii inatufundisha nini?', 'Tukitunza miti, tunapata hewa safi na kivuli.', ['Maembe ni matamu kuliko machungwa.', 'M_UFA_OUTSIDE'], ['Uzio wa shule ni mrefu.', 'M_UFA_DETAIL_AS_MAIN'], ['Wiki mbili ni muda mrefu.', 'M_UFA_DETAIL_AS_MAIN'], 'Mwalimu alisema miti hutoa hewa safi na kivuli, na Baraka aliahidi kuitunza.'],
      ['Ni kichwa kipi kinafaa zaidi kwa hadithi hii?', 'Mche wa mwembe wa Baraka', ['Uzio wa shule', 'M_UFA_DETAIL_AS_MAIN'], ['Maji ya kutosha', 'M_UFA_DETAIL_AS_MAIN'], ['Siku ya Ijumaa', 'M_UFA_DETAIL_AS_MAIN'], 'Hadithi nzima inamhusu Baraka na mche wake wa mwembe.'],
    ],
    order: ['Kila mwanafunzi alipewa mche.', 'Baraka aliuchimbia mche shimo.', 'Baraka alimimina maji.', 'Mche wa Baraka ulikuwa na majani mapya.'],
    vocab: [
      ['mche', 'mmea mchanga uliotayarishwa kupandwa', ['mchele', 'M_MSA_LOOKALIKE'], ['maji ya kumimina', 'M_MSA_NEARBY'], ['mti mkubwa wenye matunda', 'M_MSA_OPPOSITE'], 'Kila mwanafunzi alipewa mche wa kupanda. Mche ni mmea mchanga.'],
      ['uzio', 'ua au ukuta unaozunguka eneo', ['uzi wa kushonea', 'M_MSA_LOOKALIKE'], ['shimo la kupandia', 'M_MSA_NEARBY'], ['lango kuu la shule', 'M_MSA_NEARBY'], 'Baraka alichimba shimo karibu na uzio wa shule. Uzio huzunguka eneo la shule.'],
      ['aliahidi', 'alisema kwa uhakika kwamba atafanya jambo', ['aliahirisha', 'M_MSA_LOOKALIKE'], ['alimwagilia maji', 'M_MSA_NEARBY'], ['alikataa kufanya', 'M_MSA_OPPOSITE'], 'Baraka alisema atautunza mche kila siku. Kuahidi ni kusema kwa uhakika kwamba utafanya jambo.'],
    ],
  },
  {
    id: 'sokoni', title: 'Safari ya Sokoni', kind: 'igizo',
    text: 'Mahali: Jikoni nyumbani kwa Mama Akinyi.\n\nMama: (Anaweka kikapu mezani) Akinyi, nenda sokoni ununue nyanya na vitunguu.\nAkinyi: (Anachukua pesa) Nitaleta nyanya ngapi, mama?\nMama: Nunua nyanya tano na vitunguu vitatu.\nJuma: (Anaingia kwa haraka) Mama, naomba niandamane na dada.\nMama: Sawa, lakini msichelewe.\nAkinyi: (Anatabasamu) Tutarudi kabla ya saa saba.',
    who: [
      ['Nani alisema "Nunua nyanya tano na vitunguu vitatu"?', 'Mama', ['Akinyi', 'M_IGI_WRONG_SPEAKER'], ['Juma', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Jina lililo mbele ya nukta mbili ni la mtu anayesema: "Mama: Nunua nyanya tano na vitunguu vitatu."', { t: 1 }],
      ['Nani alisema "Mama, naomba niandamane na dada"?', 'Juma', ['Mama', 'M_IGI_WRONG_SPEAKER'], ['Akinyi', 'M_IGI_WRONG_SPEAKER'], ['baba', 'M_IGI_WRONG_SPEAKER'], 'Mstari huo unaanza na "Juma:", kwa hiyo Juma ndiye aliyesema.', { t: 1 }],
      ['Nani alisema "Tutarudi kabla ya saa saba"?', 'Akinyi', ['Mama', 'M_IGI_WRONG_SPEAKER'], ['Juma', 'M_IGI_WRONG_SPEAKER'], ['mwalimu', 'M_IGI_WRONG_SPEAKER'], 'Mstari huo unaanza na "Akinyi:", kwa hiyo Akinyi ndiye aliyesema.', { t: 1 }],
    ],
    who2: [
      ['Nani aliweka kikapu mezani?', 'Mama', ['Akinyi', 'M_IGI_WRONG_SPEAKER'], ['Juma', 'M_IGI_WRONG_SPEAKER'], ['bibi', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Mama: (Anaweka kikapu mezani)".', { t: 1 }],
      ['Nani alichukua pesa?', 'Akinyi', ['Mama', 'M_IGI_WRONG_SPEAKER'], ['Juma', 'M_IGI_WRONG_SPEAKER'], ['baba', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Akinyi: (Anachukua pesa)".', { t: 1 }],
      ['Nani aliingia kwa haraka?', 'Juma', ['Mama', 'M_IGI_WRONG_SPEAKER'], ['Akinyi', 'M_IGI_WRONG_SPEAKER'], ['mwalimu', 'M_IGI_WRONG_SPEAKER'], 'Maelekezo yanasema "Juma: (Anaingia kwa haraka)".', { t: 1 }],
    ],
    fact: [
      ['Akinyi alitumwa kwenda wapi?', 'sokoni', ['jikoni', 'M_IGI_DETAIL'], ['kanisani', 'M_IGI_DETAIL'], ['shuleni', 'M_IGI_DETAIL'], 'Mama alisema, "Akinyi, nenda sokoni."', { t: 1 }],
      ['Mama alitaka Akinyi anunue nyanya ngapi?', 'tano', ['tatu', 'M_IGI_DETAIL'], ['saba', 'M_IGI_DETAIL'], ['kumi', 'M_IGI_DETAIL'], 'Mama alisema, "Nunua nyanya tano na vitunguu vitatu."', { t: 1 }],
      ['Mahali pa igizo hili ni wapi?', 'jikoni nyumbani kwa Mama Akinyi|jikoni', ['sokoni', 'M_IGI_DETAIL'], ['shuleni', 'M_IGI_DETAIL'], ['kanisani', 'M_IGI_DETAIL'], 'Mwanzoni imeandikwa "Mahali: Jikoni nyumbani kwa Mama Akinyi."', { t: 1 }],
      ['Juma aliomba nini?', 'kuandamana na dada|kwenda na dada', ['kupika chakula', 'M_IGI_DETAIL'], ['kupewa pesa', 'M_IGI_DETAIL'], ['kukaa nyumbani', 'M_IGI_DETAIL'], 'Juma alisema, "Mama, naomba niandamane na dada."', { t: 1 }],
    ],
    dir: [
      ['Ni maneno yapi ni maneno ambayo mhusika anayasema?', 'Akinyi: Nitaleta nyanya ngapi, mama?', ['(Anachukua pesa)', 'M_IGI_STAGE_AS_SPEECH'], ['(Anaingia kwa haraka)', 'M_IGI_STAGE_AS_SPEECH'], ['(Anatabasamu)', 'M_IGI_STAGE_AS_SPEECH'], 'Maneno ya mhusika huja baada ya jina lake na nukta mbili. Yaliyo kwenye mabano ni maelekezo.'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anaweka kikapu mezani)', ['Mama: Nenda sokoni ununue nyanya na vitunguu.', 'M_IGI_STAGE_AS_SPEECH'], ['Juma: Mama, naomba niandamane na dada.', 'M_IGI_STAGE_AS_SPEECH'], ['Mahali: Jikoni.', 'M_IGI_STAGE_AS_SPEECH'], 'Kilicho kwenye mabano ni maelekezo ya kitendo: (Anaweka kikapu mezani).'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anachukua pesa)', ['Akinyi: Nitaleta nyanya ngapi, mama?', 'M_IGI_STAGE_AS_SPEECH'], ['Mama: Nunua nyanya tano na vitunguu vitatu.', 'M_IGI_STAGE_AS_SPEECH'], ['Mama: Sawa, lakini msichelewe.', 'M_IGI_STAGE_AS_SPEECH'], 'Maneno kwenye mabano yanaonyesha kitendo cha muigizaji: (Anachukua pesa).'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anaingia kwa haraka)', ['Mama: Sawa, lakini msichelewe.', 'M_IGI_STAGE_AS_SPEECH'], ['Akinyi: Nitaleta nyanya ngapi, mama?', 'M_IGI_STAGE_AS_SPEECH'], ['Mahali: Jikoni.', 'M_IGI_STAGE_AS_SPEECH'], 'Maelekezo ya jukwaani huwekwa kwenye mabano: (Anaingia kwa haraka). Yanamwonyesha muigizaji afanye nini.'],
      ['Ni maneno yapi ni maelekezo ya jukwaani (yanaonyesha kitendo)?', '(Anatabasamu)', ['Akinyi: Tutarudi kabla ya saa saba.', 'M_IGI_STAGE_AS_SPEECH'], ['Mama: Nunua nyanya tano.', 'M_IGI_STAGE_AS_SPEECH'], ['Juma: Mama, naomba niandamane na dada.', 'M_IGI_STAGE_AS_SPEECH'], 'Maneno yaliyo kwenye mabano ni maelekezo ya kitendo, si maneno ambayo mhusika anasema.'],
    ],
    vocab: [
      ['kikapu', 'chombo cha kubebea vitu kilichosukwa', ['kikapo cha kusafiria ndege', 'M_IGI_VOCAB'], ['kitambaa cha mezani', 'M_IGI_VOCAB'], ['kijiko kikubwa', 'M_IGI_VOCAB'], 'Mama aliweka kikapu mezani ili Akinyi aweke mboga. Kikapu ni chombo cha kubebea vitu.'],
      ['kutabasamu', 'kucheka kidogo bila sauti kuonyesha furaha', ['kulia kwa sauti', 'M_IGI_VOCAB'], ['kukasirika sana', 'M_IGI_VOCAB'], ['kukimbia kwa haraka', 'M_IGI_VOCAB'], 'Akinyi alitabasamu alipoahidi kurudi mapema. Kutabasamu ni kucheka kidogo bila sauti.'],
      ['kurudi', 'kufika tena mahali ulipotoka', ['kwenda mbele zaidi', 'M_IGI_VOCAB'], ['kukaa pale pale', 'M_IGI_VOCAB'], ['kununua vitu sokoni', 'M_IGI_VOCAB'], 'Akinyi alisema watarudi kabla ya saa saba, yaani watakuwa nyumbani tena. Kurudi ni kufika tena mahali ulipotoka.'],
      ['kuandamana', 'kwenda pamoja na mtu', ['kukimbia peke yake', 'M_IGI_VOCAB'], ['kurudi nyumbani', 'M_IGI_VOCAB'], ['kupika chakula', 'M_IGI_VOCAB'], 'Juma alitaka kwenda na dada yake. Kuandamana ni kwenda pamoja na mtu.'],
      ['kuchelewa', 'kufika baada ya wakati uliowekwa', ['kufika mapema', 'M_IGI_VOCAB'], ['kukataa kwenda', 'M_IGI_VOCAB'], ['kuondoka haraka', 'M_IGI_VOCAB'], 'Mama aliwaambia wasichelewe, yaani wasifike baada ya wakati. Kuchelewa ni kufika baada ya wakati.'],
    ],
  },
];
const byId = Object.fromEntries(PASSAGES.map(p => [p.id, p]));
const showP = (p) => ({ title: p.title, text: p.text });

// ---------------------------------------------------------------- builders
const flat = (key, kind) => PASSAGES.filter(p => (kind ? p.kind === kind : true) && p[key]).flatMap(p => [...p[key], ...(p[`${key}2`] || [])].map(e => ({ p, e })));
const norm = (key, e) => {
  const a = [...e];
  const flags = a.length && !Array.isArray(a[a.length - 1]) && typeof a[a.length - 1] === 'object' ? a.pop() : {};
  const because = a.pop();
  if (key === 'vocab') return { q: `Katika kifungu, neno "${a[0]}" lina maana gani?`, right: a[1], wrongs: a.slice(2), because, flags };
  return { q: a[0], right: a[1], wrongs: a.slice(2), because, flags };
};
const optionsOf = (cskill, wrongs, right) => mc(right, shuffle(wrongs).slice(0, 3).map(([t, code]) => [t, feedbackOf(cskill, code), code]));
// choose from a passage question
const passChoose = (key, { hints, kind, onlyTyped = false }) => (cskill) => {
  const { p, e } = pick(flat(key, kind).filter(x => !onlyTyped || norm(key, x.e).flags.t));
  const n = norm(key, e), options = optionsOf(cskill, n.wrongs, n.right.split('|')[0]);
  if (!options) return null;
  return { passage: showP(p), question: n.q, options, instruction: 'Soma kifungu. Kisha chagua jibu sahihi.', hints, steps: [n.because, `Jibu ni "${n.right.split('|')[0]}".`] };
};
// type a short answer (entries flagged t:1)
const passType = (key, { hints, kind }) => (cskill) => {
  const { p, e } = pick(flat(key, kind).filter(x => norm(key, x.e).flags.t));
  const n = norm(key, e), [shown, ...alt] = n.right.split('|');
  return { passage: showP(p), question: n.q, answer: shown, accepts: alt, wrong: n.wrongs.map(([t, code]) => [t, feedbackOf(cskill, code), code]), instruction: 'Soma kifungu. Kisha andika jibu fupi.', hints: [...hints, `Jibu linaanza na herufi "${shown[0]}".`], steps: [n.because, `Jibu ni "${shown}".`], chk: (a) => [shown, ...alt].includes(String(a)) };
};
// put four events in order
const orderGen = (cskill) => {
  const p = pick(PASSAGES.filter(x => x.order && x.kind === 'hadithi'));
  const ev = p.order;
  let show; do { show = shuffle(ev.map((t, i) => i)); } while (show.every((v, i) => v === i));
  const letter = (idx) => 'ABCD'[show.indexOf(idx)];
  const seq = (arr) => arr.map(letter).join(', ');
  const base = [0, 1, 2, 3];
  const right = seq(base), reversed = seq([...base].reverse());
  const i = randInt(0, 2), sw = [...base]; [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
  const rot = seq([3, 0, 1, 2]);
  const options = mc(right, [[reversed, feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER'], [seq(sw), feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER'], [rot, feedbackOf(cskill, 'M_UFA_ORDER'), 'M_UFA_ORDER']]);
  if (!options) return null;
  const list = show.map((idx, k) => `${'ABCD'[k]} ${ev[idx]}`).join(' ');
  return { passage: showP(p), question: `Matukio manne ya hadithi yamechanganywa. Ni orodha ipi inaonyesha mpangilio ambao yalitokea? ${list}`, options, fixedOrder: false, instruction: 'Soma kifungu. Kisha chagua jibu sahihi.',
    hints: ['Tafuta tukio la kwanza kwenye kifungu, kisha linalofuata.', 'Angalia maneno ya wakati kama "kisha", "baadaye" na "baada ya".'], steps: [`Katika hadithi matukio yalitokea hivi: ${ev.map((t, k) => `${k + 1}. ${t}`).join(' ')}`, `Kwa herufi ni ${right}.`], chk: () => true };
};

// ---------------------------------------------------------------- word and sentence pools
const MSA_GAP = [
  ['Mama alikoroga uji kwa kijiko ili usiwe na ___.', 'madonge', ['madongo', 'M_MSA_LOOKALIKE'], ['vikombe', 'M_MSA_NEARBY'], ['kijiko', 'M_MSA_NEARBY'], 'Madonge ni vipande vya unga vilivyoshikana. Kukoroga huvivunja.'],
  ['Bibi aliweka sufuria juu ya jiko ili ___ maji.', 'achemshe', ['achemke', 'M_MSA_LOOKALIKE'], ['apoze', 'M_MSA_OPPOSITE'], ['achume', 'M_MSA_NEARBY'], 'Kuchemsha ni kupasha maji moto hadi yatokote.'],
  ['Tulipanda mche karibu na ___ wa shule.', 'uzio', ['uzi', 'M_MSA_LOOKALIKE'], ['uwanja', 'M_MSA_NEARBY'], ['mlango', 'M_MSA_NEARBY'], 'Uzio ni ua unaozunguka shule.'],
  ['Mwalimu alitupa kila mmoja ___ mmoja wa kupanda.', 'mche', ['mchele', 'M_MSA_LOOKALIKE'], ['mkate', 'M_MSA_NEARBY'], ['mti mkubwa', 'M_MSA_OPPOSITE'], 'Mche ni mmea mchanga wa kupanda.'],
  ['Baraka ___ kuutunza mche kila siku.', 'aliahidi', ['aliahirisha', 'M_MSA_LOOKALIKE'], ['alikataa', 'M_MSA_OPPOSITE'], ['alimwagilia', 'M_MSA_NEARBY'], 'Kuahidi ni kusema kwa uhakika kwamba utafanya jambo.'],
];
const IGI_PART = [
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Juma: Mama, naomba niandamane na dada.', ['Juma aliingia kwa haraka na kumwomba mama.', 'M_IGI_STORY'], ['Mama alimruhusu Juma kwenda.', 'M_IGI_STORY'], ['Juma ni mvulana mwenye bidii.', 'M_IGI_STORY'], 'Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.'],
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Akinyi: Nitaleta nyanya ngapi, mama?', ['Akinyi aliuliza ni nyanya ngapi anunue.', 'M_IGI_STORY'], ['Akinyi alienda sokoni asubuhi.', 'M_IGI_STORY'], ['Akinyi ni msichana mtiifu.', 'M_IGI_STORY'], 'Mstari wa igizo huanza na jina la mhusika na nukta mbili.'],
  ['Ni kipi kati ya hivi kinatoka kwenye mchezo wa kuigiza (igizo)?', 'Mama: Sawa, lakini msichelewe.', ['Mama alikubali, lakini aliwaambia wasichelewe.', 'M_IGI_STORY'], ['Mama alikuwa jikoni.', 'M_IGI_STORY'], ['Mama alipenda kupika.', 'M_IGI_STORY'], 'Maneno ya mhusika katika igizo yameandikwa baada ya jina lake.'],
  ['Ni kipi kati ya hivi kinatoka kwenye hadithi, si igizo?', 'Wanjiru alichemsha maji katika sufuria kubwa.', ['Bibi: Leo tutapika uji wa ulezi.', 'M_IGI_STORY'], ['Wanjiru: Nimeshachemsha maji.', 'M_IGI_STORY'], ['Mzee Otieno: Asante kwa uji.', 'M_IGI_STORY'], 'Hadithi huelezwa na msimulizi. Igizo huwa na majina ya wahusika na nukta mbili.'],
];
const MIZ = [
  ['Mshororo "Mama anapika" una mizani ___.', '6', ['2', 'M_SHA_COUNT_WORDS'], ['11', 'M_SHA_COUNT_LETTERS'], ['5', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: ma-ma a-na-pi-ka ni mizani 6.'],
  ['Mshororo "Baba analima" una mizani ___.', '6', ['2', 'M_SHA_COUNT_WORDS'], ['11', 'M_SHA_COUNT_LETTERS'], ['5', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: ba-ba a-na-li-ma ni mizani 6.'],
  ['Mshororo "Jua linawaka" una mizani ___.', '6', ['2', 'M_SHA_COUNT_WORDS'], ['11', 'M_SHA_COUNT_LETTERS'], ['5', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: ju-a li-na-wa-ka ni mizani 6.'],
  ['Mshororo "Kila siku" una mizani ___.', '4', ['2', 'M_SHA_COUNT_WORDS'], ['8', 'M_SHA_COUNT_LETTERS'], ['3', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: ki-la si-ku ni mizani 4.'],
  ['Mshororo "Tunda tamu" una mizani ___.', '4', ['2', 'M_SHA_COUNT_WORDS'], ['9', 'M_SHA_COUNT_LETTERS'], ['3', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: tu-nda ta-mu ni mizani 4.'],
  ['Mshororo "Watoto wanacheza" una mizani ___.', '7', ['2', 'M_SHA_COUNT_WORDS'], ['15', 'M_SHA_COUNT_LETTERS'], ['6', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: wa-to-to wa-na-che-za ni mizani 7.'],
  ['Mshororo "Soma kwa bidii" una mizani ___.', '6', ['3', 'M_SHA_COUNT_WORDS'], ['12', 'M_SHA_COUNT_LETTERS'], ['5', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: so-ma kwa bi-di-i ni mizani 6. Irabu mbili za bidii ni silabi mbili tofauti.'],
  ['Mshororo "Rafiki yangu" una mizani ___.', '5', ['2', 'M_SHA_COUNT_WORDS'], ['11', 'M_SHA_COUNT_LETTERS'], ['4', 'M_SHA_MISCOUNT'], 'Mizani ni silabi: ra-fi-ki ya-ngu ni mizani 5.'],
];
const VINA = [
  ['Mishororo inayoishia "shambani" na "nyumbani" ina vina vya ___.', 'ani', ['sha', 'M_SHA_VINA_START'], ['nyu', 'M_SHA_VINA_START'], ['hakuna', 'M_SHA_VINA_WORD'], 'Vina ni sauti za mwisho zinazofanana: shambani na nyumbani zote zinaishia -ani.'],
  ['Mishororo inayoishia "kusoma" na "kuchoma" ina vina vya ___.', 'oma', ['ku', 'M_SHA_VINA_START'], ['hakuna', 'M_SHA_VINA_WORD'], ['soma', 'M_SHA_VINA_WORD'], 'Vina ni sauti za mwisho zinazofanana: kusoma na kuchoma zinaishia -oma.'],
  ['Mishororo inayoishia "tunda" na "panda" ina vina vya ___.', 'nda', ['tu', 'M_SHA_VINA_START'], ['pa', 'M_SHA_VINA_START'], ['hakuna', 'M_SHA_VINA_WORD'], 'Vina ni sauti za mwisho zinazofanana: tunda na panda zinaishia -nda.'],
  ['Mishororo inayoishia "nchini" na "shuleni" ina vina vya ___.', 'ni', ['nchi', 'M_SHA_VINA_START'], ['shu', 'M_SHA_VINA_START'], ['hakuna', 'M_SHA_VINA_WORD'], 'Vina ni sauti za mwisho zinazofanana: nchini na shuleni zinaishia -ni.'],
  ['Mishororo inayoishia "penda" na "tenda" ina vina vya ___.', 'enda', ['pe', 'M_SHA_VINA_START'], ['te', 'M_SHA_VINA_START'], ['hakuna', 'M_SHA_VINA_WORD'], 'Vina ni sauti za mwisho zinazofanana: penda na tenda zinaishia -enda.'],
];
const KAMUSI = [
  ['Kati ya "mto", "baba" na "zeze", neno linalokuja kwanza kwenye kamusi ni ___.', 'baba', ['mto', 'M_KAM_LENGTH'], ['zeze', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya baba ni b, na b huja kabla ya m na z.'],
  ['Kati ya "kuku", "chungwa" na "ndizi", neno linalokuja kwanza kwenye kamusi ni ___.', 'chungwa', ['kuku', 'M_KAM_LENGTH'], ['ndizi', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya chungwa ni c, na c huja kabla ya k na n.'],
  ['Kati ya "ua", "ardhi" na "wali", neno linalokuja kwanza kwenye kamusi ni ___.', 'ardhi', ['ua', 'M_KAM_LENGTH'], ['wali', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya ardhi ni a, na a huja kabla ya u na w.'],
  ['Kati ya "mto", "kalamu" na "zulia", neno linalokuja kwanza kwenye kamusi ni ___.', 'kalamu', ['mto', 'M_KAM_LENGTH'], ['zulia', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya kalamu ni k, na k huja kabla ya m na z.'],
  ['Kati ya "tai", "hospitali" na "wimbo", neno linalokuja kwanza kwenye kamusi ni ___.', 'hospitali', ['tai', 'M_KAM_LENGTH'], ['wimbo', 'M_KAM_REVERSE'], 'Herufi ya kwanza ya hospitali ni h, na h huja kabla ya t na w.'],
  ['Kati ya "samaki", "sahani" na "sufuria", neno linalokuja kwanza kwenye kamusi ni ___.', 'sahani', ['samaki', 'M_KAM_FIRST_ONLY'], ['sufuria', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na s. Samaki na sahani zinaendelea na a, lakini sufuria inaendelea na u, na u huja baada ya a. Kati ya samaki na sahani, h huja kabla ya m, kwa hiyo sahani inakuja kwanza.'],
  ['Kati ya "mkono", "mguu" na "mwili", neno linalokuja kwanza kwenye kamusi ni ___.', 'mguu', ['mkono', 'M_KAM_FIRST_ONLY'], ['mwili', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na m. Herufi ya pili: g huja kabla ya k na w, kwa hiyo mguu unakuja kwanza.'],
  ['Kati ya "kitabu", "kikombe" na "kiti", neno linalokuja kwanza kwenye kamusi ni ___.', 'kikombe', ['kitabu', 'M_KAM_FIRST_ONLY'], ['kiti', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na ki. Herufi ya tatu: k huja kabla ya t, kwa hiyo kikombe kinakuja kwanza.'],
  ['Kati ya "panga", "pamba" na "pesa", neno linalokuja kwanza kwenye kamusi ni ___.', 'pamba', ['panga', 'M_KAM_FIRST_ONLY'], ['pesa', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na p. Herufi ya pili: a huja kabla ya e. Kisha m huja kabla ya n, kwa hiyo pamba inakuja kwanza.'],
  ['Kati ya "baba", "mto" na "zeze", neno linalokuja mwisho kwenye kamusi ni ___.', 'zeze', ['baba', 'M_KAM_REVERSE'], ['mto', 'M_KAM_LENGTH'], 'Herufi ya kwanza ya zeze ni z, na z ndiyo ya mwisho katika alfabeti kati ya b, m na z.'],
  ['Kati ya "samaki", "sahani" na "sufuria", neno linalokuja mwisho kwenye kamusi ni ___.', 'sufuria', ['sahani', 'M_KAM_REVERSE'], ['samaki', 'M_KAM_FIRST_ONLY'], 'Maneno yote yanaanza na s. Samaki na sahani zinaendelea na a, lakini sufuria inaendelea na u, na u huja baada ya a, kwa hiyo sufuria inakuja mwisho.'],
];

const UFS = [
  ['Ni nini kinachoonyesha kusoma kwa ufasaha?', 'Kusoma kwa kasi ifaayo, matamshi bora na sauti ipasavyo', ['Kusoma haraka iwezekanavyo', 'M_UFS_SPEED'], ['Kusoma kwa sauti kubwa kuliko wote', 'M_UFS_LOUD'], ['Kusoma bila kusimama kwenye alama', 'M_UFS_IGNORE_MARKS'], 'Kusoma kwa ufasaha ni kusoma kwa kasi ifaayo, matamshi bora na sauti ipasavyo, huku ukizingatia alama.'],
  ['Unaposoma kifungu na kufika kwenye koma, ufanye nini?', 'Nipumzike kidogo', ['Niendelee bila kupumzika', 'M_UFS_IGNORE_MARKS'], ['Nisimame kabisa', 'M_UFS_IGNORE_MARKS'], ['Niongeze kasi', 'M_UFS_SPEED'], 'Koma inaonyesha mahali pa kupumzika kidogo.'],
  ['Unaposoma kifungu na kufika kwenye kikomo (.), ufanye nini?', 'Nipumzike muda mrefu kidogo kuliko kwenye koma', ['Niendelee bila kupumzika', 'M_UFS_IGNORE_MARKS'], ['Nipaze sauti zaidi', 'M_UFS_LOUD'], ['Niongeze kasi', 'M_UFS_SPEED'], 'Kikomo kinaonyesha mwisho wa sentensi, kwa hiyo tunapumzika muda mrefu kidogo.'],
  ['Kasi ifaayo ya kusoma ni ipi?', 'Si haraka sana wala polepole sana', ['Haraka iwezekanavyo', 'M_UFS_SPEED'], ['Polepole sana', 'M_UFS_SPEED'], ['Kasi ya kupiga kelele', 'M_UFS_LOUD'], 'Kasi ifaayo ni ya wastani, ili msikilizaji aelewe kila neno.'],
  ['Sauti ipasavyo wakati wa kusoma ni ipi?', 'Sauti inayosikika wazi bila kupiga kelele', ['Kupiga kelele', 'M_UFS_LOUD'], ['Kunong\'ona', 'M_UFS_LOUD'], ['Kusoma bila sauti kabisa', 'M_UFS_IGNORE_MARKS'], 'Sauti ipasavyo inasikika wazi bila kupiga kelele wala kunong\'ona.'],
];
const UFS_S = [
  ['', 'Msomaji mzuri husoma kwa kasi ifaayo.', ['Msomaji mzuri husoma haraka iwezekanavyo.', 'M_UFS_SPEED'], ['Msomaji mzuri husoma polepole sana.', 'M_UFS_SPEED'], 'Kasi ifaayo ni ya wastani, si haraka sana wala polepole sana.'],
  ['', 'Msomaji mzuri hutumia sauti inayosikika wazi.', ['Msomaji mzuri hupiga kelele ili asikike.', 'M_UFS_LOUD'], ['Msomaji mzuri hunong\'ona kila wakati.', 'M_UFS_LOUD'], 'Sauti ifaayo inasikika wazi bila kupiga kelele.'],
  ['', 'Msomaji mzuri hupumzika kidogo kwenye koma.', ['Msomaji mzuri haangalii alama anaposoma.', 'M_UFS_IGNORE_MARKS'], ['Msomaji mzuri husoma bila kupumzika kwenye kikomo.', 'M_UFS_IGNORE_MARKS'], 'Alama za uakifishi zinaonyesha mahali pa kupumzika.'],
  ['', 'Msomaji mzuri hutamka maneno kwa usahihi.', ['Msomaji mzuri huruka maneno magumu ili amalize haraka.', 'M_UFS_SPEED'], ['Msomaji mzuri husoma maneno mengi bila kuyatamka vizuri.', 'M_UFS_SPEED'], 'Matamshi bora humsaidia msikilizaji kuelewa kila neno.'],
  ['', 'Msomaji mzuri hupumzika muda mrefu kidogo kwenye kikomo.', ['Msomaji mzuri hukimbia kwenye kikomo.', 'M_UFS_SPEED'], ['Msomaji mzuri hupaza sauti kwenye kikomo.', 'M_UFS_LOUD'], 'Kikomo kinaonyesha mwisho wa sentensi, kwa hiyo tunapumzika.'],
];
const L = (cs, n) => outcomeLetters(cs, n);
const C_MSA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.MSAMIATI', C_UFA = 'KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', C_IGI = 'KUSOMA.T8_KUSOMA_KWA_UFAHAMU.IGIZO', C_SHA = 'KUSOMA.T5_KUSOMA_KWA_UFAHAMU.SHAIRI', C_KAM = 'KUSOMA.T2_KUSOMA_KWA_KINA.KAMUSI';

export const FAMILIES = [
  // ---- MSAMIATI
  kw({ id: 'kiswahili5.msamiati.maana', cs: C_MSA, oc: 'a', kind: 'choose-meaning', form: 'word', rung: 2, gen: passChoose('vocab', { kind: 'hadithi', hints: H('Soma sentensi lenye neno hilo, na sentensi zilizo karibu nalo.', 'Jaribu kila maana mahali pa neno. Ipi inafaa?') }) }),
  ...trio('msamiati.tumia', C_MSA, MSA_GAP, { stem: 'Chagua neno linalokamilisha sentensi.', gapStem: 'Andika neno linalokosekana:', oc: ['b', 'b', 'b'], tag: 'tumia', topic: 'kuhusu msamiati', hints: H('Fikiria maana ya kila neno kabla ya kuchagua.', 'Neno linaloonekana kama jingine si lazima liwe na maana sawa nalo.') }),
  // ---- UFAHAMU WA HADITHI
  kw({ id: 'kiswahili5.hadithi.nani', cs: C_UFA, oc: 'c', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu aliyefanya kitendo.', 'Jibu liko kwenye kifungu.') }) }),
  kw({ id: 'kiswahili5.hadithi.nini', cs: C_UFA, oc: 'c', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu. Tafuta sentensi inayojibu swali.', 'Hakikisha jibu linalingana na kinachoulizwa, si neno moja tu la swali.') }) }),
  kw({ id: 'kiswahili5.hadithi.andika', cs: C_UFA, oc: 'c', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'hadithi', hints: H('Jibu limeandikwa kwenye kifungu.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili5.hadithi.nani.andika', cs: C_UFA, oc: 'c', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'hadithi', hints: H('Tafuta sentensi inayotaja mtu huyo.', 'Andika jina au cheo tu.') }) }),
  kw({ id: 'kiswahili5.hadithi.ujumbe', cs: C_UFA, oc: 'd', kind: 'choose-main', form: 'word', rung: 2, gen: passChoose('main', { kind: 'hadithi', hints: H('Ujumbe mkuu ni funzo la hadithi nzima.', 'Jambo moja dogo ndani ya hadithi si ujumbe mkuu.') }) }),
  kw({ id: 'kiswahili5.hadithi.mpangilio', cs: C_UFA, oc: 'd', kind: 'order-events', form: 'steps', rung: 2, gen: orderGen }),
  // ---- IGIZO
  kw({ id: 'kiswahili5.igizo.tambua', cs: C_IGI, oc: 'a', kind: 'choose-form', form: 'direct', rung: 1, gen: (cskill) => {
    const it = pick(IGI_PART.map(x => ({ q: x[0], right: x[1], wrongs: x.slice(2, -1), because: x[x.length - 1] })));
    const options = optionsOf(cskill, it.wrongs, it.right);
    return options && { question: it.q, options, instruction: 'Chagua jibu sahihi.', hints: H('Igizo huonyesha jina la mhusika, nukta mbili, kisha maneno anayosema.', 'Hadithi huelezwa na msimulizi bila majina na nukta mbili.'), steps: [it.because, `Jibu ni "${it.right}".`] };
  } }),
  kw({ id: 'kiswahili5.igizo.maelekezo', cs: C_IGI, oc: 'a', kind: 'choose-direction', form: 'word', rung: 2, gen: passChoose('dir', { kind: 'igizo', hints: H('Maelekezo ya jukwaani yako kwenye mabano.', 'Mabano yanamwonyesha muigizaji afanye nini, si aseme nini.') }) }),
  kw({ id: 'kiswahili5.igizo.msamiati', cs: C_IGI, oc: 'c', kind: 'choose-meaning', form: 'word', rung: 2, gen: passChoose('vocab', { kind: 'igizo', hints: H('Soma mstari ambao neno hilo limetumika.', 'Fikiria nani anafanya nini na nani.') }) }),
  kw({ id: 'kiswahili5.igizo.nani', cs: C_IGI, oc: 'd', kind: 'choose-who', form: 'word', rung: 1, gen: passChoose('who', { kind: 'igizo', hints: H('Tafuta mstari huo na usome jina lililo mbele ya nukta mbili.', 'Jina hilo ni la mtu anayesema.') }) }),
  kw({ id: 'kiswahili5.igizo.nini', cs: C_IGI, oc: 'd', kind: 'choose-fact', form: 'word', rung: 1, gen: passChoose('fact', { kind: 'igizo', hints: H('Jibu liko kwenye igizo. Tafuta mstari unaolitaja.', 'Soma tena mstari huo.') }) }),
  kw({ id: 'kiswahili5.igizo.andika', cs: C_IGI, oc: 'd', kind: 'type-short', form: 'word', rung: 2, gen: passType('fact', { kind: 'igizo', hints: H('Jibu liko kwenye igizo.', 'Andika jibu fupi tu.') }) }),
  kw({ id: 'kiswahili5.igizo.nani.andika', cs: C_IGI, oc: 'd', kind: 'type-who', form: 'word', rung: 2, gen: passType('who', { kind: 'igizo', hints: H('Tafuta mstari huo kwenye igizo.', 'Andika jina la mhusika tu.') }) }),
  // ---- SHAIRI
  ...trio('shairi.mizani', C_SHA, MIZ, { stem: 'Chagua idadi sahihi ya mizani.', gapStem: 'Andika idadi ya mizani:', oc: ['a', 'a', 'a'], topic: 'kuhusu mizani', hints: H('Mizani ni silabi: hesabu kila irabu.', 'Piga makofi kwa kila silabi: ma-ma a-na-pi-ka.') }),
  ...trio('shairi.vina', C_SHA, VINA, { stem: 'Chagua vina sahihi.', gapStem: 'Andika vina:', oc: ['b', 'b', 'b'], tag: 'vina', topic: 'kuhusu vina', hints: H('Vina ni sauti za mwisho zinazofanana katika mishororo.', 'Sema maneno mawili kwa sauti na usikilize mwisho wake.') }),
  // ---- KUSOMA KWA UFASAHA (what a fluent reader does: the reading aloud itself is for the teacher)
  ...one('ufasaha.tambua', 'KUSOMA.T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE', UFS, { stem: 'Chagua jibu sahihi.', oc: 'a', tag: 'tambua', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Alama za uakifishi zinaonyesha mahali pa kupumzika.') }),
  ...duo('ufasaha.sentensi', 'KUSOMA.T3_KUSOMA_KWA_UFASAHA.UFASAHA_VIPENGELE', UFS_S, { stem: 'Chagua sentensi sahihi kuhusu kusoma kwa ufasaha.', oc: ['a', 'a'], tag: 'sentensi', topic: 'kuhusu kusoma kwa ufasaha', hints: H('Msomaji mzuri husoma ili msikilizaji aelewe kila neno.', 'Kasi ifaayo na sauti ipasavyo si ya kupindukia.') }),
  // ---- KAMUSI
  ...trio('kamusi', C_KAM, KAMUSI, { stem: 'Chagua neno sahihi.', gapStem: 'Andika neno sahihi:', oc: ['a', 'b', 'a'], thinOk: true, topic: 'kuhusu mpangilio wa maneno kwenye kamusi', hints: H('Kamusi hupanga maneno kwa mpangilio wa alfabeti.', 'Herufi za kwanza zikifanana, tazama herufi ya pili, kisha ya tatu.') }),
];
