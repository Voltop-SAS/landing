import { t, type Locale } from '~/core/common/domain/i18n/config'
import { a11y, storeBadges } from '~/core/common/domain/consts/copy'
import { externalLinks } from '~/core/common/domain/consts/links'
import { TrackClick } from '@ui/common/components/analytics/TrackClick'

/**
 * BADGES DE TIENDA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §15 y §23.
 *
 * ── CADA INSIGNIA VA A SU TIENDA ─────────────────────────────────────────
 * Durante un tiempo ambas apuntaron al enlace dinámico `app.voltop.co` porque
 * no había fichas. Ya las hay (2026-09-02), y cada insignia va a la suya: una
 * insignia DICE a qué tienda lleva, y mandarla a un redirector que decide por
 * su cuenta contradice lo que ella misma promete.
 *
 * Además, hoy son la ÚNICA ruta de descarga que funciona: el enlace dinámico
 * sigue devolviendo 503.
 *
 * Y sigue en pie la advertencia de `content/data/links.ts`: el dominio
 * devolvía 503 el 2026-09-02. Hay que verificarlo antes del lanzamiento.
 *
 * ── POR QUÉ SE DIBUJAN Y NO SE INCRUSTAN COMO IMAGEN ─────────────────────
 * Las insignias oficiales se distribuyen como PNG con fondo negro fijo. Sobre
 * un lienzo casi negro se pierden, y ampliadas se ven borrosas. Dibujadas como
 * SVG heredan el tema, escalan sin pérdida y pesan bytes en vez de kilobytes.
 * El logotipo de cada tienda se conserva reconocible: es la marca la que
 * identifica el destino.
 *
 * El texto va en el `<title>` accesible del enlace, no dentro del SVG, para
 * que un lector de pantalla anuncie "App Store · Se abre en una pestaña nueva"
 * y no la palabra suelta.
 */

const insignia =
  'group press inline-flex h-[3.25rem] items-center gap-3 rounded-(--radius-structural) border border-line-control ' +
  'bg-surface-2 px-4 transition-colors duration-(--duration-fast) hover:border-line-strong hover:bg-surface-3'

const rotulo = 'flex flex-col leading-none'
const rotuloSuperior = 'font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ink-3'
const rotuloInferior = 'mt-1 font-display text-[1.0625rem] font-semibold tracking-tight text-ink'

export function StoreBadges({ lang, className }: { lang: Locale; className?: string }) {
  const nuevaPestana = t(a11y.opensInNewTab, lang)

  return (
    <div className={className}>
      {/* `app_store_click` estaba declarado en §31 desde el bloque 10 y no lo
          emitía nadie: se dejó sin cablear porque no había URLs, y cuando
          llegaron (bloque 33) quedó sin cerrar. Es la conversión primaria del
          journey B2C, así que se distingue POR TIENDA y por superficie. */}
      <ul className="flex flex-wrap gap-3">
        <li>
          <TrackClick
            event="app_store_click"
            props={{ tienda: 'app_store', ubicacion: 'seccion' }}
          >
            <a
              href={externalLinks.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className={insignia}
            >
              {/* Manzana de Apple */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6 shrink-0 fill-ink"
              >
                <path d="M16.36 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.43-3.7zM14.1 5.99c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.77-.95 2.81 1.02.08 2.05-.52 2.68-1.28z" />
              </svg>
              <span className={rotulo}>
                <span className={rotuloSuperior}>{t(storeBadges.apple, lang)}</span>
                <span className={rotuloInferior}>App Store</span>
              </span>
              <span className="sr-only"> · {nuevaPestana}</span>
            </a>
          </TrackClick>
        </li>

        <li>
          <TrackClick
            event="app_store_click"
            props={{ tienda: 'google_play', ubicacion: 'seccion' }}
          >
            <a
              href={externalLinks.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className={insignia}
            >
              {/* Triángulo de Google Play. Es la única marca del sitio que
                conserva sus colores propios: en monocromo deja de ser
                reconocible, que es justo lo que la insignia tiene que lograr. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6 shrink-0"
              >
                <path
                  d="M3.6 2.3c-.26.28-.4.7-.4 1.25v16.9c0 .55.14.97.4 1.25l.06.05 9.48-9.47v-.22L3.66 2.6l-.06-.3z"
                  fill="#00D0FF"
                />
                <path
                  d="m16.3 15.44-3.16-3.16v-.22l3.16-3.16.07.04 3.74 2.13c1.07.6 1.07 1.6 0 2.21l-3.74 2.12-.07.04z"
                  fill="#FFC900"
                />
                <path
                  d="m16.37 15.4-3.23-3.23-9.54 9.53c.35.37.93.42 1.59.05l11.18-6.35z"
                  fill="#F9423A"
                />
                <path
                  d="M16.37 8.94 5.19 2.6c-.66-.37-1.24-.32-1.59.05l9.54 9.52 3.23-3.23z"
                  fill="#00E676"
                />
              </svg>
              <span className={rotulo}>
                <span className={rotuloSuperior}>{t(storeBadges.google, lang)}</span>
                <span className={rotuloInferior}>Google Play</span>
              </span>
              <span className="sr-only"> · {nuevaPestana}</span>
            </a>
          </TrackClick>
        </li>
      </ul>
    </div>
  )
}
