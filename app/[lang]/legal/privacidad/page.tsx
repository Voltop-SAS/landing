import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t, type Locale } from "@/lib/i18n/config";
import { routes, absoluteUrl } from "@/lib/i18n/routes";
import { legal } from "@/content/copy/legal";
import { Section, Container, Eyebrow, SectionHeading } from "@/components/ui/layout";
import { PendingTag } from "@/components/ui/data";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const p = legal.privacy;
  const path = routes.privacy;
  return {
    title: t(p.meta.title, lang),
    description: t(p.meta.description, lang),
    alternates: {
      canonical: absoluteUrl(lang, path),
      languages: { es: absoluteUrl("es", path), en: absoluteUrl("en", path), "x-default": absoluteUrl("es", path) },
    },
    /* Sin texto legal definitivo, la página no debe indexarse. */
    robots: p.sections.length === 0 ? { index: false, follow: true } : undefined,
  };
}

/**
 * Política de tratamiento de datos.
 *
 * Existe porque el consentimiento del formulario de leads enlaza a ella: una
 * autorización informada exige que el titular pueda leer la política (§38).
 * El texto lo emite el área legal; aquí está la estructura y el brief.
 */
export default async function PrivacyPage({ params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;
  const p = legal.privacy;
  const pending = p.sections.length === 0;

  return (
    <Section space="none" className="pb-(--spacing-section) pt-32 md:pt-40">
      <Container width="narrow">
        <Eyebrow>{t(p.eyebrow, lang)}</Eyebrow>
        <h1 className="mt-5 font-display text-display-xl font-semibold text-balance text-ink">
          {t(p.title, lang)}
        </h1>

        {pending ? (
          <div className="mt-10 border-l-2 border-warn/50 pl-6">
            <PendingTag>{t(p.pendingTag, lang)}</PendingTag>
            <p className="mt-4 text-body-l text-ink-2">{t(p.pendingBody, lang)}</p>

            <SectionHeading size="s" className="mt-12">
              {t(p.requiredContentsTitle, lang)}
            </SectionHeading>
            {/* Aquí el número SÍ significa algo: es un índice de contenidos
                que el área legal va a ir cubriendo uno por uno. `<ol>`, no
                `<ul>` con números pintados a mano. */}
            <ol className="mt-6 space-y-0">
              {p.requiredContents.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-t border-line py-3 text-body-s text-ink-2"
                >
                  <span aria-hidden="true" className="shrink-0 font-mono text-mono text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t(item, lang)}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {p.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-display-m font-semibold text-ink">{t(s.heading, lang)}</h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((para, j) => (
                    <p key={j} className="text-body text-ink-2">
                      {t(para, lang)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
