import { t, type Locale } from '~/core/common/domain/i18n/config'
import { a11y, footer } from '~/core/common/domain/consts/copy'

/**
 * SOCIAL MEDIA LINKS.
 *
 * ── ACCESSIBILITY ─────────────────────────────────────────────────────────
 * The icon is `aria-hidden` and the accessible name comes from an `sr-only`,
 * not an `aria-label`: that way the text assistive technology announces and
 * the text someone using magnification sees are the same, and there are not
 * two sources of truth that can drift apart.
 *
 * That `sr-only` includes the new-tab warning (WCAG 3.2.5), like the rest of
 * the site's external links.
 *
 * The touch target is 44px even though the icon measures 18: the area is
 * declared on the link, not on the stroke (§23).
 */

const icons: Record<string, React.ReactNode> = {
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
  /* All three icons are a rounded square with their glyph inside, drawn at
     the same stroke weight. Facebook's official mark is a shape meant to be
     FILLED; stroking it as is produced an "f" outline that clashed next to the
     other two. It is redrawn in the same language as Instagram and
     LinkedIn. */
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

export function SocialLinks({ locale }: { locale: Locale }) {
  if (footer.social.length === 0) return null

  return (
    <ul className="mt-6 flex items-center gap-1">
      {footer.social.map((network) => (
        <li key={network.name}>
          <a
            href={network.url}
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
              {icons[network.name]}
            </svg>
            <span className="sr-only">
              {network.name} · {t(a11y.opensInNewTab, locale)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
