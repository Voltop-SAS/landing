"use client";

import { useLang } from "@/lib/i18n";
import { howItWorks } from "@/content/site";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui/primitives";

export function HowItWorks() {
  const { t } = useLang();
  return (
    <Section register="silencio">
      <Container>
        <Reveal>
          <Eyebrow>{t({ es: "Cómo funciona", en: "How it works" })}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
            {t({ es: "Cargar es tan simple como usar una app", en: "Charging is as simple as using an app" })}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {howItWorks.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="border-t border-line pt-6">
                <span className="font-mono text-sm text-brand">{s.step}</span>
                <h3 className="mt-4 font-display text-xl font-semibold">{t(s.title)}</h3>
                <p className="mt-2 text-ink-2">{t(s.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
