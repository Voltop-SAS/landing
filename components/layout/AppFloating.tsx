"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { t, type Locale } from "@/lib/i18n/config";
import { home } from "@/content/copy/home";
import { a11y } from "@/content/copy/common";
import { externalLinks } from "@/content/data/links";
import { stripLocale, routes } from "@/lib/i18n/routes";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * COMPONENTE FLOTANTE · descarga de la app
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 (restar antes que sumar) y §23.
 *
 * Un elemento fijo compite con TODO el contenido durante todo el recorrido, así
 * que no basta con que se vea bien: tiene que justificar cada segundo que ocupa
 * la pantalla. Las reglas son restricciones, no adornos:
 *
 * 1. NO APARECE SOBRE EL HERO. Ahí ya hay un CTA grande a la vista.
 *
 * 2. SE APARTA CUANDO LA SECCIÓN DE DESCARGA ENTRA EN PANTALLA. Flotar
 *    "descarga la app" sobre la sección que ya lo ofrece, mejor y con más
 *    sitio, es ruido.
 *
 * 3. SE CIERRA Y NO VUELVE — DE VERDAD. Con estado en memoria volvía en cuanto
 *    recargabas, que es exactamente la trampa que la regla decía evitar. Ahora
 *    la decisión se guarda en `localStorage`, envuelta en `try/catch` porque en
 *    navegación privada o con las cookies bloqueadas el simple ACCESO lanza.
 *
 * 4. SE CALLA EN /empresas Y EN LOS LEGALES. En B2B la conversión es el
 *    formulario y §15 prohíbe que los CTA compitan; en un texto legal, tapar
 *    contenido durante una lectura larga estorba.
 *
 * ── DOS PIEZAS, NO UNA ENCOGIDA ──────────────────────────────────────────
 * En escritorio muestra un QR: las insignias de tienda son inútiles ahí porque
 * llevan a una ficha que no se puede instalar en el aparato que tienes
 * delante, y el código salta ese hueco.
 *
 * En móvil el QR es absurdo —un teléfono no se escanea a sí mismo— así que la
 * pieza es OTRA: una barra baja y compacta con la acción directa. Antes esta
 * versión no existía y el componente se ocultaba por debajo de `lg`, que es
 * tanto como decir que la mitad del tráfico no lo veía nunca.
 *
 * La barra respeta `env(safe-area-inset-bottom)`: sin eso, en un iPhone queda
 * bajo el indicador de inicio y el botón de cerrar se vuelve intocable.
 *
 * ── ACCESIBILIDAD ────────────────────────────────────────────────────────
 * No atrapa el foco ni bloquea el scroll: NO es un diálogo modal, es contenido
 * complementario. Sí responde a Escape, y mientras está oculto va `inert` para
 * que no queden enlaces alcanzables con Tab dentro de una tarjeta invisible.
 * Solo se animan `opacity` y `transform` (§29).
 */
const CLAVE_CERRADO = "voltop:app-flotante-cerrado";

export function AppFloating({ lang }: { lang: Locale }) {
  const c = home.appFloating;
  const [pasadoElHero, setPasadoElHero] = useState(false);
  const [cerrado, setCerrado] = useState(false);

  /* Se lee después de montar, nunca durante el render: en servidor no existe
     `localStorage`, y leerlo en el estado inicial rompería la hidratación. */
  useEffect(() => {
    /* Diferido a un fotograma: `setState` síncrono dentro de un efecto encadena
       renders y React lo señala. Aquí además no urge — la tarjeta no aparece
       hasta pasado el Hero, así que nadie ve el fotograma intermedio. */
    const id = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem(CLAVE_CERRADO) === "1") setCerrado(true);
      } catch {
        /* Sin almacenamiento el componente funciona igual; solo olvida. */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const descartar = () => {
    setCerrado(true);
    try {
      localStorage.setItem(CLAVE_CERRADO, "1");
    } catch {
      /* ídem */
    }
  };
  const [seccionALaVista, setSeccionALaVista] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Regla 1 — el objetivo es que no coincidan en pantalla, no clavar un píxel. */
  useEffect(() => {
    const onScroll = () => setPasadoElHero(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Regla 2 */
  useEffect(() => {
    const objetivo = document.getElementById("app-title");
    if (!objetivo) return;
    const io = new IntersectionObserver(([e]) => setSeccionALaVista(e.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
    });
    io.observe(objetivo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.contains(document.activeElement)) descartar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const ruta = stripLocale(usePathname()) || "/";
  const rutaLoPermite = !ruta.startsWith(routes.empresas) && !ruta.startsWith("/legal");
  const mostrar = pasadoElHero && !cerrado && !seccionALaVista && rutaLoPermite;

  const transicion =
    "transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none";

  const cerrar = (
    <button
      type="button"
      onClick={descartar}
      aria-label={t(c.dismiss, lang)}
      className="grid size-11 shrink-0 place-items-center rounded-(--radius-pill) text-ink-3 transition-colors duration-(--duration-fast) hover:bg-white/10 hover:text-ink"
    >
      <span aria-hidden="true" className="relative block size-3.5">
        <span className="absolute top-1/2 h-px w-3.5 rotate-45 bg-current" />
        <span className="absolute top-1/2 h-px w-3.5 -rotate-45 bg-current" />
      </span>
    </button>
  );

  return (
    <div ref={ref} aria-hidden={!mostrar} inert={!mostrar}>
      {/* ESCRITORIO — tarjeta con QR */}
      <div
        className={cn(
          "glass fixed bottom-6 right-6 z-(--z-header) hidden w-[17rem] rounded-(--radius-structural) p-5 lg:block",
          transicion,
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        {/* El cerrar va POSICIONADO, no en flujo: compartiendo fila con el
            título le robaba 44px y "Descarga la app" partía en dos líneas. */}
        <div className="absolute right-2 top-2">{cerrar}</div>
        <p className="pr-10 font-display text-display-s font-semibold text-ink">{t(c.title, lang)}</p>
        <p className="mt-1.5 text-body-s text-ink-2">{t(c.body, lang)}</p>

        <a
          href={externalLinks.app}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("app_store_click", { tienda: "dinamico", ubicacion: "flotante_escritorio" })}
          /* El código se queda SOBRE BLANCO aunque el marco sea de vidrio: un
             lector espera módulos oscuros sobre fondo claro, y teñirlo para que
             "combine" hace fallar a muchos teléfonos. El vidrio es el marco; el
             código es un instrumento y no se decora. */
          className="mx-auto mt-4 block w-fit rounded-[1.125rem] bg-white p-3 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.7)] transition-transform duration-(--duration-fast) ease-(--ease-overshoot) hover:scale-[1.03] motion-reduce:hover:scale-100"
        >
          <Image
            src="/qr-descargar-app.svg"
            alt=""
            aria-hidden="true"
            width={112}
            height={112}
            unoptimized
            className="block size-28"
          />
          <span className="sr-only">
            {t(home.app.qrLabel, lang)} · {t(a11y.opensInNewTab, lang)}
          </span>
        </a>
      </div>

      {/* MÓVIL — barra baja con la acción directa */}
      <div
        className={cn(
          "glass fixed inset-x-3 bottom-3 z-(--z-header) rounded-(--radius-structural) lg:hidden",
          "pb-[env(safe-area-inset-bottom)]",
          transicion,
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 p-3 pl-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-body font-semibold text-ink">{t(c.title, lang)}</p>
            <p className="truncate text-caption text-ink-2">{t(c.bodyMobile, lang)}</p>
          </div>
          <a
            href={externalLinks.app}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("app_store_click", { tienda: "dinamico", ubicacion: "flotante_movil" })}
            className="brand-gradient inline-flex h-11 shrink-0 items-center rounded-(--radius-pill) px-4 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105"
          >
            {t(c.open, lang)}
            <span className="sr-only"> · {t(a11y.opensInNewTab, lang)}</span>
          </a>
          {cerrar}
        </div>
      </div>
    </div>
  );
}
