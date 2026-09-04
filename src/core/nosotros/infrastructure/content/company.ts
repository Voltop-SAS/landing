/**
 * Quiénes somos, en datos: métricas de impacto, aliados, testimonios y
 * fundador. El tipo `Metric` vive en `common` — ver su archivo.
 */

import type { Metric } from '~/core/common/domain/entities/Metric'
import type { Partner } from '~/core/nosotros/domain/entities/Partner'
import type { Testimonial } from '~/core/nosotros/domain/entities/Testimonial'
import type { Person } from '~/core/nosotros/domain/entities/Person'

export const metrics: Metric[] = [
  {
    key: 'estaciones',
    value: null,
    unit: null,
    label: {
      es: 'Estaciones en operación',
      en: 'Stations in operation',
      pt: 'Estações em operação',
    },
    source: null,
    validated: false,
    featured: true,
  },
  {
    key: 'ciudades',
    value: null,
    unit: null,
    label: { es: 'Ciudades', en: 'Cities', pt: 'Cidades' },
    source: null,
    validated: false,
    featured: true,
  },
  {
    key: 'energia',
    value: null,
    unit: 'MWh',
    label: { es: 'Energía entregada', en: 'Energy delivered', pt: 'Energia entregue' },
    source: null,
    validated: false,
  },
  {
    key: 'sesiones',
    value: null,
    unit: null,
    label: { es: 'Sesiones de carga', en: 'Charging sessions', pt: 'Sessões de carregamento' },
    source: null,
    validated: false,
  },
  {
    key: 'usuarios',
    value: null,
    unit: null,
    label: { es: 'Conductores conectados', en: 'Connected drivers', pt: 'Motoristas conectados' },
    source: null,
    validated: false,
  },
  {
    key: 'co2',
    value: null,
    unit: 't',
    label: { es: 'CO₂ evitado', en: 'CO₂ avoided', pt: 'CO₂ evitado' },
    source: null,
    validated: false,
  },
]

/* ------------------------------------------------------------------ */
/* Segmentos B2B — alimentan el selector de /empresas                   */
/* ------------------------------------------------------------------ */

export const partners: Partner[] = []

export const testimonials: Testimonial[] = [
  {
    quote: {
      es: 'La operación de nuestras estaciones ha sido impecable y confiable.',
      en: 'Running our stations has been flawless and reliable.',
      pt: 'A operação das nossas estações tem sido impecável e confiável.',
    },
    author: 'Helbert Perico',
    role: { es: 'Universidad EAN', en: 'EAN University', pt: 'Universidade EAN' },
    organization: 'Universidad EAN',
    photo: null,
    segment: 'b2b',
  },
  {
    quote: {
      es: 'Cargar mi vehículo cuesta muchísimo menos que la gasolina.',
      en: 'Charging my vehicle costs far less than gasoline.',
      pt: 'Carregar meu veículo custa muito menos do que gasolina.',
    },
    author: 'Mario Guzmán',
    role: { es: 'Conductor', en: 'Driver', pt: 'Motorista' },
    organization: null,
    photo: null,
    segment: 'b2c',
  },
]

export const founder: Person = {
  name: 'Bruno Ocampo',
  role: { es: 'Fundador y CEO', en: 'Founder & CEO', pt: 'Fundador e CEO' },
  photo: null,
  /* Texto entregado por Camilo el 2026-09-02 en respuesta a la propuesta
     alternativa. Sustituye a la versión anterior, que podía firmarla
     cualquier empresa de energía. */
  /* Actualizada el 2026-09-04. El cambio está en la primera frase: "Creemos
     que Colombia puede liderar" pasa a "Colombia tiene el potencial de
     liderar". Deja de ser una creencia de la empresa y pasa a ser una
     afirmación sobre el país — más firme y menos autorreferencial, que en la
     cita del fundador es la diferencia entre una opinión y una tesis. */
  quote: {
    es: 'Colombia tiene el potencial de liderar la movilidad eléctrica en América Latina. En Voltop estamos construyendo la infraestructura para hacerlo posible: una red confiable, escalable y cada vez más presente en el país. Lo que construimos hoy definirá cómo nos moveremos mañana.',
    en: "Colombia has the potential to lead electric mobility in Latin America. At Voltop we're building the infrastructure to make it possible: a reliable, scalable network with a growing presence across the country. What we build today will define how we move tomorrow.",
    pt: 'A Colômbia tem o potencial de liderar a mobilidade elétrica na América Latina. Na Voltop estamos construindo a infraestrutura para tornar isso possível: uma rede confiável, escalável e cada vez mais presente no país. O que construímos hoje vai definir como nos moveremos amanhã.',
  },
}
