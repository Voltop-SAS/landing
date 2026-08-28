import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getFeaturedCase } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { TrackView } from "@/components/analytics/TrackView";

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
  const featured = getFeaturedCase();
  if (!featured) return null;

  return (
    <Section id="caso" register="impacto" space="none" ariaLabelledby="caso-title" className="isolate overflow-hidden">
      <div className="absolute inset-0">
        <Media asset={media.aperturaEan} lang={lang} fill sizes="100vw" className="h-full" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-canvas/78" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas"
      />

      <Container className="relative z-(--z-raised) py-(--spacing-section-loose)">
        <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
          <Eyebrow tone="brand">{t(home.proof.eyebrow, lang)}</Eyebrow>
          <h2 id="caso-title" className="font-display text-display-s font-semibold text-ink">
            {t(home.proof.title, lang)}
          </h2>
        </div>

        <TrackView event="caso_visto" props={{ caso: featured.slug }}>
          <blockquote className="mt-12 max-w-[22ch] font-display text-display-xl font-medium text-balance text-ink md:max-w-[20ch]">
            {t(featured.quote, lang)}
          </blockquote>
        </TrackView>

        <footer className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line-strong pt-8">
          <p className="text-body-s">
            <span className="text-ink">{featured.author}</span>
            <span className="text-ink-3"> · {t(featured.role, lang)}</span>
          </p>
          {featured.stationSlug && (
            <Button variant="link" arrow href={href(lang, routes.station(featured.stationSlug))}>
              {t(actions.seeStation, lang)}
            </Button>
          )}
        </footer>
      </Container>
    </Section>
  );
}
