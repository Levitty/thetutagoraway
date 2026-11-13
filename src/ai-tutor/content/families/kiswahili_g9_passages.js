// ============================================================================
// KISWAHILI GRADE 9: VIFUNGU, MASHAIRI NA MATINI YA KUSIKILIZA ya asili kwa familia za ufahamu. Imeandikwa na Claude (14 Nov 2026),
// haikunakiliwa wala kubadilishwa kutoka kitabu, shairi, hadithi au wimbo wowote uliochapishwa. Majina na mahali vya Kenya.
// Kila kifungu cha nathari kina aina saba za maswali, mawili kila aina: fact, order, predict, infer, ctx, summary, main.
// Kila shairi lina aina nne: fact, infer, ctx, main. Matini ya kusikiliza ina main, ctx, detail na infer.
// Safu ni [swali, jibu sahihi, kosa (jambo dogo), kosa (kinyume), kosa (halimo kwenye kifungu)]; makosa matatu hufuata mpangilio huo ili
// misimbo _DETAIL, _OPPOSITE na _NOTSAID ilingane. DRAFT: mwalimu wa Kiswahili mzawa ahakiki kila kifungu kabla mtoto yeyote hakijamfikia.
// ============================================================================
export const PASSAGES = [
  {
    id: 'mto', title: 'Mto Nyando Unarudi', kind: 'simulizi',
    text: 'Kwa miaka mingi, wakazi wa kijiji kimoja karibu na Kisumu walitupa taka mtoni. Chupa za plastiki, mifuko na vyuma vilijaa kando ya Mto Nyando. Samaki walipotea na watoto wakaanza kuugua tumbo.\n\nSiku moja, Bi Akinyi, mwalimu mstaafu, aliwakusanya vijana kumi na kuanza kusafisha mto. Mwanzoni, watu waliwacheka. Lakini baada ya mwezi mmoja, mto ulianza kuonekana safi.\n\nMiezi sita baadaye, samaki walirudi. Kijiji kizima kilijiunga na kazi hiyo, na kila Jumamosi walikusanya taka. Wakazi walijifunza kuwa mto safi ni uhai wa kijiji.',
    q: {
      fact: [
        ['Bi Akinyi aliwakusanya vijana wangapi?', 'kumi', 'ishirini', 'hamsini', 'mia moja'],
        ['Nini kilirudi mtoni baada ya miezi sita?', 'samaki', 'chupa za plastiki', 'mifuko ya taka', 'meli za abiria'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Wakazi walitupa taka mtoni.', 'Samaki walirudi mtoni tena.', 'Kijiji kizima kilijiunga na kazi.', 'Serikali ilijenga daraja jipya.'],
        ['Tukio gani lilitokea mwisho?', 'Kijiji kizima kilikusanya taka kila Jumamosi.', 'Bi Akinyi aliwakusanya vijana kumi.', 'Watu waliwacheka wasafishaji wa mto.', 'Bi Akinyi alihamia mji mwingine mkubwa.'],
      ],
      predict: [
        ['Kijiji kikiendelea kukusanya taka, mto utakuwaje?', 'Utaendelea kuwa safi.', 'Utakuwa mchafu tena.', 'Utakauka wote.', 'Utahamia kijiji kingine.'],
        ['Vijana wa kijiji wataendelea kufanya nini?', 'Wataendelea kutunza mazingira ya mto.', 'Wataanza kutupa taka mtoni tena.', 'Wataondoka kijijini na kwenda mjini.', 'Wataanza kuuza samaki kwa bei kubwa.'],
      ],
      infer: [
        ['Kwa nini watoto walianza kuugua tumbo?', 'Maji ya mto yalikuwa machafu.', 'Walikula chakula kingi mno.', 'Shule ilifungwa mapema.', 'Mvua ilinyesha kwa muda mrefu.'],
        ['Bi Akinyi ni mtu wa aina gani?', 'mwenye bidii na mwenye uongozi', 'mvivu na mwenye kiburi', 'mwoga na mwenye wasiwasi', 'mkali na asiyependa watu wa kijijini'],
      ],
      ctx: [
        ['Neno "mstaafu" katika kifungu lina maana gani?', 'aliyeacha kazi baada ya umri wake', 'aliyeanza kazi mpya leo hii', 'aliyefukuzwa kazini kwa kosa', 'aliyehamia kazi ya mjini'],
        ['Neno "aliwakusanya" katika kifungu lina maana gani?', 'aliwaita na kuwaleta pamoja', 'aliwafukuza na kuwatawanya', 'aliwapiga na kuwaadhibu', 'aliwaficha mahali pa mbali'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Wakazi walisafisha mto na samaki wakarudi.', 'Bi Akinyi alikuwa mwalimu aliyestaafu.', 'Wakazi walichafua mto kwa makusudi.', 'Kijiji kilihamia kando ya ziwa kubwa.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Mto safi ni uhai wa kijiji.', 'Mto Nyando uko karibu na Kisumu.', 'Mto mchafu hauna madhara yoyote.', 'Samaki wa Kisumu ni wa bei ghali.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'wakazi wanaosafisha mto uliochafuliwa', 'mwalimu anayestaafu kutoka kazini', 'samaki wanaouzwa katika soko la Kisumu', 'watoto wanaougua magonjwa ya tumbo'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Mto Safi, Kijiji Hai', 'Samaki wa Soko', 'Mwalimu Mstaafu', 'Plastiki ya Zamani'],
      ],
    },
  },
  {
    id: 'masomo', title: 'Neema Anataka Kuwa Rubani', kind: 'ufahamu',
    text: 'Neema, msichana wa miaka kumi na minne kutoka Kitui, alitamani kuwa rubani. Jirani zake walimwambia, "Kazi ya kuendesha ndege ni ya wavulana." Baba yake naye alisema, "Mwanamke akome kufikiria mambo makubwa kama hayo."\n\nNeema hakukata tamaa. Alisoma hesabu na sayansi kwa bidii na alishika nafasi ya kwanza darasani. Mwalimu wake, Bw Mutua, alimsaidia kupata kitabu kuhusu usafiri wa anga na kumwonyesha rubani mwanamke wa shirika la ndege la Kenya.\n\nBaba alipomwona Neema akipokea tuzo ya shule, alibadili mawazo. "Nimekosea," alisema. "Uwezo wa mtu hautegemei jinsia yake." Tangu siku hiyo, alimsaidia Neema kutimiza ndoto yake.',
    q: {
      fact: [
        ['Neema anatoka katika eneo gani?', 'Kitui', 'Mombasa', 'Kakamega', 'Nyeri'],
        ['Nani alimsaidia Neema kupata kitabu cha usafiri wa anga?', 'Bw Mutua', 'baba yake', 'jirani yake', 'rafiki yake'],
      ],
      order: [
        ['Tukio gani lilitokea kwanza?', 'Jirani walisema kazi hiyo ni ya wavulana.', 'Neema alipokea tuzo ya shule.', 'Baba alikiri kuwa alikosea.', 'Neema alihamia shule ya bweni ya jijini.'],
        ['Tukio gani lilitokea mwisho?', 'Baba alianza kumsaidia Neema.', 'Neema alishika nafasi ya kwanza.', 'Mwalimu alimwonyesha rubani mwanamke.', 'Neema alisafiri kwa ndege ya kwanza.'],
      ],
      predict: [
        ['Neema akiendelea kusoma kwa bidii, nini kitatokea?', 'Anaweza kutimiza ndoto ya kuwa rubani.', 'Ataacha ndoto yake ya zamani.', 'Atalazimika kuacha masomo yote.', 'Ataolewa na kuhamia nchi ya mbali.'],
        ['Baba ataendelea kumchukuliaje Neema?', 'Atamuunga mkono katika masomo yake.', 'Atamkataza kusoma hesabu tena.', 'Atamlazimisha kuacha shule mara moja.', 'Atamhamishia shule ya wavulana tu.'],
      ],
      infer: [
        ['Kwa nini baba alibadili mawazo?', 'Alimwona Neema akifanikiwa shuleni.', 'Alipewa pesa na mwalimu wake.', 'Alihamia mji mpya wa mbali.', 'Alipewa kazi mpya na serikali ya kaunti.'],
        ['Neema ni mtoto wa aina gani?', 'mwenye bidii na asiyekata tamaa', 'mvivu na anayekata tamaa upesi', 'mwoga asiyependa masomo ya hesabu', 'mkaidi asiyemsikiliza mwalimu wake'],
      ],
      ctx: [
        ['Maneno "hakukata tamaa" yanamaanisha nini?', 'hakuacha kujaribu licha ya vikwazo', 'aliacha jambo hilo mara moja', 'alifurahi kupita kiasi mno', 'alihamia shule nyingine mjini'],
        ['Neno "jinsia" katika kifungu lina maana gani?', 'hali ya kuwa mwanamke au mwanamume', 'kiwango cha elimu cha mtu', 'umri wa mtu aliyekomaa', 'kazi anayoifanya mtu kila siku'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Neema alipinga dhana potofu na kujituma masomoni.', 'Neema alisoma hesabu na sayansi darasani.', 'Neema alikubali kuwa kazi ni ya wavulana.', 'Neema alihamia nchi nyingine kusomea ndege.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Uwezo wa mtu hautegemei jinsia yake.', 'Neema alipewa tuzo ya shule mwaka huo.', 'Wanawake hawawezi kuwa marubani wazuri.', 'Kitui ni mji mkubwa wenye viwanja vya ndege.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'msichana anayepinga dhana potofu kuhusu jinsia', 'mwalimu anayefundisha somo la sayansi', 'baba anayehamia mji wa Kitui', 'shirika la ndege linalouza tiketi za bei nafuu'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Ndoto ya Neema Angani', 'Tuzo ya Mwalimu', 'Ndege ya Baba', 'Jirani Wapya wa Kitui'],
      ],
    },
  },
  {
    id: 'simu', title: 'Tumia Simu kwa Busara', kind: 'ushawishi',
    text: 'Vijana wapendwa, simu ni zana nzuri, lakini inaweza kuwa mtego. Je, umewahi kukaa saa tatu ukitazama video bila kumaliza kazi ya shule? Hilo ni onyo!\n\nSimu inaweza kukusaidia kutafuta habari za masomo, kuwasiliana na wazazi na kujifunza lugha mpya. Hata hivyo, ukiitumia usiku kucha, utachoka na utashindwa kuamka asubuhi. Macho yako pia yataumia.\n\nBasi, weka wakati maalum wa kutumia simu, na uizime unapoanza kusoma. Tumia simu ikutumikie, usiwe mtumwa wake. Ukichagua vizuri, maisha yako yatabadilika.',
    q: {
      fact: [
        ['Mwandishi anasema kukaa saa ngapi ukitazama video ni onyo?', 'saa tatu', 'saa moja', 'saa kumi', 'dakika tano'],
        ['Simu inaweza kukusaidia kufanya nini kulingana na kifungu?', 'kujifunza lugha mpya', 'kuruka darasani mara kwa mara', 'kuepuka kazi za nyumbani', 'kupika chakula cha jioni'],
      ],
      order: [
        ['Mwandishi alianza kifungu kwa nini?', 'kuonya kuwa simu inaweza kuwa mtego', 'kutaja faida za kujifunza lugha', 'kupendekeza wakati wa kuizima simu', 'kutangaza simu mpya ya mjini'],
        ['Mwandishi alimaliza kifungu kwa nini?', 'kuwahimiza vijana wachague vizuri', 'kueleza macho yanavyoumia usiku', 'kuuliza kuhusu video za saa tatu', 'kutaja bei ya simu za kisasa'],
      ],
      predict: [
        ['Kijana akitumia simu usiku kucha, nini kitatokea?', 'Atachoka na kushindwa kuamka asubuhi.', 'Atapata nguvu zaidi darasani.', 'Atapewa zawadi na walimu wake.', 'Atakuwa mwanafunzi bora kuliko wote.'],
        ['Kijana akiweka wakati maalum wa simu, atakuwaje?', 'Atakuwa na muda wa kusoma na kupumzika.', 'Atashindwa kuwasiliana na wazazi wake.', 'Atapoteza muda wote wa masomo.', 'Atapata simu mpya kila mwezi.'],
      ],
      infer: [
        ['Kwa nini mwandishi aliuliza swali mwanzoni?', 'Alitaka kuwafanya vijana wajitafakari.', 'Hakujua jibu la swali hilo.', 'Alitaka kuwauzia vijana simu.', 'Alitaka kuwaadhibu vijana wavivu.'],
        ['Mwandishi ana mtazamo gani kuhusu simu?', 'Simu ni nzuri ikitumiwa kwa kiasi.', 'Simu zote zinapaswa kupigwa marufuku.', 'Simu ni bora kuliko vitabu vyote.', 'Vijana hawafai kamwe kuwa na simu.'],
      ],
      ctx: [
        ['Neno "mtego" katika kifungu lina maana gani?', 'jambo linalomnasa mtu kwa hatari', 'zawadi anayopewa mtu mwema', 'jina la mchezo wa shuleni', 'chombo cha kuhifadhia habari'],
        ['Neno "mtumwa" katika kifungu lina maana gani?', 'mtu anayetawaliwa na kitu kabisa', 'mtu anayeongoza watu wengine', 'mtu anayepewa pesa nyingi', 'mtu anayependwa na walimu'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Mwandishi anawashauri vijana watumie simu kwa busara.', 'Mwandishi anawaonya wazazi kuhusu bei za simu.', 'Mwandishi anawaambia vijana waache kusoma kabisa.', 'Mwandishi anaeleza jinsi simu zinavyotengenezwa.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Simu itumike kwa wakati maalum na kwa kiasi.', 'Simu hutumika kutazama video za saa tatu.', 'Simu haina faida yoyote kwa wanafunzi.', 'Simu zinapaswa kuuzwa kwa bei nafuu.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'matumizi ya busara ya simu kwa vijana', 'faida za kuuza simu za kisasa', 'ratiba ya masomo ya usiku shuleni', 'mchezo wa video wa vijana wa mjini'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Simu: Mtumishi, Si Bwana', 'Video za Usiku', 'Simu Mpya Dukani', 'Macho ya Mwalimu'],
      ],
    },
  },
  {
    id: 'kodi', title: 'Kodi: Mzigo au Mchango?', kind: 'mjadala',
    text: 'Katika kipindi cha majadiliano shuleni, Hassan alisema, "Kodi ni mzigo mkubwa kwa wananchi. Pesa tunazopata zinapunguzwa kila mwezi." Wambui hakukubali. "Kodi hujenga barabara, hospitali na shule," alisema. "Bila hiyo, huduma hizi hazingewezekana."\n\nOmondi alitoa hoja ya tatu. "Kodi ni sawa, lakini ni lazima serikali itumie pesa hizo kwa uaminifu. Tukisikia pesa zimeibwa, watu hukata tamaa kulipa." Hassan alikubali kidogo, akasema, "Hapo umesema kweli."\n\nMwalimu alihitimisha, "Kila mtu ana mtazamo wake. Kinachohitajika ni kulipa kodi kwa wakati na kuhakikisha pesa zinatumika vizuri." Wanafunzi walikubaliana kuwa uwazi katika matumizi ni muhimu.',
    q: {
      fact: [
        ['Nani alisema kodi hujenga barabara, hospitali na shule?', 'Wambui', 'Hassan', 'Omondi', 'mwalimu'],
        ['Hassan alisemaje kuhusu kodi mwanzoni?', 'Kodi ni mzigo mkubwa kwa wananchi.', 'Kodi hujenga hospitali na shule.', 'Kodi lazima itumiwe kwa uaminifu.', 'Kodi haipaswi kulipwa kamwe.'],
      ],
      order: [
        ['Nani alitoa hoja ya kwanza katika mjadala?', 'Hassan', 'Wambui', 'Omondi', 'mwalimu'],
        ['Nani alihitimisha mjadala?', 'mwalimu', 'Hassan', 'Wambui', 'mkurugenzi wa shule'],
      ],
      predict: [
        ['Serikali ikitumia pesa za kodi vibaya, nini kinaweza kutokea?', 'Watu wanaweza kukata tamaa ya kulipa.', 'Watu watafurahi kulipa kodi zaidi.', 'Hospitali zote zitajengwa upya.', 'Walimu watapewa mishahara mikubwa.'],
        ['Wanafunzi wakifuata ushauri wa mwalimu, watafanya nini?', 'Watalipa kodi kwa wakati na kufuatilia matumizi.', 'Watakataa kulipa kodi kabisa.', 'Watawaachia wengine kulipa kodi.', 'Wataiba pesa za serikali kwa siri na kuzificha.'],
      ],
      infer: [
        ['Kwa nini Omondi alisema uaminifu ni muhimu?', 'Pesa zikiibwa, watu hukata tamaa kulipa.', 'Hakupenda kulipa kodi hata kidogo.', 'Alitaka kuwa mwalimu wa shule.', 'Alitaka kununua barabara yote.'],
        ['Kauli "Hapo umesema kweli" inaonyesha nini kuhusu Hassan?', 'Alikubaliana na hoja ya Omondi kidogo.', 'Alikasirika na kuondoka darasani.', 'Alikataa hoja zote za wenzake.', 'Alimsifu mwalimu kwa kuwa mkali.'],
      ],
      ctx: [
        ['Neno "alihitimisha" katika kifungu lina maana gani?', 'alimaliza mjadala kwa maelezo ya mwisho', 'alianza mjadala kwa swali jipya', 'alikataza wanafunzi kuzungumza', 'alihamisha mjadala hadi kesho asubuhi shuleni'],
        ['Neno "uwazi" katika kifungu lina maana gani?', 'hali ya kutofichwa jambo kwa wananchi', 'hali ya kuwa na giza nene', 'kiasi cha pesa kilichokusanywa', 'ukubwa wa jengo la serikali la mjini'],
      ],
      summary: [
        ['Ni muhtasari upi unafaa zaidi?', 'Wanafunzi walijadili kodi na wakakubaliana uwazi ni muhimu.', 'Hassan alisema kodi hupunguza mshahara mwezini.', 'Wanafunzi waliamua kuwa kodi iondolewe kabisa.', 'Mwalimu aliwafukuza wanafunzi wote darasani kwa kelele kubwa.'],
        ['Ni wazo gani kuu la kuingia kwenye muhtasari?', 'Kodi ilipwe kwa wakati na itumike vizuri.', 'Kodi hujenga barabara na hospitali.', 'Kodi ni mzigo usiobebeka na usio na faida.', 'Wanafunzi hawana haki ya kuuliza kodi.'],
      ],
      main: [
        ['Kifungu kinahusu nini hasa?', 'mjadala kuhusu faida na changamoto za kodi', 'ratiba ya mitihani ya shule ya mjini', 'ujenzi wa barabara mpya ya Nairobi', 'mshahara wa walimu wa shule za kijiji'],
        ['Ni kichwa kipi kinafaa zaidi kifungu?', 'Kodi: Mzigo au Mchango?', 'Barabara Mpya ya Mjini', 'Mwalimu na Wanafunzi', 'Pesa za Hassan'],
      ],
    },
  },
  {
    id: 'shairi-mto', title: 'Maji ya Kijiji', kind: 'shairi',
    text: 'Maji ya kijiji chetu, yanatiririka kwa amani,\nWatoto wanayanywa, bila hofu mioyoni,\nTusiyachafue kamwe, yawe safi kila hali,\nKwani maji ni uhai, tuyalinde kwa makini.\n\nMama huteka asubuhi, na ndoo kichwani,\nBaba huyatumia shambani, mazao yawe kivulini,\nTukitupa taka mtoni, uhai utapotea,\nTuungane sote, tuyatunze kwa makini.',
    q: {
      fact: [
        ['Nani huteka maji asubuhi kulingana na shairi?', 'mama', 'baba', 'mwalimu', 'jirani'],
        ['Baba huyatumia maji kufanya nini?', 'kunyunyizia mazao shambani', 'kuoga asubuhi mapema', 'kupika chakula cha jioni', 'kuogeshea ng\'ombe wake'],
      ],
      infer: [
        ['Shairi linaonyesha mwandishi ana msimamo gani kuhusu maji?', 'Maji yanapaswa kulindwa na watu wote.', 'Maji yanaweza kutumiwa kwa kiasi chochote.', 'Maji hayana umuhimu kwa kijiji.', 'Maji ni ya kuuzwa kwa bei kubwa.'],
        ['Kwa nini mshairi anasema "tuungane sote"?', 'Kazi ya kutunza maji ni ya wote.', 'Maji hupatikana mbali na kijiji.', 'Watu wote wanapaswa kuhamia mjini.', 'Serikali itaondoa maji yote.'],
      ],
      ctx: [
        ['Neno "yanatiririka" lina maana gani katika shairi?', 'yanatiririka kwa mfululizo kama mto', 'yanasimama bila kusogea hata kidogo', 'yanaruka juu kwa nguvu nyingi', 'yanaganda na kuwa barafu nzito'],
        ['Neno "makini" katika shairi lina maana gani?', 'uangalifu mkubwa', 'haraka isiyo na mpango', 'hasira isiyo na sababu', 'uvivu wa kutenda jambo'],
      ],
      main: [
        ['Maudhui makuu ya shairi ni yapi?', 'umuhimu wa kutunza maji ya kijiji', 'ubora wa mazao ya shambani', 'kazi za wanawake kijijini', 'ujenzi wa visima vipya vya mjini'],
        ['Shairi hili linafaa kupewa kichwa kipi?', 'Maji ya Kijiji', 'Mazao ya Baba', 'Ndoo ya Mama', 'Hofu ya Watoto'],
      ],
    },
  },
  {
    id: 'shairi-barabara', title: 'Barabara na Maisha', kind: 'shairi',
    text: 'Barabara ni njia ya maisha, tuipite kwa tahadhari,\nMwendo kasi ni hatari, huleta huzuni na majonzi,\nKabla ya kuvuka pita, tazama kushoto na kulia,\nDereva mlevi ni adui, hatupaswi kumpa nafasi.\n\nWatembea kwa miguu, tumieni njia zenu,\nBodaboda na magari, heshimuni alama zote,\nMaisha ni zawadi adhimu, tusiyapoteze kwa pupa,\nTujali sote usalama, barabarani popote.',
    q: {
      fact: [
        ['Kabla ya kuvuka barabara, mshairi anashauri nini?', 'kutazama kushoto na kulia', 'kukimbia kwa kasi kubwa', 'kupiga kelele kwa sauti', 'kusimama katikati ya barabara'],
        ['Mshairi anamwita nani adui?', 'dereva mlevi', 'mtembea kwa miguu', 'mwalimu wa shule', 'mwendesha baiskeli'],
      ],
      infer: [
        ['Kwa nini mshairi anasema mwendo kasi ni hatari?', 'Huleta ajali, huzuni na majonzi.', 'Hupunguza muda wa safari yote.', 'Huokoa mafuta ya gari kubwa.', 'Huwapendeza watembea kwa miguu.'],
        ['Mshairi ana msimamo gani kuhusu maisha?', 'Maisha ni zawadi isiyopaswa kupotezwa.', 'Maisha hayana thamani barabarani.', 'Maisha ni mafupi na hayaokolewi.', 'Maisha hutegemea kasi ya gari.'],
      ],
      ctx: [
        ['Neno "tahadhari" katika shairi lina maana gani?', 'uangalifu wa kuepuka madhara', 'furaha ya kusafiri barabarani', 'hasira ya madereva wengi', 'kasi ya magari ya mjini'],
        ['Neno "adhimu" katika shairi lina maana gani?', 'tukufu na yenye thamani kubwa', 'dhaifu na isiyo na maana', 'ndogo na ya bei nafuu', 'ya zamani na iliyochakaa kabisa'],
      ],
      main: [
        ['Maudhui makuu ya shairi ni yapi?', 'usalama barabarani kwa watumiaji wote', 'ubora wa magari ya kisasa mjini', 'bei za mafuta ya magari makubwa', 'ujenzi wa barabara mpya za vijijini'],
        ['Shairi hili linafaa kupewa kichwa kipi?', 'Barabara na Maisha', 'Gari la Baba', 'Mafuta ya Mjini', 'Daraja Jipya'],
      ],
    },
  },
];

export const LISTENS = [
  {
    id: 'maji-machafu', title: 'Magonjwa ya Maji Machafu', kind: 'habari',
    script: 'Hizi ni habari za afya kutoka kaunti ya Homa Bay. Afisa wa afya, Bw Odhiambo, alisema kuwa visa vya kuhara na homa ya matumbo vimeongezeka katika vijiji vya ziwani. Alieleza kuwa chanzo kikuu ni kunywa maji yasiyochemshwa kutoka ziwani. Alishauri wakazi wachemshe maji kwa dakika kumi kabla ya kunywa, waoshe mikono kwa sabuni, na watumie vyoo. Wengine wanaamini kuwa maji ya ziwa ni salama kwa sababu yanaonekana safi, lakini Bw Odhiambo alisema vijidudu haviwezi kuonekana kwa macho.',
    q: {
      main: [
        ['Habari hii inahusu nini hasa?', 'kuongezeka kwa magonjwa yatokanayo na maji machafu', 'ujenzi wa hospitali mpya ya Homa Bay', 'bei ya sabuni katika maduka ya kijijini', 'ujenzi wa hospitali mpya ya kisasa Homa Bay mjini'],
        ['Bw Odhiambo anawashauri wakazi kufanya nini?', 'kuchemsha maji na kuosha mikono', 'kunywa maji ya ziwa moja kwa moja', 'kuhamia vijiji vya mjini', 'kuacha kutumia vyoo'],
      ],
      ctx: [
        ['Neno "visa" lina maana gani katika habari?', 'idadi ya watu walioathirika', 'jina la ugonjwa wa ziwani', 'aina ya dawa ya matumbo', 'ruhusa ya kusafiri ziwani'],
        ['Neno "vijidudu" lina maana gani katika habari?', 'viumbe vidogo vinavyosababisha magonjwa', 'samaki wadogo wa ziwani', 'vyombo vya kuchemshia maji', 'dawa za kuua wadudu wa mashambani leo'],
      ],
      detail: [
        ['Maji yachemshwe kwa muda gani?', 'dakika kumi', 'dakika mbili', 'saa nzima', 'sekunde tano'],
        ['Afisa wa afya anatoka kaunti gani?', 'Homa Bay', 'Kisumu', 'Mombasa', 'Kakamega'],
      ],
      infer: [
        ['Kwa nini baadhi ya wakazi wanaamini maji ya ziwa ni salama?', 'Yanaonekana safi kwa macho.', 'Yamechemshwa na afisa wa afya.', 'Yana ladha tamu ya sukari.', 'Yanatoka kwenye kisima kirefu.'],
        ['Bw Odhiambo anaonyesha mtazamo gani kuhusu imani hiyo?', 'Haikubaliani nayo kwa sababu vijidudu havionekani.', 'Anaikubali kwa sababu maji ni safi.', 'Hajali kuhusu afya ya wakazi.', 'Anapendekeza watu wote waache kunywa maji kabisa kijijini.'],
      ],
    },
  },
  {
    id: 'bodaboda', title: 'Kofia ya Usalama', kind: 'mjadala',
    script: 'Karibuni kwenye kipindi cha usalama barabarani. Leo tunazungumza na Bi Wanjiku, mwendeshaji wa bodaboda kutoka Nakuru. Bi Wanjiku alisema, "Mimi huvaa kofia ya usalama kila siku, hata safari ikiwa fupi. Mwaka jana, rafiki yangu alianguka bila kofia na akapata jeraha kubwa kichwani." Alisikitika kwamba vijana wengi huona kofia kuwa mzigo. Alitoa wito kwa wenzake wote waivae, na kwa abiria pia wasikubali kupanda pikipiki bila kofia.',
    q: {
      main: [
        ['Ujumbe mkuu wa Bi Wanjiku ni upi?', 'kofia ya usalama ivaliwe kila safari', 'bodaboda zote zipigwe marufuku', 'safari fupi hazihitaji tahadhari', 'abiria wasilipe nauli kamili'],
        ['Matini hii inafaa kupewa kichwa kipi?', 'Kofia ya Usalama', 'Pikipiki Mpya', 'Safari ya Nakuru', 'Rafiki wa Wanjiku'],
      ],
      ctx: [
        ['Neno "jeraha" lina maana gani katika matini?', 'madhara kwenye mwili wa mtu', 'zawadi ya kuvaa kofia', 'jina la pikipiki ya zamani', 'nauli ya abiria wa Nakuru'],
        ['Neno "wito" lina maana gani katika matini?', 'ombi la kuwahimiza watu kufanya jambo', 'adhabu inayotolewa kwa madereva', 'jina la kipindi cha redio', 'ratiba ya safari za bodaboda mjini Nakuru'],
      ],
      detail: [
        ['Bi Wanjiku anatoka mji gani?', 'Nakuru', 'Nairobi', 'Eldoret', 'Meru'],
        ['Nini kilimtokea rafiki ya Bi Wanjiku mwaka jana?', 'Alianguka na kupata jeraha kichwani.', 'Alinunua pikipiki mpya ya kisasa.', 'Alihamia mji mwingine wa mbali.', 'Alipewa kofia na serikali ya kaunti.'],
      ],
      infer: [
        ['Bi Wanjiku anaonyesha msimamo gani kuhusu kofia?', 'Anaiunga mkono na kuwahimiza wengine.', 'Anaipinga kwa kuwa ni mzigo.', 'Haijali kama inavaliwa au la.', 'Anataka iuzwe kwa bei ndogo madukani sasa.'],
        ['Kwa nini Bi Wanjiku alisikitika?', 'Vijana wengi huona kofia kuwa mzigo.', 'Kofia za Nakuru zimeisha madukani.', 'Pikipiki zake zimeharibika njiani.', 'Rafiki yake alihamia nchi nyingine.'],
      ],
    },
  },
  {
    id: 'huduma', title: 'Huduma kwa Wateja', kind: 'tathmini',
    script: 'Meneja wa benki ya kijamii mjini Eldoret alizungumza na wafanyakazi wapya. Alisema, "Mteja ndiye bosi wetu. Mteja akija, mkaribishe kwa tabasamu na umsikilize bila kumkatiza. Usimjibu kwa ukali hata kama amekasirika. Ukikosea, omba radhi mara moja na urekebishe kosa. Kumbukeni, benki yetu ni ya wananchi, na heshima ndiyo mtaji wetu mkuu." Wafanyakazi walikubali kwa kuitikia kwa kichwa.',
    q: {
      main: [
        ['Meneja alitoa ushauri gani mkuu kwa wafanyakazi?', 'kuwahudumia wateja kwa heshima na adabu', 'kuwafukuza wateja wasiolipa ada', 'kufunga benki mapema kila siku', 'kuwauzia wateja bidhaa za dukani za kila aina'],
        ['Meneja anamwitaje mteja?', 'bosi wao', 'adui wao', 'mgeni wao', 'mwanafunzi wao'],
      ],
      ctx: [
        ['Neno "kumkatiza" lina maana gani katika matini?', 'kumzuia asimalize anachosema', 'kumsaidia aseme zaidi', 'kumwita aje mbele zaidi', 'kumpa zawadi ya benki ya mjini'],
        ['Neno "mtaji" lina maana gani katika matini?', 'rasilimali kuu ya biashara', 'jina la benki ya mjini', 'adhabu kwa wafanyakazi wapya', 'ratiba ya kazi ya benki'],
      ],
      detail: [
        ['Benki iko mji gani?', 'Eldoret', 'Mombasa', 'Nyeri', 'Kitale'],
        ['Mfanyakazi akikosea anapaswa kufanya nini?', 'kuomba radhi na kurekebisha kosa', 'kunyamaza na kuendelea na kazi', 'kumlaumu mteja kwa kosa hilo', 'kuacha kazi mara moja'],
      ],
      infer: [
        ['Meneja ana mtazamo gani kuhusu wateja?', 'Wateja wanastahili heshima kubwa.', 'Wateja ni mzigo kwa benki.', 'Wateja hawana umuhimu wowote.', 'Wateja wapewe adhabu wakikosea.'],
        ['Kwa nini wafanyakazi waliitikia kwa kichwa?', 'Walikubaliana na maneno ya meneja.', 'Walikuwa na usingizi mwingi sana.', 'Walikataa maagizo ya meneja wao.', 'Hawakuelewa lugha aliyotumia.'],
      ],
    },
  },
];
