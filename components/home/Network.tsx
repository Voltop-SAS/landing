"use client";

import { useLang } from "@/lib/i18n";
import { stations, type Station } from "@/content/site";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** LA RED — "el mapa es el producto" + estaciones desde datos + handoff B2B. */
export function Network() {
  const { t } = useLang();

  const filters = [
    t({ es: "Ciudad", en: "City" }),
    t({ es: "Conector", en: "Connector" }),
    t({ es: "Disponibilidad", en: "Availability" }),
    t({ es: "Potencia", en: "Power" }),
  ];

  return (
    <Section id="red" register="silencio">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>{t({ es: "Estaciones", en: "Stations" })}</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              {t({ es: "Explora la red en tiempo real", en: "Explore the network in real time" })}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <Button variant="secondary" arrow href="/red/universidad-ean">
              {t({ es: "Ver una estación", en: "View a station" })}
            </Button>
          </Reveal>
        </div>

        {/* Filtros mínimos (progressive disclosure: avanzados bajo demanda) */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((f, i) => (
              <span
                key={f}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  i === 0
                    ? "border-transparent brand-gradient text-on-brand font-medium"
                    : "border-line text-ink-2"
                )}
              >
                {f}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-line px-4 py-1.5 text-sm text-ink-3">
              {t({ es: "Más filtros", en: "More filters" })} +
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Mapa (teaser — asset/API pendiente) */}
          <Reveal delay={0.12} className="lg:col-span-3">
            <MapTeaser label={t({ es: "Mapa interactivo con disponibilidad en tiempo real", en: "Interactive map with real-time availability" })} />
          </Reveal>

          {/* Lista de estaciones (desde datos, escalable) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            {stations.map((s, i) => (
              <Reveal key={s.slug} delay={0.14 + i * 0.05}>
                <StationCard station={s} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Handoff doble intención → B2B (hospedar estación) */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-structural)] border border-line bg-surface-1 p-6 md:flex-row md:items-center">
            <p className="text-ink-2">
              {t({ es: "¿Tienes un parking, hotel o espacio comercial?", en: "Own a parking, hotel or retail space?" })}{" "}
              <span className="text-ink">{t({ es: "Lleva Voltop a tu espacio.", en: "Bring Voltop to your space." })}</span>
            </p>
            <Button variant="tertiary" arrow href="/empresas">
              {t({ es: "Hospedar una estación", en: "Host a station" })}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function StationCard({ station }: { station: Station }) {
  const { t } = useLang();
  const statusMap = {
    operativa: { label: t({ es: "Operativa", en: "Live" }), cls: "text-brand", dot: "bg-brand" },
    proxima: { label: t({ es: "Próximamente", en: "Coming soon" }), cls: "text-ink-3", dot: "bg-ink-3" },
    mantenimiento: { label: t({ es: "Mantenimiento", en: "Maintenance" }), cls: "text-amber-400", dot: "bg-amber-400" },
  } as const;
  const st = statusMap[station.status];

  return (
    <a
      href={`/red/${station.slug}`}
      className="group block rounded-[var(--radius-structural)] border border-line bg-canvas p-5 transition-colors hover:border-line-strong hover:bg-surface-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-semibold text-ink transition-colors group-hover:text-brand">{station.name}</h3>
          <p className="text-sm text-ink-3">{station.city}</p>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs", st.cls)}>
          <span className={cn("size-1.5 rounded-full", st.dot)} />
          {st.label}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-2">
        <span>{station.powerKw} kW</span>
        <span className="text-line-strong">·</span>
        <span>{station.points} {t({ es: "puntos", en: "points" })}</span>
        <span className="text-line-strong">·</span>
        <span>{station.connectors.join(" / ")}</span>
      </div>
    </a>
  );
}

function MapTeaser({ label }: { label: string }) {
  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden rounded-[var(--radius-structural)] border border-line bg-surface-1">
      <span
        className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-dashed border-brand/50 bg-canvas/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand"
        title="Mapa/API pendiente"
      >
        Mapa · placeholder
      </span>
      {/* Grid + nodos estilizados */}
      <svg aria-hidden="true" viewBox="0 0 600 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="var(--color-line)" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="400" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 60} x2="600" y2={i * 60} />
          ))}
        </g>
        {[
          [140, 120], [300, 90], [420, 180], [220, 240], [380, 300], [120, 300],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill="var(--color-brand-2)" opacity="0.18" />
            <circle cx={x} cy={y} r="4" className="brand-gradient" fill="var(--color-brand)" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas to-transparent p-5">
        <p className="text-sm text-ink-2">{label}</p>
      </div>
    </div>
  );
}
