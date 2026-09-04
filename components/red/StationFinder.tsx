'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { red } from '@/content/copy/red'
import { states, units } from '@/content/copy/common'
import type { Station } from '@/content/data/stations'
import { formatPowerKw } from '@/content/data/stations'
import type { City } from '@/content/data/cities'
import {
  filterStations,
  sortStations,
  hasCoordinates,
  distanceKm,
  type StationSort,
} from '@/lib/data'
import { StatusBadge } from '@/components/ui/data'
import { Button } from '@/components/ui/Button'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * BUSCADOR DE ESTACIONES · isla de cliente
 * Ver docs/MASTER-PROJECT-DEFINITION.md §14.
 *
 * /red es una SUPERFICIE DE PRODUCTO: su trabajo es encontrar una estación.
 * Los datos llegan como props desde el Server Component; la isla es solo la
 * interacción, no la obtención de datos.
 *
 * ── QUÉ CAMBIÓ EN ESTA REVISIÓN ───────────────────────────────────────────
 *
 * 1. LOS FILTROS SE COLAPSAN EN MÓVIL. Antes había que pasar título, lead,
 *    etiqueta, campo y cuatro grupos de chips —que envuelven a dos filas cada
 *    uno— para llegar al primer resultado: unos 700px de scroll en la tarea
 *    central del journey B2C. Ahora el resultado está a menos de un scroll y
 *    los filtros se abren cuando se quieren, con el recuento de activos a la
 *    vista para que colapsarlos no esconda estado.
 *
 * 2. HAY ORDEN. No existía. Nadie busca "Grand Hyatt": se busca la más
 *    potente, la que está operativa, o la más cercana. Los tres primeros
 *    criterios el dataset los puede responder hoy.
 *
 * 3. CERCANÍA ACTIVADA POR DATOS. Todas las estaciones tienen `geo: null`, así
 *    que el control de ubicación y la columna de distancia NO SE RENDERIZAN.
 *    No es código muerto: es el patrón del proyecto (`MetricRow` no pinta
 *    métricas sin validar, la franja de partners se omite sin logos) y se
 *    enciende solo cuando el dataset traiga coordenadas.
 *
 * 4. EL ESTADO VIVE EN LA URL. Un resultado filtrado se puede compartir. Se usa
 *    `history.replaceState` en lugar de `useSearchParams` a propósito: esta
 *    ruta es estática y `useSearchParams` la volvería dinámica.
 *
 * 5. EL FILTRADO YA NO SE DUPLICA. `filterStations` existía en la capa de datos
 *    y este componente reimplementaba la misma lógica, con su propia copia de
 *    `normalize`. Era justo la duplicación que la capa existe para evitar.
 * ──────────────────────────────────────────────────────────────────────────
 */

type Props = { lang: Locale; stations: Station[]; cities: City[] }

/**
 * ESCALONES DEL FILTRO DE POTENCIA — derivados del dataset, no escritos.
 *
 * Estaban fijos en `[0, 50, 100, 150]`. Con las potencias reales de la red
 * (22–80 kW), los escalones de 100+ y 150+ **no devolvían ninguna estación**:
 * dos de los cuatro controles del filtro estaban garantizados a dar cero
 * resultados, y §16 dice que ningún control es decorativo — si parece un
 * filtro, filtra.
 *
 * Derivarlos evita que vuelva a pasar. Se toman los máximos distintos de las
 * estaciones, se ordenan y se antepone el 0 ("todas"). Añadir una estación de
 * 150 kW hace aparecer ese escalón sola; retirarla lo quita.
 */
function calcularEscalones(stations: Station[]): number[] {
  const maximos = [...new Set(stations.map((s) => s.powerKw.max))].sort((a, b) => a - b)
  /* Si todas las estaciones tuvieran la misma potencia, el filtro no separaría
     nada: mejor un solo escalón "todas" que un control que no reduce. */
  return maximos.length > 1 ? [0, ...maximos] : [0]
}

type Coords = { lat: number; lng: number }
type GeoState = 'idle' | 'locating' | 'granted' | 'denied'

/** Claves de URL cortas y estables: son parte del enlace que la gente comparte. */
const PARAM = {
  q: 'q',
  city: 'ciudad',
  connector: 'conector',
  power: 'kw',
  live: 'live',
  sort: 'orden',
}

/**
 * Todo el criterio de búsqueda en UN objeto.
 *
 * Antes eran seis `useState` sueltos, y eso obligaba a seis `setState` para
 * hidratar desde la URL y a listar seis dependencias en cada `useMemo`. Con un
 * solo objeto, leer la URL es una asignación y el efecto de sincronía tiene una
 * única dependencia.
 */
type Criteria = {
  query: string
  city: string
  connector: string
  minPower: number
  onlyLive: boolean
  sort: StationSort
}

const EMPTY: Criteria = {
  query: '',
  city: '',
  connector: '',
  minPower: 0,
  onlyLive: false,
  sort: 'relevance',
}

/**
 * URL → criterio.
 *
 * Se aplica DESPUÉS de montar, no en el inicializador de `useState`. Esta ruta
 * es estática: el HTML se genera en build sin query string, así que leer la URL
 * en el primer render daría un criterio distinto al del servidor y React
 * registraría un desajuste de hidratación. El precio es un fotograma con la
 * lista completa antes de aplicar el enlace compartido; el beneficio es no
 * volver la ruta dinámica ni ensuciar la consola.
 *
 * LIMITACIÓN ASUMIDA: un enlace filtrado es COMPARTIBLE pero no indexable —
 * el HTML servido siempre trae la lista completa. La cobertura indexable por
 * ciudad ya la dan las rutas `/red/[ciudad]`, que era el motivo SEO original.
 */
function readCriteria(escalones: number[]): Criteria {
  const p = new URLSearchParams(window.location.search)
  const kw = Number(p.get(PARAM.power))
  const sort = p.get(PARAM.sort)
  return {
    query: p.get(PARAM.q) ?? '',
    city: p.get(PARAM.city) ?? '',
    connector: p.get(PARAM.connector) ?? '',
    minPower: escalones.includes(kw) ? kw : 0,
    onlyLive: p.get(PARAM.live) === '1',
    /* `distance` no se restaura de la URL: exige permiso de ubicación, y un
       enlace no puede concederlo. */
    sort: (['power', 'status', 'city'] as const).includes(sort as never)
      ? (sort as StationSort)
      : 'relevance',
  }
}

/** Criterio → URL. Claves cortas y estables: son el enlace que la gente comparte. */
function writeCriteria(c: Criteria) {
  const p = new URLSearchParams()
  if (c.query) p.set(PARAM.q, c.query)
  if (c.city) p.set(PARAM.city, c.city)
  if (c.connector) p.set(PARAM.connector, c.connector)
  if (c.minPower) p.set(PARAM.power, String(c.minPower))
  if (c.onlyLive) p.set(PARAM.live, '1')
  /* `distance` no se escribe: depende de un permiso que un enlace no concede. */
  if (c.sort !== 'relevance' && c.sort !== 'distance') p.set(PARAM.sort, c.sort)
  const qs = p.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

export function StationFinder({ lang, stations, cities }: Props) {
  const [criteria, setCriteria] = useState<Criteria>(EMPTY)
  const { query, city, connector, minPower, onlyLive, sort } = criteria

  /**
   * La URL se escribe desde la ACCIÓN, no desde un efecto que observe el
   * estado. Con un efecto reactivo, el que sincroniza desde la URL y el que
   * escribe en ella corrían en el mismo commit y el segundo borraba la query
   * string —con el criterio todavía vacío— antes de que el primero cuajara.
   */
  const apply = (next: Criteria) => {
    setCriteria(next)
    writeCriteria(next)
  }
  const set = <K extends keyof Criteria>(key: K, value: Criteria[K]) =>
    apply({ ...criteria, [key]: value })

  const [filtersOpen, setFiltersOpen] = useState(false)
  const lastTracked = useRef('')
  const [origin, setOrigin] = useState<Coords | null>(null)
  const [geoState, setGeoState] = useState<GeoState>('idle')

  const uid = useId()
  const searchId = `${uid}-buscar`
  const sortId = `${uid}-orden`
  const filtersId = `${uid}-filtros`

  /* La cercanía solo existe si el dataset la sostiene. */
  const geoAvailable = useMemo(() => hasCoordinates(stations), [stations])

  const cityName = useMemo(
    () => (slug: string) => cities.find((c) => c.slug === slug)?.name ?? '',
    [cities],
  )

  const connectors = useMemo(
    () => Array.from(new Set(stations.flatMap((s) => s.connectors))).sort(),
    [stations],
  )

  const filters = useMemo(
    () => ({ query, citySlug: city, connector, minPowerKw: minPower, onlyAvailable: onlyLive }),
    [query, city, connector, minPower, onlyLive],
  )
  const hasFilters = Boolean(query || city || connector || minPower || onlyLive)
  const activeCount = [city, connector, minPower, onlyLive].filter(Boolean).length

  const escalones = useMemo(() => calcularEscalones(stations), [stations])

  /* ── URL → criterio, una sola vez al montar.
     `setState` dentro de un efecto es exactamente lo que la regla
     `react-hooks/set-state-in-effect` vigila, y aquí es el caso que la propia
     regla admite: sincronizar con una fuente externa a React —la barra de
     direcciones— que no existe durante el render del servidor. Es una única
     asignación, sin cascada. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCriteria(readCriteria(escalones))
  }, [escalones])

  const results = useMemo(
    () =>
      sortStations(filterStations(stations, filters, cityName), sort, {
        cityNameOf: cityName,
        origin,
      }),
    [stations, filters, sort, origin, cityName],
  )

  const clearAll = () => {
    /* Conserva el orden: limpiar filtros no es reordenar. */
    apply({ ...EMPTY, sort: criteria.sort })
    track('red_filtros_limpiados')
  }

  const onFilter = (tipo: string, valor: string | number | boolean) =>
    track('red_filtro_aplicado', { tipo, valor: String(valor) })

  const locate = () => {
    if (!navigator.geolocation) return setGeoState('denied')
    setGeoState('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
        set('sort', 'distance')
        onFilter('cercania', true)
      },
      () => setGeoState('denied'),
      { timeout: 8000 },
    )
  }

  return (
    <div>
      {/* ── BÚSQUEDA ─────────────────────────────────────────────────────────
          El campo ahora PARECE un campo: icono, borde de control a 3:1 y botón
          de limpiar. Antes era una hairline de 1.25:1 con un placeholder de
          24px en gris, y se leía como contenido, no como control. */}
      {/* ── ORDEN VERTICAL EN MÓVIL ─────────────────────────────────────────
          Medido a 390px, el primer resultado quedaba a 695px: casi el viewport
          entero de andamiaje antes del contenido. Las etiquetas visibles y el
          selector de orden en su propia fila costaban 105px por sí solos.

          Ahora: fila 1 el buscador, fila 2 [Filtros] + [Orden] juntos. Las
          etiquetas pasan a `sr-only` bajo `lg` —el campo tiene icono y
          placeholder, y el selector muestra su valor— sin perder nada para
          lectores de pantalla. En desktop vuelven a ser visibles y el orden
          recupera su sitio junto al buscador vía `lg:contents`. */}
      <div className="grid gap-4 border-b border-line pb-5 lg:flex lg:items-end lg:gap-6 lg:pb-6">
        <div className="min-w-0 lg:flex-1">
          <label
            htmlFor={searchId}
            className="block font-mono text-mono uppercase tracking-wider text-ink-3 max-lg:sr-only"
          >
            {t(red.search.label, lang)}
          </label>
          <div className="relative lg:mt-3">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m20 20-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => set('query', e.target.value)}
              /* Antes se emitía en CADA blur con valor: enfocar y desenfocar
                 tres veces contaba tres búsquedas. Solo se emite si el término
                 cambió desde el último registrado. */
              onBlur={(e) => {
                const term = e.target.value.trim()
                if (term && term !== lastTracked.current) {
                  lastTracked.current = term
                  track('red_buscar', { termino: term })
                }
              }}
              placeholder={t(red.search.placeholder, lang)}
              autoComplete="off"
              className="min-h-12 w-full rounded-(--radius-structural) border border-line-control bg-canvas pl-12 pr-12 text-body-l text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
            />
            {query && (
              <button
                type="button"
                onClick={() => set('query', '')}
                aria-label={t(red.search.clear, lang)}
                className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-ink-3 transition-colors hover:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* `lg:contents` disuelve este envoltorio en desktop, así que buscador
            y orden vuelven a ser hermanos de la misma fila flex sin duplicar el
            `<select>` ni su etiqueta. */}
        <div className="flex items-center gap-3 lg:contents">
          <FiltersToggle
            open={filtersOpen}
            onToggle={() => setFiltersOpen((v) => !v)}
            controls={filtersId}
            label={t(filtersOpen ? red.filters.toggleHide : red.filters.toggle, lang)}
            count={activeCount}
          />

          {/* Orden. `<select>` nativo a propósito: teclado, lector de pantalla y
              la rueda nativa de iOS/Android salen gratis y sin JS de más. */}
          <div className="min-w-0 flex-1 lg:flex-none lg:shrink-0">
            <label
              htmlFor={sortId}
              className="block font-mono text-mono uppercase tracking-wider text-ink-3 max-lg:sr-only"
            >
              {t(red.sort.label, lang)}
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => {
                set('sort', e.target.value as StationSort)
                onFilter('orden', e.target.value)
              }}
              className="min-h-11 w-full rounded-(--radius-pill) border border-line-control bg-canvas px-4 pr-9 text-body-s text-ink outline-none transition-colors focus:border-brand lg:mt-3 lg:min-h-12 lg:rounded-(--radius-structural) lg:px-4 lg:pr-10 lg:text-body"
            >
              <option value="relevance">{t(red.sort.relevance, lang)}</option>
              <option value="power">{t(red.sort.power, lang)}</option>
              <option value="status">{t(red.sort.status, lang)}</option>
              <option value="city">{t(red.sort.city, lang)}</option>
              {geoAvailable && origin && (
                <option value="distance">{t(red.sort.distance, lang)}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* ── FILTROS ──────────────────────────────────────────────────────────
          Colapsados en móvil, siempre abiertos desde `lg`. El recuento de
          activos va en el disparador: colapsar no puede esconder estado. */}
      <div className="border-b border-line">
        <div
          id={filtersId}
          className={cn(
            'gap-6 py-6 sm:grid-cols-2 lg:grid lg:grid-cols-4 lg:gap-8',
            filtersOpen ? 'grid' : 'hidden',
          )}
        >
          <FilterGroup label={t(red.filters.city, lang)}>
            <Chip
              active={!city}
              onClick={() => {
                set('city', '')
                onFilter('ciudad', 'todas')
              }}
            >
              {t(red.filters.all, lang)}
            </Chip>
            {cities.map((c) => (
              <Chip
                key={c.slug}
                active={city === c.slug}
                onClick={() => {
                  set('city', c.slug)
                  onFilter('ciudad', c.slug)
                }}
              >
                {c.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label={t(red.filters.connector, lang)}>
            <Chip
              active={!connector}
              onClick={() => {
                set('connector', '')
                onFilter('conector', 'todos')
              }}
            >
              {t(red.filters.allM, lang)}
            </Chip>
            {connectors.map((c) => (
              <Chip
                key={c}
                active={connector === c}
                onClick={() => {
                  set('connector', c)
                  onFilter('conector', c)
                }}
              >
                {c}
              </Chip>
            ))}
          </FilterGroup>

          {/* Con un solo escalón el grupo no separa nada, así que no se pinta:
              un filtro que no filtra es un control decorativo (§16). */}
          {escalones.length > 1 && (
            <FilterGroup label={t(red.filters.power, lang)}>
              {escalones.map((p) => (
                <Chip
                  key={p}
                  active={minPower === p}
                  onClick={() => {
                    set('minPower', p)
                    onFilter('potencia', p)
                  }}
                >
                  {p === 0 ? t(red.filters.allM, lang) : `${p}+ kW`}
                </Chip>
              ))}
            </FilterGroup>
          )}

          {/* La etiqueta del grupo dice DE QUÉ es; el chip, QUÉ hace. Antes las
              dos decían "Solo en operación". */}
          <FilterGroup label={t(red.filters.availabilityGroup, lang)}>
            <Chip
              active={onlyLive}
              onClick={() => {
                set('onlyLive', !onlyLive)
                onFilter('disponibilidad', !onlyLive)
              }}
            >
              {t(red.filters.availability, lang)}
            </Chip>
            {geoAvailable && geoState !== 'granted' && (
              <Chip
                active={false}
                onClick={locate}
              >
                {t(geoState === 'locating' ? red.nearby.locating : red.nearby.action, lang)}
              </Chip>
            )}
          </FilterGroup>
        </div>
      </div>

      {geoAvailable && geoState === 'denied' && (
        <p
          role="status"
          className="mt-4 text-body-s text-ink-2"
        >
          {t(red.nearby.denied, lang)}
        </p>
      )}

      {/* ── RECUENTO ─────────────────────────────────────────────────────────
          Es el feedback central de la herramienta y estaba en mono de 12px: el
          texto más discreto de la sección. Ahora tiene el peso que le toca. */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 py-5 lg:py-6">
        <p
          role="status"
          aria-live="polite"
          className="font-display text-display-s text-ink"
        >
          {results.length}{' '}
          <span className="text-ink-2">
            {t(results.length === 1 ? red.filters.resultsOne : red.filters.resultsMany, lang)}
          </span>
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

      {/* El encabezado evita un salto de nivel (h1 → h3) */}
      <h2 className="sr-only">{t(red.filters.resultsMany, lang)}</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((s) => {
            const km = origin && s.geo ? distanceKm(origin, s.geo) : null
            return (
              <li key={s.slug}>
                <Link
                  href={href(lang, routes.station(s.slug))}
                  onClick={() => track('estacion_vista', { slug: s.slug, origen: 'buscador' })}
                  /* Cuatro columnas desde `lg`, no desde `md`: a 768px metía
                     cuatro celdas en el ancho de tablet y "En operación"
                     quedaba tocando el borde del contenedor (§22). */
                  className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 lg:grid-cols-[1.5fr_1fr_1.2fr_auto] lg:items-center"
                >
                  <div>
                    <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 text-body-s text-ink-3">
                      {cityName(s.citySlug)}
                      {km !== null &&
                        ` · ${km < 10 ? km.toFixed(1) : Math.round(km)} ${t(red.nearby.unit, lang)}`}
                    </p>
                  </div>
                  <p className="font-mono text-mono text-ink-2">
                    {formatPowerKw(s.powerKw)} · {s.points} {t(units.pointsShort, lang)}
                  </p>
                  <p className="font-mono text-mono text-ink-3">{s.connectors.join(' / ')}</p>
                  <StatusBadge
                    status={s.status}
                    lang={lang}
                    className="justify-self-start lg:justify-self-end"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="border-b border-line py-16 text-center">
          <h3 className="font-display text-display-s font-semibold text-ink">
            {t(states.noResults.title, lang)}
          </h3>
          <p className="mx-auto mt-3 max-w-[46ch] text-body-s text-ink-2">
            {t(states.noResults.body, lang)}
          </p>
          <div className="mt-7">
            <Button
              variant="ghost"
              onClick={clearAll}
            >
              {t(states.noResults.action, lang)}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Disparador de los filtros en móvil. Lleva el recuento de activos para que
 *  colapsar no esconda estado. Desaparece desde `lg`, donde no hay nada que
 *  desplegar. */
function FiltersToggle({
  open,
  onToggle,
  controls,
  label,
  count,
}: {
  open: boolean
  onToggle: () => void
  controls: string
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-(--radius-pill) border border-line-control px-4 text-body-s text-ink transition-colors hover:border-line-strong lg:hidden"
    >
      {label}
      {count > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-(--radius-pill) bg-brand px-1.5 font-mono text-[0.6875rem] text-on-brand">
          {count}
        </span>
      )}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn('transition-transform', open && 'rotate-180')}
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 font-mono text-mono uppercase tracking-wider text-ink-3">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

/**
 * Chip de FILTRO. La prohibición del sistema es a los chips decorativos sin
 * función; estos accionan el filtrado y declaran su estado.
 *
 * `aria-pressed` va siempre. Antes se emitía solo en el grupo de
 * disponibilidad, así que ciudad, conector y potencia comunicaban su selección
 * únicamente con color (WCAG 4.1.2).
 *
 * Su forma es de PASTILLA y su estado es un relleno de marca. Es deliberadamente
 * distinto del tab de `/empresas`, que ahora lleva subrayado e indicador: eran
 * idénticos y significaban cosas opuestas — filtrar una lista frente a cambiar
 * de vista.
 */
function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-11 items-center rounded-(--radius-pill) border px-4 text-body-s transition-colors',
        active
          ? 'border-brand/60 bg-brand/12 text-ink'
          : 'border-line-control text-ink-2 hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
