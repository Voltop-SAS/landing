import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isLocale, t, type Locale } from "@/lib/i18n/config";
import { href, routes, absoluteUrl } from "@/lib/i18n/routes";
import { red, city as cityCopy } from "@/content/copy/red";
import { units, a11y } from "@/content/copy/common";
import { getCities, getCity, getStationsByCity } from "@/lib/data";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { StatusBadge } from "@/components/ui/data";
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: Promise<{ lang: string; ciudad: string }> };

/**
 * /RED/[CIUDAD] · cobertura local.
 *
 * Cada ciudad es una landing de búsqueda local ("cargador eléctrico Medellín"):
 * el canal de adquisición B2C más barato del proyecto (§29).
 * Añadir una ciudad al dataset genera esta ruta automáticamente.
 */
export function generateStaticParams() {
  return locales.flatMap((lang) => getCities().map((c) => ({ lang, ciudad: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ciudad } = await params;
  if (!isLocale(lang)) return {};
  const city = getCity(ciudad);
  if (!city) return {};

  const path = routes.city(city.slug);
  return {
    title: `${t(cityCopy.metaTitlePattern, lang)} ${city.name}`,
    description: t(city.intro, lang),
    alternates: {
      canonical: absoluteUrl(lang, path),
      languages: { es: absoluteUrl("es", path), en: absoluteUrl("en", path), "x-default": absoluteUrl("es", path) },
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { lang: raw, ciudad } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const city = getCity(ciudad);
  if (!city) notFound();

  const stations = getStationsByCity(city.slug);
  const others = getCities().filter((c) => c.slug !== city.slug);

  return (
    <>
      <Section space="none" className="pb-6 pt-32 md:pt-40">
        <Container>
          <nav aria-label={t(a11y.breadcrumb, lang)} className="font-mono text-mono text-ink-3">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={href(lang, routes.red)}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                >
                  {t(red.hero.eyebrow, lang)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-2">{city.name}</li>
            </ol>
          </nav>

          <Eyebrow className="mt-8">{t(cityCopy.eyebrow, lang)}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-ink">
            {t(cityCopy.titlePrefix, lang)} {city.name}
          </h1>
          <p className="mt-6 measure text-body-l text-ink-2">{t(city.intro, lang)}</p>
        </Container>
      </Section>

      <Section space="base" ariaLabelledby="estaciones-ciudad">
        <Container>
          <h2 id="estaciones-ciudad" className="font-mono text-mono uppercase tracking-wider text-ink-3">
            {t(cityCopy.stationsHere, lang)}
          </h2>

          <ul className="mt-6">
            {stations.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 0.05} y={12}>
                <Link
                  href={href(lang, routes.station(s.slug))}
                  className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 text-body-s text-ink-3">{t(s.address, lang)}</p>
                  </div>
                  <p className="font-mono text-mono text-ink-2">
                    {s.powerKw} kW · {s.points} {t(units.pointsShort, lang)}
                  </p>
                  <p className="font-mono text-mono text-ink-3">{s.connectors.join(" / ")}</p>
                  <StatusBadge status={s.status} lang={lang} className="justify-self-start md:justify-self-end" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {others.length > 0 && (
        <Section space="tight" className="border-t border-line">
          <Container>
            <h2 className="font-mono text-mono uppercase tracking-wider text-ink-3">{t(cityCopy.otherCities, lang)}</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href(lang, routes.city(c.slug))}
                    className="inline-flex min-h-11 items-center rounded-(--radius-pill) border border-line px-5 text-body-s text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
