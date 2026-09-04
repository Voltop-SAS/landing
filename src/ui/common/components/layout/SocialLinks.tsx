import { t, type Locale } from '~/core/common/domain/i18n/config'
import { a11y, footer } from '~/core/common/domain/consts/copy'

/**
 * ENLACES A REDES SOCIALES.
 *
 * ── ACCESIBILIDAD ─────────────────────────────────────────────────────────
 * El icono es `aria-hidden` y el nombre accesible lo da un `sr-only`, no un
 * `aria-label`: así el texto que anuncia la asistencia y el que ve quien usa
 * lupa son el mismo, y no hay dos fuentes de verdad que puedan divergir.
 *
 * Ese `sr-only` incluye el aviso de pestaña nueva (WCAG 3.2.5), como el resto
 * de enlaces externos del sitio.
 *
 * El objetivo táctil es de 44px aunque el icono mida 18: el área se declara en
 * el enlace, no en el trazo (§23).
 */

const iconos: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <circle
        cx="17.2"
        cy="6.8"
        r="1.1"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  /* Los tres iconos son un cuadrado redondeado con su glifo dentro, trazados
     al mismo grosor. La marca oficial de Facebook es una forma para RELLENO;
     trazarla tal cual daba un contorno de "f" que desentonaba junto a los
     otros dos. Se redibuja con el mismo lenguaje que Instagram y LinkedIn. */
  Facebook: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <path d="M15 8.2h-1.4c-1 0-1.6.6-1.6 1.6V21M9.8 12.6h4.6" />
    </>
  ),
  LinkedIn: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
      />
      <path d="M7.5 10.5v6M7.5 7.4v.1M11 16.5v-6M11 13c0-1.4.9-2.5 2.3-2.5S16 11.4 16 13v3.5" />
    </>
  ),
}

export function SocialLinks({ lang }: { lang: Locale }) {
  if (footer.social.length === 0) return null

  return (
    <ul className="mt-6 flex items-center gap-1">
      {footer.social.map((red) => (
        <li key={red.name}>
          <a
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-(--radius-pill) text-ink-3 transition-colors duration-(--duration-fast) hover:bg-surface-2 hover:text-ink"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-[1.125rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {iconos[red.name]}
            </svg>
            <span className="sr-only">
              {red.name} · {t(a11y.opensInNewTab, lang)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
