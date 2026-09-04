import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '@/content/copy/home'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getFeaturedCase } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@/components/ui/layout'
import { Media } from '@/components/ui/Media'
import { QuoteAttribution } from '@/components/ui/QuoteAttribution'
import { Button } from '@/components/ui/Button'
import { TrackView } from '@/components/analytics/TrackView'

/**
 * BEAT 5 · CASO REAL — Intensidad: Alta · Registro: Impacto
 * ESTRUCTURA: full-bleed con la cita ENCIMA del material, como tipografía
 * protagonista. No es un split de imagen + texto al lado.
 *
 * Es la prueba humana e institucional: sirve simultáneamente a confianza B2B
 * y a marca. Antes convivía con tres "XX" gigantes que dominaban la pantalla;
 * las métricas se movieron a /nosotros, donde el impacto es el tema (§33).
 */
export function ProofCase({ lang }: { lang: Locale }) {
  const featured = getFeaturedCase()
  if (!featured) return null

  return (
    <Section
      id="caso"
      register="impacto"
      space="none"
      ariaLabelledby="caso-title"
      className="isolate overflow-hidden"
    >
      <div className="absolute inset-0">
        <Media
          asset={media.aperturaEan}
          lang={lang}
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
          <Eyebrow tone="brand">{t(home.proof.eyebrow, lang)}</Eyebrow>
          <h2
            id="caso-title"
            className="font-display text-display-s font-semibold text-ink"
          >
            {t(home.proof.title, lang)}
          </h2>
        </div>

        {/* ── LA CITA, A ESCALA ────────────────────────────────────────
            Estaba en `display-xl`: 72px a 1440 para 100 caracteres, dentro de
            una medida de 20ch. Eso son seis líneas de tipografía enorme en un
            beat cuyo propio titular va a 24px — una diferencia de 3× que no
            era jerarquía sino desproporción, y rompía el ritmo de la página.

            `display-l` (52px) la mantiene como la voz más alta del beat sin
            competir con el Hero, que es el único `display-2xl` del sitio. Y la
            medida se ensancha de 20ch a 28ch: con menos cuerpo, forzar líneas
            cortas solo multiplica los cortes. */}
        <TrackView
          event="caso_visto"
          props={{ caso: featured.slug }}
        >
          <blockquote className="mt-12 max-w-[28ch] font-display text-display-l font-medium text-balance text-ink">
            {t(featured.quote, lang)}
          </blockquote>
        </TrackView>

        {/* La atribución va DESPUÉS de la cita: esto es una prueba, así que
            primero habla el cliente y después se acredita quién lo dijo. En el
            beat 7 la misma unidad va antes, por la razón contraria. Ver
            `QuoteAttribution`. */}
        <footer className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-line-strong pt-8">
          {/* `focus`: el retrato llegó de medio cuerpo y a 96px la cara
              quedaba en ~35px. El zoom con origen alto recorta hacia el
              rostro sin tocar el archivo — ver `QuoteAttribution`. */}
          <QuoteAttribution
            asset={media.retratoTestimonioEan}
            lang={lang}
            name={featured.author}
            role={t(featured.role, lang)}
            focus="scale-[1.75] origin-[50%_14%]"
          />
          {featured.stationSlug && (
            <div className="md:ml-auto">
              <Button
                variant="link"
                arrow
                href={href(lang, routes.station(featured.stationSlug))}
              >
                {t(actions.seeStation, lang)}
              </Button>
            </div>
          )}
        </footer>
      </Container>
    </Section>
  )
}
