/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0f1729',
        slateInk: '#0b132b',
        accent: '#38bdf8',
        accentPurple: '#a855f7',
      },
    },
  },
  plugins: [],
};
