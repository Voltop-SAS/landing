import Image from 'next/image'
import { t, type Locale } from '@/lib/i18n/config'
import { href, routes } from '@/lib/i18n/routes'
import { home } from '@/content/copy/home'
import { actions } from '@/content/copy/common'
import { Section, Container, Eyebrow } from '@/components/ui/layout'
import { StoreBadges } from '@/components/ui/StoreBadges'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

/**
 * BEAT 8 · CÓMO SE CARGA — Intensidad: STANDARD
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 y §15.
 *
 * ── DEJÓ DE SER "LA SECCIÓN DE LA APP" ────────────────────────────────────
 * Este beat es la única respuesta del sitio a la pregunta del público
 * mayoritario: "¿cómo cargo?". Antes esa respuesta era UNA FRASE dentro de un
 * bloque rotulado "La app", con tres rasgos sueltos debajo. Rotular por el
 * producto en vez de por la tarea deja el beat invisible justo para quien lo
 * necesita, y un rasgo no responde lo que responde un paso.
 *
 * Ahora son cuatro pasos en orden —encuentra, escanea, carga, listo— más una
 * salida a la red para quien quiere ver dónde cargar sin descargar nada. La
 * intensidad sigue siendo STANDARD a propósito: viene después del momento
 * signature de la película y antes del cierre. Aquí no se busca impacto, se
 * busca que se entienda.
 *
 * ── EL QR NO ES DECORACIÓN, RESUELVE UN PROBLEMA CONCRETO ────────────────
 * Esta sección se lee sobre todo en escritorio, y ahí las insignias de tienda
 * son un callejón: llevan a una ficha que no se puede instalar en el aparato
 * que tienes delante. El QR salta ese hueco — sacas el teléfono y escaneas.
 * En móvil ocurre lo contrario: el QR sobra porque las insignias ya funcionan,
 * así que se OCULTA por debajo de `md` en lugar de encogerse.
 *
 * ── POR QUÉ EL QR VA SOBRE BLANCO ────────────────────────────────────────
 * Un lector de códigos espera módulos oscuros sobre fondo claro. Invertirlo
 * para que "combine" con el lienzo oscuro hace que muchos teléfonos fallen, y
 * un QR que no escanea es peor que ningún QR. El asset incluye además la zona
 * tranquila de 4 módulos que exige la especificación.
 *
 * ── COMPOSICIÓN ──────────────────────────────────────────────────────────
 * Dos columnas asimétricas, no la mitad y la mitad: el texto pesa y el QR es
 * un objeto pequeño. Partirlo por el medio dejaría al QR flotando en un vacío
 * y repetiría el split simétrico que §12 prohíbe.
 */
export function AppDownload({ lang }: { lang: Locale }) {
  const c = home.app

  return (
    <Section
      space="base"
      className="border-t border-line"
      ariaLabelledby="app-title"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
          <div>
            <Eyebrow tone="brand">{t(c.eyebrow, lang)}</Eyebrow>
            <h2
              id="app-title"
              className="mt-4 max-w-[16ch] font-display text-display-l font-semibold text-balance text-ink"
            >
              {t(c.title, lang)}
            </h2>
            <p className="measure-narrow mt-5 text-body-l text-ink-2">{t(c.lead, lang)}</p>

            {/* CUATRO PASOS, EN ORDEN. Una lista numerada y no viñetas: el
                número es información —dice que hay una secuencia y en qué
                punto estás—, mientras que un punto solo dice "otro elemento".

                El número va en mono, en tinta apagada y sin círculo de color:
                es un rótulo de ficha técnica, no una insignia. §12 reserva el
                gradiente para UNA acción por vista, y esa acción son las
                insignias de tienda que vienen justo debajo. */}
            <ol className="mt-8">
              {c.steps.map((paso, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1.75rem_1fr] gap-x-4 border-t border-line py-4 last:border-b"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-mono tabular-nums text-ink-3"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="font-display text-body font-semibold text-ink">
                      {t(paso.label, lang)}
                    </span>
                    <span className="mt-1 block text-body-s text-ink-2">{t(paso.body, lang)}</span>
                  </span>
                </li>
              ))}
            </ol>

            {/* Salida a la red: "¿dónde puedo cargar?" se responde en /red y no
                exige descargar nada antes. Va como enlace y no como botón para
                no competir con las insignias, que son la acción de este beat.

                Reutiliza `actions.findCharger`, el mismo rótulo que el Hero y
                el cierre: los tres llevan a /red, y tener una tercera clave con
                el mismo texto solo multiplica los sitios donde puede divergir.
                La clave propia `home.app.seeNetwork` se retiró por eso. */}
            <div className="mt-7">
              <Button
                variant="link"
                arrow
                href={href(lang, routes.red)}
              >
                {t(actions.findCharger, lang)}
              </Button>
            </div>

            <StoreBadges
              lang={lang}
              className="mt-9"
            />
          </div>

          {/* Solo escritorio: ver la cabecera del archivo. */}
          <Reveal className="hidden md:block">
            <div className="flex flex-col items-center gap-4">
              {/* Marco de vidrio con el código sobre blanco dentro: el efecto
                  va en el marco, nunca en el código. Ver `.glass` y la nota de
                  `AppFloating`. */}
              <div className="glass relative rounded-(--radius-structural) p-3">
                <div className="rounded-[1.125rem] bg-white p-3.5 shadow-[0_10px_28px_-10px_rgb(0_0_0/0.7)]">
                  <Image
                    src="/qr-descargar-app.svg"
                    alt={t(c.qrAlt, lang)}
                    width={168}
                    height={168}
                    /* SVG de 1.2 KB con geometría exacta: pasarlo por el
                     optimizador solo añadiría una petición y riesgo de
                     resampleo en un gráfico donde cada módulo cuenta. */
                    unoptimized
                    className="block size-[10.5rem]"
                  />
                </div>
              </div>
              <p className="font-mono text-mono text-ink-3">{t(c.qrLabel, lang)}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
