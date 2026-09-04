import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions, units } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getCitiesWithStations, getNetworkSummary } from "@/lib/data";
import { Section, Container, SectionHeading } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

/**
 * BEAT 3 · NUESTRA RED
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12, §14 y §33.
 *
 * ── LA COMPOSICIÓN VIENE DE UNA REFERENCIA, Y ESO CAMBIA LAS REGLAS ──────
 * Este beat se rediseñó contra una referencia visual concreta (2026-09-04) que
 * es la fuente de verdad de su composición: jerarquía, proporciones, ritmo
 * vertical, tratamiento de las tarjetas, bloque de métricas y CTA.
 *
 * Antes de decidir nada se MUESTREÓ el mockup en lugar de estimarlo a ojo, y
 * eso evitó dos errores:
 *
 * · El titular PARECÍA de dos tonos —la segunda línea se veía gris—. Medido,
 *   el píxel más claro de las dos líneas es idéntico (253,253,253): era el
 *   antialias del mockup a ese tamaño. Un tono, no dos.
 * · El contador de Medellín aparece en cian y el de Bogotá en gris. No son dos
 *   estilos: es la MISMA tarjeta en estado hover. Se implementa como hover.
 *
 * Todos los demás colores del mockup mapean a tokens que ya existían —el
 * antetítulo a `brand`, el párrafo a `ink-2`, las etiquetas a `ink-3`, los
 * bordes a `line`—, así que no hizo falta inventar ni uno.
 *
 * ── DOS ÁREAS, UNA SOLA COMPOSICIÓN ──────────────────────────────────────
 * Izquierda 52% para el contenido, derecha 48% reservado para el render del
 * cargador. La derecha NO es un contenedor de imagen: no tiene fondo, borde ni
 * etiqueta, así que la sección se lee como una composición editorial con aire
 * a la derecha y no como "bloque de texto | caja de foto". Cuando entre el
 * render, ocupará ese aire sin mover ni un píxel de la izquierda.
 *
 * ── FONDO SÓLIDO: LO QUE SE FUE ──────────────────────────────────────────
 * Este beat tenía una fotografía de suelo muy atenuada con dos velos y FLOW
 * —parallax contenido— aplicado en el bloque 47. La referencia pide fondo
 * sólido `canvas` sin gradientes ni texturas, así que la fotografía y el FLOW
 * salen. El escalonado de las tarjetas (DEPTH expressive) se conserva.
 *
 * Cuando llegue el render del cargador, ES la pieza que debe llevar FLOW: un
 * objeto grande y vertical dentro de un marco fijo es exactamente el caso para
 * el que existe esa primitiva.
 *
 * ── LAS CIFRAS NO ESTÁN ESCRITAS ─────────────────────────────────────────
 * Puntos, potencias y conectores se CALCULAN desde el dataset en
 * `getNetworkSummary()`. Una cifra escrita a mano deja de ser verdad en cuanto
 * se añade una estación, y §33 prohíbe inventar cifras: la forma más segura de
 * no inventarlas es no poder escribirlas.
 */
export function NetworkIndex({ lang }: { lang: Locale }) {
  const resumen = getNetworkSummary();
  const cobertura = getCitiesWithStations();

  const cifras: { etiqueta: string; valor: React.ReactNode }[] = [
    /* La única que cuenta es la que ES un número. "22–80 kW" y la lista de
       conectores no son cantidades: animarlas sería movimiento por moverse. */
    { etiqueta: t(home.network.stats.points, lang), valor: <CountUp value={resumen.puntos} /> },
    {
      etiqueta: t(home.network.stats.power, lang),
      valor:
        resumen.potenciaMin && resumen.potenciaMax
          ? `${resumen.potenciaMin}–${resumen.potenciaMax} kW`
          : "—",
    },
    { etiqueta: t(home.network.stats.connectors, lang), valor: resumen.conectores.join(" · ") },
  ];

  /** El asset de cada ciudad, por slug. Ver el bloque CIUDADES en `media.ts`. */
  const fotoCiudad: Record<string, typeof media.ciudadBogota | undefined> = {
    bogota: media.ciudadBogota,
    medellin: media.ciudadMedellin,
  };

  return (
    <Section
      id="red"
      space="base"
      /* Fondo sólido, sin capas. Ver la nota de arriba. */
      className="bg-canvas"
      ariaLabelledby="red-title"
    >
      <Container>
        <div className="grid items-stretch gap-14 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] lg:gap-12">
          {/* ── IZQUIERDA · CONTENIDO ─────────────────────────────────── */}
          <div>
            {/* `SectionHeading` y no un antetítulo más un `h2` a mano: es la
                primitiva del sistema, y con ella la relación antetítulo/título
                —el `mt-4`, el `text-balance`, el tono del kicker— es la misma
                que en todas las demás secciones del sitio.

                `size="m"` está medido, no estimado: en el mockup la altura de
                mayúscula del titular equivale a ~38px para su columna, y
                `display-l` da 52px a 1440. Con 52px partía en TRES líneas y la
                referencia tiene DOS. El tamaño no es un gusto: es lo que
                produce ese ritmo. */}
            <SectionHeading id="red-title" kicker={t(home.network.eyebrow, lang)} kickerTone="brand" size="m">
              {t(home.network.title, lang)}
            </SectionHeading>

            <p className="measure mt-6 text-body-l text-ink-2">{t(home.network.lead, lang)}</p>

            {/* ── TARJETAS DE COBERTURA ───────────────────────────────────
                La fotografía es el elemento dominante y el texto vive DENTRO,
                sobre ella. No son tarjetas del sistema con una imagen encima:
                son un encuadre con contenido anclado abajo, que es lo que
                pide la referencia.

                Lado a lado desde `sm`, apiladas por debajo. Se probaron las
                dos columnas en móvil —la referencia las tiene así— y a 390px
                cada tarjeta queda en 164px: el contador parte en dos líneas
                ("2 estaciones / en operación") y el botón circular se come un
                tercio del ancho. Apiladas, cada una dispone de 341px y vuelve
                a ser una tarjeta; la relación entre las dos ciudades se
                mantiene por adyacencia, solo que vertical. */}
            <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cobertura.map(({ city, count, operational }, i) => (
                <Reveal as="li" key={city.slug} index={i} level="expressive">
                  <Link
                    href={href(lang, routes.city(city.slug))}
                    className="press group relative block overflow-hidden rounded-(--radius-structural) border border-line transition-[transform,border-color] duration-(--duration-fast) ease-(--ease-standard) hover:-translate-y-1 hover:border-line-strong motion-reduce:hover:translate-y-0"
                  >
                    {/* EL ENCUADRE. La proporción la fija la tarjeta y el
                        material la rellena con `fill`, no al revés.

                        `fill` no es un detalle técnico: sin él, el hueco
                        declarado imprime su rótulo Y su descripción completa
                        dentro de la tarjeta, y esa descripción caía justo
                        encima del nombre de la ciudad. Con `fill`, el hueco se
                        reduce a una insignia en una esquina y el contenido de
                        la tarjeta se lee. Cuando llegue la foto, la insignia
                        desaparece sola. */}
                    <div className="relative aspect-[16/9] w-full">
                      <Media
                        asset={fotoCiudad[city.slug] ?? media.ciudadBogota}
                        lang={lang}
                        fill
                        sizes="(min-width: 1024px) 20rem, 45vw"
                        className="h-full w-full"
                      />
                    </div>

                    {/* Velo de legibilidad: no es decoración, es lo que
                        garantiza que el nombre se lea sobre cualquier
                        fotografía. De abajo a arriba, porque el texto está
                        anclado abajo. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/55 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <div className="min-w-0">
                        {/* El acento de hover va en el NOMBRE, como en las
                            tarjetas de ciudad de `/red`. En la referencia
                            aparece sobre el contador, pero el sitio ya tiene
                            decidido dónde responde una tarjeta de ciudad y una
                            sola cosa por tarjeta: dos acentos compitiendo es
                            lo que hace que un hover se lea como un parpadeo. */}
                        <h3 className="font-display text-display-s font-semibold text-ink transition-colors duration-(--duration-fast) group-hover:text-brand">
                          {city.name}
                        </h3>
                        {/* `font-mono text-mono`: es el registro con el que
                            todo el sitio escribe un recuento de estaciones
                            —ver las tarjetas de `/red`—. Un dato técnico en
                            texto corrido rompe ese lenguaje. */}
                        <p className="mt-1.5 font-mono text-mono text-ink-2">
                          <CountUp value={operational} />{" "}
                          {t(operational === 1 ? units.station : units.stations, lang)}{" "}
                          {t(home.network.live, lang)}
                          {operational !== count ? (
                            <span className="text-ink-3"> · {count} total</span>
                          ) : null}
                        </p>
                      </div>

                      {/* Botón circular con flecha. Es la afordancia de la
                          tarjeta, así que va marcado como decorativo: el
                          enlace ya lo envuelve todo y anunciarlo otra vez
                          duplicaría el objetivo para un lector de pantalla. */}
                      <span
                        aria-hidden="true"
                        className="grid size-10 shrink-0 place-items-center rounded-(--radius-pill) border border-line-control text-ink transition-[transform,background-color,border-color] duration-(--duration-fast) ease-(--ease-overshoot) group-hover:translate-x-0.5 group-hover:border-brand group-hover:text-brand motion-reduce:group-hover:translate-x-0"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>

            {/* ── MÉTRICAS ───────────────────────────────────────────────
                Un solo contenedor horizontal con hairlines: registro de ficha
                técnica, no de eslogan. Sin relleno propio —el muestreo del
                mockup da el mismo tono que el fondo—, así que solo el borde lo
                define.

                Los anchos son NATURALES y no tres columnas iguales: en la
                referencia la celda de conectores es visiblemente más ancha
                porque su contenido lo es. `flex` con `divide-x` lo da solo.
                Por debajo de `sm` se apila con hairlines horizontales, que a
                390px es la única forma de que "GB-T · CCS1 · CCS2" no se
                parta. */}
            <dl className="mt-3 flex flex-col gap-px overflow-hidden rounded-(--radius-structural) border border-line bg-line sm:flex-row sm:flex-wrap">
              {cifras.map((c) => (
                <div key={c.etiqueta} className="grow bg-canvas px-4 py-4">
                  {/* `gap-px` sobre `bg-line` en lugar de `divide-x`: es la
                      técnica con la que el sitio dibuja una rejilla de
                      hairlines —ver la lista de ciudades de `/red`— y además
                      se comporta bien cuando una celda pasa a otra fila.

                      `grow` reparte el sobrante entre las tres: sin él las
                      celdas medían lo que su contenido y quedaba una franja
                      vacía de ~20px contra el borde derecho, con el hairline
                      del fondo asomando. Las proporciones naturales se
                      conservan —conectores sigue siendo la más ancha—, solo
                      que ahora llenan el contenedor.

                      `tracking-wider` y no un valor suelto: la etiqueta era el
                      elemento que forzaba el reparto, y 0.14em literales
                      además estaban fuera de los tokens. */}
                  <dt className="font-mono text-mono uppercase tracking-wider text-ink-3">
                    {c.etiqueta}
                  </dt>
                  {/* El VALOR no se parte nunca: "22–80 / kW" y
                      "GB-T · CCS1 · / CCS2" son las dos formas de que un dato
                      deje de leerse como un dato. La etiqueta sí puede caer a
                      dos líneas en los anchos más justos —es descripción, no
                      cifra— y `flex-wrap` deja que una celda entera pase a una
                      segunda fila antes que desbordar. */}
                  <dd className="mt-1.5 whitespace-nowrap font-display text-display-s font-semibold text-ink">
                    {c.valor}
                  </dd>
                </div>
              ))}
            </dl>

            {/* ── CTA Y MICROCOPY ────────────────────────────────────────
                En una sola fila, como la referencia. El microcopy NO es un
                segundo CTA: no enlaza a nada y su punto de marca es el único
                acento de color de la fila, así que no compite. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="light" size="m" arrow href={href(lang, routes.red)}>
                {t(actions.seeNetwork, lang)}
              </Button>
              {/* Mono en versales: es como el sitio escribe una nota al lado
                  de un CTA —ver el pie de foto del beat 2, "NUEVA ESTACIÓN ·
                  MEDELLÍN"—. La referencia la trae en texto corrido, pero esa
                  ranura ya tiene registro decidido y dos secciones vecinas
                  hablando distinto en el mismo sitio es lo que se nota. */}
              <p className="flex items-center gap-2 font-mono text-mono uppercase tracking-wider text-ink-3">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
                {t(home.network.moreCities, lang)}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              DERECHA · AQUÍ VA EL RENDER DEL CARGADOR
              ══════════════════════════════════════════════════════════════
              Hueco estructural, deliberadamente vacío: sin fondo, sin borde,
              sin etiqueta y sin contenido, para que la sección se lea como una
              composición con aire a la derecha y no como una caja esperando
              una foto.

              CUANDO LLEGUE EL ASSET:
              1. Registrarlo en `content/data/media.ts` con su función
                 narrativa, como el resto (§33). Formato vertical.
              2. Sustituir este `div` por el `<Media>` correspondiente con
                 `className="h-full w-full object-contain"`.
              3. Envolverlo en `<Flow>` — ver la nota de la cabecera: un objeto
                 grande y vertical dentro de un marco fijo es el caso para el
                 que existe esa primitiva, y este beat se quedó sin su momento
                 de profundidad al perder la fotografía de fondo.
              Nada de eso cambia la posición, el ancho ni la jerarquía de la
              columna izquierda.

              `hidden lg:block`: en móvil y tablet no reserva nada. Un hueco
              vacío de 500px en un teléfono es scroll muerto, y hasta que el
              render exista no hay nada que enseñar ahí. */}
          <div
            aria-hidden="true"
            data-charger-visual=""
            className="hidden lg:block lg:min-h-[32rem]"
          />
        </div>
      </Container>
    </Section>
  );
}
