/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'esl-black': '#0a0a0a',
        'esl-dark': '#141414',
        'esl-blue': '#0066cc',
        'esl-light-blue': '#0099ff',
      },
    },
  },
  plugins: [],
}