module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  // update the extensions
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': 'off',
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
}
