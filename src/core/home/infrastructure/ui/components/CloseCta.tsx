import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { TrackClick } from '@ui/common/components/analytics/TrackClick'

/**
 * BEAT 7 · CIERRE — Intensidad: Alta · Registro: Impacto
 * ESTRUCTURA: asimétrica. Dos audiencias declaradas explícitamente, separadas
 * por una hairline, con jerarquía desigual: B2C es la acción primaria (único
 * gradiente de la vista), B2B es la secundaria.
 *
 * El usuario no elige un carril antes de entender la propuesta; aquí, al final
 * del recorrido, elegir es exactamente lo que toca (§10).
 */
export function CloseCta({ locale }: { locale: Locale }) {
  return (
    <Section
      register="impacto"
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

      <Container className="relative z-(--z-raised)">
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
                  href={href(locale, routes.red)}
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
                href={href(locale, `${routes.empresas}#contacto`)}
              >
                {t(actions.talkToTeam, locale)}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
