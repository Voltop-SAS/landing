import { media } from '~/core/common/infrastructure/content/media'

/**
 * COLLECTION · News
 * See docs/MASTER-PROJECT-DEFINITION.md §14 (architecture) and §27 (data).
 *
 * ── WHAT IT IS AND WHAT IT IS NOT ─────────────────────────────────────────
 * It is not a blog. It is the LOG of what Voltop builds: openings, events,
 * partnerships and announcements. The distinction is not just a name:
 *
 * - A blog demands content that has to be invented, and without cadence it
 *   looks dead. Three articles with an old date say the company has stalled.
 * - A log feeds on what the operation already produces. Every station that
 *   opens is an entry. With entries every few weeks it looks alive.
 *
 * The form follows from that decision: it is a chronological logbook, not a
 * magazine.
 *
 * ── THE RULE THAT GOVERNS THE MODEL ───────────────────────────────────────
 * An EMPTY `body` means the entry lives only in the index, with no page of its
 * own. An opening is two lines and a photo: forcing a click to read one
 * paragraph is friction with nothing in return, and it multiplies thin pages
 * that then compete against each other in search.
 *
 * Only entries with a body —an announcement, a partnership with context— open
 * into a page of their own, indexable and shareable. The page is generated if
 * there is material, not because the log entry exists.
 *
 * ⚠️ LAUNCH CONTENT. The entries describe real, verifiable facts from the
 * dataset and the media registry, but **the dates are not confirmed** and are
 * marked `dataStatus: "placeholder"`. Project rule (§33): data is never made
 * up, and whatever is not verified is declared as such. The UI labels every
 * provisional entry. See `docs/05-assets-todo`.
 */

import type { Post } from '~/core/news/domain/entities/Post'

export const posts: Post[] = [
  {
    slug: 'apertura-universidad-ean',
    type: 'apertura',
    date: '2026-06-18',
    title: {
      es: 'Nueva estación en la Universidad EAN',
      en: 'New station at Universidad EAN',
      pt: 'Nova estação na Universidade EAN',
    },
    summary: {
      /* Figures corrected against the real data (2026-09-02): 18 points and
         22–80 kW, not ten at 60. */
      es: 'Dieciocho puntos de carga en el campus, abiertos al público y en operación permanente.',
      en: 'Eighteen charging points on campus, open to the public and operating around the clock.',
      pt: 'Dezoito pontos de carregamento no campus, abertos ao público e em operação permanente.',
    },
    cover: media.eanOpening,
    stationSlug: 'universidad-ean',
    citySlug: 'bogota',
    featured: true,
    /* The only entry with a body: it is the one with its own registered
       material. */
    body: [
      {
        kind: 'parrafo',
        text: {
          es: 'La estación de la Universidad EAN entra en operación con dieciocho puntos de carga de 22 a 80 kW, disponibles las 24 horas y abiertos tanto a la comunidad universitaria como a cualquier conductor.',
          en: 'The Universidad EAN station enters service with eighteen charging points from 22 to 80 kW, available 24 hours a day and open both to the university community and to any driver.',
          pt: 'A estação da Universidade EAN entra em operação com dezoito pontos de carregamento de 22 a 80 kW, disponíveis 24 horas por dia e abertos tanto à comunidade universitária quanto a qualquer motorista.',
        },
      },
      {
        kind: 'subtitulo',
        text: { es: 'Por qué un campus', en: 'Why a campus', pt: 'Por que um campus' },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Un campus concentra permanencia: quien llega se queda varias horas. Es el lugar donde cargar deja de ser una parada y pasa a ocurrir mientras se hace otra cosa, que es el criterio con el que Voltop elige dónde construir.',
          en: 'A campus concentrates dwell time: people who arrive stay for hours. It is where charging stops being a stop and starts happening while you do something else — the criterion Voltop uses to decide where to build.',
          pt: 'Um campus concentra permanência: quem chega fica por várias horas. É onde carregar deixa de ser uma parada e passa a acontecer enquanto você faz outra coisa — o critério que a Voltop usa para decidir onde construir.',
        },
      },
      { kind: 'media', asset: media.eanOpening },
    ],
    status: 'publicado',
    dataStatus: 'placeholder',
  },
  {
    slug: 'apertura-wake-medellin',
    type: 'apertura',
    date: '2026-04-21',
    title: {
      es: 'Nueva estación de carga rápida Voltop en Wake Medellín',
      en: 'New Voltop fast-charging station at Wake Medellín',
      pt: 'Nova estação de carregamento rápido Voltop no Wake Medellín',
    },
    summary: {
      es: 'Voltop amplía su red en Medellín con una nueva estación de carga rápida en Wake, equipada con cargadores de hasta 80 kW de potencia para ofrecer una experiencia de carga más ágil a los conductores de vehículos eléctricos.',
      en: 'Voltop expands its network in Medellín with a new fast-charging station at Wake, fitted with chargers of up to 80 kW to give electric vehicle drivers a quicker charging experience.',
      pt: 'A Voltop amplia sua rede em Medellín com uma nova estação de carregamento rápido no Wake, equipada com carregadores de até 80 kW para oferecer uma experiência de carregamento mais ágil aos motoristas de veículos elétricos.',
    },
    cover: media.wakeOpening,
    coverCaption: {
      es: 'Así inauguramos Wake: una nueva estación Voltop con carga rápida de hasta 80 kW en Medellín.',
      en: 'This is how we opened Wake: a new Voltop station with fast charging of up to 80 kW in Medellín.',
      pt: 'Assim inauguramos o Wake: uma nova estação Voltop com carregamento rápido de até 80 kW em Medellín.',
    },
    stationSlug: 'wake',
    citySlug: 'medellin',
    featured: true,
    /* The body used to open with a `media` block that was THE SAME asset as
       the cover, so the entry showed the video twice in a row. The block was
       removed and not the cover: the cover is also the metadata image and the
       one used in the log index.

       Its caption went with it — "Así vivimos la apertura de Wake, nuestra
       nueva estación de carga rápida en Medellín" — and it is not missed: it
       repeated the entry's own headline a couple of centimetres below it. */
    body: [
      {
        kind: 'subtitulo',
        text: {
          es: 'Hasta 80 kW para cargar más rápido',
          en: 'Up to 80 kW to charge faster',
          pt: 'Até 80 kW para carregar mais rápido',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'La nueva estación de Voltop en Wake se suma a nuestra red de carga en Medellín con una potencia de hasta 80 kW, ofreciendo una nueva alternativa para cargar vehículos eléctricos en la ciudad.',
          en: "Voltop's new station at Wake joins our charging network in Medellín with power of up to 80 kW, adding another option for charging electric vehicles in the city.",
          pt: 'A nova estação da Voltop no Wake se soma à nossa rede de carregamento em Medellín com potência de até 80 kW, oferecendo mais uma alternativa para carregar veículos elétricos na cidade.',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'La carga rápida permite aprovechar mejor el tiempo de cada parada y continuar el recorrido con mayor facilidad. Desde Wake, seguimos ampliando una red pensada para integrar la carga a los lugares y momentos que ya hacen parte del día a día.',
          en: 'Fast charging makes better use of every stop and makes getting back on the road easier. From Wake, we keep expanding a network designed to fit charging into the places and moments that are already part of the day.',
          pt: 'O carregamento rápido permite aproveitar melhor o tempo de cada parada e seguir viagem com mais facilidade. A partir do Wake, seguimos ampliando uma rede pensada para integrar o carregamento aos lugares e momentos que já fazem parte do dia a dia.',
        },
      },
      {
        kind: 'subtitulo',
        text: {
          es: 'Una red que sigue creciendo en Medellín',
          en: 'A network that keeps growing in Medellín',
          pt: 'Uma rede que segue crescendo em Medellín',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Esta apertura representa un nuevo paso en la expansión de Voltop en la ciudad. Seguimos desarrollando infraestructura de carga confiable y estratégicamente ubicada para acompañar el crecimiento de la movilidad eléctrica en Colombia.',
          en: "This opening marks another step in Voltop's expansion across the city. We keep developing reliable, strategically located charging infrastructure to support the growth of electric mobility in Colombia.",
          pt: 'Esta abertura representa mais um passo na expansão da Voltop na cidade. Seguimos desenvolvendo infraestrutura de carregamento confiável e estrategicamente localizada para acompanhar o crescimento da mobilidade elétrica na Colômbia.',
        },
      },
      {
        kind: 'parrafo',
        text: {
          es: 'Con Wake sumamos una nueva ubicación a una red que continúa creciendo y acercando la carga eléctrica a más conductores.',
          en: 'With Wake we add another location to a network that keeps growing and bringing EV charging closer to more drivers.',
          pt: 'Com o Wake somamos mais uma localização a uma rede que continua crescendo e aproximando o carregamento elétrico de mais motoristas.',
        },
      },
    ],
    status: 'publicado',
    dataStatus: 'verified',
  },
  /* THERE WERE TWO MORE ENTRIES HERE: "San Fernando Plaza" and "Corredor
     Norte". They were withdrawn on 2026-09-02 along with their stations: they
     announced openings of points that do not exist. A published opening for a
     station that does not exist is not out-of-date data, it is false data, and
     the log loses its only function —being the place that records what
     actually happened— the moment it admits one. */
  {
    slug: 'grand-hyatt-bogota',
    type: 'alianza',
    date: '2026-03-11',
    title: {
      es: 'Voltop llega al Grand Hyatt Bogotá',
      en: 'Voltop arrives at Grand Hyatt Bogotá',
      pt: 'A Voltop chega ao Grand Hyatt Bogotá',
    },
    summary: {
      es: 'Once puntos de carga en uno de los hoteles con mayor tránsito corporativo de la ciudad.',
      en: "Eleven charging points at one of the city's busiest corporate hotels.",
      pt: 'Onze pontos de carregamento em um dos hotéis com maior trânsito corporativo da cidade.',
    },
    stationSlug: 'grand-hyatt',
    citySlug: 'bogota',
    body: [],
    status: 'publicado',
    dataStatus: 'placeholder',
  },
]
