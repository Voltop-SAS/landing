import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { getStations, getCity } from "@/lib/data";
import { Section, Container, SectionHeading } from "@/components/ui/layout";
import { StatusBadge } from "@/components/ui/data";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * BEAT 3 · LA RED — Intensidad: Media · Registro: Silencio · Espacio: tight
 * ESTRUCTURA: índice ancho, denso y puramente tipográfico. SIN media.
 *
 * Contraste deliberado: llega después de dos beats a sangre completa, así que
 * su fuerza es la precisión, no la imagen. Usa el lenguaje de ficha técnica
 * (mono + hairlines) que la auditoría identificó como lo más propio de Voltop.
 *
 * Antes eran dos columnas con foto y dos CTAs al mismo destino: se eliminó la
 * redundancia y la repetición estructural con el beat siguiente.
 */
export function NetworkIndex({ lang }: { lang: Locale }) {
  const stations = getStations();

  return (
    <Section id="red" space="tight" ariaLabelledby="red-title">
      {/* `content`, no `wide`. Era el peor descuadre del sitio: una tabla de
          DATOS en el contenedor de sangrado, con el borde izquierdo 100px a la
          izquierda del header y del resto de la página. `wide` se reserva a
          media (ver `Container`). De paso, las columnas dejan de repartirse en
          1500px y la información se lee junta en lugar de dispersa. */}
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="red-title" kicker={t(home.network.eyebrow, lang)}>
            {t(home.network.title, lang)}
          </SectionHeading>
          <p className="measure-narrow text-body text-ink-2">{t(home.network.lead, lang)}</p>
        </div>

        {/* Índice de estaciones — cada fila es navegable en su totalidad */}
        <div className="mt-12">
          <div className="hidden grid-cols-[1.6fr_1fr_0.8fr_0.9fr] gap-6 border-b border-line pb-3 font-mono text-mono uppercase tracking-wider text-ink-3 md:grid">
            <span>{t(home.network.columns.station, lang)}</span>
            <span>{t(home.network.columns.city, lang)}</span>
            <span>{t(home.network.columns.power, lang)}</span>
            <span>{t(home.network.columns.status, lang)}</span>
          </div>

          <ul>
            {stations.map((s, i) => {
              const city = getCity(s.citySlug);
              return (
                <Reveal as="li" key={s.slug} delay={i * 0.04} y={12}>
                  <Link
                    href={href(lang, routes.station(s.slug))}
                    className="group grid grid-cols-2 items-baseline gap-x-6 gap-y-1 border-b border-line py-5 transition-colors hover:bg-surface-1 md:grid-cols-[1.6fr_1fr_0.8fr_0.9fr] md:py-6"
                  >
                    <span className="col-span-2 font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand md:col-span-1">
                      {s.name}
                    </span>
                    <span className="text-body-s text-ink-2">{city?.name}</span>
                    <span className="font-mono text-mono text-ink-2">{s.powerKw} kW</span>
                    <span className="justify-self-start md:justify-self-auto">
                      <StatusBadge status={s.status} lang={lang} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <div className="mt-10">
          <Button variant="ghost" arrow href={href(lang, routes.red)}>
            {t(actions.seeNetwork, lang)}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
