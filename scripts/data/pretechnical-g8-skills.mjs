// ============================================================================
// PRE-TECHNICAL STUDIES GRADE 8: the authored skills and misconception library (13 Nov 2026, offline, no model call).
// Merged into curriculum/pre_technical/g8.json by scripts/build-pretechnical-g8.mjs. KICD's outcomes and rubrics are never touched.
// KICD's outcome codes begin 'PRE_.G8.' (the underscore does not fit the registry's four-capital prefix), so the SKILL codes of this
// subject-grade begin 'PRET.G8.' and the registry entry's prefix is 'PRET'. Outcome codes are unchanged.
// Sub-strand keys are the code after 'PRE_.G8.'. A skill: [sub, key, name, outcome letters, prerequisites, forms[], mastery].
// Prerequisites: 'P7:KEY' a Grade 7 Pre-Technical skill (keys are unique), 'S6:' / 'S5:' a Science and Technology skill (after 'SCIE.G<n>.'),
// 'M:<full code>' a Mathematics skill, 'S:KEY' a Grade 8 skill of this file. Every Grade 7 skill whose leads_to names a Grade 8 outcome becomes
// a prerequisite of the Grade 8 skill that covers it (the build adds the link).
// A misconception: [skill key, short code, error, example question, wrong answer, right answer, cause, help, feedback, source?].
// Everything is draft until a CBC Pre-Technical teacher reviews it. Making, tool use, extinguishing a fire and projects are not testable here:
// see the non-question list. Fire-safety, data-safety and money statements are to be confirmed by a teacher.
// ============================================================================
export const FS = 'FOUNDA.FIRE_SAFETY', DS = 'FOUNDA.DATA_SAFETY';
export const PG = 'COMMUN.PLANE_GEOMETRY', DM = 'COMMUN.DIMENSIONING', PS = 'COMMUN.PLAIN_SCALE_DRAWING', VP = 'COMMUN.VISUAL_PROGRAMMING';
export const CM = 'MATERI.COMPOSITE_MATERIALS', CR = 'MATERI.CERAMIC_MATERIALS';
export const CT = 'TOOLS_.CUTTING_TOOLS', SW = 'TOOLS_.COMPUTER_SOFTWARE';
export const BK = 'ENTREP.BOOKKEEPING', IB = 'ENTREP.INCOME_AND_BUDGETING', MK = 'ENTREP.OF_GOODS_AND_SERVICES', DI = 'ENTREP.DISTRIBUTION_OF_GOODS_AN';

const TC = 'To confirm by a teacher: a common classroom error, not traced to a study by the author.';
const SAFE = 'To confirm by a teacher: a safety statement written for Grade 8.';
const F4 = 'find the false step in a learner\'s reason';
// [sub, key, name, outcomes, pre[], forms[], mastery]
export const SKILLS = [
  [FS, 'FIRE_CAUSES', 'Name the causes of fire outbreaks at home, school and in the community', ['a'], ['P7:SAFETY_THREATS'],
    ['pick a cause of fire', 'say which is a natural and which a human cause', 'say what a fire needs', F4],
    'The child names causes of fire (a lit candle or match left unattended, faulty or overloaded electrical wiring, an unattended cooking fire or stove, careless disposal of cigarettes, leaking gas, children playing with matches, lightning and dry grass in the hot sun) and does not say fires have only natural causes.'],
  [FS, 'FIRE_PREVENT', 'Pick ways to prevent fire outbreaks', ['b'], ['S:FIRE_CAUSES'],
    ['pick the way to prevent a fire', 'say what to do with matches and fuel', 'say what to do with wiring and exits', F4],
    'The child picks ways to prevent fire (keep matches and lighters away from children, store paraffin, petrol and gas safely away from heat, never leave a stove or candle unattended, repair damaged wires, do not overload sockets, keep exits clear and have a fire drill) and does not block exits or store fuel near a stove.'],
  [DS, 'DATA_THREATS', 'Say why data matters and name the threats to data on a device', ['a', 'b'], ['P7:COMP_CHARS'],
    ['say why data is valuable', 'pick a threat to data', 'say what a virus does', F4],
    'The child says data (documents, photos, messages, schoolwork) is valuable because it is hard to replace and may be private, and names threats (viruses and other malware, theft or loss of the device, hackers, power failure, accidental deletion, a spoilt storage device), and does not say a virus can only come from the internet.'],
  [DS, 'DATA_PROTECT', 'Pick ways to protect data on a device', ['c'], ['S:DATA_THREATS'],
    ['pick the way to protect data', 'say what a good password is', 'say what a backup is', F4],
    'The child picks ways to protect data (a strong password that is kept secret, a backup copy on another device, antivirus software kept up to date, locking the screen, not opening unknown links or attachments, keeping the device safe) and does not share a password or keep only one copy.'],
  [PG, 'DRAW_INSTRUMENTS', 'Name the instruments used in technical drawing and what each does', ['a'], ['P7:DRAW_LINES'],
    ['pick the instrument for a task', 'say what the set square does', 'say what the compass does', F4],
    'The child names the T-square (draws horizontal lines), set squares of 45 and 30/60 degrees (draw upright and slanted lines), the compass (draws circles and arcs), the protractor (measures angles), the ruler (measures lengths), the drawing board, a hard pencil for fine lines and the eraser, and does not mix them up.'],
  [PG, 'DRAW_LAYOUT', 'Say how a drawing sheet is laid out', ['b'], ['S:DRAW_INSTRUMENTS'],
    ['pick the part of the sheet', 'say where the title block goes', 'say the size of an A4 sheet', F4],
    'The child says a drawing sheet has a border (a frame drawn a little inside the edges), a title block (name, title, scale, date and sheet number) at the bottom right, a clear working area, and that A4 is 297 by 210 millimetres, and does not put the title block at the top or leave out the border.'],
  [DM, 'DIM_TYPES', 'Name the parts of dimensioning and the types of dimension', ['a'], ['P7:DRAW_SYMBOLS', 'S:DRAW_INSTRUMENTS'],
    ['pick the line from its job', 'say where the figure is placed', 'pick the unit used', F4],
    'The child names the dimension line (a thin line with arrowheads showing the size), extension lines (thin lines that stretch out from the object), the leader line (points to a note), the figure (written above the dimension line), the symbols for diameter and radius, and says sizes on drawings are normally in millimetres, and does not use the object line as a dimension line.'],
  [DM, 'DIM_READ', 'Read and work out dimensions of given shapes', ['c'], ['S:DIM_TYPES', 'M:MATH.G4.MEASUR.LENGTH.M_CM_RELATION'],
    ['read the overall length', 'work out a missing dimension', 'work out the diameter from the radius', F4],
    'The child reads a dimension from the drawing, adds the parts to get the overall length, subtracts to find a missing part, says the diameter is twice the radius, and keeps the unit with the answer.'],
  [PS, 'PLAIN_SCALE', 'Read a scale and work out real sizes from a drawing', ['a', 'b'], ['M:MATH.G4.MEASUR.LENGTH.M_CM_RELATION', 'S:DIM_READ'],
    ['say what a scale means', 'work out the real length', 'work out the drawing length', F4],
    'The child says a scale such as 1:50 means one unit on the drawing stands for 50 of the same unit on the real object, multiplies a drawing length by the scale to get the real length and divides a real length by the scale to get the drawing length, knows 1:1 is full size and 2:1 is an enlargement, and keeps the units.'],
  [VP, 'VISUAL_PROG', 'Say what visual programming is and name its features and uses', ['a', 'b'], ['P7:ICT_TOOLS'],
    ['pick a visual programming tool', 'pick a feature of such a tool', 'say what a loop or an event does', F4],
    'The child says visual programming builds programs by snapping together blocks instead of typing code, names tools such as Scratch and App Inventor, names features (a block palette, a script area, a stage with sprites, events, loops and decisions), and says a loop repeats instructions.'],
  [CM, 'COMPOSITE', 'Say what composite materials are made of and what they are used for', ['a', 'b', 'c'], ['P7:MAT_METAL_NONMETAL'],
    ['pick the composite material', 'pick what it is made of', 'pick its use', F4],
    'The child says a composite material joins two or more materials to get a better one, and names concrete (cement, sand, ballast and water), reinforced concrete (concrete with steel bars), plywood (thin layers of wood glued crosswise), fibreglass (glass fibre in resin), and mud and straw bricks, with uses (buildings and slabs, furniture and boards, boat hulls and tanks, walls), and does not call concrete a single material.'],
  [CR, 'CERAMIC', 'Say what ceramic materials are, their properties and uses', ['a', 'b', 'c'], ['P7:NONMETAL_PROPERTIES'],
    ['pick the ceramic material', 'pick its property', 'pick its use', F4],
    'The child names ceramics (clay pots, bricks, floor and wall tiles, porcelain cups and sinks, electrical insulators), says they are hard, brittle (they break or crack when hit or dropped), resist heat and corrosion and do not conduct electricity, and says tiles, bricks, sinks and insulators use these properties.'],
  [CT, 'CUT_TOOLS', 'Choose the right cutting tool for a task and look after it', ['a', 'b', 'd'], ['P7:MEAS_TOOLS', 'P7:TOOL_CARE'],
    ['pick the tool for a task', 'pick the way to care for the tool', 'say what a blunt tool does', F4],
    'The child picks the hacksaw for metal, the tenon saw for wood, the coping saw for curves, the chisel for shaping wood, the plane for smoothing wood, the tin snips for sheet metal and scissors for card and cloth, and picks care (keep blades sharp and clean, oil steel blades, store with guards, carry points down) and does not use a wood saw on metal.'],
  [SW, 'SOFTWARE', 'Sort software into system, application and utility and say what applications do', ['a', 'b'], ['P7:HW_CLASSIFY', 'P7:COMP_CHARS'],
    ['sort the software', 'pick the application for a task', 'say what an operating system does', F4],
    'The child says system software runs the computer (an operating system such as Windows, Android or Linux), application software does a task for the user (a word processor for letters, a spreadsheet for calculations, a presentation program for slides, a browser for the web, a database for records), utility software looks after the computer (antivirus), and that software cannot be touched while hardware can.'],
  [BK, 'BOOKKEEPING', 'Say why a business keeps records and classify transactions', ['a', 'b'], ['P7:ENT_MEANING', 'P7:FIN_NUMBERS'],
    ['say why records matter', 'sort a transaction', 'sort cash and credit', F4],
    'The child says a business keeps records to know its income, spending, profit or loss, to plan, to pay tax and to get loans, and sorts transactions into cash (paid now) and credit (paid later), income and expenditure, and assets (what a business owns), liabilities (what it owes) and capital (what the owner put in).'],
  [IB, 'BUDGET', 'Name sources of income and say why and how to budget honestly', ['a', 'b', 'd'], ['S:BOOKKEEPING', 'P7:FIN_NUMBERS'],
    ['pick a source of income', 'say why a budget matters', 'pick an ethical or unethical practice', F4],
    'The child names sources of income (wages or a salary, profit from a business, sales of farm produce, gifts and pocket money, interest), says a budget plans the income and spending so that needs come first and some is saved, and tells an honest budget from an unethical practice (hiding spending, using money meant for something else, borrowing without a plan to repay, cheating others).'],
  [MK, 'MARKETING', 'Say why a business markets, where it learns about the market and how it promotes goods', ['a', 'b', 'c', 'd'], ['S:BOOKKEEPING', 'P7:ENT_MEANING'],
    ['say why marketing matters', 'pick a source of market information', 'pick a factor in choosing a market', 'pick a tool of marketing'],
    'The child says marketing helps a business find customers and sell, names sources of market information (asking customers, watching competitors, a survey, the internet, newspapers and radio), names factors in choosing a market (customer demand, price, location, competition, transport) and tools (a poster, radio, social media, samples, a price offer, word of mouth).'],
  [DI, 'DISTRIBUTION', 'Say what intermediaries do, the channels of distribution and ethics in distribution', ['a', 'b', 'c'], ['S:MARKETING'],
    ['pick the intermediary', 'put the channel in order', 'pick the ethical practice', F4],
    'The child names intermediaries (wholesalers who sell in bulk to retailers, retailers who sell to buyers, agents who bring buyers and sellers together), puts channels in order (producer to consumer; producer to retailer to consumer; producer to wholesaler to retailer to consumer), and picks ethical practices (honest weights and measures, fair prices, safe delivery, not hoarding) over unethical ones.'],
];

// [skill, code, error, example question, wrong answer, right answer, help, feedback, source?]
const m = (skill, code, error, q, wrong, right, help, feedback, source) => [skill, `M_PT8_${code}`, error, q, wrong, right, 'The child mixes up two ideas that sound alike or are taught close together.', help, feedback, source || TC];
const s = (...a) => m(...a, SAFE);

export const MIS = [
  s('FIRE_CAUSES', 'FC_NATURE_ONLY', 'Thinks fires start only from lightning or the sun.', 'Which is a common cause of fires in homes?', 'Only lightning', 'A candle or stove left unattended', 'List the causes of fires near your home.', 'Most fires at home start from careless human acts such as an unattended candle or stove.'),
  s('FIRE_CAUSES', 'FC_WIRING', 'Does not know faulty wiring can cause fire.', 'Which can cause an electrical fire?', 'A switched-off lamp', 'Overloaded sockets or damaged wires', 'Look for scorch marks on a socket.', 'Overloaded sockets and damaged wires get hot and can start a fire.'),
  s('FIRE_CAUSES', 'FC_FUEL', 'Thinks stored paraffin or gas is harmless near heat.', 'Why is paraffin kept away from the stove?', 'It is only heavy', 'Its vapour can catch fire', 'Ask what paraffin is for.', 'Fuels burn easily, so they are stored away from heat.'),
  s('FIRE_PREVENT', 'FP_MATCHES', 'Leaves matches where children can reach them.', 'Where should matches be kept?', 'On the kitchen table', 'Out of the reach of children', 'Walk the house and find where matches are kept.', 'Matches are kept out of the reach of children.'),
  s('FIRE_PREVENT', 'FP_EXITS', 'Blocks or locks exits.', 'Which action helps people escape from a fire?', 'Locking the exit door', 'Keeping the exits clear', 'Practise a drill.', 'Exits must be clear and unlocked in a fire.'),
  s('FIRE_PREVENT', 'FP_UNATTENDED', 'Leaves a stove or candle burning while out of the room.', 'What should you do before leaving a room with a candle?', 'Leave it to burn', 'Put it out', 'Count the times you left a candle.', 'Never leave a stove or candle burning unattended.'),
  m('DATA_THREATS', 'DT_NOT_IMPORTANT', 'Thinks data on a device is not worth protecting.', 'Why is data worth protecting?', 'It is not important', 'It is hard to replace and may be private', 'Ask what would be lost if your phone fell in water.', 'Schoolwork, photos and messages are hard to replace and may be private.'),
  m('DATA_THREATS', 'DT_VIRUS_ONLY', 'Says a virus only comes from the internet.', 'How can a virus reach a computer?', 'Only through the internet', 'Through the internet, flash disks and unknown files', 'Ask how a flash disk can carry a virus.', 'Viruses spread by flash disks and files as well as the internet.'),
  m('DATA_THREATS', 'DT_THEFT', 'Forgets that a lost or stolen device is a threat.', 'Which is a threat to data?', 'A clean screen', 'A stolen phone', 'Ask what happens to the photos on a stolen phone.', 'Theft or loss of a device is a threat to the data in it.'),
  m('DATA_PROTECT', 'DP_PASSWORD_SHARE', 'Shares a password with a friend.', 'What should you do with your password?', 'Share it with a friend', 'Keep it secret', 'Ask who could use your account.', 'A password is kept secret.'),
  m('DATA_PROTECT', 'DP_BACKUP', 'Keeps only one copy of important files.', 'Why make a backup?', 'It is not needed', 'To keep a copy if the device is lost or fails', 'Ask what happens to the only copy of an essay.', 'A backup is a second copy kept on another device.'),
  m('DATA_PROTECT', 'DP_UNKNOWN_LINK', 'Opens unknown links and attachments.', 'What should you do with a link from a stranger?', 'Open it quickly', 'Not open it and tell an adult', 'Ask what a strange link could do.', 'Unknown links can carry viruses or tricks, so do not open them.'),
  m('DRAW_INSTRUMENTS', 'DI_TOOL_MIX', 'Mixes up what the instruments do.', 'Which instrument draws circles?', 'A set square', 'A compass', 'Match each instrument to a job.', 'The compass draws circles and arcs. The set square draws upright and slanted lines.'),
  m('DRAW_INSTRUMENTS', 'DI_TSQUARE', 'Says the T-square measures angles.', 'What does the T-square draw?', 'Angles', 'Horizontal lines', 'Slide it along the board.', 'The T-square draws horizontal lines. The protractor measures angles.'),
  m('DRAW_INSTRUMENTS', 'DI_PROTRACTOR', 'Says the protractor measures length.', 'What does a protractor measure?', 'Length', 'Angles', 'Measure a corner with it.', 'A protractor measures angles. A ruler measures length.'),
  m('DRAW_LAYOUT', 'DL_TITLE_TOP', 'Puts the title block at the top.', 'Where is the title block of a drawing sheet?', 'At the top left', 'At the bottom right', 'Look at a real drawing sheet.', 'The title block is at the bottom right of the sheet.'),
  m('DRAW_LAYOUT', 'DL_NO_BORDER', 'Leaves out the border.', 'What is the border of a drawing sheet?', 'A frame drawn a little inside the edges', 'A line drawn across the middle', 'Draw a border on a sheet.', 'The border is a frame drawn inside the edges of the sheet.'),
  m('DRAW_LAYOUT', 'DL_A4', 'Gives the wrong size of A4.', 'What is the size of A4?', '420 by 297 millimetres', '297 by 210 millimetres', 'Measure a sheet of A4 paper.', 'A4 is 297 by 210 millimetres.'),
  m('DIM_TYPES', 'DM_LINE_MIX', 'Mixes the dimension line with the extension line.', 'Which line has arrowheads and shows the size?', 'The extension line', 'The dimension line', 'Look at a dimensioned drawing.', 'The dimension line has arrowheads. Extension lines stretch out from the object.'),
  m('DIM_TYPES', 'DM_UNITS', 'Says drawings are dimensioned in metres.', 'In which unit are sizes normally given on a drawing?', 'Metres', 'Millimetres', 'Look at a drawing of a small part.', 'Sizes on drawings are normally in millimetres.'),
  m('DIM_TYPES', 'DM_OBJECT_LINE', 'Uses the object line as a dimension line.', 'Which line is thick and shows the shape?', 'The dimension line', 'The object line', 'Compare thick and thin lines.', 'The object line is thick. The dimension line is thin.'),
  m('DIM_READ', 'DR_ADD', 'Adds the wrong dimensions to find the overall length.', 'A part is 30 mm and 45 mm long in two sections. What is the overall length?', '15 mm', '75 mm', 'Draw the sections end to end.', 'Add the sections: 30 plus 45 is 75 millimetres.'),
  m('DIM_READ', 'DR_DIAMETER', 'Says the diameter is half the radius.', 'The radius of a circle is 20 mm. What is the diameter?', '10 mm', '40 mm', 'Draw a circle and a line across it.', 'The diameter is twice the radius: 40 millimetres.'),
  m('DIM_READ', 'DR_UNIT', 'Leaves out the unit.', 'What must be written with a dimension?', 'Nothing, just the number', 'The number and the unit', 'Read a dimension and say the unit.', 'A dimension needs a unit, normally millimetres.'),
  m('PLAIN_SCALE', 'SC_INVERT', 'Says 1:50 means the drawing is bigger than the object.', 'What does a scale of 1:50 mean?', 'The drawing is 50 times bigger', 'One unit on the drawing stands for 50 on the object', 'Draw a room on a page.', 'A scale of 1:50 is a reduction: the object is 50 times bigger than the drawing.'),
  m('PLAIN_SCALE', 'SC_CALC', 'Divides where he should multiply.', 'A line is 4 cm on a 1:50 drawing. What is the real length?', '4 divided by 50', '4 times 50, which is 200 cm', 'Make a scale ruler.', 'Multiply the drawing length by 50: 4 times 50 is 200 centimetres.'),
  m('PLAIN_SCALE', 'SC_ENLARGE', 'Says 2:1 is a reduction.', 'What does a scale of 2:1 mean?', 'A reduction', 'An enlargement', 'Draw a small part twice as big.', 'A scale of 2:1 makes the drawing twice as big as the object.'),
  m('VISUAL_PROG', 'VP_TEXT', 'Says visual programming means typing lines of code.', 'How are programs built in visual programming?', 'By typing lines of code', 'By joining blocks', 'Try Scratch for ten minutes.', 'In visual programming, blocks snap together.'),
  m('VISUAL_PROG', 'VP_TOOL', 'Names a tool that is not a visual programming tool.', 'Which is a visual programming tool?', 'A calculator', 'Scratch', 'Look at tools used in schools.', 'Scratch and App Inventor are visual programming tools.'),
  m('VISUAL_PROG', 'VP_LOOP', 'Says a loop stops a program.', 'What does a loop do in a program?', 'Stops the program', 'Repeats instructions', 'Make a sprite repeat a step.', 'A loop repeats instructions.'),
  m('COMPOSITE', 'CM_SINGLE', 'Says concrete is a single material.', 'What is concrete made of?', 'One material only', 'Cement, sand, ballast and water', 'Look at what goes into the mixer.', 'Concrete is a mixture of cement, sand, ballast and water.'),
  m('COMPOSITE', 'CM_PLYWOOD', 'Says plywood is one solid piece of wood.', 'How is plywood made?', 'From one solid piece of wood', 'From thin layers of wood glued crosswise', 'Look at the edge of a plywood board.', 'Plywood is made of thin layers glued with the grain crosswise.'),
  m('COMPOSITE', 'CM_USE', 'Gives the wrong use for a composite.', 'What is reinforced concrete used for?', 'Making cups', 'Making buildings and slabs', 'Look at a building site.', 'Reinforced concrete is used in buildings, bridges and slabs.'),
  m('CERAMIC', 'CR_BRITTLE', 'Says ceramics do not break.', 'What happens when a clay pot is dropped?', 'It bends', 'It breaks', 'Tap a cup gently and a dish harder.', 'Ceramics are hard but brittle, so they break when dropped.'),
  m('CERAMIC', 'CR_CONDUCT', 'Says ceramics conduct electricity.', 'Why are ceramics used as electrical insulators?', 'They conduct electricity well', 'They do not conduct electricity', 'Look at an insulator on a pole.', 'Ceramics do not conduct electricity, so they are used as insulators.'),
  m('CERAMIC', 'CR_METAL', 'Calls a ceramic material a metal.', 'Which is a ceramic material?', 'Iron', 'A clay brick', 'Sort objects at home.', 'Bricks, tiles and clay pots are ceramics. Iron is a metal.'),
  m('CUT_TOOLS', 'CT_WOOD_METAL', 'Uses a wood saw on metal.', 'Which saw cuts metal?', 'A tenon saw', 'A hacksaw', 'Look at the teeth of each saw.', 'A hacksaw cuts metal. A tenon saw cuts wood.'),
  m('CUT_TOOLS', 'CT_PLANE', 'Says a chisel smooths a large surface.', 'Which tool smooths a wooden board?', 'A chisel', 'A plane', 'Try both on a scrap.', 'A plane smooths wood. A chisel shapes joints.'),
  m('CUT_TOOLS', 'CT_BLUNT', 'Thinks a blunt tool is safer.', 'Why should a cutting tool be kept sharp?', 'A blunt tool is safer', 'A sharp tool cuts easily and slips less', 'Compare cutting with sharp and blunt scissors.', 'A blunt tool needs more force and slips, so keep tools sharp.'),
  m('SOFTWARE', 'SW_TOUCH', 'Says software can be touched.', 'Which can you touch?', 'Software', 'Hardware', 'Point to the screen and the program.', 'Hardware can be touched. Software is the programs.'),
  m('SOFTWARE', 'SW_OS', 'Calls an application the operating system.', 'Which is an operating system?', 'A word processor', 'Windows', 'List programs on a computer.', 'Windows, Android and Linux are operating systems. A word processor is an application.'),
  m('SOFTWARE', 'SW_APP', 'Picks the wrong application for the task.', 'Which application is used for calculations in a table?', 'A word processor', 'A spreadsheet', 'Try the sum 12 plus 8 in a spreadsheet.', 'A spreadsheet is used for tables and calculations.'),
  m('BOOKKEEPING', 'BK_BIG_ONLY', 'Says only big businesses keep records.', 'Which businesses should keep records?', 'Only big businesses', 'Every business, big or small', 'Ask a shopkeeper how she knows her profit.', 'Every business keeps records to know its income, spending and profit.'),
  m('BOOKKEEPING', 'BK_ASSET', 'Mixes an asset with a liability.', 'A loan owed to a supplier is...', 'An asset', 'A liability', 'An asset is owned; a liability is owed.', 'What a business owes is a liability. What it owns is an asset.'),
  m('BOOKKEEPING', 'BK_CASH', 'Calls a credit sale a cash sale.', 'A customer takes goods and will pay next week. What is this?', 'A cash sale', 'A credit sale', 'Ask: was the money paid now?', 'A credit sale is paid later. A cash sale is paid now.'),
  m('BUDGET', 'BU_INCOME', 'Names something that is not an income.', 'Which is a source of income?', 'A bill', 'A salary', 'List what brings money in.', 'A salary, business profit and sales are income. A bill is spending.'),
  m('BUDGET', 'BU_NO_NEED', 'Says a budget is not needed.', 'Why make a budget?', 'It is not needed', 'To plan income and spending and save some', 'Ask what happens when money runs out early.', 'A budget plans spending so that needs come first and some is saved.'),
  m('BUDGET', 'BU_UNETHICAL', 'Thinks hiding spending in a budget is acceptable.', 'Which is unethical in budgeting?', 'Planning to save', 'Hiding spending from the family', 'Ask what honesty in money looks like.', 'Hiding spending or using money meant for something else is unethical.'),
  m('MARKETING', 'MK_SELLING_ONLY', 'Says marketing is only selling at the till.', 'What does marketing do?', 'Only takes the money at the till', 'Finds customers and tells them about goods', 'Ask how customers hear about a new shop.', 'Marketing helps a business find customers and sell.'),
  m('MARKETING', 'MK_INFO', 'Names a poor source of market information.', 'Which is a source of market information?', 'Guessing', 'Asking customers or a survey', 'Ask what a shopkeeper asks customers.', 'A survey, asking customers and watching competitors give market information.'),
  m('MARKETING', 'MK_FACTOR', 'Names a factor that does not matter in choosing a market.', 'Which is a factor in choosing a market?', 'The colour of the shop', 'Customer demand and location', 'Ask where people buy shoes.', 'Demand, price, location, competition and transport matter in choosing a market.'),
  m('MARKETING', 'MK_TOOL', 'Names something that is not a marketing tool.', 'Which is a marketing tool?', 'A broken door', 'A poster or a radio advert', 'List ways you heard about a product.', 'Posters, radio, social media, samples and offers are marketing tools.'),
  m('DISTRIBUTION', 'DS_MIDDLEMAN_BAD', 'Says intermediaries only raise the price and have no use.', 'What does a wholesaler do?', 'Nothing useful', 'Buys in bulk and sells to retailers', 'Follow a bag of maize from farm to shop.', 'Intermediaries bring goods from producers to buyers.'),
  m('DISTRIBUTION', 'DS_CHANNEL', 'Puts the channel in the wrong order.', 'Which is the longest channel?', 'Producer to consumer', 'Producer to wholesaler to retailer to consumer', 'Draw the chain with arrows.', 'The longest channel has a wholesaler and a retailer between producer and consumer.'),
  m('DISTRIBUTION', 'DS_ETHICS', 'Thinks hoarding or cheating on weights is fine.', 'Which is ethical in distribution?', 'Hiding goods to raise the price', 'Giving honest weights and fair prices', 'Ask what a customer wants from a trader.', 'Honest weights, fair prices and safe delivery are ethical. Hoarding and cheating are not.'),
];
