// ============================================================================
// KISWAHILI GRADE 8: VIFUNGU VYA ASILI NA MATINI YA KUSIKILIZA kwa familia za ufahamu. Imeandikwa na Claude (14 Nov 2026), haikunakiliwa
// wala kubadilishwa kutoka kitabu, hadithi au wimbo wowote uliochapishwa. Majina na mahali vya Kenya. Kwa mwanafunzi wa Darasa la Nane.
// Kila kifungu cha nathari kina aina saba za maswali, mawili kila aina: fact, order, predict, infer, ctx, summary, main.
// Safu ni [swali, jibu sahihi, kosa (jambo dogo), kosa (kinyume), kosa (halimo kwenye kifungu)]; makosa matatu hufuata mpangilio huo ili
// misimbo _DETAIL, _OPPOSITE na _NOTSAID ilingane. DRAFT: mwalimu wa Kiswahili mzawa ahakiki kila kifungu kabla mtoto yeyote hakijamfikia.
// ============================================================================
export const PASSAGES = [
  {
    id: 'kituo', title: 'Kituo Safi cha Kitale', kind: 'simulizi',
    text: 'Klabu ya Mazingira ya Shule ya Msingi Kitale iliamua kusafisha kituo cha basi kilichokuwa karibu na shule. Jumamosi asubuhi, wanafunzi ishirini walifika wakiwa na mifagio, glovu na magunia. Mwalimu Otieno aliwagawia kazi: wengine wakokote takataka, wengine wafagie.\n\nBaada ya saa mbili, kituo kilikuwa safi. Wasafiri walipita na kuwapongeza wanafunzi. Mama mmoja muuza chai aliwapa chai ya bure kama shukrani.\n\nWiki iliyofuata, wanafunzi walishangaa kuona kituo kikiwa kichafu tena. Walikaa chini na kujadili. Waliamua kuweka mapipa matatu ya takataka na kuandika kibao: "Tupa taka hapa." Kuanzia siku hiyo, kituo kilibaki safi.',
    q: {
      fact: [
        ['Wanafunzi wangapi walifika kusafisha kituo?', 'ishirini', 'kumi na mmoja', 'thelathini', 'arobaini'],
        ['Nani aliwapa wanafunzi chai ya bure?', 'mama muuza chai', 'Mwalimu Otieno', 'mwalimu mkuu', 'dereva wa basi'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Mwalimu Otieno aligawa kazi.', 'Mama alitoa chai ya bure kituoni.', 'Mapipa matatu yaliwekwa kituoni.', 'Wanafunzi walihamia shule nyingine.'],
        ['Tukio gani lilitokea mwisho?', 'Wanafunzi waliandika kibao cha kutupa taka.', 'Wanafunzi walifagia kituo kwa mifagio.', 'Kituo kilikuwa kichafu kwa mara ya pili.', 'Wanafunzi walisafiri hadi mji wa Eldoret.'],
      ],
      predict: [
        ['Kwa kuzingatia kifungu, kituo kitakuwaje baadaye?', 'Kitaendelea kuwa safi.', 'Kitakuwa kichafu zaidi.', 'Kitafungwa na serikali.', 'Kitahamishwa mjini.'],
        ['Wanafunzi wakiona taka tena, watafanya nini?', 'Watazikusanya na kuzitupa mapipani.', 'Watazitupa barabarani kando ya kituo.', 'Watamwomba dereva azibebe kwenda mbali.', 'Watazichoma moto kando ya shule yote.'],
      ],
      infer: [
        ['Kwa nini wanafunzi walishangaa wiki iliyofuata?', 'Kituo kilikuwa kichafu tena.', 'Mama hakuwapa chai tena.', 'Mvua ilikuwa imenyesha usiku.', 'Walimu walikuwa wameondoka mapema.'],
        ['Mama muuza chai alionyesha nini kwa kuwapa chai?', 'shukrani kwa kazi yao', 'hasira kwa wasafiri', 'hofu ya mwalimu', 'pupa ya kupata pesa'],
      ],
      ctx: [
        ['Neno "kuwapongeza" katika kifungu lina maana gani?', 'kusema umefurahia jambo jema', 'kulalamika kuhusu jambo baya', 'kuuliza swali gumu sana', 'kuomba msaada kwa watu wengi'],
        ['Neno "kokota" katika kifungu lina maana gani?', 'kuvuta kitu chini kwa nguvu', 'kutupa kitu juu angani', 'kuficha kitu ndani ya sanduku', 'kufagia sakafu kwa ufagio'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Wanafunzi walisafisha kituo na kuweka mapipa.', 'Mama muuza chai aliwapa wanafunzi chai.', 'Wanafunzi walichafua kituo kwa makusudi.', 'Wanafunzi walinunua mapipa na kuyauza.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Mapipa yalifanya kituo kibaki safi.', 'Wanafunzi walivaa glovu kwa kazi hiyo.', 'Kituo kilikuwa kichafu kabisa daima.', 'Mwalimu aliwaadhibu wanafunzi wavivu.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'wanafunzi wanaosafisha kituo cha basi', 'mama anayeuza chai kando ya kituo', 'madereva wanaochelewa kufika kituoni', 'walimu wanaopanga ratiba mpya ya shule'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Wanafunzi na Kituo Safi', 'Chai ya Mama Muuza', 'Basi la Asubuhi', 'Mapipa ya Zamani'],
      ],
    },
  },
  {
    id: 'dawa', title: 'Dozi ya Mwisho', kind: 'ufahamu',
    text: 'Mtoto wa Bi Achieng, Brian, alikuwa na homa na kikohozi. Daktari wa zahanati ya Kisumu alimwandikia dawa ya siku tano na kusema, "Meza dawa hii mara mbili kila siku, hata ukijisikia vizuri."\n\nSiku ya tatu, Brian alijisikia mzima kabisa. Alimwambia mama yake, "Sihitaji dawa tena." Bi Achieng alikumbuka maneno ya daktari na akamsihi Brian amalize dozi. Brian alikubali, ingawa alikuwa amechoka kunywa dawa chungu.\n\nSiku ya sita, Brian alicheza mpira na marafiki bila kukohoa. Daktari alipomwona wiki iliyofuata, alisema, "Umefanya vizuri kumaliza dawa. Dawa isiyomalizwa huacha vijidudu hai, na ugonjwa hurudi ukiwa mkali zaidi."',
    q: {
      fact: [
        ['Daktari alimwandikia Brian dawa ya siku ngapi?', 'siku tano', 'siku saba', 'siku tatu', 'siku kumi'],
        ['Brian alimeza dawa mara ngapi kwa siku?', 'mara mbili', 'mara moja', 'mara tatu', 'mara nne'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Daktari alimwandikia Brian dawa.', 'Brian alicheza mpira na marafiki.', 'Brian alisema hahitaji dawa tena.', 'Bi Achieng alinunua dawa nyingine.'],
        ['Tukio gani lilitokea mwisho?', 'Daktari alimsifu Brian kwa kumaliza dawa.', 'Brian alijisikia mzima kabisa nyumbani.', 'Bi Achieng alimsihi Brian amalize dozi.', 'Brian alihamia zahanati nyingine mjini.'],
      ],
      predict: [
        ['Brian akiacha dawa mapema siku nyingine, nini kitatokea?', 'Ugonjwa unaweza kurudi ukiwa mkali.', 'Ugonjwa utaisha na kutorudi kamwe.', 'Atakuwa na nguvu kuliko wenzake.', 'Daktari atampa dawa tamu zaidi.'],
        ['Brian atamshauri nani kuhusu dawa baadaye?', 'Atawashauri marafiki wamalize dozi.', 'Atawashauri marafiki waache dawa mapema.', 'Atawashauri marafiki wasiende zahanati.', 'Atawashauri marafiki wanunue dawa kila siku.'],
      ],
      infer: [
        ['Kwa nini Bi Achieng alimsihi Brian amalize dozi?', 'Alikumbuka maneno ya daktari.', 'Dawa ilikuwa ya bei rahisi.', 'Brian alikuwa na homa kali.', 'Zahanati ilikuwa karibu na nyumbani.'],
        ['Brian alikuwa mtoto wa aina gani mwishoni?', 'msikivu anayekubali ushauri mzuri', 'mkaidi anayekataa ushauri wote', 'mvivu asiyetaka kucheza mpira', 'mwoga asiyependa kwenda zahanati'],
      ],
      ctx: [
        ['Neno "dozi" katika kifungu lina maana gani?', 'kiasi cha dawa anachomeza mgonjwa', 'jina la zahanati ya mjini', 'chakula cha mgonjwa wa homa', 'chupa ya kuhifadhia maji safi'],
        ['Neno "kumsihi" katika kifungu lina maana gani?', 'kumwomba kwa upole na uzito', 'kumpiga kwa hasira nyingi', 'kumpa zawadi ya mapema', 'kumwacha peke yake nyumbani'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Brian alimaliza dozi ya dawa ingawa alipona.', 'Brian alicheza mpira siku ya sita.', 'Brian aliacha dawa siku ya tatu.', 'Brian alihamia mji mwingine ili apate matibabu.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Dawa inapaswa kumalizwa kama daktari alivyosema.', 'Dawa ya Brian ilikuwa chungu sana.', 'Dawa inaweza kuachwa ukipona mapema.', 'Dawa zote zinauzwa sokoni kwa bei nafuu sana.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'umuhimu wa kumaliza dawa aliyoandikiwa mgonjwa', 'mchezo wa mpira kati ya shule mbili', 'safari ya Brian kwenda mji wa Kisumu', 'bei ya dawa katika zahanati za mjini Kisumu'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Maliza Dawa Yako', 'Mpira wa Brian', 'Zahanati Mpya', 'Homa ya Mjini'],
      ],
    },
  },
  {
    id: 'akiba', title: 'Akiba: Nyumbani au Benki?', kind: 'mjadala',
    text: 'Wanafunzi wa Darasa la Nane walijadili mahali pazuri pa kuweka akiba. Mwajuma alisema, "Nyumbani ni pazuri. Ninaweza kuchukua pesa wakati wowote nikizihitaji." Kamau hakukubali. "Pesa za nyumbani zinaweza kuibwa au kuteketea moto," alisema. "Benki huzilinda."\n\nAtieno aliongeza hoja nyingine. "Benki hutoa riba, yaani pesa ndogo za ziada kila mwaka. Pesa za kibubu hazizaliani." Mwajuma alijibu, "Lakini benki hutoza ada ya kila mwezi, na kituo cha benki kiko mbali na kijiji chetu."\n\nMwalimu aliwaambia, "Kila njia ina faida na hasara. Chagua kulingana na umbali, usalama na kiasi cha pesa ulicho nacho." Mwishowe, darasa lilikubali kuwa akiba ndogo ya kila siku ni bora kuliko kutokuweka kabisa.',
    q: {
      fact: [
        ['Nani alisema pesa za nyumbani zinaweza kuibwa?', 'Kamau', 'Mwajuma', 'Atieno', 'mwalimu'],
        ['Riba ni nini kulingana na Atieno?', 'pesa ndogo za ziada kila mwaka', 'ada ya kila mwezi ya benki', 'kibubu cha kuhifadhia sarafu', 'pesa za kununulia vitabu'],
      ],
      order: [
        ['Nani alitoa hoja kwanza katika mjadala?', 'Mwajuma', 'Kamau', 'Atieno', 'mwalimu'],
        ['Tukio gani lilitokea mwisho katika kifungu?', 'Darasa lilikubali kuwa akiba ndogo ni bora.', 'Atieno alieleza kuhusu riba ya benki.', 'Mwajuma alisema nyumbani ni pazuri.', 'Mwalimu alikataza wanafunzi kujadili akiba.'],
      ],
      predict: [
        ['Mwajuma akihamia karibu na benki, atafanya nini?', 'Anaweza kuweka akiba benki.', 'Hataweka pesa popote tena.', 'Atafunga benki yote ya mjini.', 'Atawauzia wenzake kibubu chake.'],
        ['Wanafunzi wakifuata ushauri wa mwalimu, wataamuaje?', 'Watachagua njia kulingana na hali yao.', 'Watakataa kuweka akiba kabisa.', 'Wote watatumia pesa zao zote leo.', 'Wote wataacha shule kufanya biashara.'],
      ],
      infer: [
        ['Kwa nini Mwajuma anapendelea kuweka pesa nyumbani?', 'Anaweza kuzichukua wakati wowote.', 'Nyumbani pesa huzaliana kila mwaka.', 'Benki hukataa pesa za watoto.', 'Hapendi kuhesabu pesa zake.'],
        ['Mwalimu ana mtazamo gani kuhusu mjadala?', 'Kila njia ina faida na hasara zake.', 'Benki ndiyo njia pekee iliyo sahihi.', 'Nyumbani ndipo mahali pekee pazuri.', 'Mjadala huo haukuwa na maana yoyote.'],
      ],
      ctx: [
        ['Neno "riba" katika kifungu lina maana gani?', 'pesa za ziada anazopewa mwekaji akiba', 'ada anayolipa mteja kila siku', 'jina la sarafu ya zamani', 'mkopo anaopewa mwanafunzi shuleni'],
        ['Neno "hasara" katika kifungu lina maana gani?', 'upande mbaya au hasi wa jambo', 'upande mzuri au chanya wa jambo', 'jambo lililofanywa na mwalimu', 'jambo lililopangwa kwa uangalifu'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Wanafunzi walijadili faida na hasara za akiba.', 'Mwajuma alinunua kibubu kipya kijijini.', 'Wanafunzi waligombana na mwalimu darasani.', 'Kamau aliweka pesa zote benki jana.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Njia ya kuweka akiba ichaguliwe kwa busara.', 'Benki iko mbali na kijiji cha wanafunzi.', 'Njia zote za akiba ni mbaya sana.', 'Mwalimu alitaka wanafunzi watumie pesa.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'mjadala kuhusu mahali pa kuweka akiba', 'ratiba ya mitihani ya Darasa la Nane', 'safari ya wanafunzi kwenda mjini', 'ujenzi wa benki mpya kijijini'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Akiba: Nyumbani au Benki?', 'Mwalimu Mpya Darasani', 'Kibubu Kilichopotea', 'Mtihani wa Hesabu'],
      ],
    },
  },
  {
    id: 'stakabadhi', title: 'Usisahau Stakabadhi', kind: 'ushawishi',
    text: 'Wanunuzi wapendwa, umewahi kununua bidhaa nyumbani ikaharibika siku ya pili? Je, ulirudi dukani bila uthibitisho wowote? Hapo ndipo stakabadhi inapokusaidia.\n\nStakabadhi ni karatasi inayoonyesha ulinunua nini, lini na kwa bei gani. Ukiwa nayo, muuzaji hawezi kukataa kubadilisha bidhaa mbovu. Pia inakusaidia kujua ikiwa ulitozwa bei sahihi.\n\nKwa hiyo, kila unaponunua, omba stakabadhi na uihifadhi mahali salama. Usisubiri hasara ikupate kabla hujaanza kuitunza. Mnunuzi mwerevu hudai stakabadhi kila mara!',
    q: {
      fact: [
        ['Stakabadhi inaonyesha nini kulingana na kifungu?', 'ulinunua nini, lini na kwa bei gani', 'jina la muuzaji na mahali anapoishi', 'ubora wa bidhaa zote dukani', 'mshahara wa wafanyakazi wa duka'],
        ['Mnunuzi anapaswa kuifanyia nini stakabadhi?', 'kuihifadhi mahali salama', 'kuitupa mara tu akitoka', 'kuimpa jirani yake aitunze', 'kuichoma moto baada ya wiki'],
      ],
      order: [
        ['Mwandishi alianza kifungu kwa nini?', 'kuuliza maswali kwa wanunuzi', 'kutoa maagizo kwa wauzaji', 'kutaja bei za bidhaa dukani', 'kuwaadhibu wanunuzi wasiotunza'],
        ['Mwandishi alimaliza kifungu kwa nini?', 'kuwaambia wanunuzi wadai stakabadhi kila mara', 'kueleza stakabadhi ni nini hasa', 'kuuliza kama wanunuzi walirudi dukani', 'kutangaza duka jipya lililofunguliwa mjini leo'],
      ],
      predict: [
        ['Mnunuzi akiwa na stakabadhi, nini kinaweza kutokea?', 'Muuzaji atabadilisha bidhaa mbovu.', 'Muuzaji atafunga duka lake mara moja.', 'Bidhaa itakuwa nzuri milele.', 'Mnunuzi atapewa bidhaa bure kabisa.'],
        ['Mnunuzi asiyetunza stakabadhi atakumbana na nini?', 'Anaweza kupata hasara bidhaa ikiharibika.', 'Atapata zawadi kutoka kwa muuzaji.', 'Atalipa bei ndogo zaidi dukani.', 'Atachaguliwa kuwa mnunuzi bora wa mwaka huu.'],
      ],
      infer: [
        ['Kwa nini mwandishi aliuliza maswali mwanzoni?', 'Alitaka kuvutia na kuwafanya wanunuzi wafikiri.', 'Hakujua jibu la maswali hayo.', 'Alitaka kuwatisha wauzaji wote.', 'Alitaka kuwauzia wanunuzi stakabadhi za duka lake.'],
        ['Mwandishi anamwitaje mnunuzi anayedai stakabadhi?', 'mwerevu', 'mvivu', 'mwoga', 'mjinga'],
      ],
      ctx: [
        ['Neno "mbovu" katika kifungu lina maana gani?', 'iliyoharibika na isiyofaa kutumika', 'iliyo mpya na yenye thamani kubwa', 'iliyonunuliwa kwa bei ya chini', 'iliyoletwa kutoka nchi ya mbali'],
        ['Neno "uthibitisho" katika kifungu lina maana gani?', 'ushahidi unaoonyesha jambo ni kweli', 'ahadi ya kununua kitu kesho', 'adhabu anayopewa mnunuzi dukani', 'jina la bidhaa inayouzwa sokoni'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Mwandishi anawahimiza wanunuzi kudai na kutunza stakabadhi.', 'Mwandishi anawaomba wauzaji wapunguze bei za bidhaa.', 'Mwandishi anawakataza wanunuzi kurudi dukani.', 'Mwandishi anaeleza jinsi ya kujenga duka.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Stakabadhi humlinda mnunuzi dhidi ya hasara.', 'Stakabadhi huandikwa kwa karatasi nyeupe.', 'Stakabadhi huzuia bidhaa kuharibika kabisa.', 'Stakabadhi hutolewa tu kwa wazee wa mjini.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'umuhimu wa mnunuzi kudai stakabadhi', 'jinsi ya kufungua duka la rejareja', 'bei za bidhaa katika soko la mjini', 'ushauri kwa wauzaji wanaoanza biashara'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Mnunuzi Mwerevu Hudai Stakabadhi', 'Duka Jipya la Mjini', 'Bei Nafuu za Soko', 'Wauzaji Waaminifu wa Soko la Mjini'],
      ],
    },
  },
];

export const LISTENS = [
  {
    id: 'maagizo', title: 'Maagizo ya Kuosha Mikono', kind: 'maagizo',
    script: 'Sikilizeni maagizo haya kwa makini. Kwanza, lowesha mikono yako kwa maji safi yanayotiririka. Pili, paka sabuni na usugue viganja, migongo ya mikono na kati ya vidole. Tatu, sugua kwa sekunde ishirini. Nne, suuza sabuni yote kwa maji safi. Mwisho, kausha mikono kwa kitambaa safi au uiache ikauke hewani. Fanya hivi kabla ya kula na baada ya kutoka chooni.',
    q: {
      main: [
        ['Maagizo haya yanahusu nini hasa?', 'jinsi ya kuosha mikono ipasavyo', 'jinsi ya kupika chakula nyumbani', 'jinsi ya kujenga choo kipya', 'jinsi ya kunywa maji safi'],
        ['Ni hatua gani ya kwanza katika maagizo?', 'kulowesha mikono kwa maji safi', 'kupaka sabuni kwenye viganja', 'kukausha mikono kwa kitambaa', 'kusugua kwa sekunde ishirini'],
      ],
      ctx: [
        ['Neno "kutiririka" lina maana gani katika maagizo?', 'kutoka kwa mfululizo kama mto', 'kusimama bila kusogea kabisa', 'kuruka juu kwa nguvu nyingi', 'kuganda na kuwa barafu'],
        ['Maneno "kuiacha ikauke hewani" yanamaanisha nini?', 'kuiacha mikono ikauke yenyewe', 'kuipeleka mikono kwa daktari', 'kuifunika mikono kwa glovu', 'kuiosha mikono kwa maji mengi'],
      ],
      detail: [
        ['Mikono isuguliwe kwa muda gani?', 'sekunde ishirini', 'dakika tano', 'sekunde tatu', 'saa nzima'],
        ['Mikono ioshwe lini kulingana na maagizo?', 'kabla ya kula na baada ya chooni', 'kabla ya kulala na asubuhi tu', 'wakati wa kucheza mpira tu', 'mara moja kila wiki'],
      ],
    },
  },
  {
    id: 'jiko', title: 'Usalama Jikoni', kind: 'ujumbe',
    script: 'Habari za jioni, wazazi na wanafunzi. Leo tuzungumze kuhusu usalama jikoni. Mama Wambui alikuwa akipika maharagwe kwenye jiko la mkaa. Alipoitwa na jirani, aliondoka na kuacha sufuria jikoni. Mtoto wake mdogo alikuja kucheza karibu na jiko na karibu aguse sufuria moto. Kwa bahati nzuri, kaka yake alimwona na kumzuia. Kumbukeni: usiache moto bila mtu, na watoto wadogo wakae mbali na jiko.',
    q: {
      main: [
        ['Ujumbe mkuu wa matini hii ni upi?', 'moto jikoni usiachwe bila mtu', 'maharagwe hupikwa kwa mkaa tu', 'majirani wasitembeleane jioni', 'watoto wapike chakula wenyewe'],
        ['Matini hii inafaa kupewa kichwa kipi?', 'Usalama Jikoni', 'Maharagwe ya Mama', 'Jirani Mpya', 'Mpira wa Kaka'],
      ],
      ctx: [
        ['Neno "alimzuia" lina maana gani katika matini?', 'alimzuia asifanye jambo hatari', 'alimsukuma aguse sufuria', 'alimwita aje kula chakula', 'alimwacha acheze peke yake'],
        ['Maneno "kwa bahati nzuri" yanamaanisha nini?', 'jambo jema lilitokea bila kutarajiwa', 'jambo baya lilipangwa mapema', 'jambo lilifanyika kwa makusudi', 'jambo lilifanyika kwa makusudi na mapema'],
      ],
      detail: [
        ['Mama Wambui alikuwa akipika nini?', 'maharagwe', 'ugali', 'mchele', 'viazi'],
        ['Nani alimwona mtoto mdogo karibu na jiko?', 'kaka yake', 'Mama Wambui', 'jirani yao', 'baba yake'],
      ],
    },
  },
  {
    id: 'lishe', title: 'Kula kwa Afya', kind: 'habari',
    script: 'Hapa ni habari za afya. Daktari Njeri wa hospitali ya Nyeri alisema kuwa magonjwa kama kisukari na shinikizo la damu yanaongezeka kwa watoto na watu wazima. Alieleza kuwa vyanzo vikuu ni kula vyakula vyenye sukari na mafuta mengi, na kukosa mazoezi. Alishauri watu wale mboga na matunda kila siku, wanywe maji mengi, na wafanye mazoezi angalau nusu saa kila siku. Aliongeza kuwa ni vizuri kupimwa afya mara moja kila mwaka.',
    q: {
      main: [
        ['Habari hii inahusu nini hasa?', 'jinsi ya kujikinga na magonjwa yasiyoambukizwa', 'ujenzi wa hospitali mpya mjini Nyeri', 'bei ya dawa katika maduka ya dawa', 'ratiba ya michezo ya shule zote za Nyeri'],
        ['Daktari Njeri anawashauri watu kufanya nini?', 'kula vizuri na kufanya mazoezi', 'kula sukari nyingi kila siku', 'kuacha kupima afya zao', 'kunywa vinywaji vyenye sukari'],
      ],
      ctx: [
        ['Neno "kisukari" lina maana gani katika habari?', 'ugonjwa unaohusiana na sukari mwilini', 'jina la mboga ya kijani', 'aina ya mazoezi ya asubuhi', 'chakula cha watoto wachanga wa miezi sita'],
        ['Maneno "magonjwa yanaongezeka" yanamaanisha nini?', 'magonjwa yanazidi kuwa mengi', 'magonjwa yanazidi kupungua', 'magonjwa yameisha kabisa', 'magonjwa yamehamia nchi nyingine'],
      ],
      detail: [
        ['Daktari alisema mazoezi yafanywe kwa muda gani?', 'angalau nusu saa kila siku', 'masaa matano kila siku', 'dakika mbili kila wiki', 'usiku mzima kila mwezi mara moja'],
        ['Watu wapimwe afya mara ngapi kwa mwaka?', 'mara moja', 'mara kumi', 'mara tatu', 'hakuna kamwe'],
      ],
    },
  },
];
