import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
  ]),

  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: "latest",

        sourceType: "module",

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      /*
       * These React Compiler rules are disabled because the CMS
       * intentionally loads and resets asynchronous form data
       * inside effects. The current patterns are valid for this app.
       */
      "react-hooks/set-state-in-effect": "off",

      "react-hooks/preserve-manual-memoization": "off",
    },
  },
]);