"use client";

import { useLang } from "@/lib/i18n";
import { Container, Reveal, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

/** Dos caminos: segmentación suave B2C / B2B (sin forzar al usuario a elegir un carril). */
export function Paths() {
  const { t } = useLang();

  const paths = [
    {
      k: "b2c",
      eyebrow: t({ es: "Conductores", en: "Drivers" }),
      title: t({ es: "Carga donde vayas", en: "Charge wherever you go" }),
      body: t({
        es: "Encuentra estaciones disponibles y compatibles, revisa su estado y empieza a cargar en segundos.",
        en: "Find available, compatible stations, check their status and start charging in seconds.",
      }),
      cta: t({ es: "Explorar la red", en: "Explore the network" }),
      href: "#red",
    },
    {
      k: "b2b",
      eyebrow: t({ es: "Empresas y espacios", en: "Business & spaces" }),
      title: t({ es: "Electrifica tu negocio", en: "Electrify your business" }),
      body: t({
        es: "Soluciones de carga para empresas, flotas y espacios comerciales — confiables y gestionadas de principio a fin.",
        en: "Charging solutions for companies, fleets and properties — reliable and managed end to end.",
      }),
      cta: t({ es: "Ver soluciones", en: "See solutions" }),
      href: "#empresas",
    },
  ];

  return (
    <Container className="py-24 md:py-28">
      <div className="grid gap-px overflow-hidden rounded-[var(--radius-structural)] border border-line bg-line md:grid-cols-2">
        {paths.map((p, i) => (
          <Reveal key={p.k} delay={i * 0.08} className="bg-canvas">
            <div className="group flex h-full flex-col p-8 transition-colors hover:bg-surface-1 md:p-12">
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {p.title}
              </h2>
              <p className="mt-4 max-w-md text-ink-2">{p.body}</p>
              <div className="mt-8 pt-2">
                <Button variant="tertiary" arrow href={p.href}>
                  {p.cta}
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
