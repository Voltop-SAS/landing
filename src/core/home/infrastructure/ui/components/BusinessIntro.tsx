import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { getBusinessSegments } from '~/core/common/infrastructure/data-access'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { cn } from '@ui/common/lib/cn'

/**
 * BEAT 4 · BUSINESS — Intensity: Medium-low · Register: Silence · Space: loose
 * STRUCTURE: centred narrow column, plenty of air, no media.
 *
 * It is the page's BREATHING SPACE: it arrives after beat 3's dense index and
 * before beat 5's visual peak. Its contrast is rhythm, not image.
 *
 * It used to be a two-column split mirroring the previous beat — exactly the
 * predictable symmetry the system forbids (§12).
 */
export function BusinessIntro({ locale }: { locale: Locale }) {
  const segments = getBusinessSegments()

  return (
    <Section
      id="empresas"
      space="loose"
      ariaLabelledby="empresas-title"
    >
      {/* `align="center"` is explicit: this composition IS centred on purpose
          (§12, compositional contrast). Declaring it distinguishes this from
          the accidental misalignment the rest of the site used to have. */}
      <Container
        width="narrow"
        align="center"
        className="text-center"
      >
        <Reveal>
          <SectionHeading
            id="empresas-title"
            kicker={t(home.business.eyebrow, locale)}
            kickerTone="brand"
          >
            {t(home.business.title, locale)}
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[46ch] text-body-l text-ink-2">
            {t(home.business.lead, locale)}
          </p>
        </Reveal>
      </Container>

      {/* The four cases as horizontal typographic rhythm, NOT as cards. The
          comment used to say that while the code rendered four cells bordered
          on all four sides: exactly the cards §12 forbids. It is now a row of
          columns separated by vertical hairlines, with no box. And with no
          number: four audiences are not a sequence. */}
      <Container className="mt-14">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-0">
          {segments.map((s, i) => (
            <Reveal
              as="li"
              key={s.key}
              index={i}
              className={cn(
                'border-t border-line-strong pt-6 text-left md:border-t-0 md:border-l md:border-line md:pl-6 md:pt-0',
                i === 0 && 'md:border-l-0 md:pl-0',
              )}
            >
              <h3 className="font-display text-display-s font-semibold text-ink">
                {t(s.label, locale)}
              </h3>
              <p className="mt-2 text-body-s text-ink-2">{t(s.headline, locale)}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button
            variant="ghost"
            arrow
            href={href(locale, routes.business)}
          >
            {t(actions.businessSolutions, locale)}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
