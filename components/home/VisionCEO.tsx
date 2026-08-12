"use client";

import { useLang } from "@/lib/i18n";
import { founder } from "@/content/site";
import { Section, Container, Reveal, Eyebrow, VideoPlaceholder } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/**
 * Beat VISIÓN · CEO — cinematográfico y breve. Palabras como tipografía protagonista.
 * NO talking-head corporativo. Enlaza a /nosotros.
 */
export function VisionCEO() {
  const { t } = useLang();
  return (
    <Section id="vision" register="silencio">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{t({ es: "Visión", en: "Vision" })}</Eyebrow>
              <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl">
                <span className="brand-text">“</span>
                {t(founder.quote)}
                <span className="brand-text">”</span>
              </blockquote>
              <div className="mt-6 text-sm">
                <span className="text-ink">{founder.author}</span>
                <span className="text-ink-3"> · {t(founder.role)}</span>
              </div>
              <div className="mt-8">
                <Button variant="tertiary" arrow href="/nosotros">
                  {t({ es: "Conoce a Voltop", en: "About Voltop" })}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.06} className="lg:col-span-7">
            <VideoPlaceholder
              className="aspect-video w-full rounded-[var(--radius-structural)]"
              label={t({ es: "CEO de Voltop hablando de la visión, desde una estación", en: "Voltop CEO on the vision, from a station" })}
              duration="0:45"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
