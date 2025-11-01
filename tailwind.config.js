/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ffe6',
          100: '#ccffcc',
          200: '#99ff99',
          300: '#66ff66',
          400: '#33ff33',
          500: '#00cc00',  // Your main color
          600: '#00b300',
          700: '#009900',
          800: '#008000',
          900: '#006600',
        },
      },
    },
  },
  plugins: [],
}