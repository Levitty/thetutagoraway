// ============================================================================
// GRADE 8 INTEGRATED SCIENCE, PART A: MIXTURES, ELEMENTS AND COMPOUNDS (7 skills): atoms and compounds, symbols, word equations,
// uses of elements, particles in the states of matter, impurities, physical and chemical changes.
// Written offline from the KICD 2024 design through the curriculum map (curriculum/integrated_science/g8.json). Only the knowledge half is
// tested; the practical work is for the teacher (docs/qa/integratedscience-g8-non-question-outcomes-2026-11-13.md). Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, c, sp } from './integratedscience_g8_lib.js';

const EC = 'MIXTUR.ELEMENTS_AND_COMPOUNDS.', PC = 'MIXTUR.PHYSICAL_AND_CHEMICAL_CH.';
const OPT = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- ATOM_ELEMENT
  fam('ec.ae.what', `${EC}ATOM_ELEMENT`, 'direct', 1, choose([
    c('What is a molecule?', 'Two or more atoms joined together', 'A molecule is atoms joined, such as water or oxygen gas.', ['M_G8_AE_ATOM_MOLECULE', 'The smallest particle of an element', 'A single atom of oxygen', 'A very large grain']),
    c('What is a compound?', 'A substance made of different elements joined chemically', 'A compound has different elements joined, such as water or salt.', ['M_G8_AE_ELEMENT_COMPOUND', 'A substance made of one kind of atom', 'A pure metal only', 'A single atom alone']),
    c('Which of these is an element?', 'Oxygen', 'Oxygen has one kind of atom.', ['M_G8_AE_ELEMENT_COMPOUND', 'Water', 'Salt', 'Sugar']),
    c('Which of these is a compound?', 'Water', 'Water is made of hydrogen and oxygen joined.', ['M_G8_AE_ELEMENT_COMPOUND', 'Iron', 'Oxygen', 'Copper']),
    c('What is the smallest particle of an element called?', 'An atom', 'An atom is the smallest particle of an element.', ['M_G8_AE_ATOM_MOLECULE', 'A molecule', 'A compound', 'A mixture']),
  ], OPT('Atoms join to make molecules.', 'A compound has different elements joined together.'))),
  fam('ec.ae.mix', `${EC}ATOM_ELEMENT`, 'why', 2, choose([
    c('How is a compound different from a mixture?', 'The elements in a compound are joined chemically', 'In a mixture the parts are only mixed and can be separated easily.', ['M_G8_AE_MIXTURE', 'There is no difference', 'A mixture is always a gas', 'A compound has only one atom']),
    c('Iron filings are mixed with sand. Is this a compound?', 'No, it is a mixture', 'The iron and the sand are only mixed and can be separated with a magnet.', ['M_G8_AE_MIXTURE', 'Yes, it is a compound', 'Yes, it is an element']),
    c('Water is made of hydrogen and oxygen joined. What is water?', 'A compound', 'Different elements are joined chemically.', ['M_G8_AE_ELEMENT_COMPOUND', 'An element', 'An atom', 'A mixture']),
    c('Oxygen gas has two oxygen atoms joined. What is it?', 'An element made of molecules', 'It has one kind of atom, joined in pairs.', ['M_G8_AE_ATOM_MOLECULE', 'A single atom', 'A compound', 'A mixture']),
    c('Which pair are both elements?', 'Iron and copper', 'Each is made of one kind of atom.', ['M_G8_AE_ELEMENT_COMPOUND', 'Water and salt', 'Salt and sugar', 'Water and iron']),
  ], OPT('A compound is chemically joined; a mixture is not.', 'An element has one kind of atom.'))),
  fam('ec.ae.spot', `${EC}ATOM_ELEMENT`, 'spot', 3, spot([
    sp('Baraka explains elements.', 'An element has one kind of atom.', 'Iron is an element.', 'Water is an element.', 'Water is a compound of hydrogen and oxygen.', 'M_G8_AE_ELEMENT_COMPOUND'),
    sp('Wanjiru explains molecules.', 'A molecule has two or more atoms joined.', 'Oxygen gas is made of molecules.', 'An atom and a molecule are the same.', 'An atom is one particle, a molecule is atoms joined.', 'M_G8_AE_ATOM_MOLECULE'),
    sp('Kamau explains compounds.', 'A compound has different elements.', 'Salt is a compound.', 'A compound is the same as a mixture.', 'The elements in a compound are joined chemically.', 'M_G8_AE_MIXTURE'),
    sp('Mwende explains mixtures.', 'Sand and iron filings make a mixture.', 'A magnet separates them.', 'A mixture is a new substance.', 'A mixture is only mixed and makes no new substance.', 'M_G8_AE_MIXTURE'),
    sp('Nekesa explains atoms.', 'Atoms are very small.', 'An element is made of one kind of atom.', 'A compound is made of one kind of atom.', 'A compound has different kinds of atoms joined.', 'M_G8_AE_ELEMENT_COMPOUND'),
  ], OPT('Check each step against atom, element, molecule and compound.', 'Compounds have different elements joined.'))),

  // ---------------------------------------------------------------- SYMBOLS
  fam('ec.sy.pick', `${EC}SYMBOLS`, 'direct', 1, choose([
    c('What is the symbol for iron?', 'Fe', 'Iron is Fe, from its old name ferrum.', ['M_G8_SY_FIRST_LETTER', 'I', 'Ir', 'In']),
    c('What is the symbol for sodium?', 'Na', 'Sodium is Na, from natrium.', ['M_G8_SY_FIRST_LETTER', 'S', 'So', 'Sd']),
    c('What is the symbol for potassium?', 'K', 'Potassium is K, from kalium.', ['M_G8_SY_FIRST_LETTER', 'P', 'Po', 'Pt']),
    c('What is the symbol for calcium?', 'Ca', 'Calcium is Ca: a capital C and a small a.', ['M_G8_SY_FIRST_LETTER', 'C'], ['M_G8_SY_NAME', 'Cl', 'Co']),
    c('What is the symbol for copper?', 'Cu', 'Copper is Cu, from cuprum.', ['M_G8_SY_FIRST_LETTER', 'C', 'Co', 'Cp']),
  ], OPT('Some symbols come from old Latin names.', 'The first letter is a capital and the second is small.'))),
  fam('ec.sy.name', `${EC}SYMBOLS`, 'word', 2, choose([
    c('Which element has the symbol K?', 'Potassium', 'K stands for potassium.', ['M_G8_SY_NAME', 'Calcium', 'Krypton', 'Carbon']),
    c('Which element has the symbol Na?', 'Sodium', 'Na stands for sodium.', ['M_G8_SY_NAME', 'Nitrogen', 'Neon', 'Nickel']),
    c('Which element has the symbol Fe?', 'Iron', 'Fe stands for iron.', ['M_G8_SY_NAME', 'Fluorine', 'Francium', 'Fermium']),
    c('Which element has the symbol Cl?', 'Chlorine', 'Cl stands for chlorine.', ['M_G8_SY_NAME', 'Carbon', 'Calcium', 'Copper']),
    c('Which element has the symbol Mg?', 'Magnesium', 'Mg stands for magnesium.', ['M_G8_SY_NAME', 'Manganese', 'Mercury', 'Molybdenum']),
  ], OPT('Learn the symbol cards one at a time.', 'Na is sodium and K is potassium.'))),
  fam('ec.sy.spot', `${EC}SYMBOLS`, 'spot', 3, spot([
    sp('Baraka lists symbols.', 'Oxygen is O.', 'Carbon is C.', 'Iron is I.', 'Iron is Fe.', 'M_G8_SY_FIRST_LETTER'),
    sp('Wanjiru lists symbols.', 'Hydrogen is H.', 'Sodium is Na.', 'Calcium is Cl.', 'Calcium is Ca.', 'M_G8_SY_NAME'),
    sp('Kamau lists symbols.', 'Copper is Cu.', 'Zinc is Zn.', 'Potassium is Ca.', 'Potassium is K.', 'M_G8_SY_NAME'),
    sp('Mwende lists symbols.', 'Magnesium is Mg.', 'Aluminium is Al.', 'Sodium is S.', 'Sodium is Na.', 'M_G8_SY_FIRST_LETTER'),
    sp('Nekesa lists symbols.', 'Chlorine is Cl.', 'Sulphur is S.', 'Sulphur is Su.', 'Sulphur is S.', 'M_G8_SY_FIRST_LETTER'),
  ], OPT('Check each symbol against the table.', 'A capital first letter and a small second letter.'))),

  // ---------------------------------------------------------------- WORD_EQUATIONS
  fam('ec.we.pick', `${EC}WORD_EQUATIONS`, 'direct', 1, choose([
    c('Which word equation is correct?', 'magnesium + oxygen gives magnesium oxide', 'The reactants come first and the product last.', ['M_G8_WE_ORDER', 'magnesium oxide gives magnesium + oxygen', 'oxygen oxide gives magnesium + magnesium']),
    c('What is made when iron reacts with sulphur?', 'Iron sulphide', 'A compound of two elements ends in -ide.', ['M_G8_WE_NAME', 'Iron sulphate', 'Iron sulphur', 'Sulphur iron']),
    c('What is made when carbon burns in oxygen?', 'Carbon dioxide', 'Carbon and oxygen make carbon dioxide.', ['M_G8_WE_NAME', 'Carbon oxygen', 'Oxygen carbide', 'Carbon sulphate']),
    c('What is made when sodium reacts with chlorine?', 'Sodium chloride', 'Sodium and chlorine make sodium chloride, common salt.', ['M_G8_WE_NAME', 'Sodium chlorate', 'Chlorine sodide', 'Sodium sulphide']),
    c('Which word equation is correct?', 'hydrogen + oxygen gives water', 'Hydrogen and oxygen join to make water.', ['M_G8_WE_ORDER', 'water gives hydrogen + hydrogen', 'oxygen + water gives hydrogen']),
  ], OPT('Reactants first, then an arrow, then the product.', 'A compound of two elements ends in -ide.'))),
  fam('ec.we.use', `${EC}WORD_EQUATIONS`, 'why', 2, choose([
    c('What does the arrow mean in a word equation?', 'Gives, or makes', 'The arrow shows the reactants turn into the product.', ['M_G8_WE_ORDER', 'Is equal to the weight of', 'Take away', 'Go back to']),
    c('Steel wool rusts and its mass goes up. What does this show?', 'Oxygen joined the iron to make a new substance', 'Atoms are not lost: they join in new ways.', ['M_G8_WE_LOST', 'The iron disappeared', 'The wool lost atoms', 'Nothing happened']),
    c('Which is the product in magnesium + oxygen gives magnesium oxide?', 'Magnesium oxide', 'The product is on the right of the arrow.', ['M_G8_WE_ORDER', 'Magnesium', 'Oxygen', 'Magnesium and oxygen']),
    c('Which are the reactants in iron + sulphur gives iron sulphide?', 'Iron and sulphur', 'The reactants are on the left of the arrow.', ['M_G8_WE_ORDER', 'Iron sulphide', 'Sulphur only', 'Iron sulphide and iron']),
    c('A word equation shows the reaction of two elements. What ending does the product have?', '-ide', 'Compounds of two elements end in -ide.', ['M_G8_WE_NAME', '-ate', '-ing', '-ed']),
  ], OPT('Reactants are on the left, the product on the right.', 'Atoms are not lost in a reaction.'))),
  fam('ec.we.spot', `${EC}WORD_EQUATIONS`, 'spot', 3, spot([
    sp('Baraka writes an equation.', 'iron + sulphur gives iron sulphide', 'Iron and sulphur are the reactants.', 'The product is iron sulphate.', 'The product is iron sulphide.', 'M_G8_WE_NAME'),
    sp('Wanjiru writes an equation.', 'carbon + oxygen gives carbon dioxide', 'Carbon and oxygen are reactants.', 'The product comes first.', 'The reactants come first.', 'M_G8_WE_ORDER'),
    sp('Kamau writes an equation.', 'sodium + chlorine gives sodium chloride', 'Sodium and chlorine are reactants.', 'The product is sodium chlorate.', 'The product is sodium chloride.', 'M_G8_WE_NAME'),
    sp('Mwende explains an equation.', 'Reactants join to make a product.', 'The arrow shows the change.', 'Some atoms disappear in the reaction.', 'No atoms are lost in a reaction.', 'M_G8_WE_LOST'),
    sp('Nekesa writes an equation.', 'hydrogen + oxygen gives water', 'Hydrogen and oxygen are reactants.', 'Water is written on the left.', 'Water is the product on the right.', 'M_G8_WE_ORDER'),
  ], OPT('Check each step: reactants, arrow, product, ending.', 'No atoms are lost.'))),

  // ---------------------------------------------------------------- ELEMENT_USES
  fam('ec.eu.use', `${EC}ELEMENT_USES`, 'direct', 1, choose([
    c('Which element is used for electric wires?', 'Copper', 'Copper carries electricity well.', ['M_G8_EU_WRONG_USE', 'Carbon', 'Sulphur', 'Chlorine']),
    c('Which element is used to make water safe to drink?', 'Chlorine', 'Chlorine kills germs in water.', ['M_G8_EU_WRONG_USE', 'Copper', 'Iron', 'Carbon']),
    c('Which element is used to make charcoal and pencils?', 'Carbon', 'Charcoal and pencil lead are made of carbon.', ['M_G8_EU_WRONG_USE', 'Aluminium', 'Copper', 'Sodium']),
    c('Which element is used for cooking pots and foil?', 'Aluminium', 'Aluminium is light and conducts heat.', ['M_G8_EU_WRONG_USE', 'Nitrogen', 'Oxygen', 'Sulphur']),
    c('Which element is used in fertilisers?', 'Nitrogen', 'Plants need nitrogen to grow.', ['M_G8_EU_WRONG_USE', 'Copper', 'Chlorine', 'Aluminium']),
  ], OPT('Match each element to an object at home.', 'Copper for wires, iron for tools, chlorine for water.'))),
  fam('ec.eu.label', `${EC}ELEMENT_USES`, 'why', 2, choose([
    c('What does a packaging label tell you?', 'The contents, amounts and the date to use it by', 'A label gives contents, amounts, dates and warnings.', ['M_G8_EU_LABEL', 'Nothing useful', 'Only the price', 'Only the colour']),
    c('Why should you read the label on a medicine bottle?', 'To know the dose and the date to use it by', 'A label has safety information.', ['M_G8_EU_LABEL', 'To read the brand name only', 'To count the words', 'Because it has a picture']),
    c('Which is an element?', 'Iron', 'Iron has one kind of atom.', ['M_G8_EU_COMPOUND_ELEMENT', 'Water', 'Salt', 'Sugar']),
    c('Which element do living things need for breathing?', 'Oxygen', 'Oxygen is needed for breathing.', ['M_G8_EU_WRONG_USE', 'Copper', 'Carbon', 'Aluminium']),
    c('Which of these is NOT an element?', 'Water', 'Water is a compound of hydrogen and oxygen.', ['M_G8_EU_COMPOUND_ELEMENT', 'Oxygen', 'Iron', 'Carbon']),
  ], OPT('Labels give safety and use information.', 'Water is a compound, not an element.'))),
  fam('ec.eu.spot', `${EC}ELEMENT_USES`, 'spot', 3, spot([
    sp('Baraka explains uses.', 'Copper is used for wires.', 'Iron is used for tools.', 'Chlorine is used for wires.', 'Chlorine makes water safe.', 'M_G8_EU_WRONG_USE'),
    sp('Wanjiru explains labels.', 'A label gives the contents.', 'It gives the date to use it by.', 'A label is only decoration.', 'A label gives useful information.', 'M_G8_EU_LABEL'),
    sp('Kamau explains elements.', 'Oxygen is an element.', 'Carbon is an element.', 'Water is an element.', 'Water is a compound.', 'M_G8_EU_COMPOUND_ELEMENT'),
    sp('Mwende explains carbon.', 'Carbon is in charcoal.', 'Carbon is in pencils.', 'Carbon is used for electric wires.', 'Copper is used for electric wires.', 'M_G8_EU_WRONG_USE'),
    sp('Nekesa explains nitrogen.', 'Nitrogen is in fertilisers.', 'Plants need nitrogen.', 'Nitrogen is used to make wires.', 'Copper is used to make wires.', 'M_G8_EU_WRONG_USE'),
  ], OPT('Check each use against the element.', 'A label gives useful information.'))),

  // ---------------------------------------------------------------- STATES_PARTICLES
  fam('pc.sp.pick', `${PC}STATES_PARTICLES`, 'direct', 1, choose([
    c('How do the particles of a solid move?', 'They vibrate in fixed places', 'Solid particles vibrate in fixed places.', ['M_G8_ST_SOLID_STILL', 'They do not move at all', 'They fly about freely', 'They slide past each other']),
    c('Which describes the particles of a gas?', 'Far apart', 'Gas particles are far apart.', ['M_G8_ST_GAS_CLOSE', 'Close together', 'Touching in rows', 'Joined in fixed places']),
    c('How do the particles of a liquid move?', 'They slide past one another', 'Liquid particles are close but slide past each other.', ['M_G8_ST_LIQUID_FIXED', 'They stay in fixed places', 'They are far apart', 'They do not move']),
    c('Which state has particles close together in fixed places?', 'Solid', 'A solid has a fixed shape.', ['M_G8_ST_LIQUID_FIXED', 'Liquid', 'Gas', 'Steam']),
    c('Which state has particles that move freely in all directions?', 'Gas', 'Gas particles are far apart and move freely.', ['M_G8_ST_GAS_CLOSE', 'Solid', 'Liquid', 'Ice']),
  ], OPT('Solid: fixed places. Liquid: slide. Gas: far apart.', 'Solid particles vibrate.'))),
  fam('pc.sp.why', `${PC}STATES_PARTICLES`, 'why', 2, choose([
    c('Why can a gas be squeezed into a small space?', 'Its particles are far apart', 'There is room between the particles.', ['M_G8_ST_GAS_CLOSE', 'Its particles are close together', 'Its particles are fixed', 'Its particles do not move']),
    c('Why does a liquid take the shape of its container?', 'Its particles slide past each other', 'Liquid particles move past each other.', ['M_G8_ST_LIQUID_FIXED', 'Its particles are fixed in place', 'Its particles are far apart', 'Its particles never move']),
    c('Why does a solid keep its shape?', 'Its particles are held in fixed places', 'Solid particles only vibrate.', ['M_G8_ST_SOLID_STILL', 'Its particles move freely', 'Its particles are far apart', 'Its particles slide']),
    c('What happens to particles when ice melts?', 'They begin to slide past each other', 'In a liquid the particles slide.', ['M_G8_ST_LIQUID_FIXED', 'They stop moving', 'They become fixed', 'They fly apart']),
    c('Particles of steam are...', 'Far apart and moving freely', 'Steam is a gas.', ['M_G8_ST_GAS_CLOSE', 'Close and in fixed places', 'Close and sliding', 'Not moving']),
  ], OPT('Think about how close and how free the particles are.', 'Gas particles are far apart.'))),
  fam('pc.sp.spot', `${PC}STATES_PARTICLES`, 'spot', 3, spot([
    sp('Baraka explains solids.', 'Solid particles are close.', 'They vibrate in place.', 'They do not move at all.', 'Solid particles vibrate in fixed places.', 'M_G8_ST_SOLID_STILL'),
    sp('Wanjiru explains gases.', 'Gas particles move freely.', 'Gases can be squeezed.', 'Gas particles are close together.', 'Gas particles are far apart.', 'M_G8_ST_GAS_CLOSE'),
    sp('Kamau explains liquids.', 'Liquid particles are close.', 'A liquid takes the shape of its container.', 'Liquid particles are fixed in place.', 'Liquid particles slide past each other.', 'M_G8_ST_LIQUID_FIXED'),
    sp('Mwende explains states.', 'A solid has a fixed shape.', 'A liquid flows.', 'A gas has particles that are close and fixed.', 'A gas has particles that are far apart and free.', 'M_G8_ST_GAS_CLOSE'),
    sp('Nekesa explains melting.', 'Ice is a solid.', 'Melting makes a liquid.', 'In the liquid the particles are fixed.', 'In the liquid the particles slide past each other.', 'M_G8_ST_LIQUID_FIXED'),
  ], OPT('Check each step against the particle picture.', 'Solid: vibrate. Liquid: slide. Gas: free.'))),

  // ---------------------------------------------------------------- IMPURITIES
  fam('pc.im.pick', `${PC}IMPURITIES`, 'direct', 1, choose([
    c('What does salt do to the boiling point of water?', 'It raises it', 'Impurities raise the boiling point.', ['M_G8_IM_LOWER_BOIL', 'It lowers it', 'It leaves it the same', 'It makes it zero']),
    c('At what temperature does pure water boil?', '100 degrees Celsius', 'Pure water boils at 100 degrees Celsius at sea level.', ['M_G8_IM_NO_EFFECT', '50 degrees Celsius', '0 degrees Celsius', '200 degrees Celsius']),
    c('What does an impurity do to the melting point of ice?', 'It lowers it', 'Salty water freezes below 0 degrees.', ['M_G8_IM_RAISE_MELT', 'It raises it', 'It leaves it the same', 'It makes ice hotter']),
    c('At what temperature does pure ice melt?', '0 degrees Celsius', 'Pure ice melts at 0 degrees Celsius.', ['M_G8_IM_NO_EFFECT', '100 degrees Celsius', '10 degrees Celsius', '37 degrees Celsius']),
    c('Salty water boils at 102 degrees Celsius. What does this show?', 'The salt raised the boiling point', 'Impurities raise the boiling point.', ['M_G8_IM_LOWER_BOIL', 'The salt lowered the boiling point', 'The salt has no effect', 'The water is pure']),
  ], OPT('A pure substance has fixed melting and boiling points.', 'Impurities raise the boiling point and lower the melting point.'))),
  fam('pc.im.why', `${PC}IMPURITIES`, 'why', 2, choose([
    c('Why is salt put on icy roads?', 'It lowers the melting point of ice', 'Salty ice melts below 0 degrees.', ['M_G8_IM_RAISE_MELT', 'It raises the melting point', 'It makes the road warmer', 'It has no effect']),
    c('Why does salty water boil above 100 degrees Celsius?', 'The salt raises the boiling point', 'Impurities raise the boiling point.', ['M_G8_IM_LOWER_BOIL', 'The salt lowers the boiling point', 'The water is hotter', 'Salt has no effect']),
    c('A scientist wants to test if a liquid is pure. What can she measure?', 'Its boiling point', 'A pure liquid boils at a fixed temperature.', ['M_G8_IM_NO_EFFECT', 'Its colour only', 'Its smell only', 'Its name']),
    c('Water boils at exactly 100 degrees Celsius. What does this suggest?', 'The water is probably pure', 'Pure water has a fixed boiling point.', ['M_G8_IM_NO_EFFECT', 'The water has salt', 'The water is dirty', 'The water is ice']),
    c('Ice with salt melts at minus 5 degrees Celsius. What does this show?', 'Salt lowered the melting point', 'Impurities lower the melting point.', ['M_G8_IM_RAISE_MELT', 'Salt raised the melting point', 'Salt has no effect', 'The ice is pure']),
  ], OPT('Impurities raise the boiling point and lower the melting point.', 'A pure substance has a fixed point.'))),
  fam('pc.im.spot', `${PC}IMPURITIES`, 'spot', 3, spot([
    sp('Baraka explains boiling.', 'Pure water boils at 100 degrees.', 'Salty water boils at a different temperature.', 'Salt lowers the boiling point.', 'Salt raises the boiling point.', 'M_G8_IM_LOWER_BOIL'),
    sp('Wanjiru explains melting.', 'Pure ice melts at 0 degrees.', 'Salt is put on icy roads.', 'Salt raises the melting point of ice.', 'Salt lowers the melting point of ice.', 'M_G8_IM_RAISE_MELT'),
    sp('Kamau explains purity.', 'A pure substance melts at a fixed point.', 'A pure substance boils at a fixed point.', 'Impurities do not change these points.', 'Impurities change the points.', 'M_G8_IM_NO_EFFECT'),
    sp('Mwende explains the test.', 'She boils the liquid.', 'She reads the temperature.', 'She says salt lowers the boiling point.', 'Salt raises the boiling point.', 'M_G8_IM_LOWER_BOIL'),
    sp('Nekesa explains ice.', 'Ice is frozen water.', 'It melts at 0 degrees when pure.', 'Impurities raise its melting point.', 'Impurities lower its melting point.', 'M_G8_IM_RAISE_MELT'),
  ], OPT('Check each step: pure points are fixed; impurities raise boiling and lower melting.', 'Salt lowers the melting point.'))),

  // ---------------------------------------------------------------- CHANGES
  fam('pc.ch.sort', `${PC}CHANGES`, 'direct', 1, choose([
    c('Is melting ice a physical or chemical change?', 'Physical', 'No new substance is made.', ['M_G8_CH_MELT_CHEMICAL', 'Chemical', 'Both', 'Neither']),
    c('Is burning wood a physical or chemical change?', 'Chemical', 'Burning makes new substances and cannot be reversed.', ['M_G8_CH_BURN_PHYSICAL', 'Physical', 'Both', 'Neither']),
    c('What does a chemical change make?', 'A new substance', 'A chemical change makes a new substance.', ['M_G8_CH_NEW', 'No new substance', 'The same substance', 'Only a new shape']),
    c('Which is a chemical change?', 'Rusting of iron', 'Rust is a new substance.', ['M_G8_CH_MELT_CHEMICAL', 'Dissolving sugar', 'Boiling water', 'Melting ice']),
    c('Which is a physical change?', 'Dissolving sugar in water', 'The sugar can be got back by evaporating.', ['M_G8_CH_BURN_PHYSICAL', 'Cooking an egg', 'Milk going sour', 'Burning paper']),
  ], OPT('Ask whether a new substance is made.', 'Burning and rusting are chemical changes.'))),
  fam('pc.ch.use', `${PC}CHANGES`, 'why', 2, choose([
    c('Milk goes sour. What kind of change is this?', 'A chemical change', 'A new substance is made.', ['M_G8_CH_BURN_PHYSICAL', 'A physical change', 'No change', 'A change of state']),
    c('Water boils to make steam. What kind of change is this?', 'A physical change', 'Steam is still water.', ['M_G8_CH_MELT_CHEMICAL', 'A chemical change', 'A new substance', 'A burning']),
    c('Which is a use of a change of state in daily life?', 'Making ice to keep drinks cold', 'Freezing water makes ice.', ['M_G8_CH_NEW', 'Burning wood to make charcoal', 'Cooking an egg', 'Rusting a nail']),
    c('Why can melted wax become solid again?', 'Melting is a physical change that can be reversed', 'No new substance was made.', ['M_G8_CH_NEW', 'A chemical change was reversed', 'A new substance was made', 'Wax disappears']),
    c('Why can ash not turn back into wood?', 'Burning is a chemical change and cannot be reversed', 'New substances were made.', ['M_G8_CH_BURN_PHYSICAL', 'Burning is a physical change', 'Ash is wood in another shape', 'Nothing changed']),
  ], OPT('A chemical change makes a new substance.', 'A physical change can usually be reversed.'))),
  fam('pc.ch.spot', `${PC}CHANGES`, 'spot', 3, spot([
    sp('Baraka sorts changes.', 'Melting ice is physical.', 'Dissolving sugar is physical.', 'Burning wood is physical.', 'Burning wood is chemical.', 'M_G8_CH_BURN_PHYSICAL'),
    sp('Wanjiru sorts changes.', 'Rusting is chemical.', 'Cooking an egg is chemical.', 'Melting ice is chemical.', 'Melting ice is physical.', 'M_G8_CH_MELT_CHEMICAL'),
    sp('Kamau explains changes.', 'A chemical change makes a new substance.', 'Burning is chemical.', 'A physical change makes a new substance.', 'A physical change makes no new substance.', 'M_G8_CH_NEW'),
    sp('Mwende explains reversing.', 'Melting can be reversed.', 'Freezing reverses melting.', 'Burning can be reversed.', 'Burning cannot be reversed.', 'M_G8_CH_BURN_PHYSICAL'),
    sp('Nekesa explains change of state.', 'Boiling water makes steam.', 'Steam can cool to water.', 'This is a chemical change.', 'This is a physical change.', 'M_G8_CH_MELT_CHEMICAL'),
  ], OPT('Check each step: a new substance means chemical.', 'Melting and boiling are physical.'))),
];
