import type { Metadata } from "next";
import { Space_Grotesk, Poppins, JetBrains_Mono } from "next/font/google";
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
 * ESTADO DE LAS TIPOGRAFÍAS (2026-09-02):
 * - Poppins: ENTREGADA e integrada. Es la de interfaz.
 * - Marope: entregada como decisión pero NO está en Google Fonts ni en ningún
 *   repositorio abierto. Hace falta el archivo con licencia. Mientras tanto,
 *   los titulares siguen en Space Grotesk como marcador de posición.
 * - JetBrains Mono: no la define la marca. Se conserva para el registro de
 *   ficha técnica (etiquetas, cifras, metadatos).
 */

const display = Space_Grotesk({ variable: "--font-display-raw", subsets: ["latin"], display: "swap" });
/**
 * POPPINS · tipografía de interfaz de Voltop (entregada 2026-09-02).
 * Sustituye a Inter, que era el marcador de posición.
 *
 * Los pesos se declaran explícitamente porque Poppins NO es variable en
 * Google Fonts: sin esta lista, `next/font` descarga solo el regular y todo
 * lo semibold se sintetiza —el navegador "engorda" el trazo— con un
 * resultado sucio en titulares grandes.
 */
const sans = Poppins({
  variable: "--font-sans-raw",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className="min-h-dvh bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
