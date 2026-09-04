/**
 * i18n · Localized routes
 *
 * URL segments stay in Spanish across every language (/en/red, not
 * /en/network). That is open decision O2 of the Master Project Definition:
 * localizing them is desirable but not blocking, and doing it later only means
 * changing this file.
 *
 * Note the asymmetry, because it is deliberate: the MODULE directories under
 * `src/core` are English (`network`, `news`, `business`, `about`) while the
 * public segments they serve are Spanish. The directory is code; the segment is
 * an indexed URL, and so a contract.
 *
 * NOTHING IN THIS FILE LISTS THE LANGUAGES BY HAND. Everything derives from
 * `locales`, so that adding a language never means hunting through the project
 * for wherever the previous set was written down.
 */

import { locales, publishedLocales, defaultLocale, localeMeta, type Locale } from './config'

/** The site's canonical routes, without a language prefix. */
export const routes = {
  home: '',
  red: '/red',
  empresas: '/empresas',
  nosotros: '/nosotros',
  novedades: '/novedades',
  privacy: '/legal/privacidad',
  terms: '/legal/terminos',
  post: (slug: string) => `/novedades/${slug}`,
  city: (slug: string) => `/red/${slug}`,
  station: (slug: string) => `/red/estacion/${slug}`,
} as const

/** Prefixes a canonical route with the language. `path` must start with "/" or be "". */
export function href(locale: Locale, path: string): string {
  return `/${locale}${path}`
}

/**
 * The language prefix at the start of a path, DERIVED from `locales`.
 *
 * The `(?=\/|$)` is not cosmetic: without it, `^\/(es|en)` also matches the
 * start of `/estaciones` and trims it to `taciones`. No route on the site
 * starts that way today, but the expression used to be written by hand in two
 * different files and one of the two copies did lack the lookahead.
 */
const LOCALE_PREFIX = new RegExp(`^/(${locales.join('|')})(?=/|$)`)

/** Strips the language prefix. Returns "" for the home page. */
export function stripLocale(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '')
}

/**
 * Switches language while keeping the current path.
 * `pathname` is the full path including the language prefix.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  return `/${next}${stripLocale(pathname)}`
}

/**
 * Absolute URLs for the sitemap, canonical tags and hreflang (§29).
 *
 * ── CONFIGURABLE, WITH THE PRODUCTION VALUE AS THE DEFAULT ────────────────
 * It reads `NEXT_PUBLIC_SITE_URL` so that a staging or preview deployment can
 * announce ITS own domain: left undefined, a preview's sitemap, canonicals and
 * hreflang tags would all point at production and tell a search engine that
 * the canonical content lives somewhere else.
 *
 * The default is the real domain, so NOT defining the variable leaves the
 * behaviour exactly as it was. See `.env.example`.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://voltop.co'

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${href(locale, path)}`
}

/**
 * Canonical plus reciprocal hreflang for ONE route, in EVERY language (§29).
 *
 * Each page used to write `{ es: …, en: … }` by hand inside its own
 * `generateMetadata`. That was four copies of the same object and none of them
 * would have noticed a new language: the third language would have shipped
 * published but orphaned of hreflang, which is the signal Google uses to
 * decide which version it serves to whom.
 *
 * `x-default` points at the default language: it is the version served to
 * anyone who matches none of the declared ones.
 */
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: absoluteUrl(locale, path),
    /* PUBLISHED languages only. An `hreflang` is an invitation to index:
       announcing a draft language would put it in search results precisely
       while it is still half done. */
    languages: {
      ...Object.fromEntries(
        publishedLocales.map((l) => [localeMeta[l].hreflang, absoluteUrl(l, path)]),
      ),
      'x-default': absoluteUrl(defaultLocale, path),
    },
  }
}
