import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'MEASUR.TIME';
export const packNotes = 'Time is taught on a 24-hour day line from midnight to midnight with noon in the middle, a.m. on the left half and p.m. on the right, the 24-hour numbers written under the 12-hour ones. Many Kenyan learners also count hours in Swahili time (from 6 a.m.), so the tutor checks which system a child is using before correcting.';
export const pre = {
  AM_PM_IDENTIFY: [['G5:MEASUR.TIME.READ_SECONDS_DIGITAL', H, 'Reading the hours and minutes on a clock comes before naming the half of the day.']],
  WRITE_AM_PM: [['G5:MEASUR.TIME.READ_SECONDS_ANALOGUE', H, 'Reading a clock face, including quarter to and quarter past.']],
  AM_PM_TO_24H_RELATE: [['G6:MEASUR.TIME.AM_PM_IDENTIFY', E, 'Knowing which half of the day a time is in decides whether 12 hours are added.']],
  CONVERT_12_24: [['G6:MEASUR.TIME.WRITE_AM_PM', E, 'A 24-hour time changed back needs a.m. or p.m. written.']],
};
export const mis = [
  mi('AM_PM_IDENTIFY', 'M_PM_STARTS_IN_EVENING', 'Believes p.m. starts in the evening, so calls afternoon times a.m.', ['Is 3 o\'clock in the afternoon a.m. or p.m.?', 'a.m.', 'p.m.'], 'Links p.m. with darkness and evening, not with "after noon".', 'a.m. for an afternoon time.', 'Draw the day line: everything after 12 noon is p.m., even in daylight.'),
  mi('AM_PM_IDENTIFY', 'M_SWAHILI_HOURS', 'Reads a time said in Swahili time as the same hour in English time.', ['"Saa tatu asubuhi" in English time', '3:00 a.m.', '9:00 a.m.'], 'Swahili time counts the hours from 6 a.m. (saa moja is 7 a.m.); the child uses the number without adding 6.', 'The hour six hours early as an option.', 'Swahili time starts at sunrise: add 6 hours to the Swahili hour (saa tatu = 3 + 6 = 9 o\'clock).'),
  mi('AM_PM_TO_24H_RELATE', 'M_AM_ALSO_PLUS_12', 'Adds 12 to a.m. times as well as p.m. times.', ['9 a.m. in 24-hour time', '21:00', '09:00'], 'Thinks the 24-hour clock always means adding 12.', 'An a.m. time with 12 added.', 'Only hours after noon get 12 added; morning hours stay the same.'),
  mi('AM_PM_TO_24H_RELATE', 'M_MINUTES_CHANGED_TOO', 'Adds 12 to the minutes as well as the hours.', ['3:20 p.m. in 24-hour time', '15:32', '15:20'], 'Adds 12 to every number in the time.', 'A time with the minutes changed.', 'The minutes never change: only the hour gets 12 added.'),
  mi('CONVERT_12_24', 'M_PM_ON_24H', 'Writes a 24-hour time with p.m. instead of taking 12 away.', ['18:30 in 12-hour time', '18:30 p.m.', '6:30 p.m.'], 'Adds p.m. without changing the hour.', 'The 24-hour number with p.m. as an option.', 'On a 12-hour clock no hour is more than 12: take 12 away, then write p.m.'),
  mi('CONVERT_12_24', 'M_SUBTRACT_TEN', 'Takes 10 away from a 24-hour hour to get the 12-hour time.', ['16:00 in 12-hour time', '6:00 p.m.', '4:00 p.m.'], 'Drops the first digit of the hour.', 'A time two hours late as an option.', 'Take away 12, not 10: 16 - 12 = 4.'),
  mi('TRAVEL_TIMETABLE', 'M_HOURS_ONLY', 'Takes the hours away and ignores the minutes.', ['A bus leaves at 08:40 and arrives at 11:15. How long is the journey?', '3 hours', '2 h 35 min'], 'Looks only at the hour numbers.', 'A whole number of hours as an option.', 'Count on: 08:40 to 09:00 is 20 min, 09:00 to 11:00 is 2 h, 11:00 to 11:15 is 15 min.'),
  mi('TRAVEL_TIMETABLE', 'M_OVERNIGHT_SUBTRACTED', 'For an overnight journey takes the arrival time from the departure time.', ['A bus leaves at 21:30 and arrives at 05:00 the next day. How long is the journey?', '16 h 30 min (21:30 - 05:00)', '7 h 30 min'], 'Subtracts the smaller time from the larger.', 'The other part of the day as an option.', 'Count on to midnight (2 h 30 min), then from midnight to 05:00 (5 h).'),
];
export const pack = {
  AM_PM_IDENTIFY: pk({
    key_step: 'The child places the event on a day line from midnight to midnight and says a.m. for before noon and p.m. for after noon.',
    floor: ['Reads the time on a clock.', 'What time does the clock show when the short hand is on 3 and the long hand on 12?', '3 o\'clock'],
    reps: ['a day line from midnight to midnight with noon in the middle', 'events of a school day placed on the line', 'Swahili time written under English time'],
    steps: ['Put midnight at the start and noon in the middle of the line.', 'Place the event on the line.', 'Before noon is a.m., after noon is p.m.', 'If the time is in Swahili time, add 6 hours first.'],
    contexts: ['morning assembly', 'the evening news', 'a night watchman\'s shift'],
    board: [['draw', 'Draw a day line: midnight, 6, noon, 6, midnight.'], ['write', 'Write a.m. on the left half and p.m. on the right half.'], ['point', 'Point at the afternoon part of the line.', 'Where does 3 o\'clock in the afternoon go?'], ['pause', 'Wait for the child to place it.'], ['predict', 'Ask whether it is a.m. or p.m.']],
    mis: {
      M_NOON_IS_AM: [['12:30 is a.m.', 'still morning'], 'Is 12:30 before or after noon?', 'Half an hour after noon is p.m.'],
      M_NIGHT_IS_PM: [['2 at night is p.m.', 'night is p.m.'], 'Is 2 in the night before or after midnight?', 'From midnight to noon is a.m.'],
      M_PM_STARTS_IN_EVENING: [['afternoon is a.m.', 'p.m. is evening'], 'Is 3 o\'clock before or after noon?', 'Everything after noon is p.m.'],
      M_SWAHILI_HOURS: [['saa tatu is 3', '3 a.m.'], 'In Swahili time, when is saa moja?', 'Swahili time starts at 6 a.m.: saa tatu asubuhi is 9 a.m.'],
    },
    checks: [P('Is morning assembly at 8 o\'clock a.m. or p.m.?', 'a.m.', 'before noon'), P('Is 12:30 in the afternoon a.m. or p.m.?', 'p.m.', 'just after noon')],
  }),
  WRITE_AM_PM: pk({
    key_step: 'The child writes the hour and minutes from the clock or the words and adds a.m. or p.m. from where the time is on the day line.',
    floor: ['Identifies a.m. and p.m.', 'Is supper time a.m. or p.m.?', 'p.m.'],
    reps: ['a clock face with "quarter to" and "quarter past" marked', 'the day line', 'times written in a diary'],
    steps: ['Read the hours and minutes; quarter to is 15 minutes before the hour.', 'Write hours:minutes.', 'Decide a.m. or p.m. from the day line.', '12 at night is 12 a.m.; 12 in the day is 12 noon.'],
    contexts: ['a school timetable', 'a church service', 'a radio programme'],
    board: [['draw', 'Draw a clock showing quarter to 6.'], ['point', 'Point at the long hand.', 'How many minutes before 6 o\'clock is this?'], ['pause', 'Wait for 15.'], ['write', 'Write 5:45.'], ['predict', 'Ask whether it is a.m. or p.m. if it is in the evening.']],
    mis: {
      M_TWELVE_AT_NIGHT: [['12:15 p.m.', 'night is p.m.'], 'Is 12:15 at night just after midnight or just after noon?', 'Just after midnight is a.m.'],
      M_AM_PM_LEFT_OUT: [['4:00', 'no a.m.'], 'How would someone know it is not 4 in the morning?', 'Write a.m. or p.m. every time.'],
      M_QUARTER_TO_WRONG_HOUR: [['6:45'], 'Is quarter to 6 before or after 6 o\'clock?', 'Quarter to 6 is 15 minutes before 6: 5:45.'],
      M_EVENING_WITH_AM: [['7:30 a.m.'], 'Is supper in the morning?', 'Evening times are p.m.'],
    },
    checks: [P('Write quarter to 6 in the evening.', '5:45 p.m.', 'quarter to'), P('Write 12:15 at night.', '12:15 a.m.', 'just after midnight')],
  }),
  AM_PM_TO_24H_RELATE: pk({
    key_step: 'The child shows on the day line that the hours after noon carry on 13, 14, 15 ... so a p.m. hour is 12 more, and a.m. hours stay the same.',
    floor: ['Writes times with a.m. and p.m.', 'Write 3 o\'clock in the afternoon.', '3:00 p.m.'],
    reps: ['the day line with 0 to 24 written under the 12-hour times', 'a phone clock in 24-hour mode', 'a table of 12-hour and 24-hour times'],
    steps: ['Find the time on the day line.', 'Morning hours keep their number (two digits).', 'Afternoon and evening hours: add 12.', 'Leave the minutes alone.'],
    contexts: ['a bus ticket', 'a phone alarm', 'a hospital visiting time'],
    board: [['draw', 'Draw the day line with 0 to 24 under it.'], ['point', 'Point at 3 p.m.', 'Which number is under 3 p.m.?'], ['pause', 'Wait for 15.'], ['child_draws', 'Ask the child to write the 24-hour numbers for 1 p.m. to 6 p.m.'], ['predict', 'Ask what 9 a.m. is in 24-hour time.']],
    mis: {
      M_ADD_TEN: [['13:00', 'add ten'], 'How many hours from noon to 3 p.m., and what is 12 + 3?', 'Add 12: 15:00.'],
      M_SAME_NUMBER: [['05:00', 'same'], 'Is 05:00 in the morning or the evening?', 'After noon, add 12: 17:00.'],
      M_AM_ALSO_PLUS_12: [['21:00', 'add twelve'], 'Is 9 a.m. before or after noon?', 'Morning times stay the same: 09:00.'],
      M_MINUTES_CHANGED_TOO: [['15:32', 'twelve on the minutes'], 'Do the minutes change between the two clocks?', 'Only the hour changes: 15:20.'],
    },
    checks: [P('Write 3 p.m. in 24-hour time.', '15:00', 'add 12'), P('Write 9 a.m. in 24-hour time.', '09:00', 'morning stays')],
  }),
  CONVERT_12_24: pk({
    key_step: 'The child adds 12 to the hour for p.m. times after 12 noon and takes 12 away for 24-hour hours after 12, with 12 noon as 12:00 and midnight as 00:00.',
    floor: ['Relates p.m. hours to the 24-hour clock.', 'What is 5 p.m. in 24-hour time?', '17:00'],
    reps: ['the day line with both systems', 'a table of conversions', 'a bus or train timetable'],
    steps: ['12-hour to 24-hour: p.m. after 12 noon, add 12; a.m. keep (12 a.m. is 00).', '24-hour to 12-hour: hours over 12, take 12 away and write p.m.', 'Hours under 12: write a.m.; 12 is noon.', 'Keep the minutes.'],
    contexts: ['the SGR train timetable', 'a long-distance bus ticket', 'a flight time'],
    board: [['write', 'Write 18:30.'], ['point', 'Point at the 18.', 'Is 18 more than 12?'], ['pause', 'Wait for yes.'], ['child_draws', 'Ask the child to take 12 away from the hour.'], ['reveal', 'Write 6:30 p.m.']],
    mis: {
      M_ADD_12_TO_NOON: [['24:00', 'add twelve'], 'Is noon in the middle of the day or at the end?', '12 noon is 12:00.'],
      M_MIDNIGHT_AS_12: [['12:00', '24:00 at the start'], 'Where does a new day start on the line?', 'Midnight at the start of a day is 00:00.'],
      M_PM_ON_24H: [['18:30 p.m.'], 'Does a 12-hour clock show 18?', 'Take 12 away: 6:30 p.m.'],
      M_SUBTRACT_TEN: [['6 p.m.', 'drop the one'], 'Is 16 - 10 the right step?', 'Take away 12: 16 - 12 = 4 p.m.'],
    },
    checks: [P('Write 7:45 p.m. in 24-hour time.', '19:45', 'add 12'), P('Write 16:20 in 12-hour time.', '4:20 p.m.', 'take away 12')],
  }),
  TRAVEL_TIMETABLE: pk({
    key_step: 'The child reads the departure and arrival times from the same row and counts on from departure to arrival in steps (to the next hour, whole hours, the minutes left).',
    floor: ['Adds and subtracts hours and minutes.', 'What is 2 h 40 min + 20 min?', '3 h'],
    reps: ['a printed timetable with rows for each bus', 'a time line counting on in jumps', 'the journey time written in h and min'],
    steps: ['Find the row for the bus and read both times from it.', 'Count on from departure to the next whole hour.', 'Add the whole hours, then the minutes to arrival.', 'For overnight trips, count on to midnight and then from midnight.'],
    contexts: ['a Nairobi to Mombasa bus', 'the SGR timetable', 'a matatu stage'],
    board: [['draw', 'Draw a time line from 10:45 to 12:15.'], ['point', 'Point at 10:45.', 'How long to 11:00?'], ['pause', 'Wait for 15 minutes.'], ['count', 'Count on with the child: 15 min, then 1 h to 12:00, then 15 min.'], ['write', 'Write 1 h 30 min.']],
    mis: {
      M_SUBTRACT_AS_DECIMAL: [['1.70', '70 minutes'], 'How many minutes are in an hour?', 'Count on in hours and minutes: 1 h 30 min.'],
      M_WRONG_ROW_READ: [['the other bus'], 'Which row is our bus on?', 'Read both times from the same row.'],
      M_HOURS_ONLY: [['3 hours', '11 take away 8'], 'Does the bus leave at 08:00 or 08:40?', 'Count the minutes too: 2 h 35 min.'],
      M_OVERNIGHT_SUBTRACTED: [['16 h 30 min'], 'Does the bus travel all day, or through the night?', 'Count on through midnight: 2 h 30 min + 5 h.'],
    },
    checks: [P('A bus leaves at 10:45 and arrives at 12:15. How long is the journey?', '1 h 30 min', 'count on'), P('A bus leaves at 21:30 and arrives at 05:00 the next day. How long is the journey?', '7 h 30 min', 'overnight')],
  }),
};
