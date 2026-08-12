"use client";

import { useLang } from "@/lib/i18n";
import { founder } from "@/content/site";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui/primitives";

export function BrandVision() {
  const { t } = useLang();
  return (
    <Section id="nosotros" register="silencio">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>{t({ es: "Nosotros", en: "Company" })}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {t({ es: "Infraestructura para un país eléctrico", en: "Infrastructure for an electric country" })}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <Reveal delay={0.08}>
              <blockquote className="font-display text-2xl leading-snug tracking-tight text-ink md:text-4xl">
                <span className="brand-text">“</span>
                {t(founder.quote)}
                <span className="brand-text">”</span>
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                {/* Foto de fundador — PLACEHOLDER */}
                <span
                  className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong font-mono text-[10px] text-ink-3"
                  title="Foto pendiente"
                >
                  BO
                </span>
                <div className="text-sm">
                  <div className="text-ink">{founder.author}</div>
                  <div className="text-ink-3">{t(founder.role)}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
