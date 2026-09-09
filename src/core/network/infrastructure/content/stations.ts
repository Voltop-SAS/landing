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
    openingHours: 'Mo-Su 00:00-23:59',
    /* Confirmed by Camilo on 2026-09-08. All three stations share the tariff;
       the field stays PER STATION on purpose, because the note beside it says it
       can vary, and the day one of them differs it changes here without touching
       the component. */
    pricing: { perKwh: 1780, currency: 'COP' },
    /* The same two at all three stations since 2026-09-08, by product decision.
       They used to be different lists per site — the EAN had a roof and a
       cafeteria, the Grand Hyatt valet and a restaurant, and Wake had none at
       all, so its page did not even render the section. Now all three say the
       same thing and all three render it.

       What is lost: each place's own amenities stop being told. If they are
       ever wanted back, each station gets its list again and the component
       already renders them without touching anything. */
    services: [
      { es: 'WiFi', en: 'Wi-Fi', pt: 'Wi-Fi' },
      { es: 'Baños', en: 'Restrooms', pt: 'Banheiros' },
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
    openingHours: 'Mo-Su 00:00-23:59',
    /* Confirmed by Camilo on 2026-09-08. All three stations share the tariff;
       the field stays PER STATION on purpose, because the note beside it says it
       can vary, and the day one of them differs it changes here without touching
       the component. */
    pricing: { perKwh: 1780, currency: 'COP' },
    services: [
      { es: 'WiFi', en: 'Wi-Fi', pt: 'Wi-Fi' },
      { es: 'Baños', en: 'Restrooms', pt: 'Banheiros' },
    ],
    media: {
      /**
       * DELIVERED 2026-09-08. Grand Hyatt was the last station showing its
       * declared hole; the page needed no changes, it already read
       * `media.photos[0]` and fell back to the hole when the array was empty.
       * Populating the dataset was enough — which is exactly what that branch
       * was written for.
       *
       * The master arrived at 6038×4025 and 21.7 MB and lives in
       * `~/Voltop-masters-originales/`, outside the repository. Converted with
       * `sharp` to 2560px and JPEG q82: 530 KB.
       *
       * 2560 and not the 2400 of Wake and the EAN: this band declares
       * `sizes="(min-width: 1280px) 1240px, 100vw"`, so at DPR 2 the declared
       * box asks for 2480px and 2400 would leave it at 0.97× — serving less
       * image than the box and stretching it.
       *
       * ⚠️ A PERSON APPEARS IN THE FRAME, in profile, starting the charge. §
       * media asks for the permissions of people who appear in the material.
       * The photograph came from Voltop, of its own installation, so the
       * permission is presumed — but it is NOT verified here.
       */
      photos: [
        {
          src: '/estacion-grand-hyatt.jpg',
          alt: {
            es: 'Tres cargadores Voltop en el parqueadero cubierto del Grand Hyatt, con un vehículo eléctrico conectado y una persona iniciando la carga',
            en: 'Three Voltop chargers in the Grand Hyatt covered parking area, with an electric vehicle plugged in and a person starting the charge',
            pt: 'Três carregadores Voltop no estacionamento coberto do Grand Hyatt, com um veículo elétrico conectado e uma pessoa iniciando a carga',
          },
        },
      ],
    },
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
    /* Not fixed: the station publishes them in the app, so nothing is declared
       here rather than inventing a schedule. */
    openingHours: null,
    /* Confirmed by Camilo on 2026-09-08. All three stations share the tariff;
       the field stays PER STATION on purpose, because the note beside it says it
       can vary, and the day one of them differs it changes here without touching
       the component. */
    pricing: { perKwh: 1780, currency: 'COP' },
    services: [
      { es: 'WiFi', en: 'Wi-Fi', pt: 'Wi-Fi' },
      { es: 'Baños', en: 'Restrooms', pt: 'Banheiros' },
    ],
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
