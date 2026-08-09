import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        "defaults",
        "not IE 11",
        "Android >= 8",
        "iOS >= 12",
        "Safari >= 12",
      ],
      modernPolyfills: true,
    }),
  ],

  build: {
  cssCodeSplit: true,
  sourcemap: false,
  chunkSizeWarningLimit: 700,
},
});