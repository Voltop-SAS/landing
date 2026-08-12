import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";

import { locales, isLocale, localeMeta, t, type Locale } from "@/lib/i18n/config";
import { SITE_URL, absoluteUrl } from "@/lib/i18n/routes";
import { a11y, brand } from "@/content/copy/common";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * LAYOUT RAÍZ · por idioma
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28.
 *
 * El idioma vive en la URL, por lo que `<html lang>` es correcto en el HTML
 * SERVIDO — no corregido en cliente. Ambas versiones son estáticas e indexables.
 *
 * TIPOGRAFÍAS PLACEHOLDER (§32, decisión abierta O1). Las variables se llaman
 * `*-raw` y los tokens de @theme las consumen: evita la autorreferencia que
 * hacía frágil el valor computado.
 */

const display = Space_Grotesk({ variable: "--font-display-raw", subsets: ["latin"], display: "swap" });
const sans = Inter({ variable: "--font-sans-raw", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono-raw", subsets: ["latin"], display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${brand.name} — ${t(brand.tagline, lang)}`, template: `%s · ${brand.name}` },
    description: t(brand.tagline, lang),
    alternates: {
      canonical: absoluteUrl(lang, ""),
      languages: {
        es: absoluteUrl("es", ""),
        en: absoluteUrl("en", ""),
        "x-default": absoluteUrl("es", ""),
      },
    },
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: localeMeta[lang].htmlLang,
      url: absoluteUrl(lang, ""),
    },
    robots: { index: true, follow: true },
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
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  return (
    <html lang={localeMeta[lang].htmlLang} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <a
          href="#contenido"
          className="skip-link inline-flex min-h-11 items-center rounded-(--radius-pill) bg-brand px-5 font-medium text-on-brand"
        >
          {t(a11y.skipToContent, lang)}
        </a>
        <SmoothScroll />
        <Header lang={lang} />
        <main id="contenido">{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
