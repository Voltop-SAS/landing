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
 * PER-LANGUAGE LAYOUT
 * See docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * The language still lives in the URL: every version is static and indexable,
 * and each route's `hreflang` is correct.
 *
 * IT NO LONGER EMITS THE DOCUMENT. `<html>` and `<body>` come from
 * `src/app/layout.tsx`, because without a root layout Next did not resolve the
 * `not-found` boundaries and `[locale]/not-found.tsx` never rendered (see the
 * long comment in `src/app/layout.tsx`). The price is that `<html lang>` stays
 * fixed at the default language, and it is compensated here: the `<div lang>`
 * marks the REAL language of all the content, which is the node screen readers
 * consult.
 *
 * IT DOES NOT REJECT THE LANGUAGE EITHER. It used to call `notFound()`, and
 * that threw before the document existed. Rejection is done by the PAGE — they
 * all keep their `isLocale` guard — so the 404 lands inside this layout, with
 * header, footer and a way out. The metadata below marks `noindex` for an
 * invalid language.
 */

/**
 * CLOSED PARAMS. A `notFound()` thrown from a page resolves no boundary at all
 * in Next 16 with this route tree: it serves an error document with an EMPTY
 * body, and the branded 404 only appears after hydration, so a crawler sees a
 * blank page.
 *
 * With `dynamicParams = false` the rejection happens in the ROUTER: a slug that
 * is not in `generateStaticParams` returns 404 before rendering anything, and
 * that 404 does use `src/app/not-found.tsx`. It is also the right thing for
 * routes generated from data: a slug that does not exist should not render on
 * demand.
 *
 * It costs no flexibility: the site is already fully static and any change to
 * the dataset requires a build.
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
  /* A non-existent locale describes no content and must not be indexed. */
  if (!isLocale(locale)) return { robots: { index: false, follow: true } }

  return {
    /**
     * The brand leads the tab title, and the page's own subject follows.
     *
     * `template` only applies to CHILD segments, so the home page keeps the
     * title it declares for itself — which already opens with the brand. That
     * is what makes the whole site read the same way instead of leading with
     * the brand on the home page and trailing it everywhere else.
     */
    title: {
      default: `${brand.name} — ${t(brand.tagline, locale)}`,
      template: `${brand.name} · %s`,
    },
    description: t(brand.tagline, locale),
    alternates: alternatesFor(locale, routes.home),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      locale: localeMeta[locale].htmlLang,
      url: absoluteUrl(locale, ''),
    },
    /* A DRAFT language is browsable — it has to be reviewable — but it does
       not enter the index while it is incomplete. Following links is still
       allowed: the published version of each page does need to be found. */
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
