"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { t, type Locale } from "@/lib/i18n/config";
import type { MediaAsset } from "@/content/data/media";

/**
 * VIDEO DE FONDO · respeta la preferencia de movimiento reducido.
 *
 * ── POR QUÉ ES UN COMPONENTE APARTE ───────────────────────────────────────
 * `Media` es Server Component y no puede leer una media query. El video se
 * reproducía SIEMPRE, también con `prefers-reduced-motion: reduce`. Con el
 * hueco del placeholder eso no se notaba —no había video— y salió al entrar
 * el material real.
 *
 * No es un detalle: es un bucle infinito de contenido en movimiento junto al
 * texto que se está leyendo. §21 lo exige y WCAG 2.2.2 pide un mecanismo para
 * detener el movimiento que arranca solo y dura más de cinco segundos.
 *
 * Con la preferencia activa no se reproduce y se muestra el **póster**, que es
 * el fotograma 0 del propio bucle: se ve la misma imagen, quieta.
 *
 * Solo esta rama es cliente. La fotografía sigue renderizándose en el servidor.
 */
export function VideoMedia({
  asset,
  lang,
  className,
  controls = false,
}: {
  asset: MediaAsset;
  lang: Locale;
  className?: string;
  /**
   * `true` cuando el material es una PIEZA QUE SE VE, no un fondo.
   *
   * Cambia el comportamiento entero: con controles no hay reproducción
   * automática, no hay bucle y no se silencia. Un fondo se mira sin querer;
   * una pieza con narración se decide ver, y para eso hace falta poder darle
   * play, pausar, buscar y oírla.
   *
   * `prefers-reduced-motion` deja de aplicar aquí: nada arranca solo, así que
   * no hay movimiento que la preferencia deba frenar.
   */
  controls?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  /* `autoPlay` no basta: si la preferencia cambia en caliente, o si el
     navegador arrancó la reproducción antes de hidratar, hay que detenerlo. */
  useEffect(() => {
    const v = ref.current;
    if (!v || controls) return;
    if (reduce) v.pause();
    else void v.play().catch(() => {});
  }, [reduce, controls]);

  return (
    <video
      ref={ref}
      className={className}
      poster={asset.poster ?? undefined}
      /* `none` en los dos modos: un fondo no debe competir con el LCP, y una
         pieza con controles no debe descargar 27 MB a quien no le dio play.
         Solo viaja el póster hasta que alguien lo pide. */
      preload="none"
      controls={controls || undefined}
      muted={!controls}
      loop={!controls}
      playsInline
      autoPlay={controls ? undefined : !reduce}
      aria-label={t(asset.alt, lang)}
    >
      {/* El ORDEN importa: el navegador se queda con la PRIMERA fuente cuyo
          `media` case, así que la variante ligera va antes. Sin `media` en la
          segunda, cualquier pantalla mayor recibe el máster.

          `<source media>` se evalúa una sola vez al cargar, no al redimensionar:
          es lo correcto aquí —nadie cambia de teléfono a monitor a mitad de
          página— y evita recargar el vídeo en cada cambio de tamaño. */}
      {asset.srcMobile ? (
        <source src={asset.srcMobile} media="(max-width: 767px)" type="video/mp4" />
      ) : null}
      <source src={asset.src ?? undefined} type="video/mp4" />
    </video>
  );
}
