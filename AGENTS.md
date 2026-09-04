<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

These rules are not stylistic preferences. They are the team's convention and
they override whatever the surrounding code happens to look like today.

## The language of the code is English

**File names, identifiers and comments are written in English.** This applies
to variables, functions, types, props, hooks, CSS custom properties and every
comment and doc block, including long explanatory ones. It applies to new code
and to any code you touch.

Do not skip this because the file you opened is written in Spanish. Most of
this codebase predates the rule and is being converted; matching the local
style perpetuates the thing being removed. If you edit a Spanish-named symbol,
rename it. If you rewrite a Spanish comment, write the new one in English.

### What stays in Spanish, because it is a contract and not style

Translating any of these breaks something real. They are deliberate, and they
are not exceptions you may extend on your own judgement:

- **Product copy.** Everything under `domain/consts/copy.ts` and
  `infrastructure/content/` is what users read, in `es` / `en` / `pt`.
- **Public URL segments** — `/red`, `/empresas`, `/nosotros`, `/novedades`,
  `/legal/privacidad`, `/legal/terminos`, `/red/estacion`. They stay in Spanish
  in every language. Changing one breaks indexed URLs.
- **Analytics event names** — `ciudad_vista`, `red_buscar`, `lead_form_envio`…
  They are the measurement plan, and renaming one silently splits a metric in
  two.
- **Query parameters of the station finder** — `ciudad`, `conector`, `orden`.
  They appear in shareable, indexable URLs.
- **Domain status literals** — `operativa`, `proxima`, `mantenimiento`, and
  `publicado` / `borrador`. They are stored data values; renaming them is a
  data migration, not a rename.
- **Locale keys** — `es`, `en`, `pt`.

The test is simple: if something outside this repository — a search engine, an
analytics dashboard, a saved link, a dataset — would notice the rename, it is a
contract. Otherwise it is code, and code is in English.
