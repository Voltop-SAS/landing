import type { MetadataRoute } from 'next'
import { publishedLocales, defaultLocale, localeMeta } from '~/core/common/domain/i18n/config'
import { routes, absoluteUrl } from '~/core/common/domain/i18n/routes'
import { legalDocs } from '~/core/legal/infrastructure/content/legalDocs'
import { assertPublishedLocalesComplete } from '~/core/common/infrastructure/i18n/audit'
import {
  getStations,
  getCities,
  getPostsWithPage,
  getLatestPostDate,
} from '~/core/common/infrastructure/data-access'

/**
 * SITEMAP generated from the data (§29).
 * Adding a station, a city or a log entry includes it automatically, with its
 * language alternates. Zero manual maintenance.
 *
 * ── ABOUT `lastModified` ──────────────────────────────────────────────────
 * EVERY URL used to declare `new Date()`, so on each build the whole site
 * claimed to have changed that day. A sitemap that says "everything changed
 * today" every time is a sitemap that says nothing: the search engine learns to
 * ignore it, and with it loses the signal about what actually did change.
 *
 * Now each URL declares the date it can support:
 * - A log entry, its own.
 * - The news index, the date of its most recent entry.
 * - Pages whose content has no date of its own keep using the build date,
 *   which is the only one available and honest for them.
 */
type Entry = {
  path: string
  priority: number
  lastModified: Date
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* The sitemap declares which languages exist publicly, so it is its job to
     verify that none is announced half done. It breaks the build if a published
     language has gaps. */
  assertPublishedLocalesComplete()

  const build = new Date()
  const latestPost = await getLatestPostDate()

  const entries: Entry[] = [
    { path: routes.home, priority: 1, lastModified: build, changeFrequency: 'monthly' },
    { path: routes.red, priority: 0.9, lastModified: build, changeFrequency: 'monthly' },
    { path: routes.empresas, priority: 0.9, lastModified: build, changeFrequency: 'monthly' },
    {
      path: routes.novedades,
      priority: 0.8,
      lastModified: latestPost ? new Date(latestPost) : build,
      /* The index does change often: that is what justifies re-crawling it.
         Each entry, by contrast, does not change once published. */
      changeFrequency: 'weekly',
    },
    { path: routes.nosotros, priority: 0.7, lastModified: build, changeFrequency: 'monthly' },
    /* The legal pages enter the sitemap now that they have final text, and
       with THEIR real date of issue — not the build's — which is exactly what
       this file's header complains about. Low priority: they exist to be found
       when someone looks for them, not to compete with the product pages. */
    {
      path: routes.terms,
      priority: 0.3,
      lastModified: new Date(legalDocs.terms.actualizadoISO),
      changeFrequency: 'yearly',
    },
    {
      path: routes.privacy,
      priority: 0.3,
      lastModified: new Date(legalDocs.privacy.actualizadoISO),
      changeFrequency: 'yearly',
    },
    ...getCities().map((c) => ({
      path: routes.city(c.slug),
      priority: 0.8,
      lastModified: build,
      changeFrequency: 'monthly' as const,
    })),
    ...getStations().map((s) => ({
      path: routes.station(s.slug),
      priority: 0.6,
      lastModified: build,
      changeFrequency: 'monthly' as const,
    })),
    /* Only entries with a page of their own: an entry that lives solely in the
       index has no URL to offer. */
    ...(await getPostsWithPage()).map((p) => ({
      path: routes.post(p.slug),
      priority: 0.6,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
    })),
  ]

  return entries.flatMap(({ path, priority, lastModified, changeFrequency }) =>
    publishedLocales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        /**
         * The key is the SEARCH ENGINE code (`localeMeta[l].hreflang`), not the
         * URL segment. They coincide today for the published languages, so the
         * difference is invisible; with a regional language they stop
         * coinciding — URL `/pt`, hreflang `pt-BR` — and the sitemap would
         * declare, for the same URL, a different language than its HTML does.
         */
        languages: {
          ...Object.fromEntries(
            publishedLocales.map((l) => [localeMeta[l].hreflang, absoluteUrl(l, path)]),
          ),
          'x-default': absoluteUrl(defaultLocale, path),
        },
      },
    })),
  )
}
