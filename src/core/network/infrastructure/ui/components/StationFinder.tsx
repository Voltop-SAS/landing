'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { red } from '~/core/network/domain/consts/copy'
import { states, units } from '~/core/common/domain/consts/copy'
import type { Station } from '~/core/network/domain/entities/Station'
import { formatPowerKw } from '~/core/network/domain/entities/Station'
import type { City } from '~/core/network/domain/entities/City'
import {
  filterStations,
  sortStations,
  hasCoordinates,
  distanceKm,
  type StationSort,
} from '~/core/common/infrastructure/data-access'
import {
  readCriteria,
  criteriaToQuery,
  EMPTY_CRITERIA,
  type Criteria,
} from '~/core/network/infrastructure/helpers/criteria'
import { useSettledUrl } from '~/core/network/infrastructure/ui/hooks/useSettledUrl'
import { StatusBadge } from '@ui/common/components/ui/DataPrimitives'
import { Button } from '@ui/common/components/ui/Button'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * STATION FINDER · client island
 * See docs/MASTER-PROJECT-DEFINITION.md §14.
 *
 * /red is a PRODUCT SURFACE: its job is to find a station. The data arrives as
 * props from the Server Component; the island is only the interaction, not the
 * data fetching.
 *
 * ── WHAT CHANGED IN THIS REVISION ─────────────────────────────────────────
 *
 * 1. THE FILTERS COLLAPSE ON MOBILE. You used to have to scroll past title,
 *    lead, label, field and four chip groups —which wrap onto two rows each—
 *    to reach the first result: roughly 700px of scrolling on the central task
 *    of the B2C journey. The result is now less than one scroll away and the
 *    filters open when you want them, with the active count in view so that
 *    collapsing them does not hide state.
 *
 * 2. THERE IS SORTING. There was none. Nobody searches for "Grand Hyatt": they
 *    look for the most powerful one, the one that is live, or the closest one.
 *    The dataset can answer the first three criteria today.
 *
 * 3. PROXIMITY IS ACTIVATED BY DATA. Every station has `geo: null`, so the
 *    location control and the distance column ARE NOT RENDERED. It is not dead
 *    code: it is the project's pattern (`MetricRow` does not render
 *    unvalidated metrics, the partner strip is omitted when there are no
 *    logos) and it switches itself on when the dataset carries coordinates.
 *
 * 4. THE STATE LIVES IN THE URL. A filtered result can be shared.
 *    `history.replaceState` is used instead of `useSearchParams` on purpose:
 *    this route is static and `useSearchParams` would make it dynamic.
 *
 * 5. THE FILTERING IS NO LONGER DUPLICATED. `filterStations` already existed
 *    in the data layer and this component reimplemented the same logic, with
 *    its own copy of `normalize`. That was exactly the duplication the layer
 *    exists to prevent.
 * ──────────────────────────────────────────────────────────────────────────
 */

type Props = { locale: Locale; stations: Station[]; cities: City[] }

/**
 * POWER FILTER STEPS — derived from the dataset, not written by hand.
 *
 * They were hard-coded to `[0, 50, 100, 150]`. With the network's real power
 * ratings (22–80 kW), the 100+ and 150+ steps **returned no stations at all**:
 * two of the filter's four controls were guaranteed to yield zero results, and
 * §16 says no control is decorative — if it looks like a filter, it filters.
 *
 * Deriving them stops that from happening again. We take the stations'
 * distinct maximums, sort them and prepend 0 ("all"). Adding a 150 kW station
 * makes that step appear on its own; removing it takes the step away.
 */
function computeSteps(stations: Station[]): number[] {
  const maxPowers = [...new Set(stations.map((s) => s.powerKw.max))].sort((a, b) => a - b)
  /* If every station had the same power output the filter would separate
     nothing: better a single "all" step than a control that narrows nothing. */
  return maxPowers.length > 1 ? [0, ...maxPowers] : [0]
}

/**
 * How long the address bar waits after the last change.
 *
 * 700 ms is long enough to swallow a burst of clicks and short enough that
 * nobody manages to select and copy the URL before it settles — which is the
 * one thing that would make a stale link travel.
 */
const URL_SETTLE_MS = 700

type Coords = { lat: number; lng: number }
type GeoState = 'idle' | 'locating' | 'granted' | 'denied'

export function StationFinder({ locale, stations, cities }: Props) {
  const [criteria, setCriteria] = useState<Criteria>(EMPTY_CRITERIA)
  const { query, city, connector, minPower, onlyLive, sort } = criteria

  /**
   * The URL is written from the ACTION, not from an effect observing state.
   * With a reactive effect, the one syncing from the URL and the one writing
   * to it ran in the same commit and the second wiped the query string —with
   * the criteria still empty— before the first had settled.
   *
   * ── AND IT IS WRITTEN WHEN THE PERSON STOPS, NOT ON EVERY CLICK ──────────
   * `replaceState` is what GA4's enhanced measurement watches to count a
   * `page_view` on a single-page navigation. Measured in production on
   * 2026-09-09, reading the POST bodies and not just the URL: **three filter
   * clicks produced four extra `page_view` hits**, all of them on /red, which
   * is the page whose traffic matters most.
   *
   * The setting that produces them is the same one that produces the CORRECT
   * page_view when someone moves between pages, so it cannot be turned off in
   * GA4 without losing both. It has to be handled here.
   *
   * The URL exists so a filtered result can be SHARED — and nobody shares
   * halfway through filtering. Writing it once the criteria settle is what the
   * feature actually needs, not a workaround: a burst of clicks collapses into
   * one entry instead of one per click.
   *
   * ⚠️ It does NOT eliminate them. Someone who filters slowly, pausing between
   * clicks, still generates one each time. Removing them entirely would mean
   * giving up shareable URLs or handing `page_view` over to GTM, and both cost
   * more than they fix.
   *
   * The state is set IMMEDIATELY: only the address bar waits. The list, the
   * chips and the result count react on the same frame as always. The waiting
   * itself lives in `useSettledUrl`, where it is tested with fake timers.
   */
  const writeUrl = useSettledUrl(URL_SETTLE_MS)

  const apply = (next: Criteria) => {
    setCriteria(next)
    /* `criteriaToQuery` is pure so the contract can be tested without a
       browser. */
    writeUrl(criteriaToQuery(next) || window.location.pathname)
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

  /* Proximity only exists if the dataset supports it. */
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

  const steps = useMemo(() => computeSteps(stations), [stations])

  /* ── URL → criteria, once on mount.
     `setState` inside an effect is exactly what the
     `react-hooks/set-state-in-effect` rule watches for, and this is the case
     the rule itself allows: syncing with a source external to React —the
     address bar— that does not exist during the server render. It is a single
     assignment, with no cascade. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCriteria(
      readCriteria(window.location.search, {
        steps,
        citySlugs: cities.map((c) => c.slug),
        connectors,
      }),
    )
  }, [steps, cities, connectors])

  const results = useMemo(
    () =>
      sortStations(filterStations(stations, filters, cityName), sort, {
        cityNameOf: cityName,
        origin,
      }),
    [stations, filters, sort, origin, cityName],
  )

  const clearAll = () => {
    /* Keep the sort order: clearing filters is not re-sorting. */
    apply({ ...EMPTY_CRITERIA, sort: criteria.sort })
    /* Clearing IS filtering. It used to be its own event, which meant two
       metrics to add up to answer one question — how much people filter. */
    track('filter_stations', { filter_type: 'all', filter_value: 'cleared' })
  }

  const onFilter = (filterType: string, value: string | number | boolean) =>
    track('filter_stations', { filter_type: filterType, filter_value: String(value) })

  const locate = () => {
    if (!navigator.geolocation) return setGeoState('denied')
    setGeoState('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState('granted')
        set('sort', 'distance')
        /* Its own event, not a filter: granting location is a decision of a
           different kind from picking a city, and the plan asks to be able to
           tell how many people take it. The COORDINATES ARE NOT SENT — only
           that permission was given or refused. */
        track('use_my_location', { outcome: 'granted' })
      },
      () => {
        setGeoState('denied')
        track('use_my_location', { outcome: 'denied' })
      },
      { timeout: 8000 },
    )
  }

  return (
    <div>
      {/* ── SEARCH ───────────────────────────────────────────────────────────
          The field now LOOKS like a field: icon, control border at 3:1 and a
          clear button. It used to be a 1.25:1 hairline with a 24px grey
          placeholder, and it read as content rather than as a control. */}
      {/* ── VERTICAL ORDER ON MOBILE ────────────────────────────────────────
          Measured at 390px, the first result sat at 695px: almost a full
          viewport of scaffolding before the content. The visible labels and
          the sort select on its own row cost 105px by themselves.

          Now: row 1 the search field, row 2 [Filters] + [Sort] together. The
          labels become `sr-only` below `lg` —the field has an icon and a
          placeholder, and the select shows its value— losing nothing for
          screen readers. On desktop they become visible again and the sort
          control returns to its place beside the search field via
          `lg:contents`. */}
      <div className="grid gap-4 border-b border-line pb-5 lg:flex lg:items-end lg:gap-6 lg:pb-6">
        <div className="min-w-0 lg:flex-1">
          <label
            htmlFor={searchId}
            className="block font-mono text-mono uppercase tracking-wider text-ink-3 max-lg:sr-only"
          >
            {t(red.search.label, locale)}
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
              /* ── THE TERM IS NOT SENT. ONLY THAT SOMEBODY SEARCHED ─────────
                 It used to travel as `termino: "hyatt"`. A search box is free
                 text: people type place names, plate numbers, their own
                 address. None of that belongs in an analytics dashboard, and
                 once sent it cannot be taken back.

                 What survives is what a decision can be made from: that a
                 search happened and whether it found anything. `results_count: 0`
                 is the useful signal — it says the network is missing
                 something — without carrying what was typed.

                 The term is still used to DEDUPLICATE locally: it never leaves
                 this component. Focusing and blurring three times over the same
                 text still counts as one search. */
              onBlur={(e) => {
                const term = e.target.value.trim()
                if (term && term !== lastTracked.current) {
                  lastTracked.current = term
                  track('station_search', { results_count: results.length })
                }
              }}
              placeholder={t(red.search.placeholder, locale)}
              autoComplete="off"
              className="min-h-12 w-full rounded-(--radius-structural) border border-line-control bg-canvas pl-12 pr-12 text-body-l text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
            />
            {query && (
              <button
                type="button"
                onClick={() => set('query', '')}
                aria-label={t(red.search.clear, locale)}
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

        {/* `lg:contents` dissolves this wrapper on desktop, so the search
            field and the sort control become siblings of the same flex row
            again without duplicating the `<select>` or its label. */}
        <div className="flex items-center gap-3 lg:contents">
          <FiltersToggle
            open={filtersOpen}
            onToggle={() => setFiltersOpen((v) => !v)}
            controls={filtersId}
            label={t(filtersOpen ? red.filters.toggleHide : red.filters.toggle, locale)}
            count={activeCount}
          />

          {/* Sorting. A native `<select>` on purpose: keyboard, screen reader
              and the native iOS/Android wheel come for free, with no extra
              JavaScript. */}
          <div className="min-w-0 flex-1 lg:flex-none lg:shrink-0">
            <label
              htmlFor={sortId}
              className="block font-mono text-mono uppercase tracking-wider text-ink-3 max-lg:sr-only"
            >
              {t(red.sort.label, locale)}
            </label>
            {/* ── THE CHEVRON IS OURS, NOT THE BROWSER'S ─────────────────────
                What used to show was the one the system paints, and its distance
                from the edge is fixed by the browser: no `padding` moves it.
                Measured at 1440px, the text started 16px from the left edge and
                the arrow sat ~12px from the right — a visible imbalance on a
                238px control.

                `appearance-none` switches off ONLY the arrow's drawing. The
                `<select>` stays native: keyboard, screen reader and the
                iOS/Android wheel intact, which is exactly why a select was
                chosen over a custom menu.

                The glyph is the SAME one the language switch uses — `viewBox
                0 0 10 6`, stroke 1.5, round caps — so the site has one chevron
                and not two similar ones.

                `right-4` = 16px, exactly the `px-4` of the left side: the air is
                now the same on both. And `pr-10` reserves room so long text
                never runs underneath. */}
            <div className="relative">
              <select
                id={sortId}
                value={sort}
                onChange={(e) => {
                  set('sort', e.target.value as StationSort)
                  onFilter('orden', e.target.value)
                }}
                className="min-h-11 w-full appearance-none rounded-(--radius-pill) border border-line-control bg-canvas px-4 pr-[3.75rem] text-body-s text-ink outline-none transition-colors focus:border-brand lg:mt-3 lg:min-h-12 lg:rounded-(--radius-structural) lg:px-4 lg:pr-[3.75rem] lg:text-body"
              >
                <option value="relevance">{t(red.sort.relevance, locale)}</option>
                <option value="power">{t(red.sort.power, locale)}</option>
                <option value="status">{t(red.sort.status, locale)}</option>
                <option value="city">{t(red.sort.city, locale)}</option>
                {geoAvailable && origin && (
                  <option value="distance">{t(red.sort.distance, locale)}</option>
                )}
              </select>
              {/* `pointer-events-none`: the click has to reach the select, which
                  is what opens the list. `lg:top-[calc(50%+0.375rem)]` offsets
                  the select's `lg:mt-3`, because the container does not carry
                  it. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 10 6"
                className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-ink-3 lg:top-[calc(50%+0.375rem)]"
              >
                <path
                  d="M1 1l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTERS ──────────────────────────────────────────────────────────
          Collapsed on mobile, always open from `lg` up. The active count sits
          on the trigger: collapsing must not hide state. */}
      <div className="border-b border-line">
        <div
          id={filtersId}
          className={cn(
            'gap-6 py-6 sm:grid-cols-2 lg:grid lg:grid-cols-4 lg:gap-8',
            filtersOpen ? 'grid' : 'hidden',
          )}
        >
          <FilterGroup label={t(red.filters.city, locale)}>
            <Chip
              active={!city}
              onClick={() => {
                set('city', '')
                onFilter('ciudad', 'todas')
              }}
            >
              {t(red.filters.all, locale)}
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

          <FilterGroup label={t(red.filters.connector, locale)}>
            <Chip
              active={!connector}
              onClick={() => {
                set('connector', '')
                onFilter('conector', 'todos')
              }}
            >
              {t(red.filters.allM, locale)}
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

          {/* With a single step the group separates nothing, so it is not
              rendered: a filter that does not filter is a decorative
              control (§16). */}
          {steps.length > 1 && (
            <FilterGroup label={t(red.filters.power, locale)}>
              {steps.map((p) => (
                <Chip
                  key={p}
                  active={minPower === p}
                  onClick={() => {
                    set('minPower', p)
                    onFilter('potencia', p)
                  }}
                >
                  {p === 0 ? t(red.filters.allM, locale) : `${p}+ kW`}
                </Chip>
              ))}
            </FilterGroup>
          )}

          {/* The group label says WHAT IT IS ABOUT; the chip, WHAT IT DOES.
              Both used to say "Solo en operación". */}
          <FilterGroup label={t(red.filters.availabilityGroup, locale)}>
            <Chip
              active={onlyLive}
              onClick={() => {
                set('onlyLive', !onlyLive)
                onFilter('disponibilidad', !onlyLive)
              }}
            >
              {t(red.filters.availability, locale)}
            </Chip>
            {geoAvailable && geoState !== 'granted' && (
              <Chip
                active={false}
                onClick={locate}
              >
                {t(geoState === 'locating' ? red.nearby.locating : red.nearby.action, locale)}
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
          {t(red.nearby.denied, locale)}
        </p>
      )}

      {/* ── RESULT COUNT ─────────────────────────────────────────────────────
          It is the tool's central feedback and it was set in 12px mono: the
          most discreet text in the section. It now carries the weight it
          deserves. */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 py-5 lg:py-6">
        <p
          role="status"
          aria-live="polite"
          className="font-display text-display-s text-ink"
        >
          {results.length}{' '}
          <span className="text-ink-2">
            {t(results.length === 1 ? red.filters.resultsOne : red.filters.resultsMany, locale)}
          </span>
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex min-h-11 items-center text-body-s text-ink-2 underline underline-offset-4 transition-colors hover:text-ink"
          >
            {t(red.filters.clear, locale)}
          </button>
        )}
      </div>

      {/* The heading prevents a level skip (h1 → h3) */}
      <h2 className="sr-only">{t(red.filters.resultsMany, locale)}</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((s) => {
            const km = origin && s.geo ? distanceKm(origin, s.geo) : null
            return (
              <li key={s.slug}>
                <Link
                  href={href(locale, routes.station(s.slug))}
                  onClick={() => track('select_station', { slug: s.slug, list_id: 'red_finder' })}
                  /* Four columns from `lg` up, not from `md`: at 768px it
                     crammed four cells into the tablet width and "En
                     operación" ended up touching the container edge (§22). */
                  className="group grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-surface-1 lg:grid-cols-[1.5fr_1fr_1.2fr_auto] lg:items-center"
                >
                  <div>
                    <h3 className="font-display text-display-s font-semibold text-ink transition-colors group-hover:text-brand">
                      {s.name}
                    </h3>
                    <p className="mt-0.5 text-body-s text-ink-3">
                      {cityName(s.citySlug)}
                      {km !== null &&
                        ` · ${km < 10 ? km.toFixed(1) : Math.round(km)} ${t(red.nearby.unit, locale)}`}
                    </p>
                  </div>
                  <p className="font-mono text-mono text-ink-2">
                    {formatPowerKw(s.powerKw)} · {s.points} {t(units.pointsShort, locale)}
                  </p>
                  <p className="font-mono text-mono text-ink-3">{s.connectors.join(' / ')}</p>
                  <StatusBadge
                    status={s.status}
                    locale={locale}
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
            {t(states.noResults.title, locale)}
          </h3>
          <p className="mx-auto mt-3 max-w-[46ch] text-body-s text-ink-2">
            {t(states.noResults.body, locale)}
          </p>
          <div className="mt-7">
            <Button
              variant="ghost"
              onClick={clearAll}
            >
              {t(states.noResults.action, locale)}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Trigger for the filters on mobile. It carries the active count so that
 *  collapsing does not hide state. It disappears from `lg` up, where there is
 *  nothing to expand. */
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
 * FILTER chip. What the system forbids is decorative chips with no function;
 * these drive the filtering and declare their state.
 *
 * `aria-pressed` is always emitted. It used to be set only on the availability
 * group, so city, connector and power communicated their selection through
 * colour alone (WCAG 4.1.2).
 *
 * Its shape is a PILL and its state is a brand fill. That is deliberately
 * different from the `/empresas` tab, which now carries an underline and an
 * indicator: they were identical and meant opposite things — filtering a list
 * versus switching a view.
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
