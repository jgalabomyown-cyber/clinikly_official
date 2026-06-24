/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Add this line right here to tell Tailwind to look for the .dark class on the <html> tag:
  darkMode: 'class', 
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}