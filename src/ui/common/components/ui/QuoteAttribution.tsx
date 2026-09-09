import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'
import { cn } from '@ui/common/lib/cn'

/**
 * QUOTE ATTRIBUTION · portrait + name + role, as a single unit.
 *
 * The site has TWO quote sections — the customer proof in beat 5 and the
 * founder's vision in beat 7 — and they shared the same problem: a line of
 * text attributing some words to a name, with no person.
 *
 * This component exists so both belong to the same system without being the
 * same composition. What they share is the UNIT: 96px square portrait,
 * hairline, and the name above the role to its right. What changes is WHERE it
 * is placed, and that is decided by each beat's function:
 *
 * · In beat 5 it goes AFTER the quote. It is proof: first the customer speaks,
 *   then who said it is credited.
 * · In beat 7 it goes BEFORE. It is a vision, not a testimonial: knowing who
 *   is speaking changes how 300 characters of first person are read.
 *
 * ── THE PLACEHOLDER CARRIES NO LABEL ──────────────────────────────────────
 * `MediaPending` declares what is missing and what for, and rightly so: in a
 * large block that declaration is what makes it possible to review the
 * composition without the material. But it does not fit in 96px — the label is
 * bigger than the gap — so here the gap is a silent surface and what is
 * missing is declared where it belongs: in the
 * `~/core/common/infrastructure/content/media` register.
 *
 * ── `sizes` COUNTS THE ZOOM, NOT THE BOX ──────────────────────────────────
 * With `sizes="96px"` the photo looked PIXELATED, and the reason is that
 * `sizes` is the promise made to the optimizer. Declaring 96px, Next served
 * 256px of width; `focus` magnifies 1.75×, so of those 256 only 1/1.75 is
 * visible — about 146 — stretched across 336 device pixels on a 2× screen.
 * That is a 2.3× enlargement over what was served: the crop looks bad even
 * though the file is 2048px.
 *
 * `sizes` now declares the REAL width that has to be covered: box × zoom ×
 * DPR. It is still a tiny image — tens of KB in AVIF — and the enlargement is
 * gone.
 *
 * ── THE REFRAMING LIVES IN CSS, NOT IN THE FILE ───────────────────────────
 * `focus` magnifies and anchors the image inside its box. It exists because
 * portraits do not always arrive with the tight framing a thumbnail needs: the
 * one of Helbert Perico arrived as a half-body shot, and at 96px that leaves
 * the face at around 35px, where nobody is recognisable.
 *
 * It is done in CSS rather than by editing the file on purpose: the original
 * is kept intact — it serves other uses and other sizes — and the day a tight
 * framing arrives it is enough not to pass `focus`. Cropping the file would
 * have done the opposite: a decision belonging to this thumbnail, irreversible,
 * baked into the asset.
 *
 * ── WHY SQUARE AND NOT ROUND ──────────────────────────────────────────────
 * The circular avatar is THE generic pattern, and §12 asks for any default
 * radius to be justified. The square with the structural radius is the same
 * surface language as the city cards and the QR frame: it reads as editorial
 * and not as social media.
 */
export function QuoteAttribution({
  asset,
  locale,
  name,
  role,
  focus,
  className,
}: {
  asset: MediaAsset
  locale: Locale
  name: string
  /** Already translated by the caller: the role lives in the collection, not
      here. */
  role: string
  /**
   * CSS reframing for portraits that do not arrive tightly cropped. See the
   * file header. It is passed as scale and origin classes so the value lives
   * in the component that knows the asset, not here.
   */
  focus?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <div className="relative size-24 shrink-0 overflow-hidden rounded-(--radius-structural) border border-line bg-surface-1">
        {asset.src && (
          <Image
            src={asset.src}
            alt={t(asset.alt, locale)}
            fill
            /* See the note above: covers a 96px box × 1.75 zoom × 2 density,
               with room to spare. */
            sizes="512px"
            className={cn('object-cover', focus)}
          />
        )}
      </div>

      <p className="text-body-s">
        <span className="block font-medium text-ink">{name}</span>
        <span className="block text-ink-3">{role}</span>
      </p>
    </div>
  )
}
