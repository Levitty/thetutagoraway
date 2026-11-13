// ============================================================================
// GRADE 8 INTEGRATED SCIENCE, PART C: REPRODUCTION IN HUMANS, ENERGY AND PRESSURE (6 skills): the menstrual cycle, fertilisation and
// implantation, sexually transmitted infections, forms and sources of energy, energy transformations, pressure.
// Written offline from the KICD 2024 design. Only the knowledge half is tested; plans and demonstrations are for the teacher. The
// health statements (cycle, STIs, prevention) are written plainly for Grade 8 and are for a teacher or a health worker to confirm; the
// questions always name a trusted adult or a health worker as the place to turn. Every wrong answer names the library misconception it
// reveals. All stay reviewed:false until a teacher signs them off: they reach no child.
// ============================================================================
import { fam, choose, spot, c, sp } from './integratedscience_g8_lib.js';

const RP = 'LIVING.REPRODUCTION_IN_HUMAN_BE.', TE = 'FORCE_.TRANSFORMATION_OF_ENERGY.', PR = 'FORCE_.PRESSURE.';
const OPT = (a, b) => ({ h: [a, b] });

export const FAMILIES = [
  // ---------------------------------------------------------------- MENSTRUAL
  fam('rp.mc.cycle', `${RP}MENSTRUAL`, 'direct', 1, choose([
    c('About how long is the menstrual cycle?', 'About 28 days', 'The cycle is about 28 days, but it varies a little.', ['M_G8_MC_LENGTH', 'About 7 days', 'About 3 days', 'About 3 months']),
    c('About how long does the bleeding last?', 'Three to seven days', 'The bleeding lasts about three to seven days.', ['M_G8_MC_LENGTH', 'One day only', 'Two weeks', 'A whole month']),
    c('When is an egg released?', 'About the middle of the cycle', 'This is called ovulation.', ['M_G8_MC_OVULATION', 'At the start of the bleeding', 'At the end of the cycle only', 'Every day']),
    c('What is menstruation?', 'A normal part of growing up', 'It is not an illness.', ['M_G8_MC_DISEASE', 'An illness', 'A punishment', 'An infection']),
    c('What is ovulation?', 'The release of an egg from the ovary', 'It happens about once a cycle.', ['M_G8_MC_OVULATION', 'The start of the bleeding', 'The end of the cycle', 'A kind of illness']),
  ], OPT('The cycle is about 28 days and the bleeding about three to seven days.', 'Menstruation is normal.'))),
  fam('rp.mc.cope', `${RP}MENSTRUAL`, 'why', 2, choose([
    c('Which is a healthy way to manage menstrual cramps?', 'Rest, warm drinks, and telling a trusted adult', 'Rest and care help. Severe pain should be seen by a health worker.', ['M_G8_MC_DISEASE', 'Hide it and say nothing to anyone', 'Skip every meal until it passes', 'Stay away from school for a whole month']),
    c('Wanjiru\'s period starts at school. What should she do?', 'Tell a teacher or the school nurse and use a clean pad', 'A trusted adult can help.', ['M_G8_MC_DISEASE', 'Hide it all day long and sit very still', 'Run home without telling any teacher or friend', 'Use any dirty cloth that she finds']),
    c('How often should a pad or cloth be changed?', 'Often, to stay clean and healthy', 'Changing often keeps the skin healthy.', ['M_G8_MC_DISEASE', 'Once a day only, in the evening', 'Only when it is completely full', 'Never, it is not needed']),
    c('A girl has very heavy bleeding and bad pain. What should she do?', 'See a health worker', 'Severe symptoms need a health worker.', ['M_G8_MC_DISEASE', 'Wait for months', 'Hide it from everyone', 'Take any pills she finds']),
    c('Menstruation shows that...', 'The body is growing normally', 'It is a normal part of growing up.', ['M_G8_MC_DISEASE', 'A girl is ill and needs medicine', 'A girl is dirty and unwell', 'A girl has done something wrong']),
  ], OPT('Menstruation is normal; tell a trusted adult and see a health worker for severe pain.', 'Change pads often.'))),
  fam('rp.mc.spot', `${RP}MENSTRUAL`, 'spot', 3, spot([
    sp('Baraka explains the cycle.', 'The cycle is about 28 days.', 'Bleeding lasts three to seven days.', 'The cycle is about 7 days.', 'The cycle is about 28 days.', 'M_G8_MC_LENGTH'),
    sp('Wanjiru explains ovulation.', 'An egg is released from an ovary.', 'This happens about once a cycle.', 'It happens at the start of the bleeding.', 'It happens about the middle of the cycle.', 'M_G8_MC_OVULATION'),
    sp('Kamau explains menstruation.', 'It is part of growing up.', 'A girl can talk to a trusted adult.', 'It is an illness.', 'It is a normal part of growing up.', 'M_G8_MC_DISEASE'),
    sp('Mwende explains care.', 'Change the pad often.', 'Wash with clean water.', 'Hide pain that is severe.', 'See a health worker for severe pain.', 'M_G8_MC_DISEASE'),
    sp('Nekesa explains the days.', 'A cycle counts from the first day of bleeding.', 'It is about 28 days.', 'It is exactly 7 days for everyone.', 'It is about 28 days and varies a little.', 'M_G8_MC_LENGTH'),
  ], OPT('Check each step: the cycle, ovulation, normal, care.', 'See a health worker for severe pain.'))),

  // ---------------------------------------------------------------- FERTILISATION
  fam('rp.fe.order', `${RP}FERTILISATION`, 'direct', 1, choose([
    c('Where does fertilisation happen?', 'In the oviduct', 'A sperm joins an egg in the oviduct.', ['M_G8_FE_PLACE', 'In the uterus', 'In the ovary', 'In the stomach']),
    c('Which happens first?', 'Fertilisation', 'Fertilisation comes first, then implantation.', ['M_G8_FE_ORDER', 'Implantation', 'Birth', 'Menstruation']),
    c('What is a zygote?', 'The first cell made when sperm joins egg', 'The zygote starts to divide.', ['M_G8_FE_ZYGOTE', 'A newborn baby', 'A large cell in the ovary', 'An egg alone']),
    c('What is implantation?', 'The embryo attaching to the wall of the uterus', 'It happens after fertilisation.', ['M_G8_FE_ORDER', 'The sperm meeting the egg', 'The egg leaving the ovary', 'Birth']),
    c('What is fertilisation?', 'A sperm joining an egg', 'This makes a zygote.', ['M_G8_FE_ORDER', 'An embryo attaching to the uterus', 'An egg leaving the ovary', 'A baby being born']),
  ], OPT('Fertilisation is in the oviduct; implantation is in the uterus.', 'Fertilisation comes first.'))),
  fam('rp.fe.steps', `${RP}FERTILISATION`, 'steps', 2, choose([
    c('Which is the correct order?', 'Fertilisation, division of the zygote, implantation', 'The zygote divides as it travels to the uterus.', ['M_G8_FE_ORDER', 'Implantation, fertilisation, division', 'Division, implantation, fertilisation', 'Birth, fertilisation, implantation']),
    c('After fertilisation, the zygote travels to...', 'The uterus', 'It reaches the uterus and implants.', ['M_G8_FE_PLACE', 'The stomach', 'The ovary', 'The bladder']),
    c('What does the zygote do on its way?', 'It divides into more cells', 'It divides again and again.', ['M_G8_FE_ZYGOTE', 'It becomes a baby at once', 'It stops dividing', 'It leaves the body']),
    c('Where does the embryo attach?', 'The wall of the uterus', 'This is implantation.', ['M_G8_FE_PLACE', 'The wall of the oviduct only', 'The ovary', 'The stomach']),
    c('Which cell is made at fertilisation?', 'A zygote', 'Fertilisation makes a zygote.', ['M_G8_FE_ZYGOTE', 'A baby', 'An egg', 'A sperm']),
  ], OPT('Put the events on cards in order.', 'The zygote divides before it implants.'))),
  fam('rp.fe.spot', `${RP}FERTILISATION`, 'spot', 3, spot([
    sp('Baraka explains fertilisation.', 'A sperm joins an egg.', 'This makes a zygote.', 'It happens in the uterus.', 'It happens in the oviduct.', 'M_G8_FE_PLACE'),
    sp('Wanjiru explains the order.', 'Fertilisation happens first.', 'The zygote divides.', 'Implantation comes before fertilisation.', 'Fertilisation comes before implantation.', 'M_G8_FE_ORDER'),
    sp('Kamau explains the zygote.', 'The zygote is one cell.', 'It divides.', 'The zygote is a newborn baby.', 'The zygote is the first cell.', 'M_G8_FE_ZYGOTE'),
    sp('Mwende explains implantation.', 'The embryo reaches the uterus.', 'It attaches to the wall.', 'Implantation happens in the oviduct.', 'Implantation happens in the uterus.', 'M_G8_FE_PLACE'),
    sp('Nekesa explains the steps.', 'The egg is released.', 'A sperm joins it.', 'Then the zygote implants before dividing.', 'The zygote divides before it implants.', 'M_G8_FE_ORDER'),
  ], OPT('Check each step: where, the order, the zygote.', 'Fertilisation is in the oviduct.'))),

  // ---------------------------------------------------------------- STIS
  fam('rp.st.know', `${RP}STIS`, 'direct', 1, choose([
    c('Which does NOT spread an STI?', 'Hugging or shaking hands', 'STIs do not spread by hugging, shaking hands or toilet seats.', ['M_G8_STI_MYTH', 'Unprotected sex', 'Sharing needles', 'Infected blood']),
    c('What should a person with symptoms of an STI do?', 'See a health worker for testing and treatment', 'Many STIs can be treated.', ['M_G8_STI_NO_CURE', 'Nothing, because they cannot be treated', 'Hide it from everyone', 'Take any pills she finds at home']),
    c('Which helps to prevent STIs?', 'Abstinence and faithfulness to one uninfected partner', 'These are the best protection.', ['M_G8_STI_PREVENT', 'Washing the body well after sex', 'Taking vitamins every morning', 'Drinking plenty of water each day']),
    c('Which is a symptom that may point to an STI?', 'Unusual discharge or sores', 'Such symptoms need a health worker.', ['M_G8_STI_MYTH', 'A sore throat and nothing else', 'A headache and nothing else', 'A blocked nose and nothing else']),
    c('Which is an STI?', 'HIV', 'HIV is a sexually transmitted infection.', ['M_G8_STI_MYTH', 'A cold', 'Malaria', 'A broken bone']),
  ], OPT('STIs spread by unsafe sex and sharing needles, not by hugging.', 'See a health worker early.'))),
  fam('rp.st.help', `${RP}STIS`, 'why', 2, choose([
    c('A friend says STIs spread by sitting on a toilet seat. What is the right reply?', 'STIs do not spread that way', 'STIs spread through unprotected sex, blood and from mother to child.', ['M_G8_STI_MYTH', 'Yes, avoid all toilets', 'Yes, they spread by hugging', 'Yes, by shaking hands']),
    c('Why is it important to see a health worker early?', 'Many STIs can be treated when found early', 'Early treatment helps.', ['M_G8_STI_NO_CURE', 'STIs cannot be treated', 'It has no effect', 'It makes the infection worse']),
    c('Which habit helps to prevent the spread of HIV?', 'Not sharing needles or razors', 'Sharp objects can carry blood.', ['M_G8_STI_PREVENT', 'Washing hands after sex', 'Hiding the problem', 'Staying near infected people']),
    c('A young person is worried about an STI. Where can she turn?', 'A trusted adult or a health worker', 'They can guide and help.', ['M_G8_STI_NO_CURE', 'Nobody, it is a secret', 'A stranger online', 'A friend who gossips']),
    c('Which is the surest way to avoid STIs?', 'Abstinence', 'Not having sex avoids STIs.', ['M_G8_STI_PREVENT', 'Washing afterwards', 'Taking a pill', 'Moving away']),
  ], OPT('Abstinence and faithfulness prevent STIs; see a health worker early.', 'STIs do not spread by hugging.'))),
  fam('rp.st.spot', `${RP}STIS`, 'spot', 3, spot([
    sp('Baraka explains STIs.', 'STIs spread through unsafe sex.', 'They also spread through infected blood.', 'They spread by hugging.', 'They do not spread by hugging.', 'M_G8_STI_MYTH'),
    sp('Wanjiru explains treatment.', 'See a health worker.', 'Many STIs can be treated.', 'STIs can never be treated.', 'Many STIs can be treated.', 'M_G8_STI_NO_CURE'),
    sp('Kamau explains prevention.', 'Abstinence prevents STIs.', 'Faithfulness helps.', 'Washing the body after sex prevents STIs.', 'Washing afterwards does not prevent STIs.', 'M_G8_STI_PREVENT'),
    sp('Mwende explains spread.', 'Sharing needles can spread HIV.', 'Sharing razors can spread HIV.', 'Sitting on a toilet seat spreads HIV.', 'HIV does not spread on toilet seats.', 'M_G8_STI_MYTH'),
    sp('Nekesa explains symptoms.', 'Sores can be a sign.', 'Unusual discharge can be a sign.', 'Nobody needs a health worker.', 'Anyone with symptoms should see a health worker.', 'M_G8_STI_NO_CURE'),
  ], OPT('Check each step: how STIs spread, treatment, prevention.', 'Hugging does not spread STIs.'))),

  // ---------------------------------------------------------------- ENERGY_FORMS_SOURCES
  fam('te.fs.forms', `${TE}ENERGY_FORMS_SOURCES`, 'direct', 1, choose([
    c('Which is a renewable source of energy?', 'The sun', 'The sun is renewable.', ['M_G8_EN_RENEWABLE_COAL', 'Coal', 'Petroleum', 'Natural gas']),
    c('Which is a non-renewable source of energy?', 'Petroleum', 'Petroleum will run out.', ['M_G8_EN_SOLAR_NONREN', 'Wind', 'Flowing water', 'The sun']),
    c('Which form of energy does a rolling ball have?', 'Kinetic energy', 'Moving objects have kinetic energy.', ['M_G8_EN_FORM_MIX', 'Chemical energy', 'Electrical energy', 'Sound energy']),
    c('Which Kenyan site makes electricity from underground steam?', 'Olkaria', 'Olkaria uses geothermal energy.', ['M_G8_EN_SOLAR_NONREN', 'Fort Jesus', 'Olduvai', 'Koobi Fora']),
    c('Which form of energy is stored in food and fuel?', 'Chemical energy', 'Food and fuel store chemical energy.', ['M_G8_EN_FORM_MIX', 'Sound energy', 'Kinetic energy', 'Light energy']),
  ], OPT('Renewable sources do not run out: sun, wind, flowing water, geothermal.', 'Moving objects have kinetic energy.'))),
  fam('te.fs.sort', `${TE}ENERGY_FORMS_SOURCES`, 'word', 2, choose([
    c('Wind turbines at Lake Turkana use which kind of source?', 'A renewable source', 'Wind does not run out.', ['M_G8_EN_SOLAR_NONREN', 'A non-renewable source', 'A fossil fuel', 'A chemical']),
    c('Coal is...', 'Non-renewable', 'Coal will run out.', ['M_G8_EN_RENEWABLE_COAL', 'Renewable', 'Made in a week', 'Always available']),
    c('Which of these is NOT renewable?', 'Natural gas', 'Gas will run out.', ['M_G8_EN_RENEWABLE_COAL', 'Wind', 'Geothermal', 'Flowing water']),
    c('A stretched spring stores which form of energy?', 'Potential energy', 'Stretched things store potential energy.', ['M_G8_EN_FORM_MIX', 'Kinetic energy', 'Sound energy', 'Light energy']),
    c('Biogas from cow dung is...', 'Renewable', 'More dung is made all the time.', ['M_G8_EN_RENEWABLE_COAL', 'Non-renewable', 'A metal', 'A rock']),
  ], OPT('Renewable sources are replaced by nature.', 'Fossil fuels run out.'))),
  fam('te.fs.spot', `${TE}ENERGY_FORMS_SOURCES`, 'spot', 3, spot([
    sp('Baraka sorts sources.', 'The sun is renewable.', 'Wind is renewable.', 'Coal is renewable.', 'Coal is non-renewable.', 'M_G8_EN_RENEWABLE_COAL'),
    sp('Wanjiru sorts sources.', 'Petroleum is non-renewable.', 'Geothermal is renewable.', 'Wind is non-renewable.', 'Wind is renewable.', 'M_G8_EN_SOLAR_NONREN'),
    sp('Kamau names forms.', 'A moving ball has kinetic energy.', 'Food has chemical energy.', 'A moving ball has chemical energy.', 'A moving ball has kinetic energy.', 'M_G8_EN_FORM_MIX'),
    sp('Mwende names Kenyan sources.', 'Olkaria is geothermal.', 'Lake Turkana has wind power.', 'Olkaria is a coal mine.', 'Olkaria is geothermal.', 'M_G8_EN_RENEWABLE_COAL'),
    sp('Nekesa names forms.', 'A stretched spring has potential energy.', 'A lamp gives light.', 'A lamp is a source of coal.', 'A lamp changes electrical energy into light.', 'M_G8_EN_FORM_MIX'),
  ], OPT('Check each step: renewable or not, and the form of energy.', 'Coal is non-renewable.'))),

  // ---------------------------------------------------------------- ENERGY_TRANSFORM
  fam('te.tr.change', `${TE}ENERGY_TRANSFORM`, 'direct', 1, choose([
    c('What does an electric kettle change electrical energy into?', 'Heat', 'A kettle gives out heat.', ['M_G8_ET_KETTLE_LIGHT', 'Light', 'Sound', 'Kinetic energy']),
    c('What does a solar panel change light into?', 'Electrical energy', 'A solar panel makes electricity.', ['M_G8_ET_SOLAR', 'Sound', 'Chemical energy', 'Heat only']),
    c('What happens to energy when it is used?', 'It changes into other forms', 'Energy is never used up.', ['M_G8_ET_CREATED', 'It disappears', 'It is made new', 'It is lost for ever']),
    c('What does an electric lamp change electrical energy into?', 'Light and some heat', 'A lamp gives light and a little heat.', ['M_G8_ET_KETTLE_LIGHT', 'Sound only', 'Chemical energy', 'Kinetic energy only']),
    c('What changes happen as water falls through a hydroelectric plant?', 'Potential to kinetic to electrical energy', 'Falling water turns a turbine.', ['M_G8_ET_CREATED', 'Electrical to potential to light', 'Heat to cold', 'Sound to light']),
  ], OPT('Energy changes form; it is never used up.', 'A kettle gives heat; a lamp gives light.'))),
  fam('te.tr.safe', `${TE}ENERGY_TRANSFORM`, 'why', 2, choose([
    c('A burning match changes chemical energy into...', 'Heat and light', 'A flame gives heat and light.', ['M_G8_ET_KETTLE_LIGHT', 'Sound only', 'Electrical energy', 'Kinetic energy only']),
    c('Which is a safety measure with electricity?', 'Do not touch bare wires', 'Bare wires can give a shock.', ['M_G8_ET_CREATED', 'Pull a plug by the cord', 'Touch sockets with wet hands', 'Poke the socket with a pin']),
    c('Which is a safety measure near heat?', 'Keep flammable things away from it', 'Flammable things can catch fire.', ['M_G8_ET_CREATED', 'Hang cloth over the stove', 'Leave a candle with paper', 'Let a child tend the fire alone']),
    c('Where does the energy in a solar lamp come from?', 'The light of the sun', 'The panel changes sunlight to electrical energy.', ['M_G8_ET_SOLAR', 'The sound of the wind', 'Burning coal inside', 'The cold air']),
    c('A child says "the lamp used up the energy." What is the better statement?', 'The lamp changed electrical energy into light and heat', 'Energy is never used up, it changes form.', ['M_G8_ET_CREATED', 'The energy was destroyed', 'The energy was created', 'The energy went to nowhere']),
  ], OPT('Energy is never created or used up.', 'Keep flammable things away from heat and wires.'))),
  fam('te.tr.spot', `${TE}ENERGY_TRANSFORM`, 'spot', 3, spot([
    sp('Baraka explains a kettle.', 'A kettle uses electrical energy.', 'It heats the water.', 'It changes electrical energy into light.', 'It changes electrical energy into heat.', 'M_G8_ET_KETTLE_LIGHT'),
    sp('Wanjiru explains energy.', 'Energy changes from one form to another.', 'The total stays the same.', 'Energy is used up and disappears.', 'Energy is never used up.', 'M_G8_ET_CREATED'),
    sp('Kamau explains solar panels.', 'A solar panel faces the sun.', 'It makes electricity.', 'It changes sound to electricity.', 'It changes light to electricity.', 'M_G8_ET_SOLAR'),
    sp('Mwende explains safety.', 'Keep wires covered.', 'Do not touch bare wires.', 'Touch a socket with wet hands.', 'Never touch a socket with wet hands.', 'M_G8_ET_CREATED'),
    sp('Nekesa explains a lamp.', 'A lamp is switched on.', 'It gives light.', 'It makes new energy from nothing.', 'It changes electrical energy into light and heat.', 'M_G8_ET_CREATED'),
  ], OPT('Check each step: what the device changes energy into.', 'Energy is never created or used up.'))),

  // ---------------------------------------------------------------- PRESSURE
  fam('pr.pr.pick', `${PR}PRESSURE`, 'direct', 1, choose([
    c('The same force acts on a small area and on a large area. Where is the pressure bigger?', 'On the small area', 'The same force on a smaller area gives more pressure.', ['M_G8_PR_FORCE_ONLY', 'The same in both', 'On the large area', 'No pressure in either']),
    c('Why do wide tyres sink less in mud?', 'They spread the force over a larger area', 'A larger area gives less pressure.', ['M_G8_PR_AREA_WRONG', 'They give more pressure', 'They weigh more', 'They are made of rubber']),
    c('How does liquid pressure change with depth?', 'It increases', 'Pressure grows with depth.', ['M_G8_PR_DEPTH', 'It stays the same', 'It decreases', 'It is zero']),
    c('A force of 100 newtons acts on 2 square metres. What is the pressure?', '50 newtons per square metre', 'Pressure is force divided by area: 100 divided by 2 is 50.', ['M_G8_PR_FORCE_ONLY', '200 newtons per square metre', '98 newtons per square metre', '102 newtons per square metre']),
    c('Why is a nail pointed?', 'A small tip gives a high pressure', 'The force acts on a very small area.', ['M_G8_PR_AREA_WRONG', 'A large tip gives a high pressure', 'It makes the nail light', 'It looks neat']),
  ], OPT('Pressure is force divided by area.', 'Liquid pressure grows with depth.'))),
  fam('pr.pr.use', `${PR}PRESSURE`, 'why', 2, choose([
    c('Why is a dam wall thicker at the bottom?', 'The water pressure is greater at the bottom', 'Pressure grows with depth.', ['M_G8_PR_DEPTH', 'The pressure is the same everywhere in the water', 'The wall is older at the bottom', 'It looks better to the people']),
    c('Why does a sharp knife cut better than a blunt knife?', 'The same force acts on a smaller area', 'A smaller area gives a higher pressure.', ['M_G8_PR_AREA_WRONG', 'The force is smaller on a sharp knife', 'The area is larger on a sharp edge', 'It weighs more than a blunt knife']),
    c('Why do snow shoes help a person walk on snow?', 'They spread the weight over a bigger area', 'A larger area gives a smaller pressure.', ['M_G8_PR_AREA_WRONG', 'They add weight to the walker', 'They shrink the area under the foot', 'They make the snow harder underfoot']),
    c('A force of 60 newtons acts on 3 square metres. What is the pressure?', '20 newtons per square metre', 'Divide 60 by 3.', ['M_G8_PR_FORCE_ONLY', '180 newtons per square metre', '57 newtons per square metre', '63 newtons per square metre']),
    c('Why is a water tank put on a high stand?', 'Water falls with more pressure from a height', 'Greater height gives greater water pressure.', ['M_G8_PR_DEPTH', 'Water pressure is the same at all heights', 'The tank is lighter', 'It saves metal']),
  ], OPT('A smaller area gives a bigger pressure.', 'Pressure is force divided by area.'))),
  fam('pr.pr.spot', `${PR}PRESSURE`, 'spot', 3, spot([
    sp('Baraka explains pressure.', 'Pressure is force on an area.', 'A small area gives more pressure.', 'A large area gives more pressure.', 'A large area gives less pressure.', 'M_G8_PR_AREA_WRONG'),
    sp('Wanjiru explains force.', 'A bigger force gives more pressure.', 'Area also matters.', 'Pressure depends only on the force.', 'Pressure depends on force and area.', 'M_G8_PR_FORCE_ONLY'),
    sp('Kamau explains liquids.', 'Liquids press in all directions.', 'The pressure grows with depth.', 'The pressure stays the same with depth.', 'The pressure grows with depth.', 'M_G8_PR_DEPTH'),
    sp('Mwende calculates.', 'The force is 40 newtons.', 'The area is 4 square metres.', 'The pressure is 160 newtons per square metre.', 'The pressure is 10 newtons per square metre.', 'M_G8_PR_FORCE_ONLY'),
    sp('Nekesa explains tyres.', 'A tractor has wide tyres.', 'The weight is spread.', 'Wide tyres increase the pressure.', 'Wide tyres reduce the pressure.', 'M_G8_PR_AREA_WRONG'),
  ], OPT('Check each step: force, area, depth.', 'Pressure is force divided by area.'))),
];
