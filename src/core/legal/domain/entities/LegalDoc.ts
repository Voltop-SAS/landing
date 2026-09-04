export type LegalBlock = { tipo: 'parrafo'; texto: string } | { tipo: 'lista'; items: string[] }

export type LegalSection = {
  /** Stable anchor: the table of contents uses it. */
  id: string
  heading: string
  body: LegalBlock[]
}

export type LegalDoc = {
  titulo: string
  /** The date exactly as the legal team issued it. */
  actualizado: string
  /** ISO, for `<time dateTime>` and for the sitemap. */
  actualizadoISO: string
  secciones: LegalSection[]
}
