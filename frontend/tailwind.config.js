/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These match the soft, supportive palette of your Herizon theme
        herizonPink: '#fdf2f8', 
        herizonIndigo: '#312e81',
      }
    },
  },
  plugins: [],
}