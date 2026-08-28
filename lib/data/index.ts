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

export function getStationsByCity(citySlug: string): Station[] {
  return stations.filter((s) => s.citySlug === citySlug);
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

/* ---------------------------------- Orden -------------------------------- */

/**
 * Criterios de orden del buscador.
 *
 * `distance` existe pero SOLO se ofrece en la UI si alguna estación trae
 * coordenadas (ver `hasCoordinates`). No es código muerto: es una rama activada
 * por datos, el mismo patrón que `MetricRow` con las métricas sin validar (§33).
 */
export type StationSort = "relevance" | "power" | "status" | "city" | "distance";

/** `relevance` = el orden curado del dataset. La curaduría es una decisión. */
const statusRank: Record<Station["status"], number> = { operativa: 0, mantenimiento: 1, proxima: 2 };

export function hasCoordinates(list: Station[]): boolean {
  return list.some((s) => s.geo !== null);
}

/**
 * Distancia en línea recta (haversine). No es distancia de ruta y no pretende
 * serlo: sirve para ORDENAR, no para prometer un tiempo de viaje.
 */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function sortStations(
  list: Station[],
  sort: StationSort,
  ctx: { cityNameOf: (slug: string) => string; origin?: { lat: number; lng: number } | null }
): Station[] {
  const out = [...list];
  switch (sort) {
    case "power":
      return out.sort((a, b) => b.powerKw - a.powerKw || a.name.localeCompare(b.name));
    case "status":
      return out.sort(
        (a, b) => statusRank[a.status] - statusRank[b.status] || b.powerKw - a.powerKw
      );
    case "city":
      return out.sort(
        (a, b) =>
          ctx.cityNameOf(a.citySlug).localeCompare(ctx.cityNameOf(b.citySlug)) ||
          a.name.localeCompare(b.name)
      );
    case "distance": {
      if (!ctx.origin) return out;
      const o = ctx.origin;
      /* Sin coordenadas no se puede comparar: esas estaciones van al final en
         lugar de aparecer arbitrariamente cerca. */
      return out.sort((a, b) => {
        const da = a.geo ? distanceKm(o, a.geo) : Infinity;
        const db = b.geo ? distanceKm(o, b.geo) : Infinity;
        return da - db;
      });
    }
    default:
      return out;
  }
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

export function getBusinessSegments() {
  return businessSegments;
}

export function getCases(): Case[] {
  return cases;
}

export function getFeaturedCase(): Case | undefined {
  return cases.find((c) => c.featured);
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
