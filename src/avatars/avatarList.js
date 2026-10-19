// ============================================================================
// THE FIGURES — who a learner can be, as data.
//
// Split out of Avatars.jsx so the list and the two rules about it are plain
// JavaScript: node cannot import .jsx, so while they lived beside the drawing
// code nothing could hold them to anything. tests/student-mode.test.mjs holds
// them now. Avatars.jsx re-exports all of this, so no call site cares.
// ============================================================================

// Six figures: three boys, three girls. Skin, hair, coat and ground are chosen
// so no two read alike at thumbnail size. `label` is for screen readers only —
// it describes the picture, it is not a name for the person.
export const AVATARS = [
  { id: 'b1', label: 'Boy in a rust coat', ground: 'sky', skin: 'umber', hair: 'crop', hairColor: 'black', coat: 'rust', trouser: '#24303f', legs: 'plain' },
  { id: 'b2', label: 'Boy in a forest coat', ground: 'sand', skin: 'tan', hair: 'afro', hairColor: 'coal', coat: 'forest', trouser: '#e4ded1', legs: 'stripe' },
  { id: 'b3', label: 'Boy in a navy coat', ground: 'sage', skin: 'deep', hair: 'locs', hairColor: 'coal', coat: 'navy', trouser: '#cfc7b6', legs: 'plain' },
  { id: 'g1', label: 'Girl in a camel coat', ground: 'blush', skin: 'amber', hair: 'bun', hairColor: 'black', coat: 'camel', trouser: '#2b3340', legs: 'plain' },
  { id: 'g2', label: 'Girl in a grey coat', ground: 'mist', skin: 'fair', hair: 'long', hairColor: 'brown', coat: 'slate', trouser: '#3a3f4a', legs: 'stripe' },
  { id: 'g3', label: 'Girl in a cream coat', ground: 'clay', skin: 'sand', hair: 'headwrap', hairColor: 'rust', coat: 'cream', trouser: '#2f3b2f', legs: 'speck' },
];

export const byId = Object.fromEntries(AVATARS.map(a => [a.id, a]));

/** The default pick, so a learner who skips the step still gets a real figure. */
export const DEFAULT_AVATAR = AVATARS[0].id;
export const isAvatarId = (v) => typeof v === 'string' && !!byId[v];

/**
 * A figure for a learner who has not picked one, chosen from whatever
 * identifies them. Deterministic, so it is the same figure every time they
 * open the app, and two children on one account do not get the same one.
 *
 * This exists because "no pick" was being drawn as an initial in a coloured
 * circle, and an account made before the picker existed has no pick and no
 * way to notice there is one to make. The result was six drawn figures that
 * nobody ever saw. A real figure for everybody is what DEFAULT_AVATAR above
 * always intended; it just stopped at the sign-up sheet.
 */
export const avatarFor = (seed) => {
  const s = String(seed ?? '');
  if (!s) return DEFAULT_AVATAR;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length].id;
};
