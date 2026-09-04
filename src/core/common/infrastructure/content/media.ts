/**
 * THE ASSET REGISTRY
 *
 * The types live in `~/core/common/domain/entities/Media`; the catalogue lives
 * here. The exception is `MediaKey`, which stays: it is `keyof typeof media`, a
 * type DERIVED from the value, and separating it from that value would leave it
 * pointing at nothing.
 */

import type { MediaAsset } from '~/core/common/domain/entities/Media'

export const media = {
  /** SIGNATURE MOMENT — proof of the ability to build. */
  /**
   * SIGNATURE MOMENT · delivered 2026-09-01.
   *
   * ── WHY THE LOOP NEEDED A FADE ───────────────────────────────────────────
   * The original (`C1972.mov`, kept outside the repository) is 27 s of HEVC
   * Main 10 at 4K. It is a continuous TRACKING SHOT: measured, the camera moves
   * between 3.5 and 14.4 per second and **never stops**. The consequences:
   *
   * · There is no window that closes. Every 10–12 s window was evaluated by
   *   comparing the half-second sequence around each end: best cost 23.8 out of
   *   255, worst 36.7. A narrow range, and all of it high.
   * · Cross-fading the tail over the head plateaus at 12.6 and produces a
   *   double exposure: it dissolves between two different images.
   * · Ping-pong closes numerically (6.4) but **looks wrong**: the motion blur
   *   runs backwards and the eye reads it as rewinding. Verified by the user
   *   watching it, not by a metric.
   *
   * What does work on a shot that keeps moving: a STRAIGHT loop that fades in
   * and out to the background colour (`--color-canvas`). Both ends arrive at
   * the same tone, so there is no jump — measured closure **3.7/255** — and
   * under the section's dark veil it reads as the shot taking a breath rather
   * than as an effect.
   *
   * The fade is 0.5 s and no more: it closes just as well as 0.8 s (2.2) while
   * interrupting for half as long.
   *
   * ── THE POSTER DOES NOT COME FROM FRAME 0 ────────────────────────────────
   * With a faded entry, frame 0 is almost black. The poster is taken from the
   * MIDDLE of the loop, which is what should be visible while the video loads
   * and what stays fixed under `prefers-reduced-motion`.
   */
  stationMedellin: {
    id: 'estacion-medellin',
    kind: 'video',
    src: '/estacion-medellin-loop.mp4',
    /* 960×540 · 0.66 MB against the master's 2.92 MB. */
    srcMobile: '/estacion-medellin-loop-movil.mp4',
    poster: '/estacion-medellin-poster.jpg',
    alt: {
      es: 'Nueva estación de carga Voltop en Medellín, vista general de la infraestructura',
      en: 'New Voltop charging station in Medellín, wide view of the infrastructure',
      pt: 'Nova estação de carregamento Voltop em Medellín, vista geral da infraestrutura',
    },
    role: {
      es: 'Signature moment. Demuestra que Voltop construye infraestructura real, no puntos de carga.',
      en: 'Signature moment. Proves Voltop builds real infrastructure, not charging points.',
      pt: 'Signature moment. Prova que a Voltop constrói infraestrutura real, não pontos de carregamento.',
    },
    /** Duration of the LOOP as served, not of the original cut. */
    duration: '0:11',
    aspect: '16/9',
    availability: 'entregado',
  },

  /** Proof of institutional partnership, and of people. */
  eanOpening: {
    id: 'apertura-ean',
    kind: 'video',
    src: null,
    poster: null,
    alt: {
      es: 'Apertura de la estación Voltop en la Universidad EAN, con directivos de la universidad y el CEO de Voltop',
      en: "Opening of the Voltop station at EAN University, with university leadership and Voltop's CEO",
      pt: 'Abertura da estação Voltop na Universidade EAN, com diretores da universidade e o CEO da Voltop',
    },
    role: {
      es: 'Prueba humana e institucional. Sirve simultáneamente a confianza B2B y a marca.',
      en: 'Human and institutional proof. Serves both B2B trust and brand.',
      pt: 'Prova humana e institucional. Serve à confiança B2B e à marca.',
    },
    duration: '2:05',
    aspect: '16/9',
    availability: 'confirmado-no-entregado',
  },

  /** Proof of purpose and leadership. */
  ceoVision: {
    id: 'vision-ceo',
    kind: 'video',
    src: null,
    poster: null,
    alt: {
      es: 'Bruno Ocampo, fundador y CEO de Voltop, hablando desde una estación de carga',
      en: 'Bruno Ocampo, founder and CEO of Voltop, speaking from a charging station',
      pt: 'Bruno Ocampo, fundador e CEO da Voltop, falando de uma estação de carregamento',
    },
    role: {
      es: 'Propósito y liderazgo. Íntimo y breve, no corporativo.',
      en: 'Purpose and leadership. Intimate and brief, not corporate.',
      pt: 'Propósito e liderança. Íntimo e breve, não corporativo.',
    },
    duration: '0:45',
    aspect: '16/9',
    availability: 'confirmado-no-entregado',
  },

  /** Breathing material: it conveys scale without a single figure. */
  wideInfrastructure: {
    id: 'infraestructura-amplia',
    kind: 'photo',
    src: null,
    poster: null,
    alt: {
      es: 'Estación de carga Voltop en operación, con vehículos conectados',
      en: 'Voltop charging station in operation, with vehicles plugged in',
      pt: 'Estação de carregamento Voltop em operação, com veículos conectados',
    },
    role: {
      es: 'Respiración y contraste. Escala física sin datos.',
      en: 'Breathing room and contrast. Physical scale without data.',
      pt: 'Respiro e contraste. Escala física sem dados.',
    },
    aspect: '21/9',
    availability: 'confirmado-no-entregado',
  },

  retailSpace: {
    id: 'espacio-comercial',
    kind: 'photo',
    src: null,
    poster: null,
    alt: {
      es: 'Puntos de carga Voltop integrados en el parqueadero de un espacio comercial',
      en: "Voltop charging points integrated into a commercial space's parking area",
      pt: 'Pontos de carregamento Voltop integrados ao estacionamento de um espaço comercial',
    },
    role: {
      es: 'Evidencia B2B: la infraestructura dentro de un negocio real.',
      en: 'B2B evidence: infrastructure inside a real business.',
      pt: 'Evidência B2B: infraestrutura dentro de um negócio real.',
    },
    aspect: '4/3',
    availability: 'confirmado-no-entregado',
  },

  chargingDetail: {
    id: 'detalle-carga',
    kind: 'photo',
    src: null,
    poster: null,
    alt: {
      es: 'Detalle de un conector de carga Voltop acoplado a un vehículo eléctrico',
      en: 'Close-up of a Voltop connector plugged into an electric vehicle',
      pt: 'Detalhe de um conector Voltop plugado em um veículo elétrico',
    },
    role: {
      es: 'Textura y precisión: el detalle físico que hace tangible la tecnología.',
      en: 'Texture and precision: the physical detail that makes the technology tangible.',
      pt: 'Textura e precisão: o detalhe físico que torna a tecnologia tangível.',
    },
    aspect: '3/2',
    availability: 'confirmado-no-entregado',
  },

  /**
   * REAL PHOTOGRAPHY · two assets delivered 2026-09-01.
   *
   * ── WHY NEITHER POINTS AT THE DELIVERED FILE ─────────────────────────────
   * The originals — `Hero.png` (60.9 MB) and `Hero_Banner.png` (50.3 MB) —
   * exceed the limit of Next's image optimizer, which rejects any source over
   * **50,000,000 bytes** (`ERR_MAX_BODY_SIZE_EXCEEDED`). Above that figure the
   * image DOES NOT RENDER, and the limit is not configurable. Serving them
   * unoptimized would mean shipping tens of MB to the browser.
   *
   * Each has its own web master derived at 2560 px wide, the size
   * `docs/05-assets-todo` fixes for full-bleed compositions, preserving the
   * original's exact 3/2. The originals stay in `public/` and **must leave the
   * repository**: 111 MB of binary do not belong in a git tree.
   */

  /** BEAT 1 · HERO. A connected vehicle: charging happening, not idle hardware. */
  heroVehicleCharging: {
    id: 'hero-vehiculo-cargando',
    kind: 'photo',
    src: '/hero-vehiculo-cargando.jpg',
    poster: null,
    alt: {
      es: 'Vehículo eléctrico conectado a un cargador Voltop en un parqueadero cubierto',
      en: 'Electric vehicle plugged into a Voltop charger in a covered parking facility',
      pt: 'Veículo elétrico conectado a um carregador Voltop em um estacionamento coberto',
    },
    role: {
      es: 'Fondo del beat 1. Muestra el servicio en uso —el cable conectado, el equipo con marca— en lugar de infraestructura vacía. Es el elemento LCP de la Home.',
      en: "Beat 1 background. Shows the service in use — cable connected, branded hardware — rather than empty infrastructure. It is the Home's LCP element.",
      pt: 'Fundo do beat 1. Mostra o serviço em uso — cabo conectado, equipamento com marca — em vez de infraestrutura vazia. É o elemento LCP da Home.',
    },
    aspect: '3/2',
    availability: 'entregado',
  },

  /**
   * BEAT 2 · SIGNATURE MOMENT. It fills the slot the `stationMedellin` video
   * used to hold; that video is still undelivered and is kept in this registry,
   * so when it arrives the section can go back to it by changing one line.
   *
   * It fits the beat's headline — "No instalamos cargadores, construimos
   * lugares" — because it shows several stations in a real space rather than a
   * single isolated unit.
   */
  stationInfrastructure: {
    id: 'estacion-infraestructura',
    kind: 'photo',
    src: '/estacion-infraestructura.jpg',
    poster: null,
    alt: {
      es: 'Estaciones de carga Voltop en operación en un parqueadero cubierto, con vehículos conectados',
      en: 'Voltop charging stations in service in a covered parking facility, with vehicles plugged in',
      pt: 'Estações de carregamento Voltop em operação em um estacionamento coberto, com veículos conectados',
    },
    role: {
      es: 'Fondo del beat 2. Varias estaciones en un mismo espacio: la prueba de que Voltop construye lugares y no puntos sueltos.',
      en: 'Beat 2 background. Several stations in one space: proof that Voltop builds places, not isolated points.',
      pt: 'Fundo do beat 2. Várias estações em um mesmo espaço: a prova de que a Voltop constrói lugares e não pontos isolados.',
    },
    aspect: '3/2',
    availability: 'entregado',
  },

  /**
   * CITIES · BEAT 3.
   *
   * Both coverage cards use the photograph as their dominant element: it is
   * what turns "Bogotá · 2 estaciones" into a real place you can drive to.
   * Without it the card is a label with a number on it.
   *
   * DELIVERED 2026-09-04, and they fit with no retouching: they arrived at
   * 1672×941 and 1671×941, which is exactly 16/9. They were converted from PNG
   * to JPEG for the handoff — 2.4 MB each against 0.3 — because a PNG is a
   * lossless format doing a lossy job, and its weight in a git tree is
   * permanent. The resolution did not change, and both are dusk views with the
   * lower band in shadow — exactly where the name and the counter land. The
   * composition did not change a single line when they were dropped in: that is
   * what you gain by declaring the slot with its shape and its function instead
   * of leaving a grey rectangle.
   */
  cityBogota: {
    id: 'ciudad-bogota',
    kind: 'photo',
    src: '/ciudad-bogota.jpg',
    poster: null,
    alt: {
      es: 'Vista de Bogotá, ciudad donde Voltop tiene estaciones de carga en operación',
      en: 'View of Bogotá, a city where Voltop has charging stations in service',
      pt: 'Vista de Bogotá, cidade onde a Voltop tem estações de carregamento em operação',
    },
    role: {
      es: 'Tarjeta de cobertura del beat 3. Da lugar real a la cifra de estaciones de Bogotá.',
      en: "Beat 3 coverage card. Gives a real place to Bogotá's station count.",
      pt: 'Cartão de cobertura do beat 3. Dá um lugar real à contagem de estações de Bogotá.',
    },
    aspect: '16/9',
    availability: 'entregado',
  },

  cityMedellin: {
    id: 'ciudad-medellin',
    kind: 'photo',
    src: '/ciudad-medellin.jpg',
    poster: null,
    alt: {
      es: 'Vista de Medellín, ciudad donde Voltop tiene estaciones de carga en operación',
      en: 'View of Medellín, a city where Voltop has charging stations in service',
      pt: 'Vista de Medellín, cidade onde a Voltop tem estações de carregamento em operação',
    },
    role: {
      es: 'Tarjeta de cobertura del beat 3. Da lugar real a la cifra de estaciones de Medellín.',
      en: "Beat 3 coverage card. Gives a real place to Medellín's station count.",
      pt: 'Cartão de cobertura do beat 3. Dá um lugar real à contagem de estações de Medellín.',
    },
    aspect: '16/9',
    availability: 'entregado',
  },

  /**
   * PORTRAITS FOR THE TWO QUOTES · beats 5 and 7.
   *
   * The site's two quote sections share their treatment — see
   * `QuoteAttribution` — and so they also share an asset shape: square, because
   * it is the only ratio that works the same in beat 5's attribution row and
   * over beat 7's narrow column without recomposing anything.
   *
   * WHAT IS NEEDED: a 1/1 portrait, framed from the shoulders up, with the
   * person looking at the camera and a neutral, dark background. Not a white
   * studio background: on a dark-first site, a light 96px cut-out becomes the
   * brightest point in the section and takes the eye ahead of the quote, which
   * is the thing we are trying to get read.
   *
   * ── THE TWO DO NOT SHARE A SIZE, AND THAT IS DELIBERATE ──────────────────
   * Helbert Perico's is a 96px THUMBNAIL in the attribution row: it is a
   * testimonial, and what it certifies is who said it. Bruno Ocampo's takes
   * half a column at 2/3 portrait: it is his vision, and there the person
   * carries as much weight as the words. Same frame treatment — structural
   * radius, hairline — and opposite scales, because the functions are opposite.
   *
   * WHAT IS NEEDED for the founder's: a 2/3 vertical portrait, half-body or
   * three-quarters, neutral dark background. At 458px wide it is no longer a
   * thumbnail: the background is visible, and a light background at that size
   * does compete with the quote beside it.
   *
   * ── HELBERT PERICO'S ARRIVED 2026-09-04, WITH TWO DEVIATIONS ─────────────
   * At 1/1 and 2048px, which fit with nothing to change. But the framing is
   * HALF-BODY — seated, hands on the table — and the background is LIGHT.
   *
   * The framing is handled in `QuoteAttribution` with a CSS re-crop: at 96px, a
   * half-body photo leaves the face at around 35px and nobody is recognisable.
   * The zoom crops towards the face without touching the file, so the day a
   * tight framing arrives it is enough to remove it.
   *
   * The light background is NOT corrected: dimming a person's face so it "fits"
   * the dark register is worse than the problem it fixes. If a version with a
   * dark background is ever produced, it drops straight in here.
   */
  eanTestimonialPortrait: {
    id: 'retrato-testimonio-ean',
    kind: 'photo',
    src: '/retrato-herbert-perico.jpg',
    poster: null,
    alt: {
      es: 'Retrato de Helbert Perico, de la Universidad EAN',
      en: 'Portrait of Helbert Perico, from EAN University',
      pt: 'Retrato de Helbert Perico, da Universidade EAN',
    },
    role: {
      es: 'Atribución del beat 5. Pone cara al testimonio que sostiene la prueba institucional.',
      en: 'Beat 5 attribution. Puts a face to the testimonial that carries the institutional proof.',
      pt: 'Atribuição do beat 5. Dá um rosto ao depoimento que sustenta a prova institucional.',
    },
    aspect: '1/1',
    availability: 'entregado',
  },

  founderPortrait: {
    id: 'retrato-fundador',
    kind: 'photo',
    src: '/retrato-bruno-ocampo.jpg',
    poster: null,
    alt: {
      es: 'Retrato de Bruno Ocampo, fundador y CEO de Voltop',
      en: 'Portrait of Bruno Ocampo, founder and CEO of Voltop',
      pt: 'Retrato de Bruno Ocampo, fundador e CEO da Voltop',
    },
    role: {
      es: 'Protagonista del beat 7, a media columna. Presenta a quien habla ANTES de la cita: es su visión, no un testimonio de cliente, así que la persona pesa tanto como sus palabras.',
      en: "Beat 7 attribution. Introduces the speaker BEFORE the quote: it's his vision, not a client testimonial.",
      pt: 'Atribuição do beat 7. Apresenta quem fala ANTES da citação: é a visão dele, não um depoimento de cliente.',
    },
    aspect: '2/3',
    availability: 'entregado',
  },

  /**
   * CHARGER RENDER · delivered 2026-09-04.
   *
   * It is the subject of beat 3's right-hand half, and the only asset in the
   * registry that is NOT a photograph of a place: it is the hardware, isolated.
   *
   * ── TWO THINGS THAT DECIDE HOW IT INTEGRATES ─────────────────────────────
   * · It comes with a TRANSPARENT BACKGROUND (RGBA PNG, alpha 0 at the edges,
   *   verified). That is why it can sit on the section's solid `canvas` with no
   *   box behind it: there is no cut-out to disguise and no background to
   *   match.
   * · It is VERTICAL, 2046×3074 (2/3). It is served with `object-contain` and
   *   not `cover`: a charger cropped at the top or the sides stops being the
   *   portrait of a machine and becomes a texture.
   *
   * The `alt` describes the unit and its connectors, which is what a screen
   * reader user needs to know about it; it does not say "render", because the
   * file format is not information for someone listening.
   */
  chargerRender: {
    id: 'render-cargador',
    kind: 'photo',
    src: '/render-cargador.png',
    poster: null,
    alt: {
      es: 'Estación de carga rápida Voltop con dos conectores, GB/T y CCS2, y pantalla de operación',
      en: 'Voltop fast-charging station with two connectors, GB/T and CCS2, and an operating screen',
      pt: 'Estação de carregamento rápido Voltop com dois conectores, GB/T e CCS2, e tela de operação',
    },
    role: {
      es: 'Sujeto de la mitad derecha del beat 3. Pone el equipo real al lado de las cifras de la red.',
      en: "Subject of beat 3's right half. Puts the real hardware next to the network figures.",
      pt: 'Sujeito da metade direita do beat 3. Coloca o equipamento real ao lado dos números da rede.',
    },
    aspect: '2/3',
    availability: 'entregado',
  },

  /**
   * BRAND FILM · delivered 2026-09-02 (`Video Home.mov`, 377 MB).
   *
   * ── IT IS NOT BACKGROUND MATERIAL, AND THAT DECIDES HOW IT INTEGRATES ────
   * It is 65 s with narration, English subtitles BURNED IN from roughly 5 s to
   * 58 s, and a logo close. It is a finished piece, not loose footage.
   *
   * That is why it ships with controls rather than as a muted looping
   * background:
   * · Muted, it loses the message, which lives in the narration.
   * · Looped, 65 s ending on a logo is not a loop: it is a film restarting.
   * · And a muted background with English subtitles contradicts the asset
   *   brief's own rule — "no burned-in text: it cannot be translated or read by
   *   assistive technology" — on a site in three languages.
   *
   * ── OUTSTANDING, AND NOT A MINOR POINT ───────────────────────────────────
   * The burned-in English subtitles look the same on `/es` and `/pt`, and they
   * are not accessible: a screen reader cannot reach them. WCAG 1.2.2 requires
   * real captions for prerecorded audio. The correct fix is a master WITHOUT
   * burned-in text plus `.vtt` tracks in the three languages. Logged in
   * `docs/05-assets-todo`.
   *
   * ── POSTER ───────────────────────────────────────────────────────────────
   * **Second 3.0**, chosen by the user: two vehicles charging in the car park,
   * with Voltop hardware and the blue light in the background. It is the frame
   * that best fits the site's dark register and the one that shows the most of
   * our own infrastructure.
   *
   * Verified free of subtitles — the first appear at ~4.2 s — and, being a
   * darker frame with less fine detail, it fits the 120 KB budget at
   * **110.8 KB**. The previous candidate (2.0 s, the vehicle on the ramp) would
   * not go below 138 KB even at quality 13.
   */
  /**
   * WAKE OPENING.
   *
   * THE SAME FILE as `voltopFilm` — it is the 1:05 piece delivered as "Video
   * Home". It is registered separately because an asset is identified by its
   * NARRATIVE FUNCTION, not by its path: here it documents one specific
   * opening, there it closes the Home page. Different `alt` and `role` because
   * they describe different things, even though the pixels are identical.
   *
   * NOTE: this means the same video appears in two places on the site. Worth
   * confirming that is intended, or delivering separate pieces.
   */
  wakeOpening: {
    id: 'apertura-wake',
    kind: 'video',
    src: '/voltop-film.mp4',
    poster: '/voltop-film-poster.jpg',
    alt: {
      es: 'Apertura de la estación Voltop en Wake, Medellín: el equipo y los cargadores entrando en operación',
      en: 'Opening of the Voltop station at Wake, Medellín: the team and the chargers entering service',
      pt: 'Abertura da estação Voltop no Wake, Medellín: a equipe e os carregadores entrando em operação',
    },
    role: {
      es: 'Registro de la apertura de Wake. Documenta un hecho concreto, no la marca en general.',
      en: 'Record of the Wake opening. Documents a specific event, not the brand at large.',
      pt: 'Registro da abertura do Wake. Documenta um fato concreto, não a marca em geral.',
    },
    duration: '1:05',
    aspect: '16/9',
    availability: 'entregado',
  },

  /* NOTHING RENDERS THIS since 2026-09-04, and the file is still in use. The
     film left beat 7 by a product decision; the same `/voltop-film.mp4` is
     served through `wakeOpening`, the cover of the Wake entry. This entry is
     kept because it documents the brand piece — its narrative function, its
     duration, its outstanding subtitles — and that information is not in
     `wakeOpening`, which describes it as material for one specific opening. */
  voltopFilm: {
    id: 'film-voltop',
    kind: 'video',
    src: '/voltop-film.mp4',
    poster: '/voltop-film-poster.jpg',
    alt: {
      es: 'Película de marca de Voltop: la red de carga en Medellín, con el equipo y las estaciones en operación',
      en: 'Voltop brand film: the charging network in Medellín, with the team and stations in service',
      pt: 'Filme institucional da Voltop: a rede de carregamento em Medellín, com a equipe e as estações em operação',
    },
    role: {
      es: 'Beat 7. Pieza que se ve, no fondo: cierra la narrativa de la Home con la visión de la compañía en voz propia.',
      en: "Beat 7. A piece to be watched, not a background: closes the Home narrative with the company's vision in its own voice.",
      pt: 'Beat 7. Peça para assistir, não fundo: fecha a narrativa da Home com a visão da empresa em sua própria voz.',
    },
    duration: '1:05',
    aspect: '16/9',
    availability: 'entregado',
  },
} satisfies Record<string, MediaAsset>

export type MediaKey = keyof typeof media
