import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { formatDate } from "@/lib/dates";
import { novedades, novedadesInline } from "@/content/copy/novedades";
import { getLatestPosts, hasPage } from "@/lib/data";
import { Section, Container, SectionHeading } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * BEAT · LO ÚLTIMO DE LA RED
 *
 * ── POR QUÉ EXISTE EN LA HOME ─────────────────────────────────────────────
 * La entrada del menú sirve a quien YA viene buscando novedades, que es un
 * público pequeño. Este bloque se lo pone delante a quien no venía buscando y
 * debería verlo: un inversionista que aterriza aquí y ve tres hechos fechados
 * y recientes ya respondió su pregunta —¿esta compañía se mueve?— sin hacer
 * un solo clic. De los dos puntos de entrada, este hace el trabajo pesado.
 *
 * ── POSICIÓN Y RITMO ──────────────────────────────────────────────────────
 * Va entre el caso (beat de intensidad alta, full-bleed con texto encima) y la
 * cita de visión. Es deliberadamente el beat MÁS BAJO de la curva: tres filas
 * densas y nada más. Funciona como respiro antes del cierre, y su estructura
 * —registro cronológico— no coincide con la de ninguno de sus dos vecinos.
 *
 * No repite el índice denso del beat 3 por ser consecutivo a él: no lo es.
 *
 * ── LO QUE NO HACE ────────────────────────────────────────────────────────
 * No resuelve aquí lo que resuelve el destino. Tres entradas, sin resumen ni
 * media: la Home presenta, las internas profundizan. Y sin entradas no se
 * renderiza, en lugar de dejar un titular sobre un hueco.
 */
export async function NetworkNews({ lang }: { lang: Locale }) {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <Section id="novedades" space="tight" className="border-t border-line" ariaLabelledby="novedades-home">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="novedades-home" size="m" kicker={t(novedadesInline.home.eyebrow, lang)}>
            {t(novedadesInline.home.title, lang)}
          </SectionHeading>
          <div className="md:pb-1">
            <Button variant="link" arrow href={href(lang, routes.novedades)}>
              {t(novedadesInline.home.action, lang)}
            </Button>
          </div>
        </div>

        <ul className="mt-10 border-t border-line">
          {posts.map((post, i) => {
            const row = (
              <>
                <time
                  dateTime={post.date}
                  className="shrink-0 font-mono text-mono uppercase tracking-wider text-ink-3"
                >
                  {formatDate(post.date, lang)}
                </time>
                <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                  {t(post.title, lang)}
                </span>
                <span className="font-mono text-mono uppercase tracking-wider text-ink-3 md:justify-self-end">
                  {t(novedades.types[post.type], lang)}
                </span>
              </>
            );

            const grid =
              "grid items-baseline gap-x-8 gap-y-2 py-6 md:grid-cols-[9rem_1fr_auto]";

            return (
              <Reveal as="li" key={post.slug} delay={i * 0.06} y={12} className="border-b border-line">
                {hasPage(post) ? (
                  <Link href={href(lang, routes.post(post.slug))} className={`group ${grid}`}>
                    {row}
                  </Link>
                ) : (
                  <div className={grid}>{row}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
