/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#00CFFF",
        cyan: "#35E0FF",
        indigo: "#3B3BFF",
        purple: "#8B5CFF",

        dark: "#030311",
        secondary: "#0A1020",
        surface: "#0F172A",

        text: "#F5F7FF",
        muted: "#9CA3AF",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 30px rgba(0,207,255,0.35)",
        purpleGlow:
          "0 0 30px rgba(139,92,255,0.35)",
      },

      backgroundImage: {
        heroGradient:
          "linear-gradient(135deg, #030311 0%, #0A1020 50%, #111827 100%)",

        glowGradient:
          "linear-gradient(135deg, #00CFFF 0%, #8B5CFF 100%)",
      },
    },
  },

  plugins: [],
};