/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  "./views/*.ejs",],
    theme: {
      extend: {
          textShadow: {
              sm: '0 1px 2px var(--tw-shadow-color)',
              DEFAULT: '0 2px 4px var(--tw-shadow-color)',
              lg: '0 8px 16px var(--tw-shadow-color)',
              100: 'text-shadow: -4px 4px 0px rgba(0, 0, 0, 0.25);',
          },
          backgroundImage: {
              'hero': "url('img/hero.svg')",
              'hero2': "url('img/fondo.svg')",
          },
          colors: {
              clifford: '#da373d',
              primary: {
                  100: "#20D1AA",
                  200: "#1dbf9c",
                  300: "#094747"
              },
              secondary: {
                  100: "#F0E8DC",
                  200: "#E4DCD0",
                  300: "#D8CFC3",
              },
              black: {
                  100: "#282828",
                  200: "#000"
              }
          }
      }
    }
    ,
  plugins: [],
}