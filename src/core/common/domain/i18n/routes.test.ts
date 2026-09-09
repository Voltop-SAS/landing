import { describe, expect, it } from 'vitest'
import { href, stripLocale, switchLocalePath, absoluteUrl, alternatesFor } from './routes'
import { locales, publishedLocales, defaultLocale, localeMeta } from './config'

/**
 * `stripLocale` is tested first and in most detail because its regular
 * expression already went wrong once: it used to be written by hand in two
 * different files and one of the two copies lacked the `(?=/|$)` lookahead.
 * Without it, `^/(es|en)` also matches the beginning of `/estaciones` and
 * trims the path to `taciones`.
 *
 * No route on the site starts that way today, which is exactly why the case
 * needs a test: nothing else in the project would notice if the lookahead
 * disappeared.
 */
describe('stripLocale', () => {
  it('removes the prefix of every declared language', () => {
    for (const locale of locales) {
      expect(stripLocale(`/${locale}/red`)).toBe('/red')
    }
  })

  it('returns "" for a language home page', () => {
    expect(stripLocale('/es')).toBe('')
  })

  it('does NOT eat a path that merely starts with the same letters', () => {
    /* The regression: without the lookahead this returned "taciones". */
    expect(stripLocale('/estaciones')).toBe('/estaciones')
    expect(stripLocale('/estaciones/wake')).toBe('/estaciones/wake')
    /* `en` against a hypothetical `/enlaces`, same shape in another language. */
    expect(stripLocale('/enlaces')).toBe('/enlaces')
  })

  it('leaves a path with no language prefix untouched', () => {
    expect(stripLocale('/red/bogota')).toBe('/red/bogota')
  })

  it('removes only the FIRST prefix, not one appearing deeper in', () => {
    expect(stripLocale('/es/red/es')).toBe('/red/es')
  })
})

describe('switchLocalePath', () => {
  it('swaps the language and keeps the rest of the path', () => {
    expect(switchLocalePath('/es/red/bogota', 'en')).toBe('/en/red/bogota')
  })

  it('works from a home page', () => {
    expect(switchLocalePath('/es', 'pt')).toBe('/pt')
  })

  /**
   * The language switcher lives in the header of every page, so this is the
   * one that turns a broken prefix into a site-wide dead link.
   */
  it('does not corrupt a path that starts like a language code', () => {
    expect(switchLocalePath('/estaciones', 'en')).toBe('/en/estaciones')
  })
})

describe('href', () => {
  it('prefixes a canonical route', () => {
    expect(href('es', '/red')).toBe('/es/red')
  })

  it('produces the language home page for the empty route', () => {
    expect(href('en', '')).toBe('/en')
  })
})

/**
 * What matters in `alternatesFor` is not the shape of the object but the two
 * decisions it encodes, both of which are invisible until a search engine
 * gets them wrong.
 */
describe('alternatesFor', () => {
  it('keys the alternates by SEARCH ENGINE code, not by URL segment', () => {
    /* They coincide today for es and en; for pt they do not — the URL is `/pt`
       and the hreflang is `pt-BR`. That divergence is the whole reason the two
       are separate fields, so it is what gets asserted. */
    const { languages } = alternatesFor('es', '/red')
    expect(languages).toHaveProperty(localeMeta.pt.hreflang, absoluteUrl('pt', '/red'))
    expect(localeMeta.pt.hreflang).not.toBe('pt')
  })

  it('points x-default at the default language', () => {
    const { languages } = alternatesFor('en', '/red')
    expect(languages['x-default']).toBe(absoluteUrl(defaultLocale, '/red'))
  })

  it('declares the canonical of the language it was asked about', () => {
    expect(alternatesFor('en', '/red').canonical).toBe(absoluteUrl('en', '/red'))
  })

  /**
   * A SURVIVING MUTANT, written down instead of hidden.
   *
   * `alternatesFor` deliberately iterates `publishedLocales` and not `locales`:
   * an `hreflang` is an invitation to index, so announcing a draft language
   * would push it into search results precisely while it is half translated.
   *
   * That guarantee is NOT provable today. All three languages are currently
   * `publicado`, so `publishedLocales` and `locales` hold the same values and
   * the two implementations are indistinguishable — swapping one for the other
   * leaves every test in this file green. Verified by mutation, not assumed.
   *
   * The assertion below is therefore the honest one: it pins the coupling, so
   * that the day a language goes to `borrador` the count stops matching and
   * this test starts doing the work it cannot do yet. Inflating it until it
   * looked like proof would be worse than saying it is not.
   */
  it('announces exactly the published languages, plus x-default', () => {
    const { languages } = alternatesFor('es', '/red')
    expect(Object.keys(languages)).toHaveLength(publishedLocales.length + 1)
  })
})
