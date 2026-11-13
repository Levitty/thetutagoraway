// ============================================================================
// GRADE 8 INTEGRATED SCIENCE, PART B: FIRE, THE CELL AND THE MOVEMENT OF MATERIALS (5 skills): the fire triangle, classes of fire,
// parts of plant and animal cells, magnification, diffusion and osmosis. Written offline from the KICD 2024 design. Only the knowledge
// half is tested; microscope work and demonstrations are for the teacher. Fire safety statements are for a teacher to confirm: the
// questions never ask a child to light or fight a fire. Every wrong answer names the library misconception it reveals. All stay
// reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, c, sp } from './integratedscience_g8_lib.js';

const CF = 'MIXTUR.CLASSES_OF_FIRE.', CE = 'LIVING.THE_CELL.', MV = 'LIVING.MOVEMENT_OF_MATERIALS_IN.';
const OPT = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- FIRE_TRIANGLE
  fam('cf.ft.parts', `${CF}FIRE_TRIANGLE`, 'direct', 1, choose([
    c('What three things does a fire need?', 'Heat, fuel and oxygen', 'Remove any one and the fire goes out.', ['M_G8_FT_TWO_PARTS', 'Heat and fuel only', 'Water, fuel and air', 'Smoke, heat and wind']),
    c('Which is a natural cause of fire?', 'Lightning', 'Lightning can light dry grass.', ['M_G8_FT_CAUSE', 'A lit match', 'A candle', 'A cooking stove']),
    c('A candle goes out under a jar. Which part of the fire triangle was removed?', 'Oxygen', 'The air in the jar was used up.', ['M_G8_FT_TWO_PARTS', 'Heat', 'Fuel', 'Light']),
    c('Dry grass can catch fire in the hot sun. Which part does the sun give?', 'Heat', 'The sun gives heat.', ['M_G8_FT_CAUSE', 'Fuel', 'Oxygen', 'Water']),
    c('Which of these puts out a fire by removing fuel?', 'Clearing dry grass in a strip', 'A firebreak takes away the fuel.', ['M_G8_FT_TWO_PARTS', 'Fanning the flames', 'Adding more grass', 'Pouring petrol']),
  ], OPT('A fire needs heat, fuel and oxygen.', 'Take one away and the fire stops.'))),
  fam('cf.ft.stop', `${CF}FIRE_TRIANGLE`, 'why', 2, choose([
    c('Why does water put out a wood fire?', 'It takes away heat', 'Cooling removes heat from the fire.', ['M_G8_FT_TWO_PARTS', 'It adds oxygen', 'It adds fuel', 'It makes more smoke']),
    c('Why does a blanket put out a small fire in a pan?', 'It cuts off the oxygen', 'Without air the fire stops.', ['M_G8_FT_TWO_PARTS', 'It adds heat', 'It adds fuel', 'It makes the pan hot']),
    c('Why is a firebreak made in dry grass?', 'It removes the fuel', 'The fire has nothing to burn.', ['M_G8_FT_TWO_PARTS', 'It adds oxygen', 'It adds heat', 'It adds more grass']),
    c('Which is a natural cause of fire?', 'A volcanic eruption', 'Hot lava can light fires.', ['M_G8_FT_CAUSE', 'A match left burning', 'A cigarette', 'A burning rubbish heap']),
    c('Why does blowing on a spark make it burn more?', 'It adds more oxygen', 'Oxygen feeds the fire.', ['M_G8_FT_TWO_PARTS', 'It adds more fuel', 'It removes heat', 'It adds water']),
  ], OPT('Water removes heat, a blanket removes oxygen, a firebreak removes fuel.', 'Blowing adds oxygen.'))),
  fam('cf.ft.spot', `${CF}FIRE_TRIANGLE`, 'spot', 3, spot([
    sp('Baraka explains fire.', 'A fire needs heat.', 'A fire needs fuel.', 'A fire needs only heat and fuel.', 'A fire also needs oxygen.', 'M_G8_FT_TWO_PARTS'),
    sp('Wanjiru explains causes.', 'Lightning can start a fire.', 'Hot sun can start a fire in dry grass.', 'A lit match is a natural cause of fire.', 'A lit match is a human cause.', 'M_G8_FT_CAUSE'),
    sp('Kamau explains putting out fire.', 'Water removes heat.', 'A blanket removes oxygen.', 'A fire needs only fuel to stop.', 'Removing any one part stops a fire.', 'M_G8_FT_TWO_PARTS'),
    sp('Mwende explains safety.', 'Keep matches away from children.', 'Tell an adult about a fire.', 'Pour water on every fire.', 'Water is not used on oil or electrical fires.', 'M_G8_FT_WATER_ALL'),
    sp('Nekesa explains natural fires.', 'Volcanic eruptions can start fires.', 'Lightning can start fires.', 'A burning candle is a natural cause.', 'A candle is a human cause.', 'M_G8_FT_CAUSE'),
  ], OPT('Check each step: three parts, causes, ways to stop a fire.', 'Water is not used on oil or electrical fires.'))),

  // ---------------------------------------------------------------- FIRE_CLASSES
  fam('cf.fc.pick', `${CF}FIRE_CLASSES`, 'direct', 1, choose([
    c('What should you use on a cooking oil fire?', 'A lid or a damp cloth to cut off the air', 'Smothering cuts off the oxygen.', ['M_G8_FC_WATER_OIL', 'Water', 'More oil', 'A fan']),
    c('What should be done first in an electrical fire?', 'Switch off the power', 'Never use water on a live electrical fire.', ['M_G8_FC_WATER_ELEC', 'Pour water on it', 'Touch the wires', 'Open the windows wide']),
    c('A fire is spreading fast. What should a child do?', 'Raise the alarm and get out safely', 'Only small fires are fought, by adults.', ['M_G8_FC_ALARM', 'Fight it alone with water', 'Hide in a room', 'Go back for toys']),
    c('Which puts out a paper fire?', 'Water', 'Water cools a fire of paper, wood or cloth.', ['M_G8_FC_WATER_OIL', 'Petrol poured on from a can', 'Paraffin poured on from a bottle', 'Cooking oil']),
    c('Which should NOT be used on a petrol fire?', 'Water', 'Water spreads a petrol fire.', ['M_G8_FC_WATER_OIL', 'Sand', 'Foam', 'A blanket']),
  ], OPT('Water for wood and paper; smother oil; power off for electrical fires.', 'Raise the alarm and get out.'))),
  fam('cf.fc.act', `${CF}FIRE_CLASSES`, 'word', 2, choose([
    c('Achieng sees the kettle cord smoking. What should she do first?', 'Switch off the power and tell an adult', 'Switch off first and never touch with water.', ['M_G8_FC_WATER_ELEC', 'Pour water on the smoking cord', 'Pull the cord out with a bare hand', 'Leave it and hope it stops']),
    c('Otieno\'s mother has a cooking oil fire in a pan. What should she do?', 'Cover the pan with a lid', 'The lid cuts off oxygen.', ['M_G8_FC_WATER_OIL', 'Throw water in', 'Carry it outside', 'Add more oil']),
    c('A small paper fire starts in a bin at school. What can a teacher use?', 'Water or a fire extinguisher', 'Water cools a paper fire.', ['M_G8_FC_ALARM', 'Petrol poured on from a can', 'Paraffin poured on from a bottle', 'Nothing at all, let it burn']),
    c('The school bell rings for a fire drill. What should the pupils do?', 'Leave quietly and gather at the safe place', 'Practice keeps everyone safe.', ['M_G8_FC_ALARM', 'Stay to finish the work first', 'Run back for their bags', 'Hide under the desks in class']),
    c('Which extinguisher is suitable for an electrical fire?', 'Dry powder or carbon dioxide', 'These do not carry electricity.', ['M_G8_FC_WATER_ELEC', 'A water extinguisher from the corridor', 'A bucket of water from the tap', 'A wet sack thrown on the socket']),
  ], OPT('Switch off the power for electrical fires; smother oil fires.', 'Raise the alarm and leave safely.'))),
  fam('cf.fc.spot', `${CF}FIRE_CLASSES`, 'spot', 3, spot([
    sp('Baraka explains an oil fire.', 'A pan of oil is on fire.', 'He covers it with a lid.', 'He pours water on it.', 'Water makes an oil fire spread.', 'M_G8_FC_WATER_OIL'),
    sp('Wanjiru explains an electrical fire.', 'A socket is smoking.', 'She switches off the power.', 'She pours water on the socket.', 'Water and electricity are dangerous together.', 'M_G8_FC_WATER_ELEC'),
    sp('Kamau explains a big fire.', 'The fire is spreading.', 'He raises the alarm.', 'He fights it alone first.', 'He leaves safely and tells an adult.', 'M_G8_FC_ALARM'),
    sp('Mwende explains a paper fire.', 'A small paper fire starts.', 'Water can put it out.', 'Water cannot be used on any fire.', 'Water suits paper, wood and cloth fires.', 'M_G8_FC_WATER_OIL'),
    sp('Nekesa explains first steps.', 'First raise the alarm.', 'Then leave the room.', 'First pour water on the fire.', 'The first step is to raise the alarm and keep safe.', 'M_G8_FC_ALARM'),
  ], OPT('Check each step: oil is smothered, electrical fires need the power off, a big fire means leave.', 'Never use water on oil or live electrical fires.'))),

  // ---------------------------------------------------------------- CELL_PARTS
  fam('ce.cp.part', `${CE}CELL_PARTS`, 'direct', 1, choose([
    c('Which cell has a cell wall?', 'A plant cell', 'Only plant cells have a cell wall.', ['M_G8_CP_WALL_ANIMAL', 'An animal cell', 'Both equally', 'Neither']),
    c('What does the nucleus do?', 'Controls the cell', 'The nucleus is the control centre.', ['M_G8_CP_NUCLEUS', 'Makes food', 'Stores sap', 'Gives the cell its colour']),
    c('Which cell has chloroplasts?', 'A plant leaf cell', 'Chloroplasts make food with light.', ['M_G8_CP_CHLORO', 'An animal cell', 'A blood cell', 'A nerve cell']),
    c('What does the cell membrane do?', 'Controls what enters and leaves the cell', 'The membrane is like a gate.', ['M_G8_CP_MEMBRANE', 'Gives the cell its shape only', 'Makes food', 'Stores waste']),
    c('What is the cytoplasm?', 'The jelly where the cell\'s reactions happen', 'Many reactions happen in the cytoplasm.', ['M_G8_CP_NUCLEUS', 'The control centre', 'The hard outer wall', 'The food-making part']),
  ], OPT('The nucleus controls; chloroplasts make food; the wall supports plant cells.', 'The membrane controls what goes in and out.'))),
  fam('ce.cp.compare', `${CE}CELL_PARTS`, 'why', 2, choose([
    c('Which part is found only in plant cells?', 'Chloroplasts', 'Plant cells make food with chloroplasts.', ['M_G8_CP_CHLORO', 'Nucleus', 'Cytoplasm', 'Cell membrane']),
    c('Which parts do both plant and animal cells have?', 'Membrane, cytoplasm and nucleus', 'These parts are in both.', ['M_G8_CP_WALL_ANIMAL', 'Cell wall and chloroplasts', 'Chloroplasts and a large vacuole', 'Cell wall only']),
    c('Why does a plant cell keep a fixed shape?', 'It has a cell wall', 'The wall supports and protects the cell.', ['M_G8_CP_WALL_ANIMAL', 'It has no membrane', 'It has no nucleus', 'It has chloroplasts only']),
    c('Which part stores sap in a plant cell?', 'The large vacuole', 'The vacuole stores sap.', ['M_G8_CP_NUCLEUS', 'The nucleus', 'The chloroplast', 'The membrane']),
    c('A cell has a nucleus, a membrane and cytoplasm, but no wall. What is it?', 'An animal cell', 'Animal cells have no cell wall.', ['M_G8_CP_WALL_ANIMAL', 'A plant cell', 'A bacterium only', 'A fungus only']),
  ], OPT('Plant cells also have a wall, chloroplasts and a large vacuole.', 'Animal cells have none of these.'))),
  fam('ce.cp.spot', `${CE}CELL_PARTS`, 'spot', 3, spot([
    sp('Baraka explains cells.', 'A plant cell has a cell wall.', 'An animal cell has a nucleus.', 'An animal cell has a cell wall.', 'Only plant cells have a cell wall.', 'M_G8_CP_WALL_ANIMAL'),
    sp('Wanjiru explains the nucleus.', 'The nucleus is in the cell.', 'It controls the cell.', 'It makes food for the cell.', 'Chloroplasts make food.', 'M_G8_CP_NUCLEUS'),
    sp('Kamau explains chloroplasts.', 'Chloroplasts hold a green colour.', 'They make food with light.', 'Animal cells have chloroplasts.', 'Only plant cells have chloroplasts.', 'M_G8_CP_CHLORO'),
    sp('Mwende explains the membrane.', 'The membrane is at the edge of the cell.', 'It controls what enters.', 'It only gives the cell shape.', 'It controls what enters and leaves.', 'M_G8_CP_MEMBRANE'),
    sp('Nekesa compares cells.', 'Both cells have a nucleus.', 'Both have cytoplasm.', 'Both have chloroplasts.', 'Only plant cells have chloroplasts.', 'M_G8_CP_CHLORO'),
  ], OPT('Check each step: wall, chloroplasts and vacuole are plant parts.', 'The nucleus controls the cell.'))),

  // ---------------------------------------------------------------- MAGNIFICATION
  fam('ce.mg.calc', `${CE}MAGNIFICATION`, 'direct', 1, choose([
    c('The eyepiece is 10 times and the objective is 40 times. What is the total magnification?', '400 times', 'Multiply: 10 times 40 is 400.', ['M_G8_MG_ADD', '50 times', '40 times', '4 times']),
    c('The eyepiece is 10 times and the objective is 10 times. What is the total magnification?', '100 times', 'Multiply: 10 times 10 is 100.', ['M_G8_MG_ONE', '10 times', '20 times', '1000 times']),
    c('The eyepiece is 10 times and the objective is 4 times. What is the total magnification?', '40 times', 'Multiply: 10 times 4 is 40.', ['M_G8_MG_ADD', '14 times', '4 times', '400 times']),
    c('The eyepiece is 5 times and the objective is 20 times. What is the total magnification?', '100 times', 'Multiply: 5 times 20 is 100.', ['M_G8_MG_ADD', '25 times', '20 times', '4 times']),
    c('The eyepiece is 15 times and the objective is 10 times. What is the total magnification?', '150 times', 'Multiply: 15 times 10 is 150.', ['M_G8_MG_ADD', '25 times', '10 times', '1500 times']),
  ], OPT('Multiply the eyepiece by the objective.', 'Do not add them.'))),
  fam('ce.mg.rule', `${CE}MAGNIFICATION`, 'why', 2, choose([
    c('How is total magnification worked out?', 'Eyepiece magnification times objective magnification', 'Each lens magnifies the image of the other.', ['M_G8_MG_ADD', 'Eyepiece plus objective', 'The objective only', 'The eyepiece only']),
    c('Why is it wrong to use only the objective magnification?', 'The eyepiece also magnifies', 'Both lenses magnify.', ['M_G8_MG_ONE', 'The eyepiece makes it smaller', 'The objective does nothing', 'The eyepiece is a mirror']),
    c('Which lens is nearest the eye?', 'The eyepiece', 'The eye looks through the eyepiece.', ['M_G8_MG_ONE', 'The objective', 'The mirror', 'The stage']),
    c('What is 10 times 40?', '400', 'Add a zero to 40.', ['M_G8_MG_FOUR', '50', '40', '4000']),
    c('What is 5 times 20?', '100', 'Five twenties are one hundred.', ['M_G8_MG_FOUR', '25', '15', '1000']),
  ], OPT('Total magnification is the product of the two lenses.', 'Both lenses magnify.'))),
  fam('ce.mg.spot', `${CE}MAGNIFICATION`, 'spot', 3, spot([
    sp('Baraka finds a magnification.', 'The eyepiece is 10 times.', 'The objective is 40 times.', 'The total is 10 plus 40, which is 50 times.', 'The total is 10 times 40, which is 400 times.', 'M_G8_MG_ADD'),
    sp('Wanjiru finds a magnification.', 'The eyepiece is 10 times.', 'The objective is 10 times.', 'The total is 10 times, as for one lens.', 'The total is 100 times.', 'M_G8_MG_ONE'),
    sp('Kamau finds a magnification.', 'The eyepiece is 5 times.', 'The objective is 20 times.', '5 times 20 is 25.', '5 times 20 is 100.', 'M_G8_MG_FOUR'),
    sp('Mwende explains the lenses.', 'The eyepiece is near the eye.', 'The objective is near the slide.', 'Only the objective magnifies.', 'Both lenses magnify.', 'M_G8_MG_ONE'),
    sp('Nekesa finds a magnification.', 'The eyepiece is 10 times.', 'The objective is 4 times.', 'The total is 10 plus 4.', 'The total is 10 times 4, which is 40.', 'M_G8_MG_ADD'),
  ], OPT('Multiply the two magnifications.', 'Both lenses magnify.'))),

  // ---------------------------------------------------------------- DIFFUSION_OSMOSIS
  fam('mv.do.pick', `${MV}DIFFUSION_OSMOSIS`, 'direct', 1, choose([
    c('In diffusion, particles move from...', 'Many to few', 'Particles spread out from where they are many.', ['M_G8_DO_UP_GRADIENT', 'Few to many', 'Nowhere', 'Up and down only']),
    c('What moves in osmosis?', 'Water', 'Osmosis is the movement of water through a membrane.', ['M_G8_DO_OSMOSIS_SOLUTE', 'Dissolved salt', 'Sugar only', 'Oxygen only']),
    c('Does diffusion need energy from the cell?', 'No, particles move by themselves', 'Diffusion happens without the cell using energy.', ['M_G8_DO_ENERGY', 'Yes, always, in every living cell', 'Yes, from the nucleus of the cell', 'Yes, from the heat of the sun']),
    c('Which is an example of diffusion?', 'The smell of cooking spreading in the house', 'Smell particles spread from many to few.', ['M_G8_DO_UP_GRADIENT', 'A stone falling from a table', 'Water boiling in a pan', 'A leaf burning in a fire']),
    c('Which is an example of osmosis?', 'Root hairs taking up water from the soil', 'Water enters root hairs through a membrane.', ['M_G8_DO_OSMOSIS_SOLUTE', 'Salt dissolving in a cup of water', 'A leaf falling from a tree', 'A seed drying in the sun']),
  ], OPT('Diffusion is many to few; osmosis is water through a membrane.', 'Neither needs energy from the cell.'))),
  fam('mv.do.role', `${MV}DIFFUSION_OSMOSIS`, 'why', 2, choose([
    c('Why does a salted slug shrink?', 'Water moves out of its body by osmosis', 'Water moves toward the stronger salt solution.', ['M_G8_DO_OSMOSIS_SOLUTE', 'Salt moves into the body of the slug only', 'The slug dries in the hot sun only', 'The slug is cold and shivering']),
    c('How does oxygen enter the blood in the lungs?', 'By diffusion', 'Oxygen moves from where it is many to where it is few.', ['M_G8_DO_UP_GRADIENT', 'By being pushed against the flow', 'By osmosis', 'By burning']),
    c('Why do wilted leaves recover when watered?', 'Water enters the cells by osmosis', 'Water moves into the cells.', ['M_G8_DO_OSMOSIS_SOLUTE', 'Salt enters the cells of the leaf', 'The cells divide into new ones', 'The leaves burn in the sun']),
    c('Which way does water move in osmosis?', 'From a weak solution to a strong one', 'Water moves toward the stronger solution.', ['M_G8_DO_UP_GRADIENT', 'From a strong solution to a weak one', 'Nowhere', 'Up only']),
    c('Why does a drop of ink spread in water?', 'Diffusion spreads the particles evenly', 'The particles move from many to few.', ['M_G8_DO_ENERGY', 'The cell pushes them about like a pump', 'The water is heated from below', 'The ink is alive and swims about']),
  ], OPT('Water moves toward the stronger solution.', 'Diffusion spreads particles evenly.'))),
  fam('mv.do.spot', `${MV}DIFFUSION_OSMOSIS`, 'spot', 3, spot([
    sp('Baraka explains diffusion.', 'Particles spread out.', 'They move from many to few.', 'They move from few to many.', 'Diffusion is from many to few.', 'M_G8_DO_UP_GRADIENT'),
    sp('Wanjiru explains osmosis.', 'Osmosis uses a membrane.', 'Water moves through it.', 'Salt is what moves in osmosis.', 'Water is what moves in osmosis.', 'M_G8_DO_OSMOSIS_SOLUTE'),
    sp('Kamau explains energy.', 'Diffusion spreads particles.', 'It happens by itself.', 'It needs energy from the cell.', 'Diffusion needs no energy from the cell.', 'M_G8_DO_ENERGY'),
    sp('Mwende explains roots.', 'Root hairs take in water.', 'This is osmosis.', 'Root hairs take in water by diffusion of salt only.', 'Water enters by osmosis.', 'M_G8_DO_OSMOSIS_SOLUTE'),
    sp('Nekesa explains smell.', 'A smell spreads across a room.', 'This is diffusion.', 'It spreads from where there is little to where there is much.', 'It spreads from many to few.', 'M_G8_DO_UP_GRADIENT'),
  ], OPT('Check each step: diffusion is many to few; osmosis is water through a membrane.', 'No energy is needed.'))),
];
