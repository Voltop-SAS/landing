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
}: {
  asset: MediaAsset;
  lang: Locale;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  /* `autoPlay` no basta: si la preferencia cambia en caliente, o si el
     navegador arrancó la reproducción antes de hidratar, hay que detenerlo. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduce) v.pause();
    else void v.play().catch(() => {});
  }, [reduce]);

  return (
    <video
      ref={ref}
      className={className}
      poster={asset.poster ?? undefined}
      preload="none"
      muted
      loop
      playsInline
      autoPlay={!reduce}
      aria-label={t(asset.alt, lang)}
    >
      <source src={asset.src ?? undefined} type="video/mp4" />
    </video>
  );
}
