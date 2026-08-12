/**
 * CAPA DE ACCESO A DATOS
 * Ver docs/MASTER-PROJECT-DEFINITION.md §26.
 *
 * Los componentes NUNCA importan `content/data/*` directamente: siempre pasan
 * por aquí. Es lo que permite cambiar el origen (CMS, API, base de datos) sin
 * tocar una sola línea de presentación.
 *
 * Hoy el origen son módulos locales y las funciones son síncronas. Si mañana
 * el origen es remoto, estas firmas pasan a `async` y solo cambia este archivo.
 */

import { stations, type Station } from "@/content/data/stations";
import { cities, type City } from "@/content/data/cities";
import {
  metrics,
  businessSegments,
  cases,
  partners,
  testimonials,
  founder,
  type Metric,
  type Case,
} from "@/content/data/company";

/* ------------------------------- Estaciones ------------------------------ */

export function getStations(): Station[] {
  return stations;
}

export function getStation(slug: string): Station | undefined {
  return stations.find((s) => s.slug === slug);
}

export function getFeaturedStations(limit?: number): Station[] {
  const list = stations.filter((s) => s.featured);
  return limit ? list.slice(0, limit) : list;
}

export function getStationsByCity(citySlug: string): Station[] {
  return stations.filter((s) => s.citySlug === citySlug);
}

export function getOperationalStations(): Station[] {
  return stations.filter((s) => s.status === "operativa");
}

/** Filtros de /red. Toda comparación es tolerante a acentos y mayúsculas. */
export type StationFilters = {
  query?: string;
  citySlug?: string;
  connector?: string;
  minPowerKw?: number;
  onlyAvailable?: boolean;
};

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function filterStations(list: Station[], f: StationFilters, cityNameOf: (slug: string) => string): Station[] {
  return list.filter((s) => {
    if (f.citySlug && s.citySlug !== f.citySlug) return false;
    if (f.connector && !s.connectors.includes(f.connector as Station["connectors"][number])) return false;
    if (f.minPowerKw && s.powerKw < f.minPowerKw) return false;
    if (f.onlyAvailable && s.status !== "operativa") return false;
    if (f.query) {
      const q = normalize(f.query);
      const haystack = normalize(`${s.name} ${cityNameOf(s.citySlug)}`);
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/* -------------------------------- Ciudades ------------------------------- */

export function getCities(): City[] {
  return cities;
}

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

/** Ciudades que efectivamente tienen estaciones, con su conteo. */
export function getCitiesWithStations(): { city: City; count: number; operational: number }[] {
  return cities
    .map((city) => {
      const list = getStationsByCity(city.slug);
      return { city, count: list.length, operational: list.filter((s) => s.status === "operativa").length };
    })
    .filter((c) => c.count > 0);
}

/* -------------------------------- Compañía ------------------------------- */

/**
 * Métricas para mostrar. `validated: false` significa que NO hay cifra real.
 * La UI decide cómo representarlo; nunca inventa un número.
 * Regla de economía: máximo dos provisionales por página (§33).
 */
export function getMetrics(opts: { onlyValidated?: boolean; limit?: number } = {}): Metric[] {
  let list = metrics;
  if (opts.onlyValidated) list = list.filter((m) => m.validated);
  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}

export function getFeaturedMetrics(limit = 2): Metric[] {
  return metrics.filter((m) => m.featured).slice(0, limit);
}

export function getBusinessSegments() {
  return businessSegments;
}

export function getBusinessSegment(key: string) {
  return businessSegments.find((s) => s.key === key);
}

export function getCases(): Case[] {
  return cases;
}

export function getFeaturedCase(): Case | undefined {
  return cases.find((c) => c.featured);
}

export function getCaseForSegment(segmentKey: string): Case | undefined {
  return cases.find((c) => c.segment === segmentKey) ?? cases.find((c) => c.featured);
}

/** Vacío mientras no haya logos con permiso de uso: la UI omite la franja. */
export function getPartners() {
  return partners;
}

export function getTestimonials(segment?: "b2c" | "b2b") {
  return segment ? testimonials.filter((t) => t.segment === segment) : testimonials;
}

export function getFounder() {
  return founder;
}

export type { Station, City, Metric, Case };
