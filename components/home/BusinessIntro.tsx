import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { getBusinessSegments } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * BEAT 4 · EMPRESAS — Intensidad: Media-baja · Registro: Silencio · Espacio: loose
 * ESTRUCTURA: columna estrecha centrada, mucho aire, sin media.
 *
 * Es la RESPIRACIÓN de la página: llega después del índice denso del beat 3 y
 * antes del pico visual del beat 5. Su contraste es el ritmo, no la imagen.
 *
 * Antes era un split a dos columnas espejo del beat anterior — exactamente la
 * simetría predecible que el sistema prohíbe (§12).
 */
export function BusinessIntro({ lang }: { lang: Locale }) {
  const segments = getBusinessSegments();

  return (
    <Section id="empresas" space="loose" ariaLabelledby="empresas-title">
      <Container width="narrow" className="text-center">
        <Reveal>
          <Eyebrow className="justify-center">{t(home.business.eyebrow, lang)}</Eyebrow>
          <h2
            id="empresas-title"
            className="mt-5 font-display text-display-l font-semibold text-balance text-ink"
          >
            {t(home.business.title, lang)}
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-body-l text-ink-2">{t(home.business.lead, lang)}</p>
        </Reveal>
      </Container>

      {/* Los cuatro casos como ritmo tipográfico horizontal, no como tarjetas */}
      <Container className="mt-16">
        <ul className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {segments.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 0.06} y={12} className="bg-canvas">
              <div className="flex h-full flex-col p-6">
                <span className="font-mono text-mono text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-display-s font-semibold text-ink">{t(s.label, lang)}</h3>
                <p className="mt-2 text-body-s text-ink-2">{t(s.headline, lang)}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button variant="ghost" arrow href={href(lang, routes.empresas)}>
            {t(actions.businessSolutions, lang)}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
