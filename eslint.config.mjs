import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import hexagonalArchitecture from 'eslint-plugin-hexagonal-architecture'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // El núcleo de dominio no puede depender de infraestructura. La regla es la
  // del scaffold corporativo y solo aplica a `src/core/**`, que hoy todavía no
  // existe: queda armada para cuando la capa de dominio aterrice aquí.
  {
    files: ['src/core/**/*.ts'],
    plugins: {
      'hexagonal-architecture': hexagonalArchitecture,
    },
    rules: {
      'hexagonal-architecture/enforce': ['error'],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    // Skills instaladas: código de terceros. `npx eslint .` devolvía 147
    // warnings suyos y enterraba los del proyecto. Van en dos sitios porque el
    // instalador cambió de destino: las viejas en `.claude/`, las nuevas en
    // `.agents/` (con enlace simbólico desde `.claude/skills/`).
    '.claude/**',
    '.agents/**',
  ]),
])

export default eslintConfig
