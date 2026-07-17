// ============================================================================
// Interest-led class categories — the "clubs" a tutor can run outside the
// academic subjects. Recess/Outschool-style: kids join out of curiosity, not
// remediation. Kept as data so the create form, discovery filter, and badges
// all read from one list.
// ============================================================================

export const INTEREST_CATEGORIES = [
  { key: 'coding',        label: 'Coding & Robotics',       emoji: '💻', blurb: 'Scratch, games, robots, first Python' },
  { key: 'chess',         label: 'Chess & Strategy',        emoji: '♟️', blurb: 'Learn to play, tactics, tournaments' },
  { key: 'art',           label: 'Art & Craft',             emoji: '🎨', blurb: 'Drawing, painting, making things' },
  { key: 'drama',         label: 'Drama & Theatre',         emoji: '🎭', blurb: 'Acting, improv, school-play prep' },
  { key: 'debate',        label: 'Debate & Public Speaking',emoji: '🎤', blurb: 'Confidence, argument, presentation' },
  { key: 'writing',       label: 'Creative Writing',        emoji: '✍️', blurb: 'Stories, poetry, storytelling' },
  { key: 'science',       label: 'Science Club',            emoji: '🔬', blurb: 'Experiments, "why does that happen?"' },
  { key: 'music',         label: 'Music',                   emoji: '🎵', blurb: 'Singing, keyboard, guitar, rhythm' },
  { key: 'film',          label: 'Photography & Film',      emoji: '📷', blurb: 'Phone photography, short films, editing' },
  { key: 'languages',     label: 'Languages',               emoji: '🌍', blurb: 'French, Kiswahili, sign language, more' },
  { key: 'entrepreneur',  label: 'Young Entrepreneurs',     emoji: '💡', blurb: 'Ideas, money sense, mini-businesses' },
  { key: 'games',         label: 'Puzzles & Games',         emoji: '🧩', blurb: 'Logic, riddles, board games, fun maths' },
  { key: 'life',          label: 'Cooking & Life Skills',   emoji: '🍳', blurb: 'Cooking, budgeting, everyday skills' },
  { key: 'reading',       label: 'Reading & Book Club',     emoji: '📚', blurb: 'Read together, discuss, love books' },
];

export const CATEGORY_BY_KEY = Object.fromEntries(INTEREST_CATEGORIES.map(c => [c.key, c]));

export const categoryLabel = (key) => CATEGORY_BY_KEY[key]?.label || key;
export const categoryEmoji = (key) => CATEGORY_BY_KEY[key]?.emoji || '✨';
