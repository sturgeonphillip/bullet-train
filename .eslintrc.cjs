module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['attic', 'dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'array-bracket-spacing': 1,
  },
};

/**
 * module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@stylistic/array-bracket-spacing/recommended', // Add this line to include the stylistic array-bracket-spacing rule
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'prettier',
    '@stylistic/array-bracket-spacing', // Add this line to include the plugin
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@stylistic/array-bracket-spacing/array-bracket-spacing': [ // Add this rule
      'error',
      {
        singleValue: true,
        objectsInArrays: false,
        arraysInArrays: false,
        propertyValue: false,
      },
    ],
  },
};

npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier eslint-plugin-prettier prettier eslint-plugin-array-bracket-spacing

"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint --fix ."
}

 */
