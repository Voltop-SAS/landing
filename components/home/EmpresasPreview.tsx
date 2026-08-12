"use client";

import { useLang } from "@/lib/i18n";
import { businessSegments } from "@/content/site";
import { Section, Container, Reveal, Eyebrow, PlaceholderMedia } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/**
 * Beat EMPRESAS (preview) — propuesta B2B breve y convincente. Sin selector ni formulario (viven en /empresas).
 */
export function EmpresasPreview() {
  const { t } = useLang();
  return (
    <Section id="empresas-preview" register="silencio">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Reveal>
              <Eyebrow>{t({ es: "Empresas y espacios", en: "Business & spaces" })}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {t({ es: "También construimos infraestructura para tu negocio", en: "We build infrastructure for your business too" })}
              </h2>
              <p className="mt-4 max-w-md text-ink-2">
                {t({
                  es: "Carga confiable y gestionada de principio a fin, para empresas, flotas, espacios comerciales y partners.",
                  en: "Reliable, end-to-end managed charging for companies, fleets, properties and partners.",
                })}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {businessSegments.map((s) => (
                  <li key={s.key} className="flex items-center gap-2.5 text-ink">
                    <span className="size-1.5 rounded-full brand-gradient" aria-hidden="true" />
                    {t(s.label)}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8">
                <Button variant="primary" arrow href="/empresas">
                  {t({ es: "Descubre soluciones para empresas", en: "Explore business solutions" })}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="order-1 lg:order-2">
            <PlaceholderMedia
              label={t({ es: "Fotografía real de espacio comercial / flota", en: "Real photo of commercial space / fleet" })}
              className="aspect-[4/3] w-full"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
