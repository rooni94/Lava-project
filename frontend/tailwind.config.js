/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#580213",
        secondary: "#222222",
        accent: "#CCCCCC",
        surface: "#F8F9FA",
      },
      fontFamily: {
        cairo: ["'Cairo'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
