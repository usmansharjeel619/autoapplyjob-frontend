/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f0ff",
          100: "#e6e6ff",
          200: "#d1d1ff",
          300: "#b3b3ff",
          400: "#9090ff",
          500: "#6d6dff",
          600: "#5a5af7",
          700: "#4a4ae3",
          800: "#3d3db8",
          900: "#353593",
        },
      },
    },
  },
  plugins: [],
};
