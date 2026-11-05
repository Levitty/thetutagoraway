import { TOKENS, TAILWIND_COLOURS, TAILWIND_RADIUS } from './src/shell/tokens.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: [TOKENS.font] },
      colors: TAILWIND_COLOURS,
      borderRadius: TAILWIND_RADIUS,
      // White cards on the lavender ground: no shadow. Modals keep shadow-lg and up.
      boxShadow: { sm: 'none', DEFAULT: 'none', md: 'none' },
    },
  },
  plugins: [
    // One source: every token is a --hb-* variable on :root.
    ({ addBase }) => addBase({
      ':root': Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [`--hb-${k}`, v])),
    }),
  ],
}
