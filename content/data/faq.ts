import type { Localized } from "@/lib/i18n/config";
import { routes } from "@/lib/i18n/routes";

/**
 * COLECCIÓN · Preguntas frecuentes
 * Ver docs/MASTER-PROJECT-DEFINITION.md §19 (un titular es un contrato) y §33.
 *
 * ── CRITERIO DE SELECCIÓN ─────────────────────────────────────────────────
 * Cinco preguntas, y las cinco cumplen dos condiciones a la vez: son lo que un
 * conductor pregunta de verdad ANTES de ir a cargar, y **se pueden responder
 * con datos que ya tenemos**. Una pregunta frecuente que se responde con una
 * aproximación es peor que no ponerla: convierte el FAQ en un sitio donde no
 * se puede confiar.
 *
 * ── LA PREGUNTA QUE FALTA, Y POR QUÉ ──────────────────────────────────────
 * "¿Cuánto cuesta cargar?" es, con diferencia, la más buscada de la categoría.
 * NO ESTÁ, y no por olvido: las tarifas no están confirmadas comercialmente
 * —`pricing: null` en todo el dataset— y la decisión de publicarlas sigue
 * abierta (O5). Responderla con un rango inventado rompería §33 en el sitio
 * exacto donde el usuario viene a fiarse de nosotros.
 *
 * Es la primera que hay que añadir en cuanto exista la decisión.
 */

export type FaqItem = {
  id: string;
  question: Localized;
  answer: Localized;
  /** Enlace de salida cuando la respuesta continúa en otra parte del sitio. */
  link?: { label: Localized; href: string };
};

export const faq: FaqItem[] = [
  {
    id: "como-cargar",
    question: {
      es: "¿Cómo cargo en una estación Voltop?",
      en: "How do I charge at a Voltop station?",
      pt: "Como carrego em uma estação Voltop?",
    },
    answer: {
      es: "Conectas el cable a tu vehículo y empiezas la carga desde la app. No necesitas tarjeta ni membresía, y no hay que registrarse antes de llegar.",
      en: "Plug the cable into your vehicle and start the session from the app. No card or membership needed, and no sign-up before you arrive.",
      pt: "Conecte o cabo ao seu veículo e inicie o carregamento pelo aplicativo. Não precisa de cartão nem assinatura, e não é necessário se cadastrar antes de chegar.",
    },
    link: {
      label: { es: "Ver los tres pasos", en: "See the three steps", pt: "Ver os três passos" },
      href: `${routes.red}#como-cargar`,
    },
  },
  {
    id: "compatibilidad",
    question: {
      es: "¿Mi vehículo es compatible?",
      en: "Is my vehicle compatible?",
      pt: "Meu veículo é compatível?",
    },
    answer: {
      es: "La red tiene conectores CCS1, CCS2 y GB-T, que cubren la mayoría de los vehículos eléctricos que circulan en Colombia. Cada estación indica cuáles tiene: revísalo antes de salir si tu conector es menos común.",
      en: "The network has CCS1, CCS2 and GB-T connectors, covering most electric vehicles on Colombian roads. Each station lists which ones it has — check before you set off if yours is less common.",
      pt: "A rede tem conectores CCS1, CCS2 e GB-T, que cobrem a maioria dos veículos elétricos que circulam na Colômbia. Cada estação indica quais possui: confira antes de sair se o seu conector for menos comum.",
    },
    link: {
      label: { es: "Ver estaciones y conectores", en: "See stations and connectors", pt: "Ver estações e conectores" },
      href: routes.red,
    },
  },
  {
    id: "duracion",
    question: {
      es: "¿Cuánto tarda una carga?",
      en: "How long does a charge take?",
      pt: "Quanto tempo leva um carregamento?",
    },
    answer: {
      es: "Depende de dos cosas: la potencia de la estación y la que acepta tu vehículo. En la red hay puntos de 60 a 150 kW, y el tiempo real lo marca el menor de los dos. Cada ficha de estación indica su potencia máxima.",
      en: "It depends on two things: the station's power and what your vehicle accepts. The network has points from 60 to 150 kW, and the real time is set by the lower of the two. Each station page lists its maximum power.",
      pt: "Depende de duas coisas: a potência da estação e a que o seu veículo aceita. A rede tem pontos de 60 a 150 kW, e o tempo real é definido pelo menor dos dois. Cada ficha de estação indica sua potência máxima.",
    },
  },
  {
    id: "donde",
    question: {
      es: "¿Dónde hay estaciones Voltop?",
      en: "Where are Voltop stations?",
      pt: "Onde ficam as estações Voltop?",
    },
    answer: {
      es: "Hoy en Bogotá y Medellín, en lugares donde ya te detienes: universidades, hoteles, centros comerciales y corredores de salida. La red crece por corredores y ciudades, y las próximas aperturas se publican en Novedades.",
      en: "Today in Bogotá and Medellín, in places where you already stop: universities, hotels, shopping centres and exit corridors. The network grows by corridors and cities, and upcoming openings are published in the newsroom.",
      pt: "Hoje em Bogotá e Medellín, em lugares onde você já para: universidades, hotéis, shoppings e corredores de saída. A rede cresce por corredores e cidades, e as próximas aberturas são publicadas em Novidades.",
    },
    link: {
      label: { es: "Ver cobertura por ciudad", en: "See coverage by city", pt: "Ver cobertura por cidade" },
      href: `${routes.red}#ciudades`,
    },
  },
  {
    id: "mi-espacio",
    question: {
      es: "¿Puedo tener una estación en mi espacio?",
      en: "Can I have a station at my site?",
      pt: "Posso ter uma estação no meu espaço?",
    },
    answer: {
      es: "Sí. Instalamos, operamos y mantenemos la infraestructura en hoteles, centros comerciales, parqueaderos, campus y sedes corporativas. Tú no operas nada: nosotros nos encargamos de que funcione todos los días.",
      en: "Yes. We install, operate and maintain the infrastructure at hotels, shopping centres, parking facilities, campuses and corporate sites. You operate nothing — we make sure it works every single day.",
      pt: "Sim. Instalamos, operamos e mantemos a infraestrutura em hotéis, shoppings, estacionamentos, campi e sedes corporativas. Você não opera nada: nós garantimos que funcione todos os dias.",
    },
    link: {
      label: { es: "Hablar con el equipo", en: "Talk to the team", pt: "Falar com o time" },
      href: `${routes.empresas}#contacto`,
    },
  },
];
