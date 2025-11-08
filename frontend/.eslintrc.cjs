module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'no-debugger': 'warn',
    'consistent-return': 'warn',
    yoda: 'error',
    'no-alert': 'error',
    'no-empty': 'error',
    'default-case': 'error',
    'no-unreachable': 'error',
    'no-useless-return': 'error',
    'no-nested-ternary': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-shadow': 'off',
    curly: 'off',
    'react/no-array-index-key': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/boolean-prop-naming': [
      'error',
      {rule: '^(is|with)[A-Z]([A-Za-z0-9]?)+'},
    ],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/display-name': 'off',
    'jsx-a11y/no-autofocus': 'off',
    semi: 'off',
  },
}
