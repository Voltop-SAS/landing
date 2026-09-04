import type { Localized } from '../i18n/config'

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

export type MediaKind = 'video' | 'photo'

export type MediaAsset = {
  id: string
  kind: MediaKind
  /** Ruta del archivo final. `null` mientras no se haya recibido. */
  src: string | null
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
  srcMobile?: string | null
  /** Frame de portada — crítico para LCP y para el estado sin reproducir. */
  poster: string | null
  /** Texto alternativo / descripción accesible. Obligatorio siempre. */
  alt: Localized
  /** Qué hace esta pieza en la narrativa. Guía el diseño y la edición. */
  role: Localized
  /** Duración conocida o estimada del material original. */
  duration?: string
  /** Relación de aspecto para reservar espacio y evitar CLS. */
  /* `2/3` entró con el render del cargador: es el retrato moderado que
     faltaba entre `3/2` horizontal y `9/16`, que es formato de historia. */
  aspect: '16/9' | '4/3' | '3/2' | '2/3' | '1/1' | '21/9' | '9/16'
  /** Disponibilidad declarada del material original. */
  availability: 'confirmado-no-entregado' | 'a-producir' | 'entregado'
}
