import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },

  prettier,

  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn"]
    }
  }
]);
