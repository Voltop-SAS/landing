import hexagonalArchitecture from 'eslint-plugin-hexagonal-architecture';

export default [
  {
    files: ['src/**/*.{ts}'],
    plugins: {
      'hexagonal-architecture': hexagonalArchitecture,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'hexagonal-architecture/enforce': 'error',
    },
  },
];
