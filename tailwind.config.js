/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      gray: { ...colors.gray, 200: "#EAECF0", 400: "#98A2B3", 500: "#667085", 700: "#344054", 900: "#101828" },
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      blue: colors.blue,
      orange: {
        ...colors.orange,
        500: "#EF6820"
      },
      primary: {
        600: "#DD8D58",
        900: "#CF5C10"
      },
      black: { ...colors.black, 900: "#1E1E1E" },
      slate: colors.slate
    },
    extend: {
      fontFamily: {
        plex: ["IBM Plex Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
