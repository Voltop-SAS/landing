export type LegalBlock = { tipo: 'parrafo'; texto: string } | { tipo: 'lista'; items: string[] }

export type LegalSection = {
  /** Ancla estable: la usa el índice de contenidos. */
  id: string
  heading: string
  body: LegalBlock[]
}

export type LegalDoc = {
  titulo: string
  /** Fecha tal cual la emitió el área legal. */
  actualizado: string
  /** ISO, para `<time dateTime>` y para el sitemap. */
  actualizadoISO: string
  secciones: LegalSection[]
}

/** TÉRMINOS Y CONDICIONES DE USO PLATAFORMA, APLICACIÓN, SITIO WEB Y ESTACIONES DE CARGA VOLTOP */
