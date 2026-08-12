"use client";

import { useLang } from "@/lib/i18n";
import { eanCase, impactMetrics } from "@/content/site";
import { Section, Container, Reveal, Eyebrow, VideoPlaceholder } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/**
 * Beat CASO REAL · EAN (personas + partnership) + señales de escala/impacto orgánicas.
 * Prueba humana B2C y B2B. Editorial, no galería.
 */
export function CasoEAN() {
  const { t } = useLang();
  return (
    <Section id="caso-ean" register="silencio">
      <Container>
        <Reveal>
          <Eyebrow>{t({ es: "Caso real", en: "Real case" })}</Eyebrow>
        </Reveal>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Media del evento EAN */}
          <Reveal className="lg:col-span-7">
            <VideoPlaceholder
              className="aspect-video w-full rounded-[var(--radius-structural)]"
              label={t({ es: "Apertura Universidad EAN · evento, infraestructura, directivos y CEO", en: "EAN University opening · event, infrastructure, directors and CEO" })}
              duration="2:05"
            />
          </Reveal>

          {/* Cita como tipografía protagonista */}
          <div className="lg:col-span-5">
            <Reveal delay={0.06}>
              <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
                “{t(eanCase.quote)}”
              </blockquote>
              <div className="mt-6 text-sm">
                <span className="text-ink">{eanCase.author}</span>
                <span className="text-ink-3"> · {t(eanCase.role)}</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Escala/impacto integrado + partners (señales de Nosotros) */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-end justify-between gap-10 border-t border-line pt-10">
            <dl className="flex flex-wrap gap-x-12 gap-y-6">
              {impactMetrics.slice(0, 3).map((m) => (
                <div key={m.label.es}>
                  <dt className="sr-only">{t(m.label)}</dt>
                  <dd className="font-display text-4xl font-semibold brand-text">{m.value}</dd>
                  <span className="text-sm text-ink-3">
                    {t(m.label)}
                    {!m.validated && <span className="ml-1 font-mono text-[10px] uppercase text-brand/60">· ph</span>}
                  </span>
                </div>
              ))}
            </dl>
            <Button variant="tertiary" arrow href="/nosotros">
              {t({ es: "Conoce nuestro impacto", en: "See our impact" })}
            </Button>
          </div>

          {/* Franja de partners (placeholder) */}
          <div className="mt-10 flex flex-wrap items-center gap-4 opacity-80">
            <span className="mr-2 font-mono text-xs uppercase tracking-widest text-ink-3">
              {t({ es: "Con la confianza de", en: "Trusted by" })}
            </span>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid h-9 w-28 place-items-center rounded-[8px] border border-dashed border-line-strong font-mono text-[10px] text-ink-3" title="Logo pendiente">
                LOGO
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
