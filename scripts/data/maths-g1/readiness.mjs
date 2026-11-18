// Pre-primary (PP2) readiness skills that Grade 1 builds on (18 Nov 2026). KICD's PP2 Mathematical Activities design is not in this
// repository, so HOREB names these itself from what a child is expected to bring from PP2 (classifying, counting and numerals to 10,
// comparing, simple patterns, basic shapes, coins in play, daily routines). They are written to g1.json under `readiness` with codes
// MATH.PP2.READINESS.<code>; prerequisites name them with kind 'skill' (the table allows only 'skill' and 'outcome', and has no
// foreign key on requires_code). A teacher is to confirm them against the PP2 design.
export const READINESS = [
  { code: 'COUNT_OBJECTS_10', name: 'Count objects up to 10', what: 'Touches and counts up to 10 real objects one by one, saying one number for each, and says the last number is how many.' },
  { code: 'NUMERALS_1_10', name: 'Recognise numerals 1 to 10', what: 'Names and points to the numerals 1 to 10 and matches each to a group of that many objects.' },
  { code: 'SORT_ONE_ATTRIBUTE', name: 'Sort objects by one attribute', what: 'Puts objects into groups by one attribute at a time: colour, size or kind.' },
  { code: 'COMPARE_MORE_LESS', name: 'Compare two groups: more, less, the same', what: 'Says which of two small groups has more or fewer objects, by matching one to one or by counting.' },
  { code: 'SIZE_WORDS', name: 'Use size words', what: 'Uses big and small, long and short, tall and short, heavy and light, full and empty correctly about real objects.' },
  { code: 'COPY_AB_PATTERN', name: 'Copy and continue a simple pattern', what: 'Copies and continues a two-part pattern of objects or colours (red, blue, red, blue).' },
  { code: 'BASIC_SHAPES', name: 'Name basic shapes', what: 'Names a circle, a square and a triangle in objects and pictures.' },
  { code: 'DAILY_ROUTINE', name: 'Order daily events', what: 'Puts events of the day in order (wake up, go to school, come home, sleep) and uses today, yesterday and tomorrow.' },
  { code: 'PENCIL_LINES', name: 'Draw lines and patterns with a pencil', what: 'Holds a pencil or crayon and draws lines, curves and simple patterns (pre-writing).' },
  { code: 'COINS_IN_PLAY', name: 'Know coins as money in play', what: 'Knows coins are money used to buy things and plays at buying and selling.' },
  { code: 'ADD_ON_OBJECTS', name: 'Put together and take away small groups of objects', what: 'Puts two small groups of objects together or takes some away and counts how many there are now, up to 10.' },
];
