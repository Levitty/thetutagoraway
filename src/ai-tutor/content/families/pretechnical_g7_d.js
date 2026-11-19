// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 7, THE KNOWLEDGE HALF OF THREE PRACTICALS (19 Nov 2026, HOREB_QUESTIONS_PLAN.md): using a computer,
// printing letters on a drawing, and using measuring and marking out tools. The app asks the order, the rule and the reason; the
// doing is marked by the teacher with the KICD rubric. Every wrong answer names the library misconception it reveals.
// All stay reviewed:false until a Pre-Technical Studies teacher signs them off.
// ============================================================================
import { T } from './pretechnical_g7_lib.js';

const M = (...s) => s.map(x => `M_PT7_${x}`);
const STEP = 'Which step is wrong?';

export const FAMILIES = [
  ...T('cu', 'FOUNDA.COMPUTER_CONCEPTS.COMP_USE', M('CU_SWITCH_OFF', 'CU_NO_SAVE', 'CU_SAVE_NAME', 'CU_DOUBLE'),
    ['Think about what the computer needs before the power goes off, and how you will find your work again.', 'Open a program by double-clicking, save with a clear name in a chosen folder, close the program, then Shut down before the socket.'], [
      ['What is the right way to switch off a desktop computer?', 'Save, close programs, then Shut down', 'Switch it off at the wall socket|0', 'Pull out the power cable|0', 'Close the program without saving|1'],
      ['What happens to typed work if the program is closed without saving?', 'It may be lost', 'It is kept automatically|1', 'It is saved as Document1|2', 'It moves to the desktop|1'],
      ['How should a new file be saved?', 'With a clear name in a chosen folder', 'Keep the name Document1 the computer gave|2', 'Anywhere the computer chooses|2', 'There is no need to save it|1'],
      ['How do you open a program from its desktop icon?', 'Double-click it', 'Click it once and wait|3', 'Hold the power button|0', 'Drag it to the bin|3'],
      ['What can happen if the power is cut without shutting down?', 'Files can be damaged', 'Nothing, it is the same as Shut down|0', 'The work saves itself|1', 'The files get clearer names|2'],
    ], [
      ['Wanjiru types her essay and closes Word without saving. Next day she cannot find it. Why?', 'It was never saved', 'Word keeps it automatically|1', 'She double-clicked the icon|3', 'She named it clearly|2'],
      ['Otieno saves his drawing as Document1 in whatever folder appears. A week later he cannot find it. What should he have done?', 'Named it clearly and chosen a folder', 'Clicked Save and kept Document1|2', 'Switched off at the socket|0', 'Not saved it at all|1'],
      ['After a lesson, Kiprop switches the computer off at the wall. What is the risk?', 'Damaged files and lost work', 'None, it is the quickest way|0', 'The files are renamed|2', 'The icons open by themselves|3'],
      ['Amina clicks the browser icon once and waits. Nothing opens. What should she do?', 'Double-click it', 'Wait longer after one click|3', 'Switch off at the socket|0', 'Save the icon first|2'],
      ['Baraka has finished his work. Which order is right?', 'Save, close, Shut down, then socket', 'Socket off, then save|0', 'Close without saving, then Shut down|1', 'Shut down, then name the file|2'],
    ], [
      ['Achieng explains how she finished her work. ' + STEP, 'She saved her file.', 'She closed the program.', 'She switched the computer off at the wall socket.', 'Choose Shut down first; switch off at the socket only after.', 0],
      ['Juma explains how he keeps his work. ' + STEP, 'He typed his list of tools.', 'He checked the spelling.', 'He closed the program, sure that the work was kept automatically.', 'Save before closing, or the work may be lost.', 1],
      ['Faith explains saving. ' + STEP, 'She clicked Save.', 'The computer suggested the name Document1.', 'She kept Document1 and the folder it offered.', 'Give the file a clear name and choose the folder.', 2],
      ['Kamau explains opening a program. ' + STEP, 'He found the icon on the desktop.', 'He pointed the mouse at it.', 'He clicked it once and waited for it to open.', 'Double-click the icon, or click once and press Enter.', 3],
      ['Nekesa explains starting up. ' + STEP, 'She switched on at the socket and the computer.', 'She logged in.', 'She opened the program by clicking the icon once.', 'Double-click to open the program.', 3],
    ]),

  ...T('dlt', 'COMMUN.INTRODUCTION_TO_DRAWING.DRAW_LETTERING', M('DLT_CURSIVE', 'DLT_MIXED', 'DLT_NO_GUIDE', 'DLT_SPACING'),
    ['Think about how a note looks on a drawing that anyone must read at once.', 'Print plain capitals in single strokes, all the same height between faint guide lines, with wider gaps between words.'], [
      ['How are notes printed on a technical drawing?', 'In plain capital letters', 'In neat joined-up handwriting|0', 'In capitals and small letters mixed|1', 'In any style that looks nice|0'],
      ['How is the title front elevation printed on a drawing?', 'Every letter a capital', 'A capital only at the start of each word|1', 'All in small letters|1', 'One word in capitals, one in small letters|1'],
      ['What are guide lines for?', 'To keep letters the same height', 'They are not needed if you are careful|2', 'To join the letters together|0', 'To push the words closer|3'],
      ['How do the gaps between words compare with gaps between letters?', 'Wider between words', 'The same, so the note fits|3', 'Narrower between words|3', 'There are no gaps between words|3'],
      ['How is each letter made?', 'With single strokes', 'Joined to the next letter|0', 'Without any lines to guide it|2', 'In small letters, then capitals|1'],
    ], [
      ['Kibet writes the note scale 1:2 in his best joined-up handwriting on the drawing. What rule does he break?', 'Notes use separate capital letters', 'Guide lines must be drawn first|2', 'Words need wider gaps than letters|3', 'He broke no rule|0'],
      ['Mwende prints the words side view with a capital S and a capital V only. How should it be printed?', 'In capitals from start to end', 'As she did, capitals at the start only|1', 'In small letters only|1', 'In joined-up writing|0'],
      ['Odhiambo prints without guide lines. His letters go up and down. What should he do?', 'Draw two faint guide lines first', 'Write more slowly with no lines|2', 'Join the letters|0', 'Push the words together|3'],
      ['Zawadi prints PLANVIEWOFSTOOL with no gaps. What is wrong?', 'Words need wider gaps', 'Nothing, it fits the space|3', 'It should be joined-up|0', 'It should be in small letters|1'],
      ['A teacher marks a title that is all capitals, single strokes and even height. Which rule does it still need?', 'Wider gaps between words', 'Joined-up letters|0', 'Small letters after the first|1', 'No guide lines|2'],
    ], [
      ['Wairimu explains how she printed her title. ' + STEP, 'She drew two faint guide lines.', 'She made the letters upright.', 'She joined the letters up neatly like handwriting.', 'Letters are separate plain capitals.', 0],
      ['Kioko explains his notes. ' + STEP, 'He kept all letters the same height.', 'He used single strokes.', 'He started each word with a capital and used small letters after it.', 'All the letters in a note are capitals.', 1],
      ['Nduta explains her lettering. ' + STEP, 'She used plain capitals.', 'She kept the letters upright.', 'She skipped guide lines because she writes carefully.', 'Draw faint guide lines so the height stays even.', 2],
      ['Hassan explains spacing. ' + STEP, 'His capitals are single strokes.', 'His letters sit between the guide lines.', 'He left the same small gap between words as between letters.', 'Leave a wider gap between words.', 3],
      ['Joy explains her title block. ' + STEP, 'She printed NAME and DATE in capitals.', 'She drew guide lines first.', 'She wrote her own name in joined-up writing.', 'Every note on the drawing is printed in capitals.', 0],
    ]),

  ...T('tu', 'TOOLS_.MEASURING_AND_MARKING_OU.TOOL_USE', M('TU_RULE_END', 'TU_PARALLAX', 'TU_TRY_STOCK', 'TU_PUNCH_FIRST'),
    ['Ask what makes the mark true: where you start, where your eye is, and what the tool rests on.', 'Measure from the 0 mark, read straight above it, hold the try-square stock on the face edge, scribe, then punch where lines cross.'], [
      ['Where do you start measuring on a steel rule?', 'At the 0 mark', 'At the end of the rule|0', 'At the 1 cm mark|0', 'Wherever the rule touches|0'],
      ['Where should your eye be when reading a scale?', 'Straight above the mark', 'From the side, at an angle|1', 'Low beside the rule|1', 'Anywhere you can see it|1'],
      ['Where is the stock of a try-square held?', 'Firmly against the face edge', 'Anywhere on the board|2', 'Against a rough edge|2', 'Loose, floating on the face|2'],
      ['When is the centre of a hole dot-punched?', 'After two lines are scribed to cross', 'First, where it looks about right|3', 'Before measuring|3', 'Before the try-square is used|3'],
      ['Which way do you scribe a line?', 'Away from the body', 'Towards the body|2', 'From the side at an angle|1', 'From the worn end of the rule|0'],
    ], [
      ['Musa measures a 100 mm piece from the end of his ruler, which has a gap before 0. What happens?', 'His piece is the wrong length', 'It is exactly right|0', 'It is square|2', 'It is punched in the right place|3'],
      ['Lilian reads the steel rule from the side. Her mark is a little off. Why?', 'Her eye was not straight above', 'She started at 0|0', 'The stock was on the face edge|2', 'She punched first|3'],
      ['Wafula marks a line square across a plank with the stock on a rough edge. The line is not square. What should he do?', 'Hold the stock on the straight face edge', 'Press harder on the rough edge instead|2', 'Read from the side|1', 'Measure from the end|0'],
      ['Chebet punches where a hole looks about right, then scribes lines. The hole is off. What went wrong?', 'She punched before scribing', 'She read from above|1', 'She used the 0 mark|0', 'She held the stock on the face edge|2'],
      ['Brian must mark the centre of a square plate. What order is right?', 'Measure, scribe two lines, then punch', 'Punch, then measure|3', 'Scribe with the stock floating|2', 'Measure from the rule end, then punch|0'],
    ], [
      ['Atieno explains how she measured. ' + STEP, 'She laid the rule flat on the work.', 'She looked straight down at the mark.', 'She started from the end of the rule, not the 0 mark.', 'Start at the 0 mark; some rules have a margin.', 0],
      ['Kimani explains reading the scale. ' + STEP, 'He started at the 0 mark.', 'He held the rule still.', 'He read the mark from the side, at an angle.', 'Read with your eye straight above the mark.', 1],
      ['Rehema explains marking a line square. ' + STEP, 'She chose the straight face edge.', 'She scribed along the blade.', 'She let the stock rest anywhere on the board.', 'Hold the stock firmly against the face edge.', 2],
      ['Ouma explains marking a hole centre. ' + STEP, 'He measured from the edges.', 'He then scribed the lines.', 'Before scribing he dot-punched where the centre looked right.', 'Punch only where two scribed lines cross.', 3],
      ['Mercy explains scribing. ' + STEP, 'She held the try-square stock on the face edge.', 'She scribed away from her body.', 'She measured her mark from the worn end of the rule.', 'Measure from the 0 mark.', 0],
    ]),
];
