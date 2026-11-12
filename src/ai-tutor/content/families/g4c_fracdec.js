// ============================================================================
// GRADE 4 MATHEMATICS, NUMBERS: FRACTIONS, DECIMALS and USE OF LETTERS.
// Written from the KICD 2024 design through the curriculum map. Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, sh, mc, tbl } from './g4c_lib.js';

const F = 'NUMBER.FRACTIONS.', C = 'NUMBER.DECIMALS.', L = 'NUMBER.USE_OF_LETTERS.';
const ITEMS = ['chapati', 'cake', 'pizza', 'bar of soap', 'roll of cloth'];
const GROUPS = [['goats', 'black'], ['mangoes', 'ripe'], ['learners', 'in the choir'], ['chickens', 'brown'], ['books', 'new']];

export const FAMILIES = [
  // ------------------------------------------------------------ NUM_DEN
  fam({ id: 'g4c.frac.numden.which', cs: `${F}NUM_DEN`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(4, 12), k = randInt(2, n - 2), wantNum = Math.random() < 0.5, pe = person(), item = pick(ITEMS);
      return { question: `A baker slices a ${item} into ${n} equal slices and gives ${k} of the slices to a customer. On the till slip the slices given away are written as the fraction ${k}/${n}. What is the ${wantNum ? 'numerator' : 'denominator'} of that fraction?`, answer: wantNum ? k : n,
        wrong: wantNum ? [[n, `${n} is the denominator. It says how many equal parts the whole was cut into.`, 'M_FRAC_SWAP_NUM_DEN'], [n - k, `${n - k} is the number of parts not taken. The numerator is the number taken.`, 'M_FRAC_SHADED_OVER_UNSHADED'], [n + k, 'A fraction is not one number made by adding. Read the top number.', 'M_FRAC_TWO_NUMBERS_SEPARATE']] : [[k, `${k} is the numerator. It says how many parts are taken.`, 'M_FRAC_SWAP_NUM_DEN'], [n - k, `${n - k} is the number of parts left. The denominator is how many parts in all.`, 'M_FRAC_SHADED_OVER_UNSHADED'], [n + k, 'A fraction is not one number made by adding. Read the bottom number.', 'M_FRAC_TWO_NUMBERS_SEPARATE']],
        hints: ['The numerator is the top number. The denominator is the bottom number.', 'The denominator names the equal parts; the numerator counts those taken.'], steps: [`The fraction is ${k}/${n}: top ${k}, bottom ${n}.`, wantNum ? `The numerator is ${k}.` : `The denominator is ${n}.`], chk: (x) => x === (wantNum ? k : n) };
    } }),

  // ------------------------------------------------------------ FRACTION_OF_WHOLE
  fam({ id: 'g4c.frac.whole.shaded', cs: `${F}FRACTION_OF_WHOLE`, form: 'direct', rung: 1,
    gen: () => {
      const n = randInt(3, 12), k = randInt(1, n - 1), item = pick(ITEMS);
      const options = mc(`${k}/${n}`, [[`${k}/${n - k}`, 'You put the shaded parts over the unshaded parts. The bottom number is all the equal parts.', 'M_FRAC_SHADED_OVER_UNSHADED'], [`${n}/${k}`, 'The numerator is the parts taken, so it goes on top.', 'M_FRAC_SWAP_NUM_DEN'], [`${k}/${n - 1}`, 'Count the parts, not the cuts. The bottom number is the number of parts.', 'M_FRAC_COUNT_CUTS']]);
      if (!options || k === n - k) return null;
      return { question: `A ${item} is cut into ${n} equal parts and ${k} ${k === 1 ? 'part is' : 'parts are'} eaten. Which fraction of the ${item} is eaten?`, options, instruction: 'Choose the fraction.',
        hints: ['The bottom number is how many equal parts there are in all.', 'The top number is how many parts are eaten.'], steps: [`The ${item} has ${n} equal parts.`, `${k} are eaten, so the fraction is ${k}/${n}.`] };
    } }),
  fam({ id: 'g4c.frac.whole.cuts', cs: `${F}FRACTION_OF_WHOLE`, form: 'word', rung: 2,
    gen: () => {
      const c = randInt(2, 7), parts = c + 1, k = randInt(1, parts - 1), pe = person();
      const options = mc(`${k}/${parts}`, [[`${k}/${c}`, 'You counted the cuts. There is one more part than cuts.', 'M_FRAC_COUNT_CUTS'], [`${c}/${parts}`, 'The top number is the parts taken, not the cuts.', 'M_FRAC_WRONG_NUMBER_OF_PARTS'], [`${parts}/${k}`, 'The numerator goes on top.', 'M_FRAC_SWAP_NUM_DEN']]);
      if (!options || k === c) return null;
      return { question: `${pe.name} cuts a long ribbon with ${c} straight cuts into equal pieces, then gives ${pe.her} friend ${k} ${k === 1 ? 'piece' : 'pieces'}. What fraction of the ribbon does the friend get?`, options, instruction: 'Choose the fraction.',
        hints: ['Count the pieces, not the cuts.', 'Draw the ribbon and mark the cuts.'], steps: [`${c} cuts make ${parts} equal pieces.`, `The friend gets ${k} of ${parts}: ${k}/${parts}.`] };
    } }),

  // ------------------------------------------------------------ FRACTION_OF_GROUP
  fam({ id: 'g4c.frac.group.what', cs: `${F}FRACTION_OF_GROUP`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(5, 12), k = randInt(1, n - 1), [what, prop] = pick(GROUPS);
      const options = mc(`${k}/${n}`, [[`${k}/${n - k}`, 'The whole is the whole group, not the ones without the property.', 'M_FRAC_GROUP_PART_OVER_OTHER'], [`${n - k}/${n}`, `That is the fraction that are not ${prop}.`, 'M_FRAC_GROUP_PART_OVER_OTHER'], [`${n}/${k}`, 'The part goes on top and the whole group goes on the bottom.', 'M_FRAC_SWAP_NUM_DEN']]);
      if (!options || k === n - k) return null;
      return { question: `There are ${n} ${what} in a pen and ${k} of them are ${prop}. What fraction of the ${what} are ${prop}?`, options, instruction: 'Choose the fraction.',
        hints: ['The whole is all the animals or things in the group.', 'Put the number with the property over the number in the whole group.'], steps: [`The whole group has ${n}.`, `${k} are ${prop}, so ${k}/${n}.`] };
    } }),
  fam({ id: 'g4c.frac.group.of-number', cs: `${F}FRACTION_OF_GROUP`, form: 'word', rung: 2,
    gen: () => {
      const d = pick([2, 3, 4, 5, 6, 8, 10]), a = randInt(1, d - 1), one = randInt(2, 9), N = d * one, pe = person(), [what] = pick(GROUPS);
      if (a === 1 && Math.random() < 0.5) return null;
      const ans = one * a;
      return { question: `${pe.name} has ${N} ${what}. ${a}/${d} of them are sold at the market. How many ${what} are sold?`, answer: ans,
        wrong: [[N / (a || 1), `You divided by the numerator. Divide by the denominator ${d}, then take ${a} of the parts.`, 'M_FRAC_OF_GROUP_DIVIDES_WRONG'], [one, a > 1 ? `${one} is one part. You need ${a} parts.` : 'Check by drawing the equal groups.', 'M_FRAC_OF_GROUP_ONE_PART_ONLY'], [N - ans, 'That is the number not sold.', 'M_FRAC_GROUP_PART_OVER_OTHER'], [a + d, 'A fraction of a group is found by dividing, not adding.', 'M_FRAC_OF_GROUP_DIVIDES_WRONG']],
        hints: [`Share the ${N} into ${d} equal groups.`, `Then take ${a} of the groups.`], steps: [`${N} divided by ${d} is ${one}.`, `${a} x ${one} = ${ans}.`], chk: (x) => x * d === N * a };
    } }),

  // ------------------------------------------------------------ TENTH_HUNDREDTH
  fam({ id: 'g4c.dec.tenth.square', cs: `${C}TENTH_HUNDREDTH`, form: 'direct', rung: 1,
    gen: () => {
      const k = randInt(2, 8), wantCol = Math.random() < 0.5;
      const right = wantCol ? `${k}/10` : `${k}/100`;
      const options = mc(right, wantCol ? [[`${k}/100`, 'A whole column of 10 small squares is a tenth, not a hundredth.', 'M_DEC_HUNDREDTH_SAME_AS_TENTH'], [`${10 * k}/10`, 'A tenth is one of ten equal parts, not ten.', 'M_DEC_TENTH_AS_TEN'], [`1/${k}`, 'Count the equal parts in the whole square: it has 10 columns.', 'M_DEC_PARTS_NOT_EQUAL']] : [[`${k}/10`, 'Single small squares are hundredths. There are 100 of them in the whole square.', 'M_DEC_HUNDREDTH_SAME_AS_TENTH'], [`${k}/${k * 10}`, 'The whole square has 100 equal small squares.', 'M_DEC_PARTS_NOT_EQUAL'], [`${100 * k}/100`, 'A hundredth is one of a hundred equal parts, not a hundred.', 'M_DEC_TENTH_AS_TEN']]);
      if (!options) return null;
      return { question: wantCol ? `A hundred square is made of 100 equal small squares in 10 columns. ${person().name} shades ${k} whole columns. What fraction of the hundred square is shaded?` : `A hundred square is made of 100 equal small squares. ${person().name} shades ${k} small squares. What fraction of the hundred square is shaded?`, options, instruction: 'Choose the fraction.',
        hints: wantCol ? ['One column is one of ten equal strips.', 'A strip of 10 small squares is a tenth.'] : ['The whole square has 100 equal small squares.', 'Each small square is one hundredth.'], steps: wantCol ? ['One column is one tenth of the square.', `${k} columns are ${k}/10.`] : ['Each small square is one hundredth.', `${k} squares are ${k}/100.`] };
    } }),
  fam({ id: 'g4c.dec.tenth.metre', cs: `${C}TENTH_HUNDREDTH`, form: 'word', rung: 2,
    gen: () => {
      const tenth = Math.random() < 0.5, ans = tenth ? 10 : 1, pe = person();
      return { question: `A metre is 100 centimetres. ${pe.name} cuts a 1 metre rope into ${tenth ? '10' : '100'} equal pieces. How many centimetres long is each piece?`, answer: ans,
        wrong: tenth ? [[1, 'That is a hundredth of a metre. Ten equal pieces make each piece a tenth.', 'M_DEC_HUNDREDTH_SAME_AS_TENTH'], [100, 'That is the whole rope. Share 100 cm into 10 equal pieces.', 'M_DEC_TENTH_AS_TEN'], [50, 'That is half the rope. There are 10 equal pieces.', 'M_DEC_PARTS_NOT_EQUAL'], [20, 'That is a fifth. There are 10 equal pieces.', 'M_DEC_PARTS_NOT_EQUAL']] : [[10, 'That is a tenth of a metre. A hundredth is one of 100 equal pieces.', 'M_DEC_HUNDREDTH_SAME_AS_TENTH'], [100, 'That is the whole rope. Share 100 cm into 100 equal pieces.', 'M_DEC_TENTH_AS_TEN'], [50, 'That is half the rope.', 'M_DEC_PARTS_NOT_EQUAL'], [2, 'That is a fiftieth. There are 100 equal pieces.', 'M_DEC_PARTS_NOT_EQUAL']],
        hints: ['Divide the 100 centimetres into equal pieces.', tenth ? 'One piece is one tenth of a metre.' : 'One piece is one hundredth of a metre.'], steps: [`100 cm divided by ${tenth ? 10 : 100} is ${ans} cm.`, `Each piece is ${ans} cm.`], chk: (x) => x * (tenth ? 10 : 100) === 100 };
    } }),

  // ------------------------------------------------------------ DECIMAL_NOTATION
  fam({ id: 'g4c.dec.notation.frac-to-dec', cs: `${C}DECIMAL_NOTATION`, form: 'direct', rung: 1,
    gen: () => {
      const mode = pick(['tenths', 'hundredths', 'both']), t = randInt(1, 9), h = randInt(1, 9);
      let q, right, wrongs;
      if (mode === 'tenths') { q = `${t}/10`; right = `0.${t}`; wrongs = [[`${t}.10`, 'A tenth goes to the right of the point. The whole number part is 0.', 'M_DEC_FRACTION_AS_TWO_WHOLES'], [`0.0${t}`, 'That is hundredths. One tenth is one place after the point.', 'M_DEC_HUNDREDTH_ONE_DIGIT'], [`${t}.0`, 'That is a whole number. The fraction is less than one.', 'M_DEC_FRACTION_AS_TWO_WHOLES']]; }
      else if (mode === 'hundredths') { q = `${h}/100`; right = `0.0${h}`; wrongs = [[`0.${h}`, 'A single digit in the first place is tenths. Hundredths need two places after the point.', 'M_DEC_HUNDREDTH_ONE_DIGIT'], [`${h}.100`, 'The whole number part is 0.', 'M_DEC_FRACTION_AS_TWO_WHOLES'], [`0.${h}0`, 'That is tenths. Hundredths need a 0 in the tenths place.', 'M_DEC_HUNDREDTH_ONE_DIGIT']]; }
      else { q = `${t}/10 and ${h}/100 together`; right = `0.${t}${h}`; wrongs = [[`${t}.${h}`, 'The whole number part is 0 because the amount is less than one.', 'M_DEC_FRACTION_AS_TWO_WHOLES'], [`0.${h}${t}`, 'Tenths come first after the point, then hundredths.', 'M_DEC_HUNDREDTH_ONE_DIGIT'], [`0.0${t}${h}`.replace(/^0\.0(\d)(\d)$/, `0.0${t + h > 9 ? 9 : t + h}`), 'Tenths and hundredths are separate places: do not add the digits.', 'M_DEC_HUNDREDTH_ONE_DIGIT']]; }
      const options = mc(right, wrongs);
      if (!options) return null;
      return { question: `Which decimal is the same as ${q}?`, options, instruction: 'Choose the decimal.',
        hints: ['Tenths are the first place after the point; hundredths are the second.', 'Write 0 before the point when the amount is less than one.'], steps: [mode === 'both' ? `${t} tenths and ${h} hundredths: ${t} in the tenths place and ${h} in the hundredths.` : `Write it on a place value chart: ones, tenths, hundredths.`, `The decimal is ${right}.`] };
    } }),
  fam({ id: 'g4c.dec.notation.read', cs: `${C}DECIMAL_NOTATION`, form: 'direct', rung: 2,
    gen: () => {
      const t = randInt(1, 9), h = randInt(1, 9);
      if (t === h) return null;
      const D = ['nought', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'], W = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      const right = `nought point ${D[t]} ${D[h]}`, asWhole = `nought point ${W[t]}-${D[h]}`;
      const options = mc(right, [[asWhole, 'The digits after the point are said one by one, not as one whole number.', 'M_DEC_READ_AS_WHOLE'], [`${D[t]} point ${D[h]}`, `The decimal is less than one: it starts with nought.`, 'M_DEC_FRACTION_AS_TWO_WHOLES'], [`nought point ${D[h]} ${D[t]}`, 'Read the digits in the order they are written.', 'M_DEC_READ_AS_WHOLE']]);
      if (!options) return null;
      return { question: `A scale shows ${person().name}'s weight as 0.${t}${h} kg on a toy. How is 0.${t}${h} read aloud?`, options, instruction: 'Choose how to say the number.',
        hints: ['Say nought, then point, then each digit after the point by itself.', 'Do not say it as a whole number.'], steps: [`0.${t}${h}: nought point, then ${D[t]}, then ${D[h]}.`, `It is read: ${right}.`] };
    } }),

  // ------------------------------------------------------------ DECIMAL_PLACE_VALUE
  fam({ id: 'g4c.dec.place.name', cs: `${C}DECIMAL_PLACE_VALUE`, form: 'direct', rung: 1,
    gen: () => {
      const w = randInt(1, 9), t = randInt(1, 9), h = randInt(1, 9), tenthsAsked = Math.random() < 0.5, d = tenthsAsked ? t : h;
      if (t === h || t === w || h === w) return null;
      const right = tenthsAsked ? 'tenths' : 'hundredths';
      const options = mc(right, [[tenthsAsked ? 'tens' : 'hundreds', 'The places after the point end in -ths: tenths and hundredths.', 'M_DEC_PLACE_NAME_AS_WHOLE'], [tenthsAsked ? 'hundredths' : 'tenths', 'Tenths come first after the point, then hundredths.', 'M_DEC_VALUE_OF_DIGIT'], ['ones', 'The ones are before the point.', 'M_DEC_PLACE_NAME_AS_WHOLE']]);
      if (!options) return null;
      return { question: `A tailor writes the length of a roll of cloth as ${w}.${t}${h} metres in her notebook. In which place of that decimal does the digit ${d} sit?`, options, instruction: 'Choose the place name.',
        hints: ['The first place after the point is tenths. The second is hundredths.', 'Write the number on a place value chart.'], steps: [`${w}.${t}${h}: ones ${w}, tenths ${t}, hundredths ${h}.`, `The ${d} is in the ${right} place.`] };
    } }),
  fam({ id: 'g4c.dec.place.zero', cs: `${C}DECIMAL_PLACE_VALUE`, form: 'word', rung: 2,
    gen: () => {
      const w = randInt(1, 9), h = randInt(1, 9), pe = person();
      return { question: `${pe.name} measures a pencil as ${w}.0${h} dm. What is the value of the digit ${h} in ${w}.0${h}?`, answer: h / 100,
        wrong: [[h / 10, `The zero holds the tenths place, so the ${h} is in the hundredths place.`, 'M_DEC_ZERO_PLACE_HOLDER'], [h, `${h} is just the digit. Its value depends on its place.`, 'M_DEC_VALUE_OF_DIGIT'], [h * 10, 'The digit is after the point, so its value is less than one.', 'M_DEC_PLACE_NAME_AS_WHOLE']],
        hints: ['The zero is a place. It holds the tenths.', 'The next place after it is hundredths.'], steps: [`In ${w}.0${h}: ones ${w}, tenths 0, hundredths ${h}.`, `The ${h} is worth ${h / 100}.`], chk: (x) => Math.round(x * 100) === h };
    } }),

  // ------------------------------------------------------------ LETTERS_REPRESENT
  fam({ id: 'g4c.letters.rep.value', cs: `${L}LETTERS_REPRESENT`, form: 'word', rung: 2,
    gen: () => {
      const b = randInt(5, 15), k = randInt(2, 5), pe = person(), th = pick(['sweets', 'pencils', 'eggs', 'books']);
      if (b === 2) return null;
      return { question: `Each box has b ${th}. ${pe.name} finds that b is ${b}. How many ${th} are in ${k} boxes?`, answer: k * b,
        wrong: [[k * 2, 'b is not the second letter so 2. The question says what b is worth.', 'M_LET_LETTER_IS_ITS_ALPHABET_POSITION'], [k + b, `${k} boxes each with ${b} is ${k} times ${b}, not ${k} plus ${b}.`, 'M_EXP_NOT_NUMBER_WORD'], [Number(`${k}${b}`), `${k}b means ${k} times ${b}, not the digits ${k} and ${b} side by side.`, 'M_EXP_NOT_NUMBER_WORD'], [b, `${b} is the number in one box. There are ${k} boxes.`, 'M_LET_LETTER_IS_OBJECT']],
        hints: ['The letter b stands for the number in each box.', 'Multiply the number in one box by the number of boxes.'], steps: [`b is ${b}, so one box has ${b}.`, `${k} boxes have ${k} x ${b} = ${k * b}.`], chk: (x) => x === k * b };
    } }),
];
