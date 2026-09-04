import { defaultLocale, localeMeta, t } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { states, a11y } from '@/content/copy/common'
import { Container } from '@/components/ui/layout'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

/**
 * PÁGINA NO ENCONTRADA · única del sitio
 *
 * ── QUÉ ATIENDE ───────────────────────────────────────────────────────────
 * Todo. Una ruta que Next no puede mapear (`/es/ruta-inexistente`), un idioma
 * inválido (`/fr`, `/xyz`), una estación o una ciudad que no está en el
 * dataset. Antes cada uno de esos casos servía el documento de error interno
 * de Next: sin `<html lang>`, sin estilos, sin marca y —lo peor— con el
 * `<body>` VACÍO, así que un crawler veía una página en blanco y el usuario un
 * parpadeo antes de que el JS pintara algo. Lo recibía justo quien llega desde
 * un enlace roto de terceros.
 *
 * ── POR QUÉ ES LA ÚNICA ───────────────────────────────────────────────────
 * Había también un `app/[lang]/not-found.tsx`, que NUNCA se renderizó: en
 * Next 16 un `notFound()` lanzado desde una página no resuelve el boundary
 * anidado en este árbol de rutas, ni con layout raíz. Se eliminó en lugar de
 * dejarlo como archivo decorativo.
 *
 * Lo que sí funciona es rechazar en el ROUTER: los segmentos generados desde
 * datos declaran `dynamicParams = false`, así que un slug desconocido devuelve
 * 404 antes de renderizar nada y ese 404 aterriza aquí, con contenido real en
 * el HTML servido.
 *
 * ── EL IDIOMA ─────────────────────────────────────────────────────────────
 * Monta Header y Footer con el idioma por defecto. En un callejón sin salida no
 * hay `Locale` fiable que deducir —el idioma inválido es a menudo la causa del
 * 404—, y tener la navegación completa vale más que acertar el idioma: quien
 * escribió mal una URL de estación quiere seguir navegando, no solo dos
 * botones (§10, estados accionables).
 */

export const metadata = {
  title: '404',
  /* Una ruta inexistente no entra en el índice. */
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const lang = defaultLocale

  return (
    <div lang={localeMeta[lang].htmlLang}>
      <a
        href="#contenido"
        className="skip-link inline-flex min-h-11 items-center rounded-(--radius-pill) bg-brand px-5 font-medium text-on-brand"
      >
        {t(a11y.skipToContent, lang)}
      </a>
      <Header lang={lang} />

      <main id="contenido">
        <Container
          width="narrow"
          className="flex min-h-[72dvh] flex-col justify-center py-32"
        >
          <p className="font-mono text-mono uppercase tracking-wider text-ink-3">404</p>
          <h1 className="mt-5 font-display text-display-l font-semibold text-balance text-ink">
            {t(states.notFound.title, lang)}
          </h1>
          <p className="mt-5 measure text-body-l text-ink-2">{t(states.notFound.body, lang)}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              arrow
              href={href(lang, routes.red)}
            >
              {t(states.notFound.action, lang)}
            </Button>
            <Button
              variant="ghost"
              href={href(lang, routes.home)}
            >
              {t(states.notFound.home, lang)}
            </Button>
          </div>
        </Container>
      </main>

      <Footer lang={lang} />
    </div>
  )
}
