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
 * `~/core/about/infrastructure/content/company`.
 */

/* ------------------------------------------------------------------ */
/* B2B segments — they feed the /empresas selector                     */
/* ------------------------------------------------------------------ */

import type { BusinessSegment } from '~/core/business/domain/entities/BusinessSegment'
import type { Case } from '~/core/business/domain/entities/Case'

export const businessSegments: BusinessSegment[] = [
  {
    key: 'empresa',
    label: { es: 'Empresas', en: 'Companies', pt: 'Empresas' },
    headline: {
      es: 'Carga eléctrica para tu empresa, sin complicaciones.',
      en: 'EV charging for your company, without the hassle.',
      pt: 'Carregamento elétrico para sua empresa, sem complicações.',
    },
    proposition: {
      es: 'Llevamos la infraestructura de carga a tus sedes y nos encargamos de instalarla, operarla y mantenerla.',
      en: 'We bring the charging infrastructure to your sites and take care of installing, operating and maintaining it.',
      pt: 'Levamos a infraestrutura de carregamento às suas sedes e cuidamos de instalar, operar e manter.',
    },
    benefits: [
      {
        es: 'Instalación y operación de principio a fin',
        en: 'End-to-end installation and operation',
        pt: 'Instalação e operação de ponta a ponta',
      },
      {
        /* It said "incluidos". The word is gone: what is or is not included in
           a price is a commercial condition, and this page does not publish
           one. It says WHAT there is, not what it costs. */
        es: 'Mantenimiento y soporte',
        en: 'Maintenance and support',
        pt: 'Manutenção e suporte',
      },
      /* CONFIRMED by product on 2026-09-02: Voltop's back office supports
         them. */
      {
        es: 'Control de acceso y consumo',
        en: 'Access and usage control',
        pt: 'Controle de acesso e uso',
      },
      {
        es: 'Reportes de uso y energía',
        en: 'Usage and energy reporting',
        pt: 'Relatórios de uso e energia',
      },
    ],
    proofRef: 'universidad-ean',
  },
  {
    key: 'flota',
    label: { es: 'Flotas', en: 'Fleets', pt: 'Frotas' },
    headline: {
      es: 'Mantén tu flota lista para moverse.',
      en: 'Keep your fleet ready to move.',
      pt: 'Mantenha sua frota pronta para rodar.',
    },
    proposition: {
      /* It has never said "no availability surprises" and it still does not:
         that would be an availability GUARANTEE over a network that publishes
         no SLA. "Disponibles cuando los necesitas" is about the FLEET being
         ready, which is what sizing the infrastructure actually delivers. */
      es: 'Diseñamos la infraestructura de carga alrededor de tu operación para que tus vehículos estén disponibles cuando los necesitas.',
      en: 'We design the charging infrastructure around your operation so your vehicles are available when you need them.',
      pt: 'Projetamos a infraestrutura de carregamento em torno da sua operação para que seus veículos estejam disponíveis quando você precisar.',
    },
    /* ⚠️ TWO CONFIRMED CAPABILITIES CAME OFF THIS LIST on 2026-09-08, by
       editorial decision, and they are written down because they were not
       removed for being untrue — the opposite:

       · "Acceso a la red pública Voltop" — a fleet can also charge on the
         public network, which no competitor with private-only infrastructure
         can offer.
       · "Reserva de carga para tus turnos" — product confirmed reservations
         exist, and the note that replaced off-peak charging with them is still
         further down this file.

       Both are real differentiators and neither is stated anywhere else on
       /empresas. If the list ever grows back, start with these two. */
    benefits: [
      {
        es: 'Infraestructura dimensionada para tu operación',
        en: 'Infrastructure sized for your operation',
        pt: 'Infraestrutura dimensionada para sua operação',
      },
      {
        es: 'Gestión de carga según rutas y turnos',
        en: 'Charge management around routes and shifts',
        pt: 'Gestão de carregamento por rotas e turnos',
      },
      {
        es: 'Operación y mantenimiento',
        en: 'Operation and maintenance',
        pt: 'Operação e manutenção',
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
      es: 'Haz que tu espacio también sea un lugar para cargar.',
      en: 'Make your space a place to charge, too.',
      pt: 'Faça do seu espaço também um lugar para carregar.',
    },
    proposition: {
      es: 'Integramos carga eléctrica en hoteles, centros comerciales, parqueaderos y otros espacios para ofrecer un nuevo servicio a clientes y visitantes.',
      en: 'We integrate EV charging into hotels, malls, parking facilities and other spaces, to offer customers and visitors a new service.',
      pt: 'Integramos carregamento elétrico em hotéis, shoppings, estacionamentos e outros espaços para oferecer um novo serviço a clientes e visitantes.',
    },
    /* TWO CLAIMS CAME OFF THIS LIST on 2026-09-08 and should NOT come back as
       they were:

       · "Sin inversión inicial de tu parte" — a commercial condition, on a
         page that publishes no commercial conditions. §19 does not allow a
         benefit that commits terms product has not confirmed. The same phrase
         was removed from the /red host banner on the same date.
       · "Mayor permanencia y retorno de visitantes" — a business outcome with
         no source and no measurement. What we can say is that the space gains
         a service; whether it retains anyone is not ours to promise. */
    benefits: [
      {
        es: 'Instalación y operación a cargo de Voltop',
        en: 'Installation and operation handled by Voltop',
        pt: 'Instalação e operação por conta da Voltop',
      },
      {
        es: 'Mantenimiento y soporte',
        en: 'Maintenance and support',
        pt: 'Manutenção e suporte',
      },
      {
        es: 'Visibilidad en la red Voltop',
        en: 'Visibility across the Voltop network',
        pt: 'Visibilidade na rede Voltop',
      },
      {
        es: 'Un nuevo servicio para clientes y visitantes',
        en: 'A new service for customers and visitors',
        pt: 'Um novo serviço para clientes e visitantes',
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
      es: 'Hagamos crecer juntos la red de carga.',
      en: "Let's grow the charging network together.",
      pt: 'Vamos fazer a rede de carregamento crescer juntos.',
    },
    proposition: {
      /* Still NOT "the leading network of Colombia": a claim of market
         leadership with no source, on the very page a partner or an investor
         reads most closely. §33 does not allow it, and the invitation works
         better for that audience than the assertion. */
      es: 'Trabajamos con fabricantes, operadores y aliados estratégicos para integrar tecnología y ampliar la infraestructura de carga eléctrica en Colombia.',
      en: "We work with manufacturers, operators and strategic partners to integrate technology and expand Colombia's EV charging infrastructure.",
      pt: 'Trabalhamos com fabricantes, operadoras e parceiros estratégicos para integrar tecnologia e ampliar a infraestrutura de carregamento elétrico na Colômbia.',
    },
    /* This is the segment that GAINED an item: it had three where the other
       three had four, and in a selector where the four cases sit side by side
       that reads as the weakest option rather than as the shortest list. */
    benefits: [
      {
        es: 'Integración técnica con Voltop',
        en: 'Technical integration with Voltop',
        pt: 'Integração técnica com a Voltop',
      },
      {
        es: 'Alianzas para ampliar la red',
        en: 'Partnerships to expand the network',
        pt: 'Parcerias para ampliar a rede',
      },
      {
        es: 'Integración con fabricantes y operadores',
        en: 'Integration with manufacturers and operators',
        pt: 'Integração com fabricantes e operadoras',
      },
      {
        es: 'Desarrollo conjunto de nuevos puntos',
        en: 'Joint development of new charge points',
        pt: 'Desenvolvimento conjunto de novos pontos',
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
    /* Both texts NAME THE CLIENT and drop the generic framing. It said "una
       universidad con comunidad creciente de conductores eléctricos" — an
       anonymous case study about a university, on a page that has the
       university's name, its quote and a photograph of the person speaking.
       Anonymising evidence is what you do when you cannot use it. */
    challenge: {
      es: 'La Universidad EAN quería ofrecer carga eléctrica a su comunidad sin tener que encargarse de operar la infraestructura.',
      en: 'EAN University wanted to offer EV charging to its community without having to operate the infrastructure itself.',
      pt: 'A Universidade EAN queria oferecer carregamento elétrico à sua comunidade sem ter que operar a infraestrutura.',
    },
    /* No figures, and none are missing: "múltiples puntos y conectores" was
       vaguer than saying nothing, and the exact count lives on the station's
       own page, generated from the dataset. */
    solution: {
      es: 'Voltop llevó la carga al campus y hoy se encarga de su operación y mantenimiento, para que estudiantes, docentes y visitantes puedan cargar ahí.',
      en: 'Voltop brought charging to the campus and now handles its operation and maintenance, so students, faculty and visitors can charge there.',
      pt: 'A Voltop levou o carregamento ao campus e hoje cuida da operação e manutenção, para que estudantes, professores e visitantes possam carregar ali.',
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
