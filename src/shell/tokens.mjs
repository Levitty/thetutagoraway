// ============================================================================
// HOREB's design tokens: the one place a colour, a radius or the font is named.
//
// tailwind.config.js reads this file twice: it writes every token as a --hb-*
// variable on :root (for shell.css, site.css and the learner look), and it maps
// Tailwind's slate, emerald, amber and violet scales onto the same values, so
// every screen built from utility classes takes the approved look without being
// rewritten, and a change here reaches all of them at once.
//
// The values are the teacher design the owner approved on 4 Nov 2026 (Edu.ai
// reference). Tuta's teacher screens use the same values on purpose, because
// teachers cross between the two: assets/tuta-extra.css in tuta-php.
// ============================================================================
export const TOKENS = {
  // the room and its surfaces
  ground: '#ECEEF8', card: '#FFFFFF', tile: '#F4F5FB',
  // type
  ink: '#16161A', ink2: '#3A3A44', muted: '#5F6072', faint: '#9A9AA6',
  // lines; dashed means provisional, solid means decided
  line: '#E2E4F0', dash: '#C5C8DC',
  // violet is HOREB's own voice, lime is the action on it
  violet: '#4318D1', 'violet-muted': '#D9D1FF', 'violet-tint': '#ECE8FF', 'violet-ink': '#3B17B0',
  lime: '#DCFF72', 'lime-soft': '#F1FFC4',
  // status pills
  'green-tint': '#E2F5E8', 'green-ink': '#17663A',
  'amber-tint': '#FFF0D4', 'amber-ink': '#8A4F00',
  'red-tint': '#FDECEC', 'red-ink': '#A3262A',
  // the child's warmth: the one big button and the saturated strand blocks
  sun: '#FFC93C', 'sun-soft': '#FFD76A', 'sun-ink': '#6B5309',
  pink: '#FF4F91', 'pink-deep': '#C2255C', 'pink-tint': '#FFF0F5', 'pink-soft': '#FFE3EE',
  'violet-bright': '#6C4BF4', mint: '#9BE3C4',
  // shape and type
  'r-card': '24px', 'r-tile': '14px', 'r-btn': '14px',
  font: '"Figtree Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const t = TOKENS;
const violet = { 50: '#F5F3FF', 100: t['violet-tint'], 200: t['violet-muted'], 300: '#BDB0FF', 400: '#8A72F0', 500: t['violet-bright'], 600: t.violet, 700: t['violet-ink'], 800: '#2C1186', 900: '#1F0C60' };

// Tailwind's own scales, restated. Blue, indigo and purple all mean "violet" now:
// there is one accent family, not a different one per screen.
export const TAILWIND_COLOURS = {
  slate: { 50: t.tile, 100: t.ground, 200: t.line, 300: t.dash, 400: t.faint, 500: t.muted, 600: '#4C4D5C', 700: t.ink2, 800: '#26262E', 900: t.ink },
  emerald: { 50: t['green-tint'], 100: t['green-tint'], 200: '#BCE5CB', 300: '#8FD3A8', 400: '#4FAE74', 500: '#1F7A47', 600: t['green-ink'], 700: t['green-ink'], 800: '#12502D', 900: '#0E3F24' },
  amber: { 50: '#FFF8EA', 100: t['amber-tint'], 200: '#F6DDA8', 300: t['sun-soft'], 400: t.sun, 500: '#E09A00', 600: t['amber-ink'], 700: t['amber-ink'], 800: '#6B3D00', 900: '#553000' },
  red: { 50: t['red-tint'], 100: '#FBDAD9', 200: '#F5BDBB', 300: '#EE9694', 400: '#E5605C', 500: '#D2383A', 600: t['red-ink'], 700: t['red-ink'], 800: '#821E22', 900: '#64171A' },
  violet, purple: violet, indigo: violet, blue: violet,
};
export const TAILWIND_RADIUS = { lg: t['r-tile'], xl: '18px', '2xl': t['r-card'], '3xl': '28px' };
