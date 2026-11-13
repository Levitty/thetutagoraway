// ============================================================================
// KISWAHILI GRADE 7: VIFUNGU VYA ASILI NA MATINI YA KUSIKILIZA kwa familia za ufahamu. Imeandikwa na Claude (13 Nov 2026), haikunakiliwa
// wala kubadilishwa kutoka kitabu, hadithi au wimbo wowote uliochapishwa. Majina na mahali vya Kenya. Sentensi fupi kwa mwanafunzi wa
// Darasa la Saba. Kila kifungu cha nathari kina aina saba za maswali, mawili kila aina: fact, order, predict, infer, ctx, summary, main.
// Safu ni [swali, jibu sahihi, kosa (jambo dogo), kosa (kinyume), kosa (halimo kwenye kifungu)]; makosa matatu hufuata mpangilio huo ili
// misimbo _DETAIL, _OPPOSITE na _NOTSAID ilingane. DRAFT: mwalimu wa Kiswahili mzawa ahakiki kila kifungu kabla mtoto yeyote hakijamfikia.
// ============================================================================
export const PASSAGES = [
  {
    id: 'shule-mpya', title: 'Siku ya Kwanza Shuleni', kind: 'simulizi',
    text: 'Amina alihamia Mombasa kutoka kijijini. Asubuhi ya Jumatatu, alivaa sare mpya na kutembea hadi shule mpya. Moyo wake ulipiga kwa kasi kwa sababu hakumjua mtu yeyote.\n\nDarasani, mwalimu alimwonyesha dawati karibu na dirisha. Msichana mmoja aitwaye Zawadi alimtabasamia na kusema, "Karibu! Mimi ni Zawadi. Tukae pamoja." Amina alihisi hofu yake ikipungua.\n\nWakati wa mapumziko, Zawadi alimwonyesha uwanja na maktaba. Jioni, Amina alirudi nyumbani akiwa na furaha. Alimwambia mama yake, "Nimepata rafiki mpya."',
    q: {
      fact: [
        ['Amina alihamia mji gani?', 'Mombasa', 'Kisumu', 'Nairobi', 'Nakuru'],
        ['Amina alikaa wapi darasani?', 'karibu na dirisha', 'karibu na mlango', 'nyuma ya darasa', 'mbele ya mwalimu'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Amina alitembea hadi shule mpya.', 'Zawadi alimwonyesha maktaba.', 'Amina alimwambia mama yake habari.', 'Mwalimu alimwonyesha dawati.'],
        ['Tukio gani lilitokea mwisho?', 'Amina alimwambia mama yake kuwa amepata rafiki.', 'Amina alivaa sare mpya.', 'Zawadi alimtabasamia Amina.', 'Amina alimwonyesha mama yake dawati jipya la shule.'],
      ],
      predict: [
        ['Amina na Zawadi wataendeleaje, kwa kuzingatia kifungu?', 'Wataendelea kuwa marafiki.', 'Watagombana kesho.', 'Zawadi atahamia mji mwingine.', 'Amina atarudi kijijini.'],
        ['Amina atahisije kuhusu shule siku zijazo?', 'Atapenda shule yake mpya.', 'Ataogopa shule daima.', 'Atachukia mwalimu wake.', 'Atakataa kwenda shule.'],
      ],
      infer: [
        ['Kwa nini moyo wa Amina ulipiga kwa kasi asubuhi?', 'Hakumjua mtu yeyote shuleni.', 'Alikuwa amechelewa basi.', 'Alikuwa na njaa kali.', 'Alikuwa amepoteza kitabu.'],
        ['Zawadi ni mtu wa aina gani?', 'mkarimu na mwenye urafiki', 'mkali na mwenye hasira', 'mvivu na mwenye kiburi', 'mwoga na mnyamavu'],
      ],
      ctx: [
        ['Neno "mapumziko" katika kifungu lina maana gani?', 'wakati wa kupumzika kati ya masomo', 'wakati wa kufanya mtihani', 'wakati wa kuimba wimbo', 'wakati wa kufanya mtihani wa mwisho wa muhula'],
        ['Neno "dawati" katika kifungu lina maana gani?', 'meza na kiti anachotumia mwanafunzi darasani', 'kitabu cha hadithi', 'kiatu cha shule', 'mfuko mkubwa wa kubebea vitabu na madaftari'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Amina alihamia shule mpya.', 'Amina alisafiri hadi Mombasa kwa basi.', 'Amina alikataa kwenda shuleni.', 'Zawadi aliondoka shuleni.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Zawadi alimkaribisha Amina na wakawa marafiki.', 'Amina alivaa sare mpya.', 'Dawati lilikuwa karibu na dirisha.', 'Zawadi alimwonyesha Amina nyumba yao mpya mjini.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'msichana mpya anayepata rafiki katika shule mpya', 'sare za shule za Mombasa', 'maktaba ya shule', 'mwalimu mkuu anayehamia mji mwingine wa mbali'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Rafiki Mpya wa Amina', 'Sare Mpya ya Zawadi', 'Maktaba ya Mombasa', 'Basi la Jioni'],
      ],
    },
  },
  {
    id: 'miti', title: 'Bi Wanjiru na Miti Yake', kind: 'simulizi',
    text: 'Bi Wanjiru alipanda mti mmoja kila Jumamosi karibu na kijiji chake. Watu walicheka. "Miti hii itakua lini?" walisema. Bi Wanjiru alitabasamu tu na kuendelea kupanda.\n\nMiaka mitano baadaye, mvua kubwa ilipiga kijiji. Mashamba mengi yalisombwa na maji, lakini mashamba karibu na miti ya Bi Wanjiru yalibaki salama. Mizizi ya miti ilishikilia udongo.\n\nSasa watu hao walikuja kumshukuru. Walimwomba awafundishe kupanda miti. Bi Wanjiru alifurahi, na Jumamosi iliyofuata kijiji kizima kilipanda miti pamoja.',
    q: {
      fact: [
        ['Bi Wanjiru alipanda mti mmoja siku gani?', 'kila Jumamosi', 'kila Jumatatu', 'kila Ijumaa', 'kila Jumapili'],
        ['Baada ya miaka mingapi mvua kubwa ilipiga kijiji?', 'miaka mitano', 'mwaka mmoja', 'miaka kumi', 'miezi miwili'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Watu walicheka Bi Wanjiru alipopanda miti.', 'Mvua kubwa ilipiga kijiji.', 'Watu walimshukuru Bi Wanjiru.', 'Bi Wanjiru alinunua miche mingi sokoni mjini.'],
        ['Tukio gani lilitokea mwisho?', 'Kijiji kizima kilipanda miti pamoja.', 'Mashamba mengi yalisombwa na maji.', 'Bi Wanjiru alipanda mti wa kwanza.', 'Watu walimwomba awafundishe.'],
      ],
      predict: [
        ['Miaka ijayo kijiji kitakuwaje, kwa kuzingatia kifungu?', 'Kitakuwa na miti mingi na udongo salama.', 'Kitakuwa kimekauka kabisa.', 'Kitakuwa bila mvua kamwe.', 'Kitakuwa kimekauka kabisa kwa sababu ya jua kali.'],
        ['Bi Wanjiru ataendelea kufanya nini?', 'Ataendelea kupanda miti na kufundisha wengine.', 'Ataacha kupanda miti.', 'Atahamia mji mwingine.', 'Atahamia mji mwingine na kuacha miti yake yote.'],
      ],
      infer: [
        ['Kwa nini mashamba karibu na miti yalibaki salama?', 'Mizizi ya miti ilishikilia udongo.', 'Miti ilizuia mvua kunyesha.', 'Mashamba yalikuwa makubwa zaidi.', 'Mto ulikuwa mbali.'],
        ['Bi Wanjiru alikuwa mtu wa aina gani?', 'mvumilivu na mwenye maono', 'mwepesi wa hasira', 'mvivu na mwenye hila', 'mwoga na mnyonge'],
      ],
      ctx: [
        ['Neno "kusombwa" katika kifungu lina maana gani?', 'kuchukuliwa na maji', 'kukaushwa na jua', 'kupandwa na watu', 'kuliwa na wanyama'],
        ['Neno "mizizi" katika kifungu lina maana gani?', 'sehemu za mti zilizo chini ya udongo', 'majani ya mti', 'matunda ya mti', 'majani ya mti yanayoning\'inia juu ya matawi'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Bi Wanjiru alipanda miti ingawa watu walicheka.', 'Bi Wanjiru alikata miti yake yote.', 'Mvua ilipiga kijiji mwaka mmoja baada ya miti kupandwa.', 'Watu walicheka na Bi Wanjiru akaacha.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Miti ya Bi Wanjiru ilikinga mashamba mvua ilipopiga.', 'Watu walicheka.', 'Alipanda mti kila Jumamosi.', 'Bi Wanjiru alipanda miti mingi kando ya shule yake.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'mwanamke anayepanda miti na kuokoa mashamba ya kijiji', 'mvua kubwa ya kijiji', 'watu wanaocheka', 'mkulima anayeuza mahindi mengi sokoni kila wiki'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Miti Iliyokinga Kijiji', 'Mvua ya Jumamosi', 'Watu Wanaocheka', 'Mashamba ya Mbali'],
      ],
    },
  },
  {
    id: 'gazeti', title: 'Faida za Kusoma Gazeti', kind: 'ufahamu',
    text: 'Gazeti ni chanzo kizuri cha habari. Kwa kusoma gazeti kila siku, mwanafunzi hupata habari za nchi na dunia. Pia hujifunza maneno mapya, kwa sababu waandishi hutumia lugha nzuri.\n\nGazeti husaidia pia kuboresha uandishi. Mwanafunzi anayesoma makala hujifunza jinsi ya kupanga mawazo kwa mpangilio. Zaidi ya hayo, magazeti mengi yana ukurasa wa watoto wenye hadithi na vitendawili.\n\nHata hivyo, gazeti linaweza kuwa ghali. Kwa hiyo, wanafunzi wanaweza kusoma gazeti la maktaba ya shule au kushirikiana na marafiki.',
    q: {
      fact: [
        ['Gazeti husaidia mwanafunzi kupata nini?', 'habari za nchi na dunia', 'chakula cha mchana', 'sare za shule', 'pesa za ada'],
        ['Magazeti mengi yana ukurasa wa nani?', 'watoto', 'wazee', 'wakulima', 'walimu'],
      ],
      order: [
        ['Mada gani ilijadiliwa kwanza kifunguni?', 'gazeti ni chanzo cha habari', 'gazeti linaweza kuwa ghali', 'gazeti la maktaba', 'ukurasa wa watoto'],
        ['Mada gani ilijadiliwa mwisho?', 'jinsi ya kukabili gharama ya gazeti', 'faida ya kupata habari', 'faida ya maneno mapya', 'faida ya kusoma habari za nchi na dunia'],
      ],
      predict: [
        ['Mwanafunzi atakayesoma gazeti kila siku atakuwaje?', 'Atajua habari nyingi na maneno mapya.', 'Atasahau maneno yote.', 'Atachukia shule.', 'Atasahau maneno yote aliyojifunza darasani.'],
        ['Mwandishi angeshauri nini baadaye?', 'kusoma gazeti la maktaba', 'kuacha kusoma kabisa', 'kuuza magazeti yote', 'kuchoma magazeti'],
      ],
      infer: [
        ['Kwa nini wanafunzi hujifunza maneno mapya kwenye gazeti?', 'Waandishi hutumia lugha nzuri.', 'Gazeti halina maneno.', 'Gazeti lina picha tu.', 'Waandishi hawaandiki vizuri.'],
        ['Mwandishi wa kifungu ana maoni gani kuhusu kusoma gazeti?', 'Anaona kuwa kusoma gazeti kuna faida nyingi.', 'Anaona kuwa kunapoteza wakati.', 'Anaona kuwa ni hatari.', 'Anaona kuwa gazeti ni la wazee na wafanyabiashara tu.'],
      ],
      ctx: [
        ['Neno "ghali" katika kifungu lina maana gani?', 'lenye bei kubwa', 'lenye bei ndogo', 'lenye rangi nzuri', 'lenye maneno mengi'],
        ['Neno "makala" katika kifungu lina maana gani?', 'maandishi marefu ya gazeti kuhusu mada fulani', 'picha ndogo ya gazeti', 'tangazo la bidhaa', 'picha ndogo ya gazeti yenye maelezo mafupi tu'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Kusoma gazeti hutupa habari.', 'Gazeti ni ghali sana kwa hiyo hatuwezi kulisoma.', 'Gazeti lina picha tu.', 'Watoto hawapaswi kusoma gazeti.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Kusoma gazeti hutoa habari.', 'Gazeti lina vitendawili.', 'Gazeti ni la maktaba.', 'Waandishi ni wengi.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'faida za kusoma gazeti kila siku', 'bei za magazeti', 'ukurasa wa watoto', 'bei za magazeti yote yanayouzwa mijini'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Kwa Nini Tusome Gazeti', 'Gharama za Maktaba', 'Vitendawili vya Gazeti', 'Waandishi wa Habari'],
      ],
    },
  },
  {
    id: 'mazingira', title: 'Tutunze Mazingira ya Shule', kind: 'kushawishi',
    text: 'Wanafunzi wenzangu, mazingira ya shule yetu ni urithi wetu sote. Tukiyatunza, tutapata hewa safi, kivuli na mahali pazuri pa kusomea.\n\nKwanza, tuache kutupa taka ovyo. Kila mmoja atumie pipa la taka. Pili, tupande maua na miti kando ya madarasa. Tatu, tuzime mabomba ya maji tunapomaliza kuyatumia, kwa sababu maji ni muhimu.\n\nNinawasihi mkubali kuanza leo. Tukishirikiana, shule yetu itakuwa kioo cha mazingira bora kwa vijiji vyote vilivyo karibu.',
    q: {
      fact: [
        ['Mwandishi anasema tupande nini kando ya madarasa?', 'maua na miti', 'mahindi', 'viazi', 'mboga'],
        ['Mwandishi anataka wanafunzi watumie nini kutupa taka?', 'pipa la taka', 'mfuko wa plastiki', 'shimo la barabarani', 'mto wa karibu'],
      ],
      order: [
        ['Ushauri gani ulitolewa kwanza?', 'kuacha kutupa taka ovyo', 'kupanda maua na miti', 'kuzima mabomba', 'kuanza leo'],
        ['Ushauri gani ulitolewa mwisho?', 'kuanza leo na kushirikiana', 'kuacha kutupa taka', 'kupanda maua', 'kupanda maua na miti kando ya madarasa'],
      ],
      predict: [
        ['Shule ikifuata ushauri huu, itakuwaje?', 'Itakuwa safi na yenye kivuli.', 'Itakuwa chafu zaidi.', 'Itafungwa.', 'Itakuwa chafu zaidi na bila miti.'],
        ['Wanafunzi wengi wakikubali, nini kitatokea?', 'Mazingira yatakuwa bora.', 'Taka zitaongezeka.', 'Maji yatapotea.', 'Miti itakatwa.'],
      ],
      infer: [
        ['Kwa nini mwandishi anasema kuzima mabomba?', 'Maji ni muhimu na yasipotee bure.', 'Mabomba ni ghali.', 'Mabomba ni ya zamani.', 'Mabomba ni ghali sana na ya zamani.'],
        ['Mwandishi anataka wanafunzi wahisi nini?', 'wajibu wa kutunza mazingira', 'hofu ya kuadhibiwa', 'chuki kwa shule', 'hofu ya kuadhibiwa na walimu wakuu'],
      ],
      ctx: [
        ['Neno "urithi" katika kifungu lina maana gani?', 'kitu tunachopokea na kutunza kwa ajili ya wengine', 'kitu tunachotupa', 'kitu tunachouza', 'kitu tunachotupa baada ya kukitumia kwa muda'],
        ['Neno "nawasihi" katika kifungu lina maana gani?', 'ninawaomba kwa upole', 'ninawaamuru kwa hasira', 'ninawaonya kwa kelele', 'ninawacheka'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Mwandishi anawasihi wanafunzi watunze mazingira kwa kutotupa taka, kupanda miti na kuzima mabomba.', 'Mwandishi anataka shule ifungwe.', 'Mwandishi anasema maji ni ghali.', 'Mwandishi anawaambia wanafunzi wasipande miti kwa sababu miti huleta wadudu na taka nyingi shuleni.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Wanafunzi wanapaswa kutunza mazingira ya shule.', 'Pipa la taka ni jekundu.', 'Mabomba ni mengi.', 'Wanafunzi wanapaswa kujenga madarasa mapya kila mwaka.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'kuwashawishi wanafunzi kutunza mazingira ya shule', 'ujenzi wa madarasa', 'bei ya maji', 'kueleza jinsi ya kujenga madarasa mapya ya shule'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Shule Safi, Mazingira Bora', 'Madarasa Mapya', 'Maji ya Mto', 'Madarasa Mapya ya Shule Yetu'],
      ],
    },
  },
  {
    id: 'simu', title: 'Simu Shuleni: Ndiyo au Hapana?', kind: 'mjadala',
    text: 'Wazazi wengi wanasema kuwa mwanafunzi anapaswa kubeba simu shuleni. Wanaamini kuwa simu humsaidia mtoto kuwajulisha wazazi iwapo basi limechelewa. Hili ni jambo la usalama.\n\nWalimu, kwa upande wao, wanasema kuwa simu huvuruga masomo. Mwanafunzi anaweza kutuma ujumbe badala ya kumsikiliza mwalimu. Zaidi ya hayo, simu inaweza kupotea au kuibwa.\n\nKwa maoni yangu, shule iweke utaratibu wa kati. Wanafunzi wakabidhi simu langoni asubuhi na wazichukue jioni. Kwa njia hiyo, usalama utadumishwa na masomo hayatavurugwa.',
    q: {
      fact: [
        ['Wazazi wanasema simu husaidia nini?', 'kuwajulisha wazazi basi likichelewa', 'kucheza michezo', 'kuuza vitu', 'kucheza michezo ya kompyuta darasani'],
        ['Walimu wanasema simu hufanya nini kwenye masomo?', 'huvuruga masomo', 'husaidia masomo', 'hufupisha masomo', 'hufundisha maneno'],
      ],
      order: [
        ['Maoni gani yalitajwa kwanza?', 'maoni ya wazazi', 'maoni ya mwandishi', 'wazo la kukabidhi simu langoni', 'hatari ya simu kuibwa'],
        ['Jambo gani lilitajwa mwisho?', 'pendekezo la mwandishi la utaratibu wa kati', 'maoni ya wazazi', 'maoni ya walimu', 'hatari ya simu kupotea na kuibwa njiani kwenda shuleni'],
      ],
      predict: [
        ['Mwandishi angeendelea kueleza nini?', 'jinsi simu zingekusanywa na kurudishwa kwa usalama', 'kwa nini simu zipigwe marufuku milele', 'jinsi simu zingeuzwa', 'kwa nini simu zipigwe marufuku milele shuleni'],
        ['Wazazi wengi watajibuje pendekezo la kati?', 'Wanaweza kukubali kwa sababu watoto wao watakuwa salama.', 'Watakataa kila sheria.', 'Wataondoka mjini.', 'Watakataa kila utaratibu na kuondoka mjini kabisa.'],
      ],
      infer: [
        ['Mwandishi anaonaje pande mbili?', 'Anaona kuwa kila upande una hoja nzuri.', 'Anaona kuwa wazazi pekee wako sahihi.', 'Anaona kuwa walimu pekee wako sahihi.', 'Anaona kuwa hakuna upande wenye maana.'],
        ['Kwa nini mwandishi anapendekeza simu zikabidhiwe langoni?', 'Zinaweza kuhifadhiwa salama na masomo hayatavurugwa.', 'Lango huwa na shughuli nyingi.', 'Ni adhabu kwa wanafunzi wote.', 'Lango huwa na shughuli nyingi sana kila asubuhi mapema.'],
      ],
      ctx: [
        ['Neno "kuvuruga" katika kifungu lina maana gani?', 'kuharibu utulivu', 'kusaidia kuendelea', 'kununua na kuuza', 'kuhifadhi na kulinda'],
        ['Maneno "utaratibu wa kati" yana maana gani?', 'mpango unaowapa kila upande sehemu ya kile unachotaka', 'barabara ya kati ya mji', 'mpango unaopuuza pande zote', 'adhabu inayotolewa kwa wanafunzi wote shuleni'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Wazazi wanataka simu kwa usalama na walimu wanasema zinavuruga masomo, kwa hiyo mwandishi anapendekeza simu zikabidhiwe langoni.', 'Wazazi na walimu wanakubaliana simu zipigwe marufuku.', 'Mwandishi anasema simu ziuzwe shuleni.', 'Wazazi na walimu wote wanakubaliana kuwa simu ziuzwe shuleni ili shule ipate pesa nyingi na kujenga madarasa mapya mwaka ujao.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Mwandishi anapendekeza simu zikabidhiwe langoni.', 'Simu inaweza kupotea.', 'Basi linaweza kuchelewa.', 'Mwandishi anasema wazazi wote wanapaswa kununua simu mpya.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'mjadala kuhusu wanafunzi kubeba simu shuleni', 'bei ya simu', 'ratiba ya mabasi', 'ratiba ya mabasi ya shule ya kila siku mjini'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Njia ya Kati kuhusu Simu Shuleni', 'Bei ya Simu Sokoni', 'Walimu Waondoka Shuleni', 'Walimu Wanaondoka Shuleni Mapema'],
      ],
    },
  },
];

// MATINI YA KUSIKILIZA: husomwa kwa sauti na mwalimu au mkufunzi wa sauti; mtoto HAONI maandishi. Kila familia kwenye haya inahitaji sauti
// (needsAudio: true). Aina za maswali, mawili kila aina: main, detail, ctx. DRAFT: mwalimu wa Kiswahili mzawa ahakiki kila matini.
export const LISTENS = [
  {
    id: 'tangazo', title: 'Tangazo la Shule', kind: 'kusikiliza',
    script: 'Sikilizeni tangazo hili. Siku ya michezo haitakuwa Ijumaa kama ilivyopangwa. Uwanja bado una maji kwa sababu ya mvua, na si salama kukimbia humo. Siku ya michezo itakuwa Jumatatu. Kila mwanafunzi alete chupa ya maji na avae viatu vya michezo. Wazazi wanakaribishwa kuja kushangilia. Michezo itaanza saa tatu asubuhi na kuisha saa sita mchana. Mwalimu Mwanaisha atatoa zawadi. Asanteni kwa kusikiliza.',
    q: {
      main: [
        ['Tangazo linahusu nini hasa?', 'siku ya michezo imehamishwa hadi Jumatatu', 'uwanja mpya wa shule', 'zawadi za bure', 'uwanja mpya wa shule umejengwa kwa pesa nyingi'],
        ['Ni kichwa kipi kinafaa zaidi tangazo?', 'Siku ya Michezo Yahamishiwa Jumatatu', 'Viatu Vipya vya Shule', 'Mvua Juu ya Paa', 'Viatu Vipya vya Michezo vya Shule'],
      ],
      detail: [
        ['Michezo itaanza saa ngapi?', 'saa tatu asubuhi', 'saa mbili asubuhi', 'saa sita mchana', 'saa nane mchana'],
        ['Nani atatoa zawadi?', 'Mwalimu Mwanaisha', 'mwalimu mkuu', 'mzazi mmoja', 'dereva wa shule'],
      ],
      ctx: [
        ['Neno "zawadi" katika tangazo lina maana gani?', 'kitu anachopewa mshindi', 'kitu anachonunua mzazi', 'kiatu cha michezo', 'chupa ya maji'],
        ['Neno "kushangilia" katika tangazo lina maana gani?', 'kupiga kelele za furaha kuunga mkono', 'kuondoka uwanjani', 'kukimbia mbio', 'kuondoka uwanjani kabla michezo kuanza'],
      ],
    },
  },
  {
    id: 'mvua', title: 'Habari za Mvua', kind: 'kusikiliza',
    script: 'Sikilizeni habari hii fupi. Mvua kubwa imenyesha usiku wa kuamkia leo katika kaunti ya Machakos. Mto Athi umefurika na barabara moja imefungwa kwa muda. Wakazi wameshauriwa wasivuke maji yanayotiririka, kwa sababu ni hatari. Watoto wanaoishi karibu na mto wataendelea na masomo shuleni, lakini watachelewa kidogo. Idara ya hali ya hewa inasema mvua itapungua kesho jioni. Tutawaletea habari zaidi baadaye.',
    q: {
      main: [
        ['Habari inahusu nini hasa?', 'mvua kubwa iliyosababisha mto kufurika Machakos', 'safari ya watoto kwenda sokoni', 'ujenzi wa daraja jipya', 'safari ya watoto wanaokwenda sokoni kila siku'],
        ['Ni kichwa kipi kinafaa zaidi habari?', 'Mto Wafurika Baada ya Mvua', 'Daraja Jipya la Athi', 'Watoto Wapata Likizo', 'Daraja Jipya Juu ya Mto Athi'],
      ],
      detail: [
        ['Mto gani umefurika?', 'Mto Athi', 'Mto Tana', 'Mto Nzoia', 'Mto Galana'],
        ['Mvua itapungua lini, kulingana na idara ya hali ya hewa?', 'kesho jioni', 'leo usiku', 'wiki ijayo', 'mwezi ujao'],
      ],
      ctx: [
        ['Neno "kufurika" katika habari lina maana gani?', 'maji kujaa na kuvuka kingo', 'maji kukauka', 'maji kuwa baridi', 'maji kukauka kabisa wakati wa kiangazi'],
        ['Neno "wakazi" katika habari lina maana gani?', 'watu wanaoishi mahali', 'watu wanaosafiri tu', 'wanyama wa mto', 'wafanyabiashara wa soko'],
      ],
    },
  },
  {
    id: 'soko', title: 'Mjadala kuhusu Soko', kind: 'kusikiliza',
    script: 'Jioni njema. Leo tunajadili iwapo tuendelee kutumia soko la zamani au tujenge jipya. Wanaotaka soko la zamani wanasema liko karibu na kituo cha mabasi na wafanyabiashara wamefanya kazi hapo kwa miaka mingi. Hata hivyo, wengine wanasema soko hilo ni dogo na halina vyoo safi. Soko jipya lingekuwa na njia pana, paa na maji safi. Wafanyabiashara wengine wanaogopa kupoteza wateja huko. Mwenyekiti anapendekeza suluhisho la kati: kujenga soko jipya karibu na la zamani, na wafanyabiashara wahamie kwa awamu. Tutapiga kura mwishoni mwa mwezi.',
    q: {
      main: [
        ['Mjadala unahusu nini hasa?', 'kama kuendelea na soko la zamani au kujenga jipya karibu nalo', 'bei ya mboga sokoni', 'ratiba ya mabasi', 'bei za mboga na matunda zinazouzwa sokoni kila asubuhi mapema'],
        ['Ni kichwa kipi kinafaa zaidi mjadala?', 'Soko la Zamani au Jipya?', 'Hospitali Mpya Mjini', 'Safari ya Mwenyekiti', 'Paa la Kituo cha Mabasi'],
      ],
      detail: [
        ['Kura itapigwa lini?', 'mwishoni mwa mwezi', 'kesho', 'mwaka ujao', 'leo usiku'],
        ['Soko jipya lingekuwa na nini?', 'njia pana, paa na maji safi', 'kituo cha mabasi', 'shule', 'kituo cha mabasi na hospitali mpya'],
      ],
      ctx: [
        ['Neno "suluhisho" katika mjadala lina maana gani?', 'njia ya kutatua tatizo', 'ugomvi mkubwa', 'aina ya soko', 'kura ya upande mmoja'],
        ['Maneno "kwa awamu" yana maana gani?', 'kidogo kidogo kwa hatua', 'wote kwa mara moja', 'kamwe', 'usiku tu'],
      ],
    },
  },
];
