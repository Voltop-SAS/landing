/**
 * COLECCIÓN CENTRAL · Estaciones
 * Ver docs/MASTER-PROJECT-DEFINITION.md §27.
 *
 * Añadir una estación = añadir un registro. Nunca requiere rediseño ni código.
 *
 * ⚠️ DATASET DE EJEMPLO. Las ubicaciones corresponden a estaciones reales de
 * Voltop, pero las especificaciones no están verificadas y las coordenadas no
 * se han recibido. `dataStatus` lo declara explícitamente por registro.
 * Regla del proyecto: no se inventan datos.
 */

import type { Station } from '~/core/red/domain/entities/Station'

export const stations: Station[] = [
  {
    slug: 'universidad-ean',
    name: 'Universidad EAN',
    citySlug: 'bogota',
    address: {
      es: 'Calle 79 #11-45, Bogotá',
      en: 'Calle 79 #11-45, Bogotá',
      pt: 'Calle 79 #11-45, Bogotá',
    },
    /* Extraídas de los enlaces de Google Maps entregados el 2026-09-02, no
       transcritas a ojo desde un mapa. */
    geo: { lat: 4.6631495, lng: -74.0599846 },
    connectors: ['GB/T', 'CCS1', 'CCS2'],
    powerKw: { min: 22, max: 80 },
    points: 18,
    status: 'operativa',
    hours: { es: 'Abierto 24/7', en: 'Open 24/7', pt: 'Aberto 24/7' },
    pricing: null,
    services: [
      { es: 'Techo', en: 'Covered', pt: 'Coberto' },
      { es: 'Cafetería', en: 'Café', pt: 'Café' },
      { es: 'Baños', en: 'Restrooms', pt: 'Banheiros' },
      { es: 'Wifi', en: 'Wi-Fi', pt: 'Wi-Fi' },
    ],
    media: {
      photos: [
        {
          src: '/estacion-universidad-ean.jpg',
          alt: {
            es: 'Estación de carga Voltop en la Universidad EAN, con varios puntos de carga en operación',
            en: 'Voltop charging station at EAN University, with several charge points in service',
            pt: 'Estação de carregamento Voltop na Universidade EAN, com vários pontos de carga em operação',
          },
        },
      ],
    },
    featured: true,
    dataStatus: 'verified',
  },
  {
    slug: 'grand-hyatt',
    name: 'Grand Hyatt',
    citySlug: 'bogota',
    address: {
      es: 'Calle 24A #57-60, Bogotá',
      en: 'Calle 24A #57-60, Bogotá',
      pt: 'Calle 24A #57-60, Bogotá',
    },
    geo: { lat: 4.6440714, lng: -74.1026313 },
    connectors: ['GB/T'],
    powerKw: { min: 30, max: 30 },
    points: 11,
    status: 'operativa',
    hours: { es: 'Abierto 24/7', en: 'Open 24/7', pt: 'Aberto 24/7' },
    pricing: null,
    services: [
      { es: 'Valet', en: 'Valet', pt: 'Manobrista' },
      { es: 'Restaurante', en: 'Restaurant', pt: 'Restaurante' },
      { es: 'Parqueadero cubierto', en: 'Covered parking', pt: 'Estacionamento coberto' },
    ],
    media: { photos: [] },
    featured: true,
    dataStatus: 'verified',
  },
  {
    slug: 'wake',
    name: 'Wake',
    citySlug: 'medellin',
    address: {
      es: 'Cra. 35 #10b-66, El Poblado, Medellín',
      en: 'Cra. 35 #10b-66, El Poblado, Medellín',
      pt: 'Cra. 35 #10b-66, El Poblado, Medellín',
    },
    geo: { lat: 6.2096216, lng: -75.5756009 },
    connectors: ['GB/T', 'CCS2'],
    powerKw: { min: 80, max: 80 },
    points: 6,
    status: 'operativa',
    hours: { es: 'Consultar en la app', en: 'Check in the app', pt: 'Consulte no aplicativo' },
    pricing: null,
    services: [],
    media: {
      photos: [
        {
          src: '/estacion-wake.jpg',
          alt: {
            es: 'Estación de carga rápida Voltop en Wake, Medellín, con seis puntos de carga de 80 kW',
            en: 'Voltop fast-charging station at Wake, Medellín, with six 80 kW charge points',
            pt: 'Estação de carregamento rápido Voltop no Wake, Medellín, com seis pontos de carga de 80 kW',
          },
        },
      ],
    },
    featured: true,
    dataStatus: 'verified',
  },
]
