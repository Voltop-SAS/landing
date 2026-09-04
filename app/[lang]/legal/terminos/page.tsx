import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { routes, alternatesFor } from "@/lib/i18n/routes";
import { legalDoc } from "@/content/copy/legal";
import { legalDocs } from "@/content/data/legal-docs";
import { LegalDocument } from "@/components/legal/LegalDocument";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(legalDoc.terms.meta.title, lang),
    description: t(legalDoc.terms.meta.description, lang),
    alternates: alternatesFor(lang, routes.terms),
  };
}

/**
 * Términos y condiciones — texto íntegro emitido por el área legal (§38).
 *
 * Ya no lleva `noindex`: el motivo de la marca era no tener texto definitivo,
 * y ahora lo hay.
 */
export default async function TermsPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;
  return (
    <LegalDocument doc={legalDocs.terms} titulo={t(legalDoc.terms.title, lang)} lang={lang} />
  );
}
