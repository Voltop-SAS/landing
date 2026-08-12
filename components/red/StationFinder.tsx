"use client";

import { useMemo, useState, useId } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { red } from "@/content/copy/red";
import { states, units } from "@/content/copy/common";
import type { Station } from "@/content/data/stations";
import type { City } from "@/content/data/cities";
import { StatusBadge } from "@/components/ui/data";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * BUSCADOR DE ESTACIONES · isla de cliente
 * Ver docs/MASTER-PROJECT-DEFINITION.md §14.
 *
 * /red es una SUPERFICIE DE PRODUCTO: su trabajo es encontrar una estación.
 * Antes los filtros eran `<span>` decorativos y el "mapa" un SVG estático que
 * prometía tiempo real — la página núcleo del journey B2C no funcionaba.
 * Ahora la búsqueda y los filtros operan de verdad sobre la colección.
 *
 * Los datos llegan como props desde el Server Component: la isla de cliente es
 * solo la interacción, no la obtención de datos.
 */

type Props = { lang: Locale; stations: Station[]; cities: City[] };

const POWER_STEPS = [0, 50, 100, 150];

export function StationFinder({ lang, stations, cities }: Props) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [connector, setConnector] = useState("");
  const [minPower, setMinPower] = useState(0);
  const [onlyLive, setOnlyLive] = useState(false);
  const searchId = useId();

  const cityName = useMemo(
    () => (slug: string) => cities.find((c) => c.slug === slug)?.name ?? "",
    [cities]
  );

  const connectors = useMemo(
    () => Array.from(new Set(stations.flatMap((s) => s.connectors))).sort(),
    [stations]
  );

  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const results = useMemo(() => {
    return stations.filter((s) => {
      if (city && s.citySlug !== city) return false;
      if (connector && !s.connectors.includes(connector as Station["connectors"][number])) return false;
      if (minPower && s.powerKw < minPower) return false;
      if (onlyLive && s.status !== "operativa") return false;
      if (query) {
        const q = normalize(query);
        if (!normalize(`${s.name} ${cityName(s.citySlug)}`).includes(q)) return false;
      }
      return true;
    });
  }, [stations, query, city, connector, minPower, onlyLive, cityName]);

  const hasFilters = Boolean(query || city || connector || minPower || onlyLive);

  const clearAll = () => {
    setQuery("");
    setCity("");
    setConnector("");
    setMinPower(0);
    setOnlyLive(false);
    track("red_filtros_limpiados");
  };

  const onFilter = (tipo: string, valor: string | number | boolean) =>
    track("red_filtro_aplicado", { tipo, valor: String(valor) });

  return (
    <div>
      {/* Búsqueda */}
      <div className="border-y border-line py-6">
        <label htmlFor={searchId} className="block font-mono text-mono uppercase tracking-wider text-ink-3">
          {t(red.search.label, lang)}
        </label>
        <div className="mt-3 flex items-center gap-3">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={(e) => e.target.value && track("red_buscar", { termino: e.target.value })}
            placeholder={t(red.search.placeholder, lang)}
            autoComplete="off"
            className="min-h-12 w-full border-0 border-b border-line bg-transparent pb-2 font-display text-display-s text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
          />
        </div>
      </div>

      {/* Filtros — controles reales, no decoración */}
      <div className="flex flex-col gap-6 border-b border-line py-6 lg:flex-row lg:items-end lg:gap-10">
        <FilterGroup label={t(red.filters.city, lang)}>
          <Chip active={!city} onClick={() => { setCity(""); onFilter("ciudad", "todas"); }}>
            {t(red.filters.all, lang)}
          </Chip>
          {cities.map((c) => (
            <Chip key={c.slug} active={city === c.slug} onClick={() => { setCity(c.slug); onFilter("ciudad", c.slug); }}>
              {c.name}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label={t(red.filters.connector, lang)}>
          <Chip active={!connector} onClick={() => { setConnector(""); onFilter("conector", "todos"); }}>
            {t(red.filters.allM, lang)}
          </Chip>
          {connectors.map((c) => (
            <Chip key={c} active={connector === c} onClick={() => { setConnector(c); onFilter("conector", c); }}>
              {c}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label={t(red.filters.power, lang)}>
          {POWER_STEPS.map((p) => (
            <Chip key={p} active={minPower === p} onClick={() => { setMinPower(p); onFilter("potencia", p); }}>
              {p === 0 ? t(red.filters.allM, lang) : `${p}+ kW`}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label={t(red.filters.availability, lang)}>
          <Chip active={onlyLive} onClick={() => { setOnlyLive((v) => !v); onFilter("disponibilidad", !onlyLive); }} pressed>
            {t(red.filters.availability, lang)}
          </Chip>
        </FilterGroup>
      </div>

      {/* Recuento — anunciado a lectores de pantalla */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <p role="status" aria-live="polite" className="font-mono text-mono text-ink-2">
          {results.length}{" "}
          {results.length === 1 ? t(red.filters.resultsOne, lang) : t(red.filters.resultsMany, lang)}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex min-h-11 items-center text-body-s text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
          >
            {t(red.filters.clear, lang)}
          </button>
        )}
      </div>

      {/* Resultados — el encabezado evita un salto de nivel (h1 → h3) */}
      <h2 className="sr-only">{t(red.filters.resultsMany, lang)}</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((s) => (
            <li key={s.slug}>
              <Link
                href={href(lang, routes.station(s.slug))}
                onClick={() => track("estacion_vista", { slug: s.slug, origen: "buscador" })}
                className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 md:grid-cols-[1.5fr_1fr_1.2fr_auto] md:items-center"
              >
                <div>
                  <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-body-s text-ink-3">{cityName(s.citySlug)}</p>
                </div>
                <p className="font-mono text-mono text-ink-2">
                  {s.powerKw} kW · {s.points} {t(units.pointsShort, lang)}
                </p>
                <p className="font-mono text-mono text-ink-3">{s.connectors.join(" / ")}</p>
                <StatusBadge status={s.status} lang={lang} className="justify-self-start md:justify-self-end" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-b border-line py-16 text-center">
          <h3 className="font-display text-display-s font-semibold text-ink">{t(states.noResults.title, lang)}</h3>
          <p className="mx-auto mt-3 max-w-[46ch] text-body-s text-ink-2">{t(states.noResults.body, lang)}</p>
          <div className="mt-7">
            <Button variant="ghost" onClick={clearAll}>
              {t(states.noResults.action, lang)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 font-mono text-mono uppercase tracking-wider text-ink-3">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * Chip de filtro FUNCIONAL. La prohibición del sistema es a los chips
 * decorativos sin función; estos accionan el filtrado y declaran su estado.
 */
function Chip({
  children,
  active,
  onClick,
  pressed,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed ? active : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-(--radius-pill) border px-4 text-body-s transition-colors",
        active
          ? "border-brand/60 bg-brand/12 text-ink"
          : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
