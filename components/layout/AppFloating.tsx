"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { t, type Locale } from "@/lib/i18n/config";
import { home } from "@/content/copy/home";
import { a11y } from "@/content/copy/common";
import { externalLinks } from "@/content/data/links";
import { stripLocale, routes } from "@/lib/i18n/routes";
import { cn } from "@/lib/cn";

/**
 * COMPONENTE FLOTANTE · descarga de la app
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 (restar antes que sumar) y §23.
 *
 * Un elemento fijo compite con TODO el contenido durante todo el recorrido, así
 * que aquí no basta con que se vea bien: tiene que justificar cada segundo que
 * ocupa la pantalla. Cuatro reglas, y las cuatro son restricciones:
 *
 * 1. NO APARECE EN EL HERO. Mientras el Hero está en pantalla hay un CTA
 *    grande a la vista; encima aparecería un segundo. Espera a que se haya
 *    ido.
 *
 * 2. SE APARTA CUANDO LA SECCIÓN DE DESCARGA ENTRA EN PANTALLA. Ofrecer
 *    "descarga la app" flotando sobre la sección que ya lo ofrece es ruido.
 *    Un `IntersectionObserver` sobre `#app-title` lo esconde.
 *
 * 3. SE CIERRA Y NO VUELVE. Si alguien lo descarta, se acabó para esa sesión.
 *    Un flotante que reaparece tras cerrarlo es una trampa, no un componente.
 *
 * 4bis. SE CALLA EN /empresas Y EN LOS LEGALES. En B2B la conversión es el
 *    formulario, y un flotante de descarga de app compitiendo con él va contra
 *    §15 ("los CTA no compiten"). En un texto legal, cualquier cosa que tape
 *    contenido durante una lectura larga estorba.
 *
 * 4. SOLO EN ESCRITORIO. En un teléfono el QR es absurdo —no se escanea a sí
 *    mismo— y el espacio fijo es mucho más caro. Ahí la descarga vive en el
 *    CTA del header y en la sección.
 *
 * Accesibilidad: al abrirse NO atrapa el foco ni bloquea el scroll, porque no
 * es un diálogo modal — es contenido complementario. Sí responde a Escape, y
 * el botón de cierre declara su nombre. La aparición anima `opacity` y
 * `transform`, las dos únicas propiedades que §29 permite animar.
 */
export function AppFloating({ lang }: { lang: Locale }) {
  const c = home.appFloating;
  const [visible, setVisible] = useState(false);
  const [cerrado, setCerrado] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Regla 1 — aparece cuando el Hero ya no está. 90dvh es alto de Hero menos
     un margen: el objetivo es que no coincidan en pantalla, no clavar un
     píxel. */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Regla 2 — se aparta ante la sección que hace lo mismo, mejor. */
  const [seccionALaVista, setSeccionALaVista] = useState(false);
  useEffect(() => {
    const objetivo = document.getElementById("app-title");
    if (!objetivo) return;
    const io = new IntersectionObserver(
      ([e]) => setSeccionALaVista(e.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(objetivo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.contains(document.activeElement)) setCerrado(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const ruta = stripLocale(usePathname()) || "/";
  const rutaLoPermite = !ruta.startsWith(routes.empresas) && !ruta.startsWith("/legal");

  const mostrar = visible && !cerrado && !seccionALaVista && rutaLoPermite;

  return (
    <div
      ref={ref}
      /* `hidden lg:block` — regla 4. `aria-hidden` cuando está oculto para que
         no quede un enlace alcanzable con Tab en una tarjeta invisible. */
      aria-hidden={!mostrar}
      inert={!mostrar}
      className={cn(
        "fixed bottom-6 right-6 z-(--z-header) hidden w-[17.5rem] lg:block",
        "rounded-(--radius-structural) border border-line-control bg-surface-2/95 p-5 backdrop-blur-xl",
        "transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none",
        mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => setCerrado(true)}
        aria-label={t(c.dismiss, lang)}
        className="absolute right-2 top-2 grid size-9 place-items-center rounded-(--radius-structural) text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink"
      >
        <span aria-hidden="true" className="relative block size-3">
          <span className="absolute top-1/2 h-px w-3 rotate-45 bg-current" />
          <span className="absolute top-1/2 h-px w-3 -rotate-45 bg-current" />
        </span>
      </button>

      <p className="pr-8 font-display text-display-s font-semibold text-ink">{t(c.title, lang)}</p>
      <p className="mt-2 text-body-s text-ink-2">{t(c.body, lang)}</p>

      <a
        href={externalLinks.app}
        target="_blank"
        rel="noopener noreferrer"
        /* `w-fit` y centrado: con `flex` a ancho completo la tarjeta blanca
           se estiraba y dejaba medio panel en blanco a la derecha del código,
           porque el texto que la acompaña es `sr-only` y no ocupa nada. */
        className="mx-auto mt-4 block w-fit rounded-(--radius-structural) bg-white p-3 transition-transform duration-(--duration-fast) hover:scale-[1.02] motion-reduce:hover:scale-100"
      >
        <Image
          src="/qr-descargar-app.svg"
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          unoptimized
          className="block size-28"
        />
        <span className="sr-only">
          {t(home.app.qrLabel, lang)} · {t(a11y.opensInNewTab, lang)}
        </span>
      </a>
    </div>
  );
}
