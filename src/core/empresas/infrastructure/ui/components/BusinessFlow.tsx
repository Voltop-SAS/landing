'use client'

import { useState } from 'react'
import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { empresas } from '~/core/empresas/domain/consts/copy'
import type { BusinessSegment } from '~/core/empresas/domain/entities/BusinessSegment'
import type { Case } from '~/core/empresas/domain/entities/Case'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { SegmentSelector } from '~/core/empresas/infrastructure/ui/components/SegmentSelector'
import { LeadForm } from '~/core/empresas/infrastructure/ui/components/LeadForm'

/**
 * B2B FLOW · selector → capabilities → EVIDENCE → form
 * See docs/MASTER-PROJECT-DEFINITION.md §10 and §14.
 *
 * NON-NEGOTIABLE ORDER: evidence ALWAYS precedes asking for the user's data.
 * The previous version put the form beside the selector, asking for the lead
 * without having proved anything. Here the user picks their case, reads the
 * proposition, sees a real implementation, and only then is asked for their
 * contact details.
 *
 * The chosen segment pre-fills the form: less friction and better lead
 * segmentation in the CRM.
 */
export function BusinessFlow({
  locale,
  segments,
  proofCase,
}: {
  locale: Locale
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
            kicker={t(empresas.selector.eyebrow, locale)}
            measure="max-w-[22ch]"
          >
            {t(empresas.selector.title, locale)}
          </SectionHeading>
          <p className="mt-5 measure text-body-l text-ink-2">{t(empresas.selector.lead, locale)}</p>

          <div className="mt-12">
            <SegmentSelector
              locale={locale}
              segments={segments}
              activeKey={activeKey}
              onChange={setActiveKey}
            />
          </div>
        </Container>
      </Section>

      {/* EVIDENCE — precedes the form */}
      {proofCase && (
        <Section
          space="base"
          className="border-t border-line bg-surface-1"
          ariaLabelledby="evidencia-title"
        >
          <Container>
            <SectionHeading
              id="evidencia-title"
              kicker={t(empresas.proof.eyebrow, locale)}
              kickerTone="brand"
            >
              {t(empresas.proof.title, locale)}
            </SectionHeading>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <SectionHeading
                  as="h3"
                  size="s"
                >
                  {t(empresas.proof.challengeLabel, locale)}
                </SectionHeading>
                <p className="mt-4 text-body text-ink-2">{t(proofCase.challenge, locale)}</p>

                <SectionHeading
                  as="h3"
                  size="s"
                  className="mt-12"
                >
                  {t(empresas.proof.solutionLabel, locale)}
                </SectionHeading>
                <p className="mt-4 text-body text-ink-2">{t(proofCase.solution, locale)}</p>
              </div>

              <div className="border-l-0 border-t border-line pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                <blockquote className="font-display text-display-m font-medium text-balance text-ink">
                  {t(proofCase.quote, locale)}
                </blockquote>
                <p className="mt-6 text-body-s">
                  <span className="text-ink">{proofCase.author}</span>
                  <span className="text-ink-3"> · {t(proofCase.role, locale)}</span>
                </p>
                {proofCase.stationSlug && (
                  <Link
                    href={href(locale, routes.station(proofCase.stationSlug))}
                    className="mt-8 inline-flex min-h-11 items-center gap-2 text-body-s text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {t(empresas.proof.seeStation, locale)}
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* CONVERSION — at the end of the journey, never before */}
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
                kicker={t(empresas.contact.eyebrow, locale)}
              >
                {t(empresas.contact.title, locale)}
              </SectionHeading>

              {/* This column had ~600px of emptiness beside a tall form.
                  What reduces the lead's friction goes here: what happens
                  after sending. No turnaround promised — there is no CRM
                  yet. */}
              <SectionHeading
                as="h3"
                size="s"
                className="mt-12"
              >
                {t(empresas.contact.nextTitle, locale)}
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
                          {t(n.title, locale)}
                        </h4>
                        <p className="mt-1.5 measure text-body-s text-ink-2">{t(n.body, locale)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-caption text-ink-3">
                {t(empresas.contact.privacyNote, locale)}
              </p>
            </div>
            <LeadForm
              locale={locale}
              segmentKey={activeKey}
              segmentLabel={active ? t(active.label, locale) : ''}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}
