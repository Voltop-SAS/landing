"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";

/**
 * BEAT 2 · SIGNATURE MOMENT — Intensidad: MUY ALTA · Registro: Impacto
 * ESTRUCTURA: contenedor alto con panel STICKY y scroll-scrub real.
 *
 * ── QUÉ ESTABA MAL, MEDIDO ────────────────────────────────────────────────
 * La sección medía 240vh —2160px a 1440×900— y la revelación completa era un
 * recorte del 12% que terminaba al 45% del recorrido, es decir a los 567px.
 * Después venían ~700px de scroll con la pantalla ABSOLUTAMENTE INMÓVIL. En una
 * Home de 9 viewports, el 26% del scroll lo consumía un beat que se queda
 * quieto más tiempo del que se mueve. Y el comentario prometía que "el texto
 * entra por fases": no lo hacía, era un único `Reveal`.
 *
 * ── QUÉ SE HIZO ───────────────────────────────────────────────────────────
 * - 240vh → 170vh. El recorrido se ajusta a lo que dura la revelación.
 * - El recorte pasa de 12% a 28% y termina al 70%, no al 45%: se percibe como
 *   apertura y ocupa casi todo el trayecto pegado.
 * - El texto entra en dos fases: antetítulo y titular primero, cuerpo y
 *   acciones después.
 * - Con `prefers-reduced-motion` la sección COLAPSA a altura normal. Antes
 *   dejaba 2160px de scroll muerto sin equivalente: quien pide menos movimiento
 *   recibía el coste del efecto sin el efecto.
 *
 * ── POR QUÉ LAS FASES SON TEMPORALES Y NO DE SCROLL ───────────────────────
 * Se intentó ligar la opacidad del texto a `scrollYProgress` para que las fases
 * ocurrieran a lo largo del recorrido. Es lo que el comentario original de este
 * archivo ya advertía y hay que dejarlo escrito: una opacidad ligada al
 * progreso VUELVE A 0 al retroceder, así que el texto desaparecería al subir, y
 * quien llegue por `#infraestructura` sin desplazarse vería una pantalla vacía.
 *
 * Las fases se resuelven con un desfase temporal sobre un `whileInView` de una
 * sola vez: una vez visible, el texto no vuelve a ocultarse (§21). El scroll
 * largo ya no necesita relleno — se acortó a lo que dura la revelación.
 */
export function InfrastructureSignature({ lang }: { lang: Locale }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  /* El MATERIAL se revela con scroll-scrub: arranca recortado y se abre a
     sangre completa. Los hooks se llaman siempre, sin condicionales. */
  /**
   * ── LA APERTURA, RECALIBRADA AL ENTRAR EL VIDEO ───────────────────────────
   * Los valores originales —`inset` de 28% a 0 sobre el 70% del recorrido,
   * `scale` de 1.12 a 1— se fijaron contra el hueco del placeholder, que era
   * una superficie QUIETA. Con material real fallaban por tres motivos, y los
   * tres se veían:
   *
   * 1. EL BORDE PARTÍA EL TITULAR. El texto empieza al 14.2% del ancho y el
   *    recorte llegaba al 28%: durante el primer 20% del recorrido una línea
   *    vertical cortaba las palabras. Medido a 5%, 10% y 15% de scroll.
   *    → El recorte ahora arranca en 10%, por debajo de ese 14.2%. El texto
   *      queda SIEMPRE dentro del cuadro, en cualquier punto del recorrido.
   *
   * 2. COMPETÍA CON EL PLANO. Una caja creciendo mientras la cámara avanza son
   *    dos movimientos a la vez; se percibe como agitación, no como apertura.
   *    → 10% en lugar de 28% lo convierte en un asentamiento, no en una caja
   *      que crece, y termina antes (45% del recorrido) para no arrastrarse
   *      sobre el movimiento del propio plano.
   *
   * 3. AMPLIABA EL VIDEO Y SE VEÍA BLANDO. Con `scale: 1.12`, en una Retina de
   *    1440 había que estirar la fuente hasta ~3226px. Con la fuente a 1920
   *    eso era un 1.68× de ampliación.
   *    → `scale` baja a 1.05 y la fuente sube a 2560: la ampliación pasa a
   *      1.18×. La profundidad se conserva; la blandura desaparece.
   */
  const insetPct = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [10, 0]);
  const clipPath = useTransform(insetPct, (v) => `inset(${v}% ${v}% ${v}% ${v}%)`);
  const scale = useTransform(scrollYProgress, [0, 0.45], reduce ? [1, 1] : [1.05, 1]);
  /**
   * RECALIBRADO al entrar la fotografía real (2026-09-01).
   *
   * Los valores anteriores —de 0.15 a 0.85— se fijaron contra el hueco
   * PLANO del placeholder, donde el fondo era una superficie uniforme y
   * oscura. Con foto real el párrafo y el rótulo caen sobre el cargador
   * iluminado y dejan de leerse: a 0.15 de opacidad no hay velo que valga.
   *
   * El suelo sube a 0.55 y el techo a 1. Se conserva la intención —el velo
   * CRECE con el recorrido, acompañando la apertura del recorte— pero parte
   * de un punto en el que el texto ya es legible, que es cuando empieza a
   * aparecer (`whileInView` con margen del 20%).
   */
  const scrimOpacity = useTransform(scrollYProgress, [0.1, 0.45], reduce ? [1, 1] : [0.8, 1]);

  /** Fase de entrada del texto. `once: true` — visible es para siempre. */
  const phase = (delay: number) => ({
    "data-reveal": "",
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-20% 0px -20% 0px" },
    transition: { duration: reduce ? 0 : duration.reveal, ease: ease.standard, delay: reduce ? 0 : delay },
  });

  return (
    <Section
      ref={ref}
      id="infraestructura"
      register="impacto"
      space="none"
      /* `motion-reduce:h-auto` colapsa el recorrido cuando no hay movimiento que
         justificarlo. El panel deja de estar pegado y la sección mide lo que
         mide su contenido. */
      className="h-[170vh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <motion.div style={{ scale, clipPath }} className="absolute inset-0">
          <Media
            asset={media.estacionMedellin}
            lang={lang}
            fill
            sizes="100vw"
            className="h-full"
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/88 to-canvas/45"
        />

        <Container className="relative z-(--z-raised) py-(--spacing-section-tight)">
          <motion.div {...phase(0)}>
            <Eyebrow tone="brand">{t(home.infrastructure.eyebrow, lang)}</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-ink">
              {t(home.infrastructure.title, lang)}
            </h2>
          </motion.div>

          <motion.div {...phase(0.18)}>
            <p className="mt-6 measure text-body-l text-ink-2">{t(home.infrastructure.lead, lang)}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="ghost" arrow href={href(lang, routes.station("san-fernando-plaza"))}>
                {t(actions.seeStation, lang)}
              </Button>
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.infrastructure.caption, lang)}
              </span>
            </div>
          </motion.div>
        </Container>
      </div>
    </Section>
  );
}
