import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { red } from '~/core/network/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getCitiesWithStations } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { TrackClick } from '@ui/common/components/analytics/TrackClick'

/**
 * BEAT 1 · HERO — Intensity: High · Register: Impact
 * STRUCTURE: full-bleed over real infrastructure, content anchored bottom
 * left, single column, oversized typography.
 *
 * The node constellation was removed: it was the sector's visual cliché and it
 * contradicted the 70% real world / 30% behaviour reframing (§12). The hero no
 * longer carries metrics: there are no validated figures, and ten placeholders
 * destroyed the page's credibility (§33).
 *
 * Server Component: the headline and the CTA are served HTML — good for LCP.
 */
/**
 * Opacities of the legibility veil, as a percentage of the `canvas` colour.
 * They are written with `color-mix` over the token rather than as a hex, so
 * they follow the system if the background colour changes (§24: zero colour
 * literals).
 */
const canvas = (pct: number) =>
  pct >= 100
    ? 'var(--color-canvas)'
    : `color-mix(in srgb, var(--color-canvas) ${pct}%, transparent)`

const VEIL = {
  /**
   * On mobile the text occupies the FULL width, so the veil has to be
   * vertical. A left→right gradient here does the opposite of what is wanted:
   * it darkens the side where the charger is —the photo's subject— and leaves
   * the right side lighter, where there is also text. Measured and observed:
   * with a lateral veil the equipment disappeared; without it, it reads.
   */
  mobile: {
    vertical: `linear-gradient(to top, ${canvas(100)} 0%, ${canvas(96)} 48%, ${canvas(80)} 80%, ${canvas(52)} 100%)`,
  },
  desktop: {
    vertical: `linear-gradient(to top, ${canvas(100)} 0%, ${canvas(90)} 45%, ${canvas(60)} 82%, ${canvas(30)} 100%)`,
    lateral: `linear-gradient(to right, ${canvas(70)} 0%, ${canvas(44)} 48%, transparent 78%)`,
    /**
     * Top band, under the header.
     *
     * The header is transparent until there is scroll —only then does it gain
     * `bg-canvas/85` and a blur— so over the hero its text falls directly onto
     * the photo. The vertical veil reaches 22% at the top, which is not
     * enough: measured, the lightest 1% behind "Nosotros" at 768px gave
     * **1.75:1**. It is not a block-level failure but a failure of PATCHES
     * —the blue lights and the ceiling tubes end up behind particular
     * letters— and that is why the navigation is perceived as "getting lost"
     * even though the average passes.
     *
     * It is calibrated against the 99th percentile and not against the mean:
     * under such an irregular background, the average hides precisely the
     * point where a letter's stroke disappears.
     *
     * Desktop only. On mobile the vertical veil already reaches 52% at the top
     * —which is why it did pass there— and adding this band would darken it
     * for no reason.
     */
    superior: `linear-gradient(to bottom, ${canvas(80)} 0%, ${canvas(50)} 12%, transparent 22%)`,
  },
} as const

export function Hero({ locale }: { locale: Locale }) {
  const coverage = getCitiesWithStations()

  return (
    <Section
      register="impacto"
      space="none"
      className="flex min-h-[88dvh] flex-col justify-end overflow-hidden"
    >
      {/* Real material in the background.
          `object-position` at 30% horizontally: `object-cover` crops along
          whichever axis has surplus, and that axis changes with the device. On
          desktop the slot is wider than the photo (1.82 against 1.50), so it
          keeps ALL the width and crops top and bottom — there the horizontal
          value plays no part and a centred vertical keeps the stations in
          frame. On mobile the slot is far narrower (0.52), so it keeps all the
          height and crops the sides: centred, it would keep the back wall and
          lose the branded charger, which is on the left.
          In the current photograph the branded charger is to the RIGHT of
          centre (~55–68% of the width), so the anchor goes to 62%: that is
          what leaves it centred and legible in the vertical crop. It was
          tested against 24%, 40% and 52%; below 50% the equipment is cut off
          at the edge and the framing narrows to the vehicle's dark flank.
          On desktop the value plays no part: there the full width is kept. */}
      <div className="absolute inset-0">
        <Media
          asset={media.heroVehiculoCargando}
          locale={locale}
          fill
          priority
          sizes="100vw"
          position="object-[62%_50%]"
          /* See `qualities` in next.config.ts: this photo is the LCP element
             and at the default quality it exceeded the weight budget. */
          quality={70}
          className="h-full"
        />
      </div>

      {/* ── LEGIBILITY LAYERS ─────────────────────────────────────────────
          Calibrated by MEASURING against the real photograph, not by eye. The
          previous veil (`via-canvas/75`, a single axis) was designed against a
          flat background; with the photo in place it left the eyebrow at
          **1.90:1** at 320px, far from the 4.5:1 AA requires for 12px. It is
          brand-green text over the charger's light panel: the hero's worst
          case.

          THE SHAPE OF THE VEIL FOLLOWS THE SHAPE OF THE TEXT, which is why it
          changes with the breakpoint:

          · On DESKTOP the text lives in the left column, so a soft lateral
            veil protects it and leaves the right half of the frame visible. A
            vertical-only veil would force darkening where there is no text
            too.
          · On MOBILE the text occupies the full width, so the veil is
            vertical. A lateral one here would be counterproductive: it darkens
            the side where the charger is —the subject— and leaves the right
            side lighter, where there is also text. It was tried and the
            equipment disappeared.

          The intensities differ as well: on mobile the crop leaves the light
          panel behind the text and more veil is needed; on desktop the same
          value took the eyebrow to 8.65:1 when ~5 is enough, and it dimmed the
          photograph for no reason — and the photograph is 70% of the visual
          direction (§12).

          RECALIBRATED on 2026-09-01 when the hero photograph changed. The new
          one is lighter exactly where the text sits: with the previous veil the
          eyebrow dropped to 3.36:1. And it was recalibrated against the **99th
          percentile**, not the 90th —block 17's lesson—: under an irregular
          background the average hides the point where a letter's stroke
          disappears.

          Margins under the new criterion: +12% on desktop, +31% on mobile
          (mobile already passed and was left untouched). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{ background: VEIL.mobile.vertical }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.vertical }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.lateral }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.superior }}
      />

      {/* Current accent: a single line, at the edge. Signal, not texture. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px brand-gradient opacity-70"
      />

      <Container className="relative z-(--z-raised) pb-(--spacing-section-tight) pt-32">
        <Eyebrow tone="brand">{t(home.hero.eyebrow, locale)}</Eyebrow>

        <h1 className="mt-6 max-w-[15ch] font-display text-display-2xl font-semibold text-ink">
          {t(home.hero.title, locale)}
        </h1>

        <p className="mt-7 measure text-body-l text-ink-2">{t(home.hero.lead, locale)}</p>

        <div className="mt-10">
          {/* The event was declared in §31 and nobody emitted it: the header
              moved on to measuring the app download, and no page CTA was
              measuring entry into the network. */}
          <TrackClick
            event="cta_encontrar_cargador_click"
            props={{ ubicacion: 'hero' }}
          >
            <Button
              variant="primary"
              size="l"
              arrow
              href={href(locale, routes.network)}
            >
              {t(actions.findCharger, locale)}
            </Button>
          </TrackClick>
        </div>

        {/* Scroll cue. `home.hero.scrollHint` was written and unused, and the
            hero is 88dvh tall with a 170vh beat right below it: without a cue,
            nothing indicates that the page continues. */}
        <p
          aria-hidden="true"
          className="mt-12 flex items-center gap-2 font-mono text-mono uppercase tracking-wider text-ink-3"
        >
          {t(home.hero.scrollHint, locale)}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-bounce motion-reduce:animate-none"
          >
            <path
              d="M12 5v14M6 13l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>

        {/* Real coverage from the cities collection: useful content that
            anchors the composition and opens a second entry into the B2C
            journey. It is neither decoration nor an invented figure. */}
        {coverage.length > 0 && (
          <nav
            aria-label={t(red.cities.title, locale)}
            className="mt-8 border-t border-line-strong pt-6"
          >
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {/* On mobile the label takes its own line. Sharing one,
                  "Bogotá" fitted alongside it and "Medellín" dropped alone to
                  a second row: the two cities ended up misaligned with each
                  other. */}
              <li className="basis-full font-mono text-mono uppercase tracking-wider text-ink-3 sm:basis-auto">
                {t(red.cities.title, locale)}
              </li>
              {coverage.map(({ city }) => (
                <li key={city.slug}>
                  <Link
                    href={href(locale, routes.city(city.slug))}
                    className="inline-flex min-h-11 items-center font-display text-display-s text-ink-2 transition-colors hover:text-brand"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </Section>
  )
}
