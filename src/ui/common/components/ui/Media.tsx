import Image from 'next/image'
import { cn } from '@ui/common/lib/cn'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'
import { a11y, mediaPlaceholder } from '~/core/common/domain/consts/copy'
import { VideoMedia } from '@ui/common/components/ui/VideoMedia'

/**
 * MEDIA · single render point for photography and narrative video.
 * See docs/MASTER-PROJECT-DEFINITION.md §20 and §33.
 *
 * If the asset has a `src`, the real material is rendered.
 * If not, an HONEST placeholder is rendered declaring what is missing and what
 * it is for — not an anonymous rectangle. When the file arrives, filling in
 * `src` in `~/core/common/infrastructure/content/media` is enough: no
 * component changes.
 */

const aspects: Record<MediaAsset['aspect'], string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '2/3': 'aspect-[2/3]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
  '9/16': 'aspect-[9/16]',
}

export function Media({
  asset,
  locale,
  className,
  sizes = '100vw',
  priority = false,
  fill = false,
  aspect,
  position,
  fit = 'cover',
  quality,
  controls,
  corner = false,
}: {
  asset: MediaAsset
  locale: Locale
  className?: string
  sizes?: string
  priority?: boolean
  /** `true` when the parent container defines the height (full-bleed, sticky). */
  fill?: boolean
  /**
   * The composition's crop when it differs from the asset's native one.
   *
   * This used to be done by passing `className="aspect-[21/9]"`, which did NOT
   * replace the native class but accompanied it: `/empresas` served
   * `aspect-[4/3] aspect-[21/9]` on the same element and which one won
   * depended on the CSS emission order, not on intent. With a prop, the crop
   * is a declared decision and there is only one class.
   */
  aspect?: MediaAsset['aspect']
  /**
   * The crop's anchor point (`object-position`).
   *
   * `object-cover` decides WHICH AXIS it crops on based on the shape of the
   * hole, and in a full-bleed hero that shape changes completely between
   * devices: on desktop the hole is wider than the photo, so the full width is
   * kept and it crops top and bottom; on mobile it is far narrower, so the
   * full height is kept and it crops left and right.
   *
   * That is why the two values do not compete: each only acts in the regime
   * where its axis is the one being cropped. Without this prop the anchor is
   * the centre, which is correct for the rest of the site's compositions and
   * is why it remains the default.
   */
  position?: string
  /**
   * `cover` crops to fill; `contain` fits whole and leaves air.
   *
   * `cover` by default, which is right for all the site material: a photograph
   * of a station or a city IS a background and crops without losing anything.
   *
   * `contain` exists for material that is an ISOLATED OBJECT — the charger
   * render — where cropping destroys the subject: a unit cut off at the top or
   * the sides stops being the portrait of a unit.
   *
   * `position` STILL APPLIES with `contain`, and that is worth knowing: the
   * image fits along one axis and space is left over on the other, and
   * `object-position` decides where it rests within that leftover. It is what
   * allows the beat 3 render to sit against the text block instead of floating
   * in the centre of its box.
   */
  fit?: 'cover' | 'contain'
  /**
   * Encoding quality. Only passed when the asset's weight demands it: a highly
   * detailed photograph can blow §29's budget at the default quality. The
   * accepted values are declared in `next.config.ts`.
   */
  quality?: number
  /** See `VideoMedia`: turns the background video into a piece with controls. */
  controls?: boolean
  /**
   * Signature corner (`--radius-signature`) on the top right.
   *
   * Enabled per block and not by default: a full-bleed background has no
   * corners to round, and applying it everywhere would turn it into texture
   * instead of a signature. It goes on blocks that live INSIDE a container.
   */
  corner?: boolean
}) {
  const shape = fill ? '' : aspects[aspect ?? asset.aspect]
  /**
   * `bg-surface-1` is the background holding the placeholder while the image
   * loads, and with `cover` it is never seen: the photo covers it entirely.
   *
   * With `contain` it is seen, and it becomes a BOX. Measured in beat 3: the
   * charger render comes with a transparent background and this fill painted a
   * lighter 662px rectangle with a visible vertical seam against the section
   * background — exactly the box the composition was avoiding. An isolated
   * object rests on whatever background it lands on, with no surface of its
   * own behind it.
   */
  const background = fit === 'contain' ? '' : 'bg-surface-1'
  /* `overflow-hidden` is already on all three wrappers, so the corner's
     clipping applies to the content too — photo, video or placeholder. */
  const cornerClass = corner ? 'rounded-tr-(--radius-signature)' : ''

  if (asset.src) {
    if (asset.kind === 'photo') {
      return (
        <div className={cn('relative overflow-hidden', background, shape, cornerClass, className)}>
          <Image
            src={asset.src}
            alt={t(asset.alt, locale)}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', position)}
          />
        </div>
      )
    }
    /* The video lives in a client component because it has to read
       `prefers-reduced-motion`, which cannot be queried from the server.
       Photography — the branch above — remains pure server. */
    return (
      <div className={cn('relative overflow-hidden', background, shape, cornerClass, className)}>
        <VideoMedia
          asset={asset}
          locale={locale}
          controls={controls}
          className={cn(
            'absolute inset-0 h-full w-full',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            position,
          )}
        />
      </div>
    )
  }

  return (
    <MediaPending
      asset={asset}
      locale={locale}
      fill={fill}
      className={cn(shape, cornerClass, className)}
    />
  )
}

/**
 * Declared placeholder. It communicates WHICH asset is missing and WHAT
 * function it serves, so a design review can assess the composition without
 * the final material. It meets AA contrast like any other text (§33).
 *
 * TWO PLACEMENTS, not one:
 *
 * - Without `fill` (the placeholder occupies its own block) the label goes
 *   bottom left with its full description: nothing else competes for that
 *   space.
 *
 * - With `fill` (the placeholder is the BACKGROUND of a composition) the label
 *   is reduced to the badge and anchored to a corner. It used to be centred at
 *   the top with the description on two lines and, at 390px, it painted
 *   literally on top of the hero's eyebrow and headline — text over text on
 *   the site's first screen, which is exactly what §22 forbids ("background
 *   graphics never overlap content"). On mobile it disappears entirely: the
 *   placeholder is already announced through `aria-label` and the description
 *   lives in the media register.
 */
export function MediaPending({
  asset,
  locale,
  className,
  fill = false,
}: {
  asset: MediaAsset
  locale: Locale
  className?: string
  /** `true` when the placeholder is the background of a composition with
      content on top. */
  fill?: boolean
}) {
  const kind = asset.kind === 'video' ? mediaPlaceholder.video : mediaPlaceholder.photo
  const badge = `${t(kind, locale)}${asset.duration ? ` · ${asset.duration}` : ''} · ${t(
    mediaPlaceholder.pending,
    locale,
  )}`

  return (
    <div
      role="img"
      aria-label={`${t(a11y.placeholderMedia, locale)}. ${t(asset.alt, locale)}`}
      className={cn(
        'relative flex overflow-hidden bg-surface-1',
        fill ? 'items-start justify-end p-4 md:p-6' : 'items-end p-5',
        className,
      )}
    >
      {/* Discreet structural texture: it does not imitate a photo, it declares
          a gap. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--color-ink-3) 0 1px, transparent 1px 18px)',
        }}
      />

      {fill ? (
        <span className="relative hidden w-fit items-center border border-line-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3 sm:inline-flex">
          {badge}
        </span>
      ) : (
        <div className="relative flex max-w-md flex-col gap-3">
          <span className="inline-flex w-fit items-center border border-line-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3">
            {badge}
          </span>
          <span className="font-mono text-caption text-ink-3">{t(asset.alt, locale)}</span>
        </div>
      )}
    </div>
  )
}
