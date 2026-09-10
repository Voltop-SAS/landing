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

Module directories under `src/core` are English too — `network`, `news`,
`business`, `about` — even though the public URL segments they serve are
Spanish. The directory is code; the segment is an indexed URL. Both facts are
true at once and neither is a mistake.

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
- **Analytics event names and their property names** — `generate_lead`,
  `view_station`, `station_search`, and the props they carry (`placement`,
  `segment`, `results_count`…). They are the measurement plan. Both the event
  and its props land in the analytics dashboard as names someone reads, and
  renaming one silently splits a metric or a dimension in two.

  **These are in ENGLISH since 2026-09-09** (Tagging Plan v1.1). They used to be
  Spanish. The change was made in one commit, on a dated cut-over, and the
  catalogue is closed in
  `src/core/common/domain/entities/AnalyticsEvent.ts` — the compiler rejects
  anything not on the list. The reason for English: `generate_lead`, `search`
  and `select_item` are GA4's own recommended names, and GA4 turns on reports
  for them that custom names never populate.

  Being a contract is what did NOT change: a name here is not renamed on
  somebody's judgement. Changing one is a decision with a date, all at once, and
  this paragraph gets updated with it.

  **The STORED values inside those props are a separate matter and stay in
  Spanish**: `operativa`, `aceptado`, `rechazado`. Those are data, already
  written in databases and in visitors' browsers. Renaming one is a migration.
- **Query parameters of the station finder** — `ciudad`, `conector`, `orden`.
  They appear in shareable, indexable URLs.
- **Domain status literals** — `operativa`, `proxima`, `mantenimiento`, and
  `publicado` / `borrador`. They are stored data values; renaming them is a
  data migration, not a rename.
- **Locale keys** — `es`, `en`, `pt`.

The test is simple: if something outside this repository — a search engine, an
analytics dashboard, a saved link, a dataset — would notice the rename, it is a
contract. Otherwise it is code, and code is in English.
