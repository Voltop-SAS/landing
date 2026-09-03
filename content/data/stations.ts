import type { Localized } from "@/lib/i18n/config";

/**
 * COLECCIÓN CENTRAL · Estaciones
 * Ver docs/MASTER-PROJECT-DEFINITION.md §27.
 *
 * Añadir una estación = añadir un registro. Nunca requiere rediseño ni código.
 *
 * ⚠️ DATASET DE EJEMPLO. Las ubicaciones corresponden a estaciones reales de
 * Voltop, pero las especificaciones no están verificadas y las coordenadas no
 * se han recibido. `dataStatus` lo declara explícitamente por registro.
 * Regla del proyecto: no se inventan datos.
 */

export type Connector = "CCS1" | "CCS2" | "GB-T" | "Type2";
export type StationStatus = "operativa" | "proxima" | "mantenimiento";

export type StationMedia = {
  /** Fotografías de la estación. Vacío = pendiente de recibir. */
  photos: { src: string; alt: Localized }[];
  /** Video propio de la estación, si existe. */
  video?: { src: string; poster: string; duration: string; caption: Localized };
};

export type Station = {
  slug: string;
  /** Nombre propio: no se traduce. */
  name: string;
  /** Referencia al slug de una ciudad. Nunca texto libre. */
  citySlug: string;
  address: Localized;
  /** Coordenadas. `null` hasta recibirlas: no se inventan. */
  geo: { lat: number; lng: number } | null;
  connectors: Connector[];
  /**
   * Potencia en kW. Es un RANGO porque una estación puede tener cargadores de
   * distinta potencia —la EAN va de 22 a 80— y publicar solo el máximo diría
   * que todos los puntos cargan a 80, que es exactamente el tipo de promesa
   * que §19 no admite. Cuando todos los puntos son iguales, `min === max`.
   */
  powerKw: { min: number; max: number };
  points: number;
  status: StationStatus;
  hours: Localized;
  /** Tarifas. `null` mientras no estén confirmadas comercialmente. */
  pricing: { perKwh: number; currency: string } | null;
  services: Localized[];
  media: StationMedia;
  /** Curaduría: aparece en previews y destacados. */
  featured?: boolean;
  /** Trazabilidad del dato. Nada se presenta como verificado si no lo está. */
  dataStatus: "placeholder" | "verified";
};

/**
 * LAS TRES ESTACIONES REALES.
 *
 * Datos entregados por Camilo el 2026-09-02. Antes había CUATRO, dos de ellas
 * —San Fernando Plaza y Corredor Norte— que no existen, y potencias que no se
 * correspondían con la operación (60, 120 y 150 kW frente a los 22–80 reales).
 * El sitio estaba afirmando una red mayor y más potente de la que hay.
 *
 * Se retiraron también las dos entradas de novedades que las anunciaban: una
 * apertura publicada de una estación inexistente es peor que no tener registro.
 */
/**
 * Formato de potencia. Existe para que "22–80 kW" se escriba UNA vez: seis
 * componentes la pintan y con seis plantillas distintas acabarían divergiendo.
 * Cuando todos los puntos son iguales muestra una sola cifra, porque "30–30 kW"
 * no informa, confunde.
 */
export function formatPowerKw(p: { min: number; max: number }): string {
  return p.min === p.max ? `${p.max} kW` : `${p.min}–${p.max} kW`;
}

export const stations: Station[] = [
  {
    slug: "universidad-ean",
    name: "Universidad EAN",
    citySlug: "bogota",
    address: { es: "Calle 79 #11-45, Bogotá", en: "Calle 79 #11-45, Bogotá", pt: "Calle 79 #11-45, Bogotá", },
    geo: null,
    connectors: ["GB-T", "CCS1", "CCS2"],
    powerKw: { min: 22, max: 80 },
    points: 18,
    status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7", pt: "Aberto 24/7", },
    pricing: null,
    services: [
      { es: "Techo", en: "Covered", pt: "Coberto", },
      { es: "Cafetería", en: "Café", pt: "Café", },
      { es: "Baños", en: "Restrooms", pt: "Banheiros", },
      { es: "Wifi", en: "Wi-Fi", pt: "Wi-Fi", },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: "verified",
  },
  {
    slug: "grand-hyatt",
    name: "Grand Hyatt",
    citySlug: "bogota",
    address: { es: "Calle 24A #57-60, Bogotá", en: "Calle 24A #57-60, Bogotá", pt: "Calle 24A #57-60, Bogotá", },
    geo: null,
    connectors: ["GB-T"],
    powerKw: { min: 30, max: 30 },
    points: 11,
    status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7", pt: "Aberto 24/7", },
    pricing: null,
    services: [
      { es: "Valet", en: "Valet", pt: "Manobrista", },
      { es: "Restaurante", en: "Restaurant", pt: "Restaurante", },
      { es: "Parqueadero cubierto", en: "Covered parking", pt: "Estacionamento coberto", },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: "verified",
  },
  {
    slug: "wake",
    name: "Wake",
    citySlug: "medellin",
    /* La dirección no se ha entregado: se deja el nombre de la ciudad, que sí
       es un dato. Inventar una calle sería inventar un destino físico. */
    address: { es: "Medellín", en: "Medellín", pt: "Medellín", },
    geo: null,
    connectors: ["GB-T", "CCS2"],
    powerKw: { min: 80, max: 80 },
    points: 6,
    status: "operativa",
    hours: { es: "Consultar en la app", en: "Check in the app", pt: "Consulte no aplicativo", },
    pricing: null,
    services: [],
    media: { photos: [] },
    featured: true,
    dataStatus: "verified",
  },
];
