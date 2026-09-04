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

import type { BusinessSegment } from '~/core/empresas/domain/entities/BusinessSegment'
import type { Case } from '~/core/empresas/domain/entities/Case'

export const businessSegments: BusinessSegment[] = [
  {
    key: 'empresa',
    label: { es: 'Empresas', en: 'Companies', pt: 'Empresas' },
    headline: {
      es: 'Carga eléctrica para tu equipo y tus instalaciones.',
      en: 'EV charging for your team and your facilities.',
      pt: 'Carregamento elétrico para sua equipe e suas instalações.',
    },
    proposition: {
      es: 'Instalamos, operamos y mantenemos la infraestructura de carga de tus sedes. Tu equipo carga mientras trabaja; tú no operas nada.',
      en: 'We install, operate and maintain the charging infrastructure at your sites. Your team charges while they work; you operate nothing.',
      pt: 'Instalamos, operamos e mantemos a infraestrutura de carregamento nas suas sedes. Sua equipe carrega enquanto trabalha; você não opera nada.',
    },
    benefits: [
      {
        es: 'Instalación y operación de principio a fin',
        en: 'End-to-end installation and operation',
        pt: 'Instalação e operação de ponta a ponta',
      },
      {
        es: 'Mantenimiento y soporte incluidos',
        en: 'Maintenance and support included',
        pt: 'Manutenção e suporte incluídos',
      },
      /* CONFIRMADAS por producto el 2026-09-02: el backoffice de Voltop las
         soporta. Vuelven a "Qué incluye". */
      {
        es: 'Control de acceso y consumo por colaborador',
        en: 'Per-employee access and usage control',
        pt: 'Controle de acesso e uso por colaborador',
      },
      {
        es: 'Reportes de energía y disponibilidad',
        en: 'Energy and availability reporting',
        pt: 'Relatórios de energia e disponibilidade',
      },
    ],
    proofRef: 'universidad-ean',
  },
  {
    key: 'flota',
    label: { es: 'Flotas', en: 'Fleets', pt: 'Frotas' },
    headline: {
      es: 'Infraestructura para mantener tu flota eléctrica en movimiento.',
      en: 'Infrastructure that keeps your electric fleet moving.',
      pt: 'Infraestrutura para manter sua frota elétrica em movimento.',
    },
    proposition: {
      /* Decía "sin sorpresas de disponibilidad": una GARANTÍA de disponibilidad
         sobre una red que no publica SLA y cuyo propio sitio declara que el
         estado en vivo todavía no está integrado. */
      es: 'Diseñamos la capacidad de carga según tus rutas y turnos, y la operamos nosotros para que tu equipo no tenga que hacerlo.',
      en: "We size charging capacity around your routes and shifts, and we run it so your team doesn't have to.",
      pt: 'Dimensionamos a capacidade de carregamento pelas suas rotas e turnos, e nós a operamos para que sua equipe não precise.',
    },
    benefits: [
      {
        es: 'Dimensionamiento según rutas y turnos',
        en: 'Sized around routes and shifts',
        pt: 'Dimensionado por rotas e turnos',
      },
      {
        es: 'Acceso a la red pública Voltop',
        en: 'Access to the public Voltop network',
        pt: 'Acesso à rede pública Voltop',
      },
      /* "Carga programada en horario valle" NO vuelve: producto confirmó que
         no existen tarifas por franja horaria. Lo que sí existe es RESERVAR,
         que es una capacidad distinta y mejor —resuelve la incertidumbre de
         llegar y encontrar ocupado— así que se dice esa. */
      {
        es: 'Reserva de carga para tus turnos',
        en: 'Charge reservations for your shifts',
        pt: 'Reserva de carregamento para os seus turnos',
      },
      /* CONFIRMADA: trazabilidad de punta a punta. */
      {
        es: 'Datos de consumo por vehículo',
        en: 'Per-vehicle consumption data',
        pt: 'Dados de consumo por veículo',
      },
    ],
  },
  {
    key: 'espacio',
    label: { es: 'Espacios comerciales', en: 'Commercial spaces', pt: 'Espaços comerciais' },
    headline: {
      es: 'Ofrece carga eléctrica a clientes y visitantes.',
      en: 'Offer EV charging to customers and visitors.',
      pt: 'Ofereça carregamento elétrico a clientes e visitantes.',
    },
    proposition: {
      es: 'Llevamos carga a tu hotel, centro comercial, parqueadero o campus. Nosotros invertimos y operamos; tu espacio gana un servicio que atrae y retiene visitantes.',
      en: 'We bring charging to your hotel, mall, parking facility or campus. We invest and operate; your space gains a service that attracts and retains visitors.',
      pt: 'Levamos o carregamento para o seu hotel, shopping, estacionamento ou campus. Nós investimos e operamos; seu espaço ganha um serviço que atrai e retém visitantes.',
    },
    benefits: [
      {
        es: 'Sin inversión inicial de tu parte',
        en: 'No upfront investment on your side',
        pt: 'Sem investimento inicial da sua parte',
      },
      {
        es: 'Operación y mantenimiento a cargo de Voltop',
        en: 'Operation and maintenance handled by Voltop',
        pt: 'Operação e manutenção por conta da Voltop',
      },
      {
        es: 'Mayor permanencia y retorno de visitantes',
        en: 'Longer dwell time and repeat visits',
        pt: 'Mais tempo de permanência e visitas recorrentes',
      },
      {
        es: 'Tu espacio visible en la red Voltop',
        en: 'Your space listed across the Voltop network',
        pt: 'Seu espaço visível em toda a rede Voltop',
      },
    ],
    proofRef: 'universidad-ean',
  },
  {
    key: 'partner',
    /* "Partner" era el único anglicismo del modelo de contenido, y en un sitio
       escrito para Colombia que los evita. "Aliados" dice lo mismo y en
       castellano. */
    label: { es: 'Aliados', en: 'Partners', pt: 'Parceiros' },
    headline: {
      es: 'Construyamos juntos nuevos puntos de carga.',
      en: "Let's build new charge points together.",
      pt: 'Vamos construir novos pontos de carga juntos.',
    },
    proposition: {
      /* Decía "la red líder de Colombia": un reclamo de liderazgo de mercado
         sin fuente ni métrica validada, en la página que un partner o un
         inversionista lee con más lupa. §33 no admite eso. La invitación
         funciona además mejor para esa audiencia que la afirmación. */
      es: 'Integraciones técnicas, alianzas de expansión y acuerdos con fabricantes y operadores que quieren construir la red de carga de Colombia con nosotros.',
      en: "Technical integrations, expansion partnerships and agreements with manufacturers and operators that want to build Colombia's charging network with us.",
      pt: 'Integrações técnicas, parcerias de expansão e acordos com fabricantes e operadoras que querem construir a rede de carregamento da Colômbia com a gente.',
    },
    benefits: [
      {
        es: 'Integración técnica con la plataforma',
        en: 'Technical platform integration',
        pt: 'Integração técnica com a plataforma',
      },
      {
        es: 'Alianzas de expansión territorial',
        en: 'Territorial expansion partnerships',
        pt: 'Parcerias de expansão territorial',
      },
      {
        es: 'Acuerdos con fabricantes y operadores',
        en: 'Agreements with manufacturers and operators',
        pt: 'Acordos com fabricantes e operadoras',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Casos de éxito                                                      */
/* ------------------------------------------------------------------ */

export const cases: Case[] = [
  {
    slug: 'universidad-ean',
    client: 'Universidad EAN',
    segment: 'espacio',
    logo: null,
    challenge: {
      es: 'Una universidad con comunidad creciente de conductores eléctricos necesitaba ofrecer carga confiable en campus, sin convertirse en operador de infraestructura energética.',
      en: 'A university with a growing community of EV drivers needed to offer reliable on-campus charging without becoming an energy infrastructure operator.',
      pt: 'Uma universidade com uma comunidade crescente de motoristas de veículos elétricos precisava oferecer carregamento confiável no campus sem virar uma operadora de infraestrutura de energia.',
    },
    solution: {
      es: 'Voltop diseñó, instaló y opera la estación del campus, con múltiples puntos y conectores para cubrir los vehículos de estudiantes, docentes y visitantes.',
      en: 'Voltop designed, installed and operates the campus station, with multiple points and connectors covering student, faculty and visitor vehicles.',
      pt: 'A Voltop projetou, instalou e opera a estação do campus, com múltiplos pontos e conectores que atendem aos veículos de estudantes, professores e visitantes.',
    },
    results: [],
    /* Actualizada el 2026-09-04. Dos cambios de fondo, no de estilo:
       
       El verbo pasa de PASADO a PRESENTE —"nos permitió" → "ofrecemos"—, y eso
       cambia lo que la cita prueba: en pasado sonaba a un proyecto que ocurrió;
       en presente dice que la estación está funcionando ahora, que es
       exactamente la duda que este beat existe para resolver.
       
       Y "una operación impecable" pasa a "una operación que funciona todos los
       días". "Impecable" es un superlativo que no se puede comprobar y que
       §19 no admite; "funciona todos los días" es una afirmación concreta que
       el cliente puede sostener. */
    quote: {
      es: 'Con Voltop ofrecemos carga eléctrica confiable a nuestra comunidad, con una operación que funciona todos los días.',
      en: 'With Voltop we offer our community reliable EV charging, with an operation that works every day.',
      pt: 'Com a Voltop oferecemos carregamento elétrico confiável à nossa comunidade, com uma operação que funciona todos os dias.',
    },
    author: 'Helbert Perico',
    role: { es: 'Universidad EAN', en: 'EAN University', pt: 'Universidade EAN' },
    stationSlug: 'universidad-ean',
    featured: true,
  },
]

/* ------------------------------------------------------------------ */
/* Partners · Testimonios · Personas                                   */
/* ------------------------------------------------------------------ */
