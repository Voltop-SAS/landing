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
  powerKw: number;
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

export const stations: Station[] = [
  {
    slug: "universidad-ean",
    name: "Universidad EAN",
    citySlug: "bogota",
    address: { es: "Calle 79 #11-45, Bogotá", en: "Calle 79 #11-45, Bogotá" },
    geo: null,
    connectors: ["CCS1", "CCS2", "GB-T"],
    powerKw: 60,
    points: 10,
    status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7" },
    pricing: null,
    services: [
      { es: "Techo", en: "Covered" },
      { es: "Cafetería", en: "Café" },
      { es: "Baños", en: "Restrooms" },
      { es: "Wifi", en: "Wi-Fi" },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: "placeholder",
  },
  {
    slug: "grand-hyatt",
    name: "Grand Hyatt",
    citySlug: "bogota",
    address: { es: "Calle 24A #57-60, Bogotá", en: "Calle 24A #57-60, Bogotá" },
    geo: null,
    connectors: ["GB-T"],
    powerKw: 60,
    points: 11,
    status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7" },
    pricing: null,
    services: [
      { es: "Valet", en: "Valet" },
      { es: "Restaurante", en: "Restaurant" },
      { es: "Parqueadero cubierto", en: "Covered parking" },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: "placeholder",
  },
  {
    slug: "san-fernando-plaza",
    name: "San Fernando Plaza",
    citySlug: "medellin",
    address: { es: "Cra. 43A #1-50, El Poblado, Medellín", en: "Cra. 43A #1-50, El Poblado, Medellín" },
    geo: null,
    connectors: ["CCS2"],
    powerKw: 120,
    points: 6,
    status: "operativa",
    hours: { es: "Lunes a domingo, 6:00–22:00", en: "Monday to Sunday, 6:00–22:00" },
    pricing: null,
    services: [
      { es: "Centro comercial", en: "Shopping mall" },
      { es: "Parqueadero", en: "Parking" },
      { es: "Baños", en: "Restrooms" },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: "placeholder",
  },
  {
    slug: "corredor-norte",
    name: "Corredor Norte",
    citySlug: "bogota",
    address: { es: "Autopista Norte, Bogotá", en: "Autopista Norte, Bogotá" },
    geo: null,
    connectors: ["CCS2"],
    powerKw: 150,
    points: 8,
    status: "proxima",
    hours: { es: "Próximamente", en: "Coming soon" },
    pricing: null,
    services: [],
    media: { photos: [] },
    dataStatus: "placeholder",
  },
];
