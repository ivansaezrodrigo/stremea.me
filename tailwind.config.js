/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  "./views/*.ejs","./views/partials/*.ejs",],
  theme: {
    extend: {
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
        100: "text-shadow: -4px 4px 0px rgba(0, 0, 0, 0.25);",
      },
      backgroundImage: {
        hero: "url('img/hero.svg')",
        hero2: "url('img/fondo.svg')",
      },
      colors: {
        clifford: "#da373d",
        primary: {
          100: "#20D1AA",
          200: "#1dbf9c",
          300: "#094747",
        },
        secondary: {
          100: "#F0E8DC",
          200: "#E4DCD0",
          300: "#D8CFC3",
        },
        black: {
          100: "#282828",
          200: "#000",
        },
        chat: {
          v0: "#1dbf9c",
          v1: "#FD5D76",
          v2: "#E98862",
          v3: "#F2C06D",
          v4: "#F2E863",
          v5: "#A3E063",
          v6: "#63E0A3",
          v7: "#63D0E0",
          v8: "#63A3E0",
          v9: "#636FE0",
          v10: "#9F63E0",
          v11: "#E063A3",
          v12: "#E06363",
        },
      },
    },
  }
    ,
  plugins: [],
}