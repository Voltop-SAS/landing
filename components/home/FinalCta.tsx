"use client";

import { useLang } from "@/lib/i18n";
import { Container, Reveal } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/** Cierre — registro Impacto (energía). Doble acción: B2C + B2B. */
export function FinalCta() {
  const { t } = useLang();
  return (
    <section className="grain relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-brand), transparent 70%)" }}
      />
      <Container className="relative z-10 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {t({ es: "Conecta con la red que", en: "Connect to the network that" })}{" "}
            <span className="brand-text">{t({ es: "mueve a Colombia", en: "moves Colombia" })}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="l" arrow href="/red">
              {t({ es: "Encontrar cargador", en: "Find a charger" })}
            </Button>
            <Button variant="secondary" size="l" arrow href="/empresas">
              {t({ es: "Hablar con el equipo", en: "Talk to the team" })}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
