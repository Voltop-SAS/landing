import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { red } from "@/content/copy/red";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getCitiesWithStations } from "@/lib/data";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";

/**
 * BEAT 1 · HERO — Intensidad: Alta · Registro: Impacto
 * ESTRUCTURA: full-bleed sobre infraestructura real, contenido anclado abajo
 * a la izquierda, columna única, tipografía sobredimensionada.
 *
 * Se eliminó la constelación de nodos: era el cliché visual del sector y
 * contradecía el reencuadre 70% mundo real / 30% comportamiento (§12).
 * El hero ya no lleva métricas: no hay cifras validadas y diez placeholders
 * destruían la credibilidad de la página (§33).
 *
 * Server Component: el titular y el CTA son HTML servido — bueno para LCP.
 */
export function Hero({ lang }: { lang: Locale }) {
  const coverage = getCitiesWithStations();

  return (
    <section className="relative flex min-h-[88dvh] flex-col justify-end overflow-hidden">
      {/* Material real de fondo */}
      <div className="absolute inset-0">
        <Media asset={media.infraestructuraAmplia} lang={lang} fill priority sizes="100vw" className="h-full" />
      </div>

      {/* Scrim de legibilidad: densidad abajo, aire arriba */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/75 to-canvas/30"
      />
      {/* Acento de corriente: una sola línea, en el borde. Señal, no textura. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px brand-gradient opacity-70" />

      <Container className="relative z-10 pb-(--spacing-section-tight) pt-32">
        <Eyebrow tone="brand">{t(home.hero.eyebrow, lang)}</Eyebrow>

        <h1 className="mt-6 max-w-[15ch] font-display text-display-2xl font-semibold text-ink">
          {t(home.hero.title, lang)}
        </h1>

        <p className="mt-7 measure text-body-l text-ink-2">{t(home.hero.lead, lang)}</p>

        <div className="mt-10">
          <Button variant="primary" size="l" arrow href={href(lang, routes.red)}>
            {t(actions.findCharger, lang)}
          </Button>
        </div>

        {/* Cobertura real desde la colección de ciudades: contenido útil que
            ancla la composición y abre una segunda entrada al journey B2C.
            No es decoración ni una cifra inventada. */}
        {coverage.length > 0 && (
          <nav aria-label={t(red.cities.title, lang)} className="mt-14 border-t border-line-strong pt-6">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <li className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(red.cities.title, lang)}
              </li>
              {coverage.map(({ city }) => (
                <li key={city.slug}>
                  <Link
                    href={href(lang, routes.city(city.slug))}
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
    </section>
  );
}
