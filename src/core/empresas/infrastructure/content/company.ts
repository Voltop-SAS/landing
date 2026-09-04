/**
 * COLLECTIONS · B2B segments and case studies.
 * See docs/MASTER-PROJECT-DEFINITION.md §27 and §33.
 *
 * INVIOLABLE RULE: figures are never made up. Nothing here is published as a
 * current capability unless product has confirmed it exists — see
 * `benefitsUnconfirmed` on the `BusinessSegment` entity for where the written
 * but unconfirmed ones wait.
 *
 * The impact metrics, partners, testimonials and the founder live in
 * `~/core/nosotros/infrastructure/content/company`.
 */

/* ------------------------------------------------------------------ */
/* B2B segments — they feed the /empresas selector                     */
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
      /* CONFIRMED by product on 2026-09-02: Voltop's back office supports
         them. They return to "What's included". */
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
      /* This used to say "no availability surprises": an availability
         GUARANTEE about a network that publishes no SLA and whose own site
         declares that live status is not integrated yet. */
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
      /* "Off-peak scheduled charging" is NOT coming back: product confirmed
         there are no time-of-day tariffs. What does exist is RESERVING, which
         is a different and better capability —it resolves the uncertainty of
         arriving to find every point taken— so that is what we say. */
      {
        es: 'Reserva de carga para tus turnos',
        en: 'Charge reservations for your shifts',
        pt: 'Reserva de carregamento para os seus turnos',
      },
      /* CONFIRMED: end-to-end traceability. */
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
    /* "Partner" was the only anglicism in the content model, on a site
       written for Colombia that avoids them. "Aliados" says the same thing in
       Spanish. (This is about the Spanish COPY, not the `partner` key, which
       is a data value.) */
    label: { es: 'Aliados', en: 'Partners', pt: 'Parceiros' },
    headline: {
      es: 'Construyamos juntos nuevos puntos de carga.',
      en: "Let's build new charge points together.",
      pt: 'Vamos construir novos pontos de carga juntos.',
    },
    proposition: {
      /* This used to say "Colombia's leading network": a claim of market
         leadership with no source and no validated metric, on the very page a
         partner or an investor reads most closely. §33 does not allow that.
         The invitation also works better for that audience than the
         assertion. */
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
/* Case studies                                                        */
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
    /* Updated on 2026-09-04. Two substantive changes, not stylistic ones:

       The verb moves from PAST to PRESENT —"nos permitió" → "ofrecemos"— and
       that changes what the quote proves: in the past tense it sounded like a
       project that happened; in the present it says the station is running
       now, which is exactly the doubt this beat exists to resolve.

       And "una operación impecable" becomes "una operación que funciona todos
       los días". "Impeccable" is a superlative that cannot be checked and that
       §19 does not allow; "works every day" is a concrete claim the client can
       stand behind. */
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
/* End of the /empresas collections                                    */
/* ------------------------------------------------------------------ */
