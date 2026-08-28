import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isLocale, t, type Locale } from "@/lib/i18n/config";
import { href, routes, absoluteUrl, SITE_URL } from "@/lib/i18n/routes";
import { red, station as stationCopy } from "@/content/copy/red";
import { actions, a11y, units } from "@/content/copy/common";
import { getStations, getStation, getCity, getStationsByCity } from "@/lib/data";
import { Section, Container, Eyebrow, SectionHeading } from "@/components/ui/layout";
import { StatusBadge, SpecList, PendingTag } from "@/components/ui/data";
import { MediaPending } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { DirectionsButton } from "@/components/red/DirectionsButton";
import { media } from "@/content/data/media";

type Props = { params: Promise<{ lang: string; slug: string }> };

/**
 * /RED/ESTACION/[SLUG] · ficha de estación.
 *
 * Generada íntegramente desde datos: añadir una estación al dataset crea la
 * página, su metadata y sus datos estructurados. Cero trabajo manual (§30).
 */
/**
 * PARAMS CERRADOS. `notFound()` lanzado desde una página no resuelve ningún
 * boundary en Next 16 con este árbol de rutas: sirve un documento de error con
 * el body VACÍO y el 404 con marca solo aparece tras hidratar, así que un
 * crawler ve una página en blanco.
 *
 * Con `dynamicParams = false` el rechazo lo hace el ROUTER: un slug que no está
 * en `generateStaticParams` devuelve 404 antes de renderizar nada, y ese 404 sí
 * usa `app/not-found.tsx`. Es además lo correcto para rutas generadas desde
 * datos: un slug inexistente no debe renderizarse bajo demanda.
 *
 * No cuesta flexibilidad: el sitio ya es estático por completo y cualquier
 * cambio en el dataset exige un build.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getStations().map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const s = getStation(slug);
  if (!s) return {};
  const city = getCity(s.citySlug);
  const path = routes.station(s.slug);

  return {
    title: `${s.name}${city ? ` · ${city.name}` : ""}`,
    description:
      lang === "es"
        ? `Estación de carga Voltop en ${city?.name}: ${s.powerKw} kW, ${s.points} puntos y conectores ${s.connectors.join(", ")}.`
        : `Voltop charging station in ${city?.name}: ${s.powerKw} kW, ${s.points} points and ${s.connectors.join(", ")} connectors.`,
    alternates: {
      canonical: absoluteUrl(lang, path),
      languages: { es: absoluteUrl("es", path), en: absoluteUrl("en", path), "x-default": absoluteUrl("es", path) },
    },
  };
}

export default async function StationPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const s = getStation(slug);
  if (!s) notFound();
  const city = getCity(s.citySlug);
  const nearby = getStationsByCity(s.citySlug).filter((n) => n.slug !== s.slug);

  /* Sin coordenadas confirmadas, "cómo llegar" abre una búsqueda por dirección.
     Es honesto y funciona; cuando lleguen las coordenadas, el enlace mejora solo. */
  const directions = s.geo
    ? `https://www.google.com/maps/dir/?api=1&destination=${s.geo.lat},${s.geo.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${t(s.address, lang)}`)}`;

  const specs = [
    { label: t(stationCopy.specs.power, lang), value: `${s.powerKw} kW`, tone: "number" as const },
    { label: t(stationCopy.specs.points, lang), value: `${s.points}`, tone: "number" as const },
    { label: t(stationCopy.specs.connectors, lang), value: s.connectors.join(" · "), tone: "text" as const },
    { label: t(stationCopy.specs.hours, lang), value: t(s.hours, lang), tone: "text" as const },
  ];

  /* Datos estructurados: cada estación es un activo de búsqueda local (§29). */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EVChargingStation",
    name: `${s.name} — Voltop`,
    url: absoluteUrl(lang, routes.station(s.slug)),
    address: { "@type": "PostalAddress", streetAddress: t(s.address, lang), addressLocality: city?.name, addressCountry: "CO" },
    ...(s.geo ? { geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng } } : {}),
    openingHours: t(s.hours, lang),
    provider: { "@type": "Organization", name: "Voltop", url: SITE_URL },
    amenityFeature: s.services.map((sv) => ({ "@type": "LocationFeatureSpecification", name: t(sv, lang), value: true })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section space="none" className="pb-8 pt-32 md:pt-40">
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
              {city && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={href(lang, routes.city(city.slug))}
                      className="inline-flex min-h-11 items-center transition-colors hover:text-ink"
                    >
                      {city.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-2">{s.name}</li>
            </ol>
          </nav>

          <Eyebrow className="mt-8">{t(stationCopy.eyebrow, lang)}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h1 className="font-display text-display-xl font-semibold text-ink">{s.name}</h1>
            <StatusBadge status={s.status} lang={lang} />
          </div>
          <p className="mt-4 text-body-l text-ink-2">{t(s.address, lang)}</p>
        </Container>
      </Section>

      {/* Media propia de la estación. El dataset aún no trae archivos (§32).
          Va en `content`, no en `wide`: sobresalía 100px a la izquierda del
          titular. El sangrado se reserva a media que lo justifique. */}
      <Section space="none" className="pb-(--spacing-section-tight)">
        <Container>
          {/* `MediaPending` no impone forma propia, así que aquí el recorte sí
              va por `className`: no hay clase nativa con la que competir. */}
          <MediaPending
            asset={{ ...media.detalleCarga, alt: { es: `Fotografía de la estación ${s.name}`, en: `Photo of the ${s.name} station` } }}
            lang={lang}
            className="aspect-[21/9] w-full"
          />
        </Container>
      </Section>

      <Section space="tight">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr]">
            <div>
              <SectionHeading size="m">{t(stationCopy.specs.title, lang)}</SectionHeading>
              {/* 2×2, no 4×1. Cuatro columnas dentro de la columna de contenido
                  dejaban 128px útiles por celda: el horario envolvía en tres
                  líneas a CUALQUIER ancho, incluido 1440. */}
              <SpecList items={specs} className="mt-6" />

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                    {t(stationCopy.specs.pricing, lang)}
                  </p>
                  {s.pricing ? (
                    <p className="font-display text-display-s text-ink">
                      {s.pricing.perKwh} {s.pricing.currency}/kWh
                    </p>
                  ) : (
                    <PendingTag>{t(stationCopy.pendingPricingTag, lang)}</PendingTag>
                  )}
                </div>
                {!s.pricing && (
                  <p className="mt-2 text-caption text-ink-3">{t(stationCopy.pendingPricing, lang)}</p>
                )}
              </div>

              {s.services.length > 0 && (
                <div className="mt-14">
                  <SectionHeading size="s">{t(stationCopy.services, lang)}</SectionHeading>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.services.map((sv, i) => (
                      <li
                        key={i}
                        className="rounded-(--radius-pill) border border-line px-4 py-2 text-body-s text-ink-2"
                      >
                        {t(sv, lang)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside>
              <SectionHeading size="s">{t(stationCopy.location, lang)}</SectionHeading>
              <p className="mt-5 text-body-s text-ink-2">{t(s.address, lang)}</p>
              <div className="mt-6 flex flex-col gap-3">
                {/* `lang` no es decorativo: habilita el aviso de "se abre en
                    una pestaña nueva". Y `estacion_como_llegar` es la conversión
                    final del journey B2C y no se estaba midiendo (§31). */}
                <DirectionsButton lang={lang} href={directions} slug={s.slug} />
              </div>
              {!s.geo && (
                <p className="mt-4 text-caption text-ink-3">{t(stationCopy.pendingGeo, lang)}</p>
              )}
            </aside>
          </div>
        </Container>
      </Section>

      {nearby.length > 0 && (
        <Section space="tight" className="border-t border-line">
          <Container>
            <SectionHeading size="m">{t(stationCopy.nearby, lang)}</SectionHeading>
            <ul className="mt-8">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={href(lang, routes.station(n.slug))}
                    className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-5 transition-colors hover:bg-surface-1"
                  >
                    <span className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {n.name}
                    </span>
                    <span className="font-mono text-mono text-ink-2">
                      {n.powerKw} kW · {n.points} {t(units.pointsShort, lang)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="link" arrow href={href(lang, routes.red)}>
                {t(actions.backToNetwork, lang)}
              </Button>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
