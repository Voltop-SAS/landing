import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions, units } from "@/content/copy/common";
import { media } from "@/content/data/media";
import { getCitiesWithStations, getNetworkSummary } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Media } from "@/components/ui/Media";
import { Flow } from "@/components/ui/Flow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

/**
 * BEAT 3 · LA RED
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12, §14 y §33.
 *
 * ── QUÉ HABÍA ANTES Y POR QUÉ SE FUE ─────────────────────────────────────
 * Un índice tipográfico: tabla de estaciones con columnas de ciudad, potencia
 * y estado. Estaba bien resuelto, pero repetía en la Home lo que /red hace
 * mejor y con filtros. §14 dice que la Home PRESENTA y las internas PROFUNDIZAN;
 * listar el inventario aquí invertía esa relación y obligaba a mantener la
 * misma tabla en dos sitios.
 *
 * Ahora la Home responde a otra pregunta —"¿esto ya existe y llega donde yo
 * estoy?"— y deja el inventario a /red.
 *
 * ── LAS CIFRAS NO ESTÁN ESCRITAS ─────────────────────────────────────────
 * Puntos, potencias, ciudades y conectores se CALCULAN desde el dataset en
 * `getNetworkSummary()`. Una cifra escrita a mano deja de ser verdad en cuanto
 * se añade una estación, y §33 prohíbe inventar cifras: la forma más segura de
 * no inventarlas es no poder escribirlas. Añadir un registro actualiza esta
 * sección sola.
 *
 * ── POR QUÉ FOTO DE SUELO Y NO OTRA COSA ─────────────────────────────────
 * `estacionInfraestructura` llevaba registrada desde el principio y sin usar:
 * material real de Voltop parado. Va como SUELO muy atenuado, no como sujeto —
 * el sujeto son los datos. Así no repite la estructura del beat anterior, que
 * es un vídeo revelado por scroll dentro de un marco contenido, ni la del
 * Hero, que es fotografía a sangre con el titular encima.
 *
 * El vidrio (`.glass`) es el mismo material de la tarjeta de descarga: si el
 * sitio va a tener un lenguaje de superficie, tiene que repetirse o no es un
 * lenguaje.
 */
export function NetworkIndex({ lang }: { lang: Locale }) {
  const resumen = getNetworkSummary();
  const cobertura = getCitiesWithStations();

  const cifras: { etiqueta: string; valor: React.ReactNode }[] = [
    /* La única que cuenta es la que ES un número. "60–120 kW" y la lista de
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

  return (
    <Section id="red" space="base" className="relative isolate overflow-hidden" ariaLabelledby="red-title">
      {/* Suelo. `aria-hidden` porque no aporta información: lo que hay que leer
          son los datos de encima. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* FLOW: el suelo pertenece a otro plano. El marco no se mueve —los
            velos y la retícula de encima siguen clavados—, solo la fotografía
            dentro de él. Es lo que separa "una foto de fondo" de "una sección
            con profundidad", y es el único movimiento de material de este beat:
            las cifras y las specs de la red no se animan nunca. */}
        <Flow className="absolute inset-0" amount={5}>
          <Media
            asset={media.estacionInfraestructura}
            lang={lang}
            fill
            sizes="100vw"
            quality={70}
            position="object-[50%_45%]"
            className="h-full w-full"
          />
        </Flow>
        {/* Dos velos: uno plano que fija el piso de contraste y otro vertical
            que funde la sección con las vecinas para que la foto no aparezca
            recortada por una línea dura. */}
        <div className="absolute inset-0 bg-canvas/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
      </div>

      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t(home.network.eyebrow, lang)}</Eyebrow>
            <h2
              id="red-title"
              className="mt-4 max-w-[14ch] font-display text-display-l font-semibold text-balance text-ink"
            >
              {t(home.network.title, lang)}
            </h2>
          </div>
          <p className="measure-narrow text-body text-ink-2">{t(home.network.lead, lang)}</p>
        </div>

        {/* Ciudades: la respuesta a "¿llega donde yo estoy?". Una tarjeta por
            ciudad, no una por estación — eso es el inventario y vive en /red. */}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {cobertura.map(({ city, count, operational }, i) => (
            <Reveal as="li" key={city.slug} index={i} level="expressive">
              <Link
                href={href(lang, routes.city(city.slug))}
                className="glass press group relative flex h-full flex-col justify-between gap-14 rounded-(--radius-structural) p-7 sm:gap-20 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-display-m font-semibold text-ink transition-colors group-hover:text-brand">
                    {city.name}
                  </h3>
                  <span className="mt-2 font-mono text-mono text-ink-3">{city.region}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <p className="font-mono text-mono text-ink-2">
                    <CountUp value={operational} />{" "}
                    {t(operational === 1 ? units.station : units.stations, lang)}{" "}
                    {t(home.network.live, lang)}
                    {operational !== count ? <span className="text-ink-3"> · {count} total</span> : null}
                  </p>
                  <span
                    aria-hidden="true"
                    className="text-ink-3 transition-transform duration-(--duration-fast) ease-(--ease-overshoot) group-hover:translate-x-1 group-hover:text-brand"
                  >
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* Ficha técnica de la red en una línea. Registro de dato, no de
            eslogan: mono, hairlines y cero adjetivos. */}
        <dl className="mt-4 grid gap-px overflow-hidden rounded-(--radius-structural) border border-line bg-line sm:grid-cols-3">
          {cifras.map((c) => (
            <div key={c.etiqueta} className="bg-canvas/60 px-7 py-6 backdrop-blur-sm">
              <dt className="font-mono text-mono uppercase tracking-[0.14em] text-ink-3">{c.etiqueta}</dt>
              <dd className="mt-2 font-display text-display-s font-semibold text-ink">{c.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10">
          <Button variant="ghost" arrow href={href(lang, routes.red)}>
            {t(actions.seeNetwork, lang)}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
