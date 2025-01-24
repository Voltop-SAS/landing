// eslint.config.js
import hexagonalArchitecture from 'eslint-plugin-hexagonal-architecture';

export default [
  {
    ignores: [
      // Agrega patrones para ignorar archivos aquí si es necesario
    ],
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
  {
    files: ['src/**/*.ts'],
    rules: {
      'hexagonal-architecture/enforce': 'error',
    },
  },
];
