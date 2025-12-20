/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./js/**/*.js"
  ],

  safelist: [
    "text-teal-500",
    "bg-gray-100",
    "text-2xl",
    "font-bold"
  ],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },

  plugins: [],
};
