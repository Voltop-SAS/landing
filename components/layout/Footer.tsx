import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { footer, brand, a11y } from "@/content/copy/common";
import { Container } from "@/components/ui/layout";
import { Logo } from "@/components/layout/Logo";

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
 * añadirán aquí cuando existan las URLs correspondientes (§32).
 */
export function Footer({ lang }: { lang: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface-1">
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
          </div>

          <nav className="contents" aria-label={t(a11y.footerNav, lang)}>
            {footer.columns.map((col) => (
              <div key={col.title.es}>
                {/* Etiqueta, no encabezado. Como `<h2>` de 12px entraba en el
                    outline del documento al mismo nivel que los `h2` de
                    contenido y los enanizaba. La navegación del pie ya se
                    anuncia por el `aria-label` del `<nav>`. */}
                <p className="font-mono text-mono uppercase tracking-wider text-ink-3">{t(col.title, lang)}</p>
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
              href={href(lang, routes.privacy)}
              className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
            >
              {t(footer.privacy, lang)}
            </Link>
            <p className="font-mono">{t(footer.legalNotice, lang)}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
