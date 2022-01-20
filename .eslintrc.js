module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
      node: true,
      jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'never'],
      'template-curly-spacing': 'off',
      'no-unused-expressions': 'off',
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'spaced-comment': ['error', 'always'],
      'eol-last': ['error', 'always'],
      'lines-between-class-members': 'off',
      semi: ['error', 'never'],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/class-name-casing': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'no-tabs': 'off',
      'prefer-const': 'off',
      indent: ['off', 4],
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
