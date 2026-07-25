/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parul: {
          navy: '#0A192F',
          darkBlue: '#1E293B',
          gold: '#EAB308',
          goldLight: '#FEF08A',
          accent: '#38BDF8',
          cardDark: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
