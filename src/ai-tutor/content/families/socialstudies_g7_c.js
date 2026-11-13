// ============================================================================
// GRADE 7 SOCIAL STUDIES, PART C: historical information, early farming, maps and map work (9 skills).
// Written offline from the KICD design through the curriculum map. Map and time questions are in words or a small described table;
// the time questions are generated from the rule (15 degrees = 1 hour, east is ahead) so every key is computed, never typed.
// Options are about the same length so the right answer is never the longest. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, choose, spot, Q, S, w, C } from './socialstudies_g7_lib.js';

const HI = 'NATURA.HISTORICAL_INFORMATION.', EA = 'NATURA.HISTORICAL_DEVELOPMENT_O.', MM = 'NATURA.MAPS_AND_MAP_WORK.';
const T = (head, rows) => ({ t: { head, rows } });

// ---- time from longitude: computed, never typed
const fmt = (min) => { const m = ((min % 1440) + 1440) % 1440, h = Math.floor(m / 60), mm = m % 60; const h12 = h % 12 === 0 ? 12 : h % 12; return `${h12}:${String(mm).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; };
const BASES = [[6 * 60, '6:00 am'], [9 * 60, '9:00 am'], [12 * 60, '12 noon'], [15 * 60, '3:00 pm']];
const timeCase = (deg, east, base, label) => {
  const shift = (deg / 15) * 60 * (east ? 1 : -1), right = fmt(base[0] + shift);
  const bad = [[fmt(base[0] - shift), 'MM_EAST_BEHIND'], [fmt(base[0] + shift * 1.5), 'MM_DEGREE_HOUR'], [fmt(base[0] + shift / 2), 'MM_DEGREE_HOUR']];
  const wr = bad.filter(([t]) => t !== right).filter((x, i, a) => a.findIndex(y => y[0] === x[0]) === i);
  return Q(`It is ${base[1]} at Greenwich (0 degrees). What is the time at ${label}, ${deg} degrees ${east ? 'east' : 'west'}?`, right, wr.map(([t, c]) => `${t}|${c}`),
    `${deg} degrees is ${deg / 15} hour${deg === 15 ? '' : 's'} (15 degrees make one hour). Places to the ${east ? 'east are ahead, so we add' : 'west are behind, so we subtract'}.`);
};
const EAST = [[30, 'a town in Egypt'], [45, 'a city in Iraq'], [60, 'a town in eastern Iran'], [75, 'a city in India'], [90, 'a city in Bangladesh'], [45, 'a port in Somalia']];
const WEST = [[15, 'a town in Senegal'], [30, 'a ship in the Atlantic'], [45, 'a city in Brazil'], [60, 'an island in the Caribbean'], [75, 'a city on the United States coast'], [30, 'an island in mid-Atlantic']];
const eastCases = EAST.map(([d, l], i) => timeCase(d, true, BASES[i % 4], l));
const westCases = WEST.map(([d, l], i) => timeCase(d, false, BASES[(i + 1) % 4], l));
const DIFF = [[15, 45, 'A', 'B', 2], [30, 60, 'A', 'B', 2], [0, 60, 'A', 'B', 4], [45, 75, 'A', 'B', 2], [15, 90, 'A', 'B', 5]];
const diffCases = DIFF.map(([a, b, A, B, hrs]) => Q(`Town ${A} is at ${a} degrees east and town ${B} is at ${b} degrees east. How many hours is ${B} ahead of ${A}?`, `${hrs} hours`, [`${b - a} hours|MM_DEGREE_HOUR`, `${hrs + 1} hours|MM_DEGREE_HOUR`, `${Math.max(1, hrs - 1)} hours|MM_DEGREE_HOUR`],
  `The difference is ${b - a} degrees. Divide by 15 to get ${hrs} hours.`));

export const FAMILIES = [
  // ---------------------------------------------------------------- HI_SOURCES
  fam('hi.so.which', `${HI}HI_SOURCES`, 'direct', 1, choose([
    Q('Which is a source of history?', 'Oral stories told by elders', w('HI_ONLY_BOOKS', 'Only textbooks', 'Only newspapers', 'Only films'), 'History comes from many sources, including oral stories.'),
    Q('Fossils and old pots dug from the ground are which kind of source?', 'Archaeological', w('HI_ARCH_ORAL', 'Oral', 'Written', 'Audio-visual'), 'Things dug from the ground are archaeological sources.'),
    Q('A song that tells how a clan moved is which kind of source?', 'Oral tradition', w('HI_ARCH_ORAL', 'Archaeological', 'Written record', 'Photograph'), 'Songs and stories are oral sources.'),
    Q('A family tree that lists the names of ancestors is called a...', 'Genealogy', w('HI_ONLY_BOOKS', 'Fossil', 'Treaty', 'Atlas'), 'A genealogy records a line of ancestors.'),
    Q('Which of these is a written source?', 'A letter from the 1950s', w('HI_ARCH_ORAL', 'A clay pot', 'A song', 'A stone tool'), 'A letter is a written record.'),
  ], { h: ['Think of how the evidence was made: spoken, written or dug up.', 'Oral is spoken. Archaeological is dug up.'], s1: 'Ask how the evidence was made.' })),
  fam('hi.so.story', `${HI}HI_SOURCES`, 'word', 2, choose([
    Q('A learner says history comes only from books. What is a better reply?', 'Oral stories and objects are sources too', w('HI_ONLY_BOOKS', 'You are right, only books count', 'Only films give history', 'History has no sources'), 'Many sources tell history.'),
    Q('Archaeologists dig up old tools near a lake. Which source are the tools?', 'An archaeological source', w('HI_ARCH_ORAL', 'An oral source', 'A written source', 'A genealogy'), 'Tools dug from the ground are archaeological.'),
    Q('Grandmother tells how the village was founded. Which source is she?', 'An oral source', w('HI_ARCH_ORAL', 'A written source', 'An archaeological source', 'A photograph'), 'Spoken memories are oral sources.'),
    Q('A museum has a photograph of a 1963 flag-raising. Which source is it?', 'A visual record', w('HI_ONLY_BOOKS', 'An oral story', 'A fossil', 'A genealogy'), 'Photographs are visual records.'),
    Q('Why do historians use more than one source?', 'To check that the story is true and complete', w('HI_ONLY_BOOKS', 'To make the work longer', 'To avoid reading', 'To keep one source secret from the others'), 'Different sources check each other.'),
  ], { h: ['Ask what kind of evidence it is.', 'Spoken, written, dug up or pictured.'], s1: 'Ask what kind of evidence it is.' })),

  // ---------------------------------------------------------------- HI_PRIMARY
  fam('hi.pr.which', `${HI}HI_PRIMARY`, 'direct', 1, choose([
    Q('A diary written by a soldier during a war is which source?', 'Primary', w('HI_PHOTO_SECONDARY', 'Secondary', 'Oral only', 'Not a source'), 'The soldier wrote it at the time.'),
    Q('A textbook written in 2024 about the 1884 Berlin Conference is which source?', 'Secondary', w('HI_NEW_PRIMARY', 'Primary', 'An oral source', 'A fossil'), 'The author was not there, so it is secondary.'),
    Q('Which of these is a primary source?', 'A letter written by a chief in 1900', w('HI_NEW_PRIMARY', 'A history book published last year', 'An encyclopaedia entry', 'A documentary made in 2020'), 'The chief wrote it at the time.'),
    Q('Which of these is a secondary source?', 'A documentary about the independence struggle', w('HI_PHOTO_SECONDARY', 'A diary of an activist from 1960', 'A treaty signed in 1895', 'A photograph taken in 1963'), 'A documentary is made later by people who were not there.'),
    Q('A photograph taken at Uhuru Gardens in 1963 is which source?', 'Primary', w('HI_PHOTO_SECONDARY', 'Secondary', 'Oral', 'Archaeological'), 'It was made at the time.'),
  ], { h: ['Primary means made at the time by someone there.', 'Secondary means written later.'], s1: 'Ask: was the writer there?' })),
  fam('hi.pr.story', `${HI}HI_PRIMARY`, 'word', 2, choose([
    Q('A learner finds a letter that her grandfather wrote in 1963. Which source is it?', 'A primary source', w('HI_PHOTO_SECONDARY', 'A secondary source', 'A fossil', 'A story only'), 'Her grandfather wrote it at the time.'),
    Q('A learner uses a 2023 book to write about the Mau Mau. Which source is the book?', 'A secondary source', w('HI_NEW_PRIMARY', 'A primary source', 'An oral source', 'A fossil'), 'The author was not there.'),
    Q('Which is the best primary source for the day a school opened?', 'The minutes from the opening meeting', w('HI_NEW_PRIMARY', 'A book written fifty years later', 'A website that copies the story', 'A friend\'s guess'), 'Minutes were made at the time.'),
    Q('A learner says an old book is always a primary source. What is wrong?', 'It depends on whether the author was there', w('HI_NEW_PRIMARY', 'Nothing is wrong', 'Old books are never sources', 'All books are primary'), 'Old does not mean primary.'),
    Q('Which is a primary source?', 'A tool used by an early farmer', w('HI_NEW_PRIMARY', 'A modern poster about farming', 'A textbook chapter on farming', 'A film about farmers'), 'The tool was made and used at the time.'),
  ], { h: ['Ask who made the source, and when.', 'Made at the time is primary.'], s1: 'Ask who made it and when.' })),

  // ---------------------------------------------------------------- HI_PRESERVE
  fam('hi.pe.which', `${HI}HI_PRESERVE`, 'direct', 1, choose([
    Q('How has oral history been kept?', 'In songs and stories, and now by recording', w('HI_ORAL_LOST', 'It cannot be kept at all', 'Only in a museum case', 'Only on paper'), 'Songs, proverbs and stories keep it, and recording helps.'),
    Q('How are old objects best preserved?', 'In museums and archives', w('HI_KEEP_OUTSIDE', 'Left out in the open', 'Buried in a shamba', 'Kept in wet places'), 'Museums protect objects from damage.'),
    Q('Which body looks after historical sites in Kenya?', 'The National Museums of Kenya', w('HI_KEEP_OUTSIDE', 'The Kenya Revenue Authority', 'The Kenya Meat Commission', 'The Kenya Seed Company'), 'The National Museums of Kenya protects sites and objects.'),
    Q('Why do we record elders on audio or video?', 'So their stories are not lost', w('HI_ORAL_LOST', 'To stop them from speaking', 'To sell their voices', 'To hide the stories'), 'Recording keeps stories for the future.'),
    Q('Which keeps written records safe for a long time?', 'An archive with dry, cool rooms', w('HI_KEEP_OUTSIDE', 'A wet store room beside a river', 'An open field', 'A hot kitchen'), 'Dry, cool places protect paper.'),
  ], { h: ['Think of what keeps each kind of source safe.', 'Oral: songs and recordings. Objects: museums.'], s1: 'Think of the kind of source.' })),
  fam('hi.pe.story', `${HI}HI_PRESERVE`, 'word', 2, choose([
    Q('A learner records her grandfather telling a story on a phone. What is she doing?', 'Preserving oral history', w('HI_ORAL_LOST', 'Losing the story', 'Changing the story', 'Selling the story'), 'Recording keeps oral history safe.'),
    Q('A museum keeps an old tool in a glass case. Why?', 'To protect it and let people study it', w('HI_KEEP_OUTSIDE', 'To hide it from all of the visitors', 'To let it rot', 'To sell it'), 'Cases protect objects.'),
    Q('A village keeps proverbs and teaches them to children. What is this?', 'Passing on oral history', w('HI_ORAL_LOST', 'Losing history', 'Writing history', 'Digging history'), 'Teaching keeps oral history alive.'),
    Q('A group scans old photographs and saves them on a computer. What is this?', 'Digital preservation', w('HI_KEEP_OUTSIDE', 'Throwing them away', 'Burying them', 'Selling them'), 'Digital copies can last and be shared.'),
    Q('Why should old buildings be protected by law?', 'So that future people can learn from them', w('HI_KEEP_OUTSIDE', 'So that nobody can enter them', 'So that they rot quickly', 'So that they are sold'), 'Laws protect heritage sites.'),
  ], { h: ['Which action keeps the evidence for the future?', 'Record, store and protect.'], s1: 'Pick the action that keeps it.' })),

  // ---------------------------------------------------------------- EA_WHERE
  fam('ea.wh.which', `${EA}EA_WHERE`, 'direct', 1, choose([
    Q('Where did early farming begin in Africa?', 'The Nile Valley, the Ethiopian highlands and West Africa', w('EA_EAST_ONLY', 'Only the Nile Valley and the Sahara desert region', 'Only the Sahara', 'Only the Kalahari'), 'Early farming began in several parts of Africa.'),
    Q('Which crops were grown early in the Nile Valley?', 'Wheat and barley', w('EA_EAST_ONLY', 'Tea and coffee', 'Cotton and cocoa', 'Rice and cassava'), 'Wheat, barley and flax were early Nile crops.'),
    Q('Which crop first came from the Ethiopian highlands?', 'Teff', w('EA_EAST_ONLY', 'Wheat', 'Cassava', 'Maize'), 'Teff and coffee come from the Ethiopian highlands.'),
    Q('What helped early farming begin in a place?', 'Fertile soil and reliable water', w('EA_DRY_FARM', 'No water and very poor soil', 'Constant drought', 'Dense forest only'), 'Plants need fertile soil and water.'),
    Q('What does domestication mean?', 'Taming wild plants and animals for use', w('EA_DRY_FARM', 'Hunting wild animals only', 'Cutting down forests for building', 'Moving to towns'), 'Domestication is taming plants and animals.'),
  ], { h: ['Think of where soil and water were good.', 'Nile, Ethiopian highlands, West African savanna.'], s1: 'Think of soil, water and region.' })),
  fam('ea.wh.story', `${EA}EA_WHERE`, 'word', 2, choose([
    Q('A learner says early farming in Africa began only along the Nile. What is a better reply?', 'It began in other places too, such as Ethiopia', w('EA_EAST_ONLY', 'The learner is right about all of this', 'It began in Antarctica', 'It never began anywhere in all of Africa'), 'Farming began in several regions.'),
    Q('Which animal was among those reared early in Africa?', 'Cattle', w('EA_DRY_FARM', 'Llamas', 'Reindeer', 'Yaks'), 'Cattle, sheep and goats were reared early.'),
    Q('Why were river valleys good places for early farming?', 'They had water and fertile soil', w('EA_DRY_FARM', 'They had no water in the valley', 'They had only rock', 'They were always dry'), 'Water and soil made farming possible.'),
    Q('Sorghum and millet were first grown in which region?', 'The West African savanna and the Sahel', w('EA_EAST_ONLY', 'The Nile delta only', 'The Atlas Mountains of the north', 'The Namib Desert'), 'Sorghum and millet came from the savanna.'),
    Q('Which is a result of taming wild animals?', 'People had a steady supply of meat and milk', w('EA_DRY_FARM', 'People had to move to a new place every day', 'Animals disappeared', 'People stopped eating'), 'Domestic animals gave steady food.'),
  ], { h: ['Which region fits the crop or animal?', 'Many regions had early farming.'], s1: 'Match the crop or animal to the region.' }), 'b'),

  // ---------------------------------------------------------------- EA_NILE
  fam('ea.ni.which', `${EA}EA_NILE`, 'direct', 1, choose([
    Q('What did the yearly Nile flood leave behind?', 'Rich silt that made the soil fertile', w('EA_FLOOD_BAD', 'Only damage to farms and to houses', 'Only stones', 'Only salt'), 'The silt fed the crops.'),
    Q('What is irrigation?', 'Carrying water to fields by canals and tools', w('EA_FLOOD_BAD', 'Draining all of the water from the land', 'Cutting down trees', 'Storing grain'), 'Irrigation brings water to crops.'),
    Q('What did a food surplus allow some people to become?', 'Scribes, builders and traders', w('EA_NO_SURPLUS', 'Only farmers', 'Only hunters', 'Only herders'), 'A surplus fed people who did not farm.'),
    Q('Which Egyptian tool lifted water for fields?', 'The shaduf', w('EA_FLOOD_BAD', 'The plough of iron', 'The wheelbarrow', 'The windmill'), 'The shaduf lifted water to the fields.'),
    Q('Which idea grew from Nile Valley farming?', 'Writing and a calendar for record keeping', w('EA_NO_SURPLUS', 'Paper money', 'Printing', 'Steam engines for pumping the Nile water'), 'Records and calendars grew with farming.'),
  ], { h: ['Think of what the flood left and what a surplus allowed.', 'Silt, irrigation, scribes and builders.'], s1: 'Think of the flood and the surplus.' })),
  fam('ea.ni.story', `${EA}EA_NILE`, 'word', 2, choose([
    Q('Egyptian farmers waited for the flood each year. Why?', 'It made their soil rich again', w('EA_FLOOD_BAD', 'It ended all of the farming', 'It brought salt', 'It cleaned the roads'), 'The flood brought silt.'),
    Q('The Egyptians grew more food than they needed. What did this let them do?', 'Support scribes, priests and builders', w('EA_NO_SURPLUS', 'Stop trading', 'Stop making tools for the farmers', 'End the government'), 'A surplus supports specialists.'),
    Q('Why did Egyptians develop a calendar?', 'To know when the Nile would flood', w('EA_NO_SURPLUS', 'To count the stars for fun at night', 'To end the floods', 'To close the markets'), 'The calendar guided planting and harvest.'),
    Q('Why did Egypt need scribes?', 'To record harvests, taxes and the flood', w('EA_NO_SURPLUS', 'To grow wheat', 'To dig the canals for the farmers', 'To carry water'), 'Scribes kept records.'),
    Q('Canals carried Nile water to dry fields. What is this called?', 'Irrigation', w('EA_FLOOD_BAD', 'Drought', 'Erosion', 'Rotation'), 'Irrigation moves water to fields.'),
  ], { h: ['Think of what the flood gave and what a surplus allowed.', 'Silt, canals, calendar, records.'], s1: 'Think of the flood and its results.' })),

  // ---------------------------------------------------------------- MM_AFRICA
  fam('mm.af.which', `${MM}MM_AFRICA`, 'direct', 1, choose([
    Q('Where does Africa rank by size among the continents?', 'The second largest', w('MM_BIGGEST', 'The largest', 'The third largest', 'The smallest'), 'Asia is the largest. Africa is second.'),
    Q('Which line crosses the middle of Africa?', 'The equator', w('MM_EQUATOR_SIDE', 'The Tropic of Cancer only', 'The Arctic Circle', 'The Date Line'), 'The equator crosses Africa near its middle.'),
    Q('Which ocean lies to the west of Africa?', 'The Atlantic Ocean', w('MM_BIGGEST', 'The Indian Ocean', 'The Arctic Ocean', 'The Pacific Ocean'), 'The Atlantic is to the west. The Indian is to the east.'),
    Q('Which sea lies to the north of Africa?', 'The Mediterranean Sea', w('MM_BIGGEST', 'The Red Sea', 'The Black Sea', 'The Caspian Sea'), 'The Mediterranean lies to the north.'),
    Q('About how big is Africa?', 'About 30 million square kilometres', w('MM_BIGGEST', 'About 3 million square kilometres', 'About 300 thousand square kilometres', 'About 3 billion square kilometres'), 'Africa is about 30 million square kilometres.'),
  ], { h: ['Africa is second in size and crossed by the equator.', 'Atlantic west, Indian east.'], s1: 'Think of the continent as a map.' })),
  fam('mm.af.story', `${MM}MM_AFRICA`, 'word', 2, choose([
    Q('A learner says Africa is the largest continent. What is the correct fact?', 'Asia is larger, so Africa is second', w('MM_BIGGEST', 'Africa is the largest', 'Africa is the smallest continent', 'Africa is third'), 'Asia is the largest.'),
    Q('Most of Africa lies between which two lines?', 'The Tropic of Cancer and the Tropic of Capricorn', w('MM_EQUATOR_SIDE', 'The Arctic and Antarctic Circles', 'The two poles', 'The equator and the north and south poles'), 'Most of Africa is in the tropics.'),
    Q('Which country on the equator is in East Africa?', 'Kenya', w('MM_EQUATOR_SIDE', 'Ethiopia', 'Tanzania', 'Egypt'), 'The equator crosses Kenya.'),
    Q('Which sea separates north-east Africa from Arabia?', 'The Red Sea', w('MM_BIGGEST', 'The Mediterranean', 'The Black Sea', 'The Aegean Sea'), 'The Red Sea lies between them.'),
    Q('Africa is wide in the north and narrows towards the south. What does its shape look like?', 'Like a wide top that narrows below', w('MM_BIGGEST', 'Like a perfect circle all round', 'Like a long thin line', 'Like a square'), 'It is wide in the north and narrow in the south.'),
  ], { h: ['Think of the map of Africa.', 'Second in size, crossed by the equator.'], s1: 'Picture the map.' })),

  // ---------------------------------------------------------------- MM_LATLONG
  fam('mm.ll.table', `${MM}MM_LATLONG`, 'table', 1, choose([
    Q('Look at the table. Which town is south of the equator?', 'Nairobi', w('MM_NEGATIVE_HEM', 'Cairo', 'Accra', 'Lagos'), 'Nairobi is at 1 degree south, so it is south of the equator.',
      T(['Town', 'Latitude', 'Longitude'], [['Nairobi', '1 degree S', '37 degrees E'], ['Cairo', '30 degrees N', '31 degrees E'], ['Accra', '6 degrees N', '0 degrees'], ['Lagos', '6 degrees N', '3 degrees E']])),
    Q('Look at the table. Which town is the farthest north?', 'Cairo', w('MM_NEGATIVE_HEM', 'Nairobi', 'Accra', 'Lagos'), 'Cairo, at 30 degrees north, is the farthest north.',
      T(['Town', 'Latitude', 'Longitude'], [['Nairobi', '1 degree S', '37 degrees E'], ['Cairo', '30 degrees N', '31 degrees E'], ['Accra', '6 degrees N', '0 degrees'], ['Lagos', '6 degrees N', '3 degrees E']])),
    Q('Which tells us whether a place is north or south of the equator?', 'Latitude', w('MM_LAT_LON_SWAP', 'Longitude', 'Altitude', 'Scale'), 'Latitude measures north and south of the equator.'),
    Q('Which tells us whether a place is east or west of the Prime Meridian?', 'Longitude', w('MM_LAT_LON_SWAP', 'Latitude', 'Altitude', 'Scale'), 'Longitude measures east and west of the Prime Meridian.'),
    Q('A town is at 5 degrees south. Which hemisphere is it in?', 'The southern hemisphere', w('MM_NEGATIVE_HEM', 'The northern hemisphere', 'The eastern hemisphere only', 'The western hemisphere only'), 'South latitudes are in the southern hemisphere.'),
  ], { h: ['Latitude is north or south. Longitude is east or west.', 'Read the latitude first.'], s1: 'Read latitude, then longitude.' })),
  fam('mm.ll.story', `${MM}MM_LATLONG`, 'word', 2, choose([
    Q('A town is at 6 degrees north and 0 degrees longitude. Which town in the table could it be?', 'Accra', w('MM_LAT_LON_SWAP', 'Cape Town', 'Nairobi', 'Cairo'), 'Accra is at 6 degrees north and almost 0 degrees longitude.',
      T(['Town', 'Position'], [['Accra', '6 degrees N, 0 degrees'], ['Cape Town', '34 degrees S, 18 degrees E'], ['Nairobi', '1 degree S, 37 degrees E'], ['Cairo', '30 degrees N, 31 degrees E']])),
    Q('A learner says latitude lines run from north to south. What is wrong?', 'Latitude lines run east to west', w('MM_LAT_LON_SWAP', 'Nothing is wrong', 'They run in circles round the poles only', 'They run only in Africa'), 'Latitude lines are parallel, running east to west.'),
    Q('Which town is both south of the equator and east of the Prime Meridian?', 'Nairobi', w('MM_NEGATIVE_HEM', 'Cairo', 'Accra', 'Dakar'), 'Nairobi is 1 degree south and 37 degrees east.'),
    Q('A town is at 15 degrees west. Which side of the Prime Meridian is it?', 'West', w('MM_LAT_LON_SWAP', 'East', 'North', 'South'), 'West longitudes lie west of the Prime Meridian.'),
    Q('What is the latitude of the equator?', '0 degrees', w('MM_LAT_LON_SWAP', '90 degrees', '180 degrees', '45 degrees'), 'The equator is 0 degrees latitude.'),
  ], { h: ['Latitude: north or south. Longitude: east or west.', 'Use the equator and the Prime Meridian.'], s1: 'Use the equator and the Prime Meridian.' })),

  // ---------------------------------------------------------------- MM_TIME
  fam('mm.ti.east', `${MM}MM_TIME`, 'word', 2, choose(eastCases, { h: ['15 degrees make one hour.', 'East is ahead, so add.'], s1: 'Divide the degrees by 15, then add for east.' })),
  fam('mm.ti.west', `${MM}MM_TIME`, 'word', 2, choose(westCases, { h: ['15 degrees make one hour.', 'West is behind, so subtract.'], s1: 'Divide the degrees by 15, then subtract for west.' })),
  fam('mm.ti.diff', `${MM}MM_TIME`, 'direct', 1, choose([
    ...diffCases,
    Q('How many degrees of longitude make one hour?', '15 degrees', w('MM_DEGREE_HOUR', '1 degree', '30 degrees', '60 degrees'), 'The earth turns 360 degrees in 24 hours, so 15 degrees make one hour.'),
    Q('How many minutes does one degree of longitude make?', '4 minutes', w('MM_DEGREE_HOUR', '1 minute', '10 minutes', '60 minutes'), 'One hour is 60 minutes for 15 degrees, so 1 degree is 4 minutes.'),
  ], { h: ['15 degrees make one hour.', 'Divide the difference in degrees by 15.'], s1: 'Divide the difference by 15.' })),

  // ---------------------------------------------------------------- MM_FEATURES
  fam('mm.fe.which', `${MM}MM_FEATURES`, 'direct', 1, choose([
    Q('Which is the largest hot desert in Africa?', 'The Sahara', w('MM_SAHARA_COLD', 'The Kalahari', 'The Namib', 'The Danakil'), 'The Sahara in the north is the largest hot desert.'),
    Q('Which is the highest mountain in Africa?', 'Mount Kilimanjaro', w('MM_KENYA_HIGHEST', 'Mount Kenya', 'Mount Elgon', 'Mount Meru'), 'Kilimanjaro is the highest. Mount Kenya is second.'),
    Q('Which is the longest river in Africa?', 'The Nile', w('MM_SAHARA_COLD', 'The Congo', 'The Niger', 'The Zambezi'), 'The Nile is the longest.'),
    Q('Which is the largest lake in Africa?', 'Lake Victoria', w('MM_KENYA_HIGHEST', 'Lake Tanganyika', 'Lake Malawi', 'Lake Turkana'), 'Lake Victoria is the largest and is shared by Kenya, Uganda and Tanzania.'),
    Q('Which direction does the Nile flow?', 'North, into the Mediterranean', w('MM_SAHARA_COLD', 'South, into the Indian Ocean', 'West, into the Atlantic', 'East, into the Red Sea'), 'The Nile flows north to the Mediterranean.'),
  ], { h: ['Think of the biggest, longest and highest features of Africa.', 'Sahara, Nile, Kilimanjaro, Lake Victoria.'], s1: 'Think of the biggest and highest features.' })),
  fam('mm.fe.story', `${MM}MM_FEATURES`, 'word', 2, choose([
    Q('A learner says Mount Kenya is the highest mountain in Africa. What is the correct fact?', 'Kilimanjaro, in Tanzania, is higher', w('MM_KENYA_HIGHEST', 'The learner is right about all of this', 'Mount Elgon is higher', 'Mount Kenya is the lowest'), 'Kilimanjaro in Tanzania is the highest.'),
    Q('Which three countries share Lake Victoria?', 'Kenya, Uganda and Tanzania', w('MM_KENYA_HIGHEST', 'Kenya, Ethiopia and Somalia', 'Uganda, Rwanda and Burundi', 'Tanzania, Zambia and Malawi'), 'Kenya, Uganda and Tanzania share Lake Victoria.'),
    Q('Which desert lies in the south-west of Africa?', 'The Namib', w('MM_SAHARA_COLD', 'The Sahara', 'The Libyan desert', 'The Nubian desert'), 'The Namib and Kalahari lie in the south-west.'),
    Q('Which mountains lie in the north-west of Africa?', 'The Atlas Mountains of the north', w('MM_KENYA_HIGHEST', 'The Drakensberg', 'The Rwenzori', 'The Ethiopian highlands'), 'The Atlas Mountains are in the north-west.'),
    Q('Which great rain forest lies around the Congo River?', 'The Congo Basin forest', w('MM_SAHARA_COLD', 'The Sahel', 'The Kalahari', 'The Serengeti'), 'The Congo Basin holds a great rain forest.'),
  ], { h: ['Check the place of each feature.', 'Atlas north-west, Namib south-west, Congo Basin in the middle.'], s1: 'Place the feature on the map.' })),
];
