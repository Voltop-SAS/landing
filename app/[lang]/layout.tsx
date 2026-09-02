import type { Metadata } from "next";

import { locales, isLocale, isPublished, localeMeta, defaultLocale, t, type Locale } from "@/lib/i18n/config";
import { absoluteUrl, alternatesFor, routes } from "@/lib/i18n/routes";
import { a11y, brand } from "@/content/copy/common";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { AppFloating } from "@/components/layout/AppFloating";

/**
 * LAYOUT POR IDIOMA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * El idioma sigue viviendo en la URL: ambas versiones son estáticas e
 * indexables y el `hreflang` de cada ruta es correcto.
 *
 * YA NO EMITE EL DOCUMENTO. `<html>` y `<body>` los emite `app/layout.tsx`,
 * porque sin layout raíz Next no resolvía los boundaries de `not-found` y
 * `[lang]/not-found.tsx` no se renderizaba nunca (ver el comentario largo de
 * `app/layout.tsx`). El precio es que `<html lang>` queda fijo en el idioma por
 * defecto, y se compensa aquí: el `<div lang>` marca el idioma REAL de todo el
 * contenido, que es el nodo que consultan los lectores de pantalla.
 *
 * TAMPOCO RECHAZA EL IDIOMA. Antes llamaba a `notFound()` y eso lanzaba antes
 * de que existiera el documento. El rechazo lo hace la PÁGINA —todas conservan
 * su guarda `isLocale`—, así que el 404 aterriza dentro de este layout, con
 * header, footer y navegación de salida. La metadata de abajo marca `noindex`
 * para un idioma inválido.
 */

/**
 * PARAMS CERRADOS. `notFound()` lanzado desde una página no resuelve ningún
 * boundary en Next 16 con este árbol de rutas: sirve un documento de error con
 * el body VACÍO y el 404 con marca solo aparece tras hidratar, así que un
 * crawler ve una página en blanco.
 *
 * Con `dynamicParams = false` el rechazo lo hace el ROUTER: un slug que no está
 * en `generateStaticParams` devuelve 404 antes de renderizar nada, y ese 404 sí
 * usa `app/not-found.tsx`. Es además lo correcto para rutas generadas desde
 * datos: un slug inexistente no debe renderizarse bajo demanda.
 *
 * No cuesta flexibilidad: el sitio ya es estático por completo y cualquier
 * cambio en el dataset exige un build.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  /* Un idioma inexistente no describe ningún contenido y no debe indexarse. */
  if (!isLocale(lang)) return { robots: { index: false, follow: true } };

  return {
    title: { default: `${brand.name} — ${t(brand.tagline, lang)}`, template: `%s · ${brand.name}` },
    description: t(brand.tagline, lang),
    alternates: alternatesFor(lang, routes.home),
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: localeMeta[lang].htmlLang,
      url: absoluteUrl(lang, ""),
    },
    /* Un idioma en BORRADOR es navegable —hay que poder revisarlo— pero no
       entra al índice mientras esté incompleto. Se sigue permitiendo seguir
       los enlaces: la versión publicada de cada página sí debe descubrirse. */
    robots: { index: isPublished(lang), follow: true },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <div lang={localeMeta[lang].htmlLang}>
      <a
        href="#contenido"
        className="skip-link inline-flex min-h-11 items-center rounded-(--radius-pill) bg-brand px-5 font-medium text-on-brand"
      >
        {t(a11y.skipToContent, lang)}
      </a>
      <SmoothScroll />
      <Header lang={lang} />
      <main id="contenido">{children}</main>
      <AppFloating lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
