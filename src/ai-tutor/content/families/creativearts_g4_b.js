// ============================================================================
// GRADE 4 CREATIVE ARTS, THEME B: RHYTHM AND MELODY (8 skills).
// Only the knowledge half is tested here. Clapping, composing, writing the rhythm names in lettering, singing, hand signs and
// modelling with clay are practical: see docs/qa/creativearts-g4-non-question-outcomes-2026-11-13.md. Notes, rests and signs are
// described in words, because the phone question has no staff or picture. Every wrong answer names the library misconception it
// reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, w, sp } from './creativearts_g4_lib.js';

const RH = 'CREATI.RHYTHM.', ML = 'CREATI.MELODY.';

export const FAMILIES = [
  // ---------------------------------------------------------------- RH.VALUES
  fam('rh.va.beats', `${RH}VALUES`, 'direct', 1, choose([
    ['How many beats does a crotchet last?', 'One beat', [...w('M_CA4_RH_QUAVER_LONGER', 'Two beats', 'Half a beat'), ...w('M_CA4_RH_REST_SKIP', 'No beats')], 'A crotchet lasts one beat.'],
    ['How many beats does a pair of quavers last together?', 'One beat', [...w('M_CA4_RH_QUAVER_LONGER', 'Two beats', 'Four beats'), ...w('M_CA4_RH_QUAVER_REST_FULL', 'Half a beat')], 'A pair of quavers lasts one beat. Each quaver is half a beat.'],
    ['How many beats does one quaver last?', 'Half a beat', [...w('M_CA4_RH_QUAVER_LONGER', 'One whole beat', 'Two beats'), ...w('M_CA4_RH_QUAVER_REST_FULL', 'A quarter of a beat')], 'One quaver is half a beat.'],
    ['What do you do at a crotchet rest?', 'Stay silent for one beat', [...w('M_CA4_RH_REST_SKIP', 'Skip it and go on'), ...w('M_CA4_RH_REST_SOUND', 'Clap loudly', 'Make a sound')], 'A rest is silence that is counted.'],
    ['How many beats does a quaver rest last?', 'Half a beat', [...w('M_CA4_RH_QUAVER_REST_FULL', 'One whole beat', 'Two beats'), ...w('M_CA4_RH_REST_SKIP', 'No time at all')], 'A rest lasts as long as its note. A quaver is half a beat.'],
    ['A pattern is taa, rest, taa. How many beats is that?', 'Three beats', [...w('M_CA4_RH_REST_SKIP', 'Two beats'), ...w('M_CA4_RH_REST_SOUND', 'Four beats'), ...w('M_CA4_RH_REST_SKIP', 'One beat')], 'The rest is counted. 1 + 1 + 1 = 3 beats.'],
  ], { h: ['Count beats, not sounds.', 'A rest is a silent beat that is still counted.'], s1: 'Think about how long each note or rest lasts.' })),
  fam('rh.va.word', `${RH}VALUES`, 'word', 2, choose([
    ['Achieng claps two quick claps in one beat. Which notes are these?', 'A pair of quavers', [...w('M_CA4_RH_QUAVER_LONGER', 'Two crotchets'), ...w('M_CA4_RH_REST_SOUND', 'A crotchet rest'), ...w('M_CA4_RH_QUAVER_LONGER', 'Two long beats')], 'Two quick sounds in one beat are a pair of quavers.'],
    ['Wekesa says a pair of quavers is longer than a crotchet because it has two sounds. What should he know?', 'They are the same length: one beat each', [...w('M_CA4_RH_QUAVER_LONGER', 'He is right, it is two beats'), ...w('M_CA4_RH_QUAVER_LONGER', 'The quavers are shorter than half a beat'), ...w('M_CA4_RH_QUAVER_LONGER', 'The crotchet is two beats')], 'Count beats, not sounds. Both last one beat.'],
    ['Mwajuma\'s pattern is taa, taa, rest. She stops counting at the rest. What should she do?', 'Count the rest as a silent beat', [...w('M_CA4_RH_REST_SKIP', 'Skip the rest'), ...w('M_CA4_RH_REST_SOUND', 'Clap at the rest'), ...w('M_CA4_RH_REST_SKIP', 'Stop the song')], 'A rest is counted but not sounded.'],
    ['Peter claps taa, ta-te, taa. How many beats is the pattern?', 'Three beats', [...w('M_CA4_RH_QUAVER_LONGER', 'Four beats'), ...w('M_CA4_RH_QUAVER_LONGER', 'Five beats'), ...w('M_CA4_RH_QUAVER_LONGER', 'Two beats')], 'Taa is one beat, ta-te is one beat and taa is one beat: three beats.'],
    ['Sofia says a quaver rest is one whole beat of silence. What is the right number of beats?', 'Half a beat', [...w('M_CA4_RH_QUAVER_REST_FULL', 'One whole beat'), ...w('M_CA4_RH_QUAVER_REST_FULL', 'Two beats'), ...w('M_CA4_RH_REST_SKIP', 'No length')], 'A quaver rest is half a beat.'],
  ], { h: ['Count the beats, not the sounds.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Add the beats note by note.' })),
  fam('rh.va.spot', `${RH}VALUES`, 'spot', 3, spot([
    sp('Dan says a pair of quavers lasts two beats. Which step has the mistake?', ['Step 1: Dan claps two quick claps.', 'Step 2: He counts two sounds.', 'Step 3: He says it lasts two beats.'], 2, 'A pair of quavers lasts one beat together.', 'M_CA4_RH_QUAVER_LONGER'),
    sp('Rita skips the rest when she counts. Which step has the mistake?', ['Step 1: Rita reads taa, rest, taa.', 'Step 2: She skips the rest.', 'Step 3: She says it is two beats.'], 1, 'A rest is a silent beat that is still counted. The pattern is three beats.', 'M_CA4_RH_REST_SKIP'),
    sp('Lawi claps at the rest. Which step has the mistake?', ['Step 1: Lawi sees a rest in the pattern.', 'Step 2: He claps at the rest.', 'Step 3: He says he followed the pattern.'], 1, 'A rest is silence. Do not clap.', 'M_CA4_RH_REST_SOUND'),
    sp('Hilda says a quaver rest is one beat. Which step has the mistake?', ['Step 1: Hilda knows a quaver is half a beat.', 'Step 2: She says a quaver rest is one beat.', 'Step 3: She says a rest is silent.'], 1, 'A rest lasts as long as its note, so a quaver rest is half a beat.', 'M_CA4_RH_QUAVER_REST_FULL'),
    sp('Isaac counts taa, ta-te as three beats. Which step has the mistake?', ['Step 1: Isaac claps taa for one beat.', 'Step 2: He counts ta and te as two beats.', 'Step 3: He says the total is three beats.'], 1, 'Ta-te is one beat with two sounds, so the total is two beats.', 'M_CA4_RH_QUAVER_LONGER'),
  ], { h: ['Count beats, not sounds.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- RH.NAMES
  fam('rh.na.which', `${RH}NAMES`, 'direct', 1, choose([
    ['Which French rhythm name is for a crotchet?', 'Taa', [...w('M_CA4_RH_TAA_PAIR', 'Ta-te', 'Taa-te'), ...w('M_CA4_RH_REST_TAA', 'Rest')], 'Taa is one sound for one beat, a crotchet.'],
    ['Which French rhythm name is for a pair of quavers?', 'Ta-te', [...w('M_CA4_RH_TAA_PAIR', 'Taa', 'Taa-taa'), ...w('M_CA4_RH_REST_TAA', 'Sh')], 'Ta-te is two sounds in one beat, a pair of quavers.'],
    ['How many beats does ta-te last?', 'One beat, with two sounds', [...w('M_CA4_RH_TATE_TWO_BEATS', 'Two beats'), ...w('M_CA4_RH_TATE_TWO_BEATS', 'Half a beat'), ...w('M_CA4_RH_TATE_TWO_BEATS', 'Four beats')], 'Ta and te fit into one beat.'],
    ['What do you say aloud at a rest?', 'Nothing, it is silent', [...w('M_CA4_RH_REST_TAA', 'Taa'), ...w('M_CA4_RH_REST_TAA', 'Ta-te'), ...w('M_CA4_RH_REST_TAA', 'Rest, loudly')], 'A rest is silent, so no name is said aloud.'],
    ['How many sounds does taa have?', 'One', [...w('M_CA4_RH_TAA_PAIR', 'Two'), ...w('M_CA4_RH_TAA_PAIR', 'Three'), ...w('M_CA4_RH_REST_TAA', 'None')], 'Taa is one sound lasting one beat.'],
  ], { h: ['Taa is one sound. Ta-te is two quick sounds.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Match the name to the sound and the beat.' })),
  fam('rh.na.word', `${RH}NAMES`, 'word', 2, choose([
    ['Lulu chants taa taa taa. How many beats is that?', 'Three beats', [...w('M_CA4_RH_TAA_PAIR', 'Six beats'), ...w('M_CA4_RH_TATE_TWO_BEATS', 'Two beats'), ...w('M_CA4_RH_REST_TAA', 'Four beats')], 'Each taa is one beat: three beats.'],
    ['Odhiambo chants ta-te ta-te. How many sounds and how many beats?', 'Four sounds in two beats', [...w('M_CA4_RH_TATE_TWO_BEATS', 'Four sounds in four beats'), ...w('M_CA4_RH_TATE_TWO_BEATS', 'Two sounds in two beats'), ...w('M_CA4_RH_TATE_TWO_BEATS', 'Two sounds in four beats')], 'Each ta-te has two sounds in one beat.'],
    ['Faith says ta-te is the name for a crotchet. What should she say?', 'Taa is the name for a crotchet', [...w('M_CA4_RH_TAA_PAIR', 'She is right'), ...w('M_CA4_RH_TAA_PAIR', 'A crotchet has no name'), ...w('M_CA4_RH_REST_TAA', 'Rest is the name')], 'Taa is the crotchet. Ta-te is a pair of quavers.'],
    ['In taa, rest, taa Brian says taa for the rest too. What should he do?', 'Stay silent at the rest', [...w('M_CA4_RH_REST_TAA', 'Say taa quietly'), ...w('M_CA4_RH_REST_TAA', 'Say ta-te'), ...w('M_CA4_RH_REST_TAA', 'Say rest aloud')], 'A rest is silent.'],
    ['Which name does Mary say for a pair of quavers?', 'Ta-te', [...w('M_CA4_RH_TAA_PAIR', 'Taa'), ...w('M_CA4_RH_TAA_PAIR', 'Taa taa'), ...w('M_CA4_RH_REST_TAA', 'Sh')], 'A pair of quavers is ta-te.'],
  ], { h: ['Taa is one sound. Ta-te is two quick sounds.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Match the name to the note.' })),
  fam('rh.na.spot', `${RH}NAMES`, 'spot', 3, spot([
    sp('Yusuf says ta-te lasts two beats. Which step has the mistake?', ['Step 1: Yusuf says ta-te.', 'Step 2: He hears two sounds.', 'Step 3: He says it lasts two beats.'], 2, 'Ta-te has two sounds in one beat.', 'M_CA4_RH_TATE_TWO_BEATS'),
    sp('Jane says taa is a pair of quavers. Which step has the mistake?', ['Step 1: Jane claps one sound for one beat.', 'Step 2: She says it is taa.', 'Step 3: She says taa is a pair of quavers.'], 2, 'Taa is a crotchet. Ta-te is a pair of quavers.', 'M_CA4_RH_TAA_PAIR'),
    sp('Ken says taa at a rest. Which step has the mistake?', ['Step 1: Ken reads a rest.', 'Step 2: He says taa aloud.', 'Step 3: He keeps the beat.'], 1, 'A rest is silent. Say nothing.', 'M_CA4_RH_REST_TAA'),
    sp('Nora counts ta-te as two beats. Which step has the mistake?', ['Step 1: Nora claps ta-te.', 'Step 2: She counts ta as one beat and te as one beat.', 'Step 3: She says it is two beats.'], 1, 'Ta and te together are one beat.', 'M_CA4_RH_TATE_TWO_BEATS'),
    sp('Tito says ta-te is a crotchet. Which step has the mistake?', ['Step 1: Tito chants ta-te.', 'Step 2: He says it has two sounds.', 'Step 3: He says it is a crotchet.'], 2, 'Ta-te is a pair of quavers. A crotchet is taa.', 'M_CA4_RH_TAA_PAIR'),
  ], { h: ['Taa one sound, ta-te two sounds in one beat, rest silent.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- RH.RHQUAL
  fam('rh.ql.which', `${RH}RHQUAL`, 'direct', 1, choose([
    ['Which pattern has variation?', 'Taa ta-te taa taa', [...w('M_CA4_RH_ALL_SAME', 'Taa taa taa taa', 'Ta-te ta-te ta-te ta-te')], 'It mixes different note values.'],
    ['What does repetition do in a pattern?', 'It makes a part easy to remember', [...w('M_CA4_RH_NO_REPEAT', 'It makes the pattern wrong', 'It makes the pattern boring and bad'), ...w('M_CA4_RH_ALL_SAME', 'It makes every note the same')], 'Repeating part of a pattern helps people remember it.'],
    ['A good rhythmic pattern ends on...', 'A long note', [...w('M_CA4_RH_END_SHORT', 'A short note', 'A pair of quavers'), ...w('M_CA4_RH_END_SHORT', 'A rest only')], 'A long note makes it sound finished.'],
    ['Which is a quality of a good rhythmic pattern?', 'Variation of note values', [...w('M_CA4_RH_ALL_SAME', 'Every note is the same'), ...w('M_CA4_RH_NO_REPEAT', 'It never repeats'), ...w('M_CA4_RH_END_SHORT', 'It ends on a short note')], 'Good patterns mix note values.'],
    ['Which pattern ends well?', 'Ta-te taa, then one long held note', [...w('M_CA4_RH_END_SHORT', 'Taa taa, then a quick ta-te'), ...w('M_CA4_RH_END_SHORT', 'Taa ta-te, then a quick ta-te'), ...w('M_CA4_RH_END_SHORT', 'Ta-te ta-te, then a quick ta-te')], 'It ends on a long note.'],
  ], { h: ['Variation, repetition, a long ending.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Think of the three qualities.' })),
  fam('rh.ql.word', `${RH}RHQUAL`, 'word', 2, choose([
    ['Gift\'s pattern is taa taa taa taa. Her friend says it has no variation. Is the friend right?', 'Yes, every note is the same', [...w('M_CA4_RH_ALL_SAME', 'No, it has the most variation'), ...w('M_CA4_RH_ALL_SAME', 'No, same notes make it good'), ...w('M_CA4_RH_NO_REPEAT', 'No, because it repeats')], 'Variation means mixing different note values.'],
    ['Hassan wants his rhythm to be easy to remember. What should he do?', 'Repeat part of the pattern', [...w('M_CA4_RH_NO_REPEAT', 'Never repeat anything'), ...w('M_CA4_RH_ALL_SAME', 'Use only one note'), ...w('M_CA4_RH_END_SHORT', 'End on a short note')], 'Repetition helps people remember the pattern.'],
    ['Mary wants her rhythm to sound finished. How should it end?', 'On a long note', [...w('M_CA4_RH_END_SHORT', 'On a short note'), ...w('M_CA4_RH_END_SHORT', 'In the middle of a bar'), ...w('M_CA4_RH_END_SHORT', 'On a quick pair of quavers')], 'Ending on a long note sounds finished.'],
    ['Peter says a good rhythm has to be very fast. What is the best answer?', 'No, a good rhythm has variation, repetition and a long ending', [...w('M_CA4_RH_ALL_SAME', 'Yes, fast makes it good'), ...w('M_CA4_RH_NO_REPEAT', 'Yes, and it must never repeat'), ...w('M_CA4_RH_END_SHORT', 'Yes, and it ends short')], 'Speed does not make a pattern good.'],
    ['Zuri\'s pattern repeats a short part twice. What quality is that?', 'Repetition', [...w('M_CA4_RH_NO_REPEAT', 'A mistake'), ...w('M_CA4_RH_ALL_SAME', 'Variation'), ...w('M_CA4_RH_END_SHORT', 'A short ending')], 'Repeating a part is repetition, which is good.'],
  ], { h: ['Variation, repetition, a long ending.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Name the quality being described.' })),
  fam('rh.ql.spot', `${RH}RHQUAL`, 'spot', 3, spot([
    sp('Ben says a good pattern uses one note value only. Which step has the mistake?', ['Step 1: Ben claps taa taa taa taa.', 'Step 2: He hears no change.', 'Step 3: He says this is the best pattern.'], 2, 'A good pattern has variation of note values.', 'M_CA4_RH_ALL_SAME'),
    sp('Amy says a good pattern never repeats. Which step has the mistake?', ['Step 1: Amy composes a pattern.', 'Step 2: She removes every repeated part.', 'Step 3: She says repeating is wrong.'], 2, 'Repetition helps people remember the pattern.', 'M_CA4_RH_NO_REPEAT'),
    sp('Fred ends his pattern on a short note. Which step has the mistake?', ['Step 1: Fred claps taa ta-te taa.', 'Step 2: He ends on ta-te.', 'Step 3: He says it ends well.'], 2, 'A good pattern ends on a long note.', 'M_CA4_RH_END_SHORT'),
    sp('Sara says repeating a part makes the pattern wrong. Which step has the mistake?', ['Step 1: Sara repeats a short part.', 'Step 2: People remember it easily.', 'Step 3: She says it is wrong.'], 2, 'Repetition is a good quality.', 'M_CA4_RH_NO_REPEAT'),
    sp('Karim says ta-te ta-te ta-te ta-te has variation. Which step has the mistake?', ['Step 1: Karim claps four ta-te.', 'Step 2: Every note value is the same.', 'Step 3: He says it has variation.'], 2, 'Variation means different note values.', 'M_CA4_RH_ALL_SAME'),
  ], { h: ['Variation, repetition, a long ending.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- RH.LETTERING
  fam('rh.le.which', `${RH}LETTERING`, 'direct', 1, choose([
    ['Which letter has an ascender?', 'b', [...w('M_CA4_RH_B_DESC', 'p', 'g', 'y')], 'The letter b goes up above the main body.'],
    ['Which letter has a descender?', 'g', [...w('M_CA4_RH_G_ASC', 'd', 'h', 'k')], 'The letter g goes below the line.'],
    ['Which letter has neither an ascender nor a descender?', 'a', [...w('M_CA4_RH_ALL_ASC', 'k', 'q', 'l')], 'The letter a stays in the main body.'],
    ['What is an ascender?', 'The part of a letter that goes up above the body', [...w('M_CA4_RH_B_DESC', 'The part that goes below the line'), ...w('M_CA4_RH_ALL_ASC', 'The dot of every letter'), ...w('M_CA4_RH_ALL_ASC', 'A thick line')], 'An ascender goes up. The letters b, d, h, k and l have ascenders.'],
    ['What is a descender?', 'The part of a letter that goes below the line', [...w('M_CA4_RH_G_ASC', 'The part that goes above the body'), ...w('M_CA4_RH_ALL_ASC', 'The top of every letter'), ...w('M_CA4_RH_ALL_ASC', 'A thin line')], 'A descender goes below the line. The letters g, j, p, q and y have descenders.'],
    ['Which letter has an ascender?', 'h', [...w('M_CA4_RH_B_DESC', 'j', 'q', 'y')], 'The letter h goes up above the main body.'],
  ], { h: ['Does the letter go above or below the line?', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Imagine the letter on a ruled line.' })),
  fam('rh.le.word', `${RH}LETTERING`, 'word', 2, choose([
    ['Nyokabi writes the word dog. Which letter in it has a descender?', 'g', [...w('M_CA4_RH_G_ASC', 'd'), ...w('M_CA4_RH_ALL_ASC', 'o'), ...w('M_CA4_RH_G_ASC', 'None of them')], 'The g goes below the line.'],
    ['Otieno writes the word kite in lowercase. Which letter has an ascender?', 'k', [...w('M_CA4_RH_B_DESC', 'e'), ...w('M_CA4_RH_ALL_ASC', 'i'), ...w('M_CA4_RH_B_DESC', 'None of them')], 'The k goes up above the main body.'],
    ['Rose writes the word ace. How many letters have an ascender or descender?', 'None', [...w('M_CA4_RH_ALL_ASC', 'One'), ...w('M_CA4_RH_ALL_ASC', 'Two'), ...w('M_CA4_RH_ALL_ASC', 'All three')], 'The letters a, c and e stay in the main body.'],
    ['Juma says p has an ascender because the line goes up. What should he know?', 'The line of p goes below the line, so it is a descender', [...w('M_CA4_RH_B_DESC', 'He is right'), ...w('M_CA4_RH_B_DESC', 'It has neither'), ...w('M_CA4_RH_ALL_ASC', 'It is a capital letter')], 'The letter p has a descender.'],
    ['Aisha says g has an ascender. What is the best answer?', 'No, g has a descender below the line', [...w('M_CA4_RH_G_ASC', 'Yes, g goes up'), ...w('M_CA4_RH_ALL_ASC', 'No, g has neither'), ...w('M_CA4_RH_G_ASC', 'Yes, g has both')], 'The letter g goes below the line.'],
  ], { h: ['Picture the word on a ruled line.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Check each letter above or below the line.' })),
  fam('rh.le.spot', `${RH}LETTERING`, 'spot', 3, spot([
    sp('Neil says g has an ascender. Which step has the mistake?', ['Step 1: Neil writes g on a ruled line.', 'Step 2: The tail goes below the line.', 'Step 3: He says g has an ascender.'], 2, 'A tail below the line is a descender.', 'M_CA4_RH_G_ASC'),
    sp('Abby says b has a descender. Which step has the mistake?', ['Step 1: Abby writes b on a ruled line.', 'Step 2: The tall stem goes above the body.', 'Step 3: She says b has a descender.'], 2, 'A tall stem above the body is an ascender.', 'M_CA4_RH_B_DESC'),
    sp('Oscar says every letter has an ascender or a descender. Which step has the mistake?', ['Step 1: Oscar writes the word ace.', 'Step 2: All three letters stay in the main body.', 'Step 3: He says each has an ascender or descender.'], 2, 'Letters like a, c and e have neither.', 'M_CA4_RH_ALL_ASC'),
    sp('Hanna says d has a descender. Which step has the mistake?', ['Step 1: Hanna writes d.', 'Step 2: The stem goes up above the body.', 'Step 3: She says d has a descender.'], 2, 'A stem going up is an ascender.', 'M_CA4_RH_B_DESC'),
    sp('Elias says y has an ascender. Which step has the mistake?', ['Step 1: Elias writes y on a ruled line.', 'Step 2: The tail goes below the line.', 'Step 3: He says y has an ascender.'], 2, 'A tail below the line is a descender.', 'M_CA4_RH_G_ASC'),
  ], { h: ['Up is ascender. Down is descender.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- ML.SOLFA
  fam('ml.sf.order', `${ML}SOLFA`, 'direct', 1, choose([
    ['Which syllable is the lowest of d, r and m?', 'd', [...w('M_CA4_ML_M_LOWEST', 'm'), ...w('M_CA4_ML_ORDER_MIX', 'r'), ...w('M_CA4_ML_ORDER_MIX', 'They are all the same')], 'D is the lowest.'],
    ['Which syllable is the highest of d, r and m?', 'm', [...w('M_CA4_ML_D_HIGHEST', 'd'), ...w('M_CA4_ML_ORDER_MIX', 'r'), ...w('M_CA4_ML_ORDER_MIX', 'They are all the same')], 'M is the highest.'],
    ['Which is the right order from low to high?', 'd r m', [...w('M_CA4_ML_ORDER_MIX', 'r d m', 'm r d', 'd m r')], 'From low to high: d, r, m.'],
    ['A melody goes up from r. Which syllable comes next?', 'm', [...w('M_CA4_ML_D_HIGHEST', 'd'), ...w('M_CA4_ML_ORDER_MIX', 'r again'), ...w('M_CA4_ML_ORDER_MIX', 'None')], 'Going up from r you reach m.'],
    ['A short melody sounds finished when it ends on...', 'd, the home note', [...w('M_CA4_ML_END_ANY', 'Any syllable', 'm', 'r')], 'D is the home note, so ending on d sounds finished.'],
  ], { h: ['Think of stairs: d at the bottom, m at the top.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Put d, r and m in order of pitch.' })),
  fam('ml.sf.word', `${ML}SOLFA`, 'word', 2, choose([
    ['Naserian sings d r m. Does her voice go up or down?', 'Up', [...w('M_CA4_ML_M_LOWEST', 'Down'), ...w('M_CA4_ML_ORDER_MIX', 'It stays the same'), ...w('M_CA4_ML_M_LOWEST', 'Up, then down')], 'D r m goes up in pitch.'],
    ['Kofi sings m r d. Does his voice go up or down?', 'Down', [...w('M_CA4_ML_D_HIGHEST', 'Up'), ...w('M_CA4_ML_ORDER_MIX', 'It stays the same'), ...w('M_CA4_ML_D_HIGHEST', 'Up, then down')], 'M r d goes down in pitch.'],
    ['Ali says d is the highest because it is sung first. What should he know?', 'D is the lowest. M is the highest', [...w('M_CA4_ML_D_HIGHEST', 'He is right'), ...w('M_CA4_ML_ORDER_MIX', 'R is the highest'), ...w('M_CA4_ML_D_HIGHEST', 'They are all the same')], 'The first syllable sung is not always the highest.'],
    ['Joy wants her melody to sound finished. Where should she end it?', 'On d', [...w('M_CA4_ML_END_ANY', 'On any syllable'), ...w('M_CA4_ML_END_ANY', 'On m'), ...w('M_CA4_ML_END_ANY', 'On r')], 'D is the home note.'],
    ['Mwangi puts the syllables in the order r d m from low to high. What is the right order?', 'd r m', [...w('M_CA4_ML_ORDER_MIX', 'r d m'), ...w('M_CA4_ML_ORDER_MIX', 'm d r'), ...w('M_CA4_ML_M_LOWEST', 'm r d')], 'From low to high: d, r, m.'],
  ], { h: ['d is the lowest and m is the highest.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Think about the order from low to high.' })),
  fam('ml.sf.spot', `${ML}SOLFA`, 'spot', 3, spot([
    sp('Liam says m is the lowest. Which step has the mistake?', ['Step 1: Liam sings d r m.', 'Step 2: He hears the voice climb.', 'Step 3: He says m is the lowest.'], 2, 'D is the lowest and m is the highest.', 'M_CA4_ML_M_LOWEST'),
    sp('Maya says d is the highest because it comes first. Which step has the mistake?', ['Step 1: Maya sings d first.', 'Step 2: She then sings r and m.', 'Step 3: She says d is the highest.'], 2, 'D is the lowest. The first sung is not always the highest.', 'M_CA4_ML_D_HIGHEST'),
    sp('Noor writes the order r d m from low to high. Which step has the mistake?', ['Step 1: Noor lists the syllables.', 'Step 2: She puts r first.', 'Step 3: She says this is low to high.'], 1, 'From low to high the order is d, r, m.', 'M_CA4_ML_ORDER_MIX'),
    sp('Paul ends his melody on r and says it is finished. Which step has the mistake?', ['Step 1: Paul sings d r m r.', 'Step 2: He stops on r.', 'Step 3: He says it sounds finished.'], 2, 'A melody sounds finished on d, the home note.', 'M_CA4_ML_END_ANY'),
    sp('Quinn says m r d goes up. Which step has the mistake?', ['Step 1: Quinn sings m r d.', 'Step 2: He hears the voice drop.', 'Step 3: He says it goes up.'], 2, 'M r d goes down.', 'M_CA4_ML_M_LOWEST'),
  ], { h: ['d low, r middle, m high.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- ML.SIGNS
  fam('ml.sg.which', `${ML}SIGNS`, 'direct', 1, choose([
    ['Which sol-fa syllable is shown by a closed fist held low?', 'd', [...w('M_CA4_ML_SIGN_MIX', 'm', 'r')], 'D is a closed fist held low.'],
    ['How is the syllable m shown?', 'With a flat hand, palm down', [...w('M_CA4_ML_M_FIST', 'With a closed fist'), ...w('M_CA4_ML_SIGN_MIX', 'With a hand sloping upward', 'With the thumb down')], 'M is a flat hand with the palm down.'],
    ['How is the syllable r shown?', 'With a hand sloping upward', [...w('M_CA4_ML_SIGN_MIX', 'With a closed fist'), ...w('M_CA4_ML_SIGN_MIX', 'With a flat hand, palm down'), ...w('M_CA4_ML_SIGN_MIX', 'With two hands together')], 'R is a hand sloping upward.'],
    ['As the pitch goes up from d to m, the hand...', 'Moves higher', [...w('M_CA4_ML_SIGN_DOWN', 'Moves lower', 'Stays at the same height'), ...w('M_CA4_ML_SIGN_DOWN', 'Moves behind the back')], 'The hand is held higher as the pitch gets higher.'],
    ['Which sign is held highest?', 'm', [...w('M_CA4_ML_SIGN_DOWN', 'd'), ...w('M_CA4_ML_SIGN_DOWN', 'r'), ...w('M_CA4_ML_SIGN_DOWN', 'They are at the same height')], 'M is the highest note, so its sign is held highest.'],
  ], { h: ['Think: fist low, sloping hand, flat hand high.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Match the sign to the syllable.' })),
  fam('ml.sg.word', `${ML}SIGNS`, 'word', 2, choose([
    ['The teacher shows a closed fist held low. Which syllable should the class sing?', 'd', [...w('M_CA4_ML_SIGN_MIX', 'm'), ...w('M_CA4_ML_SIGN_MIX', 'r'), ...w('M_CA4_ML_SIGN_MIX', 'None')], 'A closed fist held low is d.'],
    ['The teacher shows a flat hand with the palm down, held high. Which syllable should the class sing?', 'm', [...w('M_CA4_ML_M_FIST', 'd'), ...w('M_CA4_ML_SIGN_MIX', 'r'), ...w('M_CA4_ML_SIGN_MIX', 'None')], 'A flat hand with the palm down is m.'],
    ['Wambui raises her hand as her class sings d r m. Why?', 'The pitch goes up, so the hand goes higher', [...w('M_CA4_ML_SIGN_DOWN', 'The pitch goes down, so the hand goes higher'), ...w('M_CA4_ML_SIGN_DOWN', 'She is tired'), ...w('M_CA4_ML_SIGN_DOWN', 'The hand always goes up')], 'The hand rises with the pitch.'],
    ['Peter shows m with a closed fist. What should he change?', 'Use a flat hand with the palm down', [...w('M_CA4_ML_M_FIST', 'Nothing, it is right'), ...w('M_CA4_ML_SIGN_MIX', 'Use a sloping hand'), ...w('M_CA4_ML_SIGN_MIX', 'Use two fists')], 'M is a flat hand, palm down.'],
    ['The teacher shows a hand sloping upward. Which syllable is it?', 'r', [...w('M_CA4_ML_SIGN_MIX', 'd'), ...w('M_CA4_ML_SIGN_MIX', 'm'), ...w('M_CA4_ML_SIGN_MIX', 'None')], 'A hand sloping upward is r.'],
  ], { h: ['d fist, r slope, m flat.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Match each sign to its syllable.' })),
  fam('ml.sg.spot', `${ML}SIGNS`, 'spot', 3, spot([
    sp('Carl lowers his hand as the pitch goes up. Which step has the mistake?', ['Step 1: Carl sings d r m.', 'Step 2: The pitch goes up.', 'Step 3: He lowers his hand.'], 2, 'The hand goes higher as the pitch goes higher.', 'M_CA4_ML_SIGN_DOWN'),
    sp('Dora shows m with a fist. Which step has the mistake?', ['Step 1: Dora wants to show m.', 'Step 2: She makes a closed fist.', 'Step 3: She says it is m.'], 2, 'M is a flat hand with the palm down. D is the fist.', 'M_CA4_ML_M_FIST'),
    sp('Eric shows d with a flat hand held high. Which step has the mistake?', ['Step 1: Eric wants to show d.', 'Step 2: He shows a flat hand held high.', 'Step 3: He says it is d.'], 1, 'D is a closed fist held low.', 'M_CA4_ML_SIGN_MIX'),
    sp('Fiona holds the sign for d at the same height as m. Which step has the mistake?', ['Step 1: Fiona shows d.', 'Step 2: She holds it high, like m.', 'Step 3: She says the heights are the same.'], 2, 'The sign for d is held low and the sign for m higher.', 'M_CA4_ML_SIGN_DOWN'),
    sp('George shows r with a closed fist. Which step has the mistake?', ['Step 1: George wants to show r.', 'Step 2: He shows a closed fist.', 'Step 3: He says it is r.'], 1, 'R is a hand sloping upward. The fist is d.', 'M_CA4_ML_SIGN_MIX'),
  ], { h: ['d fist low, r slope, m flat and higher.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- ML.MELQUAL
  fam('ml.mq.which', `${ML}MELQUAL`, 'direct', 1, choose([
    ['Which melody has variation?', 'd r m r d', [...w('M_CA4_ML_ONE_SYLLABLE', 'm m m m m', 'd d d d d')], 'It uses different syllables.'],
    ['A good short melody ends on...', 'd', [...w('M_CA4_ML_END_NOT_D', 'm', 'r', 'any syllable')], 'D is the home note.'],
    ['What does stepwise motion mean?', 'Moving to the next syllable', [...w('M_CA4_ML_STEP_JUMPS', 'Jumping over syllables', 'Jumping very far'), ...w('M_CA4_ML_ONE_SYLLABLE', 'Staying on one syllable')], 'Stepwise motion is moving to the next syllable.'],
    ['Which melody uses stepwise motion?', 'd r m r d', [...w('M_CA4_ML_STEP_JUMPS', 'd m d m d'), ...w('M_CA4_ML_ONE_SYLLABLE', 'm m m m m'), ...w('M_CA4_ML_STEP_JUMPS', 'd m r m d')], 'It moves to the next syllable each time.'],
    ['Which is a quality of a good melody?', 'It ends on d', [...w('M_CA4_ML_ONE_SYLLABLE', 'It uses one syllable only'), ...w('M_CA4_ML_END_NOT_D', 'It ends on m'), ...w('M_CA4_ML_STEP_JUMPS', 'It only has big jumps')], 'A good melody ends on d.'],
  ], { h: ['Steps, variety, end on d.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Think of the three qualities.' })),
  fam('ml.mq.word', `${ML}MELQUAL`, 'word', 2, choose([
    ['Atieno\'s melody is m m m m m. Her friend says it has no variation. Is the friend right?', 'Yes, it uses one syllable only', [...w('M_CA4_ML_ONE_SYLLABLE', 'No, one syllable is the most varied'), ...w('M_CA4_ML_ONE_SYLLABLE', 'No, it has many syllables'), ...w('M_CA4_ML_STEP_JUMPS', 'No, it has big jumps')], 'Variation means different syllables and lengths.'],
    ['Ben wants his melody to sound finished. Where should he end?', 'On d', [...w('M_CA4_ML_END_NOT_D', 'On m, the highest'), ...w('M_CA4_ML_END_NOT_D', 'On any syllable'), ...w('M_CA4_ML_END_NOT_D', 'On r')], 'D is the home note.'],
    ['Cherono walks up the stairs one step at a time while singing d r m. What does this show?', 'Stepwise motion', [...w('M_CA4_ML_STEP_JUMPS', 'Big jumps'), ...w('M_CA4_ML_ONE_SYLLABLE', 'One syllable'), ...w('M_CA4_ML_END_NOT_D', 'A finished melody')], 'Moving to the next syllable is stepwise motion.'],
    ['David says stepwise motion means jumping over syllables. What is the best answer?', 'No, it means moving to the next syllable', [...w('M_CA4_ML_STEP_JUMPS', 'Yes, it is jumping'), ...w('M_CA4_ML_ONE_SYLLABLE', 'No, it means one syllable'), ...w('M_CA4_ML_END_NOT_D', 'No, it means ending on d')], 'Stepwise motion is moving to the next syllable.'],
    ['Evelyn wants her melody to be interesting. What should she do?', 'Use different syllables and lengths', [...w('M_CA4_ML_ONE_SYLLABLE', 'Use one syllable only'), ...w('M_CA4_ML_ONE_SYLLABLE', 'Use the same length each time'), ...w('M_CA4_ML_STEP_JUMPS', 'Use only big jumps')], 'Variation makes a melody interesting.'],
  ], { h: ['Steps, variety, end on d.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Name the quality being described.' })),
  fam('ml.mq.spot', `${ML}MELQUAL`, 'spot', 3, spot([
    sp('Gil says a good melody uses one syllable. Which step has the mistake?', ['Step 1: Gil sings m m m m.', 'Step 2: There is no change.', 'Step 3: He says it is a good melody.'], 2, 'A good melody has variation of syllables.', 'M_CA4_ML_ONE_SYLLABLE'),
    sp('Hope ends her melody on m. Which step has the mistake?', ['Step 1: Hope composes d r m r m.', 'Step 2: She ends on m.', 'Step 3: She says it ends well.'], 2, 'A good melody ends on d.', 'M_CA4_ML_END_NOT_D'),
    sp('Ivan says stepwise motion is big jumps. Which step has the mistake?', ['Step 1: Ivan sings d r m.', 'Step 2: Each note is next to the last.', 'Step 3: He says these are big jumps.'], 2, 'Moving to the next syllable is stepwise motion.', 'M_CA4_ML_STEP_JUMPS'),
    sp('Jill says ending on any syllable is fine. Which step has the mistake?', ['Step 1: Jill sings d r m r.', 'Step 2: She stops on r.', 'Step 3: She says it is finished.'], 2, 'A good melody ends on d.', 'M_CA4_ML_END_NOT_D'),
    sp('Kai says d d d d is varied. Which step has the mistake?', ['Step 1: Kai sings d d d d.', 'Step 2: Every syllable is the same.', 'Step 3: He says it is varied.'], 2, 'Variation means different syllables.', 'M_CA4_ML_ONE_SYLLABLE'),
  ], { h: ['Steps, variety, end on d.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),

  // ---------------------------------------------------------------- ML.CLAY
  fam('ml.cl.how', `${ML}CLAY`, 'direct', 1, choose([
    ['What state should clay be in for modelling?', 'Soft and damp', [...w('M_CA4_ML_CLAY_DRY', 'Dry and hard', 'Burning hot', 'Frozen')], 'Clay is shaped while damp and soft.'],
    ['What is a coil?', 'A rolled snake of clay', [...w('M_CA4_ML_CLAY_COIL', 'A flat sheet of clay', 'A round ball of clay'), ...w('M_CA4_ML_CLAY_COIL', 'A cut square of clay')], 'A slab is flat. A coil is a rolled snake.'],
    ['What is a slab?', 'A flat piece of clay', [...w('M_CA4_ML_CLAY_COIL', 'A rolled snake of clay'), ...w('M_CA4_ML_CLAY_COIL', 'A tiny ball of clay'), ...w('M_CA4_ML_CLAY_COIL', 'A tool')], 'A slab is a flat piece of clay.'],
    ['What is done to clay before modelling?', 'Stones are removed and it is kneaded', [...w('M_CA4_ML_CLAY_STONES', 'Nothing, it is used as it is'), ...w('M_CA4_ML_CLAY_DRY', 'It is dried hard'), ...w('M_CA4_ML_CLAY_STONES', 'It is mixed with sand and stones')], 'Remove stones and knead so it does not crack.'],
    ['What joins a coil letter to the slab?', 'A little water on the clay', [...w('M_CA4_ML_CLAY_GLUE', 'Strong glue', 'Tape', 'A nail')], 'Clay pieces are joined with a little water and pressed.'],
  ], { h: ['Think about how clay is prepared and joined.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Remember: damp, no stones, a little water to join.' })),
  fam('ml.cl.word', `${ML}CLAY`, 'word', 2, choose([
    ['Lena finds her clay has gone hard and dry. What should she do?', 'Add a little water and knead it soft', [...w('M_CA4_ML_CLAY_DRY', 'Use it just as it is, hard and dry'), ...w('M_CA4_ML_CLAY_DRY', 'Heat it more over the fire'), ...w('M_CA4_ML_CLAY_STONES', 'Add stones to make it firm')], 'Clay is shaped while soft and damp.'],
    ['Musa rolls clay into a long thin snake to make the letter d. What is the snake called?', 'A coil', [...w('M_CA4_ML_CLAY_COIL', 'A slab'), ...w('M_CA4_ML_CLAY_COIL', 'A tile'), ...w('M_CA4_ML_CLAY_COIL', 'A brick')], 'A rolled snake of clay is a coil.'],
    ['Nadia sees a small stone in her clay. What should she do?', 'Take it out and knead the clay', [...w('M_CA4_ML_CLAY_STONES', 'Leave it in and keep on going'), ...w('M_CA4_ML_CLAY_STONES', 'Add more stones'), ...w('M_CA4_ML_CLAY_DRY', 'Dry the clay hard')], 'Stones make clay crack.'],
    ['Omar wants his coil r to stay on the slab. What should he use?', 'A little water, then press', [...w('M_CA4_ML_CLAY_GLUE', 'Strong glue from the shop'), ...w('M_CA4_ML_CLAY_GLUE', 'Sticky tape on the back'), ...w('M_CA4_ML_CLAY_GLUE', 'A pin through the clay')], 'Water and pressing joins clay.'],
    ['Pam rolls clay flat and cuts three rectangles of different sizes. What did she make?', 'Slabs', [...w('M_CA4_ML_CLAY_COIL', 'Coils'), ...w('M_CA4_ML_CLAY_COIL', 'Beads'), ...w('M_CA4_ML_CLAY_COIL', 'Snakes')], 'Flat pieces of clay are slabs.'],
  ], { h: ['Clay stays damp. Coils are snakes. Slabs are flat.', 'Cross out the answers that cannot be right, then pick from the rest.'], s1: 'Think of what to do with the clay.' })),
  fam('ml.cl.spot', `${ML}CLAY`, 'spot', 3, spot([
    sp('Quin says clay must be dry and hard before shaping. Which step has the mistake?', ['Step 1: Quin has some clay.', 'Step 2: He dries it hard.', 'Step 3: He tries to bend it.'], 1, 'Clay is shaped while soft and damp.', 'M_CA4_ML_CLAY_DRY'),
    sp('Ria says a coil is a flat sheet. Which step has the mistake?', ['Step 1: Ria rolls clay into a snake.', 'Step 2: She calls it a coil.', 'Step 3: She says a coil is a flat sheet.'], 2, 'A coil is a rolled snake. A slab is flat.', 'M_CA4_ML_CLAY_COIL'),
    sp('Sam leaves stones in the clay. Which step has the mistake?', ['Step 1: Sam digs clay.', 'Step 2: He leaves small stones in it.', 'Step 3: He models with it.'], 1, 'Remove the stones and knead the clay.', 'M_CA4_ML_CLAY_STONES'),
    sp('Tina joins her coil to the slab with glue. Which step has the mistake?', ['Step 1: Tina shapes the letter m with a coil.', 'Step 2: She uses glue to join it.', 'Step 3: She says glue is needed for clay.'], 1, 'A little water and pressing joins clay.', 'M_CA4_ML_CLAY_GLUE'),
    sp('Uzi says a slab is a rolled snake. Which step has the mistake?', ['Step 1: Uzi rolls clay flat.', 'Step 2: He cuts a rectangle.', 'Step 3: He says it is a rolled snake.'], 2, 'A flat piece is a slab.', 'M_CA4_ML_CLAY_COIL'),
  ], { h: ['Damp clay, no stones, water to join.', 'Read each step on its own and ask whether it is true.'], s1: 'Read each step and find the one that is not true.' })),
];
