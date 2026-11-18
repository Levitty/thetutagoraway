// Every Grade 1 Maths sub-strand (mapped on 18 Nov 2026 to the depth standard of Grades 4 to 9), and the pre-primary readiness
// skills that Grade 1's prerequisites reach down to (./readiness.mjs).
import * as prenumber from './prenumber.mjs';
import * as whole from './whole.mjs';
import * as addition from './addition.mjs';
import * as subtraction from './subtraction.mjs';
import * as length from './length.mjs';
import * as mass from './mass.mjs';
import * as capacity from './capacity.mjs';
import * as time from './time.mjs';
import * as money from './money.mjs';
import * as lines from './lines.mjs';
import * as shapes from './shapes.mjs';
export { READINESS } from './readiness.mjs';
export const SUBS = [prenumber, whole, addition, subtraction, length, mass, capacity, time, money, lines, shapes];
// The older Grade 1 families (src/ai-tutor/content/families/g1_3.js) are 15 for the whole grade; 13 are linked above. These testable
// skills have no question family yet (new families are to be written and reviewed; the list shrinks as they come):
export const NOFAMILY = ["NUMBER.PRE_NUMBER_ACTIVITIES.SORT_OBJECTS","NUMBER.PRE_NUMBER_ACTIVITIES.MATCH_OBJECTS","NUMBER.PRE_NUMBER_ACTIVITIES.ORDER_OBJECTS","NUMBER.WHOLE_NUMBERS.COUNT_BACK_30","NUMBER.WHOLE_NUMBERS.REPRESENT_30","NUMBER.WHOLE_NUMBERS.READ_WRITE_50","NUMBER.WHOLE_NUMBERS.WORDS_10","NUMBER.ADDITION.ADD_SIGNS","NUMBER.ADDITION.ADD_TWO_SINGLE","NUMBER.ADDITION.ADD_THREE_SINGLE","NUMBER.ADDITION.ADD_2D_1D_50","NUMBER.SUBTRACTION.SUB_SIGNS","NUMBER.SUBTRACTION.SUB_SINGLE","NUMBER.SUBTRACTION.SUB_2D_1D_NO_REGROUP","MEASUR.LENGTH.COMPARE_LENGTH","MEASUR.LENGTH.MEASURE_ARBITRARY_LENGTH","MEASUR.MASS.MEASURE_ARBITRARY_MASS","MEASUR.CAPACITY.COMPARE_CAPACITY","MEASUR.TIME.DAYS_ACTIVITIES","MEASUR.TIME.MONTHS_OF_YEAR","MEASUR.MONEY.IDENTIFY_COINS","MEASUR.MONEY.IDENTIFY_50_NOTE","MEASUR.MONEY.BUY_TWO_ITEMS","GEOMET.SHAPES.SHAPE_PATTERNS_1"];
// Families left on HOREB's old outcome code because they test content outside the Grade 1 design (a teacher to decide). Two linked
// families stretch the design and are flagged instead: g1.counting.ten-more (counting on in tens from any number; the learning
// experiences count in 1s and 2s) and g1.prenumber.skip-gap (counting in 5s and 10s past 20).
export const OFF_DESIGN = {
  'g1.length.longest-of-three': 'lengths given in centimetres: Grade 1 compares lengths directly and with arbitrary units',
  'g1.time.hours-to-wait': "o'clock times: the clock comes in Grade 2 (Grade 1 time is days and months)",
};
