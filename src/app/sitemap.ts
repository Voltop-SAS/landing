import type { MetadataRoute } from 'next'
import { publishedLocales, defaultLocale, localeMeta } from '~/core/common/domain/i18n/config'
import { routes, absoluteUrl } from '~/core/common/domain/i18n/routes'
import { legalDocs } from '@/content/data/legal-docs'
import { assertPublishedLocalesComplete } from '@/lib/i18n/audit'
import { getStations, getCities, getPostsWithPage, getLatestPostDate } from '@/lib/data'

/**
 * SITEMAP generado desde los datos (§29).
 * Añadir una estación, una ciudad o una entrada del registro la incluye
 * automáticamente, con sus alternativas de idioma. Cero mantenimiento manual.
 *
 * ── SOBRE `lastModified` ──────────────────────────────────────────────────
 * Antes TODAS las URLs declaraban `new Date()`, así que en cada build el sitio
 * entero afirmaba haber cambiado ese día. Un sitemap que dice "todo cambió
 * hoy" siempre es un sitemap que no dice nada: el buscador aprende a
 * ignorarlo, y con él pierde la señal de lo que sí cambió de verdad.
 *
 * Ahora cada URL declara la fecha que puede sostener:
 * - Una entrada del registro, la suya.
 * - El índice de novedades, la de su entrada más reciente.
 * - Las páginas cuyo contenido no tiene fecha propia siguen usando la del
 *   build, que es la única disponible y honesta para ellas.
 */
type Entry = {
  path: string
  priority: number
  lastModified: Date
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* El sitemap declara qué idiomas existen de cara al público, así que es su
     trabajo verificar que ninguno se anuncia a medias. Rompe el build si un
     idioma publicado tiene huecos. */
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
      /* El índice sí cambia a menudo: es lo que justifica que se vuelva a
         rastrear. Cada entrada, en cambio, no cambia una vez publicada. */
      changeFrequency: 'weekly',
    },
    { path: routes.nosotros, priority: 0.7, lastModified: build, changeFrequency: 'monthly' },
    /* Los legales entran al sitemap desde que tienen texto definitivo, y con
       SU fecha real de emisión —no la del build—, que es justo lo que la
       cabecera de este archivo reprocha. Prioridad baja: existen para ser
       encontrados cuando se buscan, no para competir con las páginas de
       producto. */
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
    /* Solo las entradas con página propia: una entrada que vive únicamente en
       el índice no tiene URL que ofrecer. */
    ...(await getPostsWithPage()).map((p) => ({
      path: routes.post(p.slug),
      priority: 0.6,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
    })),
    /* La política de privacidad se añadirá cuando tenga texto definitivo:
       hasta entonces está marcada como no indexable. */
  ]

  return entries.flatMap(({ path, priority, lastModified, changeFrequency }) =>
    publishedLocales.map((lang) => ({
      url: absoluteUrl(lang, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        /**
         * La clave es el código de BUSCADOR (`localeMeta[l].hreflang`), no el
         * segmento de URL. Hoy coinciden en los idiomas publicados, así que la
         * diferencia es invisible; con un idioma regional dejan de coincidir
         * —URL `/pt`, hreflang `pt-BR`— y el sitemap declararía sobre la misma
         * URL un idioma distinto del que declara su HTML.
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
