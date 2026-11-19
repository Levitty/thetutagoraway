// Creative Activities Grade 2 against the curriculum map HOREB owns (curriculum/creative_activities/g2.json), built on 19 Nov 2026
// from the KICD Grade 2 outcomes to the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 1 (and Grade 1-2
// Maths and Environmental Activities), four misconceptions per skill, a teaching pack for every sub-strand, practical outcomes
// marked by the teacher with the KICD rubric. No question families exist yet, so there is no subject entry and every skill is
// listed as having none. Grade 3 prerequisites name these skills.
import { creativeArtsDepthTests } from './helpers/creativeArtsDepth.mjs';

const NO_FAMILIES = ["CREA.G2.CREATI.HOPPING.HOP_DIRECTIONS","CREA.G2.CREATI.DRAWING_AND_PAINTING.TEXTURE","CREA.G2.CREATI.DRAWING_AND_PAINTING.BRUSH_PAINTING","CREA.G2.CREATI.RHYTHM_AND_PATTERN_MAKIN.RHYTHM_WAYS","CREA.G2.CREATI.RHYTHM_AND_PATTERN_MAKIN.WORD_RHYTHM","CREA.G2.CREATI.RHYTHM_AND_PATTERN_MAKIN.SHAPE_PATTERN","CREA.G2.CREATI.TURNING.TURN_DIRECTIONS","CREA.G2.CREATI.MOSAIC.MOSAIC","CREA.G2.CREATI.MELODY.SAME_DIFFERENT","CREA.G2.CREATI.MELODY.NEW_WORDS","CREA.G2.PERFOR.SINGING_GAMES_WESTERN_ST.WESTERN_GAMES","CREA.G2.PERFOR.KICKING.KICK","CREA.G2.PERFOR.PLAITED_ORNAMENT_SINGLE_.PLAIT","CREA.G2.PERFOR.EGG_ROLL_AND_SWAN_BALANC.EGG_ROLL","CREA.G2.PERFOR.EGG_ROLL_AND_SWAN_BALANC.SWAN","CREA.G2.PERFOR.WIND_MUSICAL_INSTRUMENTS.WIND","CREA.G2.PERFOR.MODELLING_COILING_TECHNI.COIL","CREA.G2.PERFOR.SONGS.SONG_MESSAGE","CREA.G2.PERFOR.SONGS.SONG_TECHNIQUES","CREA.G2.APPREC.SINGING_GAMES_WESTERN_ST.GAME_PARTS","CREA.G2.APPREC.SINGING_GAMES_WESTERN_ST.GAME_MESSAGE","CREA.G2.APPREC.WATER_SAFETY_AWARENESS.WATER_POINTS","CREA.G2.APPREC.WATER_SAFETY_AWARENESS.SAFETY_SCHOOL"];

creativeArtsDepthTests({ grade: 2, outcomes: 63, dir: 'creative_activities', subject: 'creativeactivities', families: false, noFamilies: NO_FAMILIES });
