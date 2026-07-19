// ============================================================================
// Interest-led class categories — the "clubs" a tutor can run outside the
// academic subjects. Recess/Outschool-style: kids join out of curiosity, not
// remediation. Kept as data so the create form, discovery filter, and badges
// all read from one list.
// ============================================================================

// Each category carries its own visual identity (a duo of warm print-like
// tones for the card cover) and example titles that show tutors what an
// evocative, specific club name looks like — "Saturday Chess Masters", not
// "Chess class".
export const INTEREST_CATEGORIES = [
  { key: 'coding',        label: 'Coding & Robotics',       emoji: '💻', blurb: 'Scratch, games, robots, first Python',      c1: '#12345c', c2: '#2d5f96', examples: ['Scratch Game Studio', 'Build Your First Robot', 'Python for Curious Kids'] },
  { key: 'chess',         label: 'Chess & Strategy',        emoji: '♟️', blurb: 'Learn to play, tactics, tournaments',       c1: '#3a3630', c2: '#6b6153', examples: ['Saturday Chess Masters', 'Checkmate Club', 'Chess: Openings to Endgames'] },
  { key: 'art',           label: 'Art & Craft',             emoji: '🎨', blurb: 'Drawing, painting, making things',          c1: '#b5452f', c2: '#e0784f', examples: ['Art Odyssey: Drawing Adventures', 'Paint Like the Masters', 'Make & Create Studio'] },
  { key: 'drama',         label: 'Drama & Theatre',         emoji: '🎭', blurb: 'Acting, improv, school-play prep',          c1: '#6d3b78', c2: '#9a5fa8', examples: ['Improv Lab', 'Little Actors Studio', 'Stage & Story Club'] },
  { key: 'debate',        label: 'Debate & Public Speaking',emoji: '🎤', blurb: 'Confidence, argument, presentation',        c1: '#8a2b3e', c2: '#b85068', examples: ['Young Debaters League', 'Speak Up! Confidence Club', 'The Argument Room'] },
  { key: 'writing',       label: 'Creative Writing',        emoji: '✍️', blurb: 'Stories, poetry, storytelling',             c1: '#4a5d3a', c2: '#75885f', examples: ['Story Makers Workshop', 'Poetry & Spoken Word', 'Write Your First Book'] },
  { key: 'science',       label: 'Science Club',            emoji: '🔬', blurb: 'Experiments, “why does that happen?”',      c1: '#1d6a5c', c2: '#3f9584', examples: ['Kitchen Lab Experiments', 'Space Explorers', 'How Things Work'] },
  { key: 'music',         label: 'Music',                   emoji: '🎵', blurb: 'Singing, keyboard, guitar, rhythm',         c1: '#8a6a1d', c2: '#b8933f', examples: ['Keyboard from Zero', 'Sing! Choir Club', 'Guitar Starters'] },
  { key: 'film',          label: 'Photography & Film',      emoji: '📷', blurb: 'Phone photography, short films, editing',   c1: '#2f3d4c', c2: '#5a6b7d', examples: ['Phone Filmmakers', 'Shoot & Edit Studio', 'The Short Film Club'] },
  { key: 'languages',     label: 'Languages',               emoji: '🌍', blurb: 'French, Kiswahili, sign language, more',    c1: '#265073', c2: '#4b7a9e', examples: ['French for Beginners', 'Lugha Yetu: Kiswahili Club', 'Sign Language Starters'] },
  { key: 'entrepreneur',  label: 'Young Entrepreneurs',     emoji: '💡', blurb: 'Ideas, money sense, mini-businesses',       c1: '#9c5a1d', c2: '#c98440', examples: ['My First Business', 'Money Smart Kids', 'The Idea Factory'] },
  { key: 'games',         label: 'Puzzles & Games',         emoji: '🧩', blurb: 'Logic, riddles, board games, fun maths',    c1: '#54428e', c2: '#7d6bb5', examples: ['Logic Puzzles League', 'Maths Games Arena', 'Board Game Strategy Club'] },
  { key: 'life',          label: 'Cooking & Life Skills',   emoji: '🍳', blurb: 'Cooking, budgeting, everyday skills',       c1: '#7a3b2e', c2: '#a86450', examples: ['Junior Chefs', 'Life Skills Lab', 'Cook It Yourself'] },
  { key: 'reading',       label: 'Reading & Book Club',     emoji: '📚', blurb: 'Read together, discuss, love books',        c1: '#31456b', c2: '#5a7096', examples: ['The Story Circle', 'Adventure Book Club', 'Read the World'] },
];

export const CATEGORY_BY_KEY = Object.fromEntries(INTEREST_CATEGORIES.map(c => [c.key, c]));

export const categoryLabel = (key) => CATEGORY_BY_KEY[key]?.label || key;
export const categoryEmoji = (key) => CATEGORY_BY_KEY[key]?.emoji || '✨';
