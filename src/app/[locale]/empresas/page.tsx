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

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    title: t(empresas.meta.title, locale),
    description: t(empresas.meta.description, locale),
    alternates: alternatesFor(locale, routes.empresas),
  }
}

/**
 * /EMPRESAS · hub B2B.
 *
 * Apertura EDITORIAL con material real (distinta de la apertura funcional de
 * /red y de la narrativa de /nosotros): cada interna tiene su propio registro.
 */
export default async function EmpresasPage({ params }: Props) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const segments = getBusinessSegments()
  const proofCase = getFeaturedCase() ?? null

  return (
    <>
      <Section
        space="none"
        className="pt-32 md:pt-40"
      >
        <Container>
          <Eyebrow>{t(empresas.hero.eyebrow, locale)}</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-display-xl font-semibold text-ink">
            {t(empresas.hero.title, locale)}
          </h1>
          <p className="mt-7 measure text-body-l text-ink-2">{t(empresas.hero.lead, locale)}</p>
        </Container>

        <Container
          width="wide"
          className="mt-16"
        >
          <Media
            asset={media.espacioComercial}
            locale={locale}
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
                kicker={t(empresas.capabilities.eyebrow, locale)}
              >
                {t(empresas.capabilities.title, locale)}
              </SectionHeading>
            </div>
            <p className="measure-narrow text-body text-ink-2">
              {t(empresas.capabilities.lead, locale)}
            </p>
          </div>

          {/* SÍ es una secuencia: evaluar precede a instalar. */}
          <ProcessList
            className="mt-12 sm:grid-cols-2 lg:grid-cols-4"
            items={empresas.capabilities.steps.map((s) => ({
              step: s.step,
              title: t(s.title, locale),
              body: t(s.body, locale),
            }))}
          />
        </Container>
      </Section>

      <BusinessFlow
        locale={locale}
        segments={segments}
        proofCase={proofCase}
      />
    </>
  )
}
