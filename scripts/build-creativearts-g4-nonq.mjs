// Writes docs/qa/creativearts-g4-non-question-outcomes-2026-11-13.md: for each of the 63 outcomes, whether a question can test it and,
// when it cannot (or only the knowledge half), what it needs: the task, the KICD rubric indicator, and the evidence the teacher keeps.
//   node scripts/build-creativearts-g4-nonq.mjs
// Kinds: Q a question can test it; P a practical or product (make, draw, paint, play, perform, swim); O a singing or listening check;
// A an attitude or value. Evidence is the work or its sound, never the child (no face, no name, no video of a child): a photo of the product,
// or an audio clip of the sound with no voice reading names, kept by the teacher; or the teacher's four-level mark on the Record of work.
import { readFileSync, writeFileSync } from 'node:fs';
const g4 = JSON.parse(readFileSync(new URL('../curriculum/creative_arts/g4.json', import.meta.url), 'utf8'));
const P = 'CREA.G4.';
const KIND = {
  'CREATI.PERCUSSION_MUSICAL_INSTR': { a: 'Q', b: 'Q', c: 'Q', d: 'P', e: 'P', f: 'P', g: 'A' },
  'CREATI.NETBALL': { a: 'Q', b: 'P', c: 'P', d: 'A' },
  'CREATI.PAINTING_AND_MONTAGE': { a: 'Q', b: 'P', c: 'P', d: 'A' },
  'CREATI.RHYTHM': { a: 'Q', b: 'P', c: 'Q', d: 'P', e: 'A' },
  'CREATI.MELODY': { a: 'Q', b: 'Q', c: 'Q', d: 'P', e: 'P', f: 'A' },
  'PERFOR.ATHLETICS': { a: 'Q', b: 'P', c: 'P', d: 'A' },
  'PERFOR.GYMNASTICS': { a: 'Q', b: 'P', c: 'P', d: 'A' },
  'PERFOR.SONGS': { a: 'O', b: 'O', c: 'Q', d: 'O', e: 'A' },
  'PERFOR.PHOTOGRAPHY': { a: 'Q', b: 'Q', c: 'P', d: 'A' },
  'PERFOR.DESCANT_RECORDER': { a: 'Q', b: 'Q', c: 'P', d: 'P', e: 'A' },
  'PERFOR.SWIMMING': { a_: 'Q', b_: 'P', c_: 'P', d_: 'P', e: 'A', a_2: 'Q', b_2: 'P', c_2: 'P', d_2: 'A' },
  'APPREC.ANALYSIS_OF_CREATIVE_ART': { a: 'Q', b: 'P', c: 'Q', d: 'Q', e: 'P', f: 'A' },
};
// What the teacher does for a practical or listening outcome: [task, evidence].
const TASK = {
  'PERCUSSION_MUSICAL_INSTR.d': ['Each learner improvises a four-beat rhythmic pattern on an indigenous percussion instrument to accompany a song; the teacher scores accuracy of beat, steadiness and use of a pattern against the indicator.', 'Audio clip of the sound only (no voices, no names), kept by the teacher; or the teacher\'s four-level mark.'],
  'PERCUSSION_MUSICAL_INSTR.e': ['Make two charcoal sticks (cut, trim, burn with an adult, cool); the teacher checks the steps, the safety and the finish of the sticks.', 'Photo of the sticks beside the learner\'s step card.'],
  'PERCUSSION_MUSICAL_INSTR.f': ['Draw one percussion instrument with charcoal and smudge it to make light and dark areas; the teacher scores tonal range, outline and neatness.', 'Photo of the drawing.'],
  'NETBALL.b': ['Make a ball by the overhand knot (macramé) round a soft core; the teacher checks the knots, the firmness and the safe core.', 'Photo of the ball.'],
  'NETBALL.c': ['Pass (chest and overhead) and catch (double-handed) in pairs and in a mini game; the teacher watches the hands, the eyes and the aim.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'PAINTING_AND_MONTAGE.b': ['Paint one object with a value scale strip, light to dark, by adding white and black; the teacher checks the steps of the scale and the use of value in the object.', 'Photo of the strip and the painting.'],
  'PAINTING_AND_MONTAGE.c': ['Make a montage on ball games by overlapping cut-out pictures; the teacher scores theme, overlap and neatness.', 'Photo of the montage.'],
  'RHYTHM.b': ['Write taa and ta-te in free hand lettering with ascenders and descenders on a ruled line; the teacher checks the letter heights and spacing.', 'Photo of the lettering.'],
  'RHYTHM.d': ['Compose a four-beat rhythmic pattern with a crotchet, a pair of quavers and their rests, with variation, repetition and a long ending; the teacher scores the pattern and its notation.', 'Photo of the written pattern; audio of the sound only.'],
  'MELODY.d': ['Create a short melody with d, r and m (stepwise, varied, ending on d) and sing or play it; the teacher scores the three qualities.', 'Photo of the written melody; audio of the sound only.'],
  'MELODY.e': ['Model the letters d, r and m from coils and attach them to three slabs of different sizes; the teacher checks the slab sizes, the coils and the joins.', 'Photo of the modelled slabs.'],
  'ATHLETICS.b': ['Perform the medium and the elongated start and a short sprint with good technique; the teacher watches the commands, the start position and the arm and leg action.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'ATHLETICS.c': ['Sketch and paint the Kenyan flag in the right order and neatly, then fix it to a handle; the teacher checks the colours, the order and the finish.', 'Photo of the flag.'],
  'GYMNASTICS.b': ['Perform a crab balance held for a count of three; the teacher watches the hip lift, the tummy facing up and the hold.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'GYMNASTICS.c': ['Perform a side roll along a mat with a straight body; the teacher watches the straightness and the control.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'SONGS.a': ['Sing a sacred, a patriotic and a topical song with good pitch, rhythm, tempo, dynamics and diction; the teacher scores each against the indicator. HOREB cannot hear the child.', 'The teacher\'s four-level mark; an audio clip of the group only, if the school wishes.'],
  'SONGS.b': ['Sing the East African Community anthem in unison, standing still, with the right words and respect; the teacher scores.', 'The teacher\'s four-level mark.'],
  'SONGS.d': ['Take a role (soloist, singer or instrumentalist) in an indigenous Kenyan folk song with the right performance techniques; the teacher scores.', 'The teacher\'s four-level mark; an audio clip of the group only, if the school wishes.'],
  'PHOTOGRAPHY.c': ['Take two photographs with a school device, one of an object and one of a place, with good light and a clear centre of interest, asking permission first for any person; the teacher selects the better one for the portfolio.', 'The selected photograph (not of a child), kept by the teacher.'],
  'DESCANT_RECORDER.c': ['Play the notes B, A and G with the right posture, fingering and blowing; the teacher scores each note.', 'Audio of the sound only; or the teacher\'s four-level mark.'],
  'DESCANT_RECORDER.d': ['Play a simple melody on B, A and G with accuracy in pitch and rhythm; the teacher scores.', 'Audio of the sound only; or the teacher\'s four-level mark.'],
  'SWIMMING.b_': ['Take part in water games safely with a teacher or lifeguard present; the teacher notes safe behaviour and participation.', 'Teacher observation note. No photo or video of children.'],
  'SWIMMING.c_': ['Float (mushroom, back and front) in shallow water with a teacher; the teacher scores the position and calm.', 'Teacher observation mark. No photo or video of children.'],
  'SWIMMING.d_': ['Glide from the wall with arms stretched ahead and a straight body; the teacher scores.', 'Teacher observation mark. No photo or video of children.'],
  'SWIMMING.b_2': ['Perform three indigenous animal games (frog jump, crab walk, bird hop) with safe form; the teacher scores.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'SWIMMING.c_2': ['Perform an animal game to a steady drum rhythm; the teacher scores keeping to the rhythm.', 'Lesson observation mark on the Record of work. No recording of children.'],
  'ANALYSIS_OF_CREATIVE_ART.b': ['Make and decorate a portfolio from local materials and present three labelled works in it; the teacher scores the choice of work, the labelling and the care.', 'Photo of the portfolio (closed and open, without any child in the picture).'],
  'ANALYSIS_OF_CREATIVE_ART.e': ['Take part in netball, athletics, gymnastics, swimming or animal games for fun and in class or school matches, showing teamwork and safety; the teacher notes participation.', 'Teacher observation note on the Record of work. No recording of children.'],
};
const IND = { 1: '1.1 create and/or execute', 2: '2.1 perform and/or display', 3: '3.1 display, critique, participate in or analyse' };
const entry = (await import('../src/ai-tutor/content/subjects/creativearts_g4.js')).default;
const withFamily = new Set(Object.values(entry.map.skills).flatMap(k => k.outcomes));
const rows = []; const n = { Q: 0, P: 0, O: 0, A: 0 };
let famQ = 0, famAll = 0;
for (const s of g4.sub_strands) {
  const sk = s.code.slice(P.length), table = KIND[sk]; if (!table) throw new Error(`no kinds for ${sk}`);
  const rub = s.rubric_indicators?.[0]?.match(/RUBRIC\.(\d)/)?.[1];
  for (const o of s.outcomes) {
    const letter = o.code.slice(s.code.length + 1), kind = table[letter]; if (!kind) throw new Error(`no kind for ${o.code}`);
    n[kind]++;
    const fam = withFamily.has(o.code); if (fam) famAll++; if (fam && kind === 'Q') famQ++;
    let need;
    if (kind === 'Q') need = fam ? 'Question families.' : 'NO FAMILY: a question can test it.';
    else if (kind === 'A') need = `Teacher observation over the term or a portfolio entry; the termly attitude statement, exceptions only, never in the learner model. A tapped answer cannot show a feeling.${fam ? ' The question families test only the facts behind it.' : ''}`;
    else { const [task, ev] = TASK[`${sk.split('.')[1]}.${letter}`] || (() => { throw new Error(`no task for ${o.code}`); })(); need = `${task} Rubric: KICD indicator ${IND[rub]} (four levels EE, ME, AE, BE, kept intact in the curriculum file). Evidence: ${ev}${fam ? ' The question families test the knowledge half only.' : ''}`; }
    rows.push(`| ${sk.split('.')[1]}.${letter} | ${kind} | ${fam ? (kind === 'Q' ? 'yes' : 'yes (knowledge half)') : 'no'} | ${o.text} | ${need} |`);
  }
}
const total = n.Q + n.P + n.O + n.A;
const qNo = rows.filter(r => / \| Q \| no \|/.test(r)).length;
const md = `# Creative Arts Grade 4: outcomes a question cannot fully test (13 Nov 2026)

Built from \`curriculum/creative_arts/g4.json\` and the registry entry. Outcome text is KICD's. **Q** means a question can test it, **P** a practical or product (make, draw, paint, play, perform, swim), **O** a singing or listening check, **A** an attitude or value (teacher observation or portfolio). All are scored with the KICD rubric indicators (three tables, CREA.G4.RUBRIC.1 to 3, four levels each), which are untouched in the curriculum file.

- Outcomes: ${total}. By what tests them best: Q ${n.Q}, P ${n.P}, O ${n.O}, A ${n.A}.
- Outcomes with at least one question family: ${famAll} of ${total} (40 skills, 120 families, 135 misconceptions). Q outcomes with no family: ${qNo}.
- A P, O or A outcome that has a family: the family tests the knowledge half (for example the order of the steps of a charcoal stick, which note covers which holes). A child who passes the questions has not shown the skill.
- Evidence rule for every row: the work or its sound is kept, never the child. A photo shows the product (no face, no name); an audio clip carries the sound only; swimming and games get a teacher's mark and no photo or video. The teacher keeps the evidence; nothing leaves the school.
- Safety: charcoal burning is done by an adult; swimming only with a teacher or lifeguard; no practical here needs a child alone with fire or deep water.
- The pilot for observation is Science and Technology; Creative Arts needs the same lesson-observation fold-out and task paper (PLAN_OBSERVATION_RUBRICS.md) before any P or O outcome here can be recorded in the system.

| Outcome | Kind | Has a family | Outcome text | What it needs |
|---|---|---|---|---|
${rows.join('\n')}
`;
writeFileSync(new URL('../docs/qa/creativearts-g4-non-question-outcomes-2026-11-13.md', import.meta.url), md);
console.log(`non-question doc: ${total} outcomes, Q ${n.Q} P ${n.P} O ${n.O} A ${n.A}, with a family ${famAll}, Q without ${qNo}`);
