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
})(window,document,'script','dataLayer','GTM-WJ5S2LBF');`}
        </Script>
      )}

      {visible && (
        <div
          role="region"
          aria-label={t(copy.title, lang)}
          /* `z-(--z-overlay)`: por encima del flotante de la app, que también
             vive abajo. La decisión va primero. */
          className="glass fixed inset-x-3 bottom-3 z-(--z-overlay) rounded-(--radius-structural) p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:inset-x-auto md:right-6 md:max-w-md"
        >
          <p className="font-display text-display-s font-semibold text-ink">{t(copy.title, lang)}</p>
          <p className="measure-narrow mt-2 text-body-s text-ink-2">{t(copy.body, lang)}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Mismo tamaño, misma área, mismo contraste. Ver cabecera. */}
            <button
              type="button"
              onClick={() => decidir("aceptado")}
              autoFocus
              className="brand-gradient inline-flex h-11 items-center rounded-(--radius-pill) px-5 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105"
            >
              {t(copy.accept, lang)}
            </button>
            <button
              type="button"
              onClick={() => decidir("rechazado")}
              className="inline-flex h-11 items-center rounded-(--radius-pill) border border-line-control px-5 text-body-s font-semibold text-ink transition-colors duration-(--duration-fast) hover:border-line-strong hover:bg-surface-2"
            >
              {t(copy.reject, lang)}
            </button>
            <Link
              href={href(lang, routes.privacy)}
              className="inline-flex min-h-11 items-center font-mono text-mono text-ink-3 transition-colors hover:text-brand"
            >
              {t(copy.policy, lang)}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
