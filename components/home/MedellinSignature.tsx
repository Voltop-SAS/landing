"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { VideoPlaceholder } from "@/components/ui/primitives";

/**
 * SIGNATURE MOMENT · Infraestructura real (Medellín).
 * Revelación al scroll (alt B): el video escala a full-bleed y la corriente traza lo físico.
 * Demostración tangible de que Voltop construye infraestructura real.
 */
export function MedellinSignature() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [1.12, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.35], [0.9, 0.55]);

  return (
    <section id="infra-medellin" ref={ref} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      {/* Video full-bleed (placeholder) con leve escala al entrar */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <VideoPlaceholder
          className="h-full w-full"
          label={t({ es: "Nueva estación · Medellín (video de alta calidad)", en: "New station · Medellín (high-quality video)" })}
          duration="1:20"
        />
      </motion.div>

      {/* Scrim de legibilidad */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-canvas/70"
      />
      {/* Acento de corriente (comportamiento sobre lo real) */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 brand-gradient opacity-80" />

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-[1240px] px-6 pb-16 md:px-10 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              {t({ es: "Infraestructura real", en: "Real infrastructure" })}
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {t({ es: "Construimos estaciones diseñadas como lugares", en: "We build stations designed as places" })}
            </h2>
            <p className="mt-5 max-w-xl text-lg text-ink-2">
              {t({
                es: "No solo puntos de carga: infraestructura real, en operación, que crece por todo el país.",
                en: "Not just charging points: real infrastructure, in operation, growing across the country.",
              })}
            </p>
            <div className="mt-8">
              <Button variant="secondary" arrow href="/red/san-fernando-plaza">
                {t({ es: "Ver esta estación", en: "See this station" })}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
