// Kiswahili Grade 1 (18 Nov 2026): the file had KICD outcomes only; every skill comes from here. scripts/build-kiswahili-grade.mjs 1.
// Below Grade 1, prerequisites name pre-primary readiness skills HOREB defines here (KISW.PP2.READINESS.*, ref 'PP:<ID>'), as
// Maths Grade 1 does; a teacher should confirm them against the PP2 Language Activities design.
import * as kusiki from './kusiki.mjs';
import * as kusoma from './kusoma.mjs';
import * as kuandi from './kuandi.mjs';
import * as sarufi from './sarufi.mjs';
const parts = [kusiki, kusoma, kuandi, sarufi];
export const NEW = parts.flatMap(x => x.NEW);
export const ADD = parts.flatMap(x => x.ADD);
export const NOTES = {};
export const READINESS = [
  { id: 'HEAR_REPEAT_SOUNDS', name: 'Hear and repeat sounds and short words', what: 'Listens to a sound, a rhyme or a short word said by the teacher and says it back clearly.' },
  { id: 'VOWEL_SOUNDS', name: 'Hear and say the five vowel sounds', what: 'Says a, e, i, o, u as Kiswahili sounds and picks the one heard at the start of a familiar word.' },
  { id: 'NAME_EVERYDAY_THINGS', name: 'Name everyday things and people in Kiswahili', what: 'Names common objects, body parts, family members and foods at home and in class in Kiswahili.' },
  { id: 'GREET_FAMILY', name: 'Greet and answer at home and in class', what: 'Greets a parent, a teacher and a friend and answers a greeting, in Kiswahili or the home language.' },
  { id: 'FOLLOW_ONE_STEP', name: 'Follow a one-step spoken instruction', what: 'Does what a short spoken instruction asks (simama, keti, lete kitabu).' },
  { id: 'PICTURE_TALK', name: 'Talk about a picture and handle a book', what: 'Holds a picture book the right way up, turns pages one at a time and says what is happening in a picture.' },
  { id: 'STORY_WHO_WHAT', name: 'Answer who and what about a story heard', what: 'After listening to a short story, says who was in it and one thing that happened.' },
  { id: 'PENCIL_PATTERNS', name: 'Hold a crayon and draw pre-writing patterns', what: 'Holds a crayon or pencil between thumb and fingers and draws lines, curves and circles from left to right.' },
];
