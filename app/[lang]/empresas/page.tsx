import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { routes, absoluteUrl } from "@/lib/i18n/routes";
import { empresas } from "@/content/copy/empresas";
import { media } from "@/content/data/media";
import { getBusinessSegments, getFeaturedCase } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { BusinessFlow } from "@/components/empresas/BusinessFlow";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: t(empresas.meta.title, lang),
    description: t(empresas.meta.description, lang),
    alternates: {
      canonical: absoluteUrl(lang, routes.empresas),
      languages: {
        es: absoluteUrl("es", routes.empresas),
        en: absoluteUrl("en", routes.empresas),
        "x-default": absoluteUrl("es", routes.empresas),
      },
    },
  };
}

/**
 * /EMPRESAS · hub B2B.
 *
 * Apertura EDITORIAL con material real (distinta de la apertura funcional de
 * /red y de la narrativa de /nosotros): cada interna tiene su propio registro.
 */
export default async function EmpresasPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const segments = getBusinessSegments();
  const proofCase = getFeaturedCase() ?? null;

  return (
    <>
      <Section space="none" className="pt-32 md:pt-40">
        <Container>
          <Eyebrow>{t(empresas.hero.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-display-xl font-semibold text-ink">
            {t(empresas.hero.title, lang)}
          </h1>
          <p className="mt-7 measure text-body-l text-ink-2">{t(empresas.hero.lead, lang)}</p>
        </Container>

        <Container width="wide" className="mt-16">
          <Media asset={media.espacioComercial} lang={lang} sizes="(min-width: 1600px) 1600px, 100vw" className="aspect-[21/9]" />
        </Container>
      </Section>

      {/* Capacidades — información antes de pedir que elija */}
      <Section space="base" ariaLabelledby="capacidades-title">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>{t(empresas.capabilities.eyebrow, lang)}</Eyebrow>
              <h2 id="capacidades-title" className="mt-4 font-display text-display-l font-semibold text-ink">
                {t(empresas.capabilities.title, lang)}
              </h2>
            </div>
            <p className="measure-narrow text-body text-ink-2">{t(empresas.capabilities.lead, lang)}</p>
          </div>

          <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {empresas.capabilities.steps.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.06}>
                <div className="border-t border-line pt-6">
                  <span className="font-mono text-mono text-brand">{s.step}</span>
                  <h3 className="mt-4 font-display text-display-s font-semibold text-ink">{t(s.title, lang)}</h3>
                  <p className="mt-2 text-body-s text-ink-2">{t(s.body, lang)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <BusinessFlow lang={lang} segments={segments} proofCase={proofCase} />
    </>
  );
}
