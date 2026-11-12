# Kiswahili Grade 5: what a native speaker must check, and what questions cannot test (12 Nov 2026)

Package P3a of `USAGE_PLAN_NEXT_50.md`. Written offline by Claude; no model was called for the content. Every family is a **draft, switched off for children**, and the signed list `kiswahili_g5_signed.js` is empty. Nothing reaches a child until a native Kiswahili speaker who teaches Kiswahili has read it and a family id is added to the signed list.

The generated pack `kiswahili-g5-review-2026-11-12.md` lists every skill, every misconception, one drawn example per family and how to sign. This note adds what the pack cannot: where Claude is least sure, and the outcomes a question cannot reach.

## 1. What to check, in order of risk

**Read every item.** Each is in Kiswahili sanifu with Kenyan names and contexts. Check spelling, concord, register, and that exactly one option is right.

**Where Claude is least sure (please look at these first):**

| Where | The worry |
|---|---|
| `kiswahili_g5_b.js`, U-YA (`ngeli.uya`) | The class has few Grade 5 nouns. Only ugonjwa, unyoya and uchungu are used. Please confirm them, confirm `ya-` agreement, and give 3 to 5 more nouns so the family has more than 6 cases. |
| `kiswahili_g5_b.js`, U-ZI plurals | ukuta - kuta, wimbo - nyimbo, ubao - mbao, ufunguo - funguo, uso - nyuso, ulimi - ndimi, uzi - nyuzi. Confirm each, and that the wrong forms (mikuta, mawimbo, mibao and so on) are not good Kiswahili for these nouns. |
| `kiswahili_g5_b.js`, I-ZI | Animals and people were left out on purpose because most books put them in A-WA. Confirm the KICD design does the same for Grade 5. |
| `kiswahili_g5_c.js`, ukubwa na udogo of **n- nouns** | jumba, kijumba, jibwa, kibwa, jindoo, kindoo. These are the least regular forms. Please confirm or replace them with the ones the KICD design and the Grade 5 learner's book use. The m- nouns (jitoto, kitoto, jiji, kijiji, kijito, kijiti, jikono, kikono, jiguu, kikate) also need a check. |
| `kiswahili_g5_c.js`, vinyume vya vitenzi | Confirm kufunga - kufungua, kuvaa - kuvua, kuingia - kutoka, kupanda - kushuka, kujenga - kubomoa, kuamka - kulala, kufunika - kufunua, kuziba - kuzibua. Check the distractors marked as near-synonyms (kuziba, kuvalia, kuingiza, kupandisha, kuunda, kuamsha) are not also acceptable answers. |
| `kiswahili_g5_c.js`, mnyambuliko | The three forms are glossed as: kutendewa (done for someone: kupikiwa, kuandikiwa), kutendeka (can be done or happens by itself: kuvunjika, kusomeka, kufunguka), kutendana (to each other: kupendana, kusalimiana). Confirm these glosses suit Grade 5 and that no distractor is also correct. |
| `kiswahili_g5_c.js`, ukanushaji | Ten negatives (sisomi, hajasoma, hakusoma, hatutasoma, hasomi, hawachezi, hatujala, sikuja, hamsomi, hutakula). Confirm each, above all hatujala and sikuja. |
| `kiswahili_g5_e.js`, methali and nahau | The KICD themes are bidii (methali) and usafi na mazingira (nahau). Claude used well known methali about hard work and general nahau, because it could not read the design's own list. Please replace or add the nahau of **usafi na mazingira** and check every meaning. |
| `kiswahili_g5_e.js`, vitendawili | Six riddles and their answers (yai, kivuli, kitana, sindano). Confirm each is a real, known kitendawili and that no distractor is also a fair answer (for example nazi for the second yai riddle). |
| `kiswahili_g5_e.js`, visawe and tashbihi | Confirm the synonym sets (accepted alternatives are separated by a bar in the source) and the tashbihi (mkali kama simba, mwoga kama sungura, mpole kama kondoo, mwepesi kama swala, mchapakazi kama sisimizi, ana nguvu kama ndovu). |
| `kiswahili_g5_e.js`, maneno ya heshima | Confirm the family words (shangazi, mjomba, binamu, bibi, babu, baba mkubwa, mama mkubwa, mama mdogo) and the greeting pair shikamoo and marahaba. |
| `kiswahili_g5_f.js`, baruapepe and insha | The parts of an email (Kwa, Mada, salamu, ujumbe, hitimisho, jina) and the short texts for wasifu, masimulizi and maelezo. Confirm the terms are the ones the Grade 5 book uses. |
| `kiswahili_g5_d.js`, passages | Two stories (Uji wa Bibi, Siku ya Kupanda Miti) and one play (Safari ya Sokoni) are original. Check the level for a ten-year-old (the English reading-level formula cannot read Kiswahili, so it is switched off for it), the glosses (kuchemsha, kukoroga, madonge, mche, uzio, aliahidi, kuandamana, kuchelewa, kikapu, kutabasamu, kurudi) and the mizani counts of the eight poem lines. |
| `kiswahili_g5_a.js`, uakifishi | The sentences with Je and the koma in a list. Confirm the rule in the Kiswahili books (no koma before the final na is used here). |

**The misconception library** (`curriculum/kiswahili/g5.json`, 108 entries, all `draft`): each entry has the wrong idea, the revealing question, the repair, the line the child is told (in Kiswahili) and a source. The source is "common learner error; to confirm by a native Kiswahili teacher" (or English or mother-tongue influence). Please mark each entry as real, rare or wrong, and add the errors you see every week that are missing.

**Signing:** add the ids of the families you accept to `src/ai-tutor/content/families/kiswahili_g5_signed.js` (`export const SIGNED = [...]`). Nobody else signs. A signed family reaches children only when the school door for Kiswahili is also on.

## 2. Known limits of this build (nothing to fix in the content)

- **A passage needs a screen.** Passage families carry `passage: { title, text }` on the problem, as English does. The screen that shows it is still to be built before any such family is signed on.
- **The spot-the-mistake frame is in English.** Its labels ("Step 1", "One step has a mistake") come from `families/core.js`, a shared file, so the child sees "Step 1" to "Step 4" over four Kiswahili sentences. The explanation after it is in Kiswahili. A Kiswahili frame needs a change to the shared kit.
- **Capital letters are not marked in typed answers.** The word marker folds case, as it does for English. A tapped option is matched exactly, so the uakifishi family (whole sentences) does mark capitals and punctuation.
- **Accepted alternatives are authored per item** (for example bashasha, shangazi). Please add the alternatives a teacher would accept.
- **A few families have only two named wrong answers** (kamusi, ukubwa na udogo, the insha definitions). They are marked thinOk. More distractors would help once the reviewer has chosen the nouns.
- **"Kutunga" and "kutumia" outcomes are tested by a proxy.** Where an outcome says compose or use in a sentence (for example SARUFI nomino b), the question asks the child to choose or type the word that completes a sentence. It does not test writing a whole sentence.

## 3. Outcomes a question cannot test

The 186 official outcomes were classified with the rules of `SUBJECTS_STRUCTURE.md`: Q 88, W 11, O 36, A 51. **73 of the 88 Q outcomes have a family** (a skill that lists them and has families); 15 Q outcomes have none because they are really practical or oral. **9 O outcomes** (vitendawili a, maneno ya heshima a, methali a and b, nahau a and b, visawe a, tashbihi a and b) have recognition and meaning questions, and the speaking part still needs a teacher. No W or A outcome has a family.

| Class | Outcomes | What they need |
|---|---|---|
| Q, no family | 15 | A teacher or a practical task (first table below) |
| W, writing | 11 | Composition marking (insha marker out of 20, flagged for a native-speaker review) or a teacher with the KICD rubric |
| O, speaking, listening and reading aloud | 36 | Teacher observation in the lesson (PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| A, attitudes | 51 | One termly teacher line per learner, exceptions only; never a question |

### Q outcomes without a family

| Outcome | Text | Needs |
|---|---|---|
| KUSOMA.T3_KUSOMA_KWA_UFASAHA.c | kusoma kifungu kwa kasi ifaayo | reading aloud at a fitting speed or with signs: a teacher listens |
| KUSOMA.T3_KUSOMA_KWA_UFASAHA.e | kusoma kifungu kwa kuambatanisha ishara zifaazo | reading aloud at a fitting speed or with signs: a teacher listens |
| KUANDI.T3_KUANDIKA_KWA_TARAKIL.b | kutumia tarakilishi ili kujenga maarifa ya kidijitali | using a computer: a practical task with a teacher watching |
| KUSOMA.T4_KUSOMA_KWA_MAPANA.b | kutambua msamiati wa suala lengwa katika matini ya kidijitali | using a digital device and a safe site: a practical task |
| KUSOMA.T4_KUSOMA_KWA_MAPANA.c | kusakura matini kwenye tovuti salama ili kupata vifungu vya kusoma vyenye suala lengwa | using a digital device and a safe site: a practical task |
| KUSOMA.T6_KUSOMA_KWA_KINA.a | kutambua makala ya kusoma katika maktaba ili kuimarisha uchaguzi bora wa makala | choosing and reading library texts: teacher observation, a reading log or a portfolio |
| KUSOMA.T7_KUSOMA_KWA_MAPANA.a | kutambua matini anazotaka kusoma kwenye maktaba | choosing and reading texts: teacher observation, a reading log or a portfolio |
| KUSOMA.T7_KUSOMA_KWA_MAPANA.b | kusoma matini ili kufaidika na ujumbe na lugha inayotumiwa | choosing and reading texts: teacher observation, a reading log or a portfolio |
| KUSOMA.T9_KUSOMA_KWA_MAPANA.a | kutambua matini za aina mbalimbali za kusoma na kuchagua zinazomvutia | choosing and reading texts: teacher observation, a reading log or a portfolio |
| KUSOMA.T9_KUSOMA_KWA_MAPANA.b | kusoma matini alizochagua ili kufaidika na ujumbe na lugha iliyotumiwa | choosing and reading texts: teacher observation, a reading log or a portfolio |
| KUSOMA.T10_MATINI_YA_KIDIJITALI.b | kutambua na kufungua faili iliyo na kifungu cha kusoma ili kuimarisha umilisi wake wa kutumia tarakilishi | using a digital device and a safe site: a practical task |
| KUSOMA.T10_MATINI_YA_KIDIJITALI.c | kusakura kwenye tovuti salama ili kupata vifungu vya kusoma | using a digital device and a safe site: a practical task |
| KUSOMA.T10_MATINI_YA_KIDIJITALI.d | kutumia vyombo vya kidijitali kwa urahisi kupata matini zinazolengwa | using a digital device and a safe site: a practical task |
| KUSOMA.T11_KUSOMA_KWA_UFASAHA.c | kusoma kifungu kwa kasi ifaayo | reading aloud at a fitting speed or with signs: a teacher listens |
| KUSOMA.T11_KUSOMA_KWA_UFASAHA.e | kusoma kifungu kwa kuambatanisha ishara zifaazo | reading aloud at a fitting speed or with signs: a teacher listens |

### W outcomes: composition

| Outcome | Text | Needs |
|---|---|---|
| KUSIKI.T1_MATAMSHI_BORA_SAUTI_.d | kutunga vitanzandimi vyenye maana kutokana na sauti zinazokaribiana kimatamshi: f/v, s/z, l/r na th/dh) | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T1_INSHA_YA_WASIFU.b | kuandika insha ya wasifu kwa ubunifu ili kujenga maelezo yenye kutoa picha dhahiri | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T2_INSHA_YA_MASIMULIZI.b | kuandika insha ya masimulizi kwa kufuata kanuni zifaazo | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T4_BARUAPEPE.b | kuandika baruapepe kwa kuzingatia ujumbe, muundo na mtindo | Composition marking of a baruapepe (HOREB insha marker out of 20, after its native-speaker review) or a teacher with the KICD rubric |
| KUANDI.T5_INSHA_YA_MAELEZO.b | kuandika insha ya maelezo kwa kufuata kanuni zifaazo | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T6_INSHA_YA_WASIFU.b | kuandika insha ya wasifu kwa kuzingatia muundo na mtindo ufaao | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T7_INSHA_YA_MAELEZO.b | kuandika insha ya maelezo kwa kuzingatia muundo na mtindo ufaao | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T8_INSHA_ZA_MASIMULIZI.b | kuandika insha ya masimulizi kwa kufuata kanuni zifaazo | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T9_INSHA_YA_MAELEZO.b | kuandika insha ya maelezo kwa kufuata mtindo na muundo ufaao | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T10_INSHA_YA_MASIMULIZI.b | kuandika insha ya masimulizi kwa kufuata kanuni zifaazo | Composition marking: HOREB insha marker out of 20 (waits for native-speaker review) or a teacher with the KICD rubric; a typed or photographed piece |
| KUANDI.T11_BARUAPEPE.b | kuandika baruapepe kwa kuzingatia ujumbe, muundo na mtindo | Composition marking of a baruapepe (HOREB insha marker out of 20, after its native-speaker review) or a teacher with the KICD rubric |

### O outcomes: speaking, listening, reading aloud

| Outcome | Text | Needs |
|---|---|---|
| KUSIKI.T1_MATAMSHI_BORA_SAUTI_.a | kutambua silabi zinazotokana na sauti zinazokaribiana katika maneno: f/v, s/z, l/r na th/dh | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T1_MATAMSHI_BORA_SAUTI_.b | kutamka silabi zinazotokana na sauti zinazokaribiana kimatamshi: f/v, s/z, l/r na th/dh ili kutofautisha matamshi yake | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T1_MATAMSHI_BORA_SAUTI_.c | kutamka vitanzandimi vinavyoundwa kwa silabi za sauti zinazokaribiana kimatamshi: f/v, s/z, l/r na th/dh ili kuimarisha mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T2_MAAMKUZI_NA_MAAGANO.a | kutambua aina mbalimbali za maamkuzi na maagano katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T2_MAAMKUZI_NA_MAAGANO.b | kueleza maamkuzi na maagano yanayotumika katika miktadha mbalimbali ili kuyabainisha | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T2_MAAMKUZI_NA_MAAGANO.c | kutumia aina mbalimbali za maamkuzi na maagano katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T3_VITENDAWILI.a | kutambua vitendawili vya suala lengwa | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill VITENDAWILI); the speaking itself is not |
| KUSIKI.T3_VITENDAWILI.b | kutega na kutegua vitendawili ili kujenga matamshi bora | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSOMA.T3_KUSOMA_KWA_UFASAHA.b | kusoma kifungu kwa kuzingatia matamshi bora | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSOMA.T3_KUSOMA_KWA_UFASAHA.d | kusoma kifungu kwa kutumia sauti ipasavyo | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSIKI.T4_MANENO_YA_HESHIMA_NA.a | kutambua maneno ya heshima yanayohusiana na udugu yanayotumiwa katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill HESHIMA); the speaking itself is not |
| KUSIKI.T4_MANENO_YA_HESHIMA_NA.b | kutumia maneno ya heshima yanayohusiana na udugu kwa usahihi katika mazungumzo yake ya kila siku | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T5_METHALI.a | kutambua methali zinazohusu bidii ili kuzitofautisha na aina zingine za methali | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill METHALI); the speaking itself is not |
| KUSIKI.T5_METHALI.b | kueleza maana na matumizi ya methali mbalimbali zinazohusu bidii katika jamii | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill METHALI); the speaking itself is not |
| KUSIKI.T5_METHALI.c | kutumia methali zinazohusu bidii katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T6_USHAIRI.a | kukariri shairi kwa kuzingatia matamshi na mahadhi mbalimbali | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T6_USHAIRI.b | kueleza maana ya msamiati uliotumiwa katika shairi | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T6_USHAIRI.c | kutumia msamiati uliotumiwa katika shairi kuboresha mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T6_USHAIRI.d | kuonyesha ufahamu wa ujumbe katika shairi kwa kujibu maswali | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSOMA.T6_KUSOMA_KWA_KINA.b | kusoma makala mbalimbali ili kujenga ufasaha wa lugha | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSIKI.T7_NAHAU.a | kutambua nahau za usafi na mazingira katika matini mbalimbali | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill NAHAU); the speaking itself is not |
| KUSIKI.T7_NAHAU.b | kufafanua maana za nahau mbalimbali za usafi na mazingira kwa kutoa mifano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill NAHAU); the speaking itself is not |
| KUSIKI.T7_NAHAU.c | kutumia nahau za usafi na mazingira katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T8_VISAWE.a | kutambua maneno matatu yenye maana sawa katika matini | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill VISAWE); the speaking itself is not |
| KUSIKI.T8_VISAWE.b | kutumia visawe ifaavyo katika mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSOMA.T8_KUSOMA_KWA_UFAHAMU.b | kusoma mchezo mfupi wa kuigiza kwa ufasaha | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSOMA.T8_KUSOMA_KWA_UFAHAMU.e | kuigiza mchezo mfupi ili kukuza uwezo wa kujieleza | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.a | kutambua miktadha mbalimbali kunakotumiwa lugha rasmi ili kukuza mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.b | kutumia lugha katika miktadha rasmi ili kufanikisha mawasiliano | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T10_TASHBIHI.a | kutambua tashbihi za tabia katika matini ili kuzibainisha | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill TASHBIHI); the speaking itself is not |
| KUSIKI.T10_TASHBIHI.b | kutumia tashbihi za tabia kwa usahihi katika sentensi | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later. Recognition and meaning are tested by questions (skill TASHBIHI); the speaking itself is not |
| KUSIKI.T11_MASIMULIZI.a | kusikiliza masimulizi kwa kuzingatia ujumbe | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T11_MASIMULIZI.b | kusimulia tungo mbele ya wenzake kwa kuzingatia mada, ubunifu na usanifu wa lugha | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSIKI.T11_MASIMULIZI.c | kutumia ishara zifaazo kuimarisha masimulizi yake | Speaking and listening check: teacher observation in the lesson (lesson fold-out, PLAN_OBSERVATION_RUBRICS.md) or an oral task; a voice tool later |
| KUSOMA.T11_KUSOMA_KWA_UFASAHA.b | kusoma kifungu kwa kuzingatia matamshi bora | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |
| KUSOMA.T11_KUSOMA_KWA_UFASAHA.d | kusoma kifungu kwa kutumia sauti ipasavyo | Teacher listens to the learner read aloud (reading check with the KICD rubric); a voice tool later |

### A outcomes: attitudes

| Outcome | Text | Needs |
|---|---|---|
| KUSIKI.T1_MATAMSHI_BORA_SAUTI_.e | kuchangamkia kukariri vitanzandimi vinavyotungwa kwa silabi za sauti zinazokaribiana kimatamshi: f/v, s/z, l/r na th/dh) ili kuimarisha matamshi yake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T1_KUSOMA_KWA_UFAHAMU.e | kujenga mazoea ya usomaji bora katika maisha ya kila siku | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T1_INSHA_YA_WASIFU.c | kufurahia kutunga insha bora ili kuimarisha mazoea ya kuandika | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T1_AINA_ZA_NOMINO.c | kuchangamkia matumizi ya nomino za pekee katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T1_AINA_ZA_NOMINO_2.c | kufurahia kutumia nomino za kawaida katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T2_MAAMKUZI_NA_MAAGANO.d | kuchangamkia maamkuzi na maagano katika mahusiano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T2_KUSOMA_KWA_KINA.c | kuchangamkia kutumia kamusi katika kukuza msamiati wake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T2_INSHA_YA_MASIMULIZI.c | kuchangamkia utunzi mzuri wa insha ya masimulizi ili kukuza ubunifu wake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T2_AINA_ZA_NOMINO.c | kufurahia kutumia nomino za wingi katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T2_AINA_ZA_NOMINO_2.c | kufurahia kutumia nomino za vitenzi- jina katika utungaji wa sentensi na kujaza nafasi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T3_VITENDAWILI.c | kuchangamkia matumizi ya vitendawili kama njia ya kujenga utamkaji bora wa maneno | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T3_KUSOMA_KWA_UFASAHA.f | kuchangamkia kusoma kifungu kwa kuzingatia vipengele vya usomaji | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T3_KUANDIKA_KWA_TARAKIL.c | kujenga mazoea ya kutumia tarakilishi kuandika na kuhifadhi maandishi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T3_AINA_ZA_NOMINO.c | kufurahia kutumia nomino za makundi katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T3_AINA_ZA_NOMINO_2.c | kuonea fahari matumizi ya nomino ambata katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T3_AINA_ZA_NOMINO_3.d | kuonea fahari matumizi ya nomino za dhahania katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T3_UAKIFISHI.c | kufurahia matumizi ya herufi kubwa, koma, kikomo na kiulizi katika maandishi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T4_MANENO_YA_HESHIMA_NA.c | kuthamini matumizi ya maneno ya heshima katika mawasiliano ya kila siku | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T4_KUSOMA_KWA_MAPANA.d | kuchangamkia matumizi ya vifaa vya kidijitali katika kutafuta na kusoma ujumbe ili kuimarisha maarifa yake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T4_BARUAPEPE.c | kuchangamkia uandishi wa baruapepe katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T4_NGELI_YA_I_ZI.d | kuonea fahari matumizi ya nomino katika ngeli ya I-ZI katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T5_METHALI.d | kuchangamkia matumizi ya methali katika kuhimiza bidii | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T5_KUSOMA_KWA_UFAHAMU.c | kuchangamkia kusoma shairi akizingatia mapigo ya sauti | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T5_INSHA_YA_MAELEZO.c | kuchangamkia utunzi mzuri wa insha ili kuimarisha uandishi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T5_NGELI_YA_U_ZI.d | kufurahia matumizi ya nomino za ngeli ya U-ZI katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T6_USHAIRI.e | kuchangamkia ushairi kama njia ya kujieleza kwa ufasaha | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T6_KUSOMA_KWA_KINA.c | kufurahia kusoma makala mbalimbali ili kujenga ufasaha wa lugha | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T6_INSHA_YA_WASIFU.c | kufurahia uandishi wa insha za wasifu ili kukuza stadi ya kuandika | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T6_NGELI_YA_U_YA.d | kufurahia matumizi ya nomino za ngeli ya U-YA katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T7_NAHAU.d | kuthamini matumizi ya nahau za usafi na mazingira katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T7_KUSOMA_KWA_MAPANA.c | kufurahia usomaji wa matini za aina mbalimbali ili kujenga utamaduni wa kusoma | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T7_INSHA_YA_MAELEZO.c | kuchangamkia utungaji wa insha za maelezo ili kuimarisha uandishi bora | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T7_NGELI_YA_KU_KU.d | kufurahia matumizi ya ngeli ya KU-KU katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T8_VISAWE.c | kuthamini matumizi ya visawe katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T8_KUSOMA_KWA_UFAHAMU.f | kufurahia kusoma michezo na kuigiza | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T8_INSHA_ZA_MASIMULIZI.c | kuchangamkia utunzi mzuri | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T8_MNYAMBULIKO_WA_VITEN.c | kuchangamkia matumizi ya vitenzi katika hali ya kutendewa, kutendeka na kutendana katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T9_MAZUNGUMZO_YA_KIMUKT.c | kuchangamkia matumizi ya lugha katika miktadha rasmi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T9_KUSOMA_KWA_MAPANA.c | kufurahia usomaji wa aina mbalimbali za matini ili kupanua mawazo yake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T9_INSHA_YA_MAELEZO.c | kuchangamkia utunzi mzuri wenye ujumbe mahususi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T9_VINYUME_VYA_VITENZI.c | kuchangamkia matumizi ya vinyume vya vitenzi katika mawasiliano ya kila siku | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T10_TASHBIHI.c | kufurahia matumizi ya tashbihi za tabia katika mawasiliano ya kila siku | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T10_MATINI_YA_KIDIJITALI.e | kuchangamkia matumizi ya vifaa vya kidijitali katika kutafuta na kusoma ujumbe ili kuimarisha maarifa yake | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T10_INSHA_YA_MASIMULIZI.c | kuchangamkia utunzi mzuri wa insha | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T10_NYAKATI_NA_HALI.d | kufurahia matumizi ya hali ya mazoea na timilifu katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSIKI.T11_MASIMULIZI.d | kuchangamkia masimulizi katika mazingira mbalimbali | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUSOMA.T11_KUSOMA_KWA_UFASAHA.f | kuchangamkia kusoma kifungu kwa kuzingatia vipengele vya usomaji | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| KUANDI.T11_BARUAPEPE.c | kuchangamkia uandishi wa baruapepe katika mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T11_UKANUSHAJI.d | kufurahia ukanushaji wa viambishi vya nafsi na wakati katika sentensi | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T11_UKUBWA_NA_UDOGO_WA_N.e | kufurahia kutumia nomino katika hali ya ukubwa na udogo kwa usahihi ili kuimarisha mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |
| SARUFI.T11_UKUBWA_NA_UDOGO_WA_N_2.e | kufurahia kutumia nomino katika hali ya ukubwa na udogo kwa usahihi ili kuimarisha mawasiliano | Attitude: one termly teacher line per learner (exceptions only), never a question and never into the learner model |

