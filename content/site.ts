import type { Localized } from "@/lib/i18n";

/**
 * Contenido del sitio como DATOS (separado del diseño), bilingüe {es,en}.
 * ⚠️ PLACEHOLDERS: cifras "XX" no son reales; media pendiente de assets reales.
 */

/** Navegación primaria → páginas internas (Home presenta, internas profundizan). */
export const nav: { label: Localized; href: string }[] = [
  { label: { es: "Red", en: "Network" }, href: "/red" },
  { label: { es: "Empresas", en: "Business" }, href: "/empresas" },
  { label: { es: "Nosotros", en: "Company" }, href: "/nosotros" },
];

/** Métricas de impacto — VALORES PLACEHOLDER (validado: false). */
export const impactMetrics: { value: string; label: Localized; validated: boolean }[] = [
  { value: "XX", label: { es: "Estaciones", en: "Stations" }, validated: false },
  { value: "XX", label: { es: "Ciudades", en: "Cities" }, validated: false },
  { value: "XX", label: { es: "MWh entregados", en: "MWh delivered" }, validated: false },
  { value: "XX", label: { es: "t CO₂ evitadas", en: "t CO₂ avoided" }, validated: false },
];

export const howItWorks: { step: string; title: Localized; body: Localized }[] = [
  { step: "01", title: { es: "Encuentra", en: "Find" }, body: { es: "Ubica una estación disponible y compatible cerca de ti.", en: "Locate an available, compatible station near you." } },
  { step: "02", title: { es: "Conecta", en: "Connect" }, body: { es: "Enchufa y activa la carga desde la app en segundos.", en: "Plug in and start charging from the app in seconds." } },
  { step: "03", title: { es: "Sigue", en: "Go" }, body: { es: "Consulta el progreso en tiempo real y continúa tu día.", en: "Track progress in real time and get on with your day." } },
];

/** Segmentos B2B — selector de "Empresas" (progressive disclosure). */
export const businessSegments: { key: string; label: Localized; value: Localized }[] = [
  { key: "empresa", label: { es: "Empresa", en: "Company" }, value: { es: "Carga para sedes y colaboradores, gestionada de principio a fin.", en: "Charging for sites and employees, managed end to end." } },
  { key: "flota", label: { es: "Flota", en: "Fleet" }, value: { es: "Infraestructura confiable y datos de operación para tu flota eléctrica.", en: "Reliable infrastructure and operational data for your electric fleet." } },
  { key: "espacio", label: { es: "Espacio comercial", en: "Property" }, value: { es: "Moderniza y rentabiliza tu espacio con carga, sin operarla tú.", en: "Modernize and monetize your space with charging — without operating it." } },
  { key: "partner", label: { es: "Partner", en: "Partner" }, value: { es: "Integra o alíate con la red de carga líder de Colombia.", en: "Integrate or partner with Colombia's leading charging network." } },
];

export const testimonials: { quote: Localized; author: string; role: Localized }[] = [
  { quote: { es: "La operación de nuestras estaciones ha sido impecable y confiable.", en: "Running our stations has been flawless and reliable." }, author: "Herbert Perico", role: { es: "Universidad EAN", en: "EAN University" } },
  { quote: { es: "Cargar mi vehículo cuesta muchísimo menos que la gasolina.", en: "Charging my vehicle costs far less than gasoline." }, author: "Mario Guzmán", role: { es: "Conductor", en: "Driver" } },
];

/** Estación como entidad escalable desde datos (base de /red/[estacion]). */
export type Station = {
  slug: string;
  name: string;
  city: string;
  address: Localized;
  connectors: string[];
  powerKw: number;
  points: number;
  status: "operativa" | "proxima" | "mantenimiento";
  hours: Localized;
  services: Localized[];
  featured?: boolean;
  hasVideo?: boolean;
};

export const stations: Station[] = [
  {
    slug: "universidad-ean", name: "Universidad EAN", city: "Bogotá",
    address: { es: "Calle 79 #11-45, Bogotá", en: "Calle 79 #11-45, Bogotá" },
    connectors: ["CCS1", "CCS2", "GB-T"], powerKw: 60, points: 10, status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7" },
    services: [{ es: "Techo", en: "Covered" }, { es: "Cafetería", en: "Café" }, { es: "Baños", en: "Restrooms" }],
    featured: true, hasVideo: true,
  },
  {
    slug: "grand-hyatt", name: "Grand Hyatt", city: "Bogotá",
    address: { es: "Calle 24A #57-60, Bogotá", en: "Calle 24A #57-60, Bogotá" },
    connectors: ["GB-T"], powerKw: 60, points: 11, status: "operativa",
    hours: { es: "Abierto 24/7", en: "Open 24/7" },
    services: [{ es: "Valet", en: "Valet" }, { es: "Restaurante", en: "Restaurant" }],
    featured: true,
  },
  {
    slug: "san-fernando-plaza", name: "San Fernando Plaza", city: "Medellín",
    address: { es: "Cra. 43A #1-50, El Poblado, Medellín", en: "Cra. 43A #1-50, El Poblado, Medellín" },
    connectors: ["CCS2"], powerKw: 120, points: 6, status: "operativa",
    hours: { es: "L–D 6:00–22:00", en: "Mon–Sun 6:00–22:00" },
    services: [{ es: "Centro comercial", en: "Mall" }, { es: "Parqueadero", en: "Parking" }],
    featured: true, hasVideo: true,
  },
  {
    slug: "corredor-norte", name: "Corredor Norte", city: "Próximamente",
    address: { es: "Autopista Norte, Bogotá", en: "Autopista Norte, Bogotá" },
    connectors: ["CCS2"], powerKw: 150, points: 8, status: "proxima",
    hours: { es: "Próximamente", en: "Coming soon" }, services: [],
  },
];

export const featuredStations = stations.filter((s) => s.featured);
export const getStation = (slug: string) => stations.find((s) => s.slug === slug);

export const founder = {
  quote: {
    es: "Colombia está lista para un futuro eléctrico. Conectamos al país con infraestructura confiable, diseñada para crecer y transformar la movilidad.",
    en: "Colombia is ready for an electric future. We connect the country with reliable infrastructure, built to grow and transform mobility.",
  } satisfies Localized,
  author: "Bruno Ocampo",
  role: { es: "Fundador y CEO", en: "Founder & CEO" } satisfies Localized,
};

/** Caso real EAN — beat de personas/partnership en Home. */
export const eanCase = {
  quote: {
    es: "Voltop nos permitió ofrecer carga eléctrica confiable a nuestra comunidad, con una operación impecable.",
    en: "Voltop let us offer reliable EV charging to our community, with flawless operation.",
  } satisfies Localized,
  author: "Herbert Perico",
  role: { es: "Universidad EAN", en: "EAN University" } satisfies Localized,
};
