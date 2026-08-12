"use client";

import { useLang } from "@/lib/i18n";
import { impactMetrics, testimonials } from "@/content/site";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui/primitives";

/** Confianza por evidencia: impacto (placeholders XX) + partners + testimonios. */
export function Trust() {
  const { t } = useLang();
  return (
    <Section id="impacto" register="silencio">
      <Container>
        {/* Impacto — números energizados (momento de datos) */}
        <Reveal>
          <Eyebrow>{t({ es: "Impacto", en: "Impact" })}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
            {t({ es: "Una red que crece con el país", en: "A network growing with the country" })}
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-structural)] border border-line bg-line md:grid-cols-4">
            {impactMetrics.map((m) => (
              <div key={m.label.es} className="bg-canvas p-6 md:p-8">
                <div className="font-display text-4xl font-semibold brand-text md:text-5xl">{m.value}</div>
                <div className="mt-2 text-sm text-ink-3">
                  {t(m.label)}
                  {!m.validated && (
                    <span className="ml-1 font-mono text-[10px] uppercase text-brand/70" title="Cifra provisional">
                      · placeholder
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Partners (placeholder) */}
        <Reveal delay={0.1}>
          <p className="mt-16 text-center font-mono text-xs uppercase tracking-widest text-ink-3">
            {t({ es: "Empresas que confían en Voltop", en: "Companies that trust Voltop" })}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid h-10 w-32 place-items-center rounded-[8px] border border-dashed border-line-strong font-mono text-[10px] text-ink-3"
                title="Logo de partner pendiente"
              >
                LOGO
              </div>
            ))}
          </div>
        </Reveal>

        {/* Testimonios */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((tm, i) => (
            <Reveal key={tm.author} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between rounded-[var(--radius-structural)] border border-line bg-surface-1 p-8">
                <blockquote className="font-display text-xl leading-snug text-ink">
                  “{t(tm.quote)}”
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="text-ink">{tm.author}</span>
                  <span className="text-ink-3"> · {t(tm.role)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
