/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uber: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#F6F6F6',
            100: '#EEEEEE',
            200: '#E2E2E2',
            300: '#CBCBCB',
            400: '#AFAFAF',
            500: '#757575',
            600: '#545454',
            700: '#333333',
            800: '#242424',
            900: '#141414',
          },
          primary: '#276EF1',
          secondary: '#000000',
        },
      },
      boxShadow: {
        'uber': '0 4px 14px 0 rgba(39, 110, 241, 0.39)',
      },
    },
  },
  plugins: [],
};