/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      gray: colors.gray,
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
        600: "#DD8D58"
      },
      black: colors.black,
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
