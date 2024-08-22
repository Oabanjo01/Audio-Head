import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import importSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "unused-imports": unusedImports,
      "simple-import-sort": importSort,
    },
    rules: {
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: false,
          ignoreMemberSort: true,
          memberSyntaxSortOrder: ["all", "none", "single", "multiple"],
          allowSeparatedGroups: true,
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
