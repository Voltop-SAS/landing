/**
 * CORE COLLECTION · Stations
 * See docs/MASTER-PROJECT-DEFINITION.md §27.
 *
 * Adding a station = adding a record. It never requires a redesign or code.
 *
 * ⚠️ SAMPLE DATASET. The locations correspond to real Voltop stations, but the
 * specifications are not verified and the coordinates have not been received.
 * `dataStatus` declares this explicitly, record by record.
 * Project rule: data is never made up.
 *
 * ── THE THREE REAL STATIONS ───────────────────────────────────────────────
 * Data delivered by Camilo on 2026-09-02. There used to be FOUR, two of them
 * —San Fernando Plaza and Corredor Norte— that do not exist, plus power
 * ratings that did not match the operation (60, 120 and 150 kW against the
 * real 22–80). The site was claiming a larger and more powerful network than
 * the one that exists.
 *
 * The two news entries announcing them were withdrawn as well: a published
 * opening for a station that does not exist is worse than having no log.
 */

import type { Station } from '~/core/network/domain/entities/Station'

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
    /* Taken from the Google Maps links delivered on 2026-09-02, not
       transcribed by eye off a map. */
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
