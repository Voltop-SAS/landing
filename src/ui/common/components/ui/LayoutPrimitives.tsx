import { cn } from '@ui/common/lib/cn'

/**
 * STRUCTURE PRIMITIVES
 * See docs/MASTER-PROJECT-DEFINITION.md §12 and §24.
 *
 * Page rhythm is built by combining `width` and `space`.
 * RULE: two consecutive sections cannot share the same combination.
 */

type Width = 'content' | 'narrow' | 'wide' | 'full'

/**
 * ── THE RAIL ──────────────────────────────────────────────────────────────
 *
 * Each width used to be centred INDEPENDENTLY, so the left edge of the content
 * jumped around depending on the container. Measured at 1440px:
 *
 *   header and `content` → 148px
 *   `wide`               →  48px
 *   `narrow`             → 380px
 *
 * On `/nosotros` the rail went 380 → 148 → 380 → 148 on the way down, and on a
 * station page the photo block stuck out 100px to the left of the headline.
 * §13 asks for "reviewed optical alignment"; there was not even structural
 * alignment.
 *
 * Now there is ONE rail, `content`'s, and the other widths relate to it:
 *
 * - `content` — the rail. Everything aligns here by default.
 * - `narrow`  — SAME left edge, shorter measure. It is a reading column hung
 *               off the rail, not a block floating in the centre.
 * - `wide`    — the ONLY one that breaks the rail, and it does so equally on
 *               both sides: it is a deliberate bleed. Reserved for MEDIA. A
 *               block of text or data in `wide` is the bug we had, not a
 *               decision (see `NetworkIndex`, which moved to `content`).
 *
 * `align="center"` is the declared exception: deliberately centred
 * compositions (`BusinessIntro`, `VisionQuote`). Being explicit, it is
 * distinguishable from an accidental misalignment.
 * ──────────────────────────────────────────────────────────────────────────
 */
type Align = 'rail' | 'center'

const widths: Record<Width, string> = {
  narrow: 'max-w-(--container-narrow)',
  content: 'max-w-(--container-content)',
  wide: 'max-w-(--container-wide)',
  full: 'max-w-none',
}

export function Container({
  children,
  width = 'content',
  align = 'rail',
  className,
}: {
  children: React.ReactNode
  width?: Width
  /** `rail` hangs off `content`'s left edge. `center` centres on purpose. */
  align?: Align
  className?: string
}) {
  const frame = 'mx-auto w-full px-(--spacing-gutter)'

  /* `narrow` on the rail: `content`'s frame + a short measure inside. It is
     the only combination that needs two nodes; the rest is a single div. */
  if (width === 'narrow' && align === 'rail') {
    return (
      <div className={cn(frame, widths.content, className)}>
        <div className={widths.narrow}>{children}</div>
      </div>
    )
  }

  return <div className={cn(frame, widths[width], className)}>{children}</div>
}

type Space = 'tight' | 'base' | 'loose' | 'none'
type Register = 'silence' | 'impact'

/**
 * Each section contributes HALF the declared distance, so the gap between two
 * sections IS the token and not their sum. See the `--spacing-section-*`
 * comment in globals.css: `base` followed by `base` used to leave 288px of
 * emptiness between every pair of sections on every internal page.
 */
const spaces: Record<Space, string> = {
  none: '',
  tight: 'py-(--spacing-block-tight)',
  base: 'py-(--spacing-block)',
  loose: 'py-(--spacing-block-loose)',
}

/**
 * Section with explicit visual register and rhythm intensity.
 * - `silence`: structural, flat, editorial. Lets the information breathe.
 * - `impact`: energy and texture. Reserved for the key narrative points.
 *
 * `register` is the project's confirmed visual decision no. 8 and until now it
 * WAS NOT USED by any component: `CloseCta` was the only one with texture and
 * applied it by hand. The Home page's impact beats (`Hero`,
 * `InfrastructureSignature`, `ProofCase`, `CloseCta`) now go through here, so
 * the concept exists in the code and not only in the documentation.
 *
 * It accepts `ref` because the signature moment needs to measure its own
 * scroll.
 *
 * `impact` applies ONLY the texture. It does not add `overflow-hidden`: an
 * `overflow` other than `visible` creates a scroll container and would break
 * the signature moment's `position: sticky` — the same reason globals.css uses
 * `overflow-x: clip` on `body` and not `hidden`. Each section declares its own
 * clipping where it needs it.
 */
export function Section({
  id,
  children,
  register = 'silence',
  space = 'base',
  className,
  as: Tag = 'section',
  ariaLabelledby,
  ref,
}: {
  id?: string
  children: React.ReactNode
  register?: Register
  space?: Space
  className?: string
  as?: 'section' | 'div' | 'article'
  ariaLabelledby?: string
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        'relative scroll-mt-24',
        spaces[space],
        register === 'impact' && 'grain',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Eyebrow. No gradient dot: the gradient is a signal, not decoration repeated
 * in every section (§12, gradient discipline).
 */
export function Eyebrow({
  children,
  className,
  tone = 'muted',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'muted' | 'brand'
}) {
  return (
    <p
      className={cn(
        'font-mono text-eyebrow uppercase',
        tone === 'brand' ? 'text-brand' : 'text-ink-3',
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * ── THE MIDDLE REGISTER ───────────────────────────────────────────────────
 *
 * Internal pages jumped from a 72px `h1` to 12px `h2`s: the section heading
 * was SMALLER than the paragraph it introduced. Measured on the rendered DOM:
 *
 *   /red/estacion/…   h1 72px · h2 12px · h2 12px · h2 12px
 *   /red/medellin     h1 72px · h2 12px · h2 12px
 *   /legal/privacidad h1 72px · h2 12px
 *
 * With no middle register there is no hierarchy, only a giant title and a flat
 * list. §13: "the eye always knows where to look first" — it did not.
 *
 * This component supplies the two missing levels and, along the way,
 * consolidates the `<Eyebrow>` + `<h2 className="mt-4 font-display
 * text-display-l …">` that was hand-repeated eleven times with slightly
 * different classes.
 *
 * Sizes, and what each is for:
 * - `l` (52px) — section opening with narrative weight of its own.
 * - `m` (36px) — section heading inside a page. The missing register. This is
 *                what replaces the mono `h2`s.
 * - `s` (24px) — subsection or data block.
 *
 * The 12px mono still exists, but goes back where it belongs: `kicker` and
 * data labels. It stops being a heading.
 * ──────────────────────────────────────────────────────────────────────────
 */
const headingSizes = {
  l: 'text-display-l',
  m: 'text-display-m',
  s: 'text-display-s',
} as const

/**
 * ── THE EYEBROW TONE IS A RULE, NOT A DEFAULT ────────────────────────────
 * `muted` is the fallback value, and that had produced a visible
 * inconsistency: on the Home page four beats declared `brand` and three had
 * been left grey without anyone deciding so.
 *
 * The rule, set on 2026-09-04:
 *
 * · On the HOME page the eyebrow goes in `brand`. It is the narrative
 *   register: the eight beats are a sequence and the green accent is what
 *   chains them together.
 * · On INTERNAL pages it goes in `muted`. There the eyebrow labels
 *   documentation sections — capabilities, criteria, FAQ — and one brand
 *   accent per section would turn it into texture.
 *
 * The only exception is the evidence block on `/empresas`, which is narrative
 * inside an internal page and declares it explicitly.
 */
export function SectionHeading({
  children,
  id,
  kicker,
  kickerTone = 'muted',
  size = 'l',
  as: Tag = 'h2',
  className,
  measure,
}: {
  children: React.ReactNode
  id?: string
  /** Eyebrow. It comes BEFORE the title, both in reading and in the DOM. */
  kicker?: React.ReactNode
  kickerTone?: 'muted' | 'brand'
  size?: keyof typeof headingSizes
  as?: 'h2' | 'h3'
  className?: string
  /** Caps the headline measure in characters, for long headlines. */
  measure?: string
}) {
  return (
    <div className={className}>
      {kicker && <Eyebrow tone={kickerTone}>{kicker}</Eyebrow>}
      <Tag
        id={id}
        className={cn(
          'font-display font-semibold text-balance text-ink',
          headingSizes[size],
          kicker ? 'mt-4' : null,
          measure,
        )}
      >
        {children}
      </Tag>
    </div>
  )
}

/** Structural divider — Voltop's "spec sheet" language. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-line', className)} />
}

/**
 * ── PROCESS LIST ──────────────────────────────────────────────────────────
 *
 * The same treatment — top hairline + mono number `01/02/03` + `display-s`
 * title + body — was repeated SIX times: the Home page segments, the "how to
 * charge" steps, the /empresas capabilities, the selector benefits, the
 * /nosotros pillars and the legal contents. Every list on the site was the
 * same list, and that — more than the repetition of layouts — is why all the
 * pages felt alike.
 *
 * The rule that separates them: THE NUMBER ONLY WHERE ORDER MEANS SOMETHING.
 *
 * - A process ("we assess → we install → we operate → we report") is a
 *   sequence: the number informs, and here it grows until it becomes the
 *   visual anchor.
 * - Pillars or benefits are NOT a sequence. Numbering them was a false signal:
 *   it suggested an order that does not exist. There the number disappears and
 *   the anchor becomes the title (see the callers).
 *
 * This component keeps the first case, which is the only one with real reuse.
 */
export function ProcessList({
  items,
  className,
}: {
  items: { step: string; title: string; body: string }[]
  className?: string
}) {
  return (
    <ol className={cn('grid gap-x-10 gap-y-12', className)}>
      {items.map((item) => (
        <li
          key={item.step}
          className="relative border-t border-line-strong pt-6"
        >
          <span
            aria-hidden="true"
            className="block font-display text-display-l font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-line-control)]"
          >
            {item.step}
          </span>
          <h3 className="mt-5 font-display text-display-s font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-body-s text-ink-2">{item.body}</p>
        </li>
      ))}
    </ol>
  )
}
