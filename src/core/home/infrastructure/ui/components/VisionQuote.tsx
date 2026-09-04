import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getFounder } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'

/**
 * BEAT 6 · VISION — Intensity: Medium-high · Register: Silence · Space: loose
 * STRUCTURE: two columns —the founder's portrait and his words—. It inverts
 * beat 5's relationship: there the text goes OVER the material and the photo
 * credits it; here the person and the text sit at the same level.
 *
 * ── THE FILM LEFT THIS BEAT ───────────────────────────────────────────────
 * This beat used to close with `filmVoltop` in a wide 16/9 band, and it was
 * the home page's second signature moment. It was withdrawn on 2026-09-04 by
 * a product decision, and in passing that resolves something noted as pending:
 * that file is THE SAME one as the cover of the Wake entry, so the same film
 * was playing in two places on the site. It now lives only in the log, which
 * is where it has context.
 *
 * `FilmStage` went with it — the component that gave the film its reveal on
 * entry and dimmed the page during playback. It is in the git history: if the
 * film comes back, it gets recovered from there rather than leaving an unused
 * component waiting just in case.
 *
 * The home page is left with ONE signature moment —beat 2's pinned panel—
 * instead of two. That is worth knowing: the intensity curve as designed had
 * two peaks five beats apart, and the second is now carried by this beat with
 * the portrait, which is of a different order.
 *
 * It was the best-resolved moment of the previous prototype: its editorial
 * register is kept and it is given the air it lacked.
 */
export function VisionQuote({ locale }: { locale: Locale }) {
  const founder = getFounder()
  if (!founder.quote) return null

  return (
    <Section
      id="vision"
      space="loose"
      ariaLabelledby="vision-title"
    >
      {/* ── TWO COLUMNS: THE PERSON AND HIS WORDS ────────────────────────
          This beat used to be a narrow column with the portrait reduced to a
          96px thumbnail in the attribution row. The portrait now occupies half
          a column vertically, and the change is not one of size but of
          function: in beat 5 the photo CREDITS a testimonial —who said it—
          while here the person IS the subject. It is the founder's vision in
          the first person; his face carries as much weight as the text.

          The two quote sections still belong to the same system: the same
          frame, the same structural radius, the same hairline. What separates
          them is scale, and it separates them on purpose.

          `items-center` aligns the text against the centre of the portrait
          rather than hanging both from the top: with differing heights that is
          the only thing that reads them as one unit. */}
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
          {/* THE PORTRAIT. Same surface language as the city cards. Not
              delivered yet: until it arrives it is a quiet surface —with no
              label, like the rest of the gaps this size— and the file drops in
              with `object-cover` without touching the layout. */}
          {/* Capped when it stacks. With no cap, at 768px the single column
              gave it the full 702px of width and the 2/3 ratio turned that
              into 1053px of height: a thousand-pixel gap that grew the section
              to 2060. With `max-w-sm` it settles at 384×576 and centred, which
              is a strong presence without being a wall. From `lg` up the grid
              takes over. */}
          <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-(--radius-structural) border border-line bg-surface-1 lg:mx-0 lg:max-w-none">
            {media.retratoFundador.src && (
              <Image
                src={media.retratoFundador.src}
                alt={t(media.retratoFundador.alt, locale)}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            )}
          </div>

          <Reveal>
            <Eyebrow tone="brand">{t(home.vision.eyebrow, locale)}</Eyebrow>

            {/* Name and role BEFORE the quote. With the portrait alongside,
              who is speaking is already said visually; putting it in text here
              names him before 280 characters in the first person begin, which
              is when knowing it is useful. In beat 5 it goes after, because
              there the testimonial is credited, not introduced. */}
            <p className="mt-5 text-body-s">
              <span className="font-medium text-ink">{founder.name}</span>
              <span className="text-ink-3"> · {t(founder.role, locale)}</span>
            </p>

            {/* ── THE QUOTE, AT SCALE ────────────────────────────────────────
              It was set in `display-m md:display-l`: 52px at 1440 for almost
              300 characters, which is ten lines of headline type. At that size
              the quote stopped being read and started being looked at.

              It drops to `display-s md:display-m` (24 → 36px). Long text asks
              for a smaller size, not a larger one: this beat's presence comes
              from the composition —narrow column, portrait, the film below—
              and not from the size of the letters. */}
            <blockquote
              id="vision-title"
              className="mt-7 font-display text-display-s font-medium text-balance text-ink md:text-display-m"
            >
              {t(founder.quote, locale)}
            </blockquote>

            <div className="mt-8 border-t border-line pt-6">
              <Button
                variant="link"
                arrow
                href={href(locale, routes.nosotros)}
              >
                {t(actions.knowVoltop, locale)}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
