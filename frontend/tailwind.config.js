/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 500: '#7C3AED', 600: '#6d28d9' },
      },
    },
  },
  plugins: [],
}
