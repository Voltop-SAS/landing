import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { TrackClick } from '@ui/common/components/analytics/TrackClick'

/**
 * BEAT 9 · CLOSE — Intensity: High · Register: Impact
 * STRUCTURE: asymmetric. Two audiences declared explicitly, separated by a
 * hairline, with uneven hierarchy: B2C is the primary action (the only
 * gradient in the view), B2B is the secondary one.
 *
 * The user does not pick a lane before understanding the proposition; here, at
 * the end of the journey, choosing is exactly what comes next (§10).
 */
export function CloseCta({ locale }: { locale: Locale }) {
  return (
    <Section
      register="impact"
      space="base"
      className="overflow-hidden border-t border-line"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/2 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, var(--color-brand), transparent 70%)',
        }}
      />

      {/* ── THE CLOSE NOW REVEALS, LIKE THE REST ─────────────────────────
          Review of 2026-09-08. Seven of the nine beats reveal on entry —
          `Reveal` in beats 3, 4, 6, 7, 8, and the scroll-driven signature in
          beat 2 — and this one appeared already in place. Scrolling the page
          end to end, the last thing you reach was the only thing that did not
          arrive.

          `Reveal` and not a new mechanism: it already resolves the two traps
          this project documented — `prefers-reduced-motion`, and the reveal
          that never fires for content that was above the fold on a mid-page
          reload (`useScrolledPast`). Default intensity: the register of this
          beat is composition, not motion. */}
      <Reveal className="relative z-(--z-raised)">
        <Container>
          <SectionHeading>{t(home.close.title, locale)}</SectionHeading>

          <div className="mt-12 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-0">
            <div className="md:pr-14">
              <p className="font-mono text-mono uppercase tracking-wider text-brand">
                {t(home.close.b2c.label, locale)}
              </p>
              <p className="mt-4 max-w-[34ch] text-body-l text-ink">
                {t(home.close.b2c.body, locale)}
              </p>
              <div className="mt-7">
                <TrackClick
                  event="cta_encontrar_cargador_click"
                  props={{ ubicacion: 'cierre' }}
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
            </div>

            <div className="border-t border-line pt-10 md:border-l md:border-t-0 md:pl-14 md:pt-0">
              <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.close.b2b.label, locale)}
              </p>
              <p className="mt-4 max-w-[34ch] text-body text-ink-2">
                {t(home.close.b2b.body, locale)}
              </p>
              <div className="mt-7">
                <Button
                  variant="secondary"
                  arrow
                  href={href(locale, `${routes.business}#contacto`)}
                >
                  {t(actions.talkToTeam, locale)}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Reveal>
    </Section>
  )
}
