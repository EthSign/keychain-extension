/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      gray: {
        ...colors.gray,
        50: "#F9FAFB",
        200: "#EAECF0",
        300: "#D0D5DD",
        400: "#98A2B3",
        500: "#667085",
        600: "#475467",
        700: "#344054",
        800: "#1D2939",
        900: "#101828"
      },
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      blue: {
        ...colors.blue,
        50: "#EFF8FF",
        700: "#175CD3"
      },
      orange: {
        ...colors.orange,
        500: "#EF6820"
      },
      primary: {
        25: "#FDFAF9",
        200: "#F2DBCC",
        600: "#DD8D58",
        700: "#D97D40",
        800: "#CD7134",
        900: "#CF5C10"
      },
      black: { ...colors.black, 900: "#1E1E1E" },
      slate: colors.slate
    },
    extend: {
      fontFamily: {
        plex: ["IBM Plex Sans", "sans-serif"]
      },
      boxShadow: {
        glow: "0px 0px 4px 0px #F2DBCC"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
