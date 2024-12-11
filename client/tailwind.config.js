/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        padding: "30px",
        screens: {
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "1260px",
        },
      },
      fontFamily: {
        workSans: ["Work Sans", "sans-serif"],
      },
      colors: {
        primary: "#FF5A30",
        heading: "#181A2A",
        paragraph: "#97989F",
        lists: "#3B3C4A",
        customGray: "#696A75",
        category: "#4B6BFB",
      },
    },
  },
  plugins: [],
};
