import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { footer, brand, a11y } from '~/core/common/domain/consts/copy'
import { Container } from '@ui/common/components/ui/layout'
import { Logo } from '@ui/common/components/layout/Logo'
import { SocialLinks } from '@ui/common/components/layout/SocialLinks'
import { externalLinks, soporteEmail } from '~/core/common/domain/consts/links'

/**
 * FOOTER · Server Component
 * Ver docs/MASTER-PROJECT-DEFINITION.md §15.
 *
 * Tres columnas con destinos REALES. Se eliminaron:
 * - el bloque de métricas (duplicaba las de la página),
 * - los enlaces que apuntaban al mismo destino con etiquetas distintas,
 * - los enlaces `#` sin destino,
 * - los iconos de redes sociales no interactivos.
 *
 * Un enlace sin destino real no se publica. App, ayuda, legal y redes se
 */
export function Footer({ lang }: { lang: Locale }) {
  const year = new Date().getFullYear()

  return (
    /* `pb` extra en móvil: al llegar al fondo del documento no queda scroll
       para apartar la barra flotante, así que tapaba de forma permanente los
       enlaces legales. Reservar el espacio es la única solución real —
       esconderla ahí abajo la quitaría justo donde más se decide.

       El valor se recalculó cuando la barra pasó a dos filas: mide 126px a
       390px y 145px a 320px, más 12px de separación del borde. Con el 5.5rem
       anterior —dimensionado para la barra de una fila, 70px— los enlaces
       legales acababan a 707px y la barra empezaba a 706: quedaban A UN PÍXEL,
       y cualquier idioma más largo los metía debajo. Ahora son 11rem (176px),
       que cubre el peor caso con margen.

       Desaparece en `lg`, donde el flotante es una tarjeta en la esquina y no
       cruza el pie. */
    <footer className="border-t border-line bg-surface-1 pb-[calc(11rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Container className="py-(--spacing-section-tight)">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-8">
          <div>
            <Link
              href={href(lang, routes.home)}
              className="inline-flex min-h-11 items-center gap-2.5"
              aria-label={t(a11y.goHome, lang)}
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-body-s text-ink-3">{t(brand.tagline, lang)}</p>
            {/* El correo de soporte, visible y en texto. Está declarado en la
                Política de Tratamiento de Datos como dato de contacto de
                VOLTOP S.A.S., así que es el canal oficial y merece estar donde
                se busca: el footer. Se muestra COMPLETO en lugar de esconderlo
                tras un "Contáctanos", porque un correo que se puede copiar de
                un vistazo ahorra un clic y un formulario. */}
            <a
              href={externalLinks.soporte}
              className="mt-5 inline-flex min-h-11 items-center font-mono text-mono text-ink-2 transition-colors hover:text-brand"
            >
              {soporteEmail}
            </a>
            <SocialLinks lang={lang} />
          </div>

          <nav
            className="contents"
            aria-label={t(a11y.footerNav, lang)}
          >
            {footer.columns.map((col) => (
              <div key={col.title.es}>
                {/* Etiqueta, no encabezado. Como `<h2>` de 12px entraba en el
                    outline del documento al mismo nivel que los `h2` de
                    contenido y los enanizaba. La navegación del pie ya se
                    anuncia por el `aria-label` del `<nav>`. */}
                <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                  {t(col.title, lang)}
                </p>
                <ul className="mt-4 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label.es}>
                      <Link
                        href={href(lang, link.href)}
                        className="inline-flex min-h-11 items-center text-body-s text-ink-2 transition-colors hover:text-ink"
                      >
                        {t(link.label, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 text-caption text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. {t(footer.rights, lang)}
          </p>
          <div className="flex flex-wrap items-center gap-x-6">
            <Link
              href={href(lang, routes.terms)}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            >
              {t(footer.terms, lang)}
            </Link>
            <Link
              href={href(lang, routes.privacy)}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            >
              {t(footer.privacy, lang)}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
