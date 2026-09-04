/**
 * La estación como entidad: qué es, en qué estado puede estar y cómo se
 * expresa su potencia. `formatPowerKw` vive aquí y no con el dataset porque
 * es una función pura sobre la entidad —sin dependencias— y la consumen tres
 * ficheros de presentación, que así siguen tocando solo dominio.
 */

import type { Localized } from '~/core/common/domain/i18n/config'

export type Connector = 'CCS1' | 'CCS2' | 'GB/T' | 'Type2'
export type StationStatus = 'operativa' | 'proxima' | 'mantenimiento'

export type StationMedia = {
  /** Fotografías de la estación. Vacío = pendiente de recibir. */
  photos: { src: string; alt: Localized }[]
  /** Video propio de la estación, si existe. */
  video?: { src: string; poster: string; duration: string; caption: Localized }
}

export type Station = {
  slug: string
  /** Nombre propio: no se traduce. */
  name: string
  /** Referencia al slug de una ciudad. Nunca texto libre. */
  citySlug: string
  address: Localized
  /** Coordenadas. `null` hasta recibirlas: no se inventan. */
  geo: { lat: number; lng: number } | null
  connectors: Connector[]
  /**
   * Potencia en kW. Es un RANGO porque una estación puede tener cargadores de
   * distinta potencia —la EAN va de 22 a 80— y publicar solo el máximo diría
   * que todos los puntos cargan a 80, que es exactamente el tipo de promesa
   * que §19 no admite. Cuando todos los puntos son iguales, `min === max`.
   */
  powerKw: { min: number; max: number }
  points: number
  status: StationStatus
  hours: Localized
  /** Tarifas. `null` mientras no estén confirmadas comercialmente. */
  pricing: { perKwh: number; currency: string } | null
  services: Localized[]
  media: StationMedia
  /** Curaduría: aparece en previews y destacados. */
  featured?: boolean
  /** Trazabilidad del dato. Nada se presenta como verificado si no lo está. */
  dataStatus: 'placeholder' | 'verified'
}

/**
 * LAS TRES ESTACIONES REALES.
 *
 * Datos entregados por Camilo el 2026-09-02. Antes había CUATRO, dos de ellas
 * —San Fernando Plaza y Corredor Norte— que no existen, y potencias que no se
 * correspondían con la operación (60, 120 y 150 kW frente a los 22–80 reales).
 * El sitio estaba afirmando una red mayor y más potente de la que hay.
 *
 * Se retiraron también las dos entradas de novedades que las anunciaban: una
 * apertura publicada de una estación inexistente es peor que no tener registro.
 */
/**
 * Formato de potencia. Existe para que "22–80 kW" se escriba UNA vez: seis
 * componentes la pintan y con seis plantillas distintas acabarían divergiendo.
 * Cuando todos los puntos son iguales muestra una sola cifra, porque "30–30 kW"
 * no informa, confunde.
 */
export function formatPowerKw(p: { min: number; max: number }): string {
  return p.min === p.max ? `${p.max} kW` : `${p.min}–${p.max} kW`
}
