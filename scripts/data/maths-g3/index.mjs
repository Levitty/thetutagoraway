// Every Grade 3 Maths sub-strand (mapped on 18 Nov 2026 to the depth standard of Grades 4 to 9).
import * as concept from './concept.mjs';
import * as whole from './whole.mjs';
import * as addition from './addition.mjs';
import * as subtraction from './subtraction.mjs';
import * as multiplication from './multiplication.mjs';
import * as division from './division.mjs';
import * as fractions from './fractions.mjs';
import * as length from './length.mjs';
import * as mass from './mass.mjs';
import * as capacity from './capacity.mjs';
import * as time from './time.mjs';
import * as money from './money.mjs';
import * as position from './position.mjs';
import * as shapes from './shapes.mjs';
export const SUBS = [concept, whole, addition, subtraction, multiplication, division, fractions, length, mass, capacity, time, money, position, shapes];
// The older Grade 3 families (src/ai-tutor/content/families/g1_3.js) are few: 14 for the whole grade. 11 are linked above. The 11 in g3c_cov.js (19 Nov 2026) are written filed under the map. These
// testable skills have no question family yet (new families are to be written and reviewed; the list shrinks as they come):
export const NOFAMILY = ["NUMBER.NUMBER_CONCEPT.ORDER_BY_SIZE","NUMBER.NUMBER_CONCEPT.ORDINAL_POSITION_20","NUMBER.NUMBER_CONCEPT.WRITE_ORDINALS","NUMBER.WHOLE_NUMBERS.COUNT_FORWARD_1000","NUMBER.WHOLE_NUMBERS.COUNT_BACK_HUNDREDS","NUMBER.WHOLE_NUMBERS.READ_SYMBOLS_1000","NUMBER.WHOLE_NUMBERS.WORDS_100","NUMBER.WHOLE_NUMBERS.PATTERNS_1000","NUMBER.ADDITION.ADD_3D_2D_NO_REGROUP","NUMBER.ADDITION.ADD_3D_2D_REGROUP","NUMBER.ADDITION.ADD_3D_3D_NO_REGROUP","NUMBER.ADDITION.ADD_PATTERNS_1000","NUMBER.SUBTRACTION.SUB_3D_2D_NO_REGROUP","NUMBER.SUBTRACTION.SUB_3D_2D_REGROUP","NUMBER.SUBTRACTION.SUB_MISSING_NUMBER","NUMBER.SUBTRACTION.SUB_PATTERNS_1000","NUMBER.MULTIPLICATION.MULT_REPEATED_ADDITION","NUMBER.MULTIPLICATION.MULT_BY_10","NUMBER.DIVISION.DIV_REPEATED_SUBTRACTION","NUMBER.DIVISION.DIV_BY_10","NUMBER.FRACTIONS.FRACTION_OF_WHOLE","NUMBER.FRACTIONS.FRACTION_OF_GROUP","MEASUR.LENGTH.MEASURE_METRES","MEASUR.LENGTH.ADD_METRES","MEASUR.LENGTH.SUBTRACT_METRES","MEASUR.LENGTH.ESTIMATE_METRES","MEASUR.CAPACITY.MEASURE_LITRES","MEASUR.CAPACITY.SUBTRACT_LITRES","MEASUR.CAPACITY.ESTIMATE_LITRES","MEASUR.TIME.MINUTE_UNIT","MEASUR.TIME.TELL_PAST_TO","MEASUR.TIME.READ_DIGITAL","MEASUR.TIME.WRITE_PAST_TO","MEASUR.TIME.ESTIMATE_HOURS","MEASUR.TIME.ADD_TIME","MEASUR.TIME.SUBTRACT_TIME","MEASUR.MONEY.IDENTIFY_NOTES","MEASUR.MONEY.COUNT_MONEY","MEASUR.MONEY.ADD_MONEY","MEASUR.MONEY.SUBTRACT_MONEY","MEASUR.MONEY.SAME_AMOUNT_WAYS","MEASUR.MONEY.CHANGE_DENOMINATIONS","GEOMET.POSITION_AND_DIRECTION.MOVE_STRAIGHT","GEOMET.POSITION_AND_DIRECTION.LEFT_RIGHT","GEOMET.SHAPES.NAME_SHAPES","GEOMET.SHAPES.SHAPES_IN_COMBINED"];
// Families left on HOREB's old outcome code because they test content outside the Grade 3 design (a teacher to decide: move to
// Grade 4, or narrow them). Two linked families stretch the design and are flagged for a teacher instead: g3.mul.buy-many (a mandazi
// at sh. 10 to 20 makes it 2-digit by 1-digit) and g3.position.turn (it names compass directions, which come in Grade 4).
export const OFF_DESIGN = {
  'g3.length.cut-rope': 'metres to centimetres: Grade 3 length is in whole metres only (centimetres come in Grade 4)',
  'g3.time.weeks-and-days': 'weeks and days: not in the Grade 3 time outcomes (minutes, hours, past and to)',
  'g3.shapes.name-by-count': 'pentagon, hexagon and octagon: Grade 3 shapes are combined shapes of the basic shapes',
};
