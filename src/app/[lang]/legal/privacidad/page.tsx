import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { legal } from '~/core/legal/domain/consts/copy'
import { legalDocs } from '~/core/legal/infrastructure/content/legalDocs'
import { LegalDocument } from '~/core/legal/infrastructure/ui/components/LegalDocument'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: t(legal.privacy.meta.title, lang),
    description: t(legal.privacy.meta.description, lang),
    alternates: alternatesFor(lang, routes.privacy),
  }
}

/**
 * Política de tratamiento de datos — texto íntegro emitido por el área legal.
 *
 * Existe porque el consentimiento del formulario de leads enlaza aquí: una
 * autorización informada exige que el titular pueda LEER la política (§38).
 * Hasta el 2026-09-02 esta página mostraba un aviso de "texto legal pendiente"
 * y se servía con `noindex`; con el documento entregado, ambas cosas se
 * retiran. El andamiaje (`legal.privacy.pending*`, `requiredContents`) se
 * conserva en `content/copy/legal.ts` porque describe lo que el documento
 * debía cubrir y sirve de lista de verificación.
 */
export default async function PrivacyPage({ params }: Props) {
  const { lang: raw } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale
  return (
    <LegalDocument
      doc={legalDocs.privacy}
      titulo={t(legal.privacy.title, lang)}
      lang={lang}
    />
  )
}
