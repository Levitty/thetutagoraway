// ============================================================================
// AVATARS — the figures a learner picks from when they sign up.
//
// Drawn to the illustration the owner chose as the reference: flat gouache
// shapes, no outlines, a pale chalky ground, a long coat, and a face left
// blank. Everyone is in profile, mid-stride, the way that reference draws its
// whole crowd.
//
// The blank face is the point rather than a shortcut. Identity is carried by
// hair, skin and coat, so a child can pick someone who looks like them without
// the picture pretending to be a photograph of a real person. Nobody is named,
// so the figure stays the learner's own.
//
// All SVG, built from one config row each: no network requests, crisp at any
// size, and the composition sits inside the centre circle because the app clips
// avatars round.
// ============================================================================
import React from 'react';

// The chalky washes of the reference — one per figure, so a class list reads as
// a crowd rather than a repeated swatch.
const GROUND = { sky: '#bfe0ea', sand: '#e9dac9', sage: '#d8e3d3', blush: '#eed9d1', mist: '#dfe1ef', clay: '#e6cdbd' };

const SKIN = { deep: '#4a3426', umber: '#6d4a33', amber: '#9c6a46', tan: '#c08b63', sand: '#deb188', fair: '#f0d3b4' };

const HAIR = { black: '#1d1714', coal: '#2f2622', brown: '#5a4632', rust: '#c4593a', wheat: '#c9a26b' };

// Navy, forest, camel, rust, grey, cream — the reference's own coat palette.
const COAT = { navy: '#2d3f63', forest: '#20412f', camel: '#cfa97b', rust: '#c05f3c', slate: '#6f7378', cream: '#efe9dd' };

// ---------------------------------------------------------------------------
// Hair, drawn on a head at centre (52,17) radius 8.5, facing right. The back of
// the skull is to the left, so every style builds from there.
// ---------------------------------------------------------------------------
const HAIRSTYLES = {
  // Close crop following the skull.
  crop: (c) => <path d="M43,19 C43,11 47,7 52,7 C58,7 62,11 61,17 C58,12 54,11 50,12 C46,13 44,16 43,19 Z" fill={c} />,

  // Rounded afro, proud of the skull.
  afro: (c) => (
    <>
      <circle cx="50" cy="13" r="11" fill={c} />
      <circle cx="43" cy="19" r="5.5" fill={c} />
    </>
  ),

  // Locs hanging from a cap, down the back of the neck.
  locs: (c) => (
    <>
      <path d="M43,19 C43,10 47,6 52,6 C58,6 62,10 61,17 C58,11 54,10 50,11 C46,12 44,15 43,19 Z" fill={c} />
      {/* The ropes hang BEHIND the head, from the crown down past the neck.
          Drawn from the skull's left edge they read as a bar beside the face. */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={42 + i * 3.2} y={18 - i * 0.8} width="2.8" height={13 - i * 2.5} rx="1.4" fill={c} />
      ))}
    </>
  ),

  // Gathered into a bun at the back of the crown.
  bun: (c) => (
    <>
      <path d="M43,19 C43,10 47,6 52,6 C58,6 62,10 61,17 C58,11 54,10 50,11 C46,12 44,15 43,19 Z" fill={c} />
      <circle cx="41" cy="12" r="4.6" fill={c} />
    </>
  ),

  // Long, falling past the shoulder down the back.
  long: (c) => (
    <>
      <path d="M42,20 C42,10 47,5 52,5 C58,5 62,10 61,17 C58,11 54,10 50,11 C46,12 43,15 42,20 Z" fill={c} />
      <path d="M42,16 C38,23 38,31 40,38 L47,38 C45,31 45,23 46,17 Z" fill={c} />
    </>
  ),

  // A wrapped headscarf, knot at the back.
  headwrap: (c) => (
    <>
      <path d="M42,20 C42,10 47,5 52,5 C59,5 63,10 62,18 C58,10 54,8 49,9 C45,10 43,15 42,20 Z" fill={c} />
      <path d="M42,18 C38,17 36,13 38,10 C41,7 45,9 45,13 Z" fill={c} />
    </>
  ),
};

// Trouser treatments the reference puts on its figures.
const LEG_PATTERN = {
  plain: () => null,
  stripe: () => [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
    <rect key={i} x={34 + i * 4} y="56" width="1.5" height="32" fill="#fff" fillOpacity="0.4" />
  )),
  speck: () => [[41, 66], [48, 72], [44, 80], [55, 64], [58, 74], [46, 84], [57, 82], [38, 72]].map(([x, y], i) => (
    <circle key={i} cx={x} cy={y} r="1.6" fill="#fff" fillOpacity="0.45" />
  )),
};

// ---------------------------------------------------------------------------
// Six figures: three boys, three girls. Skin, hair, coat and ground are chosen
// so no two read alike at thumbnail size. `label` is for screen readers only —
// it describes the picture, it is not a name for the person.
// ---------------------------------------------------------------------------
export const AVATARS = [
  { id: 'b1', label: 'Boy in a rust coat', ground: 'sky', skin: 'umber', hair: 'crop', hairColor: 'black', coat: 'rust', trouser: '#24303f', legs: 'plain' },
  { id: 'b2', label: 'Boy in a forest coat', ground: 'sand', skin: 'tan', hair: 'afro', hairColor: 'coal', coat: 'forest', trouser: '#e4ded1', legs: 'stripe' },
  { id: 'b3', label: 'Boy in a navy coat', ground: 'sage', skin: 'deep', hair: 'locs', hairColor: 'coal', coat: 'navy', trouser: '#cfc7b6', legs: 'plain' },
  { id: 'g1', label: 'Girl in a camel coat', ground: 'blush', skin: 'amber', hair: 'bun', hairColor: 'black', coat: 'camel', trouser: '#2b3340', legs: 'plain' },
  { id: 'g2', label: 'Girl in a grey coat', ground: 'mist', skin: 'fair', hair: 'long', hairColor: 'brown', coat: 'slate', trouser: '#3a3f4a', legs: 'stripe' },
  { id: 'g3', label: 'Girl in a cream coat', ground: 'clay', skin: 'sand', hair: 'headwrap', hairColor: 'rust', coat: 'cream', trouser: '#2f3b2f', legs: 'speck' },
];

const byId = Object.fromEntries(AVATARS.map(a => [a.id, a]));

/** The default pick, so a learner who skips the step still gets a real figure. */
export const DEFAULT_AVATAR = AVATARS[0].id;
export const isAvatarId = (v) => typeof v === 'string' && !!byId[v];

/**
 * One figure, in profile, walking right.
 *
 * Everything sits between y=5 and y=88 and within x=34..68, which is inside the
 * circle the app crops to, so no head or shoe is ever clipped.
 */
export function AvatarArt({ id, size = 40, className = '', title }) {
  const a = byId[id] || AVATARS[0];
  const skin = SKIN[a.skin], coat = COAT[a.coat], hair = HAIR[a.hairColor];
  const legClip = `tg-av-leg-${a.id}`;
  const pattern = LEG_PATTERN[a.legs] || LEG_PATTERN.plain;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}
      role="img" aria-label={title || a.label} style={{ display: 'block' }}>
      <defs>
        <clipPath id={legClip}>
          <path d="M43,56 L58,56 L62,86 L55,86 L51,68 L46,86 L39,86 Z" />
        </clipPath>
      </defs>
      <rect width="100" height="100" fill={GROUND[a.ground]} />

      {/* Back leg trailing, front leg forward: the stride the reference walks in. */}
      <path d="M44,56 L52,56 L50,70 L46,85 L39,85 L43,70 Z" fill={a.trouser} />
      <path d="M50,56 L58,56 L60,70 L62,85 L55,85 L52,70 Z" fill={a.trouser} />
      <g clipPath={`url(#${legClip})`}>{pattern()}</g>

      {/* Cream sneakers, pointing the way the figure walks. */}
      <path d="M36,83 C36,81 38,80 42,80 L46,80 C47,80 47,86 46,86 L37,86 C36,86 36,85 36,83 Z" fill="#f6f3ec" />
      <path d="M54,83 C54,81 57,80 61,80 L66,81 C67,81 67,86 66,86 L55,86 C54,86 54,85 54,83 Z" fill="#f6f3ec" />

      {/* The long coat — the silhouette the whole reference is built on. */}
      <path d="M43,27 C38,29 36,37 36,46 C36,54 37,60 38,64 L64,64 C65,59 65,50 65,42 C65,33 63,29 59,27 Z" fill={coat} />
      {/* Front opening, a shade darker, so the coat reads as worn open. */}
      <path d="M56,27 C58,38 58,54 57,64 L64,64 C65,59 65,50 65,42 C65,33 63,29 59,27 Z" fill="#000" fillOpacity="0.1" />
      {/* The near arm, swinging forward. */}
      <path d="M59,30 C64,34 66,42 64,51 C63,55 58,54 59,50 C60,43 59,36 56,32 Z" fill={coat} />
      <path d="M59,30 C64,34 66,42 64,51" stroke="#000" strokeOpacity="0.12" strokeWidth="1.6" fill="none" />
      {/* Collar. */}
      <path d="M46,27 C48,32 56,32 58,27 C57,30 54,33 51,33 C48,33 47,30 46,27 Z" fill="#000" fillOpacity="0.14" />

      {/* Neck, head, then hair over the skull. */}
      <path d="M48,21 L56,21 L56,29 L48,29 Z" fill={skin} />
      <circle cx="52" cy="17" r="8.5" fill={skin} />
      {HAIRSTYLES[a.hair](hair)}
    </svg>
  );
}

/**
 * The picker on the sign-up sheet. A radio group, because a grid of unlabelled
 * pictures is otherwise unreachable from a keyboard or a screen reader.
 */
export function AvatarPicker({ value, onChange, min = 72 }) {
  return (
    // auto-fit rather than a fixed column count: six across a phone leaves each
    // figure about 47px, under the 44px tap target once the ring is inside it,
    // and a child is the one tapping. This gives three or four to a row on a
    // phone and all six on a wider sheet.
    <div role="radiogroup" aria-label="Choose your avatar"
      style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 12 }}>
      {AVATARS.map(a => {
        const picked = value === a.id;
        return (
          <button key={a.id} type="button" role="radio" aria-checked={picked} aria-label={a.label}
            onClick={() => onChange(a.id)}
            style={{
              padding: 0, background: 'none', cursor: 'pointer',
              borderRadius: '50%', lineHeight: 0, overflow: 'hidden', width: '100%', aspectRatio: '1',
              // A border rather than an outline: an outline is drawn OUTSIDE the
              // box and overflowed the grid cell, clipping the last column.
              border: picked ? '3px solid #c98a14' : '2px solid rgba(0,0,0,0.10)',
              boxShadow: picked ? '0 0 0 3px rgba(201,138,20,0.22)' : 'none',
              transition: 'border-color .12s ease, box-shadow .12s ease',
            }}>
            <AvatarArt id={a.id} size="100%" title={a.label} />
          </button>
        );
      })}
    </div>
  );
}

export default AvatarArt;
