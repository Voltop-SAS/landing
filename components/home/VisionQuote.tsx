import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getFounder } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { QuoteAttribution } from "@/components/ui/QuoteAttribution";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FilmStage } from "@/components/ui/FilmStage";

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

          {/* La atribución va ANTES de la cita, al contrario que en el beat 5.
              Esto no es un testimonio de cliente: es la visión del fundador en
              primera persona y 300 caracteres, y saber quién habla cambia cómo
              se leen. La unidad —retrato, nombre, cargo— es la misma que allí;
              lo que cambia es su sitio. Ver `QuoteAttribution`. */}
          <QuoteAttribution
            className="mt-7"
            asset={media.retratoFundador}
            lang={lang}
            name={founder.name}
            role={t(founder.role, lang)}
          />

          {/* ── LA CITA, A ESCALA ──────────────────────────────────────────
              Estaba en `display-m md:display-l`: 52px a 1440 para casi 300
              caracteres, que son diez líneas de tipografía de titular. Con ese
              cuerpo la cita dejaba de leerse y pasaba a mirarse.

              Baja a `display-s md:display-m` (24 → 36px). El texto largo pide
              menos cuerpo, no más: la presencia de este beat la da la
              composición —columna estrecha, retrato, la película debajo— y no
              el tamaño de la letra. */}
          <blockquote
            id="vision-title"
            className="mt-7 font-display text-display-s font-medium text-balance text-ink md:text-display-m"
          >
            {t(founder.quote, lang)}
          </blockquote>

          <div className="mt-8 border-t border-line pt-6">
            <Button variant="link" arrow href={href(lang, routes.nosotros)}>
              {t(actions.knowVoltop, lang)}
            </Button>
          </div>
        </Reveal>
      </Container>

      <Container width="wide" className="mt-16">
        {/* SIGNATURE. `FilmStage` sustituye al `Reveal` genérico: el encuadre
            se abre al entrar y la página se atenúa al reproducir. No puede ir
            DENTRO de `Reveal` — ver la cabecera de `FilmStage`: el atenuado es
            `fixed` y un ancestro transformado lo encajaría en su caja.

            Pieza con controles, no fondo: lleva narración y subtítulos
            quemados, así que silenciarla en bucle perdería el mensaje.
            Ver la cabecera de `filmVoltop` en el registro de media.
            El `aspect-[16/9]` que aplica `Media` reserva el espacio, así que
            el póster entra sin desplazar nada. */}
        <FilmStage>
          <Media
            asset={media.filmVoltop}
            lang={lang}
            controls
            corner
            sizes="(min-width: 1600px) 1600px, 100vw"
          />
        </FilmStage>
      </Container>
    </Section>
  );
}
