// Every Grade 2 Maths sub-strand (mapped on 18 Nov 2026 to the depth standard of Grades 4 to 9).
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
import * as lines from './lines.mjs';
import * as shapes from './shapes.mjs';
export const SUBS = [concept, whole, addition, subtraction, multiplication, division, fractions, length, mass, capacity, time, money, lines, shapes];
// The older Grade 2 families (src/ai-tutor/content/families/g1_3.js) are 13 for the whole grade; 11 are linked above. These testable
// skills have no question family yet (new families are to be written and reviewed; the list shrinks as they come):
export const NOFAMILY = ["NUMBER.NUMBER_CONCEPT.IDENTIFY_1_100","NUMBER.NUMBER_CONCEPT.REPRESENT_OBJECTS_100","NUMBER.WHOLE_NUMBERS.COUNT_FORWARD_100","NUMBER.WHOLE_NUMBERS.COUNT_BACK_50","NUMBER.WHOLE_NUMBERS.READ_WRITE_SYMBOLS_100","NUMBER.WHOLE_NUMBERS.WORDS_20","NUMBER.ADDITION.ADD_2D_1D","NUMBER.ADDITION.ADD_2D_2D","NUMBER.ADDITION.ADD_TENS","NUMBER.SUBTRACTION.SUB_2D_1D","NUMBER.SUBTRACTION.SUB_TENS","NUMBER.SUBTRACTION.SUB_PATTERNS_100","NUMBER.MULTIPLICATION.MULT_REPEATED_ADD","NUMBER.MULTIPLICATION.MULT_SIGN","NUMBER.MULTIPLICATION.MULT_BY_10","NUMBER.DIVISION.DIV_SHARING_2","NUMBER.DIVISION.DIV_SIGN","NUMBER.DIVISION.DIV_BY_4_5","NUMBER.FRACTIONS.HALF_OF_WHOLE","NUMBER.FRACTIONS.QUARTER_OF_WHOLE","MEASUR.LENGTH.MEASURE_FIXED_UNITS","MEASUR.LENGTH.KNOW_METRE","MEASUR.LENGTH.MEASURE_IN_METRES","MEASUR.MASS.MEASURE_FIXED_MASS","MEASUR.MASS.KNOW_KILOGRAM","MEASUR.MASS.MEASURE_IN_KG","MEASUR.CAPACITY.MEASURE_FIXED_CAPACITY","MEASUR.CAPACITY.KNOW_LITRE","MEASUR.TIME.MONTHS_OCCASIONS","MEASUR.TIME.DAYS_IN_MONTHS","MEASUR.TIME.READ_CALENDAR","MEASUR.TIME.ARBITRARY_TIME","MEASUR.TIME.CLOCK_HANDS","MEASUR.TIME.READ_HOUR","MEASUR.TIME.WRITE_HOUR","MEASUR.MONEY.IDENTIFY_MONEY_100","MEASUR.MONEY.COUNT_10_20_COINS","MEASUR.MONEY.COUNT_50_100_NOTES","MEASUR.MONEY.BUY_NO_BALANCE","GEOMET.LINES.STRAIGHT_LINES","GEOMET.LINES.CURVED_LINES","GEOMET.SHAPES.NAME_SHAPES_ENV"];
// Families left on HOREB's old outcome code because they test content outside the Grade 2 design (a teacher to decide). Two linked
// families stretch the design and are flagged instead: g2.div.benches (up to 40 learners, benches of 2 to 5: wider than 'up to 25
// by 3') and g2.mul.rows (rows of 10 are the x 10 outcome d, filed under c).
export const OFF_DESIGN = {
  'g2.length.which-unit': 'centimetres and kilometres: Grade 2 length knows only fixed units and the metre',
  'g2.time.weeks-days': 'weeks to days (x 7): not in the Grade 2 time outcomes, and x 7 is beyond the Grade 2 tables',
};
