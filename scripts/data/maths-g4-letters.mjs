// HOREB's own Grade 4 outcome list (src/ai-tutor/curriculum/outcomes.js, ids like G4.SUB.a) set against KICD's official letters
// (curriculum/mathematics/g4.json, codes like MATH.G4.NUMBER.SUBTRACTION.b). HOREB's list folded some outcomes together and
// left others out: this says which official letters each HOREB id stands for. Used by the review document and by tests/maths-g4.test.mjs.
// Official outcomes that no HOREB id names are listed by the review document (attitude and digital-use ones are not testable).
export const SUB_OF = { WHOLE: 'NUMBER.WHOLE_NUMBERS', ADD: 'NUMBER.ADDITION', SUB: 'NUMBER.SUBTRACTION', MUL: 'NUMBER.MULTIPLICATION', DIV: 'NUMBER.DIVISION', FRAC: 'NUMBER.FRACTIONS', DEC: 'NUMBER.DECIMALS', LETTERS: 'NUMBER.USE_OF_LETTERS', LENGTH: 'MEASUR.LENGTH', AREA: 'MEASUR.AREA', VOL: 'MEASUR.VOLUME', CAP: 'MEASUR.CAPACITY', MASS: 'MEASUR.MASS', TIME: 'MEASUR.TIME', MONEY: 'MEASUR.MONEY', POSITION: 'GEOMET.POSITION_AND_DIRECTION', ANGLES: 'GEOMET.ANGLES', PLANE: 'GEOMET.PLANE_FIGURES', DATA: 'DATA_H.DATA' };
// HOREB id (without G4.) -> official letters it stands for
export const LETTERS = {
  'WHOLE.a': ['a'], 'WHOLE.b': ['b'], 'WHOLE.c': ['c'], 'WHOLE.d': ['d'], 'WHOLE.e': ['e'], 'WHOLE.f': ['f'], 'WHOLE.g': ['g'], 'WHOLE.h': ['h'], 'WHOLE.i': ['i'], 'WHOLE.j': ['j'],
  'ADD.a': ['a', 'b'], 'ADD.c': ['c'], 'ADD.d': ['d'],
  'SUB.a': ['a', 'b'], 'SUB.c': ['c'], 'SUB.d': ['d'],
  'MUL.a': ['a', 'b'], 'MUL.c': ['c'], 'MUL.d': ['d'],
  'DIV.a': ['a'], 'DIV.b': ['b'],
  'FRAC.a': ['a'], 'FRAC.b': ['b'], 'FRAC.c': ['c'], 'FRAC.d': ['d'], 'FRAC.e': ['e'],
  'DEC.a': ['a'], 'DEC.c': ['c'], 'DEC.d': ['d'],
  'LETTERS.a': ['a'], 'LETTERS.b': ['b'], 'LETTERS.c': ['c'],
  'LENGTH.a': ['a', 'b', 'c'], 'LENGTH.d': ['d'], 'LENGTH.e': ['e'], 'LENGTH.f': ['f', 'g', 'h', 'i'],
  'AREA.b': ['b'], 'AREA.c': ['c'],
  'VOL.a': ['a'], 'VOL.b': ['b'],
  'CAP.a': ['a'], 'CAP.c': ['c'],
  'MASS.a': ['a', 'b'], 'MASS.c': ['c', 'd'],
  'TIME.a': ['a'], 'TIME.c': ['c'], 'TIME.e': ['d', 'e'],
  'MONEY.a': ['a'], 'MONEY.b': ['b'], 'MONEY.c': ['c'],
  'POSITION.a': ['a', 'b'], 'POSITION.c': ['c', 'd'],
  'ANGLES.a': ['a', 'b', 'c'],
  'PLANE.a': ['a'], 'PLANE.b': ['b', 'd'], 'PLANE.c': ['c'], 'PLANE.e': ['e'],
  'DATA.b': ['b', 'c', 'd'], 'DATA.e': ['e'],
};
// Texts HOREB's list had wrong, now corrected in outcomes.js (12 Nov 2026)
export const TEXT_FIXES = [
  ['G4.WHOLE.a', 'Place value and total value up to thousands', 'Place value and total value of digits up to tens of thousands', 'the design says tens of thousands'],
  ['G4.SUB.a', 'Subtract 4-digit numbers with regrouping', 'Subtract 4-digit numbers, with and without regrouping', 'the design has two outcomes, a without and b with regrouping; the HOREB letter stands for both'],
  ['G4.MUL.a', 'Multiply by a two-digit or one-digit number', 'Multiply by multiples of 10, and a two-digit number by a two-digit number', 'the design has a multiples of 10 and b two-digit by two-digit; the HOREB letter stands for both'],
  ['G4.POSITION.c', 'Quarter, half and three-quarter turns', 'Quarter, half and full turns', 'the design says quarter, half and full; three-quarter is not in the Grade 4 design'],
];
