/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'base-dark': '#050605',
        'secondary-dark': '#181a18',
        'tertiary-dark': '#151614',
        'accent-green': '#2BF574',
        'accent-warm': '#848C72',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-ambient': 'linear-gradient(to bottom, #1c1f1f, #202426)',
        'gradient-hiphop': 'linear-gradient(to bottom, #202426, #2b2b2b)',
        'gradient-lofi': 'linear-gradient(to bottom, #202426, #1a1d1b)',
        'gradient-soundscape': 'linear-gradient(to bottom, #1e2221, #101312)',
      },
    },
  },
  plugins: [],
} 