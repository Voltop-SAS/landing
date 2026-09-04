import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { legalDoc } from '~/core/legal/domain/consts/copy'
import { legalDocs } from '~/core/legal/infrastructure/content/legalDocs'
import { LegalDocument } from '~/core/legal/infrastructure/ui/components/LegalDocument'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(legalDoc.terms.meta.title, locale),
    description: t(legalDoc.terms.meta.description, locale),
    alternates: alternatesFor(locale, routes.terms),
  }
}

/**
 * Términos y condiciones — texto íntegro emitido por el área legal (§38).
 *
 * Ya no lleva `noindex`: el motivo de la marca era no tener texto definitivo,
 * y ahora lo hay.
 */
export default async function TermsPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  return (
    <LegalDocument
      doc={legalDocs.terms}
      titulo={t(legalDoc.terms.title, locale)}
      locale={locale}
    />
  )
}
