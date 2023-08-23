const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    'plugin:@next/next/recommended'
  ],
  plugins: ["import", "prettier"],
  rules: {
    "import/no-anonymous-default-export": OFF,
    "react/display-name": OFF,
    "no-underscore-dangle": "off",
    "no-extra-semi": OFF,
    "no-restricted-syntax": [ERROR, "WithStatement"],
    "@typescript-eslint/quotes": [ERROR, "double"],
    "import/export": OFF,
    quotes: [ERROR, "double"],
    "no-console": OFF,
    "@typescript-eslint/explicit-function-return-type": WARN,
    "@typescript-eslint/no-var-requires": WARN,
    "max-len": [
      ERROR,
      110, // airbnb's default is 100 but we give some additional space for edge cases where prettier is not that strict
      ERROR,
      {
        ignoreUrls: true,
        ignoreComments: false,
      },
    ],
    "@typescript-eslint/indent": OFF, // https://github.com/typescript-eslint/typescript-eslint/issues/1824,
    "@typescript-eslint/no-implied-eval": OFF, // trade-off for faster linting without parserOptions setting
    "@typescript-eslint/no-throw-literal": OFF, // trade-off for faster linting without parserOptions setting
    "import/no-cycle": process.env.HUSKY ? OFF : ERROR,
    "@typescript-eslint/no-unused-vars": ERROR,
    "@typescript-eslint/prefer-optional-chain": WARN,
    "import/extensions": OFF,
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
    ],
  },
  overrides: [
    {
      files: ["*/api/*.ts"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": [OFF],
      },
    },
    {
      files: ["*.test.*"],
      rules: {
        "import/no-named-as-default-member": [OFF],
      },
    },
    {
      files: ["assets/*.tsx", "logos/*.tsx"],
      rules: {
        "max-len": [OFF],
        "@typescript-eslint/no-explicit-any": [OFF],
      }
    },
  ],
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },
};