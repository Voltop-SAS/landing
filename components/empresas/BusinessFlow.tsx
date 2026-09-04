'use client'

import { useState } from 'react'
import Link from 'next/link'
import { t, type Locale } from '@/lib/i18n/config'
import { href, routes } from '@/lib/i18n/routes'
import { empresas } from '@/content/copy/empresas'
import type { BusinessSegment, Case } from '@/content/data/company'
import { Section, Container, SectionHeading } from '@/components/ui/layout'
import { SegmentSelector } from '@/components/empresas/SegmentSelector'
import { LeadForm } from '@/components/empresas/LeadForm'

/**
 * FLUJO B2B · selector → capacidades → EVIDENCIA → formulario
 * Ver docs/MASTER-PROJECT-DEFINITION.md §10 y §14.
 *
 * ORDEN NO NEGOCIABLE: la evidencia precede SIEMPRE a la petición del dato.
 * La versión anterior ponía el formulario al lado del selector, pidiendo el
 * lead sin haber probado nada. Aquí el usuario elige su caso, ve la propuesta,
 * ve una implementación real y solo entonces se le pide el contacto.
 *
 * El segmento elegido prellena el formulario: menos fricción y mejor
 * segmentación del lead en el CRM.
 */
export function BusinessFlow({
  lang,
  segments,
  proofCase,
}: {
  lang: Locale
  segments: BusinessSegment[]
  proofCase: Case | null
}) {
  const [activeKey, setActiveKey] = useState(segments[0]?.key ?? '')
  const active = segments.find((s) => s.key === activeKey) ?? segments[0]

  return (
    <>
      <Section
        id="casos"
        space="base"
        ariaLabelledby="selector-title"
      >
        <Container>
          <SectionHeading
            id="selector-title"
            kicker={t(empresas.selector.eyebrow, lang)}
            measure="max-w-[22ch]"
          >
            {t(empresas.selector.title, lang)}
          </SectionHeading>
          <p className="mt-5 measure text-body-l text-ink-2">{t(empresas.selector.lead, lang)}</p>

          <div className="mt-12">
            <SegmentSelector
              lang={lang}
              segments={segments}
              activeKey={activeKey}
              onChange={setActiveKey}
            />
          </div>
        </Container>
      </Section>

      {/* EVIDENCIA — precede al formulario */}
      {proofCase && (
        <Section
          space="base"
          className="border-t border-line bg-surface-1"
          ariaLabelledby="evidencia-title"
        >
          <Container>
            <SectionHeading
              id="evidencia-title"
              kicker={t(empresas.proof.eyebrow, lang)}
              kickerTone="brand"
            >
              {t(empresas.proof.title, lang)}
            </SectionHeading>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <SectionHeading
                  as="h3"
                  size="s"
                >
                  {t(empresas.proof.challengeLabel, lang)}
                </SectionHeading>
                <p className="mt-4 text-body text-ink-2">{t(proofCase.challenge, lang)}</p>

                <SectionHeading
                  as="h3"
                  size="s"
                  className="mt-12"
                >
                  {t(empresas.proof.solutionLabel, lang)}
                </SectionHeading>
                <p className="mt-4 text-body text-ink-2">{t(proofCase.solution, lang)}</p>
              </div>

              <div className="border-l-0 border-t border-line pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                <blockquote className="font-display text-display-m font-medium text-balance text-ink">
                  {t(proofCase.quote, lang)}
                </blockquote>
                <p className="mt-6 text-body-s">
                  <span className="text-ink">{proofCase.author}</span>
                  <span className="text-ink-3"> · {t(proofCase.role, lang)}</span>
                </p>
                {proofCase.stationSlug && (
                  <Link
                    href={href(lang, routes.station(proofCase.stationSlug))}
                    className="mt-8 inline-flex min-h-11 items-center gap-2 text-body-s text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {t(empresas.proof.seeStation, lang)}
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* CONVERSIÓN — al final del recorrido, nunca antes */}
      <Section
        id="contacto"
        space="base"
        className="border-t border-line"
        ariaLabelledby="contacto-title"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <SectionHeading
                id="contacto-title"
                kicker={t(empresas.contact.eyebrow, lang)}
              >
                {t(empresas.contact.title, lang)}
              </SectionHeading>

              {/* Esta columna tenía ~600px de vacío al lado de un formulario
                  alto. Aquí va lo que reduce la fricción del lead: qué pasa
                  después de enviar. Sin plazo prometido — no hay CRM todavía. */}
              <SectionHeading
                as="h3"
                size="s"
                className="mt-12"
              >
                {t(empresas.contact.nextTitle, lang)}
              </SectionHeading>
              <ol className="mt-6 space-y-0">
                {empresas.contact.next.map((n) => (
                  <li
                    key={n.step}
                    className="border-t border-line py-5"
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-mono text-mono text-ink-3"
                      >
                        {n.step}
                      </span>
                      <div>
                        <h4 className="font-display text-display-s font-semibold text-ink">
                          {t(n.title, lang)}
                        </h4>
                        <p className="mt-1.5 measure text-body-s text-ink-2">{t(n.body, lang)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-caption text-ink-3">
                {t(empresas.contact.privacyNote, lang)}
              </p>
            </div>
            <LeadForm
              lang={lang}
              segmentKey={activeKey}
              segmentLabel={active ? t(active.label, lang) : ''}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}
