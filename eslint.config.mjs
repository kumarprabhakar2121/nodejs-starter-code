import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                logger: "readonly", // Add logger as a global
                process: "readonly", // Add process as a global
            },
        },
    },
    // Add formatting rules here
    {
        files: ["**/*.{js,mjs,cjs}"],
        rules: {
            semi: ["error", "always"], // semi: true
            indent: ["error", 4], // tabWidth: 4
            "max-len": ["error", { code: 120 }], // printWidth: 80
            quotes: ["error", "double"], // singleQuote: false
            "comma-dangle": [
                "error",
                {
                    arrays: "never",
                    objects: "always-multiline",
                    imports: "never",
                    exports: "never",
                    functions: "never",
                }
            ],
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                }
            ],
        },
    },
    // Add a specific override for logger.js
    {
        files: ["**/config/logger.js"],
        rules: {
            "no-unused-vars": "off", // Turn off the rule completely for this file
        },
    }
]);
