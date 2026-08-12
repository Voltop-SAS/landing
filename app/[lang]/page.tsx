import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";

import { Hero } from "@/components/home/Hero";
import { InfrastructureSignature } from "@/components/home/InfrastructureSignature";
import { NetworkIndex } from "@/components/home/NetworkIndex";
import { BusinessIntro } from "@/components/home/BusinessIntro";
import { ProofCase } from "@/components/home/ProofCase";
import { VisionQuote } from "@/components/home/VisionQuote";
import { CloseCta } from "@/components/home/CloseCta";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(home.meta.title, lang),
    description: t(home.meta.description, lang),
    alternates: {
      canonical: absoluteUrl(lang, ""),
      languages: { es: absoluteUrl("es", ""), en: absoluteUrl("en", ""), "x-default": absoluteUrl("es", "") },
    },
  };
}

/**
 * HOME · 7 beats.
 *
 * SECUENCIA ESTRUCTURAL (§12: dos beats consecutivos no comparten estructura):
 *   1 full-bleed  →  2 sticky scrub  →  3 índice ancho denso  →
 *   4 columna estrecha aireada  →  5 full-bleed con texto encima  →
 *   6 columna estrecha + franja ancha  →  7 asimétrico
 *
 * CURVA DE INTENSIDAD:
 *   Alta → MUY ALTA → Media → Media-baja → Alta → Media-alta → Alta
 *
 * La Home PRESENTA: ninguna sección resuelve aquí lo que resuelve una interna.
 */
export default async function HomePage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  return (
    <>
      <Hero lang={lang} />
      <InfrastructureSignature lang={lang} />
      <NetworkIndex lang={lang} />
      <BusinessIntro lang={lang} />
      <ProofCase lang={lang} />
      <VisionQuote lang={lang} />
      <CloseCta lang={lang} />
    </>
  );
}
