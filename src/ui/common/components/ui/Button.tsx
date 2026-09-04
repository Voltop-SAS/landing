import Link from 'next/link'
import { a11y } from '~/core/common/domain/consts/copy'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { cn } from '@ui/common/lib/cn'

/**
 * VOLTOP BUTTON · Server Component
 * See docs/MASTER-PROJECT-DEFINITION.md §12 and §24.
 *
 * System decisions:
 * - DUAL radius: `pill` for actions/energy, `structural` for data.
 * - ONE contextual arrow (→), only when the action implies direction.
 * - Gradient with DISCIPLINE: `variant="primary"` is the ONLY highlighted
 *   action in each view. If there are two primaries on a screen, one is one
 *   too many.
 * - Minimum height of 44px at every size except `xs` (non-touch use).
 * - Internal navigation ALWAYS through next/link (§26).
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'l' | 'm' | 's'
type Shape = 'pill' | 'structural'

type Common = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  shape?: Shape
  arrow?: boolean
  className?: string
  'aria-label'?: string
}

type AsLink = Common & {
  href: string
  /**
   * Opens in a new tab AND SAYS SO. It used to do only the first: "Get
   * directions" — the main CTA on a station page — jumped to Google Maps with
   * no icon, no text and no warning for screen readers (WCAG 3.2.5). It needs
   * `locale` so it can be said in the page's language.
   */
  external?: boolean
  locale?: Locale
  /** For measurement plan instrumentation only. */
  onClick?: () => void
  type?: never
  loading?: never
  disabled?: never
}
type AsButton = Common & {
  href?: never
  external?: never
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

const base =
  'group relative inline-flex items-center justify-center gap-2 font-medium tracking-tight text-center ' +
  'transition-[transform,background-color,border-color,box-shadow,color,opacity] ' +
  'duration-(--duration-fast) ease-(--ease-standard) ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 select-none'

/* Minimum height 44px = accessible touch target (§23). */
const sizes: Record<Size, string> = {
  l: 'min-h-13 px-7 text-body',
  m: 'min-h-11 px-6 text-body-s',
  s: 'min-h-11 px-5 text-body-s',
}

/**
 * `secondary` and `ghost` use `line-control`: on a button with no fill, the
 * border IS what makes it recognisable as a control, so WCAG 1.4.11 requires
 * ≥3:1. `line` gave 1.25:1 and `line-strong` 1.68:1.
 */
const variants: Record<Variant, string> = {
  primary: 'brand-gradient text-on-brand font-semibold hover:brightness-105 hover:energy-glow',
  secondary: 'bg-surface-2 text-ink border border-line-control hover:bg-surface-3',
  ghost: 'text-ink border border-line-control hover:border-line-strong hover:bg-surface-1',
  link: 'text-ink-2 hover:text-ink px-0 min-h-11',
}

function Inner({
  children,
  arrow,
  loading,
  external,
}: {
  children: React.ReactNode
  arrow?: boolean
  loading?: boolean
  external?: boolean
}) {
  return (
    <>
      <span className={cn('inline-flex items-center gap-2', loading && 'opacity-0')}>
        {children}
        {arrow && (
          /* The outgoing arrow replaces the directional one when the
             destination is off site: it is the visual counterpart of the
             warning the `sr-only` gives assistive technology. One arrow,
             contextual (§12). */
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={cn(
              /* The only place in the system using `--ease-overshoot`. The
                 arrow travels slightly further than where it lands and comes
                 back: that is what makes the control feel alive rather than
                 merely correct.
                 The travel goes from 2px to 4px because at 2px the overshoot
                 is not perceived — it feels slow, which is worse than not
                 having it. `prefers-reduced-motion` cancels it globally
                 (globals.css). */
              'shrink-0 transition-transform duration-(--duration-fast) ease-(--ease-overshoot)',
              external
                ? 'group-hover:-translate-y-1 group-hover:translate-x-1'
                : 'group-hover:translate-x-1',
            )}
          >
            {external ? (
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        )}
      </span>
      {loading && (
        <span
          className="absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
    </>
  )
}

export function Button(props: AsLink | AsButton) {
  const {
    children,
    variant = 'secondary',
    size = 'm',
    shape = 'pill',
    arrow = false,
    className,
    ...rest
  } = props

  const classes = cn(
    base,
    sizes[size],
    variants[variant],
    shape === 'pill' ? 'rounded-(--radius-pill)' : 'rounded-(--radius-structural)',
    className,
  )

  if ('href' in rest && rest.href) {
    const { href, external, locale, ...anchorRest } = rest as AsLink
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
          {...anchorRest}
        >
          <Inner
            arrow={arrow}
            external
          >
            {children}
            {locale && <span className="sr-only"> ({t(a11y.opensInNewTab, locale)})</span>}
          </Inner>
        </a>
      )
    }
    return (
      <Link
        href={href}
        className={classes}
        {...anchorRest}
      >
        <Inner arrow={arrow}>{children}</Inner>
      </Link>
    )
  }

  const { type = 'button', loading, disabled, onClick, ...buttonRest } = rest as AsButton
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonRest}
    >
      <Inner
        arrow={arrow}
        loading={loading}
      >
        {children}
      </Inner>
    </button>
  )
}
