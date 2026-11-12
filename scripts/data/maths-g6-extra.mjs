// Misconceptions added while writing the new families, where a wrong answer that a child really gives had no library entry.
// Merged by scripts/build-maths-g6.mjs after the sub-strand lists.
import { mi, LIT, TC } from './maths-g6-lib.mjs';
export const EXTRA_MIS = {
  'MEASUR.LENGTH': [
    mi('MM_AS_UNIT', 'M_CM_MARKS_ADDED', 'Adds the whole centimetres and the small marks instead of reading cm and mm separately.', ['A lead ends 3 small marks after the 5 cm mark: length in mm?', '8 mm (5 + 3)', '53 mm'], 'Counts every number on the ruler as the same kind of unit.', 'The sum of the cm and the marks as an option.', 'Say it with units: 5 cm and 3 mm, then change the cm to mm.', TC),
    mi('ADD_CM_MM', 'M_CARRY_FORGOTTEN', 'Renames 10 mm as 1 cm but does not add that cm to the total.', ['3 cm 8 mm + 1 cm 6 mm', '4 cm 4 mm', '5 cm 4 mm'], 'Takes ten mm off the mm column and forgets where it goes.', 'Total that is one cm short.', 'Write the new cm above the cm column when renaming.', LIT),
    mi('DIVIDE_CM_MM', 'M_UNIT_NOT_CHANGED_BACK', 'Divides correctly in mm but gives the answer in cm, or the reverse.', ['A 5 cm 6 mm rod cut into 4 equal pieces: length of each in mm?', '1.4 (cm)', '14 mm'], 'Does not look at the unit the question asks for.', 'Answer that is ten times too small.', 'Underline the unit in the question before writing the answer.', LIT),
  ],
  'MEASUR.CAPACITY': [
    mi('CM3_ML_LITRE_RELATION', 'M_CM3_AS_LITRES', 'Gives the number of cm3 as the number of litres.', ['A box of 5,000 cm3 holds how many litres?', '5,000', '5'], 'Does not change cm3 to litres at all.', 'The cm3 value as an option.', 'Say how many cm3 fill one litre, then divide.', TC),
  ],
  'MEASUR.MASS': [
    mi('TONNE_AS_UNIT', 'M_UNIT_TOO_SMALL', 'Chooses the gramme for something heavy.', ['Unit for the mass of a goat?', 'g', 'kg'], 'Picks the first unit that comes to mind.', 'The gramme as a distractor.', 'Hold a one-kilogramme packet of sugar and compare it with the object.', TC),
    mi('ITEMS_IN_TONNES', 'M_LOAD_TOO_LIGHT', 'Gives a lorry load in kg or g, as if it were light.', ['A lorry of sand has a mass of about?', '9 kg', '9 t'], 'Does not see how heavy a lorry load is.', 'Small unit for a big load.', 'Compare with a bag of 50 kg: how many bags is a lorry?', TC),
    mi('DIVIDE_TONNES_KG', 'M_UNIT_NOT_CHANGED_BACK_T', 'Divides in kg correctly but gives the answer in tonnes, or the reverse.', ['3 t 600 kg shared by 4: each in kg?', '0.9 (t)', '900 kg'], 'Does not look at the unit the question asks for.', 'Answer ten or a thousand times too small.', 'Underline the unit in the question before writing the answer.', LIT),
  ],
  'MEASUR.TIME': [
    mi('WRITE_AM_PM', 'M_QUARTER_TO_WRONG_HOUR', 'Writes quarter to six as 6:45 (quarter to is 15 minutes before the hour).', ['Quarter to 6 in the evening', '6:45 p.m.', '5:45 p.m.'], 'Reads "quarter" as 45 minutes past.', 'Time with the hour not reduced.', 'On a clock, quarter to means the minute hand on 9: the hour hand has not reached the next hour.', LIT),
    mi('WRITE_AM_PM', 'M_EVENING_WITH_AM', 'Writes an evening or afternoon time with a.m.', ['Supper at half past 7 in the evening', '7:30 a.m.', '7:30 p.m.'], 'Writes the time without thinking which half of the day.', 'The a.m. version of the time.', 'Ask whether it is before or after noon.', LIT),
  ],
  'GEOMET.ANGLES': [
    mi('ANGLE_SUM_RECT_TRIANGLE', 'M_SUBTRACT_ONE_ANGLE_ONLY', 'Subtracts only one of the two known angles from 180 degrees to find the third angle of a triangle.', ['Angles 60 and 70: third angle?', '120 degrees', '50 degrees'], 'Forgets the second known angle.', 'Answer from one subtraction.', 'Add the known angles first, then subtract the total from 180.', LIT),
    mi('ANGLE_SUM_RECT_TRIANGLE', 'M_ONE_CORNER_ONLY', 'Gives the size of one corner (90 degrees) as the sum of the angles of a rectangle.', ['Sum of the angles of a rectangle?', '90 degrees', '360 degrees'], 'Thinks of a single right angle.', 'Option 90 degrees.', 'Count the corners: four right angles.', LIT),
    mi('CONSTRUCT_TRIANGLES', 'M_TRIANGLE_NAMES_MIXED', 'Mixes up the names equilateral, isosceles and right-angled.', ['A triangle with three equal sides is called?', 'isosceles', 'equilateral'], 'Learns the names as a list without the meaning.', 'Names of the other triangles as options.', 'Say what each name tells: equi means equal, a right angle is 90 degrees.', LIT),
  ],
  'DATA_H.BAR_GRAPHS': [
    mi('PILING', 'M_PILE_LEFT_OUT', 'Leaves one pile out when adding the piles to find the total.', ['Piles of 5, 8, 3 and 6', '16', '22'], 'Loses count of the piles.', 'Total missing one pile.', 'Touch each pile once and say its number.', TC),
  ],
};
