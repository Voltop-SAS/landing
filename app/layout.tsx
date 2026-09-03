import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { defaultLocale, localeMeta, t } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/i18n/routes";
import { brand } from "@/content/copy/common";

/**
 * LAYOUT RAÍZ · emite el documento
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 * Antes el documento lo emitía `app/[lang]/layout.tsx` y no había layout raíz.
 * Es un patrón que Next admite, pero rompe la resolución de los boundaries de
 * `not-found`: CUALQUIER `notFound()` lanzado dentro de `[lang]` —una estación
 * inexistente, una ciudad inexistente, un idioma inválido— servía el documento
 * de error interno de Next (`<html id="__next_error__">`, sin `lang`, sin
 * estilos, sin marca) y solo se recuperaba en cliente tras la hidratación.
 * `app/[lang]/not-found.tsx` no se renderizaba nunca. Un crawler veía vacío.
 *
 * ── EL COMPROMISO, EXPLÍCITO ──────────────────────────────────────────────
 * Un layout raíz no recibe `params`, así que `<html lang>` aquí no puede ser
 * dinámico y queda fijo en el idioma por defecto. §28 (decisión confirmada
 * nº14) pedía el `lang` correcto en el HTML SERVIDO, y esto lo relaja.
 *
 * Se compensa donde importa: `[lang]/layout.tsx` marca el idioma real en un
 * `<div lang>` que envuelve todo el contenido. Los lectores de pantalla honran
 * el `lang` más cercano al nodo, así que la pronunciación sigue siendo
 * correcta, y para buscadores el idioma lo declaran los `hreflang` y las
 * `alternates` de cada ruta, que ya estaban bien.
 *
 * La alternativa sin compromiso —dos raíces reales, `(es)/` y `(en)/`— exigía
 * duplicar el árbol de rutas completo y habría matado la escalabilidad de
 * "añadir un idioma = añadir una entrada".
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Las tipografías se cargan aquí y no en `[lang]`: las variables tienen que
 * existir en `<html>` también para las páginas que viven fuera del segmento de
 * idioma, como el 404 de raíz.
 * TIPOGRAFÍAS DE MARCA (entregadas 2026-09-02). Ya no hay marcadores de
 * posición: Space Grotesk e Inter salieron del proyecto.
 * - Poppins → titulares. La familia del logotipo.
 * - Manrope → interfaz y texto corrido. Variable.
 * - JetBrains Mono → registro de ficha técnica (etiquetas, cifras,
 *   metadatos). No la define la marca; se conserva porque el sistema usa un
 *   tercer registro monoespaciado que ninguna de las dos anteriores cubre.
 */

/**
 * POPPINS · titulares.
 *
 * Es la familia del logotipo, así que los titulares y la marca hablan con la
 * misma voz. Poppins NO es variable en Google Fonts: cada peso es un archivo,
 * y por eso se piden SOLO los dos que el sitio usa —500 y 600, contados en el
 * código— más el 900. Sin declararlos, el navegador sintetiza el semibold
 * engordando el trazo, y en un titular de 80px eso se ve sucio.
 *
 * El 900 se carga porque es el peso del archivo de marca (`Poppins-Black`) y
 * está disponible para titulares más rotundos. Hoy no lo usa ningún
 * componente: decisión pendiente.
 */
const display = Poppins({
  variable: "--font-display-raw",
  subsets: ["latin"],
  weight: ["500", "600", "900"],
  display: "swap",
});
/**
 * MANROPE · interfaz y texto corrido.
 *
 * Es VARIABLE, así que un solo archivo cubre todo el rango de pesos: pesa
 * menos que los tres archivos sueltos que haría falta cargar con una familia
 * estática, y permite cualquier peso intermedio sin pedir nada más.
 *
 * Se carga desde Google Fonts y no desde el `.ttf` del sistema: `next/font`
 * la sirve desde nuestro propio dominio, ya subconjuntada a latino y en woff2
 * —una fracción del peso del TrueType— y sin la petición a un tercero.
 */
const sans = Manrope({
  variable: "--font-sans-raw",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({ variable: "--font-mono-raw", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${brand.name} — ${t(brand.tagline, defaultLocale)}`,
  description: t(brand.tagline, defaultLocale),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={localeMeta[defaultLocale].htmlLang}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        {/* GOOGLE TAG MANAGER · GTM-WJ5S2LBF
            
            `afterInteractive` y no `beforeInteractive`: la medición no puede
            competir con el primer pintado. El contenedor carga en cuanto la
            página responde, que para analítica es de sobra y deja el LCP
            intacto.
            
            NO hace falta cablear nada más: `lib/analytics` ya empuja todos los
            eventos del plan a `window.dataLayer`, que es exactamente de donde
            GTM lee. Los 17 eventos definidos en §31 —descargas de app, vistas
            de estación, embudo B2B— empiezan a llegar solos.
            
            El `<noscript>` va al principio del body porque es su sitio: si no
            hay JavaScript, el iframe es la única vía de registro. */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJ5S2LBF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            /* Sin título, un lector de pantalla anuncia "marco" y no puede
               decir de qué. Aunque esté oculto, el elemento existe. */
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WJ5S2LBF');`}
        </Script>
      </body>
    </html>
  );
}
