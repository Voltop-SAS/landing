"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { empresas } from "@/content/copy/empresas";
import type { BusinessSegment, Case } from "@/content/data/company";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { SegmentSelector } from "@/components/empresas/SegmentSelector";
import { LeadForm } from "@/components/empresas/LeadForm";

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
  lang: Locale;
  segments: BusinessSegment[];
  proofCase: Case | null;
}) {
  const [activeKey, setActiveKey] = useState(segments[0]?.key ?? "");
  const active = segments.find((s) => s.key === activeKey) ?? segments[0];

  return (
    <>
      <Section id="casos" space="base" ariaLabelledby="selector-title">
        <Container>
          <Eyebrow>{t(empresas.selector.eyebrow, lang)}</Eyebrow>
          <h2 id="selector-title" className="mt-4 max-w-[22ch] font-display text-display-l font-semibold text-ink">
            {t(empresas.selector.title, lang)}
          </h2>
          <p className="mt-5 measure text-body-l text-ink-2">{t(empresas.selector.lead, lang)}</p>

          <div className="mt-12">
            <SegmentSelector lang={lang} segments={segments} activeKey={activeKey} onChange={setActiveKey} />
          </div>
        </Container>
      </Section>

      {/* EVIDENCIA — precede al formulario */}
      {proofCase && (
        <Section space="base" className="border-t border-line bg-surface-1" ariaLabelledby="evidencia-title">
          <Container>
            <Eyebrow tone="brand">{t(empresas.proof.eyebrow, lang)}</Eyebrow>
            <h2 id="evidencia-title" className="mt-4 font-display text-display-l font-semibold text-ink">
              {t(empresas.proof.title, lang)}
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <h3 className="font-mono text-mono uppercase tracking-wider text-ink-3">
                  {t(empresas.proof.challengeLabel, lang)}
                </h3>
                <p className="mt-4 text-body text-ink-2">{t(proofCase.challenge, lang)}</p>

                <h3 className="mt-10 font-mono text-mono uppercase tracking-wider text-ink-3">
                  {t(empresas.proof.solutionLabel, lang)}
                </h3>
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
      <Section id="contacto" space="base" className="border-t border-line" ariaLabelledby="contacto-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>{t(empresas.contact.eyebrow, lang)}</Eyebrow>
              <h2 id="contacto-title" className="mt-4 font-display text-display-l font-semibold text-ink">
                {t(empresas.contact.title, lang)}
              </h2>
            </div>
            <LeadForm lang={lang} segmentKey={activeKey} segmentLabel={active ? t(active.label, lang) : ""} />
          </div>
        </Container>
      </Section>
    </>
  );
}
