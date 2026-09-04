"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { t, type Locale } from "@/lib/i18n/config";
import { cookies as copy } from "@/content/copy/common";
import { href, routes } from "@/lib/i18n/routes";

/**
 * AVISO DE COOKIES
 * Ver docs/MASTER-PROJECT-DEFINITION.md §38.
 *
 * ── EL CONSENTIMIENTO ES PREVIO, NO POSTERIOR ────────────────────────────
 * Este componente NO es un cartel informativo: es el interruptor. Google Tag
 * Manager se monta desde AQUÍ y solo cuando hay un "sí" guardado. Un aviso que
 * aparece mientras la analítica ya está corriendo no informa de nada — cuenta
 * lo que acaba de pasar sin permiso.
 *
 * La Ley 1581 pide autorización **previa, expresa e informada**, y "previa" es
 * la palabra que decide dónde va este `<Script>`.
 *
 * ── LAS DOS SALIDAS PESAN LO MISMO ───────────────────────────────────────
 * "Rechazar" tiene el mismo tamaño, la misma área táctil y el mismo contraste
 * que "Aceptar". Un botón de rechazo en gris claro o escondido detrás de
 * "configurar" convierte la elección en un trámite, y entonces el
 * consentimiento deja de ser informado.
 *
 * ── ES UNA FRANJA, NO UNA TARJETA ────────────────────────────────────────
 * Ocupa el ancho completo abajo, la forma con la que cualquiera reconoce un
 * aviso de cookies sin leerlo. Antes era una tarjeta en la esquina derecha:
 * más discreta, pero indistinguible de las OTRAS DOS piezas que viven en esa
 * misma esquina —el flotante del QR y su versión en barra—, y confundir una
 * pregunta legal con una promoción es lo único que este aviso no puede hacer.
 *
 * El material también cambia: `bg-canvas/85 + backdrop-blur-xl` en lugar de
 * `.glass`, igual que el Header. No es una preferencia, son dos razones:
 *
 * · En el sistema, `.glass` con radio es el registro de los paneles que
 *   FLOTAN; una franja a sangre de borde a borde no flota, y el anillo de
 *   `.glass::before` le dibujaría una línea clara pegada a los bordes de la
 *   pantalla, que se lee como un fallo de render y no como un contorno.
 *
 * · Es MÁS opaco que el vidrio (85% de `canvas` frente al 68% de `surface-2`),
 *   y aquí eso importa más que la gracia visual: debajo del texto puede pasar
 *   cualquier cosa, y un texto legal ilegible no informa.
 *
 * ── NO ES UN DIÁLOGO MODAL ───────────────────────────────────────────────
 * No atrapa el foco ni bloquea el scroll: se puede leer el sitio y la política
 * antes de decidir, que es justo lo que hace que la decisión sea informada.
 * Sí es una `region` anunciada, y el foco entra en ella al aparecer para que
 * quien navega con teclado no tenga que buscarla.
 *
 * ── POR QUÉ NO HAY `<noscript>` ──────────────────────────────────────────
 * El contenedor traía un iframe de respaldo para navegadores sin JavaScript.
 * Se retiró: sin JavaScript tampoco hay forma de dar ni retirar el
 * consentimiento, así que ese iframe rastrearía a quien no puede decir que no.
 */

const CLAVE = "voltop:cookies";

/**
 * Contenedor de Google Tag Manager.
 *
 * Configurable con el valor de producción como defecto, por la misma razón que
 * `SITE_URL`: un despliegue de staging que dispare el contenedor de producción
 * ensucia la analítica real con tráfico de pruebas, y eso no se puede
 * deshacer una vez enviado.
 *
 * No es un secreto —un ID de contenedor viaja en el HTML de cualquier sitio
 * que lo use— así que va versionado. Ver `.env.example`.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WJ5S2LBF";
type Decision = "aceptado" | "rechazado" | null;

export function CookieConsent({ lang }: { lang: Locale }) {
  const [decision, setDecision] = useState<Decision>(null);
  /* `null` mientras no se ha leído el almacenamiento. Sin este tercer estado
     el aviso parpadearía en cada carga para quien ya decidió. */
  const [leido, setLeido] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const v = localStorage.getItem(CLAVE);
        if (v === "aceptado" || v === "rechazado") setDecision(v);
      } catch {
        /* Sin almacenamiento no se recuerda la decisión, pero tampoco se
           carga nada: el estado por defecto es "no". */
      }
      setLeido(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const decidir = (v: Exclude<Decision, null>) => {
    setDecision(v);
    try {
      localStorage.setItem(CLAVE, v);
    } catch {
      /* ídem */
    }
  };

  const visible = leido && decision === null;

  return (
    <>
      {decision === "aceptado" && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {visible && (
        <div
          role="region"
          aria-label={t(copy.title, lang)}
          /* `z-(--z-overlay)`: por encima del flotante de la app, que también
             vive abajo. La decisión va primero. */
          className="fixed inset-x-0 bottom-0 z-(--z-overlay) border-t border-line bg-canvas/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
        >
          {/* Mismo riel que el Header: contenedor `content` y el gutter del
              sistema. Una franja a sangre cuyo texto no arranca donde arranca
              el del sitio se delata como pieza pegada. */}
          <div className="mx-auto flex w-full max-w-(--container-content) flex-col gap-4 px-(--spacing-gutter) py-4 md:flex-row md:items-center md:justify-between md:gap-10 md:py-5">
            <div className="min-w-0">
              {/* `text-body` y no `display-s`: en una franja de una fila, un
                  titular de tamaño display la engorda y grita más que la
                  pregunta que hace. El peso lo da la negrita. */}
              <p className="font-display text-body font-semibold text-ink">{t(copy.title, lang)}</p>
              <p className="measure mt-1 text-body-s text-ink-2">{t(copy.body, lang)}</p>
            </div>

            <div className="flex flex-col gap-3 md:shrink-0 md:flex-row md:items-center md:gap-4">
              {/* Mismo tamaño, misma área, mismo contraste. Ver cabecera.
                  En móvil van a mitades EXACTAS, y por eso es una rejilla y no
                  un `flex-1`: con `flex-1` cada botón crece desde su propio
                  ancho de contenido y "Rechazar" se quedaba 2px más grande que
                  "Aceptar" —medido: 165 contra 163—. Dos columnas de `1fr` son
                  iguales por construcción, no por aproximación, y la igualdad
                  de las dos salidas es aquí un requisito, no una simetría
                  bonita. */}
              <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                <button
                  type="button"
                  onClick={() => decidir("aceptado")}
                  autoFocus
                  className="brand-gradient inline-flex h-11 items-center justify-center rounded-(--radius-pill) px-5 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105"
                >
                  {t(copy.accept, lang)}
                </button>
                <button
                  type="button"
                  onClick={() => decidir("rechazado")}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-(--radius-pill) border border-line-control px-5 text-body-s font-semibold text-ink transition-colors duration-(--duration-fast) hover:border-line-strong hover:bg-surface-2"
                >
                  {t(copy.reject, lang)}
                </button>
              </div>
              <Link
                href={href(lang, routes.privacy)}
                className="inline-flex min-h-11 items-center font-mono text-mono text-ink-3 transition-colors hover:text-brand"
              >
                {t(copy.policy, lang)}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
