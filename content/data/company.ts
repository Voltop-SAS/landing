import type { Localized } from "@/lib/i18n/config";

/**
 * COLECCIONES · Métricas, casos, partners, testimonios y personas.
 * Ver docs/MASTER-PROJECT-DEFINITION.md §27 y §33.
 *
 * REGLA INVIOLABLE: no se inventan cifras. Toda métrica lleva `validated`.
 * Si `validated` es false, la UI la muestra como provisional o la omite.
 * REGLA DE ECONOMÍA: máximo DOS métricas provisionales visibles por página.
 */

/* ------------------------------------------------------------------ */
/* Métricas de impacto                                                 */
/* ------------------------------------------------------------------ */

export type Metric = {
  key: string;
  /** Valor real. `null` mientras no esté validado: no se inventa. */
  value: string | null;
  unit: string | null;
  label: Localized;
  /** Fuente del dato, para trazabilidad cuando se valide. */
  source: string | null;
  validated: boolean;
  /** Curaduría: cuáles se destacan cuando solo caben dos. */
  featured?: boolean;
};

export const metrics: Metric[] = [
  { key: "estaciones", value: null, unit: null, label: { es: "Estaciones en operación", en: "Stations in operation", pt: "Estações em operação", }, source: null, validated: false, featured: true },
  { key: "ciudades", value: null, unit: null, label: { es: "Ciudades", en: "Cities", pt: "Cidades", }, source: null, validated: false, featured: true },
  { key: "energia", value: null, unit: "MWh", label: { es: "Energía entregada", en: "Energy delivered", pt: "Energia entregue", }, source: null, validated: false },
  { key: "sesiones", value: null, unit: null, label: { es: "Sesiones de carga", en: "Charging sessions", pt: "Sessões de carregamento", }, source: null, validated: false },
  { key: "usuarios", value: null, unit: null, label: { es: "Conductores conectados", en: "Connected drivers", pt: "Motoristas conectados", }, source: null, validated: false },
  { key: "co2", value: null, unit: "t", label: { es: "CO₂ evitado", en: "CO₂ avoided", pt: "CO₂ evitado", }, source: null, validated: false },
];

/* ------------------------------------------------------------------ */
/* Segmentos B2B — alimentan el selector de /empresas                   */
/* ------------------------------------------------------------------ */

export type BusinessSegment = {
  key: string;
  label: Localized;
  headline: Localized;
  proposition: Localized;
  /** Capacidades CONFIRMADAS. Es lo único que se pinta. */
  benefits: Localized[];
  /**
   * Capacidades REDACTADAS PERO NO CONFIRMADAS. No se renderizan.
   *
   * §33 y §19 prohíben publicar como capacidad actual algo que el producto no
   * pueda respaldar hoy. Estas estaban en `benefits` —es decir, publicadas
   * bajo un rótulo que dice "Qué incluye"— y no constan en la única
   * documentación de producto que existe: los Términos y Condiciones, cuyo §4
   * enumera los servicios de la Plataforma (consultar ubicación y
   * disponibilidad, activar por QR, gestionar sesiones e historial, soporte).
   *
   * Se conservan aquí, no se borran: la redacción es buena y el día que
   * producto confirme que existen, se mueven a `benefits` y aparecen. Lo que
   * no puede seguir es presentarlas como un hecho.
   */
  benefitsPorConfirmar?: Localized[];
  /** Referencia a un caso de éxito que sirve de prueba para este segmento. */
  proofRef?: string;
};

export const businessSegments: BusinessSegment[] = [
  {
    key: "empresa",
    label: { es: "Empresa", en: "Company", pt: "Companhia", },
    headline: { es: "Carga para tu sede y tu equipo", en: "Charging for your site and your team", pt: "Carregamento para a sua sede e a sua equipe", },
    proposition: {
      es: "Instalamos, operamos y mantenemos la infraestructura de carga de tus sedes. Tu equipo carga mientras trabaja; tú no operas nada.",
      en: "We install, operate and maintain the charging infrastructure at your sites. Your team charges while they work; you operate nothing.",
      pt: "Instalamos, operamos e mantemos a infraestrutura de carregamento nas suas sedes. Sua equipe carrega enquanto trabalha; você não opera nada.",
    },
    benefits: [
      { es: "Instalación y operación de principio a fin", en: "End-to-end installation and operation", pt: "Instalação e operação de ponta a ponta", },
      { es: "Mantenimiento y soporte incluidos", en: "Maintenance and support included", pt: "Manutenção e suporte incluídos", },
    ],
    benefitsPorConfirmar: [
      { es: "Control de acceso y consumo por colaborador", en: "Per-employee access and usage control", pt: "Controle de acesso e uso por colaborador", },
      { es: "Reportes de energía y disponibilidad", en: "Energy and availability reporting", pt: "Relatórios de energia e disponibilidade", },
    ],
    proofRef: "universidad-ean",
  },
  {
    key: "flota",
    label: { es: "Flota", en: "Fleet", pt: "Frota", },
    headline: { es: "Infraestructura para que tu flota no pare", en: "Infrastructure that keeps your fleet moving", pt: "Infraestrutura que mantém sua frota rodando", },
    proposition: {
      /* Decía "sin sorpresas de disponibilidad": una GARANTÍA de disponibilidad
         sobre una red que no publica SLA y cuyo propio sitio declara que el
         estado en vivo todavía no está integrado. */
      es: "Diseñamos la capacidad de carga según tus rutas y turnos, y la operamos nosotros para que tu equipo no tenga que hacerlo.",
      en: "We size charging capacity around your routes and shifts, and we run it so your team doesn't have to.",
      pt: "Dimensionamos a capacidade de carregamento pelas suas rotas e turnos, e nós a operamos para que sua equipe não precise.",
    },
    benefits: [
      { es: "Dimensionamiento según rutas y turnos", en: "Sized around routes and shifts", pt: "Dimensionado por rotas e turnos", },
      { es: "Acceso a la red pública Voltop", en: "Access to the public Voltop network", pt: "Acesso à rede pública Voltop", },
    ],
    benefitsPorConfirmar: [
      { es: "Carga programada en horario valle", en: "Scheduled off-peak charging", pt: "Carregamento programado fora do pico", },
      { es: "Datos de consumo por vehículo", en: "Per-vehicle consumption data", pt: "Dados de consumo por veículo", },
    ],
  },
  {
    key: "espacio",
    label: { es: "Espacio comercial", en: "Property", pt: "Espaço", },
    headline: { es: "Tu espacio, con carga eléctrica", en: "Your space, with EV charging", pt: "Seu espaço, com carregamento elétrico", },
    proposition: {
      es: "Llevamos carga a tu hotel, centro comercial, parqueadero o campus. Nosotros invertimos y operamos; tu espacio gana un servicio que atrae y retiene visitantes.",
      en: "We bring charging to your hotel, mall, parking facility or campus. We invest and operate; your space gains a service that attracts and retains visitors.",
      pt: "Levamos o carregamento para o seu hotel, shopping, estacionamento ou campus. Nós investimos e operamos; seu espaço ganha um serviço que atrai e retém visitantes.",
    },
    benefits: [
      { es: "Sin inversión inicial de tu parte", en: "No upfront investment on your side", pt: "Sem investimento inicial da sua parte", },
      { es: "Operación y mantenimiento a cargo de Voltop", en: "Operation and maintenance handled by Voltop", pt: "Operação e manutenção por conta da Voltop", },
      { es: "Mayor permanencia y retorno de visitantes", en: "Longer dwell time and repeat visits", pt: "Mais tempo de permanência e visitas recorrentes", },
      { es: "Tu espacio visible en la red Voltop", en: "Your space listed across the Voltop network", pt: "Seu espaço visível em toda a rede Voltop", },
    ],
    proofRef: "universidad-ean",
  },
  {
    key: "partner",
    label: { es: "Partner", en: "Partner", pt: "Parceiro", },
    headline: { es: "Construyamos la red juntos", en: "Let's build the network together", pt: "Vamos construir a rede juntos", },
    proposition: {
      /* Decía "la red líder de Colombia": un reclamo de liderazgo de mercado
         sin fuente ni métrica validada, en la página que un partner o un
         inversionista lee con más lupa. §33 no admite eso. La invitación
         funciona además mejor para esa audiencia que la afirmación. */
      es: "Integraciones técnicas, alianzas de expansión y acuerdos con fabricantes y operadores que quieren construir la red de carga de Colombia con nosotros.",
      en: "Technical integrations, expansion partnerships and agreements with manufacturers and operators that want to build Colombia's charging network with us.",
      pt: "Integrações técnicas, parcerias de expansão e acordos com fabricantes e operadoras que querem construir a rede de carregamento da Colômbia com a gente.",
    },
    benefits: [
      { es: "Integración técnica con la plataforma", en: "Technical platform integration", pt: "Integração técnica com a plataforma", },
      { es: "Alianzas de expansión territorial", en: "Territorial expansion partnerships", pt: "Parcerias de expansão territorial", },
      { es: "Acuerdos con fabricantes y operadores", en: "Agreements with manufacturers and operators", pt: "Acordos com fabricantes e operadoras", },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Casos de éxito                                                      */
/* ------------------------------------------------------------------ */

export type Case = {
  slug: string;
  client: string;
  segment: string;
  /** Logo del cliente. Vacío hasta recibir el archivo con permiso de uso. */
  logo: string | null;
  challenge: Localized;
  solution: Localized;
  /** Resultados cuantitativos. Vacío mientras no haya cifras validadas. */
  results: { value: string; label: Localized }[];
  quote: Localized;
  author: string;
  role: Localized;
  /** Estación asociada, si aplica. */
  stationSlug?: string;
  featured?: boolean;
};

export const cases: Case[] = [
  {
    slug: "universidad-ean",
    client: "Universidad EAN",
    segment: "espacio",
    logo: null,
    challenge: {
      es: "Una universidad con comunidad creciente de conductores eléctricos necesitaba ofrecer carga confiable en campus, sin convertirse en operador de infraestructura energética.",
      en: "A university with a growing community of EV drivers needed to offer reliable on-campus charging without becoming an energy infrastructure operator.",
      pt: "Uma universidade com uma comunidade crescente de motoristas de veículos elétricos precisava oferecer carregamento confiável no campus sem virar uma operadora de infraestrutura de energia.",
    },
    solution: {
      es: "Voltop diseñó, instaló y opera la estación del campus, con múltiples puntos y conectores para cubrir los vehículos de estudiantes, docentes y visitantes.",
      en: "Voltop designed, installed and operates the campus station, with multiple points and connectors covering student, faculty and visitor vehicles.",
      pt: "A Voltop projetou, instalou e opera a estação do campus, com múltiplos pontos e conectores que atendem aos veículos de estudantes, professores e visitantes.",
    },
    results: [],
    quote: {
      es: "Voltop nos permitió ofrecer carga eléctrica confiable a nuestra comunidad, con una operación impecable.",
      en: "Voltop let us offer reliable EV charging to our community, with flawless operation.",
      pt: "A Voltop nos permitiu oferecer carregamento elétrico confiável à nossa comunidade, com operação impecável.",
    },
    author: "Herbert Perico",
    role: { es: "Universidad EAN", en: "EAN University", pt: "Universidade EAN", },
    stationSlug: "universidad-ean",
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Partners · Testimonios · Personas                                   */
/* ------------------------------------------------------------------ */

export type Partner = { name: string; type: "partner" | "host" | "cliente"; logo: string | null; url: string | null };

/** Vacío hasta recibir los logos con permiso de uso. La UI omite la franja si no hay registros. */
export const partners: Partner[] = [];

export type Testimonial = {
  quote: Localized;
  author: string;
  role: Localized;
  organization: string | null;
  photo: string | null;
  segment: "b2c" | "b2b";
};

export const testimonials: Testimonial[] = [
  {
    quote: { es: "La operación de nuestras estaciones ha sido impecable y confiable.", en: "Running our stations has been flawless and reliable.", pt: "A operação das nossas estações tem sido impecável e confiável.", },
    author: "Herbert Perico",
    role: { es: "Universidad EAN", en: "EAN University", pt: "Universidade EAN", },
    organization: "Universidad EAN",
    photo: null,
    segment: "b2b",
  },
  {
    quote: { es: "Cargar mi vehículo cuesta muchísimo menos que la gasolina.", en: "Charging my vehicle costs far less than gasoline.", pt: "Carregar meu veículo custa muito menos do que gasolina.", },
    author: "Mario Guzmán",
    role: { es: "Conductor", en: "Driver", pt: "Motorista", },
    organization: null,
    photo: null,
    segment: "b2c",
  },
];

export type Person = { name: string; role: Localized; photo: string | null; quote?: Localized };

export const founder: Person = {
  name: "Bruno Ocampo",
  role: { es: "Fundador y CEO", en: "Founder & CEO", pt: "Fundador e CEO", },
  photo: null,
  quote: {
    es: "Colombia está lista para un futuro eléctrico. Conectamos al país con infraestructura confiable, diseñada para crecer y transformar la movilidad.",
    en: "Colombia is ready for an electric future. We connect the country with reliable infrastructure, built to grow and transform mobility.",
    pt: "A Colômbia está pronta para um futuro elétrico. Conectamos o país com infraestrutura confiável, feita para crescer e transformar a mobilidade.",
  },
};
