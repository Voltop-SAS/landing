import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import hexagonalArchitecture from 'eslint-plugin-hexagonal-architecture'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The domain core must not depend on infrastructure. The rule comes from the
  // corporate scaffold and is scoped to `src/core/**`, where the domain layer
  // now lives.
  //
  // `.tsx` is included on purpose. Every module keeps its components under
  // `infrastructure/ui/components/`, so a `.ts`-only glob would check the
  // domain — where a violation is least likely — and skip the components,
  // which is exactly where one module reaching into another would show up.
  {
    files: ['src/core/**/*.{ts,tsx}'],
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
    // Installed skills: third-party code. `npx eslint .` reported 147 warnings
    // of their own, burying the project's. They live in two places because the
    // installer changed its target: the old ones under `.claude/`, the new ones
    // under `.agents/` (symlinked from `.claude/skills/`).
    '.claude/**',
    '.agents/**',
  ]),
])

export default eslintConfig
