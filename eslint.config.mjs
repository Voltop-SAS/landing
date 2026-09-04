import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skills instaladas: código de terceros. `npx eslint .` devolvía 147
    // warnings suyos y enterraba los del proyecto. Van en dos sitios porque el
    // instalador cambió de destino: las viejas en `.claude/`, las nuevas en
    // `.agents/` (con enlace simbólico desde `.claude/skills/`).
    ".claude/**",
    ".agents/**",
  ]),
]);

export default eslintConfig;
