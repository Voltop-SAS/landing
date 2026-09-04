import type { Metadata } from 'next'

import {
  locales,
  isLocale,
  isPublished,
  localeMeta,
  defaultLocale,
  t,
  type Locale,
} from '~/core/common/domain/i18n/config'
import { absoluteUrl, alternatesFor, routes } from '~/core/common/domain/i18n/routes'
import { a11y, brand } from '~/core/common/domain/consts/copy'
import { Header } from '@ui/common/components/layout/Header'
import { Footer } from '@ui/common/components/layout/Footer'
import { SmoothScroll } from '@ui/common/components/layout/SmoothScroll'
import { AppFloating } from '@ui/common/components/layout/AppFloating'
import { CookieConsent } from '@ui/common/components/layout/CookieConsent'

/**
 * LAYOUT POR IDIOMA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * El idioma sigue viviendo en la URL: ambas versiones son estáticas e
 * indexables y el `hreflang` de cada ruta es correcto.
 *
 * YA NO EMITE EL DOCUMENTO. `<html>` y `<body>` los emite `app/layout.tsx`,
 * porque sin layout raíz Next no resolvía los boundaries de `not-found` y
 * `[locale]/not-found.tsx` no se renderizaba nunca (ver el comentario largo de
 * `app/layout.tsx`). El precio es que `<html lang>` queda fijo en el idioma por
 * defecto, y se compensa aquí: el `<div locale>` marca el idioma REAL de todo el
 * contenido, que es el nodo que consultan los lectores de pantalla.
 *
 * TAMPOCO RECHAZA EL IDIOMA. Antes llamaba a `notFound()` y eso lanzaba antes
 * de que existiera el documento. El rechazo lo hace la PÁGINA —todas conservan
 * su guarda `isLocale`—, así que el 404 aterriza dentro de este layout, con
 * header, footer y navegación de salida. La metadata de abajo marca `noindex`
 * para un idioma inválido.
 */

/**
 * PARAMS CERRADOS. `notFound()` lanzado desde una página no resuelve ningún
 * boundary en Next 16 con este árbol de rutas: sirve un documento de error con
 * el body VACÍO y el 404 con marca solo aparece tras hidratar, así que un
 * crawler ve una página en blanco.
 *
 * Con `dynamicParams = false` el rechazo lo hace el ROUTER: un slug que no está
 * en `generateStaticParams` devuelve 404 antes de renderizar nada, y ese 404 sí
 * usa `app/not-found.tsx`. Es además lo correcto para rutas generadas desde
 * datos: un slug inexistente no debe renderizarse bajo demanda.
 *
 * No cuesta flexibilidad: el sitio ya es estático por completo y cualquier
 * cambio en el dataset exige un build.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  /* Un idioma inexistente no describe ningún contenido y no debe indexarse. */
  if (!isLocale(locale)) return { robots: { index: false, follow: true } }

  return {
    title: {
      default: `${brand.name} — ${t(brand.tagline, locale)}`,
      template: `%s · ${brand.name}`,
    },
    description: t(brand.tagline, locale),
    alternates: alternatesFor(locale, routes.home),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      locale: localeMeta[locale].htmlLang,
      url: absoluteUrl(locale, ''),
    },
    /* Un idioma en BORRADOR es navegable —hay que poder revisarlo— pero no
       entra al índice mientras esté incompleto. Se sigue permitiendo seguir
       los enlaces: la versión publicada de cada página sí debe descubrirse. */
    robots: { index: isPublished(locale), follow: true },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale: Locale = isLocale(raw) ? raw : defaultLocale

  return (
    <div lang={localeMeta[locale].htmlLang}>
      <a
        href="#contenido"
        className="skip-link inline-flex min-h-11 items-center rounded-(--radius-pill) bg-brand px-5 font-medium text-on-brand"
      >
        {t(a11y.skipToContent, locale)}
      </a>
      <SmoothScroll />
      <Header locale={locale} />
      <main id="contenido">{children}</main>
      <AppFloating locale={locale} />
      <CookieConsent locale={locale} />
      <Footer locale={locale} />
    </div>
  )
}
