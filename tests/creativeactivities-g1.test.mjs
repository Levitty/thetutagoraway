// Creative Activities Grade 1 against the curriculum map HOREB owns (curriculum/creative_activities/g1.json), built on 19 Nov 2026
// from the KICD Grade 1 outcomes to the Grade 5 Maths standard: two or more prerequisites per skill, four misconceptions per skill,
// a teaching pack for every sub-strand, practical outcomes marked by the teacher with the KICD rubric. Below Grade 1 there is no
// HOREB map, so prerequisites name pre-primary readiness skills defined in g1.json under readiness (CREA.PP2.READINESS.*, for a
// teacher to confirm against the PP1-PP2 design) and the Maths ones (MATH.PP2.READINESS.*). No question families exist yet, so
// there is no subject entry and every skill is listed as having none. Grade 2 prerequisites name these skills.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { creativeArtsDepthTests } from './helpers/creativeArtsDepth.mjs';

const NO_FAMILIES = ["CREA.G1.CREATI.JUMPING.JUMP_WAYS","CREA.G1.CREATI.RHYTHM.BEAT","CREA.G1.CREATI.RHYTHM.BODY_PERCUSSION","CREA.G1.CREATI.DRAWING.LINES","CREA.G1.CREATI.STRETCHING.STRETCH","CREA.G1.CREATI.PAINTING_AND_COLOURING.PAINT_TOOLS","CREA.G1.CREATI.PAINTING_AND_COLOURING.PAINT_WAYS","CREA.G1.CREATI.MELODY.MELODIC_SOUNDS","CREA.G1.CREATI.MELODY.LIKE_UNLIKE","CREA.G1.CREATI.MELODY.ECHO","CREA.G1.CREATI.PATTERN_MAKING.LETTER_NUMERAL_PATTERNS","CREA.G1.PERFOR.SINGING_GAMES_KENYAN_STY.KENYAN_GAMES","CREA.G1.PERFOR.THROWING_AND_CATCHING.BALL_MATERIALS","CREA.G1.PERFOR.THROWING_AND_CATCHING.THROW_CATCH","CREA.G1.PERFOR.PAPER_CRAFT.PAPER_ITEMS","CREA.G1.PERFOR.LOG_ROLL_AND_T_BALANCE.ROLL_T","CREA.G1.PERFOR.SONGS.ACTION_SONG","CREA.G1.PERFOR.MODELLING.PINCH","CREA.G1.PERFOR.PERCUSSION_MUSICAL_INSTR.PERCUSSION","CREA.G1.APPREC.MUSICAL_SOUNDS.SOUND_SOURCES","CREA.G1.APPREC.MUSICAL_SOUNDS.MUSIC_ELEMENTS","CREA.G1.APPREC.MUSICAL_SOUNDS.MOOD","CREA.G1.APPREC.WATER_SAFETY_AWARENESS.WATER_HOME","CREA.G1.APPREC.WATER_SAFETY_AWARENESS.WATER_SAFE_HOME"];

creativeArtsDepthTests({ grade: 1, outcomes: 68, dir: 'creative_activities', subject: 'creativeactivities', families: false, noFamilies: NO_FAMILIES });

const g1 = JSON.parse(readFileSync(new URL('../curriculum/creative_activities/g1.json', import.meta.url), 'utf8'));
const g2 = JSON.parse(readFileSync(new URL('../curriculum/creative_activities/g2.json', import.meta.url), 'utf8'));

test('creativeactivities Grade 1: the pre-primary readiness skills are defined, proposed, and each is named by a Grade 1 prerequisite', () => {
  const ready = new Map(g1.readiness.map(r => [r.code, r]));
  assert.ok(ready.size >= 8);
  for (const r of g1.readiness) {
    assert.match(r.code, /^CREA\.PP2\.READINESS\.[A-Z_]+$/);
    assert.equal(r.status, 'proposed');
    assert.ok(r.name && r.what.length > 30, `${r.code}: say what the child can do`);
  }
  const named = new Set(g1.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites.map(p => p.requires))));
  for (const c of ready.keys()) assert.ok(named.has(c), `${c} is defined but no Grade 1 skill needs it`);
  for (const c of named) if (c.startsWith('CREA.PP2.')) assert.ok(ready.has(c), `${c} is named but not defined`);
});

test('creativeactivities Grade 2: prerequisites name Grade 1 skills, never Grade 1 outcomes', () => {
  const skills = new Set(g1.sub_strands.flatMap(s => s.skills.map(k => k.code)));
  const pre = g2.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites)).filter(p => p.requires.startsWith('CREA.G1.'));
  assert.ok(pre.length >= 20);
  for (const p of pre) assert.ok(skills.has(p.requires) && p.kind === 'skill', `${p.requires} is not a Grade 1 skill`);
});
