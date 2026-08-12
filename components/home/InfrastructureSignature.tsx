"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";

/**
 * BEAT 2 · SIGNATURE MOMENT — Intensidad: MUY ALTA · Registro: Impacto
 * ESTRUCTURA: contenedor alto con panel STICKY y scroll-scrub real.
 *
 * Antes era un `scale` de 1.12→1: un parallax modesto que no cumplía la
 * revelación prometida. Ahora el panel se fija, el material se revela por
 * recorte y el texto entra por fases mientras se avanza (§ auditoría R3).
 *
 * Con `prefers-reduced-motion` todo queda en su estado final legible.
 */
export function InfrastructureSignature({ lang }: { lang: Locale }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const still: number[] = [1, 1];
  /* El MATERIAL se revela con scroll-scrub: arranca recortado y se abre a
     sangre completa. Los hooks se llaman siempre, sin condicionales. */
  const insetPct = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [12, 0]);
  const clipPath = useTransform(insetPct, (v) => `inset(${v}% ${v}% ${v}% ${v}%)`);
  const scale = useTransform(scrollYProgress, [0, 0.45], reduce ? still : [1.08, 1]);
  const scrimOpacity = useTransform(scrollYProgress, [0.2, 0.5], reduce ? [0.75, 0.75] : [0.2, 0.8]);

  /* El TEXTO no se scrubbea: aparece una vez y se queda. Una opacidad ligada
     al progreso puede volver a 0 al salir del rango y dejar el contenido
     invisible — un signature moment no puede depender de eso. */

  return (
    <section ref={ref} id="infraestructura" className="relative h-[240vh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <motion.div style={{ scale, clipPath }} className="absolute inset-0">
          <Media asset={media.estacionMedellin} lang={lang} fill sizes="100vw" className="h-full" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/50 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0"
        >
          <Container className="pb-(--spacing-section-tight)">
            <Eyebrow tone="brand">{t(home.infrastructure.eyebrow, lang)}</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-ink">
              {t(home.infrastructure.title, lang)}
            </h2>
            <p className="mt-6 measure text-body-l text-ink-2">{t(home.infrastructure.lead, lang)}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="ghost" arrow href={href(lang, routes.station("san-fernando-plaza"))}>
                {t(actions.seeStation, lang)}
              </Button>
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.infrastructure.caption, lang)}
              </span>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
