/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/chunks/**/*.{js,jsx}",
    "./src/*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',  // Primary brand color (red)
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      }
    },
  },
  plugins: [],
}
