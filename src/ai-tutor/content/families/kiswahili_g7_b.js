// ============================================================================
// KISWAHILI GRADE 7, SARUFI B (8 skills): ngeli za A-WA, U-I, KI-VI na LI-YA, vinyume, kauli za kutenda, kutendea na kutendwa,
// sentensi sahili na ambatano, ukanushaji, ukubwa wa nomino, usemi halisi na usemi wa taarifa. Written offline. Every wrong answer names the
// library misconception it reveals. All stay reviewed:false until a native Kiswahili teacher signs them off.
// ============================================================================
import { S } from './kiswahili_g7_lib.js';

export const FAMILIES = [
  ...S('ga', 'SARUFI.T8_NGELI_NA_UPATANISHO_.', 'NGELI_AWA_UI', ['GA_MTI_AWA', 'GA_MTOTO_UI', 'GA_UPATANISHO'], ['A-WA ni viumbe hai; U-I ni miti na vitu kama mlima.', 'A-WA: a-, wa-. U-I: u-, i-.'], [
    ['Mti ni wa ngeli gani?', 'U-I', 'A-WA', 'KI-VI', 'LI-YA'],
    ['Mtoto ni wa ngeli gani?', 'A-WA', 'U-I', 'KI-VI', 'LI-YA'],
    ['Chagua sentensi sahihi.', 'Mti umeanguka.', 'Mti ameanguka.', 'Mti vimeanguka.', 'Mti limeanguka.'],
    ['Chagua sentensi sahihi.', 'Watoto wanacheza.', 'Watoto inacheza.', 'Watoto vinacheza.', 'Watoto linacheza.'],
    ['Wingi wa mti ni upi?', 'miti', 'mati', 'viti', 'watu'],
  ], [
    ['Mlima ___ mrefu. Chagua kiambishi sahihi cha upatanisho.', 'u', 'a', 'ki', 'li'],
    ['Mwalimu ___ anafundisha. Chagua kiambishi sahihi cha upatanisho.', 'a', 'u', 'ki', 'li'],
    ['Miti ___ imekatwa. Chagua kiambishi sahihi cha upatanisho.', 'i', 'wa', 'vi', 'ya'],
    ['Wanyama ___ wanakula. Chagua kiambishi sahihi cha upatanisho.', 'wa', 'i', 'vi', 'ya'],
    ['Ni neno lipi ni la ngeli ya A-WA?', 'mwalimu', 'mlima', 'mti', 'mto'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mti si mtu wala mnyama.', 'Hatua 2: Wingi wake ni miti.', 'Hatua 3: Kwa hiyo mti ni wa ngeli ya A-WA.', 'Mti ni wa ngeli ya U-I.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mtoto ni mtu.', 'Hatua 2: Wingi wake ni watoto.', 'Hatua 3: Kwa hiyo mtoto ni wa ngeli ya U-I.', 'Mtoto ni wa ngeli ya A-WA.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mti ni wa ngeli ya U-I.', 'Hatua 2: Ngeli ya U-I hutumia u-.', 'Hatua 3: Kwa hiyo tunasema "Mti ameanguka".', 'Tunasema "Mti umeanguka".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mwalimu ni wa ngeli ya A-WA.', 'Hatua 2: Wingi wake ni walimu.', 'Hatua 3: Kwa hiyo tunasema "Walimu unafundisha".', 'Tunasema "Walimu wanafundisha".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mlima ni wa ngeli ya U-I.', 'Hatua 2: Wingi wake ni milima.', 'Hatua 3: Kwa hiyo tunasema "Milima wanapendeza".', 'Tunasema "Milima inapendeza".', 2],
  ], ['a', 'b', 'c']),
  ...S('gk', 'SARUFI.T9_NGELI_NA_UPATANISHO_.', 'NGELI_KIVI_LIYA', ['GK_KITABU', 'GK_JIWE', 'GK_UPATANISHO'], ['KI-VI: kitabu, vitabu. LI-YA: jiwe, mawe.', 'KI-VI: ki-, vi-. LI-YA: li-, ya-.'], [
    ['Kitabu ni cha ngeli gani?', 'KI-VI', 'LI-YA', 'U-I', 'A-WA'],
    ['Jiwe ni la ngeli gani?', 'LI-YA', 'KI-VI', 'U-I', 'A-WA'],
    ['Chagua sentensi sahihi.', 'Kitabu kimeanguka.', 'Kitabu limeanguka.', 'Kitabu umeanguka.', 'Kitabu wameanguka.'],
    ['Chagua sentensi sahihi.', 'Mawe yameanguka.', 'Mawe vimeanguka.', 'Mawe wameanguka.', 'Mawe umeanguka.'],
    ['Wingi wa kiti ni upi?', 'viti', 'miti', 'maiti', 'watu'],
  ], [
    ['Kikombe ___ kimevunjika. Chagua kiambishi sahihi.', 'ki', 'li', 'u', 'wa'],
    ['Jino ___ linauma. Chagua kiambishi sahihi.', 'li', 'ki', 'u', 'wa'],
    ['Viatu ___ vimechafuka. Chagua kiambishi sahihi.', 'vi', 'ya', 'wa', 'i'],
    ['Maembe ___ yameiva. Chagua kiambishi sahihi.', 'ya', 'vi', 'wa', 'u'],
    ['Ni neno lipi ni la ngeli ya LI-YA?', 'jicho', 'kiti', 'mtoto', 'mti'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Wingi wa kitabu ni vitabu.', 'Hatua 2: Viambishi ni ki- na vi-.', 'Hatua 3: Kwa hiyo kitabu ni cha ngeli ya LI-YA.', 'Kitabu ni cha ngeli ya KI-VI.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Wingi wa jiwe ni mawe.', 'Hatua 2: Viambishi ni li- na ya-.', 'Hatua 3: Kwa hiyo jiwe ni la ngeli ya KI-VI.', 'Jiwe ni la ngeli ya LI-YA.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kikombe ni cha ngeli ya KI-VI.', 'Hatua 2: Hutumia ki-.', 'Hatua 3: Kwa hiyo tunasema "Kikombe limevunjika".', 'Tunasema "Kikombe kimevunjika".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Maembe ni ya ngeli ya LI-YA.', 'Hatua 2: Hutumia ya-.', 'Hatua 3: Kwa hiyo tunasema "Maembe vimeiva".', 'Tunasema "Maembe yameiva".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jicho ni la ngeli ya LI-YA.', 'Hatua 2: Wingi wake ni macho.', 'Hatua 3: Kwa hiyo tunasema "Macho vinauma".', 'Tunasema "Macho yanauma".', 2],
  ], ['a', 'b', 'c']),
  ...S('vn', 'SARUFI.T10_VINYUME.', 'VINYUME', ['VN_MAANA', 'VN_KIVUMISHI', 'VN_NOMINO'], ['Kinyume ni neno lenye maana kinyume.', 'Fikiria neno lenye maana tofauti kabisa.'], [
    ['Kinyume cha neno ni nini?', 'Neno lenye maana kinyume', 'Neno lenye maana sawa', 'Neno lenye sauti sawa', 'Neno lenye herufi sawa'],
    ['Kinyume cha mrefu ni kipi?', 'mfupi', 'mnene', 'mwembamba', 'mkubwa'],
    ['Kinyume cha mchana ni kipi?', 'usiku', 'asubuhi', 'jioni', 'alasiri'],
    ['Kinyume cha mpya ni kipi?', 'mkuukuu', 'mdogo', 'mzuri', 'mkali'],
    ['Kinyume cha baridi ni kipi?', 'joto', 'upepo', 'mvua', 'kivuli'],
  ], [
    ['Mti huu ni mrefu, ule ni ___. Chagua kinyume.', 'mfupi', 'mnene', 'mpya', 'mkubwa'],
    ['Tunafanya kazi mchana na tunapumzika ___. Chagua kinyume.', 'usiku', 'asubuhi', 'jioni', 'sasa'],
    ['Kisu hiki ni kikali, kile ni ___. Chagua kinyume.', 'butu', 'kidogo', 'kipya', 'kirefu'],
    ['Mwanafunzi mwerevu hutofautiana na mwanafunzi ___. Chagua kinyume.', 'mjinga', 'mrefu', 'mpya', 'mcheshi'],
    ['Safari ya kwenda ni kinyume cha safari ya ___. Chagua kinyume.', 'kurudi', 'kuanza', 'kuona', 'kuomba'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kinyume cha mrefu ni neno la maana kinyume.', 'Hatua 2: Mrefu hupingana na mfupi.', 'Hatua 3: Kwa hiyo kinyume cha mrefu ni mnene.', 'Kinyume cha mrefu ni mfupi.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Mchana hufuatwa na usiku.', 'Hatua 2: Usiku hupingana na mchana.', 'Hatua 3: Kwa hiyo kinyume cha mchana ni asubuhi.', 'Kinyume cha mchana ni usiku.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kinyume ni neno lenye maana tofauti.', 'Hatua 2: Mzuri na mbaya hupingana.', 'Hatua 3: Kwa hiyo kinyume ni neno lenye maana sawa.', 'Kinyume ni neno lenye maana kinyume.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Baridi na joto hupingana.', 'Hatua 2: Ni vinyume.', 'Hatua 3: Kwa hiyo kinyume cha baridi ni upepo.', 'Kinyume cha baridi ni joto.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kinyume cha mpya ni mkuukuu.', 'Hatua 2: Vinahusu hali ya kitu.', 'Hatua 3: Kwa hiyo mpya na mkuukuu vina maana sawa.', 'Vina maana kinyume.', 0],
  ], ['a', 'b', 'c']),
  ...S('ka', 'SARUFI.T11_MNYAMBULIKO_WA_VITEN.', 'KAULI', ['KA_KUTENDEA', 'KA_KUTENDWA', 'KA_KUTENDA'], ['Kutenda: pika. Kutendea: pikia. Kutendwa: pikwa.', 'Kutendea ni kwa ajili ya mtu; kutendwa ni anayepokea tendo.'], [
    ['Ni kitenzi kipi katika kauli ya kutendea?', 'pikia', 'pikwa', 'pika', 'pikiana'],
    ['Ni kitenzi kipi katika kauli ya kutendwa?', 'pikwa', 'pikia', 'pika', 'pikika'],
    ['Ni kitenzi kipi katika kauli ya kutenda?', 'pika', 'pikwa', 'pikia', 'pikiwa'],
    ['Ni sentensi ipi iko katika kauli ya kutendwa?', 'Chakula kimepikwa', 'Mama amepika chakula', 'Mama amempikia mtoto', 'Mama atapika'],
    ['Ni sentensi ipi iko katika kauli ya kutendea?', 'Mama amempikia mtoto chakula', 'Mama amepika chakula', 'Chakula kimepikwa', 'Mama anapika'],
  ], [
    ['Baba alinunua kitabu. Ni kauli ipi?', 'kutenda', 'kutendea', 'kutendwa', 'kutendeka'],
    ['Baba alimnunulia mtoto kitabu. Ni kauli ipi?', 'kutendea', 'kutenda', 'kutendwa', 'kutendeka'],
    ['Kitabu kilinunuliwa na baba. Ni kauli ipi?', 'kutendwa', 'kutendea', 'kutenda', 'kutendeka'],
    ['Kamilisha kwa kutendea: Mama ___ watoto chakula. (pika)', 'anawapikia', 'anapika', 'anapikwa', 'anapikiwa'],
    ['Kamilisha kwa kutendwa: Chakula ___ na mama. (pika)', 'kimepikwa', 'kimepika', 'kimepikia', 'kimepikiwa'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Pikia ni kupika kwa ajili ya mtu.', 'Hatua 2: Ni kauli ya kutendea.', 'Hatua 3: Kwa hiyo pikwa ni kauli ya kutendea pia.', 'Pikwa ni kauli ya kutendwa.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Chakula kimepikwa kinapokea tendo.', 'Hatua 2: Ni kauli ya kutendwa.', 'Hatua 3: Kwa hiyo ni kauli ya kutenda.', 'Ni kauli ya kutendwa.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Pika ni umbo la kawaida.', 'Hatua 2: Ni kauli ya kutenda.', 'Hatua 3: Kwa hiyo pika ni kauli ya kutendwa.', 'Pika ni kauli ya kutenda.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Baba alimnunulia mtoto kitabu.', 'Hatua 2: Tendo limefanywa kwa ajili ya mtoto.', 'Hatua 3: Kwa hiyo ni kauli ya kutendwa.', 'Ni kauli ya kutendea.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kitabu kilinunuliwa.', 'Hatua 2: Kitabu kimepokea tendo.', 'Hatua 3: Kwa hiyo ni kauli ya kutendea.', 'Ni kauli ya kutendwa.', 1],
  ], ['a', 'b']),
  ...S('st', 'SARUFI.T12_AINA_ZA_SENTENSI.', 'SENTENSI', ['ST_AMBATANO_MOJA', 'ST_KIUNGANISHI', 'ST_SAHILI_NYINGI'], ['Sahili: wazo moja. Ambatano: mawazo mawili au zaidi.', 'Tafuta kiunganishi kama na, lakini, au.'], [
    ['Sentensi ambatano ina nini?', 'Mawazo mawili au zaidi yaliyounganishwa', 'Wazo moja tu', 'Neno moja tu', 'Maswali mawili'],
    ['Ni sentensi ipi ni ambatano?', 'Mama anapika na baba analima.', 'Mama anapika chakula.', 'Baba analima shambani leo.', 'Mtoto analala chumbani.'],
    ['Ni sentensi ipi ni sahili?', 'Mtoto mwerevu anasoma.', 'Alikuja lakini aliondoka.', 'Tulicheza na wao walisoma.', 'Soma au uandike.'],
    ['Sentensi sahili ina nini?', 'Wazo moja', 'Mawazo mawili', 'Mawazo matatu', 'Hakuna wazo'],
    ['Ni kiunganishi kipi huunganisha mawazo mawili?', 'lakini', 'kitabu', 'nyumba', 'mrefu'],
  ], [
    ['Juma alisoma, lakini Amina alicheza. Sentensi hii ni ya aina gani?', 'ambatano', 'sahili', 'ya swali', 'ya amri'],
    ['Wanafunzi walifika mapema. Sentensi hii ni ya aina gani?', 'sahili', 'ambatano', 'ya swali', 'ya amri'],
    ['Nitaenda sokoni au nitabaki nyumbani. Sentensi hii ni ya aina gani?', 'ambatano', 'sahili', 'ya swali', 'ya amri'],
    ['Ni sentensi ipi ni ambatano?', 'Alipika na akala.', 'Alipika chakula kitamu kingi.', 'Mama mwema ameondoka.', 'Chakula kimeiva.'],
    ['Ni sentensi ipi ni sahili?', 'Mwalimu mkuu mpya amefika leo.', 'Alisoma na akaandika.', 'Alicheza lakini alishindwa.', 'Tulimwita ila hakuja.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Mama anapika na baba analima" ina mawazo mawili.', 'Hatua 2: Yameunganishwa na na.', 'Hatua 3: Kwa hiyo ni sentensi sahili.', 'Ni sentensi ambatano.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Mtoto mwerevu anasoma kitabu kikubwa" ina wazo moja.', 'Hatua 2: Ni refu lakini lina kitendo kimoja.', 'Hatua 3: Kwa hiyo ni sentensi ambatano.', 'Ni sentensi sahili.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ambatano huunganisha mawazo.', 'Hatua 2: Hutumia kiunganishi.', 'Hatua 3: Kwa hiyo ambatano ina wazo moja tu.', 'Ambatano ina mawazo mawili au zaidi.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Alikuja lakini aliondoka" ina "lakini".', 'Hatua 2: Lakini ni kiunganishi.', 'Hatua 3: Kwa hiyo ni sentensi sahili.', 'Ni sentensi ambatano.', 1],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Sentensi ndefu inaweza kuwa sahili.', 'Hatua 2: Ikiwa ina wazo moja.', 'Hatua 3: Kwa hiyo kila sentensi ndefu ni ambatano.', 'Sentensi ndefu yenye wazo moja ni sahili.', 2],
  ], ['a', 'b', 'c']),
  ...S('uk', 'SARUFI.T13_UKANUSHAJI_KWA_KUZIN.', 'UKANUSHAJI', ['UK_ULIOPO', 'UK_ULIOPITA', 'UK_UJAO'], ['Uliopo: hasomi. Uliopita: hakusoma. Ujao: hatasoma.', 'Tazama wakati kabla ya kukanusha.'], [
    ['Kanusha: Anasoma.', 'Hasomi', 'Hakusoma', 'Hatasoma', 'Hajasoma'],
    ['Kanusha: Alisoma.', 'Hakusoma', 'Hasomi', 'Hatasoma', 'Hajasoma'],
    ['Kanusha: Atasoma.', 'Hatasoma', 'Hakusoma', 'Hasomi', 'Hajasoma'],
    ['Kanusha: Wanacheza.', 'Hawachezi', 'Hawakucheza', 'Hawatacheza', 'Hawajacheza'],
    ['Kanusha: Tulicheza.', 'Hatukucheza', 'Hatuchezi', 'Hatutacheza', 'Hatujacheza'],
  ], [
    ['Jana nilienda sokoni. Kanusha sentensi hii.', 'Jana sikwenda sokoni.', 'Jana siendi sokoni.', 'Jana sitaenda sokoni.', 'Jana sijaenda sokoni.'],
    ['Kesho tutasafiri. Kanusha sentensi hii.', 'Kesho hatutasafiri.', 'Kesho hatukusafiri.', 'Kesho hatusafiri.', 'Kesho hatujasafiri.'],
    ['Sasa anaimba. Kanusha sentensi hii.', 'Sasa haimbi.', 'Sasa hakuimba.', 'Sasa hataimba.', 'Sasa hajaimba.'],
    ['Mama alipika. Kanusha sentensi hii.', 'Mama hakupika.', 'Mama hapiki.', 'Mama hatapika.', 'Mama hajapika.'],
    ['Watoto watalala. Kanusha sentensi hii.', 'Watoto hawatalala.', 'Watoto hawakulala.', 'Watoto hawalali.', 'Watoto hawajalala.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Anasoma" ni wakati uliopo.', 'Hatua 2: Ukanushaji wa uliopo hauna -ku-.', 'Hatua 3: Kwa hiyo ukanushaji ni "hakusoma".', 'Ukanushaji wa "anasoma" ni "hasomi".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Alisoma" ni wakati uliopita.', 'Hatua 2: Ukanushaji wa uliopita hutumia -ku-.', 'Hatua 3: Kwa hiyo ukanushaji ni "hasomi".', 'Ukanushaji wa "alisoma" ni "hakusoma".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Atasoma" ni wakati ujao.', 'Hatua 2: Ukanushaji wa ujao hutumia -ta-.', 'Hatua 3: Kwa hiyo ukanushaji ni "hakusoma".', 'Ukanushaji wa "atasoma" ni "hatasoma".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Walicheza" ni uliopita.', 'Hatua 2: Ukanushaji hutumia -ku-.', 'Hatua 3: Kwa hiyo ukanushaji ni "hawachezi".', 'Ukanushaji ni "hawakucheza".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Tutalala" ni ujao.', 'Hatua 2: Ukanushaji hutumia -ta-.', 'Hatua 3: Kwa hiyo ukanushaji ni "hatukulala".', 'Ukanushaji ni "hatutalala".', 2],
  ], ['c', 'd']),
  ...S('ub', 'SARUFI.T14_UKUBWA_WA_NOMINO.', 'UKUBWA', ['UB_UDOGO', 'UB_KIAMBISHI', 'UB_JUMBA'], ['Ukubwa hutumia ji- au ma-.', 'Jitu ni mtu mkubwa; jibwa ni mbwa mkubwa.'], [
    ['Jibwa ni nini?', 'mbwa mkubwa', 'mbwa mdogo', 'mbwa mwekundu', 'mbwa mwerevu'],
    ['Ni kiambishi kipi cha ukubwa?', 'ji-', 'ki-', 'm-', 'wa-'],
    ['Jumba ni nini?', 'nyumba kubwa', 'nyumba ndogo', 'nyumba mpya', 'nyumba ya zamani'],
    ['Jitu ni nini?', 'mtu mkubwa', 'mtu mdogo', 'mtu mzee', 'mtu mfupi'],
    ['Ni neno lipi liko katika hali ya ukubwa?', 'joka', 'kijiko', 'kitoto', 'kijiji'],
  ], [
    ['Alinunua jumba kubwa mjini. Jumba ni nini?', 'nyumba kubwa', 'nyumba ndogo', 'nyumba ya mbao', 'nyumba ya zamani'],
    ['Tuliona jitu likitembea barabarani. Jitu ni nini?', 'mtu mkubwa', 'mtu mdogo', 'mtoto', 'mzee'],
    ['Mbwa mkubwa huitwaje katika hali ya ukubwa?', 'jibwa', 'kibwa', 'mbwa', 'mbwano'],
    ['Ni kiambishi kipi kimetumika katika "jitu"?', 'ji-', 'ki-', 'ma-', 'wa-'],
    ['Ni neno lipi ni mfano wa ukubwa?', 'jiji', 'kikapu', 'kitabu', 'kiatu'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jibwa hutumia ji-.', 'Hatua 2: Ji- huonyesha ukubwa.', 'Hatua 3: Kwa hiyo jibwa ni mbwa mdogo.', 'Jibwa ni mbwa mkubwa.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kiambishi cha ukubwa ni ji-.', 'Hatua 2: Mfano ni jitu.', 'Hatua 3: Kwa hiyo kiambishi cha ukubwa ni ki-.', 'Kiambishi cha ukubwa ni ji-.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jumba hutokana na nyumba.', 'Hatua 2: Ni nyumba kubwa.', 'Hatua 3: Kwa hiyo jumba ni nyumba ndogo.', 'Jumba ni nyumba kubwa.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Jitu hutokana na mtu.', 'Hatua 2: Ji- huonyesha ukubwa.', 'Hatua 3: Kwa hiyo jitu ni mtu mdogo.', 'Jitu ni mtu mkubwa.', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Ukubwa huonyesha kitu kikubwa.', 'Hatua 2: Ukudogo huonyesha kitu kidogo.', 'Hatua 3: Kwa hiyo ji- huonyesha udogo.', 'Ji- huonyesha ukubwa.', 1],
  ], ['a', 'b', 'c']),
  ...S('us', 'SARUFI.T15_USEMI_HALISI_NA_USEM.', 'USEMI', ['US_MTU', 'US_ALAMA', 'US_WAKATI'], ['Usemi halisi una alama za usemi; wa taarifa hauna.', 'Katika taarifa, "mimi" huwa "yeye".'], [
    ['Ni usemi upi ni wa taarifa?', 'Juma alisema kwamba atakuja.', 'Juma alisema, "Nitakuja."', '"Nitakuja," Juma alisema.', 'Juma: "Nitakuja."'],
    ['Usemi halisi una nini?', 'Maneno kamili ya msemaji katika alama za usemi', 'Maneno ya msemaji bila alama', 'Maneno ya msikilizaji', 'Maneno ya mwandishi'],
    ['Ni usemi upi ni halisi?', 'Mama alisema, "Nitapika."', 'Mama alisema kwamba atapika.', 'Mama alitaka kupika.', 'Mama alipika.'],
    ['Katika usemi wa taarifa, "mimi" hubadilika kuwa nini?', 'yeye', 'sisi', 'wewe', 'wao'],
    ['Usemi wa taarifa hauna nini?', 'alama za usemi', 'kitenzi', 'nomino', 'kiunganishi'],
  ], [
    ['Juma alisema, "Mimi nitaenda." Ni usemi wa taarifa upi?', 'Juma alisema kwamba atakwenda.', 'Juma alisema kwamba mimi nitaenda.', 'Juma alisema, "Atakwenda."', 'Juma alisema nitaenda.'],
    ['Amina alisema, "Ninasoma." Ni usemi wa taarifa upi?', 'Amina alisema kwamba anasoma.', 'Amina alisema kwamba ninasoma.', 'Amina alisema, "Anasoma."', 'Amina alisema ninasoma.'],
    ['Ni sentensi ipi ni usemi wa taarifa?', 'Baba alisema kwamba amechoka.', 'Baba alisema, "Nimechoka."', '"Nimechoka," baba alisema.', 'Baba: "Nimechoka."'],
    ['Ni sentensi ipi ni usemi halisi?', 'Mwalimu alisema, "Someni."', 'Mwalimu alisema kwamba wasome.', 'Mwalimu aliwaambia wasome.', 'Mwalimu alitaka wasome.'],
    ['Mama alisema, "Mimi ninapika." Ni usemi wa taarifa upi?', 'Mama alisema kwamba anapika.', 'Mama alisema kwamba ninapika.', 'Mama alisema, "Anapika."', 'Mama alisema ninapika.'],
  ], [
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Usemi wa taarifa hauna alama za usemi.', 'Hatua 2: Mtu hubadilika.', 'Hatua 3: Kwa hiyo naandika "Juma alisema kwamba mimi nitaenda".', 'Naandika "Juma alisema kwamba atakwenda".', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Usemi halisi una alama za usemi.', 'Hatua 2: Usemi wa taarifa hauna.', 'Hatua 3: Kwa hiyo "Juma alisema kwamba atakuja" una alama za usemi.', 'Usemi wa taarifa hauna alama za usemi.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Usemi halisi ni maneno ya msemaji.', 'Hatua 2: Huwa kamili.', 'Hatua 3: Kwa hiyo usemi halisi ni maneno ya msikilizaji.', 'Usemi halisi ni maneno kamili ya msemaji.', 2],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: "Mimi" ni mtu wa kwanza.', 'Hatua 2: Katika taarifa msemaji huitwa "yeye".', 'Hatua 3: Kwa hiyo "mimi" hubaki "mimi".', 'Katika taarifa "mimi" huwa "yeye".', 0],
    ['Ni hatua ipi ina kosa?', 'Hatua 1: Kwa kubadilisha usemi tunatumia "kwamba".', 'Hatua 2: Tunaondoa alama za usemi.', 'Hatua 3: Kwa hiyo tunahifadhi alama za usemi.', 'Tunaondoa alama za usemi.', 1],
  ], ['a', 'b', 'c']),
];
