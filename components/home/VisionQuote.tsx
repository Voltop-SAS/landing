import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '@/content/copy/home'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getFounder } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@/components/ui/layout'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

/**
 * BEAT 6 · VISIÓN — Intensidad: Media-alta · Registro: Silencio · Espacio: loose
 * ESTRUCTURA: dos columnas —retrato del fundador y sus palabras—. Invierte la
 * relación del beat 5: allí el texto va SOBRE el material y la foto acredita;
 * aquí la persona y el texto conviven al mismo nivel.
 *
 * ── LA PELÍCULA SALIÓ DE AQUÍ ─────────────────────────────────────────────
 * Este beat cerraba con `filmVoltop` en una franja ancha de 16/9, y era el
 * segundo momento signature de la Home. Se retiró el 2026-09-04 por decisión
 * de producto, y de paso resuelve algo que estaba anotado como pendiente: ese
 * archivo es EL MISMO que la portada de la entrada de Wake, así que la misma
 * película se reproducía en dos sitios del sitio. Ahora vive solo en el
 * registro, que es donde tiene contexto.
 *
 * Con ella se fue `FilmStage`, el componente que le daba el encuadre al entrar
 * y atenuaba la página al reproducir. Está en el historial de git: si la
 * película vuelve, se recupera de ahí en lugar de dejar un componente sin uso
 * esperando por si acaso.
 *
 * La Home queda con UN momento signature —el panel fijado del beat 2— en lugar
 * de dos. Conviene saberlo: la curva de intensidad que se diseñó tenía dos
 * picos separados por cinco beats, y ahora el segundo lo sostiene este beat
 * con el retrato, que es de otro orden.
 *
 * Era el momento mejor resuelto del prototipo anterior: se conserva su registro
 * editorial y se le da el aire que no tenía.
 */
export function VisionQuote({ lang }: { lang: Locale }) {
  const founder = getFounder()
  if (!founder.quote) return null

  return (
    <Section
      id="vision"
      space="loose"
      ariaLabelledby="vision-title"
    >
      {/* ── DOS COLUMNAS: LA PERSONA Y SUS PALABRAS ──────────────────────
          Este beat era una columna estrecha con el retrato reducido a una
          miniatura de 96px en la fila de atribución. Ahora el retrato ocupa
          media columna en vertical, y el cambio no es de tamaño sino de
          función: en el beat 5 la foto ACREDITA un testimonio —quién lo dijo—
          mientras aquí la persona ES el tema. Es la visión del fundador en
          primera persona; su cara pesa tanto como el texto.

          Las dos secciones de cita siguen perteneciendo al mismo sistema: el
          mismo marco, el mismo radio estructural, el mismo hairline. Lo que
          las separa es la escala, y la separa a propósito.

          `items-center` alinea el texto contra el centro del retrato en lugar
          de colgar los dos de arriba: con alturas distintas es lo único que
          los lee como una unidad. */}
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
          {/* EL RETRATO. Mismo lenguaje de superficie que las tarjetas de
              ciudad. Pendiente de entrega: hasta que llegue es una superficie
              callada —sin rótulo, como el resto de los huecos de este tamaño—
              y el archivo entra con `object-cover` sin tocar el layout. */}
          {/* Acotado al apilarse. Sin tope, a 768px la columna única le daba
              los 702px de ancho y el 2/3 lo convertía en 1053px de alto: un
              hueco de mil píxeles que hacía crecer la sección a 2060. Con
              `max-w-sm` queda en 384×576 y centrado, que es una presencia
              fuerte sin ser un muro. Desde `lg` manda la rejilla. */}
          <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-(--radius-structural) border border-line bg-surface-1 lg:mx-0 lg:max-w-none">
            {media.retratoFundador.src && (
              <Image
                src={media.retratoFundador.src}
                alt={t(media.retratoFundador.alt, lang)}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            )}
          </div>

          <Reveal>
            <Eyebrow tone="brand">{t(home.vision.eyebrow, lang)}</Eyebrow>

            {/* Nombre y cargo ANTES de la cita. Con el retrato al lado, quién
              habla ya está dicho visualmente; ponerlo en texto aquí lo nombra
              antes de que empiecen 280 caracteres en primera persona, que es
              cuando sirve saberlo. En el beat 5 va después, porque allí el
              testimonio se acredita, no se presenta. */}
            <p className="mt-5 text-body-s">
              <span className="font-medium text-ink">{founder.name}</span>
              <span className="text-ink-3"> · {t(founder.role, lang)}</span>
            </p>

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
              <Button
                variant="link"
                arrow
                href={href(lang, routes.nosotros)}
              >
                {t(actions.knowVoltop, lang)}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
