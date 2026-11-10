// One-off (kept for the record): files the older Grade 5 families under the curriculum map.
// Adds cskill and the official outcome beside the HOREB skill, and misMapped: false, because
// their wrong answers carry their own reasons but are not yet tied to library misconceptions.
import { readFileSync, writeFileSync } from 'node:fs';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';
const N = 'NUMBER.', M = 'MEASUR.';
const MAP = {
  'g5.money.budget-left': M + 'MONEY.BUDGET_TOTAL_BALANCE', 'g5.money.budget-why': M + 'MONEY.BUDGET_IMPORTANCE', 'g5.money.tax-why': M + 'MONEY.TAX_MEANING', 'g5.money.bank-service': M + 'MONEY.BANK_SERVICES', 'g5.money.save-weeks': M + 'MONEY.SAVING_FACTORS',
  'g5.money.budget-table': M + 'MONEY.BUDGET_TOTAL_BALANCE', 'g5.money.budget-steps': M + 'MONEY.BUDGET_TOTAL_BALANCE', 'g5.money.budget-spot': M + 'MONEY.BUDGET_TOTAL_BALANCE', 'g5.money.budget-cut-why': M + 'MONEY.BUDGET_IMPORTANCE', 'g5.money.tax-add': M + 'MONEY.TAX_ON_RECEIPT', 'g5.money.tax-receipt': M + 'MONEY.TAX_ON_RECEIPT', 'g5.money.bank-interest': M + 'MONEY.BANK_SERVICES', 'g5.money.bank-statement': M + 'MONEY.BANK_SERVICES', 'g5.money.save-goal-steps': M + 'MONEY.SAVING_FACTORS', 'g5.money.save-place-why': M + 'MONEY.SAVING_FACTORS', 'g5.money.save-spot': M + 'MONEY.SAVING_FACTORS',
  'g5.add.estimate-word': N + 'ADDITION.ESTIMATE_SUM_NEAREST_100', 'g5.add.estimate-spot': N + 'ADDITION.ESTIMATE_SUM_NEAREST_100', 'g5.add.estimate-check-why': N + 'ADDITION.ESTIMATE_TO_CHECK_SUM',
  'g5.sub.estimate-word': N + 'SUBTRACTION.ESTIMATE_DIFFERENCE', 'g5.sub.estimate-table': N + 'SUBTRACTION.ESTIMATE_DIFFERENCE', 'g5.sub.estimate-spot': N + 'SUBTRACTION.ESTIMATE_DIFFERENCE',
  'g5.mul.estimate-word': N + 'MULTIPLICATION.ESTIMATE_PRODUCT_ROUND10', 'g5.mul.estimate-choose': N + 'MULTIPLICATION.ESTIMATE_PRODUCT_ROUND10', 'g5.mul.estimate-steps': N + 'MULTIPLICATION.ESTIMATE_PRODUCT_ROUND10', 'g5.mul.estimate-why': N + 'MULTIPLICATION.ESTIMATE_CHECK_REASONABLE',
  'g5.div.estimate-word': N + 'DIVISION.ESTIMATE_QUOTIENTS', 'g5.div.estimate-spot': N + 'DIVISION.ESTIMATE_QUOTIENTS',
  'g5.eq.let-add': N + 'SIMPLE_EQUATIONS.EQ_FORM_ADD_SUB', 'g5.eq.let-twostep': N + 'SIMPLE_EQUATIONS.EQ_TWO_STEP', 'g5.eq.balance-word': N + 'SIMPLE_EQUATIONS.EQ_SOLVE_ADD_SUB', 'g5.eq.form-spot': N + 'SIMPLE_EQUATIONS.EQ_FORM_ADD_SUB', 'g5.eq.form-why': N + 'SIMPLE_EQUATIONS.EQ_FORM_MUL_DIV', 'g5.eq.choose-direct': N + 'SIMPLE_EQUATIONS.EQ_FORM_ADD_SUB', 'g5.eq.solve-why': N + 'SIMPLE_EQUATIONS.EQ_SOLVE_ADD_SUB', 'g5.eq.solve-spot': N + 'SIMPLE_EQUATIONS.EQ_TWO_STEP',
  'g5.missing.story': N + 'SIMPLE_EQUATIONS.EQ_SOLVE_MUL_DIV', 'g5.missing.machine-table': N + 'SIMPLE_EQUATIONS.EQ_SOLVE_ADD_SUB', 'g5.missing.think-number': N + 'SIMPLE_EQUATIONS.EQ_SOLVE_ADD_SUB',
  'g5.dec.place-expanded': N + 'DECIMALS.DEC_DIGIT_VALUE', 'g5.dec.place-table': N + 'DECIMALS.DEC_PLACE_NAME', 'g5.dec.place-spot': N + 'DECIMALS.DEC_DIGIT_VALUE', 'g5.dec.order-word': N + 'DECIMALS.DEC_ORDER', 'g5.dec.order-why': N + 'DECIMALS.DEC_COMPARE', 'g5.dec.order-table': N + 'DECIMALS.DEC_ORDER',
  'g5.decadd.word': N + 'DECIMALS.DEC_ADD_MIXED_PLACES', 'g5.decadd.table': N + 'DECIMALS.DEC_ADD_MIXED_PLACES', 'g5.decsub.word': N + 'DECIMALS.DEC_SUB_SAME_PLACES', 'g5.decsub.spot': N + 'DECIMALS.DEC_SUB_SAME_PLACES',
  'g5.decmul.word': N + 'DECIMALS.DEC_MULT_1000', 'g5.decmul.table': N + 'DECIMALS.DEC_MULT_1000', 'g5.decmul.why': N + 'DECIMALS.DEC_MULT_1000', 'g5.decmul.steps': N + 'DECIMALS.DEC_MULT_1000',
  'g5.pat.add-word': N + 'ADDITION.ADD_PATTERN_EXTEND', 'g5.pat.add-spot': N + 'ADDITION.ADD_PATTERN_EXTEND', 'g5.pat.sub-word': N + 'SUBTRACTION.SUB_PATTERN_CONTINUE', 'g5.pat.mul-word': N + 'MULTIPLICATION.MULT_PATTERN_EXTEND', 'g5.pat.mul-why': N + 'MULTIPLICATION.MULT_PATTERN_EXTEND',
  'g5.round.news-word': N + 'WHOLE_NUMBERS.ROUND_NEAREST_THOUSAND', 'g5.round.crowd-table': N + 'WHOLE_NUMBERS.ROUND_NEAREST_THOUSAND', 'g5.round.spot': N + 'WHOLE_NUMBERS.ROUND_NEAREST_HUNDRED',
  'g5.length.est-route': M + 'LENGTH.KM_ESTIMATE_DISTANCE', 'g5.length.est-trip-table': M + 'LENGTH.KM_ESTIMATE_DISTANCE', 'g5.length.cloth-table': M + 'LENGTH.ADD_KM_M',
  'g5.mass.shop-left': M + 'MASS.MASS_SUBTRACT_KG_G', 'g5.mass.parcels-table': M + 'MASS.MASS_ADD_KG_G', 'g5.mass.written-why': M + 'MASS.MASS_CONVERT_G_TO_KG',
  'g5.cap.dairy-left': M + 'CAPACITY.SUBTRACT_L_ML', 'g5.cap.drums-table': M + 'CAPACITY.ADD_L_ML', 'g5.cap.cups-word': M + 'CAPACITY.L_ML_RELATIONSHIP', 'g5.cap.sensible-why': M + 'CAPACITY.ML_ESTIMATE',
  'g5.frac.sub-word': N + 'FRACTIONS.SUBTRACT_SAME_DENOMINATOR', 'g5.frac.sub-spot': N + 'FRACTIONS.SUBTRACT_SAME_DENOMINATOR', 'g5.frac.add-word': N + 'FRACTIONS.ADD_SAME_DENOMINATOR', 'g5.frac.equiv-word': N + 'FRACTIONS.EQUIVALENT_FRACTIONS', 'g5.frac.simplify-spot': N + 'FRACTIONS.SIMPLIFY_FRACTIONS',
  'g5.area.tile-floor': M + 'AREA.AREA_PROBLEMS', 'g5.whole.words-to-digits': N + 'WHOLE_NUMBERS.WORDS_TO_SYMBOLS',
};
const DIR = new URL('../src/ai-tutor/content/families/', import.meta.url);
let done = 0; const left = new Set(Object.keys(MAP));
for (const fn of ['g5.js', 'gaps.js', 'labelFixes.js']) {
  let s = readFileSync(new URL(fn, DIR), 'utf8');
  for (const [id, cs] of Object.entries(MAP)) {
    const code = `MATH.G5.${cs}`, sk = SKILLS_G5[code];
    if (!sk) throw new Error(`no skill ${code}`);
    const re = new RegExp(`(id: '${id.replace(/[.]/g, '\\.')}',[^\\n]*?)outcome: '[^']+'`);
    if (!re.test(s)) continue;
    s = s.replace(re, `$1cskill: '${code}', outcome: '${sk.outcome}', misMapped: false`);
    left.delete(id); done++;
  }
  writeFileSync(new URL(fn, DIR), s);
}
console.log(`retagged ${done}; not found: ${[...left].join(', ') || 'none'}`);
