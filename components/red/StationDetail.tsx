"use client";

import { useLang } from "@/lib/i18n";
import type { Station } from "@/content/site";
import { Container, PlaceholderMedia, VideoPlaceholder } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Ficha de estación — renderizada desde datos (escalable, no manual). */
export function StationDetail({ station }: { station: Station }) {
  const { t } = useLang();

  const statusMap = {
    operativa: { label: t({ es: "Operativa", en: "Live" }), cls: "text-brand", dot: "bg-brand" },
    proxima: { label: t({ es: "Próximamente", en: "Coming soon" }), cls: "text-ink-3", dot: "bg-ink-3" },
    mantenimiento: { label: t({ es: "Mantenimiento", en: "Maintenance" }), cls: "text-amber-400", dot: "bg-amber-400" },
  } as const;
  const st = statusMap[station.status];

  const specs = [
    { k: t({ es: "Potencia", en: "Power" }), v: `${station.powerKw} kW` },
    { k: t({ es: "Puntos de carga", en: "Charging points" }), v: String(station.points) },
    { k: t({ es: "Conectores", en: "Connectors" }), v: station.connectors.join(" · ") },
    { k: t({ es: "Horario", en: "Hours" }), v: t(station.hours) },
  ];

  return (
    <main>
      <section className="pt-28 md:pt-36">
        <Container>
          <a href="/red" className="inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t({ es: "Volver a la red", en: "Back to network" })}
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">{station.name}</h1>
            <span className={cn("inline-flex items-center gap-1.5 font-mono text-sm", st.cls)}>
              <span className={cn("size-2 rounded-full", st.dot)} />
              {st.label}
            </span>
          </div>
          <p className="mt-3 text-lg text-ink-2">{t(station.address)}</p>
        </Container>
      </section>

      {/* Media de la estación */}
      <section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {station.hasVideo ? (
              <VideoPlaceholder
                className="aspect-video w-full rounded-[var(--radius-structural)] md:col-span-2"
                label={t({ es: `Video de la estación ${station.name}`, en: `${station.name} station video` })}
              />
            ) : (
              <PlaceholderMedia
                className="aspect-video w-full md:col-span-2"
                label={t({ es: `Fotografía de ${station.name}`, en: `${station.name} photo` })}
              />
            )}
            <PlaceholderMedia
              className="aspect-video w-full md:aspect-auto"
              label={t({ es: "Foto adicional", en: "Additional photo" })}
            />
          </div>
        </Container>
      </section>

      {/* Specs + servicios + acciones */}
      <section className="py-10 md:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-structural)] border border-line bg-line md:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.k} className="bg-canvas p-5">
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-3">{s.k}</dt>
                    <dd className="mt-2 font-display text-lg font-semibold text-ink">{s.v}</dd>
                  </div>
                ))}
              </dl>

              {station.services.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-ink-3">{t({ es: "Servicios", en: "Amenities" })}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {station.services.map((sv, i) => (
                      <span key={i} className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-2">
                        {t(sv)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-8 rounded-[var(--radius-structural)] border border-dashed border-line-strong bg-surface-1 p-4 font-mono text-xs text-ink-3">
                {t({ es: "Disponibilidad en tiempo real: pendiente de integración con datos/API.", en: "Real-time availability: pending data/API integration." })}
              </p>
            </div>

            {/* Acciones / cómo llegar */}
            <div>
              <div className="rounded-[var(--radius-structural)] border border-line bg-surface-1 p-6">
                <PlaceholderMedia className="aspect-square w-full" label={t({ es: "Mapa · ubicación", en: "Map · location" })} />
                <div className="mt-5 flex flex-col gap-3">
                  <Button variant="primary" arrow className="w-full">
                    {t({ es: "Cómo llegar", en: "Get directions" })}
                  </Button>
                  <Button variant="secondaryNeutral" className="w-full">
                    {t({ es: "Abrir en la app", en: "Open in the app" })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
