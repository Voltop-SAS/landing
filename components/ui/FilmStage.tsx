"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease, useScrolledPast } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * SIGNATURE · la película.
 *
 * Es el segundo —y último— momento signature de la Home. Combina dos
 * primitivas del sistema y ninguna más:
 *
 * · FRAME al entrar. El encuadre está cerrado a los lados y se abre. No es un
 *   adorno de llegada: el gesto dice "esto es una pieza", y separa la película
 *   de las cuatro imágenes de fondo que la preceden en la página.
 *
 * · EXPANSIÓN al reproducir. Cuando alguien le da al play, la página se
 *   atenúa y la pieza crece. Es el único sitio del sitio donde una expansión
 *   es FUNCIONAL además de expresiva: se ve mejor. Un efecto que además
 *   resuelve algo es la diferencia entre craft y decoración.
 *
 * ── NO ES UN MODAL ────────────────────────────────────────────────────────
 * No atrapa el foco, no bloquea el scroll y no hay nada que cerrar: la pieza
 * sigue en el flujo de la página y el atenuado se retira solo al pausar o al
 * terminar. Convertirlo en un diálogo obligaría a gestionar foco, Escape y
 * scroll para un vídeo que ya se puede pausar con sus propios controles.
 *
 * ── POR QUÉ EL ATENUADO ES HERMANO Y NO HIJO ──────────────────────────────
 * Un `position: fixed` dentro de un elemento con `transform` deja de medirse
 * contra el viewport y pasa a medirse contra ese elemento: Motion transforma
 * el envoltorio de la pieza en cada fotograma, así que el atenuado dentro de
 * él se habría quedado encajado en su caja en vez de cubrir la pantalla. Por
 * eso son hermanos, y por eso este componente no puede ir dentro de `Reveal`.
 *
 * ── MÓVIL ─────────────────────────────────────────────────────────────────
 * La expansión se apaga: a 390px la pieza ya ocupa todo el ancho, así que
 * crecerla solo la recortaría contra los bordes. Se conservan el atenuado
 * —que es lo que hace el trabajo de "ahora mira esto"— y el encuadre, con
 * menos recorrido.
 */
export function FilmStage({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  /* Misma red que en `Reveal`: recargar por debajo de la película la dejaba
     recortada por los lados y a opacidad 0 para siempre. */
  const yaPasado = useScrolledPast(ref);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const leer = () => setCompacto(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  /* Los eventos de media NO burbujean, así que se escuchan en fase de captura.
     Es la única forma de enterarse del play sin acoplar este componente al
     elemento `<video>` que vive dos capas más abajo, dentro de `Media`. */
  const escuchas = {
    onPlayCapture: () => setReproduciendo(true),
    onPauseCapture: () => setReproduciendo(false),
    onEndedCapture: () => setReproduciendo(false),
  };

  const recorte = compacto ? 6 : 14;

  return (
    <>
      {/* Atenuado del resto de la página. `pointer-events-none`: no intercepta
          nada, así que se puede seguir usando el sitio con el vídeo puesto. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-(--z-header) bg-canvas transition-opacity duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none",
          reproduciendo ? "opacity-[0.82]" : "opacity-0",
        )}
      />

      <motion.div
        {...escuchas}
        ref={ref}
        data-reveal=""
        className={cn("relative", reproduciendo && "z-(--z-overlay)")}
        {...(yaPasado
          ? {}
          : {
              initial: { opacity: 0, clipPath: `inset(0% ${recorte}% 0% ${recorte}%)` },
              whileInView: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
              viewport: { once: true, margin: "-120px" },
              transition: { duration: reduce ? 0 : 0.9, ease: ease.standard },
            })}
      >
        {/* Capa aparte para la expansión: `animate` y `whileInView` no pueden
            convivir en el mismo elemento sin pisarse. */}
        <motion.div
          animate={{ scale: reproduciendo && !compacto && !reduce ? 1.045 : 1 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.standard }}
          className="origin-center"
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}
