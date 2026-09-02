import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getFounder } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * BEAT 6 · VISIÓN — Intensidad: Media-alta · Registro: Silencio · Espacio: loose
 * ESTRUCTURA: columna estrecha centrada con la cita como único elemento, y el
 * material en una franja ancha DEBAJO. Invierte la relación del beat 5
 * (allí el texto va sobre el material; aquí el texto precede al material).
 *
 * Era el momento mejor resuelto del prototipo anterior: se conserva su registro
 * editorial y se le da el aire que no tenía.
 */
export function VisionQuote({ lang }: { lang: Locale }) {
  const founder = getFounder();
  if (!founder.quote) return null;

  return (
    <Section id="vision" space="loose" ariaLabelledby="vision-title">
      {/* Columna estrecha colgada del riel (antes flotaba centrada a 380px,
          un tercer borde izquierdo distinto en la misma página). */}
      <Container width="narrow">
        <Reveal>
          <Eyebrow>{t(home.vision.eyebrow, lang)}</Eyebrow>
          <blockquote
            id="vision-title"
            className="mt-6 font-display text-display-m font-medium text-balance text-ink md:text-display-l"
          >
            {t(founder.quote, lang)}
          </blockquote>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
            <p className="text-body-s">
              <span className="text-ink">{founder.name}</span>
              <span className="text-ink-3"> · {t(founder.role, lang)}</span>
            </p>
            <Button variant="link" arrow href={href(lang, routes.nosotros)}>
              {t(actions.knowVoltop, lang)}
            </Button>
          </div>
        </Reveal>
      </Container>

      <Container width="wide" className="mt-16">
        <Reveal delay={0.08}>
          {/* Pieza con controles, no fondo: lleva narración y subtítulos
              quemados, así que silenciarla en bucle perdería el mensaje.
              Ver la cabecera de `filmVoltop` en el registro de media.
              El `aspect-[16/9]` que aplica `Media` reserva el espacio, así que
              el póster entra sin desplazar nada. */}
          <Media
            asset={media.filmVoltop}
            lang={lang}
            controls
            sizes="(min-width: 1600px) 1600px, 100vw"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
