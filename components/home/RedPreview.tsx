"use client";

import { useLang } from "@/lib/i18n";
import { featuredStations } from "@/content/site";
import { Section, Container, Reveal, Eyebrow, PlaceholderMedia } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/**
 * Beat RED (preview) — comunica escala/infraestructura y provoca explorar.
 * NO resuelve el mapa: enlaza a /red. Foto real + estaciones destacadas (datos).
 */
export function RedPreview() {
  const { t } = useLang();
  return (
    <Section id="red-preview" register="silencio">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Foto real de estación (placeholder) */}
          <Reveal>
            <PlaceholderMedia
              label={t({ es: "Fotografía real de estación Voltop", en: "Real Voltop station photo" })}
              className="aspect-[4/3] w-full"
            />
          </Reveal>

          {/* Texto + estaciones destacadas */}
          <div>
            <Reveal>
              <Eyebrow>{t({ es: "La red", en: "The network" })}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {t({ es: "Una red que ya está en la calle", en: "A network already on the road" })}
              </h2>
              <p className="mt-4 max-w-md text-ink-2">
                {t({
                  es: "Estaciones operando en puntos estratégicos del país, y creciendo. Encuentra dónde cargar en segundos.",
                  en: "Stations operating at strategic points across the country, and growing. Find where to charge in seconds.",
                })}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {featuredStations.map((s) => (
                  <li key={s.slug} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <a href={`/red/${s.slug}`} className="font-display font-semibold text-ink transition-colors hover:text-brand">
                        {s.name}
                      </a>
                      <span className="ml-2 text-sm text-ink-3">{s.city}</span>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-ink-2">
                      {s.powerKw} kW · {s.points} {t({ es: "puntos", en: "pts" })}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" arrow href="/red">
                  {t({ es: "Encontrar cargador", en: "Find a charger" })}
                </Button>
                <Button variant="tertiary" arrow href="/red">
                  {t({ es: "Ver toda la red", en: "See the whole network" })}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
