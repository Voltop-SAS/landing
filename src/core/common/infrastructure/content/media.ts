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
    poster: '/estacion-medellin-poster.webp',
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
  /**
   * Delivered 2026-09-08. Camilo sent a first cut of 2:21 and then replaced it
   * with `Video_Ean_Final.MOV` (1:11) because the first one was too long; that
   * shorter cut is the one served. Both masters live in
   * `~/Voltop-masters-originales/`, outside the repository.
   *
   * Encoded from HEVC 1920×1080 to H.264 CRF 27 (20 MB) plus a 960-wide mobile
   * variant at CRF 30 (5.3 MB). The piece HAS AUDIO and is the one that plays
   * with controls in the news entry.
   *
   * It is also the background of the home page's beat 5, under a 78% veil and
   * muted: there it is texture, not a piece to watch. `VideoMedia` only loads it
   * once it is in view, so those 20 MB never touch the initial load.
   */
  eanOpening: {
    id: 'apertura-ean',
    kind: 'video',
    src: '/apertura-ean.mp4',
    srcMobile: '/apertura-ean-movil.mp4',
    poster: '/apertura-ean-poster.jpg',
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
    duration: '1:11',
    aspect: '16/9',
    availability: 'entregado',
  },

  /** Proof of purpose and leadership. */
  /**
   * DELIVERED 2026-09-08 as `Video_Nosotros.mov`, HEVC 1920×1080 with audio,
   * 28 s and 39 MB. Served as H.264 CRF 26 (7.0 MB) plus a 960-wide variant at
   * CRF 29 (1.7 MB). The master lives in `~/Voltop-masters-originales/`.
   *
   * ── IT IS WATCHED, SO IT GOT CONTROLS ────────────────────────────────────
   * The slot rendered it as a BACKGROUND: muted, looping, no controls. That was
   * fine while it was a hole and wrong the moment the material arrived — this
   * is the founder talking to camera. Muted and on an endless loop you would
   * watch him speak and never hear a word.
   *
   * So `/nosotros` now passes `controls`, which is the same rule the news entry
   * already applies and the one written on the prop itself: a background is
   * looked at without meaning to, a narrated piece is watched by choice.
   *
   * ── THE SUBTITLES ARE BURNED IN, AND IN ENGLISH ──────────────────────────
   * Checked frame by frame: there is text on screen in practically every
   * second, so there is no clean frame for the poster either. On `/es` and
   * `/pt` the subtitle is in the wrong language, and nobody can turn it off.
   * It is the same debt already open for the film — the master without burned
   * subtitles plus three `.vtt` — and it now affects a second piece.
   */
  ceoVision: {
    id: 'vision-ceo',
    kind: 'video',
    src: '/vision-ceo.mp4',
    srcMobile: '/vision-ceo-movil.mp4',
    poster: '/vision-ceo-poster.webp',
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
    duration: '0:28',
    aspect: '16/9',
    availability: 'entregado',
  },

  /**
   * Breathing material on /nosotros, between the story and how we build.
   *
   * DELIVERED 2026-09-08 as `Foto_nosotros.png`, 7008×4672 and 38 MB — a master,
   * not a web asset. Same recipe as `retailSpace`: JPEG q82 at 3200px wide,
   * 722 KB. The master lives in `~/Voltop-masters-originales/`.
   *
   * ── IT USED TO BE CALLED `wideInfrastructure` ────────────────────────────
   * The slot it fills has not changed —a breath between two blocks of text—
   * but what is IN it has: the placeholder announced a station with vehicles
   * plugged in, and what arrived is a handshake. Keeping the old name would
   * have left the catalogue describing a photograph that does not exist, and
   * the `alt` lying to whoever cannot see it.
   *
   * The 3:2 frame is centre-cropped to 21/9 by the layout. Checked on the
   * actual crop: both faces, the handshake and the wall stay in frame.
   */
  allianceWake: {
    id: 'alianza-wake',
    kind: 'photo',
    src: '/alianza-wake.webp',
    poster: null,
    alt: {
      es: 'Dos personas se dan la mano frente al muro de Wake, en Medellín, donde Voltop opera una estación de carga',
      en: 'Two people shaking hands in front of the Wake wall in Medellín, where Voltop runs a charging station',
      pt: 'Duas pessoas apertando as mãos diante do muro do Wake, em Medellín, onde a Voltop opera uma estação de carregamento',
    },
    role: {
      es: 'Respiración y contraste. Una red se construye con quien aloja cada estación, y eso se ve mejor en un acuerdo que en una cifra.',
      en: 'Breathing room and contrast. A network is built with whoever hosts each station, and that reads better in an agreement than in a figure.',
      pt: 'Respiro e contraste. Uma rede se constrói com quem hospeda cada estação, e isso se lê melhor em um acordo do que em um número.',
    },
    aspect: '21/9',
    availability: 'entregado',
  },

  retailSpace: {
    id: 'espacio-comercial',
    kind: 'photo',
    /**
     * DELIVERED 2026-09-08. It arrived at 6180×4120 and 18.5 MB — a master, not
     * a web asset. Converted with `sharp` to JPEG q82 at **3200px wide**: 678 KB,
     * 96% less. The master lives in `~/Voltop-masters-originales/`, outside the
     * repository, as the project convention requires: 18.5 MB in the git tree
     * are permanent.
     *
     * 3200 and not the 2400 the station photos use, and it was measured: this
     * band is `width="wide"` and declares `sizes="(min-width: 1600px) 1600px,
     * 100vw"`, so at DPR 2 the largest box asks for exactly 3200px. The first
     * conversion went to 2400 and left it at 0.89× — the browser would serve
     * less image than the box and stretch it, the same defect that showed up in
     * Helbert's portrait and in the city cards.
     */
    src: '/espacio-comercial.webp',
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
    /**
     * `4/3` is what this hole was DECLARED with, and /empresas overrides it to
     * `21/9`. The override stays: that band under the hero is the page's
     * composition and the photograph came to fill it, not the other way round.
     * The figure is left here because it is the ratio in which the asset was
     * requested, and whoever uses it somewhere else should know that.
     */
    aspect: '4/3',
    availability: 'entregado',
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
    src: '/hero-vehiculo-cargando.webp',
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
    src: '/estacion-infraestructura.webp',
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
    src: '/ciudad-bogota.webp',
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
    src: '/ciudad-medellin.webp',
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
    src: '/retrato-helbert-perico.webp',
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
    src: '/retrato-bruno-ocampo.webp',
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
    src: '/render-cargador.webp',
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
