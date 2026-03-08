/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
