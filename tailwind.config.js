/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Victorian display / woodcut
        display: ['"Rye"', '"Cinzel Decorative"', 'serif'],
        // Editorial serif body
        serif: ['"Playfair Display"', '"IM Fell English"', 'Georgia', 'serif'],
        // Monospace
        mono: ['"Space Mono"', '"Courier Prime"', 'monospace'],
      },
      colors: {
        // Parchment palette
        parchment: {
          light: '#F7F2E1',
          DEFAULT: '#EFE7CD',
          dark: '#E0D5B8',
        },
        // Deep crimson header
        crimson: {
          DEFAULT: '#A83232',
          dark: '#7B2B22',
          deeper: '#6B241F',
        },
        // Antique gold
        gold: {
          DEFAULT: '#C9975B',
          light: '#D4A02E',
          pale: '#EAD69A',
        },
        // Category colors
        category: {
          spec: '#A83232',
          antipattern: '#1E5A2D',
          reference: '#C9975B',
          pattern: '#C9975B',
          philosophy: '#2D2D2D',
        },
      },
      backgroundImage: {
        'parchment-texture': "url('/ui-studio/blueprints/library/assets/parchment-background-texture.png')",
      },
    },
  },
  plugins: [],
}
