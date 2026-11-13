// ============================================================================
// GRADE 8 PRE-TECHNICAL STUDIES, FOUNDATIONS AND COMMUNICATION (10 skills): Fire Safety, Data Safety, Plane Geometry, Dimensioning, Plain Scale
// Drawing and Visual Programming. Written offline from the KICD design through the curriculum map. Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child. Fire, data-safety and drawing
// statements are to be confirmed by a teacher. Extinguishing a fire is practical and is never asked as an action for children to try.
// ============================================================================
import { S } from './pretechnical_g8_lib.js';
const FS = 'FOUNDA.FIRE_SAFETY.', DS = 'FOUNDA.DATA_SAFETY.', PG = 'COMMUN.PLANE_GEOMETRY.', DM = 'COMMUN.DIMENSIONING.', PS = 'COMMUN.PLAIN_SCALE_DRAWING.', VP = 'COMMUN.VISUAL_PROGRAMMING.';

export const FAMILIES = [
  ...S('fc', FS, 'FIRE_CAUSES', ['FC_NATURE_ONLY', 'FC_WIRING', 'FC_FUEL'], ['Think of the fires that start in homes and schools.', 'Most fires start from something people did or forgot to do.'], [
    ['Which is a common cause of fires in homes?', 'A candle or stove left burning unattended', 'Only a bolt of lightning striking the house', 'A switched-off lamp that is still plugged in', 'A pot of water standing on a cold table'],
    ['Which can cause an electrical fire?', 'Overloaded sockets or damaged wires', 'A clean switch with a plastic cover', 'A switched-off lamp in an empty room', 'A new bulb that is lit in a bedroom'],
    ['Why must paraffin be kept away from a stove?', 'Its vapour can catch fire easily', 'It is heavy and may fall on the floor', 'It will turn into water when it gets warm', 'It only spoils the food that is cooking'],
    ['Which of these starts a fire through human carelessness?', 'A cigarette thrown away while still lit', 'A cloud passing over the school fields', 'A cold wind blowing over dry leaves', 'Rain falling on a tin roof at night'],
    ['Which is a natural cause of a bush fire?', 'Lightning striking dry grass', 'A child playing with a box of matches', 'A faulty cooker left switched on', 'A burning rubbish heap left unwatched'],
  ], [
    ['Achieng plugs a heater, a kettle and an iron into one socket. What may happen?', 'The socket may overheat and start a fire', 'The socket will only make a loud noise', 'The appliances will work faster than usual', 'Nothing, because the plug is made of plastic'],
    ['A shop keeps petrol in a bottle near the cooker. What is wrong?', 'The fuel can catch fire from the flame', 'The bottle is too small for the fuel', 'The cooker will use up the fuel slowly', 'The petrol makes the shop smell of food'],
    ['Juma lights a candle and goes to sleep. What may cause a fire?', 'The unattended candle may fall or burn down', 'The wind will put out the candle at once', 'The candle will melt into a cold puddle', 'Only lightning can start a fire in a bedroom'],
    ['A farmer burns rubbish and leaves while it still burns in dry weather. What is the danger?', 'Sparks can spread to dry grass and start a fire', 'The rubbish will turn to ash at once', 'The smoke will make the grass grow faster', 'Fires only start in the farm from lightning'],
    ['Why is a damaged wire a danger at school?', 'It can spark and start a fire', 'It makes the room look untidy only', 'It only wastes a little power each day', 'It cannot cause harm when it is switched on'],
  ], [
    ['Which step is the mistake when Wekesa says all fires come from nature?', 'Step 1: A fire starts at a home.', 'Step 2: The cause is an unattended stove.', 'Step 3: Wekesa says fires start only from lightning and the sun.', 'Most fires are caused by people, such as stoves and candles left unattended.', 0],
    ['Which step is the mistake when Fatuma says a damaged wire is harmless?', 'Step 1: A wire has a cracked cover.', 'Step 2: The wire is plugged into a socket.', 'Step 3: Fatuma says it cannot start a fire.', 'A damaged wire can overheat or spark and start a fire.', 1],
    ['Which step is the mistake when Karanja says fuel near a stove is safe?', 'Step 1: Paraffin burns when lit.', 'Step 2: A stove has a flame.', 'Step 3: Karanja says paraffin can stand next to the stove safely.', 'Fuel stored near a flame can catch fire, so it is kept away from heat.', 2],
    ['Which step is the mistake when Rose says only lightning starts bush fires?', 'Step 1: Dry grass burns easily.', 'Step 2: A lit cigarette can fall into dry grass.', 'Step 3: Rose says people can never start a bush fire.', 'People can also start bush fires by carelessness.', 0],
    ['Which step is the mistake when Dan says many plugs in one socket is safe?', 'Step 1: Each appliance uses electricity.', 'Step 2: A socket can carry only so much current.', 'Step 3: Dan says any number of appliances can share it without danger.', 'An overloaded socket can overheat and start a fire.', 1],
  ], 'a'),
  ...S('fp', FS, 'FIRE_PREVENT', ['FP_MATCHES', 'FP_EXITS', 'FP_UNATTENDED'], ['Think about what keeps a fire from starting.', 'Safe habits stop fires before they begin.'], [
    ['Where should matches and lighters be kept?', 'Out of the reach of young children', 'On a low table near the cooker', 'In the open on the kitchen floor', 'In a pocket of the child\'s school bag'],
    ['Which action helps people escape from a fire?', 'Keeping all exits clear and unlocked', 'Locking the doors to keep the smoke in', 'Piling boxes in front of the exit door', 'Closing the windows and standing near them'],
    ['What should you do before leaving a room with a burning candle?', 'Put out the candle before you leave', 'Leave it burning for light till you return', 'Move it near the curtains to keep it safe', 'Ask a small child to watch the candle'],
    ['How should a gas cylinder be stored?', 'Upright in a ventilated place away from heat', 'Lying flat next to a lit jiko', 'Closed in a hot cupboard with the stove', 'Under a bed in a closed bedroom'],
    ['What does a fire drill help people to do?', 'Leave the building quickly and safely', 'Learn to start a small fire on purpose', 'Practise locking all the doors of the school', 'Hide under desks until the fire dies out'],
  ], [
    ['A school keeps the door of the dormitory locked all night. What is wrong?', 'People cannot escape quickly if there is a fire', 'The door will be damaged by the keys', 'Nothing, a locked door protects people from fire', 'The dormitory will be too quiet at night'],
    ['Mother is cooking and the phone rings in another room. What should she do?', 'Switch off the stove or ask someone to watch it', 'Go and talk while the food cooks alone', 'Pour paraffin on the fire to keep it going', 'Leave the pot to cook while she sleeps'],
    ['A child finds a box of matches on the table. What is the safe action?', 'Give it to an adult to keep it out of reach', 'Play with it to see how it works', 'Hide it in the school bag for later use', 'Leave it on the table for others to see'],
    ['A shopkeeper sees a cable with a cracked cover. What should he do?', 'Switch off and have it repaired by an electrician', 'Wrap it in a wet cloth and keep using it', 'Leave it, as the cable will mend itself', 'Move it behind the shelves where nobody sees it'],
    ['How can a school prepare for a fire?', 'Hold fire drills and keep the exits clear', 'Lock the exits so learners stay safe inside', 'Keep fuel next to the classroom doors', 'Tell learners never to talk about fires'],
  ], [
    ['Which step is the mistake when Owino keeps matches within a child\'s reach?', 'Step 1: Matches can start a fire.', 'Step 2: Small children are curious.', 'Step 3: Owino leaves the matches on a low shelf.', 'Matches are kept out of the reach of children.', 0],
    ['Which step is the mistake when Halima blocks the exit with boxes?', 'Step 1: A store has one door.', 'Step 2: Boxes are stacked outside it.', 'Step 3: Halima says the exit is still safe in a fire.', 'Exits must be kept clear so people can escape.', 1],
    ['Which step is the mistake when Peter goes out leaving the stove on?', 'Step 1: The stove is lit.', 'Step 2: Peter goes to the shop.', 'Step 3: He says the stove can burn alone until he returns.', 'A stove or candle must never be left burning unattended.', 2],
    ['Which step is the mistake when Mercy locks the school door during a drill?', 'Step 1: The fire bell rings.', 'Step 2: Learners walk to the door.', 'Step 3: Mercy locks the door so nobody can leave.', 'Exits stay unlocked so people can leave quickly.', 1],
    ['Which step is the mistake when Sam leaves his lighter on the bed?', 'Step 1: A lighter makes a flame.', 'Step 2: His little brother is playing in the room.', 'Step 3: Sam says the lighter can stay there.', 'Lighters are kept away from children.', 0],
  ], 'b'),
  ...S('dt', DS, 'DATA_THREATS', ['DT_NOT_IMPORTANT', 'DT_VIRUS_ONLY', 'DT_THEFT'], ['Think about what would be lost if the phone or computer failed.', 'A device can be harmed in more ways than one.'], [
    ['Why is data on a device worth protecting?', 'It is hard to replace and may be private', 'It is not important to anyone at all', 'It takes up room that could be empty', 'It is only useful on the day it is saved'],
    ['How can a virus reach a computer?', 'Through the internet, flash disks and unknown files', 'Only by using the internet with a browser', 'Only when the computer is switched off', 'By the sun shining on the screen'],
    ['Which is a threat to the data on a phone?', 'The phone being stolen or lost', 'A clean screen with a bright cover', 'A new phone case in a nice colour', 'A charger put away in a drawer'],
    ['Which of these can destroy data on a computer?', 'A power failure while a file is being saved', 'Closing the computer with the correct steps', 'Saving the file on a flash disk', 'Cleaning the keyboard with a dry cloth'],
    ['What does malware do?', 'Harms a device or steals or damages its data', 'Cleans the device and makes it run faster', 'Charges the battery while it is switched off', 'Helps to make backup copies of the files'],
  ], [
    ['Beatrice drops her phone in a river. What was at risk?', 'Her photos, messages and schoolwork', 'Nothing, since data is not important', 'Only the phone cover and its charger', 'Only the sim card number she remembers'],
    ['A flash disk from a friend makes a computer slow and files vanish. What is likely?', 'A virus came from the flash disk', 'Viruses only come from the internet', 'The files were too heavy to stay', 'A new virus cannot come from any flash disk'],
    ['A thief takes a school laptop. What is the main danger to data?', 'The thief can read or lose the data on it', 'The data will be safe with the thief', 'The laptop will not be missed at school', 'Only the laptop charger is lost'],
    ['A student deletes a file by mistake and has no copy. What kind of threat is this?', 'Accidental deletion', 'A natural fire', 'A theft of the device', 'A power failure at school'],
    ['Why do schools worry about hackers?', 'They can enter a system and steal or change data', 'They only make the computers look nice', 'They repair broken computers for free', 'They only visit when the power is off'],
  ], [
    ['Which step is the mistake when Ian says data is not valuable?', 'Step 1: His phone holds his schoolwork.', 'Step 2: The phone gets lost.', 'Step 3: Ian says nothing important was lost.', 'Schoolwork and photos are hard to replace and may be private.', 0],
    ['Which step is the mistake when Ruth says viruses only come from the internet?', 'Step 1: A virus is harmful software.', 'Step 2: A flash disk can carry files.', 'Step 3: Ruth says a flash disk can never carry a virus.', 'A flash disk can carry a virus as well as the internet.', 1],
    ['Which step is the mistake when Tom says a stolen phone is no risk to data?', 'Step 1: A thief takes a phone.', 'Step 2: The phone holds photos and messages.', 'Step 3: Tom says the data is safe from the thief.', 'Theft or loss of a device is a threat to its data.', 2],
    ['Which step is the mistake when Zawadi says only hackers harm data?', 'Step 1: Hackers are a threat.', 'Step 2: A power cut can also harm a file being saved.', 'Step 3: Zawadi says there are no other threats.', 'Data is threatened by viruses, theft, power failure and accidents too.', 1],
    ['Which step is the mistake when Eric says a virus helps a computer?', 'Step 1: Viruses are malware.', 'Step 2: They spread in files.', 'Step 3: Eric says a virus keeps the computer healthy.', 'A virus harms a device and its data.', 1],
  ], 'b'),
  ...S('dp', DS, 'DATA_PROTECT', ['DP_PASSWORD_SHARE', 'DP_BACKUP', 'DP_UNKNOWN_LINK'], ['Think about what keeps a second copy and a secret safe.', 'Protect the device, the password and the copies.'], [
    ['What should you do with your password?', 'Keep it secret and share it with nobody', 'Share it with a close friend to be safe', 'Write it on the front of the device', 'Tell it to a classmate who asks for it'],
    ['Why make a backup copy of important files?', 'To keep a copy if the device is lost or fails', 'Because a second copy is never needed', 'To make the device run much slower', 'So the first copy can be deleted at once'],
    ['What should you do with a link sent by a stranger?', 'Not open it and tell a trusted adult', 'Open it quickly to see what is inside', 'Send it on to all your friends', 'Open it only when the screen is dark'],
    ['Which is a strong password?', 'A long mix of letters, numbers and symbols', 'Your first name only, in small letters', 'The numbers 1234 typed in order', 'The word password written in small letters'],
    ['What does antivirus software do?', 'Finds and removes harmful programs', 'Makes the keyboard look new and clean', 'Charges the phone from the wall socket', 'Lets friends use your password safely'],
  ], [
    ['Wanjiku shares her phone password with a friend. What can happen?', 'The friend may read or change her private data', 'The phone will work much faster', 'Nothing, since a friend can be trusted always', 'Her password will be made stronger'],
    ['A school keeps all its records on one computer with no copy. What is the risk?', 'All the records are lost if the computer fails', 'The records will be safer on one computer', 'The computer will become faster with no copy', 'Nothing, because computers never fail'],
    ['A message says you won a prize and asks you to open a link. What should you do?', 'Not open it, as it may carry a virus or trick', 'Open it quickly before the prize is gone', 'Forward it to the whole class to share', 'Reply with your password to claim the prize'],
    ['Which action protects the data on a lost school tablet?', 'A screen lock with a password', 'Writing the password on the tablet cover', 'Leaving the tablet open for anyone', 'Turning off the lock to save time'],
    ['How often should antivirus software be updated?', 'Regularly, to find new harmful programs', 'Never, as the first version is enough', 'Only when the computer is sold', 'Only when the screen goes dark'],
  ], [
    ['Which step is the mistake when Kevin shares his password with his friend?', 'Step 1: A password protects the account.', 'Step 2: Anyone with it can enter the account.', 'Step 3: Kevin says sharing it is safe.', 'A password is kept secret and shared with nobody.', 0],
    ['Which step is the mistake when Mary keeps only one copy of her essay?', 'Step 1: The essay is stored on a flash disk.', 'Step 2: The flash disk can be lost.', 'Step 3: Mary says no second copy is needed.', 'A backup copy on another device keeps the essay safe.', 1],
    ['Which step is the mistake when Paul opens a link from a stranger?', 'Step 1: A message arrives from an unknown sender.', 'Step 2: It has a link.', 'Step 3: Paul says it is safe to open.', 'Unknown links can carry viruses, so they are not opened.', 2],
    ['Which step is the mistake when Sheila writes her password on a note beside her phone?', 'Step 1: A password protects the phone.', 'Step 2: Others can see the note.', 'Step 3: Sheila says the password is still secret.', 'A password must be kept secret, not left where others can read it.', 0],
    ['Which step is the mistake when Ben says antivirus is not needed?', 'Step 1: Viruses spread through files.', 'Step 2: Antivirus finds them.', 'Step 3: Ben says antivirus is of no use.', 'Antivirus software finds and removes harmful programs.', 1],
  ], 'c'),
  ...S('di', PG, 'DRAW_INSTRUMENTS', ['DI_TOOL_MIX', 'DI_TSQUARE', 'DI_PROTRACTOR'], ['Match the instrument to its job.', 'Each drawing instrument has one main use.'], [
    ['Which instrument is used to draw circles and arcs?', 'A compass', 'A set square', 'A protractor', 'A ruler'],
    ['What does a T-square draw?', 'Horizontal lines along the board', 'Angles of any size', 'Circles of any size', 'Curved lines through points'],
    ['What does a protractor measure?', 'Angles', 'Lengths of lines', 'Areas of shapes', 'The weight of a pencil'],
    ['Which instruments draw upright and slanting lines at set angles?', 'Set squares', 'A pair of compasses', 'An eraser and a pencil', 'A ruler and a protractor'],
    ['Which instrument measures the length of a line?', 'A ruler', 'A protractor', 'A T-square', 'A pair of compasses'],
  ], [
    ['Achola wants to draw a circle of radius 3 cm. Which instrument does she use?', 'A compass', 'A set square', 'A protractor', 'A T-square'],
    ['Brian slides an instrument along the edge of the board to draw parallel lines. What is it?', 'A T-square', 'A protractor', 'A compass', 'An eraser'],
    ['Cynthia must measure the angle at a corner of a drawing. What does she use?', 'A protractor', 'A ruler', 'A T-square', 'A drawing board'],
    ['David must draw a line at 45 degrees. Which instrument helps him?', 'A 45 degree set square', 'A pair of compasses', 'A pencil sharpener', 'A drawing pin'],
    ['Esther needs to measure a line 12 cm long. Which instrument does she use?', 'A ruler', 'A compass', 'A protractor', 'A T-square'],
  ], [
    ['Which step is the mistake when Gideon says the T-square measures angles?', 'Step 1: A T-square has a long blade.', 'Step 2: The head slides on the board edge.', 'Step 3: Gideon says it measures angles.', 'A T-square draws horizontal lines. A protractor measures angles.', 1],
    ['Which step is the mistake when Hilda says a set square draws circles?', 'Step 1: A set square is a triangle.', 'Step 2: It has a right angle.', 'Step 3: Hilda says it draws circles.', 'A compass draws circles. A set square draws upright and slanting lines.', 0],
    ['Which step is the mistake when Isaac says a protractor measures length?', 'Step 1: A protractor is half a circle.', 'Step 2: It has degrees marked on it.', 'Step 3: Isaac says it measures length.', 'A protractor measures angles. A ruler measures length.', 2],
    ['Which step is the mistake when Judy says a compass draws horizontal lines?', 'Step 1: A compass has a point and a pencil.', 'Step 2: It turns around the point.', 'Step 3: Judy says it draws horizontal lines.', 'A compass draws circles and arcs.', 0],
    ['Which step is the mistake when Kofi uses a ruler to measure an angle?', 'Step 1: A ruler has a scale.', 'Step 2: It measures length.', 'Step 3: Kofi says it measures angles.', 'A protractor measures angles.', 2],
  ], 'a'),
  ...S('dl', PG, 'DRAW_LAYOUT', ['DL_TITLE_TOP', 'DL_NO_BORDER', 'DL_A4'], ['Picture a real drawing sheet.', 'A sheet has a border, a title block and a working area.'], [
    ['Where is the title block on a drawing sheet?', 'At the bottom right of the sheet', 'At the top left of the sheet', 'In the middle of the sheet', 'Along the top edge of the sheet'],
    ['What is the border of a drawing sheet?', 'A frame drawn a little inside the edges', 'A line drawn across the middle of the sheet', 'A thick line drawn on the edge of the board', 'A short line drawn under the title block'],
    ['What is the size of an A4 sheet?', '297 by 210 millimetres', '420 by 297 millimetres', '594 by 420 millimetres', '148 by 105 millimetres'],
    ['Which information goes in the title block?', 'The name, title, scale, date and sheet number', 'Only the drawing and its shapes', 'Only the border and the margins', 'Only a picture of the object'],
    ['Why does a sheet have a border?', 'To frame the drawing and show where it ends', 'To use up the ink on the sheet', 'To make the paper stronger', 'To show where the title block must go'],
  ], [
    ['Lilian looks for the scale of a drawing. Where does she look?', 'In the title block at the bottom right', 'At the top left of the sheet', 'Along the border of the sheet', 'In the middle of the working area'],
    ['Moses forgets to draw the frame on his sheet. What did he leave out?', 'The border', 'The title block', 'The working area', 'The paper size'],
    ['A teacher says the paper is 297 by 210 millimetres. Which size is it?', 'A4', 'A3', 'A2', 'A1'],
    ['Naomi must write her name and the date on the sheet. Where does she put them?', 'In the title block', 'Inside the working area', 'Outside the border on the board', 'Along the top edge of the sheet'],
    ['What is the working area of a drawing sheet?', 'The space inside the border where the drawing is made', 'The space outside the border on the board', 'The title block at the bottom right', 'The edge of the sheet where it is cut'],
  ], [
    ['Which step is the mistake when Oscar puts the title block at the top?', 'Step 1: A sheet has a title block.', 'Step 2: It gives the title and scale.', 'Step 3: Oscar says it goes at the top left.', 'The title block is at the bottom right of the sheet.', 0],
    ['Which step is the mistake when Pendo leaves out the border?', 'Step 1: She pins the sheet to the board.', 'Step 2: She draws the title block.', 'Step 3: She says no border is needed.', 'A border frames the drawing a little inside the edges.', 1],
    ['Which step is the mistake when Quincy says A4 is 420 by 297 millimetres?', 'Step 1: Sizes are in millimetres.', 'Step 2: A3 is bigger than A4.', 'Step 3: Quincy says A4 is 420 by 297 millimetres.', 'A4 is 297 by 210 millimetres.', 2],
    ['Which step is the mistake when Rita draws outside the border?', 'Step 1: She draws the border.', 'Step 2: The border shows the working area.', 'Step 3: She draws the shapes outside it.', 'The drawing is made inside the border.', 1],
    ['Which step is the mistake when Simon puts the date in the working area?', 'Step 1: A sheet has a title block.', 'Step 2: It holds the date.', 'Step 3: Simon writes the date among the shapes.', 'The date goes in the title block.', 0],
  ], 'b'),
  ...S('dm', DM, 'DIM_TYPES', ['DM_LINE_MIX', 'DM_UNITS', 'DM_OBJECT_LINE'], ['Think of a dimensioned drawing.', 'Dimension lines are thin and have arrowheads.'], [
    ['Which line has arrowheads and shows the size of a part?', 'The dimension line', 'The extension line', 'The object line', 'The centre line'],
    ['In which unit are sizes normally given on a drawing?', 'Millimetres', 'Metres', 'Kilometres', 'Centimetres only'],
    ['Which line is thick and shows the shape of the object?', 'The object line', 'The dimension line', 'The extension line', 'The leader line'],
    ['Which lines stretch out from the object to show where a dimension starts?', 'Extension lines', 'Object lines', 'Dimension lines', 'Border lines'],
    ['Where is the figure written on a dimension line?', 'Above the dimension line', 'Below the border line', 'Inside the object', 'Beside the title block'],
  ], [
    ['Tabitha sees a thin line with arrowheads at both ends and a number above it. What is it?', 'A dimension line', 'An extension line', 'An object line', 'A border line'],
    ['A drawing of a small bolt shows 25. Which unit is it, unless stated otherwise?', 'Millimetres', 'Metres', 'Kilometres', 'Centimetres only'],
    ['Uzma traces the thick outline of a drawing. Which line is she tracing?', 'The object line', 'The dimension line', 'The extension line', 'The leader line'],
    ['A thin line leaves a corner of the object and goes past the dimension line. What is it?', 'An extension line', 'An object line', 'A dimension line', 'A border line'],
    ['A line with an arrow points to a note about the hole. What is it called?', 'A leader line', 'An object line', 'A dimension line', 'An extension line'],
  ], [
    ['Which step is the mistake when Victor says dimension lines are thick?', 'Step 1: Lines on a drawing differ.', 'Step 2: Object lines are thick.', 'Step 3: Victor says dimension lines are thick too.', 'Dimension lines are thin. Object lines are thick.', 2],
    ['Which step is the mistake when Winnie says sizes are in metres?', 'Step 1: A drawing shows a small part.', 'Step 2: The size is a whole number.', 'Step 3: Winnie says the size is in metres.', 'Sizes on drawings are normally in millimetres.', 1],
    ['Which step is the mistake when Xavier calls the extension line a dimension line?', 'Step 1: Both are thin lines.', 'Step 2: One has arrowheads.', 'Step 3: Xavier says the line without arrowheads is the dimension line.', 'The dimension line has arrowheads. Extension lines stretch from the object.', 0],
    ['Which step is the mistake when Yusuf says the figure goes below the border?', 'Step 1: A dimension line shows a size.', 'Step 2: A figure gives the size.', 'Step 3: Yusuf puts the figure below the border.', 'The figure is written above the dimension line.', 0],
    ['Which step is the mistake when Zainabu uses the object line as the dimension line?', 'Step 1: The object line is thick.', 'Step 2: The dimension line is thin.', 'Step 3: Zainabu uses the thick line as the dimension line.', 'The dimension line is thin and has arrowheads.', 2],
  ], 'a'),
  ...S('dr', DM, 'DIM_READ', ['DR_ADD', 'DR_DIAMETER', 'DR_UNIT'], ['Add the parts for the whole, and double the radius for the diameter.', 'A size always has a unit.'], [
    ['A part has two sections 30 mm and 45 mm long. What is the overall length?', '75 mm', '15 mm', '1 350 mm', '30 mm'],
    ['The radius of a circle is 20 mm. What is its diameter?', '40 mm', '10 mm', '20 mm', '400 mm'],
    ['What must be written with a dimension?', 'The number and the unit', 'Only the number', 'Only the unit', 'Only the object name'],
    ['A bar 120 mm long has a part of 45 mm. What is the length of the rest?', '75 mm', '165 mm', '45 mm', '120 mm'],
    ['The diameter of a hole is 50 mm. What is its radius?', '25 mm', '100 mm', '50 mm', '5 mm'],
  ], [
    ['A plank has sections of 60 mm, 40 mm and 25 mm. What is the overall length?', '125 mm', '25 mm', '60 mm', '40 mm'],
    ['A pipe has radius 15 mm. A learner needs the diameter. What does he write?', '30 mm', '7.5 mm', '15 mm', '225 mm'],
    ['A drawing shows a length as 80. What is missing?', 'The unit, such as millimetres', 'The border of the sheet', 'The title of the object', 'The date of the drawing'],
    ['A rod is 200 mm long. A part of 85 mm is cut. How long is the rest?', '115 mm', '285 mm', '85 mm', '200 mm'],
    ['A wheel has diameter 90 mm. What is its radius?', '45 mm', '180 mm', '90 mm', '9 mm'],
  ], [
    ['Which step is the mistake when Adam subtracts to find the overall length of 30 mm and 45 mm?', 'Step 1: The part has two sections.', 'Step 2: The overall length is the whole.', 'Step 3: Adam subtracts and gets 15 mm.', 'Add the sections: 30 plus 45 is 75 mm.', 0],
    ['Which step is the mistake when Beth says the diameter is half the radius?', 'Step 1: The radius is 20 mm.', 'Step 2: The diameter goes right across the circle.', 'Step 3: Beth says the diameter is 10 mm.', 'The diameter is twice the radius: 40 mm.', 1],
    ['Which step is the mistake when Chris writes only 75 as a dimension?', 'Step 1: He added the sections.', 'Step 2: The total is 75.', 'Step 3: He writes only 75 with no unit.', 'A dimension needs a unit, normally millimetres.', 2],
    ['Which step is the mistake when Diana adds to find a missing part of 120 mm with 45 mm known?', 'Step 1: The whole is 120 mm.', 'Step 2: One part is 45 mm.', 'Step 3: Diana adds and gets 165 mm.', 'Subtract the known part from the whole: 120 minus 45 is 75 mm.', 0],
    ['Which step is the mistake when Eli says the radius is double the diameter?', 'Step 1: The diameter is 50 mm.', 'Step 2: The radius is half of it.', 'Step 3: Eli says the radius is 100 mm.', 'The radius is half the diameter: 25 mm.', 1],
  ], 'c'),
  ...S('sc', PS, 'PLAIN_SCALE', ['SC_INVERT', 'SC_CALC', 'SC_ENLARGE'], ['A scale compares the drawing with the real object.', 'To find the real length, multiply the drawing length by the scale number.'], [
    ['What does a scale of 1:50 mean?', 'One unit on the drawing stands for 50 on the object', 'The drawing is 50 times bigger than the object', 'The object is 50 times smaller than the drawing', 'The drawing has 50 lines on it'],
    ['A line is 4 cm long on a drawing of scale 1:50. What is the real length?', '200 cm', '0.08 cm', '54 cm', '46 cm'],
    ['What does a scale of 2:1 mean?', 'The drawing is twice as big as the object', 'The drawing is half as big as the object', 'The drawing is the same size as the object', 'The object is twice as big as the drawing'],
    ['What does a scale of 1:1 mean?', 'The drawing is the same size as the object', 'The drawing is twice the size of the object', 'The drawing is half the size of the object', 'The drawing has only one line'],
    ['A wall is 300 cm long. What length is drawn at scale 1:50?', '6 cm', '15 000 cm', '350 cm', '250 cm'],
  ], [
    ['A room plan has scale 1:100. A wall measures 5 cm on the plan. What is the real length?', '500 cm', '0.05 cm', '105 cm', '95 cm'],
    ['A drawing of a small screw is at scale 5:1. What does this mean?', 'The drawing is five times bigger than the screw', 'The drawing is five times smaller than the screw', 'The drawing is the same size as the screw', 'The screw is five times bigger than the drawing'],
    ['A table is 120 cm long. Its drawing is at scale 1:10. How long is the drawing?', '12 cm', '1 200 cm', '130 cm', '110 cm'],
    ['A plan is at 1:20. A door is 10 cm wide on the plan. What is the real width?', '200 cm', '0.5 cm', '30 cm', '10 cm'],
    ['An architect draws a big building on a small sheet. Which scale does she use?', 'A reduction such as 1:100', 'An enlargement such as 100:1', 'Full size, 1:1', 'A scale of 100 millimetres'],
  ], [
    ['Which step is the mistake when Faraja says 1:50 makes the drawing bigger?', 'Step 1: A scale compares sizes.', 'Step 2: In 1:50 the first number is the drawing.', 'Step 3: Faraja says the drawing is 50 times bigger.', 'In 1:50 the object is 50 times bigger than the drawing.', 0],
    ['Which step is the mistake when George divides 4 cm by 50 to find the real length?', 'Step 1: The drawing length is 4 cm.', 'Step 2: The scale is 1:50.', 'Step 3: George divides 4 by 50.', 'Multiply the drawing length by 50: 200 cm.', 1],
    ['Which step is the mistake when Hawa says 2:1 is a reduction?', 'Step 1: A scale of 2:1 has the drawing first.', 'Step 2: The drawing number is bigger.', 'Step 3: Hawa says the drawing is smaller than the object.', 'A scale of 2:1 makes the drawing twice as big as the object.', 2],
    ['Which step is the mistake when Ivan multiplies a real length of 300 cm by 50 to find the drawing length?', 'Step 1: The real length is 300 cm.', 'Step 2: The scale is 1:50.', 'Step 3: Ivan multiplies 300 by 50.', 'Divide the real length by 50 to get the drawing length: 6 cm.', 1],
    ['Which step is the mistake when Joy says 1:1 is a small drawing?', 'Step 1: The scale is 1:1.', 'Step 2: The two numbers are equal.', 'Step 3: Joy says the drawing is much smaller.', 'A scale of 1:1 is full size.', 2],
  ], 'b'),
  ...S('vp', VP, 'VISUAL_PROG', ['VP_TEXT', 'VP_TOOL', 'VP_LOOP'], ['Visual programming uses blocks.', 'A loop repeats steps.'], [
    ['How are programs made in visual programming?', 'By joining blocks together', 'By typing long lines of code', 'By drawing on paper only', 'By switching the computer off'],
    ['Which is a visual programming tool?', 'Scratch', 'A calculator', 'A printer', 'A keyboard'],
    ['What does a loop do in a program?', 'Repeats instructions', 'Stops the program', 'Deletes the program', 'Saves the file'],
    ['What is the stage in Scratch?', 'The area where sprites act', 'The palette of colours', 'The place where the code is deleted', 'The menu of files'],
    ['Which block makes a program react when a key is pressed?', 'An event block', 'A loop block', 'A stop block', 'A colour block'],
  ], [
    ['Alice wants a sprite to take ten steps again and again. What does she use?', 'A loop block', 'A stop block', 'A colour block', 'A delete block'],
    ['A class builds a game by snapping coloured blocks together. What is this?', 'Visual programming', 'Typing lines of text code', 'Drawing a map by hand', 'Cleaning the computer screen'],
    ['Brian uses App Inventor to build a phone app. What kind of tool is this?', 'A visual programming tool', 'A calculator tool', 'A printing tool', 'A cleaning tool'],
    ['Cate wants a sprite to say hello when the green flag is clicked. Which block starts it?', 'An event block', 'A loop block', 'A delete block', 'A size block'],
    ['Where do the blocks go to make a script?', 'In the script area', 'In the dustbin of the computer', 'On the printer', 'In the keyboard'],
  ], [
    ['Which step is the mistake when Dan says visual programming means typing code?', 'Step 1: Scratch is a visual tool.', 'Step 2: Blocks are dragged.', 'Step 3: Dan says every line must be typed.', 'In visual programming, blocks snap together.', 0],
    ['Which step is the mistake when Eve says a calculator is a visual programming tool?', 'Step 1: Scratch is visual programming.', 'Step 2: App Inventor is too.', 'Step 3: Eve says a calculator is one.', 'Scratch and App Inventor are visual programming tools.', 1],
    ['Which step is the mistake when Fred says a loop stops a program?', 'Step 1: A sprite moves.', 'Step 2: A loop repeats steps.', 'Step 3: Fred says a loop ends the program.', 'A loop repeats instructions.', 2],
    ['Which step is the mistake when Gina says blocks cannot be joined?', 'Step 1: A block is a piece of code.', 'Step 2: Blocks snap together.', 'Step 3: Gina says each block must stay alone.', 'Blocks join to make a script.', 0],
    ['Which step is the mistake when Hank says an event block repeats steps?', 'Step 1: An event waits for something.', 'Step 2: A key press can be an event.', 'Step 3: Hank says an event repeats steps.', 'A loop repeats steps. An event starts a script.', 2],
  ], 'b'),
];
