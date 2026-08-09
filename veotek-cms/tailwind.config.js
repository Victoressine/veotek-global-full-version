/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00CFFF",
        secondary: "#35E0FF",
        accent: "#8B5CFF",
        dark: "#030311",
        surface: "#0A1020",
        light: "#F5F7FF",
        muted: "#9CA3AF",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 10px 40px rgba(0,0,0,.25)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}