import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getFeaturedCase } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { QuoteAttribution } from '@ui/common/components/ui/QuoteAttribution'
import { Button } from '@ui/common/components/ui/Button'

/**
 * BEAT 5 · REAL CASE — Intensity: High · Register: Impact
 * STRUCTURE: full-bleed with the quote OVER the material, as the leading
 * typography. It is not an image + adjacent text split.
 *
 * It is the human and institutional proof: it serves B2B trust and brand at
 * the same time. It used to sit alongside three giant "XX" placeholders that
 * dominated the screen; the metrics moved to /nosotros, where impact is the
 * subject (§33).
 */
export function ProofCase({ locale }: { locale: Locale }) {
  const featured = getFeaturedCase()
  if (!featured) return null

  return (
    <Section
      id="caso"
      register="impact"
      space="none"
      ariaLabelledby="caso-title"
      className="isolate overflow-hidden"
    >
      <div className="absolute inset-0">
        <Media
          asset={media.eanOpening}
          locale={locale}
          fill
          sizes="100vw"
          className="h-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-canvas/78"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas"
      />

      <Container className="relative z-(--z-raised) py-(--spacing-section-loose)">
        <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
          <Eyebrow tone="brand">{t(home.proof.eyebrow, locale)}</Eyebrow>
          <h2
            id="caso-title"
            className="font-display text-display-s font-semibold text-ink"
          >
            {t(home.proof.title, locale)}
          </h2>
        </div>

        {/* ── THE QUOTE, AT SCALE ──────────────────────────────────────
            It was set in `display-xl`: 72px at 1440 for 100 characters, inside
            a 20ch measure. That is six lines of enormous type in a beat whose
            own headline runs at 24px — a 3× difference that was not hierarchy
            but disproportion, and it broke the page's rhythm.

            `display-l` (52px) keeps it as the loudest voice in the beat
            without competing with the Hero, which is the site's only
            `display-2xl`. And the measure widens from 20ch to 28ch: at a
            smaller size, forcing short lines only multiplies the breaks. */}
        <blockquote className="mt-12 max-w-[28ch] font-display text-display-l font-medium text-balance text-ink">
          {t(featured.quote, locale)}
        </blockquote>

        {/* The attribution goes AFTER the quote: this is proof, so the client
            speaks first and only then do we credit who said it. In beat 7 the
            same unit goes before, for the opposite reason. See
            `QuoteAttribution`. */}
        <footer className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-line-strong pt-8">
          {/* `focus`: the portrait arrived as a half-body shot and at 96px
              the face came out at ~35px. The zoom with a high origin crops
              towards the face without touching the file — see
              `QuoteAttribution`. */}
          <QuoteAttribution
            asset={media.eanTestimonialPortrait}
            locale={locale}
            name={featured.author}
            role={t(featured.role, locale)}
            focus="scale-[1.75] origin-[50%_14%]"
          />
          {featured.stationSlug && (
            <div className="md:ml-auto">
              <Button
                variant="link"
                arrow
                href={href(locale, routes.station(featured.stationSlug))}
              >
                {t(actions.seeStation, locale)}
              </Button>
            </div>
          )}
        </footer>
      </Container>
    </Section>
  )
}
