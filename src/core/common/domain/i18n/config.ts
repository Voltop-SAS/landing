/**
 * i18n · Base configuration
 * See docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * The model is static routes with a language prefix. There is no client state:
 * the language IS the URL. That guarantees (a) the language survives
 * navigation, (b) the `lang` we serve is correct, and (c) every version is
 * indexable.
 *
 * ADDING A LANGUAGE = ADDING ONE ENTRY TO `locales` AND ONE TO `localeMeta`.
 * Nothing else should change. Everything that depends on the set of languages
 * — the switcher, the `hreflang` tags, the sitemap, stripping the prefix from
 * routes — is derived from here and never written by hand.
 */

export const locales = ['es', 'en', 'pt'] as const
export type Locale = (typeof locales)[number]

/**
 * The base language. Typed as the LITERAL `"es"` rather than as `Locale`, and
 * that is what lets TypeScript prove that the fallback in `t()` always exists
 * — `Localized` declares `es` as its only required key — and what makes
 * `Exclude<Locale, typeof defaultLocale>` actually resolve to the translatable
 * languages. Annotate it as `Locale` and both properties are lost.
 */
export const defaultLocale = 'es' as const satisfies Locale

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/* ---------------------------------------------------------------- */
/* Publication status per language                                   */
/* ---------------------------------------------------------------- */

/**
 * A language EXISTS long before it is ready. Without this status, the only way
 * to work on a new language was to have it fully translated before the first
 * commit — or to ship it half done, which is worse.
 *
 * - `publicado` — appears in the switcher, the sitemap and the `hreflang` tags.
 * - `borrador`  — reachable by URL so it can be reviewed, but kept out of the
 *                 switcher, out of the sitemap, without `hreflang` and marked
 *                 `noindex`. Anything missing falls back to the default
 *                 language.
 *
 * The two values stay in Spanish because they are stored domain data, not
 * naming style: see the contract list in AGENTS.md.
 */
export type LocaleStatus = 'publicado' | 'borrador'

export const localeStatus: Record<Locale, LocaleStatus> = {
  es: 'publicado',
  en: 'publicado',
  /* Brazilian Portuguese. A strategic decision aimed at an investment
     audience. Published on 2026-09-01 with full coverage verified by the build
     audit. */
  pt: 'publicado',
}

/** The languages the site offers publicly. */
export const publishedLocales = locales.filter((l) => localeStatus[l] === 'publicado')

export function isPublished(locale: Locale): boolean {
  return localeStatus[locale] === 'publicado'
}

/* ---------------------------------------------------------------- */
/* Multi-language text                                               */
/* ---------------------------------------------------------------- */

/**
 * Text in several languages.
 *
 * The BASE language (Spanish) is required; the rest are optional. That is a
 * deliberate change from the earlier model, which required all of them.
 *
 * ── WHY IT WAS RELAXED ────────────────────────────────────────────────────
 * Requiring all of them had one real virtue — no language fell back to Spanish
 * without somebody noticing — and two costs that only show up once there is a
 * third language:
 *
 * 1. A new language does not compile until it is 100% translated, so there is
 *    no way to make progress in parts, and nothing can be reviewed halfway.
 * 2. It does not allow content that legitimately does not exist in every
 *    language. A statement about a partnership in Bogotá is not always
 *    translated into Portuguese, and a type that demands it does not get you a
 *    translation: it gets you somebody pasting the Spanish into the Portuguese
 *    field. That is still a silent fallback, except now it is undetectable.
 *
 * ── WHAT REPLACES THE GUARANTEE ───────────────────────────────────────────
 * A missing translation stops being a type error and becomes a measured fact:
 * `~/core/common/infrastructure/i18n/audit` walks all the content on every
 * build, reports each language's coverage and **breaks the build if a
 * PUBLISHED language has gaps**. The guarantee is the same where it matters —
 * nothing ships half translated — and now the work can actually proceed.
 *
 * Anything that is not translated (proper nouns, units) is modelled as a plain
 * string.
 */
export type Localized<T = string> = { es: T } & {
  [K in Exclude<Locale, typeof defaultLocale>]?: T
}

/**
 * Resolves a text to the active language.
 *
 * With no translation it falls back to the default language. It deliberately
 * does NOT warn to the console: a draft language would fire hundreds of
 * warnings per page and bury every other message. The build audit is what
 * keeps count.
 */
export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale]
}

/**
 * Language metadata.
 *
 * - `label`   — the switcher's short label (ES · EN).
 * - `name`    — the language name IN ITS OWN LANGUAGE. A Portuguese speaker
 *               looks for "Português", not "Portugués": translating a language
 *               name into a language the reader does not understand is exactly
 *               what breaks a language switcher.
 * - `htmlLang`— the value of the document's `lang` attribute.
 * - `hreflang`— the code search engines see. It is kept SEPARATE from
 *               `htmlLang` because the two do not always match: Spanish is
 *               declared generic (`es`) to reach every Spanish speaker, while
 *               the document is marked `es-CO` for pronunciation and
 *               formatting.
 */
export const localeMeta: Record<
  Locale,
  { label: string; name: string; htmlLang: string; hreflang: string }
> = {
  es: { label: 'ES', name: 'Español', htmlLang: 'es-CO', hreflang: 'es' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', hreflang: 'en' },
  /* A short `/pt` URL, but `pt-BR` for search engines: there is no European
     version to compete with, and declaring the generic `pt` for text written
     in Brazilian Portuguese describes it poorly. */
  pt: { label: 'PT', name: 'Português', htmlLang: 'pt-BR', hreflang: 'pt-BR' },
}

/* ---------------------------------------------------------------- */
/* Placeholders inside product copy                                  */
/* ---------------------------------------------------------------- */

/**
 * Fills the `{name}` placeholders a piece of copy carries.
 *
 * ── WHY COPY CARRIES PLACEHOLDERS AT ALL ──────────────────────────────────
 * Because §33 forbids writing a figure by hand, and a sentence that names one
 * is a figure written by hand. The city cards used to read "con 80 kW y seis
 * puntos de carga" per city, typed into prose: true the day it was written and
 * silently wrong the day a station came in. A template with `{points}` and
 * `{kw}` cannot go stale, because the numbers arrive from the dataset every
 * time it renders.
 *
 * ── WHY IT IS ONE FUNCTION AND NOT A `.replace()` AT EACH CALL SITE ───────
 * There were four of those, in two pages and two components, each repeating
 * both the brace syntax and the fallback behaviour. A placeholder convention
 * that lives in four places is a convention nobody can change.
 *
 * A name that is not in `values` is LEFT AS IT IS rather than blanked: copy
 * and code get edited by different people on different days, and a visible
 * `{kw}` is a bug someone reports, while an empty gap is one nobody sees.
 *
 * For a placeholder that has to become a LINK rather than text — the policy
 * inside a consent sentence — see `TextSlot` in the UI layer. It splits on the
 * same syntax.
 */
export function fill(text: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (out, [name, value]) => out.replaceAll(`{${name}}`, String(value)),
    text,
  )
}
