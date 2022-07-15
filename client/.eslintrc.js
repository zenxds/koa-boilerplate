module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 7,
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['import', 'react'],
  globals: {
    _dx: true,
    __webpack_public_path__: true,
    API_SERVER_PLACEHOLDER: true,
  },
  rules: {
    quotes: ['warn', 'single'],
    'no-unused-vars': 'warn',
    'no-console': [
      'error',
      {
        allow: ['log', 'warn', 'error'],
      },
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
}
