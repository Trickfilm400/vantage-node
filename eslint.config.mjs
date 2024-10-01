import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      ignores: [
        "dist/**/*.ts",
        "dist/**",
        "**/*.mjs",
        "eslint.config.mjs",
        "**/*.js",
      ],
    },
    {
      files: ["src/**/*.ts"],
      languageOptions: {
        parserOptions: {
          project: true,
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        semi: ["error", "always"],
        "no-var": ["error"],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-control-regex": [0],
        "prettier/prettier": "error",
        "no-unused-vars": [
          "error",
          {
            vars: "all",
            args: "none",
            ignoreRestSiblings: false,
            argsIgnorePattern: "reject",
          },
        ],
        "no-async-promise-executor": [0],
      },
    },
    {
      files: ["test/**"],
      ...tseslint.configs.disableTypeChecked,
    },
    eslintPluginPrettierRecommended,
);