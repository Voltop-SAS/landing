import { defaultLocale, localeMeta, t } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { states, a11y } from '~/core/common/domain/consts/copy'
import { Container } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Header } from '@ui/common/components/layout/Header'
import { Footer } from '@ui/common/components/layout/Footer'

/**
 * NOT FOUND · the site's only one
 *
 * ── WHAT IT HANDLES ───────────────────────────────────────────────────────
 * Everything. A route Next cannot map (`/es/ruta-inexistente`), an invalid
 * language (`/fr`, `/xyz`), a station or a city that is not in the dataset.
 * Each of those cases used to serve Next's internal error document: no
 * `<html lang>`, no styles, no brand and — worst of all — with an EMPTY
 * `<body>`, so a crawler saw a blank page and the user saw a flash before the
 * JS painted anything. The people receiving it were precisely those arriving
 * from somebody else's broken link.
 *
 * ── WHY IT IS THE ONLY ONE ────────────────────────────────────────────────
 * There used to be a `src/app/[locale]/not-found.tsx` as well, and it NEVER
 * rendered: in Next 16 a `notFound()` thrown from a page does not resolve the
 * nested boundary in this route tree, not even with a root layout. It was
 * deleted rather than left as a decorative file.
 *
 * What does work is rejecting at the ROUTER: segments generated from data
 * declare `dynamicParams = false`, so an unknown slug returns 404 before
 * rendering anything, and that 404 lands here, with real content in the served
 * HTML.
 *
 * ── THE LANGUAGE ──────────────────────────────────────────────────────────
 * It mounts Header and Footer in the default language. In a dead end there is
 * no reliable `Locale` to infer — an invalid language is often the cause of the
 * 404 — and having full navigation is worth more than getting the language
 * right: someone who mistyped a station URL wants to keep browsing, not just
 * two buttons (§10, actionable states).
 */

export const metadata = {
  title: '404',
  /* A route that does not exist does not go in the index. */
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const locale = defaultLocale

  return (
    <div lang={localeMeta[locale].htmlLang}>
      <a
        href="#contenido"
        className="skip-link inline-flex min-h-11 items-center rounded-(--radius-pill) bg-brand px-5 font-medium text-on-brand"
      >
        {t(a11y.skipToContent, locale)}
      </a>
      <Header locale={locale} />

      <main id="contenido">
        <Container
          width="narrow"
          className="flex min-h-[72dvh] flex-col justify-center py-32"
        >
          <p className="font-mono text-mono uppercase tracking-wider text-ink-3">404</p>
          <h1 className="mt-5 font-display text-display-l font-semibold text-balance text-ink">
            {t(states.notFound.title, locale)}
          </h1>
          <p className="mt-5 measure text-body-l text-ink-2">{t(states.notFound.body, locale)}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              arrow
              href={href(locale, routes.network)}
            >
              {t(states.notFound.action, locale)}
            </Button>
            <Button
              variant="ghost"
              href={href(locale, routes.home)}
            >
              {t(states.notFound.home, locale)}
            </Button>
          </div>
        </Container>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
