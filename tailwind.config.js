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
        'base-dark': '#202426',
        'secondary-dark': '#1c1f1f',
        'tertiary-dark': '#181b1b',
        'accent-green': '#2BF574',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
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