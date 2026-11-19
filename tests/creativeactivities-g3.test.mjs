// Creative Activities Grade 3 against the curriculum map HOREB owns (curriculum/creative_activities/g3.json), built on 19 Nov 2026
// from the KICD Grade 3 outcomes to the Grade 5 Maths standard: two or more prerequisites per skill reaching Grade 2 (and Grade 2-3
// Maths and Environmental Activities), four misconceptions per skill, a teaching pack for every sub-strand, practical outcomes
// marked by the teacher with the KICD rubric. No question families exist yet, so there is no subject entry and every skill is
// listed as having none.
import { creativeArtsDepthTests } from './helpers/creativeArtsDepth.mjs';

const NO_FAMILIES = ["CREA.G3.CREATI.PUSHING_AND_PULLING.PUSH_PULL","CREA.G3.CREATI.DRAWING_AND_PAINTING.COLOUR_MIXING","CREA.G3.CREATI.DRAWING_AND_PAINTING.SHAPES_PICTURE","CREA.G3.CREATI.RHYTHM_AND_PATTERN_MAKIN.SOUND_DURATION","CREA.G3.CREATI.RHYTHM_AND_PATTERN_MAKIN.RANDOM_REPEAT","CREA.G3.CREATI.SKIPPING.SKIP_DIRECTIONS","CREA.G3.CREATI.COLLAGE.COLLAGE","CREA.G3.CREATI.MELODY.MELODY_VARIATION","CREA.G3.CREATI.MELODY.PERF_DIRECTIONS","CREA.G3.CREATI.WEAVING.PAPER_WEAVE","CREA.G3.PERFOR.ROUNDS.ROUND","CREA.G3.PERFOR.GALLOPING.GALLOP","CREA.G3.PERFOR.SCULPTURE_TOY_ASSEMBLAGE.ASSEMBLAGE","CREA.G3.PERFOR.FORWARD_ROLL_AND_V_BALAN.ROLL_BALANCE","CREA.G3.PERFOR.STRING_MUSICAL_INSTRUMEN.STRING_INSTR","CREA.G3.PERFOR.MODELLING_AND_ORNAMENT_M.BEADS","CREA.G3.APPREC.THE_KENYA_NATIONAL_ANTHE.ANTHEM_TEXT","CREA.G3.APPREC.THE_KENYA_NATIONAL_ANTHE.ANTHEM_OCCASIONS","CREA.G3.APPREC.WATER_SAFETY_AWARENESS.WATER_DANGERS","CREA.G3.APPREC.WATER_SAFETY_AWARENESS.WATER_SAFETY"];

creativeArtsDepthTests({ grade: 3, outcomes: 61, dir: 'creative_activities', subject: 'creativeactivities', families: false, noFamilies: NO_FAMILIES });
