"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";

/**
 * SIGNATURE MOMENT #1 — Hero "Infraestructura que cobra vida".
 * Estructura → corriente → afirmación. Registro Impacto (energía verde→cian).
 * Texto = DOM real (accesible/traducible). Motion se anula con prefers-reduced-motion.
 */
export function Hero() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;
  // initial constante (evita hydration mismatch); reduced-motion → duración 0 (aparece al montar).
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.7, ease, delay: reduce ? 0 : delay },
  });

  return (
    <section
      id="top"
      className="grain relative flex min-h-[92vh] items-center overflow-hidden pt-16"
    >
      <CurrentField />
      {/* Resplandor de energía */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 size-[36rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-brand-2), transparent 70%)" }}
      />
      {/* Scrim de legibilidad: oscurece el lado del texto sin tapar la red a la derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-canvas/60 to-transparent"
      />

      <Container className="relative z-10 min-w-0">
        <div className="max-w-2xl">
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1/60 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-ink-2 backdrop-blur">
              <span className="size-1.5 rounded-full brand-gradient" aria-hidden="true" />
              {t({ es: "Red de carga eléctrica · Colombia", en: "EV charging network · Colombia" })}
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.08)}
            className="mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl md:text-7xl md:leading-[1.02]"
          >
            {t({ es: "La red que", en: "The network that" })}{" "}
            <span className="brand-text">{t({ es: "mueve a Colombia", en: "moves Colombia" })}</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-lg text-ink-2">
            {t({
              es: "Infraestructura de carga confiable y tecnología para conductores, empresas y espacios. Diseñada para crecer con el país.",
              en: "Reliable charging infrastructure and technology for drivers, businesses and spaces. Built to grow with the country.",
            })}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="l" arrow href="/red">
              {t({ es: "Encontrar cargador", en: "Find a charger" })}
            </Button>
            <Button variant="tertiary" size="l" arrow href="/empresas">
              {t({ es: "Soluciones para empresas", en: "Business solutions" })}
            </Button>
          </motion.div>

          {/* Escala (placeholders XX) */}
          <motion.dl {...fade(0.32)} className="mt-14 flex flex-wrap gap-x-10 gap-y-6">
            {[
              { v: "XX", l: t({ es: "estaciones", en: "stations" }) },
              { v: "XX", l: t({ es: "ciudades", en: "cities" }) },
              { v: "XX", l: t({ es: "MWh entregados", en: "MWh delivered" }) },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-display text-3xl font-semibold text-ink">
                  {s.v}
                  <span className="ml-1 align-top font-mono text-xs text-brand">+</span>
                </dd>
                <span className="text-sm text-ink-3">{s.l}</span>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}

/** Campo de corriente: estructura (grid) + líneas de corriente + nodos que laten. */
function CurrentField() {
  const nodes = [
    { x: 720, y: 120 },
    { x: 900, y: 220 },
    { x: 640, y: 300 },
    { x: 840, y: 380 },
    { x: 1040, y: 300 },
    { x: 760, y: 460 },
    { x: 980, y: 480 },
  ];
  const lines = [
    "M720 120 L900 220 L1040 300",
    "M720 120 L640 300 L840 380",
    "M900 220 L840 380 L980 480",
    "M640 300 L760 460 L980 480",
    "M840 380 L1040 300",
  ];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-25 md:opacity-100"
      viewBox="0 0 1240 640"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" />
          <stop offset="100%" stopColor="var(--color-brand-2)" />
        </linearGradient>
      </defs>

      {/* Grid estructural (registro silencio) */}
      <g stroke="var(--color-line)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 110} y1="0" x2={i * 110} y2="640" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 110} x2="1240" y2={i * 110} />
        ))}
      </g>

      {/* Trazos base + corriente animada */}
      <g fill="none">
        {lines.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="var(--color-line-strong)" strokeWidth="1.5" />
            <path
              d={d}
              stroke="url(#wire)"
              strokeWidth="2"
              className="current-line"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          </g>
        ))}
      </g>

      {/* Nodos (estaciones) que se encienden */}
      <g>
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="8" fill="url(#wire)" className="node-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx={n.x} cy={n.y} r="3" fill="var(--color-on-brand)" />
          </g>
        ))}
      </g>
    </svg>
  );
}
