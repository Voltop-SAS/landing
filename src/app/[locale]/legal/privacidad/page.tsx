import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { legal } from '~/core/legal/domain/consts/copy'
import { legalDocs } from '~/core/legal/infrastructure/content/legalDocs'
import { LegalDocument } from '~/core/legal/infrastructure/ui/components/LegalDocument'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(legal.privacy.meta.title, locale),
    description: t(legal.privacy.meta.description, locale),
    alternates: alternatesFor(locale, routes.privacy),
  }
}

/**
 * Data processing policy — the full text issued by the legal team.
 *
 * It exists because the lead form's consent links here: informed authorisation
 * requires that the data subject can READ the policy (§38). Until 2026-09-02
 * this page showed a "legal text pending" notice and was served with `noindex`;
 * with the document delivered, both are removed. The scaffolding
 * (`legal.privacy.pending*`, `requiredContents`) is kept in the legal module's
 * copy because it describes what the document had to cover and serves as a
 * checklist.
 */
export default async function PrivacyPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  return (
    <LegalDocument
      doc={legalDocs.privacy}
      titulo={t(legal.privacy.title, locale)}
      locale={locale}
    />
  )
}
