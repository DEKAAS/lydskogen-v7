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
        'primary-dark': '#2A3340',
        'secondary-dark': '#3A4350',
        'tertiary-dark': '#4A5360',
        'accent-gold': '#DBBA36',
        'nature-sage': '#C5C58F',
        'sage-light': '#D5D5A5',
        'gradient-start': '#424A45',
        'gradient-end': '#CFC5B0',
        // Legacy support (will be replaced gradually)
        'base-dark': '#2A3340',
        'accent-green': '#DBBA36',
      },
      backgroundImage: {
        'site-gradient': 'linear-gradient(135deg, #424A45 0%, #CFC5B0 100%)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
}

