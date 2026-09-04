import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '~/core/common/domain/i18n/config'
import { routes, alternatesFor } from '~/core/common/domain/i18n/routes'
import { empresas } from '~/core/empresas/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getBusinessSegments, getFeaturedCase } from '~/core/common/infrastructure/data-access'
import {
  Section,
  Container,
  Eyebrow,
  SectionHeading,
  ProcessList,
} from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { BusinessFlow } from '~/core/empresas/infrastructure/ui/components/BusinessFlow'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return {
    title: t(empresas.meta.title, lang),
    description: t(empresas.meta.description, lang),
    alternates: alternatesFor(lang, routes.empresas),
  }
}

/**
 * /EMPRESAS · hub B2B.
 *
 * Apertura EDITORIAL con material real (distinta de la apertura funcional de
 * /red y de la narrativa de /nosotros): cada interna tiene su propio registro.
 */
export default async function EmpresasPage({ params }: Props) {
  const { lang: raw } = await params
  if (!isLocale(raw)) notFound()
  const lang = raw as Locale

  const segments = getBusinessSegments()
  const proofCase = getFeaturedCase() ?? null

  return (
    <>
      <Section
        space="none"
        className="pt-32 md:pt-40"
      >
        <Container>
          <Eyebrow>{t(empresas.hero.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-display-xl font-semibold text-ink">
            {t(empresas.hero.title, lang)}
          </h1>
          <p className="mt-7 measure text-body-l text-ink-2">{t(empresas.hero.lead, lang)}</p>
        </Container>

        <Container
          width="wide"
          className="mt-16"
        >
          <Media
            asset={media.espacioComercial}
            lang={lang}
            corner
            sizes="(min-width: 1600px) 1600px, 100vw"
            aspect="21/9"
          />
        </Container>
      </Section>

      {/* Capacidades — información antes de pedir que elija */}
      <Section
        space="base"
        ariaLabelledby="capacidades-title"
      >
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionHeading
                id="capacidades-title"
                kicker={t(empresas.capabilities.eyebrow, lang)}
              >
                {t(empresas.capabilities.title, lang)}
              </SectionHeading>
            </div>
            <p className="measure-narrow text-body text-ink-2">
              {t(empresas.capabilities.lead, lang)}
            </p>
          </div>

          {/* SÍ es una secuencia: evaluar precede a instalar. */}
          <ProcessList
            className="mt-12 sm:grid-cols-2 lg:grid-cols-4"
            items={empresas.capabilities.steps.map((s) => ({
              step: s.step,
              title: t(s.title, lang),
              body: t(s.body, lang),
            }))}
          />
        </Container>
      </Section>

      <BusinessFlow
        lang={lang}
        segments={segments}
        proofCase={proofCase}
      />
    </>
  )
}
