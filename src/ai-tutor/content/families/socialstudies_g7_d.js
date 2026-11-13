// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART D: the earth and the solar system, weather, and fieldwork (8 skills).
// Written offline from the KICD design through the curriculum map. The mean, median and mode questions are generated from small
// data sets, so every key is computed, never typed. Options are about the same length so the right answer is never the longest.
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const ES = 'NATURA.EARTH_AND_THE_SOLAR_SYST.', WE = 'NATURA.WEATHER.', FW = 'NATURA.FIELDWORK.';

// ---- mean, median, mode: small fixed data sets chosen by a seeded search; keys computed
let seed = 7;
const rnd = (n) => { seed = (seed * 48271) % 2147483647; return seed % n; };
const stats = (a) => { const s = [...a].sort((x, y) => x - y), n = a.length, sum = a.reduce((x, y) => x + y, 0), cnt = {}; a.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; });
  const top = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter(k => cnt[k] === top).map(Number); return { s, mean: sum / n, median: s[(n - 1) / 2], mode: modes.length === 1 ? modes[0] : null, mid: a[(n - 1) / 2] }; };
const DATA = [];
for (let guard = 0; DATA.length < 6 && guard < 5000; guard++) {
  const a = Array.from({ length: 5 }, () => 2 + rnd(12)), st = stats(a);
  if (!Number.isInteger(st.mean) || st.mode === null || new Set([st.mean, st.median, st.mode]).size < 3 || st.mid === st.median || st.mid === st.mean || DATA.some(d => d.a.join() === a.join())) continue;
  DATA.push({ a, ...st });
}
const ctx = ['vehicles passing the school gate each hour', 'learners crossing the road each day', 'matatus stopping at the stage each hour', 'boda boda riders without helmets each day', 'cars that slowed at the zebra crossing each hour', 'learners who walked to school each day'];
const nums = (d) => `${d.a.join(', ')}`;
const num3 = (right, mis, ...others) => [others.filter(x => x !== right).slice(0, 3).map(x => `${x}|${mis}`)];
const uniq = (arr, right) => [...new Set(arr)].filter(x => x !== right);
const meanCases = DATA.map((d, i) => Q(`In a road safety study, learners counted ${ctx[i]}: ${nums(d)}. What is the mean?`, String(d.mean),
  [...uniq([d.median, d.mode, d.mean + 2, d.mean - 1], d.mean).slice(0, 3).map(x => `${x}|FW_MODE_MEAN`)], `Add the numbers to get ${d.a.reduce((x, y) => x + y, 0)}, then divide by 5 to get ${d.mean}.`));
const medianCases = DATA.map((d, i) => Q(`Learners counted ${ctx[i]}: ${nums(d)}. What is the median?`, String(d.median),
  [`${d.mid}|FW_MEAN_MEDIAN`, ...uniq([d.mean, d.mode, d.s[0], d.s[4]], d.median).filter(x => x !== d.mid).slice(0, 2).map(x => `${x}|FW_MODE_MEAN`)], `Put the numbers in order: ${d.s.join(', ')}. The middle one is ${d.median}.`));
const modeCases = DATA.map((d, i) => Q(`Learners counted ${ctx[i]}: ${nums(d)}. What is the mode?`, String(d.mode),
  [...uniq([d.mean, d.median, d.s[0], d.s[4]], d.mode).slice(0, 3).map(x => `${x}|FW_MODE_MEAN`)], `The mode is the number that occurs most often. Here it is ${d.mode}.`));

export const FAMILIES = [
  // ---------------------------------------------------------------- ES_ORIGIN_SIZE
  fam('es.or.which', `${ES}ES_ORIGIN_SIZE`, 'direct', 1, choose([
    Q('What is the shape of the earth?', 'Almost round, like a ball', w('ES_FLAT', 'Flat like a plate', 'Shaped like a cube', 'Long like a pencil'), 'The earth is almost a sphere.'),
    Q('Which planet from the Sun is the earth?', 'The third', w('ES_THIRD_SUN', 'The first', 'The fifth', 'The eighth'), 'Mercury and Venus come first, so the earth is the third.'),
    Q('Which is evidence that the earth is round?', 'A ship disappears hull first over the horizon', w('ES_FLAT', 'The ground feels flat where we stand', 'Mountains are very tall', 'Rivers flow downhill'), 'Ships sink below the horizon hull first, because the surface curves.'),
    Q('About how old is the earth?', 'About 4.5 billion years', w('ES_FLAT', 'About 4,500 years', 'About 45 million years', 'About 4.5 million years'), 'Scientists estimate about 4.5 billion years.'),
    Q('How many planets are in our solar system?', 'Eight', w('ES_THIRD_SUN', 'Three', 'Five', 'Twelve'), 'There are eight planets.'),
  ], { h: ['The earth is almost a ball, the third planet from the Sun.', 'Ships disappear hull first.'], s1: 'Think of the earth as a ball.' })),
  fam('es.or.story', `${ES}ES_ORIGIN_SIZE`, 'word', 2, choose([
    Q('A learner says the earth is flat because the ground looks flat. What is the best reply?', 'It looks flat only because it is so large', w('ES_FLAT', 'You are right, it is flat', 'It is shaped like a bowl', 'It is cut in half'), 'The earth is so large that a small part looks flat.'),
    Q('During a lunar eclipse the earth\'s shadow on the Moon is curved. What does this show?', 'The earth is round', w('ES_FLAT', 'The earth is flat', 'The Moon is flat', 'The Sun is square'), 'A round shadow shows a round earth.'),
    Q('The earth is between Venus and Mars. Which planet is it from the Sun?', 'The third', w('ES_THIRD_SUN', 'The second', 'The fourth', 'The sixth'), 'Mercury, Venus, then the earth.'),
    Q('Astronauts take photographs of the earth from space. What do they show?', 'A round planet', w('ES_FLAT', 'A flat disc', 'A square', 'A triangle'), 'Photographs from space show a round earth.'),
    Q('About how wide is the earth?', 'About 12,700 kilometres across', w('ES_FLAT', 'About 127 kilometres across', 'About 1,270 kilometres across', 'About 1,270,000 kilometres across'), 'The earth is about 12,700 kilometres across.'),
  ], { h: ['Which evidence shows a curved earth?', 'Round shadow, ships and photographs.'], s1: 'Think of evidence for a round earth.' }), 'b'),

  // ---------------------------------------------------------------- ES_MOTION
  fam('es.mo.which', `${ES}ES_MOTION`, 'direct', 1, choose([
    Q('What causes day and night?', 'The earth rotating on its axis', w('ES_SUN_MOVES', 'The Sun going round the earth', 'The Moon covering the Sun', 'The clouds covering the sky'), 'The earth turns once every 24 hours.'),
    Q('How long does one rotation of the earth take?', 'About 24 hours', w('ES_SUN_MOVES', 'About 12 hours', 'About 7 days', 'About 365 days'), 'One rotation takes about 24 hours.'),
    Q('How long does one revolution of the earth round the Sun take?', 'About 365 and a quarter days', w('ES_SUN_MOVES', 'About 24 hours', 'About 30 days and some hours', 'About 7 days'), 'A revolution takes about 365 and a quarter days.'),
    Q('What causes the seasons in many parts of the world?', 'The tilt of the axis and the revolution', w('ES_SEASON_DISTANCE', 'The earth moving closer and farther from the Sun', 'The Moon changing shape', 'Clouds that cover the Sun'), 'Tilt and revolution together give the seasons.'),
    Q('Why is there a leap year every four years?', 'The earth\'s revolution takes about a quarter of a day extra', w('ES_SEASON_DISTANCE', 'The Moon takes a much longer time to go round the earth', 'The Sun moves slowly', 'The earth stops once'), 'The extra quarter days add up to a day every four years.'),
  ], { h: ['Rotation is spinning. Revolution is going round the Sun.', 'Tilt and revolution give seasons.'], s1: 'Think of rotation and revolution.' })),
  fam('es.mo.story', `${ES}ES_MOTION`, 'word', 2, choose([
    Q('When it is noon in Nairobi, it is night in the United States. Why?', 'The earth rotates, so one side faces away from the Sun', w('ES_SUN_MOVES', 'The Sun moves all round the earth', 'The Moon blocks the Sun there', 'The United States is always much closer to the Sun'), 'The earth rotates, so places have different times.'),
    Q('A learner says seasons come because the earth is closer to the Sun in summer. What is wrong?', 'The tilt of the axis causes the seasons', w('ES_SEASON_DISTANCE', 'Nothing is wrong', 'The Moon causes the changes of seasons', 'The wind causes seasons'), 'Tilt and revolution cause seasons, not distance.'),
    Q('The earth completes one trip round the Sun. What has passed?', 'About one year', w('ES_SUN_MOVES', 'About one day', 'About one month', 'About one week'), 'One revolution is one year.'),
    Q('Why do people far from the equator have clear seasons?', 'The earth\'s tilt changes how the Sun\'s rays fall', w('ES_SEASON_DISTANCE', 'Those places move much closer to the Sun', 'The Moon cools them', 'The wind carries seasons'), 'The tilt changes the angle of the Sun\'s rays.'),
    Q('The sun appears to rise in the east. Why?', 'The earth rotates from west to east', w('ES_SUN_MOVES', 'The Sun moves all round the earth', 'The Moon pushes the Sun', 'The wind turns the Sun'), 'The earth spins towards the east.'),
  ], { h: ['Which movement of the earth explains the clue?', 'Rotation: day and night. Revolution: the year.'], s1: 'Decide: rotation or revolution?' })),

  // ---------------------------------------------------------------- ES_STRUCTURE
  fam('es.st.which', `${ES}ES_STRUCTURE`, 'direct', 1, choose([
    Q('Which is the thinnest layer of the earth?', 'The crust', w('ES_CRUST_THICK', 'The mantle', 'The outer core', 'The inner core'), 'The crust is the thinnest, like the skin of an apple.'),
    Q('What is the inner core like?', 'Solid and very hot', w('ES_CORE_COLD', 'Cold and hollow', 'Soft and cold', 'Made of ice'), 'The inner core is solid iron and nickel.'),
    Q('Which layer is liquid?', 'The outer core', w('ES_CORE_COLD', 'The crust', 'The inner core', 'The surface rocks'), 'The outer core is liquid iron and nickel.'),
    Q('Which layer is just below the crust?', 'The mantle', w('ES_CRUST_THICK', 'The inner core', 'The outer core', 'The air'), 'The mantle lies below the crust.'),
    Q('Which layer do people live on?', 'The crust', w('ES_CRUST_THICK', 'The mantle', 'The core', 'The magma chamber'), 'We live on the crust.'),
  ], { h: ['From the surface: crust, mantle, outer core, inner core.', 'The crust is the thinnest.'], s1: 'Picture the layers from the top.' })),
  fam('es.st.story', `${ES}ES_STRUCTURE`, 'word', 2, choose([
    Q('Hot melted rock comes out of a volcano. Which layer does it come from?', 'The mantle', w('ES_CORE_COLD', 'The crust only', 'The outer air', 'The inner core'), 'Magma comes from the mantle.'),
    Q('A learner says the crust is the thickest layer. What is the correct fact?', 'The crust is the thinnest layer', w('ES_CRUST_THICK', 'The learner is right about all of this', 'The crust is as thick as the mantle', 'There is no crust'), 'The crust is thin compared with the mantle.'),
    Q('Which order is correct from the surface downwards?', 'Crust, mantle, outer core, inner core', w('ES_CRUST_THICK', 'Mantle, crust, inner core, outer core', 'Inner core, outer core, mantle, crust', 'Outer core, crust, mantle, inner core'), 'The correct order is crust, mantle, outer core, inner core.'),
    Q('A learner says the centre of the earth is hollow and cold. What is wrong?', 'The inner core is solid and very hot', w('ES_CORE_COLD', 'Nothing is wrong', 'The centre is liquid and cold', 'The centre is empty air'), 'The centre is solid and very hot.'),
    Q('Which two metals mainly make up the core?', 'Iron and nickel', w('ES_CORE_COLD', 'Gold and silver', 'Copper and tin', 'Lead and zinc'), 'The core is mostly iron and nickel.'),
  ], { h: ['Think of an apple: skin, flesh, seed.', 'Crust thin, mantle thick, core hot.'], s1: 'Think of the layers in order.' })),

  // ---------------------------------------------------------------- WE_ELEMENTS
  fam('we.el.which', `${WE}WE_ELEMENTS`, 'direct', 1, choose([
    Q('Which instrument measures air pressure?', 'The barometer', w('WE_TEMP_BAROMETER', 'The thermometer', 'The rain gauge', 'The wind vane'), 'A barometer measures air pressure.'),
    Q('Which instrument measures temperature?', 'The thermometer', w('WE_TEMP_BAROMETER', 'The barometer', 'The anemometer', 'The hygrometer'), 'A thermometer measures temperature.'),
    Q('Which instrument measures wind speed?', 'The anemometer', w('WE_TEMP_BAROMETER', 'The wind vane', 'The rain gauge', 'The barometer'), 'An anemometer measures speed. A wind vane shows direction.'),
    Q('Which instrument measures rainfall?', 'The rain gauge', w('WE_TEMP_BAROMETER', 'The hygrometer', 'The barometer', 'The thermometer'), 'A rain gauge collects rain to measure it.'),
    Q('Which tells the climate of a place?', 'The pattern of weather over many years', w('WE_WEATHER_CLIMATE', 'Today\'s temperature', 'Yesterday\'s rain', 'This morning\'s wind'), 'Climate is the average pattern over many years.'),
  ], { h: ['Match each element to its instrument.', 'Weather is short term. Climate is long term.'], s1: 'Match element and instrument.' })),
  fam('we.el.story', `${WE}WE_ELEMENTS`, 'word', 2, choose([
    Q('A learner wants to measure how much water is in the air. Which instrument should she use?', 'A hygrometer', w('WE_TEMP_BAROMETER', 'A thermometer', 'A rain gauge', 'A wind vane'), 'A hygrometer measures humidity.'),
    Q('A learner finds which way the wind blows. Which instrument shows this?', 'A wind vane', w('WE_TEMP_BAROMETER', 'An anemometer', 'A barometer', 'A rain gauge'), 'A wind vane shows wind direction.'),
    Q('A learner says one sunny day tells us the climate of Nairobi. What is wrong?', 'Climate is the pattern over many years', w('WE_WEATHER_CLIMATE', 'Nothing is wrong', 'Climate is today\'s weather', 'Climate is what a person feels'), 'One day gives weather, not climate.'),
    Q('Why are weather instruments kept in a Stevenson screen?', 'To shelter them from rain and direct sun', w('WE_TEMP_BAROMETER', 'To hide them from learners', 'To keep them warm all through the night', 'To let animals use them'), 'The screen protects instruments but lets air flow.'),
    Q('Which is an element of weather?', 'Sunshine', w('WE_WEATHER_CLIMATE', 'Soil type', 'Rock type', 'River length'), 'Sunshine is an element of weather.'),
  ], { h: ['Match each element to its instrument.', 'Weather is short term. Climate is long term.'], s1: 'Match the element to its instrument.' })),

  // ---------------------------------------------------------------- WE_SIGNIFICANCE
  fam('we.si.which', `${WE}WE_SIGNIFICANCE`, 'direct', 1, choose([
    Q('During lightning, where is it safe to be?', 'Inside a building', w('WE_RIVER_CROSS', 'Under a tall tree', 'In an open field', 'Next to a metal pole'), 'Go indoors in lightning. Tall trees and open fields are dangerous.'),
    Q('Why do farmers listen to the weather forecast?', 'To plan planting and harvest', w('WE_FORECAST_USELESS', 'Because forecasts are useless', 'To decide what to eat', 'To count the days'), 'Forecasts help farmers plan.'),
    Q('A river is flooded. What should you do?', 'Stay away from the water and wait', w('WE_RIVER_CROSS', 'Cross it quickly', 'Swim across', 'Let the children play in the water'), 'Never cross a flooded river.'),
    Q('How does heavy rain affect transport?', 'Roads may flood and become unsafe', w('WE_FORECAST_USELESS', 'Roads become faster', 'Roads become much shorter in the rain', 'Nothing changes'), 'Floods can damage roads.'),
    Q('Which clothing suits a very hot day?', 'Light clothes and a hat', w('WE_RIVER_CROSS', 'A thick coat', 'A raincoat only', 'A woolly cap'), 'Light clothing keeps a person cool.'),
  ], { h: ['Choose the safe action.', 'Forecasts help us plan.'], s1: 'Choose the safe action.' })),
  fam('we.si.story', `${WE}WE_SIGNIFICANCE`, 'word', 2, choose([
    Q('A storm is coming with lightning. Wanjiru is playing football outside. What should she do?', 'Go into a building at once', w('WE_RIVER_CROSS', 'Shelter under a big tree', 'Keep playing in the open', 'Stand in the middle of the field'), 'Lightning strikes tall things and open places.'),
    Q('The forecast says heavy rain next week. What should a farmer do about drying harvested maize?', 'Dry and store it before the rain', w('WE_FORECAST_USELESS', 'Leave it out in the open field', 'Ignore the forecast', 'Spread it on the road'), 'The forecast lets the farmer protect the crop.'),
    Q('A learner says forecasts are useless because they are sometimes wrong. What is a better reply?', 'They still help people to plan', w('WE_FORECAST_USELESS', 'You are right, ignore them', 'They are always right', 'They are only for pilots'), 'Forecasts are useful, though not perfect.'),
    Q('Why do builders check the weather before pouring concrete?', 'Heavy rain can spoil fresh concrete', w('WE_FORECAST_USELESS', 'Rain makes concrete dry faster', 'The weather does not matter', 'Rain makes workers faster'), 'Weather affects building work.'),
    Q('A boy wants to cross a flooded river to reach school. What should he do?', 'Wait or find another safe route', w('WE_RIVER_CROSS', 'Cross it at once', 'Swim across it', 'Dare his friends to cross'), 'Floods are dangerous.'),
  ], { h: ['Choose the safe action.', 'Weather affects farming, travel and safety.'], s1: 'Think of safety and planning.' })),

  // ---------------------------------------------------------------- FW_METHODS
  fam('fw.me.which', `${FW}FW_METHODS`, 'direct', 1, choose([
    Q('Counting the number of vehicles that pass a gate is which method?', 'Observation', w('FW_QUESTION_OBS', 'Interview', 'Questionnaire', 'Focus group discussion'), 'Watching and counting is observation.'),
    Q('Which method best finds out what drivers think of the road?', 'An interview or questionnaire', w('FW_OPINION_OBS', 'Observation of the road only', 'Counting only', 'Measuring only'), 'Opinions must be asked for.'),
    Q('What is a questionnaire?', 'A set of written questions for many people', w('FW_QUESTION_OBS', 'A single spoken question to a person', 'A map', 'A photograph'), 'A questionnaire uses written questions.'),
    Q('What is a focus group discussion?', 'A small group talks about a topic with a leader', w('FW_QUESTION_OBS', 'One person counts cars', 'A person fills in a long form on their own', 'A teacher gives notes'), 'A small group discusses the topic together.'),
    Q('Which tool measures the width of a road?', 'A tape measure', w('FW_OPINION_OBS', 'A questionnaire', 'A focus group', 'An interview'), 'Measuring uses tools.'),
  ], { h: ['Watching is observation. Asking is an interview or a questionnaire.', 'Opinions must be asked for.'], s1: 'Ask: do we watch or do we ask?' })),
  fam('fw.me.story', `${FW}FW_METHODS`, 'word', 2, choose([
    Q('A class wants to know how many boda boda riders wear helmets at the stage. Which method is best?', 'Observation and counting', w('FW_QUESTION_OBS', 'An interview with one rider', 'A focus group in class', 'A questionnaire at home'), 'Counting what we see is observation.'),
    Q('A class wants to know why drivers ignore a speed limit. Which method is best?', 'Interviews with drivers', w('FW_OPINION_OBS', 'Counting cars only', 'Measuring the road', 'Looking at a map'), 'Reasons must be asked for.'),
    Q('A class wants the views of 100 parents quickly. Which method is best?', 'A questionnaire', w('FW_QUESTION_OBS', 'One long interview', 'Observation of the road only', 'A photograph'), 'A questionnaire reaches many people quickly.'),
    Q('A teacher gathers 8 learners to talk about road safety. Which method is this?', 'A focus group discussion', w('FW_QUESTION_OBS', 'Observation', 'A questionnaire', 'Measuring'), 'A small group discusses together.'),
    Q('Which is a question for an interview?', 'What makes this junction dangerous?', w('FW_OPINION_OBS', 'How many cars pass in an hour?', 'How wide is the road?', 'Which way does the road run?'), 'Interviews ask people for their views.'),
  ], { h: ['Decide: counting, asking one person, asking many, or a group?', 'Choose the method that fits the task.'], s1: 'Pick the method that fits the task.' })),

  // ---------------------------------------------------------------- FW_CHALLENGES
  fam('fw.ch.which', `${FW}FW_CHALLENGES`, 'direct', 1, choose([
    Q('What is the safe way to study a busy road?', 'Stay on the verge with a teacher', w('FW_IGNORE_RISK', 'Stand in the middle of the road', 'Cross without looking', 'Run between the cars'), 'Safety comes first.'),
    Q('What should you do before interviewing a shop owner?', 'Greet, explain and ask permission', w('FW_NO_PERMISSION', 'Start asking questions at once', 'Take photographs without asking', 'Walk away'), 'Greeting and permission show respect.'),
    Q('Bad weather may stop fieldwork. What is a good solution?', 'Check the forecast and plan a spare day', w('FW_IGNORE_RISK', 'Go out in the storm', 'Ignore the rain', 'Cancel for ever'), 'Planning for weather helps.'),
    Q('A respondent refuses to answer. What should you do?', 'Thank them politely and ask another person', w('FW_NO_PERMISSION', 'Argue with them', 'Insist until they answer', 'Write their answer for them yourself'), 'Respect people\'s choice.'),
    Q('Learners get lost on a field trip. What would have helped?', 'A map and a guide', w('FW_IGNORE_RISK', 'No plan at all', 'More noise', 'Fewer teachers'), 'A map and a guide help.'),
  ], { h: ['Choose the safe and respectful action.', 'Plan for safety, permission and weather.'], s1: 'Choose the safe and respectful action.' })),
  fam('fw.ch.story', `${FW}FW_CHALLENGES`, 'word', 2, choose([
    Q('A class studies a busy junction. Where should the learners stand?', 'At a safe place away from the road', w('FW_IGNORE_RISK', 'On the road to see better', 'In the middle of the junction', 'Between moving vehicles'), 'Stay safe, away from traffic.'),
    Q('Njeri wants to photograph a market trader. What should she do first?', 'Ask the trader for permission', w('FW_NO_PERMISSION', 'Take the photo secretly', 'Take the photo and run', 'Post it online at once'), 'Always ask permission.'),
    Q('The class has little money for transport. What can they do?', 'Choose a place near the school', w('FW_IGNORE_RISK', 'Skip the fieldwork', 'Choose a far place', 'Borrow money from strangers'), 'A nearby site saves cost.'),
    Q('A group runs short of time. What is a good plan?', 'Make a timetable and share the tasks', w('FW_IGNORE_RISK', 'Hurry without a plan', 'Stop the study', 'Leave only one person to do all of it'), 'A timetable helps with time.'),
    Q('People are unwilling to answer a questionnaire. What helps?', 'Explain the purpose politely', w('FW_NO_PERMISSION', 'Demand that they answer', 'Leave the forms on the road', 'Fill the forms yourself'), 'Explaining builds trust.'),
  ], { h: ['Choose the safe, polite and planned action.', 'Safety, permission, time and cost.'], s1: 'Pick the safe and polite action.' })),

  // ---------------------------------------------------------------- FW_ANALYSIS
  fam('fw.an.mean', `${FW}FW_ANALYSIS`, 'direct', 1, choose(meanCases, { h: ['Add all the numbers, then divide by how many there are.', 'The mean is the total divided by the count.'], s1: 'Add the numbers, then divide by 5.' })),
  fam('fw.an.median', `${FW}FW_ANALYSIS`, 'word', 2, choose(medianCases, { h: ['Put the numbers in order first.', 'The median is the middle number.'], s1: 'Put the numbers in order, then take the middle one.' })),
  fam('fw.an.mode', `${FW}FW_ANALYSIS`, 'direct', 1, choose([
    ...modeCases,
    Q('Which graph best shows how many learners walk, cycle or take a bus to school?', 'A bar graph', w('FW_MODE_MEAN', 'A map', 'A diary', 'A calendar'), 'A bar graph compares groups.'),
    Q('Which is the best way to show parts of a whole, such as how learners get to school?', 'A pie chart', w('FW_MODE_MEAN', 'A key', 'A map scale', 'A compass'), 'A pie chart shows parts of a whole.'),
  ], { h: ['The mode is the number that occurs most often.', 'Count how many times each number appears.'], s1: 'Count how many times each number appears.' })),
];
