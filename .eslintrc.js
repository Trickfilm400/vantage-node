module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    semi: ['error', 'always'],
    'no-var': ['error'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-control-regex': [0],
    'prettier/prettier': 'error',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
        argsIgnorePattern: 'reject',
      },
    ],
    'no-async-promise-executor': [0],
  },
};
