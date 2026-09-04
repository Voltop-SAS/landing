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
 * 1. APARECE AL PASAR LA PRIMERA SECCIÓN Y SE QUEDA. Se observa la primera
 *    sección de la página: mientras esté a la vista, el flotante no existe
 *    —ahí ya hay un CTA grande—; en cuanto sale, aparece y NO vuelve a
 *    esconderse hasta que se regresa a ella.
 *
 *    Antes el umbral era "el 90% de la altura del viewport", que es una
 *    aproximación a la primera sección y no la primera sección: en una página
 *    cuya cabecera mide menos que la pantalla aparecía tarde, y en una que
 *    mide más, temprano. Observar el elemento real funciona igual en las seis
 *    plantillas del sitio sin un número por página.
 *
 *    Y antes DESAPARECÍA en tres zonas del recorrido (`#infraestructura`,
 *    `#vision`, la sección de descarga). Eso se retiró por decisión de
 *    producto: un elemento que se va y vuelve tres veces mientras bajas se
 *    percibe como un fallo, no como delicadeza. Las dos colisiones REALES que
 *    esas zonas tapaban se resolvieron donde tocaba —ver las reglas 2 y 3—, en
 *    lugar de ocultando el componente.
 *
 * 2. NO ROBA LOS CONTROLES DE LA PELÍCULA. La tarjeta de escritorio se solapa
 *    con la barra de reproducción del beat 7, y un clic en silenciar o en
 *    pantalla completa ABRÍA LA TIENDA DE APPS. Un flotante que secuestra un
 *    control ajeno no es intrusivo: es un fallo.
 *    Lo resuelve `FilmStage`, que se eleva por encima de este componente
 *    mientras el puntero está sobre la pieza o mientras se reproduce. Así los
 *    dos coexisten: la película gana cuando la estás usando, y el flotante
 *    sigue visible el resto del tiempo.
 *
 * 3. NO TAPA EL CTA DEL BEAT 2. Ese beat ancla su contenido al fondo de un
 *    panel FIJADO a pantalla completa, así que la barra móvil le caía encima y
 *    no había ninguna posición de scroll que lo liberara. Lo resuelve el propio
 *    beat reservando el hueco de la barra por debajo de `lg`.
 *
 * 4. SE CIERRA HASTA LA SIGUIENTE CARGA, NO PARA SIEMPRE. La X lo retira del
 *    resto de la visita, pero la decisión NO se guarda: al recargar vuelve.
 *    A favor: la descarga de la app es el objetivo de la Home, y una sola X
 *    —a menudo un gesto reflejo— no debería apagarla el resto de la vida del
 *    navegador. En contra: a quien lo cerró a propósito se le vuelve a
 *    ofrecer. Lo compensa que el cierre dura toda la lectura: el componente
 *    vive en el layout, que la navegación interna no remonta.
 *
 * 5. ESPERA A QUE SE DECIDA LO DE LAS COOKIES. Los dos son elementos fijos
 *    abajo, así que se taparían. Y el orden no es negociable: primero se
 *    responde una pregunta legal, después se ofrece una descarga.
 *
 * 6. SE CALLA EN /empresas Y EN LOS LEGALES. En B2B la conversión es el
 *    formulario y §15 prohíbe que los CTA compitan; en un texto legal, tapar
 *    contenido durante una lectura larga estorba.
 *
 * ── DOS PIEZAS, NO UNA ENCOGIDA ──────────────────────────────────────────
 * En escritorio muestra un QR: las insignias de tienda son inútiles ahí porque
 * llevan a una ficha que no se puede instalar en el aparato que tienes
 * delante, y el código salta ese hueco.
 *
 * En móvil el QR es absurdo —un teléfono no se escanea a sí mismo— así que la
 * pieza es OTRA: una barra baja y compacta con la acción directa.
 *
 * ── EL ICONO DE LA APP ───────────────────────────────────────────────────
 * Se integra en las dos piezas porque responde una pregunta que el texto no
 * puede: *cuál* app. Quien ve un QR flotante no sabe qué le van a instalar
 * hasta que lo escanea; con el icono lo reconoce antes de sacar el teléfono.
 *
 * Va en la fila superior, ocupando el lado que el botón de cerrar dejaba
 * vacío: no añade una fila ni empuja nada. Y NO compite con el CTA porque no
 * es interactivo —es identidad, no acción— y porque el gradiente que lleva es
 * el del propio archivo de marca, no un segundo gradiente añadido a la vista
 * (§12: una acción con gradiente por vista, y aquí sigue siendo el botón).
 *
 * En móvil va a la izquierda del texto, que es el orden en que se lee: qué es
 * → qué hace → qué hago. El icono queda fuera del área táctil del botón para
 * que nadie lo pulse buscando abrir la app.
 *
 * ── VIDRIO MÁS OPACO QUE EL DEL SISTEMA ──────────────────────────────────
 * Usa `.glass-strong` y no `.glass`. Medido sobre el píxel compuesto a
 * percentil 99, el contraste del texto secundario ya cumplía AA con holgura
 * —7.79:1 en escritorio, 8.45:1 en móvil— así que el problema no era el
 * contraste: era que el TEXTO DE DETRÁS seguía siendo legible a través del
 * panel, y dos textos legibles en el mismo sitio compiten aunque los dos
 * tengan contraste. Ver la nota de `.glass-strong` en globals.css.
 *
 * ── ACCESIBILIDAD ────────────────────────────────────────────────────────
 * No atrapa el foco ni bloquea el scroll: NO es un diálogo modal, es contenido
 * complementario. Sí responde a Escape, y mientras está oculto va `inert` para
 * que no queden enlaces alcanzables con Tab dentro de una tarjeta invisible.
 * Solo se animan `opacity` y `transform` (§29).
 */

/** La misma clave que usa `CookieConsent`. Ver la regla 5. */
const CLAVE_COOKIES = "voltop:cookies";

export function AppFloating({ lang }: { lang: Locale }) {
  const c = home.appFloating;
  /* Estado en memoria y nada más: es lo que hace que vuelva al recargar.
     Ver la regla 4 — no es un olvido, es la regla. */
  const [cerrado, setCerrado] = useState(false);
  /* `true` de partida: al cargar, la primera sección está a la vista. */
  const [primeraALaVista, setPrimeraALaVista] = useState(true);
  /* `false` de partida: mientras no se sepa, el flotante no aparece. */
  const [cookiesDecididas, setCookiesDecididas] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const descartar = () => setCerrado(true);

  const ruta = stripLocale(usePathname()) || "/";

  /* Regla 1 — se observa la PRIMERA SECCIÓN, no una fracción del viewport.
     Se vuelve a observar al cambiar de ruta: el componente vive en el layout y
     la navegación de cliente no lo remonta, así que sin la dependencia
     seguiría vigilando la sección de la página anterior, ya desmontada. */
  useEffect(() => {
    const primera = document.querySelector("main section");
    if (!primera) {
      /* Sin sección de referencia no hay nada que esperar: se muestra.
         Diferido a un fotograma porque un `setState` síncrono dentro de un
         efecto encadena renders y React lo señala. Aquí no urge: es la rama
         que no ocurre en ninguna de las plantillas del sitio. */
      const id = requestAnimationFrame(() => setPrimeraALaVista(false));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(([entrada]) => setPrimeraALaVista(entrada.isIntersecting), {
      threshold: 0,
    });
    io.observe(primera);
    return () => io.disconnect();
  }, [ruta]);

  /* Regla 5 — se consulta al montar y se vuelve a consultar, porque la
     decisión puede tomarse con esta misma página abierta y `localStorage` no
     emite eventos dentro de la propia pestaña. */
  useEffect(() => {
    const leer = () => {
      try {
        setCookiesDecididas(localStorage.getItem(CLAVE_COOKIES) !== null);
      } catch {
        /* Sin almacenamiento no hay aviso que esperar. */
        setCookiesDecididas(true);
      }
    };
    const id = requestAnimationFrame(leer);
    const intervalo = window.setInterval(leer, 1000);
    return () => {
      cancelAnimationFrame(id);
      window.clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.contains(document.activeElement)) descartar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const rutaLoPermite = !ruta.startsWith(routes.empresas) && !ruta.startsWith("/legal");
  const mostrar = !primeraALaVista && !cerrado && rutaLoPermite && cookiesDecididas;

  const transicion =
    "transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none";

  /**
   * Icono de la app. `aria-hidden` y `alt` vacío: no aporta información que el
   * título no diga ya —"Descarga la app Voltop"— y anunciarlo dos veces solo
   * alarga el recorrido de un lector de pantalla.
   *
   * `rounded-[22.37%]` es la proporción del squircle del propio archivo, no un
   * radio del sistema: el PNG ya trae sus esquinas redondeadas y transparentes,
   * y el borde de vidrio se recorta para acompañarlas sin doblarlas.
   */
  const icono = (tamano: string) => (
    <span
      aria-hidden="true"
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[22.37%] ring-1 ring-white/10",
        tamano,
      )}
    >
      <Image src="/logo-app.png" alt="" fill sizes="56px" className="object-cover" />
    </span>
  );

  const cerrar = (
    <button
      type="button"
      onClick={descartar}
      aria-label={t(c.dismiss, lang)}
      className="press grid size-11 shrink-0 place-items-center rounded-(--radius-pill) text-ink-3 transition-colors duration-(--duration-fast) hover:bg-white/10 hover:text-ink"
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
          "glass glass-strong fixed bottom-6 right-6 z-(--z-header) hidden w-[17.5rem] rounded-(--radius-structural) p-5 lg:block",
          transicion,
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        {/* Fila superior: el icono ocupa el lado que el botón de cerrar dejaba
            vacío, así que la identidad no cuesta ni una fila ni un píxel de
            alto. El cerrar se compensa con `-mr-2 -mt-1` para que su área
            táctil de 44px no abra un hueco visible en la esquina. */}
        <div className="flex items-start justify-between gap-3">
          {icono("size-12")}
          <div className="-mr-2 -mt-1">{cerrar}</div>
        </div>

        <p className="mt-4 font-display text-display-s font-semibold text-balance text-ink">
          {t(c.title, lang)}
        </p>
        <p className="measure mt-2 text-body-s text-ink-2">{t(c.body, lang)}</p>

        <a
          href={externalLinks.app}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("app_store_click", { tienda: "dinamico", ubicacion: "flotante_escritorio" })}
          /* El código se queda SOBRE BLANCO aunque el marco sea de vidrio: un
             lector espera módulos oscuros sobre fondo claro, y teñirlo para que
             "combine" hace fallar a muchos teléfonos. El vidrio es el marco; el
             código es un instrumento y no se decora. */
          className="press mx-auto mt-5 block w-fit rounded-[1.125rem] bg-white p-3 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.7)]"
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
          "glass glass-strong fixed inset-x-3 bottom-3 z-(--z-header) rounded-(--radius-structural) lg:hidden",
          "pb-[env(safe-area-inset-bottom)]",
          transicion,
          mostrar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        {/* El icono va PRIMERO: qué es → qué hace → qué hago. Y queda fuera del
            área táctil del botón, para que nadie lo pulse buscando abrir.

            ── DOS FILAS POR DEBAJO DE 480px ─────────────────────────────────
            En una sola fila compiten icono, dos líneas de texto, botón y
            cerrar. Medido: a 390px al texto le quedan 158px y la segunda línea
            necesita 227; a 320px le quedan 88 y hasta el título se corta. No
            es un problema de copy —acortarlo hasta caber en 88px lo dejaría
            sin mensaje— sino de estructura.

            Por debajo de `xs` el botón se lleva su propia fila a ancho
            completo: el texto pasa a disponer de ~246px, cabe entero, y el CTA
            gana un objetivo táctil mucho mayor, que en un teléfono es mejor y
            no peor. La barra pasa de 70 a ~118px de alto, y ese es el precio
            aceptado a cambio de que el mensaje se lea.

            Un solo `<a>` para las dos disposiciones, no dos ocultándose: se
            reordena con `order` y envuelve con `flex-wrap`. Duplicar el enlace
            duplicaría también el emisor del evento de medición. */}
        <div className="flex flex-wrap items-center gap-3 p-3">
          {icono("size-10")}
          <div className="order-1 min-w-0 flex-1">
            <p className="truncate font-display text-body font-semibold text-ink">
              {t(c.titleMobile, lang)}
            </p>
            {/* `line-clamp-2` y no `truncate`: a 320px al texto le quedan
                164px y esta línea necesita 227, así que cortarla dejaría
                "Encuentra estaciones e ini…". Envolver a dos líneas conserva
                el mensaje entero y solo cuesta alto en el ancho más estrecho
                —de 390px arriba sigue siendo una línea—. El tope de dos evita
                que un idioma más largo estire la barra sin control. */}
            <p className="line-clamp-2 text-caption text-ink-2">{t(c.bodyMobile, lang)}</p>
          </div>
          <div className="order-2 xs:order-3">{cerrar}</div>
          <a
            href={externalLinks.app}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("app_store_click", { tienda: "dinamico", ubicacion: "flotante_movil" })}
            className="brand-gradient press order-3 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-(--radius-pill) px-4 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105 xs:order-2 xs:w-auto"
          >
            {t(c.open, lang)}
            <span className="sr-only"> · {t(a11y.opensInNewTab, lang)}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
