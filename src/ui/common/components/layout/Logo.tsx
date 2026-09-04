import Image from 'next/image'

/**
 * VOLTOP'S OFFICIAL LOGO
 *
 * Replaces the provisional mark that used to live in this file (§32, open
 * decision O1: delivered on 2026-09-01). It serves the official file as is,
 * from `public/Logo_voltop.svg`, without redrawing or recomposing it.
 *
 * ── THE FILE IS THE COMPLETE LOCKUP ───────────────────────────────────────
 * `Logo_voltop.svg` contains both symbol AND wordmark ("Voltop"), 529×124. The
 * previous placeholder was ONLY the symbol, with the word supplied by a
 * `<span>` next to it, in Header and in Footer. With the official file that
 * `<span>` would duplicate the brand — "Voltop Voltop" — so it is removed from
 * both: this is not a content change, it is the word the asset itself now
 * provides.
 *
 * ── WHY 32px TALL ─────────────────────────────────────────────────────────
 * The symbol takes up 123.107 of the file's 124 units of height, so at `h-8`
 * (32px) the symbol measures 31.8px: exactly the size the placeholder had
 * (`size-8`). The wordmark lands where the `<span>` used to be and with
 * equivalent optical weight. The instance keeps its size, its place and its
 * spacing; the only thing that changes is the asset.
 *
 * ── DECORATIVE, AS BEFORE ─────────────────────────────────────────────────
 * `alt=""` and `aria-hidden`: the accessible name comes from the `aria-label`
 * of the link wrapping it, just as it did with the placeholder. Announcing it
 * here would duplicate the link's label.
 *
 * `object-contain` protects the aspect ratio. Tailwind's reset applies
 * `max-width: 100%` to every image; between ~770 and ~810px of viewport the
 * header is tight on space — nav, language switch and CTA all share it — and
 * the link wrapping the brand is squeezed by a few pixels. With the height
 * fixed at `h-8` and the width capped by the parent, the logo was STRETCHING:
 * it measured a ratio of 3.96 instead of 4.27. With `object-contain` it keeps
 * its ratio and, in that narrow band, scales down by ~5% instead of
 * deforming.
 *
 * `unoptimized` because an SVG is vectorial: there is nothing to resize or
 * recompress, and Next's optimizer rejects SVGs unless `dangerouslyAllowSVG`
 * is enabled. `priority` preserves the previous behaviour — the SVG was inline
 * and painted with the document; without it, `next/image` would load lazily
 * and the brand would appear late.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo_voltop.svg"
      alt=""
      aria-hidden="true"
      width={529}
      height={124}
      priority
      unoptimized
      className={className ?? 'h-8 w-auto shrink-0 object-contain'}
    />
  )
}
