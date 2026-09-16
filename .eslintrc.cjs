module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['server/**/*.js'],
      env: { node: true },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**'],
      env: { node: true },
    },
  ],
};
