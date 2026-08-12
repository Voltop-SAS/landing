"use client";

import { useLang, type Localized } from "@/lib/i18n";
import { Container } from "@/components/ui/primitives";

/** Hero de página interna: compacto, deja aire bajo el header fijo. */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: Localized;
  title: Localized;
  intro?: Localized;
}) {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-64 w-[36rem] opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-brand-2), transparent 70%)" }}
      />
      <Container className="relative">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">{t(eyebrow)}</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          {t(title)}
        </h1>
        {intro && <p className="mt-5 max-w-xl text-lg text-ink-2">{t(intro)}</p>}
      </Container>
    </section>
  );
}
