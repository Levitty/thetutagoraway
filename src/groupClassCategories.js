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
  { key: 'coding',        label: 'Coding & Robotics',       emoji: '💻', blurb: 'Scratch, games, robots, first Python',      c1: '#0f2f57', c2: '#6fd0ff', examples: ['Scratch Game Studio', 'Build Your First Robot', 'Python for Curious Kids'] },
  { key: 'chess',         label: 'Chess & Strategy',        emoji: '♟️', blurb: 'Learn to play, tactics, tournaments',       c1: '#2b2721', c2: '#ecdfc6', examples: ['Saturday Chess Masters', 'Checkmate Club', 'Chess: Openings to Endgames'] },
  { key: 'art',           label: 'Art & Craft',             emoji: '🎨', blurb: 'Drawing, painting, making things',          c1: '#a83a24', c2: '#ffd7a0', examples: ['Art Odyssey: Drawing Adventures', 'Paint Like the Masters', 'Make & Create Studio'] },
  { key: 'drama',         label: 'Drama & Theatre',         emoji: '🎭', blurb: 'Acting, improv, school-play prep',          c1: '#512663', c2: '#eeb9ff', examples: ['Improv Lab', 'Little Actors Studio', 'Stage & Story Club'] },
  { key: 'debate',        label: 'Debate & Public Speaking',emoji: '🎤', blurb: 'Confidence, argument, presentation',        c1: '#7d2437', c2: '#ffc2a6', examples: ['Young Debaters League', 'Speak Up! Confidence Club', 'The Argument Room'] },
  { key: 'writing',       label: 'Creative Writing',        emoji: '✍️', blurb: 'Stories, poetry, storytelling',             c1: '#31421f', c2: '#d6ea9c', examples: ['Story Makers Workshop', 'Poetry & Spoken Word', 'Write Your First Book'] },
  { key: 'science',       label: 'Science Club',            emoji: '🔬', blurb: 'Experiments, “why does that happen?”',      c1: '#0d4f46', c2: '#6fe9cd', examples: ['Kitchen Lab Experiments', 'Space Explorers', 'How Things Work'] },
  { key: 'music',         label: 'Music',                   emoji: '🎵', blurb: 'Singing, keyboard, guitar, rhythm',         c1: '#5f400c', c2: '#ffd35e', examples: ['Keyboard from Zero', 'Sing! Choir Club', 'Guitar Starters'] },
  { key: 'film',          label: 'Photography & Film',      emoji: '📷', blurb: 'Phone photography, short films, editing',   c1: '#1e2a36', c2: '#9dc6ee', examples: ['Phone Filmmakers', 'Shoot & Edit Studio', 'The Short Film Club'] },
  { key: 'languages',     label: 'Languages',               emoji: '🌍', blurb: 'French, Kiswahili, sign language, more',    c1: '#154668', c2: '#93dcff', examples: ['French for Beginners', 'Lugha Yetu: Kiswahili Club', 'Sign Language Starters'] },
  { key: 'entrepreneur',  label: 'Young Entrepreneurs',     emoji: '💡', blurb: 'Ideas, money sense, mini-businesses',       c1: '#7d3f0b', c2: '#ffca80', examples: ['My First Business', 'Money Smart Kids', 'The Idea Factory'] },
  { key: 'games',         label: 'Puzzles & Games',         emoji: '🧩', blurb: 'Logic, riddles, board games, fun maths',    c1: '#372b75', c2: '#b3a2ff', examples: ['Logic Puzzles League', 'Maths Games Arena', 'Board Game Strategy Club'] },
  { key: 'life',          label: 'Cooking & Life Skills',   emoji: '🍳', blurb: 'Cooking, budgeting, everyday skills',       c1: '#5f2619', c2: '#ffb99b', examples: ['Junior Chefs', 'Life Skills Lab', 'Cook It Yourself'] },
  { key: 'reading',       label: 'Reading & Book Club',     emoji: '📚', blurb: 'Read together, discuss, love books',        c1: '#1a3355', c2: '#9fcdf2', examples: ['The Story Circle', 'Adventure Book Club', 'Read the World'] },
];

export const CATEGORY_BY_KEY = Object.fromEntries(INTEREST_CATEGORIES.map(c => [c.key, c]));

export const categoryLabel = (key) => CATEGORY_BY_KEY[key]?.label || key;
export const categoryEmoji = (key) => CATEGORY_BY_KEY[key]?.emoji || '✨';
