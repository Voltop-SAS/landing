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
import { type Post, type PostType } from "@/content/data/posts";
import { faq, type FaqItem } from "@/content/data/faq";
import { fetchPosts } from "./posts-source";
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

/** Preguntas frecuentes de /red (§19). */
export function getFaq(): FaqItem[] {
  return faq;
}

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
    /* Se compara contra el MÁXIMO: una estación con puntos de 22 y de 80
        entra en el filtro "80+", porque efectivamente puedes cargar a 80 ahí. */
    if (f.minPowerKw && s.powerKw.max < f.minPowerKw) return false;
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
      return out.sort((a, b) => b.powerKw.max - a.powerKw.max || a.name.localeCompare(b.name));
    case "status":
      return out.sort(
        (a, b) => statusRank[a.status] - statusRank[b.status] || b.powerKw.max - a.powerKw.max
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
/**
 * AGREGADOS DE LA RED, calculados desde el dataset.
 *
 * Ninguna de estas cifras se escribe a mano en ningún sitio: §33 prohíbe
 * inventar cifras, y una cifra escrita a mano es una cifra que deja de ser
 * verdad en cuanto se añade una estación. Añadir un registro actualiza la
 * Home sola.
 */
export function getNetworkSummary() {
  const operativas = stations.filter((s) => s.status === "operativa");
  /* El mínimo de la red es el mínimo de los mínimos y el máximo el de los
     máximos: publicar "80 kW" cuando hay puntos de 22 sería prometer de más. */
  const minimos = operativas.map((s) => s.powerKw.min);
  const maximos = operativas.map((s) => s.powerKw.max);
  const conectores = [...new Set(operativas.flatMap((s) => s.connectors))];
  return {
    estaciones: operativas.length,
    puntos: operativas.reduce((n, s) => n + (s.points ?? 0), 0),
    ciudades: new Set(operativas.map((s) => s.citySlug)).size,
    potenciaMin: minimos.length ? Math.min(...minimos) : null,
    potenciaMax: maximos.length ? Math.max(...maximos) : null,
    conectores,
  };
}

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

/* -------------------------------- Novedades ------------------------------ */

/**
 * ── POR QUÉ ESTOS ACCESORES SON `async` Y LOS DEMÁS NO ────────────────────
 * El registro es el piloto de CMS (ver `posts-source.ts`). Su origen va a ser
 * remoto; el de estaciones y ciudades, por ahora no. Pasar SOLO el registro a
 * asíncrono es la asimetría correcta: refleja lo que de verdad va a cambiar.
 *
 * Se hace AHORA y no el día de la migración porque es lo único que obligaría a
 * tocar cada página que consume el registro. Hecho hoy, conectar el CMS es
 * cambiar el cuerpo de una función.
 */

/**
 * El registro, siempre en orden cronológico inverso y solo con lo publicado.
 * Ninguna vista ordena por su cuenta: si el orden se decidiera en cada
 * componente, dos superficies acabarían mostrando el mismo registro distinto.
 */
export async function getPosts(): Promise<Post[]> {
  const all = await fetchPosts();
  return all
    .filter((p) => p.status === "publicado")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

/**
 * Entradas con página propia. Ver la cabecera de `content/data/posts.ts`:
 * `body` vacío significa que la entrada vive solo en el índice, así que no
 * genera ruta, no entra en el sitemap y no se enlaza desde ningún sitio.
 *
 * Es un PREDICADO PURO sobre una entrada ya cargada, así que sigue siendo
 * síncrono: no consulta el origen y los componentes lo usan durante el render.
 */
export function hasPage(post: Post): boolean {
  return post.body.length > 0;
}

export async function getPostsWithPage(): Promise<Post[]> {
  return (await getPosts()).filter(hasPage);
}

/** Portada del registro: la marcada como destacada o, si no hay, la más reciente. */
export async function getFeaturedPost(): Promise<Post | undefined> {
  const list = await getPosts();
  return list.find((p) => p.featured) ?? list[0];
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  return (await getPosts()).slice(0, limit);
}

/**
 * Re-superficie contextual. Es lo que hace que el registro no sea un cajón
 * aparte: una apertura aparece sola en la ficha de su estación y en la página
 * de su ciudad, sin que nadie la coloque a mano en tres sitios.
 */
export async function getPostsForStation(stationSlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.stationSlug === stationSlug);
}

export async function getPostsForCity(citySlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.citySlug === citySlug);
}

/**
 * Tipos PRESENTES en el registro, en el orden en que aparecen.
 * El filtro se construye desde los datos: un filtro que ofrece una opción sin
 * resultados es un control decorativo, y §12 los prohíbe.
 */
export async function getPostTypes(): Promise<PostType[]> {
  const seen: PostType[] = [];
  for (const p of await getPosts()) if (!seen.includes(p.type)) seen.push(p.type);
  return seen;
}

/** Fecha de la entrada más reciente. Alimenta `lastModified` del índice. */
export async function getLatestPostDate(): Promise<string | undefined> {
  return (await getPosts())[0]?.date;
}

export type { Station, City, Metric, Case, Post, PostType };
