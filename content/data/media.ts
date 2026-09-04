import type { Localized } from "@/lib/i18n/config";

/**
 * REGISTRO DE MEDIA NARRATIVA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §20, §32 y §33.
 *
 * Punto ÚNICO de conexión entre la narrativa y los archivos reales.
 * Cuando lleguen los assets, solo cambia este archivo: se rellenan `src` y
 * `poster` y todo el sitio deja de mostrar placeholders automáticamente.
 * Ningún componente referencia una ruta de archivo directamente.
 *
 * `src: null` = asset confirmado como existente pero AÚN NO ENTREGADO.
 */

export type MediaKind = "video" | "photo";

export type MediaAsset = {
  id: string;
  kind: MediaKind;
  /** Ruta del archivo final. `null` mientras no se haya recibido. */
  src: string | null;
  /**
   * Variante ligera para pantallas pequeñas.
   *
   * No es una optimización cosmética: el bucle de Medellín está codificado a
   * 2560×1440 y un teléfono de 390px no puede mostrar ni una sexta parte de
   * esos píxeles. Servirlo tal cual son 2.9 MB de datos móviles gastados en
   * resolución invisible.
   *
   * `null` = no hay variante y todos reciben la única que existe.
   */
  srcMobile?: string | null;
  /** Frame de portada — crítico para LCP y para el estado sin reproducir. */
  poster: string | null;
  /** Texto alternativo / descripción accesible. Obligatorio siempre. */
  alt: Localized;
  /** Qué hace esta pieza en la narrativa. Guía el diseño y la edición. */
  role: Localized;
  /** Duración conocida o estimada del material original. */
  duration?: string;
  /** Relación de aspecto para reservar espacio y evitar CLS. */
  /* `2/3` entró con el render del cargador: es el retrato moderado que
     faltaba entre `3/2` horizontal y `9/16`, que es formato de historia. */
  aspect: "16/9" | "4/3" | "3/2" | "2/3" | "1/1" | "21/9" | "9/16";
  /** Disponibilidad declarada del material original. */
  availability: "confirmado-no-entregado" | "a-producir" | "entregado";
};

export const media = {
  /** SIGNATURE MOMENT — prueba de capacidad de construcción. */
  /**
   * SIGNATURE MOMENT · entregado el 2026-09-01.
   *
   * ── POR QUÉ EL BUCLE NECESITÓ UN FUNDIDO ─────────────────────────────────
   * El original (`C1972.mov`, fuera del repositorio) son 27 s en HEVC Main 10
   * a 4K. Es un TRAVELLING continuo: medido, la cámara se mueve entre 3.5 y
   * 14.4 por segundo y **no se detiene en ningún momento**. Consecuencias:
   *
   * · No existe ventana que cierre. Se evaluaron todas las de 10–12 s
   *   comparando la secuencia de medio segundo alrededor de cada extremo:
   *   mejor coste 23.8 sobre 255, peor 36.7. Rango estrecho y todo alto.
   * · El fundido cruzado de cola sobre cabeza se estanca en 12.6 y produce
   *   una doble exposición: disuelve entre dos imágenes distintas.
   * · La ida y vuelta cierra numéricamente (6.4) pero **se ve mal**: el
   *   desenfoque de movimiento va al revés y el ojo lo detecta como rebobinado.
   *   Verificado por el usuario mirándolo, no por métrica.
   *
   * La solución que sí funciona en un plano que avanza: bucle RECTO con
   * entrada y salida al color del fondo (`--color-canvas`). Los dos extremos
   * llegan al mismo tono, así que no hay salto — cierre medido **3.7/255**—, y
   * bajo el velo oscuro de la sección se lee como un respiro del plano, no
   * como un efecto.
   *
   * El fundido son 0.5 s y no más: cierra igual de bien que 0.8 s (2.2) pero
   * interrumpe la mitad de tiempo.
   *
   * ── EL PÓSTER NO SALE DEL FOTOGRAMA 0 ────────────────────────────────────
   * Con la entrada fundida, el fotograma 0 es casi negro. El póster se toma
   * del CENTRO del bucle, que es lo que debe verse mientras el video carga y
   * lo que queda fijo con `prefers-reduced-motion`.
   */
  estacionMedellin: {
    id: "estacion-medellin",
    kind: "video",
    src: "/estacion-medellin-loop.mp4",
    /* 960×540 · 0.66 MB frente a 2.92 MB del máster. */
    srcMobile: "/estacion-medellin-loop-movil.mp4",
    poster: "/estacion-medellin-poster.jpg",
    alt: {
      es: "Nueva estación de carga Voltop en Medellín, vista general de la infraestructura",
      en: "New Voltop charging station in Medellín, wide view of the infrastructure",
      pt: "Nova estação de carregamento Voltop em Medellín, vista geral da infraestrutura",
    },
    role: {
      es: "Signature moment. Demuestra que Voltop construye infraestructura real, no puntos de carga.",
      en: "Signature moment. Proves Voltop builds real infrastructure, not charging points.",
      pt: "Signature moment. Prova que a Voltop constrói infraestrutura real, não pontos de carregamento.",
    },
    /** Duración del BUCLE servido, no del corte original. */
    duration: "0:11",
    aspect: "16/9",
    availability: "entregado",
  },

  /** Prueba de partnership institucional y de personas. */
  aperturaEan: {
    id: "apertura-ean",
    kind: "video",
    src: null,
    poster: null,
    alt: {
      es: "Apertura de la estación Voltop en la Universidad EAN, con directivos de la universidad y el CEO de Voltop",
      en: "Opening of the Voltop station at EAN University, with university leadership and Voltop's CEO",
      pt: "Abertura da estação Voltop na Universidade EAN, com diretores da universidade e o CEO da Voltop",
    },
    role: {
      es: "Prueba humana e institucional. Sirve simultáneamente a confianza B2B y a marca.",
      en: "Human and institutional proof. Serves both B2B trust and brand.",
      pt: "Prova humana e institucional. Serve à confiança B2B e à marca.",
    },
    duration: "2:05",
    aspect: "16/9",
    availability: "confirmado-no-entregado",
  },

  /** Prueba de propósito y liderazgo. */
  visionCeo: {
    id: "vision-ceo",
    kind: "video",
    src: null,
    poster: null,
    alt: {
      es: "Bruno Ocampo, fundador y CEO de Voltop, hablando desde una estación de carga",
      en: "Bruno Ocampo, founder and CEO of Voltop, speaking from a charging station",
      pt: "Bruno Ocampo, fundador e CEO da Voltop, falando de uma estação de carregamento",
    },
    role: {
      es: "Propósito y liderazgo. Íntimo y breve, no corporativo.",
      en: "Purpose and leadership. Intimate and brief, not corporate.",
      pt: "Propósito e liderança. Íntimo e breve, não corporativo.",
    },
    duration: "0:45",
    aspect: "16/9",
    availability: "confirmado-no-entregado",
  },

  /** Material de respiración: comunica escala sin una sola cifra. */
  infraestructuraAmplia: {
    id: "infraestructura-amplia",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Estación de carga Voltop en operación, con vehículos conectados",
      en: "Voltop charging station in operation, with vehicles plugged in",
      pt: "Estação de carregamento Voltop em operação, com veículos conectados",
    },
    role: {
      es: "Respiración y contraste. Escala física sin datos.",
      en: "Breathing room and contrast. Physical scale without data.",
      pt: "Respiro e contraste. Escala física sem dados.",
    },
    aspect: "21/9",
    availability: "confirmado-no-entregado",
  },

  espacioComercial: {
    id: "espacio-comercial",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Puntos de carga Voltop integrados en el parqueadero de un espacio comercial",
      en: "Voltop charging points integrated into a commercial space's parking area",
      pt: "Pontos de carregamento Voltop integrados ao estacionamento de um espaço comercial",
    },
    role: {
      es: "Evidencia B2B: la infraestructura dentro de un negocio real.",
      en: "B2B evidence: infrastructure inside a real business.",
      pt: "Evidência B2B: infraestrutura dentro de um negócio real.",
    },
    aspect: "4/3",
    availability: "confirmado-no-entregado",
  },

  detalleCarga: {
    id: "detalle-carga",
    kind: "photo",
    src: null,
    poster: null,
    alt: {
      es: "Detalle de un conector de carga Voltop acoplado a un vehículo eléctrico",
      en: "Close-up of a Voltop connector plugged into an electric vehicle",
      pt: "Detalhe de um conector Voltop plugado em um veículo elétrico",
    },
    role: {
      es: "Textura y precisión: el detalle físico que hace tangible la tecnología.",
      en: "Texture and precision: the physical detail that makes the technology tangible.",
      pt: "Textura e precisão: o detalhe físico que torna a tecnologia tangível.",
    },
    aspect: "3/2",
    availability: "confirmado-no-entregado",
  },

  /**
   * FOTOGRAFÍA REAL · dos assets entregados el 2026-09-01.
   *
   * ── POR QUÉ NINGUNO APUNTA AL ARCHIVO ENTREGADO ──────────────────────────
   * Los originales —`Hero.png` (60.9 MB) y `Hero_Banner.png` (50.3 MB)— superan
   * el límite del optimizador de imágenes de Next, que rechaza cualquier origen
   * por encima de **50.000.000 bytes** (`ERR_MAX_BODY_SIZE_EXCEEDED`). Por
   * encima de esa cifra la imagen NO SE RENDERIZA, y no es configurable.
   * Servirlas sin optimizar significaría mandar decenas de MB al navegador.
   *
   * Cada uno tiene su máster web derivado a 2560 px de ancho, la medida que
   * `docs/05-assets-todo` fija para composiciones a sangre, conservando el 3/2
   * exacto del original. Los originales quedan en `public/` y **deben salir del
   * repositorio**: 111 MB de binario no pertenecen a un árbol de git.
   */

  /** BEAT 1 · HERO. Vehículo conectado: la carga ocurriendo, no el equipo vacío. */
  heroVehiculoCargando: {
    id: "hero-vehiculo-cargando",
    kind: "photo",
    src: "/hero-vehiculo-cargando.jpg",
    poster: null,
    alt: {
      es: "Vehículo eléctrico conectado a un cargador Voltop en un parqueadero cubierto",
      en: "Electric vehicle plugged into a Voltop charger in a covered parking facility",
      pt: "Veículo elétrico conectado a um carregador Voltop em um estacionamento coberto",
    },
    role: {
      es: "Fondo del beat 1. Muestra el servicio en uso —el cable conectado, el equipo con marca— en lugar de infraestructura vacía. Es el elemento LCP de la Home.",
      en: "Beat 1 background. Shows the service in use — cable connected, branded hardware — rather than empty infrastructure. It is the Home's LCP element.",
      pt: "Fundo do beat 1. Mostra o serviço em uso — cabo conectado, equipamento com marca — em vez de infraestrutura vazia. É o elemento LCP da Home.",
    },
    aspect: "3/2",
    availability: "entregado",
  },

  /**
   * BEAT 2 · SIGNATURE MOMENT. Sustituye al hueco que ocupaba el video
   * `estacionMedellin`, que sigue pendiente de entrega y se conserva en este
   * registro: cuando llegue, la sección puede volver a él cambiando una línea.
   *
   * Encaja con el titular del beat —"No instalamos cargadores, construimos
   * lugares"— porque muestra varias estaciones en un espacio real, no un
   * equipo aislado.
   */
  estacionInfraestructura: {
    id: "estacion-infraestructura",
    kind: "photo",
    src: "/estacion-infraestructura.jpg",
    poster: null,
    alt: {
      es: "Estaciones de carga Voltop en operación en un parqueadero cubierto, con vehículos conectados",
      en: "Voltop charging stations in service in a covered parking facility, with vehicles plugged in",
      pt: "Estações de carregamento Voltop em operação em um estacionamento coberto, com veículos conectados",
    },
    role: {
      es: "Fondo del beat 2. Varias estaciones en un mismo espacio: la prueba de que Voltop construye lugares y no puntos sueltos.",
      en: "Beat 2 background. Several stations in one space: proof that Voltop builds places, not isolated points.",
      pt: "Fundo do beat 2. Várias estações em um mesmo espaço: a prova de que a Voltop constrói lugares e não pontos isolados.",
    },
    aspect: "3/2",
    availability: "entregado",
  },

  /**
   * CIUDADES · BEAT 3.
   *
   * Las dos tarjetas de cobertura tienen la fotografía como elemento
   * dominante: es lo que convierte "Bogotá · 2 estaciones" en un sitio real al
   * que se puede ir. Sin ella la tarjeta es una etiqueta con un número.
   *
   * ENTREGADAS el 2026-09-04, y encajaron sin retocar nada: llegaron en
   * 1672×941 y 1671×941, que es 16/9 exacto, y las dos son vistas al atardecer
   * con la franja inferior en sombra —justo donde caen el nombre y el
   * contador—. La composición no cambió una línea al ponerlas: es lo que se
   * gana declarando el hueco con su forma y su función en lugar de dejar un
   * rectángulo gris.
   */
  ciudadBogota: {
    id: "ciudad-bogota",
    kind: "photo",
    src: "/ciudad-bogota.png",
    poster: null,
    alt: {
      es: "Vista de Bogotá, ciudad donde Voltop tiene estaciones de carga en operación",
      en: "View of Bogotá, a city where Voltop has charging stations in service",
      pt: "Vista de Bogotá, cidade onde a Voltop tem estações de carregamento em operação",
    },
    role: {
      es: "Tarjeta de cobertura del beat 3. Da lugar real a la cifra de estaciones de Bogotá.",
      en: "Beat 3 coverage card. Gives a real place to Bogotá's station count.",
      pt: "Cartão de cobertura do beat 3. Dá um lugar real à contagem de estações de Bogotá.",
    },
    aspect: "16/9",
    availability: "entregado",
  },

  ciudadMedellin: {
    id: "ciudad-medellin",
    kind: "photo",
    src: "/ciudad-medellin.png",
    poster: null,
    alt: {
      es: "Vista de Medellín, ciudad donde Voltop tiene estaciones de carga en operación",
      en: "View of Medellín, a city where Voltop has charging stations in service",
      pt: "Vista de Medellín, cidade onde a Voltop tem estações de carregamento em operação",
    },
    role: {
      es: "Tarjeta de cobertura del beat 3. Da lugar real a la cifra de estaciones de Medellín.",
      en: "Beat 3 coverage card. Gives a real place to Medellín's station count.",
      pt: "Cartão de cobertura do beat 3. Dá um lugar real à contagem de estações de Medellín.",
    },
    aspect: "16/9",
    availability: "entregado",
  },

  /**
   * RETRATOS DE LAS DOS CITAS · beats 5 y 7.
   *
   * Las dos secciones de cita del sitio comparten tratamiento —ver
   * `QuoteAttribution`— y por eso comparten también forma de asset: cuadrado,
   * porque es la única proporción que funciona igual en la fila de atribución
   * del beat 5 y sobre la columna estrecha del beat 7 sin recomponer nada.
   *
   * QUÉ HACE FALTA: un retrato en 1/1, encuadre de hombros hacia arriba, con
   * la persona mirando a cámara y fondo neutro y oscuro. No fondo blanco de
   * estudio: en un sitio dark-first, un recorte claro de 96px se convierte en
   * el punto más brillante de la sección y se lleva la mirada por delante de
   * la cita, que es lo que se está intentando que se lea.
   *
   * ── LOS DOS NO COMPARTEN TAMAÑO, Y ES DELIBERADO ─────────────────────────
   * El de Helbert Perico es una MINIATURA de 96px en la fila de atribución: es
   * un testimonio, y lo que acredita es quién lo dijo. El de Bruno Ocampo
   * ocupa media columna en 2/3 vertical: es su visión, y ahí la persona pesa
   * tanto como sus palabras. Mismo tratamiento de marco —radio estructural,
   * hairline— y escalas opuestas, porque las funciones son opuestas.
   *
   * QUÉ HACE FALTA para el del fundador: retrato vertical 2/3, de medio cuerpo
   * o tres cuartos, fondo neutro y oscuro. A 458px de ancho ya no es una
   * miniatura: el fondo se ve, y un fondo claro a ese tamaño sí compite con la
   * cita que tiene al lado.
   *
   * ── EL DE HELBERT PERICO LLEGÓ EL 2026-09-04, CON DOS DESVÍOS ────────────
   * En 1/1 y 2048px, lo cual encajó sin tocar nada. Pero el encuadre es de
   * MEDIO CUERPO —sentado, con las manos sobre la mesa— y el fondo es CLARO.
   *
   * El encuadre se resuelve en `QuoteAttribution` con un reencuadre por CSS:
   * a 96px, una foto de medio cuerpo deja la cara en unos 35px y no se
   * reconoce a nadie. El zoom recorta hacia la cara sin tocar el archivo, así
   * que el día que llegue un encuadre corto basta con quitarlo.
   *
   * El fondo claro no se corrige: atenuar la cara de una persona para que
   * "encaje" con el registro oscuro es peor que el problema que arregla. Si
   * alguna vez se produce una versión con fondo oscuro, entra aquí sin más.
   */
  retratoTestimonioEan: {
    id: "retrato-testimonio-ean",
    kind: "photo",
    src: "/retrato-herbert-perico.jpg",
    poster: null,
    alt: {
      es: "Retrato de Helbert Perico, de la Universidad EAN",
      en: "Portrait of Helbert Perico, from EAN University",
      pt: "Retrato de Helbert Perico, da Universidade EAN",
    },
    role: {
      es: "Atribución del beat 5. Pone cara al testimonio que sostiene la prueba institucional.",
      en: "Beat 5 attribution. Puts a face to the testimonial that carries the institutional proof.",
      pt: "Atribuição do beat 5. Dá um rosto ao depoimento que sustenta a prova institucional.",
    },
    aspect: "1/1",
    availability: "entregado",
  },

  retratoFundador: {
    id: "retrato-fundador",
    kind: "photo",
    src: "/retrato-bruno-ocampo.jpg",
    poster: null,
    alt: {
      es: "Retrato de Bruno Ocampo, fundador y CEO de Voltop",
      en: "Portrait of Bruno Ocampo, founder and CEO of Voltop",
      pt: "Retrato de Bruno Ocampo, fundador e CEO da Voltop",
    },
    role: {
      es: "Protagonista del beat 7, a media columna. Presenta a quien habla ANTES de la cita: es su visión, no un testimonio de cliente, así que la persona pesa tanto como sus palabras.",
      en: "Beat 7 attribution. Introduces the speaker BEFORE the quote: it's his vision, not a client testimonial.",
      pt: "Atribuição do beat 7. Apresenta quem fala ANTES da citação: é a visão dele, não um depoimento de cliente.",
    },
    aspect: "2/3",
    availability: "entregado",
  },

  /**
   * RENDER DEL CARGADOR · entregado el 2026-09-04.
   *
   * Es el sujeto de la mitad derecha del beat 3, y es el único asset del
   * registro que NO es fotografía de un sitio: es el equipo, aislado.
   *
   * ── DOS COSAS QUE DECIDEN CÓMO SE INTEGRA ────────────────────────────────
   * · Viene con FONDO TRANSPARENTE (PNG RGBA, alfa 0 en los bordes,
   *   comprobado). Por eso puede ir sobre el `canvas` sólido de la sección sin
   *   ninguna caja detrás: no hay recorte que disimular ni fondo que igualar.
   * · Es VERTICAL, 2046×3074 (2/3). Se sirve con `object-contain` y no
   *   `cover`: un cargador recortado por arriba o por los lados deja de ser el
   *   retrato de un equipo y pasa a ser una textura.
   *
   * El `alt` describe el equipo y sus conectores, que es lo que un lector de
   * pantalla necesita saber de él; no dice "render" porque el formato del
   * archivo no es información para quien lo escucha.
   */
  renderCargador: {
    id: "render-cargador",
    kind: "photo",
    src: "/render-cargador.png",
    poster: null,
    alt: {
      es: "Estación de carga rápida Voltop con dos conectores, GB/T y CCS2, y pantalla de operación",
      en: "Voltop fast-charging station with two connectors, GB/T and CCS2, and an operating screen",
      pt: "Estação de carregamento rápido Voltop com dois conectores, GB/T e CCS2, e tela de operação",
    },
    role: {
      es: "Sujeto de la mitad derecha del beat 3. Pone el equipo real al lado de las cifras de la red.",
      en: "Subject of beat 3's right half. Puts the real hardware next to the network figures.",
      pt: "Sujeito da metade direita do beat 3. Coloca o equipamento real ao lado dos números da rede.",
    },
    aspect: "2/3",
    availability: "entregado",
  },

  /**
   * PELÍCULA DE MARCA · entregada el 2026-09-02 (`Video Home.mov`, 377 MB).
   *
   * ── NO ES MATERIAL DE FONDO, Y ESO DECIDE CÓMO SE INTEGRA ────────────────
   * Son 65 s con narración, subtítulos QUEMADOS en inglés de los ~5 s a los
   * ~58 s y cierre con logo. Es una pieza terminada, no metraje suelto.
   *
   * Por eso va con controles y no como fondo en bucle silenciado:
   * · Silenciada pierde el mensaje, que está en la narración.
   * · En bucle, 65 s con logo de cierre no son un bucle: son una película
   *   reiniciándose.
   * · Y un fondo silenciado con subtítulos en inglés contradice la regla del
   *   propio brief de assets —"sin texto quemado: no se puede traducir ni leer
   *   por asistencia"— sobre un sitio en tres idiomas.
   *
   * ── PENDIENTE, Y NO ES MENOR ─────────────────────────────────────────────
   * Los subtítulos quemados en inglés se ven igual en `/es` y en `/pt`, y no
   * son accesibles: un lector de pantalla no los alcanza. WCAG 1.2.2 pide
   * subtítulos reales para audio pregrabado. La solución correcta es un máster
   * SIN texto quemado más pistas `.vtt` en los tres idiomas. Registrado en
   * `docs/05-assets-todo`.
   *
   * ── PÓSTER ──────────────────────────────────────────────────────────────
   * **Segundo 3.0**, elegido por el usuario: dos vehículos cargando en el
   * parqueadero, con los equipos Voltop y la luz azul al fondo. Es el que
   * mejor encaja con el registro oscuro del sitio y el que más muestra
   * infraestructura propia.
   *
   * Verificado limpio de subtítulos —los primeros aparecen a ~4.2 s— y, al ser
   * un plano más oscuro y con menos detalle fino, entra en el presupuesto de
   * 120 KB: **110.8 KB**. El candidato anterior (2.0 s, el vehículo en la
   * rampa) no bajaba de 138 KB ni a calidad 13.
   */
  /**
   * APERTURA DE WAKE.
   *
   * MISMO ARCHIVO que `filmVoltop` — es la pieza de 1:05 que se entregó como
   * "Video Home". Se registra aparte porque un asset se identifica por su
   * FUNCIÓN NARRATIVA, no por su ruta: aquí documenta una apertura concreta y
   * allí cierra la Home. Alt y `role` distintos porque describen cosas
   * distintas, aunque los píxeles sean los mismos.
   *
   * OJO: eso significa que el mismo vídeo aparece en dos sitios del sitio.
   * Conviene confirmar que es lo que se quiere, o entregar piezas separadas.
   */
  aperturaWake: {
    id: "apertura-wake",
    kind: "video",
    src: "/voltop-film.mp4",
    poster: "/voltop-film-poster.jpg",
    alt: {
      es: "Apertura de la estación Voltop en Wake, Medellín: el equipo y los cargadores entrando en operación",
      en: "Opening of the Voltop station at Wake, Medellín: the team and the chargers entering service",
      pt: "Abertura da estação Voltop no Wake, Medellín: a equipe e os carregadores entrando em operação",
    },
    role: {
      es: "Registro de la apertura de Wake. Documenta un hecho concreto, no la marca en general.",
      en: "Record of the Wake opening. Documents a specific event, not the brand at large.",
      pt: "Registro da abertura do Wake. Documenta um fato concreto, não a marca em geral.",
    },
    duration: "1:05",
    aspect: "16/9",
    availability: "entregado",
  },

  filmVoltop: {
    id: "film-voltop",
    kind: "video",
    src: "/voltop-film.mp4",
    poster: "/voltop-film-poster.jpg",
    alt: {
      es: "Película de marca de Voltop: la red de carga en Medellín, con el equipo y las estaciones en operación",
      en: "Voltop brand film: the charging network in Medellín, with the team and stations in service",
      pt: "Filme institucional da Voltop: a rede de carregamento em Medellín, com a equipe e as estações em operação",
    },
    role: {
      es: "Beat 7. Pieza que se ve, no fondo: cierra la narrativa de la Home con la visión de la compañía en voz propia.",
      en: "Beat 7. A piece to be watched, not a background: closes the Home narrative with the company's vision in its own voice.",
      pt: "Beat 7. Peça para assistir, não fundo: fecha a narrativa da Home com a visão da empresa em sua própria voz.",
    },
    duration: "1:05",
    aspect: "16/9",
    availability: "entregado",
  },
} satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;
