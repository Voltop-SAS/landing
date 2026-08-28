import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { getBusinessSegments } from "@/lib/data";
import { Section, Container, SectionHeading } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

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
      {/* `align="center"` es explícito: esta composición SÍ está centrada a
          propósito (§12, contraste compositivo). Al declararlo se distingue del
          descuadre accidental que tenía el resto del sitio. */}
      <Container width="narrow" align="center" className="text-center">
        <Reveal>
          <SectionHeading id="empresas-title" kicker={t(home.business.eyebrow, lang)}>
            {t(home.business.title, lang)}
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[46ch] text-body-l text-ink-2">{t(home.business.lead, lang)}</p>
        </Reveal>
      </Container>

      {/* Los cuatro casos como ritmo tipográfico horizontal, NO como tarjetas.
          El comentario decía eso y el código pintaba cuatro celdas con borde a
          los cuatro lados: exactamente las cards que §12 prohíbe. Ahora es una
          fila de columnas separadas por hairlines verticales, sin caja. Y sin
          número: cuatro públicos no son una secuencia. */}
      <Container className="mt-14">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-0">
          {segments.map((s, i) => (
            <Reveal
              as="li"
              key={s.key}
              delay={i * 0.06}
              y={12}
              className={cn(
                "border-t border-line-strong pt-6 text-left md:border-t-0 md:border-l md:border-line md:pl-6 md:pt-0",
                i === 0 && "md:border-l-0 md:pl-0"
              )}
            >
              <h3 className="font-display text-display-s font-semibold text-ink">{t(s.label, lang)}</h3>
              <p className="mt-2 text-body-s text-ink-2">{t(s.headline, lang)}</p>
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
