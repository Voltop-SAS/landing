import { t, type Locale } from '~/core/common/domain/i18n/config'
import { a11y, storeBadges } from '~/core/common/domain/consts/copy'
import { externalLinks } from '~/core/common/domain/consts/links'
import { TrackClick } from '@ui/common/components/analytics/TrackClick'

/**
 * STORE BADGES
 * See docs/MASTER-PROJECT-DEFINITION.md §15 and §23.
 *
 * ── EACH BADGE GOES TO ITS OWN STORE ─────────────────────────────────────
 * For a while both pointed at the dynamic `app.voltop.co` link because there
 * were no listings. There are now (2026-09-02), and each badge goes to its
 * own: a badge SAYS which store it leads to, and sending it to a redirector
 * that decides on its own contradicts what the badge itself promises.
 *
 * On top of that, they are today the ONLY download route that works: the
 * dynamic link still returns 503.
 *
 * And the warning in `~/core/common/domain/consts/links` still stands: the
 * domain was returning 503 on 2026-09-02. It has to be verified before launch.
 *
 * ── WHY THEY ARE DRAWN AND NOT EMBEDDED AS IMAGES ────────────────────────
 * The official badges are distributed as PNGs with a fixed black background.
 * On an almost-black canvas they get lost, and scaled up they look blurry.
 * Drawn as SVG they inherit the theme, scale losslessly and weigh bytes
 * instead of kilobytes. Each store's logo stays recognisable: it is the brand
 * that identifies the destination.
 *
 * The text goes in the link's accessible `<title>`, not inside the SVG, so a
 * screen reader announces "App Store · Opens in a new tab" and not the bare
 * word.
 */

const badge =
  'group press inline-flex h-[3.25rem] items-center gap-3 rounded-(--radius-structural) border border-line-control ' +
  'bg-surface-2 px-4 transition-colors duration-(--duration-fast) hover:border-line-strong hover:bg-surface-3'

const label = 'flex flex-col leading-none'
const labelTop = 'font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ink-3'
const labelBottom = 'mt-1 font-display text-[1.0625rem] font-semibold tracking-tight text-ink'

export function StoreBadges({
  locale,
  className,
  /**
   * Which surface these badges live on. It travels with every
   * `app_download_click` so two instances of this component are never added up
   * as one: the plan asks to know WHERE the download was pressed, and the
   * component cannot guess that about itself.
   */
  placement = 'section',
}: {
  locale: Locale
  className?: string
  placement?: string
}) {
  const newTab = t(a11y.opensInNewTab, locale)

  return (
    <div className={className}>
      {/* `app_store_click` had been declared in §31 since block 10 and nobody
          emitted it: it was left unwired because there were no URLs, and when
          they arrived (block 33) it was never closed off. It is the primary
          conversion of the B2C journey, so it is distinguished BY STORE and by
          surface. */}
      <ul className="flex flex-wrap gap-3">
        <li>
          <TrackClick
            event="app_download_click"
            props={{ store: 'app_store', placement }}
          >
            <a
              href={externalLinks.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className={badge}
            >
              {/* Apple's apple */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6 shrink-0 fill-ink"
              >
                <path d="M16.36 12.78c.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.61 2.79-.41 6.92 1.15 9.18.76 1.11 1.67 2.35 2.86 2.3 1.15-.04 1.58-.74 2.97-.74 1.39 0 1.78.74 3 .72 1.24-.02 2.02-1.13 2.78-2.24.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.41-.93-2.43-3.7zM14.1 5.99c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.68-1.09 1.77-.95 2.81 1.02.08 2.05-.52 2.68-1.28z" />
              </svg>
              <span className={label}>
                <span className={labelTop}>{t(storeBadges.apple, locale)}</span>
                <span className={labelBottom}>App Store</span>
              </span>
              <span className="sr-only"> · {newTab}</span>
            </a>
          </TrackClick>
        </li>

        <li>
          <TrackClick
            event="app_download_click"
            props={{ store: 'google_play', placement }}
          >
            <a
              href={externalLinks.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className={badge}
            >
              {/* Google Play's triangle. It is the only mark on the site that
                keeps its own colours: in monochrome it stops being
                recognisable, which is exactly what the badge has to
                achieve. */}
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
              <span className={label}>
                <span className={labelTop}>{t(storeBadges.google, locale)}</span>
                <span className={labelBottom}>Google Play</span>
              </span>
              <span className="sr-only"> · {newTab}</span>
            </a>
          </TrackClick>
        </li>
      </ul>
    </div>
  )
}
