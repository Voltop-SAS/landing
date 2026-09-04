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
        {/* ── LAS DOS MITADES, SOBRE EL RIEL ──────────────────────────────
            El reparto 56/44 no es estético: está CALCULADO para que el render
            llene su columna sin dejar sobrante.

            El render es un objeto de 2:3 servido en `contain`, así que su ancho
            lo decide la altura disponible. Con la columna al 48% sobraban 70px
            que había que poner en algún lado, y las dos opciones eran malas:
            hacia el texto lo separaba de él, hacia el borde dejaba un hueco a
            la derecha. Al 44% —486px a 1440— el objeto ocupa su columna EXACTA
            y no hay sobrante que colocar.

            Y vuelve al riel. Antes se salía hasta el borde de la ventana, y eso
            arreglaba una cosa creando otra: era la única sección del sitio cuyo
            contenido escapaba del contenedor, así que se leía como un bloque
            ajeno. Medido a 1440, ahora los márgenes son 148px a la izquierda y
            162 a la derecha: la composición está centrada en el layout como el
            resto de las secciones.

            SIN ALTURA FORZADA. Hubo una versión con `min-h` en la rejilla para
            que el objeto llenara 486px de ancho, y el precio era que la sección
            medía 874px con 575 de contenido: **300px de aire que ninguna otra
            sección del sitio tiene**, y eso era lo que la sacaba del ritmo de
            la página. La escala del objeto no vale ese precio.

            Ahora la fila mide lo que mide el texto, y el objeto —servido en
            `contain`— mide exactamente lo mismo de alto. Ese es el vínculo que
            faltaba: el equipo y el bloque de contenido comparten su span
            vertical al píxel, arriba y abajo, en lugar de que uno sobresalga
            del otro. Dos elementos que empiezan y terminan juntos se leen como
            una composición; uno flotando junto al otro, no.

            El reparto 65/35 sale de ahí: con el contenido más ancho el texto
            envuelve menos, la fila baja de alto y el objeto se estrecha en
            proporción. La columna está dimensionada al objeto resultante para
            que no sobre aire, igual que antes. */}
        <div className="grid items-stretch gap-14 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-10">
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
                390px es la única forma de que "GB/T · CCS1 · CCS2" no se
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
                      "GB/T · CCS1 · / CCS2" son las dos formas de que un dato
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
            {/* `ghost`, la misma variante que el CTA del beat 2. La referencia
                trae un botón de relleno claro, pero eso obligaba a añadir una
                quinta variante al sistema para un solo botón, y un lenguaje de
                botones con una excepción deja de ser un lenguaje. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="ghost" arrow href={href(lang, routes.red)}>
                {t(actions.seeNetwork, lang)}
              </Button>
              {/* Mono en versales: es como el sitio escribe una nota al lado
                  de un CTA —ver el pie de foto del beat 2, "NUEVA ESTACIÓN ·
                  MEDELLÍN"—. La referencia la trae en texto corrido, pero esa
                  ranura ya tiene registro decidido y dos secciones vecinas
                  hablando distinto en el mismo sitio es lo que se nota.

                  SIN PUNTO DE COLOR. La referencia trae uno verde delante y se
                  retiró: no existe en ninguna otra parte del sitio, así que era
                  un adorno de una sola aparición — justo lo que §12 llama un
                  chip decorativo sin función. El pie de foto del beat 2 dice lo
                  suyo sin ninguno. */}
              <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.network.moreCities, lang)}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              EL RENDER DEL CARGADOR
              ══════════════════════════════════════════════════════════════
              Entregado el 2026-09-04 y colocado en el hueco que esta sección
              ya tenía reservado: no hubo que mover ni un píxel de la columna
              izquierda, que era exactamente el objetivo de reservarlo.

              SIN CAJA. El PNG viene con fondo transparente (comprobado: alfa 0
              en los bordes), así que el equipo se apoya directamente sobre el
              `canvas` de la sección. Nada de fondo propio, borde ni sombra: la
              mitad derecha sigue siendo aire con un objeto dentro, que es lo
              que hace que las dos mitades se lean como UNA composición y no
              como "texto | foto".

              `object-contain` y no `cover`: un cargador recortado por arriba o
              por los lados deja de ser el retrato de un equipo.

              SIN FLOW, Y ESO SE PROBÓ. Parecía el sitio ideal para el
              parallax —un objeto grande y vertical, y este beat se había
              quedado sin momento de profundidad al perder la fotografía de
              fondo— pero FLOW RECORTA POR DISEÑO: su marco clipa un interior
              un 24% más alto, y con `object-contain` eso cortaba el cargador
              por arriba y por abajo. Medido: 135px de equipo desaparecidos.
              Un objeto recortado deja de ser el retrato de un objeto, así que
              el render se queda quieto y entero. La regla general quedó
              anotada en `Flow`, para que nadie vuelva a intentarlo.

              VUELVE AL RIEL, Y ESO ES LA CORRECCIÓN DEFINITIVA. Estuvo un
              momento saliéndose hasta el borde de la ventana: arreglaba el
              problema de las dos cajas, pero creaba otro — era la única
              sección del sitio cuyo contenido escapaba del contenedor, así
              que se leía como un bloque ajeno, y encima dejaba un hueco de
              ~200px contra el borde porque un objeto de 2:3 nunca llena una
              columna tan ancha.

              Ahora vive en su celda del riel, y la celda está dimensionada al
              objeto: al 44% del ancho útil el render ocupa su columna EXACTA y
              no hay sobrante que repartir. Ni se separa del texto ni deja
              hueco a la derecha, que eran las dos quejas y estaban en tensión.

              En móvil pasa DEBAJO del contenido con su propia altura: `Media
              fill` necesita un padre con medida. */}
          <div
            data-charger-visual=""
            aria-hidden="true"
            className="mx-auto h-[26rem] w-full max-w-sm sm:h-[32rem] lg:mx-0 lg:h-full lg:max-w-none"
          >
            <Media
              asset={media.renderCargador}
              lang={lang}
              fill
              sizes="(min-width: 1024px) 44vw, 90vw"
              className="h-full w-full"
              fit="contain"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
